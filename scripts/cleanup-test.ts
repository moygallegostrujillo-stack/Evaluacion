import { getUnscopedClient } from '../src/lib/rls'
async function main() {
  const db = getUnscopedClient()
  // Delete test invitation and user
  const testInvs = await db.candidateInvitation.findMany({
    where: { phone: '9615554444' },
    select: { id: true }
  })
  for (const inv of testInvs) {
    await db.candidateInvitation.delete({ where: { id: inv.id } }).catch(() => {})
  }
  const testUsers = await db.user.findMany({
    where: { email: { contains: '9615554444' } },
    select: { id: true }
  })
  for (const u of testUsers) {
    await db.evaluationSession.deleteMany({ where: { candidateId: u.id } }).catch(() => {})
    await db.consentLog.deleteMany({ where: { userId: u.id } }).catch(() => {})
    await db.user.delete({ where: { id: u.id } }).catch(() => {})
  }
  console.log('Test data cleaned up')
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
