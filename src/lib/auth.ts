import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
)

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
