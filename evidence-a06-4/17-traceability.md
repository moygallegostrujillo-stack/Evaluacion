# A-06.4 — 17 · Trazabilidad (PASO 17)

## 1. Regla

Cada entrevista debe poder rastrearse end-to-end. Se registra:

| Campo | Descripción |
|---|---|
| candidate | candidato evaluado (candidateId) |
| job | puesto (jobId) |
| competency | competencia evaluada (competencyId + version) |
| indicator | indicador (indicatorId) |
| question | pregunta usada (questionId + questionVersion) |
| questionVersion | versión de la pregunta (InterviewQuestion-v1) |
| response | respuesta del candidato (STAR capturado) |
| evidenceState | estado de la evidencia (VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID) |
| reviewer | humano que revisó (reviewerId) |
| reviewDate | fecha de revisión |
| conflicts | conflictos detectados (ConflictRecord IDs) |
| limitations | limitaciones detectadas |
| AI involvement | qué hizo la IA (transcripción/resumen/probe suggestion) |

## 2. Cadena de trazabilidad

```
candidate + job
  → JobCompetency (vínculo humano-aprobado, versionado)
  → Competency (versionada)
  → BehavioralIndicator (observable, aprobado)
  → InterviewGuide (aprobado, versionado)
  → InterviewQuestion (versionada, approvedBy)
  → Interview (sesión, date, interviewer)
  → InterviewEvidence (STAR capturado, inmutable)
  → AI involvement (transcription/summary/probe, logged)
  → InterviewReview (reviewer, reviewDate, evidenceState)
  → ConflictRecord (si aplica)
  → CompetencyResult (agregado por competencia, reviewedBy, approvedBy)
```

## 3. Registros mínimos

Para cada entrevista, se conserva:

```
InterviewSession {
  sessionId: string
  candidateId: string
  jobId: string
  interviewerId: string           // humano
  date: timestamp
  guideId: string                 // InterviewGuide versionado
  guideVersion: string
  consent: { obtained: boolean, at: timestamp }
  evidences: InterviewEvidence[]
  reviews: InterviewReview[]
  conflicts: ConflictRecord[]
  results: CompetencyResult[]
  aiInvolvement: AIInvolvement[]
  status: 'COMPLETED' | 'INCOMPLETE' | 'CANCELLED'
}
```

## 4. AIInvolvement

```
AIInvolvement {
  aiUsedFor: 'TRANSCRIPTION' | 'SUMMARY' | 'PROBE_SUGGESTION' | 'LANGUAGE_ADAPTATION' | 'MISSING_INFO_DETECTION'
  aiModel: string
  aiPromptHash: string
  aiGeneratedAt: timestamp
  humanReviewedBy: string
  humanReviewedAt: timestamp
  input: string (hash o referencia)
  output: string (hash o referencia)
}
```

## 5. Audit trail

Todo acceso y cambio se registra (append-only):
- quién accedió
- cuándo
- a qué registro
- con qué propósito
- qué cambió (si cambió)

El audit trail permite reconstruir la historia completa de una entrevista y sus resultados.

## 6. Conservación del audit trail

El audit trail se conserva según `10-retention.md`. Al purge de la entrevista, el audit trail también se elimina (salvo obligación legal de conservarlo ante queja/demanda).

## 7. Derechos ARCO y trazabilidad

Si el candidato ejerce ARCO:
- **Acceso**: se le proporcionan sus datos (respuestas, CompetencyResult, audit trail relevante a él).
- **Rectificación**: se corrige (nueva versión; append-only).
- **Cancelación**: se purga (con suspensión si hay queja en curso).
- **Oposición**: se suspende el tratamiento (con revisión legal).

## 8. Conexión con gates

La trazabilidad pasa LEGAL-G10 (Transparencia) + LEGAL-G9 (Seguridad). Sin trazabilidad documentada + audit trail, la entrevista no se activa.
