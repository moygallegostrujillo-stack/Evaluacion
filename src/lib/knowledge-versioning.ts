/**
 * A-03.4 — KNOWLEDGE VERSIONING FOR THE PUBLIC VACANCY FLOW
 * =========================================================
 * Closes the gap identified in A-03.3: the public apply flow did not freeze
 * the full Knowledge Assessment version at evaluation start.
 *
 * Guarantees implemented here (see evidence-a03-4/02-public-version-freeze.md):
 *
 *   CANDIDATE STARTS EVALUATION
 *     → ASSESSMENT VERSION  (KnowledgeAssessment.version, KA-v{n})
 *     → BLUEPRINT VERSION   (co-versioned frozen item set, BP-v{n})
 *     → ITEM VERSIONS       (KnowledgeAssessmentItem.itemVersion)
 *     → SCORING VERSION     (KNOWLEDGE_SCORING_VERSION, frozen on the row)
 *     → SNAPSHOT            (questionSnapshot + correctAnswerSnapshot —
 *                            server-only, never sent to the frontend)
 *     → RESULT              (reconstructable from frozen data alone)
 *
 * Fail-closed rule (PASO 8): if a version chain cannot be determined for a
 * new administration, KnowledgeVersioningError is thrown and the caller must
 * NOT create a partially-versioned evaluation.
 *
 * Legacy rule (PASO 9): rows created before A-03.4 carry NULL version fields,
 * are classified LEGACY and are never migrated or reinterpreted.
 *
 * Authority rule (PASO 10/11): every version/key/snapshot value in this file
 * is derived SERVER-SIDE. The candidate client can never supply them; AI code
 * has no write access to KnowledgeAssessment* tables at all.
 */

import crypto from 'crypto'
import type { PrismaClient, Prisma } from '@prisma/client'

type DbClient = PrismaClient | Prisma.TransactionClient

/** Version of the scoring rules used for administrations frozen by this code. */
export const KNOWLEDGE_SCORING_VERSION = 'PUB-KS-v1'

/** Server authority string recorded on every publish. AI is never the publisher. */
export const KNOWLEDGE_PUBLISH_AUTHORITY = 'SYSTEM:PUBLIC_APPLY_FREEZE'

/**
 * Governance fields a candidate client must NEVER send. Presence of any of
 * these in a public body is treated as a manipulation attempt (PASO 10).
 * A-03.5 extends the list with the canonical-model authorities: the client
 * never supplies blueprint/requirement/administration/result identities.
 */
export const KNOWLEDGE_CLIENT_DENYLIST = [
  'assessmentVersion',
  'knowledgeAssessmentId',
  'blueprintVersion',
  'knowledgeBlueprintVersion',
  'scoringVersion',
  'knowledgeScoringVersion',
  'itemVersion',
  'correctAnswer',
  'correctAnswerSnapshot',
  'questionSnapshot',
  'knowledgeVersioningStatus',
  // A-03.5 canonical-model authorities (server-only):
  'blueprintId',
  'knowledgeBlueprintId',
  'requirementId',
  'knowledgeRequirementId',
  'itemVersionId',
  'knowledgeItemVersionId',
  'knowledgeAdministrationId',
  'knowledgeAdministration',
  'knowledgeResultId',
  'evidenceStatus',
  'canonicalItemVersion',
] as const

export class KnowledgeVersioningError extends Error {
  code: 'CONFIGURATION_ERROR' | 'INTERNAL_ERROR'
  constructor(code: 'CONFIGURATION_ERROR' | 'INTERNAL_ERROR', message: string) {
    super(message)
    this.code = code
    this.name = 'KnowledgeVersioningError'
  }
}

/**
 * Returns true (plus the offending field) when the client body carries any
 * governance field. Used by public/apply to reject the request (fail-closed).
 */
export function findClientGovernanceField(body: Record<string, unknown>): string | null {
  for (const field of KNOWLEDGE_CLIENT_DENYLIST) {
    if (body !== null && typeof body === 'object' && field in body) {
      // NOTE: a field explicitly set to undefined is not present in JSON bodies;
      // `in` only sees actually-transmitted keys. Safe for all Next JSON bodies.
      return field
    }
  }
  return null
}

// ────────────────────────────────────────────────────────────────
// Bank resolution — mirrors the EXACT precedence of the legacy
// public/apply GET step 4: vacancy questions first, template
// (CONOCIMIENTOS) questions only when the vacancy has none.
// ────────────────────────────────────────────────────────────────

export interface BankItem {
  itemId: string
  itemType: 'VACANCY_QUESTION' | 'TEMPLATE_QUESTION'
  text: string
  options: string[]
  type: string
  order: number
  correctAnswer: number | null
}

export interface ResolvedBank {
  source: 'VACANCY_BANK' | 'TEMPLATE_BANK' | 'EMPTY'
  items: BankItem[]
}

