import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

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
    const sector = req.nextUrl.searchParams.get('sector')
    const all = req.nextUrl.searchParams.get('all')

    // If "all" is set, return all active positions (SUPER_ADMIN only for multi-tenant isolation)
    if (all === 'true') {
      // Only SUPER_ADMIN can see positions from all companies — use unscoped client
      if (auth.role === 'SUPER_ADMIN') {
        const positions = await getUnscopedClient().position.findMany({
          where: { active: true, ...(sector ? { sector } : {}) },
          orderBy: [{ sector: 'asc' }, { title: 'asc' }],
          include: {
            company: {
              select: { id: true, name: true, sector: true },
            },
            evaluationTemplates: {
              select: {
                id: true,
                name: true,
                type: true,
                order: true,
                _count: { select: { questions: true } },
              },
              orderBy: { order: 'asc' },
            },
            _count: {
              select: { sessions: true },
            },
          },
        })
        return NextResponse.json({ positions })
      }

      // Non-admin: use RLS client (auto-scoped to their company)
      const { client: rlsDb } = createRLSClient(auth)
      const positions = await rlsDb.position.findMany({
        where: { active: true, ...(sector ? { sector } : {}) },
        orderBy: [{ sector: 'asc' }, { title: 'asc' }],
        include: {
          company: {
            select: { id: true, name: true, sector: true },
          },
          evaluationTemplates: {
            select: {
              id: true,
              name: true,
              type: true,
              order: true,
              _count: { select: { questions: true } },
            },
            orderBy: { order: 'asc' },
          },
          _count: {
            select: { sessions: true },
          },
        },
      })
      return NextResponse.json({ positions })
    }

    // Standard list — RLS handles scoping
    const { client: rlsDb } = targetCompanyId
      ? createRLSClient({ ...auth, companyId: targetCompanyId })
      : createRLSClient(auth)

    const positions = await rlsDb.position.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        evaluationTemplates: {
          select: {
            id: true,
            name: true,
            type: true,
            order: true,
            _count: { select: { questions: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { sessions: true },
        },
      },
    })

    return NextResponse.json({ positions })
  } catch (error) {
    console.error('Positions GET error:', error)
    return NextResponse.json({ error: 'Error fetching positions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, sector, category, description, hasKnowledgeTest } = body

    // For SUPER_ADMIN with a specific target companyId from body, scope to that company
    const targetCompanyId = auth.role === 'SUPER_ADMIN'
      ? body.companyId
      : null
    const { client: rlsDb } = targetCompanyId
      ? createRLSClient({ ...auth, companyId: targetCompanyId })
      : createRLSClient(auth)
    const companyId = targetCompanyId || auth.companyId

    if (!title || !sector || !category || !companyId) {
      return NextResponse.json({ error: 'title, sector, category, and companyId are required' }, { status: 400 })
    }

    const position = await rlsDb.position.create({
      data: {
        title,
        sector,
        category,
        description: description || null,
        hasKnowledgeTest: hasKnowledgeTest || false,
        // companyId auto-injected by RLS for non-SUPER_ADMIN; SUPER_ADMIN must specify
        ...(companyId ? { companyId } : {}),
      },
    })

    return NextResponse.json({ position }, { status: 201 })
  } catch (error) {
    console.error('Positions POST error:', error)
    return NextResponse.json({ error: 'Error creating position' }, { status: 500 })
  }
}
