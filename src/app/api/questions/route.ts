import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders, canAccessCompany } from '@/lib/auth'

// GET: List questions for a position, optionally filtered by company
export async function GET(req: NextRequest) {
  try {
    // ── Auth check ──
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const positionId = req.nextUrl.searchParams.get('positionId')
    const companyIdParam = req.nextUrl.searchParams.get('companyId')
    const templateId = req.nextUrl.searchParams.get('templateId')

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN' && companyIdParam
      ? companyIdParam
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    if (templateId) {
      // Get questions for a specific template
      // RLS auto-filters by companyId for non-SUPER_ADMIN (including null companyId = global questions)
      // Note: Question has optional companyId (null = global). RLS filters to companyId only,
      // which would exclude global (null) questions. We need unscoped for this query to get all
      // global + company questions.
      const unscopedDb = getUnscopedClient()
      const questions = await unscopedDb.question.findMany({
        where: { evaluationTemplateId: templateId },
        orderBy: { order: 'asc' },
      })

      // Enforce company access: if user is not SUPER_ADMIN, filter to only their company's questions + global
      const filtered = auth.role === 'SUPER_ADMIN'
        ? questions
        : questions.filter(q => !q.companyId || q.companyId === auth.companyId)

      return NextResponse.json({
        questions: filtered.map(q => ({
          ...q,
          options: q.options ? (() => { try { const p = JSON.parse(q.options); return Array.isArray(p) ? p : null; } catch { return null; } })() : null,
        })),
      })
    }

    if (!positionId) {
      return NextResponse.json({ error: 'positionId or templateId is required' }, { status: 400 })
    }

    // Get all templates for this position
    // Use unscoped client for questions since they have optional companyId (null = global)
    const unscopedDb = getUnscopedClient()
    const templates = await unscopedDb.evaluationTemplate.findMany({
      where: { positionId, active: true },
      orderBy: { order: 'asc' },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    // Parse options for each question
    const parseOptions = (options: string | null | undefined): string[] | null => {
      if (!options) return null
      try {
        const parsed = JSON.parse(options)
        return Array.isArray(parsed) ? parsed : null
      } catch {
        return null
      }
    }

    const result = templates.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      order: t.order,
      questions: t.questions
        // Non-SUPER_ADMIN users can only see their own company's custom questions + global questions
        .filter(q => auth.role === 'SUPER_ADMIN' || !q.companyId || q.companyId === auth.companyId)
        .map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: parseOptions(q.options),
          category: q.category,
          order: q.order,
          reverseScored: q.reverseScored,
          isCustom: q.isCustom,
          correctAnswer: q.correctAnswer,
          companyId: q.companyId,
        })),
    }))

    return NextResponse.json({ templates: result })
  } catch (error) {
    console.error('Questions GET error:', error)
    return NextResponse.json({ error: 'Error fetching questions' }, { status: 500 })
  }
}

