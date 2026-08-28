import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, createSuperAdminRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

// ============================================
// SLUG GENERATION
// ============================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '') // trim hyphens
}

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let attempts = 0
  const unscopedDb = getUnscopedClient()

  while (true) {
    const existing = await unscopedDb.vacancy.findUnique({ where: { slug } })
    if (!existing) break
    attempts++
    const suffix = Math.random().toString(36).substring(2, 6)
    slug = `${baseSlug}-${suffix}`
    if (attempts > 10) break
  }

  return slug
}

// ============================================
// GET - List vacancies for a company
// ============================================

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For SUPER_ADMIN with a specific target companyId from query param, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? req.nextUrl.searchParams.get('companyId')
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)

    // RLS auto-filters by companyId
    const vacancies = await rlsDb.vacancy.findMany({
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const serialized = vacancies.map((v) => ({
      id: v.id,
      title: v.title,
      slug: v.slug,
      description: v.description,
      sector: v.sector,
      status: v.status,
      includePsicometrica: v.includePsicometrica,
      includePsicologica: v.includePsicologica,
      maxVideoSeconds: v.maxVideoSeconds,
      companyId: v.companyId,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      questions: v.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options ? JSON.parse(q.options) : null,
        correctAnswer: q.correctAnswer,
        order: q.order,
      })),
      applicationCount: v._count.applications,
    }))

    return NextResponse.json({ vacancies: serialized })
  } catch (error) {
    console.error('Error listing vacancies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// POST - Create a new vacancy
// ============================================

interface CreateVacancyBody {
  title: string
  description?: string
  sector?: string
  companyId: string
  includePsicometrica?: boolean
  includePsicologica?: boolean
  maxVideoSeconds?: number
  questions?: Array<{
    text: string
    options: string[]
    correctAnswer: number
  }>
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateVacancyBody = await req.json()
    const { title, description, sector, includePsicometrica, includePsicologica, maxVideoSeconds, questions } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createSuperAdminRLSClient(targetCompanyId)
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!title || !companyId) {
      return NextResponse.json({ error: 'title and companyId are required' }, { status: 400 })
    }

    // Verify company exists (use unscoped since Company is tenant root)
    const company = await getUnscopedClient().company.findUnique({ where: { id: companyId } })
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const slug = await generateUniqueSlug(title)

    const vacancy = await rlsDb.vacancy.create({
      data: {
        title,
        slug,
        description: description || null,
        sector: sector || 'GENERAL',
        includePsicometrica: includePsicometrica !== undefined ? includePsicometrica : true,
        includePsicologica: includePsicologica !== undefined ? includePsicologica : true,
        maxVideoSeconds: maxVideoSeconds || 60,
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
        companyId,
        questions: questions
          ? {
              create: questions.map((q: any, index: number) => ({
                text: q.text,
                type: 'MULTIPLE_CHOICE' as const,
                options: JSON.stringify(q.options),
                correctAnswer: q.correctAnswer,
                order: index + 1,
              })),
            }
          : undefined,
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
        questions: (vacancy as any).questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options ? JSON.parse(q.options) : null,
          correctAnswer: q.correctAnswer,
          order: q.order,
        })),
        applicationCount: (vacancy as any)._count.applications,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vacancy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
