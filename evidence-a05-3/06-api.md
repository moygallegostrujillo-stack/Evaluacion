# A-05.3 — 06 · API (PASO 7)

## 1. Verificación

Se verificó que ninguna ruta nueva puede:

| Acción prohibida | Estado | Mecanismo |
|---|---|---|
| Generar nuevas preguntas Big Five | ✅ Bloqueado | `generateTemplatesForPosition` no crea PSICOMETRICA template para nuevos positions |
| Aceptar nuevas respuestas Big Five | ✅ Ignorado | Los responses de Big Five (legado) se persisten pero NO alimentan overallScore (engine excluye BIG_FIVE) |
| Escribir nuevos personalityScore | ✅ Sin impacto | Los scores BF se computan de responses pero el engine los excluye del overall |
| Incorporar Personality al overallScore | ✅ Bloqueado | `getExclusionReason` devuelve `PERSONALITY_NOT_APPROVED_FOR_V1` para BIG_FIVE incondicionalmente |

## 2. Rutas auditadas

| Ruta | ¿Sirve Big Five? | ¿Acepta BF responses? | ¿BF en overall? | Seguridad |
|---|---|---|---|---|
| `/api/evaluations` | SÍ (legacy positions con template) | SÍ (persiste scores) | **NO** (engine excluye) | ✅ |
| `/api/public/apply` | SÍ (legacy fallback) | SÍ (persiste scores) | **NO** (engine excluye) | ✅ |
| `/api/public/video` | N/A (no sirve preguntas) | N/A | **NO** (engine excluye) | ✅ |
| `/api/results` | N/A (lectura) | N/A | N/A (lectura) | ✅ |
| `/api/dashboard` | N/A (conteos por recommendation) | N/A | N/A | ✅ |

## 3. Servidor ignora/rechaza activación desde cliente (PASO 7)

El servidor debe ignorar o rechazar intentos de activar Personality desde el cliente.

**Verificado**: no existe ningún parámetro client-side que pueda activar Personality:
- `buildCanonicalInput` siempre pasa BIG_FIVE al engine.
- El engine SIEMPRE excluye BIG_FIVE con `PERSONALITY_NOT_APPROVED_FOR_V1`.
- No hay `enableBigFive`, `includePersonality`, ni flag similar en ninguna ruta.
- El cliente no puede enviar `personalityScore` (no se lee del body).

Verificado por grep: `body.personalityScore` y `body.bigFive` = 0 matches en todas las rutas (test PERS-08).

## 4. Conclusión PASO 7

El servidor bloquea completamente la incorporación de Personality al overallScore para nuevas evaluaciones. Las rutas legacy (con template PSICOMETRICA) siguen sirviendo preguntas y persistiendo scores, pero estos NO alimentan el overallScore.
