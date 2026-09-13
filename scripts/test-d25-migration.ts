/**
 * PHASE 3.5-D.2.5 — Isolation test suite
 * Migrated endpoints: /api/vacancies/[id]/questions, /api/vacancies/[id]/generate-questions
 *
 * Covers:
 *   - Cross-tenant TESTS 1-10 (spec D.2.5 FASE 9)
 *   - Functional CRUD on vacancy questions (data-access equivalence)
 *   - AI generation test + snapshot (spec FASE 10)
 *   - Candidate access rule tests (spec FASE 11)
 *
 * Run: bun scripts/test-d25-migration.ts
 */
import { db } from '../src/lib/db'
import { generateToken } from '../src/lib/auth'
import { hashPassword } from '../src/lib/password'
import { writeFileSync } from 'fs'

const BASE = 'http://localhost:3000'
const SUFFIX = Date.now().toString(36)
const PREFIX = `d25-${SUFFIX}`
const CLEANUP_PREFIX = 'D25-TEST-'

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

// AuditLog helper: prune test-generated admin-access logs at the end
async function cleanupAuditLogs(actorId: string) {
  await db.auditLog.deleteMany({ where: { actorId, details: { contains: SUFFIX } } })
}

async function main() {
  console.log('=== SETUP: synthetic tenants ===')
  await cleanupByCompanyPrefix(CLEANUP_PREFIX)

  // ── Companies ──
  const companyA = await db.company.create({ data: { name: `${CLEANUP_PREFIX}A-${SUFFIX}`, sector: 'RESTAURANT' } })
  const companyB = await db.company.create({ data: { name: `${CLEANUP_PREFIX}B-${SUFFIX}`, sector: 'RETAIL' } })

  // ── Positions (candidate rule tests + regression) ──
  const positionA = await db.position.create({
    data: { title: `Mesero A ${SUFFIX}`, sector: 'RESTAURANT', category: 'MESERO', companyId: companyA.id, active: true },
  })
  const positionB = await db.position.create({
    data: { title: `Vendedor B ${SUFFIX}`, sector: 'RETAIL', category: 'VENDEDOR', companyId: companyB.id, active: true },
  })

  // ── Users ──
  const pwd = await hashPassword('testpass123')
  const rhA = await db.user.create({
    data: { email: `${PREFIX}-rh-a@test.local`, name: 'RH A', password: pwd, role: 'RH', companyId: companyA.id },
  })
  const mkCand = (email: string, name: string, companyId: string) =>
    db.user.create({
      data: {
        email, name, password: pwd, role: 'CANDIDATO', companyId,
        consentGiven: true, consentDate: new Date(), consentOption: 'FULL',
        consentConfirmed: true, consentVersion: '2026-02-v1',
      },
    })
  const candA = await mkCand(`${PREFIX}-cand-a@test.local`, 'Candidato A', companyA.id)

  // ── SA ──
  let sa = await db.user.findFirst({ where: { role: 'SUPER_ADMIN' }, orderBy: { createdAt: 'asc' } })
  let saIsSynthetic = false
  if (!sa) {
    sa = await db.user.create({
      data: { email: `${PREFIX}-sa@test.local`, name: 'SA D25', password: pwd, role: 'SUPER_ADMIN' },
    })
    saIsSynthetic = true
  }

  // ── Vacancies (one per company, with seeded questions) ──
  const mkVacancy = (companyId: string, title: string, sector = 'GENERAL') =>
    db.vacancy.create({
      data: {
        title,
        slug: `${PREFIX}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 180),
        sector,
        companyId,
        description: `Descripción ${title}`,
      },
    })
  const vacancyA = await mkVacancy(companyA.id, `Vacante A ${SUFFIX}`)
  const vacancyB = await mkVacancy(companyB.id, `Vacante B ${SUFFIX}`)
  const vqA1 = await db.vacancyQuestion.create({
    data: { text: `VQ-A1-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 0, order: 1, vacancyId: vacancyA.id, companyId: companyA.id },
  })
  const vqB1 = await db.vacancyQuestion.create({
    data: { text: `VQ-B1-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 0, order: 1, vacancyId: vacancyB.id, companyId: companyB.id },
  })
  const vqB2 = await db.vacancyQuestion.create({
    data: { text: `VQ-B2-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 1, order: 2, vacancyId: vacancyB.id, companyId: companyB.id },
  })

  // ── Tokens ──
  const tokenRhA = await generateToken({ sub: rhA.id, email: rhA.email, name: rhA.name, role: rhA.role, companyId: companyA.id } as never)
  const tokenCandA = await generateToken({ sub: candA.id, email: candA.email, name: candA.name, role: 'CANDIDATO', companyId: companyA.id } as never)
  const tokenSA = await generateToken({ sub: sa.id, email: sa.email, name: sa.name, role: 'SUPER_ADMIN' } as never)

  const qPath = (v: { id: string }) => `/api/vacancies/${v.id}/questions`
  const gPath = (v: { id: string }) => `/api/vacancies/${v.id}/generate-questions`

  // ════════════════════════════════════════════
  console.log('\n=== FASE 9: TESTS CROSS-TENANT (spec 1-10) ===')

  // TEST 1 — A → questions Vacancy A → PASS
  {
    const r = await api(tokenRhA, 'GET', qPath(vacancyA))
    const qs = (r.json.questions as Array<Record<string, unknown>>) || []
    report('TEST 1: A → questions Vacancy A → 200 + contenido propio',
      r.status === 200 && qs.length === 1 && qs[0].text === `VQ-A1-${SUFFIX}`,
      `status=${r.status} n=${qs.length}`)
  }

  // TEST 2 — A → questions Vacancy B → DENIED (404, sin leak)
  {
    const r = await api(tokenRhA, 'GET', qPath(vacancyB))
    report('TEST 2: A → questions Vacancy B → 404 (DENIED, sin leak)',
      r.status === 404 && !(r.json as { questions?: unknown }).questions,
      `status=${r.status} body=${JSON.stringify(r.json).slice(0, 80)}`)
  }

  // TEST 3 — A → generate questions Vacancy B → DENIED
  {
    const r = await api(tokenRhA, 'POST', gPath(vacancyB))
    const countAfter = await db.vacancyQuestion.count({ where: { vacancyId: vacancyB.id } })
    report('TEST 3: A → generate questions Vacancy B → 404 + 0 preguntas creadas',
      r.status === 404 && countAfter === 2,
      `status=${r.status} countB=${countAfter}`)
  }

  // TEST 4 — (adaptación) A → template B: N/A en estas subrutas (no acceden a
  // Question/EvaluationTemplate). Equivalente: A usa questionId de la Vacancy B
  // contra su propia Vacancy A → DENIED (questionId spoofing cross-vacancy).
  {
    const r = await api(tokenRhA, 'PUT', qPath(vacancyA), {
      questionId: vqB2.id, text: 'HACKED',
    })
    const still = await db.vacancyQuestion.findUnique({ where: { id: vqB2.id } })
    report('TEST 4 (adaptado): A → PUT con questionId de Vacancy B → 404 + B2 intacta',
      r.status === 404 && still?.text === `VQ-B2-${SUFFIX}`,
      `status=${r.status} b2=${still?.text}`)
  }

  // TEST 5 — A → modify question B → DENIED
  {
    const r1 = await api(tokenRhA, 'PUT', qPath(vacancyB), { questionId: vqB1.id, text: 'HACKED' })
    const still1 = await db.vacancyQuestion.findUnique({ where: { id: vqB1.id } })
    report('TEST 5a: A → PUT question B (via vacancy B) → 404 + B1 intacta',
      r1.status === 404 && still1?.text === `VQ-B1-${SUFFIX}`,
      `status=${r1.status} b1=${still1?.text}`)
    const r2 = await api(tokenRhA, 'PUT', qPath(vacancyB), { questionId: vqB2.id, text: 'HACKED' })
    report('TEST 5b: A → PUT question B2 (via vacancy B) → 404',
      r2.status === 404, `status=${r2.status}`)
  }

  // TEST 6 — A → delete question B → DENIED
  {
    const r = await api(tokenRhA, 'DELETE', `${qPath(vacancyB)}?questionId=${vqB1.id}`)
    const still = await db.vacancyQuestion.findUnique({ where: { id: vqB1.id } })
    report('TEST 6: A → DELETE question B → 404 + B1 sigue existiendo',
      r.status === 404 && !!still,
      `status=${r.status} exists=${!!still}`)
  }

  // TEST 7 — A → body.companyId=B → debe seguir A
  {
    const r1 = await api(tokenRhA, 'POST', qPath(vacancyA), {
      text: `SPOOF-7-${SUFFIX}`, options: ['x', 'y'], correctAnswer: 0, companyId: companyB.id,
    })
    const created = await db.vacancyQuestion.findFirst({
      where: { text: `SPOOF-7-${SUFFIX}` }, include: { vacancy: true },
    })
    report('TEST 7a: A → POST questions body.companyId=B → 201 + pregunta en empresa A',
      r1.status === 201 && created?.vacancy.companyId === companyA.id,
      `status=${r1.status} tenant=${created?.vacancy.companyId === companyA.id ? 'A' : 'OTRO'}`)
    // cleanup the created question
    if (created) await db.vacancyQuestion.delete({ where: { id: created.id } })

    const r2 = await api(tokenRhA, 'POST', gPath(vacancyA), { companyId: companyB.id })
    const aCount = await db.vacancyQuestion.count({ where: { vacancyId: vacancyA.id } })
    report('TEST 7b: A → POST generate body.companyId=B → 201 + preguntas en Vacancy A (tenant A)',
      r2.status === 201 && aCount >= 2,
      `status=${r2.status} countA=${aCount}`)
    // cleanup generated questions (keep seed)
    await db.vacancyQuestion.deleteMany({ where: { vacancyId: vacancyA.id, companyId: companyA.id, order: { gt: 1 } } })
  }

  // TEST 8 — A → targetCompanyId=B (query) → DENIED para usuario normal
  {
    const r = await api(tokenRhA, 'GET', `${qPath(vacancyB)}?companyId=${companyB.id}`)
    report('TEST 8: A (no-SA) → GET questions B ?companyId=B → 404 (target ignorado)',
      r.status === 404, `status=${r.status}`)
    const logs = await db.auditLog.count({
      where: { actorId: rhA.id, action: 'ADMIN_ACCESS', details: { contains: companyB.id } },
    })
    report('TEST 8b: no impersonation log para usuario normal', logs === 0, `logs=${logs}`)
  }

  // TEST 9 — SA → impersonate B → questions B → PASS + AuditLog
  {
    const r = await api(tokenSA, 'GET', `${qPath(vacancyB)}?companyId=${companyB.id}`)
    const qs = (r.json.questions as Array<Record<string, unknown>>) || []
    report('TEST 9: SA impersonate B → questions B → 200 + contenido B',
      r.status === 200 && qs.length === 2, `status=${r.status} n=${qs.length}`)
    const log = await db.auditLog.findFirst({
      where: { actorId: sa.id, action: 'ADMIN_ACCESS', details: { contains: companyB.id } },
      orderBy: { createdAt: 'desc' },
    })
    const details = log?.details ? JSON.parse(log.details) : {}
    report('TEST 9b: AuditLog de impersonation registrado (target=B)',
      !!log && details.targetCompanyId === companyB.id && details.impersonation === true,
      `log=${!!log} target=${details.targetCompanyId === companyB.id}`)
  }

  // TEST 10 — SA target=B → questions A → DENIED
  {
    const r = await api(tokenSA, 'GET', `${qPath(vacancyA)}?companyId=${companyB.id}`)
    report('TEST 10: SA target=B → questions A → 404 (recurso A fuera del tenant B)',
      r.status === 404, `status=${r.status}`)
  }

  // Extra SA — SA sin target → derive-from-resource + AuditLog derivedFromResource
  {
    const r = await api(tokenSA, 'GET', qPath(vacancyB))
    const qs = (r.json.questions as Array<Record<string, unknown>>) || []
    report('SA-AGG: SA sin target → questions B → 200 (tenant derivado del recurso)',
      r.status === 200 && qs.length === 2, `status=${r.status} n=${qs.length}`)
    const log = await db.auditLog.findFirst({
      where: { actorId: sa.id, action: 'ADMIN_ACCESS', details: { contains: 'derivedFromResource' } },
      orderBy: { createdAt: 'desc' },
    })
    const details = log?.details ? JSON.parse(log.details) : {}
    report('SA-AGG: AuditLog derivedFromResource registrado',
      !!log && details.derivedFromResource === true && details.targetCompanyId === companyB.id,
      `log=${!!log}`)
  }

  // SA generate-questions con target B (impersonation)
  {
    const r = await api(tokenSA, 'POST', `${gPath(vacancyA)}?companyId=${companyA.id}`)
    report('SA-GEN: SA target=A → generate questions A → 201',
      r.status === 201, `status=${r.status}`)
    const aCount = await db.vacancyQuestion.count({ where: { vacancyId: vacancyA.id } })
    if (aCount > 1) await db.vacancyQuestion.deleteMany({ where: { vacancyId: vacancyA.id, companyId: companyA.id, order: { gt: 1 } } })
  }

  // ════════════════════════════════════════════
  console.log('\n=== FUNCIONAL: CRUD de preguntas (equivalencia de acceso a datos) ===')

  {
    // POST → 201 + order maxOrder+1 + shape
    const r = await api(tokenRhA, 'POST', qPath(vacancyA), {
      text: `CRUD-POST-${SUFFIX}`, options: ['p1', 'p2', 'p3'], correctAnswer: 2,
    })
    const q = (r.json.question as Record<string, unknown>) || {}
    report('CRUD POST: 201 + order=2 + shape completo',
      r.status === 201 && q.order === 2 && q.options !== undefined && q.correctAnswer === 2 && q.type === 'MULTIPLE_CHOICE' && !!q.createdAt,
      `status=${r.status} order=${q.order}`)

    // PUT → 200 + fields updated
    const r2 = await api(tokenRhA, 'PUT', qPath(vacancyA), {
      questionId: q.id as string, text: `CRUD-PUT-${SUFFIX}`, correctAnswer: 1,
    })
    const q2 = (r2.json.question as Record<string, unknown>) || {}
    report('CRUD PUT: 200 + texto/correctAnswer actualizados',
      r2.status === 200 && q2.text === `CRUD-PUT-${SUFFIX}` && q2.correctAnswer === 1,
      `status=${r2.status}`)

    // GET → orden ascendente
    const r3 = await api(tokenRhA, 'GET', qPath(vacancyA))
    const qs = (r3.json.questions as Array<{ text: string; order: number }>) || []
    const sorted = [...qs].every((item, i, arr) => i === 0 || arr[i - 1].order <= item.order)
    report('CRUD GET: preguntas en order ascendente', r3.status === 200 && sorted && qs.length === 2,
      `status=${r3.status} n=${qs.length}`)

    // DELETE → success + gone
    const r4 = await api(tokenRhA, 'DELETE', `${qPath(vacancyA)}?questionId=${q.id as string}`)
    const gone = await db.vacancyQuestion.findUnique({ where: { id: q.id as string } })
    report('CRUD DELETE: success + pregunta eliminada', r4.status === 200 && r4.json.success === true && !gone,
      `status=${r4.status} gone=${!gone}`)
  }

  // ════════════════════════════════════════════
  console.log('\n=== FASE 10: TEST DE GENERACIÓN IA (vacancia sintética + snapshot) ===')

  const iaVacancy = await mkVacancy(companyA.id, `Cajero IA ${SUFFIX}`, 'RESTAURANT')
  await db.vacancyQuestion.create({
    data: { text: `IA-SEED-${SUFFIX}`, type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 0, order: 1, vacancyId: iaVacancy.id, companyId: companyA.id },
  })

  const snapshot: Record<string, unknown> = {
    phase: '3.5-D.2.5',
    createdAt: new Date().toISOString(),
    input: { title: `Cajero IA ${SUFFIX}`, sector: 'RESTAURANT', description: `Descripción Cajero IA ${SUFFIX}` },
    note: 'No existe snapshot original pre-migración; la equivalencia funcional se establece por (1) diff de código del prompt/modelo/params/fallback = 0 cambios, (2) validación estructural de la salida. Este snapshot queda como base para fases futuras.',
  }

  {
    const t0 = Date.now()
    const r = await api(tokenRhA, 'POST', gPath(iaVacancy))
    const elapsed = Date.now() - t0
    const qs = (r.json.questions as Array<Record<string, unknown>>) || []

    const structurallyValid = Array.isArray(qs) && qs.length > 0 && qs.every((q) =>
      typeof q.text === 'string' && (q.text as string).length > 0 &&
      Array.isArray(q.options) && (q.options as unknown[]).length >= 2 &&
      typeof q.correctAnswer === 'number' &&
      typeof q.order === 'number'
    )
    const orders = qs.map((q) => q.order as number)
    const sequential = orders.every((o, i) => o === 2 + i) // maxOrder seed = 1

    const dbRows = await db.vacancyQuestion.findMany({
      where: { vacancyId: iaVacancy.id, companyId: companyA.id }, include: { vacancy: { select: { companyId: true } } },
    })
    const allTenantA = dbRows.every((row) => row.vacancy.companyId === companyA.id)

    report('IA-GEN: generate → 201 + ≥1 pregunta generada',
      r.status === 201 && qs.length > 0, `status=${r.status} n=${qs.length} ms=${elapsed}`)
    report('IA-GEN: estructura válida (text/options≥2/correctAnswer/order)',
      structurallyValid, `valid=${structurallyValid}`)
    report('IA-GEN: orders secuenciales desde maxOrder+1 (comportamiento verbatim)',
      sequential, `orders=${JSON.stringify(orders)}`)
    report('IA-GEN: persistencia 100% tenant A (no contaminación)',
      allTenantA && dbRows.length === qs.length + 1, `tenantOK=${allTenantA} dbRows=${dbRows.length}`)

    snapshot.output = {
      count: qs.length,
      latencyMs: elapsed,
      source: elapsed > 1500 ? 'AI (probable)' : 'fallback bank (probable)',
      orders,
      firstQuestionPreview: qs[0] ? String(qs[0].text).slice(0, 120) : null,
    }
    snapshot.persistedRows = dbRows.length
  }

  writeFileSync('scripts/d25-generation-snapshot.json', JSON.stringify(snapshot, null, 2))
  console.log('  → snapshot guardado: scripts/d25-generation-snapshot.json')

  // ════════════════════════════════════════════
  console.log('\n=== FASE 11: TEST DE ACCESO CANDIDATO (regla original) ===')

  {
    // CANDIDATO A → evaluations GET → availablePositions GLOBAL (original rule)
    const r = await api(tokenCandA, 'GET', `/api/evaluations?candidateId=${candA.id}`)
    const avail = (r.json.availablePositions as Array<{ id: string }>) || []
    const seesB = avail.some((p) => p.id === positionB.id)
    report('CAND-1: CANDIDATO A ve posiciones de OTRAS empresas (availablePositions GLOBAL — regla original pre-D.2.3)',
      r.status === 200 && seesB, `status=${r.status} seesB=${seesB} total=${avail.length}`)

    // CANDIDATO A → create-session para position B → 201 (regla original)
    let createdSessionId: string | null = null
    const r2 = await api(tokenCandA, 'POST', '/api/evaluations', {
      action: 'create-session', positionId: positionB.id, candidateId: candA.id,
    })
    const sess = (r2.json.session as Record<string, unknown>) || null
    if (sess && typeof sess.id === 'string') createdSessionId = sess.id
    report('CAND-2: CANDIDATO A → create-session posición de empresa B → 201 (regla original: postular a cualquier empresa)',
      r2.status === 201 && sess?.companyId === companyB.id,
      `status=${r2.status} sessionCompanyId=${sess?.companyId === companyB.id ? 'B' : String(sess?.companyId)}`)

    // cleanup session
    if (createdSessionId) {
      await db.evaluationResponse.deleteMany({ where: { sessionId: createdSessionId } })
      await db.evaluationSession.delete({ where: { id: createdSessionId } }).catch(() => {})
    }

    // CANDIDATO A → /api/vacancies (surface de gestión) → solo empresa A (original: RLS extension scope)
    const r3 = await api(tokenCandA, 'GET', '/api/vacancies')
    const vacs = (r3.json.vacancies as Array<{ id: string }>) || []
    const onlyA = vacs.every((v) => v.id !== vacancyB.id)
    report('CAND-3: CANDIDATO A → /api/vacancies (gestión) → solo vacantes de A (original: scoped)',
      r3.status === 200 && onlyA, `status=${r3.status} onlyA=${onlyA} n=${vacs.length}`)
  }

  // ════════════════════════════════════════════
  console.log('\n=== CLEANUP ===')
  await cleanupAuditLogs(sa.id)
  await cleanupByCompanyPrefix(CLEANUP_PREFIX)
  if (saIsSynthetic) {
    await db.auditLog.deleteMany({ where: { actorId: sa.id } })
    await db.user.delete({ where: { id: sa.id } }).catch(() => {})
  }
  console.log('  fixture D25-TEST-* eliminado')

  console.log(`\n=== RESULTADO: ${passed} PASS / ${failed} FAIL ===`)
  if (failures.length) {
    console.log('FAILURES:')
    for (const f of failures) console.log(`  - ${f}`)
    process.exit(1)
  }
}

main().catch(async (e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
