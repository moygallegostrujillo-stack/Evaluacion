import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromHeaders } from '@/lib/auth'

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

    const { id } = await params

    const vacancy = await db.vacancy.findUnique({
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

    // Non-SUPER_ADMIN users can only access applications for vacancies in their own company
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
