'use client'

import React, { useEffect } from 'react'
import { useAppStore, type ViewType } from '@/lib/store'
import LoginView from '@/components/views/LoginView'
import ConsentView from '@/components/views/ConsentView'
import DashboardView from '@/components/views/DashboardView'
import CandidatesView from '@/components/views/CandidatesView'
import CandidateDetailView from '@/components/views/CandidateDetailView'
import EvaluationView from '@/components/views/EvaluationView'
import EvaluationCompleteView from '@/components/views/EvaluationCompleteView'
import CompareView from '@/components/views/CompareView'
import InviteView from '@/components/views/InviteView'
import InterviewsView from '@/components/views/InterviewsView'
import QuestionsManagementView from '@/components/views/QuestionsManagementView'
import VacancyManagementView from '@/components/views/VacancyManagementView'
import PublicEvaluationView from '@/components/views/PublicEvaluationView'
import CompanyManagementView from '@/components/views/CompanyManagementView'
import InvitationWelcomeView from '@/components/views/InvitationWelcomeView'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard, Users, ClipboardCheck, UserPlus,
  BarChart3, Calendar, LogOut, Menu, X, ChevronRight, HelpCircle, Briefcase,
  CheckCircle2, Building2, Shield
} from 'lucide-react'

// Restore auth from localStorage
function useAuthRestore() {
  const setAuth = useAppStore((s) => s.setAuth)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const user = useAppStore((s) => s.user)
  const currentView = useAppStore((s) => s.currentView)
  const hasRestored = React.useRef(false)

  useEffect(() => {
    if (hasRestored.current) return
    if (user) return // Already authenticated, don't override
    // Don't restore auth if we're in a public evaluation flow
    if (currentView === 'public-evaluation') return
    // Also check if URL or localStorage indicates a public evaluation
    const params = new URLSearchParams(window.location.search)
    if (params.get('v')) return
    if (localStorage.getItem('evaluhr_vacancy_slug')) return

    const token = localStorage.getItem('evaluhr_token')
    const userStr = localStorage.getItem('evaluhr_user')
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setAuth(userData, token)
        // Only set view on initial load (when still on 'login')
        if (currentView === 'login') {
          if (userData.role === 'CANDIDATO') {
            setCurrentView(userData.consentGiven ? 'take-evaluation' : 'consent')
          } else if (userData.role === 'SUPER_ADMIN') {
            setCurrentView('companies')
          } else {
            setCurrentView('dashboard')
          }
        }
        hasRestored.current = true
      } catch {}
    }
  }, [])
}

// Check for invitation token in URL
function useInvitationCheck() {
  const setInvitationToken = useAppStore((s) => s.setInvitationToken)
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      setInvitationToken(token)
      setCurrentView('invitation-welcome')
      // Clean URL — keep token in store only
      window.history.replaceState({}, '', '/')
    }
  }, [])
}

