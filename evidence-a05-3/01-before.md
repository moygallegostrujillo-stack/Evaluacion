# A-05.3 — 01 · AUDITORÍA BEFORE (PASO 1)

## Propósito

Este documento es la **auditoría BEFORE** para la fase **A-05.3 — Retiro controlado del demo Big Five de V1**. Su único objetivo es fijar, **antes de cualquier cambio**, EXACTAMENTE dónde existe hoy Personalidad (Big Five) en el codebase, para que el plan de retiro (pasos 2+) pueda mover cada sitio de forma rastreable.

**DOCUMENTATION-ONLY** — no se modifica nada. No se toca código, schema, scoring, ni datos.

**Base de la auditoría:** `main@aa771a9` (post-A-05.2). Línea de comandos verificada contra el árbol actual de trabajo (HEAD). Cero modificaciones realizadas durante esta fase.

**Contexto inmediato:**
- A-05.1 concluyó que el «Big Five» actual es un instrumento PROJECT-CREATED de 10 reactivos, sin citar fuente, sin versión, sin baremos, evidencia NOT ESTABLISHED (origen UNKNOWN, derechos UNKNOWN).
- A-05.2 decidió **OPTION E — NO IMPLEMENTAR PERSONALIDAD EN V1** como instrumento formal; condicionó la activación post-V1 a IPIP-50-MX validado + PERSONALITY-G1..G10.
- A-04.5 ya aisló **Integrity** del `overallScore` mediante el motor canónico `calculateCanonicalOverallScore()`. A-05.3 hará el mismo tipo de aislamiento para **Personality**.

---

## 1. Todos los reactivos Big Five

Existen **DOS sitios** en código fuente donde vive la lista hardcoded de los 10 reactivos Big Five. Los textos son **idénticos caracter por caracter** entre ambos. Un tercer sitio (seed.ts) los materializa indirectamente vía `generateTemplatesForPosition()`.

### 1.1 `src/lib/generate-templates.ts` L10–21 — `BIG_FIVE_QUESTIONS`

```typescript
const BIG_FIVE_QUESTIONS = [
  { text: 'Disfruto probar nuevas formas de hacer las cosas en el trabajo', category: 'OPENNESS', order: 1 },
  { text: 'Me considero una persona creativa e imaginativa', category: 'OPENNESS', order: 2 },
  { text: 'Siempre organizo mis tareas antes de empezar a trabajar', category: 'CONSCIENTIOUSNESS', order: 3 },
  { text: 'Cuando me propongo algo, lo completo sin importar los obstáculos', category: 'CONSCIENTIOUSNESS', order: 4 },
  { text: 'Me siento cómodo/a iniciando conversaciones con personas que no conozco', category: 'EXTRAVERSION', order: 5 },
  { text: 'Disfruto trabajar en equipo más que de forma individual', category: 'EXTRAVERSION', order: 6 },
  { text: 'Me preocupa que mis compañeros de trabajo se sientan bien', category: 'AGREEABLENESS', order: 7 },
  { text: 'Prefiero llegar a un acuerdo que ganar una discusión', category: 'AGREEABLENESS', order: 8 },
  { text: 'Me estreso fácilmente cuando tengo mucho trabajo por hacer', category: 'NEUROTICISM', order: 9, reverseScored: true },
  { text: 'Me cuesta controlar mis emociones cuando algo sale mal', category: 'NEUROTICISM', order: 10, reverseScored: true },
]
```

### 1.2 `src/app/api/public/apply/route.ts` L215–226 — `HARDCODED_BIG_FIVE`

