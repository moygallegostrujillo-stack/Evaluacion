# EVALUHR — A-03.1
# DOSSIER MAESTRO — DISEÑO DEL INSTRUMENTO DE CONOCIMIENTOS (KNOWLEDGE ASSESSMENT)

> Documento de solo diseño y documentación metodológica. **NO se implementó
> nada**: código, schema, base de datos, IA, IPIP-50-MX, integridad,
> competencias, scoring existente, contrato y aviso de privacidad INTOCABLES
> (verificado con git, PASO 20 §3). **NO se corrigió `correctAnswer`** — el
> problema permanece documentado y abierto. NO se crearon preguntas reales
> para producción (los ejemplos son esquemáticos, marcados EJEMPLO — NO
> PRODUCTIVO).
> Elaborado: 2026-09-10 · Fase A-03.1 · Base: expedientes A-01.3 (GO),
> A-02.1 (GO documental), A-02.2 (GO documental), A-02.3 (GO documental),
> A-02.4 (GO documental, Modelo C) y A-02.5 (GO documental / NO-GO de uso).
> Este dossier resume y enlaza los documentos de `evidence-a03-1/`.

---

## Reglas maestras de la fase

1. **Scoring exige clave validada** — sin `correctAnswer` persistida,
   verificable y versionada no existe score: la ausencia de clave es
   INSUFFICIENT (K-INS-1), **jamás un 0 del candidato** (regla de oro
   INSUFFICIENT ≠ 0, heredada y reafirmada).
2. **La IA propone borradores; las personas deciden** — la IA no decide
   obligatoriedad de conocimiento (AI-X20), respuesta correcta (AI-X21),
   dificultad (AI-X22), validez (AI-X23), aprobación (AI-X24) ni
   publicación (AI-X25).
3. **Sin dominio no hay pregunta** — todo reactivo pertenece a un dominio
   pre-establecido del blueprint, trazable a un requisito con
   `knowledgeRelevance = VALID`; lo que no puede justificarse no se pregunta.

No se creó: fórmula implementada, pesos, cortes, percentiles, niveles de
aprobación, APTO/NO APTO, decisión automática, JobFit, ni dificultad
inventada.

---

## Índice del expediente

| Archivo | PASO | Contenido |
|---|---|---|
| `01-definition.md` | 1 | Definición de KnowledgeAssessment y distinción de constructos |
| `02-job-analysis.md` | 2 | Fuentes KF1–KF7, procedimiento de análisis, knowledgeRelevance=VALID (R-KREL-1..5) |
| `03-blueprint.md` | 3 | KnowledgeBlueprint (campos, dominios, reglas K-BP-1..7) |
| `04-item.md` | 4 | KnowledgeItem (campos, IA propone/no aprueba, inmutabilidad) |
| `05-ai-flow.md` | 5 | Flujo blueprint→IA→revisión→corrección→aprobación→publicación (AI-X20..X25) |
| `06-correctanswer.md` | 6 | Problema correctAnswer vigente; 0 = "no existe evidencia válida de scoring" (K-CA-1..6) |
| `07-content-validation.md` | 7 | Checklist KI-VAL-1..8 por reactivo (DRAFT→VALID) |
| `08-subjective-questions.md` | 8 | Exclusión de preguntas de opinión (KS-1..KS-4, K-SJ-1..3) |
| `09-difficulty.md` | 9 | EASY/MEDIUM/HARD/UNKNOWN — no se inventa (KD-1..KD-6) |
| `10-scoring.md` | 10 | Fórmula conceptual aciertos/ítems válidos; prohibiciones P1–P6 (KSC-1..5) |
| `11-result.md` | 11 | KnowledgeResult (campos del encargo, manejo de items inválidos KR-1) |
| `12-quality-states.md` | 12 | 5 estados de calidad aplicados a conocimientos (scoring no reconstruible = INSUFFICIENT) |
| `13-criteria-relation.md` | 13 | Requirement→Item→Result→CriterionResult (KC-1..KC-6); NO JobFit |
| `14-methodological-security.md` | 14 | Protección contra duplicados, claves erróneas, ambigüedad, IA sin revisión, ediciones, cambios de clave (KSEC-1..11) |
| `15-versioning.md` | 15 | assessmentVersion/blueprintVersion/itemVersion/scoringVersion (KVER-1..6) |
| `16-audit-trail.md` | 16 | Cadena job→…→result (11 eslabones, KAUD-1..6) |
| `17-examples.md` | 17 | MESERO/VENDEDOR — EJEMPLO — NO PRODUCTIVO |
| `knowledge-evidence-model.csv` | 18 | Matriz de evidencia (12 columnas del encargo) |
| `knowledge-item-governance.md` | 18 | Gobernanza de reactivos (roles, campos mínimos, anti-manipulación) |
| `19-publication-rules.md` | 19 | Ciclo DRAFT/REVIEW/APPROVED/ACTIVE/SUSPENDED/RETIRED/REJECTED + KPUB |
| `20-audit-checklist.md` | 20 | Auditoría final (15 ítems del encargo + A1–A8 + git) |

