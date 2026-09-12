# A-03.5 — PASO 12: LEGACY
## Clasificación LEGACY / KA-V1+ / UNKNOWN — sin migración, sin recálculo

## Función canónica (src/lib/knowledge-canonical.ts)

```ts
classifyKnowledgeGeneration(row): 'LEGACY' | 'KA-V1+' | 'UNKNOWN'
```

| Clasificación | Criterio | Significado |
|---|---|---|
| **LEGACY** | Sin campos de versionado (pre-A-03.4) | Se mantiene LEGACY para siempre; completa por su ruta histórica; NUNCA re-interpretada ni migrada |
| **KA-V1+** | Administración/versionado congelado presente (A-03.4 o A-03.5) | Reconstruible por su cadena congelada |
| **UNKNOWN** | Estado contradictorio (p.ej. status=VERSIONED sin assessment; o freeze parcial sin status) | Señal de corrupción — visible, no silenciada; jamás se "arregla" automáticamente |

Verificado: LEG-1 (LEGACY), LEG-2 (KA-V1+ para filas A-03.4), LEG-3
(VERSIONED sin assessment ⇒ UNKNOWN), LEG-4 (sesión interna sin
administración ⇒ LEGACY pre-canónico).

## Sub-clasificación documentada (sin cambio de datos)

Dentro de KA-V1+ existen dos generaciones estructurales:

1. **KA-V1+ PRE-CANONICAL (A-03.4)**: `KnowledgeAssessment.blueprintId = null`
   e items sin `requirementId/itemVersionId`. Sus snapshots y resultados son
   intocables. Si el banco no cambió, la siguiente administración pública
   publica una versión canónica nueva con el MISMO contenido
   (`publishSource = SYSTEM_ON_CANONICAL_MIGRATION`) — el histórico queda como está.
2. **KA-V1+ CANONICAL (A-03.5)**: cadena completa Blueprint→Requirement→ItemVersion.

## Garantías de no-toque (verificadas)

- REG-6: snapshot antes/después de TODA la suite — las filas pre-A-03.4
  (LEGACY y assessments históricos) quedan **byte-idénticas**.
- Sin backfills, sin recalculo de knowledgeScore, sin re-etiquetado.
- La migración canónica solo añade filas NUEVAS (jamás actualiza históricos).