```typescript
const HARDCODED_BIG_FIVE = [
  { id: 'hw-bf-1', text: 'Disfruto probar nuevas formas de hacer las cosas en el trabajo', category: 'OPENNESS', type: 'LIKERT', reverseScored: false, order: 1 },
  { id: 'hw-bf-2', text: 'Me considero una persona creativa e imaginativa', category: 'OPENNESS', type: 'LIKERT', reverseScored: false, order: 2 },
  { id: 'hw-bf-3', text: 'Siempre organizo mis tareas antes de empezar a trabajar', category: 'CONSCIENTIOUSNESS', type: 'LIKERT', reverseScored: false, order: 3 },
  { id: 'hw-bf-4', text: 'Cuando me propongo algo, lo completo sin importar los obstáculos', category: 'CONSCIENTIOUSNESS', type: 'LIKERT', reverseScored: false, order: 4 },
  { id: 'hw-bf-5', text: 'Me siento cómodo/a iniciando conversaciones con personas que no conozco', category: 'EXTRAVERSION', type: 'LIKERT', reverseScored: false, order: 5 },
  { id: 'hw-bf-6', text: 'Disfruto trabajar en equipo más que de forma individual', category: 'EXTRAVERSION', type: 'LIKERT', reverseScored: false, order: 6 },
  { id: 'hw-bf-7', text: 'Me preocupa que mis compañeros de trabajo se sientan bien', category: 'AGREEABLENESS', type: 'LIKERT', reverseScored: false, order: 7 },
  { id: 'hw-bf-8', text: 'Prefiero llegar a un acuerdo que ganar una discusión', category: 'AGREEABLENESS', type: 'LIKERT', reverseScored: false, order: 8 },
  { id: 'hw-bf-9', text: 'Me estreso fácilmente cuando tengo mucho trabajo por hacer', category: 'NEUROTICISM', type: 'LIKERT', reverseScored: true, order: 9 },
  { id: 'hw-bf-10', text: 'Me cuesta controlar mis emociones cuando algo sale mal', category: 'NEUROTICISM', type: 'LIKERT', reverseScored: true, order: 10 },
]
```

### 1.3 Distribución de los 10 reactivos

| # | Dimensión | reverseScored | Texto (resumen) |
|---|---|---|---|
| 1 | OPENNESS | no | Disfruto probar nuevas formas de hacer las cosas |
| 2 | OPENNESS | no | Me considero una persona creativa e imaginativa |
| 3 | CONSCIENTIOUSNESS | no | Siempre organizo mis tareas antes de empezar |
| 4 | CONSCIENTIOUSNESS | no | Cuando me propongo algo, lo completo |
| 5 | EXTRAVERSION | no | Me siento cómodo/a iniciando conversaciones |
| 6 | EXTRAVERSION | no | Disfruto trabajar en equipo |
| 7 | AGREEABLENESS | no | Me preocupa que mis compañeros se sientan bien |
| 8 | AGREEABLENESS | no | Prefiero llegar a un acuerdo que ganar |
| 9 | NEUROTICISM | **sí** | Me estreso fácilmente cuando tengo mucho trabajo |
| 10 | NEUROTICISM | **sí** | Me cuesta controlar mis emociones |

**2 ítems por dimensión**, **2 ítems `reverseScored`** (ambos en NEUROTICISM). Misma estructura y mismos textos en ambos sitios (1.1 y 1.2).

---

## 2. Todos los generadores

### 2.1 `generateTemplatesForPosition()` — `src/lib/generate-templates.ts` L184+

Función exportada que recibe `(positionId, positionTitle, category, hasKnowledgeTest)` y crea plantillas para cada nueva posición. El bloque de Big Five:

- **L218–228:** crea el template `PSICOMETRICA` con `name = 'Evaluación Psicométrica - ${categoryName}'`, `description = 'Test Big Five de personalidad para puesto de ${categoryName}'`, `type: 'PSICOMETRICA'`, `order: 1`, `active: true`.
- **L231–243:** itera `BIG_FIVE_QUESTIONS` y crea una `Question` por cada uno, con `type: 'LIKERT'`, `category` del reactivo, `reverseScored: q.reverseScored || false`, `order` del reactivo, y `evaluationTemplateId = psicoTemplate.id`.

**Comportamiento actual:** TODA posición nueva obtiene automáticamente una plantilla PSICOMETRICA con 10 preguntas Big Five. No existe un flag para omitir Big Five al crear una posición.

```typescript
// L217–243 (resumen)
const psicoTemplate = await db.evaluationTemplate.create({
  data: {
    name: `Evaluación Psicométrica - ${categoryName}`,
    type: 'PSICOMETRICA',
    description: `Test Big Five de personalidad para puesto de ${categoryName}`,
    order: 1, positionId, companyId: positionCompanyId, active: true,
  },
})
templatesCreated++
for (const q of BIG_FIVE_QUESTIONS) {
  await db.question.create({
    data: {
      text: q.text, type: 'LIKERT',
      category: q.category,
      reverseScored: q.reverseScored || false,
      order: q.order,
      evaluationTemplateId: psicoTemplate.id,
    },
  })
  questionsCreated++
}
```

### 2.2 `seed.ts` (indirecto)

El script `prisma/seed.ts` crea posiciones invocando a su vez a `generateTemplatesForPosition()`, lo que materializa los 10 reactivos en la tabla `Question` para cada posición sembrada. No hay una lista paralela de reactivos en seed.ts; ambos beben de la misma fuente `BIG_FIVE_QUESTIONS`.

---

## 3. Todos los fallbacks

### 3.1 `HARDCODED_BIG_FIVE` — `src/app/api/public/apply/route.ts` L215–226

