import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId')

    // Super Admin (no companyId) sees all interviews
    const where = companyId ? { companyId } : {}

    const interviews = await db.interviewSchedule.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        candidate: {
          select: { id: true, name: true, email: true, phone: true },
        },
        position: {
          select: { id: true, title: true, category: true },
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
          select: { id: true, name: true, email: true, phone: true },
        },
        position: {
          select: { id: true, title: true, category: true },
        },
      },
    })

    return NextResponse.json({ interview }, { status: 201 })
  } catch (error) {
    console.error('Interviews POST error:', error)
    return NextResponse.json({ error: 'Error creating interview' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    if (!['SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be SCHEDULED, COMPLETED, or CANCELLED' }, { status: 400 })
    }

    const interview = await db.interviewSchedule.update({
      where: { id },
      data: { status },
      include: {
        candidate: {
          select: { id: true, name: true, email: true, phone: true },
        },
        position: {
          select: { id: true, title: true, category: true },
        },
      },
    })

    return NextResponse.json({ interview })
  } catch (error) {
    console.error('Interviews PATCH error:', error)
    return NextResponse.json({ error: 'Error updating interview' }, { status: 500 })
  }
}
