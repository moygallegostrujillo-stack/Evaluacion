# EVALUHR — A-03.2 · PASO 18a
# AUDITORÍA POSTERIOR (AFTER) — ESTADO FINAL DEL CÓDIGO

> Documento de auditoría posterior a la corrección. Fecha: 2026-09-10.
> Contrasta cada causa raíz de `01-before-audit.md` con el estado final
> verificado (código + tests + E2E contra el dev server).

---

## 1. Veredicto por causa raíz

| RC | Causa (antes) | Estado AFTER | Verificación |
|---|---|---|---|
| RC-1 | generate-templates.ts omitía `correctAnswer` del banco de categoría | **CORREGIDA** — la clave se persiste en todo `question.create` de conocimientos | `git diff src/lib/generate-templates.ts`; E2E [5]: 10 items con snapshot |
| RC-2 | Respaldo genérico = auto-reportes sin clave (KS-3) | **RETIRADO** — el fallback ahora usa el banco GENERAL (conocimiento objetivo con claves) | generate-templates.ts §CONOCIMIENTOS else-branch |
| RC-3 | seed.ts omitía `correctAnswer` pese a declararlo | **CORREGIDA** — seed persiste claves + gobernanza (5 posiciones, 50 reactivos) | scripts/a032-classify-knowledge.ts: 50×A, 0×B |
| RC-4 | Scoring sesión: item sin clave en denominador (0 forzado) | **CORREGIDA** — `scoreKnowledgeItems()` en `src/lib/knowledge/scoring.ts`; sin clave ⇒ NOT_SCORABLE ⇒ INSUFFICIENT | TEST 3/4/5; E2E [7]: score=null, INSUFFICIENT |
| RC-5 | Scoring vacantes: `?? 0` inventaba clave (opción 0) | **CORREGIDA** — ambas ocurrencias (l.~122 y helper step 4) eliminadas; clave null ⇒ NOT_SCORABLE | public/apply/route.ts (rg `?? 0` = 0 resultados en scoring de knowledge) |
| RC-6 | Sin estados ni versionado de items | **CORREGIDA** — `Question.knowledgeStatus/itemVersion/correctAnswerSource/correctAnswerRationale/origin/reviewedBy/approvedBy/previousCorrectAnswer/correctAnswerChangedAt` | schema.prisma (+36 líneas, todas knowledge-scoped) |
| RC-7 | Fuga de correctAnswer a CANDIDATO | **CORREGIDA** — 4 serializaciones de /api/evaluations + 3 de /api/questions filtran por rol | E2E [2]: fuga=NO por la ruta real start/next-step |
| RC-8 | Escritura de claves sin rol ni auditoría | **CORREGIDA** — POST/PUT/DELETE /api/questions exigen RH/GERENTE/SUPER_ADMIN (403 + logUnauthorizedAccess para CANDIDATO); cambio de clave ⇒ itemVersion+1, previousCorrectAnswer, audit log | questions/route.ts; TEST 7 |
| RC-9 | Sin congelamiento de clave por administración | **CORREGIDA** — `EvaluationResponse.correctAnswerSnapshot/scoringOutcome` se congelan al calificar; no existe ruta de recálculo histórico | E2E [5]: 10 snapshots; TEST 8 |

## 2. Estado final de la arquitectura

```
src/lib/knowledge/
  scoring.ts      ← reglas puras de scoring (testeadas con bun:test)
  system-bank.ts  ← claves + rationale + gobernanza del banco del sistema
src/app/api/evaluations/route.ts   ← flujo sesión: usa scoring.ts + congela claves + oculta clave
src/app/api/public/apply/route.ts  ← flujo vacantes: usa scoring.ts (sin ?? 0) + persiste estado
src/app/api/questions/route.ts     ← gobernanza de reactivos: roles, validación, versionado
src/lib/generate-templates.ts      ← persiste claves + estados + knowledgeScoringVersion
prisma/seed.ts                     ← persiste claves + estados + knowledgeScoringVersion
src/components/views/CandidateDetailView.tsx ← mensaje INSUFFICIENT para RH (PASO 16)
```

## 3. Verificación de comportamiento (resumen de corridas reales)

- **Unit tests**: 11/11 pass (TEST 1–10 + EXTRA) — `bun test tests/knowledge-scoring.test.ts`.
- **E2E (dev server real, `scripts/a032-e2e-knowledge.ts`)**: APROBADO 5/5:
  1. Sin fuga de clave a CANDIDATO (ruta start/next-step).
  2. Flujo completo: knowledgeScore=80, knowledgeStatus=VALID, scoringVersion=KNOWLEDGE-SCORING-1.0.
  3. 10 respuestas con `correctAnswerSnapshot` + `scoringOutcome` congelados.
  4. Con clave eliminada (simulación): knowledgeScore=null (NO 0), INSUFFICIENT, KNOWLEDGE_KEY_MISSING.
  5. Limpieza: los datos de verificación se eliminan (DB queda como seed).
- **Navegador**: login RH → dashboard → detalle de candidato; el resultado legacy (55%) sigue mostrándose igual; sin errores de consola.
- **Lint**: limpio. **tsc**: sin errores nuevos en archivos tocados (los errores pre-existentes del baseline no cambian).

## 4. Scope de la modificación (git)

```
 M prisma/schema.prisma                      (+36, solo campos knowledge)
 M prisma/seed.ts                            (+37, persistencia de claves)
 M src/app/api/evaluations/route.ts          (scoring knowledge + seguridad)
 M src/app/api/public/apply/route.ts         (scoring knowledge vacantes)
 M src/app/api/questions/route.ts            (gobernanza + seguridad)
 M src/components/views/CandidateDetailView.tsx (mensaje INSUFFICIENT)
 M src/lib/generate-templates.ts             (persistencia de claves)
 M src/lib/store.ts                          (+3 campos de tipo)
?? src/lib/knowledge/  (scoring.ts + system-bank.ts)
?? tests/knowledge-scoring.test.ts
?? scripts/a032-classify-knowledge.ts · scripts/a032-e2e-knowledge.ts
?? evidence-a03-2/
```

NO modificados: IPIP (`src/lib/instruments/ipip50-mx.ts`), integridad, competencias, entrevistas, JobFit, recomendaciones, contrato, aviso, RLS, Supabase, autenticación.
