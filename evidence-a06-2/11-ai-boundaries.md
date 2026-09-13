# A-06.2 — 11 · IA Boundaries (PASO 17)

## 1. Regla

La IA **asiste** pero **no decide**. Toda salida de IA: `AI_DRAFT_ORIGIN` + `human reviewed`.

## 2. Lo que la IA PUEDE hacer

| Función | Descripción | Origen |
|---|---|---|
| Sugerir competencia candidata | A partir del análisis de puesto (descripción, tareas) | `AI_SUGGESTED`, status=DRAFT |
| Proponer borrador de indicador | A partir de la definición de la competencia | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Sugerir lenguaje alternativo | Parafrasear indicadores para claridad o adaptación cultural | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Sugerir probes de profundización | Basados en respuestas parciales del candidato | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Resumir respuestas | Sintetizar la respuesta del candidato en formato estructurado | `AI_DRAFT_ORIGIN`, status=DRAFT |
| Sugerir criticality inicial | Basada en análisis de puesto (no vinculante) | `AI_SUGGESTED`, status=DRAFT |

Todas las salidas requieren revisión humana antes de pasar a REVIEW/APPROVED.

## 3. Lo que la IA NO puede hacer

| Acción | Por qué NO |
|---|---|
| Aprobar competencia | La aprobación es humana (governance) |
| Aprobar indicador | La validación CI-VAL-1..8 es humana |
| Decidir criticality | CRITICAL/IMPORTANT/STANDARD lo asigna humano con justification + source + approver |
| Declarar jobRelevance | VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW lo asigna humano con jobElement + rationale |
| Generar evidencia | La IA genera texto, no observación; la evidencia proviene del candidato en la entrevista |
| Clasificar definitivamente competencia | El nivel de evidencia lo asigna el entrevistador humano |
| Decidir contratación | La decisión final es de RR.HH. con revisión humana (LFPDPPP Art. 37 Bis) |
| Establecer pesos o cortes | Prohibido por regla A-06.1/A-06.2 (no scoring) |

## 4. Modelo de proveniencia IA (reiteración A-06.1)

```
{
  origin: 'AI_DRAFT_ORIGIN' | 'AI_SUGGESTED' | 'RH_MANUAL' | 'SYSTEM'
  aiModel?: string          // identificador del modelo
  aiPromptHash?: string     // hash del prompt (trazabilidad)
  aiGeneratedAt?: timestamp
  humanReviewedBy?: string
  humanReviewedAt?: timestamp
  humanApprovedBy?: string
  humanApprovedAt?: timestamp
}
```

`origin` es **permanente**: un artefacto `AI_DRAFT_ORIGIN` nunca pierde esa marca, incluso tras aprobación humana.

## 5. Ciclo IA → humano

```
IA genera borrador (origin=AI_DRAFT_ORIGIN, status=DRAFT)
        ↓
Humano revisa (reviewedBy set, status=REVIEW)
        ↓
Humano aprueba (approvedBy set, status=APPROVED)
        ↓
SYSTEM publica (status=ACTIVE)
```

La IA nunca cruza de DRAFT a REVIEW por sí sola. Nunca a APPROVED ni ACTIVE.

## 6. Regla de transparencia

Cualquier salida de IA mostrada a RR.HH. debe estar marcada:
> "Contenido generado por IA — requiere revisión humana."

Los artefactos `AI_DRAFT_ORIGIN` nunca se presentan como producto final sin revisión.

## 7. Límites de capacidad de la IA

- No observa conducta (solo procesa texto).
- Alucinaciones posibles (indicadores plausibles pero sin base).
- Sesgo de entrenamiento.
- No validación psicométrica.
- No juicio experto.

## 8. Conexión con gates

La gobernanza de IA pasa COMP-G6 (human review gate). Sin revisión humana documentada, ningún artefacto IA puede estar ACTIVE.
