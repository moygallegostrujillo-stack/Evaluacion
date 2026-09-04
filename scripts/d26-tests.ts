// @ts-nocheck — D.2.6 test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-D.2.6 — Cross-tenant tests (R1–R10), privacy tests (P1–P9)
 * and regression suite (FASE 15).
 *
 * Usage:
 *   bun scripts/d26-tests.ts pre    # before migration (P3/P4 document the leaks)
 *   bun scripts/d26-tests.ts post   # after migration (P3/P4 must be fixed)
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { mintToken, apiGet } from './d26-lib'

const phase = process.argv[2] === 'post' ? 'post' : 'pre'
const fx = JSON.parse(readFileSync(join(import.meta.dir, 'd26-fixture.json'), 'utf8'))
const auditDb = new PrismaClient()

const tRhA = await mintToken({ sub: fx.rhA, email: fx.emailRhA, name: 'D26 RH A', role: 'RH', companyId: fx.companyA })
const tRhB = await mintToken({ sub: fx.rhB, email: fx.emailRhB, name: 'D26 RH B', role: 'RH', companyId: fx.companyB })
const tSa = await mintToken({ sub: fx.sa, email: fx.emailSa, name: 'D26 Super Admin', role: 'SUPER_ADMIN' })
const tCandA = await mintToken({ sub: fx.candA, email: fx.emailCandA, name: 'D26 Candidato A', role: 'CANDIDATO', companyId: fx.companyA })
const tCandB = await mintToken({ sub: fx.candB, email: fx.emailCandB, name: 'D26 Candidato B', role: 'CANDIDATO', companyId: fx.companyB })

type Res = { status: number; body: any; text: string }
const results: Array<{ id: string; desc: string; expected: string; got: string; pass: boolean }> = []

function record(id: string, desc: string, expected: string, r: Res, check: (r: Res) => boolean) {
  const pass = check(r)
  results.push({ id, desc, expected, got: `HTTP ${r.status} ${String(r.text).slice(0, 160).replace(/\s+/g, ' ')}`, pass })
  console.log(`${pass ? '✅' : '❌'} [${id}] ${desc} → HTTP ${r.status}`)
}

const is404 = (r: Res) => r.status === 404
const is200 = (r: Res) => r.status === 200
const is403 = (r: Res) => r.status === 403
const is401 = (r: Res) => r.status === 401

// ───────────────────────── FASE 13 — TESTS R1..R10 ─────────────────────────
console.log(`\n═══ FASE 13 — CROSS-TENANT TESTS (phase=${phase}) ═══`)

// R1 — A → Result A
record('R1', 'RH-A → resultId=Result A', '200 + Result A', await apiGet(tRhA, `/api/results?resultId=${fx.resA}`),
  (r) => is200(r) && r.body?.result?.id === fx.resA && r.body?.result?.companyId === fx.companyA)

// R2 — A → Result B (cross-tenant)
record('R2', 'RH-A → resultId=Result B', '404 DENIED (no leak)', await apiGet(tRhA, `/api/results?resultId=${fx.resB}`), is404)

// R3 — A → Session B (session id used as resultId; endpoint has no sessionId param)
record('R3a', 'RH-A → resultId=Session B id', '404 DENIED', await apiGet(tRhA, `/api/results?resultId=${fx.sessB}`), is404)
{
  const r = await apiGet(tRhA, `/api/results?sessionId=${fx.sessB}`)
  // sessionId is NOT an accepted param → falls through to all-results for company A
  const treatedAsList = r.status === 200 && Array.isArray(r.body?.results) &&
    r.body.results.every((x: any) => x.companyId === fx.companyA)
  record('R3b', 'RH-A → ?sessionId=Session B (param not accepted as authority)', 'ignored → only own tenant data', r, () => treatedAsList)
}

// R4 — A → candidateId B
{
  const r = await apiGet(tRhA, `/api/results?candidateId=${fx.candB}`)
  record('R4', 'RH-A → candidateId=Candidato B', '200 with EMPTY results (no leak)', r,
    (r) => is200(r) && Array.isArray(r.body?.results) && r.body.results.length === 0)
}

