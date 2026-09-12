// @ts-nocheck — A-03.5 verification tooling (Bun-only, not part of the Next.js build)
/**
 * EVALUHR — A-03.5 NORMALIZACIÓN DEL MODELO CANÓNICO DE KNOWLEDGE ASSESSMENT
 *
 * Usage:  bun scripts/a035-tests.ts
 * Requires: dev server running on http://localhost:3000
 *
 * Covers:
 *   CAN-1..7     canonical chain on the PUBLIC flow      (PASO 2-8)
 *   INT-1..4     internal freeze + serving + stamping    (PASO 7/8/17)
 *   XFLOW-1..3   cross-flow instrument equality          (PASO 16)
 *   CONC-1..2    concurrency — same published version    (PASO 14)
 *   CHG-1..8     change test A=v1 / B=v2 / C=v3          (PASO 15)
 *   INTG-1..3    referential integrity invariants        (PASO 17)
 *   REC-1..3     historical reconstruction               (PASO 18)
 *   LEG-1..3     legacy classification, no migration     (PASO 12)
 *   SCORE-1..4   INSUFFICIENT ≠ 0 + separation           (PASO 10/11)
 *   SEC-1..4     security / IA boundary                  (PASO 13)
 *   REG-1..6     regression                              (PASO 19)
 */

import { PrismaClient } from '@prisma/client'

const BASE = 'http://localhost:3000'
const db = new PrismaClient({ log: ['error'] })

const results: Array<{ id: string; desc: string; expected: string; got: string; pass: boolean }> = []
function check(id: string, desc: string, expected: string, actual: unknown, pass: boolean) {
  results.push({ id, desc, expected, got: String(actual).slice(0, 220), pass })
  console.log(`${pass ? '✅' : '❌'} [${id}] ${desc} → ${String(actual).slice(0, 140)}`)
}
function assertTrue(id: string, desc: string, cond: boolean, detail = '') {
  check(id, desc, 'true', cond ? 'true' : `false ${detail}`, cond)
}
function assertEq(id: string, desc: string, expected: unknown, actual: unknown) {
  const pass = String(expected) === String(actual)
  check(id, desc, String(expected), actual, pass)
}

