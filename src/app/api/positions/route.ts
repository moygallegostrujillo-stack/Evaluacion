import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { generateTemplatesForPosition } from '@/lib/generate-templates'
import { logAuditEvent, logUnauthorizedAccess } from '@/lib/audit'
import { resolveTargetCompanyId } from '@/lib/impersonation'
import { getAggregatePositionCatalog } from '@/lib/admin-db'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const { targetCompanyId } = await resolveTargetCompanyId(auth, req, {
      action: 'ACCESS',
      resource: 'Position',
    })
    const all = req.nextUrl.searchParams.get('all')

    // If "all" is set, this is the SA GLOBAL position catalog.
    // ── PHASE 3.5-H (PARTE 7 / VUL-H6): the global catalog is an AGGREGATE
    // operation on the ADMIN DB connection (evalhr_sa, audited per
    // invocation, fail-closed without ADMIN_DATABASE_URL). No
    // getUnscopedClient. Non-SUPER_ADMIN roles → 403 + audit: each role
    // already receives its own company positions through the standard list
    // or the RLS-scoped branch below.
    if (all === 'true') {
      if (auth.role !== 'SUPER_ADMIN') {
        await logUnauthorizedAccess(req, {
          actorId: auth.userId,
          action: 'ACCESS',
          resource: 'Position',
          companyId: auth.companyId,
          reason: 'Non-SUPER_ADMIN requested the global position catalog (?all=true)',
        })
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const { positions } = await getAggregatePositionCatalog({
        req,
        actorId: auth.userId,
        role: auth.role,
      })
      return NextResponse.json({ positions })
    }

    // Standard list — RLS handles scoping
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    const positions = await rlsDb.position.findMany({
      where: { active: true, status: 'ACTIVE' },
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
    // Log SA impersonation for body-based companyId (helper only reads query params)
    if (auth.role === 'SUPER_ADMIN' && targetCompanyId && targetCompanyId !== auth.companyId) {
      await logAuditEvent(req, {
        actorId: auth.userId,
        action: 'CREATE',
        resource: 'Position',
        companyId: auth.companyId,
        details: {
          impersonation: true,
          targetCompanyId,
          actorRole: auth.role,
          action: 'CREATE',
        },
      })
    }
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
    const { targetCompanyId } = await resolveTargetCompanyId(auth, req, {
      action: 'DELETE',
      resource: 'Position',
      resourceId: positionId,
    })
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
// NOTE: The vacancy system previously had AI-generated knowledge questions via
// POST /api/vacancies/[id]/generate-questions. The position system already
// auto-generates templates via generateTemplatesForPosition on creation.
// If AI knowledge question generation is needed in the future, it can be
// added here as a separate endpoint (e.g., PATCH with action=generate-ai-questions).
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

    // PHASE 3.5-B.2 (B1): Cross-tenant ownership check.
    // A non-SUPER_ADMIN user can ONLY generate templates for positions
    // belonging to their own company. This prevents cross-tenant writes.
    if (auth.role !== 'SUPER_ADMIN' && position.companyId !== auth.companyId) {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'Position',
        resourceId: positionId,
        companyId: auth.companyId,
        reason: 'Cross-tenant template generation attempt',
      })
      return NextResponse.json(
        { error: 'Forbidden: you can only modify positions within your own company' },
        { status: 403 }
      )
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

// PUT: Change position status (ACTIVE ↔ PAUSED → CLOSED → ACTIVE)
// Valid transitions: ACTIVE→PAUSED, PAUSED→ACTIVE, any→CLOSED, CLOSED→ACTIVE
export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const validStatuses = ['ACTIVE', 'PAUSED', 'CLOSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be ACTIVE, PAUSED, or CLOSED' }, { status: 400 })
    }

    // Use RLS client scoped to the user's company (or SUPER_ADMIN target)
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    // Log SA impersonation for body-based companyId (helper only reads query params)
    if (auth.role === 'SUPER_ADMIN' && targetCompanyId && targetCompanyId !== auth.companyId) {
      await logAuditEvent(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'Position',
        resourceId: id,
        companyId: auth.companyId,
        details: {
          impersonation: true,
          targetCompanyId,
          actorRole: auth.role,
          action: 'UPDATE',
        },
      })
    }
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    const position = await rlsDb.position.findUnique({
      where: { id },
    })
    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    // Validate status transitions
    const currentStatus = (position as { status?: string }).status || 'ACTIVE'
    const allowedTransitions: Record<string, string[]> = {
      ACTIVE: ['PAUSED', 'CLOSED'],
      PAUSED: ['ACTIVE', 'CLOSED'],
      CLOSED: ['ACTIVE'],
    }
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json({
        error: `Cannot transition from ${currentStatus} to ${status}. Allowed: ${allowedTransitions[currentStatus]?.join(', ')}`,
      }, { status: 400 })
    }

    const updated = await rlsDb.position.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ position: updated })
  } catch (error) {
    console.error('Positions PUT error:', error)
    return NextResponse.json({ error: 'Error updating position status' }, { status: 500 })
  }
}
