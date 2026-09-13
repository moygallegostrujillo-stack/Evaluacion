# A-06.3 — 18 · Versionado y Trazabilidad (PASO 19, 20)

## 1. Entidades versionadas

| Entidad | Versionado | Ejemplo |
|---|---|---|
| InterviewGuide | InterviewGuide-v{n} | `InterviewGuide-v1` |
| InterviewQuestion | InterviewQuestion-v{n} | `InterviewQuestion-v1` |
| Probe | Probe-v{n} | `Probe-v1` |
| Rubric | Rubric-v{n} | `Rubric-v1` |
| InterviewEvidence | InterviewEvidence-v{n} | `InterviewEvidence-v1` |
| InterviewReview | InterviewReview-v{n} | `InterviewReview-v1` |
| CompetencyResult | CompetencyResult-v{n} | `CompetencyResult-v1` |

## 2. Regla de versionado

> Cambiar contenido relevante → nueva versión. Nunca reinterpretar entrevistas históricas.

### 2.1 Cuándo bumpar versión

| Entidad | Disparador de bump |
|---|---|
| InterviewGuide | Cambio en el set de preguntas, probes, o rúbrica vinculada |
| InterviewQuestion | Cambio en el texto, type, o indicatorIds |
| Probe | Cambio en el texto o purpose |
| Rubric | Cambio en niveles, criterios, o indicatorsCovered |
| InterviewEvidence | Nueva captura (cada STAR es una nueva evidencia) |
| InterviewReview | Nueva revisión (append-only; no se sobreescribe) |
| CompetencyResult | Nueva revisión o nuevo candidato |

### 2.2 Inmutabilidad de lo publicado

- Una `InterviewQuestion` APPROVED es **inmutable**. Cambios = nueva versión (la anterior pasa a RETIRED).
- Una `Rubric` APPROVED es inmutable. Cambios = nueva versión.
- Una `InterviewEvidence` capturada es **inmutable** (append-only). La revisión se añade, no se modifica.

### 2.3 No reinterpretar históricos

> **Nunca reinterpretar entrevistas históricas**.

- Un CompetencyResult histórico (ya REVIEWED/APPROVED) no se recalcula si la rúbrica cambia.
- Si la rúbrica v2 cambia los criterios, los resultados v1 se preservan con `formulaVersion = CompetencyResult-v1` (rúbrica v1).
- Los nuevos resultados usan `formulaVersion = CompetencyResult-v2` (rúbrica v2).

## 3. Trazabilidad (PASO 19)

Cada pregunta puede rastrearse:

```
questionId
  → competencyId
  → indicatorId(s)
  → jobId
  → source (JOB_ANALYSIS | LITERATURE | AI_DRAFT_ORIGIN)
  → version (InterviewQuestion-v1)
  → approvedBy (humano)
```

Cada CompetencyResult puede rastrearse:

```
CompetencyResult
  → competencyId + competencyVersion
  → jobId
  → supportingEvidence (InterviewEvidence IDs)
      → InterviewEvidence
          → questionId (InterviewQuestion)
              → competencyId → indicatorId(s) → jobId
          → star (Situation/Task/Action/Result)
          → collectedBy (entrevistador)
  → reviewedBy (humano)
  → conflicts (ConflictRecord IDs, si los hay)
```

## 4. Ciclo de vida (estados)

Aplica a: InterviewGuide, InterviewQuestion, Probe, Rubric, CompetencyResult.

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

## 5. Invariantes

1. Una sola InterviewQuestion ACTIVE por `questionId` (versiones previas RETIRED).
2. Una sola Rubric ACTIVE por `(competencyId, jobId)`.
3. `approvedBy` no nulo desde APPROVED.
4. La IA nunca cruza a APPROVED ni ACTIVE.
5. RETIRED es terminal.
6. El audit trail es inmutable (no se borran registros).

## 6. Conexión con gates

El versionado pasa INT-G8 (governance). Sin versionado documentado + trazabilidad, las entidades no pueden estar ACTIVE.
