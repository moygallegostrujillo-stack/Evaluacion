# A-06.3 — 11 · Rúbrica (PASO 14)

## 1. Regla

> **NO crear puntos. NO crear 1–5. NO crear 0–100.**

La rúbrica utiliza **categorías cualitativas**.

## 2. Categorías cualitativas

| Nivel | Significado | Criterio |
|---|---|---|
| NO_EVIDENCE | No se observó ningún indicador | El candidato no pudo aportar ejemplo o no respondió |
| INSUFFICIENT | Evidencia presentada pero no aprovechable | Respuesta vaga, opinión, hipotética sin pasado, o sin Action específica |
| LIMITED | Evidencia parcial; uno o dos indicadores | Ejemplo con Action parcial, o hipotético con juicio razonable |
| SUPPORTED | Múltiples indicadores observados en un ejemplo claro y relevante | Action específica que mapea a múltiples indicadores; Result verificable |
| STRONG | Indicadores observados en múltiples ejemplos, con resultados verificables | Múltiples ejemplos claros, indicadores consistentes, Results verificables |

## 3. Estructura de la rúbrica

```
Rubric {
  rubricId: string
  competencyId: string          // FK a Competency
  jobId: string                 // FK al puesto
  levels: {
    NO_EVIDENCE: { criterion: string, description: string }
    INSUFFICIENT: { criterion: string, description: string }
    LIMITED: { criterion: string, description: string }
    SUPPORTED: { criterion: string, description: string }
    STRONG: { criterion: string, description: string }
  }
  indicatorsCovered: string[]   // IDs de indicadores que esta rúbrica evalúa
  status: DRAFT | REVIEW | APPROVED | ACTIVE | RETIRED
  approvedBy: string?           // humano
  version: string               // Rubric-v1
}
```

## 4. Ejemplo de rúbrica — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> **Competencia**: COMP-SVC-001 Servicio al cliente
> **Puesto**: MESERO
>
> | Nivel | Criterio | Descripción |
> |---|---|---|
> | NO_EVIDENCE | El candidato no aporta ningún ejemplo de atención al cliente | No responde, o dice "nunca tuve clientes" (en mesero con experiencia, sospechoso) |
> | INSUFFICIENT | El candidato responde con afirmación general u opinión, sin Action específica | "Siempre trato bien a los clientes" — sin Situation/Task/Action/Result |
> | LIMITED | El candidato aporta un ejemplo con Action parcial que mapea a 1–2 indicadores | Describe una situación pero la Action es breve o cubre solo 1 indicador (e.g. solo "me disculpé") |
> | SUPPORTED | El candidato aporta un ejemplo claro con Action que mapea a múltiples indicadores (3+), con Result verificable | Situation + Task + Action específica (escuchó, identificó, explicó, mantuvo calma) + Result (cliente satisfecho, propina, sin reclamo) |
> | STRONG | El candidato aporta múltiples ejemplos (2+) con indicadores consistentes y Results verificables | 2+ ejemplos distintos, cada uno con Action mapeable a múltiples indicadores, con Results verificables (referencia, documentación) |

## 5. Reglas de uso

1. **Una rúbrica por competencia-puesto**: la rúbrica es específica al (competencyId, jobId) — no genérica.
2. **Asignación humana**: el nivel lo asigna el entrevistador o reviewer con `rationale` textual.
3. **No numérica**: los niveles NO se convierten a números. NO se promedian. NO se ponderan.
4. **No automática**: la IA puede sugerir ("basado en la respuesta, parece SUPPORTED"), pero la asignación es humana.
5. **Append-only**: una vez asignado, el nivel no se borra; si se corrige, se registra una nueva revisión (InterviewReview, ver `16-human-review.md`).

## 6. Validación de la rúbrica

Antes de APPROVED, la rúbrica debe:
- Ser revisada por un profesional de RR.HH.
- Ser probada en pilotaje (INT-G9): dos evaluadores asignan niveles a las mismas respuestas; se mide consistencia.
- Pasar revisión de sesgo (INT-G6) y legal (INT-G7).

## 7. Conexión con niveles de evidencia

La rúbrica es el **instrumento** que traduce la evidencia capturada (STAR) en un nivel cualitativo. Es la conexión entre:
- `InterviewEvidence` (con STAR + indicatorsObserved)
- `CompetencyResult.evidenceLevel` (NO_EVIDENCE..STRONG)

## 8. No scoring

> **No scoring**: la rúbrica NO produce un número. Produce una etiqueta cualitativa + rationale.

No hay:
- Score 0-100
- Peso por competencia
- Corte (e.g. "≥70 = APTO")
- Percentil
- APTO/NO_APTO derivado automáticamente

## 9. Conexión con gates

La rúbrica pasa INT-G5 (rubric gate). Sin rúbrica aprobada + pilotada, la entrevista no es productiva.
