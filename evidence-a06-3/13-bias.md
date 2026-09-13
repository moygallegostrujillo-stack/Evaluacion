# A-06.3 — 13 · Sesgo / Bias (PASO 17)

## 1. Regla

Auditar preguntas que puedan revelar atributos protegidos o ser irrelevantes al puesto. Definir **NO_PUBLICABLE** cuando no exista relación laboral legítima y documentada.

## 2. Atributos protegidos (México)

En el contexto mexicano (LFPDPPP, Ley Federal del Trabajo, NOM-035), los atributos protegidos incluyen:
- Edad
- Género
- Embarazo
- Religión
- Estado civil
- Orientación sexual
- Discapacidad
- Origen étnico/nacional
- Opiniones políticas
- Condiciones sociales o económicas
- Salud (no relevante al puesto)
- Situación familiar

## 3. Sesgos del entrevistador

| Sesgo | Descripción | Mitigación |
|---|---|---|
| Halo effect | Una impresión global (positiva/negativa) influye la evaluación de todas las competencias | Rúbrica por indicador separado; evaluación ciega parcial |
| Similarity bias | Preferencia por candidatos parecidos al entrevistador (género, edad, origen) | Guía estructurada + entrenamiento + múltiples entrevistadores diversos |
| Confirmation bias | El entrevistador busca evidencia que confirme su primera impresión | Rúbrica por indicador; reviewer distinto |
| Interviewer drift | El entrevistador se desvía de la guía con el tiempo | Guía predefinida + auditoría + recalibración |
| Stereotype threat | El candidato rinde peor por percepción de sesgo | Ambiente respetuoso; preguntas neutras; formación del entrevistador |

## 4. Preguntas discriminatorias — ejemplos prohibidos

| Tipo | Ejemplo prohibido | Por qué |
|---|---|---|
| Edad | "¿Cuántos años tienes?" / "¿En qué año naciste?" | Edad es atributo protegido; irrelevante para competencia |
| Embarazo | "¿Tienes planes de embarazo?" / "¿Estás embarazada?" | Embarazo es atributo protegido; discriminatorio |
| Estado civil | "¿Estás casado/a?" / "¿Tienes hijos?" | Estado civil/familia es atributo protegido; irrelevante para competencia |
| Religión | "¿Qué religión practicas?" / "¿Eres [religión]?" | Religión es atributo protegido |
| Género | "¿Cómo te identificas?" (salvo BFOQ estricto) | Género es atributo protegido; irrelevante para competencia |
| Origen | "¿De dónde eres?" / "¿Tienes acento de...?" | Origen es atributo protegido |
| Discapacidad | "¿Tienes alguna discapacidad?" (salvo BFOQ) | Discapacidad es atributo protegido; unless esencial al puesto |
| Salud | "¿Tienes alguna enfermedad?" (salvo BFOQ) | Salud es atributo protegido |
| Orientación sexual | "¿Cuál es tu orientación sexual?" | Orientación sexual es atributo protegido; irrelevante |
| Situación familiar | "¿Con quién vives?" / "¿Tu pareja trabaja?" | Situación familiar es atributo protegido |

## 5. Regla: NO_PUBLICABLE

Una pregunta que pueda revelar un atributo protegido sin relación laboral legítima y documentada = **NO_PUBLICABLE**.

**Ejemplo**:
- Pregunta: "¿Tienes planes de formar familia pronto?"
- Evaluación: NO_PRODUCTABLE (revela embarazo/estado civil, atributos protegidos, sin relación con competencia).
- Acción: no se publica; se elimina del banco; se documenta el rechazo.

## 6. BFOQ (Bona Fide Occupational Qualification)

En casos raros, un atributo puede ser esencial para el puesto (BFOQ). En México, esto es muy restrictivo y requiere:
- Justificación documentada de esencialidad.
- Revisión legal (INT-G7).
- No extensible a decisiones generales.

**Ejemplo hipotético (no producto)**: un puesto en un refugio de mujeres donde el ocupante debe ser mujer puede ser BFOQ. Requiere revisión legal caso por caso; NO se asume en V1.

## 7. Preguntas neutras (correctas)

Un pregunta correcta se enfoca en conducta laboral sin revelar atributos protegidos:

| Incorrecto | Correcto |
|---|---|
| "¿Eres joven y enérgico?" | "Cuéntame de una vez que mantuviste un ritmo alto durante un turno largo" |
| "¿Tienes buen aspecto?" | "Describe cómo mantienes tu presentación personal según el estándar del puesto" |
| "¿No tienes familia que te impida viajar?" | "¿Estás disponible para rotación de turnos según el requerimiento del puesto?" (si el turno es esencial y BFOQ-validado) |
| "¿Hablas sin acento?" | "¿Puedes describir cómo te comunicas con clientes?" |

## 8. Mitigación del sesgo del entrevistador

1. **Guía estructurada**: mismas preguntas a todos los candidatos.
2. **Rúbrica por indicador**: evaluación separada, no global.
3. **Entrenamiento**: antes de productivo (INT-G9 pilot).
4. **Calibración periódica**: sesiones entre evaluadores.
5. **Doble codificación** (pilotaje): medir consistencia inter-entrevistador.
6. **Reviewer distinto**: la revisión post-entrevista la hace un humano distinto al entrevistador (cuando posible).
7. **Auditoría de preguntas**: revisión legal de la guía (INT-G7).

## 9. Conexión con gates

- CI-VAL-6 (no discriminatorio) de A-06.2 + `17-discrimination.md` pasa INT-G6 (bias review).
- Revisión legal de la guía pasa INT-G7 (legal review).

Sin estos gates, la entrevista no se activa en V1.
