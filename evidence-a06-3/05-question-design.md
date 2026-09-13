# A-06.3 — 05 · Diseño de Preguntas (PASO 6)

## 1. Características de una pregunta BDI válida

Una pregunta BDI válida:
- Pregunta por **comportamiento pasado** (no futuro, no opinión).
- Especifica un **contexto** (tipo de situación laboral).
- Pide una **situación concreta** (un evento específico, no generalidades).
- Solicita la **acción del candidato** (qué hizo él/ella, no el equipo).
- Permite capturar el **resultado**.

## 2. Estructura de una pregunta BDI

```
InterviewQuestion {
  questionId: string            // e.g. "Q-SVC-001-A"
  competencyId: string          // FK a Competency
  indicatorIds: string[]        // FK a BehavioralIndicator(s) que la pregunta busca evidenciar
  jobId: string                 // FK a Position|Vacancy
  text: string                  // enunciado de la pregunta
  type: 'BEHAVIORAL_PAST' | 'SITUATIONAL' | 'JOB_KNOWLEDGE'
  probes: string[]              // IDs de Probe predefinidos
  status: DRAFT | REVIEW | APPROVED | ACTIVE | RETIRED
  approvedBy: string?           // humano
  version: string               // InterviewQuestion-v1
}
```

## 3. Ejemplos de preguntas BDI válidas — EJEMPLO — NO PRODUCTIVO

### COMP-SVC-001 Servicio al cliente (MESERO)

> **EJEMPLO — NO PRODUCTIVO**
>
> **Q-SVC-001-A**: "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho durante un servicio. ¿Qué hiciste tú?"

### COMP-SVC-002 Manejo de quejas (VENDEDOR)

> **EJEMPLO — NO PRODUCTIVO**
>
> **Q-SVC-002-A**: "Describe una ocasión en que un cliente presentó un reclamo difícil. ¿Cómo manejaste la situación paso a paso?"

### COMP-COL-001 Trabajo en equipo (MESERO)

> **EJEMPLO — NO PRODUCTIVO**
>
> **Q-COL-001-A**: "Cuéntame de una vez en que tuviste que coordinar con un compañero o con cocina para resolver un problema durante el servicio. ¿Qué hiciste?"

### COMP-ORG-001 Organización del trabajo (VENDEDOR)

> **EJEMPLO — NO PRODUCTIVO**
>
> **Q-ORG-001-A**: "Describe una jornada en la que tenías múltiples prioridades compitiendo. ¿Cómo organizaste tu trabajo?"

## 4. Preguntas a EVITAR

| Tipo | Ejemplo | Por qué evitar |
|---|---|---|
| Abstractas | "¿Qué opinas del servicio al cliente?" | Opinión, no conducta |
| Filosóficas | "¿Cuál es el significado del trabajo en equipo?" | Filosofía, no evidencia |
| Moralizantes | "¿Crees que es importante ser responsable?" | Invita respuesta socialmente deseable |
| De personalidad | "¿Te consideras una persona extrovertida?" | Mide rasgo latente (Prohibido — A-05.3) |
| Discriminatorias | "¿Tienes planes de formar familia pronto?" | Atributo protegido (ver `17-discrimination.md`) |
| Innecesariamente sensibles | "¿Has tenido problemas personales que afecten tu trabajo?" | Invade privacidad sin relación laboral |
| Hipotéticas puras | "¿Qué harías si un cliente se enoja?" | Intención, no conducta (ver `08-hypothetical.md`) |
| Cerradas (sí/no) | "¿Alguna vez atendiste un cliente difícil?" | No produce STAR; invita monosílabo |

## 5. Reglas de redacción

1. **Apertura conductual**: "Cuéntame de una vez...", "Describe una ocasión...", "Dame un ejemplo de...".
2. **Pasado**: verbos en pasado o que pidan experiencia previa.
3. **Específica**: "una vez específica", no "generalmente".
4. **Foco en el candidato**: "qué hiciste tú", no "qué hizo el equipo".
5. **Neutral**: no sugiere la respuesta deseable.
6. **Una competencia por pregunta**: no mezclar.
7. **Vinculada a indicadores**: cada pregunta debe mapear a 1+ indicadores (indicatorIds).

## 6. Vinculación a competencia + indicador + puesto (PASO 16)

Una pregunta existe porque:

```
COMPETENCIA (Competency)
  + INDICADOR (BehavioralIndicator)
  + JOB RELEVANCE (JobCompetency con jobRelevance VALID)
  → justifica la pregunta para ese puesto
```

**No crear preguntas genéricas para todos los puestos**. Una pregunta de "Servicio al cliente" para MESERO puede no aplicar para LAVAPLATOS (donde la competencia es STANDARD o no aplica).

## 7. Trazabilidad (PASO 19)

Cada pregunta puede rastrearse:

```
questionId
  → competencyId
  → indicatorId(s)
  → jobId
  → source (JOB_ANALYSIS | LITERATURE | AI_DRAFT_ORIGIN)
  → version (InterviewQuestion-v1)
  → approvedBy (humano)
```

## 8. IA en preguntas (PASO 18)

La IA puede:
- **generar borrador de pregunta** a partir de la competencia + indicador + puesto (AI_DRAFT_ORIGIN, status=DRAFT).

La IA **NO** puede:
- **aprobar** la pregunta como productiva (ACTIVE).
- **decidir** que la pregunta es correcta.
- **modificar** una pregunta APPROVED.

Toda pregunta IA = DRAFT hasta revisión humana.

## 9. Validación de preguntas

Antes de APPROVED, una pregunta debe:
- Ser revisada por un profesional de RR.HH.
- Pasar revisión de sesgo/discriminación (CI-VAL-6 de A-06.2 + `17-discrimination.md`).
- Pasar revisión legal (INT-G7).
- Ser pilotada (INT-G9).

## 10. Conexión con gates

El diseño de preguntas pasa INT-G3 (question design). Sin preguntas validadas + aprobadas + vinculadas a competencias, no hay entrevista productiva.
