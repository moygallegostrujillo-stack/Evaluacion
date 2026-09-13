# A-06.1 — Evidence Model (PASO 9, 11)

## 1. Niveles de evidencia (PASO 9)

Se definen 5 niveles de evidencia para una competencia evaluada en un candidato:

| Nivel | Significado | Cuándo se asigna |
|---|---|---|
| VALID | Evidencia clara, relevante, verificable; múltiples indicadores observados | El candidato dio ejemplos concretos con conductas observables que mapean a múltiples indicadores de la competencia |
| LIMITED | Evidencia parcial; uno o dos indicadores; ejemplo parcial | El candidato dio un ejemplo pero vago, o solo cubrió parte de los indicadores |
| INSUFFICIENT | Evidencia presentada pero no aprovechable; vaga, irrelevante, o sin conducta observable | El candidato respondió pero sin conducta observable (opinión, generalidad) |
| PENDING_REVIEW | Conflicto entre fuentes de evidencia; requiere revisión | CV dice experiencia, entrevista no la demuestra — ver `conflict-rules.md` |
| INVALID | Evidencia obtenida de forma inválida (procedimiento incorrecto, sesgo documentado) | Entrevista mal conducida; guía no aprobada; error de procedimiento |

## 2. Aplicación a competencias

El nivel de evidencia se asigna **por competencia** y **por candidato**, no como un score global. Un candidato puede tener:
- Servicio al cliente: SUPPORTED
- Trabajo en equipo: LIMITED
- Liderazgo: NO_EVIDENCE

Cada nivel tiene su `rationale` textual justificando la asignación.

## 3. Niveles de competencia (PASO 11)

Conceptualmente (NO como scoring 0-100):

| Nivel de competencia | Significado | Justificación metodológica |
|---|---|---|
| NO_EVIDENCE | No se observó ningún indicador | El candidato no pudo aportar ejemplo o no respondió |
| INSUFFICIENT | Ejemplo aportado pero sin conducta observable | Respuesta vaga, irrelevante, o puramente opinativa |
| LIMITED | Uno o dos indicadores observados en un ejemplo parcial | Evidencia presente pero no robusta |
| SUPPORTED | Múltiples indicadores observados en un ejemplo claro y relevante | Evidencia sólida en un contexto |
| STRONG | Indicadores observados en múltiples ejemplos, con resultados verificables | Evidencia robusta y consistente |

## 4. Reglas metodológicas

1. **No se promedian niveles**: si hay conflicto (CV dice X, entrevista dice Y), NO se promedian; se asigna PENDING_REVIEW.
2. **No se convierte a número**: los niveles son etiquetas cualitativas, NO 0-100.
3. **No hay pesos**: las competencias no se ponderan entre sí.
4. **No hay cortes**: no existe umbral "APTO" derivado automáticamente.
5. **Revisión humana**: el nivel lo asigna el entrevistador humano con justificación textual.

## 5. CompetencyResult (PASO 12)

```
CompetencyResult {
  resultId: string
  candidateId: string
  jobId: string                 // Position | Vacancy
  competencyId: string
  competencyVersion: string
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  rationale: string             // justificación textual del nivel
  indicatorsObserved: { indicatorId, evidenceText }[]
  indicatorsAbsent: string[]
  conflicts: string[]           // IDs de conflictos (ver conflict-rules.md)
  interviewerId: string         // humano que evaluó
  interviewDate: timestamp
  reviewedBy: string?
  reviewedAt: timestamp?
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
  formulaVersion: string        // versión técnica del modelo de evidencia (COMP-EVID-v1)
}
```

## 6. CompetencyResult ≠ JobFit

**Regla explícita**: `CompetencyResult` **NO** se conecta automáticamente a `JobFit`. Una competencia produce evidencia sobre esa competencia. La decisión de contratación es humana.

- CompetencyResult: evidencia contextual por competencia.
- JobFit: NO IMPLEMENTADO (A-04.5/A-05.3 confirmado).
- overallScore: NO incorpora competencias (A-04.5 engine: BIG_FIVE/PSY/KN/INT; competencias no participan).
- recommendation: NO derivada de competencias.

## 7. Agregación (futura)

Si en una fase futura se desea agregar competencias (con governance propia), sería un ente separado:

```
CompetencyAggregate (futuro, no V1) {
  candidateId: string
  jobId: string
  competencies: CompetencyResult[]
  aggregateMethod: string      // e.g. 'MAJORITY_SUPPORTED'
  aggregateLevel: string       // NO número
  formulaVersion: string
}
```

Esto **NO** se implementa en V1. JobFit, si se diseña, es una capa posterior que consume CompetencyResult + otros resultados, con su propia governance.
