# A-03.4 — 03 · SNAPSHOT (PASO 3)

**Snapshot específico para public apply, sin exponer la clave al candidato.**

## 1. Dos niveles de snapshot

### Nivel administración (`KnowledgeAssessmentItem`) — fuente de verdad congelada

| Campo | Contenido |
|---|---|
| `questionSnapshot` | JSON `{text, options[], type}` congelado al publicar |
| `correctAnswerSnapshot` | clave (índice 0-based) congelada; `null` = sin clave (no puntúa) |
| `hasKey` | bandera de puntuable (K-INS: sin clave ⇒ nunca puntúa, nunca 0) |
| `itemVersion` / `order` / `difficulty('UNKNOWN')` / `source` | metadatos de la generación |

### Nivel respuesta (`VacancyApplicationResponse`) — evidencia de reconstrucción

Escrito por el servidor en `step=answer` (solo sección CONOCIMIENTOS y solo
administraciones VERSIONED):

| Campo | Contenido |
|---|---|
| `itemVersion` | versión del item respondido |
| `questionSnapshot` | copia del snapshot de pregunta visible al responder |
| `correctAnswerSnapshot` | clave congelada usada para calificar esa respuesta |
| `scoringVersionSnapshot` | `PUB-KS-v1` de la administración |

La cadena de reconstrucción (PUB-K15, verificado en tests):

```
Candidate → VacancyApplication(knowledgeAssessmentId)
          → KnowledgeAssessment (assessmentVersion / blueprintVersion / scoringVersion)
          → KnowledgeAssessmentItem (itemVersion + questionSnapshot + correctAnswerSnapshot)
          → VacancyApplicationResponse (value + snapshots)
          → Result (knowledgeScore / overallScore)
```

El resultado histórico se recalcula SOLO con datos congelados; el banco vivo no
participa (`scoreKnowledgeFromFrozenAdministration` nunca consulta
VacancyQuestion/Question).

## 2. Protección de la clave

- `GET step 4` (VERSIONED) devuelve por item: `id, questionId, text, type,
  category, options, order` — **sin** `correctAnswer` ni snapshots
  (verificado con deep-scan JSON del cuerpo completo: PUB-K14).
- `correctAnswerSnapshot` vive SOLO en filas de BD; ninguna ruta de respuesta
  pública lo selecciona/serializa.
- El endpoint de administración `GET /api/vacancies/[id]/knowledge-versions`
  (RLS + rol) expone metadatos de versión/texto pero **omite deliberadamente**
  `correctAnswerSnapshot`.
- `step=answer` rechaza con 403 cualquier intento del cliente de enviar
  `correctAnswer` / `correctAnswerSnapshot` (PASO 10).

## 3. Qué NO cambia

- Flujo legacy (filas pre-A-03.4): respuestas sin snapshots
  (`correctAnswerSnapshot = null`) — no se reinterpretan (PASO 9).
- Secciones psicométrica/psicológica/integridad: sin snapshots (fuera de alcance).
