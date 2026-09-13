# EVALUHR — A-03.2 · PASO 18b
# GOBERNANZA DE CORRECTANSWER (03-correctanswer-governance)

> Documento de gobernanza. Fecha: 2026-09-10. Fase A-03.2.
> Define de dónde proviene una clave, quién puede establecerla/aprobarla y
> qué controles la protegen. Coherencia: A-03.1 PASO 4/5/14/18/19.

---

## 1. Fuentes admisibles de una correctAnswer (PASO 4)

| Fuente | Código (`correctAnswerSource`) | Ejemplo | Requisito |
|---|---|---|---|
| Documento interno | `DOCUMENTAL` | Manual de servicio v2, apartado 3.1 | Documento citado con versión |
| Experto | `EXPERTO` | Chef validador de la clave técnica | Identificación del experto |
| Material del cliente | `MATERIAL_CLIENTE` | Catálogo de precios con vigencia | Documento con fecha de corte |
| Normativa aplicable | `NORMATIVA` | NOM-251-SSA1-2010 (temperaturas) | Cita normativa exacta |
| Elaboración revisada | `ELABORACION_REVISADA` | Banco del sistema (contenidos generales del sector) | Revisión humana registrada |

Regla: **toda clave ACTIVE debe declarar una fuente**. La compuerta
`canPublishKnowledgeItem()` (src/lib/knowledge/scoring.ts) rechaza la
publicación sin fuente (`KNOWLEDGE_KEY_SOURCE_MISSING`).

## 2. Quién establece y quién aprueba (PASO 5)

- **La IA puede PROPONER** una respuesta (borrador) — marcada en `origin`
  como `AI_DRAFT`; jamás aprueba ni publica (AI-X21/AI-X24 de A-03.1,
  reforzadas por `isPublishingActorAllowed()`).
- **El flujo obligatorio es**: IA/borrador → revisión humana → aprobación →
  publicación. En esta implementación limitada:
  - Las claves del **banco del sistema** provienen de
    `ELABORACION_REVISADA` — establecidas y revisadas por la gobernanza
    humana de la fase A-03.2 (registradas como
    `reviewedBy/approvedBy = A-03.2-GOVERNANCE`, `origin = SYSTEM_BANK`).
  - Las claves creadas por **RH** vía `/api/questions` registran
    `origin = HUMAN` y `reviewedBy/approvedBy = actor` (usuario autenticado
    con rol RH/GERENTE/SUPER_ADMIN — verificado server-side).
- **La IA NO puede**: publicar, declarar validación, establecer
  obligatoriedad, decidir sola `correctAnswer`, cambiar una respuesta
  aprobada ni modificar retrospectivamente resultados (garantizado por:
  rol gate en la API + `isPublishingActorAllowed` + ausencia de rutas de
  escritura para IA).

## 3. Estados de un KnowledgeItem (PASO 2)

Ciclo de vida (`Question.knowledgeStatus`, solo para category=KNOWLEDGE;
null en preguntas no-knowledge):

```
DRAFT → REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED
                    ↓ (rechazo motivado)        ↑ (defecto/source cambió)
                 REJECTED                        SUSPENDED
```

Distinción de scoring, derivada (una sola fuente de verdad):

| Condición | Scorability |
|---|---|
| `correctAnswer` no null | `SCORABLE` |
| `correctAnswer` null | `NOT_SCORABLE` |

## 4. Compuertas de publicación (PASO 3)

Un item solo puede estar ACTIVE si `canPublishKnowledgeItem()` pasa completo:

1. `correctAnswer` presente (`KNOWLEDGE_KEY_MISSING` si no) — **no existe
   item ACTIVE con clave null**; la API rechaza el create sin clave (400
   `KNOWLEDGE_KEY_REQUIRED`).
2. Clave dentro del rango de opciones (`KNOWLEDGE_KEY_OUT_OF_RANGE`).
3. `correctAnswerSource` presente (`KNOWLEDGE_KEY_SOURCE_MISSING`).
4. `reviewedBy` presente (`KNOWLEDGE_REVIEW_MISSING`).
5. `itemVersion ≥ 1` (`KNOWLEDGE_VERSION_MISSING`).

## 5. Controles de seguridad (PASO 14)

| Control | Implementación |
|---|---|
| Ningún candidato puede modificar correctAnswer | POST/PUT/DELETE `/api/questions` exigen rol RH/GERENTE/SUPER_ADMIN; CANDIDATO ⇒ 403 + `logUnauthorizedAccess` |
| Ningún cliente HTTP puede establecer una clave aprobada | Única ruta de escritura = API de preguntas con rol; no existen endpoints públicos de escritura de claves (el flujo público solo lee preguntas sin clave) |
| Ningún frontend puede escribir correctAnswer | La API de evaluación solo acepta `value` (respuesta); jamás `correctAnswer` |
| correctAnswer solo por flujo autorizado | Roles + validación de rango + gobernanza registrada (§2) |
| Cambio de clave queda auditado | PUT: `previousCorrectAnswer` + `correctAnswerChangedAt` + `itemVersion+1` + `logAuditEvent` con old/new |
| Versionado append-only | `itemVersion` incrementa; historial en AuditLog; sin edición silenciosa |

## 6. Exposición de la clave

- **Candidato**: NUNCA recibe `correctAnswer` (undefined en todas las
  serializaciones de `/api/evaluations` y `/api/questions`) — verificado
  E2E.
- **RH/GERENTE/SUPER_ADMIN**: pueden ver la clave (consola de administración
  de preguntas, edición con marcador visual).
- **Flujo público de vacantes**: ya ocultaba la clave (pre-existente) — se
  conserva.
