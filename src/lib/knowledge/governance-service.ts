/**
 * A-03.3 — SERVICIO DE GOBERNANZA de conocimientos (operaciones de DB).
 *
 * Complementa el módulo puro `governance.ts` con las operaciones de
 * persistencia necesarias para:
 *
 *   PASO 2/3/4  — crear la cadena PUESTO → BLUEPRINT → REQUIREMENT → ITEM
 *                 (sin dominios huérfanos; todo item ACTIVE ligado a
 *                 requirement + blueprint + source + version).
 *   PASO 5      — publicar el KnowledgeAssessment (versión congelada).
 *   PASO 6/11/12— versionado APPEND-ONLY de ítems (nunca sobrescribir
 *                 silenciosamente un item ya administrado).
 *   PASO 9      — snapshot de administración al iniciar la evaluación.
 *   PASO 14     — fronteras IA aplicadas en toda escritura de ítem.
 *
 * Alcance: EXCLUSIVAMENTE infraestructura de conocimientos (A-03.3).
 * No modifica IPIP, personalidad, integridad, competencias, entrevistas,
 * JobFit, recomendaciones, scoring global, contrato, aviso, RLS ni auth.
 */

import type { PrismaClient } from '@prisma/client'
import {
  DEFAULT_KNOWLEDGE_DIFFICULTY,
  GOVERNANCE_EXCEPTION_NOTE,
  ITEM_VERSION_CHANGE_REASONS,
  SYSTEM_GOVERNANCE_ACTOR,
  buildItemVersionRow,
  canPublishKnowledgeAssessment,
  checkGovernanceSeparation,
  decideKeyChange,
  enforceAiDraftBoundaries,
  nextAssessmentVersion,
  requiresNewItemVersion,
  type ItemVersionChangeReason,
} from './governance'
import { KNOWLEDGE_SCORING_VERSION, canPublishKnowledgeItem } from './scoring'
import { getSystemRequirementCatalog } from './system-bank'

/**
 * Cliente Prisma (directo o con extensión RLS). Se tipa laxo porque el
 * cliente extendido de RLS no expone un tipo nominal compatible.
 */
type KnowledgeDb = any

