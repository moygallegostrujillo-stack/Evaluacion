# EVALUHR — LEGAL MASTER PACKAGE · 25 · OVERALL SCORE / JOBFIT / RECOMMENDATION (PASO 21)

## 1. Qué SON (verificado en repo)

| Elemento | Qué es |
|---|---|
| **overallScore** | Número calculado por `calculateCanonicalOverallScore` (fórmula técnica **OVERALL-v1.1**): subconjunto de {PSYCHOLOGICAL, KNOWLEDGE}; **excluye siempre** INTEGRITY y BIG_FIVE (razones `NOT_APPROVED` registradas en `excludedSections/excludedReasons`); "sin evidencia ≠ 0" (NO_DATA/INSUFFICIENT/INVALID/PENDING_REVIEW se excluyen); 1 sección → score directo; 2 → media; sin evidencia → null |
| **recommendation** | Etiqueta de **completitud del perfil**: PERFIL_COMPLETO / PERFIL_PARCIAL / PENDIENTE — documentada como "NOT a hiring decision (LFPDPPP Art. 37 Bis)" (actualizar cita al art. 26 del marco 2025 — LEGAL_REVIEW) |
| **JobFit** | **NO EXISTE** — "JobFit is explicitly NOT implemented" (`overall-score.ts:37-40`); 0 modelos/vistas |

## 2. Qué NO SON

- No son una decisión de contratación ni una recomendación de contratar/no contratar.
- No son un juicio de personalidad ni de integridad (esas secciones están excluidas).
- No son comparables entre candidatos como ranking (la comparación existe en UI, `CompareView`, pero el resultado es orientación de completitud).
- No producen filtros ni vetos automáticos (códigos "never auto-filter" en el motor).

## 3. Quién los usa

- RR.HH. de la empresa cliente (vista de candidato/comparación) como **orientación informativa**.
- El candidato ve sus propios resultados (forzado por `results/route.ts:44-64`).
- Ningún proceso automático consume el score para decidir.

## 4. ¿Producen decisiones?

**No por diseño**: sin endpoint de modificación (results = solo GET), sin campos de decisión en schema, disclaimers en UI ("orientación informativa únicamente", `CandidateDetailView.tsx:386-401`). El dictamen debe validar si la presentación conjunta (score + etiquetas) exige salvaguardas adicionales frente al art. 26 LFPDPPP 2025 (evaluación automatizada).

## 5. Lenguaje permitido / prohibido

| Permitido | Prohibido |
|---|---|
| "Orientación informativa sobre la completitud del perfil" | "Recomendamos contratar / no contratar" |
| "El resultado no determina la decisión; la decisión es de RR.HH." | "El candidato aprobó/reprobó" |
| "Perfil completo/parcial/pendiente" (descripción de cobertura) | "APTO/NO_APTO" (semillas obsoletas en scripts de seed — depurar en implementación post-dictamen) |
| "Sin evidencia no se puntúa" | Cualquier promesa de validez/predictibilidad |

## 6. Regla del encargo

No introducir nuevos pesos ni cortes. La fórmula OVERALL-v1.1 queda documentada y congelada; cambios = post-dictamen con versionado.
