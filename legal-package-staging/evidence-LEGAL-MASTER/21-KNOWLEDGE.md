# EVALUHR — LEGAL MASTER PACKAGE · 21 · KNOWLEDGE (PASO 18)

## 1. Auditoría del módulo (verificada en repo)

| Aspecto | Estado | Evidencia |
|---|---|---|
| correctAnswer | PROTEGIDO server-side; **nunca serializado al candidato** ("correctAnswer deliberately NOT serialized — A-03.5 PASO 9") | `evaluations/route.ts:86-135`; `public/apply/route.ts:931,955,969` ("NEVER expose the frozen key"); snapshots server-only (:1316) |
| Evidencia | Congelada e inmutable por administración; snapshots en cada ítem | `KnowledgeAdministration` frozen, 1:1 con sesión/aplicación |
| Versionado | KA-v{n}/BP-v{n}/PUB-KS-v{n} con `contentHash` | schema.prisma:486-715 |
| Snapshot | `correctAnswerSnapshot` server-only; respuestas con snapshot por ítem | Ídem |
| Scoring | `scoreCanonicalAdministration` + `writeKnowledgeResult`; **INSUFFICIENT ≠ 0** (null = sin evidencia válida) | `src/lib/knowledge-canonical.ts` |
| Derechos | Contenido propio del proyecto; verificar bancas externas si se integraran | — |
| Procedencia | Bancos por puesto/sector + **generación IA (AI_DRAFT)** sin autoridad de publicación (`publishedBy='SYSTEM:KNOWLEDGE_FREEZE'`) | generate-questions route |
| IA | Solo redacción de borradores; publicación = sistema/humano | Ídem |
| Publicación | Solo SYSTEM; ítems APPROVED únicamente por flujo de publicación | Ídem |

## 2. Qué requiere revisión legal (dictamen)

1. **Exposición de `correctAnswer` al browser admin** (endpoints RH devuelven la key a usuarios autenticados para gestión) — riesgo de fuga interna; dictamen sobre adecuación y control de acceso.
2. **Retención de evidencia congelada** (sin purga específica) frente a minimización — 15.
3. **Derechos de contenido** si se usan bancos de terceros (hoy no detectados).
4. **Drift dev/prod**: 7 modelos Knowledge ausentes en `schema.prod.prisma` — riesgo de integridad del sistema al desplegar (operacional, afecta la veracidad de la evidencia).
5. Redacción del aviso sobre esta evaluación (no sensible; finalidad técnica).

## 3. Estado

**IMPLEMENTED** — módulo más maduro; sin hallazgo de exposición al candidato.
