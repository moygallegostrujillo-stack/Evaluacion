# A-06.2 — 06 · Relación con el Puesto (PASO 7, 8)

## 1. Regla (PASO 7)

No permitir `competency → job` solo por intuición. Exigir:

```
jobElement (análisis de puesto)
+
rationale (por qué)
+
source (de dónde viene el análisis)
+
approvedBy (humano)
```

## 2. JobCompetency (reiteración de 02-definition.md)

```
JobCompetency {
  jobId: string                // FK Position | Vacancy
  competencyId: string         // FK Competency
  jobRelevance: VALID | LIMITED | INSUFFICIENT | PENDING_REVIEW
  rationale: string            // justificación textual
  criticality: CRITICAL | IMPORTANT | STANDARD
  source: JOB_ANALYSIS | LITERATURE | EXPERT | AI_SUGGESTED
  version: string              // JobCompetency-v1
  approvedBy: string           // humano
  status: DRAFT | REVIEW | APPROVED | ACTIVE | SUSPENDED | RETIRED
}
```

## 3. jobRelevance (PASO 7)

`jobRelevance` describe **qué tan bien la competencia aplica al puesto**, no qué tan crítica es (eso es `criticality`).

| Valor | Significado |
|---|---|
| VALID | La competencia aplica claramente al puesto; hay evidencia de análisis de puesto que la respalda |
| LIMITED | La competencia aplica parcialmente; el puesto la requiere en algunos contextos |
| INSUFFICIENT | El análisis de puesto no confirma relevancia; el vínculo es hipotético |
| PENDING_REVIEW | Conflicto o duda; requiere revisión humana adicional |

**Regla**: INSUFFICIENT ≠ "la competencia no aplica". Significa: **no tenemos evidencia suficiente para afirmar la relevancia**. No se promueve a ACTIVE con INSUFFICIENT.

## 4. criticality (PASO 8)

Integra el modelo A-02.5:

| Valor | Significado | Consecuencia de ausencia |
|---|---|---|
| CRITICAL | Sin esta competencia, el desempeño del puesto fracasa | El candidato no puede desempeñar el puesto |
| IMPORTANT | Sin esta competencia, el desempeño se ve significativamente limitado | El desempeño se reduce pero no fracasa |
| STANDARD | La competencia mejora el desempeño pero no lo determina | El desempeño es aceptable sin ella |

### 4.1 Reglas de criticidad

1. **NO la decide IA** — la IA puede sugerir (AI_SUGGESTED), pero la asignación final es humana.
2. **NO se infiere del nombre de la competencia** — "Servicio al cliente" no es universalmente CRITICAL; depende del puesto (CRITICAL para MESERO, STANDARD para LAVAPLATOS).
3. **Debe existir**: `justification` (texto), `source` (análisis), `approver` (humano identificado).

### 4.2 Ejemplo — EJEMPLO — NO PRODUCTIVO

> **Puesto**: MESERO
>
> | Competencia | jobRelevance | criticality | rationale |
> |---|---|---|---|
> | COMP-SVC-001 Servicio al cliente | VALID | CRITICAL | El 80% de las interacciones del mesero son con comensales; la satisfacción del cliente determina propinas y retención. |
> | COMP-TEC-002 Higiene alimentaria | VALID | CRITICAL | Violación de higiene puede cerrar el establecimiento (NOM-251). |
> | COMP-COL-001 Trabajo en equipo | VALID | IMPORTANT | El mesero coordina con cocina y hostess; sin coordinación el servicio falla. |
> | COMP-ORG-001 Organización | VALID | IMPORTANT | El mesero maneja múltiples mesas simultáneamente; sin organización, se retrasa. |
> | COMP-LDR-001 Dirección | INSUFFICIENT | STANDARD | El mesero entry-level no dirige equipos; la competencia no aplica al puesto base. |

## 5. jobElement (análisis de puesto)

Antes de vincular competencias, se requiere un análisis de puesto:

```
JobElement {
  jobId: string
  task: string                 // tarea del puesto
  frequency: 'DAILY' | 'WEEKLY' | 'OCCASIONAL'
  importance: string           // descripción
  source: JOB_ANALYSIS | LITERATURE | O*NET | EXPERT
  documentedAt: timestamp
  documentedBy: string         // humano
}
```

Los `jobElement` alimentan la decisión de `jobRelevance` + `criticality`. Sin jobElement documentado, el vínculo es `INSUFFICIENT`.

## 6. Proceso de vinculación

1. **Análisis de puesto**: documentar tareas (jobElement) con un ocupante/supervisor del puesto.
2. **Mapeo competencia → tarea**: identificar qué competencias se requieren para cada tarea.
3. **Asignación de jobRelevance**: VALID si el mapeo es claro; LIMITED si parcial; INSUFFICIENT si no se confirma.
4. **Asignación de criticality**: CRITICAL/IMPORTANT/STANDARD según consecuencia de ausencia.
5. **Aprobación humana**: reviewedBy + approvedBy; IA no aprueba.
6. **Publicación**: status ACTIVE tras APPROVED.

## 7. Regla: IA no decide

La IA puede:
- **sugerir** competencias candidatas basadas en la descripción del puesto (source=AI_SUGGESTED);
- **proponer** un rationale inicial;
- **sugerir** criticality inicial.

La IA **NO** puede:
- **asignar** jobRelevance o criticality como ACTIVE;
- **aprobar** el vínculo;
- **decidir** que una competencia es CRITICAL sin justificación humana.

Todo AI_SUGGESTED queda en DRAFT hasta revisión humana.

## 8. Conexión con gates

La vinculación pasa COMP-G4 (job relevance gate). Sin jobElement + rationale + source + approvedBy, ningún JobCompetency puede estar ACTIVE.
