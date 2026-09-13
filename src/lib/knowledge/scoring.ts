/**
 * A-03.2 — Módulo de scoring de conocimientos (Knowledge Assessment).
 *
 * Regla central (herencia A-02.2 K-INS-1 / A-02.3 escenarios A–E / A-03.1):
 *   MISSING correctAnswer ≠ respuesta incorrecta.
 *   Un item sin clave es NOT_SCORABLE y NUNCA se trata como incorrecto.
 *   Si una administración contiene items NOT_SCORABLE ⇒ resultado INSUFFICIENT
 *   (reasonCode KNOWLEDGE_KEY_MISSING) y knowledgeScore = null — jamás 0
 *   (regla de oro: INSUFFICIENT ≠ 0).
 *
 * Este módulo es PURO (sin I/O) para poder testearlo con bun:test.
 * Implementación limitada autorizada por A-03.2; no modifica el scoring de
 * otros módulos (IPIP, personalidad, integridad, competencias, overall).
 */

/** Versión de la regla de scoring de conocimientos (A-03.2 PASO 9). */
export const KNOWLEDGE_SCORING_VERSION = 'KNOWLEDGE-SCORING-1.0'

/** Ciclo de vida de un KnowledgeItem (A-03.1 PASO 19 / A-03.2 PASO 2). */
export const KNOWLEDGE_ITEM_STATUSES = [
  'DRAFT',
  'REVIEW',
  'APPROVED',
  'ACTIVE',
  'SUSPENDED',
  'RETIRED',
  'REJECTED',
] as const
export type KnowledgeItemStatus = (typeof KNOWLEDGE_ITEM_STATUSES)[number]

/** Distinción de scoring por item (A-03.2 PASO 2). */
export type KnowledgeItemScorability = 'SCORABLE' | 'NOT_SCORABLE'

/** Desenlace por item calificado. */
export type KnowledgeScoringOutcome = 'CORRECT' | 'INCORRECT' | 'NOT_SCORABLE'

/** Estado del resultado de conocimientos (A-03.2 PASO 7). */
export type KnowledgeResultStatus = 'VALID' | 'INSUFFICIENT' | 'NOT_APPLICABLE'

/** Códigos de causa documentados (A-03.2 PASO 7/8). */
export type KnowledgeReasonCode =
  | 'KNOWLEDGE_KEY_MISSING' // al menos un item administrado sin correctAnswer
  | 'KNOWLEDGE_INCOMPLETE' // administración parcial del set publicado

/** Fuentes admisibles de una clave (A-03.2 PASO 4). */
export const KNOWLEDGE_KEY_SOURCES = [
  'DOCUMENTAL',
  'EXPERTO',
  'MATERIAL_CLIENTE',
  'NORMATIVA',
  'ELABORACION_REVISADA',
] as const
export type KnowledgeKeySource = (typeof KNOWLEDGE_KEY_SOURCES)[number]

export interface KnowledgeScoringItemInput {
  questionId: string
  /** Clave del item (0-based). null/undefined ⇒ NOT_SCORABLE. */
  correctAnswer: number | null | undefined
  /** Valor respondido por el candidato (índice seleccionado como string). null = sin respuesta. */
  responseValue: string | null | undefined
  /** Total de opciones (para detectar respuestas fuera de rango — calidad PASO 15). */
  optionsCount?: number | null
}

export interface KnowledgeItemResult {
  questionId: string
  scorability: KnowledgeItemScorability
  outcome: KnowledgeScoringOutcome
  /** Clave congelada para esta administración (snapshot; null si NOT_SCORABLE). */
  correctAnswerSnapshot: number | null
  /** Clave seleccionada parseada (null si no parseable / sin respuesta). */
  selectedIdx: number | null
}

export interface KnowledgeScoringResult {
  /** Desenlaces por item administrado (para persistir snapshots). */
  items: KnowledgeItemResult[]
  correctItems: number
  incorrectItems: number
  notScorableItems: number
  scorableItems: number
  /** 0–100 o null. null cuando el estado es INSUFFICIENT o NOT_APPLICABLE (jamás 0 artefactual). */
  score: number | null
  status: KnowledgeResultStatus
  reasonCode: KnowledgeReasonCode | null
  scoringVersion: string
}

/**
 * A-03.2 PASO 2: un item sin correctAnswer es NOT_SCORABLE.
 * (SCORABLE/NOT_SCORABLE se deriva de la existencia de clave — una sola
 * fuente de verdad, sin columnas que puedan desincronizarse.)
 */
