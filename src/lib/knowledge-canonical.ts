/**
 * A-03.5 — CANONICAL KNOWLEDGE MODEL
 * ===================================
 * Unifies the internal (Position) and public (Vacancy) flows under ONE
 * canonical model:
 *
 *   JOB (Position | Vacancy)
 *     → KnowledgeBlueprint        (jobId + blueprintVersion — job-specific
 *                                  knowledge structure; the global
 *                                  Question.category is NEVER a substitute)
 *       → KnowledgeRequirement    (blueprintId; domain/subdomain/description/
 *                                  importance/source/rationale/version/status)
 *         → KnowledgeItemVersion  (requirementId + itemId + itemVersion;
 *                                  question/options/correctAnswer PROTECTED)
 *           → KnowledgeAssessment (jobId + blueprintId + assessmentVersion +
 *                                  scoringVersion; published by SYSTEM only)
 *             → KnowledgeAssessmentItem (frozen administration copy)
 *               → KnowledgeAdministration (candidate binding; what the
 *                                          candidate received)
 *                 → Response (server snapshots)
 *                   → KnowledgeResult (evidence status; INSUFFICIENT ≠ 0;
 *                                      explicitly separate from overallScore)
 *
 * Both channels (PUBLIC_VACANCY / INTERNAL_POSITION) resolve through the
 * exact same functions in this file — the channel cannot change the
 * instrument (PASO 16 cross-flow invariant).
 *
 * Versioning semantics (preserving A-03.4):
 *   - assessmentVersion bumps when the bank CONTENT hash changes.
 *   - blueprintVersion bumps only when the derived REQUIREMENT STRUCTURE
 *     changes (a key change is scoring material, not structure).
 *   - itemVersion bumps only when that item's content (text/options/key)
 *     changes relative to the latest published edition of the item.
 *   - A published KnowledgeItemVersion row NEVER changes its requirement
 *     (PASO 17): re-linking is impossible; a content change creates a new
 *     edition instead.
 *   - A content-unchanged item REUSES its existing itemVersion row (its
 *     requirement lineage is preserved verbatim).
 *
 * Authority (PASO 13): every entity in this file is created exclusively by
 * the SYSTEM publisher inside the freeze transaction. AI code has no write
 * path here; AI-sourced bank rows are marked origin='AI_DRAFT' and their
 * canonical derivatives keep source='AI_DRAFT' provenance, but approval and
 * publication remain SYSTEM-only.
 *
 * Fail-closed: any failure to determine the full canonical chain aborts the
 * freeze with KnowledgeVersioningError (no partial administrations).
 */

import crypto from 'crypto'
import type { Prisma, PrismaClient } from '@prisma/client'
import {
  KnowledgeVersioningError,
  canonicalBankHash,
  resolveKnowledgeBank,
  type BankItem,
  type DbClient,
  type ResolvedBank,
} from './knowledge-versioning'

type UnwrappedDb = PrismaClient | Prisma.TransactionClient

// ────────────────────────────────────────────────────────────────
// Retryable freeze errors — SQLite contention under parallel freezes
// (PASO 14). Unique races (P2002) and transient "database is locked"
// errors are safe to retry: the freeze re-reads the winner's rows and
// converges on the SAME published version.
// ────────────────────────────────────────────────────────────────

export function isRetryableFreezeError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false
  const code = (err as { code?: string }).code
  // P2002 unique race; P2028 interactive-transaction timeout under contention.
  if (code === 'P2002' || code === 'P2028') return true
  const msg = err instanceof Error ? err.message : String(err)
  return /database is locked|database table is locked|SQLITE_BUSY|Socket timeout|Transaction already closed/i.test(msg)
}

// ────────────────────────────────────────────────────────────────
// Job abstraction — the canonical chain starts at a JOB, which is a
// Position (internal channel) or a Vacancy (public channel).
// ────────────────────────────────────────────────────────────────

export type KnowledgeJobType = 'POSITION' | 'VACANCY'

export interface CanonicalJob {
  jobId: string
  jobType: KnowledgeJobType
  companyId: string
}

export function jobFromVacancy(v: { id: string; companyId: string }): CanonicalJob {
  return { jobId: v.id, jobType: 'VACANCY', companyId: v.companyId }
}

export function jobFromPosition(p: { id: string; companyId: string }): CanonicalJob {
  return { jobId: p.id, jobType: 'POSITION', companyId: p.companyId }
}

