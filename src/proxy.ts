import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * JWT secret resolution — FAIL CLOSED in production.
 *
 * SECURITY FIX (Phase 1.1): Previously used a hardcoded fallback
 * 'fallback-dev-secret-change-in-production' which is public knowledge.
 * If JWT_SECRET env var was missing in production, anyone could forge JWTs.
 *
 * Now: production throws if secret is missing/weak; dev uses fallback with warning.
 *
 * NOTE (Next.js 16): the `middleware` file convention was migrated to `proxy`.
 * This file is the consolidated version — the old `src/proxy.ts` (stale copy
 * that still exposed /api/health as public) and the deprecated
 * `src/middleware.ts` were merged into THIS file only. Security rules are
 * unchanged: same JWT verification, same header injection, same public routes.
 */
function resolveJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  const isProd = process.env.NODE_ENV === 'production'
  const DEV_FALLBACK = 'fallback-dev-secret-change-in-production'

  if (!secret) {
    if (isProd) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is not set. ' +
          'Application refuses to start in production without a proper secret.'
      )
    }
    console.warn(
      '[SECURITY WARNING] JWT_SECRET not set — using insecure dev fallback.'
    )
    return new TextEncoder().encode(DEV_FALLBACK)
  }

  if (isProd && (secret === DEV_FALLBACK || secret.length < 32)) {
    throw new Error(
      'FATAL: JWT_SECRET is insecure for production (fallback string or < 32 chars).'
    )
  }

  return new TextEncoder().encode(secret)
}

const JWT_SECRET = resolveJwtSecret()

// Routes that do NOT require authentication
// SECURITY FIX (Phase 1.2): Removed /api/health from public — it leaked admin email + JWT_SECRET prefix.
// Now requires auth. A separate lightweight /api/ping can be added if a public healthcheck is needed.
const PUBLIC_ROUTES = [
  '/api/auth',           // login/register
  '/api/public',         // public evaluation flow
  '/api/download',       // document downloads (privacy notice, etc.)
  '/api/auditoria',      // audit document downloads (PDF + MD)
  '/api/seed',           // seed (has its own protection via EVALUHR_SEED_RESET)
]

/**
 * Check if a route path matches any public route pattern
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * Extract token from Authorization header or cookie
 */
function extractToken(req: NextRequest): string | null {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // 2. Check cookie
  const cookieToken = req.cookies.get('evaluhr_token')?.value
  if (cookieToken) {
    return cookieToken
  }

  return null
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Only protect /api/* routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Extract and verify token
  const token = extractToken(req)

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'AUTH_MISSING' },
      { status: 401 }
    )
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'evaluhr',
    })

    // Token is valid — inject user info into request headers
    // so API route handlers can access them via getAuthFromHeaders()
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', payload.sub as string || '')
    requestHeaders.set('x-user-email', (payload.email as string) || '')
    requestHeaders.set('x-user-name', (payload.name as string) || '')
    requestHeaders.set('x-user-role', (payload.role as string) || '')
    if (payload.companyId) {
      requestHeaders.set('x-user-company-id', payload.companyId as string)
    }
    if (payload.companyName) {
      requestHeaders.set('x-user-company-name', payload.companyName as string)
    }
    if (payload.companySector) {
      requestHeaders.set('x-user-company-sector', payload.companySector as string)
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token expired or invalid
    const errorMessage = error instanceof Error && error.name === 'JWTExpired'
      ? 'Token expired'
      : 'Invalid token'

    return NextResponse.json(
      { error: errorMessage, code: 'AUTH_INVALID' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: [
    /*
     * Match all API routes except:
     * - _next (Next.js internals)
     * - static files
     */
    '/api/:path*',
  ],
}
