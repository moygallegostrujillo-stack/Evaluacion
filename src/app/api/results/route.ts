import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId')
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

      // Build comparison data
      const comparison = {
        candidates: results.map((r) => ({
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
          overallScore: results.reduce((s, r) => s + r.overallScore, 0) / (results.length || 1),
          openness: results.reduce((s, r) => s + r.openness, 0) / (results.length || 1),
          conscientiousness: results.reduce((s, r) => s + r.conscientiousness, 0) / (results.length || 1),
          extraversion: results.reduce((s, r) => s + r.extraversion, 0) / (results.length || 1),
          agreeableness: results.reduce((s, r) => s + r.agreeableness, 0) / (results.length || 1),
          neuroticism: results.reduce((s, r) => s + r.neuroticism, 0) / (results.length || 1),
          stressLevel: results.reduce((s, r) => s + r.stressLevel, 0) / (results.length || 1),
          empathy: results.reduce((s, r) => s + r.empathy, 0) / (results.length || 1),
          adaptability: results.reduce((s, r) => s + r.adaptability, 0) / (results.length || 1),
          leadership: results.reduce((s, r) => s + r.leadership, 0) / (results.length || 1),
          teamwork: results.reduce((s, r) => s + r.teamwork, 0) / (results.length || 1),
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
            select: { id: true, name: true, email: true, phone: true },
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

      return NextResponse.json({ result })
    }

    // Results by candidate
    if (candidateId) {
      const results = await db.evaluationResult.findMany({
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

    return NextResponse.json({ error: 'At least one filter parameter is required (companyId, candidateId, resultId, or compareIds)' }, { status: 400 })
  } catch (error) {
    console.error('Results GET error:', error)
    return NextResponse.json({ error: 'Error fetching results' }, { status: 500 })
  }
}
