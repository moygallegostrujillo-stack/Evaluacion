# EVALUHR — A-06.2 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# DISEÑO Y VALIDACIÓN DEL CATÁLOGO DE COMPETENCIAS E INDICADORES CONDUCTUALES — SOLO DISEÑO + AUDITORÍA (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@0eb0cbd` (post-A-06.1).
Método: diseño conceptual sobre el modelo A-06.1 (competencia = conducta observable inferida de evidencia;
entrevista estructurada BDI/STAR como fuente principal). Regla: SOLO DISEÑO + AUDITORÍA; NO IMPLEMENTAR;
NO MODIFICAR CÓDIGO; ejemplos marcados `EJEMPLO — NO PRODUCTIVO`.

---

## 1. CATÁLOGO CANDIDATO (PASO 15)

**11 competencias candidatas** en 6 categorías (mínimo 6–10 requerido: ✓). Todas status: **DRAFT / CANDIDATE**.

| ID | Nombre | Categoría | Indicadores |
|---|---|---|---|
| COMP-TRV-001 | Comunicación efectiva | A. Transversales | 3 |
| COMP-TRV-002 | Adaptabilidad | A. Transversales | 3 |
| COMP-TEC-001 | Manejo de POS | B. Técnicas | 3 |
| COMP-TEC-002 | Higiene alimentaria | B. Técnicas | 3 |
| COMP-SVC-001 | Servicio al cliente | C. Servicio | 5 |
| COMP-SVC-002 | Manejo de quejas | C. Servicio | 4 |
| COMP-LDR-001 | Dirección de equipo | D. Liderazgo | 3 |
| COMP-COL-001 | Trabajo en equipo | E. Colaboración | 4 |
| COMP-COL-002 | Cooperación interárea | E. Colaboración | 3 |
| COMP-ORG-001 | Organización del trabajo | F. Organización | 4 |
| COMP-ORG-002 | Gestión del tiempo | F. Organización | 3 |

Detalle: `03-taxonomy.md`, `competency-catalog.csv`.

## 2. DEFINICIÓN (PASO 2)

`Competency { competencyId, name, definition, behavioralIndicators, evidenceTypes, source, version, status }`.
`JobCompetency { jobId, competencyId, jobRelevance, rationale, criticality, source, version, approvedBy, status }`.
Sin scoring/pesos/cortes. Versionado (COMP-v{n}); governance DRAFT→ACTIVE. Detalle: `02-definition.md`.

## 3. INDICADORES (PASO 5, 6)

**23 indicadores conductuales** candidatos (verbo presente, contexto laboral, observable). Ejemplos marcados
`EJEMPLO — NO PRODUCTIVO`. Validados contra 8 reglas CI-VAL-1..8 (observable, específico, relacionado
con trabajo, diferenciable, no redundante, no discriminatorio, evaluable, trazable). Un indicador que no
cumpla = NO_PUBLICABLE. Detalle: `04-behavioral-indicators.md`, `05-indicator-validation.md`, `indicator-quality.csv`.

## 4. EVIDENCIA (PASO 9)

6 tipos: INTERVIEW_STAR, OBSERVATION, WORK_SAMPLE, SJT, REFERENCE, DOCUMENT. Experiencia ≠ competencia
(años no demuestran conducta). Niveles: VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID. Detalle:
`07-evidence-model.md`.

## 5. MÉTODO STAR (PASO 10)

Situation/Task/Action/Result. **Action = evidencia clave**. **Resultado positivo ≠ competencia**
(puede deberse a factores externos). Detalle: `08-star-method.md`.

## 6. VINCULACIÓN A PUESTOS (PASO 7, 8)

`JobCompetency` con `jobRelevance` (VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW) + `criticality`
(CRITICAL/IMPORTANT/STANDARD). Requiere jobElement + rationale + source + approvedBy. **IA no decide**.
Ejemplos MESERO. Detalle: `06-job-linkage.md`.

## 7. CRITICIDAD (PASO 8)

CRITICAL/IMPORTANT/STANDARD. NO la decide IA. NO se infiere del nombre. Requiere justification + source
+ approver. Detalle: `06-job-linkage.md` §4.

