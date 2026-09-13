# A-06.3 — 07 · Evidencia (PASO 8)

## 1. Niveles de evidencia

Se definen 5 niveles para una competencia evaluada en un candidato:

| Nivel | Significado | Cuándo se asigna |
|---|---|---|
| VALID | Evidencia clara, relevante, verificable; múltiples indicadores observados | El candidato dio ejemplos concretos con conductas observables que mapean a múltiples indicadores |
| LIMITED | Evidencia parcial; uno o dos indicadores; ejemplo parcial | El candidato dio un ejemplo pero vago, o solo cubrió parte de los indicadores |
| INSUFFICIENT | Evidencia presentada pero no aprovechable; vaga, irrelevante, o sin conducta observable | El candidato respondió pero sin conducta observable (opinión, generalidad) |
| PENDING_REVIEW | Conflicto entre fuentes de evidencia; requiere revisión | CV dice experiencia, entrevista no la demuestra — ver `10-conflicts.md` |
| INVALID | Evidencia obtenida de forma inválida (procedimiento incorrecto, sesgo documentado) | Entrevista mal conducida; guía no aprobada; error de procedimiento |

## 2. Separación de tipos de contenido

| Tipo de contenido | ¿Es evidencia conductual? | Nivel resultante |
|---|---|---|
| Conducta concreta (Action específica) | ✓ SÍ | LIMITED / SUPPORTED / STRONG |
| Afirmación genérica ("soy responsable") | ✗ NO | INSUFFICIENT |
| Opinión ("creo que el servicio es importante") | ✗ NO | INSUFFICIENT |
| Intención ("haría X si pasara Y") | ✗ NO (hipotético) | HYPOTHETICAL → LIMITED (ver `08-hypothetical.md`) |
| Supuesto ("probablemente el cliente quería X") | ✗ NO | INSUFFICIENT |
| Resultado externo ("aumentamos ventas 20%") | ✗ NO por sí solo | INSUFFICIENT sin Action; PENDING_REVIEW si contradice |

## 3. Regla: separar tipos

**No mezclar**: una respuesta que mezcla opinión + conducta se evalúa solo por la conducta. La opinión no cuenta como evidencia.

**Ejemplo**:
- Candidato: "Soy muy empático (opinión). Una vez un cliente estaba triste porque era su cumpleaños y le traje un postre gratis (conducta)."
- Evaluación: la opinión se ignora; la conducta (trajo postre gratis) mapea a indicador de servicio → LIMITED (un indicador, un ejemplo).

## 4. Estructura de captura

```
InterviewEvidence {
  evidenceId: string
  candidateId: string
  competencyId: string
  jobId: string
  questionId: string
  star: STAREvidence                 // Situation/Task/Action/Result
  indicatorsObserved: string[]       // IDs mapeados desde la Action
  indicatorsAbsent: string[]         // no cubiertos
  evidenceType: 'CONDUCTA' | 'AFIRMACION' | 'OPINION' | 'INTENCION' | 'SUPUESTO' | 'RESULTADO_EXTERNO'
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  collectedAt: timestamp
  collectedBy: string                // entrevistador
  rationale: string                  // justificación del nivel
}
```

## 5. Determinación del nivel (por evaluador humano)

El nivel lo asigna el entrevistador (o reviewer) con `rationale`:

| evidenceType | Nivel típico |
|---|---|
| CONDUCTA (Action específica, 1 indicador) | LIMITED |
| CONDUCTA (Action específica, múltiples indicadores, 1 ejemplo) | SUPPORTED |
| CONDUCTA (múltiples ejemplos, indicadores consistentes, Result verificable) | STRONG |
| AFIRMACION / OPINION / SUPUESTO | INSUFFICIENT |
| INTENCION (hipotético) | HYPOTHETICAL → LIMITED (ver `08-hypothetical.md`) |
| RESULTADO_EXTERNO sin Action | INSUFFICIENT |
| Sin respuesta | NO_EVIDENCE |

## 6. Regla: NO inferir

> **No inferir**: si el candidato no describe Action específica, no se asume que la hizo. Se asigna INSUFFICIENT, no se inventa conducta.

## 7. Regla: NO convertir en número

Los niveles son **cualitativos**. NO se convierten a 0-100. NO se promedian. NO se ponderan.

## 8. Verificación cruzada

La evidencia de la entrevista puede verificarse contra:
- **CV documental**: si contradice → PENDING_REVIEW (conflicto).
- **Referencia laboral**: si confirma → refuerza SUPPORTED/STRONG.
- **Knowledge canónico**: si el candidato describe conducta que requiere conocimiento (e.g. higiene alimentaria) y el Knowledge score es bajo → posible conflicto.

## 9. Conexión con CompetencyResult

La evidencia se agrega en el CompetencyResult:

```
CompetencyResult {
  competencyId: string
  evidence: InterviewEvidence[]
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  rationale: string
  conflicts: string[]
  reviewedBy: string?
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
}
```

El nivel agregado NO se promedia; se asigna por evaluador humano considerando todas las evidencias de esa competencia.
