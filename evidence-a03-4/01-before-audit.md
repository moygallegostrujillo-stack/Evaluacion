# A-03.4 — PASO 1 · AUDITORÍA BEFORE (sin modificar código)

**Fase:** EVALUHR A-03.4 — CIERRE DE VERSIONADO EN VACANTES PÚBLICAS
**Fecha:** 2026-02-11
**Alcance de esta auditoría:** SOLO lectura. Ningún archivo fue modificado en este PASO.
**Mandato:** Localizar dónde inicia una evaluación pública, qué sesión se crea, qué
assessment/versión se usa, qué preguntas se cargan, cuándo se resuelve la versión,
qué se guarda y dónde se calcula knowledgeScore.

---

## 1. Dónde inicia actualmente una evaluación pública

| Elemento | Archivo | Líneas | Evidencia |
|---|---|---|---|
| Único entrypoint del flujo público | `src/app/api/public/apply/route.ts` | `POST` handler, L1030–1144 | `step:'data'` crea la administración |
| Creación de la administración | ídem | L1124–1136 | `db.vacancyApplication.create({ status:'IN_PROGRESS', currentStep:0, startedAt })` |
| Cliente público (UI) | `src/components/views/PublicEvaluationView.tsx` | L85 | único consumidor de `/api/public/apply` |

La administración pública se materializa **exclusivamente** como `VacancyApplication`.
No existe ninguna entidad de "Knowledge Assessment" en todo el schema.

## 2. Qué sesión se crea

- **Al inicio (step=data):** solo `VacancyApplication` (currentStep=0, IN_PROGRESS).
- **Al completar (step=advance, nextStep=5):** se crea un *puente* posterior:
  `EvaluationSession` (status COMPLETED) + `EvaluationResult`
  (`route.ts` L1379–1467). Este puente copia los scores ya calculados; no participa
  en la selección de preguntas ni de claves.

## 3. Qué assessment / versión se utiliza

**NINGUNO — no existe resolución de versión.**

- `prisma/schema.prisma`: NO existen modelos `KnowledgeBlueprint`,
  `KnowledgeRequirement`, `KnowledgeAssessment` ni ningún campo de versión en
  `VacancyApplication` / `VacancyApplicationResponse`.
- El "banco de conocimientos" de una vacante son las filas `VacancyQuestion`
  (editables en vivo) con fallback a `Question` (template CONOCIMIENTOS del primer
  `Position` de la empresa vía `getSystemQuestions(companyId)`, L278–396).

## 4. Qué preguntas se cargan (GET / resume)

`GET /api/public/apply?applicationId&token` — rama `currentStep === 4` (L936–974):

1. Preguntas de la vacante (`vacancy.questions`, order asc) — `correctAnswer: undefined` (bien: no se expone clave).
2. Si la vacante no tiene preguntas → fallback a `getSystemQuestions(...).knowledgeQuestions` (template del Position).

**Defecto detectado en el fallback:** en el fallback de template, la respuesta
construye `vacancyQuestionId: q.id` (L963) donde `q` es una `Question` (template),
NO una `VacancyQuestion`. Si el candidato respondiera, el `step=answer` escribiría
un `vacancyQuestionId` colgante → violación de FK en SQLite (Prisma activa
`foreign_keys=ON`). La vía correcta para template sería `questionId: q.id`
(así lo espera el scoring: `systemKnowledgeMap.get(resp.questionId)` L507–517).

## 5. Cuándo se resuelve la versión

**Nunca.** Cada llamada re-consulta el banco vivo:

| Llamada | Consulta al banco vivo |
|---|---|
| `GET` step 4 | `getSystemQuestions(companyId)` + `vacancy.questions` en cada resume (L938) |
| `step=advance completedStep=4` | `calculateStepScores` → `getSystemQuestions(companyId)` **al momento de calificar** (L501–529) + `resp.vacancyQuestion?.correctAnswer` (lectura viva) |

Consecuencia: una edición del banco (texto, opciones, clave, agregar/borrar
preguntas vía `PUT/POST/DELETE /api/vacancies/[id]/questions` o vía IA en
`/api/vacancies/[id]/generate-questions`) **cambia retroactivamente** la
administración de un candidato que ya inició:
las preguntas que verá al resumir y la clave usada al calificar no están
congeladas en ningún punto.

## 6. Qué se guarda actualmente

`VacancyApplicationResponse` (schema L396–414):
`applicationId, questionId?, vacancyQuestionId?, section, value, numericValue, companyId, createdAt`.

**NO se guarda:** assessmentVersion, blueprintVersion, itemVersion,
scoringVersion, snapshot de pregunta, snapshot de clave.

## 7. Dónde se calcula knowledgeScore

