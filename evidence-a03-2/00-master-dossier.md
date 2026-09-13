# EVALUHR — A-03.2
# DOSSIER MAESTRO — CORRECCIÓN CONTROLADA DEL KNOWLEDGE ASSESSMENT (IMPLEMENTACIÓN LIMITADA)

> Fase A-03.2 · Fecha: 2026-09-10 · **Única fase de la serie A autorizada a
> modificar código** — y únicamente el código de knowledge.
> Intocables verificados con git: IPIP, Big Five, personalidad, integridad,
> competencias, entrevistas, JobFit, nivel de ajuste, recomendaciones,
> scoring global (fórmulas), IA de otros módulos, contrato, aviso, RLS,
> Supabase, autenticación.
> Este dossier resume y enlaza los documentos de `evidence-a03-2/`.

---

## Reglas maestras cumplidas

1. **MISSING correctAnswer ≠ incorrect answer** — un item sin clave es
   NOT_SCORABLE y jamás cuenta como error del candidato.
2. **Cualquier clave faltante en una administración ⇒ INSUFFICIENT**
   (`KNOWLEDGE_KEY_MISSING`), score = null — **jamás `knowledgeScore = 0`
   como resultado** (regla de oro INSUFFICIENT ≠ 0).
3. **La IA propone; los humanos aprueban y publican** — sin excepciones.

## Índice del expediente

| Archivo | Contenido |
|---|---|
| `01-before-audit.md` | Auditoría previa (9 causas raíz con precisión de líneas) |
| `02-after-audit.md` | Auditoría posterior (RC×RC veredicto + verificación) |
| `03-correctanswer-governance.md` | Fuentes, roles y compuertas de la clave |
| `04-scoring-behavior.md` | Comportamiento exacto del scoring (casos verificados) |
| `05-versioning.md` | Versiones y congelamiento |
| `06-migration-impact.md` | Schema, clasificación A/B/C/D, históricos |
| `07-audit-checklist.md` | Checklist final del encargo (PASO 19) |

---

## 1. Problema antes

Las preguntas de conocimiento generadas para puestos nuevos podían no
persistir `correctAnswer` ⇒ el scoring las trataba como incorrectas ⇒
**`knowledgeScore = 0` para cualquier candidato**, independientemente de sus
respuestas. Adicionalmente: el banco genérico usaba auto-reportes sin clave;
el seed omitía claves; el flujo de vacantes **inventaba** la clave 0
(`?? 0`); y la clave era visible para CANDIDATOS en 2 rutas.
> Detalle: `01-before-audit.md`.

## 2. Causa raíz

9 causas (RC-1..RC-9) localizadas con precisión: (1) create omite
`correctAnswer` en generate-templates.ts; (2) fallback auto-reporte KS-3;
(3) seed omite la clave declarada; (4) scoring de sesión cuenta el item sin
clave en el denominador; (5) scoring de vacantes `?? 0`; (6) sin estados ni
versionado; (7) fuga de clave a candidato; (8) escritura de claves sin rol
ni auditoría; (9) sin congelamiento de clave por administración.
> Detalle: `01-before-audit.md` §9.

## 3. Solución

Módulo puro `src/lib/knowledge/scoring.ts` con la regla central
(`scoreKnowledgeItem(s)`, `deriveScorability`, `canPublishKnowledgeItem`,
`isPublishingActorAllowed`, `nextItemVersionOnKeyChange`,
`rescoreFromFrozenSnapshot`), adoptado por ambos flujos de evaluación
(sesión y vacantes); persistencia de claves con fuente/rationale/gobernanza;
estados de item; snapshots de clave por administración; seguridad de API;
mensaje INSUFFICIENT para RH.
> Detalle: `02-after-audit.md`.

## 4. Arquitectura

```
src/lib/knowledge/
  scoring.ts       reglas puras (testeadas — bun:test)
  system-bank.ts   claves+rationale+gobernanza del banco del sistema (fuente única)
Flujo sesión (evaluations/route): calculateScores → scoreKnowledgeItems →
  result (score/status/reasonCode/scoringVersion) → congelamiento por respuesta
Flujo vacantes (public/apply/route): idéntico módulo; sin `?? 0`
Gobernanza (questions/route): roles, validación de clave, versionado, auditoría
Frontend (CandidateDetailView): VALID → % ; INSUFFICIENT → mensaje oficial
```
> Detalle: `02-after-audit.md` §2.

## 5. correctAnswer

- Es **precondición de scoring y de publicación**: sin clave no hay item
  ACTIVE (compuerta `canPublishKnowledgeItem`) ni puntuación (NOT_SCORABLE).
