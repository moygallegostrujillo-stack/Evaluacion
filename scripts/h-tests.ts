// @ts-nocheck — PHASE 3.5-H security test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-H — Security closure tests for VUL-H1..H6 + PARTE 22 audit checks.
 *
 * Usage:
 *   bun scripts/h-tests.ts full         # server running WITH ADMIN_DATABASE_URL (aggregate works)
 *   bun scripts/h-tests.ts admin-fail   # server running WITHOUT ADMIN_DATABASE_URL (aggregate fail-closed)
 *
 * Requires the d26 fixture (run `bun scripts/d26-fixture.ts` first) and the dev
 * server on http://localhost:3000.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { mintToken, apiGet } from './d26-lib'
import { generatePublicToken } from '../src/lib/public-token'

const mode = process.argv[2] === 'admin-fail' ? 'admin-fail' : 'full'
const fx = JSON.parse(readFileSync(join(import.meta.dir, 'd26-fixture.json'), 'utf8'))
const db = new PrismaClient()
const TS = Date.now()
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
  try { b = await res.json() } catch {}
  return { status: res.status, body: b }
}
async function apiPut(path: string, body: unknown, token?: string): Promise<{ status: number; body: any }> {
  const res = await fetch(BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  let b: any = null
  try { b = await res.json() } catch {}
  return { status: res.status, body: b }
}
async function apiDelete(path: string, token: string): Promise<{ status: number; body: any }> {
  const res = await fetch(BASE + path, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  let b: any = null
  try { b = await res.json() } catch {}
  return { status: res.status, body: b }
}
async function api(token: string, path: string): Promise<{ status: number; body: any }> {
  const res = await fetch(BASE + path, { headers: { Authorization: `Bearer ${token}` } })
  let b: any = null
  try { b = await res.json() } catch {}
  return { status: res.status, body: b }
}

const tRhA = await mintToken({ sub: fx.rhA, email: fx.emailRhA, name: 'D26 RH A', role: 'RH', companyId: fx.companyA })
const tRhB = await mintToken({ sub: fx.rhB, email: fx.emailRhB, name: 'D26 RH B', role: 'RH', companyId: fx.companyB })
const tSa = await mintToken({ sub: fx.sa, email: fx.emailSa, name: 'D26 Super Admin', role: 'SUPER_ADMIN' })
const tCandA = await mintToken({ sub: fx.candA, email: fx.emailCandA, name: 'D26 Candidato A', role: 'CANDIDATO', companyId: fx.companyA })
const tCandA2 = await mintToken({ sub: fx.candA2, email: fx.emailCandA2, name: 'D26 Candidato A2', role: 'CANDIDATO', companyId: fx.companyA })

// DB context needed for public-flow tests
const vacA = await db.vacancy.findUnique({ where: { id: fx.vacA } })
const vacB = await db.vacancy.findUnique({ where: { id: fx.vacB } })
const appA = await db.vacancyApplication.findUnique({ where: { id: fx.appA } })

console.log(`\n═══ PHASE 3.5-H SECURITY TESTS — mode=${mode} ═══\n`)

// ───────────────────── VUL-H1 — LEGACY TOKEN FALLBACK REMOVED ─────────────────────
{
  // H1-1: bare applicationId, no token → 404 (previously minted a token!)
  const r = await apiGet('', `/api/public/apply?applicationId=${fx.appA}`)
  push('H1-1', 'GET resume SIN token → DENIED (ya no acuña tokens)', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // H1-2: LEGACY form token === resourceId → must be DEAD
  const r = await apiGet('', `/api/public/apply?applicationId=${fx.appA}&token=${fx.appA}`)
  push('H1-2', 'GET resume con token LEGACY (bare applicationId) → DENIED', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // H1-3: real HMAC token → works
  const tok = generatePublicToken(fx.appA)
  const r = await apiGet('', `/api/public/apply?applicationId=${fx.appA}&token=${encodeURIComponent(tok)}`)
  push('H1-3', 'GET resume con HMAC válido → 200', '200', `HTTP ${r.status}`, r.status === 200)
}
{
  // H1-4: answer with legacy bare token → 403 TOKEN_INVALID
  const r = await apiPost('/api/public/apply', { step: 'answer', applicationId: fx.appA, section: 'PSICOMETRICA', value: '3', token: fx.appA })
  push('H1-4', 'POST answer con token LEGACY → 403 TOKEN_INVALID', '403', `HTTP ${r.status} code=${r.body?.code}`, r.status === 403 && r.body?.code === 'TOKEN_INVALID')
}

// ───────────────────── VUL-H2 — PUBLIC APPLY POSSESSION PROOF ─────────────────────
let h2AppId = ''
let h2Token = ''
{
  // H2-1: legitimate creation
  const r = await apiPost('/api/public/apply', {
    step: 'data', vacancySlug: vacA.slug, name: 'H2 Tester', email: `h2-flow-${TS}@test.local`, phone: '5551110001',
  })
  h2AppId = r.body?.applicationId || ''
  h2Token = r.body?.token || ''
  push('H2-1', 'datos legítimos → 200 + applicationId + token', '200 + token', `HTTP ${r.status} token=${h2Token ? 'yes' : 'no'}`, r.status === 200 && !!h2AppId && !!h2Token)
}
{
  // H2-1b: legitimate resume with SAME data → resumed + fresh token
  const r = await apiPost('/api/public/apply', {
    step: 'data', vacancySlug: vacA.slug, name: 'H2 Tester', email: `h2-flow-${TS}@test.local`, phone: '5551110001',
  })
  push('H2-1b', 'resume legítimo (mismos datos) → 200 resumed + token', '200 + token', `HTTP ${r.status} resumed=${r.body?.resumed} token=${r.body?.token ? 'yes' : 'no'}`, r.status === 200 && r.body?.resumed === true && !!r.body?.token)
}
{
  // H2-2: email+slug valid but NO possession (wrong name) → DENIED
  const r = await apiPost('/api/public/apply', {
    step: 'data', vacancySlug: vacA.slug, name: 'Wrong Name', email: `h2-flow-${TS}@test.local`,
  })
  const leaksCapability = r.body?.applicationId || r.body?.token
  push('H2-2', 'email+slug sin prueba de posesión (nombre incorrecto) → DENIED sin capability', '403 sin applicationId/token', `HTTP ${r.status} code=${r.body?.code} leak=${!!leaksCapability}`, r.status === 403 && !leaksCapability)
}
{
  // H2-2b: right name, WRONG phone → DENIED
  const r = await apiPost('/api/public/apply', {
    step: 'data', vacancySlug: vacA.slug, name: 'H2 Tester', email: `h2-flow-${TS}@test.local`, phone: '9999999999',
  })
  const leaksCapability = r.body?.applicationId || r.body?.token
  push('H2-2b', 'nombre correcto + teléfono incorrecto → DENIED sin capability', '403 sin applicationId/token', `HTTP ${r.status} leak=${!!leaksCapability}`, r.status === 403 && !leaksCapability)
}
{
  // H2-3: victim email (appA's candidate) + slug B → fresh application on B,
  // NEVER a capability over A's application.
  const victimEmail = appA.candidateEmail
  const r = await apiPost('/api/public/apply', { step: 'data', vacancySlug: vacB.slug, name: 'Attacker', email: victimEmail })
  const gotA = r.body?.applicationId === fx.appA || r.body?.applicationId === fx.appA2
  push('H2-3', 'email de víctima + slug B → NO entrega application de A', 'applicationId ≠ A', `HTTP ${r.status} gotVictimsApp=${gotA}`, r.status === 200 && !gotA)
}
{
  // H2-4: known applicationId WITHOUT token → DENIED
  const r = await apiGet('', `/api/public/apply?applicationId=${h2AppId}`)
  push('H2-4', 'applicationId conocido sin token → DENIED', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // H2-5: incorrect token → DENIED
  const r = await apiGet('', `/api/public/apply?applicationId=${h2AppId}&token=forged.abcdef`)
  push('H2-5', 'token incorrecto → DENIED', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // H2-6: token of A + application B → DENIED (binding)
  const tokA = generatePublicToken(fx.appA)
  const r = await apiGet('', `/api/public/apply?applicationId=${h2AppId}&token=${encodeURIComponent(tokA)}`)
  push('H2-6', 'token A + application B → DENIED', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // H2-7: token B + application A → DENIED (binding)
  const r = await apiGet('', `/api/public/apply?applicationId=${fx.appA}&token=${encodeURIComponent(h2Token)}`)
  push('H2-7', 'token B + application A → DENIED', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // H2-8: the denial must NOT reveal whose application exists nor leak data
  const r = await apiPost('/api/public/apply', {
    step: 'data', vacancySlug: vacA.slug, name: 'Probe Probe', email: `h2-flow-${TS}@test.local`,
  })
  const bodyStr = JSON.stringify(r.body || {})
  const leaks = ['applicationId', 'token', 'candidateName', 'candidateEmail', 'candidatePhone'].filter(k => k === 'applicationId' ? bodyStr.includes('"applicationId"') : bodyStr.includes(k))
  // candidateEmail IS the input echo path? No — 403 body has only error+code. Check for the victim email too:
  const leaksVictimEmail = bodyStr.includes(`h2-flow-${TS}@test.local`)
  push('H2-8', 'respuesta de denegación sin datos de la aplicación', 'sin capability/PII', `leaks=${leaks.join(',')} victimEmail=${leaksVictimEmail}`, r.status === 403 && leaks.length === 0 && !leaksVictimEmail)
}

// ───────────────────── VUL-H3 — CANDIDATO CANNOT ACCESS RH LISTINGS ─────────────────────
{
  const r = await api(tCandA, '/api/candidates')
  push('H3-1', 'CAND-A → candidates list → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await api(tCandA, '/api/results')
  const rows = r.body?.results || []
  const foreign = rows.filter((x: any) => x.candidateId && x.candidateId !== fx.candA)
  push('H3-2', 'CAND-A → results (sin parámetros) → solo propios', '200 sin ajenos', `HTTP ${r.status} rows=${rows.length} foreign=${foreign.length}`, r.status === 200 && foreign.length === 0)
}
{
  const r = await api(tCandA, '/api/interviews')
  push('H3-3', 'CAND-A → interviews list (RH) → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await api(tCandA, `/api/interviews?candidateId=${fx.candA}`)
  const rows = r.body?.interviews || []
  const foreign = rows.filter((x: any) => x.candidateId && x.candidateId !== fx.candA)
  push('H3-5a', 'CAND-A → sus propias entrevistas (flujo legítimo) → 200 solo propias', '200 sin ajenas', `HTTP ${r.status} rows=${rows.length} foreign=${foreign.length}`, r.status === 200 && foreign.length === 0)
}
{
  const r = await api(tCandA, `/api/interviews?candidateId=${fx.candA2}`)
  push('H3-6a', 'CAND-A → interviews de CAND-A2 → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await api(tCandA, '/api/vacancies')
  push('H3-4a', 'CAND-A → vacancies management list → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await api(tCandA, `/api/vacancies/${fx.vacA}/applications`)
  push('H3-4b', 'CAND-A → applications list de vacancy A → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await api(tCandA, '/api/invite')
  push('H3-8', 'CAND-A → invitations list (expone tokens) → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  // own resource legit
  const r = await api(tCandA, `/api/results?resultId=${fx.resA}`)
  push('H3-5', 'CAND-A → su propio resultado → 200', '200', `HTTP ${r.status}`, r.status === 200)
}
{
  // same tenant other candidate
  const r = await api(tCandA, `/api/results?resultId=${fx.resA2}`)
  push('H3-6', 'CAND-A → resultado de CAND-A2 → DENIED', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  // cross tenant
  const r = await api(tCandA, `/api/results?resultId=${fx.resB}`)
  push('H3-7', 'CAND-A → resultado de tenant B → DENIED (404 sin existencia)', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  const r = await api(tCandA2, '/api/candidates')
  push('H3-1b', 'CAND-A2 → candidates list → 403', '403', `HTTP ${r.status}`, r.status === 403)
}

// ───────────────────── VUL-H4 — INVITE DELETE ROLE GATE ─────────────────────
// Create disposable invitations via the API (with proper auth headers)
async function createInvitation(token: string, companyId: string, phone: string): Promise<string> {
  const res = await fetch(BASE + '/api/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ candidateName: 'H4 TEST', phone, positionId: companyId === fx.companyA ? fx.posA : fx.posB, companyId, channel: 'WHATSAPP' }),
  })
  const b = await res.json().catch(() => ({}))
  return b?.invitation?.id || ''
}
const invA1 = await createInvitation(tRhA, fx.companyA, `555-h4-${TS}-a1`)
const invA2 = await createInvitation(tRhA, fx.companyA, `555-h4-${TS}-a2`)
const invB1 = await createInvitation(tRhB, fx.companyB, `555-h4-${TS}-b1`)
{
  const r = await apiDelete(`/api/invite?id=${invA1}`, tCandA)
  push('H4-1', 'CAND → delete invitation → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await apiDelete(`/api/invite?id=${invA1}`, tRhA)
  push('H4-2', 'RH-A → invitation A → PASS', '200', `HTTP ${r.status} success=${r.body?.success}`, r.status === 200 && r.body?.success === true)
}
{
  const r = await apiDelete(`/api/invite?id=${invB1}`, tRhA)
  push('H4-3', 'RH-A → invitation B → DENIED', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  // SA impersonation on B → PASS + AuditLog
  const r = await apiDelete(`/api/invite?id=${invB1}&companyId=${fx.companyB}`, tSa)
  const audit = await db.auditLog.findFirst({
    where: { action: 'DELETE', resource: 'CandidateInvitation', companyId: fx.companyB, details: { contains: '"impersonation":true' } },
    orderBy: { createdAt: 'desc' },
  })
  push('H4-4', 'SA impersonate B → invitation B → PASS + AuditLog', '200 + audit', `HTTP ${r.status} audit=${!!audit}`, r.status === 200 && !!audit)
}
{
  // SA targeting B but invitation belongs to A → DENIED (404 generic)
  const r = await apiDelete(`/api/invite?id=${invA2}&companyId=${fx.companyB}`, tSa)
  push('H4-5', 'SA impersonate B → invitation A → DENIED', '404', `HTTP ${r.status}`, r.status === 404)
}
{
  // SA without target → 400 (no global tenant mutation)
  const r = await apiDelete(`/api/invite?id=${invA2}`, tSa)
  push('H4-6', 'SA sin target → NO eliminación global → 400', '400', `HTTP ${r.status}`, r.status === 400)
}
{
  // RH-A all=true → deletes ONLY company A's invitations; B untouched
  const beforeB = await db.candidateInvitation.count({ where: { companyId: fx.companyB } })
  const r = await apiDelete('/api/invite?all=true', tRhA)
  const afterB = await db.candidateInvitation.count({ where: { companyId: fx.companyB } })
  const aLeft = await db.candidateInvitation.count({ where: { companyId: fx.companyA, id: invA2 } })
  push('H4-7', 'RH-A delete ALL → solo empresa A; B intacta', 'B intacta', `HTTP ${r.status} B:${beforeB}->${afterB} invA2 queda=${aLeft}`, r.status === 200 && beforeB === afterB && aLeft === 0)
}

// ───────────────────── VUL-H5 — USER COMPANY REASSIGNMENT ─────────────────────
{
  const r = await apiPut('/api/users', { id: fx.rhA, companyId: fx.companyB }, tRhA)
  const stillA = await db.user.findUnique({ where: { id: fx.rhA } })
  push('H5-1', 'RH-A → user A → companyId=B → 403 y companyId intacto', '403', `HTTP ${r.status} companyId=${stillA?.companyId === fx.companyA ? 'A' : 'CHANGED!'}`, r.status === 403 && stillA?.companyId === fx.companyA)
}
{
  const r = await apiPut('/api/users', { id: fx.rhA, name: 'D26 RH A' }, tRhA)
  push('H5-2', 'RH-A → user A sin companyId → PASS', '200', `HTTP ${r.status}`, r.status === 200)
}
{
  const r = await apiPut('/api/users', { id: fx.rhB, name: 'Hacked' }, tRhA)
  push('H5-3', 'RH-A → user B → DENIED', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  // SA transfer WITH audit trail
  const r = await apiPut('/api/users', { id: fx.candA, companyId: fx.companyB }, tSa)
  const moved = await db.user.findUnique({ where: { id: fx.candA } })
  const audit = await db.auditLog.findFirst({
    where: { action: 'UPDATE', resource: 'User', resourceId: fx.candA, details: { contains: '"companyTransfer":true' } },
    orderBy: { createdAt: 'desc' },
  })
  const auditOk = audit && audit.details?.includes(`"oldCompanyId":"${fx.companyA}"`) && audit.details?.includes(`"newCompanyId":"${fx.companyB}"`)
  push('H5-4', 'SA → transferencia de empresa → permitida + AuditLog(old,new)', '200 + audit', `HTTP ${r.status} moved=${moved?.companyId === fx.companyB} auditOk=${!!auditOk}`, r.status === 200 && moved?.companyId === fx.companyB && !!auditOk)
  // Restore
  await apiPut('/api/users', { id: fx.candA, companyId: fx.companyA }, tSa)
}
{
  // H5-5: re-login after restore → tenant A (no escape possible)
  const login = await apiPost('/api/auth', { action: 'login', email: fx.emailCandA, password: 'D26Test#2026' })
  const loginCompanyId = login.body?.user?.companyId || login.body?.companyId
  push('H5-5', 'usuario re-login → companyId = tenant original', 'A', `HTTP ${login.status} companyId=${loginCompanyId === fx.companyA ? 'A' : loginCompanyId}`, login.status === 200 && loginCompanyId === fx.companyA)
}

// ───────────────────── VUL-H6 — SA GLOBAL LISTS VIA ADMIN DB ─────────────────────
if (mode === 'full') {
  {
    const r = await api(tSa, '/api/users')
    const audit = await db.auditLog.findFirst({
      where: { action: 'ADMIN_ACCESS', resource: 'User', details: { contains: 'READ_DIRECTORY' } },
      orderBy: { createdAt: 'desc' },
    })
    push('H6-1', 'SA → /api/users global → admin-db + AuditLog', '200 users + audit', `HTTP ${r.status} users=${Array.isArray(r.body?.users)} audit=${!!audit}`, r.status === 200 && Array.isArray(r.body?.users) && !!audit)
  }
  {
    const r = await api(tSa, '/api/interviews')
    const audit = await db.auditLog.findFirst({
      where: { action: 'ADMIN_ACCESS', resource: 'InterviewSchedule', details: { contains: 'READ_DIRECTORY' } },
      orderBy: { createdAt: 'desc' },
    })
    push('H6-2', 'SA → /api/interviews global → admin-db + AuditLog', '200 interviews + audit', `HTTP ${r.status} interviews=${Array.isArray(r.body?.interviews)} audit=${!!audit}`, r.status === 200 && Array.isArray(r.body?.interviews) && !!audit)
  }
  {
    const r = await api(tSa, '/api/vacancies')
    const audit = await db.auditLog.findFirst({
      where: { action: 'ADMIN_ACCESS', resource: 'Vacancy', details: { contains: 'READ_DIRECTORY' } },
      orderBy: { createdAt: 'desc' },
    })
    push('H6-3', 'SA → /api/vacancies global → admin-db + AuditLog', '200 vacancies + audit', `HTTP ${r.status} vacancies=${Array.isArray(r.body?.vacancies)} audit=${!!audit}`, r.status === 200 && Array.isArray(r.body?.vacancies) && !!audit)
  }
  {
    const r = await api(tSa, '/api/positions?all=true')
    const audit = await db.auditLog.findFirst({
      where: { action: 'ADMIN_ACCESS', resource: 'Position', details: { contains: 'READ_CATALOG' } },
      orderBy: { createdAt: 'desc' },
    })
    push('H6-4', 'SA → /api/positions?all=true → admin-db + AuditLog', '200 positions + audit', `HTTP ${r.status} positions=${Array.isArray(r.body?.positions)} audit=${!!audit}`, r.status === 200 && Array.isArray(r.body?.positions) && !!audit)
  }
} else {
  {
    const r = await api(tSa, '/api/users')
    push('H6-F1', 'SA → /api/users global SIN ADMIN_DATABASE_URL → FAIL CLOSED', '500 sin datos', `HTTP ${r.status} users=${r.body?.users === undefined ? 'undefined' : 'LEAKED'}`, r.status === 500 && r.body?.users === undefined)
  }
  {
    const r = await api(tSa, '/api/interviews')
    push('H6-F2', 'SA → /api/interviews global SIN admin URL → FAIL CLOSED', '500', `HTTP ${r.status} interviews=${r.body?.interviews === undefined ? 'undefined' : 'LEAKED'}`, r.status === 500 && r.body?.interviews === undefined)
  }
  {
    const r = await api(tSa, '/api/vacancies')
    push('H6-F3', 'SA → /api/vacancies global SIN admin URL → FAIL CLOSED', '500', `HTTP ${r.status} vacancies=${r.body?.vacancies === undefined ? 'undefined' : 'LEAKED'}`, r.status === 500 && r.body?.vacancies === undefined)
  }
  {
    const r = await api(tSa, '/api/positions?all=true')
    push('H6-F4', 'SA → /api/positions?all=true SIN admin URL → FAIL CLOSED', '500', `HTTP ${r.status} positions=${r.body?.positions === undefined ? 'undefined' : 'LEAKED'}`, r.status === 500 && r.body?.positions === undefined)
  }
}
{
  const r = await api(tRhA, '/api/positions?all=true')
  push('H6-5', 'RH → positions?all=true → 403', '403', `HTTP ${r.status}`, r.status === 403)
}
{
  const r = await api(tRhA, `/api/users?companyId=${fx.companyB}`)
  const rows = r.body?.users || []
  const foreign = rows.filter((u: any) => u.companyId !== fx.companyA)
  push('H6-6', 'RH-A → users?companyId=B → parámetro ignorado, solo empresa A', '200 solo A', `HTTP ${r.status} rows=${rows.length} foreign=${foreign.length}`, r.status === 200 && foreign.length === 0)
}
{
  const r = await api(tSa, `/api/users?companyId=${fx.companyB}`)
  const rows = r.body?.users || []
  const wrong = rows.filter((u: any) => u.companyId !== fx.companyB)
  push('H6-7', 'SA → users?companyId=B → impersonation scoped a B', '200 solo B', `HTTP ${r.status} rows=${rows.length} wrong=${wrong.length}`, r.status === 200 && wrong.length === 0)
}
{
  const r = await api(tCandA, '/api/users')
  push('H6-8', 'CAND-A → users → 403', '403', `HTTP ${r.status}`, r.status === 403)
}

// ───────────────────── PARTE 22 — AUDIT TRAIL OF DENIED ATTEMPTS ─────────────────────
{
  const candAttempts = await db.auditLog.count({
    where: { actorId: fx.candA, action: 'UNAUTHORIZED_ATTEMPT' },
  })
  push('AUD-1', 'CAND-A denied attempts → AuditLog UNAUTHORIZED_ATTEMPT', '≥6 entradas', `${candAttempts} entradas`, candAttempts >= 6)
}
{
  const reassignDenied = await db.auditLog.count({
    where: { actorId: fx.rhA, action: 'UNAUTHORIZED_ATTEMPT', resource: 'User', details: { contains: 'reassign' } },
  })
  push('AUD-2', 'RH reasignación companyId denegada → AuditLog', '≥1 entrada', `${reassignDenied} entradas`, reassignDenied >= 1)
}
{
  const invDenied = await db.auditLog.count({
    where: { action: 'UNAUTHORIZED_ATTEMPT', resource: 'CandidateInvitation' },
  })
  push('AUD-3', 'CAND/RH invite deletion denegada → AuditLog', '≥1 entrada', `${invDenied} entradas`, invDenied >= 1)
}
{
  // Cross-tenant repeat (A/B) — RH-A result B still 404 without existence leak
  const r = await api(tRhA, `/api/results?resultId=${fx.resB}`)
  push('XT-1', 'cross-tenant: RH-A → resultId B → 404 sin existencia', '404', `HTTP ${r.status}`, r.status === 404)
}

// ───────────────────── SUMMARY ─────────────────────
const failed = results.filter(r => !r.pass)
console.log(`\n═══ SUMMARY (h-tests ${mode}) — ${results.length} checks, ${failed.length} failed ═══`)
if (failed.length) console.log('FAILED:', failed.map(f => f.id).join(', '))

writeFileSync(join(import.meta.dir, `h-test-results-${mode}.json`), JSON.stringify(results, null, 2))
await db.$disconnect()
process.exit(failed.length ? 1 : 0)
