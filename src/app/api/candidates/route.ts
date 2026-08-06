import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId')
    const role = req.nextUrl.searchParams.get('role')

    // Always filter for CANDIDATO role - the candidates tab shows candidates, not RH/GERENTE users
    const where: Record<string, unknown> = { ...(companyId ? { companyId } : {}), active: true, role: 'CANDIDATO' }

    const candidates = await db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            result: true,
            position: {
              select: { id: true, title: true },
            },
          },
        },
      },
    })

    const formatted = candidates.map((c) => {
      const session = c.sessions[0]
      return {
        id: c.id,
        email: c.email,
        name: c.name,
        role: c.role,
        phone: c.phone,
        consentGiven: c.consentGiven,
        consentDate: c.consentDate,
        createdAt: c.createdAt,
        result: session?.result || null,
        sessionStatus: session?.status || null,
        positionTitle: session?.position?.title || null,
      }
    })

    return NextResponse.json({ candidates: formatted })
  } catch (error) {
    console.error('Candidates GET error:', error)
    return NextResponse.json({ error: 'Error fetching candidates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, password, companyId, positionId } = body

    if (!email || !name || !password || !companyId || !positionId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 })
    }

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashPassword(password),
        role: 'CANDIDATO',
        companyId,
        consentGiven: true,
        consentDate: new Date(),
        active: true,
      },
    })

    // Create evaluation session for the candidate
    const session = await db.evaluationSession.create({
      data: {
        candidateId: user.id,
        positionId,
        companyId,
        status: 'NOT_STARTED',
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        consentGiven: user.consentGiven,
      },
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Candidates POST error:', error)
    return NextResponse.json({ error: 'Error creating candidate' }, { status: 500 })
  }
}
