# EVALUHR — A-03.1 · PASO 12
# ESTADOS DE CALIDAD — VALID / LIMITED / INSUFFICIENT / INVALID / PENDING_REVIEW

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.3 PASO 1 (5 estados, precedencia M1–M6); A-02.2 PASO 11
> (missing data: INSUFFICIENT ≠ 0); PASO 11 de esta fase.

---

## 1. Regla del encargo

> "Una evaluación con scoring no reconstruible: **INSUFFICIENT**."

Y la regla de oro transversal del expediente: **INSUFFICIENT ≠ 0** — el
estado jamás se muestra, calcula ni interpreta como puntaje cero o bajo.

## 2. Los cinco estados aplicados a KnowledgeAssessment

Los 5 estados del sistema (A-02.3 PASO 1) son **biyectivos y obligatorios**;
A-03.1 no crea estados nuevos, solo define sus disparadores para
conocimientos (precedencia de evaluación de arriba hacia abajo):

| Estado | Disparador en evaluación de conocimientos | reasonCode | score |
|---|---|---|---|
| **VALID** | Instrumento con K-VAL-1..8 · administración K1–K6 completa · todos los items puntuables válidos · sin anomalías · revisión registrada | — | X/Y |
| **LIMITED** | Scoring K1–K6 íntegro pero cobertura declarada **parcial** del criterio (blueprint que cubre parte del contenido definido — declarado y aprobado así) | — | X/Y sobre lo cubierto (sin extrapolar) |
| **INSUFFICIENT** | Sin `correctAnswer` (K-INS-1) · administración parcial (C) · items inválidos en el set (D) · scoring no reconstruible (E) | QUALITY_FAIL / PARTIAL_RESPONSE / TECH_FAILURE | null |
| **INVALID** | Administración invalidada por proceso documentado (anomalía grave confirmada, condición violada, uso indebido) — hereda el tratamiento de "resultados invalidados" de A-02.3 (corrección = invalidación documentada + registro nuevo) | conforme a causa | null |
| **PENDING_REVIEW** | Conflicto de evidencia abierto (p. ej., conocimiento vs. documentación; dos instrumentos) u observación de revisión que impide cerrar el estado | — | null |

## 3. La regla específica del encargo, en detalle

**Scoring no reconstruible ⇒ INSUFFICIENT.** El scoring no es reconstruible
cuando:

1. Falta `correctAnswer` en items del set (caso vigente del generador —
   PASO 6);
2. El set administrado difiere del set publicado de esa versión (KSC-2);
3. Existen items inválidos puntuados o mezclados (KR-1);
4. No puede reproducirse el cálculo con las versiones registradas
   (assessmentVersion/blueprintVersion/itemVersion/scoringVersion);
5. Hay falla técnica, sesión corrupta o doble envío (escenario E).

En todos los casos: `status = INSUFFICIENT`, `score = null`, diagnóstico
crudo conservado, causa documentada, salida oficial "Información insuficiente
para evaluar este criterio." + causa comprensible, visible como área de
revisión. **El 0 artefactual jamás se muestra como resultado.**

## 4. Reglas de precedencia y consistencia

1. **KQ-1**: los 5 estados se evalúan con la **precedencia** definida en
   A-02.3 (M1–M6): INVALID/PENDING_REVIEW y condiciones de confidencialidad
   prevalecen sobre cálculos; sin scoring válido, INSUFFICIENT prevalece
   sobre cualquier lectura.
2. **KQ-2**: `status` del KnowledgeResult ≠ calidad del instrumento: un
   instrumento puede estar ACTIVE (gobernanza) y una administración
   particular salir INSUFFICIENT (p. ej., parcial) — los niveles
   instrumento/persona no se confunden (K-VAL-2 nota 3 de A-02.5).
3. **KQ-3**: prohibido "promover" estados: no se convierte INSUFFICIENT en
   LIMITED/VALID por conveniencia, ni se fuerza PENDING_REVIEW a cierre
   sin revisión humana documentada (AI-X10 aplicable: la IA no resuelve
   estados).
4. **KQ-4**: todo cambio de estado posterior al resultado (invalidación,
   cierre de conflicto) es un **acto documentado append-only** que crea
   registro nuevo; los resultados originales no se reescriben (herencia
   A-02.3 PASO 13).

## 5. Coherencia transversal

- La matriz de evidencia (PASO 18) usa exactamente estos valores en la
  columna `evidenceStatus`.
- El AssessmentSummary futuro (A-02.3 PASO 10) consume estos estados tal
  cual: los INSUFFICIENT alimentan "evidencia insuficiente" + áreas, nunca
  scores.
