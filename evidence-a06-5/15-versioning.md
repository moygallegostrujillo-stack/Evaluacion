# A-06.5 — 15 · Versionado (PASO 19)

## 1. Entidades versionadas

| Entidad | Versionado | Ejemplo |
|---|---|---|
| InterviewGuide | Guide-v{n} | `Guide-v1` |
| InterviewQuestion | Question-v{n} | `Question-v1` |
| Probe | Probe-v{n} | `Probe-v1` |
| Rubric | Rubric-v{n} | `Rubric-v1` |
| InterviewEvidence | InterviewEvidence-v{n} | `InterviewEvidence-v1` |
| InterviewReview | InterviewReview-v{n} | `InterviewReview-v1` |
| CompetencyResult | CompetencyResult-v{n} | `CompetencyResult-v1` |

## 2. Regla de versionado

> Cambiar contenido relevante → nueva versión. Nunca reinterpretar entrevistas históricas.

### 2.1 Disparadores de bump

| Entidad | Disparador de bump |
|---|---|
| InterviewGuide | Cambio en el set de preguntas, probes, o rúbrica vinculada |
| InterviewQuestion | Cambio en texto, competencyId, indicatorId, questionType, purpose, evidenceExpected, notEvidence, source |
| Probe | Cambio en texto, purpose, questionId |
| Rubric | Cambio en niveles, criterios, indicatorsCovered |
| InterviewEvidence | Nueva captura (cada STAR es una nueva evidencia) |
| InterviewReview | Nueva revisión (append-only; no se sobreescribe) |
| CompetencyResult | Nueva revisión o nuevo candidato |

### 2.2 Inmutabilidad de lo publicado

- Una `InterviewQuestion` APPROVED es **inmutable**. Cambios = nueva versión (la anterior pasa a RETIRED).
- Una `Rubric` APPROVED es inmutable. Cambios = nueva versión.
- Una `InterviewEvidence` capturada es **inmutable** (append-only).

### 2.3 No reinterpretar históricos

> **Nunca reinterpretar entrevistas históricas.**

- Un CompetencyResult histórico (ya REVIEWED/APPROVED) no se recalcula si la rúbrica cambia.
- Si la rúbrica v2 cambia los criterios, los resultados v1 se preservan con `formulaVersion` de la rúbrica v1.
- Los nuevos resultados usan la rúbrica v2.

## 3. Ciclo de vida (estados)

```
DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED
```

| Estado | Quién lo asigna |
|---|---|
| DRAFT | Autor humano o IA (AI_DRAFT_ORIGIN) |
| REVIEW | Humano (autor solicita) |
| APPROVED | Humano (reviewer aprueba) |
| ACTIVE | SYSTEM (tras APPROVED) |
| SUSPENDED | Humano (admin) |
| RETIRED | Humano (admin) |

**RETIRED es terminal**. Una entidad RETIRED no vuelve a ACTIVE; si se necesita de nuevo, se crea una nueva versión.

## 4. Invariantes

1. Una sola InterviewQuestion ACTIVE por `questionId` (versiones previas RETIRED).
2. Una sola Rubric ACTIVE por `(competencyId, jobId)`.
3. Una sola InterviewGuide ACTIVE por `jobId`.
4. `approvedBy` no nulo desde APPROVED.
5. La IA nunca cruza a APPROVED ni ACTIVE.
6. RETIRED es terminal.
7. El audit trail es inmutable (no se borran registros).

## 5. Conexión con gates

El versionado pasa INTERVIEW-G8 (human review) + LEGAL-G10 (transparencia de A-06.4). Sin versionado documentado + inmutabilidad, las entidades no pueden estar ACTIVE.
