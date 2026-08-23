import { create } from 'zustand'

export type UserRole = 'SUPER_ADMIN' | 'RH' | 'GERENTE' | 'CANDIDATO'
export type ViewType = 
  | 'login' 
  | 'consent'
  | 'dashboard' 
  | 'candidates' 
  | 'candidate-detail'
  | 'evaluations' 
  | 'positions' 
  | 'reports' 
  | 'compare'
  | 'invite'
  | 'take-evaluation'
  | 'evaluation-complete'
  | 'interviews'
  | 'questions'
  | 'companies'
  | 'settings'
  | 'invitation-welcome'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  companyId?: string
  companyName?: string
  companySector?: string
  consentGiven: boolean
  consentOption?: string // FULL, KNOWLEDGE_ONLY
  anonymousStats?: boolean // Option C
  consentConfirmed?: boolean // Confirmed reading all options + ARCO
  consentVersion?: string // Privacy notice version at time of consent
}

export interface CandidateResult {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail?: string
  candidatePhone?: string
  positionId: string
  positionTitle: string
  overallScore: number
  recommendation: string
  summary?: string
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  stressLevel: number
  empathy: number
  adaptability: number
  leadership: number
  teamwork: number
  knowledgeScore?: number
  integrityScore?: number
  createdAt: string
}

export interface Position {
  id: string
  title: string
  sector: string
  category: string
  hasKnowledgeTest: boolean
  companyId: string
}

export interface EvaluationQuestion {
  id: string
  text: string
  type: 'LIKERT' | 'MULTIPLE_CHOICE' | 'YES_NO'
  options?: string[]
  category: string
  order: number
  reverseScored: boolean
}

export interface EvaluationTemplate {
  id: string
  name: string
  type: string
  order: number
  questions: EvaluationQuestion[]
}

export interface InvitationData {
  valid: boolean
  status: string
  invitationId?: string
  companyName?: string
  companySector?: string
  positionTitle?: string
  positionDescription?: string | null
  positionCategory?: string
  positionSector?: string
  candidateName?: string | null
  email?: string | null
  phone?: string | null
  channel?: string
  expiresAt?: string
  error?: string
}

interface AppState {
  // Auth
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void

  // Navigation
  currentView: ViewType
  setCurrentView: (view: ViewType) => void

  // Selected items
  selectedCandidateId: string | null
  setSelectedCandidateId: (id: string | null) => void
  selectedPositionId: string | null
  setSelectedPositionId: (id: string | null) => void
  selectedResultId: string | null
  setSelectedResultId: (id: string | null) => void

  // Evaluation state
  evaluationSessionId: string | null
  currentStep: number
  currentQuestionIndex: number
  answers: Record<string, number | string>
  setEvaluationState: (sessionId: string, step: number, questionIndex: number) => void
  setAnswer: (questionId: string, value: number | string) => void
  resetEvaluation: () => void

  // Comparison
  compareIds: string[]
  setCompareIds: (ids: string[]) => void

  // Invitation token
  invitationToken: string | null
  setInvitationToken: (token: string | null) => void

  // Invitation details (from public API)
  invitationData: InvitationData | null
  setInvitationData: (data: InvitationData | null) => void

  // SUPER_ADMIN selected company context
  selectedCompanyId: string | null
  setSelectedCompanyId: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('evaluhr_token', token)
      localStorage.setItem('evaluhr_user', JSON.stringify(user))
    }
    set({ user, token })
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evaluhr_token')
      localStorage.removeItem('evaluhr_user')
      // Also clear the httpOnly auth cookie by making a request to the logout endpoint
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      }).catch(() => {})
    }
    set({ user: null, token: null, currentView: 'login' })
  },

  // Navigation
  currentView: 'login',
  setCurrentView: (currentView) => set({ currentView }),

  // Selected items
  selectedCandidateId: null,
  setSelectedCandidateId: (selectedCandidateId) => set({ selectedCandidateId }),
  selectedPositionId: null,
  setSelectedPositionId: (selectedPositionId) => set({ selectedPositionId }),
  selectedResultId: null,
  setSelectedResultId: (selectedResultId) => set({ selectedResultId }),

  // Evaluation state
  evaluationSessionId: null,
  currentStep: 1,
  currentQuestionIndex: 0,
  answers: {},
  setEvaluationState: (evaluationSessionId, currentStep, currentQuestionIndex) =>
    set({ evaluationSessionId, currentStep, currentQuestionIndex }),
  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
  resetEvaluation: () =>
    set({ evaluationSessionId: null, currentStep: 1, currentQuestionIndex: 0, answers: {} }),

  // Comparison
  compareIds: [],
  setCompareIds: (compareIds) => set({ compareIds }),

  // Invitation
  invitationToken: null,
  setInvitationToken: (invitationToken) => set({ invitationToken }),
  invitationData: null,
  setInvitationData: (invitationData) => set({ invitationData }),

  // SUPER_ADMIN selected company context
  selectedCompanyId: null,
  setSelectedCompanyId: (selectedCompanyId) => set({ selectedCompanyId }),
}))
