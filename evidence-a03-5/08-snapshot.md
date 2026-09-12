# A-03.5 — PASO 9: SNAPSHOT
## Independiente del banco vivo — clave jamás expuesta

## Principio

El snapshot debe permitir reconstruir la administración SIN el banco vivo.
A-03.5 añade la edición canónica (KnowledgeItemVersion) como fuente formal,
manteniendo las copias congeladas por administración de A-03.4.

## Qué se conserva (y dónde) para reconstruir

| Dato | Almacenamiento | Fuente |
|---|---|---|
| itemVersion | `KnowledgeAssessmentItem.itemVersion` + link `itemVersionId` → edición canónica | SYSTEM publish |
| pregunta | `questionSnapshot` (JSON {text, options[], type}) + `KnowledgeItemVersion.question/options` | freeze |
| opciones | ídem | freeze |
| **correctAnswer protegida** | `correctAnswerSnapshot` (por administración) + `KnowledgeItemVersion.correctAnswer` (edición canónica) — **server-only** | freeze |
| scoringVersion | `KnowledgeAdministration.scoringVersion` (denormalizado) + `scoringVersionSnapshot` por respuesta | freeze |
| vínculo del candidato | `KnowledgeAdministration` (+ sello en cada respuesta) | freeze / answer |

## Protección de la clave (PASO 9/10 — "Nunca exponer la clave al candidato")

1. **Flujo público** (GET step 4): `correctAnswer: undefined` en cada ítem; deep-scan del payload ⇒ SIN `correctAnswer` ni campos de gobernanza (SEC-2).
2. **Flujo interno** (A-03.5 CIERRA la fuga preexistente): las 4 serializaciones
   de `/api/evaluations` enviaban `correctAnswer: q.correctAnswer` al cliente
   candidato. Ahora: **eliminada de todas** + los ítems de conocimientos se
   sirven del set congelado (INT-2 deep-scan: payload limpio).
3. **Deny-list**: el cliente que intenta ENVIAR `correctAnswer`,
   `correctAnswerSnapshot`, `questionSnapshot`, etc. → 403 (A-03.4 + A-03.5).
4. **Ruta de administración** (`/api/vacancies/[id]/knowledge-versions`, RH):
   expone estructura/hasKey SIN claves (sin cambios de fondo, sigue válida).

## Reconstrucción sin banco vivo (verificada — PASO 18)

Tras MUTAR el banco vivo (texto/clave) y RETIRAR el assessment y el blueprint
históricos, `scoreCanonicalAdministration(administrationId)` reconstruye el
resultado SOLO con la cadena congelada:

```
KnowledgeAdministration → KnowledgeAssessment (RETIRED pero intacto)
  → KnowledgeAssessmentItem (snapshots) → KnowledgeItemVersion (edición)
    → Responses (con snapshot + clave server-side) → knowledgeScore idéntico
```

REC-3: reconstrucción = 100 = resultado original. REC-4: KnowledgeResult
almacenado intocado.