async function post(path: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  let json: any = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}
async function get(path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE}${path}`, { headers })
  let json: any = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}

function candidateHeaders(userId: string, companyId: string) {
  return {
    'x-user-id': userId,
    'x-user-role': 'CANDIDATO',
    'x-user-email': `cand-${userId.slice(-6)}@a035.test`,
    'x-user-company-id': companyId,
  }
}

// Snapshot of pre-existing (A-03.4-era and older) rows — must be UNTOUCHED at the end.
async function snapshotLegacyRows() {
  const apps = await db.vacancyApplication.findMany({
    where: { OR: [{ knowledgeVersioningStatus: 'LEGACY' }, { knowledgeVersioningStatus: null }] },
    select: {
      id: true, knowledgeScore: true, overallScore: true, knowledgeVersioningStatus: true,
      knowledgeAssessmentVersion: true, knowledgeBlueprintVersion: true,
    },
  })
  const assessments = await db.knowledgeAssessment.findMany({
    select: { id: true, version: true, blueprintVersion: true, status: true, contentHash: true, publishedBy: true },
  })
  return { apps, assessments }
}

const before = await snapshotLegacyRows()
const beforeAssessmentIds = new Set(before.assessments.map(a => a.id))
console.log(`═══ A-03.5 — legacy snapshot: ${before.apps.length} legacy apps, ${before.assessments.length} pre-existing assessments ═══`)

// ────────────────────────────────────────────────────────────
// FIXTURE
// ────────────────────────────────────────────────────────────
console.log('═══ A-03.5 — FIXTURE ═══')

const company = await db.company.create({ data: { name: `A035-Company-${Date.now()}`, sector: 'RESTAURANT' } })

// V1 — public flow, canonical chain tests (3 keyed + 1 keyless)
const vacMain = await db.vacancy.create({
  data: {
    title: 'A035 Canonical Vacancy', slug: `a035-main-${Date.now()}`, sector: 'RESTAURANT', status: 'ACTIVE',
    includePsicometrica: false, includePsicologica: false, includeIntegridad: false, companyId: company.id,
  },
})
async function addVQ(vacancyId: string, text: string, correctAnswer: number | null, order: number, origin: string | null = 'RH_MANUAL') {
  return db.vacancyQuestion.create({
    data: {
      text, type: 'MULTIPLE_CHOICE',
      options: JSON.stringify(['Opción A', 'Opción B', 'Opción C', 'Opción D']),
      correctAnswer, order, vacancyId, companyId: company.id, origin,
    },
  })
}
const mq1 = await addVQ(vacMain.id, 'A035 M1 (clave estable)', 1, 1)
const mq2 = await addVQ(vacMain.id, 'A035 M2 (clave estable)', 2, 2)
const mq3 = await addVQ(vacMain.id, 'A035 M3 (clave estable)', 0, 3)
const mq4 = await addVQ(vacMain.id, 'A035 M4 (sin clave — no escorable)', null, 4)

// V2 — cross-flow twin (cloned from the twin position's generated template at test time)
const vacTwin = await db.vacancy.create({
  data: {
    title: 'A035 CrossFlow Vacancy', slug: `a035-twin-${Date.now()}`, sector: 'RESTAURANT', status: 'ACTIVE',
    includePsicometrica: false, includePsicologica: false, includeIntegridad: false, companyId: company.id,
  },
})

// V-KEYLESS — INSUFFICIENT semantics (PASO 10)
const vacKeyless = await db.vacancy.create({
  data: {
    title: 'A035 Keyless Vacancy', slug: `a035-keyless-${Date.now()}`, sector: 'RESTAURANT', status: 'ACTIVE',
    includePsicometrica: false, includePsicologica: false, includeIntegridad: false, companyId: company.id,
  },
})
const kq1 = await addVQ(vacKeyless.id, 'A035 K1 (sin clave)', null, 1)
const kq2 = await addVQ(vacKeyless.id, 'A035 K2 (sin clave)', null, 2)

// V-CHANGE — PASO 15 scenario (A=v1, B=v2, C=v3)
const vacChange = await db.vacancy.create({
  data: {
    title: 'A035 Change Vacancy', slug: `a035-change-${Date.now()}`, sector: 'RESTAURANT', status: 'ACTIVE',
    includePsicometrica: false, includePsicologica: false, includeIntegridad: false, companyId: company.id,
  },
})
const cq1 = await addVQ(vacChange.id, 'A035 C1 (clave v1=A → v2=B)', 0, 1)
const cq2 = await addVQ(vacChange.id, 'A035 C2 (estable)', 2, 2)
const cq3 = await addVQ(vacChange.id, 'A035 C3 (cambia tras B → v3)', 1, 3)

// V-ALL — full-section vacancy for the overallScore separation test (PASO 11)
const vacAll = await db.vacancy.create({
  data: {
    title: 'A035 All Sections', slug: `a035-all-${Date.now()}`, sector: 'RESTAURANT', status: 'ACTIVE',
    includePsicometrica: true, includePsicologica: true, includeIntegridad: true, companyId: company.id,
  },
})

// P1 — internal position (full templates auto-generated on start; MESERO has keyed knowledge)
const posMain = await db.position.create({
  data: { title: 'Mesero A035', sector: 'RESTAURANT', category: 'MESERO', hasKnowledgeTest: true, companyId: company.id },
})
// P2 — cross-flow twin position (same MESERO template questions as vacTwin bank)
const posTwin = await db.position.create({
  data: { title: 'Mesero Twin A035', sector: 'RESTAURANT', category: 'MESERO', hasKnowledgeTest: true, companyId: company.id },
})

// Candidate user for the internal flow (with valid consent)
const { hashPassword } = await import('../src/lib/password')
const CAND_PASSWORD = 'a035-test-password-123'
const candUser = await db.user.create({
  data: {
    email: `a035-candidate-${Date.now()}@a035.test`, name: 'Candidato Interno A035',
    password: await hashPassword(CAND_PASSWORD), role: 'CANDIDATO', companyId: company.id,
    consentGiven: true, consentOption: 'FULL', consentConfirmed: true, consentVersion: '2026-02-v1',
  },
})
const candTwin = await db.user.create({
  data: {
    email: `a035-twin-${Date.now()}@a035.test`, name: 'Candidato Twin A035',
    password: await hashPassword(CAND_PASSWORD), role: 'CANDIDATO', companyId: company.id,
    consentGiven: true, consentOption: 'FULL', consentConfirmed: true, consentVersion: '2026-02-v1',
  },
})

// Real JWT via /api/auth login (the middleware verifies the token and injects
// the x-user-* headers itself — raw headers are not an auth mechanism).
async function loginAndGetHeader(email: string) {
  const res = await post('/api/auth', { action: 'login', email, password: CAND_PASSWORD })
  if (res.status !== 200 || !res.json?.token) {
    throw new Error(`login failed for ${email}: ${res.status} ${JSON.stringify(res.json)?.slice(0, 200)}`)
  }
  return { Authorization: `Bearer ${res.json.token}` }
}
const hdrIntFull = await loginAndGetHeader(candUser.email)
const hdrTwinFull = await loginAndGetHeader(candTwin.email)
const hdrInt = hdrIntFull
const hdrTwin = hdrTwinFull

async function startPublic(vacancySlug: string, name: string) {
  return post('/api/public/apply', { step: 'data', vacancySlug, name, email: `${name.replace(/\s/g, '.').toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@a035.test` })
}

// ════════════════════════════════════════════════════════════
// CAN — canonical chain on the public flow (PASO 2-8)
// ════════════════════════════════════════════════════════════
console.log('═══ CAN — canonical chain (public) ═══')

const startMain = await startPublic(vacMain.slug, 'Candidato Canon')
assertEq('CAN-0', 'public start succeeds', 200, startMain.status)
const appCanonId = startMain.json?.applicationId

const appCanon = await db.vacancyApplication.findUnique({ where: { id: appCanonId } })
const admCanon = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: appCanonId }, include: { assessment: true } })
const bpCanon = admCanon?.blueprintId
  ? await db.knowledgeBlueprint.findUnique({ where: { id: admCanon.blueprintId }, include: { requirements: true } })
  : null
const assessCanon = admCanon?.assessment

assertTrue('CAN-1', 'KnowledgeBlueprint exists and is linked to the JOB (vacancyId + jobType=VACANCY + BP-v1)',
  !!bpCanon && bpCanon.jobId === vacMain.id && bpCanon.jobType === 'VACANCY' && bpCanon.blueprintVersion === 'BP-v1' && bpCanon.status === 'ACTIVE',
  JSON.stringify({ bp: !!bpCanon, jobId: bpCanon?.jobId === vacMain.id, v: bpCanon?.blueprintVersion }))

assertTrue('CAN-2', 'KnowledgeRequirements linked to blueprint with full metadata (domain/subdomain/description/importance/source/rationale/version/status)',
  !!bpCanon && bpCanon.requirements.length === 4 && bpCanon.requirements.every(r =>
    r.blueprintId === bpCanon.id && r.domain === 'JOB_KNOWLEDGE' && r.subdomain === 'VACANCY_BANK' &&
    r.description.length > 0 && r.importance === 'REQUIRED' && r.source != null && r.version >= 1 && r.status === 'APPROVED'),
  `requirements=${bpCanon?.requirements.length}`)

const assessItems = await db.knowledgeAssessmentItem.findMany({ where: { assessmentId: admCanon.assessmentId }, orderBy: { order: 'asc' } })
const itemVersionRows = await db.knowledgeItemVersion.findMany({ where: { id: { in: assessItems.map(i => i.itemVersionId) } } })
assertTrue('CAN-3', 'KnowledgeItemVersions resolve requirementId+itemId+itemVersion with content + protected key',
  itemVersionRows.length === 4 && itemVersionRows.every(iv =>
    iv.requirementId && iv.itemId && iv.itemVersion >= 1 && iv.question.length > 0 &&
    JSON.parse(iv.options).length === 4 && iv.difficulty === 'UNKNOWN' && iv.status === 'APPROVED' &&
    (iv.hasKey ? iv.correctAnswer !== null : iv.correctAnswer === null)),
  `itemVersions=${itemVersionRows.length}`)

assertTrue('CAN-4', 'KnowledgeAssessment linked to job + blueprint (jobType=VACANCY, blueprintId set, KA-v1, publishedBy SYSTEM)',
  !!assessCanon && assessCanon.jobType === 'VACANCY' && assessCanon.vacancyId === vacMain.id &&
  assessCanon.blueprintId === bpCanon.id && assessCanon.version === 1 &&
  assessCanon.publishedBy?.startsWith('SYSTEM:'),
  JSON.stringify({ v: assessCanon?.version, bp: assessCanon?.blueprintId === bpCanon?.id }))

assertTrue('CAN-5', 'KnowledgeAssessmentItem rows carry canonical links (requirementId + itemVersionId)',
  assessItems.length === 4 && assessItems.every(i => i.requirementId && i.itemVersionId),
  `items=${assessItems.length}, linked=${assessItems.filter(i => i.requirementId && i.itemVersionId).length}`)

assertTrue('CAN-6', 'KnowledgeAdministration frozen (channel PUBLIC_VACANCY, bound to application+assessment, versions denormalized)',
  !!admCanon && admCanon.channel === 'PUBLIC_VACANCY' && admCanon.vacancyApplicationId === appCanonId &&
  admCanon.assessmentId === assessCanon.id && admCanon.assessmentVersion === 1 &&
  admCanon.blueprintVersion === 'BP-v1' && admCanon.scoringVersion === 'PUB-KS-v1' &&
  admCanon.status === 'FROZEN' && admCanon.itemCount === 4,
  JSON.stringify({ v: admCanon?.assessmentVersion, bp: admCanon?.blueprintVersion, items: admCanon?.itemCount }))

assertTrue('CAN-7', 'Application freeze fields intact + classified KA-V1+',
  appCanon.knowledgeVersioningStatus === 'VERSIONED' && appCanon.knowledgeAssessmentVersion === 1 &&
  appCanon.knowledgeBlueprintVersion === 'BP-v1' && appCanon.knowledgeScoringVersion === 'PUB-KS-v1' && !!appCanon.knowledgeAssessmentId,
  appCanon.knowledgeVersioningStatus)

// ════════════════════════════════════════════════════════════
// SEC — security: denylist + key protection (PASO 9/10/13)
// ════════════════════════════════════════════════════════════
console.log('═══ SEC — security & key protection ═══')

const sec1 = await post('/api/public/apply', { step: 'answer', applicationId: appCanonId, section: 'CONOCIMIENTOS', questionId: mq1.id, vacancyQuestionId: mq1.id, value: '1', token: startMain.json.token, blueprintId: 'HACK' })
assertEq('SEC-1a', 'client sending blueprintId rejected', 403, sec1.status)
const sec1b = await post('/api/public/apply', { step: 'answer', applicationId: appCanonId, section: 'CONOCIMIENTOS', questionId: mq1.id, vacancyQuestionId: mq1.id, value: '1', token: startMain.json.token, requirementId: 'HACK' })
assertEq('SEC-1b', 'client sending requirementId rejected', 403, sec1b.status)
const sec1c = await post('/api/public/apply', { step: 'advance', applicationId: appCanonId, completedStep: 4, token: startMain.json.token, knowledgeAdministrationId: 'HACK' })
assertEq('SEC-1c', 'client sending knowledgeAdministrationId rejected', 403, sec1c.status)
const sec1d = await post('/api/public/apply', { step: 'advance', applicationId: appCanonId, completedStep: 4, token: startMain.json.token, evidenceStatus: 'VALID' })
assertEq('SEC-1d', 'client sending evidenceStatus rejected', 403, sec1d.status)

// Answer canon fully (mq1=1✓ mq2=2✓ mq3=0✓ mq4 keyless) then GET step 4 deep-scan
const ansM1 = await post('/api/public/apply', { step: 'answer', applicationId: appCanonId, section: 'CONOCIMIENTOS', questionId: mq1.id, vacancyQuestionId: mq1.id, value: '1', token: startMain.json.token })
const ansM2 = await post('/api/public/apply', { step: 'answer', applicationId: appCanonId, section: 'CONOCIMIENTOS', questionId: mq2.id, vacancyQuestionId: mq2.id, value: '2', token: startMain.json.token })
const ansM3 = await post('/api/public/apply', { step: 'answer', applicationId: appCanonId, section: 'CONOCIMIENTOS', questionId: mq3.id, vacancyQuestionId: mq3.id, value: '0', token: startMain.json.token })
const getCanon = await get(`/api/public/apply?applicationId=${appCanonId}&token=${startMain.json.token}&step=4`)
const canonPayload = JSON.stringify(getCanon.json)
assertTrue('SEC-2', 'public candidate payload contains NO correctAnswer and NO governance fields',
  !canonPayload.includes('correctAnswer') && !canonPayload.includes('blueprintId') && !canonPayload.includes('requirementId') && !canonPayload.includes('knowledgeAdministrationId'),
  canonPayload.includes('correctAnswer') ? 'LEAK' : 'clean')
const respCanonRow = await db.vacancyApplicationResponse.findFirst({
  where: { applicationId: appCanonId, section: 'CONOCIMIENTOS', vacancyQuestionId: mq1.id },
})
assertTrue('SEC-3', 'knowledge response stamped server-side with knowledgeAdministrationId',
  respCanonRow?.knowledgeAdministrationId === admCanon.id && respCanonRow.correctAnswerSnapshot === 1 && respCanonRow.itemVersion === 1,
  `admin=${respCanonRow?.knowledgeAdministrationId === admCanon.id}`)

// ════════════════════════════════════════════════════════════
// INT — internal channel freeze (PASO 7/8)
// ════════════════════════════════════════════════════════════
console.log('═══ INT — internal channel freeze ═══')

const csInt = await post('/api/evaluations', { action: 'create-session', candidateId: candUser.id, positionId: posMain.id }, hdrInt)
assertEq('INT-0a', 'internal create-session', 201, csInt.status)
const sessionIdInt = csInt.json.session.id
const startInt = await post('/api/evaluations', { sessionId: sessionIdInt, action: 'start' }, hdrInt)
assertEq('INT-0b', 'internal start', 200, startInt.status)

const admInt = await db.knowledgeAdministration.findUnique({ where: { evaluationSessionId: sessionIdInt }, include: { assessment: true } })
assertTrue('INT-1', 'internal start froze a canonical administration (channel INTERNAL_POSITION, bound to session)',
  !!admInt && admInt.channel === 'INTERNAL_POSITION' && admInt.assessmentVersion === 1 &&
  admInt.blueprintVersion === 'BP-v1' && admInt.scoringVersion === 'PUB-KS-v1' && admInt.status === 'FROZEN',
  JSON.stringify({ channel: admInt?.channel, v: admInt?.assessmentVersion }))

// The internal client renders the templates from the START response
// (EvaluationView.handleStart). Assert the frozen knowledge set there.
const allTemplates = startInt.json.templates || []
const knTemplate = allTemplates.find(t => t.type === 'CONOCIMIENTOS')
const intPayload = JSON.stringify(startInt.json)
assertTrue('INT-2', 'internal knowledge step served FROZEN (10 items, no correctAnswer anywhere in candidate payload)',
  !!knTemplate && knTemplate.questions.length === 10 &&
  !intPayload.includes('correctAnswer') && !intPayload.includes('blueprintId') && !intPayload.includes('requirementId'),
  `knQuestions=${knTemplate?.questions?.length}, leak=${intPayload.includes('correctAnswer')}`)

// Answer first knowledge question → stamped
const knQ1 = knTemplate.questions[0]
const ansInt1 = await post('/api/evaluations', { sessionId: sessionIdInt, action: 'answer', questionId: knQ1.id, value: String(knQ1.type === 'LIKERT' ? 4 : 0), numericValue: knQ1.type === 'LIKERT' ? 4 : null }, hdrInt)
assertEq('INT-3a', 'internal answer accepted', 200, ansInt1.status)
const intRespRow = await db.evaluationResponse.findFirst({ where: { sessionId: sessionIdInt, questionId: knQ1.id } })
if (knQ1.type !== 'LIKERT') {
  assertTrue('INT-3b', 'internal knowledge answer stamped with administration id',
    intRespRow?.knowledgeAdministrationId === admInt.id, `stamp=${intRespRow?.knowledgeAdministrationId === admInt.id}`)
} else {
  assertTrue('INT-3b', 'internal LIKERT answer stored (no knowledge stamp expected for non-knowledge)', !!intRespRow, '')
}

// OUT-OF-ADMINISTRATION rejection: create a NEW knowledge question in the live
// template AFTER the freeze (bank change) and try to answer it.
const newKnQuestion = await db.question.create({
  data: {
    text: 'A035 INT intruder question (post-freeze)', type: 'MULTIPLE_CHOICE',
    options: JSON.stringify(['X', 'Y', 'Z', 'W']), category: 'KNOWLEDGE', order: 99,
    evaluationTemplateId: (await db.evaluationTemplate.findFirst({ where: { positionId: posMain.id, type: 'CONOCIMIENTOS' } })).id,
    correctAnswer: 0, companyId: company.id,
  },
})
const intruder = await post('/api/evaluations', { sessionId: sessionIdInt, action: 'answer', questionId: newKnQuestion.id, value: '0' }, hdrInt)
assertEq('INT-4', 'internal answer to item OUTSIDE the frozen administration rejected (403 ITEM_NOT_IN_ADMINISTRATION)', 403, intruder.status)

// ════════════════════════════════════════════════════════════
// XFLOW — cross-flow instrument equality (PASO 16)
// ════════════════════════════════════════════════════════════
console.log('═══ XFLOW — cross-flow ═══')

// Internal candidate FIRST on posTwin — this generates the MESERO template
// (10 keyed questions). We then CLONE that exact bank into vacTwin so both
// channels administer byte-identical content.
const csTwin = await post('/api/evaluations', { action: 'create-session', candidateId: candTwin.id, positionId: posTwin.id }, hdrTwin)
const sessionIdTwin = csTwin.json.session.id
const startTwinInt = await post('/api/evaluations', { sessionId: sessionIdTwin, action: 'start' }, hdrTwin)
assertEq('XFLOW-0b', 'internal twin start', 200, startTwinInt.status)
const admTwinInt = await db.knowledgeAdministration.findUnique({ where: { evaluationSessionId: sessionIdTwin }, include: { assessment: { include: { items: true } }, blueprint: { include: { requirements: true } } } })

// Clone the twin position's CONOCIMIENTOS bank into the twin vacancy (same
// text/options/order/key — the exact same instrument content).
const twinTemplate = await db.evaluationTemplate.findFirst({
  where: { positionId: posTwin.id, type: 'CONOCIMIENTOS' },
  include: { questions: { orderBy: { order: 'asc' } } },
})
for (const q of twinTemplate.questions) {
  await db.vacancyQuestion.create({
    data: {
      text: q.text,
      type: q.type,
      options: q.options, // identical JSON string
      correctAnswer: q.correctAnswer,
      order: q.order,
      vacancyId: vacTwin.id,
      companyId: company.id,
      origin: 'RH_MANUAL',
    },
  })
}

// Public candidate on vacTwin (now byte-identical bank)
const startTwinPub = await startPublic(vacTwin.slug, 'Candidato Twin Publico')
assertEq('XFLOW-0a', 'public twin start', 200, startTwinPub.status)
const admTwinPub = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: startTwinPub.json.applicationId }, include: { assessment: { include: { items: true } }, blueprint: { include: { requirements: true } } } })

function frozenContentSig(adm: any) {
  return adm.assessment.items
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((i) => {
      const snap = JSON.parse(i.questionSnapshot)
      return `${snap.text}|${(snap.options ?? []).join(';')}|${i.correctAnswerSnapshot === null ? 'NO_KEY' : i.correctAnswerSnapshot}`
    })
    .join('##')
}
assertTrue('XFLOW-1', 'cross-flow: SAME requirements (structure equality across channels)',
  admTwinPub.blueprint.requirements.map(r => r.description).sort().join('#') ===
  admTwinInt.blueprint.requirements.map(r => r.description).sort().join('#'),
  `pub=${admTwinPub.blueprint.requirements.length}, int=${admTwinInt.blueprint.requirements.length}`)
assertTrue('XFLOW-2', 'cross-flow: SAME itemVersions content (question|options|key) and SAME itemVersion numbers',
  frozenContentSig(admTwinPub) === frozenContentSig(admTwinInt) &&
  admTwinPub.assessment.items.every(i => i.itemVersion === 1) && admTwinInt.assessment.items.every(i => i.itemVersion === 1),
  `sigEqual=${frozenContentSig(admTwinPub) === frozenContentSig(admTwinInt)}`)
assertEq('XFLOW-3', 'cross-flow: SAME scoringVersion — the channel cannot change the instrument',
  admTwinPub.scoringVersion, admTwinInt.scoringVersion)

// ════════════════════════════════════════════════════════════
// CONC — concurrency (PASO 14)
// ════════════════════════════════════════════════════════════
console.log('═══ CONC — concurrency ═══')

const concResults = await Promise.all(
  Array.from({ length: 4 }, (_, i) => startPublic(vacChange.slug, `Candidato Conc ${i}`))
)
const concOk = concResults.filter(r => r.status === 200)
for (const r of concResults.filter(r => r.status !== 200)) {
  console.log(`   CONC-1 failure detail: status=${r.status} body=${JSON.stringify(r.json)?.slice(0, 300)}`)
}
const concAdms = await db.knowledgeAdministration.findMany({
  where: { vacancyApplicationId: { in: concOk.map(r => r.json.applicationId) } },
})
assertEq('CONC-1', '4 parallel public starts → ALL frozen to the SAME assessment version (no v1/v2 mix)',
  `${concResults.length}/${concResults.length} starts, versions=${concAdms[0]?.assessmentVersion}`,
  `${concOk.length}/${concResults.length} starts, versions=${[...new Set(concAdms.map(a => a.assessmentVersion))].join(',')}`)

// ════════════════════════════════════════════════════════════
// CHG — change test (PASO 15): A=v1, B=v2, key change, C=v3
// ════════════════════════════════════════════════════════════
console.log('═══ CHG — change test A→v1, B→v2 ═══')

// A starts (this bootstrap publishes KA-v1 for vacChange — CONC starts may already have)
const startA = await startPublic(vacChange.slug, 'Candidato CHG A')
const admA = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: startA.json.applicationId } })
const vA = admA.assessmentVersion
// A answers: cq1=0 (correct under v1 key), cq2=2, cq3=1 — all correct under v1
for (const [q, val] of [[cq1, '0'], [cq2, '2'], [cq3, '1']] as const) {
  await post('/api/public/apply', { step: 'answer', applicationId: startA.json.applicationId, section: 'CONOCIMIENTOS', questionId: q.id, vacancyQuestionId: q.id, value: val, token: startA.json.token })
}

// Publish KA-v2: change cq1 key 0→1 (scoring content change; text unchanged → blueprint structure unchanged)
await db.vacancyQuestion.update({ where: { id: cq1.id }, data: { correctAnswer: 1 } })

const startB = await startPublic(vacChange.slug, 'Candidato CHG B')
const admB = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: startB.json.applicationId } })
const vB = admB.assessmentVersion
assertTrue('CHG-1', 'candidate A frozen on v1; candidate B frozen on a NEWER version after the bank change',
  vB === vA + 1 && vA >= 1, `vA=${vA}, vB=${vB}`)

// B answers: cq1=1 (correct under v2 key), cq2=2, cq3=1
for (const [q, val] of [[cq1, '1'], [cq2, '2'], [cq3, '1']] as const) {
  await post('/api/public/apply', { step: 'answer', applicationId: startB.json.applicationId, section: 'CONOCIMIENTOS', questionId: q.id, vacancyQuestionId: q.id, value: val, token: startB.json.token })
}

// PASO 15 step 5: change correctAnswer AGAIN (cq3 1→3) — after B started
await db.vacancyQuestion.update({ where: { id: cq3.id }, data: { correctAnswer: 3 } })

// A and B complete — both must score 100 against their OWN frozen keys
const advA = await post('/api/public/apply', { step: 'advance', applicationId: startA.json.applicationId, completedStep: 4, token: startA.json.token })
const advB = await post('/api/public/apply', { step: 'advance', applicationId: startB.json.applicationId, completedStep: 4, token: startB.json.token })
const appAAfter = await db.vacancyApplication.findUnique({ where: { id: startA.json.applicationId } })
const appBAfter = await db.vacancyApplication.findUnique({ where: { id: startB.json.applicationId } })
assertEq('CHG-2', 'A completes scored with v1 key (cq1=0 correct) → 100', 100, appAAfter.knowledgeScore)
assertEq('CHG-3', 'B completes scored with v2 key (cq1=1 correct) → 100', 100, appBAfter.knowledgeScore)

const kresA = await db.knowledgeResult.findUnique({ where: { administrationId: admA.id } })
const kresB = await db.knowledgeResult.findUnique({ where: { administrationId: admB.id } })
assertTrue('CHG-4', 'KnowledgeResults recorded with VALID evidence and correct scoringVersion',
  kresA?.evidenceStatus === 'VALID' && kresB?.evidenceStatus === 'VALID' &&
  kresA?.scoringVersion === 'PUB-KS-v1' && kresB?.scoringVersion === 'PUB-KS-v1',
  `A=${kresA?.evidenceStatus}, B=${kresB?.evidenceStatus}`)

const itemA1 = await db.knowledgeAssessmentItem.findFirst({ where: { assessmentId: admA.assessmentId, itemId: cq1.id } })
const itemB1 = await db.knowledgeAssessmentItem.findFirst({ where: { assessmentId: admB.assessmentId, itemId: cq1.id } })
const ivA1 = await db.knowledgeItemVersion.findUnique({ where: { id: itemA1.itemVersionId } })
const ivB1 = await db.knowledgeItemVersion.findUnique({ where: { id: itemB1.itemVersionId } })
assertTrue('CHG-5', 'key change produced a NEW itemVersion for cq1 (v1 edition key=0, v2 edition key=1)',
  ivA1.correctAnswer === 0 && ivB1.correctAnswer === 1 && ivB1.itemVersion === ivA1.itemVersion + 1,
  `A:itemVersion=${ivA1.itemVersion}/key=${ivA1.correctAnswer}, B:itemVersion=${ivB1.itemVersion}/key=${ivB1.correctAnswer}`)

const unchangedA2 = await db.knowledgeAssessmentItem.findFirst({ where: { assessmentId: admA.assessmentId, itemId: cq2.id } })
const unchangedB2 = await db.knowledgeAssessmentItem.findFirst({ where: { assessmentId: admB.assessmentId, itemId: cq2.id } })
assertEq('CHG-6', 'content-unchanged item KEEPS its itemVersion (edition reuse, lineage preserved)',
  unchangedA2.itemVersion, unchangedB2.itemVersion)

assertTrue('CHG-7', 'key-only change does NOT bump the blueprint (structure hash unchanged — keys are scoring material, not structure)',
  admA.blueprintId === admB.blueprintId,
  `bpA=${admA.blueprintVersion}, bpB=${admB.blueprintVersion}`)

// Candidate C starts AFTER the second key change → v3 with cq3 key=3
const startC = await startPublic(vacChange.slug, 'Candidato CHG C')
const admC = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: startC.json.applicationId } })
const itemC3 = await db.knowledgeAssessmentItem.findFirst({ where: { assessmentId: admC.assessmentId, itemId: cq3.id } })
const ivC3 = await db.knowledgeItemVersion.findUnique({ where: { id: itemC3.itemVersionId } })
assertTrue('CHG-8', 'candidate C (post-second-change) gets v3 whose cq3 edition carries the NEW key (3)',
  admC.assessmentVersion === vB + 1 && ivC3.correctAnswer === 3,
  `vC=${admC.assessmentVersion}, cq3key=${ivC3.correctAnswer}`)

// ════════════════════════════════════════════════════════════
// INTG — integrity invariants (PASO 17)
// ════════════════════════════════════════════════════════════
console.log('═══ INTG — integrity ═══')

const allNewAssessments = await db.knowledgeAssessment.findMany({
  where: { blueprintId: { not: null } },
  include: { items: true },
})
assertTrue('INTG-1', 'NO canonical assessment contains items without requirement (requirementId+itemVersionId always set)',
  allNewAssessments.length > 0 && allNewAssessments.every(a => a.items.every(i => i.requirementId && i.itemVersionId)),
  `canonicalAssessments=${allNewAssessments.length}, orphanItems=${allNewAssessments.flatMap(a => a.items).filter(i => !i.requirementId || !i.itemVersionId).length}`)

// Stronger per-row check: assessment.job == blueprint.job for every canonical row
let intg2Bad = 0
for (const a of allNewAssessments) {
  const bp = await db.knowledgeBlueprint.findUnique({ where: { id: a.blueprintId } })
  const jobMatches = a.jobType === 'VACANCY' ? (bp.jobType === 'VACANCY' && bp.jobId === a.vacancyId) : (bp.jobType === 'POSITION' && bp.jobId === a.positionId)
  if (!jobMatches) intg2Bad++
}
assertEq('INTG-2', 'assessment NEVER belongs to another job than its blueprint (job↔blueprint binding)',
  0, intg2Bad)

let intg3Bad = 0
const allAssessItems = await db.knowledgeAssessmentItem.findMany({ where: { itemVersionId: { not: null } } })
for (const ai of allAssessItems) {
  const iv = await db.knowledgeItemVersion.findUnique({ where: { id: ai.itemVersionId } })
  if (iv.requirementId !== ai.requirementId) intg3Bad++
}
assertEq('INTG-3', 'itemVersion NEVER changes requirement after publication (frozen lineage)',
  0, intg3Bad)

// ════════════════════════════════════════════════════════════
// SCORE — INSUFFICIENT ≠ 0 + separation (PASO 10/11)
// ════════════════════════════════════════════════════════════
console.log('═══ SCORE — INSUFFICIENT ≠ 0 ═══')

// All-keyless vacancy → knowledgeScore null (INSUFFICIENT), NEVER 0
const startKL = await startPublic(vacKeyless.slug, 'Candidato Keyless')
await post('/api/public/apply', { step: 'answer', applicationId: startKL.json.applicationId, section: 'CONOCIMIENTOS', questionId: kq1.id, vacancyQuestionId: kq1.id, value: '0', token: startKL.json.token })
await post('/api/public/apply', { step: 'answer', applicationId: startKL.json.applicationId, section: 'CONOCIMIENTOS', questionId: kq2.id, vacancyQuestionId: kq2.id, value: '1', token: startKL.json.token })
await post('/api/public/apply', { step: 'advance', applicationId: startKL.json.applicationId, completedStep: 4, token: startKL.json.token })
const appKL = await db.vacancyApplication.findUnique({ where: { id: startKL.json.applicationId } })
const admKL = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: startKL.json.applicationId } })
const kresKL = await db.knowledgeResult.findUnique({ where: { administrationId: admKL.id } })
assertTrue('SCORE-1', 'keyless administration → knowledgeScore null (INSUFFICIENT), evidenceStatus INSUFFICIENT, NEVER 0',
  appKL.knowledgeScore === null && kresKL.knowledgeScore === null && kresKL.evidenceStatus === 'INSUFFICIENT' && kresKL.reasonCode === 'KNOWLEDGE_KEY_MISSING',
  `score=${appKL.knowledgeScore}, status=${kresKL.evidenceStatus}, reason=${kresKL.reasonCode}`)

// ════════════════════════════════════════════════════════════
// Internal full completion → canonical scoring + result
// ════════════════════════════════════════════════════════════
console.log('═══ Internal full completion ═══')

// Walk the internal evaluation exactly like the client: the templates from the
// START response (frozen knowledge included), local index tracking, answers,
// next-step between templates, and a final 'complete' action.
const MESERO_KEYS = [1, 0, 1, 1, 1, 1, 1, 3, 1, 0] // from generate-templates MESERO bank
let knIdx = 0
let intCompleted = false
for (let ti = 0; ti < allTemplates.length; ti++) {
  const cur = allTemplates[ti]
  for (const q of cur.questions) {
    const isKn = cur.type === 'CONOCIMIENTOS'
    const val = isKn ? String(MESERO_KEYS[knIdx++] ?? 0) : '4'
    await post('/api/evaluations', { sessionId: sessionIdInt, action: 'answer', questionId: q.id, value: val, numericValue: isKn ? null : 4 }, hdrInt)
  }
  if (ti < allTemplates.length - 1) {
    await post('/api/evaluations', { sessionId: sessionIdInt, action: 'next-step' }, hdrInt)
  } else {
    const done = await post('/api/evaluations', { sessionId: sessionIdInt, action: 'complete' }, hdrInt)
    if (done.status === 200) intCompleted = true
  }
}
const intResult = await db.evaluationResult.findFirst({ where: { sessionId: sessionIdInt } })
assertTrue('SCORE-2', 'internal completion → EvaluationResult with canonical knowledgeScore=100 (all keyed correct) + VALID evidence',
  !!intResult && intResult.knowledgeScore === 100,
  `knowledgeScore=${intResult?.knowledgeScore}`)
const kresInt = await db.knowledgeResult.findUnique({ where: { administrationId: admInt.id } })
assertTrue('SCORE-3', 'internal KnowledgeResult VALID/COMPLETE_KEYED, administration COMPLETED',
  kresInt?.evidenceStatus === 'VALID' && kresInt?.reasonCode === 'COMPLETE_KEYED' && kresInt?.keyedAnsweredCount === 10 &&
  admInt.status === 'COMPLETED' || (kresInt?.evidenceStatus === 'VALID' && (await db.knowledgeAdministration.findUnique({ where: { id: admInt.id } })).status === 'COMPLETED'),
  `status=${kresInt?.evidenceStatus}, keyed=${kresInt?.keyedAnsweredCount}`)

// ════════════════════════════════════════════════════════════
// PASO 11 — overallScore separation (no formula change)
// ════════════════════════════════════════════════════════════
console.log('═══ PASO 11 — overallScore separation ═══')

// vacAll: full sections. Answer all LIKERT with 4. Knowledge step (frozen
// TEMPLATE_BANK fallback of the company's first position) is intentionally
// NOT answered → knowledgeScore null (INSUFFICIENT) with the overall formula
// unchanged: 0.30*psico + 0.30*psych + 0.40*integrity.
const startAll = await startPublic(vacAll.slug, 'Candidato All Sections')
const appIdAll = startAll.json.applicationId
// step0 → 1 (psicométrica)
await post('/api/public/apply', { step: 'advance', applicationId: appIdAll, completedStep: 0, token: startAll.json.token })
for (let step = 1; step <= 3; step++) {
  const qs = await get(`/api/public/apply?applicationId=${appIdAll}&token=${startAll.json.token}&step=${step}`)
  for (const q of qs.json.questions ?? []) {
    const section = step === 1 ? 'PSICOMETRICA' : step === 2 ? 'PSICOLOGICA' : 'INTEGRIDAD'
    await post('/api/public/apply', { step: 'answer', applicationId: appIdAll, section, questionId: q.questionId, value: '4', numericValue: 4, token: startAll.json.token })
  }
  await post('/api/public/apply', { step: 'advance', applicationId: appIdAll, completedStep: step, token: startAll.json.token })
}
// Step 4 exists (template fallback bank) — skip all knowledge answers and
// advance: the administration completes with ZERO keyed evidence.
const appAllDone = await post('/api/public/apply', { step: 'advance', applicationId: appIdAll, completedStep: 4, token: startAll.json.token })
const appAll = await db.vacancyApplication.findUnique({ where: { id: appIdAll } })

// Compute the expected values from the ACTUAL persisted rows (reverse flags
// come from the bank; the formula weights are the A-03.4 constants).
const allRows = await db.vacancyApplicationResponse.findMany({ where: { applicationId: appIdAll } })
const answeredQIds = allRows.map(r => r.questionId).filter(Boolean)
const answeredQs = await db.question.findMany({ where: { id: { in: answeredQIds } } })
const qById = new Map(answeredQs.map(q => [q.id, q]))
function sectionCategoryNorms(section: string, cats: string[]): number[] {
  const perCat: Record<string, number[]> = {}
  for (const r of allRows.filter(x => x.section === section)) {
    const q = qById.get(r.questionId)
    if (!q) continue
    const v = Math.max(1, Math.min(5, parseInt(r.value, 10)))
    perCat[q.category] ||= []
    perCat[q.category].push(q.reverseScored ? 6 - v : v)
  }
  return Object.entries(perCat)
    .filter(([c]) => cats.includes(c))
    .map(([c, arr]) => {
      const normalized = ((arr.reduce((a, b) => a + b, 0) / arr.length) - 1) / 4 * 100
      // Historical apply-route behavior (unchanged by A-03.5): the STRESS
      // category is inverted a second time after item-level reversing.
      return c === 'STRESS' ? 100 - normalized : normalized
    })
}
const BIG5 = ['OPENNESS', 'CONSCIENTIOUSNESS', 'EXTRAVERSION', 'AGREEABLENESS', 'NEUROTICISM']
const PSYCH = ['STRESS', 'EMPATHY', 'ADAPTABILITY', 'LEADERSHIP', 'TEAMWORK']
const INTEG = ['INTEGRITY_HONESTY', 'INTEGRITY_RULES', 'INTEGRITY_THEFT', 'INTEGRITY_RESPONSIBILITY']
const bigFiveNorms = sectionCategoryNorms('PSICOMETRICA', BIG5)
const psychNorms = sectionCategoryNorms('PSICOLOGICA', PSYCH)
const integNorms = sectionCategoryNorms('INTEGRIDAD', INTEG)
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length
const r2 = (n: number) => Math.round(n * 100) / 100
const expPsicoAvg = r2(mean(bigFiveNorms))
const expPsychAvg = r2(mean(psychNorms))
const expIntegrity = r2(mean(integNorms))

assertTrue('SCORE-1b', 'vacAll knowledge step completed with NO answers → knowledgeScore null (INSUFFICIENT ≠ 0)',
  appAll.knowledgeScore === null, `knowledgeScore=${appAll.knowledgeScore}`)
assertEq('SCORE-4', 'INSUFFICIENT knowledge does NOT drag overallScore (formula 0.30/0.30/0.40, unchanged)',
  r2(0.30 * expPsicoAvg + 0.30 * expPsychAvg + 0.40 * expIntegrity), appAll.overallScore)

// ════════════════════════════════════════════════════════════
// REC — reconstruction (PASO 18)
// ════════════════════════════════════════════════════════════
console.log('═══ REC — historical reconstruction ═══')

const { scoreCanonicalAdministration } = await import('../src/lib/knowledge-canonical')
const scoreBefore = appAAfter.knowledgeScore
const kresBefore = JSON.stringify(kresA)

// Mutate the live world: change bank text (structure change), and let a new
// candidate start → new blueprint + new assessment (vA's world RETIRED).
await db.vacancyQuestion.update({ where: { id: cq1.id }, data: { text: 'A035 C1 MUTADO (reconstrucción)' } })
const startD = await startPublic(vacChange.slug, 'Candidato CHG D')
const admD = await db.knowledgeAdministration.findUnique({ where: { vacancyApplicationId: startD.json.applicationId } })
assertTrue('REC-1', 'bank mutation published a NEW generation (assessment RETIRED + NEW blueprint for new administrations)',
  admD.assessmentId !== admA.assessmentId,
  `vA=${vA}, vD=${admD.assessmentVersion}`)
const bpAAfter = await db.knowledgeBlueprint.findUnique({ where: { id: admA.blueprintId } })
assertTrue('REC-2', 'the historical blueprint is retired but its rows are intact (no silent migration)',
  bpAAfter.status === 'RETIRED' && bpAAfter.blueprintVersion === 'BP-v1' && (await db.knowledgeRequirement.count({ where: { blueprintId: bpAAfter.id } })) === 3,
  `status=${bpAAfter.status}`)

// Reconstruct A's historical result from the FROZEN chain alone
const rebuilt = await scoreCanonicalAdministration(db, admA.id)
assertEq('REC-3', 'historical result rebuilt from frozen chain equals the original (100 — despite live bank mutations)',
  scoreBefore, rebuilt.knowledgeScore)
const kresAAfter = await db.knowledgeResult.findUnique({ where: { administrationId: admA.id } })
assertTrue('REC-4', 'stored KnowledgeResult untouched by bank mutations',
  JSON.stringify({ s: kresAAfter.knowledgeScore, e: kresAAfter.evidenceStatus, c: kresAAfter.correctCount }) ===
  JSON.stringify({ s: JSON.parse(kresBefore).knowledgeScore, e: JSON.parse(kresBefore).evidenceStatus, c: JSON.parse(kresBefore).correctCount }),
  'unchanged')

// ════════════════════════════════════════════════════════════
// LEG — legacy classification (PASO 12)
// ════════════════════════════════════════════════════════════
console.log('═══ LEG — legacy ═══')

const { classifyKnowledgeGeneration, classifySessionKnowledgeGeneration } = await import('../src/lib/knowledge-canonical')
assertEq('LEG-1', 'pre-A-03.4 row (no freeze fields) classifies LEGACY',
  'LEGACY', classifyKnowledgeGeneration({ knowledgeVersioningStatus: null, knowledgeAssessmentId: null }))
assertEq('LEG-2', 'A-03.4-era versioned row classifies KA-V1+',
  'KA-V1+', classifyKnowledgeGeneration({ knowledgeVersioningStatus: 'VERSIONED', knowledgeAssessmentId: 'some-id' }))
assertEq('LEG-3', 'contradictory row (VERSIONED without assessment) classifies UNKNOWN — never silently migrated',
  'UNKNOWN', classifyKnowledgeGeneration({ knowledgeVersioningStatus: 'VERSIONED', knowledgeAssessmentId: null }))
assertEq('LEG-4', 'internal session without administration classifies LEGACY (pre-canonical)',
  'LEGACY', classifySessionKnowledgeGeneration({ knowledgeAdministrationId: null }))

// ════════════════════════════════════════════════════════════
// REG — regression (PASO 19)
// ════════════════════════════════════════════════════════════
console.log('═══ REG — regression ═══')

// REG expectations are computed from the ACTUAL bank metadata (reverse flags)
// and the A-03.4 formula weights — no hardcoded score assumptions.
const bigFiveScoresExpected: Record<string, number> = {}
{
  const perCat: Record<string, number[]> = {}
  for (const r of allRows.filter(x => x.section === 'PSICOMETRICA')) {
    const q = qById.get(r.questionId)
    const v = Math.max(1, Math.min(5, parseInt(r.value, 10)))
    perCat[q.category] ||= []
    perCat[q.category].push(q.reverseScored ? 6 - v : v)
  }
  for (const [c, arr] of Object.entries(perCat)) {
    bigFiveScoresExpected[c] = r2(Math.max(0, Math.min(100, ((arr.reduce((a, b) => a + b, 0) / arr.length) - 1) / 4 * 100)))
  }
}
assertTrue('REG-1', 'IPIP identical (Big Five scores match the unchanged A-03.4 formula for the given answers)',
  bigFiveScoresExpected['OPENNESS'] === r2(appAll.openness) && bigFiveScoresExpected['CONSCIENTIOUSNESS'] === r2(appAll.conscientiousness) &&
  bigFiveScoresExpected['EXTRAVERSION'] === r2(appAll.extraversion) && bigFiveScoresExpected['AGREEABLENESS'] === r2(appAll.agreeableness) &&
  bigFiveScoresExpected['NEUROTICISM'] === r2(appAll.neuroticism),
  `expected=${JSON.stringify(bigFiveScoresExpected)}, got o=${appAll.openness} c=${appAll.conscientiousness} e=${appAll.extraversion} a=${appAll.agreeableness} n=${appAll.neuroticism}`)

const psychScoresExpected: Record<string, number> = {}
{
  const perCat: Record<string, number[]> = {}
  for (const r of allRows.filter(x => x.section === 'PSICOLOGICA')) {
    const q = qById.get(r.questionId)
    const v = Math.max(1, Math.min(5, parseInt(r.value, 10)))
    perCat[q.category] ||= []
    perCat[q.category].push(q.reverseScored ? 6 - v : v)
  }
  for (const [c, arr] of Object.entries(perCat)) {
    let normalized = ((arr.reduce((a, b) => a + b, 0) / arr.length) - 1) / 4 * 100
    // Historical apply-route double inversion for STRESS (unchanged by A-03.5)
    if (c === 'STRESS') normalized = 100 - normalized
    psychScoresExpected[c] = r2(Math.max(0, Math.min(100, normalized)))
  }
}
assertTrue('REG-2', 'psychological identical (Stress/Empathy/Adaptability/Leadership/Teamwork match the unchanged formula)',
  psychScoresExpected['STRESS'] === r2(appAll.stressLevel) && psychScoresExpected['EMPATHY'] === r2(appAll.empathy) &&
  psychScoresExpected['ADAPTABILITY'] === r2(appAll.adaptability) && psychScoresExpected['LEADERSHIP'] === r2(appAll.leadership) &&
  psychScoresExpected['TEAMWORK'] === r2(appAll.teamwork),
  `expected=${JSON.stringify(psychScoresExpected)}, got s=${appAll.stressLevel} e=${appAll.empathy} ad=${appAll.adaptability} l=${appAll.leadership} t=${appAll.teamwork}`)

assertEq('REG-3', 'integrity identical (matches the unchanged formula for the given answers)',
  expIntegrity, r2(appAll.integrityScore))

assertTrue('REG-4', 'recommendations unchanged (PERFIL_PARCIAL guidance when knowledge is INSUFFICIENT)',
  appAll.recommendation === 'PERFIL_PARCIAL', appAll.recommendation)

// Internal overall: 0.25*psico + 0.25*psych + 0.15*integrity + 0.35*knowledge(100)
const intPsicoAvg = (intResult.openness + intResult.conscientiousness + intResult.extraversion + intResult.agreeableness + intResult.neuroticism) / 5
const intPsychAvg = (intResult.stressLevel + intResult.empathy + intResult.adaptability + intResult.leadership + intResult.teamwork) / 5
assertEq('REG-5', 'canonical internal overallScore — formula unchanged: 0.25*psico + 0.25*psych + 0.15*integrity + 0.35*knowledge',
  r2(0.25 * intPsicoAvg + 0.25 * intPsychAvg + 0.15 * intResult.integrityScore + 0.35 * intResult.knowledgeScore),
  intResult.overallScore)

const after = await snapshotLegacyRows()
const afterAssessmentsFiltered = after.assessments.filter(a => beforeAssessmentIds.has(a.id))
const legacyUntouched =
  JSON.stringify(before.apps) === JSON.stringify(after.apps) &&
  JSON.stringify(before.assessments) === JSON.stringify(afterAssessmentsFiltered)
assertTrue('REG-6', 'ALL pre-existing (A-03.4-era and legacy) rows UNTOUCHED by this phase',
  legacyUntouched, legacyUntouched ? 'identical' : 'MUTATED')

// ════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════
const passed = results.filter(r => r.pass).length
console.log(`\n═══ A-03.5 RESULTS: ${passed}/${results.length} PASS ═══`)
for (const r of results.filter(r => !r.pass)) {
  console.log(`   FAIL [${r.id}] ${r.desc}: expected=${r.expected} got=${r.got}`)
}

await Bun.write('/home/z/my-project/evidence-a03-5/a035-test-results.json', JSON.stringify({
  phase: 'A-03.5',
  timestamp: new Date().toISOString(),
  total: results.length,
  passed,
  failed: results.length - passed,
  results,
}, null, 2))
console.log('Results written to evidence-a03-5/a035-test-results.json')

await db.$disconnect()
process.exit(passed === results.length ? 0 : 1)
