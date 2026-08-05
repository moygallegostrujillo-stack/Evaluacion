import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    const companies = await prisma.company.count();
    await prisma.$disconnect();
    return NextResponse.json({ success: true, test: result, companyCount: companies });
  } catch (error: unknown) {
    await prisma.$disconnect();
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
      name: err.name,
      // Check if it's a Prisma error
      prismaError: err.constructor.name,
      // Show the env vars (masked)
      dbUrlSet: !!process.env.DATABASE_URL,
      directUrlSet: !!process.env.DIRECT_URL,
      dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
      directUrlPrefix: process.env.DIRECT_URL?.substring(0, 30) + '...',
    }, { status: 500 });
  }
}