// ────────────────────────────────────────────────────────────────
// Bank resolution — generalized to both job types. The precedence for a
// VACANCY is byte-identical to the A-03.4/legacy public flow (vacancy
// questions first, CONOCIMIENTOS template of the company's first position
// as fallback). A POSITION administers its own CONOCIMIENTOS template.
// ────────────────────────────────────────────────────────────────

export interface CanonicalBankItem extends BankItem {
  /** Provenance of the bank row ('RH_MANUAL' | 'AI_DRAFT' | null for legacy rows). */
  origin: string | null
}

export interface CanonicalResolvedBank extends ResolvedBank {
  items: CanonicalBankItem[]
}

export async function resolveKnowledgeBankForJob(
  db: DbClient,
  job: CanonicalJob
): Promise<CanonicalResolvedBank> {
  if (job.jobType === 'VACANCY') {
    const resolved = await resolveKnowledgeBank(db, { id: job.jobId, companyId: job.companyId })
    if (resolved.source === 'VACANCY_BANK') {
      // Enrich with provenance in the same order.
      const rows = await db.vacancyQuestion.findMany({
        where: { vacancyId: job.jobId },
        orderBy: { order: 'asc' },
        select: { id: true, origin: true },
      })
      const originById = new Map(rows.map((r) => [r.id, r.origin]))
      return {
        source: resolved.source,
        items: resolved.items.map((i) => ({
          ...i,
          origin: originById.get(i.itemId) ?? null,
        })),
      }
    }
    // TEMPLATE_BANK fallback (or EMPTY): template questions carry no origin column.
    return { source: resolved.source, items: resolved.items.map((i) => ({ ...i, origin: null })) }
  }

  // POSITION — the internal channel administers the CONOCIMIENTOS template of
  // THIS position only (never another job's template).
  const position = await db.position.findUnique({
    where: { id: job.jobId },
    include: {
      evaluationTemplates: {
        where: { type: 'CONOCIMIENTOS', active: true },
        include: { questions: { orderBy: { order: 'asc' } } },
      },
    },
  })
  if (!position || position.companyId !== job.companyId) {
    return { source: 'EMPTY', items: [] }
  }
  const template = position.evaluationTemplates.find((t) => t.type === 'CONOCIMIENTOS')
  if (!template) return { source: 'EMPTY', items: [] }

  return {
    source: 'TEMPLATE_BANK',
    items: template.questions.map((q) => ({
      itemId: q.id,
      itemType: 'TEMPLATE_QUESTION' as const,
      text: q.text,
      options: parseOptionsCanonical(q.options, q.id),
      type: q.type,
      order: q.order,
      correctAnswer: q.correctAnswer ?? null,
      origin: null,
    })),
  }
}

function parseOptionsCanonical(raw: string | null, itemId: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error('not an array')
    return parsed.map((o) => String(o))
  } catch {
    throw new KnowledgeVersioningError(
      'CONFIGURATION_ERROR',
      `Knowledge bank item ${itemId} has corrupt options JSON`
    )
  }
}

// ────────────────────────────────────────────────────────────────
// Requirement derivation — deterministic, server-side, no invention.
// The only honest knowledge signal available on a bank row is its
// question text, so the requirement description is derived from it.
// domain/subdocument reflect the bank provenance, never the global
// Question.category (PASO 3: category is not a blueprint substitute).
// ────────────────────────────────────────────────────────────────

const REQUIREMENT_DOMAIN = 'JOB_KNOWLEDGE'

function deriveSubdomain(bankSource: string): string {
  return bankSource === 'VACANCY_BANK' ? 'VACANCY_BANK' : 'POSITION_TEMPLATE'
}

function deriveRequirementDescription(item: CanonicalBankItem): string {
  const trimmed = item.text.trim().replace(/\s+/g, ' ')
  return `Conocimiento verificado por el ítem: "${trimmed}"`
}

function deriveRequirementSource(item: CanonicalBankItem): string {
  return item.origin === 'AI_DRAFT' ? 'AI_DRAFT_ORIGIN' : 'SYSTEM_DERIVED'
}

function deriveRequirementRationale(item: CanonicalBankItem, job: CanonicalJob): string {
  const originLabel = item.origin === 'AI_DRAFT' ? 'borrador IA (sin autoridad de aprobación)' : 'banco curado'
  const channelLabel = job.jobType === 'VACANCY' ? 'vacante' : 'puesto'
  return `Derivado canónicamente (A-03.5) del ítem del banco ${item.itemId} para el ${channelLabel}; origen: ${originLabel}.`
}

