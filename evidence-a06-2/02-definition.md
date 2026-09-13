# A-06.2 — 02 · Definición Canónica (PASO 2)

> Phase A-06.2 · Task 1-a · DOCUMENTATION-ONLY (no source code modified)
> Expediente: `/home/z/my-project/evidence-a06-2/`
> Companion file: `01-before-audit.md` (PASO 1 — before state, code-verified).
> Prerequisite reads: worklog A-04.1 → A-06.1; A-06.1
> `competency-definition.md` (the WHAT); A-06.1 `competency-framework.md`
> (the A-06.1 reference structure); A-03.5 `02-canonical-model.md` and
> `03-blueprint.md` (versioning + AI-boundary patterns that A-06.2 inherits).

---

## 1. Purpose

PASO 1 (`01-before-audit.md`) confirmed by code inspection that
EvaluHR has **no competency model today**. PASO 2 (this file) defines the
**canonical structures** that close that gap:

- **`Competency`** — the construct record (what a competency is, as data).
- **`JobCompetency`** — the link record (which competency is required for
  which job, and how strongly).

These two structures are the minimum viable competency substrate. They
deliberately do **not** include scoring, weights, cut-points, or level
bands — see §5 (what is NOT in the structure). They also do not, in
PASO 2, modify `prisma/schema.prisma` or any source file: this is
**definition-only**. The schema migration is gated to a future A-06.x
implementation phase, exactly as A-06.1 was framework-only.

PASO 2 evolves the A-06.1 framework in three disciplined ways
(see §1.1 — nothing here contradicts A-06.1; everything is an
additive specialization).

### 1.1 What changes from A-06.1 (and what does not)

| Aspect | A-06.1 (`competency-framework.md` §2) | A-06.2 (this file §2) | Change type |
|---|---|---|---|
| `competencyId` format | opaque cuid (`cm_abc123`) | human-readable code (`COMP-SVC-001`) | **Specialization** — code is opaque to candidates but human-reviewable by RH. Cuid-style fallback permitted for system-generated rows; both formats coexist. |
| `behavioralIndicators` type | `string[]` (inline text) | `string[]` (IDs referencing a `BehavioralIndicator` entity) | **Promotion** — indicators become a separate entity so evidence can link to a specific indicator. Inline-text fallback preserved for DRAFT. |
| `jobRelevance` | on `Competency` (narrative string) | removed from `Competency`; lives on `JobCompetency` as `rationale` + `jobRelevance` enum | **Refactor** — job-relevance is per-(job, competency) pair, not a property of the competency itself. |
| `approvedBy` | on `Competency` | on `JobCompetency` (Competency remains pure definition) | **Refactor** — competency definitions are approved at catalog level; job links are approved per-job. |
| `evidenceTypes` | not in A-06.1 | added (`INTERVIEW \| OBSERVATION \| WORK_SAMPLE \| SJT \| DOCUMENT`) | **Addition** — formalizes which evidence types may speak to this competency. |
| `source` | enum (`HUMAN \| AI_DRAFT_ORIGIN \| LITERATURE \| SYSTEM_DERIVED`) | string (literature / practice origin) | **Relaxation** — Competency.source is a free-form citation string on the catalog record; `JobCompetency.source` (§3) is the enum-like classifier. |
| `version`, `status` | `COMP-v{n}`, `DRAFT…RETIRED` | same | **Unchanged** — A-06.1 lifecycle inherited verbatim. |

Nothing in A-06.2 invalidates A-06.1. A-06.1 is the WHAT and the
conceptual spine; A-06.2 is the canonical **data structure** that
operationalizes it. Where A-06.1 said "the Competency has a
`jobRelevance` narrative field", A-06.2 says "the job-relevance lives on
the JobCompetency link, not on the Competency". These are compatible:
A-06.1 did not define `JobCompetency` (it explicitly deferred it as a
"separate entity, defined in a future A-06.x phase"). This is that future
phase.

---

## 2. The `Competency` structure (canonical)

```ts
type CompetencyStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "RETIRED";

type EvidenceType =
  | "INTERVIEW"      // structured interview (BDI / STAR probes)
  | "OBSERVATION"    // structured on-the-job or simulation observation
  | "WORK_SAMPLE"    // work sample / product artifact
  | "SJT"            // situational judgment test (deferred post-V1 per A-06.1)
  | "DOCUMENT";      // verifiable documentary evidence (cert, portfolio)

interface Competency {
  competencyId: string;            // e.g. "COMP-SVC-001"
  name: string;                     // e.g. "Servicio al cliente"
  definition: string;               // formal operational definition
  behavioralIndicators: string[];   // IDs referencing BehavioralIndicator entity
  evidenceTypes: EvidenceType[];     // which evidence types may speak to this competency
  source: string;                    // literature / practice origin (free-form citation)
  version: string;                   // e.g. "COMP-v1"
  status: CompetencyStatus;          // lifecycle state (see A-06.1 framework §4)
}
```

