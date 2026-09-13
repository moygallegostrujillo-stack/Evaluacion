# A-06.5 — 06 · Probes (PASO 6)

## 1. Objetivo de los probes

Diseñar probes para obtener cada componente de STAR:

| Componente | Probe típico |
|---|---|
| S — Situation | "¿Cuándo fue eso? ¿En qué puesto? ¿Qué contexto había?" |
| T — Task | "¿Cuál era tu objetivo en esa situación? ¿Qué reto enfrentabas?" |
| A — Action | "¿Qué hiciste tú específicamente? ¿Cuál fue tu decisión?" |
| R — Result | "¿Qué ocurrió después? ¿Cómo terminó?" |

## 2. Prohibiciones de probes

Probes prohibidos que introducen:

| Tipo | Ejemplo prohibido | Por qué |
|---|---|---|
| Sesgo | "¿No crees que deberías haber hecho X?" | Sugiere respuesta (leading) |
| Juicio | "¿Por qué hiciste algo tan arriesgado?" | Juzga la conducta |
| Sugerencia de respuesta | "¿Le pediste disculpas al cliente?" | Implanta la respuesta |
| Presión | "¿Seguro que no puedes darme un ejemplo mejor?" | Coacciona |
| Información personal irrelevante | "¿Tu familia apoyó tu decisión?" | Elicita situación familiar |
| Atributo protegido | "¿Cómo reaccionaron tus compañeros de tu edad?" | Elicita edad |

## 3. Banco de probes — EJEMPLO — NO PRODUCTIVO

> **Todos los siguientes son EJEMPLO — NO PRODUCTIVO**. No constituyen un banco productivo.

### Probes universales (aplicables a cualquier BDI_PRIMARY)

| Probe ID | Texto | Componente STAR | Propósito |
|---|---|---|---|
| PROBE-UNI-001 | "¿Qué hiciste tú específicamente?" | A | Forzar Action cuando es vaga |
| PROBE-UNI-002 | "¿Cuál fue tu decisión?" | A | Forzar Action (decisión) |
| PROBE-UNI-003 | "¿Qué ocurrió después?" | R | Forzar Result |
| PROBE-UNI-004 | "¿Qué aprendiste?" | Cierre | Reflexión complementaria |
| PROBE-UNI-005 | "¿Puedes darme un ejemplo específico de una vez que...?" | S | Redirigir hipotético a pasado |
| PROBE-UNI-006 | "¿Cuándo fue eso? ¿En qué puesto?" | S | Forzar Situation |
| PROBE-UNI-007 | "¿Cuál era tu objetivo en esa situación?" | T | Forzar Task |
| PROBE-UNI-008 | "¿Cómo terminó la situación?" | R | Forzar Result |

### Probes específicos por competencia — EJEMPLO — NO PRODUCTIVO

#### COMP-SVC-001 Servicio al cliente

| Probe ID | Texto | Componente |
|---|---|---|
| PROBE-SVC-001-A | "¿Cómo supiste qué necesitaba el cliente?" | A (escucha) |
| PROBE-SVC-001-B | "¿Qué le dijiste exactamente?" | A (explicación) |
| PROBE-SVC-001-C | "¿Cómo reaccionó el cliente?" | R |
| PROBE-SVC-001-D | "¿Hiciste algo después para asegurar que quedara satisfecho?" | A (seguimiento) |

#### COMP-COL-001 Trabajo en equipo

| Probe ID | Texto | Componente |
|---|---|---|
| PROBE-COL-001-A | "¿Qué hiciste tú para coordinar con tu compañero?" | A |
| PROBE-COL-001-B | "¿Cómo le pediste ayuda?" | A |
| PROBE-COL-001-C | "¿Reconociste la contribución del otro? ¿Cómo?" | A |

#### COMP-ORG-001 Organización del trabajo

| Probe ID | Texto | Componente |
|---|---|---|
| PROBE-ORG-001-A | "¿Cómo decidiste qué hacer primero?" | A (priorización) |
| PROBE-ORG-001-B | "¿Tuviste que ajustar tu plan? ¿Cómo?" | A (adaptación) |
| PROBE-ORG-001-C | "¿Cómo llevaste el seguimiento?" | A (control) |

## 4. Reglas de uso

1. **Probes predefinidos**: el entrevistador usa probes del banco aprobado; no improvisa.
2. **Uno a la vez**: no ametrallar al candidato con múltiples probes.
3. **Neutral**: el probe no sugiere la respuesta deseable.
4. **No coaccionar**: si el candidato no puede recordar, no presionar; registrar INSUFFICIENT.
5. **No discriminatorio**: el probe no introduce atributos protegidos.
6. **Propósito claro**: cada probe tiene `purpose` definido (qué busca).

## 5. IA en probes (PASO 13)

La IA puede:
- **sugerir probes** basados en respuestas parciales (AI_DRAFT_ORIGIN, DRAFT).

La IA **NO** puede:
- **decidir** qué probe usar sin supervisión humana.
- **convertir** un probe sugerido en productivo (ACTIVE).
- **improvisar** probes fuera del banco aprobado.

## 6. Conexión con gates

Los probes pasan INTERVIEW-G5 (probe quality). Sin probes validados + aprobados, la entrevista no es productiva.
