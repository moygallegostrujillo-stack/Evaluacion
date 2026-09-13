# EVALUHR — A-03.2 · PASO 1
# AUDITORÍA PREVIA (BEFORE) — SOLO LECTURA, SIN MODIFICAR NADA

> Documento de auditoría previa a la corrección. Fecha: 2026-09-10.
> Método: inspección de solo lectura de código, schema y base de datos.
> Ningún archivo fue modificado para elaborar este documento.

---

## 1. Dónde se generan preguntas de conocimiento

**`src/lib/generate-templates.ts`** — `generateTemplatesForPosition(positionId, title, category, hasKnowledgeTest)`:

- Banco en memoria `KNOWLEDGE_QUESTIONS_BY_CATEGORY` (líneas 53–162) con 9 categorías:
  - **CON clave declarada** (5): MESERO (l.55–64), CAJERO (l.115–124), HOSTESS (l.127–136), LAVAPLATOS (l.139–148), GENERAL (l.151–160).
  - **SIN clave declarada** (4): COCINERO (l.66–77), BARTENDER (l.78–89), GERENTE_PISO (l.90–101), VENDEDOR (l.102–113) — 40 preguntas sin clave ni siquiera en el banco.
- **Respaldo genérico** (l.312–333): 5 preguntas de auto-reporte ("¿Conoce…? Sí/Parcialmente/No") — sin clave por diseño; clasificadas KS-3 (A-03.1 PASO 8): no son reactivos de conocimiento objetivo.

Invocadores: `src/app/api/positions/route.ts` (creación de puesto) y `src/app/api/evaluations/route.ts` (auto-generación en GET de sesión l.558–583 y en 'next-step' l.1046–1073).

## 2. Dónde se persiste cada pregunta

- `db.question.create` en `generate-templates.ts`:
  - IPIP-50-MX (l.240–251): `text, type LIKERT, category, reverseScored, order, evaluationTemplateId` — correcto (LIKERT no usa clave).
  - PSICOLÓGICA (l.267–279): idem — correcto.
  - **CONOCIMIENTOS con banco de categoría (l.300–309): persiste `text, type MULTIPLE_CHOICE, options, category KNOWLEDGE, order, evaluationTemplateId` — OMITE `correctAnswer` aunque el banco lo declare ⇒ RC-1.**
  - **Respaldo genérico (l.321–333): omite `correctAnswer` (el banco genérico no declara ninguna) ⇒ RC-2.**
- `prisma/seed.ts` (l.289–373): las 10 preguntas de conocimientos de Mesero **declaran** `correctAnswer` (l.295–358) pero el `db.question.create` (l.363–372) **omite el campo** ⇒ RC-3 (misma clase de bug en el seed).
- `src/app/api/questions/route.ts` POST (l.174–187): SÍ persiste `correctAnswer` (l.182), pero acepta `null` sin restricciones para preguntas KNOWLEDGE/MULTIPLE_CHOICE (ver §7).

## 3. Dónde debería persistirse correctAnswer

- `prisma/schema.prisma` `Question.correctAnswer Int?` (l.176) — la columna EXISTE y es nullable. La persistencia debía ocurrir en los `create` de §2 (RC-1/RC-2/RC-3) — el modelo no era el problema.
- No existe ningún snapshot de la clave usada al calificar (congelamiento PASO 10) ni campos de estado/versión en `Question` (ver §7).

## 4. Dónde se calcula knowledgeScore

### 4.1 Flujo de invitación/sesión — `src/app/api/evaluations/route.ts`

- `calculateScores()` (l.37–231), bloque de conocimientos l.112–124:

```
const knowledgeResponses = responses.filter(… category KNOWLEDGE && MULTIPLE_CHOICE)
if (knowledgeResponses.length > 0) {
  let correct = 0
  for (resp) { if (resp.question.correctAnswer !== null && selectedIdx === resp.question.correctAnswer) correct++ }
  knowledgeScore = Math.round((correct / knowledgeResponses.length) * 100)
}
```

⇒ **RC-4**: el item sin clave entra al DENOMINADOR pero nunca al numerador ⇒ missing key = incorrecta forzada ⇒ `knowledgeScore = 0` para todo candidato.

- Consumo del score: `overallScore` (l.149–196, con pesos; INSUFFICIENT→null hoy NO existe) · `guidance` (l.202–209: PERFIL_COMPLETO requiere knowledgeScore !== null) · `generateSummary` (l.322–332: frases por rangos de score).
- 'complete' → `completeEvaluation()` (l.1159–1314): calcula y persiste `EvaluationResult` (l.1270–1298); `hasKnowledge = scores.knowledgeScore !== null` (l.1228) para PERFIL_COMPLETO de sesiones IPIP-50.

### 4.2 Flujo de vacantes públicas — `src/app/api/public/apply/route.ts`

- Scoring inline l.113–128: `const correctIdx = resp.correctAnswer ?? 0` ⇒ **RC-5**: clave ausente se CONVIERTE EN 0 (¡se inventa una clave: la opción 0!).
- Helper step-based (l.546–574): `resp.vacancyQuestion?.correctAnswer ?? systemKnowledgeMap.get(...)?.correctAnswer ?? 0` — mismo `?? 0` ⇒ RC-5b.
- `calculateOverallScore()` (l.583+): `hasKnowledgeData = knowledgeScore !== null` (l.605).

