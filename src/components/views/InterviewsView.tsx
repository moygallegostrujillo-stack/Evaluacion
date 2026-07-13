'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface Interview {
  id: string
  candidateId: string
  candidateName?: string
  positionTitle?: string
  scheduledAt: string
  status: string
  location?: string
  notes?: string
  notified: boolean
}

export default function InterviewsView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (user?.companyId) params.set('companyId', user.companyId)
    fetch(`/api/interviews?${params.toString()}`)
      .then(res => res.json())
      .then(data => setInterviews(data.interviews || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.companyId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Badge className="bg-amber-100 text-amber-700">Programada</Badge>
      case 'COMPLETED': return <Badge className="bg-emerald-100 text-emerald-700">Completada</Badge>
      case 'CANCELLED': return <Badge className="bg-red-100 text-red-700">Cancelada</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const scheduled = interviews.filter(i => i.status === 'SCHEDULED')
  const completed = interviews.filter(i => i.status === 'COMPLETED')
  const cancelled = interviews.filter(i => i.status === 'CANCELLED')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Entrevistas</h1>
          <p className="text-gray-500 text-sm">Gestión de entrevistas programadas</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Programadas</p>
            <p className="text-2xl font-bold">{scheduled.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Completadas</p>
            <p className="text-2xl font-bold">{completed.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Canceladas</p>
            <p className="text-2xl font-bold">{cancelled.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>
      ) : interviews.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No hay entrevistas programadas</p>
            <p className="text-sm">Las entrevistas se programan desde el detalle del candidato</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {interviews.map((int) => (
            <Card key={int.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
                      {int.candidateName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium">{int.candidateName || 'Candidato'}</p>
                      <p className="text-xs text-gray-500">{int.positionTitle || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(int.status)}
                    {int.notified && (
                      <Badge variant="outline" className="text-xs">Notificado</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(int.scheduledAt).toLocaleDateString('es-MX', {
                      weekday: 'short', day: 'numeric', month: 'long',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  {int.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {int.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
