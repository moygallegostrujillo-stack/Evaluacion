# EVALUHR — A-04.4 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# AUDITORÍA DE RECONCILIACIÓN DEL ESTADO REAL — SOLO AUDITORÍA — NO MODIFICAR (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@b5dcfb6`, working tree limpio.
Método: lectura directa con líneas exactas (Read/sed), Grep sistemático, forense git
(`git status/diff/log/show`, pickaxe `git log -S`, `git grep` por rama) y contraste con
expedientes en disco (A-03.4, A-03.5, A-04.1, A-04.2, A-04.3, AUDITORIA_EVALUHR.md).
Regla invocada por el spec y respetada: LA ÚNICA FUENTE DE VERDAD ES EL REPOSITORIO ACTUAL.

---

## 1. ESTADO REAL DEL REPO (PASO 1)

- Rama `main`, HEAD `b5dcfb6` (2026-09-11, contenido = evidencia A-04.3), 31 commits sin push, **working tree limpio** (0 modificados/añadidos/eliminados).
- Ramas: `main`, `clean-main`, `main-clean`, `origin/main` — estas dos últimas/y origin SIN el trabajo reciente (−20,921 líneas relativo a main).
- Expedientes en disco: A-03.4, A-03.5, A-04.1, A-04.2, A-04.3. **AUSENTES: A-01.2, A-01.3, A-02.1–5, A-03.1–3.**
- Detalle: `01-repo-state.md`.

## 2. IPIP REAL (PASOS 2 y 12)

**`EVALHR-PERSONALIDAD-IPIP50-MX`: NOT_IMPLEMENTED — y NUNCA existió en esta historia git.**

- grep actual = 0; pickaxe `-- src/` y `-- prisma/` = 0 commits; `-S "IPIP50-MX"` = 0; 0 en las tres ramas alternativas.
- Los 7 commits que tocan el string "IPIP" son documentales (AUDITORIA + evidence-a03-4/5 + evidence-a04-1/2/3). No hay commit de implementación NI de eliminación.
- Resolución de la contradicción A-01.2 («implementado») vs A-04.3 («no existe»): **A-04.3 CONFIRMED; A-01.2 CONTRADICTED con fuente NOT_VERIFIABLE** (dossier ausente del disco). No se inventa explicación: o A-01.2 describió un diseño nunca materializado, o proviene de un estado externo a este historial; el único artefacto contemporáneo in-repo (AUDITORIA_EVALUHR.md L17/L111) dice que los ítems son del desarrollador y SIN citar IPIP.
- Instrumento de personalidad REAL: Big Five demo propio (10 ítems, 2/dim) que SÍ puntúa.
- Detalle: `02-ipip-reconciliation.md`.

## 3. KNOWLEDGE REAL (PASO 3)

**IMPLEMENTED — CONFIRMED vs A-03.4/A-03.5.** 7/7 modelos canónicos en schema (Blueprint L562, Requirement L587, ItemVersion L612, Assessment L485, AssessmentItem L529, Administration L639, Result L675). Un solo motor para ambos flujos (`scoreCanonicalAdministration` atiende PUBLIC_VACANCY L773–784 e INTERNAL_POSITION L785–792; `writeKnowledgeResult` en evaluations L1461 y apply L1487). INSUFFICIENT → null → excluido → renormalizado (L827–839). Capa LEGADA activa por diseño con divergencias (`?? 0` público; 0% interno; overall interno pre-canónico).
Detalle: `03-knowledge-reconciliation.md`.

## 4. INTEGRITY REAL (PASO 4)

**Pondera el overallScore HOY: pesos reales 0.15 (4 secc) · 0.40 (sin KN) · 0.50÷k · 0.50 · 1.00 · 0 (video).**

- Generación: `INTEGRIDAD_QUESTIONS` (generate-templates L38–52, 10 ítems 3/3/2/2, 5 reverse, siempre creada) + fallback público (apply L266–270); `Vacancy.includeIntegridad @default(true)` (schema L323).
- Score: `integrityScore Float @default(0)` NOT NULL en EvaluationResult (L277) y VacancyApplication (L402) — **sin estado INSUFFICIENT**; 0 = ausente ≡ peor puntaje.
- Flag «orientative, never auto-filter» gobierna ítems/guidance, NO la fórmula. Contradice A-04.1 C4 y A-04.2 GATE-10 (deuda documentada en A-04.2 §7, persistente). NO se corrigió.
- Detalle: `04-integrity-reconciliation.md`.

## 5. TODAS LAS FÓRMULAS (PASOS 5 y 13)

**MÚLTIPLES: 4 implementaciones activas** (enumeradas sin corregir):

| # | Fórmula | Sitio | Peso INT | Particularidad |
|---|---|---|---|---|
| F1 | interna (respuestas vivas) | evaluations L145–339, inv L1350 | 0.15–1.00 | params muertos; overall PRE-canónico (L1350 antes del override L1382) |
| F2 | pública por paso | apply L43–233, inv L448/477/506 | 0.15–1.00 | `correctAnswer ?? 0` (L122) infla; fallbacks de categoría L439/468/497 |
| F3 | pública final | apply L547–670, inv L1626 | 0.15–1.00 | lee fila persistida; presencia por `>0`; orden persist→compute (A-03.4) |
| F4 | video (SOBREESCRIBE) | video L83–175, write L170 | **0 (nunca)** | N re-invertido, /5 fijo, renormalización PROPORCIONAL, KN 0.00=ausente, gate `===0`, puente SIN integrityScore |

Mismo candidato → distintos overall según canal/ruta (R7 re-confirmado). Detalle: `05-overall-reconciliation.md`, `07-video-audit.md`, `08-public-apply-audit.md`, `09-evaluations-audit.md`.

