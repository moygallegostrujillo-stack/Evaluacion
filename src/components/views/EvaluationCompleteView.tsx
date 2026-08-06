'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2, ArrowLeft, Mail, Briefcase, ChevronRight, Info
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
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Main completion message */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold">¡Gracias por completar tu evaluación!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Evaluaremos tus resultados y nos pondremos en contacto contigo próximamente.
        </p>
      </div>

      {/* Confidentiality notice */}
      <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-800 space-y-1">
              <p><strong>Tus resultados son confidenciales</strong></p>
              <p className="text-emerald-700">Solo serán revisados por el equipo de Recursos Humanos de la empresa. No se compartirán con terceros.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact info */}
      <Card className="shadow-sm bg-gray-50">
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