Sirve como **fallback** cuando la posición no tiene plantillas creadas en BD (caso teórico: posición huérfana o pérdida de plantilla). El flujo de apply/route.ts L268–275 obtiene `evaluationTemplates` con `where: { type: { in: ['PSICOMETRICA', 'PSICOLOGICA', 'CONOCIMIENTOS', 'INTEGRIDAD'] } }`; si el arreglo PSICOMETRICA llega vacío, el endpoint usa `HARDCODED_BIG_FIVE` para que el candidato reciba los 10 reactivos idénticos a los de la plantilla.

Texto idéntico al canon `BIG_FIVE_QUESTIONS` (verificado L215–226 vs L10–21). Difiere solo en metadatos: el fallback añade `id: 'hw-bf-N'` y `type: 'LIKERT'` (campos que el frontend necesita y que el canon no incluye porque el INSERT a `Question` los deriva de los parámetros).

---

## 4. Todo el scoring

Existen **DOS implementaciones idénticas** del scoring Big Five: una en `evaluations/route.ts` (canal interno admin) y otra en `public/apply/route.ts` (canal público). Las funciones son copia caracter por caracter. El comentario en apply/route.ts L25 confirma: `// SCORING ALGORITHM (same as evaluations/route.ts)`.

### 4.1 `calculateLikertScore(value, reverseScored)` — evaluations/route.ts L141–144 (idéntico en apply/route.ts L28–31)

```typescript
function calculateLikertScore(value: number, reverseScored: boolean): number {
  const v = Math.max(1, Math.min(5, value))   // clamp 1–5
  return reverseScored ? 6 - v : v            // NEUROTICISM: 6 − v
}
```

### 4.2 `normalizeBigFive(avgScore)` — evaluations/route.ts L146–148 (idéntico en apply/route.ts L33–35)

```typescript
function normalizeBigFive(avgScore: number): number {
  return ((avgScore - 1) / 4) * 100           // Likert 1–5 → 0–100
}
```

### 4.3 `calculateScores()` — evaluations/route.ts L154+ (canal interno admin)

L154–312. Produce, entre otras cosas, los 5 puntajes Big Five:

```typescript
const bigFiveCategories = ['OPENNESS', 'CONSCIENTIOUSNESS', 'EXTRAVERSION', 'AGREEABLENESS', 'NEUROTICISM']
// ...
for (const cat of bigFiveCategories) {
  const scores = categoryScores[cat] || []
  if (scores.length > 0) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    let normalized = normalizeBigFive(avg)
    // NEUROTICISM ya está invertido a nivel de ítem vía reverseScored — NO se re-invierte aquí
    bigFiveScores[cat] = Math.round(Math.max(0, Math.min(100, normalized)) * 100) / 100
    bigFiveSum += bigFiveScores[cat]
    bigFiveCategoriesWithResponses++
  } else {
    bigFiveScores[cat] = 0
  }
}
const avgBigFive = bigFiveCategoriesWithResponses > 0 ? bigFiveSum / bigFiveCategoriesWithResponses : 0
const hasBigFiveData = bigFiveCategoriesWithResponses > 0
```

Salida (L288–293): `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` (Float 0–100, 2 decimales, `|| 0` si no hay datos).

`avgBigFive` alimenta el motor canónico vía `instrument('BIG_FIVE', hasBigFiveData ? avgBigFive : null)` (L280) y luego `calculateCanonicalOverallScore(canonicalInput)` (L285).

### 4.4 `calculateScores()` — public/apply/route.ts L51+ (canal público, por paso)

L51–209. Misma lógica que 4.3, dos diferencias menores:

- La firma toma `ScoredResponse[]` (donde `category`, `type`, `reverseScored`, `numericValue`, `value`, `correctAnswer` están aplanados en cada respuesta) en lugar de `responses` con `question.category` anidado.
- La salida incluye `psicometricaAvg` y `psicologicaAvg` (usados por el frontend paso a paso) además de los 5 puntajes Big Five.

Persistencia (L165–184): el resultado por paso invoca `buildCanonicalInput({...openness, ...neuroticism}, {...}, knowledgeScore, null, integrityScore)` y `calculateCanonicalOverallScore(canonicalInput)` → `overallScore` y `guidance` se persisten en `VacancyApplication`.

### 4.5 `calculateOverallScore(applicationId)` — public/apply/route.ts L523+ (canal público, final)

L523–… La función "final" que re-cierra el scoring al completar la última sección. Lee `application.openness … neuroticism` persistidos, los pasa a `buildCanonicalInput` (L566–584) y llama `calculateCanonicalOverallScore(canonicalInput)` (L585). El `guidance` se persiste como `recommendation`.

