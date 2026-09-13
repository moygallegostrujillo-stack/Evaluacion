/**
 * A-01.2 — Migración del instrumento psicométrico a IPIP-50-MX
 * ============================================================
 * Para cada posición:
 *  - Si su template PSICOMETRICA ya es IPIP-50-MX → SKIP.
 *  - Si el template legacy (10 preguntas Big Five, DEPRECIADO) NO tiene
 *    respuestas históricas → se DESACTIVA (se conserva el row para
 *    auditoría/histórico) y se crea el template IPIP-50-MX con los 50
 *    reactivos verbatim.
 *  - Si TIENE respuestas históricas → se CONSERVA (histórico; no se tocan
 *    datos ni scoring existente) y se reporta.
 *
 * Determinista e idempotente. NO modifica resultados, sesiones ni scoring.
 */
import { db } from '@/lib/db'
import { IPIP50_INSTRUMENT, ipip50QuestionData } from '@/lib/instruments/ipip50-mx'

async function main() {
  console.log('=== A-01.2: migración PSICOMETRICA → IPIP-50-MX ===')

  const positions = await db.position.findMany({
    select: { id: true, title: true, companyId: true },
    orderBy: { createdAt: 'asc' },
  })
  console.log(`Posiciones: ${positions.length}`)

  let swapped = 0
  let kept = 0
  let skipped = 0

  for (const position of positions) {
    const psicoTemplates = await db.evaluationTemplate.findMany({
      where: { positionId: position.id, type: 'PSICOMETRICA' },
      include: { questions: { select: { id: true } } },
    })

    if (psicoTemplates.length === 0) {
      console.log(`SKIP  "${position.title}" — sin template PSICOMETRICA`)
      skipped++
      continue
    }

    const ipipTemplates = psicoTemplates.filter(
      (t) => t.instrumentId === IPIP50_INSTRUMENT.instrumentId
    )
    const legacyTemplates = psicoTemplates.filter(
      (t) => t.instrumentId !== IPIP50_INSTRUMENT.instrumentId
    )

    // ¿Ya migrado (IPIP activo y nada legacy activo)?
    const ipipActive = ipipTemplates.some((t) => t.active)
    const legacyActive = legacyTemplates.some((t) => t.active)
    if (ipipActive && !legacyActive) {
      console.log(`SKIP  "${position.title}" — ya administra IPIP-50-MX`)
      skipped++
      continue
    }

    // ¿El template legacy tiene respuestas históricas?
    const questionIds = legacyTemplates.flatMap((t) => t.questions.map((q) => q.id))
    const responsesCount = questionIds.length
      ? await db.evaluationResponse.count({ where: { questionId: { in: questionIds } } })
      : 0

    if (responsesCount > 0) {
      console.log(
        `KEEP  "${position.title}" — template legacy con ${responsesCount} respuesta(s) histórica(s); se conserva (histórico)`
      )
      kept++
      continue
    }

    // Deprecar legacy (active=false; el row queda para histórico/auditoría)
    for (const t of legacyTemplates) {
      await db.evaluationTemplate.update({ where: { id: t.id }, data: { active: false } })
    }

    // ¿Existe ya un template IPIP (inactivo)? Reactivarlo en vez de duplicar.
    if (ipipTemplates.length > 0) {
      await db.evaluationTemplate.update({
        where: { id: ipipTemplates[0].id },
        data: { active: true },
      })
      console.log(`SWAP  "${position.title}" — reactivado template IPIP-50-MX existente`)
      swapped++
      continue
    }

    // Crear template IPIP-50-MX con los 50 reactivos verbatim
    const created = await db.evaluationTemplate.create({
      data: {
        name: 'Evaluación de Personalidad — Modelo Big Five',
        type: 'PSICOMETRICA',
        description:
          'IPIP Big-Five Factor Markers (50 items) — Spanish (Mexican), Rodrigo de Oliveira. ' +
          'Los resultados describen tendencias de respuesta y no determinan la contratación.',
        order: 1,
        positionId: position.id,
        companyId: position.companyId,
        active: true,
        instrumentId: IPIP50_INSTRUMENT.instrumentId,
        instrumentVersion: IPIP50_INSTRUMENT.instrumentVersion,
        languageVersion: IPIP50_INSTRUMENT.languageVersion,
        scoringVersion: IPIP50_INSTRUMENT.scoringVersion,
      },
    })
    for (const q of ipip50QuestionData()) {
      await db.question.create({
        data: {
          text: q.text,
          type: 'LIKERT',
          category: q.category,
          reverseScored: q.reverseScored,
          order: q.order,
          evaluationTemplateId: created.id,
        },
      })
    }
    console.log(`SWAP  "${position.title}" — legacy deprecado + IPIP-50-MX creado (50 items)`)
    swapped++
  }

  console.log('---')
  console.log(`Migradas: ${swapped} · Conservadas (histórico): ${kept} · Omitidas: ${skipped}`)
  console.log('Fin — no se modificaron resultados, sesiones ni scoring existentes.')
}

main().catch((e) => {
  console.error('MIGRATION FAILED:', e)
  process.exit(1)
})
