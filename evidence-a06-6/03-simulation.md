# A-06.6 — 03 · Ejecución Simulada (PASO 3)

## 1. Regla

Para cada caso: presentar pregunta → probes → respuesta sintética → identificar S/T/A/R → identificar conducta observable → identificar información ausente → aplicar estado de evidencia. **No asignar puntos.**

Todos los casos: **PILOTO + NO PRODUCTIVO**.

---

## CASO M-A: Respuesta concreta y completa (Patrón A)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-SVC-001: "Cuéntame de una vez específica en que tuviste que atender a un comensal insatisfecho durante un servicio. ¿Qué hiciste tú?" |
| Probe usado | PROBE-UNI-003 ("¿Qué ocurrió después?") — para obtener R |
| Respuesta sintética (MES-1) | S: "Estaba en una cafetería un sábado a mediodía, lleno. T: Un comensal reclamó que su sopa estaba fría. A: Me disculpé, llevé la sopa a calentar, le ofrecí pan mientras esperaba, al servirla le pregunté si estaba bien. R: El comensal quedó satisfecho, dejó propina, y el encargado lo notó." |
| S | ✓ presente (sábado mediodía, cafetería llena) |
| T | ✓ presente (sopa fría, reclamo) |
| A | ✓ presente (se disculpó, calentó, ofreció pan, preguntó) |
| R | ✓ presente (satisfecho, propina, encargado notó) |
| Conducta observable | Mapea a IND-SVC-001-A (escucha), IND-SVC-001-C (explica alternativas), IND-SVC-001-D (conducta profesional) |
| Información ausente | Ninguna relevante |
| Categoría | CONCRETE_BEHAVIOR |
| evidenceState | VALID |
| evidenceLevel | SUPPORTED (3 indicadores en 1 ejemplo; no STRONG porque es 1 solo ejemplo) |
| rationale | "Action específica mapeando a 3 indicadores con Result verificable. SUPPORTED." |

---

## CASO M-B: Respuesta vaga (Patrón B)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-SVC-001 (misma) |
| Probes usados | PROBE-UNI-005 ("¿Puedes darme un ejemplo específico de una vez que...?") — redirigir |
| Respuesta sintética (MES-1) | "Siempre trato bien a los clientes. Los clientes están contentos conmigo." Tras probe: "Bueno, siempre cumplo con mi trabajo." |
| S | ✗ ausente |
| T | ✗ ausente |
| A | ✗ ausente |
| R | ✗ ausente |
| Conducta observable | Ninguna |
| Categoría | GENERAL_CLAIM |
| evidenceState | INSUFFICIENT |
| evidenceLevel | INSUFFICIENT (≠ 0; no veto) |
| rationale | "Afirmación general sin Situation/Task/Action/Result. Tras probe no aportó ejemplo. INSUFFICIENT — no se infiere conducta." |

---

## CASO M-C: Respuesta hipotética (Patrón C)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-SVC-001 |
| Probes usados | PROBE-UNI-005 (redirigir a pasado) |
| Respuesta sintética (MES-1) | "Si un comensal se quejara, lo escucharía con calma y le ofrecería una solución." |
| S | ✗ (escenario imaginado) |
| T | ✗ |
| A | ✗ (intención, no acción) |
| R | ✗ |
| Conducta observable | Ninguna (es intención) |
| Categoría | HYPOTHETICAL |
| evidenceState | LIMITED |
| evidenceLevel | LIMITED (no SUPPORTED; juicio razonable pero sin conducta pasada) |
| rationale | "Respuesta hipotética sin ejemplo pasado. Juicio razonable pero sin conducta observable. HYPOTHETICAL → LIMITED." |

---

## CASO M-D: Respuesta sin acción propia (Patrón D)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-COL-001: "Describe una ocasión en que coordinaste con cocina o con otro mesero para resolver un problema. ¿Qué hiciste?" |
| Probes usados | PROBE-UNI-001 ("¿Qué hiciste tú específicamente?") |
| Respuesta sintética (MES-2) | "En mi trabajo anterior hubo un problema de demoras en los platos. Entre todos lo resolvimos y el servicio mejoró." Tras probe: "Bueno, el chef reorganizó la cocina y nosotros seguimos sus instrucciones." |
| S | ✓ presente (demoras en platos) |
| T | ✓ implícito (resolver demoras) |
| A | ✗ (la acción fue del chef; el candidato solo "siguió instrucciones") |
| R | ✓ presente (servicio mejoró) |
| Conducta observable | Ninguna del candidato |
| Categoría | CONCRETE_BEHAVIOR parcial (equipo) |
| evidenceState | INSUFFICIENT |
| evidenceLevel | INSUFFICIENT |
| rationale | "La Action descrita es del chef, no del candidato. 'Seguir instrucciones' no es conducta de coordinación observable del candidato. Sin Action propia → INSUFFICIENT." |

---