### 4.6 Re-computado en `evaluations/route.ts` L1365+ (post-canonical-Knowledge fix de A-04.5)

`completeEvaluation()` llama a `scoreCanonicalAdministration` (L1354) para resolver KN canónico + `evidenceStatus`, y luego **re-computa** el overall con `buildCanonicalInput({openness, …, neuroticism}, …, scores.knowledgeScore, canonicalKnowledge.evidenceStatus, scores.integrityScore)` (L1365) y `calculateCanonicalOverallScore(recomputedInput)` (L1384). El overall final persistido en `EvaluationResult` incluye Big Five vía `aggregateBigFive()`.

---

## 5. Todos los resultados almacenados (schema)

`prisma/schema.prisma` define las **5 columnas Big Five Float @default(0)** en DOS modelos:

### 5.1 `EvaluationResult` — schema.prisma L260–264

```prisma
  // Big Five (0-100)
  openness          Float    @default(0)
  conscientiousness Float    @default(0)
  extraversion      Float    @default(0)
  agreeableness     Float    @default(0)
  neuroticism       Float    @default(0)
```

### 5.2 `VacancyApplication` — schema.prisma L399–403

```prisma
  // Big Five scores (0-100)
  openness           Float     @default(0)
  conscientiousness  Float     @default(0)
  extraversion       Float     @default(0)
  agreeableness      Float     @default(0)
  neuroticism        Float     @default(0)
```

> **Nota de líneas:** En el snapshot `aa771a9` referenciado por la planeación, las columnas de `VacancyApplication` vivían en L385–389. En el árbol actual de trabajo (HEAD, post-A-04.5 src/), las columnas A-04.5 (`formulaVersion`, `includedSections`, `excludedSections`, `excludedReasons` en `EvaluationResult` L286–292, y en `VacancyApplication` L425–428) desplazaron la sección Big Five de VacancyApplication a L399–403. `schema.prod.prisma` mantiene el mismo patrón (Big Five en L220–224 y L338–342).

`Float @default(0)` significa que **ausencia de dato = 0**, no `null`. El motor canónico A-04.5 (`aggregateBigFive()` L354–366) mitiga esto tratando `s === 0` como "dimensión sin respuestas" para no promediar ceros como datos reales — pero la columna física sigue siendo Float no-nullable.

No existe `formulaVersion` ni `evidenceStatus` propio de Personality. Solo el global `OVERALL-v1` (de A-04.5) cubre la fórmula técnica del agregado.

---

## 6. Todas las referencias frontend (grep verificado)

| Archivo | Línea | Contenido |
|---|---|---|
| `src/components/views/EvaluationView.tsx` | L396 | `case 'PSICOMETRICA': return 'Evalúa tu perfil de personalidad a través del modelo Big Five: apertura a la experiencia, responsabilidad, extraversión, amabilidad y neuroticismo.'` |
| `src/components/views/PublicEvaluationView.tsx` | L62–67 | `STEP_LABELS.psicometrica`: `label: 'Evaluación Psicométrica'`, `description: 'Test de personalidad Big Five — mide tu perfil de competencias y rasgos de personalidad.'` |
| `src/components/views/PublicEvaluationView.tsx` | L629 | `<p className="text-xs text-gray-500">Test de personalidad Big Five</p>` (resumen lateral) |
| `src/components/views/CandidateDetailView.tsx` | L76–82 | `bigFiveData` (radar): Apertura/Responsabilidad/Extraversión/Amabilidad/Neuroticismo con `result.openness … result.neuroticism` |
| `src/components/views/CandidateDetailView.tsx` | L95 | `scoresBarData[0]`: `{ name: 'Big Five', puntaje: Math.round((openness + conscientiousness + extraversion + agreeableness + (100 - neuroticism)) / 5) }` (re-invierte N para display) |
| `src/components/views/CandidateDetailView.tsx` | L398–420 | `<Card>` «Big Five - Personalidad»: `<RadarChart data={bigFiveData}>` + 5 `<ScoreBar>` por dimensión (Neuroticismo con `invert`) |
| `src/components/views/CompareView.tsx` | L96 | `dimensions` array incluye `openness, conscientiousness, extraversion, agreeableness, neuroticism` (comparador multi-candidato) |
| `src/components/views/CompareView.tsx` | L212–236 | `<Card>` «Big Five - Comparativo»: `<RadarChart data={radarData}>` con un `<Radar>` por candidato |
| `src/components/views/InvitationWelcomeView.tsx` | L288 | `<p>Perfil de personalidad Big Five — ~15 preguntas</p>` (preview en invitación) |
| `src/components/views/ConsentView.tsx` | L228 | `Respuestas a evaluaciones psicométricas (Big Five), psicológicas y de integridad` (lista de datos personales recolectados) |
| `src/components/views/ConsentView.tsx` | L285 | `Incluye evaluación <strong>psicométrica</strong> (Big Five), …` (descripción de Opción A — Evaluación Completa) |

