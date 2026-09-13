# A-03.3 — PASO 7 · PUBLICACIÓN (GOBERNANZA DEL CICLO DE VIDA)

## Ciclo de vida

```
DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED
                    ↘ REJECTED
```

Aplica a: ítems (heredado A-03.1/A-03.2, `KNOWLEDGE_ITEM_STATUSES`),
blueprints y requirements (`KNOWLEDGE_GOVERNANCE_STATUSES`) y assessments
(`KNOWLEDGE_ASSESSMENT_STATUSES`: DRAFT, APPROVED, ACTIVE, SUSPENDED, RETIRED).

## Compuertas de publicación del ASSESSMENT (KPUB-KA-1..6)

`canPublishKnowledgeAssessment(input)` — módulo puro
(`src/lib/knowledge/governance.ts`). Un Assessment SOLO puede publicarse si:

| Compuerta | Condición |
|---|---|
| KPUB-KA-1 | blueprint **APPROVED** |
| KPUB-KA-2 | **todos** los requirements APPROVED (y al menos uno) |
| KPUB-KA-3 | **todos** los ítems APPROVED (o ACTIVE — ya superaron la aprobación; y al menos uno) |
| KPUB-KA-4 | **correctAnswer presente** en todos los ítems |
| KPUB-KA-5 | **scoringVersion definida** |
| KPUB-KA-6 | **versionado completo**: assessmentVersion + blueprintVersion + itemVersion en todos los ítems |

- La función devuelve TODAS las razones de falla (no solo la primera) para
  auditoría.
- El generador exige el paso de las 6 compuertas antes de publicar `KA-v1`;
  sin éxito lanza `KNOWLEDGE_ASSESSMENT_PUBLISH_BLOCKED` (no se publica un
  assessment incompleto).

## Compuertas por ítem (herencia A-03.2, intactas)

`canPublishKnowledgeItem`: sin clave (`KNOWLEDGE_KEY_MISSING`), clave fuera de
rango (`KNOWLEDGE_KEY_OUT_OF_RANGE`), sin fuente, sin revisión o sin versión ⇒
NO publica. Reutilizada por la API POST (un reactivo solo nace ACTIVE si la
compuerta pasa y queda ligado a un requirement).

## Publicación ≠ funcionalidad (límite documentado)

Se mantiene la distinción heredada de A-03.1 (KPUB-8): el estado de
publicación es metadata de gobernanza; el runtime de administración sigue
sirviendo las plantillas CONOCIMIENTOS activas. En A-03.3 la brecha se reduce
(al nacer, todo ítem ya lleva estado y pertenencia; el assessment registra la
versión publicada), pero un ítem que queda en DRAFT tras un cambio sigue
siendo servible funcionalmente hasta que exista un flujo de aprobación UI
(ver 13-limitations.md L-4).

## Registro real (DB, post-seed)

```
KnowledgeBlueprints : 5  (Mesero/a, Cocinero/a, Bartender, Gerente de Piso, Vendedor/a — v1 APPROVED)
KnowledgeRequirements : 12 (APPROVED, sincronizados con el blueprint)
KnowledgeAssessments  : 5  (KA-v1 ACTIVE, scoring=KNOWLEDGE-SCORING-1.0, publishedBy=A-03.2-GOVERNANCE)
KnowledgeItemVersions : 50 (v1 ACTIVE, changeReason=INITIAL)
Items ACTIVE sin requirement: 0
```
