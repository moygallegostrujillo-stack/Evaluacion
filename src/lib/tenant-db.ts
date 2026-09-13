/**
 * PHASE 3.5-D.2 — Tenant DB Access Layer
 *
 * This module provides a single entry point for tenant-scoped DB access
 * that wraps queries in a Prisma interactive transaction with
 * SET LOCAL app.current_company_id.
 *
 * Architecture:
 *   Browser → JWT → auth → getTenantContext(auth) → withTenantTransaction(ctx, tx => ...)
 *     ↓ inside transaction:
 *     SET LOCAL app.current_company_id = ctx.companyId
 *     (NO app.is_super_admin — eliminated from architecture)
 *     Prisma queries via tx (TransactionClient)
 *     App-level ownership checks remain as Layer 1
 *
 * IMPORTANT:
 * - This does NOT activate PostgreSQL RLS (that requires evalhr_app role + FORCE RLS).
 * - This prepares the application layer so that when RLS IS activated,
 *   the context will already be set correctly.
 * - SET LOCAL only works on PostgreSQL. On SQLite (dev, DATABASE_URL=file:...),
 *   the SET LOCAL error is swallowed ONLY when: (a) the datasource is SQLite,
 *   AND (b) NODE_ENV !== 'production'. Every other failure re-throws and
 *   aborts the transaction (FAIL-CLOSED). In production, a SET LOCAL failure
 *   ALWAYS aborts — the operation never continues without DB tenant context.
 */

import { Prisma } from '@prisma/client'
import { db } from './db'

// ============================================
// TENANT CONTEXT
// ============================================

export type TenantMode = 'NORMAL' | 'SA_IMPERSONATION'

export interface TenantContext {
  /** The user ID making the request (from JWT) */
  actorId: string
  /** The user role (from JWT) */
  actorRole: string
  /** The company ID to scope queries to (from JWT or resolved target) */
  companyId: string
  /** Whether this is an impersonation (SA operating on another company) */
  mode: TenantMode
}

/**
 * Create a TenantContext from authenticated headers.
 *
 * The context is derived ONLY from the JWT (via auth headers),
 * never from the request body or query params.
 *
 * For SUPER_ADMIN with a target companyId:
 *   Use createTenantContextForImpersonation() instead.
 */
/**
 * Validate and normalize a companyId coming from a trusted source (JWT / resolved target).
 * Rejects: undefined, null, empty string, whitespace-only, non-string values.
 */
function assertValidCompanyId(companyId: unknown, source: string): string {
  if (typeof companyId !== 'string') {
    throw new Error(`TenantContext error: companyId must be a string (${source})`)
  }
  const trimmed = companyId.trim()
  if (!trimmed) {
    throw new Error(`TenantContext error: companyId is required and cannot be empty (${source})`)
  }
  return trimmed
}

export function createTenantContext(auth: {
  userId: string
  role: string
  companyId?: string
}): TenantContext {
  const companyId = assertValidCompanyId(
    auth.companyId,
    `actor=${auth.userId}, role=${auth.role}`
  )

  return {
    actorId: auth.userId,
    actorRole: auth.role,
    companyId,
    mode: 'NORMAL',
  }
}

/**
 * Create a TenantContext for SA impersonation.
 * The targetCompanyId must be resolved by the caller (via resolveTargetCompanyId).
 */
export function createTenantContextForImpersonation(
  auth: {
    userId: string
    role: string
    companyId?: string
  },
  targetCompanyId: string
): TenantContext {
  const target = assertValidCompanyId(
    targetCompanyId,
    `impersonation by actor=${auth.userId}`
  )

  return {
    actorId: auth.userId,
    actorRole: auth.role,
    companyId: target,
    mode: 'SA_IMPERSONATION',
  }
}

// ============================================
// TENANT TRANSACTION
// ============================================

/**
 * Execute a callback within a tenant-scoped database transaction.
 *
 * This function:
 * 1. Opens a Prisma interactive transaction
 * 2. Sets app.current_company_id via SET LOCAL (transaction-scoped)
 * 3. Does NOT set app.is_super_admin (eliminated from architecture)
 * 4. Executes the callback with the transaction client
 * 5. Auto-commits on success, auto-rollback on error
 *
 * Usage:
 *   const ctx = createTenantContext(auth)
 *   const results = await withTenantTransaction(ctx, async (tx) => {
 *     return tx.position.findMany({ where: { active: true } })
 *   })
 *
 * For SA impersonation:
 *   const ctx = createTenantContextForImpersonation(auth, targetCompanyId)
 *   const results = await withTenantTransaction(ctx, async (tx) => { ... })
 *
 * IMPORTANT: This does NOT set app.is_super_admin. The context is
 * purely tenant-scoped. SA aggregate will use a separate connection/role.
 */
