# EVALUHR — A-06.7 — 02 · Refinamiento de las Preguntas REVISE (PASO 2)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Objeto: las 2 preguntas con decisión **REVISE** del piloto A-06.6.
> Regla: **NO convertirlas en ACTIVE.** El texto de ninguna pregunta se modifica (conserva legalStatus).

## 1. Regla (PASO 2)

Para cada pregunta REVISE determinar exactamente: problema, causa, impacto, modificación propuesta,
necesidad de nuevo probe, riesgo legal, riesgo metodológico. Las otras 8 preguntas (KEEP_FOR_REVIEW)
se listan en §4 sin cambios de diseño.

---

## 2. Q-VEN-COL-001 — "Describe una vez que colaboraste con otro vendedor para atender a un cliente. ¿Qué hiciste?"

| Dimensión | Análisis |
|---|---|
| **Problema** | En el caso V-D, la respuesta atribuyó la Action al supervisor ("el supervisor hizo X, nosotros seguimos") y los probes existentes (PROBE-COL-001-A/B/C) **no extrajeron la Action propia del candidato** con claridad suficiente; el caso quedó INSUFFICIENT solo tras agotar probes, y el entrevistador simulado quedó sin herramienta explícita para el contraste "acción del equipo vs acción del candidato". |
| **Causa** | La pregunta invoca colaboración ("colaboraste con otro vendedor"), lo que naturalmente induce narrativas en plural ("hicimos", "el equipo"). Los probes A/B/C preguntan por coordinación/ayuda/reconocimiento pero **ninguno fuerza el contraste explícito** entre lo que hizo el otro y lo que hizo el candidato. Riesgo asociado documentado en el piloto: error de atribución (el entrevistador podría acreditar al candidato la Action ajena). |
| **Impacto** | (a) Riesgo de INSUFFICIENT sistemático en respuestas de colaboración real (falso negativo); (b) riesgo inverso de atribución indebida si el entrevistador no distingue (falso positivo); (c) mayor variabilidad entre entrevistadores — el patrón D no se diferenció con un solo probe. |
| **Modificación propuesta** | **NO cambiar el texto de la pregunta** (v1.0 se conserva; trazabilidad y legalStatus intactos). La corrección es a nivel de plan de probes: incorporar **PROBE-COL-001-D** como probe secundario **obligatorio** cuando la respuesta use "nosotros/el equipo/el supervisor": *"¿Qué hiciste tú, más allá de lo que hizo tu supervisor u otro vendedor?"* (texto DRAFT, propuesto en A-06.6 H-5, formalizado aquí). |
| **Necesidad de nuevo probe** | **SÍ — PROBE-COL-001-D** (DRAFT). Condición de uso: solo tras la primera narrativa colectiva; máx 1 uso por pregunta; detenerse si tras el probe no hay conducta propia (→ INSUFFICIENT documentado, no insistir). Ver `03-probe-refinement.md` §3. |
| **Riesgo legal** | **NINGUNO NUEVO.** El texto no cambia (PUBLICABLE se conserva). El probe propuesto fue verificado contra A-06.4: neutral, sin atributos protegidos, sin sugerencia de respuesta → PUBLICABLE (DRAFT, pendiente revisión legal formal en INTERVIEW-G7). |
| **Riesgo metodológico** | **BAJO-MEDIO.** El contraste puede percibirse confrontativo si se aplica con tono inadecuado → mitigación: redacción neutral + entrenamiento (PASO 11) + stop rule. El probe es DRAFT hasta pilotaje de campo (G9). |
| **Decisión post-refinamiento (PASO 21)** | **REVISE (se mantiene).** El cambio propuesto NO está validado por piloto; requiere pilotaje del nuevo probe antes de reevaluar. Nunca ACTIVE. |

## 3. Q-VEN-TRV-002 — "Describe una vez en que tuviste que adaptarte a un cambio en tu entorno de trabajo. ¿Qué hiciste?"

