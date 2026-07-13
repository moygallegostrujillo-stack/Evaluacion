'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Plus, Trash2, Edit3, BookOpen, Brain, ClipboardList,
  Utensils, ShoppingBag, Briefcase, CheckCircle2, XCircle,
  HelpCircle, ChevronDown, ChevronRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ============================================
// Types
// ============================================

interface PositionData {
  id: string
  title: string
  sector: string
  category: string
  hasKnowledgeTest: boolean
  evaluationTemplates: Array<{
    id: string
    name: string
    type: string
    order: number
    _count: { questions: number }
  }>
}

interface VacancyData {
  id: string
  title: string
  slug: string
  sector: string
  status: string
  questions: Array<{
    id: string
    text: string
    type: string
    options: string[] | null
    correctAnswer: number | null
    order: number
  }>
  applicationCount: number
}

interface QuestionData {
  id: string
  text: string
  type: 'LIKERT' | 'MULTIPLE_CHOICE' | 'YES_NO'
  options?: string[] | null
  category: string
  order: number
  reverseScored: boolean
  isCustom: boolean
  correctAnswer?: number | null
}

interface TemplateData {
  id: string
  name: string
  type: string
  order: number
  questions: QuestionData[]
}

// Unified selector item
interface SelectorItem {
  id: string
  title: string
  type: 'position' | 'vacancy'
  sector: string
  icon: React.ReactNode
}

// ============================================
// Component
// ============================================

