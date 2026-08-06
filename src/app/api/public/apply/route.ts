import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// SCORING ALGORITHM (same as evaluations/route.ts)
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

interface ScoredResponse {
  section: string
  category: string
  type: string
  reverseScored: boolean
  numericValue: number | null
  value: string
  correctAnswer: number | null
}

function calculateScores(responses: ScoredResponse[]) {
  const bigFiveCategories = ['OPENNESS', 'CONSCIENTIOUSNESS', 'EXTRAVERSION', 'AGREEABLENESS', 'NEUROTICISM']
  const psychCategories = ['STRESS', 'EMPATHY', 'ADAPTABILITY', 'LEADERSHIP', 'TEAMWORK']

  const categoryScores: Record<string, number[]> = {}

  for (const resp of responses) {
    const cat = resp.category
    if (!cat) continue
    if (!categoryScores[cat]) categoryScores[cat] = []

    if (resp.type === 'LIKERT') {
      const val = resp.numericValue || parseInt(resp.value, 10) || 3
      const score = calculateLikertScore(val, resp.reverseScored)
      categoryScores[cat].push(score)
    } else if (resp.type === 'MULTIPLE_CHOICE') {
      categoryScores[cat].push(parseInt(resp.value, 10))
    }
  }

  // Big Five scores (normalized 0-100)
  const bigFiveScores: Record<string, number> = {}
  for (const cat of bigFiveCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      const normalized = normalizeBigFive(avg)
      bigFiveScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
    } else {
      bigFiveScores[cat] = 0
    }
  }

  // For psicometrica average: average of (100 - neuroticism), openness, conscientiousness, extraversion, agreeableness
  const psicometricaAvg =
    (100 - bigFiveScores['NEUROTICISM'] +
      bigFiveScores['OPENNESS'] +
      bigFiveScores['CONSCIENTIOUSNESS'] +
      bigFiveScores['EXTRAVERSION'] +
      bigFiveScores['AGREEABLENESS']) / 5

  // Psychological scores (normalized 0-100)
  const psychScores: Record<string, number> = {}
  for (const cat of psychCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      let normalized = normalizePsychological(avg)
      // STRESS is inverted for psychological
      if (cat === 'STRESS') {
        normalized = 100 - normalized
      }
      psychScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
    } else {
      psychScores[cat] = 0
    }
  }

  const psicologicaAvg =
    psychCategories.reduce((sum, cat) => sum + psychScores[cat], 0) / psychCategories.length

  // Knowledge score
  const knowledgeResponses = responses.filter(
    (r) => r.category === 'KNOWLEDGE' && r.type === 'MULTIPLE_CHOICE'
  )
  let knowledgeScore: number | null = null
  if (knowledgeResponses.length > 0) {
    let correct = 0
    for (const resp of knowledgeResponses) {
      const selectedIdx = parseInt(resp.value, 10)
      const correctIdx = resp.correctAnswer ?? 0
      if (selectedIdx === correctIdx) {
        correct++
      }
    }
    knowledgeScore = Math.round((correct / knowledgeResponses.length) * 100 * 100) / 100
  }

  // Overall: 30% psicometrica + 30% psicologica + 40% conocimientos
  let overallScore: number
  if (knowledgeScore !== null) {
    overallScore = 0.30 * psicometricaAvg + 0.30 * psicologicaAvg + 0.40 * knowledgeScore
  } else {
    overallScore = 0.50 * psicometricaAvg + 0.50 * psicologicaAvg
  }

  // Recommendation
  let recommendation: string
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
    psicometricaAvg: Math.round(psicometricaAvg * 100) / 100,
    psicologicaAvg: Math.round(psicologicaAvg * 100) / 100,
  }
}

// ============================================
// HARDCODED QUESTIONS (fallback if no templates)
// ============================================

