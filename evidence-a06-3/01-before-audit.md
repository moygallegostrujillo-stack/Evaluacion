# A-06.3 — 01 · Auditoría Before (PASO 1)

> Phase A-06.3 · Task 1 · DOCUMENTATION-ONLY (no source code modified)
> Expediente: `/home/z/my-project/evidence-a06-3/`
> Prerequisite reads: worklog A-04.1 → A-06.2; `evidence-a06-1/structured-interview.md`
> (the WHAT — InterviewGuide / InterviewQuestion / Probe / rubric / InterviewEvidence);
> `evidence-a06-2/01-before-audit.md` (the Competencies = NO_METHOD audit that this
> audit extends into the structured-interview surface); `evidence-a06-2/04-behavioral-indicators.md`
> (the behavioral-indicator catalog this audit references).

---

## 1. Purpose of this audit

PASO 1 of A-06.3 verifies, by reading the actual codebase, that **no
structured-interview methodology exists in EvaluHR today**, despite the
existence of an `InterviewSchedule` entity that someone might mistake for a
structured interview instrument.

This is the same finding that A-06.1 recorded ("DECISIÓN: OPCIÓN A —
Entrevista estructurada (BDI/STAR) como fuente principal de evidencia de
competencias en V1" — *recommended model*, not *implemented model*) and
that A-06.2 confirmed at the competency surface ("Competencies = NO_METHOD"
+ `InterviewSchedule` is "a calendar entry, not a structured interview").
PASO 1 makes the A-06.3 claim **code-verified, not asserted**.

The audit covers, specifically:

- Whether a **BDI (Behavioral Description Interview)** surface exists
  (`BehavioralDescription` identifier, `BDI` acronym, behavioral-past
  question type).
- Whether the **STAR technique** is captured as a structured construct
  (`STAR` identifier, Situation/Task/Action/Result structured fields).
- Whether **structured interview questions** exist (question bank,
  competency linkage, `InterviewQuestion` / `InterviewGuide` entity).
- Whether **rubrics** exist (`Rubric` entity, `scoringRubric` field,
  qualitative evidence levels).
- Whether **probes** exist (`Probe` entity, follow-up question bank).
- Whether **competency evaluation** is captured by an interview
  (`CompetencyResult`, `CompetencyEvidence`, behavioral-indicator capture
  per interview).
- Whether **AI functions for interviews** exist (question generation, probe
  suggestion, response summarization).

All findings below were produced by **read-only** Grep and Read over
`src/` and `prisma/schema.prisma` (with `prisma/seed.ts`,
`prisma/rls-policies.sql`, `prisma/rls-rollback.sql`,
`prisma/schema.prod.prisma` checked as supporting context). **No file under
`src/`, `prisma/`, `scripts/`, or `public/` was modified.** The audit is
documentation-only.

---

## 2. Method

1. `Grep` (ripgrep, case-insensitive where relevant) over `src/` and
   `prisma/` for: `BehavioralDescription|BDI|behavioralDescription`;
   `\bSTAR\b|Situation.*Task.*Action.*Result`;
   `\bstar\b|probe`; `rubric|scoringRubric|evidenceLevel|NO_EVIDENCE|
   INSUFFICIENT|LIMITED|SUPPORTED|STRONG`; `interviewQuestion|
   interviewGuide|questionBank|interviewTemplate|competencyResult|
   competencyEvidence|interviewEvidence`; `interview.*ai|ai.*interview|
   interviewProbe|responseSummary|summarizeResponse|
   generateInterviewQuestion|probeSuggestion`; `z-ai-web-dev-sdk|@z-ai|ZAI`;
   `interview` (broad, for catalog).
2. `Read` of `prisma/schema.prisma` `model InterviewSchedule` (L310-326) and
   `model EvaluationResult` (L250-308) to confirm field-level absence of
   question / rubric / probe / evidence-level fields.
3. `Read` of `src/app/api/interviews/route.ts` (full, 217 lines) to confirm
   that the only interview API in the repo is a calendar CRUD on
   `InterviewSchedule` (GET list / POST create / PATCH status — all
   scheduling, never questions).
4. `Read` of `src/components/views/InterviewsView.tsx` (head + body, 273
   lines) to confirm the UI is a calendar/scheduling view with three status
   badges (Programada / Completada / Cancelada) — no question guide, no
   rubric, no probe panel.
5. `Read` of `src/app/api/vacancies/[id]/generate-questions/route.ts` head
   (L1-100) to confirm the only `z-ai-web-dev-sdk` integration in the repo
   generates **knowledge-test questions** (multiple choice with
   `correctAnswer`), NOT interview questions, probes, or response summaries.
6. `Read` of `src/app/api/evaluations/route.ts` L345-369 and
   `src/app/api/public/apply/route.ts` L645-669 to confirm the only
   "interview"-flavored text in the recommendation engine is the
   free-text `areasToExplore` string array derived from Likert scores —
   NOT a structured question bank.

No write was performed on any file.

---

## 3. Summary table — component | exists? | location | notes

| #  | Component | Exists? | Location (verified) | Notes |
|----|-----------|---------|----------------------|-------|
| 1  | `BehavioralDescription` / `BDI` identifier | **NO** | `rg "BehavioralDescription\|BDI\|behavioralDescription" src/ prisma/` = 0 matches | No BDI acronym, no `BehavioralDescription` type/model/field. A-06.1 §3.2 names `BEHAVIORAL_PAST` as the question type that operationalizes BDI; that type does not exist in code. |
| 2  | `STAR` technique identifier | **NO** | `rg "\bSTAR\b" src/` = 0 matches; `rg "Situation.*Task.*Action.*Result" src/ prisma/` = 0 matches | No `STAR` type/field. The "Situation, Problem, Implication, Need" string in `prisma/seed.ts:870` is an SPIN-selling **knowledge-test answer option** (cajero question), unrelated to STAR. |
| 3  | STAR structured capture (Situation / Task / Action / Result fields on an interview entity) | **NO** | `prisma/schema.prisma` `model InterviewSchedule` L310-326 (no `situation`, `task`, `action`, `result` fields); `model EvaluationResult` L250-308 (no STAR fields) | STAR is mentioned only as a design directive in `evidence-a06-1/structured-interview.md` §3.2 and `evidence-a06-2/08-star-method.md`; not implemented in schema or code. |
| 4  | `Probe` entity / probe bank / probe field | **NO** | `rg "\bstar\b\|probe" src/` = 0 matches; `rg "Probe\|probeBank" prisma/` = 0 matches | The literal "probe" never appears in `src/` or `prisma/`. No `InterviewProbe`, no `probes: string[]` field on any model, no "What did you do specifically?" structured follow-up. |
| 5  | `Rubric` entity / `scoringRubric` field | **NO** | `rg -i "rubric\|scoringRubric" src/ prisma/` = 0 matches | No `model Rubric {}`, no `rubric` field, no `scoringRubric` field. A-06.1 §3.1 names `scoringRubric: string` on `InterviewGuide` — that field does not exist. |
| 6  | Interview evidence-level enum (`NO_EVIDENCE` / `INSUFFICIENT` / `LIMITED` / `SUPPORTED` / `STRONG`) | **NO (interview)** | `rg "NO_EVIDENCE\|SUPPORTED\|STRONG" src/ prisma/` = 0 matches; `LIMITED` / `INSUFFICIENT` matches only inside `knowledge-canonical.ts`, `knowledge-versioning.ts`, `overall-score.ts`, `schema.prisma` `KnowledgeResult.evidenceStatus` | The 5-level interview evidence scale defined in `evidence-a06-1/structured-interview.md` §4.1 (`NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG`) does **not** exist anywhere. The `INSUFFICIENT/LIMITED` matches belong to the A-03.x Knowledge canonical engine (`KnowledgeResult.evidenceStatus = VALID\|LIMITED\|INSUFFICIENT\|INVALID\|NOT_APPLICABLE`) — a separate instrument domain. |
| 7  | `InterviewQuestion` model / question bank | **NO** | `rg "interviewQuestion\|interviewGuide\|questionBank\|interviewTemplate" src/ prisma/` = 0 matches; `prisma/schema.prisma` has no `model InterviewQuestion {}` | `InterviewSchedule` has no `questionBank` relation, no `interviewTemplateId` FK, no `questions: InterviewQuestion[]`. The only `notes` field on `InterviewSchedule` is free-text. |
| 8  | `InterviewGuide` entity (A-06.1 §3.1 canonical) | **NO** | `rg "InterviewGuide\|interviewGuide" src/ prisma/` = 0 matches | The A-06.1 canonical `InterviewGuide { guideId, jobId, competencyId, competencyVersion, questions, probes, scoringRubric, status, approvedBy }` has zero code presence. |
| 9  | `InterviewEvidence` entity (A-06.1 §4 canonical) | **NO** | `rg "InterviewEvidence\|interviewEvidence" src/ prisma/` = 0 matches | The A-06.1 canonical `InterviewEvidence { competencyId, jobId, candidateId, interviewerId, indicatorsObserved, indicatorsAbsent, evidenceLevel, evidenceLevelRationale, conflicts, status, reviewedBy }` has zero code presence. |
| 10 | `CompetencyResult` / `CompetencyEvidence` entity | **NO** | `rg "CompetencyResult\|competencyResult\|CompetencyEvidence\|competencyEvidence" src/ prisma/` = 0 matches | Confirmed in `evidence-a06-2/01-before-audit.md` §3.2 row 19. No competency entity exists; no interview can produce competency evidence. |
| 11 | Behavioral-indicator capture per interview | **NO** | `rg "BehavioralIndicator\|behavioralIndicators" src/ prisma/` = 0 matches in code (only in `evidence-a06-1/` / `evidence-a06-2/` design docs) | No `indicatorsObserved` field on `InterviewSchedule` or any other model. A-06.2 `04-behavioral-indicators.md` lists 23 DRAFT indicators; none is referenced by an interview entity. |
| 12 | AI function: generate interview questions | **NO** | `rg "z-ai-web-dev-sdk\|@z-ai\|ZAI" src/` = 1 file (`src/app/api/vacancies/[id]/generate-questions/route.ts`) | The only `z-ai-web-dev-sdk` import in `src/` is for generating **knowledge-test multiple-choice questions** (with `correctAnswer`) — see `POSITION_QUESTION_BANKS` constant (CAJERO/MESERO/COCINERO/GERENTE/BARISTA/VENDEDOR/RECEPCIONISTA banks, L10-101). **Not** interview questions, **not** STAR behavioral prompts, **not** probes. |
| 13 | AI function: suggest probes / summarize interview response | **NO** | `rg "interview.*ai\|ai.*interview\|interviewProbe\|responseSummary\|summarizeResponse\|generateInterviewQuestion\|probeSuggestion" src/` = 0 matches | No endpoint, no lib function, no UI affordance to generate probes or summarize a candidate's interview response. A-06.1 §6 lists these as permissible AI assists; none is implemented. |
| 14 | `InterviewSchedule` Prisma model (calendar entity) | **YES** | `prisma/schema.prisma` L310-326 | Fields: `id`, `candidateId`, `companyId`, `positionId?`, `scheduledAt`, `status` (`SCHEDULED/COMPLETED/CANCELLED`), `location?`, `notes?`, `notified`, `createdAt`, `updatedAt`. **NO** `interviewGuideId`, **NO** `competencyId`, **NO** `rubricId`, **NO** `questionBank` relation. This is a calendar/scheduling record. |
| 15 | Interview API route (`/api/interviews`) | **YES** | `src/app/api/interviews/route.ts` (full, 217 lines) | `GET` (list), `POST` (create with `candidateId/positionId/scheduledAt/location/notes`), `PATCH` (`{ id, status }` — only status updates; allowed values `SCHEDULED/COMPLETED/CANCELLED`). Never receives questions, never returns a rubric, never invokes AI. The PATCH path explicitly rejects CANDIDATO callers (audit-logged). |
| 16 | Interviews UI (`InterviewsView.tsx`) | **YES** | `src/components/views/InterviewsView.tsx` (273 lines) | Three lists filtered by status (Programada / Completada / Cancelada). Status-badge UI only (`getStatusBadge` L105-112). No question editor, no rubric picker, no probe panel, no competency linkage. The candidate-facing equivalent (`EvaluationCompleteView.tsx` L25) only fetches the candidate's own `InterviewSchedule` rows. |
| 17 | "Areas to explore in interview" free-text recommendation | **YES (cosmetic only)** | `src/app/api/evaluations/route.ts` L354-369; mirrored verbatim in `src/app/api/public/apply/route.ts` L654-669 | Pushes Spanish strings into `areasToExplore[]` when Likert scores < 40 (e.g. `"manejo del estrés en situaciones de alta demanda"`, `"habilidades de empatía y relación con clientes"`). These are advisory hints derived from PSICOLOGICA/Big-Five scores — **not** structured interview questions, **not** probes, **not** competency-anchored. |
| 18 | `z-ai-web-dev-sdk` dependency declared | **YES** | `package.json` L86 `"z-ai-web-dev-sdk": "^0.0.18"` | Declared. The single `src/` import is in `src/app/api/vacancies/[id]/generate-questions/route.ts` (knowledge-test MC questions only). The user-facing A-04.1/A-05.1 worklog note that "z-ai-web-dev-sdk is NOT imported in src/" reflects the state at those phases; the SDK **was** subsequently imported, but only for the Knowledge question generator — **not** for interviews. |

**Reading of the table:** rows 1–13 are the components a real
structured-interview module would need; **all are absent**. Rows 14–17 are
the artifacts that **do** exist and that someone might mistake for a
structured-interview module; §4 explains why none of them qualifies. Row 18
is the AI-SDK state, whose single non-interview import is documented in §5.

---

## 4. What DOES exist — and why it is NOT a structured BDI/STAR interview

### 4.1 `InterviewSchedule` (the calendar entity)

**Location:** `prisma/schema.prisma` L310-326.

```prisma
model InterviewSchedule {
  id          String   @id @default(cuid())
  candidateId String
  companyId   String
  positionId  String?
  scheduledAt DateTime
  status      String   @default("SCHEDULED") // SCHEDULED, COMPLETED, CANCELLED
  location    String?
  notes       String?
  notified    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  candidate User      @relation("InterviewCandidate", fields: [candidateId], references: [id])
  company   Company   @relation(fields: [companyId], references: [id])
  position  Position? @relation(fields: [positionId], references: [id])
}
```

**Why this is NOT a structured interview / BDI / STAR instrument:**

1. **It is a calendar record.** The fields describe *when* and *where* an
   interview happens (`scheduledAt`, `location`, `notified`), and its
   lifecycle status (`status ∈ {SCHEDULED, COMPLETED, CANCELLED}`). None of
   them is a question, a competency, a rubric, or a probe.
2. **No question guide.** No `InterviewQuestion` model, no
   `interviewGuideId` FK, no `questionBank` relation, no
   `structuredGuide` field. The `notes` field is free-text — RH can type
   anything (or nothing). A structured interview requires a fixed,
   competency-anchored question protocol (Huffcutt & Arthur 2001;
   Pulakos & Schmitt 1995; cited in A-06.1 `structured-interview.md`).
   None exists.
3. **No competency linkage.** No `competencyId` field, no `competencies`
   relation. An interview in EvaluHR today cannot be tied to a specific
   competency being probed. A-06.1 `recommended-model.md` chose OPCIÓN A
   (structured interview as the primary evidence source for competencies
   in V1); the schema to support that choice does not exist yet.
4. **No BDI / behavioral-past question type.** A-06.1 §3.2 names
   `BEHAVIORAL_PAST` as the high-validity question type that operationalizes
   the BDI (Behavioral Description Interview). There is no `type` enum on
   `InterviewSchedule` — and no `InterviewQuestion` to host it either.
5. **No STAR capture.** A-06.1 §3.2 requires the answer to be captured as
   Situation / Task / Action / Result. There is no `situation`, `task`,
   `action`, `result` field on `InterviewSchedule`, on `EvaluationResult`,
   or on any other model. The candidate's "interview" is structurally an
   unscored calendar event.
6. **No rubric, no evidence-level assignment.** A-06.1 §4 requires the
   interviewer to assign a qualitative `evidenceLevel ∈
   {NO_EVIDENCE, INSUFFICIENT, LIMITED, SUPPORTED, STRONG}` with a
   `evidenceLevelRationale`. None of these five labels exists anywhere
   in `src/` or `prisma/`. The only adjacent enum is `KnowledgeResult.
   evidenceStatus = VALID|LIMITED|INSUFFICIENT|INVALID|NOT_APPLICABLE`
   (A-03.x Knowledge domain) — different instrument, different labels,
   different rationale (keyed-answer scoring, not behavioral evidence).
7. **No probes.** A-06.1 §3.1 names `probes: string[]` on `InterviewGuide`
   (follow-ups like "What did you do specifically?"). There is no `Probe`
   entity, no `probes` field, no probe bank. The literal string "probe"
   never appears in `src/` or `prisma/`.
8. **No behavioral-indicator capture.** A structured interview records
   which `BehavioralIndicator` a candidate's answer speaks to
   (`indicatorsObserved: { indicatorId, evidenceText }[]`). No such field
   exists. `BehavioralIndicator` itself has zero code presence (confirmed
   in A-06.2 `01-before-audit.md` row 4); the 23 DRAFT indicators in
   `evidence-a06-2/04-behavioral-indicators.md` are design-only.

**Verdict on `InterviewSchedule`:** NOT a structured-interview instrument.
It is a scheduling/calendar record with free-text `notes`. It is the *hook*
on which a future structured-interview capability could be built, but it
currently has no question content, no competency linkage, no BDI question
type, no STAR capture, no rubric, no probes, and no evidence-level
assignment.

### 4.2 The interview API route (`/api/interviews`)

**Location:** `src/app/api/interviews/route.ts` (217 lines, read in full).

The route exposes three handlers:

- `GET` — lists `InterviewSchedule` rows. For a `CANDIDATO`, scoped to
  `?candidateId=<own-id>` only (PHASE 3.5-H VUL-H3 authorization).
  Returns `{ id, candidate, position, scheduledAt, status, location, notes,
  notified }`. No questions, no rubric, no probes.
- `POST` — creates a row from `{ candidateId, positionId, scheduledAt,
  location, notes }`. No `interviewGuideId`, no `competencyId`, no
  `questionBankId` accepted. The only content field is free-text `notes`.
- `PATCH` — updates `{ id, status }` only. Validates `status ∈
  {SCHEDULED, COMPLETED, CANCELLED}`. Never accepts a question, never
  accepts a rubric score, never accepts a probe. CANDIDATO callers are
  audit-logged and rejected (403).

**Why this is NOT a structured-interview API:**

1. **No question endpoint.** There is no `GET /api/interviews/:id/questions`
   route, no `POST /api/interviews/:id/responses` route, no
   `/api/interview-guides` route, no `/api/interview-evidence` route.
2. **No AI call.** The route never imports `z-ai-web-dev-sdk`. No
   `/api/interviews/:id/generate-questions` route, no
   `/api/interviews/:id/suggest-probes` route, no
   `/api/interviews/:id/summarize-response` route.
3. **No rubric write.** The PATCH body is restricted to `{ id, status }`.
   A rubric score / evidence level cannot be persisted even if a UI
   existed to capture it.

**Verdict on `/api/interviews`:** calendar CRUD. Confirms that the
"interview" surface of EvaluHR is logistics only.

### 4.3 The interviews UI (`InterviewsView.tsx`)

**Location:** `src/components/views/InterviewsView.tsx` (273 lines).

The view renders three lists filtered by `status`: Programada (SCHEDULED),
Completada (COMPLETED), Cancelada (CANCELLED). It exposes one action:
`handleStatusUpdate(interviewId, newStatus)` — PATCHes `/api/interviews`
with `{ id, status }`. The candidate-facing equivalent
(`EvaluationCompleteView.tsx` L25) fetches the candidate's own
`InterviewSchedule` rows and displays them as upcoming appointment cards.

**Why this is NOT a structured-interview UI:**

1. **No question editor.** There is no form to author or edit
   competency-anchored questions.
2. **No rubric picker.** There is no UI to assign `NO_EVIDENCE/INSUFFICIENT/
   LIMITED/SUPPORTED/STRONG` to a candidate's answer.
3. **No probe panel.** There is no UI to insert follow-up probes mid-
   interview.
4. **No interview evidence browser.** There is no UI to view collected
   `InterviewEvidence` rows per candidate per competency.

**Verdict on `InterviewsView.tsx`:** calendar UI. Confirms the user-
facing surface is scheduling only.

### 4.4 "Areas to explore in interview" (the linguistic trap)

**Location:** `src/app/api/evaluations/route.ts` L354-369; mirrored verbatim
in `src/app/api/public/apply/route.ts` L654-669.

The recommendation engine pushes Spanish strings into `areasToExplore[]`
when PSICOLOGICA / Big-Five scores cross thresholds (e.g. `psychScores[
'STRESS'] < 40` → `"manejo del estrés en situaciones de alta demanda"`).
These strings flow into the candidate detail view as advisory hints for
the recruiter.

**Why this is NOT a structured question bank:**

1. **It is a derived recommendation, not a stored question.** The strings
   are generated by score-threshold conditionals at runtime, not persisted
   as `InterviewQuestion` rows.
2. **No competency anchor.** The strings are not linked to a `competencyId`
   (no Competency entity exists — confirmed in A-06.2 `01-before-audit.md`
   §3) and not linked to behavioral indicators.
3. **No question type.** A-06.1 §3.2 requires every question to declare
   `type ∈ {BEHAVIORAL_PAST, SITUATIONAL, JOB_KNOWLEDGE}`. The
   `areasToExplore` strings carry no type.
4. **Not a BDI / STAR prompt.** A BDI prompt is "Tell me about a time
   when…" (past behavior). The `areasToExplore` strings are topic labels
   ("manejo del estrés", "dinámica de trabajo en equipo"), not
   behavioral-past questions and not STAR-cued.
5. **Free text the recruiter may ignore.** There is no enforcement that
   the recruiter asks them, no capture of the candidate's answer, no
   rubric, no evidence-level assignment.

**Verdict on "Areas to explore in interview":** advisory copy derived
from Likert scores. Not a structured interview question bank. Same
linguistic trap as the "competencias" Spanish copy audited in A-06.2
§3.4 — the word is in the codebase, the construct is not.

---

## 5. What does NOT exist (the gap)

The following components are required for a real structured-interview
methodology (per A-06.1 `structured-interview.md` §3-4 and A-06.2
`07-evidence-model.md` / `08-star-method.md` / `09-insufficient.md`) and
are **absent** from the repo as verified above:

### 5.1 BDI / behavioral-past question type

- **No `BehavioralDescription` identifier** anywhere in `src/` or `prisma/`.
- **No `BDI` acronym** anywhere.
- **No `type: 'BEHAVIORAL_PAST' | 'SITUATIONAL' | 'JOB_KNOWLEDGE'` enum**
  on any model or type. A-06.1 §3.2 requires this on `InterviewQuestion`;
  `InterviewQuestion` itself does not exist (see §5.3).

### 5.2 STAR technique

- **No `STAR` identifier** in `src/`. (`prisma/seed.ts:870` has
  "Situation, Problem, Implication, Need" — SPIN selling knowledge-test
  answer option, unrelated.)
- **No Situation/Task/Action/Result structured fields** on any model.
- **No STAR cue in the candidate-response capture path** — there is no
  response-capture path at all (see §5.7).
- **No `08-star-method.md` rule** operationalized in code; that dossier
  is design-only.

### 5.3 Interview questions / question bank

- **No `InterviewQuestion` model.** `prisma/schema.prisma` has no
  `model InterviewQuestion {}`.
- **No `InterviewGuide` model.** A-06.1 §3.1 canonical guide does not
  exist in schema.
- **No `interviewGuideId` / `interviewTemplateId` / `questionBankId` FK**
  on `InterviewSchedule` or any other model.
- **No `questions: InterviewQuestion[]` relation** anywhere.
- The only interview-adjacent question surface is the SPIN-selling /
  Knowledge MC question bank in `src/app/api/vacancies/[id]/generate-
  questions/route.ts` (rows 12 + 18 of the summary table) — that is the
  Knowledge domain (A-03.x), not the structured-interview domain.

### 5.4 Probes

- **No `Probe` entity.** No `model Probe {}` in schema.
- **No `probes: string[]` field** on any model.
- **No `probeBank` / `probeId` / `followUpQuestion`** anywhere.
- The literal "probe" string never appears in `src/` or `prisma/`.

### 5.5 Rubrics

- **No `Rubric` entity.** No `model Rubric {}`.
- **No `rubric` field, no `rubricId`, no `scoringRubric`** anywhere.
  `rg -i "rubric|scoringRubric" src/ prisma/` = 0 matches.
- **No qualitative evidence-level assignment** for interviews. The
  5-level scale `NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG`
  defined in A-06.1 §4.1 has zero code presence. (The Knowledge domain
  has `INSUFFICIENT/LIMITED/VALID/INVALID/NOT_APPLICABLE` for keyed
  answers — different construct, different instrument, different rationale.)

### 5.6 Competency evaluation (interview-produced)

- **No `CompetencyResult` entity.** (Confirmed in A-06.2 `01-before-audit.md`
  row 19 — no Competency entity at all; therefore no CompetencyResult.)
- **No `CompetencyEvidence` entity.**
- **No `InterviewEvidence` entity.** A-06.1 §4 canonical InterviewEvidence
  does not exist in schema.
- **No `indicatorsObserved` / `indicatorsAbsent`** fields. The interview
  cannot record which behavioral indicators a candidate's answer speaks
  to. `BehavioralIndicator` itself has zero code presence (A-06.2 audit
  row 4); the 23 DRAFT indicators in `evidence-a06-2/04-behavioral-
  indicators.md` are design-only.
- **No `evidenceLevel` / `evidenceLevelRationale` / `conflicts`** fields
  on any model.

### 5.7 AI functions for interviews

- **No interview-question generator.** The single `z-ai-web-dev-sdk`
  import in `src/` (`src/app/api/vacancies/[id]/generate-questions/route.ts`)
  generates Knowledge MC questions (`POSITION_QUESTION_BANKS` constant +
  AI fallback for additional knowledge items). It is the Knowledge
  domain; it does not produce behavioral-past / STAR / competency-anchored
  interview questions.
- **No probe suggestion endpoint.** No `/api/interviews/:id/suggest-probes`
  route; no `suggestProbes()` lib function; no UI affordance. A-06.1 §6
  lists probe suggestion as a permissible AI assist; not implemented.
- **No response summarization endpoint.** No `/api/interviews/:id/
  summarize-response` route; no `summarizeResponse()` lib function; no UI
  affordance. A-06.1 §6 lists response summarization as a permissible AI
  assist; not implemented.
- **No `AI_DRAFT_ORIGIN` provenance for interview artifacts.** A-03.5
  enforces this for Knowledge items; the same provenance field does not
  exist for interview guides, interview questions, probes, or interview
  evidence — because none of those entities exists.

---

## 6. Conclusion — Structured Interview Methodology = NOT_IMPLEMENTED

The audit confirms, by direct code/schema inspection, the claim that
A-06.1 recorded as the V1 design decision and A-06.2 confirmed at the
competency surface:

> **EvaluHR has NO structured-interview methodology.**

What it has, instead, is:

1. A scheduling/calendar record (`InterviewSchedule`, `prisma/schema.prisma`
   L310-326) with no question guide, no rubric, no probe, no competency
   linkage, no BDI/STAR capture, no evidence-level assignment. It is a
   calendar entry, not a structured interview.
2. A calendar CRUD API (`/api/interviews` — GET / POST / PATCH-status)
   that never receives or returns a question, never invokes AI, never
   persists a rubric score.
3. A calendar UI (`InterviewsView.tsx`) with three status badges
   (Programada / Completada / Cancelada) and no question/rubric/probe
   affordance.
4. A derived free-text `areasToExplore[]` recommendation ("manejo del
   estrés…", "dinámica de trabajo en equipo…") that flows from Likert
   score thresholds, not from a competency-anchored question bank. It is
   advisory copy, not a structured question.
5. A `z-ai-web-dev-sdk` import in `src/app/api/vacancies/[id]/generate-
   questions/route.ts` that produces Knowledge-test multiple-choice
   questions — NOT interview questions, NOT probes, NOT response
   summaries.

Everything a real structured-interview module would need — BDI question
type, STAR capture, `InterviewGuide` entity, `InterviewQuestion` bank,
`Probe` entity, `Rubric` / `scoringRubric` field, the 5-level
`NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG` evidence scale,
`InterviewEvidence` / `CompetencyResult` / `CompetencyEvidence` entities,
behavioral-indicator capture per interview, AI functions for question
generation / probe suggestion / response summarization, and the
`AI_DRAFT_ORIGIN` provenance for AI-assisted interview artifacts — is
**absent** from schema and code.

This is the correct BEFORE state for A-06.3. The dossier that follows
(`02-*.md` onward) defines the canonical structured-interview structures
(`InterviewGuide`, `InterviewQuestion`, `Probe`, `Rubric`,
`InterviewEvidence`, and the AI-assist surface) that will close this gap.
That dossier is documentation-only: it does **not** modify
`prisma/schema.prisma`, `src/`, or any source file. The schema migration
itself is gated to a future A-06.x implementation phase.

**Status:** Structured Interview Methodology = **NOT_IMPLEMENTED**
(same verdict A-06.1 recorded; same verdict A-06.2 confirmed at the
competency surface; now confirmed at the structured-interview surface).

---

## 7. Provenance and immutability of this audit

- **Created by:** Task 1 (general-purpose subagent) under A-06.3 PASO 1.
- **Source inputs:** repository state at A-06.3 task start; A-06.1
  dossier `structured-interview.md` (the WHAT — `InterviewGuide` /
  `InterviewQuestion` / `Probe` / `scoringRubric` / `InterviewEvidence` /
  5-level evidence scale / AI boundaries); A-06.2 dossier
  `01-before-audit.md` (the Competencies = NO_METHOD audit whose §3.2
  documented `InterviewSchedule` as "calendar entry, not structured
  interview"); A-06.2 dossier `04-behavioral-indicators.md` (the 23
  DRAFT indicators that no interview entity references).
- **Method:** read-only Grep and Read over `src/` and `prisma/`. No file
  was modified. DOCUMENTATION-ONLY confirmed.
- **Status:** AUDIT — locked at A-06.3 PASO 1 publication. The audit
  reflects the repository at the time of reading; subsequent A-06.3
  steps that modify schema/code will record the AFTER state in their own
  deliverables, not by mutating this file.
- **Cross-reference:** `evidence-a06-1/structured-interview.md` (the
  canonical design); `evidence-a06-2/01-before-audit.md` (the competency
  surface audit this dossier extends); `evidence-a06-2/04-behavioral-
  indicators.md` (the indicator catalog this audit references for
  capture-absence); `evidence-a06-2/08-star-method.md` and
  `09-insufficient.md` (the STAR + INSUFFICIENT design that has zero
  code presence).