export function deriveScorability(
  correctAnswer: number | null | undefined
): KnowledgeItemScorability {
  return correctAnswer === null || correctAnswer === undefined
    ? 'NOT_SCORABLE'
    : 'SCORABLE'
}

/**
 * A-03.2 PASO 6 — regla por item:
 *   response == correctAnswer → CORRECT
 *   response != correctAnswer → INCORRECT
 *   correctAnswer inexistente → NOT_SCORABLE (nunca INCORRECT — TEST 5)
 */
export function scoreKnowledgeItem(
  correctAnswer: number | null | undefined,
  responseValue: string | null | undefined
): { scorability: KnowledgeItemScorability; outcome: KnowledgeScoringOutcome } {
  if (correctAnswer === null || correctAnswer === undefined) {
    return { scorability: 'NOT_SCORABLE', outcome: 'NOT_SCORABLE' }
  }
  // Item sin respuesta explícita: se conserva como dato crudo, no produce
  // acierto (no se imputa); se reporta INCORRECT solo si hubo respuesta.
  if (responseValue === null || responseValue === undefined || responseValue === '') {
    return { scorability: 'SCORABLE', outcome: 'INCORRECT' }
  }
  const parsed = parseInt(responseValue, 10)
  const outcome: KnowledgeScoringOutcome =
    Number.isNaN(parsed) || parsed !== correctAnswer ? 'INCORRECT' : 'CORRECT'
  return { scorability: 'SCORABLE', outcome }
}

/**
 * A-03.2 PASO 6/7/8 — scoring de la sección de conocimientos:
 *   - Solo items SCORABLE reciben puntuación.
 *   - Cualquier item administrado sin clave ⇒ INSUFFICIENT / KNOWLEDGE_KEY_MISSING,
 *     score = null (sin prorrateo, sin rescate parcial, sin 0 artefactual).
 *   - Administración parcial (respuestas < items publicados) ⇒ INSUFFICIENT /
 *     KNOWLEDGE_INCOMPLETE, score = null (sin dividir entre lo contestado).
 *   - Sin respuestas de conocimiento ⇒ NOT_APPLICABLE (la sección no se administró).
 */
export function scoreKnowledgeItems(
  items: KnowledgeScoringItemInput[],
  options?: { expectedCount?: number | null }
): KnowledgeScoringResult {
  const results: KnowledgeItemResult[] = items.map((item) => {
    const { scorability, outcome } = scoreKnowledgeItem(
      item.correctAnswer,
      item.responseValue
    )
    return {
      questionId: item.questionId,
      scorability,
      outcome,
      correctAnswerSnapshot:
        scorability === 'SCORABLE' && item.correctAnswer !== undefined
          ? (item.correctAnswer as number)
          : null,
      selectedIdx:
        item.responseValue !== null && item.responseValue !== undefined && item.responseValue !== ''
          ? Number.isNaN(parseInt(item.responseValue, 10))
            ? null
            : parseInt(item.responseValue, 10)
          : null,
    }
  })

  const notScorableItems = results.filter((r) => r.outcome === 'NOT_SCORABLE').length
  const correctItems = results.filter((r) => r.outcome === 'CORRECT').length
  const incorrectItems = results.filter((r) => r.outcome === 'INCORRECT').length
  const scorableItems = results.filter((r) => r.scorability === 'SCORABLE').length

  const scoringVersion = KNOWLEDGE_SCORING_VERSION

  // Regla base vigente (PASO 8): cualquier correctAnswer faltante ⇒ INSUFFICIENT.
  if (notScorableItems > 0) {
    return {
      items: results,
      correctItems,
      incorrectItems,
      notScorableItems,
      scorableItems,
      score: null, // NUNCA 0 — INSUFFICIENT ≠ 0
      status: 'INSUFFICIENT',
      reasonCode: 'KNOWLEDGE_KEY_MISSING',
      scoringVersion,
    }
  }

  // Sin prorrateo (PASO 8): si el set publicado es mayor que lo administrado,
  // la administración es parcial ⇒ INSUFFICIENT, jamás "aciertos/contestadas".
  const expectedCount = options?.expectedCount
  if (
    expectedCount !== null &&
    expectedCount !== undefined &&
    results.length > 0 &&
    results.length < expectedCount
  ) {
    return {
      items: results,
      correctItems,
      incorrectItems,
      notScorableItems,
      scorableItems,
      score: null,
      status: 'INSUFFICIENT',
      reasonCode: 'KNOWLEDGE_INCOMPLETE',
      scoringVersion,
    }
  }

  // Sin respuestas ⇒ la sección no se administró (no es INSUFFICIENT ni 0).
  if (results.length === 0 || scorableItems === 0) {
    return {
      items: results,
      correctItems,
      incorrectItems,
      notScorableItems,
      scorableItems,
      score: null,
      status: 'NOT_APPLICABLE',
      reasonCode: null,
      scoringVersion,
    }
  }

  const score = Math.round((correctItems / scorableItems) * 100 * 100) / 100
  return {
    items: results,
    correctItems,
    incorrectItems,
    notScorableItems,
    scorableItems,
    score,
    status: 'VALID',
    reasonCode: null,
    scoringVersion,
  }
}

