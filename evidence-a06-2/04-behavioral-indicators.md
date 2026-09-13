# A-06.2 — 04 · Indicadores Conductuales (PASO 5)

## 1. Regla

Cada competencia debe tener indicadores observables. Un indicador debe describir:

**CONDUCTA + CONTEXTO + EVIDENCIA OBSERVABLE**

Evitar: "es responsable", "es líder", "trabaja bien". Preferir formulaciones conductuales verificables.

**Todos los ejemplos en este documento**: `EJEMPLO — NO PRODUCTIVO`

## 2. Estructura de un indicador

```
BehavioralIndicator {
  indicatorId: string          // e.g. "IND-SVC-001-A"
  competencyId: string         // FK a Competency
  text: string                 // conducta observable, verbo presente, contexto
  evidenceType: 'INTERVIEW' | 'OBSERVATION' | 'WORK_SAMPLE' | 'SJT' | 'DOCUMENT'
  status: DRAFT | REVIEW | APPROVED | ACTIVE | RETIRED
  approvedBy: string?         // humano (IA no aprueba)
}
```

## 3. Ejemplos — NO PRODUCTIVO

### COMP-SVC-001: Servicio al cliente

> **EJEMPLO — NO PRODUCTIVO**
>
> Indicadores conductuales:
> - **IND-SVC-001-A**: escucha activamente la solicitud del cliente formulando preguntas de clarificación antes de responder (INTERVIEW).
> - **IND-SVC-001-B**: identifica la necesidad subyacente del cliente a partir de señales verbales y no verbales (INTERVIEW/OBSERVATION).
> - **IND-SVC-001-C**: explica alternativas o soluciones en lenguaje comprensible para el cliente (INTERVIEW).
> - **IND-SVC-001-D**: mantiene una conducta profesional (tono, lenguaje, postura) bajo presión o reclamo (OBSERVATION/INTERVIEW).
> - **IND-SVC-001-E**: hace seguimiento posterior a la interacción para confirmar que la necesidad fue resuelta (INTERVIEW/DOCUMENT).

### COMP-SVC-002: Manejo de quejas

> **EJEMPLO — NO PRODUCTIVO**
>
> - **IND-SVC-002-A**: reconoce la emoción del cliente antes de ofrecer solución (INTERVIEW/OBSERVATION).
> - **IND-SVC-002-B**: formula una disculpa o reconocimiento del problema sin admitir culpa legal (INTERVIEW).
> - **IND-SVC-002-C**: propone una acción correctiva específica dentro de su autoridad (INTERVIEW).
> - **IND-SVC-002-D**: escala el problema a un superior cuando excede su nivel de resolución (INTERVIEW).

### COMP-COL-001: Trabajo en equipo

> **EJEMPLO — NO PRODUCTIVO**
>
> - **IND-COL-001-A**: comparte información relevante con los compañeros sin que se la pidan (INTERVIEW).
> - **IND-COL-001-B**: reconoce públicamente las contribuciones de otros compañeros (INTERVIEW/OBSERVATION).
> - **IND-COL-001-C**: expone desacuerdos de forma respetuosa y orientada al problema (INTERVIEW).
> - **IND-COL-001-D**: asiste a un compañero sobrecargado cuando su propia carga lo permite (INTERVIEW).

### COMP-TRV-002: Adaptabilidad

> **EJEMPLO — NO PRODUCTIVO**
>
> - **IND-TRV-002-A**: ajusta su plan de trabajo cuando cambian las prioridades sin requerir instrucción detallada (INTERVIEW).
> - **IND-TRV-002-B**: describe un cambio organizacional o de procedimiento y cómo lo incorporó a su rutina (INTERVIEW).
> - **IND-TRV-002-C**: mantiene la efectividad ante una interrupción inesperada (cliente, falla, urgencia) (INTERVIEW/OBSERVATION).

### COMP-ORG-001: Organización del trabajo

> **EJEMPLO — NO PRODUCTIVO**
>
> - **IND-ORG-001-A**: planifica su jornada identificando tareas críticas antes de iniciar (INTERVIEW).
> - **IND-ORG-001-B**: prioriza tareas según deadline y impacto (INTERVIEW).
> - **IND-ORG-001-C**: registra y hace seguimiento de tareas pendientes (INTERVIEW/DOCUMENT).
> - **IND-ORG-001-D**: cierra tareas antes de iniciar nuevas cuando hay dependencia (INTERVIEW).

### COMP-TEC-001: Manejo de punto de venta

> **EJEMPLO — NO PRODUCTIVO**
>
> - **IND-TEC-001-A**: registra transacciones en el POS sin errores recurrentes (OBSERVATION/DOCUMENT).
> - **IND-TEC-001-B**: resuelve incidencias básicas del POS (cambio de producto, descuento autorizado) sin escalar innecesariamente (INTERVIEW/OBSERVATION).
> - **IND-TEC-001-C**: cierra la caja con cuadre al final del turno (DOCUMENT).

## 4. Reglas de redacción (reiteración de A-06.1)

1. **Verbo en presente** (escucha, identifica, explica — no "debería").
2. **Contexto laboral** específico.
3. **Observable** por un tercero.
4. **Una conducta por indicador**.
5. **Neutral** (no valorativo: "explica" no "explica bien").
6. **No discriminatorio** (ver `12-bias.md`).

## 5. Frecuencia de indicadores por competencia

| Competencia | Indicadores candidatos | Rango recomendado |
|---|---|---|
| COMP-SVC-001 Servicio al cliente | 5 | 3–5 ✓ |
| COMP-SVC-002 Manejo de quejas | 4 | 3–5 ✓ |
| COMP-COL-001 Trabajo en equipo | 4 | 3–5 ✓ |
| COMP-TRV-002 Adaptabilidad | 3 | 3–5 ✓ |
| COMP-ORG-001 Organización | 4 | 3–5 ✓ |
| COMP-TEC-001 POS | 3 | 3–5 ✓ |

## 6. Estado

Todos los indicadores están en status **DRAFT**. Para pasar a ACTIVE requieren:
- Validación contra las 8 reglas CI-VAL-1..8 (ver `05-indicator-validation.md`).
- Aprobación humana (reviewedBy + approvedBy).
- PASO de COMP-G3 (behavioral indicators gate).

Ningún indicador es productivo hasta aprobación.
