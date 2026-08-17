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
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send, Copy, Check, MessageSquare, UserPlus, Phone, User, Building2, Plus, Loader2 } from 'lucide-react'

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

// Sector & category options
const SECTOR_OPTIONS = [
  { value: 'RESTAURANT', label: 'Restaurante' },
  { value: 'RETAIL', label: 'Retail' },
]

const CATEGORIES_BY_SECTOR: Record<string, { value: string; label: string }[]> = {
  RESTAURANT: [
    { value: 'MESERO', label: 'Mesero/a' },
    { value: 'COCINERO', label: 'Cocinero/a' },
    { value: 'BARTENDER', label: 'Bartender' },
    { value: 'GERENTE_PISO', label: 'Gerente de Piso' },
  ],
  RETAIL: [
    { value: 'VENDEDOR', label: 'Vendedor/a' },
    { value: 'GERENTE_PISO', label: 'Gerente de Piso' },
  ],
}

export default function InviteView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [positions, setPositions] = useState<Position[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [candidateName, setCandidateName] = useState('')
  const [phone, setPhone] = useState('')
  const [positionId, setPositionId] = useState('')
  const [channel, setChannel] = useState('WHATSAPP')
  const [loading, setLoading] = useState(false)
  const [loadingPositions, setLoadingPositions] = useState(true)
  const [sent, setSent] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Position creation state
  const [showCreatePosition, setShowCreatePosition] = useState(false)
  const [newPosTitle, setNewPosTitle] = useState('')
  const [newPosSector, setNewPosSector] = useState(user?.companySector || 'RESTAURANT')
  const [newPosCategory, setNewPosCategory] = useState('')
  const [newPosDescription, setNewPosDescription] = useState('')
  const [newPosHasKnowledgeTest, setNewPosHasKnowledgeTest] = useState(false)
  const [creatingPosition, setCreatingPosition] = useState(false)
  const [createPositionError, setCreatePositionError] = useState('')

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

  // When SUPER_ADMIN selects a company, update sector
  useEffect(() => {
    if (isSuperAdmin && selectedCompanyId) {
      const company = companies.find(c => c.id === selectedCompanyId)
      if (company?.sector) {
        setNewPosSector(company.sector)
      }
    }
  }, [isSuperAdmin, selectedCompanyId, companies])

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

  // Create position handler
  const handleCreatePosition = async () => {
    if (!activeCompanyId || !newPosTitle.trim() || !newPosCategory) return

    setCreatingPosition(true)
    setCreatePositionError('')
    try {
      const res = await apiFetch('/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPosTitle.trim(),
          sector: newPosSector,
          category: newPosCategory,
          description: newPosDescription.trim() || undefined,
          hasKnowledgeTest: newPosHasKnowledgeTest,
          companyId: activeCompanyId,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // Refresh positions and auto-select the new one
        const params = new URLSearchParams()
        params.set('companyId', activeCompanyId)
        const posRes = await apiFetch(`/api/positions?${params.toString()}`)
        const posData = await posRes.json()
        setPositions(posData.positions || [])
        setPositionId(data.position.id)
        setShowCreatePosition(false)
        // Reset form
        setNewPosTitle('')
        setNewPosCategory('')
        setNewPosDescription('')
        setNewPosHasKnowledgeTest(false)
      } else {
        setCreatePositionError(data.error || 'Error al crear puesto')
      }
    } catch {
      setCreatePositionError('Error de conexión')
    } finally {
      setCreatingPosition(false)
    }
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

  const copyWhatsAppLink = (token: string, phoneNumber: string, positionTitle?: string) => {
    const url = `${window.location.origin}/?token=${token}`
    const companyName = user?.companyName || 'la empresa'
    const positionText = positionTitle ? `para el puesto de *${positionTitle}*` : ''
    const message = `¡Hola! 🎉\n\nTe invitamos a completar tu evaluación pre-laboral ${positionText} en *${companyName}*.\n\nEs un proceso rápido (10-15 min) que incluye evaluaciones de personalidad y competencias.\n\n👉 Haz clic en el siguiente enlace para comenzar:\n${url}\n\nSi tienes dudas, no dudes en preguntar. ¡Te deseamos mucho éxito! 💪`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    navigator.clipboard.writeText(whatsappUrl)
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

  // Available categories based on selected sector
  const availableCategories = CATEGORIES_BY_SECTOR[newPosSector] || []

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

              {/* Position selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Puesto al que aplica</Label>
                  {positions.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-600 h-6"
                      onClick={() => setShowCreatePosition(!showCreatePosition)}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Nuevo puesto
                    </Button>
                  )}
                </div>
                {!activeCompanyId ? (
                  <p className="text-sm text-gray-400 italic">
                    {isSuperAdmin ? 'Selecciona una empresa primero' : 'No hay empresa asociada'}
                  </p>
                ) : loadingPositions ? (
                  <p className="text-sm text-gray-400">Cargando puestos...</p>
                ) : positions.length === 0 && !showCreatePosition ? (
                  <div className="space-y-3">
                    <p className="text-sm text-amber-600">No hay puestos creados para esta empresa.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-amber-300 text-amber-700 hover:bg-amber-50"
                      onClick={() => setShowCreatePosition(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Crear primer puesto
                    </Button>
                  </div>
                ) : positions.length > 0 ? (
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
                ) : null}
              </div>

              {/* Inline Create Position Form */}
              {showCreatePosition && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-emerald-600" /> Crear nuevo puesto
                  </p>
                  {createPositionError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700">
                      {createPositionError}
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="new-pos-title" className="text-xs">Nombre del puesto *</Label>
                      <Input
                        id="new-pos-title"
                        placeholder="Ej: Mesero, Cocinero, Vendedor..."
                        value={newPosTitle}
                        onChange={(e) => setNewPosTitle(e.target.value)}
                        required
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Sector *</Label>
                        <Select value={newPosSector} onValueChange={(v) => { setNewPosSector(v); setNewPosCategory(''); }}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTOR_OPTIONS.map(s => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Categoría *</Label>
                        <Select value={newPosCategory} onValueChange={setNewPosCategory}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCategories.map(c => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-pos-desc" className="text-xs">Descripción (opcional)</Label>
                      <Textarea
                        id="new-pos-desc"
                        placeholder="Breve descripción del puesto..."
                        value={newPosDescription}
                        onChange={(e) => setNewPosDescription(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPosHasKnowledgeTest}
                        onChange={(e) => setNewPosHasKnowledgeTest(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Incluir evaluación de conocimientos
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                        disabled={creatingPosition || !newPosTitle.trim() || !newPosCategory}
                        onClick={handleCreatePosition}
                      >
                        {creatingPosition ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Creando...</>
                        ) : (
                          'Crear Puesto'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setShowCreatePosition(false)
                          setCreatePositionError('')
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
                disabled={loading || !positionId || !phone.trim()}
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
                        {inv.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyWhatsAppLink(inv.token, inv.phone!, inv.positionTitle)}
                            className="text-xs h-7 text-emerald-600"
                            title="Copiar enlace de WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                          </Button>
                        )}
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
