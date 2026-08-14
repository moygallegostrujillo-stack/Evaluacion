import { NextRequest, NextResponse } from 'next/server'
import { createRLSClient, getUnscopedClient } from '@/lib/rls'
import { getAuthFromHeaders } from '@/lib/auth'

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
        if (resp.question.correctAnswer !== null && selectedIdx === resp.question.correctAnswer) {
          correct++
        }
      }
      knowledgeScore = Math.round((correct / knowledgeResponses.length) * 100)
    }
  }

  // Overall score calculation
  let overallScore: number
  if (knowledgeScore !== null) {
    overallScore = 0.30 * avgBigFive + 0.30 * avgPsychological + 0.40 * knowledgeScore
  } else {
    overallScore = 0.50 * avgBigFive + 0.50 * avgPsychological
  }

  // Recommendation
  let recommendation: 'APTO' | 'ENTREVISTA_ADICIONAL' | 'NO_RECOMENDADO'
  if (overallScore >= 70) {
    recommendation = 'APTO'
  } else if (overallScore >= 50) {
    recommendation = 'ENTREVISTA_ADICIONAL'
  } else {
    recommendation = 'NO_RECOMENDADO'
  }

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
    summary: generateSummary(
      bigFiveScores, psychScores, knowledgeScore, recommendation
    ),
  }
}