/** Structure hash — the blueprint changes ONLY when this changes. Keys and
 * option order are scoring content, NOT knowledge structure. */
function requirementStructureString(item: CanonicalBankItem): string {
  return [
    item.itemId,
    REQUIREMENT_DOMAIN,
    deriveSubdomain(bankSourceOf(item)),
    deriveRequirementDescription(item),
    'REQUIRED',
  ].join('\u0001')
}

function bankSourceOf(item: CanonicalBankItem): string {
  return item.itemType === 'VACANCY_QUESTION' ? 'VACANCY_BANK' : 'TEMPLATE_BANK'
}

export function canonicalStructureHash(items: CanonicalBankItem[]): string {
  const canonical = items
    .map(requirementStructureString)
    .sort()
    .join('\u0002')
  return crypto.createHash('sha256').update(canonical).digest('hex')
}

/** Content hash of one item — identical rule to the A-03.4 itemVersion bump. */
function itemContentHash(item: CanonicalBankItem): string {
  return crypto
    .createHash('sha256')
    .update(
      [
        item.text,
        item.options.join('\u0000'),
        item.correctAnswer === null ? 'NO_KEY' : String(item.correctAnswer),
      ].join('\u0001')
    )
    .digest('hex')
}

// ────────────────────────────────────────────────────────────────
// Canonical resolution — ONE entry point for both channels.
// ────────────────────────────────────────────────────────────────

export interface CanonicalAssessmentDescriptor {
  id: string
  version: number
  blueprintId: string | null
  blueprintVersion: string
  scoringVersion: string
  contentHash: string
  itemCount: number
  status: string
  published: boolean // true when a NEW version was created by this call
  canonical: boolean // true when backed by a canonical blueprint
  structureHash: string
}

export interface CanonicalResolution {
  status: 'VERSIONED' | 'NOT_APPLICABLE'
  assessment: CanonicalAssessmentDescriptor
  bank: CanonicalResolvedBank
  blueprintId: string | null
  blueprintVersion: string | null
}

