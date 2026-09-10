# A-03.4 — 00 · MASTER DOSSIER
# CIERRE DE VERSIONADO EN VACANTES PÚBLICAS — IMPLEMENTACIÓN CONTROLADA

**Fase:** EVALUHR — A-03.4
**Predecesor:** A-03.3 (KNOWLEDGE BLUEPRINT + ASSESSMENT VERSIONING)
**Cadena:** Fase 3.5 → A-01.2 → A-01.3 → A-02.1→.5 → A-03.1 → A-03.3 → **A-03.4**
**Fecha:** 2026-02-11
**Veredicto:** **GO** (implementación controlada + verificación end-to-end 34/34)

---

## 1. Gap encontrado (causa raíz)

La auditoría BEFORE (`01-before-audit.md`) confirmó y acotó el gap de A-03.3:

1. **Sin congelamiento alguno:** el flujo público (`/api/public/apply`)
   re-consultaba el banco vivo de conocimientos en cada GET y en el scoring —
   no existía ningún concepto de assessment/version/itemVersion/scoringVersion
   en el schema. Una edición del banco (admin o IA) cambiaba retroactivamente
   preguntas y claves de administraciones ya iniciadas.
2. **Gap neto adicional (descubierto en esta fase):** mismatch de numeración de
   pasos cliente/servidor (front: conocimientos=3; back: conocimientos=4 con
   integridad insertada en 3) → **las preguntas de conocimiento nunca se
   administraban** en el flujo público y knowledgeScore nunca se calculaba
   (quedaba null silenciosamente).
3. **Defecto latente de orden:** `calculateOverallScore` se ejecutaba antes de
   persistir los scores del paso completador → el overall excluía el
   knowledgeScore calculado en el mismo request (inobservable mientras
   knowledge estuviera muerto; se activó al revivir el paso).

## 2. Solución

Cadena garantizada (PASO 2):

```
CANDIDATO INICIA (step=data, transacción)
  → ASSESSMENT VERSION  KA-v{n}            (KnowledgeAssessment)
  → BLUEPRINT VERSION   BP-v{n}            (co-versionada: item set congelado)
  → ITEM VERSIONS       itemVersion        (KnowledgeAssessmentItem, inmutables)
  → SCORING VERSION     PUB-KS-v1          (congelada en app + respuestas)
  → SNAPSHOT            questionSnapshot + correctAnswerSnapshot (server-only)
  → RESULTADO           reconstruible solo con datos congelados
```

- `step=data` resuelve la versión activa **UNA sola vez** (hash canónico del
  banco): reutiliza la ACTIVE si el banco no cambió, publica v{n+1} si cambió.
- `answer`/`advance`/GET posteriores usan **exclusivamente** la administración
  congelada por id (nunca re-consultan "la ACTIVE actual").
- Cambio de banco/clave/pregunta ⇒ nueva versión/itemVersion para **nuevos**
  candidatos; los existentes continúan con la suya (PASO 5/6/7 verificados).
- Fail-closed: sin versión determinable ⇒ 500 CONFIGURATION_ERROR y **cero**
  evaluaciones parciales (PASO 8, PUB-K12).
- Legacy ⇒ permanece LEGACY; sin migración ni reinterpretación (PASO 9).
- Deny-list de gobernanza: el cliente no puede enviar assessmentVersion,
  itemVersion, correctAnswer, blueprintVersion, scoringVersion, snapshots
  (PASO 10). La IA no tiene ruta de escritura hacia versiones/claves/snapshots
  (PASO 11).

## 3. Schema (adiciones)

```
KnowledgeAssessment   { id, vacancyId, companyId, version, blueprintVersion,
                        scoringVersion, status(ACTIVE|RETIRED), contentHash,
                        itemCount, publishSource, publishedBy, publishedAt,
                        retiredAt }  @@unique([vacancyId, version])
KnowledgeAssessmentItem { id, assessmentId(FK Restrict), itemId, itemType,
                        itemVersion, order, questionSnapshot(JSON),
                        correctAnswerSnapshot(Int?), hasKey, difficulty('UNKNOWN'),
                        source }  @@unique([assessmentId, itemId])
VacancyApplication    + knowledgeAssessmentId(FK Restrict), knowledgeAssessmentVersion,
                        knowledgeBlueprintVersion, knowledgeScoringVersion,
                        knowledgeFrozenAt, knowledgeVersioningStatus
VacancyApplicationResponse + itemVersion, questionSnapshot,
                        correctAnswerSnapshot, scoringVersionSnapshot
```

Reglas K-INS/K-CA respetadas: item sin clave ⇒ `hasKey=false`, excluido del
denominador; sin evidencia con clave ⇒ knowledgeScore **null**, nunca 0.
Dificultad: `UNKNOWN` — nunca inventada (KD).

## 4. Archivos modificados

