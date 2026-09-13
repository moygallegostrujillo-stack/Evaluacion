# A-06.2 — 07 · Modelo de Evidencia (PASO 9)

## 1. Regla

Para cada competencia definir qué podría constituir evidencia. **No asumir que "tener años de experiencia" demuestra automáticamente la competencia.**

## 2. Tipos de evidencia

| Tipo | Descripción | Fiabilidad | Costo |
|---|---|---|---|
| Experiencia (CV/documental) | Años en puesto similar | BAJA para competencia (historia ≠ conducta actual) | BAJO |
| Conducta descrita (entrevista STAR) | El candidato narra un evento pasado con conducta observable | ALTA (BDI validity) | MEDIO |
| Resultado de entrevista | Nivel asignado por entrevistador con rúbrica | MEDIA-ALTA (según entrenamiento) | MEDIO |
| Ejemplo STAR | Situation-Task-Action-Result específico | ALTA | MEDIO |
| Referencia laboral | Verificación con empleador anterior | MEDIA (subjetiva) | BAJO-MEDIO |
| Documentación | Certificaciones, evaluaciones de desempeño | MEDIA (verificable pero indirecta) | BAJO |

## 3. Regla: experiencia ≠ competencia

> **Regla explícita**: "tener X años de experiencia" NO demuestra automáticamente la competencia.

**Razón**: la experiencia mide tiempo, no calidad de conducta. Un candidato con 5 años puede haber repetido malas prácticas 5 años; un candidato con 1 año puede tener conductas excelentes.

**Implicancia**: la experiencia documental es evidencia **complementaria**, no suficiente. Requiere corroboración conductual (entrevista STAR o referencia).

## 4. Estructura de evidencia

```
CompetencyEvidence {
  evidenceId: string
  candidateId: string
  competencyId: string
  jobId: string
  evidenceType: 'INTERVIEW_STAR' | 'OBSERVATION' | 'WORK_SAMPLE' | 'REFERENCE' | 'DOCUMENT'
  evidenceText: string         // descripción de la evidencia
  source: string               // entrevistador / documento / referencia
  collectedAt: timestamp
  collectedBy: string          // humano
  verified: boolean            // ¿verificada contra fuente secundaria?
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
}
```

## 5. Evidencia por competencia (ejemplos conceptuales)

### COMP-SVC-001 Servicio al cliente

| Tipo de evidencia | Qué buscaría |
|---|---|
| INTERVIEW_STAR | "Cuéntame de una vez que un cliente estuvo insatisfecho. ¿Qué hiciste?" → Action (escuchó, identificó, explicó) + Result (cliente satisfecho) |
| OBSERVATION | En un role-play o simulación, ¿formula preguntas de clarificación? |
| REFERENCE | Empleador anterior confirma: "resolvió quejas sin escalar innecesariamente" |
| DOCUMENT | Evaluaciones de desempeño previas con sección de servicio |

### COMP-TEC-001 Manejo de POS

| Tipo de evidencia | Qué buscaría |
|---|---|
| WORK_SAMPLE | Demostrar operación del POS en simulación |
| DOCUMENT | Certificación de capacitación POS específica |
| OBSERVATION | En turno de prueba, ¿registra transacciones sin errores recurrentes? |
| INTERVIEW_STAR | "Cuéntame de una vez que el POS falló en medio de un turno. ¿Qué hiciste?" |

## 6. Niveles de evidencia (reiteración A-06.1)

| Nivel | Significado |
|---|---|
| VALID | Evidencia clara, relevante, verificable; múltiples indicadores observados |
| LIMITED | Evidencia parcial; uno o dos indicadores |
| INSUFFICIENT | Evidencia presentada pero no aprovechable |
| PENDING_REVIEW | Conflicto entre fuentes |
| INVALID | Evidencia obtenida inválidamente |

## 7. Agregación por competencia

La evidencia se agrega **por competencia** (no globalmente):

```
CompetencyResult {
  candidateId: string
  competencyId: string
  jobId: string
  evidence: CompetencyEvidence[]
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  evidenceStatus: 'VALID' | 'LIMITED' | 'INSUFFICIENT' | 'PENDING_REVIEW' | 'INVALID'
  rationale: string
  indicatorsObserved: string[]
  indicatorsAbsent: string[]
  conflicts: string[]
  interviewerId: string
  reviewedBy: string?
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'APPROVED'
}
```

**Regla**: no se promedian niveles. Si hay conflicto entre fuentes, PENDING_REVIEW (ver `10-conflicts.md`).

## 8. Verificación cruzada

La evidencia de una fuente puede verificarse contra otra:
- CV dice "manejé POS 3 años" → entrevista STAR: "cuéntame una vez que el POS falló" → si no aporta ejemplo → CONFLICT (PENDING_REVIEW).
- Referencia laboral confirma entrevista → refuerza SUPPORTED.

## 9. Regla de no-automaticidad

La evidencia NO produce automáticamente un nivel. El nivel lo asigna el **evaluador humano** con `rationale` textual. La IA puede sugerir ("basado en la respuesta, parece SUPPORTED"), pero la asignación es humana.
