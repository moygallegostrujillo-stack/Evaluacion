import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

/**
 * POST /api/cleanup
 * SUPER_ADMIN only — one-time cleanup endpoint.
 * Keeps only the specified company, deletes everything else.
 * Cleans the kept company's operational data (positions, candidates, invitations, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth || auth.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized — SUPER_ADMIN only' }, { status: 401 })
    }

    const body = await req.json()
    const keepCompanyName = (body.keepCompany || 'Café DeChiapas').trim()
    const dryRun = body.dryRun === true

    const db = getUnscopedClient()
    const report: Record<string, number> = {}

    // ── Find the company to keep ──
    const keepCompany = await db.company.findFirst({
      where: { name: { contains: keepCompanyName } },
    })

    if (!keepCompany) {
      return NextResponse.json(
        { error: `Empresa "${keepCompanyName}" no encontrada` },
        { status: 404 }
      )
    }

    const keepCompanyId = keepCompany.id

    // ── Find all OTHER companies ──
    const otherCompanies = await db.company.findMany({
      where: { id: { not: keepCompanyId } },
    })
    const otherCompanyIds = otherCompanies.map(c => c.id)

    if (dryRun) {
      const positionsInKeep = await db.position.count({ where: { companyId: keepCompanyId } })
      const candidatesInKeep = await db.user.count({ where: { companyId: keepCompanyId, role: 'CANDIDATO' } })
      const invitationsInKeep = await db.candidateInvitation.count({ where: { companyId: keepCompanyId } })
      const sessionsInKeep = await db.evaluationSession.count({ where: { companyId: keepCompanyId } })
      const resultsInKeep = await db.evaluationResult.count({ where: { companyId: keepCompanyId } })

      return NextResponse.json({
        dryRun: true,
        keepCompany: keepCompany.name,
        keepCompanyId,
        companiesToDelete: otherCompanies.map(c => ({ id: c.id, name: c.name })),
        dataInKeptCompany: {
          positions: positionsInKeep,
          candidates: candidatesInKeep,
          invitations: invitationsInKeep,
          sessions: sessionsInKeep,
          results: resultsInKeep,
        },
        message: 'Ejecuta con dryRun=false para limpiar',
      })
    }

    // ═══════════════════════════════════════
    // PHASE 1: Delete ALL OTHER companies
    // ═══════════════════════════════════════
    for (const otherId of otherCompanyIds) {
      // Vacancy chain
      const vacApps = await db.vacancyApplication.findMany({
        where: { companyId: otherId },
        select: { id: true },
      })
      for (const va of vacApps) {
        report.vacAppResp_other = (report.vacAppResp_other || 0)
          + (await db.vacancyApplicationResponse.deleteMany({ where: { applicationId: va.id } })).count
      }
      report.vacApps_other = (report.vacApps_other || 0)
        + (await db.vacancyApplication.deleteMany({ where: { companyId: otherId } })).count

      const vacs = await db.vacancy.findMany({
        where: { companyId: otherId },
        select: { id: true },
      })
      for (const v of vacs) {
        report.vacQs_other = (report.vacQs_other || 0)
          + (await db.vacancyQuestion.deleteMany({ where: { vacancyId: v.id } })).count
      }
      report.vacancies_other = (report.vacancies_other || 0)
        + (await db.vacancy.deleteMany({ where: { companyId: otherId } })).count

      // Evaluation chain
      const sessions = await db.evaluationSession.findMany({
        where: { companyId: otherId },
        select: { id: true },
      })
      for (const s of sessions) {
        report.evalResp_other = (report.evalResp_other || 0)
          + (await db.evaluationResponse.deleteMany({ where: { sessionId: s.id } })).count
      }
      report.evalSessions_other = (report.evalSessions_other || 0)
        + (await db.evaluationSession.deleteMany({ where: { companyId: otherId } })).count
      report.evalResults_other = (report.evalResults_other || 0)
        + (await db.evaluationResult.deleteMany({ where: { companyId: otherId } })).count

      // Interviews
      report.interviews_other = (report.interviews_other || 0)
        + (await db.interviewSchedule.deleteMany({ where: { companyId: otherId } })).count

      // Invitations
      report.invitations_other = (report.invitations_other || 0)
        + (await db.candidateInvitation.deleteMany({ where: { companyId: otherId } })).count

      // Templates + Questions
      const positions = await db.position.findMany({
        where: { companyId: otherId },
        select: { id: true },
      })
      for (const p of positions) {
        const tpls = await db.evaluationTemplate.findMany({
          where: { positionId: p.id },
          select: { id: true },
        })
        for (const t of tpls) {
          report.questions_other = (report.questions_other || 0)
            + (await db.question.deleteMany({ where: { evaluationTemplateId: t.id } })).count
        }
        report.templates_other = (report.templates_other || 0)
          + (await db.evaluationTemplate.deleteMany({ where: { positionId: p.id } })).count
      }
      report.positions_other = (report.positions_other || 0)
        + (await db.position.deleteMany({ where: { companyId: otherId } })).count

      // Candidates
      report.candidates_other = (report.candidates_other || 0)
        + (await db.user.deleteMany({ where: { companyId: otherId, role: 'CANDIDATO' } })).count

      // Remaining users (RH, etc)
      const remainingUsers = await db.user.findMany({
        where: { companyId: otherId },
        select: { id: true },
      })
      for (const u of remainingUsers) {
        await db.consentLog.deleteMany({ where: { userId: u.id } })
      }
      report.users_other = (report.users_other || 0)
        + (await db.user.deleteMany({ where: { companyId: otherId } })).count

      // Delete company
      report.companies_deleted = (report.companies_deleted || 0)
        + (await db.company.deleteMany({ where: { id: otherId } })).count
    }

    // ═══════════════════════════════════════
    // PHASE 2: Clean Café DeChiapas
    // ═══════════════════════════════════════
    // Vacancy chain
    const kVacApps = await db.vacancyApplication.findMany({
      where: { companyId: keepCompanyId },
      select: { id: true },
    })
    for (const va of kVacApps) {
      report.vacAppResp_keep = (report.vacAppResp_keep || 0)
        + (await db.vacancyApplicationResponse.deleteMany({ where: { applicationId: va.id } })).count
    }
    report.vacApps_keep = (await db.vacancyApplication.deleteMany({ where: { companyId: keepCompanyId } })).count

    const kVacs = await db.vacancy.findMany({
      where: { companyId: keepCompanyId },
      select: { id: true },
    })
    for (const v of kVacs) {
      report.vacQs_keep = (report.vacQs_keep || 0)
        + (await db.vacancyQuestion.deleteMany({ where: { vacancyId: v.id } })).count
    }
    report.vacancies_keep = (await db.vacancy.deleteMany({ where: { companyId: keepCompanyId } })).count

    // Evaluation chain
    const kSessions = await db.evaluationSession.findMany({
      where: { companyId: keepCompanyId },
      select: { id: true },
    })
    for (const s of kSessions) {
      report.evalResp_keep = (report.evalResp_keep || 0)
        + (await db.evaluationResponse.deleteMany({ where: { sessionId: s.id } })).count
    }
    report.evalSessions_keep = (await db.evaluationSession.deleteMany({ where: { companyId: keepCompanyId } })).count
    report.evalResults_keep = (await db.evaluationResult.deleteMany({ where: { companyId: keepCompanyId } })).count

    // Interviews
    report.interviews_keep = (await db.interviewSchedule.deleteMany({ where: { companyId: keepCompanyId } })).count

    // Invitations
    report.invitations_keep = (await db.candidateInvitation.deleteMany({ where: { companyId: keepCompanyId } })).count

    // Templates + Questions
    const kPositions = await db.position.findMany({
      where: { companyId: keepCompanyId },
      select: { id: true },
    })
    for (const p of kPositions) {
      const tpls = await db.evaluationTemplate.findMany({
        where: { positionId: p.id },
        select: { id: true },
      })
      for (const t of tpls) {
        report.questions_keep = (report.questions_keep || 0)
          + (await db.question.deleteMany({ where: { evaluationTemplateId: t.id } })).count
      }
      report.templates_keep = (report.templates_keep || 0)
        + (await db.evaluationTemplate.deleteMany({ where: { positionId: p.id } })).count
    }
    report.positions_keep = (await db.position.deleteMany({ where: { companyId: keepCompanyId } })).count

    // Candidates
    const kCandidates = await db.user.findMany({
      where: { companyId: keepCompanyId, role: 'CANDIDATO' },
      select: { id: true },
    })
    for (const c of kCandidates) {
      await db.consentLog.deleteMany({ where: { userId: c.id } })
    }
    report.candidates_keep = (await db.user.deleteMany({ where: { companyId: keepCompanyId, role: 'CANDIDATO' } })).count

    // Custom questions for this company
    report.customQuestions_keep = (await db.question.deleteMany({
      where: { companyId: keepCompanyId },
    })).count

    return NextResponse.json({
      success: true,
      keptCompany: keepCompany.name,
      keptCompanyId: keepCompanyId,
      deleted: report,
      message: 'Limpieza completada. Solo queda la empresa sin datos operativos.',
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Error en limpieza', details: String(error) },
      { status: 500 }
    )
  }
}
