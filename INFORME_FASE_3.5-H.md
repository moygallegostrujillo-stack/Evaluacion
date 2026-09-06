# EVALUHR — FASE 3.5-H
# CIERRE HIGH + SCHEMA DRIFT

Fecha: 2026-09-06 · Producción: NO tocada · RLS: NO activado · Informe paralelo: INFORME_FASE_3.5-G.md

---

## 1. Resumen
Las 6 vulnerabilidades HIGH de la auditoría G quedaron **corregidas y verificadas por un
auditor independiente** (FIXED-VERIFIED en las 6), el BLOCKER de schema drift quedó
**cerrado** (parity estructural 18/18 modelos), y el conjunto de artefactos RLS quedó
coherente 15/15 tablas. 181 checks de seguridad+regresión PASS, 0 errores TypeScript
nuevos, lint EXIT=0, build EXIT=0. **RLS PostgreSQL NO ACTIVADO** (preparado, no ejecutado).

## 2. H1 Token legacy
`src/lib/public-token.ts` reescrito: verificación **HMAC-only** en tiempo constante
(`timingSafeEqual` con pre-cheque de longitud público). El fallback `token === resourceId`
fue **eliminado definitivamente**: sin modo legacy, sin flag, sin compat, sin debug.
Verificación: 0 usos funcionales en repo (grep); los 4 callers (apply GET/answer/advance,
video) validan ANTES de cualquier lookup; GET nunca acuña tokens.
Tests: H1-1 (sin token→404), H1-2 (legacy→404), H1-3 (HMAC válido→200), H1-4 (legacy en
answer→403 TOKEN_INVALID). **FIXED-VERIFIED.**

## 3. H2 Public Apply
- **GET** `/api/public/apply`: token HMAC requerido ANTES del lookup; 404 genérico sin
  señal de existencia; **ya no acuña ni devuelve tokens**.
- **POST step=data resume**: prueba de posesión basada en el flujo real del producto —
  el candidato re-ingresa los datos que ya registró (nombre siempre; teléfono cuando fue
  almacenado). Sin prueba → 403 `RESUME_PROOF_MISMATCH` sin applicationId/token/PII.
  No se inventó ningún sistema de credenciales adicional.
- **Creación**: sigue emitiendo el token HMAC (comportamiento legítimo intacto).
- Frontend: los 3 GET de resume envían el token almacenado; sin token → vuelve a
  vacancy-info (re-entrada de datos → prueba → token fresco).
- **Tests H2-1..H2-8: PASS** (legítimo OK; email+slug sin posesión→DENIED; email A+slug B
  no entrega A; applicationId sin token→404; token incorrecto→404; bindings cruzados→404;
  denegación sin datos).
- Nota documentada (H2-8): la señal de existencia es inherente a la regla de producto
  "una postulación por email por vacante" (NO modificada); la capacidad NUNCA se emite
  sin prueba. Residual LOW del auditor: teléfono con NULL almacenado → prueba solo por
  nombre (documentado; recomendación futura: requerir teléfono en la creación).

## 4. H3 Candidate listings
CANDIDATO ya no alcanza ningún listado administrativo (application-layer, no RLS):
- `candidates` GET → **403** + AuditLog.
- `interviews` GET → bare **403**; flujo legítimo propio `?candidateId=<own>` → 200 solo
  propias; candidateId ajeno → 403. PATCH de estado → 403 para CANDIDATO.
- `vacancies` GET → **403** (el candidato consume el catálogo público).
- `vacancies/[id]/applications` GET → **403**.
- `invite` GET → **403** (exponía tokens de invitación).
- `results` sin parámetros → solo propios (force-bind D.2.6 intacto; verificado).
- Own-resource legítimo → 200 (H3-5); A2 → 403 (H3-6); B → 404 sin existencia (H3-7).
- AUD-1: 19 entradas UNAUTHORIZED_ATTEMPT del actor CAND-A durante la suite. **FIXED-VERIFIED.**

