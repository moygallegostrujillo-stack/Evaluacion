# A-06.2 — 15 · Auditoría de Solapamiento (PASO 4, 22)

## 1. Regla

Comparar las competencias candidatas con: IPIP legacy, Personality, Knowledge, Integrity. Identificar: REDUNDANT / PARTIALLY_OVERLAPPING / DISTINCT. **No eliminar nada del código.**

## 2. Matriz de solapamiento

| Competencia candidata | Compara con | Tipo | Nota |
|---|---|---|---|
| COMP-TRV-001 Comunicación efectiva | PSICOLOGICA EMPATHY | PARTIALLY_OVERLAPPING | Empathy mide comprensión emocional; Comunicación mide transmisión clara. Distinto foco; ambos pueden coexistir |
| COMP-TRV-002 Adaptabilidad | PSICOLOGICA ADAPTABILITY | PARTIALLY_OVERLAPPING | Mismo constructo; la competencia mide conducta observable, PSICOLOGICA mide auto-reporte Likert. Riesgo de redundancia si ambos alimentan decisión |
| COMP-TEC-001 Manejo de POS | Knowledge canónico (MESERO/CAJERO) | DISTINCT | Knowledge mide conocimiento (test); competencia mide conducta de operación. No redundante |
| COMP-TEC-002 Higiene alimentaria | Knowledge canónico (COCINERO) | DISTINCT | Knowledge mide conocimiento de protocolos; competencia mide aplicación conductual. No redundante |
| COMP-SVC-001 Servicio al cliente | PSICOLOGICA EMPATHY / Integrity INTEGRITY_HONESTY | DISTINCT | Empathy mide comprensión; Servicio mide acción dirigida al cliente. Integrity mide honestidad. Distintos focos |
| COMP-SVC-002 Manejo de quejas | PSICOLOGICA STRESS | DISTINCT | Stress mide manejo de presión personal; Manejo de quejas mide gestión de cliente difícil. Distinto |
| COMP-LDR-001 Dirección de equipo | PSICOLOGICA LEADERSHIP | PARTIALLY_OVERLAPPING | Mismo constructo; competencia mide conducta observable (asignar tareas, dar feedback), PSICOLOGICA mide auto-reporte. Riesgo de redundancia |
| COMP-COL-001 Trabajo en equipo | PSICOLOGICA TEAMWORK | PARTIALLY_OVERLAPPING | Mismo constructo; competencia mide conducta observable, PSICOLOGICA mide auto-reporte |
| COMP-COL-002 Cooperación interárea | PSICOLOGICA TEAMWORK | DISTINCT | Cooperación interárea mide coordinación entre áreas distintas; TEAMWORK mide colaboración en el propio equipo |
| COMP-ORG-001 Organización del trabajo | PSICOLOGICA STRESS | DISTINCT | Organización mide planificación; STRESS mide manejo de presión |
| COMP-ORG-002 Gestión del tiempo | Integrity INTEGRITY_RESPONSIBILITY | PARTIALLY_OVERLAPPING | Ambos tocan "responsabilidad"; Integrity mide honestidad/cumplimiento; Gestión del tiempo mide priorización. Distinto foco pero riesgo de confusión conceptual |

## 3. Análisis por instrumento existente

### 3.1 Personality (Big Five demo) — A-05.3 retirada de V1

- **Estado**: NOT_IMPLEMENTED en V1 (A-05.2 OPTION E; A-05.3 implementado).
- **Solapamiento**: las competencias transversales (Comunicación, Adaptabilidad, Colaboración, Liderazgo) **podrían** confundirse con dimensiones de personalidad (Extraversión, Agreeableness, Conscientiousness).
- **Distinción clave**: personalidad mide rasgos latentes (auto-reporte); competencias miden conductas observables (BDI/STAR). No son equivalentes.
- **Acción**: documentar la distinción en la definición de cada competencia para evitar que RR.HH. las trate como sinónimos.

### 3.2 Knowledge canónico (A-03.5)

- **Estado**: IMPLEMENTED; motor canónico con versionado + evidenceStatus.
- **Solapamiento**: competencias técnicas (COMP-TEC-001 POS, COMP-TEC-002 Higiene) **podrían** confundirse con Knowledge.
- **Distinción clave**: Knowledge mide recurso cognitivo (test de respuesta correcta/incorrecta); competencia técnica mide conducta de aplicación (operación real del POS, aplicación real de higiene).
- **Acción**: documentar la distinción. Knowledge y competencia técnica pueden coexistir; miden cosas distintas (saber vs. hacer).

### 3.3 Integrity (A-04.1/A-04.2)

- **Estado**: AISLADA del overallScore (A-04.5); demo de 10 preguntas LEGACY.
- **Solapamiento**: COMP-ORG-002 (Gestión del tiempo) puede tocarse con INTEGRITY_RESPONSIBILITY.
- **Distinción clave**: Integrity mide honestidad/cumplimiento normativo; Gestión del tiempo mide priorización y autogestión. Distinto foco.
- **Acción**: documentar la distinción. No asumir que "responsabilidad" = integridad.

### 3.4 IPIP legacy

- **Estado**: NUNCA existió en el repo (A-04.4 forense git confirmado).
- **Solapamiento**: N/A.
- **Acción**: ninguna.

## 4. Resumen de solapamientos

| Tipo | Cantidad | Acción |
|---|---|---|
| REDUNDANT | 0 | Ninguna competencia es pura redundancia de otro instrumento |
| PARTIALLY_OVERLAPPING | 5 | COMP-TRV-001, COMP-TRV-002, COMP-LDR-001, COMP-COL-001, COMP-ORG-002 — documentar distinción |
| DISTINCT | 6 | COMP-TEC-001, COMP-TEC-002, COMP-SVC-001, COMP-SVC-002, COMP-COL-002, COMP-ORG-001 — sin acción |

## 5. Regla: no eliminar nada del código

Esta auditoría es **documental**. No se elimina nada de Personality/Knowledge/Integrity/PSICOLOGICA del código. La distinción se logra por:
- Documentación clara de qué mide cada uno.
- CompetencyResult separado de overallScore (A-06.1 §6: no se conecta).
- PSICOLOGICA sigue en overallScore (A-04.5 OVERALL-v1.1 incluye PSY); competencias NO entran overallScore.

## 6. Riesgo de confusión conceptual

El riesgo principal es que RR.HH. trate "Trabajo en equipo" (PSICOLOGICA Likert) y "Trabajo en equipo" (competencia BDI) como sinónimos. Mitigación:
- Nombres distintos en UI (e.g. "Trabajo en equipo (auto-evaluación)" vs "Trabajo en equipo (entrevista)").
- Documentación clara en definición de competencia de la distinción.
- CompetencyResult con `evidenceType: INTERVIEW_STAR` distinguible de PSICOLOGICA score.
