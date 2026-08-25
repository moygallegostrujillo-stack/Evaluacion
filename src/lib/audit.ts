/**
 * Audit logging utility — persists security events to the AuditLog table.
 *
 * Usage:
 *   import { logAuditEvent } from '@/lib/audit'
 *   await logAuditEvent(req, {
 *     actorId: auth.userId,
 *     action: 'DELETE',
 *     resource: 'User',
 *     resourceId: candidateId,
 *     companyId: auth.companyId,
 *     success: true,
 *     details: { reason: 'Candidate requested cancellation' },
 *   })
 *
 * NEVER store passwords, tokens, JWTs, or sensitive values in details.
 */
import { db } from '@/lib/db'
import type { NextRequest } from 'next/server'

export interface AuditEvent {
  actorId?: string | null
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'ACCESS'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'CONSENT_CHANGE'
    | 'PERMISSION_CHANGE'
    | 'ADMIN_ACCESS'
    | 'UNAUTHORIZED_ATTEMPT'
    | 'RETENTION_PURGE'
  resource?: string
  resourceId?: string
  companyId?: string | null
  details?: Record<string, unknown> | string
  ipAddress?: string | null
  userAgent?: string | null
  success?: boolean
}

/**
 * Extract client IP from request headers.
 * Checks x-forwarded-for (first hop) then x-real-ip.
 */
function getClientIp(req?: NextRequest): string | null {
  if (!req) return null
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return null
}

/**
 * Extract user-agent from request headers.
 */
function getUserAgent(req?: NextRequest): string | null {
  if (!req) return null
  const ua = req.headers.get('user-agent')
  return ua || null
}

/**
 * Log a security audit event. Non-blocking — errors are swallowed to avoid
 * breaking the primary operation. Returns void.
 *
 * IMPORTANT: This function must NEVER throw. Audit logging is a side-effect,
 * not a critical path. If it fails, the primary operation still succeeds.
 */
export async function logAuditEvent(
  req: NextRequest | undefined,
  event: AuditEvent
): Promise<void> {
  try {
    const ipAddress = event.ipAddress ?? getClientIp(req)
    const userAgent = event.userAgent ?? getUserAgent(req)
    const details =
      typeof event.details === 'string'
        ? event.details
        : event.details
          ? JSON.stringify(event.details)
          : null

    await db.auditLog.create({
      data: {
        actorId: event.actorId || null,
        action: event.action,
        resource: event.resource || null,
        resourceId: event.resourceId || null,
        companyId: event.companyId || null,
        details,
        ipAddress,
        userAgent,
        success: event.success ?? true,
      },
    })
  } catch (error) {
    // Audit logging must NEVER break the primary operation.
    // Log to console for debugging, but swallow the error.
    console.error('[AUDIT LOG ERROR]', error)
  }
}

/**
 * Log an unauthorized access attempt.
 * Convenience wrapper for the most common audit event.
 */
export async function logUnauthorizedAccess(
  req: NextRequest | undefined,
  opts: {
    actorId?: string | null
    action?: string
    resource?: string
    resourceId?: string
    companyId?: string | null
    reason?: string
  }
): Promise<void> {
  await logAuditEvent(req, {
    actorId: opts.actorId,
    action: 'UNAUTHORIZED_ATTEMPT',
    resource: opts.resource,
    resourceId: opts.resourceId,
    companyId: opts.companyId,
    success: false,
    details: { reason: opts.reason || 'Access denied' },
  })
}