export async function resolveCanonicalKnowledgeAssessment(
  db: DbClient,
  job: CanonicalJob
): Promise<CanonicalResolution> {
  const bank = await resolveKnowledgeBankForJob(db, job)

  if (bank.items.length === 0) {
    return {
      status: 'NOT_APPLICABLE',
      assessment: {
        id: '',
        version: 0,
        blueprintId: null,
        blueprintVersion: '',
        scoringVersion: 'PUB-KS-v1',
        contentHash: '',
        itemCount: 0,
        status: 'NOT_APPLICABLE',
        published: false,
        canonical: false,
        structureHash: '',
      },
      bank,
      blueprintId: null,
      blueprintVersion: null,
    }
  }

  const contentHash = canonicalBankHash(bank.items)
  const structureHash = canonicalStructureHash(bank.items)

  // Latest assessment for THIS job (channel-scoped, never another job's).
  const latest =
    job.jobType === 'VACANCY'
      ? await db.knowledgeAssessment.findFirst({
          where: { vacancyId: job.jobId },
          orderBy: { version: 'desc' },
          include: { items: true },
        })
      : await db.knowledgeAssessment.findFirst({
          where: { positionId: job.jobId },
          orderBy: { version: 'desc' },
          include: { items: true },
        })

  // Unchanged bank AND canonical assessment already published → reuse it.
  // (A pre-canonical latest assessment is NOT reused: new administrations
  // must receive the full canonical chain. The historical assessment rows
  // are never touched.)
  if (latest && latest.contentHash === contentHash && latest.blueprintId) {
    return {
      status: 'VERSIONED',
      assessment: {
        id: latest.id,
        version: latest.version,
        blueprintId: latest.blueprintId,
        blueprintVersion: latest.blueprintVersion,
        scoringVersion: latest.scoringVersion,
        contentHash: latest.contentHash,
        itemCount: latest.itemCount,
        status: latest.status,
        published: false,
        canonical: true,
        structureHash,
      },
      bank,
      blueprintId: latest.blueprintId,
      blueprintVersion: latest.blueprintVersion,
    }
  }

  // ── Publish path: resolve/create the canonical blueprint ──
  const blueprint = await resolveCanonicalBlueprint(db, job, bank, structureHash)

  // ── Resolve/create item versions and bind them to requirements ──
  const requirementByItemId = new Map(
    (await db.knowledgeRequirement.findMany({ where: { blueprintId: blueprint.id } })).map((r) => [
      r.sourceItemId,
      r,
    ])
  )

  const itemBindings: Array<{
    bankItem: CanonicalBankItem
    itemVersionId: string
    itemVersionNumber: number
    requirementId: string
  }> = []

  for (const bankItem of bank.items) {
    const requirement = requirementByItemId.get(bankItem.itemId)
    // PASO 17 (fail-closed): an administered item without a requirement must
    // never be published.
    if (!requirement) {
      throw new KnowledgeVersioningError(
        'CONFIGURATION_ERROR',
        `Item ${bankItem.itemId} has no canonical requirement in blueprint ${blueprint.id}`
      )
    }

    // PASO 14 (concurrency): parallel freezes may race on the item edition
    // unique index (itemId, itemVersion). On a unique violation, re-read the
    // winner's edition: reuse it when the content matches, otherwise retry
    // with a bumped number.
    let binding: {
      bankItem: CanonicalBankItem
      itemVersionId: string
      itemVersionNumber: number
      requirementId: string
    } | null = null

    for (let attempt = 0; attempt <= 3; attempt++) {
      const latestEdition = await db.knowledgeItemVersion.findFirst({
        where: { itemId: bankItem.itemId },
        orderBy: { itemVersion: 'desc' },
      })

      if (latestEdition && latestEdition.correctAnswer === bankItem.correctAnswer) {
        const sameHash =
          latestEdition.question === bankItem.text &&
          safeOptionsEqual(latestEdition.options, bankItem.options)
        if (sameHash) {
          // Content unchanged → reuse the existing edition (lineage preserved).
          binding = {
            bankItem,
            itemVersionId: latestEdition.id,
            itemVersionNumber: latestEdition.itemVersion,
            requirementId: latestEdition.requirementId,
          }
          break
        }
      }

      // Content changed (or first edition) → new immutable edition bound to
      // the CURRENT blueprint's requirement.
      const nextNumber = (latestEdition?.itemVersion ?? 0) + 1
      try {
        const created = await db.knowledgeItemVersion.create({
          data: {
            requirementId: requirement.id,
            itemId: bankItem.itemId,
            itemType: bankItem.itemType,
            itemVersion: nextNumber,
            question: bankItem.text,
            options: JSON.stringify(bankItem.options),
            correctAnswer: bankItem.correctAnswer,
            hasKey: bankItem.correctAnswer !== null,
            source: bankItem.origin === 'AI_DRAFT' ? 'AI_DRAFT' : bankSourceOf(bankItem),
            rationale: deriveRequirementRationale(bankItem, job),
            difficulty: 'UNKNOWN', // never invented (KD rules)
            status: 'APPROVED', // approved only through SYSTEM publication (PASO 13)
          },
        })
        binding = {
          bankItem,
          itemVersionId: created.id,
          itemVersionNumber: created.itemVersion,
          requirementId: created.requirementId,
        }
        break
      } catch (err) {
        if (!isRetryableFreezeError(err) || attempt === 3) throw err
        // loop: re-read the winner's edition and decide reuse vs bump
      }
    }

    if (!binding) {
      throw new KnowledgeVersioningError(
        'INTERNAL_ERROR',
        `Could not resolve an item edition for item ${bankItem.itemId}`
      )
    }
    itemBindings.push(binding)
  }

  // ── Publish the next assessment version ──
  // PASO 14 (concurrency): two transactions may both observe "no version for
  // the new hash" and race on the (job, version) unique index. The loser
  // retries: it re-reads the winner's just-published assessment and, when the
  // bank hash matches, REUSES it — both candidates end on the SAME version.
  const PUBLISH_RETRIES = 3
  let created: { id: string; version: number; blueprintVersion: string; scoringVersion: string; contentHash: string; itemCount: number; status: string } | null =
    null
  for (let attempt = 0; attempt <= PUBLISH_RETRIES; attempt++) {
    const currentLatest = await (job.jobType === 'VACANCY'
      ? db.knowledgeAssessment.findFirst({ where: { vacancyId: job.jobId }, orderBy: { version: 'desc' } })
      : db.knowledgeAssessment.findFirst({ where: { positionId: job.jobId }, orderBy: { version: 'desc' } }))

    if (currentLatest && currentLatest.contentHash === contentHash) {
      // Another concurrent freeze just published this exact bank state.
      created = currentLatest
      break
    }

    const nextVersion = (currentLatest?.version ?? 0) + 1
    const isCanonicalMigration =
      !!currentLatest && currentLatest.contentHash === contentHash && !currentLatest.blueprintId

    try {
      if (job.jobType === 'VACANCY') {
        await db.knowledgeAssessment.updateMany({
          where: { vacancyId: job.jobId, status: 'ACTIVE' },
          data: { status: 'RETIRED', retiredAt: new Date() },
        })
      } else {
        await db.knowledgeAssessment.updateMany({
          where: { positionId: job.jobId, status: 'ACTIVE' },
          data: { status: 'RETIRED', retiredAt: new Date() },
        })
      }

      created = await db.knowledgeAssessment.create({
        data: {
          jobType: job.jobType,
          vacancyId: job.jobType === 'VACANCY' ? job.jobId : null,
          positionId: job.jobType === 'POSITION' ? job.jobId : null,
          companyId: job.companyId,
          version: nextVersion,
          blueprintId: blueprint.id,
          blueprintVersion: blueprint.blueprintVersion,
          scoringVersion: 'PUB-KS-v1',
          status: 'ACTIVE',
          contentHash,
          itemCount: bank.items.length,
          publishSource: isCanonicalMigration
            ? 'SYSTEM_ON_CANONICAL_MIGRATION'
            : currentLatest
              ? 'SYSTEM_ON_BANK_CHANGE'
              : 'SYSTEM_BOOTSTRAP',
          publishedBy: 'SYSTEM:KNOWLEDGE_FREEZE',
          publishedAt: new Date(),
          items: {
            create: itemBindings.map((binding) => ({
              itemId: binding.bankItem.itemId,
              itemType: binding.bankItem.itemType,
              itemVersion: binding.itemVersionNumber,
              order: binding.bankItem.order,
              questionSnapshot: JSON.stringify({
                text: binding.bankItem.text,
                options: binding.bankItem.options,
                type: binding.bankItem.type,
              }),
              correctAnswerSnapshot: binding.bankItem.correctAnswer,
              hasKey: binding.bankItem.correctAnswer !== null,
              difficulty: 'UNKNOWN',
              source: bankSourceOf(binding.bankItem),
              requirementId: binding.requirementId,
              itemVersionId: binding.itemVersionId,
            })),
          },
        },
      })
      break
    } catch (err) {
      // Unique/lock race → another freeze published first; retry.
      if (isRetryableFreezeError(err) && attempt < PUBLISH_RETRIES) continue
      throw err
    }
  }

  if (!created) {
    throw new KnowledgeVersioningError(
      'INTERNAL_ERROR',
      'Concurrent publish retries exhausted without a usable assessment version'
    )
  }

  return {
    status: 'VERSIONED',
    assessment: {
      id: created.id,
      version: created.version,
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.blueprintVersion,
      scoringVersion: created.scoringVersion,
      contentHash: created.contentHash,
      itemCount: created.itemCount,
      status: created.status,
      published: true,
      canonical: true,
      structureHash,
    },
    bank,
    blueprintId: blueprint.id,
    blueprintVersion: blueprint.blueprintVersion,
  }
}

