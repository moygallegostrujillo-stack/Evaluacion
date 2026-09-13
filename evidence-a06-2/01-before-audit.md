# A-06.2 — 01 · Auditoría Before (PASO 1)

> Phase A-06.2 · Task 1-a · DOCUMENTATION-ONLY (no source code modified)
> Expediente: `/home/z/my-project/evidence-a06-2/`
> Companion file: `02-definition.md` (PASO 2 — canonical structures).
> Prerequisite reads: worklog A-04.1 → A-06.1; `evidence-a06-1/competency-definition.md`;
> `evidence-a06-1/competency-framework.md`; `evidence-a06-1/behavioral-indicators.md`;
> `evidence-a06-1/job-linkage.md`.

---

## 1. Purpose of this audit

PASO 1 of A-06.2 verifies, by reading the actual codebase, that **no
competency model exists in EvaluHR today**, despite the colloquial use of
the word "competencias" in some Spanish UI copy and seed descriptions.

This is the same finding that A-06.1 stated ("Competencies = NO_METHOD")
and that earlier phases (A-04.1 through A-05.3) recorded in the worklog.
PASO 1 makes the claim **code-verified**, not asserted.

The audit covers:

- Whether a `Competency` entity, type, table, field, or service exists.
- Whether the `PSICOLOGICA_QUESTIONS` array constitutes a competency catalog
  (answer: no — it is a Likert self-report battery, mislabeled in copy).
- Whether `InterviewSchedule` carries any structured question guide, rubric,
  or competency linkage (answer: no — it is a calendar entry).
- Whether `Position` and `Vacancy` carry competency fields (answer: no).
- Whether behavioral indicators, rubrics, evidence types, or competency
  categories exist anywhere (answer: no).

All findings below were produced by **read-only** Grep / Read on the
repository as it stands at A-06.2 task start. **No file under `src/`,
`prisma/`, `scripts/`, or `public/` was modified.**

---

## 2. Summary table — what exists vs. what does not

