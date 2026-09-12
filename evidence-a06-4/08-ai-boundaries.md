# A-06.4 — 08 · IA en Entrevista (PASO 8)

## 1. Funciones PERMITIDAS

| Función | Descripción | Origen | Revisión humana |
|---|---|---|---|
| Adaptar lenguaje | Ajustar el texto de la pregunta al contexto del puesto/sector | `AI_DRAFT_ORIGIN`, DRAFT | Revisar antes de ACTIVE |
| Sugerir probes | Basados en respuestas parciales del candidato | `AI_DRAFT_ORIGIN`, DRAFT | Entrevistador decide usar |
| Transcribir | Convertir audio/texto a formato estructurado | `AI_DRAFT_ORIGIN` | Revisar contra original |
| Resumir respuesta | Sintetizar en formato STAR | `AI_DRAFT_ORIGIN` | Revisar contra original |
| Señalar información faltante | Detectar que falta Action específica o Result | `AI_DRAFT_ORIGIN` | Entrevistador decide usar probe |
| Organizar evidencia previamente expresada | Reagrupar lo que el candidato ya dijo | `AI_DRAFT_ORIGIN` | Revisar |

## 2. Funciones NO PERMITIDAS

| Función | Por qué prohibida |
|---|---|
| Inferir características protegidas | Discriminación (LFT Art 3; LFPEPD) |
| Inferir personalidad | La entrevista mide conducta, no rasgo latente; personalidad retirada de V1 (A-05.3) |
| Inferir honestidad | Integridad aislada del overallScore (A-04.5); no se infiere de entrevista |
| Inventar evidencia | La IA no puede crear conducta que el candidato no describió |
| Decidir competencia | Asignación humana obligatoria |
| Decidir criticidad | `criticality` lo asigna humano (A-06.2) |
| Decidir contratación | Decisión humana (RR.HH.) |
| Generar puntuación jurídica o psicológica no autorizada | Prohibido; no scoring en V1 |

## 3. Regla: AI_GENERATED + HUMAN_REVIEWED

Toda salida de IA lleva:
- `origin: 'AI_DRAFT_ORIGIN'` (permanente, no se pierde).
- `humanReviewedBy` (humano que revisó).
- `humanApprovedBy` (humano que aprobó, si aplica).

La IA nunca cruza a APPROVED ni ACTIVE por sí sola.

## 4. IA en tiempo real (asistencia vs decisión)

| Tipo | ¿Permitido? | Ejemplo |
|---|---|---|
| AI assistance (sugerir probe, transcribir) | ✓ SÍ con supervisión | IA sugiere "¿Qué hiciste tú específicamente?" cuando detecta respuesta vaga |
| AI decision (asignar nivel) | ✗ NO | IA no puede asignar SUPPORTED sin verificación humana |

## 5. Riesgo: IA como autoridad

Si la IA sugiere un nivel y el humano lo acepta ciegamente:
- **Riesgo**: IA se convierte en autoridad de facto.
- **Mitigación**:
  - Asignación de nivel requiere `rationale` textual del humano (no solo aceptar sugerencia).
  - IA NO asigna `evidenceLevel` directamente; solo sugiere.
  - Advertencia visible: "Sugerencia de IA — requiere verificación humana".
  - Auditoría periódica (comparar IA sugerencia vs humano final).

## 6. Regla: si riesgo de IA-autoridad → PROHIBIDO

> Si existe riesgo de que la IA se convierta en autoridad, marcar como **PROHIBIDO**.

Una función que asigne automáticamente `evidenceLevel` sin intervención humana = PROHIBIDO.

## 7. Prohibición de inferencia de atributos protegidos

La IA **NO** puede inferir:
- Edad (por voz, por contenido, por estilo).
- Género (por voz, por nombre, por contenido).
- Embarazo (por contenido).
- Religión (por contenido).
- Orientación sexual (por contenido).
- Discapacidad (por contenido).
- Origen (por acento, por contenido).

Estas inferencias son discriminatorias y están prohibidas por LFT Art 3 + LFPEPD.

## 8. Prohibición de inferencia psicológica

La IA **NO** puede inferir:
- Rasgos de personalidad (Big Five).
- Honestidad / integridad.
- Salud mental.
- Aptitud cognitiva.

Estas inferencias no están autorizadas (Personality retirada A-05.3; Integrity aislada A-04.5; no scoring en V1).

## 9. Trazabilidad de IA

Todo uso de IA en la entrevista se registra:

```
{
  aiUsedFor: 'TRANSCRIPTION' | 'SUMMARY' | 'PROBE_SUGGESTION' | 'LANGUAGE_ADAPTATION' | 'MISSING_INFO_DETECTION'
  aiModel: string
  aiPromptHash: string
  aiGeneratedAt: timestamp
  humanReviewedBy: string
  humanReviewedAt: timestamp
}
```

## 10. Conexión con gates

La gobernanza de IA pasa LEGAL-G6 (IA). Sin revisión humana documentada + prohibición de inferencias, la entrevista no se activa.
