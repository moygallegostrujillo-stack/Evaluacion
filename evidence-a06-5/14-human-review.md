# A-06.5 — 14 · Revisión Humana (PASO 17)

## 1. InterviewReview (estructura)

```
InterviewReview {
  reviewId: string
  candidateId: string
  jobId: string
  reviewerId: string                // humano
  reviewDate: timestamp
  questionVersion: string           // versión de la pregunta revisada
  evidenceState: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  rationale: string                 // justificación textual
  conflicts: string[]               // ConflictRecord IDs
  limitations: string[]             // limitaciones detectadas
  reviewVersion: string             // InterviewReview-v1 (bump en cada revisión)
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
  approvedBy: string?
  approvedAt: timestamp?
  createdAt: timestamp
}
```

## 2. Regla: append-only

> La revisión **NO** borra la evidencia original. Es append-only.

- `InterviewEvidence` (STAR capturado) es inmutable.
- `InterviewReview` se añade como capa de interpretación.
- Si el reviewer corrige un nivel, se crea una nueva `InterviewReview` (nueva `reviewVersion`).
- El audit trail queda completo: evidencia original + revisiones sucesivas.

## 3. Acciones exclusivamente humanas

| Acción | Quién | Por qué |
|---|---|---|
| Revisión | Reviewer humano | Interpreta evidencia; asigna nivel |
| Confirmación | Reviewer o approver | Valida el nivel |
| Ampliación | Reviewer | Solicita segunda entrevista o verificación |
| Contradicción | Reviewer | Marca conflicto entre fuentes |
| Invalidación | Reviewer o admin | Marca evidencia como INVALID |
| Cierre | Approver | Aprueba el CompetencyResult final |

## 4. Cadena de revisión

```
Entrevista (entrevistador + IA asiste)
  → InterviewEvidence (STAR, inmutable)
  → Revisión humana (reviewer)
    → asigna evidenceState
    → marca conflicts
    → notes limitations
    → rationale textual
  → InterviewReview (append-only)
  → CompetencyResult (status REVIEWED)
  → Aprobación humana (approver)
  → CompetencyResult (status APPROVED)
  → [RR.HH. decide con múltiples fuentes]
```

## 5. Roles

| Rol | Responsabilidad | IA permitida |
|---|---|---|
| Entrevistador | Conduce; captura STAR | IA asiste (probes, resumen) |
| Reviewer | Revisa evidencia; asigna nivel; marca conflictos | IA sugiere nivel (no decide) |
| Approver | Aprueba CompetencyResult final | NO (solo humano) |

**Recomendación**: reviewer ≠ entrevistador (segregación de duties) cuando sea posible.

## 6. Prohibición de IA en revisión

> La IA **NO** puede: asignar nivel, aprobar, invalidar, resolver conflictos.

La IA puede sugerir, pero la asignación final es humana con `rationale` textual.

## 7. Trazabilidad de la revisión

Todo cambio se registra:
- `reviewerId` (humano)
- `reviewDate` (timestamp)
- `approvedBy` (humano, si APPROVED)
- `approvedAt` (timestamp)
- `reviewVersion` (bump en cada nueva revisión)

## 8. Conexión con gates

La revisión humana pasa INTERVIEW-G8 (human review) + LEGAL-G7 (decisión humana de A-06.4). Sin revisión humana documentada + append-only, el CompetencyResult no es válido.
