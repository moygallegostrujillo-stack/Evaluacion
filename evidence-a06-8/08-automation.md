# EVALUHR — A-06.8 — 08 · Mapa de Automatización (PASO 8)

> Pipeline: **ENTREVISTA → IA → EVIDENCIA → REVIEW → COMPETENCY RESULT** (+ decisión laboral).
> Clasificación por paso: **AUTOMATED / ASSISTED / HUMAN ONLY**. Regla: **no permitir decisión
> laboral automatizada**; la IA nunca es base única.

## 1. Definiciones

| Clase | Definición |
|---|---|
| AUTOMATED | Se ejecuta sin intervención humana, sobre datos ya capturados; sin producir valoración sobre la persona (almacenamiento, timestamps, purge programado, logs, notificaciones) |
| ASSISTED | La IA produce un **borrador/sugerencia** que un humano debe revisar y confirmar antes de que tenga efecto (AI_DRAFT ≠ evidencia) |
| HUMAN ONLY | Solo una persona puede ejecutarlo; prohibido automatizar o delegar a IA |

## 2. Mapa del pipeline

| # | Paso | Clase | Qué hace exactamente | Control |
|---|---|---|---|---|
| 1 | Conducir la entrevista | **HUMAN ONLY** | El entrevistador pregunta, elige probes del banco, aplica protocolo 05 | IA solo sugiere (paso 3); prohibido conducir |
| 2 | Registrar respuesta (STAR) | **HUMAN ONLY** (captura) + **ASSISTED** (transcripción borrador) | El entrevistador registra S/T/A/R; si hay transcripción, es AI_DRAFT que el entrevistador confirma/corrige | Transcripción no confirmada ≠ registro |
| 3 | IA en sesión | **ASSISTED** | Resumen (P-1), transcripción (P-2), sugerencia de probes aprobados (P-3), detección de faltantes (P-4), lenguaje (P-5) — `07-ai-legal-boundaries.md` | Lista cerrada; logs; revisión humana de toda salida |
| 4 | Segmentación/evidencia | **ASSISTED** (borrador de mapeo) → **HUMAN ONLY** (confirmación) | La IA puede proponer qué fragmento corresponde a qué indicador (AI_DRAFT); SOLO el entrevistador/revisor confirma la evidencia | El borrador IA nunca entra como evidencia |
| 5 | EVIDENCIA (estado final) | **HUMAN ONLY** | Confirmar fragments → estados de evidencia (NO_EVIDENCE..STRONG) | append-only; trazabilidad completa |
| 6 | REVIEW (asignación de nivel) | **HUMAN ONLY** | Revisor (≠ entrevistador, salvo EX-1..EX-4 controladas) asigna nivel con rúbrica v2 + calibración (A-06.7) | Prohibido para IA; protocólo de calibración obligatorio |
| 7 | Conflictos (C-1..C-7) | **HUMAN ONLY** | Resolver CV vs entrevista vs referencia → PENDING_REVIEW y resolución | Documentado; append-only |
| 8 | COMPETENCY RESULT | **HUMAN ONLY** | Consolidación y aprobación del resultado por reviewer/RH | IA prohibida; invalidación con justificación |
| 9 | Decisión de contratación | **HUMAN ONLY** | Empresa cliente (RR.HH.) decide | EvaluHR NO decide; JobFit NO toca la entrevista |
| 10 | Almacenamiento, timestamps, purge, logs, notificaciones | **AUTOMATED** | Operaciones técnicas sin valoración de persona | Purge según política (10); todo logeado |
| 11 | Banderas de auditoría (revelación involuntaria, accesos, export) | **AUTOMATED** (registro) + **HUMAN ONLY** (actuación) | El sistema registra el evento; las decisiones sobre el evento son humanas | 05 §3; 11 |

## 3. Reglas del mapa

1. **Ningún paso que evalúe a la persona es AUTOMATED.**
2. **Ninguna salida de IA tiene efecto jurídico sin confirmación humana** (RA-1, 07).
3. La cadena de responsabilidad queda: entrevistador → evidencia → revisor → resultado → empresa
   cliente decide. Cada eslabón tiene autor humano identificable (trazabilidad).
4. Bajo la nueva ley 2025, el tratamiento con IA y la eventual "decisión automatizada" requieren
   interpretación específica → **LEGAL_REVIEW** en el mapeo contractual (13): la posición de
   diseño es que NO existe decisión automatizada en ningún punto del pipeline.
5. Futuras automatizaciones (si las hubiera) entran por lista cerrada + revisión metodológica +
   dictamen legal; prohibido ampliar por decisión técnica unilateral.

## 4. Verificación

Este mapa es de **diseño**: la implementación técnica aún no existe (NO IMPLEMENTAR). Cuando se
implemente, cada paso debe tener prueba de control (log, revisión, firma) y este mapa debe
re-auditorse antes de cualquier activación.
