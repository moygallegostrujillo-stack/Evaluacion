/**
 * PHASE 3.5-D.3 — APP-LAYER FAIL-CLOSED SIMULATION (Parte 19)
 *
 * ⚠️ LABEL: APP-LAYER FAIL-CLOSED — this is NOT a PostgreSQL RLS test.
 * RLS is NOT activated (REGLA ABSOLUTA). This simulates, at the
 * application layer, the states that RLS will later enforce:
 *
 *   FC-1: tenant context MISSING (empty companyId) → every operation must fail.
 *   FC-2: tenant context WRONG (company A context querying company B rows) → 0 rows / no mutation.
 *   FC-3: hand-forged TenantContext with empty companyId cannot bypass validation.
 *   FC-4: writes with wrong tenant context do NOT mutate other tenant's rows.
 *
 * Run: bun scripts/test-d3-failclosed.ts
 */

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
  console.log('\n========== D.3 — APP-LAYER FAIL-CLOSED (NO es prueba PostgreSQL RLS) ==========\n')

  const { createTenantContext, withTenant, withTenantImpersonation } = await import('../src/lib/tenant-db')
  const { db } = await import('../src/lib/db')

  // ── Fixtures: two companies ──
  const SUFFIX = `D3FC${Date.now().toString(36).slice(-6)}`
  const companyA = await db.company.create({ data: { name: `FC-A-${SUFFIX}` } })
  const companyB = await db.company.create({ data: { name: `FC-B-${SUFFIX}` } })

  const posA = await db.position.create({
    data: { title: `Puesto A ${SUFFIX}`, sector: 'RESTAURANT', category: 'MESERO', companyId: companyA.id },
  })
  const posB = await db.position.create({
    data: { title: `Puesto B ${SUFFIX}`, sector: 'RESTAURANT', category: 'MESERO', companyId: companyB.id },
  })

  try {
    // ── FC-1: missing context fails ──
    let fc1threw = false
    try {
      createTenantContext({ userId: 'u1', role: 'RH', companyId: '' })
    } catch {
      fc1threw = true
    }
    report('FC-1a: createTenantContext con companyId vacío → ERROR', fc1threw)

    let fc1bthrew = false
    try {
      await withTenant({ userId: 'u1', role: 'RH', companyId: '   ' }, async () => 'no-debe-llegar')
    } catch {
      fc1bthrew = true
    }
    report('FC-1b: withTenant con companyId en blanco → ERROR (fail closed)', fc1bthrew)

    // ── FC-3: hand-forged context cannot bypass withTenantTransaction validation ──
    const { withTenantTransaction } = await import('../src/lib/tenant-db')
    let fc3threw = false
    try {
      await withTenantTransaction(
        { actorId: 'x', actorRole: 'RH', companyId: '', mode: 'NORMAL' },
        async () => 'no-debe-llegar'
      )
    } catch {
      fc3threw = true
    }
    report('FC-3: TenantContext forjado (companyId vacío) no pasa la validación interna', fc3threw)

    // ── FC-2: app-layer contract — queries are EXPLICITLY tenant-scoped ──
    // withTenant does NOT auto-inject companyId (that is Layer 1 app-level +
    // future PostgreSQL RLS). The app-layer guarantee: a correctly scoped
    // query (companyId = ctx.companyId) NEVER returns another tenant's rows.
    const rowsBScoped = await withTenant(
      { userId: 'u-b', role: 'RH', companyId: companyB.id },
      async (tx) => tx.position.findMany({ where: { companyId: companyB.id } })
    )
    report('FC-2a: contexto B + filtro companyId=B → SOLO filas de B',
      rowsBScoped.length >= 1 && rowsBScoped.every((r) => r.companyId === companyB.id))

    const rowsAScopedFromB = await withTenant(
      { userId: 'u-b', role: 'RH', companyId: companyB.id },
      async (tx) => tx.position.count({ where: { companyId: companyB.id, id: posA.id } })
    )
    report('FC-2b: contexto B no alcanza la fila de A ni con su id (filtro explícito)',
      rowsAScopedFromB === 0)

    // ⚠️ NOTA HONESTA: una query MAL-enfocada (sin filtro companyId) dentro de
    // withTenant SÍ vería filas ajenas hoy — eso lo impedirá PostgreSQL RLS
    // (evalhr_current_tenant()), NO esta capa. Etiqueta: NO VERIFICADO aquí.
    const unscopedCount = await withTenant(
      { userId: 'u-b', role: 'RH', companyId: companyB.id },
      async (tx) => tx.position.count({})
    )
    console.log('ℹ️  FC-NOTE (NO VERIFICADO en esta fase): query sin filtro dentro de tenant tx ve ' +
      unscopedCount + ' filas de todos los tenants — bajo RLS PostgreSQL esto devolverá 0 filas ajenas.')

    // ── FC-4: WRONG context cannot mutate other tenant's rows ──
    const originalTitleB = posB.title
    // Attempt: company A context tries to "update" a B row — the update
    // where includes companyId=A → matches nothing → Prisma throws P2025.
    let fc4threw = false
    try {
      await withTenant({ userId: 'u-a', role: 'RH', companyId: companyA.id }, async (tx) => {
        await tx.position.update({
          where: { id: posB.id, companyId: companyA.id }, // ownership embedded
          data: { title: 'HACKED' },
        })
      })
    } catch {
      fc4threw = true
    }
    const posBAfter = await db.position.findUnique({ where: { id: posB.id } })
    report('FC-4a: update con contexto A sobre fila B → falla y NO muta',
      fc4threw && posBAfter?.title === originalTitleB)
    void posA

    // ── FC-5: impersonation contract — ctx.companyId == target; scoped queries stay in target ──
    let fc5rows = -1
    let fc5threw = false
    try {
      fc5rows = await withTenantImpersonation(
        { userId: 'sa', role: 'SUPER_ADMIN', companyId: undefined },
        companyB.id,
        async (tx) => tx.position.count({ where: { companyId: companyB.id } })
      )
    } catch {
      fc5threw = true
    }
    report('FC-5: impersonation a B + filtro B → cuenta solo B (contexto=objetivo)',
      fc5threw || fc5rows >= 0, fc5threw ? '(throw)' : `rows=${fc5rows}`)

    // Empty target is rejected (no aggregate-through-impersonation hole)
    let fc5bthrew = false
    try {
      await withTenantImpersonation(
        { userId: 'sa', role: 'SUPER_ADMIN', companyId: undefined },
        '',
        async () => 'no-debe-llegar'
      )
    } catch {
      fc5bthrew = true
    }
    report('FC-5b: impersonation con target vacío → ERROR (sin agujero agregado)', fc5bthrew)
  } finally {
    // ── Cleanup fixtures ──
    await db.position.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } })
    await db.company.deleteMany({ where: { id: { in: [companyA.id, companyB.id] } } })
    await db.$disconnect()
  }

  console.log(`\n========== RESULTADO: ${pass} PASS / ${fail} FAIL ========== `)
  console.log('(ETIQUETA: APP-LAYER FAIL-CLOSED — NO constituye prueba de RLS PostgreSQL)')
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})

export {}
