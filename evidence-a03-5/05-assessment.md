# A-03.5 — PASO 5: ASSESSMENT
## KnowledgeAssessment representa EXACTAMENTE el conjunto administrable

## Campos exigidos → implementados (generalizados a job genérico)

```prisma
model KnowledgeAssessment {
  jobType          String    @default("VACANCY") // VACANCY | POSITION  (A-03.5)
  vacancyId        String?   // canal público (A-03.4 compat)
  positionId       String?   // canal interno (A-03.5)
  companyId        String
  version          Int       // assessmentVersion = KA-v{n}
  blueprintId      String?   // null SOLO en filas pre-canónicas (A-03.4)
  blueprintVersion String    // BP-v{n} denormalizado y congelado
  scoringVersion   String    // PUB-KS-v1
  status           String    // ACTIVE | RETIRED
  contentHash      String    // hash canónico del estado del banco
  itemCount        Int
  publishSource    String    // SYSTEM_BOOTSTRAP | SYSTEM_ON_BANK_CHANGE | SYSTEM_ON_CANONICAL_MIGRATION
  publishedBy      String    // 'SYSTEM:KNOWLEDGE_FREEZE' — IA sin autoridad
  publishedAt      DateTime
  retiredAt        DateTime?
  ...
  @@unique([vacancyId, version])
  @@unique([positionId, version])
}
```

## "Representa exactamente el conjunto administrable"

- `contentHash` = hash canónico SHA-256 del banco completo (tipo+id+texto+opciones+clave+orden) — la MISMA función de A-03.4 (`canonicalBankHash`), precedencia de banco idéntica.
- Coincide hash → SE REUTILIZA la versión ACTIVE (resolución única, cero duplicados).
- Cambia hash → se publica KA-v{n+1} con los items congelados y sus links canónicos.
- Filas pre-canónicas (A-03.4): si el hash coincide pero `blueprintId` es null, se publica una versión canónica nueva (`SYSTEM_ON_CANONICAL_MIGRATION`); las históricas NO se tocan.

## Ciclo de vida (verificado en la suite)

| Estado | Disparador | Test |
|---|---|---|
| ACTIVE KA-v1 | Primera administración del job | CAN-4 |
| ACTIVE KA-v{n+1} | Cambio de contenido del banco | CHG-1 |
| ACTIVE KA-v{n+1} | Migración canónica de una fila pre-canónica reutilizada por hash | (regla documentada) |
| RETIRED | Superseded por la nueva versión (solo transición status+retiredAt) | REC-1 |

## Autoridad de publicación

- `publishedBy = 'SYSTEM:KNOWLEDGE_FREEZE'` — constante server-side.
- NO existe ninguna ruta API de escritura hacia KnowledgeAssessment (ni RH ni IA).
- IA: cero autoridad (PASO 13 — doc 11-ai.md).

## CSV

Columnas 5-6 (`assessmentId`, `assessmentVersion`) + columna 10 (`status`):
la corrida final muestra KA-v1..KA-v4 coexistentes, las viejas RETIRED y las
vigentes ACTIVE, todas reconstruibles.