Otros archivos que referencian Big Five en el plano de datos (no UI):

- `src/lib/store.ts` — tipos/estado de los 5 puntajes.
- `src/lib/privacy-notice.ts` — aviso de privacidad (menciona Big Five como dato sensible).
- `src/lib/retention.ts` — retención/anonimización de los 5 puntajes.
- `src/app/api/consent/route.ts` — registra consentimiento que cubre Big Five.
- `src/app/api/candidates/route.ts` — expone los 5 puntajes en listados.
- `src/app/api/results/route.ts` — usa los 5 puntajes en comparador (ver §8.4).

---

## 7. Dónde Personality alimenta `overallScore` (canon A-04.5)

El motor canónico `src/lib/overall-score.ts` (creado en A-04.5) es la ÚNICA autoridad técnica para `overallScore`. Es una función PURA y determinista: mismas entradas → mismo `overallScore`, sin importar el canal.

### 7.1 Tipos y constantes

- **L72:** `export const OVERALL_FORMULA_VERSION = 'OVERALL-v1' as const` — versión técnica de la fórmula (NO modelo validado, NO umbral, NO JobFit).
- **L78:** `export type InstrumentKind = 'BIG_FIVE' | 'PSYCHOLOGICAL' | 'KNOWLEDGE' | 'INTEGRITY'` — Big Five es uno de los 4 instrumentos.
- **L85–92:** `EvidenceStatus = VALID | LIMITED | INSUFFICIENT | INVALID | PENDING_REVIEW | NOT_APPROVED | null`.
- **L99–104:** `EXCLUDED_EVIDENCE_STATUSES = { INSUFFICIENT, INVALID, PENDING_REVIEW, NOT_APPROVED }`.

### 7.2 `getExclusionReason(inst)` — L173–187

Determina si un instrumento se excluye del overall ponderado:

```typescript
function getExclusionReason(inst: InstrumentInput): ExclusionReason | null {
  // INTEGRITY es aislado incondicionalmente (A-04.5 / A-04.2 OPTION B)
  if (inst.kind === 'INTEGRITY') {
    return 'INTEGRITY_NOT_APPROVED_FOR_OVERALL'
  }
  // Ausencia de evidencia NUNCA es score 0
  if (inst.score === null || !Number.isFinite(inst.score)) {
    return 'NO_DATA'
  }
  // Evidencia no aprobada NUNCA alimenta el global
  if (inst.evidenceStatus && EXCLUDED_EVIDENCE_STATUSES.has(inst.evidenceStatus)) {
    return inst.evidenceStatus as ExclusionReason
  }
  return null   // → incluido
}
```

**Estado actual:** `BIG_FIVE` NO está en la lista de exclusiones incondicionales. Solo se excluye si su `score === null` (NO_DATA) o si su `evidenceStatus` cae en `EXCLUDED_EVIDENCE_STATUSES`. Actualmente NINGÚN canal pasa `evidenceStatus` para Big Five (`buildCanonicalInput` L428 siempre lo deja `undefined`), así que **BIG_FIVE queda INCLUIDO siempre que tenga datos**.

### 7.3 `computeOverallFromIncluded(included)` — L215–243

Matriz de ramas históricas PRESERVADAS verbatim (A-04.5 no inventó pesos):

| `included.length` | Fórmula |
|---|---|
| 0 | 0 |
| 1 | `included[0].score` (rama histórica 2) |
| 2 | `(a + b) / 2` (split equitativo, rama histórica 3) |
| 3 (BF + PSY + KN) | `0.30·BF + 0.30·PSY + 0.40·KN` (rama histórica "3 present, no integrity") |

> Pesos efectivos de BIG_FIVE según cuántos instrumentos estén presentes:
> - 1 sección (solo BF) → peso **1.00**
> - 2 secciones (BF + otra) → peso **0.50**
> - 3 secciones (BF + PSY + KN) → peso **0.30**

### 7.4 `buildCanonicalInput(...)` — L411–433

