/**
 * PHASE 3.5-D.3 — INVARIANT TESTS (Partes 14/15)
 *
 * Formal invariants:
 *   EvaluationResponse.companyId          == EvaluationSession.companyId
 *   EvaluationTemplate.companyId          == Position.companyId
 *   VacancyQuestion.companyId             == Vacancy.companyId
 *   VacancyApplicationResponse.companyId  == VacancyApplication.companyId
 *
 * Checks:
 *   1. DB state — every child row matches its parent (0 orphans allowed).
 *   2. Write paths — the code stamps companyId at every create site
 *      (static assertion over the route sources).
 *   3. No code path allows changing child.companyId independently
 *      (update calls on children never include companyId in `data`).
 *
 * Run: bun scripts/test-d3-invariants.ts
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
  console.log('\n========== D.3 — INVARIANTES companyId INDIRECTOS ==========\n')

  // ── 1. DB state checks ──
  const { db } = await import('../src/lib/db')

  // Portable approach (works on SQLite): load pairs and compare in JS
  const [responses, sessions, templates, positions, vQuestions, vacancies, vaResponses, applications] =
    await Promise.all([
      db.evaluationResponse.findMany({ select: { id: true, companyId: true, sessionId: true } }),
      db.evaluationSession.findMany({ select: { id: true, companyId: true } }),
      db.evaluationTemplate.findMany({ select: { id: true, companyId: true, positionId: true } }),
      db.position.findMany({ select: { id: true, companyId: true } }),
      db.vacancyQuestion.findMany({ select: { id: true, companyId: true, vacancyId: true } }),
      db.vacancy.findMany({ select: { id: true, companyId: true } }),
      db.vacancyApplicationResponse.findMany({ select: { id: true, companyId: true, applicationId: true } }),
      db.vacancyApplication.findMany({ select: { id: true, companyId: true } }),
    ])

  const sessionMap = new Map(sessions.map((s) => [s.id, s.companyId]))
  const positionMap = new Map(positions.map((p) => [p.id, p.companyId]))
  const vacancyMap = new Map(vacancies.map((v) => [v.id, v.companyId]))
  const appMap = new Map(applications.map((a) => [a.id, a.companyId]))

  const badResponses = responses.filter((r) => !r.companyId || sessionMap.get(r.sessionId) !== r.companyId)
  const badTemplates = templates.filter((t) => !t.companyId || positionMap.get(t.positionId) !== t.companyId)
  const badVQuestions = vQuestions.filter((q) => !q.companyId || vacancyMap.get(q.vacancyId) !== q.companyId)
  const badVaResponses = vaResponses.filter((r) => !r.companyId || appMap.get(r.applicationId) !== r.companyId)

  report('INV-1: EvaluationResponse.companyId == EvaluationSession.companyId (y no NULL)',
    badResponses.length === 0, `${responses.length} filas, ${badResponses.length} inválidas`)
  report('INV-2: EvaluationTemplate.companyId == Position.companyId (y no NULL)',
    badTemplates.length === 0, `${templates.length} filas, ${badTemplates.length} inválidas`)
  report('INV-3: VacancyQuestion.companyId == Vacancy.companyId (y no NULL)',
    badVQuestions.length === 0, `${vQuestions.length} filas, ${badVQuestions.length} inválidas`)
  report('INV-4: VacancyApplicationResponse.companyId == VacancyApplication.companyId (y no NULL)',
    badVaResponses.length === 0, `${vaResponses.length} filas, ${badVaResponses.length} inválidas`)

  // ── 2. Write-path static assertions ──
  const fs = await import('fs')

  const checks: { file: string; mustContain: string; label: string }[] = [
    {
      file: 'src/app/api/evaluations/route.ts',
      mustContain: 'companyId: session.companyId',
      label: 'evaluations: EvaluationResponse.create estampa companyId',
    },
    {
      file: 'src/lib/generate-templates.ts',
      mustContain: 'const companyId = position.companyId',
      label: 'generate-templates: companyId resuelto desde Position',
    },
    {
      file: 'src/lib/generate-templates.ts',
      mustContain: 'companyId,',
      label: 'generate-templates: templates/questions creados con companyId',
    },
    {
      file: 'src/app/api/vacancies/route.ts',
      mustContain: 'companyId,\n                })),',
      label: 'vacancies: nested VacancyQuestion.create estampa companyId',
    },
    {
      file: 'src/app/api/vacancies/[id]/questions/route.ts',
      mustContain: 'companyId: vacancy.companyId',
      label: 'vacancy questions: create estampa companyId',
    },
    {
      file: 'src/app/api/vacancies/[id]/generate-questions/route.ts',
      mustContain: 'companyId: vacancy.companyId',
      label: 'generate-questions: create estampa companyId',
    },
    {
      file: 'src/app/api/public/apply/route.ts',
      mustContain: 'companyId: application.companyId',
      label: 'public apply: VacancyApplicationResponse.create estampa companyId',
    },
  ]
  for (const c of checks) {
    const ok = fs.existsSync(c.file) && fs.readFileSync(c.file, 'utf-8').includes(c.mustContain)
    report(`WRITE-PATH: ${c.label}`, ok, c.file)
  }

  // ── 3. No update path mutates child.companyId independently ──
  const childFiles = [
    'src/app/api/evaluations/route.ts',
    'src/app/api/vacancies/[id]/questions/route.ts',
    'src/app/api/vacancies/[id]/generate-questions/route.ts',
    'src/app/api/public/apply/route.ts',
  ]
  let mutationFree = true
  const offenders: string[] = []
  for (const f of childFiles) {
    const src = fs.readFileSync(f, 'utf-8')
    const callRe = /(evaluationResponse|vacancyQuestion|vacancyApplicationResponse)\.(update|updateMany)\(/g
    let m: RegExpExecArray | null
    while ((m = callRe.exec(src)) !== null) {
      // From the call site, locate the FIRST `data: {` and scan ONLY its
      // brace-balanced block — avoids false positives from later statements.
      const after = src.slice(m.index, m.index + 800)
      const dataIdx = after.indexOf('data: {')
      if (dataIdx === -1) continue
      let depth = 0
      let end = -1
      for (let i = dataIdx + 6; i < after.length; i++) {
        if (after[i] === '{') depth++
        else if (after[i] === '}') {
          depth--
          if (depth === 0) {
            end = i
            break
          }
        }
      }
      if (end === -1) continue
      const dataBlock = after.slice(dataIdx + 6, end + 1)
      if (/companyId\s*:/.test(dataBlock)) {
        mutationFree = false
        offenders.push(`${f}: ${m[1]}.${m[2]} data block sets companyId`)
      }
    }
  }
  report('IMMUTABLE: ningún update de modelos hijos cambia companyId', mutationFree,
    offenders.join(' | ') || 'sin incidencias')

  await db.$disconnect()
  console.log(`\n========== RESULTADO: ${pass} PASS / ${fail} FAIL ==========`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})

export {}
