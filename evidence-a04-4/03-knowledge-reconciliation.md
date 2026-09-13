# A-04.4 — 03 · RECONCILIACIÓN KNOWLEDGE (PASO 3)

Pregunta: ¿existen hoy KnowledgeBlueprint, KnowledgeRequirement, KnowledgeItemVersion, KnowledgeAssessment, KnowledgeAdministration, KnowledgeResult, y ambos flujos (INTERNAL/PUBLIC) usan el mismo motor?

Respuesta corta: **SÍ — IMPLEMENTED (CONFIRMED contra A-03.4/A-03.5), con una capa legada activa y divergente que convive por diseño.**

---

## 1. Modelos en `prisma/schema.prisma` (estado actual)

| Modelo requerido | Existe | Línea schema | Rol verificado |
|---|---|---|---|
| KnowledgeBlueprint | SÍ | L562 | estructura de conocimiento del job (jobId + blueprintVersion) |
| KnowledgeRequirement | SÍ | L587 | conocimiento requerido (domain/subdomain/importance) |
| KnowledgeItemVersion | SÍ | L612 | contenido versionado; correctAnswer protegido |
| KnowledgeAssessment | SÍ | L485 | conjunto congelado (assessmentVersion + scoringVersion) |
| KnowledgeAssessmentItem | SÍ | L529 | copia congelada por ítem (snapshot + hasKey + correctAnswerSnapshot) |
| KnowledgeAdministration | SÍ | L639 | binding candidato/aplicación + channel (PUBLIC_VACANCY / INTERNAL_POSITION) |
| KnowledgeResult | SÍ | L675 | registro de evidencia (INSUFFICIENT ≠ 0; separado de overallScore) |

Cadena canónica documentada en el propio schema (comentario L471–480): JOB → Blueprint → Requirement → ItemVersion → Assessment → AssessmentItem → Administration → Response → Result.

## 2. ¿Un solo motor para ambos flujos? SÍ — verificado por código

`src/lib/knowledge-canonical.ts` — `scoreCanonicalAdministration()` (L744–852) maneja explícitamente ambos canales:

| Canal | Consulta de respuestas | Líneas |
|---|---|---|
| `PUBLIC_VACANCY` | `vacancyApplicationResponse` (section='CONOCIMIENTOS') | L773–784 |
| `INTERNAL_POSITION` | `evaluationResponse` (knowledgeAdministrationId = administración) | L785–792 |

Invocaciones reales en los dos flujos:

| Flujo | Score | Persistencia de KnowledgeResult |
|---|---|---|
| INTERNAL (`/api/evaluations`) | `evaluations/route.ts` L1381 | `writeKnowledgeResult` L1461 + cierre de administración L1462–1465 |
| PUBLIC (`/api/public/apply`) | `apply/route.ts` L1481 (step 4 versionado) | `writeKnowledgeResult` L1487 + cierre L1488–1490 |

Congelación: INTERNAL `freezeAdministrationForCandidate` (import L10; uso en transacción L1056); PUBLIC `freezeKnowledgeForApplication` (apply L1244). Publicación solo SYSTEM (regla A-03.5) y claves nunca serializadas al candidato (evaluations L39, L115).

## 3. Semántica de evidencia (verificada línea por línea)

`scoreCanonicalAdministration` (L800–851):

| Condición | knowledgeScore | evidenceStatus | reasonCode |
|---|---|---|---|
| `keyedAnswered === 0` | **null** («INSUFFICIENT semantics — never 0», L828) | INSUFFICIENT | NO_KEYED_EVIDENCE / KNOWLEDGE_KEY_MISSING |
| `keyedAnswered >= totalKeyedItems` | correct/keyed ×100 (2 dec) | VALID | COMPLETE_KEYED |
| parcial | correct/keyed ×100 (2 dec) | LIMITED | PARTIAL_RESPONSE |
| ítem sin clave | excluido (`notScorable++`, L812–815) — «never scored as 0» | — | — |

Respuesta fuera de la administración congelada → error CONFIGURATION_ERROR (fail-closed, L806–810).

## 4. Capa LEGADA activa (convive por diseño — A-03.4: sin migración silenciosa)

| Flujo legado | Comportamiento actual | Divergencia vs canónico |
|---|---|---|
| INTERNAL sin administración | `calculateScores` legacy usa `r.question.correctAnswer` de la tabla viva; exige `correctAnswer !== null` (evaluations L227) | falta de clave → 0% real que SÍ participa (INSUFFICIENT-de-facto → 0) |
| PUBLIC sin versionado (`VERSIONED` no activo) | step 4 legacy: `correctIdx = vacancyQuestion ?? systemMap ?? 0` (apply L524–526) y `resp.correctAnswer ?? 0` en calculateScores (L122) | falta de clave → la opción 0 cuenta como CORRECTA (score inflado) |
| INTERNAL versionado | canónico puntúa el knowledgeScore (L1381–1382), PERO el `overallScore` ya fue computado por la fórmula legacy en L1350 con las claves vivas → el overall puede incrustar un valor de KN distinto del canónico | divergencia de procedencia (documentada en 05-overall) |

## 5. Reconciliación con reportes anteriores

| Fase | Reclamo | Estado actual | Veredicto |
|---|---|---|---|
| A-03.4 | versionado público de knowledge, stamp LEGACY sin migrar | CONFIRMED (schema L460–480; capa legada activa) | CONFIRMED |
| A-03.5 | cadena canónica + motor único + INSUFFICIENT≠0 + resultado separado | CONFIRMED (§1–3) | CONFIRMED |
| A-04.3 | «Knowledge canónico cumple INSUFFICIENT→null→excluido→renormalizado; legado divergente» | CONFIRMED | CONFIRMED |

## 6. Veredicto

- Modelos canónicos: **IMPLEMENTED** (7/7 entidades).
- Motor único INTERNAL+PUBLIC: **SÍ** (mismo `scoreCanonicalAdministration` + `writeKnowledgeResult`).
- Semántica INSUFFICIENT≠0 en el camino canónico: **SÍ**.
- Deuda documentada: capa legada activa con `?? 0` público y 0% interno; y el overall del flujo interno versionado se calcula con claves vivas (ver 05/09).
