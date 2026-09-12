# A-06.5 — 22 · Riesgos (PASO 27)

## 1. Clasificación

| # | Riesgo | Severidad | Detalle | Mitigación |
|---|---|---|---|---|
| R1 | Pregunta sugerente | HIGH | La pregunta sugiere la respuesta deseable (leading) | Redacción neutral; auditoría de sesgo (INTERVIEW-G6) |
| R2 | Pregunta hipotética | MEDIUM | La pregunta pide intención, no pasado (HYPOTHETICAL → LIMITED) | Validación BDI (INTERVIEW-G4); redacción "cuéntame de una vez" |
| R3 | Respuesta memorizada | MEDIUM | El candidato responde con texto genérico ensayado (faking) | Probes de profundización; verificación cruzada con referencia |
| R4 | Sesgo entrevistador | HIGH | Halo, similaridad, confirmación, drift | Guía estructurada + rúbrica + entrenamiento + calibración (INTERVIEW-G9) |
| R5 | Probe improvisado | HIGH | El entrevistador improvisa probes fuera del banco | Banco de probes aprobado; prohibición de improvisación; auditoría |
| R6 | IA como autoridad | HIGH | El humano acepta ciegamente sugerencia IA | `rationale` textual humano; IA no asigna nivel; advertencia visible |
| R7 | Inconsistencia | MEDIUM | Dos entrevistadores asignan niveles distintos | Rúbrica por indicador; calibración; doble codificación piloto |
| R8 | Sobre-recolección | MEDIUM | Recoger más datos de los necesarios (proporcionalidad) | 6 preguntas de proporcionalidad; minimización |
| R9 | Preguntas discriminatorias | CRITICAL | Preguntas que elicitan atributos protegidos | Matriz `11-bias-review.md`; NO_PUBLICABLE; revisión legal (INTERVIEW-G7) |

## 2. Severidad agregada

- **CRITICAL**: 1 (R9)
- **HIGH**: 4 (R1, R4, R5, R6)
- **MEDIUM**: 4 (R2, R3, R7, R8)

## 3. Riesgo crítico (R9)

El riesgo CRITICAL es **preguntas discriminatorias**. Sin matriz de no discriminación + revisión legal, la entrevista puede violar LFT Art 3 + LFPEPD + LFPDPPP. Mitigación: INTERVIEW-G6 (bias review) + INTERVIEW-G7 (legal review) + LEGAL-G5 (no discriminación de A-06.4).

## 4. Mitigación general

La mitigación es **estructural** (gobernanza + proceso):
- Guía aprobada + probes aprobados + rúbrica (no improvisación).
- Auditoría de sesgo por pregunta.
- Revisión humana obligatoria (append-only).
- Entrenamiento + calibración de entrevistadores.
- Revisión legal profesional.
- Pilotaje (INTERVIEW-G9).

## 5. Conexión con gates

Los riesgos se mitigan pasando INTERVIEW-G1..G10 + LEGAL-G1..G10 (A-06.4).
