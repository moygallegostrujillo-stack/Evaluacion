import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromHeaders } from '@/lib/auth'

import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { email, phone, positionId, channel } = body

    // Derive companyId from auth; SUPER_ADMIN can optionally override
    const companyId = auth.role === 'SUPER_ADMIN'
      ? (body.companyId || auth.companyId)
      : auth.companyId

    // Derive invitedBy from auth; SUPER_ADMIN can optionally override
    const invitedBy = auth.role === 'SUPER_ADMIN'
      ? (body.invitedBy || auth.userId)
      : auth.userId

    if (!email || !companyId || !positionId || !invitedBy) {
      return NextResponse.json({ error: 'email, companyId, positionId, and invitedBy are required' }, { status: 400 })
    }

    // Verify position exists
    const position = await db.position.findUnique({
      where: { id: positionId },
    })

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex')

    // Set expiration to 7 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invitation = await db.candidateInvitation.create({
      data: {
        email,
        phone: phone || null,
        token,
        status: 'PENDING',
        channel: channel || 'EMAIL',
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
        email: invitation.email,
        phone: invitation.phone,
        token: invitation.token,
        status: invitation.status,
        channel: invitation.channel,
        expiresAt: invitation.expiresAt,
        company: invitation.company,
        position: invitation.position,
        createdAt: invitation.createdAt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Invite POST error:', error)
    return NextResponse.json({ error: 'Error creating invitation' }, { status: 500 })
  }
}
