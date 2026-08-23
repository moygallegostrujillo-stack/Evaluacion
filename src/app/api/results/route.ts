import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── SA aggregated mode (no personal data, counts only) ──
    if (auth.role === 'SUPER_ADMIN' && !auth.companyId && !req.nextUrl.searchParams.get('companyId')) {
      console.log('[AUDIT] SA aggregated view accessed by', auth.userId)
      const db = getUnscopedClient()

      // Count results per company (both EvaluationResult and VacancyApplication)
      const resultGroups = await db.evaluationResult.groupBy({
        by: ['companyId'],
        _count: true,
      })

      // Count completed vacancy applications per company
      const vacancyGroups = await db.vacancyApplication.groupBy({
        by: ['companyId'],
        where: { status: 'COMPLETED' },
        _count: true,
      })
      const vacancyMap = new Map(vacancyGroups.map(g => [g.companyId, g._count]))

      // Resolve company names
      const companyIds = Array.from(new Set([...resultGroups.map(g => g.companyId), ...vacancyGroups.map(g => g.companyId)]))
      const companies = companyIds.length > 0
        ? await db.company.findMany({
            where: { id: { in: companyIds } },
            select: { id: true, name: true },
          })
        : []
      const companyMap = new Map(companies.map(c => [c.id, c.name]))

      const aggregated = resultGroups.map(g => ({
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

      return NextResponse.json({ aggregated, mode: 'aggregated' })
    }

    // ── SA impersonation mode (scoped to ?companyId=xxx) ──
    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? req.nextUrl.searchParams.get('companyId')
      : null

    if (auth.role === 'SUPER_ADMIN' && targetCompanyId) {
      console.log('[AUDIT] SA impersonating company', targetCompanyId, 'by', auth.userId)
    }

    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    const candidateId = req.nextUrl.searchParams.get('candidateId')
    const resultId = req.nextUrl.searchParams.get('resultId')
    const compareIds = req.nextUrl.searchParams.get('compareIds')

    // Compare multiple candidates
    if (compareIds) {
      const ids = compareIds.split(',').filter(Boolean)

      // Fetch from EvaluationResult first
      const evalResults = await rlsDb.evaluationResult.findMany({
        where: { id: { in: ids } },
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
          where: { id: { in: missingIds } },
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
        // Defense-in-depth: RLS already filtered, but keep the check as extra safety
        if (auth.role !== 'SUPER_ADMIN' && result.companyId !== auth.companyId) {
          return NextResponse.json({ error: 'Forbidden: result belongs to another company' }, { status: 403 })
        }

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
        // Defense-in-depth check
        if (auth.role !== 'SUPER_ADMIN' && vacancyApp.companyId !== auth.companyId) {
          return NextResponse.json({ error: 'Forbidden: result belongs to another company' }, { status: 403 })
        }

        // Find the candidate user for contact info
        const candidateUser = await getUnscopedClient().user.findFirst({
          where: { email: vacancyApp.candidateEmail },
          select: { id: true, name: true, email: true, phone: true, consentGiven: true, consentDate: true },
        })

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
