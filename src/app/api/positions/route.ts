import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId')
    const sector = req.nextUrl.searchParams.get('sector')
    const all = req.nextUrl.searchParams.get('all')

    // If "all" is set, return all active positions (for candidate selection)
    if (all === 'true') {
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

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    const positions = await db.position.findMany({
      where: { companyId, active: true },
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
    const body = await req.json()
    const { title, sector, category, description, hasKnowledgeTest, companyId } = body

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
