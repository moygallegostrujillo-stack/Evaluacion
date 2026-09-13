/**
 * A-03.2 PASO 11 — TESTS UNITARIOS del scoring de conocimientos.
 *
 * Ejecutar: bun test tests/knowledge-scoring.test.ts
 *
 * Cubre los 10 tests del encargo A-03.2:
 *   TEST 1  correctAnswer existe + respuesta correcta   → SCORABLE + CORRECT
 *   TEST 2  correctAnswer existe + respuesta incorrecta → SCORABLE + INCORRECT
 *   TEST 3  correctAnswer = null                        → NOT_SCORABLE
 *   TEST 4  assessment con item sin clave               → INSUFFICIENT
 *   TEST 5  MISSING ≠ incorrect
 *   TEST 6  no hay prorrateo indebido
 *   TEST 7  cambio de correctAnswer crea nueva versión
 *   TEST 8  resultado histórico mantiene versión anterior (snapshot congelado)
 *   TEST 9  KnowledgeItem sin correctAnswer no puede ACTIVE
 *   TEST 10 IA no puede publicar automáticamente
 */
import { describe, test, expect } from 'bun:test'
import {
  deriveScorability,
  scoreKnowledgeItem,
  scoreKnowledgeItems,
  nextItemVersionOnKeyChange,
  rescoreFromFrozenSnapshot,
  canPublishKnowledgeItem,
  isPublishingActorAllowed,
  KNOWLEDGE_SCORING_VERSION,
} from '../src/lib/knowledge/scoring'

