# EVALUHR — LEGAL MASTER PACKAGE · 13 · HUMAN REVIEW (PASO 14a)

## 1. Cadena de decisión (verificada en diseño y código)

```
RESULTADO AUTOMÁTICO (scores + recommendation = orientación de completitud)
  → PRESENTACIÓN AL RR.HH. (disclaimers: "orientación informativa únicamente", CandidateDetailView.tsx:386-401)
  → REVISIÓN HUMANA (entrevista, referencias, criterio de RR.HH.)
  → DECISIÓN DE LA EMPRESA (fuera del sistema; no existen campos de decisión de contratación en el schema)
```

## 2. Controles existentes (verificados)

1. Sin endpoint de modificación de scores (`results/route.ts` = solo GET; RR.HH. no puede alterar resultados).
2. overallScore excluye Big Five e Integridad con razones registradas (`excludedReasons: NOT_APPROVED`).
3. recommendation documentada como "NOT a hiring decision (LFPDPPP Art. 37 Bis)" en el motor — actualizar la cita normativa al marco 2025 (art. 26) — LEGAL_REVIEW.
4. Códigos de scoring "orientative, never auto-filter / never as disqualification".
5. Knowledge: INSUFFICIENT ≠ 0; correctAnswer nunca al candidato.
6. Consentimiento público no automático ("DO NOT auto-consent").

## 3. Revisión humana en entrevista (diseño A-06, no activa)

- Evidencia (STAR, inmutable) → InterviewReview (nivel + rationale, append-only) → CompetencyResult (aprobado por humano) → decisión de empresa.
- Reviewer distinto al entrevistador (recomendación de segregación); conflicts → PENDING_REVIEW sin promedios.

## 4. Documentación mínima exigible (para dictamen)

- Quién revisó (identificación del humano), cuándo, con qué rationale.
- Versiones y audit trail inmutables.
- En su caso, flags UNINVITED_DISCLOSURE (sin contenido).

## 5. Punto LEGAL_REVIEW

Definir en contrato/aviso cómo se **documenta y conserva** la revisión humana para que sea verificable ante el titular y la autoridad (pregunta 10 de 28).
