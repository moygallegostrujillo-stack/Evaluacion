/**
 * FASE 3.5-D.2.9 (PARTE 9) — Backfill of direct tenant columns on the
 * 4 indirect models:
 *
 *   EvaluationResponse.companyId        ← EvaluationSession.companyId
 *   EvaluationTemplate.companyId        ← Position.companyId
 *   VacancyQuestion.companyId           ← Vacancy.companyId
 *   VacancyApplicationResponse.companyId ← VacancyApplication.companyId
 *
 * Idempotent: only touches rows where companyId IS NULL.
 * Verifies the tenant invariant (child.companyId == parent.companyId)
 * and fails (exit 1) if any mismatch or NULL remains.
 *
 * Usage: bun scripts/d29-backfill.ts
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function backfill() {
  // 1. EvaluationResponse ← EvaluationSession
  const allResponses = await db.evaluationResponse.findMany({
    select: { id: true, sessionId: true, companyId: true },
  })
  // Filter in JS so the script type-checks against BOTH the nullable schema
  // (backfill window) and the final NOT NULL schema (idempotent re-runs).
  const responses = allResponses.filter((r) => r.companyId == null)
  for (const r of responses) {
    const session = await db.evaluationSession.findUnique({
      where: { id: r.sessionId },
      select: { companyId: true },
    })
    if (!session) throw new Error(`Orphan EvaluationResponse ${r.id}: session ${r.sessionId} missing`)
    await db.evaluationResponse.update({ where: { id: r.id }, data: { companyId: session.companyId } })
  }
  console.log(`EvaluationResponse: backfilled ${responses.length}`)

  // 2. EvaluationTemplate ← Position
  const allTemplates = await db.evaluationTemplate.findMany({
    select: { id: true, positionId: true, companyId: true },
  })
  const templates = allTemplates.filter((t) => t.companyId == null)
  for (const t of templates) {
    const position = await db.position.findUnique({
      where: { id: t.positionId },
      select: { companyId: true },
    })
    if (!position) throw new Error(`Orphan EvaluationTemplate ${t.id}: position ${t.positionId} missing`)
    await db.evaluationTemplate.update({ where: { id: t.id }, data: { companyId: position.companyId } })
  }
  console.log(`EvaluationTemplate: backfilled ${templates.length}`)

  // 3. VacancyQuestion ← Vacancy
  const allVqs = await db.vacancyQuestion.findMany({
    select: { id: true, vacancyId: true, companyId: true },
  })
  const vqs = allVqs.filter((q) => q.companyId == null)
  for (const q of vqs) {
    const vacancy = await db.vacancy.findUnique({
      where: { id: q.vacancyId },
      select: { companyId: true },
    })
    if (!vacancy) throw new Error(`Orphan VacancyQuestion ${q.id}: vacancy ${q.vacancyId} missing`)
    await db.vacancyQuestion.update({ where: { id: q.id }, data: { companyId: vacancy.companyId } })
  }
  console.log(`VacancyQuestion: backfilled ${vqs.length}`)

  // 4. VacancyApplicationResponse ← VacancyApplication
  const allVars = await db.vacancyApplicationResponse.findMany({
    select: { id: true, applicationId: true, companyId: true },
  })
  const vars = allVars.filter((r) => r.companyId == null)
  for (const r of vars) {
    const app = await db.vacancyApplication.findUnique({
      where: { id: r.applicationId },
      select: { companyId: true },
    })
    if (!app) throw new Error(`Orphan VacancyApplicationResponse ${r.id}: application ${r.applicationId} missing`)
    await db.vacancyApplicationResponse.update({ where: { id: r.id }, data: { companyId: app.companyId } })
  }
  console.log(`VacancyApplicationResponse: backfilled ${vars.length}`)
}

async function verifyInvariant() {
  const problems: string[] = []

  const badResponses = await db.$queryRawUnsafe<Array<{ n: bigint }>>(
    `SELECT COUNT(*) as n FROM "EvaluationResponse" r JOIN "EvaluationSession" s ON r."sessionId" = s."id"
     WHERE r."companyId" IS NULL OR r."companyId" != s."companyId"`
  )
  const badTemplates = await db.$queryRawUnsafe<Array<{ n: bigint }>>(
    `SELECT COUNT(*) as n FROM "EvaluationTemplate" t JOIN "Position" p ON t."positionId" = p."id"
     WHERE t."companyId" IS NULL OR t."companyId" != p."companyId"`
  )
  const badVq = await db.$queryRawUnsafe<Array<{ n: bigint }>>(
    `SELECT COUNT(*) as n FROM "VacancyQuestion" q JOIN "Vacancy" v ON q."vacancyId" = v."id"
     WHERE q."companyId" IS NULL OR q."companyId" != v."companyId"`
  )
  const badVar = await db.$queryRawUnsafe<Array<{ n: bigint }>>(
    `SELECT COUNT(*) as n FROM "VacancyApplicationResponse" r JOIN "VacancyApplication" a ON r."applicationId" = a."id"
     WHERE r."companyId" IS NULL OR r."companyId" != a."companyId"`
  )

  const checks: Array<[string, bigint]> = [
    ['EvaluationResponse', badResponses[0].n],
    ['EvaluationTemplate', badTemplates[0].n],
    ['VacancyQuestion', badVq[0].n],
    ['VacancyApplicationResponse', badVar[0].n],
  ]
  for (const [name, n] of checks) {
    if (Number(n) > 0) problems.push(`${name}: ${n} rows violate the tenant invariant`)
  }
  return problems
}

async function main() {
  await backfill()
  const problems = await verifyInvariant()
  if (problems.length > 0) {
    console.error('INVARIANT FAILURES:')
    for (const p of problems) console.error(' -', p)
    process.exit(1)
  }
  console.log('Tenant invariant verified: child.companyId == parent.companyId on all rows (0 violations, 0 NULLs).')
  await db.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
