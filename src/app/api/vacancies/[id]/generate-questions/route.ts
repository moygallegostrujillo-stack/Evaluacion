import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

// ============================================
// POSITION-SPECIFIC QUESTION BANKS
// Keyed by keyword matches in position title
// ============================================

const POSITION_QUESTION_BANKS: Array<{
  keywords: string[]
  questions: Array<{
    text: string
    options: string[]
    correctAnswer: number
  }>
}> = [
  // CAJERO / CASHIER
  {
    keywords: ['cajero', 'cajera', 'cashier', 'caja', 'cobrador', 'cobradora', 'tesorero'],
    questions: [
      { text: '¿Cuál es el procedimiento correcto al recibir un billete de alta denominación?', options: ['Guardarlo inmediatamente sin verificar', 'Verificar su autenticidad y announce en voz alta el valor recibido', 'Rechazarlo siempre', 'Dar el cambio sin revisar'], correctAnswer: 1 },
      { text: '¿Qué debe hacer un cajero si la cantidad en caja no coincide al hacer el arqueo?', options: ['Ignorar la diferencia si es pequeña', 'Reportar inmediatamente al supervisor y buscar el error', 'Ajustar la cifra mentalmente', 'Cerrar la caja sin reportar'], correctAnswer: 1 },
      { text: '¿Cuál es la forma correcta de entregar el cambio al cliente?', options: ['Contar el cambio rápidamente y entregarlo', 'Contar el cambio en voz alta, entregar primero las monedas y luego los billetes', 'Dejar el cambio en el mostrador', 'Entregar el cambio sin contar en voz alta'], correctAnswer: 1 },
      { text: '¿Qué acción debe tomar el cajero al detectar un billete sospechoso de falso?', options: ['Aceptarlo para no incomodar al cliente', 'Retenerlo discretamente, llamar al supervisor y no devolverlo al cliente', 'Devolverlo al cliente sin decir nada', 'Llamar a la policía inmediatamente frente al cliente'], correctAnswer: 1 },
      { text: '¿Cuál es el procedimiento correcto al procesar una devolución?', options: ['Devolver el dinero sin verificar', 'Solicitar ticket/folio de compra, verificar el producto y seguir la política de devoluciones', 'Rechazar toda devolución', 'Aceptar sin preguntar'], correctAnswer: 1 },
      { text: '¿Qué significa "arqueo de caja"?', options: ['Limpiar la caja registradora', 'Contar y verificar que el dinero en caja coincida con las operaciones del turno', 'Cambiar la combinación de la caja', 'Cerrar la caja al final del día'], correctAnswer: 1 },
      { text: '¿Cómo debe manejar el cajero una transacción con tarjeta declinada?', options: ['Insistir al cliente que intente varias veces', 'Informar al cliente discretamente, sugerir otra forma de pago y no hacer comentarios sobre su cuenta', 'Anunciar en voz alta que la tarjeta fue rechazada', 'Rechazar la venta completamente'], correctAnswer: 1 },
      { text: '¿Qué es un "vale de caja" y cuándo se utiliza?', options: ['Un descuento especial para clientes VIP', 'Un documento para registrar salidas de dinero de la caja por gastos menores autorizados', 'Un recibo de compra', 'Una reserva de efectivo'], correctAnswer: 1 },
    ]
  },
  // MESERO / WAITER
  {
    keywords: ['mesero', 'mesera', 'waiter', 'camarero', 'camarera', 'servidor', 'servidora'],
    questions: [
      { text: '¿Cuál es el orden correcto para servir los platillos en una mesa?', options: ['No importa el orden', 'Acomodar de afuera hacia adentro: ensaladas/entradas primero, luego fuerte y postre', 'Servir todo al mismo tiempo', 'Servir primero el platillo más caro'], correctAnswer: 1 },
      { text: '¿Qué debe hacer un mesero si un cliente reporta una alergia alimentaria?', options: ['Ignorar la solicitud', 'Informar inmediatamente a cocina y verificar los ingredientes del platillo', 'Sugerir otro platillo sin verificar', 'Decir que no hay ingredientes alergénicos'], correctAnswer: 1 },
      { text: '¿Cuál es la temperatura mínima interna segura para cocinar pollo?', options: ['55°C', '63°C', '74°C', '85°C'], correctAnswer: 2 },
      { text: '¿Cuánto tiempo máximo pueden permanecer alimentos perecederos a temperatura ambiente?', options: ['1 hora', '2 horas', '4 horas', '8 horas'], correctAnswer: 1 },
      { text: '¿Cuál es la forma correcta de cargar una bandeja con platillos calientes?', options: ['Con una mano para mayor velocidad', 'Con ambas manos, distribuyendo el peso equilibradamente', 'Sobre el hombro', 'Con los platillos apilados sin orden'], correctAnswer: 1 },
      { text: '¿Qué documento es obligatorio para trabajar en la preparación de alimentos en México?', options: ['Pasaporte', 'Carta de antecedentes no penales', 'Constancia de manejo higiénico de alimentos', 'Título universitario'], correctAnswer: 2 },
      { text: '¿Cómo debe manejarse una queja de un cliente insatisfecho con su comida?', options: ['Discutir con el cliente', 'Escuchar atentamente, disculparse, ofrecer una solución y notificar a cocina', 'Ignorar la queja', 'Decirle que no se puede hacer nada'], correctAnswer: 1 },
      { text: '¿Qué es el "mise en place" en un restaurante?', options: ['El menú del día', 'La preparación y organización de todos los ingredientes y herramientas antes del servicio', 'El horario de los empleados', 'La decoración del restaurante'], correctAnswer: 1 },
    ]
  },
  // COCINERO / CHEF
  {
    keywords: ['cocinero', 'cocinera', 'chef', 'cook', 'preparador', 'kitchen'],
    questions: [
      { text: '¿Cuál es la temperatura mínima interna segura para cocinar carne de res molida?', options: ['55°C', '63°C', '71°C', '82°C'], correctAnswer: 2 },
      { text: '¿Qué significa la sigla FIFO en el manejo de alimentos?', options: ['First In First Out (Primero en entrar, primero en salir)', 'Fast In Fast Out', 'Fresh Ingredients First Order', 'Food In Food Out'], correctAnswer: 0 },
      { text: '¿Cuál es la regla básica de higiene al manipular alimentos?', options: ['Lavarse las manos solo al inicio del turno', 'Usar guantes en todo momento', 'Lavarse las manos frecuentemente y después de cada interrupción', 'No es necesario si se usa cubrebocas'], correctAnswer: 2 },
      { text: '¿Qué es la "contaminación cruzada" y cómo se previene?', options: ['Mezclar sabores; se previene cocinando más tiempo', 'Transferencia de bacterias de un alimento a otro; se previene separando alimentos crudos y cocidos', 'El sobrecocimiento; se previene usando menos fuego', 'No existe realmente'], correctAnswer: 1 },
      { text: '¿Cuál es la temperatura segura de refrigeración para alimentos perecederos?', options: ['10°C o menos', '5°C o menos', '0°C exactamente', '15°C o menos'], correctAnswer: 1 },
      { text: '¿Qué es un "hazard analysis" (análisis de peligros) en la cocina?', options: ['Un inventario de equipos', 'Identificación de puntos críticos de control donde los alimentos pueden contaminarse', 'Un presupuesto mensual', 'Una lista de proveedores'], correctAnswer: 1 },
    ]
  },
  // GERENTE / MANAGER
  {
    keywords: ['gerente', 'manager', 'director', 'supervisor', 'encargado', 'jefe'],
    questions: [
      { text: '¿Cuál es la primera acción que debe tomar un gerente ante un conflicto entre empleados?', options: ['Despedir a uno de los involucrados', 'Escuchar ambas partes de forma individual e imparcial', 'Ignorar el conflicto para ver si se resuelve solo', 'Tomar el lado del empleado con más antigüedad'], correctAnswer: 1 },
      { text: '¿Qué es el KPI y para qué sirve en la gestión?', options: ['Un tipo de software contable', 'Key Performance Indicator - mide el desempeño hacia objetivos específicos', 'Un formato de reporte', 'Un método de contratación'], correctAnswer: 1 },
      { text: '¿Cuál es la mejor práctica para delegar tareas al equipo?', options: ['Dar instrucciones vagas para que sean creativos', 'Comunicar claramente la tarea, el resultado esperado, la fecha límite y los recursos disponibles', 'Solo pasar la tarea sin contexto', 'Delegar todo el trabajo y no hacer seguimiento'], correctAnswer: 1 },
      { text: '¿Qué debe incluir un programa efectivo de inducción para nuevos empleados?', options: ['Solo el tour del local', 'Presentación de la empresa, políticas, capacitación en el puesto, presentación con el equipo y un mentor', 'Solo firmar documentos', 'Nada, aprenderán sobre la marcha'], correctAnswer: 1 },
      { text: '¿Cómo se calcula la rotación de personal?', options: ['Total de empleados / 100', '(Empleados que renunciaron en el período / Promedio de empleados) × 100', 'No se puede calcular', 'Salarios pagados / total empleados'], correctAnswer: 1 },
    ]
  },
  // BARISTA
  {
    keywords: ['barista', 'cafeteria', 'café', 'bartender', 'barman'],
    questions: [
      { text: '¿Cuál es la temperatura ideal de extracción para un espresso?', options: ['70°C', '80°C', '92-96°C', '100°C'], correctAnswer: 2 },
      { text: '¿Qué es el "crema" en un espresso?', options: ['La taza donde se sirve', 'La capa dorada de emulsión que se forma sobre el espresso bien extraído', 'Un tipo de leche', 'Un saborizante'], correctAnswer: 1 },
      { text: '¿Cuál es la proporción estándar de leche vaporizada para un capuccino?', options: ['1/3 espresso, 1/3 leche, 1/3 espuma', '50% espresso, 50% leche', 'Solo espresso con un toque de leche', '2/3 leche, 1/3 espresso'], correctAnswer: 0 },
      { text: '¿Qué indica que la leche fue vaporizada correctamente?', options: ['Tiene burbujas grandes y visibles', 'Tiene una textura sedosa y microespuma brillante sin burbujas grandes', 'Está hirviendo', 'No hay diferencia con leche fría'], correctAnswer: 1 },
      { text: '¿Cuál es la vida útil recomendada para granos de café recién tostados?', options: ['1 semana', '2-4 semanas en empaque sellado', '6 meses', '1 año'], correctAnswer: 1 },
    ]
  },
  // VENDEDOR / SALES
  {
    keywords: ['vendedor', 'vendedora', 'sales', 'asociado', 'promotor', 'promotora', 'ejecutivo de ventas'],
    questions: [
      { text: '¿Cuál es la técnica de venta más efectiva para conocer las necesidades del cliente?', options: ['Hablar ininterrumpidamente del producto', 'Hacer preguntas abiertas y escuchar activamente', 'Ofrecer el producto más caro primero', 'Presionar para cerrar la venta rápido'], correctAnswer: 1 },
      { text: '¿Qué es el "upselling" en ventas?', options: ['Vender un producto más barato', 'Ofrecer un producto o servicio de mayor valor al que el cliente está considerando', 'Regalar productos para fidelizar', 'Reducir el precio para cerrar la venta'], correctAnswer: 1 },
      { text: '¿Qué es el "cross-selling" o venta cruzada?', options: ['Vender productos de la competencia', 'Ofrecer productos complementarios al que el cliente ya va a comprar', 'Vender solo un producto por cliente', 'Intercambiar productos entre tiendas'], correctAnswer: 1 },
      { text: '¿Cuál es la regla del "3 metros" en atención al cliente?', options: ['Mantener 3 metros de distancia del cliente', 'Reconocer y saludar al cliente cuando está a 3 metros de distancia', 'Solo atender clientes que estén a 3 metros', 'Volver a saludar cada 3 minutos'], correctAnswer: 1 },
      { text: '¿Cómo se debe manejar un cliente que quiere devolver un producto sin ticket?', options: ['Negarse rotundamente', 'Seguir la política de la tienda y buscar alternativas como verificación de compra', 'Intercambiar sin preguntas', 'Ignorar al cliente'], correctAnswer: 1 },
      { text: '¿Cuál es la técnica adecuada para manejar objeciones de precio?', options: ['Bajar el precio inmediatamente', 'Demostrar el valor y beneficios del producto frente al precio', 'Insistir en que es el mejor precio', 'Ignorar la objeción'], correctAnswer: 1 },
    ]
  },
  // RECEPCIONISTA / RECEPTIONIST
  {
    keywords: ['recepcionista', 'recepcion', 'hostess', 'anfitriona', 'anfitrión', 'conserje'],
    questions: [
      { text: '¿Cuál es el principio más importante en la recepción de clientes?', options: ['Atender rápido sin saludar', 'Dar la bienvenida con una sonrisa, contacto visual y saludo personalizado', 'Solo señalar hacia donde deben ir', 'Pedir que esperen sin explicar'], correctAnswer: 1 },
      { text: '¿Qué información debe verificar la recepcionista al registrar a un huésped/cliente?', options: ['Solo el nombre', 'Identificación, datos de contacto, motivo de visita y datos de pago si aplica', 'Nada, solo asignar un número', 'Solo el teléfono'], correctAnswer: 1 },
      { text: '¿Cómo debe manejar la recepcionista una queja del cliente?', options: ['Decirle que no es su departamento', 'Escuchar atentamente, ofrecer disculpas, buscar solución o escalar al área correspondiente', 'Ignorar la queja', 'Discutir con el cliente'], correctAnswer: 1 },
      { text: '¿Qué es importante al manejar llamadas telefónicas profesionales?', options: ['Contener la respiración y no hablar', 'Contenerse', 'Contestar pronto, identificarse, hablar claramente y tomar notas', 'Transferir inmediatamente sin escuchar'], correctAnswer: 2 },
    ]
  },
  // RECURSOS HUMANOS
  {
    keywords: ['recursos humanos', 'rh', 'hr', 'capital humano', 'reclutador', 'talento'],
    questions: [
      { text: '¿Qué es la NOM-035 y cómo afecta a las empresas en México?', options: ['Una norma de seguridad industrial', 'Norma que establece mecanismos para identificar, analizar y prevenir factores de riesgo psicosocial en el trabajo', 'Un reglamento de contabilidad', 'Una norma ambiental'], correctAnswer: 1 },
      { text: '¿Cuál es el proceso correcto para una entrevista estructurada?', options: ['Preguntar lo que venga a la mente', 'Seguir una guía de preguntas predefinidas y evaluar con la misma escala todos los candidatos', 'Solo hacer preguntas sobre salario', 'Dejar que el candidato hable libremente sin preguntas'], correctAnswer: 1 },
      { text: '¿Qué indica un alto índice de rotación de personal?', options: ['Que la empresa es muy exitosa', 'Problemas potenciales en clima laboral, compensación, procesos de selección o desarrollo', 'Que los empleados son muy demandados', 'No significa nada importante'], correctAnswer: 1 },
      { text: '¿Qué es el onboarding y por qué es importante?', options: ['Un proceso de despido', 'Proceso de integración del nuevo empleado que reduce rotación y acelera productividad', 'Un tipo de evaluación de desempeño', 'No es importante'], correctAnswer: 1 },
    ]
  },
]

