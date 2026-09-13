# EVALUHR — A-06.11 · 05 · RUBRIC PACKAGE — RUBRIC-QUAL-v2-DRAFT (PASO 5–6)

## 0. Estatus

| Campo | Valor |
|---|---|
| Identificador | RUBRIC-QUAL-v2-DRAFT |
| Estatus | DRAFT — NO PRODUCTIVO — requiere dictamen (INTERVIEW-G7/LEGAL-G8) y pilotaje (INTERVIEW-G9) |
| Origen estructural | A-06.3 `11-rubric.md` (verificado en disco) — regla dura: **NO puntos, NO 1–5, NO 0–100** |
| Unidad de aplicación | Una rúbrica por (competencyId, jobId) — no genérica |
| Asignación | Exclusivamente humana, con `rationale` textual |

## 1. Niveles cualitativos

| Nivel | Significado | Criterio de asignación |
|---|---|---|
| NO_EVIDENCE | No se observó ningún indicador | El candidato no aporta ejemplo o no responde (p.ej. "nunca tuve clientes" en mesero con experiencia declarada → además genera conflicto con CV, no inferencia) |
| INSUFFICIENT | Evidencia presentada pero no aprovechable | Respuesta vaga, opinión, afirmación general, hipotético sin pasado, o sin Action específica |
| LIMITED | Evidencia parcial | Un ejemplo con Action que mapea a 1–2 indicadores, o Result ausente/no verificable |
| SUPPORTED | Evidencia sólida en un ejemplo | Action específica propia que mapea a 3+ indicadores + Result verificable |
| STRONG | Evidencia sólida en múltiples ejemplos | 2+ ejemplos distintos, indicadores consistentes, Results verificables |

## 2. Cómo se asigna (procedimiento)

1. El reviewer parte de la `InterviewEvidence` inmutable (STAR capturado + indicadores observados).
2. Localiza la rúbrica del par (competencyId, jobId).
3. Verifica los umbrales en orden ascendente (¿NO_EVIDENCE? ¿INSUFFICIENT? ¿LIMITED? ¿SUPPORTED? ¿STRONG?) — se asigna el nivel más alto que la evidencia cumpla íntegramente.
4. Escribe `rationale` textual que cite la conducta observada y los indicadores mapeados (no basta marcar el nivel).
5. Registra la `InterviewReview` (append-only); toda corrección = nueva versión, nunca borrado.
6. Conflicto con otra fuente (CV/referencia) → NO se promedia: `PENDING_REVIEW` + ConflictRecord (A-06.3 `10-conflicts.md`).

## 3. Quién la asigna

- **Entrevistador**: puede proponer nivel inicial en su captura — con rationale.
- **Reviewer humano**: asigna/confirma el nivel para la `InterviewReview` (recomendado: distinto al entrevistador, segregación de funciones).
- **Approver humano**: aprueba el `CompetencyResult`.
- **IA**: puede *sugerir*; jamás asigna. Sugerencia siempre marcada "Sugerencia de IA — requiere verificación humana" y auditable contra la decisión final.

## 4. Qué evidencia necesita cada nivel (requisitos mínimos)

| Para alcanzar | Exige simultáneamente |
|---|---|
| LIMITED | Situation o Task identificable + **Action parcial propia** mapeable a 1–2 indicadores |
| SUPPORTED | Situation + Task + **Action propia concreta** (3+ indicadores) + **Result verificable** |
| STRONG | Lo anterior × 2+ ejemplos distintos y consistentes |

## 5. Qué NO puede utilizarse para subir nivel

| Fuente no válida | Razón |
|---|---|
| Resultado externo (logro del equipo, del área, de la empresa) | Resultado externo ≠ competencia del candidato |
| Escenario hipotético ("yo haría…") | Hipotético ≠ conducta pasada |
| Afirmación general ("siempre trato bien…") | Opinión, no observación |
| CV/curriculum sin conducta verificable en entrevista | Claim documental; conflicto → PENDING_REVIEW |
| Sugerencia de IA sin verificación humana | IA no decide |
| Contenido obtenido tras revelación involuntaria sensible | No conservado (07); jamás ingresa a evidencia |

## 6. Regla de Action (PASO 6 — explícita)

> **Sin Action propia concreta → no SUPPORTED / no STRONG. Íntegramente.**

Derivados obligatorios de la regla:

| Regla | Enunciado |
|---|---|
| R1 | Resultado externo ≠ competencia (el logro del equipo no demuestra conducta del candidato) |
| R2 | Hipotético ≠ conducta pasada ("qué harías" no es evidencia; se redirige con PROBE-UNI-005) |
| R3 | Respuesta vaga → INSUFFICIENT (opinión/generalidad sin STAR) |
| R4 | **INSUFFICIENT ≠ 0** — INSUFFICIENT no es un cero numérico: no hay números, no se promedia, no se pondera, no hay corte. Es una etiqueta cualitativa con rationale |

## 7. Por qué no es un score psicométrico

1. **Sin escala numérica**: los 5 niveles no se traducen a números.
2. **Sin agregación**: no se promedian niveles entre competencias ni entre preguntas.
3. **Sin pesos**: ninguna competencia pondera más que otra en un cálculo (criticality es clasificación de diseño, no coeficiente).
4. **Sin cortes ni baremos**: no existe "≥ X = APTO", percentiles ni normas.
5. **Sin inferencia de rasgo**: mide presencia/ausencia de conducta observable narrada, no constructos latentes (frontera con IPIP/Personality, intocable).
6. **Sin validación predictiva**: INTERVIEW-G10/COMP-G10 = NOT EVALUATED; no existe evidencia de validez.
7. **Función**: traducir evidencia STAR en una etiqueta cualitativa documentada con rationale, como **insumo complementario para revisión humana** (LFPDPPP Art. 37 Bis — el resultado nunca es la única base de decisión).

## 8. Ejemplo calibrado (referencia verificada A-06.3 `21-examples.md`)

- "Siempre trato bien a los clientes" → INSUFFICIENT (§2.3).
- Ejemplo con Action parcial y sin Result → LIMITED (§2.4).
- Ejemplo con Action mapeando 3 indicadores + Result verificable (propina 15%, sin reclamo posterior) → SUPPORTED (§2.5).
- Conflicto CV vs entrevista → PENDING_REVIEW, no promedio (§2.6).

## 9. Conexión con gates

Rúbrica pasa INTERVIEW-G5 (rubric). La consistencia inter-revisor solo podrá medirse en el piloto no productivo (INTERVIEW-G9) — **A-06.10 no ejecutado**, por lo que no existe hoy métrica de consistencia y esta rúbrica queda en DRAFT.
