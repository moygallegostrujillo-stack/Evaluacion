# A-06.5 — 09 · Rúbrica Cualitativa (PASO 10)

## 1. Niveles

| Nivel | Significado | Criterio |
|---|---|---|
| NO_EVIDENCE | No se observó ningún indicador | El candidato no aportó ejemplo o no respondió |
| INSUFFICIENT | Evidencia presentada pero no aprovechable | Respuesta vaga, opinión, hipotética sin pasado, o sin Action específica |
| LIMITED | Evidencia parcial; uno o dos indicadores | Ejemplo con Action parcial, o hipotético con juicio razonable |
| SUPPORTED | Múltiples indicadores observados en un ejemplo claro y relevante | Action específica mapeando a 3+ indicadores; Result verificable |
| STRONG | Indicadores observados en múltiples ejemplos, con Results verificables | 2+ ejemplos claros, indicadores consistentes, Results verificables (referencia/documento) |

## 2. Asignación humana

> La asignación será **humana**. Debe existir `rationale`. La IA **nunca** determina el estado final.

- El entrevistador o reviewer asigna el nivel con `rationale` textual.
- La IA puede sugerir ("basado en la respuesta, parece SUPPORTED"), pero la asignación final es humana.
- Sin `rationale`, la asignación no es válida.

## 3. Estructura

```
Rubric {
  rubricId: string              // e.g. "RUBRIC-MESERO-SVC-v1"
  competencyId: string          // FK a Competency
  jobId: string                 // FK al puesto
  version: string               // e.g. "Rubric-v1"
  levels: {
    NO_EVIDENCE: { criterion: string, description: string }
    INSUFFICIENT: { criterion: string, description: string }
    LIMITED: { criterion: string, description: string }
    SUPPORTED: { criterion: string, description: string }
    STRONG: { criterion: string, description: string }
  }
  indicatorsCovered: string[]   // IDs de indicadores que evalúa
  status: DRAFT | REVIEW | APPROVED | ACTIVE | RETIRED
  approvedBy: string?
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
> | NO_EVIDENCE | El candidato no aporta ningún ejemplo | No responde, o "nunca tuve clientes difíciles" (en mesero con experiencia) |
> | INSUFFICIENT | Afirmación general u opinión sin Action | "Siempre trato bien a los clientes" |
> | LIMITED | Ejemplo con Action parcial mapeando a 1-2 indicadores | Describe una situación pero la Action es breve o cubre solo 1 indicador |
> | SUPPORTED | Action específica mapeando a 3+ indicadores, con Result verificable | Situation + Task + Action (escuchó, identificó, explicó, mantuvo calma) + Result (cliente satisfecho, propina) |
> | STRONG | 2+ ejemplos claros, indicadores consistentes, Results verificables | Múltiples ejemplos distintos, cada uno con Action mapeable, con Results verificables (referencia) |

## 5. Reglas

1. **Una rúbrica por (competencyId, jobId)**: no genérica.
2. **Asignación humana con `rationale`**: sin `rationale`, no válida.
3. **No numérica**: los niveles NO se convierten a 0-100. No se promedian. No se ponderan.
4. **No automática**: la IA sugiere; el humano asigna.
5. **Append-only**: una vez asignado, no se borra; correcciones = nueva versión de InterviewReview.
6. **Inmutable lo publicado**: una rúbrica APPROVED no se modifica; cambios = nueva versión.

## 6. Validación

Antes de APPROVED, la rúbrica debe:
- Ser revisada por un profesional de RR.HH.
- Ser probada en pilotaje (INTERVIEW-G9): dos evaluadores asignan niveles a las mismas respuestas; se mide consistencia.
- Pasar auditoría de sesgo (INTERVIEW-G6) y legal (INTERVIEW-G7).

## 7. Conexión con gates

La rúbrica pasa INTERVIEW-G4 (question quality, incluye rúbrica). Sin rúbrica aprobada + pilotada, la entrevista no es productiva.
