import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// SCORING ALGORITHM
// ============================================

function calculateLikertScore(value: number, reverseScored: boolean): number {
  const v = Math.max(1, Math.min(5, value))
  return reverseScored ? 6 - v : v
}

function normalizeBigFive(avgScore: number): number {
  return ((avgScore - 1) / 4) * 100
}

function normalizePsychological(avgScore: number): number {
  return ((avgScore - 1) / 4) * 100
}

function calculateScores(
  responses: Array<{ question: { category: string; type: string; reverseScored: boolean; options: string | null; correctAnswer: number | null }; numericValue: number | null; value: string }>,
  positionCategory: string,
  hasKnowledgeTest: boolean
) {
  // Group responses by category
  const bigFiveCategories = ['OPENNESS', 'CONSCIENTIOUSNESS', 'EXTRAVERSION', 'AGREEABLENESS', 'NEUROTICISM']
  const psychCategories = ['STRESS', 'EMPATHY', 'ADAPTABILITY', 'LEADERSHIP', 'TEAMWORK']

  const categoryScores: Record<string, number[]> = {}

  for (const resp of responses) {
    const cat = resp.question.category
    if (!categoryScores[cat]) categoryScores[cat] = []

    if (resp.question.type === 'LIKERT') {
      const val = resp.numericValue || parseInt(resp.value, 10) || 3
      const score = calculateLikertScore(val, resp.question.reverseScored)
      categoryScores[cat].push(score)
    } else if (resp.question.type === 'MULTIPLE_CHOICE') {
      // For knowledge questions, track correctness via value (selected option index)
      categoryScores[cat].push(parseInt(resp.value, 10))
    }
  }

  // Big Five scores (normalized 0-100)
  const bigFiveScores: Record<string, number> = {}
  let bigFiveSum = 0
  let bigFiveCount = 0

  for (const cat of bigFiveCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      let normalized = normalizeBigFive(avg)
      // NEUROTICISM is already handled via reverseScored in the questions
      // So we don't invert it again here for Big Five
      bigFiveScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
    } else {
      bigFiveScores[cat] = 0
    }
    bigFiveSum += bigFiveScores[cat]
    bigFiveCount++
  }

  const avgBigFive = bigFiveCount > 0 ? bigFiveSum / bigFiveCount : 0

  // Psychological scores (normalized 0-100)
  const psychScores: Record<string, number> = {}
  let psychSum = 0
  let psychCount = 0

  for (const cat of psychCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      let normalized = normalizePsychological(avg)
      // STRESS and NEUROTICISM are inverted for psychological
      if (cat === 'STRESS') {
        normalized = 100 - normalized
      }
      psychScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
    } else {
      psychScores[cat] = 0
    }
    psychSum += psychScores[cat]
    psychCount++
  }

  const avgPsychological = psychCount > 0 ? psychSum / psychCount : 0

  // Knowledge score
  let knowledgeScore: number | null = null
  if (hasKnowledgeTest) {
    const knowledgeResponses = responses.filter((r) => r.question.category === 'KNOWLEDGE' && r.question.type === 'MULTIPLE_CHOICE')
    if (knowledgeResponses.length > 0) {
      let correct = 0
      for (const resp of knowledgeResponses) {
        const selectedIdx = parseInt(resp.value, 10)
        // Use correctAnswer field (0-based index of correct option)
        // If correctAnswer is not set, default to 0 (first option is correct - legacy)
        const correctIdx = resp.question.correctAnswer ?? 0
        if (selectedIdx === correctIdx) {
          correct++
        }
      }
      knowledgeScore = Math.round((correct / knowledgeResponses.length) * 100 * 100) / 100
    }
  }

  // Overall score (unified weights: 30/30/40 with knowledge, 50/50 without)
  let overallScore: number
  if (hasKnowledgeTest && knowledgeScore !== null) {
    overallScore = 0.30 * avgBigFive + 0.30 * avgPsychological + 0.40 * knowledgeScore
  } else {
    overallScore = 0.50 * avgBigFive + 0.50 * avgPsychological
  }

  // Recommendation (unified thresholds: ≥70 APTO, ≥50 ENTREVISTA, <50 NO_RECOMENDADO)
  let recommendation: string
  if (overallScore >= 70) {
    recommendation = 'APTO'
  } else if (overallScore >= 50) {
    recommendation = 'ENTREVISTA_ADICIONAL'
  } else {
    recommendation = 'NO_RECOMENDADO'
  }

  // Service roles special rules (MESERO, BARTENDER, VENDEDOR)
  const serviceRoles = ['MESERO', 'BARTENDER', 'VENDEDOR']
  if (serviceRoles.includes(positionCategory)) {
    if (psychScores['EMPATHY'] < 40 && psychScores['TEAMWORK'] < 40) {
      recommendation = 'NO_RECOMENDADO'
    }
  }

  // High stress rule
  if (psychScores['STRESS'] > 80) {
    if (recommendation === 'APTO') {
      recommendation = 'ENTREVISTA_ADICIONAL'
    }
  }

  // Generate summary
  const summary = generateSummary(bigFiveScores, psychScores, knowledgeScore, overallScore, recommendation)

  return {
    openness: bigFiveScores['OPENNESS'] || 0,
    conscientiousness: bigFiveScores['CONSCIENTIOUSNESS'] || 0,
    extraversion: bigFiveScores['EXTRAVERSION'] || 0,
    agreeableness: bigFiveScores['AGREEABLENESS'] || 0,
    neuroticism: bigFiveScores['NEUROTICISM'] || 0,
    stressLevel: psychScores['STRESS'] || 0,
    empathy: psychScores['EMPATHY'] || 0,
    adaptability: psychScores['ADAPTABILITY'] || 0,
    leadership: psychScores['LEADERSHIP'] || 0,
    teamwork: psychScores['TEAMWORK'] || 0,
    knowledgeScore,
    overallScore: Math.round(overallScore * 100) / 100,
    recommendation,
    summary,
  }
}

