import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
)

// Routes that do NOT require authentication
const PUBLIC_ROUTES = [
  '/api/auth',           // login/register
  '/api/public',         // public evaluation flow
  '/api/seed',           // seed (has its own protection)
  '/api/health',         // health check / diagnostics
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

export async function middleware(req: NextRequest) {
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
