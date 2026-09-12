# A-06.5 — 10 · Entrevista Adaptativa (PASO 12)

## 1. Flujo conceptual

```
Pregunta principal (BDI_PRIMARY)
  → probe (BDI_PROBE / CLARIFICATION)
    → probe adicional (si aún incompleto)
      → cierre (CLOSING, opcional)
```

## 2. Regla: no adaptación libre por IA

> La adaptación deberá utilizar **únicamente probes aprobados**.

- El entrevistador (humano) decide qué probe usar del banco aprobado.
- La IA puede **sugerir** un probe (AI_DRAFT_ORIGIN), pero el humano decide.
- La IA **NO** puede generar probes nuevos en tiempo real.
- La IA **NO** puede desviarse de la guía de entrevista.

## 3. Cuándo usar probes

| Situación | Acción |
|---|---|
| Respuesta vaga (falta Action) | Usar BDI_PROBE (e.g. PROBE-UNI-001 "¿Qué hiciste tú específicamente?") |
| Respuesta hipotética (falta pasado) | Usar PROBE-UNI-005 "¿Puedes darme un ejemplo específico de una vez que...?" |
| Falta Result | Usar PROBE-UNI-003 "¿Qué ocurrió después?" |
| Falta Situation | Usar PROBE-UNI-006 "¿Cuándo fue eso? ¿En qué puesto?" |
| Respuesta en plural ("hicimos") | Usar PROBE-UNI-001 "¿Qué hiciste tú específicamente?" |
| Respuesta breve | Usar CLARIFICATION o BDI_PROBE para profundizar |
| STAR completo | Opcional: FOLLOW_UP para validar otro indicador; o CLOSING reflexivo |

## 4. Límite de probes por pregunta

| Parámetro | Valor | Razón |
|---|---|---|
| Mínimo | 0 (si la respuesta primaria es STAR completo) | No siempre se necesita probe |
| Recomendado | 1-2 | Suficiente para completar STAR sin fatigar |
| Máximo | 3 | Más de 3 puede coaccionar; si no hay evidencia tras 3 probes → INSUFFICIENT |

## 5. Transición entre competencias

Al cerrar una competencia:
1. El entrevistador confirma que tiene STAR completo (o INSUFFICIENT documentado).
2. Pasa a la siguiente competencia (siguiente BDI_PRIMARY).
3. No mezcla competencias en una misma pregunta.

## 6. Orden de competencias

Orden recomendado (A-06.3 `04-interview-structure.md`):
1. CRITICAL primero (energía alta al inicio).
2. IMPORTANT después.
3. STANDARD al final.

## 7. Adaptación dentro de la guía

La "adaptación" se limita a:
- **Selección de probes** del banco aprobado (humano decide).
- **Profundidad** (1-3 probes según necesidad).
- **Orden** de competencias (dentro del orden CRITICAL→IMPORTANT→STANDARD).

**No** adaptación de:
- Preguntas principales (siempre las mismas del banco aprobado).
- Rúbrica (siempre la misma por competencia-puesto).
- Criterios de evidencia (siempre los mismos `evidenceExpected`/`notEvidence`).

## 8. Ejemplo de flujo — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> **Competencia**: COMP-SVC-001 Servicio al cliente
>
> 1. **BDI_PRIMARY Q-SVC-001-A**: "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho. ¿Qué hiciste tú?"
> 2. Candidato responde con opinión general ("Siempre trato bien a los clientes").
> 3. **BDI_PROBE PROBE-UNI-005**: "¿Puedes darme un ejemplo específico de una vez que SÍ tuviste un cliente insatisfecho?"
> 4. Candidato describe Situation + Task pero no Action específica ("Le hablé y se calmó").
> 5. **BDI_PROBE PROBE-UNI-001**: "¿Qué hiciste tú específicamente en esa situación?"
> 6. Candidato describe Action ("Me disculpé, le expliqué que revisaría con cocina, le ofrecí pan"). + Result ("cliente aceptó, dejó propina").
> 7. STAR completo → SUPPORTED.
> 8. **CLOSING** (opcional): "¿Qué aprendiste de esa experiencia?"

## 9. Conexión con gates

El flujo adaptativo pasa INTERVIEW-G5 (probe quality) + INTERVIEW-G8 (human review). Sin probes aprobados + reglas de uso, la adaptación no es productiva.
