# EVALUHR — A-06.7 — 09 · Protocolo de Calibración (PASO 10)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Objetivo: reducir la variabilidad entre evaluadores **sin scoring**.
> Origen: la divergencia M-G del piloto A-06.6 (H-7) demostró que sin calibración, dos evaluadores
> razonables pueden asignar LIMITED vs SUPPORTED a la misma respuesta.

## 1. Principio

La calibración alinea criterios **contra la rúbrica** (v2, con anclas por indicador), no contra la
opinión de la mayoría. El estándar es la rúbrica + la evidencia, no el voto.

## 2. Protocolo de 7 pasos (obligatorio)

| # | Paso | Detalle |
|---|---|---|
| 1 | **Revisar la misma respuesta** | Todos los participantes leen/escuchan la misma unidad de evidencia (misma respuesta, mismo contexto de pregunta). |
| 2 | **Cada evaluador clasifica independientemente** | Cada uno asigna evidenceState + nivel + rationale que cite indicadores, **sin ver la asignación de los otros**. |
| 3 | **Comparar** | Se revelan las asignaciones y se contrastan. |
| 4 | **Identificar la diferencia** | Si hay divergencia: qué nivel/state asignó cada uno y sobre qué fragmento difiere la lectura. |
| 5 | **Consultar la rúbrica** | Se busca el ancla por indicador aplicable (RM-1: ¿el fragmento cubre el indicador?) y las reglas (Action, hipotéticos, conflictos). La rúbrica decide, no la antigüedad ni el volumen de voz. |
| 6 | **Documentar la resolución** | Estado final + rationale consensuada + lección. Se registra en `calibration-cases.csv` (calibrationNote) y, si la divergencia es nueva, en el registro de divergencias. |
| 7 | **Actualizar material de entrenamiento** | Si la divergencia revela un hueco de la rúbrica (falta un ancla o una regla), se propone versión nueva de la rúbrica (DRAFT → revisión) y se añade el caso al material de entrenamiento (`10-training.md` M7). |

## 3. Regla: la votación NO sustituye al criterio

- **Prohibido** resolver divergencias por votación y seguir de largo: el voto registra la existencia del
  desacuerdo, no crea el criterio.
- La resolución válida sale del **paso 5** (rúbrica) — si la rúbrica no alcanza para decidir, el hallazgo
  correcto es "la rúbrica está incompleta" → paso 7 (refinar rúbrica), no "ganó quien tuvo más votos".
- En caso de empate persistente tras consultar la rúbrica: el nivel **más conservador** prevalece con
  rationale, y el caso se marca para refinar la rúbrica. (Conservador = nunca inflar evidencia.)
- Nunca se promedian niveles ni se calculan índices numéricos de "acuerdo ponderado".

## 4. Frecuencia y alcance

| Momento | Alcance |
|---|---|
| **Antes de cualquier uso productivo** | Sesión de calibración fundacional con el set mínimo: 10–15 casos de `calibration-cases.csv` (incluye M-G, CAL-21, CAL-22, CAL-23..26). Asistencia obligatoria; sin ella, no se conduce entrevista productiva. |
| **Periódica** | Mensual o cada 20 revisiones (lo que ocurra primero): 3–5 casos rotativos. |
| **Por señal de deriva (drift)** | Inmediata: si un evaluador muestra patrón sistemáticamente más severo/leniente que el ancla (detectado en comparaciones), sesión focalizada con su histórico (anónimo en la sesión). |
| **Tras cambio de rúbrica** | Sesión breve de re-calibración sobre los casos afectados antes de usar la nueva versión. |

## 5. Registro y artefactos

| Artefacto | Contenido |
|---|---|
| `calibration-cases.csv` (PASO 17) | 26 casos: respuesta sintética, estado esperado, rationale, error común, nota de calibración |
| Registro de divergencias | Tabla tipo `interrater-review.csv` de A-06.6, alimentada por cada sesión; **sin coeficientes estadísticos** (documentación cualitativa; el tamaño real nunca será suficiente para métricas en esta fase) |
| Bitácora de sesiones | Fecha, participantes, casos usados, divergencias, resoluciones, cambios propuestos a la rúbrica |
| Lecciones → entrenamiento | Cada lección se incorpora a M7 (refresco) de `10-training.md` |

## 6. Caso de referencia obligatorio: M-G

La primera sesión de calibración debe incluir **M-G** como caso de referencia: es la divergencia real del
piloto (Reviewer A LIMITED vs Reviewer B SUPPORTED → resuelta LIMITED). La resolución documentada:
"le dije que se lo cambiaría" cubre IND-SVC-002-C parcialmente, no cubre IND-SVC-002-A, R ausente →
LIMITED (regla RM-1). Sirve para enseñar: (a) mapeo Action→indicador, (b) que el criterio más conservador
prevalece ante duda, (c) que la rúbrica se consulta antes que la opinión.

## 7. Conexión con gates

La calibración es requisito operativo de INTERVIEW-G8 (human review) y evidencia continua para
INTERVIEW-G9 (pilot, EVIDENCE PARTIAL). **No** es validación psicométrica y no aporta a INTERVIEW-G10.
