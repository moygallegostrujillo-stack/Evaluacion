import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { hashPassword } from '@/lib/password'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getUnscopedClient()
    const { searchParams } = new URL(req.url)
    const companyIdFilter = searchParams.get('companyId')
    const roleFilter = searchParams.get('role')

    if (auth.role === 'SUPER_ADMIN') {
      // SUPER_ADMIN can see all users, optionally filtered by companyId or role
      const where: Record<string, unknown> = {}

      if (companyIdFilter) {
        where.companyId = companyIdFilter
      }
      if (roleFilter) {
        where.role = roleFilter
      }

      const users = await db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          companyId: true,
          active: true,
          company: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: 'asc' },
      })

      return NextResponse.json({ users })
    }

    if (auth.role === 'RH' || auth.role === 'GERENTE') {
      // RH/GERENTE can only see users in their own company
      if (!auth.companyId) {
        return NextResponse.json({ error: 'No company associated' }, { status: 400 })
      }

      const where: Record<string, unknown> = {
        companyId: auth.companyId,
      }
      if (roleFilter) {
        where.role = roleFilter
      }

      const users = await db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          companyId: true,
          active: true,
          company: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: 'asc' },
      })

      return NextResponse.json({ users })
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: only SUPER_ADMIN can create users' }, { status: 403 })
    }

    const body = await req.json()
    const { email, name, password, role, companyId, phone } = body

    // Validate required fields
    if (!email || !name || !password || !role || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, password, role, companyId' },
        { status: 400 }
      )
    }

    // Validate role — only RH and GERENTE allowed
    const allowedRoles = ['RH', 'GERENTE']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}` },
        { status: 400 }
      )
    }

    const db = getUnscopedClient()

    // Check email is not already taken
    const existingUser = await db.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 409 }
      )
    }

    // Verify the target company exists
    const company = await db.company.findUnique({
      where: { id: companyId },
    })
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        companyId,
        phone: phone || null,
        active: true,
        consentGiven: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        companyId: true,
        active: true,
        consentGiven: true,
        createdAt: true,
        company: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}
