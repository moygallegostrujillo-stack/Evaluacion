import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { generatePublicToken, verifyPublicToken } from '@/lib/public-token'
import {
  KnowledgeVersioningError,
  findClientGovernanceField,
  freezeKnowledgeForApplication,
} from '@/lib/knowledge-versioning'
import {
  scoreCanonicalAdministration,
  writeKnowledgeResult,
} from '@/lib/knowledge-canonical'
import {
  calculateCanonicalOverallScore,
  buildCanonicalInput,
  serializeSections,
  serializeExcludedReasons,
  type EvidenceStatus,
  type CanonicalOverallOutput,
} from '@/lib/overall-score'

const db = getUnscopedClient()

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
  const integrityCategories = ['INTEGRITY_HONESTY', 'INTEGRITY_RULES', 'INTEGRITY_THEFT', 'INTEGRITY_RESPONSIBILITY']

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
  let bigFiveSum = 0
  let bigFiveCategoriesWithResponses = 0

  for (const cat of bigFiveCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      let normalized = normalizeBigFive(avg)
      // NEUROTICISM is already handled via reverseScored in the questions
      // So we don't invert it again here for Big Five
      bigFiveScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
      bigFiveSum += bigFiveScores[cat]
      bigFiveCategoriesWithResponses++
    } else {
      bigFiveScores[cat] = 0
    }
  }

  // Only average over categories that actually have responses
  const psicometricaAvg = bigFiveCategoriesWithResponses > 0 ? bigFiveSum / bigFiveCategoriesWithResponses : 0
  const hasBigFiveData = bigFiveCategoriesWithResponses > 0

  // Psychological scores (normalized 0-100)
  const psychScores: Record<string, number> = {}
  let psychSum = 0
  let psychCategoriesWithResponses = 0

  for (const cat of psychCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      let normalized = normalizePsychological(avg)
      // STRESS is inverted: high raw stress → low score (better stress management)
      if (cat === 'STRESS') {
        normalized = 100 - normalized
      }
      psychScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
      psychSum += psychScores[cat]
      psychCategoriesWithResponses++
    } else {
      psychScores[cat] = 0
    }
  }

  const psicologicaAvg = psychCategoriesWithResponses > 0 ? psychSum / psychCategoriesWithResponses : 0
  const hasPsychData = psychCategoriesWithResponses > 0

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

  // Integrity scores (normalized 0-100, orientative — never as auto-filter)
  const integrityScores: Record<string, number> = {}
  let integritySum = 0
  let integrityCategoriesWithResponses = 0

  for (const cat of integrityCategories) {
    const scores = categoryScores[cat] || []
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      const normalized = normalizePsychological(avg)
      integrityScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
      integritySum += integrityScores[cat]
      integrityCategoriesWithResponses++
    } else {
      integrityScores[cat] = 0
    }
  }

  const avgIntegrity = integrityCategoriesWithResponses > 0 ? integritySum / integrityCategoriesWithResponses : 0
  const hasIntegrityData = integrityCategoriesWithResponses > 0

  // ── A-04.5: CANONICAL OVERALL SCORE ─────────────────────────────────
  // Per-step preliminary overall via the SINGLE canonical engine. Integrity
  // is isolated (excluded from the weighted score). At step completion the
  // final overall is recomputed by calculateOverallScore() (below) using the
  // canonical knowledge score + evidenceStatus. The same engine guarantees
  // the per-step and final values are consistent.
  const canonicalInput = buildCanonicalInput(
    {
      openness: bigFiveScores['OPENNESS'] || 0,
      conscientiousness: bigFiveScores['CONSCIENTIOUSNESS'] || 0,
      extraversion: bigFiveScores['EXTRAVERSION'] || 0,
      agreeableness: bigFiveScores['AGREEABLENESS'] || 0,
      neuroticism: bigFiveScores['NEUROTICISM'] || 0,
    },
    {
      stressLevel: psychScores['STRESS'] || 0,
      empathy: psychScores['EMPATHY'] || 0,
      adaptability: psychScores['ADAPTABILITY'] || 0,
      leadership: psychScores['LEADERSHIP'] || 0,
      teamwork: psychScores['TEAMWORK'] || 0,
    },
    knowledgeScore,
    null, // per-step: canonical evidenceStatus not yet resolved
    hasIntegrityData ? avgIntegrity : 0
  )
  const canonicalOverall = calculateCanonicalOverallScore(canonicalInput)
  const guidance = canonicalOverall.guidance

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
    integrityScore: hasIntegrityData ? Math.round(avgIntegrity * 100) / 100 : 0,
    overallScore: canonicalOverall.score,
    recommendation: guidance, // Keep field name for DB compatibility, but value is now guidance
    formulaVersion: canonicalOverall.formulaVersion,
    includedSections: serializeSections(canonicalOverall.includedSections),
    excludedSections: serializeSections(canonicalOverall.excludedSections),
    excludedReasons: serializeExcludedReasons(canonicalOverall.excludedReasons),
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

