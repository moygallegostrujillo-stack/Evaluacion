import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const REVIEW_ROLES = ['RH', 'GERENTE', 'SUPER_ADMIN']

const VALID_COMPANY_DECISIONS = [
  'CONTINUAR_PROCESO',
  'ENTREVISTAR',
  'NO_CONTINUAR',
  'PENDIENTE',
] as const

const VALID_TECHNICAL_CATEGORIES = [
  'CUMPLE_CRITERIOS',
  'REQUIERE_REVISION',
  'NO_ALCANZA_CRITERIOS',
  'PENDIENTE',
] as const

/**
 * Determine whether the company decision differs from the technical category.
 *
 * Differs when:
 *  - technical = CUMPLE_CRITERIOS but company = NO_CONTINUAR
 *  - technical = NO_ALCANZA_CRITERIOS but company = CONTINUAR_PROCESO
 *
 * All other combinations are considered aligned.
 */
function computeDiffersFromTechnical(
  technicalCategory: string,
  companyDecision: string | null | undefined,
): boolean {
  if (!companyDecision) return false

  if (
    technicalCategory === 'CUMPLE_CRITERIOS' &&
    companyDecision === 'NO_CONTINUAR'
  ) {
    return true
  }

  if (
    technicalCategory === 'NO_ALCANZA_CRITERIOS' &&
    companyDecision === 'CONTINUAR_PROCESO'
  ) {
    return true
  }

  return false
}

/**
 * Extract the client IP address from request headers.
 * Checks X-Forwarded-For first (proxy / load-balancer), then falls back to
 * x-real-ip, and finally to the socket remote address if available.
 */
function extractIpAddress(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    // X-Forwarded-For may contain multiple IPs; the first is the client
    return forwarded.split(',')[0].trim()
  }
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return null
}

// ──────────────────────────────────────────────
// GET /api/human-review — Get reviews
// ──────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const resultId = searchParams.get('resultId')
    const companyIdParam = searchParams.get('companyId')

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId =
      auth.role === 'SUPER_ADMIN' ? companyIdParam : null
    const { client: rlsDb } = targetCompanyId
      ? createRLSClient({ ...auth, companyId: targetCompanyId })
      : createRLSClient(auth)
    const db = getUnscopedClient()

    // CANDIDATO can only see reviews for their own results
    if (auth.role === 'CANDIDATO') {
      const where: Record<string, unknown> = {}

      if (resultId) {
        // Verify the result belongs to this candidate
        const result = await rlsDb.evaluationResult.findUnique({
          where: { id: resultId },
          select: { id: true, candidateId: true },
        })
        if (!result || result.candidateId !== auth.userId) {
          return NextResponse.json(
            { error: 'Forbidden: result does not belong to you' },
            { status: 403 },
          )
        }
        where.resultId = resultId
      } else {
        // Return reviews for all results belonging to this candidate
        const candidateResults = await rlsDb.evaluationResult.findMany({
          where: { candidateId: auth.userId },
          select: { id: true },
        })
        const resultIds = candidateResults.map((r) => r.id)
        where.resultId = { in: resultIds }
      }

      const reviews = await db.humanReview.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          result: {
            select: {
              id: true,
              candidateName: true,
              positionTitle: true,
              overallScore: true,
              recommendation: true,
            },
          },
          reviewer: {
            select: { id: true, name: true, email: true },
          },
        },
      })

      return NextResponse.json({ reviews })
    }

    // RH / GERENTE / SUPER_ADMIN — filtered by query params
    const where: Record<string, unknown> = {}

    if (resultId) {
      where.resultId = resultId
    }

    // Manual companyId filtering (humanReview not covered by RLS extension)
    if (auth.role === 'SUPER_ADMIN') {
      if (targetCompanyId) {
        where.companyId = targetCompanyId
      }
      // else: no filter — SUPER_ADMIN sees all
    } else {
      // RH / GERENTE: scope to own company
      where.companyId = auth.companyId
    }

    const reviews = await db.humanReview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        result: {
          select: {
            id: true,
            candidateName: true,
            positionTitle: true,
            overallScore: true,
            recommendation: true,
          },
        },
        reviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('HumanReview GET error:', error)
    return NextResponse.json(
      { error: 'Error fetching human reviews' },
      { status: 500 },
    )
  }
}

