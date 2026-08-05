import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const directUrl = process.env.DIRECT_URL || '';

  // Extract password properly: between user:password@
  const getPassword = (url: string) => {
    // Format: postgresql://user:password@host
    const match = url.match(/\/\/[^:]+:([^@]+)@/);
    return match ? match[1] : 'NOT_FOUND';
  };

  const dbPassword = getPassword(dbUrl);
  const directPassword = getPassword(directUrl);

  const expectedPassword = '9042Adiante0993';

  return NextResponse.json({
    // Password comparison (DO NOT show actual password in production - just compare)
    dbPasswordCorrect: dbPassword === expectedPassword,
    directPasswordCorrect: directPassword === expectedPassword,
    dbPasswordLength: dbPassword.length,
    directPasswordLength: directPassword.length,
    expectedLength: expectedPassword.length,
    // Check if passwords match each other
    passwordsMatch: dbPassword === directPassword,
    // Show first 4 and last 4 chars of each password for debugging
    dbPwdHint: dbPassword.length > 8 ? `${dbPassword.substring(0,4)}...${dbPassword.substring(dbPassword.length-4)}` : 'TOO_SHORT',
    directPwdHint: directPassword.length > 8 ? `${directPassword.substring(0,4)}...${directPassword.substring(directPassword.length-4)}` : 'TOO_SHORT',
    expectedHint: `${expectedPassword.substring(0,4)}...${expectedPassword.substring(expectedPassword.length-4)}`,
    // Full URL lengths
    dbUrlLength: dbUrl.length,
    directUrlLength: directUrl.length,
    expectedDbLength: 126,
    expectedDirectLength: 87,
  });
}
