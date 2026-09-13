/**
 * D.2.3 — Browser verification fixture: synthetic tenant + RH user + position
 * with templates (via system generator) + invitation. Cleanup: --cleanup
 */
import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

const SUFFIX = 'brtest'
const EMAIL = `d23-${SUFFIX}-rh@test.local`

async function cleanup() {
  const user = await db.user.findUnique({ where: { email: EMAIL } })
  if (user?.companyId) {
    const cId = user.companyId
    await db.candidateInvitation.deleteMany({ where: { companyId: cId } })
    const positions = await db.position.findMany({ where: { companyId: cId } })
    for (const p of positions) {
      const ts = await db.evaluationTemplate.findMany({ where: { positionId: p.id } })
      for (const t of ts) {
        await db.question.deleteMany({ where: { evaluationTemplateId: t.id } })
        await db.evaluationTemplate.delete({ where: { id: t.id } })
      }
    }
    await db.position.deleteMany({ where: { companyId: cId } })
    await db.company.delete({ where: { id: cId } }).catch(() => {})
  }
  await db.user.delete({ where: { email: EMAIL } }).catch(() => {})
  console.log('[cleanup] browser fixture removed')
  process.exit(0)
}

if (process.argv[2] === '--cleanup') await cleanup()

const existing = await db.user.findUnique({ where: { email: EMAIL } })
if (existing) {
  console.log('fixture already exists:', EMAIL)
  process.exit(0)
}
const company = await db.company.create({ data: { name: `D23-BROWSER-${SUFFIX}`, sector: 'RESTAURANT' } })
const pwd = await hashPassword('brtest123')
await db.user.create({
  data: { email: EMAIL, name: 'RH Browser D23', password: pwd, role: 'RH', companyId: company.id },
})
const position = await db.position.create({
  data: { title: 'Mesero Browser', sector: 'RESTAURANT', category: 'MESERO', companyId: company.id, hasKnowledgeTest: true },
})
await db.candidateInvitation.create({
  data: {
    candidateName: 'Inv Browser', phone: '+5215570070001', token: `tok-br-${SUFFIX}`,
    status: 'PENDING', channel: 'WHATSAPP', companyId: company.id, positionId: position.id,
    invitedBy: (await db.user.findUnique({ where: { email: EMAIL } }))!.id,
    expiresAt: new Date(Date.now() + 7 * 864e5),
  },
})
console.log('fixture created:', EMAIL, '/ position:', position.id)
process.exit(0)