### 2.1 Field-by-field explanation

| Field | Type | Meaning | Constraints / Notes |
|---|---|---|---|
| `competencyId` | `string` | Stable, human-readable identifier. Format: `COMP-<DOMAIN>-<NNN>`, e.g. `COMP-SVC-001` (Servicio al cliente), `COMP-ETH-002` (Toma de decisiones éticas), `COMP-TEAM-003` (Colaboración efectiva). The `<DOMAIN>` segment is a 2–4 letter mnemonic (SVC, ETH, TEAM, LDR, ADP, etc.) chosen at creation; it is **not** a foreign key to a separate taxonomy (no category entity exists in A-06.2). The numeric segment is zero-padded and monotonically increasing within a domain. | Immutable for the lifetime of the competency. Two versions of the same competency (`COMP-v1`, `COMP-v2`) share the same `competencyId`; the version field distinguishes them. System-generated rows may also use a cuid-style fallback (`cm_…`) — both formats coexist; the `competencyId` is opaque to candidates and only surfaced to RH reviewers. |
| `name` | `string` | Short human-readable label, in Spanish (EvaluHR's primary candidate-facing language). E.g. "Servicio al cliente", "Toma de decisiones éticas", "Colaboración efectiva". | Must be unique within a tenant **per active version**. A retired version's name may be reused by its successor (lineage preserved, mirrors A-03.5 §3.4). The name is a label, not a definition — see `definition`. |
| `definition` | `string` | One-paragraph formal operational definition. Must describe: (a) the observable behavior this competency covers; (b) the job context in which it is expressed; (c) the observable signature by which it is evidenced. | Must be written in behavioral terms (per A-06.1 `competency-definition.md` §3). A definition that describes a latent trait, a test score, a credential, or a personality factor is **not valid** and cannot pass REVIEW. Minimum length: 1 paragraph (no upper limit; verbose definitions are acceptable for governance clarity). |
| `behavioralIndicators` | `string[]` | Ordered list of IDs referencing `BehavioralIndicator` records. Each indicator is an observable behavior (verbal, non-verbal, procedural, decisional) that operationalizes this competency. | Minimum 1 indicator for DRAFT; minimum 3 for REVIEW (A-06.1 framework §2.1). Each ID must resolve to an existing `BehavioralIndicator` row; dangling IDs fail REVIEW validation. Indicators describe **behavior**, not quality levels — they are NOT scoring rubrics. Reordering the array does NOT bump the major version (the set is unchanged); adding/removing/rewriting an indicator DOES (see §6.2). Inline-text form (array of free-text strings, A-06.1 style) is permitted only for DRAFT rows that predate the `BehavioralIndicator` entity; REVIEW requires proper ID references. |
| `evidenceTypes` | `EvidenceType[]` | The set of evidence types that may legitimately speak to this competency. Constrains the evidence-collection layer: an evidence item of type not in this set is REJECTED at intake, not silently stored. | Minimum 1 entry. The set must be non-empty for REVIEW. Common combos: `{INTERVIEW, OBSERVATION}` for behavioral competencies; `{INTERVIEW, WORK_SAMPLE, DOCUMENT}` for technical competencies; `{SJT}` only for judgment competencies (SJT deferred post-V1 per A-06.1). Modifying the set after APPROVED is a version bump (the evidence admissibility changed). |
| `source` | `string` | Free-form citation string: literature reference (Spencer & Spencer 1993, p.X; CONOCER NTCL-XXXX; Boyatzis 1982, ch.Y), practice origin ("RH dept job-analysis 2026-09"), or `AI_DRAFT_ORIGIN:<model>:<run-id>` for AI-drafted competencies. | Required for REVIEW. AI-drafted content MUST prefix with `AI_DRAFT_ORIGIN:` — this preserves the A-03.5 §13 / A-05.3 §8 provenance rule: human approval does not erase AI authorship. `AI_DRAFT_ORIGIN:` content cannot transition to ACTIVE without human approval (see §6.5). |
| `version` | `string` | Version label of the form `COMP-v{n}`. Bumped on substantive content change (see §6.2). | Cosmetic edits bump a minor version `COMP-v{n}.{m}`. Published versions (APPROVED onward) are immutable (see §6.1). |
| `status` | `CompetencyStatus` | Lifecycle state. Inherited **verbatim** from A-06.1 framework §4: DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED. Transition graph, invariants, and actor permissions are exactly as A-06.1 specified. | See §6.4 for the inherited transition table. Single ACTIVE per `competencyId`. RETIRED is terminal. AI never crosses into APPROVED. |

### 2.2 What is intentionally ABSENT from `Competency`

| Absent field | Reason |
|---|---|
| `score`, `weight`, `percentile`, `cutPoint`, `level` (Beginner/Intermediate/Advanced) | A-06.1 §5: a competency is **inferred from behavioral evidence, not a test score**. Adding any of these is out of scope of A-06.2 and requires a separate evidence dossier. |
| `passFail`, `band`, `aptoNoApto` | Same as above — decisions are out of scope. |
| `linkedJobs[]`, `linkedInstruments[]` | Job linkage lives on `JobCompetency` (§3); instrument linkage is a future-phase concern (A-06.1 explicitly deferred it). The Competency record stands alone as a **construct definition**. |
| `jobRelevance` (narrative) | Moved to `JobCompetency.rationale` + `JobCompetency.jobRelevance` (enum). Job-relevance is per-(job, competency) pair, not a property of the competency itself. A competency can be VALID for one job and INSUFFICIENT for another. |
| `approvedBy` | Lives on `JobCompetency` (per-job approval); the Competency catalog entry is approved at the catalog level by a separate governance step captured in the audit trail (not a field on this record — see §6.5). |
| `aiConfidence`, `aiGeneratedAt` | The `source = "AI_DRAFT_ORIGIN:…"` string already captures AI provenance. AI metadata that could be misread as a quality signal is deliberately absent — the AI does not get to "score" its own draft (mirrors A-06.1 framework §2.2). |
| `tenantId` | Multi-tenancy is enforced at the RLS layer (as in the rest of EvaluHR), not at the conceptual-structure level (mirrors A-06.1 framework §2.2). |
| `category`, `taxonomy` | No competency category entity exists in A-06.2. The `<DOMAIN>` segment of `competencyId` (e.g. `SVC`, `ETH`) is a human-readable mnemonic, NOT a foreign key to a separate taxonomy. A future A-06.x phase may introduce a formal taxonomy; A-06.2 deliberately does not. |

---

## 3. The `JobCompetency` structure (canonical)

```ts
type JobCompetencyRelevance =
  | "VALID"            // the competency is well-evidenced for this job
  | "LIMITED"          // partial evidence; useful but not conclusive
  | "INSUFFICIENT"     // evidence is too thin to support a conclusion (≠ 0; ≠ "absent")
  | "PENDING_REVIEW";  // proposed but not yet human-reviewed

type JobCompetencyCriticality =
  | "CRITICAL"         // absence is disqualifying for the role (still: no auto-veto per A-06.1 risk-analysis)
  | "IMPORTANT"        // strong contributor to performance
  | "STANDARD";        // relevant but not decisive

type JobCompetencySource =
  | "JOB_ANALYSIS"     // derived from a structured job analysis artifact
  | "LITERATURE"       // transcribed from a published competency model for this job family
  | "EXPERT"           // elicited from a domain expert (human SME)
  | "AI_SUGGESTED";   // drafted by the AI assistant; requires human approval before ACTIVE

type JobCompetencyStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "RETIRED";

interface JobCompetency {
  jobId: string;                       // FK to Position | Vacancy
  competencyId: string;                 // FK to Competency
  jobRelevance: JobCompetencyRelevance;  // assessment of the evidence-quality of this link
  rationale: string;                    // narrative: why this competency is relevant to this job
  criticality: JobCompetencyCriticality; // how strongly this competency weights on this job
  source: JobCompetencySource;           // provenance of the link
  version: string;                       // e.g. "JobCompetency-v1"
  approvedBy: string;                    // human reviewer identity; NEVER an AI
  status: JobCompetencyStatus;           // lifecycle state (mirrors Competency lifecycle)
}
```

### 3.1 Field-by-field explanation

| Field | Type | Meaning | Constraints / Notes |
|---|---|---|---|
| `jobId` | `string` | Foreign key to either `Position` (internal RH job) or `Vacancy` (public-facing job posting). Both are "jobs" in the competency sense. | Polymorphic-ish: the type of job (Position vs Vacancy) is determined by an out-of-band discriminator (e.g. a `jobKind: "POSITION" \| "VACANCY"` field on the implementation row, or separate tables `PositionCompetency` / `VacancyCompetency`). A-06.2 deliberately does NOT prescribe the implementation choice — that is a schema-migration concern for a future A-06.x phase. The conceptual model treats both as `jobId`. |
| `competencyId` | `string` | Foreign key to `Competency.competencyId`. Must reference a Competency whose `status ∈ {ACTIVE}` (a SUSPENDED or RETIRED competency cannot be linked to a new job; existing links remain intact for traceability, mirrors A-06.1 framework §4.1). | FK integrity is enforced at the data layer. A link to a non-ACTIVE competency fails at creation. |
| `jobRelevance` | `JobCompetencyRelevance` | **Assessment of the evidence-quality of the link itself** — not the candidate's evidence (that lives on `CompetencyResult`, a future entity). `VALID` = the link is well-justified by job analysis or literature; `LIMITED` = partial justification; `INSUFFICIENT` = justification is too thin to support the link (but ≠ "no link" — INSUFFICIENT is a real value, mirrors A-03.5 INSUFFICIENT ≠ 0); `PENDING_REVIEW` = proposed but not yet reviewed. | The `INSUFFICIENT ≠ 0` rule from A-03.5/A-04.5/A-06.1 is inherited here: an INSUFFICIENT jobRelevance is NOT equivalent to "the competency is irrelevant". It means "the relevance has not been sufficiently evidenced". The competency may still be relevant; the **evidence of its relevance** is what is INSUFFICIENT. |
| `rationale` | `string` | Narrative field explaining why this competency is relevant to this job. Must name the job family / role context and the behavioral-performance link (Spencer & Spencer 1993; Boyatzis 1982). | Required for REVIEW. A `JobCompetency` with no rationale cannot pass REVIEW — it would be an unjustified assertion. Minimum length: 1 paragraph. The rationale is human-authored (or AI-drafted with `source = AI_SUGGESTED` and later human-edited). |
| `criticality` | `JobCompetencyCriticality` | How strongly this competency weights on this job. `CRITICAL` = absence is disqualifying; `IMPORTANT` = strong contributor; `STANDARD` = relevant but not decisive. | Despite the name, `criticality` is **qualitative**, not a numeric weight. A-06.1 §6 forbids numeric weights; A-06.2 inherits that. CRITICAL/IMPORTANT/STANDARD is a 3-level ordinal, not a continuous weight — and it does NOT translate into a multiplier on `overallScore` (the Competency module is decoupled from `overallScore` per A-06.1 §6). Criticality guides RH reviewer attention and the structured-interview question budget; it does not score the candidate. **Criticality is NOT a veto**: even CRITICAL absence is reported as evidence, not as an automatic rejection (A-06.1 `risk-analysis.md` ALTO risk #4: "veto automático" is explicitly forbidden). |
| `source` | `JobCompetencySource` | Provenance of the link. `JOB_ANALYSIS` = derived from a structured job-analysis artifact; `LITERATURE` = transcribed from a published competency model for this job family (e.g. Spencer & Spencer's generic manager model; CONOCER NTCL for a specific Mexican job); `EXPERT` = elicited from a domain SME (human); `AI_SUGGESTED` = drafted by the AI assistant. | `AI_SUGGESTED` content **cannot** transition to ACTIVE without human approval. The `source` field is permanent provenance: human approval does not change it (mirrors A-03.5 §13; A-05.3 §8). |
| `version` | `string` | Version label of the form `JobCompetency-v{n}`. Bumped on substantive content change (see §6.2). | Cosmetic edits bump a minor version `JobCompetency-v{n}.{m}`. Published versions are immutable (see §6.1). Note: `JobCompetency-v{n}` is the **link** version, independent of the linked `Competency.version` (which is `COMP-v{m}`) and of the linked `Competency.status` lifecycle. See §6.6. |
| `approvedBy` | `string` | Identity of the human reviewer who transitioned this link to APPROVED. **NEVER** an AI identity. | Required from APPROVED onward; null in DRAFT/REVIEW. The approver of record is preserved through ACTIVE/SUSPENDED/RETIRED (mirrors A-06.1 framework §4.2 invariant 2). |
| `status` | `JobCompetencyStatus` | Lifecycle state. Identical transition graph to `Competency.status`: DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED. | Inherited from A-06.1 framework §4. Single ACTIVE per (jobId, competencyId) pair. RETIRED is terminal. AI never crosses into APPROVED. See §6.4. |

### 3.2 What is intentionally ABSENT from `JobCompetency`

| Absent field | Reason |
|---|---|
| `weight` (numeric, e.g. 0.3 or 30%) | A-06.1 §6 forbids numeric weights. Criticality is a 3-level ordinal, not a multiplier. |
| `requiredScore`, `cutPoint`, `passThreshold` | Decisions are out of scope. A-06.1 §6 forbids cut-points. |
| `level` required (e.g. "must demonstrate at ADVANCED level") | Level labels are scoring artifacts. Their absence is intentional (A-06.1 §6). |
| `aiConfidence`, `aiGeneratedAt` | `source = AI_SUGGESTED` already captures AI provenance. |
| `evaluationResult`, `score` | The candidate's evidence is captured per-(candidate, competency) in a separate `CompetencyResult` entity (future phase), not on the link record. |

---

## 4. Relationship: Job → JobCompetency → Competency → BehavioralIndicator → Evidence

```
                                 ┌──────────────────┐
                                 │      Position    │
                                 │   (RH internal)  │
                                 └────────┬─────────┘
                                          │
                                 ┌────────▼─────────┐
                                 │      Vacancy      │
                                 │  (public posting) │
                                 └────────┬─────────┘
                                          │
                                  jobId ──┤ (FK; Position | Vacancy)
                                          │
                                 ┌────────▼─────────┐
                                 │   JobCompetency   │  (the LINK: per-job × per-competency)
                                 │  ───────────────  │
                                 │  jobId            │
                                 │  competencyId ────┼──┐
                                 │  jobRelevance     │  │
                                 │  rationale        │  │
                                 │  criticality      │  │
                                 │  source           │  │
                                 │  version          │  │
                                 │  approvedBy       │  │
                                 │  status           │  │
                                 └───────────────────┘  │
                                                        │
                                       competencyId ────┘
                                                        │
                                 ┌──────────────────────▼──────────────────────┐
                                 │                Competency                   │  (the CATALOG record)
                                 │              ──────────────                │
                                 │  competencyId  (e.g. COMP-SVC-001)         │
                                 │  name           (e.g. "Servicio al cliente")│
                                 │  definition                                  │
                                 │  behavioralIndicators: string[] ─────┐     │
                                 │  evidenceTypes                        │     │
                                 │  source                               │     │
                                 │  version   (COMP-v1)                  │     │
                                 │  status    (DRAFT..RETIRED)           │     │
                                 └───────────────────────────────────────┼─────┘
                                                                          │
                                                            indicator IDs │
                                                                          │
                                              ┌───────────────────────────▼───────────────────────────┐
                                              │              BehavioralIndicator (entity)              │
                                              │                  (one per indicator ID)                │
                                              │  indicatorId                                           │
                                              │  competencyId  (back-FK)                               │
                                              │  description (observable behavior)                    │
                                              │  …                                                     │
                                              └────────────────────────────┬──────────────────────────┘
                                                                           │
                                                evidence speaks to ────────┤
                                                                           │
                                              ┌───────────────────────────▼───────────────────────────┐
                                              │              Evidence (per candidate)                │
                                              │                  (future entity)                     │
                                              │  evidenceId                                           │
                                              │  candidateId                                          │
                                              │  competencyId  (the competency assessed)              │
                                              │  indicatorId   (which indicator this evidence targets)│
                                              │  evidenceType  (INTERVIEW | OBSERVATION | WORK_SAMPLE │
                                              │                 | SJT | DOCUMENT)                     │
                                              │  evidenceStatus (VALID | LIMITED | INSUFFICIENT |     │
                                              │                  INVALID | PENDING_REVIEW)            │
                                              │  collectedAt                                          │
                                              │  collectedBy  (human reviewer; never AI for status)   │
                                              └───────────────────────────────────────────────────────┘
```

### 4.1 Reading the diagram

1. **Job** is either `Position` (internal RH job) or `Vacancy` (public
   posting). Both expose a `jobId` that `JobCompetency` references.

2. **`JobCompetency`** is the link. It says: "this job requires (or
   benefits from) this competency, at this criticality, for this reason".
   It is **per-(job, competency) pair** — a JobCompetency row is unique
   to one job × one competency. The same competency can be linked to
   100 different jobs, each with a different `criticality` and `rationale`.

3. **`Competency`** is the catalog record. It is **independent of any
   job** — it is the construct definition. One competency, many job links.

4. **`BehavioralIndicator`** is the operationalization of the competency
   into observable behaviors. A Competency has ≥3 indicators. Each
   indicator is the unit that evidence can speak to: a structured
   interview probe, an observation note, a work-sample artifact targets
   a specific indicator, not the whole competency.

5. **`Evidence`** is the per-candidate, per-indicator record (a future
   entity; defined here only to close the chain). Each evidence item
   has its own `evidenceStatus` (VALID/LIMITED/INSUFFICIENT/INVALID/
   PENDING_REVIEW — inherited from A-03.5/A-04.5/A-06.1). The aggregate
   of evidence items per (candidate, competency) yields a qualitative
   competency-evidence level (NO_EVIDENCE / INSUFFICIENT / LIMITED /
   SUPPORTED / STRONG — A-06.1 `evidence-model.md`), which is reported
   but **not** numerically scored.

### 4.2 Cardinalities

| Relationship | Cardinality | Notes |
|---|---|---|
| `Job` → `JobCompetency` | 1 : N | A job has 0..N linked competencies. |
| `Competency` → `JobCompetency` | 1 : N | A competency can be linked to 0..N jobs. |
| `Competency` → `BehavioralIndicator` | 1 : N (min 3 for REVIEW) | A competency has ≥3 indicators. |
| `BehavioralIndicator` → `Evidence` | 1 : N | An indicator has 0..N evidence items per candidate. |
| `JobCompetency` → `Evidence` | none direct | `JobCompetency` does NOT hold evidence. Evidence is collected per-(candidate, competency, indicator), independent of which job the candidate is being considered for. The job context influences which competencies are probed (via JobCompetency links) but evidence itself is competency-anchored, not job-anchored. |

### 4.3 What the chain enforces (and what it deliberately does NOT)

- **Enforces:** every job-competency link has a human-approved rationale
  and a human approver (`approvedBy` is non-null from APPROVED onward).
- **Enforces:** every competency has a behavioral definition (≥3
  indicators) and a constrained set of admissible evidence types.
- **Enforces:** every evidence item has its own status; INSUFFICIENT is
  a real value, not 0; no-evidence ≠ zero-evidence.
- **Does NOT enforce:** any numeric score, weight, cut-point, or
  pass/fail decision. The chain produces **qualitative evidence levels**,
  not scores. The chain does NOT feed `overallScore` or `JobFit` — it
  is decoupled from the decision layer (A-06.1 §6).

---

## 5. What is NOT in the structure (the deliberate non-goals)

This section restates and consolidates the absent-field tables from §2.2
and §3.2 into a single list. Each absence is **intentional** and is
gated to a future, separately-evidenced phase (mirrors A-06.1 §6).

### 5.1 No score, no weight, no cut, no level

| Absent construct | Why absent | Where it would re-enter (if ever) |
|---|---|---|
| Numeric `competencyScore` (0–100) | A competency is inferred from behavioral evidence, not a test score (A-06.1 §5). | A future `CompetencyResult` entity, only after a psychometric validation dossier is approved. |
| `weight` on JobCompetency (e.g. 0.30) | Weights belong to a scoring layer, not to the link record. | A future scoring layer linked by `competencyId + version`, never a field on JobCompetency itself. |
| `cutPoint` / `passThreshold` | Cut-points imply a decision (APTO/NO APTO), which A-06.1 explicitly does not define. | A future decision phase, with its own legal review (REVISIÓN LEGAL per A-04.1/A-05.2). |
| `level` / band (Beginner/Intermediate/Advanced, 1–5 scale) | Level labels are scoring artifacts. | Same as `competencyScore` — requires evidence dossier. |
| `aptoNoApto` / passFail | Decisions are out of scope. | Same as `cutPoint`. |

### 5.2 No connection to `overallScore`, `JobFit`, `recommendation`

The Competency module is **decoupled** from the decision layer until a
separate phase authorizes the link. Mirrors how A-04.5 isolated Integrity
(`INTEGRITY_NOT_APPROVED_FOR_OVERALL`) and A-05.3 isolated Personality
(`PERSONALITY_NOT_APPROVED_FOR_V1`): a construct without approved
evidence does not feed any decision. The same gate applies here:
**`COMPETENCY_NOT_APPROVED_FOR_DECISIONS`** (implicit until a future
A-06.x phase explicitly authorizes the connection, with its own evidence
dossier and legal review).

### 5.3 No new instruments, no question batteries, no SJTs

A-06.2 is **definition-only** for the canonical structures. It does not
introduce:

- A structured-interview question bank (deferred to a future A-06.x
  phase per A-06.1 `structured-interview.md`).
- A behavioral indicator library (the `BehavioralIndicator` entity is
  referenced by ID but its full record structure is defined in a future
  phase, not in this file).
- An SJT (deferred post-V1 per A-06.1 `sjt-analysis.md`).
- A work-sample protocol.
- A documentary-evidence intake form.

### 5.4 No competency taxonomy / category entity

A-06.2 deliberately does **not** introduce a `CompetencyCategory` or
`CompetencyTaxonomy` entity. The `<DOMAIN>` segment of `competencyId`
(e.g. `SVC`, `ETH`, `TEAM`) is a human-readable mnemonic, not a foreign
key. A future A-06.x phase may introduce a formal taxonomy if RH needs
cross-competency grouping; A-06.2 keeps the model flat.

### 5.5 No multi-tenant field on the conceptual structure

Multi-tenancy is enforced at the RLS layer (as in the rest of EvaluHR),
not on the conceptual record. The implementation row will inherit
`companyId` from the request context; the conceptual structure shown
here is tenant-agnostic (mirrors A-06.1 framework §2.2).

---

## 6. Versioning rules

The versioning discipline mirrors the Knowledge canónico model
(A-03.5 §3 "Reglas de versionado") and A-06.1 framework §3. The
objective is unchanged: **published competencies are immutable; changes
create new versions, they do not mutate existing rows.**

### 6.1 Published immutability

Once a `Competency` record reaches `status = APPROVED` (and onward to
ACTIVE, SUSPENDED, RETIRED), its content fields (`name`, `definition`,
`behavioralIndicators`, `evidenceTypes`, `source`, `version`) are
**immutable**. Any change to a content field requires creating a new
`Competency` record with a bumped `version`. The same applies to
`JobCompetency` content fields (`jobRelevance`, `rationale`,
`criticality`, `source`, `version`). This is the same invariant A-03.5
enforces for `KnowledgeItemVersion` and A-06.1 enforces for the
conceptual Competency.

### 6.2 What triggers a version bump

A `version` bump is required when **any** of the following content
fields change in substance:

For `Competency` (bump `COMP-v{n}` → `COMP-v{n+1}`):

1. **`definition`** — rewording that alters the operational meaning of
   the competency (not a typo fix).
2. **`behavioralIndicators`** — adding, removing, or rewriting an
   indicator. Reordering alone does NOT bump the major version (the set
   of behaviors is unchanged); it is logged as `COMP-v{n}.1` if at all.
3. **`evidenceTypes`** — adding or removing an admissible evidence
   type. The evidence-admissibility contract changed; this is a
   substantive change. (Reordering the array is cosmetic.)
4. **`name`** — a renamed competency is effectively a new competency if
   the construct changes; if the rename is purely cosmetic (e.g.
   ES/EN translation), bump minor version and keep lineage.
5. **`source`** — change of cited literature or change of AI provenance
   (`AI_DRAFT_ORIGIN:…` re-run) is a provenance change; bump minor
   version if the content is unchanged, major if the cited source
   implies a different construct.

For `JobCompetency` (bump `JobCompetency-v{n}` → `JobCompetency-v{n+1}`):

1. **`rationale`** — substantive change to the why-this-competency-for-
   this-job narrative.
2. **`criticality`** — change from CRITICAL to IMPORTANT (or vice
   versa) is a substantive change: it alters RH reviewer attention and
   the structured-interview question budget. Change between IMPORTANT
   and STANDARD is also substantive. (All three transitions bump major
   version; there is no "minor criticality change".)
3. **`jobRelevance`** — change in the assessment of the evidence-quality
   of the link (e.g. PENDING_REVIEW → VALID after human review). This
   is a substantive change.
4. **`competencyId`** — if the linked competency is changed (e.g. the
   competency was superseded by a new version), the JobCompetency must
   be re-evaluated against the new competency definition; bump version.
5. **`source`** — change of provenance (e.g. an `AI_SUGGESTED` link is
   later justified by a `JOB_ANALYSIS` artifact) bumps minor version if
   the content is otherwise unchanged.

### 6.3 What does NOT trigger a version bump

- Changes to `status` (lifecycle transitions are not version bumps —
  see §6.4).
- Changes to `approvedBy` on `JobCompetency` (governance metadata
  travels with the version; a re-approval by a different reviewer
  creates a new audit row but does not bump `version`).
- Cosmetic edits (typos, punctuation, whitespace) that do not alter
  meaning.
- Translation of `name` / `definition` / `rationale` into another
  language (handled as a parallel localized record linked by
  `competencyId` / `(jobId, competencyId)`, not a version bump).

### 6.4 Status lifecycle (inherited from A-06.1)

The lifecycle graph, transition table, and invariants are **identical**
to A-06.1 framework §4. They are inherited verbatim by both `Competency`
and `JobCompetency`. Key restatements:

| From | To | Trigger | Permitted actor |
|---|---|---|---|
| (new) | `DRAFT` | Create | Human reviewer; AI may draft with `source` marked AI-provenance (never to a higher status) |
| `DRAFT` | `REVIEW` | Submit for review | Human reviewer (the author or another human) |
| `REVIEW` | `APPROVED` | Approve | **Human reviewer only** (for `JobCompetency`, sets `approvedBy`) |
| `REVIEW` | `DRAFT` | Reject / request changes | Human reviewer |
| `APPROVED` | `ACTIVE` | Activate (publish for use) | Human reviewer |
| `APPROVED` | `DRAFT` | Withdraw approval (rare) | Human reviewer |
| `ACTIVE` | `SUSPENDED` | Suspend | Human reviewer |
| `SUSPENDED` | `ACTIVE` | Reactivate | Human reviewer |
| `SUSPENDED` | `RETIRED` | Retire (terminal) | Human reviewer |
| `ACTIVE` | `RETIRED` | Retire | Human reviewer (typically when a new version supersedes) |
| `RETIRED` | (any) | — | — (terminal) |

**Invariants (mirrors A-06.1 framework §4.2):**

1. **Single ACTIVE per `competencyId`** (for Competency) and **single
   ACTIVE per `(jobId, competencyId)` pair** (for JobCompetency).
   Activating v{n+1} automatically retires v{n}.
2. **`approvedBy` is non-null from APPROVED onward** on JobCompetency.
3. **AI never crosses into APPROVED.** An AI-drafted Competency or
   JobCompetency (`source` marked AI-provenance) can exist in DRAFT. It
   cannot transition to REVIEW or APPROVED without a human actor.
4. **RETIRED is terminal.** No transitions out.
5. **All transitions are auditable** (actor identity, timestamp, prior
   status, new status, reason; immutable audit trail).

### 6.5 Supersession and lineage

When a new version `COMP-v{n+1}` of a Competency is published (transitions
to ACTIVE), the previous version `COMP-v{n}` transitions to RETIRED. The
retired version **remains in the database, immutable, for historical
traceability** — exactly as A-03.5 §3 rule 5 specifies, and as A-06.1
framework §3.4 specifies.

Any `JobCompetency` row that referenced `COMP-v{n}` keeps that reference;
it is **not silently migrated** to the new version. If the new version's
`definition` or `behavioralIndicators` materially changed, the RH
reviewer is expected to evaluate whether the `JobCompetency.rationale`
still holds — and if not, create a new `JobCompetency-v{n+1}` linking to
`COMP-v{n+1}`. The old `JobCompetency-v{n}` is RETIRED. This is the same
"no retrospective reinterpretation" guarantee that A-03.5 enforces for
`KnowledgeItemVersion` (an assessment that referenced v1 keeps pointing
at v1, even after v2 is published).

### 6.6 Versioning example (illustrative)

```
Competency:
  competencyId:  COMP-SVC-001
  name:          "Servicio al cliente"
  version:       COMP-v1      status: RETIRED    (definition lacked "de-escalation" indicator)
  version:       COMP-v2      status: ACTIVE     (added "de-escalation" indicator + WORK_SAMPLE evidenceType)

JobCompetency (linking COMP-SVC-001 v2 to Position:Mesero):
  jobId:         position_cuid_mesero_001
  competencyId:  COMP-SVC-001  (resolved at read-time to its ACTIVE version COMP-v2)
  rationale:     "El mesero interactúa con clientes en cada servicio; la
                  calidad de esa interacción diferencia restaurantes."
  criticality:   CRITICAL
  source:        EXPERT       (elicited from SME: chef de salle)
  version:       JobCompetency-v1    status: ACTIVE
  approvedBy:    jane.doe@example.org
```

A retrospective assessment of a candidate evaluated while `COMP-v1` was
ACTIVE keeps pointing at `COMP-v1`. The candidate's historical evidence
is **not** reinterpreted under `COMP-v2`'s definition (which adds the
"de-escalation" indicator that was not part of the original assessment).

### 6.7 The `version` field is NOT a scoring or evidence version

Note (and reinforce, mirroring A-06.1 framework §3.6): `version =
COMP-v{n}` is a **content version** of the competency definition. It is
not a scoring version (no scoring exists) and not an evidence version
(evidence is captured per-candidate, per-indicator, in a separate
`Evidence` entity defined in a future phase). This mirrors A-03.5's
separation of `blueprintVersion` (structure) from `assessmentVersion`
(instrument) from `scoringVersion` (PUB-KS-v1) from `evidenceStatus`
(per-result).

---

## 7. Boundary statements (what A-06.2 explicitly does NOT do)

- Does **not** modify `prisma/schema.prisma`, `schema.prod.prisma`,
  `supabase-schema.sql`, any file under `src/`, `scripts/`, or `public/`.
- Does **not** introduce a `Competency` Prisma model, a `JobCompetency`
  Prisma model, or a `BehavioralIndicator` Prisma model. The structures
  in §2 and §3 are **canonical reference structures**; the schema
  migration is a future-phase concern.
- Does **not** modify the canonical engine (`src/lib/overall-score.ts`),
  `JobFit`, `recommendation`, the Knowledge model, the Integrity model,
  the Personality model, `PSICOLOGICA_QUESTIONS`, `InterviewSchedule`,
  `generate-templates.ts`, or the privacy notice.
- Does **not** introduce scoring, weights, cut-points, level bands, or
  any decision-layer artifact.
- Does **not** introduce instruments, question batteries, or
  evidence-collection artifacts.
- Does **not** modify the contract or the aviso de privacidad.
- Does **not** authorize the AI to approve, activate, suspend, or retire
  any Competency or JobCompetency. The AI remains draft-only (mirrors
  A-03.5 §13, A-04.5, A-05.3 §8, A-06.1 framework §5).

---

## 8. Provenance and immutability of this document

- **Created by:** Task 1-a (general-purpose subagent) under A-06.2 PASO 2.
- **Source inputs:** repository state at A-06.2 task start; A-06.1
  dossiers (`competency-definition.md`, `competency-framework.md`,
  `behavioral-indicators.md`, `job-linkage.md`, `evidence-model.md`,
  `structured-interview.md`, `recommended-model.md`); A-03.5 Knowledge
  canónico dossier (versioning + AI-boundary patterns); A-04.5 overall-
  score governance dossier; A-05.3 Personality V1 dossier.
- **Foundational references:** McClelland (1973); Spencer & Spencer
  (1993); Boyatzis (1982); CONOCER (Mexico); A-03.5 canonical Knowledge
  model.
- **Status:** DEFINITION — locked at A-06.2 PASO 2 publication. Changes
  require a new A-06.x task with explicit version bump (mirrors the
  immutability rule of A-03.5 §3 and A-06.1 framework §8).
- **Cross-references:** `01-before-audit.md` (PASO 1 — before state);
  A-06.1 `competency-definition.md` (the WHAT); A-06.1
  `competency-framework.md` (the A-06.1 reference structure that this
  file specializes); A-06.1 `behavioral-indicators.md` and
  `job-linkage.md` (the A-06.1 conceptual treatment of the entities
  referenced by ID here).
