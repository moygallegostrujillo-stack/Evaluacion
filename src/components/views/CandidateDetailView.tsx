'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type CandidateResult } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft, CheckCircle2, AlertTriangle, XCircle,
  Calendar, MapPin, FileText, Mail, Phone, User,
  ShieldCheck, ShieldX, Scale, AlertCircle, RefreshCw
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

interface CandidateContact {
  email?: string
  phone?: string
  consentGiven?: boolean
  consentDate?: string | null
}

export default function CandidateDetailView() {
  const selectedResultId = useAppStore((s) => s.selectedResultId)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const user = useAppStore((s) => s.user)
  const setSelectedResultId = useAppStore((s) => s.setSelectedResultId)
  const [result, setResult] = useState<CandidateResult | null>(null)
  const [candidateContact, setCandidateContact] = useState<CandidateContact>({})
  const [loading, setLoading] = useState(true)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewLocation, setInterviewLocation] = useState('')
  const [scheduling, setScheduling] = useState(false)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)
  const [scheduleError, setScheduleError] = useState('')
  const [fixingConsent, setFixingConsent] = useState(false)
  const [consentFixed, setConsentFixed] = useState(false)

  useEffect(() => {
    if (!selectedResultId) {
      setLoading(false)
      return
    }
    setLoading(true)
    apiFetch(`/api/results?resultId=${selectedResultId}`)
      .then(res => res.json())
      .then(data => {
        const r = data.result || data
        setResult(r)
        // Extract candidate contact info from the API response
        if (r.candidate) {
          setCandidateContact({
            email: r.candidate.email || '',
            phone: r.candidate.phone || '',
            consentGiven: r.candidate.consentGiven || false,
            consentDate: r.candidate.consentDate || null,
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedResultId])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>
  }

  if (!result) {
    return <div className="text-center py-12 text-gray-400">Resultado no encontrado</div>
  }

  const bigFiveData = [
    { dimension: 'Apertura', valor: result.openness, fullMark: 100 },
    { dimension: 'Responsabilidad', valor: result.conscientiousness, fullMark: 100 },
    { dimension: 'Extraversión', valor: result.extraversion, fullMark: 100 },
    { dimension: 'Amabilidad', valor: result.agreeableness, fullMark: 100 },
    { dimension: 'Neuroticismo', valor: result.neuroticism, fullMark: 100 },
  ]

  const psychData = [
    { dimension: 'Estrés', valor: result.stressLevel, fullMark: 100 },
    { dimension: 'Empatía', valor: result.empathy, fullMark: 100 },
    { dimension: 'Adaptabilidad', valor: result.adaptability, fullMark: 100 },
    { dimension: 'Liderazgo', valor: result.leadership, fullMark: 100 },
    { dimension: 'Trabajo en Equipo', valor: result.teamwork, fullMark: 100 },
  ]

  const scoresBarData = [
    { name: 'Big Five', puntaje: Math.round((result.openness + result.conscientiousness + result.extraversion + result.agreeableness + (100 - result.neuroticism)) / 5) },
    { name: 'Psicológica', puntaje: Math.round((result.stressLevel + result.empathy + result.adaptability + result.leadership + result.teamwork) / 5) },
    ...(result.knowledgeScore !== null && result.knowledgeScore !== undefined
      ? [{ name: 'Conocimientos', puntaje: Math.round(result.knowledgeScore) }]
      : []),
  ]

  const getRecIcon = (rec: string) => {
    switch (rec) {
      case 'APTO': return <CheckCircle2 className="w-5 h-5" />
      case 'ENTREVISTA_ADICIONAL': return <AlertTriangle className="w-5 h-5" />
      case 'NO_RECOMENDADO': return <XCircle className="w-5 h-5" />
      default: return null
    }
  }

  const getRecColor = (rec: string) => {
    switch (rec) {
      case 'APTO': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'ENTREVISTA_ADICIONAL': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'NO_RECOMENDADO': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRecLabel = (rec: string) => {
    switch (rec) {
      case 'APTO': return 'Candidato Apto'
      case 'ENTREVISTA_ADICIONAL': return 'Requiere Entrevista Adicional'
      case 'NO_RECOMENDADO': return 'No Recomendado'
      default: return 'Pendiente'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  const handleScheduleInterview = async () => {
    if (!interviewDate || !user?.companyId) {
      setScheduleError('Fecha y empresa son requeridas')
      return
    }
    setScheduling(true)
    setScheduleError('')
    setScheduleSuccess(false)
    try {
      const res = await apiFetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: result.candidateId,
          companyId: user.companyId,
          positionId: result.positionId,
          scheduledAt: interviewDate,
          location: interviewLocation || 'Oficina principal',
          notes: '',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setScheduleError(data.error || 'Error al programar la entrevista')
        return
      }
      setScheduleSuccess(true)
      setInterviewDate('')
      setInterviewLocation('')
    } catch (e) {
      console.error('Error scheduling interview', e)
      setScheduleError('Error de conexión al programar la entrevista')
    } finally {
      setScheduling(false)
    }
  }

  const ScoreBar = ({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) => {
    const displayValue = invert ? 100 - value : value
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className={`font-semibold ${getScoreColor(displayValue)}`}>
            {Math.round(invert ? 100 - value : value)}%
          </span>
        </div>
        <Progress value={displayValue} className="h-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('candidates')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Button>
      </div>

      {/* Profile Card with Contact Info */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shrink-0">
                {result.candidateName?.charAt(0) || '?'}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold">{result.candidateName}</h1>
                <p className="text-gray-500">Postulación: {result.positionTitle}</p>
                <p className="text-xs text-gray-400">{new Date(result.createdAt).toLocaleDateString('es-MX')}</p>
                {/* Contact Info */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {candidateContact.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{candidateContact.email}</span>
                    </div>
                  )}
                  {candidateContact.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{candidateContact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${getRecColor(result.recommendation)}`}>
              <div className="flex items-center gap-2">
                {getRecIcon(result.recommendation)}
                <span className="font-semibold">{getRecLabel(result.recommendation)}</span>
              </div>
              <p className="text-2xl font-bold mt-1">{Math.round(result.overallScore)}/100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent & Legal Card */}
      <Card className={`shadow-sm ${candidateContact.consentGiven || consentFixed ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" /> Consentimiento Legal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(candidateContact.consentGiven || consentFixed) ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-emerald-700">Aceptó términos y condiciones</p>
                  <p className="font-medium text-emerald-700">Aceptó aviso de privacidad</p>
                </div>
              </div>
              {(candidateContact.consentDate || consentFixed) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Aceptado el {new Date(candidateContact.consentDate || result.createdAt).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} a las {new Date(candidateContact.consentDate || result.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              {consentFixed && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Consentimiento registrado retroactivamente. El prospecto completó la evaluación, por lo que necesariamente aceptó los términos previamente.</span>
                </div>
              )}
              <p className="text-xs text-gray-500 italic">
                El prospecto aceptó los términos y condiciones de uso del sistema, así como el aviso de privacidad para el tratamiento de datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y el Reglamento de la Ley Federal de Protección de Datos Personales.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Inconsistency warning: eval completed but no consent */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-amber-700">Inconsistencia detectada</p>
                  <p className="text-sm text-amber-600">Este prospecto completó la evaluación pero no tiene registro de consentimiento.</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                <p className="font-medium mb-1">Nota importante:</p>
                <p>Para responder los exámenes psicométrico, psicológico y de conocimientos, el prospecto necesariamente aceptó los términos y condiciones y el aviso de privacidad. Si aparece sin consentimiento, fue un error del sistema o se omitió en el registro.</p>
              </div>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                disabled={fixingConsent}
                onClick={async () => {
                  setFixingConsent(true)
                  try {
                    const res = await apiFetch('/api/consent/fix', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ candidateId: result.candidateId }),
                    })
                    if (res.ok) {
                      setConsentFixed(true)
                      setCandidateContact(prev => ({ ...prev, consentGiven: true, consentDate: new Date().toISOString() }))
                    }
                  } catch (e) {
                    console.error('Error fixing consent', e)
                  } finally {
                    setFixingConsent(false)
                  }
                }}
              >
                {fixingConsent ? (
                  <><RefreshCw className="w-4 h-4 mr-1 animate-spin" /> Corrigiendo...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4 mr-1" /> Registrar consentimiento retroactivamente</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prospect Contact Card */}
      {(candidateContact.email || candidateContact.phone) && (
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" /> Datos de Contacto del Prospecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidateContact.email && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Correo electrónico</p>
                    <p className="font-medium text-sm">{candidateContact.email}</p>
                  </div>
                </div>
              )}
              {candidateContact.phone && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="font-medium text-sm">{candidateContact.phone}</p>
                  </div>
                </div>
              )}
              {!candidateContact.phone && !candidateContact.email && (
                <p className="text-sm text-gray-500 col-span-2">No hay datos de contacto registrados para este prospecto.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {result.summary && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Resumen de Evaluación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Scores Overview */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Puntuaciones por Área</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoresBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="puntaje" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scoring Criteria Explanation */}
      <Card className="shadow-sm border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">📋 Criterios de Evaluación</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Puntaje General se calcula con:</p>
            {result.knowledgeScore !== null && result.knowledgeScore > 0 ? (
              <ul className="list-disc pl-5 text-gray-600 space-y-0.5">
                <li><strong>30%</strong> Evaluación Psicométrica (Big Five)</li>
                <li><strong>30%</strong> Evaluación Psicológica</li>
                <li><strong>40%</strong> Prueba de Conocimientos</li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 text-gray-600 space-y-0.5">
                <li><strong>50%</strong> Evaluación Psicométrica (Big Five)</li>
                <li><strong>50%</strong> Evaluación Psicológica</li>
              </ul>
            )}
          </div>
          <Separator />
          <div>
            <p className="font-semibold text-gray-700 mb-1">Recomendación según puntaje:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>≥ 70</strong> → <Badge className="bg-emerald-100 text-emerald-700">Apto</Badge> Aceptado directamente</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span><strong>50 - 69</strong> → <Badge className="bg-amber-100 text-amber-700">Entrevista Adicional</Badge> Requiere entrevista presencial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span><strong>&lt; 50</strong> → <Badge className="bg-red-100 text-red-700">No Recomendado</Badge> No se recomienda para el puesto</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <p className="font-semibold text-gray-700 mb-1">Reglas especiales:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-0.5">
              <li>Roles de servicio (Mesero, Bartender, Vendedor): Si <strong>Empatía &lt; 40</strong> y <strong>Trabajo en Equipo &lt; 40</strong> → No Recomendado</li>
              <li>Estrés alto (&gt;80): Si era Apto → baja a Entrevista Adicional</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Big Five */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Big Five - Personalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={bigFiveData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Puntuación" dataKey="valor" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              <ScoreBar label="Apertura a la experiencia" value={result.openness} />
              <ScoreBar label="Responsabilidad" value={result.conscientiousness} />
              <ScoreBar label="Extraversión" value={result.extraversion} />
              <ScoreBar label="Amabilidad" value={result.agreeableness} />
              <ScoreBar label="Neuroticismo (menor es mejor)" value={result.neuroticism} invert />
            </div>
          </CardContent>
        </Card>

        {/* Psychological */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Evaluación Psicológica</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={psychData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Puntuación" dataKey="valor" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              <ScoreBar label="Nivel de Estrés (menor es mejor)" value={result.stressLevel} invert />
              <ScoreBar label="Empatía" value={result.empathy} />
              <ScoreBar label="Adaptabilidad" value={result.adaptability} />
              <ScoreBar label="Liderazgo" value={result.leadership} />
              <ScoreBar label="Trabajo en Equipo" value={result.teamwork} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Score */}
      {result.knowledgeScore !== null && result.knowledgeScore !== undefined && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Evaluación de Conocimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${getScoreColor(result.knowledgeScore)}`}>
                {Math.round(result.knowledgeScore)}%
              </div>
              <Progress value={result.knowledgeScore} className="flex-1 h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Interview */}
      {result.recommendation === 'ENTREVISTA_ADICIONAL' && (
        <Card className="shadow-sm border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> Programar Entrevista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Este candidato requiere una entrevista adicional. Programe una fecha y se le notificará.
            </p>

            {/* Show prospect info for the interview */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-amber-800 mb-2">Datos del prospecto:</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-amber-700">
                <span className="font-medium">{result.candidateName}</span>
                {candidateContact.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {candidateContact.email}
                  </span>
                )}
                {candidateContact.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {candidateContact.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Fecha y hora</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: Oficina principal, sala 3"
                    className="w-full p-2 pl-8 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Success message */}
            {scheduleSuccess && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Entrevista programada exitosamente. El candidato será notificado.
              </div>
            )}

            {/* Error message */}
            {scheduleError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                <XCircle className="w-4 h-4" />
                {scheduleError}
              </div>
            )}

            <Button
              className="mt-4 bg-amber-600 hover:bg-amber-700"
              onClick={handleScheduleInterview}
              disabled={!interviewDate || scheduling}
            >
              {scheduling ? 'Programando...' : 'Programar Entrevista'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
