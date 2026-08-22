import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
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
    const { candidateName, phone, positionId, channel } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    // Derive invitedBy from auth; SUPER_ADMIN can optionally override
    const invitedBy = auth.role === 'SUPER_ADMIN'
      ? (body.invitedBy || auth.userId)
      : auth.userId

    // Phone is required
    if (!phone || !companyId || !positionId || !invitedBy) {
      return NextResponse.json({ error: 'Se requiere teléfono, companyId, positionId e invitedBy' }, { status: 400 })
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
    const deleteAll = searchParams.get('all') === 'true'

    const db = getUnscopedClient()

    // DELETE ALL invitations for the company (or all if SUPER_ADMIN)
    if (deleteAll) {
      const where = auth.role === 'SUPER_ADMIN' ? {} : { companyId: auth.companyId }

      // First, find the invitations so we can clean up associated users
      const invitations = await db.candidateInvitation.findMany({
        where,
        select: { id: true, phone: true, candidateName: true, companyId: true },
      })

      const result = await db.candidateInvitation.deleteMany({ where })

      // Clean up associated auto-created candidate users (cand_*.auto emails)
      // These users would otherwise become orphaned and cause issues when a new
      // invitation is created with the same phone (auto-login would find the
      // stale user instead of creating a fresh one)
      let cleanedUpUsers = 0
      if (invitations.length > 0) {
        const phones = invitations.map(i => i.phone).filter(Boolean) as string[]
        const companyIds = [...new Set(invitations.map(i => i.companyId))]

        if (phones.length > 0) {
          // Find auto-created candidate users matching these phones
          const autoUsers = await db.user.findMany({
            where: {
              role: 'CANDIDATO',
              companyId: { in: companyIds },
              phone: { in: phones },
              email: { contains: '@evaluhr.auto' },
            },
            select: { id: true },
          }).catch(() => [])

          if (autoUsers.length > 0) {
            const userIds = autoUsers.map(u => u.id)

            // Delete evaluation sessions first (cascade will handle responses)
            await db.evaluationSession.deleteMany({
              where: { candidateId: { in: userIds } },
            }).catch(() => {})

            // Delete consent logs
            await db.consentLog.deleteMany({
              where: { userId: { in: userIds } },
            }).catch(() => {})

            // Delete the candidate users
            const userDeleteResult = await db.user.deleteMany({
              where: { id: { in: userIds } },
            }).catch(() => ({ count: 0 }))

            cleanedUpUsers = userDeleteResult.count
          }
        }
      }

      return NextResponse.json({
        success: true,
        deleted: result.count,
        cleanedUpUsers,
        message: `${result.count} invitación(es) eliminada(s)${cleanedUpUsers > 0 ? `, ${cleanedUpUsers} usuario(s) candidato(s) limpiado(s)` : ''}`,
      })
    }

    if (!invitationId) {
      return NextResponse.json({ error: 'ID de invitación requerido' }, { status: 400 })
    }

    // Find the invitation
    const invitation = await db.candidateInvitation.findUnique({
      where: { id: invitationId },
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 })
    }

    // Check authorization: SUPER_ADMIN or same company
    if (auth.role !== 'SUPER_ADMIN' && auth.companyId !== invitation.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Delete the invitation (and associated candidate user if auto-created)
    // Also delete any evaluation sessions created for this candidate
    if (invitation.candidateName || invitation.phone) {
      // Find and delete auto-created candidate users matching this invitation
      const autoUsers = await db.user.findMany({
        where: {
          role: 'CANDIDATO',
          companyId: invitation.companyId,
          OR: [
            { phone: invitation.phone || undefined },
            { name: invitation.candidateName || undefined },
          ],
        },
        select: { id: true },
      })

      if (autoUsers.length > 0) {
        // Delete evaluation sessions first (cascade will handle responses)
        await db.evaluationSession.deleteMany({
          where: { candidateId: { in: autoUsers.map(u => u.id) } },
        }).catch(() => {})

        // Delete the candidate users
        await db.user.deleteMany({
          where: { id: { in: autoUsers.map(u => u.id) } },
        }).catch(() => {})
      }
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
