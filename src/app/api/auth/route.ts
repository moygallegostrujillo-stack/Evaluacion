import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { hashPassword, verifyPassword, isLegacyHash } from '@/lib/password'
import { generateToken } from '@/lib/auth'
import crypto from 'crypto'

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
          consentGiven: false,
          consentOption: null,
          anonymousStats: false,
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

    // Auto-login via invitation token — NO registration required
    // The token IS the auth. RH already provided name + phone.
    if (action === 'auto-login') {
      const { token: invitationToken } = body

      if (!invitationToken) {
        return NextResponse.json({ error: 'Token de invitación requerido' }, { status: 400 })
      }

      const invitation = await db.candidateInvitation.findUnique({
        where: { token: invitationToken },
        include: { position: true, company: true },
      })

      if (!invitation) {
        return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 400 })
      }

      if (invitation.status === 'EXPIRED' || invitation.expiresAt < new Date()) {
        if (invitation.status !== 'EXPIRED') {
          await db.candidateInvitation.update({
            where: { id: invitation.id },
            data: { status: 'EXPIRED' },
          })
        }
        return NextResponse.json({ error: 'La invitación ha expirado' }, { status: 400 })
      }

      // If already registered (candidate already auto-logged before), find existing user
      let user = null

      if (invitation.status === 'REGISTERED' || invitation.status === 'COMPLETED') {
        // Find existing candidate user for this invitation
        // Look by phone first (most reliable for WhatsApp invitations)
        if (invitation.phone) {
          user = await db.user.findFirst({
            where: { phone: invitation.phone, companyId: invitation.companyId, role: 'CANDIDATO' },
            include: { company: true },
          })
        }
        // Fallback: find by email
        if (!user && invitation.email) {
          user = await db.user.findUnique({
            where: { email: invitation.email },
            include: { company: true },
          })
        }
        // Fallback: find by name + company
        if (!user && invitation.candidateName) {
          user = await db.user.findFirst({
            where: { name: invitation.candidateName, companyId: invitation.companyId, role: 'CANDIDATO' },
            include: { company: true },
          })
        }

        if (!user) {
          return NextResponse.json({ error: 'No se encontró la cuenta del candidato. Contacta a Recursos Humanos.' }, { status: 400 })
        }
      } else if (invitation.status === 'PENDING') {
        // First time: auto-create the user (no email/password required)
        // Generate a unique email placeholder for the DB (email is unique in schema)
        const phoneClean = (invitation.phone || '').replace(/[^0-9]/g, '')
        const autoEmail = `cand_${phoneClean || invitation.id.slice(0, 12)}@evaluhr.auto`

        // Check if a user with this auto-email already exists
        const existingAutoUser = await db.user.findUnique({ where: { email: autoEmail } })

        if (existingAutoUser) {
          user = existingAutoUser
        } else {
          // Create user without password — token is their auth
          user = await db.user.create({
            data: {
              email: autoEmail,
              name: invitation.candidateName || invitation.phone || 'Candidato',
              password: await hashPassword(crypto.randomUUID()), // Random unusable password
              role: 'CANDIDATO',
              phone: invitation.phone,
              companyId: invitation.companyId,
            },
            include: { company: true },
          })
        }

        // Mark invitation as REGISTERED
        await db.candidateInvitation.update({
          where: { id: invitation.id },
          data: { status: 'REGISTERED' },
        })

        // Create evaluation session if not exists
        const existingSession = await db.evaluationSession.findFirst({
          where: {
            candidateId: user.id,
            positionId: invitation.positionId,
            companyId: invitation.companyId,
          },
        })

        if (!existingSession) {
          await db.evaluationSession.create({
            data: {
              candidateId: user.id,
              positionId: invitation.positionId,
              companyId: invitation.companyId,
              status: 'NOT_STARTED',
            },
          })
        }
      }

      if (!user) {
        return NextResponse.json({ error: 'No se pudo autenticar al candidato' }, { status: 400 })
      }

      // Reload user with company if not already included
      const fullUser = user.company ? user : await db.user.findUnique({
        where: { id: user.id },
        include: { company: true },
      })

      // Generate JWT
      const jwtToken = await generateToken({
        sub: fullUser!.id,
        email: fullUser!.email,
        name: fullUser!.name,
        role: fullUser!.role,
        companyId: fullUser!.companyId || undefined,
        companyName: fullUser!.company?.name || undefined,
        companySector: fullUser!.company?.sector || undefined,
      })

      const response = NextResponse.json({
        user: {
          id: fullUser!.id,
          email: fullUser!.email,
          name: fullUser!.name,
          role: fullUser!.role,
          companyId: fullUser!.companyId,
          companyName: fullUser!.company?.name,
          companySector: fullUser!.company?.sector,
          consentGiven: fullUser!.consentGiven,
          consentOption: fullUser!.consentOption,
          anonymousStats: fullUser!.anonymousStats,
          phone: fullUser!.phone,
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
