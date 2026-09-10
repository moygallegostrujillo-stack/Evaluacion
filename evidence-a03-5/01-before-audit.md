# A-03.5 — PASO 1: AUDITORÍA BEFORE
## Normalización del Modelo Canónico de Knowledge Assessment
**Fecha:** auditoría ejecutada sobre el estado post-A-03.4 (worklog: A-03.4 GO, 34/34 tests)
**Modo:** solo lectura. CERO modificaciones de código en este PASO.

---

## A. MODELO INTERNO ACTUAL (flujo /api/evaluations — Position)

### Cadena real observada en código

```
Position (job)
  → EvaluationTemplate (type='CONOCIMIENTOS', order=3)
    → Question (category='KNOWLEDGE', type='MULTIPLE_CHOICE')
      → EvaluationSession (steps = templates, 1-indexed)
        → EvaluationResponse (sessionId + questionId + value)
          → EvaluationResult.knowledgeScore (al 'complete')
```

### Puntos exactos (archivo:línea, verificados hoy)

| Aspecto | Ubicación | Comportamiento |
|---|---|---|
| Inicio de evaluación | `src/app/api/evaluations/route.ts` POST `action='create-session'` (≈655) y `action='start'` (≈874) | Crea `EvaluationSession`; **NO congela ninguna versión de knowledge** |
| Generación de banco | `src/lib/generate-templates.ts` `generateTemplatesForPosition` (184–358) | Crea template CONOCIMIENTOS + Questions `category='KNOWLEDGE'`; **NO persiste `correctAnswer`** (create data: text/type/options/category/order/templateId — la clave del banco constante `KNOWLEDGE_QUESTIONS_BY_CATEGORY` se descarta) |
| Carga de preguntas | GET `?sessionId` (≈504–626), POST `next-step` (≈1019–1127) | Lee los templates **vivos** del banco en cada paso; sin resolución de versión |
| Resolución de versión | **INEXISTENTE** | No hay blueprint/assessment/versión en el flujo interno |
| Persistencia de respuesta | POST `action='answer'` (≈972–1014) | Upsert `EvaluationResponse` (sessionId, questionId, value). Sin snapshot, sin validación contra administración congelada |
| Cálculo knowledgeScore | `calculateScores` (≈101–111) vía `completeEvaluation` (≈1147) | `correct / knowledgeResponses.length` sobre `Question.correctAnswer` **vivo**; con claves nunca persistidas ⇒ numerador 0 |
| Exposición de clave | Serializaciones GET/next-step (≈497, ≈600, ≈956, ≈1101) | **`correctAnswer: q.correctAnswer` se envía al cliente candidato** (el cliente `EvaluationView.tsx` no lo consume — dead payload, pero es fuga real del secreto por API) |

### Qué queda congelado hoy en el flujo interno
**NADA para knowledge.** Ni versión de assessment, ni blueprint, ni itemVersions, ni scoringVersion, ni snapshot de clave. El candidato interno es evaluado contra "el banco vivo del momento de cada fetch".

---

## B. MODELO PÚBLICO ACTUAL (flujo /api/public/apply — Vacancy)

### Cadena real (post A-03.4)

```
Vacancy (job público)
  → banco vivo: VacancyQuestion (o fallback Question template CONOCIMIENTOS)
    → [step=data, transacción única] publishAssessmentForBank
      → KnowledgeAssessment (version=KA-v{n}, blueprintVersion='BP-v{n}' (string co-versionado),
                             scoringVersion='PUB-KS-v1', contentHash, status ACTIVE/RETIRED)
        → KnowledgeAssessmentItem (itemId, itemVersion, questionSnapshot,
                                   correctAnswerSnapshot server-only, hasKey, difficulty)
      → congelado en VacancyApplication (6 campos freeze)
  → respuestas: VacancyApplicationResponse (+ itemVersion/questionSnapshot/correctAnswerSnapshot)
  → scoring: scoreKnowledgeFromFrozenAdministration (denominador SOLO con clave; null si sin evidencia)
  → overallScore (fórmula intacta) → EvaluationResult bridge
```

### Puntos exactos

| Aspecto | Ubicación | Comportamiento |
|---|---|---|
| Resolución de versión | `src/lib/knowledge-versioning.ts` `publishAssessmentForBank` (221) | Una sola vez en `step=data` dentro de `db.$transaction` (apply route 1214); reusa ACTIVE por contentHash; publica v{n+1} si el banco cambió |
| Congelado | `VacancyApplication.knowledgeAssessmentId/Version/BlueprintVersion/ScoringVersion/FrozenAt/VersioningStatus` | 6 campos; fail-closed (rollback + 500 CONFIGURATION_ERROR/INTERNAL_ERROR) |
| Carga de preguntas | GET step 4 del apply route | Sirve items del assessment **congelado**, sin clave |
| Respuesta | POST step=answer (apply route 1318–1359) | Valida pertenencia a la administración congelada (403 ITEM_NOT_IN_ADMINISTRATION); escribe snapshot server-side |
| Scoring | POST step=advance completedStep=4 → `scoreKnowledgeFromFrozenAdministration` | correct/keyed/not-scorable; `null` si sin evidencia (INSUFFICIENT ≠ 0); banco vivo jamás consultado |
| Clasificación legacy | advance route 1484 | LEGACY explícito para filas pre-A-03.4; sin migración |

