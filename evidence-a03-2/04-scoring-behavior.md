# EVALUHR — A-03.2 · PASO 18c
# COMPORTAMIENTO DE SCORING (04-scoring-behavior)

> Documento de comportamiento. Fecha: 2026-09-10. Fase A-03.2.
> Describe EXACTAMENTE cómo se puntúa ahora la evaluación de conocimientos,
> con los casos verificados por tests y E2E. Coherencia: A-02.3 escenarios
> A–E; A-03.1 PASO 6/10/11/12; regla de oro INSUFFICIENT ≠ 0.

---

## 1. Regla por item (PASO 6)

| Clave (`correctAnswer`) | Respuesta del candidato | Scorability | Outcome |
|---|---|---|---|
| presente | `value === correctAnswer` | SCORABLE | CORRECT |
| presente | `value !== correctAnswer` (incluye valor no numérico) | SCORABLE | INCORRECT |
| presente | sin respuesta (no fue respondida) | SCORABLE | INCORRECT* |
| **null** | cualquier valor (incluso respondió) | **NOT_SCORABLE** | **NOT_SCORABLE — NUNCA INCORRECT** |

*Un item SCORABLE sin respuesta explícita no produce acierto (no se imputa);
cuenta en el denominador como no acertado si el resto del set fue respondido
— con set incompleto cae en la regla de administración parcial (§3).

## 2. Regla por evaluación (PASO 7)

| Situación | `knowledgeScore` | `knowledgeStatus` | `knowledgeReasonCode` |
|---|---|---|---|
| Todos los items con clave + administración completa | `aciertos/scorables ×100` | `VALID` | — |
| Al menos UN item administrado sin clave | **`null` (NUNCA 0)** | `INSUFFICIENT` | `KNOWLEDGE_KEY_MISSING` |
| Administración parcial (respondidos < items publicados) | `null` | `INSUFFICIENT` | `KNOWLEDGE_INCOMPLETE` |
| Sección de conocimientos no administrada (0 respuestas) | `null` | `NOT_APPLICABLE` | — |

Comportamiento de campos dependientes (SIN cambiar sus fórmulas — PASO 12):

- `overallScore`: `knowledgeScore = null` se comporta como "sección sin dato
  válido" (excluida de la mezcla con sus pesos — lógica pre-existente). Un
  INSUFFICIENT jamás arrastra el global a 0 ni lo penaliza.
- `recommendation` (guidance): PERFIL_COMPLETO exige evidencia VÁLIDA de
  conocimientos (`knowledgeStatus === 'VALID'`); INSUFFICIENT ⇒ PERFIL_PARCIAL.
- `summary`: incluye "Evaluación de conocimientos: información insuficiente
  para obtener un resultado válido de conocimientos (causa)." cuando
  INSUFFICIENT (PASO 16). El 0 artefactual jamás se muestra como rendimiento.

## 3. NO prorrateo (PASO 8)

Prohibido y ausente por construcción:

- ❌ `aciertos / respondidas` cuando faltan items por responder
  (KNOWLEDGE_INCOMPLETE, no "score con lo contestado").
- ❌ Rescalar `x/M → x/N` o `x/M × 100/N`.
- ❌ "Rescatar" el score de los items buenos de un set con items sin clave.
- ❌ Dividir entre items NOT_SCORABLE en ningún caso.

Regla base vigente: **cualquier correctAnswer faltante ⇒ evaluación de
knowledge = INSUFFICIENT**. No se aplicó ninguna otra regla.

## 4. Interacción con overallScore (verificada, sin modificar fórmulas)

En la verificación E2E (flujo real): knowledgeScore=80, overallScore=65,
recommendation=PERFIL_PARCIAL — las fórmulas legacy produjeron exactamente lo
mismo que producirían con cualquier knowledgeScore válido. En el escenario
INSUFFICIENT: knowledgeScore=null ⇒ el global excluye la sección (no la
puntúa como 0).

## 5. Congelamiento (PASO 10) — vista de scoring

Al calificar ('complete' / paso 4 de vacantes), cada respuesta de
conocimiento persiste:

```
correctAnswerSnapshot  ← clave usada en ESTA administración
scoringOutcome         ← CORRECT | INCORRECT | NOT_SCORABLE
```

Efecto: cambiar `Question.correctAnswer` después de una administración
- crea una nueva `itemVersion` (PASO 9),
- NO recalcula ni altera el resultado histórico,
- el desenlace histórico es re-derivable SOLO desde el snapshot
  (`rescoreFromFrozenSnapshot`) — probado en TEST 8.

## 6. Casos verificados

| Caso | Resultado observado | Dónde |
|---|---|---|
| Clave + acierto | SCORABLE + CORRECT | TEST 1 |
| Clave + error | SCORABLE + INCORRECT | TEST 2 |
| Clave null | NOT_SCORABLE | TEST 3 |
| 1 item sin clave en el set | INSUFFICIENT, score null | TEST 4; E2E [7] |
| missing ≠ incorrect | 1 INCORRECT + 2 NOT_SCORABLE (no 3 errores) | TEST 5 |
| parcial 4/5 | INSUFFICIENT, null (no 80 ni 100) | TEST 6 |
| completo 4/5 | VALID, 80 | TEST 6 |
| flujo real 8/10 | VALID, 80, snapshots 10/10 | E2E [4][5] |
| clave eliminada | INSUFFICIENT, null, KNOWLEDGE_KEY_MISSING | E2E [7] |