// ── Integrity questions (orientative, never auto-filter — same as generate-templates.ts) ──
const HARDCODED_INTEGRIDAD = [
  // INTEGRITY_HONESTY (3 questions)
  { id: 'hw-int-1', text: 'Si cometo un error en el trabajo, lo comunico a mi supervisor de inmediato', category: 'INTEGRITY_HONESTY', type: 'LIKERT', reverseScored: false, order: 1 },
  { id: 'hw-int-2', text: 'Considero que decir la verdad es más importante que evitar un problema temporal', category: 'INTEGRITY_HONESTY', type: 'LIKERT', reverseScored: false, order: 2 },
  { id: 'hw-int-3', text: 'En situaciones de presión, he ocultado información para evitar consecuencias', category: 'INTEGRITY_HONESTY', type: 'LIKERT', reverseScored: true, order: 3 },
  // INTEGRITY_RULES (3 questions)
  { id: 'hw-int-4', text: 'Sigo los procedimientos establecidos aunque nadie me esté observando', category: 'INTEGRITY_RULES', type: 'LIKERT', reverseScored: false, order: 4 },
  { id: 'hw-int-5', text: 'Respeto las políticas de la empresa aunque considere que alguna no es necesaria', category: 'INTEGRITY_RULES', type: 'LIKERT', reverseScored: false, order: 5 },
  { id: 'hw-int-6', text: 'He justificado no cumplir una norma porque "no hacía daño a nadie"', category: 'INTEGRITY_RULES', type: 'LIKERT', reverseScored: true, order: 6 },
  // INTEGRITY_THEFT (2 questions)
  { id: 'hw-int-7', text: 'Considero que tomar pequeños artículos del trabajo sin permiso es aceptable si son de bajo valor', category: 'INTEGRITY_THEFT', type: 'LIKERT', reverseScored: true, order: 7 },
  { id: 'hw-int-8', text: 'He utilizado recursos de la empresa (tiempo, materiales) para fines personales sin autorización', category: 'INTEGRITY_THEFT', type: 'LIKERT', reverseScored: true, order: 8 },
  // INTEGRITY_RESPONSIBILITY (2 questions)
  { id: 'hw-int-9', text: 'Cuando algo sale mal en mi área, asumo mi parte de responsabilidad sin buscar culpables', category: 'INTEGRITY_RESPONSIBILITY', type: 'LIKERT', reverseScored: false, order: 9 },
  { id: 'hw-int-10', text: 'Si un compañero comete una falta, prefiero no involucrarme para evitar conflictos', category: 'INTEGRITY_RESPONSIBILITY', type: 'LIKERT', reverseScored: true, order: 10 },
]

// ============================================
// HELPER: Get system questions for a company's vacancy
// ============================================

