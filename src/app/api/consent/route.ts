import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { db } from '@/lib/db'

// Current consent document version (bumped whenever the privacy notice is materially updated)
const CURRENT_CONSENT_VERSION = '2026-01-v1'

// Valid participation options
const VALID_OPTIONS = ['FULL', 'KNOWLEDGE_ONLY'] as const
type ConsentOption = (typeof VALID_OPTIONS)[number]

/**
 * Extract the client IP from request headers (x-forwarded-for or x-real-ip).
 * Caddy/Nginx typically sets these.
 */
function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; the first entry is the original client
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return null
}

/**
 * Safely fetch a user by ID, resilient to missing consent columns in the production DB.
 *
 * The previous implementation used `rlsDb.user.findUnique({ where: { id } })` with the
 * RLS-scoped client. This caused intermittent "Usuario no encontrado" errors in production
 * because the RLS extension adds `companyId` to the where clause, and if there's ANY
 * mismatch between the JWT's companyId and the user's actual companyId in the DB
 * (e.g., from an orphaned user found via auto-login), findUnique returns null.
 *
 * Fix: use the UNSCOPED client to look up the user by ID (we trust the JWT for
 * authentication), then verify ownership explicitly as defense-in-depth.
 */
async function safeFindUserById(userId: string) {
  const unscoped = getUnscopedClient()

  // First try: full query (works when all consent columns exist)
  try {
    return await unscoped.user.findUnique({
      where: { id: userId },
      include: { company: true },
    })
  } catch (err) {
    // Consent columns likely missing — retry with explicit minimal select
    console.error('[consent] Full user query failed, retrying with minimal select:', err)
    try {
      return await unscoped.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          companyId: true,
          active: true,
          consentGiven: true,
          consentDate: true,
          company: true,
        },
      })
    } catch (err2) {
      // Last resort: absolute minimum columns
      console.error('[consent] Minimal select also failed, trying bare minimum:', err2)
      try {
        return await unscoped.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            companyId: true,
            active: true,
            company: true,
          },
        })
      } catch (err3) {
        console.error('[consent] All user lookups failed:', err3)
        return null
      }
    }
  }
}

