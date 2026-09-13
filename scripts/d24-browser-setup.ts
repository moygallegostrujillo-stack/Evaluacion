/**
 * D.2.4 — Browser verification fixture: synthetic tenant + RH user + vacancy
 * with question + application + interview. Cleanup: --cleanup
 */
import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

const SUFFIX = 'brtest24'
const EMAIL = `d24-${SUFFIX}-rh@test.local`

async function cleanup() {
  const user = await db.user.findUnique({ where: { email: EMAIL } })
  if (user?.companyId) {
    const cId = user.companyId
    const users = await db.user.findMany({ where: { companyId: cId }, select: { id: true } })
    const userIds = users.map(u => u.id)
    if (userIds.length) {
      await db.interviewSchedule.deleteMany({ where: { candidateId: { in: userIds } } })
      await db.user.deleteMany({ where: { id: { in: userIds }, role: 'CANDIDATO' } })
    }
    await db.vacancyApplicationResponse.deleteMany({ where: { application: { companyId: cId } } })
    await db.vacancyApplication.deleteMany({ where: { companyId: cId } })
    const vacancies = await db.vacancy.findMany({ where: { companyId: cId }, select: { id: true } })
    for (const v of vacancies) {
      await db.vacancyQuestion.deleteMany({ where: { vacancyId: v.id } })
      await db.vacancy.delete({ where: { id: v.id } })
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
const company = await db.company.create({ data: { name: `D24-BROWSER-${SUFFIX}`, sector: 'RESTAURANT' } })
const pwd = await hashPassword('brtest123')
const rh = await db.user.create({
  data: { email: EMAIL, name: 'RH Browser D24', password: pwd, role: 'RH', companyId: company.id },
})
const cand = await db.user.create({
  data: {
    email: `d24-${SUFFIX}-cand@test.local`, name: 'Candidato Browser D24', password: pwd, role: 'CANDIDATO',
    companyId: company.id, consentGiven: true, consentDate: new Date(), consentOption: 'FULL',
    consentConfirmed: true, consentVersion: '2026-02-v1',
  },
})
const position = await db.position.create({
  data: { title: 'Mesero Browser D24', sector: 'RESTAURANT', category: 'MESERO', companyId: company.id },
})
const vacancy = await db.vacancy.create({
  data: { title: 'Vacante Browser D24', slug: `d24-brtest24-vacante-browser`, sector: 'RESTAURANT', companyId: company.id },
})
await db.vacancyQuestion.create({
  data: { text: 'Pregunta browser D24', type: 'MULTIPLE_CHOICE', options: '["a","b"]', correctAnswer: 0, order: 1, vacancyId: vacancy.id, companyId: company.id },
})
await db.vacancyApplication.create({
  data: { vacancyId: vacancy.id, companyId: company.id, candidateName: 'App Browser D24', candidateEmail: 'appbr24@test.local', candidateUserId: cand.id },
})
await db.interviewSchedule.create({
  data: { candidateId: cand.id, companyId: company.id, positionId: position.id, scheduledAt: new Date(Date.now() + 864e5), status: 'SCHEDULED' },
})
console.log('fixture created:', EMAIL, '/ vacancy:', vacancy.id)
process.exit(0)