## CASO M-E: Resultado positivo sin conducta clara (Patrón E)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-ORG-001: "Cuéntame de una jornada en la que tenías múltiples mesas y prioridades compitiendo. ¿Cómo organizaste tu trabajo?" |
| Probes usados | PROBE-UNI-001 ("¿Qué hiciste tú específicamente?") |
| Respuesta sintética (MES-2) | "Aumentamos la eficiencia del servicio un 30% ese año. Fue un gran logro." Tras probe: "Bueno, mejoró todo. No recuerdo exactamente qué hice yo." |
| S | ✗ ausente |
| T | ✗ ausente |
| A | ✗ ausente (no describe qué hizo él) |
| R | ✓ presente (30% eficiencia) pero sin conducta que lo explique |
| Conducta observable | Ninguna |
| Categoría | EXTERNAL_RESULT |
| evidenceState | PENDING_REVIEW |
| evidenceLevel | PENDING_REVIEW |
| rationale | "Resultado positivo sin Action que lo explique. Resultado externo ≠ competencia demostrada. PENDING_REVIEW hasta verificar con referencia o segunda entrevista." |

---

## CASO M-F: Respuesta contradictoria con CV (Patrón F)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-ORG-001 |
| Probes usados | PROBE-UNI-001, PROBE-UNI-002 ("¿Cuál fue tu decisión?") |
| Respuesta sintética (MES-2) | CV: "Supervisé 15 personas en cocina." Entrevista: no describe ninguna conducta de supervisión (no explica cómo asignó tareas, cómo dio feedback). |
| S | ✗ |
| T | ✗ |
| A | ✗ |
| R | ✗ |
| Conducta observable | Ninguna |
| Categoría | CONTRADICTION |
| evidenceState | PENDING_REVIEW |
| evidenceLevel | PENDING_REVIEW |
| rationale | "CV afirma supervisión de 15 personas; entrevista no demuestra conducta. CONFLICT → PENDING_REVIEW. No se promedian fuentes; no 'gana' el CV." |

---

## CASO M-G: Respuesta incompleta (Patrón G)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-SVC-002: "Cuéntame de una vez que un comensal presentó un reclamo. ¿Cómo lo manejaste?" |
| Probes usados | PROBE-UNI-001 (para Action) |
| Respuesta sintética (MES-3) | S: "En mi puesto anterior un cliente se quejó de que el café estaba frío. A: Le dije que se lo cambiaría." — R ausente tras probe. |
| S | ✓ presente |
| T | ✓ implícito |
| A | ✓ parcial (solo "le dije que cambiaría"; no describe cómo manejó la emoción del cliente ni qué ofreció) |
| R | ✗ ausente |
| Conducta observable | 1 indicador (reconoció el problema ≈ IND-SVC-002-B parcial) |
| Categoría | CONCRETE_BEHAVIOR parcial |
| evidenceState | LIMITED |
| evidenceLevel | LIMITED |
| rationale | "Action parcial: solo indica cambio, sin manejo de emoción ni alternativas. 1 indicador. LIMITED." |

---

## CASO M-H: Revelación involuntaria (Patrón H)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-TRV-002: "Cuéntame de una vez que el menú cambió o hubo un imprevisto. ¿Cómo te adaptaste?" |
| Probes usados | Ninguno necesario (la respuesta ya contiene Action) |
| Respuesta sintética (MES-3) | "Cuando la cafetería cambió de proveedor de pan, mis compañeros y yo tuvimos que aprender a manejar las quejas de clientes celíacos. Yo, como soy embarazada, tuve que tener más cuidado..." |
| S | ✓ presente |
| T | ✓ presente |
| A | ✓ presente (aprendió a manejar quejas de celiacos) |
| R | — parcial |
| Revelación involuntaria | **"soy embarazada"** — atributo protegido (LFT Art 3) |
| Conducta observable | Mapea a IND-TRV-002-A/B ✓ |
| Categoría | Revelación involuntaria + CONCRETE_BEHAVIOR |
| evidenceState | **INVALID** para la revelación; **la conducta de adaptabilidad SÍ se registra** |
| evidenceLevel | LIMITED (1-2 indicadores; la revelación no afecta la conducta descrita) |
| rationale | "El candidato reveló involuntariamente embarazo (atributo protegido). REGLA A-06.4 `04-prohibited-data.md` §5: NO registrar el atributo; NO usar para decisión; NO profundizar. La conducta de adaptabilidad (aprendió a manejar quejas de celiacos) SÍ se registra: LIMITED. La revelación se marca INVALID y no se usa." |

---

