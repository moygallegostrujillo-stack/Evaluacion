-- ============================================================
-- Create non-superuser application role for EvaluHR
-- PHASE 3.5-B.3
-- ============================================================
--
-- This script creates a PostgreSQL role that Prisma will use to
-- connect to the database. The role is NOT a superuser and does
-- NOT have BYPASSRLS, so RLS policies are enforced even though
-- the role owns the tables.
--
-- PREREQUISITE: Run this as the `postgres` superuser.
--
-- After creating the role, update DATABASE_URL in Vercel env vars
-- to use this role instead of `postgres`.
--
-- ⚠️ ACTION MANUAL: This script must be executed manually in
--    Supabase Dashboard → SQL Editor.
-- ============================================================

-- Step 1: Create the role (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evalhr_app') THEN
    CREATE ROLE evalhr_app
      LOGIN
      PASSWORD '<SET_VIA_ENV_VAR>'
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOREPLICATION
      NOBYPASSRLS;
    RAISE NOTICE 'Role evalhr_app created';
  ELSE
    RAISE NOTICE 'Role evalhr_app already exists';
  END IF;
END $$;

-- Step 2: Grant connection to the database
GRANT CONNECT ON DATABASE postgres TO evalhr_app;

-- Step 3: Grant schema usage
GRANT USAGE ON SCHEMA public TO evalhr_app;

-- Step 4: Grant table permissions (SELECT, INSERT, UPDATE, DELETE)
-- on all existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO evalhr_app;

-- Step 5: Grant sequence usage (for autoincrement if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO evalhr_app;

-- Step 6: Set default privileges for future tables created by `postgres`
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO evalhr_app;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO evalhr_app;

-- Step 6b (PHASE 3.5-H — PARTE 17): AUDIT LOG APPEND-ONLY BARRIER.
-- The AuditLog is the tamper-evidence surface for impersonation, aggregate
-- access and unauthorized attempts. evalhr_app keeps INSERT (it writes the
-- events) + SELECT (verification queries), but loses UPDATE/DELETE so a
-- compromised tenant connection cannot rewrite or erase history.
-- evalhr_sa (create-evalhr-sa-role.sql) never writes AuditLog — the
-- administrative connection only reads aggregates.
REVOKE UPDATE, DELETE ON TABLE "AuditLog" FROM evalhr_app;

-- Step 7: Verify the role does NOT have dangerous privileges
SELECT rolname, rolsuper, rolbypassrls, rolcreatedb, rolcreaterole
FROM pg_roles
WHERE rolname = 'evalhr_app';
--
-- Expected result:
--   rolname     | rolsuper | rolbypassrls | rolcreatedb | rolcreaterole
--   evalhr_app  | f        | f            | f            | f
-- ============================================================
