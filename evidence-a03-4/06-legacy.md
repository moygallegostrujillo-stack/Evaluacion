# A-03.4 — 06 · LEGACY (PASO 9) + DATOS HISTÓRICOS

## Clasificación de administraciones

| Clase | Criterio | Tratamiento |
|---|---|---|
| `VERSIONED` | aplicación creada post-A-03.4 con cadena congelada completa | todo el ciclo (servir/answering/scoring) usa la versión congelada |
| `NOT_APPLICABLE` | aplicación post-A-03.4 sin items de conocimiento en la vacante | sin administración de knowledge; `knowledgeScore` queda null (nunca 0) |
| `LEGACY` | filas pre-A-03.4 (campos de versión null) en vuelo que completan después del deploy | califican por la vía histórica (`calculateStepScores` + banco vivo) y se **etiquetan explícitamente** `knowledgeVersioningStatus='LEGACY'` al calificar el paso 4 |
| LEGACY completado (histórico) | filas COMPLETED pre-A-03.4 | **intocadas**: ni migración, ni re-cálculo, ni reinterpretación, ni etiquetado retroactivo |

## Verificación (tests reales)

- **PUB-K13 ✅** — aplicación legacy en vuelo: responde por la vía histórica,
  knowledgeScore=100 con la clave viva del banco, campos de versión siguen
  null (`knowledgeAssessmentId`/`Version` = null), snapshot de respuesta null,
  y el estado queda etiquetado `LEGACY` — no migrado a versión.
- **REG-4 ✅** — fila COMPLETED sintética pre-A-03.4 (knowledgeScore 42.42,
  overallScore 42.42, sin metadatos): idéntica después de toda la batería —
  ni el deploy ni los tests la alteraron.

## Reglas respetadas (heredadas A-03.1/A-03.3)

- No se borró ni recalcó ningún dato histórico.
- No se inventaron metadatos para filas legacy (los campos permanecen null;
  la etiqueta LEGACY solo se escribe al completar en vuelo, nunca retroactivamente).
- No se creó blueprint/versionado histórico para administraciones que no lo
  tuvieron.
- El fallback `?? 0` del scoring legacy NO se tocó (es el comportamiento
  histórico de esa vía; su corrección corresponde a A-03.2/A-03.3). Las
  administraciones VERSIONED no lo usan: item sin clave ⇒ excluido del
  denominador y knowledgeScore null si no hay evidencia clave (K-INS).

## CSV

`evidence-a03-4/public-knowledge-versioning.csv` — 16 filas generadas de las
administraciones reales de la batería:
`LEGACY` (versiones N/A), `LEGACY_UNTOUCHED_PRE_A034` (histórico intacto),
`COMPLETED_LEGACY` (en vuelo completado), `KA-v1/v2/v3` con `itemVersion`
por item y `snapshotStatus` FROZEN_KEYED — `candidateCanModify=NO`,
`correctAnswerExposed=NO` en todas.