| # | Component | Exists? | Location (verified) | Notes |
|---|---|---|---|---|
| 1 | `Competency` Prisma model | **NO** | `prisma/schema.prisma` (read in full) | No `model Competency {}`. No `competencyId` foreign key on any model. |
| 2 | `Competency` TypeScript type / interface | **NO** | `src/lib/*.ts`, `src/app/api/**` (Grep) | 0 matches for `Competency` as a type identifier. |
| 3 | `JobCompetency` link entity | **NO** | `prisma/schema.prisma`, `src/lib/*` | No `model JobCompetency`. `Position` and `Vacancy` have no competency FK. |
| 4 | `BehavioralIndicator` entity / field | **NO** | `prisma/schema.prisma`, `src/lib/*` | Only matches are in `evidence-a06-1/` docs (the A-06.1 framework proposal). 0 matches in code/schema. |
| 5 | `behavioralIndicators` field on any model | **NO** | `prisma/schema.prisma` | Not present on `Position`, `Vacancy`, `EvaluationTemplate`, `InterviewSchedule`, or any other model. |
| 6 | Competency rubric (`rubric` keyword) | **NO** | `rg -i rubric src/ prisma/` = 0 matches | No rubric entity, no rubric field, no rubric UI. |
| 7 | Hard / soft competency distinction | **NO** | `rg -i "hard.?skill\|soft.?skill\|hardCompetency\|softCompetency" src/ prisma/` = 0 matches | The hard/soft dichotomy is absent from the schema and code. |
| 8 | Competency category / taxonomy | **NO** | `prisma/schema.prisma` | No `category` enum, no `competencyCategory` field, no taxonomy table. (`Position.category` is RESTAURANT role — MESERO/COCINERO/etc. — unrelated.) |
| 9 | Competency references (literature / source field) | **NO** | `prisma/schema.prisma`, `src/lib/*` | No `source` field on any competency-like entity; no literature reference stored. |
| 10 | Competency → Job linkage | **NO** | `model Position` L122-143, `model Vacancy` L328-347 | Neither model has a competency field or relation. |
| 11 | Competency → InterviewSchedule linkage | **NO** | `model InterviewSchedule` L310-326 | Fields: candidateId, companyId, positionId, scheduledAt, status, location, notes, notified. No `competencyId`, no question guide, no rubric. |
| 12 | Competency → overallScore / JobFit linkage | **NO** | `src/lib/overall-score.ts` | Grep `competency` (case-insensitive) = 0 matches. Competencies are not part of the canonical engine. |
| 13 | Competency → recommendation linkage | **NO** | `src/lib/overall-score.ts`, `src/app/api/results/route.ts` | Recommendation is guidance-only (A-04.3/A-04.4); no competency input. |
| 14 | Competency approval lifecycle | **NO** | `prisma/schema.prisma` | No `status` field on a Competency row; no DRAFT/REVIEW/APPROVED/ACTIVE/SUSPENDED/RETIRED graph for competencies. (The lifecycle exists for `KnowledgeItemVersion` per A-03.5; it does **not** exist for competencies.) |
| 15 | `PSICOLOGICA_QUESTIONS` (Likert items, ad-hoc) | **YES** | `src/lib/generate-templates.ts` L34-45 | 10 items × 5 categories (STRESS/EMPATHY/ADAPTABILITY/LEADERSHIP/TEAMWORK). **NOT a competency catalog** — see §3. |
| 16 | `PSICOLOGICA` EvaluationTemplate (auto-created for every new Position) | **YES** | `src/lib/generate-templates.ts` L239-251; `src/lib/generate-templates.ts` header comment L5-9 | Every new Position receives a PSICOLOGICA template + 10 Likert questions at creation. Self-report Likert items. |
| 17 | Persisted PSICOLOGICA scores on `EvaluationResult` / `VacancyApplication` | **YES** | `prisma/schema.prisma` `model EvaluationResult` L266-271; `model VacancyApplication` (mirrored) | 5 `Float @default(0)` columns: `stressLevel`, `empathy`, `adaptability`, `leadership`, `teamwork`. These are Likert-derived numeric scores, NOT behavioral evidence. |
| 18 | `InterviewSchedule` model | **YES** | `prisma/schema.prisma` `model InterviewSchedule` L310-326 | Calendar/scheduling record only. **No** question guide, **no** rubric, **no** competency linkage. See §3.2. |
| 19 | Interview question bank (structured) | **NO** | `prisma/schema.prisma`, `src/app/api/interviews/route.ts` | `InterviewSchedule` carries free-text `notes` only. No `InterviewQuestion` model, no `interviewTemplateId`, no competency linkage. |
| 20 | Mention of "competencias" in UI copy / seed descriptions | **YES (cosmetic only)** | `prisma/seed.ts` (5 lines), `src/components/views/EvaluationView.tsx`, `InviteView.tsx`, `PublicEvaluationView.tsx`, `InvitationWelcomeView.tsx`, `src/lib/privacy-notice.ts`, `src/lib/generate-templates.ts` | 11 lines total in `src/` + `prisma/`. All are colloquial Spanish copy ("Evaluación de competencias psicológicas", "Competencias laborales: estrés, empatía, liderazgo"). **Not** entity names, field names, or type identifiers. The word "competencia" is used in its everyday Spanish sense ("skills/abilities"), not as a formal competency-model construct. |

**Reading of the table:** rows 1–14 are the components a real competency
module would need; **all are absent**. Rows 15–19 are the artifacts that
**do** exist and that someone might mistake for a competency module; §3
explains why none of them qualifies. Row 20 is the linguistic confusion
that this audit is designed to settle.

---

## 3. What DOES exist — and why it is NOT a competency model

### 3.1 `PSICOLOGICA_QUESTIONS` (the "ad-hoc Likert battery")

**Location:** `src/lib/generate-templates.ts` L34-45.

