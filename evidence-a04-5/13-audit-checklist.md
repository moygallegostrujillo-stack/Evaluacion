# A-04.5 — 13 · AUDITORÍA FINAL (PASO 22)

## Checklist (19 cajas)

- [x] existe un solo motor overallScore
  → `src/lib/overall-score.ts` `calculateCanonicalOverallScore()` — UNA autoridad.

- [x] public/video no tiene fórmula propia
  → F4 inline eliminada; delega al canónico (`src/app/api/public/video/route.ts` L99+).

- [x] public/apply usa motor canónico
  → F2 (L165) + F3 (L566) delegan a `buildCanonicalInput` + `calculateCanonicalOverallScore`.

- [x] evaluations usa motor canónico
  → `calculateScores()` L278 + recompute en `completeEvaluation()` L1365.

- [x] Integrity no entra automáticamente
  → `getExclusionReason()` devuelve `INTEGRITY_NOT_APPROVED_FOR_OVERALL` incondicional.

- [x] Integrity permanece separada
  → `integrityScore` en schema intacto; se computa y persiste; registrada en `excludedSections`.

- [x] INSUFFICIENT ≠ 0
  → excluido con razón `INSUFFICIENT` (test OS-3).

- [x] INVALID ≠ 0
  → excluido con razón `INVALID` (test OS-5).

- [x] PENDING_REVIEW ≠ 0
  → excluido con razón `PENDING_REVIEW` (test OS-6).

- [x] null no se convierte en 0
  → excluido con razón `NO_DATA` (test OS-4).

- [x] legacy intacto
  → `formulaVersion = null` → LEGACY-OVERALL; valores PRESERVADOS (test OS-11).

- [x] formulaVersion registrada
  → `OVERALL-v1` persistida en `formulaVersion` columna (test OS-12).

- [x] mismo input produce mismo output
  → builder compartido `buildCanonicalInput` + motor puro (tests OS-7, OS-8, OS-9).

- [x] cliente no puede establecer score
  → grep `body.(overallScore|...)` = 0 matches; overall computado server-side.

- [x] JobFit no fue implementado
  → resultado sin campos JobFit/APTO/decision (test OS-15).

- [x] IPIP no fue modificado
  → grep `IPIP` en src/ = 0; `generate-templates.ts` intacto.

- [x] Knowledge no fue rediseñado
  → `knowledge-canonical.ts` intacto; solo se consume su `evidenceStatus`.

- [x] contrato intacto
  → sin cambios en contrato/aviso (solo schema nullable + código overall).

- [x] aviso intacto
  → `Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf` sin cambios.

## Verificación adicional (PASO 17, 18, 20)

- [x] IntegrityResult sigue almacenado separadamente (PASO 17)
  → `integrityScore` Float @default(0) en EvaluationResult + VacancyApplication.

- [x] overallScore ≠ JobFit (PASO 18)
  → ninguna conexión automática nueva; JobFit NOT IMPLEMENTED.

- [x] Cliente no puede enviar formulaVersion (PASO 20)
  → no se lee del body en ninguna ruta.

- [x] Cliente no puede establecer includedSections/excludedSections (PASO 20)
  → no se leen del body; computados por el motor.

- [x] Knowledge no se convierte en 0 por ausencia de clave (PASO 20)
  → canonical produce `null`; motor excluye como NO_DATA.

## Resultado: 19/19 + verificaciones adicionales ✓
