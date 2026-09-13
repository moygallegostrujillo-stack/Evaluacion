/**
 * A-03.3 — Módulo de GOBERNANZA del instrumento de conocimientos.
 *
 * Infraestructura exclusiva de knowledge (encargo A-03.3). Complementa
 * `src/lib/knowledge/scoring.ts` (reglas de puntuación, A-03.2) con:
 *
 *   PASO 7  — compuertas de publicación a nivel ASSESSMENT (KPUB-KA-1..6).
 *   PASO 8  — separación de funciones createdBy/reviewedBy/approvedBy
 *             (excepción de actor único permitida SOLO con registro expreso).
 *   PASO 11 — cambio de correctAnswer ⇒ NUEVA itemVersion; versión antigua
 *             RETIRED; jamás se edita una versión existente.
 *   PASO 12 — regla conservadora de nueva versión por cambio de contenido.
 *   PASO 13 — dificultad como metadato (sin pesos, sin invención).
 *   PASO 14 — límites de IA: toda salida IA nace DRAFT; IA jamás publica.
 *   PASO 16 — clasificación de registros existentes (backward compatibility).
 *
 * Este módulo es PURO (sin I/O) para poder testearlo con bun:test.
 * NO modifica scoring de IPIP/personalidad/integridad/competencias/overall.
 */

import {
  KNOWLEDGE_ITEM_STATUSES,
  KNOWLEDGE_SCORING_VERSION,
  canPublishKnowledgeItem,
  isPublishingActorAllowed,
} from './scoring'

// ────────────────────────────────────────────────────────────────────────
// Constantes de gobernanza
// ────────────────────────────────────────────────────────────────────────

/** Ciclo de vida de entidades de gobernanza (blueprint/requirement/assessment). */
export const KNOWLEDGE_GOVERNANCE_STATUSES = [
  'DRAFT',
  'REVIEW',
  'APPROVED',
  'ACTIVE',
  'SUSPENDED',
  'RETIRED',
  'REJECTED',
] as const
export type KnowledgeGovernanceStatus = (typeof KNOWLEDGE_GOVERNANCE_STATUSES)[number]

/** Estados de publicación de un KnowledgeAssessment (PASO 5/7). */
export const KNOWLEDGE_ASSESSMENT_STATUSES = [
  'DRAFT',
  'APPROVED',
  'ACTIVE',
  'SUSPENDED',
  'RETIRED',
] as const
export type KnowledgeAssessmentStatus = (typeof KNOWLEDGE_ASSESSMENT_STATUSES)[number]

/** Dificultad (PASO 13): metadato descriptivo — JAMÁS peso de scoring (KD-5). */
export const KNOWLEDGE_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'UNKNOWN'] as const
export type KnowledgeDifficulty = (typeof KNOWLEDGE_DIFFICULTIES)[number]

/** Dificultad por defecto: UNKNOWN — no se inventa (KD-1, A-03.1 PASO 9). */
export const DEFAULT_KNOWLEDGE_DIFFICULTY: KnowledgeDifficulty = 'UNKNOWN'

/** Importancia declarativa de un requirement (descriptiva, NUNCA peso). */
export const KNOWLEDGE_IMPORTANCES = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA'] as const
export type KnowledgeImportance = (typeof KNOWLEDGE_IMPORTANCES)[number]

/**
 * Actor de gobernanza del banco del sistema (herencia A-03.2:
 * SYSTEM_KNOWLEDGE_GOVERNANCE.reviewedBy/approvedBy). EXCEPCIÓN REGISTRADA de
 * actor único: el contenido del banco cerrado del sistema fue elaborado y
 * revisado por la gobernanza humana documental de las fases A-03.1/A-03.2
 * (sin IA). La excepción está documentada en evidence-a03-3/07-role-separation.md
 * y se registra en la columna governanceNote de cada entidad del sistema.
 */
export const SYSTEM_GOVERNANCE_ACTOR = 'A-03.2-GOVERNANCE'

