-- ============================================================
-- PostgreSQL Row-Level Security (RLS) Policies for EvaluHR
-- ============================================================
--
-- This SQL script creates RLS policies at the database level,
-- providing defense-in-depth alongside the application-level
-- Prisma Client Extension RLS implemented in src/lib/rls.ts.
--
-- How it works:
-- 1. Enable RLS on all tenant-scoped tables
-- 2. Create a session variable `app.current_company_id` that
--    is set before each request
-- 3. RLS policies check this variable against each row's companyId
-- 4. SUPER_ADMIN bypasses via `app.is_super_admin` = true
--
-- ⚠️ IMPORTANT: Prisma doesn't natively support setting session
-- variables. You need to use $executeRaw before queries:
--   await db.$executeRaw`SET LOCAL app.current_company_id = '${companyId}'`;
--   await db.$executeRaw`SET LOCAL app.is_super_admin = '${isSuperAdmin}'`;
--
-- These settings are transaction-scoped (LOCAL) and reset after
-- the transaction ends.
-- ============================================================

-- Step 1: Create custom GUC parameters for tenant context
-- (PostgreSQL allows custom parameters with the app. prefix)

-- Step 2: Enable RLS on all tenant-scoped tables
ALTER TABLE "Position" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CandidateInvitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VacancyApplication" ENABLE ROW LEVEL SECURITY;

-- User and Question have optional companyId (null = global/system)
-- For these, we use a different policy that allows null companyId
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies

-- ────────────────────────────────────────────────────────────
-- Position
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_position_select" ON "Position"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_position_insert" ON "Position"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_position_update" ON "Position"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  )
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_position_delete" ON "Position"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- CandidateInvitation
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_invitation_select" ON "CandidateInvitation"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_invitation_insert" ON "CandidateInvitation"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_invitation_update" ON "CandidateInvitation"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_invitation_delete" ON "CandidateInvitation"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- EvaluationSession
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_session_select" ON "EvaluationSession"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_session_insert" ON "EvaluationSession"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_session_update" ON "EvaluationSession"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_session_delete" ON "EvaluationSession"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- EvaluationResult
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_result_select" ON "EvaluationResult"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_result_insert" ON "EvaluationResult"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_result_update" ON "EvaluationResult"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_result_delete" ON "EvaluationResult"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- InterviewSchedule
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_interview_select" ON "InterviewSchedule"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_interview_insert" ON "InterviewSchedule"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_interview_update" ON "InterviewSchedule"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_interview_delete" ON "InterviewSchedule"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- Vacancy
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_vacancy_select" ON "Vacancy"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_vacancy_insert" ON "Vacancy"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_vacancy_update" ON "Vacancy"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_vacancy_delete" ON "Vacancy"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- VacancyApplication
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_application_select" ON "VacancyApplication"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_application_insert" ON "VacancyApplication"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_application_update" ON "VacancyApplication"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_application_delete" ON "VacancyApplication"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- User (optional companyId — null = SUPER_ADMIN or system user)
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_user_select" ON "User"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" IS NULL  -- global/system users visible to all
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_user_insert" ON "User"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_user_update" ON "User"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" IS NULL
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_user_delete" ON "User"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ────────────────────────────────────────────────────────────
-- Question (optional companyId — null = system/global question)
-- ────────────────────────────────────────────────────────────
CREATE POLICY "rls_question_select" ON "Question"
  FOR SELECT
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" IS NULL  -- global questions visible to all
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_question_insert" ON "Question"
  FOR INSERT
  WITH CHECK (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_question_update" ON "Question"
  FOR UPDATE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" IS NULL
    OR "companyId" = current_setting('app.current_company_id', true)
  );

CREATE POLICY "rls_question_delete" ON "Question"
  FOR DELETE
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "companyId" = current_setting('app.current_company_id', true)
  );

-- ============================================================
-- Verification query — run to check RLS is enabled:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'Position', 'CandidateInvitation', 'EvaluationSession',
--     'EvaluationResult', 'InterviewSchedule', 'Vacancy',
--     'VacancyApplication', 'User', 'Question'
--   );
--
-- All should show rowsecurity = true
-- ============================================================
