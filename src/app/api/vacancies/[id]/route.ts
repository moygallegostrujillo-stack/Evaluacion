import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

// ============================================
// SLUG GENERATION
// ============================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let attempts = 0
  const unscopedDb = getUnscopedClient()

  while (true) {
    const existing = await unscopedDb.vacancy.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
    if (!existing) break
    attempts++
    const suffix = Math.random().toString(36).substring(2, 6)
    slug = `${baseSlug}-${suffix}`
    if (attempts > 10) break
  }

  return slug
}

// ============================================
// GET - Get vacancy detail
// ============================================

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
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { applications: true } },
      },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && vacancy.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      vacancy: {
        id: vacancy.id,
        title: vacancy.title,
        slug: vacancy.slug,
        description: vacancy.description,
        sector: vacancy.sector,
        status: vacancy.status,
        includePsicometrica: vacancy.includePsicometrica,
        includePsicologica: vacancy.includePsicologica,
        maxVideoSeconds: vacancy.maxVideoSeconds,
        companyId: vacancy.companyId,
        createdAt: vacancy.createdAt,
        updatedAt: vacancy.updatedAt,
        questions: vacancy.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options ? JSON.parse(q.options) : null,
          correctAnswer: q.correctAnswer,
          order: q.order,
        })),
        applicationCount: vacancy._count.applications,
      },
    })
  } catch (error) {
    console.error('Error getting vacancy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// PUT - Update vacancy
// ============================================

interface UpdateVacancyBody {
  title?: string
  description?: string
  status?: string
  sector?: string
  includePsicometrica?: boolean
  includePsicologica?: boolean
  maxVideoSeconds?: number
}

export async function PUT(
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
    const body: UpdateVacancyBody = await req.json()
    const { title, description, status, sector, includePsicometrica, includePsicologica, maxVideoSeconds } = body

    const existing = await rlsDb.vacancy.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && existing.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // If title changed, regenerate slug
    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = await generateUniqueSlug(title, id)
    }

    const vacancy = await rlsDb.vacancy.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title, slug } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(sector !== undefined ? { sector } : {}),
        ...(includePsicometrica !== undefined ? { includePsicometrica } : {}),
        ...(includePsicologica !== undefined ? { includePsicologica } : {}),
        ...(maxVideoSeconds !== undefined ? { maxVideoSeconds } : {}),
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { applications: true } },
      },
    })

    return NextResponse.json({
      vacancy: {
        id: vacancy.id,
        title: vacancy.title,
        slug: vacancy.slug,
        description: vacancy.description,
        sector: vacancy.sector,
        status: vacancy.status,
        includePsicometrica: vacancy.includePsicometrica,
        includePsicologica: vacancy.includePsicologica,
        maxVideoSeconds: vacancy.maxVideoSeconds,
        companyId: vacancy.companyId,
        createdAt: vacancy.createdAt,
        updatedAt: vacancy.updatedAt,
        questions: vacancy.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options ? JSON.parse(q.options) : null,
          correctAnswer: q.correctAnswer,
          order: q.order,
        })),
        applicationCount: vacancy._count.applications,
      },
    })
  } catch (error) {
    console.error('Error updating vacancy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// DELETE - Close vacancy (soft delete)
// ============================================

export async function DELETE(
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

    const existing = await rlsDb.vacancy.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && existing.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const vacancy = await rlsDb.vacancy.update({
      where: { id },
      data: { status: 'CLOSED' },
    })

    return NextResponse.json({
      vacancy: {
        id: vacancy.id,
        title: vacancy.title,
        slug: vacancy.slug,
        status: vacancy.status,
      },
    })
  } catch (error) {
    console.error('Error closing vacancy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
