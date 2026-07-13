import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    const interviews = await db.interviewSchedule.findMany({
      where: { companyId },
      orderBy: { scheduledAt: 'asc' },
      include: {
        candidate: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    return NextResponse.json({ interviews })
  } catch (error) {
    console.error('Interviews GET error:', error)
    return NextResponse.json({ error: 'Error fetching interviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { candidateId, companyId, positionId, scheduledAt, location, notes } = body

    if (!candidateId || !companyId || !scheduledAt) {
      return NextResponse.json({ error: 'candidateId, companyId, and scheduledAt are required' }, { status: 400 })
    }

    const interview = await db.interviewSchedule.create({
      data: {
        candidateId,
        companyId,
        positionId: positionId || null,
        scheduledAt: new Date(scheduledAt),
        location: location || null,
        notes: notes || null,
        notified: true,
      },
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ interview }, { status: 201 })
  } catch (error) {
    console.error('Interviews POST error:', error)
    return NextResponse.json({ error: 'Error creating interview' }, { status: 500 })
  }
}
