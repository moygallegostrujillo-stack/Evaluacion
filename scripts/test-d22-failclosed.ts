/**
 * PHASE 3.5-D.2.2 — withTenantTransaction fail-closed tests
 *
 * 1. Context validation: empty/null/whitespace companyId must throw.
 * 2. Rollback: an error inside the callback must roll back ALL writes.
 * 3. SET LOCAL failure handling:
 *      - dev  + SQLite  → swallowed (dev compatibility), write persists
 *      - prod + SQLite  → ABORT (fail-closed), write must NOT persist
 *
 * Run (dev):      bun scripts/test-d22-failclosed.ts dev
 * Run (prod sim): NODE_ENV=production bun scripts/test-d22-failclosed.ts prod
 */
import { db } from '../src/lib/db'
import {
  createTenantContext,
  createTenantContextForImpersonation,
  withTenantTransaction,
} from '../src/lib/tenant-db'

const mode = process.argv[2] === 'prod' ? 'prod' : 'dev'
let passed = 0
let failed = 0

function report(name: string, ok: boolean, detail = '') {
  if (ok) {
    passed++
    console.log(`  PASS  ${name}`)
  } else {
    failed++
    console.log(`  FAIL  ${name} ${detail}`)
  }
}

async function main() {
  const suffix = Date.now().toString(36)
  console.log(`=== D.2.2 FAIL-CLOSED TESTS (mode=${mode}, NODE_ENV=${process.env.NODE_ENV}, DATABASE_URL=${process.env.DATABASE_URL}) ===`)

  // ── 1. Context validation ──
  console.log('[1] TenantContext validation')
  const invalid: unknown[] = ['', '   ', undefined, null, 123]
  let allRejected = true
  for (const bad of invalid) {
    try {
      createTenantContext({ userId: 'u1', role: 'RH', companyId: bad as string })
      allRejected = false
    } catch {
      /* expected */
    }
    try {
      createTenantContextForImpersonation({ userId: 'u1', role: 'SUPER_ADMIN' }, bad as string)
      allRejected = false
    } catch {
      /* expected */
    }
  }
  // hand-constructed context must also be rejected by withTenantTransaction
  let handConstructedRejected = true
  try {
    await withTenantTransaction(
      { actorId: 'u1', actorRole: 'RH', companyId: '', mode: 'NORMAL' },
      async () => 1
    )
    handConstructedRejected = false
  } catch {
    /* expected */
  }
  // valid context must NOT throw at construction
  let validAccepted = true
  try {
    const ctx = createTenantContext({ userId: 'u1', role: 'RH', companyId: 'company-x' })
    validAccepted = ctx.companyId === 'company-x' && ctx.mode === 'NORMAL'
  } catch {
    validAccepted = false
  }
  report('context: companyId vacío/null/no-string rechazado', allRejected)
  report('context: contexto hand-made sin companyId rechazado por withTenantTransaction', handConstructedRejected)
  report('context: companyId válido aceptado', validAccepted)

  // ── 2. Rollback on callback error (dev mode) ──
  if (mode === 'dev') {
    console.log('[2] Rollback on callback error')
    let rollbackOk = false
    try {
      await withTenantTransaction(
        { actorId: 'u1', actorRole: 'RH', companyId: 'rollback-test', mode: 'NORMAL' },
        async (tx) => {
          await tx.company.create({ data: { name: `D22-ROLLBACK-${suffix}` } })
          throw new Error('BOOM — intentional error inside transaction')
        }
      )
    } catch {
      /* expected */
    }
    const leftover = await db.company.findFirst({ where: { name: `D22-ROLLBACK-${suffix}` } })
    rollbackOk = leftover === null
    if (leftover) await db.company.delete({ where: { id: leftover.id } })
    report('rollback: error en callback revierte TODOS los writes', rollbackOk)
  }

  // ── 3. SET LOCAL failure semantics ──
  console.log('[3] SET LOCAL failure semantics')
  const companyName = `D22-SETLOCAL-${mode}-${suffix}`
  let txError: unknown = null
  try {
    await withTenantTransaction(
      { actorId: 'u1', actorRole: 'RH', companyId: 'setlocal-test', mode: 'NORMAL' },
      async (tx) => {
        await tx.company.create({ data: { name: companyName } })
        return 'committed'
      }
    )
  } catch (e) {
    txError = e
  }
  const persisted = await db.company.findFirst({ where: { name: companyName } })
  if (persisted) await db.company.delete({ where: { id: persisted.id } })

  if (mode === 'dev') {
    // SQLite + dev: SET LOCAL error swallowed → write persists
    report('dev+SQLite: SET LOCAL tolerado, write persiste (compatibilidad)',
      txError === null && persisted !== null)
  } else {
    // NODE_ENV=production + SQLite: SET LOCAL failure MUST abort the
    // transaction: the error propagates AND no data is persisted.
    report('prod: fallo SET LOCAL propaga el error (aborta transacción)',
      txError !== null)
    report('prod: fallo SET LOCAL no persiste datos (fail-closed)',
      txError !== null && persisted === null)
  }

  console.log('\n========================================')
  console.log(`RESULT (${mode}): ${passed} PASS / ${failed} FAIL`)
  process.exit(failed === 0 ? 0 : 1)
}

main().catch(e => {
  console.error('FATAL:', e)
  process.exit(1)
})
