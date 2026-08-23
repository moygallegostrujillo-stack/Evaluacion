'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2, Mail, Briefcase, ChevronRight,
  Shield, Clock, Lock, MapPin, Ban, Download
} from 'lucide-react'

export default function EvaluationCompleteView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const invitationToken = useAppStore((s) => s.invitationToken)
  const isInvitedCandidate = !!invitationToken
  const [loading, setLoading] = useState(!isInvitedCandidate)
  const [availablePositions, setAvailablePositions] = useState<any[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    if (!user?.id || isInvitedCandidate) return
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

  const consentOptionLabel = user?.consentOption === 'FULL'
    ? 'Evaluación Completa (Psicométrica + Psicológica + Conocimientos + Integridad)'
    : user?.consentOption === 'KNOWLEDGE_ONLY'
    ? 'Solo Conocimientos Técnicos'
    : 'No registrado'

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Step indicator */}
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
        <h1 className="text-2xl font-bold">¡Evaluación Completada!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          ¡Gracias{user?.name ? ` ${user.name}` : ''}! Has completado exitosamente la evaluación.
        </p>
      </div>

      {/* What happens next */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-base font-semibold text-gray-900">📋 Lo que sigue</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/60">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-700">1</div>
            <div>
              <p className="font-medium text-sm text-gray-900">Análisis de resultados</p>
              <p className="text-xs text-gray-500">Nuestro equipo de Recursos Humanos revisará tus resultados</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-50/60">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-sky-700">2</div>
            <div>
              <p className="font-medium text-sm text-gray-900">Contacto</p>
              <p className="text-xs text-gray-500">Nos pondremos en contacto contigo en los próximos días</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-50/60">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-700">3</div>
            <div>
              <p className="font-medium text-sm text-gray-900">Decisión final</p>
              <p className="text-xs text-gray-500">Si fuiste seleccionado/a para la siguiente fase, te avisaremos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent level summary */}
      <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold text-emerald-800">Nivel de consentimiento otorgado</p>
              <p className="text-xs text-emerald-700">
                {consentOptionLabel}
                {user?.anonymousStats && ' + Estadísticas Anónimas'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ARCO Rights — critical legal compliance */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600" />
            Tus derechos siguen vigentes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <p className="text-sm text-gray-600">
            Puede ejercer sus derechos ARCO en cualquier momento:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li><strong>Acceso</strong> a sus datos personales</li>
            <li><strong>Rectificación</strong> de datos incorrectos</li>
            <li><strong>Cancelación</strong> de sus datos</li>
            <li><strong>Oposición</strong> al tratamiento</li>
          </ul>
          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <p className="text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              recursos.humanos@cafedechiapas.mx
            </p>
            <p className="text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Tuxtla Gutiérrez, Chiapas, México
            </p>
            <p className="text-xs text-gray-600">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              Respuesta: 20 días hábiles
            </p>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-md border border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium">
              <Ban className="w-3.5 h-3.5 inline mr-1" />
              Su decisión NO generará trato discriminatorio (Art. 37 Bis LFPDPPP)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data retention */}
      <Card className="shadow-sm border-0 bg-gray-50">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="font-semibold text-sm text-gray-700">Retención de datos</p>
          </div>
          <ul className="text-xs text-gray-600 space-y-1 ml-1">
            <li>• <strong>Datos personales:</strong> 2 años post-evaluación</li>
            <li>• <strong>Datos sensibles:</strong> Eliminados al retirar consentimiento o al finalizar proceso</li>
            <li>• <strong>Estadísticas anónimas:</strong> Sin límite temporal</li>
          </ul>
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

      {/* Privacy notice download */}
      <a
        href="/api/download?doc=aviso-privacidad"
        download
        className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 hover:underline w-full"
      >
        <Download className="w-4 h-4" />
        Descargar Aviso de Privacidad completo (PDF)
      </a>

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
