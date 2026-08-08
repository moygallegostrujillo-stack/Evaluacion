'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore, type CandidateResult } from '@/lib/store'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function CompareView() {
  const user = useAppStore((s) => s.user)
  const compareIds = useAppStore((s) => s.compareIds)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const [results, setResults] = useState<CandidateResult[]>([])
  const [loading, setLoading] = useState(compareIds.length > 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (compareIds.length === 0) return
    let cancelled = false
    apiFetch(`/api/results?compareIds=${compareIds.join(',')}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then(data => {
        if (!cancelled) {
          // API returns { comparison: { candidates: [...] } } with scores nested inside
          const candidates = data.comparison?.candidates || []
          // Flatten scores from nested object to top-level for component compatibility
          const flattened = candidates.map((c: any) => ({
            ...c,
            ...(c.scores || {}),
          }))
          setResults(flattened)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Compare fetch error:', err)
          setError(err.message || 'Error al cargar comparación')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [compareIds])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setCurrentView('candidates')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Candidatos
        </Button>
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-600 font-medium">Error al comparar candidatos</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCurrentView('candidates')}>
            Volver a Candidatos
          </Button>
        </div>
      </div>
    )
  }

  if (results.length < 2) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setCurrentView('candidates')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Candidatos
        </Button>
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Selecciona al menos 2 candidatos para comparar</p>
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCurrentView('candidates')}>
            Ir a Candidatos
          </Button>
        </div>
      </div>
    )
  }

  // Prepare comparison data
  const dimensions = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism', 'stressLevel', 'empathy', 'adaptability', 'leadership', 'teamwork']
  const dimensionLabels: Record<string, string> = {
    openness: 'Apertura',
    conscientiousness: 'Responsabilidad',
    extraversion: 'Extraversión',
    agreeableness: 'Amabilidad',
    neuroticism: 'Neuroticismo',
    stressLevel: 'Estrés',
    empathy: 'Empatía',
    adaptability: 'Adaptabilidad',
    leadership: 'Liderazgo',
    teamwork: 'Trabajo Equipo',
  }

  const radarData = dimensions.slice(0, 5).map(dim => {
    const point: any = { dimension: dimensionLabels[dim] }
    results.forEach((r, i) => {
      point[`candidato${i}`] = Math.round((r as any)[dim])
    })
    return point
  })

  const barData = dimensions.slice(5).map(dim => {
    const point: any = { dimension: dimensionLabels[dim] }
    results.forEach((r, i) => {
      point[`candidato${i}`] = Math.round((r as any)[dim])
    })
    return point
  })

  const overallData = results.map((r, i) => ({
    name: r.candidateName?.split(' ')[0] || `Cand. ${i + 1}`,
    puntaje: Math.round(r.overallScore),
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('candidates')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Comparación de Candidatos</h1>
            <p className="text-gray-500 text-sm">{results.length} candidatos</p>
          </div>
        </div>
      </div>

      {/* Candidates Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r, i) => (
          <Card key={r.id} className="shadow-sm" style={{ borderTop: `3px solid ${COLORS[i % COLORS.length]}` }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                >
                  {r.candidateName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium">{r.candidateName}</p>
                  <p className="text-xs text-gray-500">{r.positionTitle}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{Math.round(r.overallScore)}</span>
                <Badge className={
                  r.recommendation === 'APTO' ? 'bg-emerald-100 text-emerald-700' :
                  r.recommendation === 'ENTREVISTA_ADICIONAL' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }>
                  {r.recommendation === 'APTO' ? 'Apto' :
                   r.recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista' : 'No Rec.'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Score Comparison */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Puntuación General</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={overallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="puntaje" radius={[4, 4, 0, 0]}>
                {overallData.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Big Five Radar */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Big Five - Comparativo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} />
              {results.map((_, i) => (
                <Radar
                  key={i}
                  name={results[i].candidateName?.split(' ')[0] || `Cand. ${i + 1}`}
                  dataKey={`candidato${i}`}
                  stroke={COLORS[i % COLORS.length]}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Psychological Bar Comparison */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Evaluación Psicológica - Comparativo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dimension" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {results.map((_, i) => (
                <Bar
                  key={i}
                  dataKey={`candidato${i}`}
                  name={results[i].candidateName?.split(' ')[0] || `Cand. ${i + 1}`}
                  fill={COLORS[i % COLORS.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tabla Comparativa Detallada</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-medium">Dimensión</th>
                  {results.map((r, i) => (
                    <th key={i} className="text-center p-3 font-medium" style={{ color: COLORS[i % COLORS.length] }}>
                      {r.candidateName?.split(' ').slice(0, 2).join(' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dimensions.map(dim => {
                  const values = results.map(r => (r as any)[dim])
                  const maxVal = Math.max(...values)
                  return (
                    <tr key={dim} className="border-t">
                      <td className="p-3 font-medium">{dimensionLabels[dim]}</td>
                      {results.map((r, i) => (
                        <td key={i} className="text-center p-3">
                          <span className={values[i] === maxVal ? 'font-bold text-emerald-600' : ''}>
                            {Math.round((r as any)[dim])}
                          </span>
                        </td>
                      ))}
                    </tr>
                  )
                })}
                <tr className="border-t bg-gray-50 font-bold">
                  <td className="p-3">PUNTUACIÓN GENERAL</td>
                  {results.map((r, i) => (
                    <td key={i} className="text-center p-3" style={{ color: COLORS[i % COLORS.length] }}>
                      {Math.round(r.overallScore)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
