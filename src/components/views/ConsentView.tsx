'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Shield, Info, Download, ArrowRight, ChevronRight,
  Brain, BookOpen, BarChart3, Lock, Clock, Mail, AlertCircle, Loader2
} from 'lucide-react'

type ConsentOption = 'FULL' | 'KNOWLEDGE_ONLY' | null

export default function ConsentView() {
  const user = useAppStore((s) => s.user)
  const setAuth = useAppStore((s) => s.setAuth)
  const token = useAppStore((s) => s.token)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [selectedOption, setSelectedOption] = useState<ConsentOption>(null)
  const [anonymousStats, setAnonymousStats] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAccept = async () => {
    if (!selectedOption || !user) return
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          consentOption: selectedOption,
          anonymousStats,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al guardar consentimiento. Intenta de nuevo.')
        return
      }
      // Only update store AFTER successful API response
      if (token) {
        setAuth({
          ...user,
          consentGiven: true,
          consentOption: selectedOption,
          anonymousStats,
        }, token)
      }
      setCurrentView('take-evaluation')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const positionTitle = user?.companyName || 'la empresa'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header with step indicator */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              E
            </div>
            <span className="font-bold text-lg text-gray-900">EvaluHR</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</div>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">2</div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-xl border-0">
          <CardHeader className="text-center pb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl">Consentimiento Informado</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Paso 1 de 2 — Antes de la evaluación</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warning */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
              <p className="text-sm text-amber-900 font-medium">
                Está a punto de realizar evaluaciones psicométricas, psicológicas y de conocimientos.
              </p>
              <p className="text-sm text-amber-800">
                Los resultados serán utilizados exclusivamente para el proceso de selección laboral de su candidato al puesto <strong>{positionTitle}</strong>.
              </p>
              <div className="flex items-start gap-2 bg-amber-100/50 p-2 rounded-md">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Sus respuestas psicométricas y psicológicas son consideradas <strong>Datos Personales Sensibles</strong> conforme a la LFPDPPP y la NOM-035-STPS-2018.
                </p>
              </div>
            </div>

            {/* Data collected */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-3">
              <p className="font-semibold text-gray-800">📋 Datos que se recopilarán</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                <li>Nombre completo y correo electrónico</li>
                <li>Teléfono (opcional)</li>
                <li>Respuestas a evaluaciones psicométricas (Big Five)</li>
                <li>Respuestas a evaluaciones psicológicas (NOM-035)</li>
                <li>Resultados de evaluaciones de conocimientos</li>
              </ul>
              <div className="border-t border-gray-200 pt-2 text-xs text-gray-500 space-y-0.5">
                <p><strong>Responsable:</strong> {user?.companyName || 'La empresa correspondiente'}</p>
                <p><strong>Plataforma:</strong> EvaluHR</p>
                <p><strong>Domicilio:</strong> Tuxtla Gutiérrez, Chiapas, México</p>
              </div>
            </div>

            {/* Participation Options */}
            <div className="space-y-3">
              <p className="font-semibold text-sm text-gray-800">⚙️ Elija su nivel de participación</p>

              {/* Option A: Full evaluation */}
              <button
                type="button"
                onClick={() => setSelectedOption('FULL')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedOption === 'FULL'
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedOption === 'FULL' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                  }`}>
                    {selectedOption === 'FULL' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Opción A: Evaluación Completa</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Incluye: Conocimientos + Psicométrico + Psicológico (perfil completo)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Puede retirar su consentimiento en cualquier momento.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option B: Knowledge only */}
              <button
                type="button"
                onClick={() => setSelectedOption('KNOWLEDGE_ONLY')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedOption === 'KNOWLEDGE_ONLY'
                    ? 'border-sky-500 bg-sky-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedOption === 'KNOWLEDGE_ONLY' ? 'border-sky-500 bg-sky-500' : 'border-gray-300'
                  }`}>
                    {selectedOption === 'KNOWLEDGE_ONLY' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Opción B: Solo Conocimientos</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Incluye: Solo evaluación de conocimientos técnicos del puesto (SIN datos sensibles)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Usted será evaluado únicamente en sus conocimientos técnicos. Esta opción NO afecta su participación en el proceso de selección.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option C: Anonymous stats (checkbox, not exclusive) */}
              <div className={`p-3 rounded-lg border ${
                anonymousStats ? 'border-teal-300 bg-teal-50/50' : 'border-gray-200 bg-gray-50/50'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={anonymousStats}
                    onCheckedChange={(checked) => setAnonymousStats(checked as boolean)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Opción C: Estadísticas Anónimas</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Autoriza que sus datos sean utilizados para mejorar los instrumentos de evaluación (sin identificarlo).
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Completamente opcional.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Rights */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-gray-800">🔒 Sus Derechos</p>
              <p className="text-xs text-gray-600">
                Conforme a la LFPDPPP, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 text-xs text-gray-600">
                <li><strong>Acceso</strong> a sus datos personales</li>
                <li><strong>Rectificación</strong> de datos incorrectos</li>
                <li><strong>Cancelación</strong> de sus datos</li>
                <li><strong>Oposición</strong> al tratamiento</li>
              </ul>
              <p className="text-xs text-gray-500 mt-1">
                Puede ejercer estos derechos en cualquier momento escribiendo a:
              </p>
              <p className="text-xs text-gray-600">
                📧 recursos.humanos@{user?.companyName?.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || 'empresa'}.com
              </p>
              <div className="bg-emerald-50 p-2 rounded-md border border-emerald-200 mt-2">
                <p className="text-xs text-emerald-700 font-medium">
                  Su decisión de aceptar o no este consentimiento NO generará trato discriminatorio.
                </p>
              </div>
            </div>

            {/* Retention period */}
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-700">Período de Retención</p>
                <p className="mt-0.5">
                  Sus datos personales serán conservados por un período máximo de <strong>2 años</strong> después de finalizada la evaluación, conforme a la LFPDPPP.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Submit button */}
            <Button
              onClick={handleAccept}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
              disabled={!selectedOption || loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                <>Continuar con la Evaluación <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>

            {/* Download link */}
            <a
              href="/api/download?doc=aviso-privacidad"
              download
              className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 hover:underline w-full"
            >
              <Download className="w-4 h-4" />
              Descargar Aviso de Privacidad completo (PDF)
            </a>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white/80 border-t border-gray-100 py-3 text-center text-xs text-gray-400">
        EvaluHR — Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
