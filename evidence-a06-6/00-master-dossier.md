# EVALUHR — A-06.6 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# PILOTO METODOLÓGICO DE ENTREVISTA BDI/STAR — VALIDACIÓN EXPERIMENTAL (cumplido)

Fecha: 2026-09-11 (America/Mexico_City). Método: simulación conceptual con 20 casos sintéticos
(MESERO 10 + VENDEDOR 10) ejecutando las 10 preguntas candidatas de A-06.5 con los probes del
banco A-06.5, aplicando la rúbrica cualitativa A-06.3, los filtros de sesgo A-06.4, y verificando
trazabilidad, duración, IA y consistencia inter-evaluador. Regla: NO IMPLEMENTAR EN EL PRODUCTO;
todos los casos: PILOTO + NO PRODUCTIVO; datos SINTÉTICOS.

---

## 1. CASOS UTILIZADOS (PASO 2)

**20 casos sintéticos** (MESERO 10: M-A..M-J; VENDEDOR 10: V-A..V-J) cubriendo los 10 patrones de
respuesta (A concreta, B vaga, C hipotética, D sin acción propia, E resultado sin conducta,
F contradictoria con CV, G incompleta, H revelación involuntaria, I sin evidencia, J muy fuerte).
Perfiles sintéticos: MES-1/2/3, VEN-1/2/3. Detalle: `02-synthetic-cases.md`.

## 2. RESULTADOS POR PREGUNTA (PASO 4)

| Pregunta | Clasificación | Decisión |
|---|---|---|
| Q-MES-SVC-001 | STRONG | KEEP_FOR_REVIEW |
| Q-MES-SVC-002 | STRONG | KEEP_FOR_REVIEW (pendiente calibración rúbrica — divergencia M-G) |
| Q-MES-COL-001 | STRONG | KEEP_FOR_REVIEW |
| Q-MES-ORG-001 | STRONG | KEEP_FOR_REVIEW |
| Q-MES-TRV-002 | STRONG | KEEP_FOR_REVIEW |
| Q-VEN-SVC-001 | STRONG | KEEP_FOR_REVIEW |
| Q-VEN-SVC-002 | STRONG | KEEP_FOR_REVIEW |
| Q-VEN-COL-001 | ACCEPTABLE | REVISE (probe PROBE-COL-001 necesita mejora; proponer PROBE-COL-001-D) |
| Q-VEN-ORG-001 | STRONG | KEEP_FOR_REVIEW |
| Q-VEN-TRV-002 | ACCEPTABLE | REVISE (reforzar entrenamiento de revelación involuntaria) |

**8 KEEP_FOR_REVIEW + 2 REVISE + 0 REJECT. Ninguna ACTIVE.** Detalle: `05-question-quality.md` +
`17-decision.md`.

## 3. RESULTADOS POR PROBE (PASO 5)

**25 probes evaluados**: 24 VALID, 1 LIMITED (PROBE-UNI-004 — reflexión complementaria), 0 REJECT,
1 PROPUESTO NUEVO (PROBE-COL-001-D, DRAFT). Detalle: `06-probe-quality.md`.

## 4. STAR

Verificación completa en 20 casos: la ausencia de Action (o Action parcial de 1 indicador) **nunca
produjo SUPPORTED ni STRONG**. Regla "sin acción concreta → insuficiente o limitada" cumplida al 100%.
1 ejemplo completo (3 indicadores) → SUPPORTED; 2+ ejemplos → STRONG. Detalle: `04-star-analysis.md`.

## 5. EVIDENCIA

Estados distribuidos: 2 SUPPORTED, 2 STRONG, 6 LIMITED, 4 INSUFFICIENT, 4 PENDING_REVIEW,
2 NO_EVIDENCE (+2 revelaciones INVALID). **INSUFFICIENT ≠ 0 verificado**; HYPOTHETICAL no escaló;
resultado externo no escaló; revelación involuntaria manejada (no registrada, no usada). Detalle:
`07-evidence-states.md`.

## 6. CONFLICTOS

M-F y V-F: CV "supervisé 15 personas" vs entrevista sin conducta → CONFLICT → PENDING_REVIEW.
No promedio; no "gana el más alto"; resolución humana pendiente. Detalle: `08-conflicts.md`.

## 7. CONSISTENCIA

**19/20 acuerdos (95%)** entre Reviewer A (estricto) y Reviewer B (estándar). 1 divergencia (M-G:
LIMITED vs SUPPORTED por interpretación de qué Action cubre qué indicador). Resolución: LIMITED por
consenso. **Acción**: refinar rúbrica con ejemplos por indicador; calibración obligatoria
(INTERVIEW-G9). Sin métricas numéricas. Detalle: `09-interrater.md` + `interrater-review.csv`.

