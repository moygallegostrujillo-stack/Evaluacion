# EVALUHR — A-02.3 · PASO 4
# SALIDA DEL IPIP-50-MX — QUÉ PRODUCE Y QUÉ NO PRODUCE

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-01.2/A-01.3 (instrumento congelado v1.0: 50 ítems verbatim, 5 factores,
> 24 reversos, escala 1–5, raw 10–50, visual 0–100 no percentil, disclaimer
> literal), A-02.2 PASO 4 (evidencia de rasgos y nada más).

---

## 1. Qué produce exactamente el IPIP-50-MX (salida oficial)

El InstrumentResult del IPIP-50-MX (PASO 2) contiene **solo** esto:

### 1.1 Cinco dimensiones
- Extrapolación (E) · Cordialidad (A) · Escrupulosidad (C) ·
  Estabilidad Emocional (ES) · Intellect/Intelecto (I) — factores oficiales
  IPIP con la denominación de la implementación congelada (A-01.2).

### 1.2 Puntuación raw (bruta)
- **Rango 10–50 por factor** (suma de 10 ítems, inversión 6−v solo en los
  24 ítems oficiales de la clave; sin pesos, sin normas, sin baremos).
- Completitud por factor: una dimensión con ítems sin responder **no se
  puntúa, no se prorratea, no se imputa** → queda INSUFFICIENT por dimensión
  (herencia A-02.2 PASO 11). El resto de dimensiones completas conserva su
  raw propio.

### 1.3 Representación visual
- Conversión **raw/50 × 100**, presentada **siempre** con la nota "no
  constituye percentil" y el disclaimer literal de A-01.3
  (`IPIP50_RESULT_DISCLAIMER`).
- La visual es una **transformación de escala**, no una norma: no hay
  población de referencia, no hay "bueno/malo", no hay corte.

### 1.4 Interpretación descriptiva
- Texto orientativo determinista (`buildIPIP50Summary`, A-01.2) que describe
  tendencias de respuesta en lenguaje llano — **sin decisión, sin etiqueta,
  sin comparación entre personas**.
- Encuadre oficial de lectura: **"Tendencias de respuesta"** (P8) +
  "Resultado orientativo, sujeto a revisión humana" (P6) + "Resultado de
  evaluación" con instrumento y versión (P1).
- Alcance repetido en cada salida (heredado de la matriz A-02.1): mide rasgos
  auto-reportados; no mide desempeño, capacidad, honestidad ni aptitud.

---

## 2. Prohibiciones absolutas de conversión automática

> **Ninguna dimensión del IPIP-50-MX puede convertirse automáticamente en:**

| ❌ Prohibido | Sustituto permitido |
|---|---|
| Cumplimiento ("cumple el criterio D") | Descripción de tendencia + HDC cualitativa sin umbral |
| Incumplimiento ("no cumple") | "El resultado difiere de la dirección registrada como hipótesis para este criterio" (área de revisión) |
| Aptitud ("apto/no apto para el puesto") | X1/X2 prohibidos desde A-02.1; P3/P4 con revisión |
| Recomendación laboral ("recomendado para contratar") | P4 solo como "Considerar para entrevista" con sus condiciones (PASO 12) |
| "Candidato ideal" / "perfil ideal" | X5/X7 prohibidos |
| Predictor de desempeño o éxito | X6 prohibido: "Insumo de revisión humana" |
| Entrada a scores agregados (overall, "Big Five" agregado) | X15 prohibido; 5 dimensiones separadas, raw por factor |

Regla de cierre: el IPIP-50-MX produce **evidencia de rasgos y su lectura
descriptiva — y nada más** (herencia literal de A-02.2 PASO 4). Cualquier
salida que convierta una dimensión en alguno de los ítems de la tabla es una
**violación de política** detectable en auditoría (PASO 18).

---

## 3. Cómo entra el IPIP a la capa de criterios

1. Solo a través de **criterios D aprobados** y la pareja criterio↔instrumento
   registrada en la matriz (A-02.1/A-02.2).
2. El CriterionResult de categoría D (PASO 3 §3.4) es **descriptivo**:
   tendencia + HDC cualitativa + instrumento/versión citados.
3. La discrepancia cualitativa entre tendencia IPIP y lo esperado por HDC
   (o con la entrevista, PASO 9) genera **área de revisión** — nunca
   incumplimiento ni descarte.
4. Sin criterios D aprobados: el resultado permanece como InstrumentResult
   visible (salida A) y **no alimenta interpretación** (PASO 2 §5).
