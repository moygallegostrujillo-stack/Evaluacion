# EVALUHR — A-02.3 · PASO 17
# MODELO DE SALIDAS (output model) — CINCO SALIDAS, CERO SCORES GLOBALES

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: PASOS 1–16 de este dossier; lenguaje permitido/prohibido A-02.1 PASO 14.

---

## 0. Regla general del modelo de salidas

> EvaluHR produce **cinco salidas** — y ninguna de ellas es un score global,
> un veredicto, un ranking o una decisión. Toda salida es **orientativa,
> trazable y sujeta a revisión humana** (P6).

El score global está **fuera del modelo** (no "aún no implementado": fuera,
hasta que una fase autorizada lo diseñe bajo las 7 condiciones previas de
A-02.1 PASO 9 — y aun entonces INSUFFICIENT ≠ 0).

```
A. Resultado de instrumento   ← InstrumentResult (PASO 2)
B. Resultado de criterio      ← CriterionResult (PASO 3)
C. AssessmentSummary          ← consolidación (PASO 10)
D. Áreas que requieren revisión ← PASO 11 (reglas RA-01..RA-12)
E. Recomendación técnica      ← PASO 12 (condiciones C1–C6)
```

---

## A. Resultado de instrumento

| Aspecto | Definición |
|---|---|
| Qué es | La presentación del InstrumentResult: instrumento + versiones (cuádruple), resultados crudos por constructo, completitud, calidad de administración, alcance y limitaciones/disclaimers. |
| Cuándo se produce | Tras cada administración (completa, parcial, fallida o declinada — el estado se declara). |
| Lenguaje | P1 "Resultado de evaluación" · P6 "Resultado orientativo, sujeto a revisión humana" · P8 "Tendencias de respuesta" (IPIP) · disclaimers literales del expediente. |
| Prohibido | Convertir en cumplimiento/aptitud/recomendación; promediar entre instrumentos; percentil/baremo; entrar a agregados. |
| Trazabilidad | instrumentResultId → instrumento → versiones → evidenceIds derivados (si hay criterios aprobados). |

## B. Resultado de criterio

| Aspecto | Definición |
|---|---|
| Qué es | La presentación del CriterionResult: criterio + versión + categoría, evidencias citadas (estados PASO 1), lectura descriptiva / contexto / insuficiencia / conflicto / pendiente, calidad, interpretationStatus. |
| Cuándo se produce | Solo para criterios aprobados con evidencia anclada (o su insuficiencia declarada: R1–R9). |
| Lenguaje | Lectura descriptiva dentro de P1–P8; insuficiencia siempre como "Información insuficiente para evaluar este criterio." + causa; conflicto mostrando ambas fuentes. |
| Prohibido | Score agregado del criterio; inferencias prohibidas por categoría (PASO 3 §3); ocultar insuficiencias o conflictos. |
| Trazabilidad | criterionResultId → criterionId+versión → evidenceIds → instrumento+versiones. |

## C. AssessmentSummary

| Aspecto | Definición |
|---|---|
| Qué es | La consolidación descriptiva del proceso: criterios evaluados (con su estado), evidencia disponible, evidencia insuficiente (con causas), conflictos, áreas de revisión, limitaciones y requerimiento de revisión humana. |
| Cuándo se produce | Por reglas deterministas versionadas, sobre criterios aprobados del puesto. |
| Lenguaje | Encabezados oficiales (P1/P3/P5/P6); sin ningún término de X1–X15 ni sinónimos. |
| Prohibido | **Score global** (overall, % de ajuste, promedio, match, ranking); presentación como "completo" con insuficiencias ocultas; forma de veredicto. |
| Trazabilidad | summaryId → criteriaEvaluated → evidenceIds → instrumentos/versiones → rulesVersion + audit trail. |

## D. Áreas que requieren revisión

| Aspecto | Definición |
|---|---|
| Qué es | La lista de criterios que ameritan atención humana, cada una con `areaId`, `criterionId`, `reason`, `evidence` citada, `severity` de proceso (INFO/LOW/MEDIUM/HIGH determinista por regla RA-xx) y `reviewRequired=true`. |
| Cuándo se produce | Por disparadores deterministas T1–T8 (reglas RA-01..RA-12 de `review-area-rules.csv`). |
| Lenguaje | Encabezado P3 "Áreas que requieren revisión"; razones del catálogo (permitidas, sin jerga interna). |
| Prohibido | "Gravedad del candidato"/riesgo (la severity es de proceso); rankear personas; áreas sin criterio o sin trazabilidad; áreas creadas por IA. |
| Trazabilidad | areaId → criterionId+versión → jobRelevance → evidencia/hipótesis motivadora → instrumento+versión. |

## E. Recomendación técnica

| Aspecto | Definición |
|---|---|
| Qué es | La orientación máxima del sistema: "Recomendación técnica: Considerar para entrevista" — con sus áreas motivadoras, evidencia considerada, estado de revisión y calificadores obligatorios. |
| Cuándo se produce | Solo si cumplen **todas** las condiciones C1–C6 (PASO 12); nunca en forma negativa. |
| Lenguaje | P4 literal + P7 "Orientación técnica, no decisión de contratación" + P6. |
| Prohibido | Emitirla sin condiciones; derivarla de scores/umbrales; usarla como filtro automático; sinónimos decisorios (X3/X11/X14); participación de IA. |
| Trazabilidad | recomendación → summaryId → areas → evidencia → criterios → puesto. |

---

## Matriz resumen de las cinco salidas

| Salida | Objeto fuente | Requiere revisión humana | Contiene números | Puede faltar |
|---|---|---|---|---|
| A. Resultado de instrumento | InstrumentResult | Presenta P6; revisión según tipo | Sí: resultados crudos nativos (raw 10–50, aciertos/total) | No (toda administración produce salida, con su estado) |
| B. Resultado de criterio | CriterionResult | Según matriz de su tipo; PENDING bloquea lectura | Solo el crudo del tipo (p. ej., aciertos X/Y) — nunca agregado | Sí: sin criterio no existe |
| C. AssessmentSummary | AssessmentSummary | **Siempre** (`humanReviewRequired=true`) | **No: cero scores agregados** | Sí: sin criterios aprobados no hay summary |
| D. Áreas de revisión | Reglas RA-01..RA-12 | `reviewRequired=true` por definición | No | Sí: sin brechas, se declara "sin áreas" |
| E. Recomendación técnica | Reglas C1–C6 | Declara PENDIENTE/REVISADO | No | Sí: es la salida más exigente de producir |

---

## Cierre del modelo

1. Las cinco salidas comparten: lenguaje controlado, trazabilidad de punta a
   punta (PASO 15), append-only, revisión humana explícita y ausencia total
   de scores globales, pesos y puntos de corte.
2. El orden de producción es: A → B → D → C → E (una salida nunca consume
   otra que no exista con trazabilidad).
3. Cualquier salida futura (incluido el "Nivel de ajuste") debe añadirse a
   este modelo con su propia fase autorizada, heredando: INSUFFICIENT ≠ 0,
   sin cortes/pesos, lenguaje controlado, revisión humana obligatoria.
