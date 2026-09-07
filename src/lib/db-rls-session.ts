/**
 * Database-level RLS session management.
 *
 * PHASE 3.5-B.3 — Rewritten for fail-closed behavior.
 * PHASE 3.5-D.2.7 — `app.is_super_admin` GUC REMOVED (prohibition of the
 * super-admin GUC bypass).
 *
 * This module provides helpers to set PostgreSQL session variables
 * that the RLS policies use to filter rows by the current tenant.
 *
 * Key design decisions:
 * 1. Uses `SELECT set_config('app.current_company_id', $1, true)` — the
 *    PostgreSQL-supported, parameter-bound equivalent of SET LOCAL
 *    (is_local = true → transaction-scoped, auto-cleared on COMMIT/ROLLBACK;
 *    no connection contamination under PgBouncer/Supavisor transaction pooling).
 *    PHASE 3.5-I.1: the former `SET LOCAL app.current_company_id = $1` was
 *    removed — PostgreSQL utility statements cannot take bind parameters, so
 *    that statement failed at runtime (latent defect documented in 3.5-G M
 *    finding and 3.5-H GO-CONDICIONAL #3).
 * 2. Fail-closed: an empty/missing companyId is rejected BEFORE any query;
 *    if app.current_company_id is not set, policies deny ALL rows
 *    (the evalhr_current_tenant() function returns '__DENIED__')
 * 3. D.2.7 DECISION (closed in D.2.8) — SA AGGREGATE does NOT use a GUC
 *    bypass:
 *      TENANT            → evalhr_app → RLS → app.current_company_id
 *      SA IMPERSONATION  → evalhr_app → RLS → app.current_company_id = target
 *      SA AGGREGATE      → isolated ADMIN DB mechanism (src/lib/admin-db.ts)
 *                          with a dedicated evalhr_sa connection when DB RLS
 *                          activates — NEVER a super-admin GUC.
 *    The only session variable this module sets is app.current_company_id.
 *    prisma/rls-policies.sql (definitive, D.2.8) contains ZERO
 *    app.is_super_admin references — function, policies and rollback are
 *    pure-tenant and fail-closed.
 *
 * Usage in API routes:
 * ```ts
 * import { withRLSTransaction } from '@/lib/db-rls-session'
 *
 * const results = await withRLSTransaction(
 *   { companyId: 'comp_123' },
 *   async (tx) => {
 *     return tx.evaluationResult.findMany({})
 *   }
 * )
 * ```
 *
 * For SUPER_ADMIN impersonation (target company):
 * ```ts
 * const results = await withRLSTransaction(
 *   { companyId: 'target_comp_id' }, // scoped to the target company
 *   async (tx) => { ... }
 * )
 * ```
 */

import { Prisma } from '@prisma/client'

export interface RLSSessionConfig {
  /** The company ID for this tenant scope */
  companyId: string
}

/**
 * Set the RLS session variables within a Prisma transaction.
 *
 * PHASE 3.5-I.1: uses the ONLY PostgreSQL-correct mechanism for a
 * parameterized, transaction-scoped GUC assignment:
 *
 *     SELECT set_config('app.current_company_id', $1, true)
 *
 *   - Parameter-bound ($1): the tenant id never enters the SQL text.
 *   - is_local = true: scope is the current transaction — automatically
 *     cleared at COMMIT/ROLLBACK (same semantics as SET LOCAL), so pooled
 *     connections (PgBouncer/Supavisor transaction mode) are never
 *     contaminated across requests.
 *   - NO `SET SESSION`, NO module/global state, NO `app.is_super_admin`
 *     (D.2.7/D.2.8: no bypass GUC exists anywhere).
 *
 * Fail-closed guarantees:
 *   1. An empty/blank companyId throws BEFORE any statement runs.
 *   2. The function verifies set_config's return value (set_config returns
 *      the new setting); any mismatch/missing result throws instead of
 *      silently continuing without tenant context.
 *   3. If this function is not called inside a transaction (or fails), the
 *      policies' evalhr_current_tenant() returns '__DENIED__' → zero rows.
 *
 * IMPORTANT: This must be called inside a db.$transaction() callback.
 */
export async function setRLSSession(
  tx: Prisma.TransactionClient,
  config: RLSSessionConfig
): Promise<void> {
  const companyId = config.companyId

  // Fail-closed gate 1: a tenant scope is mandatory — never set an empty GUC.
  if (typeof companyId !== 'string' || companyId.trim().length === 0) {
    throw new Error(
      'RLS session violation: app.current_company_id requires a non-empty companyId'
    )
  }

  // Parameter-bound, transaction-scoped GUC set (see docstring). The GUC name
  // is a fixed literal; ONLY the tenant value is a bind parameter ($1).
  const result = await tx.$queryRaw<Array<{ set_config: string }>>`
    SELECT set_config('app.current_company_id', ${companyId}, true)
  `

  // Fail-closed gate 2: set_config returns the value it stored. Anything
  // other than an exact echo means the session state is not what the RLS
  // policies expect — abort the transaction instead of running unscoped.
  if (
    !Array.isArray(result) ||
    result.length === 0 ||
    result[0]?.set_config !== companyId
  ) {
    throw new Error(
      'RLS session violation: set_config did not confirm app.current_company_id — transaction aborted (fail-closed)'
    )
  }
}

/**
 * Execute a callback within an RLS-scoped database transaction.
 *
 * This is the recommended way to use DB-level RLS — it wraps
 * the operation in a transaction and sets the session variables
 * before executing your callback.
 *
 * The tenant scope is transaction-local (set_config is_local=true), so it:
 * - Is automatically cleared on COMMIT or ROLLBACK
 * - Does NOT contaminate other requests using the same pooled connection
 * - Works correctly with PgBouncer/Supavisor in transaction mode
 */
export async function withRLSTransaction<T>(
  config: RLSSessionConfig,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  const { db } = await import('./db')
  return db.$transaction(async (tx) => {
    await setRLSSession(tx, config)
    return callback(tx)
  })
}
