'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore, type InvitationData } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api'
import {
  Building2, Briefcase, ArrowRight, Eye, EyeOff, User,
  Phone, Mail, Lock, Shield, CheckCircle2, ChevronRight
} from 'lucide-react'

export default function LoginView() {
  const setAuth = useAppStore((s) => s.setAuth)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const setInvitationToken = useAppStore((s) => s.setInvitationToken)
  const invitationToken = useAppStore((s) => s.invitationToken)
  const invitationData = useAppStore((s) => s.invitationData)
  const currentView = useAppStore((s) => s.currentView)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteToken, setInviteToken] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Determine mode: if we have an invitationToken, show registration
  const isFromInvitation = !!invitationToken
  const [mode, setMode] = useState<'login' | 'register'>(
    currentView === 'register' || isFromInvitation ? 'register' : 'login'
  )

  // Pre-fill from invitation data
  useEffect(() => {
    if (invitationData && invitationData.valid) {
      if (invitationData.candidateName) setName(invitationData.candidateName)
      if (invitationData.email) setEmail(invitationData.email)
      if (invitationData.phone) setPhone(invitationData.phone)
    }
  }, [invitationData])

  // Auto-fill token from store
  useEffect(() => {
    if (invitationToken) {
      setInviteToken(invitationToken)
      setMode('register')
    }
  }, [invitationToken])

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const tokenToUse = inviteToken || invitationToken
      if (!tokenToUse) {
        setError('No se encontró el código de invitación. Vuelve a abrir el enlace que recibiste.')
        setLoading(false)
        return
      }
      const res = await apiFetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email,
          name,
          phone: phone || undefined,
          password,
          token: tokenToUse,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al registrarse')
        return
      }
      setAuth(data.user, data.token)
      setCurrentView('consent')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // ─── Registration mode (from invitation) ───
  if (mode === 'register' && isFromInvitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                E
              </div>
              <span className="font-bold text-lg text-gray-900">EvaluHR</span>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</div>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">2</div>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-md space-y-5">
            {/* Company/Position info */}
            {invitationData?.valid && (
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-900 truncate">{invitationData.companyName}</p>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-xs text-gray-500 truncate">{invitationData.positionTitle}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Registration form */}
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Crear tu cuenta</CardTitle>
                <CardDescription>
                  Regístrate para comenzar tu evaluación
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Token is hidden - auto-filled */}
                  <input type="hidden" value={inviteToken || invitationToken || ''} />

                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Nombre completo
                    </Label>
                    <Input
                      id="reg-name"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Correo electrónico
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone" className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      Teléfono <span className="text-red-500 text-xs">*</span>
                    </Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+52 961 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
                    disabled={loading}
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta y Continuar'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Al registrarte, aceptas que tus datos serán tratados conforme a nuestro aviso de privacidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="bg-white/80 border-t border-gray-100 py-3 text-center text-xs text-gray-400">
          EvaluHR — Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()}
        </footer>
      </div>
    )
  }

  // ─── Standard Login/Register mode ───
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
            <div className="flex gap-2">
              <Button
                variant={mode === 'login' ? 'default' : 'ghost'}
                className={mode === 'login' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                onClick={() => setMode('login')}
                size="sm"
              >
                Iniciar Sesión
              </Button>
              <Button
                variant={mode === 'register' ? 'default' : 'ghost'}
                className={mode === 'register' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                onClick={() => setMode('register')}
                size="sm"
              >
                Registrarse
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
                {error}
              </div>
            )}

            {mode === 'login' ? (
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
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Token de invitación</Label>
                  <Input
                    id="token"
                    placeholder="Ingresa tu código de invitación"
                    value={inviteToken}
                    onChange={(e) => setInviteToken(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nombre completo</Label>
                  <Input
                    id="reg-name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Correo electrónico</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Teléfono <span className="text-red-500">*</span></Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+52 961 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()} EvaluHR
        </p>
      </div>
    </div>
  )
}
