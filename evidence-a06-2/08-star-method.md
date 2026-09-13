# A-06.2 — 08 · Método STAR (PASO 10)

## 1. Estructura metodológica

STAR = **Situation, Task, Action, Result**. Es la técnica estándar para entrevistas conductuales (BDI — Behavior Description Interview).

| Componente | Qué captura | Tipo de evidencia |
|---|---|---|
| **S — Situation** | El contexto en que ocurrió el evento | Contexto (no conducta) |
| **T — Task** | El objetivo o reto que el candidato enfrentaba | Contexto (no conducta) |
| **A — Action** | Lo que el candidato HIZO específicamente | **Conducta observable** (evidencia clave) |
| **R — Result** | La consecuencia de la acción | Resultado (evidencia complementaria) |

## 2. Qué parte es evidencia

| Parte | Evidencia de... | Mapea a |
|---|---|---|
| Situation | Contexto laboral, tipo de escenario | Verifica que la situación es relevante al puesto |
| Task | El reto/objetivo | Verifica la complejidad del desafío |
| **Action** | **Conducta del candidato** | **Indicadores conductuales** (lo que mapea a la competencia) |
| Result | Consecuencia | Verificación de impacto (complementario) |

**La Action es la evidencia central**. Sin Action específica, la respuesta es INSUFFICIENT (ver `09-insufficient.md`).

## 3. Regla: RESULTADO POSITIVO ≠ automáticamente COMPETENCIA

> **Regla crítica**: un resultado positivo NO implica automáticamente que el candidato posee la competencia.

**Razones**:
1. El resultado puede deberse a factores externos (equipo, suerte, contexto).
2. El resultado positivo puede provenir de una conducta que NO mapea a los indicadores de la competencia.
3. El resultado puede ser positivo pero la Action inexistente o vaga (el candidato "logró X" pero no describe qué hizo).

**Ejemplo**:
- Candidato: "Aumenté las ventas 20% en mi puesto anterior." (Result positivo)
- Pregunta de profundización: "¿Qué hiciste específicamente para lograr ese aumento?"
- Si el candidato no puede describir Action con conductas observables → la evidencia es INSUFFICIENT, a pesar del resultado positivo.

## 4. Ejemplo de STAR válido — EJEMPLO — NO PRODUCTIVO

> **Competencia**: COMP-SVC-001 Servicio al cliente
>
> **S (Situation)**: "Trabajaba como mesero en un restaurante de comida italiana. Era un viernes a las 8pm, restaurante lleno."
>
> **T (Task)**: "Un comensal reclamó que su pasta estaba fría y exigía que se le cobrara la mitad."
>
> **A (Action)**: "Me disculpé con el cliente por la inconveniencia. Le expliqué que llevaría el plato a cocina para calentarlo. Le pregunté si quería algo más mientras esperaba (pan). Coordiné con cocina para priorizar el recalentamiento. Al regresar, le confirmé que el plato estaba a temperatura adecuada."
>
> **R (Result)**: "El cliente aceptó el plato recaliente, dejó propina del 15%, y no presentó reclamo posterior."

**Evaluación**:
- Action contiene conductas observables mapeables a indicadores:
  - IND-SVC-001-A (escucha/formula clarificación): ✓ implícito en "me disculpé + expliqué"
  - IND-SVC-001-C (explica alternativas): ✓ "le pregunté si quería pan"
  - IND-SVC-001-D (conducta profesional bajo presión): ✓ mantuvo la calma
- Result positivo + Action específica → SUPPORTED (no STRONG; requeriría múltiples ejemplos para STRONG).

## 5. Ejemplo de STAR INSUFFICIENTE

> **Candidato**: "Soy excelente atendiendo clientes, siempre les doy buen servicio." (sin Situation, sin Task, sin Action específica, sin Result verificable)

**Evaluación**: INSUFFICIENT — opinión general, sin conducta observable. Ver `09-insufficient.md`.

## 6. Probes de profundización

Si el candidato no completa STAR espontáneamente, el entrevistador usa probes:
- "¿Puedes darme un ejemplo específico de una vez que...?" (fuerza Situation)
- "¿Qué hiciste tú específicamente en esa situación?" (fuerza Action)
- "¿Qué resultó de eso?" (fuerza Result)

La IA puede sugerir probes basados en respuestas parciales (AI_DRAFT_ORIGIN), pero el entrevistador decide cuál usar.

## 7. Registro de evidencia STAR

```
STAREvidence {
  evidenceId: string
  candidateId: string
  competencyId: string
  situation: string
  task: string
  action: string                 // la evidencia clave
  result: string
  indicatorsObserved: string[]   // IDs de indicadores cubiertos por la Action
  collectedAt: timestamp
  collectedBy: string             // entrevistador humano
}
```

## 8. Conexión con niveles

| STAR quality | Nivel típico |
|---|---|
| Sin ejemplo, opinión | NO_EVIDENCE / INSUFFICIENT |
| Ejemplo vago, Action ausente | INSUFFICIENT |
| Ejemplo con Action parcial, 1 indicador | LIMITED |
| Ejemplo claro, múltiples indicadores, Result verificable | SUPPORTED |
| Múltiples ejemplos claros, indicadores consistentes, Results verificables | STRONG |

**Regla**: el nivel lo asigna el humano, no se infiere automáticamente del STAR.
