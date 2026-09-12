# EVALUHR — A-06.5 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# DISEÑO DEL EXPEDIENTE Y BANCO METODOLÓGICO DE ENTREVISTA ESTRUCTURADA BDI/STAR — SOLO DISEÑO (cumplido)

Fecha: 2026-09-11 (America/Mexico_City). Método: diseño operativo sobre A-06.1/A-06.2/A-06.3/A-06.4.
Regla: SOLO DISEÑO; NO IMPLEMENTAR; NO PUBLICAR PREGUNTAS; NO MODIFICAR CÓDIGO/SCHEMA/CONTRATO/AVISO.

---

## 1. ESTRUCTURA

Cadena canónica: PUESTO → COMPETENCIA → INDICADOR → PREGUNTA BDI → PROBE → RESPUESTA → EVIDENCIA →
REVISIÓN HUMANA → CompetencyResult.

Entidades canónicas:
- `InterviewGuide { guideId, jobId, version, status, createdBy, reviewedBy, approvedBy, approvalDate, questions, probes, rubricId }` (`02-interview-guide.md`).
- `InterviewQuestion { questionId, guideId, competencyId, indicatorId, questionVersion, questionType, text, purpose, evidenceExpected, notEvidence, status, source, legalStatus, createdBy, reviewedBy, approvedBy }` (`03-question-schema.md`).
- `Probe { probeId, questionId, version, text, purpose, status, source }` (`03-question-schema.md`).

## 2. BANCO CANDIDATO

**10 preguntas candidatas** (MESERO: 5; VENDEDOR: 5). Todas status: **DRAFT / EXAMPLE**. Ninguna
productiva. Todas legalStatus: PUBLICABLE. Detalle: `21-bank-candidate.md` + `question-quality.csv` +
`question-traceability.csv`.

## 3. BDI

Pregunta primaria busca: situación real pasada + contexto + rol del candidato + acción propia + resultado.
"¿Qué harías?" NO es BDI suficiente (HYPOTHETICAL → LIMITED). Validación BDI: mapeo a
competencyId + indicatorId + jobId + rationale (sin los 4 → NO_PUBLICABLE). Detalle: `05-bdi-design.md`.

## 4. STAR

Situation/Task/**Action**/Result. Action = evidencia clave (mapea a indicadores). Resultado positivo ≠
competencia (factores externos). Niveles: NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG. Detalle:
A-06.3 `03-star.md` + A-06.5 `07-evidence-rules.md`.

## 5. PROBES

Banco conceptual: 8 probes universales (PROBE-UNI-001..008) + específicos por competencia. Probes para
obtener S/T/A/R. Prohibidos: sugerentes, juicios, presión, irrelevantes, discriminatorios. Todos
EJEMPLO — NO PRODUCTIVO. Detalle: `06-probes.md`.

## 6. EVIDENCIA

Categorías de respuesta: CONCRETE_BEHAVIOR / HYPOTHETICAL / GENERAL_CLAIM / OPINION / EXTERNAL_RESULT /
NO_INFORMATION / CONTRADICTION. Mapeo a estados: VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID.
**INSUFFICIENT ≠ 0**. WHAT_COUNTS_AS_EVIDENCE + WHAT_DOES_NOT_COUNT por pregunta. Detalle:
`07-evidence-rules.md` + `08-response-states.md`.

## 7. RÚBRICA

Cualitativa: NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG. **Sin puntos, sin 1–5, sin 0–100**.
Asignación humana con `rationale`. IA nunca determina el estado final. Una rúbrica por
(competencyId, jobId). Detalle: `09-rubric.md`.

## 8. IA

Asiste: preparar borradores, adaptar lenguaje, sugerir probe aprobado, resumir respuesta, señalar
falta de información. NO: crear evidencia, inventar hechos, modificar pregunta aprobada, decidir
CompetencyResult, decidir contradicciones, decidir contratación. `AI_GENERATED` + `HUMAN_REVIEWED`.
Detalle: `13-ai-boundaries.md`.

## 9. SESGOS

Auditoría por pregunta contra atributos protegidos (edad/embarazo/género/religión/estado civil/
orientación sexual/identidad de género/discapacidad/salud/origen/nacionalidad/situación familiar/
opinión política). Estados: PUBLICABLE/CONDICIONAL/NO_PUBLICABLE/LEGAL_REVIEW. Mitigación del sesgo
del entrevistador (halo/similarity/confirmation/drift). Detalle: `11-bias-review.md`.

## 10. LEGAL

Cada pregunta clasificada con `legalStatus` contra A-06.4. Ninguna CONDICIONAL o LEGAL_REVIEW entra
ACTIVE sin completar revisión. Detalle: `17-legal-status.md`.

## 11. GOVERNANCE

Ciclo: DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED. Roles: Author / Reviewer / Approver
(separados). **IA nunca aprueba**. Trazabilidad inmutable (createdBy/reviewedBy/approvedBy/version).
Versionado: Guide/Question/Probe/Rubric/Review/Result versionados; inmutable lo publicado; no
reinterpretar históricos. Detalle: `18-governance.md` + `15-versioning.md`.

## 12. GATES

INTERVIEW-G1..G10 (Source / Competency linkage / Indicator / Question quality / Probe quality / Bias
review / Legal review / Human review / Pilot / Validation). Estado: G1/G6/G8 APROBADO (estructura/análisis);
G2/G3/G4/G5 CONDICIONAL; G7 (legal) + G9 (pilot) NO EVALUADO; G10 diferible post-V1. **G7 + G9 bloquean
activación V1**. Detalle: `19-activation-gates.md`.

## 13. RIESGOS

1 CRITICAL (preguntas discriminatorias), 4 HIGH (pregunta sugerente / sesgo entrevistador / probe
improvisado / IA como autoridad), 4 MEDIUM. Mitigación estructural (gobernanza + proceso + revisión
legal + pilotaje). Detalle: `22-risk-analysis.md`.

## 14. ÍNDICE DEL EXPEDIENTE A-06.5

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-insumos.md | 1 |
| 02-interview-guide.md | 2 |
| 03-question-schema.md | 2 |
| 04-question-types.md | 3 |
| 05-bdi-design.md | 4, 5 |
| 06-probes.md | 6 |
| 07-evidence-rules.md | 7 |
| 08-response-states.md | 8, 9 |
| 09-rubric.md | 10 |
| 10-adaptive-flow.md | 11, 12 |
| 11-bias-review.md | 14 |
| 12-proportionality.md | 15 |
| 13-ai-boundaries.md | 13 |
| 14-human-review.md | 17 |
| 15-versioning.md | 19 |
| 16-traceability.md | 18 |
| 17-legal-status.md | 24 |
| 18-governance.md | 25 |
| 19-activation-gates.md | 26 |
| 20-examples.md | 20 |
| 21-bank-candidate.md | 21 |
| 22-risk-analysis.md | 27 |
| 23-audit-checklist.md | 29 |
| question-quality.csv | 22 |
| question-traceability.csv | 23 |

## 15. AUDITORÍA FINAL

Ver `23-audit-checklist.md` — **29/29 verificadas**.

## 16. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia
(`evidence-a06-5/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**;
sin modificación de contrato, aviso, schema, código. REGLA ABSOLUTA cumplida.