async function getSystemQuestions(companyId: string, includeIntegridad: boolean = true) {
  // Find any Position belonging to the vacancy's company
  const position = await db.position.findFirst({
    where: { companyId },
    include: {
      evaluationTemplates: {
        where: { type: { in: ['PSICOMETRICA', 'PSICOLOGICA', 'CONOCIMIENTOS', 'INTEGRIDAD'] } },
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
  let integrityQuestions: Array<{
    id: string
    text: string
    category: string
    type: string
    reverseScored: boolean
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
    const integridadTemplate = position.evaluationTemplates.find(
      (t) => t.type === 'INTEGRIDAD'
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

    if (includeIntegridad && integridadTemplate) {
      integrityQuestions = integridadTemplate.questions.map((q) => ({
        id: q.id,
        text: q.text,
        category: q.category,
        type: q.type,
        reverseScored: q.reverseScored,
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
  if (includeIntegridad && integrityQuestions.length === 0) {
    integrityQuestions = HARDCODED_INTEGRIDAD
  }

  return { bigFiveQuestions, psychologicalQuestions, knowledgeQuestions, integrityQuestions }
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
    const systemQuestions = await getSystemQuestions(companyId, vacancy.includeIntegridad ?? true)

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
    const systemQuestions = await getSystemQuestions(companyId, vacancy.includeIntegridad ?? true)

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
    // Integridad (new step)
    const systemQuestions = await getSystemQuestions(companyId, vacancy.includeIntegridad ?? true)

    const integridadResponses = responses.filter((r) => r.section.toUpperCase() === 'INTEGRIDAD')

    const scoredResponses: ScoredResponse[] = integridadResponses.map((r) => {
      const systemQ = systemQuestions.integrityQuestions.find((q) => q.id === r.questionId)
      return {
        section: r.section,
        category: systemQ?.category || 'INTEGRITY_HONESTY',
        type: systemQ?.type || 'LIKERT',
        reverseScored: systemQ?.reverseScored || false,
        numericValue: r.numericValue,
        value: r.value,
        correctAnswer: null,
      }
    })

    const scores = calculateScores(scoredResponses)
    return { integrityScore: scores.integrityScore }
  }

  if (completedStep === 4) {
    // Conocimientos - handle both VacancyQuestion and system Question responses
    const knowledgeResponses = responses.filter((r) => r.section.toUpperCase() === 'CONOCIMIENTOS')

    // Get system questions to find correct answers for template-based questions
    const systemQuestions = await getSystemQuestions(companyId, vacancy.includeIntegridad ?? true)
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
// HELPER: Calculate overall score and guidance
// ============================================

async function calculateOverallScore(applicationId: string): Promise<CanonicalOverallOutput & { summary: string } | null> {
  const application = await db.vacancyApplication.findUnique({
    where: { id: applicationId },
    include: {
      vacancy: true,
      // A-04.5: look up the canonical Knowledge evidence status so
      // INSUFFICIENT/INVALID evidence is EXCLUDED (never coerced to 0).
      knowledgeAdministration: { include: { knowledgeResult: true } },
    },
  })
  if (!application) return null

  const vacancy = application.vacancy

  // Determine which sections actually have data (for the orientation summary).
  // The canonical engine independently determines inclusion from the scores +
  // evidence status; these flags are only for the summary text.
  const hasBigFiveData = vacancy.includePsicometrica === true && (
    application.openness > 0 || application.conscientiousness > 0 ||
    application.extraversion > 0 || application.agreeableness > 0 ||
    application.neuroticism > 0
  )
  const hasPsychData = vacancy.includePsicologica === true && (
    application.stressLevel > 0 || application.empathy > 0 ||
    application.adaptability > 0 || application.leadership > 0 ||
    application.teamwork > 0
  )
  const hasIntegrityData = (vacancy.includeIntegridad ?? true) === true && application.integrityScore > 0

  // A-04.5: resolve the canonical Knowledge evidence status. When a
  // KnowledgeResult exists, its evidenceStatus (VALID/LIMITED/INSUFFICIENT)
  // drives exclusion — INSUFFICIENT evidence NEVER becomes 0. When no
  // administration/result exists (legacy), the status is null and the
  // engine excludes via NO_DATA if knowledgeScore is null.
  const knowledgeResult = application.knowledgeAdministration?.knowledgeResult
  const knowledgeEvidenceStatus: EvidenceStatus = knowledgeResult
    ? (knowledgeResult.evidenceStatus as EvidenceStatus)
    : null

  // ── A-04.5: CANONICAL OVERALL SCORE ─────────────────────────────────
  // ONE engine, SAME as evaluations and public/video. Integrity is isolated
  // (excluded from the weighted score). INSUFFICIENT/INVALID evidence is
  // excluded. Historical weights preserved verbatim inside the engine.
  const canonicalInput = buildCanonicalInput(
    {
      openness: application.openness,
      conscientiousness: application.conscientiousness,
      extraversion: application.extraversion,
      agreeableness: application.agreeableness,
      neuroticism: application.neuroticism,
    },
    {
      stressLevel: application.stressLevel,
      empathy: application.empathy,
      adaptability: application.adaptability,
      leadership: application.leadership,
      teamwork: application.teamwork,
    },
    application.knowledgeScore,
    knowledgeEvidenceStatus,
    application.integrityScore
  )
  const canonical = calculateCanonicalOverallScore(canonicalInput)

  // Generate orientation summary (guidance, NOT a hiring decision)
  const bigFiveScores = {
    OPENNESS: application.openness,
    CONSCIENTIOUSNESS: application.conscientiousness,
    EXTRAVERSION: application.extraversion,
    AGREEABLENESS: application.agreeableness,
    NEUROTICISM: application.neuroticism,
  }
  const psychScores = {
    STRESS: application.stressLevel,
    EMPATHY: application.empathy,
    ADAPTABILITY: application.adaptability,
    LEADERSHIP: application.leadership,
    TEAMWORK: application.teamwork,
  }
  const summary = generateSummary(
    bigFiveScores, psychScores, application.knowledgeScore, canonical.guidance,
    hasBigFiveData, hasPsychData,
    hasIntegrityData ? application.integrityScore : null, hasIntegrityData
  )

  return {
    ...canonical,
    summary,
  }
}

/**
 * Generates an ORIENTATION summary — describes the candidate's profile
 * without making a hiring decision. The system provides guidance to the
 * recruiter, who makes the final decision.
 *
 * LFPDPPP Art. 37 Bis: The evaluation result must NOT be the sole basis
 * for a hiring decision. It is informational orientation only.
 */
function generateSummary(
  bigFiveScores: Record<string, number>,
  psychScores: Record<string, number>,
  knowledgeScore: number | null,
  guidance: string,
  hasBigFiveData: boolean,
  hasPsychData: boolean,
  integrityScore: number | null,
  hasIntegrityData: boolean
): string {
  const strengths: string[] = []
  const areasToExplore: string[] = []

  // Big Five strengths (note: neuroticism is reverse-scored, so high = LOW neuroticism = good)
  if (hasBigFiveData) {
    if (bigFiveScores['EXTRAVERSION'] >= 70) strengths.push('alta extraversión')
    if (bigFiveScores['CONSCIENTIOUSNESS'] >= 70) strengths.push('alta responsabilidad')
    if (bigFiveScores['OPENNESS'] >= 70) strengths.push('alta apertura a la experiencia')
    if (bigFiveScores['AGREEABLENESS'] >= 70) strengths.push('alta amabilidad')
    // High neuroticism score = low neuroticism (reverse-scored) = strength
    if (bigFiveScores['NEUROTICISM'] >= 70) strengths.push('baja tendencia al neuroticismo (estabilidad emocional)')
  }

  // Psychological strengths
  if (hasPsychData) {
    if (psychScores['EMPATHY'] >= 70) strengths.push('buena empatía')
    if (psychScores['TEAMWORK'] >= 70) strengths.push('buen trabajo en equipo')
    if (psychScores['ADAPTABILITY'] >= 70) strengths.push('buena adaptabilidad')
    if (psychScores['LEADERSHIP'] >= 70) strengths.push('buen liderazgo')
    if (psychScores['STRESS'] >= 70) strengths.push('buena gestión del estrés')
  }

  // Areas to explore in interview (not concerns, not disqualifiers)
  if (hasPsychData) {
    if (psychScores['STRESS'] < 40) areasToExplore.push('manejo del estrés en situaciones de alta demanda')
    if (psychScores['EMPATHY'] < 40) areasToExplore.push('habilidades de empatía y relación con clientes')
    if (psychScores['TEAMWORK'] < 40) areasToExplore.push('dinámica de trabajo en equipo')
    if (psychScores['ADAPTABILITY'] < 40) areasToExplore.push('adaptabilidad ante cambios')
  }
  // Low neuroticism score = high neuroticism (reverse-scored) = area to explore
  if (hasBigFiveData && bigFiveScores['NEUROTICISM'] < 30) {
    areasToExplore.push('gestión emocional en entornos laborales')
  }

  // Integrity — orientative, never as disqualification (LFPDPPP Art. 37 Bis)
  if (hasIntegrityData && integrityScore !== null) {
    if (integrityScore >= 70) strengths.push('integridad sobresaliente')
    if (integrityScore < 40) areasToExplore.push('se sugiere explorar en entrevista aspectos relacionados con integridad y honradez')
  }

  let summary = ''

  // Indicate profile scope
  if (guidance === 'PERFIL_PARCIAL') {
    if (!hasBigFiveData && !hasPsychData && !hasIntegrityData) {
      summary += 'Perfil basado únicamente en evaluación de conocimientos. '
    } else if (!hasBigFiveData && !hasIntegrityData) {
      summary += 'Perfil basado en evaluación psicológica y de conocimientos (sin sección psicométrica por consentimiento del candidato). '
    } else if (!hasBigFiveData && knowledgeScore === null) {
      summary += 'Perfil basado en evaluación psicológica y de integridad (sin sección psicométrica ni de conocimientos). '
    } else if (!hasBigFiveData) {
      summary += 'Perfil basado en evaluación psicológica, de integridad y de conocimientos (sin sección psicométrica por consentimiento del candidato). '
    } else if (!hasPsychData && !hasIntegrityData) {
      summary += 'Perfil basado en evaluación psicométrica y de conocimientos (sin sección psicológica ni de integridad). '
    } else if (!hasPsychData) {
      summary += 'Perfil basado en evaluación psicométrica, de integridad y de conocimientos (sin sección psicológica). '
    } else if (!hasIntegrityData) {
      summary += 'Perfil basado en evaluación psicométrica, psicológica y de conocimientos (sin sección de integridad). '
    } else if (knowledgeScore === null) {
      summary += 'Perfil basado en evaluación psicométrica, psicológica y de integridad (sin sección de conocimientos). '
    }
  }

  if (strengths.length > 0) {
    summary += `Áreas destacadas: ${strengths.join(', ')}. `
  }

  if (areasToExplore.length > 0) {
    summary += `Se sugiere explorar en entrevista: ${areasToExplore.join(', ')}. `
  }

  if (knowledgeScore !== null) {
    if (knowledgeScore >= 80) {
      summary += 'Conocimientos técnicos sobresalientes. '
    } else if (knowledgeScore >= 60) {
      summary += 'Conocimientos técnicos sólidos. '
    } else if (knowledgeScore >= 40) {
      summary += 'Conocimientos técnicos en desarrollo; puede fortalecerse con capacitación. '
    } else {
      summary += 'Conocimientos técnicos con oportunidad de mejora significativa. '
    }
  }

  // Neutral closing — NO hiring decision
  summary += 'Esta evaluación proporciona orientación informativa. La decisión final corresponde al área de Recursos Humanos.'

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

    // ── PHASE 3.5-H (VUL-H2): HMAC token REQUIRED before any lookup. ──
    // The previous implementation accepted a bare applicationId and MINTED a
    // fresh token in every response — turning a known/leaked applicationId
    // into a full capability (application hijack via email+slug enumeration
    // followed by this endpoint). Now the caller MUST present the token it
    // received at creation/resume time. The response NEVER mints tokens.
    // Invalid/missing tokens return the SAME generic 404 as an unknown
    // applicationId (no existence signal — H2-8).
    const token = req.nextUrl.searchParams.get('token')
    if (!token || !verifyPublicToken(token, applicationId)) {
      console.warn(
        `[SECURITY] public/apply GET: token verification FAILED for application ${applicationId}`
      )
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
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
    // PHASE 3.5-D.2.9 (PARTE 5): data-minimization — the resume bootstrap
    // response NO LONGER returns candidate PII (name/email/phone/age). The
    // candidate entering their own data never needs it echoed back, and an
    // applicationId holder must not be able to read the candidate's PII
    // without the HMAC token flow. Steps 1+ never returned PII.
    if (currentStep === 0) {
      return NextResponse.json({
        step: 0,
        stepName: 'data',
        applicationId: application.id,
      })
    }

    // Step 1: psicometrica (Big Five from system questions)
    if (currentStep === 1) {
      if (vacancy.includePsicometrica) {
        const systemQuestions = await getSystemQuestions(vacancy.companyId, vacancy.includeIntegridad ?? true)
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
      // includePsicometrica is false — return empty questions so frontend can skip
      return NextResponse.json({
        step: 1,
        stepName: 'psicometrica',
        applicationId: application.id,
        questions: [],
      })
    }

    // Step 2: psicologica
    if (currentStep === 2) {
      if (vacancy.includePsicologica) {
        const systemQuestions = await getSystemQuestions(vacancy.companyId, vacancy.includeIntegridad ?? true)
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
      // includePsicologica is false — return empty questions so frontend can skip
      return NextResponse.json({
        step: 2,
        stepName: 'psicologica',
        applicationId: application.id,
        questions: [],
      })
    }

    // Step 3: integridad (new step)
    if (currentStep === 3) {
      if (vacancy.includeIntegridad !== false) {
        const systemQuestions = await getSystemQuestions(vacancy.companyId, vacancy.includeIntegridad ?? true)
        return NextResponse.json({
          step: 3,
          stepName: 'integridad',
          applicationId: application.id,
          questions: systemQuestions.integrityQuestions.map((q) => ({
            id: q.id,
            questionId: q.id,
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
      // includeIntegridad is false — return empty questions so frontend can skip
      return NextResponse.json({
        step: 3,
        stepName: 'integridad',
        applicationId: application.id,
        questions: [],
      })
    }

    // Step 4: conocimientos (vacancy questions + position template questions)
    if (currentStep === 4) {
      // ── A-03.4: VERSIONED administration → serve the FROZEN item set. ──
      // The live bank is NEVER consulted for a frozen administration: the
      // candidate continues with the assessment version frozen at start
      // (PASO 4/5 — answer/advance never re-resolve "the currently ACTIVE
      // assessment").
      if (
        application.knowledgeVersioningStatus === 'VERSIONED' &&
        application.knowledgeAssessmentId
      ) {
        const frozenItems = await db.knowledgeAssessmentItem.findMany({
          where: { assessmentId: application.knowledgeAssessmentId },
          orderBy: { order: 'asc' },
        })

        if (frozenItems.length === 0) {
          // Fail-closed (PASO 8): an administration without frozen items
          // must not continue silently.
          console.error(
            `[A-03.4] CONFIGURATION_ERROR: administration ${application.knowledgeAssessmentId} has no frozen items`
          )
          return NextResponse.json(
            { error: 'Internal server error', code: 'CONFIGURATION_ERROR' },
            { status: 500 }
          )
        }

        const allQuestions = frozenItems.map((item) => {
          const snapshot = JSON.parse(item.questionSnapshot) as {
            text: string
            options: string[]
            type: string
          }
          return {
            id: item.itemId,
            questionId: item.itemId, // join key for the answer step (frozen)
            // vacancyQuestionId only for genuine VacancyQuestion items —
            // template items are joined by questionId (no dangling FK).
            ...(item.itemType === 'VACANCY_QUESTION' ? { vacancyQuestionId: item.itemId } : {}),
            text: snapshot.text,
            type: snapshot.type,
            category: 'KNOWLEDGE' as const,
            options: snapshot.options,
            correctAnswer: undefined, // NEVER expose the frozen key to the candidate
            order: item.order,
          }
        })

        return NextResponse.json({
          step: 4,
          stepName: 'conocimientos',
          applicationId: application.id,
          knowledgeAssessmentVersion: application.knowledgeAssessmentVersion, // informational, server-frozen
          questions: allQuestions,
        })
      }

      // ── LEGACY administration (pre-A-03.4 row): live-bank path unchanged. ──
      const systemQuestions = await getSystemQuestions(vacancy.companyId, vacancy.includeIntegridad ?? true)

      // Start with vacancy custom questions
      const allQuestions = vacancy.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        category: 'KNOWLEDGE' as const,  // VacancyQuestion has no category field — default to KNOWLEDGE
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
            category: q.category as "KNOWLEDGE",
            correctAnswer: undefined, // Don't expose correct answer to candidate
            order: q.order,
            // A-03.4 FIX: template questions are joined by questionId (the
            // scoring step looks them up via systemKnowledgeMap.get(questionId)).
            // The previous code wrote the template id into vacancyQuestionId,
            // producing a dangling FK against VacancyQuestion.
            questionId: q.id,
          })
        }
      }

      return NextResponse.json({
        step: 4,
        stepName: 'conocimientos',
        applicationId: application.id,
        questions: allQuestions,
      })
    }

    // Step 5: done
    if (currentStep === 5) {
      return NextResponse.json({
        step: 5,
        stepName: 'done',
        applicationId: application.id,
        status: application.status,
      })
    }

    // Step 6+ is also done (backward compat)
    return NextResponse.json({
      step: application.currentStep,
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

    // ── A-03.4 (PASO 10): candidate can NEVER supply governance fields. ──
    // assessmentVersion / itemVersion / correctAnswer / blueprintVersion /
    // scoringVersion / snapshots are server-only authorities. Any attempt to
    // transmit them is rejected BEFORE any lookup or write.
    const govField = findClientGovernanceField(body as Record<string, unknown>)
    if (govField) {
      console.warn(
        `[SECURITY][A-03.4] public/apply: client attempted to send governance field "${govField}" — rejected`
      )
      return NextResponse.json(
        { error: 'Solicitud inválida', code: 'MANIPULATION_REJECTED' },
        { status: 403 }
      )
    }

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
        // ── PHASE 3.5-H (VUL-H2): possession proof for resume. ──
        // Previously this branch returned the bare applicationId to anyone
        // presenting (email + slug). Combined with the GET that minted
        // tokens, that was an application-hijack chain. The candidate must
        // now prove possession by re-entering the identity data they
        // originally submitted (name — always stored — and phone when one
        // was stored). NO token or applicationId is ever released without
        // this proof. No new credential system was introduced: this uses
        // exactly the data the real flow already collects.
        //
        // Existence note (H2-8): the one-application-per-email-per-vacancy
        // rule is a PRODUCT rule and is NOT changed here; the 403 below
        // therefore inherently signals that SOME application exists for
        // this email+slug. The security property that matters is stricter
        // and holds: NO capability (applicationId/token) is released
        // without the proof, and responses never leak whose application
        // it is or any of its data.
        const submittedName = (name || '').trim().toLowerCase()
        const storedName = (existingApplication.candidateName || '').trim().toLowerCase()
        const nameMatches = submittedName.length > 0 && storedName.length > 0 && submittedName === storedName

        const storedPhone = (existingApplication.candidatePhone || '').trim()
        const submittedPhone = (phone || '').trim()
        // Phone participates in the proof only when one was stored. When
        // stored, it MUST match exactly (the candidate re-entering their
        // own data knows it; an attacker with just email+slug does not).
        const phoneMatches = storedPhone.length === 0 || submittedPhone === storedPhone

        if (!nameMatches || !phoneMatches) {
          console.warn(
            `[SECURITY] public/apply step=data: resume possession proof FAILED for vacancy ${vacancySlug}`
          )
          // Generic message — no applicationId, no token, no data, no
          // indication of WHAT did not match.
          return NextResponse.json(
            {
              error:
                'No pudimos validar tu postulación existente con esos datos. Si ya te habías postulado, verifica tu nombre y teléfono exactamente como los registraste, o contacta a reclutamiento.',
              code: 'RESUME_PROOF_MISMATCH',
            },
            { status: 403 }
          )
        }

        // Proof OK — legitimate resume. Re-issue the (deterministic) HMAC
        // token so the candidate can continue answer/advance on this device.
        return NextResponse.json({
          applicationId: existingApplication.id,
          step: existingApplication.currentStep,
          resumed: true,
          token: generatePublicToken(existingApplication.id),
        })
      }

      // Determine first step
      let firstStep = 0 // data step is step 0
      // After data, check which steps are included
      // Steps: 0=data, 1=psicometrica, 2=psicologica, 3=integridad, 4=conocimientos, 5=done

      // ── A-03.5 (PASO 7/8): CANONICAL FREEZE — the public flow no longer
      // builds a parallel blueprint. Inside the SAME transaction that creates
      // the application, the canonical chain is resolved EXACTLY ONCE:
      //
      //   job(vacancy) → KnowledgeBlueprint → KnowledgeRequirement
      //     → KnowledgeAssessment ACTIVE → itemVersions
      //       → KnowledgeAdministration (WHAT the candidate received)
 //         → frozen on VacancyApplication (A-03.4 compat fields)
      //
      // Later requests (answer/advance) NEVER re-read the live bank. If the
      // chain cannot be determined, the error propagates, the transaction
      // rolls back and NO partially-versioned evaluation exists (fail-closed).
      let application
      try {
        // PASO 14 (concurrency): parallel freezes on the same bank can hit
        // SQLite write contention. The whole freeze transaction is retried:
        // the loser re-reads the winner's published version and reuses it —
        // every concurrent candidate ends on the SAME published version.
        for (let attempt = 0; ; attempt++) {
          try {
            application = await db.$transaction(async (tx) => {
              const created = await tx.vacancyApplication.create({
                data: {
                  vacancyId: vacancy.id,
                  companyId: vacancy.companyId,
                  candidateName: name,
                  candidateEmail: email,
                  candidatePhone: phone || null,
                  candidateAge: age || null,
                  status: 'IN_PROGRESS',
                  currentStep: firstStep,
                  startedAt: new Date(),
                },
              })

              await freezeKnowledgeForApplication(tx, created.id, vacancy)

              return created
            }, { timeout: 20000, maxWait: 10000 })
            break
          } catch (freezeErr) {
            const { isRetryableFreezeError } = await import('@/lib/knowledge-canonical')
            if (attempt < 3 && isRetryableFreezeError(freezeErr)) {
              await new Promise((r) => setTimeout(r, 15 + Math.random() * 35))
              continue
            }
            throw freezeErr
          }
        }
      } catch (versioningError) {
        if (versioningError instanceof KnowledgeVersioningError) {
          // Fail-closed: CONFIGURATION_ERROR / INTERNAL_ERROR and no
          // partially-versioned administration was created (rollback).
          console.error(`[A-03.5] ${versioningError.code}: ${versioningError.message}`)
          return NextResponse.json(
            { error: 'No fue posible iniciar la evaluación', code: versioningError.code },
            { status: 500 }
          )
        }
        throw versioningError
      }

      return NextResponse.json({
        applicationId: application.id,
        token: generatePublicToken(application.id),
        step: 0,
        resumed: false,
      })
    }

    // ---- step=answer: Save answer ----
    if (body.step === 'answer') {
      const { applicationId, section, questionId, vacancyQuestionId, value, numericValue, token } =
        body as ApplyAnswerBody & { token?: string }

      if (!applicationId || !section || !value) {
        return NextResponse.json(
          { error: 'applicationId, section, and value are required' },
          { status: 400 }
        )
      }

      // PHASE 3.5-D.2.9 (PARTE 5): HMAC token REQUIRED and verified BEFORE
      // any lookup or write. The token is self-contained (HMAC of the
      // applicationId), so validation is purely cryptographic — no DB access
      // happens without it. This closes the bare-applicationId write path.
      if (!token) {
        return NextResponse.json(
          { error: 'Token de verificación requerido', code: 'TOKEN_REQUIRED' },
          { status: 403 }
        )
      }
      if (!verifyPublicToken(token, applicationId)) {
        console.warn(`[SECURITY] public/apply answer: token verification FAILED for application ${applicationId}`)
        return NextResponse.json(
          { error: 'Token de verificación inválido', code: 'TOKEN_INVALID' },
          { status: 403 }
        )
      }

      const application = await db.vacancyApplication.findUnique({
        where: { id: applicationId },
      })

      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      // ── A-03.4 (PASO 3): knowledge answers bind to the FROZEN administration. ──
      // The version, key and snapshot are derived SERVER-SIDE from the frozen
      // assessment — never from client input. An answer referencing an item
      // outside the frozen administration is rejected (fail-closed).
      // A-03.5: the response is also STAMPED with the canonical
      // KnowledgeAdministration id (the formal record of what the candidate
      // received) — the id is resolved server-side, never client-supplied.
      let knowledgeSnapshotData: {
        itemVersion: number
        questionSnapshot: string
        correctAnswerSnapshot: number | null
        scoringVersionSnapshot: string
        knowledgeAdministrationId: string
      } | null = null

      if (
        section === 'CONOCIMIENTOS' &&
        application.knowledgeVersioningStatus === 'VERSIONED' &&
        application.knowledgeAssessmentId
      ) {
        const joinKey = vacancyQuestionId || questionId || ''
        const frozenItem = await db.knowledgeAssessmentItem.findFirst({
          where: {
            assessmentId: application.knowledgeAssessmentId,
            itemId: joinKey,
          },
        })

        if (!frozenItem) {
          console.warn(
            `[SECURITY][A-03.4] answer: item "${joinKey}" is not part of the frozen administration for application ${applicationId}`
          )
          return NextResponse.json(
            { error: 'Solicitud inválida', code: 'ITEM_NOT_IN_ADMINISTRATION' },
            { status: 403 }
          )
        }

        const administration = await db.knowledgeAdministration.findUnique({
          where: { vacancyApplicationId: applicationId },
          select: { id: true },
        })
        if (!administration) {
          // Fail-closed: a VERSIONED application without its canonical
          // administration entity must not accept knowledge answers.
          console.error(
            `[A-03.5] CONFIGURATION_ERROR: application ${applicationId} has no canonical administration`
          )
          return NextResponse.json(
            { error: 'Internal server error', code: 'CONFIGURATION_ERROR' },
            { status: 500 }
          )
        }

        knowledgeSnapshotData = {
          itemVersion: frozenItem.itemVersion,
          questionSnapshot: frozenItem.questionSnapshot,
          correctAnswerSnapshot: frozenItem.correctAnswerSnapshot, // server-only; never returned to client
          scoringVersionSnapshot:
            application.knowledgeScoringVersion || 'PUB-KS-v1',
          knowledgeAdministrationId: administration.id,
        }
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
            // A-03.4: re-answers re-bind to the CURRENT frozen state (the
            // frozen administration itself never changes for this application).
            ...(knowledgeSnapshotData ? { ...knowledgeSnapshotData } : {}),
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
            // PARTE 9/10 (D.2.9): tenant invariant — derived from the
            // verified parent application, never from client input.
            companyId: application.companyId,
            // A-03.4: frozen knowledge snapshot (server-derived)
            ...(knowledgeSnapshotData ? { ...knowledgeSnapshotData } : {}),
          },
        })
      }

      return NextResponse.json({ success: true })
    }

    // ---- step=advance: Complete step and move to next ----
    if (body.step === 'advance') {
      const { applicationId, completedStep, token } = body as ApplyAdvanceBody & { token?: string }

      if (!applicationId || completedStep === undefined) {
        return NextResponse.json(
          { error: 'applicationId and completedStep are required' },
          { status: 400 }
        )
      }

      // PHASE 3.5-D.2.9 (PARTE 5): HMAC token REQUIRED and verified BEFORE
      // any lookup or write (same rationale as the answer step).
      if (!token) {
        return NextResponse.json(
          { error: 'Token de verificación requerido', code: 'TOKEN_REQUIRED' },
          { status: 403 }
        )
      }
      if (!verifyPublicToken(token, applicationId)) {
        console.warn(`[SECURITY] public/apply advance: token verification FAILED for application ${applicationId}`)
        return NextResponse.json(
          { error: 'Token de verificación inválido', code: 'TOKEN_INVALID' },
          { status: 403 }
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
      // ── A-03.5 (PASO 4/10): completedStep=4 for a VERSIONED administration is
      // scored by the SINGLE canonical engine against the frozen version AND
      // produces the canonical KnowledgeResult (evidence status; INSUFFICIENT
      // ≠ 0; explicitly separate from overallScore). Legacy rows keep the
      // historical path. ──
      let stepScores: Record<string, unknown> | null = null
      let knowledgeVersionedScoring = false

      if (completedStep === 4 && application.knowledgeVersioningStatus === 'VERSIONED') {
        try {
          const administration = await db.knowledgeAdministration.findUnique({
            where: { vacancyApplicationId: application.id },
          })
          if (!administration) {
            throw new KnowledgeVersioningError(
              'CONFIGURATION_ERROR',
              'VERSIONED application has no canonical administration'
            )
          }
          const canonical = await scoreCanonicalAdministration(db, administration.id)
          stepScores = { knowledgeScore: canonical.knowledgeScore }
          knowledgeVersionedScoring = true

          // A-03.5 PASO 8/10/11: the administration completes and its
          // KnowledgeResult is recorded (never merged into overallScore).
          await writeKnowledgeResult(db, administration.id, canonical)
          await db.knowledgeAdministration.update({
            where: { id: administration.id },
            data: { status: 'COMPLETED', completedAt: new Date() },
          })
        } catch (scoringError) {
          if (scoringError instanceof KnowledgeVersioningError) {
            // Fail-closed: do not advance/score a corrupted administration.
            console.error(`[A-03.5] ${scoringError.code} during scoring: ${scoringError.message}`)
            return NextResponse.json(
              { error: 'No fue posible completar la evaluación', code: scoringError.code },
              { status: 500 }
            )
          }
          throw scoringError
        }
      } else {
        stepScores = await calculateStepScores(
          applicationId,
          completedStep,
          vacancy.id,
          vacancy.companyId
        )
      }

      // Update application with step scores and advance step
      const updateData: Record<string, unknown> = {}

      // A-03.4 (PASO 9): explicit LEGACY classification — in-flight rows
      // created before A-03.4 complete through the historical path and are
      // stamped LEGACY. They are never migrated to a new version nor
      // reinterpreted as versioned.
      if (completedStep === 4 && !knowledgeVersionedScoring && !application.knowledgeVersioningStatus) {
        updateData.knowledgeVersioningStatus = 'LEGACY'
      }

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
        // Integridad scores
        const s = stepScores as { integrityScore: number }
        updateData.integrityScore = s.integrityScore
      }

      if (completedStep === 4 && stepScores) {
        // Knowledge score
        const s = stepScores as { knowledgeScore: number | null }
        updateData.knowledgeScore = s.knowledgeScore
      }

      // Determine next step
      // Steps: 0=data, 1=psicometrica, 2=psicologica, 3=integridad, 4=conocimientos, 5=done
      let nextStep = completedStep + 1
      let completed = false

      // Skip steps that are not included
      if (nextStep === 1 && !vacancy.includePsicometrica) nextStep = 2
      if (nextStep === 2 && !vacancy.includePsicologica) nextStep = 3
      if (nextStep === 3 && (vacancy.includeIntegridad === false)) nextStep = 4

      // Check if there are knowledge questions (from vacancy or position template)
      if (nextStep === 4) {
        const questionCount = await db.vacancyQuestion.count({
          where: { vacancyId: vacancy.id },
        })
        if (questionCount === 0) {
          // Also check if position has CONOCIMIENTOS template questions
          const systemQuestions = await getSystemQuestions(vacancy.companyId, vacancy.includeIntegridad ?? true)
          if (systemQuestions.knowledgeQuestions.length === 0) {
            nextStep = 5
          }
        }
      }

      // Step 5 is completion
      if (nextStep === 5) {
        completed = true
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
        updateData.currentStep = 5
        updateData.videoType = 'SKIPPED'
        updateData.videoUrl = null
      }

      // Step 6+ is also done (backward compat)
      if (nextStep >= 6) {
        completed = true
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
        updateData.currentStep = nextStep
      } else if (!completed) {
        updateData.currentStep = nextStep
      }

      // ── A-03.4 ORDERING FIX (within /api/public/apply scope): ──
      // Persist the step scores (e.g. the knowledgeScore scored from the
      // frozen administration) BEFORE computing the overall score. The
      // previous order computed calculateOverallScore() from a row that did
      // NOT yet contain the scores of the completing step, so the overall
      // silently excluded knowledge whenever completion happened on the
      // knowledge step. The scoring FORMULA (calculateOverallScore weights)
      // is unchanged — only the persist→compute order.
      await db.vacancyApplication.update({
        where: { id: applicationId },
        data: updateData,
      })

      if (completed) {
        // Calculate overall score — now sees the persisted step scores
        const overall = await calculateOverallScore(applicationId)
        if (overall) {
          await db.vacancyApplication.update({
            where: { id: applicationId },
            data: {
              overallScore: overall.overallScore,
              recommendation: overall.guidance,
              summary: overall.summary,
              // A-04.5: persist the canonical formula version + section audit
              formulaVersion: overall.formulaVersion,
              includedSections: serializeSections(overall.includedSections),
              excludedSections: serializeSections(overall.excludedSections),
              excludedReasons: serializeExcludedReasons(overall.excludedReasons),
            },
          })
        }
      }

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
              const { hashPassword } = await import('@/lib/password')
              candidateUser = await db.user.create({
                data: {
                  email: updatedApp.candidateEmail,
                  name: updatedApp.candidateName,
                  password: await hashPassword(`candidate_${Date.now()}`),
                  role: 'CANDIDATO',
                  companyId,
                  phone: updatedApp.candidatePhone,
                  // DO NOT auto-consent: LFPDPPP Art. 8 requires explicit consent from the data subject
                  consentGiven: false,
                  consentOption: null,
                  anonymousStats: false,
                  consentConfirmed: false,
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
                  integrityScore: updatedApp.integrityScore || 0,
                  overallScore: updatedApp.overallScore || 0,
                  recommendation: updatedApp.recommendation || 'PENDIENTE',
                  summary: updatedApp.summary,
                  // A-04.5: propagate canonical formula version + section audit
                  formulaVersion: updatedApp.formulaVersion,
                  includedSections: updatedApp.includedSections,
                  excludedSections: updatedApp.excludedSections,
                  excludedReasons: updatedApp.excludedReasons,
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
