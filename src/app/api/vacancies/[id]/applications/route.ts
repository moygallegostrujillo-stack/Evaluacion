import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// GET - List applications for a vacancy
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
