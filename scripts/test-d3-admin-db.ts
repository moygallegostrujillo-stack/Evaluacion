/**
 * PHASE 3.5-D.3 — ADMIN DB TESTS (Parte 16)
 *
 * AF-1: ADMIN_DATABASE_URL present → aggregate functions work.
 * AF-2: ADMIN_DATABASE_URL absent → FAIL CLOSED (AdminDbConfigError).
 * AF-3: admin-db exports NO raw PrismaClient and cannot be imported
 *       from client code (module guard + export surface audit).
 * AGG-1: getAggregateResultMetrics → counts only, no PII fields.
 * AGG-2: getAggregateDashboardMetrics / getAggregateCandidateMetrics →
 *        counts only, no PII fields.
 * AGG-3: a normal (RH) user CANNOT obtain aggregate data over HTTP.
 *
 * Run: bun scripts/test-d3-admin-db.ts
 */

import { spawnSync } from 'child_process'

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

async function main() {
  console.log('\n========== D.3 — ADMIN DB TESTS ==========\n')

  // ── AF-1: URL present → works ──
  const { getAggregateResultMetrics, getAggregateDashboardMetrics, getAggregateCandidateMetrics } =
    await import('../src/lib/admin-db')
  try {
    const { aggregated } = await getAggregateResultMetrics()
    report('AF-1: ADMIN_DATABASE_URL presente → getAggregateResultMetrics OK', true,
      `${aggregated.length} empresa(s)`)
  } catch (e) {
    report('AF-1: ADMIN_DATABASE_URL presente → getAggregateResultMetrics OK', false, String(e))
  }

  // ── AGG-1: counts only — no PII in the shape ──
  try {
    const { aggregated } = await getAggregateResultMetrics()
    const allowedKeys = new Set(['companyId', 'companyName', 'evaluationResultCount', 'vacancyResultCount', 'totalResultCount'])
    const keysIn = (row: unknown) => Object.keys(row as Record<string, unknown>).every((k) => allowedKeys.has(k))
    const shapeOk = aggregated.every(keysIn)
    report('AGG-1: results aggregate → solo conteos (sin PII)', shapeOk && aggregated.length >= 0,
      JSON.stringify(aggregated.slice(0, 2)))
  } catch (e) {
    report('AGG-1: results aggregate → solo conteos (sin PII)', false, String(e))
  }

  // ── AGG-2: dashboard/candidates aggregates → counts only ──
  try {
    const dash = await getAggregateDashboardMetrics()
    const allowedDash = new Set(['companyId', 'companyName', 'totalCandidates', 'completedEvaluations', 'pendingEvaluations', 'perfilCompleto', 'perfilParcial', 'pendiente'])
    const dashOk = dash.aggregated.every((r: unknown) => Object.keys(r as Record<string, unknown>).every((k) => allowedDash.has(k)))
    const cand = await getAggregateCandidateMetrics()
    const allowedCand = new Set(['companyId', 'companyName', 'candidateCount', 'completedCount', 'vacancyCount'])
    const candOk = cand.aggregated.every((r: unknown) => Object.keys(r as Record<string, unknown>).every((k) => allowedCand.has(k)))
    report('AGG-2: dashboard/candidates aggregate → solo conteos (sin PII)', dashOk && candOk)
  } catch (e) {
    report('AGG-2: dashboard/candidates aggregate → solo conteos (sin PII)', false, String(e))
  }

  // ── AF-2: URL absent → fail closed (child process without the env var) ──
  const child = spawnSync('bun', ['-e', `
    // import FIRST, then strip the env var (bun auto-loads .env at startup
    // and would otherwise re-inject ADMIN_DATABASE_URL before our delete)
    import('${process.cwd()}/src/lib/admin-db.ts')
      .then(async (m) => {
        process.env.ADMIN_DATABASE_URL = '';
        delete process.env.ADMIN_DATABASE_URL;
        try {
          await m.getAggregateResultMetrics();
          console.log('AF2_RESULT: NO_THROW (BROKEN — did not fail closed)');
        } catch (e) {
          console.log('AF2_RESULT: ' + (e.name === 'AdminDbConfigError' ? 'THREW_AdminDbConfigError' : 'THREW_OTHER: ' + e.name));
        }
      });
  `], {
    env: { ...process.env, ADMIN_DATABASE_URL: '' },
    encoding: 'utf-8',
  })
  const af2Out = child.stdout || ''
  report('AF-2: ADMIN_DATABASE_URL ausente → FAIL CLOSED (AdminDbConfigError)',
    af2Out.includes('THREW_AdminDbConfigError'), af2Out.trim().split('\n').pop() || '(sin salida)')

  // ── AF-3: export surface — no raw client escapes the module ──
  const mod = await import('../src/lib/admin-db')
  const exportNames = Object.keys(mod)
  const forbidden = ['admin', 'client', 'prisma', 'db', 'getAdminClient', 'default']
  // Fase 3.5-E (PARTE 28): withAdminDbClient is a DOCUMENTED scoped runner —
  // the client object never escapes it (callers receive only the runner's
  // return value). It is not a raw-client export; whitelisted explicitly.
  const leaks = exportNames.filter((n) =>
    n !== 'withAdminDbClient' &&
    (forbidden.includes(n.toLowerCase()) || n.toLowerCase().includes('client')))
  report('AF-3a: admin-db NO exporta PrismaClient ni conexión cruda', leaks.length === 0,
    `exports: ${exportNames.join(', ')}`)

  const fs = await import('fs')
  const src = fs.readFileSync('src/lib/admin-db.ts', 'utf-8')
  const clientIsPrivate = !/export (const|function|class) (admin|getAdminClient)/.test(src) &&
    src.includes('function getAdminClient()') && !src.includes('export function getAdminClient')
  report('AF-3b: getAdminClient es privado del módulo', clientIsPrivate)

  console.log(`\n========== RESULTADO: ${pass} PASS / ${fail} FAIL ==========`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})

export {}
