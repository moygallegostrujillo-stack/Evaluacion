import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

/**
 * POST /api/consent/fix
 * Retroactively register consent for a candidate who completed evaluation
 * but whose consent wasn't recorded (system error or migration issue).
 *
 * Only RH, GERENTE, or SUPER_ADMIN can call this endpoint.
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
    const { candidateId } = body

    if (!candidateId) {
      return NextResponse.json({ error: 'candidateId es requerido' }, { status: 400 })
    }

    // Verify the candidate exists and belongs to the admin's company
    // RLS auto-filters by companyId for non-SUPER_ADMIN
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

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && candidate.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'No tienes acceso a este candidato' }, { status: 403 })
    }

    // Use the evaluation completion date as consent date, or now if not available
    const consentDate = candidate.sessions[0]?.completedAt || new Date()

    // Update the candidate's consent
    const updatedUser = await rlsDb.user.update({
      where: { id: candidateId },
      data: {
        consentGiven: true,
        consentDate,
      },
    })

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        consentGiven: updatedUser.consentGiven,
        consentDate: updatedUser.consentDate,
      },
      message: 'Consentimiento registrado retroactivamente',
      note: 'El prospecto completó la evaluación, por lo que necesariamente aceptó los términos y condiciones y el aviso de privacidad previamente.',
    })
  } catch (error) {
    console.error('Consent fix POST error:', error)
    return NextResponse.json({ error: 'Error al corregir consentimiento' }, { status: 500 })
  }
}
