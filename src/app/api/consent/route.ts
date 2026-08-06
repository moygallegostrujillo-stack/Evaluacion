import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromHeaders } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Derive userId from auth; SUPER_ADMIN can optionally specify a userId from body
    const body = await req.json()
    const userId = auth.role === 'SUPER_ADMIN'
      ? (body.userId || auth.userId)
      : auth.userId

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        consentGiven: true,
        consentDate: new Date(),
      },
    })

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        consentGiven: updatedUser.consentGiven,
        consentDate: updatedUser.consentDate,
      },
      message: 'Consent recorded successfully',
    })
  } catch (error) {
    console.error('Consent POST error:', error)
    return NextResponse.json({ error: 'Error recording consent' }, { status: 500 })
  }
}
