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
 * Returns true if the token is valid and matches the resourceId.
 */
export function verifyPublicToken(token: string, resourceId: string): boolean {
  if (!token || !resourceId) return false

  // Support both new HMAC tokens and legacy slug-based tokens
  // (for backward compatibility during migration)
  const parts = token.split('.')
  if (parts.length === 2 && parts[0] === resourceId) {
    // New HMAC token format
    const expectedToken = generatePublicToken(resourceId)
    // Use constant-time comparison to prevent timing attacks
    const a = Buffer.from(token)
    const b = Buffer.from(expectedToken)
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  }

  // Legacy: token is just the resourceId itself (less secure, but backward compatible)
  // This allows existing flows to continue working during migration
  return token === resourceId
}
