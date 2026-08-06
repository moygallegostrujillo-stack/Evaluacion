import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromHeaders } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companies = await db.company.findMany({
      where: { active: true },
      select: { id: true, name: true, sector: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ companies })
  } catch (error) {
    console.error('Companies GET error:', error)
    return NextResponse.json({ error: 'Error fetching companies' }, { status: 500 })
  }
}
