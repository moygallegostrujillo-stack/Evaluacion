# EVALUHR — A-03.3 MASTER DOSSIER
# KNOWLEDGE BLUEPRINT + ASSESSMENT VERSIONING — DISEÑO + IMPLEMENTACIÓN CONTROLADA

> Fase: A-03.3 (auditoría de la cadena PUESTO → BLUEPRINT → CONOCIMIENTO
> REQUERIDO → REACTIVO → CORRECTANSWER → REVISIÓN → PUBLICACIÓN → ASSESSMENT
> VERSION → ADMINISTRACIÓN → RESULTADO).
> Alcance modificado: EXCLUSIVAMENTE infraestructura del instrumento de
> conocimientos. Estado final: **GO de fase** (ver 14-audit-checklist.md).
> Herencia: A-03.1 (diseño, 22 archivos) · A-03.2 (correctAnswer + scoring,
> 7 archivos) · A-02.x (estados de evidencia, criterios, fit) · INSUFFICIENT ≠ 0.

---

## 1. Problema ANTES

El scoring por clave ya era correcto (A-03.2), pero el instrumento no tenía
arquitectura: la relación puesto→conocimiento era un diccionario estático por
categoría; no existían entidades de blueprint ni de requisito (ítems
huérfanos de facto); el conjunto administrado era "lo que esté activo en cada
fetch"; no había versionado histórico de ítems (una fila mutable, cambios
sobrescribían silenciosamente); no había compuertas de publicación a nivel
assessment; no había separación de funciones registrada; y la reconstrucción
de resultados históricos dependía del estado ACTUAL del banco.

## 2. Causa raíz (RC-A03.3-1..12)

| # | Causa raíz |
|---|---|
| RC-1 | Sin KnowledgeBlueprint — relación implícita por `category` |
| RC-2 | Sin KnowledgeRequirement — sin trazabilidad al puesto |
| RC-3 | Sin KnowledgeAssessment — nada congela QUÉ versión se administró |
| RC-4 | Sin historial de ítems — `itemVersion` sin tabla; PUT sobrescribía; `previousCorrectAnswer`/`correctAnswerChangedAt` jamás escritos (verificado con git log -p: el versionado de PUT nunca existió en ningún commit) |
| RC-5 | Compuertas solo por ítem — no existía gate de publicación del assessment |
| RC-6 | Sin tríada createdBy/reviewedBy/approvedBy ni excepción registrada |
| RC-7 | Sin snapshot de administración al iniciar (solo clave al calificar) |
| RC-8 | Cadena de reconstrucción incompleta (sin itemVersionSnapshot ni entidades) |
| RC-9 | Fronteras IA no cableadas en escrituras (preventivo) |
| RC-10 | Clasificación backward-compat no consultable |
| RC-11 | **BUG LATENTE detectado por la nueva compuerta KPUB-KA-4**: el generador llamaba `resolveSystemKnowledgeKey` con 2 argumentos e ignoraba las claves declaradas del banco para MESERO ⇒ todo puesto MESERO nuevo desde A-03.2 nacía con claves null (⇒ INSUFFICIENT, no 0 — el sistema de A-03.2 contenía el daño, pero el instrumento quedaba sin evidencia válida) |
| RC-12 | **GAP de seguridad detectado por E2E**: PUT/DELETE de preguntas sin rol-gate — un CANDIDATO de la misma empresa podía editar/eliminar reactivos (violación PASO 8) |

## 3. Solución implementada

5 modelos nuevos (append-only + snapshot) + módulo de gobernanza puro +
servicio DB + cableado en generador/API/seed + fix RC-11 + cierre RC-12 +
15 tests + E2E real 5/5 + clasificación + CSV + 15 documentos de evidencia.
Detalles por documento: 02 (blueprint), 03 (requirement + enlace + PASO 15),
04 (versionado ítem + PASO 11/12/13), 05 (assessment + snapshot + resultado),
06 (publicación), 07 (separación de funciones), 08 (datos históricos),
09 (IA), 10 (audit trail), 11 (tests), 12 (regresión).

## 4. Arquitectura