---

## 1. Definición

**KnowledgeAssessment**: instrumento que mide dominio **declarativo** —
"saber" — sobre contenidos específicos del puesto, con reactivos de
respuesta correcta validada y versionada. Se distingue por constructo de
personalidad (IPIP-50-MX), competencias (ejecución), integridad (I-INT-1) y
experiencia (D-EXP-1). Sus únicas salidas: X/Y aciertos sobre el contenido
definido, o estado de evidencia insuficiente. No mide capacidad general,
desempeño ni potencial.
> Detalle: `01-definition.md`.

## 2. Análisis del puesto

Los conocimientos requeridos provienen **solo** del análisis del puesto real
con fuentes admisibles **KF1–KF7**: funciones, procedimientos, políticas,
conocimientos técnicos, normativa aplicable, expertos del puesto y
documentación interna del cliente (correspondencia con S1–S8 de A-02.5).
Bibliotecas genéricas e IA **no** son fuente. `knowledgeRelevance = VALID`
exige la cadena **R-KREL-1..5** (elemento del puesto + fuente citada +
categoría de conocimiento + revisión humana + aprobación/versión),
todo-o-nada; sin ella, el requisito queda LIMITED/PENDING/INSUFFICIENT y
**no admite reactivos**.
> Detalle: `02-job-analysis.md`.

## 3. Blueprint

**KnowledgeBlueprint** (blueprintId, jobId, domain, subdomain,
knowledgeRequirement, importance, source, approvedBy, version): el mapa
formal de contenidos. Cada pregunta debe pertenecer a un dominio
pre-establecido porque de ello dependen la trazabilidad, la cobertura
controlada, la validación por dominio, el bloqueo de reactivos de relleno y
el mantenimiento seguro (K-BP-1..7). `importance` es descriptiva de
cobertura, **no** peso.
> Detalle: `03-blueprint.md`.

## 4. Reactivos

**KnowledgeItem** (itemId, blueprintId, question, options, correctAnswer,
rationale, difficulty, source, version, status, reviewedBy + campos de
gobernanza): el reactivo individual. **La IA puede proponer reactivos; la IA
NO puede aprobarlos** (KI-1..KI-4). Items ACTIVE inmutables (KI-5);
correctAnswer jamás se edita retroactivamente (KI-6). El banco legacy de
auto-reporte no cumple la definición de reactivo válido.
> Detalle: `04-item.md`.

## 5. IA

Flujo obligatorio y secuencial: **BLUEPRINT → IA genera borradores (DRAFT,
marcados) → revisión humana → corrección → aprobación → publicación**.
La IA NO decide: obligatoriedad (AI-X20), respuesta correcta autónoma
(AI-X21), dificultad definitiva (AI-X22), validez (AI-X23), aprobación
(AI-X24), publicación (AI-X25). Permitido con marcado: redactar borradores
en dominios aprobados, proponer distractores/rationale como hipótesis,
sugerir correcciones, flaggear duplicados candidatos (herencia AI-2/3b/5).
> Detalle: `05-ai-flow.md`.

## 6. correctAnswer

Problema vigente documentado (A-01.2/A-02.2, sin corregir):
`generateTemplatesForPosition` no persiste `correctAnswer` →
`knowledgeScore = 0` artefactual. **Ese 0 NO significa "cero
conocimientos"**: significa **"NO EXISTE EVIDENCIA VÁLIDA DE SCORING"** →
estado **INSUFFICIENT** (K-INS-1), score = null, causa documentada, salida
oficial sin el 0. Reglas K-CA-1..6: la clave es precondición de scoring;
missing correctAnswer ≠ incorrecta; con cualquier item sin clave el
resultado completo es INSUFFICIENT (no rescate parcial); corrección futura
sujeta a autorización y sin re-puntuación retroactiva.
> Detalle: `06-correctanswer.md`.

## 7. Validación

Dos niveles: instrumento (K-VAL-1..8 de A-02.5, todo-o-nada) y reactivo
(**KI-VAL-1..8**, nuevo): relevancia, claridad, una sola respuesta correcta
defendible contra la source, coherencia con blueprint, ausencia de
ambigüedad, sin información innecesaria, dificultad razonable y honesta,
relación con la función del puesto. Todo-o-nada por item-version; dictamen
humano (AI-X23); rechazos con motivo.
> Detalle: `07-content-validation.md`.

## 8. Preguntas subjetivas

