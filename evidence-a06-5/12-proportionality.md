# A-06.5 — 12 · Proporcionalidad (PASO 15)

## 1. Regla

Cada pregunta debe responder 6 preguntas. Si falla cualquiera: **NO_PUBLICABLE**.

## 2. Las 6 preguntas

| # | Pregunta | Qué valida |
|---|---|---|
| 1 | ¿Qué competencia evalúa? | Vínculo a una Competency (competencyId) |
| 2 | ¿Qué indicador evalúa? | Vínculo a uno o más BehavioralIndicator (indicatorId) |
| 3 | ¿Por qué es relevante para este puesto? | JobCompetency con jobRelevance VALID + rationale |
| 4 | ¿Qué evidencia busca? | Tipo de evidencia (INTERVIEW_STAR) + qué Action se busca |
| 5 | ¿Es necesaria? | La pregunta no es redundante con otra; aporta evidencia única |
| 6 | ¿Es proporcional? | La pregunta no recoge más de lo necesario; no elicit atributos protegidos |

## 3. Aplicación por pregunta

### Ejemplo válido — EJEMPLO — NO PRODUCTIVO

> **Pregunta**: Q-SVC-001-A "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho. ¿Qué hiciste tú?"
>
> 1. Competencia: COMP-SVC-001 ✓
> 2. Indicadores: IND-SVC-001-A, IND-SVC-001-C, IND-SVC-001-D ✓
> 3. Relevancia para MESERO: jobRelevance VALID, criticality CRITICAL ✓
> 4. Evidencia: STAR con Action (escuchó, identificó, explicó, mantuvo calma) + Result ✓
> 5. Necesaria: sí; no hay otra pregunta que cubra servicio al cliente bajo presión ✓
> 6. Proporcional: pregunta conductual; no elicit atributos protegidos; no invade privacidad ✓
>
> **Veredicto**: PUBLICABLE (tras aprobación humana + gates).

### Ejemplo NO_PUBLICABLE — EJEMPLO — NO PRODUCTIVO

> **Pregunta**: "¿Tienes planes de formar familia pronto?"
>
> 1. Competencia: ✗ ninguna
> 2. Indicadores: ✗
> 3. Relevancia: ✗ (no BFOQ)
> 4. Evidencia: ✗ (no es conducta laboral)
> 5. Necesaria: ✗
> 6. Proporcional: ✗ (elicita embarazo/estado civil)
>
> **Veredicto**: NO_PUBLICABLE + LEGAL_REVIEW (discriminatorio).

## 4. Proporcionalidad en la captura

Además de la pregunta, la captura de la respuesta debe ser proporcional (A-06.4 `05-proportionality.md`):
- Notas del entrevistador (sí; solo conducta observable + STAR).
- Transcripción (condicional con consentimiento).
- Grabación audio/video (no recomendada V1).

## 5. Validación

Antes de APPROVED, cada pregunta debe ser revisada por un humano contra las 6 preguntas. Si falla alguna: NO_PUBLICABLE.

## 6. Conexión con gates

La proporcionalidad pasa INTERVIEW-G4 (question quality) + LEGAL-G2 (proporcionalidad de A-06.4). Sin validación de las 6 preguntas, la pregunta no pasa a ACTIVE.
