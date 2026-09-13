# EVALUHR — A-03.1 · PASO 11
# KNOWLEDGERESULT — RESULTADO DE UNA ADMINISTRACIÓN

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.3 PASO 5 (escenarios A–E); PASO 6 (K-CA) y PASO 10 (KSC) de esta
> fase; A-02.3 PASO 3 (CriterionResult, futuro consumidor).

---

## 1. Definición

**KnowledgeResult** es el registro del desenlace de **una administración**
de un KnowledgeAssessment por **una persona**: qué se administró (versiones
exactas), qué se pudo puntuar, qué no, y el estado de evidencia resultante.
Es el equivalente, para conocimientos, del concepto de resultado por
instrumento de A-02.3 (PASO 2), con los campos específicos del encargo.

## 2. Campos (encargo)

| Campo | Contenido | Reglas |
|---|---|---|
| `validItems` | Número de items del set administrado que son puntuables válidos (clave persistida + KI-VAL) | Diagnóstico; no fabrica score si falla el conjunto |
| `invalidItems` | Número de items administrados que NO son puntuables válidos (sin clave, ambiguos, suspendidos, duplicados detectados) | Cada invalidItem se lista con motivo (append-only) |
| `correctItems` | Número de respuestas correctas sobre items puntuables respondidos explícitamente | Diagnóstico crudo; no es el score cuando el status no es VALID |
| `score` | `correctItems / validItems` (CORRECT_OVER_TOTAL) — **solo si procede** (§3) | `null` cuando no se calcula; **jamás 0 por defecto** |
| `status` | VALID / LIMITED / INSUFFICIENT / INVALID / PENDING_REVIEW | Estados de calidad (PASO 12); mapeo a escenarios A–E |
| `version` | `assessmentVersion` usada | Conjunta con las otras versiones (PASO 15) |
| `blueprintVersion` | Versión del blueprint con que se administró | Obligatoria (trazabilidad) |

Campos complementarios de trazabilidad (PASO 15/16): `itemVersion` (por
item), `scoringVersion`, `candidateId`/`administrationId` (referencias),
`reasonCode` (cuando INSUFFICIENT), `reviewRequired`.

## 3. Manejo de items inválidos (pregunta explícita del encargo)

> "Si existe item inválido: explicar cómo se maneja."

Regla **KR-1** (herencia directa del escenario D de A-02.3):

1. **El item inválido no se puntúa** — no entra al numerador ni al
   denominador del score.
2. **El score completo no se fabrica**: si `invalidItems > 0` dentro del set
   administrado, el resultado es `status = INSUFFICIENT`
   (`reasonCode = QUALITY_FAIL`), `score = null`, conservando
   validItems/invalidItems/correctItems como **diagnóstico crudo** visible
   para revisión humana. NO se calcula "aciertos sobre los válidos" ni
   prorrateo (P2/P3 del PASO 10).
3. **La causa de cada invalidItem se documenta** (sin clave, ambiguo,
   suspendido, duplicado…) en el registro — alimenta áreas de revisión
   (herencia T1–T8) y la gobernanza del instrumento (PASO 14).
4. **El candidato no carga el defecto**: el INSUFFICIENT se comunica como
   "información insuficiente para evaluar este criterio" + causa del
   instrumento — jamás como bajo puntaje (K-INS-1 / INSUFFICIENT ≠ 0).
5. **Remediación por proceso humano**: re-administrar con instrumento
   corregido y versionado (decisión humana), nunca auto-recuperación
   silenciosa (escenario E).

Casos particulares:

- `invalidItems = 0` pero administración incompleta → INSUFFICIENT
  (PARTIAL_RESPONSE; escenario C).
- Item inválido **descubierto después** de administrar → administraciones
  previas que lo incluyeron puntuado: score no reconstruible → INSUFFICIENT
  con causa documentada; el item pasa a SUSPENDED y sale en la siguiente
  versión (KSEC-6; PASO 14/19).

## 4. Estados posibles del KnowledgeResult (resumen)

| status | Cuándo | score | reasonCode típico |
|---|---|---|---|
| VALID | Set íntegro puntuable, administración completa, instrumento K-VAL, sin anomalías, revisión | X/Y | — |
| LIMITED | Casos definidos en PASO 12 (p. ej., instrumento VALID con cobertura parcial declarada del criterio) | X/Y si K1–K6 completos | — |
| INSUFFICIENT | Sin clave (K-INS-1) · parcial (C) · items inválidos (D) · no reconstruible (E) | **null** | QUALITY_FAIL / PARTIAL_RESPONSE / TECH_FAILURE |
| INVALID | Administración invalidada por proceso (anomalía grave confirmada, uso indebido) | null | conforme a causa |
| PENDING_REVIEW | Conflicto u observación abierta que impide cerrar el estado | null | revisión humana abierta |

`PENDING_REVIEW` hereda la regla de conflictos: no promediar, no elegir, no
ocultar — revisión humana documentada (A-02.3 PASO 9).

## 5. Lo que KnowledgeResult NO es

- No es CriterionResult: para alimentar un criterio de categoría A requiere
  la correspondencia de PASO 13 (instrumento VALID + criterio con
  jobRelevance VALID) — el resultado no "es" el criterio.
- No es JobFit: prohibida toda conversión directa (herencia InstrumentResult
  ≠ JobFit, A-02.3; A-02.4 diseño puro).
- No es un percentil ni un "porcentaje de idoneidad": es X/Y aciertos sobre
  el contenido definido, o null.