/** Texto canónico de la excepción registrada (PASO 8: "registrar la excepción"). */
export const GOVERNANCE_EXCEPTION_NOTE =
  'EXCEPCION_REGISTRADA (politica A-03.3 PASO 8): banco cerrado del sistema ' +
  'elaborado y revisado por la gobernanza humana documental A-03.1/A-03.2; ' +
  'autor=revisor=aprobador (' + SYSTEM_GOVERNANCE_ACTOR + ') permitido por ' +
  'politica expresa para contenido SYSTEM_BANK sin participacion de IA. ' +
  'Items creados por RH NO heredan esta excepcion.'

/** Razones canónicas para crear una nueva itemVersion (PASO 11/12). */
export const ITEM_VERSION_CHANGE_REASONS = [
  'INITIAL',
  'KEY_CHANGE',
  'CONTENT_CHANGE',
  'INITIAL_REGISTRATION_BACKFILL',
] as const
export type ItemVersionChangeReason = (typeof ITEM_VERSION_CHANGE_REASONS)[number]

// ────────────────────────────────────────────────────────────────────────
// PASO 7 — Compuertas de publicación del ASSESSMENT (KPUB-KA-1..6)
// ────────────────────────────────────────────────────────────────────────

export interface AssessmentPublishInput {
  /** Estado del blueprint referenciado. */
  blueprintStatus: string | null | undefined
  /** Estados de TODOS los requirements del blueprint. */
  requirementStatuses: (string | null | undefined)[]
  /** Estados de TODOS los items que componen el assessment. */
  itemStatuses: (string | null | undefined)[]
  /** Claves de TODOS los items (null = item sin correctAnswer). */
  itemCorrectAnswers: (number | null | undefined)[]
  /** scoringVersion declarada. */
  scoringVersion: string | null | undefined
  /** assessmentVersion declarada (versionado completo). */
  assessmentVersion: string | null | undefined
  /** blueprintVersion declarada (versionado completo). */
  blueprintVersion: number | null | undefined
  /** itemVersions de todos los items (versionado completo). */
  itemVersions: (number | null | undefined)[]
}

export interface AssessmentPublishGuardResult {
  canPublish: boolean
  /** Códigos de falla KPUB-KA-* (todos los detectados). */
  reasons: string[]
}

/**
 * PASO 7 — Un Assessment SOLO puede publicarse si:
 *   KPUB-KA-1 blueprint APPROVED;
 *   KPUB-KA-2 requirements APPROVED (todos, y al menos uno);
 *   KPUB-KA-3 items APPROVED (todos — APPROVED o ACTIVE, que ya superó la
 *             compuerta de aprobación; y al menos uno);
 *   KPUB-KA-4 correctAnswer presente en todos los items;
 *   KPUB-KA-5 scoringVersion definida;
 *   KPUB-KA-6 versionado completo (assessmentVersion + blueprintVersion +
 *             itemVersion en todos los items).
 */
export function canPublishKnowledgeAssessment(
  input: AssessmentPublishInput
): AssessmentPublishGuardResult {
  const reasons: string[] = []

  if (input.blueprintStatus !== 'APPROVED') {
    reasons.push('KPUB-KA-1_BLUEPRINT_NOT_APPROVED')
  }

  const reqStatuses = input.requirementStatuses ?? []
  if (reqStatuses.length === 0 || reqStatuses.some((s) => s !== 'APPROVED')) {
    reasons.push('KPUB-KA-2_REQUIREMENTS_NOT_APPROVED')
  }

  const itemStatuses = input.itemStatuses ?? []
  const itemPassedApproval = (s: string | null | undefined) => s === 'APPROVED' || s === 'ACTIVE'
  if (itemStatuses.length === 0 || itemStatuses.some((s) => !itemPassedApproval(s))) {
    reasons.push('KPUB-KA-3_ITEMS_NOT_APPROVED')
  }

  const keys = input.itemCorrectAnswers ?? []
  if (keys.length === 0 || keys.some((k) => k === null || k === undefined)) {
    reasons.push('KPUB-KA-4_CORRECTANSWER_MISSING')
  }

  if (!input.scoringVersion) {
    reasons.push('KPUB-KA-5_SCORING_VERSION_MISSING')
  }

  if (
    !input.assessmentVersion ||
    input.blueprintVersion === null ||
    input.blueprintVersion === undefined ||
    (input.itemVersions ?? []).some((v) => v === null || v === undefined)
  ) {
    reasons.push('KPUB-KA-6_VERSIONING_INCOMPLETE')
  }

  return { canPublish: reasons.length === 0, reasons }
}

