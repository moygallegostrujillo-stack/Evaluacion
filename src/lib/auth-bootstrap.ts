/**
 * AUTH BOOTSTRAP (Phase 3.5-D.3, Partes 1–3)
 *
 * PROBLEM
 * =======
 * Login/auto-login must resolve identity BEFORE any tenant context exists.
 * Under PostgreSQL RLS (evalhr_app + FORCE RLS), the shared connection
 * cannot see tenant rows without app.current_company_id — so a plain
 * `db.user.findFirst({ where: { email } })` would return ZERO rows for
 * every tenant user once RLS is active.
 *
 * SOLUTION (designed in prisma/auth-bootstrap-functions.sql — PREPARED,
 * NOT EXECUTED in this phase):
 *
 *   bootstrap antes de conocer tenant  →  limited SECURITY DEFINER function
 *     - evalhr_auth_find_user(p_email)
 *     - evalhr_auth_find_invitation(p_token)
 *     - (public lookups live in public-lookup.ts)
 *
 *   tenant conocido                    →  TenantContext
 *                                       →  withTenantTransaction()
 *
 *   - NO BYPASSRLS for auth. The functions are SECURITY DEFINER owned by a
 *     NOLOGIN role (evalhr_secdef) whose only privilege is SELECT over the
 *     exact tables/rows the functions need (see policies in
 *     rls-policies.sql: `TO evalhr_secdef`).
 *   - Functions return MINIMAL columns (no unnecessary PII; the password
 *     hash is returned server-side only because login must verify it).
 *   - Functions are read-only (cannot modify data), no dynamic SQL.
 *
 * DUAL PATH (development vs PostgreSQL)
 * =====================================
 * - PostgreSQL (staging/production): calls the SECURITY DEFINER functions
 *   via parameterized $queryRaw.
 * - SQLite (local dev): RLS does not exist; the pre-tenant read falls back
 *   to the shared client with an explicit AUTH_BOOTSTRAP marker. This is
 *   the documented exception to "no unscoped reads" — it is dev-only and
 *   pre-tenant by definition.
 */

import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

// ============================================
// DATASOURCE DETECTION
// ============================================

export function isPostgresDatasource(): boolean {
  const url = process.env.DATABASE_URL || ''
  return !url.startsWith('file:') && !url.startsWith('sqlite:')
}

// ============================================
// ROW TYPES (minimal columns only)
// ============================================

export interface AuthUserRow {
  id: string
  email: string
  name: string
  role: string
  /** bcrypt/legacy hash — server-side only, never returned to the client. */
  password: string
  phone: string | null
  companyId: string | null
  active: boolean
  consentGiven: boolean | null
  consentVersion: string | null
  companyName: string | null
  companySector: string | null
}

export interface AuthInvitationRow {
  id: string
  companyId: string
  positionId: string | null
  status: string
  expiresAt: Date
  candidateName: string | null
  phone: string | null
  email: string | null
  // Public-facing context rendered to the token holder (the candidate):
  companyName: string | null
  companySector: string | null
  positionTitle: string | null
  positionDescription: string | null
  positionCategory: string | null
  positionSector: string | null
}

// ============================================
// PRE-TENANT READS
// ============================================

/**
 * Resolve a user by email for LOGIN — before any tenant context exists.
 *
 * PostgreSQL: evalhr_auth_find_user(p_email) — SECURITY DEFINER, minimal
 * columns, read-only. SQLite dev: AUTH_BOOTSTRAP read on the shared client
 * (RLS does not exist in dev).
 */
export async function findUserForAuthByEmail(email: string): Promise<AuthUserRow | null> {
  if (isPostgresDatasource()) {
    const rows = await db.$queryRaw<AuthUserRow[]>(
      Prisma.sql`SELECT * FROM evalhr_auth_find_user(${email})`
    )
    return rows[0] ?? null
  }

  // ── DEV ONLY (SQLite): pre-tenant AUTH_BOOTSTRAP read ──
  const user = await db.user.findFirst({
    where: { email },
    include: { company: { select: { name: true, sector: true } } },
  })
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    password: user.password,
    phone: user.phone,
    companyId: user.companyId,
    active: user.active,
    consentGiven: user.consentGiven,
    consentVersion: user.consentVersion,
    companyName: user.company?.name ?? null,
    companySector: user.company?.sector ?? null,
  }
}

/**
 * Resolve an invitation by token for AUTO-LOGIN — before any tenant
 * context exists. PostgreSQL: evalhr_auth_find_invitation(p_token).
 * SQLite dev: AUTH_BOOTSTRAP read on the shared client.
 */
export async function findInvitationForAuth(token: string): Promise<AuthInvitationRow | null> {
  if (isPostgresDatasource()) {
    const rows = await db.$queryRaw<AuthInvitationRow[]>(
      Prisma.sql`SELECT * FROM evalhr_auth_find_invitation(${token})`
    )
    const row = rows[0]
    if (!row) return null
    return { ...row, expiresAt: new Date(row.expiresAt) }
  }

  // ── DEV ONLY (SQLite): pre-tenant AUTH_BOOTSTRAP read ──
  const invitation = await db.candidateInvitation.findUnique({
    where: { token },
    include: {
      company: { select: { name: true, sector: true } },
      position: { select: { title: true, description: true, category: true, sector: true } },
    },
  })
  if (!invitation) return null
  return {
    id: invitation.id,
    companyId: invitation.companyId,
    positionId: invitation.positionId,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    candidateName: invitation.candidateName,
    phone: invitation.phone,
    email: invitation.email,
    companyName: invitation.company?.name ?? null,
    companySector: invitation.company?.sector ?? null,
    positionTitle: invitation.position?.title ?? null,
    positionDescription: invitation.position?.description ?? null,
    positionCategory: invitation.position?.category ?? null,
    positionSector: invitation.position?.sector ?? null,
  }
}

// ============================================
// POST-IDENTITY WRITES (Parte 3)
// ============================================

/**
 * Re-hash a password AFTER identity is verified.
 *
 * - User belongs to a tenant (companyId set) → the CALLER must route this
 *   through withTenantTransaction(companyId). This helper is NOT used then.
 * - User has NO companyId (SUPER_ADMIN/global user) → the row is invisible
 *   to tenant RLS policies by definition (companyId IS NULL is only
 *   readable/writable as a global row — see rls_user_* policies). This
 *   minimal, id-only password update is the documented AUTH_INFRA
 *   exception. It updates exactly one column of exactly one row.
 */
export async function updateUserPasswordAuthInfra(userId: string, passwordHash: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { password: passwordHash },
    select: { id: true },
  })
}
