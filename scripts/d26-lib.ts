// @ts-nocheck — D.2.6 test tooling (Bun-only APIs, not part of the Next.js build)
/**
 * FASE 3.5-D.2.6 — shared helpers: JWT minting (same secret resolution as
 * src/lib/auth.ts + middleware.ts) and API fetch against the dev server.
 */
import { SignJWT } from 'jose'

function resolveJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  const isProd = process.env.NODE_ENV === 'production'
  const DEV_FALLBACK = 'fallback-dev-secret-change-in-production'
  if (!secret) {
    if (isProd) throw new Error('JWT_SECRET missing in production')
    return new TextEncoder().encode(DEV_FALLBACK)
  }
  return new TextEncoder().encode(secret)
}

export interface TokenUser {
  sub: string
  email: string
  name: string
  role: string
  companyId?: string
  companyName?: string
}

export async function mintToken(u: TokenUser): Promise<string> {
  return new SignJWT({
    sub: u.sub,
    email: u.email,
    name: u.name,
    role: u.role,
    ...(u.companyId ? { companyId: u.companyId } : {}),
    ...(u.companyName ? { companyName: u.companyName } : {}),
  } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .setIssuer('evaluhr')
    .setSubject(u.sub)
    .sign(resolveJwtSecret())
}

const BASE = 'http://localhost:3000'

export async function apiGet(
  token: string,
  path: string
): Promise<{ status: number; body: unknown; text: string }> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const text = await res.text()
  let body: unknown = text
  try { body = JSON.parse(text) } catch { /* keep raw */ }
  return { status: res.status, body, text }
}

export function j(v: unknown): string {
  return typeof v === 'string' ? v : JSON.stringify(v)
}
