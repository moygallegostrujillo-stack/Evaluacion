# FASE 3.5-G — FASE 24: SEGURIDAD DEL GUC (documentación re-emitida)

## Confirmación

`SET LOCAL app.current_company_id = B` cambia el contexto de tenant de la transacción.
Esto **NO es una vulnerabilidad**: es la semántica estándar de PostgreSQL para un GUC
personalizado dentro de una transacción. Está documentado y es INTENCIONAL.

## Semántica verificada en artefactos/código

- `src/lib/db-rls-session.ts` usa exclusivamente `SET LOCAL` (scope de transacción):
  se limpia en COMMIT/ROLLBACK → sin contaminación entre conexiones pooled.
- Las policies (`prisma/rls-policies.sql`) filtran por `evalhr_current_tenant()`,
  que lee el GUC y devuelve `'__DENIED__'` si no está establecido (fail-closed).
- `app.is_super_admin` fue ELIMINADO (D.2.7/D.2.8): 0 referencias ejecutables en src/
  y en prisma/*.sql (verificación negativa incluida en el propio SQL).
- GUC = CONTEXTO, NO = AUTORIZACIÓN. Quien pueda ejecutar SQL con evalhr_app puede
  establecer el contexto que quiera; la autorización real es la combinación de:
  1. No exponer la conexión SQL (solo la app posee DATABASE_URL; no hay endpoint que
     ejecute SQL arbitrario — auditado en F-1: 38 ocurrencias raw, 0 interpolación de input HTTP).
  2. evalhr_app sin privilegios DDL (create-rls-role.sql: NOSUPERUSER/NOBYPASSRLS/
     NOCREATEDB/NOCREATEROLE/NOREPLICATION; solo CONNECT+USAGE+DML+sequences).
  3. RLS ENABLE+FORCE en las 14 tablas tenant.
  4. La aplicación controla el contexto (companyId SIEMPRE derivado del JWT o del
     servidor; nunca confiado a input — verificado ruta por ruta en F-1/F-3).
  5. Sin SQL injection (auditoría F-1: 0 UNSAFE).
- SA AGGREGATE no usa GUC: usa rol dedicado evalhr_sa con BYPASSRLS a nivel de rol,
  conexión aislada (ADMIN_DATABASE_URL), auditada y fail-closed (F-2 APPROVED-WITH-OBSERVATIONS).

## Nota técnica detectada (LOW, no bloqueante hoy)

`db-rls-session.ts:70` ejecuta `SET LOCAL app.current_company_id = ${config.companyId}`
como statement parametrizado ($1). PostgreSQL no acepta parámetros en utility statements:
al activar DB-RLS esto fallará (fail-closed, no hay leak). Sustituir por
`SELECT set_config('app.current_company_id', $1, true)` al momento de la activación.
Hoy el módulo no tiene callers en src/ (código latente).
