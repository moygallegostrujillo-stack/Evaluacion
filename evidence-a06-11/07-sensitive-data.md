# EVALUHR — A-06.11 · 07 · SENSITIVE DATA — PROTOCOLO UNINVITED_DISCLOSURE (PASO 8)

## 1. Principio

El diseño de entrevista **no solicita datos sensibles** (catálogo A-06.3 `15-privacy.md` §3). El único punto de contacto del proceso con datos sensibles es la **revelación involuntaria**: que el candidato, al narrar una experiencia laboral, incluya información sensible sin que se le pregunte (p.ej. salud, situación familiar, embarazo, religión, origen, discapacidad).

## 2. Protocolo UNINVITED_DISCLOSURE (6 pasos — preservado del registro A-06.8)

| Paso | Acción | Detalle |
|---|---|---|
| 1 | NO indagar | El entrevistador no hace preguntas de seguimiento sobre el contenido revelado; no pide detalles, ejemplos ni aclaraciones |
| 2 | NO se reanuda el tema | El tema no se retoma más adelante en la entrevista |
| 3 | El contenido NO se registra en la evidencia | La InterviewEvidence y el rationale del reviewer no contienen el contenido sensible |
| 4 | Redirección | El entrevistador redirige a la siguiente pregunta o al aspecto laboral de la situación narrada |
| 5 | Mínimo evento | Se registra únicamente el flag **UNINVITED_DISCLOSURE=YES** (o NO al cierre normal) con fecha/hora — sin contenido |
| 6 | Riesgo → detener | Si la revelación indica riesgo para la persona (emergencia de salud, amenaza, violencia), se detiene la entrevista y se canaliza según instrucción de la empresa; no se evalúa ni se registra contenido |

## 3. Qué se registra exactamente

| Elemento | ¿Se registra? | Observación |
|---|---|---|
| Flag UNINVITED_DISCLOSURE = YES / NO | SÍ | Metadato de control; no contiene contenido |
| Fecha / hora del evento | SÍ | Mínimo trazable |
| Contenido revelado (texto, categorías, resumen) | **NO** | Prohibido conservar en cualquier capa (evidencia, revisión, auditoría, IA) |
| Transcripción o resumen IA del pasaje | **NO** | El pasaje se excluye del material procesado por IA |
| Evaluación o inferencia derivada del contenido | **NO** | Prohibido: el contenido no entra a evidencia ni a rúbrica |

## 4. Regla de conservación

> **Contenido sensible innecesario → NO CONSERVAR.** Sin excepciones nuevas.

- No se introducen nuevas excepciones en A-06.11 (regla del encargo).
- Si por diseño operativo futuro se necesitara conservar algún fragmento (p.ej. obligación de seguridad interna), eso es una **nueva excepción** y requiere dictamen legal + aviso + base de habilitación — hoy no existe.
- En caso de consulta ARCO sobre el evento, la respuesta es: "se registró la existencia del evento (flag) sin contenido".

## 5. Qué NO es vía de datos sensibles

| Vía | Estado |
|---|---|
| Preguntas del banco (10) | No solicitan datos sensibles; 3 en REVISE por riesgo de derivación (03) |
| Probes del banco (26) | 2 CONDITIONAL (UNI-004, COL-001-D) por riesgo de derivación; resto neutro |
| Probes prohibidos | Atributos protegidos directamente — jamás incluidos (04 §8) |
| Grabaciones | No se capturan (06 §2.6) |
| IA | Prohibido inferir atributos/personalidad/integridad (08); resúmenes se verifican contra fuente y excluyen pasaje sensible |

## 6. Responsabilidad operativa

| Rol | Obligación |
|---|---|
| Entrevistador | Ejecutar los 6 pasos; no improvisar manejo alternativo |
| Reviewer | Verificar que la evidencia no contenga el contenido; si aparece → reportar incidente y purgar conforme a instrucción |
| Plataforma (EVALUA HR, como encargado) | No procesar el pasaje con IA; no indexar; solo conservar el flag |
| Empresa cliente (responsable) | Decidir canalización en caso de riesgo; responder ARCO |
| Abogado | Dictaminar la suficiencia del protocolo (cuestión 7 de 19-lawyer-questions.md) |

## 7. Conexión con gates

Protocolo sujeto a LEGAL-G4 (datos sensibles) — estado DISEÑADO — LEGAL_REVIEW. El dictamen debe confirmar: (a) suficiencia de los 6 pasos; (b) el registro de solo-flag; (c) la regla de no conservación.
