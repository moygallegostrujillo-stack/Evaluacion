-- ============================================================
-- PostgreSQL Row-Level Security (RLS) Policies for EvaluHR
-- PHASE 3.5-D.2.8 — DEFINITIVE VERSION (PRE-RLS CLOSURE)
-- ============================================================
--
-- ⚠️  STATUS: NOT EXECUTED. This file is PREPARATION ONLY.
--     It must NEVER be applied through a runtime HTTP endpoint
--     (the former /api/migrate step-11 path was removed in D.2.8).
--     Activation requires a controlled, manual, DBA-run migration
--     in a dedicated activation phase (staging first, then prod).
--
-- WHAT CHANGED vs the old (dormant) version:
--   1. app.is_super_admin is GONE — zero occurrences. The GUC bypass
--      no longer exists in the function, in any policy, or anywhere
--      else. Dormant SQL can no longer reintroduce the mechanism when
--      RLS is activated.
--   2. evalhr_current_tenant() is now SECURITY INVOKER with a locked
--      search_path. It knows NOTHING about Super Admin, aggregate
--      mode, or any bypass. Fail-closed.
--   3. Policies depend ONLY on evalhr_current_tenant() /
--      app.current_company_id. No bypass by any manipulable variable.
--   4. User / Question: GLOBAL READ vs GLOBAL WRITE separation —
--      tenants may READ global (companyId IS NULL) rows (system
--      question bank, login lookups) but can never WRITE them
--      (INSERT/UPDATE/DELETE require companyId = current tenant).
--   5. SA AGGREGATE is handled OUTSIDE this file: it uses the isolated
--      ADMIN DB mechanism (src/lib/admin-db.ts) over a dedicated
--      evalhr_sa connection (see prisma/create-evalhr-sa-role.sql)
--      whose role attribute (BYPASSRLS, granted only by a superuser)
--      is what allows global reads under FORCE RLS. Policies stay
--      pure-tenant; no policy contains administrative logic.
--
-- How it works:
--   1. FORCE RLS on all tenant-scoped tables (even the table owner
--      cannot bypass; only a role with BYPASSRLS — evalhr_sa — can).
--   2. App (evalhr_app) sets app.current_company_id via
--      SELECT set_config('app.current_company_id', $1, true) — parameter-
--      bound and transaction-local — in each transaction
--      (src/lib/db-rls-session.ts, PHASE 3.5-I.1; the former
--      "SET LOCAL ... = $1" could never accept a bind parameter).
--   3. Policies check: companyId = evalhr_current_tenant().
--   4. If app.current_company_id is empty/missing → '__DENIED__' →
--      ZERO rows (fail-closed).
--
-- PREREQUISITES (activation phase, manual):
--   1. prisma/create-rls-role.sql      → evalhr_app  (NOBYPASSRLS)
--   2. prisma/create-evalhr-sa-role.sql → evalhr_sa   (aggregate only)
--   3. ADMIN_DATABASE_URL env var → evalhr_sa connection for admin-db
--   4. DATABASE_URL switched to evalhr_app (staging first)
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- STEP 0: Fail-closed tenant context function
-- ════════════════════════════════════════════════════════════
-- SECURITY INVOKER (not DEFINER): the function runs with the
-- privileges of the calling role and grants nothing by itself.
-- SET search_path = '': the function can only resolve built-in
-- identifiers, so a malicious object named current_setting cannot be
-- injected via a hijacked schema search path.
-- Knows NOTHING about Super Admin / aggregate / bypasses.

CREATE OR REPLACE FUNCTION evalhr_current_tenant()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  tenant TEXT;
BEGIN
  BEGIN
    tenant := current_setting('app.current_company_id', true);
  EXCEPTION WHEN OTHERS THEN
    tenant := NULL;
  END;

  IF tenant IS NULL OR tenant = '' THEN
    -- Fail-closed: no tenant context = deny ALL rows.
    -- There is NO alternative path: no super-admin flag, no aggregate
    -- mode, no role check. Global reads belong to evalhr_sa's
    -- role-level BYPASSRLS attribute, never to this function.
    RETURN '__DENIED__';
  END IF;

  RETURN tenant;
END;
$$;

-- ════════════════════════════════════════════════════════════
-- STEP 1: ENABLE + FORCE RLS on all tenant-scoped tables
-- ════════════════════════════════════════════════════════════
-- (NONE of these statements are executed today — preparation only.)

