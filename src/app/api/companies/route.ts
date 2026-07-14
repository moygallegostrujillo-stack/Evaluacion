import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
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