// ──────────────────────────────────────────────
// POST /api/human-review — Create a human review
// ──────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!REVIEW_ROLES.includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: only RH, GERENTE, or SUPER_ADMIN can create reviews' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const {
      resultId,
      companyDecision,
      decisionReason,
      decisionNotes,
    } = body as {
      resultId?: string
      companyDecision?: string
      decisionReason?: string
      decisionNotes?: string
    }

    if (!resultId) {
      return NextResponse.json(
        { error: 'resultId is required' },
        { status: 400 },
      )
    }

    // Validate companyDecision if provided
    if (
      companyDecision &&
      !VALID_COMPANY_DECISIONS.includes(companyDecision as (typeof VALID_COMPANY_DECISIONS)[number])
    ) {
      return NextResponse.json(
        {
          error: `Invalid companyDecision. Must be one of: ${VALID_COMPANY_DECISIONS.join(', ')}`,
        },
        { status: 400 },
      )
    }

    // Look up the EvaluationResult (unscoped first so we can verify ownership, then RLS protects)
    const { client: rlsDb } = createRLSClient(auth)
    const db = getUnscopedClient()

    const result = await rlsDb.evaluationResult.findUnique({
      where: { id: resultId },
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Evaluation result not found' },
        { status: 404 },
      )
    }

    // Defense-in-depth: verify the result belongs to the reviewer's company
    if (auth.role !== 'SUPER_ADMIN' && result.companyId !== auth.companyId) {
      return NextResponse.json(
        { error: 'Forbidden: result belongs to another company' },
        { status: 403 },
      )
    }

    // Check if a review already exists for this result (resultId is @unique)
    const existingReview = await db.humanReview.findUnique({
      where: { resultId },
    })
    if (existingReview) {
      return NextResponse.json(
        { error: 'A human review already exists for this result. Use PUT to update.' },
        { status: 409 },
      )
    }

    // Compute differsFromTechnical
    const differsFromTechnical = computeDiffersFromTechnical(
      result.recommendation,
      companyDecision,
    )

    // Extract reviewer IP
    const ipAddress = extractIpAddress(req.headers)

    // Create the HumanReview
    const review = await db.humanReview.create({
      data: {
        resultId,
        companyId: result.companyId, // from the result, not from auth — ensures correctness
        technicalScore: result.overallScore,
        technicalCategory: result.recommendation,
        technicalSummary: result.summary,
        reviewedBy: auth.userId,
        companyDecision: companyDecision || null,
        decisionReason: decisionReason || null,
        decisionNotes: decisionNotes || null,
        decisionAt: companyDecision ? new Date() : null,
        ipAddress,
        differsFromTechnical,
      },
      include: {
        result: {
          select: {
            id: true,
            candidateName: true,
            positionTitle: true,
            overallScore: true,
            recommendation: true,
          },
        },
        reviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // Keep reviewRequired = true on the result until a real decision is made
    // (a decision means companyDecision is set and is not PENDIENTE)
    if (companyDecision && companyDecision !== 'PENDIENTE') {
      await db.evaluationResult.update({
        where: { id: resultId },
        data: { reviewRequired: false },
      })
    }
    // If no companyDecision or PENDIENTE, reviewRequired stays true (already true by default)

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('HumanReview POST error:', error)

    // Handle Prisma unique constraint violation (race condition)
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint failed')
    ) {
      return NextResponse.json(
        { error: 'A human review already exists for this result. Use PUT to update.' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: 'Error creating human review' },
      { status: 500 },
    )
  }
}

// ──────────────────────────────────────────────
// PUT /api/human-review — Update company decision
// ──────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!REVIEW_ROLES.includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: only RH, GERENTE, or SUPER_ADMIN can update reviews' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const {
      reviewId,
      companyDecision,
      decisionReason,
      decisionNotes,
    } = body as {
      reviewId?: string
      companyDecision?: string
      decisionReason?: string
      decisionNotes?: string
    }

    if (!reviewId) {
      return NextResponse.json(
        { error: 'reviewId is required' },
        { status: 400 },
      )
    }

    if (!companyDecision) {
      return NextResponse.json(
        { error: 'companyDecision is required' },
        { status: 400 },
      )
    }

    if (
      !VALID_COMPANY_DECISIONS.includes(companyDecision as (typeof VALID_COMPANY_DECISIONS)[number])
    ) {
      return NextResponse.json(
        {
          error: `Invalid companyDecision. Must be one of: ${VALID_COMPANY_DECISIONS.join(', ')}`,
        },
        { status: 400 },
      )
    }

    const { client: rlsDb } = createRLSClient(auth)
    const db = getUnscopedClient()

    // Look up the HumanReview — unscoped client; companyId ownership verified below
    const existingReview = await db.humanReview.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Human review not found' },
        { status: 404 },
      )
    }

    // Defense-in-depth: verify it belongs to the reviewer's company
    if (
      auth.role !== 'SUPER_ADMIN' &&
      existingReview.companyId !== auth.companyId
    ) {
      return NextResponse.json(
        { error: 'Forbidden: review belongs to another company' },
        { status: 403 },
      )
    }

    // Compute differsFromTechnical
    const differsFromTechnical = computeDiffersFromTechnical(
      existingReview.technicalCategory,
      companyDecision,
    )

    // Update the HumanReview
    const review = await db.humanReview.update({
      where: { id: reviewId },
      data: {
        companyDecision,
        decisionReason: decisionReason ?? existingReview.decisionReason,
        decisionNotes: decisionNotes ?? existingReview.decisionNotes,
        decisionAt: new Date(),
        differsFromTechnical,
      },
      include: {
        result: {
          select: {
            id: true,
            candidateName: true,
            positionTitle: true,
            overallScore: true,
            recommendation: true,
          },
        },
        reviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // Mark the EvaluationResult's reviewRequired as false — a decision has been made
    // Only clear when a real decision is made (not PENDIENTE)
    if (companyDecision !== 'PENDIENTE') {
      await db.evaluationResult.update({
        where: { id: existingReview.resultId },
        data: { reviewRequired: false },
      })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('HumanReview PUT error:', error)
    return NextResponse.json(
      { error: 'Error updating human review' },
      { status: 500 },
    )
  }
}
