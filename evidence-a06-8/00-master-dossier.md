# EVALUHR — A-06.8
# INTERVIEW LEGAL READINESS & FIELD PILOT AUDIT
# 00 · Master Dossier

> **SOLO AUDITORÍA + PREPARACIÓN. PILOTO / DRAFT / NO PRODUCTIVO.**
> Fecha: 2026-09-12 (America/Mexico_City). Fases previas: A-06.1 → A-06.7.
> **REGLA ABSOLUTA:** NO se modifica código, schema, base de datos, IPIP, Personality, Knowledge,
> Integrity, overallScore, JobFit, recomendaciones, contrato ni aviso. NO se publican preguntas.
> NO se activa entrevista. NO se crea scoring, pesos ni cortes.

---

## 1. Objeto

Cerrar documentalmente el expediente jurídico/metodológico de la entrevista estructurada
BDI/STAR y dejar preparada la información que un abogado debe revisar antes del piloto de campo.
Esta fase **NO activa** la entrevista y **NO implementa** código.

## 2. Estado heredado

| Fase | Entregable | Estado al inicio de A-06.8 |
|---|---|---|
| A-06.1 | Competency Model | DISEÑADO (COMP-G8 pendiente de cierre legal) |
| A-06.2 | Competency Catalog | DRAFT |
| A-06.3 | BDI/STAR metodología | DISEÑADO |
| A-06.4 | Legal & Privacy | LEGAL-G8/LEGAL-G10 CONDICIONALES; G7 (INTERVIEW) NO EVALUADO |
| A-06.5 | Question Bank | DRAFT — 10 preguntas candidatas, 0 ACTIVE |
| A-06.6 | Piloto metodológico (20 casos sintéticos) | COMPLETADO — 19/20 consistencia; 2 REVISE; G9 PARCIAL |
| A-06.7 | Refinamiento rúbrica + calibración | COMPLETADO — rúbrica v2-DRAFT; 8 KEEP_FOR_REVIEW + 2 REVISE; 0 ACTIVE |

## 3. Índice del expediente A-06.8

| Archivo | PASO | Contenido |
|---|---|---|
| 01-legal-consolidation.md | 1 | Expediente legal consolidado (A-06.4+A-06.5+A-06.6+A-06.7) |
| 02-current-law.md | 2 | Legislación vigente re-verificada con fuentes oficiales (12-13 sep 2026) |
| 03-question-legal-review.md | 3 | Revisión jurídica individual de las 10 preguntas candidatas |
| 04-probe-legal-review.md | 4 | Revisión jurídica individual de los probes (26) |
| 05-involuntary-disclosure.md | 5 | Protocolo obligatorio de revelación involuntaria |
| 06-bfoq.md | 6 | Procedimiento BFOQ (excepcional, no automatizable) |
| 07-ai-legal-boundaries.md | 7 | Límites jurídicos y metodológicos de la IA |
| 08-automation.md | 8 | Mapa AUTOMATED / ASSISTED / HUMAN ONLY del pipeline |
| 09-consent.md | 9 | Información mínima previa al candidato (consentimiento) |
| 10-retention.md | 10 | Re-examen de la conservación (2 años = RECOMENDADO, no obligación) |
| 11-access.md | 11 | Matriz de acceso por rol (mínimo privilegio) |
| 12-client-evalua.md | 12 | Responsabilidades empresa cliente vs EvaluHR |
| 13-contract-impact.md | 13 | Matriz de cambios de contrato (NO redactar contrato) |
| 14-privacy-impact.md | 14 | Matriz de cambios: aviso + consentimiento + información previa |
| 15-field-pilot.md | 15 | Protocolo del piloto de campo NO PRODUCTIVO |
| 16-g9.md | 16 | Qué demuestra y qué NO demuestra G9 |
| 17-g10.md | 17 | Requisitos futuros para G10 (sin análisis estadístico ahora) |
| 18-risk.md | — | Matriz de riesgos consolidada |
| 19-gates.md | 21 | Gates INTERVIEW-G1..G10 actualizados |
| 20-audit-checklist.md | 22 | Auditoría final (23 ítems) |
| interview-legal-readiness.csv | 18 | Matriz legal (item/requirement/source/applicability/risk/status/owner/requiredEvidence) |
| field-pilot-plan.csv | 19 | Matriz del piloto (pilotElement/requirement/method/participants/evidence/risk/gate/status) |
| search-*.json | 2 | Evidencia de las búsquedas de verificación legal |

## 4. Resumen ejecutivo por área

1. **Legislación (02)**: el 20-03-2025 (DOF) se expidió la **Nueva Ley Federal de Protección de
   Datos Personales en Posesión de los Particulares** (en vigor 21-03-2025; última reforma
   DOF 14-11-2025), que **abroga la LFPDPPP de 2010**; existe Reglamento de la nueva ley; el
   **INAI está extinto** y la Secretaría Anticorrupción y Buen Gobierno (SABG) asumió las funciones
   de autoridad garante (mayo 2025). LFT Art 3 y LFPEPD (reforma DOF 14-11-2025) vigentes; CONAPRED
   opera. **Impacto**: los principios aplicados por A-06.4–A-06.7 se mantienen, pero la
   **renumeración de artículos** exige re-mapeo textual por abogado y el destinatario de quejas/
   notificaciones pasa a ser la SABG. Ningún número de artículo de la nueva ley se cita sin
   verificación textual → LEGAL_REVIEW.
