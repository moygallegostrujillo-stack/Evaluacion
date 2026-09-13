/**
 * A-04.5 / A-05.3 — CANONICAL OVERALL SCORE ENGINE
 * ================================================
 *
 * ONE single technical authority for the computation of `overallScore`.
 * Before A-04.5 there were FOUR divergent implementations (see
 * evidence-a04-5/01-before.md). This module is the canonical replacement:
 *
 *   calculateCanonicalOverallScore()
 *
 * Every route that persists an `overallScore` MUST delegate to this engine.
 * The legacy per-route formulas (F1 evaluations, F2 apply-step, F3 apply-final,
 * F4 video) either delegate here or disappear.
 *
 * ── DESIGN RULES (A-04.5 + A-05.3 spec) ────────────────────────────────
 *
 *  A. UNIFY  — one engine, deterministic: same inputs → same score,
 *              regardless of channel (evaluations / public-apply / video).
 *  B. ISOLATE INTEGRITY — Integrity is methodologically NOT approved
 *              (A-04.2 OPTION B, GATE-1..10 not passed). It MUST NOT
 *              participate in `overallScore`. Its result is still computed
 *              and stored SEPARATELY (IntegrityResult / integrityScore)
 *              for future phases. (A-04.5)
 *  B2. ISOLATE PERSONALITY (BIG_FIVE) — the Big Five demo is PROJECT-CREATED
 *              with UNKNOWN rights and NOT_ESTABLISHED evidence (A-05.1/A-05.2).
 *              Per A-05.2 OPTION E, Personality is NOT_IMPLEMENTED in V1.
 *              It MUST NOT participate in `overallScore` for new evaluations.
 *              Its historical scores are PRESERVED untouched (LEGACY). (A-05.3)
 *  C. PRESERVE LEGACY — historical results (rows with `formulaVersion`
 *              = null OR 'OVERALL-v1') are NEVER recalculated. They keep
 *              their exact values and are classified LEGACY-OVERALL.
 *  D. NO-EVIDENCE ≠ 0 — an instrument whose evidence status is
 *              INSUFFICIENT / INVALID / PENDING_REVIEW / NOT_APPROVED is
 *              EXCLUDED from the overall; it is NEVER converted to 0.
 *              A null / absent instrument is likewise EXCLUDED (NO_DATA),
 *              never coerced to 0.
 *  E. NO JobFit — this module computes the TECHNICAL formula version
 *              `OVERALL-v1.1` only. It does NOT define a validated model,
 *              does NOT create weights, cuts, percentiles, APTO/NO-APTO,
 *              or any decision. JobFit is explicitly NOT implemented.
 *
 * ── HISTORICAL WEIGHTS (preserved verbatim, documented) ────────────────
 *
 * The branch matrix below is the EXACT historical matrix from F1/F2/F3
 * (evaluations/route.ts L264-304, apply/route.ts L160-200 & L593-631).
 * A-04.5 force-excluded INTEGRITY. A-05.3 force-excludes BIG_FIVE.
 * Because both are excluded, the effective instrument set for new V1
 * evaluations is a subset of {PSYCHOLOGICAL, KNOWLEDGE} and the historical
 * branches that naturally apply are:
 *
 *   included count 0            → 0
 *   included count 1            → that instrument's score
 *   included count 2 (PSY+KN)  → equal split (arithmetic mean)
 *
 * The count===3 branch (BF+PSY+KN → 0.30·BF + 0.30·PSY + 0.40·KN) is kept
 * for completeness but is UNREACHABLE for new V1 evaluations (BIG_FIVE is
 * always excluded by getExclusionReason). It remains valid for any future
 * re-admission of Personality after PERSONALITY-G1..G10.
 *
 * These are the SAME weights/branches the legacy code used. No new weight
 * was invented.
 *
 * The divergent F4 (video) formula (0.30/0.30/0.40 PROPORTIONAL
 * renormalization, neuroticism re-inverted, fixed /5 denominators, no
 * Integrity) is REMOVED. Video now delegates to this engine.
 *
 * ── formulaVersion ─────────────────────────────────────────────────────
 *
 * `OVERALL-v1` is a TECHNICAL FORMULA VERSION stamp — it identifies which
 * branch matrix produced the score. It is NOT a "validated model", NOT a
 * psychometric endorsement, and NOT a decision threshold.
 */

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