- Fuentes admisibles documentadas: DOCUMENTAL / EXPERTO / MATERIAL_CLIENTE /
  NORMATIVA / ELABORACION_REVISADA (banco del sistema revisado por la
  gobernanza humana de A-03.2; rationale por reactivo).
- La IA puede proponer; la aprobación es de rol humano autorizado
  (RH/GERENTE/SUPER_ADMIN), verificada server-side.
> Detalle: `03-correctanswer-governance.md`.

## 6. scoring

Regla por item y por evaluación exactamente como el encargo: SCORABLE
correcta/incorrecta; NOT_SCORABLE si no hay clave; **NOT_SCORABLE jamás →
incorrecta**; cualquier clave faltante ⇒ INSUFFICIENT (score null); sin
prorrateo (administración parcial ⇒ INSUFFICIENT / KNOWLEDGE_INCOMPLETE);
overallScore/recommendation con fórmulas intactas (INSUFFICIENT se excluye,
no se puntúa como 0).
> Detalle: `04-scoring-behavior.md`.

## 7. estados

- **Ciclo de vida del item** (`Question.knowledgeStatus`): DRAFT, REVIEW,
  APPROVED, ACTIVE, SUSPENDED, RETIRED, REJECTED.
- **Scorability**: SCORABLE / NOT_SCORABLE (derivada de la existencia de
  clave — una sola fuente de verdad).
- **Estado del resultado** (`knowledgeStatus`): VALID / INSUFFICIENT /
  NOT_APPLICABLE (+ `knowledgeReasonCode`: KNOWLEDGE_KEY_MISSING /
  KNOWLEDGE_INCOMPLETE).
> Detalle: `03-correctanswer-governance.md` §3 y `04-scoring-behavior.md`.

## 8. IA

La generación puede seguir usando IA para BORRADORES. El flujo obligatorio:
IA → Borrador → revisión humana → aprobación → publicación. La IA NO puede
publicar, declarar validación, establecer obligatoriedad, decidir sola
correctAnswer, cambiar una respuesta aprobada ni modificar retrospectivamente
resultados — garantizado por rol-gate + `isPublishingActorAllowed()` (TEST 10)
+ ausencia de rutas de escritura IA.
> Detalle: `03-correctanswer-governance.md` §2.

## 9. versionado

`itemVersion` (por reactivo; +1 ante cambio de question/options/correctAnswer
con auditoría y previousCorrectAnswer), `knowledgeScoringVersion`
(KNOWLEDGE-SCORING-1.0, registrada en template y resultado).
`assessmentVersion`/`blueprintVersion` completas quedan documentadas como
deuda ligada al Blueprint de A-03.1 (§4 de 05-versioning.md); la
reproducibilidad hoy está garantizada por snapshots + versiones registradas.
> Detalle: `05-versioning.md`.

## 10. históricos

- **Cero recálculos** (no existe ruta de código que re-puntúe).
- Resultados previos: `knowledgeStatus = null` (legacy) y se muestran igual
  que antes (verificado en navegador).
- Clave congelada por administración (`correctAnswerSnapshot`): un cambio
  posterior de clave no altera el histórico (TEST 8).
- No se inventaron claves para datos históricos.
> Detalle: `06-migration-impact.md` §3.

## 11. seguridad

- Candidato no puede leer la clave (filtrada por rol en 2 rutas; E2E) ni
  escribirla (rol-gate 403 + logUnauthorizedAccess).
- Ningún cliente HTTP puede establecer clave aprobada fuera del flujo
  autorizado (única vía: API de preguntas con rol).
- Cambio de clave: versionado + `previousCorrectAnswer` + fecha + AuditLog.
- Append-only: historial por AuditLog; sin edición silenciosa.
- Flujo público de vacantes: ya ocultaba la clave; scoring corregido.
> Detalle: `03-correctanswer-governance.md` §5–6.

## 12. tests

**Unitarios (bun:test, 11/11 pass)**: TEST 1..10 del encargo + EXTRA
(scoringVersion registrada) — `tests/knowledge-scoring.test.ts`.
**E2E contra el dev server (`scripts/a032-e2e-knowledge.ts`): APROBADO 5/5**:
sin fuga de clave por la ruta real del candidato · flujo completo ⇒ VALID 80
con 10 snapshots congelados · clave eliminada ⇒ INSUFFICIENT/null/KNOWLEDGE_KEY_MISSING
· clave restaurada · limpieza completa de datos de prueba.
**Clasificación de datos (solo lectura)**: `scripts/a032-classify-knowledge.ts`
→ 50×A, 0×B/C/D; 3 resultados legacy intactos.

## 13. regresión

- git: solo archivos knowledge modificados (rg sobre el diff: 0 coincidencias
  con ipip/integrity/consent/interview/privacy/rls).
- IPIP-50-MX: scorer y flujo intactos; el E2E administró IPIP y produjo
  resumen del instrumento sin errores.