describe('A-03.2 — scoring de conocimientos', () => {
  test('TEST 1: correctAnswer existe + respuesta correcta → SCORABLE + CORRECT', () => {
    const single = scoreKnowledgeItem(2, '2')
    expect(single.scorability).toBe('SCORABLE')
    expect(single.outcome).toBe('CORRECT')

    const result = scoreKnowledgeItems([
      { questionId: 'q1', correctAnswer: 2, responseValue: '2' },
      { questionId: 'q2', correctAnswer: 0, responseValue: '0' },
    ])
    expect(result.status).toBe('VALID')
    expect(result.score).toBe(100)
    expect(result.correctItems).toBe(2)
  })

  test('TEST 2: correctAnswer existe + respuesta incorrecta → SCORABLE + INCORRECT', () => {
    const single = scoreKnowledgeItem(2, '3')
    expect(single.scorability).toBe('SCORABLE')
    expect(single.outcome).toBe('INCORRECT')

    const result = scoreKnowledgeItems([
      { questionId: 'q1', correctAnswer: 2, responseValue: '3' },
    ])
    expect(result.status).toBe('VALID')
    expect(result.score).toBe(0) // 0 aciertos sobre 1 item scorable — 0 legítimo
    expect(result.incorrectItems).toBe(1)
  })

  test('TEST 3: correctAnswer = null → NOT_SCORABLE', () => {
    expect(deriveScorability(null)).toBe('NOT_SCORABLE')
    expect(deriveScorability(undefined)).toBe('NOT_SCORABLE')
    expect(deriveScorability(1)).toBe('SCORABLE')

    const single = scoreKnowledgeItem(null, '0')
    expect(single.scorability).toBe('NOT_SCORABLE')
    expect(single.outcome).toBe('NOT_SCORABLE')
  })

  test('TEST 4: assessment con un item sin correctAnswer → status INSUFFICIENT', () => {
    const result = scoreKnowledgeItems([
      { questionId: 'q1', correctAnswer: 1, responseValue: '1' },
      { questionId: 'q2', correctAnswer: null, responseValue: '0' }, // sin clave
    ])
    expect(result.status).toBe('INSUFFICIENT')
    expect(result.reasonCode).toBe('KNOWLEDGE_KEY_MISSING')
    expect(result.score).toBeNull() // NO 0 — jamás se fabrica score
    expect(result.notScorableItems).toBe(1)
  })

  test('TEST 5: MISSING ≠ incorrect (el sin-clave no cuenta como error ni en el denominador)', () => {
    const result = scoreKnowledgeItems([
      { questionId: 'q1', correctAnswer: 1, responseValue: '0' }, // incorrecta real
      { questionId: 'q2', correctAnswer: null, responseValue: '1' }, // sin clave
      { questionId: 'q3', correctAnswer: null, responseValue: '2' }, // sin clave
    ])
    // Si missing = incorrecta, el score sería 0/3 = 0. La regla correcta:
    // solo la incorrecta real cuenta (INCORRECT), y el estado es INSUFFICIENT.
    expect(result.incorrectItems).toBe(1)
    expect(result.notScorableItems).toBe(2)
    expect(result.status).toBe('INSUFFICIENT')
    expect(result.reasonCode).toBe('KNOWLEDGE_KEY_MISSING')
    expect(result.score).toBeNull()
  })

  test('TEST 6: no hay prorrateo indebido (parcial no se rescala ni divide entre contestadas)', () => {
    // Set publicado = 5 items; el candidato respondió 4 (todos correctos).
    // Prohibido: 4/4 = 100 o 4/5*recalibrado. La administración es parcial ⇒ INSUFFICIENT.
    const result = scoreKnowledgeItems(
      [
        { questionId: 'q1', correctAnswer: 0, responseValue: '0' },
        { questionId: 'q2', correctAnswer: 1, responseValue: '1' },
        { questionId: 'q3', correctAnswer: 2, responseValue: '2' },
        { questionId: 'q4', correctAnswer: 3, responseValue: '3' },
      ],
      { expectedCount: 5 }
    )
    expect(result.status).toBe('INSUFFICIENT')
    expect(result.reasonCode).toBe('KNOWLEDGE_INCOMPLETE')
    expect(result.score).toBeNull() // NO 100, NO 80 — null

    // Contraste: administración completa con 4/5 correctas → VALID, score = 80
    const full = scoreKnowledgeItems(
      [
        { questionId: 'q1', correctAnswer: 0, responseValue: '0' },
        { questionId: 'q2', correctAnswer: 1, responseValue: '1' },
        { questionId: 'q3', correctAnswer: 2, responseValue: '2' },
        { questionId: 'q4', correctAnswer: 3, responseValue: '3' },
        { questionId: 'q5', correctAnswer: 1, responseValue: '0' },
      ],
      { expectedCount: 5 }
    )
    expect(full.status).toBe('VALID')
    expect(full.score).toBe(80)
  })

  test('TEST 7: cambio de correctAnswer crea nueva versión (itemVersion +1)', () => {
    expect(nextItemVersionOnKeyChange(1)).toBe(2)
    expect(nextItemVersionOnKeyChange(3)).toBe(4)
    // La versión SIEMPRE incrementa — jamás se reutiliza la misma
    expect(nextItemVersionOnKeyChange(2)).toBeGreaterThan(2)
  })

  test('TEST 8: resultado histórico mantiene la versión anterior (snapshot congelado)', () => {
    // Administración original: clave = 1, respuesta del candidato = 1 → CORRECT,
    // snapshot congelado = 1 (persistido en EvaluationResponse).
    const original = scoreKnowledgeItem(1, '1')
    expect(original.outcome).toBe('CORRECT')
    const frozenSnapshot = 1

    // Posteriormente el RH cambia la clave a 2 (nueva versión del item).
    // El desenlace histórico se re-deriva SOLO desde el snapshot congelado:
    expect(rescoreFromFrozenSnapshot(frozenSnapshot, '1')).toBe('CORRECT')
    // …aunque la clave VIGENTE sea ahora otra (2). El histórico no cambia.
    expect(rescoreFromFrozenSnapshot(frozenSnapshot, '1')).not.toBe(
      scoreKnowledgeItem(2, '1').outcome
    )
    // Un item con snapshot null (sin clave al calificar) permanece NOT_SCORABLE:
    expect(rescoreFromFrozenSnapshot(null, '0')).toBe('NOT_SCORABLE')
  })

  test('TEST 9: KnowledgeItem sin correctAnswer no puede ACTIVE', () => {
    expect(
      canPublishKnowledgeItem({ correctAnswer: null, itemVersion: 1, correctAnswerSource: 'ELABORACION_REVISADA', reviewedBy: 'rh' }).canPublish
    ).toBe(false)
    // Sin fuente ⇒ no puede publicarse (PASO 15: no ACTIVE sin fuente)
    expect(
      canPublishKnowledgeItem({ correctAnswer: 1, itemVersion: 1, reviewedBy: 'rh' }).reason
    ).toBe('KNOWLEDGE_KEY_SOURCE_MISSING')
    // Sin revisión ⇒ no puede publicarse
    expect(
      canPublishKnowledgeItem({ correctAnswer: 1, itemVersion: 1, correctAnswerSource: 'ELABORACION_REVISADA' }).reason
    ).toBe('KNOWLEDGE_REVIEW_MISSING')
    // Clave fuera de rango ⇒ no puede publicarse
    expect(
      canPublishKnowledgeItem({ correctAnswer: 9, optionsCount: 4, itemVersion: 1, correctAnswerSource: 'ELABORACION_REVISADA', reviewedBy: 'rh' }).reason
    ).toBe('KNOWLEDGE_KEY_OUT_OF_RANGE')
    // Completo ⇒ puede publicarse
    expect(
      canPublishKnowledgeItem({ correctAnswer: 1, optionsCount: 4, itemVersion: 1, correctAnswerSource: 'ELABORACION_REVISADA', reviewedBy: 'rh' }).canPublish
    ).toBe(true)
  })

  test('TEST 10: IA no puede publicar automáticamente', () => {
    expect(isPublishingActorAllowed('AI')).toBe(false)
    expect(isPublishingActorAllowed('AI_AGENT')).toBe(false)
    expect(isPublishingActorAllowed('CANDIDATO')).toBe(false)
    expect(isPublishingActorAllowed('SYSTEM')).toBe(false)
    expect(isPublishingActorAllowed(null)).toBe(false)
    // Solo roles humanos autorizados:
    expect(isPublishingActorAllowed('RH')).toBe(true)
    expect(isPublishingActorAllowed('GERENTE')).toBe(true)
    expect(isPublishingActorAllowed('SUPER_ADMIN')).toBe(true)
  })

  test('EXTRA: la versión de scoring queda registrada en cada resultado', () => {
    const result = scoreKnowledgeItems([{ questionId: 'q1', correctAnswer: 1, responseValue: '1' }])
    expect(result.scoringVersion).toBe(KNOWLEDGE_SCORING_VERSION)
    expect(result.scoringVersion).toBe('KNOWLEDGE-SCORING-1.0')
  })
})