// POST: Create a custom question
export async function POST(req: NextRequest) {
  try {
    // ── Auth check ──
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { templateId, text, type, options, category, correctAnswer, companyId: bodyCompanyId } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN' && bodyCompanyId
      ? bodyCompanyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!templateId || !text || !type || !companyId) {
      return NextResponse.json({ error: 'templateId, text, type, and companyId are required' }, { status: 400 })
    }

    // Verify the template exists and belongs to a position of this company
    const unscopedDb = getUnscopedClient()
    const template = await unscopedDb.evaluationTemplate.findUnique({
      where: { id: templateId },
      include: { position: true },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template.position.companyId !== companyId) {
      return NextResponse.json({ error: 'No tienes permiso para agregar preguntas a este puesto' }, { status: 403 })
    }

    // Get the current max order for this template
    const maxOrderQuestion = await rlsDb.question.findFirst({
      where: { evaluationTemplateId: templateId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const nextOrder = (maxOrderQuestion?.order || 0) + 1

    const question = await rlsDb.question.create({
      data: {
        text,
        type,
        options: options ? JSON.stringify(options) : null,
        category: category || 'KNOWLEDGE',
        order: nextOrder,
        isCustom: true,
        correctAnswer: correctAnswer ?? null,
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
        ...(companyId ? { companyId } : {}),
        evaluationTemplateId: templateId,
      },
    })

    return NextResponse.json({
      question: {
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.options ? (() => { try { const p = JSON.parse(question.options); return Array.isArray(p) ? p : null; } catch { return null; } })() : null,
        category: question.category,
        order: question.order,
        isCustom: question.isCustom,
        correctAnswer: question.correctAnswer,
        companyId: question.companyId,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Questions POST error:', error)
    return NextResponse.json({ error: 'Error creating question' }, { status: 500 })
  }
}

// PUT: Update a custom question
export async function PUT(req: NextRequest) {
  try {
    // ── Auth check ──
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { questionId, text, type, options, category, correctAnswer, companyId: bodyCompanyId } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN' && bodyCompanyId
      ? bodyCompanyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!questionId || !companyId) {
      return NextResponse.json({ error: 'questionId and companyId are required' }, { status: 400 })
    }

    // Verify the question exists and belongs to this company
    // Use unscoped for findUnique since Question has optional companyId
    const unscopedDb = getUnscopedClient()
    const existing = await unscopedDb.question.findUnique({
      where: { id: questionId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    if (!existing.isCustom) {
      return NextResponse.json({ error: 'No puedes editar preguntas predeterminadas del sistema' }, { status: 403 })
    }

    // Enforce company access via canAccessCompany utility (defense-in-depth)
    if (!canAccessCompany(auth.role, auth.companyId, existing.companyId || '')) {
      return NextResponse.json({ error: 'No tienes permiso para editar esta pregunta' }, { status: 403 })
    }

    const updateData: any = {}
    if (text !== undefined) updateData.text = text
    if (type !== undefined) updateData.type = type
    if (options !== undefined) updateData.options = JSON.stringify(options)
    if (category !== undefined) updateData.category = category
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer

    const question = await rlsDb.question.update({
      where: { id: questionId },
      data: updateData,
    })

    return NextResponse.json({
      question: {
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.options ? (() => { try { const p = JSON.parse(question.options); return Array.isArray(p) ? p : null; } catch { return null; } })() : null,
        category: question.category,
        order: question.order,
        isCustom: question.isCustom,
        correctAnswer: question.correctAnswer,
        companyId: question.companyId,
      },
    })
  } catch (error) {
    console.error('Questions PUT error:', error)
    return NextResponse.json({ error: 'Error updating question' }, { status: 500 })
  }
}

// DELETE: Delete a custom question
export async function DELETE(req: NextRequest) {
  try {
    // ── Auth check ──
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const questionId = req.nextUrl.searchParams.get('questionId')
    const companyIdParam = req.nextUrl.searchParams.get('companyId')

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN' && companyIdParam
      ? companyIdParam
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!questionId || !companyId) {
      return NextResponse.json({ error: 'questionId and companyId are required' }, { status: 400 })
    }

    // Use unscoped for findUnique since Question has optional companyId
    const unscopedDb = getUnscopedClient()
    const existing = await unscopedDb.question.findUnique({
      where: { id: questionId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    if (!existing.isCustom) {
      return NextResponse.json({ error: 'No puedes eliminar preguntas predeterminadas del sistema' }, { status: 403 })
    }

    // Enforce company access via canAccessCompany utility (defense-in-depth)
    if (!canAccessCompany(auth.role, auth.companyId, existing.companyId || '')) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar esta pregunta' }, { status: 403 })
    }

    await rlsDb.question.delete({
      where: { id: questionId },
    })

    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Questions DELETE error:', error)
    return NextResponse.json({ error: 'Error deleting question' }, { status: 500 })
  }
}
