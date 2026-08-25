/**
 * Retention Policy — Phase 3.2
 *
 * Defines the data retention periods declared in the privacy notice
 * (src/lib/privacy-notice.ts) and provides utilities to:
 *   1. Compute when records should be purged
 *   2. Find records that have exceeded their retention period
 *   3. Purge or anonymize expired records
 *
 * CURRENT RETENTION POLICY (aligned with privacy-notice.ts):
 *
 * | Data Type              | Period           | Trigger                          |
 * |------------------------|------------------|----------------------------------|
 * | Personal PII           | 2 years          | From evaluation completion date  |
 * | Sensitive (psych/psyc) | Immediate       | On process conclusion / withdrawal |
 * | Security/audit logs    | 90 calendar days| From collection                  |
 *
 * "Process conclusion" is defined as one of:
 *   (a) Candidate is hired
 *   (b) Candidate is notified they won't be considered
 *   (c) 90 calendar days of inactivity (no admin access to the result)
 *
 * NOTE: Triggers (a) and (b) are NOT currently tracked in the system
 * (no `hiredAt` or `notifiedAt` fields exist). Only trigger (c) —
 * 90-day inactivity — can be enforced automatically. This is a known
 * gap documented in the post-implementation report.
 */

import { db } from '@/lib/db'
import { logAuditEvent } from '@/lib/audit'
import type { NextRequest } from 'next/server'

// ============================================
// RETENTION PERIODS (in milliseconds)
// ============================================

/** 2 years — PII retention from evaluation date */
export const PII_RETENTION_MS = 2 * 365 * 24 * 60 * 60 * 1000 // 730 days

/** 90 calendar days — inactivity trigger for sensitive data conclusion */
export const INACTIVITY_TRIGGER_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

/** 90 calendar days — security log retention */
export const AUDIT_LOG_RETENTION_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Compute the purge date for a PII record (2 years from creation).
 */
export function computePiiPurgeDate(createdAt: Date): Date {
  return new Date(createdAt.getTime() + PII_RETENTION_MS)
}

/**
 * Compute the purge date for sensitive data (90 days from last activity
 * or from completion date).
 */
export function computeSensitivePurgeDate(completedAt: Date | null, lastAccessedAt: Date | null): Date {
  const baseDate = completedAt || lastAccessedAt || new Date()
  return new Date(baseDate.getTime() + INACTIVITY_TRIGGER_MS)
}

/**
 * Compute the purge date for audit logs (90 days from creation).
 */
export function computeAuditLogPurgeDate(createdAt: Date): Date {
  return new Date(createdAt.getTime() + AUDIT_LOG_RETENTION_MS)
}

// ============================================
// RETENTION JOB — Idempotent purge of expired records
// ============================================

export interface RetentionReport {
  /** Records that were checked */
  checked: {
    evaluationResults: number
    auditLogs: number
    usersWithSensitiveData: number
  }
  /** Records that were purged/anonymized */
  purged: {
    evaluationResultsAnonymized: number
    evaluationResponsesDeleted: number
    sensitiveScoresReset: number
    auditLogsDeleted: number
  }
  /** Records marked for future purge (retainedUntil set) */
  marked: {
    evaluationResultsRetainedUntilSet: number
    usersPiiPurgeAtSet: number
  }
  /** Errors encountered (non-fatal) */
  errors: string[]
  /** Timestamp of the run */
  runAt: string
  /** Whether this run actually performed deletions or was a dry-run */
  dryRun: boolean
}

/**
 * Run the retention purge job.
 *
 * This function is IDEMPOTENT — running it multiple times produces the same
 * result as running it once. It:
 *
 * 1. Finds EvaluationResults whose `retainedUntil` has passed and anonymizes
 *    them (reset scores to 0, clear summary, set purgedAt, keep the record
 *    for audit but remove sensitive content).
 *
 * 2. Finds AuditLogs older than 90 days and deletes them.
 *
 * 3. Finds Users whose `piiPurgeAt` has passed and anonymizes their PII
 *    (name → "Anonimizado", email → "anonimized_<id>@purged.local", phone → null).
 *
 * 4. For any EvaluationResult that doesn't have `retainedUntil` set yet,
 *    sets it to createdAt + 2 years (back-fill).
 *
 * SECURITY: This function uses the unscoped Prisma client because it needs
 * to access ALL records across ALL tenants for compliance purposes. It is
 * intended to be called ONLY by an authenticated SUPER_ADMIN or a scheduled
 * cron job (not exposed as a public endpoint).
 *
 * @param options.dryRun If true, only report what WOULD be purged — don't delete.
 * @param options.req Optional request object for audit logging.
 */
