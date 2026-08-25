import { SignJWT, jwtVerify } from 'jose'

/**
 * JWT secret resolution — FAIL CLOSED in production.
 *
 * SECURITY: The previous implementation used a hardcoded fallback
 * 'fallback-dev-secret-change-in-production' which is public knowledge
 * (committed to the repo). If JWT_SECRET env var was missing in production,
 * anyone could forge valid JWTs including SUPER_ADMIN role.
 *
 * New behavior:
 * - Production (NODE_ENV === 'production'): THROW if JWT_SECRET is missing
 *   or is the known dev fallback. The app refuses to start — safe failure.
 * - Development: Use the fallback ONLY if env var is missing, and log a
 *   warning so devs know to set it.
 */
function resolveJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  const isProd = process.env.NODE_ENV === 'production'
  const DEV_FALLBACK = 'fallback-dev-secret-change-in-production'

  if (!secret) {
    if (isProd) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is not set. ' +
          'The application refuses to start in production without a proper secret. ' +
          'Set JWT_SECRET in your environment variables (use a strong random string of at least 32 characters).'
      )
    }
    console.warn(
      '[SECURITY WARNING] JWT_SECRET not set — using insecure dev fallback. ' +
        'DO NOT use this in production. Set JWT_SECRET env var.'
    )
    return new TextEncoder().encode(DEV_FALLBACK)
  }

  // Reject the known dev fallback in production
  if (isProd && secret === DEV_FALLBACK) {
    throw new Error(
      'FATAL: JWT_SECRET is set to the known dev fallback string. ' +
        'This is not allowed in production. Generate a strong random secret.'
    )
  }

  // Minimum length check for production
  if (isProd && secret.length < 32) {
    throw new Error(
      'FATAL: JWT_SECRET must be at least 32 characters in production. ' +
        `Current length: ${secret.length}. Use a strong random string.`
    )
  }

  return new TextEncoder().encode(secret)
}

const JWT_SECRET = resolveJwtSecret()

const JWT_EXPIRES_IN = '8h'

export interface AuthPayload {
  sub: string        // user.id
  email: string
  name: string
  role: string       // SUPER_ADMIN, RH, GERENTE, CANDIDATO
  companyId?: string
  companyName?: string
  companySector?: string
}

export interface VerifiedAuth extends AuthPayload {
  iat: number
  exp: number
}

/**
 * Generate a signed JWT token
 */
export async function generateToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuer('evaluhr')
    .setSubject(payload.sub)
    .sign(JWT_SECRET)
}

/**
 * Verify and decode a JWT token
 * Returns null if invalid/expired
 */
export async function verifyToken(token: string): Promise<VerifiedAuth | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'evaluhr',
    })
    return payload as unknown as VerifiedAuth
  } catch {
    return null
  }
}

/**
 * Extract auth info from request headers injected by middleware
 * This is used in API route handlers to get the authenticated user
 */
export function getAuthFromHeaders(headers: Headers): {
  userId: string
  email: string
  name: string
  role: string
  companyId?: string
  companyName?: string
  companySector?: string
} | null {
  const userId = headers.get('x-user-id')
  const role = headers.get('x-user-role')

  if (!userId || !role) return null

  return {
    userId,
    email: headers.get('x-user-email') || '',
    name: headers.get('x-user-name') || '',
    role,
    companyId: headers.get('x-user-company-id') || undefined,
    companyName: headers.get('x-user-company-name') || undefined,
    companySector: headers.get('x-user-company-sector') || undefined,
  }
}

/**
 * Check if a user has the required role(s)
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

/**
 * Check if a user can access a specific company's data
 * SUPER_ADMIN can access any company
 * Other roles can only access their own company
 */
export function canAccessCompany(
  userRole: string,
  userCompanyId: string | undefined,
  targetCompanyId: string
): boolean {
  if (userRole === 'SUPER_ADMIN') return true
  return userCompanyId === targetCompanyId
}