// ============================================
// POST /api/consent — Give or modify consent
// ============================================
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    const {
      userId: bodyUserId,
      consentOption,
      anonymousStats,
      confirmedReading,
    } = body as {
      userId?: string
      consentOption?: string
      anonymousStats?: boolean
      confirmedReading?: boolean
    }

    // Derive userId — SUPER_ADMIN can act on behalf of another user, others use their own id
    const userId =
      auth.role === 'SUPER_ADMIN' ? (bodyUserId || auth.userId) : auth.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Validate consent option
    if (!consentOption || !VALID_OPTIONS.includes(consentOption as ConsentOption)) {
      return NextResponse.json(
        { error: 'Debe seleccionar una opción de participación válida (A o B)' },
        { status: 400 }
      )
    }

    // Require explicit reading confirmation (LFPDPPP Art. 8 — express written consent for sensitive data)
    if (confirmedReading !== true) {
      return NextResponse.json(
        { error: 'Debe confirmar que ha leído y comprendido las opciones de participación y sus derechos ARCO' },
        { status: 400 }
      )
    }

    // Look up the user via UNSCOPED client (resilient to missing consent columns).
    // We trust the JWT for authentication; RLS is redundant for self-lookup.
    const user = await safeFindUserById(userId)

    if (!user) {
      console.error('[consent] User not found:', {
        userId,
        authUserId: auth.userId,
        authRole: auth.role,
        authCompanyId: auth.companyId,
      })
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Defense-in-depth: verify the user belongs to the same company as the auth context
    // (SUPER_ADMIN bypasses this check)
    if (auth.role !== 'SUPER_ADMIN' && auth.companyId && user.companyId !== auth.companyId) {
      console.error('[consent] Company mismatch:', {
        userId,
        userCompanyId: user.companyId,
        authCompanyId: auth.companyId,
      })
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este usuario' },
        { status: 403 }
      )
    }

    const now = new Date()
    const anonymousStatsBool = Boolean(anonymousStats)
    const isModification = Boolean(
      user.consentGiven && (user as Record<string, unknown>).consentConfirmed && user.consentOption
    )

    const unscoped = getUnscopedClient()

    // Update user with consent data via UNSCOPED client (with explicit id + companyId filter
    // as defense-in-depth, though findUnique by id is sufficient)
    const updateData: Record<string, unknown> = {
      consentGiven: true,
      consentDate: now,
      consentOption: consentOption as ConsentOption,
      anonymousStats: anonymousStatsBool,
      consentConfirmed: true,
      consentVersion: CURRENT_CONSENT_VERSION,
      // If user previously withdrew and is re-consenting, clear the withdrawn timestamp
      consentWithdrawnAt: null,
    }

    let updatedUser
    try {
      updatedUser = await unscoped.user.update({
        where: { id: userId },
        data: updateData,
      })
    } catch (updateErr) {
      console.error('[consent] Update failed (likely missing consent columns):', updateErr)
      // If the update fails because consent columns are missing, try raw SQL as a fallback
      try {
        await unscoped.$executeRawUnsafe(`
          UPDATE "User"
          SET "consentGiven" = true,
              "consentDate" = $1,
              "consentOption" = $2,
              "anonymousStats" = $3,
              "consentConfirmed" = true,
              "consentVersion" = $4,
              "consentWithdrawnAt" = NULL
          WHERE "id" = $5;
        `, now, consentOption, anonymousStatsBool, CURRENT_CONSENT_VERSION, userId)

        // Re-fetch the updated user
        updatedUser = await safeFindUserById(userId)
      } catch (rawErr) {
        console.error('[consent] Raw SQL fallback also failed:', rawErr)
        throw updateErr // re-throw the original error
      }
    }

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'No se pudo actualizar el usuario' },
        { status: 500 }
      )
    }

    // Record an audit log entry
    try {
      await db.consentLog.create({
        data: {
          userId,
          action: isModification ? 'MODIFIED' : 'GIVEN',
          previousOption: user.consentOption || null,
          newOption: consentOption as ConsentOption,
          anonymousStats: anonymousStatsBool,
          consentVersion: CURRENT_CONSENT_VERSION,
          ipAddress: getClientIp(req),
        },
      })
    } catch (logErr) {
      // Audit log failure should not block the consent transaction
      console.error('[consent] ConsentLog write failed (non-fatal):', logErr)
    }

    return NextResponse.json({
      user: {
        id: (updatedUser as Record<string, unknown>).id,
        email: (updatedUser as Record<string, unknown>).email,
        name: (updatedUser as Record<string, unknown>).name,
        consentGiven: (updatedUser as Record<string, unknown>).consentGiven ?? true,
        consentDate: (updatedUser as Record<string, unknown>).consentDate ?? now,
        consentOption: (updatedUser as Record<string, unknown>).consentOption ?? consentOption,
        anonymousStats: (updatedUser as Record<string, unknown>).anonymousStats ?? anonymousStatsBool,
        consentConfirmed: (updatedUser as Record<string, unknown>).consentConfirmed ?? true,
        consentVersion: (updatedUser as Record<string, unknown>).consentVersion ?? CURRENT_CONSENT_VERSION,
      },
      message: 'Consentimiento registrado correctamente',
    })
  } catch (error) {
    console.error('[consent] POST error:', error)
    return NextResponse.json(
      { error: 'Error al registrar el consentimiento' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH /api/consent — Withdraw consent (FULL → KNOWLEDGE_ONLY)
// ============================================
// Per LFPDPPP Art. 8 (Sensitive data) the candidate may withdraw consent
// for sensitive-data processing at any time. We don't delete the
// sensitive responses immediately, but flag the consent as withdrawn so
// that going forward only the knowledge section continues to be processed.
export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    const { userId: bodyUserId } = body as { userId?: string }

    const userId =
      auth.role === 'SUPER_ADMIN' ? (bodyUserId || auth.userId) : auth.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Use safe lookup (resilient to missing consent columns)
    const user = await safeFindUserById(userId)

    if (!user) {
      console.error('[consent PATCH] User not found:', {
        userId,
        authUserId: auth.userId,
        authCompanyId: auth.companyId,
      })
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Defense-in-depth: verify ownership
    if (auth.role !== 'SUPER_ADMIN' && auth.companyId && user.companyId !== auth.companyId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este usuario' },
        { status: 403 }
      )
    }

    // Withdrawal is only meaningful if the user currently has FULL consent.
    // KNOWLEDGE_ONLY users have no sensitive-data processing to withdraw.
    if (!user.consentGiven || user.consentOption !== 'FULL') {
      return NextResponse.json(
        {
          error:
            'No hay consentimiento de tratamiento de datos sensibles pendiente de retiro (su opción actual es Solo Conocimientos).',
        },
        { status: 400 }
      )
    }

    const now = new Date()
    const unscoped = getUnscopedClient()

    const updatedUser = await unscoped.user.update({
      where: { id: userId },
      data: {
        consentOption: 'KNOWLEDGE_ONLY',
        consentWithdrawnAt: now,
        // Keep anonymousStats as-is — withdrawal of sensitive data does not
        // touch the (separately-consented) anonymous stats preference.
      },
    })

    try {
      await db.consentLog.create({
        data: {
          userId,
          action: 'WITHDRAWN',
          previousOption: 'FULL',
          newOption: 'KNOWLEDGE_ONLY',
          anonymousStats: (user as Record<string, unknown>).anonymousStats as boolean ?? false,
          consentVersion: user.consentVersion || CURRENT_CONSENT_VERSION,
          ipAddress: getClientIp(req),
        },
      })
    } catch (logErr) {
      console.error('[consent PATCH] ConsentLog write failed (non-fatal):', logErr)
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        consentGiven: updatedUser.consentGiven,
        consentOption: updatedUser.consentOption,
        anonymousStats: updatedUser.anonymousStats,
        consentConfirmed: updatedUser.consentConfirmed,
        consentWithdrawnAt: updatedUser.consentWithdrawnAt,
        consentVersion: updatedUser.consentVersion,
      },
      message:
        'Consentimiento para tratamiento de datos sensibles retirado. Continuará únicamente con la evaluación de conocimientos.',
    })
  } catch (error) {
    console.error('[consent] PATCH error:', error)
    return NextResponse.json(
      { error: 'Error al retirar el consentimiento' },
      { status: 500 }
    )
  }
}
