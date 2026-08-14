/**
 * Row-Level Security (RLS) System for EvaluHR
 *
 * This module implements application-level RLS using Prisma Client Extensions.
 * It guarantees that every query on tenant-scoped models is automatically
 * filtered by companyId, preventing cross-tenant data access even if a
 * developer forgets to add a manual where clause.
 *
 * Architecture:
 *   Layer 1 (App RLS):   Prisma Client Extension — auto-injects companyId filters
 *   Layer 2 (DB RLS):    PostgreSQL RLS policies — defense-in-depth at DB level
 *
 * Tenant-scoped models (have direct companyId field):
 *   - User             (companyId optional — SUPER_ADMIN may be null)
 *   - Position          (companyId required)
 *   - Question          (companyId optional — null = system/global question)
 *   - CandidateInvitation (companyId required)
 *   - EvaluationSession (companyId required)
 *   - EvaluationResult  (companyId required)
 *   - InterviewSchedule (companyId required)
 *   - Vacancy           (companyId required)
 *   - VacancyApplication (companyId required)
 *
 * Models scoped via parent (no direct companyId):
 *   - EvaluationTemplate  (via Position.companyId)
 *   - EvaluationResponse  (via EvaluationSession.companyId)
 *   - VacancyQuestion     (via Vacancy.companyId)
 *   - VacancyApplicationResponse (via VacancyApplication.companyId)
 *
 * Company is the tenant root — not scoped.
 */

import { Prisma } from '@prisma/client'
import { db } from './db'

// ============================================
// TYPES
// ============================================

export interface TenantContext {
  /** The company ID for this tenant scope */
  companyId: string
  /** Whether this is a SUPER_ADMIN who can bypass RLS */
  isSuperAdmin: boolean
  /** The user ID making the request */
  userId: string
  /** The user role */
  role: string
}

export interface RLSClientResult {
  /** Prisma client with RLS extension applied */
  client: Omit<typeof db, '$extends'>
  /** The tenant context in effect */
  context: TenantContext
}

// ============================================
// TENANT-SCOPED MODEL REGISTRY
// ============================================

/**
 * Models that have a DIRECT `companyId` field and should be auto-filtered.
 * Maps model name → whether companyId is required or optional.
 */
const TENANT_SCOPED_MODELS: Record<string, { required: boolean }> = {
  User:                { required: false }, // companyId is optional
  Position:            { required: true },
  Question:            { required: false }, // companyId is optional (null = global)
  CandidateInvitation: { required: true },
  EvaluationSession:   { required: true },
  EvaluationResult:    { required: true },
  InterviewSchedule:   { required: true },
  Vacancy:             { required: true },
  VacancyApplication:  { required: true },
}

/** Models that are tenant-scoped */
const isTenantModel = (model: string): model is keyof typeof TENANT_SCOPED_MODELS => {
  return model in TENANT_SCOPED_MODELS
}

// ============================================
// RLS EXTENSION FACTORY
// ============================================

/**
 * Creates a Prisma Client Extension that enforces Row-Level Security
 * for the given tenant context.
 *
 * How it works:
 * - findMany/findFirst/count/aggregate/groupBy: auto-injects `companyId` into `where`
 * - findUnique: auto-injects `companyId` into `where` (combined with id lookup)
 * - create: validates that `data.companyId` matches the tenant (if provided)
 * - update/delete: adds `companyId` to `where` clause
 *
 * SUPER_ADMIN bypass: when isSuperAdmin=true, no filters are applied.
 */
export function createRLSExtension(context: TenantContext) {
  const { companyId, isSuperAdmin } = context

  return Prisma.defineExtension({
    name: 'rls',
    query: {
      $allModels: {
        // ── READ OPERATIONS ──

        async findMany({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            }
          }
          return query(args)
        },

        async findFirst({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            }
          }
          return query(args)
        },

        async findUnique({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            // findUnique uses a unique key (e.g. id), we need to convert
            // to findFirst to add companyId filter, then verify
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            const filteredArgs = {
              ...args,
              where: {
                ...existingWhere,
                companyId,
              },
            }
            // Use the underlying findFirst to allow compound where
            const result = await query(filteredArgs as any)
            return result
          }
          return query(args)
        },

        async count({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            }
          }
          return query(args)
        },

        async aggregate({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            }
          }
          return query(args)
        },

        async groupBy({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            }
          }
          return query(args)
        },

        // ── WRITE OPERATIONS ──

        async create({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const data = args.data as Record<string, unknown>
            // Auto-inject companyId if not provided
            if (!data.companyId) {
              args.data = {
                ...data,
                companyId,
              } as any
            } else if (data.companyId !== companyId) {
              // Block attempts to create records in another company
              throw new RLSViolationError(
                `RLS violation: attempted to create ${model} with companyId="${data.companyId}" but tenant context is "${companyId}"`
              )
            }
          }
          return query(args)
        },

        async update({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            // Add companyId to where to prevent cross-tenant updates
            args.where = {
              ...existingWhere,
              companyId,
            } as any
          }
          return query(args)
        },

        async delete({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            // Add companyId to where to prevent cross-tenant deletes
            args.where = {
              ...existingWhere,
              companyId,
            } as any
          }
          return query(args)
        },

        async updateMany({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            } as any
          }
          return query(args)
        },

        async deleteMany({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            } as any
          }
          return query(args)
        },

        async upsert({ args, query, model }) {
          if (!isSuperAdmin && isTenantModel(model as string)) {
            const existingWhere = (args.where ?? {}) as Record<string, unknown>
            args.where = {
              ...existingWhere,
              companyId,
            } as any
            // Ensure create data has correct companyId
            const createData = args.create as Record<string, unknown>
            if (!createData.companyId) {
              args.create = {
                ...createData,
                companyId,
              } as any
            } else if (createData.companyId !== companyId) {
              throw new RLSViolationError(
                `RLS violation: attempted to upsert ${model} with companyId="${createData.companyId}" but tenant context is "${companyId}"`
              )
            }
          }
          return query(args)
        },
      },
    },
  })
}