const HARDCODED_BIG_FIVE = [
  { id: 'hw-bf-1', text: 'Disfruto probar nuevas formas de hacer las cosas en el trabajo', category: 'OPENNESS', type: 'LIKERT', reverseScored: false, order: 1 },
  { id: 'hw-bf-2', text: 'Me considero una persona creativa e imaginativa', category: 'OPENNESS', type: 'LIKERT', reverseScored: false, order: 2 },
  { id: 'hw-bf-3', text: 'Siempre organizo mis tareas antes de empezar a trabajar', category: 'CONSCIENTIOUSNESS', type: 'LIKERT', reverseScored: false, order: 3 },
  { id: 'hw-bf-4', text: 'Cuando me propongo algo, lo completo sin importar los obstáculos', category: 'CONSCIENTIOUSNESS', type: 'LIKERT', reverseScored: false, order: 4 },
  { id: 'hw-bf-5', text: 'Me siento cómodo/a iniciando conversaciones con personas que no conozco', category: 'EXTRAVERSION', type: 'LIKERT', reverseScored: false, order: 5 },
  { id: 'hw-bf-6', text: 'Disfruto trabajar en equipo más que de forma individual', category: 'EXTRAVERSION', type: 'LIKERT', reverseScored: false, order: 6 },
  { id: 'hw-bf-7', text: 'Me preocupa que mis compañeros de trabajo se sientan bien', category: 'AGREEABLENESS', type: 'LIKERT', reverseScored: false, order: 7 },
  { id: 'hw-bf-8', text: 'Prefiero llegar a un acuerdo que ganar una discusión', category: 'AGREEABLENESS', type: 'LIKERT', reverseScored: false, order: 8 },
  { id: 'hw-bf-9', text: 'Me estreso fácilmente cuando tengo mucho trabajo por hacer', category: 'NEUROTICISM', type: 'LIKERT', reverseScored: true, order: 9 },
  { id: 'hw-bf-10', text: 'Me cuesta controlar mis emociones cuando algo sale mal', category: 'NEUROTICISM', type: 'LIKERT', reverseScored: true, order: 10 },
]

const HARDCODED_PSYCHOLOGICAL = [
  { id: 'hw-ps-1', text: 'Me siento abrumado/a cuando tengo múltiples tareas pendientes', category: 'STRESS', type: 'LIKERT', reverseScored: true, order: 1 },
  { id: 'hw-ps-2', text: 'Me cuesta desconectar del trabajo después de mi jornada', category: 'STRESS', type: 'LIKERT', reverseScored: true, order: 2 },
  { id: 'hw-ps-3', text: 'Puedo entender cómo se sienten mis compañeros aunque no lo digan', category: 'EMPATHY', type: 'LIKERT', reverseScored: false, order: 3 },
  { id: 'hw-ps-4', text: 'Me resulta fácil ponerme en el lugar del cliente cuando tiene un problema', category: 'EMPATHY', type: 'LIKERT', reverseScored: false, order: 4 },
  { id: 'hw-ps-5', text: 'Me adapto rápidamente a cambios en mi rutina de trabajo', category: 'ADAPTABILITY', type: 'LIKERT', reverseScored: false, order: 5 },
  { id: 'hw-ps-6', text: 'Cuando cambian las reglas o procedimientos, me ajusto sin problema', category: 'ADAPTABILITY', type: 'LIKERT', reverseScored: false, order: 6 },
  { id: 'hw-ps-7', text: 'Cuando hay un problema, suelo tomar la iniciativa para resolverlo', category: 'LEADERSHIP', type: 'LIKERT', reverseScored: false, order: 7 },
  { id: 'hw-ps-8', text: 'Mis compañeros me piden ayuda para organizar el trabajo', category: 'LEADERSHIP', type: 'LIKERT', reverseScored: false, order: 8 },
  { id: 'hw-ps-9', text: 'Prefiero colaborar con otros para alcanzar una meta que hacerlo solo/a', category: 'TEAMWORK', type: 'LIKERT', reverseScored: false, order: 9 },
  { id: 'hw-ps-10', text: 'Escucho y respeto las opiniones de mis compañeros aunque no esté de acuerdo', category: 'TEAMWORK', type: 'LIKERT', reverseScored: false, order: 10 },
]

