# EVALUHR — A-06.7 — 14 · Separación Entrevistador / Revisor (PASO 16)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Refina A-06.4 `16-human-review.md`: mantener separación entre
> **entrevistador** (elicita evidencia) y **revisor** (asigna estado/nivel y resuelve conflictos) cuando
> sea posible; documentar excepciones y cómo se controlan.

## 1. Por qué separar

La misma persona que conduce la entrevista tiende a: anclarse en su impresión en vivo (halo/similarity de
sí misma), confirmar su propia elicitation (confirmation), defender su entrevista ante conflicto CV
(self-justification), y suavizar por cortesía (leniency). El piloto mostró que incluso **dos revisores
independientes** divergieron (M-G) — la autorevisión sin controles amplificaría esa variabilidad.

## 2. Regla general

| Actividad | Entrevistador | Revisor |
|---|---|---|
| Conducir la entrevista con guía + probes aprobados | ✓ | — |
| Registrar evidencia textual (respuestas, probes usados) | ✓ | — |
| Asignar evidenceState + nivel con rationale | Preferible: NO (evitar autorevisión) | ✓ |
| Resolver conflictos (CV/referencia/entrevista) | NO | ✓ |
| Elevar huecos de rúbrica a calibración | ✓ | ✓ |

**Cuando sea posible**: el revisor es una **persona distinta** del entrevistador. El revisor trabaja sobre
la evidencia textual registrada (no sobre su impresión en vivo), con la rúbrica v2 y las reglas
(`06`/`07`/`08`). La separación es siempre obligatoria para la **resolución de conflictos** (C-5 de
`08-conflict-rules.md`) cuando exista un segundo revisor disponible.

## 3. Excepciones documentadas y controles

| Excepción | Contexto | Controles obligatorios |
|---|---|---|
| **EX-1: Autorevisión forzosa** (empresa cliente sin segundo evaluador — p. ej., negocio pequeño donde solo hay 1 persona de RR.HH.) | No hay segunda persona disponible | (a) Checklist de autorevisión obligatorio (¿cité indicadores? ¿mi rationale usa solo la respuesta textual? ¿apliqué reglas Action/hipotético/conflicto?); (b) rationale **más detallada** (naming de indicadores por fragmento); (c) **muestreo de auditoría**: un % definido de sus revisiones se re-revisa posteriormente por un par (interno o asesor del cliente); (d) la excepción queda registrada en el InterviewReview; (e) los conflictos CV/referencia **no se resuelven en autorevisión**: quedan PENDING_REVIEW hasta disponer de segunda persona o asesor. |
| **EX-2: Volumen bajo** (procesos con pocas entrevistas; mantener segundo revisor es desproporcionado operativamente) | Cliente con < N entrevistas/mes | Mismos controles que EX-1 + calibración distante (mensual) con casos del set; la baja frecuencia no elimina la bitácora. |
| **EX-3: Urgencia operativa** (decisión necesaria antes de que el revisor esté disponible) | Presión de tiempo del negocio | Se permite que el entrevistador pre-asigne (borrador AI_GENERATED/HUMAN_DRAFT claramente marcado) pero la **asignación final y los conflictos requieren revisión posterior obligatoria** antes de cualquier uso; nada se consume como final sin revisión. |
| **EX-4: IA como apoyo en ausencia de revisor** | Tentación de "la IA revisa" | **Prohibido**: la IA no sustituye al segundo revisor (no decide, no asigna, no resuelve). La IA solo prepara materiales (resúmenes, detección de faltantes) que el revisor humano usará. |

## 4. Documentación (InterviewReview)

El registro de revisión distingue: `reviewerId` (quien asigna estado/nivel) e `interviewerId` (quien
condujo). Cuando coincidan, el registro marca `selfReview: true` + `exceptionCode` (EX-1/EX-2/EX-3) +
los controles aplicados. Append-only; correcciones = nueva versión. Sin este registro, la revisión no
es válida para uso productivo.

## 5. Conexión con calibración y gates

- La separación (y sus excepciones) es parte del entrenamiento (M2/M4) y de la auditoría interna.
- Alimenta INTERVIEW-G8 (human review, APROBADO en estructura) y la calidad de evidencia de INTERVIEW-G9.
- **No** habilita activación: los bloqueos siguen siendo G2/G3/G4/G5 (CONDICIONAL) + G7 (legal) + G9 (pilot
  de campo) + G10 (validation).
