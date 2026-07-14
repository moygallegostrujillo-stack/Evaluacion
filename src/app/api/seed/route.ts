import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function GET() {
  try {
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

    // ============================================
    // CREATE COMPANIES
    // ============================================
    const restaurantCompany = await db.company.create({
      data: {
        name: 'Restaurante El Sazón Chiapaneco',
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
        name: 'Moda Chiapas S.A. de C.V.',
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
    const superAdmin = await db.user.create({
      data: {
        email: 'admin@evaluhr.com',
        name: 'Administrador del Sistema',
        password: hashPassword('admin123'),
        role: 'SUPER_ADMIN',
        active: true,
      },
    })

    const rhRestaurant = await db.user.create({
      data: {
        email: 'rh@elsazon.com',
        name: 'María García López',
        password: hashPassword('rh1234'),
        role: 'RH',
        companyId: restaurantCompany.id,
        active: true,
      },
    })

    const gerenteRestaurant = await db.user.create({
      data: {
        email: 'gerente@elsazon.com',
        name: 'Carlos Méndez Ruiz',
        password: hashPassword('gerente1234'),
        role: 'GERENTE',
        companyId: restaurantCompany.id,
        active: true,
      },
    })

    const rhRetail = await db.user.create({
      data: {
        email: 'rh@modachiapas.com',
        name: 'Ana López Díaz',
        password: hashPassword('rh1234'),
        role: 'RH',
        companyId: retailCompany.id,
        active: true,
      },
    })

    const candidate1 = await db.user.create({
      data: {
        email: 'juan.perez@email.com',
        name: 'Juan Pérez Hernández',
        password: hashPassword('candidato1234'),
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
        password: hashPassword('candidato1234'),
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
        password: hashPassword('candidato1234'),
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

    // Helper to create templates for a position
    async function createTemplatesForPosition(positionId: string, positionName: string, knowledgeQuestions: Array<{text: string; options: string; correctAnswer: number; order: number}>) {
      // Psicométrica
      const psico = await db.evaluationTemplate.create({
        data: {
          name: `Evaluación Psicométrica - ${positionName}`,
          type: 'PSICOMETRICA',
          description: `Test Big Five de personalidad para puesto de ${positionName}`,
          order: 1,
          positionId,
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
            isCustom: false,
            evaluationTemplateId: psico.id,
          },
        })
      }

      // Psicológica
      const psicologica = await db.evaluationTemplate.create({
        data: {
          name: `Evaluación Psicológica - ${positionName}`,
          type: 'PSICOLOGICA',
          description: `Evaluación de competencias psicológicas para ${positionName}`,
          order: 2,
          positionId,
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
            isCustom: false,
            evaluationTemplateId: psicologica.id,
          },
        })
      }

      // Conocimientos
      const conocimientos = await db.evaluationTemplate.create({
        data: {
          name: `Evaluación de Conocimientos - ${positionName}`,
          type: 'CONOCIMIENTOS',
          description: `Conocimientos técnicos para puesto de ${positionName}`,
          order: 3,
          positionId,
        },
      })
      for (const q of knowledgeQuestions) {
        await db.question.create({
          data: {
            text: q.text,
            type: 'MULTIPLE_CHOICE',
            options: q.options,
            category: 'KNOWLEDGE',
            order: q.order,
            isCustom: false,
            correctAnswer: q.correctAnswer,
            evaluationTemplateId: conocimientos.id,
          },
        })
      }
    }

    // Mesero questions (correctAnswer: 0-based index of correct option)
    await createTemplatesForPosition(mesero.id, 'Mesero', [
      { text: '¿Cuál es la temperatura adecuada para servir vino tinto?', options: JSON.stringify(['4-6°C', '14-18°C', '20-24°C', '8-10°C']), correctAnswer: 1, order: 1 },
      { text: '¿Qué debe hacer un mesero antes de entregar la cuenta al cliente?', options: JSON.stringify(['Verificar que todo esté correcto', 'Preguntar si quiere postre', 'Recoger los platos', 'Traer más agua']), correctAnswer: 0, order: 2 },
      { text: 'Si un cliente reclama que su comida está fría, ¿qué debe hacer primero?', options: JSON.stringify(['Discutir con el cliente', 'Ofrecerse a calentarla o cambiarla', 'Ignorar el reclamo', 'Culpar a la cocina']), correctAnswer: 1, order: 3 },
      { text: '¿Cuál es el orden correcto para servir los platillos?', options: JSON.stringify(['Postre, plato fuerte, entrada', 'Entrada, plato fuerte, postre', 'Platos simultáneos', 'Solo plato fuerte']), correctAnswer: 1, order: 4 },
      { text: '¿Qué significa "mise en place"?', options: JSON.stringify(['Limpiar las mesas', 'Preparar y organizar todo antes del servicio', 'Decorar el restaurante', 'Cocinar los platillos']), correctAnswer: 1, order: 5 },
      { text: '¿Cómo debe llevar los platos un mesero al salir de la cocina?', options: JSON.stringify(['En las manos', 'En charola siempre', 'Como sea más rápido', 'Solo los más pesados en charola']), correctAnswer: 1, order: 6 },
      { text: '¿Qué es el "upselling" en un restaurante?', options: JSON.stringify(['Vender platos más baratos', 'Sugerir platillos adicionales o de mayor valor', 'Regalar postres', 'Dar descuentos sin autorización']), correctAnswer: 1, order: 7 },
      { text: '¿Cuándo debe un mesero acercarse a una mesa por primera vez?', options: JSON.stringify(['Inmediatamente al sentarse', 'Después de 5 minutos', 'Cuando el cliente levante la mano', 'Después de entregar el menú y dar un momento']), correctAnswer: 3, order: 8 },
      { text: '¿Qué debe hacer si un cliente tiene una alergia alimentaria?', options: JSON.stringify(['Ignorar la solicitud', 'Informar inmediatamente a cocina y verificar ingredientes', 'Sugerir otro platillo sin verificar', 'Decir que no hay problema']), correctAnswer: 1, order: 9 },
      { text: '¿Cuál es la regla general para servir bebidas?', options: JSON.stringify(['Servir por la derecha', 'Servir por la izquierda', 'Servir por donde sea más accesible', 'Dejar que el cliente se sirva solo']), correctAnswer: 0, order: 10 },
    ])

    // Cocinero questions
    await createTemplatesForPosition(cocinero.id, 'Cocinero', [
      { text: '¿Cuál es la temperatura interna mínima segura para el pollo cocido?', options: JSON.stringify(['55°C', '63°C', '74°C', '85°C']), correctAnswer: 2, order: 1 },
      { text: '¿Qué es la contaminación cruzada?', options: JSON.stringify(['Cuando los alimentos se queman', 'Transferencia de bacterias de un alimento a otro', 'Cuando la comida se enfría', 'Mezclar sabores']), correctAnswer: 1, order: 2 },
      { text: '¿Qué es una "brunoise"?', options: JSON.stringify(['Un tipo de salsa', 'Un corte en cubos pequeños', 'Una técnica de cocción', 'Un tipo de carne']), correctAnswer: 1, order: 3 },
      { text: '¿Cuál es el orden correcto de almacenamiento en el refrigerador?', options: JSON.stringify(['Pollo arriba, vegetales abajo', 'Vegetales arriba, pollo abajo', 'Todo en el mismo estante', 'No importa el orden']), correctAnswer: 1, order: 4 },
      { text: '¿Qué hacer si un alimento se cae al suelo?', options: JSON.stringify(['Levantarlo rápidamente y usarlo', 'Desecharlo', 'Enjuagarlo', 'Depende del alimento']), correctAnswer: 1, order: 5 },
      { text: '¿Qué es la "mise en place" en cocina?', options: JSON.stringify(['Limpiar la cocina', 'Tener todo preparado y organizado antes de cocinar', 'Cocinar a fuego alto', 'Servir los platillos']), correctAnswer: 1, order: 6 },
      { text: '¿Cuánto tiempo máximo puede estar un alimento fuera de refrigeración?', options: JSON.stringify(['1 hora', '2 horas', '4 horas', 'No hay límite']), correctAnswer: 1, order: 7 },
      { text: '¿Qué es una "reducción" en cocina?', options: JSON.stringify(['Quitar ingredientes', 'Cocinar un líquido hasta evaporar parte y concentrar sabor', 'Bajar la temperatura', 'Cortar en trozos pequeños']), correctAnswer: 1, order: 8 },
      { text: '¿Cuándo debe lavarse las manos en la cocina?', options: JSON.stringify(['Solo al inicio del turno', 'Antes de cocinar y después de manipular alimentos crudos', 'Una vez por hora', 'Solo si se ven sucias']), correctAnswer: 1, order: 9 },
      { text: '¿Qué color de tabla se usa típicamente para pollo?', options: JSON.stringify(['Verde', 'Roja', 'Azul', 'Blanca']), correctAnswer: 2, order: 10 },
    ])

    // Bartender questions
    await createTemplatesForPosition(bartender.id, 'Bartender', [
      { text: '¿Qué es un "muddled" en coctelería?', options: JSON.stringify(['Mezclar con hielo', 'Machacar ingredientes para liberar sabores', 'Filtrar una bebida', 'Agitar en coctelera']), correctAnswer: 1, order: 1 },
      { text: '¿Cuánto tequila lleva un Margarita clásico?', options: JSON.stringify(['30 ml', '45 ml', '60 ml', '90 ml']), correctAnswer: 2, order: 2 },
      { text: '¿Qué es el "layering" en bebidas?', options: JSON.stringify(['Agitar vigorosamente', 'Crear capas de líquidos con diferentes densidades', 'Añadir hielo', 'Decorar con fruta']), correctAnswer: 1, order: 3 },
      { text: '¿Cuál es la diferencia entre mezcal y tequila?', options: JSON.stringify(['No hay diferencia', 'El tequila es solo de Jalisco y el mezcal de varias regiones', 'El mezcal es más barato', 'El tequila es más fuerte']), correctAnswer: 1, order: 4 },
      { text: '¿Qué hacer si un cliente está visiblemente intoxicado?', options: JSON.stringify(['Seguir sirviendo', 'Negarse cortésmente a servir más y ofrecer agua', 'Ignorarlo', 'Llamar a la policía inmediatamente']), correctAnswer: 1, order: 5 },
      { text: '¿Qué tipo de vaso se usa para un Old Fashioned?', options: JSON.stringify(['Copa flauta', 'Vaso corto/rocks', 'Copa margarita', 'Vaso alto']), correctAnswer: 1, order: 6 },
      { text: '¿Qué significa "on the rocks"?', options: JSON.stringify(['Sin hielo', 'Con hielo', 'Con limón', 'Doble porción']), correctAnswer: 1, order: 7 },
      { text: '¿Cuál es el licor base de un Mojito?', options: JSON.stringify(['Vodka', 'Ron', 'Gin', 'Tequila']), correctAnswer: 1, order: 8 },
      { text: '¿Qué es un "dash" en coctelería?', options: JSON.stringify(['Una medida grande', 'Una pequeña cantidad (3-5 gotas)', 'Un tipo de vaso', 'Una técnica de mezclado']), correctAnswer: 1, order: 9 },
      { text: '¿Cómo se sirve una cerveza correctamente?', options: JSON.stringify(['Directa y rápida', 'Inclinando el vaso y gradualmente enderezándolo', 'Dejándola caer desde lo alto', 'Sin espuma']), correctAnswer: 1, order: 10 },
    ])

    // Gerente de Piso questions
    await createTemplatesForPosition(gerentePiso.id, 'Gerente de Piso', [
      { text: '¿Cuál es la métrica más importante para medir la eficiencia de un restaurante?', options: JSON.stringify(['Número de empleados', 'Rotación de mesas', 'Tamaño del menú', 'Cantidad de proveedores']), correctAnswer: 1, order: 1 },
      { text: 'Si un mesero reporta que un cliente está insatisfecho, ¿qué es lo primero que debe hacer?', options: JSON.stringify(['Ignorar el reporte', 'Acercarse a la mesa y escuchar al cliente', 'Dar un descuento automático', 'Cambiar de mesero']), correctAnswer: 1, order: 2 },
      { text: '¿Qué es el "ticket promedio"?', options: JSON.stringify(['El precio del menú', 'El gasto promedio por cliente', 'El salario de los meseros', 'El costo de los ingredientes']), correctAnswer: 1, order: 3 },
      { text: '¿Cómo debe manejar un conflicto entre dos empleados?', options: JSON.stringify(['Despedir a ambos', 'Escuchar ambas partes y buscar solución', 'Ignorar el conflicto', 'Elegir un lado']), correctAnswer: 1, order: 4 },
      { text: '¿Qué indica un alto índice de rotación de personal?', options: JSON.stringify(['Buen ambiente laboral', 'Problemas en la gestión o condiciones laborales', 'Éxito del negocio', 'No es relevante']), correctAnswer: 1, order: 5 },
      { text: '¿Qué es la "captación" de clientes en un restaurante?', options: JSON.stringify(['Cobrar más caro', 'Atraer nuevos clientes al establecimiento', 'Retener a los mismos clientes', 'Reducir el menú']), correctAnswer: 1, order: 6 },
      { text: '¿Cuál es la mejor forma de motivar al personal de sala?', options: JSON.stringify(['Amenazar con despido', 'Reconocimiento y capacitación constante', 'Solo incrementar salario', 'Ignorar sus necesidades']), correctAnswer: 1, order: 7 },
      { text: '¿Qué debe hacer al inicio de cada turno?', options: JSON.stringify(['Esperar a que lleguen los clientes', 'Verificar reservaciones, personal y estado del salón', 'Solo revisar la caja', 'Nada en particular']), correctAnswer: 1, order: 8 },
      { text: '¿Cómo se calcula la productividad de un mesero?', options: JSON.stringify(['Por su puntualidad', 'Ventas generadas y número de mesas atendidas', 'Por su antigüedad', 'Por su carisma']), correctAnswer: 1, order: 9 },
      { text: '¿Qué es el "SOP" en gestión de restaurantes?', options: JSON.stringify(['Un tipo de comida', 'Standard Operating Procedure (Procedimiento Operativo Estándar)', 'Un sistema de pagos', 'Un proveedor']), correctAnswer: 1, order: 10 },
    ])

    // Vendedor questions
    await createTemplatesForPosition(vendedor.id, 'Vendedor', [
      { text: '¿Qué es un "upselling"?', options: JSON.stringify(['Vender más barato', 'Ofrecer un producto de mayor valor o complementario', 'Regalar productos', 'Descartar al cliente']), correctAnswer: 1, order: 1 },
      { text: '¿Cuál es la primera regla de la atención al cliente?', options: JSON.stringify(['Ser agresivo en la venta', 'Escuchar activamente al cliente', 'Mostrar todos los productos', 'Ofrecer descuentos siempre']), correctAnswer: 1, order: 2 },
      { text: 'Si un cliente dice "solo estoy viendo", ¿qué debe responder?', options: JSON.stringify(['Ignorarlo', '"Entiendo, estoy aquí si necesita ayuda"', 'Insistir en que compre', 'Decirle que no hay solo para ver']), correctAnswer: 1, order: 3 },
      { text: '¿Qué es el "closing" en ventas?', options: JSON.stringify(['Cerrar la tienda', 'El momento de cerrar la venta', 'Despedir al cliente', 'Terminar el turno']), correctAnswer: 1, order: 4 },
      { text: '¿Cómo debe manejar una objeción de precio?', options: JSON.stringify(['Decir que es el precio y ya', 'Mostrar el valor y beneficios del producto', 'Dar un descuento inmediato', 'Ignorar la objeción']), correctAnswer: 1, order: 5 },
      { text: '¿Qué es el "cross-selling"?', options: JSON.stringify(['Vender lo mismo a otro cliente', 'Ofrecer productos complementarios al que el cliente ya quiere', 'Vender más caro', 'No vender nada']), correctAnswer: 1, order: 6 },
      { text: '¿Qué es la "tribanda" en venta de ropa?', options: JSON.stringify(['Un tipo de tela', 'Tres prendas que se venden juntas como outfit completo', 'Un descuento triple', 'Una marca de ropa']), correctAnswer: 1, order: 7 },
      { text: '¿Qué debe hacer al final de cada atención al cliente?', options: JSON.stringify(['Irse inmediatamente', 'Agradecer y preguntar si necesita algo más', 'Ignorar al cliente', 'Ofrecer solo descuentos']), correctAnswer: 1, order: 8 },
      { text: '¿Qué es un cliente "warm lead"?', options: JSON.stringify(['Un cliente enojado', 'Un cliente que ya mostró interés en comprar', 'Un cliente frío', 'Un cliente que ya compró']), correctAnswer: 1, order: 9 },
      { text: '¿Cuál es la técnica SPIN en ventas?', options: JSON.stringify(['Girar el producto', 'Situation, Problem, Implication, Need', 'Solo preguntar el precio', 'Vender por impulso']), correctAnswer: 1, order: 10 },
    ])

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

    // In-progress session for demo
    await db.evaluationSession.create({
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

    // ============================================
    // CREATE DEMO VACANCIES
    // ============================================
    const vendedorVacancy = await db.vacancy.create({
      data: {
        title: 'Vendedor/a',
        slug: 'vendedor-a',
        description: 'Se busca vendedor/a con experiencia en atención al cliente para tienda de moda',
        sector: 'RETAIL',
        status: 'ACTIVE',
        includePsicometrica: true,
        includePsicologica: true,
        maxVideoSeconds: 60,
        companyId: retailCompany.id,
        questions: {
          create: [
            { text: '¿Cuál es la técnica de venta más efectiva para conocer las necesidades del cliente?', type: 'MULTIPLE_CHOICE', options: '["Hablar ininterrumpidamente del producto","Hacer preguntas abiertas y escuchar activamente","Ofrecer el producto más caro primero","Presionar para cerrar la venta rápido"]', correctAnswer: 1, order: 1 },
            { text: '¿Qué es el "upselling" en ventas?', type: 'MULTIPLE_CHOICE', options: '["Vender un producto más barato","Ofrecer un producto o servicio adicional o de mayor valor","Regalar productos para fidelizar","Reducir el precio para cerrar la venta"]', correctAnswer: 1, order: 2 },
            { text: '¿Cuál es la regla del "3 metros" en atención al cliente?', type: 'MULTIPLE_CHOICE', options: '["Mantener 3 metros de distancia del cliente","Reconocer y saludar al cliente cuando está a 3 metros","Solo atender clientes que estén a 3 metros","Volver a saludar cada 3 minutos"]', correctAnswer: 1, order: 3 },
            { text: '¿Qué es el "cross-selling" o venta cruzada?', type: 'MULTIPLE_CHOICE', options: '["Vender productos de la competencia","Ofrecer productos complementarios al que el cliente ya va a comprar","Vender solo un producto por cliente","Intercambiar productos entre tiendas"]', correctAnswer: 1, order: 4 },
            { text: '¿Cuál es la técnica adecuada para manejar objecciones de precio?', type: 'MULTIPLE_CHOICE', options: '["Bajar el precio inmediatamente","Demostrar el valor y beneficios del producto","Insistir en que es el mejor precio","Ignorar la objeción"]', correctAnswer: 1, order: 5 },
          ],
        },
      },
    })

    const meseroVacancy = await db.vacancy.create({
      data: {
        title: 'Mesero/a',
        slug: 'mesero-a',
        description: 'Se busca mesero/a para restaurante de comida chiapaneca',
        sector: 'RESTAURANT',
        status: 'ACTIVE',
        includePsicometrica: true,
        includePsicologica: true,
        maxVideoSeconds: 60,
        companyId: restaurantCompany.id,
        questions: {
          create: [
            { text: '¿Cuál es la temperatura mínima interna segura para cocinar pollo?', type: 'MULTIPLE_CHOICE', options: '["55°C","63°C","74°C","85°C"]', correctAnswer: 2, order: 1 },
            { text: '¿Qué debe hacer un mesero si un cliente reporta una alergia alimentaria?', type: 'MULTIPLE_CHOICE', options: '["Ignorar la solicitud","Informar inmediatamente a cocina y verificar ingredientes","Sugerir otro platillo sin verificar","Decir que no hay ingredientes alergénicos"]', correctAnswer: 1, order: 2 },
            { text: '¿Cuál es la regla básica de higiene al manipular alimentos?', type: 'MULTIPLE_CHOICE', options: '["Lavarse las manos solo al inicio del turno","Usar guantes en todo momento","Lavarse las manos frecuentemente y después de cada interrupción","No es necesario si se usa cubrebocas"]', correctAnswer: 2, order: 3 },
            { text: '¿Qué significa la sigla FIFO en el manejo de inventarios?', type: 'MULTIPLE_CHOICE', options: '["First In First Out (Primero en entrar, primero en salir)","Fast In Fast Out","Fresh Ingredients First Order","Food In Food Out"]', correctAnswer: 0, order: 4 },
            { text: '¿Cuánto tiempo máximo pueden permanecer alimentos perecederos a temperatura ambiente?', type: 'MULTIPLE_CHOICE', options: '["1 hora","2 horas","4 horas","8 horas"]', correctAnswer: 1, order: 5 },
          ],
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        companies: 2,
        users: 7,
        positions: 5,
        templates: 15,
        questions: 150,
        vacancies: 2,
        demoResults: 3,
        credentials: {
          superAdmin: 'admin@evaluhr.com / admin123',
          rhRestaurant: 'rh@elsazon.com / rh1234',
          gerenteRestaurant: 'gerente@elsazon.com / gerente1234',
          rhRetail: 'rh@modachiapas.com / rh1234',
          candidate: 'juan.perez@email.com / candidato1234',
        },
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 })
  }
}