| Dimensión | Análisis |
|---|---|
| **Problema** | En el caso V-H, la respuesta incluyó una **revelación involuntaria de atributo protegido (religión)**. El manejo fue correcto en el piloto (no registrar atributo, no usar, no profundizar; registrar solo la conducta), pero **dependió del criterio del evaluador simulado** — no existía material de entrenamiento ni regla operativa dentro del flujo de entrevista. |
| **Causa** | La pregunta es legítima y neutral (cambio de entorno de trabajo), pero cualquier pregunta BDI abierta puede elicitar revelaciones involuntarias (M-H: embarazo; V-H: religión). El diseño A-06.4 §5 define el manejo, pero **no estaba operativizado como módulo de entrenamiento para entrevistadores**. |
| **Impacto** | Si un entrevistador sin entrenamiento registra o usa el atributo: evidencia INVALID + riesgo LFPDPPP (datos sensibles) + riesgo LFT Art 3 (discriminación). Variabilidad entre entrevistadores en un punto sensible. |
| **Modificación propuesta** | **NO cambiar el texto de la pregunta** (v1.0 se conserva). Añadir: (a) **módulo de entrenamiento obligatorio** sobre revelación involuntaria (PASO 11, `10-training.md` M1/M3; `11-bias-training.md`); (b) regla operativa en la guía de entrevista: *al detectar revelación involuntaria → no registrar el atributo, no hacer preguntas de seguimiento sobre él, retomar la conducta observable y continuar; marcar el fragmento INVALID*; (c) checkpoint de calibración con los casos M-H/V-H (PASO 10, `calibration-cases.csv`). |
| **Necesidad de nuevo probe** | **NO.** Ninguno. El manejo es de procedimiento y entrenamiento, no de elicitation. |
| **Riesgo legal** | **MANEJADO CON CONDICIÓN.** La pregunta es PUBLICABLE (se conserva). La condición: el entrevistador no conduce entrevistas productivas sin el entrenamiento de revelación involuntaria. A-06.7 NO aprueba INTERVIEW-G7. |
| **Riesgo metodológico** | **BAJO.** La regla "registrar conducta, no atributo" está alineada con la rúbrica por indicador (la conducta se evalúa por indicadores; el atributo es irrelevante para el nivel). |
| **Decisión post-refinamiento (PASO 21)** | **REVISE (se mantiene).** El material de entrenamiento queda diseñado (modelo conceptual), pero no impartido ni evaluado; condición pendiente hasta implementación de capacitación real + gates legal/field. Nunca ACTIVE. |

## 4. Las 8 preguntas KEEP_FOR_REVIEW (sin cambios de diseño)

| questionId | Clasificación A-06.6 | Cambio propuesto en A-06.7 |
|---|---|---|
| Q-MES-SVC-001 | STRONG | Ninguno en texto/probes. Mejora preventiva: anclar ejemplos de evidencia por indicador (PASO 4). |
| Q-MES-SVC-002 | STRONG | Ninguno en texto. Mejora: **anclas por indicador IND-SVC-002-A/C** derivadas de la divergencia M-G (resuelve H-7) + calibración obligatoria. |
| Q-MES-COL-001 | STRONG | Ninguno. Uso de PROBE-COL-001-D también disponible aquí (misma condición de uso que Q-VEN-COL-001) por simetría de competencia. |
| Q-MES-ORG-001 | STRONG | Ninguno. |
| Q-MES-TRV-002 | STRONG | Ninguno. El entrenamiento de revelación involuntaria aplica igual que Q-VEN-TRV-002 (caso M-H). |
| Q-VEN-SVC-001 | STRONG | Ninguno. |
| Q-VEN-SVC-002 | STRONG | Ninguno. |
| Q-VEN-ORG-001 | STRONG | Ninguno. |

## 5. Reglas de refinamiento aplicadas

1. **El texto de las 10 preguntas NO se modifica** → legalStatus PUBLICABLE preservado en todas (PASO 14).
2. Los cambios se realizan **a nivel probe, condición de uso, entrenamiento y rúbrica** — no a nivel pregunta.
3. **Ninguna conversión a ACTIVE.** Las 2 REVISE permanecen REVISE hasta: pilotaje del cambio (probe nuevo /
   entrenamiento impartido) + gates legal (G7) + pilotaje de campo (G9) + aprobación humana.
4. Todo cambio queda registrado con versión en `question-refinement.csv` (PASO 19): v1.0 estable;
   probe-set v1.1-DRAFT para las 2 REVISE.
5. La rúbrica v2 (por indicador) aplica a las 10 preguntas por igual — es el mecanismo principal de reducción
   de variabilidad entre entrevistadores (objetivo de A-06.7), sin convertir la entrevista en scoring numérico.
