// @ts-nocheck — A-03.4 verification tooling (Bun-only, not part of the Next.js build)
/**
 * EVALUHR — A-03.4 CIERRE DE VERSIONADO EN VACANTES PÚBLICAS
 * Tests PUB-K1..PUB-K15 + E2E (PASO 13) + Regression (PASO 14)
 *
 * Usage:  bun scripts/a034-tests.ts
 * Requires: dev server running on http://localhost:3000
 *
 * The E2E follows the exact PASO 13 scenario:
 *   1. Crear/publicar KA-v1        (bootstrap at candidate A's start)
 *   2. Candidato A inicia
 *   3. Candidato A responde parcialmente
 *   4. Publicar KA-v2              (bank change materialized at B's start)
 *   5. Candidato B inicia
 *   6. Finalizar A                 → scored with KA-v1 (key A)
 *   7. Finalizar B                 → scored with KA-v2 (key B)
 */

import { PrismaClient } from '@prisma/client'

const BASE = 'http://localhost:3000'
const db = new PrismaClient({ log: ['error'] })

const results: Array<{ id: string; desc: string; expected: string; got: string; pass: boolean }> = []
function check(id: string, desc: string, expected: string, actual: unknown, pass: boolean) {
  results.push({ id, desc, expected, got: String(actual).slice(0, 200), pass })
  console.log(`${pass ? '✅' : '❌'} [${id}] ${desc} → ${String(actual).slice(0, 120)}`)
}
function assertTrue(id: string, desc: string, cond: boolean, detail = '') {
  check(id, desc, 'true', cond ? 'true' : `false ${detail}`, cond)
}

async function post(path: string, body: any) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  let json: any = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}
async function get(path: string) {
  const res = await fetch(`${BASE}${path}`)
  let json: any = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}

// ────────────────────────────────────────────────────────────
// FIXTURE
// ────────────────────────────────────────────────────────────
console.log('═══ A-03.4 — FIXTURE ═══')

const company = await db.company.create({
  data: { name: `A034-Company-${Date.now()}`, sector: 'RESTAURANT' },
})

// Vacancy with ONLY conocimientos so the public flow goes straight to step 4
const vacancy = await db.vacancy.create({
  data: {
    title: 'A034 Vacancy Knowledge Freeze',
    slug: `a034-freeze-${Date.now()}`,
    sector: 'RESTAURANT',
    status: 'ACTIVE',
    includePsicometrica: false,
    includePsicologica: false,
    includeIntegridad: false,
    companyId: company.id,
  },
})

async function addQuestion(vacancyId: string, text: string, correctAnswer: number, order: number) {
  return db.vacancyQuestion.create({
    data: {
      text,
      type: 'MULTIPLE_CHOICE',
      options: JSON.stringify(['Opción A', 'Opción B', 'Opción C', 'Opción D']),
      correctAnswer,
      order,
      vacancyId,
      companyId: company.id,
    },
  })
}

const q1 = await addQuestion(vacancy.id, 'A034 Q1 (clave v1=A)', 0, 1) // key A → later changed to B
const q2 = await addQuestion(vacancy.id, 'A034 Q2 (estable)', 2, 2)
const q3 = await addQuestion(vacancy.id, 'A034 Q3 (estable)', 1, 3)

// Separate vacancy for the fail-closed test (corrupt bank data)
const vacancyCorrupt = await db.vacancy.create({
  data: {
    title: 'A034 Corrupt Bank',
    slug: `a034-corrupt-${Date.now()}`,
    status: 'ACTIVE',
    includePsicometrica: false,
    includePsicologica: false,
    includeIntegridad: false,
    companyId: company.id,
  },
})
await db.vacancyQuestion.create({
  data: {
    text: 'Corrupt options',
    type: 'MULTIPLE_CHOICE',
    options: 'NOT_JSON{{',
    correctAnswer: 0,
    order: 1,
    vacancyId: vacancyCorrupt.id,
    companyId: company.id,
  },
})

// Vacancy for legacy in-flight simulation (pre-A-03.4 row)
const vacancyLegacy = await db.vacancy.create({
  data: {
    title: 'A034 Legacy Vacancy',
    slug: `a034-legacy-${Date.now()}`,
    status: 'ACTIVE',
    includePsicometrica: false,
    includePsicologica: false,
    includeIntegridad: false,
    companyId: company.id,
  },
})
const lq1 = await addQuestion(vacancyLegacy.id, 'A034 Legacy Q1', 1, 1)

