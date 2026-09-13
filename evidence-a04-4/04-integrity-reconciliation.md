# A-04.4 — 04 · RECONCILIACIÓN INTEGRITY (PASO 4)

Pregunta: dónde se generan las preguntas, dónde se puntúan, qué score existe, si existe estado INSUFFICIENT, si Integrity entra hoy en overallScore, con qué peso y qué rutas lo usan. **NO se cambió nada.**

---

## 1. Generación de preguntas

| Sitio | Líneas | Contenido |
|---|---|---|
| `src/lib/generate-templates.ts` | `INTEGRIDAD_QUESTIONS` L38–52; plantilla creada SIEMPRE (L334–348) | 10 ítems LIKERT 1–5 propios del demo, 4 subcategorías: INTEGRITY_HONESTY (3), INTEGRITY_RULES (3), INTEGRITY_THEFT (2), INTEGRITY_RESPONSIBILITY (2); 5 reverse-scored (ítems 3, 6, 7, 8, 10) |
| `src/app/api/public/apply/route.ts` | `HARDCODED_INTEGRIDAD` L266–270 (fallback si no hay plantillas) | Mismos ítems hardcodeados en el flujo público |
| Vacancia | `prisma/schema.prisma` L323 | `Vacancy.includeIntegridad Boolean @default(true)` — por defecto TODA vacancia incluye integridad |

Sin deseability controls, sin baremos, sin versionado de ítems, sin validación — coincide con AUDITORIA_EVALUHR.md L114 («no Reid/HD-29/Hogan… items 7-8 elicitan auto-incriminación»).

## 2. Puntuación

| Flujo | Función | Líneas |
|---|---|---|
| INTERNAL | `calculateScores` en `evaluations/route.ts` | bloque integridad L234–253: media normalizada `((avg−1)/4)·100` de las categorías INTEGRITY_* CON respuestas; clamp [0,100]; 2 decimales |
| PUBLIC (paso) | `calculateStepScores` step 3 en `apply/route.ts` | L487–508; fallback de categoría `'INTEGRITY_HONESTY'` si no se encuentra la pregunta (L497) |
| PUBLIC (misma fórmula en bloque step) | `calculateScores` en `apply/route.ts` | L130–149 (idéntica al interno) |
| VIDEO | **NO puntúa integridad** | `public/video/route.ts` L83–175 no la considera en absoluto |

## 3. Qué score existe y su nullabilidad

| Modelo | Campo | Definición schema | Consecuencia |
|---|---|---|---|
| EvaluationResult | `integrityScore` | `Float @default(0)` (L277) — **NOT NULL** | no puede representar ausencia; 0 = «sin datos» Y «peor puntaje» a la vez |
| VacancyApplication | `integrityScore` | `Float @default(0)` (L402) — **NOT NULL** | ídem |

Persistencia: `evaluations/route.ts` L331 `integrityScore: hasIntegrityData ? round : 0`; puente público `apply/route.ts` L1716 `integrityScore: updatedApp.integrityScore || 0`.

## 4. ¿Existe estado INSUFFICIENT para Integrity? **NO**

- Grep de `evidenceStatus` en scoring: solo existe en el motor canónico de Knowledge (`knowledge-canonical.ts` L734). Ningún campo, enum ni rama de código representa evidencia-status para Integridad.
- La ausencia se modela como 0 (schema default) y el overall la trata por heurísticas de presencia (`> 0`, `includeIntegridad`).

## 5. ¿Integrity entra HOY en overallScore? **SÍ — con pesos reales**

| Rama del overall | Peso de Integridad | Sitios |
|---|---|---|
| 4 secciones con datos | **0.15** | evaluations L282 · apply step L178 · apply final L609 |
| 3 secciones (BF+PSY+INT, sin KN) | **0.40** | evaluations L285 · apply step L181 · apply final L612 |
| KN + k behaviorales (incluye INT) | **0.50 ÷ k** (efectivo) | evaluations L291–296 · apply L185–192/L616–623 |
| 2 secciones | 0.50 (media simple) | evaluations L272–279 · apply L168–175/L600–606 |
| 1 sola sección = integridad | **1.00** (el overall ES integridad) | evaluations L266–271 · apply L595–599 |
| VIDEO | **0** (nunca participa) | video L83–175 |

Condiciones de participación: interno — basta ≥1 respuesta INTEGRITY_* (L253/L261); público final — `(vacancy.includeIntegridad ?? true) && integrityScore > 0` (L568) — un 0.00 real cuenta como ausente.

**El comentario del código dice «orientative — never as auto-filter» (evaluations L234, apply L130) pero gobierna solo ítems/guidance; el PESO en la fórmula es real.** Esto fue documentado como deuda técnica en A-04.2 §7 y confirmado por A-04.3; hoy se re-confirma sobre el árbol limpio.

## 6. Rutas que lo utilizan

| Ruta | Uso |
|---|---|
| `/api/evaluations` (POST complete) | puntúa + persiste + pondera en overall (flujo interno auth) |
| `/api/public/apply` (steps 3 y completado) | puntúa paso 3 + pondera en `calculateOverallScore` (L1626) |
| `/api/public/video` | NO usa integridad; además el puente a EvaluationResult (L251–274) OMITE el campo integrityScore → el registro puente queda con default 0 aunque la aplicación tenga puntaje real (hallazgo nuevo de esta auditoría) |
| `/api/results`, `/api/candidates`, `/api/vacancies/[id]/applications` | solo lectura/exposición |
| Frontend (Dashboard/Candidates/Compare/CandidateDetail) | display |

## 7. Reconciliación con decisiones documentadas

| Antecedente | Regla | Estado real hoy | Veredicto |
|---|---|---|---|
| A-04.1 C4 | indicador separado, sin peso automático en overall | peso real 0.15–1.00 | CONTRADICTED |
| A-04.2 GATE-10 / OPTION B | Integridad NO entra en JobFit/overall sin GATE-1..10 | ya entra (deuda documentada en A-04.2 §7) | CONTRADICTED (deuda conocida) |
| A-04.3 §8 | participación real cuantificada | CONFIRMED (mismas líneas) | CONFIRMED |
| Flag en código | «orientative, never auto-filter» | no aplicado a la fórmula | CONTRADICTED |

## 8. Conclusión

Generación y puntuación: confirmadas y localizadas. Score: escalar NOT NULL con default 0, **sin estado INSUFFICIENT**. Participación en overallScore: **SÍ, real (0.15–1.00 según rama; 0 solo en video)**. Rutas: evaluations + public/apply (video la excluye). Nada fue modificado.
