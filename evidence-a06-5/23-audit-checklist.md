# A-06.5 — 23 · Auditoría Final (PASO 29)

## Checklist (29 cajas)

- [x] cada pregunta tiene competencyId
  → `03-question-schema.md`: InterviewQuestion.competencyId obligatorio.

- [x] cada pregunta tiene indicatorId
  → `03-question-schema.md`: InterviewQuestion.indicatorId obligatorio (array).

- [x] cada pregunta tiene jobId
  → vía guideId (InterviewGuide.jobId); `05-bdi-design.md` §5 mapeo.

- [x] cada pregunta tiene rationale
  → `05-bdi-design.md` §5: rationale obligatorio; sin los 4 elementos → NO_PUBLICABLE.

- [x] cada pregunta busca conducta pasada
  → `05-bdi-design.md`: BDI primaria busca situación real pasada; "¿qué harías?" no es BDI suficiente.

- [x] evidencia esperada definida
  → `07-evidence-rules.md`: evidenceExpected (WHAT_COUNTS_AS_EVIDENCE) por pregunta.

- [x] probes definidos
  → `06-probes.md`: banco conceptual (universales + específicos); ejemplos NO PRODUCTIVO.

- [x] respuesta hipotética diferenciada
  → `08-response-states.md`: HYPOTHETICAL → LIMITED (no SUPPORTED sin conducta pasada).

- [x] respuesta vaga diferenciada
  → `08-response-states.md`: GENERAL_CLAIM/OPINION → INSUFFICIENT (≠ 0).

- [x] conflictos definidos
  → A-06.3 `10-conflicts.md` + A-06.5 (CV vs entrevista → PENDING_REVIEW; no promediar).

- [x] rúbrica cualitativa
  → `09-rubric.md`: NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG; sin puntos/1-5/0-100.

- [x] sin scoring
  → CompetencyResult sin campo score; niveles cualitativos; no pesos ni cortes.

- [x] sin pesos
  → No pesos entre competencias; no pesos en rúbrica.

- [x] sin cortes
  → No umbrales; no APTO/NO_APTO; no percentiles.

- [x] sin JobFit
  → CompetencyResult ≠ JobFit; JobFit NOT IMPLEMENTED; ninguna conexión nueva.

- [x] IA limitada
  → `13-ai-boundaries.md`: asiste (borradores/probes/resúmenes) pero NO decide; AI_GENERATED + HUMAN_REVIEWED.

- [x] revisión humana
  → `14-human-review.md`: InterviewReview append-only; reviewer humano; IA nunca aprueba.

- [x] versionado
  → `15-versioning.md`: Guide/Question/Probe/Rubric/Review/Result versionados; inmutable lo publicado; no reinterpretar históricos.

- [x] trazabilidad
  → `16-traceability.md`: cadena jobId→competencyId→indicatorId→questionId→questionVersion→responseId→evidenceState→reviewerId→reviewVersion.

- [x] sesgo auditado
  → `11-bias-review.md`: auditoría por pregunta contra atributos protegidos; estados PUBLICABLE/CONDICIONAL/NO_PUBLICABLE/LEGAL_REVIEW.

- [x] proporcionalidad auditada
  → `12-proportionality.md`: 6 preguntas por pregunta; NO_PUBLICABLE si falla.

- [x] estado legal asignado
  → `17-legal-status.md`: legalStatus por pregunta; CONDICIONAL/LEGAL_REVIEW no entran ACTIVE sin revisión.

- [x] ejemplos marcados NO PRODUCTIVO
  → `20-examples.md` + `21-bank-candidate.md`: todos EJEMPLO — NO PRODUCTIVO; status DRAFT/EXAMPLE.

- [x] governance
  → `18-governance.md`: DRAFT→REVIEW→APPROVED→ACTIVE→SUSPENDED→RETIRED; Author/Reviewer/Approver separados; IA nunca aprueba.

- [x] gates
  → `19-activation-gates.md`: INTERVIEW-G1..G10; G7 (legal) + G9 (pilot) bloquean activación V1.

- [x] no código modificado
  → `git status`: solo `evidence-a06-5/` (nuevo) + worklog; cero cambios en src/, prisma/, scripts/, public/.

- [x] no schema modificado
  → Sin cambios en prisma/schema.prisma.

- [x] no contrato modificado
  → A-06.5 no redacta ni modifica contrato.

- [x] no aviso modificado
  → A-06.5 no redacta ni modifica aviso de privacidad.

## Resultado: 29/29 ✓
