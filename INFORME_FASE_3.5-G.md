# EVALUHR — FASE 3.5-G
# VALIDACIÓN FINAL PRE-PRODUCCIÓN

Fecha: 2026-09-06 · Entorno de ejecución: sandbox del proyecto (SQLite local + artefactos versionados) · Producción: NO tocada

---

## 1. Infraestructura
- **Estado real verificado (no asumido)**: el entorno de ejecución NO dispone de un proyecto Supabase staging accesible.
  - `.env` contiene únicamente `DATABASE_URL=file:/home/z/my-project/db/custom.db` (SQLite).
  - NO existen `DIRECT_URL`, `ADMIN_DATABASE_URL`, ni variables `SUPABASE_*` en entorno, `.env.example`, historial git (revisado con secretos redactados) ni `~/.supabase` (solo telemetría del CLI).
  - Supabase CLI 2.116.0 presente; **sin Docker**, sin binarios PostgreSQL locales (sin psql/pg_dump), sin procesos/puertos 5432/6543 locales.
  - Red: `aws-0-ca-central-1.pooler.supabase.com` resuelve y TCP:5432 alcanza el ELB **compartido** de Supabase. Un ELB alcanzable NO es un proyecto staging: sin project-ref/credenciales no es autenticable.
- Conforme a REGLA FINAL (no inferir Pooler, no sustituir con PostgreSQL local), las fases que exigen Supabase real quedaron **BLOQUEADAS**, no PASS.

## 2. Pooler Supabase
**NO PROBADO (⛔)**. FASES 1, 2, 7–20 no ejecutables: no hay credenciales ni project-ref de staging. Ningún resultado de Pooler se infirió ni se simuló. Criterio NO-GO nº1 directo (FASE 34).

## 3. evalhr_app
- **Diseño verificado** (`prisma/create-rls-role.sql`): LOGIN, NOSUPERUSER, NOBYPASSRLS, NOCREATEDB, NOCREATEROLE, NOREPLICATION; CONNECT+USAGE+DML+sequences; sin DDL.
- **Validación LIVE en Supabase: ⛔ BLOQUEADA.**