"¿Qué harías?", "¿Cuál consideras que es mejor?", "¿Qué prefieres?" y
variantes (incluido el auto-reporte "¿Conoce…?") se **excluyen del
knowledgeScore** (KS-1..KS-4, K-SJ-1..3): pertenecen a
competencias/situaciones o son autopercepción, no conocimiento objetivo.
Única excepción: metodología específica aprobada con constructo, claves y
scoring propios y separados — **hoy no existe**.
> Detalle: `08-subjective-questions.md`.

## 9. Dificultad

Estados **EASY / MEDIUM / HARD / UNKNOWN**. Regla del encargo: **NO inventar
dificultad — sin evidencia, UNKNOWN** (estado por defecto, KD-1). El juicio
humano se admite marcado (JUICIO-NO-EVIDENCIA, KD-2); la IA solo
provisional (KD-3, AI-X22); la evidencia empírica futura requiere regla
versionada aprobada (KD-4). La dificultad es metadato: prohibido ponderar,
cortar o ramificar con ella (KD-5).
> Detalle: `09-difficulty.md`.

## 10. Scoring

Fórmula conceptual: **respuestas correctas / items puntuables válidos**
(CORRECT_OVER_TOTAL), peso uniforme, determinista y reproducible por
versiones. **Sin implementar.** Prohibiciones: tratar missing correctAnswer
como incorrecta (P1); prorrateo arbitrario o rescalado (P2); rescate
parcial de items buenos (P3); pesos (P4); imputación de parciales (P5);
cortes/niveles (P6).
> Detalle: `10-scoring.md`.

## 11. Resultado

**KnowledgeResult**: validItems, invalidItems, correctItems, score, status,
version, blueprintVersion (+ scoringVersion/itemVersion/reasonCode). Si
existe item inválido: **no se puntúa y el score no se fabrica** — status
INSUFFICIENT con causa, diagnóstico crudo conservado, el candidato no carga
el defecto, remediación solo por proceso humano (KR-1).
> Detalle: `11-result.md`.

## 12. Calidad

Los 5 estados del sistema aplicados a conocimientos: **VALID / LIMITED /
INSUFFICIENT / INVALID / PENDING_REVIEW**, con precedencia heredada (M1–M6)
y la regla del encargo: **scoring no reconstruible ⇒ INSUFFICIENT** (score
null, nunca 0). El estado del resultado ≠ calidad del instrumento; cambios
de estado = actos documentados append-only.
> Detalle: `12-quality-states.md`.

## 13. Relación con criterios

Cadena KnowledgeRequirement → (dominio de) KnowledgeBlueprint →
KnowledgeItem → KnowledgeResult → **CriterionResult** (solo categoría A,
con jobRelevance VALID e instrumento K-VAL: condiciones KC-1..KC-6; sin
ellas no hay lectura). Lectura permitida: descriptiva de dominio
declarativo. **NO se convierte conocimiento en JobFit** — A-02.4 sigue siendo
diseño; A-03.1 no define fórmulas, gates ni pesos propios. Fuerza actual
hacia criterios: LIMITED (A-02.5, por K-INS-1).
> Detalle: `13-criteria-relation.md`.

## 14. Gobernanza

Roles con **separación de duties** (autor ≠ revisor ≠ aprobador ≠ publicador;
IA solo borradorista), campos mínimos por reactivo (adaptación de los campos
de A-02.5: itemId/jobId/blueprint/domain/rationale/source/reviewedBy/
approvedBy/version/statusHistory/difficultyBasis), proceso
propuesta→aprobación→publicación con actos registrados, 7 controles
anti-manipulación y revisión periódica propuesta. Complementa — no
sustituye — la gobernanza de criterios de A-02.5.
> Detalle: `knowledge-item-governance.md`.

## 15. Versionado

Cuatro versiones: **assessmentVersion** (= blueprint exacto + set de items
exactos + scoring exacto), **blueprintVersion**, **itemVersion**,
**scoringVersion** (mayor/menor definidas). Reglas KVER-1..6: todo
KnowledgeResult conserva las 4 versiones; **una nueva versión NO modifica
resultados históricos**; ids no reutilizables; historial append-only;
versiones registradas al momento de responder.
> Detalle: `15-versioning.md`.

## 16. Auditoría

Cadena de 11 eslabones: **job → blueprint → item → source → correctAnswer →
reviewer → version → administration → response → score → result**,
bidireccional y con versiones en todo eslabón, enganchada a la cadena macro
de A-02.3. 7 preguntas que la auditoría debe poder responder; si no ⇒
anomalía ⇒ el resultado no puede tratarse como evidencia válida. Reglas
KAUD-1..6 (append-only, actos de gobernanza humanos, administración como
punto de acoplamiento).
> Detalle: `16-audit-trail.md`.

## 17. Ejemplos

