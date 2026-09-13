# A-03.3 — PASO 1 · AUDITORÍA PREVIA (SOLO LECTURA — ANTES DE MODIFICAR)

> Fase: A-03.3 KNOWLEDGE BLUEPRINT + ASSESSMENT VERSIONING (diseño + implementación controlada).
> Este documento registra el estado EXACTO del instrumento de conocimientos ANTES de
> cualquier modificación de esta fase. Alcance de lectura: dónde vive el puesto, dónde
> viven los reactivos de conocimiento, cómo se relacionan con el puesto, cómo se genera
> el conjunto, cómo se persiste, cómo se administra y cómo se calcula el resultado.
> Herencia verificada: worklog A01.2-1 → A03.2-1; evidencia evidence-a03-1/ (diseño) y
> evidence-a03-2/ (corrección correctAnswer). Regla de oro vigente: INSUFFICIENT ≠ 0.

---

## 1. Mapa del estado actual (7 preguntas del encargo)

### 1.1 ¿Dónde se representa actualmente el puesto?

| Elemento | Ubicación exacta |
|---|---|
| Modelo `Position` | `prisma/schema.prisma` l.117–136 |
| Campos relevantes | `id`, `title`, `category` (MESERO/COCINERO/BARTENDER/GERENTE_PISO/VENDEDOR) l.121, `hasKnowledgeTest` l.123, `companyId` l.124 |
| Relación con evaluaciones | `Position → EvaluationTemplate` (l.131) → `Question` (l.164 en EvaluationTemplate; Question.evaluationTemplateId l.177) |

**No existe** ninguna entidad de blueprint ni de requisito de conocimiento ligada al
puesto. La relación "puesto → conocimiento" es **implícita por coincidencia de texto**:
la categoría del puesto se usa como llave de un diccionario estático
(`KNOWLEDGE_QUESTIONS_BY_CATEGORY[category]`, `src/lib/generate-templates.ts` l.293).

### 1.2 ¿Dónde están las preguntas de knowledge?

- Modelo `Question` — `prisma/schema.prisma` l.169–200.
- Filtrado por `category = 'KNOWLEDGE'` + `type = 'MULTIPLE_CHOICE'`.
- Gobernanza A-03.2 ya presente en el modelo (l.183–195): `knowledgeStatus`,
  `itemVersion` (Int, default 1), `correctAnswerSource`, `correctAnswerRationale`,
  `origin` (HUMAN/SYSTEM_BANK/AI_DRAFT), `reviewedBy`, `approvedBy`,
  `previousCorrectAnswer`, `correctAnswerChangedAt`.
- Contenido del banco del sistema: `src/lib/generate-templates.ts`
  `KNOWLEDGE_QUESTIONS_BY_CATEGORY` (GENERAL en l.160–171; categorías de oficio en el
  bloque l.126–172).
- Claves + rationale + constantes de gobernanza: `src/lib/knowledge/system-bank.ts`
  (`KNOWLEDGE_KEY_ADDENDUM` l.25–81, `SYSTEM_KNOWLEDGE_GOVERNANCE` l.89–96,
  `resolveSystemKnowledgeKey` l.105–113).
- Reglas de scoring puras: `src/lib/knowledge/scoring.ts` (estados l.20–53,
  `deriveScorability` l.94, `scoreKnowledgeItem(s)` l.108/135, `canPublishKnowledgeItem`
  l.276, `isPublishingActorAllowed` l.312, `nextItemVersionOnKeyChange` l.238,
  `rescoreFromFrozenSnapshot` l.248, detector subjetivas l.337).

### 1.3 ¿Cómo se relacionan con un puesto?

Cadena actual: `Position → EvaluationTemplate (type='CONOCIMIENTOS', positionId) →
Question (evaluationTemplateId)`. Es una relación **de contenedor**, no metodológica:

- No hay `KnowledgeBlueprint` (encargo PASO 2) → no hay entidad que declare QUÉ
  dominios se evalúan para ESE puesto.
- No hay `KnowledgeRequirement` (PASO 3) → ningún reactivo pertenece a un
  requisito de conocimiento trazable al puesto (ítems sin padre metodológico).
- No hay validación de que un item ACTIVE tenga blueprint/requirement (PASO 4).

### 1.4 ¿Cómo se genera el conjunto?

`generateTemplatesForPosition` — `src/lib/generate-templates.ts` l.191–384:

1. Idempotencia: si ya existen plantillas, no hace nada (l.213–218).
2. PSICOMÉTRICA IPIP-50-MX (l.226–261) — INTOCABLE en A-03.3.
3. PSICOLÓGICA (l.264–289) — INTOCABLE.
4. CONOCIMIENTOS si `hasKnowledgeTest` (l.292–353): crea la plantilla con
   `knowledgeScoringVersion` (l.305), luego por cada pregunta del banco de la
   categoría (o fallback GENERAL, l.334) crea el Question con clave resuelta
   (l.312/345), rationale (l.323/346) y `...SYSTEM_KNOWLEDGE_GOVERNANCE`
   (l.324/347 → ACTIVE/itemVersion 1/reviewedBy='A-03.2-GOVERNANCE').