export async function withTenantTransaction<T>(
  context: TenantContext,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  // Defense-in-depth: the context itself is validated again here, so a
  // hand-constructed TenantContext cannot bypass companyId validation.
  assertValidCompanyId(context.companyId, 'withTenantTransaction')

  // PHASE 3.5-D.3: tenant transactions may legitimately carry bulk work
  // (e.g., template + question generation on position creation ≈ 50 writes).
  // The Prisma default (5s timeout / 2s maxWait) is too tight for that —
  // especially on SQLite dev — so the limits are raised here. Long-running
  // work belongs inside the tenant transaction (RLS requires it), so the
  // budget follows the work, not the other way around.
  return db.$transaction(
    async (tx) => {
    // Set the tenant context via SET LOCAL (transaction-scoped).
    // This is safe with PgBouncer transaction pooling because
    // SET LOCAL variables are reset on COMMIT/ROLLBACK.
    //
    // Uses parameterized query to prevent SQL injection.
    //
    // FAIL-CLOSED BEHAVIOR: see the catch block below — the error is
    // swallowed ONLY for a SQLite datasource outside production; every
    // other failure re-throws and rolls back the transaction.
    try {
      // Fase 3.5-E (PARTE 22) — CRITICAL FIX: `SET LOCAL x = $1` cannot be
      // sent as a prepared statement (utility statements reject bind
      // parameters — PostgreSQL 42601 "syntax error at or near \"$1\"").
      // Every tenant transaction would have failed under PostgreSQL.
      // The context is now set with set_config(..., is_local := true),
      // which IS parameterizable and is transaction-scoped exactly like
      // SET LOCAL (reset on COMMIT/ROLLBACK → PgBouncer-safe). The value
      // returned by set_config is VERIFIED — any mismatch aborts the
      // transaction (fail-closed).
      const applied = await tx.$queryRaw<Array<{ set_config: string }>>(
        Prisma.sql`SELECT set_config('app.current_company_id', ${context.companyId}, true)`
      )
      if (applied[0]?.set_config !== context.companyId) {
        throw new Error(
          `Tenant context mismatch: set_config returned '${applied[0]?.set_config}' but expected '${context.companyId}'`
        )
      }
    } catch (err) {
      // FAIL-CLOSED POLICY (Phase 3.5-D.2.1/D.2.2):
      //
      // The error is swallowed ONLY when ALL of the following hold:
      //   1. The configured datasource is SQLite (DATABASE_URL starts with
      //      'file:' — SET LOCAL is not a SQLite statement), AND
      //   2. NODE_ENV !== 'production'.
      //
      // In every other case — including ANY failure against PostgreSQL in
      // production — the error is re-thrown so the interactive transaction
      // ROLLS BACK. We never continue an operation without DB tenant context.
      const datasource = process.env.DATABASE_URL || ''
      const isSqliteDatasource =
        datasource.startsWith('file:') || datasource.startsWith('sqlite:')
      const isDev = process.env.NODE_ENV !== 'production'

      if (isSqliteDatasource && isDev) {
        // SQLite dev — SET LOCAL unsupported; app-level ownership checks
        // (explicit companyId in WHERE) provide isolation in dev.
      } else {
        // Production (PostgreSQL): SET LOCAL failure is security-critical.
        // Re-throw to trigger full transaction rollback — fail closed.
        console.error(
          `[SECURITY] withTenantTransaction: SET LOCAL failed for company=${context.companyId}. Aborting transaction.`,
          err
        )
        throw err
      }
    }

    // NOTE: We do NOT set app.is_super_admin.
    // The new architecture eliminates app.is_super_admin as a bypass mechanism.

    return callback(tx)
    },
    {
      timeout: 30_000,
      maxWait: 10_000,
    }
  )
}

// ============================================
// CONVENIENCE: withTenant (shorthand)
// ============================================

/**
 * Shorthand for creating a context from auth and executing a transaction.
 *
 * Usage:
 *   const positions = await withTenant(auth, async (tx) => {
 *     return tx.position.findMany({ where: { active: true } })
 *   })
 */
export async function withTenant<T>(
  auth: {
    userId: string
    role: string
    companyId?: string
  },
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  const ctx = createTenantContext(auth)
  return withTenantTransaction(ctx, callback)
}

/**
 * Shorthand for SA impersonation.
 *
 * Usage:
 *   const positions = await withTenantImpersonation(auth, targetCompanyId, async (tx) => {
 *     return tx.position.findMany({})
 *   })
 */
export async function withTenantImpersonation<T>(
  auth: {
    userId: string
    role: string
    companyId?: string
  },
  targetCompanyId: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  const ctx = createTenantContextForImpersonation(auth, targetCompanyId)
  return withTenantTransaction(ctx, callback)
}
