'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Briefcase, User, Mail, Phone, Calendar, ArrowRight,
  CheckCircle2, Clock, Brain, BookOpen, ClipboardList,
  AlertCircle, MessageCircle, Send, Shield, Info,
  ChevronRight, ListChecks, Download
} from 'lucide-react'
import { apiFetch } from '@/lib/api'

// ============================================
// Types
// ============================================

interface VacancyInfo {
  id?: string
  title: string
  description: string | null
  sector: string
  company?: string
  companyName?: string
  companyPhone?: string
  knowledgeQuestionCount: number
  includePsicometrica?: boolean
  includePsicologica?: boolean
  maxVideoSeconds?: number
}

interface QuestionData {
  id: string
  text: string
  type: string
  options?: string[] | null
  category: string
  order: number
  reverseScored: boolean
  questionId?: string
  vacancyQuestionId?: string
}

type PublicStep = 'loading' | 'vacancy-info' | 'candidate-data' | 'consent' | 'section-intro' | 'psicometrica' | 'psicologica' | 'conocimientos' | 'complete'

const LIKERT_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
]

const STEP_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string; bgGradient: string; description: string }> = {
  psicometrica: {
    label: 'Evaluación Psicométrica',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-violet-100 text-violet-700',
    bgGradient: 'from-violet-500 to-purple-600',
    description: 'Test de personalidad Big Five — mide tu perfil de competencias y rasgos de personalidad.'
  },
  psicologica: {
    label: 'Evaluación Psicológica',
    icon: <ClipboardList className="w-5 h-5" />,
    color: 'bg-sky-100 text-sky-700',
    bgGradient: 'from-sky-500 to-blue-600',
    description: 'Evalúa factores como estrés, empatía, adaptabilidad, liderazgo y trabajo en equipo.'
  },
  conocimientos: {
    label: 'Conocimientos Técnicos',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-amber-100 text-amber-700',
    bgGradient: 'from-amber-500 to-orange-600',
    description: 'Preguntas específicas sobre el puesto para evaluar tu conocimiento técnico.'
  },
}

