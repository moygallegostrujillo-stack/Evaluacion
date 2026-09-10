# A-03.4 — 05 · SECURITY (PASO 10) + IA (PASO 11)

## PASO 10 — Autoridades 100% servidor

Verificaciones implementadas en `POST /api/public/apply` (todas las branches:
data / answer / advance):

| Autoridad | Control | Test |
|---|---|---|
| assessmentVersion | campo en deny-list → 403 `MANIPULATION_REJECTED` antes de cualquier lookup/escritura | PUB-K9 ✅ |
| itemVersion | ídem | PUB-K10 ✅ |
| correctAnswer | ídem | PUB-K11 ✅ |
| blueprint | `blueprintVersion`/`knowledgeBlueprintVersion` en deny-list → 403 | SEC-a ✅ |
| scoringVersion | `scoringVersion`/`knowledgeScoringVersion` en deny-list → 403 | SEC-a ✅ |
| snapshots | `questionSnapshot`/`correctAnswerSnapshot`/`knowledgeAssessmentId`/`knowledgeVersioningStatus` en deny-list | SEC-a ✅ |

Deny-list centralizada: `KNOWLEDGE_CLIENT_DENYLIST`
(`src/lib/knowledge-versioning.ts`), aplicada en el entrypoint del POST.

Controles adicionales:

1. **Membership fail-closed:** en `step=answer` (VERSIONED), la respuesta debe
   referenciar un item de la administración congelada
   (`assessmentId + itemId`); un item externo → 403
   `ITEM_NOT_IN_ADMINISTRATION` (SEC-b ✅). Esto bloquea responder reactivos
   que el candidato no recibió (p.ej. items añadidos al banco después).
2. **Clave nunca viaja:** `GET step 4` sirve texto/opciones/versión pero
   jamás `correctAnswer`/snapshots (PUB-K14, deep scan del cuerpo JSON ✅).
   La clave solo existe en BD y en el scoring server-side.
3. **Tenencia:** se conservan los controles previos (token HMAC obligatorio en
   GET/answer/advance — VUL-H2; companyId derivado del registro padre).
4. **Logs de seguridad:** cada rechazo emite
   `[SECURITY][A-03.4] ...` (ver dev.log en la ejecución de tests).

## PASO 11 — La IA no tiene autoridad

Superficie IA existente: `POST /api/vacancies/[id]/generate-questions`
(solo escribe filas NUEVAS de `VacancyQuestion` — borrador de banco).

| Prohibición | Cumplimiento |
|---|---|
| Cambiar una assessment activa | No existe ruta de escritura IA hacia `KnowledgeAssessment*`; el route generate-questions no las toca |
| Cambiar versión | Las versiones solo las publica `SYSTEM:PUBLIC_APPLY_FREEZE` en el inicio de una administración |
| Cambiar clave | La clave del banco la edita un administrador autenticado (PUT questions, RLS); la clave congelada es inmutable |
| Cambiar snapshot | Sin ruta de escritura; FK Restrict; sin endpoint de mutación |
| Modificar administración existente | Administración ligada por id a su versión congelada; alta IA al banco solo genera versión nueva para NUEVos candidatos |

Verificación empírica: alta de pregunta simulando la vía IA/observada
(`PASO11`): assessment/clave/snapshot de A intactos; nuevo candidato recibe
KA-v3 (`PASO11-b`) — la IA nunca fue publicadora (`publishedBy =
SYSTEM:PUBLIC_APPLY_FREEZE` en todas las filas).

Nota heredada (fuera de alcance A-03.4): la salida IA entra directa al banco
sin estado DRAFT — eso corresponde al correctivo de publicación/rol de
A-03.3; A-03.4 garantiza que, aun así, nada de ello toca administraciones
congeladas.
