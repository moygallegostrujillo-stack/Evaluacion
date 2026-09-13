/**
 * A-03.2 PASO 13 — Clasificación de datos existentes (SOLO LECTURA).
 *
 * Ejecutar: bun scripts/a032-classify-knowledge.ts
 *
 * Clasifica las preguntas de conocimiento existentes en:
 *   A — correctAnswer válida (dentro del rango de opciones)
 *   B — correctAnswer ausente (null)
 *   C — correctAnswer dudosa (fuera de rango / opciones inválidas)
 *   D — pregunta legacy (auto-reporte KS-3 del banco genérico retirado)
 *
 * NO modifica datos: no inventa claves, no recalcula resultados históricos.
 * Los resultados (EvaluationResult / VacancyApplication) solo se reportan.
 */
import { getUnscopedClient } from '../src/lib/rls'

const LEGACY_SELF_REPORT_PATTERNS = [
  '¿Conoce ',
  '¿Sabe cómo',
  '¿Comprende las',
  '¿Puede explicar el proceso',
]

async function main() {
  const db = getUnscopedClient()

  const knowledgeQuestions = await db.question.findMany({
    where: { category: 'KNOWLEDGE', type: 'MULTIPLE_CHOICE' },
    select: {
      id: true,
      text: true,
      options: true,
      correctAnswer: true,
      knowledgeStatus: true,
      itemVersion: true,
      evaluationTemplateId: true,
      createdAt: true,
    },
  })

  const classes = { A: 0, B: 0, C: 0, D: 0 } as Record<'A' | 'B' | 'C' | 'D', number>
  const detail: Array<{ id: string; cls: string; text: string; key: number | null; status: string | null }> = []

  for (const q of knowledgeQuestions) {
    let optionCount: number | null = null
    try {
      const parsed = q.options ? JSON.parse(q.options) : null
      optionCount = Array.isArray(parsed) ? parsed.length : null
    } catch {
      optionCount = null
    }

    const isLegacySelfReport = LEGACY_SELF_REPORT_PATTERNS.some((p) => q.text.startsWith(p))

    let cls: 'A' | 'B' | 'C' | 'D'
    if (isLegacySelfReport) {
      cls = 'D'
    } else if (q.correctAnswer === null || q.correctAnswer === undefined) {
      cls = 'B'
    } else if (
      optionCount !== null &&
      (q.correctAnswer < 0 || q.correctAnswer >= optionCount)
    ) {
      cls = 'C'
    } else {
      cls = 'A'
    }
    classes[cls]++
    detail.push({
      id: q.id,
      cls,
      text: q.text.slice(0, 60),
      key: q.correctAnswer,
      status: q.knowledgeStatus,
    })
  }

  const results = await db.evaluationResult.findMany({
    select: {
      id: true,
      knowledgeScore: true,
      knowledgeStatus: true,
      knowledgeScoringVersion: true,
      createdAt: true,
    },
  })

  const vacancyApps = await db.vacancyApplication.findMany({
    select: {
      id: true,
      knowledgeScore: true,
      knowledgeStatus: true,
      createdAt: true,
    },
  })

  console.log('=== A-03.2 PASO 13 — CLASIFICACIÓN DE PREGUNTAS KNOWLEDGE (solo lectura) ===')
  console.log(`Total preguntas KNOWLEDGE/MULTIPLE_CHOICE: ${knowledgeQuestions.length}`)
  console.log(`  A (clave válida):            ${classes.A}`)
  console.log(`  B (clave ausente):           ${classes.B}`)
  console.log(`  C (clave dudosa/fuera rango):${classes.C}`)
  console.log(`  D (legacy auto-reporte KS-3):${classes.D}`)
  console.log('')
  console.log('=== RESULTADOS (NO se recalculan — solo reporte) ===')
  console.log(`EvaluationResult: ${results.length}`)
  for (const r of results) {
    console.log(
      `  - ${r.id.slice(0, 12)}… knowledgeScore=${r.knowledgeScore} knowledgeStatus=${r.knowledgeStatus ?? 'null (legacy)'} scoringVersion=${r.knowledgeScoringVersion ?? 'null (legacy)'}`
    )
  }
  console.log(`VacancyApplication: ${vacancyApps.length}`)
  for (const a of vacancyApps) {
    console.log(
      `  - ${a.id.slice(0, 12)}… knowledgeScore=${a.knowledgeScore} knowledgeStatus=${a.knowledgeStatus ?? 'null (legacy)'}`
    )
  }
  console.log('')
  console.log('=== TRATAMIENTO POR CATEGORÍA (definido en 06-migration-impact.md) ===')
  console.log('A: se conservan tal cual; ya aptas para scoring.')
  console.log('B: se conservan con clave null; bajo el nuevo scoring son NOT_SCORABLE → INSUFFICIENT.')
  console.log('C: se conservan; marcadas para revisión humana (gobernanza). NO se autocorrigen.')
  console.log('D: se conservan como histórico; NO se administran a candidatos nuevos (banco retirado).')
  console.log('')
  console.log('=== DETALLE ===')
  for (const d of detail) {
    console.log(`  [${d.cls}] ${d.id.slice(0, 12)}… key=${d.key} status=${d.status ?? '-'} :: ${d.text}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
