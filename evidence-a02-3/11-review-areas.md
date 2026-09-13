# EVALUHR — A-02.3 · PASO 11
# ÁREAS QUE REQUIEREN REVISIÓN — DISPARADORES Y SALIDA EXPLICABLE

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 10 (definición de áreas, trazabilidad a criterionId),
> A-02.2 PASO 15 (reglas de insuficiencia), PASOS 1/9 de este dossier.

---

## 1. Definición (herencia A-02.1)

Un **área que requiere revisión** es un **criterio aprobado del puesto** para
el cual la evidencia disponible presenta una condición que amerita atención
humana: sin evidencia, evidencia insuficiente, declarada no verificada,
ambigua, en conflicto, o que requiere contextualización.

Reglas heredadas: el área siempre referencia un `criterionId`; es
**descriptiva** (dice qué conviene revisar y por qué; no califica personas);
sin ella no hay "aspectos generales" ni intuiciones; trazable de punta a punta
(PASO 15).

---

## 2. Cuándo la evidencia genera un área (disparadores)

| # | Disparador (condición determinista) | Ejemplo conceptual |
|---|---|---|
| T1 | **Criterio sin evidencia** (no se aplicó el instrumento; `NOT_ADMINISTERED` / `NO_METHOD`) | Criterio de conocimientos sin prueba aplicada |
| T2 | **Conocimiento insuficiente** (escenarios B–E del PASO 5: sin `correctAnswer`, parcial, no validado, no reconstruible) | Prueba de puesto generado con knowledgeScore=0 artefactual |
| T3 | **Evidencia declarada no verificada** (DECLARED/UNVERIFIED donde la metodología exige verificación) | Experiencia declarada sin verificación documental |
| T4 | **Conflicto entre fuentes** (PASO 9, escenarios 2.1/2.4 y contradicciones anotadas de 2.2/2.3) | Tendencia IPIP vs. comportamiento en entrevista |
| T5 | **Criterio crítico sin evidencia** (criterio con relevancia crítica definida en su Criterion Record y sin lectura) | Requisito crítico del puesto sin prueba aplicada |
| T6 | **Resultado que requiere contextualización** (evidencia ambigua, resultado intermedio sin norma de lectura, inconsistencias internas registradas) | Resultado que no permite lectura clara; conviene explorar en entrevista |
| T7 | **Revisión obligatoria pendiente** (PENDING_REVIEW por matriz A-02.2) | Evidencia de entrevista sin revisión cerrada |
| T8 | **Integridad / competencias sin método o sin base** (INSUFFICIENT estructural: I-INT-1, NO_METHOD) | Criterio E o B sin expediente/método suficiente |

---

## 3. Salida explicable (campos del encargo)

| Campo | Contenido y reglas |
|---|---|
| `areaId` | Identificador único del área (`AREA-<criterionId>-<NNN>`), no reutilizable. |
| `criterionId` (+ `criterionVersion`) | Criterio aprobado al que ancla el área. **Obligatorio**: sin criterio no hay área. |
| `reason` | Causa en lenguaje comprensible, trazada al disparador (T1–T8) y al `reasonCode` cuando aplique. Ejemplos permitidos: "Sin evidencia disponible para este criterio", "El resultado no permite una lectura clara; conviene explorar en entrevista", "Evidencia declarada no verificada", "Las fuentes disponibles apuntan en direcciones distintas y requieren revisión humana". |
| `evidence` | Referencias a los `evidenceId` que motivan el área (o declaración explícita de ausencia: "sin evidencia disponible"). Incluye instrumento + versión + fecha de cada referencia. |
| `severity` | **Severidad de proceso** (ver §4): escala determinista INFO/LOW/MEDIUM/HIGH asignada por la regla disparadora — **no** por juicio sobre la persona. |
| `reviewRequired` | `true` por definición en toda área (si no requiere revisión, no es un área). |

---

## 4. `severity` — severidad de PROCESO, no de persona

> **Reconciliación con A-02.1**: allí se prohibió derivar del área un "nivel
> de gravedad" **sobre la persona** (etiqueta de rechazo). La `severity` de
> A-02.3 es distinta en naturaleza: mide **cuánto carece el proceso de
> información revisable** para ese criterio. Describe la brecha informativa
> y su urgencia de completación/revisión — nunca la gravedad de la persona.

Asignación determinista (por disparador, sin ajustes manuales):

| severity | Disparadores típicos | Significado de proceso |
|---|---|---|
| **HIGH** | T5 (criterio crítico sin evidencia) · T4 (conflicto abierto) · T2 con QUALITY_FAIL | El proceso no puede avanzar con solvencia informativa sin completar/revisar |
| **MEDIUM** | T1 (criterio sin evidencia, no crítico) · T2 (otras insuficiencias) · T7 (revisión pendiente) · T8 · T6 | Falta información o revisión para una lectura confiable |
| **LOW** | T3 (declarada no verificada donde la verificación es mejorable, no crítica) | Completación recomendable |
| **INFO** | Contextualización sugerida sin brecha bloqueante | Mejora opcional de contexto |

Prohibiciones de la severidad:
1. ❌ Presentarla como "gravedad del candidato", "riesgo", "nivel de problema".
2. ❌ Usarla para ordenar/rankear personas (las áreas nunca rankean).
3. ❌ Ajustarla manualmente (solo reglas versionadas; cambio = nueva versión
   de reglas con registro).
4. ❌ Mapearla a umbrales de decisión (no existen umbrales).

---

## 5. Comportamiento de las áreas

1. Las áreas aparecen bajo el encabezado oficial **"Áreas que requieren
   revisión"** (P3, A-02.1) en el AssessmentSummary (PASO 10) y son el insumo
   de la recomendación técnica (PASO 12) y de la entrevista (sugerencias de
   preguntas por IA solo sobre áreas ya identificadas, PASO 14).
2. Toda área es trazable: `area → criterionId → jobRelevance →
   hipótesis/evidencia que la motivó → instrumento + versión` (herencia
   A-02.1 PASO 10 §5). Sin esa cadena, el área no puede mostrarse.
3. Las áreas se cierran **solo** por: evidencia nueva válida, verificación
   completada, revisión humana documentada (PASO 13) o resolución del
   conflicto — con registro; nunca por expiración, silencio o edición.
4. Si no hay criterios aprobados con evidencia ni brechas, la salida declara
   explícitamente que no hay áreas (nada inventado).
5. La IA no crea áreas (AI-X1/X7; herencia A-02.1 PASO 10 §6): las áreas nacen
   de reglas deterministas sobre evidencia real.
