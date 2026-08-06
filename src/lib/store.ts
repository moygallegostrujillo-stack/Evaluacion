import { create } from 'zustand'

export type UserRole = 'SUPER_ADMIN' | 'RH' | 'GERENTE' | 'CANDIDATO'
export type ViewType = 
  | 'login' 
  | 'register' 
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
  | 'vacancies'
  | 'public-evaluation'
  | 'public-evaluation-complete'
  | 'settings'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  companyName?: string
  companySector?: string
  consentGiven: boolean
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

  // Public vacancy application state
  vacancySlug: string | null
  setVacancySlug: (slug: string | null) => void
  vacancyApplicationId: string | null
  setVacancyApplicationId: (id: string | null) => void
  vacancyCurrentStep: number
  setVacancyCurrentStep: (step: number) => void
  vacancyAnswers: Record<string, number | string>
  setVacancyAnswer: (questionId: string, value: number | string) => void
  resetVacancyApplication: () => void
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

  // Public vacancy application
  vacancySlug: null,
  setVacancySlug: (vacancySlug) => set({ vacancySlug }),
  vacancyApplicationId: null,
  setVacancyApplicationId: (vacancyApplicationId) => set({ vacancyApplicationId }),
  vacancyCurrentStep: 0,
  setVacancyCurrentStep: (vacancyCurrentStep) => set({ vacancyCurrentStep }),
  vacancyAnswers: {},
  setVacancyAnswer: (questionId, value) =>
    set((state) => ({ vacancyAnswers: { ...state.vacancyAnswers, [questionId]: value } })),
  resetVacancyApplication: () =>
    set({ vacancySlug: null, vacancyApplicationId: null, vacancyCurrentStep: 0, vacancyAnswers: {} }),
}))