### 4.3 Otros consumidores (solo lectura del valor)

`src/app/api/results/route.ts` (list/compare, promedios l.202), `src/app/api/candidates/route.ts` (l.140–168), `src/app/api/vacancies/[id]/applications/route.ts` (l.65), `src/app/api/public/video/route.ts` (l.89–163: `hasKnowledge = knowledgeScore !== null && > 0`), `src/lib/retention.ts` (l.222), `src/components/views/CandidateDetailView.tsx` (l.119–128, 511–521: muestra el % si no es null), `VacancyManagementView`, `CompareView`.

## 5. Qué rutas utilizan esas preguntas

| Ruta | Uso |
|---|---|
| `GET/POST /api/evaluations` | Sirve plantillas/preguntas al candidato (GET sesión), guarda respuestas ('answer'), avanza pasos, completa y puntúa ('complete') |
| `POST /api/public/apply` | Flujo público de vacantes: pasos 0–5, incluye conocimientos (paso 4) |
| `GET/POST/PUT/DELETE /api/questions` | RH/SUPER_ADMIN: listar, crear, editar, eliminar preguntas personalizadas (incluye correctAnswer) |
| `GET /api/vacancies/[id]/questions` · `POST /api/vacancies` | Preguntas de vacante (VacancyQuestion con correctAnswer, creadas por RH) |
| `GET /api/results`, `GET /api/candidates` | Lectura de resultados para RH/frontend |

## 6. Modelos Prisma participantes

- `Question` (l.166–183): `correctAnswer Int?`, sin estado de ciclo de vida, sin versión, sin fuente de clave, sin revisor/aprobador, sin snapshot.
- `EvaluationTemplate` (l.138–164): tiene `scoringVersion` (usada por IPIP), sin versión de scoring de conocimientos.
- `EvaluationResponse` (l.224–241): `value String`, `numericValue Int?` — **no** congela la clave usada ni el desenlace por item.
- `EvaluationResult` (l.243–302): `knowledgeScore Float?` — **no** distingue "no aplica" de "INSUFFICIENT"; sin reasonCode ni estado de scoring.
- `VacancyApplication` (l.362–429): `knowledgeScore Float?` — mismas carencias.
- `VacancyQuestion` (l.342–360): `correctAnswer Int?` — sin estados/versión (flujo de vacantes).

## 7. Estados actuales de una pregunta y hallazgos de seguridad

- **Estados**: SOLO `active` existe en `EvaluationTemplate` (Boolean). `Question` **no tiene ningún estado** (ni DRAFT/ACTIVE, ni SCORABLE/NOT_SCORABLE, ni revisión ni versión). ⇒ RC-6.
- **Fuga de clave (RC-7)**: `GET /api/evaluations` devuelve `correctAnswer: q.correctAnswer` al candidato en 3 serializaciones (l.509, l.612, l.1113) y `GET /api/questions` (l.98) lo devuelve a **cualquier usuario autenticado sin filtro de rol**. (El flujo público de vacantes SÍ la oculta: `public/apply` l.1025/1039 `correctAnswer: undefined`.)
- **Escritura de clave sin control de rol (RC-8)**: `POST/PUT /api/questions` (l.111–206, 209–298) no verifican rol — un CANDIDATO autenticado podría crear/editar preguntas y claves; el PUT permite cambiar la clave de una pregunta ya administrada sin auditoría de versión ni congelamiento.
- **Sin congelamiento (RC-9)**: no existe snapshot de clave por administración (PASO 10) ni prohibición operativa de recálculo histórico.

## 8. Datos existentes (clasificación preliminar; PASO 13 la ejecuta con script)

- Preguntas KNOWLEDGE generadas por `generateTemplatesForPosition`: todas con `correctAnswer = null` (RC-1/RC-2) — categoría B (ausente).
- Preguntas KNOWLEDGE del seed: también null (RC-3) — categoría B.
- Preguntas personalizadas creadas vía `/api/questions` con clave: categoría A (posibles C/D por revisar: clave fuera de rango de opciones = C; plantillas legacy = D).
- Resultados históricos: `knowledgeScore` existentes se conservan tal cual (no se recalculan).

## 9. Resumen de causas raíz (identificadas ANTES de tocar código)

| # | Causa raíz | Ubicación exacta |
|---|---|---|
| RC-1 | El create omite `correctAnswer` del banco de categoría | generate-templates.ts l.300–309 |
| RC-2 | Respaldo genérico: auto-reportes sin clave (KS-3) | generate-templates.ts l.312–333 |
| RC-3 | El seed omite `correctAnswer` pese a declararlo | prisma/seed.ts l.362–373 |
| RC-4 | Scoring: item sin clave cuenta en denominador y nunca como correcto | evaluations/route.ts l.112–124 |
| RC-5 | Scoring vacantes: `?? 0` inventa clave (opción 0) | public/apply/route.ts l.122 y l.560–562 |
| RC-6 | Sin estados ni versionado de items | schema.prisma Question |
| RC-7 | Fuga de correctAnswer a CANDIDATO | evaluations/route.ts l.509/612/1113; questions/route.ts l.98 |
| RC-8 | Escritura de claves sin rol ni auditoría | questions/route.ts POST/PUT |
| RC-9 | Sin snapshot de clave por administración (congelamiento) | schema.prisma EvaluationResponse |

**Estado al cierre de esta auditoría: 0 archivos modificados.**
