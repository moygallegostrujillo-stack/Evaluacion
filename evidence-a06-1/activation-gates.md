# A-06.1 — Activation Gates (PASO 18)

## 1. Sistema de gates

Para que el modelo de competencias (entrevista estructurada) se active en V1 productivo, debe pasar los 10 gates COMP-G1..G10. Modelo inspirado en A-04.2 (Integrity GATE-1..10) y A-05.2 (Personality PERSONALITY-G1..G10).

Estados de gate: **NO EVALUADO → APROBADO → FALLADO (NO IMPLEMENTAR)**. Un gate FALLADO → el modelo no se activa en V1.

---

## COMP-G1 — Constructo

| Aspecto | Valor |
|---|---|
| Criterio | El constructo "competencia" está definido, diferenciado de personalidad/conocimiento/integridad/experiencia |
| Estado | ✔ APROBADO — definición formal en `competency-definition.md` (McClelland 1973; Spencer & Spencer 1993) |
| Evidencia | McClelland (1973); Spencer & Spencer "Competence at Work"; Boyatzis (1982) |

## COMP-G2 — Competency definition

| Aspecto | Valor |
|---|---|
| Criterio | La estructura Competency (competencyId, name, definition, behavioralIndicators, jobRelevance, source, version, status, approvedBy) está definida |
| Estado | ✔ APROBADO — estructura conceptual en `competency-framework.md` |
| Nota | NO incluye scoring, pesos, ni cortes (regla A-06.1) |

## COMP-G3 — Behavioral indicators

| Aspecto | Valor |
|---|---|
| Criterio | Cada competencia tiene indicadores conductuales observables, aprobados por humano |
| Estado | ⚠ CONDICIONAL — estructura definida en `behavioral-indicators.md`; ejemplos marcados `EJEMPLO — NO PRODUCTIVO` hasta aprobación |
| Acción requerida | Por cada competencia V1: redactar indicadores, revisar con experto, aprobar humano |

## COMP-G4 — Job relevance

| Aspecto | Valor |
|---|---|
| Criterio | Cada competencia está vinculada a puestos (JobCompetency) con rationale + relevance + criticality, aprobado por humano |
| Estado | ⚠ CONDICIONAL — estructura definida en `job-linkage.md`; requiere implementación por puesto |
| Acción requerida | Por cada puesto V1: análisis de puesto, vinculación de competencias, aprobación humana |
| Regla | IA NO decide jobRelevance |

## COMP-G5 — Evaluation method

| Aspecto | Valor |
|---|---|
| Criterio | El método de evaluación (entrevista estructurada BDI/STAR) está definido con evidencia científica |
| Estado | ✔ APROBADO — modelo recomendado en `recommended-model.md` (Opción A); evidencia Huffcutt/Arthur/Oliphant/Hartwell |
| Nota | SJT diferido a post-V1 (requiere desarrollo + baremos MX) |

## COMP-G6 — Human review

| Aspecto | Valor |
|---|---|
| Criterio | Toda decisión (nivel de evidencia, aprobación de guía, resolución de conflicto) es humana; IA solo asiste |
| Estado | ✔ APROBADO — gobernanza IA en `ai-boundaries.md` + `governance.md` |
| Regla | IA nunca cruza a APPROVED; `approvedBy` siempre humano |

## COMP-G7 — Governance

| Aspecto | Valor |
|---|---|
| Criterio | Ciclo de vida DRAFT→REVIEW→APPROVED→ACTIVE→SUSPENDED→RETIRED con trazabilidad |
| Estado | ✔ APROBADO — definido en `governance.md` |
| Invariantes | Una ACTIVE por competencyId; RETIRED terminal; audit trail inmutable |

## COMP-G8 — Legal review

| Aspecto | Valor |
|---|---|
| Criterio | Revisión legal de: preguntas discriminatorias, proporcionalidad, transparencia, dato sensible, LFPDPPP Art. 37 Bis |
| Estado | ✗ NO EVALUADO — **REQUIERE REVISIÓN LEGAL** profesional |
| Acción requerida | Asesoría legal sobre guías de entrevista, preguntas permitidas/prohibidas, consentimiento, retención |
| Crítico | Sin este gate, el modelo NO se activa en V1 |

## COMP-G9 — Pilot

| Aspecto | Valor |
|---|---|
| Criterio | Pilotaje del modelo en un puesto piloto (e.g. mesero) con evaluación de consistencia inter-entrevistador |
| Estado | ✗ NO EVALUADO — requiere implementación previa |
| Acción requerida | Seleccionar 1 puesto piloto; entrenar 2+ evaluadores; conducir 10+ entrevistas; medir consistencia; refinar |

## COMP-G10 — Validation

| Aspecto | Valor |
|---|---|
| Criterio | Validación predictiva (correlación CompetencyResult con desempeño posterior) en muestra MX |
| Estado | ✗ NO EVALUADO — requiere pilotaje + seguimiento (6–12 meses) |
| Acción requerida | Tras pilotaje, seguir candidatos contratados 6+ meses; correlacionar niveles con desempeño; ajustar modelo |

---

## 2. Estado actual de los gates (resumen)

| Gate | Estado | Bloquea V1 si FALLA |
|---|---|---|
| COMP-G1 Constructo | ✔ APROBADO | NO |
| COMP-G2 Competency definition | ✔ APROBADO | NO |
| COMP-G3 Behavioral indicators | ⚠ CONDICIONAL | SÍ (requiere indicadores por competencia) |
| COMP-G4 Job relevance | ⚠ CONDICIONAL | SÍ (requiere vínculos por puesto) |
| COMP-G5 Evaluation method | ✔ APROBADO | NO |
| COMP-G6 Human review | ✔ APROBADO | NO |
| COMP-G7 Governance | ✔ APROBADO | NO |
| COMP-G8 Legal review | ✗ NO EVALUADO | **SÍ — CRÍTICO** |
| COMP-G9 Pilot | ✗ NO EVALUADO | SÍ |
| COMP-G10 Validation | ✗ NO EVALUADO | NO (post-V1; gate diferible) |

## 3. Camino a activación V1

Para activar competencias en V1 productivo:
1. **COMP-G3**: redactar y aprobar indicadores conductuales por competencia (1–3 competencias piloto).
2. **COMP-G4**: vincular competencias a 1 puesto piloto (e.g. mesero), aprobación humana.
3. **COMP-G8**: revisión legal profesional de guías de entrevista.
4. **COMP-G9**: pilotaje con 2+ evaluadores, 10+ entrevistas, consistencia.
5. **COMP-G10** (diferible): validación predictiva post-contratación (6+ meses).

Tiempo estimado a V1 mínimo viable: 2–3 meses (G3+G4+G8+G9). G10 es post-V1.

## 4. Decisión

El modelo de competencias (entrevista estructurada) **NO se activa en V1 ship-block** hasta que G3+G4+G8+G9 se completen. A-06.1 es diseño + investigación; la implementación requiere una fase A-06.x separada.
