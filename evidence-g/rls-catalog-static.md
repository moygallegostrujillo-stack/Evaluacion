# FASE 3.5-G — FASE 21: CATÁLOGO RLS (estático, desde artefactos)

⚠️ ALCANCE: catálogo construido desde los artefactos SQL versionados en `prisma/`
(rls-policies.sql, create-rls-role.sql, create-evalhr-sa-role.sql, rls-rollback.sql).
La lectura LIVE de pg_class/pg_policies/pg_roles/pg_proc/information_schema.role_table_grants
en Supabase real está **BLOQUEADA** (sin credenciales de staging en este entorno).

## Matriz (14 tablas con ENABLE + FORCE ROW LEVEL SECURITY)

| Tabla | RLS | FORCE | Policies | Owner (artefacto) | evalhr_app access |
|---|---|---|---|---|---|
| Position | true | true | 4 (S/I/U/D) | sin statement OWNER → hereda del rol que ejecute el script | SELECT/INSERT/UPDATE/DELETE (RLS) |
| CandidateInvitation | true | true | 4 | idem | idem |
| EvaluationSession | true | true | 4 | idem | idem |
| EvaluationResult | true | true | 4 | idem | idem |
| InterviewSchedule | true | true | 4 | idem | idem |
| Vacancy | true | true | 4 | idem | idem |
| VacancyApplication | true | true | 4 | idem | idem |
| ArcoRequest | true | true | 4 | idem | idem |
| User | true | true | 4 | idem | idem |
| Question | true | true | 4 (global-read: companyId IS NULL OR = tenant; update/delete solo propias) | idem | idem |
| EvaluationResponse | true | true | 4 | idem | idem |
| EvaluationTemplate | true | true | 4 | idem | idem |
| VacancyQuestion | true | true | 4 | idem | idem |
| VacancyApplicationResponse | true | true | 4 | idem | idem |

TOTAL: 14 tablas × 4 policies = **56 policies** (CREATE POLICY count verificado: 56).

## Tablas fuera de RLS (por diseño o por GAP)

| Tabla | Estado | Clasificación |
|---|---|---|
| Company | sin RLS — tenant root | por diseño |
| ConsentLog | sin RLS — evidencia LFPDPPP | por diseño (acceso revisado F-3) |
| AuditLog | sin RLS — evidencia | por diseño (admin-db/impersonation auditan aquí) |
| **CompanyPrivacyNotice** | **sin RLS y ADEMÁS tiene companyId** | **GAP** — no está ni en DB RLS ni en TENANT_SCOPED_MODELS de rls.ts; solo scoping a nivel de ruta (privacy-notice, consent, companies) |

## HALLAZGOS DE CATÁLOGO (bloqueantes/condiciones)

1. **BLOCKER — drift de esquema**: `schema.prod.prisma` NO contiene `ArcoRequest` ni `AuditLog`
   (presentes en schema.prisma/SQLite y en rls-policies.sql). Consecuencias si se aplica el
   esquema prod a PostgreSQL: rls-policies.sql FALLA en `ALTER TABLE "ArcoRequest"`; /api/arco
   sin tabla; escrituras de AuditLog fallan (audit.ts traga el error → auditoría perdida en silencio).
2. **GAP — CompanyPrivacyNotice** con companyId sin RLS (DB ni app-layer).
3. **MISMATCH — instrucción vs artefactos**: la instrucción espera 17 tablas tenant RLS+FORCE y
   roles evalhr_owner/evalhr_secdef/funciones evalhr_auth_*/evalhr_public_*; el repo contiene 14
   tablas, UNA sola función (evalhr_current_tenant) y CERO referencias a evalhr_owner/evalhr_secdef.
   No se pueden validar estados que no existen en los artefactos.
4. **MISMATCH — evalhr_current_tenant es SECURITY INVOKER** (no prosecdef): correcto y fail-closed
   (__DENIED__ sin contexto, search_path=''), pero difiere del "prosecdef" mencionado en la instrucción.
5. sin statement `ALTER TABLE ... OWNER TO evalhr_owner` → el "Owner=evalhr_owner" del catálogo
   esperado no es verificable; FORCE RLS mitiga el bypass-del-owner para roles sin BYPASSRLS.

## Verificación negativa incluida en el artefacto (a ejecutar en Supabase cuando haya acceso)

- pg_policies sin referencias a `is_super_admin` → 0 filas esperadas (query incluida al final de rls-policies.sql).
- pg_class: 14 tablas con relrowsecurity=true y relforcerowsecurity=true (query incluida).
