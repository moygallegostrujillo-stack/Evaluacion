'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api'

export default function LoginView() {
  const setAuth = useAppStore((s) => s.setAuth)
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }
      setAuth(data.user, data.token)
      if (data.user.role === 'CANDIDATO') {
        if (!data.user.consentGiven) {
          setCurrentView('consent')
        } else {
          setCurrentView('take-evaluation')
        }
      } else if (data.user.role === 'SUPER_ADMIN') {
        setCurrentView('companies')
      } else {
        setCurrentView('dashboard')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl font-bold mb-4 shadow-lg">
            E
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EvaluHR</h1>
          <p className="text-gray-500 mt-1">Sistema de Pre-evaluación de Personal</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <p className="text-sm text-gray-500 text-center">Inicia sesión para continuar</p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>

              {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-semibold text-amber-800 mb-2">🔑 Credenciales de demo:</p>
                <div className="space-y-1 text-xs text-amber-700">
                  <p><strong>Admin:</strong> admin@evaluhr.com / admin123</p>
                  <p><strong>RH Restaurante:</strong> rh@cafedechiapas.com / rh1234</p>
                  <p><strong>Gerente:</strong> gerente@cafedechiapas.com / gerente1234</p>
                  <p><strong>RH Retail:</strong> rh@marlui.com / rh1234</p>
                  <p><strong>Candidato:</strong> juan.perez@email.com / candidato1234</p>
                </div>
              </div>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()} EvaluHR
        </p>
      </div>
    </div>
  )
}
