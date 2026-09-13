# A-06.3 — 16 · Revisión Humana (PASO 22, 24)

## 1. Regla

> La salida será: **Evidencia → Revisión humana → CompetencyResult**.
>
> **No**: IA → CompetencyResult.

## 2. InterviewReview (estructura)

```
InterviewReview {
  reviewId: string
  interviewId: string              // FK a la sesión de entrevista
  competencyId: string
  reviewer: string                  // humano (puede ser entrevistador o reviewer distinto)
  reviewDate: timestamp
  evidenceState: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  observations: string              // notas del reviewer
  conflicts: string[]               // IDs de ConflictRecord
  limitations: string[]             // limitaciones detectadas (e.g. "audio incompleto", "candidato fatigado")
  decisionContext: string           // contexto adicional para RR.HH.
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
  approvedBy: string?              // humano (si APPROVED)
  approvedAt: timestamp?
  version: string                   // InterviewReview-v1
}
```

## 3. Regla: append-only

> La revisión **NO debe borrar la evidencia original**. Debe ser **append-only**.

- La `InterviewEvidence` (STAR capturado) **no se modifica**.
- La `InterviewReview` se añade como capa de interpretación.
- Si el reviewer corrige un nivel, se crea una nueva `InterviewReview` (nueva versión), no se sobreescribe la anterior.
- El audit trail es inmutable: todas las revisiones quedan registradas.

## 4. Proceso de revisión

```
Entrevista (captura STAR)
        ↓
InterviewEvidence (inmutable)
        ↓
Revisión humana (reviewer)
        ↓
InterviewReview (interpretación + nivel asignado)
        ↓
CompetencyResult (agregado por competencia)
        ↓
[RR.HH. decide con múltiples fuentes — LFPDPPP Art. 37 Bis]
```

## 5. Roles en la revisión

| Rol | Responsabilidad | IA permitida |
|---|---|---|
| Entrevistador | Conduce la entrevista; captura STAR | IA asiste (probes, resumen) |
| Reviewer | Revisa evidencia; asigna nivel; marca conflictos | IA sugiere nivel (no decide) |
| Approver | Aprueba el CompetencyResult final | NO (solo humano) |

**Recomendación**: el reviewer debería ser **distinto** al entrevistador (segregación de duties) cuando sea posible, para reducir sesgo de "yo lo entrevisté, yo lo evalué".

## 6. Contenido de la revisión

### 6.1 observations

Notas del reviewer sobre la calidad de la evidencia:
> "El candidato dio un ejemplo claro con Action específica (escuchó, explicó, mantuvo calma). Sin embargo, el Result no fue verificable (no hubo referencia). Clasificado SUPPORTED con nota de Result no verificado."

### 6.2 conflicts

IDs de ConflictRecord si hay conflicto entre fuentes:
> `conflicts: ['CONFLICT-001', 'CONFLICT-002']`

### 6.3 limitations

Limitaciones detectadas:
> `limitations: ['audio incompleto en la última pregunta', 'candidato interrumpido por llamada', 'entrevista recortada por tiempo']`

### 6.4 decisionContext

Contexto adicional para RR.HH.:
> "Competencia evaluada en segundo ejemplo tras probe; el primer ejemplo fue hipotético. Nivel LIMITED por el contexto, no SUPPORTED."

## 7. Estado de la revisión

| Estado | Significado |
|---|---|
| PENDING_REVIEW | Revisión pendiente (conflicto no resuelto, o requiere segundo reviewer) |
| REVIEWED | Revisión completa; nivel asignado |
| APPROVED | Aprobado (puede usarse para CompetencyResult final) |

## 8. CompetencyResult (conexión con PASO 23)

El CompetencyResult agrega las InterviewReview por competencia:

```
CompetencyResult {
  competencyId: string
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  supportingEvidence: string[]    // IDs de InterviewEvidence
  limitations: string[]
  conflicts: string[]
  reviewedBy: string               // humano
  version: string                  // CompetencyResult-v1
}
```

**No se agrega score global**. El CompetencyResult es evidencia por competencia, NO un agregado numérico.

## 9. No IA → CompetencyResult

> **Prohibido**: IA → CompetencyResult (sin revisión humana intermedia).

La cadena es siempre: Evidencia → Revisión humana → CompetencyResult. La IA puede asistir en la revisión (sugerir nivel, resumir), pero la asignación final es humana y la CompetencyResult requiere `reviewedBy` humano.

## 10. Conexión con gates

La revisión humana pasa INT-G8 (governance) — revisión humana documentada + append-only. Sin esta gobernanza, el CompetencyResult no es válido.
