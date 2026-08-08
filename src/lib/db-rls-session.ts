/**
 * Database-level RLS session management.
 *
 * This module provides helpers to set PostgreSQL session variables
 * that the RLS policies (defined in prisma/rls-policies.sql) use
 * to filter rows by the current tenant.
 *
 * Usage in API routes:
 * ```ts
 * import { setRLSSession, clearRLSSession } from '@/lib/db-rls-session'
 *
 * // Inside a transaction:
 * await db.$transaction(async (tx) => {
 *   await setRLSSession(tx, { companyId: 'comp_123', isSuperAdmin: false })
 *   // ... all queries in this transaction are now RLS-scoped at DB level
 *   const results = await tx.evaluationResult.findMany({})
 *   return results
 * })
 * // Session variables are automatically cleared when the transaction ends
 * ```
 */

import { Prisma } from '@prisma/client'

export interface RLSSessionConfig {
  companyId: string
  isSuperAdmin: boolean
}

/**
 * Set the RLS session variables within a Prisma transaction.
 *
 * These variables are used by the PostgreSQL RLS policies to filter rows.
 * They are scoped to the current transaction (LOCAL) and automatically
 * reset when the transaction ends.
 *
 * IMPORTANT: This must be called inside a db.$transaction() callback.
 */
export async function setRLSSession(
  tx: Prisma.TransactionClient,
  config: RLSSessionConfig
): Promise<void> {
  await tx.$executeRaw`SET LOCAL app.current_company_id = ${config.companyId}`
  await tx.$executeRaw`SET LOCAL app.is_super_admin = ${config.isSuperAdmin ? 'true' : 'false'}`
}

/**
 * Clear the RLS session variables.
 *
 * Usually unnecessary since LOCAL variables reset when the transaction ends,
 * but provided for explicit cleanup if needed.
 */
export async function clearRLSSession(
  tx: Prisma.TransactionClient
): Promise<void> {
  await tx.$executeRaw`SET LOCAL app.current_company_id = ''`
  await tx.$executeRaw`SET LOCAL app.is_super_admin = 'false'`
}

/**
 * Execute a callback within an RLS-scoped database transaction.
 *
 * This is the recommended way to use DB-level RLS — it wraps
 * the operation in a transaction and sets the session variables
 * before executing your callback.
 *
 * Example:
 * ```ts
 * const results = await withRLSTransaction(
 *   { companyId: 'comp_123', isSuperAdmin: false },
 *   async (tx) => {
 *     return tx.evaluationResult.findMany({})
 *   }
 * )
 * ```
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
