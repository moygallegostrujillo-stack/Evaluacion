# A-05.3 — 03 · AISLAMIENTO DE PERSONALITY DEL OVERALL SCORE (PASO 3, 11)

## 1. Cambio realizado

El motor canónico `src/lib/overall-score.ts` ahora excluye **BIG_FIVE** (Personality) del `overallScore` para todas las nuevas evaluaciones, igual que ya excluía INTEGRITY desde A-04.5.

## 2. Mecanismo

En `getExclusionReason()`:

```typescript
function getExclusionReason(inst: InstrumentInput): ExclusionReason | null {
  // Integrity is unconditionally isolated (A-04.5)
  if (inst.kind === 'INTEGRITY') {
    return 'INTEGRITY_NOT_APPROVED_FOR_OVERALL'
  }
  // A-05.3: Personality (Big Five) is unconditionally isolated from V1 overall
  if (inst.kind === 'BIG_FIVE') {
    return 'PERSONALITY_NOT_APPROVED_FOR_V1'
  }
  // ...rest (null → NO_DATA, evidence status checks)
}
```

BIG_FIVE se excluye **incondicionalmente** — sin importar si tiene score, sin importar el evidenceStatus. La razón registrada es `PERSONALITY_NOT_APPROVED_FOR_V1`.

## 3. Pesos NO redistribuidos

**IMPORTANTE**: No se redistribuyeron pesos manualmente. No se inventaron pesos nuevos. No se convirtió la antigua parte de Personality en cero.

El motor usa la MISMA matriz de ramas histórica:
- 0 secciones → 0
- 1 sección → esa sección
- 2 secciones → equal split (arithmetic mean)
- 3 secciones (BF+PSY+KN) → 0.30·BF + 0.30·PSY + 0.40·KN (inalcanzable en V1 porque BF siempre se excluye)

Como BF se excluye, el conjunto efectivo para V1 es {PSY, KN} (máximo 2 instrumentos). El peso aplicado es equal split (50/50) — el MISMO peso histórico que se usaba cuando solo había 2 secciones presentes.

## 4. Metadata del resultado (PASO 11)

Para nuevas evaluaciones, el `OverallScoreResult`:

| Campo | Valor |
|---|---|
| `includedSections` | NO contiene `BIG_FIVE` (ni `INTEGRITY`) |
| `excludedSections` | Contiene `BIG_FIVE` y `INTEGRITY` |
| `excludedReasons.BIG_FIVE` | `PERSONALITY_NOT_APPROVED_FOR_V1` |
| `excludedReasons.INTEGRITY` | `INTEGRITY_NOT_APPROVED_FOR_OVERALL` |
| `formulaVersion` | `OVERALL-v1.1` |

## 5. Fórmula anterior vs actual

| Aspecto | OVERALL-v1 (A-04.5) | OVERALL-v1.1 (A-05.3) |
|---|---|---|
| Integrity | Excluida | Excluida |
| Personality (Big Five) | **Incluida** (peso 0.30 en 3 secciones) | **Excluida** |
| Effective set | {BF, PSY, KN} | {PSY, KN} |
| 3-section branch | 0.30·BF + 0.30·PSY + 0.40·KN | Inalcanzable |
| 2-section branch | equal split | equal split (igual) |
| Guidance PERFIL_COMPLETO | Requiere BF+PSY+KN+INT | Requiere PSY+KN+INT (no BF) |

## 6. Ejemplo numérico

Candidato con BF=70, PSY=60, KN=80, INT=55:

| Fórmula | Cálculo | Resultado |
|---|---|---|
| OVERALL-v1 (A-04.5) | 0.30·70 + 0.30·60 + 0.40·80 = 21+18+32 | **71.00** |
| OVERALL-v1.1 (A-05.3) | (60+80)/2 = equal split PSY+KN | **70.00** |

Diferencia: 1.00 punto (el peso de BF en la fórmula anterior). Esto es esperado y documentado.

## 7. Determinismo (PASO 15)

El mismo motor canónico atiende las 3 rutas (evaluations, public/apply, public/video). Mismo dato persistido → mismo overall, sin importar el canal. Verificado en tests (DET-1, DET-2).
