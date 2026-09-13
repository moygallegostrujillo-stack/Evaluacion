# A-06.3 — 10 · Contradicciones / Conflictos (PASO 12)

## 1. Regla

> **NO promediar. NO elegir automáticamente una fuente. Registrar: CONFLICT → PENDING_REVIEW.**

## 2. Ejemplo típico

> **CV**: "Supervisé 15 personas por 2 años."
>
> **Entrevista**: El candidato no describe ninguna conducta de supervisión (no explica cómo asignó tareas, cómo dio feedback, cómo resolvió un conflicto del equipo).

**NO**: promediar (CV alto + entrevista baja = medio).
**NO**: el CV "gana" automáticamente (documental, no conductual).
**SÍ**: registrar CONFLICT → `evidenceStatus = PENDING_REVIEW`.

## 3. Estructura del conflicto

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
| Entrevista vs Referencia | Entrevista positiva; referencia negativa | PENDING_REVIEW |
| Indicadores contradictorios | Algunos SUPPORTED, otros NO_EVIDENCE en la misma competencia | LIMITED (con nota de conflicto) |
| Entrevistador vs Entrevistador | Dos evaluadores asignan niveles distintos | PENDING_REVIEW + calibración |
| Auto-reporte vs Conducta | Cuestionario dice "proactivo"; entrevista no demuestra | PENDING_REVIEW |
| Resultado externo vs Action | "Aumenté ventas 20%" pero no describe cómo | PENDING_REVIEW |

## 5. Reglas de resolución

1. **PENDING_REVIEW** es el estado inicial de todo conflicto.
2. La resolución es **humana** (reviewer o panel).
3. La resolución NO convierte automáticamente en número.
4. El reviewer puede:
   - confirmar `LIMITED` (con nota de conflicto);
   - solicitar nueva entrevista (segunda sesión);
   - solicitar verificación documental adicional (referencia, certificación);
   - marcar `INVALID` si una fuente es inválida.
5. La resolución se documenta en `resolution` + `resolvedBy`.

## 6. NO reglas prohibidas

| Regla prohibida | Por qué |
|---|---|
| "La fuente más alta gana" | Sesgo hacia fuentes optimistas (CV, auto-reporte) |
| "Promedio de niveles" | Los niveles cualitativos no se promedian |
| "CV siempre gana" | Documental ≠ conductual; la conducta pasada predice mejor |
| "La IA decide" | La resolución es humana; IA puede sugerir, no decidir |

## 7. Conexión con CompetencyResult

Cuando hay conflicto:
- `CompetencyResult.evidenceStatus = PENDING_REVIEW`
- `CompetencyResult.conflicts = [conflictId1, ...]`
- `CompetencyResult.evidenceLevel` puede quedar temporalmente como `LIMITED` (con nota) o `INSUFFICIENT` hasta resolución.

## 8. SLA de resolución

Todo conflicto PENDING_REVIEW requiere resolución antes de que el CompetencyResult pase a APPROVED. Sin resolución, el resultado queda en PENDING_REVIEW y no se usa para decisión automática (aunque está disponible para RR.HH. con advertencia de conflicto).

## 9. Ejemplo de resolución — EJEMPLO — NO PRODUCTIVO

> **Conflicto**: CV dice "5 años de experiencia en POS"; entrevista no demuestra operación del POS.
>
> **Resolución humana**: el reviewer solicita verificación de referencia. La referencia confirma operación básica de POS pero no resolución de incidencias.
>
> **Veredicto**: `evidenceLevel = LIMITED` (operación básica confirmada, resolución de incidencias INSUFFICIENT). `resolution = "Referencia verifica operación básica; entrevista no demuestra resolución de incidencias. LIMITED con nota."` `resolvedBy = <humano>`.

## 10. No veto automático

Un conflicto PENDING_REVIEW **no descalifica automáticamente** al candidato. La decisión es humana, considerando múltiples fuentes.
