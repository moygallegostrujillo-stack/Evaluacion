import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { logUnauthorizedAccess } from '@/lib/audit'
import { resolveTargetCompanyId } from '@/lib/impersonation'
import { getAggregateDashboardMetrics } from '@/lib/admin-db'

/**
 * PHASE 3.5-D.2.7 — Dashboard migration to the Tenant DB Access layer.
 *
 * The endpoint now has THREE explicitly separated access modes:
 *
 *   1. SA AGGREGATE   — SUPER_ADMIN without companyId/target. Uses the
 *      unscoped administrative client EXPLICITLY (getUnscopedClient) and
 *      returns ONLY global counts/metrics (minimum-information principle,
 *      FASE 8). No candidate PII, no emails/phones, no individual scores.
 *      Every access is persisted to AuditLog with mode='AGGREGATE'.
 *
 *   2. SA IMPERSONATION — SUPER_ADMIN with ?companyId=B. Tenant-scoped to B
 *      via createSuperAdminRLSClient; impersonation is logged to AuditLog
 *      by resolveTargetCompanyId (impersonation=true).
 *
 *   3. TENANT — RH/GERENTE. Tenant-scoped via createRLSClient(auth);
 *      auth.companyId comes from the JWT/middleware ONLY. Client-supplied
 *      companyId / targetCompanyId params are IGNORED for non-SUPER_ADMIN.
 *
 * ROLE GATE (D.2.7): CANDIDATO is denied (403). The dashboard exposes
 * company-level HR metrics and recent results including candidate PII —
 * candidates must never read other candidates' data through it.
 *
 * app.is_super_admin is NOT used anywhere (D.2.7/D.2.8 decision: the SA
 * aggregate mode is the ISOLATED ADMIN DB mechanism (src/lib/admin-db.ts) —
 * never a DB GUC bypass, never a generic unscoped client).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── ROLE GATE: candidates must never access the HR dashboard ──
    if (auth.role === 'CANDIDATO') {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        resource: 'Dashboard',
        companyId: auth.companyId,
        reason: 'CANDIDATO role cannot access HR dashboard metrics',
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── MODE 1: SA AGGREGATE (isolated ADMIN DB mechanism) ──
    // SUPER_ADMIN without own companyId and without a target → global
    // metrics ONLY. Minimum-information principle: no candidate PII.
    // D.2.8: the queries AND the AuditLog entry (details.mode='AGGREGATE')
    // now live inside admin-db — the route can no longer touch a raw
    // unscoped client, and every aggregate access is audited exactly once.
    if (auth.role === 'SUPER_ADMIN' && !auth.companyId && !req.nextUrl.searchParams.get('companyId')) {
      const metrics = await getAggregateDashboardMetrics({
        req,
        actorId: auth.userId,
        role: auth.role,
      })

      return NextResponse.json({
        ...metrics,
        // FASE 8 (minimum information): aggregate mode returns NO recent
        // results — candidate names/emails/phones/individual scores are
        // unnecessary for a global metrics view.
        recentResults: [],
        mode: 'aggregated',
      })
    }

    // ── MODE 2/3: SA IMPERSONATION or TENANT ──
    // For non-SUPER_ADMIN, resolveTargetCompanyId returns auth.companyId (with
    // isImpersonation=false) and IGNORES any client-supplied companyId
    // (anti-IDOR). For SUPER_ADMIN with a target, it returns the target and
    // persists an impersonation AuditLog.
    const { targetCompanyId, isImpersonation } = await resolveTargetCompanyId(auth, req, {
      action: 'ACCESS',
      resource: 'Dashboard',
    })
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    // RLS auto-injects companyId for the tenant context in effect
    // (auth.companyId for tenant; targetCompanyId for impersonation).

    // Total candidates
    const totalCandidates = await rlsDb.user.count({
      where: { role: 'CANDIDATO', active: true },
    })

    // Completed evaluations
    const completedEvaluations = await rlsDb.evaluationSession.count({
      where: { status: 'COMPLETED' },
    })

    // Pending evaluations (NOT_STARTED + IN_PROGRESS)
    const pendingEvaluations = await rlsDb.evaluationSession.count({
      where: { status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } },
    })

    // Guidance level counts (NOT hiring decisions — orientation only)
    const perfilCompletoCount = await rlsDb.evaluationResult.count({
      where: { recommendation: 'PERFIL_COMPLETO' },
    })

    const perfilParcialCount = await rlsDb.evaluationResult.count({
      where: { recommendation: 'PERFIL_PARCIAL' },
    })

    const pendienteCount = await rlsDb.evaluationResult.count({
      where: { recommendation: 'PENDIENTE' },
    })

    // Recent results
    const recentResults = await rlsDb.evaluationResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        candidate: {
          select: { id: true, name: true, email: true, phone: true },
        },
        position: {
          select: { id: true, title: true },
        },
      },
    })

    // Position stats - count candidates per position
    const sessions = await rlsDb.evaluationSession.findMany({
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
    const positionStats = Array.from(positionMap.values())

    // Zero-functional-change (FASE 16/20): the tenant/impersonation response
    // shape is unchanged — no mode field is added to it. Mode separation is
    // internal (this comment + the AGGREGATE branch above + AuditLog details).
    void isImpersonation
    return NextResponse.json({
      totalCandidates,
      completedEvaluations,
      pendingEvaluations,
      perfilCompletoCount,
      perfilParcialCount,
      pendienteCount,
      recentResults,
      positionStats,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 })
  }
}