// ============================================
// HELPER: Get system questions for a company's vacancy
// ============================================

async function getSystemQuestions(companyId: string) {
  // Find any Position belonging to the vacancy's company
  const position = await db.position.findFirst({
    where: { companyId },
    include: {
      evaluationTemplates: {
        where: { type: { in: ['PSICOMETRICA', 'PSICOLOGICA', 'CONOCIMIENTOS'] } },
        include: { questions: true },
      },
    },
  })

  let bigFiveQuestions: Array<{
    id: string
    text: string
    category: string
    type: string
    reverseScored: boolean
    order: number
  }> = []
  let psychologicalQuestions: Array<{
    id: string
    text: string
    category: string
    type: string
    reverseScored: boolean
    order: number
  }> = []
  let knowledgeQuestions: Array<{
    id: string
    text: string
    category: string
    type: string
    options: string | null
    correctAnswer: number | null
    order: number
  }> = []

  if (position) {
    const psicometricaTemplate = position.evaluationTemplates.find(
      (t) => t.type === 'PSICOMETRICA'
    )
    const psicologicaTemplate = position.evaluationTemplates.find(
      (t) => t.type === 'PSICOLOGICA'
    )
    const conocimientosTemplate = position.evaluationTemplates.find(
      (t) => t.type === 'CONOCIMIENTOS'
    )

    if (psicometricaTemplate) {
      bigFiveQuestions = psicometricaTemplate.questions.map((q) => ({
        id: q.id,
        text: q.text,
        category: q.category,
        type: q.type,
        reverseScored: q.reverseScored,
        order: q.order,
      }))
    }

    if (psicologicaTemplate) {
      psychologicalQuestions = psicologicaTemplate.questions.map((q) => ({
        id: q.id,
        text: q.text,
        category: q.category,
        type: q.type,
        reverseScored: q.reverseScored,
        order: q.order,
      }))
    }

    if (conocimientosTemplate) {
      knowledgeQuestions = conocimientosTemplate.questions.map((q) => ({
        id: q.id,
        text: q.text,
        category: q.category,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        order: q.order,
      }))
    }
  }

  // Fallback to hardcoded if no templates found
  if (bigFiveQuestions.length === 0) {
    bigFiveQuestions = HARDCODED_BIG_FIVE
  }
  if (psychologicalQuestions.length === 0) {
    psychologicalQuestions = HARDCODED_PSYCHOLOGICAL
  }

  return { bigFiveQuestions, psychologicalQuestions, knowledgeQuestions }
}

// ============================================
// HELPER: Calculate step scores for a completed step
// ============================================

