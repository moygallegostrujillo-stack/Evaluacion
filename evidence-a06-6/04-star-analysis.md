# A-06.6 — 04 · Análisis STAR (PASO 6)

## 1. Regla

Para cada respuesta verificar S/T/A/R presente/ausente. Determinar: ¿la ausencia de A hace imposible una lectura SUPPORTED?

**Regla esperada**: sin acción concreta → evidencia insuficiente o limitada.

## 2. Matriz STAR de los 20 casos

| caseId | S | T | A | R | STAR completo? | evidenceLevel |
|---|---|---|---|---|---|---|
| M-A | ✓ | ✓ | ✓ | ✓ | ✓ | SUPPORTED |
| M-B | ✗ | ✗ | ✗ | ✗ | ✗ | INSUFFICIENT |
| M-C | ✗(imaginado) | ✗ | ✗(intención) | ✗ | ✗ | LIMITED |
| M-D | ✓ | ✓ | ✗(del chef) | ✓ | ✗ | INSUFFICIENT |
| M-E | ✗ | ✗ | ✗ | ✓(sin conducta) | ✗ | PENDING_REVIEW |
| M-F | ✗ | ✗ | ✗ | ✗ | ✗ | PENDING_REVIEW |
| M-G | ✓ | ✓ | ✓(parcial) | ✗ | ✗ | LIMITED |
| M-H | ✓ | ✓ | ✓ | parcial | ✗(R parcial) | LIMITED |
| M-I | ✗ | ✗ | ✗ | ✗ | ✗ | NO_EVIDENCE |
| M-J | ✓×2 | ✓×2 | ✓×2 | ✓×2 | ✓ | STRONG |
| V-A | ✓ | ✓ | ✓ | ✓ | ✓ | SUPPORTED |
| V-B | ✗ | ✗ | ✗ | ✗ | ✗ | INSUFFICIENT |
| V-C | ✗ | ✗ | ✗ | ✗ | ✗ | LIMITED |
| V-D | ✓ | ✓ | ✗ | ✓ | ✗ | INSUFFICIENT |
| V-E | ✗ | ✗ | ✗ | ✓ | ✗ | PENDING_REVIEW |
| V-F | ✗ | ✗ | ✗ | ✗ | ✗ | PENDING_REVIEW |
| V-G | ✓ | ✓ | ✓(parcial) | ✗ | ✗ | LIMITED |
| V-H | ✓ | ✓ | ✓ | parcial | ✗ | LIMITED |
| V-I | ✗ | ✗ | ✗ | ✗ | ✗ | NO_EVIDENCE |
| V-J | ✓×2 | ✓×2 | ✓×2 | ✓×2 | ✓ | STRONG |

## 3. Análisis: ¿la ausencia de A hace imposible SUPPORTED?

**Hallazgo**: SÍ. En los 20 casos simulados:

| Patrón | A presente | evidenceLevel resultante |
|---|---|---|
| A (M-A, V-A) | ✓ completa | SUPPORTED |
| J (M-J, V-J) | ✓ completa ×2 | STRONG |
| G (M-G, V-G) | ✓ parcial (1 indicador) | LIMITED |
| C (M-C, V-C) | ✗ (intención) | LIMITED (no SUPPORTED) |
| D (M-D, V-D) | ✗ (acción de otros) | INSUFFICIENT |
| E (M-E, V-E) | ✗ | PENDING_REVIEW |
| B (M-B, V-B) | ✗ | INSUFFICIENT |
| I (M-I, V-I) | ✗ | NO_EVIDENCE |
| F (M-F, V-F) | ✗ | PENDING_REVIEW |
| H (M-H, V-H) | ✓ parcial | LIMITED |

**Conclusión**: la ausencia de Action (o una Action parcial que solo cubre 1 indicador) **nunca produjo SUPPORTED ni STRONG**. La regla "sin acción concreta → evidencia insuficiente o limitada" se cumplió en el 100% de los casos simulados.

## 4. Análisis: Action parcial → LIMITED

Los casos M-G, M-H, V-G, V-H tienen Action **parcial** (1–2 indicadores). Todos resultaron LIMITED (nunca SUPPORTED). Esto confirma que la cantidad de indicadores cubiertos por la Action determina el nivel:

| Indicadores cubiertos por Action | Nivel |
|---|---|
| 0 | INSUFFICIENT / NO_EVIDENCE |
| 1–2 | LIMITED |
| 3+ (1 ejemplo) | SUPPORTED |
| 3+ (2+ ejemplos) | STRONG |

## 5. Análisis: Result sin Action

Los casos M-E, V-E tienen Result positivo (30% eficiencia) sin Action. Resultaron **PENDING_REVIEW** (no SUPPORTED). Esto confirma: **resultado externo ≠ competencia demostrada** (A-06.3 `03-star.md`).

## 6. Análisis: STAR completo con 1 ejemplo vs 2+

| Casos | Ejemplos | Nivel |
|---|---|---|
| M-A, V-A | 1 completo (3 indicadores) | SUPPORTED |
| M-J, V-J | 2 completos (indicadores consistentes) | STRONG |

**Conclusión**: se necesita **más de un ejemplo** para STRONG. Un solo ejemplo completo, aunque mapee a 3 indicadores, produce SUPPORTED (no STRONG). Esto valida la regla A-06.5 `09-rubric.md`.

## 7. Conexión con hallazgos

Este análisis alimenta `15-findings.md` (PASO 22) y `05-question-quality.md` (PASO 4).
