import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// POST - Generate knowledge questions with AI
// ============================================

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

async function callAI(messages: ChatMessage[]): Promise<string> {
  const baseUrl = process.env.ZAI_BASE_URL
  const apiKey = process.env.ZAI_API_KEY
  const chatId = process.env.ZAI_CHAT_ID
  const userId = process.env.ZAI_USER_ID
  const token = process.env.ZAI_TOKEN

  if (!baseUrl || !apiKey) {
    throw new Error('AI API no configurada. Se requieren ZAI_BASE_URL y ZAI_API_KEY.')
  }

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
    const errorBody = await response.text()
    throw new Error(`AI API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
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

    // Generate questions using AI
    const sectorLabels: Record<string, string> = {
      RESTAURANT: 'restaurante/food service',
      RETAIL: 'retail/ventas',
      SERVICIOS: 'servicios',
      GENERAL: 'general',
      OTRO: 'otro',
    }

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

    if (!aiResponse) {
      return NextResponse.json({ error: 'AI no generó respuesta' }, { status: 500 })
    }

    // Parse the AI response
    let generatedQuestions: Array<{
      text: string
      options: string[]
      correctAnswer: number
    }> = []

    try {
      // Try to extract JSON from the response (it might have markdown formatting)
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
      return NextResponse.json({ error: 'Error procesando las preguntas generadas' }, { status: 500 })
    }

    if (generatedQuestions.length === 0) {
      return NextResponse.json({ error: 'No se pudieron generar preguntas válidas' }, { status: 500 })
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
