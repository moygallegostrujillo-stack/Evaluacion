# A-04.5 — 03 · AISLAMIENTO DE INTEGRITY (PASO 3, 17)

## 1. Decisión

Integrity queda **AISLADA** del cálculo automático de `overallScore` para todas
las nuevas evaluaciones. La justificación metodológica es A-04.2 (OPTION B —
implementar solo después de validación; GATE-1..10 no superados) y A-04.1 C4
("orientative, never auto-filter"). Antes de A-04.5, el demo ya ponderaba
Integrity en overallScore (0.15–1.00) contradiciendo esas decisiones — deuda
documentada en A-04.2 §7 y confirmada en A-04.4.

## 2. Cómo se aísla

En `src/lib/overall-score.ts`, `getExclusionReason()` devuelve
**SIEMPRE** `'INTEGRITY_NOT_APPROVED_FOR_OVERALL'` para el instrumento
INTEGRITY, sin importar si tiene datos:

```typescript
function getExclusionReason(inst: InstrumentInput): ExclusionReason | null {
  if (inst.kind === 'INTEGRITY') {
    return 'INTEGRITY_NOT_APPROVED_FOR_OVERALL'  // incondicional
  }
  // ... resto de la lógica para BF/PSY/KN
}
```

Consecuencia: Integrity NUNCA entra en `includedSections`, NUNCA recibe peso,
NUNCA afecta el `score`. Aparece en `excludedSections` con su razón.

## 3. Lo que NO se hace (regla A-04.5)

- **NO se borra** `integrityScore` del schema (`Float @default(0)` en
  EvaluationResult L277 y VacancyApplication L402 — intacto).
- **NO se borran** resultados históricos. Los rows legacy conservan su
  `integrityScore` y su `overallScore` con la fórmula antigua (LEGACY-OVERALL).
- **NO se recalculan** históricos.
- **NO se modifica** el instrumento de Integridad (las 10 preguntas en
  `generate-templates.ts` y `apply/route.ts` HARDCODED_INTEGRIDAD están intactas).
- **NO se convierte** Integrity en un instrumento "válido".

## 4. Lo que SÍ se hace

Para **nuevas evaluaciones**:
- Integrity se sigue computando (los ítems se sirven, se responden, se puntúan).
- `integrityScore` se persiste en la fila (EvaluationResult / VacancyApplication).
- Integrity aparece en `excludedSections` con razón `INTEGRITY_NOT_APPROVED_FOR_OVERALL`.
- El `overallScore` se calcula SIN Integrity.

## 5. Trazabilidad del aislamiento (PASO 17 — IntegrityResult)

El campo `integrityScore` sigue almacenado separadamente. El `OverallScoreResult`
lo registra en `excludedSections` + `excludedReasons`, de modo que un auditor
puede reconstruir exactamente qué se computó y qué se excluyó. En futuras fases
(cuando GATE-1..10 se superen), el motor puede re-admitir Integrity cambiando
una sola línea en `getExclusionReason()` — sin tocar las rutas.

## 6. Verificación (tests OS-2, OS-14, CASO-A)

- **OS-2**: mismo BF/PSY/KN con INT=55 vs INT=99 → mismo overall (71).
- **OS-2b/c**: Integrity está en `excludedSections` con razón correcta.
- **OS-14**: Integrity score 42 se registra como excluido (no se borra).
- **CASO-A**: BF70+PSY60+KN80+INT30 → overall=71 (0.30·70+0.30·60+0.40·80),
  Integrity no contribuye.

## 7. Coherencia con decisiones previas

| Decisión | Estado tras A-04.5 |
|---|---|
| A-04.1 C4 "orientative, never auto-filter" | **CUMPLIDA** — Integrity ya no auto-filtra/pondera |
| A-04.2 GATE-10 "no entra en overallScore sin aprobación" | **CUMPLIDA** — aislada hasta que GATEs pasen |
| A-04.2 OPTION B "implementar solo después de validación" | **RESPETADA** — no se implementa, solo se aísla |
| A-04.4 Opción B (aislar Integrity) | **IMPLEMENTADA** |
