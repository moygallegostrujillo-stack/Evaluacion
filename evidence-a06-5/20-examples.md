# A-06.5 — 20 · Ejemplos (PASO 20)

## 1. Regla

Crear únicamente ejemplos metodológicos para MESERO y VENDEDOR. Usar competencias del catálogo A-06.2. Cada fila: **EJEMPLO — NO PRODUCTIVO**. No deben publicarse.

## 2. MESERO

### 2.1 InterviewGuide — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> ```
> guideId: GUIDE-MESERO-v1
> jobId: position-mesero-001
> version: Guide-v1
> status: DRAFT
> questions: [Q-MES-SVC-001, Q-MES-COL-001, Q-MES-ORG-001]
> probes: [PROBE-UNI-001..008, PROBE-SVC-001-A..D, PROBE-COL-001-A..C, PROBE-ORG-001-A..C]
> rubricId: RUBRIC-MESERO-v1
> ```

### 2.2 Preguntas — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> **Q-MES-SVC-001** (COMP-SVC-001, CRITICAL):
> - Texto: "Cuéntame de una vez específica en que tuviste que atender a un comensal insatisfecho durante un servicio. ¿Qué hiciste tú?"
> - Indicators: IND-SVC-001-A, IND-SVC-001-C, IND-SVC-001-D
> - evidenceExpected: "Action: escuchó, identificó necesidad, explicó alternativas, mantuvo calma. Result verificable."
> - notEvidence: "Opinión general. Hipotético. Atributos protegidos."
> - legalStatus: PUBLICABLE
> - status: DRAFT

> **Q-MES-COL-001** (COMP-COL-001, IMPORTANT):
> - Texto: "Describe una ocasión en que tuviste que coordinar con cocina o con otro mesero para resolver un problema durante el servicio. ¿Qué hiciste?"
> - Indicators: IND-COL-001-A, IND-COL-001-B
> - evidenceExpected: "Action: coordinó, comunicó, reconoció contribución. Result verificable."
> - legalStatus: PUBLICABLE
> - status: DRAFT

> **Q-MES-ORG-001** (COMP-ORG-001, IMPORTANT):
> - Texto: "Cuéntame de una jornada en la que tenías múltiples mesas y prioridades compitiendo. ¿Cómo organizaste tu trabajo?"
> - Indicators: IND-ORG-001-A, IND-ORG-001-B
> - evidenceExpected: "Action: priorizó, planificó, ajustó. Result verificable."
> - legalStatus: PUBLICABLE
> - status: DRAFT

### 2.3 Probes específicos — EJEMPLO — NO PRODUCTIVO

> Ver `06-probes.md` §3 para PROBE-SVC-001-A..D, PROBE-COL-001-A..C, PROBE-ORG-001-A..C.

## 3. VENDEDOR

### 3.1 InterviewGuide — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> ```
> guideId: GUIDE-VENDEDOR-v1
> jobId: position-vendedor-001
> version: Guide-v1
> status: DRAFT
> questions: [Q-VEN-SVC-002, Q-VEN-ORG-001, Q-VEN-TRV-002]
> probes: [PROBE-UNI-001..008, PROBE-SVC-002-A..D, PROBE-ORG-001-A..C, PROBE-TRV-002-A..C]
> rubricId: RUBRIC-VENDEDOR-v1
> ```

### 3.2 Preguntas — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> **Q-VEN-SVC-002** (COMP-SVC-002, IMPORTANT):
> - Texto: "Describe una ocasión en que un cliente presentó un reclamo difícil. ¿Cómo manejaste la situación paso a paso?"
> - Indicators: IND-SVC-002-A, IND-SVC-002-B, IND-SVC-002-C
> - evidenceExpected: "Action: reconoció emoción, formuló reconocimiento, propuso acción correctiva. Result verificable."
> - legalStatus: PUBLICABLE
> - status: DRAFT

> **Q-VEN-ORG-001** (COMP-ORG-001, IMPORTANT):
> - Texto: "Cuéntame de un día en que tenías múltiples clientes y tareas compitiendo. ¿Cómo organizaste tu trabajo?"
> - Indicators: IND-ORG-001-A, IND-ORG-001-B
> - evidenceExpected: "Action: priorizó, planificó. Result verificable."
> - legalStatus: PUBLICABLE
> - status: DRAFT

> **Q-VEN-TRV-002** (COMP-TRV-002, IMPORTANT):
> - Texto: "Describe una vez en que tuviste que adaptarte rápidamente a un cambio en tu entorno de trabajo (nuevo producto, cambio de política, reorganización). ¿Qué hiciste?"
> - Indicators: IND-TRV-002-A, IND-TRV-002-B
> - evidenceExpected: "Action: ajustó plan, incorporó cambio. Result verificable."
> - legalStatus: PUBLICABLE
> - status: DRAFT

## 4. Respuestas de ejemplo (categorizadas) — EJEMPLO — NO PRODUCTIVO

### CONCRETE_BEHAVIOR → VALID → SUPPORTED

> **EJEMPLO — NO PRODUCTIVO**
>
> Q-MES-SVC-001. Candidato: "Trabajaba como mesero, un viernes a las 8pm. Un comensal reclamó que su pasta estaba fría. Me disculpé, le expliqué que llevaría el plato a cocina, le pregunté si quería pan. Coordiné con cocina. Al regresar, le confirmé la temperatura. El cliente aceptó, dejó 15% de propina, sin reclamo."
>
> Categoría: CONCRETE_BEHAVIOR → Estado: VALID → Nivel: SUPPORTED.

### HYPOTHETICAL → LIMITED

> **EJEMPLO — NO PRODUCTIVO**
>
> Q-VEN-SVC-002. Candidato: "Si tuviera un cliente con un reclamo, lo escucharía y le ofrecería una solución."
>
> Categoría: HYPOTHETICAL → Estado: LIMITED → Nivel: LIMITED.

### GENERAL_CLAIM → INSUFFICIENT

> **EJEMPLO — NO PRODUCTIVO**
>
> Q-MES-SVC-001. Candidato: "Siempre trato bien a los clientes."
>
> Categoría: GENERAL_CLAIM → Estado: INSUFFICIENT → Nivel: INSUFFICIENT.

### EXTERNAL_RESULT → PENDING_REVIEW

> **EJEMPLO — NO PRODUCTIVO**
>
> Q-VEN-ORG-001. Candidato: "Aumenté las ventas 50% en mi puesto."
>
> Categoría: EXTERNAL_RESULT → Estado: PENDING_REVIEW (hasta verificar Action).

## 5. Regla de no publicación

Todos los ejemplos están marcados **EJEMPLO — NO PRODUCTIVO**. No pueden usarse en producción hasta:
- Aprobación humana (reviewedBy + approvedBy).
- Pasar INTERVIEW-G2..G9.
- Revisión legal (INTERVIEW-G7 / LEGAL-G7).
- Pilotaje (INTERVIEW-G9).