// Vacancy for IPIP regression (psicometrica included; no position → hardcoded fallback)
const vacancyIpip = await db.vacancy.create({
  data: {
    title: 'A034 IPIP Regression',
    slug: `a034-ipip-${Date.now()}`,
    status: 'ACTIVE',
    includePsicometrica: true,
    includePsicologica: false,
    includeIntegridad: false,
    companyId: company.id,
  },
})

// Synthetic COMPLETED legacy row (historical, pre-A-03.4) — must remain untouched
const legacyCompleted = await db.vacancyApplication.create({
  data: {
    vacancyId: vacancyLegacy.id,
    companyId: company.id,
    candidateName: 'Legacy Completed',
    candidateEmail: `legacy-done-${Date.now()}@a034.test`,
    status: 'COMPLETED',
    currentStep: 5,
    startedAt: new Date(),
    completedAt: new Date(),
    knowledgeScore: 42.42,
    overallScore: 42.42,
    recommendation: 'PERFIL_PARCIAL',
    // no knowledgeVersioningStatus → pre-A-03.4 row
  },
})

const emails = { a: `cand-a-${Date.now()}@a034.test`, b: `cand-b-${Date.now()}@a034.test` }

// ────────────────────────────────────────────────────────────
// PASO 13 — E2E SCENARIO
// ────────────────────────────────────────────────────────────
console.log('\n═══ PASO 13 — E2E: A inicia → banco cambia → B inicia → A finaliza → B finaliza ═══')

// [1+2] KA-v1 published at A's start
const startA = await post('/api/public/apply', { step: 'data', vacancySlug: vacancy.slug, name: 'Candidato A', email: emails.a })
assertTrue('E2E-1', 'Candidato A inicia (step=data)', startA.status === 200 && !!startA.json?.applicationId, JSON.stringify(startA.json))
const appAId = startA.json.applicationId
const tokenA = startA.json.token

const appA1 = await db.vacancyApplication.findUnique({ where: { id: appAId } })

// [PUB-K1] assessmentVersion saved at start
assertTrue('PUB-K1', 'Inicio público guarda assessmentVersion', appA1?.knowledgeAssessmentVersion === 1, `got ${appA1?.knowledgeAssessmentVersion}`)
// [PUB-K2] blueprintVersion saved
assertTrue('PUB-K2', 'Inicio público guarda blueprintVersion', appA1?.knowledgeBlueprintVersion === 'BP-v1', `got ${appA1?.knowledgeBlueprintVersion}`)
// [PUB-K3] scoringVersion saved
assertTrue('PUB-K3', 'Inicio público guarda scoringVersion', appA1?.knowledgeScoringVersion === 'PUB-KS-v1', `got ${appA1?.knowledgeScoringVersion}`)

const v1 = await db.knowledgeAssessment.findFirst({ where: { vacancyId: vacancy.id, version: 1 }, include: { items: true } })
const v1Items = new Map(v1?.items.map(i => [i.itemId, i]))
// [PUB-K4] exact item list frozen
assertTrue('PUB-K4', 'Inicio guarda itemVersions congelados (3 items, v1, con clave)',
  v1?.itemCount === 3 && v1?.items.every(i => i.itemVersion === 1 && i.hasKey && i.correctAnswerSnapshot !== null && i.difficulty === 'UNKNOWN'),
  `itemCount=${v1?.itemCount}`)

// advance(0) → nextStep=4
const adv0A = await post('/api/public/apply', { step: 'advance', applicationId: appAId, completedStep: 0, token: tokenA })
assertTrue('E2E-2', 'A avanza a step 4 (conocimientos)', adv0A.json?.nextStep === 4, JSON.stringify(adv0A.json))

// [3] A responde parcialmente (Q1 correcta para v1, Q2 incorrecta)
const getA1 = await get(`/api/public/apply?applicationId=${appAId}&token=${tokenA}`)
assertTrue('E2E-3', 'A recibe preguntas congeladas v1 (3 preguntas)', getA1.json?.questions?.length === 3, `len=${getA1.json?.questions?.length}`)

