# A-05.3 — 07 · GENERADORES (PASO 8)

## 1. Cambio realizado

`src/lib/generate-templates.ts` — `generateTemplatesForPosition()` ya NO crea la plantilla PSICOMETRICA (Big Five) para nuevos positions de V1.

## 2. Antes

```typescript
// 1. Create PSICOMETRICA template (Big Five)
const psicoTemplate = await db.evaluationTemplate.create({
  data: { type: 'PSICOMETRICA', ... }
})
for (const q of BIG_FIVE_QUESTIONS) {
  await db.question.create({ data: { ... evaluationTemplateId: psicoTemplate.id } })
}
// 2. Create PSICOLOGICA template
...
```

## 3. Después

```typescript
// ── A-05.3: PSICOMETRICA (Big Five) template is NOT created for new V1 positions.
// Personality is NOT_IMPLEMENTED in V1 (A-05.2 OPTION E). The BIG_FIVE_QUESTIONS
// array is retained above as LEGACY/DEVELOPMENT_ONLY for reference and for
// serving existing positions that already have a PSICOMETRICA template.
// The canonical overall-score engine excludes BIG_FIVE with reason
// PERSONALITY_NOT_APPROVED_FOR_V1 regardless of whether data exists.
// ──

// 1. Create PSICOLOGICA template
...
```

El bloque de creación de PSICOMETRICA + 10 preguntas Big Five fue ELIMINADO del flujo de nuevos positions.

## 4. LEGACY retention

- `BIG_FIVE_QUESTIONS` array: **RETENIDO** (con comentario `LEGACY / DEVELOPMENT_ONLY`).
- Positions existentes con PSICOMETRICA template: **NO afectadas** — sus preguntas siguen disponibles (LEGACY).
- `HARDCODED_BIG_FIVE` en `public/apply/route.ts`: **RETENIDO** (fallback para legacy).

## 5. Bloqueo de publicación nueva (PASO 8)

> "Si se conserva el catálogo legacy: marcar explícitamente LEGACY y bloquear publicación nueva."

**Cumplido**:
- El array está marcado `LEGACY / DEVELOPMENT_ONLY`.
- La creación de template PSICOMETRICA está bloqueada (código eliminado del flujo).
- No hay forma de crear nuevos Big Five questions para nuevos positions.

## 6. Verificación (test PERS-01)

- PERS-01: `generate-templates.ts` does NOT contain `type: 'PSICOMETRICA'` → ✅.
- PERS-01b: `BIG_FIVE_QUESTIONS` retained as LEGACY reference → ✅.
