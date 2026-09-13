# A-03.3 — PASO 2 · KNOWLEDGE BLUEPRINT (MODELO)

## Definición

`KnowledgeBlueprint` declara **QUÉ dominios de conocimiento se evalúan para ESE
puesto**. Un blueprint pertenece a exactamente un puesto y es la raíz de la
cadena metodológica:

```
PUESTO (Position)
  └── KnowledgeBlueprint (v1, v2, … — append-only)
        └── KnowledgeRequirement (dominios, sin huérfanos)
              └── Question/KNOWLEDGE (ítems)
                    └── KnowledgeAssessment (versión congelada)
                          └── KnowledgeAdministrationSnapshot
                                └── EvaluationResult (reconstruible)
```

## Schema implementado (prisma/schema.prisma)

| Campo encargo | Columna | Tipo/Notas |
|---|---|---|
| blueprintId | `id` | String @id @default(cuid()) |
| jobId | `positionId` | FK → Position (relation `position`) |
| version | `version` | Int @default(1) — `@@unique([positionId, version])` |
| status | `status` | DRAFT, REVIEW, APPROVED, ACTIVE, SUSPENDED, RETIRED, REJECTED |
| createdBy | `createdBy` | autor registrado (PASO 8) |
| reviewedBy | `reviewedBy` | revisor registrado (PASO 8) |
| approvedBy | `approvedBy` | aprobador registrado (PASO 8) |
| createdAt | `createdAt` | DateTime @default(now()) |
| approvedAt | `approvedAt` | DateTime? |
| (excepción PASO 8) | `governanceNote` | Texto de excepción registrada |
| (tenant) | `companyId` | FK → Company (RLS-ready) |

## Reglas KBP-A33-1..6

1. **KBP-A33-1** — Todo blueprint pertenece a exactamente un puesto (FK
   obligatoria). Verificado por T1.
2. **KBP-A33-2** — Versionado append-only: un cambio de blueprint crea una
   NUEVA fila (`version+1`); una versión referenciada por un assessment
   publicado jamás se edita.
3. **KBP-A33-3** — El blueprint define dominios CERRADOS: sin requirement no
   hay pregunta (un reactivo sin requirement no puede ser ACTIVE — PASO 4).
4. **KBP-A33-4** — Los campos createdBy/reviewedBy/approvedBy son obligatorios
   en toda creación del sistema (actor de gobernanza registrado) y en toda
   creación RH vía API (autor=usuario autenticado; revisor/aprobador según
   compuerta — ver 07-role-separation.md).
5. **KBP-A33-5** — Ninguna llamada pública del candidato puede crear, editar
   ni eliminar un blueprint (solo escrituras de gobernanza autenticadas; ver
   RC-A03.3-12 corregida).
6. **KBP-A33-6** — Sin dominios huérfanos: la creación de la cadena VALIDA la
   cobertura (cada orden del banco mapeado a un requirement) y falla
   explícitamente si un ítem quedara sin padre (`KNOWLEDGE_ORPHAN_ITEMS`).

## Implementación

- Módulo puro: `src/lib/knowledge/governance.ts` (reglas/compuertas).
- Servicio DB: `src/lib/knowledge/governance-service.ts`
  (`createKnowledgeGovernanceForPosition` — idempotente).
- Generador: `src/lib/generate-templates.ts` crea la cadena para todo puesto
  NUEVO con `hasKnowledgeTest` (no-fatal: un fallo de gobernanza no rompe la
  generación funcional, se registra en dev.log).
- Seed: `prisma/seed.ts` construye la cadena para los 5 puestos demo.
- Puestos EXISTENTES previos a A-03.3: NO reciben blueprint retroactivo
  (PASO 16/19 — no se inventa metadata histórica).
