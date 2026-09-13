# A-04.5 — 06 · AUDITORÍA DE /api/public/video (PASO 9, 10)

## 1. Estado ANTES (F4 — divergente)

El endpoint `src/app/api/public/video/route.ts` tenía una CUARTA fórmula inline
(L83-175) que SOBREESCRIBÍA el overallScore cuando el gate
`application.overallScore === 0` se cumplía:

- `psicometricaAvg = (100 − neuroticism + O + C + E + A) / 5` — **re-invertía
  el neuroticismo** que los ítems ya invierten vía `reverseScored`.
- `psicologicaAvg = (S + E + A + L + T) / 5` — denominador FIJO 5.
- Pesos `0.30/0.30/0.40` BF/PSY/KN con **renormalización PROPORCIONAL**
  `weight/totalWeight`.
- **Integrity = 0 siempre**.
- `hasKnowledge = !== null && > 0` — un 0.00 real = ausente.
- Guidance `PERFIL_COMPLETO = BF+PSY+KN` (sin INT).
- Puente a EvaluationResult SIN `integrityScore` (default 0).

## 2. Estado DESPUÉS (canónico)

El endpoint ahora **delega al mismo motor canónico** que evaluations y
public/apply:

```typescript
import { calculateCanonicalOverallScore, buildCanonicalInput, ... } from '@/lib/overall-score'

if (application.overallScore === 0) {
  // Look up canonical Knowledge evidence status
  const knowledgeResult = appWithKn?.knowledgeAdministration?.knowledgeResult
  const knowledgeEvidenceStatus = knowledgeResult?.evidenceStatus ?? null

  const canonicalInput = buildCanonicalInput(
    { openness, conscientiousness, extraversion, agreeableness, neuroticism },
    { stressLevel, empathy, adaptability, leadership, teamwork },
    application.knowledgeScore,
    knowledgeEvidenceStatus,
    application.integrityScore
  )
  const canonical = calculateCanonicalOverallScore(canonicalInput)

  updateData.overallScore = canonical.score
  updateData.recommendation = canonical.guidance
  updateData.formulaVersion = canonical.formulaVersion
  updateData.includedSections = serializeSections(canonical.includedSections)
  updateData.excludedSections = serializeSections(canonical.excludedSections)
  updateData.excludedReasons = serializeExcludedReasons(canonical.excludedReasons)
}
```

## 3. Divergencias ELIMINADAS

| Divergencia F4 | Estado |
|---|---|
| Neuroticismo re-invertido | **ELIMINADO** — el motor usa el valor persistido directamente |
| Denominadores fijos /5 | **ELIMINADO** — agregado adaptativo (solo dims > 0) |
| Renormalización proporcional | **ELIMINADA** — matriz de ramas histórica (equal-split / 0.30/0.30/0.40) |
| 0.00-KN = ausente | **ELIMINADO** — `!== null` (un 0.00 real participa) |
| PERFIL_COMPLETO sin INT | **ELIMINADO** — guidance canónica (requiere los 4) |
| Sin integrityScore en puente | **PRESERVADO** el campo en schema; el motor lo registra como excluido |
| Fórmula propia | **ELIMINADA** — un solo motor |

## 4. Gate PRESERVADO

El gate `if (application.overallScore === 0)` se conserva como mecanismo de
"cierre de scoring" — solo recalcula si el flujo principal dejó el overall en 0.
**No introduce una fórmula nueva**; usa el motor canónico cuando se dispara.

## 5. Determinismo (PASO 12)

Mismo dato persistido → mismo overall, sin importar si el cierre lo hizo
`/api/public/apply` (F3) o `/api/public/video` (canónico). Verificado en
tests OS-9, OS-10.

## 6. Puente a EvaluationResult

El puente (L251+) ahora propaga `formulaVersion`, `includedSections`,
`excludedSections`, `excludedReasons` al EvaluationResult creado para
visibilidad de RH. Antes el puente no tenía estos campos (no existían).