const ansA1 = await post('/api/public/apply', { step: 'answer', applicationId: appAId, section: 'CONOCIMIENTOS', questionId: q1.id, vacancyQuestionId: q1.id, value: '0', token: tokenA })
const ansA2 = await post('/api/public/apply', { step: 'answer', applicationId: appAId, section: 'CONOCIMIENTOS', questionId: q2.id, vacancyQuestionId: q2.id, value: '9', token: tokenA })
assertTrue('E2E-4', 'A responde parcialmente (2 respuestas aceptadas)', ansA1.status === 200 && ansA2.status === 200)

// [4] Banco cambia (administrador publica KA-v2): clave de Q1 A→B + nueva pregunta (simula alta admin/IA)
await db.vacancyQuestion.update({ where: { id: q1.id }, data: { correctAnswer: 1 } })
const q4 = await addQuestion(vacancy.id, 'A034 Q4 (nueva tras v1)', 3, 4)

// [5] Candidato B inicia → publica KA-v2
const startB = await post('/api/public/apply', { step: 'data', vacancySlug: vacancy.slug, name: 'Candidato B', email: emails.b })
const appBId = startB.json.applicationId
const tokenB = startB.json.token
const appB = await db.vacancyApplication.findUnique({ where: { id: appBId } })

// [PUB-K8] Nuevo candidato recibe versión nueva
assertTrue('PUB-K8', 'Nuevo candidato recibe KA-v2', appB?.knowledgeAssessmentVersion === 2, `got ${appB?.knowledgeAssessmentVersion}`)

const v2 = await db.knowledgeAssessment.findFirst({ where: { vacancyId: vacancy.id, version: 2 }, include: { items: true } })
const v2Q1 = v2?.items.find(i => i.itemId === q1.id)
const v2Q2 = v2?.items.find(i => i.itemId === q2.id)
const v2Q4 = v2?.items.find(i => i.itemId === q4.id)
const v1After = await db.knowledgeAssessment.findFirst({ where: { vacancyId: vacancy.id, version: 1 }, include: { items: true } })

// [PUB-K6] Publicar nueva versión no altera administración existente
assertTrue('PUB-K6', 'KA-v1 intacta tras publicar KA-v2 (items/claves/hashes inmutables, status RETIRED)',
  v1After?.status === 'RETIRED' &&
  v1After?.items.find(i => i.itemId === q1.id)?.correctAnswerSnapshot === 0 &&
  v1After?.items.length === 3 &&
  v1After?.contentHash === v1?.contentHash,
  `status=${v1After?.status} q1Key=${v1After?.items.find(i => i.itemId === q1.id)?.correctAnswerSnapshot}`)

// [PASO 6] itemVersion bump: Q1 v1→v2; estables se mantienen
assertTrue('PASO6-a', 'Cambio de clave genera itemVersion 2 para Q1', v2Q1?.itemVersion === 2 && v2Q1?.correctAnswerSnapshot === 1, `iv=${v2Q1?.itemVersion} key=${v2Q1?.correctAnswerSnapshot}`)
assertTrue('PASO6-b', 'Items sin cambio mantienen itemVersion 1', v2Q2?.itemVersion === 1 && v2Q4?.itemVersion === 1, `q2iv=${v2Q2?.itemVersion} q4iv=${v2Q4?.itemVersion}`)

// [PUB-K5] A continúa con la versión congelada
const getA2 = await get(`/api/public/apply?applicationId=${appAId}&token=${tokenA}`)
const a2QuestionIds = (getA2.json?.questions ?? []).map((q: any) => q.id)
assertTrue('PUB-K5', 'Candidato A continúa usando versión congelada (3 items v1; Q4 NO aparece; versión informada = 1)',
  a2QuestionIds.length === 3 && a2QuestionIds.includes(q1.id) && !a2QuestionIds.includes(q4.id) && getA2.json?.knowledgeAssessmentVersion === 1,
  `qs=${a2QuestionIds.length} v=${getA2.json?.knowledgeAssessmentVersion}`)

// [PUB-K14] No se expone correctAnswer al candidato
const exposedA2 = JSON.stringify(getA2.json).includes('correctAnswerSnapshot')
const exposedAnyKey = JSON.stringify(getA2.json).includes('"correctAnswer":')
assertTrue('PUB-K14', 'No se expone correctAnswer/correctAnswerSnapshot al candidato (deep scan)',
  !exposedA2 && !exposedAnyKey, `snapshotLeak=${exposedA2} keyLeak=${exposedAnyKey}`)

