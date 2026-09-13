# A-04.5 — 01 · AUDITORÍA BEFORE (PASO 1)

**Fase:** A-04.5 — Normalización de `overallScore`.
**Paso:** 1 de la fase (PASO 1 — captura del estado BEFORE).
**Fecha:** 2026-09-11 (America/Mexico_City).
**Base del repo:** `main@b5dcfb6` (HEAD al cierre de A-04.4), working tree limpio.
**Regla de fase:** DOCUMENTATION-ONLY. No se modifica código, schema, datos, ni archivos existentes. Este documento es el único artefacto creado por este paso.

---

## 0. Propósito

Este documento **reproduce EXACTAMENTE las cuatro fórmulas históricas de `overallScore`** identificadas en la auditoría de reconciliación **A-04.4** (evidence-a04-4/) como estado **BEFORE** para la fase A-04.5 de normalización. Las fórmulas se enumeran **sin alterar**, **sin interpretación correctiva** y **sin propuestas de cambio** (esas corresponderán a pasos posteriores de A-04.5).

Las fuentes de verdad para este documento son:

- `evidence-a04-4/05-overall-reconciliation.md` (PASO 5 + PASO 13 de A-04.4 — inventario completo).
- `evidence-a04-4/07-video-audit.md` (PASO 6 de A-04.4 — auditoría dedicada del endpoint de video).
- `evidence-a04-4/00-master-dossier.md` (consolidación final de A-04.4 — confirmación de las 4 fórmulas).
- Verificación directa en el repositorio (lectura read-only) de las líneas citadas, ejecutada en este PASO 1 para garantizar fidelidad.

**Ningún cambio fue realizado.** `git status` al cierre del paso queda igual al cierre de A-04.4, salvo la adición del presente archivo `evidence-a04-5/01-before.md`.

---

## 1. F1 — INTERNAL `/api/evaluations` — `calculateScores()`

| Campo | Valor exacto (sin modificar) |
|---|---|
| **Archivo** | `src/app/api/evaluations/route.ts` |
| **Definición** | L145–339 |
| **Invocación** | L1350 (dentro del helper de scoring por sesión) |
| **Inputs** | `EvaluationResponse[]` con `question` vivo (include `question: true`, L1342–1346); params `positionCategory` (L1362) y `hasKnowledgeTest` (L1363) **declarados pero NUNCA leídos dentro de `calculateScores`** (verificado: su firma L147–148 los recibe y los ignora). |
| **Fórmula (matriz de ramas)** | • 0 secciones → `overallScore = 0` (L273) <br> • 1 sección → esa sección cruda (L270–271) <br> • 2 secciones → media simple 50/50 (L268–269) <br> • 4 secciones (BF+PSY+INT+KN) → `0.25·avgBigFive + 0.25·avgPsychological + 0.15·avgIntegrity + 0.35·knowledgeScore` (L282) <br> • BF+PSY+INT (KN=null) → `0.30·BF + 0.30·PSY + 0.40·INT` (L285) <br> • BF+PSY+KN (sin INT, legacy) → `0.30·BF + 0.30·PSY + 0.40·KN` (L288) <br> • KN + 1–2 secciones behaviorales (BF/PSY/INT) → `0.50·behavioralAvg + 0.50·KN` (L289–296) <br> • Solo behaviorales (sin KN) → media simple de las presentes (L297–303) |
| **Weights** | 0.25/0.25/0.15/0.35 · 0.30/0.30/0.40 · 0.50/0.50 · 1.00 |
| **nullBehavior** | • LIKERT `null` → `numericValue \|\| parseInt(value,10) \|\| 3` (L162) <br> • KN estricto: sin clave `correctAnswer` → sin crédito (L227, no `?? 0`) <br> • Salida display: `openness: … \|\| 0` etc. (L320–329) <br> • `integrityScore: hasIntegrityData ? round(avgIntegrity,2) : 0` (L331) |
| **missingBehavior** | Sección sin respuestas → excluida del overall; la matriz de ramas elige la fórmula por combinación de presentes. |
| **Renormalización** | **Matriz de ramas** (no proporcional): cada rama define sus pesos, no se reescala por peso disponible. |
| **Output** | `overallScore` redondeo a 2 decimales (L332); `recommendation = guidance` ('PENDIENTE' / 'PERFIL_COMPLETO' / 'PERFIL_PARCIAL') (L310–317, L333). Persistencia L1419–1445. |
| **Particularidad A-04.4** | **Overall PRE-canónico:** el `overallScore` se computa en L1350 **ANTES** de que L1381–1382 reescriba `scores.knowledgeScore` con el valor canónico (`scoreCanonicalAdministration`). El overall queda embebido con el KN **legacy** (claves vivas) mientras el campo `knowledgeScore` mostrado/persistido refleja el **canónico**. Un mismo flujo produce dos valores de KN. |

