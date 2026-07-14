import { db } from '@/lib/db'
import * as crypto from 'crypto'

function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = hash('sha256', data) as unknown as Buffer
  return hashBuffer.toString('hex') || Buffer.from(data).toString('base64')
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
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

  // ============================================
  // CREATE USERS
  // ============================================
  const simpleHash = (pw: string) => {
    return crypto.createHash('sha256').update(pw).digest('hex')
  }

  const superAdmin = await db.user.create({
    data: {
      email: 'admin@evaluhr.com',
      name: 'Administrador del Sistema',
      password: simpleHash('admin123'),
      role: 'SUPER_ADMIN',
      active: true,
    },
  })

  const rhRestaurant = await db.user.create({
    data: {
      email: 'rh@cafedechiapas.com',
      name: 'María García López',
      password: simpleHash('rh1234'),
      role: 'RH',
      companyId: restaurantCompany.id,
      active: true,
    },
  })

  const gerenteRestaurant = await db.user.create({
    data: {
      email: 'gerente@cafedechiapas.com',
      name: 'Carlos Méndez Ruiz',
      password: simpleHash('gerente1234'),
      role: 'GERENTE',
      companyId: restaurantCompany.id,
      active: true,
    },
  })

  const rhRetail = await db.user.create({
    data: {
      email: 'rh@marlui.com',
      name: 'Ana López Díaz',
      password: simpleHash('rh1234'),
      role: 'RH',
      companyId: retailCompany.id,
      active: true,
    },
  })

  // Demo candidates
  const candidate1 = await db.user.create({
    data: {
      email: 'juan.perez@email.com',
      name: 'Juan Pérez Hernández',
      password: simpleHash('candidato1234'),
      role: 'CANDIDATO',
      companyId: restaurantCompany.id,
      consentGiven: true,
      consentDate: new Date(),
      active: true,
    },
  })

  const candidate2 = await db.user.create({
    data: {
      email: 'lucia.martinez@email.com',
      name: 'Lucía Martínez Torres',
      password: simpleHash('candidato1234'),
      role: 'CANDIDATO',
      companyId: restaurantCompany.id,
      consentGiven: true,
      consentDate: new Date(),
      active: true,
    },
  })

  const candidate3 = await db.user.create({
    data: {
      email: 'pedro.sanchez@email.com',
      name: 'Pedro Sánchez Gómez',
      password: simpleHash('candidato1234'),
      role: 'CANDIDATO',
      companyId: retailCompany.id,
      consentGiven: true,
      consentDate: new Date(),
      active: true,
    },
  })

  // ============================================
  // CREATE POSITIONS
  // ============================================
  // Restaurant positions
  const mesero = await db.position.create({
    data: {
      title: 'Mesero/a',
      sector: 'RESTAURANT',
      category: 'MESERO',
      description: 'Atención a comensales, toma de pedidos, servicio de mesa',
      hasKnowledgeTest: true,
      companyId: restaurantCompany.id,
    },
  })

  const cocinero = await db.position.create({
    data: {
      title: 'Cocinero/a',
      sector: 'RESTAURANT',
      category: 'COCINERO',
      description: 'Preparación de alimentos, cocina, manejo de ingredientes',
      hasKnowledgeTest: true,
      companyId: restaurantCompany.id,
    },
  })

  const bartender = await db.position.create({
    data: {
      title: 'Bartender',
      sector: 'RESTAURANT',
      category: 'BARTENDER',
      description: 'Preparación de bebidas y cocteles, atención en barra',
      hasKnowledgeTest: true,
      companyId: restaurantCompany.id,
    },
  })

  const gerentePiso = await db.position.create({
    data: {
      title: 'Gerente de Piso',
      sector: 'RESTAURANT',
      category: 'GERENTE_PISO',
      description: 'Supervisión del servicio en salón, gestión de personal de sala',
      hasKnowledgeTest: true,
      companyId: restaurantCompany.id,
    },
  })

  // Retail positions
  const vendedor = await db.position.create({
    data: {
      title: 'Vendedor/a',
      sector: 'RETAIL',
      category: 'VENDEDOR',
      description: 'Atención al cliente, venta de productos, asesoría de moda',
      hasKnowledgeTest: true,
      companyId: retailCompany.id,
    },
  })

  // ============================================
  // CREATE EVALUATION TEMPLATES & QUESTIONS
  // ============================================

  // --- PSICOMÉTRICA (Big Five) - MESERO ---
  const psicoMesero = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicométrica - Mesero',
      type: 'PSICOMETRICA',
      description: 'Test Big Five de personalidad para puesto de Mesero',
      order: 1,
      positionId: mesero.id,
    },
  })

  const bigFiveQuestions = [
    { text: 'Disfruto probar nuevas formas de hacer las cosas en el trabajo', category: 'OPENNESS', order: 1 },
    { text: 'Me considero una persona creativa e imaginativa', category: 'OPENNESS', order: 2 },
    { text: 'Siempre organizo mis tareas antes de empezar a trabajar', category: 'CONSCIENTIOUSNESS', order: 3 },
    { text: 'Cuando me propongo algo, lo completo sin importar los obstáculos', category: 'CONSCIENTIOUSNESS', order: 4 },
    { text: 'Me siento cómodo/a iniciando conversaciones con personas que no conozco', category: 'EXTRAVERSION', order: 5 },
    { text: 'Disfruto trabajar en equipo más que de forma individual', category: 'EXTRAVERSION', order: 6 },
    { text: 'Me preocupa que mis compañeros de trabajo se sientan bien', category: 'AGREEABLENESS', order: 7 },
    { text: 'Prefiero llegar a un acuerdo que ganar una discusión', category: 'AGREEABLENESS', order: 8 },
    { text: 'Me estreso fácilmente cuando tengo mucho trabajo por hacer', category: 'NEUROTICISM', order: 9, reverseScored: true },
    { text: 'Me cuesta controlar mis emociones cuando algo sale mal', category: 'NEUROTICISM', order: 10, reverseScored: true },
  ]

  for (const q of bigFiveQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicoMesero.id,
      },
    })
  }

  // --- PSICOLÓGICA - MESERO ---
  const psicologicaMesero = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicológica - Mesero',
      type: 'PSICOLOGICA',
      description: 'Evaluación de competencias psicológicas para Mesero',
      order: 2,
      positionId: mesero.id,
    },
  })

  const psicologicaQuestions = [
    { text: 'Me siento abrumado/a cuando tengo múltiples tareas pendientes', category: 'STRESS', order: 1, reverseScored: true },
    { text: 'Me cuesta desconectar del trabajo después de mi jornada', category: 'STRESS', order: 2, reverseScored: true },
    { text: 'Puedo entender cómo se sienten mis compañeros aunque no lo digan', category: 'EMPATHY', order: 3 },
    { text: 'Me resulta fácil ponerme en el lugar del cliente cuando tiene un problema', category: 'EMPATHY', order: 4 },
    { text: 'Me adapto rápidamente a cambios en mi rutina de trabajo', category: 'ADAPTABILITY', order: 5 },
    { text: 'Cuando cambian las reglas o procedimientos, me ajusto sin problema', category: 'ADAPTABILITY', order: 6 },
    { text: 'Cuando hay un problema, suelo tomar la iniciativa para resolverlo', category: 'LEADERSHIP', order: 7 },
    { text: 'Mis compañeros me piden ayuda para organizar el trabajo', category: 'LEADERSHIP', order: 8 },
    { text: 'Prefiero colaborar con otros para alcanzar una meta que hacerlo solo/a', category: 'TEAMWORK', order: 9 },
    { text: 'Escucho y respeto las opiniones de mis compañeros aunque no esté de acuerdo', category: 'TEAMWORK', order: 10 },
  ]

  for (const q of psicologicaQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicologicaMesero.id,
      },
    })
  }

  // --- CONOCIMIENTOS - MESERO ---
  const conocimientosMesero = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación de Conocimientos - Mesero',
      type: 'CONOCIMIENTOS',
      description: 'Conocimientos técnicos para puesto de Mesero',
      order: 3,
      positionId: mesero.id,
    },
  })

  const knowledgeMeseroQuestions = [
    {
      text: '¿Cuál es la temperatura adecuada para servir vino tinto?',
      options: JSON.stringify(['4-6°C', '14-18°C', '20-24°C', '8-10°C']),
      category: 'KNOWLEDGE',
      order: 1,
      correctAnswer: 1, // index 1 = 14-18°C
    },
    {
      text: '¿Qué debe hacer un mesero antes de entregar la cuenta al cliente?',
      options: JSON.stringify(['Verificar que todo esté correcto', 'Preguntar si quiere postre', 'Recoger los platos', 'Traer más agua']),
      category: 'KNOWLEDGE',
      order: 2,
      correctAnswer: 0,
    },
    {
      text: 'Si un cliente reclama que su comida está fría, ¿qué debe hacer primero?',
      options: JSON.stringify(['Discutir con el cliente', 'Ofrecerse a calentarla o cambiarla', 'Ignorar el reclamo', 'Culpar a la cocina']),
      category: 'KNOWLEDGE',
      order: 3,
      correctAnswer: 1,
    },
    {
      text: '¿Cuál es el orden correcto para servir los platillos?',
      options: JSON.stringify(['Postre, plato fuerte, entrada', 'Entrada, plato fuerte, postre', 'Platos simultáneos', 'Solo plato fuerte']),
      category: 'KNOWLEDGE',
      order: 4,
      correctAnswer: 1,
    },
    {
      text: '¿Qué significa "mise en place"?',
      options: JSON.stringify(['Limpiar las mesas', 'Preparar y organizar todo antes del servicio', 'Decorar el restaurante', 'Cocinar los platillos']),
      category: 'KNOWLEDGE',
      order: 5,
      correctAnswer: 1,
    },
    {
      text: '¿Cómo debe llevar los platos un mesero al salir de la cocina?',
      options: JSON.stringify(['En las manos', 'En charola siempre', 'Como sea más rápido', 'Solo los más pesados en charola']),
      category: 'KNOWLEDGE',
      order: 6,
      correctAnswer: 1,
    },
    {
      text: '¿Qué es el "upselling" en un restaurante?',
      options: JSON.stringify(['Vender platos más baratos', 'Sugerir platillos adicionales o de mayor valor', 'Regalar postres', 'Dar descuentos sin autorización']),
      category: 'KNOWLEDGE',
      order: 7,
      correctAnswer: 1,
    },
    {
      text: '¿Cuándo debe un mesero acercarse a una mesa por primera vez?',
      options: JSON.stringify(['Inmediatamente al sentarse', 'Después de 5 minutos', 'Cuando el cliente levante la mano', 'Después de entregar el menú y dar un momento']),
      category: 'KNOWLEDGE',
      order: 8,
      correctAnswer: 3,
    },
    {
      text: '¿Qué debe hacer si un cliente tiene una alergia alimentaria?',
      options: JSON.stringify(['Ignorar la solicitud', 'Informar inmediatamente a cocina y verificar ingredientes', 'Sugerir otro platillo sin verificar', 'Decir que no hay problema']),
      category: 'KNOWLEDGE',
      order: 9,
      correctAnswer: 1,
    },
    {
      text: '¿Cuál es la regla general para servir bebidas?',
      options: JSON.stringify(['Servir por la derecha', 'Servir por la izquierda', 'Servir por donde sea más accesible', 'Dejar que el cliente se sirva solo']),
      category: 'KNOWLEDGE',
      order: 10,
      correctAnswer: 0,
    },
  ]

  for (const q of knowledgeMeseroQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'MULTIPLE_CHOICE',
        options: q.options,
        category: q.category,
        order: q.order,
        evaluationTemplateId: conocimientosMesero.id,
      },
    })
  }

  // --- PSICOMÉTRICA - COCINERO ---
  const psicoCocinero = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicométrica - Cocinero',
      type: 'PSICOMETRICA',
      description: 'Test Big Five de personalidad para puesto de Cocinero',
      order: 1,
      positionId: cocinero.id,
    },
  })

  for (const q of bigFiveQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicoCocinero.id,
      },
    })
  }

  // --- PSICOLÓGICA - COCINERO ---
  const psicologicaCocinero = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicológica - Cocinero',
      type: 'PSICOLOGICA',
      description: 'Evaluación de competencias psicológicas para Cocinero',
      order: 2,
      positionId: cocinero.id,
    },
  })

  for (const q of psicologicaQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicologicaCocinero.id,
      },
    })
  }

  // --- CONOCIMIENTOS - COCINERO ---
  const conocimientosCocinero = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación de Conocimientos - Cocinero',
      type: 'CONOCIMIENTOS',
      description: 'Conocimientos técnicos para puesto de Cocinero',
      order: 3,
      positionId: cocinero.id,
    },
  })

  const knowledgeCocineroQuestions = [
    {
      text: '¿Cuál es la temperatura interna mínima segura para el pollo cocido?',
      options: JSON.stringify(['55°C', '63°C', '74°C', '85°C']),
      order: 1,
    },
    {
      text: '¿Qué es la contaminación cruzada?',
      options: JSON.stringify(['Cuando los alimentos se queman', 'Transferencia de bacterias de un alimento a otro', 'Cuando la comida se enfría', 'Mezclar sabores']),
      order: 2,
    },
    {
      text: '¿Qué es una "brunoise"?',
      options: JSON.stringify(['Un tipo de salsa', 'Un corte en cubos pequeños', 'Una técnica de cocción', 'Un tipo de carne']),
      order: 3,
    },
    {
      text: '¿Cuál es el orden correcto de almacenamiento en el refrigerador?',
      options: JSON.stringify(['Pollo arriba, vegetales abajo', 'Vegetales arriba, pollo abajo', 'Todo en el mismo estante', 'No importa el orden']),
      order: 4,
    },
    {
      text: '¿Qué hacer si un alimento se cae al suelo?',
      options: JSON.stringify(['Levantarlo rápidamente y usarlo', 'Desecharlo', 'Enjuagarlo', 'Depende del alimento']),
      order: 5,
    },
    {
      text: '¿Qué es la "mise en place" en cocina?',
      options: JSON.stringify(['Limpiar la cocina', 'Tener todo preparado y organizado antes de cocinar', 'Cocinar a fuego alto', 'Servir los platillos']),
      order: 6,
    },
    {
      text: '¿Cuánto tiempo máximo puede estar un alimento fuera de refrigeración?',
      options: JSON.stringify(['1 hora', '2 horas', '4 horas', 'No hay límite']),
      order: 7,
    },
    {
      text: '¿Qué es una "reducción" en cocina?',
      options: JSON.stringify(['Quitar ingredientes', 'Cocinar un líquido hasta evaporar parte y concentrar sabor', 'Bajar la temperatura', 'Cortar en trozos pequeños']),
      order: 8,
    },
    {
      text: '¿Cuándo debe lavarse las manos en la cocina?',
      options: JSON.stringify(['Solo al inicio del turno', 'Antes de cocinar y después de manipular alimentos crudos', 'Una vez por hora', 'Solo si se ven sucias']),
      order: 9,
    },
    {
      text: '¿Qué color de tabla se usa típicamente para pollo?',
      options: JSON.stringify(['Verde', 'Roja', 'Azul', 'Blanca']),
      order: 10,
    },
  ]

  for (const q of knowledgeCocineroQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'MULTIPLE_CHOICE',
        options: q.options,
        category: 'KNOWLEDGE',
        order: q.order,
        evaluationTemplateId: conocimientosCocinero.id,
      },
    })
  }

  // --- PSICOMÉTRICA - BARTENDER ---
  const psicoBartender = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicométrica - Bartender',
      type: 'PSICOMETRICA',
      description: 'Test Big Five de personalidad para puesto de Bartender',
      order: 1,
      positionId: bartender.id,
    },
  })

  for (const q of bigFiveQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicoBartender.id,
      },
    })
  }

  // --- PSICOLÓGICA - BARTENDER ---
  const psicologicaBartender = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicológica - Bartender',
      type: 'PSICOLOGICA',
      description: 'Evaluación de competencias psicológicas para Bartender',
      order: 2,
      positionId: bartender.id,
    },
  })

  for (const q of psicologicaQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicologicaBartender.id,
      },
    })
  }

  // --- CONOCIMIENTOS - BARTENDER ---
  const conocimientosBartender = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación de Conocimientos - Bartender',
      type: 'CONOCIMIENTOS',
      description: 'Conocimientos técnicos para puesto de Bartender',
      order: 3,
      positionId: bartender.id,
    },
  })

  const knowledgeBartenderQuestions = [
    {
      text: '¿Qué es un "muddled" en coctelería?',
      options: JSON.stringify(['Mezclar con hielo', 'Machacar ingredientes para liberar sabores', 'Filtrar una bebida', 'Agitar en coctelera']),
      order: 1,
    },
    {
      text: '¿Cuánto tequila lleva un Margarita clásico?',
      options: JSON.stringify(['30 ml', '45 ml', '60 ml', '90 ml']),
      order: 2,
    },
    {
      text: '¿Qué es el "layering" en bebidas?',
      options: JSON.stringify(['Agitar vigorosamente', 'Crear capas de líquidos con diferentes densidades', 'Añadir hielo', 'Decorar con fruta']),
      order: 3,
    },
    {
      text: '¿Cuál es la diferencia entre mezcal y tequila?',
      options: JSON.stringify(['No hay diferencia', 'El tequila es solo de Jalisco y el mezcal de varias regiones', 'El mezcal es más barato', 'El tequila es más fuerte']),
      order: 4,
    },
    {
      text: '¿Qué hacer si un cliente está visiblemente intoxicado?',
      options: JSON.stringify(['Seguir sirviendo', 'Negarse cortésmente a servir más y ofrecer agua', 'Ignorarlo', 'Llamar a la policía inmediatamente']),
      order: 5,
    },
    {
      text: '¿Qué tipo de vaso se usa para un Old Fashioned?',
      options: JSON.stringify(['Copa flauta', 'Vaso corto/rocks', 'Copa margarita', 'Vaso alto']),
      order: 6,
    },
    {
      text: '¿Qué significa "on the rocks"?',
      options: JSON.stringify(['Sin hielo', 'Con hielo', 'Con limón', 'Doble porción']),
      order: 7,
    },
    {
      text: '¿Cuál es el licor base de un Mojito?',
      options: JSON.stringify(['Vodka', 'Ron', 'Gin', 'Tequila']),
      order: 8,
    },
    {
      text: '¿Qué es un "dash" en coctelería?',
      options: JSON.stringify(['Una medida grande', 'Una pequeña cantidad (3-5 gotas)', 'Un tipo de vaso', 'Una técnica de mezclado']),
      order: 9,
    },
    {
      text: '¿Cómo se sirve una cerveza correctamente?',
      options: JSON.stringify(['Directa y rápida', 'Inclinando el vaso y gradualmente enderezándolo', 'Dejándola caer desde lo alto', 'Sin espuma']),
      order: 10,
    },
  ]

  for (const q of knowledgeBartenderQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'MULTIPLE_CHOICE',
        options: q.options,
        category: 'KNOWLEDGE',
        order: q.order,
        evaluationTemplateId: conocimientosBartender.id,
      },
    })
  }

  // --- PSICOMÉTRICA - GERENTE DE PISO ---
  const psicoGerentePiso = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicométrica - Gerente de Piso',
      type: 'PSICOMETRICA',
      description: 'Test Big Five de personalidad para Gerente de Piso',
      order: 1,
      positionId: gerentePiso.id,
    },
  })

  for (const q of bigFiveQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicoGerentePiso.id,
      },
    })
  }

  // --- PSICOLÓGICA - GERENTE DE PISO ---
  const psicologicaGerentePiso = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicológica - Gerente de Piso',
      type: 'PSICOLOGICA',
      description: 'Evaluación de competencias psicológicas para Gerente de Piso',
      order: 2,
      positionId: gerentePiso.id,
    },
  })

  for (const q of psicologicaQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicologicaGerentePiso.id,
      },
    })
  }

  // --- CONOCIMIENTOS - GERENTE DE PISO ---
  const conocimientosGerentePiso = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación de Conocimientos - Gerente de Piso',
      type: 'CONOCIMIENTOS',
      description: 'Conocimientos de gestión para Gerente de Piso',
      order: 3,
      positionId: gerentePiso.id,
    },
  })

  const knowledgeGerentePisoQuestions = [
    {
      text: '¿Cuál es la métrica más importante para medir la eficiencia de un restaurante?',
      options: JSON.stringify(['Número de empleados', 'Rotación de mesas', 'Tamaño del menú', 'Cantidad de proveedores']),
      order: 1,
    },
    {
      text: 'Si un mesero reporta que un cliente está insatisfecho, ¿qué es lo primero que debe hacer?',
      options: JSON.stringify(['Ignorar el reporte', 'Acercarse a la mesa y escuchar al cliente', 'Dar un descuento automático', 'Cambiar de mesero']),
      order: 2,
    },
    {
      text: '¿Qué es el "ticket promedio"?',
      options: JSON.stringify(['El precio del menú', 'El gasto promedio por cliente', 'El salario de los meseros', 'El costo de los ingredientes']),
      order: 3,
    },
    {
      text: '¿Cómo debe manejar un conflicto entre dos empleados?',
      options: JSON.stringify(['Despedir a ambos', 'Escuchar ambas partes y buscar solución', 'Ignorar el conflicto', 'Elegir un lado']),
      order: 4,
    },
    {
      text: '¿Qué indica un alto índice de rotación de personal?',
      options: JSON.stringify(['Buen ambiente laboral', 'Problemas en la gestión o condiciones laborales', 'Éxito del negocio', 'No es relevante']),
      order: 5,
    },
    {
      text: '¿Qué es la "captación" de clientes en un restaurante?',
      options: JSON.stringify(['Cobrar más caro', 'Atraer nuevos clientes al establecimiento', 'Retener a los mismos clientes', 'Reducir el menú']),
      order: 6,
    },
    {
      text: '¿Cuál es la mejor forma de motivar al personal de sala?',
      options: JSON.stringify(['Amenazar con despido', 'Reconocimiento y capacitación constante', 'Solo incrementar salario', 'Ignorar sus necesidades']),
      order: 7,
    },
    {
      text: '¿Qué debe hacer al inicio de cada turno?',
      options: JSON.stringify(['Esperar a que lleguen los clientes', 'Verificar reservaciones, personal y estado del salón', 'Solo revisar la caja', 'Nada en particular']),
      order: 8,
    },
    {
      text: '¿Cómo se calcula la productividad de un mesero?',
      options: JSON.stringify(['Por su puntualidad', 'Ventas generadas y número de mesas atendidas', 'Por su antigüedad', 'Por su carisma']),
      order: 9,
    },
    {
      text: '¿Qué es el "SOP" en gestión de restaurantes?',
      options: JSON.stringify(['Un tipo de comida', 'Standard Operating Procedure (Procedimiento Operativo Estándar)', 'Un sistema de pagos', 'Un proveedor']),
      order: 10,
    },
  ]

  for (const q of knowledgeGerentePisoQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'MULTIPLE_CHOICE',
        options: q.options,
        category: 'KNOWLEDGE',
        order: q.order,
        evaluationTemplateId: conocimientosGerentePiso.id,
      },
    })
  }

  // --- PSICOMÉTRICA - VENDEDOR (RETAIL) ---
  const psicoVendedor = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicométrica - Vendedor',
      type: 'PSICOMETRICA',
      description: 'Test Big Five de personalidad para Vendedor',
      order: 1,
      positionId: vendedor.id,
    },
  })

  for (const q of bigFiveQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicoVendedor.id,
      },
    })
  }

  // --- PSICOLÓGICA - VENDEDOR (RETAIL) ---
  const psicologicaVendedor = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación Psicológica - Vendedor',
      type: 'PSICOLOGICA',
      description: 'Evaluación de competencias psicológicas para Vendedor',
      order: 2,
      positionId: vendedor.id,
    },
  })

  for (const q of psicologicaQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicologicaVendedor.id,
      },
    })
  }

  // --- CONOCIMIENTOS - VENDEDOR (RETAIL) ---
  const conocimientosVendedor = await db.evaluationTemplate.create({
    data: {
      name: 'Evaluación de Conocimientos - Vendedor',
      type: 'CONOCIMIENTOS',
      description: 'Conocimientos básicos de ventas para Vendedor',
      order: 3,
      positionId: vendedor.id,
    },
  })

  const knowledgeVendedorQuestions = [
    {
      text: '¿Qué es un "upselling"?',
      options: JSON.stringify(['Vender más barato', 'Ofrecer un producto de mayor valor o complementario', 'Regalar productos', 'Descartar al cliente']),
      order: 1,
    },
    {
      text: '¿Cuál es la primera regla de la atención al cliente?',
      options: JSON.stringify(['Ser agresivo en la venta', 'Escuchar activamente al cliente', 'Mostrar todos los productos', 'Ofrecer descuentos siempre']),
      order: 2,
    },
    {
      text: 'Si un cliente dice "solo estoy viendo", ¿qué debe responder?',
      options: JSON.stringify(['Ignorarlo', '"Entiendo, estoy aquí si necesita ayuda"', 'Insistir en que compre', 'Decirle que no hay solo para ver']),
      order: 3,
    },
    {
      text: '¿Qué es el "closing" en ventas?',
      options: JSON.stringify(['Cerrar la tienda', 'El momento de cerrar la venta', 'Despedir al cliente', 'Terminar el turno']),
      order: 4,
    },
    {
      text: '¿Cómo debe manejar una objeción de precio?',
      options: JSON.stringify(['Decir que es el precio y ya', 'Mostrar el valor y beneficios del producto', 'Dar un descuento inmediato', 'Ignorar la objeción']),
      order: 5,
    },
    {
      text: '¿Qué es el "cross-selling"?',
      options: JSON.stringify(['Vender lo mismo a otro cliente', 'Ofrecer productos complementarios al que el cliente ya quiere', 'Vender más caro', 'No vender nada']),
      order: 6,
    },
    {
      text: '¿Qué es la "tribanda" en venta de ropa?',
      options: JSON.stringify(['Un tipo de tela', 'Tres prendas que se venden juntas como outfit completo', 'Un descuento triple', 'Una marca de ropa']),
      order: 7,
    },
    {
      text: '¿Qué debe hacer al final de cada atención al cliente?',
      options: JSON.stringify(['Irse inmediatamente', 'Agradecer y preguntar si necesita algo más', 'Ignorar al cliente', 'Ofrecer solo descuentos']),
      order: 8,
    },
    {
      text: '¿Qué es un cliente "warm lead"?',
      options: JSON.stringify(['Un cliente enojado', 'Un cliente que ya mostró interés en comprar', 'Un cliente frío', 'Un cliente que ya compró']),
      order: 9,
    },
    {
      text: '¿Cuál es la técnica SPIN en ventas?',
      options: JSON.stringify(['Girar el producto', 'Situation, Problem, Implication, Need', 'Solo preguntar el precio', 'Vender por impulso']),
      order: 10,
    },
  ]

  for (const q of knowledgeVendedorQuestions) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'MULTIPLE_CHOICE',
        options: q.options,
        category: 'KNOWLEDGE',
        order: q.order,
        evaluationTemplateId: conocimientosVendedor.id,
      },
    })
  }

  // ============================================
  // CREATE DEMO EVALUATION RESULTS
  // ============================================
  const session1 = await db.evaluationSession.create({
    data: {
      candidateId: candidate1.id,
      positionId: mesero.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session1.id,
      candidateId: candidate1.id,
      candidateName: candidate1.name,
      positionId: mesero.id,
      positionTitle: mesero.title,
      companyId: restaurantCompany.id,
      openness: 78,
      conscientiousness: 85,
      extraversion: 92,
      agreeableness: 70,
      neuroticism: 35,
      stressLevel: 30,
      empathy: 82,
      adaptability: 75,
      leadership: 60,
      teamwork: 88,
      knowledgeScore: 80,
      overallScore: 75,
      recommendation: 'APTO',
      summary: 'Candidato con alta extraversión y trabajo en equipo. Buen nivel de empatía y adaptabilidad. Conocimientos técnicos sólidos. Recomendado para el puesto de mesero.',
    },
  })

  const session2 = await db.evaluationSession.create({
    data: {
      candidateId: candidate2.id,
      positionId: cocinero.id,
      companyId: restaurantCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session2.id,
      candidateId: candidate2.id,
      candidateName: candidate2.name,
      positionId: cocinero.id,
      positionTitle: cocinero.title,
      companyId: restaurantCompany.id,
      openness: 60,
      conscientiousness: 72,
      extraversion: 45,
      agreeableness: 55,
      neuroticism: 68,
      stressLevel: 65,
      empathy: 50,
      adaptability: 45,
      leadership: 30,
      teamwork: 48,
      knowledgeScore: 55,
      overallScore: 52,
      recommendation: 'ENTREVISTA_ADICIONAL',
      summary: 'Candidata con nivel de estrés elevado y adaptabilidad limitada. Conocimientos técnicos aceptables pero necesita mejora. Se recomienda entrevista adicional para evaluar manejo de presión.',
    },
  })

  const session3 = await db.evaluationSession.create({
    data: {
      candidateId: candidate3.id,
      positionId: vendedor.id,
      companyId: retailCompany.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
    },
  })

  await db.evaluationResult.create({
    data: {
      sessionId: session3.id,
      candidateId: candidate3.id,
      candidateName: candidate3.name,
      positionId: vendedor.id,
      positionTitle: vendedor.title,
      companyId: retailCompany.id,
      openness: 55,
      conscientiousness: 40,
      extraversion: 35,
      agreeableness: 30,
      neuroticism: 82,
      stressLevel: 85,
      empathy: 25,
      adaptability: 28,
      leadership: 15,
      teamwork: 30,
      overallScore: 35,
      recommendation: 'NO_RECOMENDADO',
      summary: 'Candidato con alto nivel de estrés y baja empatía. Baja adaptabilidad y trabajo en equipo. No se recomienda para puesto de atención al cliente.',
    },
  })

  // Create an in-progress session for demo
  const session4 = await db.evaluationSession.create({
    data: {
      candidateId: candidate1.id,
      positionId: bartender.id,
      companyId: restaurantCompany.id,
      status: 'IN_PROGRESS',
      currentStep: 2,
      currentQuestionIndex: 3,
      startedAt: new Date(),
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 2 companies (Restaurant & Retail)`)
  console.log(`   - 7 users (admin, RH, gerentes, candidatos)`)
  console.log(`   - 5 positions`)
  console.log(`   - ${15} evaluation templates`)
  console.log(`   - ${150} questions`)
  console.log(`   - 3 demo results`)
  console.log('')
  console.log('🔑 Login credentials:')
  console.log('   Super Admin: admin@evaluhr.com / admin123')
  console.log('   RH Restaurant: rh@cafedechiapas.com / rh1234')
  console.log('   Gerente Restaurant: gerente@cafedechiapas.com / gerente1234')
  console.log('   RH Retail: rh@marlui.com / rh1234')
  console.log('   Candidate: juan.perez@email.com / candidato1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
