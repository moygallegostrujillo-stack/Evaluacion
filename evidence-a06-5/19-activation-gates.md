# A-06.5 — 19 · Activation Gates (PASO 26)

## 1. Sistema INTERVIEW-G1..G10

Para que el banco de entrevista se active en V1 productivo, debe pasar 10 gates.

Estados: **NO EVALUADO → APROBADO → FALLADO (NO IMPLEMENTAR)**.

---

## INTERVIEW-G1 — Source

| Aspecto | Valor |
|---|---|
| Criterio | Las preguntas/probes tienen fuente identificable (JOB_ANALYSIS, LITERATURE, EXPERT, AI_DRAFT_ORIGIN) |
| Estado | ✔ APROBADO (estructura) — `source` definido en InterviewQuestion + Probe |
| Acción | Cada pregunta candidata debe tener `source` documentado antes de REVIEW |

## INTERVIEW-G2 — Competency linkage

| Aspecto | Valor |
|---|---|
| Criterio | Cada pregunta se vincula a una Competency ACTIVE (JobCompetency ACTIVE) |
| Estado | ⚠ CONDICIONAL — estructura definida; requiere competencias ACTIVE en producción |
| Acción | Aprobar competencias piloto (A-06.2 COMP-G3+G4) antes de activar preguntas |

## INTERVIEW-G3 — Indicator

| Aspecto | Valor |
|---|---|
| Criterio | Cada pregunta se vincula a uno o más BehavioralIndicator ACTIVE |
| Estado | ⚠ CONDICIONAL — estructura definida; requiere indicadores ACTIVE |
| Acción | Aprobar indicadores piloto (A-06.2 COMP-G3) antes de activar preguntas |

## INTERVIEW-G4 — Question quality

| Aspecto | Valor |
|---|---|
| Criterio | Preguntas BDI válidas; mapean a indicadores; tienen evidenceExpected + notEvidence; pasan proporcionalidad |
| Estado | ⚠ CONDICIONAL — reglas definidas (`05-bdi-design.md`, `07-evidence-rules.md`, `12-proportionality.md`); ejemplos NO PRODUCTIVO |
| Acción | Redactar y aprobar preguntas piloto por competencia-puesto |

## INTERVIEW-G5 — Probe quality

| Aspecto | Valor |
|---|---|
| Criterio | Probes diseñados, validados (no sugerentes, no discriminatorios), aprobados |
| Estado | ⚠ CONDICIONAL — banco conceptual definido (`06-probes.md`); ejemplos NO PRODUCTIVO |
| Acción | Redactar y aprobar probes piloto |

## INTERVIEW-G6 — Bias review

| Aspecto | Valor |
|---|---|
| Criterio | Auditoría de sesgo por pregunta; legalStatus asignado; preguntas discriminatorias NO_PUBLICABLE |
| Estado | ✔ APROBADO (análisis) — `11-bias-review.md` + A-06.4 `13-discrimination.md` |
| Acción | Aplicar a cada pregunta piloto antes de APPROVED |

## INTERVIEW-G7 — Legal review

| Aspecto | Valor |
|---|---|
| Criterio | Revisión legal de guías, preguntas, probes, rúbricas (LFPDPPP, LFT, CONAPRED) |
| Estado | ✗ NO EVALUADO — **REQUIERE REVISIÓN LEGAL** profesional |
| Acción | Asesoría legal sobre preguntas, consentimiento, retención, Art 37 Bis |
| Crítico | Sin este gate, el banco NO se activa en V1 |

## INTERVIEW-G8 — Human review

| Aspecto | Valor |
|---|---|
| Criterio | Revisión humana documentada; InterviewReview append-only; IA nunca aprueba |
| Estado | ✔ APROBADO (estructura) — `14-human-review.md` + `18-governance.md` |
| Invariantes | `reviewedBy` + `approvedBy` humanos; append-only; audit trail inmutable |

## INTERVIEW-G9 — Pilot

| Aspecto | Valor |
|---|---|
| Criterio | Pilotaje en un puesto piloto (e.g. MESERO) con 2+ evaluadores, 10+ entrevistas, consistencia inter-entrevistador |
| Estado | ✗ NO EVALUADO — requiere implementación previa |
| Acción | Seleccionar 1 puesto piloto; entrenar 2+ evaluadores; conducir 10+ entrevistas; medir consistencia; refinar |

## INTERVIEW-G10 — Validation

| Aspecto | Valor |
|---|---|
| Criterio | Validación predictiva (correlación CompetencyResult con desempeño posterior) en muestra MX |
| Estado | ✗ NO EVALUADO — requiere pilotaje + seguimiento (6–12 meses) |
| Acción | Tras pilotaje, seguir candidatos contratados 6+ meses; correlacionar niveles con desempeño; ajustar |

---

## 2. Estado actual (resumen)

| Gate | Estado | Bloquea V1 si FALLA |
|---|---|---|
| INTERVIEW-G1 Source | ✔ APROBADO (estructura) | NO (aplicar por pregunta) |
| INTERVIEW-G2 Competency linkage | ⚠ CONDICIONAL | SÍ (requiere competencias ACTIVE) |
| INTERVIEW-G3 Indicator | ⚠ CONDICIONAL | SÍ (requiere indicadores ACTIVE) |
| INTERVIEW-G4 Question quality | ⚠ CONDICIONAL | SÍ (requiere preguntas aprobadas) |
| INTERVIEW-G5 Probe quality | ⚠ CONDICIONAL | SÍ (requiere probes aprobados) |
| INTERVIEW-G6 Bias review | ✔ APROBADO (análisis) | NO (aplicar por pregunta) |
| INTERVIEW-G7 Legal review | ✗ NO EVALUADO | **SÍ — CRÍTICO** |
| INTERVIEW-G8 Human review | ✔ APROBADO (estructura) | NO |
| INTERVIEW-G9 Pilot | ✗ NO EVALUADO | SÍ |
| INTERVIEW-G10 Validation | ✗ NO EVALUADO | NO (post-V1; diferible) |

## 3. Camino a activación V1

1. **INTERVIEW-G2/G3**: aprobar competencias + indicadores piloto (A-06.2 COMP-G3+G4).
2. **INTERVIEW-G4/G5**: redactar y aprobar preguntas + probes piloto.
3. **INTERVIEW-G7**: revisión legal profesional de la guía completa.
4. **INTERVIEW-G9**: pilotaje con 2+ evaluadores, 10+ entrevistas, consistencia.
5. **INTERVIEW-G10** (diferible): validación predictiva post-contratación (6+ meses).

Tiempo estimado: 2–3 meses (G2+G3+G4+G5+G7+G9). G10 es post-V1.

## 4. Decisión

El banco de entrevista **NO se activa en V1 ship-block** hasta que G2+G3+G4+G5+G7+G9 se completen. A-06.5 es diseño del banco candidato; la implementación requiere una fase A-06.x separada.
