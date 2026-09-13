/**
 * A-03.3 PASO 16/19 — Clasificación backward-compatible de registros de
 * conocimientos (SOLO LECTURA — no modifica datos, no recacula, no inventa).
 *
 * Clasifica cada Question de conocimiento con la regla PASO 16:
 *   VALIDATED-V1 | LEGACY | INVALID | UNKNOWN | NOT_APPLICABLE
 * y reporta el estado de la cadena de gobernanza (blueprint/requirement/
 * assessment/itemVersion/snapshot).
 *
 * Ejecutar: bun scripts/a033-classify-blueprint.ts
 */
import { PrismaClient } from '@prisma/client'
import { classifyKnowledgeRecord } from '../src/lib/knowledge/governance'

const db = new PrismaClient()

async function main() {
  const questions = await db.question.findMany({
    where: { category: 'KNOWLEDGE' },
    include: {
      knowledgeRequirement: { select: { id: true, domain: true, blueprintId: true } },
      itemVersions: { select: { itemVersion: true, status: true, changeReason: true } },
    },
  })

  const counts = {
    'VALIDATED-V1': 0,
    LEGACY: 0,
    INVALID: 0,
    UNKNOWN: 0,
    NOT_APPLICABLE: 0,
  }
  const unclassifiedChain: string[] = []

  for (const q of questions) {
    const cls = classifyKnowledgeRecord({
      category: q.category,
      knowledgeStatus: q.knowledgeStatus,
      correctAnswer: q.correctAnswer,
      correctAnswerSource: q.correctAnswerSource,
      reviewedBy: q.reviewedBy,
      itemVersion: q.itemVersion,
    })
    counts[cls]++
    if (q.knowledgeStatus === 'ACTIVE' && !q.knowledgeRequirementId) {
      unclassifiedChain.push(`${q.id} (ACTIVE sin requirement — PASO 4)`)
    }
  }

  const blueprints = await db.knowledgeBlueprint.findMany({
    include: { position: { select: { title: true } }, _count: { select: { requirements: true, questions: true } } },
  })
  const assessments = await db.knowledgeAssessment.findMany({
    include: { blueprint: { select: { version: true } } },
  })
  const snapshots = await db.knowledgeAdministrationSnapshot.count()
  const itemVersions = await db.knowledgeItemVersion.count()
  const results = await db.evaluationResult.findMany({
    select: { id: true, knowledgeScore: true, knowledgeStatus: true, knowledgeScoringVersion: true },
  })

  console.log('════════════════════════════════════════════════════════')
  console.log('A-03.3 — CLASIFICACIÓN BACKWARD-COMPATIBLE (PASO 16)')
  console.log('════════════════════════════════════════════════════════')
  console.log(`Knowledge items: ${questions.length}`)
  console.log(`  VALIDATED-V1 : ${counts['VALIDATED-V1']}  (A-03.2 clase A — cadena completa v1)`)
  console.log(`  LEGACY       : ${counts.LEGACY}  (pre-A-03.2, sin metadata — no se inventa)`)
  console.log(`  INVALID      : ${counts.INVALID}  (declara ciclo de vida pero sin clave)`)
  console.log(`  UNKNOWN      : ${counts.UNKNOWN}  (metadata incompleta)`)
  console.log(`  NOT_APPLICABLE: ${counts['NOT_APPLICABLE']}`)
  console.log('')
  console.log('Cadena de gobernanza (A-03.3):')
  console.log(`  KnowledgeBlueprints : ${blueprints.length}`)
  for (const bp of blueprints) {
    console.log(
      `    - ${bp.position.title} v${bp.version} [${bp.status}] req=${bp._count.requirements} items=${bp._count.questions} autor/rev/apr=${bp.createdBy ?? '—'}`
    )
  }
  console.log(`  KnowledgeRequirements : ${await db.knowledgeRequirement.count()}`)
  console.log(`  KnowledgeAssessments  : ${assessments.length}`)
  for (const ka of assessments) {
    console.log(
      `    - ${ka.assessmentVersion} [${ka.status}] blueprint v${ka.blueprint.version} scoring=${ka.scoringVersion} publishedBy=${ka.publishedBy ?? '—'}`
    )
  }
  console.log(`  KnowledgeItemVersions : ${itemVersions} (append-only)`)
  console.log(`  AdministrationSnapshots: ${snapshots}`)
  console.log('')
  console.log('Items ACTIVE sin requirement (PASO 4 — debe ser 0):')
  console.log(`  ${unclassifiedChain.length === 0 ? 'NINGUNO ✓' : unclassifiedChain.join(', ')}`)
  console.log('')
  console.log('Resultados históricos (PASO 19 — intocables):')
  for (const r of results) {
    console.log(
      `    - ${r.id} knowledgeScore=${r.knowledgeScore ?? 'null'} status=${r.knowledgeStatus ?? 'legacy'} scoringVer=${r.knowledgeScoringVersion ?? '—'}`
    )
  }
  console.log('')
  console.log('REGLA PASO 19: no se eliminó, recalculó ni inventó ningún dato.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
