# A-06.1 — Job Linkage (PASO 5)

## 1. Regla

Cada competencia debe vincularse a un **puesto específico** mediante una relación explícita. La IA **NO** decide la relevancia de una competencia para un puesto — esa decisión es humana.

## 2. Estructura del vínculo

```
JobCompetency {
  jobId: string                 // FK a Position | Vacancy
  competencyId: string          // FK a Competency (versionada)
  competencyVersion: string     // snapshot de la versión enlazada
  rationale: string            // por qué esta competencia es relevante para este puesto
  source: string               // análisis de puesto / literatura / experto
  jobRelevance: 'CRITICAL' | 'IMPORTANT' | 'SECONDARY'
  criticality: string          // descripción de qué sucede si la competencia está ausente
  approvedBy: string           // humano (IA no aprueba)
  version: string              // JobCompetency-v1
  status: DRAFT | REVIEW | APPROVED | ACTIVE | RETIRED
  linkedAt: timestamp
  approvedAt: timestamp?
}
```

## 3. Campos clave

### 3.1 rationale

Una justificación textual de por qué la competencia es relevante para el puesto. Ejemplo:

> "La competencia 'Servicio al cliente' es CRITICAL para el puesto de Mesero porque el 80% de las interacciones del puesto son con comensales, y la satisfacción del cliente determina directamente las propinas y la retención del cliente."

### 3.2 source

Origen del análisis:
- `JOB_ANALYSIS` — análisis de puesto formal (entrevista con ocupantes, observación);
- `LITERATURE` — marco de competencias profesional (e.g. O*NET, ONET-SOC);
- `EXPERT` — juicio de un experto en RR.HH. o del área;
- `AI_SUGGESTED` — sugerencia de IA (requiere aprobación humana antes de ACTIVE).

### 3.3 jobRelevance

Clasificación cualitativa (NO scoring):
- **CRITICAL** — sin esta competencia, el desempeño del puesto fracasa;
- **IMPORTANT** — sin esta competencia, el desempeño se ve significativamente limitado;
- **SECONDARY** — la competencia mejora el desempeño pero no lo determina.

Esta clasificación **NO** se convierte en peso numérico. Sirve para priorizar cuáles competencias evaluar primero y para la guía del evaluador.

### 3.4 criticality

Descripción de las consecuencias de la ausencia. Ejemplo:

> "Sin 'Servicio al cliente', el mesero genera quejas, reduce propinas, y puede causar pérdida de clientela."

## 4. Regla: la IA NO decide la relevancia

La IA puede **sugerir** competencias candidatas basadas en el análisis del puesto (descripción, sector, tareas), pero:

- La asignación de `jobRelevance` (CRITICAL/IMPORTANT/SECONDARY) es **humana**.
- La aprobación del vínculo (`status = ACTIVE`) es **humana**.
- El `rationale` sugerido por IA debe ser **revisado y validado** por un humano.

Toda sugerencia de IA se registra con `source = AI_SUGGESTED` y `status = DRAFT` hasta revisión.

## 5. Vinculación con el modelo de EvaluHR

| Entidad | Papel |
|---|---|
| Position (interno) | `jobId` — competencias vinculadas a un puesto interno |
| Vacancy (público) | `jobId` — competencias vinculadas a una vacante pública |
| Competency | `competencyId` — la competencia versionada |
| JobCompetency | el vínculo, con rationale + relevance + criticality |

Un puesto puede tener múltiples competencias vinculadas; una competencia puede estar vinculada a múltiples puestos.

## 6. Versión del vínculo

El vínculo se versiona (`version = 'JobCompetency-v1'`). Si se cambia la `jobRelevance` o el `rationale`, se crea una nueva versión (el vínculo anterior pasa a RETIRED, preservado para auditoría). Esto espeja el versionado de Knowledge en A-03.5.

## 7. Governance

| Estado | Quién | Acción |
|---|---|---|
| DRAFT | Humano o IA (con source=AI_SUGGESTED) | Crea vínculo propuesto |
| REVIEW | Humano (Reviewer) | Revisa rationale + relevance |
| APPROVED | Humano (Approver) | Aprueba el vínculo |
| ACTIVE | SYSTEM | Publicado, disponible para evaluaciones |
| RETIRED | Humano | Retirado (sin uso nuevo); histórico preservado |

La IA nunca cruza a APPROVED ni ACTIVE.

## 8. Conexión con gates

El vínculo job-competency pasa COMP-G4 (job relevance gate). Sin este gate, una competencia no puede estar activa para un puesto.
