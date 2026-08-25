import { NextResponse } from 'next/server'

/**
 * Health check endpoint — REQUIRES AUTHENTICATION (Phase 1.2 fix).
 *
 * SECURITY FIX: Previously this endpoint was PUBLIC and leaked:
 *   - DATABASE_URL prefix (DB host + username)
 *   - DIRECT_URL prefix
 *   - JWT_SECRET first 5 characters
 *   - SUPER_ADMIN email, id, companyId
 *   - User/company counts
 *
 * Now requires authentication. Detailed diagnostics are only returned
 * for SUPER_ADMIN users. Non-admin authenticated users get a minimal
 * { status: 'ok' } response.
 *
 * For a public lightweight healthcheck, use a separate /api/ping endpoint.
 */
export async function GET(req: Request) {
  // Extract auth from headers (injected by middleware)
  const headers = new Headers(req.headers)
  const role = headers.get('x-user-role') || ''
  const userId = headers.get('x-user-id') || ''

  // If not authenticated or not SUPER_ADMIN, return minimal info
  if (!userId || role !== 'SUPER_ADMIN') {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  }

  // SUPER_ADMIN gets full diagnostics
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  // Environment variable presence (NOT values — just true/false)
  diagnostics.env = {
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DIRECT_URL_SET: !!process.env.DIRECT_URL,
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
    EVALUHR_SEED_RESET_SET: !!process.env.EVALUHR_SEED_RESET,
  }

  // Test DB connection
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const userCount = await prisma.user.count()
    const companyCount = await prisma.company.count()

    await prisma.$disconnect()

    diagnostics.database = {
      status: 'connected',
      userCount,
      companyCount,
    }
  } catch (error) {
    diagnostics.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  const isHealthy =
    diagnostics.database &&
    (diagnostics.database as Record<string, unknown>).status === 'connected'

  return NextResponse.json(diagnostics, {
    status: isHealthy ? 200 : 503,
  })
}