/**
 * Technical formula version.
 *
 * A-04.5 introduced `OVERALL-v1` (Integrity excluded, Personality included).
 * A-05.3 bumps to `OVERALL-v1.1` (Integrity + Personality both excluded).
 *
 * Rows stamped `OVERALL-v1` (A-04.5 era) included Personality in the weighted
 * score; rows stamped `OVERALL-v1.1` (A-05.3+) exclude it. Both are
 * canonical (non-LEGACY); the distinction preserves traceability.
 *
 * This is NOT a "validated model"; it is a technical formula version stamp.
 */
export const OVERALL_FORMULA_VERSION = 'OVERALL-v1.1' as const
export type OverallFormulaVersion = typeof OVERALL_FORMULA_VERSION

/** Legacy marker: rows with `formulaVersion IS NULL` are pre-OVERALL-v1. */
export const LEGACY_OVERALL_MARKER: null = null

export type InstrumentKind = 'BIG_FIVE' | 'PSYCHOLOGICAL' | 'KNOWLEDGE' | 'INTEGRITY'

/**
 * Evidence status of an instrument. Mirrors the Knowledge canonical
 * `CanonicalKnowledgeScore['evidenceStatus']` plus the governance statuses
 * from A-04.4 PASO 17. `null` = unknown / legacy (no formal status).
 */
export type EvidenceStatus =
  | 'VALID'
  | 'LIMITED'
  | 'INSUFFICIENT'
  | 'INVALID'
  | 'PENDING_REVIEW'
  | 'NOT_APPROVED'
  | null

/**
 * Statuses that MUST NOT feed the global decision (A-04.5 PASO 4 +
 * A-04.4 proposed governance rule). An instrument in any of these
 * states is EXCLUDED — never coerced to 0.
 */
const EXCLUDED_EVIDENCE_STATUSES: ReadonlySet<string> = new Set([
  'INSUFFICIENT',
  'INVALID',
  'PENDING_REVIEW',
  'NOT_APPROVED',
])

/** Why an instrument was excluded from the overall score. */
export type ExclusionReason =
  | 'INTEGRITY_NOT_APPROVED_FOR_OVERALL' // Integrity isolated (A-04.5 PASO 3)
  | 'PERSONALITY_NOT_APPROVED_FOR_V1' // Personality (Big Five) retired from V1 (A-05.3 PASO 3)
  | 'INSUFFICIENT' // not enough evidence
  | 'INVALID' // evidence invalid
  | 'PENDING_REVIEW' // awaiting review
  | 'NOT_APPROVED' // governance gate failed
  | 'NO_DATA' // null / absent / not administered

/** Input for a single instrument. */
export interface InstrumentInput {
  kind: InstrumentKind
  /** 0-100 score. `null` = no data collected / not administered. */
  score: number | null
  /** Evidence status from the instrument's canonical engine (if any). */
  evidenceStatus?: EvidenceStatus
}

/** Canonical input: the four instruments. */
export interface CanonicalOverallInput {
  bigFive: InstrumentInput
  psychological: InstrumentInput
  knowledge: InstrumentInput
  integrity: InstrumentInput
}

/** Result of the canonical overall computation (A-04.5 PASO 7). */
export interface OverallScoreResult {
  /** The overall score, rounded to 2 decimals. */
  score: number
  /** Instruments that participated in the weighted score. */
  includedSections: InstrumentKind[]
  /** Instruments excluded from the weighted score. */
  excludedSections: InstrumentKind[]
  /** Map instrument → why it was excluded. */
  excludedReasons: Partial<Record<InstrumentKind, ExclusionReason>>
  /** Technical formula version that produced this score. */
  formulaVersion: OverallFormulaVersion
}

/** Guidance (profile completeness) — NOT a hiring decision (LFPDPPP Art. 37 Bis). */
export type Guidance = 'PERFIL_COMPLETO' | 'PERFIL_PARCIAL' | 'PENDIENTE'

