# EVALUHR — A-05.1 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# AUDITORÍA DEL INSTRUMENTO REAL DE PERSONALIDAD — SOLO AUDITORÍA Y DOCUMENTACIÓN (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@aa771a9` (post-A-04.5).
Método: lectura directa con líneas exactas (Read/Grep), verificación de ausencia de IPIP
(`rg "IPIP|ipip" src/` = 0), contraste con expedientes A-04.1 (investigación IPIP/HEXACO/CWB-C),
A-04.2 (decisión Integrity), A-04.4 (reconciliación), A-04.5 (canonical overall), y AUDITORIA_EVALUHR.md
(contemporáneo in-repo). Regla: LA ÚNICA FUENTE DE VERDAD DEL ESTADO IMPLEMENTADO ES EL REPOSITORIO ACTUAL.

---

## 1. INSTRUMENTO ACTUAL (PASO 1, 5)

**«Big Five» demo — 10 reactivos creados por el desarrollador, sin citar fuente.**

| Campo | Valor |
|---|---|
| instrumentName | «Big Five» (nombre descriptivo del modelo; NO cita IPIP/NEO/BFI) |
| version | Sin versionar |
| itemCount | 10 (2 por dimensión) |
| dimensions | 5: OPENNESS, CONSCIENTIOUSNESS, EXTRAVERSION, AGREEABLENESS, NEUROTICISM |
| source | PROJECT-CREATED |
| author | Desarrollador del proyecto (no documentado) |
| rights | UNKNOWN |
| scoringMethod | Likert 1–5; `((avg−1)/4)·100`; NEUROTICISM `reverseScored` (6−v) |

Tres sitios con la MISMA lista de 10 reactivos: `generate-templates.ts` L10–21, `public/apply/route.ts` L215–226, `seed.ts` (vía `generateTemplatesForPosition`). Detalle: `01-current-instrument.md`.

## 2. ORIGEN DE CADA REACTIVO (PASO 2, 14)

Los 10 reactivos son **paráfrasis vagas** de constructos Big Five, **no verificables** como adaptación formal de IPIP/NEO/BFI. Ningún reactivo tiene fuente identificable. AUDITORIA_EVALUHR.md L120 confirma: «paráfrasis vagas de items IPIP/PSS pero no verificables como adaptaciones formales».

- **IA**: UNKNOWN — `z-ai-web-dev-sdk` no se importa en `src/`; no hay metadatos de proveniencia; `Question.origin` no existe para personalidad.
- **Adaptación IPIP formal**: NO — los textos no coinciden verbatim con ningún ítem IPIP; sin atribución Goldberg; no puede reclamar public-domain.

Detalle: `02-item-origin.md`.

## 3. CLASIFICACIÓN Y DERECHOS (PASO 3)

**Clasificación: PROJECT-CREATED** (origen UNKNOWN, derechos UNKNOWN, evidencia NOT ESTABLISHED).

Separación de planos: origen del texto (UNKNOWN) · derecho de uso (UNKNOWN) · evidencia científica (NOT ESTABLISHED). Detalle: `03-rights.md`.

## 4. EVIDENCIA PSICOMÉTRICA (PASO 4)

**NOT ESTABLISHED** en todos los planos:
- Confiabilidad: sin estudio; α esperado < .60 (2 ítems/dim).
- Estructura: sin EFA/CFA.
- Validez (contenido/constructo/criterio/convergente): NOT ESTABLISHED.
- Población: sin baremos MX ni de ninguna población.
- Idioma: sin validación de traducción (ITC 2017 no aplicado).
- Contexto laboral: sin validez predictiva documentada.

**Regla respetada**: NO se atribuye evidencia de IPIP-50/NEO/BFI al demo actual. Detalle: `04-psychometric-evidence.md`.

## 5. USO ACTUAL (PASO 6, 12, 13)

- **overallScore**: SÍ participa (peso 0.30 en 3 secciones / 0.50 en 2 / 1.00 en 1) — preservado por A-04.5.
- **recommendation**: NO usa puntajes; solo presencia/ausencia de datos (guidance de completitud).
- **JobFit**: NO (no existe; ninguna conexión automática).
- **Lenguaje laboral**: descriptivo (strengths/concerns), NO perfil ideal, NO APTO.

