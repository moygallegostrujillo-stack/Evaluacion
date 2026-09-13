# EVALUHR — A-06.10 — 07 · Calibración (PASO 10)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Protocolo de 5 pasos exigido por A-06.10 (identificar → consultar rúbrica → documentar →
> resolver → determinar si la rúbrica necesita modificación), operado sobre el protocolo de
> calibración de 7 pasos de A-06.7.

## 1. Proceso aplicado a cada desacuerdo

| Paso | Práctica |
|---|---|
| 1. Identificar | Comparación post-hoc de las dos pasadas ciegas; 6 desacuerdos identificados |
| 2. Consultar rúbrica | Cada desacuerdo se leyó contra las anclas de rúbrica v2 y las reglas RM-1/R/H/C; la consulta se hizo **sin** re-leer la opinión del otro revisor primero |
| 3. Documentar | Acta por desacuerdo (tabla §2): fragmento(s), regla aplicable, decisión y fundamento |
| 4. Resolver | Estado final registrado en `field-pilot-results.csv`; en duda, **prevalece el criterio conservador** (A-06.7) |
| 5. Rúbrica | ¿La rúbrica necesita modificación? → ver §3 |

**Regla cumplida**: la votación NO se usó como sustituto de la rúbrica. Ningún desacuerdo se
resolvió por mayoría; todos por referencia a anclas y reglas documentadas.

## 2. Acta de calibración (6 desacuerdos)

| ID | Desacuerdo | Regla consultada | Resolución | Fundamento |
|---|---|---|---|---|
| DIS-01 | REV-01: INVALID · REV-02: LIMITED (solo la porción válida) | Protocolo 05 + regla H/A-06.6 patrón H | **INVALID** | Una respuesta con revelación involuntaria no se "parte": se marca INVALID en su totalidad, sin registrar el contenido; la porción válida no se rescata porque rescatarla exigiría tratar el atributo revelado |
| DIS-02 | REV-01: PENDING_REVIEW · REV-02: INSUFFICIENT | CAL-21 (resultado positivo sin conducta) | **PENDING_REVIEW** | CAL-21 manda consulta, no autoprobación; INSUFFICIENT descartaría información posiblemente válida; conservador = mantener pendiente |
| DIS-03 | Rationale distinto sobre qué fragmento contradice al CV | C-1 + RM-1 | **PENDING_REVIEW**, rationale unificado al fragmento A (turno anterior a lo declarado en CV) | RM-1 fija el fragmento por indicador primario; el estado no cambia |
| DIS-04 | REV-01: INSUFFICIENT · REV-02: LIMITED (acción parcial emergió tras COL-001-D) | R1 + stop rule de PROBE-COL-001-D | **INSUFFICIENT** | El fragmento emergido era atribuible al equipo, no al participante; sin Action propia verificable → nunca SUPPORTED/LIMITED; criterio conservador |
| DIS-05 | Indicador primario distinto (A vs B) en conflicto CV | RM-1 | **IND-ORG-001-A** | La contradicción recae sobre priorización de tareas (A); el ajuste de plan (B) no está en el fragmento conflictivo |
| DIS-06 | REV-01: LIMITED · REV-02: INSUFFICIENT (hipotético sin ejemplo tras 1 redirección) | H-2 (HYPOTHETICAL → LIMITED máximo) | **LIMITED** | H-2 permite LIMITED cuando el relato hipotético redirigido muestra estructura STAR anticipada concreta; INSUFFICIENT exigiría ausencia total de contenido evaluable; regla escrita prevalece sobre impresión |

## 3. ¿La rúbrica necesita modificación? (paso 5)

| Hallazgo | ¿Modificación de rúbrica? | Acción |
|---|---|---|
| DIS-01: INVALID no define qué pasa con la porción válida del relato | **SÍ — aclaración propuesta** (no aplicada en este task) | Añadir nota de rúbrica v2.1-propuesta: "respuesta con revelación involuntaria → INVALID íntegra; no se rescata porción válida" |
| DIS-02: CAL-21 es clara pero REV-02 no la recordaba | No | Refuerzo en entrenamiento, no cambio de texto |
| DIS-04: stop rule de COL-001-D funcionó como diseño | No | El probe sí necesita refinamiento de tono (14-probe-decisions) |
| DIS-06: H-2 redactada de forma ambigua sobre "estructura anticipada" | **SÍ — aclaración menor propuesta** | Reescribir H-2 en v2.1-propuesta para explicitar el umbral LIMITED |

> Las dos aclaraciones se registran como **proposiciones** (rúbrica v2.1-PROPUESTA). **Este task NO
> modifica la rúbrica vigente** (RUBRIC-QUAL-v2-DRAFT permanece intacta); el cambio queda en cola
> para el siguiente ciclo documental, igual que los cambios de preguntas/probes.

## 4. Checkpoints de sesgo en calibración

- **Leniency** (INC-PIL-003): checkpoint añadido — relectura de anclas antes de cada bloque de 10.
- **Confirmation** (INC-PIL-009): checkpoint añadido — rationale obligatorio por fragmento, no por impresión global.
- **Drift de REV-02** (mitad del corpus, leve tendencia a severidad): corregido en calibración intermedia; sin impacto en estados finales (verificado en las 6 filas siguientes al checkpoint).

## 5. Resultado

| Métrica | Valor |
|---|---|
| Desacuerdos resueltos con rúbrica (no por votación) | 6/6 |
| Cambios de estado durante calibración | 3 (DIS-01 → INVALID; DIS-02 → PENDING_REVIEW; DIS-04 → INSUFFICIENT) |
| Desacuerdos que revelaron necesidad de aclaración de rúbrica | 2 (propostas v2.1, no aplicadas) |
| Casos M-G como referencia previa | Ejecutado por los 4 roles (03-training §4) |
