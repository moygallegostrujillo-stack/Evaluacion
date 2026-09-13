# A-06.4 — 12 · Conflictos (PASO 12)

## 1. Regla

> **No automatizar la resolución.** Los conflictos se resuelven por revisión humana.

## 2. Tipos de conflicto

| Tipo | Descripción | Estado resultante |
|---|---|---|
| CV vs entrevista | CV afirma experiencia/conducta; entrevista no la demuestra | PENDING_REVIEW |
| Referencia vs entrevista | Referencia laboral confirma/desmiente entrevista | PENDING_REVIEW |
| Respuesta contradictoria | El candidato dice X en una pregunta y no-X en otra | PENDING_REVIEW |
| Evidencia insuficiente | Respuesta vaga, hipotética, sin Action | INSUFFICIENT (no conflicto, pero puede escalar si hay CV contradictorio) |
| Evidencia no verificable | El candidato afirma algo que no se puede verificar (e.g. "aumenté ventas 50%") | PENDING_REVIEW (hasta verificar con referencia) |

## 3. Manejo

### 3.1 CV vs entrevista

**Ejemplo**:
> CV: "Supervisé 15 personas por 2 años."
> Entrevista: el candidato no describe conducta de supervisión.

**No**: promediar (CV alto + entrevista baja = medio).
**No**: el CV "gana" automáticamente (documental, no conductual).
**Sí**: registrar CONFLICT → `evidenceStatus = PENDING_REVIEW`.

### 3.2 Referencia vs entrevista

**Ejemplo**:
> Entrevista: SUPPORTED (ejemplo claro de liderazgo).
> Referencia: "no mostró iniciativa de liderazgo en su puesto."

**No**: la entrevista "gana" (puede ser más reciente).
**No**: la referencia "gana" (puede ser sesgada).
**Sí**: CONFLICT → PENDING_REVIEW; reviewer humano decide con justificación.

### 3.3 Respuesta contradictoria

**Ejemplo**:
> Pregunta 1: "Cuéntame de una vez que lideraste un equipo." → Respuesta: describe liderazgo claro.
> Pregunta 2: "Describe una vez que evitaste liderar." → Respuesta: "siempre me gusta liderar."

**No**: ignorar la contradicción.
**Sí**: CONFLICT → PENDING_REVIEW; el reviewer nota la inconsistencia; puede solicitar segunda entrevista.

### 3.4 Evidencia insuficiente

**No es conflicto**; es un nivel. Se asigna `evidenceLevel = INSUFFICIENT` con rationale. Si hay CV que afirma lo contrario → escala a CONFLICT.

### 3.5 Evidencia no verificable

**Ejemplo**:
> Candidato: "Aumenté las ventas 50% en mi puesto anterior."
> Sin detalle de cómo; sin acceso a métricas.

**No**: aceptar la afirmación como SUPPORTED.
**No**: rechazar como INSUFFICIENT sin verificar.
**Sí**: CONFLICT → PENDING_REVIEW; solicitar verificación con referencia o documento.

## 4. Reglas de resolución

1. **PENDING_REVIEW** es el estado inicial de todo conflicto.
2. La resolución es **humana** (reviewer o panel).
3. La resolución NO convierte en número.
4. El reviewer puede:
   - confirmar `LIMITED` (con nota de conflicto);
   - solicitar nueva entrevista;
   - solicitar verificación documental adicional (referencia, certificación);
   - marcar `INVALID` si una fuente es inválida.
5. La resolución se documenta en `resolution` + `resolvedBy`.

## 5. Prohibiciones

| Regla prohibida | Por qué |
|---|---|
| "La fuente más alta gana" | Sesgo hacia fuentes optimistas (CV, auto-reporte) |
| "Promedio de niveles" | Los niveles cualitativos no se promedian |
| "CV siempre gana" | Documental ≠ conductual |
| "IA decide" | Resolución humana obligatoria |
| "Automáticamente INVALID" | La invalidación requiere justificación humana |

## 6. Estructura del conflicto

```
ConflictRecord {
  conflictId: string
  candidateId: string
  competencyId: string
  jobId: string
  sources: [
    { source: 'CV', evidenceText: '...', evidenceLevel: 'SUPPORTED' (documental) },
    { source: 'INTERVIEW_STAR', evidenceText: '...', evidenceLevel: 'INSUFFICIENT' }
  ]
  description: string
  status: 'PENDING_REVIEW' | 'RESOLVED'
  resolution?: string
  resolvedBy?: string
  resolvedAt?: timestamp
}
```

## 7. No veto automático

Un conflicto PENDING_REVIEW **no descalifica automáticamente** al candidato. La decisión es humana, considerando múltiples fuentes.

## 8. Conexión con gates

El manejo de conflictos pasa LEGAL-G7 (Decisión humana). Sin resolución humana documentada, el CompetencyResult no pasa a APPROVED.
