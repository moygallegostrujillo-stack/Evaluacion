import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { logAuditEvent } from '@/lib/audit'

/**
 * POST /api/migrate
 * Adds the consent columns and ConsentLog table to the production database if they don't exist.
 * This is idempotent — safe to call multiple times.
 *
 * Only SUPER_ADMIN can call this endpoint.
 *
 * This is needed because `prisma db push` in the Vercel build script sometimes fails
 * (pgbouncer/pooler issues), so the production DB schema can get out of sync with code.
 *
 * NOTE: This endpoint adds ALL consent-related columns:
 *   - consentGiven (Boolean, default false)
 *   - consentDate (DateTime, nullable)
 *   - consentOption (Text, nullable)
 *   - anonymousStats (Boolean, default false)
 *   - consentConfirmed (Boolean, default false)
 *   - consentWithdrawnAt (DateTime, nullable)
 *   - consentVersion (Text, nullable)
 *
 * Also adds integrity columns and CompanyPrivacyNotice table (Aug 2026):
 *   - EvaluationResult.integrityScore (Float, default 0)
 *   - VacancyApplication.integrityScore (Float, default 0)
 *   - Vacancy.includeIntegridad (Boolean, default true)
 *   - CompanyPrivacyNotice table
 *
 * FASE 3.5-D.2.8 — SECURITY HARDENING:
 *   1. The former STEP 11 (executing prisma/rls-policies.sql through
 *      $executeRawUnsafe) has been REMOVED. A runtime HTTP endpoint must
 *      NEVER be able to ENABLE/FORCE Row Level Security (or execute any
 *      policy SQL) — that is now only possible through a controlled,
 *      manual, DBA-run migration. This also removes the last execution
 *      path of the dormant app.is_super_admin bypass SQL.
 *   2. Every invocation is now persisted to AuditLog (actor, action,
 *      timestamp) — previously this endpoint was not audited.
 *   3. Role gate remains: only SUPER_ADMIN (JWT role from middleware —
 *      never client input). No client-supplied SQL is executed anywhere:
 *      every statement is a fixed literal in this file.
 */

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN') {
      await logAuditEvent(req, {
        actorId: auth.userId,
        action: 'UNAUTHORIZED_ATTEMPT',
        resource: 'Migration',
        companyId: auth.companyId,
        success: false,
        details: { reason: 'Non-SUPER_ADMIN attempted to run migrations' },
      })
      return NextResponse.json({ error: 'Forbidden: only SUPER_ADMIN can run migrations' }, { status: 403 })
    }

    // Audit the administrative migration invocation (FASE 3.5-D.2.8).
    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'ADMIN_ACCESS',
      resource: 'Migration',
      companyId: auth.companyId ?? null,
      details: { mode: 'MIGRATION', operation: 'SCHEMA_SYNC' },
    })

    const db = getUnscopedClient()
    const results: string[] = []

    // ============================================
    // 1. Add ALL consent columns to "User" table if they don't exist
    // ============================================
    const columns = [
      { name: 'consentGiven', type: 'BOOLEAN', default: 'false' },
      { name: 'consentDate', type: 'TIMESTAMP(3)', default: 'NULL' },
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

    // ============================================
    // 3. Clean up orphaned candidate users (cand_*.auto emails with no invitation)
    //    This helps fix issues where stale users from deleted invitations cause
    //    "Usuario no encontrado" errors in the consent flow.
    // ============================================
    try {
      // Find orphaned candidate users (auto-created emails, no matching invitation)
      const orphanedUsers = await db.$queryRawUnsafe(`
        SELECT u."id", u."email", u."name", u."companyId"
        FROM "User" u
        WHERE u."role" = 'CANDIDATO'
          AND u."email" LIKE 'cand_%@evaluhr.auto'
          AND NOT EXISTS (
            SELECT 1 FROM "CandidateInvitation" ci
            WHERE ci."phone" IS NOT NULL
              AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(u."email", 'cand_', ''), '@evaluhr.auto', ''), ' ', ''), '-', ''), '+', '') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ci."phone", ' ', ''), '-', ''), '+', ''), '(', ''), ')', '')
          )
        LIMIT 100;
      `) as Array<{ id: string; email: string; name: string; companyId: string }>

      if (orphanedUsers.length > 0) {
        // Delete evaluation sessions for orphaned users first (FK constraint)
        const orphanedIds = orphanedUsers.map(u => u.id)
        await db.$executeRawUnsafe(`
          DELETE FROM "EvaluationSession" WHERE "candidateId" = ANY($1::text[]);
        `, orphanedIds).catch(() => {})

        // Delete consent logs for orphaned users
        await db.$executeRawUnsafe(`
          DELETE FROM "ConsentLog" WHERE "userId" = ANY($1::text[]);
        `, orphanedIds).catch(() => {})

        // Delete the orphaned users
        const deleteResult = await db.$executeRawUnsafe(`
          DELETE FROM "User" WHERE "id" = ANY($1::text[]);
        `, orphanedIds)

        results.push(`🧹 Cleaned up ${deleteResult} orphaned candidate user(s)`)
      } else {
        results.push('✓ No orphaned candidate users found')
      }
    } catch (cleanupErr) {
      results.push(`⚠️ Orphan cleanup skipped: ${cleanupErr}`)
    }

    // ============================================
    // 4. Add integrityScore columns (Aug 2026)
    // ============================================
    const integrityColumns = [
      { table: 'EvaluationResult', name: 'integrityScore', type: 'DOUBLE PRECISION', default: '0' },
      { table: 'VacancyApplication', name: 'integrityScore', type: 'DOUBLE PRECISION', default: '0' },
      { table: 'Vacancy', name: 'includeIntegridad', type: 'BOOLEAN', default: 'true' },
    ]

    for (const col of integrityColumns) {
      try {
        await db.$executeRawUnsafe(`SELECT "${col.name}" FROM "${col.table}" LIMIT 0;`)
        results.push(`✓ Column "${col.table}.${col.name}" already exists`)
      } catch {
        try {
          await db.$executeRawUnsafe(
            `ALTER TABLE "${col.table}" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} DEFAULT ${col.default};`
          )
          results.push(`✓ Added column "${col.table}.${col.name}" (${col.type})`)
        } catch (addErr) {
          results.push(`✗ Failed to add column "${col.table}.${col.name}": ${addErr}`)
        }
      }
    }

    // ============================================
    // 5. Create CompanyPrivacyNotice table (Aug 2026)
    // ============================================
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CompanyPrivacyNotice" (
          "id" TEXT NOT NULL,
          "companyId" TEXT NOT NULL,
          "contentHtml" TEXT NOT NULL,
          "version" TEXT NOT NULL DEFAULT '2026-01-v2',
          "isCustom" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "CompanyPrivacyNotice_pkey" PRIMARY KEY ("id")
        );
      `)
      results.push('✓ CompanyPrivacyNotice table created (or already exists)')

      // Add unique constraint on companyId
      try {
        await db.$executeRawUnsafe(`
          ALTER TABLE "CompanyPrivacyNotice"
          ADD CONSTRAINT IF NOT EXISTS "CompanyPrivacyNotice_companyId_key"
          UNIQUE ("companyId");
        `)
        results.push('✓ CompanyPrivacyNotice unique constraint added')
      } catch (fkErr) {
        results.push(`⚠️ CompanyPrivacyNotice unique: ${fkErr}`)
      }

      // Add FK
      try {
        await db.$executeRawUnsafe(`
          ALTER TABLE "CompanyPrivacyNotice"
          ADD CONSTRAINT IF NOT EXISTS "CompanyPrivacyNotice_companyId_fkey"
          FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `)
        results.push('✓ CompanyPrivacyNotice FK added')
      } catch (fkErr) {
        results.push(`⚠️ CompanyPrivacyNotice FK: ${fkErr}`)
      }

      // Index
      try {
        await db.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "CompanyPrivacyNotice_companyId_idx" ON "CompanyPrivacyNotice"("companyId");
        `)
        results.push('✓ CompanyPrivacyNotice index created')
      } catch (idxErr) {
        results.push(`⚠️ CompanyPrivacyNotice index: ${idxErr}`)
      }
    } catch (tblErr) {
      results.push(`✗ Failed to create CompanyPrivacyNotice: ${tblErr}`)
    }

    // ============================================
    // 6. Add status column to Position (Aug 2026 - Position/Vacancy unification)
    // ============================================
    try {
      await db.$executeRawUnsafe(`SELECT "status" FROM "Position" LIMIT 0;`)
      results.push('✓ Column "Position.status" already exists')
    } catch {
      try {
        await db.$executeRawUnsafe(
          `ALTER TABLE "Position" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';`
        )
        results.push('✓ Added column "Position.status" (TEXT, default ACTIVE)')
      } catch (addErr) {
        results.push(`✗ Failed to add column "Position.status": ${addErr}`)
      }
    }

    // ============================================
    // 7. Add retention columns to User (Phase 3.2)
    // ============================================
    for (const col of ['piiPurgeAt', 'sensitivePurgeAt']) {
      try {
        await db.$executeRawUnsafe(`SELECT "${col}" FROM "User" LIMIT 0;`)
        results.push(`✓ Column "User.${col}" already exists`)
      } catch {
        try {
          await db.$executeRawUnsafe(
            `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "${col}" TIMESTAMP(3);`
          )
          results.push(`✓ Added column "User.${col}" (TIMESTAMP)`)
        } catch (addErr) {
          results.push(`✗ Failed to add column "User.${col}": ${addErr}`)
        }
      }
    }

    // ============================================
    // 8. Add retention columns to EvaluationResult (Phase 3.2)
    // ============================================
    for (const col of ['retainedUntil', 'purgedAt']) {
      try {
        await db.$executeRawUnsafe(`SELECT "${col}" FROM "EvaluationResult" LIMIT 0;`)
        results.push(`✓ Column "EvaluationResult.${col}" already exists`)
      } catch {
        try {
          await db.$executeRawUnsafe(
            `ALTER TABLE "EvaluationResult" ADD COLUMN IF NOT EXISTS "${col}" TIMESTAMP(3);`
          )
          results.push(`✓ Added column "EvaluationResult.${col}" (TIMESTAMP)`)
        } catch (addErr) {
          results.push(`✗ Failed to add column "EvaluationResult.${col}": ${addErr}`)
        }
      }
    }

    // ============================================
    // 9. Add evidence columns to ConsentLog (Phase 2.2)
    // ============================================
    for (const col of ['userAgent', 'companyId', 'adminUserId', 'reason']) {
      try {
        await db.$executeRawUnsafe(`SELECT "${col}" FROM "ConsentLog" LIMIT 0;`)
        results.push(`✓ Column "ConsentLog.${col}" already exists`)
      } catch {
        try {
          const colType = col === 'companyId' || col === 'adminUserId' ? 'TEXT' : (col === 'reason' ? 'TEXT' : 'TEXT')
          await db.$executeRawUnsafe(
            `ALTER TABLE "ConsentLog" ADD COLUMN IF NOT EXISTS "${col}" ${colType};`
          )
          results.push(`✓ Added column "ConsentLog.${col}" (${colType})`)
        } catch (addErr) {
          results.push(`✗ Failed to add column "ConsentLog.${col}": ${addErr}`)
        }
      }
    }

    // ============================================
    // 10. Create AuditLog table (Phase 1.7)
    // ============================================
    try {
      await db.$executeRawUnsafe(`SELECT "id" FROM "AuditLog" LIMIT 0;`)
      results.push('✓ Table "AuditLog" already exists')
    } catch {
      try {
        await db.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "AuditLog" (
            "id" TEXT NOT NULL,
            "actorId" TEXT,
            "action" TEXT NOT NULL,
            "resource" TEXT,
            "resourceId" TEXT,
            "companyId" TEXT,
            "details" TEXT,
            "ipAddress" TEXT,
            "userAgent" TEXT,
            "success" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
          );
        `)
        await db.$executeRawUnsafe(
          `CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog"("actorId");`
        )
        await db.$executeRawUnsafe(
          `CREATE INDEX IF NOT EXISTS "AuditLog_companyId_idx" ON "AuditLog"("companyId");`
        )
        await db.$executeRawUnsafe(
          `CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");`
        )
        await db.$executeRawUnsafe(
          `CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");`
        )
        results.push('✓ Created table "AuditLog" with indexes')
      } catch (createErr) {
        results.push(`✗ Failed to create table "AuditLog": ${createErr}`)
      }
    }

    // ============================================
    // 11. RLS POLICIES — NOT EXECUTED HERE (FASE 3.5-D.2.8)
    // ============================================
    // The former step executed prisma/rls-policies.sql via
    // $executeRawUnsafe, which meant a single SUPER_ADMIN HTTP call could
    // ENABLE + FORCE Row Level Security in production (with the old
    // app.is_super_admin bypass SQL). That is architecturally forbidden:
    //
    //   - RLS activation must be a controlled, manual, DBA-run migration.
    //   - No runtime HTTP endpoint may execute policy/DDL security SQL.
    //
    // See prisma/rls-policies.sql (definitive, D.2.8) and
    // prisma/create-rls-role.sql / prisma/create-evalhr-sa-role.sql.
    results.push(
      '⊘ RLS policies intentionally NOT applied via HTTP endpoint (D.2.8) — run the controlled migration manually when the activation phase is approved'
    )

    // Verify by checking the columns
    let verification
    try {
      verification = await db.$queryRawUnsafe(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'User' AND column_name IN ('consentGiven', 'consentDate', 'consentOption', 'anonymousStats', 'consentConfirmed', 'consentWithdrawnAt', 'consentVersion')
        ORDER BY column_name;
      `)
    } catch {
      verification = 'could not verify'
    }

    return NextResponse.json({
      success: true,
      results,
      verification,
      message: 'Migración completada. Consentimiento + Integridad + Aviso de privacidad listos.',
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Error en migración', detail: String(error) },
      { status: 500 }
    )
  }
}
