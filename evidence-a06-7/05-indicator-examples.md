# EVALUHR — A-06.7 — 05 · Ejemplos de Evidencia por Indicador (PASO 4 + PASO 6)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Ejemplos de **evidencia observada** (no "respuestas correctas").
> Todos los fragmentos son sintéticos y derivan de los casos del piloto A-06.6 y de micro-casos de
> calibración creados en A-06.7 (CAL-21..CAL-26, ver `calibration-cases.csv`).

## 1. Cómo leer los ejemplos

- Cada indicador tiene: qué **sí** es evidencia del indicador (frontera LIMITED / SUPPORTED) y qué **no** lo es (confusión común detectada en el piloto).
- La frontera LIMITED↔SUPPORTED es el conteo de indicadores cubiertos + Result verificable (`04-rubric.md` §3); la frontera SUPPORTED↔STRONG es el número de ejemplos (1 vs 2+).

## 2. COMP-SVC-001 Servicio al cliente (CRITICAL)

| Indicador | Evidencia LIMITED (1 fragmento) | Evidencia hacia SUPPORTED (fragmento adicional que suma) | NO es evidencia de este indicador |
|---|---|---|---|
| IND-SVC-001-A Detecta la necesidad del cliente (escucha/preguntas) | "Le pregunté si era alergia o preferencia" | "Escuché todo lo que pedía sin interrumpir y le repetí el pedido para confirmar" | "Soy bueno entendiendo a la gente" (GENERAL_CLAIM) |
| IND-SVC-001-B Adapta el trato a la situación/tipo de cliente | "Con el señor mayor le hablé despacio y sin tecnicismos" | + "y con el turista usé señas y le mostré el menú traducido" | "Me adapto a todo" (sin ejemplo) |
| IND-SVC-001-C Explica y comunica con claridad | "Le expliqué que la sopa tardaría 5 minutos" | + "y le ofrecí pan mientras esperaba" | "Le dije que se lo cambiaría" (promesa futura — cubre 002-C parcial, no 001-C) |
| IND-SVC-001-D Mantiene conducta profesional bajo demanda | "Me disculpé aunque no era mi culpa" | + "mantuve el tono calmado con el comensal levantando la voz" | "Nunca me altero" (auto-descripción sin situación) |
| IND-SVC-001-E Da seguimiento hasta cerrar la necesidad | "Al servirla le pregunté si estaba bien" | + "pasé a los 10 minutos a confirmar que todo estuviera bien" (PROBE-SVC-001-D) | "El cliente quedó contento" (resultado, sin conducta de seguimiento) |

## 3. COMP-SVC-002 Manejo de quejas (IMPORTANT)

| Indicador | Evidencia LIMITED | Evidencia hacia SUPPORTED | NO es evidencia de este indicador |
|---|---|---|---|
| IND-SVC-002-A Mantiene la calma y maneja la emoción del cliente | "Lo dejé desahogarse sin interrumpir" | + "baje el tono de voz y me acerqué a su mesa para que no gritara frente a otros" | "El cliente estaba enojado" (hecho del cliente, no conducta del candidato) |
| IND-SVC-002-B Reconoce e identifica el problema real | "Le dije que entendía que esperar tanto lo molestaba" | + "y le pregunté si el problema era la espera o el plato en sí" | "Reconocí el problema" (afirmación sin cómo) |
| IND-SVC-002-C Propone acción correctiva/alternativas dentro de su margen | "Le dije que se lo cambiaría" (parcial — promesa) | + "le llevé dos opciones: cambiar el plato o traerlo recalentado con una bebida de cortesía; eligió la segunda" | "Lo solucioné" (resultado sin conducta) |
| IND-SVC-002-D Escala al responsable cuando excede su autoridad | "Avisé al encargado porque pedían descuento" | + "le comenté al encargado lo acordado para que el cliente no tuviera que repetir todo" | "El encargado resolvió" (acción ajena — patrón D) |

## 4. COMP-COL-001 Trabajo en equipo (IMPORTANT)

| Indicador | Evidencia LIMITED | Evidencia hacia SUPPORTED | NO es evidencia de este indicador |
|---|---|---|---|
| IND-COL-001-A Comparte información relevante con el equipo | "Avisé a cocina que venía una mesa grande" | + "y le pasé a la hostess la mesa que liberaba primero para repartir mejor" | "Nos organizamos" (colectivo sin Action propia) |
| IND-COL-001-B Pide y ofrece ayuda ante carga | "Le pedí a otra mesera que me tomara la mesa 5" | + "y cuando ella se atascó, le tomé dos mesas a ella" | "Trabajo muy bien en equipo" (GENERAL_CLAIM — CAL-25) |
| IND-COL-001-C Expone desacuerdos/dificultades de forma constructiva | "Le dije al chef que los platos salían desordenados y propuse salir por orden de mesa" | + "acordamos probarlo ese día y revisar al cierre" | "Discutimos" (sin conducta constructiva) |
| IND-COL-001-D Asiste/cubre a un compañero | "Cubrí las mesas del compañero lesionado" | + "mientras el encargado gestionaba el relevo, le informé a cada mesa el cambio" | "El equipo cubrió" (acción de otros — M-D/V-D) |