## 5. H4 Invite delete
DELETE `/api/invite`: CANDIDATO→403; RH/GERENTE→solo su tenant; **SA sin `?companyId`→400**
(el aggregate jamás muta tenants); SA con target→impersonación auditada; cross-target→404;
`?all=true` siempre single-tenant (nunca `{}` global); todas las destrucciones auditadas.
POST: `position.companyId` debe pertenecer al tenant del invite (cierra el oracle de título).
Tests H4-1..H4-7 PASS (incl. verificación de fila AuditLog de impersonation). **FIXED-VERIFIED.**

## 6. H5 User company reassignment
users PUT: no-SA **nunca** aplica `companyId` del body (distinto→403+audit; igual→ignorado);
SA puede transferir con **AuditLog completo** (oldCompanyId, newCompanyId, targetUserId,
targetUserEmail, changedFields). Re-login tras restauración → tenant original (H5-5 PASS).
POST/PATCH(toggle/password/delete)/DELETE ahora auditados (PARTE 8). Tests H5-1..H5-5 PASS.
**FIXED-VERIFIED.**

## 7. H6 SA global lists
Cuarta vía eliminada. Nuevas funciones admin-db (assert SUPER_ADMIN → AuditLog ANTES de
leer → fail-closed sin ADMIN_DATABASE_URL, cliente nunca exportado):
`getAggregateUserDirectory`, `getAggregateInterviewDirectory`, `getAggregateVacancyDirectory`,
`getAggregatePositionCatalog`.
- users/interviews/vacancies GET (SA sin target) → **admin-db** (misma forma de respuesta →
  UI intacta); RH/GERENTE → `createRLSClient` (canal TENANT).
- users GET SA con `?companyId` → impersonación auditada con `createSuperAdminRLSClient`.
- **PARTE 7**: `positions?all=true` → no-SA **403**+audit; SA → admin-db (READ_CATALOG).
- ESLint guard actualizado: whitelist admin-db = exactamente 7 rutas (3 metrics + 4 nuevas).
- Fail-closed verificado: sin ADMIN_DATABASE_URL → 500 sin datos (H6-F1..F4 PASS).
- Clasificación completa de operaciones en `evidence-h/parte23-pattern-classification.md`.
**FIXED-VERIFIED.**

## 8. Schema drift
`schema.prod.prisma` (el schema que `vercel-build.sh` copia y empuja a producción) estaba
**obsoleto (pre-3.5-B.2)**: sin `ArcoRequest`, sin `AuditLog`, sin `candidateUserId`
(dependencia de los fixes VUL-01/D.2.6), sin campos de retención, `ConsentLog` con
`onDelete: Cascade` (destruía evidencia LFPDPPP) y `companyId` opcional en las 4 tablas
indirectas (incompatible con las policies RLS).

## 9. schema.prisma vs schema.prod.prisma
Diff estructural programático (modelos, enums, campos, relaciones, @@index, onDelete):
pre-sync → 2 modelos ausentes + 6 grupos de drift de campos/semántica; **post-sync →
parity 18/18 modelos, mismos field-sets** (solo diferencias de comentarios/whitespace).
Ambos schemas: `prisma validate` EXIT=0.

## 10. Fuente de verdad
**`schema.prisma` = única fuente de verdad de modelos** (dev, tests, RLS artifacts).
`schema.prod.prisma` se mantiene SOLO por su datasource (postgresql + directUrl para
deploy/Supabase) y quedó sincronizado 1:1. No se permite drift sin razón explícita;
recomendación registrada: chequeo automatizado de parity en CI (script de diff, mismo
usado en esta fase) antes de cada deploy.

## 11. ArcoRequest
Añadido a schema.prod.prisma completo (campos, FK user/assignee/company con SetNull,
5 índices, legalDeadline LFPDPPP). /api/arco y `rls-policies.sql` (`FORCE RLS` en
"ArcoRequest") vuelven a ser desplegables.

## 12. AuditLog
Añadido a schema.prod.prisma (actor FK SetNull, 4 índices, success flag). Sin él, cada
despliegue perdía en silencio TODAS las auditorías (impersonation/aggregate/unauthorized)
porque audit.ts traga errores de escritura. Barrera append-only en
`create-rls-role.sql` (REVOKE UPDATE/DELETE a evalhr_app) + documentación:
`evidence-h/auditlog-barrier.md`. Datos de auditoría existentes: NO modificados.

