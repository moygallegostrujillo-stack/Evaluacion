/**
 * FASE 3.5-D.2.8 — ADMIN DB: isolated SA AGGREGATE mechanism.
 * ═══════════════════════════════════════════════════════════════════
 *
 * ARCHITECTURE (closes the D.2.7 recommendation — option B):
 *
 *   TENANT            → @/lib/rls createRLSClient(auth)     → companyId = JWT
 *   SA IMPERSONATION  → @/lib/rls createSuperAdminRLSClient → companyId = target
 *   SA AGGREGATE      → THIS MODULE (admin-db)              → isolated, audited
 *
 * HARD RULES (FASE 3.5-D.2.8):
 *   1. server-only — this module can NEVER be imported from client code.
 *   2. NO PrismaClient is exported. Callers can only use the three
 *      high-level `getAggregate*Metrics()` functions. A tenant endpoint
 *      cannot "borrow" the administrative connection, because there is no
 *      connection handle to borrow.
 *   3. Every function asserts the caller is acting as SUPER_ADMIN and
 *      throws `AggregateAccessError` otherwise (defense-in-depth on top of
 *      the role gate in the route — a tenant endpoint that imports this
 *      module will fail loudly at runtime, not silently leak data).
 *   4. Every invocation persists an AuditLog entry with
 *      details.mode = 'AGGREGATE' (FASE 8/13) — clearly differentiated
 *      from impersonation (details.impersonation = true, which always has
 *      a targetCompanyId).
 *   5. Minimum-information principle: the functions return ONLY counts,
 *      totals and group-level metrics (companyId/companyName/position
 *      titles). No candidate PII, no emails, no phones, no individual
 *      scores.
 *
 * CONNECTION STRATEGY:
 *   - Today (pre-RLS): the aggregate functions run on the shared
 *     application connection (`@/lib/db`) — exactly the same behaviour the
 *     former `getUnscopedClient()` aggregate branches had. Zero functional
 *     change.
 *   - When DB-level RLS is ACTIVATED (future phase): set
 *     `ADMIN_DATABASE_URL` to a dedicated `evalhr_sa` connection string
 *     (see prisma/create-evalhr-sa-role.sql). This module will then
 *     lazily create an isolated singleton PrismaClient on that URL.
 *     `evalhr_app` keeps NOBYPASSRLS and can never reach this module.
 *     The env var is read ONLY here, server-side, and is never logged or
 *     returned in any API response.
 *
 * DO NOT add generic model accessors to this module. Any new aggregate
 * operation must be an explicit, audited, metrics-only function.
 */

import 'server-only'

import { PrismaClient } from '@prisma/client'
import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { logAuditEvent } from '@/lib/audit'

// ============================================
// TYPES
// ============================================

export interface AggregateActorContext {
  /** The incoming request (for IP/user-agent in the AuditLog) */
  req?: NextRequest
  /** User ID of the SUPER_ADMIN performing the aggregate access */
  actorId: string
  /** Role of the caller — must be 'SUPER_ADMIN' */
  role: string
}

export interface AggregatePositionStat {
  id: string
  title: string
  count: number
}

export interface AggregateDashboardMetrics {
  totalCandidates: number
  completedEvaluations: number
  pendingEvaluations: number
  perfilCompletoCount: number
  perfilParcialCount: number
  pendienteCount: number
  positionStats: AggregatePositionStat[]
}

export interface AggregateCompanyResultRow {
  companyId: string
  companyName: string
  evaluationResultCount: number
  vacancyResultCount: number
  totalResultCount: number
}

export interface AggregateCandidateRow {
  /** Nullable: platform-level CANDIDATO users may have no company */
  companyId: string | null
  companyName: string
  candidateCount: number
  completedCount: number
  vacancyCount: number
}

// ============================================
// ERRORS
// ============================================

export class AggregateAccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AggregateAccessError'
  }
}

// ============================================
// INTERNAL GUARDS (not exported)
// ============================================

/**
 * Defense-in-depth: only a SUPER_ADMIN identity may ever cross this line.
 * The API routes already role-gate; this makes accidental use from a
 * tenant endpoint fail loudly instead of silently returning global data.
 */
