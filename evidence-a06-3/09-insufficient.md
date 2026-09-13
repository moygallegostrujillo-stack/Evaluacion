# A-06.3 — 09 · Respuesta Vaga / Insuficiente (PASO 10)

## 1. Regla

> Una respuesta vaga sin situación concreta ni acción = **INSUFFICIENT**. No convertir en 0. No inferir.

## 2. Ejemplo

> Pregunta BDI: "Cuéntame de una vez que tuviste que atender a un cliente insatisfecho."
>
> Respuesta vaga: "Siempre trato bien a los clientes, les doy buen servicio."

**Evaluación**: INSUFFICIENT.

**Por qué**:
- Sin Situation (¿cuándo? ¿dónde? ¿qué cliente?).
- Sin Task (¿cuál era el reto?).
- Sin Action (¿qué hiciste específicamente?).
- Sin Result (¿qué pasó después?).
- Es una afirmación general de auto-percepción, no conducta observable.

## 3. Casos de respuesta insuficiente

| Caso | Ejemplo | Nivel |
|---|---|---|
| Respuesta vaga | "Siempre trato bien a los clientes" | INSUFFICIENT |
| Respuesta hipotética pura (sin pasado tras probe) | "Lo escucharía con calma" | HYPOTHETICAL → LIMITED (ver `08-hypothetical.md`) |
| Ausencia de ejemplo | "Nunca he tenido un cliente enojado" | NO_EVIDENCE |
| Ejemplo sin conducta | "Tuve un cliente difícil, le hablé y se calmó" | INSUFFICIENT (falta Action específica) |
| Ejemplo imposible de verificar | "Aumenté las ventas 50%" (sin detalle) | PENDING_REVIEW |
| Contradicción | CV dice X, entrevista no demuestra | PENDING_REVIEW (ver `10-conflicts.md`) |

## 4. Manejo en la entrevista

Cuando la respuesta es vaga, el entrevistador **usa probes** para forzar especificidad:

> **EJEMPLO — NO PRODUCTIVO**
>
> Candidato: "Siempre trato bien a los clientes."
>
> Entrevistador (probe PROBE-UNI-005): "¿Puedes contarme una vez específica en que atendiste a un cliente insatisfecho? ¿Qué hiciste en esa ocasión?"

Si el candidato aporta ejemplo tras probe → re-evaluar según calidad de la Action.
Si el candidato persiste en generalidades → INSUFFICIENT.

## 5. Regla: NO convertir en 0

> **INSUFFICIENT ≠ 0 puntos.**

La competencia no "recibe 0 puntos". Se registra:
- `evidenceLevel: INSUFFICIENT`
- `evidenceStatus: INSUFFICIENT`
- `rationale: <texto justificando el nivel>`

La competencia queda **excluida de cualquier agregación automática** (regla A-04.5/A-05.3 governance: INSUFFICIENT no alimenta decisiones globales).

## 6. Regla: NO inferir

> **No inferir**: si el candidato no describe Action específica, no se asume que la hizo.

No se atribuye conducta que el candidato no describió. No se "completa" el STAR con suposiciones del entrevistador.

## 7. Registro

```
InterviewEvidence {
  evidenceType: 'AFIRMACION'  // o 'OPINION' / 'SUPUESTO'
  evidenceLevel: 'INSUFFICIENT'
  evidenceStatus: 'INSUFFICIENT'
  rationale: "El candidato respondió con afirmación general ('siempre trato bien a los clientes') sin Situation, Task, Action o Result específicos. Tras probe, no aportó ejemplo concreto. Clasificado INSUFFICIENT — no se infiere conducta."
  indicatorsObserved: []
  indicatorsAbsent: ['IND-SVC-001-A', 'IND-SVC-001-B', ...]
}
```

## 8. No veto automático

INSUFFICIENT **no descalifica automáticamente** al candidato. Es evidencia para RR.HH. La decisión final es humana (LFPDPPP Art. 37 Bis). Una competencia INSUFFICIENT puede ser compensada por fortalezas en otras.

## 9. Diferencia INSUFFICIENT vs NO_EVIDENCE

| Nivel | Significado |
|---|---|
| NO_EVIDENCE | El candidato no pudo aportar ningún ejemplo (ausencia total) |
| INSUFFICIENT | El candidato respondió pero la respuesta no es aprovechable (vaga, opinión, sin conducta) |

Ambos excluyen de agregación automática; ninguno se convierte en 0.
