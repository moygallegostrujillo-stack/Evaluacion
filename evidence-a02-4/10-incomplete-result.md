# EVALUHR — A-02.4 · PASO 10
# RESULTADO INCOMPLETO — "Evidencia insuficiente para determinar el nivel de ajuste."

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: PASO 6 (gates), PASO 4 (no evaluable vs evidencia insuficiente),
> A-02.3 (áreas, recomendación técnica).

---

## 1. La salida

Cuando algún gate crítico (G1–G6) está activo, el sistema produce en lugar
del nivel de ajuste:

> **"Evidencia insuficiente para determinar el nivel de ajuste."**

Acompañada de (bloque obligatorio):
1. **Criterios que la provocan**: lista con `criterionId`, `criticality`,
   estado del CriterionResult, causa legible (**"no evaluable"** vs
   **"evidencia insuficiente"** — PASO 4 §3) y `reasonCode`.
2. **Gates activos**: qué condición exacta (G1–G6) aplica.
3. **Áreas que requieren revisión** correspondientes (RA-xx de A-02.3).
4. **Bloque de revisión humana** (estado PENDIENTE).
5. Los **resultados de criterio sin gate** siguen visibles (la evidencia no
   se oculta; solo el agregado se suprime).

Mensaje oficial de criterio (heredado, cuando el gate es por criterio):
"Información insuficiente para evaluar este criterio." (A-02.2 PASO 15).

---

## 2. Cuándo aparece (síntesis)

| Disparador | Gate | Resultado |
|---|---|---|
| Criterio CRITICAL sin lectura utilizable (INSUFFICIENT/INVALID) | G1 | Resultado incompleto |
| Criterio CRITICAL con conflicto abierto | G2 | Resultado incompleto |
| Criterio CRITICAL con revisión pendiente | G3 | Resultado incompleto |
| Única evidencia de crítico invalidada | G4 (efecto G1) | Resultado incompleto |
| Puesto sin criterios aprobados con criticidad | G5 | Sin ajuste (solo evidencia cruda) |
| Reglas de composición/correspondencia sin versión | G6 | Sin ajuste (solo evidencia cruda) |
| Criterio IMPORTANT con brecha | soft gate | Nivel **acotado** + incompletitud visible (PROPUESTA) — no este mensaje |
| Criterio STANDARD con brecha | — | Nivel normal con exclusión declarada |

---

## 3. Qué debe hacer RH (guía de la salida)

1. Leer los criterios que provocan el gate y su causa específica.
2. Elegir la vía de completación legítima según la causa:
   - *No evaluable* → aplicar el instrumento/método aprobado del criterio
     (o gestionar la aprobación del método, si no existe).
   - *Evidencia insuficiente* → completar administración, verificar
     documentación (DECLARED→VERIFIED), o cerrar la revisión pendiente.
   - *Conflicto* → protocolo de conflictos de A-02.3 (entrevista, contraste
     documental; cierre documentado).
3. Documentar la revisión (AssessmentReview) y re-solicitar la consolidación
   cuando la evidencia nueva exista (append-only).
4. **No** tratar el resultado incompleto como "candidato bajo" ni "no apto":
   la salida lo declara explícitamente.

---

## 4. ¿Puede generarse recomendación de entrevista?

**SÍ — y es el caso más natural.** El resultado incompleto puede incluir
"Recomendación técnica: Considerar para entrevista" cuando las condiciones
C1–C6 de A-02.3 PASO 12 se cumplen (criterios aprobados, evidencia parcial
utilizable, áreas que ameritan conversación, reglas deterministas,
trazabilidad, lenguaje). La entrevista es precisamente la vía humana para
**completar la evidencia** que el gate reclama (explorar el criterio crítico
sin lectura, contrastar el conflicto, verificar lo declarado).

Límites (inalterados):
- La recomendación sigue siendo orientación (P7), no decisión.
- La recomendación **no declara un nivel**: bajo gate no hay nivel.
- Si no hay NINGUNA evidencia utilizable en absoluto (ni parcial), la
  recomendación no puede generarse (condición C2 falla): solo queda el
  resultado incompleto con sus áreas de completación.