function assertAggregateAuthority(actor: AggregateActorContext): void {
  if (!actor || typeof actor.actorId !== 'string' || actor.actorId.length === 0) {
    throw new AggregateAccessError(
      'ADMIN DB violation: aggregate access requires an authenticated actorId'
    )
  }
  if (actor.role !== 'SUPER_ADMIN') {
    throw new AggregateAccessError(
      `ADMIN DB violation: role "${actor.role}" is not authorized for SA AGGREGATE access`
    )
  }
}

/**
 * Persist the AGGREGATE audit entry. Every aggregate invocation is audited
 * exactly once, HERE (not in the routes), so the mechanism cannot be used
 * without leaving evidence. details.mode='AGGREGATE' differentiates it from
 * impersonation entries (details.impersonation=true + targetCompanyId).
 */
async function auditAggregateAccess(
  actor: AggregateActorContext,
  resource: string,
  action: string
): Promise<void> {
  await logAuditEvent(actor.req, {
    actorId: actor.actorId,
    action: 'ADMIN_ACCESS',
    resource,
    companyId: null, // AGGREGATE has no target tenant — by definition
    details: { mode: 'AGGREGATE', aggregate: true, operation: action },
  })
}

/**
 * Resolve the administrative connection.
 *
 * PRIVATE on purpose — this module never hands a client to callers.
 * - ADMIN_DATABASE_URL set  → isolated singleton PrismaClient (evalhr_sa,
 *   future state, only at RLS activation time).
 * - otherwise               → the shared application connection (current
 *   behaviour of the former getUnscopedClient() aggregate branches).
 *
 * The admin URL is never logged, never returned, never sent to the client.
 */
function resolveAdminClient() {
  const adminUrl = process.env.ADMIN_DATABASE_URL
  if (adminUrl) {
    const g = globalThis as unknown as { evalhrAdminPrisma?: ReturnType<typeof createAdminClient> }
    if (!g.evalhrAdminPrisma) {
      g.evalhrAdminPrisma = createAdminClient(adminUrl)
    }
    return g.evalhrAdminPrisma
  }
  // Pre-RLS fallback: shared connection (same behaviour as before D.2.8).
  return db
}

function createAdminClient(url: string) {
  // Instantiated ONLY when ADMIN_DATABASE_URL is set (RLS-activation era).
  // The class import above never opens a connection by itself.
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasourceUrl: url,
  })
}

// ============================================
// AGGREGATE METRICS (the ONLY public surface)
// ============================================

/**
 * SA AGGREGATE — global dashboard metrics (counts only, NO candidate PII).
 *
 * Replaces the former /api/dashboard aggregate branch (getUnscopedClient).
 * Response-shape compatible with D.2.7: the route composes the HTTP payload
 * with recentResults: [] (minimum-information principle, D.2.7 FASE 8).
 */
export async function getAggregateDashboardMetrics(
  actor: AggregateActorContext
): Promise<AggregateDashboardMetrics> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'Dashboard', 'READ_AGGREGATE')

  const admin = resolveAdminClient()

  // Total candidates (global count)
  const totalCandidates = await admin.user.count({
    where: { role: 'CANDIDATO', active: true },
  })

  // Completed evaluations (global count)
  const completedEvaluations = await admin.evaluationSession.count({
    where: { status: 'COMPLETED' },
  })

  // Pending evaluations (NOT_STARTED + IN_PROGRESS, global count)
  const pendingEvaluations = await admin.evaluationSession.count({
    where: { status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } },
  })

  // Guidance level counts (NOT hiring decisions — orientation only)
  const perfilCompletoCount = await admin.evaluationResult.count({
    where: { recommendation: 'PERFIL_COMPLETO' },
  })
  const perfilParcialCount = await admin.evaluationResult.count({
    where: { recommendation: 'PERFIL_PARCIAL' },
  })
  const pendienteCount = await admin.evaluationResult.count({
    where: { recommendation: 'PENDIENTE' },
  })

  // Position metrics — titles + counts only (no candidate data)
  const sessions = await admin.evaluationSession.findMany({
    select: { positionId: true, position: { select: { id: true, title: true } } },
  })

  const positionMap = new Map<string, { id: string; title: string; count: number }>()
  for (const s of sessions) {
    const key = s.positionId
    if (positionMap.has(key)) {
      positionMap.get(key)!.count++
    } else {
      positionMap.set(key, { id: s.position.id, title: s.position.title, count: 1 })
    }
  }

  return {
    totalCandidates,
    completedEvaluations,
    pendingEvaluations,
    perfilCompletoCount,
    perfilParcialCount,
    pendienteCount,
    positionStats: Array.from(positionMap.values()),
  }
}