```ts
const PSICOLOGICA_QUESTIONS = [
  { text: 'Me siento abrumado/a cuando tengo múltiples tareas pendientes', category: 'STRESS', order: 1, reverseScored: true },
  { text: 'Me cuesta desconectar del trabajo después de mi jornada', category: 'STRESS', order: 2, reverseScored: true },
  { text: 'Puedo entender cómo se sienten mis compañeros aunque no lo digan', category: 'EMPATHY', order: 3 },
  { text: 'Me resulta fácil ponerme en el lugar del cliente cuando tiene un problema', category: 'EMPATHY', order: 4 },
  { text: 'Me adapto rápidamente a cambios en mi rutina de trabajo', category: 'ADAPTABILITY', order: 5 },
  { text: 'Cuando cambian las reglas o procedimientos, me ajusto sin problema', category: 'ADAPTABILITY', order: 6 },
  { text: 'Cuando hay un problema, suelo tomar la iniciativa para resolverlo', category: 'LEADERSHIP', order: 7 },
  { text: 'Mis compañeros me piden ayuda para organizar el trabajo', category: 'LEADERSHIP', order: 8 },
  { text: 'Prefiero colaborar con otros para alcanzar una meta que hacerlo solo/a', category: 'TEAMWORK', order: 9 },
  { text: 'Escucho y respeto las opiniones de mis compañeros aunque no esté de acuerdo', category: 'TEAMWORK', order: 10 },
]
```

**Why this is NOT a competency catalog (per A-06.1 §3 definition):**

1. **Self-report, not behavioral evidence.** Each item is a first-person
   Likert statement ("Me siento abrumado…", "Puedo entender…"). A competency
   is, by A-06.1 §3 clause 1, an *observable behavior*. A self-report of a
   feeling or disposition is the **iceberg base** (motive, trait,
   self-concept), not the **iceberg tip** (observable behavior). The
   PSICOLOGICA items are latent-trait items mislabeled as "competencias".

2. **No formal definition per category.** A Competency requires a
   one-paragraph operational `definition` (A-06.1 framework §2.1). The
   PSICOLOGICA categories (`STRESS`, `EMPATHY`, `ADAPTABILITY`,
   `LEADERSHIP`, `TEAMWORK`) are bare labels with no definition text, no
   job-relevance narrative, no source.

3. **No behavioral indicators.** A Competency needs ≥3 observable
   `behavioralIndicators` (A-06.1 framework §2.1). The PSICOLOGICA items
   are not behavioral indicators — they are Likert *questions about a
   self-perception*, not descriptions of *what the person does* in a
   job-relevant situation.

4. **Likert scoring (0-100) — exactly what A-06.1 forbids.** The
   PSICOLOGICA scores are persisted as `Float @default(0)` on
   `EvaluationResult` (`stressLevel`, `empathy`, `adaptability`,
   `leadership`, `teamwork`). A-06.1 §5 states: "a competency is NOT a
   test score". The PSICOLOGICA battery produces scores; competencies do
   not. The Likert battery is a **personality-adjacent self-report
   instrument** (closer to the Big Five demo that A-05.2/A-05.3 retired
   than to a competency model).

5. **No job linkage.** `PSICOLOGICA_QUESTIONS` is identical for every
   position. It is not parameterized by job family, role context, or
   performance criterion. A-06.1 §3 clause 2 requires the behavior to be
   "causally linked to effective or superior performance in a defined job
   context". The PSICOLOGICA items have no such link.

6. **No provenance / version / status / approver.** There is no `source`
   field on the items, no `version` (the items have no `COMP-v{n}` label),
   no `status` lifecycle (DRAFT/REVIEW/APPROVED/ACTIVE/SUSPENDED/RETIRED),
   no `approvedBy`. A real competency carries all four (A-06.1 framework
   §2). The PSICOLOGICA array is a free-floating constant in source code,
   editable by any commit, with no audit trail.

7. **Category names overlap with competency-sounding words, but that is
   semantic coincidence.** `LEADERSHIP`, `TEAMWORK`, `ADAPTABILITY` are
   *names that competencies might also have*. But a name is not a
   competency. The same label can name a latent trait (self-perception of
   leadership style, as measured here by Likert) or an observable
   competency (e.g. "Takes initiative to resolve team blockers" with
   behavioral indicators). The PSICOLOGICA items measure the former; they
   do not operationalize the latter.

