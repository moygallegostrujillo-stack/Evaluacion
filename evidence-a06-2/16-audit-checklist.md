# A-06.2 — 16 · Auditoría Final (PASO 23)

## Checklist (24 cajas)

- [x] competencia definida
  → `02-definition.md`: Competency { competencyId, name, definition, behavioralIndicators, evidenceTypes, source, version, status }.

- [x] distinta de personalidad
  → `15-overlap-audit.md` §3.1: personalidad mide rasgos latentes (auto-reporte); competencia mide conductas observables (BDI/STAR).

- [x] distinta de conocimiento
  → `15-overlap-audit.md` §3.2: Knowledge mide recurso cognitivo (test); competencia mide conducta de aplicación.

- [x] distinta de integridad
  → `15-overlap-audit.md` §3.3: Integrity mide honestidad/cumplimiento; competencia mide conducta laboral específica.

- [x] distinta de experiencia
  → `07-evidence-model.md` §3: experiencia mide tiempo; competencia mide calidad de conducta actual.

- [x] indicadores observables
  → `04-behavioral-indicators.md`: verbo presente, contexto laboral, observable por tercero.

- [x] indicadores específicos
  → `04-behavioral-indicators.md`: no "es responsable" (vago); sí "formula preguntas de clarificación" (específico).

- [x] indicadores no redundantes
  → `05-indicator-validation.md` CI-VAL-4 (diferenciable) + CI-VAL-5 (no redundante).

- [x] indicadores no discriminatorios
  → `05-indicator-validation.md` CI-VAL-6 + `12-bias.md`.

- [x] evidencia definida
  → `07-evidence-model.md`: 6 tipos (INTERVIEW_STAR, OBSERVATION, WORK_SAMPLE, SJT, REFERENCE, DOCUMENT).

- [x] jobRelevance trazable
  → `06-job-linkage.md`: VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW con jobElement + rationale + source + approvedBy.

- [x] criticality trazable
  → `06-job-linkage.md` §4: CRITICAL/IMPORTANT/STANDARD con justification + source + approver; IA no decide.

- [x] aprobación humana
  → `14-governance.md`: reviewedBy + approvedBy humanos; IA nunca cruza a APPROVED.

- [x] IA sin autoridad
  → `11-ai-boundaries.md`: IA asiste (borradores/probes/resúmenes) pero NO decide/aprueba/clasifica.

- [x] versionado
  → `02-definition.md` §6: COMP-v{n}, JobCompetency-v{n}; immutable published; bump = new version.

- [x] governance
  → `14-governance.md`: DRAFT→REVIEW→APPROVED→ACTIVE→SUSPENDED→RETIRED; 4 roles; trazabilidad inmutable.

- [x] conflictos definidos
  → `10-conflicts.md`: NO promediar; NO "gana el más alto"; PENDING_REVIEW con resolución humana.

- [x] INSUFFICIENT ≠ 0
  → `09-insufficient.md`: INSUFFICIENT/NO_EVIDENCE/PENDING_REVIEW nunca se convierten en 0.

- [x] STAR definido
  → `08-star-method.md`: Situation/Task/Action/Result; Action = evidencia clave; Result positivo ≠ competencia.

- [x] ejemplos marcados NO PRODUCTIVO
  → `04-behavioral-indicators.md` + `06-job-linkage.md` + `08-star-method.md`: todos los ejemplos marcados "EJEMPLO — NO PRODUCTIVO".

- [x] no scoring
  → CompetencyResult sin campo score; niveles cualitativos (NO_EVIDENCE..STRONG); no pesos ni cortes.

- [x] no JobFit
  → CompetencyResult ≠ JobFit; JobFit NOT IMPLEMENTED; ninguna conexión nueva.

- [x] no código modificado
  → `git status`: solo `evidence-a06-2/` (nuevo) + worklog; cero cambios en src/, prisma/, scripts/, public/.

## Resultado: 24/24 ✓
