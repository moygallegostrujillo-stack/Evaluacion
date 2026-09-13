# A-05.3 — 02 · PERSONALITY V1 STATUS (PASO 2)

## 1. Estado definido

```
PERSONALITY_V1_STATUS = NOT_IMPLEMENTED
```

El instrumento Big Five demo actual:

```
LEGACY / DEVELOPMENT_ONLY
```

**No debe presentarse como evaluación formal.**

## 2. Clasificación

El Big Five demo de 10 reactivos (2 por dimensión) se clasifica como:

| Atributo | Valor |
|---|---|
| source | PROJECT-CREATED |
| origin | UNKNOWN (paráfrasis vagas, no verificables como IPIP) |
| rights | UNKNOWN (sin licencia, atribución, ni cita) |
| evidence | NOT ESTABLISHED (sin α, EFA/CFA, baremos, validez) |
| V1 status | **NOT_IMPLEMENTED** |
| Legacy status | **LEGACY / DEVELOPMENT_ONLY** |

## 3. Qué significa NOT_IMPLEMENTED en V1

Para **nuevas evaluaciones** en V1:
- No se crean nuevas plantillas PSICOMETRICA (generator skip).
- No se sirven preguntas Big Five a candidatos nuevos.
- No se incorpora Personality al overallScore (engine excluye BIG_FIVE).
- No se genera personalityScore nuevo (no hay respuestas → scores 0).
- Frontend muestra "Evaluación de personalidad: no disponible en V1".

## 4. Qué significa LEGACY / DEVELOPMENT_ONLY

Para **datos históricos** (resultados pre-A-05.3):
- Las columnas `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` se PRESERVAN intactas.
- Los valores históricos NO se recalculan, NO se nullifican, NO se reinterpretan.
- Los rows con `formulaVersion = null` (LEGACY-OVERALL) o `formulaVersion = 'OVERALL-v1'` (A-04.5) conservan sus valores exactos.
- El frontend muestra los datos Big Five históricos si existen (radar con etiqueta "(legado)").

## 5. Separación LEGACY vs V1

| Aspecto | LEGACY (pre-A-05.3) | V1 (A-05.3+) |
|---|---|---|
| Plantilla PSICOMETRICA | Creada por generator | NO creada |
| Preguntas Big Five servidas | SÍ (legado) | NO |
| Respuestas Big Five | Persistidas (legado) | No se generan |
| personalityScore | Persistido (legado) | 0 (no data) |
| overallScore incluye BF | SÍ (OVERALL-v1) o fórmula histórica | NO (OVERALL-v1.1) |
| formulaVersion | null o 'OVERALL-v1' | 'OVERALL-v1.1' |
| Frontend muestra BF | Radar + scores (legado) | "no disponible en V1" |
| Recálculo | NUNCA | N/A |

## 6. Re-admisión futura

La re-admisión de personalidad requiere pasar PERSONALITY-G1..G10 (A-05.2 §14):
1. G3 Translation (ITC 2017)
2. G4b Scientific evidence MX
3. G5 Mexico evidence (EFA/CFA, α, baremos)
4. G6 Workplace use MX
5. G7 Legal review
6. G8 Governance (InstrumentResult)
7. G9 Implementation (canonical model)
8. G10 Regression

Tiempo estimado: 12–18 meses (objetivo: IPIP-50-MX validado).
