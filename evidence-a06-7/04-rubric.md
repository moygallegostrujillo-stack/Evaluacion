# EVALUHR — A-06.7 — 04 · Rúbrica Refinada v2 (PASO 4)

> **PILOTO / DRAFT / NO PRODUCTIVO.** RUBRIC-QUAL-v2-DRAFT. Objetivo: **reducir la variabilidad entre
> entrevistadores** sin convertir la entrevista en scoring numérico. La v2 hereda la v1 (A-06.3/A-06.5)
> y añade lo que el piloto A-06.6 identificó como faltante (divergencia M-G, hallazgo H-7).

## 1. Qué cambia y qué no cambia

| Elemento | v1 (A-06.3/5) | v2 (A-06.7) |
|---|---|---|
| Niveles | NO_EVIDENCE / INSUFFICIENT / LIMITED / SUPPORTED / STRONG | **Sin cambio** — mismos 5 niveles cualitativos |
| Scoring | Sin puntos, sin promedios, sin pesos, sin cortes | **Sin cambio** — sigue sin scoring |
| Asignación | Humana con `rationale` obligatoria | **Sin cambio** + la rationale debe citar el/los indicadores observados |
| Anclas | Criterios generales por nivel | **NUEVO**: anclas cualitativas **por indicador** (qué fragmento de Action cubre qué indicador) — `rubric-by-indicator.csv` + `05-indicator-examples.md` |
| Regla de indicadores | Implícita | **NUEVO formalizada**: 0 indicadores observados → NO_EVIDENCE/INSUFFICIENT; 1–2 → LIMITED; 3+ en 1 ejemplo con R verificable → elegible a SUPPORTED; 3+ en 2+ ejemplos consistentes → elegible a STRONG (confirmada por piloto, H-8) |
| Regla de Action | Implícita | **NUEVO formalizada** (`06-action-rules.md`): sin Action propia concreta → nunca SUPPORTED/STRONG |
| Elegibilidad vs asignación | — | **NUEVO**: cumplir el criterio hace al nivel **elegible**; la asignación final sigue siendo humana y puede ser más conservadora con rationale |

## 2. Definición de niveles (v2 — sin cambio de significado)

| Nivel | Criterio | Ejemplo de evidencia observada |
|---|---|---|
| NO_EVIDENCE | No se observó ningún indicador | Entry-level sin experiencia laboral; no responde; "nunca me pasó" (con experiencia) |
| INSUFFICIENT | Evidencia presentada pero no aprovechable | "Siempre trato bien a los clientes" (GENERAL_CLAIM); respuesta vaga; sin Action propia |
| LIMITED | Evidencia parcial: 1–2 indicadores en 1 ejemplo; o hipotético con juicio razonable | "Le dije que se lo cambiaría" (1 indicador parcial, sin manejo de emoción ni R) |
| SUPPORTED | 3+ indicadores en 1 ejemplo claro y relevante, con Result verificable | Escuchó + explicó alternativas + mantuvo calma + cliente satisfecho (M-A, V-A) |
| STRONG | 3+ indicadores en 2+ ejemplos distintos y consistentes, con Results verificables | 2 ejemplos de coordinación/cobertura con resultados (M-J, V-J) |

## 3. Regla de mapeo Action→Indicador (resuelve H-7 / divergencia M-G)

> **RM-1.** Un fragmento de Action "cubre" un indicador **solo si describe una conducta observable del
> candidato que corresponde a la definición del indicador** — no basta que sea compatible o verosímil.
> El mapeo se hace por indicador y se nombra explícitamente en la rationale.

Aplicación al caso M-G (el caso que originó la v2):

| Fragmento de respuesta | ¿Cubre indicador? | Resolución v2 |
|---|---|---|
| "un cliente se quejó de que el café estaba frío" | S (no es indicador) | Situation documentada |
| "le dije que se lo cambiaría" | **IND-SVC-002-C parcial** (propone acción correctiva — pero es promesa futura dentro de la situación, no acción completada) | 1 indicador parcial → LIMITED |
| (ausente) | IND-SVC-002-A (manejo de emoción del cliente) | NO cubierto |
| (ausente) | R | NO documentado → refuerza LIMITED |
| **Nivel final** | | **LIMITED** (no SUPPORTED) — el Reviewer A tenía razón por la regla RM-1; el consenso del piloto queda formalizado |

**Contraste (cubo completo M-A)**: "me disculpé + llevé la sopa a calentar + le ofrecí pan mientras esperaba + le pregunté si estaba bien" cubre IND-SVC-001-A (detecta necesidad/escucha), IND-SVC-001-C (explica/comunica), IND-SVC-001-D (conducta profesional bajo demanda) + R verificable → SUPPORTED. La diferencia entre M-G (LIMITED) y M-A (SUPPORTED) es observable, nombrable y replicable — ese es el objetivo de la v2.

## 4. Reglas de asignación (v2)

1. **Asignación humana**: entrevistador o reviewer asigna el nivel; sin `rationale` que cite indicadores, la asignación no es válida.
2. **IA nunca asigna**: la IA puede sugerir (AI_GENERATED) pero el estado/nivel final es HUMAN_REVIEWED.
3. **Append-only**: una vez asignado no se borra; corrección = nueva versión de InterviewReview.
4. **Elegibilidad ≠ obligación**: cumplir el criterio habilita el nivel; el evaluador puede asignar menor con rationale.
5. **Por (competencia, puesto)**: RUBRIC-MESERO-* / RUBRIC-VENDEDOR-* — no rúbricas genéricas.
6. **Los ejemplos de las anclas no son "respuestas correctas"**: son ejemplos de **evidencia observada**; sirven para comparar forma y especificidad, no contenido literal.
7. **Versionado**: lo publicado es inmutable; cambios = nueva versión (v2 es DRAFT/PILOTO — nada publicado).

## 5. Estructura de la rúbrica por indicador

Cada indicador del catálogo A-06.2 tiene 5 anclas (NO_EVIDENCE..STRONG) descritas en
`rubric-by-indicator.csv` (PASO 18) con columnas: competencyId, indicatorId, noEvidence, insufficient,
limited, supported, strong, examples, status. Cobertura: 23 indicadores (20 ejercitados por el banco +
3 de COMP-TEC-001 marcados "sin pregunta en banco — no pilotados").

## 6. Conexión con calibración y gates

- La v2 es el instrumento del protocolo de calibración (`09-calibration.md`, PASO 10) y del modelo de
  entrenamiento (`10-training.md`, PASO 11).
- Alimenta INTERVIEW-G4 (question quality) y la evidencia de INTERVIEW-G9 (pilot, EVIDENCE PARTIAL).
- **No es validación psicométrica** y no contribuye a INTERVIEW-G10.
