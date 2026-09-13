# A-04.5 — 10 · LEGACY OVERALL (PASO 13, 14)

## 1. Regla

**No recalcular históricos.** Los resultados anteriores a OVERALL-v1 se
clasifican `LEGACY-OVERALL` y conservan exactamente sus valores.

## 2. Qué es LEGACY-OVERALL

Un row con `formulaVersion IS NULL` (o cualquier valor ≠ `'OVERALL-v1'`).

| Campo | Comportamiento LEGACY |
|---|---|
| `overallScore` | PRESERVADO — valor calculado por F1/F2/F3/F4 histórico |
| `integrityScore` | PRESERVADO — sin cambios |
| `knowledgeScore` | PRESERVADO — sin cambios |
| `recommendation` | PRESERVADO — guidance histórico |
| `summary` | PRESERVADO |
| `formulaVersion` | `null` (no existía antes de A-04.5) |
| `includedSections` | `null` |
| `excludedSections` | `null` |
| `excludedReasons` | `null` |

## 3. Migración (PASO 14)

**No se modifica ningún dato histórico.** La adición de las columnas
`formulaVersion`, `includedSections`, `excludedSections`, `excludedReasons`
(String?, nullable) NO requiere migración:

- `db:push` añade las columnas con `null` por defecto en rows existentes.
- Los rows existentes quedan automáticamente clasificados como LEGACY-OVERALL.
- Cero escrituras de datos; cero recálculos.

## 4. Detección

```typescript
const lineage = classifyOverallLineage(row.formulaVersion)
// 'OVERALL-v1' → motor canónico (post-A-04.5)
// 'LEGACY-OVERALL' → pre-A-04.5, PRESERVADO
```

Un consumidor (dashboard, results, comparador) puede usar `formulaVersion`
para saber si un overall es canónico o legacy, y mostrarlo/mantenerlo según
corresponda. **Ningún consumidor fue modificado para rechazar legados** —
todos siguen leyendo `overallScore` como número.

## 5. Integridad referencial

- `integrityScore` histórico: PRESERVADO (schema `Float @default(0)` intacto).
- `knowledgeScore` histórico: PRESERVADO (schema `Float?` intacto).
- `KnowledgeResult` histórico: PRESERVADO (tabla intacta).
- `EvaluationResult` / `VacancyApplication` históricos: PRESERVADOS.

## 6. Por qué no se recalcula

1. **Trazabilidad**: recalcular destruiría el registro histórico de qué se
   computó en su momento.
2. **Consentimiento LFPDPPP**: los datos se procesaron bajo un aviso de
   privacidad; reinterpretar el overall cambiaría el tratamiento.
3. **Estabilidad**: los reports/dashboard que ya consumen estos valores no
   deben ver cambios silenciosos.
4. **Aislamiento**: los legados pueden tener Integrity ponderada — eso es
   parte del registro histórico, no un error a corregir retroactivamente.

## 7. Verificación (test OS-11)

- `classifyOverallLineage(null) = 'LEGACY-OVERALL'`.
- `classifyOverallLineage(undefined) = 'LEGACY-OVERALL'`.
- `classifyOverallLineage('OVERALL-v1') = 'OVERALL-v1'`.