// R5 — A → companyId=B (must be ignored)
{
  const r = await apiGet(tRhA, `/api/results?companyId=${fx.companyB}&candidateId=${fx.candA}`)
  record('R5', 'RH-A → ?companyId=B (spoofed tenant authority)', 'ignored → only company A data', r,
    (r) => is200(r) && Array.isArray(r.body?.results) && r.body.results.length > 0 &&
      r.body.results.every((x: any) => x.companyId === fx.companyA))
}

// R6 — A → targetCompanyId B (normal user cannot impersonate)
{
  const r = await apiGet(tRhA, `/api/results?companyId=${fx.companyB}`)
  record('R6', 'RH-A → ?companyId=B (impersonation attempt)', 'ignored → only company A data', r,
    (r) => is200(r) && Array.isArray(r.body?.results) && r.body.results.every((x: any) => x.companyId === fx.companyA))
}

// R7 — B → Result B
record('R7', 'RH-B → resultId=Result B', '200 + Result B', await apiGet(tRhB, `/api/results?resultId=${fx.resB}`),
  (r) => is200(r) && r.body?.result?.id === fx.resB && r.body?.result?.companyId === fx.companyB)

// R8 — SA impersonate B → Result B  (+ AuditLog)
{
  const r = await apiGet(tSa, `/api/results?companyId=${fx.companyB}&resultId=${fx.resB}`)
  const log = await auditDb.auditLog.findFirst({
    where: {
      actorId: fx.sa, action: 'ADMIN_ACCESS', resource: 'EvaluationResult',
      details: { contains: fx.companyB },
    },
    orderBy: { createdAt: 'desc' },
  })
  results.push({
    id: 'R8', desc: 'SA → impersonate B → resultId=Result B', expected: '200 + AuditLog ADMIN_ACCESS',
    got: `HTTP ${r.status}; AuditLog=${log ? 'FOUND' : 'MISSING'}`,
    pass: is200(r) && r.body?.result?.id === fx.resB && !!log,
  })
  console.log(`${is200(r) && !!log ? '✅' : '❌'} [R8] SA impersonation + AuditLog`)
}

// R9 — SA target B → Result A
record('R9', 'SA impersonate B → resultId=Result A', '404 DENIED', await apiGet(tSa, `/api/results?companyId=${fx.companyB}&resultId=${fx.resA}`), is404)

// R10 — normal user manipulates resultId B (RH and CANDIDATO variants)
record('R10a', 'RH-A manipulates resultId=Result B', '404 DENIED', await apiGet(tRhA, `/api/results?resultId=${fx.resB}`), is404)
record('R10b', 'CAND-A manipulates resultId=Result B', '404 DENIED', await apiGet(tCandA, `/api/results?resultId=${fx.resB}`), is404)
record('R10c', 'RH-A manipulates resultId=App B (vacancy result)', '404 DENIED', await apiGet(tRhA, `/api/results?resultId=${fx.appB}`), is404)

// ───────────────────────── FASE 14 — PRIVACY TESTS ─────────────────────────
console.log(`\n═══ FASE 14 — PRIVACY TESTS ═══`)

// P1 — candidate forcing another candidateId (same company)
record('P1', 'CAND-A → candidateId=CAND-A2 (same company, other candidate)', '403 DENIED', await apiGet(tCandA, `/api/results?candidateId=${fx.candA2}`), is403)

// P2 — candidate by resultId, same company, other candidate (EvaluationResult)
record('P2', 'CAND-A → resultId=Result A2 (same company, other candidate)', '403 DENIED', await apiGet(tCandA, `/api/results?resultId=${fx.resA2}`), is403)

