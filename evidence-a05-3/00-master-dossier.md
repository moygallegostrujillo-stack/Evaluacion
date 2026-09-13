# EVALUHR — A-05.3 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# RETIRO CONTROLADO DEL BIG FIVE DEMO DE V1 — IMPLEMENTACIÓN CONTROLADA (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@aa771a9` → A-05.3.
Método: implementación quirúrgica del motor canónico + generator + frontend + tests.
Regla: REGLA DE DETENCIÓN — SÍ se modificó código de Personality, generación de Personality,
aislamiento en overallScore, frontend y tests. NO se modificaron: IPIP, Knowledge metodológico,
Integrity metodológica, Competencies, JobFit, nuevos pesos, nuevos cortes, recomendación metodológica.

---

## 1. ESTADO ANTERIOR (PASO 1)

Big Five demo de 10 reactivos PROJECT-CREATED, sin citar fuente. Personality participaba en
`overallScore` con peso 0.30 (3 secciones) / 0.50 (2 secciones) / 1.00 (1 sección) en el motor
canónico OVERALL-v1 (A-04.5). Generator creaba PSICOMETRICA template + 10 preguntas para cada
nuevo position. Frontend mostraba "Test de personalidad Big Five" sin neutralidad. Detalle: `01-before.md`.

## 2. ESTADO V1 (PASO 2)

```
PERSONALITY_V1_STATUS = NOT_IMPLEMENTED
Big Five demo = LEGACY / DEVELOPMENT_ONLY
```

Personalidad NO participa como instrumento formal de V1. Detalle: `02-personality-status.md`.

## 3. CAMBIOS REALIZADOS

### 3.1 Motor canónico (`src/lib/overall-score.ts`)
- `getExclusionReason()`: BIG_FIVE excluido incondicionalmente con razón `PERSONALITY_NOT_APPROVED_FOR_V1`.
- `OVERALL_FORMULA_VERSION` bumped: `'OVERALL-v1'` → `'OVERALL-v1.1'`.
- `ExclusionReason`: añadido `'PERSONALITY_NOT_APPROVED_FOR_V1'`.
- `classifyOverallLineage()`: reconoce `null` (LEGACY), `'OVERALL-v1'` (A-04.5), `'OVERALL-v1.1'` (A-05.3).
- Guidance `allPresent`: ya no requiere Big Five data (V1 candidate con PSY+KN+INT = PERFIL_COMPLETO).

### 3.2 Generator (`src/lib/generate-templates.ts`)
- `generateTemplatesForPosition()`: NO crea PSICOMETRICA template + Big Five questions para nuevos positions.
- `BIG_FIVE_QUESTIONS` array: retenido como `LEGACY / DEVELOPMENT_ONLY` (referencia + legacy serving).

### 3.3 Frontend (6 vistas)
- EvaluationView: descripción neutral ("indicador experimental, no disponible como instrumento formal en V1").
- PublicEvaluationView: STEP_LABEL + sidebar neutral.
- CandidateDetailView: Big Five radar condicional (legacy data → radar "(legado)"; V1 → "no disponible en V1").
- CompareView: Big Five radar condicional.
- InvitationWelcomeView: texto neutral.
- ConsentView: eliminó "Big Five"; texto neutral.

### 3.4 Tests (`scripts/a053-tests.ts`)
- PERS-01..PERS-14 + casos A-E + determinismo = 34/34 PASS.

## 4. TRATAMIENTO HISTÓRICO (PASO 4, 9)

- `formulaVersion = null` → LEGACY-OVERALL (pre-A-04.5; preservado).
- `formulaVersion = 'OVERALL-v1'` → A-04.5 canonical (Personality incluida; preservado).
- `formulaVersion = 'OVERALL-v1.1'` → A-05.3 canonical (Personality excluida; nuevas evaluaciones).
- Columnas BF (openness…neuroticism): PRESERVADAS, no nullificadas.
- overallScore histórico: PRESERVADO, no recalculado.

Detalle: `04-legacy.md`.

## 5. IMPACTO EN OVERALLSCORE (PASO 3, 11, 12)

