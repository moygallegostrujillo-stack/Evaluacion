# EVALUHR — A-06.7 — 11 · Material de Entrenamiento de Sesgos (PASO 12)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Casos de entrenamiento para 8 sesgos + demostración de cómo la
> rúbrica v2 reduce cada efecto. Extiende A-06.5 `11-bias-review.md` y A-06.6 `10-bias.md` (6 sesgos
> contenidos en el piloto) con los 2 adicionales requeridos (leniency/severity ya implicados, drift).

## 1. Formato de cada viñeta (para el entrenamiento M3)

Viñeta sintética → pregunta guía ("¿qué haría el evaluador sin rúbrica?") → protección de la rúbrica →
señal de alerta para auto-detección.

## 2. Los 8 sesgos entrenables

### 2.1 Halo
- **Definición**: un rasgo positivo (o negativo) tiñe la evaluación de todo lo demás.
- **Viñeta (CAL-29)**: el candidato llegó puntual, bien vestido, con el CV impecable; su respuesta a Q-MES-ORG-001 es vaga ("siempre organizo todo bien"). Sin rúbrica, el evaluador tiende a SUPPORTED "porque se ve profesional".
- **Protección de la rúbrica**: el nivel se asigna solo por indicadores observados en la respuesta; la imagen y puntualidad no son indicadores de COMP-ORG-001 → la única asignación válida es INSUFFICIENT con rationale.
- **Señal de alerta**: si tu rationale cita algo que no está en la respuesta (impresión, presencia, "me cayó bien"), hay halo.

### 2.2 Similarity
- **Definición**: favorecer a quien "se parece a mí" (trayectoria, acento, gustos, estilo).
- **Viñeta (CAL-30)**: el candidato también empezó de mesero en la colonia del evaluador; su respuesta es hipotética. Sin rúbrica: "yo era así y salí bien → LIMITED... bueno, SUPPORTED".
- **Protección**: la rúbrica no contiene categorías de afinidad; HYPOTHETICAL → LIMITED como máximo (regla H-1), igual que para cualquier candidato.
- **Señal de alerta**: si piensas "es como yo", nombra los indicadores de la respuesta antes de continuar.

### 2.3 Confirmation
- **Definición**: buscar/ponderar solo lo que confirma la primera impresión.
- **Viñeta (CAL-31)**: tras una primera respuesta débil, el evaluador decide "no sirve" y deja de aplicar probes a las siguientes preguntas (sesión truncada).
- **Protección**: el protocolo fija probes por pregunta con stop rules (máx 3; máx 2 redirecciones) — la estructura obliga a elicitar igual en todas las preguntas; la primera impresión no cancela preguntas.
- **Señal de alerta**: si saltas probes o acortas preguntas por "ya sé cómo es", hay confirmation.

### 2.4 Stereotype
- **Definición**: atribuir capacidades por grupo (edad, género, origen, apariencia).
- **Viñeta (CAL-32)**: "a su edad ya debería estar en gerencia, algo no cuadra" o "las mujeres son más pacientes con clientes" → inflar/deflacionar IND-SVC-001 por grupo.
- **Protección**: los atributos protegidos no existen en la rúbrica; los indicadores son conductas observables; además, la regla de revelación involuntaria impide registrar/usar el atributo. Auditoría A-06.5/A-06.6: ninguna pregunta elicitía atributos.
- **Señal de alerta**: cualquier "por ser/debería por su…". Detener y re-anclar en indicadores.

### 2.5 Leniency
- **Definición**: inflar sistemáticamente (todo LIMITED→SUPPORTED, todo SUPPORTED→STRONG).
- **Viñeta (CAL-33)**: el evaluador "quiere ser amable" y asigna SUPPORTED a M-G ("total, sí reconoció el problema").
- **Protección**: las anclas por indicador (RM-1) + el caso M-G como referencia obligatoria de calibración; el conteo indicadores→nivel fija la frontera.
- **Señal de alerta**: si tu SUPPORTED no puede citar 3+ indicadores con R verificable, es leniency.

### 2.6 Severity
- **Definición**: endurecer sistemáticamente (nada alcanza SUPPORTED).
- **Viñeta (CAL-34)**: ante V-A (caso completo), el evaluador exige "referencia verificada" para conceder SUPPORTED — requisito que la rúbrica no pide.
- **Protección**: el criterio de SUPPORTED es conducta + R verificable (observable), no verificación externa; la duda persistente se resuelve en calibración (paso 5-6), no endureciendo de facto la rúbrica.
- **Señal de alerta**: si pides estándares que no están en la rúbrica, estás añadiendo criterio por tu cuenta.

### 2.7 Central tendency
- **Definición**: evitar extremos; todo termina LIMITED "por si acaso".
- **Viñeta (CAL-35)**: ante M-J (2 ejemplos completos con resultados), el evaluador asigna LIMITED "para no arriesgar".
- **Protección**: la regla indicadores→nivel es explícita (3+ en 2+ ejemplos → elegible STRONG); la duda razonable se documenta como rationale, no se resuelve comprimiendo todo a LIMITED.
- **Señal de alerta**: si tu distribución histórica es ~100% LIMITED, hay tendencia central (se detecta en la comparación periódica).

### 2.8 Drift
- **Definición**: el criterio se desliza con el tiempo (el "SUPPORTED" de hoy es el "LIMITED" de hace 3 meses, o viceversa), sin cambio de rúbrica.
- **Viñeta (CAL-36)**: tras 50 entrevistas, un evaluador empieza a aceptar "le dije que cambiaría" como Action completa (exactamente el error del Reviewer B en M-G).
- **Protección**: calibración periódica + por señal; re-anclaje con M-G; cambios de criterio solo vía **nueva versión de rúbrica** (nunca tácitos).
- **Señal de alerta**: si razonas "bueno, ya sabemos qué significa esto" sin citar el ancla, hay drift.

## 3. Cómo la rúbrica v2 reduce los 8 efectos (resumen)

| Mecanismo de la rúbrica v2 | Sesgos que contiene |
|---|---|
| Nivel asignado **solo por indicadores observados**, citados en la rationale | Halo, similarity, stereotype, confirmation |
| Anclas por indicador + conteo indicadores→nivel (0 / 1–2 / 3+1 / 3+2+) | Leniency, severity, central tendency |
| Casos ancla de calibración (M-G obligatorio) + sesiones periódicas | Drift, leniency, severity |
| Regla "el conservador prevalece ante duda, y el caso se marca para calibración" | Leniency (evita inflar) sin castigar (no comprime a LIMITED) |
| Probes fijos con stop rules | Confirmation (mismas oportunidades de evidencia para todos) |
| Regla de revelación involuntaria + atributos fuera de la rúbrica | Stereotype, halo |

## 4. Notas de uso en entrenamiento

- Las viñetas CAL-29..36 se agregan a `calibration-cases.csv` (como notas de calibración) y al módulo M3.
- Ejercicio estándar: cada participante evalúa la viñeta "sin rúbrica" primero (a mano alzada), luego con
  la rúbrica; el contraste hace visible el sesgo — más efectivo que la exposición teórica.
- **La rúbrica reduce, no elimina**: por eso la calibración periódica y el refresco M7 siguen siendo
  obligatorios. Ningún entrenamiento sustituye gates (G7/G9) ni autoriza uso productivo.
