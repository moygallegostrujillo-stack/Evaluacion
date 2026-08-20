import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

/**
 * POST /api/migrate
 * Adds the consent columns and ConsentLog table to the production database if they don't exist.
 * This is idempotent — safe to call multiple times.
 *
 * Only SUPER_ADMIN can call this endpoint.
 *
 * This is needed because `prisma db push` in the Vercel build script sometimes fails
 * (pgbouncer/pooler issues), so the production DB schema can get out of sync with code.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: only SUPER_ADMIN can run migrations' }, { status: 403 })
    }

    const db = getUnscopedClient()
    const results: string[] = []

    // ============================================
    // 1. Add consent columns to "User" table if they don't exist
    // ============================================
    const columns = [
      { name: 'consentOption', type: 'TEXT', default: 'NULL' },
      { name: 'anonymousStats', type: 'BOOLEAN', default: 'false' },
      { name: 'consentConfirmed', type: 'BOOLEAN', default: 'false' },
      { name: 'consentWithdrawnAt', type: 'TIMESTAMP(3)', default: 'NULL' },
      { name: 'consentVersion', type: 'TEXT', default: 'NULL' },
    ]

    for (const col of columns) {
      try {
        // Try to select the column — if it fails, it doesn't exist
        await db.$executeRawUnsafe(`SELECT "${col.name}" FROM "User" LIMIT 0;`)
        results.push(`✓ Column "User.${col.name}" already exists`)
      } catch {
        // Column doesn't exist — add it
        try {
          await db.$executeRawUnsafe(
            `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} DEFAULT ${col.default};`
          )
          results.push(`✓ Added column "User.${col.name}" (${col.type})`)
        } catch (addErr) {
          results.push(`✗ Failed to add column "User.${col.name}": ${addErr}`)
        }
      }
    }

    // ============================================
    // 2. Create ConsentLog table if it doesn't exist
    // ============================================
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ConsentLog" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "action" TEXT NOT NULL,
          "previousOption" TEXT,
          "newOption" TEXT,
          "anonymousStats" BOOLEAN NOT NULL DEFAULT false,
          "consentVersion" TEXT,
          "ipAddress" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
        );
      `)
      results.push('✓ ConsentLog table created (or already exists)')

      // Add foreign key if it doesn't exist
      try {
        await db.$executeRawUnsafe(`
          ALTER TABLE "ConsentLog" 
          ADD CONSTRAINT IF NOT EXISTS "ConsentLog_userId_fkey" 
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `)
        results.push('✓ ConsentLog FK constraint added (or already exists)')
      } catch (fkErr) {
        results.push(`⚠️ ConsentLog FK: ${fkErr} (may already exist)`)
      }

      // Create index
      try {
        await db.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "ConsentLog_userId_idx" ON "ConsentLog"("userId");
        `)
        results.push('✓ ConsentLog index created (or already exists)')
      } catch (idxErr) {
        results.push(`⚠️ ConsentLog index: ${idxErr}`)
      }
    } catch (tblErr) {
      results.push(`✗ Failed to create ConsentLog table: ${tblErr}`)
    }

    // Verify by checking the columns
    let verification
    try {
      verification = await db.$queryRawUnsafe(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name IN ('consentOption', 'anonymousStats', 'consentConfirmed', 'consentWithdrawnAt', 'consentVersion')
        ORDER BY column_name;
      `)
    } catch {
      verification = 'could not verify'
    }

    return NextResponse.json({
      success: true,
      results,
      verification,
      message: 'Migración completada. El sistema de consentimiento debería funcionar ahora.',
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Error en migración', detail: String(error) },
      { status: 500 }
    )
  }
}