-- Tables with REQUIRED companyId
ALTER TABLE "Position" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Position" FORCE ROW LEVEL SECURITY;

ALTER TABLE "CandidateInvitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CandidateInvitation" FORCE ROW LEVEL SECURITY;

ALTER TABLE "EvaluationSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationSession" FORCE ROW LEVEL SECURITY;

ALTER TABLE "EvaluationResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResult" FORCE ROW LEVEL SECURITY;

ALTER TABLE "InterviewSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSchedule" FORCE ROW LEVEL SECURITY;

ALTER TABLE "Vacancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" FORCE ROW LEVEL SECURITY;

ALTER TABLE "VacancyApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplication" FORCE ROW LEVEL SECURITY;

ALTER TABLE "ArcoRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArcoRequest" FORCE ROW LEVEL SECURITY;

-- Tables with OPTIONAL companyId (null = global/system)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;

ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" FORCE ROW LEVEL SECURITY;

-- Tables that WERE indirect (scoped via parent) and got a direct NOT NULL
-- companyId in PHASE 3.5-D.2.9 (PARTE 9): policies below are pure-tenant.
ALTER TABLE "EvaluationResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResponse" FORCE ROW LEVEL SECURITY;

ALTER TABLE "EvaluationTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationTemplate" FORCE ROW LEVEL SECURITY;

ALTER TABLE "VacancyQuestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyQuestion" FORCE ROW LEVEL SECURITY;

ALTER TABLE "VacancyApplicationResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplicationResponse" FORCE ROW LEVEL SECURITY;
ALTER TABLE "CompanyPrivacyNotice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyPrivacyNotice" FORCE ROW LEVEL SECURITY;

-- ════════════════════════════════════════════════════════════
-- STEP 2: Create RLS Policies
-- ════════════════════════════════════════════════════════════
-- Pattern for REQUIRED companyId tables:
--   USING ("companyId" = evalhr_current_tenant())
--
-- Pattern for OPTIONAL companyId tables (User, Question):
--   SELECT  → global read: ("companyId" IS NULL OR = tenant)
--   INSERT/UPDATE/DELETE → tenant-only: "companyId" = tenant
--   ⇒ A normal company can NEVER create/modify/delete GLOBAL
--     (system) records. GLOBAL READ ≠ GLOBAL WRITE.
-- ════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────
-- Position
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_position_select" ON "Position";
DROP POLICY IF EXISTS "rls_position_insert" ON "Position";
DROP POLICY IF EXISTS "rls_position_update" ON "Position";
DROP POLICY IF EXISTS "rls_position_delete" ON "Position";

CREATE POLICY "rls_position_select" ON "Position" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_position_insert" ON "Position" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_position_update" ON "Position" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_position_delete" ON "Position" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- CandidateInvitation
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_invitation_select" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_insert" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_update" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_delete" ON "CandidateInvitation";

CREATE POLICY "rls_invitation_select" ON "CandidateInvitation" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_invitation_insert" ON "CandidateInvitation" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_invitation_update" ON "CandidateInvitation" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_invitation_delete" ON "CandidateInvitation" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- EvaluationSession
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_session_select" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_insert" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_update" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_delete" ON "EvaluationSession";

CREATE POLICY "rls_session_select" ON "EvaluationSession" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_session_insert" ON "EvaluationSession" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_session_update" ON "EvaluationSession" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_session_delete" ON "EvaluationSession" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- EvaluationResult
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_result_select" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_insert" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_update" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_delete" ON "EvaluationResult";

CREATE POLICY "rls_result_select" ON "EvaluationResult" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_result_insert" ON "EvaluationResult" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_result_update" ON "EvaluationResult" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_result_delete" ON "EvaluationResult" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- InterviewSchedule
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_interview_select" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_insert" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_update" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_delete" ON "InterviewSchedule";

CREATE POLICY "rls_interview_select" ON "InterviewSchedule" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_interview_insert" ON "InterviewSchedule" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_interview_update" ON "InterviewSchedule" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_interview_delete" ON "InterviewSchedule" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- Vacancy
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_vacancy_select" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_insert" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_update" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_delete" ON "Vacancy";

