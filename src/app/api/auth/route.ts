import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { hashPassword, verifyPassword, isLegacyHash } from '@/lib/password'
import { generateToken } from '@/lib/auth'
import crypto from 'crypto'

const db = getUnscopedClient()

/**
 * Safely fetch a user with company, resilient to missing consent columns in prod DB.
 * If the full query fails (because consentOption/anonymousStats/etc. columns don't exist),
 * it retries with a minimal select and provides default values for the consent fields.
 */
async function safeFindUser(where: Record<string, unknown>, includeCompany = true) {
  try {
    return await db.user.findFirst({
      where,
      include: includeCompany ? { company: true } : undefined,
    })
  } catch (err) {
    // Consent columns likely missing — retry with explicit select of only known columns
    console.error('User query failed, retrying with minimal select:', err)
    const minimal = await db.user.findFirst({
      where,
      select: {
        id: true, email: true, name: true, password: true, role: true,
        phone: true, companyId: true, active: true,
        consentGiven: true, consentDate: true,
        ...(includeCompany ? { company: true } : {}),
      },
    }).catch(() => null)
    return minimal
  }
}

/**
 * Build the user response object with safe defaults for consent fields that may
 * not exist in the production database yet (during schema migration).
 */
function buildUserResponse(user: Record<string, unknown> | null) {
  if (!user) return null
  return {
    id: user.id as string,
    email: (user.email as string) || '',
    name: user.name as string,
    role: user.role as string,
    companyId: (user.companyId as string) || undefined,
    companyName: (user.company as { name?: string } | null)?.name || undefined,
    companySector: (user.company as { sector?: string } | null)?.sector || undefined,
    phone: (user.phone as string) || undefined,
    consentGiven: (user.consentGiven as boolean) ?? false,
    consentOption: (user.consentOption as string) ?? null,
    anonymousStats: (user.anonymousStats as boolean) ?? false,
    consentConfirmed: (user.consentConfirmed as boolean) ?? false,
    consentVersion: (user.consentVersion as string) ?? null,
  }
}

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
      // Use safeFindUser — resilient to missing consent columns in prod DB
      const user = await safeFindUser({ email })

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
        user: buildUserResponse(user as Record<string, unknown>),
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
          user = await safeFindUser({ phone: invitation.phone, companyId: invitation.companyId, role: 'CANDIDATO' })
        }
        // Fallback: find by name + company
        if (!user && invitation.candidateName) {
          user = await safeFindUser({ name: invitation.candidateName, companyId: invitation.companyId, role: 'CANDIDATO' })
        }

        if (!user) {
          return NextResponse.json({ error: 'No se encontró la cuenta del candidato. Contacta a Recursos Humanos.' }, { status: 400 })
        }
      } else if (invitation.status === 'PENDING') {
        // First time: auto-create the user (no email/password required)
        // Generate a unique email placeholder for the DB (email is unique in schema)
        const phoneClean = (invitation.phone || '').replace(/[^0-9]/g, '')
        const autoEmail = `cand_${phoneClean || invitation.id.slice(0, 12)}@evaluhr.auto`

        // Check if a user with this auto-email already exists (from a previous invitation
        // with the same phone that was deleted but left an orphaned user)
        const existingAutoUser = await safeFindUser({ email: autoEmail })

        if (existingAutoUser) {
          // Reuse the existing user, BUT ensure their companyId matches the current
          // invitation's companyId. This fixes the bug where a stale user from a
          // deleted invitation had a different companyId, causing "Usuario no encontrado"
          // errors in the consent API (RLS-scoped lookup failed due to companyId mismatch).
          if (existingAutoUser.companyId !== invitation.companyId) {
            console.log('[auto-login] Updating orphaned user companyId:', {
              userId: existingAutoUser.id,
              oldCompanyId: existingAutoUser.companyId,
              newCompanyId: invitation.companyId,
            })
            try {
              await db.user.update({
                where: { id: existingAutoUser.id },
                data: {
                  companyId: invitation.companyId,
                  name: invitation.candidateName || existingAutoUser.name,
                  phone: invitation.phone || existingAutoUser.phone,
                },
              })
            } catch (updateErr) {
              console.error('[auto-login] Failed to update user companyId:', updateErr)
            }
            // Reload with company relation
            const reloaded = await safeFindUser({ id: existingAutoUser.id })
            user = reloaded || existingAutoUser
          } else {
            user = existingAutoUser
          }
        } else {
          // Create user without password — token is their auth
          try {
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
          } catch (createErr) {
            console.error('[auto-login] User create failed:', createErr)
            // If create fails (e.g., missing consent columns), try with minimal fields
            try {
              user = await db.user.create({
                data: {
                  email: autoEmail,
                  name: invitation.candidateName || invitation.phone || 'Candidato',
                  password: await hashPassword(crypto.randomUUID()),
                  role: 'CANDIDATO',
                  phone: invitation.phone,
                  companyId: invitation.companyId,
                },
              })
              // Reload with company
              const reloaded = await safeFindUser({ id: user.id })
              user = reloaded || user
            } catch (createErr2) {
              console.error('[auto-login] User create (minimal) also failed:', createErr2)
              return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 })
            }
          }
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
          }).catch((sessionErr: unknown) => {
            console.error('[auto-login] Failed to create evaluation session:', sessionErr)
          })
        }
      }

      if (!user) {
        return NextResponse.json({ error: 'No se pudo autenticar al candidato' }, { status: 400 })
      }

      // Reload user with company if not already included
      const fullUser = user.company ? user : await safeFindUser({ id: user.id })

      if (!fullUser) {
        return NextResponse.json({ error: 'No se pudo cargar el usuario' }, { status: 500 })
      }

      // Generate JWT
      const jwtToken = await generateToken({
        sub: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role,
        companyId: fullUser.companyId || undefined,
        companyName: fullUser.company?.name || undefined,
        companySector: fullUser.company?.sector || undefined,
      })

      const response = NextResponse.json({
        user: buildUserResponse(fullUser as Record<string, unknown>),
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
