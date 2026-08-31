/**
 * Database-level RLS session management.
 *
 * PHASE 3.5-B.3 — Rewritten for fail-closed behavior.
 *
 * This module provides helpers to set PostgreSQL session variables
 * that the RLS policies use to filter rows by the current tenant.
 *
 * Key design decisions:
 * 1. Uses SET LOCAL (transaction-scoped) — no connection contamination
 * 2. Fail-closed: if app.current_company_id is not set, policies deny ALL rows
 *    (the evalhr_current_tenant() function returns '__DENIED__')
 * 3. SUPER_ADMIN sets app.is_super_admin = 'true' which bypasses RLS
 * 4. SUPER_ADMIN with targetCompanyId sets app.current_company_id = target
 *    and does NOT set app.is_super_admin — so RLS filters to that company
 *
 * Usage in API routes:
 * ```ts
 * import { withRLSTransaction } from '@/lib/db-rls-session'
 *
 * const results = await withRLSTransaction(
 *   { companyId: 'comp_123', isSuperAdmin: false },
 *   async (tx) => {
 *     return tx.evaluationResult.findMany({})
 *   }
 * )
 * ```
 *
 * For SUPER_ADMIN with target:
 * ```ts
 * const results = await withRLSTransaction(
 *   { companyId: 'target_comp_id', isSuperAdmin: false }, // NOT super admin — scoped
 *   async (tx) => { ... }
 * )
 * ```
 *
 * For SUPER_ADMIN aggregate (all companies):
 * ```ts
 * const results = await withRLSTransaction(
 *   { companyId: '__AGGREGATE__', isSuperAdmin: true },
 *   async (tx) => { ... }
 * )
 * ```
 */

import { Prisma } from '@prisma/client'

export interface RLSSessionConfig {
  /** The company ID for this tenant scope */
  companyId: string
  /** Whether this is a SUPER_ADMIN who can bypass RLS */
  isSuperAdmin: boolean
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
  // Set the company ID (used by evalhr_current_tenant() function)
  await tx.$executeRaw`SET LOCAL app.current_company_id = ${config.companyId}`

  // Set the super admin flag (bypasses RLS when 'true')
  await tx.$executeRaw`SET LOCAL app.is_super_admin = ${config.isSuperAdmin ? 'true' : 'false'}`
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
