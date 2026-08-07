/**
 * Authenticated fetch wrapper for API requests.
 * 
 * Automatically includes the JWT token via:
 * 1. Authorization: Bearer <token> header (from localStorage)
 * 2. Cookie: evaluhr_token (httpOnly, set by server on login)
 * 
 * The middleware checks both sources.
 * Handles 401 (expired/invalid token) by clearing auth and redirecting to login.
 */

interface ApiFetchOptions extends RequestInit {
  /** Skip auth header (for public endpoints) */
  skipAuth?: boolean
}

/**
 * Get the stored JWT token
 */
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('evaluhr_token')
}

/**
 * Handle 401 response - clear auth and redirect to login
 */
function handleUnauthorized() {
  if (typeof window === 'undefined') return
  
  // Clear stored auth data
  localStorage.removeItem('evaluhr_token')
  localStorage.removeItem('evaluhr_user')
  
  // Force page reload to reset app state (goes to login)
  // Only if we're not already on a public evaluation page
  if (!window.location.pathname.startsWith('/evaluar/')) {
    window.location.reload()
  }
}

/**
 * Authenticated fetch wrapper
 * Drop-in replacement for fetch() that adds JWT auth
 */
export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { skipAuth, headers: customHeaders, ...restOptions } = options

  const headers = new Headers(customHeaders)

  // Add Authorization header if not skipped and token exists
  if (!skipAuth) {
    const token = getStoredToken()
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

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