// ────────────────────────────────────────────────────────────────────────
// PASO 8 — Separación de funciones
// ────────────────────────────────────────────────────────────────────────

export interface GovernanceActors {
  createdBy: string | null | undefined
  reviewedBy: string | null | undefined
  approvedBy: string | null | undefined
  /** Nota de excepción registrada (solo política expresa de gobernanza). */
  governanceNote?: string | null
}

export interface GovernanceSeparationResult {
  ok: boolean
  /** Violaciones detectadas (GSEP-*). */
  violations: string[]
  /** true si los tres roles fueron ejercidos por un mismo actor CON excepción registrada. */
  singleActorExceptionUsed: boolean
}

/**
 * PASO 8 — Verifica separación de funciones createdBy/reviewedBy/approvedBy:
 *   GSEP-1  los tres actores deben estar registrados;
 *   GSEP-2  autor = revisor = aprobador SOLO con excepción registrada
 *           (governanceNote que declare la política expresa).
 * Dos actores iguales (p.ej. revisor=aprobador ≠ autor) se tolera en DEMO y se
 * reporta como advertencia documental (misma política, excepción registrada).
 */
export function checkGovernanceSeparation(actors: GovernanceActors): GovernanceSeparationResult {
  const violations: string[] = []
  const { createdBy, reviewedBy, approvedBy, governanceNote } = actors

  if (!createdBy || !reviewedBy || !approvedBy) {
    violations.push('GSEP-1_ACTORS_INCOMPLETE')
  }

  const allSame =
    !!createdBy && createdBy === reviewedBy && reviewedBy === approvedBy

  let singleActorExceptionUsed = false
  if (allSame) {
    if (governanceNote && governanceNote.includes('EXCEPCION_REGISTRADA')) {
      singleActorExceptionUsed = true
    } else {
      violations.push('GSEP-2_SAME_ACTOR_WITHOUT_REGISTERED_EXCEPTION')
    }
  }

  return { ok: violations.length === 0, violations, singleActorExceptionUsed }
}

// ────────────────────────────────────────────────────────────────────────
// PASO 14 — Límites de IA
// ────────────────────────────────────────────────────────────────────────

/** Orígenes de autoría de un reactivo (generatedBy). */
export const KNOWLEDGE_ORIGINS = ['HUMAN', 'SYSTEM_BANK', 'AI_DRAFT'] as const
export type KnowledgeOrigin = (typeof KNOWLEDGE_ORIGINS)[number]

export function isAiOrigin(origin: string | null | undefined): boolean {
  return origin === 'AI_DRAFT' || origin === 'AI'
}

export interface AiDraftEnforcementInput {
  origin?: string | null | undefined
  knowledgeStatus?: string | null
  reviewedBy?: string | null
  approvedBy?: string | null
}

export interface AiDraftEnforcementResult {
  /** Estado forzado. */
  knowledgeStatus: string
  /** Revisor/aprobador forzados (null para IA). */
  reviewedBy: string | null
  approvedBy: string | null
  /** true si se aplicó la frontera IA (origin = AI). */
  enforced: boolean
}

/**
 * PASO 14 (AI-X20..X25, A-03.1 PASO 5) — toda salida de IA:
 *   generatedBy = AI  (origin = 'AI_DRAFT')
 *   estado = DRAFT    (hasta revisión humana)
 *   sin revisor ni aprobador (la IA no aprueba, no publica, no define clave)
 */
