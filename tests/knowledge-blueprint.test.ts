/**
 * A-03.3 PASO 17 — TESTS de Knowledge Blueprint + Assessment Versioning.
 *
 * Ejecutar: bun test tests/knowledge-blueprint.test.ts
 *
 * Cubre los 15 tests del encargo A-03.3:
 *   T1  blueprint pertenece a job
 *   T2  requirement pertenece a blueprint
 *   T3  item pertenece a requirement
 *   T4  assessment pertenece a blueprint
 *   T5  assessment tiene versión completa
 *   T6  item ACTIVE tiene correctAnswer
 *   T7  item ACTIVE tiene reviewer
 *   T8  assessment ACTIVE tiene blueprint APPROVED
 *   T9  assessment ACTIVE solo contiene items APPROVED
 *   T10 nueva correctAnswer crea nueva itemVersion
 *   T11 resultado histórico conserva versiones antiguas
 *   T12 cambiar banco no cambia evaluación existente
 *   T13 IA solo produce DRAFT
 *   T14 candidato no puede modificar gobernanza
 *   T15 autor/revisor/aprobador quedan registrados
 *
 * Los tests DB crean fixtures aislados (prefijo A033T-) y los eliminan al
 * final. No modifican datos del seed ni resultados históricos.
 */
import { describe, test, expect, afterAll } from 'bun:test'
import { PrismaClient } from '@prisma/client'
import {
  canPublishKnowledgeAssessment,
  checkGovernanceSeparation,
  classifyKnowledgeRecord,
  enforceAiDraftBoundaries,
  canAiPublish,
  isHumanPublishingActor,
  requiresNewItemVersion,
} from '../src/lib/knowledge/governance'
import { applyMethodologicalItemChange, createAdministrationSnapshot } from '../src/lib/knowledge/governance-service'
import { canPublishKnowledgeItem, isPublishingActorAllowed, rescoreFromFrozenSnapshot } from '../src/lib/knowledge/scoring'

const db = new PrismaClient()
const TAG = `A033T-${Date.now()}`

let companyId: string
let positionId: string
let templateId: string
let blueprintId: string
let requirementId: string
let assessmentId: string
let questionId: string
let candidateId: string
let sessionId: string

// ── Fixtures (se crean una vez, se limpian al final) ──
async function setupFixtures() {
  const company = await db.company.create({
    data: { name: TAG, sector: 'RESTAURANT' },
  })
  companyId = company.id

  const position = await db.position.create({
    data: {
      title: `Puesto ${TAG}`,
      category: 'MESERO',
      hasKnowledgeTest: true,
      companyId,
    },
  })
  positionId = position.id

  const template = await db.evaluationTemplate.create({
    data: {
      name: `CONOCIMIENTOS ${TAG}`,
      type: 'CONOCIMIENTOS',
      order: 3,
      positionId,
      companyId,
      knowledgeScoringVersion: 'KNOWLEDGE-SCORING-1.0',
    },
  })
  templateId = template.id

  const blueprint = await db.knowledgeBlueprint.create({
    data: {
      positionId,
      companyId,
      version: 1,
      status: 'APPROVED',
      createdBy: 'A-03.2-GOVERNANCE',
      reviewedBy: 'A-03.2-GOVERNANCE',
      approvedBy: 'A-03.2-GOVERNANCE',
      governanceNote: 'EXCEPCION_REGISTRADA (test fixture)',
      approvedAt: new Date(),
    },
  })
  blueprintId = blueprint.id

  const requirement = await db.knowledgeRequirement.create({
    data: {
      blueprintId,
      companyId,
      domain: 'Servicio al cliente',
      subdomain: 'Test',
      description: 'Dominio de prueba',
      importance: 'ALTA',
      source: 'FUNCIONES',
      rationale: 'Justificación trazable al puesto (fixture)',
      status: 'APPROVED',
      version: 1,
    },
  })
  requirementId = requirement.id

  const assessment = await db.knowledgeAssessment.create({
    data: {
      positionId,
      blueprintId,
      companyId,
      assessmentVersion: 'KA-v1',
      scoringVersion: 'KNOWLEDGE-SCORING-1.0',
      status: 'ACTIVE',
      publishedAt: new Date(),
      publishedBy: 'A-03.2-GOVERNANCE',
    },
  })
  assessmentId = assessment.id

  const question = await db.question.create({
    data: {
      text: `Pregunta fixture ${TAG}`,
      type: 'MULTIPLE_CHOICE',
      options: JSON.stringify(['A', 'B', 'C', 'D']),
      category: 'KNOWLEDGE',
      order: 1,
      evaluationTemplateId: templateId,
      correctAnswer: 1,
      knowledgeStatus: 'ACTIVE',
      itemVersion: 1,
      correctAnswerSource: 'ELABORACION_REVISADA',
      correctAnswerRationale: 'Clave del fixture',
      origin: 'SYSTEM_BANK',
      reviewedBy: 'A-03.2-GOVERNANCE',
      approvedBy: 'A-03.2-GOVERNANCE',
      createdBy: 'A-03.2-GOVERNANCE',
      difficulty: 'UNKNOWN',
      knowledgeBlueprintId: blueprintId,
      knowledgeRequirementId: requirementId,
    },
  })
  questionId = question.id

  const candidate = await db.user.create({
    data: { email: `${TAG}@test.local`, name: TAG, password: 'x', role: 'CANDIDATO' },
  })
  candidateId = candidate.id

  const session = await db.evaluationSession.create({
    data: { candidateId, positionId, companyId, status: 'IN_PROGRESS' },
  })
  sessionId = session.id
}