- Integridad/competencias/personalidad: sin cambios de código; scoring
  legacy intacto.
- overallScore/recommendations: fórmulas sin modificar (verificado en E2E:
  valores coherentes con las fórmulas pre-existentes).
- Frontend fuera de knowledge: sin cambios (solo CandidateDetailView añade
  el mensaje INSUFFICIENT).
- Navegador: login RH → dashboard → detalle de candidato renders OK, sin
  errores de consola.
- Lint limpio; tsc sin errores nuevos en archivos tocados.

## 14. riesgos

| # | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| R1 | Claves del banco del sistema (ELABORACION_REVISADA) no han pasado por blueprint por-puesto de A-03.1 | MEDIA | Rationale por reactivo + gobernanza registrada; ruta A-03.1 sigue siendo el camino formal |
| R2 | Las 40 claves añadidas a COCINERO/BARTENDER/GERENTE_PISO/VENDEDOR son de elaboración revisada — pueden requerir ajuste por cliente | MEDIA | Versionado + cambio de clave auditable + snapshot protege históricos |
| R3 | Custom questions de RH sin rigor de revisión (autor=aprobador hoy) | MEDIA | Roles exigidos + auditoría; separación autor/revisor como trabajo futuro |
| R4 | Resultados legacy (knowledgeStatus null) mezclados con nuevos en vistas que no distinguen | BAJA | CandidateDetailView distingue; otras vistas quedan para iteración |
| R5 | El INSUFFICIENT reduce candidatos "puntuados" hasta corregir claves (C/B) | MEDIA | Comportamiento intencional y honesto; remediación = gobernanza de claves |
| R6 | schema.prod/Supabase no recibió las columnas nuevas | MEDIA | Documentado en 06 §5; push equivalente al promover a staging |

## 15. limitaciones

1. No implementa el modelo completo de A-03.1 (blueprint, cobertura por
   dominio, revisión ≠ autor como flujo) — solo la corrección autorizada.
2. `assessmentVersion`/`blueprintVersion` como columnas explícitas quedan
   pendientes (deuda documentada).
3. Los resultados históricos sin snapshot no son re-verificables item a item
   (solo los nuevos).
4. La validación "una sola respuesta correcta" es estructural (rango +
   presence); la calidad semántica de la clave depende de la gobernanza.
5. La IA no está conectada como borradorista de reactivos en este flujo
   (no existía conexión IA→knowledge en el generador; el banco es estático).
6. VacancyQuestion no recibe ciclo de vida/versión en esta fase (solo
   scoring correcto + estado en la aplicación).

## 16. archivos modificados

```
M prisma/schema.prisma                       (+36 — solo campos knowledge)
M prisma/seed.ts                             (+37 — claves + gobernanza + versión)
M src/app/api/evaluations/route.ts           (scoring knowledge, snapshots, ocultar clave)
M src/app/api/public/apply/route.ts          (scoring knowledge vacantes, sin ?? 0)
M src/app/api/questions/route.ts             (roles, validación, versionado, auditoría)
M src/components/views/CandidateDetailView.tsx (mensaje INSUFFICIENT)
M src/lib/generate-templates.ts              (claves + estados + knowledgeScoringVersion)
M src/lib/store.ts                           (+3 campos de tipo)
N src/lib/knowledge/scoring.ts · src/lib/knowledge/system-bank.ts
N tests/knowledge-scoring.test.ts
N scripts/a032-classify-knowledge.ts · scripts/a032-e2e-knowledge.ts
N evidence-a03-2/ (este expediente)
```

## 17. cambios de schema

Solo aditivos y nullables (detalle completo en `06-migration-impact.md` §1):
`Question` +9 campos de gobernanza/versionado · `EvaluationResponse`
+`correctAnswerSnapshot`/`scoringOutcome` · `EvaluationResult` +3 campos de
estado de scoring · `VacancyApplication` +3 ídem · `EvaluationTemplate`
+`knowledgeScoringVersion`. Aplicados con `db:push` a SQLite local. Sin
backfills; sin cambios de RLS; Supabase pendiente de promoción documentada.

## 18. conclusión

La corrección controlada está **implementada, testeada y verificada
end-to-end**: la distinción incorrecta / no evaluable / instrumento
incompleto / fallo técnico existe (`INCORRECT` / `NOT_SCORABLE` +
`KNOWLEDGE_KEY_MISSING` / `KNOWLEDGE_INCOMPLETE` / estados de resultado), el
0 artefactual desaparece del producto, la clave es segura, versionada y
congelada por administración, y los resultados históricos permanecen
intactos. Veredicto: **GO de implementación limitada** — con las limitaciones
y la deuda documentada en §15/§17 como ruta explícita de continuación.