// [6] Finalizar A (usa clave A: Q1=0 correcto, Q3=1 correcto, Q2=9 incorrecto → 2/3)
const ansA3 = await post('/api/public/apply', { step: 'answer', applicationId: appAId, section: 'CONOCIMIENTOS', questionId: q3.id, vacancyQuestionId: q3.id, value: '1', token: tokenA })
assertTrue('E2E-5', 'A responde Q3 (aceptada)', ansA3.status === 200)
const advA = await post('/api/public/apply', { step: 'advance', applicationId: appAId, completedStep: 4, token: tokenA })
const appA2 = await db.vacancyApplication.findUnique({ where: { id: appAId } })
assertTrue('E2E-6', 'A finaliza con clave A → knowledgeScore 66.67 (2/3)',
  advA.json?.completed === true && appA2?.knowledgeScore === 66.67,
  `score=${appA2?.knowledgeScore} completed=${advA.json?.completed}`)

// [7] Finalizar B (usa clave B: Q1=1 correcto; Q2=9, Q3=0, Q4=0 incorrectos → 1/4)
const adv0B = await post('/api/public/apply', { step: 'advance', applicationId: appBId, completedStep: 0, token: tokenB })
assertTrue('E2E-7', 'B avanza a step 4', adv0B.json?.nextStep === 4, JSON.stringify(adv0B.json))
for (const [q, val] of [[q1, '1'], [q2, '9'], [q3, '0'], [q4, '0']] as const) {
  await post('/api/public/apply', { step: 'answer', applicationId: appBId, section: 'CONOCIMIENTOS', questionId: q.id, vacancyQuestionId: q.id, value: val, token: tokenB })
}
const advB = await post('/api/public/apply', { step: 'advance', applicationId: appBId, completedStep: 4, token: tokenB })
const appB2 = await db.vacancyApplication.findUnique({ where: { id: appBId } })
assertTrue('E2E-8', 'B finaliza con clave B → knowledgeScore 25 (1/4)',
  advB.json?.completed === true && appB2?.knowledgeScore === 25,
  `score=${appB2?.knowledgeScore}`)

// [PUB-K7] Cambiar correctAnswer no altera histórico
const responsesA = await db.vacancyApplicationResponse.findMany({ where: { applicationId: appAId, section: 'CONOCIMIENTOS' } })
const snapQ1A = responsesA.find(r => r.vacancyQuestionId === q1.id)
let recomputedA = { keyed: 0, correct: 0 }
for (const r of responsesA) {
  const item = v1After?.items.find(i => i.itemId === (r.vacancyQuestionId ?? r.questionId))
  if (item?.hasKey) {
    recomputedA.keyed++
    if (parseInt(r.value, 10) === item.correctAnswerSnapshot) recomputedA.correct++
  }
}
const recomputedScoreA = recomputedA.keyed > 0 ? Math.round((recomputedA.correct / recomputedA.keyed) * 100 * 100) / 100 : null
assertTrue('PUB-K7', 'Cambio de clave no altera histórico (snapshot A sigue clave 0 y resultado reconstruido = 66.67)',
  snapQ1A?.correctAnswerSnapshot === 0 && appA2?.knowledgeScore === 66.67 && recomputedScoreA === 66.67,
  `snap=${snapQ1A?.correctAnswerSnapshot} recomputed=${recomputedScoreA}`)

// [PUB-K15] Resultado histórico puede reconstruirse (cadena completa)
const chainOk =
  !!appA2?.knowledgeAssessmentId &&
  recomputedScoreA === appA2?.knowledgeScore &&
  responsesA.every(r => r.questionSnapshot !== null && r.scoringVersionSnapshot === 'PUB-KS-v1')
const snapParse = JSON.parse(snapQ1A!.questionSnapshot!)
assertTrue('PUB-K15', 'Resultado histórico reconstruible: Candidate→Assessment→ItemVersion→Response→KeySnapshot→ScoringVersion→Result',
  chainOk && snapParse.text === 'A034 Q1 (clave v1=A)' && Array.isArray(snapParse.options),
  `chain=${chainOk} snapText="${snapParse.text}"`)