function generateSummary(
  bigFive: Record<string, number>,
  psych: Record<string, number>,
  knowledgeScore: number | null,
  overallScore: number,
  recommendation: string
): string {
  const parts: string[] = []

  // Big Five highlights
  if (bigFive['EXTRAVERSION'] >= 70) parts.push('alta extraversión')
  if (bigFive['CONSCIENTIOUSNESS'] >= 70) parts.push('alta responsabilidad')
  if (bigFive['OPENNESS'] >= 70) parts.push('alta apertura a la experiencia')
  if (bigFive['AGREEABLENESS'] >= 70) parts.push('alta amabilidad')

  // Psychological highlights
  if (psych['EMPATHY'] >= 70) parts.push('buena empatía')
  if (psych['TEAMWORK'] >= 70) parts.push('buen trabajo en equipo')
  if (psych['ADAPTABILITY'] >= 70) parts.push('buena adaptabilidad')
  if (psych['LEADERSHIP'] >= 70) parts.push('buen liderazgo')

  // Concerns
  const concerns: string[] = []
  if (psych['STRESS'] > 60) concerns.push('nivel de estrés elevado')
  if (bigFive['NEUROTICISM'] > 60) concerns.push('alto neuroticismo')
  if (psych['EMPATHY'] < 40) concerns.push('baja empatía')
  if (psych['TEAMWORK'] < 40) concerns.push('bajo trabajo en equipo')
  if (psych['ADAPTABILITY'] < 40) concerns.push('baja adaptabilidad')

  let summary = ''
  if (parts.length > 0) {
    summary += `Candidato con ${parts.join(', ')}. `
  }
  if (concerns.length > 0) {
    summary += `Se detectaron ${concerns.join(', ')}. `
  }
  if (knowledgeScore !== null) {
    if (knowledgeScore >= 70) {
      summary += 'Conocimientos técnicos sólidos. '
    } else if (knowledgeScore >= 50) {
      summary += 'Conocimientos técnicos aceptables. '
    } else {
      summary += 'Conocimientos técnicos por debajo de lo esperado. '
    }
  }

  if (recommendation === 'APTO') {
    summary += 'Recomendado para el puesto.'
  } else if (recommendation === 'ENTREVISTA_ADICIONAL') {
    summary += 'Se recomienda entrevista adicional para evaluar áreas de oportunidad.'
  } else {
    summary += 'No se recomienda para el puesto.'
  }

  return summary
}