5. INTEGRIDAD (l.356–381) — INTOCABLE.

No se genera: blueprint, requirements, assessment version, historial de versiones.

### 1.5 ¿Cómo se persiste?

- `Question` filas planas (una fila = "versión actual" del reactivo).
- `EvaluationTemplate.knowledgeScoringVersion` l.155.
- Respuestas: `EvaluationResponse` (l.241–265) con congelamiento de clave por
  administración A-03.2 (`correctAnswerSnapshot` l.256, `scoringOutcome` l.257) —
  escrito SOLO al calificar (completeEvaluation, l.1244–1257).
- Resultado: `EvaluationResult.knowledgeScore/knowledgeStatus/knowledgeReasonCode/
  knowledgeScoringVersion` (l.291, l.319–321). Flujo de vacantes espejo en
  `VacancyApplication` (l.457–459) y `VacancyApplicationResponse`.
- Claves históricas del sistema en GIT (system-bank.ts) — no es versionado de DB.

### 1.6 ¿Cómo se administra?

- Creación de sesión: `POST /api/evaluations` `action='create-session'`
  (`src/app/api/evaluations/route.ts` l.700–762) — **no registra ninguna versión**.
- Arranque: `action='start'` (l.919–…) marca IN_PROGRESS y devuelve las plantillas
  ACTIVAS del momento (l.935–973); cada fetch posterior (`next-step`, GET de sesión)
  re-lee el banco vigente (l.475–512, l.579+). **Si el banco cambia a mitad de
  administración, el candidato puede ver contenido distinto entre pasos** (única
  protección A-03.2: la clave se congela al FINAL, al calificar).
- Flujo de vacantes: `src/app/api/public/apply/route.ts` administra CONOCIMIENTOS
  con el mismo patrón (clave congelada al calificar; sin snapshot de inicio).

### 1.7 ¿Cómo se calcula el resultado?

`completeEvaluation` (evaluations/route.ts l.1194–1386):

1. Cuenta el set publicado esperado: plantillas CONOCIMIENTOS activas × preguntas
   KNOWLEDGE/MULTIPLE_CHOICE (l.1211–1219).
2. `calculateScores` → `scoreKnowledgeItems` (scoring.ts l.135): CORRECT_OVER_TOTAL;
   cualquier item sin clave ⇒ INSUFFICIENT/KNOWLEDGE_KEY_MISSING con score=null;
   administración parcial ⇒ INSUFFICIENT/KNOWLEDGE_INCOMPLETE (sin prorrateo);
   sin respuestas ⇒ NOT_APPLICABLE. INSUFFICIENT ≠ 0 preservado.
3. Congela clave+desenlace por respuesta (l.1244–1257).
4. `hasKnowledge` exige `knowledgeStatus === 'VALID'` para PERFIL_COMPLETO (l.1300).
5. Persiste `EvaluationResult` (l.1342–1370). overallScore y recomendaciones
   calculados en `calculateScores`/`buildSummary` — INTOCABLES en A-03.3.

---

## 2. Causas raíz identificadas para A-03.3 (RC-A03.3-1..10)

