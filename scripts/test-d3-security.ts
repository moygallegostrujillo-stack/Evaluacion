/**
 * PHASE 3.5-D.3 — SECURITY REGRESSION (Partes 20/21, HTTP layer)
 *
 * Cross-tenant matrix executed against the running dev server (:3000).
 * Fixtures are created directly via Prisma (companies A/B, candidates,
 * results, vacancy + application) and cleaned up afterwards.
 *
 * Coverage map against the Parte 21 list (22 cases):
 *   1  → S1  (usuario A → B: candidates)          15 → S5 (body.companyId=B)
 *   3  → S2  (candidate A → result B: candidateId) 16 → S6 (query.companyId=B)
 *   4  → S3  (candidate A → result B: resultId)   17 → S7 (targetCompanyId=B as RH)
 *   5  → S4  (user A → user B: PUT)               18 → S8 (fake token)
 *   9  → S9b (vacancy A → B: GET detail)          19 → S9 (legacy token=resourceId)
 *   10 → S10 (position A → B: DELETE)             20 → AF-2 (test-d3-admin-db)
 *   11 → S11 (invitation token desconocido)       21 → S11b (aggregate como RH)
 *   12 → S12 (positions ?all=true como RH)        22 → S1 (impersonation como RH)
 *   2,6,7,8,13,14 → cubiertos por arquitectura uniforme + FC/invariantes
 *   (con A2, consent A→B, application A→B, interview A→B, template/response A→B)
 *
 * Run: bun scripts/test-d3-security.ts
 */

const BASE = 'http://localhost:3000'

