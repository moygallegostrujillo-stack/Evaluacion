# A-05.1 — 01 · INSTRUMENTO ACTUAL DE PERSONALIDAD (PASO 1, 5)

## 1. Identificación

| Campo | Valor |
|---|---|
| instrumentName | «Big Five» (nombre descriptivo del modelo; NO cita IPIP/NEO/BFI) |
| version | Sin versionar (no existe `instrumentVersion`, `blueprintVersion` ni `scoringVersion` para personalidad) |
| itemCount | **10 reactivos** |
| dimensions | 5 (2 ítems por dimensión) |
| source | PROJECT-CREATED |
| author | Desarrollador del proyecto (no documentado en código) |
| rights | UNKNOWN (ninguna licencia, cita ni atribución declarada) |
| scoringMethod | LIKERT 1–5; `normalizeBigFive = ((avg−1)/4)·100`; NEUROTICISM con `reverseScored` a nivel de ítem |

## 2. Archivos de origen (los TRES sitios con la MISMA lista de 10 reactivos)

1. **`src/lib/generate-templates.ts`** L10–21 — `BIG_FIVE_QUESTIONS` (canon: sirve evaluaciones internas vía `generateTemplatesForPosition`).
2. **`src/app/api/public/apply/route.ts`** L215–226 — `HARDCODED_BIG_FIVE` (fallback si no hay templates; sirve evaluaciones públicas).
3. **`prisma/seed.ts`** — indirecto: crea posiciones que disparan `generateTemplatesForPosition`, que inserta los 10 reactivos en `Question`.

Los textos son **idénticos** entre (1) y (2) (verificado caracter por caracter). No existe una TERCERA variante.

## 3. Los 10 reactivos (texto · dimensión · dirección)

| # | Texto | Dimensión | reverseScored |
|---|---|---|---|
| 1 | Disfruto probar nuevas formas de hacer las cosas en el trabajo | OPENNESS | no |
| 2 | Me considero una persona creativa e imaginativa | OPENNESS | no |
| 3 | Siempre organizo mis tareas antes de empezar a trabajar | CONSCIENTIOUSNESS | no |
| 4 | Cuando me propongo algo, lo completo sin importar los obstáculos | CONSCIENTIOUSNESS | no |
| 5 | Me siento cómodo/a iniciando conversaciones con personas que no conozco | EXTRAVERSION | no |
| 6 | Disfruto trabajar en equipo más que de forma individual | EXTRAVERSION | no |
| 7 | Me preocupa que mis compañeros de trabajo se sientan bien | AGREEABLENESS | no |
| 8 | Prefiero llegar a un acuerdo que ganar una discusión | AGREEABLENESS | no |
| 9 | Me estreso fácilmente cuando tengo mucho trabajo por hacer | NEUROTICISM | **sí** |
| 10 | Me cuesta controlar mis emociones cuando algo sale mal | NEUROTICISM | **sí** |

## 4. Scoring (evaluations/route.ts L141–148, 171–192)

```typescript
function calculateLikertScore(value, reverseScored) {
  const v = Math.max(1, Math.min(5, value))   // clamp 1–5
  return reverseScored ? 6 - v : v            // NEUROTICISM: 6−v
}

function normalizeBigFive(avgScore) {
  return ((avgScore - 1) / 4) * 100           // Likert 1–5 → 0–100
}
```

- Por dimensión: `avg(scores)` → `normalizeBigFive` → `Math.round(·100)/100` (2 dec).
- `avgBigFive = sum(dims con respuestas) / count(dims con respuestas)` (adaptativo; las dimensiones sin datos se excluyen, no se promedian como 0).
- Salida persistida: `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` (Float 0–100) en `EvaluationResult` y `VacancyApplication`.

## 5. Las cinco dimensiones (PASO 5)

| Dimensión | Ítems | Dirección (alto = más del rasgo) | Scoring | Rango | Interpretación actual |
|---|---|---|---|---|---|
| OPENNESS | 2 | directo (alto = más apertura) | normalize 0–100 | 0–100 | «alta apertura a la experiencia» si ≥70 |
| CONSCIENTIOUSNESS | 2 | directo (alto = más responsabilidad) | normalize 0–100 | 0–100 | «alta responsabilidad» si ≥70 |
| EXTRAVERSION | 2 | directo (alto = más extraversión) | normalize 0–100 | 0–100 | «alta extraversión» si ≥70 |
| AGREEABLENESS | 2 | directo (alto = más amabilidad) | normalize 0–100 | 0–100 | «alta amabilidad» si ≥70 |
| NEUROTICISM | 2 | reverseScored (alto score = **bajo** neuroticismo = estable) | normalize + `6−v` | 0–100 | «alto neuroticismo» en concerns si >60 (valor original invertido) |

**2 ítems por dimensión es insuficiente para alcanzar α ≥ .70** (regla práctica: ≥3–5 ítems por escala para confiabilidad aceptable).

## 6. ¿El sistema hace inferencias laborales?

**Sí, parcialmente** — el `generateSummary()` (evaluations L349+) produce frases como:
- «alta extraversión», «alta responsabilidad», «alta apertura a la experiencia», «alta amabilidad» (si ≥70).
- En concerns: «alto neuroticismo» si >60.

Estas son **descripciones descriptivas del rasgo**, NO predicciones de desempeño laboral ni recomendaciones de contratación. El `recommendation` es guidance de completitud (PERFIL_COMPLETO/PARCIAL/PENDIENTE), NO usa los puntajes de personalidad para APTO/NO APTO. **No existe un «perfil ideal de personalidad»** codificado.

## 7. Frontend

- `EvaluationView.tsx` L396: describe la sección como «Evalúa tu perfil de personalidad a través del modelo Big Five».
- `PublicEvaluationView.tsx` L67: «Test de personalidad Big Five — mide tu perfil de competencias y rasgos de personalidad.»
- `CandidateDetailView.tsx` L77–95, 398–417: radar Big Five + ScoreBars por dimensión; L95 calcula un «Big Five» agregado `(O+C+E+A+(100−N))/5` (re-invierte N para display).
- `CompareView.tsx` L96, 212–215: radar comparativo «Big Five - Comparativo».
- `ConsentView.tsx` L228, 285: menciona «evaluaciones psicométricas (Big Five)» en el aviso de consentimiento.

## 8. Resultados almacenados

`EvaluationResult` (schema L260–264): `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` — Float @default(0), 0–100. Idénticas columnas en `VacancyApplication` (L385–389). No existe `formulaVersion` específico de personalidad (solo el global `OVERALL-v1` de A-04.5).

## 9. Conclusión PASO 1

El instrumento REAL de personalidad es un **«Big Five» demo de 10 reactivos creados por el desarrollador**, sin citar fuente, sin versión, sin baremos, sin evidencia psicométrica documentada. Se sirve en 3 sitios idénticos (generate-templates, apply fallback, seed). Score: Likert 1–5 → 0–100 con NEUROTICISM invertido. NO es IPIP, NO es NEO, NO es BFI — el nombre «Big Five» es solo descriptivo del modelo de cinco factores.
