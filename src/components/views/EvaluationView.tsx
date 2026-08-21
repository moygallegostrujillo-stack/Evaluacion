'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type EvaluationQuestion, type EvaluationTemplate } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  CheckCircle2, ChevronRight, Clock, ClipboardList, Brain, BookOpen,
  Utensils, ShoppingBag, Briefcase, ArrowRight, Users, Shield, ShieldAlert,
  ShieldCheck, Info, Download, Loader2
} from 'lucide-react'

const LIKERT_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
]

interface AvailablePosition {
  id: string
  title: string
  sector: string
  category: string
  description: string | null
  hasKnowledgeTest: boolean
  company?: { id: string; name: string; sector: string }
  evaluationTemplates: Array<{
    id: string
    type: string
    _count: { questions: number }
  }>
}

interface CompletedSession {
  id: string
  status: string
  positionId: string
  position: { id: string; title: string; category: string; sector: string }
}

type ViewPhase = 'LOADING' | 'SELECT_POSITION' | 'CONSENT' | 'SESSION_READY' | 'SECTION_TRANSITION' | 'IN_PROGRESS' | 'SESSIONS_OVERVIEW'

/**
 * Filter the evaluation templates according to the candidate's consent option.
 * KNOWLEDGE_ONLY candidates never see the sensitive (PSICOMETRICA / PSICOLOGICA / INTEGRIDAD)
 * sections, so we strip them on the client side after fetching from the API.
 */
function filterTemplatesByConsent(
  allTemplates: EvaluationTemplate[],
  consentOption?: string
): EvaluationTemplate[] {
  if (consentOption === 'KNOWLEDGE_ONLY') {
    return allTemplates.filter((t) => t.type === 'CONOCIMIENTOS')
  }
  return allTemplates
}