Personality **NO participa** en nuevas evaluaciones. El motor excluye BIG_FIVE con
`PERSONALITY_NOT_APPROVED_FOR_V1`. No se redistribuyeron pesos; no se inventaron pesos nuevos.
El conjunto efectivo V1 es {PSY, KN} con equal split (peso histórico). Fórmula anterior
(OVERALL-v1, BF incluida con peso 0.30) vs actual (OVERALL-v1.1, BF excluida). Detalle: `03-overall-isolation.md`.

## 6. FRONTEND (PASO 6)

6 vistas modificadas con lenguaje neutral. Big Five radar condicional (legacy data visible si existe;
V1 muestra "no disponible"). No se usaron términos "validado/científico/predictivo/perfil ideal".
Detalle: `05-frontend.md`.

## 7. API (PASO 7)

Ninguna ruta nueva puede generar/aceptar/escribir/incorporar Personality al overallScore. El engine
excluye BIG_FIVE incondicionalmente. No hay flag client-side para activar Personality. Detalle: `06-api.md`.

## 8. GENERADORES (PASO 8)

`generateTemplatesForPosition` no crea PSICOMETRICA template. `BIG_FIVE_QUESTIONS` retenido como
LEGACY/DEVELOPMENT_ONLY. Detalle: `07-generators.md`.

## 9. IA (PASO 10)

La IA no puede generar/publicar/modificar/activar personalidad. Bloqueo estructural (código).
Detalle: `08-ai-boundaries.md`.

## 10. TESTS (PASO 13, 14, 15)

34/34 PASS. PERS-01..PERS-14 + casos A-E + determinismo. Detalle: `09-tests.md`.

## 11. REGRESIÓN (PASO 14, 15, 17, 18)

Lint CLEAN. 34/34 tests. Dev server healthy. Browser renders. Sin errores nuevos. Security: cliente
no puede activar Personality ni enviar personalityScore. Detalle: `10-regression.md`.

## 12. RIESGOS

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Legacy positions still serve Big Five | LOW | Responses persisten pero NO alimentan overallScore (engine excluye) |
| overallScore cambia para mismo input (BF excluida) | EXPECTED | Documentado: OVERALL-v1 (71) vs OVERALL-v1.1 (70) para BF70+PSY60+KN80 |
| V1 candidates see "no disponible" where legacy had radar | LOW | Neutral UX; honest about NOT_IMPLEMENTED |

## 13. LIMITACIONES

1. Personality NO está implementada en V1 (regla A-05.2 OPTION E).
2. IPIP-50-MX NO está instalado (requiere PERSONALITY-G1..G10, ~12–18 meses).
3. Los pesos son los históricos; no se rediseñaron (regla explícita).
4. overallScore sigue siendo un agregado técnico, NO un modelo psicométrico validado.
5. JobFit NOT IMPLEMENTED.
6. Legacy rows con Personality incluida se PRESERVAN (no se reinterpretan).

## 14. ÍNDICE DEL EXPEDIENTE A-05.3

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-before.md | 1 |
| 02-personality-status.md | 2 |
| 03-overall-isolation.md | 3, 11, 12 |
| 04-legacy.md | 4, 9, 10 |
| 05-frontend.md | 6 |
| 06-api.md | 7 |
| 07-generators.md | 8 |
| 08-ai-boundaries.md | 10 |
| 09-tests.md | 13, 14, 15 |
| 10-regression.md | 14, 15, 17, 18 |
| 11-audit-checklist.md | 19 |
| personality-v1-status.csv | 16 (matrix) |

## 15. AUDITORÍA FINAL

Ver `11-audit-checklist.md` — **18/18 verificadas**.

## 16. PRUEBA DE NO MODIFICACIÓN DE COMPONENTES PROHIBIDOS

`git status` al cierre: cambios SOLO en `src/lib/overall-score.ts`, `src/lib/generate-templates.ts`,
`src/components/views/*.tsx` (6 archivos), `scripts/a053-tests.ts` (nuevo), `evidence-a05-3/` (nuevo).
**Cero cambios** en: IPIP (no existe), Knowledge (`knowledge-canonical.ts` intacto), Integrity
(`generate-templates.ts` INTEGRIDAD_QUESTIONS intacto), Competencies, JobFit, contrato, aviso PDF.
