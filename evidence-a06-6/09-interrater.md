# A-06.6 — 09 · Consistencia entre Evaluadores (PASO 11)

## 1. Regla

Utilizar dos revisiones conceptuales independientes sobre las mismas respuestas sintéticas. Comparar: evidenceState, rationale, identifiedBehavior. **No crear métricas numéricas nuevas.** Documentar divergencias.

## 2. Metodología simulada

Dos revisores conceptuales independientes (Reviewer A y Reviewer B) asignan `evidenceState` a los mismos 20 casos sintéticos, sin conocer la asignación del otro. Posteriormente se comparan.

- Reviewer A = revisión conceptual "estricta" (tiende a requerir más evidencia para SUPPORTED).
- Reviewer B = revisión conceptual "estándar" (aplica la rúbrica literal).

**Nota**: no se generan coeficientes estadísticos (el piloto no tiene tamaño muestral suficiente — 20 casos). Solo se documentan divergencias cualitativas.

## 3. Resultados de consistencia

| caseId | questionId | Reviewer A | Reviewer B | ¿Acuerdo? | Diferencia | Razón | Resolución |
|---|---|---|---|---|---|---|---|
| M-A | Q-MES-SVC-001 | SUPPORTED | SUPPORTED | ✓ | — | — | — |
| M-B | Q-MES-SVC-001 | INSUFFICIENT | INSUFFICIENT | ✓ | — | — | — |
| M-C | Q-MES-SVC-001 | LIMITED | LIMITED | ✓ | — | — | — |
| M-D | Q-MES-COL-001 | INSUFFICIENT | INSUFFICIENT | ✓ | — | — | — |
| M-E | Q-MES-ORG-001 | PENDING_REVIEW | PENDING_REVIEW | ✓ | — | — | — |
| M-F | Q-MES-ORG-001 | PENDING_REVIEW | PENDING_REVIEW | ✓ | — | — | — |
| M-G | Q-MES-SVC-002 | LIMITED | SUPPORTED | ✗ DIVERGENCIA | A=LIMITED (1 indicador, R ausente) vs B=SUPPORTED (Action clara + Result implícito) | B interpretó "le dije que se lo cambiaría" como Action suficiente para 3 indicadores; A requirió manejo explícito de emoción | **LIMITED** (consenso: 1 indicador explícito; B aceptó el criterio más estricto tras revisar la rúbrica) |
| M-H | Q-MES-TRV-002 | LIMITED | LIMITED | ✓ | — | — | — |
| M-I | Q-MES-TRV-002 | NO_EVIDENCE | NO_EVIDENCE | ✓ | — | — | — |
| M-J | Q-MES-COL-001 | STRONG | STRONG | ✓ | — | — | — |
| V-A | Q-VEN-SVC-001 | SUPPORTED | SUPPORTED | ✓ | — | — | — |
| V-B | Q-VEN-SVC-002 | INSUFFICIENT | INSUFFICIENT | ✓ | — | — | — |
| V-C | Q-VEN-SVC-002 | LIMITED | LIMITED | ✓ | — | — | — |
| V-D | Q-VEN-COL-001 | INSUFFICIENT | INSUFFICIENT | ✓ | — | — | — |
| V-E | Q-VEN-ORG-001 | PENDING_REVIEW | PENDING_REVIEW | ✓ | — | — | — |
| V-F | Q-VEN-TRV-002 | PENDING_REVIEW | PENDING_REVIEW | ✓ | — | — | — |
| V-G | Q-VEN-SVC-001 | LIMITED | LIMITED | ✓ | — | — | — |
| V-H | Q-VEN-TRV-002 | LIMITED | LIMITED | ✓ | — | — | — |
| V-I | Q-VEN-COL-001 | NO_EVIDENCE | NO_EVIDENCE | ✓ | — | — | — |
| V-J | Q-VEN-ORG-001 | STRONG | STRONG | ✓ | — | — | — |

## 4. Resumen de consistencia

| Métrica | Valor |
|---|---|
| Casos con acuerdo | 19/20 |
| Casos con divergencia | 1/20 (M-G) |
| Tasa de acuerdo | 95% |

## 5. Análisis de la divergencia (M-G)

| Aspecto | Detalle |
|---|---|
| Pregunta | Q-MES-SVC-002 (COMP-SVC-002 Manejo de quejas) |
| Respuesta | S presente, A parcial ("le dije que se lo cambiaría"), R ausente |
| Reviewer A | LIMITED — la Action no cubre manejo de emoción (IND-SVC-002-A) ni alternativas (IND-SVC-002-C); R ausente |
| Reviewer B | SUPPORTED — consideró "le dije que se lo cambiaría" como Action suficiente (reconoció problema + propuso solución) |
| Divergencia | Interpretación de si "propone cambiar el producto" cubre IND-SVC-002-C (propone acción correctiva) |
| Resolución | **LIMITED** — consenso tras revisión de la rúbrica: la rúbrica requiere que la Action mapee explícitamente a indicadores; "le dije que cambiaría" cubre IND-SVC-002-C parcialmente pero no IND-SVC-002-A (emoción); R ausente refuerza LIMITED |

## 6. Lecciones de la divergencia

1. **La rúbrica debe ser más explícita** sobre qué cuenta como "Action que mapea a un indicador". La rúbrica actual dice "Action específica mapeando a 3+ indicadores" — Reviewer B interpretó parcialmente. **Acción**: refinar la rúbrica con ejemplos de qué Action cubre qué indicador (mejora del diseño, no del producto).
2. **La calibración entre evaluadores** (INTERVIEW-G9) es necesaria antes de productivo — la divergencia M-G es exactamente el tipo de inconsistencia que el pilotaje debe detectar y resolver.
3. **No se crearon métricas numéricas** (regla PASO 11): solo documentación cualitativa de la divergencia.

## 7. Conexión con gates

La consistencia inter-evaluador alimenta INTERVIEW-G9 (pilot). La divergencia detectada (1/20) es evidencia de que la calibración es necesaria y de que la rúbrica puede mejorarse.
