# A-06.2 — 09 · Evidencia Insuficiente (PASO 11)

## 1. Regla

> **Nunca**: 0 puntos. **INSUFFICIENT ≠ 0**.

Los casos de evidencia insuficiente terminan en `INSUFFICIENT` o `PENDING_REVIEW`, nunca en un score numérico.

## 2. Casos de evidencia insuficiente

| Caso | Descripción | Nivel resultante |
|---|---|---|
| Respuesta vaga | El candidato da una opinión general sin conducta observable ("soy bueno con clientes") | INSUFFICIENT |
| Respuesta hipotética | El candidato dice qué "haría" en lugar de qué "hizo" (futuro vs pasado) | INSUFFICIENT |
| Ausencia de ejemplo | El candidato no puede aportar ningún evento pasado relevante | NO_EVIDENCE |
| Ejemplo sin conducta | El candidato describe una situación pero no su Action específica | INSUFFICIENT |
| Ejemplo imposible de verificar | El candidato narra algo inverificable o contradictorio | PENDING_REVIEW |
| Contradicción | CV dice X, entrevista no lo demuestra (o viceversa) | PENDING_REVIEW (ver `10-conflicts.md`) |

## 3. Detalle por caso

### 3.1 Respuesta vaga

> "Soy muy responsable en mi trabajo. Siempre cumplo con mis tareas."

**Por qué INSUFFICIENT**: no hay Situation, no hay Task, no hay Action observable, no hay Result. Es una auto-evaluación, no conducta. Los adjetivos ("responsable") son juicios, no evidencia.

**Probe de profundización**: "¿Puedes contarme una vez específica en que tuviste que cumplir una tarea difícil bajo presión? ¿Qué hiciste?"

Si el candidato persiste en generalidades → INSUFFICIENT.

### 3.2 Respuesta hipotética

> "Si tuviera un cliente enojado, lo escucharía y le ofrecería una solución."

**Por qué INSUFFICIENT**: describe intención futura, no conducta pasada. BDI requiere evidencia de comportamiento pasado (predictor más fuerte que intención). El SJT mide intención; BDI mide conducta.

**Probe**: "Cuéntame de una vez específica en que SÍ tuviste un cliente enojado. ¿Qué hiciste?"

### 3.3 Ausencia de ejemplo

> "Nunca he tenido un cliente enojado." (en un puesto de mesero con 3 años de experiencia)

**Por qué NO_EVIDENCE**: no hay evento del cual extraer conducta. Puede ser:
- verdad (contexto inusual) → NO_EVIDENCE legítimo;
- evasión → el entrevistador puede re-preguntar con otro escenario.

Si el candidato sistemáticamente no puede aportar ejemplos → NO_EVIDENCE para esa competencia.

### 3.4 Ejemplo sin conducta

> "Una vez tuve un cliente difícil en el restaurante. Le hablé y se calmó."

**Por qué INSUFFICIENT**: falta la Action específica. "Le hablé" no es conducta observable diferenciable. ¿Qué dijo? ¿Qué hizo?

**Probe**: "¿Qué le dijiste específicamente? ¿Qué hiciste?"

### 3.5 Ejemplo imposible de verificar

> "Aumenté las ventas 50% en mi puesto anterior." (sin detalle de cómo, sin contexto verificable)

**Por qué PENDING_REVIEW**: la afirmación es verificable (en principio) pero no se verificó. Puede ser cierta, exagerada, o debida a factores externos. Se marca PENDING_REVIEW hasta verificar con referencia o documentación.

### 3.6 Contradicción

> CV: "Lideré un equipo de 15 personas por 2 años."
> Entrevista: no puede describir una decisión de liderazgo específica.

**Por qué PENDING_REVIEW**: conflicto entre CV (documental) y entrevista (conductual). NO se promedian; NO "gana" el CV automáticamente. Ver `10-conflicts.md`.

## 4. Regla: NO 0 puntos

Estos casos **nunca** se convierten en 0. La competencia no "recibe 0 puntos". Se registra:
- `evidenceLevel: INSUFFICIENT` (o NO_EVIDENCE / PENDING_REVIEW según caso)
- `evidenceStatus: INSUFFICIENT` (o PENDING_REVIEW)
- `rationale: <texto justificando el nivel>`

La competencia queda **excluida de cualquier agregación automática** (regla A-04.5/A-05.3 governance: INSUFFICIENT/NOT_APPROVED no alimenta decisiones globales).

## 5. Conexión con CompetencyResult

```
CompetencyResult {
  evidenceLevel: 'INSUFFICIENT'  // o NO_EVIDENCE / PENDING_REVIEW
  evidenceStatus: 'INSUFFICIENT' // o PENDING_REVIEW
  rationale: "El candidato describió una situación pero no aportó Action específica observable. Se solicita profundización; en su ausencia, INSUFFICIENT."
  indicatorsObserved: []
  indicatorsAbsent: ['IND-SVC-001-A', 'IND-SVC-001-B', ...]
  conflicts: []
  status: 'PENDING_REVIEW'  // requiere revisión humana antes de APPROVED
}
```

## 6. Decisión humana

INSUFFICIENT/NO_EVIDENCE/PENDING_REVIEW **no descalifican automáticamente** al candidato. Son evidencia para RR.HH. La decisión final es humana (LFPDPPP Art. 37 Bis). Una competencia INSUFFICIENT puede ser compensada por fortalezas en otras competencias o instrumentos.