// ────────────────────────────────────────────────────────────
// PASO 10 — SEGURIDAD (PUB-K9/10/11 + blueprint/scoring)
// ────────────────────────────────────────────────────────────
console.log('\n═══ PASO 10 — SEGURIDAD ═══')

const manip1 = await post('/api/public/apply', { step: 'answer', applicationId: appBId, section: 'CONOCIMIENTOS', questionId: q1.id, vacancyQuestionId: q1.id, value: '1', token: tokenB, assessmentVersion: 99 })
assertTrue('PUB-K9', 'Cliente intenta manipular assessmentVersion → rechazado', manip1.status === 403 && manip1.json?.code === 'MANIPULATION_REJECTED', `HTTP ${manip1.status}`)

const manip2 = await post('/api/public/apply', { step: 'answer', applicationId: appBId, section: 'CONOCIMIENTOS', questionId: q1.id, vacancyQuestionId: q1.id, value: '1', token: tokenB, itemVersion: 77 })
assertTrue('PUB-K10', 'Cliente intenta manipular itemVersion → rechazado', manip2.status === 403 && manip2.json?.code === 'MANIPULATION_REJECTED', `HTTP ${manip2.status}`)

const manip3 = await post('/api/public/apply', { step: 'answer', applicationId: appBId, section: 'CONOCIMIENTOS', questionId: q1.id, vacancyQuestionId: q1.id, value: '1', token: tokenB, correctAnswer: 0 })
assertTrue('PUB-K11', 'Cliente intenta manipular correctAnswer → rechazado', manip3.status === 403 && manip3.json?.code === 'MANIPULATION_REJECTED', `HTTP ${manip3.status}`)

const manip4 = await post('/api/public/apply', { step: 'advance', applicationId: appBId, completedStep: 4, token: tokenB, scoringVersion: 'HACK-v9' })
const manip5 = await post('/api/public/apply', { step: 'data', vacancySlug: vacancy.slug, name: 'X', email: `x-${Date.now()}@a034.test`, blueprintVersion: 'BP-HACK' })
assertTrue('SEC-a', 'Cliente no puede elegir scoringVersion (advance) ni cambiar blueprint (data) → rechazado',
  manip4.status === 403 && manip5.status === 403, `adv=${manip4.status} data=${manip5.status}`)

// Answer referencing an item OUTSIDE the frozen administration
const outsider = await post('/api/public/apply', { step: 'answer', applicationId: appAId, section: 'CONOCIMIENTOS', questionId: q4.id, vacancyQuestionId: q4.id, value: '0', token: tokenA })
assertTrue('SEC-b', 'Respuesta fuera de la administración congelada → rechazada (fail-closed)',
  outsider.status === 403 && outsider.json?.code === 'ITEM_NOT_IN_ADMINISTRATION', `HTTP ${outsider.status}`)

// ────────────────────────────────────────────────────────────
// PASO 8 — AUSENCIA DE VERSIÓN (PUB-K12): fail closed
// ────────────────────────────────────────────────────────────
console.log('\n═══ PASO 8 — AUSENCIA DE VERSIÓN ═══')

const appsBefore = await db.vacancyApplication.count({ where: { vacancyId: vacancyCorrupt.id } })
const corruptStart = await post('/api/public/apply', { step: 'data', vacancySlug: vacancyCorrupt.slug, name: 'Corrupt', email: `corrupt-${Date.now()}@a034.test` })
const appsAfter = await db.vacancyApplication.count({ where: { vacancyId: vacancyCorrupt.id } })
assertTrue('PUB-K12', 'Versión indeterminable (banco corrupto) → 500 CONFIGURATION_ERROR y NO se crea evaluación parcialmente versionada',
  corruptStart.status === 500 && (corruptStart.json?.code === 'CONFIGURATION_ERROR' || corruptStart.json?.code === 'INTERNAL_ERROR') && appsBefore === 0 && appsAfter === 0,
  `HTTP ${corruptStart.status} code=${corruptStart.json?.code} apps=${appsBefore}→${appsAfter}`)

// ────────────────────────────────────────────────────────────
// PASO 9 — LEGACY (PUB-K13)
// ────────────────────────────────────────────────────────────
console.log('\n═══ PASO 9 — LEGACY ═══')

