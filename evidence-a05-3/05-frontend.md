# A-05.3 — 05 · FRONTEND (PASO 6)

## 1. Cambios realizados

Se eliminó la exposición de Personality como instrumento activo de V1 en 6 vistas. **NO se borraron componentes históricos** — los datos Big Five legacy siguen visibles cuando existen.

## 2. Vistas modificadas

### 2.1 EvaluationView.tsx (L396)

**Antes**: `Evalúa tu perfil de personalidad a través del modelo Big Five: apertura a la experiencia, responsabilidad, extraversión, amabilidad y neuroticismo.`

**Después**: `Indicador experimental de personalidad (no disponible como instrumento formal en V1). Las respuestas históricas se conservan con fines de trazabilidad.`

### 2.2 PublicEvaluationView.tsx (L67, L629)

**L67 STEP_LABEL description** — Antes: `Test de personalidad Big Five — mide tu perfil de competencias y rasgos de personalidad.` → Después: `Indicador experimental de personalidad (no disponible como instrumento formal en V1).`

**L629 sidebar** — Antes: `Test de personalidad Big Five` → Después: `Indicador experimental (no disponible en V1)`

### 2.3 CandidateDetailView.tsx (L84-90, L95, L409-441)

- **L84-90**: Añadido `hasBigFiveData` check (true si cualquier score BF > 0).
- **L95**: `scoresBarData` Big Five entry ahora condicional: solo se muestra si `hasBigFiveData` (legacy); etiqueta cambiada a "Big Five (legado)".
- **L409-441**: Big Five radar ahora condicional:
  - Si `hasBigFiveData`: muestra radar + ScoreBars con título "Personalidad (legado)".
  - Si no: muestra tarjeta neutra con icono Brain + texto "Evaluación de personalidad: no disponible en V1 / Indicador experimental retirado de la versión actual."

### 2.4 CompareView.tsx (L9, L142-148, L220-262)

- **L9**: Añadido `Brain` a imports de lucide-react.
- **L142-148**: Añadido `hasAnyBigFiveData` check (true si algún candidato tiene BF data).
- **L220-262**: Big Five radar ahora condicional:
  - Si `hasAnyBigFiveData`: muestra radar con título "Personalidad - Comparativo (legado)".
  - Si no: muestra tarjeta neutra "Evaluación de personalidad: no disponible en V1".

### 2.5 InvitationWelcomeView.tsx (L288)

**Antes**: `Perfil de personalidad Big Five — ~15 preguntas`

**Después**: `Indicador experimental de personalidad — no disponible como instrumento formal en V1`

### 2.6 ConsentView.tsx (L228, L285)

**L228** — Antes: `Respuestas a evaluaciones psicométricas (Big Five)` → Después: `Respuestas a evaluaciones psicométricas (indicador experimental de personalidad, no disponible como instrumento formal en V1)`

**L285** — Antes: `Incluye evaluación psicométrica (Big Five)` → Después: `Incluye evaluación psicométrica (indicador experimental de personalidad, no disponible como instrumento formal en V1)`

## 3. Reglas respetadas

- ✅ NO se usaron: "validado", "científico", "predictivo", "perfil ideal".
- ✅ NO se borraron componentes históricos (radar legacy se conserva si hay data).
- ✅ Queda claro para V1: "Evaluación de personalidad: no disponible en V1".
- ✅ Lenguaje neutral y honesto.

## 4. Dashboard

DashboardView no muestra puntajes crudos de Big Five (solo conteos por `recommendation`). No requiere cambios.
