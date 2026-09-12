# A-06.5 — 16 · Trazabilidad (PASO 18)

## 1. Regla

> La cadena debe ser reconstruible end-to-end.

```
jobId
  → competencyId
    → indicatorId
      → questionId
        → questionVersion
          → responseId
            → evidenceState
              → reviewerId
                → reviewVersion
```

## 2. Cadena completa

```
Job (Position | Vacancy)
  → JobCompetency (vínculo humano-aprobado, versionado)
  → Competency (versionada)
  → BehavioralIndicator (observable, aprobado)
  → InterviewGuide (aprobada, versionada)
  → InterviewQuestion (versionada, approvedBy, legalStatus)
  → questionVersion (snapshot de la versión usada)
  → Interview (sesión, date, interviewerId)
  → InterviewEvidence (STAR capturado, inmutable, responseId)
  → evidenceState (VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID)
  → InterviewReview (reviewerId, reviewDate, reviewVersion)
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
  guideId: string                 // InterviewGuide versionada
  guideVersion: string
  consent: { obtained: boolean, at: timestamp }
  evidences: InterviewEvidence[]  // cada uno con questionId + questionVersion + responseId
  reviews: InterviewReview[]      // cada uno con reviewerId + reviewVersion
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

El audit trail se conserva según A-06.4 `10-retention.md`. Al purge de la entrevista, el audit trail también se elimina (salvo obligación legal de conservarlo ante queja/demanda).

## 7. Derechos ARCO y trazabilidad

Si el candidato ejerce ARCO:
- **Acceso**: se le proporcionan sus datos (respuestas, CompetencyResult, audit trail relevante a él).
- **Rectificación**: se corrige (nueva versión; append-only).
- **Cancelación**: se purga (con suspensión si hay queja en curso).
- **Oposición**: se suspende el tratamiento (con revisión legal).

## 8. Conexión con gates

La trazabilidad pasa INTERVIEW-G8 (human review) + LEGAL-G10 (transparencia) + LEGAL-G9 (seguridad). Sin trazabilidad documentada + audit trail, la entrevista no se activa.
