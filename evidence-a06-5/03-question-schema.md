# A-06.5 — 03 · InterviewQuestion + Probe (PASO 2)

## 1. InterviewQuestion

```
InterviewQuestion {
  questionId: string            // e.g. "Q-SVC-001-A"
  guideId: string                // FK a InterviewGuide
  competencyId: string           // FK a Competency
  indicatorId: string[]          // FK a BehavioralIndicator(s)
  questionVersion: string        // e.g. "Question-v1"
  questionType: 'BDI_PRIMARY' | 'BDI_PROBE' | 'CLARIFICATION' | 'FOLLOW_UP' | 'CLOSING'
  text: string                   // enunciado de la pregunta
  purpose: string                // qué evidencia busca
  evidenceExpected: string       // qué cuenta como evidencia (WHAT_COUNTS_AS_EVIDENCE)
  notEvidence: string            // qué NO cuenta (WHAT_DOES_NOT_COUNT)
  status: DRAFT | REVIEW | APPROVED | ACTIVE | SUSPENDED | RETIRED
  source: 'JOB_ANALYSIS' | 'LITERATURE' | 'EXPERT' | 'AI_DRAFT_ORIGIN'
  createdBy: string
  reviewedBy: string?
  approvedBy: string?
  legalStatus: 'PUBLICABLE' | 'CONDITIONAL' | 'LEGAL_REVIEW' | 'NO_PUBLICABLE'
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 2. Probe

```
Probe {
  probeId: string               // e.g. "PROBE-UNI-001" o "PROBE-SVC-001-A"
  questionId: string?            // FK a InterviewQuestion (null si universal)
  version: string                // e.g. "Probe-v1"
  text: string                   // enunciado del probe
  purpose: string                // qué busca (forzar Action, Result, Situation, etc.)
  status: DRAFT | REVIEW | APPROVED | ACTIVE | SUSPENDED | RETIRED
  source: 'JOB_ANALYSIS' | 'LITERATURE' | 'EXPERT' | 'AI_DRAFT_ORIGIN'
  createdBy: string
  reviewedBy: string?
  approvedBy: string?
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 3. Relación Question ↔ Probe

- Una pregunta puede tener **0 o más probes específicos** (vinculados por `questionId`).
- Existen **probes universales** (`questionId = null`) aplicables a cualquier pregunta BDI.
- El entrevistador puede usar probes universales + específicos según necesidad.

## 4. Reglas

1. Una InterviewQuestion debe tener `competencyId` + `indicatorId` + `jobId` (vía guideId) + `legalStatus`.
2. Sin los cuatro elementos (competencyId + indicatorId + jobId + rationale) → NO_PUBLICABLE.
3. `legalStatus` proviene de A-06.4 (`13-discrimination.md`).
4. `questionType` define el papel de la pregunta en la entrevista (ver `04-question-types.md`).
5. `evidenceExpected` + `notEvidence` definen qué cuenta/no cuenta (ver `07-evidence-rules.md`).
6. IA puede crear DRAFT (AI_DRAFT_ORIGIN) pero nunca APPROVED ni ACTIVE.

## 5. Ejemplo InterviewQuestion — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> ```
> questionId: Q-SVC-001-A
> guideId: GUIDE-MESERO-v1
> competencyId: COMP-SVC-001 (Servicio al cliente)
> indicatorId: [IND-SVC-001-A, IND-SVC-001-C, IND-SVC-001-D]
> questionVersion: Question-v1
> questionType: BDI_PRIMARY
> text: "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho durante un servicio. ¿Qué hiciste tú?"
> purpose: "Obtener evidencia de conducta pasada de servicio al cliente bajo presión"
> evidenceExpected: "Action específica: escuchó, identificó necesidad, explicó alternativas, mantuvo conducta profesional. Result verificable."
> notEvidence: "Opinión general ('soy bueno atendiendo'). Intención hipotética ('haría X'). Atributos protegidos."
> status: DRAFT
> source: JOB_ANALYSIS
> legalStatus: PUBLICABLE
> createdBy: reviewer@evaluaHR
> reviewedBy: null
> approvedBy: null
> ```

## 6. Ejemplo Probe — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> ```
> probeId: PROBE-UNI-001
> questionId: null (universal)
> version: Probe-v1
> text: "¿Qué hiciste tú específicamente?"
> purpose: "Forzar Action específica cuando la respuesta es vaga"
> status: DRAFT
> source: LITERATURE
> ```

## 7. Conexión con gates

InterviewQuestion pasa INTERVIEW-G3 (indicator) + INTERVIEW-G4 (question quality) +
INTERVIEW-G6 (bias review) + INTERVIEW-G7 (legal review). Probe pasa INTERVIEW-G5 (probe quality).
