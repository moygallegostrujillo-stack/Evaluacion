# EvaluHR — Project Context

> **Single source of truth for the project state.** Last updated: 2025-03-04

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Name** | EvaluHR |
| **Purpose** | HR psychometric/psychological/knowledge evaluation platform for the Mexican labor market (restaurant & retail sectors). Candidates are evaluated for job positions, results are scored and compared, and interviews are scheduled. |
| **Legal Context** | Must comply with LFPDPPP (Mexican data protection law), NOM-035-STPS-2018 (psychosocial risk), and LFT Art. 132. |
| **Language** | TypeScript 5 |
| **Framework** | Next.js 16 (App Router) |

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Zustand (state), Tailwind CSS 4, shadcn/ui (New York style), Lucide icons, Framer Motion, Recharts |
| **Backend** | Next.js API Routes (`/app/api/`) |
| **Database (dev)** | SQLite via Prisma ORM |
| **Database (prod)** | PostgreSQL (Supabase) via Prisma ORM — `schema.prod.prisma` |
| **Auth** | JWT (jose), middleware-protected routes, httpOnly cookies |
| **RLS** | App-level (Prisma Client Extension) + DB-level (PostgreSQL RLS policies) |
| **Password Hashing** | bcrypt (12 rounds) with legacy SHA-256 migration support |
| **Forms** | react-hook-form + zod |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (Single Page App)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Zustand  │  │ shadcn/ui│  │ View Components  │  │
│  │ Store    │  │ + Tailwin│  │ (14 views)       │  │
│  └────┬─────┘  └──────────┘  └────────┬─────────┘  │
│       │         apiFetch()           │              │
└───────┼──────────────────────────────┼──────────────┘
        │                              │
        ▼                              ▼