// Check for public vacancy link in URL (?v=slug) or localStorage resume
function useVacancyLinkCheck() {
  const setVacancySlug = useAppStore((s) => s.setVacancySlug)
  const setVacancyApplicationId = useAppStore((s) => s.setVacancyApplicationId)
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  useEffect(() => {
    // Priority 1: Check URL for ?v=slug
    const params = new URLSearchParams(window.location.search)
    const vacancySlugFromUrl = params.get('v')

    if (vacancySlugFromUrl) {
      setVacancySlug(vacancySlugFromUrl)
      setCurrentView('public-evaluation')
      // Save slug to localStorage for reload recovery
      localStorage.setItem('evaluhr_vacancy_slug', vacancySlugFromUrl)
      // Check if there's a saved applicationId for this slug
      const savedAppId = localStorage.getItem('evaluhr_vacancy_app_id')
      if (savedAppId) {
        setVacancyApplicationId(savedAppId)
      }
      // Do NOT strip the URL — keep ?v=slug so reload works
      return
    }

    // Priority 2: Check localStorage for saved evaluation state (page reload)
    const savedSlug = localStorage.getItem('evaluhr_vacancy_slug')
    const savedAppId = localStorage.getItem('evaluhr_vacancy_app_id')

    if (savedSlug) {
      setVacancySlug(savedSlug)
      if (savedAppId) {
        setVacancyApplicationId(savedAppId)
      }
      setCurrentView('public-evaluation')
      // Restore URL to include the slug
      window.history.replaceState({}, '', `/?v=${encodeURIComponent(savedSlug)}`)
    }
  }, [])
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const user = useAppStore((s) => s.user)
  const currentView = useAppStore((s) => s.currentView)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const clearAuth = useAppStore((s) => s.clearAuth)

  if (!user || user.role === 'CANDIDATO') return null

  const isRH = user.role === 'RH' || user.role === 'SUPER_ADMIN'
  const isGerente = user.role === 'GERENTE'

  const isSuperAdmin = user.role === 'SUPER_ADMIN'

  const menuItems: { view: ViewType; label: string; icon: React.ReactNode; show: boolean }[] = [
    { view: 'companies', label: 'Empresas', icon: <Building2 className="w-5 h-5" />, show: isSuperAdmin },
    { view: 'dashboard', label: 'Panel', icon: <LayoutDashboard className="w-5 h-5" />, show: true },
    { view: 'candidates', label: 'Candidatos', icon: <Users className="w-5 h-5" />, show: isRH || isGerente },
    { view: 'vacancies', label: 'Vacantes', icon: <Briefcase className="w-5 h-5" />, show: isRH || isGerente },
    { view: 'questions', label: 'Preguntas', icon: <HelpCircle className="w-5 h-5" />, show: isRH || isGerente },
    { view: 'invite', label: 'Invitar', icon: <UserPlus className="w-5 h-5" />, show: isRH },
    { view: 'compare', label: 'Comparar', icon: <BarChart3 className="w-5 h-5" />, show: isRH || isGerente },
    { view: 'interviews', label: 'Entrevistas', icon: <Calendar className="w-5 h-5" />, show: isRH },
  ]

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <span className="font-bold text-lg">EvaluHR</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.filter(m => m.show).map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              currentView === item.view
                ? 'bg-emerald-50 text-emerald-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <Separator />

      {/* User Info */}
      <div className="p-3">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.companyName}</p>
            <Badge variant="outline" className="mt-1 text-xs">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'RH' ? 'Recursos Humanos' : user.role === 'GERENTE' ? 'Gerente' : user.role}
            </Badge>
          </div>
        )}
        <button
          onClick={clearAuth}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}

function CandidateNav() {
  const user = useAppStore((s) => s.user)
  const clearAuth = useAppStore((s) => s.clearAuth)

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
            E
          </div>
          <span className="font-bold">EvaluHR</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">{user?.name}</span>
          <button
            onClick={clearAuth}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>
    </div>
  )
}

function renderView(view: ViewType) {
  switch (view) {
    case 'invitation-welcome':
      return <InvitationWelcomeView />
    case 'login':
    case 'register':
      return <LoginView />
    case 'consent':
      return <ConsentView />
    case 'dashboard':
      return <DashboardView />
    case 'candidates':
      return <CandidatesView />
    case 'candidate-detail':
      return <CandidateDetailView />
    case 'take-evaluation':
      return <EvaluationView />
    case 'evaluation-complete':
      return <EvaluationCompleteView />
    case 'compare':
      return <CompareView />
    case 'invite':
      return <InviteView />
    case 'vacancies':
      return <VacancyManagementView />
    case 'questions':
      return <QuestionsManagementView />
    case 'interviews':
      return <InterviewsView />
    case 'companies':
      return <CompanyManagementView />
    case 'public-evaluation':
      return <PublicEvaluationView />
    case 'public-evaluation-complete':
      return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold">¡Evaluación Completada!</h2>
            <p className="text-gray-500 mt-2">Gracias por completar tu evaluación. La empresa revisará tu perfil y te contactará.</p>
          </CardContent>
        </Card>
      </div>
    default:
      return <DashboardView />
  }
}

export default function Home() {
  const user = useAppStore((s) => s.user)
  const currentView = useAppStore((s) => s.currentView)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  useAuthRestore()
  useInvitationCheck()
  useVacancyLinkCheck()

  // Public evaluation - no auth required
  if (currentView === 'public-evaluation') {
    return <PublicEvaluationView />
  }

  // Invitation welcome page - no auth required (shows company/position info)
  if (currentView === 'invitation-welcome') {
    return <InvitationWelcomeView />
  }

  // Consent view - renders standalone for candidates (auth already set in store)
  if (currentView === 'consent') {
    return <ConsentView />
  }

  // Register view from invitation - renders LoginView in register mode
  if (currentView === 'register') {
    return <LoginView />
  }

  // Not logged in
  if (!user) {
    return <LoginView />
  }

  // Candidate view - simpler layout
  if (user.role === 'CANDIDATO') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CandidateNav />
        <main className="flex-1 p-4 sm:p-6">
          {renderView(currentView)}
        </main>
        <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
          EvaluHR — Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()}
        </footer>
      </div>
    )
  }

  // Admin/RH/Gerente view - sidebar layout
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderView(currentView)}
        </main>
        <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-xs text-gray-400">
          EvaluHR — Tuxtla Gutiérrez, Chiapas, México © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}
