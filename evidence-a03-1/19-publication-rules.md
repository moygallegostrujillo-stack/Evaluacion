# EVALUHR — A-03.1 · PASO 19
# REGLAS DE PUBLICACIÓN DE REACTIVOS E INSTRUMENTOS

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.5 PASO 18 (ciclo DRAFT/REVIEW/APPROVED/ACTIVE/SUSPENDED/RETIRED/
> REJECTED para criterios — armonizado aquí al nivel reactivo/instrumento);
> PASOS 7/14 de esta fase.

---

## 1. Ciclo de vida del KnowledgeItem

```
        ┌──────────┐
        │  DRAFT   │  borrador (humano o IA_DRAFT marcado); campos en construcción
        └────┬─────┘
             │ borrador completo (autor, source, propuesta de clave+rationale)
             ▼
        ┌──────────┐   rechazo motivado (duplicado, opinión KS, sin clave…)
        │  REVIEW  │────────────────────────▶ REJECTED (registrado; itemId no reutilizado)
        └────┬─────┘
             │ KI-VAL-1..8 completo + dictamen favorable
             ▼
        ┌──────────┐
        │ APPROVED │  reactivo aprobado (clave validada, versión asignada), aún sin publicar
        └────┬─────┘
             │ inclusión en una assessmentVersion publicada (KPUB)
             ▼
        ┌──────────┐   defecto detectado (clave, ambigüedad, duplicado, source cambió)
        │  ACTIVE  │──────────────────┐
        └────┬─────┘                  ▼
             │                    SUSPENDED (sale de nuevas administraciones;
             │ obsolescencia /      administraciones previas se reevalúan — KSEC)
             │ sustitución
             ▼
        ┌──────────┐
        │  RETIRED │  histórico conservado; itemId jamás reutilizado
        └──────────┘
```

Armonización con el ciclo de criterios (A-02.5 PASO 18): mismos 7 estados y
misma lógica de transición, aplicados al reactivo; el reactivo APPROVED solo
"opera" dentro de una instrumento ACTIVE.

## 2. Regla dura del encargo

> **Un reactivo sin `correctAnswer`, sin `source`, sin `review` y sin
> `version` NO puede ser ACTIVE.**

Formalización KPUB-1 (compuerta mínima del reactivo):

| Requisito | Si falta | Estado máximo alcanzable |
|---|---|---|
| `correctAnswer` persistida y validada (con rationale) | KI-VAL-3 falla | DRAFT/REVIEW — jamás ACTIVE (y si se administra igual: INSUFFICIENT, K-INS-1) |
| `source` citada con versión/fecha | KI-VAL-1 falla | DRAFT — jamás ACTIVE |
| `review` humana registrada (≠ autor, con dictamen) | CP-5 falla | DRAFT/REVIEW — jamás ACTIVE |
| `version` asignada | KGOV-2 incompleto | No transita ningún estado — el registro es inválido |

Los cuatro son **acumulativos e indivisibles**: falta uno ⇒ no ACTIVE.
(En el estado vigente del sistema, el generador produce "preguntas" sin
clave: bajo este modelo no son publicables y sus administraciones salen
INSUFFICIENT — PASO 6.)

## 3. Compuertas de publicación del instrumento (KPUB-2..KPUB-8)

Una assessmentVersion se publica (ACTIVE) **solo si**:

| # | Compuerta | Referencia |
|---|---|---|
| KPUB-2 | Blueprint aprobado con dominios → requisitos `knowledgeRelevance = VALID` | PASO 2/3 |
| KPUB-3 | Todo item del set es APPROVED y cumple KPUB-1 | Este PASO §2 |
| KPUB-4 | Cobertura declarada del blueprint satisfecha por el set (sin reactivos fuera de dominio) | K-BP-3 |
| KPUB-5 | Ningún item es duplicado de otro ACTIVE (chequeo KSEC-1 registrado) | PASO 14 |
| KPUB-6 | Regla de scoring versionada (`scoringVersion`) definida y reproducible sobre el set | PASO 10/15 |
| KPUB-7 | Las 4 versiones registradas y compuestas (assessment = blueprint + items + scoring) | PASO 15 |
| KPUB-8 | Registro de publicación con responsable humano y matrices actualizadas (PASO 18) | PASO 16/18 |

## 4. Reglas transversales (heredadas y reforzadas)

1. **Toda transición es un acto registrado** (actor, fecha, motivo) —
   append-only; ningún estado es asignable por el sistema solo ni por IA
   (AI-X24/X25).
2. **REVIEW obligatorio de re-ingreso** cuando: cambia la source citada
   (KSEC-11), el puesto cambia de versión mayor, o una auditoría encuentra
   desviación.
3. **REJECTED no borra**: el rechazo queda con su motivo (anti "reactivos
   fantasma"); el itemId no se reutiliza.
4. **SUSPENDED es siempre investigado**: administraciones que incluyeron el
   item suspendido puntuado → score no reconstruible ⇒ INSUFFICIENT con
   causa (KR-1.5, KSEC-2/3).
5. **RETIRED conserva histórico** consultable con todas sus versiones
   (KVER-4).
6. **Publicación ≠ funcionalidad**: PUBLICAR significa que el artefacto
   existe metodológicamente con gobernanza completa. **No** significa que
   exista software implementado (nada de A-03.1 está implementado — regla
   final del encargo). Hoy, tras A-03.1, no existe ningún instrumento de
   conocimientos ACTIVE: la matriz PASO 18 refleja EJEMPLOS y estados
   DRAFT/REVIEW ilustrativos.
