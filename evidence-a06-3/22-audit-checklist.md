# A-06.3 — 22 · Auditoría Final (PASO 31)

## Checklist (24 cajas)

- [x] entrevista estructurada definida
  → `04-interview-structure.md`: INTRODUCCIÓN→CONSENTIMIENTO→PREGUNTAS→PROBES→CIERRE→REVISIÓN; misma estructura comparable.

- [x] BDI definido
  → `02-bdi.md`: Behavioral Description Interview; pregunta por conducta pasada; Huffcutt/Arthur/Pulakos.

- [x] STAR definido
  → `03-star.md`: Situation/Task/Action/Result; Action = evidencia clave; Resultado positivo ≠ competencia.

- [x] pregunta vinculada a competencia
  → `05-question-design.md`: InterviewQuestion con competencyId + indicatorIds + jobId.

- [x] competencia vinculada a indicador
  → A-06.2 `04-behavioral-indicators.md`; pregunta mapea a indicatorIds.

- [x] evidencia definida
  → `07-evidence.md`: VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID; separa conducta de opinión/intención/supuesto.

- [x] hipotético separado de conducta
  → `08-hypothetical.md`: HYPOTHETICAL → LIMITED (no SUPPORTED sin conducta pasada).

- [x] insuficiente definido
  → `09-insufficient.md`: INSUFFICIENT ≠ 0; no inferir; no veto automático.

- [x] conflictos definidos
  → `10-conflicts.md`: NO promediar; NO "gana el más alto"; CONFLICT → PENDING_REVIEW.

- [x] rúbrica cualitativa
  → `11-rubric.md`: NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG; sin puntos/1-5/0-100.

- [x] sin scoring
  → CompetencyResult sin campo score; niveles cualitativos; no pesos ni cortes.

- [x] sin pesos
  → No pesos entre competencias; no pesos en rúbrica.

- [x] sin cortes
  → No umbrales; no APTO/NO_APTO; no percentiles.

- [x] estandarización definida
  → `12-standardization.md`: preguntas estándar + orden + probes + rúbrica + entrenamiento + calibración.

- [x] sesgos auditados
  → `13-bias.md`: halo/similarity/confirmation/interviewer drift; mitigación estructural.

- [x] discriminación auditada
  → `13-bias.md` + `15-privacy.md`: 12 atributos protegidos; NO_PUBLICABLE; BFOQ restrictivo.

- [x] IA limitada
  → `14-ai.md`: asiste (borradores/probes/resúmenes) pero NO decide; AI_GENERATED + HUMAN_REVIEWED.

- [x] revisión humana
  → `16-human-review.md`: InterviewReview append-only; reviewer humano; Evidencia → Revisión humana → CompetencyResult.

- [x] versionado
  → `18-versioning.md`: InterviewGuide/Question/Probe/Rubric/Review/Result versionados; inmutable lo publicado; no reinterpretar históricos.

- [x] trazabilidad
  → `18-versioning.md` §3: questionId → competencyId → indicatorId → jobId → source → version → approvedBy.

- [x] México revisado
  → `19-mexico.md`: práctica WIDESPREAD; validez MX NOT_ESTABLISHED; CONOCER EXISTE (no equivalencia); LFT/CONAPRED/NOM-035; REQUIERE REVISIÓN LEGAL.

- [x] JobFit intacto
  → CompetencyResult ≠ JobFit; JobFit NOT IMPLEMENTED; ninguna conexión nueva.

- [x] overallScore intacto
  → CompetencyResult no alimenta overallScore (motor opera con PSY+KN; competencias no participan).

- [x] no se implementó código
  → `git status`: solo `evidence-a06-3/` (nuevo) + worklog; cero cambios en src/, prisma/, scripts/, public/.

## Resultado: 24/24 ✓
