# A-04.5 — 09 · VERSIONADO DE FÓRMULA (PASO 8)

## 1. Definición

```typescript
export const OVERALL_FORMULA_VERSION = 'OVERALL-v1' as const
```

`OVERALL-v1` es una **versión técnica de fórmula**. Identifica qué matriz de
ramas produjo el `overallScore` persistido.

## 2. Lo que NO es

- NO es un "modelo validado".
- NO es un endoso psicométrico.
- NO es un umbral de decisión.
- NO es APTO/NO APTO.
- NO es JobFit.

Es simplemente un sello técnico que permite:
1. Saber si un row fue producido por el motor canónico (`OVERALL-v1`) o por
   una fórmula legacy (`null` = LEGACY-OVERALL).
2. En futuras fases, bumpar la versión si la matriz de ramas cambia
   (e.g. `OVERALL-v2` cuando JobFit se diseñe).

## 3. Persistencia

Columna nueva `formulaVersion String?` en:
- `EvaluationResult` (schema.prisma L290)
- `VacancyApplication` (schema.prisma L425)

Nullable: los rows pre-A-04.5 quedan en `null` = LEGACY-OVERALL.
Los nuevos rows se estampan con `'OVERALL-v1'`.

## 4. Clasificación

```typescript
export function classifyOverallLineage(
  formulaVersion: string | null | undefined
): 'OVERALL-v1' | 'LEGACY-OVERALL' {
  return formulaVersion === OVERALL_FORMULA_VERSION
    ? 'OVERALL-v1'
    : 'LEGACY-OVERALL'
}
```

| formulaVersion | Clasificación | Acción |
|---|---|---|
| `'OVERALL-v1'` | CANÓNICO | Produjo por el motor canónico |
| `null` | LEGACY-OVERALL | Pre-A-04.5; valor PRESERVADO, nunca recalculado |
| cualquier otro | LEGACY-OVERALL | Desconocido → tratado como legacy (preservado) |

## 5. Bump de versión (futuro)

Si en una fase futura se cambia la matriz de ramas (e.g. re-admitir
Integrity tras GATE-1..10, o introducir JobFit), se debe:
1. Crear `OVERALL-v2` como nueva constante.
2. Actualizar `computeOverallFromIncluded` con la nueva matriz.
3. Actualizar `classifyOverallLineage` para reconocer ambas versiones.
4. Los rows `OVERALL-v1` se PRESERVAN (no se recalculan).

## 6. Verificación (test OS-12)

- `OVERALL_FORMULA_VERSION = 'OVERALL-v1'`.
- Todo `calculateCanonicalOverallScore` retorna `formulaVersion: 'OVERALL-v1'`.
- `classifyOverallLineage(null) = 'LEGACY-OVERALL'`.
- `classifyOverallLineage('OVERALL-v1') = 'OVERALL-v1'`.
