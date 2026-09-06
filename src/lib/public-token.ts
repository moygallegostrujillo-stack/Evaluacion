/**
 * Signed token utility for public endpoints (Phase 3.5-B.2 — B3)
 *
 * Generates and verifies HMAC-signed tokens that bind a resource ID
 * (e.g., applicationId) to the server secret. This prevents cross-tenant
 * access via public endpoints — an attacker who knows an applicationId
 * from another company cannot use it without the signed token.
 *
 * Token format: <resourceId>.<hmac>
 * HMAC = HMAC-SHA256(resourceId, JWT_SECRET)
 *
 * PHASE 3.5-H (VUL-H1 — Fase 3.5-G finding): the legacy fallback
 * `token === resourceId` was REMOVED. There is deliberately:
 *   - NO legacy mode, NO compatibility branch, NO feature flag,
 *     NO debug mode, NO temporary exception.
 * A token is valid if and only if it is exactly
 * `<resourceId>.<HMAC-SHA256(resourceId, secret)>` compared in
 * constant time. Anything else is rejected.
 */
import crypto from 'crypto'

/**
 * Generate a signed token for a public resource.
 * The token binds the resourceId to the server secret.
 */
export function generatePublicToken(resourceId: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
  const hmac = crypto.createHmac('sha256', secret).update(resourceId).digest('hex')
  return `${resourceId}.${hmac}`
}

/**
 * Verify a signed token for a public resource.
 *
 * PHASE 3.5-H (VUL-H1): strict HMAC-only verification.
 * Returns true ONLY for a well-formed `<resourceId>.<hmac>` token whose
 * HMAC matches the server secret, compared in constant time.
 *
 * Rejected (all fail closed):
 *   - empty/missing token or resourceId
 *   - bare resourceId ("legacy" form — the previously exploitable path)
 *   - wrong number of segments, wrong resourceId segment, wrong HMAC
 */
export function verifyPublicToken(token: string, resourceId: string): boolean {
  if (!token || !resourceId) return false

  const expectedToken = generatePublicToken(resourceId)

  // Constant-time comparison. Length check first (timing-safe: length is
  // not secret — the token format is public knowledge).
  const a = Buffer.from(token)
  const b = Buffer.from(expectedToken)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
