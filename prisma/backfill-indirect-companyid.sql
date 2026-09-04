-- ============================================================
-- PHASE 3.5-D.2.9 (PARTE 9) — PRODUCTION BACKFILL SQL
-- Direct tenant columns on the formerly indirect models
-- ============================================================
--
-- ⚠️ STATUS: NOT EXECUTED. Production runbook artifact.
--
-- WHEN TO RUN: immediately AFTER the next controlled production deploy
-- that adds the four nullable companyId columns (schema.prod.prisma)
-- and BEFORE any tenant traffic relies on the new columns.
-- Nothing in this file enables RLS or touches roles.
--
-- STEPS AT RLS-ACTIVATION TIME (order matters):
--   1. (deploy) prisma db push  → adds nullable companyId columns
--   2. (this file) backfill     → stamps every row from its parent
--   3. verify                   → all four counts = 0
--   4. (activation phase) ALTER TABLE ... SET NOT NULL for the four columns
--   5. (activation phase) apply prisma/rls-policies.sql
--
-- Run as postgres. Idempotent: re-running updates 0 rows.
-- ============================================================

-- 1. EvaluationResponse ← EvaluationSession
UPDATE "EvaluationResponse" r
SET "companyId" = s."companyId"
FROM "EvaluationSession" s
WHERE r."sessionId" = s."id" AND r."companyId" IS NULL;

-- 2. EvaluationTemplate ← Position
UPDATE "EvaluationTemplate" t
SET "companyId" = p."companyId"
FROM "Position" p
WHERE t."positionId" = p."id" AND t."companyId" IS NULL;

-- 3. VacancyQuestion ← Vacancy
UPDATE "VacancyQuestion" q
SET "companyId" = v."companyId"
FROM "Vacancy" v
WHERE q."vacancyId" = v."id" AND q."companyId" IS NULL;

-- 4. VacancyApplicationResponse ← VacancyApplication
UPDATE "VacancyApplicationResponse" r
SET "companyId" = a."companyId"
FROM "VacancyApplication" a
WHERE r."applicationId" = a."id" AND r."companyId" IS NULL;

-- ────────────────────────────────────────────────────────────
-- VERIFICATION: every count MUST be 0 before proceeding.
-- ────────────────────────────────────────────────────────────
SELECT 'EvaluationResponse' AS model, COUNT(*) AS violations
FROM "EvaluationResponse" r JOIN "EvaluationSession" s ON r."sessionId" = s."id"
WHERE r."companyId" IS NULL OR r."companyId" <> s."companyId"
UNION ALL
SELECT 'EvaluationTemplate', COUNT(*)
FROM "EvaluationTemplate" t JOIN "Position" p ON t."positionId" = p."id"
WHERE t."companyId" IS NULL OR t."companyId" <> p."companyId"
UNION ALL
SELECT 'VacancyQuestion', COUNT(*)
FROM "VacancyQuestion" q JOIN "Vacancy" v ON q."vacancyId" = v."id"
WHERE q."companyId" IS NULL OR q."companyId" <> v."companyId"
UNION ALL
SELECT 'VacancyApplicationResponse', COUNT(*)
FROM "VacancyApplicationResponse" r JOIN "VacancyApplication" a ON r."applicationId" = a."id"
WHERE r."companyId" IS NULL OR r."companyId" <> a."companyId";
