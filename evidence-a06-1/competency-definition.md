# A-06.1 — Competency Definition

> Phase A-06.1 · Task 1-a · DOCUMENTATION-ONLY (no source code modified)
> Expediente: `/home/z/my-project/evidence-a06-1/`
> Applies to: EvaluHR competency module (Mexico, multi-tenant HR SaaS)
> Prerequisite reads: worklog A-04.1 → A-05.3; `search-competency-models.json`; `search-mexico-competencias.json`.

---

## 1. Purpose

Phase A-06.1 introduces **Competency** as a first-class construct in EvaluHR.
Before any data model, scoring rule, or UI is designed, this document fixes
**what a competency is** and — equally important — **what it is not**.

The definition is anchored in the foundational literature of the competency
movement and is aligned with the rules already enforced in this codebase:

- Knowledge canónico (A-03.5): immutable published versions, `source = AI_DRAFT_ORIGIN`, SYSTEM-only publication, INSUFFICIENT ≠ 0.
- Integrity isolation (A-04.5): latent constructs without approved evidence do not feed `overallScore`.
- Personality V1 decision (A-05.2/A-05.3): OPTION E — a latent trait instrument without validated Mexican evidence is NOT shipped as a formal instrument.

The same governance discipline is now extended to competencies: a competency
is **not** a label for whatever HR feels like measuring. It is a delimited,
observable, evidence-bearing construct.

---

## 2. Foundational literature (anchoring)

| Source | Contribution adopted here |
|---|---|
| McClelland (1973) — *"Testing for competence rather than intelligence"* (American Psychologist, 28(1), 1–14) | Substitutes competency testing for IQ as the predictor of real-world performance. A competency is a characteristic **causally related** to criterion performance, not an abstract ability score. Establishes the move away from "intelligence as the universal predictor". |
| Lyle M. Spencer & Signe M. Spencer (1993) — *Competence at Work: Models for Superior Performance* | Defines competency as **"an underlying characteristic of an individual that is causally related to effective or superior performance"**, with five layers: *motive, trait, self-concept, knowledge, skill*. Introduces the **iceberg model**: the visible tip (knowledge + skill) is observable/teachable; the submerged base (motive, trait, self-concept) is latent and inferred through behavior. |
| Lyle & Spencer — iceberg distinction (operational reading) | A competency is **observable through behavior**. Personality, motive and self-concept are *latent* predictors; they become competencies only when expressed as behaviors that are linked to job performance. This distinction drives the differentiation table in §4. |
| Boyatzis (1982) — *The Competent Manager* | Extends Spencer & Spencer to managerial roles: a competency is a bundle of **behavioral indicators** that differentiate effective from average performers. Reinforces behavior, not score, as the unit of analysis. |
| CONOCER (México) — Sistema Normalizado de Certificación de Competencias Laborales | Mexican institutional reading: a labor competency is "the set of knowledge, skills, and attitudes that a worker demonstrates in the performance of a job function, in accordance with a quality standard of performance". The **demonstration** criterion is what we adopt: competency is shown, not declared. (Source: `search-mexico-competencias.json`, UAM/UNAM/CONOCER references.) |
| Ley Federal del Trabajo (Mexico) — context only | We do **not** cite specific articles. Legal sufficiency of any competency-based decision requires **REVISIÓN LEGAL** (same rule as A-04.1/A-05.2). |

**Adopted synthesis.** The Spencer & Spencer definition is the spine; the
iceberg model gives us the observable/latent boundary; CONOCER anchors the
Mexican operational reading ("competency is demonstrated, not declared").

---

## 3. Adopted definition

> **Competency (EvaluHR, A-06.1).** A competency is an **observable
> behavior** of an individual that is **causally linked to effective or
> superior performance** in a defined job context, and that is **inferred
> from behavioral evidence** rather than from a single test score,
> self-report, or latent trait measurement.

Three clauses, each load-bearing:

1. **Observable behavior.** The unit of a competency is what a person
   *does* in a job-relevant situation — verbal, non-verbal, procedural or
   decisional. A motive, a value, an attitude is **not** a competency until
   it is operationalized as a behavior the system can collect evidence
   about. (Iceberg principle: only the tip counts as competency content.)

2. **Causally linked to effective or superior performance.** The behavior
   must be documented to differentiate effective from average performers in
   the job family in question (Boyatzis 1982; Spencer & Spencer 1993).
   "Documented" means: a human reviewer can name the link. A behavior with
   no plausible job-relevance narrative is **not** a competency — it is at
   best a personality descriptor.

3. **Inferred from behavioral evidence, not a test score.** A competency is
   assessed through accumulated evidence (interview answers, situational
   judgments, work samples, structured observation). A number on a Likert
   scale, an IQ score, or a personality factor score is **not** a competency
   — it is at most a predictor *of* competency expression. The competency
   itself is the **evidenced behavioral pattern**, not the predictor.

