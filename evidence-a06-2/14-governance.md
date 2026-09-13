# A-06.2 — 14 · Governance (PASO 20)

## 1. Ciclo de vida

```
DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED
```

Aplica a: Competency, JobCompetency, BehavioralIndicator, InterviewGuide, CompetencyResult.

## 2. Estados

| Estado | Significado | Quién lo asigna |
|---|---|---|
| DRAFT | Borrador; no productivo | Autor humano o IA (con origin=AI_DRAFT_ORIGIN) |
| REVIEW | En revisión por reviewer humano | Autor solicita |
| APPROVED | Aprobado por humano | Reviewer humano aprueba |
| ACTIVE | Publicado; disponible para evaluaciones | SYSTEM (tras APPROVED) |
| SUSPENDED | Temporalmente retirado | Humano (admin) |
| RETIRED | Retirado permanentemente; histórico preservado | Humano (admin) |

## 3. Trazabilidad

Cada entidad mantiene:

```
{
  createdBy: string             // humano o IA (con origin)
  createdAt: timestamp
  reviewedBy: string?           // humano
  reviewedAt: timestamp?
  approvedBy: string?           // humano (no nulo desde APPROVED)
  approvedAt: timestamp?
  approvalDate: timestamp?      // sinónimo de approvedAt
  version: string               // COMP-v{n} / JobCompetency-v{n} / IND-v{n}
  suspendedBy?: string
  suspendedAt?: timestamp
  retiredBy?: string
  retiredAt?: timestamp
}
```

`origin` (AI_DRAFT_ORIGIN | AI_SUGGESTED | RH_MANUAL | SYSTEM) es permanente.

## 4. Transiciones

| Desde | Hasta | Quién |
|---|---|---|
| DRAFT | REVIEW | Humano (autor solicita) |
| REVIEW | APPROVED | Humano (reviewer aprueba) |
| REVIEW | DRAFT | Humano (reviewer rechaza; vuelve para corrección) |
| APPROVED | ACTIVE | SYSTEM (publicación automática) |
| ACTIVE | SUSPENDED | Humano (admin) |
| SUSPENDED | ACTIVE | Humano (admin; tras resolver) |
| SUSPENDED | RETIRED | Humano (admin) |
| ACTIVE | RETIRED | Humano (admin) |

**Terminal**: RETIRED es terminal. Una entidad RETIRED no vuelve a ACTIVE; si se necesita de nuevo, se crea una nueva versión.

## 5. Roles

| Rol | Responsabilidad | IA permitida |
|---|---|---|
| Author | Crea DRAFT (humano) o sugiere (IA con origin=AI_DRAFT_ORIGIN) | SÍ (asistente) |
| Reviewer | Revisa DRAFT, aprueba o rechaza | NO (solo humano) |
| Approver | Aprueba APPROVED | NO (solo humano) |
| Admin | Suspende/Retira | NO (solo humano) |
| SYSTEM | Publica ACTIVE tras APPROVED | SÍ (automático, no decisional) |

## 6. Invariantes

1. Una sola Competency ACTIVE por `competencyId` (versiones previas RETIRED).
2. `approvedBy` no nulo desde APPROVED.
3. La IA nunca cruza a APPROVED ni ACTIVE.
4. RETIRED es terminal.
5. El audit trail es inmutable (no se borran registros, solo se retiran).
6. Una sola JobCompetency ACTIVE por par (jobId, competencyId).

## 7. Segregación de duties (recomendada)

Para entorno productivo:
- Author y Reviewer deberían ser personas distintas.
- Approver puede ser Reviewer o tercero.
- Admin es rol separado.

En V1 mínimo, un solo rol humano puede cubrir Author+Reviewer+Approver, pero se documenta quién hace qué.

## 8. Conexión con gates

La governance pasa COMP-G7 (governance gate). Sin ciclo documentado + trazabilidad + revisión humana, ninguna entidad puede estar ACTIVE.
