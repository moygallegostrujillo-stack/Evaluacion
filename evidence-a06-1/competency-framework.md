# A-06.1 — Competency Framework

> Phase A-06.1 · Task 1-a · DOCUMENTATION-ONLY (no source code modified)
> Expediente: `/home/z/my-project/evidence-a06-1/`
> Companion file: `competency-definition.md` (defines WHAT a competency is);
> this file defines the conceptual STRUCTURE of a Competency record.
> Prerequisite reads: worklog A-04.1 → A-05.3; A-03.5 canonical Knowledge
> model (versioning, AI boundaries, status lifecycle).

---

## 1. Purpose

This document defines the **conceptual structure of a Competency** as a
first-class, governable entity in EvaluHR. It is the structural counterpart
to `competency-definition.md`:

- `competency-definition.md` → *what* a competency is (construct, scope, boundaries).
- `competency-framework.md` (this file) → *how* a competency is structured,
  versioned, governed, and lifecycle-controlled.

This file deliberately does **not** specify scoring, weights, or
cut-points (see §6).

The structural pattern is inherited from the Knowledge canónico model
(A-03.5): immutable published versions, SYSTEM-only approval transitions,
`source = AI_DRAFT_ORIGIN` for AI-drafted content, human-only approval,
historical immutability. The Competency framework extends that discipline
to the competency construct.

---

## 2. The Competency structure (reference model)

The Competency is the unit that gets reviewed, approved, versioned, and
attached (or not) to jobs. The schema below is the **canonical reference
structure**. It is intentionally lean: every field exists because it
carries governance weight or operational meaning.

```ts
type CompetencyStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "RETIRED";

type CompetencySource =
  | "HUMAN"
  | "AI_DRAFT_ORIGIN"   // drafted by IA, requires human approval before ACTIVE
  | "LITERATURE"        // Spencer & Spencer, McClelland, Boyatzis, CONOCER, etc.
  | "SYSTEM_DERIVED";   // derived from a job-analysis artifact (future phase)

interface Competency {
  competencyId: string;                 // stable opaque identifier (cuid-style)
  name: string;                         // short human-readable label, e.g. "Ethical decision-making"
  definition: string;                   // one-paragraph operational definition
  behavioralIndicators: string[];       // observable behaviors (the iceberg tip)
  jobRelevance: string;                 // narrative: how this competency links to job performance
  source: CompetencySource;             // provenance of the draft content
  version: string;                      // e.g. "COMP-v1"; bumped on content change (see §3)
  status: CompetencyStatus;             // lifecycle state (see §4)
  approvedBy: string;                   // human reviewer identity; NEVER an AI (see §5)
}
```

### 2.1 Field-by-field explanation

| Field | Type | Meaning | Constraints |
|---|---|---|---|
| `competencyId` | `string` | Stable opaque identifier. Used as the foreign key from any job-competency link, evidence item, or candidate-competency record. | Immutable for the lifetime of the competency. Two competencies with different `version` but the same `name` may share `competencyId` if and only if the new version supersedes the old (see §3.4). |
| `name` | `string` | Short human-readable label. Used in UI, reports, exports. | Must be unique within a tenant **per active version**. A retired version's name may be reused by its successor (lineage preserved, mirroring A-03.5 §3.4). |
| `definition` | `string` | One-paragraph operational definition: what behavior this competency covers, in what context, with what observable signature. | Must be written in behavioral terms (per `competency-definition.md` §3). A definition that describes a latent trait, a test score, a credential, or a personality factor is **not valid** and cannot pass REVIEW. |
| `behavioralIndicators` | `string[]` | Ordered list of **observable behaviors** that operationalize the competency. Each indicator describes what a person *does* (verbal, non-verbal, procedural, decisional) in a job-relevant situation. | Minimum 1 indicator for DRAFT; minimum 3 for REVIEW (a competency that cannot be evidenced by ≥3 distinct behaviors is too thin to govern). Each indicator must be assessable through evidence (interview, SJT, work sample, structured observation). Indicators are NOT scoring rubrics — they describe behavior, not quality levels. |
| `jobRelevance` | `string` | Narrative field explaining how this competency is linked to effective or superior performance in a defined job context. | Must name the job family / role context and the behavioral-performance link (Spencer & Spencer 1993; Boyatzis 1982). A competency with no `jobRelevance` narrative cannot pass REVIEW — it would be a personality descriptor, not a competency (see differentiation table in `competency-definition.md` §4). |
| `source` | `CompetencySource` | Provenance of the draft content. | `HUMAN` = authored by a human reviewer; `AI_DRAFT_ORIGIN` = drafted by the AI assistant (mirrors A-03.5 §13); `LITERATURE` = directly transcribed from a published competency model (Spencer & Spencer, CONOCER, etc.); `SYSTEM_DERIVED` = derived from a job-analysis artifact in a future phase. `AI_DRAFT_ORIGIN` content **cannot** transition to ACTIVE without human approval (see §5). |
| `version` | `string` | Version label of the form `COMP-v{n}`. | Bumped **only** on substantive content change to `definition`, `behavioralIndicators`, or `jobRelevance` (see §3). Cosmetic edits (typos, formatting) bump a sub-version `COMP-v{n}.{m}` if logged at all. Published versions are immutable (see §3.1). |
| `status` | `CompetencyStatus` | Lifecycle state of this version. | Transitions are restricted to the graph in §4. Only one ACTIVE version per `competencyId` may exist at a time. |
| `approvedBy` | `string` | Identity of the human reviewer who transitioned this version to APPROVED (and onward to ACTIVE). | **NEVER** an AI identity. Mirrors the A-03.5 / A-05.3 rule: IA is draft-only (`AI_DRAFT_ORIGIN`); publication and approval are human acts (see §5). |

