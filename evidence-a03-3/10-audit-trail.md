# A-03.3 — PASO 10 (trazabilidad) · AUDIT TRAIL

## Cadena de auditoría de gobernanza (nueva)

A la cadena macro heredada (job→instrumento→administración→resultado de
A-02.3, y los 11 eslabones de A-03.1) A-03.3 añade los eslabones de
**gobernanza versionada**:

```
PUESTO → BLUEPRINT (v, status, autor/revisor/aprobador, excepción)
       → REQUIREMENT (dominio, fuente, rationale, importancia)
       → ITEM (itemId → itemVersions append-only: contenido exacto por versión)
       → CORRECTANSWER (clave por versión + fuente + rationale)
       → REVISIÓN/APROBACIÓN (reviewedBy/approvedBy registrados)
       → PUBLICACIÓN (assessmentVersion KA-vN, scoringVersion, publishedBy)
       → ADMINISTRACIÓN (KnowledgeAdministrationSnapshot congelado)
       → RESPUESTA (correctAnswerSnapshot + scoringOutcome + itemVersionSnapshot)
       → RESULTADO (knowledgeScore/status/reasonCode/scoringVersion)
```

## Registro append-only

| Evento | Registro | Ubicación |
|---|---|---|
| Creación de cadena de gobernanza | filas blueprint/requirement/assessment/versions con actores | DB (governance tables) |
| Creación de reactivo RH publicable con actor único | `AuditLog` CREATE + `governanceNote: EXCEPCION_REGISTRADA (DEMO)…` | AuditLog |
| Cambio metodológico de ítem (PASO 11/12) | `AuditLog` UPDATE con `a033Versioning`, `newItemVersion`, `changedFields`, `keyChanged`, estados RETIRED/DRAFT + nota de excepción DEMO | AuditLog |
| Intento de CANDIDATO de editar/eliminar | `logUnauthorizedAccess` (success=false) + 403 | AuditLog |
| Cambio de clave | `previousCorrectAnswer` + `correctAnswerChangedAt` en la fila del ítem | Question |
| Reemplazo de versión | `supersededByVersion` en la fila de versión antigua (RETIRED) | KnowledgeItemVersion |
| Administración congelada | snapshot 1:1 por sesión (sin `updatedAt`) | KnowledgeAdministrationSnapshot |

## Preguntas de auditoría respondibles hoy (antes: no)

1. ¿Qué dominios declaraba el blueprint cuando se evaluó X? → snapshot +
   blueprint versionado.
2. ¿Qué versión del ítem se administró? → `itemVersionSnapshot` +
   `KnowledgeItemVersion`.
3. ¿Qué clave se usó por respuesta? → `correctAnswerSnapshot` (A-03.2).
4. ¿Quién autor/revisor/aprobador de cada entidad? → columnas de tríada.
5. ¿Qué pasó cuando cambió la clave? → versión RETIRED con
   `supersededByVersion` + entrada AuditLog con `changedFields`.
6. ¿Qué assessmentVersion se administró y con qué scoringVersion? → snapshot +
   EvaluationResult.knowledgeScoringVersion.
7. ¿Quién intentó alterar gobernanza sin permiso? → AuditLog UNAUTHORIZED.

## Invariantes

- **Append-only**: `KnowledgeItemVersion` y `KnowledgeAdministrationSnapshot`
  no tienen ruta de UPDATE (la única escritura es el marcado RETIRED de la
  versión reemplazada, que forma parte del propio protocolo de reemplazo —
  nunca altera contenido).
- Sin secretos en logs: el snapshot no contiene claves; AuditLog no contiene
  valores de clave (solo índices de campos cambiados).
- Regeneración del Prisma Client y restart del dev server documentados como
  parte del runbook de la fase (fenómeno ya conocido de A-03.2).
