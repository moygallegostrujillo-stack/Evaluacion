# EVALUHR — A-06.11 · 02 · GATE STATUS (PASO 2)

## 1. Regla de la tabla

Tabla única de los tres sistemas de gates. Columnas: **GATE / ESTADO / EVIDENCIA / PENDIENTE / RESPONSABLE**.

Regla dura: **no se marca como aprobado aquello que requiere abogado.** Los estados NO APPROVED / NOT EVALUATED solo pueden modificarse con dictamen legal profesional o con evidencia de ejecución real (piloto), no con este expediente.

## 2. FAMILIA COMP — Modelo de competencias (A-06.1)

| GATE | ESTADO | EVIDENCIA | PENDIENTE | RESPONSABLE |
|---|---|---|---|---|
| COMP-G1 Constructo | ✔ APROBADO | A-06.1 `competency-definition.md` (McClelland 1973; Spencer & Spencer 1993); competencia ≠ personalidad/conocimiento/integridad | — | — |
| COMP-G2 Definición de competencia | ✔ APROBADO | A-06.1 `competency-framework.md` (estructura sin scoring/pesos/cortes) | — | — |
| COMP-G3 Indicadores conductuales | ⚠ CONDICIONAL | A-06.2 `behavioral-indicators.md` + `indicator-quality.csv`; catálogo DRAFT | Redacción y aprobación humana de indicadores por competencia V1 | RR.HH. EvaluHR |
| COMP-G4 Job relevance | ⚠ CONDICIONAL | A-06.1 `job-linkage.md`; estructura definida | Vínculos JobCompetency por puesto con aprobación humana | RR.HH. EvaluHR |
| COMP-G5 Método de evaluación | ✔ APROBADO | A-06.1 `recommended-model.md` (BDI/STAR; evidencia Huffcutt/Arthur/Oliphant/Hartwell) | — | — |
| COMP-G6 Human review | ✔ APROBADO | A-06.1 `ai-boundaries.md` + `governance.md`; IA nunca cruza a APPROVED | — | — |
| COMP-G7 Governance | ✔ APROBADO | A-06.1 `governance.md` (ciclo de vida, audit trail inmutable) | — | — |
| COMP-G8 Legal review | ✗ NO EVALUADO → **pendiente dictamen** | Este expediente A-06.11 (11/12/13/15/16) | Dictamen legal profesional | Abogado mexicano |
| COMP-G9 Pilot | ✗ NO EVALUADO | A-06.10 NO EJECUTADO (alcance definido, sin resultados) | Ejecutar piloto no productivo | EvaluHR (operación) |
| COMP-G10 Validation | ✗ NOT EVALUATED | Sin seguimiento post-contratación | Validación predictiva 6–12 meses | EvaluHR (post-V1) |

## 3. FAMILIA INTERVIEW — Entrevista estructurada (A-06.3 + registro A-06.4–A-06.8)

| GATE | ESTADO | EVIDENCIA | PENDIENTE | RESPONSABLE |
|---|---|---|---|---|
| INTERVIEW-G1 Constructo | ✔ APROBADO | A-06.3 `02-bdi.md`, `03-star.md` | — | — |
| INTERVIEW-G2 Competency linkage | ⚠ CONDICIONAL | A-06.3 `05-question-design.md` §6; catálogo A-06.2 DRAFT | Competencias APPROVED en producción | RR.HH. EvaluHR |
| INTERVIEW-G3 Question design | ⚠ CONDICIONAL | 10 candidatas: 8 PUBLICABLE / 2 CONDICIONAL (registro A-06.5/A-06.8); textos DRAFT v2 en 03 | Dictamen sobre las 10; resolución de 3 REVISE; nunca ACTIVE sin G7+G9 | Abogado + RR.HH. |
| INTERVIEW-G4 Probe design | ⚠ CONDICIONAL | 26 probes: 24 PUBLICABLE / 2 CONDICIONAL (registro A-06.5/A-06.8); textos DRAFT v2 en 04 | Dictamen sobre los 26 | Abogado + RR.HH. |
| INTERVIEW-G5 Rubric | ⚠ CONDICIONAL | RUBRIC-QUAL-v2-DRAFT (05) | Dictamen; consistencia inter-revisor solo medible tras piloto | Abogado + RR.HH. |
| INTERVIEW-G6 Bias review | ✔ APROBADO (análisis) | A-06.3 `13-bias.md` + `15-privacy.md`; CI-VAL-6 de A-06.2 | Aplicar por pregunta antes de APPROVED (15/16) | RR.HH. + Abogado |
| INTERVIEW-G7 Legal review | ✗ **NO APPROVED — CRÍTICO** | Este expediente A-06.11 | Dictamen legal profesional; solo el abogado lo cierra | **Abogado** |
| INTERVIEW-G8 Governance | ✔ APROBADO | A-06.3 `18-versioning.md` + `16-human-review.md` (DRAFT→ACTIVE, append-only, IA nunca aprueba) | — | — |
| INTERVIEW-G9 Pilot | ⚠ **PARTIALLY SATISFIED** — READY FOR FIELD PILOT | Diseño completo según registro A-06.8; A-06.10 (piloto de campo) NO EJECUTADO | Ejecutar piloto controlado no productivo; medir consistencia inter-revisor | EvaluHR (operación) |
| INTERVIEW-G10 Validation | ✗ NOT EVALUATED | Requiere piloto + seguimiento | Correlación con desempeño 6–12 meses | EvaluHR (post-V1) |