---

## 2. F2 — PUBLIC step-level `/api/public/apply` — `calculateScores()` (por paso)

| Campo | Valor exacto (sin modificar) |
|---|---|
| **Archivo** | `src/app/api/public/apply/route.ts` |
| **Definición** | L43–233 |
| **Invocaciones** | L448 (step 1 — Psicometrica), L477 (step 2 — Psicologica), L506 (step 3 — Integridad). Step 4 (Conocimientos) usa **bloque propio** L510–538, no `calculateScores`. |
| **Inputs** | `ScoredResponse[]` con metadatos de sistema; `correctAnswer: null` forzado en steps 1–3 (L444/473/502) — el scoring KN público se resuelve en step 4. |
| **Fórmula (matriz de ramas)** | MISMA matriz que F1: 0→0 · 1→esa sección · 2→50/50 · 4→`0.25/0.25/0.15/0.35` · BF+PSY+INT→`0.30/0.30/0.40 INT` · BF+PSY+KN→`0.30/0.30/0.40 KN` · KN+behavioral→`0.50/0.50` · solo behaviorales→media (L160–200). |
| **Weights** | Idénticos a F1. |
| **nullBehavior** | • LIKERT `null` → `\|\| 3` (L56) <br> • **KN legacy inflado:** `correctIdx = resp.correctAnswer ?? 0` (L122) → si la pregunta no tiene clave, la opción 0 cuenta como correcta. <br> • Fallbacks de categoría por paso: step 1 `'OPENNESS'` (L439), step 2 `'EMPATHY'` (L468), step 3 `'INTEGRITY_HONESTY'` (L497) — si el `systemQ` no se encuentra, se inventa una categoría. <br> • Step 4: `correctIdx = vacancyQ?.correctAnswer ?? systemQ?.correctAnswer ?? 0` (L524–526) — doble fallback al 0. |
| **missingBehavior** | Ídem F1 por rama. |
| **Renormalización** | Matriz de ramas (no proporcional). |
| **Output** | Persiste campos por paso (`openness`, `conscientiousness`, …, `integrityScore`); **KN a 2 decimales** (`Math.round(·*100)/100`, L127) — **inconsistencia menor** vs F1 que lo deja **entero** (L231, sin redondeo explícito en `calculateLikertScore`). |
| **Salidas extra** | `psicometricaAvg`, `psicologicaAvg` (L230–231). |
| **Particularidad A-04.4** | **Inflación del KN público:** `?? 0` en claves faltantes (L122, L524–526) asigna correctitud ficticia a la opción 0. Divergencia documentada con F1 donde el KN legado interno es estricto (sin clave → sin crédito). |

---

## 3. F3 — PUBLIC final `/api/public/apply` — `calculateOverallScore(applicationId)`