**Verdict on `PSICOLOGICA_QUESTIONS`:** NOT a competency catalog. It is a
10-item Likert self-report battery covering 5 categories, persisted as
0-100 scores, identical across all positions, with no behavioral
indicators, no job linkage, no versioning, no approval, no provenance.
It is, in the A-06.1 taxonomy, **a latent-trait self-report instrument
adjacent to personality** — and was implicitly recognized as such when
A-05.3 (Personality V1) retired the PSICOMETRICA (Big Five) template
while leaving PSICOLOGICA in place only because it was never formally
classified as a personality instrument. The colloquial label
"competencias psicológicas" is a copy artifact, not a methodological
classification.

### 3.2 `InterviewSchedule` (the calendar entry)

**Location:** `prisma/schema.prisma` `model InterviewSchedule` L310-326.

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

  candidate User     @relation("InterviewCandidate", fields: [candidateId], references: [id])
  company   Company  @relation(fields: [companyId], references: [id])
  position  Position? @relation(fields: [positionId], references: [id])
}
```

**Why this is NOT a structured interview / competency instrument:**

1. **It is a calendar record.** The fields describe *when* and *where* an
   interview happens, not *what* is asked. `scheduledAt`, `location`,
   `notified`, `status ∈ {SCHEDULED, COMPLETED, CANCELLED}` are
   logistics fields. None of them is a question, a competency, or a rubric.

2. **No question guide.** There is no `InterviewQuestion` model, no
   `interviewTemplateId` FK, no `questionBank` relation, no
   `structuredGuide` field. The `notes` field is free-text — RH can type
   anything (or nothing). A structured interview requires a fixed,
   competency-anchored question protocol (Huffcutt & Arthur 2001; Pulakos
   & Schmitt 1995; cited in A-06.1 `structured-interview.md`). None exists.

3. **No competency linkage.** There is no `competencyId` field, no
   `competencies` relation. An interview in EvaluHR today cannot be tied
   to a specific competency being probed. A-06.1 `recommended-model.md`
   chose OPCIÓN A (structured interview as the primary evidence source
   for competencies in V1) — but the schema to support that choice does
   not exist yet. `InterviewSchedule` is the empty shell that a future
   A-06.x phase would extend.

4. **No rubric, no scoring guide.** Even if a question were present,
   there would be no rubric to score the candidate's answer
   qualitatively (VALID / LIMITED / INSUFFICIENT / PENDING_REVIEW).
   A-06.1 `evidence-model.md` defines evidence levels; nothing in
   `InterviewSchedule` operationalizes them.

5. **No behavioral indicator capture.** A structured interview records
   which `BehavioralIndicator` a candidate's answer speaks to. Today,
   nothing in `InterviewSchedule` references an indicator. The
   candidate's interview is, structurally, an unscored calendar event.

**Verdict on `InterviewSchedule`:** NOT a structured interview
instrument. It is a scheduling/calendar record with free-text notes. It
is the *hook* on which a future structured-interview capability could be
built, but it currently has no question content, no competency linkage,
no rubric, and no evidence capture.

### 3.3 `generate-templates.ts` (the auto-creation hook)

**Location:** `src/lib/generate-templates.ts`, function
`generateTemplatesForPosition()`, L239-251 (PSICOLOGICA creation) and
header comment L5-9.

The header reads:

```
* New positions get: PSICOLOGICA + INTEGRIDAD (+ CONOCIMIENTOS if applicable).
* Existing positions with PSICOMETRICA templates retain them (LEGACY); their
* ...
```

This generator auto-creates a `PSICOLOGICA` template plus the 10
`PSICOLOGICA_QUESTIONS` for every new Position. It does NOT create a
Competency record, a BehavioralIndicator, a JobCompetency link, or a
structured interview guide. The generator's output is the Likert
battery described in §3.1, plus the INTEGRIDAD and CONOCIMIENTOS
templates — none of which is a competency model.

The generator was modified in A-05.3 to **stop** auto-creating the
PSICOMETRICA (Big Five) template. It was NOT modified to create
anything competency-flavored. The competency module remains unbuilt.

### 3.4 "Competencias" in UI copy and seed text (the linguistic trap)

The following 11 matches are the **only** textual occurrences of
"competencia" in `src/` and `prisma/` (verified by `rg -i competency |
competencias src/ prisma/`):

| File | Line | Text | Nature |
|---|---|---|---|
| `prisma/seed.ts` | (5 lines) | `description: 'Evaluación de competencias psicológicas para Mesero'` (and 4 analogous lines for Cocinero/Bartender/Gerente de Piso/Vendedor) | Seed copy text. Not an entity, not a field. |
| `src/components/views/EvaluationView.tsx` | (1 line) | `default: return 'Evaluación de competencias para el puesto.'` | UI string shown when no position-specific label is set. |
| `src/components/views/InviteView.tsx` | (1 line) | `…que incluye evaluaciones de personalidad y competencias.` | Invite message copy. |
| `src/components/views/PublicEvaluationView.tsx` | (1 line) | `<li>Generar perfiles de competencias y recomendaciones</li>` | Marketing-style bullet in the public vacancy page. |
| `src/components/views/InvitationWelcomeView.tsx` | (1 line) | `Competencias laborales: estrés, empatía, liderazgo — ~15 preguntas` | Welcome-screen copy describing the PSICOLOGICA battery to candidates. |
| `src/lib/privacy-notice.ts` | (1 line) | `<td>Perfil de competencias</td>` | Privacy-notice table cell. |
| `src/lib/generate-templates.ts` | (1 line) | `description: \`Evaluación de competencias psicológicas para ${categoryName}\`` | Description string written to the auto-created PSICOLOGICA template. |