```
PUESTO (Position)
  └─ KnowledgeBlueprint v1..vN (append-only; tríada de actores; governanceNote)
       └─ KnowledgeRequirement ×12 (dominio/subdominio/importance/source/rationale)
            └─ Question/KNOWLEDGE (puntero a versión vigente; FK a requirement+blueprint)
                 ├─ KnowledgeItemVersion ×N (contenido exacto por versión; RETIRED al ser reemplazada)
                 └─ KnowledgeAssessment KA-vN (ACTIVE; scoringVersion; publishedBy)
                      └─ KnowledgeAdministrationSnapshot (1:1 sesión; sin claves)
                           └─ EvaluationResponse (clave+outcome+itemVersionSnapshot congelados)
                                └─ EvaluationResult (score/status/reasonCode/scoringVersion)
```

Módulos: `governance.ts` (puro: compuertas KPUB-KA-1..6, separación GSEP-1/2,
frontera IA, `requiresNewItemVersion`, `decideKeyChange`,
`classifyKnowledgeRecord`, `nextAssessmentVersion`) y `governance-service.ts`
(DB: cadena idempotente, cambio metodológico append-only, snapshot).

## 5. correctAnswer

Sigue siendo precondición de scoring (A-03.2, intacto). A-03.3 añade: la
clave vive DENTRO de cada versión registrada (historial inmutable), la
compuerta KPUB-KA-4 bloquea assessments con ítems sin clave, y el cambio de
clave nunca edita el pasado (nueva versión + RETIRED + `previousCorrectAnswer`
+ auditoría). El generador ya no pierde claves declaradas (RC-11).

## 6. Scoring

SIN cambios semánticos: CORRECT_OVER_TOTAL; item sin clave = NOT_SCORABLE;
cualquier faltante ⇒ INSUFFICIENT (score null, jamás 0) con
KNOWLEDGE_KEY_MISSING/KNOWLEDGE_INCOMPLETE; sin prorrateo; sin pesos
(importance y difficulty son metadatos). Suite A-03.2 11/11 en verde.

## 7. Estados

- Ítem: DRAFT/REVIEW/APPROVED/ACTIVE/SUSPENDED/RETIRED/REJECTED (por versión
  y en el puntero).
- Blueprint/Requirement: mismo ciclo (sincronizado).
- Assessment: DRAFT/APPROVED/ACTIVE/SUSPENDED/RETIRED.
- Resultado: VALID/INSUFFICIENT/NOT_APPLICABLE (INSUFFICIENT ≠ 0).

## 8. IA

IA ⇒ DRAFT + null/null (frontera estricta en POST, sin posibilidad de
restituir actores humanos); IA jamás publica ítem/assessment ni aprueba
blueprint/requirement/clave; `canAiPublish()===false`; verificado por T13 y
E2E E5b. Detalle en 09.

## 9. Versionado

4 niveles: itemVersion (por ítem, append-only), blueprintVersion, +
assessmentVersion (KA-vN, `@@unique([positionId, assessmentVersion])`) +
scoringVersion (KNOWLEDGE-SCORING-1.0). Regla conservadora del PASO 12
implementada (`requiresNewItemVersion`). Cambios futuros del banco ⇒ nuevas
filas; nada publicado se edita.

## 10. Históricos

Clasificación consultable VALIDATED-V1/LEGACY/INVALID/UNKNOWN/NOT_APPLICABLE
(50×VALIDATED-V1 hoy). No se eliminó, recalculó ni inventó nada; los
resultados demo conservan scores/summary originales; el estado del sandbox al
iniciar (DB vacía) y su reconstrucción por seed están documentados en 08.

## 11. Seguridad

- Clave oculta a CANDIDATO (heredado, 7 serializaciones) — el snapshot no
  contiene claves.
- Rol-gates RH/GERENTE/SUPER_ADMIN ahora en POST/PUT/DELETE (RC-12 cerrado);
  CANDIDATO ⇒ 403 + logUnauthorizedAccess.
- Ninguna llamada pública altera gobernanza (los modelos de gobernanza no
  tienen rutas públicas de escritura).
- Auditoría append-only de cambios de versión (AuditLog + filas RETIRED +
  `supersededByVersion`).

## 12. Tests

`bun test tests/` ⇒ **28/28 PASS** (17 de A-03.3: T1–T15 + setup/cleanup;
11 heredados de A-03.2). E2E real `scripts/a033-e2e-governance.ts` ⇒ 5/5 con
limpieza total. Detalle en 11.

## 13. Regresión

