import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Derive companyId from auth; SUPER_ADMIN can optionally override
    const companyId = auth.role === 'SUPER_ADMIN'
      ? (req.nextUrl.searchParams.get('companyId') || auth.companyId)
      : auth.companyId
    const sector = req.nextUrl.searchParams.get('sector')
    const all = req.nextUrl.searchParams.get('all')

    // If "all" is set, return all active positions (SUPER_ADMIN only for multi-tenant isolation)
    if (all === 'true') {
      // Only SUPER_ADMIN can see positions from all companies
      if (auth.role !== 'SUPER_ADMIN') {
        // Non-admin: return only their own company's positions
        const positions = await db.position.findMany({
          where: { active: true, companyId: auth.companyId, ...(sector ? { sector } : {}) },
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

      const positions = await db.position.findMany({
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

    // Super Admin (no companyId) sees all positions
    const where = companyId ? { companyId, active: true } : { active: true }

    const positions = await db.position.findMany({
      where,
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

    // Derive companyId from auth; SUPER_ADMIN can optionally override
    const companyId = auth.role === 'SUPER_ADMIN'
      ? (body.companyId || auth.companyId)
      : auth.companyId

    if (!title || !sector || !category || !companyId) {
      return NextResponse.json({ error: 'title, sector, category, and companyId are required' }, { status: 400 })
    }

    const position = await db.position.create({
      data: {
        title,
        sector,
        category,
        description: description || null,
        hasKnowledgeTest: hasKnowledgeTest || false,
        companyId,
      },
    })

    return NextResponse.json({ position }, { status: 201 })
  } catch (error) {
    console.error('Positions POST error:', error)
    return NextResponse.json({ error: 'Error creating position' }, { status: 500 })
  }
}