export function enforceAiDraftBoundaries(
  input: AiDraftEnforcementInput
): AiDraftEnforcementResult {
  if (!isAiOrigin(input.origin)) {
    return {
      knowledgeStatus: input.knowledgeStatus ?? 'DRAFT',
      reviewedBy: input.reviewedBy ?? null,
      approvedBy: input.approvedBy ?? null,
      enforced: false,
    }
  }
  return {
    knowledgeStatus: 'DRAFT',
    reviewedBy: null,
    approvedBy: null,
    enforced: true,
  }
}

/**
 * PASO 14 — la IA NO puede publicar (ítem, blueprint, requirement ni
 * assessment). Delegado a la compuerta de actores de A-03.2: solo roles
 * humanos autorizados (RH/GERENTE/SUPER_ADMIN).
 */
export function canAiPublish(): false {
  return false
}

/** Actor/rol humano autorizado a publicar (reexportación de A-03.2). */
export function isHumanPublishingActor(role: string | null | undefined): boolean {
  return isPublishingActorAllowed(role)
}

// ────────────────────────────────────────────────────────────────────────
// PASO 11/12 — Versionado de ítems (regla conservadora)
// ────────────────────────────────────────────────────────────────────────

/** Campos metodológicamente relevantes de un ítem (PASO 12). */
export interface ItemVersionedContent {
  question: string | null | undefined
  options: string | null | undefined
  correctAnswer: number | null | undefined
  correctAnswerSource: string | null | undefined
  correctAnswerRationale: string | null | undefined
}

export interface RequiresNewVersionResult {
  required: boolean
  /** Campos que motivan la nueva versión (regla conservadora: cualquiera). */
  changedFields: string[]
}

/**
 * PASO 12 — regla CONSERVADORA: si cambia CUALQUIERA de
 * question / options / correctAnswer / source / rationale ⇒ nueva itemVersion
 * obligatoria (el cambio puede afectar el significado o el scoring).
 * La dificultad NO dispara versión (metadato sin efecto en scoring — KD-5,
 * PASO 13); se registra en auditoría, no altera el contenido evaluado.
 */
export function requiresNewItemVersion(
  prev: ItemVersionedContent,
  next: ItemVersionedContent
): RequiresNewVersionResult {
  const changedFields: string[] = []
  if ((prev.question ?? null) !== (next.question ?? null)) changedFields.push('question')
  if ((prev.options ?? null) !== (next.options ?? null)) changedFields.push('options')
  if ((prev.correctAnswer ?? null) !== (next.correctAnswer ?? null)) changedFields.push('correctAnswer')
  if ((prev.correctAnswerSource ?? null) !== (next.correctAnswerSource ?? null)) changedFields.push('correctAnswerSource')
  if ((prev.correctAnswerRationale ?? null) !== (next.correctAnswerRationale ?? null)) changedFields.push('correctAnswerRationale')
  return { required: changedFields.length > 0, changedFields }
}

/**
 * PASO 11 — decisión de cambio de clave:
 *   - NUNCA se modifica la versión antigua (append-only);
 *   - se crea una NUEVA itemVersion (incremento mayor);
 *   - la versión antigua pasa a RETIRED para nuevas administraciones;
 *   - los resultados históricos permanecen vinculados a la versión anterior
 *     (el snapshot de clave por respuesta ya lo garantiza — A-03.2 PASO 10).
 */
export interface KeyChangeDecision {
  newItemVersion: number
  previousCorrectAnswer: number | null
  oldVersionStatus: 'RETIRED'
  changeReason: 'KEY_CHANGE'
}

export function decideKeyChange(
  currentItemVersion: number,
  previousKey: number | null | undefined
): KeyChangeDecision {
  return {
    newItemVersion: currentItemVersion + 1,
    previousCorrectAnswer: previousKey ?? null,
    oldVersionStatus: 'RETIRED',
    changeReason: 'KEY_CHANGE',
  }
}

/**
 * PASO 6/16 — construye el contenido de un row de historial (append-only)
 * a partir del estado vigente de un ítem. Para ítems legacy que cambian por
 * primera vez se registra además la versión inicial con changeReason
 * INITIAL_REGISTRATION_BACKFILL (contenido real previo al cambio, registrado
 * con fecha honesta de registro — no se inventa metadata de administración).
 */