/** Full result including guidance + summary inputs for DB persistence. */
export interface CanonicalOverallOutput extends OverallScoreResult {
  /** Profile-completeness guidance (NOT a decision). */
  guidance: Guidance
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Determine whether an instrument is EXCLUDED from the weighted overall,
 * and if so, why.
 *
 *  - INTEGRITY is ALWAYS excluded (methodologically not approved — A-04.2
 *    OPTION B / GATE-1..10). Its data is still stored separately.
 *  - BIG_FIVE (Personality) is ALWAYS excluded for V1 (A-05.2 OPTION E:
 *    PROJECT-CREATED, UNKNOWN rights, NOT_ESTABLISHED evidence). Its
 *    historical scores are preserved (LEGACY). Re-admission requires
 *    PERSONALITY-G1..G10.
 *  - A null score → NO_DATA (never coerced to 0).
 *  - An evidence status in the exclusion set → that status (never 0).
 *  - Otherwise the instrument is INCLUDED.
 */
function getExclusionReason(inst: InstrumentInput): ExclusionReason | null {
  // Integrity is unconditionally isolated from the global score (A-04.5).
  if (inst.kind === 'INTEGRITY') {
    return 'INTEGRITY_NOT_APPROVED_FOR_OVERALL'
  }
  // Personality (Big Five) is unconditionally isolated from V1 overall (A-05.3).
  if (inst.kind === 'BIG_FIVE') {
    return 'PERSONALITY_NOT_APPROVED_FOR_V1'
  }
  // Absence of evidence is never a score of 0.
  if (inst.score === null || !Number.isFinite(inst.score)) {
    return 'NO_DATA'
  }
  // Instruments whose evidence is not approved do not feed the global.
  if (inst.evidenceStatus && EXCLUDED_EVIDENCE_STATUSES.has(inst.evidenceStatus)) {
    return inst.evidenceStatus as ExclusionReason
  }
  return null
}

/**
 * Whether an instrument has DATA (regardless of whether it is included in
 * the weighted score). Used for the guidance (profile completeness) which
 * reflects which sections the candidate actually completed with VALID
 * evidence. An instrument with INSUFFICIENT/INVALID/PENDING_REVIEW/
 * NOT_APPROVED evidence does NOT count toward PERFIL_COMPLETO — this
 * mirrors the historical semantics where INSUFFICIENT knowledge produced
 * `knowledgeScore = null` (→ `!== null` false → not COMPLETO).
 */
function hasData(inst: InstrumentInput): boolean {
  if (inst.score === null || !Number.isFinite(inst.score)) return false
  if (inst.evidenceStatus && EXCLUDED_EVIDENCE_STATUSES.has(inst.evidenceStatus)) return false
  return true
}

// ─────────────────────────────────────────────────────────────────────
// Canonical computation
// ─────────────────────────────────────────────────────────────────────

/**
 * Compute the overall score from the set of INCLUDED instruments using
 * the EXACT historical branch matrix (no new weights).
 *
 * Precondition: Integrity and BIG_FIVE are already excluded by the caller's
 * inclusion logic (getExclusionReason), so for V1 new evaluations `included`
 * is a subset of {PSYCHOLOGICAL, KNOWLEDGE}. The count===3 branch (BF+PSY+KN)
 * is kept for completeness but unreachable in V1.
 */
function computeOverallFromIncluded(
  included: InstrumentInput[]
): number {
  const count = included.length

  if (count === 0) {
    return 0
  }

  if (count === 1) {
    // Only one section — use its score directly (historical branch 2).
    return included[0].score as number
  }

  if (count === 2) {
    // Two sections — equal split (historical branch 3, arithmetic mean).
    const [a, b] = included
    return ((a.score as number) + (b.score as number)) / 2
  }

  // count === 3 → BIG_FIVE + PSYCHOLOGICAL + KNOWLEDGE.
  // Historical "3 present, no integrity" legacy path:
  //   0.30·BF + 0.30·PSY + 0.40·KN   (F1 L288, F2 L184, F3 L615)
  const byKind = new Map(included.map((i) => [i.kind, i.score as number]))
  const bf = byKind.get('BIG_FIVE') as number
  const psy = byKind.get('PSYCHOLOGICAL') as number
  const kn = byKind.get('KNOWLEDGE') as number
  return 0.3 * bf + 0.3 * psy + 0.4 * kn
}

/**
 * THE canonical overall score engine.
 *
 * Pure function — no DB access, no I/O. Deterministic: identical inputs
 * always produce an identical `OverallScoreResult` regardless of the
 * calling channel (evaluations / public-apply / public-video).
 *
 * Callers are responsible for:
 *  - passing `score: null` when an instrument was not administered or has
 *    no collected data (so absence is never coerced to 0);
 *  - passing the canonical `evidenceStatus` for Knowledge when available
 *    (VALID/LIMITED/INSUFFICIENT) so INSUFFICIENT evidence is excluded.
 */
export function calculateCanonicalOverallScore(
  input: CanonicalOverallInput
): CanonicalOverallOutput {
  const instruments: InstrumentInput[] = [
    input.bigFive,
    input.psychological,
    input.knowledge,
    input.integrity,
  ]

  const includedSections: InstrumentKind[] = []
  const excludedSections: InstrumentKind[] = []
  const excludedReasons: Partial<Record<InstrumentKind, ExclusionReason>> = {}
  const included: InstrumentInput[] = []

  for (const inst of instruments) {
    const reason = getExclusionReason(inst)
    if (reason === null) {
      includedSections.push(inst.kind)
      included.push(inst)
    } else {
      excludedSections.push(inst.kind)
      excludedReasons[inst.kind] = reason
    }
  }

  const rawScore = computeOverallFromIncluded(included)

  // Guidance — profile completeness, NOT a hiring decision.
  // A-05.3: BIG_FIVE is NOT_IMPLEMENTED for V1 (PERSONALITY_NOT_APPROVED_FOR_V1).
  // It is NO LONGER required for PERFIL_COMPLETO. A V1 candidate who completes
  // PSY + KN + INT has a complete profile. Integrity is still required for
  // COMPLETO (it is still administered, just excluded from the weighted score).
  // Historical rows (OVERALL-v1 / null) keep their persisted guidance unchanged.
  let guidance: Guidance
  const allPresent =
    hasData(input.psychological) &&
    hasData(input.knowledge) &&
    hasData(input.integrity)
  const anyPresent =
    hasData(input.bigFive) ||
    hasData(input.psychological) ||
    hasData(input.knowledge) ||
    hasData(input.integrity)
  if (!anyPresent) {
    guidance = 'PENDIENTE'
  } else if (allPresent) {
    guidance = 'PERFIL_COMPLETO'
  } else {
    guidance = 'PERFIL_PARCIAL'
  }

  return {
    score: round2(rawScore),
    includedSections,
    excludedSections,
    excludedReasons,
    formulaVersion: OVERALL_FORMULA_VERSION,
    guidance,
  }
}

// ─────────────────────────────────────────────────────────────────────
// Shared builders — guarantee determinism across channels
// ─────────────────────────────────────────────────────────────────────

/** The five Big Five dimension scores as persisted on a result row. */
export interface BigFiveDims {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

/** The five psychological dimension scores as persisted on a result row. */
export interface PsychDims {
  stressLevel: number
  empathy: number
  adaptability: number
  leadership: number
  teamwork: number
}

/**
 * Reconstruct the Big Five aggregate average from persisted dimension scores,
 * using the EXACT historical adaptive logic: only dimensions with a non-zero
 * score are averaged (a 0 = that dimension had no responses). Returns `null`
 * when no dimension has data, so absence is never coerced to 0 by the engine.
 *
 * This is the SAME logic F1 used internally (`bigFiveCategoriesWithResponses`)
 * and F3 used when recomputing from the persisted row (`filter(s => s > 0)`).
 * Centralizing it here guarantees the three channels produce identical
 * aggregates from identical persisted data (A-04.5 PASO 12 — determinism).
 */
export function aggregateBigFive(dims: BigFiveDims): number | null {
  const values = [
    dims.openness,
    dims.conscientiousness,
    dims.extraversion,
    dims.agreeableness,
    dims.neuroticism,
  ]
  const present = values.filter((s) => Number.isFinite(s) && s > 0)
  return present.length > 0
    ? present.reduce((a, b) => a + b, 0) / present.length
    : null
}

/**
 * Reconstruct the psychological aggregate average (adaptive, non-zero dims).
 * Same historical logic as Big Five. STRESS is already inverted at the
 * dimension level (calculateLikertScore + the `100 - normalized` step in the
 * instrument scorer), so NO re-inversion happens here — this fixes the F4
 * double-inversion bug.
 */
export function aggregatePsych(dims: PsychDims): number | null {
  const values = [
    dims.stressLevel,
    dims.empathy,
    dims.adaptability,
    dims.leadership,
    dims.teamwork,
  ]
  const present = values.filter((s) => Number.isFinite(s) && s > 0)
  return present.length > 0
    ? present.reduce((a, b) => a + b, 0) / present.length
    : null
}

/**
 * Build the canonical overall input from persisted per-instrument scores.
 *
 * This is the SHARED entry point that all three routes use to guarantee
 * determinism (A-04.5 PASO 12): the SAME persisted scores produce the SAME
 * overall regardless of whether the channel is evaluations, public-apply,
 * or public-video.
 *
 *  - Big Five / Psychological aggregates are reconstructed adaptively
 *    (non-zero dims only). `null` when no dim has data.
 *  - Knowledge: the score is passed through; `evidenceStatus` is attached
 *    when the canonical Knowledge engine produced one (VALID/LIMITED/
 *    INSUFFICIENT). INSUFFICIENT evidence is EXCLUDED (never 0).
 *  - Integrity: `null` when the score is 0 (absent), so it is EXCLUDED.
 *    The engine ALWAYS excludes Integrity regardless (it is isolated).
 *
 * @param bigFive      persisted Big Five dimension scores
 * @param psych        persisted psychological dimension scores
 * @param knowledgeScore  nullable knowledge score (0-100)
 * @param knowledgeEvidenceStatus  evidence status from the canonical Knowledge engine
 * @param integrityScore   persisted integrity score (0 = absent)
 */
export function buildCanonicalInput(
  bigFive: BigFiveDims,
  psych: PsychDims,
  knowledgeScore: number | null,
  knowledgeEvidenceStatus: EvidenceStatus,
  integrityScore: number | null
): CanonicalOverallInput {
  const bfAvg = aggregateBigFive(bigFive)
  const psyAvg = aggregatePsych(psych)
  // Integrity: a persisted 0 means "no data" (the column is Float @default(0)
  // NOT NULL). Convert to null so the engine excludes it as NO_DATA rather
  // than scoring it as a real 0.
  const integrityScoreOrNull =
    integrityScore !== null && Number.isFinite(integrityScore) && integrityScore > 0
      ? integrityScore
      : null
  return {
    bigFive: instrument('BIG_FIVE', bfAvg),
    psychological: instrument('PSYCHOLOGICAL', psyAvg),
    knowledge: instrument('KNOWLEDGE', knowledgeScore, knowledgeEvidenceStatus),
    integrity: instrument('INTEGRITY', integrityScoreOrNull),
  }
}

// ─────────────────────────────────────────────────────────────────────
// Serialization helpers (for nullable String? schema columns)
// ─────────────────────────────────────────────────────────────────────

/** Serialize an array of section names for DB persistence (nullable). */
export function serializeSections(sections: InstrumentKind[]): string {
  return JSON.stringify(sections)
}

/** Serialize the exclusion-reason map for DB persistence (nullable). */
export function serializeExcludedReasons(
  reasons: Partial<Record<InstrumentKind, ExclusionReason>>
): string {
  return JSON.stringify(reasons)
}

/** Deserialize a persisted sections string (null/empty → []). */
export function deserializeSections(raw: string | null | undefined): InstrumentKind[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as InstrumentKind[]) : []
  } catch {
    return []
  }
}

