import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

// ============================================
// GET - Admin: List interests for a vacancy or company (auth required)
//* ============================================

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json(
        { error: 'Autenticación requerida', code: 'AUTH_MISSING' },
        { status: 401 }
      )
    }

    const { client: rlsDb } = createRLSClient(auth)

    const vacancyId = req.nextUrl.searchParams.get('vacancyId')
    const companyId = req.nextUrl.searchParams.get('companyId')

    const where: Record<string, unknown> = {}
    if (vacancyId) where.vacancyId = vacancyId
    if (companyId) where.companyId = companyId

    const interests = await rlsDb.vacancyInterest.findMany({
      where,
      include: {
        vacancy: { select: { id: true, title: true, slug: true } },
        company: { select: { id: true, name: true } },
        invitation: { select: { id: true, status: true, token: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ interests })
  } catch (error) {
    console.error('Error listing vacancy interests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT - Admin: Update interest status (auth required, RH/GERENTE/SUPER_ADMIN)
// ============================================

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json(
        { error: 'Autenticación requerida', code: 'AUTH_MISSING' },
        { status: 401 }
      )
    }

    const allowedRoles = ['SUPER_ADMIN', 'RH', 'GERENTE']
    if (!allowedRoles.includes(auth.role)) {
      return NextResponse.json(
        { error: 'No tienes permisos para esta acción', code: 'AUTH_FORBIDDEN' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { interestId, status } = body

    if (!interestId || typeof interestId !== 'string') {
      return NextResponse.json(
        { error: 'interestId es requerido' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'INVITED', 'REJECTED']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status debe ser uno de: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const { client: rlsDb } = createRLSClient(auth)

    const updated = await rlsDb.vacancyInterest.update({
      where: { id: interestId },
      data: { status },
    })

    return NextResponse.json({ interest: updated })
  } catch (error) {
    console.error('Error updating vacancy interest:', error)
    // Prisma throws P2025 for record not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Registro de interés no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