## 8. SESGOS

6 sesgos probados (halo, similarity, confirmation, estereotipo, información irrelevante, atributos
protegidos) — **todos contenidos por la estructura** (rúbrica por indicador + guía estructurada +
reglas de evidencia). Detalle: `10-bias.md`.

## 9. LEGAL

10 preguntas verificadas contra A-06.4: todas PUBLICABLE. Revelación involuntaria (M-H embarazo,
V-H religión) manejada según A-06.4 §5. Ninguna pregunta/probe elicita atributos protegidos.
**INTERVIEW-G7 sigue NO EVALUADO** (REQUIERE REVISIÓN LEGAL profesional). Detalle: `11-legal.md`.

## 10. DURACIÓN

1 competencia: 8–13 min; 3: 14–25 min; 5: 20–37 min. **Dentro del rango previsto A-06.3 (25–37 min)**
para 5 competencias. Carga cognitiva baja-moderada. Detalle: `12-duration.md`.

## 11. IA

Asistencia (resumen/STAR/detección/probe aprobado) funcionó. Los 3 rechazos verificados:
IA inventa acción → RECHAZADO; IA convierte resumen en evidencia → RECHAZADO; IA asigna STRONG →
RECHAZADO. Detalle: `13-ai.md`.

## 12. TRAZABILIDAD

Cadena completa en **20/20 casos (0 TRACEABILITY_FAILURE)**. Detalle: `14-traceability.md`.

## 13. PREGUNTAS KEEP/REVISE/REJECT

- **KEEP_FOR_REVIEW**: 8 (diseño validado en simulación; pendiente pilotaje de campo + legal).
- **REVISE**: 2 (Q-VEN-COL-001: probe; Q-VEN-TRV-002: entrenamiento).
- **REJECT**: 0.
- **Ninguna ACTIVE.** Detalle: `17-decision.md`.

## 14. GATES

INTERVIEW-G1..G10 actualizados con evidencia del piloto:
- G1/G6/G8: APROBADO (estructura + piloto).
- G4/G5: CONDICIONAL con **evidencia a favor** (8/10 STRONG, 24/25 VALID).
- G2/G3: CONDICIONAL (sin cambio — competencias/indicadores siguen DRAFT).
- **G7: NO EVALUADO (SIN CAMBIO)** — REQUIERE REVISIÓN LEGAL.
- **G9: PARCIALMENTE EVIDENCIADO** — el piloto simulado aporta evidencia metodológica inicial, pero NO sustituye pilotaje de campo real.
- **G10: NO EVALUADO (SIN CAMBIO)** — el piloto NO es validación psicométrica.

Detalle: `16-gates.md`.

## 15. LIMITACIONES

> Este piloto NO demuestra validez predictiva, psicométrica, mexicana, ni eficacia de selección.
> Solo evalúa: calidad metodológica inicial + claridad + trazabilidad + capacidad de elicitar evidencia.

Limitaciones: casos sintéticos, simulación conceptual, evaluadores conceptuales, sin tamaño muestral,
sin entrevistadores entrenados, sin presión de tiempo real, sin verificación legal real. Detalle:
`18-limitations.md`.

## 16. ÍNDICE DEL EXPEDIENTE A-06.6

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-inputs.md | 1 |
| 02-synthetic-cases.md | 2 |
| 03-simulation.md | 3 |
| 04-star-analysis.md | 6 |
| 05-question-quality.md | 4 |
| 06-probe-quality.md | 5 |
| 07-evidence-states.md | 9 |
| 08-conflicts.md | 10 |
| 09-interrater.md | 11 |
| 10-bias.md | 12 |
| 11-legal.md | 13 |
| 12-duration.md | 14, 15 |
| 13-ai.md | 16 |
| 14-traceability.md | 18 |
| 15-findings.md | 22 |
| 16-gates.md | 24 |
| 17-decision.md | 23 |
| 18-limitations.md | 25 |
| 19-audit-checklist.md | 27 |
| pilot-question-results.csv | 20 |
| interrater-review.csv | 21 |

## 17. AUDITORÍA FINAL

Ver `19-audit-checklist.md` — **28/28 verificadas**.

## 18. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia
(`evidence-a06-6/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**;
sin modificación de contrato, aviso, schema, código, datos. REGLA ABSOLUTA cumplida.
