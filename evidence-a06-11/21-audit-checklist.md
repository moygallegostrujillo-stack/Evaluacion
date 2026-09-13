# EVALUHR — A-06.11 · 21 · AUDIT CHECKLIST (PASO 24)

## Verificación de 28 ítems del encargo

| # | Ítem | Estado | Evidencia |
|---|---|---|---|
| 1 | A-06.1–A-06.10 incorporados | ⚠ PARCIAL — documentado | 1–3 EN DISCO (verificados); 4–8 incorporados como REGISTRO DE AUDITORÍA; 9–10 NO EJECUTADOS (incorporados como alcance/estado, jamás como resultados) — 01-source-index.md §2 |
| 2 | 10 preguntas auditadas | ✔ | 03-question-legal-package.md (registro consolidado §3, una fila por pregunta con los 12 campos del encargo) |
| 3 | 26 probes auditados | ✔ | 04-probe-legal-package.md (24 PUBLICABLE / 2 CONDITIONAL) |
| 4 | 3 preguntas REVISE identificadas | ✔ | Q-MES-TRV-002 (CONDITIONAL), Q-VEN-TRV-002 (CONDITIONAL), Q-VEN-COL-001 (LEGAL_REVIEW escalada) — 03 §3 |
| 5 | Rúbrica incluida | ✔ | 05-rubric-package.md — RUBRIC-QUAL-v2-DRAFT (5 niveles, asignación, evidencia, prohibiciones, no-score) |
| 6 | Datos inventariados | ✔ | 06-data-inventory.md (8 columnas × 7 planos separados) |
| 7 | Sensibles tratados | ✔ | 07-sensitive-data.md (protocolo 6 pasos; solo flag; no conservar; sin nuevas excepciones) |
| 8 | IA documentada | ✔ | 08-ai-package.md (catálogo cerrado 5/8; proveniencia; anti-autoridad) |
| 9 | Revisión humana | ✔ | 09-human-review.md (cadena, roles, documentación mínima) |
| 10 | Conservación | ✔ | 10-retention.md (7 categorías separadas; [PLAZO POR DICTAMEN LEGAL]; "2 años"=recomendación) |
| 11 | Contrato | ✔ | 11-contract-package.md (12 elementos con OBLIGATORIO/RECOMENDADO/LEGAL_REVIEW; DRAFT, no modifica contrato real) |
| 12 | Aviso | ✔ | 12-privacy-package.md (8 bloques exigibles; no modifica aviso real) |
| 13 | Consentimiento | ✔ | 13-consent-package.md (información previa vs manifestación; granularidad; forma por dictamen) |
| 14 | Responsabilidades | ✔ | 14-responsibility-model.md (empresa/EvaluHR + 7 situaciones que alteran clasificación) |
| 15 | ARCO | ✔ | 17-arco.md (flujo SOLICITUD→IDENTIFICACIÓN→EMPRESA→EVALUA HR→EJECUCIÓN→EVIDENCIA) |
| 16 | Seguridad | ✔ | 18-security.md (controles sin afirmar certificaciones; matriz 8×7; huecos declarados) |
| 17 | No discriminación | ✔ | 15-nondiscrimination.md (matriz pregunta/riesgo/motivo/mitigación/legalStatus + revelaciones involuntarias) |
| 18 | BFOQ | ✔ | 16-bfoq.md (excepción jurídica exclusiva; protocolo 7 pasos; toda aplicación LEGAL_REVIEW; ninguna activa) |
| 19 | Preguntas al abogado | ✔ | 19-lawyer-questions.md (20 cerradas + 7 de cierre) + legal-opinion-request.csv (33 filas) |
| 20 | G7 NO APPROVED | ✔ PRESERVADO | 02-gate-status.md (INTERVIEW-G7 = NO APPROVED — CRÍTICO; solo abogado) |
| 21 | G9 correctamente documentado | ✔ | 02 (INTERVIEW-G9 = PARTIALLY SATISFIED — READY FOR FIELD PILOT; piloto A-06.10 NO EJECUTADO; no se declara validado) |
| 22 | G10 pendiente | ✔ PRESERVADO | 02 (LEGAL-G10/INTERVIEW-G10/COMP-G10 = NOT EVALUATED) |
| 23 | No código | ✔ | Ningún archivo de src/, prisma/ o scripts/ modificado; solo se creó evidence-a06-11/ |
| 24 | No schema | ✔ | prisma/schema.prisma intacto |
| 25 | No entrevista activa | ✔ | Banco completo DRAFT/NO PRODUCTIVO; 0 ACTIVE (03/04) |
| 26 | No publicación | ✔ | Ninguna pregunta/probe publicado; nada sale del expediente hacia producto |
| 27 | No scoring | ✔ | 05 (sin números, sin promedios, sin cortes; INSUFFICIENT ≠ 0) |
| 28 | No JobFit | ✔ | Ningún componente JobFit creado o modificado; frontera con IPIP/Knowledge/Integrity/Personality/overallScore intacta |

## Resumen del checklist

- ✔ cumplidos: 27 de 28.
- ⚠ con salvedad documentada: 1 de 28 (incorporación parcial de fuentes por no ejecución de A-06.9/A-06.10 — salvedad honesta, no ocultada; ver 01).
- ✗ fallidos: 0.

## Regla final

Ningún estado de gate cambió en A-06.11. El expediente se entrega al abogado; la cadena queda en DETENTE.
