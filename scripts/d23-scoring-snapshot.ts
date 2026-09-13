/**
 * PHASE 3.5-D.2.3 — Scoring snapshot (BEFORE / AFTER migration comparison)
 *
 * Creates a fully deterministic synthetic evaluation chain (position,
 * templates, questions, responses with FIXED values), completes the
 * evaluation through the real HTTP endpoint (POST /api/evaluations
 * action=complete), and captures the resulting EvaluationResult scores.
 *
 * Usage:
 *   bun scripts/d23-scoring-snapshot.ts save    → writes scripts/d23-scoring-snapshot.json
 *   bun scripts/d23-scoring-snapshot.ts verify  → re-runs and compares against the saved JSON
 *
 * The comparison covers ALL score fields, recommendation (guidance), summary,
 * candidateName and positionTitle. If ANY differs after the migration the
 * script exits non-zero with REGRESSION DE LOGICA DE EVALUACION.
 *
 * NOTE: scoring itself is NOT modified by D.2.3 — this snapshot proves it.
 */
import { db } from '../src/lib/db'
import { generateToken } from '../src/lib/auth'
import { hashPassword } from '../src/lib/password'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'

const BASE = 'http://localhost:3000'
const SNAPSHOT_PATH = 'scripts/d23-scoring-snapshot.json'
const SUFFIX = `snap${Date.now().toString(36)}`
const PREFIX = `d23snap-${SUFFIX}`

const mode = process.argv[2]
if (mode !== 'save' && mode !== 'verify') {
  console.error('Usage: bun scripts/d23-scoring-snapshot.ts save|verify')
  process.exit(2)
}

// ── FIXED answer values (identical in save & verify phases) ──
// Big Five (PSICOMETRICA): O=4, C=3, E=5, A=2, N=4 (reverse-scored questions)
const BIG_FIVE = [
  { category: 'OPENNESS', order: 1, reverseScored: false, answer: 4 },
  { category: 'CONSCIENTIOUSNESS', order: 2, reverseScored: false, answer: 3 },
  { category: 'EXTRAVERSION', order: 3, reverseScored: false, answer: 5 },
  { category: 'AGREEABLENESS', order: 4, reverseScored: false, answer: 2 },
  { category: 'NEUROTICISM', order: 5, reverseScored: true, answer: 4 },
]
// Psych (PSICOLOGICA): S=2(rev), E=4, A=4, L=3, T=5
const PSYCH = [
  { category: 'STRESS', order: 1, reverseScored: true, answer: 2 },
  { category: 'EMPATHY', order: 2, reverseScored: false, answer: 4 },
  { category: 'ADAPTABILITY', order: 3, reverseScored: false, answer: 4 },
  { category: 'LEADERSHIP', order: 4, reverseScored: false, answer: 3 },
  { category: 'TEAMWORK', order: 5, reverseScored: false, answer: 5 },
]
// Integrity (INTEGRIDAD): H=5, R=4, T=3(rev), R2=4
const INTEGRITY = [
  { category: 'INTEGRITY_HONESTY', order: 1, reverseScored: false, answer: 5 },
  { category: 'INTEGRITY_RULES', order: 2, reverseScored: false, answer: 4 },
  { category: 'INTEGRITY_THEFT', order: 3, reverseScored: true, answer: 3 },
  { category: 'INTEGRITY_RESPONSIBILITY', order: 4, reverseScored: false, answer: 4 },
]
// Knowledge (CONOCIMIENTOS): correct answers [1, 0, 3]; answers [1, 0, 2] → 2/3 correct
const KNOWLEDGE = [
  { order: 1, correctAnswer: 1, answer: 1 },
  { order: 2, correctAnswer: 0, answer: 0 },
  { order: 3, correctAnswer: 3, answer: 2 },
]

let passed = true