/** Crea la cadena de gobernanza completa para un puesto NUEVO (idempotente). */
export async function createKnowledgeGovernanceForPosition(
  db: KnowledgeDb,
  position: { id: string; companyId: string; category: string },
  knowledgeQuestions: Array<{
    id: string
    order: number
    correctAnswer: number | null
  }>
): Promise<{ blueprintId: string | null; assessmentId: string | null }> {
  // Idempotencia: si el puesto ya tiene blueprint, no duplicar cadena.
  const existing = await db.knowledgeBlueprint.findFirst({
    where: { positionId: position.id },
    select: { id: true },
  })
  if (existing) {
    const assessment = await db.knowledgeAssessment.findFirst({
      where: { positionId: position.id, status: 'ACTIVE' },
      select: { id: true },
    })
    return { blueprintId: existing.id, assessmentId: assessment?.id ?? null }
  }

  // ── PASO 2: KnowledgeBlueprint v1 del puesto ──
  // Excepción de actor único REGISTRADA (PASO 8): contenido del banco cerrado
  // del sistema (SYSTEM_BANK) elaborado/revisado/aprobado por la gobernanza
  // humana documental A-03.1/A-03.2. Sin IA (PASO 14).
  const blueprint = await db.knowledgeBlueprint.create({
    data: {
      positionId: position.id,
      companyId: position.companyId,
      version: 1,
      status: 'APPROVED',
      createdBy: SYSTEM_GOVERNANCE_ACTOR,
      reviewedBy: SYSTEM_GOVERNANCE_ACTOR,
      approvedBy: SYSTEM_GOVERNANCE_ACTOR,
      governanceNote: GOVERNANCE_EXCEPTION_NOTE,
      approvedAt: new Date(),
    },
  })

  // ── PASO 3: requirements trazables al puesto (sin dominios huérfanos) ──
  const catalog = getSystemRequirementCatalog(position.category)
  const requirementByOrder = new Map<number, string>()
  const orderCovered = new Set<number>()
  for (const seed of catalog) {
    const requirement = await db.knowledgeRequirement.create({
      data: {
        blueprintId: blueprint.id,
        companyId: position.companyId,
        domain: seed.domain,
        subdomain: seed.subdomain,
        description: seed.description,
        importance: seed.importance,
        source: seed.source,
        rationale: seed.rationale,
        status: 'APPROVED', // sincronizado con el blueprint (PASO 7)
        version: 1,
      },
    })
    for (const order of seed.questionOrders) {
      requirementByOrder.set(order, requirement.id)
      orderCovered.add(order)
    }
  }

  // ── PASO 4: ligar cada ítem a su requirement + PASO 6: versión inicial ──
  for (const q of knowledgeQuestions) {
    const requirementId = requirementByOrder.get(q.order) ?? null
    if (!requirementId) {
      // Sin dominio no hay pregunta (A-03.1 K-BP: dominios cerrados).
      throw new Error(
        `KNOWLEDGE_REQUIREMENT_MISSING: question order ${q.order} sin dominio en el catálogo del blueprint ${blueprint.id}`
      )
    }
    const full = await db.question.findUnique({ where: { id: q.id } })
    if (!full) continue
    await db.question.update({
      where: { id: q.id },
      data: {
        knowledgeBlueprintId: blueprint.id,
        knowledgeRequirementId: requirementId,
        difficulty: DEFAULT_KNOWLEDGE_DIFFICULTY, // PASO 13: UNKNOWN, nunca inventada
        createdBy: SYSTEM_GOVERNANCE_ACTOR,
      },
    })
    // PASO 6: registro append-only de la versión inicial (contenido real).
    await db.knowledgeItemVersion.create({
      data: buildItemVersionRow(
        { ...full, difficulty: DEFAULT_KNOWLEDGE_DIFFICULTY },
        full.itemVersion ?? 1,
        'INITIAL' as ItemVersionChangeReason
      ),
    })
  }

  // Verificación de cobertura: todo reactivo ligado (sin huérfanos).
  const uncovered = knowledgeQuestions.filter((q) => !orderCovered.has(q.order))
  if (uncovered.length > 0) {
    throw new Error(
      `KNOWLEDGE_ORPHAN_ITEMS: ${uncovered.map((u) => u.order).join(',')} sin requirement en ${blueprint.id}`
    )
  }

  // ── PASO 5: publicar la versión congelada del assessment ──
  const statuses = knowledgeQuestions.map(() => 'ACTIVE')
  const keys = knowledgeQuestions.map((q) => q.correctAnswer)
  const versions = knowledgeQuestions.map(() => 1)
  const guard = canPublishKnowledgeAssessment({
    blueprintStatus: 'APPROVED',
    requirementStatuses: catalog.map(() => 'APPROVED'),
    itemStatuses: statuses,
    itemCorrectAnswers: keys,
    scoringVersion: KNOWLEDGE_SCORING_VERSION,
    assessmentVersion: nextAssessmentVersion(0),
    blueprintVersion: 1,
    itemVersions: versions,
  })
  if (!guard.canPublish) {
    // Nunca debería ocurrir con el banco revisado; falla explícita si ocurre.
    throw new Error(`KNOWLEDGE_ASSESSMENT_PUBLISH_BLOCKED: ${guard.reasons.join(',')}`)
  }

  const assessment = await db.knowledgeAssessment.create({
    data: {
      positionId: position.id,
      blueprintId: blueprint.id,
      companyId: position.companyId,
      assessmentVersion: nextAssessmentVersion(0),
      scoringVersion: KNOWLEDGE_SCORING_VERSION,
      status: 'ACTIVE',
      publishedAt: new Date(),
      publishedBy: SYSTEM_GOVERNANCE_ACTOR,
      createdBy: SYSTEM_GOVERNANCE_ACTOR,
    },
  })

  return { blueprintId: blueprint.id, assessmentId: assessment.id }
}