export async function runRetentionPurge(options: {
  dryRun?: boolean
  req?: NextRequest
  actorId?: string
}): Promise<RetentionReport> {
  const { dryRun = false, req, actorId } = options
  const report: RetentionReport = {
    checked: { evaluationResults: 0, auditLogs: 0, usersWithSensitiveData: 0 },
    purged: {
      evaluationResultsAnonymized: 0,
      evaluationResponsesDeleted: 0,
      sensitiveScoresReset: 0,
      auditLogsDeleted: 0,
    },
    marked: {
      evaluationResultsRetainedUntilSet: 0,
      usersPiiPurgeAtSet: 0,
    },
    errors: [],
    runAt: new Date().toISOString(),
    dryRun,
  }

  const now = new Date()

  try {
    // ── STEP 1: Back-fill retainedUntil on EvaluationResults ──
    // Any result without retainedUntil gets it set to createdAt + 2 years.
    const resultsWithoutRetention = await db.evaluationResult.findMany({
      where: { retainedUntil: null },
      select: { id: true, createdAt: true },
    })
    report.checked.evaluationResults = resultsWithoutRetention.length

    if (resultsWithoutRetention.length > 0) {
      if (dryRun) {
        report.marked.evaluationResultsRetainedUntilSet = resultsWithoutRetention.length
      } else {
        for (const result of resultsWithoutRetention) {
          const purgeDate = computePiiPurgeDate(result.createdAt)
          await db.evaluationResult.update({
            where: { id: result.id },
            data: { retainedUntil: purgeDate },
          }).catch(err => report.errors.push(`Failed to set retainedUntil on result ${result.id}: ${String(err)}`))
        }
        report.marked.evaluationResultsRetainedUntilSet = resultsWithoutRetention.length
      }
    }

    // ── STEP 2: Purge expired EvaluationResults ──
    // Anonymize: reset all scores to 0, clear summary, set purgedAt.
    // Keep the record (with candidateId, positionId, companyId) for audit.
    const expiredResults = await db.evaluationResult.findMany({
      where: {
        retainedUntil: { lt: now },
        purgedAt: null, // not yet purged
      },
      select: { id: true, candidateId: true },
    })

    if (expiredResults.length > 0) {
      if (dryRun) {
        report.purged.evaluationResultsAnonymized = expiredResults.length
      } else {
        for (const result of expiredResults) {
          // Delete the raw responses for this result's session
          const session = await db.evaluationSession.findUnique({
            where: { id: result.id }, // sessionId is stored as result.id's relation
            select: { id: true },
          }).catch(() => null)

          if (session) {
            const deleted = await db.evaluationResponse.deleteMany({
              where: { sessionId: session.id },
            }).catch(() => ({ count: 0 }))
            report.purged.evaluationResponsesDeleted += deleted.count || 0
          }

          // Anonymize the result: reset scores, clear summary, set purgedAt
          await db.evaluationResult.update({
            where: { id: result.id },
            data: {
              openness: 0,
              conscientiousness: 0,
              extraversion: 0,
              agreeableness: 0,
              neuroticism: 0,
              stressLevel: 0,
              empathy: 0,
              adaptability: 0,
              leadership: 0,
              teamwork: 0,
              knowledgeScore: null,
              integrityScore: 0,
              overallScore: 0,
              recommendation: 'PENDIENTE',
              summary: null,
              candidateName: 'Anonimizado',
              purgedAt: now,
            },
          }).catch(err => report.errors.push(`Failed to anonymize result ${result.id}: ${String(err)}`))
        }
        report.purged.evaluationResultsAnonymized = expiredResults.length
      }
    }

    // ── STEP 3: Delete expired AuditLogs (older than 90 days) ──
    const auditCutoff = new Date(now.getTime() - AUDIT_LOG_RETENTION_MS)
    const expiredLogs = await db.auditLog.findMany({
      where: { createdAt: { lt: auditCutoff } },
      select: { id: true },
    })
    report.checked.auditLogs = expiredLogs.length

    if (expiredLogs.length > 0 && !dryRun) {
      const deleted = await db.auditLog.deleteMany({
        where: { createdAt: { lt: auditCutoff } },
      }).catch(err => {
        report.errors.push(`Failed to delete expired audit logs: ${String(err)}`)
        return { count: 0 }
      })
      report.purged.auditLogsDeleted = deleted.count || 0
    } else if (dryRun) {
      report.purged.auditLogsDeleted = expiredLogs.length
    }

    // ── STEP 4: Anonymize users whose piiPurgeAt has passed ──
    // These are candidates whose 2-year retention has expired.
    // We anonymize their PII but keep the User record for FK integrity.
    const expiredUsers = await db.user.findMany({
      where: {
        piiPurgeAt: { lt: now },
        role: 'CANDIDATO',
      },
      select: { id: true, name: true, email: true },
    })
    report.checked.usersWithSensitiveData = expiredUsers.length

    if (expiredUsers.length > 0) {
      if (dryRun) {
        report.purged.sensitiveScoresReset = expiredUsers.length
      } else {
        for (const user of expiredUsers) {
          await db.user.update({
            where: { id: user.id },
            data: {
              name: 'Anonimizado',
              email: `anonimized_${user.id}@purged.local`,
              phone: null,
              // Keep consent fields for audit trail
              // Reset password to prevent login
              password: 'PURGED_ACCOUNT_NO_LOGIN',
              active: false,
            },
          }).catch(err => report.errors.push(`Failed to anonymize user ${user.id}: ${String(err)}`))
        }
        report.purged.sensitiveScoresReset = expiredUsers.length
      }
    }

    // ── Audit log the retention run ──
    if (!dryRun) {
      await logAuditEvent(req, {
        actorId: actorId || undefined,
        action: 'RETENTION_PURGE',
        resource: 'RetentionJob',
        details: {
          purgedResults: report.purged.evaluationResultsAnonymized,
          purgedResponses: report.purged.evaluationResponsesDeleted,
          purgedAuditLogs: report.purged.auditLogsDeleted,
          anonymizedUsers: report.purged.sensitiveScoresReset,
          marked: report.marked,
          errors: report.errors.length,
        },
      }).catch(() => {}) // Non-blocking
    }

  } catch (error) {
    report.errors.push(`Fatal error in retention job: ${String(error)}`)
  }

  return report
}

/**
 * Set piiPurgeAt on a user when they complete an evaluation.
 * Called from the evaluation completion flow.
 */
export async function setPiiPurgeDate(userId: string, evaluationDate: Date = new Date()): Promise<void> {
  const purgeDate = computePiiPurgeDate(evaluationDate)
  await db.user.update({
    where: { id: userId },
    data: { piiPurgeAt: purgeDate },
  }).catch(err => {
    console.error('[retention] Failed to set piiPurgeAt:', err)
  })
}
