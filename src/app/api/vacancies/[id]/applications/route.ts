import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { logUnauthorizedAccess } from '@/lib/audit'

// ============================================
// GET - List applications for a vacancy
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── PHASE 3.5-H (VUL-H3): applications listing exposes candidate PII
    // (names, emails, video URLs) + scores. It is an RH administrative view.
    // A CANDIDATO may only access their OWN application — through the
    // token-bound public flow (/api/public/apply) or their own result via
    // /api/results?resultId=<own>. Never this list. 403 + audit.
    if (auth.role === 'CANDIDATO') {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'ACCESS',
        resource: 'VacancyApplication',
        resourceId: (await params).id,
        companyId: auth.companyId,
        reason: 'CANDIDATO attempted to list vacancy applications',
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params

    const vacancy = await rlsDb.vacancy.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && vacancy.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const applications = vacancy.applications.map((a) => ({
      id: a.id,
      candidateName: a.candidateName,
      candidateEmail: a.candidateEmail,
      status: a.status,
      currentStep: a.currentStep,
      overallScore: a.overallScore,
      knowledgeScore: a.knowledgeScore,
      recommendation: a.recommendation,
      videoUrl: a.videoUrl,
      videoType: a.videoType,
      completedAt: a.completedAt,
      createdAt: a.createdAt,
    }))

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error listing vacancy applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
