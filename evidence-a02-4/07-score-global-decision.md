# EVALUHR — A-02.4 · PASO 7
# SCORE GLOBAL — ¿REALMENTE NECESITAMOS UN NÚMERO?

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Mandato: evaluar ventajas y riesgos de 4 opciones; **NO decidir
> únicamente por UX**.

---

## 1. Las cuatro opciones

| Opción | Forma de salida |
|---|---|
| **A. Sin número** | Solo el paquete descriptivo: correspondencias por criterio + estados + áreas + limitaciones (salidas B/D de A-02.3, sin agregado) |
| **B. Nivel cualitativo** | Nivel ordinal {ALTO/MEDIO/BAJO} con explicación completa, gates y exclusiones declaradas |
| **C. Score 0–100** | Número continuo de correspondencia |
| **D. Score + nivel** | Número 0–100 acompañado de su nivel cualitativo |

---

## 2. Evaluación de ventajas y riesgos

### A. Sin número
- **Ventajas**: máxima honestidad (la salida dice exactamente lo que hay);
  cero falsa precisión; sin memoria de "números que se comparan"; el gate se
  integra naturalmente (no hay nada que suprimir).
- **Riesgos**: RH pierde una referencia rápida de "cómo viene el proceso"
  entre muchos criterios; el esfuerzo de leer el paquete completo puede
  empujar a resúmenes informales (el "número mental" aparece igual, pero sin
  control del sistema); la recomendación técnica pierde el contexto agregado
  que hoy produce por reglas.

### B. Nivel cualitativo
- **Ventajas**: da la referencia agregada que RH necesita **sin** la precisión
  falsa; el gate encaja (resultado incompleto ≠ BAJO); ordinalidad coherente
  con la naturaleza de los datos (cualitativos, sin norma); legalmente más
  defendible que un número sin validez predictiva; umbrales controlables por
  gobernanza (aún no definidos — PASO 9).
- **Riesgos**: los niveles son umbrales disfrazados (requieren reglas
  deterministas y versionadas para no ser opinión); riesgo de que ALTO se
  lea como "contratable" (mitigable con calificadores P6/P7 obligatorios);
  la frontera MEDIO/BAJO es más difusa que una frontera numérica (riesgo de
  inconsistencia si las reglas no son exactas).

### C. Score 0–100
- **Ventajas**: máxima granularidad; comparabilidad aparente; integración
  trivial con dashboards.
- **Riesgos**: **falsa precisión** (un 88 vs 85 no tiene base de evidencia);
  invita a **cortes de facto** ("por debajo de 70 no avanza") — prohibidos;
  invita a **ranking de personas** (prohibido); el peso de cada criterio
  queda difuso dentro del número (transparencia baja — PASO 2); la
  reconciliación con INSUFFICIENT ≠ 0 es estructuralmente incómoda (¿cuánto
  vale la ausencia? ninguna respuesta es honesta); mayor riesgo jurídico y
  de discriminación (PASO 2).

### D. Score + nivel
- **Ventajas**: número para operativa + etiqueta para lectura.
- **Riesgos**: **hereda todos los de C** y añade la inconsistencia posible
  (número alto con nivel bajo por topes/gates genera desconfianza o
  manipulación del número); duplica la superficie de mal uso (el número se
  compara, la etiqueta se ignora).

---

## 3. Decisión (PROPUESTA — no elegida por UX)

> **Se recomienda la OPCIÓN B: nivel cualitativo {ALTO/MEDIO/BAJO} con
> resultado incompleto cuando haya gates, excluyendo el score 0–100 del
> producto.**
>
> Justificación por metodología y riesgo (no por UX):
> 1. Los insumos son **cualitativos y sin norma**: producir un número
>    continuo sería precisión sin fundamento (riesgo metodológico alto).
> 2. El número es el **vector principal de mal uso**: cortes de facto,
>    ranking, comparaciones y automatización — todos prohibidos por la
>    cadena de gobernanza (A-01.3/A-02.1/A-02.3).
> 3. El nivel cualitativo **conserva** la utilidad operativa (referencia
>    agregada para RH) con granularidad honesta y reglas estructurales
>    (gates, topes, exclusiones) que un número no puede expresar.
> 4. La opción A (sin número) es la más conservadora y se mantiene como
>    **fallback** válido si gobernanza rechaza los niveles; el modelo C del
>    PASO 2 produce todo lo necesario para ella.

Registro de la decisión: esta elección es **PROPUESTA de diseño**; su
adopción final exige aprobación de gobernanza y validación de lenguaje
(P6/P7 obligatorios junto a cualquier nivel).

---

## 4. Reglas de la opción B (resumen; detalle en PASO 9/13/19)

1. Sin gates activos → nivel con explicación completa + exclusiones
   declaradas + métricas de completitud.
2. Con gate crítico → **resultado incompleto** (sin nivel).
3. Con brecha IMPORTANT (soft gate) → nivel **acotado** (tope; PROPUESTA).
4. El nivel nunca aparece solo: siempre criterios + evidencia + estado
   (explicabilidad PASO 17) y calificadores orientativos.
5. Sin número 0–100 en ninguna salida del producto. Las métricas internas de
   auditoría (PASO 16) son diagnósticos de proceso, **no** un score del
   candidato, y no se muestran como tal.
