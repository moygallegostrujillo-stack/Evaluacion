-- ============================================================
-- ROLLBACK: Remove RLS policies and disable RLS
-- PHASE 3.5-D.2.8 — Coherent full-reversal script
-- ============================================================
--
-- This script reverses the ENTIRE RLS implementation to the exact
-- pre-RLS state, leaving NO partially-protected state behind:
--   1. NO FORCE  (owner bypass restored — required before dropping
--      policies cleanly on owned tables)
--   2. DROP all policies (idempotent)
--   3. DISABLE RLS
--   4. DROP the evalhr_current_tenant() function
--   5. REVOKE the administrative role grants (evalhr_app / evalhr_sa),
--      guarded so the script is safe to run when the roles were never
--      created
--
-- ⚠️ Use ONLY if RLS is causing production issues (or to fully unwind
--    the activation). After rollback, app-level RLS (Prisma extension
--    in src/lib/rls.ts) still protects every tenant query, and the
--    SA AGGREGATE keeps running on the isolated ADMIN DB mechanism.
--
-- Run as the `postgres` superuser. Idempotent.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- STEP 1: NO FORCE ROW LEVEL SECURITY (all tenant-scoped tables)
-- ────────────────────────────────────────────────────────────
ALTER TABLE "Position" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "CandidateInvitation" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationSession" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResult" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSchedule" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplication" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "ArcoRequest" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "User" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "Question" NO FORCE ROW LEVEL SECURITY;
-- D.2.9: models that received a direct companyId (formerly indirect)
ALTER TABLE "EvaluationResponse" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationTemplate" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "VacancyQuestion" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplicationResponse" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "CompanyPrivacyNotice" NO FORCE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- STEP 2: DROP all policies (idempotent)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_position_select" ON "Position";
DROP POLICY IF EXISTS "rls_position_insert" ON "Position";
DROP POLICY IF EXISTS "rls_position_update" ON "Position";
DROP POLICY IF EXISTS "rls_position_delete" ON "Position";

DROP POLICY IF EXISTS "rls_invitation_select" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_insert" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_update" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_delete" ON "CandidateInvitation";

DROP POLICY IF EXISTS "rls_session_select" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_insert" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_update" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_delete" ON "EvaluationSession";

DROP POLICY IF EXISTS "rls_result_select" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_insert" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_update" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_delete" ON "EvaluationResult";

DROP POLICY IF EXISTS "rls_interview_select" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_insert" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_update" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_delete" ON "InterviewSchedule";

DROP POLICY IF EXISTS "rls_vacancy_select" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_insert" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_update" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_delete" ON "Vacancy";

DROP POLICY IF EXISTS "rls_vacapp_select" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_insert" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_update" ON "VacancyApplication";
DROP POLICY IF EXISTS "rls_vacapp_delete" ON "VacancyApplication";

DROP POLICY IF EXISTS "rls_arco_select" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_insert" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_update" ON "ArcoRequest";
DROP POLICY IF EXISTS "rls_arco_delete" ON "ArcoRequest";

DROP POLICY IF EXISTS "rls_user_select" ON "User";
DROP POLICY IF EXISTS "rls_user_insert" ON "User";
DROP POLICY IF EXISTS "rls_user_update" ON "User";
DROP POLICY IF EXISTS "rls_user_delete" ON "User";

DROP POLICY IF EXISTS "rls_question_select" ON "Question";
DROP POLICY IF EXISTS "rls_question_insert" ON "Question";
DROP POLICY IF EXISTS "rls_question_update" ON "Question";
DROP POLICY IF EXISTS "rls_question_delete" ON "Question";

-- D.2.9: formerly indirect models (now direct companyId)
DROP POLICY IF EXISTS "rls_evalresponse_select" ON "EvaluationResponse";
DROP POLICY IF EXISTS "rls_evalresponse_insert" ON "EvaluationResponse";
DROP POLICY IF EXISTS "rls_evalresponse_update" ON "EvaluationResponse";
DROP POLICY IF EXISTS "rls_evalresponse_delete" ON "EvaluationResponse";

