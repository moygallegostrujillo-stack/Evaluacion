# EVALUHR — A-06.7 — 06 · Regla de Action (PASO 5)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Formalización de la regla de Action como **reglas metodológicas
> cualitativas — no puntos**. Heredada de A-06.3/A-06.5, validada 20/20 en el piloto A-06.6
> ("la ausencia de Action nunca produjo SUPPORTED ni STRONG"), formalizada aquí para entrenamiento y calibración.

## 1. Principio

En BDI/STAR, la **Action propia del candidato es la evidencia clave**. Situation y Task dan contexto;
Result verifica el desenlace; solo la **Action** demuestra la competencia. Todo lo demás — resultados
ajenos, intenciones, reflexiones, opiniones — no puede sustituir a la Action.

## 2. Las cuatro reglas formales

| # | Regla | Consecuencia de nivel | Ejemplo del piloto |
|---|---|---|---|
| **R1** | **Sin acción propia concreta → NO SUPPORTED / NO STRONG.** Si la Action descrita es de otros (chef, supervisor, "el equipo") o no existe, no hay indicadores observables del candidato. | INSUFFICIENT (si no hay conducta del candidato) o NO_EVIDENCE (si no hay nada). Con resultado externo invocado → PENDING_REVIEW. Nunca SUPPORTED/STRONG. | M-D / V-D: "el chef reorganizó y seguimos sus instrucciones" → INSUFFICIENT |
| **R2** | **Acción parcial → máximo LIMITED, salvo fundamento documentado.** Action que cubre solo 1–2 indicadores, incompleta, o en futuro dentro de la situación ("le dije que cambiaría"). | LIMITED. Excepción: solo si el/los indicador(es) objetivo de la pregunta están íntegramente cubiertos por la Action y R es verificable → se puede asignar mayor **con fundamento documentado** en la rationale (ver §3). | M-G: "le dije que se lo cambiaría" → LIMITED |
| **R3** | **Acción completa y específica → puede alcanzar SUPPORTED.** Action propia, concreta, pasada, que mapea a 3+ indicadores objetivo, en 1 ejemplo con R verificable. | SUPPORTED (elegible; asignación humana final). | M-A / V-A: disculpó + calentó + ofreció pan + preguntó → SUPPORTED |
| **R4** | **Múltiples ejemplos conductuales consistentes → puede alcanzar STRONG.** 2+ ejemplos distintos (no el mismo en otra fecha), cada uno con Action propia mapeable a indicadores, Results verificables. | STRONG (elegible). | M-J / V-J: 2 ejemplos de coordinación/cobertura con resultados → STRONG |

## 3. La excepción de R2 — "fundamento documentado"

La acción parcial **no** escala automáticamente. Solo escala si **todas** las condiciones se cumplen y
se documentan en la rationale:

1. La pregunta evalúa indicadores explícitos (columna indicatorId del banco A-06.5).
2. La Action propia cubre **íntegramente** el/los indicador(es) objetivo de esa pregunta (no los del póster general).
3. El Result es verificable (observable por el entrevistador, o corroborable por referencia/documento con consentimiento).
4. La rationale **nombra** los indicadores cubiertos y por qué los no cubiertos no aplican a la pregunta.
5. El caso queda **marcado para calibración** (PASO 10) — la excepción se revisa en la siguiente sesión de calibración.

Sin los 5 puntos → se mantiene LIMITED.

## 4. Casos frontera formalizados

| Caso | ¿Es Action propia? | Regla | Resultado |
|---|---|---|---|
| "El chef reorganizó la cocina y seguimos sus instrucciones" | NO (acción ajena) | R1 | INSUFFICIENT |
| "Reorganizamos todos el almacén" (sin precisar su parte) | INDETERMINADA | R1 hasta extraer con PROBE-UNI-001/PROBE-COL-001-D; si no emerge → INSUFFICIENT | INSUFFICIENT |
| "Le dije que se lo cambiaría" (promesa dentro de la situación) | PARCIAL (intención manifestada, no completada) | R2 | LIMITED |
| "Le dije que se lo cambiaría y se lo cambié" (completada) | SÍ (1 fragmento) | R2/R3 según indicadores cubiertos + R | LIMITED o SUPPORTED |
| "Me disculpé, calenté la sopa, ofrecí pan, pregunté si estaba bien" | SÍ (3+ indicadores + R) | R3 | SUPPORTED |
| "Aprendí a manejar quejas" (reflexión — respuesta a PROBE-UNI-004) | NO (no es conducta pasada) | R1 + condición CU-3/4 (`03-probe-refinement.md`) | No cambia el nivel; se registra "reflexión — no evidencia" |
| "Aumenté las ventas 30%" sin describir cómo | NO (resultado externo) | R1 + regla EXTERNAL_RESULT → PENDING_REVIEW | PENDING_REVIEW |
| "Hice una fila express, aparté devoluciones, avise tiempos; vendimos un poco menos pero nadie se fue" | SÍ (3 indicadores + R modesto) | R3 | SUPPORTED (CAL-22 — el resultado modesto no castiga) |

## 5. Lo que estas reglas NO son

- **No son puntos ni pesos**: no se asignan valores numéricos a fragmentos de Action ni se suman.
- **No son automáticas**: la IA no las aplica como motor de decisión; el humano las usa como criterio.
- **No son preguntas nuevas**: operan sobre la evidencia ya elicita con los probes aprobados.
- **No convierten la entrevista en scoring**: fijan fronteras cualitativas observables para **reducir la
  variabilidad entre entrevistadores** — el objetivo de A-06.7.
