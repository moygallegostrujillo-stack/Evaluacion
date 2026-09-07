# FASE 3.5-H — PARTE 17: AuditLog SIN RLS — barrera documentada

`AuditLog` permanece fuera de RLS (es evidencia transversal: impersonation, aggregate,
unauthorized attempts, retention). Documentación de la barrera equivalente:

## Quién escribe
- Solo la aplicación, vía `logAuditEvent`/`logUnauthorizedAccess` (`src/lib/audit.ts`)
  sobre la conexión tenant compartida (evalhr_app cuando DB-RLS se active).
- NUNCA el cliente: no existe endpoint de escritura/edición/borrado de AuditLog.
- `admin-db.ts` no escribe AuditLog con la conexión evalhr_sa — los eventos AGGREGATE
  se escriben por la conexión compartida ANTES de leer (audit-before-read).

## Quién lee
- `SUPER_ADMIN` (rutas de auditoría existentes). `evalhr_sa` no necesita accederla.

## Anti-manipulación (nuevo en 3.5-H)
- **`prisma/create-rls-role.sql` Step 6b**: `REVOKE UPDATE, DELETE ON TABLE "AuditLog"
  FROM evalhr_app` → la conexión runtime queda APPEND-ONLY sobre la evidencia
  (INSERT+SELECT). Una conexión tenant comprometida no puede reescribir ni borrar
  historial. (Artefacto NO ejecutado en 3.5-H; aplica con la activación de roles.)
- Capa app: ningún handler expone UPDATE/DELETE sobre AuditLog (verificado F-1/F-3).

## Retención e integridad
- Sin borrado por la app; la purga quedaría asociada a un proceso de retención
  posterior con `action='RETENTION_PURGE'` (actualmente sin suite — no se inventa).
- Integridad por estructura: `details` es JSON sin secretos (regla en audit.ts),
  snapshots de consentimiento viven en `ConsentLog` (tabla aparte, también sin RLS,
  con inmutabilidad por diseño — sin UPDATE path).

## Clasificación PARTE 6/7/8
| Tabla/operación | Clase |
|---|---|
| AuditLog (escrituras app) | INFRASTRUCTURE (append-only) |
| AuditLog (lecturas) | SA-only, vía rutas de auditoría existentes |
