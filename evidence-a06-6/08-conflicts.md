# A-06.6 — 08 · Conflictos (PASO 10)

## 1. Regla

Probar: CV ≠ entrevista. Esperado: CONFLICT → PENDING_REVIEW. No elegir automáticamente una fuente.

## 2. Casos de conflicto probados

### Caso M-F (MESERO, Q-MES-ORG-001, Patrón F)

> **PILOTO + NO PRODUCTIVO**

| Fuente | Contenido |
|---|---|
| CV (sintético) | "Supervisé 15 personas en cocina." |
| Entrevista (sintética) | No describe conducta de supervisión (no asignó tareas, no dio feedback, no resolvió conflicto del equipo). |

| Elemento | Resultado |
|---|---|
| Registro | ConflictRecord creado |
| status | PENDING_REVIEW |
| ¿Se promedió? | ✗ NO |
| ¿Ganó una fuente? | ✗ NO |
| ¿Resolución automática? | ✗ NO |
| Resolución requerida | Humana (reviewer): solicitar verificación con referencia o segunda entrevista |

### Caso V-F (VENDEDOR, Q-VEN-TRV-002, Patrón F)

> **PILOTO + NO PRODUCTIVO**

| Fuente | Contenido |
|---|---|
| CV (sintético) | "Supervisé 15 empleados." |
| Entrevista (sintética) | No describe conducta de supervisión. |

| Elemento | Resultado |
|---|---|
| Registro | ConflictRecord creado |
| status | PENDING_REVIEW |
| ¿Se promedió? | ✗ NO |

## 3. Otros conflictos probados

### Caso M-E / V-E (Resultado sin conducta → verificación)

| Fuente | Contenido |
|---|---|
| Entrevista (sintética) | "Aumentamos eficiencia 30% ese año." (sin Action del candidato) |

| Elemento | Resultado |
|---|---|
| Registro | PENDING_REVIEW (verificación con referencia/documento requerida) |
| ¿Se aceptó como SUPPORTED? | ✗ NO |
| ¿Se convirtió en número? | ✗ NO |

## 4. Reglas verificadas

| Regla | ¿Cumplida en el piloto? |
|---|---|
| CONFLICT → PENDING_REVIEW (no resuelto automático) | ✓ SÍ |
| NO promediar fuentes | ✓ SÍ |
| NO "gana el más alto" | ✓ SÍ |
| NO "el CV siempre gana" | ✓ SÍ |
| NO "la IA decide" | ✓ SÍ |
| Resolución humana requerida | ✓ SÍ (simulada como pendiente) |
| No veto automático | ✓ SÍ |

## 5. Registro del ConflictRecord (simulado)

```
ConflictRecord (M-F) {
  conflictId: CONFLICT-M-F-001
  candidateId: MES-2 (sintético)
  competencyId: COMP-ORG-001
  jobId: position-mesero-001
  sources: [
    { source: 'CV', evidenceText: 'Supervisé 15 personas', evidenceLevel: 'SUPPORTED' (documental) },
    { source: 'INTERVIEW_STAR', evidenceText: 'No describe conducta de supervisión', evidenceLevel: 'INSUFFICIENT' }
  ]
  description: 'CV afirma supervisión; entrevista no demuestra conducta.'
  status: PENDING_REVIEW
  resolution: null (pendiente — resolución humana simulada como requerida)
  resolvedBy: null
}
```

## 6. Conclusión

Los conflictos CV vs entrevista se manejaron correctamente: CONFLICT → PENDING_REVIEW, sin promedio, sin selección automática, sin veto. La resolución queda **humanamente pendiente** (el piloto NO la resuelve — es simulación).
