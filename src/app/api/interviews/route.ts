import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { logAuditEvent, logUnauthorizedAccess } from '@/lib/audit'
import { resolveTargetCompanyId } from '@/lib/impersonation'
import { getAggregateInterviewDirectory } from '@/lib/admin-db'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── PHASE 3.5-H (VUL-H3): the interviews LIST is an RH administrative
    // view (candidate PII). A CANDIDATO may only read their OWN interview
    // resource — via the explicit ?candidateId=<own-id> flow used by the
    // candidate app (EvaluationCompleteView). Anything else → 403 + audit.
    // This is application-layer AUTHORIZATION; it does not rely on RLS.
    const candidateIdParam = req.nextUrl.searchParams.get('candidateId')
    if (auth.role === 'CANDIDATO') {
      // The ONLY legitimate candidate flow is the explicit own-resource call
      // ?candidateId=<own-id> (EvaluationCompleteView). A bare call is the
      // administrative LISTING attempt → 403 + audit.
      if (!candidateIdParam || candidateIdParam !== auth.userId) {
        await logUnauthorizedAccess(req, {
          actorId: auth.userId,
          action: 'ACCESS',
          resource: 'InterviewSchedule',
          resourceId: candidateIdParam || undefined,
          companyId: auth.companyId,
          reason: 'CANDIDATO attempted to list interviews (not an own-resource request)',
        })
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // Own-resource flow: scoped by the RLS client AND forced to the
      // candidate's own id. No listing of others, ever.
      const { client: candDb } = createRLSClient(auth)
      const ownInterviews = await candDb.interviewSchedule.findMany({
        where: { candidateId: auth.userId },
        orderBy: { scheduledAt: 'asc' },
        include: {
          position: {
            select: { id: true, title: true, category: true },
          },
        },
      })
      return NextResponse.json({ interviews: ownInterviews })
    }

    // ── PHASE 3.5-H (VUL-H6): SA without a target → ADMIN DB directory ──
    // (evalhr_sa, audited, fail-closed) — NOT the shared unscoped client.
    if (auth.role === 'SUPER_ADMIN' && !req.nextUrl.searchParams.get('companyId')) {
      const { interviews } = await getAggregateInterviewDirectory({
        req,
        actorId: auth.userId,
        role: auth.role,
      })
      return NextResponse.json({ interviews })
    }

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const { targetCompanyId } = await resolveTargetCompanyId(auth, req, {
      action: 'ACCESS',
      resource: 'InterviewSchedule',
    })
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
    // Log SA impersonation for body-based companyId (helper only reads query params)
    if (auth.role === 'SUPER_ADMIN' && targetCompanyId && targetCompanyId !== auth.companyId) {
      await logAuditEvent(req, {
        actorId: auth.userId,
        action: 'CREATE',
        resource: 'InterviewSchedule',
        companyId: auth.companyId,
        details: {
          impersonation: true,
          targetCompanyId,
          actorRole: auth.role,
          action: 'CREATE',
        },
      })
    }
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

    // PHASE 3.5-H (VUL-H3 audit): status changes are an RH operation. There
    // is no legitimate CANDIDATO flow that PATCHes interview status.
    if (auth.role === 'CANDIDATO') {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'InterviewSchedule',
        companyId: auth.companyId,
        reason: 'CANDIDATO attempted to change interview status',
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
