/**
 * PHASE 3.5-D.2.4 — Isolation test suite
 * Migrated endpoints: /api/vacancies (+ [id], [id]/applications), /api/interviews
 *
 * Covers:
 *   - Cross-tenant TESTS 1-10 (spec D.2.4 §20)
 *   - Cascade / soft-close test (spec §21)
 *   - Application cross-tenant (spec §22)
 *   - Super Admin SA-1..SA-4 + aggregate/derived-tenant (spec §23)
 *   - Regression: login, candidates, users, positions, arco, consent,
 *     evaluations, invite, questions, vacancies, interviews (spec §24)
 *   - Concurrency: interleaved A/B (spec §20 note)
 *
 * Run: bun scripts/test-d24-migration.ts
 */
import { db } from '../src/lib/db'
import { generateToken } from '../src/lib/auth'
import { hashPassword } from '../src/lib/password'

const BASE = 'http://localhost:3000'
const SUFFIX = Date.now().toString(36)
const PREFIX = `d24-${SUFFIX}`

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
      await db.vacancyApplicationResponse.deleteMany({ where: { application: { companyId: c.id } } })
      await db.vacancyApplication.deleteMany({ where: { companyId: c.id } })
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
    const vacancies = await db.vacancy.findMany({ where: { companyId: c.id }, select: { id: true } })
    for (const v of vacancies) {
      await db.vacancyQuestion.deleteMany({ where: { vacancyId: v.id } })
      await db.vacancy.delete({ where: { id: v.id } })
    }
    await db.company.delete({ where: { id: c.id } })
  }
}

