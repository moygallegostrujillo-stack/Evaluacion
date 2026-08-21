import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient, createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders, hasRole } from '@/lib/auth'
import { generatePrivacyNoticeHtml, CURRENT_PRIVACY_VERSION } from '@/lib/privacy-notice'

// ── GET (public — no auth required) ──────────────────────────────────────────
// Returns the company's privacy notice HTML.
// If none exists, auto-generates one, saves it, and returns it.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: companyId' },
        { status: 400 }
      )
    }

    const db = getUnscopedClient()

    // Look up existing notice for this company
    let notice = await db.companyPrivacyNotice.findUnique({
      where: { companyId },
    })

    // Auto-generate if none exists
    if (!notice) {
      const company = await db.company.findUnique({
        where: { id: companyId },
      })

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }

      const contentHtml = generatePrivacyNoticeHtml(company)
      notice = await db.companyPrivacyNotice.create({
        data: {
          companyId: company.id,
          contentHtml,
          version: CURRENT_PRIVACY_VERSION,
          isCustom: false,
        },
      })
    }

    return NextResponse.json({
      contentHtml: notice.contentHtml,
      version: notice.version,
      isCustom: notice.isCustom,
    })
  } catch (error) {
    console.error('Privacy notice GET error:', error)
    return NextResponse.json(
      { error: 'Error fetching privacy notice' },
      { status: 500 }
    )
  }
}

// ── PUT (auth required, RH or SUPER_ADMIN) ───────────────────────────────────
// Updates the privacy notice content for the authenticated user's company.
// Sets isCustom = true.
export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasRole(auth.role, ['RH', 'SUPER_ADMIN'])) {
      return NextResponse.json(
        { error: 'Forbidden: only RH or SUPER_ADMIN can update the privacy notice' },
        { status: 403 }
      )
    }

    if (!auth.companyId) {
      return NextResponse.json(
        { error: 'User has no company assigned' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { contentHtml } = body

    if (!contentHtml || typeof contentHtml !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: contentHtml' },
        { status: 400 }
      )
    }

    const { client } = createRLSClient(auth)

    // Fetch existing notice and verify ownership (manual filter since
    // CompanyPrivacyNotice is not in the RLS registry yet)
    const existing = await client.companyPrivacyNotice.findUnique({
      where: { companyId: auth.companyId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'No privacy notice found for this company' },
        { status: 404 }
      )
    }

    // Extra safety: verify companyId matches
    if (existing.companyId !== auth.companyId) {
      return NextResponse.json(
        { error: 'Forbidden: notice belongs to a different company' },
        { status: 403 }
      )
    }

    const updated = await client.companyPrivacyNotice.update({
      where: { companyId: auth.companyId },
      data: { contentHtml, isCustom: true },
    })

    return NextResponse.json({
      contentHtml: updated.contentHtml,
      version: updated.version,
      isCustom: updated.isCustom,
    })
  } catch (error) {
    console.error('Privacy notice PUT error:', error)
    return NextResponse.json(
      { error: 'Error updating privacy notice' },
      { status: 500 }
    )
  }
}

// ── POST (auth required, RH or SUPER_ADMIN) ──────────────────────────────────
// Action: "regenerate" — resets notice to auto-generated content.
// Sets isCustom = false, bumps version.
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasRole(auth.role, ['RH', 'SUPER_ADMIN'])) {
      return NextResponse.json(
        { error: 'Forbidden: only RH or SUPER_ADMIN can regenerate the privacy notice' },
        { status: 403 }
      )
    }

    if (!auth.companyId) {
      return NextResponse.json(
        { error: 'User has no company assigned' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (body.action !== 'regenerate') {
      return NextResponse.json(
        { error: 'Unsupported action. Use { "action": "regenerate" }' },
        { status: 400 }
      )
    }

    const { client } = createRLSClient(auth)

    // Get company data for generation
    const company = await client.company.findUnique({
      where: { id: auth.companyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Fetch existing notice
    const existing = await client.companyPrivacyNotice.findUnique({
      where: { companyId: auth.companyId },
    })

    const regeneratedHtml = generatePrivacyNoticeHtml(company)

    if (existing) {
      // Bump version: parse current version and increment
      const versionMatch = existing.version.match(/^(.*-v)(\d+)$/)
      const newVersion = versionMatch
        ? `${versionMatch[1]}${parseInt(versionMatch[2], 10) + 1}`
        : `${existing.version}-v2`

      const updated = await client.companyPrivacyNotice.update({
        where: { companyId: auth.companyId },
        data: {
          contentHtml: regeneratedHtml,
          version: newVersion,
          isCustom: false,
        },
      })

      return NextResponse.json({
        contentHtml: updated.contentHtml,
        version: updated.version,
        isCustom: updated.isCustom,
      })
    }

    // No existing notice — create one
    const created = await client.companyPrivacyNotice.create({
      data: {
        companyId: auth.companyId,
        contentHtml: regeneratedHtml,
        version: CURRENT_PRIVACY_VERSION,
        isCustom: false,
      },
    })

    return NextResponse.json({
      contentHtml: created.contentHtml,
      version: created.version,
      isCustom: created.isCustom,
    })
  } catch (error) {
    console.error('Privacy notice POST error:', error)
    return NextResponse.json(
      { error: 'Error regenerating privacy notice' },
      { status: 500 }
    )
  }
}
