# EVALUHR — A-06.7 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# REFINAMIENTO DE RÚBRICA Y CALIBRACIÓN — POST-PILOTO BDI/STAR (SOLO DISEÑO + AUDITORÍA — cumplido)

Fecha: 2026-09-12 (America/Mexico_City). Objeto: tomar los hallazgos del piloto A-06.6 y perfeccionar
las 10 preguntas candidatas, los probes, los indicadores, la rúbrica, los ejemplos de evidencia y las
reglas de calibración — con el objetivo principal de **reducir la variabilidad entre entrevistadores
sin convertir la entrevista en un scoring numérico**. Regla absoluta: NO implementar, NO publicar,
NO activar, NO crear preguntas productivas, NO crear scoring/pesos/cortes, NO implementar JobFit,
NO modificar código/schema/datos, NO modificar overallScore, IPIP, Knowledge, Integrity, Personality,
recomendaciones, contrato, aviso. Todos los materiales: **PILOTO / DRAFT / NO PRODUCTIVO**.

---

## 1. INSUMOS (PASO 1)

A-06.2 (competencias/indicadores) + A-06.3 (metodología/rúbrica) + A-06.4 (legal) + A-06.5 (banco) +
**A-06.6 (piloto)**: 20 casos sintéticos; 19/20 acuerdos (95%); divergencia **M-G** (Q-MES-SVC-002,
LIMITED vs SUPPORTED → resuelta LIMITED); 8 KEEP_FOR_REVIEW + 2 REVISE (Q-VEN-COL-001, Q-VEN-TRV-002);
24/25 probes VALID; **1 probe LIMITED (PROBE-UNI-004)**; PROBE-COL-001-D propuesto. Detalle:
`01-pilot-findings.md`.

## 2. QUÉ SE REFINÓ (PASOS 2–16)

| Área | Refinamiento | Entregable |
|---|---|---|
| **2 preguntas REVISE** | Auditadas (problema/causa/impacto/modificación/probe/riesgos). Q-VEN-COL-001 → PROBE-COL-001-D (DRAFT) obligatorio si narrativa colectiva. Q-VEN-TRV-002 → entrenamiento + regla operativa de revelación. **Texto sin cambios → legalStatus PUBLICABLE conservado. Ambas permanecen REVISE.** | `02` |
| **Probe LIMITED** | PROBE-UNI-004 "¿Qué aprendiste?": **KEEP con condición de uso** (solo cierre; nunca evidencia; nunca eleva nivel) — CU-1..CU-6, v1.1-DRAFT | `03` |
| **Probes** | Plan por pregunta: principal/secundario/condición/stop; NO improvisación; máx 3 probes; máx 2 redirecciones; PROBE-COL-001-D formalizado DRAFT | `03` |
| **Rúbrica** | **v2 (RUBRIC-QUAL-v2-DRAFT)**: anclas por indicador (resuelve la divergencia M-G con la regla RM-1 de mapeo Action→indicador) + regla indicadores→nivel formalizada (H-8) — sin puntos, sin pesos, sin cortes | `04` + `rubric-by-indicator.csv` |
| **Ejemplos de evidencia** | Por indicador (20 ejercitados + 3 TEC-001 NO PILOTADO); frontera LIMITED/SUPPORTED/STRONG observable y nombrable | `05` |
| **Action** | R1 sin Action propia → nunca SUPPORTED/STRONG; R2 parcial → máximo LIMITED salvo fundamento documentado; R3 completa+específica → elegible SUPPORTED; R4 múltiples ejemplos → elegible STRONG (reglas cualitativas, no puntos) | `06` |
| **Resultado externo** | CAL-21 (positivo + conducta insuficiente → PENDING_REVIEW) vs CAL-22 (modesto + conducta fuerte → SUPPORTED): **el resultado no controla el nivel** | `05` §8 |
| **Hipotéticos** | H-1..H-6: "¿Qué harías?" → LIMITED máximo; nunca SUPPORTED; redirección UNI-005; CAL-23 | `07` |
| **Vagas** | "soy muy bueno con clientes" / "trabajo muy bien en equipo" / "siempre cumplo" → INSUFFICIENT (nunca 0, nunca NEGATIVE, nunca veto) — CAL-24/25/26 | `calibration-cases.csv` |
| **Conflictos** | Protocolo C-1..C-7: CV vs entrevista vs referencia → PENDING_REVIEW; información adicional permitida (hechos laborales + consentimiento) / prohibida (atributos protegidos); CAL-27/28 | `08` |
| **Calibración** | Protocolo de 7 pasos; **la votación no sustituye al criterio** (el estándar es la rúbrica); M-G caso de referencia obligatorio; frecuencias + por deriva; conservador prevalece ante duda | `09` + `calibration-cases.csv` |
| **Entrenamiento** | Modelo conceptual M1..M7 (evidencia, errores comunes, sesgos, ejercicios, casos, calibración, refresco) — **NO curso productivo** | `10` |
| **Sesgos** | 8 sesgos entrenables (halo, similarity, confirmation, stereotype, leniency, severity, central tendency, drift) con viñetas CAL-29..36 y protección de rúbrica | `11` |
| **IA** | 5 casos de sobre-alcance → todos RECHAZADOS (interpreta/inventa/asigna STRONG/resultado→evidencia/probe no aprobado); IA = SOLO ASSISTANCE | `12` |
| **Proporcionalidad** | 10/10 preguntas re-verificadas (6 condiciones); **ningún cambio altera el texto → legalStatus PUBLICABLE conservado**; elementos nuevos alineados a A-06.4 | `13` |
| **Revisión humana** | Entrevistador ≠ revisor cuando sea posible; excepciones EX-1..EX-4 con controles; conflictos nunca en autorevisión; IA no sustituye revisor | `14` |

