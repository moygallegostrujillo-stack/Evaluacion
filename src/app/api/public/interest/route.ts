import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'

// ============================================
// POST - Public: Express interest in a vacancy (NO auth required)
// Flow B: Public vacancy link → Candidate leaves name + WhatsApp
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { vacancySlug, name, whatsapp } = body

    // ── Validate required fields ──
    if (!vacancySlug || typeof vacancySlug !== 'string') {
      return NextResponse.json(
        { error: 'vacancySlug es requerido' },
        { status: 400 }
      )
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    if (!whatsapp || typeof whatsapp !== 'string') {
      return NextResponse.json(
        { error: 'El número de WhatsApp es requerido' },
        { status: 400 }
      )
    }

    // Validate WhatsApp: must be exactly 10 digits (Mexican phone format)
    const digitsOnly = whatsapp.replace(/\D/g, '')
    if (digitsOnly.length !== 10) {
      return NextResponse.json(
        { error: 'El número de WhatsApp debe tener 10 dígitos' },
        { status: 400 }
      )
    }

    const db = getUnscopedClient()

    // ── Find vacancy by slug ──
    const vacancy = await db.vacancy.findUnique({
      where: { slug: vacancySlug },
      include: { company: { select: { id: true, name: true } } },
    })

    if (!vacancy || vacancy.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Vacante no encontrada o no activa' },
        { status: 404 }
      )
    }

    // ── Check for duplicate: same WhatsApp for same vacancy ──
    const existing = await db.vacancyInterest.findFirst({
      where: {
        vacancyId: vacancy.id,
        whatsapp: digitsOnly,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ya se registró interés con este número de WhatsApp para esta vacante' },
        { status: 409 }
      )
    }

    // ── Capture IP address ──
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null

    // ── Create VacancyInterest record ──
    const interest = await db.vacancyInterest.create({
      data: {
        vacancyId: vacancy.id,
        companyId: vacancy.companyId,
        candidateName: name.trim(),
        whatsapp: digitsOnly,
        consentContact: true, // By submitting the form, they accepted being contacted
        status: 'PENDING',
        ipAddress,
      },
    })

    return NextResponse.json(
      {
        success: true,
        interestId: interest.id,
        message: '¡Gracias! Te contactaremos por WhatsApp.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating vacancy interest:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