function parseOptions(raw: string | null, itemId: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      throw new Error('options is not an array')
    }
    return parsed.map((o) => String(o))
  } catch (err) {
    // Corrupt bank data → the administration cannot be frozen faithfully.
    // Fail-closed (PASO 8) instead of silently freezing garbage.
    throw new KnowledgeVersioningError(
      'CONFIGURATION_ERROR',
      `Knowledge bank item ${itemId} has corrupt options JSON`
    )
  }
}

/**
 * Resolve the knowledge items that WOULD be administered for a vacancy.
 * Same precedence as the legacy GET step 4 (vacancy questions else template).
 */
export async function resolveKnowledgeBank(
  db: DbClient,
  vacancy: { id: string; companyId: string }
): Promise<ResolvedBank> {
  // 1) Vacancy custom questions (the administered set when present)
  const vacancyQuestions = await db.vacancyQuestion.findMany({
    where: { vacancyId: vacancy.id },
    orderBy: { order: 'asc' },
  })

  if (vacancyQuestions.length > 0) {
    return {
      source: 'VACANCY_BANK',
      items: vacancyQuestions.map((q) => ({
        itemId: q.id,
        itemType: 'VACANCY_QUESTION' as const,
        text: q.text,
        options: parseOptions(q.options, q.id),
        type: q.type,
        order: q.order,
        correctAnswer: q.correctAnswer ?? null,
      })),
    }
  }

  // 2) Fallback: template CONOCIMIENTOS questions — same selection as
  //    getSystemQuestions (first Position of the company).
  const position = await db.position.findFirst({
    where: { companyId: vacancy.companyId },
    include: {
      evaluationTemplates: {
        where: { type: 'CONOCIMIENTOS' },
        include: { questions: true },
      },
    },
  })

  if (!position) return { source: 'EMPTY', items: [] }

  const template = position.evaluationTemplates.find((t) => t.type === 'CONOCIMIENTOS')
  if (!template) return { source: 'EMPTY', items: [] }

  return {
    source: 'TEMPLATE_BANK',
    items: template.questions.map((q) => ({
      itemId: q.id,
      itemType: 'TEMPLATE_QUESTION' as const,
      text: q.text,
      options: parseOptions(q.options, q.id),
      type: q.type,
      order: q.order,
      correctAnswer: q.correctAnswer ?? null,
    })),
  }
}

// ────────────────────────────────────────────────────────────────
// Canonical content hash
// ────────────────────────────────────────────────────────────────

function itemCanonicalString(item: BankItem): string {
  return [
    item.itemType,
    item.itemId,
    item.text,
    item.options.join('\u0000'),
    item.correctAnswer === null ? 'NO_KEY' : String(item.correctAnswer),
    String(item.order),
    item.type,
  ].join('\u0001')
}

export function canonicalBankHash(items: BankItem[]): string {
  const canonical = items.map(itemCanonicalString).join('\u0002')
  return crypto.createHash('sha256').update(canonical).digest('hex')
}

// ────────────────────────────────────────────────────────────────
// Publishing — reuse the ACTIVE version when the bank is unchanged,
// otherwise publish a new version (KA-v{n+1}) with itemVersion bumps.
// Immutability: existing KnowledgeAssessment rows are NEVER modified
// except the status transition ACTIVE→RETIRED of the superseded one.
// ────────────────────────────────────────────────────────────────

export interface FrozenAssessment {
  id: string
  version: number
  blueprintVersion: string
  scoringVersion: string
  contentHash: string
  itemCount: number
  status: string
  published: boolean // true when a NEW version was created by this call
}

/**
 * A-03.4 compat wrapper — publication now flows through the SINGLE canonical
 * engine (src/lib/knowledge-canonical.ts). The returned shape is preserved
 * for existing callers; new code must call resolveCanonicalKnowledgeAssessment.
 */
export async function publishAssessmentForBank(
  db: DbClient,
  vacancy: { id: string; companyId: string }
): Promise<{ assessment: FrozenAssessment; bank: ResolvedBank }> {
  const { resolveCanonicalKnowledgeAssessment, jobFromVacancy } = await import('./knowledge-canonical')
  const resolution = await resolveCanonicalKnowledgeAssessment(db, jobFromVacancy(vacancy))
  return {
    assessment: {
      id: resolution.assessment.id,
      version: resolution.assessment.version,
      blueprintVersion: resolution.assessment.blueprintVersion,
      scoringVersion: resolution.assessment.scoringVersion,
      contentHash: resolution.assessment.contentHash,
      itemCount: resolution.assessment.itemCount,
      status: resolution.assessment.status,
      published: resolution.assessment.published,
    },
    bank: resolution.bank,
  }
}

