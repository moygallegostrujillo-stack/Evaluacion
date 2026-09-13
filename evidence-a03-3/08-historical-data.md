# A-03.3 — PASO 16/19 · DATOS HISTÓRICOS Y COMPATIBILIDAD HACIA ATRÁS

## Contexto del entorno

Al iniciar A-03.3 la base del sandbox estaba VACÍA (el sandbox se reinició
entre sesiones; las tablas existentes eran de un schema anterior y sin filas).
Se aplicó `db:push` (estrictamente aditivo) y se restauró el estado demo con
el seed (que es la fuente canónica del entorno DEV). **Durante toda la fase
no se eliminó, recalculó ni inventó ningún dato**: los 3 resultados demo del
seed permanecen con sus valores originales.

## PASO 16 — Clasificación (implementada y consultable)

`classifyKnowledgeRecord` (módulo puro `governance.ts`) + script de
inventario de solo lectura `scripts/a033-classify-blueprint.ts`:

| Clase | Criterio | Acción |
|---|---|---|
| `VALIDATED-V1` | ciclo de vida + clave + fuente + revisión + versión (≥1) | cadena completa v1 (equivale a clase A de A-03.2) |
| `LEGACY` | pre-A-03.2: sin `knowledgeStatus` | NO se toca, NO se inventa metadata |
| `INVALID` | declara ciclo de vida pero sin clave | no puntúa; INSUFFICIENT si se administra (A-03.2) |
| `UNKNOWN` | metadata incompleta/dudosa | requiere revisión humana antes de publicar |
| `NOT_APPLICABLE` | pregunta ajena a conocimientos | fuera de alcance |

Clasificación del estado actual (salida real del script):

```
Knowledge items: 50  →  VALIDATED-V1: 50 · LEGACY: 0 · INVALID: 0 · UNKNOWN: 0
KnowledgeBlueprints: 5 · Requirements: 12 · Assessments: 5 (KA-v1 ACTIVE)
KnowledgeItemVersions: 50 · AdministrationSnapshots: 0
Items ACTIVE sin requirement: NINGUNO
```

## PASO 19 — Reglas de datos (cumplidas)

1. **No eliminar históricos** — 0 deletes sobre datos preexistentes; los
   deletes del seed/cleanup afectan solo fixtures creados por la propia fase
   (marcados con TAG `A033E2E-` / `A033T-`).
2. **No recalcular resultados existentes** — `completeEvaluation` solo escribe
   resultados de la sesión que se completa; ningún script recalculó resultados.
3. **No inventar blueprint histórico** — los puestos existentes antes de la
   fase reciben la cadena SOLO si se regeneran (generador idempotente); el
   seed crea la cadena para sus puestos demo al reconstruir el entorno, y el
   resultado demo de Juan (Mesero, 75/100) conserva su summary/scores
   originales sin vínculos inventados.
4. **Históricos sin metadata → LEGACY/UNKNOWN** — la clasificación lo expresa
   sin escribir columnas nuevas sobre filas antiguas.
5. **Resultados demo intactos** (verificados por el script):

```
- cmtv2jb4v… knowledgeScore=80  status=legacy scoringVer=—   (Juan, Mesero)
- cmtv2jb4x… knowledgeScore=55  status=legacy scoringVer=—   (Lucía, Cocinero)
- cmtv2jb4z… knowledgeScore=null status=legacy scoringVer=—  (sin sección)
```

## Migración

- `bun run db:push` — solo creación de 5 tablas nuevas + columnas nullable
  (`Question.createdBy/difficulty/knowledgeBlueprintId/knowledgeRequirementId`,
  `EvaluationResponse.itemVersionSnapshot`). Ninguna columna existente
  cambió de tipo ni se borró.
- `prisma/schema.prod.prisma` (Supabase) NO fue promovido en esta fase —
  pendiente documentado (L-7).