Separaciones cumplidas: personalidad ≠ JobFit, ≠ Integrity (aislada por A-04.5), ≠ Knowledge, ≠ criterio crítico, ≠ decisión. Detalle: `05-current-usage.md`.

## 6. COMPARACIÓN IPIP-50-MX (PASO 7)

IPIP-50-MX es metodológicamente superior en todos los planos técnicos (fuente verificable, 10 ítems/dim, α esperado .70–.85, estructura replicada, derechos PUBLIC DOMAIN). Limitaciones: baremos MX requieren validación, 50 ítems > tiempo, faking persistente. **Regla respetada**: NO se asume implementado (grep = 0). Detalle: `06-ipip-comparison.md`.

## 7. ALTERNATIVAS (PASO 8)

| Alt | Valor | Riesgo | Costo | V1 |
|---|---|---|---|---|
| Big Five demo | Bajo | ALTO | $0 | Interino experimental |
| IPIP-50-MX | Alto | MEDIO | $0+validación | Objetivo condicional |
| Mini-IPIP (20) | Medio-Alto | MEDIO-BAJO | $0+validación | Compromiso viable |
| Comercial | Alto | BAJO val/ALTO costo | $$ | NO V1 |
| Sin personalidad | N/A | BAJO | $0 | Viable si no hay presupuesto |

Detalle: `07-alternatives.md`.

## 8. RIESGOS (PASO 9)

3 ALTO (R1 preguntas sin fuente, R3 dimensiones mal definidas, R6 uso laboral no validado), 4 MEDIO, 3 BAJO. El crítico es R6: personalidad pondera `overallScore` (0.30) sin validez predictiva, mostrado a RH. Detalle: `08-risk-analysis.md`.

## 9. LEGAL (PASO 10)

2 ALTO (instrumento no identificado, overall pondera sin validez), 2 MEDIO. Proporcionalidad y estatus de dato sensible: **REQUIERE REVISIÓN LEGAL** (no se inventan artículos). Detalle: `09-legal-review.md`.

## 10. DECISIÓN V1 (PASO 11)

**Recomendación: OPTION A-conservativa (interino) → OPTION B (objetivo condicional).**

- **Interino (V1)**: conservar como indicador experimental, etiquetar «sin validez», aislar del `overallScore`, sin perfil ideal/corte/APTO.
- **Objetivo (post-V1)**: sustituir por IPIP-50-MX validado (EFA/CFA, α, baremos MX, atribución Goldberg).

Condiciones GO detalladas. Esta decisión es DOCUMENTACIÓN; la implementación requiere una fase separada (A-05.2). Detalle: `10-v1-decision.md`.

## 11. REGla JobFit (PASO 12)

**CUMPLIDA**: ninguna dimensión de personalidad se convierte en criterio crítico, perfil ideal, corte, APTO, NO APTO, ni recomendación de contratación. Verificado en `05-current-usage.md` §5–7.

## 12. PERSONALIDAD Y OVERALL (PASO 13)

Tras A-04.5, personalidad **SÍ participa** en overallScore (peso 0.30/0.50/1.00). A-04.5 aisló Integrity pero NO personalidad. A-05.1 documenta (no cambia). La decisión de aislar personalidad queda para la decisión V1 (OPTION A-conservativa).

## 13. IA (PASO 14)

**UNKNOWN** — no se puede determinar si los reactivos fueron generados por IA. `z-ai-web-dev-sdk` no se invoca en `src/`; no hay metadatos de proveniencia. Detalle: `02-item-origin.md` §4.

## 14. ÍNDICE DEL EXPEDIENTE A-05.1

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-current-instrument.md | 1, 5 |
| 02-item-origin.md | 2, 14 |
| 03-rights.md | 3 |
| 04-psychometric-evidence.md | 4 |
| 05-current-usage.md | 6, 12, 13 |
| 06-ipip-comparison.md | 7 |
| 07-alternatives.md | 8 |
| 08-risk-analysis.md | 9 |
| 09-legal-review.md | 10 |
| 10-v1-decision.md | 11 |
| 11-audit-checklist.md | 17 |
| personality-instrument-matrix.csv | 15 |

## 15. AUDITORÍA FINAL

Ver `11-audit-checklist.md` — **15/15 verificadas**.

## 16. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia (`evidence-a05-1/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**; sin migraciones, sin db push, sin escrituras de datos. REGLA ABSOLUTA cumplida.
