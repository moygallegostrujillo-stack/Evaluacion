# A-03.3 — PASO 3/4/15 · KNOWLEDGE REQUIREMENT + RELACIÓN REQUISITO → ITEM

## PASO 3 — KnowledgeRequirement

Cada conocimiento requerido tiene justificación trazable al puesto.

### Schema implementado (prisma/schema.prisma)

| Campo encargo | Columna | Notas |
|---|---|---|
| requirementId | `id` | String @id @default(cuid()) |
| blueprintId | `blueprintId` | FK → KnowledgeBlueprint (obligatoria) |
| domain | `domain` | Dominio cerrado del blueprint |
| subdomain | `subdomain` | String? |
| description | `description` | Obligatorio |
| importance | `importance` | CRITICA/ALTA/MEDIA/BAJA — **descriptiva, JAMÁS peso de scoring** (A-03.1 P4/P5 heredado) |
| source | `source` | KF1–KF7 (A-03.1 PASO 2): FUNCIONES, PROCEDIMIENTOS, POLITICAS, CONOCIMIENTOS_TECNICOS, NORMATIVA, EXPERTOS, DOCUMENTACION_CLIENTE |
| rationale | `rationale` | Justificación trazable al puesto (obligatoria) |
| status | `status` | Ciclo de vida sincronizado con el blueprint |
| version | `version` | Int @default(1) |
| (tenant) | `companyId` | FK → Company |

### Reglas KREQ-A33-1..4

1. **KREQ-A33-1** — Todo requirement pertenece a un blueprint (FK obligatoria;
   T2).
2. **KREQ-A33-2** — Sin rationale/source no existe el requirement (columnas
   requeridas).
3. **KREQ-A33-3** — `importance` es un metadato descriptivo; el scoring de
   conocimientos NO usa pesos (regla P4 de A-03.1 intacta — `scoring.ts` sin
   cambios).
4. **KREQ-A33-4** — El catálogo del sistema (`KNOWLEDGE_REQUIREMENT_CATALOG`
   en `system-bank.ts`) DOCUMENTA los dominios que el banco revisado ya
   evalúa (herencia ELABORACION_REVISADA de A-03.2): no se inventan claves ni
   dominios; cada rationale referencia al puesto y al banco.

### Cobertura implementada (12 dominios / 5 puestos)

| Categoría | Dominios (importancia) | Órdenes cubiertos |
|---|---|---|
| MESERO | Operación y protocolo de servicio (CRITICA) · Conocimiento de producto y venta (ALTA) · Inocuidad, higiene y alergias (CRITICA) | 2,3,4,6,8,10 · 1,7 · 5,9 |
| COCINERO | Inocuidad e higiene alimentaria (CRITICA) · Técnicas culinarias y organización (ALTA) | 1,2,4,5,7,9,10 · 3,6,8 |
| BARTENDER | Coctelería y técnicas de preparación (CRITICA) · Producto y vajilla (ALTA) · Servicio responsable (CRITICA) | 1,2,3,7,8,9 · 4,6,10 · 5 |
| GERENTE_PISO | Indicadores y gestión operativa (CRITICA) · Gestión de personal y servicio (ALTA) | 1,3,5,9,10 · 2,4,6,7,8 |
| VENDEDOR | Técnicas de venta (CRITICA) · Atención al cliente en piso de venta (ALTA) | 1,4,5,6,10 · 2,3,7,8,9 |
| GENERAL (fallback) | Servicio al cliente (CRITICA) · Conducta laboral y trabajo en equipo (ALTA) · Higiene y presentación personal (ALTA) | 1,3,7,10 · 2,4,6,9 · 5,8 |

Cobertura 50/50 ítems — **0 huérfanos** (verificado en DB y por el validador
de la cadena `KNOWLEDGE_ORPHAN_ITEMS`).

## PASO 4 — Relación REQUISITO → ITEM

### Schema

- `Question.knowledgeRequirementId` (FK nullable — null = reactivo
  legacy/ajeno a conocimientos).
- `Question.knowledgeBlueprintId` (FK nullable, redundancia de navegación de
  la misma cadena).
- Back-relation `KnowledgeBlueprint.questions` y
  `KnowledgeRequirement.questions`.

### Reglas KLINK-A33-1..3

1. **KLINK-A33-1** — Ningún item ACTIVE puede quedar sin blueprintId +
   requirementId + source + version:
   - El generador liga cada ítem al crearlo y FALLA si el catálogo no cubre
     un orden (`KNOWLEDGE_REQUIREMENT_MISSING` / `KNOWLEDGE_ORPHAN_ITEMS`).
   - La API POST de preguntas solo nace ACTIVE si queda ligada a un
     requirement (autovinculación al primer requirement del blueprint del
     puesto; sin blueprint ⇒ DRAFT, nunca ACTIVE huérfano).
   - Verificación de DB: 0 ítems ACTIVE sin requirement (script
     `a033-classify-blueprint.ts`).
2. **KLINK-A33-2** — Los ítems legacy (pre-A-03.3, sin FK) conservan su
   estado: no se les inventa pertenencia (PASO 16).
3. **KLINK-A33-3** — T3 verifica la cadena completa ítem → requirement →
   blueprint → puesto.

## PASO 15 — Conocimiento subjetivo

Regla heredada e INTACTA (A-03.1 PASO 8, A-03.2):

- Una pregunta subjetiva/autorreporte ≠ reactivo de conocimiento puntuable.
- El detector `looksLikeSubjectiveKnowledgeItem` (scoring.ts l.325–340) y la
  exclusión KS-1..KS-4 permanecen vigentes; el fallback de autorreporte fue
  retirado en A-03.2.
- En A-03.3 los requirements describen dominios con **clave objetiva**:
  un ítem sin clave objetiva no puede ser ACTIVE (KPUB-KA-4 + compuerta por
  ítem), luego ningún requirement alimenta el knowledgeScore con preguntas
  sin clave.
- No se incluyó ninguna pregunta subjetiva en el knowledgeScore ni en el
  catálogo de dominios.
