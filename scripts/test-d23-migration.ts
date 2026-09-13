/**
 * PHASE 3.5-D.2.3 — Isolation test suite
 * Migrated endpoints: /api/evaluations, /api/invite, /api/questions
 *
 * Covers:
 *   - Cross-tenant isolation TESTS 1-15 (spec D.2.3 §18)
 *   - CompleteEvaluation atomicity CE-1..CE-5 (spec §19)
 *   - Global question tests (spec §21)
 *   - questionId/positionId/templateId spoofing
 *   - Regression: login, candidates, users, consent, positions, arco,
 *     full evaluation flow (create-session → start → answer → next-step → complete),
 *     invite flow, questions CRUD (spec §22)
 *   - Concurrency: interleaved A/B requests (spec §18 note)
 *
 * Run: bun scripts/test-d23-migration.ts
 */
import { db } from '../src/lib/db'
import { generateToken } from '../src/lib/auth'
import { hashPassword } from '../src/lib/password'

const BASE = 'http://localhost:3000'
const SUFFIX = Date.now().toString(36)
const PREFIX = `d23-${SUFFIX}`

let passed = 0
let failed = 0
const failures: string[] = []

function report(name: string, ok: boolean, detail = '') {
  if (ok) {
    passed++
    console.log(`  PASS  ${name}`)
  } else {
    failed++
    failures.push(`${name} ${detail}`)
    console.log(`  FAIL  ${name} ${detail}`)
  }
}

async function api(
  token: string | null,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; json: Record<string, unknown> }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let json: Record<string, unknown> = {}
  try {
    json = await res.json()
  } catch {
    /* ignore non-JSON */
  }
  return { status: res.status, json }
}

async function cleanupByCompanyPrefix(prefix: string) {
  const old = await db.company.findMany({ where: { name: { startsWith: prefix } } })
  for (const c of old) {
    const users = await db.user.findMany({ where: { companyId: c.id }, select: { id: true } })
    const userIds = users.map(u => u.id)
    if (userIds.length) {
      await db.evaluationResponse.deleteMany({ where: { session: { candidateId: { in: userIds } } } })
      await db.evaluationResult.deleteMany({ where: { candidateId: { in: userIds } } })
      await db.evaluationSession.deleteMany({ where: { candidateId: { in: userIds } } })
      await db.interviewSchedule.deleteMany({ where: { candidateId: { in: userIds } } })
      await db.consentLog.deleteMany({ where: { userId: { in: userIds } } })
      await db.candidateInvitation.deleteMany({ where: { companyId: c.id } })
      await db.user.deleteMany({ where: { id: { in: userIds } } })
    }
    const positions = await db.position.findMany({ where: { companyId: c.id }, select: { id: true } })
    for (const p of positions) {
      const templates = await db.evaluationTemplate.findMany({ where: { positionId: p.id } })
      for (const t of templates) {
        await db.evaluationResponse.deleteMany({ where: { question: { evaluationTemplateId: t.id } } })
        await db.question.deleteMany({ where: { evaluationTemplateId: t.id } })
        await db.evaluationTemplate.delete({ where: { id: t.id } })
      }
    }
    await db.position.deleteMany({ where: { companyId: c.id } })
    await db.company.delete({ where: { id: c.id } })
  }
}