## 4. evalhr_owner
**NO EXISTE en el repo** (0 referencias en *.sql/*.ts/*.md). Sin `ALTER TABLE … OWNER TO evalhr_owner`. La arquitectura de 4 roles descrita en la instrucción no fue materializada en artefactos. Validación: ⛔/N/A.

## 5. evalhr_secdef
**NO EXISTE en el repo** (0 referencias). La única función SQL es `evalhr_current_tenant` (SECURITY INVOKER). Validación: ⛔/N/A.

## 6. evalhr_sa
- **Diseño completo y correcto** (`prisma/create-evalhr-sa-role.sql`): LOGIN, NOSUPERUSER, **BYPASSRLS documentado** con controles compensatorios, NOCREATEDB, NOCREATEROLE, NOREPLICATION; DML sin DDL; uso exclusivo vía ADMIN_DATABASE_URL; prohibido para withTenant()/impersonation.
- **Verificación LIVE en Supabase: ⛔ BLOQUEADA** (no se puede confirmar que el rol exista ahí).
- Separación de canales verificada en código: 0 uso de ADMIN_DATABASE_URL fuera de admin-db.ts; impersonation usa conexión tenant (F-2 §4: PASS).

## 7. Connections
- `DATABASE_URL` ≠ `ADMIN_DATABASE_URL` **por diseño** (roles distintos: evalhr_app vs evalhr_sa; fail-closed sin la variable — d29 admin-fail 3/3 PASS).
- Configuración REAL en staging: ⛔ no verificable (sin credenciales). `DIRECT_URL`: definida en schema.prod.prisma (directUrl), no presente en entorno.

## 8. RLS catalog
Catálogo estático completo en `evidence-g/rls-catalog-static.md`. Resumen:
- **14 tablas ENABLE+FORCE** (no 17 como esperaba la instrucción), 56 policies.
- Por diseño sin RLS: Company, ConsentLog, AuditLog.
- **GAP**: `CompanyPrivacyNotice` tiene companyId y NO tiene RLS (ni DB ni app-layer).
- **BLOCKER de activación (drift)**: `schema.prod.prisma` NO contiene `ArcoRequest` ni `AuditLog` (el script RLS fallaría en `ALTER TABLE "ArcoRequest"`; las auditorías fallarían en silencio).
- Verificación LIVE (pg_class/pg_policies/pg_roles/pg_proc/role_table_grants): ⛔.

## 9. Policies
- 56 policies revisadas estáticamente: pure-tenant (=`evalhr_current_tenant()`), fail-closed, `Question` con global-read correcto (NULL=legible, no editable), sin referencias a `is_super_admin` (verificación negativa incluida en el propio SQL).
- Validación LIVE: ⛔.

## 10. Functions
- Única función: `evalhr_current_tenant()` — SECURITY INVOKER, `search_path=''`, devuelve `__DENIED__` sin contexto.
- `evalhr_auth_*` / `evalhr_public_*` de la instrucción: **NO EXISTEN** como artefactos (mismatch instrucción↔repo; los flujos auth/public viven en app-code y fueron revisados en F-1/F-3).

## 11. Auth
- JWT HS256+issuer verificado en middleware para todo `/api/*` (F-3); sin token → 401 en todas las rutas del set; token inválido → 403 (d29 PUB-4/5/8/9/10/11; d26 P9; d27 D-8). Login RH/CANDIDATO/SA ejercitado por fixtures d26/d27 (200s). PASS local.

## 12. Public
- d29 PARTE 25: **11/11 PASS** (vacancy público sin datos privados; apply crea aplicación+token HMAC; minimización de datos en resume; token verificado ANTES del lookup en video/invitation).
- ⚠️ Condiciones de F-1: fallback legacy `token===resourceId` en `verifyPublicToken` (HIGH-1) y enumeración por email + acuñación de tokens en `GET /api/public/apply?applicationId=` (HIGH-2).

## 13. Tenant
- d26 post R1–R10: 13/13 PASS (spoofing de companyId/targetCompanyId ignorado; resultId cruzado 404; impersonation auditada).
- d27 D-1..D-8: 7/8 PASS (D-6 = fail-closed esperado, auditado igualmente).
- ⚠️ Condición: listados sin gate de rol (CANDIDATO ve roster/PII de SU tenant) — HIGH-3 F-1 / M-5 F-3.

## 14. Candidate
- P1–P10: 10/10 PASS (CAND-A no ve a CAND-A2 ni mismo tenant: 403; compareIds con own-scope; sin señales de existencia en 404).
- `SNAP-cand-changed`: CANDIDATO 403 (VUL-D2 corregido). PASS.

## 15. SA impersonation
- D-4/D-5 + AUDIT-1 + R8/R9: SA→B ve solo B; recurso de A → 404; `AuditLog` con `impersonation=true` + `targetCompanyId` verificado en DB (AUDIT-1: 2 entradas). PASS.

## 16. SA aggregate
- **Con** ADMIN_DATABASE_URL: AGG 3/3 HTTP 200 vía admin-db, sin PII (`recentResults=[]`, mode=aggregated), auditadas (AUDIT-2/3/4).
- **Sin** ADMIN_DATABASE_URL: fail-closed 3/3 (HTTP 500 genérico, sin datos, sin leak del mensaje interno).
- F-2: **APPROVED-WITH-OBSERVATIONS** (M-1/M-2/M-3 tracked; sin CRITICAL/HIGH en el mecanismo).

## 17. Retention
- `src/app/api/retention/route.ts` compila en build (ruta registrada). Criterios de retención NO tocados (regla absoluta).
- Suite específica de retention NO existe en el repo → **no se inventaron resultados**. Verificación funcional: pendiente de suite/ejecución.

## 18. Migrate
- F-1 §6: `/api/migrate` ejecuta SOLO DDL de literales fijos (ADD COLUMN/CREATE TABLE/INDEX/cleanup parametrizado); STEP 11 (RLS) eliminado y documentado; grep: 0 referencias a ROW LEVEL SECURITY/CREATE ROLE/POLICY. Gate SUPER_ADMIN + audit. **No puede** activar/desactivar RLS, crear roles ni modificar policies. PASS.

## 19. Concurrency
- Bajo Pooler real: ⛔ NO PROBADO (bloqueado). No se ejecutó sustituto local (prohibido por REGLA FINAL).
- Garantías estáticas: `SET LOCAL` es transaccional (sin contaminación entre conexiones); defecto latente `$1` en `SET LOCAL` documentado (GUC doc).
- Concurrencia local observada: 6 suites HTTP secuenciales/paralelas contra el dev server sin errores de conexión ni mezcla de datos en fixtures A/B.

## 20. Rollback
- `prisma/rls-rollback.sql` revisado estáticamente: NO FORCE → DROP 56 policies (IF EXISTS) → DISABLE RLS → DROP function → REVOKE grants de roles (guarded). **Preserva roles y datos** (0 TRUNCATE/DELETE). Idempotente.
- Ejecución LIVE: ⛔ bloqueada.

## 21. Reactivation
- Artefactos idempotentes presentes: create-rls-role.sql, backfill-indirect-companyid.sql, rls-policies.sql, create-evalhr-sa-role.sql.
- Reproducibilidad LIVE (rollback→reapply→mismo catálogo→retest pooler): ⛔ bloqueada.

## 22. Build
- `next build` **EXIT=0** en copia aislada (`/tmp/evaluhr-build`, node_modules reales, sin tocar el runtime del proyecto) con `JWT_SECRET` temporal → equivalente a Vercel staging.
- Bonus: se verificó el **fail-closed** de producción — sin JWT_SECRET el build aborta con FATAL (comportamiento diseñado).
- `bun run lint` **EXIT=0**.
- `bunx tsc --noEmit` **EXIT=1 — 48 errores PREEXISTENTES**: auth/route 22, retention 6, consent 6, PublicEvaluationView 5, page 2, vacancies 2 (el build los ignora vía `ignoreBuildErrors:true`). Separados y documentados; no se modificó código para no alterar conducta validada.

## 23. Regression
- Suites REALES ejecutadas (no se inventaron nombres): d26 post, d27 post, d29 full, d29 admin-fail, test-consent-flow, test-orphan-scenario.
- **81 checks: 0 fallos reales** (35+19+21+3+2 suites; los 3 "500" de aggregate son el fail-closed diseñado y quedaron probados por d29 admin-fail/full).
- Las 177/177 referidas por la instrucción corresponden a suites (d22–d25 y RLS) que **no existen en este sandbox** → no reproducibles aquí; se declara la cifra real obtenida.

## 24. F-1 review (independiente, G-25)
- Veredicto sobre los mecanismos REALES: **APPROVED-WITH-OBSERVATIONS**, con **3 HIGH** (12) — ver §27.
- `resource-lookup.ts` y `evalhr_find_*` / `evalhr_company_exists` / `evalhr_list_active_positions_catalog`: **NO EXISTEN** → mismatch de documentación de la fase, no blocker funcional; la revisión cubrió los mecanismos reales (rls.ts, db-rls-session.ts, impersonation.ts, public-token.ts, rutas por id/token/slug).
- SQL injection: **38 ocurrencias raw auditadas, 0 UNSAFE, 0 CRITICAL**.
- Regla "CANDIDATO postula a cualquier empresa": cumple en capa pública; rota in-app en create-session (500 fail-closed) — MEDIUM-4.

## 25. F-2 review (independiente, G-26)
- **APPROVED-WITH-OBSERVATIONS**. Mecanismo aggregate: sin CRITICAL/HIGH; fail-closed; auditado antes de leer; sin PII (clasificación campo por campo); sin escape hatches; evalhr_sa solo en comentarios; ruta inversa (rutas tenant no importan admin-db) PASS. Condiciones: M-1 (SA con companyId eludiría branch aggregate sin audit), M-2 (gate CANDIDATO en GET /api/candidates), M-3 (audit bulk DELETE), L-3/L-4 (docs desactualizadas).

## 26. F-3 review (independiente, G-27)
- **GO CONDICIONAL** — 3 HIGH (12) + MEDIUMs (consent fail-open teórico, FK-injection candidateId en interviews, positionId sin validar, sobre-breadth de rol, destructivas sin audit). Fuertes confirmados: middleware 401 global, no-SA jamás cruza tenant por query/body, impersonation auditada y por conexión tenant, candidates GET SA usa admin-db, ConsentLog con snapshots+noticeHash.

## 27. Vulnerabilities
**CRITICAL: 0 · SQL injection: 0 · HIGH: 6 · MEDIUM: ~12 · LOW/INFO: ~15**
| # | Sev | Dónde | Descripción |
|---|---|---|---|
| F1-H1 | HIGH | public-token.ts:44 | Fallback legacy `token===resourceId` anula la promesa HMAC en quien lo use |
| F1-H2 | HIGH | public/apply 1051-1065, 812 | Enumeración email+slug devuelve applicationId; GET acuña tokens → secuestro de aplicación (integridad, no confidencialidad) |
| F1-H3 | HIGH | results/candidates/interviews/vacancy-applications | Listados sin gate de rol: CANDIDATO ve PII+puntajes de su tenant |
| F3-H1 | HIGH | invite DELETE 183-314 | Sin check de rol: CANDIDATO puede borrar invitaciones de su empresa (`?all=true`) |
| F3-H2 | HIGH | users PUT 210-223 | RH puede reasignar SU companyId a otra empresa → escape de tenant tras re-login |
| F3-H3 | HIGH | users/interviews/vacancies GET (SA sin target) | Listas globales vía cliente unscoped del tenant, sin audit (contradice D.2.8; bajo FORCE RLS fallarán cerradas) |
| BLOCKER | — | schema.prod.prisma | Falta ArcoRequest y AuditLog → rls-policies.sql fallaría al activarse; auditorías se perderían en silencio |
| GAP | — | CompanyPrivacyNotice | companyId sin RLS en ninguna capa |
| M | — | db-rls-session.ts:70 | `SET LOCAL` parametrizado fallará al activar DB-RLS (fail-closed; usar set_config) |

## 28. Risks
1. **No existe evidencia real de Supabase**: todo el stack RLS-by-database permanece sin probar contra PostgreSQL real (Pooler, FORCE, roles, policies, rollback/reactivación). Riesgo alto de sorpresas en activación.
2. **Drift de esquema** hace que la activación "según artefactos" falle hoy (ArcoRequest).
3. Los 6 HIGH son explotables por actores autenticados de bajo privilegio (integridad/PII in-tenant); no requieren acceso a DB.
4. 48 errores de tipos preexistentes reducen la señal de tsc como red de seguridad.
5. Gobernanza: instrucciones de fase describen artefactos inexistentes (evalhr_owner/secdef, resource-lookup, 17 tablas, prosecdef) — riesgo de "PASS" fiction si no se corrige.

## 29. Evidence
- `worklog.md` — entradas G-0 (verificación de entorno), G-25/G-26/G-27 (revisiones independientes), G-1..G-34 (orquestación).
- `evidence-g/rls-catalog-static.md` — catálogo FASE 21 + hallazgos.
- `evidence-g/guc-documentation.md` — FASE 24.
- `evidence-g/production-checklist.md` — FASE 33 (✅/⛔/⚠️).
- `evidence-g/backup-local-sqlite-20260906T183133Z.db` + `.sha256` + `.manifest` — backup local (hash verificado; 18 tablas/83 filas). **Backup de staging Supabase: NO creado (⛔ sin acceso).**
- Resultados de suites: `scripts/d26-test-results-post.json`, `d27-test-results.json`, `d29-test-results-full.json` (regenerados hoy), `d29-test-results-admin-fail.json`.
- Salidas: `/tmp/build-out2.txt` (build EXIT=0), `/tmp/tsc-out.txt` (48 errores), lint EXIT=0.
- Sin secretos en ninguna evidencia (URLs/credenciales redactadas).

## 30. GO / NO-GO

# **NO-GO PARA PRODUCCIÓN**

Criterios FASE 34 que se cumplen (cualquiera es suficiente):
1. **Supabase Pooler real NO fue probado** (FASES 1-20 ⛔ — sin credenciales de staging).
2. **evalhr_sa NO está verificado en Supabase** (solo diseño; ⛔ live).
3. **ADMIN_DATABASE_URL no está configurada en ninguna conexión real** (solo fail-closed local verificado).
4. **Drift de esquema**: `schema.prod.prisma` sin `ArcoRequest`/`AuditLog` → la activación RLS según artefactos fallaría.
5. **6 HIGH** de revisión independiente sin corregir (3 de F-1 + 3 de F-3).
6. **Revisión independiente F-3 no aprobada sin condiciones**; F-1 aprobada con 3 condiciones HIGH.

**Vía para re-evaluar (en orden):**
1. Aportar credenciales de staging Supabase real (project-ref + passwords de migración y para crear evalhr_app/evalhr_sa) → ejecutar FASES 1-20 + catálogo live + backup→rollback→reactivación live.
2. Sincronizar `schema.prod.prisma` (añadir ArcoRequest + AuditLog; decidir RLS de CompanyPrivacyNotice) y corregir `set_config` en db-rls-session.ts.
3. Corregir los 6 HIGH (public-token fallback; enumeración/acuñación en public/apply; gates de rol en listados; invite DELETE; users PUT companyId; listas globales SA → admin-db con audit).
4. Re-ejecutar esta fase de validación con el entorno real.

---
REGLA FINAL cumplida: no se tocó producción, no se desplegó, no se ejecutó DDL de producción, no se cambió DATABASE_URL/ADMIN_DATABASE_URL de producción, no se tocó scoring/IA/psicometría/fórmulas/preguntas/recomendaciones/revisión humana, no se inventó ningún PASS, no se infirió el Pooler.

**DETENIDA tras la emisión de este informe.**