export default function EvaluationView() {
  const user = useAppStore((s) => s.user)
  const token = useAppStore((s) => s.token)
  const setAuth = useAppStore((s) => s.setAuth)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [phase, setPhase] = useState<ViewPhase>('LOADING')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([])
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | string>>({})
  const [loading, setLoading] = useState(false)
  const [positionTitle, setPositionTitle] = useState('')
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [showSectionTransition, setShowSectionTransition] = useState(false)

  // Withdraw-consent dialog state (LFPDPPP — candidate may withdraw sensitive-data consent at any time)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  // Position selection state
  const [availablePositions, setAvailablePositions] = useState<AvailablePosition[]>([])
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([])
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)

  // Load candidate data on mount
  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    apiFetch(`/api/evaluations?candidateId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const activeSession = data.activeSession
        setCompletedSessions(data.completedSessions || [])
        setAvailablePositions(data.availablePositions || [])

        if (activeSession) {
          // Has active session - restore it
          setSessionId(activeSession.id)
          setPositionTitle(activeSession.position?.title || '')
          if (activeSession.status === 'IN_PROGRESS') {
            setCurrentTemplateIndex(Math.max(0, (activeSession.currentStep || 1) - 1))
            setCurrentQuestionIndex(activeSession.currentQuestionIndex || 0)
            setPhase('IN_PROGRESS')
          } else if (activeSession.status === 'NOT_STARTED') {
            setPhase('CONSENT')
          }
        } else if (data.completedSessions?.length > 0 && data.availablePositions?.length === 0) {
          // All evaluations completed, no more positions
          setCurrentView('evaluation-complete')
        } else if (data.availablePositions?.length > 0) {
          // No active session, has positions to apply for
          if (data.completedSessions?.length > 0) {
            // Has completed evaluations and more available - show overview
            setPhase('SESSIONS_OVERVIEW')
          } else {
            // First time - show position selection
            setPhase('SELECT_POSITION')
          }
        } else {
          // No sessions and no positions available
          setPhase('SELECT_POSITION')
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  // Filter templates by consent option — KNOWLEDGE_ONLY candidates never see
  // the sensitive (PSICOMETRICA / PSICOLOGICA / INTEGRIDAD) sections. This is the frontend
  // mirror of the backend consent gate; the API still returns all templates
  // for the position, so we strip the sensitive ones here.
  // (Helper extracted to module scope — see `filterTemplatesByConsent` above.)

  // Load templates when we have a session
  useEffect(() => {
    if (!sessionId || phase !== 'IN_PROGRESS') return
    const fetchTemplates = async () => {
      const res = await apiFetch(`/api/evaluations?sessionId=${sessionId}`)
      const data = await res.json()
      if (data.templates) {
        setTemplates(filterTemplatesByConsent(data.templates, user?.consentOption))
      }
      if (data.session && data.session.status === 'IN_PROGRESS') {
        setCurrentTemplateIndex(Math.max(0, (data.session.currentStep || 1) - 1))
        setCurrentQuestionIndex(data.session.currentQuestionIndex || 0)
        setPhase('IN_PROGRESS')
        setPositionTitle(data.session.positionTitle || '')
      }
    }
    fetchTemplates()
  }, [sessionId, phase, user?.consentOption])

  const currentTemplate = templates[currentTemplateIndex]
  const currentQuestion = currentTemplate?.questions?.[currentQuestionIndex]

  // IMPORTANT: isInSensitiveSection must be defined AFTER `currentTemplate`
  // (above). Declaring it earlier would hit a temporal-dead-zone error when
  // `currentTemplate` is undefined on first render.
  const isInSensitiveSection =
    currentTemplate?.type === 'PSICOMETRICA' ||
    currentTemplate?.type === 'PSICOLOGICA' ||
    currentTemplate?.type === 'INTEGRIDAD'

  const totalQuestions = templates.reduce((sum, t) => sum + (t.questions?.length || 0), 0)
  const answeredCount = templates.slice(0, currentTemplateIndex).reduce((sum, t) => sum + (t.questions?.length || 0), 0) + currentQuestionIndex
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  // Create a session for the selected position
  const handleCreateSession = async () => {
    if (!selectedPositionId || !user?.id) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-session',
          candidateId: user.id,
          positionId: selectedPositionId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        // If already has active session, use it
        if (data.session) {
          setSessionId(data.session.id)
          setPositionTitle(data.session.positionTitle || '')
          if (data.session.status === 'IN_PROGRESS') {
            setPhase('IN_PROGRESS')
          } else {
            setPhase('CONSENT')
          }
        }
        return
      }
      setSessionId(data.session.id)
      setPositionTitle(data.session.positionTitle || '')
      setPhase('CONSENT')
    } catch (e) {
      console.error('Error creating session', e)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'start' }),
      })
      const data = await res.json()
      if (data.templates) {
        setTemplates(data.templates)
        setCurrentTemplateIndex(0)
        setCurrentQuestionIndex(0)
        // Show section transition for the first section
        setShowSectionTransition(true)
        setPhase('SECTION_TRANSITION')
      }
    } catch (e) {
      console.error('Error starting evaluation', e)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async () => {
    if (!sessionId || !currentQuestion) return
    const answer = answers[currentQuestion.id]
    if (answer === undefined) return

    setLoading(true)
    try {
      await apiFetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'answer',
          questionId: currentQuestion.id,
          value: answer,
          numericValue: typeof answer === 'number' ? answer : null,
        }),
      })

      if (currentQuestionIndex < (currentTemplate?.questions?.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else if (currentTemplateIndex < templates.length - 1) {
        const nextTemplateIdx = currentTemplateIndex + 1
        try {
          const stepRes = await apiFetch('/api/evaluations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, action: 'next-step' }),
          })
          const stepData = await stepRes.json()
          if (stepData.result) {
            setPhase('LOADING')
            setCurrentView('evaluation-complete')
            return
          }
        } catch (e) {
          console.error('Error advancing step', e)
        }
        setCurrentTemplateIndex(nextTemplateIdx)
        setCurrentQuestionIndex(0)
        // Show section transition for the new section
        setShowSectionTransition(true)
        setPhase('SECTION_TRANSITION')
      } else {
        await handleComplete()
      }
    } catch (e) {
      console.error('Error saving answer', e)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'complete' }),
      })
      const data = await res.json().catch(() => ({} as Record<string, unknown>))
      if (!res.ok) {
        console.error('Complete evaluation error:', data)
        // Don't navigate — stay on evaluation so candidate can retry
        return
      }
      setCurrentView('evaluation-complete')
    } catch (e) {
      console.error('Error completing evaluation', e)
    } finally {
      setLoading(false)
    }
  }

  // Withdraw consent for sensitive-data processing (FULL → KNOWLEDGE_ONLY).
  // Per LFPDPPP Art. 8 the candidate may revoke consent for sensitive data at
  // any time. After withdrawal the candidate continues with the CONOCIMIENTOS
  // section only; sensitive responses already captured are flagged for deletion.
  const handleWithdrawConsent = async () => {
    if (!user?.id) return
    setWithdrawing(true)
    setWithdrawError(null)
    try {
      const res = await apiFetch('/api/consent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json().catch(() => ({} as Record<string, unknown>))
      if (!res.ok) {
        setWithdrawError(
          (typeof data.error === 'string' && data.error) ||
            'No se pudo retirar el consentimiento. Intenta nuevamente.'
        )
        return
      }
      // Update store so the rest of the app reflects the new consent option
      if (token) {
        setAuth({ ...user, consentOption: 'KNOWLEDGE_ONLY' }, token)
      }
      // Filter the in-memory template list to only the CONOCIMIENTOS section
      const knowledgeTemplates = templates.filter(
        (t) => t.type === 'CONOCIMIENTOS'
      )
      setTemplates(knowledgeTemplates)
      setCurrentTemplateIndex(0)
      setCurrentQuestionIndex(0)
      setShowSectionTransition(true)
      setPhase('SECTION_TRANSITION')
      setShowWithdrawDialog(false)
    } catch {
      setWithdrawError('Error de conexión. Intenta nuevamente.')
    } finally {
      setWithdrawing(false)
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return <Brain className="w-5 h-5" />
      case 'PSICOLOGICA': return <ClipboardList className="w-5 h-5" />
      case 'CONOCIMIENTOS': return <BookOpen className="w-5 h-5" />
      case 'INTEGRIDAD': return <ShieldCheck className="w-5 h-5" />
      default: return null
    }
  }

  const getStepLabel = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return 'Psicométrica'
      case 'PSICOLOGICA': return 'Psicológica'
      case 'CONOCIMIENTOS': return 'Conocimientos'
      case 'INTEGRIDAD': return 'Integridad'
      default: return type
    }
  }

  const getStepDescription = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return 'Evalúa tu perfil de personalidad a través del modelo Big Five: apertura a la experiencia, responsabilidad, extraversión, amabilidad y neuroticismo.'
      case 'PSICOLOGICA': return 'Evalúa aspectos psicológicos relevantes para el trabajo: manejo de estrés, empatía, adaptabilidad, liderazgo y trabajo en equipo.'
      case 'CONOCIMIENTOS': return 'Evalúa tus conocimientos técnicos específicos para el puesto al que estás aplicando.'
      case 'INTEGRIDAD': return 'Evaluación de Integridad (dato sensible, orientativo). Indicadores de honestidad, cumplimiento de normas, responsabilidad y prevención de robos.'
      default: return 'Evaluación de competencias para el puesto.'
    }
  }

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'RESTAURANT': return <Utensils className="w-5 h-5" />
      case 'RETAIL': return <ShoppingBag className="w-5 h-5" />
      default: return <Briefcase className="w-5 h-5" />
    }
  }

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case 'RESTAURANT': return 'Restaurante'
      case 'RETAIL': return 'Retail / Tienda'
      default: return sector
    }
  }

  // ============================================
  // LOADING
  // ============================================
  if (phase === 'LOADING') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // ============================================
  // SESSIONS OVERVIEW: Has completed + more available
  // ============================================
  if (phase === 'SESSIONS_OVERVIEW') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Tus Evaluaciones</h1>
          <p className="text-gray-500 mt-1">Has completado evaluaciones y hay más puestos disponibles</p>
        </div>

        {/* Completed evaluations */}
        {completedSessions.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Evaluaciones Completadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedSessions.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{s.position?.title}</p>
                    <p className="text-xs text-gray-500">{getSectorLabel(s.position?.sector || '')}</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-xs">Completada</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Apply to another position */}
        {availablePositions.length > 0 && (
          <Card className="shadow-sm border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-emerald-600" />
                Aplicar a Otro Puesto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Selecciona otro puesto disponible para realizar su evaluación:
              </p>
              {availablePositions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => {
                    setSelectedPositionId(pos.id)
                  }}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    {getSectorIcon(pos.sector)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{pos.title}</p>
                    {pos.company?.name && (
                      <p className="text-xs text-emerald-600">{pos.company.name}</p>
                    )}
                    <p className="text-xs text-gray-500">{getSectorLabel(pos.sector)}</p>
                    {pos.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{pos.description}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0" />
                </button>
              ))}
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
                size="lg"
                onClick={handleCreateSession}
                disabled={!selectedPositionId || loading}
              >
                {loading ? 'Preparando evaluación...' : 'Continuar con este Puesto'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ============================================
  // SELECT POSITION: Candidate chooses which position to apply for
  // ============================================
  if (phase === 'SELECT_POSITION') {
    // Group positions by sector
    const restaurantPositions = availablePositions.filter(p => p.sector === 'RESTAURANT')
    const retailPositions = availablePositions.filter(p => p.sector === 'RETAIL')

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">¿A qué puesto aplicas?</h1>
          <p className="text-gray-500 mt-1">Selecciona el puesto para el cual deseas evaluarte</p>
        </div>

        {availablePositions.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No hay puestos disponibles para evaluación en este momento.</p>
              <p className="text-sm text-gray-400 mt-2">Contacta a Recursos Humanos para más información.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Restaurant sector */}
            {restaurantPositions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <h2 className="font-semibold text-sm text-gray-700">Restaurantes</h2>
                </div>
                {restaurantPositions.map(pos => {
                  const isSelected = selectedPositionId === pos.id
                  const templateInfo = pos.evaluationTemplates || []
                  const totalQs = templateInfo.reduce((s, t) => s + (t._count?.questions || 0), 0)
                  return (
                    <button
                      key={pos.id}
                      onClick={() => setSelectedPositionId(pos.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold">{pos.title}</p>
                        {pos.company?.name && (
                          <p className="text-xs text-emerald-600 mt-0.5">{pos.company.name}</p>
                        )}
                        {pos.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{pos.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {templateInfo.map(t => (
                            <span key={t.id} className="text-xs text-gray-400 flex items-center gap-1">
                              {getStepIcon(t.type)}
                              {t._count?.questions || 0}p
                            </span>
                          ))}
                          <span className="text-xs text-gray-400">~{Math.ceil(totalQs * 0.5)} min</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Retail sector */}
            {retailPositions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                  <h2 className="font-semibold text-sm text-gray-700">Retail / Tiendas</h2>
                </div>
                {retailPositions.map(pos => {
                  const isSelected = selectedPositionId === pos.id
                  const templateInfo = pos.evaluationTemplates || []
                  const totalQs = templateInfo.reduce((s, t) => s + (t._count?.questions || 0), 0)
                  return (
                    <button
                      key={pos.id}
                      onClick={() => setSelectedPositionId(pos.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-purple-100 text-purple-600'
                      }`}>
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold">{pos.title}</p>
                        {pos.company?.name && (
                          <p className="text-xs text-purple-600 mt-0.5">{pos.company.name}</p>
                        )}
                        {pos.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{pos.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {templateInfo.map(t => (
                            <span key={t.id} className="text-xs text-gray-400 flex items-center gap-1">
                              {getStepIcon(t.type)}
                              {t._count?.questions || 0}p
                            </span>
                          ))}
                          <span className="text-xs text-gray-400">~{Math.ceil(totalQs * 0.5)} min</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Continue button */}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              onClick={handleCreateSession}
              disabled={!selectedPositionId || loading}
            >
              {loading ? 'Preparando evaluación...' : 'Continuar con este Puesto'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </>
        )}
      </div>
    )
  }

  // ============================================
  // CONSENT: Show consent/terms screen before evaluation
  // ============================================
  if (phase === 'CONSENT') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Consentimiento Informado</h1>
          <p className="text-gray-500 mt-1">Puesto: <strong>{positionTitle}</strong></p>
        </div>

        <Card className="shadow-sm border-2 border-emerald-200">
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
                  Sus datos son considerados <strong>Datos Personales Sensibles</strong> conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y la NOM-035-STPS-2018.
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
                Responsable: {user?.companyName || 'La empresa correspondiente'}<br/>
                Tuxtla Gutiérrez, Chiapas, México
              </p>
            </div>

            <div className="flex items-start space-x-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <Checkbox
                id="consent-eval"
                checked={consentAccepted}
                onCheckedChange={(checked) => setConsentAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label htmlFor="consent-eval" className="text-sm text-emerald-900 cursor-pointer leading-tight">
                Acepto que mis respuestas serán tratadas como datos personales sensibles y consiento someterme a esta evaluación de forma voluntaria.
                Entiendo que los resultados serán confidenciales y utilizados solo para el proceso de selección.
              </label>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              disabled={!consentAccepted || loading}
              onClick={() => {
                // Save consent to backend
                if (user?.id) {
                  apiFetch('/api/consent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id }),
                  }).catch(() => {})
                }
                setPhase('SESSION_READY')
              }}
            >
              Aceptar y Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
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
    )
  }

  // ============================================
  // SESSION READY: Show intro before starting
  // ============================================
  if (phase === 'SESSION_READY') {
    // Load templates for the session
    return (
      <SessionReadyView
        sessionId={sessionId!}
        positionTitle={positionTitle}
        loading={loading}
        setLoading={setLoading}
        setTemplates={setTemplates}
        setPhase={setPhase}
        setCurrentTemplateIndex={setCurrentTemplateIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        consentOption={user?.consentOption}
      />
    )
  }

  // ============================================
  // SECTION TRANSITION: Show transition between sections
  // ============================================
  if (phase === 'SECTION_TRANSITION') {
    const nextTemplate = templates[currentTemplateIndex]
    const prevTemplate = currentTemplateIndex > 0 ? templates[currentTemplateIndex - 1] : null
    const isFirstSection = currentTemplateIndex === 0

    return (
      <div className="max-w-lg mx-auto space-y-6">
        {!isFirstSection && prevTemplate && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-emerald-700">
              Has completado la sección de {getStepLabel(prevTemplate.type)}
            </h2>
          </div>
        )}

        {nextTemplate && (
          <Card className="shadow-sm border-2 border-emerald-200">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-2">
                  {getStepIcon(nextTemplate.type)}
                </div>
                <h3 className="text-lg font-bold">
                  {isFirstSection ? 'A continuación:' : 'A continuación:'}
                </h3>
                <p className="text-xl font-bold text-emerald-600">
                  Evaluación {getStepLabel(nextTemplate.type)}
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  {getStepDescription(nextTemplate.type)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{nextTemplate.questions?.length || 0} preguntas</span>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
                onClick={() => {
                  setShowSectionTransition(false)
                  setPhase('IN_PROGRESS')
                }}
              >
                Comenzar sección
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ============================================
  // IN PROGRESS: Show questions
  // ============================================
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Position Title */}
      <div className="text-center">
        <Badge variant="outline" className="text-xs">{positionTitle}</Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Pregunta {answeredCount + 1} de {totalQuestions}
          </span>
          <span className="text-gray-500">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Steps indicator */}
      <div className="flex gap-2">
        {templates.map((t, i) => (
          <div
            key={t.id}
            className={`flex-1 p-2 rounded-lg text-center text-xs transition-colors ${
              i === currentTemplateIndex
                ? 'bg-emerald-100 text-emerald-700 font-semibold'
                : i < currentTemplateIndex
                ? 'bg-emerald-50 text-emerald-500'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            {getStepLabel(t.type)}
          </div>
        ))}
      </div>

      {/* Section-specific question counter badge */}
      {currentTemplate && (
        <div className="flex items-center justify-center gap-3">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-sm px-3 py-1">
            {getStepIcon(currentTemplate.type)}
            <span className="ml-1.5">
              Pregunta {currentQuestionIndex + 1} de {currentTemplate.questions?.length || 0} — {getStepLabel(currentTemplate.type)}
            </span>
          </Badge>
        </div>
      )}

      {/* Question Card */}
      {currentQuestion && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'LIKERT' ? (
              <RadioGroup
                value={String(answers[currentQuestion.id] || '')}
                onValueChange={(val) =>
                  setAnswers({ ...answers, [currentQuestion.id]: Number(val) })
                }
                className="space-y-3"
              >
                {LIKERT_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={String(opt.value)} id={`q-${opt.value}`} />
                    <Label htmlFor={`q-${opt.value}`} className="text-sm cursor-pointer flex-1">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentQuestion.type === 'MULTIPLE_CHOICE' ? (
              <RadioGroup
                value={String(answers[currentQuestion.id] || '')}
                onValueChange={(val) =>
                  setAnswers({ ...answers, [currentQuestion.id]: val })
                }
                className="space-y-3"
              >
                {(Array.isArray(currentQuestion.options)
                  ? currentQuestion.options
                  : typeof currentQuestion.options === 'string'
                    ? (() => { try { const p = JSON.parse(currentQuestion.options); return Array.isArray(p) ? p : []; } catch { return []; } })()
                    : []
                ).map((opt, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <RadioGroupItem value={String(i)} id={`q-${i}`} />
                    <Label htmlFor={`q-${i}`} className="text-sm cursor-pointer flex-1">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : null}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleAnswer}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={answers[currentQuestion.id] === undefined || loading}
              >
                {loading ? 'Guardando...' : 'Siguiente'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdraw consent button — visible only during PSICOMETRICA / PSICOLOGICA
          sections when the candidate previously chose Option A (FULL consent). */}
      {isInSensitiveSection && user?.consentOption === 'FULL' && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setWithdrawError(null)
              setShowWithdrawDialog(true)
            }}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-50"
          >
            <ShieldAlert className="w-4 h-4 mr-1.5" />
            Retirar consentimiento de datos sensibles
          </Button>
        </div>
      )}

      {/* Withdraw consent dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center">
              Retirar consentimiento de datos sensibles
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Desea retirar su consentimiento para el tratamiento de datos
              sensibles?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  Continuará <strong>solo con la evaluación de conocimientos técnicos</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  Sus respuestas psicométricas, psicológicas y de integridad serán{' '}
                  <strong>marcadas para eliminación</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>NO afecta</strong> su participación en el proceso de selección.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  Tendrá las <strong>mismas oportunidades</strong> que los demás candidatos.
                </span>
              </li>
            </ul>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800">
                Conforme al <strong>Art. 37 Bis LFPDPPP</strong>, su decisión
                no generará trato discriminatorio.
              </p>
            </div>

            {withdrawError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                {withdrawError}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWithdrawDialog(false)}
              disabled={withdrawing}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleWithdrawConsent}
              disabled={withdrawing}
              className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
            >
              {withdrawing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Confirmar Retiro
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================
// Sub-component: Session Ready (intro before starting)
// ============================================
function SessionReadyView({
  sessionId,
  positionTitle,
  loading,
  setLoading,
  setTemplates,
  setPhase,
  setCurrentTemplateIndex,
  setCurrentQuestionIndex,
  consentOption,
}: {
  sessionId: string
  positionTitle: string
  loading: boolean
  setLoading: (v: boolean) => void
  setTemplates: (v: EvaluationTemplate[]) => void
  setPhase: (v: ViewPhase) => void
  setCurrentTemplateIndex: (v: number) => void
  setCurrentQuestionIndex: (v: number) => void
  consentOption?: string
}) {
  const [templates, setLocalTemplates] = useState<EvaluationTemplate[]>([])

  useEffect(() => {
    if (!sessionId) return
    apiFetch(`/api/evaluations?sessionId=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.templates) {
          setLocalTemplates(filterTemplatesByConsent(data.templates, consentOption))
        }
      })
      .catch(console.error)
  }, [sessionId, consentOption])

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return <Brain className="w-5 h-5" />
      case 'PSICOLOGICA': return <ClipboardList className="w-5 h-5" />
      case 'CONOCIMIENTOS': return <BookOpen className="w-5 h-5" />
      case 'INTEGRIDAD': return <ShieldCheck className="w-5 h-5" />
      default: return null
    }
  }

  const getStepLabel = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return 'Psicométrica'
      case 'PSICOLOGICA': return 'Psicológica'
      case 'CONOCIMIENTOS': return 'Conocimientos'
      case 'INTEGRIDAD': return 'Integridad'
      default: return type
    }
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'start' }),
      })
      const data = await res.json()
      if (data.templates) {
        setTemplates(filterTemplatesByConsent(data.templates, consentOption))
        setCurrentTemplateIndex(0)
        setCurrentQuestionIndex(0)
        // Show section transition for the first section
        setPhase('SECTION_TRANSITION')
      }
    } catch (e) {
      console.error('Error starting evaluation', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Evaluación de Personal</h1>
        <p className="text-gray-500 mt-1">Puesto: <strong>{positionTitle}</strong></p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-sm">Tiempo estimado: 10-15 minutos</span>
            </div>
            <p className="text-xs text-amber-700">
              No hay límite de tiempo por pregunta. Responde con honestidad — no hay respuestas correctas o incorrectas
              en las secciones de personalidad y psicología.
            </p>
          </div>

          <div className="space-y-3">
            {templates.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{getStepLabel(t.type)}</p>
                  <p className="text-xs text-gray-500">{t.questions?.length || 0} preguntas</p>
                </div>
                {getStepIcon(t.type)}
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            size="lg"
            onClick={handleStart}
            disabled={loading}
          >
            Comenzar Evaluación
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
