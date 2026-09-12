# A-06.5 — 21 · Banco Candidato (PASO 21)

## 1. Regla

Crear un banco **CANDIDATO**, no productivo. Todos: **DRAFT / EXAMPLE**.

## 2. Banco candidato

Para cada pregunta:

| questionId | jobExample | competency | indicator | question | probes | evidenceExpected | notEvidence | biasStatus | status |
|---|---|---|---|---|---|---|---|---|---|
| Q-MES-SVC-001 | MESERO | COMP-SVC-001 Servicio al cliente | IND-SVC-001-A/C/D | "Cuéntame de una vez específica en que tuviste que atender a un comensal insatisfecho. ¿Qué hiciste tú?" | PROBE-SVC-001-A..D, PROBE-UNI-001..008 | Action: escuchó, identificó, explicó, mantuvo calma. Result verificable. | Opinión general. Hipotético. Atributos protegidos. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-MES-COL-001 | MESERO | COMP-COL-001 Trabajo en equipo | IND-COL-001-A/B | "Describe una ocasión en que coordinaste con cocina u otro mesero para resolver un problema. ¿Qué hiciste?" | PROBE-COL-001-A..C, PROBE-UNI-001..008 | Action: coordinó, comunicó, reconoció contribución. Result verificable. | Equipo sin Action del candidato. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-MES-ORG-001 | MESERO | COMP-ORG-001 Organización del trabajo | IND-ORG-001-A/B | "Cuéntame de una jornada con múltiples mesas y prioridades. ¿Cómo organizaste tu trabajo?" | PROBE-ORG-001-A..C, PROBE-UNI-001..008 | Action: priorizó, planificó, ajustó. Result verificable. | Opinión general. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-VEN-SVC-002 | VENDEDOR | COMP-SVC-002 Manejo de quejas | IND-SVC-002-A/B/C | "Describe una ocasión en que un cliente presentó un reclamo difícil. ¿Cómo manejaste la situación paso a paso?" | PROBE-SVC-002-A..D, PROBE-UNI-001..008 | Action: reconoció emoción, formuló reconocimiento, propuso acción correctiva. Result verificable. | Opinión general. Hipotético. Atributos protegidos. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-VEN-ORG-001 | VENDEDOR | COMP-ORG-001 Organización del trabajo | IND-ORG-001-A/B | "Cuéntame de un día con múltiples clientes y tareas compitiendo. ¿Cómo organizaste tu trabajo?" | PROBE-ORG-001-A..C, PROBE-UNI-001..008 | Action: priorizó, planificó. Result verificable. | Opinión general. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-VEN-TRV-002 | VENDEDOR | COMP-TRV-002 Adaptabilidad | IND-TRV-002-A/B | "Describe una vez en que tuviste que adaptarte a un cambio en tu entorno de trabajo. ¿Qué hiciste?" | PROBE-TRV-002-A..C, PROBE-UNI-001..008 | Action: ajustó plan, incorporó cambio. Result verificable. | Opinión general. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-MES-SVC-002 | MESERO | COMP-SVC-002 Manejo de quejas | IND-SVC-002-A/B/C | "Cuéntame de una vez que un comensal presentó un reclamo. ¿Cómo lo manejaste?" | PROBE-SVC-002-A..D, PROBE-UNI-001..008 | Action: reconoció emoción, propuso solución. Result verificable. | Opinión general. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-VEN-COL-001 | VENDEDOR | COMP-COL-001 Trabajo en equipo | IND-COL-001-A/B | "Describe una vez que colaboraste con otro vendedor para atender a un cliente. ¿Qué hiciste?" | PROBE-COL-001-A..C, PROBE-UNI-001..008 | Action: coordinó, comunicó. Result verificable. | Equipo sin Action. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-MES-TRV-002 | MESERO | COMP-TRV-002 Adaptabilidad | IND-TRV-002-A/B | "Cuéntame de una vez que el menú cambió o hubo un imprevisto durante el servicio. ¿Cómo te adaptaste?" | PROBE-TRV-002-A..C, PROBE-UNI-001..008 | Action: ajustó, incorporó cambio. Result verificable. | Opinión general. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |
| Q-VEN-SVC-001 | VENDEDOR | COMP-SVC-001 Servicio al cliente | IND-SVC-001-A/C/D | "Cuéntame de una vez específica en que atendiste a un cliente con una necesidad compleja. ¿Qué hiciste?" | PROBE-SVC-001-A..D, PROBE-UNI-001..008 | Action: escuchó, identificó, explicó. Result verificable. | Opinión general. Hipotético. | PUBLICABLE | DRAFT/EXAMPLE |

## 3. Total

- **10 preguntas candidatas** (MESERO: 5; VENDEDOR: 5).
- Todas status: **DRAFT / EXAMPLE**.
- Todas legalStatus: **PUBLICABLE** (ninguna introduce atributos protegidos).

## 4. Regla de no productividad

> Ninguna pregunta del banco candidato es productiva. Todas requieren:
> - Aprobación humana (reviewedBy + approvedBy).
> - Pasar INTERVIEW-G2..G9.
> - Revisión legal (INTERVIEW-G7 / LEGAL-G7).
> - Pilotaje (INTERVIEW-G9).

## 5. Conexión con matrices

Las preguntas del banco candidato se registran en:
- `question-quality.csv` (PASO 22): calidad por pregunta.
- `question-traceability.csv` (PASO 23): trazabilidad questionId→competencyId→indicatorId→jobId.
