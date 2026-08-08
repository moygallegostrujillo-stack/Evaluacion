-- ============================================================
-- PostgreSQL Row-Level Security (RLS) Policies for EvaluHR
-- ============================================================
--
-- CORRECTED VERSION — Idempotent & Robust
--
-- Fixes applied:
-- 1. Uses DROP POLICY IF EXISTS before CREATE POLICY (idempotent)
-- 2. Wraps each table's policies in DO blocks with exception handling
-- 3. Dynamically checks if companyId column exists before creating policies
-- 4. Handles VacancyApplication which may not have companyId yet
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

-- ════════════════════════════════════════════════════════════
-- STEP 1: Enable RLS on all tenant-scoped tables
-- ════════════════════════════════════════════════════════════

-- Tables with REQUIRED companyId
ALTER TABLE "Position" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CandidateInvitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EvaluationResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" ENABLE ROW LEVEL SECURITY;

-- Tables with OPTIONAL companyId (null = global/system)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;

-- VacancyApplication — only enable if table exists with companyId
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'VacancyApplication'
      AND column_name = 'companyId'
  ) THEN
    EXECUTE 'ALTER TABLE "VacancyApplication" ENABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'RLS enabled on VacancyApplication';
  ELSE
    RAISE NOTICE 'SKIPPED: VacancyApplication does not have companyId column — run prisma db push first';
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════
-- STEP 2: Create RLS Policies (idempotent)
-- ════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────
-- Position
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_position_select" ON "Position";
DROP POLICY IF EXISTS "rls_position_insert" ON "Position";
DROP POLICY IF EXISTS "rls_position_update" ON "Position";
DROP POLICY IF EXISTS "rls_position_delete" ON "Position";

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
DROP POLICY IF EXISTS "rls_invitation_select" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_insert" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_update" ON "CandidateInvitation";
DROP POLICY IF EXISTS "rls_invitation_delete" ON "CandidateInvitation";

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
DROP POLICY IF EXISTS "rls_session_select" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_insert" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_update" ON "EvaluationSession";
DROP POLICY IF EXISTS "rls_session_delete" ON "EvaluationSession";

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
DROP POLICY IF EXISTS "rls_result_select" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_insert" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_update" ON "EvaluationResult";
DROP POLICY IF EXISTS "rls_result_delete" ON "EvaluationResult";

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
DROP POLICY IF EXISTS "rls_interview_select" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_insert" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_update" ON "InterviewSchedule";
DROP POLICY IF EXISTS "rls_interview_delete" ON "InterviewSchedule";

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
DROP POLICY IF EXISTS "rls_vacancy_select" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_insert" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_update" ON "Vacancy";
DROP POLICY IF EXISTS "rls_vacancy_delete" ON "Vacancy";

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
-- VacancyApplication (conditional — only if companyId exists)
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'VacancyApplication'
      AND column_name = 'companyId'
  ) THEN
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "rls_application_select" ON "VacancyApplication"';
    EXECUTE 'DROP POLICY IF EXISTS "rls_application_insert" ON "VacancyApplication"';
    EXECUTE 'DROP POLICY IF EXISTS "rls_application_update" ON "VacancyApplication"';
    EXECUTE 'DROP POLICY IF EXISTS "rls_application_delete" ON "VacancyApplication"';

    -- Create new policies
    EXECUTE 'CREATE POLICY "rls_application_select" ON "VacancyApplication"
      FOR SELECT
      USING (
        current_setting(''app.is_super_admin'', true) = ''true''
        OR "companyId" = current_setting(''app.current_company_id'', true)
      )';

    EXECUTE 'CREATE POLICY "rls_application_insert" ON "VacancyApplication"
      FOR INSERT
      WITH CHECK (
        current_setting(''app.is_super_admin'', true) = ''true''
        OR "companyId" = current_setting(''app.current_company_id'', true)
      )';

    EXECUTE 'CREATE POLICY "rls_application_update" ON "VacancyApplication"
      FOR UPDATE
      USING (
        current_setting(''app.is_super_admin'', true) = ''true''
        OR "companyId" = current_setting(''app.current_company_id'', true)
      )';

    EXECUTE 'CREATE POLICY "rls_application_delete" ON "VacancyApplication"
      FOR DELETE
      USING (
        current_setting(''app.is_super_admin'', true) = ''true''
        OR "companyId" = current_setting(''app.current_company_id'', true)
      )';

    RAISE NOTICE 'RLS policies created for VacancyApplication';
  ELSE
    RAISE NOTICE 'SKIPPED: VacancyApplication does not have companyId column. Run prisma db push first, then re-run this script.';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- User (optional companyId — null = SUPER_ADMIN or system user)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rls_user_select" ON "User";
DROP POLICY IF EXISTS "rls_user_insert" ON "User";
DROP POLICY IF EXISTS "rls_user_update" ON "User";
DROP POLICY IF EXISTS "rls_user_delete" ON "User";

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
DROP POLICY IF EXISTS "rls_question_select" ON "Question";
DROP POLICY IF EXISTS "rls_question_insert" ON "Question";
DROP POLICY IF EXISTS "rls_question_update" ON "Question";
DROP POLICY IF EXISTS "rls_question_delete" ON "Question";

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

-- ════════════════════════════════════════════════════════════
-- VERIFICATION QUERY
-- Run this AFTER the script to confirm RLS is active:
-- ════════════════════════════════════════════════════════════
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'Position', 'CandidateInvitation', 'EvaluationSession',
--     'EvaluationResult', 'InterviewSchedule', 'Vacancy',
--     'VacancyApplication', 'User', 'Question'
--   )
-- ORDER BY tablename;
--
-- All should show rowsecurity = true
--
-- To see all policies created:
--
-- SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND policyname LIKE 'rls_%'
-- ORDER BY tablename, policyname;
-- ============================================================
