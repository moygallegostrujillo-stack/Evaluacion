/**
 * Rate Limiting utility (Phase 3.5 — B9)
 *
 * Simple in-memory rate limiter using a sliding window.
 * For production at scale, consider Redis-based rate limiting.
 *
 * Usage in API routes:
 *   import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
 *
 *   const result = await rateLimit(req, RATE_LIMITS.LOGIN)
 *   if (!result.allowed) {
 *     return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: result.headers })
 *   }
 *
 * Limits are identified by IP address (and optionally userId).
 */

import type { NextRequest } from 'next/server'

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in milliseconds */
  windowMs: number
  /** Optional: also track by userId (in addition to IP) */
  trackByUser?: boolean
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

/** Predefined rate limits for sensitive endpoints */
export const RATE_LIMITS = {
  /** Login: 10 attempts per 15 minutes per IP (brute-force protection) */
  LOGIN: { limit: 10, windowMs: 15 * 60 * 1000 } as RateLimitConfig,
  /** Auto-login via invitation: 20 per hour per IP */
  AUTO_LOGIN: { limit: 20, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  /** Consent endpoint: 10 per hour per IP */
  CONSENT: { limit: 10, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  /** Evaluation answer: 200 per 5 minutes per user (legitimate use is <50) */
  EVALUATION_ANSWER: { limit: 200, windowMs: 5 * 60 * 1000, trackByUser: true } as RateLimitConfig,
  /** ARCO requests: 5 per day per IP (prevent abuse) */
  ARCO: { limit: 5, windowMs: 24 * 60 * 60 * 1000 } as RateLimitConfig,
  /** Public invitation lookup: 30 per hour per IP */
  PUBLIC_INVITATION: { limit: 30, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  /** Seed endpoint: 3 per hour per IP */
  SEED: { limit: 3, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  /** Generic API: 100 per minute per IP */
  API: { limit: 100, windowMs: 60 * 1000 } as RateLimitConfig,
} as const

// In-memory store: Map<key, RateLimitEntry>
// Note: This resets on server restart. For multi-instance deployments,
// use Redis or a shared store.
const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries periodically (every 5 minutes)
let lastCleanup = Date.now()
function cleanupStore() {
  const now = Date.now()
  if (now - lastCleanup < 5 * 60 * 1000) return
  lastCleanup = now
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

/** Extract client IP from request */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export interface RateLimitResult {
  allowed: boolean
  /** Remaining requests in the current window */
  remaining: number
  /** Timestamp when the limit resets (ms epoch) */
  resetAt: number
  /** Headers to include in the 429 response */
  headers: Record<string, string>
}

/**
 * Check rate limit for a request.
 * Returns { allowed: true } if within limit, or { allowed: false } if exceeded.
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  userId?: string
): Promise<RateLimitResult> {
  cleanupStore()

  const ip = getClientIp(req)
  let key = `ip:${ip}:${config.limit}:${config.windowMs}`
  if (config.trackByUser && userId) {
    key = `user:${userId}:${config.limit}:${config.windowMs}`
  }

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    const resetAt = now + config.windowMs
    store.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt,
      headers: {
        'X-RateLimit-Limit': String(config.limit),
        'X-RateLimit-Remaining': String(config.limit - 1),
        'X-RateLimit-Reset': String(resetAt),
      },
    }
  }

  if (entry.count >= config.limit) {
    // Limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      headers: {
        'X-RateLimit-Limit': String(config.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(entry.resetAt),
        'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
      },
    }
  }

  // Increment count
  entry.count++
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
    headers: {
      'X-RateLimit-Limit': String(config.limit),
      'X-RateLimit-Remaining': String(config.limit - entry.count),
      'X-RateLimit-Reset': String(entry.resetAt),
    },
  }
}

/**
 * Create a 429 Too Many Requests response with standard headers.
 */
export function rateLimitResponse(result: RateLimitResult, message?: string) {
  return new Response(
    JSON.stringify({
      error: message || 'Demasiadas solicitudes. Inténtelo más tarde.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...result.headers,
      },
    }
  )
}
