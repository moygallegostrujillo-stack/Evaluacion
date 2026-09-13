# A-04.5 — 07 · AUDITORÍA DE /api/public/apply (PASO 10)

## 1. Estado ANTES (F2 por paso + F3 final)

Dos implementaciones en `src/app/api/public/apply/route.ts`:

- **F2** `calculateScores()` L43-233: por paso, persiste scores parciales.
  Misma matriz de ramas que F1. Bug: `correctAnswer ?? 0` (L122) infla KN.
- **F3** `calculateOverallScore(applicationId)` L547-670: al completar,
  relee la fila persistida y recomputa overall. Misma matriz. `integrityScore || 0`
  (L583), `hasIntegrityData = includeIntegridad && > 0` (L568),
  `hasKnowledgeData = !== null` (L569).

## 2. Estado DESPUÉS (canónico)

### F2 (por paso) — L159-208

Reemplazada la matriz de ramas por el motor canónico:

```typescript
const canonicalInput = buildCanonicalInput(
  { openness, conscientiousness, extraversion, agreeableness, neuroticism },
  { stressLevel, empathy, adaptability, leadership, teamwork },
  knowledgeScore,
  null,  // per-step: evidenceStatus no resuelto aún
  hasIntegrityData ? avgIntegrity : 0
)
const canonicalOverall = calculateCanonicalOverallScore(canonicalInput)
```

El overall por paso es preliminar (usa el KN legacy). Al completar, F3
recomputa con el KN canónico + evidenceStatus. Mismo motor → consistencia.

### F3 (final) — L523-612

Reescrita para usar el motor canónico + buscar el KnowledgeResult:

```typescript
async function calculateOverallScore(applicationId) {
  const application = await db.vacancyApplication.findUnique({
    where: { id: applicationId },
    include: {
      vacancy: true,
      knowledgeAdministration: { include: { knowledgeResult: true } },
    },
  })
  // ...
  const knowledgeEvidenceStatus = knowledgeResult?.evidenceStatus ?? null
  const canonicalInput = buildCanonicalInput(...)
  const canonical = calculateCanonicalOverallScore(canonicalInput)
  return { ...canonical, summary }
}
```

### Persistencia (L1566-1583)

```typescript
await db.vacancyApplication.update({
  data: {
    overallScore: overall.overallScore,
    recommendation: overall.guidance,
    summary: overall.summary,
    formulaVersion: overall.formulaVersion,
    includedSections: serializeSections(overall.includedSections),
    excludedSections: serializeSections(overall.excludedSections),
    excludedReasons: serializeExcludedReasons(overall.excludedReasons),
  },
})
```

### Puente a EvaluationResult (L1644-1673)

Propaga los 4 nuevos campos al EvaluationResult creado para visibilidad de RH.

## 3. Orden persist→compute (A-03.4) PRESERVADO

El fix de orden de A-03.4 (persistir scores del paso ANTES de computar el
overall) se mantiene intacto. Solo cambió la FÓRMULA (canónica en vez de
matriz local).

## 4. Determinismo (PASO 12)

F2 y F3 usan el MISMO `buildCanonicalInput` + `calculateCanonicalOverallScore`.
El overall por paso y el final son consistentes. Mismo dato → mismo overall
que evaluations y video (tests OS-7, OS-8, OS-9).

## 5. Lo que NO cambió

- La estructura de steps (0=data, 1=psicométrica, 2=psicológica, 3=conocimientos,
  4=video, 5=done).
- El scoring de Knowledge canónico (scoreCanonicalAdministration).
- El versionado de Knowledge (freeze, LEGACY classification).
- El token HMAC (Phase 3.5-B.2).
- El consent-gate.