/**
 * SA AGGREGATE — per-company evaluation result counts (no candidate rows).
 *
 * Replaces the former /api/results aggregate branch (getUnscopedClient).
 */
export async function getAggregateResultMetrics(
  actor: AggregateActorContext
): Promise<{ aggregated: AggregateCompanyResultRow[] }> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'EvaluationResult', 'READ_AGGREGATE')

  const admin = resolveAdminClient()

  // Count results per company (both EvaluationResult and VacancyApplication)
  const resultGroups = await admin.evaluationResult.groupBy({
    by: ['companyId'],
    _count: true,
  })

  // Count completed vacancy applications per company
  const vacancyGroups = await admin.vacancyApplication.groupBy({
    by: ['companyId'],
    where: { status: 'COMPLETED' },
    _count: true,
  })
  const vacancyMap = new Map(vacancyGroups.map(g => [g.companyId, g._count]))

  // Resolve company names
  const companyIds = Array.from(
    new Set([...resultGroups.map(g => g.companyId), ...vacancyGroups.map(g => g.companyId)])
  )
  const companies =
    companyIds.length > 0
      ? await admin.company.findMany({
          where: { id: { in: companyIds } },
          select: { id: true, name: true },
        })
      : []
  const companyMap = new Map(companies.map(c => [c.id, c.name]))

  const aggregated: AggregateCompanyResultRow[] = resultGroups.map(g => ({
    companyId: g.companyId,
    companyName: companyMap.get(g.companyId) || 'Unknown',
    evaluationResultCount: g._count,
    vacancyResultCount: vacancyMap.get(g.companyId) || 0,
    totalResultCount: g._count + (vacancyMap.get(g.companyId) || 0),
  }))

  // Include companies that only have vacancy results (no evaluation results)
  const existingIds = new Set(resultGroups.map(g => g.companyId))
  for (const vg of vacancyGroups) {
    if (!existingIds.has(vg.companyId)) {
      aggregated.push({
        companyId: vg.companyId,
        companyName: companyMap.get(vg.companyId) || 'Unknown',
        evaluationResultCount: 0,
        vacancyResultCount: vg._count,
        totalResultCount: vg._count,
      })
    }
  }

  return { aggregated }
}

/**
 * SA AGGREGATE — per-company candidate metrics (counts only, no PII).
 *
 * Replaces the former /api/candidates aggregate branch (getUnscopedClient).
 */
export async function getAggregateCandidateMetrics(
  actor: AggregateActorContext
): Promise<{ aggregated: AggregateCandidateRow[] }> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'Candidate', 'READ_AGGREGATE')

  const admin = resolveAdminClient()

  // Count candidates per company
  const candidateGroups = await admin.user.groupBy({
    by: ['companyId'],
    where: { role: 'CANDIDATO', active: true },
    _count: true,
  })

  // Count completed sessions per company
  const completedGroups = await admin.evaluationSession.groupBy({
    by: ['companyId'],
    where: { status: 'COMPLETED' },
    _count: true,
  })
  const completedMap = new Map(completedGroups.map(g => [g.companyId, g._count]))

  // Count active positions per company
  const positionGroups = await admin.position.groupBy({
    by: ['companyId'],
    where: { active: true },
    _count: true,
  })
  const positionMap = new Map(positionGroups.map(g => [g.companyId, g._count]))

  // Resolve company names (null-company candidates resolve to 'Unknown',
  // matching the original route behaviour)
  const companyIds = candidateGroups
    .map(g => g.companyId)
    .filter((id): id is string => id !== null)
  const companies =
    companyIds.length > 0
      ? await admin.company.findMany({
          where: { id: { in: companyIds } },
          select: { id: true, name: true },
        })
      : []
  const companyMap = new Map(companies.map(c => [c.id, c.name]))

  const aggregated: AggregateCandidateRow[] = candidateGroups.map(g => ({
    companyId: g.companyId,
    companyName: companyMap.get(g.companyId ?? '') || 'Unknown',
    candidateCount: g._count,
    completedCount: completedMap.get(g.companyId ?? '') || 0,
    vacancyCount: positionMap.get(g.companyId ?? '') || 0,
  }))

  return { aggregated }
}
