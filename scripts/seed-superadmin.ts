import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function main() {
  console.log('🌱 Seeding fresh SUPER_ADMIN user...')

  // ============================================
  // DELETE ALL EXISTING DATA (order respects foreign keys)
  // ============================================
  console.log('🗑️  Cleaning all existing data...')

  // Leaf tables first (no dependents)
  await db.vacancyApplicationResponse.deleteMany()
  await db.evaluationResponse.deleteMany()

  // Vacancy-related
  await db.vacancyApplication.deleteMany()
  await db.vacancyQuestion.deleteMany()
  await db.vacancy.deleteMany()

  // Evaluation-related
  await db.evaluationResult.deleteMany()
  await db.evaluationSession.deleteMany()

  // Interview & invitation
  await db.interviewSchedule.deleteMany()
  await db.candidateInvitation.deleteMany()

  // Template & questions
  await db.question.deleteMany()
  await db.evaluationTemplate.deleteMany()

  // Position
  await db.position.deleteMany()

  // Users (all roles)
  await db.user.deleteMany()

  // Companies
  await db.company.deleteMany()

  console.log('✅ All existing data deleted')

  // ============================================
  // CREATE SUPER_ADMIN USER (no company — tenant-free)
  // ============================================
  const admin = await db.user.create({
    data: {
      email: 'admin@evaluhr.com',
      name: 'Administrador',
      password: await hashPassword('admin123'),
      role: 'SUPER_ADMIN',
      companyId: null,
      active: true,
    },
  })

  console.log('✅ SUPER_ADMIN user created')

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Seed completed successfully!')
  console.log('===================================')
  console.log('  SUPER_ADMIN Credentials:')
  console.log(`  Email:    ${admin.email}`)
  console.log('  Password: admin123')
  console.log(`  Role:     ${admin.role}`)
  console.log('  Company:  None (tenant-free)')
  console.log('===================================')
  console.log('\n👉 Log in and create companies through the UI.')

  await db.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
