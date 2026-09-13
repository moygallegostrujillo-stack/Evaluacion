# EVALUHR — A-06.11 · 03 · QUESTION LEGAL PACKAGE (PASO 3)

## 0. Estatus y provenance

- **ESTATUS GLOBAL: DRAFT — NO PRODUCTIVO.** Ninguna pregunta de este banco está ACTIVE, PUBLICADA ni habilitada para uso con candidatos reales.
- Contador preservado del registro de auditoría (A-06.5/A-06.8): **10 preguntas candidatas**.
- **PROVENANCE de los textos**: DRAFT v2 CONSOLIDADO — redactados bajo las reglas de diseño verificadas de A-06.3 `05-question-design.md` §5 (apertura conductual, pasado, específica, foco en el candidato, neutral, una competencia, vinculada a indicadores), sobre el catálogo verificado de A-06.2. El banco fuente A-06.5 no está materializado en disco (ver 01). El abogado dictamina sobre estos textos tal como constan aquí.
- **Cambios de estado en A-06.11**: solo uno, y es un escalamiento (no degradación): Q-VEN-COL-001 PUBLICABLE → **LEGAL_REVIEW**, porque el encargo A-06.11 la designa de atención especial. Resultado: **3 preguntas con acción REVISE** (2 CONDITIONAL preservadas + 1 LEGAL_REVIEW escalada).

## 1. Mapa de vinculación (trazabilidad PASO 16 de A-06.3)

```
questionId → competencyId → indicatorId(s) → job → versión (InterviewQuestion-v2-DRAFT)
```

Competencias de origen (catálogo verificado A-06.2, estado DRAFT):
- COMP-TRV-001 Comunicación efectiva (IMPORTANT) · COMP-TRV-002 Adaptabilidad (IMPORTANT)
- COMP-SVC-001 Servicio al cliente (CRITICAL, MESERO) · COMP-SVC-002 Manejo de quejas (IMPORTANT, VENDEDOR)
- COMP-COL-001 Trabajo en equipo (IMPORTANT) · COMP-ORG-001 Organización del trabajo (IMPORTANT)

## 2. Auditoría por pregunta

### 2.1 Q-MES-TRV-001

| Campo | Valor |
|---|---|
| job | MESERO |
| competencyId | COMP-TRV-001 Comunicación efectiva |
| indicatorId | IND-TRV-001-A (mensaje claro), IND-TRV-001-B (adaptación de registro al interlocutor) |
| purpose | Evidenciar conducta pasada de comunicación clara con cliente o compañero durante servicio |
| text (DRAFT v2) | "Cuéntame de una vez específica en que explicaste algo importante a un compañero o a un cliente durante el servicio y notaste que no te entendieron a la primera. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | STAR completo con Action propia concreta mapeable a 2+ indicadores |
| biasRisk | BAJO — contenido neutro, sin atributos protegidos |
| privacyRisk | BAJO — se limita a hechos laborales; probe UNI-007 no debe usarse aquí sin acotamiento |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

### 2.2 Q-MES-TRV-002 ⚠

| Campo | Valor |
|---|---|
| job | MESERO |
| competencyId | COMP-TRV-002 Adaptabilidad |
| indicatorId | IND-TRV-002-A (ajuste de conducta ante cambio), IND-TRV-002-C (mantener efectividad) |
| purpose | Evidenciar conducta pasada de adaptación a cambio operativo del puesto |
| text (DRAFT v2) | "Cuéntame de una vez específica en que tu sección, mesa asignada o turnación cambió de forma inesperada durante el servicio. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) acotado a cambio operativo |
| evidenceExpected | STAR con Action propia ante el cambio; Result del ajuste |
| biasRisk | BAJO |
| privacyRisk | **MEDIO** — preguntas de adaptabilidad derivan con facilidad hacia causas personales del cambio (familia, salud, migración, horarios de cuidado). La redacción debe permanecer clavada al cambio operativo y la guía debe contener la prohibición explícita de indagar causas personales |
| legalStatus | **CONDITIONAL** (preservado del registro A-06.8) |
| openIssue | Riesgo de elicitar contexto personal no laboral vía la narrativa del candidato; requiere límite de guía + regla de no conservación si aparece contenido sensible |
| requiredChange | (1) Restringir enunciado a cambios operativos del puesto; (2) añadir a la guía: "no indagar causas personales del cambio"; (3) aplicar protocolo UNINVITED_DISCLOSURE si el candidato revela origen personal (07); (4) validar en dictamen. → **REVISE** |

### 2.3 Q-MES-SVC-001

