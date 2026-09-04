// @ts-nocheck — D.2.9 test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-D.2.9 — Integrity tests (PARTE 24), admin-db fail-closed test
 * (PARTE 13), and public endpoint regression (PARTE 25).
 *
 * Usage:
 *   bun scripts/d29-tests.ts full        # server running WITH ADMIN_DATABASE_URL
 *   bun scripts/d29-tests.ts admin-fail  # server running WITHOUT ADMIN_DATABASE_URL
 */
import { PrismaClient } from '@prisma/client'
import { mintToken, apiGet } from './d26-lib'

const mode = process.argv[2] || 'full'
const db = new PrismaClient()
const results: Array<{ id: string; desc: string; expected: string; got: string; pass: boolean }> = []
function push(id: string, desc: string, expected: string, got: string, pass: boolean) {
  results.push({ id, desc, expected, got, pass })
  console.log(`${pass ? '✅' : '❌'} [${id}] ${desc} → ${got}`)
}

const BASE = 'http://localhost:3000'
async function apiPost(path: string, body: unknown): Promise<{ status: number; body: any }> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  let b: any = null
  try { b = await res.json() } catch { b = null }
  return { status: res.status, body: b }
}

// ════════════════════════════════════════════════════════════
// FIXTURE — isolated D.2.9 data (companies A/B + parents)
// ════════════════════════════════════════════════════════════
const TS = Date.now()
const fx: Record<string, any> = {}

