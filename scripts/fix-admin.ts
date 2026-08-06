import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const db = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  // Fix the admin role from ADMIN to SUPER_ADMIN
  const admin = await db.user.findUnique({ where: { email: 'admin@evaluhr.com' } })
  if (admin) {
    await db.user.update({
      where: { id: admin.id },
      data: { role: 'SUPER_ADMIN', password: hashPassword('admin123') },
    })
    console.log('✅ Admin role fixed to SUPER_ADMIN')
  } else {
    // Create if doesn't exist
    const company = await db.company.findFirst()
    if (!company) {
      console.error('❌ No company found')
      process.exit(1)
    }
    await db.user.create({
      data: {
        email: 'admin@evaluhr.com',
        name: 'Administrador EvaluHR',
        password: hashPassword('admin123'),
        role: 'SUPER_ADMIN',
        phone: '+52 961 000 0000',
        companyId: company.id,
        active: true,
      },
    })
    console.log('✅ Admin SUPER_ADMIN user created')
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
