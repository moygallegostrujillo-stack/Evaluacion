# A-04.5 — 02 · MOTOR CANÓNICO (PASO 2, 7, 8)

## 1. Diseño

**Archivo:** `src/lib/overall-score.ts` (nuevo, ~470 líneas).

Una SOLA autoridad técnica para el cálculo de `overallScore`:

```typescript
calculateCanonicalOverallScore(input: CanonicalOverallInput): CanonicalOverallOutput
```

Función PURA — sin acceso a DB, sin I/O. Determinista: idénticas entradas
producen idéntico `OverallScoreResult` sin importar el canal.

## 2. Estructura del resultado (PASO 7)

```typescript
interface OverallScoreResult {
  score: number                              // 0-100, redondeo 2 decimales
  includedSections: InstrumentKind[]         // instrumentos que participaron
  excludedSections: InstrumentKind[]         // instrumentos excluidos
  excludedReasons: Record<InstrumentKind, ExclusionReason>
  formulaVersion: 'OVERALL-v1'              // versión técnica de fórmula
}

interface CanonicalOverallOutput extends OverallScoreResult {
  guidance: 'PERFIL_COMPLETO' | 'PERFIL_PARCIAL' | 'PENDIENTE'
}
```

## 3. Tipos de entrada

```typescript
type InstrumentKind = 'BIG_FIVE' | 'PSYCHOLOGICAL' | 'KNOWLEDGE' | 'INTEGRITY'

type EvidenceStatus =
  | 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'INVALID'
  | 'PENDING_REVIEW' | 'NOT_APPROVED' | null

interface InstrumentInput {
  kind: InstrumentKind
  score: number | null        // null = sin datos
  evidenceStatus?: EvidenceStatus
}
```

## 4. Lógica de exclusión (el núcleo del aislamiento)

```
getExclusionReason(inst):
  INTEGRITY        → 'INTEGRITY_NOT_APPROVED_FOR_OVERALL'  (SIEMPRE)
  score === null   → 'NO_DATA'                              (nunca 0)
  evidenceStatus ∈ {INSUFFICIENT, INVALID, PENDING_REVIEW, NOT_APPROVED}
                   → ese status                              (nunca 0)
  otherwise        → null (INCLUIDO)
```

## 5. Pesos históricos PRESERVADOS (PASO 6)

La matriz de ramas es la MISMA de F1/F2/F3, con Integrity forzadamente
excluida. El conjunto efectivo es subconjunto de {BF, PSY, KN}:

| Incluidos | Fórmula | Origen histórico |
|---|---|---|
| 0 | 0 | F1 L264, F2 L160, F3 L569 |
| 1 | esa sección | F1 L266, F2 L162, F3 L571 |
| 2 | promedio simple (split igual) | F1 L272, F2 L168, F3 L576 |
| 3 (BF+PSY+KN) | 0.30·BF + 0.30·PSY + 0.40·KN | F1 L288, F2 L184, F3 L613 |

**Ningún peso nuevo fue inventado.** Los pesos 0.25/0.15/0.35 (4 secciones con
Integrity) ya no aplican porque Integrity está aislada.

## 6. Guidance (recomendación = orientación, NO decisión)

```
PERFIL_COMPLETO = los 4 instrumentos tienen datos con evidencia válida
PERFIL_PARCIAL  = 1-3 instrumentos con datos
PENDIENTE       = 0 instrumentos con datos
```

Un instrumento con evidencia INSUFFICIENT/INVALID NO cuenta para COMPLETO
(reproduce la semántica histórica donde INSUFFICIENT → knowledgeScore=null
→ `!== null` false).

## 7. Builders compartidos (PASO 12 — determinismo)

```typescript
buildCanonicalInput(bigFive, psych, knowledgeScore, knowledgeEvidenceStatus, integrityScore)
```

Reconstruye los agregados BF/PSY desde las dimensiones persistidas (adaptativo:
solo dims > 0), exactamente la lógica histórica. Las tres rutas usan ESTA
función → mismo dato persistido → mismo overall.

## 8. Serialización

Las columnas schema son `String?` (no listas). Helpers:
- `serializeSections([...])` → JSON string
- `serializeExcludedReasons({...})` → JSON string
- `deserializeSections` / `deserializeExcludedReasons` → parseo seguro

## 9. Versionado (PASO 8)

```typescript
OVERALL_FORMULA_VERSION = 'OVERALL-v1'
```

`OVERALL-v1` es una **versión técnica de fórmula** — identifica qué matriz de
ramas produjo el score. NO es un "modelo validado", NO es un endoso
psicométrico, NO es un umbral de decisión.

## 10. Lo que el motor NO hace (límites A-04.5)

- NO define nuevos pesos.
- NO define puntos de corte.
- NO define percentiles.
- NO define APTO/NO APTO.
- NO crea JobFit (PASO 18 — verificado: el resultado no tiene campos JobFit).
- NO modifica IPIP / Knowledge metodológico / Integridad como instrumento.
