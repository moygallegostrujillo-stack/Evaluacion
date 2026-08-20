'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type Position } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Copy, Check, MessageSquare, UserPlus, Phone, User, Building2, Loader2, Trash2, BookOpen, HelpCircle, AlertCircle } from 'lucide-react'

interface Invitation {
  id: string
  candidateName?: string
  email?: string
  phone?: string
  token: string
  status: string
  channel: string
  positionTitle?: string
  createdAt: string
}

interface PositionWithDetails {
  id: string
  title: string
  sector: string
  category: string
  hasKnowledgeTest: boolean
  evaluationTemplates?: Array<{
    id: string
    name: string
    type: string
    order: number
    _count: { questions: number }
  }>
}

const CATEGORY_LABELS: Record<string, string> = {
  MESERO: 'Mesero/a',
  COCINERO: 'Cocinero/a',
  BARTENDER: 'Bartender',
  GERENTE_PISO: 'Gerente de Piso',
  VENDEDOR: 'Vendedor/a',
}

const SECTOR_LABELS: Record<string, string> = {
  RESTAURANT: 'Restaurante',
  RETAIL: 'Retail',
}

export default function InviteView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [positions, setPositions] = useState<PositionWithDetails[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [candidateName, setCandidateName] = useState('')
  const [phone, setPhone] = useState('')
  const [positionId, setPositionId] = useState('')
  const [channel, setChannel] = useState('WHATSAPP')
  const [loading, setLoading] = useState(false)
  const [loadingPositions, setLoadingPositions] = useState(true)
  const [sent, setSent] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // For SUPER_ADMIN: company selector
  const [companies, setCompanies] = useState<{ id: string; name: string; sector?: string }[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const activeCompanyId = isSuperAdmin ? selectedCompanyId : (user?.companyId || '')

  // Load companies for SUPER_ADMIN
  useEffect(() => {
    if (isSuperAdmin) {
      apiFetch('/api/companies')
        .then(res => res.json())
        .then(data => setCompanies(data.companies || []))
        .catch(console.error)
    }
  }, [isSuperAdmin])

  // Load positions when company changes
  const loadPositions = React.useCallback(() => {
    if (!activeCompanyId) {
      setPositions([])
      setLoadingPositions(false)
      return
    }
    setLoadingPositions(true)
    const params = new URLSearchParams()
    params.set('companyId', activeCompanyId)
    apiFetch(`/api/positions?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setPositions(data.positions || [])
        setLoadingPositions(false)
      })
      .catch(err => {
        console.error('Error loading positions:', err)
        setLoadingPositions(false)
      })
  }, [activeCompanyId])

  useEffect(() => {
    loadPositions()
  }, [loadPositions])

  // Load existing invitations
  useEffect(() => {
    if (!activeCompanyId) return
    const params = new URLSearchParams()
    params.set('companyId', activeCompanyId)
    apiFetch(`/api/invite?${params.toString()}`)
      .then(res => res.json())
      .then(data => setInvitations(data.invitations || []))
      .catch(() => {}) // invitations may 404 if no GET handler, that's ok
  }, [activeCompanyId])

  // Get total question count for a position
  const getQuestionCount = (pos: PositionWithDetails): number => {
    if (!pos.evaluationTemplates) return 0
    return pos.evaluationTemplates.reduce((sum, t) => sum + t._count.questions, 0)
  }

  // Get template count for a position
  const getTemplateCount = (pos: PositionWithDetails): number => {
    return pos.evaluationTemplates?.length || 0
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeCompanyId || !positionId) return

    // Validate phone format (basic)
    if (!phone.trim()) {
      setError('El número de WhatsApp es obligatorio')
      return
    }

    setLoading(true)
    setSent(false)
    setError('')
    try {
      const res = await apiFetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidateName || undefined,
          phone: phone.trim(),
          companyId: activeCompanyId,
          positionId,
          invitedBy: user?.id,
          channel,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setInvitations(prev => [data.invitation, ...prev])
        setSent(true)
        setCandidateName('')
        setPhone('')
        setPositionId('')
      } else {
        setError(data.error || 'Error al crear invitación')
      }
    } catch (e) {
      setError('Error de conexión')
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

  const copyWhatsAppMessage = (token: string, positionTitle?: string) => {
    const url = `${window.location.origin}/?token=${token}`
    const companyName = user?.companyName || 'la empresa'
    const positionText = positionTitle ? `para el puesto de ${positionTitle}` : ''
    const message = `¡Hola! 🎉\n\nTe invitamos a completar tu evaluación pre-laboral ${positionText} en ${companyName}.\n\nEs un proceso rápido (10-15 min) que incluye evaluaciones de personalidad y competencias.\n\n👉 Haz clic en el siguiente enlace para comenzar:\n${url}\n\nSi tienes dudas, no dudes en preguntar. ¡Te deseamos mucho éxito! 💪`
    navigator.clipboard.writeText(message)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const handleDeleteInvitation = async (invitationId: string) => {
    setDeletingId(invitationId)
    try {
      const res = await apiFetch(`/api/invite?id=${invitationId}`, { method: 'DELETE' })
      if (res.ok) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      } else {
        const data = await res.json()
        setError(data.error || 'Error al eliminar invitación')
      }
    } catch {
      setError('Error de conexión al eliminar')
    } finally {
      setDeletingId(null)
    }
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

  // Find selected position details
  const selectedPosition = positions.find(p => p.id === positionId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Invitar Candidato</h1>
          <p className="text-gray-500 text-sm">Envía un enlace de evaluación por WhatsApp</p>
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
              {/* Company selector for SUPER_ADMIN */}
              {isSuperAdmin && (
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Select value={selectedCompanyId} onValueChange={(v) => { setSelectedCompanyId(v); setPositionId(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Position selector - ONLY existing positions */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Puesto al que aplica <span className="text-red-500">*</span>
                </Label>
                {!activeCompanyId ? (
                  <p className="text-sm text-gray-400 italic">
                    {isSuperAdmin ? 'Selecciona una empresa primero' : 'No hay empresa asociada'}
                  </p>
                ) : loadingPositions ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando puestos...
                  </div>
                ) : positions.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-700">No hay puestos creados</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Primero necesitas crear puestos con sus preguntas de evaluación. Luego podrás invitar candidatos a esos puestos.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => setCurrentView('questions')}
                    >
                      <HelpCircle className="w-4 h-4 mr-1" /> Ir a Preguntas y Puestos
                    </Button>
                  </div>
                ) : (
                  <>
                    <Select value={positionId} onValueChange={setPositionId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un puesto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(p => {
                          const qCount = getQuestionCount(p)
                          const tCount = getTemplateCount(p)
                          return (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex items-center gap-2">
                                <span>{p.title}</span>
                                <span className="text-xs text-gray-400">
                                  ({CATEGORY_LABELS[p.category] || p.category} · {qCount} preguntas)
                                </span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {/* Position info card when selected */}
                    {selectedPosition && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">{selectedPosition.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {SECTOR_LABELS[selectedPosition.sector] || selectedPosition.sector}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {getTemplateCount(selectedPosition)} plantillas
                          </span>
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" />
                            {getQuestionCount(selectedPosition)} preguntas
                          </span>
                          {selectedPosition.hasKnowledgeTest && (
                            <Badge className="bg-teal-100 text-teal-700 text-[10px] px-1.5 py-0">
                              Con conocimientos
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Channel selector */}
              <div className="space-y-2">
                <Label>Canal de envío</Label>
                <div className="flex gap-2">
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

              {/* Candidate Name */}
              <div className="space-y-2">
                <Label htmlFor="inv-name">Nombre del candidato</Label>
                <Input
                  id="inv-name"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              {/* WhatsApp / Phone */}
              <div className="space-y-2">
                <Label htmlFor="inv-phone">WhatsApp <span className="text-red-500">*</span></Label>
                <Input
                  id="inv-phone"
                  type="tel"
                  placeholder="+52 961 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400">Número para contactar al prospecto</p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {sent && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-sm text-emerald-700 space-y-2">
                  <p className="font-medium">✅ ¡Invitación generada exitosamente!</p>
                  <p>Copia el enlace de WhatsApp y envíalo al candidato para que pueda completar su evaluación.</p>
                  <p className="text-xs text-emerald-600">El enlace expira en 7 días.</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !positionId || !phone.trim() || positions.length === 0}
              >
                {loading ? 'Generando...' : (
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
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Las invitaciones aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {invitations.map(inv => (
                  <div key={inv.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">
                        {inv.candidateName || inv.email || 'Sin nombre'}
                      </p>
                      {getStatusBadge(inv.status)}
                    </div>
                    {inv.phone && (
                      <p className="text-xs text-green-600 font-medium mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {inv.phone}
                      </p>
                    )}
                    {inv.positionTitle && (
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {inv.positionTitle}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span>Canal: {inv.channel === 'EMAIL' ? '📧 Correo' : '📱 WhatsApp'}</span>
                      </div>
                      <div className="flex gap-1">
                        {inv.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvitation(inv.id)}
                            className="text-xs h-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Eliminar invitación"
                            disabled={deletingId === inv.id}
                          >
                            {deletingId === inv.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 mr-1" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToken(inv.token)}
                          className="text-xs h-7"
                          title="Copiar enlace"
                        >
                          {copiedToken === inv.token ? (
                            <><Check className="w-3 h-3 mr-1" /> Copiado</>
                          ) : (
                            <><Copy className="w-3 h-3 mr-1" /> Enlace</>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyWhatsAppMessage(inv.token, inv.positionTitle)}
                          className="text-xs h-7 text-emerald-600"
                          title="Copiar mensaje para WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                        </Button>
                      </div>
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
