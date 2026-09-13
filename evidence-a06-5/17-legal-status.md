# A-06.5 — 17 · Estado Legal (PASO 24)

## 1. Regla

> Cada pregunta debe quedar clasificada contra A-06.4: `LEGAL_STATUS`.

Ninguna pregunta CONDICIONAL o LEGAL_REVIEW puede entrar posteriormente al banco ACTIVE sin completar revisión.

## 2. Estados LEGAL_STATUS (de A-06.4 `13-discrimination.md`)

| Estado | Significado | Acción |
|---|---|---|
| PUBLICABLE | La pregunta no introduce atributos protegidos; pertinente al puesto | Puede pasar a REVIEW (tras validación BDI + proporcionalidad) |
| CONDITIONAL | La pregunta es pertinente pero requiere condición (e.g. BFOQ documentado) | Requiere documentación de la condición antes de REVIEW |
| LEGAL_REVIEW | Duda sobre discriminación o BFOQ | REQUIERE REVISIÓN LEGAL antes de decidir |
| NO_PUBLICABLE | La pregunta introduce atributos protegidos sin BFOQ | No se incluye en la guía; se elimina del banco |

## 3. Clasificación por pregunta candidata

Cada pregunta del banco candidato (A-06.5 `21-bank-candidate.md`) tiene un campo `legalStatus`. La clasificación se hace contra A-06.4:

| Pregunta candidata | Atributo elicitado (si alguno) | legalStatus |
|---|---|---|
| BDI past behavior (STAR) sobre servicio al cliente | Ninguno | PUBLICABLE |
| BDI past behavior sobre manejo de quejas | Ninguno | PUBLICABLE |
| BDI past behavior sobre trabajo en equipo | Ninguno | PUBLICABLE |
| BDI past behavior sobre organización del trabajo | Ninguno | PUBLICABLE |
| "¿Tienes planes de formar familia?" | Embarazo/estado civil | NO_PUBLICABLE |
| "¿Cuántos años tienes?" | Edad | NO_PUBLICABLE |
| "¿Estás casado/a?" | Estado civil | NO_PUBLICABLE |
| "¿Qué religión practicas?" | Religión | NO_PUBLICABLE |
| "¿Tienes alguna discapacidad?" (salvo BFOQ) | Discapacidad | NO_PUBLICABLE (LEGAL_REVIEW si BFOQ) |
| "¿Estás disponible para turno nocturno?" (si BFOQ) | — | CONDITIONAL (BFOQ documentado) |
| "¿Por qué dejaste tu último empleo?" | Posible despido protegido | LEGAL_REVIEW |

## 4. Regla de no activación

> Ninguna pregunta CONDICIONAL o LEGAL_REVIEW puede entrar al banco ACTIVE sin completar revisión.

- CONDICIONAL: requiere documentación de la condición (BFOQ, consentimiento) + revisión legal.
- LEGAL_REVIEW: requiere dictamen legal profesional antes de decidir.
- Solo PUBLICABLE (tras pasar proporcionalidad + bias + calidad) puede llegar a ACTIVE.

## 5. Auditoría legal por pregunta

Antes de APPROVED, cada pregunta debe:
1. Tener `legalStatus` asignado (por reviewer humano).
2. Si CONDICIONAL: documentar la condición + revisión legal.
3. Si LEGAL_REVIEW: obtener dictamen legal.
4. Si NO_PUBLICABLE: eliminar del banco.
5. Si PUBLICABLE: proceder a validación BDI + proporcionalidad + bias.

## 6. Conexión con gates

El estado legal pasa INTERVIEW-G7 (legal review) + LEGAL-G5 (no discriminación) + LEGAL-G4 (datos sensibles) de A-06.4. Sin `legalStatus` asignado + revisión legal (si aplica), la pregunta no pasa a ACTIVE.
