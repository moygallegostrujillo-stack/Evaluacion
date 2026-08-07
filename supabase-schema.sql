-- ============================================
-- EVALUHR - Schema para Supabase (PostgreSQL)
-- Ejecutar en: Supabase → SQL Editor → New query
-- ============================================

-- Drop existing tables in dependency order (safe to re-run)
DROP TABLE IF EXISTS "VacancyApplicationResponse" CASCADE;
DROP TABLE IF EXISTS "VacancyApplication" CASCADE;
DROP TABLE IF EXISTS "VacancyQuestion" CASCADE;
DROP TABLE IF EXISTS "Vacancy" CASCADE;
DROP TABLE IF EXISTS "EvaluationResponse" CASCADE;
DROP TABLE IF EXISTS "EvaluationResult" CASCADE;
DROP TABLE IF EXISTS "InterviewSchedule" CASCADE;
DROP TABLE IF EXISTS "EvaluationSession" CASCADE;
DROP TABLE IF EXISTS "CandidateInvitation" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "EvaluationTemplate" CASCADE;
DROP TABLE IF EXISTS "Position" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Company" CASCADE;

-- CreateTable: Company
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL DEFAULT 'RESTAURANT',
    "plan" TEXT NOT NULL DEFAULT 'BASIC',
    "maxCandidatesPerMonth" INTEGER NOT NULL DEFAULT 150,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Tuxtla Gutiérrez',
    "state" TEXT NOT NULL DEFAULT 'Chiapas',
    "country" TEXT NOT NULL DEFAULT 'México',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CANDIDATO',
    "phone" TEXT,
    "companyId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Position
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sector" TEXT NOT NULL DEFAULT 'RESTAURANT',
    "category" TEXT NOT NULL,
    "description" TEXT,
    "hasKnowledgeTest" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EvaluationTemplate
CREATE TABLE "EvaluationTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "positionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EvaluationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Question
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "category" TEXT NOT NULL,
    "reverseScored" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "evaluationTemplateId" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "correctAnswer" INTEGER,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CandidateInvitation
CREATE TABLE "CandidateInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "companyId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CandidateInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EvaluationSession
CREATE TABLE "EvaluationSession" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EvaluationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EvaluationResponse
CREATE TABLE "EvaluationResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "numericValue" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvaluationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EvaluationResult
CREATE TABLE "EvaluationResult" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "positionTitle" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "openness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conscientiousness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraversion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agreeableness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "neuroticism" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stressLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "empathy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adaptability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamwork" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "knowledgeScore" DOUBLE PRECISION,
    "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendation" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvaluationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable: InterviewSchedule
CREATE TABLE "InterviewSchedule" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "positionId" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "location" TEXT,
    "notes" TEXT,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InterviewSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Vacancy
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sector" TEXT NOT NULL DEFAULT 'GENERAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "includePsicometrica" BOOLEAN NOT NULL DEFAULT true,
    "includePsicologica" BOOLEAN NOT NULL DEFAULT true,
    "maxVideoSeconds" INTEGER NOT NULL DEFAULT 60,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable: VacancyQuestion
CREATE TABLE "VacancyQuestion" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "correctAnswer" INTEGER,
    "order" INTEGER NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VacancyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable: VacancyApplication
CREATE TABLE "VacancyApplication" (
    "id" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "candidateEmail" TEXT NOT NULL,
    "candidatePhone" TEXT,
    "candidateAge" INTEGER,
    "videoUrl" TEXT,
    "videoType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "openness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conscientiousness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraversion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agreeableness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "neuroticism" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stressLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "empathy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adaptability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamwork" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "knowledgeScore" DOUBLE PRECISION,
    "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendation" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "summary" TEXT,
    CONSTRAINT "VacancyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable: VacancyApplicationResponse
CREATE TABLE "VacancyApplicationResponse" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "questionId" TEXT,
    "vacancyQuestionId" TEXT,
    "section" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "numericValue" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VacancyApplicationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "CandidateInvitation_token_key" ON "CandidateInvitation"("token");
CREATE UNIQUE INDEX "EvaluationResponse_sessionId_questionId_key" ON "EvaluationResponse"("sessionId", "questionId");
CREATE UNIQUE INDEX "EvaluationResult_sessionId_key" ON "EvaluationResult"("sessionId");
CREATE UNIQUE INDEX "Vacancy_slug_key" ON "Vacancy"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationTemplate" ADD CONSTRAINT "EvaluationTemplate_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_evaluationTemplateId_fkey" FOREIGN KEY ("evaluationTemplateId") REFERENCES "EvaluationTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CandidateInvitation" ADD CONSTRAINT "CandidateInvitation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CandidateInvitation" ADD CONSTRAINT "CandidateInvitation_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CandidateInvitation" ADD CONSTRAINT "CandidateInvitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationSession" ADD CONSTRAINT "EvaluationSession_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationSession" ADD CONSTRAINT "EvaluationSession_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationResponse" ADD CONSTRAINT "EvaluationResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "EvaluationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EvaluationResponse" ADD CONSTRAINT "EvaluationResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "EvaluationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VacancyQuestion" ADD CONSTRAINT "VacancyQuestion_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VacancyApplication" ADD CONSTRAINT "VacancyApplication_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VacancyApplication" ADD CONSTRAINT "VacancyApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VacancyApplicationResponse" ADD CONSTRAINT "VacancyApplicationResponse_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "VacancyApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VacancyApplicationResponse" ADD CONSTRAINT "VacancyApplicationResponse_vacancyQuestionId_fkey" FOREIGN KEY ("vacancyQuestionId") REFERENCES "VacancyQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
