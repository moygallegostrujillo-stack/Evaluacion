-- ============================================================
-- Create the SA AGGREGATE administrative role for EvaluHR
-- PHASE 3.5-D.2.8 — DESIGN ONLY (DO NOT EXECUTE YET)
-- ============================================================
--
-- ⚠️  STATUS: NOT EXECUTED. This file is the documented design of the
--     evalhr_sa role (D.2.8 FASE 5). It must ONLY be run manually by a
--     superuser (Supabase SQL Editor / psql as postgres) during the
--     RLS ACTIVATION phase — never from a runtime HTTP endpoint.
--
-- WHY evalhr_sa EXISTS
--   Under ENABLE + FORCE ROW LEVEL SECURITY with pure-tenant policies
--   (prisma/rls-policies.sql), the ONLY way to read across tenants is
--   a role-level attribute granted by a superuser — NOT a session
--   variable, NOT a GUC, NOT a policy branch. app.is_super_admin was
--   eliminated in D.2.7/D.2.8 precisely because a manipulable GUC can
--   be set by any code that can run SQL.
--
--   evalhr_sa is the "SA AGGREGATE" identity: the connection used by
--   src/lib/admin-db.ts (set ADMIN_DATABASE_URL to this role's
--   credentials at activation time). It is NOT used for tenant
--   traffic (evalhr_app) and NOT used for impersonation (evalhr_app +
--   app.current_company_id = target).
--
-- PRIVILEGE MATRIX (D.2.8 FASE 5 / FASE 22)
--   | Privilege          | evalhr_app | evalhr_sa | postgres     |
--   |--------------------|------------|-----------|--------------|
--   | LOGIN              | yes        | yes       | yes          |
--   | SUPERUSER          | NO         | NO        | yes          |
--   | BYPASSRLS          | NO         | yes*      | yes          |
--   | CREATEDB/CREATEROLE| NO         | NO        | yes          |
--   | DML (S/I/U/D)      | yes (RLS)  | yes       | yes          |
--   | DDL (ALTER/CREATE) | NO         | NO        | yes          |
--   | EXECUTE functions  | own-schema | own-schema| yes          |
--   | CREATE ROLE        | NO         | NO        | yes          |
--   * BYPASSRLS on evalhr_sa is the aggregate mechanism. It is
--     deliberately NOT given to evalhr_app. Compensating controls:
--     password lives only in server-only env (ADMIN_DATABASE_URL),
--     the connection is reachable only through src/lib/admin-db.ts
--     high-level metrics functions, every invocation is AuditLogged
--     with mode='AGGREGATE', and the role has NO DDL rights.
--
-- ============================================================

-- Step 1: Create the role (if not exists)
-- NOTE: set the password at execution time from a vault/secret —
-- never hard-code it in this file or in git.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evalhr_sa') THEN
    CREATE ROLE evalhr_sa
      LOGIN
      PASSWORD '<SET_VIA_ENV_VAR_AT_ACTIVATION_TIME>'
      NOSUPERUSER        -- never a superuser: no arbitrary privileges
      NOCREATEDB
      NOCREATEROLE       -- cannot mint new roles
      NOREPLICATION
      BYPASSRLS;         -- the ONLY aggregate bypass mechanism (role attr)
    RAISE NOTICE 'Role evalhr_sa created';
  ELSE
    RAISE NOTICE 'Role evalhr_sa already exists';
  END IF;
END $$;

-- Step 2: Connection + schema usage
GRANT CONNECT ON DATABASE postgres TO evalhr_sa;
GRANT USAGE ON SCHEMA public TO evalhr_sa;

-- Step 3: DML only — SELECT/INSERT/UPDATE/DELETE on existing tables.
-- NO DDL grants (CREATE/ALTER/DROP stay with postgres). NO CREATE ROLE.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO evalhr_sa;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO evalhr_sa;

-- Step 4: Default privileges for future tables created by postgres
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO evalhr_sa;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO evalhr_sa;

-- Step 5: Verify the role shape — evalhr_sa MUST show:
--   rolsuper=f, rolbypassrls=t, rolcreatedb=f, rolcreaterole=f
SELECT rolname, rolsuper, rolbypassrls, rolcreatedb, rolcreaterole
FROM pg_roles
WHERE rolname IN ('evalhr_app', 'evalhr_sa');
--
-- Expected result:
--   rolname     | rolsuper | rolbypassrls | rolcreatedb | rolcreaterole
--   evalhr_app  | f        | f            | f           | f
--   evalhr_sa   | f        | t            | f           | f
--
-- And evalhr_app must NEVER gain BYPASSRLS:
--   ALTER ROLE evalhr_app BYPASSRLS;  ← FORBIDDEN. Never run this.
-- ============================================================
