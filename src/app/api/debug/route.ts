import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT SET';
  const directUrl = process.env.DIRECT_URL || 'NOT SET';

  // Extract user part from URL (between // and :)
  const getUser = (url: string) => {
    const match = url.match(/\/\/([^:]+):/);
    return match ? match[1] : 'NOT FOUND';
  };

  // Extract host part (between @ and next :)
  const getHost = (url: string) => {
    const match = url.match(/@([^:]+):/);
    return match ? match[1] : 'NOT FOUND';
  };

  // Expected values
  const expectedDbUser = 'postgres.ulgrgxjryezkedruvhdb';
  const expectedDirectUser = 'postgres';

  const actualDbUser = getUser(dbUrl);
  const actualDirectUser = getUser(directUrl);

  return NextResponse.json({
    DATABASE_URL_USER: actualDbUser,
    DATABASE_URL_HOST: getHost(dbUrl),
    DATABASE_URL_CORRECT_USER: actualDbUser === expectedDbUser,
    DIRECT_URL_USER: actualDirectUser,
    DIRECT_URL_HOST: getHost(directUrl),
    DIRECT_URL_CORRECT_USER: actualDirectUser === expectedDirectUser,
    DB_HAS_PGBOUNCER: dbUrl.includes('pgbouncer'),
    DB_LENGTH: dbUrl.length,
    DIRECT_LENGTH: directUrl.length,
    // The expected lengths with the correct password (9042Adiante0993 = 15 chars)
    EXPECTED_DB_LENGTH: 'postgresql://postgres.ulgrgxjryezkedruvhdb:9042Adiante0993@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'.length,
    EXPECTED_DIRECT_LENGTH: 'postgresql://postgres:9042Adiante0993@db.ulgrgxjryezkedruvhdb.supabase.co:5432/postgres'.length,
  });
}
