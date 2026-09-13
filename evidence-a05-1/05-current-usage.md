# A-05.1 — 05 · USO ACTUAL DE PERSONALIDAD (PASO 6, 12, 13)

## 1. Inventario de usos

| Componente | ¿Usa personalidad? | Detalle |
|---|---|---|
| `/api/evaluations` | SÍ | `calculateScores()` produce openness…neuroticism; `avgBigFive` alimenta el overall canónico |
| `/api/public/apply` (F2 por paso) | SÍ | `calculateScores()` produce los mismos campos por paso; persiste |
| `/api/public/apply` (F3 final) | SÍ | `buildCanonicalInput({ openness, … })` lee la fila persistida |
| `/api/public/video` | SÍ | `buildCanonicalInput` lee la fila persistida al re-cerrar scoring |
| `/api/results` | SÍ (lectura) | L97–120 comparador; L163/187 promedio; L348 |
| `/api/candidates` | SÍ (lectura) | L126/153 |
| `/api/vacancies/[id]/applications` | SÍ (lectura) | L64 |
| `/api/dashboard` | Indirecto | conteos por `recommendation` (guidance), NO por puntaje de personalidad |
| `src/lib/admin-db.ts` | Indirecto | L229–235 conteos por recommendation |
| Frontend `CandidateDetailView` | SÍ | radar Big Five + ScoreBars + agregado display |
| Frontend `CompareView` | SÍ | radar comparativo «Big Five» |
| Frontend `EvaluationView` / `PublicEvaluationView` | SÍ | sirve los 10 ítems al candidato |
| Frontend `DashboardView` / `VacancyManagementView` | Indirecto | lee `overallScore`/`recommendation` (no puntajes crudos) |

## 2. ¿La personalidad alimenta `overallScore`?

**SÍ.** Tras A-04.5, el motor canónico (`src/lib/overall-score.ts`) incluye BIG_FIVE cuando tiene datos:

- 1 sección presente (solo BF) → overall = avgBigFive.
- 2 secciones (BF + otra) → equal split.
- 3 secciones (BF + PSY + KN) → `0.30·BF + 0.30·PSY + 0.40·KN`.

Peso de BF: **0.30** cuando hay 3 secciones, o **0.50** cuando hay 2 (BF+KN), o **1.00** cuando es la única sección. Estos son los pesos históricos PRESERVADOS por A-04.5 (ningún peso nuevo fue creado).

## 3. ¿La personalidad alimenta `recommendation`?

**NO directamente.** El `recommendation` (guidance) es de completitud:
- PERFIL_COMPLETO = los 4 instrumentos (BF, PSY, KN, INT) tienen datos con evidencia válida.
- PERFIL_PARCIAL = 1–3 instrumentos.
- PENDIENTE = 0.

Los **puntajes** de personalidad (openness=70, etc.) **NO** se usan para clasificar la recomendación. Solo la **presencia/ausencia de datos** la determina.

## 4. ¿La personalidad aparece en JobFit?

**NO.** JobFit NO existe como entidad en el código (A-04.3/A-04.4 confirmado; A-04.5 no lo implementó). No hay conexión automática entre personalidad y JobFit.

## 5. ¿La personalidad genera lenguaje laboral?

**Parcialmente, en el summary descriptivo.** `generateSummary()` produce:
- strengths: «alta extraversión», «alta responsabilidad», «alta apertura a la experiencia», «alta amabilidad» (si dim ≥70).
- concerns: «alto neuroticismo» si >60 (valor invertido), «bajo neuroticismo» no se reporta.

Estas son **descripciones del rasgo**, NO predicciones de desempeño, NO «perfil ideal», NO «aptitud para el puesto». No existe un perfil de personalidad objetivo por puesto, ni umbrales de corte, ni APTO/NO APTO basado en personalidad.

## 6. Separación de personalidad de otros componentes (PASO 12)

| Separación | Estado |
|---|---|
| Personalidad ≠ JobFit | ✅ CUMPLIDA — JobFit no existe; ninguna conexión automática |
| Personalidad ≠ Integrity | ✅ CUMPLIDA — instrumentos separados (BIG_FIVE vs INTEGRITY_*); A-04.5 aisló Integrity del overall |
| Personalidad ≠ Knowledge | ✅ CUMPLIDA — instrumentos separados (BIG_FIVE vs KNOWLEDGE); Knowledge tiene motor canónico propio |
| Personalidad ≠ criterio crítico | ✅ CUMPLIDA — no hay perfil ideal, ni corte, ni APTO |
| Personalidad ≠ recomendación de contratación | ✅ CUMPLIDA — recommendation es guidance de completitud |

## 7. Regla obligatoria (PASO 12) — cumplimiento

> «Ninguna dimensión de personalidad puede convertirse automáticamente en criterio crítico, perfil ideal, punto de corte, APTO, NO APTO, ni recomendación de contratación.»

**Verificado CUMPLIDO** en el estado actual:
- No existe `idealProfile` ni `targetBigFive` por puesto.
- No existe umbral (e.g. `openness > X`) que dispare una decisión.
- No existe APTO/NO_APTO (eliminado; persiste solo en seed obsoleto, no en `src/`).
- `recommendation` = guidance de completitud, no decisión.

## 8. Personalidad y overall (PASO 13)

Tras A-04.5, PERSONALITY (BIG_FIVE) **sí participa** en `overallScore` con peso 0.30 (3 secciones) / 0.50 (2 secciones) / 1.00 (1 sección). Esto es el comportamiento histórico PRESERVADO — A-04.5 aisló Integrity pero NO aisló personalidad. A-05.1 es auditoría; **no se cambia**. La decisión sobre si personalidad debe permanecer en overall queda para la decisión V1 (PASO 11, doc 10).
