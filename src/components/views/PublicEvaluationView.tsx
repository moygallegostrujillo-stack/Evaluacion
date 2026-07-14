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
import {
  Briefcase, User, Mail, Phone, Calendar, ArrowRight,
  Video, CheckCircle2, Clock, Brain, BookOpen, ClipboardList,
  AlertCircle, MessageCircle, Send
} from 'lucide-react'

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

type PublicStep = 'loading' | 'vacancy-info' | 'candidate-data' | 'psicometrica' | 'psicologica' | 'conocimientos' | 'video' | 'complete'

const LIKERT_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
]

const STEP_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  psicometrica: { label: 'Evaluación Psicométrica', icon: <Brain className="w-5 h-5" />, color: 'bg-violet-100 text-violet-700' },
  psicologica: { label: 'Evaluación Psicológica', icon: <ClipboardList className="w-5 h-5" />, color: 'bg-sky-100 text-sky-700' },
  conocimientos: { label: 'Conocimientos Técnicos', icon: <BookOpen className="w-5 h-5" />, color: 'bg-amber-100 text-amber-700' },
}

export default function PublicEvaluationView() {
  const slug = useAppStore((s) => s.vacancySlug)
  const applicationId = useAppStore((s) => s.vacancyApplicationId)
  const setApplicationId = useAppStore((s) => s.setVacancyApplicationId)
  const answers = useAppStore((s) => s.vacancyAnswers)
  const setAnswer = useAppStore((s) => s.setVacancyAnswer)

  const [step, setStep] = useState<PublicStep>('loading')
  const [vacancy, setVacancy] = useState<VacancyInfo | null>(null)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Candidate data form
  const [candidateName, setCandidateName] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidatePhone, setCandidatePhone] = useState('')
  const [candidateAge, setCandidateAge] = useState('')

  // WhatsApp notification tracking
  const [videoSentViaWhatsApp, setVideoSentViaWhatsApp] = useState(false)
  const [notifySent, setNotifySent] = useState(false)

  // ============================================
  // Load vacancy info
  // ============================================
  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch(`/api/public/vacancy?slug=${encodeURIComponent(slug)}`)
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
  // Resume existing application
  // ============================================
  const resumeApplication = useCallback(async (appId: string) => {
    try {
      const res = await fetch(`/api/public/apply?applicationId=${appId}`)
      const data = await res.json()
      if (data.error) {
        setStep('vacancy-info')
        return
      }
      // Determine which step to resume to
      const currentStep = data.currentStep || 0
      mapStepToView(currentStep, data)
    } catch {
      setStep('vacancy-info')
    }
  }, [])

  const mapStepToView = (stepNum: number, data?: any) => {
    switch (stepNum) {
      case 0: setStep('candidate-data'); break
      case 1: loadStepQuestions('psicometrica'); break
      case 2: loadStepQuestions('psicologica'); break
      case 3: loadStepQuestions('conocimientos'); break
      case 4: setStep('video'); break
      case 5: setStep('complete'); break
      default: setStep('candidate-data')
    }
  }

  // ============================================
  // Load questions for a step
  // ============================================
  const loadStepQuestions = useCallback(async (section: string) => {
    if (!applicationId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/public/apply?applicationId=${applicationId}`)
      const data = await res.json()
      if (data.questions && data.questions.length > 0) {
        const sectionQuestions = data.questions.filter((q: QuestionData) => {
          if (section === 'psicometrica') return q.category !== 'KNOWLEDGE' && (q.category === 'OPENNESS' || q.category === 'CONSCIENTIOUSNESS' || q.category === 'EXTRAVERSION' || q.category === 'AGREEABLENESS' || q.category === 'NEUROTICISM')
          if (section === 'psicologica') return q.category === 'STRESS' || q.category === 'EMPATHY' || q.category === 'ADAPTABILITY' || q.category === 'LEADERSHIP' || q.category === 'TEAMWORK'
          if (section === 'conocimientos') return q.category === 'KNOWLEDGE'
          return false
        })
        setQuestions(sectionQuestions.length > 0 ? sectionQuestions : data.questions)
        setCurrentQIndex(0)
        setStep(section as PublicStep)
      }
    } catch (e) {
      console.error('Error loading questions', e)
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  // ============================================
  // Start application (submit candidate data)
  // ============================================
  const handleStartApplication = async () => {
    if (!candidateName.trim() || !candidateEmail.trim() || !slug) return
    setLoading(true)
    try {
      const res = await fetch('/api/public/apply', {
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
      // Move to step 1 (psicometrica) - pass applicationId directly
      await advanceStepWithId(0, newAppId)
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
      await fetch('/api/public/apply', {
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
      case 'video': return 4
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
      const res = await fetch('/api/public/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'advance',
          applicationId: appId,
          completedStep,
        }),
      })
      const data = await res.json()
      if (data.nextStep !== undefined) {
        mapStepToView(data.nextStep, data)
      }
      if (data.completed) {
        setStep('video')
      }
    } catch (e) {
      console.error('Error advancing step', e)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // Complete video step (WhatsApp or skip)
  // ============================================
  const handleCompleteVideoStep = async (videoSent: boolean) => {
    if (!applicationId) return
    setLoading(true)
    try {
      const res = await fetch('/api/public/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          videoSent,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('complete')
      } else {
        alert(data.error || 'Error al completar')
      }
    } catch {
      alert('Error de conexión')
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
    const steps = ['candidate-data', 'psicometrica', 'psicologica', 'conocimientos', 'video', 'complete']
    const idx = steps.indexOf(step)
    const questionProgress = questions.length > 0 ? currentQIndex / questions.length : 0
    return Math.round(((idx + questionProgress) / steps.length) * 100)
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

      {/* Progress bar */}
      {step !== 'vacancy-info' && step !== 'loading' && step !== 'complete' && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <Progress value={getProgressPercent()} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">Progreso</span>
            <span className="text-xs text-gray-400">{getProgressPercent()}%</span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 flex-1">
        {/* ===================== VACANCY INFO ===================== */}
        {step === 'vacancy-info' && vacancy && (
          <div className="space-y-6">
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
                <h3 className="font-semibold mb-4">Proceso de evaluación</h3>
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center"><MessageCircle className="w-4 h-4" /></div>
                    <div><p className="text-sm font-medium">Video de Presentación</p><p className="text-xs text-gray-500">Envíalo por WhatsApp</p></div>
                  </div>
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

        {/* ===================== EVALUATION STEPS ===================== */}
        {(step === 'psicometrica' || step === 'psicologica' || step === 'conocimientos') && questions.length > 0 && (
          <div className="space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${STEP_LABELS[step]?.color || 'bg-gray-100'}`}>
                {STEP_LABELS[step]?.icon || <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="font-bold text-lg">{STEP_LABELS[step]?.label || 'Evaluación'}</h2>
                <p className="text-xs text-gray-500">Pregunta {currentQIndex + 1} de {questions.length}</p>
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

        {/* ===================== VIDEO STEP (WhatsApp) ===================== */}
        {step === 'video' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Video de Presentación</h2>
              <p className="text-gray-500 mt-1">Envía tu video por WhatsApp para completar tu aplicación</p>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-2">Instrucciones:</h3>
                  <ol className="space-y-2 text-sm text-emerald-700">
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <span>Graba un video de máximo 1 minuto presentándote</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Dime tu nombre, experiencia y por qué te interesa el puesto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Envíalo por WhatsApp usando el botón de abajo</span>
                    </li>
                  </ol>
                </div>

                {vacancy?.companyPhone ? (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                    onClick={() => {
                      window.open(
                        getWhatsAppLink(vacancy.companyPhone!, `¡Hola! Soy ${candidateName || 'candidato'} y acabo de completar mi evaluación para la vacante de ${vacancy?.title || ''}. Adjunto mi video de presentación. ¡Gracias!`),
                        '_blank'
                      )
                      setVideoSentViaWhatsApp(true)
                    }}
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Enviar Video por WhatsApp
                  </Button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-amber-700">
                      La empresa aún no ha configurado un número de WhatsApp. 
                      Puedes continuar y te contactarán por correo.
                    </p>
                  </div>
                )}

                {/* Confirmation after opening WhatsApp */}
                {videoSentViaWhatsApp && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-3">
                      <strong>¿Ya enviaste tu video por WhatsApp?</strong>
                    </p>
                    <p className="text-xs text-blue-600 mb-3">
                      Confirma que ya enviaste tu video para continuar. Si aún no lo envías, puedes hacerlo después.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleCompleteVideoStep(true)}
                        disabled={loading}
                      >
                        {loading ? 'Guardando...' : 'Sí, ya envié mi video'} <CheckCircle2 className="w-4 h-4 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVideoSentViaWhatsApp(false)}
                      >
                        Aún no
                      </Button>
                    </div>
                  </div>
                )}

                {!videoSentViaWhatsApp && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCompleteVideoStep(false)}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Continuar sin video'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================== COMPLETE ===================== */}
        {step === 'complete' && (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">¡Evaluación Completada!</h1>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Gracias por completar tu evaluación. La empresa revisará tu perfil y te contactará si eres seleccionado/a.
              </p>
            </div>
            <Card className="shadow-md border-0 bg-emerald-50/50">
              <CardContent className="p-6">
                <p className="text-sm text-emerald-800">
                  <strong>Importante:</strong> Los resultados de tu evaluación son confidenciales y solo serán revisados por el equipo de Recursos Humanos de la empresa. No recibirás ninguna calificación ni retroalimentación automática.
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