function safeOptionsEqual(storedJson: string, options: string[]): boolean {
  try {
    const parsed = JSON.parse(storedJson)
    if (!Array.isArray(parsed)) return false
    return parsed.map(String).join('\u0000') === options.join('\u0000')
  } catch {
    return false
  }
}

// ────────────────────────────────────────────────────────────────
// Blueprint resolution — reuse when the requirement structure is unchanged.
// ────────────────────────────────────────────────────────────────

async function resolveCanonicalBlueprint(
  db: DbClient,
  job: CanonicalJob,
  bank: CanonicalResolvedBank,
  structureHash: string
): Promise<{ id: string; blueprintVersion: string; created: boolean }> {
  const latest = await db.knowledgeBlueprint.findFirst({
    where: { jobId: job.jobId, jobType: job.jobType },
    orderBy: { createdAt: 'desc' },
  })

  if (latest && latest.contentHash === structureHash) {
    return { id: latest.id, blueprintVersion: latest.blueprintVersion, created: false }
  }

  // Structure changed → retire the previous blueprint generation (the row and
  // its requirements remain immutable for historical administrations).
  if (latest) {
    await db.knowledgeBlueprint.updateMany({
      where: { jobId: job.jobId, jobType: job.jobType, status: 'ACTIVE' },
      data: { status: 'RETIRED' },
    })
  }

  // PASO 14 (concurrency): parallel freezes may race on the blueprint unique
  // index. On a unique violation, re-read: the winner's blueprint is reused
  // when the structure matches, otherwise the numbering retries.
  const BP_RETRIES = 3
  for (let attempt = 0; attempt <= BP_RETRIES; attempt++) {
    const nextVersionNumber = await nextBlueprintVersion(db, job)
    try {
      const created = await db.knowledgeBlueprint.create({
        data: {
          jobId: job.jobId,
          jobType: job.jobType,
          companyId: job.companyId,
          blueprintVersion: `BP-v${nextVersionNumber}`,
          status: 'ACTIVE',
          contentHash: structureHash,
          derivedFrom: 'SYSTEM:CANONICAL_DERIVATION',
          requirements: {
            create: bank.items.map((item) => ({
              domain: REQUIREMENT_DOMAIN,
              subdomain: deriveSubdomain(bankSourceOf(item)),
              description: deriveRequirementDescription(item),
              importance: 'REQUIRED',
              source: deriveRequirementSource(item),
              rationale: deriveRequirementRationale(item, job),
              sourceItemId: item.itemId,
              version: 1,
              status: 'APPROVED', // SYSTEM publication authority only (PASO 13)
            })),
          },
        },
      })
      return { id: created.id, blueprintVersion: created.blueprintVersion, created: true }
    } catch (err) {
      if (!isRetryableFreezeError(err) || attempt === BP_RETRIES) throw err
      const winner = await db.knowledgeBlueprint.findFirst({
        where: { jobId: job.jobId, jobType: job.jobType },
        orderBy: { createdAt: 'desc' },
      })
      if (winner && winner.contentHash === structureHash) {
        return { id: winner.id, blueprintVersion: winner.blueprintVersion, created: false }
      }
    }
  }
  throw new KnowledgeVersioningError('INTERNAL_ERROR', 'Blueprint publish retries exhausted')
}