CREATE POLICY "rls_vacancy_select" ON "Vacancy" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacancy_insert" ON "Vacancy" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacancy_update" ON "Vacancy" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacancy_delete" ON "Vacancy" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- VacancyApplication
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_vacapp_select" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_insert" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_update" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_delete" ON "VacancyApplication";

CREATE POLICY "rls_vacapp_select" ON "VacancyApplication" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacapp_insert" ON "VacancyApplication" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacapp_update" ON "VacancyApplication" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacapp_delete" ON "VacancyApplication" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- ArcoRequest
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_arco_select" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_insert" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_update" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_delete" ON "ArcoRequest";

CREATE POLICY "rls_arco_select" ON "ArcoRequest" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_arco_insert" ON "ArcoRequest" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_arco_update" ON "ArcoRequest" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_arco_delete" ON "ArcoRequest" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- User (optional companyId)
--   GLOBAL READ: login / auth / consent bootstrap must find users by
--   email on a fresh connection with no tenant GUC yet. SELECT allows
--   NULL-company rows (platform users) plus own-tenant rows.
--   ⚠ Documented tradeoff: under RLS, the evalhr_app connection can
--   technically SELECT global user rows; authorization remains
--   enforced by the application layer (same exposure as today's
--   login path). Password hashes are never returned by any API.
--   GLOBAL WRITE: tenants can only INSERT/UPDATE/DELETE rows of
--   their own company — never platform (NULL) users.
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_user_select" ON "User";
DROP POLICY IF EXISTS "rls_user_insert" ON "User";
DROP POLICY IF EXISTS "rls_user_update" ON "User";
DROP POLICY IF EXISTS "rls_user_delete" ON "User";

