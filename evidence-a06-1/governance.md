# A-06.1 — Governance (PASO 13)

## 1. Ciclo de vida de una Competency

```
DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED
```

### 1.1 Estados

| Estado | Significado | Quién lo asigna |
|---|---|---|
| DRAFT | Borrador; no productivo | Autor humano o IA (con origin=AI_DRAFT_ORIGIN) |
| REVIEW | En revisión por un reviewer humano | Autor humano solicita revisión |
| APPROVED | Revisión completa; aprobado por humano | Reviewer humano aprueba |
| ACTIVE | Publicado; disponible para evaluaciones | SYSTEM (tras APPROVED) |
| SUSPENDED | Temporalmente retirado (auditoría, revisión) | Humano (reviewer/admin) |
| RETIRED | Retirado permanentemente; histórico preservado | Humano (admin) |

### 1.2 Transiciones

| Desde | Hasta | Quién |
|---|---|---|
| DRAFT | REVIEW | Humano (autor solicita) |
| REVIEW | APPROVED | Humano (reviewer aprueba) |
| REVIEW | DRAFT | Humano (reviewer rechaza; vuelve para corrección) |
| APPROVED | ACTIVE | SYSTEM (publicación automática) |
| ACTIVE | SUSPENDED | Humano (admin; auditoría) |
| SUSPENDED | ACTIVE | Humano (admin; tras resolver) |
| SUSPENDED | RETIRED | Humano (admin; retiro permanente) |
| ACTIVE | RETIRED | Humano (admin) |

**Terminal**: RETIRED es terminal. Una competencia RETIRED no vuelve a ACTIVE; si se necesita de nuevo, se crea una nueva versión.

## 2. Roles

| Rol | Responsabilidad | IA permitida |
|---|---|---|
| Author | Crea DRAFT (humano) o sugiere (IA con origin=AI_DRAFT_ORIGIN) | SÍ (como asistente) |
| Reviewer | Revisa DRAFT, aprueba o rechaza | NO (solo humano) |
| Approver | Aprueba APPROVED (puede ser mismo Reviewer o distinto para segregación) | NO (solo humano) |
| Admin | Suspende/Retira | NO (solo humano) |
| SYSTEM | Publica ACTIVE tras APPROVED | SÍ (automático, no decisional) |

## 3. Trazabilidad

Cada Competency, JobCompetency, InterviewGuide, y CompetencyResult mantiene:

```
{
  createdBy: string             // humano o IA (con origin)
  createdAt: timestamp
  reviewedBy: string?           // humano
  reviewedAt: timestamp?
  approvedBy: string?           // humano (no nulo desde APPROVED)
  approvedAt: timestamp?
  suspendedBy?: string
  suspendedAt?: timestamp
  retiredBy?: string
  retiredAt?: timestamp
}
```

`origin` (AI_DRAFT_ORIGIN | RH_MANUAL | SYSTEM) es permanente: no se pierde al aprobar.

## 4. Invariantes

1. Una sola Competency ACTIVE por `competencyId` (versiones previas RETIRED).
2. `approvedBy` no nulo desde APPROVED.
3. La IA nunca cruza a APPROVED ni ACTIVE.
4. RETIRED es terminal.
5. El audit trail es inmutable (no se borran registros, solo se retiran).

## 5. Segregación de duties (recomendada)

Para entorno productivo multi-tenant:
- El Author y el Reviewer deberían ser personas distintas (segregación).
- El Approver puede ser el Reviewer o un tercero (según criticidad).
- El Admin es rol separado (suspende/retira).

En V1 mínimo, un solo rol humano puede cubrir Author+Reviewer+Approver, pero se documenta quién hace qué.

## 6. Conexión con gates

La governance pasa COMP-G7 (governance gate). Sin ciclo de vida documentado + trazabilidad + revisión humana, las competencias no pueden estar ACTIVE.
