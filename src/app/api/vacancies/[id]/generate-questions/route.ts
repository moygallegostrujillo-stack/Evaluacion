import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// ============================================
// POST - Generate knowledge questions with AI
// ============================================

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

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
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
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    // Parse the AI response
    let generatedQuestions: Array<{
      text: string
      options: string[]
      correctAnswer: number
    }> = []

    try {
      // Try to extract JSON from the response (it might have markdown formatting)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
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
      return NextResponse.json({ error: 'Error processing generated questions' }, { status: 500 })
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
