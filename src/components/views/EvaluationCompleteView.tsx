'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type CandidateResult } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2, AlertTriangle, XCircle, ArrowLeft,
  Calendar, Clock, Mail, Phone, Briefcase, ChevronRight
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts'

export default function EvaluationCompleteView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [result, setResult] = useState<CandidateResult | null>(null)
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [availablePositions, setAvailablePositions] = useState<any[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      fetch(`/api/results?candidateId=${user.id}`).then(r => r.json()),
      fetch(`/api/interviews?candidateId=${user.id}`).then(r => r.json()),
      fetch(`/api/evaluations?candidateId=${user.id}`).then(r => r.json()),
    ])
      .then(([resultData, interviewData, sessionData]) => {
        if (resultData.results && resultData.results.length > 0) {
          setResult(resultData.results[0])
        } else if (resultData.result) {
          setResult(resultData.result)
        }
        setInterviews(interviewData.interviews || [])
        setAvailablePositions(sessionData.availablePositions || [])
        setCompletedCount(sessionData.completedSessions?.length || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  const handleApplyAnother = () => {
    setCurrentView('take-evaluation')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>
  }

  if (!result) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">¡Gracias por completar tu evaluación!</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Evaluaremos tus resultados y nos pondremos en contacto contigo próximamente.
          </p>
        </div>

        <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6 text-center space-y-3">
            <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="text-sm text-emerald-800">
              Si tienes alguna duda, puedes contactar a Recursos Humanos.
            </p>
            <p className="text-xs text-emerald-600">
              Tus resultados son confidenciales y serán revisados únicamente por el equipo de selección.
            </p>
          </CardContent>
        </Card>

        {availablePositions.length > 0 && (
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-emerald-700">
                <Briefcase className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">¿Te interesa otro puesto?</p>
              </div>
              <Button
                onClick={handleApplyAnother}
                className="bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                Aplicar a Otro Puesto
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const bigFiveData = [
    { dimension: 'Apertura', valor: result.openness },
    { dimension: 'Responsabilidad', valor: result.conscientiousness },
    { dimension: 'Extraversión', valor: result.extraversion },
    { dimension: 'Amabilidad', valor: result.agreeableness },
    { dimension: 'Neuroticismo', valor: result.neuroticism },
  ]

  const psychData = [
    { dimension: 'Estrés', valor: result.stressLevel },
    { dimension: 'Empatía', valor: result.empathy },
    { dimension: 'Adaptabilidad', valor: result.adaptability },
    { dimension: 'Liderazgo', valor: result.leadership },
    { dimension: 'Trabajo Equipo', valor: result.teamwork },
  ]

  const getRecIcon = (rec: string) => {
    switch (rec) {
      case 'APTO': return <CheckCircle2 className="w-6 h-6" />
      case 'ENTREVISTA_ADICIONAL': return <AlertTriangle className="w-6 h-6" />
      case 'NO_RECOMENDADO': return <XCircle className="w-6 h-6" />
      default: return null
    }
  }

  const getRecColor = (rec: string) => {
    switch (rec) {
      case 'APTO': return 'bg-emerald-100 text-emerald-700 border-emerald-300'
      case 'ENTREVISTA_ADICIONAL': return 'bg-amber-100 text-amber-700 border-amber-300'
      case 'NO_RECOMENDADO': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getNextStepText = (rec: string) => {
    switch (rec) {
      case 'APTO':
        return '¡Felicidades! Has sido considerado apto para el puesto. Pronto nos pondremos en contacto contigo para programar tu entrevista presencial y los siguientes pasos del proceso.'
      case 'ENTREVISTA_ADICIONAL':
        return 'Se requiere una entrevista adicional como parte del proceso. Te contactaremos pronto para agendarla.'
      case 'NO_RECOMENDADO':
        return 'Agradecemos tu interés en la posición. En este momento el perfil no coincide con lo buscado, pero te deseamos mucho éxito en tu búsqueda.'
      default:
        return 'Tus resultados están siendo evaluados. Te contactaremos pronto.'
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Friendly completion message - always shown at top */}
      <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-5 text-center space-y-2">
          <p className="text-emerald-800 font-semibold">¡Gracias por completar tu evaluación!</p>
          <p className="text-sm text-emerald-700">
            Evaluaremos tus resultados y nos pondremos en contacto contigo próximamente.
          </p>
        </CardContent>
      </Card>

      {/* Success Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">¡Evaluación Completada!</h1>
        <p className="text-gray-500">Puesto: {result.positionTitle}</p>
      </div>

      {/* Result Card */}
      <Card className={`shadow-sm border-2 ${getRecColor(result.recommendation)}`}>
        <CardContent className="p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            {getRecIcon(result.recommendation)}
            <span className="text-xl font-bold">
              {result.recommendation === 'APTO' ? 'Candidato Apto' :
               result.recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista Adicional' :
               result.recommendation === 'NO_RECOMENDADO' ? 'No Recomendado' : 'En Proceso'}
            </span>
          </div>
          <div className="text-4xl font-bold">{Math.round(result.overallScore)}<span className="text-lg text-gray-500">/100</span></div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">¿Qué sigue?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{getNextStepText(result.recommendation)}</p>
        </CardContent>
      </Card>

      {/* Interviews */}
      {interviews.length > 0 && (
        <Card className="shadow-sm border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> Entrevistas Programadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {interviews.map((int: any) => (
              <div key={int.id} className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {new Date(int.scheduledAt).toLocaleDateString('es-MX', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                {int.location && (
                  <p className="text-xs text-amber-700 mt-1 ml-6">📍 {int.location}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Profile Radar */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tu Perfil de Competencias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={[...bigFiveData, ...psychData].slice(0, 5)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Perfil" dataKey="valor" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      {result.summary && (
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">{result.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Contact Info */}
      <Card className="shadow-sm bg-gray-50">
        <CardContent className="p-4 text-center text-sm text-gray-500">
          <p>Si tienes dudas sobre el proceso, contacta a Recursos Humanos</p>
          <p className="mt-1">Tuxtla Gutiérrez, Chiapas, México</p>
        </CardContent>
      </Card>

      {/* Apply to another position */}
      {availablePositions.length > 0 && (
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-emerald-700">
              <Briefcase className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">¿Te interesa otro puesto?</p>
              <p className="text-sm text-emerald-600 mt-1">
                {completedCount > 0
                  ? `Ya completaste ${completedCount} evaluación${completedCount > 1 ? 'es' : ''}. Aplica a otro puesto disponible.`
                  : 'Hay más puestos disponibles para evaluar tu perfil.'}
              </p>
            </div>
            <Button
              onClick={handleApplyAnother}
              className="bg-emerald-600 hover:bg-emerald-700"
              size="lg"
            >
              Aplicar a Otro Puesto
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
