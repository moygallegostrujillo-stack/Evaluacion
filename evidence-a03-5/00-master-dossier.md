# A-03.5 — MASTER DOSSIER
## NORMALIZACIÓN DEL MODELO CANÓNICO DE KNOWLEDGE ASSESSMENT — IMPLEMENTACIÓN CONTROLADA

**Fase:** A-03.5 (continuación de A-03.4 GO)
**Estado:** COMPLETADA — 57/57 tests PASS — veredicto GO (ver informe final)
**Superficie:** knowledge models, public apply, evaluations, generate-templates, snapshot, scoring, tests.

## Índice de evidencias

| Archivo | Contenido |
|---|---|
| `01-before-audit.md` | PASO 1 — modelo interno vs público, diferencias, duplicados, qué se congelaba |
| `02-canonical-model.md` | PASO 2 — definición formal de la cadena canónica + reglas de versionado |
| `03-blueprint.md` | PASO 3 — Blueprint ligado a job; category global NO es sustituto |
| `04-requirement.md` | PASO 4 — Requirement: campos completos, invariants, trazabilidad |
| `05-assessment.md` | PASO 5 — Assessment = conjunto administrable exacto; generalizado a job |
| `06-item-version.md` | PASO 6 — ItemVersion: (requirementId, itemId, itemVersion) + contenido protegido (extra) |
| `06-administration.md` | PASO 8 — Administration como entidad real 1:1 con el candidato |
| `07-public-flow.md` | PASO 7 — Public apply sobre el modelo canónico; sin blueprint paralelo |
| `08-snapshot.md` | PASO 9 — Snapshot independiente del banco vivo; clave protegida |
| `09-scoring.md` | PASO 10/11 — Motor único; INSUFFICIENT ≠ 0; KnowledgeResult separado de overallScore |
| `10-legacy.md` | PASO 12 — LEGACY / KA-V1+ / UNKNOWN; sin migración ni recálculo |
| `11-ai.md` | PASO 13 — IA solo DRAFT items; sin autoridad de publicación/aprobación |
| `12-concurrency.md` | PASO 14 — Inicios simultáneos → misma versión; sin mezclas |
| `13-cross-flow.md` | PASO 16 — Interno y público: mismo instrumento |
| `14-reconstruction.md` | PASO 18 — Reconstrucción histórica independiente del banco vivo |
| `15-regression.md` | PASO 19 — Regresión completa + auditoría de superficie |
| `16-audit-checklist.md` | PASO 20 — Checklist 19/19 |
| `17-change-test-paso15.md` | PASO 15 — A=v1 / B=v2 / C=v3 (extra documental) |
| `18-integrity-paso17.md` | PASO 17 — Invariantes estructurales (extra documental) |
| `knowledge-canonical-model.csv` | 71 filas reales (10 columnas spec) de la corrida final |
| `a035-test-results.json` | Resultado completo de la suite: 57/57 PASS |

## Resumen ejecutivo

**Problema before:** el flujo interno evaluaba conocimientos contra el banco
vivo (sin blueprint, sin versiones, sin congelar, con la clave de la prueba
ni siquiera persistida y, peor, expuesta al cliente), mientras el flujo
público congelaba un "item set" sin entidad Blueprint/Requirement — dos
instrumentos distintos para el mismo conocimiento.

**Solución:** un ÚNICO modelo canónico — JOB → KnowledgeBlueprint →
KnowledgeRequirement → KnowledgeItemVersion → KnowledgeAssessment →
KnowledgeAssessmentItem → KnowledgeAdministration → Response →
KnowledgeResult — implementado en un motor compartido
(`src/lib/knowledge-canonical.ts`) que ambos canales ejecutan al iniciar
(una sola resolución, transaccional, fail-closed, con reintentos de
concurrencia). Semánticas A-03.2/A-03.4 preservadas al 100%: INSUFFICIENT ≠ 0,
deny-list, snapshots server-side, legacy intocable, sin fórmula global nueva.

**Verificación:** 57/57 tests de integración sobre HTTP real + DB,
incluyendo concurrencia paralela (4/4 misma versión), escenario de cambio
completo (A=v1, B=v2, C=v3), cross-flow byte-idéntico, reconstrucción
histórica tras mutación del mundo vivo y regresión numérica de todas las
fórmulas prohibidas.
