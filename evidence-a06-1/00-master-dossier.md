# EVALUHR — A-06.1 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# AUDITORÍA Y DISEÑO DEL MODELO DE COMPETENCIAS — SOLO INVESTIGACIÓN + DISEÑO (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@aa771a9` (post-A-05.3).
Método: investigación con fuentes primarias (web-search CLI + lectura de snippets), literatura científica
(McClelland 1973; Spencer & Spencer 1993; Huffcutt & Arthur 2001; McDaniel 2001; Pulakos & Schmitt 1995;
Hartwell 2019; Oliphant 2008; Whetzel 2009; Christian 2010; Gaugler 1987) + evidencia MX (CONOCER, UAM, UNAM, CONARH).
Regla: SOLO INVESTIGACIÓN + DISEÑO; NO IMPLEMENTAR; NO MODIFICAR CÓDIGO.

---

## 1. DEFINICIÓN (PASO 1)

**Competencia** = característica subyacente de un individuo causalmente relacionada con desempeño efectivo
o superior, **observable a través de conducta**, inferida de evidencia conductual (NO de un score).

Diferenciada de: personalidad (latent predictor), conocimiento (recurso), experiencia (historia),
formación (input), integridad (latent → behavior), aptitud (capacidad), desempeño (criterion).
Detalle: `competency-definition.md`.

## 2. METODOLOGÍA (PASO 2-8)

### 2.1 Framework conceptual (PASO 3)

`Competency { competencyId, name, definition, behavioralIndicators, jobRelevance, source, version, status, approvedBy }`.
Versionado (COMP-v{n}); governance DRAFT→ACTIVE. Sin scoring/pesos/cortes. Detalle: `competency-framework.md`.

### 2.2 Indicadores conductuales (PASO 4)

Observable behavior (verbo presente, contexto laboral). Ejemplos marcados `EJEMPLO — NO PRODUCTIVO`
hasta aprobación. IA sugiere; humano aprueba. Detalle: `behavioral-indicators.md`.

### 2.3 Vínculo con puesto (PASO 5)

`JobCompetency { jobId, competencyId, rationale, source, jobRelevance, criticality, approvedBy }`.
IA NO decide relevancia. Detalle: `job-linkage.md`.

### 2.4 Métodos de evaluación (PASO 6)

7 métodos comparados (entrevista estructurada, conductual, BEI, SJT, cuestionario, assessment center,
evidencia documental). Detalle: `evaluation-methods.md` + `competency-method-matrix.csv`.

### 2.5 Entrevista estructurada (PASO 7)

ENTREVISTA ≠ prueba psicométrica. Produce evidencia contextual con niveles cualitativos (NO scoring).
BDI/STAR. Validez Huffcutt/Arthur/Oliphant/Hartwell. Detalle: `structured-interview.md`.

### 2.6 SJT (PASO 6)

Validez McDaniel 2001 r≈.34. NO V1 (requiere desarrollo + baremos MX). Diferido post-V1. Detalle: `sjt-analysis.md`.

### 2.7 IA (PASO 8)

IA asiste (borradores/probes/resúmenes) pero NO decide. `AI_DRAFT_ORIGIN` permanente; `approvedBy` humano.
Detalle: `ai-boundaries.md`.

## 3. EVIDENCIA (PASO 9-12)

### 3.1 Niveles de evidencia

VALID / LIMITED / INSUFFICIENT / PENDING_REVIEW / INVALID. Detalle: `evidence-model.md`.

### 3.2 Niveles de competencia

NO_EVIDENCE / INSUFFICIENT / LIMITED / SUPPORTED / STRONG (cualitativos, NO 0-100).

### 3.3 CompetencyResult ≠ JobFit

CompetencyResult = evidencia por competencia; NO decide contratación; NO se conecta a JobFit ni overallScore.
Detalle: `evidence-model.md` §6.

### 3.4 Conflictos (PASO 10)

NO promediar; NO "gana el más alto"; PENDING_REVIEW con resolución humana. Detalle: `conflict-rules.md`.

