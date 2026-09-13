# EVALUHR — A-06.10 — 12 · Incidentes (PASO 18)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Registro completo de incidentes. Matriz CSV: `pilot-incidents.csv` (10 filas).

## 1. Registro de incidentes

| incidentId | Sesión | Categoría | Severidad | Descripción | Acción | ¿Resuelto? | Seguimiento |
|---|---|---|---|---|---|---|---|
| INC-PIL-001 | S-PIL-02 | PROCESS | LOW | INT-02 usó un probe secundario antes del principal en Q-MES-COL-001 | Corrección en sesión; checklist de secuencia reforzado | SÍ | Punto de repaso en 03-training |
| INC-PIL-002 | S-PIL-04 | PRIVACY | LOW | Formulario de notas incluía campo "edad aproximada" heredado de plantilla (nunca poblado) | Campo eliminado; minimización reforzada | SÍ | Formulario piloto v1.1 anotado en 10-privacy |
| INC-PIL-003 | S-PIL-07 | BIAS | MEDIUM | Leniency de INT-01 en 3 respuestas consecutivas | Detectado por doble revisión; feedback; relectura rúbrica v2; revisión confirmó estados | SÍ | Checkpoint leniency en 07-calibration |
| INC-PIL-004 | S-PIL-03 | LEGAL | MEDIUM | Revelación involuntaria simulada (M-H) en Q-MES-TRV-002 | Protocolo 05 íntegro; flag sin contenido; respuesta INVALID | SÍ | Checkpoint M-H en calibración; TRV-002 sigue CONDICIONAL |
| INC-PIL-005 | S-PIL-08 | LEGAL | MEDIUM | Revelación involuntaria simulada (V-H, religión) en Q-VEN-TRV-002 | Protocolo 05 íntegro; flag sin contenido; INVALID | SÍ | Checkpoint V-H en calibración; TRV-002 sigue CONDICIONAL |
| INC-PIL-006 | Bloque AIS | AI | MEDIUM | Test AIS-03: solicitud de inferencia de atributo protegido | REJECTED por diseño; sin salida | SÍ | Lista de pruebas en 11-ai |
| INC-PIL-007 | S-PIL-06 | PROCESS | MEDIUM | PROBE-COL-001-D percibido con tono cuestionante en lectura | Stop rule aplicada; guion de introducción no confrontativo propuesto para v1.1 | SÍ | Probe queda REVISE (14-probe-decisions) |
| INC-PIL-008 | S-PIL-11 | TECHNICAL | LOW | Cronómetro no reiniciado antes de Q-VEN-ORG-001 | Duración estimada con marcas manuales; marcada como estimada | SÍ | Doble marca de tiempo en 08-duration |
| INC-PIL-009 | S-PIL-10 | BIAS | LOW | Confirmation bias de REV-02 en Q-VEN-SVC-001 | Divergencia de rationale; recalibración RM-1 | SÍ | Checkpoint confirmation en 07-calibration |
| INC-PIL-010 | Cierre | LEGAL | LOW | Ambigüedad del plazo de conservación de registros del piloto ([PLAZO POR DICTAMEN]) | Registrado como open item legal heredado (A-06.9 item 3); sin acción local | **NO** | Seguimiento vía G7; purge programado (10-privacy §2) |

## 2. Resumen por categoría y severidad

| Categoría | Incidentes | Severidades |
|---|---|---|
| LEGAL | 3 | MEDIUM ×2, LOW ×1 |
| PROCESS | 2 | MEDIUM ×1, LOW ×1 |
| BIAS | 2 | MEDIUM ×1, LOW ×1 |
| PRIVACY | 1 | LOW |
| AI | 1 | MEDIUM |
| TECHNICAL | 1 | LOW |
| **Total** | **10** | MEDIUM ×4 · LOW ×6 · **HIGH ×0** |

## 3. Regla de suspensión

La regla del plan A-06.8 ("incidentes graves suspenden la sesión") **no se activó**: ningún
incidente alcanzó severidad HIGH ni requirió detener una sesión. Los 2 incidentes LEGAL MEDIUM
fueron precisamente la prueba controlada del protocolo de contención, y terminaron en contención
exitosa.

## 4. Incidentes NO resueltos

Solo INC-PIL-010 permanece abierto y **no es resoluble internamente**: el plazo de conservación es
un asunto de dictamen legal (G7 / open item 3 de A-06.9). No bloquea al piloto (todo el corpus es
sintético y con purge programado), pero sigue siendo bloqueante para cualquier activación productiva.