async function calculateStepScores(
  applicationId: string,
  completedStep: number,
  vacancyId: string,
  companyId: string
) {
  const vacancy = await db.vacancy.findUnique({
    where: { id: vacancyId },
    include: { questions: { orderBy: { order: 'asc' } } },
  })
  if (!vacancy) return null

  const responses = await db.vacancyApplicationResponse.findMany({
    where: { applicationId },
    include: { vacancyQuestion: true },
  })

  if (completedStep === 1) {
    // Psicometrica - Big Five
    const systemQuestions = await getSystemQuestions(companyId)
    const bigFiveIds = new Set(systemQuestions.bigFiveQuestions.map((q) => q.id))

    const psicometricaResponses = responses.filter((r) => r.section.toUpperCase() === 'PSICOMETRICA')

    const scoredResponses: ScoredResponse[] = psicometricaResponses.map((r) => {
      // Find the question metadata
      const systemQ = systemQuestions.bigFiveQuestions.find((q) => q.id === r.questionId)
      return {
        section: r.section,
        category: systemQ?.category || 'OPENNESS',
        type: systemQ?.type || 'LIKERT',
        reverseScored: systemQ?.reverseScored || false,
        numericValue: r.numericValue,
        value: r.value,
        correctAnswer: null,
      }
    })

    const scores = calculateScores(scoredResponses)
    return {
      openness: scores.openness,
      conscientiousness: scores.conscientiousness,
      extraversion: scores.extraversion,
      agreeableness: scores.agreeableness,
      neuroticism: scores.neuroticism,
    }
  }

  if (completedStep === 2) {
    // Psicologica
    const systemQuestions = await getSystemQuestions(companyId)

    const psicologicaResponses = responses.filter((r) => r.section.toUpperCase() === 'PSICOLOGICA')

    const scoredResponses: ScoredResponse[] = psicologicaResponses.map((r) => {
      const systemQ = systemQuestions.psychologicalQuestions.find((q) => q.id === r.questionId)
      return {
        section: r.section,
        category: systemQ?.category || 'EMPATHY',
        type: systemQ?.type || 'LIKERT',
        reverseScored: systemQ?.reverseScored || false,
        numericValue: r.numericValue,
        value: r.value,
        correctAnswer: null,
      }
    })

    const scores = calculateScores(scoredResponses)
    return {
      stressLevel: scores.stressLevel,
      empathy: scores.empathy,
      adaptability: scores.adaptability,
      leadership: scores.leadership,
      teamwork: scores.teamwork,
    }
  }

  if (completedStep === 3) {
    // Conocimientos - handle both VacancyQuestion and system Question responses
    const knowledgeResponses = responses.filter((r) => r.section.toUpperCase() === 'CONOCIMIENTOS')

    // Get system questions to find correct answers for template-based questions
    const systemQuestions = await getSystemQuestions(companyId)
    const systemKnowledgeMap = new Map(
      systemQuestions.knowledgeQuestions.map((q) => [q.id, q])
    )

    let correct = 0
    for (const resp of knowledgeResponses) {
      const selectedIdx = parseInt(resp.value, 10)
      // Check VacancyQuestion first, then fall back to system Question
      const correctIdx = resp.vacancyQuestion?.correctAnswer
        ?? systemKnowledgeMap.get(resp.questionId ?? '')?.correctAnswer
        ?? 0
      if (selectedIdx === correctIdx) {
        correct++
      }
    }

    const knowledgeScore =
      knowledgeResponses.length > 0
        ? Math.round((correct / knowledgeResponses.length) * 100 * 100) / 100
        : null

    return { knowledgeScore }
  }

  return null
}

// ============================================
// HELPER: Calculate overall score and recommendation
// ============================================

async function calculateOverallScore(applicationId: string) {
  const application = await db.vacancyApplication.findUnique({
    where: { id: applicationId },
  })
  if (!application) return null

  // Psicometrica average: average of (100 - neuroticism), openness, conscientiousness, extraversion, agreeableness
  const psicometricaAvg =
    (100 - application.neuroticism +
      application.openness +
      application.conscientiousness +
      application.extraversion +
      application.agreeableness) / 5

  // Psicologica average
  const psicologicaAvg =
    (application.stressLevel +
      application.empathy +
      application.adaptability +
      application.leadership +
      application.teamwork) / 5

  // Overall: 30% psicometrica + 30% psicologica + 40% conocimientos
  let overallScore: number
  if (application.knowledgeScore !== null) {
    overallScore = 0.30 * psicometricaAvg + 0.30 * psicologicaAvg + 0.40 * application.knowledgeScore
  } else {
    overallScore = 0.50 * psicometricaAvg + 0.50 * psicologicaAvg
  }

  let recommendation: string
  if (overallScore >= 70) {
    recommendation = 'APTO'
  } else if (overallScore >= 50) {
    recommendation = 'ENTREVISTA_ADICIONAL'
  } else {
    recommendation = 'NO_RECOMENDADO'
  }

  // Generate summary
  const summary = generateSummary(application, overallScore, recommendation)

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    recommendation,
    summary,
  }
}