/**
 * A-03.2 PASO 9 — cambio de question/options/correctAnswer/scoring ⇒
 * nueva versión (incremento mayor del itemVersion).
 */
export function nextItemVersionOnKeyChange(currentItemVersion: number): number {
  return currentItemVersion + 1
}

/**
 * A-03.2 PASO 10 — el desenlace histórico se conserva desde el snapshot
 * congelado, no desde la clave vigente. Esta función permite re-derivar el
 * desenlace SOLO desde el snapshot (jamás desde la clave actual) — así un
 * cambio posterior de clave no puede alterar un resultado ya administrado.
 */
export function rescoreFromFrozenSnapshot(
  snapshot: number | null,
  responseValue: string | null | undefined
): KnowledgeScoringOutcome {
  if (snapshot === null) return 'NOT_SCORABLE'
  const { outcome } = scoreKnowledgeItem(snapshot, responseValue)
  return outcome
}

/**
 * A-03.2 PASO 3/9 — compuerta de publicación de un KnowledgeItem:
 * sin clave válida (dentro del rango de opciones), sin fuente, sin revisión
 * y sin versión NO puede publicarse (ACTIVE). La IA jamás es actor válido.
 */
export interface PublishableKnowledgeItem {
  correctAnswer: number | null | undefined
  optionsCount?: number | null
  correctAnswerSource?: string | null
  reviewedBy?: string | null
  itemVersion?: number | null
  knowledgeStatus?: string | null
}

export interface PublishGuardResult {
  canPublish: boolean
  reason?: string
}

export function canPublishKnowledgeItem(
  item: PublishableKnowledgeItem
): PublishGuardResult {
  if (
    item.correctAnswer === null ||
    item.correctAnswer === undefined
  ) {
    return { canPublish: false, reason: 'KNOWLEDGE_KEY_MISSING' }
  }
  if (
    item.optionsCount !== null &&
    item.optionsCount !== undefined &&
    (item.correctAnswer < 0 || item.correctAnswer >= item.optionsCount)
  ) {
    return { canPublish: false, reason: 'KNOWLEDGE_KEY_OUT_OF_RANGE' }
  }
  if (!item.correctAnswerSource) {
    return { canPublish: false, reason: 'KNOWLEDGE_KEY_SOURCE_MISSING' }
  }
  if (!item.reviewedBy) {
    return { canPublish: false, reason: 'KNOWLEDGE_REVIEW_MISSING' }
  }
  if (!item.itemVersion || item.itemVersion < 1) {
    return { canPublish: false, reason: 'KNOWLEDGE_VERSION_MISSING' }
  }
  return { canPublish: true }
}

/** Roles humanos autorizados a publicar/aprobar claves (A-03.2 PASO 5/14). */
const PUBLISHING_ROLES = ['RH', 'GERENTE', 'SUPER_ADMIN'] as const

/**
 * A-03.2 PASO 5/10 (TEST 10): la IA no puede publicar automáticamente.
 * Solo roles humanos autorizados; cualquier otro actor (IA, CANDIDATO,
 * SYSTEM) es rechazado.
 */
export function isPublishingActorAllowed(
  role: string | null | undefined
): boolean {
  if (!role) return false
  return (PUBLISHING_ROLES as readonly string[]).includes(role)
}

/**
 * A-03.2 PASO 15 — preguntas subjetivas (KS-1..KS-4, A-03.1 PASO 8):
 * los items de auto-reporte/acción hipotética NO son reactivos de
 * conocimiento objetivo y no entran al knowledgeScore sin método aprobado.
 * Detector conservador por patrón de texto (decisión humana final en revisión).
 */
const SUBJECTIVE_PATTERNS = [
  '¿qué harías',
  '¿qué haria',
  '¿cuál consideras',
  '¿cuál prefieres',
  '¿qué prefieres',
  '¿conoce ',
  '¿sabe cómo',
  '¿comprende las',
  '¿puede explicar',
]

export function looksLikeSubjectiveKnowledgeItem(text: string): boolean {
  const t = text.toLowerCase().trim()
  return SUBJECTIVE_PATTERNS.some((p) => t.startsWith(p) || t.includes(p))
}
