# A-06.1 — Structured Interview (PASO 7)

## 1. Regla

> **ENTREVISTA ≠ prueba psicométrica.**

La entrevista genera **evidencia contextual**, no un score psicométrico. No se convierte automáticamente una entrevista en un número.

## 2. Papel de la entrevista estructurada en EvaluHR

La entrevista estructurada es la **fuente principal de evidencia de competencias** en V1 (modelo recomendado, ver PASO 17). Es el método con mejor balance: validez predictiva establecida + costo razonable + flexibilidad por puesto + evidencia conductual.

## 3. Estructura de una entrevista estructurada

### 3.1 Guía de entrevista (por competencia)

```
InterviewGuide {
  guideId: string
  jobId: string                 // FK al puesto
  competencyId: string          // FK a la competencia
  competencyVersion: string
  questions: InterviewQuestion[]
  probes: string[]              // preguntas de profundización
  scoringRubric: string         // rúbrica cualitativa (NO numérica)
  status: DRAFT | REVIEW | APPROVED | ACTIVE
  approvedBy: string?           // humano
}

InterviewQuestion {
  questionId: string
  text: string                  // pregunta conductual (STAR)
  type: 'BEHAVIORAL_PAST' | 'SITUATIONAL' | 'JOB_KNOWLEDGE'
  indicatorsTargeted: string[]  // behavioralIndicator IDs
  status: DRAFT | APPROVED
}
```

### 3.2 Tipos de preguntas (basado en Hartwell 2019)

| Tipo | Ejemplo | Validez |
|---|---|---|
| BEHAVIORAL_PAST | "Cuéntame de una vez en que tuviste que lidiar con un cliente enojado. ¿Qué hiciste?" | ALTA (Huffcutt 2003: BD > situational) |
| SITUATIONAL | "Imagina que un cliente reclama que su comida está fría. ¿Qué harías?" | MEDIA (útil para entry-level) |
| JOB_KNOWLEDGE | "¿Cuál es la temperatura adecuada para servir vino tinto?" | MEDIA (cubierto por Knowledge canónico) |

La guía prioriza BEHAVIORAL_PAST (técnica STAR): Situation, Task, Action, Result.

## 4. Régimen de evaluación (NO scoring)

La entrevista **NO** produce un número 0-100. Produce:

```
InterviewEvidence {
  competencyId: string
  jobId: string
  candidateId: string
  interviewerId: string          // humano
  interviewDate: timestamp
  indicatorsObserved: { indicatorId, evidenceText }[]  // conductas observadas
  indicatorsAbsent: string[]    // indicadores no observados
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceLevelRationale: string  // justificación del nivel
  conflicts: string[]           // conflictos detectados
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
  reviewedBy: string?
}
```

### 4.1 Niveles de evidencia (PASO 11)

| Nivel | Significado |
|---|---|
| NO_EVIDENCE | No se observó ningún indicador; el candidato no pudo aportar ejemplo |
| INSUFFICIENT | Ejemplo aportado pero vago, sin conducta observable, o irrelevante |
| LIMITED | Uno o dos indicadores observados; ejemplo parcial |
| SUPPORTED | Múltiples indicadores observados en un ejemplo claro y relevante |
| STRONG | Indicadores observados en múltiples ejemplos, con resultados verificables |

**Estos niveles NO se convierten en número**. Son etiquetas cualitativas que el evaluador humano asigna con justificación textual.

### 4.2 Régimen — NO scoring

- No hay 0-100.
- No hay pesos.
- No hay cortes.
- No hay APTO/NO_APTO derivado automáticamente.
- El nivel es guía para RR.HH., que toma la decisión final con revisión humana (LFPDPPP Art. 37 Bis).

## 5. Consistencia inter-evaluador

Riesgo: dos entrevistadores pueden asignar niveles distintos al mismo candidato. Mitigaciones:
- **Guía estructurada**: mismas preguntas a todos los candidatos.
- **Rúbrica de indicadores**: el nivel se asigna según indicadores observados, no impresión global.
- **Entrenamiento de entrevistadores**: antes de evaluaciones productivas (COMP-G9 pilot).
- **Calibración periódica**: sesiones de revisión entre evaluadores.

## 6. La IA en la entrevista (PASO 8)

La IA puede:
- **generar borradores** de preguntas conductuales (STAR) a partir de la competencia + indicadores;
- **sugerir probes** (preguntas de profundización) basados en respuestas parciales;
- **resumir** las respuestas del candidato en un formato estructurado;
- **adaptar** el lenguaje de la guía al contexto del puesto.

La IA **NO** puede:
- **determinar** el nivel de evidencia (eso lo hace el entrevistador humano);
- **decidir** que el candidato posee la competencia;
- **aprobar** la guía como productiva;
- **decidir** contratación.

Toda pregunta generada por IA = `AI_DRAFT_ORIGIN` + `status = DRAFT` hasta aprobación humana.

## 7. Entrevista vs prueba psicométrica

| Aspecto | Prueba psicométrica | Entrevista estructurada |
|---|---|---|
| Qué produce | Score 0-100 | Evidencia contextual |
| Estandarización | Alta (mismos ítems) | Media (mismas preguntas, respuestas abiertas) |
| Validez | Según instrumento | ESTABLISHED (meta Huffcutt) |
| Costo | Bajo una vez desarrollado | Medio (entrenamiento + tiempo) |
| Faking | Medio-Alto (face-valid) | Bajo-Medio (pasado verificable) |
| Sesgo | Bajo (auto-administrada) | Medio (entrevistador) |
| Decision automática | NO (guidance only) | NO (guidance + revisión humana) |

## 8. Conclusión PASO 7

La entrevista estructurada es la fuente principal de evidencia de competencias en V1. Produce evidencia contextual con niveles cualitativos (NO scoring). Requiere guía versionada, rúbrica de indicadores, entrenamiento de entrevistadores, y revisión humana. La IA asiste (borradores, probes, resúmenes) pero no decide.
