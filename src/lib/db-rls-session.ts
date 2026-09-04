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
 * 1. Uses SET LOCAL (transaction-scoped) — no connection contamination
 * 2. Fail-closed: if app.current_company_id is not set, policies deny ALL rows
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
 * Uses SET LOCAL (transaction-scoped) to ensure no connection
 * contamination when using connection pooling (PgBouncer).
 *
 * IMPORTANT: This must be called inside a db.$transaction() callback.
 */
export async function setRLSSession(
  tx: Prisma.TransactionClient,
  config: RLSSessionConfig
): Promise<void> {
  // Set the company ID (used by evalhr_current_tenant() function).
  // D.2.7/D.2.8: NO app.is_super_admin GUC exists anywhere — the
  // fail-closed policies can never be bypassed through a session flag.
  await tx.$executeRaw`SET LOCAL app.current_company_id = ${config.companyId}`
}

/**
 * Execute a callback within an RLS-scoped database transaction.
 *
 * This is the recommended way to use DB-level RLS — it wraps
 * the operation in a transaction and sets the session variables
 * before executing your callback.
 *
 * The session variables are LOCAL to the transaction, so they:
 * - Are automatically cleared on COMMIT or ROLLBACK
 * - Do NOT contaminate other requests using the same pooled connection
 * - Work correctly with PgBouncer in transaction mode
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