### 2.2 What the structure deliberately does NOT include

| Excluded field | Reason |
|---|---|
| `score`, `weight`, `percentile`, `cutPoint`, `level` (Beginner/Intermediate/Advanced) | A-06.1 is definition + structure only. Scoring is out of scope (see §6). Mirrors the rule that A-04.5 excluded Integrity from `overallScore` until evidence is approved. |
| `passFail`, `band`, `aptoNoApto` | Same as above. A competency record is a construct definition, not a decision. |
| `linkedInstruments[]`, `linkedJobs[]` | Job-competency and instrument-competency links are **separate entities**, defined in a future A-06.x phase. A Competency record stands alone. |
| `aiConfidence`, `aiGeneratedAt` | The `source` field already captures AI provenance (`AI_DRAFT_ORIGIN`). AI metadata that could be misread as a quality signal is deliberately absent — the AI does not get to "score" its own draft. |
| `tenantId` | Multi-tenancy is handled at the row-level-security layer (RLS) as in the rest of the codebase; it is not part of the conceptual structure shown here. The implementation will inherit the tenant from the request context. |

---

## 3. Versioning rules

The versioning discipline mirrors the Knowledge canónico model in A-03.5 §3
("Reglas de versionado"). The objective is the same: **published competencies
are immutable; changes create new versions, they do not mutate existing
rows.**

### 3.1 Published immutability