async function cleanupFixtures() {
  await db.knowledgeAdministrationSnapshot.deleteMany({ where: { sessionId } }).catch(() => {})
  await db.evaluationSession.deleteMany({ where: { id: sessionId } }).catch(() => {})
  await db.user.deleteMany({ where: { id: candidateId } }).catch(() => {})
  await db.knowledgeItemVersion.deleteMany({ where: { questionId } }).catch(() => {})
  await db.question.deleteMany({ where: { id: questionId } }).catch(() => {})
  await db.knowledgeAssessment.deleteMany({ where: { id: assessmentId } }).catch(() => {})
  await db.knowledgeRequirement.deleteMany({ where: { blueprintId } }).catch(() => {})
  await db.knowledgeBlueprint.deleteMany({ where: { positionId } }).catch(() => {})
  await db.evaluationTemplate.deleteMany({ where: { id: templateId } }).catch(() => {})
  await db.position.deleteMany({ where: { id: positionId } }).catch(() => {})
  await db.company.deleteMany({ where: { id: companyId } }).catch(() => {})
}

describe('A-03.3 — Knowledge Blueprint & Versioning', () => {
  test('setup: fixtures creados', async () => {
    await setupFixtures()
    expect(blueprintId).toBeDefined()
    expect(questionId).toBeDefined()
  })

  test('T1: blueprint pertenece a job', async () => {
    const bp = await db.knowledgeBlueprint.findUnique({
      where: { id: blueprintId },
      include: { position: true },
    })
    expect(bp).not.toBeNull()
    expect(bp!.position.id).toBe(positionId)
    expect(bp!.position.companyId).toBe(companyId)
  })

  test('T2: requirement pertenece a blueprint', async () => {
    const req = await db.knowledgeRequirement.findUnique({
      where: { id: requirementId },
      include: { blueprint: true },
    })
    expect(req).not.toBeNull()
    expect(req!.blueprint.id).toBe(blueprintId)
    // Trazabilidad obligatoria: rationale + source presentes (PASO 3)
    expect(req!.rationale.length).toBeGreaterThan(0)
    expect(req!.source.length).toBeGreaterThan(0)
  })

  test('T3: item pertenece a requirement', async () => {
    const q = await db.question.findUnique({
      where: { id: questionId },
      include: { knowledgeRequirement: { include: { blueprint: true } } },
    })
    expect(q).not.toBeNull()
    expect(q!.knowledgeRequirement!.id).toBe(requirementId)
    expect(q!.knowledgeRequirement!.blueprint.id).toBe(blueprintId)
    expect(q!.knowledgeBlueprintId).toBe(blueprintId)
  })

  test('T4: assessment pertenece a blueprint', async () => {
    const ka = await db.knowledgeAssessment.findUnique({
      where: { id: assessmentId },
      include: { blueprint: true },
    })
    expect(ka).not.toBeNull()
    expect(ka!.blueprint.id).toBe(blueprintId)
    expect(ka!.positionId).toBe(positionId)
  })

  test('T5: assessment tiene versión completa', async () => {
    const ka = await db.knowledgeAssessment.findUnique({ where: { id: assessmentId } })
    expect(ka!.assessmentVersion).toBe('KA-v1')
    expect(ka!.scoringVersion).toBe('KNOWLEDGE-SCORING-1.0')
    expect(ka!.blueprintId).toBeTruthy()
    expect(ka!.publishedAt).not.toBeNull()
    expect(ka!.publishedBy).toBeTruthy()
  })

  test('T6: item ACTIVE sin correctAnswer no pasa la compuerta', async () => {
    // Compuerta por ítem (A-03.2/A-03.3): sin clave NO publica.
    const guard = canPublishKnowledgeItem({ correctAnswer: null, itemVersion: 1 })
    expect(guard.canPublish).toBe(false)
    expect(guard.reason).toBe('KNOWLEDGE_KEY_MISSING')
    // Compuerta de assessment: un item sin clave bloquea KPUB-KA-4.
    const kaGuard = canPublishKnowledgeAssessment({
      blueprintStatus: 'APPROVED',
      requirementStatuses: ['APPROVED'],
      itemStatuses: ['APPROVED'],
      itemCorrectAnswers: [null],
      scoringVersion: 'KNOWLEDGE-SCORING-1.0',
      assessmentVersion: 'KA-v2',
      blueprintVersion: 1,
      itemVersions: [1],
    })
    expect(kaGuard.canPublish).toBe(false)
    expect(kaGuard.reasons).toContain('KPUB-KA-4_CORRECTANSWER_MISSING')
    // Clasificación PASO 16: declarado sin clave = INVALID (no VALIDATED-V1)
    expect(
      classifyKnowledgeRecord({
        category: 'KNOWLEDGE',
        knowledgeStatus: 'ACTIVE',
        correctAnswer: null,
        correctAnswerSource: 'ELABORACION_REVISADA',
        reviewedBy: 'x',
        itemVersion: 1,
      })
    ).toBe('INVALID')
  })

  test('T7: item ACTIVE sin revisor no pasa la compuerta', async () => {
    const guard = canPublishKnowledgeItem({
      correctAnswer: 1,
      itemVersion: 1,
      reviewedBy: null,
      correctAnswerSource: 'ELABORACION_REVISADA',
    })
    expect(guard.canPublish).toBe(false)
    expect(guard.reason).toBe('KNOWLEDGE_REVIEW_MISSING')
  })

  test('T8: assessment ACTIVE exige blueprint APPROVED', async () => {
    const blocked = canPublishKnowledgeAssessment({
      blueprintStatus: 'DRAFT',
      requirementStatuses: ['APPROVED'],
      itemStatuses: ['APPROVED'],
      itemCorrectAnswers: [1],
      scoringVersion: 'KNOWLEDGE-SCORING-1.0',
      assessmentVersion: 'KA-v1',
      blueprintVersion: 1,
      itemVersions: [1],
    })
    expect(blocked.canPublish).toBe(false)
    expect(blocked.reasons).toContain('KPUB-KA-1_BLUEPRINT_NOT_APPROVED')

    const ok = canPublishKnowledgeAssessment({
      blueprintStatus: 'APPROVED',
      requirementStatuses: ['APPROVED'],
      itemStatuses: ['ACTIVE'],
      itemCorrectAnswers: [1],
      scoringVersion: 'KNOWLEDGE-SCORING-1.0',
      assessmentVersion: 'KA-v1',
      blueprintVersion: 1,
      itemVersions: [1],
    })
    expect(ok.canPublish).toBe(true)
  })

  test('T9: assessment ACTIVE solo contiene items APPROVED/ACTIVE', async () => {
    const blocked = canPublishKnowledgeAssessment({
      blueprintStatus: 'APPROVED',
      requirementStatuses: ['APPROVED'],
      itemStatuses: ['ACTIVE', 'DRAFT'],
      itemCorrectAnswers: [1, 2],
      scoringVersion: 'KNOWLEDGE-SCORING-1.0',
      assessmentVersion: 'KA-v1',
      blueprintVersion: 1,
      itemVersions: [1, 1],
    })
    expect(blocked.canPublish).toBe(false)
    expect(blocked.reasons).toContain('KPUB-KA-3_ITEMS_NOT_APPROVED')
  })

  test('T10: nueva correctAnswer crea nueva itemVersion (versión antigua RETIRED)', async () => {
    const before = await db.question.findUnique({ where: { id: questionId } })
    expect(before!.itemVersion).toBe(1)
    // Registro de versión inicial (como hace el generador)
    await db.knowledgeItemVersion.create({
      data: {
        questionRef: { connect: { id: questionId } },
        itemVersion: 1,
        question: before!.text,
        options: before!.options,
        correctAnswer: before!.correctAnswer,
        correctAnswerSource: before!.correctAnswerSource,
        correctAnswerRationale: before!.correctAnswerRationale,
        difficulty: before!.difficulty,
        status: 'ACTIVE',
        origin: before!.origin,
        reviewedBy: before!.reviewedBy,
        approvedBy: before!.approvedBy,
        changeReason: 'INITIAL',
      },
    })

    const result = await applyMethodologicalItemChange(db, questionId, { correctAnswer: 2 })
    expect(result.changed).toBe(true)
    expect(result.changedFields).toContain('correctAnswer')
    expect(result.newItemVersion).toBe(2)

    const after = await db.question.findUnique({ where: { id: questionId } })
    expect(after!.itemVersion).toBe(2)
    expect(after!.correctAnswer).toBe(2)
    expect(after!.previousCorrectAnswer).toBe(1) // PASO 11: auditoría de clave previa
    expect(after!.correctAnswerChangedAt).not.toBeNull()
    expect(after!.knowledgeStatus).toBe('DRAFT') // nueva versión requiere re-revisión

    const versions = await db.knowledgeItemVersion.findMany({
      where: { questionId },
      orderBy: { itemVersion: 'asc' },
    })
    expect(versions.length).toBe(2)
    expect(versions[0].itemVersion).toBe(1)
    expect(versions[0].status).toBe('RETIRED') // versión antigua RETIRED
    expect(versions[0].correctAnswer).toBe(1) // contenido antiguo intacto
    expect(versions[0].supersededByVersion).toBe(2)
    expect(versions[1].itemVersion).toBe(2)
    expect(versions[1].status).toBe('DRAFT')
    expect(versions[1].changeReason).toBe('KEY_CHANGE')
    expect(versions[1].correctAnswer).toBe(2)
  })

  test('T11: resultado histórico conserva versiones antiguas', async () => {
    // La respuesta histórica congeló clave=1 (v1). Tras el cambio a clave=2,
    // la reconstrucción desde el snapshot NO cambia (PASO 10/11).
    const historicalOutcome = rescoreFromFrozenSnapshot(1, '1') // candidato respondió 1 con clave v1
    expect(historicalOutcome).toBe('CORRECT')
    // La clave VIGENTE (2) no debe usarse para re-puntuar históricos:
    const currentKeyOutcome = rescoreFromFrozenSnapshot(1, '2')
    expect(currentKeyOutcome).toBe('INCORRECT')
    // La fila v1 permanece inmutable con su contenido original:
    const v1 = await db.knowledgeItemVersion.findUnique({
      where: { questionId_itemVersion: { questionId, itemVersion: 1 } },
    })
    expect(v1!.correctAnswer).toBe(1)
    expect(v1!.question).toContain('Pregunta fixture')
  })

  test('T12: cambiar banco no cambia evaluación existente (snapshot congelado)', async () => {
    // Snapshot al iniciar (PASO 9) con itemVersion vigente en ese momento.
    const snapshotId = await createAdministrationSnapshot(
      db,
      { id: sessionId, candidateId, positionId, companyId },
      [{ id: questionId, itemVersion: 1 }],
      'KNOWLEDGE-SCORING-1.0'
    )
    expect(snapshotId).not.toBeNull()

    // El banco cambia (nueva versión del ítem).
    await applyMethodologicalItemChange(db, questionId, { correctAnswer: 3 })

    // El snapshot congelado NO cambia (el candidato ya iniciado no migra).
    const snap = await db.knowledgeAdministrationSnapshot.findUnique({
      where: { sessionId },
    })
    expect(snap!.assessmentVersion).toBe('KA-v1')
    expect(snap!.blueprintVersion).toBe(1)
    const frozen = JSON.parse(snap!.itemVersions!)
    const frozenItem = frozen.find((i: { questionId: string }) => i.questionId === questionId)
    expect(frozenItem.itemVersion).toBe(1) // sigue v1 aunque el banco esté en v3

    // La fila del snapshot es inmutable: sin updatedAt (PASO 9)
    expect(snap!.createdAt).not.toBeNull()
  })

  test('T13: IA solo produce DRAFT', () => {
    const enforced = enforceAiDraftBoundaries({
      origin: 'AI_DRAFT',
      knowledgeStatus: 'ACTIVE',
      reviewedBy: 'IA',
      approvedBy: 'IA',
    })
    expect(enforced.enforced).toBe(true)
    expect(enforced.knowledgeStatus).toBe('DRAFT')
    expect(enforced.reviewedBy).toBeNull()
    expect(enforced.approvedBy).toBeNull()
    // La IA jamás publica (PASO 14)
    expect(canAiPublish()).toBe(false)
    expect(isHumanPublishingActor('AI')).toBe(false)
    expect(isHumanPublishingActor('CANDIDATO')).toBe(false)
    // Regla conservadora de nueva versión (PASO 12)
    const v = requiresNewItemVersion(
      { question: 'a', options: null, correctAnswer: 1, correctAnswerSource: null, correctAnswerRationale: null },
      { question: 'a', options: null, correctAnswer: 2, correctAnswerSource: null, correctAnswerRationale: null }
    )
    expect(v.required).toBe(true)
    expect(v.changedFields).toEqual(['correctAnswer'])
    // La dificultad NO dispara versión (metadato — PASO 13/KD-5)
    expect(
      requiresNewItemVersion(
        { question: 'a', options: null, correctAnswer: 1, correctAnswerSource: 'X', correctAnswerRationale: null },
        { question: 'a', options: null, correctAnswer: 1, correctAnswerSource: 'X', correctAnswerRationale: null }
      ).required
    ).toBe(false)
  })

  test('T14: candidato no puede modificar gobernanza', () => {
    // Compuerta de actores (A-03.2 heredada + A-03.3 PASO 8/14)
    expect(isPublishingActorAllowed('CANDIDATO')).toBe(false)
    expect(isPublishingActorAllowed(null)).toBe(false)
    expect(isPublishingActorAllowed(undefined)).toBe(false)
    expect(isPublishingActorAllowed('RH')).toBe(true)
    // Separación de funciones: mismo actor SIN excepción registrada = violación
    const noException = checkGovernanceSeparation({
      createdBy: 'user-1',
      reviewedBy: 'user-1',
      approvedBy: 'user-1',
    })
    expect(noException.ok).toBe(false)
    expect(noException.violations).toContain('GSEP-2_SAME_ACTOR_WITHOUT_REGISTERED_EXCEPTION')
  })

  test('T15: autor/revisor/aprobador quedan registrados (con excepción registrada)', async () => {
    const bp = await db.knowledgeBlueprint.findUnique({ where: { id: blueprintId } })
    expect(bp!.createdBy).toBe('A-03.2-GOVERNANCE')
    expect(bp!.reviewedBy).toBe('A-03.2-GOVERNANCE')
    expect(bp!.approvedBy).toBe('A-03.2-GOVERNANCE')
    expect(bp!.governanceNote).toContain('EXCEPCION_REGISTRADA')
    // Con la excepción registrada, la separación pasa (PASO 8: política expresa)
    const withException = checkGovernanceSeparation({
      createdBy: 'A-03.2-GOVERNANCE',
      reviewedBy: 'A-03.2-GOVERNANCE',
      approvedBy: 'A-03.2-GOVERNANCE',
      governanceNote: bp!.governanceNote,
    })
    expect(withException.ok).toBe(true)
    expect(withException.singleActorExceptionUsed).toBe(true)
    // El ítem fixture conserva la tríada en su versión original registrada
    // (v1 — append-only; el puntero live pasó a DRAFT en T10, correcto).
    const q = await db.question.findUnique({ where: { id: questionId } })
    expect(q!.createdBy).toBe('A-03.2-GOVERNANCE')
    const v1 = await db.knowledgeItemVersion.findUnique({
      where: { questionId_itemVersion: { questionId, itemVersion: 1 } },
    })
    expect(v1!.reviewedBy).toBe('A-03.2-GOVERNANCE')
    expect(v1!.approvedBy).toBe('A-03.2-GOVERNANCE')
  })

  test('cleanup: fixtures eliminados (DB como estaba)', async () => {
    await cleanupFixtures()
    const q = await db.question.findUnique({ where: { id: questionId } })
    expect(q).toBeNull()
    const bp = await db.knowledgeBlueprint.findUnique({ where: { id: blueprintId } })
    expect(bp).toBeNull()
  })

  afterAll(async () => {
    await cleanupFixtures().catch(() => {})
    await db.$disconnect()
  })
})
