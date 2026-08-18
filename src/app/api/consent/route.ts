import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { db } from '@/lib/db'

const CONSENT_VERSION = '2026-01-v1' // Privacy notice version

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)

    // Derive userId from auth; SUPER_ADMIN can optionally specify a userId from body
    const body = await req.json()
    const userId = auth.role === 'SUPER_ADMIN'
      ? (body.userId || auth.userId)
      : auth.userId

    // Consent option: FULL (all evaluations), KNOWLEDGE_ONLY (just knowledge test)
    const consentOption = body.consentOption || 'FULL'
    const anonymousStats = body.anonymousStats || false
    const confirmedReading = body.confirmedReading || false

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    if (!['FULL', 'KNOWLEDGE_ONLY'].includes(consentOption)) {
      return NextResponse.json({ error: 'consentOption must be FULL or KNOWLEDGE_ONLY' }, { status: 400 })
    }

    // Require explicit confirmation of reading
    if (!confirmedReading) {
      return NextResponse.json({ error: 'Debe confirmar que ha leído y comprendido las opciones y sus derechos ARCO' }, { status: 400 })
    }

    const user = await rlsDb.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && user.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'No tienes permiso para modificar este usuario' }, { status: 403 })
    }

    // Determine action for audit log
    const isModification = user.consentGiven === true
    const logAction = isModification ? 'MODIFIED' : 'GIVEN'

    // Update user consent
    const updatedUser = await rlsDb.user.update({
      where: { id: userId },
      data: {
        consentGiven: true,
        consentDate: new Date(),
        consentOption,
        anonymousStats,
        consentConfirmed: confirmedReading,
        consentVersion: CONSENT_VERSION,
      },
    })

    // Create audit log entry
    try {
      await db.consentLog.create({
        data: {
          userId,
          action: logAction,
          previousOption: isModification ? user.consentOption : null,
          newOption: consentOption,
          anonymousStats,
          consentVersion: CONSENT_VERSION,
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        },
      })
    } catch (logError) {
      // Don't fail the consent if logging fails
      console.error('Consent log error:', logError)
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
      message: 'Consent recorded successfully',
    })
  } catch (error) {
    console.error('Consent POST error:', error)
    return NextResponse.json({ error: 'Error recording consent' }, { status: 500 })
  }
}

// Withdraw consent: change from FULL to KNOWLEDGE_ONLY
export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const body = await req.json()
    const userId = auth.role === 'SUPER_ADMIN' ? (body.userId || auth.userId) : auth.userId

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await rlsDb.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.consentGiven) {
      return NextResponse.json({ error: 'No hay consentimiento vigente para retirar' }, { status: 400 })
    }

    if (user.consentOption !== 'FULL') {
      return NextResponse.json({ error: 'Solo se puede retirar consentimiento de evaluación completa' }, { status: 400 })
    }

    // Downgrade from FULL to KNOWLEDGE_ONLY
    const updatedUser = await rlsDb.user.update({
      where: { id: userId },
      data: {
        consentOption: 'KNOWLEDGE_ONLY',
        consentWithdrawnAt: new Date(),
      },
    })

    // Log the withdrawal
    try {
      await db.consentLog.create({
        data: {
          userId,
          action: 'WITHDRAWN',
          previousOption: 'FULL',
          newOption: 'KNOWLEDGE_ONLY',
          anonymousStats: user.anonymousStats,
          consentVersion: user.consentVersion,
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        },
      })
    } catch (logError) {
      console.error('Consent log error:', logError)
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        consentOption: updatedUser.consentOption,
        consentWithdrawnAt: updatedUser.consentWithdrawnAt,
      },
      message: 'Consent withdrawn successfully. Only knowledge evaluation will continue.',
    })
  } catch (error) {
    console.error('Consent PATCH error:', error)
    return NextResponse.json({ error: 'Error withdrawing consent' }, { status: 500 })
  }
}
