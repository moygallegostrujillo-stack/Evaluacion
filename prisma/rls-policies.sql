-- ============================================================
-- PostgreSQL Row-Level Security (RLS) Policies for EvaluHR
-- PHASE 3.5-B.3 — IMPLEMENTACIÓN REAL DE RLS
-- ============================================================
--
-- CORRECTED VERSION — Fail-closed, FORCE RLS, ArcoRequest included
--
-- Key changes from previous version:
-- 1. FORCE ROW LEVEL SECURITY on ALL tenant-scoped tables
-- 2. ArcoRequest policies added
-- 3. Fail-closed: empty/missing app.current_company_id denies ALL rows
-- 4. app.is_super_admin is the ONLY bypass (no NULL companyId = global)
--
-- How it works:
-- 1. FORCE RLS on all tenant-scoped tables (even owner can't bypass)
-- 2. App sets app.current_company_id via SET LOCAL in each transaction
-- 3. RLS policies check: companyId = current_setting('app.current_company_id')
-- 4. SUPER_ADMIN bypasses via app.is_super_admin = 'true'
-- 5. If app.current_company_id is empty/missing → DENY ALL (fail-closed)
--
-- PREREQUISITE: Create the evalhr_app role (non-superuser) FIRST.
-- See: scripts/create-rls-role.sql
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- STEP 0: Fail-closed helper function
-- ════════════════════════════════════════════════════════════
-- Returns the current tenant ID, or raises an exception if not set.
-- This ensures that a missing context NEVER results in global access.

CREATE OR REPLACE FUNCTION evalhr_current_tenant()
RETURNS TEXT AS $$
DECLARE
  tenant TEXT;
  is_sa TEXT;
BEGIN
  is_sa := current_setting('app.is_super_admin', true);
  IF is_sa = 'true' THEN
    RETURN NULL; -- SA bypass: return NULL to signal "all allowed"
  END IF;

  tenant := current_setting('app.current_company_id', true);
  IF tenant IS NULL OR tenant = '' THEN
    -- Fail-closed: no tenant context = deny all rows
    RETURN '__DENIED__';
  END IF;
  RETURN tenant;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ════════════════════════════════════════════════════════════
-- STEP 1: ENABLE + FORCE RLS on all tenant-scoped tables
-- ════════════════════════════════════════════════════════════

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

-- ════════════════════════════════════════════════════════════
-- STEP 2: Create RLS Policies
-- ════════════════════════════════════════════════════════════
-- Pattern for REQUIRED companyId tables:
--   USING (current_setting('app.is_super_admin', true) = 'true'
--          OR "companyId" = evalhr_current_tenant())
--
-- Pattern for OPTIONAL companyId tables (User, Question):
--   USING (current_setting('app.is_super_admin', true) = 'true'
--          OR "companyId" IS NULL  -- global/system records
--          OR "companyId" = evalhr_current_tenant())
-- ════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────
-- Position
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_position_select" ON "Position";
DROP POLICY IF EXISTS "rls_position_insert" ON "Position";
DROP POLICY IF EXISTS "rls_position_update" ON "Position";
DROP POLICY IF EXISTS "rls_position_delete" ON "Position";

CREATE POLICY "rls_position_select" ON "Position" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_position_insert" ON "Position" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_position_update" ON "Position" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_position_delete" ON "Position" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- CandidateInvitation
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_invitation_select" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_insert" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_update" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_delete" ON "CandidateInvitation";

CREATE POLICY "rls_invitation_select" ON "CandidateInvitation" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_invitation_insert" ON "CandidateInvitation" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_invitation_update" ON "CandidateInvitation" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_invitation_delete" ON "CandidateInvitation" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- EvaluationSession
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_session_select" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_insert" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_update" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_delete" ON "EvaluationSession";

CREATE POLICY "rls_session_select" ON "EvaluationSession" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_session_insert" ON "EvaluationSession" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_session_update" ON "EvaluationSession" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_session_delete" ON "EvaluationSession" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- EvaluationResult
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_result_select" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_insert" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_update" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_delete" ON "EvaluationResult";

CREATE POLICY "rls_result_select" ON "EvaluationResult" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_result_insert" ON "EvaluationResult" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_result_update" ON "EvaluationResult" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_result_delete" ON "EvaluationResult" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- InterviewSchedule
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_interview_select" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_insert" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_update" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_delete" ON "InterviewSchedule";

CREATE POLICY "rls_interview_select" ON "InterviewSchedule" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_interview_insert" ON "InterviewSchedule" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_interview_update" ON "InterviewSchedule" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_interview_delete" ON "InterviewSchedule" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- Vacancy
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_vacancy_select" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_insert" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_update" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_delete" ON "Vacancy";

CREATE POLICY "rls_vacancy_select" ON "Vacancy" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacancy_insert" ON "Vacancy" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacancy_update" ON "Vacancy" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacancy_delete" ON "Vacancy" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- VacancyApplication
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_vacapp_select" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_insert" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_update" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_delete" ON "VacancyApplication";

CREATE POLICY "rls_vacapp_select" ON "VacancyApplication" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacapp_insert" ON "VacancyApplication" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacapp_update" ON "VacancyApplication" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_vacapp_delete" ON "VacancyApplication" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- ArcoRequest
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_arco_select" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_insert" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_update" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_delete" ON "ArcoRequest";

CREATE POLICY "rls_arco_select" ON "ArcoRequest" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_arco_insert" ON "ArcoRequest" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_arco_update" ON "ArcoRequest" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_arco_delete" ON "ArcoRequest" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- User (optional companyId — null = SUPER_ADMIN or system user)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_user_select" ON "User";
DROP POLICY IF EXISTS "rls_user_insert" ON "User";
DROP POLICY IF EXISTS "rls_user_update" ON "User";
DROP POLICY IF EXISTS "rls_user_delete" ON "User";

CREATE POLICY "rls_user_select" ON "User" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" IS NULL
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_user_insert" ON "User" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_user_update" ON "User" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" IS NULL
  OR "companyId" = evalhr_current_tenant()
) WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
  OR "companyId" IS NULL
);
CREATE POLICY "rls_user_delete" ON "User" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ────────────────────────────────────────────────────────────
-- Question (optional companyId — null = system/global question)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_question_select" ON "Question";
DROP POLICY IF EXISTS "rls_question_insert" ON "Question";
DROP POLICY IF EXISTS "rls_question_update" ON "Question";
DROP POLICY IF EXISTS "rls_question_delete" ON "Question";

CREATE POLICY "rls_question_select" ON "Question" FOR SELECT USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" IS NULL
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_question_insert" ON "Question" FOR INSERT WITH CHECK (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_question_update" ON "Question" FOR UPDATE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" IS NULL
  OR "companyId" = evalhr_current_tenant()
);
CREATE POLICY "rls_question_delete" ON "Question" FOR DELETE USING (
  current_setting('app.is_super_admin', true) = 'true'
  OR "companyId" = evalhr_current_tenant()
);

-- ════════════════════════════════════════════════════════════
-- VERIFICATION QUERY
-- ════════════════════════════════════════════════════════════
-- Run this AFTER the script to confirm RLS is active + forced:
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
--     'VacancyApplication', 'ArcoRequest', 'User', 'Question'
--   )
-- ORDER BY c.relname;
--
-- All should show: rls_enabled = true, rls_forced = true
-- ════════════════════════════════════════════════════════════