export default function PublicEvaluationView() {
  const slug = useAppStore((s) => s.vacancySlug)
  const applicationId = useAppStore((s) => s.vacancyApplicationId)
  const setApplicationId = (id: string | null) => {
    useAppStore.getState().setVacancyApplicationId(id)
    if (id) {
      localStorage.setItem('evaluhr_vacancy_app_id', id)
    } else {
      localStorage.removeItem('evaluhr_vacancy_app_id')
      localStorage.removeItem('evaluhr_vacancy_slug')
    }
  }
  const answers = useAppStore((s) => s.vacancyAnswers)
  const setAnswer = useAppStore((s) => s.setVacancyAnswer)

  const [step, setStep] = useState<PublicStep>('loading')
  const [vacancy, setVacancy] = useState<VacancyInfo | null>(null)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  // Track which section is being introduced (for section-intro step)
  const [introSection, setIntroSection] = useState<string>('psicometrica')

  // Candidate data form
  const [candidateName, setCandidateName] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidatePhone, setCandidatePhone] = useState('')
  const [candidateAge, setCandidateAge] = useState('')

  // Consent state
  const [consentAccepted, setConsentAccepted] = useState(false)

  // WhatsApp notification tracking
  const [notifySent, setNotifySent] = useState(false)

  // Clean up localStorage when evaluation completes
  useEffect(() => {
    if (step === 'complete') {
      localStorage.removeItem('evaluhr_vacancy_app_id')
      localStorage.removeItem('evaluhr_vacancy_slug')
    }
  }, [step])

  // ============================================
  // Load vacancy info
  // ============================================
  useEffect(() => {
    if (!slug) return
    setLoading(true)
    apiFetch(`/api/public/vacancy?slug=${encodeURIComponent(slug)}`, { skipAuth: true })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStep('loading')
          return
        }
        setVacancy(data.vacancy || data)
        // Check if already have applicationId (resuming)
        if (applicationId) {
          resumeApplication(applicationId)
        } else {
          setStep('vacancy-info')
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  // ============================================
  // Navigation helpers (regular functions to avoid circular useCallback deps)
  // ============================================

  // Skip to next section when current has no questions
  const skipToNextSection = async (currentSection: string) => {
    const sectionStepMap: Record<string, number> = {
      psicometrica: 1,
      psicologica: 2,
      conocimientos: 3,
    }
    const completedStep = sectionStepMap[currentSection]
    if (completedStep && applicationId) {
      try {
        const res = await apiFetch('/api/public/apply', {
          skipAuth: true,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: 'advance',
            applicationId,
            completedStep,
          }),
        })
        const data = await res.json()
        if (data.completed) {
          setStep('complete')
        } else if (data.nextStep !== undefined) {
          await mapStepToView(data.nextStep, data)
        } else {
          setStep('complete')
        }
      } catch (e) {
        console.error('Error skipping section', e)
        setStep('complete')
      }
    } else {
      setStep('complete')
    }
  }

  // Map a step number to the corresponding view
  const mapStepToView = async (stepNum: number, data?: any) => {
    switch (stepNum) {
      case 0: setStep('candidate-data'); break
      case 1: await goToSectionIntro('psicometrica', data); break
      case 2: await goToSectionIntro('psicologica', data); break
      case 3: await goToSectionIntro('conocimientos', data); break
      case 4: setStep('complete'); break
      case 5: setStep('complete'); break
      default: setStep('candidate-data')
    }
  }

  // Go to section intro (splash before questions)
  const goToSectionIntro = async (section: string, data?: any) => {
    if (!applicationId) return
    setLoading(true)
    try {
      // Always fetch questions fresh from the API using applicationId
      // The `data` param may come from advanceStep and won't have questions
      const res = await apiFetch(`/api/public/apply?applicationId=${applicationId}`, { skipAuth: true })
      const sectionData = await res.json()

      // If API returned an error, skip this section
      if (sectionData.error) {
        console.error('API error loading section:', sectionData.error)
        await skipToNextSection(section)
        return
      }

      if (sectionData.questions && sectionData.questions.length > 0) {
        const sectionQuestions = sectionData.questions.filter((q: QuestionData) => {
          if (section === 'psicometrica') return q.category !== 'KNOWLEDGE' && (q.category === 'OPENNESS' || q.category === 'CONSCIENTIOUSNESS' || q.category === 'EXTRAVERSION' || q.category === 'AGREEABLENESS' || q.category === 'NEUROTICISM')
          if (section === 'psicologica') return q.category === 'STRESS' || q.category === 'EMPATHY' || q.category === 'ADAPTABILITY' || q.category === 'LEADERSHIP' || q.category === 'TEAMWORK'
          if (section === 'conocimientos') return q.category === 'KNOWLEDGE'
          return false
        })

        if (sectionQuestions.length > 0) {
          setQuestions(sectionQuestions)
          setCurrentQIndex(0)
          setIntroSection(section)
          setStep('section-intro')
        } else {
          // Questions exist but none match this section's category — skip to next
          await skipToNextSection(section)
        }
      } else {
        // No questions returned for this section — skip to next
        await skipToNextSection(section)
      }
    } catch (e) {
      console.error('Error loading section intro', e)
      // On fetch error, try to skip to next section
      await skipToNextSection(section)
    } finally {
      setLoading(false)
    }
  }

  // Load questions for a step (actual questions)
  const loadStepQuestions = async (section: string) => {
    if (!applicationId) return
    setLoading(true)
    try {
      const res = await apiFetch(`/api/public/apply?applicationId=${applicationId}`, { skipAuth: true })
      const data = await res.json()
      if (data.questions && data.questions.length > 0) {
        const sectionQuestions = data.questions.filter((q: QuestionData) => {
          if (section === 'psicometrica') return q.category !== 'KNOWLEDGE' && (q.category === 'OPENNESS' || q.category === 'CONSCIENTIOUSNESS' || q.category === 'EXTRAVERSION' || q.category === 'AGREEABLENESS' || q.category === 'NEUROTICISM')
          if (section === 'psicologica') return q.category === 'STRESS' || q.category === 'EMPATHY' || q.category === 'ADAPTABILITY' || q.category === 'LEADERSHIP' || q.category === 'TEAMWORK'
          if (section === 'conocimientos') return q.category === 'KNOWLEDGE'
          return false
        })
        if (sectionQuestions.length > 0) {
          setQuestions(sectionQuestions)
          setCurrentQIndex(0)
          setStep(section as PublicStep)
        } else {
          await skipToNextSection(section)
        }
      } else {
        await skipToNextSection(section)
      }
    } catch (e) {
      console.error('Error loading questions', e)
      await skipToNextSection(section)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // Resume existing application
  // ============================================
  const resumeApplication = useCallback(async (appId: string) => {
    try {
      const res = await apiFetch(`/api/public/apply?applicationId=${appId}`, { skipAuth: true })
      const data = await res.json()
      if (data.error) {
        setStep('vacancy-info')
        return
      }
      // Determine which step to resume to
      // API returns `step` not `currentStep`
      const currentStep = data.step ?? data.currentStep ?? 0
      // Step 4/5 means done; step 0 means data entry (show consent if not yet accepted)
      if (currentStep === 0) {
        setStep('candidate-data')
      } else if (currentStep >= 4) {
        setStep('complete')
      } else {
        await mapStepToView(currentStep, data)
      }
    } catch {
      setStep('vacancy-info')
    }
  }, [])

  // ============================================
  // Start application (submit candidate data)
  // ============================================
  const handleStartApplication = async () => {
    if (!candidateName.trim() || !candidateEmail.trim() || !slug) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/public/apply', {
        skipAuth: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'data',
          vacancySlug: slug,
          name: candidateName.trim(),
          email: candidateEmail.trim(),
          phone: candidatePhone.trim() || undefined,
          age: candidateAge ? parseInt(candidateAge) : undefined,
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
        return
      }
      const newAppId = data.applicationId
      setApplicationId(newAppId)
      // Move to consent step first
      setStep('consent')
    } catch {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // Save answer
  // ============================================
  const handleAnswer = async (questionId: string, value: number | string, numericValue?: number) => {
    setAnswer(questionId, value)
    // Save to backend
    if (applicationId) {
      const currentQuestion = questions[currentQIndex]
      await apiFetch('/api/public/apply', {
        skipAuth: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'answer',
          applicationId,
          section: step.toUpperCase(),
          questionId: currentQuestion?.questionId,
          vacancyQuestionId: currentQuestion?.vacancyQuestionId,
          value: String(value),
          numericValue: numericValue,
        }),
      })
    }
  }

  // ============================================
  // Next question or advance step
  // ============================================
  const handleNext = async () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1)
    } else {
      // Step completed, advance
      const stepNum = getStepNumber(step)
      await advanceStep(stepNum)
    }
  }

  const getStepNumber = (s: PublicStep): number => {
    switch (s) {
      case 'candidate-data': return 0
      case 'psicometrica': return 1
      case 'psicologica': return 2
      case 'conocimientos': return 3
      default: return 0
    }
  }

  const advanceStep = async (completedStep: number) => {
    if (!applicationId) return
    await advanceStepWithId(completedStep, applicationId)
  }

  const advanceStepWithId = async (completedStep: number, appId: string) => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/public/apply', {
        skipAuth: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'advance',
          applicationId: appId,
          completedStep,
        }),
      })
      const data = await res.json()
      if (data.completed) {
        setStep('complete')
      } else if (data.nextStep !== undefined) {
        await mapStepToView(data.nextStep, data)
      }
    } catch (e) {
      console.error('Error advancing step', e)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // Generate WhatsApp link
  // ============================================
  const getWhatsAppLink = (phone: string | undefined, message: string) => {
    if (!phone) return '#'
    // Clean phone number - remove spaces, dashes, parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    // Ensure it starts with country code (Mexico: 52)
    let formattedPhone = cleanPhone
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '52' + cleanPhone.substring(1)
    } else if (!cleanPhone.startsWith('52') && !cleanPhone.startsWith('+')) {
      formattedPhone = '52' + cleanPhone
    }
    if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1)
    }
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
  }

  // ============================================
  // Calculate progress
  // ============================================
  const getProgressPercent = () => {
    const steps = ['candidate-data', 'consent', 'psicometrica', 'psicologica', 'conocimientos', 'complete']
    const idx = steps.indexOf(step)
    const questionProgress = questions.length > 0 ? currentQIndex / questions.length : 0
    return Math.round(((idx + questionProgress) / steps.length) * 100)
  }

  // Get current evaluation section from step
  const getCurrentSection = (): string => {
    if (step === 'psicometrica' || step === 'psicologica' || step === 'conocimientos') return step
    return ''
  }

  // ============================================
  // RENDER
  // ============================================

  if (loading && step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!vacancy && step !== 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vacante no encontrada</h2>
            <p className="text-gray-500">El enlace que seguiste no corresponde a una vacante activa. Verifica con la empresa.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <span className="font-bold">EvaluHR</span>
          </div>
          {vacancy && (
            <div className="text-right">
              <p className="text-xs text-gray-500">{vacancy.company || vacancy.companyName}</p>
              <p className="text-xs font-medium text-emerald-600">{vacancy.title}</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar - show during evaluation steps */}
      {(getCurrentSection() || step === 'section-intro') && questions.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {/* Evaluation type badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${STEP_LABELS[introSection || getCurrentSection()]?.color || 'bg-gray-100'}`}>
                  {STEP_LABELS[introSection || getCurrentSection()]?.icon || <BookOpen className="w-4 h-4" />}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {STEP_LABELS[introSection || getCurrentSection()]?.label || 'Evaluación'}
                </span>
              </div>
              {getCurrentSection() && (
                <span className="text-sm font-bold text-emerald-600">
                  {currentQIndex + 1} de {questions.length}
                </span>
              )}
            </div>
            {/* Progress bar */}
            <Progress
              value={getCurrentSection() ? ((currentQIndex + 1) / questions.length) * 100 : 0}
              className="h-2"
            />
            {getCurrentSection() && (
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">Pregunta {currentQIndex + 1}</span>
                <span className="text-xs text-gray-400">{Math.round(((currentQIndex + 1) / questions.length) * 100)}% de esta sección</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 flex-1">
        {/* ===================== VACANCY INFO ===================== */}
        {step === 'vacancy-info' && vacancy && (
          <div className="space-y-6">
            {/* Intro message about what this link is about */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-bold text-emerald-900 text-lg">Proceso de Evaluación Laboral</h2>
                  <p className="text-sm text-emerald-700 mt-1">
                    Has sido invitado/a a participar en el proceso de evaluación para el puesto de <strong>{vacancy.title}</strong> en <strong>{vacancy.company || vacancy.companyName}</strong>.
                  </p>
                </div>
              </div>
              <p className="text-sm text-emerald-800 pl-13">
                Este proceso incluye evaluaciones que nos ayudan a conocer tu perfil profesional. Tus respuestas son <strong>confidenciales</strong> y serán utilizadas exclusivamente para el proceso de selección.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{vacancy.title}</h1>
              <p className="text-gray-500 mt-1">{vacancy.company || vacancy.companyName}</p>
              {vacancy.description && (
                <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">{vacancy.description}</p>
              )}
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">¿Qué incluye la evaluación?</h3>
                <div className="space-y-3">
                  {vacancy.includePsicometrica !== false && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center"><Brain className="w-4 h-4" /></div>
                      <div><p className="text-sm font-medium">Evaluación Psicométrica</p><p className="text-xs text-gray-500">Test de personalidad Big Five</p></div>
                    </div>
                  )}
                  {vacancy.includePsicologica !== false && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"><ClipboardList className="w-4 h-4" /></div>
                      <div><p className="text-sm font-medium">Evaluación Psicológica</p><p className="text-xs text-gray-500">Estrés, empatía, adaptabilidad, liderazgo</p></div>
                    </div>
                  )}
                  {vacancy.knowledgeQuestionCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><BookOpen className="w-4 h-4" /></div>
                      <div><p className="text-sm font-medium">Conocimientos Técnicos</p><p className="text-xs text-gray-500">{vacancy.knowledgeQuestionCount} preguntas específicas</p></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
              onClick={() => setStep('candidate-data')}
            >
              Comenzar Evaluación <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* ===================== CANDIDATE DATA ===================== */}
        {step === 'candidate-data' && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Tus Datos
              </CardTitle>
              <CardDescription>Necesitamos algunos datos para poder contactarte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre completo *</Label>
                <Input id="name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Tu nombre completo" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input id="email" type="email" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} placeholder="correo@ejemplo.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={candidatePhone} onChange={(e) => setCandidatePhone(e.target.value)} placeholder="+52 961 123 4567" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="age">Edad</Label>
                <Input id="age" type="number" min="16" max="99" value={candidateAge} onChange={(e) => setCandidateAge(e.target.value)} placeholder="25" className="mt-1" />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4"
                onClick={handleStartApplication}
                disabled={loading || !candidateName.trim() || !candidateEmail.trim()}
              >
                {loading ? 'Guardando...' : 'Comenzar Evaluación'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ===================== CONSENT STEP ===================== */}
        {step === 'consent' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Consentimiento Informado</h2>
              <p className="text-gray-500 mt-1">Antes de comenzar, necesitamos tu consentimiento</p>
            </div>

            <Card className="shadow-lg border-0 border-2 border-emerald-200">
              <CardContent className="p-6 space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
                  <p className="text-sm text-amber-900 font-medium">
                    Está a punto de realizar una evaluación que incluye pruebas psicométricas, psicológicas y de conocimientos.
                  </p>
                  <p className="text-sm text-amber-800">
                    Los resultados serán utilizados exclusivamente para el proceso de selección laboral.
                  </p>
                  <div className="flex items-start gap-2 bg-amber-100/50 p-2 rounded-md">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Sus datos son considerados <strong>Datos Personales Sensibles</strong> conforme a la LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) y la NOM-035-STPS-2018.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-3 max-h-64 overflow-y-auto">
                  <p className="font-semibold">AVISO DE PRIVACIDAD Y CONSENTIMIENTO</p>
                  <p>
                    De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP),
                    se le informa que sus datos personales serán tratados de manera confidencial.
                  </p>
                  <p><strong>Datos que se recopilan:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Nombre completo y correo electrónico</li>
                    <li>Teléfono (opcional)</li>
                    <li>Respuestas a evaluaciones psicométricas y psicológicas</li>
                    <li>Resultados de evaluaciones de conocimientos</li>
                  </ul>
                  <p><strong>Finalidad del tratamiento:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Realizar pre-evaluaciones para procesos de reclutamiento</li>
                    <li>Generar perfiles de competencias y recomendaciones</li>
                    <li>Facilitar el proceso de selección laboral</li>
                  </ul>
                  <p><strong>Base legal:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>LFPDPPP Art. 8: Consentimiento expreso y por escrito para datos personales sensibles</li>
                    <li>NOM-035-STPS-2018: Identificación de factores de riesgo psicosocial</li>
                    <li>LFT Art. 132: Obligaciones del patrón en la relación laboral</li>
                  </ul>
                  <p><strong>Quién puede ver sus resultados:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Personal de Recursos Humanos de la empresa</li>
                    <li>Gerentes del área correspondiente</li>
                  </ul>
                  <p><strong>Sus derechos ARCO:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>A</strong>cceder a sus datos personales</li>
                    <li><strong>R</strong>ectificar datos inexactos</li>
                    <li><strong>C</strong>ancelar sus datos</li>
                    <li><strong>O</strong>ponerse al tratamiento de sus datos</li>
                  </ul>
                  <p>
                    Al aceptar, usted consiente el tratamiento de sus datos personales para los fines señalados.
                    Sus datos no serán compartidos con terceros sin su autorización expresa.
                  </p>
                  <p className="text-xs text-gray-500">
                    Responsable: {vacancy?.companyName || 'La empresa correspondiente'}<br/>
                    Tuxtla Gutiérrez, Chiapas, México
                  </p>
                </div>

                <div className="flex items-start space-x-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <Checkbox
                    id="consent-public"
                    checked={consentAccepted}
                    onCheckedChange={(checked) => setConsentAccepted(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="consent-public" className="text-sm text-emerald-900 cursor-pointer leading-tight">
                    Acepto que mis respuestas serán tratadas como datos personales sensibles y consiento someterme a esta evaluación de forma voluntaria.
                    Entiendo que los resultados serán confidenciales y utilizados solo para el proceso de selección.
                  </label>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                  disabled={!consentAccepted || loading}
                  onClick={async () => {
                    setLoading(true)
                    try {
                      // Advance to first evaluation step
                      await advanceStepWithId(0, applicationId!)
                    } catch {
                      console.error('Error advancing after consent')
                    } finally {
                      setLoading(false)
                    }
                  }}
                >
                  Aceptar y Comenzar <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <a
                  href="/Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf"
                  download
                  className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 hover:underline w-full mt-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar Aviso de Privacidad completo (PDF)
                </a>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================== SECTION INTRO ===================== */}
        {step === 'section-intro' && questions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${STEP_LABELS[introSection]?.bgGradient || 'from-emerald-500 to-teal-600'} text-white mb-4 shadow-lg`}>
                {STEP_LABELS[introSection]?.icon || <BookOpen className="w-10 h-10" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {STEP_LABELS[introSection]?.label || 'Evaluación'}
              </h2>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {STEP_LABELS[introSection]?.description || ''}
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                {/* Question count highlight */}
                <div className="bg-gray-50 rounded-xl p-5 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <ListChecks className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Total de preguntas</span>
                  </div>
                  <div className="text-4xl font-bold text-emerald-600">
                    {questions.length}
                  </div>
                  <p className="text-sm text-gray-500">
                    {questions.length === 1 ? 'pregunta' : 'preguntas'} a responder
                  </p>
                </div>

                {/* Info about the evaluation */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 space-y-1">
                      <p><strong>Responde con honestidad.</strong> No hay respuestas correctas o incorrectas en las evaluaciones psicométricas y psicológicas.</p>
                      {introSection === 'conocimientos' && (
                        <p>En esta sección, selecciona la respuesta que consideres correcta para cada pregunta.</p>
                      )}
                      <p>Tus respuestas son <strong>confidenciales</strong> y solo serán revisadas por Recursos Humanos.</p>
                    </div>
                  </div>
                </div>

                {/* Type of questions */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {questions[0]?.type === 'LIKERT' ? 'Escala Likert (1-5)' : questions[0]?.type === 'MULTIPLE_CHOICE' ? 'Opción múltiple' : questions[0]?.type}
                  </Badge>
                  <span>•</span>
                  <span>Avanza a tu ritmo</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
              onClick={() => {
                setStep(introSection as PublicStep)
              }}
              disabled={loading}
            >
              Comenzar <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* ===================== EVALUATION STEPS ===================== */}
        {(step === 'psicometrica' || step === 'psicologica' || step === 'conocimientos') && questions.length > 0 && (
          <div className="space-y-6">
            {/* Step header with prominent counter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${STEP_LABELS[step]?.color || 'bg-gray-100'}`}>
                  {STEP_LABELS[step]?.icon || <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{STEP_LABELS[step]?.label || 'Evaluación'}</h2>
                  <p className="text-xs text-gray-500">Responde con honestidad</p>
                </div>
              </div>
              {/* Prominent question counter badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-emerald-600 font-medium">Pregunta</p>
                <p className="text-lg font-bold text-emerald-700">
                  {currentQIndex + 1}<span className="text-emerald-400 font-normal">/{questions.length}</span>
                </p>
              </div>
            </div>

            {/* Question */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <p className="text-lg font-medium leading-relaxed mb-6">{questions[currentQIndex].text}</p>

                {questions[currentQIndex].type === 'LIKERT' && (
                  <RadioGroup
                    value={String(answers[questions[currentQIndex].id] || '')}
                    onValueChange={(val) => handleAnswer(questions[currentQIndex].id, parseInt(val), parseInt(val))}
                    className="space-y-2"
                  >
                    {LIKERT_OPTIONS.map(opt => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          String(answers[questions[currentQIndex].id]) === String(opt.value)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value={String(opt.value)} />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                )}

                {questions[currentQIndex].type === 'MULTIPLE_CHOICE' && questions[currentQIndex].options && (
                  <RadioGroup
                    value={String(answers[questions[currentQIndex].id] || '')}
                    onValueChange={(val) => handleAnswer(questions[currentQIndex].id, parseInt(val), parseInt(val))}
                    className="space-y-2"
                  >
                    {questions[currentQIndex].options!.map((opt, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          String(answers[questions[currentQIndex].id]) === String(idx)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value={String(idx)} />
                        <span className="text-sm font-medium mr-1">{String.fromCharCode(65 + idx)})</span>
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleNext}
              disabled={answers[questions[currentQIndex].id] === undefined || loading}
            >
              {loading ? 'Guardando...' : currentQIndex < questions.length - 1 ? 'Siguiente' : 'Continuar'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* ===================== COMPLETE ===================== */}
        {step === 'complete' && (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">¡Gracias por completar tu evaluación!</h1>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Evaluaremos tus resultados y nos pondremos en contacto contigo próximamente.
              </p>
            </div>
            <Card className="shadow-md border-0 bg-emerald-50/50">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-emerald-800">
                  <strong>Importante:</strong> Los resultados de tu evaluación son confidenciales y solo serán revisados por el equipo de Recursos Humanos de la empresa.
                </p>
                <p className="text-xs text-emerald-600">
                  Si tienes alguna duda, puedes contactar a Recursos Humanos.
                </p>
              </CardContent>
            </Card>

            {/* WhatsApp notification to HR */}
            {vacancy?.companyPhone && !notifySent && (
              <Card className="shadow-md border-0">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <Send className="w-5 h-5" />
                    <span className="font-semibold">Notifica a la empresa</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ayuda a que la empresa vea tu aplicación más rápido. Notifícales por WhatsApp que ya completaste tu evaluación.
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      window.open(
                        getWhatsAppLink(vacancy.companyPhone!, `¡Hola! Soy ${candidateName || 'un candidato'} y acabo de completar mi evaluación para la vacante de ${vacancy?.title || ''}. Mi correo es ${candidateEmail || ''}. ¡Quedo atento/a!`),
                        '_blank'
                      )
                      setNotifySent(true)
                    }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Notificar por WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}

            {notifySent && (
              <Card className="shadow-md border-0 bg-green-50">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-700 font-medium">¡Notificación enviada!</p>
                  <p className="text-xs text-green-600">La empresa ha sido notificada de tu aplicación.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-gray-200 py-3 text-center text-xs text-gray-400 mt-auto">
        EvaluHR — Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