CREATE POLICY "rls_user_select" ON "User" FOR SELECT USING (
  "companyId" IS NULL
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_user_insert" ON "User" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_user_update" ON "User" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_user_delete" ON "User" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- Question (optional companyId — null = system/global question bank)
--   GLOBAL READ: every tenant must see the system question bank.
--   GLOBAL WRITE: only rows created by the tenant itself. The old
--   dormant version allowed tenants to UPDATE global questions
--   (companyId IS NULL in the UPDATE USING clause) — that hole is
--   closed here: NULL rows are read-only for everyone except the
--   evalhr_sa administrative connection (role-level BYPASSRLS).
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_question_select" ON "Question";
DROP POLICY IF EXISTS "rls_question_insert" ON "Question";
DROP POLICY IF EXISTS "rls_question_update" ON "Question";
DROP POLICY IF EXISTS "rls_question_delete" ON "Question";

CREATE POLICY "rls_question_select" ON "Question" FOR SELECT USING (
  "companyId" IS NULL
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_question_insert" ON "Question" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_question_update" ON "Question" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_question_delete" ON "Question" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- EvaluationResponse (D.2.9: direct companyId == session.companyId)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_evalresponse_select" ON "EvaluationResponse";
DROP POLICY IF EXISTS "rls_evalresponse_insert" ON "EvaluationResponse";
DROP POLICY IF EXISTS "rls_evalresponse_update" ON "EvaluationResponse";
DROP POLICY IF EXISTS "rls_evalresponse_delete" ON "EvaluationResponse";

CREATE POLICY "rls_evalresponse_select" ON "EvaluationResponse" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_evalresponse_insert" ON "EvaluationResponse" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_evalresponse_update" ON "EvaluationResponse" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_evalresponse_delete" ON "EvaluationResponse" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- EvaluationTemplate (D.2.9: direct companyId == position.companyId)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_evaltemplate_select" ON "EvaluationTemplate";
DROP POLICY IF EXISTS "rls_evaltemplate_insert" ON "EvaluationTemplate";
DROP POLICY IF EXISTS "rls_evaltemplate_update" ON "EvaluationTemplate";
DROP POLICY IF EXISTS "rls_evaltemplate_delete" ON "EvaluationTemplate";

CREATE POLICY "rls_evaltemplate_select" ON "EvaluationTemplate" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_evaltemplate_insert" ON "EvaluationTemplate" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_evaltemplate_update" ON "EvaluationTemplate" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_evaltemplate_delete" ON "EvaluationTemplate" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- VacancyQuestion (D.2.9: direct companyId == vacancy.companyId)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_vacquestion_select" ON "VacancyQuestion";
DROP POLICY IF EXISTS "rls_vacquestion_insert" ON "VacancyQuestion";
DROP POLICY IF EXISTS "rls_vacquestion_update" ON "VacancyQuestion";
DROP POLICY IF EXISTS "rls_vacquestion_delete" ON "VacancyQuestion";

CREATE POLICY "rls_vacquestion_select" ON "VacancyQuestion" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacquestion_insert" ON "VacancyQuestion" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacquestion_update" ON "VacancyQuestion" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacquestion_delete" ON "VacancyQuestion" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- VacancyApplicationResponse (D.2.9: direct companyId == application.companyId)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_vacappresponse_select" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_vacappresponse_insert" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_vacappresponse_update" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_vacappresponse_delete" ON "VacancyApplicationResponse";

CREATE POLICY "rls_vacappresponse_select" ON "VacancyApplicationResponse" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacappresponse_insert" ON "VacancyApplicationResponse" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacappresponse_update" ON "VacancyApplicationResponse" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacappresponse_delete" ON "VacancyApplicationResponse" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- CompanyPrivacyNotice (PHASE 3.5-H — PARTE 16 DECISION A)
-- Per-tenant legal document (companyId @unique). Registered in the
-- app-layer TENANT_SCOPED_MODELS as of 3.5-H; this block makes the DB
-- layer consistent so the "sin RLS" gap never reopens. NOT EXECUTED in
-- 3.5-H — activates with the rest of the RLS artifact set.
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_privnotice_select" ON "CompanyPrivacyNotice";
DROP POLICY IF EXISTS "rls_privnotice_insert" ON "CompanyPrivacyNotice";
DROP POLICY IF EXISTS "rls_privnotice_update" ON "CompanyPrivacyNotice";
DROP POLICY IF EXISTS "rls_privnotice_delete" ON "CompanyPrivacyNotice";

CREATE POLICY "rls_privnotice_select" ON "CompanyPrivacyNotice" FOR SELECT USING (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_privnotice_insert" ON "CompanyPrivacyNotice" FOR INSERT WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_privnotice_update" ON "CompanyPrivacyNotice" FOR UPDATE USING (
  "companyId" = evalhr_current_tenant()
) WITH CHECK (
  "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_privnotice_delete" ON "CompanyPrivacyNotice" FOR DELETE USING (
  "companyId" = evalhr_current_tenant()
);

-- ════════════════════════════════════════════════════════════
-- STEP 3: Row counts that must remain GLOBAL (not tenant-scoped)
-- ════════════════════════════════════════════════════════════
-- Company           → tenant root (SA administration; evalhr_sa only)
-- AuditLog          → security log (platform-wide, append-only use)
-- ConsentLog        → LFPDPPP evidence (platform-wide)
-- CompanyPrivacyNotice → tenant-root child, managed by SA/RH flows
--
-- These tables deliberately have NO RLS policies. If a future phase
-- wants RLS on them, it must add explicit policies — never a GUC
-- bypass.

-- ════════════════════════════════════════════════════════════
-- VERIFICATION QUERY (run AFTER a controlled activation)
-- ════════════════════════════════════════════════════════════
--
-- SELECT c.relname AS table_name,
--        c.relrowsecurity AS rls_enabled,
--        c.relforcerowsecurity AS rls_forced
-- FROM pg_class c
-- JOIN pg_namespace n ON c.relnamespace = n.oid
-- WHERE n.nspname = 'public'
--   AND c.relkind = 'r'
--   AND c.relname IN (
--     'Position', 'CandidateInvitation', 'EvaluationSession',
--     'EvaluationResult', 'InterviewSchedule', 'Vacancy',
--     'VacancyApplication', 'ArcoRequest', 'User', 'Question',
--     'EvaluationResponse', 'EvaluationTemplate', 'VacancyQuestion',
--     'VacancyApplicationResponse', 'CompanyPrivacyNotice'
--   )
-- ORDER BY c.relname;
--
-- All rows must show: rls_enabled = true, rls_forced = true
--
-- Confirm NO bypass GUC is referenced by any policy:
--
-- SELECT policyname, tablename, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND (qual LIKE '%is_super_admin%' OR with_check LIKE '%is_super_admin%');
--
-- Expected result: ZERO rows.
-- ════════════════════════════════════════════════════════════