export function buildItemVersionRow(
  question: {
    id: string
    text: string
    options: string | null
    correctAnswer: number | null
    correctAnswerSource: string | null
    correctAnswerRationale: string | null
    difficulty: string | null
    origin: string | null
    reviewedBy: string | null
    approvedBy: string | null
    knowledgeStatus: string | null
    companyId?: string | null
  },
  itemVersion: number,
  changeReason: ItemVersionChangeReason
) {
  return {
    questionRef: { connect: { id: question.id } },
    itemVersion,
    question: question.text,
    options: question.options,
    correctAnswer: question.correctAnswer,
    correctAnswerSource: question.correctAnswerSource,
    correctAnswerRationale: question.correctAnswerRationale,
    difficulty: question.difficulty ?? DEFAULT_KNOWLEDGE_DIFFICULTY,
    status: question.knowledgeStatus ?? 'RETIRED',
    origin: question.origin,
    reviewedBy: question.reviewedBy,
    approvedBy: question.approvedBy,
    changeReason,
    supersededByVersion: null as number | null,
    ...(question.companyId
      ? { company: { connect: { id: question.companyId } } }
      : {}),
  }
}

// ────────────────────────────────────────────────────────────────────────
// PASO 16 — Clasificación de registros existentes (backward compatibility)
// ────────────────────────────────────────────────────────────────────────

export type KnowledgeRecordClassification =
  | 'VALIDATED-V1' // A-03.2 clase A: ciclo de vida + clave + fuente + revisión + versión
  | 'LEGACY'       // pre-A-03.2: sin metadata de gobernanza (no se inventa)
  | 'INVALID'      // A-03.2 clase B: declara ciclo de vida pero sin clave (no puntúa)
  | 'UNKNOWN'      // A-03.2 clase C: metadata incompleta/dudosa
  | 'NOT_APPLICABLE' // pregunta ajena a conocimientos

export interface KnowledgeClassificationInput {
  category: string | null | undefined
  knowledgeStatus: string | null | undefined
  correctAnswer: number | null | undefined
  correctAnswerSource: string | null | undefined
  reviewedBy: string | null | undefined
  itemVersion: number | null | undefined
}

/**
 * PASO 16 — clasificación conservadora SIN modificar históricos y SIN
 * inventar metadata. Mapeo desde la clasificación A-03.2 (A/B/C/D):
 *   A (clave+fuente+revisión+versión+ACTIVE) → VALIDATED-V1
 *   B (declarada pero sin clave)             → INVALID
 *   C (metadata incompleta/dudosa)           → UNKNOWN
 *   D/pre-A-03.2 (sin ciclo de vida)         → LEGACY
 */
export function classifyKnowledgeRecord(q: KnowledgeClassificationInput): KnowledgeRecordClassification {
  if (q.category !== 'KNOWLEDGE') return 'NOT_APPLICABLE'
  if (!q.knowledgeStatus) return 'LEGACY'
  if (q.correctAnswer === null || q.correctAnswer === undefined) return 'INVALID'
  if (!q.correctAnswerSource || !q.reviewedBy || !q.itemVersion) return 'UNKNOWN'
  return 'VALIDATED-V1'
}

// ────────────────────────────────────────────────────────────────────────
// PASO 5/9 — versiones de assessment / blueprint
// ────────────────────────────────────────────────────────────────────────

/**
 * Genera el identificador de assessmentVersion para la N-ésima versión de un
 * puesto (N = assessments existentes + 1). Formato: KA-vN — inmutable.
 */
export function nextAssessmentVersion(existingCount: number): string {
  return `KA-v${(existingCount || 0) + 1}`
}

/** scoringVersion vigente (herencia A-03.2 — no se redefine aquí). */
export function currentKnowledgeScoringVersion(): string {
  return KNOWLEDGE_SCORING_VERSION
}

// Reexportaciones útiles para consumidores del módulo de gobernanza.
export {
  KNOWLEDGE_ITEM_STATUSES,
  KNOWLEDGE_SCORING_VERSION,
  canPublishKnowledgeItem,
  isPublishingActorAllowed,
}
