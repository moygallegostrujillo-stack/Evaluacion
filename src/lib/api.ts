/**
 * Authenticated fetch wrapper for API requests.
 *
 * PHASE 3.5 (B7): JWT token is now primarily sent via httpOnly cookie.
 * The Authorization header fallback (from localStorage) has been REMOVED
 * to prevent XSS-based token theft. The browser automatically sends the
 * httpOnly cookie with `credentials: 'include'`.
 *
 * The middleware reads the cookie (or Authorization header if present).
 * Since we no longer store the token in localStorage, the cookie is the
 * sole auth mechanism for browser requests.
 *
 * Handles 401 (expired/invalid token) by clearing auth and redirecting to login.
 */

interface ApiFetchOptions extends RequestInit {
  /** Skip auth header (for public endpoints) */
  skipAuth?: boolean
}

/**
 * Handle 401 response - clear auth and redirect to login
 * FIX: Do NOT reload if there is an invitation token in the URL or in the
 * sessionStorage. During the invitation flow, the auto-login hasn't completed
 * yet, and a 401 from a stale token should not destroy the entire page.
 * The invitation flow will handle auth via auto-login.
 */
function handleUnauthorized() {
  if (typeof window === 'undefined') return

  // Check if we're in an invitation flow — don't destroy it
  const params = new URLSearchParams(window.location.search)
  const hasInvitationToken = params.get('token')
    || sessionStorage.getItem('evaluhr_invitation_active') === 'true'

  if (hasInvitationToken) {
    // Just clear the stale user object — don't reload the page.
    // The invitation flow's auto-login will set the correct cookie.
    localStorage.removeItem('evaluhr_user')
    return
  }

  // Clear stored user object (token is in httpOnly cookie, cleared by server)
  localStorage.removeItem('evaluhr_user')

  // Force page reload to reset app state (goes to login)
  // Only if we're not already on a public evaluation page
  if (!window.location.pathname.startsWith('/evaluar/')) {
    window.location.reload()
  }
}

/**
 * Authenticated fetch wrapper
 * Drop-in replacement for fetch() that adds JWT auth via httpOnly cookie
 */
export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { skipAuth, headers: customHeaders, ...restOptions } = options

  const headers = new Headers(customHeaders)

  // PHASE 3.5 (B7): No longer reads token from localStorage.
  // Auth is via httpOnly cookie only — sent automatically with credentials: 'include'.

  // Set Content-Type for JSON bodies if not already set
  if (restOptions.body && !headers.has('Content-Type')) {
    // Don't set Content-Type for FormData
    if (!(restOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
    credentials: 'include', // PHASE 3.5 (B7): Send httpOnly cookie
  })

  // Handle 401 - token expired or invalid
  if (response.status === 401) {
    try {
      const data = await response.clone().json()
      if (data.code === 'AUTH_INVALID' || data.code === 'AUTH_MISSING') {
        handleUnauthorized()
      }
    } catch {
      // If we can't parse the response, still handle 401
      handleUnauthorized()
    }
  }

  return response
}

/**
 * Convenience method for JSON API calls
 */
export async function apiGet(url: string): Promise<Response> {
  return apiFetch(url)
}

/**
 * Convenience method for JSON POST
 */
export async function apiPost(
  url: string,
  body: unknown,
  options?: ApiFetchOptions
): Promise<Response> {
  return apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * Convenience method for JSON PUT
 */
export async function apiPut(
  url: string,
  body: unknown,
  options?: ApiFetchOptions
): Promise<Response> {
  return apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * Convenience method for JSON PATCH
 */
export async function apiPatch(
  url: string,
  body: unknown,
  options?: ApiFetchOptions
): Promise<Response> {
  return apiFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * Convenience method for DELETE
 */
export async function apiDelete(url: string): Promise<Response> {
  return apiFetch(url, { method: 'DELETE' })
}
