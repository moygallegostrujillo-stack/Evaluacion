import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { hashPassword, verifyPassword, isLegacyHash } from '@/lib/password'
import { generateToken } from '@/lib/auth'

const db = getUnscopedClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'logout') {
      const response = NextResponse.json({ success: true })
      response.cookies.set('evaluhr_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expire immediately
        path: '/',
      })
      return response
    }

    if (action === 'login') {
      const { email, password } = body
      const user = await db.user.findUnique({
        where: { email },
        include: { company: true },
      })

      if (!user) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
      }

      // Verify password (supports both bcrypt and legacy SHA-256)
      const { valid, needsRehash } = await verifyPassword(password, user.password)

      if (!valid) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
      }

      if (!user.active) {
        return NextResponse.json({ error: 'Cuenta desactivada' }, { status: 403 })
      }

      // Transparent migration: re-hash with bcrypt if still on SHA-256
      if (needsRehash) {
        const newHash = await hashPassword(password)
        await db.user.update({
          where: { id: user.id },
          data: { password: newHash },
        })
      }

      // Generate real JWT token
      const token = await generateToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId || undefined,
        companyName: user.company?.name || undefined,
        companySector: user.company?.sector || undefined,
      })

      // Set token as httpOnly cookie for extra security
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          companyName: user.company?.name,
          companySector: user.company?.sector,
          consentGiven: user.consentGiven,
          consentOption: user.consentOption,
          anonymousStats: user.anonymousStats,
          consentConfirmed: user.consentConfirmed,
          consentVersion: user.consentVersion,
        },
        token,
      })

      response.cookies.set('evaluhr_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      })

      return response
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

      const hashedPassword = await hashPassword(password)
      const user = await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
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

      // Generate real JWT token
      const jwtToken = await generateToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId || undefined,
        companyName: invitation.company.name || undefined,
        companySector: invitation.company.sector || undefined,
      })

      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          companyName: invitation.company.name,
          companySector: invitation.company.sector,
          consentGiven: user.consentGiven,
          consentOption: user.consentOption,
          anonymousStats: user.anonymousStats,
          consentConfirmed: user.consentConfirmed,
          consentVersion: user.consentVersion,
        },
        token: jwtToken,
      })

      response.cookies.set('evaluhr_token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
