# A-03.4 — 02 · PUBLIC VERSION FREEZE (PASO 2 + PASO 4)

**Regla de congelamiento implementada en el flujo de vacantes públicas.**

## 1. Regla (qué se guarda al iniciar)

En `POST /api/public/apply` `step=data`, en la MISMA transacción que crea la
`VacancyApplication`, el servidor resuelve UNA sola vez la versión activa del
conocimiento y congela en la fila de la aplicación:

| Campo congelado | Fuente | Evidencia de schema |
|---|---|---|
| `knowledgeAssessmentId` | `KnowledgeAssessment.id` de la administración | `VacancyApplication.knowledgeAssessmentId` |
| `assessmentVersion` | `KnowledgeAssessment.version` (KA-v{n}) | `VacancyApplication.knowledgeAssessmentVersion` |
| `blueprintVersion` | `BP-v{n}` co-versionado con la administración | `VacancyApplication.knowledgeBlueprintVersion` |
| `scoringVersion` | `PUB-KS-v1` (reglas de scoring congeladas) | `VacancyApplication.knowledgeScoringVersion` |
| `knowledgeFrozenAt` | timestamp del congelamiento | `VacancyApplication.knowledgeFrozenAt` |
| lista exacta itemId+itemVersion | `KnowledgeAssessmentItem[]` (snapshots) | `KnowledgeAssessmentItem` |
| `knowledgeVersioningStatus` | `VERSIONED` / `NOT_APPLICABLE` | `VacancyApplication.knowledgeVersioningStatus` |

## 2. Resolución UNA sola vez (PASO 4)

- `step=data` → `publishAssessmentForBank(tx, vacancy)`:
  - Calcula el banco administrado (`resolveKnowledgeBank`): preguntas de la
    vacante; fallback template CONOCIMIENTOS (misma precedencia histórica).
  - Hash canónico del banco (`SHA-256` de [itemId, texto, opciones, clave, orden]).
  - Si el hash coincide con la última versión → **reutiliza** (1 sola resolución).
  - Si cambió (o no existe) → **publica KA-v{n+1}**: retira ACTIVE anterior
    (status RETIRED + retiredAt), crea la nueva con items congelados.
- `answer` y `advance` **NUNCA** re-consultan "el assessment actualmente ACTIVE":
  - `answer` (CONOCIMIENTOS, VERSIONED): busca el item **por assessmentId
    congelado** (no por status) y escribe los snapshots server-side.
  - `GET` step 4 (VERSIONED): sirve las preguntas DESDE `questionSnapshot`.
  - `advance` completedStep=4 (VERSIONED): califica DESDE
    `correctAnswerSnapshot` de los items congelados (`scoreKnowledgeFromFrozenAdministration`).

## 3. Publicación de versión (semántica)

- **Autoridad publicadora:** `SYSTEM:PUBLIC_APPLY_FREEZE` (servidor). La
  edición del banco por parte del administrador (PUT /api/vacancies/[id]/questions,
  alta de preguntas, incluida la vía IA) es el evento que hace que el
  **próximo** inicio publique la versión nueva. La administración ya congelada
  no se enteran: sigue ligada por `knowledgeAssessmentId`.
- **Inmutabilidad:** ninguna fila `KnowledgeAssessment*` se modifica después de
  crearse, salvo la transición de ciclo ACTIVE→RETIRED de la versión
  reemplazada. FK `Restrict`: una versión con administraciones congeladas no
  puede borrarse.
- **Blueprint co-versionado:** en el flujo público el blueprint del
  conocimiento se materializa como el conjunto ordenado de items congelados de
  la administración; `blueprintVersion = BP-v{version}` 1:1 con
  `assessmentVersion` (limitación documentada en 00-master-dossier §9: las entidades
  completas Blueprint/Requirement de A-03.3 no existen en este código base).

## 4. Semántica de itemVersion (PASO 6/7)

Al publicar v(n+1), cada item compara su contenido (texto+opciones+clave)
contra la generación congelada anterior:
- contenido igual → conserva `itemVersion` anterior;
- contenido distinto (pregunta, opciones o clave) → `itemVersion + 1`;
- item nuevo → `itemVersion = 1`;
- item quitado del banco → simplemente no entra a la nueva versión
  (la versión anterior conserva el suyo).

Verificado en `04-version-change-tests.md` (PASO6-a/PASO6-b).

## 5. Fail-closed (PASO 8)

`freezeKnowledgeForApplication` corre dentro de `db.$transaction` junto con el
`create`. Cualquier fallo de determinación de versión (banco corrupto, error de
persistencia) lanza `KnowledgeVersioningError` → HTTP 500
`{ code: 'CONFIGURATION_ERROR' | 'INTERNAL_ERROR' }` y **rollback**: no existe
evaluación parcialmente versionada. Detalle y prueba: PUB-K12.

## 6. Código

- `src/lib/knowledge-versioning.ts` (nuevo): resolución de banco, hash,
  publicación, congelamiento, scoring congelado, deny-list.
- `src/app/api/public/apply/route.ts`: step=data (freeze transaccional),
  GET step 4 (servir congelado), answer (bind a administración),
  advance step 4 (scoring congelado).
