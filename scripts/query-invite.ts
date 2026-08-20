import { db } from '../src/lib/db'
async function main() {
  const invs = await db.candidateInvitation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, candidateName: true, phone: true, status: true, token: true, companyId: true, positionId: true, createdAt: true }
  })
  console.log('--- INVITATIONS ---')
  for (const i of invs) {
    console.log(JSON.stringify({ id: i.id, name: i.candidateName, phone: i.phone, status: i.status, tokenLen: i.token.length, companyId: i.companyId, positionId: i.positionId, created: i.createdAt }))
  }
  const users = await db.user.findMany({ where: { role: 'CANDIDATO' }, select: { id: true, email: true, name: true, phone: true, companyId: true, consentGiven: true, consentOption: true } })
  console.log('--- CANDIDATE USERS ---')
  for (const u of users) console.log(JSON.stringify(u))
  const positions = await db.position.findMany({ select: { id: true, title: true, companyId: true } })
  console.log('--- POSITIONS ---')
  for (const p of positions) console.log(JSON.stringify(p))
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
