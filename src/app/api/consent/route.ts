import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body

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
