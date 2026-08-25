import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromHeaders } from '@/lib/auth'
import { logUnauthorizedAccess } from '@/lib/audit'
import { runRetentionPurge } from '@/lib/retention'

/**
 * POST /api/retention — Run the data retention purge job.
 *
 * SUPER_ADMIN only. This endpoint is IDEMPOTENT — running it multiple times
 * produces the same result as running it once.
 *
 * Body:
 *   { dryRun?: boolean } — If true (default), only report what WOULD be purged.
 *                         Set to false to actually perform deletions.
 *
 * This endpoint should be called by a scheduled cron job (e.g., Vercel Cron)
 * on a daily basis. See vercel.json for cron configuration.
 *
 * SECURITY: Uses unscoped Prisma client because it needs to access ALL
 * records across ALL tenants for compliance purposes.
 */
export async function POST(req: NextRequest) {
  try {
    // Check for Vercel Cron authentication (CRON_SECRET)
    // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
    const cronSecret = process.env.CRON_SECRET
    const authHeader = req.headers.get('authorization') || ''
    const isCronRequest = cronSecret && authHeader === `Bearer ${cronSecret}`

    let auth = null
    let actorId: string | undefined

    if (isCronRequest) {
      // Vercel Cron call — authorized via CRON_SECRET, no JWT needed
      auth = { role: 'SUPER_ADMIN', userId: 'cron', companyId: null }
      actorId = 'cron'
    } else {
      auth = getAuthFromHeaders(req.headers)
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Only SUPER_ADMIN can run the retention job
      if (auth.role !== 'SUPER_ADMIN') {
        await logUnauthorizedAccess(req, {
          actorId: auth.userId,
          action: 'ADMIN_ACCESS',
          resource: 'RetentionJob',
          companyId: auth.companyId,
          reason: 'Non-SUPER_ADMIN attempted to run retention purge',
        })
        return NextResponse.json(
          { error: 'Forbidden: only SUPER_ADMIN can run the retention job' },
          { status: 403 }
        )
      }
      actorId = auth.userId
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    // For cron requests, always use dryRun=false (actual purge)
    // For manual requests, default to dryRun=true (safe)
    const dryRun = isCronRequest ? false : (body.dryRun !== false)

    const report = await runRetentionPurge({
      dryRun,
      req,
      actorId,
    })

    return NextResponse.json({
      success: true,
      report,
      message: dryRun
        ? 'Retención ejecutada en modo dry-run (sin eliminaciones). Revisa el reporte.'
        : 'Retención ejecutada. Los registros expirados han sido purgados/anonimizados.',
    })
  } catch (error) {
    console.error('[retention] POST error:', error)
    return NextResponse.json(
      { error: 'Error al ejecutar la retención', detail: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/retention — Get retention policy info and current status.
 * SUPER_ADMIN only.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Run a dry-run to get current status without making changes
    const report = await runRetentionPurge({ dryRun: true })

    return NextResponse.json({
      policy: {
        piiRetentionDays: 730, // 2 years
        sensitiveDataTrigger: 'On conclusion (90-day inactivity or withdrawal)',
        auditLogRetentionDays: 90,
      },
      currentStatus: report,
    })
  } catch (error) {
    console.error('[retention] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener estado de retención' }, { status: 500 })
  }
}
