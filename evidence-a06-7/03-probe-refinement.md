# EVALUHR — A-06.7 — 03 · Refinamiento de Probes (PASO 3 + PASO 13)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Objeto: el 1 probe LIMITED (PROBE-UNI-004), el probe propuesto
> PROBE-COL-001-D, y el plan de probes por pregunta (probe principal / secundario / condición de uso /
> cuándo detenerse). Regla: **NO improvisación de probes.**

## 1. Regla (PASO 3)

Para PROBE-UNI-004 determinar: por qué obtuvo LIMITED, qué riesgo introduce, si debe revisarse,
retirarse o sustituirse. Decisión: **KEEP / REVISE / REJECT**.

## 2. Auditoría de PROBE-UNI-004 — "¿Qué aprendiste?"

| Dimensión | Análisis |
|---|---|
| **Por qué obtuvo LIMITED (A-06.6)** | El probe elicita **reflexión** ("aprendí a…"), no **conducta pasada observable**. La reflexión no mapea a indicadores conductuales y **no eleva el nivel de evidencia** (no convierte LIMITED en SUPPORTED ni INSUFFICIENT en LIMITED). |
| **Qué riesgo introduce** | (a) **Contaminación del registro**: el entrevistador podría tratar "aprendizajes" como evidencia de competencia; (b) **sustitución de probes de Action**: usar UNI-004 en lugar de UNI-001 ("¿Qué hiciste tú?") deja el STAR incompleto; (c) **boilerplate socialmente deseable**: respuestas ensayadas tipo "aprendí a ser más paciente" que suenan bien y no significan nada; (d) variabilidad: unos entrevistadores lo usan, otros no → inconsistencia. |
| **¿Debe revisarse, retirarse o sustituirse?** | **Ni retirarse ni sustituirse**: el probe es neutral, no sugestivo, no induce, no elicitó información irrelevante ni atributos protegidos (verificado en A-06.6 §2), y tiene utilidad legítima de cierre (rapport + señales de autocrítica). Tampoco requiere reescritura: el problema no es el texto sino el **uso** que se le da. |
| **Decisión** | **KEEP — con condición de uso formalizada** (ver §2.1). No REVISE (no cambia el texto), no REJECT (no produce daño, produce material no-evidencia solo si se usa mal). Status: DRAFT / PILOTO + NO PRODUCTIVO. |

### 2.1 Condición de uso formalizada (v1.1-DRAFT del probe)

| Regla | Contenido |
|---|---|
| CU-1 | Uso **exclusivo como probe de cierre**, después de que S/T/A/R estén ya documentados con probes de conducta. |
| CU-2 | **Nunca como probe principal** ni como sustituto de PROBE-UNI-001/002 (Action) ni de PROBE-UNI-003/008 (Result). |
| CU-3 | La respuesta a UNI-004 **NUNCA es evidencia**: no mapea a indicadores, no cuenta para el conteo de indicadores→nivel, no aparece en la rúbrica. Se registra como "reflexión — no evidencia". |
| CU-4 | La respuesta a UNI-004 **no puede** usarse para alcanzar SUPPORTED o STRONG, ni para justificar rationale de nivel. |
| CU-5 | Máx 1 uso por pregunta; opcional (no obligatorio) — se aplica igual entre candidatos que reciban cierre. |
| CU-6 | Si el entrevistador nota que la única respuesta útil de la entrevista fue la reflexión (no hubo conducta), el nivel permanece INSUFFICIENT/LIMITED — la reflexión no lo cambia (refuerzo de la regla original de A-06.6). |

## 3. Formalización de PROBE-COL-001-D (propuesto en A-06.6 H-5)

| Campo | Contenido |
|---|---|
| probeId | PROBE-COL-001-D |
| text | "¿Qué hiciste tú, más allá de lo que hizo tu supervisor u otro vendedor?" |
| version | v1.0-DRAFT (nuevo; NO productivo) |
| purpose | Diferenciar la **Action propia** del candidato de la Action del equipo/supervisor en narrativas colectivas ("hicimos", "el equipo", "el supervisor"). |
| appliesTo | Q-VEN-COL-001 (obligatorio si narrativa colectiva) y Q-MES-COL-001 (por simetría de competencia, misma condición). |
| condición de uso | Solo cuando la respuesta inicial describe acciones de otros o en plural. Nunca como primer probe si la respuesta ya es de primera persona y específica. |
| stop rule | Máx 1 uso. Si tras el probe no emerge conducta propia → documentar INSUFFICIENT ("sin Action propia identificable") y detenerse. NO insistir, NO reformular con presión. |
| Neutralidad | Verificada contra A-06.4: no sugiere contenido de respuesta, no juzga, no elicitía atributos protegidos. Redacción neutral; el entrenamiento cubre el tono no confrontativo. |
| legalStatus | PUBLICABLE (DRAFT — pendiente revisión legal formal INTERVIEW-G7). |
| Estado de validación | **NO validado en piloto** (nació del piloto como propuesta). Requiere pilotaje de campo antes de cualquier uso productivo. |

## 4. Plan de probes por pregunta (PASO 13) — NO improvisación

Para cada pregunta: probe principal → probe secundario → condición de uso → cuándo detenerse.
Límite global heredado de A-06.5 `10-adaptive-flow.md`: **máx 3 probes por pregunta**; solo probes
del banco aprobado; **prohibido improvisar** preguntas de seguimiento.

