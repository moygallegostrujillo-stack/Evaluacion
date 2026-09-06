import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient, createRLSClient, createSuperAdminRLSClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import { logUnauthorizedAccess, logAuditEvent } from '@/lib/audit'
import { resolveTargetCompanyId } from '@/lib/impersonation'
import { getAggregateUserDirectory } from '@/lib/admin-db'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const companyIdFilter = searchParams.get('companyId')
    const roleFilter = searchParams.get('role')

    if (auth.role === 'SUPER_ADMIN') {
      // ── PHASE 3.5-H (VUL-H6): SA global user list → ADMIN DB (evalhr_sa). ──
      // The previous implementation read ALL users through the shared tenant
      // client (unscoped, unaudited). The global list is now an AGGREGATE
      // operation on the isolated administrative connection, audited per
      // invocation and fail-closed without ADMIN_DATABASE_URL.
      if (!companyIdFilter) {
        const { users } = await getAggregateUserDirectory({
          req,
          actorId: auth.userId,
          role: auth.role,
        })
        return NextResponse.json({ users })
      }

      // SA with ?companyId=B → IMPERSONATION on tenant B (audited helper +
      // RLS client scoped to B — NOT the shared global client).
      const { targetCompanyId } = await resolveTargetCompanyId(auth, req, {
        action: 'ACCESS',
        resource: 'User',
      })
      const { client: saDb } = createSuperAdminRLSClient(targetCompanyId as string)
      const users = await saDb.user.findMany({
        where: roleFilter ? { role: roleFilter } : {},
        select: {
          id: true, email: true, name: true, role: true,
          phone: true, companyId: true, active: true,
          consentGiven: true, consentDate: true,
          createdAt: true,
          company: { select: { id: true, name: true } },
        },
        orderBy: { name: 'asc' },
      })
      return NextResponse.json({ users })
    }

    if (auth.role === 'RH' || auth.role === 'GERENTE') {
      if (!auth.companyId) {
        return NextResponse.json({ error: 'No company associated' }, { status: 400 })
      }
      // PHASE 3.5-H (VUL-H6 classification — TENANT): RH/GERENTE list users
      // of their OWN company via the RLS client (evalhr_app + tenant scope).
      // A client-supplied companyId is never trusted.
      const where: Record<string, unknown> = {}
      if (roleFilter) where.role = roleFilter

      const { client: rlsDb } = createRLSClient(auth)
      const users = await rlsDb.user.findMany({
        where,
        select: {
          id: true, email: true, name: true, role: true,
          phone: true, companyId: true, active: true,
          consentGiven: true, consentDate: true,
          createdAt: true,
          company: { select: { id: true, name: true } },
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

    if (!email || !name || !password || !role || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, password, role, companyId' },
        { status: 400 }
      )
    }

    const allowedRoles = ['RH', 'GERENTE']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}` },
        { status: 400 }
      )
    }

    const db = getUnscopedClient()

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already taken' }, { status: 409 })
    }

    const company = await db.company.findUnique({ where: { id: companyId } })
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        email, name, password: hashedPassword, role, companyId,
        phone: phone || null, active: true, consentGiven: false,
      },
      select: {
        id: true, email: true, name: true, role: true,
        phone: true, companyId: true, active: true, consentGiven: true,
        createdAt: true,
        company: { select: { id: true, name: true } },
      },
    })

    // PHASE 3.5-H (PARTE 8): every SA global mutation is audited.
    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'CREATE',
      resource: 'User',
      resourceId: user.id,
      companyId,
      details: { mode: 'GLOBAL', createdRole: role },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}

// ============================================
// PUT — Update user (name, email, phone, role, companyId)
// ============================================
export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN' && auth.role !== 'RH') {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 })
    }

    const body = await req.json()
    const { id, name, email, phone, role, companyId } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = getUnscopedClient()

    // Verify user exists
    const existingUser = await db.user.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Cannot edit SUPER_ADMIN unless you are SUPER_ADMIN
    if (existingUser.role === 'SUPER_ADMIN' && auth.role !== 'SUPER_ADMIN') {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'User',
        resourceId: id,
        companyId: auth.companyId,
        reason: 'Non-SUPER_ADMIN attempted to edit SUPER_ADMIN',
      })
      return NextResponse.json({ error: 'Cannot edit a Super Admin' }, { status: 403 })
    }

    // SECURITY FIX (Phase 1.2): Cross-tenant check — RH can only edit users
    // within their own company. Previously missing, allowing RH from company A
    // to edit users in company B if they knew the user ID.
    if (auth.role !== 'SUPER_ADMIN' && existingUser.companyId !== auth.companyId) {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'User',
        resourceId: id,
        companyId: auth.companyId,
        reason: 'RH attempted to edit user from another company (cross-tenant)',
      })
      return NextResponse.json(
        { error: 'Forbidden: you can only edit users within your own company' },
        { status: 403 }
      )
    }

    // Cannot edit yourself to remove SUPER_ADMIN role
    if (existingUser.id === auth.userId && role && role !== 'SUPER_ADMIN' && auth.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot remove your own Super Admin role' }, { status: 400 })
    }

    // If email is changing, check it's not taken
    if (email && email !== existingUser.email) {
      const emailTaken = await db.user.findUnique({ where: { email } })
      if (emailTaken) {
        return NextResponse.json({ error: 'Email is already taken by another user' }, { status: 409 })
      }
    }

    // ── PHASE 3.5-H (VUL-H5): companyId reassignment is SA-ONLY. ──
    // Previously ANY RH could move a user (including themselves) to another
    // company — full tenant-escape via re-login. Now:
    //   RH/GERENTE: body.companyId is NEVER applied. If it points to a
    //     DIFFERENT company than the actor's own → 403 + audit. If it equals
    //     the actor's own company → silently ignored (ownership cannot be
    //     changed through this endpoint).
    //   SUPER_ADMIN: reassignment allowed and AUDITED with old/new company,
    //   target user, actor and timestamp.
    if (companyId !== undefined && auth.role !== 'SUPER_ADMIN') {
      if (companyId !== auth.companyId) {
        await logUnauthorizedAccess(req, {
          actorId: auth.userId,
          action: 'UPDATE',
          resource: 'User',
          resourceId: id,
          companyId: auth.companyId,
          reason: 'Non-SUPER_ADMIN attempted to reassign user companyId (tenant escape)',
        })
        return NextResponse.json(
          { error: 'Forbidden: only a Super Admin can reassign a user to another company' },
          { status: 403 }
        )
      }
      // companyId === auth.companyId → ignored below (never applied).
    }

    // If role is changing, validate it
    if (role) {
      const allowedRoles = auth.role === 'SUPER_ADMIN' ? ['RH', 'GERENTE', 'SUPER_ADMIN'] : ['RH', 'GERENTE']
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: `Invalid role. Allowed: ${allowedRoles.join(', ')}` }, { status: 400 })
      }
    }

    // If companyId is changing (SUPER_ADMIN only — see VUL-H5 gate above),
    // verify the target company exists.
    const companyReassignment =
      auth.role === 'SUPER_ADMIN' && companyId !== undefined && companyId !== existingUser.companyId
    if (companyReassignment) {
      const company = await db.company.findUnique({ where: { id: companyId } })
      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }
    }

    // Build update data (only include fields that were provided)
    // PHASE 3.5-H (VUL-H5): companyId is applied ONLY for SUPER_ADMIN.
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone || null
    if (role !== undefined) updateData.role = role
    if (auth.role === 'SUPER_ADMIN' && companyId !== undefined) updateData.companyId = companyId

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, email: true, name: true, role: true,
        phone: true, companyId: true, active: true,
        consentGiven: true, consentDate: true,
        createdAt: true,
        company: { select: { id: true, name: true } },
      },
    })

    // PHASE 3.5-H (PARTE 8): audit the SA mutation — with the full
    // reassignment trail when a company transfer happened.
    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'UPDATE',
      resource: 'User',
      resourceId: id,
      companyId: existingUser.companyId,
      details: {
        mode: 'GLOBAL',
        targetUserId: id,
        targetUserEmail: existingUser.email,
        ...(companyReassignment
          ? {
              companyTransfer: true,
              oldCompanyId: existingUser.companyId,
              newCompanyId: companyId,
            }
          : { companyTransfer: false }),
        changedFields: Object.keys(updateData),
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Users PUT error:', error)
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
  }
}

// ============================================
// PATCH — Toggle access (active/inactive) or change password
// ============================================
export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN' && auth.role !== 'RH') {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 })
    }

    const body = await req.json()
    const { id, action } = body

    if (!id || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 })
    }

    const db = getUnscopedClient()

    const existingUser = await db.user.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Cannot modify yourself
    if (existingUser.id === auth.userId) {
      return NextResponse.json({ error: 'Cannot modify your own account this way' }, { status: 400 })
    }

    // Cannot modify SUPER_ADMIN unless you are SUPER_ADMIN
    if (existingUser.role === 'SUPER_ADMIN' && auth.role !== 'SUPER_ADMIN') {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'User',
        resourceId: id,
        companyId: auth.companyId,
        reason: 'Non-SUPER_ADMIN attempted to modify SUPER_ADMIN',
      })
      return NextResponse.json({ error: 'Cannot modify a Super Admin' }, { status: 403 })
    }

    // SECURITY FIX (Phase 1.2): Cross-tenant check for PATCH operations
    // (toggle_access, change_password). Previously missing.
    if (auth.role !== 'SUPER_ADMIN' && existingUser.companyId !== auth.companyId) {
      await logUnauthorizedAccess(req, {
        actorId: auth.userId,
        action: 'UPDATE',
        resource: 'User',
        resourceId: id,
        companyId: auth.companyId,
        reason: 'RH attempted to modify user from another company (cross-tenant PATCH)',
      })
      return NextResponse.json(
        { error: 'Forbidden: you can only modify users within your own company' },
        { status: 403 }
      )
    }

    switch (action) {
      case 'toggle_access': {
        const newActive = !existingUser.active
        const updatedUser = await db.user.update({
          where: { id },
          data: {
            active: newActive,
          },
          select: {
            id: true, email: true, name: true, role: true,
            phone: true, companyId: true, active: true,
            company: { select: { id: true, name: true } },
          },
        })
        // PHASE 3.5-H (PARTE 8): mutation audited.
        await logAuditEvent(req, {
          actorId: auth.userId,
          action: 'UPDATE',
          resource: 'User',
          resourceId: id,
          companyId: existingUser.companyId,
          details: { targetUserId: id, patchAction: 'toggle_access', active: newActive },
        })
        return NextResponse.json({
          user: updatedUser,
          message: newActive
            ? `Acceso restaurado para ${existingUser.name}`
            : `Acceso revocado para ${existingUser.name}`,
        })
      }

      case 'change_password': {
        const { newPassword } = body
        if (!newPassword || newPassword.length < 6) {
          return NextResponse.json(
            { error: 'New password must be at least 6 characters' },
            { status: 400 }
          )
        }
        const hashedPassword = await hashPassword(newPassword)
        await db.user.update({
          where: { id },
          data: { password: hashedPassword },
        })
        // PHASE 3.5-H (PARTE 8): password change by SA/RH is audited.
        // NEVER store the password itself — only who changed whose.
        await logAuditEvent(req, {
          actorId: auth.userId,
          action: 'UPDATE',
          resource: 'User',
          resourceId: id,
          companyId: existingUser.companyId,
          details: { targetUserId: id, patchAction: 'change_password' },
        })
        return NextResponse.json({
          message: `Contraseña actualizada para ${existingUser.name}`,
        })
      }

      case 'delete': {
        // Full deletion — only SUPER_ADMIN can do this
        if (auth.role !== 'SUPER_ADMIN') {
          return NextResponse.json({ error: 'Only Super Admin can delete users' }, { status: 403 })
        }

        // Delete related records first (FK constraints)
        await db.evaluationResponse.deleteMany({
          where: { session: { candidateId: id } },
        })
        await db.evaluationResult.deleteMany({
          where: { candidateId: id },
        })
        await db.evaluationSession.deleteMany({
          where: { candidateId: id },
        })
        await db.interviewSchedule.deleteMany({
          where: { candidateId: id },
        })
        // Remove from invitations where they were the sender
        // (we can't delete invitations easily due to FK, so we leave them)

        await db.user.delete({ where: { id } })

        // PHASE 3.5-H (PARTE 8): destructive mutation audited.
        await logAuditEvent(req, {
          actorId: auth.userId,
          action: 'DELETE',
          resource: 'User',
          resourceId: id,
          companyId: existingUser.companyId,
          details: { targetUserId: id, targetUserEmail: existingUser.email, patchAction: 'delete' },
        })

        return NextResponse.json({
          message: `Usuario "${existingUser.name}" eliminado permanentemente`,
        })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error('Users PATCH error:', error)
    return NextResponse.json({ error: 'Error modifying user' }, { status: 500 })
  }
}

// ============================================
// DELETE — Delete user (alternative endpoint)
// ============================================
export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: only SUPER_ADMIN can delete users' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = getUnscopedClient()

    const existingUser = await db.user.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (existingUser.id === auth.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Delete related records
    await db.evaluationResponse.deleteMany({
      where: { session: { candidateId: id } },
    })
    await db.evaluationResult.deleteMany({ where: { candidateId: id } })
    await db.evaluationSession.deleteMany({ where: { candidateId: id } })
    await db.interviewSchedule.deleteMany({ where: { candidateId: id } })
    await db.user.delete({ where: { id } })

    // PHASE 3.5-H (PARTE 8): destructive mutation audited.
    await logAuditEvent(req, {
      actorId: auth.userId,
      action: 'DELETE',
      resource: 'User',
      resourceId: id,
      companyId: existingUser.companyId,
      details: { targetUserId: id, targetUserEmail: existingUser.email },
    })

    return NextResponse.json({
      message: `Usuario "${existingUser.name}" eliminado permanentemente`,
    })
  } catch (error) {
    console.error('Users DELETE error:', error)
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
  }
}
