# A-06.5 — 11 · Sesgo (PASO 14)

## 1. Regla

Auditar cada pregunta contra atributos protegidos. Estados: PUBLICABLE / CONDICIONAL / NO_PUBLICABLE / LEGAL_REVIEW.

## 2. Atributos a auditar

| Atributo | Riesgo | Estado típico |
|---|---|---|
| Edad | ALTO | NO_PUBLICABLE |
| Embarazo | ALTO | NO_PUBLICABLE |
| Género | ALTO | NO_PUBLICABLE |
| Religión | ALTO | NO_PUBLICABLE |
| Estado civil | ALTO | NO_PUBLICABLE |
| Orientación sexual | ALTO | NO_PUBLICABLE |
| Identidad de género | ALTO | NO_PUBLICABLE |
| Discapacidad | ALTO | NO_PUBLICABLE (salvo BFOQ LEGAL_REVIEW) |
| Salud | ALTO | NO_PUBLICABLE (salvo BFOQ LEGAL_REVIEW) |
| Origen | ALTO | NO_PUBLICABLE |
| Nacionalidad no pertinente | ALTO | NO_PUBLICABLE (salvo BFOQ) |
| Situación familiar | ALTO | NO_PUBLICABLE |
| Opinión política | ALTO | NO_PUBLICABLE |
| Cualquier otro dato irrelevante | MEDIO-ALTO | NO_PUBLICABLE |

## 3. Proceso de auditoría de sesgo

Para cada pregunta candidata:

1. **Revisar el texto** contra la lista de atributos protegidos (A-06.4 `04-prohibited-data.md`).
2. **Revisar indirectos**: ¿la pregunta permite inferir un atributo protegido? (e.g. "¿En qué año te graduaste?" → edad).
3. **Revisar probes asociados**: ¿los probes introducen atributos protegidos?
4. **Asignar `legalStatus`**: PUBLICABLE / CONDICIONAL / NO_PUBLICABLE / LEGAL_REVIEW.
5. **Registrar**: en `InterviewQuestion.legalStatus` + `question-quality.csv`.

## 4. Estados

| Estado | Significado | Acción |
|---|---|---|
| PUBLICABLE | La pregunta no introduce atributos protegidos; pertinente al puesto | Puede pasar a REVIEW (tras validación BDI + proporcionalidad) |
| CONDICIONAL | La pregunta es pertinente pero requiere condición (e.g. BFOQ documentado) | Requiere documentación de la condición antes de REVIEW |
| NO_PUBLICABLE | La pregunta introduce atributos protegidos sin BFOQ | No se incluye en la guía; se elimina del banco |
| LEGAL_REVIEW | Duda sobre discriminación o BFOQ | REQUIERE REVISIÓN LEGAL antes de decidir |

## 5. Preguntas indirectas que elicitan atributos

| Pregunta indirecta | Atributo que elicita | Estado |
|---|---|---|
| "¿En qué año te graduaste?" | Edad | NO_PUBLICABLE |
| "¿Cómo pasaste las vacaciones con tu familia?" | Situación familiar | NO_PUBLICABLE |
| "¿Celebras Navidad?" | Religión | NO_PUBLICABLE |
| "¿Tu pareja también trabaja en este sector?" | Estado civil/orientación | NO_PUBLICABLE |
| "¿De dónde es tu acento?" | Origen | NO_PUBLICABLE |
| "¿Practicas algún deporte?" (si no relevante) | Salud | CONDICIONAL |

## 6. Mitigación del sesgo del entrevistador

Además de las preguntas, el sesgo puede venir del entrevistador:
- **Halo effect**: impresión global inflada.
- **Similarity bias**: preferencia por candidatos parecidos.
- **Confirmation bias**: buscar confirmar primera impresión.
- **Interviewer drift**: desviación de la guía con el tiempo.

**Mitigaciones**:
- Guía estructurada (mismas preguntas a todos).
- Rúbrica por indicador (evaluación separada, no global).
- Entrenamiento de entrevistadores (INTERVIEW-G9 pilot).
- Calibración periódica.
- Reviewer distinto al entrevistador (cuando posible).
- Auditoría de sesgo de la guía (INTERVIEW-G6).

## 7. Conexión con gates

La auditoría de sesgo pasa INTERVIEW-G6 (bias review) + LEGAL-G5 (no discriminación de A-06.4). Sin auditoría de sesgo por pregunta, la guía no pasa a ACTIVE.
