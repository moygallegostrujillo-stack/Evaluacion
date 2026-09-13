# EVALUHR — LEGAL MASTER PACKAGE · 16 · SECURITY (PASO 23)

## 1. Controles existentes (verificados en repo)

| Control | Evidencia | Observación legal |
|---|---|---|
| Autenticación | JWT HS256 (`jose`), expiración 8h, fail-closed si `JWT_SECRET` falta/débil (`src/lib/auth.ts`); bcrypt 12 con migración legacy | Sólido por diseño |
| Sesión | Cookie `evaluhr_token` httpOnly, secure en prod, sameSite lax, 8h; fallback localStorage eliminado | Correcto |
| Autorización | Middleware con `PUBLIC_ROUTES` acotadas; roles SUPER_ADMIN/RH/GERENTE/CANDIDATO; CANDIDATO forzado a sus propios resultados | Correcto |
| Multi-tenant | `companyId` en 13+ modelos; RLS app-layer (Prisma extension, 16 modelos tenant-scoped, `RLSViolationError`) | Correcto |
| RLS DB-layer (Postgres) | `rls-policies.sql`: 14 tablas ENABLE+FORCE, 56 policies, fail-closed — **STATUS: NOT EXECUTED. PREPARATION ONLY** | **Declarar como no activado** (INFORME_FASE_3.5-G/H: validación live bloqueada por credenciales) |
| Auditoría | AuditLog (11 acciones, IP, UA) en consent/arco/invite/results/impersonation | Correcto |
| Rate limiting | LOGIN/AUTO_LOGIN/PUBLIC 30/h; ARCO 5/día | Correcto |
| Sanitización | DOMPurify para aviso editable | Correcto |
| Cifrado | HTTPS por plataforma (Vercel); **sin afirmación de cifrado en reposo** (depende del proveedor BD) | No afirmar más de lo existente |
| Backups | Solo snapshot local dev (evidence-g, "LOCAL DEV SQLITE ONLY"); **sin plan real** | El PDF del aviso afirma respaldos — **alinear o implementar** |
| Incidentes | Sin protocolo implementado | 19 propone protocolo |
| Headers de seguridad | **AUSENTES** (CSP/HSTS no configurados en next.config.ts/middleware) | Gap técnico-legal |

## 2. Declaraciones prohibidas (sin certificaciones)

❌ "Somos ISO 27001 / SOC2 / PCI" — no existen. ❌ "Certificados por autoridad alguna". ✔ Permitido: "controles de seguridad de diseño documentados, sujetos a auditoría".

## 3. Huecos a resolver (para dictamen y plan post-dictamen)

1. Activación real de RLS en Postgres (hoy preparación no ejecutada).
2. Cifrado en reposo del proveedor (confirmar en contratos de subencargo).
3. Backups reales + plan de recuperación (o corregir aviso).
4. Headers de seguridad (CSP/HSTS) — recomendación técnica.
5. Plazo/notificación de incidentes — 19.
6. Drift de esquema dev/prod (7 modelos Knowledge ausentes en schema.prod) — riesgo de pérdida de controles en despliegue.

## 4. Incidentes y brechas — ver 19 (protocolo propuesto; sin plazos jurídicos inventados).