## 8. IA (PASO 17)

IA asiste: sugerir competencias candidatas, proponer borradores de indicadores, sugerir lenguaje,
proponer probes, resumir respuestas. IA **NO** puede: aprobar, decidir criticality/jobRelevance, generar
evidencia, clasificar definitivamente. `AI_DRAFT_ORIGIN` + `human reviewed` siempre. Detalle: `11-ai-boundaries.md`.

## 9. RIESGOS (PASO 16, 18)

- **Sesgo del entrevistador**: halo, similaridad, estereotipo. Mitigación: guía estructurada + rúbrica +
  entrenamiento + calibración.
- **Discriminación**: indicadores con atributos protegidos (edad, género, etc.) = NO_PUBLICABLE + revisión
  legal. CI-VAL-6.
- **Conflicto**: NO promediar; NO "gana el más alto"; PENDING_REVIEW.
- **INSUFFICIENT ≠ 0**: nunca score numérico.
- **Veto automático**: prohibido; CompetencyResult no decide contratación.

Detalle: `12-bias.md`, `09-insufficient.md`, `10-conflicts.md`.

## 10. SESGOS (PASO 18)

8 atributos protegidos auditados (edad, género, religión, estado civil, embarazo, discapacidad, origen,
preferencia sexual). Indicadores neutros requeridos. BFOQ restrictivo + revisión legal. Detalle: `12-bias.md`.

## 11. MÉXICO (PASO 19)

CONOCER/NTCL EXISTE (marco normativo); alineación conceptual posible; **no equivalencia**. Práctica
WIDESPREAD; validez predictiva MX NOT_ESTABLISHED. NOM-035 distinto propósito. REQUIERE REVISIÓN LEGAL.
Detalle: `13-mexico.md`.

## 12. GOVERNANCE (PASO 20)

Ciclo DRAFT→REVIEW→APPROVED→ACTIVE→SUSPENDED→RETIRED. 4 roles (Author/Reviewer/Approver/Admin).
Trazabilidad inmutable (createdBy/reviewedBy/approvedBy/version/approvalDate). IA nunca cruza a APPROVED.
Detalle: `14-governance.md`.

## 13. SOLAPAMIENTO (PASO 4, 22)

11 competencias comparadas con Personality/Knowledge/Integrity: 0 REDUNDANT, 5 PARTIALLY_OVERLAPPING
(Comunicación/Adaptabilidad/Liderazgo/Trabajo en equipo/Gestión tiempo), 6 DISTINCT. **No se elimina nada
del código**. La distinción es documental + CompetencyResult separado de overallScore. Detalle:
`15-overlap-audit.md`.

## 14. TRAZABILIDAD (PASO 16)

Cadena: Job → JobElement → JobCompetency → Competency → Indicator → Evidence → AssessmentMethod →
CompetencyResult. **NO JobFit** (no introducido). Detalle: `02-definition.md` §4.

## 15. ÍNDICE DEL EXPEDIENTE A-06.2

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-before-audit.md | 1 |
| 02-definition.md | 2 |
| 03-taxonomy.md | 3 |
| 04-behavioral-indicators.md | 5 |
| 05-indicator-validation.md | 6 |
| 06-job-linkage.md | 7, 8 |
| 07-evidence-model.md | 9 |
| 08-star-method.md | 10 |
| 09-insufficient.md | 11 |
| 10-conflicts.md | 12 |
| 11-ai-boundaries.md | 17 |
| 12-bias.md | 18 |
| 13-mexico.md | 19 |
| 14-governance.md | 20 |
| 15-overlap-audit.md | 4, 22 |
| 16-audit-checklist.md | 23 |
| competency-catalog.csv | 21 |
| indicator-quality.csv | 21 |

## 16. AUDITORÍA FINAL

Ver `16-audit-checklist.md` — **24/24 verificadas**.

## 17. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia (`evidence-a06-2/*`
y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**; sin migraciones, sin db push,
sin escrituras de datos. REGLA ABSOLUTA cumplida.