// Generic sector banks as last fallback
const SECTOR_QUESTION_BANKS: Record<string, Array<{
  text: string
  options: string[]
  correctAnswer: number
}>> = {
  RESTAURANT: [
    { text: '¿Cuál es la temperatura mínima interna segura para cocinar pollo?', options: ['55°C', '63°C', '74°C', '85°C'], correctAnswer: 2 },
    { text: '¿Qué debe hacer un empleado si un cliente reporta una alergia alimentaria?', options: ['Ignorar la solicitud', 'Informar inmediatamente a cocina y verificar ingredientes', 'Sugerir otro platillo sin verificar', 'Decir que no hay ingredientes alergénicos'], correctAnswer: 1 },
    { text: '¿Cuál es la regla básica de higiene al manipular alimentos?', options: ['Lavarse las manos solo al inicio del turno', 'Usar guantes en todo momento', 'Lavarse las manos frecuentemente y después de cada interrupción', 'No es necesario si se usa cubrebocas'], correctAnswer: 2 },
    { text: '¿Qué significa la sigla FIFO en el manejo de inventarios?', options: ['First In First Out (Primero en entrar, primero en salir)', 'Fast In Fast Out', 'Fresh Ingredients First Order', 'Food In Food Out'], correctAnswer: 0 },
    { text: '¿Cómo debe manejarse una queja de un cliente insatisfecho?', options: ['Discutir con el cliente', 'Escuchar activamente, disculparse y buscar solución', 'Ignorar la queja', 'Decirle que no se puede hacer nada'], correctAnswer: 1 },
    { text: '¿Cuánto tiempo máximo pueden permanecer alimentos perecederos a temperatura ambiente?', options: ['1 hora', '2 horas', '4 horas', '8 horas'], correctAnswer: 1 },
  ],
  RETAIL: [
    { text: '¿Cuál es la técnica más efectiva para conocer las necesidades del cliente?', options: ['Hablar ininterrumpidamente del producto', 'Hacer preguntas abiertas y escuchar activamente', 'Ofrecer el producto más caro primero', 'Presionar para cerrar la venta rápido'], correctAnswer: 1 },
    { text: '¿Qué es el "upselling" en ventas?', options: ['Vender un producto más barato', 'Ofrecer un producto o servicio de mayor valor', 'Regalar productos para fidelizar', 'Reducir el precio para cerrar la venta'], correctAnswer: 1 },
    { text: '¿Cómo se debe manejar una devolución sin ticket?', options: ['Negarse rotundamente', 'Seguir la política de la tienda y buscar alternativas', 'Intercambiar sin preguntas', 'Ignorar al cliente'], correctAnswer: 1 },
    { text: '¿Qué es la "rotación de inventario"?', options: ['Cambiar de lugar los productos', 'La velocidad con que se venden y reponen los productos', 'Girar los productos en el anaquel', 'Desechar productos viejos'], correctAnswer: 1 },
    { text: '¿Cuál es la mejor manera de cerrar una venta?', options: ['Presionar al cliente', 'Resumir beneficios y preguntar por la decisión de compra', 'Dar el precio final sin más explicación', 'Decirle que es su última oportunidad'], correctAnswer: 1 },
  ],
  SERVICIOS: [
    { text: '¿Cuál es el principio más importante en la atención al cliente?', options: ['Velocidad sobre calidad', 'Empatía y escucha activa', 'Siempre dar la razón al cliente', 'Minimizar los problemas del cliente'], correctAnswer: 1 },
    { text: '¿Qué es un SLA (Service Level Agreement)?', options: ['Un tipo de software', 'Acuerdo de nivel de servicio entre proveedor y cliente', 'Un método de pago', 'Un formato de queja'], correctAnswer: 1 },
    { text: '¿Qué es la "recuperación de servicio"?', options: ['Cobrar doble por un servicio fallido', 'El proceso para convertir una experiencia negativa en positiva', 'Repetir el servicio sin costo siempre', 'Ignorar las quejas del cliente'], correctAnswer: 1 },
    { text: '¿Qué debe hacer primero al recibir una queja del cliente?', options: ['Explicar por qué no es culpa de la empresa', 'Escuchar sin interrumpir y validar los sentimientos del cliente', 'Transferir la queja a otro departamento', 'Pedir disculpas sin escuchar el problema'], correctAnswer: 1 },
  ],
  GENERAL: [
    { text: '¿Cuál es la comunicación más efectiva en el entorno laboral?', options: ['Comunicación pasiva', 'Comunicación asertiva', 'Comunicación agresiva', 'Evitar la comunicación'], correctAnswer: 1 },
    { text: '¿Qué es el trabajo en equipo?', options: ['Cada quien hace lo suyo independientemente', 'Colaboración coordinada hacia un objetivo común', 'Solo trabajar en grupo físico', 'Delegar todo el trabajo a otros'], correctAnswer: 1 },
    { text: '¿Cómo se debe manejar un conflicto con un compañero de trabajo?', options: ['Ignorarlo hasta que desaparezca', 'Hablar directamente con la persona de forma respetuosa', 'Quejarse con otros compañeros', 'Reportar inmediatamente al jefe sin intentar resolverlo'], correctAnswer: 1 },
    { text: '¿Qué es la puntualidad en el trabajo?', options: ['Llegar cuando se pueda', 'Llegar a la hora acordada o antes', 'Llegar 15 minutos tarde es aceptable', 'No importa la hora mientras se termine el trabajo'], correctAnswer: 1 },
    { text: '¿Qué significa tener iniciativa en el trabajo?', options: ['Hacer solo lo que te piden', 'Proponer soluciones y tomar acción proactivamente', 'Cambiar procesos sin consultar', 'Trabajar horas extras siempre'], correctAnswer: 1 },
  ],
}

