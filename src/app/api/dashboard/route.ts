import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    // Total candidates
    const totalCandidates = await db.user.count({
      where: { companyId, role: 'CANDIDATO', active: true },
    })

    // Completed evaluations
    const completedEvaluations = await db.evaluationSession.count({
      where: { companyId, status: 'COMPLETED' },
    })

    // Pending evaluations (NOT_STARTED + IN_PROGRESS)
    const pendingEvaluations = await db.evaluationSession.count({
      where: { companyId, status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } },
    })

    // Recommendation counts
    const aptoCount = await db.evaluationResult.count({
      where: { companyId, recommendation: 'APTO' },
    })

    const entrevistaCount = await db.evaluationResult.count({
      where: { companyId, recommendation: 'ENTREVISTA_ADICIONAL' },
    })

    const noRecomendadoCount = await db.evaluationResult.count({
      where: { companyId, recommendation: 'NO_RECOMENDADO' },
    })

    // Recent results
    const recentResults = await db.evaluationResult.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
        position: {
          select: { id: true, title: true },
        },
      },
    })

    // Position stats - count candidates per position
    const sessions = await db.evaluationSession.findMany({
      where: { companyId },
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

    return NextResponse.json({
      totalCandidates,
      completedEvaluations,
      pendingEvaluations,
      aptoCount,
      entrevistaCount,
      noRecomendadoCount,
      recentResults,
      positionStats,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 })
  }
}