**MESERO y VENDEDOR, SOLO EJEMPLO — NO PRODUCTIVO**: blueprints esquemáticos
(KBP-EJEMPLO-*), 4 reactivos ilustrativos no utilizables (borrador en
revisión, clave ausente → INSUFFICIENT, opinión rechazada, dificultad por
juicio marcado) y 2 KnowledgeResult ilustrativos (escenario A vs. escenario
B). Ningún contenido real para producción; ids con prefijo EJEMPLO.
> Detalle: `17-examples.md`.

## 18. Matrices

- **`knowledge-evidence-model.csv`**: 12 columnas del encargo (jobId,
  blueprintId, domain, knowledgeRequirement, source, itemId, itemStatus,
  correctAnswerStatus, difficulty, reviewStatus, version, evidenceStatus) ×
  10 filas EJEMPLO que cubren los estados del ciclo y los regímenes de
  evidencia (validada con parser: 0 malformadas).
- **`knowledge-item-governance.md`**: gobernanza completa del reactivo
  (PASO 18/14).
> Detalle: ambos archivos en este expediente.

## 19. Riesgos

| # | Riesgo | Severidad | Mitigación de diseño |
|---|---|---|---|
| R1 | El 0 artefactual sigue produciéndose hoy y puede malinterpretarse como "candidato sin conocimientos" | ALTA | K-INS-1 + INSUFFICIENT ≠ 0 vigentes en todo el expediente; corrección futura K-CA-5; lenguaje de salida sin 0 |
| R2 | Presión por "rescatar" scores parciales de items buenos para no perder administraciones | ALTA | KR-1/P2/P3: prohibido por diseño; INSUFFICIENT con diagnóstico conservado |
| R3 | Reactivos IA aparentemente correctos con claves sutilmente erróneas | MEDIA | KI-VAL-3 con rationale contra source + revisión adversaria (KI-VAL-5) + separación autor/revisor |
| R4 | Duplicación de contenidos entre generaciones (sin blueprint el sistema actual repite patrones) | MEDIA | Dominios cerrados + cobertura declarada + chequeo KSEC-1 antes de publicar |
| R5 | Deslizamiento semántico: usar el score como medida de capacidad/desempeño | MEDIA | K-DEF-3/KSC-5 + tabla de no-significados heredada; lectura solo descriptiva |
| R6 | Cambios de contenido (catálogos, normas) que dejan items obsoletos sin que nadie lo note | MEDIA | KSEC-11 (revisión obligatoria si cambia la source) + vigencia explícita en dominios con refresh-risk |
| R7 | Complejidad de gobernanza disuade su adopción y se busca "atajo" sin revisión | MEDIA | Flujo mínimo obligatorio (5 etapas) con actos registrados; aprobación por lote invalidable |
| R8 | Comparación de scores entre assessmentVersion distintas como si fueran equivalentes | BAJA | KVER-2/KVER-4 + cautela declarada: comparabilidad exige validación específica futura |

## 20. Limitaciones

1. **Nada está implementado**: el modelo es diseño; el generador actual
   sigue sin persistir claves y el scoring vigente no cambia.
2. **No existe hoy ningún instrumento de conocimientos VALID**: sin
   blueprint ni reactivos reales aprobados, la fuerza hacia criterios A
   permanece LIMITED (A-02.5).
3. **Los requisitos de conocimiento reales no han completado R-KREL-1..5**:
   dependen del análisis de puesto real y fuentes del cliente (KF1–KF7).
4. **La dificultad queda UNKNOWN por defecto**: sin administraciones ni
   regla empírica versionada (trabajo futuro), EASY/MEDIUM/HARD solo por
   juicio marcado.
5. **La validez de contenido (KI-VAL) es juicio experto documentado**, no
   evidencia psicométrica: fiabilidad/validez predictiva requieren
   validación empírica futura fuera del alcance de esta fase.
6. **La corrección de `correctAnswer` exige fase autorizada aparte** (código
   + versionado + decisión sobre datos históricos: K-CA-5).
7. **Los ejemplos son esquemáticos**: no demuestran viabilidad de redacción
   real ni calidad de distractores; eso corresponde al primer caso piloto
   con fuentes reales del cliente.
8. **Comparabilidad entre versiones del instrumento no está garantizada**:
   scores de assessmentVersion distintas no son intercambiables sin
   validación específica.

---

## Conclusión documental

A-03.1 define **cómo** una evaluación de conocimientos podría producir
evidencia VALID (blueprint trazable → reactivos validados → clave
persistida → scoring reproducible → publicación reglada) **sin
implementarlo y sin inventar números**. El expediente cierra con auditoría
15/15 + A1–A8 CUMPLEn y git limpio. La ruta operativa futura exige: (1)
análisis de puesto real con fuentes KF, (2) corrección autorizada de
correctAnswer (K-CA-5), (3) gobernanza operacional, (4) caso piloto con
KI-VAL completo, (5) re-evaluación de fuerza de relación — en ese orden, y
**solo con autorización explícita**.
