# A-06.2 — 10 · Conflictos (PASO 12)

## 1. Regla

> **NO promediar. NO elegir automáticamente uno. Registrar: CONFLICT.**

## 2. Ejemplo típico

> **CV**: "Lideré un equipo de 15 personas por 2 años."
>
> **Entrevista**: El candidato no aporta ninguna conducta verificable de liderazgo (no describe cómo asignó tareas, cómo dio feedback, cómo resolvió un conflicto interno del equipo).

**NO**: promediar (CV alto + entrevista baja = medio).  
**NO**: el CV "gana" automáticamente (es documental, no conductual).  
**SÍ**: registrar CONFLICT → `evidenceStatus = PENDING_REVIEW`.

## 3. Estructura del conflicto

```
ConflictRecord {
  conflictId: string
  candidateId: string
  competencyId: string
  jobId: string
  sources: [
    { source: 'CV', evidenceText: 'Lideré equipo de 15 personas', evidenceLevel: 'SUPPORTED' (documental) },
    { source: 'INTERVIEW_STAR', evidenceText: 'No aporta conducta de liderazgo', evidenceLevel: 'INSUFFICIENT' }
  ]
  description: string           // descripción del conflicto
  status: 'PENDING_REVIEW' | 'RESOLVED'
  resolution?: string          // cómo se resolvió (humano)
  resolvedBy?: string          // humano
  resolvedAt?: timestamp
}
```

## 4. Tipos de conflicto

| Tipo | Ejemplo | Resolución |
|---|---|---|
| CV vs Entrevista | CV afirma experiencia; entrevista no demuestra conducta | PENDING_REVIEW |
| Entrevista vs Referencia | Entrevista positiva; referencia negativa (o viceversa) | PENDING_REVIEW |
| Indicadores contradictorios | Algunos indicadores SUPPORTED, otros NO_EVIDENCE en la misma competencia | LIMITED (con nota) |
| Entrevistador vs Entrevistador | Dos evaluadores asignan niveles distintos | PENDING_REVIEW + calibración |
| Auto-reporte vs Conducta | Cuestionario dice "proactivo"; entrevista no demuestra iniciativa | PENDING_REVIEW |

## 5. Reglas de resolución

1. **PENDING_REVIEW** es el estado inicial de todo conflicto.
2. La resolución es **humana** (un reviewer o panel).
3. La resolución NO convierte automáticamente en un número.
4. El reviewer puede:
   - confirmar `LIMITED` (con nota de conflicto);
   - solicitar nueva entrevista (segunda sesión);
   - solicitar verificación documental adicional (referencia, certificación);
   - marcar `INVALID` si una fuente es inválida (e.g. referencia no verificable).
5. La resolución se documenta en `resolution` + `resolvedBy`.

## 6. NO reglas prohibidas

| Regla prohibida | Por qué |
|---|---|
| "La fuente más alta gana" | Introduce sesgo hacia fuentes optimistas (CV, auto-reporte) |
| "Promedio de niveles" | Los niveles cualitativos no se promedian; no son números |
| "CV siempre gana sobre entrevista" | El CV es documental, no conductual; la conducta pasada predice mejor |
| "La IA decide" | La resolución es humana; la IA puede sugerir, no decidir |

## 7. Conexión con CompetencyResult

Cuando hay conflicto:
- `CompetencyResult.evidenceStatus = PENDING_REVIEW`
- `CompetencyResult.conflicts = [conflictId1, ...]`
- `CompetencyResult.evidenceLevel` puede quedar temporalmente como `LIMITED` (con nota) o `INSUFFICIENT` hasta resolución.

## 8. SLA de resolución

Todo conflicto PENDING_REVIEW requiere resolución antes de que el CompetencyResult pase a APPROVED. Sin resolución, el resultado queda en PENDING_REVIEW y no se usa para decisión automática (aunque está disponible para RR.HH. con la advertencia de conflicto).

## 9. Ejemplo de resolución (EJEMPLO — NO PRODUCTIVO)

> **Conflicto**: CV dice "5 años de experiencia en POS"; entrevista no demuestra operación del POS.
>
> **Resolución humana**: el reviewer solicita una verificación de referencia. La referencia confirma operación básica de POS pero no resolución de incidencias.
>
> **Veredicto**: `evidenceLevel = LIMITED` (operación básica confirmada, resolución de incidencias INSUFFICIENT). `resolution = "Referencia verifica operación básica; entrevista no demuestra resolución de incidencias. Nivel LIMITED con nota."` `resolvedBy = <humano>`.

## 10. No veto automático

Un conflicto PENDING_REVIEW **no descalifica automáticamente** al candidato. La decisión es humana, considerando múltiples fuentes. El conflicto es una señal de que se requiere revisión adicional, no un veto.
