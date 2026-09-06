# FASE 3.5-H — PARTE 16: DECISIÓN CompanyPrivacyNotice

## Análisis
`CompanyPrivacyNotice` porta `companyId` (documento legal POR empresa, `@unique`) y es
alcanzable desde runtime de tenant (RH edita el aviso de SU empresa vía
`/api/privacy-notice` PUT/regenerate con `createRLSClient`).

## Decisión: **A) RLS obligatorio** (doble capa)

| Capa | Estado en 3.5-H |
|---|---|
| App-layer | Registrado en `TENANT_SCOPED_MODELS` (`src/lib/rls.ts`) — enforcement INMEDIATO para toda query vía cliente RLS. |
| DB-layer | `ENABLE+FORCE ROW LEVEL SECURITY` + 4 policies añadidas a `prisma/rls-policies.sql` y su espejo en `rls-rollback.sql` (NO EXECUTADOS — activan con el resto del artefacto RLS). |

Justificación: "sin RLS por diseño" sin barrera equivalente no es aceptable para una
tabla tenant que contiene el texto legal vigente por empresa (manipulación del aviso de
privacidad = riesgo LFPDPPP directo).

## Lecturas públicas (pre-auth)
El bootstrap público (`/api/privacy-notice` GET por companySlug) usa cliente unscoped
derivando el contexto de datos verificados del servidor (slug → empresa), patrón ya
clasificado como válido en `getUnscopedClient()` (auth/public flows). Bajo FORCE RLS,
esas lecturas pasarán por la conexión de runtime: deben ejecutarse con contexto o por
un canal autorizado — quedan documentadas como punto de atención para la FASE de
activación RLS (no son alcanzables por input de usuario para cruzar tenant: el slug
resuelve UNA empresa y devuelve SOLO su aviso).

## Efecto inmediato (app-layer, hoy)
- Toda query `rlsDb.companyPrivacyNotice.*` auto-inyecta/valida `companyId`.
- Las rutas PUT/regenerate ya filtraban por `auth.companyId` — sin cambio de conducta.
