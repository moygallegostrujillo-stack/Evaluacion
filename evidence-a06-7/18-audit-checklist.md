# EVALUHR — A-06.7 — 18 · Auditoría Final / Checklist (PASO 22)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Verificación de los 27 puntos de la especificación A-06.7.
> Fecha de verificación: 2026-09-12 (America/Mexico_City).

| # | Ítem | Estado | Evidencia |
|---|---|---|---|
| 1 | 2 preguntas REVISE revisadas | ✅ | `02-question-refinement.md` §2–§3 (Q-VEN-COL-001: problema/causa/impacto/modificación/probe/riesgos; Q-VEN-TRV-002: ídem) + `question-refinement.csv` |
| 2 | probe LIMITED revisado | ✅ | `03-probe-refinement.md` §2 (PROBE-UNI-004: LIMITED → KEEP con condición de uso CU-1..CU-6, v1.1-DRAFT) |
| 3 | rúbrica por indicador | ✅ | `04-rubric.md` + `rubric-by-indicator.csv` (23 indicadores × 5 niveles; 20 pilotados + 3 TEC-001 marcados NO PILOTADO) |
| 4 | ejemplos de evidencia | ✅ | `05-indicator-examples.md` (20 indicadores ejercitados + sección TEC-001) — ejemplos de evidencia observada, no "respuestas correctas" |
| 5 | Action diferenciada | ✅ | `06-action-rules.md` (R1–R4 + excepción de fundamento documentado + casos frontera; sin Action propia → nunca SUPPORTED/STRONG) |
| 6 | resultado externo diferenciado | ✅ | `05-indicator-examples.md` §8 (PASO 6): CAL-21 resultado positivo + conducta insuficiente → PENDING_REVIEW; CAL-22 resultado modesto + conducta fuerte → SUPPORTED |
| 7 | hipotético diferenciado | ✅ | `07-hypothetical-rules.md` (H-1..H-6: HYPOTHETICAL → LIMITED máximo; nunca SUPPORTED/STRONG; redirección UNI-005; CAL-23) |
| 8 | vago diferenciado | ✅ | `calibration-cases.csv` CAL-24/25/26 ("soy muy bueno con clientes" / "trabajo muy bien en equipo" / "siempre cumplo" → INSUFFICIENT; nunca 0, nunca NEGATIVE, nunca veto) |
| 9 | conflictos definidos | ✅ | `08-conflict-rules.md` (protocolo C-1..C-7; CV vs entrevista vs referencia → PENDING_REVIEW; información adicional permitida/prohibida; CAL-27/28) |
| 10 | calibración diseñada | ✅ | `09-calibration.md` (protocolo 7 pasos; votación NO sustituye criterio; M-G caso de referencia; frecuencias; `calibration-cases.csv`) |
| 11 | entrenamiento diseñado | ✅ | `10-training.md` (modelo conceptual M1..M7; NO curso productivo) |
| 12 | sesgos entrenables | ✅ | `11-bias-training.md` (halo, similarity, confirmation, stereotype, leniency, severity, central tendency, drift — viñetas CAL-29..36 + protección de rúbrica) |
| 13 | probes controlados | ✅ | `03-probe-refinement.md` §4 (probe principal/secundario/condición/stop por pregunta; NO improvisación; máx 3 probes; máx 2 redirecciones) |
| 14 | proporcionalidad | ✅ | `13-proportionality.md` (10/10 conservan 6 condiciones y legalStatus PUBLICABLE; elementos nuevos verificados) |
| 15 | IA limitada | ✅ | `12-ai-boundaries.md` (5 casos de sobre-alcance → RECHAZADO; lista cerrada de asistencia; AI_GENERATED + HUMAN_REVIEWED) |
| 16 | reviewer separado | ✅ | `14-human-review.md` (entrevistador ≠ revisor cuando sea posible; excepciones EX-1..EX-4 con controles; IA no sustituye revisor) |
| 17 | trazabilidad | ✅ | Cadena A-06.2→A-06.6→A-06.7 intacta; `question-refinement.csv` conserva questionId/competencyId/indicatorId; ninguna cadena rota (sin TRACEABILITY_FAILURE) |
| 18 | G9 actualizado | ✅ | `15-gates.md`: INTERVIEW-G9 = **EVIDENCE PARTIAL / PILOT METHODOLOGICAL** (mantenido y reforzado por el refinamiento) |
| 19 | G7 sigue pendiente | ✅ | `15-gates.md`: INTERVIEW-G7 = **NO EVALUADO — SIN CAMBIO. NO APPROVED.** (bloqueo CRITICAL vigente) |
| 20 | G10 sigue pendiente | ✅ | `15-gates.md`: INTERVIEW-G10 = **NO EVALUADO — SIN CAMBIO. NO APPROVED.** (la calibración no es validación psicométrica) |
| 21 | ninguna pregunta ACTIVE | ✅ | `16-decision.md`: 8 KEEP_FOR_REVIEW + 2 REVISE + 0 REJECT + **0 ACTIVE** |
| 22 | ninguna pregunta productiva | ✅ | Todo el material conserva PILOTO / DRAFT / NO PRODUCTIVO; banco A-06.5 intacto en su estado |
| 23 | sin scoring | ✅ | Rúbrica v2 cualitativa; niveles no convertidos a números; sin promedios (`04-rubric.md` §1/§4) |
| 24 | sin pesos | ✅ | Ningún peso asignado a indicadores, preguntas o niveles (`04`, `06` §5) |
| 25 | sin cortes | ✅ | Ningún umbral de decisión/corte definido (`04`, `16`) |
| 26 | sin JobFit | ✅ | Ninguna implementación ni diseño de JobFit en A-06.7 (términos solo como restricción) |
| 27 | sin cambios en código | ✅ | Verificación `git status` al cierre: solo `evidence-a06-7/*` (nuevo) y `worklog.md`; cero cambios en `src/`, `prisma/`, `scripts/`, `public/`, schema, datos, contrato, aviso |

**Resultado: 27/27 verificadas.**
