# EVALUHR — A-06.8 — 04 · Revisión Jurídica de Probes (PASO 4)

> **Revisión de los 26 probes diseñados** (25 evaluados en piloto A-06.6 + PROBE-COL-001-D
> formalizado en A-06.7). Criterios: ¿induce? ¿presiona? ¿solicita información innecesaria?
> ¿abre la puerta a información sensible? ¿puede usarse discriminatoriamente?
> Estados: PUBLICABLE / CONDICIONAL / LEGAL_REVIEW / NO_PUBLICABLE.

## 1. Regla de decisión

Un probe es CONDICIONAL cuando es lícito pero su uso puede generar riesgo jurídico sin una
condición documentada (condición de uso, stop rule, tono entrenado). Un probe es LEGAL_REVIEW
cuando la duda requiere dictamen; NO_PUBLICABLE si elicitía atributos protegidos o información
irrelevante personal.

## 2. Probes universales (PROBE-UNI-001..008)

| Probe | Texto | Comp. | Induce | Presiona | Info innecesaria | Puerta sensible | Uso discriminatorio | legalStatus |
|---|---|---|---|---|---|---|---|---|
| PROBE-UNI-001 | "¿Qué hiciste tú específicamente?" | A | No | No | No | No | No | **PUBLICABLE** |
| PROBE-UNI-002 | "¿Cuál fue tu decisión?" | A | No | No | No | No | No | **PUBLICABLE** |
| PROBE-UNI-003 | "¿Qué ocurrió después?" | R | No | No | No | No | No | **PUBLICABLE** |
| PROBE-UNI-004 | "¿Qué aprendiste?" | Cierre | No | No | Posible (reflexión personal) | **Posible si se usa como apertura** (elicita valoración personal, no conducta) | No | **CONDICIONAL** — uso exclusivo como cierre (CU-1..CU-6 de A-06.7); la respuesta nunca es evidencia; máx 1 uso; prohibido como apertura |
| PROBE-UNI-005 | "¿Puedes darme un ejemplo específico de una vez que...?" | S | No | No | No | No | No | **PUBLICABLE** — es la redirección canónica de hipotéticos (H-2) |
| PROBE-UNI-006 | "¿Cuándo fue eso? ¿En qué puesto?" | S | No | No | No | Nota: la fecha puede situar eventos vitales; **no indagar fechas allende lo estrictamente necesario** | No | **PUBLICABLE** — con nota de uso: acotar S/T, no explorar periodos personales |
| PROBE-UNI-007 | "¿Cuál era tu objetivo en esa situación?" | T | No | No | No | No | No | **PUBLICABLE** |
| PROBE-UNI-008 | "¿Cómo terminó la situación?" | R | No | No | No | No | No | **PUBLICABLE** |

## 3. Probes por competencia (SVC / COL / ORG / TRV)

