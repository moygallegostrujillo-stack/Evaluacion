# A-06.3 — 06 · Probes (PASO 7)

## 1. Propósito

Los probes son **preguntas de profundización** que el entrevistador usa cuando la respuesta del candidato es incompleta o vaga. Su objetivo es forzar la especificidad necesaria para capturar STAR completo (especialmente la Action).

## 2. Cuándo usar probes

| Situación | Probe |
|---|---|
| Respuesta vaga (falta Action) | "¿Qué hiciste tú específicamente?" |
| Respuesta hipotética (falta pasado) | "¿Puedes darme un ejemplo específico de una vez que...?" |
| Falta Result | "¿Qué resultó de eso?" |
| Falta contexto (Situation) | "¿Cuándo fue eso? ¿En qué puesto?" |
| El candidato habla en plural ("hicimos") | "¿Qué hiciste tú específicamente en esa situación?" |
| Respuesta demasiado breve | "¿Puedes contarme más sobre eso?" |

## 3. Biblioteca conceptual de probes — EJEMPLO — NO PRODUCTIVO

> **Todos los siguientes son EJEMPLO — NO PRODUCTIVO**. No constituyen un banco productivo hasta aprobación humana + INT-G4 (probe design).

### Probes universales (aplicables a cualquier pregunta BDI)

| Probe ID | Texto | Cuándo |
|---|---|---|
| PROBE-UNI-001 | "¿Qué hiciste tú específicamente?" | Falta Action |
| PROBE-UNI-002 | "¿Cuál fue tu decisión?" | Falta Action (decisión) |
| PROBE-UNI-003 | "¿Qué ocurrió después?" | Falta Result |
| PROBE-UNI-004 | "¿Qué aprendiste?" | Cierre reflexivo (complementario) |
| PROBE-UNI-005 | "¿Puedes darme un ejemplo específico de una vez que...?" | Respuesta hipotética o general |
| PROBE-UNI-006 | "¿Cuándo fue eso? ¿En qué puesto?" | Falta Situation |
| PROBE-UNI-007 | "¿Qué pensaste en ese momento?" | Contexto (cuidado: no invadir privacidad) |
| PROBE-UNI-008 | "¿Cómo terminó la situación?" | Falta Result |

### Probes específicos por competencia — EJEMPLO — NO PRODUCTIVO

#### COMP-SVC-001 Servicio al cliente

| Probe ID | Texto |
|---|---|
| PROBE-SVC-001-A | "¿Cómo supiste qué necesitaba el cliente?" |
| PROBE-SVC-001-B | "¿Qué le dijiste exactamente?" |
| PROBE-SVC-001-C | "¿Cómo reaccionó el cliente?" |
| PROBE-SVC-001-D | "¿Hiciste algo después para asegurar que quedara satisfecho?" |

#### COMP-COL-001 Trabajo en equipo

| Probe ID | Texto |
|---|---|
| PROBE-COL-001-A | "¿Qué hiciste tú para coordinar con tu compañero?" |
| PROBE-COL-001-B | "¿Cómo le pediste ayuda?" |
| PROBE-COL-001-C | "¿Reconociste la contribución del otro? ¿Cómo?" |

#### COMP-ORG-001 Organización del trabajo

| Probe ID | Texto |
|---|---|
| PROBE-ORG-001-A | "¿Cómo decidiste qué hacer primero?" |
| PROBE-ORG-001-B | "¿Tuviste que ajustar tu plan? ¿Cómo?" |
| PROBE-ORG-001-C | "¿Cómo llevaste el seguimiento?" |

## 4. Estructura de un Probe

```
Probe {
  probeId: string              // e.g. "PROBE-UNI-001"
  text: string                 // enunciado
  purpose: string              // para qué se usa (forzar Action, Result, etc.)
  applicableTo: 'UNIVERSAL' | competencyId
  status: DRAFT | REVIEW | APPROVED | ACTIVE | RETIRED
  approvedBy: string?          // humano
  version: string              // Probe-v1
}
```

## 5. Reglas de uso

1. **Probes predefinidos**: el entrevistador usa probes del banco aprobado; no improvisa.
2. **Uno a la vez**: no ametrallar al candidato con múltiples probes.
3. **Neutral**: el probe no sugiere la respuesta deseable.
4. **No coaccionar**: si el candidato no puede recordar, no presionar; registrar INSUFFICIENT.
5. **No discriminatorio**: el probe no introduce atributos protegidos.

## 6. IA en probes (PASO 18)

La IA puede:
- **sugerir probes** basados en respuestas parciales del candidato (AI_DRAFT_ORIGIN, status=DRAFT).

La IA **NO** puede:
- **decidir** qué probe usar en tiempo real sin supervisión humana.
- **convertir** un probe sugerido en productivo.

Todo probe IA = DRAFT hasta revisión humana.

## 7. Probes prohibidos

| Probe | Por qué |
|---|---|
| "¿No crees que deberías haber hecho X?" | Sugiere respuesta (leading) |
| "¿Eres casado/a?" | Atributo protegido |
| "¿Cuántos años tienes?" | Atributo protegido |
| "¿Estás embarazada?" | Atributo protegido |
| "¿Qué religión practicas?" | Atributo protegido |

## 8. Conexión con gates

El diseño de probes pasa INT-G4 (probe design). Sin probes validados + aprobados, la entrevista no es productiva.
