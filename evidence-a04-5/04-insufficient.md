# A-04.5 — 04 · TRATAMIENTO DE INSUFFICIENT (PASO 4)

## 1. Regla

Un instrumento cuyo estado de evidencia sea:

- `INSUFFICIENT`
- `INVALID`
- `PENDING_REVIEW`
- `NOT_APPROVED`

**NO puede convertirse en 0.** Tampoco puede ser tratado como evidencia válida.

## 2. Implementación

En `src/lib/overall-score.ts`:

```typescript
const EXCLUDED_EVIDENCE_STATUSES: ReadonlySet<string> = new Set([
  'INSUFFICIENT', 'INVALID', 'PENDING_REVIEW', 'NOT_APPROVED',
])

function getExclusionReason(inst: InstrumentInput): ExclusionReason | null {
  // ...
  if (inst.score === null || !Number.isFinite(inst.score)) return 'NO_DATA'
  if (inst.evidenceStatus && EXCLUDED_EVIDENCE_STATUSES.has(inst.evidenceStatus)) {
    return inst.evidenceStatus as ExclusionReason  // EXCLUIDO, no 0
  }
  return null  // INCLUIDO
}
```

Un instrumento excluido por evidencia:
- NO recibe peso en la fórmula.
- NO se convierte a 0 (no arrastra el overall hacia abajo).
- Se registra en `excludedSections` con la razón exacta (INSUFFICIENT/INVALID/...).
- La renormalización se aplica solo sobre los incluidos.

## 3. Origen de los estados de evidencia

Hoy, el único instrumento con un motor de evidencia formal es **Knowledge
canónico** (`src/lib/knowledge-canonical.ts`):

```typescript
// scoreCanonicalAdministration L827-839
if (keyedAnswered === 0) {
  knowledgeScore = null            // INSUFFICIENT → null (nunca 0)
  evidenceStatus = 'INSUFFICIENT'
  reasonCode = totalKeyedItems === 0 ? 'KNOWLEDGE_KEY_MISSING' : 'NO_KEYED_EVIDENCE'
}
```

Big Five, Psicológica e Integridad NO tienen motor de evidencia formal
(`evidenceStatus = null`). Integridad se excluye incondicionalmente por
gobernanza (ver 03-integrity-isolation.md).

## 4. Cómo llega el evidenceStatus al motor canónico

- **evaluations/route.ts**: tras `scoreCanonicalAdministration`, se llama
  `buildCanonicalInput(..., canonicalKnowledge.evidenceStatus, ...)`.
- **public/apply/route.ts** (F3): se busca `knowledgeAdministration.knowledgeResult`
  y se pasa su `evidenceStatus`.
- **public/video/route.ts**: igual que F3.

## 5. Caso: Knowledge INSUFFICIENT

Un candidato respondió el test de conocimientos pero no hay ítems con clave
válida (todas `hasKey=false`). El motor canónico produce `knowledgeScore=null`
+ `evidenceStatus='INSUFFICIENT'`. El motor canónico de overall:

- Excluye KNOWLEDGE (razón INSUFFICIENT).
- Renormaliza sobre los restantes (BF+PSY si están presentes).
- NO convierte el conocimiento insuficiente en 0.

## 6. Verificación (tests OS-3, OS-5, OS-6, CASO-B)

- **OS-3**: KN INSUFFICIENT → excluido, razón INSUFFICIENT, overall=65 (BF70+PSY60 split).
- **OS-5**: KN INVALID → excluido, razón INVALID.
- **OS-6**: KN PENDING_REVIEW → excluido, razón PENDING_REVIEW.
- **CASO-B**: BF70+PSY60+KN(INSUFFICIENT)+INT(excluded) → overall=65,
  includedSections=[BF,PSY], guidance=PERFIL_PARCIAL.

## 7. Regla temporal de gobernanza (A-04.4 PASO 17 — ahora implementada)

> "No-evidencia, no-decisión-global": un instrumento INSUFFICIENT / INVALID /
> PENDING_REVIEW / NOT_APPROVED no alimenta decisiones globales.

A-04.4 la propuso sin implementar. A-04.5 la **implementa** en el motor canónico
de overallScore. Aplica a las 4 rutas (ahora 1 motor).
