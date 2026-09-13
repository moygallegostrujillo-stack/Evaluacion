/**
 * PUBLIC LOOKUPS (Phase 3.5-D.3, Partes 5–8)
 *
 * Public (unauthenticated) endpoints must resolve a tenant WITHOUT letting
 * client input decide it, and WITHOUT reading tenant data before the
 * resource is authorized.
 *
 * PostgreSQL: limited SECURITY DEFINER functions (see
 * prisma/auth-bootstrap-functions.sql — PREPARED, NOT EXECUTED):
 *   - evalhr_public_find_active_vacancy(p_slug) → public vacancy fields only
 *   - evalhr_public_application_tenant(p_id)    → companyId ONLY (called
 *     strictly AFTER HMAC token verification in the caller)
 *
 * SQLite dev: equivalent reads on the shared client (dev-only, documented;
 * RLS does not exist in dev).
 *
 * Rule enforced by every caller:
 *   CREATE / bootstrap: slug → vacancy → companyId
 *   RESUME / ANSWER / ADVANCE / VIDEO: token (HMAC) + applicationId
 */

import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { isPostgresDatasource } from '@/lib/auth-bootstrap'

export interface PublicVacancyRow {
  id: string
  companyId: string
  title: string
  description: string | null
  sector: string
  includePsicometrica: boolean
  includePsicologica: boolean
  includeIntegridad: boolean
  maxVideoSeconds: number | null
  companyName: string
  companyPhone: string | null
  knowledgeQuestionCount: number
}

/**
 * Resolve an ACTIVE vacancy by slug — public bootstrap read.
 * Returns ONLY public fields (+ internal ids the server needs to derive
 * the tenant). companyId is for the SERVER; callers must never return it
 * to the client.
 */
export async function findActiveVacancyForPublic(slug: string): Promise<PublicVacancyRow | null> {
  if (isPostgresDatasource()) {
    const rows = await db.$queryRaw<PublicVacancyRow[]>(
      Prisma.sql`SELECT * FROM evalhr_public_find_active_vacancy(${slug})`
    )
    return rows[0] ?? null
  }

  // ── DEV ONLY (SQLite): public bootstrap read ──
  const vacancy = await db.vacancy.findUnique({
    where: { slug },
    include: {
      company: { select: { name: true, phone: true } },
      questions: { where: { type: 'MULTIPLE_CHOICE' }, select: { id: true } },
    },
  })
  if (!vacancy || vacancy.status !== 'ACTIVE') return null
  return {
    id: vacancy.id,
    companyId: vacancy.companyId,
    title: vacancy.title,
    description: vacancy.description,
    sector: vacancy.sector,
    includePsicometrica: vacancy.includePsicometrica,
    includePsicologica: vacancy.includePsicologica,
    includeIntegridad: vacancy.includeIntegridad,
    maxVideoSeconds: vacancy.maxVideoSeconds,
    companyName: vacancy.company.name,
    companyPhone: vacancy.company.phone,
    knowledgeQuestionCount: vacancy.questions.length,
  }
}

/**
 * Resolve ONLY the companyId of a VacancyApplication — the minimal read
 * needed to open a tenant transaction for a token-authorized public
 * operation. Callers MUST verify the HMAC token BEFORE invoking this.
 *
 * PostgreSQL: evalhr_public_application_tenant(p_id) returns companyId only.
 */
export async function resolveApplicationCompanyId(applicationId: string): Promise<string | null> {
  if (isPostgresDatasource()) {
    const rows = await db.$queryRaw<{ companyId: string }[]>(
      Prisma.sql`SELECT "companyId" FROM evalhr_public_application_tenant(${applicationId})`
    )
    return rows[0]?.companyId ?? null
  }

  // ── DEV ONLY (SQLite): minimal bootstrap read (companyId only) ──
  const app = await db.vacancyApplication.findUnique({
    where: { id: applicationId },
    select: { companyId: true },
  })
  return app?.companyId ?? null
}
