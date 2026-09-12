# A-06.4 — 16 · Revisión Humana (PASO 16)

## 1. Regla

Las siguientes acciones son **exclusivamente humanas**:

| Acción | Quién | Por qué exclusivamente humana |
|---|---|---|
| Revisión | Reviewer humano | Interpreta evidencia; asigna nivel |
| Confirmación | Reviewer o approver | Valida el nivel asignado |
| Ampliación | Reviewer | Solicita segunda entrevista o verificación adicional |
| Contradicción | Reviewer | Marca conflicto entre fuentes |
| Invalidación | Reviewer o admin | Marca evidencia como INVALID (procedimiento incorrecto) |
| Cierre | Approver | Aprueba el CompetencyResult final |

## 2. Cadena de revisión

```
Entrevista (entrevistador + IA asiste)
  → InterviewEvidence (STAR, inmutable)
  → Revisión humana (reviewer)
    → asigna evidenceLevel
    → marca conflicts
    → notes limitations
  → CompetencyResult (status REVIEWED)
  → Aprobación humana (approver)
  → CompetencyResult (status APPROVED)
  → [RR.HH. decide con múltiples fuentes]
```

## 3. Append-only

> La revisión **NO** borra la evidencia original. Es append-only.

- `InterviewEvidence` (STAR capturado) es inmutable.
- `InterviewReview` se añade como capa de interpretación.
- Si el reviewer corrige un nivel, se crea una nueva `InterviewReview` (nueva versión).
- El audit trail queda completo: evidencia original + revisiones sucesivas.

## 4. Estructura InterviewReview

```
InterviewReview {
  reviewId: string
  interviewId: string
  competencyId: string
  reviewer: string                 // humano
  reviewDate: timestamp
  evidenceState: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  observations: string             // notas del reviewer
  conflicts: string[]              // ConflictRecord IDs
  limitations: string[]            // limitaciones detectadas
  decisionContext: string          // contexto para RR.HH.
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
  approvedBy: string?
  approvedAt: timestamp?
  version: string                  // InterviewReview-v1
}
```

## 5. Roles en revisión

| Rol | Acción |
|---|---|
| Entrevistador | Conduce; captura STAR |
| Reviewer | Revisa; asigna nivel; marca conflictos |
| Approver | Aprueba el CompetencyResult final |
| Admin | Gestiona suspensiones/retiros |

**Recomendación**: reviewer ≠ entrevistador (segregación de duties) cuando sea posible.

## 6. Prohibición de IA en revisión

> **La IA NO puede**: asignar nivel, aprobar, invalidar, resolver conflictos.

La IA puede **sugerir** ("basado en la respuesta, parece SUPPORTED"), pero la asignación es humana con `rationale` textual.

## 7. Trazabilidad de la revisión

Todo cambio se registra:
- `reviewedBy` (humano)
- `reviewedAt` (timestamp)
- `approvedBy` (humano, si APPROVED)
- `approvedAt` (timestamp)
- `version` (bump en cada nueva revisión)

El audit trail permite reconstruir: quién revisó, cuándo, qué nivel asignó, qué conflictos marcó.

## 8. Conexión con gates

La revisión humana pasa LEGAL-G7 (Decisión humana) + INT-G8 (Governance). Sin revisión humana documentada + append-only, el CompetencyResult no es válido.