// ============================================
// Find best matching question bank
// ============================================

function findRelevantQuestions(positionTitle: string, sector: string): Array<{
  text: string
  options: string[]
  correctAnswer: number
}> {
  const titleLower = positionTitle.toLowerCase()

  // 1. Try to match by position title keywords (most specific)
  for (const bank of POSITION_QUESTION_BANKS) {
    if (bank.keywords.some(kw => titleLower.includes(kw))) {
      // Shuffle and return up to 8
      const shuffled = [...bank.questions].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 8)
    }
  }

  // 2. Fall back to sector-specific bank
  const sectorBank = SECTOR_QUESTION_BANKS[sector]
  if (sectorBank) {
    const shuffled = [...sectorBank].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 8)
  }

  // 3. Last resort: general bank
  const shuffled = [...SECTOR_QUESTION_BANKS.GENERAL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 8)
}

// ============================================
// AI Integration via z-ai-web-dev-sdk
// ============================================

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

async function callAI(messages: ChatMessage[]): Promise<string | null> {
  // Method 1: Try z-ai-web-dev-sdk (reads config from /etc/.z-ai-config or .z-ai-config)
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const client = new ZAI()
    const response = await client.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })
    return response.choices?.[0]?.message?.content || null
  } catch (sdkError) {
    console.log('z-ai-web-dev-sdk not available, trying env vars...')
  }

  // Method 2: Try env vars (for Vercel deployment)
  const baseUrl = process.env.ZAI_BASE_URL
  const apiKey = process.env.ZAI_API_KEY

  if (!baseUrl || !apiKey) {
    return null // AI not available, use fallback
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Z-AI-From': 'Z',
    }
    const chatId = process.env.ZAI_CHAT_ID
    const userId = process.env.ZAI_USER_ID
    const token = process.env.ZAI_TOKEN
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

