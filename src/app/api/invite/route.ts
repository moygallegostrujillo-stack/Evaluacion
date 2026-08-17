import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

import crypto from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? searchParams.get('companyId')
      : null
    const companyId = targetCompanyId || auth.companyId

    if (!companyId) {
      return NextResponse.json({ invitations: [] })
    }

    const db = getUnscopedClient()
    const invitations = await db.candidateInvitation.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        candidateName: true,
        email: true,
        phone: true,
        token: true,
        status: true,
        channel: true,
        createdAt: true,
        position: { select: { id: true, title: true } },
      },
    })

    return NextResponse.json({
      invitations: invitations.map(inv => ({
        id: inv.id,
        candidateName: inv.candidateName,
        email: inv.email,
        phone: inv.phone,
        token: inv.token,
        status: inv.status,
        channel: inv.channel,
        positionTitle: inv.position?.title,
        createdAt: inv.createdAt,
      })),
    })
  } catch (error) {
    console.error('Invite GET error:', error)
    return NextResponse.json({ error: 'Error fetching invitations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { candidateName, email, phone, positionId, channel } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createRLSClient({ ...auth, companyId: targetCompanyId })
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    // Derive invitedBy from auth; SUPER_ADMIN can optionally override
    const invitedBy = auth.role === 'SUPER_ADMIN'
      ? (body.invitedBy || auth.userId)
      : auth.userId

    // At least phone or email is required
    if ((!email && !phone) || !companyId || !positionId || !invitedBy) {
      return NextResponse.json({ error: 'Se requiere al menos teléfono o correo, companyId, positionId e invitedBy' }, { status: 400 })
    }

    // Verify position exists
    const position = await getUnscopedClient().position.findUnique({
      where: { id: positionId },
    })

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    // Check for duplicate PENDING invitation (same phone + position)
    const db = getUnscopedClient()
    if (phone) {
      const existingPending = await db.candidateInvitation.findFirst({
        where: {
          phone,
          positionId,
          status: 'PENDING',
          companyId,
        },
      })
      if (existingPending) {
        return NextResponse.json(
          { error: 'Ya existe una invitación pendiente para este teléfono y puesto', duplicateId: existingPending.id },
          { status: 409 }
        )
      }
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex')

    // Set expiration to 7 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invitation = await rlsDb.candidateInvitation.create({
      data: {
        candidateName: candidateName || null,
        email: email || null,
        phone: phone || null,
        token,
        status: 'PENDING',
        channel: channel || 'WHATSAPP',
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
        companyId,
        positionId,
        invitedBy,
        expiresAt,
      },
      include: {
        company: {
          select: { id: true, name: true },
        },
        position: {
          select: { id: true, title: true },
        },
      },
    })

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        candidateName: invitation.candidateName,
        email: invitation.email,
        phone: invitation.phone,
        token: invitation.token,
        status: invitation.status,
        channel: invitation.channel,
        expiresAt: invitation.expiresAt,
        companyId: invitation.companyId,
        positionId: invitation.positionId,
        positionTitle: invitation.position?.title,
        createdAt: invitation.createdAt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Invite POST error:', error)
    return NextResponse.json({ error: 'Error creating invitation' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const invitationId = searchParams.get('id')

    if (!invitationId) {
      return NextResponse.json({ error: 'ID de invitación requerido' }, { status: 400 })
    }

    const db = getUnscopedClient()

    // Find the invitation
    const invitation = await db.candidateInvitation.findUnique({
      where: { id: invitationId },
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 })
    }

    // Only allow deleting PENDING invitations
    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Solo se pueden eliminar invitaciones pendientes' },
        { status: 400 }
      )
    }

    // Check authorization: SUPER_ADMIN or same company
    if (auth.role !== 'SUPER_ADMIN' && auth.companyId !== invitation.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await db.candidateInvitation.delete({
      where: { id: invitationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Invite DELETE error:', error)
    return NextResponse.json({ error: 'Error deleting invitation' }, { status: 500 })
  }
}
