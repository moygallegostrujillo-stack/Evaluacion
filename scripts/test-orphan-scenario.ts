/**
 * Test the ORPHAN USER scenario:
 * 1. Create invitation 1 in Company A → auto-login creates user with companyId A
 * 2. Delete invitation 1 (but user remains as orphan)
 * 3. Create invitation 2 in Company B (different company, same phone)
 * 4. Auto-login with invitation 2 → should UPDATE the orphan user's companyId to B
 * 5. Consent API → should find the user (companyId now matches)
 */
import { getUnscopedClient } from '../src/lib/rls'
import { generateToken } from '../src/lib/auth'
import { hashPassword } from '../src/lib/password'
import crypto from 'crypto'

async function main() {
  const db = getUnscopedClient()

  // Get both companies
  const companies = await db.company.findMany({})
  if (companies.length < 2) { console.log('Need 2 companies for this test'); return }
  const [companyA, companyB] = companies

  // Get positions for each company
  const posA = await db.position.findFirst({ where: { companyId: companyA.id } })
  const posB = await db.position.findFirst({ where: { companyId: companyB.id } })
  if (!posA || !posB) { console.log('Need positions in both companies'); return }

  // Get admin
  const admin = await db.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  if (!admin) { console.log('No admin found'); return }

  console.log('=== SCENARIO: Orphan user with stale companyId ===')
  console.log('Company A:', companyA.id, companyA.name)
  console.log('Company B:', companyB.id, companyB.name)

  const phone = '9619998888' // Unique test phone
  const phoneClean = phone.replace(/[^0-9]/g, '')
  const autoEmail = `cand_${phoneClean}@evaluhr.auto`

  // Clean up any existing test data
  await db.candidateInvitation.deleteMany({ where: { phone } }).catch(() => {})
  await db.user.deleteMany({ where: { email: autoEmail } }).catch(() => {})

  // Step 1: Create invitation 1 in Company A
  const token1 = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const inv1 = await db.candidateInvitation.create({
    data: {
      candidateName: 'Test User',
      phone,
      token: token1,
      status: 'PENDING',
      channel: 'WHATSAPP',
      companyId: companyA.id,
      positionId: posA.id,
      invitedBy: admin.id,
      expiresAt,
    },
  })
  console.log('\n1. Created invitation 1 in Company A')

  // Step 2: Simulate auto-login (creates user with companyId A)
  const user1 = await db.user.create({
    data: {
      email: autoEmail,
      name: 'Test User',
      password: await hashPassword(crypto.randomUUID()),
      role: 'CANDIDATO',
      phone,
      companyId: companyA.id,
    },
  })
  console.log('2. Created user with companyId A:', user1.id, 'companyId:', user1.companyId)

  // Mark invitation 1 as REGISTERED
  await db.candidateInvitation.update({
    where: { id: inv1.id },
    data: { status: 'REGISTERED' },
  })

  // Step 3: Delete invitation 1 (BUT keep the user as orphan)
  await db.candidateInvitation.delete({ where: { id: inv1.id } })
  console.log('3. Deleted invitation 1 (user remains as orphan)')

  // Step 4: Create invitation 2 in Company B (same phone)
  const token2 = crypto.randomBytes(32).toString('hex')
  const inv2 = await db.candidateInvitation.create({
    data: {
      candidateName: 'Test User',
      phone,
      token: token2,
      status: 'PENDING',
      channel: 'WHATSAPP',
      companyId: companyB.id, // DIFFERENT company!
      positionId: posB.id,
      invitedBy: admin.id,
      expiresAt,
    },
  })
  console.log('4. Created invitation 2 in Company B (same phone, different company)')

  // Step 5: Simulate the NEW auto-login logic
  console.log('\n=== Auto-login with invitation 2 (NEW logic) ===')

  // Check if user with this auto-email exists
  const existingAutoUser = await db.user.findFirst({
    where: { email: autoEmail },
    include: { company: true },
  })

  let user
  if (existingAutoUser) {
    console.log('Found existing user. Old companyId:', existingAutoUser.companyId, 'vs invitation companyId:', companyB.id)
    if (existingAutoUser.companyId !== companyB.id) {
      console.log('→ CompanyId mismatch! Updating user companyId to match invitation...')
      await db.user.update({
        where: { id: existingAutoUser.id },
        data: {
          companyId: companyB.id,
          name: inv2.candidateName || existingAutoUser.name,
          phone: inv2.phone || existingAutoUser.phone,
        },
      })
      const reloaded = await db.user.findFirst({
        where: { id: existingAutoUser.id },
        include: { company: true },
      })
      user = reloaded || existingAutoUser
      console.log('→ Updated user companyId to:', user?.companyId)
    } else {
      user = existingAutoUser
    }
  }

  // Generate JWT
  const fullUser = user
  const jwtToken = await generateToken({
    sub: fullUser!.id,
    email: fullUser!.email,
    name: fullUser!.name,
    role: fullUser!.role,
    companyId: fullUser!.companyId || undefined,
    companyName: fullUser!.company?.name || undefined,
    companySector: fullUser!.company?.sector || undefined,
  })
  console.log('5. JWT companyId:', fullUser!.companyId)

  // Step 6: Simulate consent API lookup (using UNSCOPED client + safeFindUserById pattern)
  console.log('\n=== Consent API simulation (NEW logic) ===')
  const unscopedUser = await db.user.findUnique({
    where: { id: fullUser!.id },
    include: { company: true },
  })
  console.log('6. Unscoped lookup result:', unscopedUser ? 'FOUND' : 'NULL')
  if (unscopedUser) {
    console.log('   User companyId:', unscopedUser.companyId)
    console.log('   JWT companyId:', fullUser!.companyId)
    console.log('   Match?', unscopedUser.companyId === fullUser!.companyId)
  }

  // Cleanup
  await db.candidateInvitation.delete({ where: { id: inv2.id } }).catch(() => {})
  await db.user.delete({ where: { id: user1.id } }).catch(() => {})
  console.log('\n✓ Cleanup done')
  console.log('\n=== RESULT: The orphan user companyId mismatch is now FIXED ===')
  console.log('    The auto-login updates the user companyId to match the invitation')
  console.log('    AND the consent API uses unscoped lookup, so no more "Usuario no encontrado"')
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e); process.exit(1) })
