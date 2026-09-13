# EVALUHR — A-03.1 · PASO 18b
# GOBERNANZA DE REACTIVOS DE CONOCIMIENTOS (KNOWLEDGE ITEM GOVERNANCE)

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.5 PASO 15 (gobernanza de criterios: proposal→publication,
> separación de duties, campos mínimos, anti-manipulación) — adaptada al
> reactivo; A-02.2 PASO 16 (gobernanza de evidencia, append-only);
> PASOS 4/5/14/15/16/19 de esta fase.

---

## 1. Objeto

Definir **quién decide qué** en el ciclo de vida de un KnowledgeItem, con
qué campos, qué registros y qué controles — de modo que ningún reactivo
llegue a administrarse sin autoría, revisión, clave validada, fuente y
versión documentadas.

## 2. Roles y separación de duties (KGOV-1)

| Rol | Funciones | Restricciones |
|---|---|---|
| **Analista de puesto** | Produce KnowledgeRequirements (KF1–KF7) y propone dominios | No auto-aprueba sus propios dominios |
| **Proponente de blueprint** | Arma el blueprint (dominios, subdominios, cobertura) | Distinto del aprobador del blueprint |
| **Autor de reactivos** | Redacta items (humano) o **IA como borradorista** (origin=AI_DRAFT, siempre DRAFT) | La IA no puede estar en ningún otro rol (AI-X20..X25) |
| **Revisor de contenido** | Evalúa KI-VAL-1..8 por item-version; dictamina | **Deben tener conocimiento del contenido citado; obligatoriamente ≠ autor** (KSEC-8) |
| **Aprobador** | Otorga APPROVED, asigna versión, responde por la clave | Humano designado por gobernanza; ≠ autor; revisión previa completa (CP-4/CP-5) |
| **Publicador de gobernanza** | Ejecuta transición a ACTIVE del instrumento tras KPUB-1..8 | Acto registrado; jamás IA (AI-X25) |
| **Auditor** | Verifica cadena PASO 16, muestreos KSEC-4 | Independiente de autoría/revisión/aprobación |

Regla dura: **ninguna persona puede ocupar dos roles sobre el mismo item**
(autor+revisor, revisor+aprobador…). Violación = hallazgo de gobernanza con
invalidación del item.

## 3. Campos mínimos de gobernanza por reactivo (KGOV-2)

Heredados del esquema de campos mínimos de A-02.5 (criterionId / jobId /
rationale / source / approvedBy / version), adaptados al item:

| Campo | Contenido |
|---|---|
| `itemId` | Identidad inmutable del reactivo |
| `jobId` + `blueprintId` | Puesto y mapa a los que pertenece |
| `domain` / `subdomain` | Pertenencia obligatoria a dominio pre-establecido (K-BP-1) |
| `rationale` | Justificación de la clave contra la source (obligatorio para KI-VAL-3) |
| `source` | Fuente citada con versión/fecha (KF1–KF7) |
| `author` + `origin` | Humano, o IA_DRAFT con marcador |
| `reviewedBy` + `reviewDate` + `reviewFindings` | Revisión humana registrada con dictamen por KI-VAL |
| `approvedBy` + `approvalDate` | Acto humano de gobernanza |
| `version` | itemVersion (mayor/menor — PASO 15) |
| `status` + `statusHistory` | Ciclo PASO 19 con fechas y actores (append-only) |
| `difficulty` + `difficultyBasis` | UNKNOWN / juicio marcado / evidencia futura (PASO 9) |

Un reactivo sin alguno de estos campos no avanza de estado (KPUB-1).

## 4. Proceso de gobernanza (ciclo completo)

```
Propuesta de dominio (analista) → revisión/aprobación de blueprint
   → creación de items (autor humano o IA_DRAFT)
      → revisión de contenido (KI-VAL-1..8, revisor experto)
         → corrección (autor; sugerencias IA evaluadas por humanos)
            → aprobación (aprobador; clave + versión)
               → publicación (gobernanza; KPUB-1..8 del PASO 19)
                  → mantenimiento (suspensión/retiro/revalidación;
                     revisión obligatoria si cambia la source — KSEC-11)
```

Cada transición es un **acto registrado** (actor, fecha, motivo, base
documental) — append-only; prohibida la edición silenciosa (herencia
A-02.5 PASO 18 §2 y A-02.2 PASO 16).

## 5. Controles anti-manipulación (KGOV-3)

1. **No auto-aprobación**: prohibiciones de doble rol (§2) verificables en
   el statusHistory.
2. **No aprobación por lote sin evidencia de lectura**: el registro de
   revisión exige dictamen por KI-VAL (los 8, con notas) — un "aprobado"
   sin dictámenes es inválido (CP-3).
3. **IA bajo candado**: la IA no puede escribir en campos de gobernanza
   (reviewedBy, approvedBy, status, version, correctAnswer final, source
   definitiva) — AI-X20..X25; sus propuestas se registran como sugerencias
   separadas.
4. **Id no reutilizado**: itemId/blueprintId jamás se reciclan (KVER-3).
5. **Historial inmutable**: correcciones crean versiones; el historial no
   se edita (KSEC-5/7).
6. **Clave protegida**: acceso a correctAnswer/rationale restringido y
   registrado (KSEC-9).
7. **Auditoría por muestreo**: verificación periódica de items ACTIVE
   (cadena completa + reproducción del scoring con las versiones
   registradas) — requerimiento de gobernanza para la etapa operacional.

## 6. Revisión periódica (PROPUESTA)

Herencia de A-02.5 PASO 15 (revisión periódica propuesta): revalidación
programada de dominios e items cuando (a) cambie el puesto, (b) cambie la
source citada (KSEC-11), (c) transcurra el intervalo que gobernanza defina
(hoy SIN DEFINIR — a establecer en la etapa operacional), o (d) una
auditoría detecte desviación. La revalidación fallida ⇒ REVIEW obligatorio
⇒ SUSPENDED/RETIRED según corresponda.

## 7. Coherencia con la gobernanza de criterios

- El item no existe sin dominio; el dominio no existe sin requisito
  VALID; el requisito alimenta un criterio de categoría A ya gobernado por
  A-02.5 (proposal→publication, campos mínimos). Ambas gobernanzas son
  **complementarias y encadenadas**: gobernanza de criterio (A-02.5) ←
  gobernanza de blueprint/item (esta fase).
- La matriz `knowledge-evidence-model.csv` refleja el estado documental de
  la cadena item↔dominio↔requisito y se actualiza con cada acto de
  gobernanza (KAUD-6).
