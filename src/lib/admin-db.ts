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
 * CONNECTION STRATEGY (D.2.9 — FAIL CLOSED):
 *   - `ADMIN_DATABASE_URL` is MANDATORY for every SA AGGREGATE operation.
 *     If it is not configured, the aggregate functions THROW
 *     (AggregateAccessError) — there is NO silent fallback to the shared
 *     tenant connection. A missing administrative connection must never
 *     silently change behaviour to tenant-connection access in
 *     staging/production: aggregate either runs on its own audited
 *     connection or it fails closed.
 *   - The env var is read ONLY here, server-side, and is never logged or
 *     returned in any API response.
 *   - Dev/staging value: the same database the app uses (e.g.
 *     file:./prisma/db/custom.db) — the isolation boundary is still the
 *     explicit admin-db mechanism; at RLS activation the URL becomes the
 *     evalhr_sa role, which is what makes global reads possible under
 *     FORCE RLS.
 *
 * DO NOT add generic model accessors to this module. Any new aggregate
 * operation must be an explicit, audited, metrics-only function.
 */

import 'server-only'

import { PrismaClient } from '@prisma/client'
import type { NextRequest } from 'next/server'
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
 * Resolve the administrative connection — FAIL CLOSED.
 *
 * PRIVATE on purpose — this module never hands a client to callers.
 *
 * D.2.9 (PARTE 12): ADMIN_DATABASE_URL is REQUIRED. If it is missing the
 * aggregate operation MUST fail (AggregateAccessError). There is NO
 * fallback to the shared tenant connection: silent degradation would let
 * staging/production change behaviour without anyone noticing.
 *
 * The admin URL is never logged, never returned, never sent to the client.
 */
function resolveAdminClient() {
  const adminUrl = process.env.ADMIN_DATABASE_URL
  if (!adminUrl) {
    throw new AggregateAccessError(
      'ADMIN DB fail-closed: ADMIN_DATABASE_URL is not configured. ' +
        'SA AGGREGATE requires a dedicated administrative connection ' +
        '(see prisma/create-evalhr-sa-role.sql). Refusing to fall back to ' +
        'the tenant connection.'
    )
  }
  const g = globalThis as unknown as { evalhrAdminPrisma?: ReturnType<typeof createAdminClient> }
  if (!g.evalhrAdminPrisma) {
    g.evalhrAdminPrisma = createAdminClient(adminUrl)
  }
  return g.evalhrAdminPrisma
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

// ============================================
// PHASE 3.5-H (VUL-H6) — SA GLOBAL DIRECTORIES
// ============================================
//
// The G audit found SUPER_ADMIN global lists (users, interviews, vacancies,
// positions ?all=true) reading through the SHARED TENANT client (unscoped /
// isSuperAdmin-unfiltered). That was a fourth access channel violating the
// D.2.8 design:
//   TENANT            → evalhr_app + RLS
//   SA IMPERSONATION  → evalhr_app + target tenant (audited)
//   SA AGGREGATE      → admin-db + evalhr_sa (audited, fail-closed)
// The functions below close those holes: every SA global read now goes
// through THIS module — assertAggregateAuthority (SUPER_ADMIN only),
// auditAggregateAccess (AuditLog mode='AGGREGATE', written BEFORE the read
// so even fail-closed attempts leave evidence) and resolveAdminClient
// (fail-closed without ADMIN_DATABASE_URL, never exposed to callers).
//
// PII note: the user/interview directories intentionally include contact
// fields (email/phone/name). These are USER-MANAGEMENT and RECRUITMENT-
// OVERSIGHT functions of the SA role — the same fields SA can obtain
// per-tenant through impersonation, now on a single, always-audited
// administrative channel. Vacancy/position catalogs contain no candidate
// PII. Access is logged per invocation (actor, resource, operation, IP).

/** SA AGGREGATE — global user directory (user-management function). */
export async function getAggregateUserDirectory(
  actor: AggregateActorContext
): Promise<{ users: Array<Record<string, unknown>> }> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'User', 'READ_DIRECTORY')

  const admin = resolveAdminClient()

  const users = await admin.user.findMany({
    select: {
      id: true, email: true, name: true, role: true,
      phone: true, companyId: true, active: true,
      consentGiven: true, consentDate: true,
      createdAt: true,
      company: { select: { id: true, name: true } },
    },
    orderBy: { name: 'asc' },
  })

  return { users }
}

/** SA AGGREGATE — global interview directory (recruitment oversight). */
export async function getAggregateInterviewDirectory(
  actor: AggregateActorContext
): Promise<{ interviews: Array<Record<string, unknown>> }> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'InterviewSchedule', 'READ_DIRECTORY')

  const admin = resolveAdminClient()

  const interviews = await admin.interviewSchedule.findMany({
    orderBy: { scheduledAt: 'asc' },
    include: {
      candidate: {
        select: { id: true, name: true, email: true, phone: true },
      },
      position: {
        select: { id: true, title: true, category: true },
      },
    },
  })

  return { interviews }
}

/** SA AGGREGATE — global vacancy catalog (no candidate PII). */
export async function getAggregateVacancyDirectory(
  actor: AggregateActorContext
): Promise<{ vacancies: Array<Record<string, unknown>> }> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'Vacancy', 'READ_DIRECTORY')

  const admin = resolveAdminClient()

  const vacancies = await admin.vacancy.findMany({
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const serialized = vacancies.map((v) => ({
    id: v.id,
    title: v.title,
    slug: v.slug,
    description: v.description,
    sector: v.sector,
    status: v.status,
    includePsicometrica: v.includePsicometrica,
    includePsicologica: v.includePsicologica,
    maxVideoSeconds: v.maxVideoSeconds,
    companyId: v.companyId,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    questions: v.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options ? JSON.parse(q.options) : null,
      correctAnswer: q.correctAnswer,
      order: q.order,
    })),
    applicationCount: v._count.applications,
  }))

  return { vacancies: serialized }
}

/** SA AGGREGATE — global active-position catalog (no candidate PII). */
export async function getAggregatePositionCatalog(
  actor: AggregateActorContext
): Promise<{ positions: Array<Record<string, unknown>> }> {
  assertAggregateAuthority(actor)
  await auditAggregateAccess(actor, 'Position', 'READ_CATALOG')

  const admin = resolveAdminClient()

  const positions = await admin.position.findMany({
    where: { active: true, status: 'ACTIVE' },
    orderBy: [{ sector: 'asc' }, { title: 'asc' }],
    include: {
      company: {
        select: { id: true, name: true, sector: true },
      },
      evaluationTemplates: {
        select: {
          id: true,
          name: true,
          type: true,
          order: true,
          _count: { select: { questions: true } },
        },
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { sessions: true },
      },
    },
  })

  return { positions }
}
