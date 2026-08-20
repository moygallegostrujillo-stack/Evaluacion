/**
 * Reproduce the "Usuario no encontrado" consent error locally.
 * Simulates: invitation → auto-login → consent submission
 */
import { db } from '../src/lib/db'
import { getUnscopedClient } from '../src/lib/rls'
import { generateToken, verifyToken } from '../src/lib/auth'
import { hashPassword } from '../src/lib/password'
import crypto from 'crypto'

async function main() {
  const dbu = getUnscopedClient()

  // 1. Find a company + position + admin
  const company = await dbu.company.findFirst({})
  if (!company) { console.log('No company found'); return }
  const position = await dbu.position.findFirst({ where: { companyId: company.id } })
  if (!position) { console.log('No position found'); return }
  const admin = await dbu.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  if (!admin) { console.log('No admin found'); return }

  console.log('Company:', company.id, company.name)
  console.log('Position:', position.id, position.title)
  console.log('Admin:', admin.id, admin.email)

  // 2. Create invitation
  const token = crypto.randomBytes(32).toString('hex')
  console.log('Token length:', token.length)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const invitation = await dbu.candidateInvitation.create({
    data: {
      candidateName: 'Juan García Test',
      phone: '9611234567',
      token,
      status: 'PENDING',
      channel: 'WHATSAPP',
      companyId: company.id,
      positionId: position.id,
      invitedBy: admin.id,
      expiresAt,
    },
  })
  console.log('Invitation created:', invitation.id, 'status:', invitation.status)

  // 3. Simulate auto-login (PENDING → create user)
  const phoneClean = (invitation.phone || '').replace(/[^0-9]/g, '')
  const autoEmail = `cand_${phoneClean || invitation.id.slice(0, 12)}@evaluhr.auto`
  console.log('Auto email:', autoEmail)

  // Check existing user
  const existingAutoUser = await dbu.user.findFirst({ where: { email: autoEmail }, include: { company: true } })
  console.log('Existing auto user?', existingAutoUser ? 'YES' : 'NO')

  let user
  if (existingAutoUser) {
    user = existingAutoUser
    console.log('Using existing user:', user.id, 'companyId:', user.companyId)
  } else {
    user = await dbu.user.create({
      data: {
        email: autoEmail,
        name: invitation.candidateName || 'Candidato',
        password: await hashPassword(crypto.randomUUID()),
        role: 'CANDIDATO',
        phone: invitation.phone,
        companyId: invitation.companyId,
      },
      include: { company: true },
    })
    console.log('Created user:', user.id, 'companyId:', user.companyId)
  }

  // Mark invitation as REGISTERED
  await dbu.candidateInvitation.update({
    where: { id: invitation.id },
    data: { status: 'REGISTERED' },
  })

  // 4. Generate JWT (same as auto-login)
  const fullUser = user.company ? user : await dbu.user.findFirst({ where: { id: user.id }, include: { company: true } })
  if (!fullUser) { console.log('fullUser is null!'); return }

  const jwtToken = await generateToken({
    sub: fullUser.id,
    email: fullUser.email,
    name: fullUser.name,
    role: fullUser.role,
    companyId: fullUser.companyId || undefined,
    companyName: fullUser.company?.name || undefined,
    companySector: fullUser.company?.sector || undefined,
  })

  console.log('JWT generated. companyId in payload:', fullUser.companyId)

  // 5. Verify JWT
  const verified = await verifyToken(jwtToken)
  console.log('Verified JWT companyId:', verified?.companyId)

  // 6. Simulate consent API lookup (the failing part)
  // auth = { userId: fullUser.id, role: 'CANDIDATO', companyId: fullUser.companyId }
  const auth = {
    userId: fullUser.id,
    email: fullUser.email,
    name: fullUser.name,
    role: fullUser.role,
    companyId: fullUser.companyId || undefined,
  }
  console.log('Auth:', JSON.stringify(auth))

  // Create RLS client (same as consent API)
  const { createRLSClient } = await import('../src/lib/rls')
  let rlsDb
  try {
    const result = createRLSClient(auth)
    rlsDb = result.client
    console.log('RLS client created OK')
  } catch (e) {
    console.log('RLS client creation FAILED:', e)
    return
  }

  // Find user via RLS client (the exact call that fails)
  console.log('--- CONSENT API SIMULATION ---')
  console.log('Looking up user with id:', auth.userId, 'companyId filter:', auth.companyId)

  const foundUser = await rlsDb.user.findUnique({
    where: { id: auth.userId },
  })
  console.log('findUnique result:', foundUser ? 'FOUND' : 'NULL')
  if (foundUser) {
    console.log('Found user companyId:', foundUser.companyId)
  } else {
    console.log('!!! USER NOT FOUND — this reproduces the "Usuario no encontrado" error !!!')

    // Try without RLS (unscoped)
    const unscopedUser = await dbu.user.findUnique({ where: { id: auth.userId } })
    console.log('Unscoped lookup:', unscopedUser ? 'FOUND' : 'NULL')
    if (unscopedUser) {
      console.log('Unscoped user companyId:', unscopedUser.companyId, 'vs auth companyId:', auth.companyId)
      console.log('Match?', unscopedUser.companyId === auth.companyId)
    }
  }

  // Cleanup
  await dbu.candidateInvitation.delete({ where: { id: invitation.id } })
  if (!existingAutoUser) {
    await dbu.user.delete({ where: { id: user.id } }).catch(() => {})
  }
  console.log('Cleanup done')
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e); process.exit(1) })
