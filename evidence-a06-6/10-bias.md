# A-06.6 — 10 · Sesgos (PASO 12)

## 1. Regla

Introducir respuestas sintéticas que puedan activar sesgos. Determinar si la estructura de la entrevista ayuda a contener estos sesgos.

## 2. Sesgos probados

### 2.1 Halo effect

| Elemento | Detalle |
|---|---|
| Estímulo sintético | Respuesta muy fuerte (Patrón J: M-J, V-J) seguida de una respuesta débil en otra competencia |
| Escenario | El candidato da STRONG en COMP-COL-001; después da una respuesta vaga en COMP-ORG-001 |
| ¿El halo infló la segunda evaluación? | ✗ NO — la rúbrica por indicador separado asignó INSUFFICIENT a COMP-ORG-001 independientemente del STRONG previo |
| Mitigación verificada | Rúbrica por indicador (no impresión global) contuvo el halo |

### 2.2 Similarity bias

| Elemento | Detalle |
|---|---|
| Estímulo sintético | Candidato que comparte características con el entrevistador (mencionado en la narración: "también yo trabajé en una cafetería parecida") |
| ¿Influyó en la evaluación? | La similitud no se registró como evidencia; la rúbrica evaluó solo la conducta descrita |
| Mitigación verificada | Rúbrica por indicador + guía estructurada (mismas preguntas a todos) |

### 2.3 Confirmation bias

| Elemento | Detalle |
|---|---|
| Estímulo sintético | Candidato con primera respuesta débil (Patrón B: INSUFFICIENT) seguida de una respuesta fuerte (Patrón A: SUPPORTED) |
| ¿La primera impresión contaminó la segunda? | ✗ NO — cada pregunta se evaluó independientemente por la rúbrica |
| Mitigación verificada | Evaluación por competencia separada |

### 2.4 Estereotipo

| Elemento | Detalle |
|---|---|
| Estímulo sintético | Revelación involuntaria de atributo protegido (M-H: embarazo; V-H: religión) |
| ¿La revelación influyó en la evaluación de la competencia? | ✗ NO — la revelación se marcó INVALID; solo la conducta de adaptabilidad se evaluó (LIMITED) |
| Mitigación verificada | Regla A-06.4 `04-prohibited-data.md` §5 (no registrar, no usar, no profundizar) |

### 2.5 Información irrelevante

| Elemento | Detalle |
|---|---|
| Estímulo sintético | Candidato menciona datos no relevantes ("mi primo también trabaja ahí", "me gusta el fútbol") |
| ¿Se registró como evidencia? | ✗ NO — solo conducta laboral observable se registró (WHAT_COUNTS_AS_EVIDENCE) |
| Mitigación verificada | `07-evidence-rules.md` WHAT_DOES_NOT_COUNT |

### 2.6 Atributos protegidos (evidencia)

| Atributo | Caso | ¿Contenido por la estructura? |
|---|---|---|
| Embarazo | M-H | ✓ SÍ — revelación no registrada; conducta sí |
| Religión | V-H | ✓ SÍ — revelación no registrada; conducta sí |

## 3. Resumen de contención de sesgos

| Sesgo | ¿Contenido por la estructura? | Mecanismo |
|---|---|---|
| Halo | ✓ SÍ | Rúbrica por indicador |
| Similarity | ✓ SÍ | Rúbrica por indicador + guía estructurada |
| Confirmation | ✓ SÍ | Evaluación por competencia separada |
| Estereotipo (revelación) | ✓ SÍ | Regla de revelación involuntaria (no registrar) |
| Información irrelevante | ✓ SÍ | WHAT_DOES_NOT_COUNT |
| Atributos protegidos | ✓ SÍ | Revelación no registrada + guía aprobada |

## 4. Hallazgo

**La estructura de la entrevista (rúbrica por indicador + guía estructurada + reglas de evidencia) contuvo todos los sesgos probados** en los casos sintéticos. Esto valida el diseño de A-06.3/A-06.5 a nivel metodológico (no psicométrico — ver `18-limitations.md`).

## 5. Limitación

La contención de sesgos en el piloto es **simulada** (evaluación conceptual sobre casos sintéticos). No demuestra que entrevistadores reales sin entrenamiento contengan estos sesgos. El entrenamiento de entrevistadores (INTERVIEW-G9) sigue siendo obligatorio antes de productivo.
