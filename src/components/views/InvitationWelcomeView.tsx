'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type InvitationData } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2, Briefcase, Clock, Shield, Brain, BookOpen,
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, User,
  ClipboardList, ChevronRight, Utensils, ShoppingBag, Loader2
} from 'lucide-react'

const POSITION_CATEGORY_LABELS: Record<string, string> = {
  MESERO: 'Mesero/a',
  COCINERO: 'Cocinero/a',
  BARTENDER: 'Bartender',
  GERENTE_PISO: 'Gerente de Piso',
  VENDEDOR: 'Vendedor/a',
}

export default function InvitationWelcomeView() {
  const invitationToken = useAppStore((s) => s.invitationToken)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const setAuth = useAppStore((s) => s.setAuth)
  const setInvitationData = useAppStore((s) => s.setInvitationData)

  const [loading, setLoading] = useState(true)
  const [autoLogging, setAutoLogging] = useState(false)
  const [data, setData] = useState<InvitationData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!invitationToken) {
      setLoading(false)
      return
    }

    fetch(`/api/public/invitation?token=${encodeURIComponent(invitationToken)}`)
      .then((r) => r.json())
      .then((result) => {
        setData(result)
        setInvitationData(result)
      })
      .catch(() => {
        setData({ valid: false, status: 'ERROR', error: 'Error de conexión. Intenta de nuevo.' })
      })
      .finally(() => setLoading(false))
  }, [invitationToken, setInvitationData])

  // Auto-login: call the auto-login endpoint, then navigate
  const handleStartEvaluation = async () => {
    if (!invitationToken) return
    setAutoLogging(true)
    setError('')
    try {
      const res = await apiFetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto-login', token: invitationToken }),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Error al iniciar. Intenta de nuevo.')
        return
      }
      // Set auth in store
      setAuth(result.user, result.token)
      // Navigate based on consent status
      if (result.user.consentGiven) {
        setCurrentView('take-evaluation')
      } else {
        setCurrentView('consent')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setAutoLogging(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600">Verificando tu invitación...</p>
        </div>
      </div>
    )
  }

  // No token
  if (!invitationToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Invitación no encontrada</h2>
            <p className="text-gray-600">No se detectó un código de invitación válido. Solicita un nuevo enlace de invitación.</p>
            <Button
              onClick={() => setCurrentView('login')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Ir a Inicio de Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Invalid / expired / already used
  if (data && !data.valid) {
    // If already registered, offer to auto-login directly
    const canAutoLogin = data.status === 'REGISTERED' || data.status === 'COMPLETED'

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center space-y-4">
            {data.status === 'EXPIRED' ? (
              <>
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
                <h2 className="text-xl font-bold text-gray-900">Invitación Expirada</h2>
              </>
            ) : canAutoLogin ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h2 className="text-xl font-bold text-gray-900">¡Ya tienes acceso!</h2>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-400 mx-auto" />
                <h2 className="text-xl font-bold text-gray-900">Invitación no válida</h2>
              </>
            )}
            {data.companyName && data.positionTitle && (
              <p className="text-sm text-gray-500">
                {data.companyName} — {data.positionTitle}
              </p>
            )}
            <p className="text-gray-600">{data.error}</p>
            {canAutoLogin ? (
              <Button
                onClick={handleStartEvaluation}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={autoLogging}
              >
                {autoLogging ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ingresando...</>
                ) : (
                  <>Continuar a mi Evaluación <ArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentView('login')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Ir a Inicio de Sesión
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Valid invitation — show the welcome page
  const sectorIcon = data?.companySector === 'RESTAURANT'
    ? <Utensils className="w-5 h-5" />
    : data?.companySector === 'RETAIL'
      ? <ShoppingBag className="w-5 h-5" />
      : <Building2 className="w-5 h-5" />

  const sectorLabel = data?.companySector === 'RESTAURANT'
    ? 'Restaurante'
    : data?.companySector === 'RETAIL'
      ? 'Retail'
      : 'Empresa'

  const categoryLabel = data?.positionCategory
    ? POSITION_CATEGORY_LABELS[data.positionCategory] || data.positionCategory
    : ''

  const expiresAt = data?.expiresAt ? new Date(data.expiresAt) : null
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              E
            </div>
            <span className="font-bold text-lg text-gray-900">EvaluHR</span>
          </div>
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
            <Shield className="w-3 h-3 mr-1" />
            Evaluación Segura
          </Badge>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-lg mx-auto space-y-5">
          {/* Welcome message */}
          <div className="text-center space-y-2 pt-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg mb-2">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">¡Has sido invitado/a!</h1>
            <p className="text-gray-500">Completa tu evaluación para el proceso de selección</p>
          </div>

          {/* Company & Position Card */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {sectorIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-emerald-100">{sectorLabel}</p>
                  <p className="font-bold text-lg truncate">{data?.companyName}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Puesto</p>
                  <p className="font-semibold text-gray-900">{data?.positionTitle}</p>
                  {categoryLabel && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {categoryLabel}
                    </Badge>
                  )}
                </div>
              </div>

              {data?.positionDescription && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.positionDescription}
                </p>
              )}

              {data?.candidateName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Invitación para: <strong>{data.candidateName}</strong></span>
                </div>
              )}

              {daysLeft !== null && daysLeft > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Tienes <strong>{daysLeft} día{daysLeft > 1 ? 's' : ''}</strong> para completar tu evaluación</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What to expect */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">¿En qué consiste la evaluación?</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-50/60">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Evaluación Psicométrica</p>
                  <p className="text-xs text-gray-500">Perfil de personalidad Big Five — ~15 preguntas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-50/60">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Evaluación Psicológica</p>
                  <p className="text-xs text-gray-500">Competencias laborales: estrés, empatía, liderazgo — ~15 preguntas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Evaluación de Conocimientos</p>
                  <p className="text-xs text-gray-500">Preguntas específicas del puesto — opcional según la vacante</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                <Clock className="w-4 h-4" />
                <span>Tiempo estimado: <strong>10–15 minutos</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Process steps overview */}
          <Card className="shadow-sm border-0 bg-gray-50/80">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tu camino</p>
              <div className="flex items-center justify-between">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: 'Consentimiento', active: true },
                  { icon: <Brain className="w-4 h-4" />, label: 'Evaluación', active: false },
                  { icon: <CheckCircle2 className="w-4 h-4" />, label: '¡Listo!', active: false },
                ].map((step, idx) => (
                  <React.Fragment key={step.label}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        step.active
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-xs font-medium ${step.active ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy note */}
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-white rounded-lg p-3 border border-gray-100">
            <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p>
              Tus datos son tratados como <strong>Datos Personales Sensibles</strong> conforme a la LFPDPPP y NOM-035-STPS-2018. 
              Los resultados son confidenciales y solo los ve Recursos Humanos.
            </p>
          </div>

          {/* Error from auto-login */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* CTA — NO registration, just start! */}
          <Button
            onClick={handleStartEvaluation}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-base py-6 shadow-lg"
            size="lg"
            disabled={autoLogging}
          >
            {autoLogging ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Ingresando...</>
            ) : (
              <>Comenzar Evaluación <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </Button>
        </div>
      </main>

      <footer className="bg-white/80 border-t border-gray-100 py-3 text-center text-xs text-gray-400">
        EvaluHR — Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
