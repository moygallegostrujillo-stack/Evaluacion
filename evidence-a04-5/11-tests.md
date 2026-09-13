# A-04.5 — 11 · TESTS (PASO 15, 16)

## 1. Suite

**Archivo:** `scripts/a045-tests.ts` (runnable: `bun scripts/a045-tests.ts`).

Tests de función pura sobre el motor canónico
(`src/lib/overall-score.ts`). No requieren dev server. Cubren OS-1..OS-15
+ casos A/B/C.

## 2. Resultado

```
═══════════════════════════════════════════════════════════════
  RESULT: 45/45 passed
═══════════════════════════════════════════════════════════════
```

## 3. Inventario OS-1..OS-15

| ID | Descripción | Resultado |
|---|---|---|
| OS-1 | Fórmula única (engine produces OVERALL-v1) | ✅ |
| OS-1b | canonical 3-section score (BF70 PSY60 KN80 → 71) | ✅ |
| OS-2 | Integrity no participa (INT 55 vs 99 → mismo 71) | ✅ |
| OS-2b | Integrity en excludedSections | ✅ |
| OS-2c | razón INTEGRITY_NOT_APPROVED_FOR_OVERALL | ✅ |
| OS-3 | KN INSUFFICIENT excluido (nunca 0) | ✅ |
| OS-3b | razón INSUFFICIENT | ✅ |
| OS-3c | overall excluye INSUFFICIENT KN (→ 65) | ✅ |
| OS-4 | KN null excluido (razón NO_DATA) | ✅ |
| OS-4c | overall excluye null KN (→ 65) | ✅ |
| OS-5 | INVALID no participa | ✅ |
| OS-6 | PENDING_REVIEW no participa | ✅ |
| OS-7 | same input → same score (determinismo) | ✅ |
| OS-8 | evaluations vs public/apply → mismo resultado | ✅ |
| OS-9 | public/video vs public/apply → mismo resultado | ✅ |
| OS-9b | video NO re-invierte neuroticismo | ✅ |
| OS-10 | 2 secciones → equal split (NO proporcional) | ✅ |
| OS-11 | null formulaVersion → LEGACY-OVERALL | ✅ |
| OS-12 | formulaVersion = OVERALL-v1 | ✅ |
| OS-13 | includedSections/excludedSections correctas | ✅ |
| OS-14 | Integrity permanece disponible (excluded, no borrada) | ✅ |
| OS-15 | No JobFit generado (sin campos jobfit/apto/decision) | ✅ |

## 4. Casos A/B/C (PASO 16)

### Caso A — BF+PSY+KN valid, INT insufficient
```
BF=70, PSY=60, KN=80 (VALID), INT=30
→ overall = 71  (0.30·70 + 0.30·60 + 0.40·80)
→ Integrity EXCLUIDA
→ KN INCLUIDA (VALID)
→ guidance = PERFIL_COMPLETO (los 4 tienen datos)
```

### Caso B — BF+PSY valid, KN insufficient, INT insufficient
```
BF=70, PSY=60, KN=50 (INSUFFICIENT), INT=30
→ overall = 65  ((70+60)/2, equal split)
→ includedSections = [BIG_FIVE, PSYCHOLOGICAL]
→ excludedSections = [KNOWLEDGE, INTEGRITY]
→ guidance = PERFIL_PARCIAL (KN no cuenta: INSUFFICIENT)
```

### Caso C — solo una sección válida
```
BF=70, PSY=null, KN=null, INT=null
→ overall = 70  (esa sección directamente)
→ includedSections = [BIG_FIVE]
→ guidance = PERFIL_PARCIAL
→ Comportamiento documentado: histórica branch "1 sección = esa sección"
   (F1 L266, F2 L162, F3 L571). No se inventan pesos nuevos.
```

## 5. Cobertura

- Determinismo entre canales (OS-7, OS-8, OS-9): el MISMO
  `buildCanonicalInput` + `calculateCanonicalOverallScore` en las 3 rutas.
- Aislamiento de Integrity (OS-2, OS-14, CASO-A).
- INSUFFICIENT/INVALID/PENDING_REVIEW ≠ 0 (OS-3, OS-5, OS-6).
- null ≠ 0 (OS-4).
- Legacy preservation (OS-11).
- formulaVersion (OS-12).
- Sin JobFit (OS-15).
