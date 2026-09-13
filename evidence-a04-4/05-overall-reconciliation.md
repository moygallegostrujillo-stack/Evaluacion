# A-04.4 — 05 · INVENTARIO COMPLETO DE FÓRMULAS overallScore (PASO 5 + PASO 13)

Pregunta PASO 13: ¿existe UNA fórmula o MÚLTIPLES? Respuesta: **MÚLTIPLES — cuatro implementaciones activas de la fórmula global + un motor canónico de Knowledge que alimenta una de ellas.** Se enumeran SIN corregir.

---

## 1. Inventario (file · line · formula · inputs · weights · nullBehavior · missingBehavior · renormalization · output)

### F1 — INTERNAL `/api/evaluations` — `calculateScores()`

| Campo | Valor |
|---|---|
| file | `src/app/api/evaluations/route.ts` |
| line | def L145–339; invocada L1350; persistida L1419–1445 |
| inputs | respuestas `EvaluationResponse` (con `question` vivo); params `positionCategory` y `hasKnowledgeTest` **declarados y NUNCA usados** (L147–148, verificado) |
| fórmula | ramas: 0 secc→0 · 1 secc→esa sección · 2 secc→50/50 · 4 secc→`0.25·BF + 0.25·PSY + 0.15·INT + 0.35·KN` (L282) · BF+PSY+INT→`0.30/0.30/0.40 INT` (L285) · BF+PSY+KN (legacy sin INT)→`0.30/0.30/0.40 KN` (L288) · KN+k behaviorales→`0.50·media(BF,PSY,INT) + 0.50·KN` (L289–296) · solo behaviorales→media simple (L297–303) |
| weights | 0.25/0.25/0.15/0.35 · 0.30/0.30/0.40 · 0.50/0.50 · 1.00 |
| nullBehavior | LIKERT null→`|| 3` (L162); KN sin clave→sin crédito (L227, estricto); salida `|| 0` display (L320–329); `integrityScore: … : 0` (L331) |
| missingBehavior | sección sin respuestas → excluida del overall (renormalización por rama) |
| renormalization | **matriz de ramas** (no proporcional) |
| output | `overallScore` redondeo 2 dec (L332); `recommendation = guidance` (L310–317, L333) |
| particularidad | para sesiones versionadas, `scores.knowledgeScore` se SOBREESCRIBE con el canónico DESPUÉS (L1381–1382), pero el `overallScore` NO se recalcula → el overall incrusta el KN legacy (claves vivas) mientras el campo knowledgeScore muestra el canónico |

### F2 — PUBLIC step-level `/api/public/apply` — `calculateScores()` (por paso)

| Campo | Valor |
|---|---|
| file | `src/app/api/public/apply/route.ts` |
| line | def L43–233; invocada en L448 (step 1), L477 (step 2), L506 (step 3); step 4 usa bloque propio L510–538 |
| inputs | `VacancyApplicationResponse` con metadatos de sistema; `correctAnswer: null` forzado en steps 1–3 (L444/473/502) |
| fórmula | MISMA matriz de ramas que F1 (L160–200) |
| weights | idénticos a F1 |
| nullBehavior | LIKERT null→`|| 3` (L56); **KN legacy: `correctAnswer ?? 0` (L122) → opción 0 cuenta como correcta**; fallbacks de categoría `'OPENNESS'`/`'EMPATHY'`/`'INTEGRITY_HONESTY'` (L439/468/497); step 4: `correctIdx = vacancyQ ?? systemQ ?? 0` (L524–526) |
| missingBehavior | ídem F1 por rama |
| renormalization | matriz de ramas |
| output | persiste campos por paso (openness…, integrityScore); KN a 2 decimales (L127) vs ENTERO en F1 (L231) — inconsistencia menor |
| salida extra | `psicometricaAvg`/`psicologicaAvg` (L230–231) |

### F3 — PUBLIC final `/api/public/apply` — `calculateOverallScore()`

