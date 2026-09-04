import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { logAuditEvent, logUnauthorizedAccess } from '@/lib/audit'
import { resolveTargetCompanyId } from '@/lib/impersonation'
import { getAggregateResultMetrics } from '@/lib/admin-db'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── SA aggregated mode (no personal data, counts only) ──
    // D.2.8: aggregate queries AND the AuditLog entry (details.mode=
    // 'AGGREGATE', differentiated from impersonation) live inside the
    // isolated ADMIN DB module (src/lib/admin-db.ts) — the route no longer
    // touches a raw unscoped client.
    if (auth.role === 'SUPER_ADMIN' && !auth.companyId && !req.nextUrl.searchParams.get('companyId')) {
      const { aggregated } = await getAggregateResultMetrics({
        req,
        actorId: auth.userId,
        role: auth.role,
      })
      return NextResponse.json({ aggregated, mode: 'aggregated' })
    }

    // ── SA impersonation mode (scoped to ?companyId=xxx) ──
    // PHASE 3.5-B.2.1 (B1): Centralized impersonation resolution + logging
    const { targetCompanyId } = await resolveTargetCompanyId(auth, req, {
      action: 'ACCESS',
      resource: 'EvaluationResult',
    })

    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    const candidateIdParam = req.nextUrl.searchParams.get('candidateId')
    const resultId = req.nextUrl.searchParams.get('resultId')
    const compareIds = req.nextUrl.searchParams.get('compareIds')

    // SECURITY FIX (Phase 1.2): CANDIDATO role is force-bound to own userId.
    // A candidate CANNOT query results for another candidateId — even if they
    // know the ID. Previously this check was missing, allowing cross-candidate
    // data access within the same company.
    const candidateId = auth.role === 'CANDIDATO' ? auth.userId : candidateIdParam

    // If a CANDIDATO tried to pass a different candidateId, log as unauthorized attempt
    if (auth.role === 'CANDIDATO' && candidateIdParam && candidateIdParam !== auth.userId) {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'ACCESS',
        resource: 'EvaluationResult',
        resourceId: candidateIdParam,
        companyId: auth.companyId,
        reason: 'CANDIDATO attempted to access another candidate\'s results',
      })
      return NextResponse.json(
        { error: 'Forbidden: you can only access your own results' },
        { status: 403 }
      )
    }

    // Compare multiple candidates
    if (compareIds) {
      const ids = compareIds.split(',').filter(Boolean)

      // SECURITY FIX (Phase 3.5-D.2.6, VUL-02): CANDIDATO may only compare
      // their own results. Previously a candidate could pass any same-company
      // result IDs to compareIds and receive the other candidates' full
      // psychometric scores. Tenant scoping itself (companyId) remains
      // enforced by the RLS client — this is an additional ownership filter.
      const candidateOwnScope =
        auth.role === 'CANDIDATO' ? { candidateId: auth.userId } : {}

      // Fetch from EvaluationResult first
      const evalResults = await rlsDb.evaluationResult.findMany({
        where: { id: { in: ids }, ...candidateOwnScope },
        include: {
          candidate: {
            select: { id: true, name: true, email: true },
          },
          position: {
            select: { id: true, title: true, category: true },
          },
        },
      })

      // Map all EvaluationResult items to the unified comparison shape
      type CompareCandidate = {
        id: string
        candidateId: string
        candidateName: string
        positionTitle: string
        overallScore: number
        recommendation: string
        scores: {
          openness: number
          conscientiousness: number
          extraversion: number
          agreeableness: number
          neuroticism: number
          stressLevel: number
          empathy: number
          adaptability: number
          leadership: number
          teamwork: number
          knowledgeScore: number | null
          integrityScore: number
        }
      }

      const allCandidates: CompareCandidate[] = evalResults.map((r) => ({
        id: r.id,
        candidateId: r.candidateId,
        candidateName: r.candidateName,
        positionTitle: r.positionTitle,
        overallScore: r.overallScore,
        recommendation: r.recommendation,
        scores: {
          openness: r.openness,
          conscientiousness: r.conscientiousness,
          extraversion: r.extraversion,
          agreeableness: r.agreeableness,
          neuroticism: r.neuroticism,
          stressLevel: r.stressLevel,
          empathy: r.empathy,
          adaptability: r.adaptability,
          leadership: r.leadership,
          teamwork: r.teamwork,
          knowledgeScore: r.knowledgeScore,
          integrityScore: r.integrityScore,
        },
      }))

      // Find IDs not found in EvaluationResult — they may be VacancyApplication IDs
      const foundIds = new Set(evalResults.map((r) => r.id))
      const missingIds = ids.filter((id) => !foundIds.has(id))

      if (missingIds.length > 0) {
        const vacancyApps = await rlsDb.vacancyApplication.findMany({
          where: {
            id: { in: missingIds },
            // Phase 3.5-D.2.6 (VUL-02): candidates can only compare their own
            // vacancy applications (candidateUserId FK, Phase 3.5-A.1)
            ...(auth.role === 'CANDIDATO' ? { candidateUserId: auth.userId } : {}),
          },
          include: {
            vacancy: {
              select: { id: true, title: true },
            },
          },
        })

        for (const app of vacancyApps) {
          allCandidates.push({
            id: app.id,
            candidateId: '', // VacancyApplication doesn't have a direct candidateId FK
            candidateName: app.candidateName,
            positionTitle: app.vacancy?.title || '',
            overallScore: app.overallScore,
            recommendation: app.recommendation,
            scores: {
              openness: app.openness,
              conscientiousness: app.conscientiousness,
              extraversion: app.extraversion,
              agreeableness: app.agreeableness,
              neuroticism: app.neuroticism,
              stressLevel: app.stressLevel,
              empathy: app.empathy,
              adaptability: app.adaptability,
              leadership: app.leadership,
              teamwork: app.teamwork,
              knowledgeScore: app.knowledgeScore,
              integrityScore: app.integrityScore,
            },
          })
        }
      }

      // Build comparison data from all candidates (both EvaluationResult and VacancyApplication)
      const comparison = {
        candidates: allCandidates,
        averages: {
          overallScore: allCandidates.reduce((s, r) => s + r.overallScore, 0) / (allCandidates.length || 1),
          openness: allCandidates.reduce((s, r) => s + r.scores.openness, 0) / (allCandidates.length || 1),
          conscientiousness: allCandidates.reduce((s, r) => s + r.scores.conscientiousness, 0) / (allCandidates.length || 1),
          extraversion: allCandidates.reduce((s, r) => s + r.scores.extraversion, 0) / (allCandidates.length || 1),
          agreeableness: allCandidates.reduce((s, r) => s + r.scores.agreeableness, 0) / (allCandidates.length || 1),
          neuroticism: allCandidates.reduce((s, r) => s + r.scores.neuroticism, 0) / (allCandidates.length || 1),
          stressLevel: allCandidates.reduce((s, r) => s + r.scores.stressLevel, 0) / (allCandidates.length || 1),
          empathy: allCandidates.reduce((s, r) => s + r.scores.empathy, 0) / (allCandidates.length || 1),
          adaptability: allCandidates.reduce((s, r) => s + r.scores.adaptability, 0) / (allCandidates.length || 1),
          leadership: allCandidates.reduce((s, r) => s + r.scores.leadership, 0) / (allCandidates.length || 1),
          teamwork: allCandidates.reduce((s, r) => s + r.scores.teamwork, 0) / (allCandidates.length || 1),
          knowledgeScore: allCandidates.reduce((s, r) => s + (r.scores.knowledgeScore || 0), 0) / (allCandidates.length || 1),
          integrityScore: allCandidates.reduce((s, r) => s + r.scores.integrityScore, 0) / (allCandidates.length || 1),
        },
      }

      return NextResponse.json({ comparison })
    }

    // Single result by ID
    if (resultId) {
      // First try EvaluationResult
      const result = await rlsDb.evaluationResult.findUnique({
        where: { id: resultId },
        include: {
          candidate: {
            select: { id: true, name: true, email: true, phone: true, consentGiven: true, consentDate: true },
          },
          position: {
            select: { id: true, title: true, category: true, sector: true },
          },
          session: {
            select: {
              id: true,
              startedAt: true,
              completedAt: true,
              status: true,
            },
          },
        },
      })

      if (result) {
        // Defense-in-depth: RLS already filtered, but keep the check as extra safety.
        // Phase 3.5-D.2.6: cross-tenant denials return 404 (not 403) so the
        // response never confirms the existence of another company's result
        // (FASE 14 — preferir 404, sin filtrar existencia).
        if (auth.role !== 'SUPER_ADMIN' && result.companyId !== auth.companyId) {
          await logUnauthorizedAccess(req, {
            actorId: auth.userId,
            resource: 'EvaluationResult',
            resourceId: resultId,
            companyId: auth.companyId,
            reason: 'Cross-tenant access attempt to EvaluationResult',
          })
          return NextResponse.json({ error: 'Result not found' }, { status: 404 })
        }

        // SECURITY FIX (Phase 1.2): CANDIDATO can only view their own results
        if (auth.role === 'CANDIDATO' && result.candidateId !== auth.userId) {
          await logUnauthorizedAccess(req, {
            actorId: auth.userId,
            resource: 'EvaluationResult',
            resourceId: resultId,
            companyId: auth.companyId,
            reason: 'CANDIDATO attempted to access another candidate\'s result by ID',
          })
          return NextResponse.json({ error: 'Forbidden: you can only access your own results' }, { status: 403 })
        }

        await logAuditEvent(req, {
          actorId: auth.userId,
          action: 'ACCESS',
          resource: 'EvaluationResult',
          resourceId: result.id,
          companyId: auth.companyId,
          details: { source: 'evaluation' },
        })

        return NextResponse.json({ result })
      }

      // If not found in EvaluationResult, try VacancyApplication
      const vacancyApp = await rlsDb.vacancyApplication.findUnique({
        where: { id: resultId },
        include: {
          vacancy: {
            select: { id: true, title: true, sector: true },
          },
        },
      })

      if (vacancyApp) {
        // Defense-in-depth check.
        // Phase 3.5-D.2.6: cross-tenant denials return 404 (never 403) so the
        // response cannot confirm the existence of another company's result,
        // and the attempt is audit-logged (this site previously did not log).
        if (auth.role !== 'SUPER_ADMIN' && vacancyApp.companyId !== auth.companyId) {
          await logUnauthorizedAccess(req, {
            actorId: auth.userId,
            resource: 'EvaluationResult',
            resourceId: resultId,
            companyId: auth.companyId,
            reason: 'Cross-tenant access attempt to VacancyApplication result',
          })
          return NextResponse.json({ error: 'Result not found' }, { status: 404 })
        }

        // Find the candidate user for contact info
        // SECURITY FIX (Phase 1.2): Use RLS-scoped client instead of unscoped
        // to prevent cross-tenant email collision leaks.
        // We query with companyId filter to ensure we only find users within
        // the same tenant as the VacancyApplication.
        const candidateUser = await rlsDb.user.findFirst({
          where: { email: vacancyApp.candidateEmail, companyId: vacancyApp.companyId },
          select: { id: true, name: true, email: true, phone: true, consentGiven: true, consentDate: true },
        })

        // SECURITY FIX (Phase 3.5-D.2.6, VUL-01): CANDIDATO can only view their
        // own vacancy-application results. The EvaluationResult branch already
        // enforced this (Phase 1.2), but this branch did not — a candidate who
        // knew another candidate's VacancyApplication ID (same company) could
        // read that candidate's full psychometric scores. Ownership is checked
        // against BOTH the candidateUserId FK (authoritative, Phase 3.5-A.1)
        // and the email-resolved candidate user (legacy applications).
        const isOwnVacancyResult =
          vacancyApp.candidateUserId === auth.userId || candidateUser?.id === auth.userId
        if (auth.role === 'CANDIDATO' && !isOwnVacancyResult) {
          await logUnauthorizedAccess(req, {
            actorId: auth.userId,
            resource: 'EvaluationResult',
            resourceId: resultId,
            companyId: auth.companyId,
            reason: 'CANDIDATO attempted to access another candidate\'s vacancy application result by ID',
          })
          return NextResponse.json(
            { error: 'Forbidden: you can only access your own results' },
            { status: 403 }
          )
        }

        // Map VacancyApplication to the same shape as EvaluationResult
        const mappedResult = {
          id: vacancyApp.id,
          sessionId: vacancyApp.id,
          candidateId: candidateUser?.id || '',
          candidateName: vacancyApp.candidateName,
          positionId: vacancyApp.vacancyId,
          positionTitle: vacancyApp.vacancy?.title || '',
          companyId: vacancyApp.companyId,
          openness: vacancyApp.openness,
          conscientiousness: vacancyApp.conscientiousness,
          extraversion: vacancyApp.extraversion,
          agreeableness: vacancyApp.agreeableness,
          neuroticism: vacancyApp.neuroticism,
          stressLevel: vacancyApp.stressLevel,
          empathy: vacancyApp.empathy,
          adaptability: vacancyApp.adaptability,
          leadership: vacancyApp.leadership,
          teamwork: vacancyApp.teamwork,
          knowledgeScore: vacancyApp.knowledgeScore,
          overallScore: vacancyApp.overallScore,
          recommendation: vacancyApp.recommendation,
          summary: vacancyApp.summary,
          createdAt: vacancyApp.createdAt,
          candidate: candidateUser ? {
            id: candidateUser.id,
            name: candidateUser.name,
            email: candidateUser.email,
            phone: candidateUser.phone,
            consentGiven: candidateUser.consentGiven,
            consentDate: candidateUser.consentDate,
          } : null,
          position: vacancyApp.vacancy ? {
            id: vacancyApp.vacancy.id,
            title: vacancyApp.vacancy.title,
            category: '',
            sector: vacancyApp.vacancy.sector,
          } : null,
          session: {
            id: vacancyApp.id,
            startedAt: vacancyApp.startedAt,
            completedAt: vacancyApp.completedAt,
            status: vacancyApp.status,
          },
          source: 'vacancy' as const,
        }

        return NextResponse.json({ result: mappedResult })
      }

      return NextResponse.json({ error: 'Result not found' }, { status: 404 })
    }

    // Results by candidate — RLS auto-filters by companyId
    if (candidateId) {
      const results = await rlsDb.evaluationResult.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'desc' },
        include: {
          position: {
            select: { id: true, title: true, category: true },
          },
        },
      })

      return NextResponse.json({ results })
    }

    // All results — RLS auto-filters by companyId for non-SUPER_ADMIN
    const results = await rlsDb.evaluationResult.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
        position: {
          select: { id: true, title: true, category: true },
        },
      },
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Results GET error:', error)
    return NextResponse.json({ error: 'Error fetching results' }, { status: 500 })
  }
}
