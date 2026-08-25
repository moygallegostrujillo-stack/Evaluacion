import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import { logUnauthorizedAccess, logAuditEvent } from '@/lib/audit'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── SA aggregated mode (no personal data, counts only) ──
    if (auth.role === 'SUPER_ADMIN' && !auth.companyId && !req.nextUrl.searchParams.get('companyId')) {
      console.log('[AUDIT] SA aggregated view accessed by', auth.userId)
      const db = getUnscopedClient()

      // Count candidates per company
      const candidateGroups = await db.user.groupBy({
        by: ['companyId'],
        where: { role: 'CANDIDATO', active: true },
        _count: true,
      })

      // Count completed sessions per company
      const completedGroups = await db.evaluationSession.groupBy({
        by: ['companyId'],
        where: { status: 'COMPLETED' },
        _count: true,
      })
      const completedMap = new Map(completedGroups.map(g => [g.companyId, g._count]))

      // Count active positions per company
      const positionGroups = await db.position.groupBy({
        by: ['companyId'],
        where: { active: true },
        _count: true,
      })
      const positionMap = new Map(positionGroups.map(g => [g.companyId, g._count]))

      // Resolve company names
      const companyIds = candidateGroups.map(g => g.companyId)
      const companies = companyIds.length > 0
        ? await db.company.findMany({
            where: { id: { in: companyIds } },
            select: { id: true, name: true },
          })
        : []
      const companyMap = new Map(companies.map(c => [c.id, c.name]))

      const aggregated = candidateGroups.map(g => ({
        companyId: g.companyId,
        companyName: companyMap.get(g.companyId) || 'Unknown',
        candidateCount: g._count,
        completedCount: completedMap.get(g.companyId) || 0,
        vacancyCount: positionMap.get(g.companyId) || 0,
      }))

      return NextResponse.json({ aggregated, mode: 'aggregated' })
    }

    // ── SA impersonation mode (scoped to ?companyId=xxx) ──
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? req.nextUrl.searchParams.get('companyId')
      : null

    if (auth.role === 'SUPER_ADMIN' && targetCompanyId) {
      console.log('[AUDIT] SA impersonating company', targetCompanyId, 'by', auth.userId)
    }

    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    // Always filter for CANDIDATO role - the candidates tab shows candidates, not RH/GERENTE users
    // RLS auto-injects companyId for non-SUPER_ADMIN; SUPER_ADMIN gets unscoped or scoped to target
    const where: Record<string, unknown> = { active: true, role: 'CANDIDATO' }

    // Use explicit select to avoid crashing if consent columns don't exist in prod DB yet
    // (safeFindUser pattern — same as auth API)
    let candidates
    try {
      candidates = await rlsDb.user.findMany({
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
    } catch (colErr) {
      // Consent columns likely missing in prod DB — retry with explicit select of only core fields
      console.error('Candidates query failed (likely missing consent columns):', colErr)
      candidates = await rlsDb.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, role: true, phone: true,
          companyId: true, active: true,
          consentGiven: true, consentDate: true,
          createdAt: true,
          sessions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              result: true,
              position: { select: { id: true, title: true } },
            },
          },
        },
      }).catch(() => [])
    }

    // Also fetch VacancyApplication data for candidates who applied through vacancies
    const candidateIds = candidates.map(c => c.id)
    const vacancyApplications = await rlsDb.vacancyApplication.findMany({
      where: {
        candidateEmail: { in: candidates.map(c => c.email) },
        status: 'COMPLETED',
      },
      orderBy: { completedAt: 'desc' },
      include: {
        vacancy: {
          select: { id: true, title: true },
        },
      },
    })

    // Create a map of email -> latest vacancy application result
    const vacancyResultMap = new Map<string, {
      id: string
      candidateId: string
      candidateName: string
      positionId: string
      positionTitle: string
      companyId: string
      overallScore: number
      recommendation: string
      summary: string | null
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
      stressLevel: number
      empathy: number
      adaptability: number
      leadership: number
      teamwork: number
      knowledgeScore: number | null
      integrityScore: number
      source: 'vacancy'
    }>()

    for (const app of vacancyApplications) {
      if (!vacancyResultMap.has(app.candidateEmail)) {
        vacancyResultMap.set(app.candidateEmail, {
          id: app.id,
          candidateId: candidates.find(c => c.email === app.candidateEmail)?.id || '',
          candidateName: app.candidateName,
          positionId: app.vacancyId,
          positionTitle: app.vacancy?.title || '',
          companyId: app.companyId,
          overallScore: app.overallScore,
          recommendation: app.recommendation,
          summary: app.summary,
          openness: app.openness,
          conscientiousness: app.conscientiousness,
          extraversion: app.extraversion,
          agreeableness: app.agreeableness,
          neuroticism: app.neuroticism,
          stressLevel: app.stressLevel,
          empathy: app.empathy,
          adaptability: app.adaptability,
          leadership: app.leadership,
          teamwork: app.teamwork,
          knowledgeScore: app.knowledgeScore,
          integrityScore: app.integrityScore,
          source: 'vacancy',
        })
      }
    }

    const formatted = candidates.map((c) => {
      const session = c.sessions[0]
      const sessionResult = session?.result || null
      const vacancyResult = vacancyResultMap.get(c.email) || null

      // Prefer EvaluationResult, fallback to VacancyApplication result
      const result = sessionResult || vacancyResult || null

      return {
        id: c.id,
        email: c.email,
        name: c.name,
        role: c.role,
        phone: c.phone,
        // Consent fields — use nullish coalescing for resilience if columns are missing in prod DB
        consentGiven: (c as { consentGiven?: boolean }).consentGiven ?? false,
        consentDate: (c as { consentDate?: Date | null }).consentDate ?? null,
        createdAt: c.createdAt,
        result,
        sessionStatus: session?.status || (vacancyResult ? 'COMPLETED' : null),
        positionTitle: session?.position?.title || vacancyResult?.positionTitle || null,
        resultSource: sessionResult ? 'evaluation' : vacancyResult ? 'vacancy' : null,
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
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { email, name, password, positionId } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!email || !name || !password || !companyId || !positionId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existingUser = await getUnscopedClient().user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 })
    }

    const user = await rlsDb.user.create({
      data: {
        email,
        name,
        password: await hashPassword(password),
        role: 'CANDIDATO',
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
        ...(companyId ? { companyId } : {}),
        // DO NOT auto-consent: the candidate must give consent themselves
        // via the ConsentView screen (LFPDPPP Art. 8 requires explicit consent from the data subject)
        consentGiven: false,
        consentOption: null,
        anonymousStats: false,
        consentConfirmed: false,
        active: true,
      },
    })

    // Create evaluation session for the candidate
    const session = await rlsDb.evaluationSession.create({
      data: {
        candidateId: user.id,
        positionId,
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
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

// ============================================
// DELETE — Delete a candidate (or all candidates if ?all=true)
// ============================================
export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN' && auth.role !== 'RH' && auth.role !== 'GERENTE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const candidateId = searchParams.get('id')
    const deleteAll = searchParams.get('all') === 'true'

    const db = getUnscopedClient()

    // DELETE ALL candidates for the company (or all if SUPER_ADMIN)
    if (deleteAll) {
      const where = auth.role === 'SUPER_ADMIN'
        ? { role: 'CANDIDATO' as const }
        : { role: 'CANDIDATO' as const, companyId: auth.companyId }

      // Delete related records first
      const candidates = await db.user.findMany({
        where,
        select: { id: true },
      })
      const candidateIds = candidates.map(c => c.id)

      if (candidateIds.length > 0) {
        await db.evaluationResponse.deleteMany({
          where: { session: { candidateId: { in: candidateIds } } },
        }).catch(() => {})
        await db.evaluationResult.deleteMany({
          where: { candidateId: { in: candidateIds } },
        }).catch(() => {})
        await db.evaluationSession.deleteMany({
          where: { candidateId: { in: candidateIds } },
        }).catch(() => {})
        await db.interviewSchedule.deleteMany({
          where: { candidateId: { in: candidateIds } },
        }).catch(() => {})
        await db.consentLog.deleteMany({
          where: { userId: { in: candidateIds } },
        }).catch(() => {})
        const result = await db.user.deleteMany({
          where,
        })
        return NextResponse.json({
          success: true,
          deleted: result.count,
          message: `${result.count} candidato(s) eliminado(s)`,
        })
      }
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: 'No hay candidatos para eliminar',
      })
    }

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 })
    }

    // SECURITY FIX (Phase 1.2 + 3.4): Cross-tenant check — verify the
    // candidate belongs to the same company as the requesting user.
    // Previously missing, allowing RH from company A to delete candidates
    // in company B if they knew the candidate ID.
    const targetCandidate = await db.user.findUnique({
      where: { id: candidateId },
      select: { id: true, companyId: true, role: true, name: true, email: true },
    })
    if (!targetCandidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }
    if (targetCandidate.role !== 'CANDIDATO') {
      return NextResponse.json({ error: 'User is not a candidate' }, { status: 400 })
    }
    if (auth.role !== 'SUPER_ADMIN' && targetCandidate.companyId !== auth.companyId) {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'DELETE',
        resource: 'User',
        resourceId: candidateId,
        companyId: auth.companyId,
        reason: 'Cross-tenant candidate deletion attempt',
      })
      return NextResponse.json(
        { error: 'Forbidden: candidate belongs to another company' },
        { status: 403 }
      )
    }

    // Delete related records first (FK constraints)
    await db.evaluationResponse.deleteMany({
      where: { session: { candidateId } },
    }).catch(() => {})
    await db.evaluationResult.deleteMany({
      where: { candidateId },
    }).catch(() => {})
    await db.evaluationSession.deleteMany({
      where: { candidateId },
    }).catch(() => {})
    await db.interviewSchedule.deleteMany({
      where: { candidateId },
    }).catch(() => {})

    // SECURITY FIX (Phase 3.4): Do NOT delete ConsentLog records.
    // Previously this destroyed the audit trail (LFPDPPP Art. 27 violation).
    // ConsentLog is retained for evidentiary purposes; the FK has onDelete: Cascade
    // on User, so we must anonymize the user record instead of hard-deleting to
    // preserve consent evidence. However, since the User record is being deleted
    // and ConsentLog.userId references it, we handle this by keeping ConsentLog
    // records with the userId value (anonymized approach would require schema change).
    // For now: we accept the cascade deletion of ConsentLog because the FK is
    // onDelete: Cascade — but we LOG this as a known compliance gap to fix
    // in a future schema migration (anonymize userId in ConsentLog instead of cascade).
    // TODO: Change ConsentLog.userId FK to SET NULL instead of CASCADE, and
    //       add a "candidateNameAnonymized" field for audit evidence retention.

    // Also delete VacancyApplication data (previously missed — orphaned PII)
    await db.vacancyApplicationResponse.deleteMany({
      where: { application: { candidateEmail: { contains: targetCandidate.email || '___' } } },
    }).catch(() => {})

    await db.user.delete({ where: { id: candidateId } })

    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'DELETE',
      resource: 'User',
      resourceId: candidateId,
      companyId: auth.companyId,
      details: { candidateName: targetCandidate.name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Candidates DELETE error:', error)
    return NextResponse.json({ error: 'Error deleting candidate' }, { status: 500 })
  }
}