1. `calculateStepScores(..., completedStep === 4)` en `step=advance` (L501–529):
   `correct / respondidas * 100` con
   `correctIdx = resp.vacancyQuestion?.correctAnswer ?? systemKnowledgeMap.get(...)?.correctAnswer ?? 0`.
   - **`?? 0` es la contaminación K-CA ya identificada en A-03.1/A-03.3**:
     un reactivo sin clave se califica como si la opción 0 fuera correcta.
2. `calculateScores()` (L104–119) contiene un bloque knowledge equivalente
   (se usa en pasos 1–3 y en el puente; no en la vía step-4).
3. `calculateOverallScore()` (L538–661): pesos adaptativos, knowledge 0.35 cuando
   hay 4 secciones — untouched por A-03.4.

## 8. HALLAZGO CRÍTICO — mismatch de numeración de pasos (gap neto)

El backend define: `0=data, 1=psicométrica, 2=psicológica, 3=INTEGRIDAD,
4=CONOCIMIENTOS, 5=done` (la integridad se insertó como "new step", L901–934).
El cliente público quedó en la numeración antigua
(`PublicEvaluationView.tsx`: `getStepNumber('conocimientos')=3`, L426;
`skipToNextSection` conocimientos→3, L178–182; `mapStepToView(4)→'complete'`, L238).

**Efecto neto trazado:**
1. Tras psicológica, backend manda a step 3 (INTEGRIDAD) y sirve preguntas
   `INTEGRITY_*`.
2. El frontend está en la pata "conocimientos", filtra `category==='KNOWLEDGE'`
   → 0 coincidencias → `skipToNextSection` → `advance(3)`.
3. Backend avanza a step 4; frontend interpreta `nextStep=4` como `'complete'`.
4. **Las preguntas de conocimiento NUNCA se administran en el flujo público y
   `knowledgeScore` nunca se calcula (queda null).**

Es decir: el gap que A-03.4 debe cerrar es doble —
(a) no hay congelamiento de versión en ningún punto, y
(b) la pata conocimientos del flujo público está silenciosamente muerta por el
mismatch cliente/servidor, por lo que hoy "no congelar" ni siquiera es observable.

## 9. Seguridad actual (contexto para PASO 10)

- Token HMAC requerido en GET/answer/advance (VUL-H2 cerrado en Fase 3.5-H). ✔
- `correctAnswer` no se expone en GET step 4 (`correctAnswer: undefined`). ✔
- El cliente NO puede enviar versiones/claves porque los campos no existen —
  tras A-03.4 deben **rechazarse explícitamente** (deny-list fail-closed).
- El drift de clave/preguntas NO es controlado por el cliente, pero sí provocado
  por ediciones del banco entre `answer` y `advance` (servidor).

## 10. Datos legacy

- `db/custom.db` en este entorno: 0 empresas, 0 vacantes, 0 aplicaciones
  (estado medido con PrismaClient antes de tocar código).
- Regla heredada (A-03.3 PASO 16/19): filas históricas sin metadatos de versión
  = `LEGACY`; prohibido migrarlas o reinterpretarlas.

## 11. Superficie IA actual

`POST /api/vacancies/[id]/generate-questions`: escribe preguntas (con clave)
directamente en el banco vivo `VacancyQuestion`. Sin versionado, esas filas
entran retroactivamente en administraciones ya iniciadas (en la vía vacante).
Tras A-03.4: la IA solo puede alterar el banco (borrador de banco); un
congelamiento nuevo produce versión nueva; administraciones congeladas quedan
intactas (verificable en PASO 11/tests).

## 12. Conclusión del BEFORE

| Pregunta del mandato | Respuesta |
|---|---|
| ¿Dónde inicia la evaluación pública? | `POST /api/public/apply` step=data → `VacancyApplication` |
| ¿Qué sesión se crea? | Solo `VacancyApplication`; puente `EvaluationSession`+`EvaluationResult` al completar |
| ¿Qué assessment/versión se usa? | Ninguno — no existe concepto de versión |
| ¿Qué preguntas se cargan? | `VacancyQuestion` de la vacante; fallback template CONOCIMIENTOS (con bug de FK en fallback) |
| ¿Cuándo se resuelve la versión? | Nunca — banco vivo en cada GET y en el scoring |
| ¿Qué se guarda? | Respuesta cruda sin versiones ni snapshots |
| ¿Dónde se calcula knowledgeScore? | `calculateStepScores` completedStep=4 (con `?? 0`), en `advance` |

**Gap A-03.3 confirmado en este código:** el flujo público no congela NADA al
inicio. **Gap adicional descubierto:** paso conocimientos muerto por mismatch
de numeración (front 3 vs back 4).

**Estado:** auditoría terminada. SE AUTORIZA A PARTIR DE AQUÍ modificar
exclusivamente: `/api/public/apply`, modelos directamente necesarios para el
congelamiento de knowledge, código de administración/snapshot/versionado de
knowledge, cliente del flujo público y tests específicos public-apply/knowledge.
