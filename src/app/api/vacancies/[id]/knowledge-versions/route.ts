import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

/**
 * A-03.4 — KNOWLEDGE ASSESSMENT VERSION ADMINISTRATION
 * =====================================================
 * Read-only administration endpoint listing the frozen Knowledge Assessment
 * versions of a vacancy (metadata + frozen item structure).
 *
 * GOVERNANCE (A-03.4 PASO 10/11):
 * - Requires an authenticated RH/SUPER_ADMIN session (RLS-scoped client).
 * - NEVER exposes correctAnswerSnapshot values (keys are scoring material,
 *   only used server-side; not needed for version inspection).
 * - There is deliberately NO write method here: versions are published by the
 *   server authority (SYSTEM:PUBLIC_APPLY_FREEZE) when an administration
 *   starts against a changed bank. AI has no write authority on this resource
 *   and can never mutate an active assessment, a version, a key or a snapshot.
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params

    const vacancy = await rlsDb.vacancy.findUnique({
      where: { id },
      select: { id: true, companyId: true },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && vacancy.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const assessments = await rlsDb.knowledgeAssessment.findMany({
      where: { vacancyId: id },
      orderBy: { version: 'desc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            itemId: true,
            itemType: true,
            itemVersion: true,
            order: true,
            hasKey: true,
            difficulty: true,
            source: true,
            // questionSnapshot included WITHOUT the key; text/options are
            // administration metadata, safe for RH inspection.
            questionSnapshot: true,
            // correctAnswerSnapshot deliberately NOT selected.
          },
        },
        _count: { select: { applications: true } },
      },
    })

    return NextResponse.json({
      versions: assessments.map((a) => ({
        assessmentId: a.id,
        assessmentVersion: a.version,
        assessmentLabel: `KA-v${a.version}`,
        blueprintVersion: a.blueprintVersion,
        scoringVersion: a.scoringVersion,
        status: a.status,
        contentHash: a.contentHash,
        itemCount: a.itemCount,
        publishSource: a.publishSource,
        publishedBy: a.publishedBy,
        publishedAt: a.publishedAt,
        retiredAt: a.retiredAt,
        frozenApplications: a._count.applications,
        items: a.items.map((i) => {
          let text: string | null = null
          let optionsCount: number | null = null
          try {
            const snap = JSON.parse(i.questionSnapshot)
            text = snap?.text ?? null
            optionsCount = Array.isArray(snap?.options) ? snap.options.length : null
          } catch {
            text = null
          }
          return {
            itemId: i.itemId,
            itemType: i.itemType,
            itemVersion: i.itemVersion,
            order: i.order,
            hasKey: i.hasKey,
            difficulty: i.difficulty,
            source: i.source,
            text,
            optionsCount,
          }
        }),
      })),
    })
  } catch (error) {
    console.error('Error listing knowledge assessment versions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