## 13. CompanyPrivacyNotice
**Decisión A — RLS obligatorio**: registrado en `TENANT_SCOPED_MODELS` (app-layer,
efectivo HOY) + `ENABLE/FORCE + 4 policies` en rls-policies.sql + espejo en rollback.
Documento: `evidence-h/companyprivacynotice-decision.md`.

## 14. RLS artifacts
Coherencia verificada 1:1 tras el cierre del gap detectado por el auditor (DISABLE de
CompanyPrivacyNotice faltante en rollback STEP 3 — corregido):
- 15 tablas ENABLE = 15 DISABLE · 15 FORCE = 15 NO FORCE · 60 CREATE POLICY = 60 DROP.
- create-rls-role.sql / create-evalhr-sa-role.sql / backfill-indirect-companyid.sql:
  mismos nombres de tablas, roles y modelo companyId. **NINGUNO ejecutado.**

## 15. 14 vs 17 tables
Lista definitiva derivada de schema.prisma (16 modelos):
- **15 tablas RLS+FORCE** (14 originales + CompanyPrivacyNotice, PARTE 16): Position,
  CandidateInvitation, EvaluationSession, EvaluationResult, InterviewSchedule, Vacancy,
  VacancyApplication, ArcoRequest, User, Question, EvaluationResponse, EvaluationTemplate,
  VacancyQuestion, VacancyApplicationResponse, CompanyPrivacyNotice.
- Fuera por diseño (documentado): Company (tenant root), ConsentLog (evidencia LFPDPPP),
  AuditLog (evidencia, append-only).
- La cifra "17" de instrucciones previas **no corresponde a este repo** — queda sustituida
  por la lista derivada arriba.

## 16. TSC baseline
Baseline: 48 → Actual: **42** (−6). **0 errores nuevos** (comm de set file:código).
Modificados con 0 errores; los 5 de PublicEvaluationView se eliminaron al restaurar los
campos del store; el TS2322 de vacancies se resolvió sin cambio de conducta. Restantes
(42): auth 22, consent 6, retention 6, generate-questions 1, page 2 (+continuaciones) —
preexistentes, fuera de alcance. `evidence-h/tsc-baseline.txt` / `tsc-after.txt`.

## 17. Tests
`scripts/h-tests.ts` (nuevo, 50 checks) — **50/50 PASS en ambos modos**:
- full (con ADMIN_DATABASE_URL): H1-H6 funcionales + aggregate 200 + filas AuditLog.
- admin-fail: fail-closed 500 sin datos (H6-F1..F4) + todo lo no-aggregate.
Incluye los tests exigidos: H2-1..8, H3-1..7 (+1b/5a/6a/8), H4-1..7, H5-1..5, H6-1..8,
AUD-1..3 (PARTE 22), XT-1 (cross-tenant A/B).

## 18. Regression
- d26 post: **37/37** · d27 post: **20/20** · d29 full: **21/21** · d29 admin-fail: **3/3**.
- d29 PUB-3 actualizado al nuevo contrato (GET con token) — misma intención, conducta
  nueva documentada.
- Total fase: **181 checks PASS, 0 fallos**. Scoring/fórmulas/IA/psicometría/preguntas/
  recomendaciones/revisión humana: SIN cambios (git diff revisado por el auditor).

## 19. Audit posterior
Auditoría independiente (subagente H-26, ojos frescos, git diff completo): **FIXED-VERIFIED
en H1-H6 y schema; APPROVED**. Gap detectado (rollback DISABLE CPN) corregido y
re-verificado. Issues nuevos introducidos por los fixes: 1 MEDIUM (el gap ya cerrado),
2 LOW (404 cross-target de invite sin audit row; filtro ?sector de positions eliminado
sin callers), 1 INFO (correctAnswer visible para SA en catálogo — consistente con rol).

## 20. Vulnerabilidades corregidas
H1 legacy token fallback · H2 enumeración+acuñación · H3 listados sin gate ·
H4 invite DELETE sin rol · H5 reasignación companyId · H6 SA global sin aislamiento ·
BLOCKER schema drift (ArcoRequest/AuditLog/+) — **7/7**.

