# A-06.1 — AI Boundaries (PASO 8, 10)

## 1. Regla

La IA **asiste** pero **no decide**. Toda salida de IA debe tener: `AI-generated` + `human reviewed`.

## 2. Lo que la IA PUEDE hacer

| Función | Descripción | Estado |
|---|---|---|
| Generar borradores de preguntas | Sugerir preguntas conductuales (STAR) a partir de la competencia + indicadores | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Sugerir probes | Preguntas de profundización basadas en respuestas parciales del candidato | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Resumir respuestas | Sintetizar la respuesta del candidato en formato estructurado (indicators observed) | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Adaptar lenguaje | Ajustar la guía al contexto del puesto/sector | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Sugerir indicadores conductuales | Proponer indicadores observables a partir de la definición de competencia | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Sugerir competencias para un puesto | Basadas en análisis de puesto (descripción, sector) | `AI_SUGGESTED`, status=DRAFT |

Todas las salidas de IA se registran con `source = AI_DRAFT_ORIGIN` (o `AI_SUGGESTED`) y `status = DRAFT`. Requieren revisión humana para pasar a APPROVED.

## 3. Lo que la IA NO puede hacer

| Acción | Por qué NO |
|---|---|
| Determinar que un candidato posee una competencia | La competencia se infiere de evidencia conductual observada por un humano; la IA no observa conducta |
| Crear evidencia | La IA genera texto, no observaciones; la evidencia proviene del candidato en la entrevista |
| Aprobar criterio | La aprobación de una competencia/indicador/guía como productiva es humana (governance) |
| Decidir nivel de evidencia | NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG lo asigna el entrevistador humano |
| Decidir contratación | La decisión final es de RR.HH. con revisión humana (LFPDPPP Art. 37 Bis) |
| Establecer baremos | Los baremos requieren estudio psicométrico humano |
| Validar un instrumento | La validez es un juicio científico humano |
| Crear pesos o cortes | Prohibido por regla A-06.1 (no scoring) |

## 4. Modelo de proveniencia IA

Todo artefacto generado o sugerido por IA lleva:

```
{
  origin: 'AI_DRAFT_ORIGIN' | 'AI_SUGGESTED' | 'RH_MANUAL' | 'SYSTEM'
  aiModel?: string          // identificador del modelo usado (e.g. "glm-4.6")
  aiPromptHash?: string     // hash del prompt (para trazabilidad)
  aiGeneratedAt?: timestamp
  humanReviewedBy?: string  // humano que revisó
  humanReviewedAt?: timestamp
  humanApprovedBy?: string  // humano que aprobó (si aplica)
  humanApprovedAt?: timestamp
}
```

El campo `origin` es **permanente**: un artefacto `AI_DRAFT_ORIGIN` nunca pierde esa marca, incluso después de aprobación humana. Esto garantiza trazabilidad.

## 5. Ciclo de revisión IA → humano

```
IA genera borrador (origin=AI_DRAFT_ORIGIN, status=DRAFT)
        ↓
Humano revisa (reviewedBy set, status=REVIEW)
        ↓
Humano aprueba (approvedBy set, status=APPROVED)
        ↓
SYSTEM publica (status=ACTIVE)
```

- La IA nunca cruza de DRAFT a REVIEW por sí sola.
- La IA nunca cruza a APPROVED ni ACTIVE.
- El `approvedBy` siempre es un humano identificado.

## 6. Límites de capacidad de la IA

La IA (incluso modelos avanzados) tiene limitaciones conocidas:
- **No observa conducta**: solo procesa texto. No puede presenciar la entrevista.
- **Alucinaciones**: puede generar indicadores plausibles pero no basados en evidencia.
- **Sesgo de entrenamiento**: puede reproducir sesgos del corpus de entrenamiento.
- **No validación**: la IA no puede validar psicométricamente un instrumento.
- **No juicio experto**: la aprobación de una competencia requiere juicio experto humano.

## 7. Regla de transparencia

Cualquier salida de IA mostrada a RR.HH. o al candidato debe estar marcada explícitamente como:
> "Contenido generado por IA — requiere revisión humana."

Los artefactos `AI_DRAFT_ORIGIN` nunca se presentan como producto final sin revisión.

## 8. Conexión con gates

La gobernanza de IA pasa COMP-G6 (human review gate). Sin revisión humana documentada, ningún artefacto IA puede estar ACTIVE.