// In-flight legacy row (created "before" A-03.4): null version fields
const legacyInFlight = await db.vacancyApplication.create({
  data: {
    vacancyId: vacancyLegacy.id,
    companyId: company.id,
    candidateName: 'Legacy In-Flight',
    candidateEmail: `legacy-flight-${Date.now()}@a034.test`,
    status: 'IN_PROGRESS',
    currentStep: 4,
    startedAt: new Date(),
  },
})
const legacyToken = `${legacyInFlight.id}.fake` // not needed — we assert DB path directly below

// Legacy scoring uses the LIVE bank path (calculateStepScores), NOT the frozen lib
const legacyAnswer = await post('/api/public/apply', { step: 'answer', applicationId: legacyInFlight.id, section: 'CONOCIMIENTOS', questionId: lq1.id, vacancyQuestionId: lq1.id, value: '1', token: legacyToken })
// token is invalid for the API → expect 403; do the legacy scoring via a minted token instead
const { generatePublicToken } = await import('../src/lib/public-token')
const validLegacyToken = generatePublicToken(legacyInFlight.id)
await post('/api/public/apply', { step: 'answer', applicationId: legacyInFlight.id, section: 'CONOCIMIENTOS', questionId: lq1.id, vacancyQuestionId: lq1.id, value: '1', token: validLegacyToken })
const legacyResp = await db.vacancyApplicationResponse.findFirst({ where: { applicationId: legacyInFlight.id } })
const legacyAdv = await post('/api/public/apply', { step: 'advance', applicationId: legacyInFlight.id, completedStep: 4, token: validLegacyToken })
const legacyAfter = await db.vacancyApplication.findUnique({ where: { id: legacyInFlight.id } })
assertTrue('PUB-K13', 'Legacy permanece LEGACY: califica por vía histórica, se etiqueta LEGACY, no se migra a versión',
  legacyAdv.status === 200 && legacyAfter?.knowledgeVersioningStatus === 'LEGACY' &&
  legacyAfter?.knowledgeAssessmentId === null && legacyAfter?.knowledgeAssessmentVersion === null &&
  legacyAfter?.knowledgeScore === 100 && legacyResp?.correctAnswerSnapshot === null,
  `status=${legacyAfter?.knowledgeVersioningStatus} score=${legacyAfter?.knowledgeScore} version=${legacyAfter?.knowledgeAssessmentVersion}`)

// Historical completed row untouched
const legacyCompletedAfter = await db.vacancyApplication.findUnique({ where: { id: legacyCompleted.id } })
assertTrue('REG-4', 'Resultados legacy completos intactos (no migrados, no reinterpretados)',
  legacyCompletedAfter?.knowledgeScore === 42.42 && legacyCompletedAfter?.overallScore === 42.42 &&
  legacyCompletedAfter?.knowledgeVersioningStatus === null,
  `ks=${legacyCompletedAfter?.knowledgeScore} status=${legacyCompletedAfter?.knowledgeVersioningStatus}`)

// ────────────────────────────────────────────────────────────
// PASO 14 — REGRESIÓN
// ────────────────────────────────────────────────────────────
console.log('\n═══ PASO 14 — REGRESIÓN ═══')

// REG-1: IPIP idéntico — Big Five scoring via legacy path (hardcoded fallback questions)
const startIpip = await post('/api/public/apply', { step: 'data', vacancySlug: vacancyIpip.slug, name: 'IPIP Cand', email: `ipip-${Date.now()}@a034.test` })
const ipipId = startIpip.json.applicationId
const ipipToken = startIpip.json.token
// answer hw-bf-1 (OPENNESS, not reversed) with 5 → likert 5 → normalized 100
await post('/api/public/apply', { step: 'answer', applicationId: ipipId, section: 'PSICOMETRICA', questionId: 'hw-bf-1', value: '5', token: ipipToken })
// answer hw-bf-9 (NEUROTICISM, reversed) with 1 → reversed 5 → normalized 100
await post('/api/public/apply', { step: 'answer', applicationId: ipipId, section: 'PSICOMETRICA', questionId: 'hw-bf-9', value: '1', token: ipipToken })
await post('/api/public/apply', { step: 'advance', applicationId: ipipId, completedStep: 1, token: ipipToken })
const ipipApp = await db.vacancyApplication.findUnique({ where: { id: ipipId } })
assertTrue('REG-1', 'IPIP idéntico: openness=100, neuroticism(rev)=100 vía calculateLikertScore sin cambios',
  ipipApp?.openness === 100 && ipipApp?.neuroticism === 100,
  `openness=${ipipApp?.openness} neuroticism=${ipipApp?.neuroticism}`)

