# A-06.1 — Conflict Rules (PASO 10)

## 1. Regla

Cuando hay conflicto entre fuentes de evidencia, **NO** se promedia, **NO** "gana" automáticamente una fuente. Se registra el conflicto como `PENDING_REVIEW`.

## 2. Ejemplo típico

> **Escenario**: CV del candidato dice "5 años de experiencia en atención al cliente". La entrevista estructurada no logra que el candidato aporte un ejemplo concreto de conducta de "Servicio al cliente".

**NO**: promediar (CV alto + entrevista baja = medio).  
**NO**: el CV "gana" automáticamente (es documental, no conductual).  
**SÍ**: registrar `PENDING_REVIEW` con justificación textual.

## 3. Tipos de conflicto

| Tipo | Descripción | Resolución |
|---|---|---|
| CV vs Entrevista | Documentación afirma experiencia; entrevista no demuestra conducta | PENDING_REVIEW |
| Entrevista vs Referencia | Entrevista positiva; referencia negativa (o viceversa) | PENDING_REVIEW |
| Indicadores contradictorios | Algunos indicadores SUPPORTED, otros NO_EVIDENCE en la misma competencia | LIMITED (con nota de conflicto) |
| Entrevistador vs Entrevistador | Dos entrevistadores asignan niveles distintos | PENDING_REVIEW + calibración |
| Auto-reporte vs Conducta | Cuestionario dice "proactivo"; entrevista no demuestra iniciativa | PENDING_REVIEW (auto-reporte menos fiable) |

## 4. Estructura del conflicto

```
ConflictRecord {
  conflictId: string
  candidateId: string
  competencyId: string
  sources: { source: string, evidenceLevel: string, evidenceText: string }[]
  description: string           // descripción textual del conflicto
  status: 'PENDING_REVIEW' | 'RESOLVED'
  resolution?: string          // cómo se resolvió (humano)
  resolvedBy?: string          // humano
  resolvedAt?: timestamp
}
```

## 5. Reglas de resolución

1. **PENDING_REVIEW** es el estado inicial de todo conflicto.
2. La resolución es **humana** (un reviewer o panel).
3. La resolución NO convierte automáticamente el conflicto en un número.
4. El reviewer puede:
   - confirmar `LIMITED` (con nota de conflicto);
   - solicitar nueva entrevista;
   - solicitar verificación documental adicional;
   - marcar `INVALID` si una fuente es inválida.
5. La resolución se documenta en `resolution` + `resolvedBy`.

## 6. NO regla de "gana el más alto"

**Prohibido**: "la fuente con evidencia más alta gana automáticamente". Esta regla introduciría sesgo hacia la fuente más optimista (generalmente auto-reporte o CV, ambos menos fiables que conducta observada).

## 7. NO regla de "promedio"

**Prohibido**: promediar niveles cualitativos. Los niveles (NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG) NO son números; no se promedian.

## 8. Conexión con CompetencyResult

Cuando hay conflicto, el `CompetencyResult.evidenceStatus` se asigna `PENDING_REVIEW` y `CompetencyResult.conflicts` lista los IDs de los ConflictRecords. El `evidenceLevel` puede quedar temporalmente como `LIMITED` (con nota) hasta resolución.

## 9. Revisión humana

Todo conflicto PENDING_REVIEW requiere revisión humana antes de que el CompetencyResult pase a `APPROVED`. Sin resolución, el resultado queda en `PENDING_REVIEW` (no se usa para decisión automática, pero está disponible para RR.HH. con la advertencia de conflicto).
