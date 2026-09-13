# A-06.1 — Recommended Model (PASO 17)

## 1. Opciones evaluadas

| Opción | Descripción |
|---|---|
| A | Entrevista estructurada (BDI + STAR) como fuente principal |
| B | SJT como fuente principal |
| C | Combinación (entrevista + SJT + evidencia documental) |
| D | No implementar competencias todavía en V1 |

## 2. Análisis por opción

### Opción A — Entrevista estructurada como fuente principal

| Criterio | Valor |
|---|---|
| Validez predictiva | ESTABLISHED (Huffcutt & Arthur 2001 meta; Oliphant 2008; Hartwell 2019) |
| Costo | BAJO-MEDIO (entrenamiento + guía; no requiere instrumento propietario) |
| Implementación | VIABLE V1 (guía versionada + rúbrica + entrenamiento) |
| Faking | BAJO-MEDIO (pasado verificable, menos faking que auto-reporte) |
| México | LIMITED (práctica común; validez predictiva MX específica NOT_ESTABLISHED — transferencia internacional) |
| Sesgo | MEDIO (entrenable; mitigable con guía estructurada) |
| Compatibilidad EvaluHR | ALTA (Position/Vacancy ya existen; InterviewSchedule ya existe) |

### Opción B — SJT como fuente principal

| Criterio | Valor |
|---|---|
| Validez predictiva | ESTABLISHED (McDaniel 2001 r≈.34; Christian 2010) |
| Costo | MEDIO-ALTO (desarrollo de item set por sector) |
| Implementación | NO V1 (requiere desarrollo + baremos MX) |
| Faking | MEDIO (face-valid) |
| México | NOT_ESTABLISHED (no existe SJT MX validado) |
| Sesgo | BAJO (estandarizado) |
| Compatibilidad EvaluHR | MEDIA (requiere infraestructura nueva de item set) |

### Opción C — Combinación

| Criterio | Valor |
|---|---|
| Validez | ALTA (múltiples fuentes) |
| Costo | MEDIO-ALTO (entrevista + SJT) |
| Implementación | NO V1 (SJT no está desarrollado) |
| Riesgo | Complejidad de agregación de evidencia (conflictos) |

### Opción D — No implementar competencias todavía

| Criterio | Valor |
|---|---|
| Validez | N/A |
| Costo | $0 |
| Implementación | Trivial (no hacer nada) |
| Impacto producto | MEDIO-ALTO (V1 no tendría evaluación de competencias, solo Knowledge + Integrity + Psychology) |
| Riesgo | BAJO (sin competencias = sin riesgo de competencias) |

## 3. Opción elegida

> **OPCIÓN A — Entrevista estructurada como fuente principal de evidencia de competencias en V1.**

### 3.1 Razón

1. **Validez establecida**: la entrevista estructurada (especialmente BDI/STAR) tiene el respaldo científico más fuerte de los métodos viables (Huffcutt & Arthur 2001; Oliphant 2008; Hartwell 2019; Pulakos & Schmitt 1995).
2. **Costo razonable**: no requiere desarrollo de item set propietario (como SJT) ni infraestructura costosa (como BEI o Assessment Center).
3. **Implementación viable**: V1 puede construir guía versionada + rúbrica + entrenamiento sin nueva infraestructura mayor (InterviewSchedule ya existe).
4. **Faking moderado**: el pasado verificable reduce faking comparado con auto-reporte.
5. **Compatibilidad con EvaluHR**: se integra con Position/Vacancy + InterviewSchedule + CompetencyResult.

### 3.2 Complementos

- **Evidencia documental (G)**: CV + referencias como complemento verificable (no fuente conductual).
- **Post-V1**: SJT por sector cuando se desarrolle con baremos MX (Opción C futura).

### 3.3 Lo que NO se hace en V1

- NO se implementa SJT (requiere desarrollo).
- NO se implementa BEI (recurso-intensivo).
- NO se implementa Assessment Center (costo/logística).
- NO se implementa auto-reporte como fuente principal (faking ALTO).
- NO se crea scoring (0-100).
- NO se crean pesos.
- NO se crean cortes.
- NO se conecta CompetencyResult a JobFit ni overallScore.

## 4. Arquitectura conceptual V1

```
Position/Vacancy (jobId)
    ↓
JobCompetency (vínculo humano-aprobado, versionado)
    ↓
Competency (catálogo versionado, governance DRAFT→ACTIVE)
    ↓
BehavioralIndicator (conductas observables, aprobadas)
    ↓
InterviewGuide (preguntas STAR + probes + rúbrica, versionada)
    ↓
[Entrevista humana estructurada]
    ↓
CompetencyResult (evidenceLevel cualitativo + rationale + indicators observed)
    ↓
[Revisión humana — NO auto-decisión]
    ↓
[RR.HH. decide con múltiples fuentes — LFPDPPP Art. 37 Bis]
```

## 5. Gates para activación (preview)

La activación de competencias en V1 requiere pasar COMP-G1..G10 (ver `activation-gates.md`).

## 6. Decisión final

**OPCIÓN A — Entrevista estructurada como fuente principal de evidencia de competencias en V1**, con evidencia documental como complemento. SJT diferido a post-V1. No scoring, no pesos, no cortes, no JobFit, no overallScore. CompetencyResult es evidencia separada para RR.HH.
