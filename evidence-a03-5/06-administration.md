# A-03.5 — PASO 8: ADMINISTRACIÓN
## KnowledgeAdministration como entidad real (qué recibió el candidato)

## Antes (A-03.4)

La "administración" era implícita: 6 campos freeze esparcidos en
`VacancyApplication` + snapshots por respuesta. Reconstructible, pero sin
entidad formal, sin existencia para el canal interno, y sin vínculo único
candidato↔instrumento.

## Ahora (entidad real, ambos canales)

```prisma
model KnowledgeAdministration {
  id                   String    @id @default(cuid())
  channel              String    // PUBLIC_VACANCY | INTERNAL_POSITION
  companyId            String
  assessmentId         String    // → KnowledgeAssessment (FK Restrict)
  assessmentVersion    Int       // denormalizado KA-v{n} — copia congelada
  blueprintId          String?
  blueprintVersion     String    // denormalizado BP-v{n}
  scoringVersion       String    // denormalizado PUB-KS-v1
  itemCount            Int
  status               String    // FROZEN | COMPLETED
  frozenAt             DateTime  @default(now())
  completedAt          DateTime?
  vacancyApplicationId String?   // canal público (UNIQUE — una por aplicación)
  evaluationSessionId  String?   // canal interno (UNIQUE — una por sesión)
  ...
}
```

## Garantías (todas verificadas)

| Garantía | Mecanismo | Test |
|---|---|---|
| Permite reconstruir EXACTAMENTE qué recibió el candidato | administration → assessment → items (congelados) → itemVersions → responses | REC-3/REC-4 |
| UNA administración por candidato/proceso | FK `vacancyApplicationId` y `evaluationSessionId` con `@@unique` | CAN-6 / INT-1 |
| Versiones congeladas inmutables | Denormalizadas en la fila al crearla; la evaluación posterior del banco NO las toca | CHG-2/3, REC-3 |
| Ambos canales, misma forma | `channel` discrimina; el resto es idéntico | XFLOW-1..3 |
| Fail-closed al congelar | Creación dentro de la transacción del start; fallo ⇒ rollback sin administración ni evaluación parcial | INT-0b/INT-1 + PASO 8 |
| Reanudación NO re-congela | Al arrancar se busca la administración existente (unique) y se reutiliza | regla del start interno + resume público |

## Ciclo

1. **FROZEN** al iniciar (transacción de `step=data` público / `action=start` interno).
2. **COMPLETED** al completar el paso conocimientos (con `completedAt`), junto a la escritura del KnowledgeResult (CAN/CHG/SCORE).

## Respuestas vinculadas

- Público: `VacancyApplicationResponse.knowledgeAdministrationId` (sellado server-side en cada respuesta de conocimientos — SEC-3).
- Interno: `EvaluationResponse.knowledgeAdministrationId` (ídem — INT-3b).
- El cliente jamás provee ese id (deny-list → 403, SEC-1c).
