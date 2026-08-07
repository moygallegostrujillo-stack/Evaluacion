import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getUnscopedClient()

    // SUPER_ADMIN can see all companies with full data; others only see their own
    if (auth.role === 'SUPER_ADMIN') {
      const companies = await db.company.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          sector: true,
          plan: true,
          active: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          country: true,
          maxCandidatesPerMonth: true,
          _count: {
            select: {
              users: true,
              positions: true,
              vacancies: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      })
      return NextResponse.json({ companies })
    }

    // Non-admin: only return their own company (basic info)
    if (auth.companyId) {
      const company = await db.company.findUnique({
        where: { id: auth.companyId },
        select: { id: true, name: true, sector: true },
      })
      return NextResponse.json({ companies: company ? [company] : [] })
    }

    return NextResponse.json({ companies: [] })
  } catch (error) {
    console.error('Companies GET error:', error)
    return NextResponse.json({ error: 'Error fetching companies' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: only SUPER_ADMIN can create companies' }, { status: 403 })
    }

    const body = await req.json()
    const { name, sector, plan, phone, address, city, state, country } = body

    if (!name || !sector || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sector, plan' },
        { status: 400 }
      )
    }

    const db = getUnscopedClient()

    const company = await db.company.create({
      data: {
        name,
        sector,
        plan,
        phone: phone || null,
        address: address || null,
        city: city || 'Tuxtla Gutiérrez',
        state: state || 'Chiapas',
        country: country || 'México',
        active: true,
      },
    })

    return NextResponse.json({ company }, { status: 201 })
  } catch (error) {
    console.error('Companies POST error:', error)
    return NextResponse.json({ error: 'Error creating company' }, { status: 500 })
  }
}
