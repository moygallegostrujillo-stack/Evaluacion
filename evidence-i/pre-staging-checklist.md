# EVALUHR — PRE-STAGING CHECKLIST (FASE 3.5-I.1)

Fecha: 2026-09-07 · Estado del repo: LISTO PARA STAGING · Staging Supabase: NO CONECTADO
Producción: NO tocada · RLS: NO activado · Roles: NO creados · SQL: NO ejecutado

> Este checklist se marca en la fase de validación real (3.5-I/II) cuando exista el
> proyecto Supabase staging. Nada aquí autoriza producción.

## A. Infraestructura previa (bloqueante hoy)

- [ ] DATABASE_URL staging (Pooler/Supavisor, puerto 6543, `pgbouncer=true`)
- [ ] DIRECT_URL staging (directo, puerto 5432, para `prisma db push`/migraciones)
- [ ] ADMIN_DATABASE_URL staging (rol evalhr_sa — SOLO para src/lib/admin-db.ts)
- [ ] Supabase project-ref confirmado (host, database, port, TLS, role — sin password en evidencia)
- [ ] Pooler/Supavisor endpoint confirmado (modo transaction)
- [ ] Backup/snapshot de staging capturado (timestamp, proyecto, esquema, tablas, filas, hash)

## B. Roles (crear/verificar SOLO en staging, manual, como superuser)

- [ ] evalhr_app — LOGIN, NOSUPERUSER, NOBYPASSRLS, NOCREATEDB, NOCREATEROLE,
      NOREPLICATION; DML+sequences; sin DDL; sin ownership de tablas RLS
      (`prisma/create-rls-role.sql`)
- [ ] evalhr_sa — LOGIN, NOSUPERUSER, BYPASSRLS (documentado), NOCREATEDB,
      NOCREATEROLE, NOREPLICATION; uso exclusivo vía ADMIN_DATABASE_URL
      (`prisma/create-evalhr-sa-role.sql`)
- [ ] evalhr_owner — **DECISIÓN PENDIENTE EN ACTIVACIÓN**: los artefactos actuales NO
      crean evalhr_owner (las tablas nacen owned por `postgres`). Bajo FORCE RLS el
      owner no puede saltarse RLS, así que el diseño es seguro con owner=postgres.
      Si la política de Supabase exige owner dedicado, crearlo NOLOGIN/NOSUPERUSER/
      NOBYPASSRLS y transferir ownership ANTES de ENABLE/FORCE RLS. No asumir que
      scripts genéricos de PostgreSQL equivalen a las restricciones Supabase.
- [ ] evalhr_secdef — **NO REQUERIDO HOY**: no existe ninguna función SECURITY DEFINER
      en el repo (`evalhr_current_tenant()` es SECURITY INVOKER con search_path='').
      No crear funciones "porque informes previos las mencionaron" si no existen.
      Si Supabase obligara a usar roles internos (supabase_*) para DEFINER, documentarlo.
- [ ] Probar DDL negativo con evalhr_app: CREATE TABLE / CREATE FUNCTION / ALTER TABLE /
      DROP TABLE / CREATE ROLE / GRANT → TODO debe fallar

## C. Schema y datos

- [ ] Parity schema.prisma vs schema.prod.prisma = 18/18 (`bun scripts/schema-parity-check.ts` → EXIT 0)
- [ ] `prisma db push` (DIRECT_URL) con schema.prod.prisma — verifica ArcoRequest, AuditLog,
      CompanyPrivacyNotice, EvaluationResponse, EvaluationTemplate, VacancyQuestion,
      VacancyApplicationResponse con companyId NOT NULL
- [ ] Backfill `prisma/backfill-indirect-companyid.sql` → 0 NULL en las 4 indirectas y
      child.companyId = parent.companyId 100% (query de verificación incluida)
- [ ] NOT NULL: confirmar que las 4 columnas indirectas quedaron NOT NULL tras el push
      (el schema ya lo declara; si el push no las convierte por filas preexistentes,
      ALTER TABLE ... SET NOT NULL manual tras backfill verificado)

## D. RLS (solo tras A–C completos; nunca vía HTTP ni /api/migrate)

- [ ] `prisma/rls-policies.sql` aplicado manualmente (registrar timestamp, rol, hash del archivo, resultado)
- [ ] Catálogo real verificado: 15/15 tablas ENABLE + FORCE, 60 policies,
      0 policies con is_super_admin, CompanyPrivacyNotice incluido
- [ ] Función evalhr_current_tenant(): SECURITY INVOKER, search_path='', sin contexto → '__DENIED__'
- [ ] set_config: sin contexto → 0 filas; A → solo A; B → solo B
- [ ] FORCE RLS: relforcerowsecurity=true en las 15; owner (postgres/evalhr_owner) NO salta RLS

## E. Pooler y app (DATABASE_URL ya apuntando al Pooler staging)

- [ ] Concurrency: 100 ciclos secuenciales + 50 paralelos A/B → 0 contaminaciones
- [ ] Rollback Pooler: 50 ciclos write→throw→rollback → 0 contaminación
- [ ] Auth RH A / RH B / Candidato / Super Admin / auto-login / token inválido → OK
- [ ] Public: vacancy, invitation, apply, video — A+A, B+B, A+B, B+A, fake token, legacy token → solo acceso legítimo
- [ ] Tenant APIs ×4 direcciones (A→A, B→B, A→B, B→A) en candidates, users, consent,
      positions, arco, evaluations, invite, questions, vacancies, interviews, results, dashboard