This definition is deliberately narrower than the colloquial HR usage
("anything a candidate is good at"). It is also narrower than Spencer &
Spencer's full five-layer model: we treat *motive, trait, self-concept* as
**latent predictors**, not competencies — they only become competencies
when re-expressed as observable behaviors with evidence.

---

## 4. Differentiation table — competency vs. adjacent constructs

The table below is the operational core of this document. Each row pins
down a construct that EvaluHR already handles (or has explicitly decided
NOT to handle in V1) and states unambiguously how a competency differs.

| # | Construct | What it is (1-line) | How it differs from a competency | EvaluHR status / reference |
|---|---|---|---|---|
| 1 | **Personality** (Big Five / Honesty-Humility / HEXACO factors) | A latent dispositional trait measured by self-report inventories (e.g. Conscientiousness, Honesty-Humility). Stable across situations. | Personality is a **latent trait**; a competency is an **observable behavior**. A high Conscientiousness score predicts the *likelihood* of a competency being expressed; it is not the competency itself. Personality → predictor; competency → behavioral outcome. | A-05.1/A-05.2/A-05.3: Big Five demo = LEGACY/DEVELOPMENT_ONLY; OPTION E (no formal personality instrument in V1); `OVERALL-v1.1` excludes `BIG_FIVE` via `PERSONALITY_NOT_APPROVED_FOR_V1`. |
| 2 | **Knowledge** (job knowledge / technical knowledge) | Verifiable declarative or procedural information about a domain, tested by right/wrong items. | Knowledge is **what** a person knows (testable, keyable, with a correct answer). A competency is **how** the person acts on the job. Knowledge is a *resource* the competency mobilizes, not the competency itself. A person can have the knowledge and not enact the competency (and vice versa). | A-03.5 canonical Knowledge model: `KnowledgeResult.evidenceStatus` ∈ {VALID, LIMITED, INSUFFICIENT, INVALID, NOT_APPLICABLE}; INSUFFICIENT ≠ 0; published only by `SYSTEM:KNOWLEDGE_FREEZE`. Knowledge has a *correct answer*; competencies do not. |
| 3 | **Experience** | Accumulated time-on-task in a role, function, or domain. Counted in months/years or task repetitions. | Experience is a **history of exposure**; a competency is a **current behavioral capability**. Ten years in a role is neither necessary nor sufficient for a competency: a junior may demonstrate the behavior, a veteran may not. Experience is a *proxy predictor* and a recruitment filter; it is never a competency measurement. | Not modeled as a first-class score in V1; appears only as candidate-profile metadata and (optionally) as a job-requirement field. Never enters `overallScore`. |
| 4 | **Education** (degrees, certifications, diplomas) | Formal credentials attesting completion of an academic or training program. Issued by an institution; verifiable. | Education is an **input credential**; a competency is a **demonstrated capability**. A degree certifies that a person *studied* a subject, not that they *behave* effectively in a job situation. Credential ≠ performance. | Stored as candidate-profile data; treated as a job-requirement filter (Y/N), never as a score. Cannot substitute for behavioral evidence. |
| 5 | **Integrity** (workplace integrity / Honesty-Humility / counterproductive work behavior risk) | A latent construct (Honesty-Humility in HEXACO; CWB as criterion) measured by self-report or situational judgment, predicting rule-following and CWB suppression. | Integrity is a **latent disposition** (and, in our model, an *indicator*, not a competency). It predicts *whether* a person will behave with integrity; the competency is the **actual rule-respecting behavior** in dilemmatic situations. Integrity → predictor; "Ethical decision-making" → competency. | A-04.1/A-04.2: HEXACO Honesty-Humility + SJT ético recommended; OPTION B (implement only after validation); A-04.5: integrity **isolated** from `overallScore` (`INTEGRITY_NOT_APPROVED_FOR_OVERALL`); `integrityScore` is NOT a competency score. |
| 6 | **Aptitude** (cognitive ability / GMA / specific aptitudes) | A latent general or specific capacity to acquire skills and solve problems. Measured by ability tests (numerical, verbal, abstract reasoning). | Aptitude is a **capacity to learn**; a competency is a **demonstrated performance**. High GMA predicts faster competency acquisition but is not the competency. McClelland (1973) is precisely the move *away* from aptitude/IQ toward competency evidence. | Not implemented in V1. IQ/aptitude scores are explicitly out of scope: McClelland (1973) is adopted as a foundational reference precisely to NOT regress to IQ. |
| 7 | **Performance** (job performance ratings, KPIs, output metrics) | A measured outcome of the job itself — sales closed, defects shipped, customer satisfaction, manager rating. | Performance is the **criterion** that a competency *predicts*; a competency is one of the **predictors**. Confusing the two collapses cause (competency) and effect (performance). Competency assessment is formative/predictive; performance review is summative/evaluative. | `recommendation` in EvaluHR is guidance (no thresholds, no `APTO/NO APTO`); KPI/performance review modules are out of scope of A-06.1 and are not connected to competency data. |

