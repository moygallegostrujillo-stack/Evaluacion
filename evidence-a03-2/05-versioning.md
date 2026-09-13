# EVALUHR — A-03.2 · PASO 18d
# VERSIONADO (05-versioning)

> Documento de diseño/implementación. Fecha: 2026-09-10. Fase A-03.2.
> Coherencia: A-03.1 PASO 15 (4 versiones; históricos intactos).

---

## 1. Versiones implementadas

| Versión | Campo | Dónde vive | Valor actual |
|---|---|---|---|
| **scoringVersion** (knowledge) | `knowledgeScoringVersion` | `EvaluationTemplate` (CONOCIMIENTOS) + `EvaluationResult` + `VacancyApplication` | `KNOWLEDGE-SCORING-1.0` (constante `KNOWLEDGE_SCORING_VERSION`) |
| **itemVersion** | `Question.itemVersion` | `Question` | 1 en creación; +1 en cada cambio de clave |
| **assessmentVersion / blueprintVersion** | No existían como columnas; el equivalente operativo hoy es la pareja `(EvaluationTemplate activo + set de Question con itemVersion)` y la regla de scoring `knowledgeScoringVersion` | — | Queda documentado como deuda (§4) |

Regla de composición vigente: una administración queda identificada por
`(sessionId, templateId, [itemVersion por question], knowledgeScoringVersion)`
— suficiente para reproducir el scoring con las claves congeladas
(`correctAnswerSnapshot` por respuesta).

## 2. Cuándo se crea una nueva versión

| Cambio | Efecto |
|---|---|
| `question` | itemVersion +1 (mayor) — PUT /api/questions registra auditoría |
| `options` | itemVersion +1 (mayor) |
| **`correctAnswer`** | itemVersion +1 (mayor) + `previousCorrectAnswer` + `correctAnswerChangedAt` + AuditLog con old/new |
| `scoring` (regla) | nueva `knowledgeScoringVersion` (constante versionada en código) |

Cambio cosmético (redacción sin efecto semántico) queda permitido como
versión menor en el modelo A-03.1; en esta implementación PUT incrementa
versión ante cambios de contenido y clave (enfoque conservador — siempre
versión mayor).

## 3. Inmutabilidad de históricos (PASO 10)

1. El resultado (`EvaluationResult` / `VacancyApplication`) guarda el score
   calculado y su `knowledgeScoringVersion` — no existe ruta de recálculo.
2. Cada respuesta congela la clave usada (`correctAnswerSnapshot`) — el
   desenlace no depende de la clave vigente posterior.
3. Cambiar la clave hoy: crea versión nueva SOLO para administraciones
   futuras; el histórico queda idéntico.
4. TEST 8 demuestra que el desenlace re-derivado desde el snapshot no cambia
   aunque la clave vigente cambie.

## 4. Deuda documentada (fuera del alcance de A-03.2)

- Columnas explícitas `assessmentVersion` y `blueprintVersion` en el modelo
  de datos (A-03.1 PASO 15 las define al nivel del instrumento completo):
  requieren el modelo de Blueprint de A-03.1 aún no implementado. Hoy la
  reproducibilidad está garantizada por snapshots + versiones registradas.
- Flujo de re-revisión obligatoria tras cambio de clave (A-03.1: nueva
  versión → REVIEW): el PUT actual registra auditoría y versión; el flujo de
  re-revisión completo es trabajo futuro.
- Los resultados históricos creados antes de A-03.2 tienen
  `knowledgeStatus = null` (legacy): se interpretan como "pre-correctanswer"
  y jamás se recalculan (ver 06-migration-impact.md).
