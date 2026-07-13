import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// GET - Get vacancy by slug (public, NO auth)
// ============================================

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    const vacancy = await db.vacancy.findUnique({
      where: { slug },
      include: {
        company: {
          select: { name: true },
        },
        questions: {
          where: { type: 'MULTIPLE_CHOICE' },
          select: { id: true },
        },
      },
    })

    if (!vacancy || vacancy.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Vacancy not found or not active' }, { status: 404 })
    }

    return NextResponse.json({
      vacancy: {
        title: vacancy.title,
        description: vacancy.description,
        company: vacancy.company.name,
        sector: vacancy.sector,
        includePsicometrica: vacancy.includePsicometrica,
        includePsicologica: vacancy.includePsicologica,
        maxVideoSeconds: vacancy.maxVideoSeconds,
        knowledgeQuestionCount: vacancy.questions.length,
      },
    })
  } catch (error) {
    console.error('Error getting public vacancy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
