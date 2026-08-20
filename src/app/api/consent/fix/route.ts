import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * POST /api/consent/fix
 * Retroactively register consent for a candidate who completed evaluation
 * but whose consent wasn't recorded (system error or migration issue).
 *
 * Only RH, GERENTE, or SUPER_ADMIN can call this endpoint.
 * This is an ADMIN action — it does NOT replace the candidate's own consent.
 * The note records that this was done retroactively by an administrator.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin roles can fix consent retroactively
    if (auth.role !== 'SUPER_ADMIN' && auth.role !== 'RH' && auth.role !== 'GERENTE') {
      return NextResponse.json({ error: 'Solo administradores pueden corregir consentimiento' }, { status: 403 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const body = await req.json()
    const { candidateId, consentOption, anonymousStats } = body

    if (!candidateId) {
      return NextResponse.json({ error: 'candidateId es requerido' }, { status: 400 })
    }

    // Verify the candidate exists and belongs to the admin's company
    const candidate = await rlsDb.user.findUnique({
      where: { id: candidateId },
      include: {
        sessions: {
          orderBy: { completedAt: 'desc' },
          take: 1,
          where: { status: 'COMPLETED' },
        },
      },
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidato no encontrado' }, { status: 404 })
    }

    if (auth.role !== 'SUPER_ADMIN' && candidate.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'No tienes acceso a este candidato' }, { status: 403 })
    }

    // Use the evaluation completion date as consent date, or now if not available
    const consentDate = candidate.sessions[0]?.completedAt || new Date()
    const option = consentOption || candidate.consentOption || 'FULL'
    const stats = anonymousStats ?? candidate.anonymousStats ?? false

    // Update the candidate's consent
    const updatedUser = await rlsDb.user.update({
      where: { id: candidateId },
      data: {
        consentGiven: true,
        consentDate,
        consentOption: option,
        anonymousStats: stats,
        consentConfirmed: true, // Admin is confirming retroactively
      },
    })

    // Create audit log
    try {
      await db.consentLog.create({
        data: {
          userId: candidateId,
          action: 'GIVEN',
          newOption: option,
          anonymousStats: stats,
          consentVersion: 'retroactive-fix',
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        },
      })
    } catch (logError) {
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
      },
      message: 'Consentimiento registrado retroactivamente por administrador',
      note: 'Este consentimiento fue registrado retroactivamente por un administrador. El candidato completó la evaluación habiendo aceptado los términos y condiciones y el aviso de privacidad en su momento.',
    })
  } catch (error) {
    console.error('Consent fix POST error:', error)
    return NextResponse.json({ error: 'Error al corregir consentimiento' }, { status: 500 })
  }
}
