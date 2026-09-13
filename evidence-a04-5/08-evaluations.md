# A-04.5 — 08 · AUDITORÍA DE /api/evaluations (PASO 11)

## 1. Estado ANTES (F1)

`src/app/api/evaluations/route.ts`:
- `calculateScores()` L145-339: matriz de ramas con Integrity ponderada
  (0.15 en 4 secciones, 0.40 en 3 sin KN, etc.).
- Invocada en `completeEvaluation()` L1350.
- **Bug pre-canónico**: el overall se computaba en L1350 ANTES de que el
  override canónico de Knowledge (L1382) sobrescribiera `knowledgeScore`.
  El overall incrustaba el KN legacy mientras el campo mostraba el canónico.

## 2. Estado DESPUÉS (canónico)

### calculateScores() L263-310

La matriz de ramas fue reemplazada por el motor canónico:

```typescript
const canonicalInput: CanonicalOverallInput = {
  bigFive: instrument('BIG_FIVE', hasBigFiveData ? avgBigFive : null),
  psychological: instrument('PSYCHOLOGICAL', hasPsychData ? avgPsychological : null),
  knowledge: instrument('KNOWLEDGE', knowledgeScore),
  integrity: instrument('INTEGRITY', hasIntegrityData ? avgIntegrity : null),
}
const canonicalOverall = calculateCanonicalOverallScore(canonicalInput)
```

Retorna `formulaVersion`, `includedSections`, `excludedSections`,
`excludedReasons` además de los campos existentes.

### completeEvaluation() — RECOMPUTE tras override canónico (L1352-1390)

**Fix del bug pre-canónico**: después de que `scoreCanonicalAdministration`
sobrescribe `scores.knowledgeScore`, se RECOMPUTA el overall con el KN
canónico + su `evidenceStatus`:

```typescript
if (administration) {
  canonicalKnowledge = await scoreCanonicalAdministration(rlsDb, administration.id)
  scores.knowledgeScore = canonicalKnowledge.knowledgeScore

  // A-04.5: RECOMPUTE overall with canonical KN + evidenceStatus
  const recomputedInput = buildCanonicalInput(
    { openness: scores.openness, ... },
    { stressLevel: scores.stressLevel, ... },
    scores.knowledgeScore,
    canonicalKnowledge.evidenceStatus,
    scores.integrityScore
  )
  const recomputedOverall = calculateCanonicalOverallScore(recomputedInput)
  scores.overallScore = recomputedOverall.score
  scores.recommendation = recomputedOverall.guidance
  scores.formulaVersion = recomputedOverall.formulaVersion
  scores.includedSections = serializeSections(recomputedOverall.includedSections)
  scores.excludedSections = serializeSections(recomputedOverall.excludedSections)
  scores.excludedReasons = serializeExcludedReasons(recomputedOverall.excludedReasons)
}
```

### Persistencia (L1427-1445)

El spread `...scores` ahora incluye los 4 nuevos campos (formulaVersion,
includedSections, excludedSections, excludedReasons) en el `evaluationResult`
update/create.

## 3. Bug pre-canónico — RESUELTO

| Antes (A-04.4 hallazgo) | Después (A-04.5) |
|---|---|
| overall computado en L1350 con KN legacy | overall RECOMPUTADO tras override canónico |
| Campo knowledgeScore mostraba canónico, overall usaba legacy | Ambos usan el canónico |
| params muertos `positionCategory`/`hasKnowledgeTest` | Sin cambios (no afectan; documentado) |

## 4. Determinismo (PASO 12)

`completeEvaluation` usa el MISMO `buildCanonicalInput` +
`calculateCanonicalOverallScore` que public/apply y public/video. Mismo
dato → mismo overall (test OS-8).

## 5. Lo que NO cambió

- El scoring por instrumento (normalizeBigFive, normalizePsychological,
  calculateLikertScore) — intacto.
- El servidor de preguntas Knowledge canónicas (loadFrozenKnowledgeQuestions).
- El consent-gate y la purga al retiro.
- Los checks de ownership (session.companyId === auth.companyId).
- El uso de unscoped client para writes (RLS bypass legítimo).
