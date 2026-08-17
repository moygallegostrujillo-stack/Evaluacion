'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Shield, Info, Download, ArrowRight, ChevronRight } from 'lucide-react'

export default function ConsentView() {
  const user = useAppStore((s) => s.user)
  const setAuth = useAppStore((s) => s.setAuth)
  const token = useAppStore((s) => s.token)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    if (!accepted || !user) return
    setLoading(true)
    try {
      await apiFetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      // Update the user in the store with consentGiven = true
      if (token) {
        setAuth({ ...user, consentGiven: true }, token)
      }
      setCurrentView('take-evaluation')
    } catch {
      console.error('Error saving consent')
    } finally {
      setLoading(false)
    }
  }

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
          {/* Step indicator: Step 1 of 2 */}
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
            {/* Warning about what they're about to do */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
              <p className="text-sm text-amber-900 font-medium">
                Está a punto de realizar evaluaciones psicométricas, psicológicas y de conocimientos.
              </p>
              <p className="text-sm text-amber-800">
                Los resultados serán utilizados exclusivamente para el proceso de selección laboral.
              </p>
              <div className="flex items-start gap-2 bg-amber-100/50 p-2 rounded-md">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Sus datos son considerados <strong>Datos Personales Sensibles</strong> conforme a la LFPDPPP y la NOM-035-STPS-2018.
                </p>
              </div>
            </div>

            {/* Privacy notice */}
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
                id="consent"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label htmlFor="consent" className="text-sm text-emerald-900 cursor-pointer leading-tight">
                Acepto que mis respuestas serán tratadas como datos personales sensibles y consiento someterme a esta evaluación de forma voluntaria. 
                Entiendo que los resultados serán confidenciales y utilizados solo para el proceso de selección.
              </label>
            </div>

            <Button
              onClick={handleAccept}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
              disabled={!accepted || loading}
            >
              {loading ? 'Guardando...' : 'Aceptar y Continuar a la Evaluación'}
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>

            <a
              href="/Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf"
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
