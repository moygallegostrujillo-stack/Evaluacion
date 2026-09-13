# A-06.3 — 20 · Activation Gates (PASO 29)

## 1. Sistema de gates INT-G1..G10

Para que la metodología de entrevista estructurada se active en V1 productivo, debe pasar 10 gates. Modelo inspirado en A-04.2/A-05.2/A-06.1.

Estados: **NO EVALUADO → APROBADO → FALLADO (NO IMPLEMENTAR)**. Un gate FALLADO → la entrevista no se activa en V1.

---

## INT-G1 — Constructo

| Aspecto | Valor |
|---|---|
| Criterio | El constructo "competencia evaluada por entrevista" está definido (A-06.1 + A-06.2) |
| Estado | ✔ APROBADO — competencia = conducta observable; entrevista = evidencia contextual |
| Evidencia | A-06.1 `competency-definition.md`; A-06.2 `02-definition.md` |

## INT-G2 — Competency linkage

| Aspecto | Valor |
|---|---|
| Criterio | Las preguntas se vinculan a competencias aprobadas (JobCompetency ACTIVE) |
| Estado | ⚠ CONDICIONAL — estructura definida (A-06.2); requiere competencias APPROVED en producción |
| Acción | Aprobar competencias piloto (e.g. COMP-SVC-001 para MESERO) antes de activar entrevistas |

## INT-G3 — Question design

| Aspecto | Valor |
|---|---|
| Criterio | Preguntas BDI diseñadas, validadas (CI-VAL-1..8), aprobadas |
| Estado | ⚠ CONDICIONAL — estructura definida (`05-question-design.md`); ejemplos marcados NO PRODUCTIVO |
| Acción | Redactar y aprobar preguntas piloto por competencia-puesto |

## INT-G4 — Probe design

| Aspecto | Valor |
|---|---|
| Criterio | Probes diseñados, validados, aprobados |
| Estado | ⚠ CONDICIONAL — biblioteca conceptual definida (`06-probes.md`); ejemplos NO PRODUCTIVO |
| Acción | Redactar y aprobar probes piloto |

## INT-G5 — Rubric

| Aspecto | Valor |
|---|---|
| Criterio | Rúbrica cualitativa (NO_EVIDENCE..STRONG) diseñada y aprobada por competencia-puesto |
| Estado | ⚠ CONDICIONAL — estructura definida (`11-rubric.md`); ejemplo NO PRODUCTIVO |
| Acción | Redactar y aprobar rúbricas piloto por competencia-puesto |

## INT-G6 — Bias review

| Aspecto | Valor |
|---|---|
| Criterio | Auditoría de sesgo + discriminación completada; preguntas discriminatorias prohibidas |
| Estado | ✔ APROBADO — análisis en `13-bias.md` + `15-privacy.md`; CI-VAL-6 de A-06.2 |
| Acción | Aplicar a cada pregunta piloto antes de APPROVED |

## INT-G7 — Legal review

| Aspecto | Valor |
|---|---|
| Criterio | Revisión legal de guías, preguntas, probes, rúbricas (LFPDPPP, LFT Art. 3, NOM-035, CONAPRED) |
| Estado | ✗ NO EVALUADO — **REQUIERE REVISIÓN LEGAL** profesional |
| Acción | Asesoría legal sobre: preguntas permitidas/prohibidas, consentimiento, retención, Art. 37 Bis, no discriminación |
| Crítico | Sin este gate, la entrevista NO se activa en V1 |

## INT-G8 — Governance

| Aspecto | Valor |
|---|---|
| Criterio | Ciclo DRAFT→ACTIVE + trazabilidad + revisión humana documentada + append-only |
| Estado | ✔ APROBADO — definido en `16-human-review.md` + `18-versioning.md` |
| Invariantes | Una ACTIVE por entidad; RETIRED terminal; IA nunca APPROVED; audit trail inmutable |

## INT-G9 — Pilot

| Aspecto | Valor |
|---|---|
| Criterio | Pilotaje del modelo en un puesto piloto (e.g. MESERO) con 2+ evaluadores, 10+ entrevistas, medición de consistencia inter-entrevistador |
| Estado | ✗ NO EVALUADO — requiere implementación previa |
| Acción | Seleccionar 1 puesto piloto; entrenar 2+ evaluadores; conducir 10+ entrevistas; medir consistencia; refinar |

## INT-G10 — Validation

| Aspecto | Valor |
|---|---|
| Criterio | Validación predictiva (correlación CompetencyResult con desempeño posterior) en muestra MX |
| Estado | ✗ NO EVALUADO — requiere pilotaje + seguimiento (6–12 meses) |
| Acción | Tras pilotaje, seguir candidatos contratados 6+ meses; correlacionar niveles con desempeño; ajustar modelo |

---

## 2. Estado actual (resumen)

| Gate | Estado | Bloquea V1 si FALLA |
|---|---|---|
| INT-G1 Constructo | ✔ APROBADO | NO |
| INT-G2 Competency linkage | ⚠ CONDICIONAL | SÍ (requiere competencias APPROVED) |
| INT-G3 Question design | ⚠ CONDICIONAL | SÍ (requiere preguntas aprobadas) |
| INT-G4 Probe design | ⚠ CONDICIONAL | SÍ (requiere probes aprobados) |
| INT-G5 Rubric | ⚠ CONDICIONAL | SÍ (requiere rúbricas aprobadas) |
| INT-G6 Bias review | ✔ APROBADO (análisis) | NO (análisis completo; aplicar por pregunta) |
| INT-G7 Legal review | ✗ NO EVALUADO | **SÍ — CRÍTICO** |
| INT-G8 Governance | ✔ APROBADO | NO |
| INT-G9 Pilot | ✗ NO EVALUADO | SÍ |
| INT-G10 Validation | ✗ NO EVALUADO | NO (post-V1; diferible) |

## 3. Camino a activación V1

Para activar entrevistas estructuradas en V1 productivo:
1. **INT-G2**: aprobar competencias piloto (e.g. COMP-SVC-001 para MESERO).
2. **INT-G3/G4/G5**: redactar y aprobar preguntas, probes, rúbricas piloto.
3. **INT-G7**: revisión legal profesional de la guía completa.
4. **INT-G9**: pilotaje con 2+ evaluadores, 10+ entrevistas, consistencia.
5. **INT-G10** (diferible): validación predictiva post-contratación (6+ meses).

Tiempo estimado a V1 mínimo viable: 2–3 meses (G2+G3+G4+G5+G7+G9). G10 es post-V1.

## 4. Decisión

La metodología de entrevista estructurada **NO se activa en V1 ship-block** hasta que G2+G3+G4+G5+G7+G9 se completen. A-06.3 es diseño + auditoría; la implementación requiere una fase A-06.x separada.