// ============================================
// API ROUTE HANDLERS
// ============================================

export async function GET(req: NextRequest) {
  try {
    const positionId = req.nextUrl.searchParams.get('positionId')
    const sessionId = req.nextUrl.searchParams.get('sessionId')
    const candidateId = req.nextUrl.searchParams.get('candidateId')

    if (candidateId) {
      // Get evaluation sessions for a candidate
      const sessions = await db.evaluationSession.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'desc' },
        include: {
          position: {
            select: { id: true, title: true, category: true, sector: true },
          },
        },
      })

      // Also get all available positions for the candidate to apply
      const candidate = await db.user.findUnique({
        where: { id: candidateId },
        select: { companyId: true },
      })

      let availablePositions: any[] = []
      // Show positions from ALL companies so candidates can apply to any available role
      availablePositions = await db.position.findMany({
        where: { active: true },
        orderBy: [{ sector: 'asc' }, { title: 'asc' }],
        include: {
          company: {
            select: { id: true, name: true, sector: true },
          },
          evaluationTemplates: {
            select: {
              id: true,
              type: true,
              _count: { select: { questions: true } },
            },
            orderBy: { order: 'asc' },
          },
        },
      })

      // Determine which positions the candidate hasn't applied to yet
      const appliedPositionIds = sessions.map(s => s.positionId)
      const newPositions = availablePositions.filter(p => !appliedPositionIds.includes(p.id))
      const completedSessions = sessions.filter(s => s.status === 'COMPLETED')
      const activeSession = sessions.find(s => s.status === 'IN_PROGRESS' || s.status === 'NOT_STARTED')

      return NextResponse.json({
        sessions,
        activeSession: activeSession || null,
        completedSessions,
        availablePositions: newPositions,
      })
    }

    if (positionId) {
      // Return evaluation templates and questions for a position
      const templates = await db.evaluationTemplate.findMany({
        where: { positionId, active: true },
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      })

      // Parse options JSON strings into arrays
      const parseOptions = (options: string | null | undefined): string[] | undefined => {
        if (!options) return undefined
        try {
          const parsed = JSON.parse(options)
          return Array.isArray(parsed) ? parsed : undefined
        } catch {
          return undefined
        }
      }

      return NextResponse.json({
        templates: templates.map((t) => ({
          id: t.id,
          name: t.name,
          type: t.type,
          order: t.order,
          questions: t.questions.map((q) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            options: parseOptions(q.options),
            category: q.category,
            order: q.order,
            reverseScored: q.reverseScored,
            isCustom: q.isCustom,
            correctAnswer: q.correctAnswer,
          })),
          questionCount: t.questions.length,
        })),
      })
    }

    if (sessionId) {
      // Return current session state
      const session = await db.evaluationSession.findUnique({
        where: { id: sessionId },
        include: {
          position: true,
          responses: {
            include: {
              question: true,
            },
          },
        },
      })

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      // Get templates for the position ordered by step
      const templates = await db.evaluationTemplate.findMany({
        where: { positionId: session.positionId, active: true },
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      })

      // Helper to parse options JSON string into array
      const parseOptions = (options: string | null | undefined): string[] | undefined => {
        if (!options) return undefined
        try {
          const parsed = JSON.parse(options)
          return Array.isArray(parsed) ? parsed : undefined
        } catch {
          return undefined
        }
      }

      // Serialize templates with parsed options
      const serializedTemplates = templates.map((t) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        order: t.order,
        questions: t.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: parseOptions(q.options),
          category: q.category,
          order: q.order,
          reverseScored: q.reverseScored,
          isCustom: q.isCustom,
          correctAnswer: q.correctAnswer,
        })),
        questionCount: t.questions.length,
      }))

      // Current step template (1-indexed: step 1 = first template, etc.)
      const currentTemplateIndex = session.currentStep - 1
      const currentTemplate = serializedTemplates[currentTemplateIndex] || null

      return NextResponse.json({
        session: {
          id: session.id,
          status: session.status,
          currentStep: session.currentStep,
          currentQuestionIndex: session.currentQuestionIndex,
          startedAt: session.startedAt,
          completedAt: session.completedAt,
          candidateId: session.candidateId,
          positionId: session.positionId,
          positionTitle: session.position?.title || '',
          companyId: session.companyId,
        },
        currentTemplate,
        templates: serializedTemplates,
        answeredCount: session.responses.length,
      })
    }

    return NextResponse.json({ error: 'positionId or sessionId is required' }, { status: 400 })
  } catch (error) {
    console.error('Evaluations GET error:', error)
    return NextResponse.json({ error: 'Error fetching evaluation data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, action } = body

    // ============================================
    // CREATE-SESSION: Candidate creates a new evaluation session for a position
    // ============================================
    if (action === 'create-session') {
      const { candidateId, positionId } = body

      if (!candidateId || !positionId) {
        return NextResponse.json({ error: 'candidateId and positionId are required' }, { status: 400 })
      }

      // Verify position exists
      const position = await db.position.findUnique({
        where: { id: positionId },
        include: { company: true },
      })

      if (!position) {
        return NextResponse.json({ error: 'Position not found' }, { status: 404 })
      }

      // Check if candidate already has an active session for this position
      const existingSession = await db.evaluationSession.findFirst({
        where: {
          candidateId,
          positionId,
          status: { in: ['NOT_STARTED', 'IN_PROGRESS'] },
        },
      })

      if (existingSession) {
        return NextResponse.json({
          error: 'Ya tienes una evaluación activa para este puesto',
          session: existingSession,
        }, { status: 400 })
      }

      // Create new session
      const session = await db.evaluationSession.create({
        data: {
          candidateId,
          positionId,
          companyId: position.companyId,
          status: 'NOT_STARTED',
        },
        include: {
          position: {
            select: { id: true, title: true, category: true },
          },
        },
      })

      return NextResponse.json({
        session: {
          id: session.id,
          status: session.status,
          currentStep: session.currentStep,
          currentQuestionIndex: session.currentQuestionIndex,
          candidateId: session.candidateId,
          positionId: session.positionId,
          positionTitle: session.position?.title || '',
          companyId: session.companyId,
        },
        message: 'Session created',
      }, { status: 201 })
    }

    if (!sessionId || !action) {
      return NextResponse.json({ error: 'sessionId and action are required' }, { status: 400 })
    }

    const session = await db.evaluationSession.findUnique({
      where: { id: sessionId },
      include: {
        position: true,
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // ============================================
    // START: Set session to IN_PROGRESS
    // ============================================
    if (action === 'start') {
      if (session.status === 'COMPLETED') {
        return NextResponse.json({ error: 'Session already completed' }, { status: 400 })
      }

      const updatedSession = await db.evaluationSession.update({
        where: { id: sessionId },
        data: {
          status: 'IN_PROGRESS',
          startedAt: session.startedAt || new Date(),
          currentStep: 1,
          currentQuestionIndex: 0,
        },
      })

      // Get first template questions
      const templates = await db.evaluationTemplate.findMany({
        where: { positionId: session.positionId, active: true },
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      })

      // Helper to parse options JSON string into array
      const parseOptions = (options: string | null | undefined): string[] | undefined => {
        if (!options) return undefined
        try {
          const parsed = JSON.parse(options)
          return Array.isArray(parsed) ? parsed : undefined
        } catch {
          return undefined
        }
      }

      // Serialize templates with parsed options
      const serializedTemplates = templates.map((t) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        order: t.order,
        questions: t.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: parseOptions(q.options),
          category: q.category,
          order: q.order,
          reverseScored: q.reverseScored,
          isCustom: q.isCustom,
          correctAnswer: q.correctAnswer,
        })),
        questionCount: t.questions.length,
      }))

      return NextResponse.json({
        session: updatedSession,
        templates: serializedTemplates,
        currentTemplate: serializedTemplates[0] || null,
        message: 'Evaluation started',
      })
    }

    // ============================================
    // ANSWER: Save answer for current question
    // ============================================
    if (action === 'answer') {
      const { questionId, value, numericValue } = body

      if (!questionId || value === undefined) {
        return NextResponse.json({ error: 'questionId and value are required' }, { status: 400 })
      }

      // Upsert the response
      const response = await db.evaluationResponse.upsert({
        where: {
          sessionId_questionId: {
            sessionId,
            questionId,
          },
        },
        update: {
          value: String(value),
          numericValue: numericValue || null,
        },
        create: {
          sessionId,
          questionId,
          value: String(value),
          numericValue: numericValue || null,
        },
      })

      // Update current question index
      await db.evaluationSession.update({
        where: { id: sessionId },
        data: {
          currentQuestionIndex: session.currentQuestionIndex + 1,
        },
      })

      return NextResponse.json({
        response,
        message: 'Answer saved',
      })
    }

    // ============================================
    // NEXT-STEP: Move to next evaluation step
    // ============================================
    if (action === 'next-step') {
      if (session.status !== 'IN_PROGRESS') {
        return NextResponse.json({ error: 'Session is not in progress' }, { status: 400 })
      }

      const templates = await db.evaluationTemplate.findMany({
        where: { positionId: session.positionId, active: true },
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      })

      // Helper to parse options JSON string into array
      const parseOptions = (options: string | null | undefined): string[] | undefined => {
        if (!options) return undefined
        try {
          const parsed = JSON.parse(options)
          return Array.isArray(parsed) ? parsed : undefined
        } catch {
          return undefined
        }
      }

      // Serialize templates with parsed options
      const serializedTemplates = templates.map((t) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        order: t.order,
        questions: t.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: parseOptions(q.options),
          category: q.category,
          order: q.order,
          reverseScored: q.reverseScored,
          isCustom: q.isCustom,
          correctAnswer: q.correctAnswer,
        })),
        questionCount: t.questions.length,
      }))

      const nextStep = session.currentStep + 1

      // If there's no next step, auto-complete
      if (nextStep > templates.length) {
        // Complete the evaluation
        return await completeEvaluation(session, session.position)
      }

      const updatedSession = await db.evaluationSession.update({
        where: { id: sessionId },
        data: {
          currentStep: nextStep,
          currentQuestionIndex: 0,
        },
      })

      return NextResponse.json({
        session: updatedSession,
        currentTemplate: serializedTemplates[nextStep - 1] || null,
        message: `Moved to step ${nextStep}`,
      })
    }

    // ============================================
    // COMPLETE: Calculate scores and create result
    // ============================================
    if (action === 'complete') {
      if (session.status === 'COMPLETED') {
        return NextResponse.json({ error: 'Session already completed' }, { status: 400 })
      }

      return await completeEvaluation(session, session.position)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Evaluations POST error:', error)
    return NextResponse.json({ error: 'Error processing evaluation', details: String(error) }, { status: 500 })
  }
}