## 6. RECOMMENDATION (PASO 9)

Guidance de completitud SIN umbrales de score: PENDIENTE (0 secciones) / PERFIL_COMPLETO (F1/F3: BF+PSY+INT+KN; F4: BF+PSY+KN sin INT) / PERFIL_PARCIAL (resto). Consumidores: conteos admin-db L229–235, dashboard L109–117, filtros de UI; sin `.sort()` por score. Detalle: `09-evaluations-audit.md` §4.

## 7. NULL/0 (PASO 10)

Inventario completo (28 sitios): conversions con efecto de decisión — K-1/K-2 (`?? 0` inflan KN legado), K-3 (0% interno), I-1..I-5 (0=ausente en INT), O-1..O-3 (overall 0/dispara F4); imputación P-1 (null→3); legítimos — retention, consent-reset (overall STALE), clamps. `parseFloat/Number(` ausentes; `Math.max/min` solo clamps. Detalle: `10-null-zero-audit.md`.

## 8. RECONCILIACIÓN DE REPORTES (PASO 11)

29 filas: **14 CONFIRMED · 3 CONTRADICTED · 11 NOT_VERIFIABLE · 1 hallazgos nuevos**.
- CONFIRMED: A-03.4, A-03.5 (con matiz «registro separado»), A-04.1 investigación, A-04.2 hechos, A-04.3 íntegro, AUDITORIA (3 reclamaciones).
- CONTRADICTED: A-01.2 (IPIP), A-04.1 C4, A-04.2 GATE-10 — las normas existen, el código las viola.
- NOT_VERIFIABLE: A-01.2/01.3, A-02.1–5, A-03.1–3 (expedientes ausentes — nada inventado).
- Hallazgos nuevos de A-04.4: overall pre-canónico (F1), puente de video sin integrityScore, params muertos, fallbacks de categoría.
Detalle: `06-report-reconciliation.csv`.

## 9. ESTADO METODOLÓGICO E IMPACTO (PASOS 14–15)

| Componente | Estado |
|---|---|
| PERSONALITY | INSUFFICIENT |
| KNOWLEDGE | LIMITED (canónico sólido; legado divergente) |
| INTEGRITY | INSUFFICIENT (+ contradicción normativa activa) |
| OVERALL SCORE | CONTRADICTED |
| JOBFIT | NOT IMPLEMENTED |
| RECOMMENDATION | LIMITED |

Severidad: 1 CRITICAL (Integridad en overall — método+legal), 3 HIGH (4 fórmulas/sobrescritura; legado KN `?? 0` y 0%), 5 MEDIUM, 4 LOW, 1 INFO. Detalle: `11-methodological-status.md`.

## 10. OPCIONES DE CORRECCIÓN (PASO 16) — SIN IMPLEMENTAR

- **A** mantener provisionalmente: solo puente corto documentado.
- **B** aislar Integrity del overallScore: primer paso recomendado (elimina el CRITICAL; alinea con A-04.1/A-04.2).
- **C** unificar calculateOverallScore: estado objetivo (una fórmula versionada, whitelist por evidenceStatus, video sin criterios propios).
- **D** retirar overallScore progresivamente hacia JobFit futuro: diferida (JobFit no existe).
- Ruta recomendada: **A → B → C → D(condicional)**, con versión de fórmula estampada, expediente de pesos y regresión completa. Detalle: `12-correction-options.md`.

## 11. REGLA TEMPORAL (PASO 17) — PROPUESTA, NO IMPLEMENTADA

«No-evidencia, no-decisión-global»: un instrumento `INSUFFICIENT / INVALID / PENDING_REVIEW / NOT_APPROVED` NO alimenta decisiones globales; exige evidenceStatus=VALID + aprobación; renormalización explícita y versionada; aplica a las 4 fórmulas. Detalle: `12-correction-options.md` §2.

## 12. CONCLUSIÓN GENERAL

1. El estado real difiere de los reportes en exactamente **tres puntos normativos** (A-01.2 IPIP, A-04.1 C4, A-04.2 GATE-10) y **confirma** todo lo documentado por A-03.4/A-03.5/A-04.2/A-04.3 sobre hechos.
2. El global sigue siendo un **agregado opaco con 4 fórmulas**; Integridad **sigue ponderando** pese a las decisiones A-04.2; Knowledge canónico sigue siendo **el único componente con semántica de evidencia correcta**.
3. La contradicción IPIP queda **cerrada con evidencia forense** (nunca existió código).
4. La corrección no se ejecuta en esta fase por REGLA ABSOLUTA; la ruta B→C queda especificada y lista para decisión.

## 13. ÍNDICE DEL EXPEDIENTE A-04.4

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-repo-state.md | 1 |
| 02-ipip-reconciliation.md | 2, 12 |
| 03-knowledge-reconciliation.md | 3 |
| 04-integrity-reconciliation.md | 4 |
| 05-overall-reconciliation.md | 5, 13 |
| 06-report-reconciliation.csv | 11 |
| 07-video-audit.md | 6 |
| 08-public-apply-audit.md | 7 |
| 09-evaluations-audit.md | 8, 9 |
| 10-null-zero-audit.md | 10 |
| 11-methodological-status.md | 14, 15 |
| 12-correction-options.md | 16, 17 |
| 13-audit-checklist.md | 18 |

## 14. AUDITORÍA FINAL

Ver `13-audit-checklist.md` — **13/13 verificadas**.

## 20. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` tras completar la fase: working tree limpio excepto los NUEVOS archivos de evidencia de esta fase (`evidence-a04-4/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**; sin migraciones, sin db push, sin escrituras de datos.