| Archivo | Cambio |
|---|---|
| `prisma/schema.prisma` | +2 modelos knowledge, +6 campos freeze (VacancyApplication), +4 campos snapshot (VacancyApplicationResponse), relaciones |
| `src/lib/knowledge-versioning.ts` | NUEVO: resolveKnowledgeBank, hash canónico, publishAssessmentForBank, freezeKnowledgeForApplication, scoreKnowledgeFromFrozenAdministration, deny-list, KnowledgeVersioningError |
| `src/app/api/public/apply/route.ts` | step=data freeze transaccional + fail-closed; GET step 4 sirve congelado (+fix FK del fallback legacy); answer valida pertenencia y escribe snapshots server-side; advance step 4 scoring congelado + stamp LEGACY; **ordering fix** persist→compute del overall; deny-list global |
| `src/app/api/vacancies/[id]/knowledge-versions/route.ts` | NUEVO: administración (lectura, RLS, sin claves) de versiones knowledge |
| `src/components/views/PublicEvaluationView.tsx` | Fix contrato de pasos: conocimientos=4 (render y advance) — revivió el paso de conocimientos |
| `scripts/a034-tests.ts` | NUEVO: batería PUB-K1..K15 + E2E + regresión + generador CSV |

## 5. Versionado y gobernanza (resumen)

- Publicación: autoridad del servidor (`SYSTEM:PUBLIC_APPLY_FREEZE`); el
  trigger es el cambio del banco; la versión anterior pasa a RETIRED
  (retiredAt) sin tocar items.
- Inmutabilidad: items congelados sin ruta de mutación; FK Restrict impide
  borrar versiones con administraciones.
- Función separada: candidato (token HMAC, sin gobernanza) / servidor
  (versión+clave+scoring) / IA (solo borradores de banco, sin publicación) /
  admin RH (edición de banco RLS; inspección de versiones sin claves).
- Auditoría: logs `[SECURITY][A-03.4]` en cada rechazo; metadatos
  publishedBy/publishSource/publishedAt en cada versión.

## 6. Tests (PASO 12) y E2E (PASO 13)

- **34/34 PASS** (`a034-test-results.json`): PUB-K1..K15 completos + SEC-a/b +
  PASO6-a/b + PASO11/b + REG-1..5 + E2E-1..8.
- E2E real HTTP: A inicia→v1; banco cambia; B inicia→v2; A finaliza con clave
  A (66.67); B finaliza con clave B (25); histórico de A inalterado y
  reconstruible (PUB-K15).

## 7. Regresión (PASO 14)

IPIP idéntico (REG-1), knowledge interno intacto (REG-2, /api/evaluations sin
tocar), overallScore fórmula intacta (REG-3; solo se corrigió el orden
persist→compute dentro de /api/public/apply), resultados legacy intactos
(REG-4), INSUFFICIENT≠0 (REG-5), integridad/recomendaciones/JobFit/contrato/
aviso/RLS/Supabase/auth sin cambios (REG-6..8, auditoría de superficie).

## 8. Riesgos

| Riesgo | Mitigación | Residual |
|---|---|---|
| Carrera de publicación concurrente (2 inicios simultáneos tras cambio) | transacción + @@unique(vacancyId,version); el perdedor re-resuelve → falla visible, no corrupción | bajo (SQLite serializa escrituras) |
| Crecimiento de versiones por ediciones frecuentes del banco | 1 versión por cambio observado al iniciar; items compartidos por itemVersion | bajo |
| Legacy en vuelo completa con banco vivo (vía histórica con `?? 0`) | comportamiento histórico preservado por mandato (PASO 9); etiquetado LEGACY explícito | documentado — corrección de `?? 0` pertenece a A-03.2/A-03.3 |
| Vía template (fallback) usa findFirst(Position) sin orden determinista | el congelamiento fija el set al iniciar; el scoring ya no depende del banco | bajo |
| Blueprint co-versionado (no entidad separada) | limitación documentada; cadena de reconstrucción completa con 4 versiones congeladas | medio-bajo (A-03.3 futuro) |

## 9. Limitaciones

1. Las entidades completas de A-03.3 (KnowledgeBlueprint/KnowledgeRequirement
   con dominios/subdominios) no existen en este código base: el blueprint del
   flujo público se materializa como el item set congelado co-versionado
   (BP-v{n}). La cadena exigida por A-03.4 queda completa y verificable.
2. `PublicEvaluationView` no está cableado en el router de `page.tsx`
   (condición preexistente, fuera del alcance declarado). El contrato
   cliente↔servidor del flujo quedó alineado y la verificación autoritativa
   es a nivel API (34/34) + smoke de render del app.
3. La corrección del fallback legacy `?? 0` no es parte de A-03.4 (mandato
   PASO 9: no reinterpretar legacy); las administraciones nuevas no la usan.
4. No hay UI de administración para versiones (endpoint de inspección listo).

## 10. Entregables

```
evidence-a03-4/00-master-dossier.md          ← este documento
evidence-a03-4/01-before-audit.md            ← PASO 1 (solo lectura)
evidence-a03-4/02-public-version-freeze.md   ← PASO 2+4
evidence-a03-4/03-snapshot.md                ← PASO 3
evidence-a03-4/04-version-change-tests.md    ← PASO 5/6/7/12 + ordering fix
evidence-a03-4/05-security.md                ← PASO 10+11
evidence-a03-4/06-legacy.md                  ← PASO 9
evidence-a03-4/07-e2e.md                     ← PASO 13
evidence-a03-4/08-regression.md              ← PASO 14
evidence-a03-4/09-audit-checklist.md         ← PASO 15 (15/15 ✅)
evidence-a03-4/public-knowledge-versioning.csv (16 filas, 10 columnas)
evidence-a03-4/a034-test-results.json        (34/34 PASS)
evidence-a03-4/browser-home.png              (smoke de render)
```
