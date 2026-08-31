import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import { logUnauthorizedAccess, logAuditEvent } from '@/lib/audit'
import { resolveTargetCompanyId } from '@/lib/impersonation'

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
    // PHASE 3.5-B.2.1 (B1): Centralized impersonation resolution + logging
    const { targetCompanyId } = await resolveTargetCompanyId(auth, req, {
      action: 'ACCESS',
      resource: 'Candidate',
    })

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
        select: { id: true, email: true },
      })
      const candidateIds = candidates.map(c => c.id)

      if (candidateIds.length > 0) {
        // PHASE 3.5 (B3): Fetch emails before deleting Users, so we can clean
        // up VacancyApplication orphaned PII afterwards.
        const candidateEmails = candidates.map(c => c.email).filter(Boolean) as string[]

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
        // PHASE 3.5 (B2): ConsentLog no longer explicitly deleted.
        // FK is now onDelete: SetNull — ConsentLog rows survive with userId=NULL.
        const result = await db.user.deleteMany({
          where,
        })

        // PHASE 3.5 (B3): Clean up VacancyApplication orphaned PII
        if (candidateEmails.length > 0) {
          try {
            const userApps = await db.vacancyApplication.findMany({
              where: { candidateEmail: { in: candidateEmails } },
              select: { id: true },
            })
            if (userApps.length > 0) {
              const appIds = userApps.map(a => a.id)
              await db.vacancyApplicationResponse.deleteMany({
                where: { applicationId: { in: appIds } },
              })
              await db.vacancyApplication.deleteMany({
                where: { id: { in: appIds } },
              })
            }
          } catch (vacErr) {
            console.error('[candidates DELETE bulk] VacancyApplication cleanup error:', vacErr)
          }
        }

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

    // PHASE 3.5 (B2): ConsentLog is now preserved via FK onDelete: SetNull.
    // When the User is deleted, ConsentLog.userId becomes NULL but the record
    // (with PII snapshots + noticeHash) is retained as audit evidence.
    // No explicit ConsentLog.deleteMany here.

    // PHASE 3.5-A.1 (B2): Fix VacancyApplication orphaned PII using candidateUserId FK.
    // The new FK (candidateUserId) allows reliable cleanup by user ID, not email.
    // We query by BOTH candidateUserId (primary) and candidateEmail (fallback for
    // legacy records created before the FK was added). This ensures no PII is orphaned
    // even if the email was changed or normalized differently.
    try {
      // Primary: find by candidateUserId FK (reliable — not affected by email changes)
      // Fallback: find by candidateEmail (for legacy records without the FK)
      const userApps = await db.vacancyApplication.findMany({
        where: {
          OR: [
            { candidateUserId: candidateId },
            ...(targetCandidate.email ? [{ candidateEmail: targetCandidate.email }] : []),
          ],
        },
        select: { id: true },
      })
      if (userApps.length > 0) {
        const appIds = userApps.map(a => a.id)
        await db.vacancyApplicationResponse.deleteMany({
          where: { applicationId: { in: appIds } },
        })
        await db.vacancyApplication.deleteMany({
          where: { id: { in: appIds } },
        })
      }
    } catch (vacErr) {
      console.error('[candidates DELETE] VacancyApplication cleanup error:', vacErr)
    }

    // Now delete the User — ConsentLog rows will have userId SET TO NULL (not deleted)
    // VacancyApplication rows with candidateUserId will also have it SET TO NULL,
    // but we already deleted them above, so this is defense-in-depth.
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
