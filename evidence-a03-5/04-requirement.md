# A-03.5 — PASO 4: REQUIREMENT
## Cada pregunta pertenece a un KnowledgeRequirement

## Campos exigidos por la especificación → implementados

```prisma
model KnowledgeRequirement {
  id            String   @id @default(cuid()) // requirementId
  blueprintId   String
  domain        String   @default("KNOWLEDGE")     // JOB_KNOWLEDGE en la derivación
  subdomain     String   @default("GENERAL")       // VACANCY_BANK | POSITION_TEMPLATE
  description   String                             // derivado del texto del ítem
  importance    String   @default("REQUIRED")      // sin pesos, sin impacto en scoring
  source        String   @default("SYSTEM_DERIVED")// SYSTEM_DERIVED | AI_DRAFT_ORIGIN | HUMAN
  rationale     String?                            // trazabilidad completa
  sourceItemId  String?                            // fila del banco que verifica
  version       Int      @default(1)
  status        String   @default("APPROVED")      // DRAFT | APPROVED | RETIRED
  ...
}
```

## Invariantes (verificados)

| Invariante | Mecanismo | Test |
|---|---|---|
| Todo item administrado resuelve UN requirement | Publicación fail-closed: si `requirementByItemId` no resuelve → `KnowledgeVersioningError CONFIGURATION_ERROR` y rollback | INTG-1 (0 items huérfanos en N administraciones) |
| Requirement pertenece al blueprint de SU job | Derivación dentro de la creación del blueprint del job; verificación job↔blueprint por fila | INTG-2 (0 violaciones) |
| APPROVED solo por autoridad SYSTEM | Único punto de creación = `resolveCanonicalBlueprint` dentro del freeze; sin rutas de escritura API para requirements | SEC + auditoría de superficie |
| IA nunca aprueba | IA solo produce filas de banco `origin='AI_DRAFT'`; el derivado conserva `source='AI_DRAFT_ORIGIN'` pero la aprobación la emite SYSTEM al publicar | PASO 13 (doc 11-ai.md) |

## Versionado de requirements

- Un requirement pertenece a UNA generación de blueprint (inmutable).
- Cambio de estructura → NUEVO blueprint con NUEVOS requirements (BP-v{n+1}); los anteriores quedan RETIRED e intactos para reconstrucción histórica (REC-2).
- `version` = 1 en la derivación (regla futura de refinamiento puede incrementarlo sin cambiar el schema).

## Evidencia DB (última corrida)

- 40 requirements (10 por blueprint × blueprints de prueba).
- 1:1 requirement↔item por generación; `sourceItemId` determina el emparejamiento.
- CSV columna 4 (`requirementId`): cada item administrado muestra su requirement real (o `PRE-CANONICAL(A034)` para las filas históricas A-03.4, no migradas).
