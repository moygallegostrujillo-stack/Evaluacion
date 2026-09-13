# EVALUHR — A-06.3 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# DISEÑO METODOLÓGICO DE ENTREVISTA ESTRUCTURADA BDI/STAR — SOLO DISEÑO + AUDITORÍA (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@0eb0cbd` (post-A-06.2).
Método: diseño metodológico sobre el modelo A-06.1 (competencia = conducta observable) + A-06.2
(catálogo candidato). Regla: SOLO DISEÑO + AUDITORÍA; NO IMPLEMENTAR; NO MODIFICAR CÓDIGO;
ejemplos marcados `EJEMPLO — NO PRODUCTIVO`.

---

## 1. ESTADO ANTERIOR (PASO 1)

`InterviewSchedule` existe pero es entidad de **calendario** (id, candidateId, scheduledAt, status,
location, notes) — NO una guía de entrevista. No hay BDI, STAR, preguntas, probes, rúbricas, evaluación
de competencias, ni IA para entrevistas. Structured Interview Methodology = NOT_IMPLEMENTED. Detalle:
`01-before-audit.md`.

## 2. METODOLOGÍA ELEGIDA (PASO 2)

> **ENTREVISTA ESTRUCTURADA BDI/STAR** = fuente principal de evidencia de competencias en V1
> (A-06.1 Opción A confirmada).

ENTREVISTA ESTRUCTURADA ≠ CONVERSACIÓN LIBRE. Misma estructura: INTRODUCCIÓN → CONSENTIMIENTO →
PREGUNTAS (BDI) → PROBES → CIERRE → REVISIÓN. Detalle: `04-interview-structure.md`.

## 3. ESTRUCTURA

6 fases obligatorias: introducción, consentimiento (LFPDPPP), preguntas predefinidas, probes, cierre,
revisión post-entrevista. Duración total con candidato: 25–37 min + revisión 10–15 min. Detalle:
`04-interview-structure.md`.

## 4. BDI

Behavioral Description Interview: pregunta por **conducta pasada** (no intención). Reduce faking
(pasado verificable). Validez: Huffcutt & Arthur 2001 meta; Oliphant 2008; Hartwell 2019; Pulakos &
Schmitt 1995 (BD > situational). Detalle: `02-bdi.md`.

## 5. STAR

Situation/Task/**Action**/Result. **Action = evidencia clave** (mapea a indicadores).
**Resultado positivo ≠ competencia** (puede deberse a factores externos). La evidencia principal
está en la conducta describible y contextualizada. Detalle: `03-star.md`.

## 6. PREGUNTAS

BDI válidas: comportamiento pasado + contexto + situación concreta + acción del candidato + resultado.
Vinculadas a competencia + indicador + puesto (jobRelevance VALID). Evitan: abstractas, filosóficas,
moralizantes, de personalidad, discriminatorias, innecesariamente sensibles. Detalle: `05-question-design.md`.

## 7. PROBES

Biblioteca conceptual de probes universales (PROBE-UNI-001..008) + específicos por competencia.
Ejemplos: "¿Qué hiciste tú específicamente?", "¿Cuál fue tu decisión?", "¿Qué ocurrió después?". Todos
EJEMPLO — NO PRODUCTIVO. Detalle: `06-probes.md`.

## 8. EVIDENCIA

5 niveles: VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID. Separa: conducta concreta (evidencia)
de afirmación genérica/opinión/intención/supuesto/resultado externo (no evidencia). Detalle:
`07-evidence.md`.

- Hipotético → HYPOTHETICAL → LIMITED (no SUPPORTED sin conducta pasada). `08-hypothetical.md`.
- Vago → INSUFFICIENT (≠ 0; no inferir; no veto automático). `09-insufficient.md`.
- Contradicciones → CONFLICT → PENDING_REVIEW (no promediar; no "gana el más alto"). `10-conflicts.md`.

## 9. RÚBRICA

Cualitativa: NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG. **Sin puntos, sin 1–5, sin 0–100**.
Una rúbrica por (competencyId, jobId). Asignación humana con rationale. Detalle: `11-rubric.md`.

## 10. REVISIÓN HUMANA

