# A-03.5 — PASO 6: ITEM VERSION
## Cada item administrado resuelve (requirementId, itemId, itemVersion)

## Implementación

```prisma
model KnowledgeItemVersion {
  id            String   @id @default(cuid())
  requirementId String   // → KnowledgeRequirement (PASO 4)
  itemId        String   // fila de banco: VacancyQuestion.id | Question.id
  itemType      String   // VACANCY_QUESTION | TEMPLATE_QUESTION
  itemVersion   Int      // sube SOLO con cambio de contenido
  question      String
  options       String   // JSON array
  correctAnswer Int?     // PROTEGIDA — material de scoring, server-only
  hasKey        Boolean
  source        String   // VACANCY_BANK | TEMPLATE_BANK | AI_DRAFT
  rationale     String?
  difficulty    String   @default("UNKNOWN")  // nunca inventada (KD-1..6)
  status        String   @default("APPROVED") // DRAFT | APPROVED | RETIRED
  ...
  @@unique([itemId, itemVersion])
}
```

Y en el lado de la administración congelada:

```prisma
model KnowledgeAssessmentItem {
  ...
  requirementId String?  // null SOLO pre-canónico (A-03.4)
  itemVersionId String?  // null SOLO pre-canónico (A-03.4)
}
```

## Contenido exigido por la especificación → presente

| Campo spec | Dónde |
|---|---|
| question | `question` (edición canónica) + `questionSnapshot` (copia congelada por administración) |
| options | `options` (JSON) + dentro de `questionSnapshot` |
| correctAnswer | `correctAnswer` + `correctAnswerSnapshot` — PROTEGIDAS, nunca serializadas al candidato |
| source | `source` (procedencia real del banco) |
| rationale | `rationale` (trazabilidad de la derivación) |
| difficulty | `difficulty='UNKNOWN'` — jamás inventada (reglas KD) |
| status | DRAFT/APPROVED/RETIRED — APPROVED solo por publicación SYSTEM |

## Regla de bump (preserva A-03.4 y satisface PASO 15/17)

- Cambia texto/opciones/clave → nueva edición `itemVersion+1` (CHG-5: clave 0→1 → v1→v2).
- Sin cambio de contenido → reutiliza la edición existente (CHG-6: misma v1 en dos administraciones).
- Una edición JAMÁS cambia de requirement (INTG-3: 0 violaciones en todo el dataset).
- Carrera de publicación: reintento con relectura del ganador; si su contenido coincide → se reutiliza (PASO 14).

## Evidencia DB

- 343 KnowledgeItemVersion acumuladas; la corrida final muestra ediciones v1→v3 coexistentes para el mismo itemId (CSV columna 8), cada una con su requirement de linaje.