Builder compartido (entry point de los 3 canales). Recibe los 5 puntajes Big Five persistidos + 5 puntajes psicológicos + `knowledgeScore` + `knowledgeEvidenceStatus` + `integrityScore`. Llama internamente a `aggregateBigFive()` (L354–366) que **reconstruye** el promedio Big Five adaptativo (solo dims con `s > 0`):

```typescript
export function aggregateBigFive(dims: BigFiveDims): number | null {
  const values = [dims.openness, dims.conscientiousness, dims.extraversion,
                  dims.agreeableness, dims.neuroticism]
  const present = values.filter((s) => Number.isFinite(s) && s > 0)
  return present.length > 0
    ? present.reduce((a, b) => a + b, 0) / present.length
    : null
}
```

Si ninguna dimensión tiene datos → retorna `null` → `instrument('BIG_FIVE', null)` → `getExclusionReason` lo excluye como `NO_DATA`. Si al menos una dimensión tiene `score > 0`, BIG_FIVE queda incluido con peso 0.30/0.50/1.00 según el caso.

### 7.5 Caller sites de `buildCanonicalInput` (los 3 canales)

| Canal | Archivo | Línea |
|---|---|---|
| Interno admin | `src/app/api/evaluations/route.ts` | L279 (`calculateScores`) + L1365 (`completeEvaluation` re-compute post-KN-canónico) |
| Público por paso | `src/app/api/public/apply/route.ts` | L165 (`calculateScores` por paso) |
| Público final | `src/app/api/public/apply/route.ts` | L566 (`calculateOverallScore` final) |
| Público video (post-A-04.5 fix) | `src/app/api/public/video/route.ts` | L114 (cuando `application.overallScore === 0`, fallback de cierre) |

En los 4 caller sites, los 5 puntajes Big Five (`openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism`) se pasan a `buildCanonicalInput`, lo que los hace llegar al motor `calculateCanonicalOverallScore` → BIG_FIVE participa del overall.

---

## 8. Todas las rutas afectadas

### 8.1 `/api/evaluations` (canal interno admin)

- `calculateScores()` L154–312 produce los 5 puntajes Big Five (ver §4.3) y los persiste en `EvaluationResult.openness…neuroticism`.
- `calculateCanonicalOverallScore(canonicalInput)` L285 computa el overall INCLUYENDO Big Five con peso 0.30/0.50/1.00.
- `completeEvaluation()` L1365+ re-computa el overall tras resolver KN canónico (bug pre-canónico A-04.4 corregido en A-04.5). Big Five sigue incluido en este re-cálculo.

### 8.2 `/api/public/apply` (canal público)

- `calculateScores()` L51–209 (por paso) produce los 5 puntajes Big Five (ver §4.4), los persiste en `VacancyApplication.openness…neuroticism`, e invoca `buildCanonicalInput` L165 + `calculateCanonicalOverallScore` L184 → Big Five incluido en el overall por paso.
- `calculateOverallScore(applicationId)` L523+ (al cerrar la última sección) lee los 5 puntajes persistidos, los pasa a `buildCanonicalInput` L566, y `calculateCanonicalOverallScore` L585 → Big Five incluido en el overall final.

### 8.3 `/api/public/video` (canal público, fallback de cierre)

- L99: `if (application.overallScore === 0)` — el endpoint solo re-cierra el scoring si el overall persistido es 0 (gate histórico preservado por A-04.5).
- L114–132: `buildCanonicalInput({openness, …, neuroticism}, …, knowledgeScore, knowledgeEvidenceStatus, integrityScore)` pasa los 5 puntajes Big Five al motor.
- L133: `calculateCanonicalOverallScore(canonicalInput)` → Big Five incluido.
- Antes de A-04.5, este endpoint usaba una fórmula divergente propia (F4: neuroticismo re-invertido, `/5` fijo, renormalización proporcional, sin Integrity). A-04.5 la ELIMINÓ. Big Five ya no es re-invertido aquí.

### 8.4 `/api/results` (lectura — comparador)

- L100, L104, L123, L127: define y mapea `scores.openness … scores.neuroticism` para cada `CompareCandidate`.
- L166, L170: hace lo mismo para `VacancyApplication` (público).
- L188, L192: calcula promedios agregados de los 5 puntajes Big Five para el comparativo.
- L337, L341: incluye los 5 puntajes en la respuesta de detalle de una vacante.

**Comportamiento actual:** el endpoint **lee** los 5 puntajes crudos y los sirve al frontend (`CompareView.tsx`) para el radar comparativo. No los modifica ni los usa para clasificar.

### 8.5 `/api/dashboard` (lectura — agregados por `recommendation`)

- L109, L113, L117: cuenta `VacancyApplication` por `recommendation = 'PERFIL_COMPLETO' | 'PERFIL_PARCIAL' | 'PENDIENTE'`.

