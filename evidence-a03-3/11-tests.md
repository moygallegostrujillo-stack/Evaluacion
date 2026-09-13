# A-03.3 — PASO 17 · TESTS

## Suite A-03.3: `tests/knowledge-blueprint.test.ts` (bun:test)

17 tests (15 del encargo + setup + cleanup). Fixtures aislados con TAG
temporal; limpieza total al final (DB queda como seed). **Resultado: 17/17
PASS.**

| # | Test | Verificación clave |
|---|---|---|
| T1 | blueprint pertenece a job | `blueprint.position.id === positionId` (y companyId) |
| T2 | requirement pertenece a blueprint | FK + rationale/source presentes |
| T3 | item pertenece a requirement | cadena ítem → requirement → blueprint |
| T4 | assessment pertenece a blueprint | FK + positionId |
| T5 | assessment tiene versión completa | assessmentVersion + scoringVersion + publishedAt/publishedBy |
| T6 | item ACTIVE tiene correctAnswer | compuerta por ítem + KPUB-KA-4 + clasificación INVALID |
| T7 | item ACTIVE tiene reviewer | `KNOWLEDGE_REVIEW_MISSING` sin revisor |
| T8 | assessment ACTIVE tiene blueprint APPROVED | KPUB-KA-1 bloquea DRAFT; ACTIVE pasa |
| T9 | assessment ACTIVE solo items APPROVED | KPUB-KA-3 bloquea mezcla con DRAFT |
| T10 | nueva correctAnswer crea nueva itemVersion | v2 KEY_CHANGE; v1 RETIRED intacta; previousCorrectAnswer; puntero DRAFT |
| T11 | resultado histórico conserva versiones antiguas | rescore desde snapshot v1; fila v1 sin mutar |
| T12 | cambiar banco no cambia evaluación existente | snapshot congelado con v1 tras evolución a v3 |
| T13 | IA solo produce DRAFT | enforce + canAiPublish false + regla conservadora de versión (dificultad no dispara) |
| T14 | candidato no puede modificar gobernanza | actores bloqueados + GSEP-2 sin excepción |
| T15 | autor/revisor/aprobador registrados | tríada en blueprint + v1 del ítem + excepción registrada habilita |

## Suite heredada A-03.2: `tests/knowledge-scoring.test.ts`

**11/11 PASS** (regresión del módulo de scoring — sin cambios semánticos).

## Suite E2E real: `scripts/a033-e2e-governance.ts`

Contra el dev server (HTTP real + DB): **5/5 ESCENARIOS APROBADOS** + limpieza
total.

| Escenario | Resultado |
|---|---|
| E1 Cadena generada por el generador real (blueprint+3 reqs+10 items+10 versiones+KA-v1 ACTIVE; huérfanos=0; excepción registrada) | ✓ |
| E2 Snapshot PASO 9 al iniciar (KA-v1, blueprint v1, scoring, 10 versiones, sin claves) | ✓ |
| E3 Flujo completo (4 pasos): knowledgeScore=100, VALID, PERFIL_COMPLETO; respuesta congelada clave+itemVersion+outcome | ✓ |
| E4 Cambio de clave por PUT (RH): v1 RETIRED, v2 DRAFT/KEY_CHANGE, audit SÍ; resultado histórico y snapshot intactos | ✓ |
| E5 CANDIDATO PUT ⇒ 403; reactivo IA ⇒ DRAFT/null/null | ✓ |
| E6 Limpieza total (DB como seed) | ✓ |

## Cobertura por PASO del encargo

- T1–T4 (PASO 1–4 pertenencias), T5 (PASO 5), T6–T9 (PASO 7 + PASO 4),
  T10–T12 (PASO 9/11/12), T13 (PASO 14 + PASO 12/13), T14–T15 (PASO 8).
- Comando: `bun test tests/` ⇒ **28 pass / 0 fail** (17 + 11).
