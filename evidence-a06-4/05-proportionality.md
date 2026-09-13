# A-06.4 — 05 · Proporcionalidad (PASO 5)

## 1. Regla

Cada pregunta debe responder 5 preguntas. Si no existe respuesta a todas: **NO_PUBLICABLE**.

## 2. Las 5 preguntas

| # | Pregunta | Qué valida |
|---|---|---|
| 1 | ¿Qué competencia evalúa? | Vínculo a una Competency aprobada (competencyId) |
| 2 | ¿Qué indicador evalúa? | Vínculo a uno o más BehavioralIndicator (indicatorIds) |
| 3 | ¿Por qué es relevante para este puesto? | JobCompetency con jobRelevance VALID + rationale |
| 4 | ¿Qué evidencia espera obtener? | Tipo de evidencia (INTERVIEW_STAR / OBSERVATION / etc.) + qué Action se busca |
| 5 | ¿Es proporcional solicitar esa información? | La pregunta no recoge más de lo necesario; no elicit atributos protegidos |

## 3. Aplicación por pregunta

### Ejemplo válido — EJEMPLO — NO PRODUCTIVO

> **Pregunta**: "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho durante un servicio. ¿Qué hiciste tú?"
>
> 1. **Competencia**: COMP-SVC-001 Servicio al cliente ✓
> 2. **Indicadores**: IND-SVC-001-A (escucha), IND-SVC-001-C (explica alternativas), IND-SVC-001-D (conducta profesional) ✓
> 3. **Relevancia para MESERO**: JobCompetency jobRelevance VALID, criticality CRITICAL (80% de interacciones son con comensales) ✓
> 4. **Evidencia esperada**: STAR con Action específica (escuchó, identificó, explicó, mantuvo calma) + Result ✓
> 5. **Proporcional**: pregunta conductual, no elicit atributos protegidos, no invade privacidad ✓
>
> **Veredicto**: PUBLICABLE (tras aprobación humana + gates).

### Ejemplo NO_PUBLICABLE — EJEMPLO — NO PRODUCTIVO

> **Pregunta**: "¿Tienes planes de formar familia pronto?"
>
> 1. Competencia: ✗ ninguna
> 2. Indicadores: ✗ ninguno
> 3. Relevancia: ✗ ninguna (no BFOQ)
> 4. Evidencia esperada: ✗ ninguna (no es conducta laboral)
> 5. Proporcional: ✗ NO (elicita embarazo/estado civil, atributos protegidos)
>
> **Veredicto**: NO_PUBLICABLE + REQUIERE REVISIÓN LEGAL (discriminatorio).

### Ejemplo NO_PUBLICABLE — EJEMPLO — NO PRODUCTIVO

> **Pregunta**: "¿Cómo balances tu vida familiar con el trabajo?"
>
> 1. Competencia: ✗ (no mapea a ninguna)
> 2. Indicadores: ✗
> 3. Relevancia: ✗ (no BFOQ)
> 4. Evidencia esperada: ✗
> 5. Proporcional: ✗ (elicita situación familiar)
>
> **Veredicto**: NO_PUBLICABLE.

## 4. Proporcionalidad en la captura

Además de la pregunta, la **captura** de la respuesta debe ser proporcional:

| Aspecto | Regla |
|---|---|
| Transcripción literal | NO grabar si no hay consentimiento + necesidad justificada (ver `09-recording-transcription.md`) |
| Notas del entrevistador | Sí; solo conducta observable + STAR; no atributos protegidos |
| Resumen estructurado | Sí; formato STAR; no inferencias |
| Duración | Proporcional (25–37 min); no extender innecesariamente |
| Profundidad de probes | Proporcional; no hostigar; respetar "no puedo recordar" |

## 5. Regla de minimización de datos

> **Recoger lo mínimo necesario.** Si una pregunta recoge más información de la necesaria para evaluar la competencia, no es proporcional.

**Ejemplo**: pedir al candidato que describa TODO su CV es desproporcionado si la competencia es "Servicio al cliente". Preguntar por un ejemplo específico de servicio es proporcional.

## 6. Evaluación de proporcionalidad por el reviewer

Antes de APPROVED, cada pregunta debe ser revisada por un humano (reviewer) contra las 5 preguntas. Si falla alguna: NO_PUBLICABLE.

## 7. Conexión con gates

La proporcionalidad pasa LEGAL-G2 (Proporcionalidad). Sin validación de las 5 preguntas por pregunta, la guía de entrevista no se activa.
