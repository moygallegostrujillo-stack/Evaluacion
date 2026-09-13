# A-03.3 — PASO 5/9/10 · ASSESSMENT VERSIONING + SNAPSHOT + RESULTADO

## PASO 5 — KnowledgeAssessment (versión congelada)

### Schema (prisma/schema.prisma)

| Campo encargo | Columna | Notas |
|---|---|---|
| assessmentId | `id` | cuid |
| jobId | `positionId` | FK → Position |
| blueprintId | `blueprintId` | FK → KnowledgeBlueprint |
| assessmentVersion | `assessmentVersion` | `KA-vN` — **inmutable tras publicación**; `@@unique([positionId, assessmentVersion])` |
| scoringVersion | `scoringVersion` | `KNOWLEDGE-SCORING-1.0` (heredado de A-03.2, no se redefine) |
| status | `status` | DRAFT, APPROVED, ACTIVE, SUSPENDED, RETIRED |
| publishedAt | `publishedAt` | DateTime? |
| publishedBy | `publishedBy` | actor humano de gobernanza (IA jamás — PASO 14) |
| (tenant) | `companyId` | FK → Company |

- La evaluación administrada al candidato queda congelada a esta fila: los
  cambios posteriores del banco ⇒ NUEVA fila `KA-v(N+1)`; la publicada jamás
  se edita.
- El generador publica `KA-v1` tras superar las compuertas KPUB-KA-1..6
  (`canPublishKnowledgeAssessment`); falla explícitamente si algo no cumple
  (`KNOWLEDGE_ASSESSMENT_PUBLISH_BLOCKED`) — y de hecho detectó RC-A03.3-11
  durante esta fase.

## PASO 9 — Snapshot de administración

### Schema

`KnowledgeAdministrationSnapshot` (1:1 con `EvaluationSession`,
`@@unique([sessionId])`):

| Campo | Contenido |
|---|---|
| `sessionId` / `candidateId` / `positionId` / `companyId` | administración |
| `knowledgeAssessmentId` / `assessmentVersion` | versión publicada administrada |
| `blueprintId` / `blueprintVersion` | blueprint congelado |
| `scoringVersion` | regla de scoring congelada |
| `itemVersions` | JSON `[{questionId, itemVersion}]` — **SIN claves** |

### Cuándo y cómo

- Se crea en `POST /api/evaluations action='start'` (arranque real de la
  administración), vía `createAdministrationSnapshot` — idempotente,
  nunca fatal, no expone claves.
- El candidato es evaluado contra la versión congelada: si el administrador
  cambia el banco después, el candidato ya iniciado NO cambia de versión
  (verificado por T12 y E4 del E2E).
- Puestos legacy sin assessment: snapshot con versiones de ítem +
  scoringVersion de la plantilla y campos de assessment en null (honesto).

## PASO 10 — Reconstrucción del resultado

Cadena implementada (todas las FK existen y están pobladas):

```
Candidate (User)
  → EvaluationSession
    → KnowledgeAdministrationSnapshot (assessmentVersion/blueprintVersion/scoringVersion/itemVersions congelados)
      → KnowledgeAssessment
        → KnowledgeBlueprint (versión)
          → KnowledgeRequirement (dominio)
            → Question (itemId) → KnowledgeItemVersion (contenido de ESA versión)
              → EvaluationResponse (value + correctAnswerSnapshot + scoringOutcome + itemVersionSnapshot)
                → CorrectAnswerSnapshot → ScoringVersion (KNOWLEDGE-SCORING-1.0)
                  → EvaluationResult (knowledgeScore/knowledgeStatus/knowledgeReasonCode/knowledgeScoringVersion)
```

- La reconstrucción **no depende de la versión ACTUAL del banco**: clave,
  desenlace y versión por respuesta están congelados desde A-03.2 (clave) y
  A-03.3 (versión).
- Evidencia E2E: resultado 100/VALID con respuestas congeladas
  `clave=1 itemVersion=1 outcome=CORRECT`; tras un cambio de clave del ítem,
  el resultado histórico y el snapshot permanecieron idénticos (E4).
- La cadena completa por ítem se verificó en DB (question → requirement
  `Conocimiento de producto y venta` → blueprint v1 → puesto Mesero/a →
  versiones `[1:ACTIVE:INITIAL]`).

## Reglas KAV-A33-1..4

1. **KAV-A33-1** — Toda administración de conocimientos genera exactamente un
   snapshot al iniciar (idempotente por sesión).
2. **KAV-A33-2** — El snapshot es inmutable (sin ruta de edición; sin
   `updatedAt`).
3. **KAV-A33-3** — El snapshot nunca contiene claves (solo versiones).
4. **KAV-A33-4** — Los resultados históricos se reconstruyen exclusivamente
   desde snapshots congelados; ningún recálculo usa el banco vigente
   (INSUFFICIENT ≠ 0 se preserva — herencia A-02.3/A-03.2 intacta).