// ============================================
// RLS ERROR
// ============================================

export class RLSViolationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RLSViolationError'
  }
}

// ============================================
// RLS CLIENT FACTORY
// ============================================

/**
 * Creates a tenant-scoped Prisma client with RLS extension applied.
 *
 * Usage in API routes:
 * ```ts
 * const { client: rlsDb, context } = createRLSClient(auth)
 * // Now ALL queries on rlsDb are automatically scoped to auth.companyId
 * const candidates = await rlsDb.user.findMany({ where: { role: 'CANDIDATO' } })
 * // ↑ Automatically adds companyId filter, no need to specify manually
 * ```
 *
 * @param auth - Auth context from getAuthFromHeaders()
 * @returns RLS-scoped Prisma client and the context in effect
 */
export function createRLSClient(auth: {
  userId: string
  role: string
  companyId?: string
}): RLSClientResult {
  const isSuperAdmin = auth.role === 'SUPER_ADMIN'
  const companyId = auth.companyId || ''

  if (!isSuperAdmin && !companyId) {
    throw new RLSViolationError(
      'RLS violation: non-SUPER_ADMIN user has no companyId — cannot establish tenant context'
    )
  }

  const context: TenantContext = {
    companyId,
    isSuperAdmin,
    userId: auth.userId,
    role: auth.role,
  }

  // For SUPER_ADMIN with no companyId, use unscoped client
  if (isSuperAdmin && !companyId) {
    return {
      client: db as unknown as Omit<typeof db, '$extends'>,
      context,
    }
  }

  const extended = db.$extends(createRLSExtension(context))

  return {
    client: extended as unknown as Omit<typeof db, '$extends'>,
    context,
  }
}

/**
 * Creates an RLS client for SUPER_ADMIN that can optionally scope to a specific company.
 * Used when SUPER_ADMIN needs to operate within a specific tenant context.
 */
export function createSuperAdminRLSClient(targetCompanyId: string): RLSClientResult {
  const context: TenantContext = {
    companyId: targetCompanyId,
    isSuperAdmin: true, // SUPER_ADMIN, but scoped to a specific company
    userId: '',
    role: 'SUPER_ADMIN',
  }

  // Even SUPER_ADMIN gets scoped when targeting a specific company
  const adminContext: TenantContext = {
    companyId: targetCompanyId,
    isSuperAdmin: false, // Force scoping
    userId: '',
    role: 'SUPER_ADMIN',
  }

  const extended = db.$extends(createRLSExtension(adminContext))

  return {
    client: extended as unknown as Omit<typeof db, '$extends'>,
    context,
  }
}

// ============================================
// RLS VERIFICATION HELPERS
// ============================================

/**
 * Verify that a record belongs to the current tenant.
 * Throws RLSViolationError if the record's companyId doesn't match.
 *
 * This is a defensive check for cases where you fetch a record by ID
 * (e.g. findUnique) and need to verify ownership before operating on it.
 */
export function verifyTenantOwnership(
  record: { companyId?: string | null },
  context: TenantContext,
  modelName: string
): void {
  if (context.isSuperAdmin) return // SUPER_ADMIN bypasses

  if (record.companyId !== context.companyId) {
    throw new RLSViolationError(
      `RLS violation: ${modelName} record belongs to company "${record.companyId}" but tenant context is "${context.companyId}"`
    )
  }
}

/**
 * Get the unscoped (raw) Prisma client.
 * Use ONLY in:
 *   - SUPER_ADMIN operations that need cross-tenant access
 *   - Authentication/login flows (no tenant context yet)
 *   - Seed/migration scripts
 *   - Public endpoints (derive companyId from data, not from auth)
 *
 * ⚠️ DO NOT use this for regular API operations — use createRLSClient() instead.
 */
export function getUnscopedClient() {
  return db
}