async function cleanup() {
  const companies = await db.company.findMany({ where: { name: { startsWith: 'D23SNAP-TEST-' } } })
  for (const c of companies) {
    const users = await db.user.findMany({ where: { companyId: c.id }, select: { id: true } })
    const userIds = users.map(u => u.id)
    if (userIds.length) {
      await db.evaluationResponse.deleteMany({ where: { session: { candidateId: { in: userIds } } } })
      await db.evaluationResult.deleteMany({ where: { candidateId: { in: userIds } } })
      await db.evaluationSession.deleteMany({ where: { candidateId: { in: userIds } } })
      await db.user.deleteMany({ where: { id: { in: userIds } } })
    }
    const positions = await db.position.findMany({ where: { companyId: c.id }, select: { id: true } })
    for (const p of positions) {
      const templates = await db.evaluationTemplate.findMany({ where: { positionId: p.id } })
      for (const t of templates) {
        await db.question.deleteMany({ where: { evaluationTemplateId: t.id } })
        await db.evaluationTemplate.delete({ where: { id: t.id } })
      }
    }
    await db.position.deleteMany({ where: { companyId: c.id } })
    await db.company.delete({ where: { id: c.id } })
  }
}

async function main() {
  await cleanup()

  // ── Synthetic tenant ──
  const company = await db.company.create({ data: { name: `D23SNAP-TEST-A-${SUFFIX}`, sector: 'RESTAURANT' } })
  const position = await db.position.create({
    data: { title: 'Mesero Snapshot', sector: 'RESTAURANT', category: 'MESERO', hasKnowledgeTest: true, companyId: company.id },
  })
  const pwd = await hashPassword('testpass123')
  const rh = await db.user.create({
    data: { email: `${PREFIX}-rh@test.local`, name: 'RH Snapshot', password: pwd, role: 'RH', companyId: company.id },
  })
  const cand = await db.user.create({
    data: {
      email: `${PREFIX}-cand@test.local`, name: 'Snapshot Candidate', password: pwd,
      role: 'CANDIDATO', companyId: company.id,
      consentGiven: true, consentDate: new Date(), consentOption: 'FULL',
      consentConfirmed: true, consentVersion: '2026-02-v1',
    },
  })

  // ── Templates + questions + session + responses (deterministic) ──
  const session = await db.evaluationSession.create({
    data: { candidateId: cand.id, positionId: position.id, companyId: company.id, status: 'IN_PROGRESS', currentStep: 4 },
  })
  async function mkTemplate(name: string, type: string, order: number) {
    return db.evaluationTemplate.create({
      data: { name, type, order, positionId: position.id, companyId: company.id },
    })
  }
  async function mkQuestion(templateId: string, q: { text: string; type: string; category: string; order: number; reverseScored?: boolean; options?: string; correctAnswer?: number }) {
    return db.question.create({
      data: {
        text: q.text, type: q.type, category: q.category, order: q.order,
        reverseScored: q.reverseScored || false,
        options: q.options || null,
        correctAnswer: q.correctAnswer ?? null,
        evaluationTemplateId: templateId,
      },
    })
  }

  const tPsi = await mkTemplate('Psicométrica Snapshot', 'PSICOMETRICA', 1)
  const tPsico = await mkTemplate('Psicológica Snapshot', 'PSICOLOGICA', 2)
  const tInt = await mkTemplate('Integridad Snapshot', 'INTEGRIDAD', 3)
  const tCon = await mkTemplate('Conocimientos Snapshot', 'CONOCIMIENTOS', 4)

  const answers: { sessionId: string; questionId: string; value: string; numericValue: number | null; companyId: string }[] = []

  for (const q of BIG_FIVE) {
    const qq = await mkQuestion(tPsi.id, { text: `BF-${q.category}-${q.order}`, type: 'LIKERT', category: q.category, order: q.order, reverseScored: q.reverseScored })
    answers.push({ sessionId: session.id, questionId: qq.id, value: String(q.answer), numericValue: q.answer, companyId: company.id })
  }
  for (const q of PSYCH) {
    const qq = await mkQuestion(tPsico.id, { text: `PS-${q.category}-${q.order}`, type: 'LIKERT', category: q.category, order: q.order, reverseScored: q.reverseScored })
    answers.push({ sessionId: session.id, questionId: qq.id, value: String(q.answer), numericValue: q.answer, companyId: company.id })
  }
  for (const q of INTEGRITY) {
    const qq = await mkQuestion(tInt.id, { text: `IN-${q.category}-${q.order}`, type: 'LIKERT', category: q.category, order: q.order, reverseScored: q.reverseScored })
    answers.push({ sessionId: session.id, questionId: qq.id, value: String(q.answer), numericValue: q.answer, companyId: company.id })
  }
  for (const q of KNOWLEDGE) {
    const qq = await mkQuestion(tCon.id, {
      text: `KN-${q.order}`, type: 'MULTIPLE_CHOICE', category: 'KNOWLEDGE', order: q.order,
      options: JSON.stringify(['optA', 'optB', 'optC', 'optD']), correctAnswer: q.correctAnswer,
    })
    answers.push({ sessionId: session.id, questionId: qq.id, value: String(q.answer), numericValue: null, companyId: company.id })
  }
  await db.evaluationResponse.createMany({ data: answers })

  // ── Token + HTTP complete ──
  const token = await generateToken({ sub: rh.id, email: rh.email, name: rh.name, role: rh.role, companyId: company.id } as never)
  const res = await fetch(`${BASE}/api/evaluations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sessionId: session.id, action: 'complete' }),
  })
  const json = await res.json()
  if (res.status !== 200 || !json.result) {
    console.error(`FATAL: complete returned ${res.status}`, JSON.stringify(json))
    process.exit(1)
  }

  const result = json.result as Record<string, unknown>
  // Capture only deterministic, logic-relevant fields (IDs/dates excluded).
  // companyId is environment-dependent (synthetic company cuid changes per run)
  // and is NOT part of the scoring logic — verified separately by CE tests.
  const snapshot = {
    candidateName: result.candidateName,
    positionTitle: result.positionTitle,
    openness: result.openness,
    conscientiousness: result.conscientiousness,
    extraversion: result.extraversion,
    agreeableness: result.agreeableness,
    neuroticism: result.neuroticism,
    stressLevel: result.stressLevel,
    empathy: result.empathy,
    adaptability: result.adaptability,
    leadership: result.leadership,
    teamwork: result.teamwork,
    knowledgeScore: result.knowledgeScore,
    integrityScore: result.integrityScore,
    overallScore: result.overallScore,
    recommendation: result.recommendation,
    summary: result.summary,
  }

  if (mode === 'save') {
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2))
    console.log('=== SNAPSHOT SAVED (BEFORE migration) ===')
    console.log(JSON.stringify(snapshot, null, 2))
  } else {
    // verify
    const before = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf-8')) as Record<string, unknown>
    console.log('=== SCORING COMPARISON (AFTER migration) ===')
    const diffs: string[] = []
    for (const key of Object.keys(before)) {
      if (JSON.stringify(before[key]) !== JSON.stringify(snapshot[key])) {
        diffs.push(key)
        console.log(`  DIFF ${key}:`)
        console.log(`    BEFORE: ${JSON.stringify(before[key])}`)
        console.log(`    AFTER:  ${JSON.stringify(snapshot[key])}`)
      }
    }
    if (diffs.length === 0) {
      console.log('  IDENTICAL — 0 diferencias en scores/recommendation/summary.')
      console.log('  REGRESION DE SCORING: NO HAY.')
    } else {
      passed = false
      console.log(`  REGRESION DE LOGICA DE EVALUACION — campos alterados: ${diffs.join(', ')}`)
    }
  }

  // ── Cleanup ──
  await db.evaluationResponse.deleteMany({ where: { sessionId: session.id } })
  await db.evaluationResult.deleteMany({ where: { sessionId: session.id } })
  await db.evaluationSession.delete({ where: { id: session.id } })
  await db.user.deleteMany({ where: { companyId: company.id } })
  for (const t of [tPsi, tPsico, tInt, tCon]) {
    await db.question.deleteMany({ where: { evaluationTemplateId: t.id } })
    await db.evaluationTemplate.delete({ where: { id: t.id } })
  }
  await db.position.delete({ where: { id: position.id } })
  await db.company.delete({ where: { id: company.id } })
  if (mode === 'verify') {
    try { unlinkSync(SNAPSHOT_PATH) } catch { /* ignore */ }
  }

  console.log('[cleanup] synthetic snapshot tenant removed')
  process.exit(passed ? 0 : 1)
}

main().catch(e => {
  console.error('FATAL:', e)
  process.exit(1)
})
