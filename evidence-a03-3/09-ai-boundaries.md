# A-03.3 — PASO 14 · LÍMITES DE IA (AI-BOUNDARIES)

## Regla del encargo

La IA puede crear **DRAFT item**. La IA NO puede: aprobar blueprint, aprobar
requirement, aprobar correctAnswer, publicar ítem, publicar assessment,
modificar versión ACTIVE. Toda salida de IA: `generatedBy = AI` y estado
`DRAFT` hasta revisión.

## Implementación (preventiva, en toda escritura)

- Marcador de origen: `Question.origin ∈ {HUMAN, SYSTEM_BANK, AI_DRAFT}`
  (`generatedBy = AI` ⇒ `origin='AI_DRAFT'`; el alias `'AI'` también es
  reconocido por `isAiOrigin`).
- `enforceAiDraftBoundaries(input)` (puro): si el origen es IA ⇒
  `knowledgeStatus='DRAFT'`, `reviewedBy=null`, `approvedBy=null`,
  `enforced=true`. Irreversible dentro de la misma operación: ningún fallback
  `??` puede restituir un actor humano (bug detectado y corregido durante el
  E2E de esta fase — el `?? auth.userId` anulaba la frontera).
- `canAiPublish()` ⇒ **false** por definición; `isHumanPublishingActor` /
  `isPublishingActorAllowed` (herencia A-03.2) solo permiten
  RH/GERENTE/SUPER_ADMIN.
- `normalizeItemWrite` aplica la frontera en `POST /api/questions`: un
  reactivo con `origin='AI_DRAFT'` nace DRAFT, sin revisor/aprobador, aunque
  la request traiga clave válida y requirement.
- La IA no tiene rutas para blueprint/requirement/assessment: esas entidades
  solo nacen del generador de gobernanza del sistema (actor registrado) o de
  futuras APIs de gobernanza humano-gated (no existen hoy).

## Prohibiciones vigentes (acumulado heredado)

- AI-X20..X25 (A-03.1): IA no define obligatoriedad, clave definitiva,
  dificultad definitiva, validez, aprobación ni publicación.
- AI-X1..X19 (A-02.5) y fronteras de otros módulos: INTACTAS (no se modificó
  IA de personalidad/integridad/competencias/JobFit).

## Verificación

- Unit (T13): IA ⇒ DRAFT + null/null + `canAiPublish()===false` + actores no
  humanos bloqueados.
- E2E (ruta real): `POST /api/questions` con `origin='AI_DRAFT'` ⇒
  `status=DRAFT origin=AI_DRAFT reviewedBy=null approvedBy=null`.
- Hoy no existe generación IA de reactivos en el sistema (la única IA del
  sistema es la de preguntas de vacantes, módulo ajeno a knowledge scoring y
  no modificado); la frontera es preventiva y queda cableada para el futuro
  flujo IA→borrador→revisión de A-03.1 PASO 5.
