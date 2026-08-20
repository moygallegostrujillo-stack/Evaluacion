import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
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

// ============================================
// POST /api/consent — Give or modify consent
// ============================================
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)

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

    const user = await rlsDb.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && user.companyId !== auth.companyId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este usuario' },
        { status: 403 }
      )
    }

    const now = new Date()
    const anonymousStatsBool = Boolean(anonymousStats)
    const isModification = Boolean(
      user.consentGiven && user.consentConfirmed && user.consentOption
    )

    // Update user with consent data
    const updatedUser = await rlsDb.user.update({
      where: { id: userId },
      data: {
        consentGiven: true,
        consentDate: now,
        consentOption: consentOption as ConsentOption,
        anonymousStats: anonymousStatsBool,
        consentConfirmed: true,
        consentVersion: CURRENT_CONSENT_VERSION,
        // If user previously withdrew and is re-consenting, clear the withdrawn timestamp
        consentWithdrawnAt: null,
      },
    })

    // Record an audit log entry — use the UNscoped client so logs are always written
    // even for SUPER_ADMIN (ConsentLog is not tenant-scoped via companyId filter)
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
      console.error('ConsentLog write failed (non-fatal):', logErr)
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        consentGiven: updatedUser.consentGiven,
        consentDate: updatedUser.consentDate,
        consentOption: updatedUser.consentOption,
        anonymousStats: updatedUser.anonymousStats,
        consentConfirmed: updatedUser.consentConfirmed,
        consentVersion: updatedUser.consentVersion,
      },
      message: 'Consentimiento registrado correctamente',
    })
  } catch (error) {
    console.error('Consent POST error:', error)
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

    const { client: rlsDb } = createRLSClient(auth)

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

    const user = await rlsDb.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (auth.role !== 'SUPER_ADMIN' && user.companyId !== auth.companyId) {
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

    const updatedUser = await rlsDb.user.update({
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
          anonymousStats: user.anonymousStats ?? false,
          consentVersion: user.consentVersion || CURRENT_CONSENT_VERSION,
          ipAddress: getClientIp(req),
        },
      })
    } catch (logErr) {
      console.error('ConsentLog write failed (non-fatal):', logErr)
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
    console.error('Consent PATCH error:', error)
    return NextResponse.json(
      { error: 'Error al retirar el consentimiento' },
      { status: 500 }
    )
  }
}
