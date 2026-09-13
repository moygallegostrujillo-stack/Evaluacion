# A-05.3 — 04 · LEGACY (PASO 4, 9, 10)

## 1. Regla

**No cambiar. No recalcular. No actualizar. No reinterpretar.**

Los resultados históricos que utilizaron Personality se clasifican como `LEGACY-OVERALL` y se preservan intactos.

## 2. Clasificación de lineage

| formulaVersion | Clasificación | Comportamiento |
|---|---|---|
| `null` | LEGACY-OVERALL | Pre-A-04.5; 4 fórmulas divergentes; valor preservado |
| `'OVERALL-v1'` | OVERALL-v1 (A-04.5) | Integrity excluida, Personality incluida; valor preservado |
| `'OVERALL-v1.1'` | OVERALL-v1.1 (A-05.3) | Integrity + Personality excluidas; NUEVAS evaluaciones |

## 3. Qué se preserva

Para cada row histórico (LEGACY-OVERALL o OVERALL-v1):

| Campo | Acción |
|---|---|
| `overallScore` | PRESERVADO — sin recálculo |
| `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` | PRESERVADOS — sin nullificar |
| `integrityScore` | PRESERVADO |
| `knowledgeScore` | PRESERVADO |
| `recommendation` | PRESERVADO (guidance histórica) |
| `summary` | PRESERVADO |
| `formulaVersion` | PRESERVADO (null u 'OVERALL-v1') |
| `includedSections` | PRESERVADO |
| `excludedSections` | PRESERVADO |
| `excludedReasons` | PRESERVADO |

## 4. No retroactividad (PASO 9)

- No se convierte `personalityScore → null` retroactivamente.
- No se eliminan columnas históricas.
- No se modifica ningún dato histórico.
- Los rows existentes conservan exactamente sus valores.

## 5. Detección

```typescript
const lineage = classifyOverallLineage(row.formulaVersion)
// null         → 'LEGACY-OVERALL'  (pre-A-04.5)
// 'OVERALL-v1' → 'OVERALL-v1'      (A-04.5, personality included)
// 'OVERALL-v1.1' → 'OVERALL-v1.1'  (A-05.3, personality excluded)
```

Un consumidor puede usar `formulaVersion` para saber si un overall fue computado con o sin Personality.

## 6. Frontend para legacy

- Si un row histórico tiene Big Five data (scores > 0), el frontend muestra el radar con etiqueta "(legado)".
- Si un row V1 nuevo no tiene Big Five data (scores = 0), el frontend muestra "Evaluación de personalidad: no disponible en V1".
- No se borran componentes históricos; la distinción es por presencia/ausencia de datos.

## 7. Verificación (tests PERS-09, PERS-10)

- PERS-09: `classifyOverallLineage(null) = 'LEGACY-OVERALL'` (preserved).
- PERS-10: `classifyOverallLineage('OVERALL-v1') = 'OVERALL-v1'` (preserved).
- PERS-10b: `classifyOverallLineage('OVERALL-v1.1') = 'OVERALL-v1.1'` (current).