| Campo | Valor |
|---|---|
| file | `src/app/api/public/apply/route.ts` |
| line | def L547–670; invocada L1626 TRAS persistir scores del paso (orden A-03.4, comentario L1611–1618; persist L1619–1622; write L1628–1635) |
| inputs | fila `VacancyApplication` persistida + `vacancy.include*` |
| fórmula | misma matriz de ramas (L593–631) |
| weights | idénticos a F1/F2 |
| nullBehavior | `avgIntegrity = integrityScore || 0` (L583); `hasIntegrityData = (includeIntegridad ?? true) && integrityScore > 0` (L568) — 0.00 real = ausente; `hasKnowledgeData = knowledgeScore !== null` (L569); promedios por dims `> 0` (L573–580) |
| missingBehavior | sección excluida por rama |
| renormalization | matriz de ramas |
| output | overallScore 2 dec (L666); recommendation=guidance (L633–641); summary (L659–663) |

### F4 — VIDEO `/api/public/video` — inline (SOBREESCRIBE el overall)

| Campo | Valor |
|---|---|
| file | `src/app/api/public/video/route.ts` |
| line | gate `application.overallScore === 0` L83; fórmula L108–121; write L170; puente L247/L270 |
| inputs | fila `VacancyApplication` persistida |
| fórmula | `psicometricaAvg = (100 − neuroticism + O + C + E + A)/5` (L92–97: RE-INVIerte neuroticismo ya invertido por ítem; denominador FIJO 5) · `psicologicaAvg = (S+E+A+L+T)/5` (L100–105) · pesos `0.30/0.30/0.40` con renormalización **PROPORCIONAL** `weight/totalWeight` (L110–120) |
| weights | 0.30/0.30/0.40 (BF/PSY/KN) — **INT = 0 siempre** |
| nullBehavior | `hasKnowledge = knowledgeScore !== null && knowledgeScore > 0` (L89: un 0.00 REAL = AUSENTE); L247 `(updateData.overallScore as number) || application.overallScore || 0` |
| missingBehavior | secciones ausentes → renormalización proporcional entre las presentes |
| renormalization | proporcional (ÚNICA fórmula que renormaliza así) |
| output | `updateData.overallScore` (L170) + recommendation + status COMPLETED; **puente a EvaluationResult SIN integrityScore** (L251–274) → default 0 |

### Motor aparte — Knowledge canónico (alimentа F1/F2/F3)

`src/lib/knowledge-canonical.ts` L744–852: no calcula overall, pero produce el `knowledgeScore` (null si INSUFFICIENT) que las fórmulas consumen.

## 2. Consumidores (solo lectura del overall)

- `src/app/api/results/route.ts` L97–120 (comparador), L163/187 (promedio), L198 (`knowledgeScore || 0` en media — sesgo), L348.
- `src/app/api/candidates/route.ts` L126/153 · `src/app/api/vacancies/[id]/applications/route.ts` L64.
- `src/lib/admin-db.ts` L229/232/235 (conteos por recommendation, no por score).
- `src/app/api/dashboard/route.ts` L109–117 (conteos por recommendation).
- Frontend: DashboardView L306, VacancyManagementView L804, CandidatesView L322, CompareView L138/175/333, CandidateDetailView L229; tipo en `store.ts` L47.
- Escrituras especiales: `retention.ts` L209–229 (zeroing de anonimización — legítimo); `consent/route.ts` L399–420 (reset de sensibles, overall STALE — comentario L413).

## 3. Respuesta PASO 13 (enumeración sin corregir)

1. F1 interna (respuestas vivas; KN legacy estricto; overall pre-canónico).
2. F2 pública por paso (misma matriz; `?? 0` en claves; KN 2 dec).
3. F3 pública final (fila persistida; `|| 0`; presencia por `>0`).
4. F4 video (sin INT; neuroticismo re-invertido; /5 fijo; renormalización proporcional; gate `===0`; SOBREESCRIBE).
5. Vector adicional intra-F1: overall computado antes del override canónico del KN (dos valores de KN en el mismo flujo).

## 4. ¿Pueden producir resultados diferentes para el mismo candidato? SÍ

Demostración cuantitativa: ver `06-report-reconciliation.csv` (fila R7 de A-04.3 re-confirmada) y `overall-score-scenarios.md` de A-04.3 — divergencia interna 39.00 vs público 71.00 con datos idénticos; en video, un candidato con INT baja y KN=0.00 real obtiene un overall distinto y una guidance PERFIL_COMPLETO sin INT. NO se corrigió nada (regla de fase).
