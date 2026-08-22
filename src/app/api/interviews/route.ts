import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? req.nextUrl.searchParams.get('companyId')
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    // RLS auto-filters by companyId
    const interviews = await rlsDb.interviewSchedule.findMany({
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
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { candidateId, positionId, scheduledAt, location, notes } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!candidateId || !companyId || !scheduledAt) {
      return NextResponse.json({ error: 'candidateId, companyId, and scheduledAt are required' }, { status: 400 })
    }

    const interview = await rlsDb.interviewSchedule.create({
      data: {
        candidateId,
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
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
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    if (!['SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be SCHEDULED, COMPLETED, or CANCELLED' }, { status: 400 })
    }

    // RLS auto-filters by companyId on update where clause
    // Defense-in-depth: verify ownership for non-SUPER_ADMIN
    if (auth.role !== 'SUPER_ADMIN') {
      const existingInterview = await rlsDb.interviewSchedule.findUnique({ where: { id } })
      if (existingInterview && existingInterview.companyId !== auth.companyId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const interview = await rlsDb.interviewSchedule.update({
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