2. **Preguntas (03)**: 10/10 revisadas individualmente. 8 PUBLICABLE (conservado), 2 CONDICIONAL
   (Q-MES-TRV-002 y Q-VEN-TRV-002: revelación involuntaria documentada en piloto M-H/V-H →
   condición: entrenamiento impartido + protocolo activo). **0 ACTIVE. 0 NO_PUBLICABLE.
   0 LEGAL_REVIEW.** Ninguna conversión a ACTIVE.
3. **Probes (04)**: 26 probes revisados (25 evaluados en piloto + PROBE-COL-001-D formalizado en
   A-06.7). 24 PUBLICABLE; **PROBE-UNI-004 CONDICIONAL** (uso restringido a cierre, CU-1..CU-6);
   **PROBE-COL-001-D CONDICIONAL** (no pilotado; tono no confrontativo + stop rule). Ninguno induce
   atributos protegidos; ninguno solicita información sensible.
4. **Datos y revelación involuntaria (05)**: protocolo obligatorio de 6 pasos; el contenido sensible
   revelado espontáneamente NO se registra, NO se almacena, NO se usa para CompetencyResult.
5. **BFOQ (06)**: procedimiento de 7 pasos, no automatizable, no interpretable por IA, dictamen
   legal + aprobación humana. **0 BFOQ activos en el banco actual.**
6. **IA (07)**: permitido = 5 funciones de asistencia (lista cerrada); prohibido = 8 usos
   (inferencia de atributos/decisiones/clasificación). IA nunca es base única ni decide.
7. **Automatización (08)**: pipeline mapeado paso a paso: entrevista/review/resultado/decisión =
   HUMAN ONLY; transcripción/resumen/sugerencias = ASSISTED; almacenamiento/purge/auditoría =
   AUTOMATED. **Ninguna decisión laboral automatizada.**
8. **Consentimiento (09)**: especificación de 11 elementos de información mínima previa —
   documento legal definitivo NO redactado en esta fase.
9. **Conservación (10)**: los "2 años" quedan **re-clasificados como RECOMENDADO (práctica de
   diseño), no obligación legal**; plazo definitivo LEGAL_REVIEW bajo la nueva ley. Por categoría
   de dato y tipo de titular (contratado / no contratado / evidencia / auditoría / consentimiento).
10. **Acceso (11)**: matriz 8 roles × 7 acciones (READ/CREATE/REVIEW/MODIFY/INVALIDATE/EXPORT/
    DELETE) bajo mínimo privilegio; IA sin acceso autónomo.
11. **Responsabilidades (12)**: matriz cliente vs EvaluHR re-verificada; actualización de destino
    de notificaciones (SABG); contrato aún sin cambios.
12. **Contrato y aviso (13/14)**: matrices de cambios con prioridad OBLIGATORIO/RECOMENDADO/
    REVISIÓN LEGAL. **No se redacta ni modifica ningún documento jurídico.**
13. **Piloto de campo (15)**: protocolo NO PRODUCTIVO: voluntarios, preferencia internos/sintéticos,
    consentimiento reforzado, sin consecuencias laborales, sin decisiones de contratación;
    número mínimo recomendado **como objetivo operativo, NO como criterio de validez psicométrica**.
14. **Gates (19)**: G9 = **PARTIAL / READY FOR FIELD PILOT** (preparación completa; piloto pendiente).
    **G7 = NO APPROVED — solo se cierra con revisión legal profesional.** G10 = NOT EVALUATED.
    G2/G3/G4/G5 CONDICIONALES; G1/G6/G8 APROBADOS (mantenidos, sin aprobación nueva).
15. **Decisión**: **GO para preparar el piloto de campo (no productivo). NO-GO para activación
    productiva** (bloquean G2/G3/G4/G5, G7-CRITICAL, LEGAL-G8/G10 y el pilotaje de campo real).

## 5. Qué NO hace A-06.8

- NO aprueba G7 ni sustituye asesoría legal profesional.
- NO redacta contrato, aviso ni consentimiento definitivos.
- NO activa la entrevista ni publica el banco.
- NO ejecuta el piloto de campo ni análisis estadístico.
- NO modifica ningún artefacto productivo (verificación en `20-audit-checklist.md` §B).

## 6. Decisión final

| Track | Decisión |
|---|---|
| Preparación de piloto de campo (no productivo) | **GO** — protocolo y matrices listos para revisión del abogado |
| Activación productiva de la entrevista | **NO-GO** — G7 NO APPROVED + LEGAL-G8/G10 CONDICIONALES + G9 requiere pilotaje de campo |
