'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type Position } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Copy, Check, Mail, MessageSquare, UserPlus } from 'lucide-react'

interface Invitation {
  id: string
  email: string
  phone?: string
  token: string
  status: string
  channel: string
  positionTitle?: string
  createdAt: string
}

export default function InviteView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [positions, setPositions] = useState<Position[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [positionId, setPositionId] = useState('')
  const [channel, setChannel] = useState('EMAIL')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (user?.companyId) params.set('companyId', user.companyId)
    fetch(`/api/positions?${params.toString()}`)
      .then(res => res.json())
      .then(data => setPositions(data.positions || []))
      .catch(console.error)
  }, [user?.companyId])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.companyId || !positionId) return
    setLoading(true)
    setSent(false)
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          companyId: user.companyId,
          positionId,
          invitedBy: user.id,
          channel,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setInvitations(prev => [data.invitation, ...prev])
        setSent(true)
        setEmail('')
        setPhone('')
      }
    } catch (e) {
      console.error('Error sending invitation', e)
    } finally {
      setLoading(false)
    }
  }

  const copyToken = (token: string) => {
    const url = `${window.location.origin}/?token=${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge className="bg-amber-100 text-amber-700">Pendiente</Badge>
      case 'REGISTERED': return <Badge className="bg-emerald-100 text-emerald-700">Registrado</Badge>
      case 'COMPLETED': return <Badge className="bg-teal-100 text-teal-700">Completado</Badge>
      case 'EXPIRED': return <Badge className="bg-red-100 text-red-700">Expirado</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Invitar Candidato</h1>
          <p className="text-gray-500 text-sm">Envía un enlace de evaluación por correo o WhatsApp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" /> Nueva Invitación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label>Puesto al que aplica</Label>
                <Select value={positionId} onValueChange={setPositionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un puesto" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Canal de envío</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={channel === 'EMAIL' ? 'default' : 'outline'}
                    className={channel === 'EMAIL' ? 'bg-emerald-600' : ''}
                    size="sm"
                    onClick={() => setChannel('EMAIL')}
                  >
                    <Mail className="w-4 h-4 mr-1" /> Correo
                  </Button>
                  <Button
                    type="button"
                    variant={channel === 'WHATSAPP' ? 'default' : 'outline'}
                    className={channel === 'WHATSAPP' ? 'bg-emerald-600' : ''}
                    size="sm"
                    onClick={() => setChannel('WHATSAPP')}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> WhatsApp
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inv-email">Correo electrónico</Label>
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="candidato@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inv-phone">Teléfono <span className="text-red-500">*</span></Label>
                <Input
                  id="inv-phone"
                  type="tel"
                  placeholder="+52 961 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400">Necesario para contactar al prospecto</p>
              </div>

              {sent && (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-sm text-emerald-700">
                  ¡Invitación enviada exitosamente! Comparte el enlace con el candidato.
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !positionId}
              >
                {loading ? 'Enviando...' : (
                  <>
                    <Send className="w-4 h-4 mr-1" /> Generar Invitación
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Invitations */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Invitaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Las invitaciones aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {invitations.map(inv => (
                  <div key={inv.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{inv.email}</p>
                      {getStatusBadge(inv.status)}
                    </div>
                    {inv.phone && (
                      <p className="text-xs text-green-600 font-medium mb-1 flex items-center gap-1">
                        📞 {inv.phone}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span>Canal: {inv.channel === 'EMAIL' ? '📧 Correo' : '📱 WhatsApp'}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToken(inv.token)}
                        className="text-xs h-7"
                      >
                        {copiedToken === inv.token ? (
                          <><Check className="w-3 h-3 mr-1" /> Copiado</>
                        ) : (
                          <><Copy className="w-3 h-3 mr-1" /> Copiar enlace</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
