'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Briefcase, Plus, Link2, Copy, Pause, Play, XCircle,
  Edit3, Trash2, Users, HelpCircle, CheckCircle2, Video,
  RefreshCw, ExternalLink, Sparkles, Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ============================================
// Types
// ============================================

interface VacancyQuestionData {
  id: string
  text: string
  type: string
  options: string[] | null
  correctAnswer: number | null
  order: number
  createdAt: string
}

interface VacancyData {
  id: string
  title: string
  slug: string
  description: string | null
  sector: string
  status: string
  includePsicometrica: boolean
  includePsicologica: boolean
  maxVideoSeconds: number
  companyId: string
  createdAt: string
  updatedAt: string
  questions: VacancyQuestionData[]
  applicationCount: number
}

interface ApplicationData {
  id: string
  candidateName: string
  candidateEmail: string
  status: string
  currentStep: number
  overallScore: number
  knowledgeScore: number | null
  recommendation: string
  videoUrl: string | null
  videoType: string | null
  completedAt: string | null
  createdAt: string
}

// ============================================
// Helpers
// ============================================

const SECTOR_LABELS: Record<string, string> = {
  GENERAL: 'General',
  RESTAURANT: 'Restaurante',
  RETAIL: 'Retail',
  SERVICIOS: 'Servicios',
  OTRO: 'Otro',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgClass: string }> = {
  ACTIVE: { label: 'Activa', color: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200' },
  PAUSED: { label: 'Pausada', color: 'text-amber-700', bgClass: 'bg-amber-50 border-amber-200' },
  CLOSED: { label: 'Cerrada', color: 'text-red-700', bgClass: 'bg-red-50 border-red-200' },
}

const RECOMMENDATION_CONFIG: Record<string, { label: string; color: string; bgClass: string }> = {
  APTO: { label: 'Apto', color: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200' },
  ENTREVISTA_ADICIONAL: { label: 'Entrevista', color: 'text-amber-700', bgClass: 'bg-amber-50 border-amber-200' },
  NO_RECOMENDADO: { label: 'No Recomendado', color: 'text-red-700', bgClass: 'bg-red-50 border-red-200' },
  PENDIENTE: { label: 'Pendiente', color: 'text-gray-700', bgClass: 'bg-gray-50 border-gray-200' },
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

// ============================================
// Component
// ============================================

export default function VacancyManagementView() {
  const user = useAppStore((s) => s.user)
  const { toast } = useToast()

  // State
  const [vacancies, setVacancies] = useState<VacancyData[]>([])
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null)
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyData | null>(null)
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<VacancyQuestionData | null>(null)
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null)

  // Create vacancy form
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    sector: 'GENERAL',
    companyId: '',
  })

  // Companies for Super Admin
  const [companies, setCompanies] = useState<Array<{id: string; name: string}>>([])

  // Question form
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  })

  // AI generation state
  const [generatingQuestions, setGeneratingQuestions] = useState(false)

  // ============================================
  // Fetch vacancies
  // ============================================

  const fetchVacancies = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.companyId) params.set('companyId', user.companyId)
      const res = await fetch(`/api/vacancies?${params.toString()}`)
      const data = await res.json()
      if (data.vacancies) {
        setVacancies(data.vacancies)
        // If selected vacancy still exists, refresh it
        if (selectedVacancyId) {
          const updated = data.vacancies.find((v: VacancyData) => v.id === selectedVacancyId)
          if (updated) {
            setSelectedVacancy(updated)
          }
        }
      }
    } catch (e) {
      console.error('Error fetching vacancies', e)
      toast({ title: 'Error', description: 'No se pudieron cargar las vacantes', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [user?.companyId, selectedVacancyId, toast])

  useEffect(() => {
    fetchVacancies()
  }, [user?.companyId])

  // ============================================
  // Fetch vacancy detail + applications
  // ============================================

  const fetchDetail = useCallback(async (vacancyId: string) => {
    setDetailLoading(true)
    try {
      const [vacRes, appRes] = await Promise.all([
        fetch(`/api/vacancies/${vacancyId}`),
        fetch(`/api/vacancies/${vacancyId}/applications`),
      ])
      const vacData = await vacRes.json()
      const appData = await appRes.json()
      if (vacData.vacancy) setSelectedVacancy(vacData.vacancy)
      if (appData.applications) setApplications(appData.applications)
    } catch (e) {
      console.error('Error fetching detail', e)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedVacancyId) {
      fetchDetail(selectedVacancyId)
    } else {
      setSelectedVacancy(null)
      setApplications([])
    }
  }, [selectedVacancyId])

  // ============================================
  // Create vacancy
  // ============================================

  // Fetch companies for Super Admin
  const fetchCompanies = useCallback(async () => {
    if (user?.companyId) return // Not needed for regular users
    try {
      const res = await fetch('/api/companies')
      const data = await res.json()
      if (data.companies) {
        setCompanies(data.companies)
      }
    } catch (e) {
      console.error('Error fetching companies', e)
    }
  }, [user?.companyId])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleCreateVacancy = async () => {
    if (!createForm.title.trim()) return
    const companyId = user?.companyId || createForm.companyId
    if (!companyId) {
      toast({ title: 'Error', description: 'Selecciona una empresa', variant: 'destructive' })
      return
    }
    try {
      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title.trim(),
          description: createForm.description.trim() || undefined,
          sector: createForm.sector,
          companyId,
        }),
      })
      const data = await res.json()
      if (data.vacancy) {
        setVacancies((prev) => [data.vacancy, ...prev])
        setSelectedVacancyId(data.vacancy.id)
        setShowCreateDialog(false)
        setCreateForm({ title: '', description: '', sector: 'GENERAL' })
        const link = `${window.location.origin}/?v=${data.vacancy.slug}`
        toast({
          title: 'Vacante creada',
          description: `Link para compartir: ${link}`,
        })
      } else {
        toast({ title: 'Error', description: data.error || 'No se pudo crear la vacante', variant: 'destructive' })
      }
    } catch (e) {
      console.error('Error creating vacancy', e)
      toast({ title: 'Error', description: 'No se pudo crear la vacante', variant: 'destructive' })
    }
  }

  // ============================================
  // Update vacancy status
  // ============================================

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedVacancyId) return
    try {
      const res = await fetch(`/api/vacancies/${selectedVacancyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.vacancy) {
        setSelectedVacancy(data.vacancy)
        setVacancies((prev) => prev.map((v) => v.id === data.vacancy.id ? data.vacancy : v))
        toast({ title: newStatus === 'PAUSED' ? 'Vacante pausada' : newStatus === 'ACTIVE' ? 'Vacante reactivada' : 'Estado actualizado' })
      }
    } catch (e) {
      console.error('Error updating status', e)
      toast({ title: 'Error', description: 'No se pudo actualizar el estado', variant: 'destructive' })
    }
    setShowCloseDialog(false)
  }

  // ============================================
  // Copy link
  // ============================================

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/?v=${slug}`
    navigator.clipboard.writeText(link).then(() => {
      toast({ title: 'Link copiado', description: link })
    }).catch(() => {
      toast({ title: 'Link', description: link })
    })
  }

  // ============================================
  // Question CRUD
  // ============================================

  const openAddQuestion = () => {
    setEditingQuestion(null)
    setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswer: 0 })
    setShowQuestionDialog(true)
  }

  const openEditQuestion = (q: VacancyQuestionData) => {
    setEditingQuestion(q)
    const opts = q.options && Array.isArray(q.options) ? q.options : ['', '', '', '']
    setQuestionForm({
      text: q.text,
      options: opts.length >= 4 ? opts.slice(0, 4) : [...opts, ...Array(4 - opts.length).fill('')],
      correctAnswer: q.correctAnswer ?? 0,
    })
    setShowQuestionDialog(true)
  }

  const handleSaveQuestion = async () => {
    if (!selectedVacancyId || !questionForm.text.trim()) return
    if (questionForm.options.some((o) => !o.trim())) {
      toast({ title: 'Error', description: 'Todas las opciones son requeridas', variant: 'destructive' })
      return
    }

    try {
      if (editingQuestion) {
        // Update
        const res = await fetch(`/api/vacancies/${selectedVacancyId}/questions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: editingQuestion.id,
            text: questionForm.text.trim(),
            options: questionForm.options.map((o) => o.trim()),
            correctAnswer: questionForm.correctAnswer,
          }),
        })
        const data = await res.json()
        if (data.question) {
          toast({ title: 'Pregunta actualizada' })
          fetchDetail(selectedVacancyId)
          fetchVacancies()
        }
      } else {
        // Create
        const res = await fetch(`/api/vacancies/${selectedVacancyId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: questionForm.text.trim(),
            options: questionForm.options.map((o) => o.trim()),
            correctAnswer: questionForm.correctAnswer,
          }),
        })
        const data = await res.json()
        if (data.question) {
          toast({ title: 'Pregunta agregada' })
          fetchDetail(selectedVacancyId)
          fetchVacancies()
        }
      }
      setShowQuestionDialog(false)
    } catch (e) {
      console.error('Error saving question', e)
      toast({ title: 'Error', description: 'No se pudo guardar la pregunta', variant: 'destructive' })
    }
  }

  const handleDeleteQuestion = async () => {
    if (!selectedVacancyId || !deletingQuestionId) return
    try {
      const res = await fetch(`/api/vacancies/${selectedVacancyId}/questions?questionId=${deletingQuestionId}&vacancyId=${selectedVacancyId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Pregunta eliminada' })
        fetchDetail(selectedVacancyId)
        fetchVacancies()
      }
    } catch (e) {
      console.error('Error deleting question', e)
      toast({ title: 'Error', description: 'No se pudo eliminar la pregunta', variant: 'destructive' })
    }
    setShowDeleteQuestionDialog(false)
    setDeletingQuestionId(null)
  }

  // ============================================
  // AI Generate Questions
  // ============================================
  const handleGenerateQuestions = async () => {
    if (!selectedVacancyId) return
    setGeneratingQuestions(true)
    try {
      const res = await fetch(`/api/vacancies/${selectedVacancyId}/generate-questions`, {
        method: 'POST',
      })
      const data = await res.json()
      if (data.questions && data.questions.length > 0) {
        toast({ 
          title: 'Preguntas generadas', 
          description: `Se generaron ${data.questions.length} preguntas con IA` 
        })
        fetchDetail(selectedVacancyId)
        fetchVacancies()
      } else {
        toast({ 
          title: 'Error', 
          description: data.error || 'No se pudieron generar preguntas', 
          variant: 'destructive' 
        })
      }
    } catch (e) {
      console.error('Error generating questions', e)
      toast({ title: 'Error', description: 'No se pudieron generar preguntas con IA', variant: 'destructive' })
    } finally {
      setGeneratingQuestions(false)
    }
  }

  // ============================================
  // Render helpers
  // ============================================

  const renderStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ACTIVE
    return (
      <Badge variant="outline" className={`${cfg.bgClass} ${cfg.color} border text-xs`}>
        {cfg.label}
      </Badge>
    )
  }

  const renderRecommendationBadge = (rec: string) => {
    const cfg = RECOMMENDATION_CONFIG[rec] || RECOMMENDATION_CONFIG.PENDIENTE
    return (
      <Badge variant="outline" className={`${cfg.bgClass} ${cfg.color} border text-xs`}>
        {cfg.label}
      </Badge>
    )
  }

  // ============================================
  // Loading state
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  // ============================================
  // Render
  // ============================================

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* ========== LEFT PANEL: Vacancy List ========== */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-lg">Vacantes</CardTitle>
                <Badge variant="secondary" className="text-xs">{vacancies.length}</Badge>
              </div>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Nueva
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-260px)] lg:h-[calc(100vh-220px)]">
              {vacancies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Briefcase className="w-12 h-12 mb-3" />
                  <p className="text-sm">No hay vacantes</p>
                  <p className="text-xs mt-1">Crea tu primera vacante</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {vacancies.map((vacancy) => {
                    const isSelected = selectedVacancyId === vacancy.id
                    const sectorLabel = SECTOR_LABELS[vacancy.sector] || vacancy.sector
                    return (
                      <div
                        key={vacancy.id}
                        onClick={() => setSelectedVacancyId(isSelected ? null : vacancy.id)}
                        className={`cursor-pointer rounded-lg border p-3 transition-all ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm text-gray-900 leading-tight line-clamp-2">
                            {vacancy.title}
                          </h3>
                          {renderStatusBadge(vacancy.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {sectorLabel}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <HelpCircle className="w-3 h-3" />
                            {vacancy.questions?.length || 0}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            {vacancy.applicationCount || 0}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ========== RIGHT PANEL: Vacancy Detail ========== */}
      <div className="flex-1 min-w-0">
        {!selectedVacancy ? (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400 py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Selecciona una vacante</p>
              <p className="text-sm mt-1">Elige una vacante de la lista para ver sus detalles</p>
            </div>
          </Card>
        ) : detailLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-6 pr-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900">{selectedVacancy.title}</h2>
                    {renderStatusBadge(selectedVacancy.status)}
                    <Badge variant="outline" className="text-xs">
                      {SECTOR_LABELS[selectedVacancy.sector] || selectedVacancy.sector}
                    </Badge>
                  </div>
                  {selectedVacancy.description && (
                    <p className="text-sm text-gray-500 mt-1">{selectedVacancy.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(selectedVacancy.slug)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar Link
                  </Button>
                  {selectedVacancy.status === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange('PAUSED')}
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pausar
                    </Button>
                  )}
                  {selectedVacancy.status === 'PAUSED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                      onClick={() => handleStatusChange('ACTIVE')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Reactivar
                    </Button>
                  )}
                  {selectedVacancy.status !== 'CLOSED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => setShowCloseDialog(true)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cerrar
                    </Button>
                  )}
                </div>
              </div>

              {/* Shareable Link Section */}
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Link para compartir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-md border border-emerald-200 px-3 py-2 text-sm text-gray-700 font-mono truncate">
                      {window.location.origin}/?v={selectedVacancy.slug}
                    </div>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0"
                      onClick={() => handleCopyLink(selectedVacancy.slug)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2">
                    Comparte este link con los candidatos para que apliquen a la vacante
                  </p>
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <HelpCircle className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{selectedVacancy.questions?.length || 0}</p>
                    <p className="text-xs text-gray-500">Preguntas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{selectedVacancy.applicationCount || 0}</p>
                    <p className="text-xs text-gray-500">Aplicaciones</p>
                  </CardContent>
                </Card>
                <Card className="col-span-2 sm:col-span-1">
                  <CardContent className="p-4 text-center">
                    <Briefcase className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                    <p className="text-sm font-semibold text-gray-900">{formatDate(selectedVacancy.createdAt)}</p>
                    <p className="text-xs text-gray-500">Creada</p>
                  </CardContent>
                </Card>
              </div>

              {/* Questions Management */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-emerald-600" />
                      <CardTitle className="text-base">Preguntas Técnicas</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {selectedVacancy.questions?.length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                        onClick={handleGenerateQuestions}
                        disabled={generatingQuestions || selectedVacancy.status === 'CLOSED'}
                      >
                        {generatingQuestions ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-1" />
                        )}
                        {generatingQuestions ? 'Generando...' : 'Generar con IA'}
                      </Button>
                      {selectedVacancy.status !== 'CLOSED' && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={openAddQuestion}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  {(!selectedVacancy.questions || selectedVacancy.questions.length === 0) ? (
                    <div className="text-center py-8 text-gray-400">
                      <HelpCircle className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm">No hay preguntas técnicas</p>
                      <p className="text-xs mt-1">Agrega preguntas de conocimiento para evaluar candidatos</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedVacancy.questions.map((q, idx) => {
                        const options = q.options && Array.isArray(q.options) ? q.options : []
                        return (
                          <div key={q.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="text-sm font-medium text-gray-900">{q.text}</p>
                              </div>
                              {selectedVacancy.status !== 'CLOSED' && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <div
                                    className="cursor-pointer p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                                    onClick={() => openEditQuestion(q)}
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </div>
                                  <div
                                    className="cursor-pointer p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                                    onClick={() => {
                                      setDeletingQuestionId(q.id)
                                      setShowDeleteQuestionDialog(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </div>
                                </div>
                              )}
                            </div>
                            {options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 ml-8">
                                {options.map((opt, oi) => {
                                  const isCorrect = q.correctAnswer === oi
                                  return (
                                    <div
                                      key={oi}
                                      className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded border ${
                                        isCorrect
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                                          : 'bg-gray-50 border-gray-200 text-gray-600'
                                      }`}
                                    >
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                                      }`}>
                                        {OPTION_LETTERS[oi]}
                                      </span>
                                      {opt}
                                      {isCorrect && <CheckCircle2 className="w-3 h-3 ml-auto text-emerald-500" />}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Applications Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <CardTitle className="text-base">Aplicaciones Recientes</CardTitle>
                    <Badge variant="secondary" className="text-xs">{applications.length}</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  {applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm">No hay aplicaciones aún</p>
                      <p className="text-xs mt-1">Comparte el link para recibir candidatos</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {applications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {app.candidateName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{app.candidateName}</p>
                              <p className="text-xs text-gray-500 truncate">{app.candidateEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {app.videoUrl && (
                              <Video className="w-4 h-4 text-blue-500" />
                            )}
                            {app.status === 'COMPLETED' && (
                              <>
                                <span className="text-xs font-medium text-gray-700">
                                  {Math.round(app.overallScore)}%
                                </span>
                                {renderRecommendationBadge(app.recommendation)}
                              </>
                            )}
                            {app.status === 'IN_PROGRESS' && (
                              <Badge variant="outline" className="text-xs text-amber-600 bg-amber-50 border-amber-200">
                                En progreso
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* ========== CREATE VACANCY DIALOG ========== */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Nueva Vacante
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!user?.companyId && companies.length > 0 && (
              <div className="space-y-2">
                <Label>Empresa *</Label>
                <Select
                  value={createForm.companyId}
                  onValueChange={(val) => setCreateForm((p) => ({ ...p, companyId: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="vacancy-title">Título *</Label>
              <Input
                id="vacancy-title"
                placeholder="Ej: Sastre de Moda, Vendedor de chips..."
                value={createForm.title}
                onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vacancy-desc">Descripción</Label>
              <Textarea
                id="vacancy-desc"
                placeholder="Describe la vacante (opcional)"
                rows={3}
                value={createForm.description}
                onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Sector</Label>
              <Select
                value={createForm.sector}
                onValueChange={(val) => setCreateForm((p) => ({ ...p, sector: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleCreateVacancy}
              disabled={!createForm.title.trim() || (!user?.companyId && !createForm.companyId)}
            >
              Crear Vacante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== ADD/EDIT QUESTION DIALOG ========== */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              {editingQuestion ? 'Editar Pregunta' : 'Agregar Pregunta'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="question-text">Pregunta *</Label>
              <Textarea
                id="question-text"
                placeholder="Escribe la pregunta técnica..."
                rows={2}
                value={questionForm.text}
                onChange={(e) => setQuestionForm((p) => ({ ...p, text: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label>Opciones y Respuesta Correcta</Label>
              <RadioGroup
                value={String(questionForm.correctAnswer)}
                onValueChange={(val) => setQuestionForm((p) => ({ ...p, correctAnswer: parseInt(val) }))}
                className="space-y-2"
              >
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <RadioGroupItem value={String(idx)} id={`opt-${idx}`} />
                    <Label htmlFor={`opt-${idx}`} className="text-xs font-bold w-5">
                      {OPTION_LETTERS[idx]})
                    </Label>
                    <Input
                      placeholder={`Opción ${OPTION_LETTERS[idx]}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...questionForm.options]
                        newOpts[idx] = e.target.value
                        setQuestionForm((p) => ({ ...p, options: newOpts }))
                      }}
                      className={`flex-1 ${
                        questionForm.correctAnswer === idx
                          ? 'border-emerald-400 bg-emerald-50'
                          : ''
                      }`}
                    />
                  </div>
                ))}
              </RadioGroup>

              {/* Preview of correct answer */}
              {questionForm.options[questionForm.correctAnswer]?.trim() && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700">
                    Respuesta correcta: <strong>{OPTION_LETTERS[questionForm.correctAnswer]}) {questionForm.options[questionForm.correctAnswer]}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSaveQuestion}
              disabled={!questionForm.text.trim() || questionForm.options.some((o) => !o.trim())}
            >
              {editingQuestion ? 'Guardar Cambios' : 'Agregar Pregunta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== CLOSE VACANCY CONFIRMATION ========== */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar vacante?</AlertDialogTitle>
            <AlertDialogDescription>
              Al cerrar la vacante &quot;{selectedVacancy?.title}&quot;, no se recibirán más aplicaciones. Esta acción se puede revertir reactivando la vacante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusChange('CLOSED')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cerrar Vacante
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ========== DELETE QUESTION CONFIRMATION ========== */}
      <AlertDialog open={showDeleteQuestionDialog} onOpenChange={setShowDeleteQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar pregunta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La pregunta será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestion}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