function generateSummary(
  bigFiveScores: Record<string, number>,
  psychScores: Record<string, number>,
  knowledgeScore: number | null,
  recommendation: string
): string {
  const strengths: string[] = []
  const concerns: string[] = []

  if (bigFiveScores['EXTRAVERSION'] >= 70) strengths.push('alta extraversión')
  if (bigFiveScores['CONSCIENTIOUSNESS'] >= 70) strengths.push('alta responsabilidad')
  if (bigFiveScores['OPENNESS'] >= 70) strengths.push('alta apertura a la experiencia')
  if (bigFiveScores['AGREEABLENESS'] >= 70) strengths.push('alta amabilidad')
  if (psychScores['EMPATHY'] >= 70) strengths.push('buena empatía')
  if (psychScores['TEAMWORK'] >= 70) strengths.push('buen trabajo en equipo')
  if (psychScores['ADAPTABILITY'] >= 70) strengths.push('buena adaptabilidad')
  if (psychScores['LEADERSHIP'] >= 70) strengths.push('buen liderazgo')

  if (psychScores['STRESS'] < 40) concerns.push('baja tolerancia al estrés')
  if (bigFiveScores['NEUROTICISM'] >= 70) concerns.push('alto neuroticismo')
  if (psychScores['EMPATHY'] < 40) concerns.push('baja empatía')
  if (psychScores['TEAMWORK'] < 40) concerns.push('bajo trabajo en equipo')
  if (psychScores['ADAPTABILITY'] < 40) concerns.push('baja adaptabilidad')

  let summary = ''
  if (strengths.length > 0) summary += `Candidato con ${strengths.join(', ')}. `
  if (concerns.length > 0) summary += `Se detectaron ${concerns.join(', ')}. `
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
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)

    // For CANDIDATO role, force candidateId to auth.userId (can only access own evaluations)
    const positionId = req.nextUrl.searchParams.get('positionId')
    const sessionId = req.nextUrl.searchParams.get('sessionId')
    const candidateId = auth.role === 'CANDIDATO' ? auth.userId : req.nextUrl.searchParams.get('candidateId')

    if (candidateId) {
      // Get evaluation sessions for a candidate
      // RLS auto-filters by companyId for non-SUPER_ADMIN/CANDIDATO
      const sessions = await rlsDb.evaluationSession.findMany({
        where: {
          candidateId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          position: {
            select: { id: true, title: true, category: true, sector: true },
          },
        },
      })

      // Also get all available positions for the candidate to apply
      // CANDIDATO needs to see positions from ALL companies, so use unscoped client
      let availablePositions: any[] = []
      if (auth.role === 'CANDIDATO') {
        // Show positions from ALL companies so candidates can apply to any available role
        availablePositions = await getUnscopedClient().position.findMany({
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
      } else {
        // Non-CANDIDATO: use RLS-scoped client (filtered by companyId)
        availablePositions = await rlsDb.position.findMany({
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
      }

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
      // Defense-in-depth: verify position belongs to user's company (unless SUPER_ADMIN)
      // RLS already filters, but we check explicitly for a clear 403 response
      if (auth.role !== 'SUPER_ADMIN') {
        const position = await rlsDb.position.findUnique({
          where: { id: positionId },
          select: { companyId: true },
        })
        if (!position || position.companyId !== auth.companyId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }

      // Return evaluation templates and questions for a position
      const templates = await rlsDb.evaluationTemplate.findMany({
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
      const session = await rlsDb.evaluationSession.findUnique({
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

      // Ownership check: verify the authenticated user can access this session
      // RLS already filters by companyId, but we check candidateId explicitly
      if (auth.role === 'CANDIDATO') {
        if (session.candidateId !== auth.userId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      } else if (auth.role !== 'SUPER_ADMIN') {
        if (session.companyId !== auth.companyId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }

      // Get templates for the position ordered by step
      const templates = await rlsDb.evaluationTemplate.findMany({
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
    const auth = getAuthFromHeaders(req.headers)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client: rlsDb } = createRLSClient(auth)
    const unscopedDb = getUnscopedClient()

    const body = await req.json()
    const { sessionId, action } = body

    // For CANDIDATO role, force candidateId to auth.userId
    const deriveCandidateId = (bodyCandidateId?: string) =>
      auth.role === 'CANDIDATO' ? auth.userId : (bodyCandidateId || auth.userId)

    // ============================================
    // CREATE-SESSION: Candidate creates a new evaluation session for a position
    // ============================================
    if (action === 'create-session') {
      const candidateId = deriveCandidateId(body.candidateId)
      const { positionId } = body

      if (!candidateId || !positionId) {
        return NextResponse.json({ error: 'candidateId and positionId are required' }, { status: 400 })
      }

      // Verify position exists (use unscoped so CANDIDATO can apply to any company's position)
      const position = await unscopedDb.position.findUnique({
        where: { id: positionId },
        include: { company: true },
      })

      if (!position) {
        return NextResponse.json({ error: 'Position not found' }, { status: 404 })
      }

      // Check if candidate already has an active session for this position
      const existingSession = await rlsDb.evaluationSession.findFirst({
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

      // Create new session — companyId from position
      const session = await rlsDb.evaluationSession.create({
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

    const session = await rlsDb.evaluationSession.findUnique({
      where: { id: sessionId },
      include: {
        position: true,
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Ownership check: verify the authenticated user can modify this session
    // RLS already filters by companyId, but we check candidateId explicitly
    if (auth.role === 'CANDIDATO') {
      if (session.candidateId !== auth.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (auth.role !== 'SUPER_ADMIN') {
      if (session.companyId !== auth.companyId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // ============================================
    // START: Set session to IN_PROGRESS
    // ============================================
    if (action === 'start') {
      if (session.status === 'COMPLETED') {
        return NextResponse.json({ error: 'Session already completed' }, { status: 400 })
      }

      const updatedSession = await rlsDb.evaluationSession.update({
        where: { id: sessionId },
        data: {
          status: 'IN_PROGRESS',
          startedAt: session.startedAt || new Date(),
          currentStep: 1,
          currentQuestionIndex: 0,
        },
      })

      // Get first template questions
      const templates = await rlsDb.evaluationTemplate.findMany({
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
      const response = await rlsDb.evaluationResponse.upsert({
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
      await rlsDb.evaluationSession.update({
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

      const templates = await rlsDb.evaluationTemplate.findMany({
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
        return await completeEvaluation(rlsDb, session, { id: session.position.id, title: session.position.title, category: session.position.category, hasKnowledgeTest: session.position.hasKnowledgeTest })
      }

      const updatedSession = await rlsDb.evaluationSession.update({
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

      return await completeEvaluation(rlsDb, session, { id: session.position.id, title: session.position.title, category: session.position.category, hasKnowledgeTest: session.position.hasKnowledgeTest })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Evaluations POST error:', error)
    return NextResponse.json({ error: 'Error processing evaluation', details: String(error) }, { status: 500 })
  }
}

async function completeEvaluation(
  rlsDb: ReturnType<typeof createRLSClient>['client'],
  session: any,
  position: { id: string; title: string; category: string; hasKnowledgeTest: boolean }
) {
  // Get all responses for this session
  const responses = await rlsDb.evaluationResponse.findMany({
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
  const candidate = await rlsDb.user.findUnique({
    where: { id: session!.candidateId },
  })

  // Create or update result — companyId from session
  const result = await rlsDb.evaluationResult.upsert({
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
  const updatedSession = await rlsDb.evaluationSession.update({
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
