'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type CandidateResult } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search, CheckCircle2, AlertTriangle, XCircle,
  ArrowLeft, RefreshCw, UserPlus, BarChart3, Phone, Mail,
  ShieldCheck, ShieldX, AlertCircle
} from 'lucide-react'

interface CandidateWithResult {
  id: string
  name: string
  email: string
  phone?: string | null
  role: string
  consentGiven?: boolean
  consentDate?: string | null
  createdAt: string
  result?: CandidateResult
  sessionStatus?: string
  positionTitle?: string | null
  resultSource?: 'evaluation' | 'vacancy' | null
}

export default function CandidatesView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const setSelectedResultId = useAppStore((s) => s.setSelectedResultId)
  const compareIds = useAppStore((s) => s.compareIds)
  const setCompareIds = useAppStore((s) => s.setCompareIds)
  const [candidates, setCandidates] = useState<CandidateWithResult[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRec, setFilterRec] = useState<string>('ALL')

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.companyId) params.set('companyId', user.companyId)
      if (user?.role) params.set('role', user.role)
      const res = await apiFetch(`/api/candidates?${params.toString()}`)
      const data = await res.json()
      setCandidates(data.candidates || [])
    } catch (e) {
      console.error('Error fetching candidates', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [user?.companyId])

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
    const matchRec = filterRec === 'ALL' || c.result?.recommendation === filterRec
    return matchSearch && matchRec
  })

  const toggleCompare = (resultId: string) => {
    if (compareIds.includes(resultId)) {
      setCompareIds(compareIds.filter(id => id !== resultId))
    } else if (compareIds.length < 4) {
      setCompareIds([...compareIds, resultId])
    }
  }

  const getRecBadge = (rec: string) => {
    switch (rec) {
      case 'PERFIL_COMPLETO':
        return <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" />Completo</Badge>
      case 'PERFIL_PARCIAL':
        return <Badge className="bg-amber-100 text-amber-700"><AlertTriangle className="w-3 h-3 mr-1" />Parcial</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Pendiente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidatos</h1>
          <p className="text-gray-500 text-sm">{candidates.length} candidatos registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCandidates}>
            <RefreshCw className="w-4 h-4 mr-1" /> Actualizar
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setCurrentView('invite')}
          >
            <UserPlus className="w-4 h-4 mr-1" /> Invitar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, correo o teléfono..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PERFIL_COMPLETO', 'PERFIL_PARCIAL', 'PENDIENTE'].map((f) => (
            <Button
              key={f}
              variant={filterRec === f ? 'default' : 'outline'}
              size="sm"
              className={filterRec === f ? 'bg-emerald-600' : ''}
              onClick={() => setFilterRec(f)}
            >
              {f === 'ALL' ? 'Todos' : f === 'PERFIL_COMPLETO' ? 'Completos' : f === 'PERFIL_PARCIAL' ? 'Parciales' : 'Pend.'}
            </Button>
          ))}
        </div>
      </div>

      {/* Compare button */}
      {compareIds.length >= 2 && (
        <div className="bg-emerald-50 p-3 rounded-lg flex items-center justify-between border border-emerald-200">
          <span className="text-sm text-emerald-700">
            {compareIds.length} candidatos seleccionados para comparar
          </span>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setCurrentView('compare')}
          >
            <BarChart3 className="w-4 h-4 mr-1" /> Comparar
          </Button>
        </div>
      )}

      {/* Candidates List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-gray-400">
            <p>No se encontraron candidatos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                if (c.result) {
                  setSelectedResultId(c.result.id)
                  setCurrentView('candidate-detail')
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm shrink-0">
                      {c.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{c.name}</p>
                        {/* Consent indicator - right next to name */}
                        {c.consentGiven ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700" title={`Aceptó términos y privacidad${c.consentDate ? ' el ' + new Date(c.consentDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}`}>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">OK</span>
                          </span>
                        ) : c.result ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700" title="Inconsistencia: completó evaluación pero no se registró su consentimiento. Corrija en el detalle.">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">Revisar</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-500" title="No ha aceptado términos y privacidad">
                            <ShieldX className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">Pendiente</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {c.email}
                        </p>
                        {c.phone && (
                          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.result && (
                      <>
                        <div className="text-right hidden sm:block">
                          <p className="font-bold">{Math.round(c.result.overallScore)}/100</p>
                          <p className="text-xs text-gray-500">{c.positionTitle || c.result.positionTitle}</p>
                        </div>
                        {getRecBadge(c.result?.recommendation)}
                        {c.resultSource === 'vacancy' && (
                          <Badge variant="outline" className="text-[10px] text-blue-500 border-blue-200">Vacante</Badge>
                        )}
                        <Checkbox
                          checked={compareIds.includes(c.result!.id)}
                          onCheckedChange={() => toggleCompare(c.result!.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                      </>
                    )}
                    {!c.result && c.sessionStatus && (
                      <Badge variant="outline" className="text-xs">
                        {c.sessionStatus === 'NOT_STARTED' ? 'Sin iniciar' : c.sessionStatus === 'IN_PROGRESS' ? 'En progreso' : c.sessionStatus}
                      </Badge>
                    )}
                    {!c.result && !c.sessionStatus && (
                      <Badge variant="outline" className="text-xs text-gray-400">Sin evaluación</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
