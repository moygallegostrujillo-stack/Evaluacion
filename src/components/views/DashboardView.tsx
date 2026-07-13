'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAppStore, type CandidateResult } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users, ClipboardCheck, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, UserPlus, BarChart3, Calendar,
  ArrowRight, RefreshCw
} from 'lucide-react'

interface DashboardData {
  totalCandidates: number
  completedEvaluations: number
  pendingEvaluations: number
  aptoCount: number
  entrevistaCount: number
  noRecomendadoCount: number
  recentResults: CandidateResult[]
  positionStats: { positionId: string; positionTitle: string; count: number }[]
}

// Simple CSS-based bar chart (no recharts - avoids infinite re-render bug)
function SimpleBarChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-24 truncate" title={item.name}>{item.name}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-6 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// Simple CSS-based donut chart
function SimpleDonutChart({ segments }: { segments: { name: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        Sin datos aún
      </div>
    )
  }

  // Build cumulative percentages for conic-gradient without mutation
  const gradientStops = segments.reduce<Array<{ color: string; start: number; end: number; name: string; value: number }>>(
    (acc, seg, i) => {
      const prevEnd = i === 0 ? 0 : acc[i - 1].end
      acc.push({ color: seg.color, start: prevEnd, end: prevEnd + seg.value / total, name: seg.name, value: seg.value })
      return acc
    },
    []
  )

  // Build conic-gradient
  const gradientParts = gradientStops.map(s =>
    `${s.color} ${s.start * 360}deg ${s.end * 360}deg`
  ).join(', ')

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-40 h-40 rounded-full relative"
        style={{ background: `conic-gradient(${gradientParts})` }}
      >
        <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{total}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-gray-600">{seg.name}: {seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardView() {
  const user = useAppStore((s) => s.user)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const setSelectedResultId = useAppStore((s) => s.setSelectedResultId)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    if (!user?.companyId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard?companyId=${user.companyId}`)
      const d = await res.json()
      setData(d)
    } catch (e) {
      console.error('Error fetching dashboard', e)
    } finally {
      setLoading(false)
    }
  }, [user?.companyId])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!data) return null

  const recommendationSegments = [
    { name: 'Apto', value: data.aptoCount, color: '#10b981' },
    { name: 'Entrevista', value: data.entrevistaCount, color: '#f59e0b' },
    { name: 'No Recomendado', value: data.noRecomendadoCount, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const positionBarData = data.positionStats.map(p => ({
    name: p.positionTitle,
    value: p.count,
    color: '#10b981',
  }))

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido/a, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500">{user?.companyName} — Panel de control</p>
        </div>
        <Button onClick={fetchDashboard} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" /> Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Candidatos</p>
                <p className="text-2xl font-bold">{data.totalCandidates}</p>
              </div>
              <Users className="w-8 h-8 text-emerald-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Evaluaciones Completadas</p>
                <p className="text-2xl font-bold">{data.completedEvaluations}</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-teal-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold">{data.pendingEvaluations}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tasa de Aprobación</p>
                <p className="text-2xl font-bold">
                  {data.completedEvaluations > 0
                    ? Math.round((data.aptoCount / data.completedEvaluations) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendation Donut Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribución de Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <SimpleDonutChart segments={recommendationSegments} />
          </CardContent>
        </Card>

        {/* Position Bar Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Candidatos por Puesto</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            {positionBarData.length > 0 ? (
              <SimpleBarChart data={positionBarData} />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                Sin datos aún
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Resultados Recientes</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('candidates')}
              className="text-emerald-600"
            >
              Ver todos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No hay resultados aún</p>
              <p className="text-sm">Invita candidatos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentResults.map((r: CandidateResult) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedResultId(r.id)
                    setCurrentView('candidate-detail')
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
                      {r.candidateName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{r.candidateName}</p>
                      <p className="text-xs text-gray-500">{r.positionTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-sm">{Math.round(r.overallScore)}/100</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        r.recommendation === 'APTO'
                          ? 'bg-emerald-100 text-emerald-700'
                          : r.recommendation === 'ENTREVISTA_ADICIONAL'
                          ? 'bg-amber-100 text-amber-700'
                          : r.recommendation === 'NO_RECOMENDADO'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {r.recommendation === 'APTO' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {r.recommendation === 'ENTREVISTA_ADICIONAL' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {r.recommendation === 'NO_RECOMENDADO' && <XCircle className="w-3 h-3 mr-1" />}
                      {r.recommendation === 'APTO' ? 'Apto' : r.recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista' : r.recommendation === 'NO_RECOMENDADO' ? 'No Recomendado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="shadow-sm cursor-pointer hover:shadow-md transition-shadow border-emerald-200"
          onClick={() => setCurrentView('invite')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Invitar Candidato</p>
              <p className="text-xs text-gray-500">Enviar enlace de evaluación</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm cursor-pointer hover:shadow-md transition-shadow border-teal-200"
          onClick={() => setCurrentView('compare')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Comparar Candidatos</p>
              <p className="text-xs text-gray-500">Análisis comparativo</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm cursor-pointer hover:shadow-md transition-shadow border-purple-200"
          onClick={() => setCurrentView('interviews')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Entrevistas</p>
              <p className="text-xs text-gray-500">Programar entrevistas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
