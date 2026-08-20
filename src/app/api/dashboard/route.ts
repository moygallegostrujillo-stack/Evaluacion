import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? req.nextUrl.searchParams.get('companyId')
      : null
    const { client: rlsDb } = targetCompanyId
      ? createRLSClient({ ...auth, companyId: targetCompanyId })
      : createRLSClient(auth)

    // RLS auto-injects companyId for non-SUPER_ADMIN; SUPER_ADMIN gets unscoped or scoped to target

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

    // Also count legacy values for backward compatibility
    const legacyAptoCount = await rlsDb.evaluationResult.count({
      where: { recommendation: 'APTO' },
    })
    const legacyEntrevistaCount = await rlsDb.evaluationResult.count({
      where: { recommendation: 'ENTREVISTA_ADICIONAL' },
    })
    const legacyNoRecomendadoCount = await rlsDb.evaluationResult.count({
      where: { recommendation: 'NO_RECOMENDADO' },
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
