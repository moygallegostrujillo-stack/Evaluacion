# A-06.3 — 17 · CompetencyResult (PASO 23)

## 1. Definición conceptual

```
CompetencyResult {
  resultId: string
  candidateId: string
  jobId: string                     // Position | Vacancy
  competencyId: string
  competencyVersion: string         // snapshot de la Competency versionada
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  supportingEvidence: string[]      // IDs de InterviewEvidence (STAR)
  limitations: string[]             // limitaciones detectadas
  conflicts: string[]               // IDs de ConflictRecord
  reviewedBy: string                // humano
  reviewedAt: timestamp
  approvedBy: string?               // humano (si APPROVED)
  approvedAt: timestamp?
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
  version: string                   // CompetencyResult-v1
  formulaVersion: string            // versión técnica del modelo de evidencia (COMP-EVID-v1)
}
```

## 2. Reglas

### 2.1 No score global

> **NO agregar score global**.

El CompetencyResult NO produce:
- Un número 0-100
- Un peso
- Un corte
- Un percentil
- Un APTO/NO_APTO

Produce una **etiqueta cualitativa** (evidenceLevel) + rationale.

### 2.2 No JobFit

> **CompetencyResult ≠ JobFit**.

JobFit **NO** existe (A-04.5/A-05.3 confirmado). El CompetencyResult NO se conecta automáticamente a JobFit. Si JobFit se diseña en el futuro, será una capa posterior que consume CompetencyResult + otros resultados, con su propia governance.

### 2.3 No overallScore

> El CompetencyResult **NO** alimenta `overallScore`.

El motor canónico de overallScore (A-04.5/A-05.3) opera con {PSY, KN} (BF e INT aisladas). Las competencias **no** participan en el overallScore. El CompetencyResult es evidencia **separada** para RR.HH.

### 2.4 No recommendation

> El CompetencyResult **NO** alimenta `recommendation` automáticamente.

`recommendation` (PERFIL_COMPLETO/PARCIAL/PENDIENTE) es guidance de completitud basada en presencia/ausencia de datos, NO en niveles de competencia. El CompetencyResult es evidencia complementaria que RR.HH. considera, pero no cambia el `recommendation` automáticamente.

## 3. Agregación (por competencia, no global)

Un candidato tiene **un CompetencyResult por competencia** evaluada en ese puesto. No se agregan en un "score global de competencias".

**Ejemplo**:
- COMP-SVC-001: SUPPORTED
- COMP-COL-001: LIMITED
- COMP-ORG-001: INSUFFICIENT
- COMP-TEC-002: STRONG

RR.HH. ve el perfil por competencia, no un promedio.

## 4. Evidencia de apoyo

`supportingEvidence` lista los IDs de `InterviewEvidence` (STAR capturados) que respaldan el nivel asignado. Esto permite trazabilidad:
- ¿Por qué SUPPORTED? → ver InterviewEvidence-001 (STAR con Action mapeando a 3 indicadores).
- ¿Por qué INSUFFICIENT? → ver InterviewEvidence-002 (respuesta vaga, sin Action).

## 5. Limitations y conflicts

- `limitations`: limitaciones de la evaluación (audio incompleto, candidato fatigado, entrevista recortada).
- `conflicts`: IDs de ConflictRecord (CV vs entrevista, etc.) que requieren resolución.

Si hay conflictos no resueltos → `status = PENDING_REVIEW`.

## 6. Revisión humana (conexión con PASO 22)

El CompetencyResult requiere `reviewedBy` humano. La cadena:
```
InterviewEvidence (STAR, inmutable)
    ↓
InterviewReview (interpretación humana, append-only)
    ↓
CompetencyResult (agregado por competencia, con reviewedBy)
```

**No**: IA → CompetencyResult (sin revisión humana intermedia).

## 7. Estado

| Estado | Significado |
|---|---|
| PENDING_REVIEW | Revisión pendiente (conflicto no resuelto, o requiere segundo reviewer) |
| REVIEWED | Revisión completa; nivel asignado |
| APPROVED | Aprobado; puede usarse para decisión de RR.HH. |

## 8. Uso por RR.HH.

El CompetencyResult es **evidencia para RR.HH.**, NO una decisión automática. RR.HH. lo usa junto con:
- overallScore (PSY + KN)
- KnowledgeResult (evidenceStatus)
- InterviewEvidence (STAR)
- Referencias documentales
- Su propio juicio profesional

La decisión final es humana (LFPDPPP Art. 37 Bis).

## 9. Conexión con gates

El CompetencyResult pasa INT-G8 (governance). Sin revisión humana documentada + trazabilidad, el CompetencyResult no es válido.
