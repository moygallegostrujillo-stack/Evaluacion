# A-05.1 — 08 · ANÁLISIS DE RIESGO METODOLÓGICO (PASO 9)

## 1. Riesgos identificados

| # | Riesgo | Severidad | Detalle |
|---|---|---|---|
| R1 | Preguntas sin fuente | ALTO | Los 10 reactivos son paráfrasis vagas sin fuente verificable; no se puede reclamar respaldo de IPIP/NEO/BFI |
| R2 | Scoring arbitrario | MEDIO | `normalizeBigFive = ((avg−1)/4)·100` es lineal, no baremado; los pesos 0.30/0.50/1.00 en overall son históricos, no psicométricamente justificados |
| R3 | Dimensiones mal definidas | ALTO | 2 ítems por dimensión es insuficiente para α ≥ .70; sin análisis factorial que confirme 5 factores |
| R4 | Exceso de interpretación | MEDIO | `generateSummary` produce «alta extraversión», «alto neuroticismo» etc. a partir de 2 ítems; descriptivo pero puede leerse como diagnóstico |
| R5 | Perfil ideal de personalidad | BAJO | No existe codificado (ningún `idealProfile`, `targetBigFive`); riesgo solo si se introduce |
| R6 | Uso laboral no validado | ALTO | El instrumento alimenta `overallScore` (peso 0.30) que se muestra a RH; no hay validez predictiva laboral documentada |
| R7 | Faking / deseabilidad social | MEDIO | Los reactivos son transparentes (face-valid); un candidato puede adivinar la respuesta «deseable»; no hay escala de deseabilidad social ni ítems de sesgo |
| R8 | Doble inversión neuroticismo | BAJO (ya corregido en A-04.5 para overall) | En display `CandidateDetailView` L95 aún hace `(100−N)` para el agregado; scoring de ítems ya invierte, no hay doble inversión en el path overall |
| R9 | Falta de baremos | MEDIO | Sin percentiles ni normas; un score de 70 no tiene interpretación sin referencia poblacional |
| R10 | Falta de versión de instrumento | BAJO | No existe `instrumentVersion` para personalidad (a diferencia de Knowledge); cambios a los reactivos no son rastreables |

## 2. Severidad agregada

- **ALTO**: 3 (R1, R3, R6)
- **MEDIO**: 4 (R2, R4, R7, R9)
- **BAJO**: 3 (R5, R8, R10)

## 3. Riesgo crítico (R6) — detalle

El uso laboral no validado es el riesgo más alto porque:
1. Los puntajes de personalidad alimentan `overallScore` (peso 0.30 en el caso de 3 secciones).
2. `overallScore` se muestra a RH en dashboard, candidate detail, comparador.
3. Aunque `recommendation` es guidance (no APTO/NO_APTO), el `overallScore` puede influir implícitamente en decisiones de RH.
4. No existe validez predictiva documentada para los 10 reactivos actuales.

**Mitigación actual**: A-04.5 aisló Integrity del overall pero NO aisló personalidad. A-05.1 es auditoría (no cambia). La decisión de aislar personalidad del overall queda para PASO 11 (doc 10).

## 4. Riesgo de faking (R7) — detalle

Los reactivos son face-valid (el candidato puede adivinar qué responde la dimensión). Ejemplo:
- «Disfruto trabajar en equipo» (EXTRAVERSION directo) → la respuesta «5» es socialmente deseable.
- «Me estreso fácilmente» (NEUROTICISM reverse) → la respuesta «1» es socialmente deseable.

No existe:
- escala de deseabilidad social (e.g. Marlowe-Crowne, EPQ Lie scale);
- ítems de sesgo/distractores;
- correlación con un criterio de faking.

Para selección de personal, esto sesga los resultados hacia candidatos que adivinan la respuesta deseable.

## 5. Riesgo de dimensiones mal definidas (R3) — detalle

Con 2 ítems por dimensión:
- α esperado < .60 (regla práctica: ≥3 ítems para α≥.70).
- La estructura factorial no puede confirmarse (EFA requiere más ítems por factor).
- Un ítem con error de medición contamina el 50% de la dimensión.

Instrumentos Big Five formales usan:
- IPIP-50: 10 ítems por dimensión.
- BFI-44: 8–10 por dimensión.
- NEO-PI-R: 12 por faceta, 60 por dimensión.
- Mini-IPIP: 4 por dimensión (mínimo aceptable).

## 6. Conclusión PASO 9

El instrumento actual presenta **3 riesgos ALTO, 4 MEDIO, 3 BAJO**. Los riesgos ALTO (preguntas sin fuente, dimensiones mal definidas, uso laboral no validado) hacen inviable su uso como instrumento psicométrico formal sin un proceso de sustitución o validación.