| Campo | Valor |
|---|---|
| job | MESERO |
| competencyId | COMP-SVC-001 Servicio al cliente (CRITICAL para MESERO) |
| indicatorId | IND-SVC-001-A (escucha/clarificación), IND-SVC-001-C (explica alternativas), IND-SVC-001-D (conducta profesional bajo presión) |
| purpose | Evidenciar manejo conductual de cliente insatisfecho |
| text (DRAFT v2) | "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho durante un servicio. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | STAR completo; SUPPORTED requiere Action que mapee a 3+ indicadores + Result verificable (ejemplo calibrado en A-06.3 `21-examples.md` §2.5) |
| biasRisk | BAJO — validado contra lista prohibida de A-06.3 `13-bias.md` |
| privacyRisk | BAJO |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

### 2.4 Q-MES-COL-001

| Campo | Valor |
|---|---|
| job | MESERO |
| competencyId | COMP-COL-001 Trabajo en equipo |
| indicatorId | IND-COL-001-A (cooperación activa), IND-COL-001-B (comparte información) |
| purpose | Evidenciar coordinación con compañero/cocina en servicio |
| text (DRAFT v2) | "Cuéntame de una vez en que tuviste que coordinar con un compañero o con cocina para resolver un problema durante el servicio. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | Action propia (no del equipo); probe UNI-001 disponible para "hicimos" |
| biasRisk | BAJO |
| privacyRisk | BAJO-MEDIO — la narrativa de equipo puede nombrar terceros; regla: no registrar identificadores de terceros |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

### 2.5 Q-MES-ORG-001

| Campo | Valor |
|---|---|
| job | MESERO |
| competencyId | COMP-ORG-001 Organización del trabajo |
| indicatorId | IND-ORG-001-A (prioriza), IND-ORG-001-C (da seguimiento) |
| purpose | Evidenciar organización ante prioridades competidas |
| text (DRAFT v2) | "Describe una jornada en la que tuviste múltiples prioridades compitiendo en tu sección. ¿Cómo organizaste tu trabajo y qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | Método de priorización + Result |
| biasRisk | BAJO |
| privacyRisk | BAJO |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

### 2.6 Q-VEN-TRV-001

| Campo | Valor |
|---|---|
| job | VENDEDOR |
| competencyId | COMP-TRV-001 Comunicación efectiva |
| indicatorId | IND-TRV-001-A, IND-TRV-001-B |
| purpose | Evidenciar comunicación adaptada al cliente en venta |
| text (DRAFT v2) | "Cuéntame de una vez específica en que explicaste un producto o servicio a un cliente y notaste que no lo comprendía. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | Ajuste de explicación + Result de comprensión |
| biasRisk | BAJO — neutro; no indaga nivel educativo ni acento |
| privacyRisk | BAJO |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

### 2.7 Q-VEN-TRV-002 ⚠

| Campo | Valor |
|---|---|
| job | VENDEDOR |
| competencyId | COMP-TRV-002 Adaptabilidad |
| indicatorId | IND-TRV-002-A, IND-TRV-002-C |
| purpose | Evidenciar adaptación a cambio operativo de venta |
| text (DRAFT v2) | "Cuéntame de una vez específica en que tu meta, zona de venta o promoción cambió de forma inesperada durante tu jornada. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) acotado a cambio operativo |
| evidenceExpected | Action propia ante el cambio; Result del ajuste |
| biasRisk | BAJO |
| privacyRisk | **MEDIO** — mismo riesgo que Q-MES-TRV-002 (derivación hacia causas personales: reasignaciones, ingresos, familia) |
| legalStatus | **CONDITIONAL** (preservado del registro A-06.8) |
| openIssue | Idéntico a 2.2 |
| requiredChange | Igual que 2.2 (límite de guía + no indagar causas personales + UNINVITED_DISCLOSURE + dictamen). → **REVISE** |

### 2.8 Q-VEN-SVC-001

| Campo | Valor |
|---|---|
| job | VENDEDOR |
| competencyId | COMP-SVC-002 Manejo de quejas (IMPORTANT para VENDEDOR) |
| indicatorId | IND-SVC-002-A (reconoce emoción), IND-SVC-002-B (disculpa/reconocimiento), IND-SVC-002-C (acción correctiva), IND-SVC-002-D (escala si excede autoridad) |
| purpose | Evidenciar manejo paso a paso de reclamo difícil |
| text (DRAFT v2) | "Describe una ocasión en que un cliente presentó un reclamo difícil. ¿Cómo manejaste la situación paso a paso?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | STAR completo; calibrado con ejemplo SUPPORTED de A-06.3 `21-examples.md` §3.4 |
| biasRisk | BAJO |
| privacyRisk | BAJO — puede elicitar agresión verbal recibida; se registra la conducta propia del candidato, no el historial del tercero |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

### 2.9 Q-VEN-COL-001 ⚠ (atención especial A-06.11)

