# EVALUHR — A-06.10 — 09 · Sesgos (PASO 13)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Registro de incidentes de sesgo por las 8 categorías entrenables de A-06.7. Regla: **no se
> recopilaron atributos personales innecesarios** — el monitoreo de sesgos se hace sobre el
> comportamiento del entrevistador/revisor y la respuesta, nunca sobre la persona simulada.

## 1. Matriz de sesgos observados

| Sesgo | Incidentes | Detalle | Acción | Estado |
|---|---|---|---|---|
| Halo | 1 | S-PIL-02 · Q-MES-SVC-001 (patrón J): relato inicial muy fuerte que amenazaba con "teñir" la lectura de las preguntas siguientes | Autodetectado por REV-01 en rationale; niveles de las 5 respuestas de la sesión revisados individualmente — sin arrastre | Resuelto |
| Similarity | 0 | Sin episodios (perfiles sintéticos sin semejanza registrable; rol no identificable) | — | N/A |
| Confirmation | 1 | S-PIL-10 · REV-02: búsqueda de fragmentos que confirmaban primera impresión en Q-VEN-SVC-001 (INC-PIL-009) | Divergencia de rationale hizo visible el sesgo; recalibración con RM-1; checkpoint añadido | Resuelto |
| Stereotype | 0 | Sin episodios (ningún atributo demográfico presente en registros) | — | N/A |
| Leniency | 1 | S-PIL-07 · INT-01: encuadre simpático en 3 respuestas consecutivas (INC-PIL-003) | Doble revisión lo detectó; feedback + relectura de anclas; checkpoint añadido | Resuelto |
| Severity | 0 | Sin episodios; leve drift a severidad de REV-02 corregido antes de afectar estados (ver Drift) | — | N/A |
| Central tendency | 1 | S-PIL-06 · REV-01: tendencia a evadir extremos (VALID/INSUFFICIENT) en Q-MES-ORG-001 | Nivel confirmado contra anclas; sin cambio de estado final | Resuelto |
| Drift | 1 | REV-02: leve tendencia a severidad en la mitad del corpus (bloque S-PIL-08..10) | Checkpoint de calibración intermedia; 6 filas siguientes verificadas sin impacto | Resuelto |

Total: **4 incidentes registrados** (1 MEDIUM, 3 LOW) + 1 corrección preventiva de drift; **0
incidentes de stereotype o similarity** — consecuencia directa de que ningún atributo personal
existe en el corpus.

## 2. Protecciones que funcionaron

| Protección (A-06.7) | Evidencia de funcionamiento |
|---|---|
| Rationale obligatorio por fragmento | Hizo visible el confirmation bias (INC-PIL-009) |
| Doble revisión ciega | Detectó la leniency del entrevistador (INC-PIL-003) que la revisión única habría promediado |
| Anclas por indicador (rúbrica v2) | Resolvieron el central tendency sin negociación |
| Calibración intermedia | Cortó el drift de severidad antes de alterar estados |
| Patrones asignados por diseño (no sabidos por revisores) | Impidió "leer lo esperado": 6 desacuerdos demuestran independencia real |

## 3. Qué NO afirma este documento

- No afirma que el instrumento esté libre de sesgos: 12 sesiones sintéticas no miden sesgos
  demográficos reales (no hay personas).
- No afirma equidad algorítmica ni ausencia de impacto adverso: **no se calculó ningún estadístico**
  y no existe grupo de comparación.
- La ausencia de stereotype/similarity es un artefacto del diseño sintético, no una prueba de
  inmunidad del método.
