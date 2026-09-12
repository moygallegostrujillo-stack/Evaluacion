# A-03.5 — PASO 3: BLUEPRINT
## KnowledgeBlueprint como entidad real, ligada al JOB

## Regla implementada

Un Blueprint está vinculado a:
- **jobId** — `Position.id` (canal interno) o `Vacancy.id` (canal público).
- **jobType** — 'POSITION' | 'VACANCY' (el canal no cambia el modelo).
- **blueprintVersion** — `BP-v{n}`, incrementa SOLO cuando cambia la estructura de requirements.

```prisma
model KnowledgeBlueprint {
  id               String   @id @default(cuid()) // blueprintId
  jobId            String
  jobType          String   // POSITION | VACANCY
  companyId        String
  blueprintVersion String   // BP-v{n}
  status           String   @default("ACTIVE") // ACTIVE | RETIRED
  contentHash      String   // hash canónico de la estructura de requirements
  derivedFrom      String   @default("SYSTEM:CANONICAL_DERIVATION")
  ...
  @@unique([jobId, jobType, blueprintVersion])
}
```

## "Únicamente conocimientos relevantes al puesto"

El blueprint deriva EXCLUSIVAMENTE de los items del banco de ESE job:
- VACANCY → preguntas de la propia vacante (precedencia legacy intacta) o fallback template CONOCIMIENTOS del primer Position de la empresa.
- POSITION → SOLO el template CONOCIMIENTOS de ese Position (`resolveKnowledgeBankForJob`, knowledge-canonical.ts). Nunca el template de otro job.

## "No usar category global como sustituto del Blueprint"

- La `category: 'KNOWLEDGE'` de Question es un TAG del banco, NO una estructura.
- El blueprint materializa la estructura real: N filas de KnowledgeRequirement con domain/subdomain/description/importance/source/rationale por item.
- `domain = 'JOB_KNOWLEDGE'` (fijo, derivado), jamás la categoría global.

## Ciclo de vida (verificado)

| Estado | Cuándo | Test |
|---|---|---|
| ACTIVE (v1) | Primera publicación canónica del job | CAN-1 |
| ACTIVE (reutilizado) | Nueva administración con estructura sin cambios | CHG-7 (solo cambio de clave → mismo blueprint) |
| RETIRED | Cambio de estructura → nueva BP-v{n+1}; la anterior queda intacta para históricos | REC-2 |

## Numeración

`nextBlueprintVersion` = máximo numérico de BP-v{n} del job + 1 (robusto ante
orden de creación). Carrera de publicación: reintento con reutilización del
ganador si el hash de estructura coincide (PASO 14).

## Evidencia DB (última corrida)

- 14 administraciones → blueprints BP-v1 (estructura estable) y BP-v2 (tras mutación de texto — REC-1).
- Cada requirement lleva `sourceItemId` → trazabilidad 1:1 con el banco.
- CSV `knowledge-canonical-model.csv` columnas 2-3: blueprintId + blueprintVersion por item administrado.
