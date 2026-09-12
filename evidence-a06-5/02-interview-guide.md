# A-06.5 — 02 · InterviewGuide (PASO 2)

## 1. Estructura canónica

```
InterviewGuide {
  guideId: string                // e.g. "GUIDE-MESERO-v1"
  jobId: string                  // FK a Position | Vacancy
  version: string                // e.g. "Guide-v1"
  status: DRAFT | REVIEW | APPROVED | ACTIVE | SUSPENDED | RETIRED
  createdBy: string              // humano (o IA con origin=AI_DRAFT_ORIGIN)
  reviewedBy: string?            // humano
  approvedBy: string?            // humano (no nulo desde APPROVED)
  approvalDate: timestamp?
  questions: string[]             // InterviewQuestion IDs
  probes: string[]                // Probe IDs (universales + específicos)
  rubricId: string?               // Rubric vinculada
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 2. Campo por campo

| Campo | Tipo | Significado |
|---|---|---|
| guideId | string | Identificador único; formato GUIDE-{puesto}-v{n} |
| jobId | string | Puesto al que aplica (Position o Vacancy) |
| version | string | Versión técnica (Guide-v1, Guide-v2...) |
| status | enum | Estado en el ciclo de governance |
| createdBy | string | Autor humano (o IA con origin) |
| reviewedBy | string? | Reviewer humano (no nulo desde REVIEW) |
| approvedBy | string? | Approver humano (no nulo desde APPROVED; IA nunca) |
| approvalDate | timestamp? | Fecha de aprobación |
| questions | string[] | Lista de questionIds incluidos en la guía |
| probes | string[] | Lista de probeIds disponibles |
| rubricId | string? | Rúbrica cualitativa vinculada |
| createdAt | timestamp | Creación |
| updatedAt | timestamp | Última modificación |

## 3. Reglas

1. **Una InterviewGuide ACTIVE por jobId**: versiones previas RETIRED.
2. **Inmutabilidad**: una guía APPROVED no se modifica; cambios = nueva versión.
3. **Vinculación**: las preguntas incluidas deben estar ACTIVE y vinculadas a competencias ACTIVE para ese jobId (JobCompetency ACTIVE).
4. **Rúbrica**: la guía referencia una Rubric ACTIVE para ese jobId.
5. **IA**: puede sugerir (AI_DRAFT_ORIGIN, DRAFT) pero nunca APPROVED ni ACTIVE.

## 4. Ejemplo — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> ```
> guideId: GUIDE-MESERO-v1
> jobId: position-mesero-001
> version: Guide-v1
> status: DRAFT
> createdBy: reviewer@evaluaHR (o AI_DRAFT_ORIGIN)
> reviewedBy: null
> approvedBy: null
> approvalDate: null
> questions: [Q-SVC-001-A, Q-SVC-002-A, Q-COL-001-A, Q-ORG-001-A]
> probes: [PROBE-UNI-001..008, PROBE-SVC-001-A..D]
> rubricId: RUBRIC-MESERO-SVC-v1
> ```

## 5. Conexión con gates

La InterviewGuide pasa INTERVIEW-G2 (competency linkage) + INTERVIEW-G4 (question quality) +
INTERVIEW-G5 (probe quality) + INTERVIEW-G6 (bias review) + INTERVIEW-G7 (legal review) +
INTERVIEW-G8 (human review). Sin todos estos, la guía no pasa a ACTIVE.