async function completeEvaluation(
  session: Awaited<ReturnType<typeof db.evaluationSession.findUnique>> & { position: NonNullable<Awaited<ReturnType<typeof db.evaluationSession.findUnique>>['position']> },
  position: { id: string; title: string; category: string; hasKnowledgeTest: boolean }
) {
  // Get all responses for this session
  const responses = await db.evaluationResponse.findMany({
    where: { sessionId: session!.id },
    include: {
      question: true,
    },
  })

  // Calculate scores
  const scores = calculateScores(
    responses.map((r) => ({
      question: {
        category: r.question.category,
        type: r.question.type,
        reverseScored: r.question.reverseScored,
        options: r.question.options,
        correctAnswer: r.question.correctAnswer,
      },
      numericValue: r.numericValue,
      value: r.value,
    })),
    position.category,
    position.hasKnowledgeTest
  )

  // Get candidate info
  const candidate = await db.user.findUnique({
    where: { id: session!.candidateId },
  })

  // Create or update result
  const result = await db.evaluationResult.upsert({
    where: { sessionId: session!.id },
    update: {
      ...scores,
      candidateName: candidate?.name || 'Unknown',
      positionTitle: position.title,
    },
    create: {
      sessionId: session!.id,
      candidateId: session!.candidateId,
      candidateName: candidate?.name || 'Unknown',
      positionId: position.id,
      positionTitle: position.title,
      companyId: session!.companyId,
      ...scores,
    },
  })

  // Update session to COMPLETED
  const updatedSession = await db.evaluationSession.update({
    where: { id: session!.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  })

  return NextResponse.json({
    session: updatedSession,
    result,
    message: 'Evaluation completed',
  })
}
