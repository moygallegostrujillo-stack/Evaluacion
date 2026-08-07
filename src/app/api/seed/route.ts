import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { hashPassword } from '@/lib/password'

const db = getUnscopedClient()

export async function GET(req: NextRequest) {
  // SECURITY: This endpoint requires a valid EVALUHR_SEED_RESET secret
  const resetSecret = process.env.EVALUHR_SEED_RESET
  const providedSecret = req.nextUrl.searchParams.get('secret')
  const mode = req.nextUrl.searchParams.get('mode')

  // Always require the secret in production
  if (process.env.NODE_ENV === 'production') {
    if (!resetSecret) {
      return NextResponse.json(
        { error: 'Reset endpoint not configured (missing EVALUHR_SEED_RESET env var)' },
        { status: 403 }
      )
    }
    if (providedSecret !== resetSecret) {
      return NextResponse.json(
        { error: 'Invalid reset secret' },
        { status: 403 }
      )
    }
  } else {
    // In development, require the secret if configured
    if (resetSecret && providedSecret !== resetSecret) {
      return NextResponse.json(
        { error: 'Invalid reset secret' },
        { status: 403 }
      )
    }
  }

  try {
    // ============================================
    // MODE: superadmin — Create ONLY a SUPER_ADMIN user
    // ============================================
    if (mode === 'superadmin') {
      // Clean ALL existing data (FK-safe order)
      console.log('Cleaning all data...')
      await db.vacancyApplicationResponse.deleteMany()
      await db.vacancyApplication.deleteMany()
      await db.vacancyQuestion.deleteMany()
      await db.vacancy.deleteMany()
      await db.evaluationResponse.deleteMany()
      await db.evaluationResult.deleteMany()
      await db.interviewSchedule.deleteMany()
      await db.evaluationSession.deleteMany()
      await db.candidateInvitation.deleteMany()
      await db.question.deleteMany()
      await db.evaluationTemplate.deleteMany()
      await db.position.deleteMany()
      await db.user.deleteMany()
      await db.company.deleteMany()
      console.log('All data deleted')

      // Create SUPER_ADMIN
      const hashedPassword = await hashPassword('admin123')
      const superAdmin = await db.user.create({
        data: {
          email: 'admin@evaluhr.com',
          name: 'Administrador',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          companyId: null,
          active: true,
          consentGiven: false,
        },
      })
      console.log('SUPER_ADMIN created:', superAdmin.email)

      return NextResponse.json({
        success: true,
        mode: 'superadmin',
        message: 'Database reset. Only SUPER_ADMIN user exists.',
        credentials: {
          email: 'admin@evaluhr.com',
          password: 'admin123',
          role: 'SUPER_ADMIN',
        },
        user: {
          id: superAdmin.id,
          email: superAdmin.email,
          name: superAdmin.name,
          role: superAdmin.role,
        },
      })
    }

    // ============================================
    // MODE: full (original seed — dev only)
    // ============================================
    if (mode === 'full') {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Full seed is disabled in production. Use mode=superadmin instead.' },
          { status: 403 }
        )
      }

      // Clean existing data
      await db.vacancyApplicationResponse.deleteMany()
      await db.vacancyApplication.deleteMany()
      await db.vacancyQuestion.deleteMany()
      await db.vacancy.deleteMany()
      await db.evaluationResponse.deleteMany()
      await db.evaluationResult.deleteMany()
      await db.interviewSchedule.deleteMany()
      await db.evaluationSession.deleteMany()
      await db.candidateInvitation.deleteMany()
      await db.question.deleteMany()
      await db.evaluationTemplate.deleteMany()
      await db.position.deleteMany()
      await db.user.deleteMany()
      await db.company.deleteMany()

      // CREATE COMPANIES
      const restaurantCompany = await db.company.create({
        data: {
          name: 'Café de Chiapas',
          sector: 'RESTAURANT',
          plan: 'PRO',
          maxCandidatesPerMonth: 200,
          phone: '+52 961 123 4567',
          address: 'Av. Central Oriente #456',
          city: 'Tuxtla Gutiérrez',
          state: 'Chiapas',
          country: 'México',
        },
      })

      const retailCompany = await db.company.create({
        data: {
          name: 'Marlui',
          sector: 'RETAIL',
          plan: 'BASIC',
          maxCandidatesPerMonth: 100,
          phone: '+52 961 765 4321',
          address: 'Blvd. Belisario Domínguez #789',
          city: 'Tuxtla Gutiérrez',
          state: 'Chiapas',
          country: 'México',
        },
      })

      // CREATE USERS
      const superAdminPassword = await hashPassword('admin123')
      await db.user.create({
        data: {
          email: 'admin@evaluhr.com',
          name: 'Administrador',
          password: superAdminPassword,
          role: 'SUPER_ADMIN',
          active: true,
        },
      })

      const rhPassword = await hashPassword('rh123')
      await db.user.create({
        data: {
          email: 'rh@cafedechiapas.com',
          name: 'Ana Martínez',
          password: rhPassword,
          role: 'RH',
          companyId: restaurantCompany.id,
          active: true,
        },
      })

      const rh2Password = await hashPassword('rh123')
      await db.user.create({
        data: {
          email: 'rh@marlui.com',
          name: 'Roberto Sánchez',
          password: rh2Password,
          role: 'RH',
          companyId: retailCompany.id,
          active: true,
        },
      })

      return NextResponse.json({
        success: true,
        mode: 'full',
        message: 'Full seed completed with demo data',
      })
    }

    // No mode specified
    return NextResponse.json({
      error: 'Missing mode parameter. Use ?mode=superadmin or ?mode=full',
      availableModes: {
        superadmin: 'Reset DB with only SUPER_ADMIN user (works in production with secret)',
        full: 'Full demo data seed (dev only)',
      },
    }, { status: 400 })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: String(error) },
      { status: 500 }
    )
  }
}
