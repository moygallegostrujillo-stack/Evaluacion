import { NextResponse } from 'next/server'

/**
 * Health check / diagnostic endpoint
 * Helps debug production deployment issues
 * Public route - no auth required
 */
export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  // Check environment variables (mask sensitive parts)
  const dbUrl = process.env.DATABASE_URL
  const directUrl = process.env.DIRECT_URL
  const jwtSecret = process.env.JWT_SECRET

  diagnostics.env = {
    DATABASE_URL: dbUrl
      ? `${dbUrl.substring(0, 30)}...${dbUrl.includes('pgbouncer') ? ' [pgbouncer=yes]' : ' [pgbouncer=no]'}`
      : 'NOT SET',
    DIRECT_URL: directUrl
      ? `${directUrl.substring(0, 30)}...`
      : 'NOT SET',
    JWT_SECRET: jwtSecret ? `${jwtSecret.substring(0, 5)}***` : 'NOT SET',
  }

  // Test Prisma connection
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    // Try a simple query
    const userCount = await prisma.user.count()
    const companyCount = await prisma.company.count()
    
    // Try to find the SUPER_ADMIN
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
      select: { id: true, email: true, role: true, companyId: true, active: true },
    })

    await prisma.$disconnect()

    diagnostics.database = {
      status: 'connected',
      userCount,
      companyCount,
      superAdmin: superAdmin
        ? { ...superAdmin, companyId: superAdmin.companyId || 'null (tenant-free)' }
        : 'NOT FOUND',
    }
  } catch (error) {
    diagnostics.database = {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    }
  }

  const isHealthy = 
    diagnostics.database && (diagnostics.database as Record<string, unknown>).status === 'connected'

  return NextResponse.json(diagnostics, {
    status: isHealthy ? 200 : 503,
  })
}
