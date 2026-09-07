# FASE 3.5-H — PARTE 23: CLASIFICACIÓN GLOBAL DE PATRONES

Resultados de la búsqueda posterior a las correcciones (grep sobre src/ + prisma/*.sql).

## 1. app.is_super_admin — 0 referencias ejecutables
Solo comentarios de diseño y la query de verificación NEGATIVA en rls-policies.sql.

## 2. BYPASSRLS en src/ — 0
Exclusivo de artefactos SQL (create-evalhr-sa-role.sql: evalhr_sa).

## 3. token === resourceId — 0 usos funcionales
Única ocurrencia: comentario de documentación en public-token.ts (H1 cerrado).

## 4. new PrismaClient en src/ — 2 legítimos
- src/lib/db.ts (conexión tenant compartida, DATABASE_URL)
- src/lib/admin-db.ts (conexión SA aislada, ADMIN_DATABASE_URL, fail-closed, no exportada)

## 5. Importadores de @/lib/admin-db — exactamente los 7 autorizados
dashboard, results, candidates (metrics) + users, interviews, vacancies (directories) + positions (catalog).
Guard de ESLint actualizado: whitelist = esas 7; el resto del repo sigue restringido.

## 6. $executeRawUnsafe / $queryRawUnsafe — 2 archivos, SAFE (auditoría F-1)
- consent/route.ts: parámetros $1..$5, valores runtime, opción whitelist-validada.
- migrate/route.ts: DDL de literales fijos; identificadores de arrays hardcoded; sin input HTTP.

## 7. getUnscopedClient() — clasificación por sitio (51 referencias / 23 archivos)

| Archivo | Uso | Clasificación |
|---|---|---|
| auth/route.ts | login por email, auto-login, rehash | INFRASTRUCTURE (auth) |
| public/apply, public/invitation, public/video | flujos públicos; contexto derivado de datos verificados del servidor (slug/token/DB), nunca de autoridad del cliente | INFRASTRUCTURE (public token flows) |
| consent/route.ts | safeFindUserById + snapshots + noticeHash | INFRASTRUCTURE (evidencia) |
| migrate/route.ts | DDL SUPER_ADMIN-only, literales fijos | INFRASTRUCTURE (migrations) |
| seed/route.ts, cleanup/route.ts, rls-audit/route.ts, health/route.ts | infraestructura role-gated/diagnósticos | INFRASTRUCTURE |
| companies/route.ts | Company = tenant ROOT (sin companyId); SA global auditado (GLOBAL_BY_DESIGN); no-SA solo su empresa | GLOBAL_BY_DESIGN |
| positions/route.ts:212 | PATCH generate-templates: lookup por id + check de propiedad + audit | TENANT (derive-from-DB + ownership check) |
| users/route.ts (4) | POST/PATCH/DELETE SA-only con checks cross-tenant + AUDIT (3.5-H); lookup de unicidad de email en POST | SA_IMPERSONATION/SA-only mutations (auditadas) |
| invite/route.ts (4) | GET (scoping explícito por companyId resuelto), POST lookup de posición CON tenant check (3.5-H), DELETE (role-gated + scoped + audit, 3.5-H) | TENANT/SA_IMPERSONATION |
| candidates/route.ts (2) | lookup por email + bulk-delete SA auditado (nota: audit de bulk delete era M-3/F-2, fuera de alcance HIGH; documentado) | TENANT/SA_IMPERSONATION |
| questions/route.ts (4) | catálogos globales de preguntas del sistema (companyId NULL = global por diseño) + writes con check de propiedad | GLOBAL_BY_DESIGN (system catalog) |
| evaluations/route.ts (4) | catálogo de posiciones para candidato (ACTIVE, datos no-PII), derivaciones de sesión verificada por DB | TENANT (derive-from-DB) |
| arco/route.ts (4) | ARCO: lookup de usuario/empresa con checks de propiedad RH | TENANT (derive-from-DB) |
| vacancies/route.ts, vacancies/[id]/route.ts, dashboard/route.ts, interviews GET | limpios tras 3.5-H (0 usos en SA global READ) | — |

Regla aplicada (docstring de getUnscopedClient, rls.ts): SAFE para auth, flujos públicos
que derivan contexto de datos, infraestructura role-gated, y helpers tenant que derivan
scope de filas verificadas por DB. PROHIBIDO para lecturas globales SA (→ admin-db, 3.5-H)
y para operaciones tenant por autoridad del cliente.

## 8. companyId / targetCompanyId en handlers (resumen F-3 + 3.5-H)
- No-SUPER_ADMIN: parámetros de empresa SIEMPRE ignorados; scope = JWT → verificado por
  h-tests H6-6 (users?companyId=B ignora el parámetro) y H6-7 (SA scoped a B).
- SUPER_ADMIN sin target: aggregate vía admin-db (auditado) o GLOBAL_BY_DESIGN (companies).
- SUPER_ADMIN con target: impersonación auditada (resolveTargetCompanyId o audit manual).