async function nextBlueprintVersion(db: UnwrappedDb, job: CanonicalJob): Promise<number> {
  const blueprints = await db.knowledgeBlueprint.findMany({
    where: { jobId: job.jobId, jobType: job.jobType },
    select: { blueprintVersion: true },
  })
  let max = 0
  for (const b of blueprints) {
    const match = /^BP-v(\d+)$/.exec(b.blueprintVersion)
    if (match) max = Math.max(max, parseInt(match[1], 10))
  }
  return max + 1
}

// ────────────────────────────────────────────────────────────────
// KnowledgeAdministration — WHAT the candidate received, as a real entity.
// Created ONCE per application/session inside the freeze transaction.
// ────────────────────────────────────────────────────────────────

export interface AdministrationFreeze {
  id: string
  channel: string
  assessmentVersion: number
  blueprintVersion: string
  scoringVersion: string
}

export async function freezeAdministrationForCandidate(
  db: DbClient,
  params: {
    channel: 'PUBLIC_VACANCY' | 'INTERNAL_POSITION'
    companyId: string
    assessmentId: string
    assessmentVersion: number
    blueprintId: string | null
    blueprintVersion: string
    scoringVersion: string
    itemCount: number
    applicationId?: string
    sessionId?: string
  }
): Promise<AdministrationFreeze> {
  if (params.channel === 'PUBLIC_VACANCY' && !params.applicationId) {
    throw new KnowledgeVersioningError('INTERNAL_ERROR', 'PUBLIC_VACANCY administration requires applicationId')
  }
  if (params.channel === 'INTERNAL_POSITION' && !params.sessionId) {
    throw new KnowledgeVersioningError('INTERNAL_ERROR', 'INTERNAL_POSITION administration requires sessionId')
  }

  const administration = await db.knowledgeAdministration.create({
    data: {
      channel: params.channel,
      companyId: params.companyId,
      assessmentId: params.assessmentId,
      assessmentVersion: params.assessmentVersion,
      blueprintId: params.blueprintId,
      blueprintVersion: params.blueprintVersion,
      scoringVersion: params.scoringVersion,
      itemCount: params.itemCount,
      status: 'FROZEN',
      vacancyApplicationId: params.applicationId ?? null,
      evaluationSessionId: params.sessionId ?? null,
    },
  })
  return {
    id: administration.id,
    channel: administration.channel,
    assessmentVersion: administration.assessmentVersion,
    blueprintVersion: administration.blueprintVersion,
    scoringVersion: administration.scoringVersion,
  }
}

