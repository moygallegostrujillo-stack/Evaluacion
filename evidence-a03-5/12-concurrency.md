# A-03.5 — PASO 14: CONCURRENCIA
## Inicios simultáneos → la MISMA versión publicada, sin mezclas v1/v2

## Riesgos resueltos

| Riesgo | Solución |
|---|---|
| Dos tx leen "no existe versión" y publican dos KA-v1 | Reintento del publish: el perdedor relee; si el contentHash coincide → REUTILIZA la versión del ganador (nunca crea v2 espuria) |
| Carrera en el unique (job, version) | `@@unique([vacancyId, version])` / `@@unique([positionId, version])` + catch P2002 → retry |
| Carrera en blueprint (job, jobType, blueprintVersion) | Mismo patrón: relectura del ganador; si structureHash coincide → reutiliza |
| Carrera en edición de item (itemId, itemVersion) | Relectura; contenido idéntico → reutiliza la edición (lineage preserved) |
| Contención SQLite ("database is locked", timeout de tx) | `isRetryableFreezeError` (P2002, P2028, locked, socket timeout) + retry de la transacción completa con jitter + `timeout: 20s / maxWait: 10s` |
| Mezcla v1/v2 en un mismo candidato | Imposible por diseño: la administración se congela UNA vez (start) y toda respuesta/scoring usa ESA administración; el banco vivo no se consulta después |

## Verificación (suite)

- **CONC-1** (público): 4 inicios PARALELOS (Promise.all) sobre el mismo banco
  → **4/4 start=200, todos sobre KA-v1** (una sola versión publicada, cero
  mezclas, cero fallas).
- **INT-1/INT-4 + start transaccional interno**: el freeze interno corre en
  transacción con idéntico patrón de reintento.
- **CHG-1/8**: la única forma de obtener otra versión es un CAMBIO REAL del
  banco publicado ANTES del inicio (A=v1 → cambio → B=v2 → cambio → C=v3).
- **INT-3b/SEC-3**: cada respuesta queda sellada a SU administración — un
  candidato jamás mezcla items de dos versiones (403 ITEM_NOT_IN_ADMINISTRATION
  ante intento externo).
