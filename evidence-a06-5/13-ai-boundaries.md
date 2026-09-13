# A-06.5 — 13 · IA (PASO 13)

## 1. Regla

> Toda intervención IA: `AI_GENERATED` + `HUMAN_REVIEWED`.

## 2. Permitido

| Función | Descripción | Origen |
|---|---|---|
| Preparar borradores | Generar borrador de pregunta BDI a partir de competencia + indicador + puesto | `AI_DRAFT_ORIGIN`, DRAFT |
| Adaptar lenguaje | Ajustar el texto de la pregunta al contexto del puesto/sector | `AI_DRAFT_ORIGIN`, DRAFT |
| Sugerir probe aprobado | Recomendar un probe del banco aprobado basado en respuesta parcial | `AI_DRAFT_ORIGIN` (sugerencia); el humano decide |
| Resumir respuesta | Sintetizar la respuesta del candidato en formato STAR | `AI_DRAFT_ORIGIN`; el humano verifica contra original |
| Señalar falta de información | Detectar que falta Action específica o Result | `AI_DRAFT_ORIGIN`; alerta al humano |

## 3. Prohibido

| Función | Por qué |
|---|---|
| Crear nueva evidencia | La IA no puede inventar conducta que el candidato no describió |
| Inventar hechos | La IA no puede fabricar eventos o resultados |
| Modificar pregunta aprobada | La pregunta APPROVED es inmutable; cambios = nueva versión |
| Decidir CompetencyResult | Asignación humana obligatoria (evidenceLevel + rationale) |
| Decidir contradicciones | Resolución de conflictos es humana (PENDING_REVIEW) |
| Decidir contratación | Decisión humana de RR.HH. (LFPDPPP/LFT Art 37 Bis) |
| Inferir atributos protegidos | Discriminación (LFT Art 3; A-06.4 `08-ai-boundaries.md`) |
| Inferir personalidad/integridad | No autorizado; Personality retirada; Integrity aislada |
| Improvisar probes fuera del banco | Solo probes aprobados |

## 4. Modelo de proveniencia IA

```
{
  origin: 'AI_DRAFT_ORIGIN' | 'AI_SUGGESTED' | 'RH_MANUAL' | 'SYSTEM'
  aiModel?: string
  aiPromptHash?: string
  aiGeneratedAt?: timestamp
  humanReviewedBy?: string
  humanReviewedAt?: timestamp
  humanApprovedBy?: string
  humanApprovedAt?: timestamp
}
```

`origin` es **permanente**: un artefacto `AI_DRAFT_ORIGIN` nunca pierde esa marca, incluso tras aprobación humana.

## 5. IA en tiempo real

| Tipo | ¿Permitido? | Ejemplo |
|---|---|---|
| AI assistance (sugerir probe, resumir) | ✓ SÍ con supervisión | IA sugiere PROBE-UNI-001 cuando detecta respuesta vaga |
| AI decision (asignar nivel) | ✗ NO | IA no puede asignar SUPPORTED sin verificación humana |

## 6. Riesgo: IA como autoridad

Si la IA sugiere un nivel y el humano lo acepta ciegamente:
- **Riesgo**: IA se convierte en autoridad de facto.
- **Mitigación**:
  - Asignación de nivel requiere `rationale` textual del humano.
  - IA NO asigna `evidenceLevel` directamente; solo sugiere.
  - Advertencia visible: "Sugerencia de IA — requiere verificación humana".
  - Auditoría periódica.

## 7. Regla: si riesgo de IA-autoridad → PROHIBIDO

> Si existe riesgo de que la IA se convierta en autoridad, marcar como **PROHIBIDO**.

Una función que asigne automáticamente `evidenceLevel` sin intervención humana = PROHIBIDO.

## 8. Conexión con gates

La gobernanza de IA pasa INTERVIEW-G8 (human review) + LEGAL-G6 (IA de A-06.4). Sin revisión humana documentada, ningún artefacto IA puede estar ACTIVE.