// ────────────────────────────────────────────────────────────────
// Canonical scoring — ONE engine for both channels (PASO 10/16).
// Math identical to A-03.4: keyed-only denominator; null (INSUFFICIENT)
// when there is no valid keyed evidence — knowledgeScore is NEVER 0 for
// missing evidence. The approved A-03.2 criterion is unchanged.
// ────────────────────────────────────────────────────────────────

export interface CanonicalKnowledgeScore {
  knowledgeScore: number | null
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'INVALID'
  reasonCode: 'COMPLETE_KEYED' | 'PARTIAL_RESPONSE' | 'NO_KEYED_EVIDENCE' | 'KNOWLEDGE_KEY_MISSING'
  correctCount: number
  keyedAnsweredCount: number
  notScorableCount: number
  totalItems: number
  totalKeyedItems: number
  scoringVersion: string
}

export async function scoreCanonicalAdministration(
  db: DbClient,
  administrationId: string
): Promise<CanonicalKnowledgeScore> {
  const administration = await db.knowledgeAdministration.findUnique({
    where: { id: administrationId },
  })
  if (!administration) {
    throw new KnowledgeVersioningError('INTERNAL_ERROR', `Administration ${administrationId} not found`)
  }

  const frozenItems = await db.knowledgeAssessmentItem.findMany({
    where: { assessmentId: administration.assessmentId },
  })
  if (frozenItems.length === 0) {
    throw new KnowledgeVersioningError(
      'CONFIGURATION_ERROR',
      'Frozen administration has no items — refusing to score'
    )
  }
  const frozenByKey = new Map(frozenItems.map((i) => [i.itemId, i]))

  interface RawResponse {
    id: string
    joinKey: string
    value: string
  }
  let rawResponses: RawResponse[] = []

  if (administration.channel === 'PUBLIC_VACANCY' && administration.vacancyApplicationId) {
    const rows = await db.vacancyApplicationResponse.findMany({
      where: {
        applicationId: administration.vacancyApplicationId,
        section: 'CONOCIMIENTOS',
      },
    })
    rawResponses = rows.map((r) => ({
      id: r.id,
      joinKey: r.vacancyQuestionId ?? r.questionId ?? '',
      value: r.value,
    }))
  } else if (administration.channel === 'INTERNAL_POSITION' && administration.evaluationSessionId) {
    const rows = await db.evaluationResponse.findMany({
      where: {
        sessionId: administration.evaluationSessionId,
        knowledgeAdministrationId: administrationId,
      },
    })
    rawResponses = rows.map((r) => ({ id: r.id, joinKey: r.questionId, value: r.value }))
  } else {
    throw new KnowledgeVersioningError(
      'INTERNAL_ERROR',
      `Administration ${administrationId} has no candidate binding`
    )
  }

  let keyedAnswered = 0
  let correct = 0
  let notScorable = 0
  for (const resp of rawResponses) {
    const frozen = frozenByKey.get(resp.joinKey)
    if (!frozen) {
      // A response outside the frozen administration is data corruption.
      throw new KnowledgeVersioningError(
        'CONFIGURATION_ERROR',
        `Response ${resp.id} references item outside the frozen administration`
      )
    }
    if (!frozen.hasKey || frozen.correctAnswerSnapshot === null) {
      notScorable++
      continue // not scorable (K-INS) — excluded, never scored as 0
    }
    keyedAnswered++
    const selected = parseInt(resp.value, 10)
    if (Number.isFinite(selected) && selected === frozen.correctAnswerSnapshot) correct++
  }

  const totalKeyedItems = frozenItems.filter((i) => i.hasKey && i.correctAnswerSnapshot !== null).length

  let knowledgeScore: number | null = null
  let evidenceStatus: CanonicalKnowledgeScore['evidenceStatus']
  let reasonCode: CanonicalKnowledgeScore['reasonCode']

  if (keyedAnswered === 0) {
    knowledgeScore = null // INSUFFICIENT semantics — never 0
    evidenceStatus = 'INSUFFICIENT'
    reasonCode = totalKeyedItems === 0 ? 'KNOWLEDGE_KEY_MISSING' : 'NO_KEYED_EVIDENCE'
  } else if (keyedAnswered >= totalKeyedItems) {
    knowledgeScore = Math.round((correct / keyedAnswered) * 100 * 100) / 100
    evidenceStatus = 'VALID'
    reasonCode = 'COMPLETE_KEYED'
  } else {
    knowledgeScore = Math.round((correct / keyedAnswered) * 100 * 100) / 100
    evidenceStatus = 'LIMITED'
    reasonCode = 'PARTIAL_RESPONSE'
  }

  return {
    knowledgeScore,
    evidenceStatus,
    reasonCode,
    correctCount: correct,
    keyedAnsweredCount: keyedAnswered,
    notScorableCount: notScorable,
    totalItems: frozenItems.length,
    totalKeyedItems,
    scoringVersion: administration.scoringVersion,
  }
}

