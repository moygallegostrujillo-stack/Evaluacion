# A-03.5 — MODELO CANÓNICO (PASO 2)
## Definición formal de la cadena única de Knowledge Assessment

## 1. La cadena canónica (implementada y verificada)

```
JOB (Position | Vacancy)
  → KnowledgeBlueprint            (jobId + jobType + blueprintVersion)
    → KnowledgeRequirement        (blueprintId; domain/subdomain/description/
                                   importance/source/rationale/version/status)
      → KnowledgeItemVersion      (requirementId + itemId + itemVersion;
                                   question/options/correctAnswer PROTEGIDA/
                                   source/rationale/difficulty/status)
        → KnowledgeAssessment     (jobId + jobType + blueprintId +
                                   assessmentVersion + scoringVersion + status +
                                   publishedAt + publishedBy — SYSTEM only)
          → KnowledgeAssessmentItem (copia congelada por administración;
                                     requirementId + itemVersionId resueltos)
            → KnowledgeAdministration (candidato: aplicación pública O sesión
                                        interna; versiones denormalizadas)
              → Response (+ snapshots server-side)
                → KnowledgeResult  (evidencia: VALID/LIMITED/INSUFFICIENT/…
                                    INSUFFICIENT ≠ 0; SEPARADO de overallScore)
```

Ambos canales (PÚBLICO = Vacancy / INTERNO = Position) resuelven la MISMA
cadena con las MISMAS funciones (`src/lib/knowledge-canonical.ts`).
El canal no puede cambiar el instrumento (PASO 16 — verificado XFLOW-1..3).

## 2. Entidades (schema real, `prisma/schema.prisma`)

| Entidad | Clave | Campos gobernantes | Invariantes |
|---|---|---|---|
| `KnowledgeBlueprint` | `blueprintId` (cuid) | jobId, jobType (POSITION\|VACANCY), companyId, blueprintVersion (BP-v{n}), status (ACTIVE\|RETIRED), contentHash (estructura de requirements) | Único ACTIVE por job; ligado SIEMPRE a un job real; la `category` global de Question NUNCA lo sustituye |
| `KnowledgeRequirement` | `requirementId` | blueprintId, domain, subdomain, description, importance (REQUIRED\|OPTIONAL — sin pesos), source (SYSTEM_DERIVED\|AI_DRAFT_ORIGIN\|HUMAN), rationale, sourceItemId, version, status (DRAFT\|APPROVED\|RETIRED) | APPROVED solo vía publicación SYSTEM; todo item administrado resuelve UNO |
| `KnowledgeItemVersion` | id | requirementId, itemId, itemType, itemVersion, question, options (JSON), correctAnswer (PROTEGIDA — server-only), hasKey, source (VACANCY_BANK\|TEMPLATE_BANK\|AI_DRAFT), rationale, difficulty (UNKNOWN — nunca inventada), status | Inmutable tras publicación; NUNCA cambia de requirement (PASO 17); bump solo por cambio de contenido |
| `KnowledgeAssessment` | id | jobType, vacancyId?, positionId?, companyId, version (KA-v{n}), blueprintId, blueprintVersion, scoringVersion (PUB-KS-v1), status (ACTIVE\|RETIRED), contentHash, itemCount, publishSource, publishedBy ('SYSTEM:KNOWLEDGE_FREEZE'), publishedAt, retiredAt | Una fila por (job, versión); publicado SOLO por SYSTEM; reutilizado por contentHash |
| `KnowledgeAssessmentItem` | (assessmentId, itemId) | + requirementId + itemVersionId (resolución canónica) | Filas pre-canónicas (A-03.4) conservan links null y se documentan como KA-V1+ PRE-CANONICAL — sin migración silenciosa |
| `KnowledgeAdministration` | id | channel (PUBLIC_VACANCY\|INTERNAL_POSITION), assessmentId, assessmentVersion, blueprintId, blueprintVersion, scoringVersion, itemCount, status (FROZEN\|COMPLETED), frozenAt, vacancyApplicationId?, evaluationSessionId? | ÚNICA por aplicación/sesión (FK unique); denormaliza las versiones congeladas |
| `KnowledgeResult` | id | administrationId (unique), knowledgeScore (Float? — null = INSUFFICIENT, NUNCA 0), evidenceStatus (VALID\|LIMITED\|INSUFFICIENT\|INVALID\|NOT_APPLICABLE), reasonCode, correctCount, keyedAnsweredCount, notScorableCount, totalItems, scoringVersion | Entidad SEPARADA de overallScore (PASO 11); idempotente por administración |

## 3. Reglas de versionado (preservando A-03.4)

1. **assessmentVersion** sube cuando cambia el `contentHash` del banco (contenido completo: texto+opciones+clave+orden+tipo).
2. **blueprintVersion** sube SOLO cuando cambia la ESTRUCTURA de requirements (domain/subdomain/description/importance/sourceItemId). El hash de estructura NO incluye claves ni orden de opciones — la clave es material de scoring, no estructura (verificado: CHG-7).
3. **itemVersion** sube SOLO cuando cambia el contenido del item (texto/opciones/clave) respecto a su última edición publicada. Item sin cambios → reutiliza su edición (lineage preserved; verificado CHG-6).
4. **Una edición publicada jamás cambia de requirement** (PASO 17 — verificado INTG-3). Re-vincular es imposible; un cambio de contenido crea una edición nueva.
5. **historical immutability**: filas ya congeladas nunca se modifican ni reinterpretan; el banco vivo solo afecta a NUEVAS administraciones.

## 4. Derivación de requirements (sin invención)

Cada item del banco deriva 1:1 un requirement:
- `domain` = 'JOB_KNOWLEDGE' (fijo — la categoría global de Question no se usa como blueprint).
- `subdomain` = 'VACANCY_BANK' | 'POSITION_TEMPLATE' (procedencia real del item).
- `description` = «Conocimiento verificado por el ítem: "<texto>"» (única señal de conocimiento honesta disponible).
- `importance` = 'REQUIRED' (todo item administrado lo es; sin pesos).
- `source` = 'AI_DRAFT_ORIGIN' si el item del banco tiene origin='AI_DRAFT', si no 'SYSTEM_DERIVED'.
- `rationale` = trazabilidad completa (item, job, canal, origen).
- `sourceItemId` = itemId del banco (enlace determinista requirement↔item).

## 5. Verificación (57/57 PASS — scripts/a035-tests.ts)

- CAN-1..7: cadena completa materializada en DB para el flujo público.
- INT-1..4: la misma cadena para el flujo interno.
- CHG-5/6/7: semántica exacta de bumps (item/bp/assessment).
- INTG-1..3: invariantes estructurales en TODAS las filas canónicas.
- CSV `knowledge-canonical-model.csv`: 71 filas reales (1 compañía de prueba completa) mostrando la evolución KA-v1→KA-v4 / BP-v1→BP-v2 / itemVersion v1→v3.