**These 11 occurrences are Spanish prose**, not identifiers. None of
them is a `type`, `interface`, `model`, `enum`, `field`, `function`, or
`class` name. They are user-facing copy that uses the everyday Spanish
word "competencia" (= "skill / ability / proficiency") — the same way an
HR brochure might. They do not establish the existence of a competency
**model** any more than the word "intelligence" in a UI label would
establish the existence of an IQ test in the system.

This linguistic coincidence is precisely why PASO 1 is needed: the
word is in the codebase, the construct is not.

---

## 4. What does NOT exist (the gap)

The following components are required for a real competency module
(per A-06.1 `competency-framework.md` and `job-linkage.md`) and are
**absent** from the repo as verified above:

### 4.1 Catalog-level absence

- **No `Competency` entity / model / table.** No row in the schema
  represents a competency.
- **No competency catalog.** There is no list, library, or seed of
  approved competencies. There is no `COMP-SVC-001` style identifier
  anywhere.
- **No hard / soft competency distinction.** The hard/soft dichotomy
  is absent from schema and code.
- **No competency category / taxonomy.** No `category` enum, no
  taxonomy table. (`Position.category` is RESTAURANT role, unrelated.)
- **No competency literature references.** No `source` field stores a
  literature citation on any competency-like entity.

### 4.2 Indicator-level absence

- **No `BehavioralIndicator` entity.** No table, no type, no field.
- **No `behavioralIndicators` field** on `Position`, `Vacancy`,
  `EvaluationTemplate`, `InterviewSchedule`, `EvaluationResult`, or any
  other model.

### 4.3 Job-linkage absence

- **No competency fields on `Position`** (L122-143): fields are id,
  title, sector, category, description, hasKnowledgeTest, companyId,
  active, status, createdAt, updatedAt. Relations: company,
  evaluationTemplates, invitations, sessions, results, interviews,
  knowledgeAssessments. **Zero competency links.**
- **No competency fields on `Vacancy`** (L328-347): fields are id,
  title, slug, description, sector, status, includePsicometrica,
  includePsicologica, includeIntegridad, maxVideoSeconds, companyId,
  createdAt, updatedAt. Relations: company, questions, applications,
  knowledgeAssessments. **Zero competency links.**
- **No `JobCompetency` link entity.** No junction table, no junction
  type, no junction field.

### 4.4 Interview / evidence-collection absence

- **No structured interview question bank.** No `InterviewQuestion`
  model, no `interviewTemplateId`, no competency-anchored question.
