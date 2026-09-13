/**
 * RESOURCE-TENANT RESOLUTION — Fase 3.5-F
 *
 * Pre-tenant lookups for flows that must resolve WHICH tenant a resource
 * belongs to BEFORE a tenant context can exist (SUPER_ADMIN impersonation
 * on resources of any company, candidate global position catalog).
 *
 * Under FORCE RLS the shared runtime client (evalhr_app, no context) sees
 * 0 rows — the Fase 3.5-F regression (first full suite run under real RLS)
 * surfaced those silent 404s. On PostgreSQL these wrappers route the
 * resolution through SECURITY DEFINER functions owned by evalhr_secdef
 * (NOLOGIN, NOBYPASSRLS) — the same security model as auth-bootstrap.ts:
 *   - static SQL (no dynamic execution)
 *   - minimal columns (only tenant keys + non-PII metadata)
 *   - EXECUTE granted to evalhr_app only, revoked from PUBLIC
 *   - read-only (pure SELECT)
 *
 * The SUBSEQUENT writes keep flowing through withTenantImpersonation() on
 * the runtime channel — this module never writes.
 *
 * DATASOURCE DUALITY (same as auth-bootstrap.ts): on the SQLite dev
 * datasource there is no RLS and no SECDEF functions, so the shared client
 * reproduces the exact pre-F behavior (documented dev-only path). On
 * PostgreSQL the SECDEF path is MANDATORY.
 */

import { Prisma } from '@prisma/client'
import { db } from './db'
import { isPostgresDatasource } from './auth-bootstrap'

export interface ResourceTenantRef {
  id: string
  /** Position/Session/Interview/Invitation/Vacancy rows always have a tenant (NOT NULL columns). */
  companyId: string
}

export interface PositionTenantRef extends ResourceTenantRef {
  title: string
  category: string
  hasKnowledgeTest: boolean
}

export interface UserTenantRef {
  id: string
  /** User.companyId IS NULL for global SUPER_ADMIN accounts. */
  companyId: string | null
  role: string
  email: string
  name: string
  active: boolean
}

async function pgOne<T>(sql: Prisma.Sql): Promise<T | null> {
  const rows = await db.$queryRaw<T[]>(sql)
  return rows[0] ?? null
}

/** Position → tenant (+ minimal metadata). Used by candidate create-session and SA derived flows. */
export async function findPositionTenant(positionId: string): Promise<PositionTenantRef | null> {
  if (!isPostgresDatasource()) {
    const row = await db.position.findFirst({
      where: { id: positionId },
      select: { id: true, companyId: true, title: true, category: true, hasKnowledgeTest: true },
    })
    return row
  }
  return pgOne<PositionTenantRef>(
    Prisma.sql`SELECT "id", "companyId", "title", "category", "hasKnowledgeTest" FROM evalhr_find_position_tenant(${positionId})`
  )
}

/** User → tenant (+ minimal metadata). Used by SA consent/edit/delete-on-behalf flows. */
export async function findUserTenant(userId: string): Promise<UserTenantRef | null> {
  if (!isPostgresDatasource()) {
    const row = await db.user.findFirst({
      where: { id: userId },
      select: { id: true, companyId: true, role: true, email: true, name: true, active: true },
    })
    return row
  }
  return pgOne<UserTenantRef>(
    Prisma.sql`SELECT "id", "companyId", "role", "email", "name", "active" FROM evalhr_find_user_tenant(${userId})`
  )
}

/** EvaluationSession → tenant. Used by SA derived session operations. */
export async function findSessionTenant(sessionId: string): Promise<ResourceTenantRef | null> {
  if (!isPostgresDatasource()) {
    const row = await db.evaluationSession.findFirst({
      where: { id: sessionId },
      select: { id: true, companyId: true },
    })
    return row
  }
  return pgOne<ResourceTenantRef>(
    Prisma.sql`SELECT "id", "companyId" FROM evalhr_find_session_tenant(${sessionId})`
  )
}

/** InterviewSchedule → tenant. Used by SA derived interview operations. */
export async function findInterviewTenant(interviewId: string): Promise<ResourceTenantRef | null> {
  if (!isPostgresDatasource()) {
    const row = await db.interviewSchedule.findFirst({
      where: { id: interviewId },
      select: { id: true, companyId: true },
    })
    return row
  }
  return pgOne<ResourceTenantRef>(
    Prisma.sql`SELECT "id", "companyId" FROM evalhr_find_interview_tenant(${interviewId})`
  )
}

/** CandidateInvitation → tenant. Used by SA derived invitation operations. */
export async function findInvitationTenant(invitationId: string): Promise<ResourceTenantRef | null> {
  if (!isPostgresDatasource()) {
    const row = await db.candidateInvitation.findFirst({
      where: { id: invitationId },
      select: { id: true, companyId: true },
    })
    return row
  }
  return pgOne<ResourceTenantRef>(
    Prisma.sql`SELECT "id", "companyId" FROM evalhr_find_invitation_tenant(${invitationId})`
  )
}

/** Vacancy → tenant. Used by SA derived vacancy operations. */
export async function findVacancyTenant(vacancyId: string): Promise<ResourceTenantRef | null> {
  if (!isPostgresDatasource()) {
    const row = await db.vacancy.findFirst({
      where: { id: vacancyId },
      select: { id: true, companyId: true },
    })
    return row
  }
  return pgOne<ResourceTenantRef>(
    Prisma.sql`SELECT "id", "companyId" FROM evalhr_find_vacancy_tenant(${vacancyId})`
  )
}

/** Company existence check (pre-tenant validation for company transfers). */
export async function companyExists(companyId: string): Promise<boolean> {
  if (!isPostgresDatasource()) {
    const row = await db.company.findFirst({ where: { id: companyId }, select: { id: true } })
    return Boolean(row)
  }
  const rows = await db.$queryRaw<{ exists: boolean }[]>(
    Prisma.sql`SELECT evalhr_company_exists(${companyId}) AS exists`
  )
  return Boolean(rows[0]?.exists)
}

/**
 * Global catalog of ACTIVE positions (all companies) — business rule:
 * candidates may apply to ANY company's position. Read-only, no candidate
 * PII. Mirrors the previous Prisma shape (position scalars + company +
 * evaluationTemplates with question counts).
 */
export async function listActivePositionsCatalog(): Promise<unknown[]> {
  if (!isPostgresDatasource()) {
    // SQLite dev — same shape via the shared client (no RLS in dev).
    const positions = await db.position.findMany({
      where: { active: true },
      orderBy: [{ sector: 'asc' }, { title: 'asc' }],
      include: {
        company: { select: { id: true, name: true, sector: true } },
        evaluationTemplates: {
          select: { id: true, type: true, _count: { select: { questions: true } } },
          orderBy: { order: 'asc' },
        },
      },
    })
    return positions
  }
  const rows = await db.$queryRaw<{ catalog: unknown }[]>(
    Prisma.sql`SELECT evalhr_list_active_positions_catalog() AS catalog`
  )
  const parsed = rows[0]?.catalog
  if (Array.isArray(parsed)) return parsed
  if (typeof parsed === 'string') {
    try { return JSON.parse(parsed) } catch { return [] }
  }
  return []
}
