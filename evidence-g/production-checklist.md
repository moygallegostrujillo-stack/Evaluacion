# FASE 3.5-G — FASE 33: CHECKLIST PRODUCCIÓN

Leyenda: ✅ verificado con evidencia real · ⛔ BLOQUEADO (no ejecutable en este entorno) · ⚠️ verificado con condiciones/hallazgos

- [⛔] Supabase Pooler real probado — FASES 1-20: sin credenciales de staging en el entorno (evidencia G-0). PROHIBIDO inferir/sustituir.
- [⚠️] evalhr_app validado — diseño verificado en create-rls-role.sql (NOBYPASSRLS, sin DDL, DML+seq); validación LIVE en Supabase ⛔
- [⛔] evalhr_owner validado — NO EXISTE en el repo (0 referencias); no hay statement OWNER TO
- [⛔] evalhr_secdef validado — NO EXISTE en el repo (0 referencias)
- [⚠️] evalhr_sa validado — diseño completo y correcto en create-evalhr-sa-role.sql (LOGIN, NOSUPERUSER, BYPASSRLS documentado, NOCREATEDB/ROLE); verificación LIVE en Supabase ⛔; ADMIN_DATABASE_URL fail-closed verificado en runtime (d29 admin-fail 3/3) y con URL presente (d29 full 3/3 AGG)
- [⚠️] ADMIN_DATABASE_URL validado — separación de diseño verificada (única lectura runtime en admin-db.ts:168; 0 uso en rutas tenant; impersonation no la usa); configuración real en Supabase ⛔
- [⚠️] 17/17 FORCE RLS — el artefacto contiene 14/14 tablas ENABLE+FORCE (no 17); drift schema.prod.prisma (falta ArcoRequest, AuditLog) = BLOCKER de activación
- [⚠️] policies correctas — 56 policies (4×14) revisadas estáticamente; Question global-read correcto; verificación negativa is_super_admin incluida
- [✅] auth — login/mint/verify JWT HS256 middleware en todas las rutas (F-3); invalid token 401/403 probado (d29 PUB-4/5/8/9/10/11; d26 P9; d27 D-8)
- [✅] public — vacancy/apply/invitation/video: 11/11 checks d29 + token-antes-de-lookup verificado; ⚠️ HIGH-1/HIGH-2 de F-1 (fallback legacy verifyPublicToken + enumeración email en apply step=data / acuñación GET) = condición
- [⚠️] tenant — 44 checks R1-R10/P1-P10/D-1..D-8/IA-I7 PASS; ⚠️ listados sin gate de rol (CANDIDATO ve roster propio tenant) = condición (HIGH-3 F-1 / M-5 F-3)
- [⚠️] candidate isolation — P1/P2/P3 + SNAP-cand-changed (403) PASS; el gap son los LISTADOS (mismo gap anterior)
- [✅] SA impersonation — D-4/D-5 + AUDIT-1 + R8/R9: solo target, auditado (impersonation=true + targetCompanyId), sin datos de A
- [✅] aggregate — AGG 3/3 con ADMIN_DATABASE_URL (HTTP 200, sin PII, auditado, fail-closed sin URL 3/3); F-2 APPROVED-WITH-OBSERVATIONS
- [⚠️] retention — ruta compilada en build; suite específica NO existe en el repo (no se inventa); criterios intactos (no tocados)
- [✅] migrate — F-1 §6: solo DDL de literales fijos, gate SUPER_ADMIN, auditado; NO puede activar/desactivar RLS, crear roles ni modificar policies (STEP 11 eliminado; grep 0 coincidencias)
- [⚠️] rollback — rls-rollback.sql revisado estáticamente (NO FORCE→DROP policies→DISABLE→DROP function→REVOKE; preserva roles y datos; idempotente); ejecución LIVE ⛔
- [⚠️] reactivation — artefactos idempotentes presentes (rls-policies.sql + backfill-indirect-companyid.sql + create-rls-role.sql + create-evalhr-sa-role.sql); ejecución LIVE ⛔
- [✅] build — next build EXIT=0 en copia aislada con JWT_SECRET (equiv. Vercel staging); fail-closed de JWT_SECRET verificado (sin secret → build aborta)
- [✅] lint — bun run lint EXIT=0
- [⚠️] typecheck — tsc --noEmit EXIT=1: 48 errores PREEXISTENTES (auth 22, retention 6, consent 6, PublicEvaluationView 5, page 2, vacancies 2); build ignora via ignoreBuildErrors:true
- [⚠️] F-1 review — APPROVED-WITH-OBSERVATIONS sobre mecanismos reales; 3 HIGH (public-token fallback, enumeración apply, listados sin gate); resource-lookup.ts/evalhr_find_* NO EXISTEN (mismatch de instrucción, no blocker)
- [✅] F-2 review — APPROVED-WITH-OBSERVATIONS (mecanismo aggregate sólido; M-1/M-2/M-3 tracked)
- [⚠️] F-3 review — GO CONDICIONAL: 3 HIGH (invite DELETE sin rol; users PUT reasigna companyId cross-tenant; listas globales SA vía cliente unscoped sin audit)
