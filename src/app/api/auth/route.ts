import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'login') {
      const { email, password } = body
      const user = await db.user.findUnique({
        where: { email },
        include: { company: true },
      })

      if (!user || user.password !== hashPassword(password)) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
      }

      if (!user.active) {
        return NextResponse.json({ error: 'Cuenta desactivada' }, { status: 403 })
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          companyName: user.company?.name,
          companySector: user.company?.sector,
          consentGiven: user.consentGiven,
        },
        token: `token_${user.id}_${Date.now()}`,
      })
    }

    if (action === 'register') {
      const { email, name, password, token, phone } = body

      const invitation = await db.candidateInvitation.findUnique({
        where: { token },
        include: { position: true, company: true },
      })

      if (!invitation || invitation.status !== 'PENDING') {
        return NextResponse.json({ error: 'Invitación inválida o expirada' }, { status: 400 })
      }

      if (invitation.expiresAt < new Date()) {
        await db.candidateInvitation.update({
          where: { id: invitation.id },
          data: { status: 'EXPIRED' },
        })
        return NextResponse.json({ error: 'La invitación ha expirado' }, { status: 400 })
      }

      const existingUser = await db.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 })
      }

      const user = await db.user.create({
        data: {
          email,
          name,
          password: hashPassword(password),
          role: 'CANDIDATO',
          phone,
          companyId: invitation.companyId,
        },
      })

      await db.candidateInvitation.update({
        where: { id: invitation.id },
        data: { status: 'REGISTERED' },
      })

      await db.evaluationSession.create({
        data: {
          candidateId: user.id,
          positionId: invitation.positionId,
          companyId: invitation.companyId,
          status: 'NOT_STARTED',
        },
      })

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          companyName: invitation.company.name,
          companySector: invitation.company.sector,
          consentGiven: false,
        },
        token: `token_${user.id}_${Date.now()}`,
      })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