- **No rubric.** No `Rubric` entity, no `rubric` field, no `rubricId`.
  `rg -i rubric src/ prisma/` returns 0 matches.
- **No evidence types per competency.** No `evidenceTypes` field
  (INTERVIEW / OBSERVATION / WORK_SAMPLE / SJT / DOCUMENT).

### 4.5 Decision-layer absence (already confirmed by A-04.5 / A-05.3)

- **No competency input to `overallScore`.**
  `rg -i competency src/lib/overall-score.ts` = 0 matches.
- **No competency input to `JobFit`.** `JobFit` does not exist as an
  entity in the schema (only as a comment field concept in `overall-score.ts`);
  no competency field on it.
- **No competency input to `recommendation`.** Recommendation is
  guidance-only (A-04.3/A-04.4) and uses no competency signal.

### 4.6 Governance absence

- **No competency approval lifecycle.** No `status` field on a
  Competency row; no DRAFT/REVIEW/APPROVED/ACTIVE/SUSPENDED/RETIRED
  graph for competencies. (The lifecycle exists for `KnowledgeItemVersion`
  per A-03.5; it does NOT exist for competencies.)
- **No `approvedBy` on any competency entity.** No human approver
  identity is stored anywhere for a competency decision.
- **No `AI_DRAFT_ORIGIN` provenance for competencies.** A-03.5 enforces
  this for Knowledge items; the same provenance field does not exist
  for competencies.

---

## 5. Conclusion — Competencies = NO_METHOD (confirmed)

The audit confirms, by direct code/schema inspection, the claim that
A-06.1 recorded in its worklog entry ("Competencies = NO_METHOD"):

> **EvaluHR has NO competency model.**

What it has, instead, is:

1. A 10-item Likert self-report battery (`PSICOLOGICA_QUESTIONS`)
   mislabeled as "competencias psicológicas" in UI/seed copy. This is a
   latent-trait self-report instrument adjacent to personality — not a
   competency catalog. It produces 0-100 scores; A-06.1 forbids
   competency scores. It has no behavioral indicators, no job linkage,
   no versioning, no approval.
2. A scheduling record (`InterviewSchedule`) with no question content,
   no rubric, no competency linkage. It is a calendar entry, not a
   structured interview.
3. Eleven lines of Spanish prose using the word "competencias" in its
   everyday sense ("skills/abilities"). Not an entity, not a field.

Everything a real competency module would need — the `Competency`
entity, `JobCompetency` link, `BehavioralIndicator`, structured
interview question bank, rubric, evidence types, taxonomy, approval
lifecycle, governance, AI-draft provenance, versioning, JobFit linkage
— is **absent** from schema and code.

**This is the correct BEFORE state for A-06.2.** PASO 2 (`02-definition.md`)
defines the canonical structures (`Competency`, `JobCompetency`) that
will close this gap. PASO 2 is documentation-only: it does **not**
modify `prisma/schema.prisma` or any source file. The schema migration
itself is gated to a future A-06.x implementation phase.

---

## 6. Provenance and immutability of this audit

- **Created by:** Task 1-a (general-purpose subagent) under A-06.2 PASO 1.
- **Source inputs:** repository state at A-06.2 task start; A-06.1
  dossiers (`competency-definition.md`, `competency-framework.md`,
  `behavioral-indicators.md`, `job-linkage.md`, `evidence-model.md`,
  `structured-interview.md`, `recommended-model.md`); A-05.3 Personality
  V1 dossier (PSICOLOGICA retention context); A-03.5 Knowledge canónico
  dossier (lifecycle + provenance pattern).
- **Method:** read-only Grep and Read over `src/`, `prisma/`. No file
  was modified.
- **Status:** AUDIT — locked at A-06.2 PASO 1 publication. The audit
  reflects the repository at the time of reading; subsequent A-06.2
  steps that modify schema/code will record the AFTER state in their
  own deliverables, not by mutating this file.
- **Cross-reference:** `02-definition.md` (PASO 2 — canonical structures);
> A-06.1 `competency-definition.md` (the WHAT); A-06.1
> `competency-framework.md` (the structural predecessor).
