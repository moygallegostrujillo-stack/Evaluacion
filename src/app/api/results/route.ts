import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Derive companyId from auth; SUPER_ADMIN can optionally override
    const companyId = auth.role === 'SUPER_ADMIN'
      ? (req.nextUrl.searchParams.get('companyId') || auth.companyId)
      : auth.companyId
    const candidateId = req.nextUrl.searchParams.get('candidateId')
    const resultId = req.nextUrl.searchParams.get('resultId')
    const compareIds = req.nextUrl.searchParams.get('compareIds')

    // Compare multiple candidates
    if (compareIds) {
      const ids = compareIds.split(',').filter(Boolean)
      const results = await db.evaluationResult.findMany({
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

      // Company ownership check: filter out results from other companies (SUPER_ADMIN sees all)
      const ownedResults = auth.role === 'SUPER_ADMIN'
        ? results
        : results.filter((r) => r.companyId === auth.companyId)

      // Build comparison data
      const comparison = {
        candidates: ownedResults.map((r) => ({
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
          },
        })),
        averages: {
          overallScore: ownedResults.reduce((s, r) => s + r.overallScore, 0) / (ownedResults.length || 1),
          openness: ownedResults.reduce((s, r) => s + r.openness, 0) / (ownedResults.length || 1),
          conscientiousness: ownedResults.reduce((s, r) => s + r.conscientiousness, 0) / (ownedResults.length || 1),
          extraversion: ownedResults.reduce((s, r) => s + r.extraversion, 0) / (ownedResults.length || 1),
          agreeableness: ownedResults.reduce((s, r) => s + r.agreeableness, 0) / (ownedResults.length || 1),
          neuroticism: ownedResults.reduce((s, r) => s + r.neuroticism, 0) / (ownedResults.length || 1),
          stressLevel: ownedResults.reduce((s, r) => s + r.stressLevel, 0) / (ownedResults.length || 1),
          empathy: ownedResults.reduce((s, r) => s + r.empathy, 0) / (ownedResults.length || 1),
          adaptability: ownedResults.reduce((s, r) => s + r.adaptability, 0) / (ownedResults.length || 1),
          leadership: ownedResults.reduce((s, r) => s + r.leadership, 0) / (ownedResults.length || 1),
          teamwork: ownedResults.reduce((s, r) => s + r.teamwork, 0) / (ownedResults.length || 1),
        },
      }

      return NextResponse.json({ comparison })
    }

    // Single result by ID
    if (resultId) {
      const result = await db.evaluationResult.findUnique({
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

      if (!result) {
        return NextResponse.json({ error: 'Result not found' }, { status: 404 })
      }

      // Company ownership check: non-SUPER_ADMIN can only access own company's results
      if (auth.role !== 'SUPER_ADMIN' && result.companyId !== auth.companyId) {
        return NextResponse.json({ error: 'Forbidden: result belongs to another company' }, { status: 403 })
      }

      return NextResponse.json({ result })
    }

    // Results by candidate (scoped to user's company unless SUPER_ADMIN)
    if (candidateId) {
      const candidateWhere = auth.role === 'SUPER_ADMIN'
        ? { candidateId }
        : { candidateId, companyId: auth.companyId }
      const results = await db.evaluationResult.findMany({
        where: candidateWhere,
        orderBy: { createdAt: 'desc' },
        include: {
          position: {
            select: { id: true, title: true, category: true },
          },
        },
      })

      return NextResponse.json({ results })
    }

    // Results by company
    if (companyId) {
      const results = await db.evaluationResult.findMany({
        where: { companyId },
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
    }

    // Super Admin (no companyId) sees all results
    const results = await db.evaluationResult.findMany({
      where: {},
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
