# A-03.5 — PASO 17: TEST DE INTEGRIDAD
## Invariantes estructurales del modelo canónico

## 1. KnowledgeAssessment no puede contener items sin requirement

- **En código**: el publicador es fail-closed — si un item administrado no
  resuelve requirement, lanza `CONFIGURATION_ERROR` y la transacción entera
  hace rollback (sin evaluación parcial).
- **En datos**: INTG-1 recorre TODAS las administraciones canónicas del
  dataset → **0 items sin `requirementId`/`itemVersionId`**.

## 2. Requirement no puede pertenecer a otro job

- Los requirements se crean DENTRO del blueprint del job que los deriva
  (`blueprintId` obligatorio, FK Restrict).
- INTG-2: por cada assessment canónico, `blueprint.jobType/jobId` debe
  coincidir con el job del assessment (VACANCY↔vacancyId, POSITION↔positionId)
  → **0 violaciones**.

## 3. Assessment no puede pertenecer a otro job

- `jobType + vacancyId|positionId` se escriben juntos desde un único
  `CanonicalJob`; el lookup de versiones SIEMPRE filtra por el job
  (`where: { vacancyId }` / `where: { positionId }`) — un job jamás reutiliza
  el assessment de otro.
- Verificado por INTG-2 (misma verificación de binding por fila) + el aislado
  de blueprints por (jobId, jobType) en XFLOW (los twins tienen blueprints
  separados por job, aunque el contenido sea idéntico).

## 4. ItemVersion no puede cambiar de requirement después de publicada

- No existe NINGUNA ruta de código que actualice `KnowledgeItemVersion`
  (grep de superficie: solo `create`/`findFirst` en knowledge-canonical.ts).
- La FK `requirementId` es Restrict: sin reasignación.
- INTG-3: para todo item congelado con edición, `itemVersion.requirementId ===
  assessmentItem.requirementId` → **0 discrepancias**.
- Cuando cambia el contenido (o la estructura del blueprint), se crea una
  NUEVA edición; el linaje de la edición original permanece congelado (CHG-5/6).

## 5. Extra — administración 1:1 con el candidato

- `@@unique([vacancyApplicationId])` y `@@unique([evaluationSessionId])`
  impiden dos administraciones para el mismo proceso (reinicio/reanudación
  reutiliza la existente).