| Campo | Valor exacto (sin modificar) |
|---|---|
| **Archivo** | `src/app/api/public/apply/route.ts` |
| **Definición** | L547–670 |
| **Invocación** | L1626, **DESPUÉS** de persistir los scores del paso completado (A-03.4 ordering fix, comentario L1611–1618; `vacancyApplication.update` L1619–1622; `calculateOverallScore` L1626; `vacancyApplication.update` final L1628–1635). |
| **Inputs** | Fila `VacancyApplication` persistida (incluye `vacancy`) + flags `includePsicometrica`/`includePsicologica`/`includeIntegridad` (L548–554). |
| **Fórmula (matriz de ramas)** | Misma matriz que F1/F2: 0→0 · 1→esa sección · 2→50/50 · 4→`0.25/0.25/0.15/0.35` · 3 sin KN→`0.30/0.30/0.40 INT` · 3 sin INT→`0.30/0.30/0.40 KN` · KN+behavioral→`0.50/0.50` · solo behaviorales→media (L593–631). |
| **Weights** | Idénticos a F1/F2. |
| **nullBehavior** | • `avgIntegrity = application.integrityScore \|\| 0` (L583) — ausencia se vuelve 0. <br> • `hasIntegrityData = (vacancy.includeIntegridad ?? true) === true && application.integrityScore > 0` (L568) — **un 0.00 real (todo mal) cuenta como AUSENTE** y excluye INT del overall. <br> • `hasKnowledgeData = application.knowledgeScore !== null` (L569) — distinta semántica que el video (que exige `>0`). <br> • Promedios por dimensión usan `.filter(s => s > 0)` (L573–580) — adaptativo sobre no-ceros. |
| **missingBehavior** | Sección excluida por rama (igual que F1/F2), pero la decisión de presencia depende de `> 0` y de flags `include*`. |
| **Renormalización** | Matriz de ramas (no proporcional). |
| **Output** | `overallScore` a 2 decimales (L666); `recommendation = guidance` (L633–641); `summary` (L659–663). |
| **Particularidad A-04.4** | **Presencia por `> 0`**: un candidato con INT realmente 0.00 o KN realmente 0.00 queda **excluido** del overall en lugar de contar como bajo. Esto introduce un sesgo sistemático hacia arriba (ausencia = no penaliza, se renormaliza entre los presentes). Divergencia cuantitativa confirmada en A-04.4 (caso R7: 39.00 interno vs 71.00 público con datos idénticos). |

---

## 4. F4 — VIDEO `/api/public/video` — inline (SOBREESCRIBE el overall)

| Campo | Valor exacto (sin modificar) |
|---|---|
| **Archivo** | `src/app/api/public/video/route.ts` |
| **Gate** | L83: `if (application.overallScore === 0) { … }` — recalcula **solo** cuando el flujo principal dejó el overall en 0 (cierre de scoring alternativo). |
| **Fórmula (inline)** | L83–175; escritura L170. |
| **Inputs** | Fila `VacancyApplication` persistida. |
| **Fórmula** | • `psicometricaAvg = (100 − neuroticism + openness + conscientiousness + extraversion + agreeableness) / 5` (L92–97) — **denominador FIJO 5**. <br> • `psicologicaAvg = (stressLevel + empathy + adaptability + leadership + teamwork) / 5` (L100–105) — denominador fijo 5. <br> • `sectionScores` con pesos 0.30 (BF) / 0.30 (PSY) / 0.40 (KN) (L110–112). <br> • 0 secciones → `overallScore = 0` (L114–115). <br> • 1 sección → `sectionScores[0].score` crudo (L116–117). <br> • ≥2 secciones → `Σ(score · (weight / totalWeight))` (L118–120) — **renormalización PROPORCIONAL**. |
| **Weights** | 0.30 BF · 0.30 PSY · 0.40 KN — **INT = 0 SIEMPRE** (la rama Integridad no existe). |
| **nullBehavior** | • `hasKnowledge = knowledgeScore !== null && knowledgeScore > 0` (L89) — **un 0.00 REAL (todo mal) = AUSENTE** (igual que F3 para INT, pero aplicado a KN). <br> • Puente (L247): `calculatedOverallScore = (updateData.overallScore as number) \|\| application.overallScore \|\| 0` — doble fallback a 0. |
| **missingBehavior** | Secciones ausentes → renormalización proporcional entre las presentes. |
| **Renormalización** | **PROPORCIONAL** (`weight / totalWeight`) — única fórmula del sistema que opera así. |
| **Output** | `updateData.overallScore = Math.round(overallScore·100)/100` (L170); `recommendation = guidance` (L171); `status: 'COMPLETED'`; `completedAt` (L170–174). |
| **Guidance PERFIL_COMPLETO** | BF + PSY + KN — **sin INT** (L128: `hasBigFive && hasPsych && hasKnowledge`). |
| **Puente a EvaluationResult** | L251–274: crea `EvaluationResult` (visibilidad para RH) **SIN el campo `integrityScore`** → queda con el default `@default(0)` aunque la `VacancyApplication` tenga integridad real. |
| **Particularidades A-04.4 (7 divergencias documentadas)** | (1) Integridad ausente (peso 0). (2) **Doble inversión del neuroticismo**: los ítems NEUROTICISM ya usan `reverseScored → 6−v` (F1 L162–163, F2 L56–57), pero el video aplica de nuevo `100 − neuroticism` (L93) → puntúa al candidato con neuroticismo alto como si fuera estable (o viceversa). (3) Denominadores fijos /5 (los ceros arrastran el promedio hacia abajo). (4) Semántica de 0.00 KN: F3 usa `!== null`, el video usa `!== null && > 0`. (5) Guidance PERFIL_COMPLETO distinta (sin INT). (6) Renormalización proporcional vs matriz de ramas. (7) Puente sin `integrityScore` (default 0). |