## 4. FAMILIA LEGAL — Cumplimiento LFPDPPP (registro A-06.7/A-06.8; estructura consolidada en A-06.11)

> Provenance: familia consolidada en este expediente desde el registro de auditoría; expedientes fuente no materializados en disco. Los estados núcleo (G8/G9/G10) provienen del registro A-06.8 y NO se modifican aquí.

| GATE | ESTADO | EVIDENCIA | PENDIENTE | RESPONSABLE |
|---|---|---|---|---|
| LEGAL-G1 Base LFPDPPP aplicada (análisis) | ✔ REGISTRADO (análisis, no dictamen) | Registro A-06.7/A-06.8; Art. 37 Bis analizado en A-06.3 `15-privacy.md` §6 | Confirmación por dictamen | Abogado |
| LEGAL-G2 Aviso de privacidad (selección) | ⚠ BORRADOR — LEGAL_REVIEW | 12 (borrador DRAFT reconstruido) | Dictamen + redacción definitiva | Abogado |
| LEGAL-G3 Consentimiento | ⚠ BORRADOR — LEGAL_REVIEW | 13 (estructura información previa vs manifestación) | Dictamen sobre forma y redacción por tratamiento | Abogado |
| LEGAL-G4 Datos sensibles | ⚠ DISEÑADO — LEGAL_REVIEW | 07 (protocolo UNINVITED_DISCLOSURE 6 pasos) | Dictamen sobre manejo y conservación | Abogado |
| LEGAL-G5 Derechos ARCO | ⚠ DISEÑADO — LEGAL_REVIEW | 17 (mapeo de flujo) | Dictamen sobre obligaciones por parte | Abogado |
| LEGAL-G6 Conservación | ⚠ PROPUESTA — LEGAL_REVIEW | 10 (categorías; plazos = [PLAZO POR DICTAMEN LEGAL]) | Dictamen de plazos | Abogado |
| LEGAL-G7 No discriminación | ⚠ DISEÑADO — LEGAL_REVIEW | 15 (matriz) + 16 (BFOQ 7 pasos) | Dictamen sobre matriz y BFOQ | Abogado |
| LEGAL-G8 Dictamen legal profesional | ✗ **NO APPROVED — CRÍTICO** | Este expediente (19, 20, legal-opinion-request.csv) | Emitir dictamen con APPROVE / APPROVE_WITH_CHANGES / REJECT / NEEDS_MORE_INFORMATION por cuestión | **Abogado** |
| LEGAL-G9 Implementación operativa de controles | ⚠ PARTIALLY SATISFIED | Registro A-06.8 (controles de diseño verificados en 18) | Ejecución real (piloto) y verificación operativa | EvaluHR |
| LEGAL-G10 Validación legal post-piloto | ✗ **NOT EVALUATED** | — | Validación legal con resultados del piloto y del dictamen | **Abogado** |

## 5. Resumen ejecutivo de bloqueos

| Bloqueo | Estado | Clave |
|---|---|---|
| INTERVIEW-G7 | NO APPROVED | Sin dictamen, la entrevista NO se activa en V1 |
| LEGAL-G8 | NO APPROVED | Sin dictamen, ningún componente legal se declara conforme |
| LEGAL-G10 | NOT EVALUATED | Requiere dictamen + piloto; solo abogado |
| INTERVIEW-G9 / COMP-G9 | PARTIALLY SATISFIED / NO EVALUADO | A-06.10 no ejecutado — piloto pendiente |
| G2/G3/G4/G5 (COMP e INTERVIEW) | CONDICIONAL | Requieren aprobación humana de indicadores, competencias, preguntas, probes y rúbrica — nunca antes del dictamen |

## 6. Regla de cierre

Ningún gate de esta tabla se cierra con este expediente. Este expediente existe para que el abogado pueda cerrar INTERVIEW-G7 + LEGAL-G8 y, posteriormente (con piloto ejecutado), LEGAL-G10.
