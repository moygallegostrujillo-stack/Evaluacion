# A-06.6 — 16 · Gates (PASO 24)

## 1. Regla

Actualizar INTERVIEW-G1..G10 con la evidencia del piloto. **El piloto puede aportar evidencia para G9. NO marcar G7 como aprobado. NO marcar G10 como validación psicométrica.**

## 2. Estado actualizado de los gates

| Gate | Estado anterior (A-06.5) | Estado tras piloto | Evidencia del piloto |
|---|---|---|---|
| INTERVIEW-G1 Source | ✔ APROBADO (estructura) | ✔ APROBADO (estructura; aplicar por pregunta) | Las 10 preguntas tienen source (JOB_ANALYSIS); `question-traceability.csv` |
| INTERVIEW-G2 Competency linkage | ⚠ CONDICIONAL | ⚠ CONDICIONAL (sin cambio) | Las competencias siguen DRAFT (A-06.2); el piloto no las activa |
| INTERVIEW-G3 Indicator | ⚠ CONDICIONAL | ⚠ CONDICIONAL (sin cambio) | Los indicadores siguen DRAFT (A-06.2); el piloto no los activa |
| INTERVIEW-G4 Question quality | ⚠ CONDICIONAL | ⚠ CONDICIONAL → **evidencia a favor** | 8/10 STRONG, 2/10 ACCEPTABLE, 0 REJECT en simulación; requiere aprobación humana formal para ACTIVE |
| INTERVIEW-G5 Probe quality | ⚠ CONDICIONAL | ⚠ CONDICIONAL → **evidencia a favor** | 24/25 VALID, 1/25 LIMITED, 0 REJECT; 1 probe nuevo propuesto (PROBE-COL-001-D) |
| INTERVIEW-G6 Bias review | ✔ APROBADO (análisis) | ✔ APROBADO (análisis + piloto) | Revelación involuntaria manejada (M-H, V-H); ninguna pregunta elicitó atributos |
| INTERVIEW-G7 Legal review | ✗ NO EVALUADO | ✗ **NO EVALUADO (SIN CAMBIO)** | El piloto NO es asesoría legal; REQUIERE REVISIÓN LEGAL profesional |
| INTERVIEW-G8 Human review | ✔ APROBADO (estructura) | ✔ APROBADO (estructura + piloto) | InterviewReview simulado; append-only verificado; evidencia original intacta |
| INTERVIEW-G9 Pilot | ✗ NO EVALUADO | ⚠ **PARCIALMENTE EVIDENCIADO** | El piloto simulado aporta evidencia metodológica inicial (20 casos, consistencia 95%), pero NO sustituye un pilotaje con entrevistadores entrenados y candidatos (sintéticos o reales) en condiciones de campo. **G9 sigue CONDICIONAL**: requiere pilotaje de campo real |
| INTERVIEW-G10 Validation | ✗ NO EVALUADO | ✗ **NO EVALUADO (SIN CAMBIO)** | El piloto NO es validación psicométrica ni predictiva; G10 sigue diferible post-V1 |

## 3. Hallazgo crítico de gates

| Gate | Bloquea activación V1 |
|---|---|
| INTERVIEW-G2/G3 (competencias/indicadores ACTIVE) | SÍ |
| INTERVIEW-G4/G5 (preguntas/probes ACTIVE) | SÍ |
| INTERVIEW-G7 (legal review) | **SÍ — CRÍTICO** |
| INTERVIEW-G9 (pilot de campo real) | SÍ |

## 4. Regla: el piloto simulado ≠ pilotaje de campo

> **Este piloto (A-06.6) es una SIMULACIÓN conceptual con casos sintéticos. NO sustituye un pilotaje de campo** (entrevistadores entrenados conduciendo entrevistas, aunque sea con candidatos simulados por actores o voluntarios, en condiciones realistas de tiempo y presión).

INTERVIEW-G9 queda **CONDICIONAL**: el piloto simulado aporta evidencia de calidad metodológica inicial, pero el pilotaje de campo real (con sesiones cronometradas, entrevistadores entrenados, y consistencia inter-entrevistador medida) sigue requerido.

## 5. Conexión con limitaciones

Ver `18-limitations.md` para la declaración completa de límites del piloto.