function safeParseQuestionSnapshot(raw: string): { text?: string; options?: string[] } | null {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────────
// Freezing an application — called inside the SAME transaction that
// creates the VacancyApplication, so a versioning failure leaves NO
// partially-versioned evaluation behind (PASO 8).
// ────────────────────────────────────────────────────────────────

export interface KnowledgeFreeze {
  status: 'VERSIONED' | 'NOT_APPLICABLE'
  assessmentId: string | null
  assessmentVersion: number | null
  blueprintVersion: string | null
  scoringVersion: string | null
  administrationId?: string | null
}

export async function freezeKnowledgeForApplication(
  db: DbClient,
  applicationId: string,
  vacancy: { id: string; companyId: string }
): Promise<KnowledgeFreeze> {
  const { resolveCanonicalKnowledgeAssessment, freezeAdministrationForCandidate, jobFromVacancy } =
    await import('./knowledge-canonical')

  const resolution = await resolveCanonicalKnowledgeAssessment(db, jobFromVacancy(vacancy))

  if (resolution.status === 'NOT_APPLICABLE') {
    await db.vacancyApplication.update({
      where: { id: applicationId },
      data: { knowledgeVersioningStatus: 'NOT_APPLICABLE' },
    })
    return {
      status: 'NOT_APPLICABLE',
      assessmentId: null,
      assessmentVersion: null,
      blueprintVersion: null,
      scoringVersion: KNOWLEDGE_SCORING_VERSION,
    }
  }

  // A-03.5: the administration is a REAL entity bound to the application.
  const administration = await freezeAdministrationForCandidate(db, {
    channel: 'PUBLIC_VACANCY',
    companyId: vacancy.companyId,
    assessmentId: resolution.assessment.id,
    assessmentVersion: resolution.assessment.version,
    blueprintId: resolution.blueprintId,
    blueprintVersion: resolution.blueprintVersion ?? '',
    scoringVersion: resolution.assessment.scoringVersion,
    itemCount: resolution.assessment.itemCount,
    applicationId,
  })

  await db.vacancyApplication.update({
    where: { id: applicationId },
    data: {
      knowledgeAssessmentId: resolution.assessment.id,
      knowledgeAssessmentVersion: resolution.assessment.version,
      knowledgeBlueprintVersion: resolution.assessment.blueprintVersion,
      knowledgeScoringVersion: resolution.assessment.scoringVersion,
      knowledgeFrozenAt: new Date(),
      knowledgeVersioningStatus: 'VERSIONED',
    },
  })

  return {
    status: 'VERSIONED',
    assessmentId: resolution.assessment.id,
    assessmentVersion: resolution.assessment.version,
    blueprintVersion: resolution.assessment.blueprintVersion,
    scoringVersion: resolution.assessment.scoringVersion,
    administrationId: administration.id,
  }
}

// ────────────────────────────────────────────────────────────────
// Scoring — completedStep 4 against the FROZEN administration.
// The live bank is NEVER consulted for a VERSIONED application.
// Keyless items are excluded from the denominator (K-INS: an item
// without a valid key is NOT scored — never scored as 0-correct).
// ────────────────────────────────────────────────────────────────

export interface FrozenKnowledgeScore {
  knowledgeScore: number | null
  scoringVersion: string
  keyedAnswered: number
  correct: number
}

export async function scoreKnowledgeFromFrozenAdministration(
  db: DbClient,
  application: {
    id: string
    knowledgeAssessmentId: string | null
    knowledgeScoringVersion: string | null
  }
): Promise<FrozenKnowledgeScore> {
  if (!application.knowledgeAssessmentId) {
    throw new KnowledgeVersioningError(
      'INTERNAL_ERROR',
      'VERSIONED application is missing knowledgeAssessmentId'
    )
  }

  const frozenItems = await db.knowledgeAssessmentItem.findMany({
    where: { assessmentId: application.knowledgeAssessmentId },
  })
  if (frozenItems.length === 0) {
    throw new KnowledgeVersioningError(
      'CONFIGURATION_ERROR',
      'Frozen administration has no items — refusing to score'
    )
  }
  const frozenByKey = new Map(frozenItems.map((i) => [i.itemId, i]))

  const responses = await db.vacancyApplicationResponse.findMany({
    where: { applicationId: application.id, section: 'CONOCIMIENTOS' },
  })

  let keyedAnswered = 0
  let correct = 0
  for (const resp of responses) {
    const joinKey = resp.vacancyQuestionId ?? resp.questionId ?? ''
    const frozen = frozenByKey.get(joinKey)

    if (!frozen) {
      // A response outside the frozen administration means data corruption
      // (the answer step blocks non-administration items). Fail closed.
      throw new KnowledgeVersioningError(
        'CONFIGURATION_ERROR',
        `Response ${resp.id} references item outside the frozen administration`
      )
    }
    if (!frozen.hasKey || frozen.correctAnswerSnapshot === null) continue // not scorable

    keyedAnswered++
    const selected = parseInt(resp.value, 10)
    if (Number.isFinite(selected) && selected === frozen.correctAnswerSnapshot) correct++
  }

  const knowledgeScore =
    keyedAnswered > 0
      ? Math.round((correct / keyedAnswered) * 100 * 100) / 100
      : null // no valid keyed evidence → INSUFFICIENT semantics, NEVER 0

  return {
    knowledgeScore,
    scoringVersion: application.knowledgeScoringVersion ?? KNOWLEDGE_SCORING_VERSION,
    keyedAnswered,
    correct,
  }
}
