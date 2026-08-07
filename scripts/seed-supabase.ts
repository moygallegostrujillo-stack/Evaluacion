import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function main() {
  console.log('🌱 Seeding Supabase database...')

  // Clean existing data (order matters for foreign keys)
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
  console.log('✅ Cleaned existing data')

  // ============================================
  // CREATE COMPANIES
  // ============================================
  const restaurantCompany = await db.company.create({
    data: {
      name: 'Café de Chiapas',
      sector: 'RESTAURANT',
      plan: 'PRO',
      phone: '+52 961 123 4567',
      address: 'Av. Central 456, Col. Centro',
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
      phone: '+52 961 987 6543',
      address: 'Plaza Crystal Local 12',
      city: 'Tuxtla Gutiérrez',
      state: 'Chiapas',
      country: 'México',
    },
  })
  console.log('✅ Companies created')

  // ============================================
  // CREATE POSITIONS
  // ============================================
  const meseroPos = await db.position.create({
    data: { title: 'Mesero', sector: 'RESTAURANT', category: 'MESERO', companyId: restaurantCompany.id },
  })
  const cocineroPos = await db.position.create({
    data: { title: 'Cocinero', sector: 'RESTAURANT', category: 'COCINERO', companyId: restaurantCompany.id },
  })
  const bartenderPos = await db.position.create({
    data: { title: 'Bartender', sector: 'RESTAURANT', category: 'BARTENDER', companyId: restaurantCompany.id },
  })
  const gerentePisoPos = await db.position.create({
    data: { title: 'Gerente de Piso', sector: 'RESTAURANT', category: 'GERENTE_PISO', companyId: restaurantCompany.id },
  })
  const vendedorPos = await db.position.create({
    data: { title: 'Vendedor', sector: 'RETAIL', category: 'VENDEDOR', companyId: retailCompany.id },
  })
  console.log('✅ Positions created')

  // ============================================
  // CREATE USERS
  // ============================================
  const adminUser = await db.user.create({
    data: {
      email: 'admin@evaluhr.com',
      name: 'Administrador EvaluHR',
      password: await hashPassword('admin123'),
      role: 'SUPER_ADMIN',
      phone: '+52 961 000 0000',
      companyId: null, // Tenant-free: SUPER_ADMIN has no company
    },
  })

  const rhUser = await db.user.create({
    data: {
      email: 'rh@cafedechiapas.com',
      name: 'Carolina Rivera',
      password: await hashPassword('rh1234'),
      role: 'RH',
      phone: '+52 961 111 2222',
      companyId: restaurantCompany.id,
    },
  })

  const gerenteUser = await db.user.create({
    data: {
      email: 'gerente@cafedechiapas.com',
      name: 'Roberto Mendoza',
      password: await hashPassword('gerente1234'),
      role: 'GERENTE',
      phone: '+52 961 333 4444',
      companyId: restaurantCompany.id,
    },
  })

  const rhRetail = await db.user.create({
    data: {
      email: 'rh@marlui.com',
      name: 'Ana López',
      password: await hashPassword('rh1234'),
      role: 'RH',
      phone: '+52 961 555 6666',
      companyId: retailCompany.id,
    },
  })

  // Candidates for restaurant
  const cand1 = await db.user.create({
    data: {
      email: 'juan.perez@email.com',
      name: 'Juan Pérez Hernández',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 234 5678',
      companyId: restaurantCompany.id,
    },
  })

  const cand2 = await db.user.create({
    data: {
      email: 'lucia.martinez@email.com',
      name: 'Lucía Martínez Torres',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 345 6789',
      companyId: restaurantCompany.id,
    },
  })

  const cand3 = await db.user.create({
    data: {
      email: 'pedro.sanchez@email.com',
      name: 'Pedro Sánchez Gómez',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 456 7890',
      companyId: restaurantCompany.id,
    },
  })

  const cand4 = await db.user.create({
    data: {
      email: 'maria.garcia@email.com',
      name: 'María García Ruiz',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 567 8901',
      companyId: restaurantCompany.id,
    },
  })

  const cand5 = await db.user.create({
    data: {
      email: 'carlos.lopez@email.com',
      name: 'Carlos López Díaz',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 678 9012',
      companyId: restaurantCompany.id,
    },
  })

  // Candidates for retail
  const cand6 = await db.user.create({
    data: {
      email: 'rosa.torres@email.com',
      name: 'Rosa Torres Vázquez',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 789 0123',
      companyId: retailCompany.id,
    },
  })

  const cand7 = await db.user.create({
    data: {
      email: 'miguel.hernandez@email.com',
      name: 'Miguel Hernández Flores',
      password: await hashPassword('candidato1234'),
      role: 'CANDIDATO',
      phone: '+52 961 890 1234',
      companyId: retailCompany.id,
    },
  })
  console.log('✅ Users created (1 admin + 3 staff + 7 candidates)')

  // ============================================
  // CREATE EVALUATION TEMPLATES + QUESTIONS
  // ============================================
  const psicometricaMesero = await db.evaluationTemplate.create({
    data: { name: 'Psicométrica Mesero', type: 'PSICOMETRICA', positionId: meseroPos.id, order: 1 },
  })

  const psicologicaMesero = await db.evaluationTemplate.create({
    data: { name: 'Psicológica Mesero', type: 'PSICOLOGICA', positionId: meseroPos.id, order: 2 },
  })

  const conocimientoMesero = await db.evaluationTemplate.create({
    data: { name: 'Conocimientos Mesero', type: 'CONOCIMIENTOS', positionId: meseroPos.id, order: 3 },
  })
  console.log('✅ Evaluation templates created')

  // Psicométrica questions (Big Five - 20 questions)
  const psicoQuestions = [
    { text: 'Disfruto conocer personas nuevas y participar en eventos sociales', category: 'EXTRAVERSION', order: 1 },
    { text: 'Soy una persona organizada que sigue sus planes al pie de la letra', category: 'CONSCIENTIOUSNESS', order: 2 },
    { text: 'Me preocupo por los sentimientos y bienestar de los demás', category: 'AGREEABLENESS', order: 3 },
    { text: 'Me estreso fácilmente cuando las cosas no salen como esperaba', category: 'NEUROTICISM', order: 4, reverseScored: true },
    { text: 'Siempre busco nuevas experiencias y formas de hacer las cosas', category: 'OPENNESS', order: 5 },
    { text: 'Prefiero trabajar en equipo que hacerlo solo', category: 'EXTRAVERSION', order: 6 },
    { text: 'Cumplo con mis responsabilidades sin que me lo recuerden', category: 'CONSCIENTIOUSNESS', order: 7 },
    { text: 'Evito conflictos y busco soluciones donde todos ganen', category: 'AGREEABLENESS', order: 8 },
    { text: 'Me mantengo calmado en situaciones de presión', category: 'NEUROTICISM', order: 9 },
    { text: 'Me adapto rápidamente a los cambios', category: 'OPENNESS', order: 10 },
    { text: 'Soy hablador y me gusta iniciar conversaciones', category: 'EXTRAVERSION', order: 11 },
    { text: 'Planifico mi trabajo con anticipación', category: 'CONSCIENTIOUSNESS', order: 12 },
    { text: 'Confío en las personas y doy segundas oportunidades', category: 'AGREEABLENESS', order: 13 },
    { text: 'Me siento seguro de mí mismo en la mayoría de situaciones', category: 'NEUROTICISM', order: 14, reverseScored: true },
    { text: 'Tengo curiosidad por aprender cosas nuevas', category: 'OPENNESS', order: 15 },
    { text: 'Me siento cómodo siendo el centro de atención', category: 'EXTRAVERSION', order: 16 },
    { text: 'Soy detallista y perfeccionista en mi trabajo', category: 'CONSCIENTIOUSNESS', order: 17 },
    { text: 'Ayudo a mis compañeros cuando lo necesitan', category: 'AGREEABLENESS', order: 18 },
    { text: 'Me recupero rápidamente de los contratiempos', category: 'NEUROTICISM', order: 19 },
    { text: 'Acepto críticas constructivas con facilidad', category: 'OPENNESS', order: 20 },
  ]

  for (const q of psicoQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicometricaMesero.id,
      },
    })
  }

  // Psicológica questions
  const psicoQuestions2 = [
    { text: 'Puedo manejar múltiples tareas al mismo tiempo sin perder el control', category: 'STRESS', order: 1 },
    { text: 'Entiendo cómo se sienten las personas incluso cuando no lo dicen', category: 'EMPATHY', order: 2 },
    { text: 'Me adapto a nuevos entornos de trabajo rápidamente', category: 'ADAPTABILITY', order: 3 },
    { text: 'Tomo la iniciativa cuando hay que resolver un problema', category: 'LEADERSHIP', order: 4 },
    { text: 'Colaboro bien con mi equipo para alcanzar objetivos comunes', category: 'TEAMWORK', order: 5 },
    { text: 'Trabajo bien bajo presión y deadlines ajustados', category: 'STRESS', order: 6 },
    { text: 'Puedo ver las cosas desde la perspectiva de otra persona', category: 'EMPATHY', order: 7 },
    { text: 'Me ajusto a cambios de última hora sin problema', category: 'ADAPTABILITY', order: 8 },
    { text: 'Motivo a otros para dar lo mejor de sí mismos', category: 'LEADERSHIP', order: 9 },
    { text: 'Comparto información y recursos con mi equipo', category: 'TEAMWORK', order: 10 },
    { text: 'Mantengo la calma en situaciones de crisis', category: 'STRESS', order: 11 },
    { text: 'Soy sensible a las necesidades de los clientes', category: 'EMPATHY', order: 12 },
    { text: 'Aprendo rápido de mis errores', category: 'ADAPTABILITY', order: 13 },
    { text: 'Puedo dirigir un grupo hacia una meta', category: 'LEADERSHIP', order: 14 },
    { text: 'Valoro las opiniones de mis compañeros', category: 'TEAMWORK', order: 15 },
  ]

  for (const q of psicoQuestions2) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: false,
        order: q.order,
        evaluationTemplateId: psicologicaMesero.id,
      },
    })
  }

  // Conocimiento questions
  const conocQuestions = [
    { text: '¿Cuál es la temperatura segura para almacenar carnes crudas?', category: 'KNOWLEDGE', order: 1, options: '["0-5°C","5-10°C","10-15°C","15-20°C"]', correctAnswer: 0 },
    { text: '¿Qué hacer primero al atender una mesa?', category: 'KNOWLEDGE', order: 2, options: '["Cobrar","Saludar y presentar el menú","Preguntar si ya terminaron","Traer la cuenta"]', correctAnswer: 1 },
    { text: '¿Cuántos cubiertos se usan en un servicio formal para el plato principal?', category: 'KNOWLEDGE', order: 3, options: '["1","2","3","4"]', correctAnswer: 2 },
    { text: '¿Qué significa "mise en place"?', category: 'KNOWLEDGE', order: 4, options: '["Servir la comida","Preparar y organizar todo antes del servicio","Limpiar la mesa","Cobrar al cliente"]', correctAnswer: 1 },
    { text: '¿Cuál es el orden correcto para servir los platos?', category: 'KNOWLEDGE', order: 5, options: '["Principal, entrada, postre","Postre, entrada, principal","Entrada, principal, postre","No hay orden"]', correctAnswer: 2 },
  ]

  for (const q of conocQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'MULTIPLE_CHOICE',
        category: q.category,
        options: q.options,
        correctAnswer: q.correctAnswer,
        order: q.order,
        evaluationTemplateId: conocimientoMesero.id,
      },
    })
  }
  console.log('✅ Questions created (20 + 15 + 5)')

  // ============================================
  // CREATE EVALUATION SESSIONS + RESULTS
  // ============================================
  const session1 = await db.evaluationSession.create({
    data: {
      candidateId: cand1.id,
      positionId: meseroPos.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 7 * 86400000),
      completedAt: new Date(Date.now() - 7 * 86400000 + 3600000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session1.id,
      candidateId: cand1.id,
      candidateName: 'Juan Pérez Hernández',
      positionId: meseroPos.id,
      positionTitle: 'Mesero',
      companyId: restaurantCompany.id,
      openness: 78, conscientiousness: 85, extraversion: 72, agreeableness: 80, neuroticism: 35,
      stressLevel: 42, empathy: 88, adaptability: 75, leadership: 60, teamwork: 82,
      knowledgeScore: 80, overallScore: 82, recommendation: 'APTO',
      summary: 'Candidato con excelente perfil para el puesto de mesero. Alta responsabilidad y trabajo en equipo.',
    },
  })

  const session2 = await db.evaluationSession.create({
    data: {
      candidateId: cand2.id,
      positionId: meseroPos.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 5 * 86400000),
      completedAt: new Date(Date.now() - 5 * 86400000 + 3600000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session2.id,
      candidateId: cand2.id,
      candidateName: 'Lucía Martínez Torres',
      positionId: meseroPos.id,
      positionTitle: 'Mesero',
      companyId: restaurantCompany.id,
      openness: 90, conscientiousness: 70, extraversion: 85, agreeableness: 75, neuroticism: 45,
      stressLevel: 55, empathy: 92, adaptability: 88, leadership: 65, teamwork: 78,
      knowledgeScore: 60, overallScore: 74, recommendation: 'ENTREVISTA_ADICIONAL',
      summary: 'Candidata con buena aptitud social pero necesita mejorar en conocimientos técnicos.',
    },
  })

  const session3 = await db.evaluationSession.create({
    data: {
      candidateId: cand3.id,
      positionId: cocineroPos.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 3 * 86400000),
      completedAt: new Date(Date.now() - 3 * 86400000 + 3600000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session3.id,
      candidateId: cand3.id,
      candidateName: 'Pedro Sánchez Gómez',
      positionId: cocineroPos.id,
      positionTitle: 'Cocinero',
      companyId: restaurantCompany.id,
      openness: 60, conscientiousness: 90, extraversion: 40, agreeableness: 70, neuroticism: 55,
      stressLevel: 68, empathy: 55, adaptability: 50, leadership: 35, teamwork: 62,
      knowledgeScore: 95, overallScore: 71, recommendation: 'ENTREVISTA_ADICIONAL',
      summary: 'Candidato con excelente conocimiento técnico pero baja adaptabilidad.',
    },
  })

  const session4 = await db.evaluationSession.create({
    data: {
      candidateId: cand4.id,
      positionId: meseroPos.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 2 * 86400000),
      completedAt: new Date(Date.now() - 2 * 86400000 + 3600000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session4.id,
      candidateId: cand4.id,
      candidateName: 'María García Ruiz',
      positionId: meseroPos.id,
      positionTitle: 'Mesero',
      companyId: restaurantCompany.id,
      openness: 82, conscientiousness: 88, extraversion: 78, agreeableness: 85, neuroticism: 25,
      stressLevel: 30, empathy: 90, adaptability: 82, leadership: 55, teamwork: 88,
      knowledgeScore: 85, overallScore: 87, recommendation: 'APTO',
      summary: 'Candidata excepcional. Alto rendimiento en todas las áreas.',
    },
  })

  const session5 = await db.evaluationSession.create({
    data: {
      candidateId: cand5.id,
      positionId: bartenderPos.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 1 * 86400000),
      completedAt: new Date(Date.now() - 1 * 86400000 + 3600000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session5.id,
      candidateId: cand5.id,
      candidateName: 'Carlos López Díaz',
      positionId: bartenderPos.id,
      positionTitle: 'Bartender',
      companyId: restaurantCompany.id,
      openness: 55, conscientiousness: 45, extraversion: 60, agreeableness: 50, neuroticism: 70,
      stressLevel: 75, empathy: 40, adaptability: 45, leadership: 30, teamwork: 48,
      knowledgeScore: 40, overallScore: 48, recommendation: 'NO_RECOMENDADO',
      summary: 'Candidato no cumple con el perfil requerido.',
    },
  })

  // Retail candidate result
  const session6 = await db.evaluationSession.create({
    data: {
      candidateId: cand6.id,
      positionId: vendedorPos.id,
      companyId: retailCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 4 * 86400000),
      completedAt: new Date(Date.now() - 4 * 86400000 + 3600000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session6.id,
      candidateId: cand6.id,
      candidateName: 'Rosa Torres Vázquez',
      positionId: vendedorPos.id,
      positionTitle: 'Vendedor',
      companyId: retailCompany.id,
      openness: 85, conscientiousness: 75, extraversion: 90, agreeableness: 80, neuroticism: 30,
      stressLevel: 35, empathy: 85, adaptability: 80, leadership: 70, teamwork: 78,
      overallScore: 80, recommendation: 'APTO',
      summary: 'Candidata con excelente perfil de ventas.',
    },
  })

  // One in progress
  await db.evaluationSession.create({
    data: {
      candidateId: cand7.id,
      positionId: vendedorPos.id,
      companyId: retailCompany.id,
      status: 'IN_PROGRESS',
      startedAt: new Date(Date.now() - 86400000),
    },
  })
  console.log('✅ Evaluation sessions and results created (6 completed + 1 in progress)')

  // ============================================
  // CREATE INTERVIEWS
  // ============================================
  await db.interviewSchedule.create({
    data: {
      candidateId: cand1.id,
      companyId: restaurantCompany.id,
      positionId: meseroPos.id,
      scheduledAt: new Date(Date.now() + 2 * 86400000),
      status: 'SCHEDULED',
      location: 'Sucursal Centro - Sala de Entrevistas',
      notes: 'Entrevista final con Gerente de Piso',
    },
  })

  await db.interviewSchedule.create({
    data: {
      candidateId: cand4.id,
      companyId: restaurantCompany.id,
      positionId: meseroPos.id,
      scheduledAt: new Date(Date.now() + 3 * 86400000),
      status: 'SCHEDULED',
      location: 'Sucursal Centro - Sala de Entrevistas',
      notes: 'Segunda entrevista - evaluación práctica',
    },
  })
  console.log('✅ Interview schedules created')

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Seed completed successfully!')
  console.log('===================================')
  console.log(`SUPER_ADMIN: ${adminUser.email} / admin123 (tenant-free)`)
  console.log(`Company: ${restaurantCompany.name} (${restaurantCompany.id})`)
  console.log(`Company: ${retailCompany.name} (${retailCompany.id})`)
  console.log(`RH User: ${rhUser.email} / rh1234`)
  console.log(`RH User: ${rhRetail.email} / rh1234`)
  console.log(`Gerente: ${gerenteUser.email} / gerente1234`)
  console.log('===================================')

  await db.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
