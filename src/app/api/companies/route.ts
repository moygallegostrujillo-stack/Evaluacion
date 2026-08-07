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

    // SUPER_ADMIN can see all companies; others only see their own
    // Company is the tenant root — not scoped by companyId
    if (auth.role === 'SUPER_ADMIN') {
      const companies = await db.company.findMany({
        where: { active: true },
        select: { id: true, name: true, sector: true },
        orderBy: { name: 'asc' },
      })
      return NextResponse.json({ companies })
    }

    // Non-admin: only return their own company
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