| questionId | Probe principal (1º) | Probe secundario (2º) | Condición de uso del secundario | Tercer probe (si falta R) | Cuándo detenerse |
|---|---|---|---|---|---|
| Q-MES-SVC-001 | PROBE-SVC-001-A "¿Cómo supiste qué necesitaba?" | PROBE-SVC-001-B "¿Qué le dijiste exactamente?" | Si la Action falta o es imprecisa | PROBE-UNI-008/003 (Result) | S/T/A/R documentados; o 2 probes sin conducta nueva; o respuesta entry-level sin experiencia (→ NO_EVIDENCE + nota situacional) |
| Q-MES-SVC-002 | PROBE-SVC-002-D "¿Qué ofreciste exactamente?" | PROBE-SVC-002-A "¿Cómo supiste qué era lo justo?" | Si falta IND-SVC-002-C (alternativa/corrección) | PROBE-UNI-008/003 | Ídem + stop si la Action sigue siendo "le dije que haría X" (futuro dentro de pasado → LIMITED, no insistir) |
| Q-MES-COL-001 | PROBE-COL-001-A "¿Qué hiciste tú para coordinar?" | PROBE-COL-001-D (si narrativa colectiva) | "Nosotros/el chef/el equipo" sin Action propia | PROBE-UNI-003 | S/T/A/R propios documentados; o sin Action propia tras UNI-001 + COL-001-D → INSUFFICIENT |
| Q-MES-ORG-001 | PROBE-ORG-001-A "¿Cómo decidiste qué hacer primero?" | PROBE-ORG-001-B "¿Ajustaste tu plan? ¿Cómo?" | Si falta IND-ORG-001-B (planificación/adaptación) | PROBE-UNI-003 | Ídem; si solo hay resultado ("mejoró 30%") → PENDING_REVIEW (resultado ≠ competencia) |
| Q-MES-TRV-002 | PROBE-TRV-002-A "¿Qué cambió exactamente?" | PROBE-TRV-002-B "¿Cómo ajustaste tu rutina?" | Si falta IND-TRV-002-A | PROBE-TRV-002-C "¿Mantuviste la efectividad?" | Ídem + regla de revelación involuntaria activa (no registrar atributo, retomar conducta) |
| Q-VEN-SVC-001 | PROBE-SVC-001-A | PROBE-SVC-001-B | Ídem Q-MES-SVC-001 | PROBE-UNI-008/003 | Ídem |
| Q-VEN-SVC-002 | PROBE-SVC-002-D | PROBE-SVC-002-C "¿Qué hiciste si excedía tu autoridad?" | Si falta IND-SVC-002-D (escalado) | PROBE-UNI-008/003 | Ídem |
| Q-VEN-COL-001 | PROBE-COL-001-A | **PROBE-COL-001-D (nuevo, DRAFT)** | **Obligatorio** si narrativa colectiva/supervisor | PROBE-UNI-003 | Ídem Q-MES-COL-001 |
| Q-VEN-ORG-001 | PROBE-ORG-001-A | PROBE-ORG-001-B | Ídem Q-MES-ORG-001 | PROBE-UNI-003 | Ídem |
| Q-VEN-TRV-002 | PROBE-TRV-002-A | PROBE-TRV-002-B | Ídem Q-MES-TRV-002 | PROBE-TRV-002-C | Ídem + regla de revelación involuntaria |

### 4.1 Probes universales — orden y condiciones

| Probe | Rol | Condición de uso |
|---|---|---|
| PROBE-UNI-001 "¿Qué hiciste tú específicamente?" | Action propia | Primero, siempre que la narrativa sea colectiva o difusa |
| PROBE-UNI-002 "¿Cuál fue tu decisión?" | Action (decisión) | Si la Action existe pero no hay decisión identificable |
| PROBE-UNI-003 "¿Qué ocurrió después?" | Result | Cuando falta R tras Action documentada |
| PROBE-UNI-004 "¿Qué aprendiste?" | **Cierre — NO evidencia** | **Solo al final, opcional, según condición §2.1** |
| PROBE-UNI-005 "¿Puedes darme un ejemplo específico de una vez que…?" | Redirección a pasado | Ante vago/hipotético/opinión; máx 2 redirecciones por pregunta |
| PROBE-UNI-006 "¿Cuándo fue eso? ¿En qué puesto?" | Situation | Cuando falta anclaje temporal/rol |
| PROBE-UNI-007 "¿Cuál era tu objetivo?" | Task | Cuando falta T |
| PROBE-UNI-008 "¿Cómo terminó la situación?" | Result | Alternativa neutral a UNI-003 |

## 5. Reglas de control (reafirmadas)

1. **NO improvisación**: solo probes del banco; cualquier probe nuevo = propuesta DRAFT → revisión → pilotaje (nunca en vivo).
2. **Probes prohibidos** (A-06.6 §6, verificados ausentes): sugerentes ("¿No crees que…?"), de presión ("¿Seguro que no tienes un ejemplo mejor?"), sobre situaciones familiares, sobre atributos protegidos.
3. **Igual uso entre candidatos**: mismas condiciones de uso para todos; las desviaciones se documentan en InterviewReview.
4. Máx **3 probes por pregunta**; máx **2 redirecciones** PROBE-UNI-005.
5. El entrevistador **documenta** los probes usados (trazabilidad pregunta→probe→respuesta).
