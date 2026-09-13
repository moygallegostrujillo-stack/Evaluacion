# A-05.3 — 09 · TESTS (PASO 13, 14, 15)

## 1. Suite

**Archivo**: `scripts/a053-tests.ts` (runnable: `bun scripts/a053-tests.ts`).

Tests de función pura sobre el motor canónico + tests estructurales (lectura de código fuente). No requieren dev server.

## 2. Resultado

```
═══════════════════════════════════════════════════════════════
  RESULT: 34/34 passed
═══════════════════════════════════════════════════════════════
```

## 3. Inventario PERS-01..PERS-14

| ID | Descripción | Resultado |
|---|---|---|
| PERS-01 | Generator does NOT create PSICOMETRICA template for V1 | ✅ |
| PERS-01b | BIG_FIVE_QUESTIONS retained as LEGACY reference | ✅ |
| PERS-02 | BIG_FIVE not in includedSections | ✅ |
| PERS-03 | Overall identical regardless of Big Five value (BF=0 vs BF=99 → same) | ✅ |
| PERS-04 | BIG_FIVE not in includedSections | ✅ |
| PERS-05 | BIG_FIVE in excludedSections | ✅ |
| PERS-06 | excludedReason = PERSONALITY_NOT_APPROVED_FOR_V1 | ✅ |
| PERS-07 | BIG_FIVE excluded regardless of score value | ✅ |
| PERS-08 | No client-supplied personalityScore in any route | ✅ |
| PERS-09 | null formulaVersion → LEGACY-OVERALL (preserved) | ✅ |
| PERS-10 | OVERALL-v1 → canonical A-04.5 (preserved) | ✅ |
| PERS-10b | OVERALL-v1.1 → canonical A-05.3 (current) | ✅ |
| PERS-10c | Current formulaVersion = OVERALL-v1.1 | ✅ |
| PERS-11 | No IPIP in overall-score.ts | ✅ |
| PERS-11b | No IPIP in generate-templates.ts | ✅ |
| PERS-12 | Knowledge INSUFFICIENT excluded | ✅ |
| PERS-12b | KN exclusion reason = INSUFFICIENT | ✅ |
| PERS-13 | INTEGRITY excluded | ✅ |
| PERS-13b | INTEGRITY reason = INTEGRITY_NOT_APPROVED_FOR_OVERALL | ✅ |
| PERS-14 | No JobFit field in result | ✅ |

## 4. Casos de regresión (PASO 14)

| Caso | Input | Esperado | Resultado |
|---|---|---|---|
| A | BF70+PSY60+KN80+INT55 | BF excluida; overall = (60+80)/2 = 70 | ✅ 70 |
| A-b | includedSections = [PSY,KN] | ✅ |
| A-c | excludedSections = [BF,INT] | ✅ |
| B | PSY60+KN80 (no BF) | equal split = 70 (no new weights) | ✅ 70 |
| C | PSY60+KN(INSUFFICIENT) | KN excluido; overall = 60 (PSY alone) | ✅ 60 |
| D | PSY60+KN80+INT30 | INT excluido; overall = 70 | ✅ 70 |
| E | PSY60 alone | single section = 60 | ✅ 60 |

## 5. Determinismo (PASO 15)

| Test | Descripción | Resultado |
|---|---|---|
| DET-1 | Same input → same score | ✅ |
| DET-2 | Same input → same formulaVersion | ✅ |

## 6. Cobertura

- Aislamiento de Personality del overallScore (PERS-02..PERS-07).
- Legacy preservation (PERS-09, PERS-10).
- No IPIP (PERS-11).
- Knowledge intact (PERS-12).
- Integrity isolated (PERS-13).
- No JobFit (PERS-14).
- Casos de regresión A-E cubren todos los escenarios del PASO 14.
- Determinismo entre canales (DET-1, DET-2).
