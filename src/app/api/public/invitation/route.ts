import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'

/**
 * GET /api/public/invitation?token=xxx
 * Public endpoint to validate an invitation token and return details.
 * Used by the candidate landing page to show company/position info.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const db = getUnscopedClient()

    const invitation = await db.candidateInvitation.findUnique({
      where: { token },
      include: {
        company: {
          select: { id: true, name: true, sector: true },
        },
        position: {
          select: { id: true, title: true, sector: true, category: true, description: true },
        },
      },
    })

    if (!invitation) {
      return NextResponse.json({
        valid: false,
        status: 'NOT_FOUND',
        error: 'Invitación no encontrada',
      })
    }

    // Check if already used
    if (invitation.status === 'REGISTERED' || invitation.status === 'COMPLETED') {
      return NextResponse.json({
        valid: false,
        status: invitation.status,
        companyName: invitation.company.name,
        positionTitle: invitation.position.title,
        error: invitation.status === 'REGISTERED'
          ? 'Esta invitación ya fue utilizada. Si ya te registraste, inicia sesión con tu correo y contraseña.'
          : 'Esta evaluación ya fue completada.',
      })
    }

    // Check if expired
    if (invitation.status === 'EXPIRED' || invitation.expiresAt < new Date()) {
      // Mark as expired if not already
      if (invitation.status !== 'EXPIRED') {
        await db.candidateInvitation.update({
          where: { id: invitation.id },
          data: { status: 'EXPIRED' },
        })
      }
      return NextResponse.json({
        valid: false,
        status: 'EXPIRED',
        companyName: invitation.company.name,
        positionTitle: invitation.position.title,
        error: 'Esta invitación ha expirado. Solicita una nueva invitación a la empresa.',
      })
    }

    // Valid invitation
    return NextResponse.json({
      valid: true,
      status: invitation.status,
      invitationId: invitation.id,
      companyName: invitation.company.name,
      companySector: invitation.company.sector,
      positionTitle: invitation.position.title,
      positionDescription: invitation.position.description,
      positionCategory: invitation.position.category,
      positionSector: invitation.position.sector,
      candidateName: invitation.candidateName,
      email: invitation.email,
      phone: invitation.phone,
      channel: invitation.channel,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
    })
  } catch (error) {
    console.error('Public invitation error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
