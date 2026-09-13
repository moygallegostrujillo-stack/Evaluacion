# EVALUHR — A-02.4 · PASO 6
# GATING — HARD GATES DEL NIVEL DE AJUSTE

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: PASOS 3–5; A-02.3 (estados, conflictos, áreas).

---

## 1. Definición

> Un **hard gate** es una condición previa cuyo incumplimiento **impide que
> el sistema produzca un nivel de ajuste** (ni número, ni nivel cualitativo).
> Cuando un gate está activo, la salida es el **resultado incompleto**:
> "Evidencia insuficiente para determinar el nivel de ajuste." (PASO 10) con
> su explicación, áreas de revisión y —si procede— recomendación de
> entrevista.

El gate no es un castigo ni una puntuación baja: es el reconocimiento honesto
de que **con la evidencia actual no puede emitirse una medida responsable**.

---

## 2. Cuándo existe exactamente un gate (definición formal)

**GATE CRÍTICO (hard gate) — el ajuste NO se produce.** Existe si y solo si
se cumple alguna de:

| Gate | Condición exacta |
|---|---|
| **G1** | ∃ criterio con `criticality=CRITICAL` cuyo CriterionResult tiene `state ∈ {INSUFFICIENT, INVALID}` (sin lectura utilizable) |
| **G2** | ∃ criterio CRITICAL con **conflicto abierto** (`CONFLICT_OPEN` / `PENDING_REVIEW` por conflicto, A-02.3 PASO 9) |
| **G3** | ∃ criterio CRITICAL con revisión obligatoria **pendiente** (`PENDING_REVIEW` por revisión, no por conflicto) |
| **G4** | La única evidencia de un criterio CRITICAL fue **invalidada por gobernanza** (queda G1 por efecto) |
| **G5** | El puesto **no tiene criterios aprobados** con criticidad declarada (no hay qué ajustar: herencia de las puertas de control A-02.1) |
| **G6** | La regla de composición o las reglas de correspondencia **no están versionadas** (no hay reglas con que componer: puerta 3/6 de A-02.1) |

**SOFT GATE (PROPUESTA) — el ajuste se produce acotado.** Existe si:
- ∃ criterio `IMPORTANT` con brecha (G1–G3 análogos en IMPORTANT): el ajuste
  se produce **con tope de nivel** (nunca ALTO) y la brecha visible
  (PASO 13; a validar).

Sin gates activos → el ajuste se compone por la regla de agregación
(PASO 13) con las exclusiones declaradas de los criterios STANDARD.

---

## 3. El caso del encargo

> "Si falta evidencia en un criterio crítico: ¿el sistema puede producir
> nivel de ajuste?"

**NO.** Falta de evidencia en un criterio CRITICAL = **G1** → el sistema
**no** produce nivel de ajuste (ni ALTO, ni MEDIO, ni BAJO: tampoco BAJO,
porque la ausencia no es evidencia negativa). Produce el **resultado
incompleto** con: criterios que lo provocan, causa (no evaluable / evidencia
insuficiente), áreas de revisión y, si procede, "Considerar para entrevista"
(PASO 10).

---

## 4. Comportamiento del sistema bajo gate

1. La salida **nunca** contiene un nivel de ajuste (ni número, ni etiqueta).
2. La salida **siempre** contiene: la lista de criterios que activan el gate
   (criterionId + criticidad + causa + reasonCode), las áreas de revisión
   correspondientes y el bloque de revisión humana.
3. Los criterios sin gate se siguen reportando (resultados de criterio,
   A-02.3) — el gate bloquea el **agregado**, no la evidencia.
4. El gate se **recalcula en cada consolidación**: se cierra cuando el
   criterio crítico obtiene lectura utilizable (evidencia nueva válida,
   conflicto cerrado, revisión completada) — con registro, nunca por
   expiración.
5. La salida bajo gate **puede** incluir la recomendación "Considerar para
   entrevista" (es precisamente el caso donde explorar en entrevista permite
   completar la evaluación), siempre bajo las condiciones C1–C6 de A-02.3
   PASO 12.

---

## 5. Prohibiciones asociadas

1. ❌ Producir nivel de ajuste con un gate crítico activo.
2. ❌ Producir "BAJO" como sustituto del gate (la ausencia no es evidencia
   negativa: INSUFFICIENT ≠ 0, y el gate no es una calificación).
3. ❌ Gates invisibles: todo gate activo se muestra con su causa.
4. ❌ Gates negociables: solo se abren por evidencia/revisión documentada;
   ni la IA ni la presión operativa los abren (PASO 12).
5. ❌ Ocultar los criterios sin gate mientras el gate está activo (la
   evidencia sigue visible; solo el agregado se suprime).