**Comportamiento actual:** dashboard NO lee puntajes crudos de Big Five. Solo agrupa por `recommendation` (guidance de completitud), que a su vez depende de la PRESENCIA de datos (no del valor del puntaje). Esto significa que aislar Big Five del overall NO rompería los conteos del dashboard — pero sí cambiaría la clasificación `PERFIL_COMPLETO` vs `PERFIL_PARCIAL` para candidatos que actualmente cuentan Big Five como sección completa.

---

## 9. Tabla resumen (componente · ubicación · comportamiento actual · objetivo V1)

| # | Componente | Ubicación | Comportamiento actual | Objetivo V1 (A-05.3) |
|---|---|---|---|---|
| 1 | `BIG_FIVE_QUESTIONS` (canon) | `src/lib/generate-templates.ts` L10–21 | Lista los 10 reactivos servidos a TODA nueva posición | Retirar o aislar del flujo de generación (sin tocar textos si se conserva como histórico) |
| 2 | `HARDCODED_BIG_FIVE` (fallback) | `src/app/api/public/apply/route.ts` L215–226 | Fallback si la posición no tiene plantilla PSICOMETRICA | Retirar el fallback (o redirigir a una plantilla vacía / placeholder) |
| 3 | `generateTemplatesForPosition()` | `src/lib/generate-templates.ts` L184+ (PSICOMETRICA L218–243) | Crea plantilla PSICOMETRICA + 10 preguntas para TODA posición nueva | Dejar de crear la plantilla PSICOMETRICA por defecto (o crearla vacía/desactivada) |
| 4 | `calculateLikertScore` (2 copias) | `evaluations/route.ts` L141–144 · `apply/route.ts` L28–31 | `6 - v` si `reverseScored` (NEUROTICISM) | Sin cambio directo; se vuelve código muerto si los reactivos ya no se sirven (evaluar cleanup) |
| 5 | `normalizeBigFive` (2 copias) | `evaluations/route.ts` L146–148 · `apply/route.ts` L33–35 | `((avg-1)/4)·100` | Sin cambio directo; se vuelve código muerto (evaluar cleanup) |
| 6 | `calculateScores()` (evaluations) | `evaluations/route.ts` L154–312 | Produce 5 puntajes Big Five + los pasa al overall canónico | Dejar de producir los 5 puntajes (o dejar de pasarlos al overall) |
| 7 | `calculateScores()` (apply por paso) | `apply/route.ts` L51–209 | Igual que 6, persiste por paso | Igual que 6 |
| 8 | `calculateOverallScore()` (apply final) | `apply/route.ts` L523+ (buildCanonicalInput L566) | Lee 5 puntajes persistidos + pasa al canónico | Dejar de pasar Big Five al canónico |
| 9 | Re-compute evaluations L1365+ | `evaluations/route.ts` L1365–1384 | Re-computa overall post-KN-canónico INCLUYENDO Big Five | Dejar de incluir Big Five en el re-compute |
| 10 | Video fallback L99–133 | `public/video/route.ts` L99–133 | Pasa 5 puntajes al canónico en fallback | Dejar de pasar Big Five |
| 11 | `aggregateBigFive()` | `src/lib/overall-score.ts` L354–366 | Reconstruye avg Big Five desde dims persistidas (solo `s>0`) | Aislar (no llamar desde `buildCanonicalInput`) |
| 12 | `buildCanonicalInput()` | `src/lib/overall-score.ts` L411–433 | Pasa `bigFive: instrument('BIG_FIVE', aggregateBigFive(dims))` al motor | Pasar `bigFive: instrument('BIG_FIVE', null)` siempre (o marcar con `evidenceStatus: NOT_APPROVED`) |
| 13 | `getExclusionReason()` | `src/lib/overall-score.ts` L173–187 | Excluye INTEGRITY + NO_DATA + no aprobados; INCLUYE BIG_FIVE | Aislar BIG_FIVE incondicionalmente (análogo a INTEGRITY) o por `evidenceStatus` |
| 14 | `InstrumentKind` type | `src/lib/overall-score.ts` L78 | `'BIG_FIVE' \| 'PSYCHOLOGICAL' \| 'KNOWLEDGE' \| 'INTEGRITY'` | Conservar el tipo (legacy/A-04.5 isolation pattern) |
| 15 | Columnas `EvaluationResult` | `prisma/schema.prisma` L260–264 | `openness/conscientiousness/extraversion/agreeableness/neuroticism Float @default(0)` | Conservar (legado) — no borrar columnas en V1 |
| 16 | Columnas `VacancyApplication` | `prisma/schema.prisma` L399–403 | Igual que 15 | Conservar (legado) |
| 17 | `EvaluationView.tsx` L396 | Frontend interno | Describe sección como "modelo Big Five" | Retirar o cambiar texto |
| 18 | `PublicEvaluationView.tsx` L62–67, L629 | Frontend público | STEP_LABELS + resumen lateral mencionan Big Five | Retirar o reemplazar |
| 19 | `CandidateDetailView.tsx` L76–82, L95, L398–420 | Frontend admin detalle | Radar Big Five + ScoreBars + agregado display | Retirar visualización o marcar como "no disponible" |
| 20 | `CompareView.tsx` L96, L212–236 | Frontend admin comparativo | Radar comparativo "Big Five - Comparativo" | Retirar o marcar como "no disponible" |
| 21 | `InvitationWelcomeView.tsx` L288 | Frontend invitación pública | "Perfil de personalidad Big Five — ~15 preguntas" | Retirar o reemplazar |
| 22 | `ConsentView.tsx` L228, L285 | Frontend consent | Menciona Big Five como dato sensible recolectado | Actualizar aviso (con acuerdo a legal/revisión A-05.2 R3) |
| 23 | `/api/results` L100, L104, L123, L127, L166, L170, L188, L192, L337, L341 | API lectura comparador | Lee los 5 puntajes crudos para el comparativo | Dejar de exponer (o servir como null) |
| 24 | `/api/dashboard` L109, L113, L117 | API dashboard | Cuenta por `recommendation` (no puntajes crudos) | Sin cambio de API; revisar impacto en `recommendation` tras aislar BF del overall |
| 25 | `src/lib/privacy-notice.ts` y `src/lib/retention.ts` | Utilidades transversales | Mencionan Big Five como dato sensible y definen su retención/anonimización | Actualizar aviso y retención con acuerdo a legal |
| 26 | `src/app/api/consent/route.ts` | API consent | Registra consentimiento que cubre Big Five | Asegurar coherencia con aviso actualizado |