---

## 5. Tabla comparativa de las cuatro fórmulas (estado BEFORE, sin modificar)

| Dimensión | F1 — Internal | F2 — Public step | F3 — Public final | F4 — Video |
|---|---|---|---|---|
| **Ruta** | `src/app/api/evaluations/route.ts` | `src/app/api/public/apply/route.ts` | `src/app/api/public/apply/route.ts` | `src/app/api/public/video/route.ts` |
| **Función** | `calculateScores()` L145–339 | `calculateScores()` L43–233 | `calculateOverallScore(applicationId)` L547–670 | inline L83–175 |
| **Invocación** | L1350 (PRE override canónico L1382) | L448 / L477 / L506 | L1626 (post-persist) | gate `=== 0` L83 |
| **Pesos BF/PSY/INT/KN (4 secc)** | 0.25 / 0.25 / 0.15 / 0.35 | 0.25 / 0.25 / 0.15 / 0.35 | 0.25 / 0.25 / 0.15 / 0.35 | 0.30 / 0.30 / **— (INT=0)** / 0.40 |
| **INT participa** | Sí (0.15–1.00 según rama) | Sí (0.15–1.00 según rama) | Sí (0.15–1.00 según rama) | **No — nunca** |
| **KN semántica null** | Estricto (sin clave → sin crédito) | `correctAnswer ?? 0` (infla, opción 0 = correcta) | `knowledgeScore !== null` (0.00 real participa) | `!== null && > 0` (0.00 real = ausente) |
| **KN formato** | Entero | 2 decimales | 2 decimales | 2 decimales (heredado de F3) |
| **Renormalización** | Matriz de ramas | Matriz de ramas | Matriz de ramas | Proporcional `weight/totalWeight` |
| **Neuroticism handling** | Invertido una vez por `reverseScored` (ítem) | Ídem F1 | Lee valor ya invertido persistido | **RE-INVIerte** `100 − neuroticism` (doble inversión) |
| **Denominador BF/PSY** | Adaptativo (solo dims con respuestas) | Adaptativo | Adaptativo (`filter > 0`) | Fijo `/5` |
| **Guidance PERFIL_COMPLETO** | BF + PSY + INT + KN (L313) | (no aplica por paso) | BF + PSY + INT + KN (L637) | BF + PSY + KN **sin INT** (L128) |
| **Escribe overall** | Sí (L1419–1445) | No (solo persiste pasos) | Sí (L1628–1635) | **SÍ — SOBREESCRIBE** (L170, condicional a gate `=== 0`) |
| **Puente a `EvaluationResult`** | Directo | No | No | Sí, **SIN `integrityScore`** (L251–274 → default 0) |
| **Particularidad A-04.4** | Overall PRE-canónico (KN legacy embebido) | `?? 0` inflacionario en KN legado | Presencia por `> 0` (0.00 = ausente) | 7 divergencias (INT, neuroticism doble-invertido, /5 fijo, KN 0.00 ausente, guidance sin INT, proporcional, puente sin INT) |