// P3 — candidate by resultId, VacancyApplication of other candidate (same company)
{
  const r = await apiGet(tCandA, `/api/results?resultId=${fx.appA2}`)
  if (phase === 'pre') {
    // Document the pre-existing gap (expected leak evidence)
    results.push({
      id: 'P3', desc: 'CAND-A → resultId=VacancyApp A2 (other candidate) [PRE]',
      expected: 'EVIDENCE: currently LEAKS (200) — documented as VULNERABILIDAD',
      got: `HTTP ${r.status} ${r.status === 200 ? 'LEAK CONFIRMED' : ''}`,
      pass: true, // evidence capture, not a failure of the pre-state run
    })
    console.log(`⚠️  [P3] PRE-MIGRATION EVIDENCE: status=${r.status} ${r.status === 200 ? '→ LEAK CONFIRMED (VUL-01)' : '(no leak)'}`)
  } else {
    record('P3', 'CAND-A → resultId=VacancyApp A2 (other candidate)', '403 DENIED (VUL-01 fixed)', r, is403)
  }
}

// P4 — candidate compareIds including another candidate's result
{
  const r = await apiGet(tCandA, `/api/results?compareIds=${fx.resA},${fx.resA2}`)
  if (phase === 'pre') {
    const leaked = is200(r) && Array.isArray(r.body?.comparison?.candidates) && r.body.comparison.candidates.some((c: any) => c.id === fx.resA2)
    results.push({
      id: 'P4', desc: 'CAND-A → compareIds=ResA,ResA2 [PRE]',
      expected: 'EVIDENCE: currently LEAKS other candidate scores — VUL-02',
      got: `HTTP ${r.status}; candidates returned: ${is200(r) ? r.body?.comparison?.candidates?.map((c: any) => c.id).join(',') : 'n/a'}`,
      pass: true,
    })
    console.log(`⚠️  [P4] PRE-MIGRATION EVIDENCE: status=${r.status} leak=${leaked ? 'CONFIRMED (VUL-02)' : 'no'}`)
  } else {
    record('P4', 'CAND-A → compareIds=ResA,ResA2', 'only own (ResA) returned (VUL-02 fixed)', r,
      (r) => is200(r) && Array.isArray(r.body?.comparison?.candidates) &&
        r.body.comparison.candidates.every((c: any) => c.candidateId === fx.candA))
  }
}

// P5 — candidate compareIds cross-tenant
{
  const r = await apiGet(tCandA, `/api/results?compareIds=${fx.resB}`)
  const clean = is200(r) && Array.isArray(r.body?.comparison?.candidates) && r.body.comparison.candidates.length === 0
  record('P5', 'CAND-A → compareIds=Result B (cross-tenant)', 'empty comparison (no leak)', r, () => clean)
}

// P6 — candidate own vacancy-application result (legit self-access must keep working)
record('P6', 'CAND-B → resultId=App B (own vacancy result)', '200 + own result', await apiGet(tCandB, `/api/results?resultId=${fx.appB}`),
  (r) => is200(r) && r.body?.result?.id === fx.appB && r.body?.result?.companyId === fx.companyB)

// P7 — candidate own evaluation result by ID
record('P7', 'CAND-A → resultId=Result A (own)', '200 + own result', await apiGet(tCandA, `/api/results?resultId=${fx.resA}`),
  (r) => is200(r) && r.body?.result?.id === fx.resA)

// P8 — unknown id
record('P8', 'RH-A → resultId=does-not-exist', '404', await apiGet(tRhA, `/api/results?resultId=does-not-exist-d26`), is404)

// P9 — no token
{
  const res = await fetch('http://localhost:3000/api/results')
  record('P9', 'no token → /api/results', '401', { status: res.status, body: null, text: '' }, is401)
}

// Privacy inference check — cross-tenant denials must not leak existence
{
  const r2 = await apiGet(tRhA, `/api/results?resultId=${fx.resB}`)
  const r3 = await apiGet(tRhA, `/api/results?resultId=${fx.sessB}`)
  const r4 = await apiGet(tRhA, `/api/results?candidateId=${fx.candB}`)
  const leakFree =
    !String(r2.text).includes(fx.resB) && !String(r2.text).includes('D26 Candidato B') &&
    !String(r3.text).includes(fx.sessB) &&
    !String(r4.text).includes('D26 Candidato B') && !String(r4.text).includes(fx.resB)
  record('P10', 'Cross-tenant denials leak no existence signals (IDs/names)', 'leak-free', r2, () => leakFree)
}

