# A-06.4 — 13 · Matriz de No Discriminación (PASO 13)

## 1. Regla

Crear una matriz de pregunta/categoría con: riesgo, motivo, estado (PUBLICABLE / CONDICIONAL / NO_PUBLICABLE / LEGAL_REVIEW), mitigación.

## 2. Matriz

| pregunta/categoría | riesgo | motivo | estado | mitigación |
|---|---|---|---|---|
| Edad | ALTO | Atributo protegido (LFT Art 3, CONAPRED) | NO_PUBLICABLE | No preguntar edad ni fecha de nacimiento; no inferir por contenido |
| Fecha de nacimiento | ALTO | Equivalente a edad | NO_PUBLICABLE | No recoger en entrevista |
| Género / sexo | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar; no inferir por voz/nombre |
| Embarazo | ALTO | Atributo protegido; discriminatorio (LFPEPD) | NO_PUBLICABLE | No preguntar planes de embarazo; no inferir |
| Maternidad / paternidad | ALTO | Situación familiar; protegido | NO_PUBLICABLE | No preguntar por hijos |
| Estado civil | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar |
| Religión | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar; no inferir por festividades |
| Orientación sexual | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar |
| Identidad de género | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar |
| Discapacidad | ALTO | Atributo protegido; BFOQ restrictivo | NO_PUBLICABLE (salvo BFOQ con LEGAL_REVIEW) | No preguntar; si BFOQ, justificación + revisión legal |
| Salud | ALTO | Atributo protegido; datos sensibles | NO_PUBLICABLE (salvo BFOQ con LEGAL_REVIEW) | No preguntar enfermedades; si BFOQ (e.g. NOM-251), recoger como documento |
| Enfermedades específicas | ALTO | Atributo protegido; altamente sensible | NO_PUBLICABLE | No preguntar |
| Información genética | ALTO | Atributo protegido; altamente sensible | NO_PUBLICABLE | No preguntar |
| Origen étnico | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar; no inferir por apariencia |
| Nacionalidad (no BFOQ) | ALTO | Atributo protegido salvo requisito legal | NO_PUBLICABLE (salvo BFOQ: autorización de trabajo) | Si BFOQ, verificar documento, no inferir por acento |
| Opinión política | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar |
| Afiliaciones (sindical, etc.) | ALTO | Atributo protegido; LFT protege actividad sindical | NO_PUBLICABLE | No preguntar |
| Situación familiar | ALTO | Atributo protegido | NO_PUBLICABLE | No preguntar "con quién vives" |
| Domicilio innecesario | MEDIO | Privado; puede revelar origen/nivel | CONDICIONAL | No pedir; salvo verificación logística justificada |
| Apariencia física | ALTO | Puede revelar salud; discriminación | NO_PUBLICABLE | No comentar ni evaluar |
| Idioma materno (no BFOQ) | MEDIO | Puede revelar origen | CONDICIONAL | Solo si el puesto requiere idioma específico (BFOQ) |
| Antecedentes penales | MEDIO | Condicional; puede ser discriminatorio | CONDICIONAL (LEGAL_REVIEW) | Solo si el puesto lo justifica (e.g. finanzas, seguridad); revisión legal |
| Experiencia laboral (pasada) | BAJO | Pertinente a competencia | PUBLICABLE | Preguntar por ejemplos STAR |
| Formación / certificación | BAJO | Pertinente si es requisito del puesto | PUBLICABLE | Preguntar si relevante (e.g. NOM-251) |
| Disponibilidad de turno | MEDIO | Puede ser BFOQ si el turno es esencial | CONDICIONAL (BFOQ justificado) | Solo si el puesto requiere turno específico; justificación documentada |
| Referencias laborales | BAJO | Verificación pertinente | PUBLICABLE (con consentimiento) | Solicitar consentimiento para contactar |

## 3. Estados

| Estado | Significado |
|---|---|
| PUBLICABLE | Se puede preguntar en entrevista; pertinente a competencia/puesto |
| CONDICIONAL | Se puede preguntar solo si se cumple la condición (BFOQ, consentimiento, justificación) |
| NO_PUBLICABLE | No se puede preguntar; atributo protegido sin BFOQ |
| LEGAL_REVIEW | Requiere revisión legal profesional antes de decidir |

## 4. Regla de aplicación

- Una pregunta que cae en NO_PUBLICABLE no se incluye en la guía de entrevista.
- Si un entrevistador la improvisa, se marca como **violación de guía** (auditable; medidas disciplinarias).
- CONDICIONAL requiere documentación de la condición (BFOQ, consentimiento).
- LEGAL_REVIEW requiere dictamen legal antes de activar.

## 5. Conexión con gates

La matriz pasa LEGAL-G5 (No discriminación). Sin matriz documentada + prohibición aplicada, la entrevista no se activa.