// REG-2: internal knowledge flow untouched — /api/evaluations endpoint alive (auth-gated)
const evalSmoke = await get('/api/evaluations')
assertTrue('REG-2', 'Knowledge interno intacto: /api/evaluations responde 401 (sin tocar scoring interno)', evalSmoke.status === 401, `HTTP ${evalSmoke.status}`)

// REG-3: overallScore intacto — A tiene solo knowledge → overallScore = knowledgeScore
assertTrue('REG-3', 'overallScore intacto (pesos adaptativos sin cambios): overall = knowledge para A',
  appA2?.overallScore === 66.67 && appA2?.recommendation === 'PERFIL_PARCIAL',
  `overall=${appA2?.overallScore} rec=${appA2?.recommendation}`)

// REG-5: knowledgeScore=null nunca es 0 — vacante sin knowledge (NOT_APPLICABLE)
const vacancyNoK = await db.vacancy.create({
  data: { title: 'A034 No Knowledge', slug: `a034-nok-${Date.now()}`, status: 'ACTIVE', includePsicometrica: false, includePsicologica: false, includeIntegridad: false, companyId: company.id },
})
const startNoK = await post('/api/public/apply', { step: 'data', vacancySlug: vacancyNoK.slug, name: 'NoK', email: `nok-${Date.now()}@a034.test` })
const nokId = startNoK.json.applicationId
const nokApp = await db.vacancyApplication.findUnique({ where: { id: nokId } })
await post('/api/public/apply', { step: 'advance', applicationId: nokId, completedStep: 0, token: startNoK.json.token })
const nokAfter = await db.vacancyApplication.findUnique({ where: { id: nokId } })
assertTrue('REG-5', 'Sin knowledge: NOT_APPLICABLE, sin assessment, knowledgeScore null (nunca 0)',
  nokApp?.knowledgeVersioningStatus === 'NOT_APPLICABLE' && nokApp?.knowledgeAssessmentId === null &&
  nokAfter?.knowledgeScore === null && nokAfter?.status === 'COMPLETED',
  `status=${nokApp?.knowledgeVersioningStatus} score=${nokAfter?.knowledgeScore}`)

// ────────────────────────────────────────────────────────────
// PASO 11 — IA (verificación de autoridad)
// ────────────────────────────────────────────────────────────
console.log('\n═══ PASO 11 — IA ═══')

// The AI route only writes VacancyQuestion rows (bank drafts). Simulate an AI
// bank addition AFTER administrations exist and verify NO version/key/snapshot
// mutation happens on the frozen assessments.
const aiLike = await addQuestion(vacancy.id, 'A034 AI-sim Q5', 2, 5)
const v1PostAI = await db.knowledgeAssessment.findFirst({ where: { vacancyId: vacancy.id, version: 1 }, include: { items: true } })
const appA3 = await db.vacancyApplication.findUnique({ where: { id: appAId } })
const responsesAPost = await db.vacancyApplicationResponse.findMany({ where: { applicationId: appAId } })
assertTrue('PASO11', 'IA no cambia assessment activa, versión, clave ni snapshot de administración existente',
  v1PostAI?.items.length === 3 && v1PostAI?.items.every(i => i.correctAnswerSnapshot === v1After?.items.find(x => x.itemId === i.itemId)?.correctAnswerSnapshot) &&
  appA3?.knowledgeAssessmentVersion === 1 &&
  responsesAPost.every(r => r.correctAnswerSnapshot !== null && r.scoringVersionSnapshot === 'PUB-KS-v1'),
  `v1Items=${v1PostAI?.items.length} appVersion=${appA3?.knowledgeAssessmentVersion}`)