// ───────────────────── FASE 15 — REGRESSION SUITE ─────────────────────
console.log(`\n═══ FASE 15 — REGRESSION SUITE ═══`)

const reg: Array<{ id: string; path: string; init?: RequestInit; expect: (r: Res) => boolean; note: string }> = [
  { id: 'RG-evaluations', path: `/api/evaluations?candidateId=${fx.candA}`, expect: is200, note: 'sessions list for candidate' },
  { id: 'RG-candidates', path: '/api/candidates', expect: is200, note: 'candidates list' },
  { id: 'RG-users', path: '/api/users', expect: is200, note: 'users list' },
  { id: 'RG-consent', path: '/api/consent', init: { method: 'POST' }, expect: (r) => r.status === 400 || r.status === 401, note: 'alive + guarded (no mutation attempted)' },
  { id: 'RG-positions', path: '/api/positions', expect: is200, note: 'positions list' },
  { id: 'RG-arco', path: '/api/arco', expect: is200, note: 'arco list' },
  { id: 'RG-invite', path: '/api/invite', expect: is200, note: 'invitations list' },
  { id: 'RG-questions', path: `/api/questions?positionId=${fx.posA}`, expect: is200, note: 'questions for position A' },
  { id: 'RG-vacancies', path: '/api/vacancies', expect: is200, note: 'vacancies list' },
  { id: 'RG-interviews', path: '/api/interviews', expect: is200, note: 'interviews list' },
  { id: 'RG-login', path: '/api/auth', init: { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', email: fx.emailRhA, password: 'D26Test#2026' }) }, expect: (r) => is200(r) && !!r.body?.token, note: 'login RH-A' },
  { id: 'RG-sa-aggregate-results', path: '/api/results', expect: (r) => is200(r) && r.body?.mode === 'aggregated', note: 'SA aggregate mode' },
  { id: 'RG-sa-aggregate-candidates', path: '/api/candidates', expect: (r) => is200(r) && r.body?.mode === 'aggregated', note: 'SA aggregate candidates' },
  { id: 'RG-sa-impersonation-positions', path: `/api/positions?companyId=${fx.companyA}`, expect: (r) => {
    if (!is200(r)) return false
    const list = Array.isArray(r.body) ? r.body : Array.isArray(r.body?.positions) ? r.body.positions : null
    return list !== null && list.every((p: any) => p.companyId === fx.companyA)
  }, note: 'SA impersonation positions' },
]

for (const t of reg) {
  const token = t.id === 'RG-sa-aggregate-results' || t.id === 'RG-sa-aggregate-candidates' || t.id === 'RG-sa-impersonation-positions' ? tSa : tRhA
  const res = await fetch(`http://localhost:3000${t.path}`, {
    ...t.init,
    headers: { ...(t.init?.headers || {}), Authorization: `Bearer ${token}` },
  })
  const text = await res.text()
  let body: any = text
  try { body = JSON.parse(text) } catch { /* raw */ }
  const r: Res = { status: res.status, body, text }
  const pass = t.expect(r)
  results.push({ id: t.id, desc: `Regression: ${t.note}`, expected: 'per contract', got: `HTTP ${res.status} ${String(text).slice(0, 100).replace(/\s+/g, ' ')}`, pass })
  console.log(`${pass ? '✅' : '❌'} [${t.id}] HTTP ${res.status}`)
}

// ───────────────────────── SUMMARY ─────────────────────────
const failed = results.filter(r => !r.pass)
console.log(`\n═══ SUMMARY (${phase}) — ${results.length} checks, ${failed.length} failed ═══`)
if (failed.length > 0) {
  console.log('FAILED:', failed.map(f => f.id).join(', '))
}
writeFileSync(join(import.meta.dir, `d26-test-results-${phase}.json`), JSON.stringify(results, null, 2))
console.log(`results → scripts/d26-test-results-${phase}.json`)
await auditDb.$disconnect()
process.exit(failed.length > 0 ? 1 : 0)