## 5. COMP-ORG-001 Organización del trabajo (IMPORTANT)

| Indicador | Evidencia LIMITED | Evidencia hacia SUPPORTED | NO es evidencia de este indicador |
|---|---|---|---|
| IND-ORG-001-A Prioriza tareas cuando compiten | "Primero serví las bebidas de las 3 mesas nuevas" | + "dejé el cobro para después de sentar a la pareja con bebé que esperaba" | "Organicé todo bien" (sin criterio de prioridad) |
| IND-ORG-001-B Planifica su turno/jornada | "Antes de abrir revisé reservaciones y armé el orden de secciones" | + "y dejé preparados los ostiones de la barra para el pico de las 2pm" | "Aumentamos la eficiencia 30%" (EXTERNAL_RESULT — CAL-21) |
| IND-ORG-001-C Controla/seguimiento de pendientes | "Llevaba lista de lo que faltaba servir" | + "la revisaba cada vez que entregaba un plato" | "No se me olvida nada" (afirmación) |
| IND-ORG-001-D Ajusta el plan ante imprevistos manteniendo el control | "Cuando se cayó una bandeja, reordené la salida de platos" | + "y avisé a las mesas afectadas el nuevo tiempo" | "Ese día todo cambió" (solo Situation) |

## 6. COMP-TRV-002 Adaptabilidad (IMPORTANT)

| Indicador | Evidencia LIMITED | Evidencia hacia SUPPORTED | NO es evidencia de este indicador |
|---|---|---|---|
| IND-TRV-002-A Ajusta su rutina/método ante el cambio | "Rehice mi ruta de mesas por el nuevo montaje" | + "y cambié el orden de comanda para no cruzarme con el montaje" | "Me adapto rápido" (GENERAL_CLAIM) |
| IND-TRV-002-B Incorpora el cambio (aprende/aplica) | "Aprendí a manejar las quejas de clientes celíacos con el nuevo proveedor" | + "y armé con cocina la lista de platos seguros para ofrecer de entrada" | "Fue todo muy distinto" (solo Situation) |
| IND-TRV-002-C Mantiene efectividad durante/tras el cambio | "Mis tiempos de servicio no bajaron esa semana" | + "lo verifiqué con los tiempos de comanda de la terminal" (R verificable) | "Sigo igual que siempre" (sin anclaje) |

## 7. COMP-TEC-001 (sin pregunta en el banco — NO pilotado)

Los indicadores IND-TEC-001-A/B/C tienen anclas en `rubric-by-indicator.csv` para completitud del catálogo,
**marcadas NO PILOTADO**: COMP-TEC-001 no tiene pregunta candidata en el banco A-06.5. No deben usarse
para evaluar evidencia hasta que exista pregunta pilotada.

## 8. PASO 6 — Diferenciación Resultado vs Conducta (casos creados para calibración)

> Objetivo: demostrar que **el resultado externo no controla automáticamente** la valoración de la competencia.

### 8.1 Resultado POSITIVO + conducta INSUFICIENTE → no escala (CAL-21, MESERO, Q-MES-ORG-001)

> "Aumentamos la eficiencia del servicio un 30% ese año. Fue un gran logro." — Tras PROBE-UNI-001: "Mejoró todo. No recuerdo exactamente qué hice yo."

- Categoría: EXTERNAL_RESULT → estado: **PENDING_REVIEW** → nivel: PENDING_REVIEW (nunca SUPPORTED por el número).
- Lectura v2: un 30% de eficiencia **no organiza nada por sí mismo**: sin Action propia no hay indicadores IND-ORG-001 observados. El resultado puede ser del equipo, del mercado o del azar.
- Error común que la rúbrica bloquea: "30% es un gran número → SUPPORTED/STRONG". La rúbrica v2 no pondera magnitudes de resultado; **exige conducta mapeable a indicadores**.

### 8.2 Resultado MODESTO + conducta FUERTE → escala (CAL-22, VENDEDOR, Q-VEN-ORG-001)

> "Fue una mañana saturada, con un solo cajón abierto. Hice una fila express para 2 artículos, pedí que apartaran las devoluciones para la tarde y avise a los clientes el tiempo aproximado. Al final vendimos un poco menos que un sábado normal, pero nadie se fue por la fila y no hubo reclamos."

- Categoría: CONCRETE_BEHAVIOR → estado: VALID → nivel: **SUPPORTED** (IND-ORG-001-A priorizó + IND-ORG-001-B planificó + IND-ORG-001-D ajustó + R observable: nadie se fue sin atender, sin reclamos).
- Lectura v2: el resultado es modesto ("un poco menos que un sábado normal") pero la **Action mapea a 3 indicadores** con R verificable → SUPPORTED. El modesto resultado no castiga.

### 8.3 Regla derivada (PASO 6)

> **El nivel lo fija la conducta (Action→indicadores + R verificable), nunca la magnitud del resultado.**
> Resultado positivo sin conducta → PENDING_REVIEW (CAL-21). Resultado modesto con conducta mapeable →
> puede alcanzar SUPPORTED (CAL-22). Ambos casos entran al material de calibración/entrenamiento.