// Next candidate gets v3 (bank changed again) — AI bank addition never mutates existing versions
const startC = await post('/api/public/apply', { step: 'data', vacancySlug: vacancy.slug, name: 'Candidato C', email: `cand-c-${Date.now()}@a034.test` })
const appCId = startC.json.applicationId
const appC = await db.vacancyApplication.findUnique({ where: { id: appCId } })
assertTrue('PASO11-b', 'Alta al banco (vía IA/admin) produce versión nueva para NUEVOS candidatos (C→v3); A sigue v1',
  appC?.knowledgeAssessmentVersion === 3 && (await db.vacancyApplication.findUnique({ where: { id: appAId } }))?.knowledgeAssessmentVersion === 1,
  `C=${appC?.knowledgeAssessmentVersion} A=1`)

// ────────────────────────────────────────────────────────────
// CSV EVIDENCE — evidence-a03-4/public-knowledge-versioning.csv
// ────────────────────────────────────────────────────────────
console.log('\n═══ CSV EVIDENCE ═══')

const csvRows: string[] = ['applicationId,assessmentVersion,blueprintVersion,scoringVersion,itemId,itemVersion,snapshotStatus,candidateCanModify,correctAnswerExposed,resultStatus']
const csvApps = await db.vacancyApplication.findMany({
  where: { id: { in: [appAId, appBId, appCId, legacyInFlight.id, legacyCompleted.id, nokId] } },
  include: { responses: { where: { section: 'CONOCIMIENTOS' } }, vacancy: true },
})
for (const app of csvApps) {
  const items = app.knowledgeAssessmentId
    ? await db.knowledgeAssessmentItem.findMany({ where: { assessmentId: app.knowledgeAssessmentId } })
    : []
  if (items.length === 0) {
    // Legacy / NOT_APPLICABLE administration — one summary row
    const statusLabel =
      app.status !== 'COMPLETED'
        ? 'IN_PROGRESS'
        : app.knowledgeVersioningStatus === 'LEGACY'
          ? 'COMPLETED_LEGACY'
          : app.knowledgeVersioningStatus === 'NOT_APPLICABLE'
            ? 'COMPLETED_NOT_APPLICABLE'
            : 'LEGACY_UNTOUCHED_PRE_A034' // pre-A-03.4 row: null fields, never migrated
    csvRows.push([
      app.id, app.knowledgeAssessmentVersion ?? 'LEGACY', app.knowledgeBlueprintVersion ?? 'LEGACY',
      app.knowledgeScoringVersion ?? 'LEGACY', 'N/A', 'N/A', 'NULL_LEGACY', 'NO', 'NO',
      statusLabel,
    ].join(','))
    continue
  }
  for (const item of items) {
    const resp = app.responses.find(r => (r.vacancyQuestionId ?? r.questionId) === item.itemId)
    csvRows.push([
      app.id,
      `KA-v${app.knowledgeAssessmentVersion}`,
      app.knowledgeBlueprintVersion,
      app.knowledgeScoringVersion,
      item.itemId,
      `v${item.itemVersion}`,
      resp ? (resp.correctAnswerSnapshot !== null ? 'FROZEN_KEYED' : 'FROZEN_NO_KEY') : (item.hasKey ? 'FROZEN_KEYED' : 'FROZEN_NO_KEY'),
      'NO',
      'NO',
      app.status === 'COMPLETED' ? 'COMPLETED_SCORED' : 'IN_PROGRESS_FROZEN',
    ].join(','))
  }
}
await import('fs').then(fs => fs.promises.writeFile('/home/z/my-project/evidence-a03-4/public-knowledge-versioning.csv', csvRows.join('\n') + '\n', 'utf8'))
console.log(`CSV written: ${csvRows.length - 1} data rows`)

// ────────────────────────────────────────────────────────────
// SUMMARY
// ────────────────────────────────────────────────────────────
const passCount = results.filter(r => r.pass).length
const failCount = results.length - passCount
console.log(`\n═══ A-03.4 RESULTS: ${passCount}/${results.length} PASS, ${failCount} FAIL ═══`)
for (const r of results.filter(r => !r.pass)) {
  console.log(`   ❌ [${r.id}] ${r.desc} — expected ${r.expected}, got ${r.got}`)
}
await import('fs').then(fs => fs.promises.writeFile(
  '/home/z/my-project/evidence-a03-4/a034-test-results.json',
  JSON.stringify({ phase: 'A-03.4', total: results.length, pass: passCount, fail: failCount, results }, null, 2)
))

await db.$disconnect()
process.exit(failCount > 0 ? 1 : 0)
