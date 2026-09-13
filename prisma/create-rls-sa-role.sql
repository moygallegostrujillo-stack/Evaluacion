-- ════════════════════════════════════════════════════════════════════════
-- EVALUHR — Fase 3.5-F (PARTE 6) — evalhr_sa: ROL ADMINISTRATIVO SA_AGGREGATE
-- ════════════════════════════════════════════════════════════════════════
-- PROPÓSITO: rol de conexión EXCLUSIVO para:
--   (1) SA aggregate (dashboard/results/candidates/companies/positions globales)
--       vía src/lib/admin-db.ts (ADMIN_DATABASE_URL, fail-closed).
--   (2) Trabajos administrativos MULTI-TENANT: retention purge
--       (src/lib/retention.ts vía withAdminDbClient).
--
-- JUSTIFICACIÓN DE BYPASSRLS (documentación exigida por Fase 3.5-F PARTE 6):
--   * POR QUÉ: las policies RLS filtran únicamente por
--     current_setting('app.current_company_id'). El SA aggregate y la
--     retención DEBEN recorrer TODAS las empresas desde el servidor; sin
--     BYPASSRLS verían 0 filas (fail-closed) — es el equivalente mínimo al
--     patrón Supabase service_role (BYPASSRLS, no superuser).
--   * QUÉ PUEDE EJECUTAR: solo lecturas agregadas (SELECT), la DML mínima
--     enumerada abajo (retención + administración de preguntas globales +
--     creación de empresas) y SELECT 1 (probe de salud).
--   * QUÉ TABLAS PUEDE LEER: todas las de negocio en schema public (SELECT).
--   * QUÉ PUEDE MODIFICAR: UPDATE {User, EvaluationResult, Question};
--     DELETE {EvaluationResponse, AuditLog, Question};
--     INSERT {Company, CompanyPrivacyNotice}. NADA MÁS.
--   * QUÉ NO PUEDE HACER: ningún DDL (CREATE/ALTER/DROP), ningún CREATE
--     ROLE/GRANT, no es owner de ninguna tabla, no es miembro de ningún
--     otro rol, no puede ser asumido por evalhr_app (sin membership).
--   * NUNCA usar evalhr_sa para rutas tenant (evalhr_app lo cubre) ni
--     exponer su credencial fuera de ADMIN_DATABASE_URL del servidor.
--   * NO SUPERUSER (preferencia de la instrucción cumplida).
--
-- USO:  psql -v sa_password='<secreto>' -f create-rls-sa-role.sql
--       (el password NUNCA se versiona; en staging se inyecta desde
--        .pw_evalhr_sa chmod 600 por f-setup-sa.mjs)
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. ROL ──────────────────────────────────────────────────────────────
SELECT 'CREATE ROLE evalhr_sa WITH LOGIN PASSWORD :''sa_password'' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION BYPASSRLS'
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'evalhr_sa')\gexec

ALTER ROLE evalhr_sa WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION BYPASSRLS;

COMMENT ON ROLE evalhr_sa IS 'EvaluHR SA_AGGREGATE/admin jobs (retention). BYPASSRLS documented in prisma/create-rls-sa-role.sql. NO DDL, no owner, no memberships. ADMIN_DATABASE_URL only — never tenant routes.';

-- ── 2. PRIVILEGIOS MÍNIMOS ──────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO evalhr_sa;

-- Lectura agregada (SA aggregate + retention reads)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO evalhr_sa;

-- DML administrativa mínima y enumerada (ver cabecera)
GRANT INSERT ON TABLE "Company", "CompanyPrivacyNotice" TO evalhr_sa;
GRANT UPDATE ON TABLE "User", "EvaluationResult", "Question" TO evalhr_sa;
GRANT DELETE ON TABLE "EvaluationResponse", "AuditLog", "Question" TO evalhr_sa;

-- Futuras tablas creadas por el owner: solo SELECT automático.
-- (el owner real se verifica en P20; este comando se ajusta a ese owner)
DO $$
DECLARE v_owner text;
BEGIN
  SELECT tableowner INTO v_owner FROM pg_tables
  WHERE schemaname='public' AND tablename='Company';
  EXECUTE format(
    'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public GRANT SELECT ON TABLES TO evalhr_sa',
    v_owner);
END $$;

-- ── 3. VERIFICACIÓN (la evidencia la registra el runner de staging) ─────
-- SELECT rolname, rolcanlogin, rolsuper, rolbypassrls, rolcreaterole,
--        rolcreatedb, rolreplication FROM pg_roles WHERE rolname='evalhr_sa';
-- SELECT has_table_privilege('evalhr_sa','User','SELECT'),
--        has_table_privilege('evalhr_sa','User','UPDATE'),
--        has_table_privilege('evalhr_sa','Company','INSERT'),
--        has_table_privilege('evalhr_sa','Position','INSERT'),
--        has_table_privilege('evalhr_sa','Position','DELETE'),
--        has_table_privilege('evalhr_sa','EvaluationResponse','DELETE');