┌─────────────────────────────────────────────────────┐
│  Next.js Middleware (JWT verification)              │
│  PUBLIC_ROUTES: /api/auth, /api/public, /api/seed, │
│                 /api/health                         │
│  → Injects x-user-id, x-user-role, x-user-company  │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  API Route Handlers                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ getAuthFrom │  │ createRLSClie│  │ Prisma     │ │
│  │ Headers()   │  │ nt(auth)     │  │ Queries    │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  Prisma ORM                                         │
│  Dev: SQLite  │  Prod: PostgreSQL (Supabase)        │
│  RLS Extension: auto-injects companyId filters      │
│  DB-level RLS: PostgreSQL policies (defense-in-depth│
└─────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

- **SPA with Zustand navigation**: No Next.js routing — all views rendered by `page.tsx` based on `currentView` state
- **Dual RLS**: App-level (Prisma extension) + DB-level (PostgreSQL policies) for defense-in-depth
- **Tenant isolation**: All tenant-scoped models auto-filtered by `companyId` via RLS
- **Consent-gated evaluation**: Candidates cannot start/submit evaluations without explicit consent (LFPDPPP Art. 8)
- **Hybrid Flow A + Flow B**: Two entry paths for candidates (see below)

---

## 3. Database Models

### Entity-Relationship Summary

```
Company ──┬── User (RH, GERENTE, CANDIDATO)
          ├── Position ──── EvaluationTemplate ──── Question
          ├── CandidateInvitation
          ├── EvaluationSession ──── EvaluationResponse
          ├── EvaluationResult
          ├── InterviewSchedule
          ├── Vacancy ──┬── VacancyQuestion
          │              ├── VacancyApplication ──── VacancyApplicationResponse
          │              └── VacancyInterest
          ├── PrivacyNotice
          └── ConsentRecord
```

### Model Details

| Model | Key Fields | Relationships | RLS Scoped |
|-------|-----------|---------------|------------|
| **Company** | `name`, `sector`, `plan`, `maxCandidatesPerMonth`, `active` | Has all tenant-scoped models | No (tenant root) |
| **User** | `email` (unique), `name`, `role`, `whatsapp`, `consentGiven`, `consentDate`, `sensitiveConsentGiven`, `sensitiveConsentDate`, `consentVersion`, `consentRevokedAt` | Belongs to Company, has Sessions, Results, ConsentRecords | Yes (optional companyId) |
| **Position** | `title`, `sector`, `category`, `hasKnowledgeTest` | Belongs to Company, has Templates, Invitations | Yes |
| **EvaluationTemplate** | `name`, `type` (PSICOMETRICA/PSICOLOGICA/CONOCIMIENTOS), `order` | Belongs to Position, has Questions | Via Position.companyId |
| **Question** | `text`, `type` (LIKERT/MULTIPLE_CHOICE/YES_NO), `category`, `reverseScored`, `isCustom`, `correctAnswer` | Belongs to Template, optional Company | Yes (optional companyId — null = global) |
| **CandidateInvitation** | `email` (optional), `whatsapp`, `candidateName`, `token` (unique), `status`, `channel` (EMAIL/WHATSAPP), `expiresAt` | Belongs to Company, Position, Sender User | Yes |
| **EvaluationSession** | `candidateId`, `positionId`, `status`, `currentStep` (1-3), `currentQuestionIndex` | Belongs to User, Position, has Responses + Result | Yes |
| **EvaluationResponse** | `sessionId`, `questionId`, `value`, `numericValue` | Belongs to Session, Question | Via Session.companyId |
| **EvaluationResult** | Big Five (5), Psychological (5), `knowledgeScore`, `overallScore`, `recommendation` | Belongs to Session, User, Position, Company | Yes |
| **InterviewSchedule** | `candidateId`, `scheduledAt`, `status`, `location`, `notified` | Belongs to User, Company, optional Position | Yes |
| **Vacancy** | `title`, `slug` (unique), `status`, `includePsicometrica`, `includePsicologica`, `maxVideoSeconds` | Belongs to Company, has Questions, Applications, Interests | Yes |
| **VacancyQuestion** | `text`, `type`, `options` (JSON), `correctAnswer`, `order` | Belongs to Vacancy | Via Vacancy.companyId |
| **VacancyApplication** | Full scoring (same as EvaluationResult), `candidateName/Email/Phone`, `videoUrl`, `currentStep` | Belongs to Vacancy, Company, has Responses | Yes |
| **VacancyApplicationResponse** | `section`, `value`, `numericValue` | Belongs to Application, optional VacancyQuestion | Via Application.companyId |
| **VacancyInterest** | `candidateName`, `whatsapp`, `consentContact`, `status` (PENDING/INVITED/REJECTED), `invitationId`, `ipAddress` | Belongs to Vacancy, Company, optional Invitation | Yes |
| **PrivacyNotice** | `version`, `simplifiedText`, `fullTextUrl`, `isActive` | Belongs to Company | Yes |
| **ConsentRecord** | `consentType`, `action` (GRANTED/REVOKED/RE_GRANTED), `privacyVersion`, `consentTextHash` (SHA-256), `ipAddress`, `userAgent`, `source`, `companyName` | Belongs to User | Yes (optional companyId) |

### User Roles

| Role | Scope | Access |
|------|-------|--------|
| `SUPER_ADMIN` | Cross-tenant | All companies, user management, RLS audit |
| `RH` | Single tenant | Dashboard, candidates, evaluations, vacancies, interviews, invitations |
| `GERENTE` | Single tenant | Same as RH (view-focused) |
| `CANDIDATO` | Own data | Take evaluations, view own consent records |

---

## 4. Key Design Decisions

### Hybrid Flow A + Flow B

**Problem**: Mexican labor market reality demands two different candidate entry paths:

- **Flow A (Evaluación Formal)**: HR already has the candidate's info (from an interview, referral, etc.) and sends them a direct evaluation link. This is the traditional HR-initiated flow.
- **Flow B (Manifestación de Interés)**: A company shares a public vacancy link (e.g., WhatsApp status, social media). Candidates express interest with just Name + WhatsApp. HR later reviews and converts interests into invitations.

**Why both?**
- Flow A alone misses candidates who discover vacancies organically.
- Flow B alone skips the formal evaluation process and consent requirements.
- The hybrid model captures the full funnel: **Interest → Invitation → Consent → Evaluation → Result**.

### Consent-Gated Evaluations

- Evaluations are blocked at the API level if `consentGiven !== true` (returns 403 `CONSENT_REQUIRED`)
- Consent must be explicit: two separate checkboxes (privacy notice + sensitive data per LFPDPPP Art. 8)
- Bridge records (auto-created candidates) start with `consentGiven: false` — no legal fiction
- Retroactive consent fix (`/api/consent/fix`) creates full ConsentRecord audit trail

### WhatsApp-First

- WhatsApp is the primary communication channel for candidates (Mexican market)
- `CandidateInvitation.email` is optional — invitations can be WhatsApp-only
- Flow B captures WhatsApp directly; the "Invitar" button opens `wa.me` with pre-filled message

### Dual RLS (Defense in Depth)

- Layer 1: Prisma Client Extension auto-injects `companyId` filters
- Layer 2: PostgreSQL RLS policies (for production)
- SUPER_ADMIN bypasses both layers

---

## 5. Flow A: Evaluación Formal

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ HR Admin │───▶│ POST /invite │───▶│ Candidate    │
│ creates  │    │ (email or    │    │ receives     │
│ invitation│    │  whatsapp)   │    │ link/token   │
└──────────┘    └──────────────┘    └──────┬───────┘
                                           │
                    Candidate clicks link  │
                    ?token=xxxx            │
                                           ▼
                                    ┌──────────────┐
                                    │ useInvitation │
                                    │ Check hook    │
                                    │ (page.tsx)    │
                                    └──────┬───────┘
                                           │
                                    Auto-login via
                                    POST /api/auth
                                    {action: 'token-login'}
                                           │
                                           ▼
                                    ┌──────────────┐
                              No───▶│ consentGiven?│───Yes──┐
                                    │              │        │
                                    └──────┬───────┘        │
                                           │                │
                                           ▼                ▼
                                    ┌──────────────┐  ┌──────────────┐
                                    │ ConsentView  │  │ Evaluation   │
                                    │ (2 checkboxes│  │ View         │
                                    │ + consent    │  │ (3-step test)│
                                    │  recording)  │  └──────┬───────┘
                                    └──────┬───────┘         │
                                           │                 │
                                    POST /api/consent        │
                                    (creates ConsentRecord)  │
                                           │                 │
                                           ▼                 ▼
                                    ┌──────────────────────────┐
                                    │ Evaluation Steps:        │
                                    │ 1. Psicométrica (Big 5)  │
                                    │ 2. Psicológica (5 traits)│
                                    │ 3. Conocimientos (MC)    │
                                    └──────────┬───────────────┘
                                               │
                                        POST /api/evaluations
                                        {action: 'complete'}
                                               │
                                               ▼
                                    ┌──────────────────────────┐
                                    │ EvaluationResult created │
                                    │ → EvaluationCompleteView │
                                    └──────────────────────────┘
```

---

## 6. Flow B: Manifestación de Interés

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ HR Admin │───▶│ Create Vacancy│───▶│ Share public │
│ creates  │    │ (slug-based) │    │ link:        │
│ vacancy  │    └──────────────┘    │ ?v={slug}    │
└──────────┘                        └──────┬───────┘
                                            │
                     Candidate opens link   │
                     (no auth required)     │
                                            ▼
                                     ┌──────────────┐
                                     │ PublicEvalu  │
                                     │ ationView    │
                                     │ (Flow B)     │
                                     └──────┬───────┘
                                            │
                            Step 1: Show vacancy info
                            Step 2: Interest form
                              - Name (required)
                              - WhatsApp (10 digits)
                              - Checkbox: "pueden contactarme"
                            Step 3: Confirmation
                                            │
                                     POST /api/public/interest
                                     {vacancySlug, name, whatsapp}
                                            │
                                            ▼
                                     ┌──────────────────┐
                                     │ VacancyInterest   │
                                     │ created           │
                                     │ status: PENDING   │
                                     │ consentContact:   │
                                     │   true            │
                                     └──────────────────┘

═══════════════════════════════════════════════════════
  HR reviews interests in VacancyManagementView:
═══════════════════════════════════════════════════════

                                     ┌──────────────┐
                                     │ "Interesados"│
                                     │ section in   │
                                     │ VacancyMgmt  │
                                     └──────┬───────┘
                                            │
                          Click "Invitar" on PENDING interest
                                            │
                                     ┌──────▼───────┐
                                     │ 1. Fetch      │
                                     │    positions  │
                                     │ 2. POST       │
                                     │    /api/invite│
                                     │   (WhatsApp)  │
                                     │ 3. PUT        │
                                     │   /api/interests│
                                     │   {status:    │
                                     │    INVITED}   │
                                     │ 4. Open wa.me │
                                     │   with msg    │
                                     └──────────────┘
                                            │
                                            ▼
                                  Candidate follows link
                                  → Flow A begins (from token-login)
```

---

## 7. Legal Compliance (LFPDPPP)

### Implemented

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| **Art. 8: Explicit consent for sensitive data** | Two separate checkboxes in ConsentView (privacy + sensitive), `consentGiven` + `sensitiveConsentGiven` on User model | ✅ Done |
| **Consent audit trail** | `ConsentRecord` model with SHA-256 hash of consent text, IP, user-agent, source, timestamp | ✅ Done |
| **Consent verification at evaluation** | `/api/evaluations` checks `consentGiven` before create-session, answer, next-step, complete, start | ✅ Done |
| **No auto-consent** | Bridge records created with `consentGiven: false`; public apply/video routes no longer auto-set true | ✅ Done |
| **Retroactive consent fix** | `/api/consent/fix` creates full ConsentRecord trail with `source: ADMIN_FIX` | ✅ Done |
| **Consent versioning** | `consentVersion` on User, `privacyVersion` on ConsentRecord, `PRIVACY_VERSION` constant (currently `1.0`) | ✅ Done |
| **Consent revocation support** | `consentRevokedAt` field on User, `action: REVOKED` on ConsentRecord | ⚠️ Field exists, UI/API not yet built |
| **Minimal consent in Flow B** | `consentContact` on VacancyInterest (checkbox: "pueden contactarme") | ✅ Done |

### Pending

| Requirement | Status | Notes |
|-------------|--------|-------|
| **Privacy notice text from user** | ❌ Pending | The actual Aviso de Privacidad text must be provided by the company's legal team. Currently using hardcoded summary in `CONSENT_TEXT_FOR_HASH`. |
| **PrivacyNotice model usage** | ❌ Pending | Model exists but no UI to create/manage privacy notices per company. |
| **Consent revocation UI** | ❌ Pending | `consentRevokedAt` field exists but no UI/API endpoint to revoke consent. |
| **WhatsApp API integration** | ❌ Pending | Currently opens `wa.me` link. Needs actual WhatsApp Business API for sending messages programmatically. |
| **Data export (Art. 24)** | ❌ Pending | No endpoint for candidates to request their personal data export. |
| **Data deletion (Art. 28)** | ❌ Pending | No endpoint for candidates to request data deletion. |
| **Full privacy notice PDF** | ❌ Pending | `fullTextUrl` field exists on PrivacyNotice but no upload/generation flow. |

---

## 8. API Endpoints

### Authentication

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth` | Public | Actions: `login`, `register`, `token-login`, `logout` |

### Public (No Auth Required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/public/vacancy?slug=xxx` | Get vacancy info by slug |
| POST | `/api/public/interest` | Express interest in a vacancy (Flow B) |
| POST | `/api/public/apply` | Apply to a vacancy (full public evaluation flow) |
| POST | `/api/public/video` | Mark video step complete |
| GET | `/api/health` | Health check / diagnostics |
| GET | `/api/seed?mode=xxx` | Seed database (protected by EVALUHR_SEED_RESET secret) |

### Authenticated Endpoints

| Method | Endpoint | Required Role | Purpose |
|--------|----------|---------------|---------|
| GET | `/api/dashboard?companyId=xxx` | RH, GERENTE, SUPER_ADMIN | Dashboard stats |
| GET | `/api/candidates?companyId=xxx` | RH, GERENTE, SUPER_ADMIN | List candidates |
| POST | `/api/candidates` | RH, GERENTE, SUPER_ADMIN | Create candidate + session |
| GET | `/api/results?candidateId=xxx&resultId=xxx&compareIds=xxx` | RH, GERENTE, SUPER_ADMIN | Get evaluation results / compare |
| GET | `/api/evaluations?positionId=xxx` | RH, GERENTE, SUPER_ADMIN | Get evaluation templates |
| POST | `/api/evaluations` | CANDIDATO (or auto-auth) | Actions: `create-session`, `start`, `answer`, `next-step`, `complete` (all consent-gated) |
| GET | `/api/positions?companyId=xxx&sector=xxx&all=true` | RH, GERENTE, SUPER_ADMIN | List positions |
| POST | `/api/positions` | RH, GERENTE, SUPER_ADMIN | Create position |
| GET | `/api/vacancies?companyId=xxx` | RH, GERENTE, SUPER_ADMIN | List vacancies |
| POST | `/api/vacancies` | RH, GERENTE, SUPER_ADMIN | Create vacancy |
| GET | `/api/vacancies/[id]` | RH, GERENTE, SUPER_ADMIN | Get vacancy detail |
| PATCH | `/api/vacancies/[id]` | RH, GERENTE, SUPER_ADMIN | Update vacancy |
| DELETE | `/api/vacancies/[id]` | RH, GERENTE, SUPER_ADMIN | Delete vacancy |
| GET | `/api/vacancies/[id]/questions` | RH, GERENTE, SUPER_ADMIN | Get vacancy questions |
| POST | `/api/vacancies/[id]/questions` | RH, GERENTE, SUPER_ADMIN | Add question to vacancy |
| DELETE | `/api/vacancies/[id]/questions` | RH, GERENTE, SUPER_ADMIN | Remove question |
| POST | `/api/vacancies/[id]/generate-questions` | RH, GERENTE, SUPER_ADMIN | AI-generate knowledge questions |
| GET | `/api/vacancies/[id]/applications` | RH, GERENTE, SUPER_ADMIN | List applications for vacancy |
| GET | `/api/interests?vacancyId=xxx&companyId=xxx` | RH, GERENTE, SUPER_ADMIN | List vacancy interests |
| PUT | `/api/interests` | RH, GERENTE, SUPER_ADMIN | Update interest status |
| POST | `/api/invite` | RH, GERENTE, SUPER_ADMIN | Create invitation (email and/or WhatsApp) |
| GET | `/api/interviews?companyId=xxx` | RH, GERENTE, SUPER_ADMIN | List interviews |
| POST | `/api/interviews` | RH, GERENTE, SUPER_ADMIN | Schedule interview |
| PATCH | `/api/interviews` | RH, GERENTE, SUPER_ADMIN | Update interview status |
| GET | `/api/companies` | Any authenticated | List companies (SUPER_ADMIN=all, others=own) |
| POST | `/api/companies` | SUPER_ADMIN | Create company |
| GET | `/api/users?companyId=xxx&role=xxx` | SUPER_ADMIN, RH, GERENTE | List users |
| POST | `/api/users` | SUPER_ADMIN | Create RH/GERENTE user |
| GET | `/api/questions?positionId=xxx&templateId=xxx` | RH, GERENTE, SUPER_ADMIN | List questions |
| POST | `/api/questions` | RH, GERENTE, SUPER_ADMIN | Create custom question |
| POST | `/api/consent` | Any authenticated | Record consent (creates ConsentRecord) |
| GET | `/api/consent?userId=xxx` | Any authenticated | Get consent records |
| POST | `/api/consent/fix` | RH, GERENTE, SUPER_ADMIN | Retroactive consent fix |
| GET | `/api/rls-audit?mode=verify&companyId=xxx` | SUPER_ADMIN | RLS verification audit |

---

## 9. UI Components (Views)

| View Component | Purpose | Who Sees It |
|---------------|---------|-------------|
| `LoginView` | Email/password login | Unauthenticated |
| `ConsentView` | Two-checkbox consent form (privacy + sensitive data) | CANDIDATO (pre-evaluation) |
| `DashboardView` | Stats: candidates, evaluations, recommendations, recent results, position stats | RH, GERENTE, SUPER_ADMIN |
| `CandidatesView` | List candidates with results, consent status, position info | RH, GERENTE, SUPER_ADMIN |
| `CandidateDetailView` | Detailed view of a single candidate with radar charts, scores, interview scheduling | RH, GERENTE, SUPER_ADMIN |
| `EvaluationView` | 3-step evaluation (psicométrica → psicológica → conocimientos) with Likert/MC/YesNo questions | CANDIDATO |
| `EvaluationCompleteView` | Post-evaluation summary with scores and recommendation | CANDIDATO |
| `CompareView` | Side-by-side comparison of multiple candidates with radar charts | RH, GERENTE, SUPER_ADMIN |
| `InviteView` | Create and manage invitations | RH, GERENTE, SUPER_ADMIN |
| `InterviewsView` | Schedule and manage interviews | RH, GERENTE, SUPER_ADMIN |
| `QuestionsManagementView` | Manage evaluation templates and custom questions per position | RH, GERENTE, SUPER_ADMIN |
| `VacancyManagementView` | Create/manage vacancies, view applications, **Interesados section** with "Invitar" button | RH, GERENTE, SUPER_ADMIN |
| `PublicEvaluationView` | Flow B: vacancy info → name + WhatsApp form → confirmation | Public (no auth) |
| `CompanyManagementView` | Create/manage companies and users (SUPER_ADMIN landing page) | SUPER_ADMIN |

---

## 10. Key Files

### Core Application

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | SPA shell — renders views based on Zustand `currentView`, handles auth restore + invitation auto-login |
| `src/lib/store.ts` | Zustand store — auth, navigation, evaluation state, comparison, invitation token, vacancy interest |
| `src/lib/auth.ts` | JWT generation/verification (`jose`), `getAuthFromHeaders()`, role/company access checks |
| `src/lib/api.ts` | `apiFetch()` — authenticated fetch wrapper with Bearer token + 401 handling |
| `src/lib/rls.ts` | RLS system — `createRLSClient()`, `createRLSExtension()`, tenant-scoped model registry, `RLSViolationError` |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/db-rls-session.ts` | PostgreSQL RLS session management (`setRLSSession`, `withRLSTransaction`) |
| `src/lib/password.ts` | bcrypt hashing + legacy SHA-256 migration |
| `src/middleware.ts` | JWT verification middleware — injects user info into request headers |

### Database

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | SQLite schema (development) |
| `prisma/schema.prod.prisma` | PostgreSQL schema (production) |
| `prisma/rls-policies.sql` | PostgreSQL RLS policies for all tenant-scoped tables |
| `prisma/seed.ts` | Database seed script |

### API Routes

| Path | Purpose |
|------|---------|
| `src/app/api/auth/route.ts` | Login, register, token-login, logout |
| `src/app/api/evaluations/route.ts` | Evaluation session management + scoring (consent-gated) |
| `src/app/api/invite/route.ts` | Create invitations (email/WhatsApp) |
| `src/app/api/consent/route.ts` | Record + retrieve consent |
| `src/app/api/consent/fix/route.ts` | Retroactive consent fix |
| `src/app/api/interests/route.ts` | Admin: list + update vacancy interests |
| `src/app/api/public/interest/route.ts` | Public: express interest (Flow B) |
| `src/app/api/public/vacancy/route.ts` | Public: get vacancy info |
| `src/app/api/public/apply/route.ts` | Public: apply to vacancy (full evaluation flow) |
| `src/app/api/public/video/route.ts` | Public: mark video step complete |
| `src/app/api/dashboard/route.ts` | Dashboard statistics |
| `src/app/api/candidates/route.ts` | Candidate CRUD |
| `src/app/api/results/route.ts` | Evaluation results + comparison |
| `src/app/api/vacancies/route.ts` | Vacancy CRUD |
| `src/app/api/positions/route.ts` | Position CRUD |
| `src/app/api/companies/route.ts` | Company CRUD |
| `src/app/api/users/route.ts` | User CRUD (RH/GERENTE only) |
| `src/app/api/questions/route.ts` | Question management |
| `src/app/api/interviews/route.ts` | Interview CRUD |
| `src/app/api/rls-audit/route.ts` | RLS audit/verification |
| `src/app/api/seed/route.ts` | Database seeding |
| `src/app/api/health/route.ts` | Health check |

---

## 11. Users & Auth

### Authentication Flow

1. **Login**: `POST /api/auth {action: 'login', email, password}` → JWT (8h expiry) + httpOnly cookie
2. **Token-login** (Flow A): `POST /api/auth {action: 'token-login', token}` → Looks up CandidateInvitation, finds/creates User, creates EvaluationSession, returns JWT
3. **Register**: `POST /api/auth {action: 'register', email, name, password, token}` → Validates invitation, creates User + Session
4. **Logout**: `POST /api/auth {action: 'logout'}` → Clears httpOnly cookie

### Token Storage

- **Primary**: `Authorization: Bearer <token>` header (via `apiFetch()`)
- **Secondary**: `evaluhr_token` httpOnly cookie (set by server on login)
- **Client-side**: `localStorage` for `evaluhr_token` and `evaluhr_user` (for auth restore on page reload)

### Middleware

- Protects all `/api/*` routes except `PUBLIC_ROUTES` (`/api/auth`, `/api/public`, `/api/seed`, `/api/health`)
- Verifies JWT, injects `x-user-id`, `x-user-email`, `x-user-name`, `x-user-role`, `x-user-company-id` headers
- Returns 401 with `AUTH_MISSING` or `AUTH_INVALID` codes on failure

---

## 12. Consent System

### How Consent is Recorded

```
ConsentView (UI)
  ├── Checkbox 1: Privacy notice acceptance
  └── Checkbox 2: Sensitive data consent (LFPDPPP Art. 8)
        │
        ▼
POST /api/consent
  ├── Updates User: consentGiven, consentDate, consentVersion, sensitiveConsentGiven, sensitiveConsentDate
  └── Creates ConsentRecord(s):
       ├── One for PRIVACY_NOTICE
       │    └── consentTextHash = SHA-256(CONSENT_TEXT_FOR_HASH)
       └── One for SENSITIVE_DATA
            └── consentTextHash = SHA-256(SENSITIVE_CONSENT_TEXT)
```

### ConsentRecord Model

Each `ConsentRecord` provides **inalterable evidence** of what the candidate agreed to:

| Field | Purpose |
|-------|---------|
| `consentType` | `PRIVACY_NOTICE`, `SENSITIVE_DATA`, `TERMS_CONDITIONS` |
| `action` | `GRANTED`, `REVOKED`, `RE_GRANTED` |
| `privacyVersion` | Exact version of the privacy notice (e.g., `1.0`) |
| `consentTextHash` | SHA-256 hash of the consent text — proves exactly what text was shown |
| `ipAddress` | Client IP at consent time |
| `userAgent` | Browser/device user-agent |
| `source` | `CONSENT_VIEW`, `EVALUATION_VIEW`, `PUBLIC_VIEW`, `ADMIN_FIX` |
| `consentedAt` | Timestamp |
| `revokedAt` | Timestamp (null = not revoked) |

### Consent Constants

```typescript
PRIVACY_VERSION = '1.0'

CONSENT_TEXT_FOR_HASH = [
  'AVISO DE PRIVACIDAD Y CONSENTIMIENTO',
  'LFPDPPP Art. 8: Consentimiento expreso y por escrito para datos personales sensibles',
  'NOM-035-STPS-2018: Identificación de factores de riesgo psicosocial',
  'LFT Art. 132: Obligaciones del patrón en la relación laboral',
  'Acepto que mis respuestas serán tratadas como datos personales sensibles...',
  'Entiendo que los resultados serán confidenciales...',
].join('|')

CONSENT_TEXT_HASH = SHA-256(CONSENT_TEXT_FOR_HASH)
```

### What Needs to Happen

1. **Replace hardcoded consent text** with actual company-provided Aviso de Privacidad
2. **Build PrivacyNotice management UI** — companies need to create/version their privacy notices
3. **Implement consent revocation flow** — API + UI for candidates to revoke consent
4. **Implement consent re-consent on version change** — when privacy notice is updated, existing candidates need to re-consent
5. **Add full privacy notice PDF** generation/upload

---

## 13. Pending Items

| Item | Priority | Notes |
|------|----------|-------|
| **Privacy notice text from user** | High | Companies must provide their actual Aviso de Privacidad text. Currently hardcoded in `CONSENT_TEXT_FOR_HASH`. |
| **WhatsApp Business API integration** | High | Currently opens `wa.me` with pre-filled message. Need actual API for programmatic sending, delivery tracking, and message templates. |
| **Consent revocation UI + API** | High | `consentRevokedAt` field exists but no flow to use it. |
| **PrivacyNotice CRUD UI** | Medium | Model exists but no UI to create/manage versioned privacy notices per company. |
| **Data export (LFPDPPP Art. 24)** | Medium | Candidates should be able to request their personal data. |
| **Data deletion (LFPDPPP Art. 28)** | Medium | Candidates should be able to request data deletion. |
| **Full privacy notice PDF** | Medium | `fullTextUrl` field exists but no upload/generation flow. |
| **Evaluation result PDF export** | Medium | No export/download for evaluation reports. |
| **Email sending integration** | Low | Invitation emails are not sent (only WhatsApp currently works end-to-end). |
| **Video recording/storage** | Low | `videoUrl` field exists but no actual video recording/upload flow. |
| **SuperAdmin analytics** | Low | Cross-tenant analytics/reporting for SUPER_ADMIN. |
| **Rate limiting on public endpoints** | Low | No rate limiting on `/api/public/*` endpoints. |

---

## 14. Recent Changes

### Task 7 — Legal Compliance Fixes + WhatsApp Invitation Flow (2025-03-04)

1. **Consent verification in evaluations**: Added consent checks in `/api/evaluations` for `create-session`, `answer`, `next-step`, `complete`, `start` actions. Returns 403 `CONSENT_REQUIRED` if no consent.
2. **Removed auto-consent**: Changed `consentGiven: true` → `false` in `/api/public/apply` and `/api/public/video` bridge record creation. No more legal fiction.
3. **Fixed `/api/consent/fix`**: Now creates full ConsentRecord entries (PRIVACY_NOTICE + SENSITIVE_DATA) with SHA-256 hash, `source: ADMIN_FIX`, and all consent fields on User.
4. **WhatsApp invitations**: Updated `/api/invite` to support WhatsApp-only invitations (`email` now optional, added `whatsapp` + `candidateName` fields, auto-channel detection).

### Task 6 — Interesados Section (2025-03-04)

1. **VacancyManagementView**: Added "Interesados" section showing VacancyInterest records with "Invitar a evaluación" button.
2. **`handleInviteInterest`**: Creates WhatsApp invitation, updates interest status to `INVITED`, opens `wa.me` with pre-filled message.

### Task 1-8 — Hybrid Flow A + Flow B Implementation (2025-03-04)

1. **Schema updates**: Added `VacancyInterest`, `PrivacyNotice`, `ConsentRecord` models; made `CandidateInvitation.email` optional; added `whatsapp` fields.
2. **RLS updates**: Added `VacancyInterest` and `ConsentRecord` to tenant-scoped models.
3. **Flow B API**: Created `POST /api/public/interest` (public) and `GET/PUT /api/interests` (admin).
4. **Flow A token-login**: Added `token-login` action to `/api/auth` for auto-authentication.
5. **PublicEvaluationView rewrite**: Changed from full evaluation to simple interest form (Name + WhatsApp + consent checkbox).
6. **Consent system**: Full consent recording, verification, and audit trail implemented.
