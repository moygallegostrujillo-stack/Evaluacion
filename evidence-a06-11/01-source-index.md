# EVALUHR — A-06.11 · 01 · SOURCE INDEX (PASO 1)

## 1. Propósito

Registrar el origen, disponibilidad física y estatus de cada fuente usada para consolidar el expediente. Regla de consolidación del encargo: **no modificar conclusiones anteriores salvo que exista evidencia nueva claramente identificada.**

## 2. Inventario de fuentes y disponibilidad verificada

| Fuente | Alcance | Disponibilidad física | Clase de fuente | Estatus |
|---|---|---|---|---|
| A-06.1 | Modelo de competencias, definición, gates COMP-G1..G10 | ✔ EN DISCO — `evidence-a06-1/` (22 archivos) | EXPEDIENTE VERIFICADO | Cerrado (diseño) |
| A-06.2 | Catálogo de competencias e indicadores, validación CI-VAL-1..8 | ✔ EN DISCO — `evidence-a06-2/` (19 archivos) | EXPEDIENTE VERIFICADO | Cerrado (diseño) |
| A-06.3 | Metodología BDI/STAR, preguntas, probes, rúbrica, gates INT-G1..G10 | ✔ EN DISCO — `evidence-a06-3/` (24 archivos) | EXPEDIENTE VERIFICADO | Cerrado (diseño) |
| A-06.4 | Perfiles MESERO/VENDEDOR y vinculación job-competencia | ✘ NO MATERIALIZADO EN DISCO | REGISTRO DE AUDITORÍA | Conclusiones incorporadas como registro |
| A-06.5 | Banco de preguntas y probes (10 candidatas / 26 probes), estados | ✘ NO MATERIALIZADO EN DISCO | REGISTRO DE AUDITORÍA | Conclusiones incorporadas como registro |
| A-06.6 | Pilotaje sintético de casos (20 casos, no productivo) | ✘ NO MATERIALIZADO EN DISCO | REGISTRO DE AUDITORÍA | Conclusiones incorporadas como registro |
| A-06.7 | Auditoría de sesgos, privacidad y discriminación | ✘ NO MATERIALIZADO EN DISCO | REGISTRO DE AUDITORÍA | Conclusiones incorporadas como registro |
| A-06.8 | Cierre legal: protocolos, IA, acceso, retención, estado de gates | ✘ NO MATERIALIZADO EN DISCO | REGISTRO DE AUDITORÍA | Conclusiones incorporadas como registro |
| A-06.9 | Paquete jurídico de entrevista (contrato/aviso/consentimiento, datos de las partes) | ✘ NO EJECUTADO — alcance definido, sin entregables | ALCANCE DEFINIDO / NO EJECUTADO | Borradores reconstruidos a nivel DRAFT en 11/12/13 |
| A-06.10 | Piloto de campo controlado (no productivo) | ✘ NO EJECUTADO — alcance definido, sin entregables | ALCANCE DEFINIDO / NO EJECUTADO | Estado registrado: piloto pendiente; G9 no actualizable a validación |

## 3. Regla de manejo por clase de fuente

1. **EXPEDIENTE VERIFICADO (EN DISCO)**: se cita por archivo y sección; el contenido es verificable línea a línea.
2. **REGISTRO DE AUDITORÍA (A-06.4–A-06.8)**: se incorporan exclusivamente las **conclusiones registradas** (estados de preguntas/probes, contadores, protocolos, gates). No se reconstruye narrativa de auditoría no registrada. Donde este expediente necesita textos operativos (preguntas/probes) para ser revisable por el abogado, los textos se presentan como **DRAFT v2 CONSOLIDADO** bajo las reglas de diseño verificadas de A-06.3 y se marcan con `PROVENANCE: RECONSTRUCCIÓN-CONSOLIDADA`. El abogado debe dictaminar sobre estos textos tal como constan en este expediente, y cualquier cotejo futuro contra el banco fuente A-06.5 queda como punto abierto.
3. **NO EJECUTADO (A-06.9, A-06.10)**: se incorpora el alcance definido y su estado, **jamás resultados**. No se inventan ejecuciones, métricas de piloto, ni firmas. Los borradores contractuales incluyen los datos de partes definidos en el alcance y quedan marcados `LEGAL_REVIEW`.

## 4. Conclusiones de registro que este expediente NO modifica

| Conclusión registrada (A-06.4–A-06.8) | Valor | Tratamiento en A-06.11 |
|---|---|---|
| Banco de preguntas candidatas | 10 (8 PUBLICABLE / 2 CONDICIONAL) | Preservado; ver 03 |
| Preguntas CONDICIONAL | Q-MES-TRV-002, Q-VEN-TRV-002 | Preservado; ver 03 |
| Banco de probes | 26 (24 PUBLICABLE / 2 CONDICIONAL) | Preservado; ver 04 |
| Probes CONDICIONAL | PROBE-UNI-004, PROBE-COL-001-D | Preservado; ver 04 |
| Protocolo revelación involuntaria | 6 pasos, solo flag UNINVITED_DISCLOSURE=YES/NO | Preservado; ver 07 |
| Protocolo BFOQ | 7 pasos, toda aplicación LEGAL_REVIEW | Preservado; ver 16 |
| Catálogo IA | 5 PERMITIDAS / 8 PROHIBIDAS | Preservado; ver 08 |
| Mapa de automatización | Entrevista/evidencia/revisión/resultado/decisión = HUMAN ONLY | Preservado; ver 09 |
| Conservación "2 años" | RECOMENDADO, no obligación legal | Preservado; ver 10 |
| Matriz de acceso | 8 roles × 7 acciones, mínimo privilegio | Preservado; ver 18 |
| G7 | NO APPROVED (CRÍTICO — solo abogado) | Preservado; ver 02 |
| G9 | PARTIALLY SATISFIED — READY FOR FIELD PILOT | Preservado; ver 02 |
| G10 | NOT EVALUATED | Preservado; ver 02 |
| Duración esperada de entrevista | 25–37 min (A-06.3) | Preservado; citado en 03 |

## 5. Evidencia nueva identificada en A-06.11 (justificada por el encargo)

| Cambio | Justificación |
|---|---|
| Q-VEN-COL-001: PUBLICABLE → LEGAL_REVIEW (escalamiento, no degradación) | El encargo A-06.11 la designa de atención especial para el dictamen; escalar a revisión legal no contradice el estado anterior, lo pone bajo confirmación del abogado. |
| Consolidación de textos DRAFT v2 de preguntas/probes | Necesario para que el abogado dictamine sobre un objeto concreto; marcados como reconstrucción consolidada. |
| Reconstrucción DRAFT de contrato/aviso/consentimiento | A-06.9 no ejecutado; el alcance definido (partes, 12 elementos, contenido del aviso, estructura de consentimiento) se materializa como borrador, todo marcado LEGAL_REVIEW. |

## 6. Datos de las partes (definidos en alcance A-06.9)

| Parte | Datos definidos |
|---|---|
| EVALUA HR (proveedor / presunto encargado) | Moisés Gallegos Trujillo · RFC GATM7010257U6 · Tuxtla Gutiérrez, Chiapas, México |
| EMPRESA CLIENTE (referencia demo / presunta responsable) | ALIMENTOS PAPO · RFC APA240229EA9 · Representante: Manuel Araujo Zenteno · RR.HH.: Lic. Eva |

> Estos datos se usan únicamente en borradores internos de auditoría (11/12/13) para el dictamen. **No modifican contrato real ni aviso real.**