### Reading the table

- **Latent constructs** (personality, integrity, aptitude): **predictors** of competency expression. They become competencies only when re-expressed as observable behaviors with collected evidence.
- **Input factors** (knowledge, experience, education): **resources** the competency mobilizes. Necessary in some roles, never sufficient.
- **Output constructs** (performance): the **criterion** competencies predict, not a competency itself.

A competency lives in the middle layer: **observable behavior → job-relevant evidence → effective performance link**. Anything outside that layer is something else.

---

## 5. Key principle — a competency is NOT a test score

This is the single most important rule of A-06.1. It is stated here once,
loudly, and is inherited by every downstream artifact of the competency
module (framework, instruments, evidence model, candidate profile).

> **A competency is inferred from behavioral evidence. It is NOT a test
> score.**

Operational consequences:

1. **No numeric competency score is defined in A-06.1.** The Competency
   entity (see `competency-framework.md`) deliberately has **no** `score`,
   `weight`, `percentile`, `cutPoint`, or `level` field. Adding any of
   these is out of scope of A-06.1 and would require a separate phase with
   its own evidence dossier.

2. **Behavioral evidence is the unit, not the rating.** A competency is
   documented by a set of `behavioralIndicators` (observable behaviors)
   and is assessed by collecting evidence items that speak to those
   behaviors — interview responses, SJT choices, work samples, structured
   observations. Each evidence item carries its own `evidenceStatus`
   (mirroring the A-03.5 / A-04.5 pattern: VALID / LIMITED / INSUFFICIENT /
   INVALID / PENDING_REVIEW / NOT_APPLICABLE).

3. **A missing evidence ≠ a zero.** Just as `KnowledgeResult.knowledgeScore`
   is `null` (not `0`) when evidence is INSUFFICIENT (A-03.5), and just as
   Integrity is excluded from `overallScore` via `INTEGRITY_NOT_APPROVED`
   (A-04.5), a competency with insufficient evidence is reported as
   INSUFFICIENT, **never** as 0. The "no-evidence ≠ zero-evidence" rule
   is a project-wide invariant; A-06.1 inherits it.

4. **Latent traits are not competencies.** A personality factor, an
   integrity score, an aptitude result may *inform* competency assessment
   (as collateral predictors), but they are not competencies and they do
   not substitute for behavioral evidence. The same separation that A-05.3
   enforced for personality (`PERSONALITY_NOT_APPROVED_FOR_V1`) and A-04.5
   for integrity (`INTEGRITY_NOT_APPROVED_FOR_OVERALL`) applies here: a
   latent trait cannot pose as a competency.

5. **IA cannot produce or approve competencies.** Mirroring A-03.5 §13 and
   A-05.3 §8: the AI may draft behavioral indicators and proposed
   definitions, but it cannot create APPROVED competencies, cannot set
   `status = ACTIVE`, and cannot publish a competency version. All
   approval transitions require a human reviewer (see
   `competency-framework.md` §5 Governance).

---

## 6. Boundary statements (what A-06.1 explicitly does NOT do)

- Does **not** define a scoring formula (0–100, weighted, normalized, or
  otherwise).
- Does **not** define competency weights, importance levels, or cut-points.
- Does **not** define `APTO` / `NO APTO`, pass/fail, or band labels
  (Beginner/Intermediate/Advanced).
- Does **not** connect competencies to `overallScore`, `JobFit`, or
  `recommendation`. The competency module is **decoupled** from the
  decision layer until a separate, evidenced phase authorizes the
  connection.
- Does **not** introduce new tests, instruments, or question batteries.
- Does **not** modify `prisma/schema.prisma`, `src/lib/*`, the canonical
  engine, the Knowledge model, the Integrity model, the Personality model,
  JobFit, the contract, or the aviso de privacidad.

This document is **definition-only**. Subsequent A-06.x phases will
reference it as the single source of truth for "what is a competency".

---

## 7. Provenance and immutability of this document

- **Created by:** Task 1-a (general-purpose subagent) under A-06.1.
- **Source inputs:** worklog A-04.1 → A-05.3; `search-competency-models.json`;
  `search-mexico-competencias.json`; canonical Knowledge model (A-03.5);
  Integrity isolation dossier (A-04.5); Personality V1 dossier (A-05.2/A-05.3).
- **Foundational references:** McClelland (1973); Spencer & Spencer (1993);
  Boyatzis (1982); CONOCER (Mexico).
- **Status:** DEFINITION — locked at A-06.1 publication. Changes require a
  new A-06.x task with explicit version bump (mirrors the immutability rule
  of A-03.5 §3).
- **Cross-reference:** `competency-framework.md` (structure, versioning,
  lifecycle, governance); future A-06.x dossiers (instruments, evidence
  model, scoring — if and when authorized).