---

## 6. Problemas identificados en A-04.4 que A-04.5 corrige

La fase A-04.5 (normalización) se introduce para corregir las **cinco inconsistencias** siguientes, identificadas en A-04.4 y confirmadas en la lectura directa de este PASO 1:

1. **Cuatro implementaciones activas de `overallScore`.** Existen cuatro fórmulas divergentes en el repositorio (F1, F2, F3, F4) que calculan el mismo campo `VacancyApplication.overallScore` (y el puente `EvaluationResult.overallScore`) con matrices de pesos, reglas de presencia y semánticas de nulo distintas. No hay una única fuente de verdad para el global.

2. **Integridad participa aunque no fue aprobada metodológicamente.** A-04.1 C4 (flag «orientative, never auto-filter») y A-04.2 GATE-10 (Integridad NO entra en overall sin aprobación metodológica + versionado + validación + revisión legal) establecen que Integridad no debe alimentar decisiones globales. Las fórmulas F1, F2 y F3 la ponderan en 0.15 (4 secciones), 0.40 (3 secciones sin KN), `0.50/k` (KN + k behaviorales), 0.50 (1 sección INT) y hasta 1.00 (caso único). Solo F4 la excluye. Estado metodológico declarado en A-04.4: **INTEGRITY = INSUFFICIENT** + contradicción normativa activa (1 CRITICAL).

3. **Conversiones `ausencia → 0` y `null → 0/3` con efecto de decisión.** Múltiples conversiones tratan la ausencia de dato como un puntaje numérico válido (28 sitios inventariados en `evidence-a04-4/10-null-zero-audit.md`): `integrityScore: … : 0` (F1 L331); `correctAnswer ?? 0` (F2 L122, L524–526) que **infla** el KN legado; `integrityScore || 0` (F3 L583); `> 0` como gate de presencia (F3 L568, F4 L89) que convierte un 0.00 real en «ausente» y lo excluye del overall en vez de contabilizarlo como bajo. `parseInt`/`Number`/`parseFloat` ausentes del scoring; `Math.max/min` solo como clamps.

4. **El endpoint de video SOBREESCRIBE el overall con una fórmula propia y divergente.** F4 (`/api/public/video`) recalcula el global cuando `application.overallScore === 0` (L83) y persiste su propio valor (L170), sobre-escribiendo el que calcularía F3 para el mismo candidato. La fórmula F4 difiere de F1/F2/F3 en: Integridad ausente, neuroticismo re-invertido (doble inversión, ya invertido por ítem), denominadores fijos `/5`, renormalización proporcional (no matriz de ramas), KN 0.00 = ausente, guidance PERFIL_COMPLETO sin INT, y puente a `EvaluationResult` sin `integrityScore` (default 0). Es la mayor fuente de inconsistencia del global (confirma R7 de A-04.3 re-auditada en A-04.4).

5. **El resultado varía por canal/ruta para el mismo candidato.** Con datos idénticos (escenario R7 de A-04.3, re-confirmado en A-04.4 `06-report-reconciliation.csv` y `overall-score-scenarios.md`), el overall interno (F1) puede arrojar **39.00** mientras el público final (F3) arroja **71.00**; y un candidato con INT baja y KN real 0.00 recibe distintos overall y distintas guidance PERFIL_COMPLETO según termine su flujo por la vía principal (F3) o por la vía de video (F4). El campo `overallScore` no es comparable entre canales.

---

## 7. Knowledge canónico — el motor que SÍ produce semántica de evidencia correcta (alimentа F1/F2/F3, pero F4 lo mal-maneja)

`src/lib/knowledge-canonical.ts` — función `scoreCanonicalAdministration` (L744–852, invocada para `PUBLIC_VACANCY` L773–784 e `INTERNAL_POSITION` L785–792; `writeKnowledgeResult` escribe el `KnowledgeResult` separado en evaluations L1461 y apply L1487). 

