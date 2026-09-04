// @ts-nocheck — D.2.6 test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-D.2.6 — Synthetic fixture for /api/results migration tests.
 *
 * Creates:
 *   Empresa A / Empresa B
 *   RH-A, RH-B (RH), SUPER_ADMIN (no companyId)
 *   CAND-A, CAND-A2 (company A), CAND-B (company B)  [CANDIDATO]
 *   Position A/B, EvaluationSession A/B/A2/B2
 *   EvaluationResult A/B/A2/B (full psychometric scores + recommendation + summary)
 *   Vacancy A/B + VacancyApplication A/B/A2 (COMPLETED with scores)
 *
 * Writes the ID map to scripts/d26-fixture.json
 * Idempotent: deletes previous d26* fixture rows first (by email/name prefix).
 *
 * SAFETY: dev SQLite only (db/custom.db). No production, no raw SQL,
 * no schema changes, no scoring logic touched.
 */
import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { hashPassword } from '../src/lib/password'

const db = new PrismaClient()
const TS = Date.now()
const PWD = await hashPassword('D26Test#2026')

// Distinctive score sets — used to prove no score ever changes across migration
const SCORES_A = { openness: 71.5, conscientiousness: 82.25, extraversion: 63.0, agreeableness: 77.5, neuroticism: 21.25, stressLevel: 30.5, empathy: 74.0, adaptability: 69.25, leadership: 58.5, teamwork: 80.75, knowledgeScore: 88.0 as number | null, integrityScore: 91.5, overallScore: 76.4, recommendation: 'PERFIL_COMPLETO', summary: 'D26 SNAPSHOT SUMMARY A — must remain identical' }
const SCORES_B = { openness: 44.25, conscientiousness: 51.0, extraversion: 38.75, agreeableness: 49.5, neuroticism: 66.0, stressLevel: 72.25, empathy: 41.0, adaptability: 47.75, leadership: 35.5, teamwork: 52.25, knowledgeScore: null, integrityScore: 60.0, overallScore: 47.9, recommendation: 'PERFIL_PARCIAL', summary: 'D26 SNAPSHOT SUMMARY B — must remain identical' }
const SCORES_A2 = { openness: 55.0, conscientiousness: 60.5, extraversion: 49.25, agreeableness: 66.0, neuroticism: 40.0, stressLevel: 50.5, empathy: 57.0, adaptability: 61.25, leadership: 44.5, teamwork: 63.75, knowledgeScore: 70.5 as number | null, integrityScore: 73.0, overallScore: 57.3, recommendation: 'PERFIL_COMPLETO', summary: 'D26 SNAPSHOT SUMMARY A2 — must remain identical' }

