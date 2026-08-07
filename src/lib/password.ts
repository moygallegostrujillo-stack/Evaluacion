import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const BCRYPT_ROUNDS = 12

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

/**
 * Verify a password against a hash.
 * Supports both bcrypt hashes and legacy SHA-256 hashes.
 * Returns { valid, needsRehash } — if needsRehash is true,
 * the password was verified against a legacy SHA-256 hash and
 * should be re-hashed with bcrypt.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  // bcrypt hashes start with $2a$, $2b$, or $2y$
  if (storedHash.startsWith('$2')) {
    const valid = await bcrypt.compare(password, storedHash)
    return { valid, needsRehash: false }
  }

  // Legacy SHA-256 hash (64 hex characters)
  const sha256Hash = crypto.createHash('sha256').update(password).digest('hex')
  if (sha256Hash === storedHash) {
    return { valid: true, needsRehash: true }
  }

  return { valid: false, needsRehash: false }
}

/**
 * Check if a hash is a legacy SHA-256 hash that needs migration
 */
export function isLegacyHash(hash: string): boolean {
  return !hash.startsWith('$2')
}