// ============================================
// POST - Generate knowledge questions
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const { id } = await params

    const vacancy = await rlsDb.vacancy.findUnique({
      where: { id },
      include: { company: true, questions: { select: { id: true } } },
    })

    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 })
    }

    if (auth.role !== 'SUPER_ADMIN' && vacancy.companyId !== auth.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sectorLabels: Record<string, string> = {
      RESTAURANT: 'restaurante / food service',
      RETAIL: 'retail / tienda / ventas',
      SERVICIOS: 'servicios profesionales',
      GENERAL: 'general',
      OTRO: 'otro',
    }

    let generatedQuestions: Array<{
      text: string
      options: string[]
      correctAnswer: number
    }> = []

    const sectorDescription = sectorLabels[vacancy.sector] || vacancy.sector

    // Try AI first with a much more specific prompt
    const aiResponse = await callAI([
      {
        role: 'assistant',
        content: `Eres un experto en recursos humanos de México que crea exámenes de conocimiento técnico específicos para cada puesto de trabajo.

REGLAS IMPORTANTES:
1. Las preguntas deben ser ESPECÍFICAS y TÉCNICAS para el puesto exacto mencionado, NO genéricas del sector.
2. Si el puesto es "Cajero", las preguntas deben ser sobre manejo de efectivo, arqueo de caja, detección de billetes falsos, POS, devoluciones, etc. NO sobre ventas o upselling.
3. Si el puesto es "Mesero", las preguntas deben ser sobre servicio en mesa, higiene alimentaria, manejo de bandejas, etc.
4. Las preguntas deben ser PRÁCTICAS y evaluar conocimientos que un candidato realmente necesita para desempeñar bien ese puesto específico.
5. Genera entre 6 y 10 preguntas.
6. Cada pregunta tiene 4 opciones y solo una es correcta.
7. Responde SOLO con JSON válido, sin texto adicional antes o después.

Formato exacto:
{"questions": [{"text": "pregunta", "options": ["opción A", "opción B", "opción C", "opción D"], "correctAnswer": 0}]}`
      },
      {
        role: 'user',
        content: `Genera preguntas de conocimiento ESPECÍFICAS para el puesto de: "${vacancy.title}"

Sector de la empresa: ${sectorDescription}
Empresa: ${vacancy.company.name}
${vacancy.description ? `Descripción de la vacante: ${vacancy.description}` : ''}

IMPORTANTE: Las preguntas deben ser específicas para "${vacancy.title}", no preguntas genéricas del sector. Piensa en las tareas diarias, conocimientos técnicos y habilidades que alguien en este puesto NECESITA saber para hacer bien su trabajo.`
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

    // Fallback: use position-specific question banks
    if (generatedQuestions.length === 0) {
      generatedQuestions = findRelevantQuestions(vacancy.title, vacancy.sector)
    }

    if (generatedQuestions.length === 0) {
      return NextResponse.json({ error: 'No se pudieron generar preguntas' }, { status: 500 })
    }

    // Get the max order of existing questions
    const existingQuestions = await rlsDb.vacancyQuestion.findMany({
      where: { vacancyId: id },
      orderBy: { order: 'desc' },
      take: 1,
    })
    const maxOrder = existingQuestions.length > 0 ? existingQuestions[0].order : 0

    // Create the questions in the database
    const createdQuestions: any[] = []
    for (let i = 0; i < generatedQuestions.length; i++) {
      const q = generatedQuestions[i]
      const question = await rlsDb.vacancyQuestion.create({
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