- [ ] Candidate isolation: CAND-A no alcanza CAND-A2 ni en su propio tenant
- [ ] SA impersonation → evalhr_app + contexto B + RLS + AuditLog (NO admin-db)
- [ ] SA aggregate → ADMIN_DATABASE_URL + evalhr_sa + admin-db (NO DATABASE_URL)
- [ ] Retention en staging: múltiples empresas, expirados, no expirados, idempotencia, AuditLog
- [ ] /api/migrate: NO puede activar RLS/FORCE/policies/roles; tras el switch a evalhr_app
      su DDL debe FALLAR (sin privilegios) — ver riesgos de orden §G

## F. Rollback y reactivación

- [ ] Estado previo capturado (catálogo + hash)
- [ ] `prisma/rls-rollback.sql` solo staging → 0 policies, 15/15 NO FORCE + DISABLE,
      función eliminada, grants revocados, roles preservados, datos intactos
- [ ] Reactivación completa (roles→functions→backfill→RLS) + catálogo + smoke + Pooler básico

## G. Orden de activación documental (dry-run — NO ejecutar aquí)

1.  Backup/snapshot de staging (timestamp, hash, conteos)
2.  Schema: `prisma db push` con DIRECT_URL (schema.prod.prisma) — ANTES de roles/RLS
3.  Roles: create-rls-role.sql (evalhr_app) + create-evalhr-sa-role.sql (evalhr_sa) — manual, superuser
4.  Functions: evalhr_current_tenant() (bloque STEP 0 de rls-policies.sql puede aplicarse junto al paso 7; si se aplica antes, es idempotente CREATE OR REPLACE)
5.  Backfill: backfill-indirect-companyid.sql → verificación 0 NULL / 100% parent-match
6.  NOT NULL: confirmar/convertir las 4 columnas indirectas (ALTER ... SET NOT NULL si el push no lo hizo)
7.  RLS: rls-policies.sql completo (ENABLE+FORCE 15, 60 policies) — manual, superuser
8.  Verification: catálogo real (pg_class/pg_policies/pg_roles) + pruebas sin contexto/A/B + DDL negativo
9.  Cambiar DATABASE_URL staging → Pooler con evalhr_app (LA APP DEJA DE TENER DDL)
10. Configurar ADMIN_DATABASE_URL staging → evalhr_sa (probar aggregate OK y, sin la var, FAIL CLOSED)
11. Pooler: validar Supavisor transaction mode con la app real
12. Tests: RLS-01..07, todas las tablas, FORCE, bypass, auth, public, tenant, candidate, SA×2, retention, migrate
13. Rollback: rls-rollback.sql → verificar unwinding completo
14. Reactivación: repetir 3–8 (roles preservados) + catálogo + smoke
15. Tests finales + catálogo definitivo + evidencia (sin secretos)

## H. Riesgos de orden detectados (análisis — nada ejecutado)

1. **/api/migrate pierde DDL tras el switch de rol (paso 9).** Su DDL (ALTER TABLE
   "User" ADD COLUMN..., CREATE TABLE "AuditLog"/"ConsentLog"/"CompanyPrivacyNotice"...)
   corre sobre la conexión DATABASE_URL. Con evalhr_app (sin CREATE/ALTER, por diseño)
   cada statement fallará con permission denied. Consecuencia: la sincronización de
   schema DEBE completarse en el paso 2 (DIRECT_URL/postgres). /api/migrate queda como
   best-effort pre-switch únicamente; NUNCA como mecanismo de RLS (ese camino fue
   eliminado en D.2.8 — route.ts:394-409).
2. **vercel-build.sh ejecuta `prisma db push` con DIRECT_URL en cada deploy.** Tras
   activar RLS, un push que altere tablas seguirá siendo posible (corre como owner
   postgres vía directUrl) — intencional; pero un push que cree columnas nuevas ANTES
   del backfill puede dejar NULLs bajo policies NOT NULL → mantener la regla:
   push → backfill → NOT NULL → RLS, y añadir el parity-check de schema a CI
   (scripts/schema-parity-check.ts) antes de cada deploy.
3. **RLS antes que backfill = datos invisibles o INSERT denegado.** Las 4 indirectas
   con policies sobre companyId: si alguna fila queda NULL y la columna aún nullable,
   la policy de SELECT (companyId = tenant) la oculta silenciosamente; con NOT NULL y
   NULL pendiente, el ALTER falla. El orden 5→6→7 es obligatorio (backfill → NOT NULL → RLS).
4. **ADMIN_DATABASE_URL debe apuntar a evalhr_sa, nunca a evalhr_app/postgres.** Si se
   configura con el rol equivocado, el aggregate hereda RLS (filas faltantes) o el rol
   postgres (superusuario) elimina la barrera administrativa. Verificación negativa
   obligatoria en el paso 10 (quitar la var → fail-closed 500 sin datos).
5. **Functions/RLS con search_path:** rls-policies.sql asume `public` en el
   search_path del superuser que lo ejecuta; en Supabase confirmar que las tablas viven
   en public y que el SQL Editor corre como postgres con ese search_path.
6. **evalhr_current_tenant() bajo transacciones con múltiples tenants:** set_config
   is_local=true es por-transacción; si un request mezcla tenants en UNA transacción,
   el segundo scope no puede re-fijarse sin contaminar el rollback de ambos — la app
   nunca debe hacerlo (1 transacción = 1 tenant), verificar en los tests de concurrencia.
7. **Rollback (paso 13) NO revierte el paso 9:** tras rollback, evalhr_app conserva
   DML grants... revocados por el STEP 5 del rollback → la app quedaría sin acceso.
   El rollback debe ejecutarse solo junto a un plan de conexión (revertir DATABASE_URL
   al rol con privilegios, p.ej. postgres temporal) — documentado como decisión de
   activación, no defecto del script (el rollback restaura el estado pre-RLS de RLS,
   no el de conectividad).
