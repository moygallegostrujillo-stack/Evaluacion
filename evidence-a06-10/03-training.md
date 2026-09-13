# EVALUHR — A-06.10 — 03 · Capacitación (PASO 5)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Capacitación previa a la ejecución, impartida a los 4 roles (INT-01, INT-02, REV-01, REV-02)
> en **modo simulación documental**, siguiendo el modelo conceptual M1..M7 de A-06.7 (10-training.md,
> 11-bias-training.md). **No se capacitó para "obtener el resultado deseado"**: el objetivo fue
> aplicación fiel del protocolo, no producción de VALID.

## 1. Programa impartido (prerequisito A-06.8: M1..M7 impartidos Y evaluados)

| Módulo | Contenido | Evaluación aplicada | Resultado |
|---|---|---|---|
| M1 | Qué es BDI y qué es evidencia conductual; qué NO es evidencia | Caso CAL-24 (vago → INSUFFICIENT) | ✔ APROBADO |
| M2 | Estructura STAR; qué falta en S/T/A/R incompletos | Reconstrucción de caso M-G | ✔ APROBADO |
| M3 | Probes: banco cerrado, máx 3, uno a la vez, stop rules; **protocolo 05 de revelación involuntaria** (6 pasos) | Drill M-H y V-H completos | ✔ APROBADO |
| M4 | Evidencia y estados: CONCRETE_BEHAVIOR / HYPOTHETICAL / GENERAL_CLAIM / NO_INFORMATION / CONTRADICTION; VALID / LIMITED / INSUFFICIENT / PENDING_REVIEW / INVALID | Clasificación de 10 fragmentos | ✔ APROBADO |
| M5 | INSUFFICIENT: cuándo y por qué; no presionar al participante; "sin Action propia → nunca SUPPORTED" (R1) | Casos M-D y V-D | ✔ APROBADO |
| M6 | Conflicto (C-1..C-7) y PENDING_REVIEW; resultado externo ≠ competencia (CAL-21) | Casos M-F, V-E | ✔ APROBADO |
| M7 | Sesgos entrenables (halo, similarity, confirmation, stereotype, leniency, severity, central tendency, drift) y límites de IA (5 permitidos / 8 prohibidos; toda salida IA = AI_DRAFT) | Casos CAL-29..36 + bloque de pruebas IA | ✔ APROBADO |

**Todos los roles aprobaron los 7 módulos** (evaluación por casos de referencia, no por cuestionario
de memoria). Estado registrado en 02-participants.md: `trainingStatus = COMPLETED-SIM`.

## 2. Reglas de conducta entrenadas

1. **No improvisar**: solo la guía DRAFT v1.0 y el banco cerrado de 26 probes.
2. **No presionar**: si tras ≤3 probes no emerge evidencia → INSUFFICIENT y pasar a la siguiente
   pregunta. Nunca insistir para "conseguir" una respuesta.
3. **Revelación involuntaria (protocolo 05)**: no indagar · no registrar contenido · redirigir a
   conducta laboral · registrar solo flag `UNINVITED_DISCLOSURE=YES/NO` · detener si hay riesgo.
4. **Tono**: neutral; PROBE-COL-001-D con introducción no confrontativa (entrenada desde A-06.7).
5. **IA**: solo funciones permitidas; toda salida es AI_DRAFT hasta verificación humana; la IA
   nunca clasifica, nunca decide, nunca infiere atributos.

## 3. Advertencia explícita contra el entrenamiento orientado a resultado

El programa evaluó **aplicación correcta de reglas** (incluida la capacidad de llegar a
INSUFFICIENT, INVALID o PENDING_REVIEW), no la producción de relatos "buenos". Los drill M-H/V-H
premiaron contener una revelación sin registrarla, no evitar que ocurriera. Ningún participante del
piloto (sintético) fue "preparado" para dar respuestas VALID — los patrones de respuesta A–J de
A-06.6 se asignaron por diseño antes de la ejecución.

## 4. Checkpoint de calibración previo (M-G)

Antes de la sesión 1, los 4 roles recalibraron con el caso de referencia obligatorio M-G
(respuesta incompleta → LIMITED) usando la rúbrica RUBRIC-QUAL-v2-DRAFT y la regla RM-1.
Resultado: los 4 roles llegaron al mismo estado y rationale sin ayuda. `calibrationStatus = CALIBRATED`.

## 5. Estado de prerequisitos del plan A-06.8

| Prerequisito (field-pilot-plan.csv) | Estado en este piloto |
|---|---|
| M1..M7 impartidos Y evaluados | ✔ COMPLETADO (modo simulación documental) |
| Protocolo 05 ensayado (M-H/V-H) | ✔ COMPLETADO (drill pre-sesión; re-ejecutado en sesiones reales S-PIL-03 y S-PIL-08) |
| Tono de PROBE-COL-001-D entrenado | ✔ COMPLETADO (y aun así se detectó percepción de tono cuestionante en S-PIL-06 → hallazgo, ver INC-PIL-007) |

> El cumplimiento de este prerequisito en modo simulación **no equivale** al requisito productivo:
> para cualquier uso productivo de las preguntas TRV-002 se exige entrenamiento real impartido y
> evaluado (ver 13-question-decisions.md — ambas permanecen REVISE/CONDICIONAL).
