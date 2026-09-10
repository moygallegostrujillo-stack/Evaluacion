# A-03.5 — PASO 20: CHECKLIST DE AUDITORÍA (19 ítems)

Verificación final sobre el código entregado y la suite 57/57
(`scripts/a035-tests.ts` → `a035-test-results.json`).

- [x] **existe un único modelo canónico** — Cadena JOB→BLUEPRINT→REQUIREMENT→ITEM VERSION→ASSESSMENT→ADMINISTRATION→RESPONSE→RESULT materializada en `prisma/schema.prisma` + `src/lib/knowledge-canonical.ts` (doc 02).
- [x] **interno y público usan el mismo modelo** — Ambos flujos llaman a las mismas funciones de resolución/freeze/scoring; XFLOW-1..3 prueban igualdad de instrumento.
- [x] **blueprint ligado a job** — `jobId + jobType` obligatorios; CAN-1/INT-1; blueprints separados por job.
- [x] **requirement ligado a blueprint** — FK Restrict; creación solo dentro del blueprint; CAN-2/INTG-2.
- [x] **item ligado a requirement** — Fail-closed en publicación; INTG-1 (0 huérfanos); links requirementId+itemVersionId en todo item canónico.
- [x] **assessment ligado a blueprint** — `blueprintId` obligatorio en publicaciones nuevas (null solo pre-canónico documentado); CAN-4/INTG-2.
- [x] **administration ligada a assessment** — FK + versiones denormalizadas; única por aplicación/sesión; CAN-6/INT-1.
- [x] **versiones congeladas** — assessmentVersion/blueprintVersion/scoringVersion/itemVersions denormalizadas e inmutables en la administración; CHG-1..8, REC-1..4.
- [x] **correctAnswer protegida** — Server-only en ItemVersion/snapshots; retirada de TODAS las serializaciones de candidato (fuga interna cerrada); deep-scan limpio (SEC-2/INT-2).
- [x] **IA no publica** — IA solo `VacancyQuestion origin='AI_DRAFT'`; sin rutas de escritura canónicas; `publishedBy=SYSTEM:*` siempre (doc 11).
- [x] **históricos reconstruibles** — REC-3 (reconstrucción exacta tras mutar banco+retirar assessment/blueprint) y REC-4 (resultado almacenado intocado).
- [x] **legacy intacto** — LEG-1..4 + REG-6 (byte-idéntico); clasificación LEGACY/KA-V1+/UNKNOWN sin migración ni recálculo.
- [x] **INSUFFICIENT ≠ 0** — knowledgeScore=null con cero evidencia con clave; SCORE-1/SCORE-1b; KnowledgeResult.evidenceStatus=INSUFFICIENT, NUNCA score 0.
- [x] **no se crea nueva fórmula global** — overallScore bit-idéntico (SCORE-4 61.17; REG-5 77.19; ramas intactas); decisión knowledge→overall explícitamente pospuesta (doc 09).
- [x] **JobFit intacto** — Cero cambios (superficie auditada).
- [x] **IPIP intacto** — REG-1 (fórmula y respuestas idénticas).
- [x] **integridad intacta** — REG-3 + cero modificaciones de módulo.
- [x] **contrato intacto** — Cero modificaciones (superficie auditada).
- [x] **aviso intacto** — Cero modificaciones de privacidad/consentimiento (consent gates operando normalmente en la suite).

**RESULTADO: 19/19 ✓**