async function main() {
  console.log('[d26-fixture] cleaning previous d26 fixture rows…')

  // ── Cleanup previous fixture (cascade-safe order, scoped to d26 emails/names) ──
  const oldUsers = await db.user.findMany({ where: { email: { startsWith: 'd26-' } } })
  const oldUserIds = oldUsers.map(u => u.id)
  if (oldUserIds.length > 0) {
    await db.evaluationResult.deleteMany({ where: { OR: [{ candidateId: { in: oldUserIds } }, { companyId: { in: await oldCompanyIds() } }] } })
    await db.evaluationSession.deleteMany({ where: { candidateId: { in: oldUserIds } } })
    await db.vacancyApplication.deleteMany({ where: { OR: [{ candidateEmail: { startsWith: 'd26-' } }, { companyId: { in: await oldCompanyIds() } }] } })
    await db.vacancy.deleteMany({ where: { slug: { startsWith: 'd26-' } } })
    await db.position.deleteMany({ where: { title: { startsWith: 'D26 ' } } })
    await db.user.deleteMany({ where: { id: { in: oldUserIds } } })
    await db.company.deleteMany({ where: { name: { startsWith: 'D26 ' } } })
  }
  async function oldCompanyIds(): Promise<string[]> {
    return (await db.company.findMany({ where: { name: { startsWith: 'D26 ' } } })).map(c => c.id)
  }

  console.log('[d26-fixture] creating companies…')
  const companyA = await db.company.create({ data: { name: `D26 Empresa A ${TS}`, sector: 'RESTAURANT' } })
  const companyB = await db.company.create({ data: { name: `D26 Empresa B ${TS}`, sector: 'RETAIL' } })

  console.log('[d26-fixture] creating users…')
  const rhA = await db.user.create({ data: { email: `d26-rh-a-${TS}@test.local`, name: 'D26 RH A', password: PWD, role: 'RH', companyId: companyA.id } })
  const rhB = await db.user.create({ data: { email: `d26-rh-b-${TS}@test.local`, name: 'D26 RH B', password: PWD, role: 'RH', companyId: companyB.id } })
  const sa = await db.user.create({ data: { email: `d26-sa-${TS}@test.local`, name: 'D26 Super Admin', password: PWD, role: 'SUPER_ADMIN', companyId: null } })
  const candA = await db.user.create({ data: { email: `d26-cand-a-${TS}@test.local`, name: 'D26 Candidato A', password: PWD, role: 'CANDIDATO', companyId: companyA.id, phone: '+52 961 000 0001', consentGiven: true, consentDate: new Date('2026-01-15T10:00:00Z') } })
  const candA2 = await db.user.create({ data: { email: `d26-cand-a2-${TS}@test.local`, name: 'D26 Candidato A2', password: PWD, role: 'CANDIDATO', companyId: companyA.id, phone: '+52 961 000 0002' } })
  const candB = await db.user.create({ data: { email: `d26-cand-b-${TS}@test.local`, name: 'D26 Candidato B', password: PWD, role: 'CANDIDATO', companyId: companyB.id, phone: '+52 961 000 0003' } })

  console.log('[d26-fixture] creating positions, sessions, results…')
  const posA = await db.position.create({ data: { title: `D26 Mesero A ${TS}`, category: 'MESERO', sector: 'RESTAURANT', companyId: companyA.id } })
  const posB = await db.position.create({ data: { title: `D26 Vendedor B ${TS}`, category: 'VENDEDOR', sector: 'RETAIL', companyId: companyB.id } })

  const sessA = await db.evaluationSession.create({ data: { candidateId: candA.id, positionId: posA.id, companyId: companyA.id, status: 'COMPLETED', startedAt: new Date('2026-02-01T09:00:00Z'), completedAt: new Date('2026-02-01T10:12:00Z') } })
  const sessA2 = await db.evaluationSession.create({ data: { candidateId: candA2.id, positionId: posA.id, companyId: companyA.id, status: 'COMPLETED', startedAt: new Date('2026-02-02T09:00:00Z'), completedAt: new Date('2026-02-02T10:05:00Z') } })
  const sessB = await db.evaluationSession.create({ data: { candidateId: candB.id, positionId: posB.id, companyId: companyB.id, status: 'COMPLETED', startedAt: new Date('2026-02-03T09:00:00Z'), completedAt: new Date('2026-02-03T10:20:00Z') } })

  const resA = await db.evaluationResult.create({ data: { sessionId: sessA.id, candidateId: candA.id, candidateName: candA.name, positionId: posA.id, positionTitle: posA.title, companyId: companyA.id, ...SCORES_A } })
  const resA2 = await db.evaluationResult.create({ data: { sessionId: sessA2.id, candidateId: candA2.id, candidateName: candA2.name, positionId: posA.id, positionTitle: posA.title, companyId: companyA.id, ...SCORES_A2 } })
  const resB = await db.evaluationResult.create({ data: { sessionId: sessB.id, candidateId: candB.id, candidateName: candB.name, positionId: posB.id, positionTitle: posB.title, companyId: companyB.id, ...SCORES_B } })

  console.log('[d26-fixture] creating vacancies + applications…')
  const vacA = await db.vacancy.create({ data: { title: `D26 Vacante A ${TS}`, slug: `d26-vac-a-${TS}`, sector: 'RESTAURANT', status: 'ACTIVE', companyId: companyA.id } })
  const vacB = await db.vacancy.create({ data: { title: `D26 Vacante B ${TS}`, slug: `d26-vac-b-${TS}`, sector: 'RETAIL', status: 'ACTIVE', companyId: companyB.id } })

  const appA = await db.vacancyApplication.create({ data: { vacancyId: vacA.id, companyId: companyA.id, candidateName: candA.name, candidateEmail: candA.email, candidatePhone: candA.phone, candidateUserId: candA.id, status: 'COMPLETED', startedAt: new Date('2026-02-05T09:00:00Z'), completedAt: new Date('2026-02-05T10:30:00Z'), ...SCORES_A } })
  const appA2 = await db.vacancyApplication.create({ data: { vacancyId: vacA.id, companyId: companyA.id, candidateName: candA2.name, candidateEmail: candA2.email, candidatePhone: '+52 961 000 0002', candidateUserId: candA2.id, status: 'COMPLETED', startedAt: new Date('2026-02-06T09:00:00Z'), completedAt: new Date('2026-02-06T10:15:00Z'), ...SCORES_A2 } })
  const appB = await db.vacancyApplication.create({ data: { vacancyId: vacB.id, companyId: companyB.id, candidateName: candB.name, candidateEmail: candB.email, candidatePhone: '+52 961 000 0003', candidateUserId: candB.id, status: 'COMPLETED', startedAt: new Date('2026-02-07T09:00:00Z'), completedAt: new Date('2026-02-07T10:40:00Z'), ...SCORES_B } })

  const fixture = {
    timestamp: new Date().toISOString(),
    companyA: companyA.id, companyB: companyB.id,
    rhA: rhA.id, rhB: rhB.id, sa: sa.id,
    candA: candA.id, candA2: candA2.id, candB: candB.id,
    emailRhA: rhA.email, emailRhB: rhB.email, emailSa: sa.email,
    emailCandA: candA.email, emailCandA2: candA2.email, emailCandB: candB.email,
    posA: posA.id, posB: posB.id,
    sessA: sessA.id, sessA2: sessA2.id, sessB: sessB.id,
    resA: resA.id, resA2: resA2.id, resB: resB.id,
    vacA: vacA.id, vacB: vacB.id,
    appA: appA.id, appA2: appA2.id, appB: appB.id,
    scores: { SCORES_A, SCORES_B, SCORES_A2 },
  }
  const out = join(import.meta.dir, 'd26-fixture.json')
  writeFileSync(out, JSON.stringify(fixture, null, 2))
  console.log('[d26-fixture] OK →', out)
  console.log(JSON.stringify(fixture, null, 2))
}

main().catch((e) => { console.error('[d26-fixture] FAILED:', e); process.exit(1) }).finally(() => db.$disconnect())