---

## 10. Nota: paralelo con A-04.5 (Integrity ya aislado)

A-04.5 ya aisló **Integrity** del `overallScore` con el MISMO patrón que A-05.3 aplicará a **Personality**:

| Aspecto | A-04.5 (Integrity) | A-05.3 (Personality) — PROPUESTA |
|---|---|---|
| Razón metodológica | Instrumento NO aprobado (A-04.2 OPTION B, GATE-1..10 no pasados) | Instrumento NO apto para V1 (A-05.2 OPTION E — ningún instrumento público con evidencia MX ESTABLISHED; el demo PROJECT-CREATED no tiene fuente identificable) |
| Mecanismo canónico | `getExclusionReason` retorna `INTEGRITY_NOT_APPROVED_FOR_OVERALL` incondicionalmente (L175–177) | Mismo patrón: `getExclusionReason` debería retornar algo análogo para `BIG_FIVE` (propuesta: `PERSONALITY_NOT_APPROVED_FOR_OVERALL` o `evidenceStatus: NOT_APPROVED`) |
| Datos persistidos | `integrityScore` Float @default(0) — columna CONSERVADA (legado) | `openness…neuroticism` Float @default(0) — columnas CONSERVADAS (legado) |
| Resultado | Integrity se computa y persiste pero NO alimenta `overallScore` ni `recommendation`-weighted | Personality debería dejar de alimentar `overallScore` (los puntajes pueden seguir computándose para auditoría si se conserva la sección) |
| Frontend | «orientative, never auto-filter» — labels conservados, sin umbral APTO/NO-APTO | Análogo: etiquetar como «demostración, sin validez» si la sección se conserva, o retirarla |

**Implicación:** la propuesta natural para A-05.3 es replicar el patrón de aislamiento de A-04.5 — agregar BIG_FIVE a la lista de exclusiones incondicionales en `getExclusionReason` (o marcar su `evidenceStatus` como `NOT_APPROVED` en `buildCanonicalInput`) — sin tocar columnas, sin recalcular legado, sin modificar `OVERALL-v1`. Esta decisión final corresponde a pasos posteriores de A-05.3; este documento solo fija el BEFORE.

---

## 11. Prueba de no-modificación

- `git status` al cierre: solo `evidence-a05-3/01-before.md` (nuevo) y `worklog.md` (entrada appended).
- Sin cambios en `src/`, `prisma/`, `scripts/`, `public/`, ni en expedientes previos.
- Sin migraciones, sin `db push`, sin escrituras de datos.
- DOCUMENTATION-ONLY respetado.
