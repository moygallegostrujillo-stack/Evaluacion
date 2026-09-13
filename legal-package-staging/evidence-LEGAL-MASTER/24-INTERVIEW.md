# EVALUHR — LEGAL MASTER PACKAGE · 24 · INTERVIEW (PASO 20b)

## 1. Estado en producto (verificado)

| Aspecto | Estado | Evidencia |
|---|---|---|
| Agendamiento de entrevistas | **IMPLEMENTED** | Modelo `InterviewSchedule` (SCHEDULED/COMPLETED/CANCELLED; location, notes, notified); API `src/app/api/interviews/route.ts`; vista `InterviewsView` |
| Entrevista estructurada BDI/STAR | **NOT_IMPLEMENTED** | 0 modelos Interview/InterviewQuestion; 0 preguntas activas; diseño completo en evidence-a06-3/ + paquete legal evidence-a06-11/ |
| Grabación de entrevistas | NO EXISTE | — |
| Duración esperada (diseño) | 25–37 min (A-06.3) | Referencia de diseño, no producto |

## 2. Datos tratados hoy por la función de entrevista (agendamiento)

Fecha, lugar, estado, notas de RR.HH. sobre el candidato — datos identificativos y de proceso; conservación sin purga específica (15). Las "notes" de RR.HH. pueden contener opiniones — recomendación: directriz de contenido objetivo (post-dictamen).

## 3. Qué falta para activar la entrevista estructurada (gates)

1. INTERVIEW-G7 = NO APPROVED (dictamen sobre guía, 10 preguntas, 26 probes, rúbrica).
2. INTERVIEW-G9: piloto no productivo no ejecutado (A-06.10).
3. Aprobación humana de preguntas/probes/rúbrica (governance).
4. Implementación técnica (modelos, guía, protocolo UNINVITED_DISCLOSURE) — **NO se implementa en esta fase**.

## 4. Riesgos jurídicos específicos de BDI/STAR (para dictamen)

- Profundidad de narrativas → datos de terceros o vida privada (mitigado con límites de guía y protocolo UNINVITED_DISCLOSURE — 10).
- Uniformidad: mismas preguntas por puesto; rúbrica por indicador; doble revisión.
- Tres preguntas en REVISE y dos probes CONDITIONAL: Q-MES-TRV-002, Q-VEN-TRV-002 (acotar a cambios operativos; no indagar causas personales), Q-VEN-COL-001 (LEGAL_REVIEW: terceros), PROBE-UNI-004 y PROBE-COL-001-D (CONDICIONAL).

## 5. Estado

**PARCIAL** — agendamiento sí; entrevista estructurada no (DRAFT, G7 NO APPROVED).
