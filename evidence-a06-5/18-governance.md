# A-06.5 — 18 · Governance (PASO 25)

## 1. Ciclo

```
DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED
```

Aplica a: InterviewGuide, InterviewQuestion, Probe, Rubric, InterviewReview, CompetencyResult.

## 2. Estados

| Estado | Significado | Quién lo asigna |
|---|---|---|
| DRAFT | Borrador; no productivo | Autor humano o IA (AI_DRAFT_ORIGIN) |
| REVIEW | En revisión por reviewer humano | Autor solicita |
| APPROVED | Aprobado por humano | Reviewer humano aprueba |
| ACTIVE | Publicado; disponible | SYSTEM (tras APPROVED) |
| SUSPENDED | Temporalmente retirado | Humano (admin) |
| RETIRED | Retirado permanentemente; histórico preservado | Humano (admin) |

## 3. Separación de roles

| Rol | Responsabilidad | IA permitida |
|---|---|---|
| Author | Crea DRAFT (humano) o sugiere (IA con AI_DRAFT_ORIGIN) | SÍ (asistente) |
| Reviewer | Revisa DRAFT, aprueba o rechaza | NO (solo humano) |
| Approver | Aprueba APPROVED | NO (solo humano) |
| Admin | Suspende/Retira | NO (solo humano) |
| SYSTEM | Publica ACTIVE tras APPROVED | SÍ (automático, no decisional) |

## 4. Regla: IA nunca aprueba

> La IA **nunca** cruza a APPROVED ni ACTIVE.

- La IA puede crear DRAFT (AI_DRAFT_ORIGIN).
- La IA puede sugerir (AI_SUGGESTED).
- La aprobación es siempre humana (`approvedBy`).
- El `origin` es permanente (no se pierde al aprobar).

## 5. Trazabilidad

Cada entidad mantiene:

```
{
  createdBy: string             // humano o IA (con origin)
  createdAt: timestamp
  reviewedBy: string?           // humano
  reviewedAt: timestamp?
  approvedBy: string?           // humano (no nulo desde APPROVED)
  approvedAt: timestamp?
  version: string               // Guide-v1 / Question-v1 / Probe-v1 / Rubric-v1
  suspendedBy?: string
  suspendedAt?: timestamp
  retiredBy?: string
  retiredAt?: timestamp
}
```

## 6. Invariantes

1. Una sola InterviewGuide ACTIVE por `jobId`.
2. Una sola InterviewQuestion ACTIVE por `questionId`.
3. Una sola Rubric ACTIVE por `(competencyId, jobId)`.
4. `approvedBy` no nulo desde APPROVED.
5. La IA nunca cruza a APPROVED ni ACTIVE.
6. RETIRED es terminal.
7. El audit trail es inmutable.

## 7. Transiciones

| Desde | Hasta | Quién |
|---|---|---|
| DRAFT | REVIEW | Humano (autor solicita) |
| REVIEW | APPROVED | Humano (reviewer aprueba) |
| REVIEW | DRAFT | Humano (reviewer rechaza) |
| APPROVED | ACTIVE | SYSTEM (publicación automática) |
| ACTIVE | SUSPENDED | Humano (admin) |
| SUSPENDED | ACTIVE | Humano (admin) |
| SUSPENDED | RETIRED | Humano (admin) |
| ACTIVE | RETIRED | Humano (admin) |

## 8. Conexión con gates

La governance pasa INTERVIEW-G8 (human review) + LEGAL-G10 (transparencia). Sin ciclo documentado + segregación de roles + IA nunca aprueba, las entidades no pueden estar ACTIVE.