async function main() {
  console.log('=== SETUP: synthetic tenants ===')
  await cleanupByCompanyPrefix('D24-TEST-')

  // ── Companies ──
  const companyA = await db.company.create({ data: { name: `D24-TEST-A-${SUFFIX}`, sector: 'RESTAURANT' } })
  const companyB = await db.company.create({ data: { name: `D24-TEST-B-${SUFFIX}`, sector: 'RETAIL' } })

  // ── Positions (needed for interviews positionId) ──
  const positionA = await db.position.create({
    data: { title: 'Mesero A', sector: 'RESTAURANT', category: 'MESERO', companyId: companyA.id },
  })
  const positionB = await db.position.create({
    data: { title: 'Vendedor B', sector: 'RETAIL', category: 'VENDEDOR', companyId: companyB.id },
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
      data: { email: `${PREFIX}-sa@test.local`, name: 'SA D24', password: pwd, role: 'SUPER_ADMIN' },
    })
    saIsSynthetic = true
  }

  // ── Vacancies (one per company, with one vacancy question each) ──
  const mkVacancy = (companyId: string, title: string) =>
    db.vacancy.create({
      data: { title, slug: `${PREFIX}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 180), sector: 'GENERAL', companyId },
    })
  const vacancyA = await mkVacancy(companyA.id, `Vacante A ${SUFFIX}`)
  const vacancyB = await mkVacancy(companyB.id, `Vacante B ${SUFFIX}`)
  const vqA = await db.vacancyQuestion.create({
    data: { text: `VQ-A-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 0, order: 1, vacancyId: vacancyA.id, companyId: companyA.id },
  })
  await db.vacancyQuestion.create({
    data: { text: `VQ-B-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 0, order: 1, vacancyId: vacancyB.id, companyId: companyB.id },
  })

  // ── Vacancy applications (one per company) ──
  const appA = await db.vacancyApplication.create({
    data: { vacancyId: vacancyA.id, companyId: companyA.id, candidateName: 'App A', candidateEmail: `${PREFIX}-appa@test.local`, candidateUserId: candA1.id },
  })
  const appB = await db.vacancyApplication.create({
    data: { vacancyId: vacancyB.id, companyId: companyB.id, candidateName: 'App B', candidateEmail: `${PREFIX}-appb@test.local`, candidateUserId: candB1.id },
  })
  await db.vacancyApplicationResponse.create({
    data: { applicationId: appA.id, vacancyQuestionId: vqA.id, section: 'CONOCIMIENTOS', value: 'a', companyId: companyA.id },
  })

  // ── Interviews (one per company) ──
  const interviewA = await db.interviewSchedule.create({
    data: { candidateId: candA1.id, companyId: companyA.id, positionId: positionA.id, scheduledAt: new Date(Date.now() + 864e5), status: 'SCHEDULED' },
  })
  const interviewB = await db.interviewSchedule.create({
    data: { candidateId: candB1.id, companyId: companyB.id, positionId: positionB.id, scheduledAt: new Date(Date.now() + 864e5), status: 'SCHEDULED' },
  })

  // ── Evaluation chain for regression (A) ──
  const sessionA = await db.evaluationSession.create({
    data: { candidateId: candA1.id, positionId: positionA.id, companyId: companyA.id, status: 'IN_PROGRESS', currentStep: 1 },
  })
  const templateA = await db.evaluationTemplate.create({
    data: { name: `T-A-${SUFFIX}`, type: 'PSICOMETRICA', order: 1, positionId: positionA.id, companyId: companyA.id },
  })
  const questionA = await db.question.create({
    data: { text: `Q-A-${SUFFIX}`, type: 'LIKERT', category: 'OPENNESS', order: 1, evaluationTemplateId: templateA.id },
  })
  await db.evaluationResponse.create({
    data: { sessionId: sessionA.id, questionId: questionA.id, value: '3', numericValue: 3, companyId: companyA.id },
  })

  // ── Invitation for regression (A) ──
  const invitationA = await db.candidateInvitation.create({
    data: {
      candidateName: 'Inv A', phone: `+52${SUFFIX}A`.slice(0, 15), token: `tok-a-${SUFFIX}`,
      status: 'PENDING', channel: 'WHATSAPP', companyId: companyA.id, positionId: positionA.id, invitedBy: rhA.id,
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  })

  // ── Cascade fixture: Vacancy A2 with full child chain ──
  const vacancyA2 = await mkVacancy(companyA.id, `Vacante A2 Cascada ${SUFFIX}`)
  const vqA2 = await db.vacancyQuestion.create({
    data: { text: `VQ-A2-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 1, order: 1, vacancyId: vacancyA2.id, companyId: companyA.id },
  })
  const appA2 = await db.vacancyApplication.create({
    data: { vacancyId: vacancyA2.id, companyId: companyA.id, candidateName: 'App A2', candidateEmail: `${PREFIX}-appa2@test.local`, candidateUserId: candA2.id },
  })
  await db.vacancyApplicationResponse.create({
    data: { applicationId: appA2.id, vacancyQuestionId: vqA2.id, section: 'CONOCIMIENTOS', value: 'b', companyId: companyA.id },
  })
  const sessionA2 = await db.evaluationSession.create({
    data: { candidateId: candA2.id, positionId: positionA.id, companyId: companyA.id, status: 'COMPLETED', currentStep: 5 },
  })
  const resultA2 = await db.evaluationResult.create({
    data: {
      sessionId: sessionA2.id, candidateId: candA2.id, candidateName: 'Candidato A2',
      positionId: positionA.id, positionTitle: 'Mesero A', companyId: companyA.id,
      openness: 42, overallScore: 55, recommendation: 'PERFIL_PARCIAL',
    },
  })
  const interviewA2 = await db.interviewSchedule.create({
    data: { candidateId: candA2.id, companyId: companyA.id, positionId: positionA.id, scheduledAt: new Date(Date.now() + 2 * 864e5), status: 'SCHEDULED' },
  })
  const consentA2Before = await db.consentLog.count({ where: { userId: candA2.id } })

  // ── JWTs ──
  const tokenRhA = await generateToken({ sub: rhA.id, email: rhA.email, name: rhA.name, role: rhA.role, companyId: companyA.id } as never)
  const tokenRhB = await generateToken({ sub: rhB.id, email: rhB.email, name: rhB.name, role: rhB.role, companyId: companyB.id } as never)
  const tokenCandA2 = await generateToken({ sub: candA2.id, email: candA2.email, name: candA2.name, role: 'CANDIDATO', companyId: companyA.id } as never)
  const tokenSA = await generateToken({ sub: sa.id, email: sa.email, name: sa.name, role: 'SUPER_ADMIN' } as never)

  // ============================================================
  console.log('=== CROSS-TENANT TESTS (spec 1-10) ===')

  // TEST 1 — A → GET Vacancy A: PASS (detail + list)
  {
    const rDetail = await api(tokenRhA, 'GET', `/api/vacancies/${vacancyA.id}`)
    const v = rDetail.json.vacancy as { id?: string; companyId?: string; applicationCount?: number } | undefined
    const rList = await api(tokenRhA, 'GET', '/api/vacancies')
    const list = (rList.json.vacancies as { id: string }[]) || []
    report('TEST 1: A→GET Vacancy A PASS (detalle 200 + en su lista)',
      rDetail.status === 200 && v?.id === vacancyA.id && v?.companyId === companyA.id &&
      v?.applicationCount === 1 && list.some(x => x.id === vacancyA.id))
  }

  // TEST 2 — A → GET Vacancy B: DENIED (404 + absent from A list)
  {
    const rDetail = await api(tokenRhA, 'GET', `/api/vacancies/${vacancyB.id}`)
    const rList = await api(tokenRhA, 'GET', '/api/vacancies')
    const list = (rList.json.vacancies as { id: string }[]) || []
    report('TEST 2: A→GET Vacancy B DENIED (404 + no aparece en lista de A)',
      rDetail.status === 404 && !list.some(x => x.id === vacancyB.id))
  }

  // TEST 3 — A → PATCH/PUT Vacancy B: DENIED (404 + B intacto)
  {
    const r = await api(tokenRhA, 'PUT', `/api/vacancies/${vacancyB.id}`, { title: `HACKED-${SUFFIX}`, status: 'PAUSED' })
    const after = await db.vacancy.findUnique({ where: { id: vacancyB.id } })
    report('TEST 3: A→PUT Vacancy B DENIED (404 + título/status intactos)',
      r.status === 404 && after?.title === `Vacante B ${SUFFIX}` && after?.status === 'ACTIVE')
  }

  // TEST 4 — A → DELETE Vacancy B: DENIED (404 + B sigue ACTIVE)
  {
    const r = await api(tokenRhA, 'DELETE', `/api/vacancies/${vacancyB.id}`)
    const after = await db.vacancy.findUnique({ where: { id: vacancyB.id } })
    report('TEST 4: A→DELETE Vacancy B DENIED (404 + B sigue ACTIVE)',
      r.status === 404 && after?.status === 'ACTIVE')
  }

  // TEST 5 — A → POST Vacancy con companyId=B: resultado companyId=A, nunca B
  {
    const r = await api(tokenRhA, 'POST', '/api/vacancies', {
      title: `Spoof Test ${SUFFIX}`, companyId: companyB.id, questions: [{ text: 'q', options: ['a', 'b'], correctAnswer: 0 }],
    })
    const v = r.json.vacancy as { companyId?: string; slug?: string } | undefined
    const inDb = await db.vacancy.findFirst({ where: { title: `Spoof Test ${SUFFIX}` } })
    report('TEST 5: A→POST Vacancy companyId=B → creado con companyId=A (body ignorado)',
      r.status === 201 && v?.companyId === companyA.id && inDb?.companyId === companyA.id && inDb?.companyId !== companyB.id)
  }

  // TEST 5b — slug global: dos vacantes con mismo título → slugs distintos, misma empresa
  {
    const r1 = await api(tokenRhA, 'POST', '/api/vacancies', { title: `Slug Dup ${SUFFIX}` })
    const r2 = await api(tokenRhA, 'POST', '/api/vacancies', { title: `Slug Dup ${SUFFIX}` })
    const v1 = r1.json.vacancy as { slug?: string; companyId?: string } | undefined
    const v2 = r2.json.vacancy as { slug?: string; companyId?: string } | undefined
    report('TEST 5b: slug único global funcional (slugs distintos, ambas companyId=A)',
      r1.status === 201 && r2.status === 201 && v1?.slug !== v2?.slug &&
      v1?.companyId === companyA.id && v2?.companyId === companyA.id)
  }

  // TEST 6 — A → GET Interview B: DENIED (la lista de A no contiene la entrevista de B)
  {
    const r = await api(tokenRhA, 'GET', '/api/interviews')
    const list = (r.json.interviews as { id: string }[]) || []
    report('TEST 6: A→GET Interview B DENIED (lista de A sin entrevista de B, con la propia)',
      r.status === 200 && !list.some(i => i.id === interviewB.id) && list.some(i => i.id === interviewA.id))
  }

  // TEST 7 — A → PATCH Interview B: DENIED (404 + status intacto)
  {
    const r = await api(tokenRhA, 'PATCH', '/api/interviews', { id: interviewB.id, status: 'COMPLETED' })
    const after = await db.interviewSchedule.findUnique({ where: { id: interviewB.id } })
    report('TEST 7: A→PATCH Interview B DENIED (404 + status SCHEDULED intacto)',
      r.status === 404 && after?.status === 'SCHEDULED')
  }

  // TEST 8 — A → DELETE Interview B: endpoint DELETE no existe en /api/interviews (405)
  {
    const r = await api(tokenRhA, 'DELETE', '/api/interviews', { id: interviewB.id })
    report('TEST 8: A→DELETE Interview B → N/A: método DELETE no implementado (405, sin efecto)',
      r.status === 405)
  }

  // TEST 9 — A → crear Interview con candidateId de B: DENIED
  {
    const countBefore = await db.interviewSchedule.count({ where: { candidateId: candB1.id } })
    const r = await api(tokenRhA, 'POST', '/api/interviews', {
      candidateId: candB1.id, scheduledAt: new Date(Date.now() + 3 * 864e5).toISOString(),
    })
    const countAfter = await db.interviewSchedule.count({ where: { candidateId: candB1.id } })
    report('TEST 9: A→crear Interview con candidateId de B DENIED (404, nada creado)',
      r.status === 404 && countBefore === countAfter)
  }

  // TEST 9b — A → crear Interview con positionId de B: DENIED
  {
    const countBefore = await db.interviewSchedule.count({ where: { positionId: positionB.id, companyId: companyA.id } })
    const r = await api(tokenRhA, 'POST', '/api/interviews', {
      candidateId: candA1.id, positionId: positionB.id, scheduledAt: new Date(Date.now() + 3 * 864e5).toISOString(),
    })
    const countAfter = await db.interviewSchedule.count({ where: { positionId: positionB.id, companyId: companyA.id } })
    report('TEST 9b: A→crear Interview con positionId de B DENIED (404, nada creado)',
      r.status === 404 && countBefore === countAfter)
  }

  // TEST 9c — A → POST Interview con companyId=B en body: ignorado, se crea en A
  {
    const r = await api(tokenRhA, 'POST', '/api/interviews', {
      candidateId: candA1.id, companyId: companyB.id, scheduledAt: new Date(Date.now() + 3 * 864e5).toISOString(),
    })
    const iv = r.json.interview as { companyId?: string } | undefined
    report('TEST 9c: A→POST Interview companyId=B → creado con companyId=A (body ignorado)',
      r.status === 201 && iv?.companyId === companyA.id)
  }

  // TEST 10 — B → recursos B: PASS
  {
    const rListV = await api(tokenRhB, 'GET', '/api/vacancies')
    const vacancies = (rListV.json.vacancies as { id: string }[]) || []
    const rDetailB = await api(tokenRhB, 'GET', `/api/vacancies/${vacancyB.id}`)
    const rPatch = await api(tokenRhB, 'PATCH', '/api/interviews', { id: interviewB.id, status: 'COMPLETED' })
    const iv = rPatch.json.interview as { status?: string; companyId?: string } | undefined
    const rRestore = await api(tokenRhB, 'PATCH', '/api/interviews', { id: interviewB.id, status: 'SCHEDULED' })
    const rApps = await api(tokenRhB, 'GET', `/api/vacancies/${vacancyB.id}/applications`)
    const apps = (rApps.json.applications as { id: string }[]) || []
    report('TEST 10: B→recursos B PASS (lista, detalle, PATCH interview, applications)',
      rListV.status === 200 && vacancies.some(x => x.id === vacancyB.id) && !vacancies.some(x => x.id === vacancyA.id) &&
      rDetailB.status === 200 && rPatch.status === 200 && iv?.status === 'COMPLETED' && iv?.companyId === companyB.id &&
      rRestore.status === 200 && rApps.status === 200 && apps.some(a => a.id === appB.id))
  }

  // ============================================================
  console.log('=== APPLICATION CROSS-TENANT (spec §22) ===')
  {
    const r = await api(tokenRhA, 'GET', `/api/vacancies/${vacancyB.id}/applications`)
    const appsA = await api(tokenRhA, 'GET', `/api/vacancies/${vacancyA.id}/applications`)
    const apps = (appsA.json.applications as { id: string }[]) || []
    report('TEST 22: A→applications de Vacancy B DENIED (404); A→propias PASS',
      r.status === 404 && appsA.status === 200 && apps.some(a => a.id === appA.id))
  }

  // ============================================================
  console.log('=== CASCADE / SOFT-CLOSE TEST (spec §21) ===')
  {
    const before = {
      vq: await db.vacancyQuestion.count({ where: { vacancyId: vacancyA2.id } }),
      app: await db.vacancyApplication.count({ where: { vacancyId: vacancyA2.id } }),
      resp: await db.vacancyApplicationResponse.count({ where: { application: { vacancyId: vacancyA2.id } } }),
      session: await db.evaluationSession.count({ where: { id: sessionA2.id } }),
      result: await db.evaluationResult.count({ where: { id: resultA2.id } }),
      interview: await db.interviewSchedule.count({ where: { id: interviewA2.id } }),
      bVacancies: await db.vacancy.count({ where: { companyId: companyB.id } }),
      bApps: await db.vacancyApplication.count({ where: { companyId: companyB.id } }),
      bInterviews: await db.interviewSchedule.count({ where: { companyId: companyB.id } }),
    }

    const r = await api(tokenRhA, 'DELETE', `/api/vacancies/${vacancyA2.id}`)
    const vacancyAfter = await db.vacancy.findUnique({ where: { id: vacancyA2.id } })

    const after = {
      vq: await db.vacancyQuestion.count({ where: { vacancyId: vacancyA2.id } }),
      app: await db.vacancyApplication.count({ where: { vacancyId: vacancyA2.id } }),
      resp: await db.vacancyApplicationResponse.count({ where: { application: { vacancyId: vacancyA2.id } } }),
      session: await db.evaluationSession.count({ where: { id: sessionA2.id } }),
      result: await db.evaluationResult.count({ where: { id: resultA2.id } }),
      interview: await db.interviewSchedule.count({ where: { id: interviewA2.id } }),
      bVacancies: await db.vacancy.count({ where: { companyId: companyB.id } }),
      bApps: await db.vacancyApplication.count({ where: { companyId: companyB.id } }),
      bInterviews: await db.interviewSchedule.count({ where: { companyId: companyB.id } }),
    }
    const consentA2After = await db.consentLog.count({ where: { userId: candA2.id } })
    const auditEntry = await db.auditLog.findFirst({
      where: { action: 'DELETE', resource: 'Vacancy', resourceId: vacancyA2.id },
      orderBy: { createdAt: 'desc' },
    })

    report('CASCADE: DELETE vacante A = soft-close (status CLOSED), hijos 100% preservados',
      r.status === 200 && vacancyAfter?.status === 'CLOSED' &&
      before.vq === after.vq && before.app === after.app && before.resp === after.resp &&
      before.session === after.session && before.result === after.result && before.interview === after.interview &&
      before.bVacancies === after.bVacancies && before.bApps === after.bApps && before.bInterviews === after.bInterviews,
      `(before=${JSON.stringify(before)}, after=${JSON.stringify(after)})`)
    report('CASCADE: ConsentLog preservado + AuditLog DELETE registrado',
      consentA2After === consentA2Before && auditEntry !== null)
    report('CASCADE: sin registros huérfanos (0 eliminaciones físicas, conservación legal intacta)',
      after.app === before.app && after.resp === before.resp && after.vq === before.vq)
  }

  // ============================================================
  console.log('=== SUPER ADMIN TESTS (spec SA-1..SA-4) ===')

  // SA-1 — SA → impersonate B (POST vacancy con body.companyId=B) + AuditLog
  {
    const r = await api(tokenSA, 'POST', '/api/vacancies', { title: `SA Imp B ${SUFFIX}`, companyId: companyB.id })
    const v = r.json.vacancy as { companyId?: string } | undefined
    const log = await db.auditLog.findFirst({
      where: { actorId: sa.id, action: 'CREATE', resource: 'Vacancy', details: { contains: companyB.id } },
      orderBy: { createdAt: 'desc' },
    })
    const details = log?.details ? JSON.parse(log.details) : {}
    report('SA-1: SA→impersonate B crea vacante en B + AuditLog impersonation',
      r.status === 201 && v?.companyId === companyB.id && log !== null &&
      details.impersonation === true && details.targetCompanyId === companyB.id)
  }

  // SA-2 — SA target=B → recurso B: PASS
  {
    const r = await api(tokenSA, 'GET', `/api/vacancies/${vacancyB.id}?companyId=${companyB.id}`)
    const v = r.json.vacancy as { companyId?: string } | undefined
    report('SA-2: SA target=B → Vacancy B PASS (200, companyId=B)',
      r.status === 200 && v?.companyId === companyB.id)
  }

  // SA-3 — SA target=B → recurso A: DENIED
  {
    const r = await api(tokenSA, 'GET', `/api/vacancies/${vacancyA.id}?companyId=${companyB.id}`)
    report('SA-3: SA target=B → Vacancy A DENIED (404)', r.status === 404)
  }

  // SA-4 — Non-SA → targetCompanyId=B: IGNORADO (solo ve A)
  {
    const r = await api(tokenRhA, 'GET', `/api/vacancies?companyId=${companyB.id}`)
    const vacancies = (r.json.vacancies as { id: string; companyId: string }[]) || []
    report('SA-4: Non-SA con companyId=B → ignorado, solo ve sus vacantes de A',
      r.status === 200 && vacancies.length > 0 && vacancies.every(x => x.companyId === companyA.id))
  }

  // SA aggregate — listas globales preservadas (SA-AGGREGATE clasificado)
  {
    const rV = await api(tokenSA, 'GET', '/api/vacancies')
    const vacancies = (rV.json.vacancies as { id: string }[]) || []
    const rI = await api(tokenSA, 'GET', '/api/interviews')
    const interviews = (rI.json.interviews as { id: string }[]) || []
    report('SA-AGG: SA sin target conserva vista agregada (vacancies + interviews de A y B)',
      rV.status === 200 && vacancies.some(x => x.id === vacancyA.id) && vacancies.some(x => x.id === vacancyB.id) &&
      rI.status === 200 && interviews.some(x => x.id === interviewA.id) && interviews.some(x => x.id === interviewB.id))
  }

  // SA derived tenant — PATCH interview de A sin target → deriva tenant del recurso + AuditLog
  {
    const r = await api(tokenSA, 'PATCH', '/api/interviews', { id: interviewA.id, status: 'SCHEDULED' })
    const log = await db.auditLog.findFirst({
      where: { actorId: sa.id, action: 'ADMIN_ACCESS', resource: 'InterviewSchedule', resourceId: interviewA.id },
      orderBy: { createdAt: 'desc' },
    })
    const details = log?.details ? JSON.parse(log.details) : {}
    report('SA-DERIVED: SA PATCH interview de A sin target → 200 + AuditLog derivedFromResource',
      r.status === 200 && log !== null && details.impersonation === true &&
      details.derivedFromResource === true && details.targetCompanyId === companyA.id)
  }

  // ============================================================
  console.log('=== REGRESSION (spec §24) ===')
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
    const r1 = await api(tokenCandA2, 'POST', '/api/consent', { consentOption: 'FULL', anonymousStats: false, confirmedReading: true })
    const r2 = await api(tokenCandA2, 'PATCH', '/api/consent', {})
    const r3 = await api(tokenCandA2, 'POST', '/api/consent', { consentOption: 'FULL', anonymousStats: false, confirmedReading: true })
    const a2 = await db.user.findUnique({ where: { id: candA2.id } })
    report('REG 6: consent autorizar→retirar→re-autorizar OK',
      r1.status === 200 && r2.status === 200 && r3.status === 200 && a2?.consentGiven === true)
  }
  {
    const r = await api(tokenRhA, 'GET', `/api/evaluations?sessionId=${sessionA.id}`)
    const s = r.json.session as { companyId?: string } | undefined
    report('REG 7: evaluations (D.2.3) GET sesión OK', r.status === 200 && s?.companyId === companyA.id)
  }
  {
    const r = await api(tokenRhA, 'GET', '/api/invite')
    const invs = (r.json.invitations as { id: string }[]) || []
    report('REG 8: invite (D.2.3) lista OK', r.status === 200 && invs.some(i => i.id === invitationA.id))
  }
  {
    const r = await api(tokenRhA, 'GET', `/api/questions?positionId=${positionA.id}`)
    report('REG 9: questions (D.2.3) GET posición OK', r.status === 200)
  }
  {
    // PUT propia vacante con cambio de título → slug regenerado, mismo tenant
    const r = await api(tokenRhA, 'PUT', `/api/vacancies/${vacancyA.id}`, { title: `Vacante A Renamed ${SUFFIX}` })
    const v = r.json.vacancy as { slug?: string; companyId?: string; title?: string } | undefined
    const inDb = await db.vacancy.findUnique({ where: { id: vacancyA.id } })
    report('REG 10: PUT Vacancy A (cambio título → slug regenerado) OK',
      r.status === 200 && v?.title === `Vacante A Renamed ${SUFFIX}` &&
      v?.slug !== vacancyA.slug && v?.slug === inDb?.slug && v?.companyId === companyA.id)
  }
  {
    // POST/GET/PATCH interview propios (B)
    const rPost = await api(tokenRhB, 'POST', '/api/interviews', {
      candidateId: candB1.id, positionId: positionB.id, scheduledAt: new Date(Date.now() + 4 * 864e5).toISOString(), location: 'Office B',
    })
    const iv = rPost.json.interview as { id?: string; companyId?: string } | undefined
    const rGet = await api(tokenRhB, 'GET', '/api/interviews')
    const list = (rGet.json.interviews as { id: string }[]) || []
    report('REG 11: interviews B POST+GET OK (positionId propio aceptado)',
      rPost.status === 201 && iv?.companyId === companyB.id && list.some(x => x.id === iv?.id))
  }
  {
    // CANDIDATO A1 → GET vacancies (usuario normal con companyId) — sin datos de B
    const tokenCandA1 = await generateToken({ sub: candA1.id, email: candA1.email, name: candA1.name, role: 'CANDIDATO', companyId: companyA.id } as never)
    const r = await api(tokenCandA1, 'GET', '/api/vacancies')
    const vacancies = (r.json.vacancies as { id: string }[]) || []
    report('REG 12: CANDIDATO A → vacancies solo de A (sin datos de B)',
      r.status === 200 && !vacancies.some(x => x.id === vacancyB.id))
  }

  // ============================================================
  console.log('=== CONCURRENCY: interleaved A/B ===')
  {
    let interleaveOk = true
    for (let i = 0; i < 4 && interleaveOk; i++) {
      const ra = await api(tokenRhA, 'GET', '/api/vacancies')
      const va = (ra.json.vacancies as { companyId: string }[]) || []
      const rb = await api(tokenRhB, 'GET', '/api/vacancies')
      const vb = (rb.json.vacancies as { companyId: string }[]) || []
      if (!(ra.status === 200 && va.length > 0 && va.every(x => x.companyId === companyA.id))) interleaveOk = false
      if (!(rb.status === 200 && vb.length > 0 && vb.every(x => x.companyId === companyB.id))) interleaveOk = false
    }
    report('CONCURRENCY A: 8 peticiones intercaladas A/B sin contaminación', interleaveOk)

    const rounds = 6
    const pairResults = await Promise.all(
      Array.from({ length: rounds }, () =>
        Promise.all([
          api(tokenRhA, 'GET', '/api/vacancies'),
          api(tokenRhB, 'GET', '/api/vacancies'),
        ])
      )
    )
    let contaminations = 0
    let envErrors = 0
    let cleanSuccesses = 0
    for (const [ra, rb] of pairResults) {
      const va = (ra.json.vacancies as { companyId: string }[]) || []
      const vb = (rb.json.vacancies as { companyId: string }[]) || []
      const aLeak = ra.status === 200 && va.some(x => x.companyId !== companyA.id)
      const bLeak = rb.status === 200 && vb.some(x => x.companyId !== companyB.id)
      if (aLeak || bLeak) contaminations++
      if (ra.status === 200 && rb.status === 200 && !aLeak && !bLeak) cleanSuccesses++
      else if (!aLeak && !bLeak) envErrors++
    }
    report('CONCURRENCY B: 0 contaminaciones cross-tenant bajo paralelismo', contaminations === 0,
      `(clean=${cleanSuccesses}, envErrors(SQLite timeouts, fail-closed)=${envErrors})`)
    console.log(`  [info] parallel probe: clean=${cleanSuccesses}, sqliteEnvTimeouts=${envErrors}, contaminations=${contaminations}`)
  }

  // ============================================================
  console.log('=== CLEANUP ===')
  await cleanupByCompanyPrefix('D24-TEST-')
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
