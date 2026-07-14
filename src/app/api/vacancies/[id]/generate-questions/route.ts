import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// SECTOR-SPECIFIC QUESTION BANKS
// ============================================

const QUESTION_BANKS: Record<string, Array<{
  text: string
  options: string[]
  correctAnswer: number
}>> = {
  RESTAURANT: [
    { text: '¿Cuál es la temperatura mínima interna segura para cocinar pollo?', options: ['55°C', '63°C', '74°C', '85°C'], correctAnswer: 2 },
    { text: '¿Qué debe hacer un mesero si un cliente reporta una alergia alimentaria?', options: ['Ignorar la solicitud', 'Informar inmediatamente a cocina y verificar ingredientes', 'Sugerir otro platillo sin verificar', 'Decir que no hay ingredientes alergénicos'], correctAnswer: 1 },
    { text: '¿Cuál es la regla básica de higiene al manipular alimentos?', options: ['Lavarse las manos solo al inicio del turno', 'Usar guantes en todo momento', 'Lavarse las manos frecuentemente y después de cada interrupción', 'No es necesario si se usa cubrebocas'], correctAnswer: 2 },
    { text: '¿Qué significa la sigla FIFO en el manejo de inventarios?', options: ['First In First Out (Primero en entrar, primero en salir)', 'Fast In Fast Out', 'Fresh Ingredients First Order', 'Food In Food Out'], correctAnswer: 0 },
    { text: '¿Cómo debe manejarse una queja de un cliente insatisfecho?', options: ['Discutir con el cliente', 'Escuchar activamente, disculparse y buscar solución', 'Ignorar la queja', 'Decirle que no se puede hacer nada'], correctAnswer: 1 },
    { text: '¿Cuál es la forma correcta de cargar una bandeja con platillos calientes?', options: ['Con una mano para mayor velocidad', 'Con ambas manos, distribuyendo el peso equilibradamente', 'Sobre el hombro como los meseros de películas', 'Con los platillos apilados sin orden'], correctAnswer: 1 },
    { text: '¿Qué documento es obligatorio para trabajar en la preparación de alimentos en México?', options: ['Pasaporte', 'Carta de antecedentes no penales', 'Constancia de manejo higiénico de alimentos', 'Título universitario'], correctAnswer: 2 },
    { text: '¿Cuánto tiempo máximo pueden permanecer alimentos perecederos a temperatura ambiente?', options: ['1 hora', '2 horas', '4 horas', '8 horas'], correctAnswer: 1 },
  ],
  RETAIL: [
    { text: '¿Cuál es la técnica de venta más efectiva para conocer las necesidades del cliente?', options: ['Hablar ininterrumpidamente del producto', 'Hacer preguntas abiertas y escuchar activamente', 'Ofrecer el producto más caro primero', 'Presionar para cerrar la venta rápido'], correctAnswer: 1 },
    { text: '¿Qué es el "upselling" en ventas?', options: ['Vender un producto más barato', 'Ofrecer un producto o servicio adicional o de mayor valor', 'Regalar productos para fidelizar', 'Reducir el precio para cerrar la venta'], correctAnswer: 1 },
    { text: '¿Cómo se debe manejar un cliente que quiere devolver un producto sin ticket?', options: ['Negarse rotundamente', 'Seguir la política de la tienda y buscar alternativas', 'Intercambiar sin preguntas', 'Ignorar al cliente'], correctAnswer: 1 },
    { text: '¿Cuál es la regla del "3 metros" en atención al cliente?', options: ['Mantener 3 metros de distancia del cliente', 'Reconocer y saludar al cliente cuando está a 3 metros de distancia', 'Solo atender clientes que estén a 3 metros', 'Volver a saludar cada 3 minutos'], correctAnswer: 1 },
    { text: '¿Qué es el "cross-selling" o venta cruzada?', options: ['Vender productos de la competencia', 'Ofrecer productos complementarios al que el cliente ya va a comprar', 'Vender solo un producto por cliente', 'Intercambiar productos entre tiendas'], correctAnswer: 1 },
    { text: '¿Cuál es la técnica adecuada para manejar objecciones de precio?', options: ['Bajar el precio inmediatamente', 'Demostrar el valor y beneficios del producto', 'Insistir en que es el mejor precio', 'Ignorar la objeción'], correctAnswer: 1 },
    { text: '¿Qué significa "rotación de inventario"?', options: ['Cambiar de lugar los productos', 'La velocidad con que se venden y reponen los productos', 'Girar los productos en el anaquel', 'Desechar productos viejos'], correctAnswer: 1 },
    { text: '¿Cuál es la mejor manera de cerrar una venta?', options: ['Presionar al cliente', 'Resumir beneficios y preguntar por la decisión de compra', 'Dar el precio final sin más explicación', 'Decirle que es su última oportunidad'], correctAnswer: 1 },
  ],
  SERVICIOS: [
    { text: '¿Cuál es el principio más importante en la atención al cliente?', options: ['Velocidad sobre calidad', 'Empatía y escucha activa', 'Siempre dar la razón al cliente', 'Minimizar los problemas del cliente'], correctAnswer: 1 },
    { text: '¿Qué es un SLA (Service Level Agreement)?', options: ['Un tipo de software', 'Acuerdo de nivel de servicio entre proveedor y cliente', 'Un método de pago', 'Un formato de queja'], correctAnswer: 1 },
    { text: '¿Cómo se debe documentar una incidencia con un cliente?', options: ['No es necesario documentar', 'De forma detallada con fecha, descripción y acciones tomadas', 'Solo si el cliente lo pide', 'Verbalmente con el supervisor'], correctAnswer: 1 },
    { text: '¿Qué es la "recuperación de servicio"?', options: ['Cobrar doble por un servicio fallido', 'El proceso para convertir una experiencia negativa en positiva', 'Repetir el servicio sin costo siempre', 'Ignorar las quejas del cliente'], correctAnswer: 1 },
    { text: '¿Cuál es la métrica NPS y para qué sirve?', options: ['Número de productos vendidos', 'Net Promoter Score, mide la lealtad del cliente', 'Nivel de productividad del staff', 'Número de quejas recibidas'], correctAnswer: 1 },
    { text: '¿Qué debe hacer primero al recibir una queja del cliente?', options: ['Explicar por qué no es culpa de la empresa', 'Escuchar sin interrumpir y validar los sentimientos del cliente', 'Transferir la queja a otro departamento', 'Pedir disculpas sin escuchar el problema'], correctAnswer: 1 },
  ],
  GENERAL: [
    { text: '¿Cuál es la comunicación más efectiva en el entorno laboral?', options: ['Comunicación pasiva', 'Comunicación asertiva', 'Comunicación agresiva', 'Evitar la comunicación'], correctAnswer: 1 },
    { text: '¿Qué es el trabajo en equipo?', options: ['Cada quien hace lo suyo independientemente', 'Colaboración coordinada hacia un objetivo común', 'Solo trabajar en grupo físico', 'Delegar todo el trabajo a otros'], correctAnswer: 1 },
    { text: '¿Cómo se debe manejar un conflicto con un compañero de trabajo?', options: ['Ignorarlo hasta que desaparezca', 'Hablar directamente con la persona de forma respetuosa', 'Quejarse con otros compañeros', 'Reportar inmediatamente al jefe sin intentar resolverlo'], correctAnswer: 1 },
    { text: '¿Qué es la puntualidad en el trabajo?', options: ['Llegar cuando se pueda', 'Llegar a la hora acordada o antes', 'Llegar 15 minutos tarde es aceptable', 'No importa la hora mientras se termine el trabajo'], correctAnswer: 1 },
    { text: '¿Cuál es la mejor forma de aprender un nuevo proceso en el trabajo?', options: ['No preguntar para no parecer incompetente', 'Observar, preguntar y practicar hasta dominarlo', 'Leer el manual una vez y listo', 'Dejar que otros hagan el trabajo nuevo'], correctAnswer: 1 },
    { text: '¿Qué significa tener iniciativa en el trabajo?', options: ['Hacer solo lo que te piden', 'Proponer soluciones y tomar acción proactivamente', 'Cambiar procesos sin consultar', 'Trabajar horas extras siempre'], correctAnswer: 1 },
  ],
}

