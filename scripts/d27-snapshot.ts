// @ts-nocheck — D.2.7 test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-D.2.7 — Dashboard response snapshot (before/after migration).
 *
 * Usage:
 *   bun scripts/d27-snapshot.ts pre
 *   bun scripts/d27-snapshot.ts post
 *
 * Captures the exact JSON returned by /api/dashboard for every access mode:
 *   - tenant (RH-A, RH-B)
 *   - spoofing attempts (RH-A + companyId=B, RH-A + targetCompanyId=B)
 *   - SA impersonation (SA + companyId=B)
 *   - SA aggregate (SA, no target)
 *   - CANDIDATO (role-gate evidence)
 *   - no token
 *
 * Zero-functional-change rule (FASE 16/20): tenant + impersonation snapshots
 * must be byte-identical between pre and post. The aggregate and CANDIDATO
 * snapshots are EXPECTED to change (documented, security-driven).
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { mintToken, apiGet } from './d26-lib'

const phase = process.argv[2] === 'post' ? 'post' : 'pre'
const fx = JSON.parse(readFileSync(join(import.meta.dir, 'd26-fixture.json'), 'utf8'))

const tRhA = await mintToken({ sub: fx.rhA, email: fx.emailRhA, name: 'D26 RH A', role: 'RH', companyId: fx.companyA })
const tRhB = await mintToken({ sub: fx.rhB, email: fx.emailRhB, name: 'D26 RH B', role: 'RH', companyId: fx.companyB })
const tSa = await mintToken({ sub: fx.sa, email: fx.emailSa, name: 'D26 Super Admin', role: 'SUPER_ADMIN' })
const tCandA = await mintToken({ sub: fx.candA, email: fx.emailCandA, name: 'D26 Candidato A', role: 'CANDIDATO', companyId: fx.companyA })

const snapshot: Record<string, { status: number; body: unknown }> = {}

async function cap(key: string, token: string | null, path: string) {
  const res = await fetch(`http://localhost:3000${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const text = await res.text()
  let body: unknown = text
  try { body = JSON.parse(text) } catch { /* keep raw */ }
  snapshot[key] = { status: res.status, body }
  console.log(`[${phase}] ${key}: HTTP ${res.status}`)
}

// Tenant mode
await cap('dashRhA', tRhA, '/api/dashboard')
await cap('dashRhB', tRhB, '/api/dashboard')

// Spoofing attempts (must be ignored → identical to own-tenant data)
await cap('dashRhA_companyIdB', tRhA, `/api/dashboard?companyId=${fx.companyB}`)
await cap('dashRhA_targetB', tRhA, `/api/dashboard?targetCompanyId=${fx.companyB}`)

// SA impersonation
await cap('dashSaImpB', tSa, `/api/dashboard?companyId=${fx.companyB}`)

// SA aggregate
await cap('dashSaAgg', tSa, '/api/dashboard')

// CANDIDATO role-gate evidence
await cap('dashCandA', tCandA, '/api/dashboard')

// No token
await cap('dashNoToken', null, '/api/dashboard')

writeFileSync(join(import.meta.dir, `d27-snapshot-${phase}.json`), JSON.stringify(snapshot, null, 2))
console.log(`snapshot → scripts/d27-snapshot-${phase}.json`)