### Qué queda congelado hoy en el flujo público
assessmentVersion (KA-v{n}) + blueprintVersion (BP-v{n}, **string co-versionado, no entidad**) + itemVersions + scoringVersion + snapshots por respuesta. **La "entidad" blueprint NO existe: es un número de versión sin filas.**

---

## C. DIFERENCIAS INTERNO vs PÚBLICO

| Dimensión | Interno (Position) | Público (Vacancy) |
|---|---|---|
| Entidad "job" | Position | Vacancy |
| Fuente de items | EvaluationTemplate/Question vivos | VacancyQuestion (fallback Question) vivo |
| Blueprint | No existe | String `BP-v{n}` (no entidad, sin requirements) |
| Requirement | No existe | No existe |
| ItemVersion | No existe (solo Question mutable) | KnowledgeAssessmentItem.itemVersion (por administración) |
| Assessment versionado | No existe | KnowledgeAssessment (entidad real) |
| Administration (qué recibió el candidato) | No existe (implícito: sesión + banco vivo) | Implícito: 6 campos freeze en VacancyApplication (no entidad) |
| Congelado al inicio | NINGUNO | Sí, transaccional y fail-closed |
| Scoring de knowledge | Banco vivo + clave nunca persistida ⇒ 0 | Administración congelada + claves server-side ⇒ null/valor |
| Exposición de clave al candidato | **SÍ se serializa** (dead payload) | NO (deep-scan A-03.4) |
| Clasificación LEGACY | No aplica (no hay versionado) | LEGACY/NOT_APPLICABLE/VERSIONED |
| Reconstrucción histórica | Imposible (banco vivo mutable) | Garantizada por snapshots |

## D. ENTIDADES DUPLICADAS / DIVERGENTES (hallazgo central)

1. **Dos definiciones de "la prueba de conocimientos":**
   - Interno: template CONOCIMIENTOS del Position (evaluado contra banco vivo).
   - Público: KnowledgeAssessment congelado derivado del banco de la Vacancy.
   **No comparten ni un solo tipo.** El mismo conocimiento se administra por dos instrumentos estructuralmente distintos según el canal — exactamente lo que PASO 16 (cross-flow) prohíbe.
2. **"Blueprint" duplicado en concepto:** interno usa `EvaluationTemplate(type=CONOCIMIENTOS)` como blueprint de facto; público usa un string co-versionado. Ninguno es la entidad KnowledgeBlueprint.
3. **Dos motores de scoring de knowledge:** `calculateScores` (evaluations, banco vivo, denominador = todas las respuestas) vs `scoreKnowledgeFromFrozenAdministration` (apply, congelado, denominador solo con clave). Divergen en resultado para la misma respuesta.
4. **Doble representación del item:** `Question`/`VacancyQuestion` (banco vivo mutable) vs `KnowledgeAssessmentItem` (snapshot por administración, sin requirement).
5. **Doble almacenamiento del resultado de knowledge:** `EvaluationResult.knowledgeScore` / `VacancyApplication.knowledgeScore` (mezclados con overallScore en la misma fila) — sin entidad KnowledgeResult con estado de evidencia.
6. **Root cause A-03.1 aún vivo en el flujo interno:** `generateTemplatesForPosition` sigue descartando `correctAnswer` (líneas 292–301 y 314–323) ⇒ el knowledge interno sigue sin evidencia válida de clave.

## E. QUÉ ESTÁ CONGELADO EN CADA FLUJO (resumen)

| Información | Interno | Público |
|---|---|---|
| assessmentVersion | ❌ | ✅ KA-v{n} |
| blueprintVersion | ❌ (ni entidad ni versión) | ⚠️ string BP-v{n} sin entidad |
| scoringVersion | ❌ | ✅ PUB-KS-v1 |
| itemVersions | ❌ | ✅ por KnowledgeAssessmentItem |
| question/options snapshot | ❌ | ✅ |
| correctAnswer protegida | ❌ (ni persiste ni protege; se expone) | ✅ server-only |
| Administration re-construible | ❌ | ⚠️ implícita vía campos freeze |
| KnowledgeResult con estado de evidencia | ❌ (solo Float mezclado con overall) | ❌ (idem) |

## F. CONCLUSIÓN DEL BEFORE

- El modelo canónico pedido (JOB → BLUEPRINT → REQUIREMENT → ASSESSMENT → ITEM VERSION → ADMINISTRATION → RESPONSE → RESULT) **existe solo a medias en el flujo público** (assessment+items+freeze fields) y **no existe en absoluto en el interno**.
- Gap neto: **6 entidades canónicas faltantes** (KnowledgeBlueprint, KnowledgeRequirement, KnowledgeItemVersion, KnowledgeAdministration, KnowledgeResult como entidad, y KnowledgeAssessment generalizado a job genérico), **1 flujo interno sin congelar**, **2 motores de scoring divergentes**, **1 fuga de clave al candidato interno**, **1 root cause de clave no persistida en generate-templates**.
- Este PASO no modificó código. Los PASOs 2–18 implementan el cierre.

**Estado: AUDITORÍA BEFORE COMPLETA — 0 archivos modificados.**
