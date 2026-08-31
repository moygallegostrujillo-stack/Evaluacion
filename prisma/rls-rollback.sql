-- ============================================================
-- ROLLBACK: Remove RLS policies and disable RLS
-- PHASE 3.5-B.3 — Rollback script
-- ============================================================
--
-- This script reverses the RLS implementation:
-- 1. Drops all RLS policies
-- 2. Disables RLS on all tenant-scoped tables
-- 3. Drops the evalhr_current_tenant() function
--
-- ⚠️ Use ONLY if RLS is causing production issues.
-- After rollback, app-level RLS (Prisma extension) still works.
-- ============================================================

-- Drop policies (idempotent)
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

-- Disable RLS
ALTER TABLE "Position" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "Position" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "CandidateInvitation" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "CandidateInvitation" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "EvaluationSession" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationSession" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "EvaluationResult" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResult" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "InterviewSchedule" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSchedule" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "Vacancy" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "VacancyApplication" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplication" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "ArcoRequest" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "ArcoRequest" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "User" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "Question" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "Question" DISABLE ROW LEVEL SECURITY;

-- Drop the helper function
DROP FUNCTION IF EXISTS evalhr_current_tenant();
