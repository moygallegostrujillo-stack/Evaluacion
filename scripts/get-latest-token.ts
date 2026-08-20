import { getUnscopedClient } from '../src/lib/rls'
async function main() {
  const db = getUnscopedClient()
  const inv = await db.candidateInvitation.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true, candidateName: true, phone: true, token: true, status: true, companyId: true, createdAt: true }
  })
  if (inv) {
    console.log('Latest invitation:')
    console.log('  Name:', inv.candidateName)
    console.log('  Phone:', inv.phone)
    console.log('  Status:', inv.status)
    console.log('  Token:', inv.token)
    console.log('  Token length:', inv.token.length)
    console.log('  Link: http://localhost:3000/?token=' + inv.token)
  } else {
    console.log('No invitations found')
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