/** Deserialize a persisted exclusion-reasons map (null/empty → {}). */
export function deserializeExcludedReasons(
  raw: string | null | undefined
): Partial<Record<InstrumentKind, ExclusionReason>> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object'
      ? (parsed as Partial<Record<InstrumentKind, ExclusionReason>>)
      : {}
  } catch {
    return {}
  }
}

/**
 * Classify a persisted row's overall score lineage.
 *  - `null`          → LEGACY-OVERALL (pre-A-04.5; 4 divergent formulas; value preserved as-is).
 *  - `'OVERALL-v1'`   → A-04.5 canonical (Integrity excluded, Personality included).
 *  - `'OVERALL-v1.1'` → A-05.3 canonical (Integrity + Personality both excluded).
 */
export function classifyOverallLineage(
  formulaVersion: string | null | undefined
): 'LEGACY-OVERALL' | 'OVERALL-v1' | 'OVERALL-v1.1' {
  if (formulaVersion === 'OVERALL-v1.1') return 'OVERALL-v1.1'
  if (formulaVersion === 'OVERALL-v1') return 'OVERALL-v1'
  return 'LEGACY-OVERALL'
}

// ─────────────────────────────────────────────────────────────────────
// Convenience builders for callers
// ─────────────────────────────────────────────────────────────────────

/**
 * Build an InstrumentInput from a raw score and optional evidence status.
 * Returns `{ score: null }` when the raw value is null/undefined/NaN,
 * so absence is never coerced to 0 by the engine.
 */
export function instrument(
  kind: InstrumentKind,
  score: number | null | undefined,
  evidenceStatus?: EvidenceStatus
): InstrumentInput {
  const safe =
    score === null || score === undefined || !Number.isFinite(score)
      ? null
      : score
  return { kind, score: safe, evidenceStatus: evidenceStatus ?? null }
}
