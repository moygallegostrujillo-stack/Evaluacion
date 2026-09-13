# A-04.4 — 10 · AUDITORÍA NULL → 0 (PASO 10 + PASO 9)

Búsquedas ejecutadas en las rutas de scoring y lib core: `?? 0`, `|| 0`, `default 0`, `Number(`, `parseFloat(`, `Math.max(`, `Math.min(`, y defaults de ítem. **Solo identificación — nada fue modificado.**

---

## 1. Inventario de conversiones null/ausencia → valor numérico

### 1.1 Afectan a Integridad

| # | Sitio | Expresión | Efecto |
|---|---|---|---|
| I-1 | `prisma/schema.prisma` L277 y L402 | `integrityScore Float @default(0)` | **a nivel schema**: ausencia estructuralmente imposible; 0 = «sin datos» ≡ «peor puntaje» |
| I-2 | `evaluations/route.ts` L331 | `integrityScore: hasIntegrityData ? Math.round(avgIntegrity*100)/100 : 0` | null→0 en la frontera de persistencia |
| I-3 | `apply/route.ts` L583 | `application.integrityScore \|\| 0` | null→0 defensivo |
| I-4 | `apply/route.ts` L568 | `hasIntegrityData = (includeIntegridad ?? true) === true && integrityScore > 0` | 0.00 REAL tratado como ausente (participa o no según `>0`) |
| I-5 | `apply/route.ts` L1716 | `integrityScore: updatedApp.integrityScore \|\| 0` | null→0 en puente a EvaluationResult |
| I-6 | `public/video/route.ts` L251–274 | (omisión del campo) | puente SIN integrityScore → default 0 aunque exista puntaje real |
| I-7 | `consent/route.ts` L412 | `integrityScore: 0` (reset) | retiro de consentimiento → 0; overall queda STALE (comentario L413) |
| I-8 | `retention.ts` L223 | `integrityScore: 0` | zeroing por anonimización — **legítimo/documentado** |

### 1.2 Afectan a Knowledge

| # | Sitio | Expresión | Efecto |
|---|---|---|---|
| K-1 | `apply/route.ts` L122 | `const correctIdx = resp.correctAnswer ?? 0` | **null→0 con efecto de SCORING**: sin clave, la opción 0 cuenta como CORRECTA (infla) |
| K-2 | `apply/route.ts` L524–526 | `correctIdx = resp.vacancyQuestion?.correctAnswer ?? systemMap…?.correctAnswer ?? 0` | ídem en step 4 legado |
| K-3 | `evaluations/route.ts` L227 | `if (resp.question.correctAnswer !== null && selectedIdx === correctAnswer)` | estricto: sin clave → sin crédito → **0% real que SÍ participa** (INSUFFICIENT-de-facto → 0) |
| K-4 | `knowledge-canonical.ts` L827–830 | `knowledgeScore = null` si `keyedAnswered === 0` | **semántica CORRECTA**: INSUFFICIENT ≠ 0 (excluido del overall por `!== null` en F1/F3) |
| K-5 | `results/route.ts` L198 | `(r.scores.knowledgeScore \|\| 0)` | null→0 en el PROMEDIO agregado del dashboard (sesga la media hacia abajo) |
| K-6 | `consent/route.ts` L413 (comentario) | overall NO recalculado al retirar consentimiento | STALE intencional («recalculating would require the full scoring engine») |
| K-7 | `retention.ts` L222 | `knowledgeScore: null` | zeroing legítimo (anulación, no scoring) |

### 1.3 Afectan a Psychology / Personality

| # | Sitio | Expresión | Efecto |
|---|---|---|---|
| P-1 | `evaluations/route.ts` L162 · `apply/route.ts` L56 | `resp.numericValue \|\| parseInt(resp.value,10) \|\| 3` | **null→3**: ítem faltante imputado al punto medio LIKERT (no a 0) |
| P-2 | ambos `calculateScores` | categoría sin respuestas → `scores[cat] = 0` (display) pero excluida del promedio y del overall | 0 de display sin efecto en overall |
| P-3 | `apply/route.ts` L573–580 | promedios solo con dims `> 0` | 0.00 real de una dimensión = excluida (renormalización intra-sección) |
| P-4 | `video/route.ts` L92–105 | denominadores FIJOS /5 | 0.00 real de una dimensión SÍ arrastra (contradice P-3) |
| P-5 | `video/route.ts` L93 | `100 − neuroticism` | re-inversión del neuroticismo ya invertido por ítem |
| P-6 | `consent/route.ts` L402–411 · `retention.ts` L212–221 | reset de dims a 0 | retiro/anonimización — legítimo |

### 1.4 Afectan a overallScore

| # | Sitio | Expresión | Efecto |
|---|---|---|---|
| O-1 | `evaluations/route.ts` L264–265 · `apply` L160–161/L593–594 · `video` L114–115 | `overallScore = 0` si 0 secciones | 0 = «sin datos» (sobrecarga semántica) |
| O-2 | `apply/route.ts` L1717 · `video/route.ts` L247 | `overallScore \|\| 0` (y doble fallback en video) | null→0 en puentes/escrituras |
| O-3 | `video/route.ts` L83 | gate `overallScore === 0` | un 0.00 persistido dispara RE-CÁLCULO y SOBREESCRITURA por la F4 |
| O-4 | schema L280/L… | `overallScore Float @default(0)` | default 0 estructural |

### 1.5 Fallbacks silenciosos relacionados (afectan a qué categoría puntúa un ítem)

| # | Sitio | Expresión | Efecto |
|---|---|---|---|
| F-1 | `apply/route.ts` L439 | `systemQ?.category \|\| 'OPENNESS'` | pregunta no encontrada → puntuada como OPENNESS |
| F-2 | `apply/route.ts` L468 | `\|\| 'EMPATHY'` | ídem → EMPATHY |
| F-3 | `apply/route.ts` L497 | `\|\| 'INTEGRITY_HONESTY'` | ídem → integridad-honestidad |

## 2. `Math.max` / `Math.min`

Solo CLAMPS, sin conversión null→0: `calculateLikertScore` recorta [1,5] (evaluations L133; apply L21); clamps [0,100] de normalización (evaluations L183/209/244; apply L76/102/140); `Math.max` de versionado en canonical L661. **Ningún Math.max/min altera nulls del scoring.**

## 3. `Number(` / `parseFloat(`

**AUSENTES de las rutas de scoring** (grep = 0 tras excluir `Number.isFinite` de canonical L818, que es un guard legítimo). Las conversiones numéricas usan `parseInt(value, 10)` — un `value` no numérico produce `NaN`, y en F1/F2 un `NaN` entraría al arreglo de categoría (L167/L60) degradando el promedio; no se encontró sanitización adicional (observación, no corrección).

## 4. Síntesis

- Único punto del sistema con semántica de evidencia correcta (null ≠ 0): **Knowledge canónico** (K-4).
- Conversiones null→0 con EFECTO DE DECISIÓN: K-1/K-2 (inflan), K-3 (castiga a 0%), I-1..I-5 (0=ausente), O-1..O-3.
- Conversiones legítimas/documentadas: retention (I-8/K-7/P-6), consent-reset (con overall STALE K-6), clamps.
- Imputación silenciosa P-1 (null→3) en ambos flujos, sin documento metodológico que la respalde.
