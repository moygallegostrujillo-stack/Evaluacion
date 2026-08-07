import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

// ============================================
// GET - List all questions for a vacancy
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

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params

    const vacancy = await rlsDb.vacancy.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && vacancy.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const questions = vacancy.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options ? JSON.parse(q.options) : null,
      correctAnswer: q.correctAnswer,
      order: q.order,
      createdAt: q.createdAt,
    }))

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error listing vacancy questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// POST - Add a question to a vacancy
// ============================================

interface CreateQuestionBody {
  text: string
  options: string[]
  correctAnswer: number
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params
    const body: CreateQuestionBody = await req.json()
    const { text, options, correctAnswer } = body

    if (!text || !options || correctAnswer === undefined) {
      return NextResponse.json({ error: 'text, options, and correctAnswer are required' }, { status: 400 })
    }

    const vacancy = await rlsDb.vacancy.findUnique({
      where: { id },
      include: { questions: { select: { order: true } } },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && vacancy.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Auto-increment order based on existing max
    const maxOrder = vacancy.questions.length > 0
      ? Math.max(...vacancy.questions.map((q) => q.order))
      : 0

    const question = await rlsDb.vacancyQuestion.create({
      data: {
        text,
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify(options),
        correctAnswer,
        order: maxOrder + 1,
        vacancyId: id,
      },
    })

    return NextResponse.json({
      question: {
        id: question.id,
        text: question.text,
        type: question.type,
        options: JSON.parse(question.options || '[]'),
        correctAnswer: question.correctAnswer,
        order: question.order,
        createdAt: question.createdAt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vacancy question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// PUT - Update a question
// ============================================

interface UpdateQuestionBody {
  questionId: string
  text?: string
  options?: string[]
  correctAnswer?: number
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params
    const body: UpdateQuestionBody = await req.json()
    const { questionId, text, options, correctAnswer } = body

    if (!questionId) {
      return NextResponse.json({ error: 'questionId is required' }, { status: 400 })
    }

    const existing = await rlsDb.vacancyQuestion.findFirst({
      where: { id: questionId, vacancyId: id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Question not found in this vacancy' }, { status: 404 })
    }

    // Defense-in-depth: verify vacancy ownership
    const vacancy = await rlsDb.vacancy.findUnique({ where: { id } })
    if (auth.role !== 'SUPER_ADMIN' && vacancy?.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const question = await rlsDb.vacancyQuestion.update({
      where: { id: questionId },
      data: {
        ...(text !== undefined ? { text } : {}),
        ...(options !== undefined ? { options: JSON.stringify(options) } : {}),
        ...(correctAnswer !== undefined ? { correctAnswer } : {}),
      },
    })

    return NextResponse.json({
      question: {
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.options ? JSON.parse(question.options) : null,
        correctAnswer: question.correctAnswer,
        order: question.order,
        createdAt: question.createdAt,
      },
    })
  } catch (error) {
    console.error('Error updating vacancy question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// DELETE - Delete a question from a vacancy
// ============================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params
    const questionId = req.nextUrl.searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json({ error: 'questionId is required' }, { status: 400 })
    }

    const existing = await rlsDb.vacancyQuestion.findFirst({
      where: { id: questionId, vacancyId: id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Question not found in this vacancy' }, { status: 404 })
    }

    // Defense-in-depth: verify vacancy ownership
    const vacancy = await rlsDb.vacancy.findUnique({ where: { id } })
    if (auth.role !== 'SUPER_ADMIN' && vacancy?.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await rlsDb.vacancyQuestion.delete({
      where: { id: questionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vacancy question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
