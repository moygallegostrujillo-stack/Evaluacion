# A-03.5 — PASO 7: PUBLIC APPLY (flujo público sobre el modelo canónico)
## El flujo público NO crea un blueprint paralelo

## Antes (gap before)

`publishAssessmentForBank` leía el banco vivo y creaba un "item set congelado"
co-versionado (BP-v{n} como STRING) sin entidad Blueprint, sin Requirements,
sin ItemVersions canónicas — un modelo paralelo incompleto respecto al conceptual.

## Ahora — resolución única y congelación completa (step=data, transacción)

```ts
// src/app/api/public/apply/route.ts — POST step=data
application = await db.$transaction(async (tx) => {
  const created = await tx.vacancyApplication.create({ ... })   // 1) aplicación
  await freezeKnowledgeForApplication(tx, created.id, vacancy)  // 2) cadena canónica
  return created
}, { timeout: 20000, maxWait: 10000 })
```

`freezeKnowledgeForApplication` (único motor, compartido con el interno):
1. `resolveCanonicalKnowledgeAssessment(tx, jobFromVacancy(vacancy))`
   - job → **KnowledgeBlueprint** (reutilizada por structureHash o creada BP-v{n+1})
   - → **KnowledgeRequirement** (1:1 por item, derivación determinista)
   - → **KnowledgeItemVersion** (reutilizada por contenido o nueva edición)
   - → **KnowledgeAssessment ACTIVE** (reutilizada por contentHash o publicada KA-v{n+1})
2. `freezeAdministrationForCandidate(tx, { channel: 'PUBLIC_VACANCY', applicationId, ... })`
3. Congela los 6 campos de compatibilidad A-03.4 en `VacancyApplication` (VERSIONED).

## "No volver a leer el banco actual para determinar la prueba"

| Petición posterior | Fuente de verdad |
|---|---|
| GET step 4 (servir ítems) | Items CONGELADOS del `knowledgeAssessmentId` — sin tocar el banco (A-03.4, intacto) |
| POST step=answer | Valida pertenencia a la administración congelada (403 si no) + snapshot server-side + sello `knowledgeAdministrationId` |
| POST step=advance (4) | `scoreCanonicalAdministration` SOLO contra congelado + `writeKnowledgeResult` + administration COMPLETED |
| Reanudación (mismo email) | Devuelve la aplicación existente — jamás re-resuelve versión |

## Fail-closed (PASO 8 heredado, conservado)

- Cualquier `KnowledgeVersioningError` ⇒ rollback ⇒ **500 CONFIGURATION_ERROR/INTERNAL_ERROR sin evaluación parcial**.
- Contención SQLite (PASO 14): reintento de la transacción completa con
  `isRetryableFreezeError` (P2002 / P2028 / database is locked / socket timeout)
  — el perdedor relee la versión del ganador y la reutiliza (verificado CONC-1: 4/4 inicios paralelos sobre la MISMA KA-v1).

## Campos que el cliente NO puede enviar (deny-list A-03.5 ampliada)

`blueprintId`, `requirementId`, `itemVersionId`, `knowledgeAdministrationId`,
`knowledgeResultId`, `evidenceStatus`, etc. → **403 MANIPULATION_REJECTED**
(SEC-1a..d). Autoridad 100% server-side.
