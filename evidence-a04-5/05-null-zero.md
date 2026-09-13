# A-04.5 — 05 · TRATAMIENTO DE NULL / 0 (PASO 5)

## 1. Regla

Eliminar ÚNICAMENTE del camino de overallScore las conversiones
`?? 0` / `|| 0` que convierten ausencia de evidencia en puntuación.

**No modificar** todos los `?? 0` del proyecto globalmente. Solo los relacionados
con la construcción del overallScore.

## 2. Conversión eliminada — `avgIntegrity = integrityScore || 0` (F3)

**Antes** (`public/apply/route.ts` L583):
```typescript
const avgIntegrity = application.integrityScore || 0
```
Esto convertía un `integrityScore` ausente (0 = default) en un 0 numérico que
luego se ponderaba en el overall.

**Después**: Integrity está aislada (nunca entra al overall). El motor canónico
recibe `integrityScore` y lo convierte a `null` si es 0 (ausente) dentro de
`buildCanonicalInput`:
```typescript
const integrityScoreOrNull =
  integrityScore !== null && Number.isFinite(integrityScore) && integrityScore > 0
    ? integrityScore
    : null  // ausencia → null → NO_DATA, nunca 0
```

## 3. Conversión eliminada — `correctAnswer ?? 0` (F2)

**Antes** (`public/apply/route.ts` L122):
```typescript
const correctIdx = resp.correctAnswer ?? 0  // opción 0 cuenta como correcta
```
Esto inflaba el score de conocimiento público tratando la opción 0 como
correcta cuando no había clave. Este bug estaba en el path de scoring por paso,
NO directamente en el overall, pero afectaba el `knowledgeScore` que alimenta el
overall.

**Estado**: el scoring por paso legacy (F2) sigue usando esta línea para
compatibilidad con sesiones pre-canónicas, pero el overall canónico usa el
`knowledgeScore` del motor canónico de Knowledge (que NO tiene este bug).
Cuando existe una administración canónica, el knowledgeScore se sobrescribe
con el valor canónico antes de computar el overall. El motor canónico de
overall nunca ve el `?? 0`.

## 4. Conversión NO tocada (legítima o fuera del camino overall)

| Sitio | Conversión | Por qué se conserva |
|---|---|---|
| `retention.ts` L209-229 | zeroing de anonimización | Legítimo (GDPR/LFPDPPP purge) |
| `consent/route.ts` L399-420 | reset de sensibles a 0 | Legítimo (retiro de consentimiento); overall queda STALE |
| `results/route.ts` L198 | `knowledgeScore || 0` en media | Fuera del path de cómputo (es lectura/display); NO afecta el overall persistido |
| Display `|| 0` en vistas | `bigFiveScores[X] || 0` | Display de dimensión, no afecta overall |
| `integrityScore: … : 0` en return F1 | default 0 para persistencia | El campo es NOT NULL @default(0); el motor canónico lo trata como null si 0 |

## 5. Null en el motor canónico

El motor recibe `score: number | null` por instrumento. La regla es:

- `null` → excluido con razón `NO_DATA` (nunca 0).
- `0` legítimo (e.g. knowledgeScore=0.00 por respuestas todas incorrectas):
  el motor trata `0` como dato presente SI `evidenceStatus` no es INSUFFICIENT.
  **Pero** en la práctica, el motor canónico de Knowledge produce `null` para
  INSUFFICIENT (no 0), y `Math.round((correct/keyed)*100)` que puede ser 0.00
  solo si todas las respuestas son incorrectas — en cuyo caso es evidencia
  VÁLIDA de bajo desempeño (no ausencia). El motor canónico de overall lo
  incluye como 0.00 válido.

  **Nota video (F4 legacy)**: el gate `hasKnowledge = !== null && > 0` trataba
  un 0.00 real como ausente. Esa divergencia fue ELIMINADA — el motor canónico
  usa `!== null` (un 0.00 real participa).

## 6. Verificación (tests OS-3, OS-4, CASO-B)

- **OS-4**: KN null → excluido con razón NO_DATA, overall=65 (sin KN).
- **CASO-B**: KN INSUFFICIENT (→ null en persistencia) → excluido, overall=65.

## 7. Resumen

| Conversión | Path overall | Acción A-04.5 |
|---|---|---|
| `integrityScore || 0` (F3) | Sí (alimentaba avgIntegrity) | ELIMINADA (Integrity aislada) |
| `correctAnswer ?? 0` (F2) | Indirecto (KN score) | Neutralizada (canonical KN sobrescribe) |
| `?? 0` en ausencia de clave | Sí (KN) | ELIMINADA del path (canonical produce null) |
| `|| 0` en display/lectura | No (no afecta overall) | Conservada (legítima) |
| retention/consent zeroing | No (post-scoring) | Conservada (legal) |
