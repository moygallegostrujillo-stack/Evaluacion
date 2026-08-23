'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Info,
  Download,
  CheckCircle2,
  Mail,
  Clock,
  Lock,
  FileText,
  AlertCircle,
  Scale,
  BarChart3,
  Brain,
  BookOpen,
} from 'lucide-react'

/**
 * ConsentView — LFPDPPP-compliant informed consent screen.
 *
 * Bug #1 fix: Option A and Option B are NOT Radix RadioGroupItems.
 * Radix RadioGroup does not allow deselecting a selected radio by clicking it
 * again, which prevented candidates from un-checking Option B once selected.
 * Instead we render clickable cards whose onClick handler toggles the
 * `selectedOption` state, allowing the user to click again to deselect.
 *
 * Bug #2 fix: The Continue button now POSTs the COMPLETE consent payload
 * (userId, consentOption, anonymousStats, confirmedReading) so the API has
 * everything it needs to validate and persist the consent — previously it
 * only sent `{ userId }`, which caused the API to reject the request with
 * "Error al registrar el consentimiento".
 */
export default function ConsentView() {
  const user = useAppStore((s) => s.user)
  const token = useAppStore((s) => s.token)
  const setAuth = useAppStore((s) => s.setAuth)
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  // 'FULL' (Option A) | 'KNOWLEDGE_ONLY' (Option B) | null
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  // Option C — independent checkbox
  const [anonymousStats, setAnonymousStats] = useState(false)
  // Confirmation checkbox (must be checked to enable Continue)
  const [confirmedReading, setConfirmedReading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Toggle a participation option. If the same option is clicked again, it
  // deselects (returns to null). Otherwise it switches to the new option.
  // This is the key behavior that fixes Bug #1 — Radix RadioGroup cannot do this.
  const toggleOption = (option: string) => {
    setError(null)
    setSelectedOption((prev) => (prev === option ? null : option))
  }

  const canContinue =
    selectedOption !== null && confirmedReading === true && !loading

  const handleAccept = async () => {
    if (!user?.id) {
      setError('Sesión no válida. Por favor, vuelve a iniciar sesión.')
      return
    }
    if (!selectedOption || !confirmedReading) {
      setError('Selecciona una opción de participación y confirma la lectura.')
      return
    }

    setLoading(true)
    setError(null)

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

      const data = await res.json().catch(() => ({} as Record<string, unknown>))

      if (!res.ok) {
        setError(
          (typeof data.error === 'string' && data.error) ||
            'Error al registrar el consentimiento. Intenta nuevamente.'
        )
        return
      }

      // Update local store with the new consent fields so downstream views
      // (EvaluationView) know which templates to render and whether to show
      // the "Retirar consentimiento" button.
      if (token) {
        setAuth(
          {
            ...user,
            consentGiven: true,
            consentOption: selectedOption,
            anonymousStats,
            consentConfirmed: true,
            consentVersion: '2026-01-v1',
          },
          token
        )
      }

      setCurrentView('take-evaluation')
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4 shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Consentimiento Informado
          </h1>
          <p className="text-gray-500 mt-1">
            Antes de continuar, revisa y acepta tu participación
          </p>
        </div>

        <Card className="shadow-md border-2 border-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Aviso Importante — Datos Personales Sensibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warning block (amber) */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
              <p className="text-sm text-amber-900 font-medium">
                Está a punto de realizar evaluaciones psicométricas,
                psicológicas, de conocimientos y de integridad.
              </p>
              <p className="text-sm text-amber-800">
                Los resultados serán utilizados exclusivamente para el proceso
                de selección laboral al que está aplicando.
              </p>
              <div className="flex items-start gap-2 bg-amber-100/60 p-2.5 rounded-md">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Sus respuestas a las pruebas psicométricas, psicológicas
                  y de integridad son consideradas{' '}
                  <strong>Datos Personales Sensibles</strong>{' '}
                  conforme a la{' '}
                  <strong>
                    Ley Federal de Protección de Datos Personales en Posesión
                    de los Particulares (LFPDPPP)
                  </strong>{' '}
                  y la <strong>NOM-035-STPS-2018</strong>.
                </p>
              </div>
            </div>

            {/* Data controller info — Responsable / Encargado (LFPDPPP) */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Responsable y Encargado del Tratamiento
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Responsable (empresa contratante):</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {user?.companyName || 'la empresa solicitante'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Encargado del tratamiento:</p>
                  <p className="text-sm text-gray-800 font-medium">
                    EvaluHR (plataforma de evaluación)
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3">
                <p className="text-xs text-emerald-800 leading-relaxed">
                  <strong>Nota:</strong> La decisión final sobre la contratación corresponde al Responsable ({user?.companyName || 'la empresa solicitante'}). EvaluHR proporciona únicamente orientación informativa.
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Tuxtla Gutiérrez, Chiapas, México
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                recursos.humanos@cafedechiapas.mx
              </p>
            </div>

            {/* Data collected */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Datos que se recopilan y tratan:
              </p>
              <ul className="text-sm text-gray-600 space-y-1.5 ml-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Nombre completo y correo electrónico
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Teléfono (opcional)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Respuestas a evaluaciones psicométricas (Big Five),
                  psicológicas y de integridad
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Resultados de evaluaciones de conocimientos técnicos
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Participation Options */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Opciones de Participación
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Selecciona <strong>una</strong> de las siguientes opciones (A o B).
              Puedes hacer clic nuevamente para deseleccionar.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Option A — FULL */}
            <button
              type="button"
              onClick={() => toggleOption('FULL')}
              aria-pressed={selectedOption === 'FULL'}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === 'FULL'
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    selectedOption === 'FULL'
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedOption === 'FULL' && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-900 text-sm">
                      Opción A — Evaluación Completa
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Incluye evaluación <strong>psicométrica</strong> (Big Five),{' '}
                    <strong>psicológica</strong> (estrés, empatía,
                    adaptabilidad, liderazgo, trabajo en equipo), de{' '}
                    <strong>conocimientos técnicos</strong> y de{' '}
                    <strong>integridad</strong> (orientativo).
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Recomendada para una valoración integral del candidato.
                  </p>
                </div>
              </div>
            </button>

            {/* Option B — KNOWLEDGE_ONLY */}
            <button
              type="button"
              onClick={() => toggleOption('KNOWLEDGE_ONLY')}
              aria-pressed={selectedOption === 'KNOWLEDGE_ONLY'}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === 'KNOWLEDGE_ONLY'
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    selectedOption === 'KNOWLEDGE_ONLY'
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedOption === 'KNOWLEDGE_ONLY' && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-900 text-sm">
                      Opción B — Solo Conocimientos
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Únicamente la evaluación de <strong>
                      conocimientos técnicos
                    </strong>{' '}
                    específicos del puesto. No se aplicarán pruebas
                    psicométricas ni psicológicas.
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Para candidatos que prefieren no compartir datos
                    psicológicos sensibles.
                  </p>
                </div>
              </div>
            </button>

            {/* Option C — anonymous stats (independent checkbox) */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                anonymousStats
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <label
                htmlFor="anonymous-stats"
                className="flex items-start gap-3 cursor-pointer"
              >
                <Checkbox
                  id="anonymous-stats"
                  checked={anonymousStats}
                  onCheckedChange={(checked) => {
                    setAnonymousStats(checked === true)
                    setError(null)
                  }}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold text-gray-900 text-sm">
                      Opción C — Estadísticas Anónimas (opcional)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Acepto que mis datos sean utilizados de forma{' '}
                    <strong>anónima y agregada</strong> para fines estadísticos
                    internos. En ningún caso se asociará mi identidad con los
                    resultados estadísticos agregados.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* ARCO Rights */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              Sus Derechos ARCO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-800">
                  <strong>A</strong>cceder
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Conocer qué datos personales suyos tenemos en posesión.
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-800">
                  <strong>R</strong>ectificar
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Corregir datos inexactos o incompletos.
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-800">
                  <strong>C</strong>ancelar
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Solicitar la cancelación de sus datos.
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-800">
                  <strong>O</strong>ponerse
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Oponerse al tratamiento de sus datos para fines específicos.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-3">
              <p className="text-xs text-gray-600">
                Para ejercer sus derechos ARCO, envíe su solicitud a{' '}
                <a
                  href="mailto:recursos.humanos@cafedechiapas.mx"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  recursos.humanos@cafedechiapas.mx
                </a>
                . Tiempo máximo de respuesta:{' '}
                <strong>20 días hábiles</strong> conforme al Art. 32 del
                Reglamento de la LFPDPPP.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Retention period */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Períodos de Conservación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Datos personales:</strong> 2 años posteriores al
                  proceso de selección.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Datos sensibles</strong> (respuestas psicométricas /
                  psicológicas / de integridad): se eliminarán al concluir el
                  proceso o al retirar el consentimiento.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Estadísticas anónimas:</strong> sin límite de
                  conservación (no son identificables).
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Non-discrimination notice (Art. 37 Bis LFPDPPP) */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Sin discriminación (Art. 37 Bis LFPDPPP)
              </p>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                Su decisión respecto a las opciones de participación{' '}
                <strong>NO generará trato discriminatorio</strong>. Cualquiera
                que sea su elección, tendrá las mismas oportunidades que el
                resto de los candidatos en el proceso de selección.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation checkbox */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <label
            htmlFor="confirm-reading"
            className="flex items-start gap-3 cursor-pointer"
          >
            <Checkbox
              id="confirm-reading"
              checked={confirmedReading}
              onCheckedChange={(checked) => {
                setConfirmedReading(checked === true)
                setError(null)
              }}
              className="mt-0.5"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              He leído y comprendo las <strong>3 opciones de participación</strong>{' '}
              (A: Evaluación Completa, B: Solo Conocimientos, C: Estadísticas
              Anónimas) y mis derechos <strong>ARCO</strong>. Autorizo el
              tratamiento de mis datos personales de conformidad con la opción
              seleccionada arriba, de manera{' '}
              <strong>libre, informada y voluntaria</strong>. Entiendo que
              puedo <strong>retirar mi consentimiento en cualquier momento</strong>{' '}
              sin que esto afecte mi participación en el proceso de selección.
            </span>
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">
                Error al registrar el consentimiento
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Continue button */}
        <Button
          onClick={handleAccept}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          size="lg"
          disabled={!canContinue}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            <>
              Continuar
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Download privacy notice */}
        <a
          href="/Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf"
          download
          className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 hover:underline w-full"
        >
          <FileText className="w-4 h-4" />
          Descargar Aviso de Privacidad completo (PDF)
        </a>
      </div>
    </div>
  )
}
