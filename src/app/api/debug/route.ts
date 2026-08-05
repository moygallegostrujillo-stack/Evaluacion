import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const directUrl = process.env.DIRECT_URL || '';
  
  const results: Record<string, unknown> = {};

  // Test 1: Try Supabase REST API (uses the same password)
  // The Supabase project ref is ulgrgxjryezkedruvhdb
  try {
    const supabaseUrl = 'https://ulgrgxjryezkedruvhdb.supabase.co';
    // We need the anon key or service key to test REST API
    // Let's try connecting to the health endpoint
    const healthRes = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // dummy - just testing connectivity
      },
      signal: AbortSignal.timeout(10000)
    });
    results.supabaseRestReachable = true;
    results.supabaseRestStatus = healthRes.status;
  } catch (e) {
    results.supabaseRestReachable = false;
    results.supabaseRestError = (e as Error).message;
  }

  // Test 2: Try Prisma with ONLY the pooler URL (no directUrl)
  // This tests if the directUrl is causing the issue
  try {
    // Dynamically create a Prisma client with only the pooler URL
    process.env.DIRECT_URL = ''; // Temporarily remove direct URL
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const res = await prisma.$queryRaw`SELECT 1 as test`;
    results.prismaWithoutDirect = { success: true, result: res };
    await prisma.$disconnect();
  } catch (e) {
    results.prismaWithoutDirect = { 
      success: false, 
      error: (e as Error).message.substring(0, 200) 
    };
  }

  // Test 3: Try Prisma normally (with both URLs)
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const res = await prisma.$queryRaw`SELECT 1 as test`;
    results.prismaNormal = { success: true, result: res };
    await prisma.$disconnect();
  } catch (e) {
    results.prismaNormal = { 
      success: false, 
      error: (e as Error).message.substring(0, 300) 
    };
  }

  return NextResponse.json(results);
}