DROP POLICY IF EXISTS "rls_evaltemplate_select" ON "EvaluationTemplate";
DROP POLICY IF EXISTS "rls_evaltemplate_insert" ON "EvaluationTemplate";
DROP POLICY IF EXISTS "rls_evaltemplate_update" ON "EvaluationTemplate";
DROP POLICY IF EXISTS "rls_evaltemplate_delete" ON "EvaluationTemplate";

DROP POLICY IF EXISTS "rls_vacquestion_select" ON "VacancyQuestion";
DROP POLICY IF EXISTS "rls_vacquestion_insert" ON "VacancyQuestion";
DROP POLICY IF EXISTS "rls_vacquestion_update" ON "VacancyQuestion";
DROP POLICY IF EXISTS "rls_vacquestion_delete" ON "VacancyQuestion";

DROP POLICY IF EXISTS "rls_vacappresponse_select" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_vacappresponse_insert" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_vacappresponse_update" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_vacappresponse_delete" ON "VacancyApplicationResponse";
DROP POLICY IF EXISTS "rls_privnotice_select" ON "CompanyPrivacyNotice";
DROP POLICY IF EXISTS "rls_privnotice_insert" ON "CompanyPrivacyNotice";
DROP POLICY IF EXISTS "rls_privnotice_update" ON "CompanyPrivacyNotice";
DROP POLICY IF EXISTS "rls_privnotice_delete" ON "CompanyPrivacyNotice";

-- ────────────────────────────────────────────────────────────
-- STEP 3: DISABLE ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
ALTER TABLE "Position" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "CandidateInvitation" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationSession" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResult" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSchedule" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplication" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ArcoRequest" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" DISABLE ROW LEVEL SECURITY;
-- D.2.9: formerly indirect models
ALTER TABLE "EvaluationResponse" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationTemplate" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyQuestion" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplicationResponse" DISABLE ROW LEVEL SECURITY;
-- PHASE 3.5-H (PARTE 16): CompanyPrivacyNotice joined the RLS set — its
-- DISABLE must mirror the ENABLE in rls-policies.sql so a rollback leaves
-- NO table RLS-enabled with zero policies (default-deny continuity trap).
ALTER TABLE "CompanyPrivacyNotice" DISABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- STEP 4: Drop the tenant-context helper function
-- ────────────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS evalhr_current_tenant();

-- ────────────────────────────────────────────────────────────
-- STEP 5: REVOKE administrative role grants (coherent unwind)
-- ────────────────────────────────────────────────────────────
-- Guarded: if a role was never created, the DO block skips it.
-- After revocation the roles still exist but have no table access;
-- dropping the roles themselves is deliberately manual (a DBA may
-- want to keep them for re-activation).

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evalhr_app') THEN
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM evalhr_app;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM evalhr_app;
    REVOKE USAGE ON SCHEMA public FROM evalhr_app;
    RAISE NOTICE 'evalhr_app grants revoked';
  ELSE
    RAISE NOTICE 'evalhr_app does not exist — nothing to revoke';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evalhr_sa') THEN
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM evalhr_sa;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM evalhr_sa;
    REVOKE USAGE ON SCHEMA public FROM evalhr_sa;
    RAISE NOTICE 'evalhr_sa grants revoked';
  ELSE
    RAISE NOTICE 'evalhr_sa does not exist — nothing to revoke';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- VERIFICATION (run after rollback): everything must be OFF
-- ────────────────────────────────────────────────────────────
--
-- SELECT c.relname, c.relrowsecurity AS rls_enabled,
--        c.relforcerowsecurity AS rls_forced
-- FROM pg_class c
-- JOIN pg_namespace n ON c.relnamespace = n.oid
-- WHERE n.nspname = 'public' AND c.relkind = 'r'
--   AND c.relname IN ('Position','CandidateInvitation','EvaluationSession',
--     'EvaluationResult','InterviewSchedule','Vacancy','VacancyApplication',
--     'ArcoRequest','User','Question','EvaluationResponse',
--     'EvaluationTemplate','VacancyQuestion','VacancyApplicationResponse')
-- ORDER BY c.relname;
--
-- Expected: rls_enabled = false, rls_forced = false on every row.
--
-- SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
-- Expected: 0
-- ============================================================