| # | Causa raíz | Evidencia exacta |
|---|---|---|
| RC-A03.3-1 | **No existe KnowledgeBlueprint.** La relación puesto→conocimiento es un diccionario estático por `category`; no hay entidad de gobernanza ligada al puesto (PASO 2 incumplido). | generate-templates.ts l.293; schema.prisma (ausencia de modelo) |
| RC-A03.3-2 | **No existe KnowledgeRequirement.** Los ítems no pertenecen a ningún requisito con dominio/subdomain/importance/source/rationale trazable al puesto; dominios huérfanos de facto (PASO 3/4 incumplidos). | schema.prisma Question l.169–200 (sin FK a requisito) |
| RC-A03.3-3 | **No existe KnowledgeAssessment (assessmentVersion congelado).** El conjunto administrado = plantillas activas LEÍDAS EN CADA FETCH; nada registra qué versión fue administrada (PASO 5/9 incumplidos). | evaluations/route.ts l.475–512, l.935–973 |
| RC-A03.3-4 | **Versionado de ítem inexistente (una sola fila mutable).** `itemVersion` existe pero NO hay tabla de historial; ningún código escribe `previousCorrectAnswer`/`correctAnswerChangedAt` (0 coincidencias en src/); el PUT de preguntas SOBRESCRIBE silenciosamente question/options/correctAnswer sin nueva versión ni RETIRED (PASO 6/11/12 incumplidos). Nota: el worklog A-03.2 afirmaba versionado en PUT; verificado con `git log -p` — NUNCA existió en ningún commit (solo `itemVersion: 1` en POST). | questions/route.ts PUT l.332–342; `rg "previousCorrectAnswer" src/` → solo schema |
| RC-A03.3-5 | **No existe compuerta de publicación a nivel ASSESSMENT.** Solo hay compuerta por ítem (`canPublishKnowledgeItem`); nada exige blueprint APPROVED + requirements APPROVED + items APPROVED + scoringVersion + versionado completo (PASO 7 incumplido). | scoring.ts l.276–302 (alcance ítem); sin módulo de assessment |
| RC-A03.3-6 | **Separación de funciones incompleta.** POST de preguntas graba `reviewedBy = approvedBy = auth.userId` (autor=revisor=aprobador) SIN excepción registrada; no hay `createdBy` en Question; no hay campos de gobernanza a nivel blueprint/assessment (PASO 8 incumplido). | questions/route.ts l.243–244 |
| RC-A03.3-7 | **Sin snapshot de administración al iniciar.** create-session (l.700–762) y start (l.919+) no guardan assessmentVersion/blueprintVersion/scoringVersion/itemVersions (PASO 9 incumplido). | evaluations/route.ts l.700–762, l.919–973 |
| RC-A03.3-8 | **Cadena de reconstrucción incompleta (PASO 10).** `EvaluationResponse` congela clave+outcome pero no `itemVersionSnapshot`; no existe cadena Candidate→Assessment→Blueprint→Requirement→ItemVersion→Response→CorrectAnswerSnapshot→ScoringVersion→Result; la reconstrucción depende de la fila ACTUAL del banco para el contexto. | schema.prisma l.252–257; ausencia de entidades |
| RC-A03.3-9 | **Límites de IA preventivos no cableados.** `origin='AI_DRAFT'` y `isPublishingActorAllowed` existen, pero ningún mecanismo fuerza que una salida IA nazca DRAFT ni bloquea su publicación a nivel módulo (PASO 14 preventivo). Hoy no hay ruta IA de escritura — riesgo de futuro, no incidente. | scoring.ts l.312–317 sin uso en escrituras |
| RC-A03.3-10 | **Sin clasificación consultable de registros históricos** (LEGACY/VALIDATED-V1/INVALID/UNKNOWN del PASO 16). La clasificación A/B/C/D de A-03.2 vive solo en evidencia documental, no en datos. | scripts/a032-classify-knowledge.ts (solo lectura, sin persistencia) |

## 3. Lo que YA funciona (herencia que A-03.3 debe preservar intacta)

1. `correctAnswer` persistido para los 50 reactivos del banco (A-03.2) — clasificación 50×A.
2. MISSING correctAnswer ≠ incorrect; item sin clave = NOT_SCORABLE; cualquier
   faltante ⇒ INSUFFICIENT (score null, jamás 0) con KNOWLEDGE_KEY_MISSING /
   KNOWLEDGE_INCOMPLETE; sin prorrateo.
3. Clave congelada por administración al calificar (correctAnswerSnapshot/scoringOutcome).
4. Clave oculta al candidato en 7 serializaciones; rol-gate RH/GERENTE/SUPER_ADMIN
   en POST/PUT/DELETE de preguntas (CANDIDATO ⇒ 403 + log).
5. Ciclo de vida por ítem definido (7 estados) + compuerta por ítem + detector de
   subjetivas (KS) + dificultad conceptual UNKNOWN (KD, sin implementar columna).
6. 11/11 tests unitarios de scoring (tests/knowledge-scoring.test.ts).
7. Frontend RH muestra "Información insuficiente…" para INSUFFICIENT (A-03.2 PASO 16).

## 4. Riesgos de la fase (previos a implementar)

- R-A: `db:push` sobre SQLite con 3 resultados históricos — debe ser estrictamente
  aditivo (modelos nuevos + columnas nullable); verificación checksum antes/después.
- R-B: no inventar blueprints históricos: puestos existentes quedan SIN blueprint
  (clasificación LEGACY/VALIDATED-V1); solo puestos nuevos generan cadena completa.
- R-C: tocar `questions/route.ts` PUT/POST y `evaluations/route.ts` puede romper
  flujos ajenos — cambios quirúrgicos + regresión IPIP/integridad/competencias/overall.
- R-D: snapshot al iniciar no debe exponer claves (solo versiones).
- R-E: seed contiene posiciones demo — se actualiza el CÓDIGO del seed
  (knowledge-only) pero NO se ejecuta (evitar destruir históricos del dev DB).

## 5. Veredicto de la auditoría previa

El scoring por clave ya es correcto (A-03.2), pero **el instrumento de conocimientos
no tiene arquitectura de blueprint → requisito → ítem → assessment version → snapshot**:
la relación con el puesto es implícita, no hay versionado histórico de ítems, no hay
publicación con compuertas a nivel assessment, no hay separación de funciones
registrada, y la reconstrucción de resultados históricos depende del estado ACTUAL del
banco. Se autoriza modificar exclusivamente infraestructura knowledge según el encargo
A-03.3. Resto de módulos: INTACTOS.
