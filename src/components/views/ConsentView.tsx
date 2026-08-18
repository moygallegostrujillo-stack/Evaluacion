'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Shield, Info, Download, ArrowRight, ChevronRight,
  Lock, Clock, AlertCircle, Loader2, MapPin, Mail, Ban
} from 'lucide-react'

type ConsentOption = 'FULL' | 'KNOWLEDGE_ONLY' | null

export default function ConsentView() {
  const user = useAppStore((s) => s.user)
  const setAuth = useAppStore((s) => s.setAuth)
  const token = useAppStore((s) => s.token)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [selectedOption, setSelectedOption] = useState<ConsentOption>(null)
  const [anonymousStats, setAnonymousStats] = useState(false)
  const [confirmedReading, setConfirmedReading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAccept = async () => {
    if (!selectedOption || !confirmedReading || !user) return
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
          confirmedReading: true,
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

  const companyName = user?.companyName || 'la empresa'

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

      <main className="flex-1 p-4 sm:p-6 flex items-start justify-center overflow-y-auto">
        <Card className="w-full max-w-lg shadow-xl border-0 my-4">
          <CardHeader className="text-center pb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl">Consentimiento Informado</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Antes de comenzar, elige tu nivel de participación</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warning block */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-900 font-semibold">IMPORTANTE</p>
              </div>
              <p className="text-sm text-amber-800">
                Está a punto de realizar una evaluación que incluye pruebas <strong>psicométricas, psicológicas y de conocimientos</strong>.
              </p>
              <p className="text-sm text-amber-800">
                Los resultados serán utilizados exclusivamente para el proceso de selección laboral de <strong>{companyName}</strong>.
              </p>
              <div className="flex items-start gap-2 bg-amber-100/50 p-2.5 rounded-md">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Sus respuestas psicométricas y psicológicas son consideradas <strong>DATOS PERSONALES SENSIBLES</strong> conforme a la LFPDPPP y la NOM-035-STPS-2018.
                </p>
              </div>
            </div>

            {/* Data controller */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1.5">
              <p className="font-semibold text-gray-800">📋 Responsable del tratamiento</p>
              <p className="text-xs text-gray-600"><strong>Empresa:</strong> {companyName}</p>
              <p className="text-xs text-gray-600"><strong>Domicilio:</strong> Tuxtla Gutiérrez, Chiapas, México</p>
              <p className="text-xs text-gray-600"><strong>Plataforma:</strong> EvaluHR</p>
            </div>

            {/* Data collected */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-gray-800">📊 Datos que se recopilarán</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 text-xs text-gray-600">
                <li>Nombre completo y correo electrónico</li>
                <li>Teléfono y edad (opcionales)</li>
                <li>Respuestas a evaluación psicométrica Big Five (20 preguntas)</li>
                <li>Factores psicosociales NOM-035 (20 preguntas: estrés, empatía, adaptabilidad, liderazgo)</li>
                <li>Conocimientos técnicos específicos del puesto (8 preguntas)</li>
              </ul>
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
                      Incluye: Conocimientos + Psicométrica + Psicológica (perfil completo de idoneidad)
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                      ✅ Puede retirar su consentimiento en cualquier momento
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
                    <p className="text-xs text-sky-600 mt-1 font-medium">
                      ✅ NO afecta su participación en el proceso de selección — Mismas oportunidades
                    </p>
                  </div>
                </div>
              </button>

              {/* Option C: Anonymous stats (checkbox, not exclusive) */}
              <div className={`p-3.5 rounded-lg border-2 transition-all ${
                anonymousStats ? 'border-teal-400 bg-teal-50/50' : 'border-gray-200 bg-gray-50/50'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={anonymousStats}
                    onCheckedChange={(checked) => setAnonymousStats(checked as boolean)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Opción C: Estadísticas Anónimas (Opcional)</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Autoriza el uso de sus datos anonimizados para mejorar los instrumentos de evaluación.
                    </p>
                    <p className="text-xs text-teal-600 mt-0.5 font-medium">
                      ✅ Totalmente voluntario — No afecta su evaluación
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ARCO Rights */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-600" />
                <p className="font-semibold text-gray-800">Sus Derechos ARCO (LFPDPPP)</p>
              </div>
              <ul className="space-y-1 ml-1 text-xs text-gray-600">
                <li><strong>Acceso</strong> a sus datos personales</li>
                <li><strong>Rectificación</strong> de datos incorrectos</li>
                <li><strong>Cancelación</strong> de sus datos</li>
                <li><strong>Oposición</strong> al tratamiento</li>
              </ul>
              <div className="border-t border-gray-200 pt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  <strong>Ejercicio:</strong> recursos.humanos@cafedechiapas.mx
                </p>
                <p className="text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  O presencial: Tuxtla Gutiérrez, Chiapas
                </p>
                <p className="text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Respuesta máxima: 20 días hábiles
                </p>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-md border border-emerald-200 mt-2">
                <p className="text-xs text-emerald-700 font-medium">
                  <Ban className="w-3.5 h-3.5 inline mr-1" />
                  Su decisión NO generará trato discriminatorio (Art. 37 Bis LFPDPPP)
                </p>
              </div>
            </div>

            {/* Retention period */}
            <div className="bg-gray-50 rounded-lg p-3.5 text-xs text-gray-600 space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="font-semibold text-gray-700">Período de Retención</p>
              </div>
              <p>• <strong>Datos personales:</strong> 2 años tras finalizada la evaluación</p>
              <p>• <strong>Datos sensibles:</strong> Eliminados al retirar consentimiento o al finalizar proceso</p>
              <p>• <strong>Estadísticas anónimas:</strong> Sin límite temporal</p>
            </div>

            {/* Confirmation checkbox - REQUIRED before continuing */}
            <div className={`p-3.5 rounded-lg border-2 transition-all ${
              confirmedReading
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-gray-200 bg-white'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={confirmedReading}
                  onCheckedChange={(checked) => setConfirmedReading(checked as boolean)}
                  className="mt-0.5"
                />
                <p className="text-xs text-gray-700 leading-relaxed">
                  He leído y comprendo las 3 opciones de participación y mis derechos ARCO.
                  Autorizo el tratamiento de mis datos personales de conformidad con la opción seleccionada arriba,
                  de manera <strong>libre, informada y voluntaria</strong>.
                  Entiendo que puedo retirar mi consentimiento en cualquier momento sin que esto afecte mi
                  participación en el proceso de selección.
                </p>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Submit button — requires BOTH option selected AND checkbox confirmed */}
            <Button
              onClick={handleAccept}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
              disabled={!selectedOption || !confirmedReading || loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                <>Continuar <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>

            {!selectedOption && (
              <p className="text-center text-xs text-gray-400">Seleccione una opción de participación para continuar</p>
            )}
            {selectedOption && !confirmedReading && (
              <p className="text-center text-xs text-amber-500">Marque la casilla de confirmación para continuar</p>
            )}

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
