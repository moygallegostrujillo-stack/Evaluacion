# A-04.3 — EXPEDIENTE MAESTRO / MASTER DOSSIER

# EVALUHR — A-04.3 — AUDITORÍA Y SEPARACIÓN DE overallScore
# SOLO AUDITORÍA Y DISEÑO — NO MODIFICAR IMPLEMENTACIÓN (cumplido)

Fecha: 2026-09-11 (America/Mexico_City). Alcance: auditoría read-only del
comportamiento real de `overallScore` + diseño conceptual de separación.

Restricciones cumplidas: NO se modificó fórmula, pesos, scoring, IPIP,
Knowledge, Integrity, Competencies, JobFit, recomendaciones, frontend,
contrato ni aviso. Verificación: §19 (checklist) + git status limpio en
src/ y prisma/.

Método: lectura directa de los archivos de scoring (Read con líneas exactas),
Grep sistemático (`overallScore`, `?? 0`, `|| 0`, `Number(`, `parseFloat(`,
`PERFIL_`, `.sort(`), y contraste con expedientes en disco (A-03.4, A-03.5,
A-04.1, A-04.2, AUDITORIA_EVALUHR.md).

---

## 1. FÓRMULA ACTUAL (PASO 1–2)

### 1.1 Localización de implementaciones (hay CUATRO, no una)

| # | Archivo | Función | Líneas | Rol |
|---|---|---|---|---|
| 1 | src/app/api/evaluations/route.ts | `calculateScores()` | 145–339 (invocada en 1350) | Flujo interno auth; override canónico de knowledge en 1366–1393 |
| 2 | src/app/api/public/apply/route.ts | `calculateScores()` (por paso) | 43–232 | Step-level; persiste scores por sección |
| 3 | src/app/api/public/apply/route.ts | `calculateOverallScore()` | 547–670 (invocada en 1626) | Agregado final del flujo público, lee fila DB; orden persist→compute corregido por A-03.4 (comentario 1611–1618) |
| 4 | src/app/api/public/video/route.ts | inline en handler | 83–175 (gate: `overallScore === 0`), write en 170, puente a EvaluationResult en 247–274 | PASO DE VIDEO — SOBREESCRIBE overallScore con SU PROPIA fórmula |

Otros sitios con lógica de score global: `src/app/api/results/route.ts`
(agregados para dashboard: L187, L198), `src/lib/retention.ts` (anonimización:
L209–229), `src/app/api/consent/route.ts` (retiro: reset de sensibles, overall
stale — comentario L413).

Búsqueda de `calculateOverallScore|overall score|PERFIL_COMPLETO|PERFIL_PARCIAL`
confirma: la recomendación se produce SOLO en las 3 implementaciones
(L310–317 interno; L633–641 público; L123–132 video) y se CONSUME en
admin-db.ts L229/232 (conteos) y vistas (DashboardView 306–320,
CandidatesView 112–233, VacancyManagementView 111–112/804, CompareView
177–182, CandidateDetailView 105–122).

### 1.2 Fórmula matemática reconstruida (flujo interno = referencia)

Variables (todas normalizadas a 0–100):
- `BF` = promedio de dimensiones Big Five CON respuestas;
  `normalizeBigFive(avg) = ((avg−1)/4)·100`, recorte [0,100], redondeo 2 decimales
  (L137–139, L183). Ítems LIKERT 1–5 con `reverseScored → 6−v`, recorte [1,5]
  (L132–135).
- `PSY` = ídem con `normalizePsychological` (L141–143); STRESS invertido al
  final: `normalized = 100 − normalized` (L206–208).
- `INT` = promedio de 4 categorías INTEGRITY_* con respuestas (L234–253).
- `KN` = % de acertos sobre respuestas KNOWLEDGE/MULTIPLE_CHOICE (L220–232);
  canónico lo REEMPLAZA (L1382: `scores.knowledgeScore = canonical.knowledgeScore`).

