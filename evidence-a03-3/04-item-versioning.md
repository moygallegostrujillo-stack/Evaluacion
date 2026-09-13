# A-03.3 — PASO 6/11/12/13 · ITEM VERSIONING (APPEND-ONLY)

## PASO 6 — Campos de versión del ítem

Cada `KnowledgeItemVersion` (tabla append-only) registra:

| Campo encargo | Columna |
|---|---|
| itemId | `questionId` (FK → Question, `@@unique([questionId, itemVersion])`) |
| itemVersion | `itemVersion` Int |
| question | `question` (texto congelado de ESA versión) |
| options | `options` (JSON congelado) |
| correctAnswer | `correctAnswer` (clave congelada) |
| source | `correctAnswerSource` |
| rationale | `correctAnswerRationale` |
| difficulty | `difficulty` (EASY/MEDIUM/HARD/UNKNOWN) |
| status | `status` (ciclo de vida DE ESA versión) |
| reviewedBy | `reviewedBy` |
| approvedBy | `approvedBy` |
| (trazabilidad) | `origin`, `changeReason`, `supersededByVersion`, `createdAt`, `companyId` |

`Question` = **puntero a la versión vigente** (`itemVersion` + contenido
actual); `KnowledgeItemVersion` = historial inmutable. Nada sobrescribe una
fila de versión.

## PASO 11 — Cambio de clave (regla implementada)

`decideKeyChange(currentItemVersion, previousKey)` + `applyMethodologicalItemChange`
(governance-service.ts), disparado por `PUT /api/questions` cuando un reactivo
de conocimiento cambia contenido:

1. **NUNCA se modifica la versión antigua.**
2. Se crea una NUEVA `itemVersion` (incremento mayor).
3. La versión antigua pasa a `RETIRED` con `supersededByVersion = nueva`
   — RETIRED **solo para nuevas administraciones** (el conjunto que se sirve
   sigue siendo el de la plantilla; la versión RETIRED ya no representa el
   ítem vigente).
4. Los resultados históricos permanecen vinculados a la versión anterior:
   - `EvaluationResponse.correctAnswerSnapshot` (A-03.2) + **nuevo**
     `EvaluationResponse.itemVersionSnapshot` (A-03.3) congelan qué clave y
     qué versión se calificaron;
   - `rescoreFromFrozenSnapshot` re-deriva desde el snapshot, jamás desde la
     clave vigente (T11).
5. La fila del ítem registra `previousCorrectAnswer` + `correctAnswerChangedAt`
   + auditoría append-only (`AuditLog.details.a033Versioning`).
6. La nueva versión nace `DRAFT` (requiere re-revisión — la revisión previa no
   cubre contenido nuevo; ver limitación L-4).

Backfill honesto para ítems legacy que cambian por primera vez: se registra la
versión previa con `changeReason = INITIAL_REGISTRATION_BACKFILL` — captura el
contenido REAL previo al cambio con fecha honesta de registro (no inventa
metadata de administración; PASO 16).

## PASO 12 — Cambio de pregunta (regla conservadora)

`requiresNewItemVersion(prev, next)`:

- Cambia **cualquiera** de `question` / `options` / `correctAnswer` /
  `correctAnswerSource` / `correctAnswerRationale` ⇒ **nueva itemVersion
  obligatoria** (cualquiera de estos campos puede afectar el significado o el
  scoring — regla conservadora del encargo).
- `changeReason` = `KEY_CHANGE` (si cambió la clave) o `CONTENT_CHANGE`.
- La operación del PUT devuelve `changedFields` y la API la expone en
  `a033Versioning` + la registra en auditoría.

## PASO 13 — Dificultad

- `Question.difficulty` y `KnowledgeItemVersion.difficulty`:
  `EASY | MEDIUM | HARD | UNKNOWN`.
- Por defecto **UNKNOWN** — no se inventa (KD-1 heredado; el generador crea
  todos los ítems del sistema con UNKNOWN).
- La dificultad NO se usa como peso automático: `scoring.ts` sigue sin leerla
  (CORRECT_OVER_TOTAL puro — P4/P5 intactos).
- La dificultad NO dispara nueva versión (`requiresNewItemVersion` la excluye):
  es metadato sin efecto en significado ni scoring (KD-5).

## Evidencia E2E (run real, scripts/a033-e2e-governance.ts)

```
[E4] Reactivo RH creado: status=ACTIVE requirement=ligado createdBy=<user> difficulty=UNKNOWN
[E4] Cambio de clave: v1=[RETIRED] v2=[DRAFT/KEY_CHANGE] newItemVersion=2 audit=SÍ
[E4] Histórico intacto: result=true snapshot=true
```

## Tests

- T10: nueva clave ⇒ v2 (KEY_CHANGE), v1 RETIRED con contenido intacto,
  `previousCorrectAnswer` registrado, puntero en DRAFT.
- T11: reconstrucción histórica desde snapshot (clave v1 ⇒ CORRECT aunque la
  clave vigente sea otra); la fila v1 no mutó.
- T12: el snapshot de administración no cambia cuando el banco evoluciona.