## 3. DECISIONES (PASO 21)

- **Preguntas**: 8 **KEEP_FOR_REVIEW** (evidencia suficiente y clara) + 2 **REVISE** (Q-VEN-COL-001:
  probe nuevo pendiente de re-piloto; Q-VEN-TRV-002: entrenamiento pendiente de impartición) +
  0 REJECT. **Ninguna ACTIVE.**
- **Probes**: PROBE-UNI-004 **KEEP** (condicionado); PROBE-COL-001-D **PROPUESTO/DRAFT**; 24 VALID
  KEEP_FOR_REVIEW; 0 REJECT.
- **Rúbrica/calibración/entrenamiento**: KEEP_FOR_REVIEW (diseño listo para calibración real y pilotaje
  de campo; nada aprobado a producción).
- Detalle: `16-decision.md` + `question-refinement.csv`.

## 4. GATES (PASO 20)

- **G1** APROBADO (sin cambio) · **G2/G3** CONDICIONAL (sin cambio — competencias/indicadores DRAFT) ·
  **G4/G5** CONDICIONAL con evidencia a favor (reforzados) · **G6** APROBADO (control ampliado) ·
  **G8** APROBADO (diseño completado) · **G9 = EVIDENCE PARTIAL / PILOT METHODOLOGICAL** ·
  **G7 = NO EVALUADO — NO APPROVED (SIN CAMBIO; bloqueo CRITICAL vigente)** ·
  **G10 = NO EVALUADO — NO APPROVED (SIN CAMBIO; la calibración NO es validación psicométrica)**.
- Detalle: `15-gates.md`.

## 5. GO / NO-GO

- **GO** para el track de diseño/auditoría (materiales listos para pilotaje de campo + revisión legal).
- **NO-GO** para activación productiva (G2/G3/G4/G5 CONDICIONAL + G7 NO EVALUADO + G9 EVIDENCE PARTIAL
  + G10 NO EVALUADO).

## 6. LIMITACIONES (PASO 25)

> NO validez predictiva, psicométrica, mexicana ni eficacia de selección. Calibración y entrenamiento
> diseñados, no ejecutados con humanos reales; anclas derivadas de casos sintéticos; cambios no
> re-pilotados. Solo se afirma mejora de diseño metodológico. Detalle: `17-limitations.md`.

## 7. ÍNDICE DEL EXPEDIENTE A-06.7

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-pilot-findings.md | 1 |
| 02-question-refinement.md | 2 |
| 03-probe-refinement.md | 3, 13 |
| 04-rubric.md | 4, 18 |
| 05-indicator-examples.md | 4, 6 |
| 06-action-rules.md | 5 |
| 07-hypothetical-rules.md | 7 |
| 08-conflict-rules.md | 9 |
| 09-calibration.md | 10 |
| 10-training.md | 11 |
| 11-bias-training.md | 12 |
| 12-ai-boundaries.md | 15 |
| 13-proportionality.md | 14 |
| 14-human-review.md | 16 |
| 15-gates.md | 20 |
| 16-decision.md | 21 |
| 17-limitations.md | 25 |
| 18-audit-checklist.md | 22 |
| calibration-cases.csv | 17 |
| rubric-by-indicator.csv | 18 |
| question-refinement.csv | 19 |

## 8. AUDITORÍA FINAL

Ver `18-audit-checklist.md` — **27/27 verificadas**.

## 9. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia
(`evidence-a06-7/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**;
sin modificación de contrato, aviso, schema, código, datos, overallScore, IPIP, Knowledge, Integrity,
Personality, recomendaciones. REGLA ABSOLUTA cumplida.

## 10. REGLA FINAL

**NO IMPLEMENTAR. NO PUBLICAR. NO ACTIVAR. NO CREAR PREGUNTAS PRODUCTIVAS. NO CREAR SCORING.
NO CREAR PESOS. NO CREAR CORTES. NO IMPLEMENTAR JOBFIT. DETENTE.**
