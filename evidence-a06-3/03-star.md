# A-06.3 — 03 · STAR (PASO 4)

## 1. Definición

**STAR** = **Situation, Task, Action, Result**. Estructura para capturar y organizar la evidencia conductual de una respuesta BDI.

| Componente | Qué captura | Tipo de evidencia |
|---|---|---|
| **S — Situation** | El contexto en que ocurrió el evento | Contexto (no conducta) |
| **T — Task** | El objetivo o reto que el candidato enfrentaba | Contexto (no conducta) |
| **A — Action** | Lo que el candidato HIZO específicamente | **Conducta observable** (evidencia clave) |
| **R — Result** | La consecuencia de la acción | Resultado (evidencia complementaria) |

## 2. Qué parte tiene mayor valor como evidencia

**La Action (A) es la evidencia principal**. Es lo único que mapea directamente a los indicadores conductuales (A-06.2 `behavioral-indicators.md`).

| Parte | Valor como evidencia | Por qué |
|---|---|---|
| Situation | BAJO (contexto) | Verifica que la situación es relevante al puesto, pero no demuestra conducta |
| Task | BAJO (contexto) | Verifica la complejidad del reto, pero no demuestra conducta |
| **Action** | **ALTO (conducta)** | **Es la conducta observable que mapea a indicadores** |
| Result | MEDIO (complementario) | Verifica impacto, pero puede deberse a factores externos |

## 3. Regla: RESULTADO POSITIVO ≠ competencia demostrada

> **Regla crítica**: un resultado positivo NO implica automáticamente que el candidato posee la competencia.

**Razones**:
1. El resultado puede deberse a factores externos (equipo, suerte, contexto favorable).
2. El resultado positivo puede provenir de una conducta que NO mapea a los indicadores de la competencia.
3. El resultado puede ser positivo pero la Action inexistente o vaga (el candidato "logró X" pero no describe qué hizo).

**Ejemplo**:
- Candidato: "Aumenté las ventas 20% en mi puesto anterior." (Result positivo)
- Probe: "¿Qué hiciste específicamente para lograr ese aumento?"
- Si el candidato no puede describir Action con conductas observables → la evidencia es INSUFFICIENT, a pesar del resultado positivo.

## 4. La evidencia principal

> La evidencia principal debe encontrarse en la **CONDUCTA describible y contextualizada** (Action), no en el resultado.

Un CompetencyResult SUPPORTED o STRONG requiere:
- Action específica (qué hizo el candidato, con verbo activo).
- Action mapeable a uno o más indicadores conductuales de la competencia.
- Contexto (Situation + Task) que confirme relevancia al puesto.
- Result (preferiblemente verificable, pero no suficiente por sí solo).

## 5. Estructura de captura STAR

```
STAREvidence {
  evidenceId: string
  candidateId: string
  competencyId: string
  jobId: string
  questionId: string                 // FK a InterviewQuestion
  situation: string                  // S
  task: string                       // T
  action: string                     // A — la evidencia clave
  result: string                     // R
  indicatorsObserved: string[]       // IDs de indicadores cubiertos por la Action
  collectedAt: timestamp
  collectedBy: string                // entrevistador humano
}
```

## 6. Ejemplo STAR válido — EJEMPLO — NO PRODUCTIVO

> **Competencia**: COMP-SVC-001 Servicio al cliente
> **Pregunta**: "Cuéntame de una vez que tuviste que lidiar con un cliente insatisfecho. ¿Qué hiciste?"
>
> **S**: "Trabajaba como mesero en un restaurante de comida italiana. Era un viernes a las 8pm, restaurante lleno."
> **T**: "Un comensal reclamó que su pasta estaba fría y exigía que se le cobrara la mitad."
> **A**: "Me disculpé con el cliente por la inconveniencia. Le expliqué que llevaría el plato a cocina para calentarlo. Le pregunté si quería algo más mientras esperaba (pan). Coordiné con cocina para priorizar el recalentamiento. Al regresar, le confirmé que el plato estaba a temperatura adecuada."
> **R**: "El cliente aceptó el plato recaliente, dejó propina del 15%, y no presentó reclamo posterior."

**Evaluación**:
- Action contiene conductas observables mapeables: IND-SVC-001-A (escucha/formula clarificación ✓ implícito), IND-SVC-001-C (explica alternativas ✓ "pan"), IND-SVC-001-D (conducta profesional ✓).
- Result positivo + Action específica → SUPPORTED (no STRONG; requiere múltiples ejemplos para STRONG).

## 7. Ejemplo STAR INSUFFICIENTE — EJEMPLO — NO PRODUCTIVO

> **Candidato**: "Soy excelente atendiendo clientes, siempre les doy buen servicio."

**Evaluación**: INSUFFICIENT — sin Situation, sin Task, sin Action, sin Result. Opinión general, no conducta. Ver `09-insufficient.md`.

## 8. Probes para completar STAR

Si el candidato no completa STAR espontáneamente, el entrevistador usa probes (ver `06-probes.md`):
- "¿Puedes darme un ejemplo específico de una vez que...?" (fuerza Situation)
- "¿Qué hiciste tú específicamente en esa situación?" (fuerza Action)
- "¿Qué resultó de eso?" (fuerza Result)

## 9. Conexión con niveles de evidencia

| STAR quality | Nivel típico |
|---|---|
| Sin ejemplo, opinión | NO_EVIDENCE / INSUFFICIENT |
| Ejemplo vago, Action ausente | INSUFFICIENT |
| Ejemplo con Action parcial, 1 indicador | LIMITED |
| Ejemplo claro, múltiples indicadores, Result verificable | SUPPORTED |
| Múltiples ejemplos claros, indicadores consistentes, Results verificables | STRONG |

**Regla**: el nivel lo asigna el humano, no se infiere automáticamente del STAR.