## CASO M-I: Respuesta sin evidencia (Patrón I)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-TRV-002 (candidato entry-level sin experiencia) |
| Probes usados | PROBE-UNI-005 (redirigir a experiencia académica/voluntariado) |
| Respuesta sintética (MES-3) | "No he trabajado nunca. No tengo ejemplos de adaptación en el trabajo." |
| S | ✗ |
| T | ✗ |
| A | ✗ |
| R | ✗ |
| Conducta observable | Ninguna |
| Categoría | NO_INFORMATION |
| evidenceState | NO_EVIDENCE |
| evidenceLevel | NO_EVIDENCE |
| rationale | "Candidato entry-level sin experiencia; no puede aportar ejemplo laboral. NO_EVIDENCE legítimo (no es faking). Para entry-level se recomendaría pregunta situacional como complemento (A-06.3 `02-bdi.md` §3)." |

---

## CASO M-J: Respuesta muy fuerte (Patrón J)

> **PILOTO + NO PRODUCTIVO**

| Elemento | Contenido |
|---|---|
| Pregunta | Q-MES-COL-001 |
| Probes usados | Ninguno (la respuesta primaria fue completa) |
| Respuesta sintética (MES-3) | Ejemplo 1: "Durante un servicio con ausencia de un mesero, coordiné con cocina para priorizar platos y con el hostess para distribuir mesas. Result: no hubo demoras." Ejemplo 2: "En otra ocasión, cuando un compañero se lesionó, cubrí sus mesas mientras el encargado gestionaba el relevo. Result: el servicio no se detuvo." |
| S | ✓ ambos ejemplos |
| T | ✓ ambos |
| A | ✓ ambos (coordinó con cocina + cubrió mesas) |
| R | ✓ ambos (no hubo demoras; servicio no se detuvo) |
| Conducta observable | Ejemplo 1: IND-COL-001-A (comparte info), IND-COL-001-C (expone desacuerdos/dificultades). Ejemplo 2: IND-COL-001-D (asiste a compañero). |
| Categoría | CONCRETE_BEHAVIOR múltiple |
| evidenceState | VALID |
| evidenceLevel | STRONG (2+ ejemplos, indicadores consistentes, Results verificables) |
| rationale | "Múltiples ejemplos claros (2), cada uno con Action mapeable a indicadores, con Results verificables. STRONG." |

---

## CASOS VENDEDOR (V-A a V-J)

Los 10 casos VENDEDOR siguen la misma estructura con las preguntas Q-VEN-* y competencias correspondientes. Resumen:

| caseId | Pregunta | Patrón | Categoría | evidenceState | evidenceLevel | rationale (resumen) |
|---|---|---|---|---|---|---|
| V-A | Q-VEN-SVC-001 | A | CONCRETE_BEHAVIOR | VALID | SUPPORTED | Action específica (escuchó, identificó, explicó alternativas) + Result verificable (cliente compró) |
| V-B | Q-VEN-SVC-002 | B | GENERAL_CLAIM | INSUFFICIENT | INSUFFICIENT | Afirmación general sin STAR |
| V-C | Q-VEN-SVC-002 | C | HYPOTHETICAL | LIMITED | LIMITED | Intención sin pasado |
| V-D | Q-VEN-COL-001 | D | CONCRETE_BEHAVIOR parcial | INSUFFICIENT | INSUFFICIENT | Acción del supervisor, no del candidato |
| V-E | Q-VEN-ORG-001 | E | EXTERNAL_RESULT | PENDING_REVIEW | PENDING_REVIEW | Resultado 30% sin Action |
| V-F | Q-VEN-TRV-002 | F | CONTRADICTION | PENDING_REVIEW | PENDING_REVIEW | CV "supervisé 15 empleados" sin conducta en entrevista |
| V-G | Q-VEN-SVC-001 | G | CONCRETE_BEHAVIOR parcial | LIMITED | LIMITED | Action parcial (1 indicador) |
| V-H | Q-VEN-TRV-002 | H | Revelación involuntaria | INVALID (atributo) + conducta registrada | LIMITED | Reveló religión involuntariamente; conducta de adaptabilidad se registra |
| V-I | Q-VEN-COL-001 | I | NO_INFORMATION | NO_EVIDENCE | NO_EVIDENCE | Entry-level sin experiencia |
| V-J | Q-VEN-ORG-001 | J | CONCRETE_BEHAVIOR múltiple | VALID | STRONG | 2+ ejemplos con indicadores consistentes |

---

## Resumen de estados por patrón

| Patrón | Estado resultante | ¿Conforme a lo esperado? |
|---|---|---|
| A | VALID → SUPPORTED | ✓ |
| B | INSUFFICIENT | ✓ (no 0, no veto) |
| C | LIMITED | ✓ (no SUPPORTED) |
| D | INSUFFICIENT | ✓ (sin Action propia) |
| E | PENDING_REVIEW | ✓ (resultado ≠ competencia) |
| F | PENDING_REVIEW | ✓ (CONFLICT) |
| G | LIMITED | ✓ (Action parcial) |
| H | INVALID (atributo) + conducta registrada | ✓ (revelación involuntaria manejada) |
| I | NO_EVIDENCE | ✓ (ausencia legítima) |
| J | VALID → STRONG | ✓ |