/**
 * PASO 6/11/12 — aplica un cambio metodológico a un ítem de conocimiento con
 * versionado APPEND-ONLY:
 *   1. Si el contenido cambia (regla conservadora) ⇒ NUEVA itemVersion.
 *   2. La versión previa queda RETIRED (nunca se edita).
 *   3. El ítem cambia a DRAFT (requiere re-revisión — PASO 8/14; la revisión
 *      previa no cubre contenido nuevo).
 *   4. Cambio de clave ⇒ previousCorrectAnswer + correctAnswerChangedAt.
 */
export async function applyMethodologicalItemChange(
  db: KnowledgeDb,
  questionId: string,
  next: {
    text?: string
    options?: string | null
    correctAnswer?: number | null
    correctAnswerSource?: string | null
    correctAnswerRationale?: string | null
  }
): Promise<{ changed: boolean; newItemVersion: number; changedFields: string[] }> {
  const question = await db.question.findUnique({ where: { id: questionId } })
  if (!question) throw new Error('QUESTION_NOT_FOUND')
  if (question.category !== 'KNOWLEDGE' || question.type !== 'MULTIPLE_CHOICE') {
    throw new Error('NOT_A_KNOWLEDGE_ITEM')
  }

  const prevContent = {
    question: question.text,
    options: question.options,
    correctAnswer: question.correctAnswer,
    correctAnswerSource: question.correctAnswerSource,
    correctAnswerRationale: question.correctAnswerRationale,
  }
  const nextContent = {
    question: next.text !== undefined ? next.text : question.text,
    options: next.options !== undefined ? next.options : question.options,
    correctAnswer: next.correctAnswer !== undefined ? next.correctAnswer : question.correctAnswer,
    correctAnswerSource:
      next.correctAnswerSource !== undefined ? next.correctAnswerSource : question.correctAnswerSource,
    correctAnswerRationale:
      next.correctAnswerRationale !== undefined
        ? next.correctAnswerRationale
        : question.correctAnswerRationale,
  }

  const { required, changedFields } = requiresNewItemVersion(prevContent, nextContent)
  if (!required) return { changed: false, newItemVersion: question.itemVersion, changedFields }

  const decision = decideKeyChange(question.itemVersion, question.correctAnswer)
  const keyChanged = changedFields.includes('correctAnswer')

  // 1) Historial: asegurar registro de la versión previa (backfill honesto
  //    para ítems legacy que cambian por primera vez — PASO 16).
  const prevVersionRow = await db.knowledgeItemVersion.findUnique({
    where: { questionId_itemVersion: { questionId, itemVersion: question.itemVersion } },
  })
  if (!prevVersionRow) {
    await db.knowledgeItemVersion.create({
      data: {
        ...buildItemVersionRow(question, question.itemVersion, 'INITIAL_REGISTRATION_BACKFILL'),
      },
    })
  }
  // 2) La versión previa queda RETIRED y registra quién la reemplazó.
  await db.knowledgeItemVersion.update({
    where: { questionId_itemVersion: { questionId, itemVersion: question.itemVersion } },
    data: { status: 'RETIRED', supersededByVersion: decision.newItemVersion },
  })
  // 3) Nueva versión (append-only) con el contenido nuevo — DRAFT hasta
  //    revisión (la revisión previa no cubre contenido nuevo).
  await db.knowledgeItemVersion.create({
    data: {
      questionRef: { connect: { id: questionId } },
      itemVersion: decision.newItemVersion,
      question: nextContent.question ?? '',
      options: nextContent.options,
      correctAnswer: nextContent.correctAnswer,
      correctAnswerSource: nextContent.correctAnswerSource,
      correctAnswerRationale: nextContent.correctAnswerRationale,
      difficulty: question.difficulty ?? DEFAULT_KNOWLEDGE_DIFFICULTY,
      status: 'DRAFT',
      origin: question.origin,
      reviewedBy: null,
      approvedBy: null,
      changeReason: keyChanged ? 'KEY_CHANGE' : 'CONTENT_CHANGE',
      supersededByVersion: null,
      ...(question.companyId
        ? { company: { connect: { id: question.companyId } } }
        : {}),
    },
  })
  // 4) El ítem apunta a la nueva versión (puntero vigente).
  await db.question.update({
    where: { id: questionId },
    data: {
      text: nextContent.question ?? question.text,
      options: nextContent.options,
      correctAnswer: nextContent.correctAnswer,
      correctAnswerSource: nextContent.correctAnswerSource,
      correctAnswerRationale: nextContent.correctAnswerRationale,
      itemVersion: decision.newItemVersion,
      knowledgeStatus: 'DRAFT',
      reviewedBy: null,
      approvedBy: null,
      ...(keyChanged
        ? {
            previousCorrectAnswer: decision.previousCorrectAnswer,
            correctAnswerChangedAt: new Date(),
          }
        : {}),
    },
  })

  return { changed: true, newItemVersion: decision.newItemVersion, changedFields }
}

