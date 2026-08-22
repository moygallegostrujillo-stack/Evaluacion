import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { generateTemplatesForPosition } from '@/lib/generate-templates'

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
    const sector = req.nextUrl.searchParams.get('sector')
    const all = req.nextUrl.searchParams.get('all')

    // If "all" is set, return all active positions (SUPER_ADMIN only for multi-tenant isolation)
    if (all === 'true') {
      // Only SUPER_ADMIN can see positions from all companies — use unscoped client
      if (auth.role === 'SUPER_ADMIN') {
        const positions = await getUnscopedClient().position.findMany({
          where: { active: true, ...(sector ? { sector } : {}) },
          orderBy: [{ sector: 'asc' }, { title: 'asc' }],
          include: {
            company: {
              select: { id: true, name: true, sector: true },
            },
            evaluationTemplates: {
              select: {
                id: true,
                name: true,
                type: true,
                order: true,
                _count: { select: { questions: true } },
              },
              orderBy: { order: 'asc' },
            },
            _count: {
              select: { sessions: true },
            },
          },
        })
        return NextResponse.json({ positions })
      }

      // Non-admin: use RLS client (auto-scoped to their company)
      const { client: rlsDb } = createRLSClient(auth)
      const positions = await rlsDb.position.findMany({
        where: { active: true, ...(sector ? { sector } : {}) },
        orderBy: [{ sector: 'asc' }, { title: 'asc' }],
        include: {
          company: {
            select: { id: true, name: true, sector: true },
          },
          evaluationTemplates: {
            select: {
              id: true,
              name: true,
              type: true,
              order: true,
              _count: { select: { questions: true } },
            },
            orderBy: { order: 'asc' },
          },
          _count: {
            select: { sessions: true },
          },
        },
      })
      return NextResponse.json({ positions })
    }

    // Standard list — RLS handles scoping
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    const positions = await rlsDb.position.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        evaluationTemplates: {
          select: {
            id: true,
            name: true,
            type: true,
            order: true,
            _count: { select: { questions: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { sessions: true },
        },
      },
    })

    return NextResponse.json({ positions })
  } catch (error) {
    console.error('Positions GET error:', error)
    return NextResponse.json({ error: 'Error fetching positions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, sector, category, description, hasKnowledgeTest } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!title || !sector || !category || !companyId) {
      return NextResponse.json({ error: 'title, sector, category, and companyId are required' }, { status: 400 })
    }

    const position = await rlsDb.position.create({
      data: {
        title,
        sector,
        category,
        description: description || null,
        hasKnowledgeTest: hasKnowledgeTest || false,
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
        companyId,
      },
    })

    // Auto-generate evaluation templates and questions for the new position
    try {
      await generateTemplatesForPosition(position.id, title, category, hasKnowledgeTest || false)
    } catch (templateError) {
      console.error('Error generating templates (non-fatal):', templateError)
      // Don't fail position creation if template generation fails
    }

    return NextResponse.json({ position }, { status: 201 })
  } catch (error) {
    console.error('Positions POST error:', error)
    return NextResponse.json({ error: 'Error creating position' }, { status: 500 })
  }
}

// DELETE: Deactivate a position (soft-delete — sets active=false)
// Positions with existing evaluation sessions cannot be deleted to preserve data integrity.
export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const positionId = req.nextUrl.searchParams.get('id')
    if (!positionId) {
      return NextResponse.json({ error: 'position id is required' }, { status: 400 })
    }

    // Use RLS client scoped to the user's company (or SUPER_ADMIN target)
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? req.nextUrl.searchParams.get('companyId')
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    // Check position exists and belongs to this company
    const position = await rlsDb.position.findUnique({
      where: { id: positionId },
    })
    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    // Soft-delete: set active=false
    await rlsDb.position.update({
      where: { id: positionId },
      data: { active: false },
    })

    return NextResponse.json({ success: true, positionId })
  } catch (error) {
    console.error('Positions DELETE error:', error)
    return NextResponse.json({ error: 'Error deactivating position' }, { status: 500 })
  }
}

// PATCH: Generate templates for existing positions that don't have them
export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { positionId } = body

    if (!positionId) {
      return NextResponse.json({ error: 'positionId is required' }, { status: 400 })
    }

    const db = getUnscopedClient()
    const position = await db.position.findUnique({
      where: { id: positionId },
    })

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    const result = await generateTemplatesForPosition(
      position.id,
      position.title,
      position.category,
      position.hasKnowledgeTest
    )

    return NextResponse.json({
      success: true,
      positionId: position.id,
      templatesCreated: result.templatesCreated,
      questionsCreated: result.questionsCreated,
    })
  } catch (error) {
    console.error('Positions PATCH error:', error)
    return NextResponse.json({ error: 'Error generating templates' }, { status: 500 })
  }
}
