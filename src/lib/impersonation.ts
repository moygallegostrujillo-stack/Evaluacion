/**
 * Super Admin Impersonation Helper (Phase 3.5-B.2.1 — B1)
 *
 * Centralizes the resolution of targetCompanyId for SUPER_ADMIN
 * impersonation, and logs every impersonation act to AuditLog.
 *
 * This replaces the scattered pattern:
 *   const targetCompanyId = auth.role === 'SUPER_ADMIN' ? query.get('companyId') : null
 *   if (SA && target) console.log(...)  // only 2 of 18 sites did this
 *
 * With a centralized helper that:
 *   1. Returns auth.companyId for non-SUPER_ADMIN (ignores client-supplied companyId)
 *   2. Returns auth.companyId for SUPER_ADMIN without target (aggregated mode)
 *   3. Returns targetCompanyId for SUPER_ADMIN with target (impersonation)
 *   4. Logs EVERY impersonation to AuditLog (actor, origin, target, action)
 */

import type { NextRequest } from 'next/server'
import { logAuditEvent } from '@/lib/audit'

export interface AuthContext {
  userId: string
  role: string
  companyId?: string
}

export interface ResolveResult {
  /** The companyId to scope queries to */
  targetCompanyId: string | null
  /** Whether this is an impersonation (SA operating on a different company) */
  isImpersonation: boolean
  /** The client RLS client to use (scoped or unscoped for SA aggregate) */
  // (caller decides which client to create based on targetCompanyId)
}

/**
 * Resolve the target company for a request, with impersonation logging.
 *
 * Usage:
 *   const { targetCompanyId, isImpersonation } = await resolveTargetCompanyId(auth, req, {
 *     action: 'ACCESS',
 *     resource: 'Candidate',
 *   })
 *
 * For non-SUPER_ADMIN: returns auth.companyId, ignores client-supplied companyId.
 * For SUPER_ADMIN without target: returns null (aggregated mode).
 * For SUPER_ADMIN with target different from auth.companyId: returns target, logs impersonation.
 * For SUPER_ADMIN with target same as auth.companyId: returns target, no impersonation log.
 */
export async function resolveTargetCompanyId(
  auth: AuthContext,
  req: NextRequest | undefined,
  options: {
    action?: string
    resource?: string
    resourceId?: string
  } = {}
): Promise<ResolveResult> {
  const { action = 'ACCESS', resource = 'Unknown', resourceId } = options

  // Non-SUPER_ADMIN: always use own companyId, ignore client-supplied
  if (auth.role !== 'SUPER_ADMIN') {
    return {
      targetCompanyId: auth.companyId || null,
      isImpersonation: false,
    }
  }

  // SUPER_ADMIN: check for target companyId in query params or body
  let targetCompanyId: string | null = null
  if (req) {
    // Check query params first
    const queryCompanyId = req.nextUrl?.searchParams?.get('companyId')
    if (queryCompanyId) {
      targetCompanyId = queryCompanyId
    }
  }

  // SUPER_ADMIN without target — aggregated mode (all companies)
  if (!targetCompanyId) {
    return {
      targetCompanyId: null,
      isImpersonation: false,
    }
  }

  // SUPER_ADMIN with target same as own company — not impersonation
  if (targetCompanyId === auth.companyId) {
    return {
      targetCompanyId,
      isImpersonation: false,
    }
  }

  // SUPER_ADMIN impersonating another company — LOG IT
  await logAuditEvent(req, {
    actorId: auth.userId,
    action: 'ADMIN_ACCESS',
    resource,
    resourceId,
    companyId: auth.companyId, // origin company
    details: {
      impersonation: true,
      targetCompanyId, // target company
      actorRole: auth.role,
      action,
    },
  })

  return {
    targetCompanyId,
    isImpersonation: true,
  }
}
