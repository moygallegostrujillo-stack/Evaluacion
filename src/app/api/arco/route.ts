import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { logAuditEvent, logUnauthorizedAccess } from '@/lib/audit'

/**
 * ARCO Rights Workflow API (Phase 3.5 — B4)
 *
 * Endpoints:
 *   POST /api/arco — Create a new ARCO request (candidate or admin)
 *   GET  /api/arco — List ARCO requests (admin: all for company; candidate: own)
 *   PATCH /api/arco?id=<requestId> — Update status (admin only)
 *
 * States: PENDING, IN_REVIEW, IDENTIFICATION_REQUIRED, APPROVED, REJECTED, COMPLETED, CANCELLED
 * Rights: ACCESS, RECTIFICATION, CANCELLATION, OPPOSITION
 *
 * SLA: 20 business days per LFPDPPP Art. 32 Reglamento
 */

const VALID_RIGHTS = ['ACCESS', 'RECTIFICATION', 'CANCELLATION', 'OPPOSITION']
const VALID_STATUSES = [
  'PENDING',
  'IN_REVIEW',
  'IDENTIFICATION_REQUIRED',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
  'CANCELLED',
]

/** Compute the legal deadline: 20 business days from now (excluding weekends) */
function computeLegalDeadline(from: Date = new Date()): Date {
  const deadline = new Date(from)
  let businessDays = 0
  while (businessDays < 20) {
    deadline.setDate(deadline.getDate() + 1)
    const day = deadline.getDay()
    if (day !== 0 && day !== 6) businessDays++ // skip Sunday(0) and Saturday(6)
  }
  return deadline
}

// ============================================
// POST — Create ARCO request
// ============================================
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    const {
      rightType,
      description,
      requesterName,
      requesterEmail,
      requesterPhone,
      companyId: bodyCompanyId,
    } = body as Record<string, unknown>

    // Validate required fields
    if (!rightType || !VALID_RIGHTS.includes(rightType as string)) {
      return NextResponse.json(
        { error: `rightType is required and must be one of: ${VALID_RIGHTS.join(', ')}` },
        { status: 400 }
      )
    }
    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'description is required' }, { status: 400 })
    }

    // Determine the requester
    // - CANDIDATO: creates request for themselves, companyId from their auth
    // - RH/GERENTE/SUPER_ADMIN: creates request on behalf of a data subject
    let userId: string | null = null
    let requesterNameFinal: string
    let requesterEmailFinal: string
    let requesterPhoneFinal: string | null = null
    let companyId: string

    if (auth.role === 'CANDIDATO') {
      // Self-service: candidate creates request for themselves
      userId = auth.userId
      const user = await getUnscopedClient().user.findUnique({
        where: { id: auth.userId },
        select: { name: true, email: true, phone: true, companyId: true },
      })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      requesterNameFinal = (requesterName as string) || user.name
      requesterEmailFinal = (requesterEmail as string) || user.email
      requesterPhoneFinal = (requesterPhone as string) || user.phone || null
      companyId = user.companyId || ''
      if (!companyId) {
        return NextResponse.json({ error: 'User has no company context' }, { status: 400 })
      }
    } else {
      // Admin creates request on behalf of a data subject
      if (!requesterName || !requesterEmail) {
        return NextResponse.json(
          { error: 'requesterName and requesterEmail are required for admin-created requests' },
          { status: 400 }
        )
      }
      requesterNameFinal = requesterName as string
      requesterEmailFinal = requesterEmail as string
      requesterPhoneFinal = (requesterPhone as string) || null

      // Company: from body or from admin's company
      companyId = (bodyCompanyId as string) || auth.companyId || ''
      if (!companyId) {
        return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
      }

      // Optional: link to existing User if email matches
      const linkedUser = await getUnscopedClient().user.findFirst({
        where: { email: requesterEmailFinal, companyId },
        select: { id: true },
      })
      if (linkedUser) userId = linkedUser.id
    }

    // Use unscoped client for the ArcoRequest create (RLS extension doesn't cover it yet)
    const db = getUnscopedClient()
    const arcoRequest = await db.arcoRequest.create({
      data: {
        userId,
        requesterName: requesterNameFinal,
        requesterEmail: requesterEmailFinal,
        requesterPhone: requesterPhoneFinal,
        rightType: rightType as string,
        description: description as string,
        companyId,
        status: 'PENDING',
        legalDeadline: computeLegalDeadline(),
      },
    })

    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'CREATE',
      resource: 'ArcoRequest',
      resourceId: arcoRequest.id,
      companyId,
      details: { rightType, requesterEmail: requesterEmailFinal },
    })

    return NextResponse.json({ arcoRequest }, { status: 201 })
  } catch (error) {
    console.error('[arco] POST error:', error)
    return NextResponse.json({ error: 'Error al crear solicitud ARCO' }, { status: 500 })
  }
}

// ============================================
// GET — List ARCO requests
// ============================================
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const rightType = searchParams.get('rightType')

    const db = getUnscopedClient()

    // CANDIDATO: can only see their own requests
    if (auth.role === 'CANDIDATO') {
      const requests = await db.arcoRequest.findMany({
        where: { userId: auth.userId },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ arcoRequests: requests })
    }

    // RH/GERENTE/SUPER_ADMIN: see requests for their company
    const targetCompanyId =
      auth.role === 'SUPER_ADMIN'
        ? searchParams.get('companyId') || auth.companyId || ''
        : auth.companyId || ''

    if (!targetCompanyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    const where: Record<string, unknown> = { companyId: targetCompanyId }
    if (status) where.status = status
    if (rightType) where.rightType = rightType

    const requests = await db.arcoRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ arcoRequests: requests })
  } catch (error) {
    console.error('[arco] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener solicitudes ARCO' }, { status: 500 })
  }
}

// ============================================
// PATCH — Update ARCO request status (admin only)
// ============================================
export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only RH/GERENTE/SUPER_ADMIN can update ARCO request status
    if (auth.role === 'CANDIDATO') {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'ArcoRequest',
        reason: 'CANDIDATO attempted to update ARCO request status',
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('id')
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    const { status, resolutionNotes, assignedTo, responseDocumentUrl } = body as Record<string, unknown>

    if (status && !VALID_STATUSES.includes(status as string)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    const db = getUnscopedClient()

    const existing = await db.arcoRequest.findUnique({
      where: { id: requestId },
    })
    if (!existing) {
      return NextResponse.json({ error: 'ARCO request not found' }, { status: 404 })
    }

    // Cross-tenant check
    if (auth.role !== 'SUPER_ADMIN' && existing.companyId !== auth.companyId) {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'ArcoRequest',
        resourceId: requestId,
        companyId: auth.companyId,
        reason: 'Cross-tenant ARCO request update attempt',
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Build update data
    const updateData: Record<string, unknown> = {}
    if (status) {
      updateData.status = status
      // If status is COMPLETED/REJECTED, set resolvedAt
      if (status === 'COMPLETED' || status === 'REJECTED') {
        updateData.resolvedAt = new Date()
      }
    }
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null
    if (responseDocumentUrl !== undefined) updateData.responseDocumentUrl = responseDocumentUrl

    const updated = await db.arcoRequest.update({
      where: { id: requestId },
      data: updateData,
    })

    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'UPDATE',
      resource: 'ArcoRequest',
      resourceId: requestId,
      companyId: existing.companyId,
      details: { previousStatus: existing.status, newStatus: status },
    })

    return NextResponse.json({ arcoRequest: updated })
  } catch (error) {
    console.error('[arco] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar solicitud ARCO' }, { status: 500 })
  }
}
