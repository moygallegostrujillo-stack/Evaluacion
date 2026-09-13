# A-01.3 — PASO 6: ESPECIFICACIÓN DE SCORING (IPIP50-BFM-1.0)

> Este documento describe EXACTAMENTE el scoring implementado en v1.0
> (`scoringVersion: IPIP50-BFM-1.0`). NO modifica el scoring. Fuente de verdad:
> `src/lib/instruments/ipip50-mx.ts` (función `scoreIPIP50`). Verificación
> determinista: `evidence-a01/a01-tests-results.txt` (TEST 1–10, 48/48 OK).

## 1. Escala de respuesta

- Rango oficial: **1–5** (`IPIP50_SCALE_MIN=1`, `IPIP50_SCALE_MAX=5`).
- Anclas oficiales IPIP renderizadas al español:
  | Valor | Etiqueta |
  |---|---|
  | 1 | Muy inexacta |
  | 2 | Moderadamente inexacta |
  | 3 | Ni exacta ni inexacta |
  | 4 | Moderadamente exacta |
  | 5 | Muy exacta |
- Comportamiento defensivo implementado: valores fuera de 1–5 se recortan al rango
  oficial (clamp) antes de puntuar. No existe opción de "sin respuesta" en el flujo
  activo; un ítem sin respuesta válida simplemente no cuenta como respondido.

## 2. Inversión (ítems inversos)

- Fórmula exacta: **`v' = 6 − v`** (1↔5, 2↔4, 3 queda 3).
- Aplica **SOLO** a los 24 ítems marcados en la **clave oficial IPIP** (sufijo `r`):
  q02r, q04r, q06r, q08r, q10r, q12r, q14r, q16r, q18r, q20r, q22r, q24r, q26r, q28r,
  q29r, q30r, q32r, q34r, q36r, q38r, q39r, q44r, q46r, q49r.
- Desglose por factor: E=5, A=4, C=4, ES=8, I=3.
- Ningún otro ítem se invierte. Queda prohibido añadir o quitar inversiones sin una
  nueva `scoringVersion` (gobernanza, `09-governance.md`).

## 3. Agrupación por factor y suma

- Cada ítem pertenece a **exactamente un factor** (10 ítems por factor):
  | Factor (key) | Etiqueta RH | Ítems (orden oficial) | Inversos |
  |---|---|---|---|
  | EXTRAVERSION | Extraversión | 1, 6, 11, 16, 21, 26, 31, 36, 41, 46 | 5 |
  | AGREEABLENESS | Amabilidad | 2, 7, 12, 17, 22, 27, 32, 37, 42, 47 | 4 |
  | CONSCIENTIOUSNESS | Responsabilidad | 3, 8, 13, 18, 23, 28, 33, 38, 43, 48 | 4 |
  | EMOTIONAL_STABILITY | Estabilidad emocional | 4, 9, 14, 19, 24, 29, 34, 39, 44, 49 | 8 |
  | INTELLECT | Intelecto | 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 | 3 |
- Puntaje del factor = **SUMA de los 10 ítems** (invertidos donde corresponde).
  **Sin pesos.** Todos los ítems pesan 1.

## 4. Rango de puntajes

- Rango por factor: **10–50** (mínimo teórico 10 × 1; máximo teórico 10 × 5).
- El puntaje solo se emite si el instrumento está **completo**: los 10 ítems de cada
  factor con respuesta válida (`complete=true`). Con instrumento incompleto,
  `raw=null` y `visual=null` (no se publican parciales como si fueran totales).

## 5. Representación visual 0–100

- Fórmula exacta: **`visual = raw / 50 × 100`** (equivalente a `raw / max × 100`),
  redondeada a 2 decimales. Implementación: `ipip50VisualFromRaw` y salida `visual`
  de `scoreIPIP50`.
- Ejemplo verificado: todas las respuestas = 3 → cada factor raw 30 → visual 60
  (TEST 1).
- **La escala 0–100 NO es un percentil.** Es una transformación lineal del puntaje
  crudo al máximo posible del instrumento (50). No compara a la persona con ninguna
  población. En la UI de RH la nota es explícita: "La escala 0-100 es una
  representación visual (raw/50×100); no constituye percentil."

## 6. Qué NO existe en el scoring (prohibiciones vigentes v1.0)

1. **No existen baremos propios** de EvaluHR (ni normas poblacionales mexicanas de la
   implementación). No se comparan puntajes contra distribuciones de referencia.
2. **No existen pesos laborales** ni de "adecuación al puesto". Ningún factor influye
   en decisiones automáticas.
3. **No existe overall psicométrico**: el scorer no produce promedio ni combinado de
   los 5 factores, y el IPIP **no participa** en el `overallScore` legacy (verificado:
   TEST 10 y E2E — overall calculado solo con psicología/integridad/conocimientos,
   igual que antes de IPIP).
4. **No existen categorías bajo/medio/alto**, percentiles, ni comparaciones con normas
   ficticias.
5. **No hay cruce** con conocimientos, integridad o competencias para formar juicios
   combinados de personalidad.
6. **La IA no interviene** en scoring, reversión, cálculo de factores ni resumen del
   instrumento: `scoreIPIP50` y `buildIPIP50Summary` son funciones deterministas.

## 7. Persistencia (trazabilidad v1.0)

- Resultados por factor en columnas dedicadas de `EvaluationResult` y
  `VacancyApplication`: `extraversionRaw`, `agreeablenessRaw`,
  `conscientiousnessRaw`, `emotionalStabilityRaw`, `intellectRaw` (Float, null = no
  aplicable/legacy).
- Cuádruple identificador de versión en `EvaluationTemplate`, `EvaluationResult` y
  `VacancyApplication`: `instrumentId`, `instrumentVersion`, `languageVersion`,
  `scoringVersion` (null = instrumentos legacy).
- El resumen textual del instrumento nuevo lo genera `buildIPIP50Summary`
  (descripciones de tendencias de respuesta y secciones completadas; sin decisiones
  de contratación). El generador de resúmenes legacy permanece intacto y no se invoca
  para sesiones IPIP.

## 8. Verificaciones deterministas que respaldan esta especificación

| TEST | Qué demuestra | Resultado |
|---|---|---|
| T1 | Todas = 3 → cada factor 30/50 (visual 60) | OK |
| T2 | Todas = 1 → E30/A26/C26/ES42/I22 (inversión correcta) | OK |
| T3 | Todas = 5 → E30/A34/C34/ES18/I38 (inversión correcta) | OK |
| T4 | Cada ítem en exactamente un factor | OK |
| T5 | Exactamente 50 ítems, códigos y textos únicos | OK |
| T6 | Exactamente 10 ítems por factor; 24 inversos | OK |
| T7 | Versionado presente (cuádruple) | OK |
| T8 | Ítems legacy (10 Big Five) NO participan | OK |
| T9 | 0 ítems IA — 50/50 verbatim de la fuente | OK |
| T10 | No existe overall psicométrico | OK |

Detalle completo: `evidence-a01/a01-tests-results.txt`.

— FIN DE LA ESPECIFICACIÓN DE SCORING —
