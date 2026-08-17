'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2, Mail, Briefcase, ChevronRight, Info,
  ArrowRight, Shield, Clock, ChevronLeft
} from 'lucide-react'

export default function EvaluationCompleteView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [loading, setLoading] = useState(true)
  const [availablePositions, setAvailablePositions] = useState<any[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      apiFetch(`/api/interviews?candidateId=${user.id}`).then(r => r.json()),
      apiFetch(`/api/evaluations?candidateId=${user.id}`).then(r => r.json()),
    ])
      .then(([interviewData, sessionData]) => {
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Step indicator for the flow */}
      <div className="flex items-center justify-center gap-1 py-2">
        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Main completion message */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold">¡Evaluación completada!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Gracias por completar tu evaluación. El equipo de Recursos Humanos analizará tus resultados y se pondrá en contacto contigo.
        </p>
      </div>

      {/* What happens next */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-base font-semibold text-gray-900">¿Qué sigue?</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/60">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-700">1</div>
            <div>
              <p className="font-medium text-sm text-gray-900">Análisis de resultados</p>
              <p className="text-xs text-gray-500">RH revisará tu perfil de competencias</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-50/60">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-sky-700">2</div>
            <div>
              <p className="font-medium text-sm text-gray-900">Entrevista</p>
              <p className="text-xs text-gray-500">Si tu perfil coincide, te contactarán para una entrevista</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-50/60">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-700">3</div>
            <div>
              <p className="font-medium text-sm text-gray-900">Decisión final</p>
              <p className="text-xs text-gray-500">Recibirás la resolución del proceso de selección</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidentiality notice */}
      <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-800 space-y-1">
              <p><strong>Tus resultados son confidenciales</strong></p>
              <p className="text-emerald-700">Solo serán revisados por el equipo de Recursos Humanos de la empresa. No se compartirán con terceros.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact info */}
      <Card className="shadow-sm bg-gray-50 border-0">
        <CardContent className="p-4 text-center space-y-2">
          <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
          <p className="text-sm text-gray-700">
            Si tienes alguna duda sobre el proceso, puedes contactar a Recursos Humanos.
          </p>
          <p className="text-xs text-gray-500">
            Tuxtla Gutiérrez, Chiapas, México
          </p>
        </CardContent>
      </Card>

      {/* Apply to another position */}
      {availablePositions.length > 0 && (
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
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
