# A-03.3 — PASO 8 · SEPARACIÓN DE FUNCIONES

## Problema eliminado

A-03.1/A-03.2 documentaban el riesgo: `autor = revisor = aprobador`. A-03.3 lo
elimina **conceptualmente y en datos**:

- Toda entidad de gobernanza (blueprint, requirement, assessment) y todo
  reactivo registran **createdBy / reviewedBy / approvedBy**.
- `Question.createdBy` (nuevo) completa la tríada en los reactivos.
- `checkGovernanceSeparation({createdBy, reviewedBy, approvedBy, governanceNote})`
  (módulo puro) verifica:
  - **GSEP-1_ACTORS_INCOMPLETE** — los tres actores deben estar registrados.
  - **GSEP-2_SAME_ACTOR_WITHOUT_REGISTERED_EXCEPTION** — autor = revisor =
    aprobador SOLO si existe una excepción de política registrada
    (`governanceNote` que contenga `EXCEPCION_REGISTRADA`).

## Excepción registrada (única, expresa)

El banco cerrado del sistema (SYSTEM_BANK) fue elaborado, revisado y aprobado
por la gobernanza humana documental de las fases A-03.1/A-03.2 (actor
`A-03.2-GOVERNANCE`, sin participación de IA). La política permite ese actor
único **por ser contenido de banco cerrado ya revisado**, y la excepción se
registra:

- En datos: `KnowledgeBlueprint.governanceNote =
  'EXCEPCION_REGISTRADA (politica A-03.3 PASO 8): banco cerrado del sistema
  elaborado y revisado por la gobernanza humana documental A-03.1/A-03.2;
  autor=revisor=aprobador (A-03.2-GOVERNANCE) permitido por politica expresa
  para contenido SYSTEM_BANK sin participacion de IA. Items creados por RH NO
  heredan esta excepcion.'`
- En el módulo: `GOVERNANCE_EXCEPTION_NOTE` + `SYSTEM_GOVERNANCE_ACTOR`.
- En esta evidencia (07) y en el dossier maestro.

**Los reactivos creados por RH NO heredan la excepción automáticamente**: la
creación de un reactivo RH publicable (autor=revisor=aprobador=usuario)
registra la excepción como entrada append-only en `AuditLog`
(`governanceNote: 'EXCEPCION_REGISTRADA (DEMO): actor único…'`) — política
DEMO documentada en 13-limitations.md (L-5).

## El candidato no altera gobernanza (cierre RC-A03.3-12)

Durante la verificación E2E de esta fase se detectó que `PUT` y `DELETE` de
`/api/questions` **no tenían rol-gate** (solo POST lo tenía): un CANDIDATO de
la misma empresa podía editar/eliminar preguntas — violación directa del
PASO 8. **Corregido en A-03.3**:

- `PUT` y `DELETE` exigen rol RH/GERENTE/SUPER_ADMIN
  (`isQuestionWriteAllowed`); un CANDIDATO recibe 403 + registro en
  `AuditLog` vía `logUnauthorizedAccess`.
- Verificado por ruta real: `[E5] PUT de CANDIDATO → HTTP 403`.
- Los endpoints de gobernanza (blueprint/requirement/assessment) no tienen
  ruta pública de escritura: solo se crean por generador/seed de gobernanza.

## Trazabilidad de actores por nivel

| Nivel | createdBy | reviewedBy | approvedBy | Excepción registrada en |
|---|---|---|---|---|
| Blueprint (sistema) | A-03.2-GOVERNANCE | ídem | ídem | governanceNote |
| Requirement (sistema) | status APPROVED sincronizado | — | — | governanceNote del blueprint |
| Assessment (sistema) | createdBy | — | publishedBy | governanceNote del blueprint |
| Reactivo sistema | A-03.2-GOVERNANCE | ídem | ídem | governanceNote del blueprint |
| Reactivo RH publicable | auth.userId | auth.userId | auth.userId | AuditLog (append-only) |
| Versión nueva (cambio) | — (hereda origen) | null | null | pendiente de re-revisión (DRAFT) |

## Tests

- T14: CANDIDATO/SYSTEM/AI no publican; mismo actor sin excepción = violación.
- T15: la tríada queda registrada y la excepción registrada habilita el caso
  expreso (`singleActorExceptionUsed = true`).
