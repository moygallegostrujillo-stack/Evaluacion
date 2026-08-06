import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const db = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  // Get the first company to assign the admin
  const company = await db.company.findFirst()
  if (!company) {
    console.error('❌ No company found in database')
    process.exit(1)
  }

  // Check if admin already exists
  const existing = await db.user.findUnique({ where: { email: 'admin@evaluhr.com' } })
  if (existing) {
    console.log('Admin user already exists, updating password...')
    await db.user.update({
      where: { id: existing.id },
      data: { 
        password: hashPassword('admin123'),
        role: 'ADMIN',
        active: true,
        companyId: company.id 
      },
    })
  } else {
    // Create admin user
    await db.user.create({
      data: {
        email: 'admin@evaluhr.com',
        name: 'Administrador EvaluHR',
        password: hashPassword('admin123'),
        role: 'ADMIN',
        phone: '+52 961 000 0000',
        companyId: company.id,
        active: true,
      },
    })
    console.log('✅ Admin user created')
  }

  // Also fix the passwords for existing users to match the login UI
  const userUpdates = [
    { email: 'rh@cafedechiapas.com', password: 'rh1234' },
    { email: 'gerente@cafedechiapas.com', password: 'gerente1234' },
    { email: 'rh@marlui.com', password: 'rh1234' },
    { email: 'juan.perez@email.com', password: 'candidato1234' },
  ]

  for (const update of userUpdates) {
    const user = await db.user.findUnique({ where: { email: update.email } })
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: { password: hashPassword(update.password) },
      })
      console.log(`✅ Updated password for ${update.email}`)
    } else {
      console.log(`⚠️ User ${update.email} not found`)
    }
  }

  console.log('✅ All done!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