## 21. Vulnerabilidades restantes
**CRITICAL: 0 · HIGH: 0**. Pendientes documentadas (preexistentes, no nuevas):
MEDIUMs de F-2/F-3 no alcanzados por esta fase (bulk-delete sin audit, consent fail-open
teórico, FK-injection candidateId en interviews POST, sobre-breadth de rol), 42 errores
tsc heredados, defecto latente `SET LOCAL $1` (activación RLS), validación real de
Supabase pendiente. **No se aumentó deuda de seguridad.**

## 22. Riesgos
1. La prueba de posesión H2 depende de datos declarados por el candidato (fortaleza
   media); recomendación: teléfono requerido en creación (futuro).
2. Los 42 errores tsc heredados siguen restando señal (fuera de alcance por instrucción).
3. La activación RLS exigirá backfill previo (backfill-indirect-companyid.sql) porque el
   schema prod ahora declara companyId requerido en las 4 indirectas (columnas nuevas).
4. PublicEvaluationView sigue sin estar montada en page.tsx (orphan frontend) — flujo
   público vivo = invitation tokens.

## 23. Archivos modificados
src/lib/public-token.ts · src/lib/admin-db.ts · src/lib/rls.ts · src/lib/store.ts ·
src/app/api/public/apply/route.ts · candidates · interviews · vacancies ·
vacancies/[id]/applications · invite · users · positions · companies (routes) ·
src/components/views/PublicEvaluationView.tsx · prisma/schema.prod.prisma ·
prisma/rls-policies.sql · prisma/rls-rollback.sql · prisma/create-rls-role.sql ·
eslint.config.mjs · scripts/h-tests.ts (nuevo) · scripts/d29-tests.ts (PUB-3).
Evidencia: evidence-h/ (baselines, tsc, decisiones, clasificación PARTE 23).

## 24. Migraciones
**NINGUNA migración ejecutada; ningún push a base de datos.** Los cambios de schema son
ediciones de archivo. En el próximo deploy, `vercel-build.sh` ejecutará `prisma db push`
con DIRECT_URL — las columnas nuevas (companyId requerido en indirectas, AuditLog,
ArcoRequest, candidateUserId, retención) se crearán/backfillarán en ese momento
(backfill-indirect-companyid.sql antes de activar RLS).

## 25. Estado RLS
**RLS PostgreSQL NO ACTIVADO.**
**Roles PostgreSQL NO CREADOS.**
**DATABASE_URL NO CAMBIADA.**
**ADMIN_DATABASE_URL NO CONFIGURADA.**
**Producción NO TOCADA.**
**Staging Supabase NO TOCADO.**

## 26. GO / NO-GO PARA NUEVA VALIDACIÓN SUPABASE

# **GO CONDICIONAL**

Condiciones exactas para la siguiente fase (validación pre-RLS en Supabase staging real):
1. **Credenciales reales de staging Supabase** (project-ref + secretos) — sin ellas la
   validación Pooler/evalhr_sa/RLS live sigue siendo imposible (lección de 3.5-G).
2. **Backfill previo**: ejecutar `backfill-indirect-companyid.sql` (y backfill de
   AuditLog/ArcoRequest vía db push) ANTES de `rls-policies.sql`, porque el schema ahora
   declara companyId requerido en las 4 indirectas.
3. Corregir `SET LOCAL` → `set_config` en `db-rls-session.ts` antes de activar DB-RLS
   (defecto latente documentado; hoy sin callers).
4. Orden de activación conservando la disciplina probada: backup → roles (create-rls-role.sql,
   create-evalhr-sa-role.sql) → backfill → rls-policies.sql → verificación negativa
   (is_super_admin=0, 15/15 FORCE) → suite Pooler real (set_config 100x, concurrencia,
   rollback 50x, bypass, sin contexto) → catalog final.
5. NO desplegar producción hasta que la validación real emita GO (fase 3.5-G criterios).

---
REGLA FINAL cumplida: sin RLS activado, sin producción, sin staging Supabase, sin cambio
de credenciales, scoring/IA/psicometría/fórmulas/preguntas/recomendaciones/revisión
humana/reglas de negocio intactos, sin pruebas ni PASS inventados (181 checks reales).

**DETENIDA tras la emisión de este informe.**
