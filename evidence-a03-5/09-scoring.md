# A-03.5 — PASO 10/11: SCORING
## Un solo motor canónico · INSUFFICIENT ≠ 0 · KnowledgeResult separado de overallScore

## PASO 10 — criterio aprobado en A-03.2, INTACTO

`scoreCanonicalAdministration` (src/lib/knowledge-canonical.ts) es el ÚNICO
motor de scoring de conocimientos para AMBOS canales:

- **Denominador**: SOLO items con clave válida respondidos (`keyedAnswered`).
  Items sin clave (`hasKey=false`) ⇒ **not scorable** (K-INS) — excluidos,
  jamás contados como 0.
- **Fórmula**: `knowledgeScore = round((correct / keyedAnswered) * 100 * 100) / 100`.
- **Sin evidencia con clave** (`keyedAnswered === 0`) ⇒ `knowledgeScore = null`
  ⇒ semántica **INSUFFICIENT — NUNCA 0**.
- Correcto/incorrecto/not-scorable se conservan y ahora se PERSISTEN como
  contadores (`correctCount`, `keyedAnsweredCount`, `notScorableCount`, `totalItems`).
- El banco vivo jamás se consulta en scoring: solo snapshots del congelado.

### Estados de evidencia (mapeo A-03.2 — 5 estados)

| evidenceStatus | Condición | reasonCode |
|---|---|---|
| VALID | respondieron todos los items con clave | COMPLETE_KEYED |
| LIMITED | respuesta parcial del set con clave | PARTIAL_RESPONSE |
| INSUFFICIENT | cero evidencia con clave (score null — nunca 0) | NO_KEYED_EVIDENCE / KNOWLEDGE_KEY_MISSING (0 items con clave) |
| INVALID | corrupción de datos | (fail-closed — el scorer lanza y el flujo aborta con 500) |
| NOT_APPLICABLE | sin administración de conocimientos | — |

Verificado: SCORE-1 (keyless → null + INSUFFICIENT + KNOWLEDGE_KEY_MISSING),
SCORE-2/3 (interno 100 + VALID/COMPLETE_KEYED), CHG-4 (público VALID).

## PASO 11 — SEPARACIÓN explícita KnowledgeResult ↔ overallScore

1. **Entidad separada**: `KnowledgeResult` (tabla propia, FK a la
   administración) registra score, evidencia y contadores — con
   `scoringVersion` y `computedAt`.
2. **overallScore NO cambia**: la fórmula adaptativa de A-03.4 se conserva
   línea por línea en ambos flujos. La única interacción es la histórica:
   `knowledgeScore` (cuando es un número) participa con los mismos pesos.
3. **INSUFFICIENT no contamina**: con `knowledgeScore = null`, el overall usa
   la rama sin knowledge (0.30/0.30/0.40) — el null NO entra como 0
   (SCORE-4: 61.17 = fórmula exacta, no arrastrado).
4. **knowledgeScore NO implica decisión laboral**: ningún corte, peso,
   fórmula nueva ni prorrateo fue creado. La decisión de cómo (y si)
   knowledgeScore debe entrar al overallScore queda para una fase
   metodológica posterior — fuera del alcance A-03.5.

### Fórmulas intactas (verificadas numéricamente)

- Público: `0.25*psico + 0.25*psych + 0.15*integridad + 0.35*knowledge` (4 secciones) y ramas adaptativas (REG/SCORE-4).
- Interno: misma familia de pesos — REG-5: 0.25*75… + 0.35*100 = 77.19 exacto.

## Flujos que escriben KnowledgeResult

- Público: step=advance completedStep=4 (VERSIONED) → `writeKnowledgeResult` + administration COMPLETED.
- Interno: `completeEvaluation` con administración → ídem. Legacy (sin administración) → ruta histórica, sin KnowledgeResult (no migración).