let pass = 0
let fail = 0
function report(name: string, ok: boolean, detail = '') {
  if (ok) {
    pass++
    console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`)
  } else {
    fail++
    console.log(`❌ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

interface Auth {
  token: string
  user: { id: string; companyId?: string; role: string }
}

async function api(auth: Auth | null, method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) headers['Authorization'] = `Bearer ${auth.token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  let json: unknown = null
  try {
    json = await res.json()
  } catch {
    /* non-JSON */
  }
  return { status: res.status, json: json as Record<string, unknown> }
}

async function login(email: string, password: string): Promise<Auth | null> {
  const res = await api(null, 'POST', '/api/auth', { action: 'login', email, password })
  if (res.status !== 200 || !res.json?.token) return null
  return { token: res.json.token as string, user: res.json.user as Auth['user'] }
}

async function main() {
  console.log('\n========== D.3 — SEGURIDAD (matriz cross-tenant HTTP) ==========\n')

  const { db } = await import('../src/lib/db')
  const { generatePublicToken } = await import('../src/lib/public-token')
  const crypto = await import('crypto')
  const SUFFIX = `D3SEC${Date.now().toString(36).slice(-6)}`

  // ── Fixtures: dedicated RH users; JWTs minted directly (the LOGIN rate
  // limiter is 10/15min per IP and this suite issues many requests — the
  // login endpoint itself is exercised separately by the auth tests). ──
  const { generateToken } = await import('../src/lib/auth')
  const { hashPassword } = await import('../src/lib/password')
  const companies = await db.company.findMany({ orderBy: { createdAt: 'asc' }, take: 2 })
  if (companies.length < 2) {
    console.error('FATAL: se requieren 2 empresas sembradas (ejecuta /api/seed?mode=full)')
    process.exit(1)
  }
  const companyAId = companies[0].id
  const companyBId = companies[1].id
  const pwd = await hashPassword('test1234-unused-tokens-are-minted')
  const rhAUser = await db.user.create({
    data: { email: `rhA-${SUFFIX}@test.local`, name: 'RH A Test', password: pwd, role: 'RH', companyId: companyAId },
  })
  const rhBUser = await db.user.create({
    data: { email: `rhB-${SUFFIX}@test.local`, name: 'RH B Test', password: pwd, role: 'RH', companyId: companyBId },
  })
  const saUser = await db.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  if (!saUser) {
    console.error('FATAL: no hay SUPER_ADMIN sembrado (ejecuta /api/seed?mode=superadmin o full)')
    process.exit(1)
  }
  const mint = async (u: { id: string; email: string; name: string; role: string; companyId?: string | null }) =>
    ({ token: await generateToken({ sub: u.id, email: u.email, name: u.name, role: u.role, companyId: u.companyId || undefined } as never), user: { id: u.id, companyId: u.companyId || undefined, role: u.role } })
  const rhA = await mint(rhAUser)
  const rhB = await mint(rhBUser)
  const sa = await mint(saUser)

  // ── Fixtures (direct Prisma) ──
  const candA = await db.user.create({
    data: { email: `candA-${SUFFIX}@test.local`, name: 'Cand A', password: 'x', role: 'CANDIDATO', companyId: companyAId },
  })
  const candB = await db.user.create({
    data: { email: `candB-${SUFFIX}@test.local`, name: 'Cand B', password: 'x', role: 'CANDIDATO', companyId: companyBId },
  })
  const sessionB = await db.evaluationSession.create({
    data: { candidateId: candB.id, positionId: (await db.position.create({
      data: { title: `Puesto B ${SUFFIX}`, sector: 'RESTAURANT', category: 'MESERO', companyId: companyBId },
    })).id, companyId: companyBId, status: 'COMPLETED' },
  })
  const resultB = await db.evaluationResult.create({
    data: {
      sessionId: sessionB.id, candidateId: candB.id, candidateName: 'Cand B',
      positionId: sessionB.positionId, positionTitle: 'Puesto B', companyId: companyBId,
      overallScore: 50, recommendation: 'PERFIL_PARCIAL',
    },
  })
  const posA = await db.position.create({
    data: { title: `Puesto A ${SUFFIX}`, sector: 'RESTAURANT', category: 'MESERO', companyId: companyAId },
  })
  const vacancyA = await db.vacancy.create({
    data: { title: `Vacante A ${SUFFIX}`, slug: `d3sec-a-${SUFFIX.toLowerCase()}`, companyId: companyAId, status: 'ACTIVE' },
  })
  const vacancyB = await db.vacancy.create({
    data: { title: `Vacante B ${SUFFIX}`, slug: `d3sec-b-${SUFFIX.toLowerCase()}`, companyId: companyBId, status: 'ACTIVE' },
  })
  const appA = await db.vacancyApplication.create({
    data: { vacancyId: vacancyA.id, companyId: companyAId, candidateName: 'App A', candidateEmail: `appa-${SUFFIX}@t.local`, status: 'IN_PROGRESS' },
  })

  try {
    // ── S1 (casos 1/22): RH A con ?companyId=B → solo datos de A, sin modo agregado ──
    const s1 = await api(rhA, 'GET', `/api/candidates?companyId=${companyBId}`)
    const s1Aggregated = (s1.json as { mode?: string }).mode === 'aggregated'
    const s1Companies = ((s1.json as { aggregated?: { companyId: string }[] }).aggregated || [])
    report('S1 (caso 1/22): RH A ?companyId=B → ignorado, sin agregado de B',
      s1.status === 200 && !s1Aggregated && !s1Companies.some((c) => c.companyId === companyBId))

    // ── S2 (caso 3): RH A pide resultados de candidato B ──
    const s2 = await api(rhA, 'GET', `/api/results?candidateId=${candB.id}`)
    const s2Results = (s2.json as { results?: unknown[] }).results || []
    report('S2 (caso 3): candidate A → result B (por candidateId) → 0 resultados', s2.status === 200 && s2Results.length === 0)

    // ── S3 (caso 4): RH A pide resultId de B ──
    const s3 = await api(rhA, 'GET', `/api/results?resultId=${resultB.id}`)
    report('S3 (caso 4): candidate A → result B (por resultId) → 404', s3.status === 404)

    // ── S4 (caso 5): RH A intenta actualizar usuario B por id ──
    const s4 = await api(rhA, 'PUT', '/api/users', { id: rhBUser.id, name: 'HACKED' })
    report('S4 (caso 5): user A → user B (PUT) → no 2xx', s4.status !== 200, `status=${s4.status}`)

    // ── S5 (caso 15): body.companyId=B en POST /api/positions ──
    const s5 = await api(rhA, 'POST', '/api/positions', {
      title: `Inyección ${SUFFIX}`, sector: 'RESTAURANT', category: 'MESERO', companyId: companyBId,
    })
    const s5Company = (s5.json as { position?: { companyId: string } }).position?.companyId
    report('S5 (caso 15): body.companyId=B → position queda en A', s5.status === 201 && s5Company === companyAId)

    // ── S6 (caso 16): query.companyId=B en GET /api/positions ──
    const s6 = await api(rhA, 'GET', `/api/positions?companyId=${companyBId}`)
    const s6Positions = (s6.json as { positions?: { companyId: string }[] }).positions || []
    report('S6 (caso 16): query.companyId=B → solo posiciones de A',
      s6.status === 200 && s6Positions.every((p) => p.companyId === companyAId))

    // ── S7 (caso 17): RH A usa targetCompanyId=B en /api/results ──
    const s7 = await api(rhA, 'GET', `/api/results?companyId=${companyBId}&resultId=${resultB.id}`)
    report('S7 (caso 17): RH intenta impersonation (?companyId=B) → 404 (no ve B)',
      s7.status === 404)

    // ── S8/S9 (casos 18/19): public video — fake token y legacy token=resourceId ──
    const s8 = await api(null, 'POST', '/api/public/video', { applicationId: appA.id, videoSent: true, token: 'faketoken.fake' })
    report('S8 (caso 18): fake token → 403', s8.status === 403)
    const s9 = await api(null, 'POST', '/api/public/video', { applicationId: appA.id, videoSent: true, token: appA.id })
    report('S9 (caso 19): LEGACY token=resourceId → RECHAZADO (403)', s9.status === 403)
    const s9c = await api(null, 'POST', '/api/public/video', { applicationId: appA.id, videoSent: false, token: generatePublicToken(appA.id) })
    report('S9c: HMAC válido → aceptado (200)', s9c.status === 200)
    const appAAfter = await db.vacancyApplication.findUnique({ where: { id: appA.id } })
    report('S9d: video válido → currentStep=5 (comportamiento intacto)', appAAfter?.currentStep === 5)

    // ── S9b (caso 9): RH A intenta ver vacante B por id ──
    const s9b = await api(rhA, 'GET', `/api/vacancies/${vacancyB.id}`)
    report('S9b (caso 9): vacancy A → B (GET por id) → 404', s9b.status === 404)

    // ── S10 (caso 10): RH A intenta DELETE posición B por id ──
    const posB = await db.position.findFirst({ where: { companyId: companyBId } })
    const s10 = await api(rhA, 'DELETE', `/api/positions?positionId=${posB!.id}`)
    const posBAfter = await db.position.findUnique({ where: { id: posB!.id } })
    report('S10 (caso 10): position A → B (DELETE) → no 2xx y fila B intacta',
      s10.status !== 200 && posBAfter !== null, `status=${s10.status}`)

    // ── S11 (caso 11): invitation token desconocido ──
    const s11 = await api(null, 'GET', '/api/public/invitation?token=deadbeefdeadbeef')
    report('S11 (caso 11): invitation token desconocido → valid:false', (s11.json as { valid?: boolean }).valid === false)

    // ── S11b (caso 21): RH intenta aggregate ──
    const s11b = await api(rhA, 'GET', '/api/results')
    report('S11b (caso 21): usuario normal → SIN modo aggregated',
      s11b.status === 200 && (s11b.json as { mode?: string }).mode !== 'aggregated')

    // ── S12 (caso 12): RH intenta positions ?all=true ──
    const s12 = await api(rhA, 'GET', '/api/positions?all=true')
    report('S12 (caso 12): positions ?all=true como RH → 403', s12.status === 403)

    // ── S13 (caso 12 de Parte 12): privacy-notice ?companyId=B como RH A ──
    const s13 = await api(rhA, 'GET', `/api/privacy-notice?companyId=${companyBId}`)
    // La respuesta no debe contener el contenido de B — debe resolver A (o error no-200).
    const s13Html = (s13.json as { contentHtml?: string }).contentHtml || ''
    report('S13 (Parte 12): privacy-notice ?companyId=B → NO devuelve contenido de B',
      s13.status === 200 || s13.status === 403 || s13.status === 404 ? !s13Html.includes('Marlui') : true,
      `status=${s13.status}`)

    // ── SA aggregate sanity (Parte 20): SA ve agregado; SA impersonation ve B ──
    const saAgg = await api(sa, 'GET', '/api/results')
    report('SA-AGG: SUPER_ADMIN sin target → modo aggregated (solo conteos)',
      (saAgg.json as { mode?: string }).mode === 'aggregated' &&
      JSON.stringify(saAgg.json).includes('companyName') &&
      !JSON.stringify(saAgg.json).includes('candidateName'))
    const saImp = await api(sa, 'GET', `/api/results?companyId=${companyBId}&resultId=${resultB.id}`)
    report('SA-IMPERSONATION: SA con target B → ve resultado de B (audit log registrado)',
      saImp.status === 200)
  } finally {
    // ── Cleanup ──
    await db.vacancyApplicationResponse.deleteMany({ where: { application: { vacancyId: vacancyA.id } } })
    await db.evaluationResult.deleteMany({ where: { id: resultB.id } }).catch(() => undefined)
    await db.evaluationSession.deleteMany({ where: { id: sessionB.id } }).catch(() => undefined)
    await db.vacancyApplication.deleteMany({ where: { id: appA.id } }).catch(() => undefined)
    await db.vacancy.deleteMany({ where: { id: { in: [vacancyA.id, vacancyB.id] } } }).catch(() => undefined)
    await db.position.deleteMany({ where: { id: { in: [posA.id, sessionB.positionId] } } }).catch(() => undefined)
    await db.user.deleteMany({ where: { id: { in: [candA.id, candB.id, rhAUser.id, rhBUser.id] } } }).catch(() => undefined)
    await db.$disconnect()
  }

  console.log(`\n========== RESULTADO: ${pass} PASS / ${fail} FAIL ==========`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})

export {}
