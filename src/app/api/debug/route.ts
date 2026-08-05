import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT SET';
  const directUrl = process.env.DIRECT_URL || 'NOT SET';

  // Mask passwords for security
  const maskPassword = (url: string) => {
    return url.replace(/:([^@]+)@/, ':****@');
  };

  return NextResponse.json({
    DATABASE_URL: maskPassword(dbUrl),
    DIRECT_URL: maskPassword(directUrl),
    DB_LENGTH: dbUrl.length,
    DIRECT_LENGTH: directUrl.length,
    // Check specific parts
    DB_HAS_PGBOUNCER: dbUrl.includes('pgbouncer'),
    DB_HAS_CA_CENTRAL: dbUrl.includes('ca-central-1'),
    DB_HAS_US_EAST: dbUrl.includes('us-east-1'),
    DB_HAS_PROJECT_REF: dbUrl.includes('ulgrgxjryezkedruvhdb'),
    DIRECT_HAS_DB_PREFIX: directUrl.includes('db.ulgrgxjryezkedruvhdb'),
    DIRECT_PORT_5432: directUrl.includes(':5432'),
    DB_PORT_6543: dbUrl.includes(':6543'),
  });
}