| Probe | Texto (resumen) | Comp. | Riesgos evaluados | legalStatus |
|---|---|---|---|---|
| PROBE-SVC-001-A | "¿Cómo supiste qué necesitaba el cliente?" | A | Ninguno | **PUBLICABLE** |
| PROBE-SVC-001-B | "¿Qué le dijiste exactamente?" | A | Ninguno | **PUBLICABLE** |
| PROBE-SVC-001-C | "¿Cómo reaccionó el cliente?" | R | Ninguno | **PUBLICABLE** |
| PROBE-SVC-001-D | "¿Hiciste algo después para asegurar que quedara satisfecho?" | A | Ninguno | **PUBLICABLE** |
| PROBE-SVC-002-A | "¿Cómo supiste qué era lo justo?" (equidad en reclamo) | A | Ninguno | **PUBLICABLE** |
| PROBE-SVC-002-B | Variante de confirmación de compromiso | A | Ninguno | **PUBLICABLE** |
| PROBE-SVC-002-C | Variante de Result del reclamo | R | Ninguno | **PUBLICABLE** |
| PROBE-SVC-002-D | "¿Qué ofreciste exactamente?" | A | Ninguno | **PUBLICABLE** |
| PROBE-COL-001-A | "¿Qué hiciste tú para coordinar con tu compañero?" | A | Ninguno | **PUBLICABLE** |
| PROBE-COL-001-B | "¿Cómo le pediste ayuda?" | A | Ninguno | **PUBLICABLE** |
| PROBE-COL-001-C | "¿Reconociste la contribución del otro? ¿Cómo?" | A | Ninguno | **PUBLICABLE** |
| PROBE-COL-001-D | "¿Qué hiciste tú, más allá de lo que hizo tu supervisor u otro vendedor?" | A | **Presión (potencial)**: confronta la narrativa colectiva y puede percibirse cuestionante; en piloto no se usó (nació de H-5) y no fue validado | **CONDICIONAL** — obligatorio: tono no confrontativo entrenado, máx 1 uso, stop rule (sin Action propia → INSUFFICIENT y detenerse), re-piloto en piloto de campo (15) |
| PROBE-ORG-001-A | "¿Cómo decidiste qué hacer primero?" | A | Ninguno | **PUBLICABLE** |
| PROBE-ORG-001-B | "¿Tuviste que ajustar tu plan? ¿Cómo?" | A | Ninguno | **PUBLICABLE** |
| PROBE-ORG-001-C | "¿Cómo llevaste el seguimiento?" | A | Ninguno | **PUBLICABLE** |
| PROBE-TRV-002-A | "¿Qué cambió exactamente?" | A | Ninguno | **PUBLICABLE** — pero en preguntas TRV-002 el **protocolo de revelación involuntaria (05) queda activo por diseño** |
| PROBE-TRV-002-B | "¿Cómo ajustaste tu rutina?" | A | Ninguno | **PUBLICABLE** — ídem nota protocolo 05 |
| PROBE-TRV-002-C | "¿Mantuviste la efectividad?" | R | Ninguno | **PUBLICABLE** — ídem nota protocolo 05 |

## 4. Prohibiciones verificadas (todas las familias)

| Prohibición (A-06.5) | Verificación A-06.8 |
|---|---|
| Leading ("¿no crees que deberías haber...?") | Ningún probe del banco es leading |
| Juicio ("¿por qué hiciste algo tan arriesgado?") | Ningún probe juzga |
| Sugerencia de respuesta ("¿le pediste disculpas?") | Ningún probe implanta respuesta |
| Presión ("¿seguro que no puedes dar un ejemplo mejor?") | Ningún probe coacciona; stop rules definidas por pregunta (plan de probes A-06.7); único riesgo potencial identificado = tono de PROBE-COL-001-D (condicionado) |
| Información personal irrelevante ("¿tu familia apoyó...?") | Ningún probe la solicita; PROBE-UNI-004 solo abre puerta si se usa mal (condicionado) |
| Atributo protegido ("¿tus compañeros de tu edad...?") | Ningún probe elicitía atributos protegidos |

## 5. Reglas operativas confirmadas

1. Solo probes del banco aprobado; **NO improvisación** (A-06.7 plan de probes).
2. Máx 3 probes por pregunta; uno a la vez; neutral; no coaccionar (INSUFFICIENT si no emerge).
3. Si el candidato revela información sensible a raíz de un probe: **aplicar protocolo 05 y NO
   indagar**; el probe no se convierte en vía de exploración de lo sensible.
4. La IA puede sugerir probes ya aprobados; nunca improvisar ni decidir (07).
5. Estados de probes conservados: DRAFT/PILOTO — **NO PRODUCTIVO**; ningún probe pasa a ACTIVE.

## 6. Resumen

| Estado | Cantidad | IDs |
|---|---|---|
| PUBLICABLE | 24 | UNI-001,002,003,005,006,007,008 · SVC-001 A-D · SVC-002 A-D · COL-001 A,B,C · ORG-001 A-C · TRV-002 A-C |
| CONDICIONAL | 2 | PROBE-UNI-004 (uso restringido a cierre) · PROBE-COL-001-D (no pilotado + tono) |
| LEGAL_REVIEW | 0 | — |
| NO_PUBLICABLE | 0 | — |
