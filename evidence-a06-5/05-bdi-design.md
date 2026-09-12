# A-06.5 — 05 · Diseño BDI (PASO 4)

## 1. Requisitos de una pregunta BDI primaria

Una pregunta primaria BDI debe buscar:

| Elemento | Qué busca | Cómo se verifica |
|---|---|---|
| Situación real pasada | Un evento específico que ocurrió | "Cuéntame de una vez..." / "Describe una ocasión..." |
| Contexto | Dónde, cuándo, en qué puesto | El candidato describe Situation + Task |
| Rol del candidato | Qué hacía el candidato en esa situación | "¿Qué hacías tú en ese momento?" |
| Acción propia | Qué hizo el candidato específicamente | "¿Qué hiciste tú?" → Action |
| Resultado | Qué ocurrió después | "¿Qué resultó de eso?" → Result |

## 2. Pregunta que NO es BDI suficiente

> Una pregunta que solicite únicamente **"¿qué harías?"** no será evidencia BDI suficiente.

**Ejemplo NO BDI**:
> "¿Qué harías si un cliente se enoja?"

**Por qué no es BDI suficiente**:
- Pide intención futura, no conducta pasada.
- No produce STAR completo (no hay Situation/Task reales).
- Clasificación: HYPOTHETICAL → LIMITED (no SUPPORTED/STRONG sin conducta pasada).
- Ver A-06.3 `08-hypothetical.md`.

## 3. Reformulación a BDI válida

| No BDI | BDI válida |
|---|---|
| "¿Qué harías si un cliente se enoja?" | "Cuéntame de una vez específica en que un cliente se enojó contigo durante un servicio. ¿Qué hiciste?" |
| "¿Cómo manejarías una queja?" | "Describe una ocasión en que un cliente presentó un reclamo. ¿Cómo manejaste la situación paso a paso?" |
| "¿Eres bueno atendiendo clientes?" | "Dame un ejemplo concreto de una vez que diste un excelente servicio al cliente. ¿Qué hiciste?" |

## 4. Estructura de redacción BDI

1. **Apertura conductual**: "Cuéntame de una vez...", "Describe una ocasión...", "Dame un ejemplo de...".
2. **Pasado**: verbos o frases que pidan experiencia previa.
3. **Específica**: "una vez específica", no "generalmente".
4. **Foco en el candidato**: "qué hiciste tú", no "qué hizo el equipo".
5. **Contexto laboral**: situada en el ámbito del puesto.
6. **Una competencia por pregunta**: no mezclar.
7. **Vinculada a indicadores**: cada pregunta mapea a 1+ indicadores.

## 5. Mapeo a indicador (PASO 5)

Cada pregunta debe tener:

```
competencyId + indicatorId + jobId + rationale
```

Sin esos cuatro elementos: **NO_PUBLICABLE**.

**Ejemplo**:
> questionId: Q-SVC-001-A
> competencyId: COMP-SVC-001 (Servicio al cliente)
> indicatorId: [IND-SVC-001-A, IND-SVC-001-C, IND-SVC-001-D]
> jobId: position-mesero-001 (vía guideId)
> rationale: "El 80% de las interacciones del mesero son con comensales; la satisfacción del cliente determina propinas y retención. Esta pregunta busca evidencia de conducta de servicio bajo presión."

## 6. Validación de BDI

Antes de APPROVED, una pregunta BDI primaria debe:
1. Buscar conducta pasada (no intención).
2. Tener los 4 elementos (competencyId + indicatorId + jobId + rationale).
3. Pasar las 6 preguntas de proporcionalidad (A-06.5 `12-proportionality.md`).
4. Pasar la auditoría de sesgo (A-06.5 `11-bias-review.md`).
5. Tener `legalStatus = PUBLICABLE` (A-06.4).
6. Tener `evidenceExpected` + `notEvidence` definidos.

## 7. Conexión con gates

El diseño BDI pasa INTERVIEW-G4 (question quality). Sin validación BDI + mapeo a indicador, la pregunta no pasa a ACTIVE.