0 archivos de módulos prohibidos tocados (git); IPIP/scoring IPIP/integridad/
competencias/recomendaciones/overallScore idénticos; resultados históricos
idénticos; lint 0/0; tsc sin errores nuevos vs baseline; navegador verificado
(login, dashboard, detalle, preguntas, móvil). Detalle en 12.

## 14. Riesgos

| Riesgo | Mitigación/estado |
|---|---|
| R-1 Ítem DRAFT post-cambio sigue servible (brecha publicación≠funcionalidad) | Documentado (L-4); cierre con flujo de aprobación UI |
| R-2 Sin UI de gobernanza (solo generador/seed/módulo) | Fase futura (L-1) |
| R-3 Flujo de vacantes sin snapshot de inicio | Congelamiento por respuesta activo; extensión futura (L-2) |
| R-4 Promoción de schema a Supabase pendiente | NO-GO producción heredado se mantiene (L-7) |
| R-5 Banco sin validación empírica | Fuerza LIMITED (A-02.5) intacta (L-8) |
| R-6 Actor único en DEMO | Excepción registrada; separación real futura (L-5) |

## 15. Limitaciones

L-1..L-9 en 13-limitations.md (UI de gobernanza, alcance del snapshot,
backfill honesto, flujo de re-aprobación, actor único DEMO, in-memory rate
limit, Supabase pendiente, sin validación empírica, entorno DEV reset).

## 16. Archivos modificados (A-03.3)

```
M  prisma/schema.prisma                      — 5 modelos + columnas knowledge (aditivo)
M  prisma/seed.ts                            — cadena de gobernanza (solo knowledge)
M  src/app/api/evaluations/route.ts          — snapshot al iniciar + itemVersionSnapshot
M  src/app/api/questions/route.ts            — gobernanza POST + versionado PUT + rol-gates
M  src/lib/generate-templates.ts             — cadena completa + fix RC-A03.3-11
M  src/lib/knowledge/system-bank.ts          — catálogo de requirements (12 dominios)
N  src/lib/knowledge/governance.ts           — módulo puro de gobernanza
N  src/lib/knowledge/governance-service.ts   — operaciones DB de gobernanza
N  tests/knowledge-blueprint.test.ts         — T1–T15
N  tests/bun-test.d.ts                       — tipos bun:test (higiene tsc)
N  scripts/a033-classify-blueprint.ts        — clasificación solo lectura
N  scripts/a033-e2e-governance.ts            — E2E real 5/5
N  evidence-a03-3/*                          — este dossier + 14 docs + CSV
```

## 17. Cambios de schema

Nuevos modelos: `KnowledgeBlueprint`, `KnowledgeRequirement`,
`KnowledgeAssessment`, `KnowledgeItemVersion`, `KnowledgeAdministrationSnapshot`.
Nuevas columnas (nullable/aditivas): `Question.createdBy`, `Question.difficulty`,
`Question.knowledgeBlueprintId`, `Question.knowledgeRequirementId`,
`EvaluationResponse.itemVersionSnapshot`. Back-relations nuevas en
Position/Company/EvaluationSession/Question. Ninguna columna existente fue
modificada ni eliminada. `prisma db push` aplicado a SQLite (DEV);
schema.prod/Supabase NO promovido.

## 18. Conclusión

A-03.3 completa la arquitectura metodológica del instrumento de
conocimientos: la cadena PUESTO→BLUEPRINT→REQUIREMENT→ITEM→CORRECTANSWER→
REVISIÓN→PUBLICACIÓN→ASSESSMENT VERSION→ADMINISTRACIÓN→RESULTADO existe,
está poblada (5/12/5/50 entidades, 0 huérfanos), es versionada (append-only),
congelada por administración (snapshot sin claves), reconstruible
históricamente, con separación de funciones registrada (excepción única
documentada), fronteras IA cableadas, compuertas de publicación de 6 puntos,
15 tests + E2E 5/5 en verde y regresión limpia. La fase detectó y corrigió 2
problemas reales heredados (RC-11 claves del generador; RC-12 rol-gates de
gobernanza) — la compuerta hizo su trabajo. INSUFFICIENT ≠ 0 se preserva.
Sin diseñar JobFit, pesos laborales ni puntos de corte (regla de detención).

**GO / NO-GO: GO de fase (documental + funcional en DEV).** DETENTE.