| Campo | Valor |
|---|---|
| job | VENDEDOR |
| competencyId | COMP-COL-001 Trabajo en equipo |
| indicatorId | IND-COL-001-A (cooperación activa), IND-COL-001-C (reconoce contribución del otro) |
| purpose | Evidenciar apoyo a compañero para lograr venta o resolver problema con cliente |
| text (DRAFT v2) | "Cuéntame de una vez específica en que apoyaste a un compañero del piso de ventas para lograr una venta o resolver un problema con un cliente. ¿Qué hiciste tú?" |
| dataRequested | Relato de conducta laboral pasada (STAR) propia |
| evidenceExpected | Action propia de apoyo; Result conjunto |
| biasRisk | MEDIO-BAJO — riesgo de similarity/halo al valorar "ayudar al compañero" según afinidad narrativa; mitigado por rúbrica por indicador + doble revisión |
| privacyRisk | **MEDIO** — el apoyo entre compañeros puede arrastrar narrativas de conflicto interpersonal, datos personales de terceros (nombres, situaciones familiares o económicas del compañero) o detalles no laborales |
| legalStatus | **LEGAL_REVIEW** (escalamiento de A-06.11; estado previo PUBLICABLE se preserva como antecedente) |
| openIssue | Confirmar con dictamen: (a) si el enunciado acotado basta para excluir datos de terceros; (b) regla de no conservación de identificadores de terceros; (c) si requiere reescritura o basta con límites de guía |
| requiredChange | (1) Añadir límite de guía: "no registrar identificadores ni datos personales de terceros"; (2) acotar probes COL a conducta propia; (3) someter a dictamen antes de cualquier estado REVIEW. → **REVISE** |

### 2.10 Q-VEN-ORG-001

| Campo | Valor |
|---|---|
| job | VENDEDOR |
| competencyId | COMP-ORG-001 Organización del trabajo |
| indicatorId | IND-ORG-001-A, IND-ORG-001-B (ajusta plan) |
| purpose | Evidenciar organización entre zona propia y tareas concurrentes |
| text (DRAFT v2) | "Describe una jornada de ventas en la que tuviste que cubrir tu zona y apoyar otra tarea al mismo tiempo. ¿Cómo organizaste tu trabajo?" |
| dataRequested | Relato de conducta laboral pasada (STAR) |
| evidenceExpected | Priorización + seguimiento + Result |
| biasRisk | BAJO |
| privacyRisk | BAJO |
| legalStatus | **PUBLICABLE** |
| openIssue | Ninguno identificado |
| requiredChange | — (KEEP) |

## 3. Registro consolidado (10 preguntas)

| # | questionId | job | competencyId | legalStatus | Decisión A-06.11 |
|---|---|---|---|---|---|
| 1 | Q-MES-TRV-001 | MESERO | COMP-TRV-001 | PUBLICABLE | KEEP |
| 2 | Q-MES-TRV-002 | MESERO | COMP-TRV-002 | **CONDITIONAL** | **REVISE** |
| 3 | Q-MES-SVC-001 | MESERO | COMP-SVC-001 | PUBLICABLE | KEEP |
| 4 | Q-MES-COL-001 | MESERO | COMP-COL-001 | PUBLICABLE | KEEP |
| 5 | Q-MES-ORG-001 | MESERO | COMP-ORG-001 | PUBLICABLE | KEEP |
| 6 | Q-VEN-TRV-001 | VENDEDOR | COMP-TRV-001 | PUBLICABLE | KEEP |
| 7 | Q-VEN-TRV-002 | VENDEDOR | COMP-TRV-002 | **CONDITIONAL** | **REVISE** |
| 8 | Q-VEN-SVC-001 | VENDEDOR | COMP-SVC-002 | PUBLICABLE | KEEP |
| 9 | Q-VEN-COL-001 | VENDEDOR | COMP-COL-001 | **LEGAL_REVIEW** | **REVISE** |
| 10 | Q-VEN-ORG-001 | VENDEDOR | COMP-ORG-001 | PUBLICABLE | KEEP |

**Contador: 10 preguntas · 7 PUBLICABLE (KEEP) · 2 CONDITIONAL (REVISE) · 1 LEGAL_REVIEW (REVISE) · 0 NO_PUBLICABLE · 0 ACTIVE.**

## 4. Reglas transversales que el dictamen debe confirmar

1. Ninguna pregunta entra en ACTIVE sin: dictamen (INTERVIEW-G7/LEGAL-G8) + piloto (INTERVIEW-G9) + aprobación humana (governance).
2. Ninguna pregunta se publica en el producto antes del dictamen.
3. Las 3 REVISE no pasan a REVIEW hasta ejecutar su `requiredChange` y obtener respuesta legal.
4. Los 7 KEEP quedan PUBLICABLE-EN-ESPERA: aptos para el dictamen, no aptos para producción.
5. Prohibiciones estructurales heredadas de A-06.3 `05-question-design.md` §4: abstractas, filosóficas, moralizantes, de personalidad, discriminatorias, innecesariamente sensibles, hipotéticas puras, cerradas sí/no.
