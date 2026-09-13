# EVALUHR — A-04.5 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# NORMALIZACIÓN Y AISLAMIENTO DE overallScore — IMPLEMENTACIÓN CONTROLADA

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@aa771a9` → A-04.5.
Método: motor canónico puro + refactor de 3 rutas + schema nullable + tests
de función pura. Regla respetada: SOLO se modificó código relacionado
directamente con overallScore; IPIP, Knowledge metodológico, Integridad como
instrumento, Competencias, Interview, JobFit, Recomendaciones, Contrato y
Aviso NO fueron modificados.

---

## 1. FÓRMULA ANTERIOR (PASO 1)

CUATRO implementaciones divergentes activas (ver `01-before.md`):

| # | Sitio | Peso INT | Particularidad |
|---|---|---|---|
| F1 | evaluations L145-339 | 0.15-1.00 | overall pre-canónico (L1350 antes override L1382) |
| F2 | apply por paso L43-233 | 0.15-1.00 | `correctAnswer ?? 0` infla KN |
| F3 | apply final L547-670 | 0.15-1.00 | `integrityScore \|\| 0` |
| F4 | video inline L83-175 | 0 (nunca) | neuroticismo re-invertido, /5 fijo, proporcional |

Mismo candidato → distintos overall según canal (R7: 39.00 vs 71.00).

## 2. MOTOR CANÓNICO (PASO 2-8)

**Archivo nuevo:** `src/lib/overall-score.ts` (~470 líneas).

- `calculateCanonicalOverallScore(input)` — UNA autoridad, función PURA,
  determinista.
- `buildCanonicalInput(...)` — builder compartido que las 3 rutas usan
  (garantiza determinismo PASO 12).
- `OverallScoreResult` con `score`, `includedSections`, `excludedSections`,
  `excludedReasons`, `formulaVersion`.
- `OVERALL_FORMULA_VERSION = 'OVERALL-v1'` (versión técnica, NO modelo validado).
- Pesos históricos PRESERVADOS verbatim (0.30/0.30/0.40 para 3 secciones;
  equal-split para 2; sección directa para 1; 0 para ninguna). Cero pesos nuevos.

Detalle: `02-canonical-engine.md`.

## 3. CAMBIOS

### 3.1 Motor nuevo
- `src/lib/overall-score.ts` (nuevo).

### 3.2 Rutas refactorizadas (delegan al canónico)
- `src/app/api/evaluations/route.ts` — F1 reemplazada + recompute tras
  override canónico (fix bug pre-canónico).
- `src/app/api/public/apply/route.ts` — F2 (por paso) + F3 (final)
  reemplazadas.
- `src/app/api/public/video/route.ts` — F4 ELIMINADA; delega al canónico.

### 3.3 Schema (nullable, sin migración de datos)
- `prisma/schema.prisma` + `prisma/schema.prod.prisma`:
  `formulaVersion`, `includedSections`, `excludedSections`, `excludedReasons`
  (String?) en EvaluationResult + VacancyApplication.
- `db:push` exitoso; cero recálculos.

### 3.4 Tests
- `scripts/a045-tests.ts` — OS-1..OS-15 + casos A/B/C (45/45 pass).

## 4. TRATAMIENTO DE INTEGRITY (PASO 3, 17)

**AISLADA** del overallScore para nuevas evaluaciones. `getExclusionReason()`
devuelve `INTEGRITY_NOT_APPROVED_FOR_OVERALL` incondicionalmente.

- `integrityScore` histórico: PRESERVADO (schema intacto, sin recálculo).
- Integrity se sigue computando y almacenando separadamente.
- Alinea con A-04.1 C4, A-04.2 GATE-10/OPTION B, A-04.4 Opción B.

Detalle: `03-integrity-isolation.md`.

## 5. TRATAMIENTO DE KNOWLEDGE (PASO 4, 5)

- Knowledge canónico sigue siendo el único instrumento con semántica de
  evidencia correcta (VALID/LIMITED/INSUFFICIENT).
- `evidenceStatus` se pasa al motor canónico vía `buildCanonicalInput`.
- INSUFFICIENT → EXCLUIDO (razón INSUFFICIENT), NUNCA 0.
- null → EXCLUIDO (razón NO_DATA), NUNCA 0.
- `correctAnswer ?? 0` (F2 legacy) neutralizado: el KN canónico sobrescribe
  antes del overall.

Detalle: `04-insufficient.md`, `05-null-zero.md`.

## 6. TRATAMIENTO DE INSUFFICIENT (PASO 4)

`INSUFFICIENT / INVALID / PENDING_REVIEW / NOT_APPROVED` → EXCLUIDOS del
overall, NUNCA convertidos a 0. Regla temporal de gobernanza A-04.4
("no-evidencia, no-decisión-global") ahora IMPLEMENTADA en el motor.

## 7. TRATAMIENTO DE NULL (PASO 5)

Eliminadas del path de overallScore:
- `integrityScore || 0` (F3) — Integrity aislada.
- `?? 0` en ausencia de clave — canonical produce null.

Conservadas (legítimas, fuera del path overall):
- retention/consent zeroing (legal).
- display `|| 0` (no afecta overall).

## 8. TRATAMIENTO DE LEGACY (PASO 13, 14)

- `formulaVersion = null` → `LEGACY-OVERALL`.
- Valores históricos PRESERVADOS (overallScore, integrityScore, knowledgeScore).
- Cero recálculos; cero migraciones de datos.
- `classifyOverallLineage()` distingue canónico vs legacy.

Detalle: `10-legacy.md`.

## 9. formulaVersion (PASO 8)

`OVERALL-v1` — versión técnica de fórmula. NO es modelo validado, NO es
umbral, NO es JobFit. Permite saber si un row es canónico o legacy. Bump futura:
`OVERALL-v2` cuando la matriz cambie (e.g. JobFit).

Detalle: `09-versioning.md`.

## 10. PUBLIC VIDEO (PASO 9)

F4 divergente ELIMINADA. El endpoint delega al motor canónico. Divergencias
resueltas: neuroticismo no re-invertido, denominadores adaptativos,
renormalización por matriz de ramas (no proporcional), 0.00-KN participa,
guidance canónica. Gate `===0` conservado como cierre de scoring.

Detalle: `06-video.md`.

## 11. PUBLIC APPLY (PASO 10)

F2 (por paso) + F3 (final) delegan al canónico. Orden persist→compute (A-03.4)
preservado. Puente a EvaluationResult propaga los 4 nuevos campos.

Detalle: `07-public-apply.md`.

## 12. EVALUATIONS (PASO 11)

F1 reemplazada. Bug pre-canónico CORREGIDO: el overall se recomputa tras el
override canónico de Knowledge. Mismo motor → mismo resultado.

Detalle: `08-evaluations.md`.

## 13. TESTS (PASO 15, 16)

`scripts/a045-tests.ts`: 45/45 pass. OS-1..OS-15 + casos A/B/C.

Detalle: `11-tests.md`.

## 14. REGRESIÓN (PASO 19)

Lint CLEAN. Dev server healthy. Rutas compilan on-demand sin 500s. Cero
componentes rotos. Schema sincronizado.

Detalle: `12-regression.md`.

## 15. SEGURIDAD (PASO 20)

- Candidato NO puede modificar overallScore (computado server-side).
- Cliente NO puede enviar formulaVersion/includedSections/excludedSections/
  excludedReasons (no se leen del body en ninguna ruta).
- Integrity NO puede inyectarse desde body.
- Knowledge NO se convierte en 0 por ausencia de clave (canonical → null).

Verificado por grep: `body.(overallScore|formulaVersion|...)` = 0 matches.

## 16. DETERMINISMO (PASO 12)

Mismo dato persistido + mismo resultado de instrumentos = mismo overallScore,
independientemente de evaluations / public/apply / public/video. Garantizado
por el builder compartido `buildCanonicalInput` + el motor puro
`calculateCanonicalOverallScore`. Tests OS-7/8/9.

## 17. RIESGOS

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Legados con Integrity ponderada | LOW | PRESERVADOS (LEGACY-OVERALL); no se reinterpretan |
| Guidance cambia para video candidates (antes BF+PSY+KN=COMPLETO) | LOW | Ahora requiere los 4 (alineado con F1/F3); documentado |
| Per-step overall preliminar (KN legacy) | INFO | Se sobrescribe al completar (F3 canónica) |
| `correctAnswer ?? 0` permanece en F2 legacy | LOW | Neutralizado por override canónico; no afecta overall canónico |

## 18. LIMITACIONES

1. overallScore sigue siendo un agregado técnico, NO un modelo psicométrico
   validado. La validez de los instrumentos subyacentes (Big Five demo, PSY,
   Integridad) NO fue establecida por A-04.5.
2. JobFit NO fue implementado (regla explícita). overallScore ≠ JobFit.
3. Los pesos son los históricos; no se rediseñaron (regla explícita).
4. Integrity sigue computándose y almacenándose pero aislada del overall.
5. Recommendation sigue siendo guidance (PERFIL_COMPLETO/PARCIAL/PENDIENTE),
   sin umbrales de score ni APTO/NO APTO.

## 19. ÍNDICE DEL EXPEDIENTE A-04.5

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-before.md | 1 |
| 02-canonical-engine.md | 2, 7, 8 |
| 03-integrity-isolation.md | 3, 17 |
| 04-insufficient.md | 4 |
| 05-null-zero.md | 5 |
| 06-video.md | 9 |
| 07-public-apply.md | 10 |
| 08-evaluations.md | 11 |
| 09-versioning.md | 8 |
| 10-legacy.md | 13, 14 |
| 11-tests.md | 15, 16 |
| 12-regression.md | 19 |
| 13-audit-checklist.md | 22 |
| overall-canonical-matrix.csv | 21 (matrix) |

## 20. AUDITORÍA FINAL

Ver `13-audit-checklist.md` — **19/19 verificadas**.
