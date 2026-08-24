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
import CompanyManagementView from '@/components/views/CompanyManagementView'
import InvitationWelcomeView from '@/components/views/InvitationWelcomeView'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard, Users, UserPlus,
  BarChart3, Calendar, LogOut, Menu, X, HelpCircle,
  Building2, FileDown
} from 'lucide-react'

// Restore auth from localStorage
// IMPORTANT: This hook MUST NOT run when there is an invitation token in the URL.
// The invitation flow (useInvitationCheck) will handle auth via auto-login.
// Running both causes a race condition where stale auth is restored before
// the invitation can clean it up, leading to 401s → page reload → login screen.
function useAuthRestore() {
  const setAuth = useAppStore((s) => s.setAuth)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const user = useAppStore((s) => s.user)
  const currentView = useAppStore((s) => s.currentView)
  const hasRestored = React.useRef(false)

  useEffect(() => {
    if (hasRestored.current) return
    if (user) return // Already authenticated, don't override
    // CRITICAL FIX: If there is an invitation token in the URL, do NOT restore
    // stale auth from localStorage. The invitation flow will handle everything.
    // This prevents the race condition where useAuthRestore restores a stale
    // session before useInvitationCheck can clear it and do auto-login.
    const params = new URLSearchParams(window.location.search)
    if (params.get('token')) return

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
// CRITICAL FIX: When an invitation token is detected, clear any stale auth
// from localStorage before proceeding. This ensures the invitation flow
// starts completely clean — no leftover tokens from previous sessions that
// could cause 401s or wrong user context.
function useInvitationCheck() {
  const setInvitationToken = useAppStore((s) => s.setInvitationToken)
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const clearAuth = useAppStore((s) => s.clearAuth)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      // Clear any stale auth before starting the invitation flow.
      // This prevents stale tokens from interfering with auto-login.
      localStorage.removeItem('evaluhr_token')
      localStorage.removeItem('evaluhr_user')
      clearAuth()

      // Set a session flag so api.ts handleUnauthorized knows not to
      // reload the page if a stale 401 happens during the invitation flow.
      sessionStorage.setItem('evaluhr_invitation_active', 'true')

      setInvitationToken(token)
      // Always show the invitation welcome page first.
      // The welcome page will handle auto-login and consent routing.
      setCurrentView('invitation-welcome')
      // Clean URL — keep token in store only
      window.history.replaceState({}, '', '/')
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

      {/* Legal Documents */}
      {isRH && (
        <div className="px-2 py-1">
          <a
            href="/api/download?doc=aviso-privacidad"
            download
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            {!collapsed && <span>Aviso de Privacidad</span>}
          </a>
        </div>
      )}

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
    case 'questions':
      return <QuestionsManagementView />
    case 'interviews':
      return <InterviewsView />
    case 'companies':
      return <CompanyManagementView />
    default:
      return <DashboardView />
  }
}

export default function Home() {
  const user = useAppStore((s) => s.user)
  const currentView = useAppStore((s) => s.currentView)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  // Track client mount to avoid flashing LoginView during SSR/hydration.
  // Before mount, we render a neutral loading state (matches SSR output,
  // so no hydration mismatch). After mount, the URL check + store state
  // correctly determine which view to show. This prevents invitation users
  // from seeing LoginView for 1-2 seconds before useInvitationCheck's
  // effect can run and switch to invitation-welcome.
  const [mounted, setMounted] = React.useState(false)

  useAuthRestore()
  useInvitationCheck()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Before client mount: render a neutral loading spinner. This matches
  // the SSR output (server also renders this), preventing hydration
  // mismatch. Once mounted, useEffect runs and useInvitationCheck sets
  // the correct view, triggering a re-render with the right content.
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // After mount: check for invitation token in URL synchronously.
  // This catches the case where useInvitationCheck hasn't run yet but
  // the URL has a token (e.g., user just landed on the invitation link).
  const hasInvitationToken =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('token')

  // Invitation welcome page - no auth required (shows company/position info)
  if (hasInvitationToken || currentView === 'invitation-welcome') {
    return <InvitationWelcomeView />
  }

  // Consent view - renders standalone for candidates coming from invitation flow
  // (user is already in store via auto-login, just needs to accept consent)
  if (currentView === 'consent') {
    return <ConsentView />
  }

  // Not logged in — show standard login
  if (!user) {
    return <LoginView />
  }

  // Candidate view - simpler layout (auto-logged or logged in)
  if (user.role === 'CANDIDATO') {
    // If candidate hasn't given consent, show consent first
    if (!user.consentGiven && currentView !== 'consent') {
      return <ConsentView />
    }

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
