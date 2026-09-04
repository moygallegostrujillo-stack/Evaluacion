// @ts-nocheck — D.2.6 test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-D.2.6 — FASE 16 SNAPSHOT CAPTURE
 *
 * Usage: bun scripts/d26-snapshot.ts before|after
 * Captures /api/results responses for every legitimate access path.
 * The before/after files must be byte-identical (FASE 20: NO CAMBIO DE LÓGICA).
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { mintToken, apiGet } from './d26-lib'

const mode = process.argv[2]
if (mode !== 'before' && mode !== 'after') {
  console.error('usage: bun scripts/d26-snapshot.ts before|after')
  process.exit(1)
}

const fx = JSON.parse(readFileSync(join(import.meta.dir, 'd26-fixture.json'), 'utf8'))

const rhA = await mintToken({ sub: fx.rhA, email: fx.emailRhA, name: 'D26 RH A', role: 'RH', companyId: fx.companyA, companyName: 'D26 Empresa A' })
const rhB = await mintToken({ sub: fx.rhB, email: fx.emailRhB, name: 'D26 RH B', role: 'RH', companyId: fx.companyB, companyName: 'D26 Empresa B' })
const sa = await mintToken({ sub: fx.sa, email: fx.emailSa, name: 'D26 Super Admin', role: 'SUPER_ADMIN' })
const candA = await mintToken({ sub: fx.candA, email: fx.emailCandA, name: 'D26 Candidato A', role: 'CANDIDATO', companyId: fx.companyA })

const shots: Array<{ name: string; token: string; path: string }> = [
  { name: '01_rhA_resultId_resA', token: rhA, path: `/api/results?resultId=${fx.resA}` },
  { name: '02_rhA_resultId_resA2', token: rhA, path: `/api/results?resultId=${fx.resA2}` },
  { name: '03_rhA_resultId_appA', token: rhA, path: `/api/results?resultId=${fx.appA}` },
  { name: '04_rhB_resultId_resB', token: rhB, path: `/api/results?resultId=${fx.resB}` },
  { name: '05_rhB_resultId_appB', token: rhB, path: `/api/results?resultId=${fx.appB}` },
  { name: '06_rhA_candidateId_candA', token: rhA, path: `/api/results?candidateId=${fx.candA}` },
  { name: '07_rhA_all_results', token: rhA, path: `/api/results` },
  { name: '08_rhB_all_results', token: rhB, path: `/api/results` },
  { name: '09_rhA_compare_resA_resA2', token: rhA, path: `/api/results?compareIds=${fx.resA},${fx.resA2}` },
  { name: '10_rhA_compare_resA_appA', token: rhA, path: `/api/results?compareIds=${fx.resA},${fx.appA}` },
  { name: '11_sa_aggregate', token: sa, path: `/api/results` },
  { name: '12_sa_impersonateA_resultId_resA', token: sa, path: `/api/results?companyId=${fx.companyA}&resultId=${fx.resA}` },
  { name: '13_sa_impersonateA_all', token: sa, path: `/api/results?companyId=${fx.companyA}` },
  { name: '14_candA_own_results', token: candA, path: `/api/results` },
  { name: '15_candA_own_candidateId', token: candA, path: `/api/results?candidateId=${fx.candA}` },
  { name: '16_rhA_all_results_page2shape', token: rhA, path: `/api/results?candidateId=${fx.candA2}` },
]

const out: Record<string, { status: number; body: unknown }> = {}
for (const s of shots) {
  const r = await apiGet(s.token, s.path)
  out[s.name] = { status: r.status, body: r.body }
  console.log(`[${s.name}] status=${r.status} bytes=${r.text.length}`)
}

const file = join(import.meta.dir, `d26-snapshot-${mode}.json`)
writeFileSync(file, JSON.stringify(out, null, 2))
console.log(`[d26-snapshot] ${mode} → ${file}`)
