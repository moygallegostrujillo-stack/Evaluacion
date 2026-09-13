# EVALUHR — A-06.10 — 14 · Decisiones por Probe (PASO 21)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Cada probe termina como **KEEP / REVISE / REJECT**. Ningún probe pasa a ACTIVE. Banco de 26 probes
> (A-06.8 §04): 24 PUBLICABLE + 2 CONDICIONAL. Cobertura de uso: 26/26.

## 1. Resumen de decisiones

| Decisión | Cantidad | IDs |
|---|---|---|
| **KEEP** | 25 | UNI-001,002,003,004*,005,006,007,008 · SVC-001-A..D · SVC-002-A..D · COL-001-A,B,C · ORG-001-A..C · TRV-002-A..C |
| **REVISE** | 1 | PROBE-COL-001-D |
| **REJECT** | 0 | — |
| **ACTIVE** | 0 | — (prohibición estructural) |

*UNI-004 KEEP **solo con** sus condiciones CU-1..CU-6 (uso exclusivo en cierre; la respuesta nunca
es evidencia; máx 1 uso por sesión; prohibido como apertura).

## 2. Probes universales

| Probe | Usos | Comportamiento observado | Decisión |
|---|---|---|---|
| PROBE-UNI-001 "¿Qué hiciste tú específicamente?" | 35 | El más útil para separar Action propia vs colectiva (clave en patrones D) | KEEP |
| PROBE-UNI-002 "¿Cuál fue tu decisión?" | 9 | Eficaz en ORG (criterio de priorización) | KEEP |
| PROBE-UNI-003 "¿Qué ocurrió después?" | 16 | Completa Result sin inducir | KEEP |
| PROBE-UNI-004 "¿Qué aprendiste?" (cierre) | 12 | Usado solo en cierre 12/12 sesiones; respuesta jamás usada como evidencia; 0 usos como apertura; sin incidente | KEEP (condiciones CU-1..CU-6 intactas) |
| PROBE-UNI-005 "¿Puedes darme un ejemplo específico…?" | 9 | Redirección canónica de hipotéticos: 9/9 instancias HYPOTHETICAL; en 8/9 produjo relato redirigido (LIMITED) y en 1/9 el participante permaneció hipotético (→ LIMITED por H-2, DIS-06) | KEEP |
| PROBE-UNI-006 "¿Cuándo fue eso? ¿En qué puesto?" | 2 | Usado 2×, acotado a S/T; sin exploración de periodos personales | KEEP (nota de uso mantenida) |
| PROBE-UNI-007 "¿Cuál era tu objetivo?" | 4 | Completa T en SVC | KEEP |
| PROBE-UNI-008 "¿Cómo terminó la situación?" | 11 | Cierra R sin inducir | KEEP |

## 3. Probes por competencia

| Probe | Usos | Comportamiento observado | Decisión |
|---|---|---|---|
| PROBE-SVC-001-A/B/C/D | 6/4/5/3 | Extraen cómo supo / qué dijo / reacción / seguimiento; sin inducción | KEEP ×4 |
| PROBE-SVC-002-A/B/C/D | 6/4/5/4 | La A ("¿cómo supiste qué era lo justo?") fue clave para evidencia de equidad | KEEP ×4 |
| PROBE-COL-001-A/B/C | 6/4/3 | Suficientes cuando la narrativa es individual | KEEP ×3 |
| **PROBE-COL-001-D** | **3** | **Re-piloto exigido por A-06.7 — resultados**: S-PIL-07 éxito (emergió Action propia parcial → LIMITED); S-PIL-06 y S-PIL-09 stop rule correcta (sin Action propia verificable → INSUFFICIENT, DIS-04). **Pero** en S-PIL-06 la lectura del probe se percibió con tono cuestionante (INC-PIL-007) aun con entrenamiento de tono | **REVISE** — refinar introducción no confrontativa (v1.1 propuesta); mantener condiciones: máx 1 uso, stop rule, tono entrenado; re-verificación en siguiente ciclo |
| PROBE-ORG-001-A/B/C | 6/4/3 | Priorización / ajuste de plan / seguimiento; sin problemas | KEEP ×3 |
| PROBE-TRV-002-A/B/C | 6/5/4 | Operaron correctamente con protocolo 05 en vigilancia; ninguna de las tres abrió la puerta a lo sensible | KEEP ×3 (con protocolo 05 obligatorio en TRV-002) |

## 4. Por qué REJECT = 0

Ningún probe resultó inoperable, inducidor o ilegal: el único problema (tono de COL-001-D) es
corregible por redacción de introducción y ya está contenido por stop rule. Rechazar el probe
eliminaría la única herramienta contra la atribución indebida de logros colectivos (H-5) — el
problema que lo originó persistiría sin herramienta.

## 5. Estado de las condiciones (intacto)

| Condición pre-piloto | Verificación |
|---|---|
| UNI-004 solo cierre / nunca evidencia / máx 1 | 12/12 sesiones conforme |
| COL-001-D máx 1 uso por instancia | 3 instancias, 1 uso cada una |
| COL-001-D stop rule | Activada correctamente en 2/3 usos |
| Máx 3 probes por instancia | 60/60 instancias conforme (promedio 2.98) |
| No improvisación | 0 probes fuera del banco |
| TRV-002 con protocolo 05 activo | 2 activaciones, contención íntegra |
