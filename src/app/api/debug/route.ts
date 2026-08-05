import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const directUrl = process.env.DIRECT_URL || '';

  // Try connecting directly using fetch to Supabase REST API as a quick check
  // Also try using Prisma
  const results: Record<string, unknown> = {};

  // Test 1: Check if we can reach the Supabase host at all
  try {
    const poolerHost = 'aws-0-ca-central-1.pooler.supabase.com';
    const response = await fetch(`https://${poolerHost}`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    results.poolerReachable = true;
    results.poolerStatus = response.status;
  } catch (e) {
    results.poolerReachable = false;
    results.poolerError = (e as Error).message;
  }

  // Test 2: Try Prisma connection with explicit error details
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const res = await prisma.$queryRaw`SELECT 1 as test`;
    results.prismaSuccess = true;
    results.prismaResult = res;
    await prisma.$disconnect();
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    results.prismaSuccess = false;
    results.prismaError = err.message;
    results.prismaCode = err.code;
    results.prismaMeta = err.meta;
    results.prismaName = err.name;
  }

  // Test 3: Show connection string structure (password masked)
  const maskPwd = (url: string) => url.replace(/\/\/([^@]+)@/, (m, p1) => `//${p1.substring(0, p1.indexOf(':'))}:****@`);
  results.dbUrlMasked = maskPwd(dbUrl);
  results.directUrlMasked = maskPwd(directUrl);

  // Test 4: Check password length from URL
  const getPwdLength = (url: string) => {
    const match = url.match(/:([^@]+)@/);
    return match ? match[1].length : -1;
  };
  results.dbPasswordLength = getPwdLength(dbUrl);
  results.directPasswordLength = getPwdLength(directUrl);
  results.expectedPasswordLength = '9042Adiante0993'.length;

  return NextResponse.json(results);
}