if (mode === 'full') {
  console.log(`\n═══ FIXTURE (D.2.9) ═══`)
  fx.compA = await db.company.create({ data: { name: `D29-A-${TS}`, sector: 'RESTAURANT', active: true } })
  fx.compB = await db.company.create({ data: { name: `D29-B-${TS}`, sector: 'RETAIL', active: true } })
  fx.cand = await db.user.create({ data: { email: `d29-cand-${TS}@test.local`, name: 'D29 Cand', password: 'x', role: 'CANDIDATO', companyId: fx.compA.id } })
  fx.posA = await db.position.create({ data: { title: 'D29 Pos A', category: 'MESERO', companyId: fx.compA.id } })
  fx.vacA = await db.vacancy.create({ data: { title: 'D29 Vacancy A', slug: `d29-a-${TS}`, companyId: fx.compA.id, status: 'ACTIVE' } })
  fx.appA = await db.vacancyApplication.create({ data: { vacancyId: fx.vacA.id, companyId: fx.compA.id, candidateName: 'D29 Applicant', candidateEmail: `d29-app-${TS}@test.local`, status: 'IN_PROGRESS' } })
  fx.sessA = await db.evaluationSession.create({ data: { candidateId: fx.cand.id, positionId: fx.posA.id, companyId: fx.compA.id, status: 'IN_PROGRESS' } })
  fx.tplA = await db.evaluationTemplate.create({ data: { name: `D29 Tpl A`, type: 'PSICOMETRICA', positionId: fx.posA.id, companyId: fx.compA.id } })
  fx.q1 = await db.question.create({ data: { text: 'D29 Q1', type: 'LIKERT', category: 'OPENNESS', order: 1, evaluationTemplateId: fx.tplA.id, companyId: fx.compA.id } })
  fx.q2 = await db.question.create({ data: { text: 'D29 Q2', type: 'LIKERT', category: 'OPENNESS', order: 2, evaluationTemplateId: fx.tplA.id, companyId: fx.compA.id } })
  console.log(`fixture ready: compA=${fx.compA.id} compB=${fx.compB.id}`)

  // ════════════════════════════════════════════════════════════
  // PARTE 24 — INTEGRITY TESTS (tenant invariant via app-layer RLS)
  // ════════════════════════════════════════════════════════════
  console.log(`\n═══ PARTE 24 — INTEGRIDAD DE TENANT ═══`)
  const { createRLSClient, RLSViolationError } = await import('../src/lib/rls')
  const ctxA = { userId: 'd29-test', role: 'RH', companyId: fx.compA.id }

  // I-1: Session A + Response A (same tenant) → allowed
  try {
    const r = await createRLSClient(ctxA).client.evaluationResponse.create({
      data: { sessionId: fx.sessA.id, questionId: fx.q1.id, value: '3', companyId: fx.compA.id },
    })
    push('I-1', 'Session A + EvaluationResponse A → permitido', 'created', r.id ? 'created' : 'no', !!r.id)
  } catch (e) {
    push('I-1', 'Session A + EvaluationResponse A → permitido', 'created', `ERROR ${String(e).slice(0, 60)}`, false)
  }

  // I-2: Session A + Response with companyId=B → MUST fail
  try {
    await createRLSClient(ctxA).client.evaluationResponse.create({
      data: { sessionId: fx.sessA.id, questionId: fx.q2.id, value: '3', companyId: fx.compB.id },
    })
    push('I-2', 'Session A + EvaluationResponse companyId=B → falla', 'RLSViolationError', 'NO ERROR (vulnerable)', false)
  } catch (e) {
    const ok = e instanceof RLSViolationError
    push('I-2', 'Session A + EvaluationResponse companyId=B → falla', 'RLSViolationError', ok ? 'RLSViolationError' : String(e).slice(0, 50), ok)
  }

  // I-3: Position A + Template companyId=B → MUST fail
  try {
    await createRLSClient(ctxA).client.evaluationTemplate.create({
      data: { name: 'D29 evil', type: 'PSICOMETRICA', positionId: fx.posA.id, companyId: fx.compB.id },
    })
    push('I-3', 'Position A + EvaluationTemplate companyId=B → falla', 'RLSViolationError', 'NO ERROR (vulnerable)', false)
  } catch (e) {
    push('I-3', 'Position A + EvaluationTemplate companyId=B → falla', 'RLSViolationError', e instanceof RLSViolationError ? 'RLSViolationError' : String(e).slice(0, 50), e instanceof RLSViolationError)
  }

  // I-4: Vacancy A + VacancyQuestion companyId=B → MUST fail
  try {
    await createRLSClient(ctxA).client.vacancyQuestion.create({
      data: { text: 'D29 evil', type: 'MULTIPLE_CHOICE', options: '[]', order: 1, vacancyId: fx.vacA.id, companyId: fx.compB.id },
    })
    push('I-4', 'Vacancy A + VacancyQuestion companyId=B → falla', 'RLSViolationError', 'NO ERROR (vulnerable)', false)
  } catch (e) {
    push('I-4', 'Vacancy A + VacancyQuestion companyId=B → falla', 'RLSViolationError', e instanceof RLSViolationError ? 'RLSViolationError' : String(e).slice(0, 50), e instanceof RLSViolationError)
  }

  // I-5: Application A + Response companyId=B → MUST fail
  try {
    await createRLSClient(ctxA).client.vacancyApplicationResponse.create({
      data: { applicationId: fx.appA.id, section: 'PSICOMETRICA', value: '1', companyId: fx.compB.id },
    })
    push('I-5', 'Application A + Response companyId=B → falla', 'RLSViolationError', 'NO ERROR (vulnerable)', false)
  } catch (e) {
    push('I-5', 'Application A + Response companyId=B → falla', 'RLSViolationError', e instanceof RLSViolationError ? 'RLSViolationError' : String(e).slice(0, 50), e instanceof RLSViolationError)
  }

  // I-6: auto-inject — create without companyId stamps the context tenant
  try {
    const t = await createRLSClient(ctxA).client.evaluationTemplate.create({
      data: { name: `D29 autoinject`, type: 'INTEGRIDAD', positionId: fx.posA.id },
    })
    const fromDb = await db.evaluationTemplate.findUnique({ where: { id: t.id } })
    push('I-6', 'Create sin companyId → auto-inyecta companyId del contexto (invariante)', `== compA (${fx.compA.id})`, fromDb?.companyId, fromDb?.companyId === fx.compA.id)
  } catch (e) {
    push('I-6', 'Create sin companyId → auto-inyecta companyId del contexto (invariante)', `== compA`, `ERROR ${String(e).slice(0, 50)}`, false)
  }

  // I-7: DB-wide invariant check (child.companyId == parent.companyId)
  {
    const bad = await db.$queryRawUnsafe<Array<{ model: string; n: bigint }>>(`
      SELECT 'EvaluationResponse' as model, COUNT(*) as n FROM EvaluationResponse r JOIN EvaluationSession s ON r.sessionId = s.id WHERE r.companyId != s.companyId
      UNION ALL SELECT 'EvaluationTemplate', COUNT(*) FROM EvaluationTemplate t JOIN Position p ON t.positionId = p.id WHERE t.companyId != p.companyId
      UNION ALL SELECT 'VacancyQuestion', COUNT(*) FROM VacancyQuestion q JOIN Vacancy v ON q.vacancyId = v.id WHERE q.companyId != v.companyId
      UNION ALL SELECT 'VacancyApplicationResponse', COUNT(*) FROM VacancyApplicationResponse r JOIN VacancyApplication a ON r.applicationId = a.id WHERE r.companyId != a.companyId
    `)
    const total = bad.reduce((acc, r) => acc + Number(r.n), 0)
    push('I-7', 'Invariante DB global: child.companyId == parent.companyId', '0 violaciones', `${total}`, total === 0)
  }
}