function generateSummary(
  app: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
    stressLevel: number
    empathy: number
    adaptability: number
    leadership: number
    teamwork: number
    knowledgeScore: number | null
  },
  overallScore: number,
  recommendation: string
): string {
  const parts: string[] = []
  const concerns: string[] = []

  if (app.extraversion >= 70) parts.push('alta extraversión')
  if (app.conscientiousness >= 70) parts.push('alta responsabilidad')
  if (app.openness >= 70) parts.push('alta apertura a la experiencia')
  if (app.agreeableness >= 70) parts.push('alta amabilidad')
  if (app.empathy >= 70) parts.push('buena empatía')
  if (app.teamwork >= 70) parts.push('buen trabajo en equipo')
  if (app.adaptability >= 70) parts.push('buena adaptabilidad')
  if (app.leadership >= 70) parts.push('buen liderazgo')

  if (app.stressLevel > 60) concerns.push('nivel de estrés elevado')
  if (app.neuroticism > 60) concerns.push('alto neuroticismo')
  if (app.empathy < 40) concerns.push('baja empatía')
  if (app.teamwork < 40) concerns.push('bajo trabajo en equipo')
  if (app.adaptability < 40) concerns.push('baja adaptabilidad')

  let summary = ''
  if (parts.length > 0) {
    summary += `Candidato con ${parts.join(', ')}. `
  }
  if (concerns.length > 0) {
    summary += `Se detectaron ${concerns.join(', ')}. `
  }

  if (app.knowledgeScore !== null) {
    if (app.knowledgeScore >= 80) {
      summary += `Excelente dominio de conocimientos técnicos (${app.knowledgeScore}%). `
    } else if (app.knowledgeScore >= 60) {
      summary += `Conocimientos técnicos aceptables (${app.knowledgeScore}%). `
    } else {
      summary += `Conocimientos técnicos por debajo del estándar (${app.knowledgeScore}%). `
    }
  }

  summary += `Puntuación general: ${Math.round(overallScore)}. Recomendación: ${recommendation === 'APTO' ? 'Apto' : recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista adicional' : 'No recomendado'}.`

  return summary
}

// ============================================
// GET - Resume application
// ============================================