**Comportamiento correcto del motor canónico (no objeto de A-04.5, sino referencia de cómo SÍ se hace):**

- Produce `knowledgeScore: number | null` **Y** `evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'INVALID'`.
- Cuando la evidencia es **INSUFFICIENT** (denominador insuficiente por claves vivas o ítems insuficientes), el motor devuelve `knowledgeScore = null` (L827–839: `knowledgeScore = null // INSUFFICIENT semantics — never 0`) **con** `evidenceStatus = 'INSUFFICIENT'`.
- Es decir, el motor canónico **no convierte ausencia en 0**: la representa explícitamente como `null` + `evidenceStatus`, y el consumidor puede decidir excluirla del overall y renormalizar.

**Cómo consumen las cuatro fórmulas ese motor:**

- **F1** (evaluations/route.ts L1375–1382): consulta `knowledgeAdministration`, llama `scoreCanonicalAdministration` y **sobrescribe** `scores.knowledgeScore` con el valor canónico. **PERO** el `overallScore` ya fue computado en L1350 con el KN **legacy** (estricto, claves vivas). Resultado: el campo `knowledgeScore` mostrado es canónico; el `overallScore` incrusta el KN legacy. **Particularidad A-04.4 confirmada.**
- **F2** (apply/route.ts step 4, L510–538): **NO** consulta el motor canónico en el flujo por paso; usa su propio bloque con `correctIdx = vacancyQ ?? systemQ ?? 0` (L524–526), produciendo un KN legado inflado (`?? 0`). El KN canónico solo se persiste más tarde vía `writeKnowledgeResult` (L1487), pero el `knowledgeScore` numérico en `VacancyApplication` queda con el valor legado.
- **F3** (apply/route.ts L547–670): lee el `knowledgeScore` persistido (legado, no canónico) y lo usa con semántica `!== null` (un 0.00 real participa, a diferencia del video). **No consulta `evidenceStatus`.**
- **F4** (video/route.ts L83–175): lee el `knowledgeScore` persistido y lo trata con `!== null && > 0` (un 0.00 real = ausente). **No consulta `evidenceStatus`**, no distingue `null` por INSUFFICIENT (ausencia legítima) de `null` por no-presentación de la sección. Si el motor canónico hubiera producido `INSUFFICIENT → null` y el legado hubiera persistido 0.00, el video lo excluye y renormaliza entre BF/PSY; F3 lo incluye como 0.00. **Divergencia confirmada.**

**Conclusión para A-04.5:** el motor canónico ya implementa correctamente la regla «no-evidencia, no-decisión» (INSUFFICIENT → null + evidenceStatus explícito); las cuatro fórmulas globales NO consumen ese contrato de evidencia. La normalización A-04.5 deberá hacer que las cuatro (o la fórmula unificada resultante) consuman el `evidenceStatus` en lugar de inferir presencia por `> 0` o `!== null`.

---

## 8. Prueba de no-modificación (cierre del PASO 1)

- Operaciones realizadas en este paso: `Read` (read-only) de `worklog.md`, expedientes A-04.4, y archivos fuente citados; `Grep` (read-only) sobre `src/lib/knowledge-canonical.ts`; `mkdir -p evidence-a04-5`; `Write` del presente archivo.
- **Cero modificaciones** en `src/`, `prisma/`, `scripts/`, `public/`, `evidence-a04-1/2/3/4/`, `evidence-g/h/i/`, `evidence-a03-4/5/`, ni en ningún otro archivo existente.
- **Cero migraciones**, cero `db push`, cero escrituras de datos, cero cambios de schema, cero cambios de scoring.
- **Cero propuestas implementadas** — este paso captura el estado BEFORE; las propuestas y la normalización corresponden a pasos posteriores de A-04.5.

`git status` esperado al cierre del paso: working tree limpio excepto la adición de `evidence-a04-5/01-before.md` (y, al cierre de la fase, el apéndice a `worklog.md`).