// ============================================
// POST - Generate knowledge questions
// ============================================

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

async function callAI(messages: ChatMessage[]): Promise<string | null> {
  const baseUrl = process.env.ZAI_BASE_URL
  const apiKey = process.env.ZAI_API_KEY
  const chatId = process.env.ZAI_CHAT_ID
  const userId = process.env.ZAI_USER_ID
  const token = process.env.ZAI_TOKEN

  if (!baseUrl || !apiKey) {
    return null // AI not available, use fallback
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Z-AI-From': 'Z',
    }
    if (chatId) headers['X-Chat-Id'] = chatId
    if (userId) headers['X-User-Id'] = userId
    if (token) headers['X-Token'] = token

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        thinking: { type: 'disabled' },
      }),
    })

    if (!response.ok) {
      console.error(`AI API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || null
  } catch (error) {
    console.error('AI API call failed:', error)
    return null
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const vacancy = await db.vacancy.findUnique({
      where: { id },
      include: { company: true, questions: { select: { id: true } } },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    const sectorLabels: Record<string, string> = {
      RESTAURANT: 'restaurante/food service',
      RETAIL: 'retail/ventas',
      SERVICIOS: 'servicios',
      GENERAL: 'general',
      OTRO: 'otro',
    }

    let generatedQuestions: Array<{
      text: string
      options: string[]
      correctAnswer: number
    }> = []

    // Try AI first
    const sectorDescription = sectorLabels[vacancy.sector] || vacancy.sector
    const aiResponse = await callAI([
      {
        role: 'assistant',
        content: `Eres un experto en recursos humanos que crea preguntas de evaluación de conocimiento para puestos de trabajo en México. 
Generas preguntas técnicas relevantes al puesto y sector, con 4 opciones de respuesta y una correcta.
IMPORTANTE: Responde SOLO con JSON válido, sin texto adicional. El formato debe ser exactamente:
{"questions": [{"text": "pregunta", "options": ["opción A", "opción B", "opción C", "opción D"], "correctAnswer": 0}]}
El correctAnswer es el índice (0-3) de la respuesta correcta.
Genera entre 5 y 10 preguntas.`
      },
      {
        role: 'user',
        content: `Genera preguntas de conocimiento para la vacante: "${vacancy.title}"
Sector: ${sectorDescription}
Empresa: ${vacancy.company.name}
${vacancy.description ? `Descripción: ${vacancy.description}` : ''}

Las preguntas deben ser relevantes al puesto, prácticas, y enfocadas en conocimientos técnicos que un candidato necesitaría para desempeñarse bien en este rol.`
      }
    ])

    if (aiResponse) {
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.questions && Array.isArray(parsed.questions)) {
            generatedQuestions = parsed.questions.filter(
              (q: any) => q.text && q.options && Array.isArray(q.options) && q.options.length >= 2 && typeof q.correctAnswer === 'number'
            )
          }
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
      }
    }

    // Fallback to question bank if AI fails or produces no valid questions
    if (generatedQuestions.length === 0) {
      const sectorQuestions = QUESTION_BANKS[vacancy.sector] || QUESTION_BANKS.GENERAL
      // Pick random questions from the bank (up to 8)
      const shuffled = [...sectorQuestions].sort(() => Math.random() - 0.5)
      generatedQuestions = shuffled.slice(0, 8)
    }

    if (generatedQuestions.length === 0) {
      return NextResponse.json({ error: 'No se pudieron generar preguntas' }, { status: 500 })
    }

    // Get the max order of existing questions
    const existingQuestions = await db.vacancyQuestion.findMany({
      where: { vacancyId: id },
      orderBy: { order: 'desc' },
      take: 1,
    })
    const maxOrder = existingQuestions.length > 0 ? existingQuestions[0].order : 0

    // Create the questions in the database
    const createdQuestions = []
    for (let i = 0; i < generatedQuestions.length; i++) {
      const q = generatedQuestions[i]
      const question = await db.vacancyQuestion.create({
        data: {
          text: q.text,
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          order: maxOrder + i + 1,
          vacancyId: id,
        },
      })
      createdQuestions.push({
        id: question.id,
        text: question.text,
        type: question.type,
        options: JSON.parse(question.options || '[]'),
        correctAnswer: question.correctAnswer,
        order: question.order,
      })
    }

    return NextResponse.json({
      questions: createdQuestions,
      count: createdQuestions.length,
    }, { status: 201 })
  } catch (error) {
    console.error('Error generating questions:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Error generando preguntas', details: errorMessage }, { status: 500 })
  }
}
