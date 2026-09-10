# A-03.4 — 04 · VERSION CHANGE TESTS (PASO 5, 6, 7, 12)

**Resultados reales: `evidence-a03-4/a034-test-results.json` — 34/34 PASS.**
Ejecución: `bun scripts/a034-tests.ts` contra dev server (puerto 3000).

## PASO 5 — Cambio del banco (candidato continúa, nuevo recibe nueva)

Escenario E2E exacto (ver 07-e2e.md):

| Momento | Acción | Resultado verificado |
|---|---|---|
| T0 | Candidato A inicia | KA-v1 congelado (PUB-K1..K4) |
| T1 | Admin edita banco (clave Q1 A→B + alta Q4) | banco vivo cambia; v1 intacta |
| T2 | Candidato B inicia | publica KA-v2 (PUB-K8) |
| T3 | A resume (GET) | sirve 3 items v1 desde snapshot; Q4 NO aparece; versión informada=1 (PUB-K5) |
| T4 | Verificación BD | v1 status RETIRED pero items/claves/hash idénticos (PUB-K6) |

## PASO 6 — Cambio de clave

- KA-v1 / item Q1 v1: `correctAnswerSnapshot = 0` (clave A).
- Edición: `VacancyQuestion.correctAnswer = 1` (clave B).
- KA-v2 / item Q1 **v2**: `correctAnswerSnapshot = 1` (PASO6-a ✅).
- Administración original (A): califica con clave A → knowledgeScore **66.67**
  (Q1=0 correcto, Q2=9 incorrecto, Q3=1 correcto → 2/3) (E2E-6 ✅).
- Nueva administración (B): califica con clave B → knowledgeScore **25**
  (Q1=1 correcto; Q2/Q3/Q4 incorrectos → 1/4) (E2E-8 ✅).
- Resultado histórico de A permanece 66.67 y su snapshot de respuesta sigue
  clave 0 tras publicar v2 (PUB-K7 ✅).
- Items sin cambios conservan itemVersion 1 (PASO6-b ✅).

## PASO 7 — Cambio de pregunta

- Regla implementada: cambio de `text`/`options`/`correctAnswer` ⇒ hash de
  contenido distinto ⇒ **nuevo itemVersion** en la versión nueva; la
  administración anterior queda intacta (items inmutables, FK Restrict).
- La mutación de filas congeladas es imposible por diseño: no existe ninguna
  ruta de escritura hacia `KnowledgeAssessmentItem` fuera de la creación de
  versión nueva (audit de código en 10-audit-trail.md).

## PASO 12 — Matriz completa PUB-K1..PUB-K15

| Test | Descripción | Estado |
|---|---|---|
| PUB-K1 | Inicio guarda assessmentVersion (KA-v1) | ✅ |
| PUB-K2 | Inicio guarda blueprintVersion (BP-v1) | ✅ |
| PUB-K3 | Inicio guarda scoringVersion (PUB-KS-v1) | ✅ |
| PUB-K4 | Inicio guarda itemVersions (3 items v1, con clave, difficulty UNKNOWN) | ✅ |
| PUB-K5 | Candidato continúa usando versión congelada | ✅ |
| PUB-K6 | Publicar nueva versión no altera administración existente | ✅ |
| PUB-K7 | Cambiar correctAnswer no altera histórico | ✅ |
| PUB-K8 | Nuevo candidato recibe versión nueva (KA-v2) | ✅ |
| PUB-K9 | Cliente manipula assessmentVersion → 403 | ✅ |
| PUB-K10 | Cliente manipula itemVersion → 403 | ✅ |
| PUB-K11 | Cliente manipula correctAnswer → 403 | ✅ |
| PUB-K12 | Versión incompleta → 500 CONFIGURATION_ERROR y NO se crea evaluación | ✅ |
| PUB-K13 | Legacy permanece LEGACY (vía histórica + etiqueta explícita) | ✅ |
| PUB-K14 | No se expone correctAnswer al candidato (deep scan) | ✅ |
| PUB-K15 | Resultado histórico reconstruible (cadena completa) | ✅ |

Tests adicionales: SEC-a (scoringVersion/blueprint rechazados), SEC-b
(item fuera de la administración → 403), PASO11/PASO11-b (IA), REG-1..REG-5.

## Hallazgo adicional corregido durante la fase (ORDERING FIX)

La primera ejecución falló REG-3 y expuso un defecto latente pre-A-03.4 en
`advance`: `calculateOverallScore()` se ejecutaba ANTES de persistir los scores
del paso completador, de modo que el overall excluyía silenciosamente el
knowledgeScore calculado en el mismo request (la inserción del paso integridad
eliminó el punto intermedio de persistencia que existía en la numeración con
video). **Corrección dentro de /api/public/apply:** persistir → calcular overall
→ persistir overall. La fórmula/ponderacones de `calculateOverallScore` NO se
tocaron. REG-3 pasa tras la corrección (overall = knowledge = 66.67 para A).