export default function QuestionsManagementView() {
  const user = useAppStore((s) => s.user)
  const { toast } = useToast()

  // Data
  const [positions, setPositions] = useState<PositionData[]>([])
  const [vacancies, setVacancies] = useState<VacancyData[]>([])
  const [loading, setLoading] = useState(true)

  // Selection - unified
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'position' | 'vacancy' | null>(null)

  // Position-specific data
  const [templates, setTemplates] = useState<TemplateData[]>([])
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set())

  // Vacancy-specific data (questions loaded directly)
  const [vacancyQuestions, setVacancyQuestions] = useState<VacancyData['questions']>([])

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formText, setFormText] = useState('')
  const [formOptions, setFormOptions] = useState(['', '', '', ''])
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<number>(0)

  // ============================================
  // Load positions and vacancies
  // ============================================

  useEffect(() => {
    setLoading(true)
    const posParams = new URLSearchParams()
    if (user?.companyId) posParams.set('companyId', user.companyId)
    const vacParams = new URLSearchParams()
    if (user?.companyId) vacParams.set('companyId', user.companyId)

    Promise.all([
      fetch(`/api/positions?${posParams.toString()}`).then(r => r.json()),
      fetch(`/api/vacancies?${vacParams.toString()}`).then(r => r.json()),
    ])
      .then(([posData, vacData]) => {
        setPositions(posData.positions || [])
        setVacancies(vacData.vacancies || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.companyId])

  // ============================================
  // Load questions when selection changes
  // ============================================

  useEffect(() => {
    if (!selectedId || !selectedType) return
    setLoading(true)

    if (selectedType === 'position') {
      // Load templates for position
      fetch(`/api/questions?positionId=${selectedId}`)
        .then(res => res.json())
        .then(data => {
          setTemplates(data.templates || [])
          setVacancyQuestions([])
          const knowledgeTemplate = (data.templates || []).find((t: TemplateData) => t.type === 'CONOCIMIENTOS')
          if (knowledgeTemplate) {
            setExpandedTemplates(new Set([knowledgeTemplate.id]))
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      // Load vacancy questions
      fetch(`/api/vacancies/${selectedId}/questions`)
        .then(res => res.json())
        .then(data => {
          setVacancyQuestions(data.questions || [])
          setTemplates([])
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [selectedId, selectedType])

  // ============================================
  // Selector items
  // ============================================

  const selectorItems: SelectorItem[] = [
    ...vacancies.map(v => ({
      id: v.id,
      title: v.title,
      type: 'vacancy' as const,
      sector: v.sector,
      icon: <Briefcase className="w-4 h-4" />,
    })),
    ...positions.map(p => ({
      id: p.id,
      title: p.title,
      type: 'position' as const,
      sector: p.sector,
      icon: p.sector === 'RESTAURANT' ? <Utensils className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />,
    })),
  ]

  const selectedVacancy = vacancies.find(v => v.id === selectedId)

  // ============================================
  // Handlers for Position (existing)
  // ============================================

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return <Brain className="w-4 h-4" />
      case 'PSICOLOGICA': return <ClipboardList className="w-4 h-4" />
      case 'CONOCIMIENTOS': return <BookOpen className="w-4 h-4" />
      default: return null
    }
  }

  const getTemplateLabel = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return 'Psicométrica'
      case 'PSICOLOGICA': return 'Psicológica'
      case 'CONOCIMIENTOS': return 'Conocimientos'
      default: return type
    }
  }

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'PSICOMETRICA': return 'bg-violet-100 text-violet-700 border-violet-200'
      case 'PSICOLOGICA': return 'bg-sky-100 text-sky-700 border-sky-200'
      case 'CONOCIMIENTOS': return 'bg-amber-100 text-amber-700 border-amber-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const toggleTemplate = (templateId: string) => {
    setExpandedTemplates(prev => {
      const next = new Set(prev)
      if (next.has(templateId)) {
        next.delete(templateId)
      } else {
        next.add(templateId)
      }
      return next
    })
  }

  // Add question for Position template
  const handleAddQuestion = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setFormText('')
    setFormOptions(['', '', '', ''])
    setFormCorrectAnswer(0)
    setShowAddDialog(true)
  }

  const handleSaveNew = async () => {
    if (!selectedTemplateId || !user?.companyId || !formText.trim()) return
    if (formOptions.some(o => !o.trim())) {
      toast({ title: 'Error', description: 'Todas las opciones deben tener texto', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          text: formText,
          type: 'MULTIPLE_CHOICE',
          options: formOptions,
          correctAnswer: formCorrectAnswer,
          isCustom: true,
          companyId: user.companyId,
        }),
      })
      if (!res.ok) throw new Error('Error saving')
      toast({ title: 'Pregunta agregada', description: 'La pregunta se agregó exitosamente' })
      setShowAddDialog(false)
      // Reload
      fetch(`/api/questions?positionId=${selectedId}`)
        .then(r => r.json())
        .then(data => setTemplates(data.templates || []))
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar la pregunta', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditQuestion = (q: QuestionData, templateId: string) => {
    setSelectedQuestion(q)
    setSelectedTemplateId(templateId)
    setFormText(q.text)
    setFormOptions(q.options || ['', '', '', ''])
    setFormCorrectAnswer(q.correctAnswer ?? 0)
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedQuestion || !selectedTemplateId || !formText.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          text: formText,
          options: formOptions,
          correctAnswer: formCorrectAnswer,
        }),
      })
      if (!res.ok) throw new Error('Error updating')
      toast({ title: 'Pregunta actualizada', description: 'Los cambios se guardaron exitosamente' })
      setShowEditDialog(false)
      setSelectedQuestion(null)
      fetch(`/api/questions?positionId=${selectedId}`)
        .then(r => r.json())
        .then(data => setTemplates(data.templates || []))
    } catch {
      toast({ title: 'Error', description: 'No se pudo actualizar la pregunta', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteQuestion = (q: QuestionData) => {
    setSelectedQuestion(q)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedQuestion) return
    setSaving(true)
    try {
      const res = await fetch(`/api/questions?questionId=${selectedQuestion.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error deleting')
      toast({ title: 'Pregunta eliminada', description: 'La pregunta fue eliminada exitosamente' })
      setShowDeleteDialog(false)
      setSelectedQuestion(null)
      fetch(`/api/questions?positionId=${selectedId}`)
        .then(r => r.json())
        .then(data => setTemplates(data.templates || []))
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la pregunta', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  // ============================================
  // Handlers for Vacancy questions
  // ============================================

  const handleAddVacancyQuestion = () => {
    setFormText('')
    setFormOptions(['', '', '', ''])
    setFormCorrectAnswer(0)
    setShowAddDialog(true)
  }

  const handleSaveNewVacancyQuestion = async () => {
    if (!selectedId || !formText.trim()) return
    if (formOptions.some(o => !o.trim())) {
      toast({ title: 'Error', description: 'Todas las opciones deben tener texto', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/vacancies/${selectedId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formText,
          options: formOptions,
          correctAnswer: formCorrectAnswer,
        }),
      })
      if (!res.ok) throw new Error('Error saving')
      toast({ title: 'Pregunta agregada', description: 'La pregunta técnica se agregó a la vacante' })
      setShowAddDialog(false)
      // Reload vacancy questions
      fetch(`/api/vacancies/${selectedId}/questions`)
        .then(r => r.json())
        .then(data => setVacancyQuestions(data.questions || []))
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar la pregunta', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditVacancyQuestion = (q: VacancyData['questions'][0]) => {
    setSelectedQuestion({
      id: q.id,
      text: q.text,
      type: 'MULTIPLE_CHOICE',
      options: q.options,
      category: 'CONOCIMIENTOS',
      order: q.order,
      reverseScored: false,
      isCustom: true,
      correctAnswer: q.correctAnswer,
    })
    setFormText(q.text)
    setFormOptions(q.options || ['', '', '', ''])
    setFormCorrectAnswer(q.correctAnswer ?? 0)
    setShowEditDialog(true)
  }

  const handleSaveEditVacancyQuestion = async () => {
    if (!selectedQuestion || !selectedId || !formText.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/vacancies/${selectedId}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          text: formText,
          options: formOptions,
          correctAnswer: formCorrectAnswer,
        }),
      })
      if (!res.ok) throw new Error('Error updating')
      toast({ title: 'Pregunta actualizada', description: 'Los cambios se guardaron exitosamente' })
      setShowEditDialog(false)
      setSelectedQuestion(null)
      fetch(`/api/vacancies/${selectedId}/questions`)
        .then(r => r.json())
        .then(data => setVacancyQuestions(data.questions || []))
    } catch {
      toast({ title: 'Error', description: 'No se pudo actualizar la pregunta', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteVacancyQuestion = (q: VacancyData['questions'][0]) => {
    setSelectedQuestion({
      id: q.id,
      text: q.text,
      type: 'MULTIPLE_CHOICE',
      options: q.options,
      category: 'CONOCIMIENTOS',
      order: q.order,
      reverseScored: false,
      isCustom: true,
      correctAnswer: q.correctAnswer,
    })
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteVacancyQuestion = async () => {
    if (!selectedQuestion || !selectedId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/vacancies/${selectedId}/questions?questionId=${selectedQuestion.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error deleting')
      toast({ title: 'Pregunta eliminada', description: 'La pregunta fue eliminada exitosamente' })
      setShowDeleteDialog(false)
      setSelectedQuestion(null)
      fetch(`/api/vacancies/${selectedId}/questions`)
        .then(r => r.json())
        .then(data => setVacancyQuestions(data.questions || []))
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la pregunta', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  // ============================================
  // Unified save handler
  // ============================================

  const handleSave = () => {
    if (selectedType === 'vacancy') {
      handleSaveNewVacancyQuestion()
    } else {
      handleSaveNew()
    }
  }

  const handleEditSave = () => {
    if (selectedType === 'vacancy') {
      handleSaveEditVacancyQuestion()
    } else {
      handleSaveEdit()
    }
  }

  const handleConfirmDeleteQuestion = () => {
    if (selectedType === 'vacancy') {
      handleConfirmDeleteVacancyQuestion()
    } else {
      handleConfirmDelete()
    }
  }

  // ============================================
  // Loading
  // ============================================

  if (loading && selectorItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Gestión de Preguntas</h1>
        <p className="text-gray-500 mt-1">Administra las preguntas de evaluación para puestos y vacantes. Agrega preguntas técnicas personalizadas.</p>
      </div>

      {/* Unified Selector */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Selecciona un Puesto o Vacante
          </CardTitle>
          <CardDescription>Elige el puesto o vacante para ver y administrar sus preguntas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dropdown Selector */}
          <Select
            value={selectedId ? `${selectedType}:${selectedId}` : ''}
            onValueChange={(val) => {
              if (!val) {
                setSelectedId(null)
                setSelectedType(null)
                return
              }
              const [type, id] = val.split(':')
              setSelectedType(type as 'position' | 'vacancy')
              setSelectedId(id)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un puesto o vacante..." />
            </SelectTrigger>
            <SelectContent>
              {/* Vacancies group */}
              {vacancies.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3" />
                    Vacantes
                  </div>
                  {vacancies.map(v => (
                    <SelectItem key={`vacancy:${v.id}`} value={`vacancy:${v.id}`}>
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                        {v.title}
                        <Badge variant="outline" className="text-xs py-0 px-1 ml-1">{v.questions.length} preguntas</Badge>
                      </span>
                    </SelectItem>
                  ))}
                  {positions.length > 0 && <Separator className="my-1" />}
                </>
              )}
              {/* Positions group */}
              {positions.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <ClipboardList className="w-3 h-3" />
                    Puestos Predeterminados
                  </div>
                  {positions.map(p => (
                    <SelectItem key={`position:${p.id}`} value={`position:${p.id}`}>
                      <span className="flex items-center gap-2">
                        {p.sector === 'RESTAURANT' ? <Utensils className="w-3.5 h-3.5 text-gray-400" /> : <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />}
                        {p.title}
                      </span>
                    </SelectItem>
                  ))}
                </>
              )}
              {selectorItems.length === 0 && (
                <div className="px-2 py-4 text-center text-gray-400 text-sm">
                  No hay puestos ni vacantes. Crea una vacante primero.
                </div>
              )}
            </SelectContent>
          </Select>

          {/* Quick buttons for vacancies (visual) */}
          {vacancies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {vacancies.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedType('vacancy'); setSelectedId(v.id) }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2 ${
                    selectedType === 'vacancy' && selectedId === v.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {v.title}
                  <Badge variant="outline" className="text-xs py-0 px-1">{v.questions.length}</Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* VACANCY VIEW - Technical Questions */}
      {/* ============================================ */}

      {selectedType === 'vacancy' && selectedVacancy && (
        <div className="space-y-4">
          {/* Vacancy Info */}
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedVacancy.title}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedVacancy.sector !== 'GENERAL' ? `${selectedVacancy.sector} • ` : ''}
                      {selectedVacancy.applicationCount} candidatos • {vacancyQuestions.length} preguntas técnicas
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                  onClick={handleAddVacancyQuestion}
                >
                  <Plus className="w-4 h-4" />
                  Agregar Pregunta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auto-applied sections info */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Evaluación automática para esta vacante</p>
                  <p className="text-xs text-gray-500 mt-1">
                    A todos los candidatos se les aplican automáticamente: <strong>Psicométrica (Big Five)</strong> y <strong>Psicológica</strong> (estrés, empatía, adaptabilidad, liderazgo, trabajo en equipo).
                    Solo las <strong>preguntas técnicas</strong> las creas tú aquí.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Questions List */}
          <Card className="shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-amber-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-100 text-amber-700 border-amber-200">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Preguntas Técnicas / de Conocimiento</p>
                  <span className="text-xs text-gray-500">{vacancyQuestions.length} preguntas</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1"
                onClick={handleAddVacancyQuestion}
              >
                <Plus className="w-3 h-3" />
                Agregar
              </Button>
            </div>

            {vacancyQuestions.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No hay preguntas técnicas aún</p>
                <p className="text-sm text-gray-400 mt-1">Agrega preguntas de conocimiento específicas para esta vacante</p>
                <Button
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleAddVacancyQuestion}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Pregunta
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {vacancyQuestions.map((q, idx) => (
                  <div key={q.id} className="flex items-start gap-3 px-4 py-3 bg-emerald-50/30">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                      {q.type === 'MULTIPLE_CHOICE' && q.options && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`text-xs px-2.5 py-1.5 rounded-md border ${
                                q.correctAnswer === oi
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                                  : 'bg-white border-gray-200 text-gray-600'
                              }`}
                            >
                              <span className="font-medium mr-1">{String.fromCharCode(65 + oi)})</span>
                              {opt}
                              {q.correctAnswer === oi && (
                                <CheckCircle2 className="w-3 h-3 inline ml-1 text-emerald-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1">
                      <button
                        onClick={() => handleEditVacancyQuestion(q)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Editar pregunta"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVacancyQuestion(q)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar pregunta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add question at bottom */}
            {vacancyQuestions.length > 0 && (
              <div className="p-4 border-t bg-gray-50/50">
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50"
                  onClick={handleAddVacancyQuestion}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Pregunta Técnica
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ============================================ */}
      {/* POSITION VIEW - Templates + Questions */}
      {/* ============================================ */}

      {selectedType === 'position' && templates.length > 0 && (
        <div className="space-y-4">
          {templates.map(template => {
            const isExpanded = expandedTemplates.has(template.id)
            const customCount = template.questions.filter(q => q.isCustom).length
            const defaultCount = template.questions.filter(q => !q.isCustom).length
            const isKnowledgeTemplate = template.type === 'CONOCIMIENTOS'

            return (
              <Card key={template.id} className="shadow-sm overflow-hidden">
                {/* Template Header */}
                <div
                  onClick={() => toggleTemplate(template.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getTemplateColor(template.type)}`}>
                      {getTemplateIcon(template.type)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{getTemplateLabel(template.type)}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{template.questions.length} preguntas</span>
                        {defaultCount > 0 && (
                          <Badge variant="outline" className="text-xs py-0 px-1.5">{defaultCount} predeterminadas</Badge>
                        )}
                        {customCount > 0 && (
                          <Badge className="text-xs py-0 px-1.5 bg-emerald-100 text-emerald-700 border-emerald-200">{customCount} personalizadas</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isKnowledgeTemplate && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddQuestion(template.id)
                        }}
                      >
                        <Plus className="w-3 h-3" />
                        Agregar Pregunta
                      </Button>
                    )}
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Questions List */}
                {isExpanded && (
                  <div className="border-t">
                    {template.questions.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        No hay preguntas en esta sección
                      </div>
                    ) : (
                      <div className="divide-y">
                        {template.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className={`flex items-start gap-3 px-4 py-3 ${q.isCustom ? 'bg-emerald-50/30' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                {idx + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                              {q.type === 'MULTIPLE_CHOICE' && q.options && (
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {q.options.map((opt, oi) => (
                                    <div
                                      key={oi}
                                      className={`text-xs px-2.5 py-1.5 rounded-md border ${
                                        q.correctAnswer === oi
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                                          : 'bg-white border-gray-200 text-gray-600'
                                      }`}
                                    >
                                      <span className="font-medium mr-1">{String.fromCharCode(65 + oi)})</span>
                                      {opt}
                                      {q.correctAnswer === oi && (
                                        <CheckCircle2 className="w-3 h-3 inline ml-1 text-emerald-500" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'LIKERT' && (
                                <p className="text-xs text-gray-400 mt-1">Escala Likert (1-5)</p>
                              )}
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">
                              {q.isCustom ? (
                                <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">Personalizada</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Predeterminada</Badge>
                              )}
                              {q.isCustom && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleEditQuestion(q, template.id)}
                                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Editar pregunta"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuestion(q)}
                                    className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Eliminar pregunta"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isKnowledgeTemplate && (
                      <div className="p-4 border-t bg-gray-50/50">
                        <Button
                          variant="outline"
                          className="w-full border-dashed border-2 border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50"
                          onClick={() => handleAddQuestion(template.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Pregunta Personalizada
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty state for position */}
      {selectedType === 'position' && selectedId && templates.length === 0 && !loading && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay plantillas de evaluación para este puesto</p>
            <p className="text-sm text-gray-400 mt-1">Contacta al administrador del sistema para configurar las evaluaciones.</p>
          </CardContent>
        </Card>
      )}

      {/* No selection state */}
      {!selectedId && !loading && selectorItems.length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Selecciona un puesto o vacante</p>
            <p className="text-sm text-gray-400 mt-1">Usa el selector de arriba para ver y administrar las preguntas</p>
          </CardContent>
        </Card>
      )}

      {/* Empty state - no items at all */}
      {selectorItems.length === 0 && !loading && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay puestos ni vacantes</p>
            <p className="text-sm text-gray-400 mt-1">Ve a la sección de Vacantes y crea una nueva vacante para comenzar a agregar preguntas técnicas.</p>
          </CardContent>
        </Card>
      )}

      {/* Info card */}
      <Card className="shadow-sm border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-amber-800">¿Cómo funcionan las preguntas?</p>
              <ul className="text-xs text-amber-700 mt-1.5 space-y-1">
                <li>• Las <strong>vacantes</strong> tienen preguntas técnicas que tú creas específicamente para cada puesto</li>
                <li>• Las secciones de <strong>Psicométrica</strong> y <strong>Psicológica</strong> se aplican automáticamente a todos los candidatos</li>
                <li>• Solo puedes agregar preguntas de <strong>opción múltiple</strong> a la sección de Conocimientos</li>
                <li>• Debes indicar cuál es la <strong>respuesta correcta</strong> para que el sistema pueda calificar automáticamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* Add Question Dialog */}
      {/* ============================================ */}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              {selectedType === 'vacancy' ? 'Nueva Pregunta Técnica' : 'Nueva Pregunta Personalizada'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="question-text" className="text-sm font-medium">Pregunta</Label>
              <Textarea
                id="question-text"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="Escribe la pregunta de conocimiento..."
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Opciones de respuesta</Label>
              <p className="text-xs text-gray-400 mb-2">Escribe 4 opciones y marca la respuesta correcta</p>
              <div className="space-y-2">
                {formOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      onClick={() => setFormCorrectAnswer(idx)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        formCorrectAnswer === idx
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-gray-300 text-gray-400 hover:border-emerald-300'
                      }`}
                    >
                      {formCorrectAnswer === idx ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </button>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formOptions]
                        newOpts[idx] = e.target.value
                        setFormOptions(newOpts)
                      }}
                      placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 text-sm"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                La respuesta correcta es la opción <strong>{String.fromCharCode(65 + formCorrectAnswer)}</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleSave}
              disabled={saving || !formText.trim() || formOptions.some(o => !o.trim())}
            >
              {saving ? 'Guardando...' : 'Agregar Pregunta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* Edit Question Dialog */}
      {/* ============================================ */}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-600" />
              Editar Pregunta
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-question-text" className="text-sm font-medium">Pregunta</Label>
              <Textarea
                id="edit-question-text"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Opciones de respuesta</Label>
              <div className="space-y-2 mt-2">
                {formOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      onClick={() => setFormCorrectAnswer(idx)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        formCorrectAnswer === idx
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-gray-300 text-gray-400 hover:border-emerald-300'
                      }`}
                    >
                      {formCorrectAnswer === idx ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </button>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formOptions]
                        newOpts[idx] = e.target.value
                        setFormOptions(newOpts)
                      }}
                      className="flex-1 text-sm"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                La respuesta correcta es la opción <strong>{String.fromCharCode(65 + formCorrectAnswer)}</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedQuestion(null) }}>Cancelar</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleEditSave}
              disabled={saving || !formText.trim() || formOptions.some(o => !o.trim())}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* Delete Confirmation Dialog */}
      {/* ============================================ */}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta pregunta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La pregunta será eliminada permanentemente
              y ya no aparecerá en las evaluaciones de los candidatos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedQuestion(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteQuestion}
              className="bg-red-600 hover:bg-red-700"
              disabled={saving}
            >
              {saving ? 'Eliminando...' : 'Eliminar Pregunta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
