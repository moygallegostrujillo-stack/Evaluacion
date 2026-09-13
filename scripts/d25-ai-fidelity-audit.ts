/**
 * FASE 10/15 — AI/Prompt functional non-change audit for
 * /api/vacancies/[id]/generate-questions
 *
 * Compares pre-migration (git HEAD) vs post-migration (working tree):
 *   1. Question banks + findRelevantQuestions (static content)
 *   2. callAI() (model, params, env fallback chain)
 *   3. System prompt (fully static)
 *   4. User prompt template (variables normalized: vacancyContext. → vacancy.)
 *   5. AI response parsing/filtering rules
 *   6. VacancyQuestion creation payload
 *
 * Run: bun scripts/d25-ai-fidelity-audit.ts
 */
import { createHash } from 'crypto'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const path = 'src/app/api/vacancies/[id]/generate-questions/route.ts'
const oldSrc = execSync(`git show HEAD:"${path}"`, { cwd: process.cwd() }).toString()
const newSrc = readFileSync(path, 'utf8')

function extract(src: string, startMarker: string, endMarker: string): string {
  const s = src.indexOf(startMarker)
  if (s === -1) throw new Error(`start marker not found: ${startMarker}`)
  const e = src.indexOf(endMarker, s)
  if (e === -1) throw new Error(`end marker not found: ${endMarker}`)
  return src.slice(s, e)
}

const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16)

// Normalize variable-source renames and whitespace so only REAL content
// differences show up as hash mismatches.
// - vacancyContext. → vacancy.   (context object rename, Fase D.2.5)
// - tx. / rlsDb.    → CLIENT.    (data-access client rename — the migration
//   itself; payload/logic after the client reference is compared verbatim)
const norm = (s: string) => s
  .replace(/vacancyContext\./g, 'vacancy.')
  .replace(/\b(?:tx|rlsDb|unscopedDb|db)\./g, 'CLIENT.')
  .replace(/\s+/g, ' ')
  .trim()

const segments: Array<{ name: string; old: string; new: string; normalize?: (s: string) => string }> = [
  {
    name: '1. POSITION_QUESTION_BANKS + SECTOR_QUESTION_BANKS + findRelevantQuestions',
    old: extract(oldSrc, '// POSITION-SPECIFIC QUESTION BANKS', '// AI Integration via'),
    new: extract(newSrc, '// POSITION-SPECIFIC QUESTION BANKS', '// AI Integration via'),
  },
  {
    name: '2. callAI() — modelo, parámetros, thinking:disabled, cadena de fallback',
    old: extract(oldSrc, 'async function callAI', '// ============================================\n// POST'),
    new: extract(newSrc, 'async function callAI', '// ============================================\n// POST'),
  },
  {
    name: '3. System prompt (estático)',
    old: extract(oldSrc, "role: 'assistant',", "role: 'user',"),
    new: extract(newSrc, "role: 'assistant',", "role: 'user',"),
  },
  {
    name: '4. User prompt (plantilla, variables normalizadas)',
    old: extract(oldSrc, "content: `Genera preguntas", 'Piensa en las tareas diarias'),
    new: extract(newSrc, "content: `Genera preguntas", 'Piensa en las tareas diarias'),
    normalize: norm,
  },
  {
    name: '5. Parsing/filtrado de respuesta IA',
    old: extract(oldSrc, 'if (aiResponse) {', '// Fallback: use position-specific'),
    new: extract(newSrc, 'if (aiResponse) {', '// Fallback: use position-specific'),
  },
  {
    name: '6. Payload de creación VacancyQuestion (data del create)',
    old: extract(oldSrc, 'const question = await rlsDb.vacancyQuestion.create', 'createdQuestions.push'),
    new: extract(newSrc, 'const question = await tx.vacancyQuestion.create', 'createdQuestions.push'),
    normalize: norm,
  },
]

console.log('=== FASE 10/15 — AUDITORÍA DE NO CAMBIO FUNCIONAL (IA/prompts) ===')
let allIdentical = true
for (const seg of segments) {
  const fn = seg.normalize ?? norm
  const hOld = hash(fn(seg.old))
  const hNew = hash(fn(seg.new))
  const same = hOld === hNew
  if (!same) allIdentical = false
  console.log(`  ${same ? 'IDENTICAL' : 'DIFFERS  '}  ${seg.name}`)
  console.log(`            old=${hOld} new=${hNew}`)
}

console.log(allIdentical
  ? '\nRESULT: 6/6 segmentos IDÉNTICOS — 0 cambios funcionales en IA/prompts/bancos/payload.'
  : '\nRESULT: ¡DIFERENCIA DETECTADA! — REGRESIÓN DE IA — DETENER.')
process.exit(allIdentical ? 0 : 1)