// ════════════════════════════════════════════════════════════
// PARTE 13 — ADMIN DB FAIL-CLOSED (server WITHOUT ADMIN_DATABASE_URL)
// ════════════════════════════════════════════════════════════
if (mode === 'admin-fail') {
  console.log(`\n═══ PARTE 13 — ADMIN DB FAIL CLOSED (sin ADMIN_DATABASE_URL) ═══`)
  const fx26 = JSON.parse(await Bun.file('scripts/d26-fixture.json').text())
  const tSa = await mintToken({ sub: fx26.sa, email: fx26.emailSa, name: 'D29 SA', role: 'SUPER_ADMIN' })
  for (const ep of ['/api/dashboard', '/api/results', '/api/candidates']) {
    const r = await apiGet(tSa, ep)
    const msg = r.text.includes('ADMIN DB fail-closed') || r.body?.error !== undefined
    push(`AF-${ep}`, `SA aggregate ${ep} sin ADMIN_DATABASE_URL → FAIL CLOSED (HTTP 500, sin datos)`, 'HTTP 500 + error', `HTTP ${r.status} msg=${(r.body?.error || '').slice(0, 40)}`, r.status === 500 && msg)
  }
}

// ════════════════════════════════════════════════════════════
// PARTE 15 + PARTE 25 — AGGREGATE OK + PUBLIC ENDPOINTS (full mode)
// ════════════════════════════════════════════════════════════
if (mode === 'full') {
  console.log(`\n═══ PARTE 15 — SA AGGREGATE vía admin-db (con ADMIN_DATABASE_URL) ═══`)
  const fx26 = JSON.parse(await Bun.file('scripts/d26-fixture.json').text())
  const tSa = await mintToken({ sub: fx26.sa, email: fx26.emailSa, name: 'D29 SA', role: 'SUPER_ADMIN' })
  for (const ep of ['/api/dashboard', '/api/results', '/api/candidates']) {
    const r = await apiGet(tSa, ep)
    const ok = r.status === 200
    push(`AGG-${ep}`, `SA aggregate ${ep} → 200 exclusivamente vía admin-db`, 'HTTP 200', `HTTP ${r.status}`, ok)
  }

  console.log(`\n═══ PARTE 25 — PUBLIC ENDPOINTS ═══`)

  // PUB-1: public vacancy by slug (no auth) — public info only
  {
    const r = await apiGet('', `/api/public/vacancy?slug=${fx.vacA.slug}`)
    const b: any = r.body
    const noPrivate = b?.vacancy && !JSON.stringify(b).includes('candidate') && !b.vacancy.companyId
    push('PUB-1', 'GET /api/public/vacancy → datos públicos sin datos privados', '200 + público', `HTTP ${r.status} privado=${!noPrivate}`, r.status === 200 && noPrivate)
  }

  // PUB-2: apply data step (bootstrap) → applicationId + token
  let appToken = ''
  {
    const r = await apiPost('/api/public/apply', {
      step: 'data', vacancySlug: fx.vacA.slug,
      name: 'D29 Flow', email: `d29-flow-${TS}@test.local`,
    })
    appToken = r.body?.token || ''
    fx.appFlow = r.body?.applicationId
    push('PUB-2', 'POST apply step=data → crea aplicación + token HMAC', '200 + token', `HTTP ${r.status} token=${appToken ? 'yes' : 'no'}`, r.status === 200 && !!appToken)
  }

  // PUB-3: GET resume step 0 → NO PII
  {
    const r = await apiGet('', `/api/public/apply?applicationId=${fx.appFlow}`)
    const b: any = r.body
    const leaked = ['candidateName', 'candidateEmail', 'candidatePhone', 'candidateAge'].filter(k => b?.[k] !== undefined)
    push('PUB-3', 'GET resume step0 → sin PII del candidato (data-minimization)', '0 campos PII', `leaked=[${leaked.join(',')}]`, r.status === 200 && leaked.length === 0)
  }

  // PUB-4: answer WITHOUT token → 403 TOKEN_REQUIRED
  {
    const r = await apiPost('/api/public/apply', { step: 'answer', applicationId: fx.appFlow, section: 'PSICOMETRICA', value: '3' })
    push('PUB-4', 'POST answer SIN token → 403 TOKEN_REQUIRED', '403', `HTTP ${r.status} code=${r.body?.code}`, r.status === 403 && r.body?.code === 'TOKEN_REQUIRED')
  }

  // PUB-5: answer with INVALID token → 403 TOKEN_INVALID
  {
    const r = await apiPost('/api/public/apply', { step: 'answer', applicationId: fx.appFlow, section: 'PSICOMETRICA', value: '3', token: 'forged.abc' })
    push('PUB-5', 'POST answer token inválido → 403 TOKEN_INVALID', '403', `HTTP ${r.status} code=${r.body?.code}`, r.status === 403 && r.body?.code === 'TOKEN_INVALID')
  }

  // PUB-6: answer with VALID token → success + row stamped with tenant
  {
    const r = await apiPost('/api/public/apply', { step: 'answer', applicationId: fx.appFlow, section: 'PSICOMETRICA', questionId: fx.q1.id, value: '3', token: appToken })
    const row = r.body?.success ? await db.vacancyApplicationResponse.findFirst({ where: { applicationId: fx.appFlow } }) : null
    push('PUB-6', 'POST answer token válido → guarda + companyId==application', 'success + invariante', `HTTP ${r.status} row=${row ? (row.companyId === fx.compA.id ? 'stamped-A' : `WRONG:${row.companyId}`) : 'missing'}`, r.status === 200 && row?.companyId === fx.compA.id)
  }

  // PUB-7: advance with valid token → success
  {
    const r = await apiPost('/api/public/apply', { step: 'advance', applicationId: fx.appFlow, completedStep: 0, token: appToken })
    push('PUB-7', 'POST advance token válido → avanza', 'success/nextStep', `HTTP ${r.status} nextStep=${r.body?.nextStep}`, r.status === 200)
  }

  // PUB-8: video with invalid token → 403 (no 404 oracle)
  {
    const r = await apiPost('/api/public/video', { applicationId: 'no-existe-id', videoSent: false, token: 'forged.abc' })
    push('PUB-8', 'POST video token inválido + id inexistente → 403 (token ANTES del lookup)', '403 TOKEN_INVALID', `HTTP ${r.status} code=${r.body?.code}`, r.status === 403 && r.body?.code === 'TOKEN_INVALID')
  }

  // PUB-9: video without token → 403 TOKEN_REQUIRED
  {
    const r = await apiPost('/api/public/video', { applicationId: fx.appFlow, videoSent: false })
    push('PUB-9', 'POST video sin token → 403 TOKEN_REQUIRED', '403', `HTTP ${r.status} code=${r.body?.code}`, r.status === 403 && r.body?.code === 'TOKEN_REQUIRED')
  }

  // PUB-10: invitation token inválido → valid:false (rate-limited endpoint)
  {
    const r = await apiGet('', `/api/public/invitation?token=not-a-real-token-${TS}`)
    push('PUB-10', 'GET invitation token inválido → valid:false', 'valid:false', `HTTP ${r.status} valid=${(r.body as any)?.valid}`, r.status === 200 && (r.body as any)?.valid === false)
  }

  // PUB-11: advance WITHOUT token → 403 (write path closed)
  {
    const r = await apiPost('/api/public/apply', { step: 'advance', applicationId: fx.appFlow, completedStep: 1 })
    push('PUB-11', 'POST advance SIN token → 403 TOKEN_REQUIRED', '403', `HTTP ${r.status} code=${r.body?.code}`, r.status === 403 && r.body?.code === 'TOKEN_REQUIRED')
  }
}

console.log(`\n═══ SUMMARY (${mode}) — ${results.length} checks, ${results.filter(r => !r.pass).length} failed ═══`)
await Bun.write(`scripts/d29-test-results-${mode}.json`, JSON.stringify(results, null, 2))
await db.$disconnect()
process.exit(results.every(r => r.pass) ? 0 : 1)
