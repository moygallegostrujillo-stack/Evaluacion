import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)

    // Derive userId from auth; SUPER_ADMIN can optionally specify a userId from body
    const body = await req.json()
    const userId = auth.role === 'SUPER_ADMIN'
      ? (body.userId || auth.userId)
      : auth.userId

    // Consent option: FULL (all evaluations), KNOWLEDGE_ONLY (just knowledge test)
    const consentOption = body.consentOption || 'FULL'
    const anonymousStats = body.anonymousStats || false

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    if (!['FULL', 'KNOWLEDGE_ONLY'].includes(consentOption)) {
      return NextResponse.json({ error: 'consentOption must be FULL or KNOWLEDGE_ONLY' }, { status: 400 })
    }

    const user = await rlsDb.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Defense-in-depth: RLS already filtered, but keep the check as extra safety
    if (auth.role !== 'SUPER_ADMIN' && user.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'No tienes permiso para modificar este usuario' }, { status: 403 })
    }

    const updatedUser = await rlsDb.user.update({
      where: { id: userId },
      data: {
        consentGiven: true,
        consentDate: new Date(),
        consentOption,
        anonymousStats,
      },
    })

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        consentGiven: updatedUser.consentGiven,
        consentDate: updatedUser.consentDate,
        consentOption: updatedUser.consentOption,
        anonymousStats: updatedUser.anonymousStats,
      },
      message: 'Consent recorded successfully',
    })
  } catch (error) {
    console.error('Consent POST error:', error)
    return NextResponse.json({ error: 'Error recording consent' }, { status: 500 })
  }
}
