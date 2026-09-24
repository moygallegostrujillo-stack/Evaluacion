import type { NextResponse } from 'next/server'

/**
 * Política de cookie de sesión (evaluhr_token).
 *
 * PROBLEMA RESUELTO: la app se consume embebida en el panel de vista previa
 * (iframe de origen distinto). Con `sameSite: 'lax'`, el navegador DESCARTA la
 * cookie en contexto de terceros: el login entra (user en localStorage) pero
 * la cookie nunca se guarda → el primer apiFetch responde 401 → recarga →
 * vuelve al login ("no retiene la sesión").
 *
 * SOLUCIÓN (CHIPS): `SameSite=None; Secure; Partitioned`.
 * - None: permite enviar la cookie en el iframe embebido (contexto de terceros).
 * - Secure: obligatorio para None (el preview y producción sirven HTTPS;
 *   en http://localhost los navegadores tratan localhost como contexto seguro
 *   y aceptan cookies Secure).
 * - Partitioned: Chrome almacena la cookie por-partición (per-iframe-site),
 *   permitida incluso con bloqueo de cookies de terceros; los demás navegadores
 *   la ignoran sin romper el comportamiento.
 *
 * Nota CSRF: None amplía el envío cross-site; el token sigue siendo httpOnly
 * (ilegible por JS), las APIs exigen JSON y el proxy valida el JWT en cada
 * llamada. Trade-off estándar para apps SaaS embebidas.
 */

export const SESSION_COOKIE_NAME = 'evaluhr_token'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8 // 8 horas (alineado con exp del JWT)

export function setSessionCookie(
  response: NextResponse,
  token: string,
  options: { maxAge?: number } = {}
): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    partitioned: true,
    maxAge: options.maxAge ?? SESSION_MAX_AGE_SECONDS,
    path: '/',
  })
}

/** Borra la cookie de sesión con los MISMOS atributos (requerido en iframes). */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    partitioned: true,
    maxAge: 0,
    path: '/',
  })
}