async function main() {
  console.log('=== SETUP: synthetic tenants ===')
  await cleanupByCompanyPrefix('D23-TEST-')

  // ── Companies ──
  const companyA = await db.company.create({ data: { name: `D23-TEST-A-${SUFFIX}`, sector: 'RESTAURANT' } })
  const companyB = await db.company.create({ data: { name: `D23-TEST-B-${SUFFIX}`, sector: 'RETAIL' } })

  // ── Positions ──
  const positionA = await db.position.create({
    data: { title: 'Mesero A', sector: 'RESTAURANT', category: 'MESERO', companyId: companyA.id },
  })
  const positionB = await db.position.create({
    data: { title: 'Vendedor B', sector: 'RETAIL', category: 'VENDEDOR', companyId: companyB.id },
  })
  // Extra positions for full-flow regressions (avoid duplicate-session checks)
  const positionA2 = await db.position.create({
    data: { title: 'Cocinero A', sector: 'RESTAURANT', category: 'COCINERO', companyId: companyA.id },
  })
  const positionB2 = await db.position.create({
    data: { title: 'Cajero B', sector: 'RETAIL', category: 'VENDEDOR', companyId: companyB.id },
  })

  // ── Users ──
  const pwd = await hashPassword('testpass123')
  const rhA = await db.user.create({
    data: { email: `${PREFIX}-rh-a@test.local`, name: 'RH A', password: pwd, role: 'RH', companyId: companyA.id },
  })
  const rhB = await db.user.create({
    data: { email: `${PREFIX}-rh-b@test.local`, name: 'RH B', password: pwd, role: 'RH', companyId: companyB.id },
  })
  const mkCand = (email: string, name: string, companyId: string) =>
    db.user.create({
      data: {
        email, name, password: pwd, role: 'CANDIDATO', companyId,
        consentGiven: true, consentDate: new Date(), consentOption: 'FULL',
        consentConfirmed: true, consentVersion: '2026-02-v1',
      },
    })
  const candA1 = await mkCand(`${PREFIX}-cand-a1@test.local`, 'Candidato A1', companyA.id)
  const candA2 = await mkCand(`${PREFIX}-cand-a2@test.local`, 'Candidato A2', companyA.id)
  const candB1 = await mkCand(`${PREFIX}-cand-b1@test.local`, 'Candidato B1', companyB.id)

  // ── SA ──
  let sa = await db.user.findFirst({ where: { role: 'SUPER_ADMIN' }, orderBy: { createdAt: 'asc' } })
  let saIsSynthetic = false
  if (!sa) {
    sa = await db.user.create({
      data: { email: `${PREFIX}-sa@test.local`, name: 'SA D23', password: pwd, role: 'SUPER_ADMIN' },
    })
    saIsSynthetic = true
  }

  // ── Evaluation chains (session + template + questions + responses) ──
  async function mkEvalChain(positionId: string, companyId: string, candidateId: string, label: string, status = 'IN_PROGRESS') {
    const session = await db.evaluationSession.create({
      data: { candidateId, positionId, companyId, status, currentStep: 1 },
    })
    const template = await db.evaluationTemplate.create({
      data: { name: `T-${label}`, type: 'PSICOMETRICA', order: 1, positionId, companyId },
    })
    const question = await db.question.create({
      data: { text: `Q-${label}`, type: 'LIKERT', category: 'OPENNESS', order: 1, evaluationTemplateId: template.id },
    })
    // GLOBAL (system) question attached to the same template — companyId NULL
    const globalQuestion = await db.question.create({
      data: { text: `GLOBAL-Q-${label}`, type: 'LIKERT', category: 'CONSCIENTIOUSNESS', order: 2, evaluationTemplateId: template.id, isCustom: false, companyId: null },
    })
    if (status !== 'NOT_STARTED') {
      await db.evaluationResponse.create({
        data: { sessionId: session.id, questionId: question.id, value: '3', numericValue: 3, companyId },
      })
    }
    return { session, question, globalQuestion, template }
  }
  const evalA = await mkEvalChain(positionA.id, companyA.id, candA1.id, 'A')
  const evalB = await mkEvalChain(positionB.id, companyB.id, candB1.id, 'B')

  // ── Custom question of company B (own template) — for TEST 10/11 ──
  const questionBcustom = await db.question.create({
    data: { text: `CUSTOM-B-${SUFFIX}`, type: 'LIKERT', category: 'EMPATHY', order: 3, evaluationTemplateId: evalB.template.id, isCustom: true, companyId: companyB.id },
  })

  // ── Invitations ──
  const invitationA = await db.candidateInvitation.create({
    data: {
      candidateName: 'Inv A', phone: `+52${SUFFIX}A`.slice(0, 15), token: `tok-a-${SUFFIX}`,
      status: 'PENDING', channel: 'WHATSAPP', companyId: companyA.id, positionId: positionA.id, invitedBy: rhA.id,
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  })
  const invitationB = await db.candidateInvitation.create({
    data: {
      candidateName: 'Inv B', phone: `+52${SUFFIX}B`.slice(0, 15), token: `tok-b-${SUFFIX}`,
      status: 'PENDING', channel: 'WHATSAPP', companyId: companyB.id, positionId: positionB.id, invitedBy: rhB.id,
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  })

  // ── JWTs ──
  const tokenRhA = await generateToken({ sub: rhA.id, email: rhA.email, name: rhA.name, role: rhA.role, companyId: companyA.id } as never)
  const tokenRhB = await generateToken({ sub: rhB.id, email: rhB.email, name: rhB.name, role: rhB.role, companyId: companyB.id } as never)
  const tokenCandA1 = await generateToken({ sub: candA1.id, email: candA1.email, name: candA1.name, role: 'CANDIDATO', companyId: companyA.id } as never)
  const tokenCandA2 = await generateToken({ sub: candA2.id, email: candA2.email, name: candA2.name, role: 'CANDIDATO', companyId: companyA.id } as never)
  const tokenCandB1 = await generateToken({ sub: candB1.id, email: candB1.email, name: candB1.name, role: 'CANDIDATO', companyId: companyB.id } as never)
  const tokenSA = await generateToken({ sub: sa.id, email: sa.email, name: sa.name, role: 'SUPER_ADMIN' } as never)

  // ============================================================
  console.log('=== CROSS-TENANT TESTS (spec 1-15) ===')

  // TEST 1 — A → EvaluationSession A: PASS
  {
    const r = await api(tokenRhA, 'GET', `/api/evaluations?sessionId=${evalA.session.id}`)
    const s = r.json.session as { companyId?: string } | undefined
    report('TEST 1: A→EvaluationSession A PASS', r.status === 200 && s?.companyId === companyA.id)
  }

  // TEST 2 — A → EvaluationSession B: DENIED
  {
    const r = await api(tokenRhA, 'GET', `/api/evaluations?sessionId=${evalB.session.id}`)
    report('TEST 2: A→EvaluationSession B DENIED (404)', r.status === 404)
  }

  // TEST 3 — A → EvaluationResult B: DENIED (via session read; B result untouched)
  {
    const before = await db.evaluationResult.findFirst({ where: { sessionId: evalB.session.id } })
    const r = await api(tokenRhA, 'GET', `/api/evaluations?sessionId=${evalB.session.id}`)
    const after = await db.evaluationResult.findFirst({ where: { sessionId: evalB.session.id } })
    report('TEST 3: A→EvaluationResult B DENIED (404 + resultado intacto)',
      r.status === 404 && JSON.stringify(before) === JSON.stringify(after))
  }

  // TEST 4 — A → modify Result B (complete B's completed session): DENIED
  {
    await db.evaluationSession.update({ where: { id: evalB.session.id }, data: { status: 'COMPLETED', completedAt: new Date() } })
    const resultB = await db.evaluationResult.create({
      data: {
        sessionId: evalB.session.id, candidateId: candB1.id, candidateName: 'Candidato B1',
        positionId: positionB.id, positionTitle: 'Vendedor B', companyId: companyB.id,
        openness: 50, overallScore: 50, recommendation: 'PERFIL_PARCIAL',
      },
    })
    const r = await api(tokenRhA, 'POST', '/api/evaluations', { sessionId: evalB.session.id, action: 'complete' })
    const after = await db.evaluationResult.findUnique({ where: { id: resultB.id } })
    report('TEST 4: A→modify Result B DENIED (404 + resultado intacto)',
      r.status === 404 && after?.overallScore === 50 && after?.companyId === companyB.id)
    await db.evaluationResult.delete({ where: { id: resultB.id } })
  }

  // TEST 5 — A → completeEvaluation(session B, IN_PROGRESS): DENIED, no result created
  {
    await db.evaluationSession.update({ where: { id: evalB.session.id }, data: { status: 'IN_PROGRESS', completedAt: null } })
    const r = await api(tokenRhA, 'POST', '/api/evaluations', { sessionId: evalB.session.id, action: 'complete' })
    const resultCount = await db.evaluationResult.count({ where: { sessionId: evalB.session.id } })
    const sessionAfter = await db.evaluationSession.findUnique({ where: { id: evalB.session.id } })
    report('TEST 5: A→completeEvaluation(session B) DENIED (404, sin resultado, sesión IN_PROGRESS)',
      r.status === 404 && resultCount === 0 && sessionAfter?.status === 'IN_PROGRESS')
  }

  // TEST 5b — CANDIDATO A1 → recursos de B1: DENIED
  // (GET de CANDIDATO siempre cae en la rama candidateId — comportamiento original
  //  preservado: devuelve SU PROPIA lista, nunca datos de B)
  {
    const r1 = await api(tokenCandA1, 'GET', `/api/evaluations?sessionId=${evalB.session.id}`)
    const ownSessions = (r1.json.sessions as { id: string }[]) || []
    const noLeak = r1.status === 200 && ownSessions.every(s => s.id !== evalB.session.id)
    const r2 = await api(tokenCandA1, 'POST', '/api/evaluations', { sessionId: evalB.session.id, action: 'complete' })
    const r3 = await api(tokenCandA1, 'POST', '/api/evaluations', { sessionId: evalB.session.id, action: 'answer', questionId: evalB.question.id, value: '1' })
    report('TEST 5b: CANDIDATO A1→recursos de B1 DENIED (GET sin datos de B + complete/answer 404)',
      noLeak && r2.status === 404 && r3.status === 404,
      `(get=${r1.status}, complete=${r2.status}, answer=${r3.status})`)
  }

  // TEST 6 — A → invitation B: DENIED (list + delete)
  {
    const rList = await api(tokenRhA, 'GET', '/api/invite')
    const list = (rList.json.invitations as { id: string }[]) || []
    const rDel = await api(tokenRhA, 'DELETE', `/api/invite?id=${invitationB.id}`)
    const stillThere = await db.candidateInvitation.findUnique({ where: { id: invitationB.id } })
    report('TEST 6: A→invitation B DENIED (lista sin B + delete 404 + sobrevive)',
      rList.status === 200 && !list.some(i => i.id === invitationB.id) && list.some(i => i.id === invitationA.id) &&
      rDel.status === 404 && stillThere !== null)
  }

  // TEST 7 — A → create invitation using position B: DENIED
  {
    const r = await api(tokenRhA, 'POST', '/api/invite', {
      candidateName: 'Evil', phone: '+5215500000001', positionId: positionB.id,
    })
    const created = await db.candidateInvitation.findFirst({ where: { phone: '+5215500000001' } })
    report('TEST 7: A→create invitation con positionId de B DENIED (404, nada creado)',
      r.status === 404 && created === null)
  }

  // TEST 8 — A → Question A: PASS (read own position + create custom)
  {
    const rGet = await api(tokenRhA, 'GET', `/api/questions?positionId=${positionA.id}`)
    const templates = (rGet.json.templates as { questions: { id: string }[] }[]) || []
    const qIds = templates.flatMap(t => t.questions.map(q => q.id))
    const rPost = await api(tokenRhA, 'POST', '/api/questions', {
      templateId: evalA.template.id, text: `CUSTOM-A-${SUFFIX}`, type: 'LIKERT', category: 'TEAMWORK',
    })
    report('TEST 8: A→Question A PASS (GET con preguntas + POST custom 201)',
      rGet.status === 200 && qIds.includes(evalA.question.id) && rPost.status === 201)
    const createdA = (rPost.json.question as { id?: string })?.id
    if (createdA) globalThis.__d23qA = createdA
  }

  // TEST 9 — A → Question GLOBAL: READ PASS / WRITE DENIED / DELETE DENIED
  {
    const rGet = await api(tokenRhA, 'GET', `/api/questions?positionId=${positionA.id}`)
    const templates = (rGet.json.templates as { questions: { id: string; companyId: string | null }[] }[]) || []
    const qIds = templates.flatMap(t => t.questions.map(q => q.id))
    const readOk = rGet.status === 200 && qIds.includes(evalA.globalQuestion.id)
    const rPut = await api(tokenRhA, 'PUT', '/api/questions', { questionId: evalA.globalQuestion.id, text: 'HACK-GLOBAL' })
    const gAfter = await db.question.findUnique({ where: { id: evalA.globalQuestion.id } })
    const rDel = await api(tokenRhA, 'DELETE', `/api/questions?questionId=${evalA.globalQuestion.id}`)
    const gAfterDel = await db.question.findUnique({ where: { id: evalA.globalQuestion.id } })
    report('TEST 9: A→Question GLOBAL (READ PASS, WRITE DENIED, DELETE DENIED)',
      readOk && rPut.status === 404 && gAfter?.text === evalA.globalQuestion.text &&
      rDel.status === 404 && gAfterDel !== null)
  }

  // TEST 10 — A → modify Question B: DENIED
  {
    const r = await api(tokenRhA, 'PUT', '/api/questions', { questionId: questionBcustom.id, text: 'HACK-B' })
    const after = await db.question.findUnique({ where: { id: questionBcustom.id } })
    report('TEST 10: A→modificar Question B DENIED (404 + texto intacto)',
      r.status === 404 && after?.text === questionBcustom.text)
  }

  // TEST 11 — A → delete Question B: DENIED
  {
    const r = await api(tokenRhA, 'DELETE', `/api/questions?questionId=${questionBcustom.id}`)
    const stillThere = await db.question.findUnique({ where: { id: questionBcustom.id } })
    report('TEST 11: A→delete Question B DENIED (404 + sobrevive)', r.status === 404 && stillThere !== null)
  }

  // TEST 12 — A → companyId=B (spoof): real tenant stays A
  {
    const r1 = await api(tokenRhA, 'POST', '/api/invite', {
      candidateName: 'Spoof', phone: '+5215500000002', positionId: positionA.id, companyId: companyB.id,
    })
    const inv = r1.json.invitation as { companyId?: string; id?: string } | undefined
    const r2 = await api(tokenRhA, 'POST', '/api/questions', {
      templateId: evalA.template.id, text: `SPOOF-Q-${SUFFIX}`, type: 'LIKERT', companyId: companyB.id,
    })
    const q = r2.json.question as { companyId?: string } | undefined
    report('TEST 12: A→companyId=B ignorado (invitation A + question A)',
      r1.status === 201 && inv?.companyId === companyA.id && r2.status === 201 && q?.companyId === companyA.id)
    if (inv?.id) globalThis.__d23invSpoof = inv.id
  }

  // TEST 13 — A → targetCompanyId=B (query spoof): ignored, stays A
  {
    const r1 = await api(tokenRhA, 'GET', `/api/invite?companyId=${companyB.id}`)
    const invs = (r1.json.invitations as { id: string }[]) || []
    const r2 = await api(tokenRhA, 'GET', `/api/evaluations?candidateId=${candB1.id}&companyId=${companyB.id}`)
    const sessions = (r2.json.sessions as { id: string }[]) || []
    const r3 = await api(tokenRhA, 'GET', `/api/questions?positionId=${positionB.id}&companyId=${companyB.id}`)
    report('TEST 13: A→targetCompanyId=B DENIED (invite solo A, sessions vacío, questions 404)',
      r1.status === 200 && invs.every(i => i.id !== invitationB.id) &&
      r2.status === 200 && sessions.length === 0 && r3.status === 404)
  }

  // TEST 14 — B → recursos B: PASS (lista + sesión propia)
  {
    const r1 = await api(tokenRhB, 'GET', '/api/invite')
    const invs = (r1.json.invitations as { id: string }[]) || []
    const r2 = await api(tokenRhB, 'GET', `/api/evaluations?sessionId=${evalB.session.id}`)
    const s = r2.json.session as { companyId?: string } | undefined
    report('TEST 14: B→recursos B PASS (invitaciones B visibles + sesión B OK)',
      r1.status === 200 && invs.some(i => i.id === invitationB.id) && r2.status === 200 && s?.companyId === companyB.id)
  }

  // TEST 15 — SA → impersonate B: PASS + AuditLog
  {
    const r = await api(tokenSA, 'GET', `/api/evaluations?candidateId=${candB1.id}&companyId=${companyB.id}`)
    const sessions = (r.json.sessions as { id: string }[]) || []
    const log = await db.auditLog.findFirst({
      where: { actorId: sa.id, action: 'ADMIN_ACCESS', resource: 'EvaluationSession' },
      orderBy: { createdAt: 'desc' },
    })
    const details = log?.details ? JSON.parse(log.details) : {}
    report('TEST 15: SA→impersonate B PASS + AuditLog',
      r.status === 200 && sessions.some(s => s.id === evalB.session.id) &&
      log !== null && details.impersonation === true && details.targetCompanyId === companyB.id)
  }

  // TEST 15b — SA con target=B intenta sesión de A → DENIED (target mismatch)
  {
    const r = await api(tokenSA, 'GET', `/api/evaluations?sessionId=${evalA.session.id}&companyId=${companyB.id}`)
    report('TEST 15b: SA(target=B)→sesión de A DENIED (404)', r.status === 404)
  }

  // ============================================================
  console.log('=== COMPLETE EVALUATION TESTS (CE-1..CE-5) ===')

  // Dedicated sessions for CE tests
  const ceS1 = (await mkEvalChain(positionA.id, companyA.id, candA1.id, 'CE1', 'IN_PROGRESS')).session
  const ceS2 = (await mkEvalChain(positionA.id, companyA.id, candA1.id, 'CE2', 'IN_PROGRESS')).session
  const ceS3 = (await mkEvalChain(positionA.id, companyA.id, candA1.id, 'CE3', 'IN_PROGRESS')).session

  // CE-1 — Session A + Result inexistente → Result A creado
  {
    const r = await api(tokenRhA, 'POST', '/api/evaluations', { sessionId: ceS1.id, action: 'complete' })
    const result = r.json.result as { companyId?: string; sessionId?: string } | undefined
    const dbResult = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    report('CE-1: complete → Result A creado (companyId A)',
      r.status === 200 && result?.companyId === companyA.id && dbResult !== null && dbResult.companyId === companyA.id)
  }

  // CE-2 — Session A + Result A existente → actualizado correctamente (no duplicado)
  {
    await db.evaluationSession.update({ where: { id: ceS1.id }, data: { status: 'IN_PROGRESS', completedAt: null } })
    const before = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    const r = await api(tokenRhA, 'POST', '/api/evaluations', { sessionId: ceS1.id, action: 'complete' })
    const count = await db.evaluationResult.count({ where: { sessionId: ceS1.id } })
    const after = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    const scoresIdentical =
      before?.overallScore === after?.overallScore &&
      before?.openness === after?.openness &&
      before?.recommendation === after?.recommendation &&
      before?.summary === after?.summary
    report('CE-2: re-complete → Result actualizado (misma fila, scores idénticos, count=1)',
      r.status === 200 && count === 1 && before?.id === after?.id && scoresIdentical)
  }

  // CE-3 — Session A (S2) completa su PROPIO resultado; Result de S1 intacto
  {
    const before = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    const r = await api(tokenRhA, 'POST', '/api/evaluations', { sessionId: ceS2.id, action: 'complete' })
    const after = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    const resultS2 = await db.evaluationResult.findFirst({ where: { sessionId: ceS2.id } })
    report('CE-3: complete(S2) crea resultado propio de S2; S1 intacto',
      r.status === 200 && resultS2 !== null && resultS2.sessionId === ceS2.id &&
      JSON.stringify(before) === JSON.stringify(after))
  }

  // CE-4 — Session B + Result A: B no puede tocar resultados de A
  {
    const before = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    const r1 = await api(tokenRhB, 'POST', '/api/evaluations', { sessionId: ceS1.id, action: 'complete' })
    const r2 = await api(tokenCandB1, 'POST', '/api/evaluations', { sessionId: ceS1.id, action: 'complete' })
    const after = await db.evaluationResult.findFirst({ where: { sessionId: ceS1.id } })
    report('CE-4: B→complete(session A) DENIED (RH-B y CANDIDATO B1, resultado A intacto)',
      r1.status === 404 && r2.status === 404 && JSON.stringify(before) === JSON.stringify(after))
  }

  // CE-5 — Fallo intencional tras escritura parcial → ROLLBACK total
  //        (Resultado pre-creado con companyId=B fuerza violación UNIQUE(sessionId)
  //         en el INSERT del resultado de A → la transacción aborta completa)
  {
    const corrupt = await db.evaluationResult.create({
      data: {
        sessionId: ceS3.id, candidateId: candA1.id, candidateName: 'CORRUPT-FK-B',
        positionId: positionA.id, positionTitle: 'Mesero A', companyId: companyB.id,
        openness: 33.33, overallScore: 33.33, recommendation: 'PENDIENTE',
      },
    })
    const r = await api(tokenRhA, 'POST', '/api/evaluations', { sessionId: ceS3.id, action: 'complete' })
    const sessionAfter = await db.evaluationSession.findUnique({ where: { id: ceS3.id } })
    const resultCount = await db.evaluationResult.count({ where: { sessionId: ceS3.id } })
    const corruptAfter = await db.evaluationResult.findUnique({ where: { id: corrupt.id } })
    const corruptUnchanged =
      corruptAfter?.candidateName === 'CORRUPT-FK-B' &&
      corruptAfter?.openness === 33.33 &&
      corruptAfter?.overallScore === 33.33 &&
      corruptAfter?.recommendation === 'PENDIENTE'
    report('CE-5: fallo a mitad de transacción → ROLLBACK (sesión IN_PROGRESS, 1 resultado, corrupto idéntico, HTTP 500)',
      r.status === 500 && sessionAfter?.status === 'IN_PROGRESS' && sessionAfter?.completedAt === null &&
      resultCount === 1 && corruptUnchanged)
    await db.evaluationResult.delete({ where: { id: corrupt.id } })
  }

  // ============================================================
  console.log('=== GLOBAL QUESTION TESTS (spec 21) ===')
  {
    // A GET position A → GLOBAL + A (ya validado en TEST 8/9). Aquí: templateId branch.
    const rGetT = await api(tokenRhA, 'GET', `/api/questions?templateId=${evalA.template.id}`)
    const qs = (rGetT.json.questions as { id: string; companyId: string | null }[]) || []
    const hasGlobal = qs.some(q => q.id === evalA.globalQuestion.id && q.companyId === null)
    const hasOwn = qs.some(q => q.id === evalA.question.id)
    const onlyAorGlobal = qs.every(q => q.companyId === null || q.companyId === companyA.id)
    // A GET con templateId de B → DENIED
    const rGetB = await api(tokenRhA, 'GET', `/api/questions?templateId=${evalB.template.id}`)
    // A POST sobre template de B → DENIED
    const rPostB = await api(tokenRhA, 'POST', '/api/questions', {
      templateId: evalB.template.id, text: 'EVIL', type: 'LIKERT',
    })
    report('GQ: A GET template A → GLOBAL+A únicamente; template B → 404; POST en template B → 404',
      rGetT.status === 200 && hasGlobal && hasOwn && onlyAorGlobal && rGetB.status === 404 && rPostB.status === 404)
  }

  // ============================================================
  console.log('=== ANSWER SPOOFING TEST (questionId cross-position) ===')
  {
    // A1 responde con questionId de la posición B dentro de su sesión A → DENIED
    const r = await api(tokenCandA1, 'POST', '/api/evaluations', {
      sessionId: evalA.session.id, action: 'answer', questionId: questionBcustom.id, value: '5', numericValue: 5,
    })
    const respCount = await db.evaluationResponse.count({
      where: { sessionId: evalA.session.id, questionId: questionBcustom.id },
    })
    report('SPOOF: A1→answer con questionId de B DENIED (403 + sin respuesta creada)',
      r.status === 403 && respCount === 0)
    // Legítimo: A1 responde su propia pregunta → PASS
    const rOk = await api(tokenCandA1, 'POST', '/api/evaluations', {
      sessionId: evalA.session.id, action: 'answer', questionId: evalA.question.id, value: '4', numericValue: 4,
    })
    report('SPOOF: A1→answer con questionId propio PASS', rOk.status === 200)
  }

  // ============================================================
  console.log('=== REGRESSION: full evaluation flow (create→start→answer→next→complete) ===')

  async function fullFlow(token: string, positionId: string, templates: { qIds: string[] }[], companyId: string) {
    // create-session
    const r1 = await api(token, 'POST', '/api/evaluations', { action: 'create-session', positionId })
    if (r1.status !== 201) return { ok: false, detail: `create-session ${r1.status}` }
    const sessionId = (r1.json.session as { id: string }).id
    // start
    const r2 = await api(token, 'POST', '/api/evaluations', { sessionId, action: 'start' })
    if (r2.status !== 200) return { ok: false, detail: `start ${r2.status}` }
    // answer step 1
    for (const qId of templates[0].qIds) {
      const r = await api(token, 'POST', '/api/evaluations', { sessionId, action: 'answer', questionId: qId, value: '4', numericValue: 4 })
      if (r.status !== 200) return { ok: false, detail: `answer ${r.status}` }
    }
    // next-step
    const r3 = await api(token, 'POST', '/api/evaluations', { sessionId, action: 'next-step' })
    if (r3.status !== 200) return { ok: false, detail: `next-step ${r3.status}` }
    // answer step 2 (knowledge: value = option index)
    for (const qId of templates[1].qIds) {
      const r = await api(token, 'POST', '/api/evaluations', { sessionId, action: 'answer', questionId: qId, value: '1', numericValue: null })
      if (r.status !== 200) return { ok: false, detail: `answer2 ${r.status}` }
    }
    // next-step → auto-complete (nextStep > templates.length)
    const r4 = await api(token, 'POST', '/api/evaluations', { sessionId, action: 'next-step' })
    if (r4.status !== 200 || !(r4.json as { result?: unknown }).result) return { ok: false, detail: `auto-complete ${r4.status}` }
    const session = await db.evaluationSession.findUnique({ where: { id: sessionId } })
    const result = await db.evaluationResult.findFirst({ where: { sessionId } })
    // Expected: OPENNESS 4→75, NEUROTICISM reverse 4→2→25 → BF avg 50;
    // KNOWLEDGE correct → 100. Two sections → (50+100)/2 = 75.
    const expectedOverall = 75
    return {
      ok: session?.status === 'COMPLETED' && result !== null && result.companyId === companyId &&
        result.overallScore === expectedOverall && result.recommendation === 'PERFIL_PARCIAL',
      detail: `status=${session?.status}, result=${!!result}, score=${result?.overallScore}`,
      sessionId,
    }
  }

  // B-side flow position + templates
  const flowT1B = await db.evaluationTemplate.create({ data: { name: 'FlowB-Psi', type: 'PSICOMETRICA', order: 1, positionId: positionB2.id, companyId: companyB.id } })
  const flowQ1B = await db.question.create({ data: { text: 'FlowB-Q1', type: 'LIKERT', category: 'OPENNESS', order: 1, evaluationTemplateId: flowT1B.id } })
  const flowQ2B = await db.question.create({ data: { text: 'FlowB-Q2', type: 'LIKERT', category: 'NEUROTICISM', order: 2, reverseScored: true, evaluationTemplateId: flowT1B.id } })
  const flowT2B = await db.evaluationTemplate.create({ data: { name: 'FlowB-Con', type: 'CONOCIMIENTOS', order: 2, positionId: positionB2.id, companyId: companyB.id } })
  const flowQ3B = await db.question.create({ data: { text: 'FlowB-Q3', type: 'MULTIPLE_CHOICE', category: 'KNOWLEDGE', order: 1, options: '["a","b","c"]', correctAnswer: 1, evaluationTemplateId: flowT2B.id } })

  {
    const flow = await fullFlow(tokenCandB1, positionB2.id, [{ qIds: [flowQ1B.id, flowQ2B.id] }, { qIds: [flowQ3B.id] }], companyB.id)
    report('FLOW B: CANDIDATO B1 flujo completo (create→start→answer→next→auto-complete) OK', flow.ok, flow.detail)
  }

  // A-side flow
  const flowT1A = await db.evaluationTemplate.create({ data: { name: 'FlowA-Psi', type: 'PSICOMETRICA', order: 1, positionId: positionA2.id, companyId: companyA.id } })
  const flowQ1A = await db.question.create({ data: { text: 'FlowA-Q1', type: 'LIKERT', category: 'OPENNESS', order: 1, evaluationTemplateId: flowT1A.id } })
  const flowQ2A = await db.question.create({ data: { text: 'FlowA-Q2', type: 'LIKERT', category: 'NEUROTICISM', order: 2, reverseScored: true, evaluationTemplateId: flowT1A.id } })
  const flowT2A = await db.evaluationTemplate.create({ data: { name: 'FlowA-Con', type: 'CONOCIMIENTOS', order: 2, positionId: positionA2.id, companyId: companyA.id } })
  const flowQ3A = await db.question.create({ data: { text: 'FlowA-Q3', type: 'MULTIPLE_CHOICE', category: 'KNOWLEDGE', order: 1, options: '["a","b","c"]', correctAnswer: 1, evaluationTemplateId: flowT2A.id } })

  {
    const flow = await fullFlow(tokenCandA1, positionA2.id, [{ qIds: [flowQ1A.id, flowQ2A.id] }, { qIds: [flowQ3A.id] }], companyA.id)
    report('FLOW A: CANDIDATO A1 flujo completo OK', flow.ok, flow.detail)
  }

  // ============================================================
  console.log('=== REGRESSION: invite + questions CRUD (RH) ===')
  {
    // RH A: create invitation → list → delete (own)
    const r1 = await api(tokenRhA, 'POST', '/api/invite', { candidateName: 'Reg Inv', phone: '+5215500000003', positionId: positionA.id })
    const invId = ((r1.json.invitation as { id?: string }) || {}).id
    const r2 = await api(tokenRhA, 'GET', '/api/invite')
    const invs = (r2.json.invitations as { id: string }[]) || []
    const r3 = await api(tokenRhA, 'DELETE', `/api/invite?id=${invId}`)
    const gone = await db.candidateInvitation.findUnique({ where: { id: invId || 'x' } })
    report('REG invite: crear→listar→eliminar (RH A) OK',
      r1.status === 201 && invs.some(i => i.id === invId) && r3.status === 200 && gone === null)
  }
  {
    // RH A: question CRUD propio
    const r1 = await api(tokenRhA, 'POST', '/api/questions', { templateId: evalA.template.id, text: `CRUD-${SUFFIX}`, type: 'LIKERT', category: 'TEAMWORK' })
    const qId = ((r1.json.question as { id?: string }) || {}).id
    const r2 = await api(tokenRhA, 'PUT', '/api/questions', { questionId: qId, text: `CRUD2-${SUFFIX}` })
    const r3 = await api(tokenRhA, 'DELETE', `/api/questions?questionId=${qId}`)
    const gone = await db.question.findUnique({ where: { id: qId || 'x' } })
    report('REG questions: crear→editar→eliminar (RH A, pregunta propia) OK',
      r1.status === 201 && r2.status === 200 && r3.status === 200 && gone === null)
  }

  // ============================================================
  console.log('=== REGRESSION: SA aggregate + derived tenant (evaluations) ===')
  {
    // SA sin target completa la sesión B del chain (derivación de tenant del recurso)
    const r = await api(tokenSA, 'POST', '/api/evaluations', { sessionId: evalB.session.id, action: 'complete' })
    const log = await db.auditLog.findFirst({
      where: { actorId: sa.id, action: 'ADMIN_ACCESS', resource: 'EvaluationSession' },
      orderBy: { createdAt: 'desc' },
    })
    const details = log?.details ? JSON.parse(log.details) : {}
    const result = await db.evaluationResult.findFirst({ where: { sessionId: evalB.session.id } })
    report('SA aggregate: complete(sesión B) derivando tenant OK + AuditLog + resultado companyId=B',
      r.status === 200 && result?.companyId === companyB.id &&
      log !== null && details.impersonation === true && details.targetCompanyId === companyB.id)
  }

  // ============================================================
  console.log('=== REGRESSION: D.2.2 modules (login, candidates, users, consent, positions, arco) ===')
  {
    const res = await fetch(`${BASE}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: rhA.email, password: 'testpass123' }),
    })
    report('REG 1: login RH A OK', res.status === 200)
  }
  {
    const r = await api(tokenRhA, 'GET', '/api/candidates')
    report('REG 2: candidates (D.2.2) OK', r.status === 200)
  }
  {
    const r = await api(tokenRhA, 'GET', '/api/users')
    report('REG 3: users (D.2.2) OK', r.status === 200)
  }
  {
    const r = await api(tokenRhA, 'GET', '/api/positions')
    report('REG 4: positions (piloto D.2) OK', r.status === 200)
  }
  {
    const r = await api(tokenRhA, 'GET', '/api/arco')
    report('REG 5: arco (piloto D.2) OK', r.status === 200)
  }
  {
    // Consent grant → withdraw → re-grant (D.2.2) con candidato A2
    const r1 = await api(tokenCandA2, 'POST', '/api/consent', { consentOption: 'FULL', anonymousStats: false, confirmedReading: true })
    const r2 = await api(tokenCandA2, 'PATCH', '/api/consent', {})
    const r3 = await api(tokenCandA2, 'POST', '/api/consent', { consentOption: 'FULL', anonymousStats: false, confirmedReading: true })
    const a2 = await db.user.findUnique({ where: { id: candA2.id } })
    report('REG 6: consent autorizar→retirar→re-autorizar OK',
      r1.status === 200 && r2.status === 200 && r3.status === 200 && a2?.consentGiven === true)
  }

  // ============================================================
  console.log('=== CONCURRENCY: interleaved A/B ===')
  {
    let interleaveOk = true
    for (let i = 0; i < 4 && interleaveOk; i++) {
      const ra = await api(tokenRhA, 'GET', `/api/evaluations?sessionId=${evalA.session.id}`)
      const sa1 = ra.json.session as { companyId?: string } | undefined
      const rb = await api(tokenRhB, 'GET', `/api/evaluations?sessionId=${evalB.session.id}`)
      const sb = rb.json.session as { companyId?: string } | undefined
      if (!(ra.status === 200 && sa1?.companyId === companyA.id)) interleaveOk = false
      if (!(rb.status === 200 && sb?.companyId === companyB.id)) interleaveOk = false
    }
    report('CONCURRENCY A: 8 peticiones intercaladas A/B sin contaminación', interleaveOk)

    const rounds = 6
    const pairResults = await Promise.all(
      Array.from({ length: rounds }, () =>
        Promise.all([
          api(tokenRhA, 'GET', `/api/evaluations?sessionId=${evalA.session.id}`),
          api(tokenRhB, 'GET', `/api/evaluations?sessionId=${evalB.session.id}`),
        ])
      )
    )
    let contaminations = 0
    let envErrors = 0
    let cleanSuccesses = 0
    for (const [ra, rb] of pairResults) {
      const sa1 = ra.json.session as { companyId?: string } | undefined
      const sb = rb.json.session as { companyId?: string } | undefined
      const aLeak = ra.status === 200 && sa1?.companyId !== companyA.id
      const bLeak = rb.status === 200 && sb?.companyId !== companyB.id
      if (aLeak || bLeak) contaminations++
      if (ra.status === 200 && rb.status === 200 && sa1?.companyId === companyA.id && sb?.companyId === companyB.id) cleanSuccesses++
      else if (!aLeak && !bLeak) envErrors++
    }
    report('CONCURRENCY B: 0 contaminaciones cross-tenant bajo paralelismo', contaminations === 0,
      `(clean=${cleanSuccesses}, envErrors(SQLite timeouts, fail-closed)=${envErrors})`)
    console.log(`  [info] parallel probe: clean=${cleanSuccesses}, sqliteEnvTimeouts=${envErrors}, contaminations=${contaminations}`)
  }

  // ============================================================
  console.log('=== CLEANUP ===')
  await cleanupByCompanyPrefix('D23-TEST-')
  if (saIsSynthetic) {
    await db.user.delete({ where: { id: sa.id } })
  }
  console.log('[cleanup] synthetic tenants removed (AuditLog entries kept as evidence)')

  // ============================================================
  console.log('\n========================================')
  console.log(`RESULT: ${passed} PASS / ${failed} FAIL`)
  if (failures.length) {
    console.log('Failures:')
    failures.forEach(f => console.log(`  - ${f}`))
    process.exit(1)
  }
  process.exit(0)
}

main().catch(e => {
  console.error('FATAL:', e)
  process.exit(1)
})