/** Persist the KnowledgeResult — the knowledge evidence record, explicitly
 * separate from overallScore (PASO 11). Idempotent per administration. */
export async function writeKnowledgeResult(
  db: DbClient,
  administrationId: string,
  score: CanonicalKnowledgeScore
) {
  const administration = await db.knowledgeAdministration.findUnique({
    where: { id: administrationId },
  })
  if (!administration) {
    throw new KnowledgeVersioningError('INTERNAL_ERROR', `Administration ${administrationId} not found`)
  }
  const existing = await db.knowledgeResult.findUnique({ where: { administrationId } })
  const data = {
    knowledgeScore: score.knowledgeScore,
    evidenceStatus: score.evidenceStatus,
    reasonCode: score.reasonCode,
    correctCount: score.correctCount,
    keyedAnsweredCount: score.keyedAnsweredCount,
    notScorableCount: score.notScorableCount,
    totalItems: score.totalItems,
    scoringVersion: score.scoringVersion,
    computedAt: new Date(),
  }
  if (existing) {
    return db.knowledgeResult.update({ where: { administrationId }, data })
  }
  return db.knowledgeResult.create({
    data: { administrationId, companyId: administration.companyId, ...data },
  })
}

// ────────────────────────────────────────────────────────────────
// Legacy classification (PASO 12) — three buckets, NO migration,
// NO recalculation:
//   LEGACY  — no versioning information (pre-A-03.4 row)
//   KA-V1+  — a frozen versioned administration exists
//   UNKNOWN — contradictory state (e.g. VERSIONED flag but no assessment)
// ────────────────────────────────────────────────────────────────

export type KnowledgeGeneration = 'LEGACY' | 'KA-V1+' | 'UNKNOWN'

export function classifyKnowledgeGeneration(row: {
  knowledgeVersioningStatus?: string | null
  knowledgeAssessmentId?: string | null
  knowledgeAdministrationId?: string | null
  knowledgeAssessmentVersion?: number | null
  knowledgeScoringVersion?: string | null
}): KnowledgeGeneration {
  const hasAnyFreeze =
    row.knowledgeAssessmentId != null ||
    row.knowledgeAssessmentVersion != null ||
    row.knowledgeScoringVersion != null

  if (row.knowledgeVersioningStatus === 'VERSIONED' && row.knowledgeAssessmentId) {
    return 'KA-V1+'
  }
  if (hasAnyFreeze && row.knowledgeVersioningStatus !== 'NOT_APPLICABLE') {
    return 'KA-V1+'
  }
  if (row.knowledgeVersioningStatus === 'VERSIONED' && !row.knowledgeAssessmentId) {
    return 'UNKNOWN'
  }
  if (hasAnyFreeze && row.knowledgeVersioningStatus == null) {
    return 'UNKNOWN'
  }
  return 'LEGACY'
}

export function classifySessionKnowledgeGeneration(row: {
  knowledgeAdministrationId?: string | null
}): KnowledgeGeneration {
  if (row.knowledgeAdministrationId) return 'KA-V1+'
  // A session with no administration predates A-03.5 internal freezing.
  // It is LEGACY (pre-canonical); it is never migrated or reinterpreted.
  return 'LEGACY'
}

// Re-export for route convenience.
export { canonicalBankHash }

export type { Prisma }