/**
 * PASO 9 — snapshot de administración al INICIAR una evaluación.
 * Congela assessmentVersion/blueprintVersion/scoringVersion/itemVersions
 * (SIN claves). Idempotente por sesión (unique sessionId). Nunca fatal:
 * un fallo de snapshot no rompe la administración (se registra el error).
 */
export async function createAdministrationSnapshot(
  db: KnowledgeDb,
  session: { id: string; candidateId: string; positionId: string; companyId: string },
  knowledgeQuestions: Array<{ id: string; itemVersion: number }>,
  scoringVersion: string | null
): Promise<string | null> {
  try {
    const existing = await db.knowledgeAdministrationSnapshot.findUnique({
      where: { sessionId: session.id },
    })
    if (existing) return existing.id

    const assessment = await db.knowledgeAssessment.findFirst({
      where: { positionId: session.positionId, status: 'ACTIVE' },
      include: { blueprint: { select: { id: true, version: true } } },
    })

    const created = await db.knowledgeAdministrationSnapshot.create({
      data: {
        sessionId: session.id,
        candidateId: session.candidateId,
        positionId: session.positionId,
        companyId: session.companyId,
        knowledgeAssessmentId: assessment?.id ?? null,
        assessmentVersion: assessment?.assessmentVersion ?? null,
        blueprintId: assessment?.blueprint?.id ?? null,
        blueprintVersion: assessment?.blueprint?.version ?? null,
        scoringVersion: scoringVersion ?? assessment?.scoringVersion ?? null,
        itemVersions: JSON.stringify(
          knowledgeQuestions.map((q) => ({ questionId: q.id, itemVersion: q.itemVersion }))
        ),
      },
    })
    return created.id
  } catch (error) {
    console.error('[A-03.3] administration snapshot error (non-fatal):', error)
    return null
  }
}

/**
 * PASO 14 — normaliza una escritura de ítem aplicando fronteras IA:
 * salida de IA ⇒ DRAFT sin revisor/aprobador (jamás publicable por IA).
 * Devuelve los campos listos para usar en create/update.
 */
export function normalizeItemWrite(input: {
  origin?: string | null
  knowledgeStatus?: string | null
  reviewedBy?: string | null
  approvedBy?: string | null
}): {
  origin: string
  knowledgeStatus: string
  reviewedBy: string | null
  approvedBy: string | null
  enforced: boolean
} {
  const enforced = enforceAiDraftBoundaries(input)
  return {
    origin: input.origin ?? 'HUMAN',
    knowledgeStatus: enforced.knowledgeStatus,
    reviewedBy: enforced.reviewedBy,
    approvedBy: enforced.approvedBy,
    enforced: enforced.enforced,
  }
}

/** Exposición de la compuerta de publicación por ítem (PASO 7 por ítem). */
export function itemPublishGuard(item: Parameters<typeof canPublishKnowledgeItem>[0]) {
  return canPublishKnowledgeItem(item)
}

/** Exposición de la verificación de separación de funciones (PASO 8). */
export function governanceSeparationCheck(actors: Parameters<typeof checkGovernanceSeparation>[0]) {
  return checkGovernanceSeparation(actors)
}

export { ITEM_VERSION_CHANGE_REASONS, SYSTEM_GOVERNANCE_ACTOR }
export type { PrismaClient }