## 4. GOVERNANCE (PASO 13)

Ciclo DRAFT→REVIEW→APPROVED→ACTIVE→SUSPENDED→RETIRED. 4 roles (Author/Reviewer/Approver/Admin).
Trazabilidad inmutable. IA nunca cruza a APPROVED. Detalle: `governance.md`.

## 5. MÉXICO (PASO 15)

CONOCER/NTCL EXISTE (marco normativo). Práctica WIDESPREAD. Validez predictiva MX NOT_ESTABLISHED.
Baremos MX NOT_ESTABLISHED. Transferencia internacional LIMITADA hasta validación propia.
Detalle: `mexico-evidence.md`.

## 6. RIESGOS (PASO 16)

4 ALTO (sesgo entrevistador, inconsistencia inter-entrevistador, preguntas discriminatorias, veto automático),
5 MEDIO, 1 BAJO. Mitigación estructural (guía + rúbrica + entrenamiento + calibración + revisión legal + no-veto).
Detalle: `risk-analysis.md`.

## 7. ENTREVISTA (PASO 7)

Entrevista estructurada BDI/STAR = fuente principal V1. Guía versionada + rúbrica cualitativa + entrenamiento.
NO scoring. Detalle: `structured-interview.md`.

## 8. SJT (PASO 6)

Validez r≈.34 (McDaniel 2001). NO V1 (desarrollo + baremos MX requeridos). Diferido post-V1.
Detalle: `sjt-analysis.md`.

## 9. PAPEL DE IA (PASO 8)

Asiste: borradores de preguntas, probes, resúmenes, adaptación de lenguaje. NO decide: nivel, aprobación,
contratación. `AI_DRAFT_ORIGIN` + `human reviewed` siempre. Detalle: `ai-boundaries.md`.

## 10. MODELO ELEGIDO (PASO 17)

> **OPCIÓN A — Entrevista estructurada como fuente principal de evidencia de competencias en V1.**

Complemento: evidencia documental (CV + referencias). SJT diferido post-V1. No scoring, no pesos, no cortes,
no JobFit, no overallScore. CompetencyResult = evidencia separada para RR.HH. Detalle: `recommended-model.md`.

## 11. GATES (PASO 18)

COMP-G1..G10 (Constructo/Definition/Indicators/JobRelevance/Method/HumanReview/Governance/LegalReview/
Pilot/Validation). Estado actual: G1/G2/G5/G6/G7 APROBADO; G3/G4 CONDICIONAL; G8/G9/G10 NO EVALUADO.
**Crítico**: G8 (legal review) + G9 (pilot) bloquean activación V1. Detalle: `activation-gates.md`.

## 12. MATRIZ (PASO 19)

`competency-method-matrix.csv`: 7 métodos × 12 columnas (method/construct/evidenceType/scientificEvidence/
workplaceEvidence/mexicoEvidence/fakingRisk/biasRisk/implementationComplexity/aiRole/humanReview/recommended).

## 13. ÍNDICE DEL EXPEDIENTE A-06.1

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| competency-definition.md | 1 |
| competency-framework.md | 2, 3 |
| behavioral-indicators.md | 4 |
| job-linkage.md | 5 |
| evaluation-methods.md | 6 |
| structured-interview.md | 7 |
| sjt-analysis.md | 6 (SJT) |
| ai-boundaries.md | 8, 10 |
| evidence-model.md | 9, 11, 12 |
| conflict-rules.md | 10 |
| governance.md | 13 |
| mexico-evidence.md | 15 |
| risk-analysis.md | 16 |
| recommended-model.md | 17 |
| activation-gates.md | 18 |
| audit-checklist.md | 21 |
| competency-method-matrix.csv | 19 |

## 14. AUDITORÍA FINAL

Ver `audit-checklist.md` — **18/18 verificadas**.

## 15. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia (`evidence-a06-1/*` y
`worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**; sin migraciones, sin db push,
sin escrituras de datos. REGLA ABSOLUTA cumplida.