InterviewReview (append-only): reviewer + reviewDate + evidenceState + observations + conflicts +
limitations + decisionContext. La revisión NO borra la evidencia original. Cadena:
Evidencia → Revisión humana → CompetencyResult. **No**: IA → CompetencyResult. Detalle:
`16-human-review.md`.

## 11. IA

Asiste: generar borradores de preguntas, sugerir probes, adaptar lenguaje, resumir respuestas, detectar
falta de información. **NO** decide: nivel, competencia, contratación, criticality, rúbrica.
`AI_GENERATED` + `HUMAN_REVIEWED` siempre. IA en tiempo real = assistance (no decision); si riesgo de
IA-autoridad → PROHIBIDO. Detalle: `14-ai.md`.

## 12. RIESGOS

- Sesgo del entrevistador: halo/similarity/confirmation/drift. Mitigación: guía + rúbrica + entrenamiento
  + calibración + reviewer distinto. `13-bias.md`.
- Discriminación: 12 atributos protegidos; NO_PUBLICABLE; BFOQ restrictivo. `13-bias.md` + `15-privacy.md`.
- IA como autoridad: mitigación con rationale textual humano + advertencia visible. `14-ai.md`.
- Estandarización: 1–3 preguntas por competencia (mínimo 1, ideal 2, máximo 3); ~9 preguntas por entrevista.
  `12-standardization.md`.

## 13. MÉXICO

Práctica WIDESPREAD (entrevistas estructuradas + competencias comunes en mediana/grande empresa).
Validez predictiva MX NOT_ESTABLISHED (transferencia internacional LIMITADA). CONOCER EXISTE (norma,
no equivalencia). LFT Art. 3 + CONAPRED (no discriminación). NOM-035 distinto propósito.
**REQUIERE REVISIÓN LEGAL**. Detalle: `19-mexico.md`.

## 14. GATES

INT-G1..G10 (Constructo/CompetencyLinkage/QuestionDesign/ProbeDesign/Rubric/BiasReview/LegalReview/
Governance/Pilot/Validation). Estado: G1/G6/G8 APROBADO; G2/G3/G4/G5 CONDICIONAL; G7 (legal) + G9 (pilot)
NO EVALUADO; G10 diferible post-V1. **G7 + G9 bloquean activación V1**. Detalle: `20-gates.md`.

## 15. VERSIONADO Y TRAZABILIDAD

InterviewGuide/Question/Probe/Rubric/Review/Result versionados. Inmutable lo publicado. No reinterpretar
históricos. Trazabilidad: questionId → competencyId → indicatorId → jobId → source → version → approvedBy.
Detalle: `18-versioning.md`.

## 16. COMPETENCYRESULT

Sin score global. Sin JobFit. Sin overallScore. Sin recommendation automática. Evidencia por competencia
(NO_EVIDENCE..STRONG) con rationale + supportingEvidence + conflicts + reviewedBy. Detalle:
`17-competency-result.md`.

## 17. ÍNDICE DEL EXPEDIENTE A-06.3

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-before-audit.md | 1 |
| 02-bdi.md | 3 |
| 03-star.md | 4 |
| 04-interview-structure.md | 2, 5 |
| 05-question-design.md | 6, 16, 19 |
| 06-probes.md | 7 |
| 07-evidence.md | 8 |
| 08-hypothetical.md | 9 |
| 09-insufficient.md | 10 |
| 10-conflicts.md | 12 |
| 11-rubric.md | 14 |
| 12-standardization.md | 13, 15 |
| 13-bias.md | 17 |
| 14-ai.md | 18, 25 |
| 15-privacy.md | 21 |
| 16-human-review.md | 22, 24 |
| 17-competency-result.md | 23 |
| 18-versioning.md | 19, 20 |
| 19-mexico.md | 26 |
| 20-gates.md | 29 |
| 21-examples.md | 28 |
| 22-audit-checklist.md | 31 |
| interview-method-matrix.csv | 27 |

## 18. AUDITORÍA FINAL

Ver `22-audit-checklist.md` — **24/24 verificadas**.

## 19. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia (`evidence-a06-3/*`
y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**; sin migraciones, sin db push,
sin escrituras de datos. REGLA ABSOLUTA cumplida.