export async function GET(req: NextRequest) {
  try {
    const applicationId = req.nextUrl.searchParams.get('applicationId')

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })
    }

    const application = await db.vacancyApplication.findUnique({
      where: { id: applicationId },
      include: {
        vacancy: {
          include: {
            company: true,
            questions: { orderBy: { order: 'asc' } },
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const currentStep = application.currentStep
    const vacancy = application.vacancy

    // Step 0: data entry (no questions needed)
    if (currentStep === 0) {
      return NextResponse.json({
        step: 0,
        stepName: 'data',
        applicationId: application.id,
        candidateName: application.candidateName,
        candidateEmail: application.candidateEmail,
        candidatePhone: application.candidatePhone,
        candidateAge: application.candidateAge,
      })
    }

    // Step 1: psicometrica (Big Five from system questions)
    if (currentStep === 1 && vacancy.includePsicometrica) {
      const systemQuestions = await getSystemQuestions(vacancy.companyId)
      return NextResponse.json({
        step: 1,
        stepName: 'psicometrica',
        applicationId: application.id,
        questions: systemQuestions.bigFiveQuestions.map((q) => ({
          id: q.id,
          questionId: q.id,  // Include questionId so frontend can pass it back for proper upsert
          text: q.text,
          type: q.type,
          category: q.category,
          reverseScored: q.reverseScored,
          order: q.order,
          options: [
            'Totalmente en desacuerdo',
            'En desacuerdo',
            'Neutral',
            'De acuerdo',
            'Totalmente de acuerdo',
          ],
        })),
      })
    }

    // Step 2: psicologica
    if (currentStep === 2 && vacancy.includePsicologica) {
      const systemQuestions = await getSystemQuestions(vacancy.companyId)
      return NextResponse.json({
        step: 2,
        stepName: 'psicologica',
        applicationId: application.id,
        questions: systemQuestions.psychologicalQuestions.map((q) => ({
          id: q.id,
          questionId: q.id,  // Include questionId so frontend can pass it back for proper upsert
          text: q.text,
          type: q.type,
          category: q.category,
          reverseScored: q.reverseScored,
          order: q.order,
          options: [
            'Totalmente en desacuerdo',
            'En desacuerdo',
            'Neutral',
            'De acuerdo',
            'Totalmente de acuerdo',
          ],
        })),
      })
    }

    // Step 3: conocimientos (vacancy questions + position template questions)
    if (currentStep === 3) {
      const systemQuestions = await getSystemQuestions(vacancy.companyId)

      // Start with vacancy custom questions
      const allQuestions = vacancy.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options ? JSON.parse(q.options) : null,
        correctAnswer: undefined, // Don't expose correct answer to candidate
        order: q.order,
        vacancyQuestionId: q.id,
      }))

      // Add position template knowledge questions if no custom questions
      if (allQuestions.length === 0 && systemQuestions.knowledgeQuestions.length > 0) {
        for (const q of systemQuestions.knowledgeQuestions) {
          allQuestions.push({
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.options ? JSON.parse(q.options) : null,
            category: q.category,
            correctAnswer: undefined, // Don't expose correct answer to candidate
            order: q.order,
            questionId: q.id,
          })
        }
      }

      return NextResponse.json({
        step: 3,
        stepName: 'conocimientos',
        applicationId: application.id,
        questions: allQuestions,
      })
    }

    // Step 4: done (video step removed - evaluation goes directly to completion)
    if (currentStep === 4) {
      return NextResponse.json({
        step: 4,
        stepName: 'done',
        applicationId: application.id,
        status: application.status,
      })
    }

    // Step 5: done
    return NextResponse.json({
      step: 5,
      stepName: 'done',
      applicationId: application.id,
      status: application.status,
    })
  } catch (error) {
    console.error('Error resuming application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// POST - Application flow (step=data, step=answer, step=advance)
// ============================================

interface ApplyDataBody {
  step: 'data'
  vacancySlug: string
  name: string
  email: string
  phone?: string
  age?: number
}

interface ApplyAnswerBody {
  step: 'answer'
  applicationId: string
  section: string
  questionId?: string
  vacancyQuestionId?: string
  value: string
  numericValue?: number
}

interface ApplyAdvanceBody {
  step: 'advance'
  applicationId: string
  completedStep: number
}

type ApplyBody = ApplyDataBody | ApplyAnswerBody | ApplyAdvanceBody

export async function POST(req: NextRequest) {
  try {
    const body: ApplyBody = await req.json()

    // ---- step=data: Start application ----
    if (body.step === 'data') {
      const { vacancySlug, name, email, phone, age } = body as ApplyDataBody

      if (!vacancySlug || !name || !email) {
        return NextResponse.json(
          { error: 'vacancySlug, name, and email are required' },
          { status: 400 }
        )
      }

      const vacancy = await db.vacancy.findUnique({
        where: { slug: vacancySlug },
      })

      if (!vacancy || vacancy.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'Vacancy not found or not active' },
          { status: 404 }
        )
      }

      // Check if email already applied to this vacancy
      const existingApplication = await db.vacancyApplication.findFirst({
        where: {
          vacancyId: vacancy.id,
          candidateEmail: email,
        },
      })

      if (existingApplication) {
        // Resume existing application
        return NextResponse.json({
          applicationId: existingApplication.id,
          step: existingApplication.currentStep,
          resumed: true,
        })
      }

      // Determine first step
      let firstStep = 0 // data step is step 0
      // After data, check which steps are included
      // Steps: 0=data, 1=psicometrica, 2=psicologica, 3=conocimientos, 4=done (video step removed)

      const application = await db.vacancyApplication.create({
        data: {
          vacancyId: vacancy.id,
          candidateName: name,
          candidateEmail: email,
          candidatePhone: phone || null,
          candidateAge: age || null,
          status: 'IN_PROGRESS',
          currentStep: firstStep,
          startedAt: new Date(),
        },
      })

      return NextResponse.json({
        applicationId: application.id,
        step: 0,
        resumed: false,
      })
    }

    // ---- step=answer: Save answer ----
    if (body.step === 'answer') {
      const { applicationId, section, questionId, vacancyQuestionId, value, numericValue } =
        body as ApplyAnswerBody

      if (!applicationId || !section || !value) {
        return NextResponse.json(
          { error: 'applicationId, section, and value are required' },
          { status: 400 }
        )
      }

      const application = await db.vacancyApplication.findUnique({
        where: { id: applicationId },
      })

      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      // Upsert the response (in case they re-answer)
      const existingResponse = await db.vacancyApplicationResponse.findFirst({
        where: {
          applicationId,
          section,
          ...(questionId ? { questionId } : {}),
          ...(vacancyQuestionId ? { vacancyQuestionId } : {}),
        },
      })

      if (existingResponse) {
        await db.vacancyApplicationResponse.update({
          where: { id: existingResponse.id },
          data: {
            value,
            numericValue: numericValue || null,
          },
        })
      } else {
        await db.vacancyApplicationResponse.create({
          data: {
            applicationId,
            questionId: questionId || null,
            vacancyQuestionId: vacancyQuestionId || null,
            section,
            value,
            numericValue: numericValue || null,
          },
        })
      }

      return NextResponse.json({ success: true })
    }

    // ---- step=advance: Complete step and move to next ----
    if (body.step === 'advance') {
      const { applicationId, completedStep } = body as ApplyAdvanceBody

      if (!applicationId || completedStep === undefined) {
        return NextResponse.json(
          { error: 'applicationId and completedStep are required' },
          { status: 400 }
        )
      }

      const application = await db.vacancyApplication.findUnique({
        where: { id: applicationId },
        include: { vacancy: true },
      })

      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      const vacancy = application.vacancy

      // Calculate scores for the completed step
      const stepScores = await calculateStepScores(
        applicationId,
        completedStep,
        vacancy.id,
        vacancy.companyId
      )

      // Update application with step scores and advance step
      const updateData: Record<string, unknown> = {}

      if (completedStep === 1 && stepScores) {
        // Psicometrica scores
        const s = stepScores as {
          openness: number
          conscientiousness: number
          extraversion: number
          agreeableness: number
          neuroticism: number
        }
        updateData.openness = s.openness
        updateData.conscientiousness = s.conscientiousness
        updateData.extraversion = s.extraversion
        updateData.agreeableness = s.agreeableness
        updateData.neuroticism = s.neuroticism
      }

      if (completedStep === 2 && stepScores) {
        // Psicologica scores
        const s = stepScores as {
          stressLevel: number
          empathy: number
          adaptability: number
          leadership: number
          teamwork: number
        }
        updateData.stressLevel = s.stressLevel
        updateData.empathy = s.empathy
        updateData.adaptability = s.adaptability
        updateData.leadership = s.leadership
        updateData.teamwork = s.teamwork
      }

      if (completedStep === 3 && stepScores) {
        // Knowledge score
        const s = stepScores as { knowledgeScore: number | null }
        updateData.knowledgeScore = s.knowledgeScore
      }

      // Determine next step
      let nextStep = completedStep + 1
      let completed = false

      // Skip steps that are not included
      if (nextStep === 1 && !vacancy.includePsicometrica) nextStep = 2
      if (nextStep === 2 && !vacancy.includePsicologica) nextStep = 3

      // Check if there are knowledge questions (from vacancy or position template)
      if (nextStep === 3) {
        const questionCount = await db.vacancyQuestion.count({
          where: { vacancyId: vacancy.id },
        })
        if (questionCount === 0) {
          // Also check if position has CONOCIMIENTOS template questions
          const systemQuestions = await getSystemQuestions(vacancy.companyId)
          if (systemQuestions.knowledgeQuestions.length === 0) {
            nextStep = 4
          }
        }
      }

      // Skip video step (step 4) - go directly to completion
      // Step 4 is now completion (video step removed)
      if (nextStep === 4) {
        completed = true
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
        updateData.currentStep = 4
        updateData.videoType = 'SKIPPED'
        updateData.videoUrl = null

        // Calculate overall score
        const overall = await calculateOverallScore(applicationId)
        if (overall) {
          updateData.overallScore = overall.overallScore
          updateData.recommendation = overall.recommendation
          updateData.summary = overall.summary
        }
      }

      // Step 5 is also done (backward compat)
      if (nextStep >= 5) {
        completed = true
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
        updateData.currentStep = 5

        // Calculate overall score
        const overall = await calculateOverallScore(applicationId)
        if (overall) {
          updateData.overallScore = overall.overallScore
          updateData.recommendation = overall.recommendation
          updateData.summary = overall.summary
        }
      } else if (!completed) {
        updateData.currentStep = nextStep
      }

      await db.vacancyApplication.update({
        where: { id: applicationId },
        data: updateData,
      })

      // Create EvaluationResult bridge record for HR/Admin visibility when evaluation completes
      if (completed) {
        try {
          const updatedApp = await db.vacancyApplication.findUnique({
            where: { id: applicationId },
            include: { vacancy: { include: { company: true } } },
          })

          if (updatedApp && updatedApp.vacancy) {
            const companyId = updatedApp.vacancy.companyId

            // Find or create User for candidate
            let candidateUser = await db.user.findUnique({
              where: { email: updatedApp.candidateEmail },
            })

            if (!candidateUser) {
              const crypto = await import('crypto')
              candidateUser = await db.user.create({
                data: {
                  email: updatedApp.candidateEmail,
                  name: updatedApp.candidateName,
                  password: crypto.createHash('sha256').update(`candidate_${Date.now()}`).digest('hex'),
                  role: 'CANDIDATO',
                  companyId,
                  phone: updatedApp.candidatePhone,
                  consentGiven: true,
                  consentDate: updatedApp.startedAt || new Date(),
                  active: true,
                },
              })
            }

            // Find matching Position
            let position = await db.position.findFirst({
              where: { companyId, sector: updatedApp.vacancy.sector, active: true },
            })
            if (!position) {
              position = await db.position.findFirst({
                where: { companyId, active: true },
              })
            }

            if (position) {
              const session = await db.evaluationSession.create({
                data: {
                  candidateId: candidateUser.id,
                  positionId: position.id,
                  companyId,
                  status: 'COMPLETED',
                  startedAt: updatedApp.startedAt || updatedApp.createdAt,
                  completedAt: updatedApp.completedAt || new Date(),
                },
              })

              await db.evaluationResult.create({
                data: {
                  sessionId: session.id,
                  candidateId: candidateUser.id,
                  candidateName: updatedApp.candidateName,
                  positionId: position.id,
                  positionTitle: position.title,
                  companyId,
                  openness: updatedApp.openness,
                  conscientiousness: updatedApp.conscientiousness,
                  extraversion: updatedApp.extraversion,
                  agreeableness: updatedApp.agreeableness,
                  neuroticism: updatedApp.neuroticism,
                  stressLevel: updatedApp.stressLevel,
                  empathy: updatedApp.empathy,
                  adaptability: updatedApp.adaptability,
                  leadership: updatedApp.leadership,
                  teamwork: updatedApp.teamwork,
                  knowledgeScore: updatedApp.knowledgeScore,
                  overallScore: updatedApp.overallScore || 0,
                  recommendation: updatedApp.recommendation || 'PENDIENTE',
                  summary: updatedApp.summary,
                },
              })
            }
          }
        } catch (bridgeError) {
          console.error('Error creating EvaluationResult bridge record:', bridgeError)
        }
      }

      return NextResponse.json({
        nextStep: completed ? 5 : nextStep,
        completed,
      })
    }

    return NextResponse.json({ error: 'Invalid step parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error in apply flow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