Once a Competency record reaches `status = APPROVED` (and onward to ACTIVE),
its content fields (`name`, `definition`, `behavioralIndicators`,
`jobRelevance`, `source`, `version`) are **immutable**. Any change to a
content field requires creating a new `Competency` record with a bumped
`version`. This is the same invariant A-03.5 enforces for
`KnowledgeItemVersion` ("Inmutable tras publicación; bump solo por cambio de
contenido").

### 3.2 What triggers a version bump

A `version` bump from `COMP-v{n}` to `COMP-v{n+1}` is required when **any**
of the following content fields change in substance:

1. **`definition`** — rewording that alters the operational meaning of the
   competency (not a typo fix).
2. **`behavioralIndicators`** — adding, removing, or rewriting an
   indicator. Reordering alone does NOT bump the major version (the set of
   behaviors is unchanged); it is logged as `COMP-v{n}.1` if logged at all.
3. **`jobRelevance`** — change to the job family, role context, or the
   performance link narrative.
4. **`name`** — a renamed competency is effectively a new competency if the
   construct changes; if the rename is purely cosmetic (e.g.ES/EN
   translation), bump minor version and keep lineage.

### 3.3 What does NOT trigger a version bump

- Changes to `status` (lifecycle transitions are not version bumps — see §4).
- Changes to `approvedBy` (governance metadata travels with the version; a
  re-approval by a different reviewer creates a new audit row but does not
  bump `version`).
- Cosmetic edits (typos, punctuation, whitespace) that do not alter meaning.
- Translation of `name` / `definition` into another language (handled as a
  parallel localized record linked by `competencyId`, not a version bump).

### 3.4 Supersession and lineage

When a new version `COMP-v{n+1}` is published (transitions to ACTIVE), the
previous version `COMP-v{n}` transitions to RETIRED. The retired version
**remains in the database, immutable, for historical traceability** —
exactly as A-03.5 §3 rule 5 specifies ("historical immutability: filas ya
congeladas nunca se modifican ni reinterpretan").

Any candidate evidence, assessment, or historical record that referenced
`COMP-v{n}` keeps that reference; it is **not silently migrated** to the
new version. This prevents retrospective reinterpretation of past evidence
under a new definition.

### 3.5 Versioning example (illustrative)

```
competencyId:  cm_abc123
name:          "Ethical decision-making"
version:       COMP-v1     status: RETIRED    approvedBy: jane.doe@example.org
version:       COMP-v2     status: ACTIVE     approvedBy: jane.doe@example.org
```

`COMP-v1` and `COMP-v2` are two separate rows. `COMP-v1` is preserved
exactly as published; `COMP-v2` is the version used by any ACTIVE job link
or assessment going forward. Records created while `COMP-v1` was ACTIVE
keep pointing at `COMP-v1`.

### 3.6 The `version` field is NOT a scoring or evidence version

Note (and reinforce): `version = COMP-v{n}` is a **content version** of the
competency definition. It is not a scoring version (no scoring exists in
A-06.1) and not an evidence version (evidence is captured per-candidate,
per-assessment, in a separate entity defined in a future phase). This
mirrors A-03.5's separation of `blueprintVersion` (structure) from
`assessmentVersion` (instrument) from `scoringVersion` (PUB-KS-v1) from
`evidenceStatus` (per-result).

---

## 4. Status lifecycle

```
        ┌────────┐  submit for review
        │ DRAFT  │ ─────────────────────►  ┌────────┐
        └────────┘                          │ REVIEW │
           ▲                                 └────┬───┘
           │                                      │ approve (human only)
           │                                      ▼
           │  reject (returns to DRAFT)        ┌──────────┐
           │◄─────────────────────────────────│ APPROVED │
           │                                  └────┬─────┘
           │                                       │ activate (human only)
           │                                       ▼
           │                                  ┌────────┐  suspend (human only)
           │                                  │ ACTIVE │ ─────────────►  ┌───────────┐
           │                                  └────┬───┘                  │ SUSPENDED │
           │                                       │                       └─────┬─────┘
           │                                       │ reactivate                 │
           │                                       │ ◄─────────────────────────┘
           │                                       │
           │                                       │ retire (human only,
           │                                       │   typically when a new
           │                                       │   version supersedes)
           │                                       ▼
           │                                  ┌─────────┐
           └──────────────────────────────────│ RETIRED │  (terminal)
                                              └─────────┘
```

### 4.1 Transition table

| From | To | Trigger | Permitted actor | Notes |
|---|---|---|---|---|
| (new) | `DRAFT` | Create competency | Human reviewer; AI may draft with `source = AI_DRAFT_ORIGIN` (never to a higher status) | `approvedBy` is null in DRAFT. |
| `DRAFT` | `REVIEW` | Submit for review | Human reviewer (the author or another human) | AI may **not** submit for review. Locks content fields until REVIEW resolves. |
| `REVIEW` | `APPROVED` | Approve | **Human reviewer only** | `approvedBy` is set to the human reviewer's identity. AI may **never** set APPROVED (mirrors A-03.5 §13; A-05.3 §8). |
| `REVIEW` | `DRAFT` | Reject / request changes | Human reviewer | Returns to DRAFT for editing. The reviewer who rejected is recorded in the audit trail but `approvedBy` remains null. |
| `APPROVED` | `ACTIVE` | Activate (publish for use) | Human reviewer (typically the same or a more senior role) | Makes this version available for job-competency linking. Only one ACTIVE version per `competencyId` at a time; if another version was ACTIVE, it transitions to RETIRED. |
| `APPROVED` | `DRAFT` | Withdraw approval (rare) | Human reviewer | Used when a flaw is found before activation. Audit trail preserves the prior APPROVED snapshot. |
| `ACTIVE` | `SUSPENDED` | Suspend | Human reviewer | Temporary suspension (e.g. evidence challenge, legal hold, pending review). New job links cannot use a SUSPENDED competency; existing links remain intact for traceability but cannot drive new assessments. |
| `SUSPENDED` | `ACTIVE` | Reactivate | Human reviewer | After the cause of suspension is resolved. Requires re-confirmation of `approvedBy`. |
| `SUSPENDED` | `RETIRED` | Retire (terminal) | Human reviewer | When suspension reveals a permanent issue. |
| `ACTIVE` | `RETIRED` | Retire | Human reviewer | Typically when a new version supersedes this one (see §3.4). Terminal state; record preserved immutable for history. |
| `RETIRED` | (any) | — | — | Terminal. **No transitions out of RETIRED.** A retired competency cannot be reactivated; if its construct is needed again, a new `competencyId` (or a new version of the existing one) is created. |

### 4.2 Invariants

1. **Single ACTIVE per `competencyId`.** At most one version of a given
   competency may be ACTIVE at a time. Activating `COMP-v{n+1}` automatically
   retires `COMP-v{n}` (mirrors A-03.5's single-ACTIVE-blueprint rule).
2. **`approvedBy` is non-null from APPROVED onward.** DRAFT and REVIEW
   records have `approvedBy = null`. Once a record transitions to APPROVED,
   `approvedBy` is set and remains set through subsequent transitions
   (ACTIVE, SUSPENDED, RETIRED) — the approver of record is preserved.
3. **AI never crosses into APPROVED.** An AI-drafted competency
   (`source = AI_DRAFT_ORIGIN`) can exist in DRAFT. It cannot transition to
   REVIEW or APPROVED without a human actor performing the transition. The
   `source` field stays `AI_DRAFT_ORIGIN` for the lifetime of the record;
   human approval does not change it (lineage is permanent, mirrors A-03.5
   §13).
4. **RETIRED is terminal.** No record transitions out of RETIRED. This
   guarantees historical traceability (an assessment that referenced a
   retired competency can always be reconstructed).
5. **Status transitions are auditable.** Every transition records: actor
   identity, timestamp, prior status, new status, and reason. The audit
   trail is immutable.

---

## 5. Governance — who can do what

The competency module inherits the project-wide governance rules
established in A-03.5 (Knowledge canónico §13 "IA"), A-04.5 (overall-score
governance), and A-05.3 (Personality AI boundaries §8):

### 5.1 Roles

| Role | Who | Can do | Cannot do |
|---|---|---|---|
| **Author (Human)** | A human reviewer (RH analyst, psychometric lead, or methodologist) | Create DRAFT competencies; edit DRAFT; submit to REVIEW; reject REVIEW → DRAFT; approve REVIEW → APPROVED; activate; suspend; reactivate; retire. | Bypass REVIEW; mutate a published (APPROVED/ACTIVE/SUSPENDED/RETIRED) record's content fields; delete RETIRED records. |
| **Reviewer (Human)** | A human reviewer (typically distinct from the author for segregation of duties) | Approve REVIEW → APPROVED; reject REVIEW → DRAFT; activate; suspend; retire. | Self-approve their own draft (segregation of duties recommended — same pattern as A-03.5). |
| **IA (draft assistant)** | The AI subsystem (z-ai-web-dev-sdk or equivalent) | Draft DRAFT competencies with `source = AI_DRAFT_ORIGIN`; propose behavioral indicators, definitions, jobRelevance narratives as draft text. | Submit to REVIEW; approve; activate; suspend; retire; modify any record with `status ≠ DRAFT`; set `approvedBy`; transition any state; touch the audit trail. |
| **SYSTEM (publication authority)** | The server-side canonical layer (mirrors `SYSTEM:KNOWLEDGE_FREEZE` in A-03.5) | Enforce invariants (single ACTIVE per `competencyId`, immutability of published content, audit trail integrity). | Override human decisions; approve competencies; bypass transitions. |

### 5.2 The `approvedBy` rule (restated for emphasis)

`approvedBy` is set **only** by a human reviewer at the REVIEW → APPROVED
transition. It is never null for records in APPROVED, ACTIVE, SUSPENDED, or
RETIRED. It is never set by the AI. The `source = AI_DRAFT_ORIGIN` field
remains on the record for its entire lifetime as **permanent provenance**:
human approval of an AI draft does not erase the fact that the original
draft was AI-generated. This is identical to the A-03.5 §13 rule for
Knowledge items.

### 5.3 Segregation of duties (recommended)

For competencies that will drive hiring decisions (i.e. competencies that
may eventually feed `JobFit` or `recommendation` in a future phase), the
**author** of a DRAFT and the **reviewer** who approves it should be
different humans. This mirrors the recommended practice in A-03.5 (where
`SYSTEM:KNOWLEDGE_FREEZE` performs the publication, not the RH user who
authored the questions). This is **recommended** rather than enforced at
the data-model level in A-06.1; enforcement is a future-phase concern.

### 5.4 Tenant isolation

Multi-tenancy is enforced at the row-level-security (RLS) layer, as in
the rest of EvaluHR. Competency records are tenant-scoped: a competency
created in tenant A is invisible to tenant B. Cross-tenant competency
libraries (e.g. a shared CONOCER-derived catalog) are a future-phase
concern and are out of scope of A-06.1.

---

## 6. Explicit non-goals — NO scoring in A-06.1

This framework deliberately does **not** define any of the following. Each
omission is intentional and is gated to a future, separately-evidenced
phase:

| Excluded | Reason / gating |
|---|---|
| A 0–100 numeric `competencyScore` | A competency is inferred from behavioral evidence, not a test score (`competency-definition.md` §5). Defining a score requires an evidence model, a psychometric validation, and a Mexican-context study (mirrors the A-05.2 reasoning that rejected Big Five for V1). |
| `weight` (relative importance of one competency vs. another, or vs. other instruments) | Weights belong to a scoring layer (e.g. JobFit), not to the competency construct. A-06.1 defines the construct, not its weighting. |
| `cutPoint` (threshold for "pass" or "meets") | Cut-points imply a decision (`APTO/NO APTO`), which A-06.1 explicitly does not define. Mirrors A-04.3/A-04.4 finding that `recommendation` is guidance-only. |
| `level` / band (Beginner/Intermediate/Advanced, or 1–5 scale) | Level labels are scoring artifacts. Their absence is intentional; adding them requires the same evidence dossier as a numeric score. |
| Connection to `overallScore` / `JobFit` / `recommendation` | The competency module is **decoupled** from the decision layer until a separate phase authorizes the link. Mirrors how A-04.5 isolated Integrity (`INTEGRITY_NOT_APPROVED_FOR_OVERALL`) and A-05.3 isolated Personality (`PERSONALITY_NOT_APPROVED_FOR_V1`): a construct without approved evidence does not feed any decision. |
| New instruments, question batteries, or tests | A-06.1 is framework-only. Instruments (interview guides, SJTs, work-sample protocols) that *collect evidence for* a competency are defined in a future phase. |

### 6.1 The "no-evidence ≠ zero" rule (inherited)

Just as `KnowledgeResult.knowledgeScore` is `null` (not `0`) when evidence
is INSUFFICIENT (A-03.5), and just as Integrity is excluded (not zeroed)
from `overallScore` (A-04.5), a competency with insufficient behavioral
evidence is reported as **INSUFFICIENT**, never as a zero score. The
"no-evidence ≠ zero-evidence" rule is a project-wide invariant. A-06.1
inherits it without modification.

### 6.2 What happens when scoring IS eventually added

If and when a future A-06.x phase introduces scoring, the scoring layer
will be a **separate entity** linked to the Competency by `competencyId`
+ `version` — never a field on the Competency record itself. The Competency
record (as defined in §2) remains the immutable construct definition; the
scoring layer carries its own version (e.g. `COMP-SCORE-v1`), its own
governance, and its own evidence dossier. This mirrors the A-03.5
separation of `KnowledgeBlueprint` (construct) from `KnowledgeAssessment`
(instrument) from `KnowledgeResult` (evidence/score).

---

## 7. Boundary statements (what A-06.1 explicitly does NOT do)

- Does **not** modify `prisma/schema.prisma`, `schema.prod.prisma`, any
  file under `src/`, `scripts/`, or `public/`.
- Does **not** introduce a `Competency` Prisma model. The structure in §2
  is a **reference model** for the conceptual entity; the schema migration
  is a future-phase concern.
- Does **not** connect competencies to `overallScore`, `JobFit`,
  `recommendation`, the canonical engine, the Knowledge model, the
  Integrity model, or the Personality model.
- Does **not** introduce instruments, items, or evidence-collection
  artifacts.
- Does **not** modify the contract or the aviso de privacidad.
- Does **not** authorize the AI to approve, activate, suspend, or retire
  any competency. The AI remains draft-only (`AI_DRAFT_ORIGIN`), mirroring
  A-03.5 §13, A-04.5, and A-05.3 §8.

---

## 8. Provenance and immutability of this document

- **Created by:** Task 1-a (general-purpose subagent) under A-06.1.
- **Source inputs:** worklog A-04.1 → A-05.3; A-03.5 canonical Knowledge
  model (versioning, AI boundaries, status lifecycle); A-04.5 overall-score
  governance; A-05.2/A-05.3 Personality V1 dossier; Spencer & Spencer (1993)
  iceberg model; CONOCER (Mexico) institutional reading.
- **Foundational references:** McClelland (1973); Spencer & Spencer (1993);
  Boyatzis (1982); CONOCER (Mexico).
- **Status:** FRAMEWORK — locked at A-06.1 publication. Changes require a
  new A-06.x task with explicit version bump.
- **Cross-reference:** `competency-definition.md` (the WHAT); this file is
  the HOW (structure, versioning, lifecycle, governance).