Peso por rama (L264–304) — ver §4. Redondeos: categorías 2 decimales;
overall `Math.round(x·100)/100` (L332). KN interno redondea a ENTERO (L231);
KN público a 2 decimales (L127) — inconsistencia menor.

Defaults de ítem: `numericValue || parseInt(value) || 3` — un valor faltante
se convierte en LIKERT 3 (punto medio), NO en 0 (L162 interno; L56 público).

### 1.3 Fórmula del flujo público final (L547–670) — mismas ramas, detección distinta

- `hasBigFiveData = includePsicometrica && (ALGUNA dim > 0)` (L558–562)
- `hasIntegrityData = (includeIntegridad ?? true) && integrityScore > 0` (L568)
- `hasKnowledgeData = knowledgeScore !== null` (L569)
- promedios adaptativos solo con dims > 0 (L573–580); `avgIntegrity = integrityScore || 0` (L583)

### 1.4 Fórmula del paso de video (L83–131) — DIVERGENTE

- Gate: solo si `application.overallScore === 0`.
- `hasKnowledge = knowledgeScore !== null && knowledgeScore > 0` (L89) — un
  0.00 real (todo mal) cuenta como AUSENTE (contradice a la #3, que usa `!== null`).
- `psicometricaAvg = (100 − neuroticism + O + C + E + A) / 5` (L92–97):
  RE-INVIerte el neuroticismo (ya invertido por ítem: doble inversión) y
  divide ENTRE 5 FIJO aunque haya dimensiones en 0 (contradice el promedio
  adaptativo de la #3).
- Pesos 0.30/0.30/0.40 con renormalización PROPORCIONAL
  (`weight/totalWeight`, L119–120).
- **Integridad NUNCA participa**; guidance PERFIL_COMPLETO = BF+PSY+KN (sin INT).
- Escribe `updateData.overallScore` (L170) → SOBREESCRIBE la fila, y en el
  puente a EvaluationResult usa `(updateData.overallScore as number) || application.overallScore || 0` (L247).

## 2. VARIABLES (resumen operativo)

| Variable | Escala | Null posible | Default | Fuente |
|---|---|---|---|---|
| BF dims (5) | 0–100 | No (0 si sin respuestas) | 0 | L176–192 |
| PSY dims (5) | 0–100 | No (0) | 0 | L200–215 |
| INT categorías (4) | 0–100 | No (0) | 0 | L239–250 |
| knowledgeScore | 0–100 | **SÍ** (null canónico/legacy sin respuestas) | — | L221–232; canonical L823–839 |
| integrityScore (persistido) | 0–100 | **No** (Float @default(0) en schema L277) | 0 | L331 |
| overallScore | 0–100 | No (Float @default(0), schema L280) | 0 | L257–304 |
| recommendation | enum | No | 'PENDIENTE' | L310–317 |

Asimetría clave del schema: Knowledge es nullable (permite INSUFFICIENT=null);
Integridad NO es nullable (0 = sobrecarga semántica de "sin datos" y "peor
puntaje posible").

## 3. INSTRUMENTOS PARTICIPANTES (PASO 3)

| Instrumento | participant | Condición |
|---|---|---|
| Psicológica (PSICOLOGICA) | **YES** | Si hay respuestas STRESS/EMPATHY/ADAPTABILITY/LEADERSHIP/TEAMWORK |
| Personalidad (PSICOMETRICA Big Five demo) | **YES** | Si hay respuestas O/C/E/A/N |
| IPIP-50-MX | **NO** | **No existe en el código** (grep 'IPIP' en src/ = 0). Ver §9 |
| Conocimientos (canónico versionado) | **YES** | Si knowledgeScore ≠ null (VALID/LIMITED); INSUFFICIENT=null → NO |
| Conocimientos (legado) | **YES** | Filas LEGACY; con comportamientos divergentes de clave (§10) |
| Integridad (INTEGRIDAD) | **YES** | Interno: ≥1 respuesta INTEGRITY_*; público: includeIntegridad && integrityScore>0; video: **NUNCA** |
| Overlay de video | **PARTIAL** | No es instrumento: SOBREESCRIBE overallScore (§1.4) |

## 4. PESOS (PASO 4 — documentación, sin juicios de valor)

| instrument | weight | source | purpose |
|---|---|---|---|
| Big Five | 0.25 (4 secc) / 0.30 (sin KN) / 0.30 (legacy sin INT) / 0.50÷k behaviorales / 0.50 en 2 secc / 1.00 sola | evaluations/route.ts L282/285/288/291–296/272–279/266–271 | "peso conductual" — sin justificación metodológica documentada |
| Psicológica | ídem Big Five | ídem | ídem |
| Integridad | 0.15 (4 secc) / 0.40 (sin KN) / 0.50÷k (efectivo) / 0.50 (2 secc) / 1.00 sola / 0 en video | L282/285/291–296/272–279/266–271 | "orientative, never auto-filter" (comentario) — PERO el peso real entra al overall |
| Knowledge canónico | 0.35 (4 secc) / 0.40 (3 secc) / 0.50 (KN+behavioral) / 1.00 sola | L282/285,288/296/268 | criterio objetivo de puesto |
| Video overlay | 0.30 / 0.30 / 0.40 proporcional (sin INT) | public/video/route.ts L110–120 | recalcular si el flujo principal no lo hizo |

Propósito declarado en código: "adaptive weighting based on which sections
have data" (comentario L255–256) — corrección de bug histórico (secciones
ausentes puntuaban 0 y arrastraban el promedio). No hay documento
metodológico de pesos (contradice R6).

## 5. INSUFFICIENT (PASO 5)

Estado consultado: KnowledgeResult INSUFFICIENT + IntegrityResult INSUFFICIENT
(hipotético) + Personality VALID + Psychological VALID.

- **Knowledge canónico**: `keyedAnswered === 0 → knowledgeScore = null` con
  `evidenceStatus = 'INSUFFICIENT'` y reasonCode (KNOWLEDGE_KEY_MISSING /
  NO_KEYED_EVIDENCE); ítems sin clave → `notScorable`, EXCLUIDOS, "never
  scored as 0" (knowledge-canonical.ts L812–815, L827–839).
  **INSUFFICIENT → null → excluido → renormalizado** (escenario B: 61.00).
  El KnowledgeResult conserva el estado como registro de evidencia SEPARADO
  (writeKnowledgeResult L854+; comentarios L1456–1458 y public L1486).
- **IntegrityResult INSUFFICIENT**: **EL ESTADO NO EXISTE**. Ni el schema ni
  el scoring definen evidencia-status para Integridad. Ausencia → respuestas
  0/persistido 0 → trato por heurística (§8). En el escenario propuesto, el
  equivalente real es "sección sin respuestas" → excluida → renormalización
  (escenario C1/C2), con el riesgo de confusión 0.00=ausente (C2 vs C3).
- **Personality/Psychological**: no tienen INSUFFICIENT; solo presencia/ausencia
  de respuestas por categoría.

## 6. NULL (PASO 6 — inventario de conversiones null→0 y afines)

| Sitio | Expresión | Efecto |
|---|---|---|
| evaluations/route.ts L162 | `resp.numericValue \|\| parseInt(resp.value,10) \|\| 3` | null→**3** (default neutro de ítem) |
| public/apply/route.ts L56 | ídem | ídem |
| evaluations/route.ts L186-188/212-214/247-249 | `scores[cat] \|\| []` y `= 0` en else | categoría sin respuestas → 0 (display) pero excluida del promedio |
| evaluations/route.ts L264-265 | `overallScore = 0` | 0 secciones → overall 0 |
| evaluations/route.ts L320–329 | `bigFiveScores['X'] \|\| 0` (×10) | blindaje display (el else ya puso 0) |
| evaluations/route.ts L331 | `integrityScore: hasIntegrityData ? round : 0` | **null→0 en frontera de persistencia** (sin datos se guarda 0) |
| public/apply/route.ts L122 | `resp.correctAnswer ?? 0` | **null→0 con efecto de SCORING**: sin clave, la opción 0 cuenta como correcta |
| public/apply/route.ts L524–526 | `correctIdx = vacancyQ ?? systemQ ?? 0` | ídem en step 4 legado |
| public/apply/route.ts L583 | `application.integrityScore \|\| 0` | null→0 (defensivo; schema no permite null) |
| public/apply/route.ts L1716–1717 | `integrityScore \|\| 0`, `overallScore \|\| 0` | null→0 en puente a EvaluationResult |
| public/video/route.ts L89 | `!== null && > 0` | 0.00 real tratado como AUSENTE |
| public/video/route.ts L247 | `(...) \|\| application.overallScore \|\| 0` | doble fallback 0 |
| results/route.ts L198 | `(r.scores.knowledgeScore \|\| 0)` | null→0 en promedio agregado de dashboard (sesga la media) |
| retention.ts L209–229 | set 0 / null | zeroing INTENCIONAL por anonimización (purge) — legítimo, documentado |
| consent/route.ts L399–420 | reset sensibles a 0 | retiro de consentimiento; overall queda STALE (comentario L413) |

Nunca se encontró `parseFloat(` ni `Number(` en rutas de scoring (solo
`Number.isFinite` en canonical L818 y `(latest?.x ?? 0) + 1` de versionado).

## 7. RENORMALIZACIÓN (PASO 7)

**SÍ existe renormalización**, pero NO es "redistribución proporcional de
pesos restantes": es una **matriz de ramas** (case-based re-weighting):

- 0 secciones → 0. 1 sección → 100%. 2 secciones → 50/50.
- 4 secciones → 25/25/15/35. BF+PSY+INT → 30/30/40. BF+PSY+KN → 30/30/40.
- KN + k behaviorales → 50/50 (KN 50%, media simple de behaviorales 50%).
- Fórmula del video → renormalización proporcional 0.30/0.30/0.40.

Efectos medibles (§escenarios): al faltar KN, INT pasa 0.15→0.40 (×2.67);
al faltar PSY (H), KN llega a 0.50 efectivo. Un solo instrumento presente =
100% del "global". En el ejemplo conceptual del spec (Psicología 60%,
Conocimiento 40%, Integridad missing): el sistema NO reparte 60/100; salta a
la rama BF+PSY+KN (30/30/40) o, si solo queda 1 sección, esa sección = 100%.

Renormalización DENTRO de sección (público #3): promedia solo dims > 0
(L574–580). Video: divide /5 fijo (incluye 0s). Contradicción entre flujos.

## 8. INTEGRIDAD (PASO 8 — demostración del comportamiento real)

- **Origen**: respuestas LIKERT a 10 ítems `INTEGRITY_*` de la plantilla
  "Evaluación de Integridad" que se genera SIEMPRE para cada posición
  (generate-templates.ts L334–346; fallback público HARDCODED_INTEGRIDAD
  L266–270, activado por `Vacancy.includeIntegridad @default(true)`, schema L323).
- **Score**: promedio normalizado 0–100 de 4 categorías con respuestas
  (evaluations L234–253); se persiste en `EvaluationResult.integrityScore` /
  `VacancyApplication.integrityScore` (Float @default(0)).
- **Default**: 0 (sin datos se persiste 0 — L331; schema L277).
- **Peso**: 0.15 con 4 secciones; **0.40 sin Knowledge**; 0.50÷k con KN;
  0.50 en pares; 1.00 solo; **0 en la ruta de video**.
- **Condiciones de participación**: interno — basta 1 respuesta INTEGRITY_*
  (L253, L261); público — `includeIntegridad && integrityScore > 0` (L568),
  lo que EXCLUYE un 0.00 real; video — nunca.
- **Guardarraíles existentes**: comentarios "orientative, never as
  auto-filter/disqualification (LFPDPPP Art. 37 Bis)" (L234/130; L393/724);
  guidance solo strengths (≥70 "integridad sobresaliente") o areasToExplore
  (<40 "explorar en entrevista"); consent-gate KNOWLEDGE_ONLY no la ve
  (EvaluationView L58–66 + enforcement servidor L921–950); purga al retiro.
- **DEMOSTRACIÓN**: con los datos de §escenarios, Integridad determina
  8.25/68.75 pts (12%) en A, 22/61 (36%) en B, y hasta el 100% del overall si
  es la única sección (C/F públicos con includeIntegridad). El flag
  "orientative" NO se cumple a nivel de fórmula: el peso es real.
- NO se corrigió nada (regla de fase).

## 9. IPIP (PASO 9)

- **IPIP-50-MX NO entra en overallScore porque NO EXISTE en el código**:
  grep `IPIP` en src/ = 0 coincidencias. El instrumento de personalidad que
  participa es `BIG_FIVE_QUESTIONS` (10 ítems, 2/dimensión) redactados por el
  desarrollador — AUDITORIA_EVALUHR.md L17/L111: "sin citar IPIP, NEO-PI-R,
  BFI… NO IMPLEMENTADO (referencias a validación)".
- Coincidencia con A-01.2: **NO VERIFICABLE contra código** — el expediente
  A-01.2 no está disponible en el disco de trabajo (ver §15 y limitación).
  Lo que el código permite afirmar: ningún ítem etiquetado ni versionado como
  "IPIP-50-MX" participa ni puede participar en el overall actual.

## 10. KNOWLEDGE (PASO 10)

- **Canónico (versionado)**: `knowledgeScore = null` + INSUFFICIENT cuando
  `keyedAnswered === 0` (canonical L827–830). En ambos flujos ese null
  EXCLUYE la sección del overall → renormalización (interno L1382+
  sectionsWithData L262; público `hasKnowledgeData = !== null` L569).
  VALID/LIMITED alimentan el overall sin cambios de fórmula (comentario
  L1366–1374: "it feeds overallScore exactly as before (no formula change)").
  El registro de evidencia (KnowledgeResult con evidenceStatus/reasonCode/
  scoringVersion PUB-KS-v1) queda SEPARADO del global (L1456–1458; public L1486).
- **Legado (filas sin administración)**: clave faltante → interno SIN crédito
  (L227: exige `correctAnswer !== null`) → un INSUFFICIENT-de-facto se convierte
  en **0% real** que SÍ participa; público `?? 0` (L122/L526) → la opción 0
  cuenta como correcta → **score inflado**. Ambos contradicen la semántica
  canónica INSUFFICIENT≠0 (A-03.5) — filas LEGACY no se migran por diseño
  (A-03.4: stamp LEGACY L1515–1521).

## 11. RECOMMENDATION (PASO 11)

- **overallScore → recommendation: NO.** La recomendación/guidance NO usa
  umbrales de score. Regla exacta (interno L310–317; público L633–641):
  - 0 secciones con datos → `PENDIENTE`
  - BF+PSY+INT+KN con datos → `PERFIL_COMPLETO` (video: BF+PSY+KN, sin INT)
  - resto → `PERFIL_PARCIAL`
- No existe ninguna regla `score > X → PERFIL_COMPLETO` en el código
  (grep PERFIL_ — solo produce/consume el enum). El campo se mantiene por
  compatibilidad de DB ("value is now guidance", L333/L667).
- Consumo: filtros y conteos de UI (CandidatesView L225–233; admin-db L229–232);
  **no se encontró ningún ordenamiento `.sort()` por overallScore ni por
  recommendation en vistas ni en results/candidates routes** (grep .sort( = 0
  en esos archivos).

## 12. SEPARACIÓN CONCEPTUAL (PASO 12)

- **InstrumentResult**: registro de evidencia de UN instrumento — puntuación +
  condiciones (versión, estado de evidencia, razón). Ejemplo existente:
  `KnowledgeResult` (knowledgeScore nullable + evidenceStatus + reasonCode +
  scoringVersion). Propiedad esencial: sabe CUÁNDO NO sabe (null/INSUFFICIENT).
- **OverallScore**: número compuesto que PROMEDIA InstrumentResults con pesos
  fijos en código y renormalización por presencia de datos. NO conserva
  procedencia: un 68.75 no dice qué instrumentos ni con qué pesos ni con qué
  estados de evidencia lo produjeron. Mezcla instrumentos con estatus
  metodológico desigual (KN canónico validado-patrón vs INT sin validación).
- **JobFit**: NO EXISTE como entidad en el código (grep = 0; solo aparece en
  documentación). Conceptualmente sería el AJUSTE candidato↔puesto: requiere
  criterios por puesto, pesos justificados y evidencia de validez — ninguna
  de las tres cosas existe. El overallScore actual se muestra como
  "Puntuación general" en UI (CandidateDetailView L229; VacancyManagementView
  L804) y es el candidato natural a ser CONFUNDIDO con JobFit (riesgo R3).
  No son equivalentes: InstrumentResult = evidencia; OverallScore = agregado
  opaco; JobFit = decisión de ajuste (inexistente y que NO debe derivarse
  automáticamente del agregado).

## 13. RIESGOS (PASO 13)

| Riesgo | Estado | Evidencia |
|---|---|---|
| R1 INSUFFICIENT tratado como 0 | **PARCIAL** | Knowledge canónico: OK (null). Violaciones: Integridad (default 0, sin estado), video (KN 0.00=ausente), legado interno (sin clave→0%), results L198 (null→0 en media) |
| R2 Integridad no validada en overall | **CONFIRMADO** | Peso real 0.15/0.40/0.50/1.00 (§8); contradice A-04.1 C4 y A-04.2 GATE-10 |
| R3 score global usado como JobFit | **CONFIRMADO como riesgo de semántica** | JobFit no existe; overall se exhibe como puntuación principal; mitigante: no hay sort/filter automático por score (solo filtro por recommendation) |
| R4 score global convertido en decisión | **MITIGADO PARCIALMENTE** | recommendation = guidance sin umbrales; disclaimers LFPDPPP Art. 37 Bis (L341–348, L672–679); riesgo residual: el número visible puede operar como decisión de facto del RH |
| R5 renormalización oculta | **CONFIRMADO** | Matriz de ramas no publicada; INT 0.15→0.40 sin aviso; variaciones ±10 pts por datos faltantes (escenarios) |
| R6 pesos no documentados | **CONFIRMADO** | Solo comentarios de código; sin expediente metodológico de pesos |
| R7 diferencias interno vs público | **CONFIRMADO — PEOR DE LO ESPERADO** | 4 fórmulas (interno, público-final, público-step, video); claves `?? 0` vs estricto; redondeo KN entero vs 2 dec; video re-invierte neuroticismo, /5 fijo, sin INT, y PUEDE SOBREESCRIBIR el overall |

## 14. ESCENARIOS (PASO 14)

Detalle computado en `overall-score-scenarios.md` (valores de referencia
BF=70, PSY=60, INT=55, KN=80): A=68.75 COMPLETO; B=61.00; C1=71.00; C2=71.00;
C3=60.50 (con KN) / 39.00 (sin KN); D=70.00; E=60.00; F=80.00; G=65.00;
H=71.25 — todos PERFIL_PARCIAL salvo A. Conclusiones: el mismo candidato
varía ±10 pts por renormalización; Integridad puede llegar a 100% del overall;
la ruta de video rompe la consistencia.

## 15. CONTRADICCIONES (PASO 15)

Contra las reglas persistidas en el proyecto:

| Antecedente | Regla | Estado actual | Contradicción |
|---|---|---|---|
| A-03.5 (en código + evidence-a03-5) | INSUFFICIENT ≠ 0; evidencia separada con evidenceStatus | KN canónico lo cumple; Integridad no tiene estado; legado interno convierte falta de clave en 0% | SÍ |
| A-03.4 (stamp LEGACY) | filas legadas sin migrar | legado sigue activo con scoring divergente (`?? 0` público vs estricto interno) | SÍ |
| A-04.1 (11-recommendation, C4) | "indicador separado, sin peso automático en overallScore/JobFit" | Integridad PESA 0.15–1.00 en el overall actual | SÍ |
| A-04.2 (GATE-10) | Integridad NO entra en JobFit sin GATE-1..10 | ya entra (documentada como deuda técnica en A-04.2 §7) | SÍ |
| Flags "orientative, never auto-filter" | orientativo, nunca filtro | el flag gobierna ítems/guidance, NO la fórmula: el peso es real | SÍ |
| AUDITORIA_EVALUHR.md (L17/L111) | ítems sin instrumento validado citado | ítems Big Five/INT propios de demo sin validación, ponderados en el global | SÍ |
| **A-02.2–A-02.5 y A-01.2** | — | **LIMITACIÓN: los expedientes de esas fases NO están disponibles en el disco de trabajo** (no existen carpetas evidence-a01*/a02*; el chain consta en evidence-a03-4/00-master-dossier.md L6). La comparación se restringe a las reglas verificables en código y en expedientes A-03.x/A-04.x. NO se inventan sus contenidos. | N/A |

## 16. OPCIONES DE SOLUCIÓN (PASO 16 — PROPUESTA, SIN IMPLEMENTAR)

| Opción | Ventaja | Riesgo | Impacto | Recomendación |
|---|---|---|---|---|
| **A — mantener overallScore actual temporalmente** | Cero esfuerzo; cero regresiones | Deuda documentada sigue viva (R2/R5/R6/R7); contradicción normativa persiste | Ninguno inmediato | **Aceptable SOLO como puente corto**, con expediente publicado (pesos + renormalización) y etiqueta "no usar como JobFit" en UI de RH |
| **B — suspender Integridad del overallScore** | Elimina R2 directamente; alinea con A-04.1 C4 y A-04.2 GATE-10 | Cambio de fórmula altera scores históricos/usuarios; requiere migración o re-cálculo explícito | Medio: recalculo de overall existentes + pruebas | **PASO INMEDIATO recomendado** cuando se autorice implementación (primera iteración de C) |
| **C — separar overallScore de instrumentos no aprobados** (whitelist: solo InstrumentResults con evidenceStatus=VALID y aprobación metodológica/legal entran) | Resuelve R1/R2/R5/R6 estructuralmente; extiende el patrón canónico de Knowledge a todos los instrumentos | Mayor complejidad: evidence-status para BF/PSY/INT; gobernanza de aprobación | Alto (rediseño de scoring) — fase propia con pruebas de regresión | **ESTADO OBJETIVO recomendado** (C incluye a B como primer incremento) |
| **D — eliminar overallScore posteriormente** | Elimina de raíz la confusión con JobFit (R3/R4); fuerza decisiones por instrumento + revisión humana | Pérdida de métrica única que el RH ya usa; requiere alternativa (reporte por instrumento) | Alto en producto/UX | **Diferida**: evaluar cuando exista diseño de JobFit real (post-Gates A-04.2); mientras tanto, C mitiga |

Recomendación integrada (propuesta, NO implementada): ruta **A (puente
documentado) → B → C**, con D sujeta a la decisión futura de JobFit. Toda
transición exige las pruebas de regresión de A-04.2 PASO 12 (consent-gate,
purga, determinismo, versionado, no-veto).

## 17. GOBERNANZA (PASO 17 — regla PROPUESTA, sin implementar)

**Regla propuesta — "No-evidencia, no-decisión-global":**

> Un instrumento cuyo estado de evidencia sea `INSUFFICIENT`, `INVALID` o
> `PENDING_REVIEW` NO puede alimentar automáticamente una decisión global
> (overallScore, JobFit, ranking, veto ni recommendation).
>
> Especificación mínima:
> 1. Toda contribución al global exige `evidenceStatus = VALID` en el
>    InstrumentResult correspondiente (patrón KnowledgeResult).
> 2. `INSUFFICIENT` → contribución NULL y EXCLUIDA (nunca 0); la renormalización
>    resultante debe ser EXPLÍCITA, versionada y visible en el reporte.
> 3. `INVALID` → excluida Y señalizada (auditoría; no silencio).
> 4. `PENDING_REVIEW` → excluida hasta revisión humana registrada (la IA no
>    aprueba — gobernanza A-04.2 §13).
> 5. Los pesos del global deben existir en un expediente metodológico
>    versionado (cierra R6), no solo en comentarios de código.
> 6. Instrumentos sensibles (Integridad) requieren además GATE-1..10 (A-04.2)
>    antes de cualquier peso.

Estado: PROPUESTA. No implementada (regla de fase).

## 18. CONCLUSIÓN

1. El overallScore actual es UN AGREGADO OPACO alimentado por CUATRO fórmulas
   distintas (interno, público-final, público-step, video) con renormalización
   por ramas no publicada.
2. **Integridad SÍ participa hoy** (0.15–1.00 según rama) pese a carecer de
   validación y de estado de evidencia — contradice A-04.1/A-04.2 y su propio
   flag "orientative".
3. **IPIP-50-MX no existe** en el código; participa un Big Five demo de 10
   ítems sin citación ni validación.
4. **Knowledge canónico es el único instrumento con semántica de evidencia
   correcta** (INSUFFICIENT→null→excluido→renormalizado, registro separado);
   el legado y el overlay de video la violan.
5. JobFit NO existe en código; el riesgo R3/R4 es de SEMÁNTICA (que el número
   agregado opere como ajuste/decisión de facto), mitigado parcialmente por
   guidance sin umbrales y ausencia de ordenamientos automáticos.
6. La ruta recomendada (propuesta sin implementar): A documentado → B
   (suspender Integridad) → C (whitelist de evidencia VALID) → D (evaluar
   eliminación del global cuando exista JobFit real).

## 19. AUDITORÍA FINAL (PASO 19)

- [x] fórmula actual localizada (4 implementaciones con archivo:línea)
- [x] pesos localizados (tabla §4)
- [x] instrumentos identificados (§3: BF, PSY, KN canónico/legado, INT, video overlay; IPIP-50-MX NO)
- [x] Integrity participación comprobada (§8 — YES condicionada, demostrada)
- [x] IPIP participación comprobada (§9 — NOT PRESENT en código)
- [x] Knowledge participación comprobada (§10 — canónico + legado)
- [x] null behavior documentado (§6 — inventario con sitios)
- [x] `?? 0` / `|| 0` / `Number(` / `parseFloat(` auditados (§6; parseFloat/Number ausentes del scoring)
- [x] renormalización auditada (§7 — matriz de ramas + efectos cuantificados)
- [x] recommendation auditada (§11 — sin umbrales de score; solo presencia de datos)
- [x] JobFit separado (§12 — no existe entidad; separación conceptual definida)
- [x] contradicciones documentadas (§15 — 6 confirmadas; A-01.2/A-02.x con limitación honesta de fuentes)
- [x] no se modificó código (git status limpio en src/ y prisma/; solo lectura)

## 20. ÍNDICE DEL EXPEDIENTE A-04.3

| Archivo | Contenido | PASO |
|---|---|---|
| 00-master-dossier.md | Este documento (18 secciones + checklist) | 1–13, 15–17, 19 |
| overall-score-audit.csv | Matriz por instrumento (8 columnas) | 18 |
| overall-score-scenarios.md | Escenarios A–H computados | 14 |
