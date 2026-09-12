# A-06.6 — 11 · Legal (PASO 13)

## 1. Regla

Probar preguntas candidatas contra los filtros de A-06.4. Clasificar: PUBLICABLE / CONDITIONAL / LEGAL_REVIEW / NO_PUBLICABLE. No crear excepciones nuevas.

## 2. Verificación de las 10 preguntas candidatas contra A-06.4

| Pregunta | Atributo elicitado | Filtro A-06.4 `13-discrimination.md` | legalStatus | ¿Confirmado en piloto? |
|---|---|---|---|---|
| Q-MES-SVC-001 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ (M-A/B/C no elicitaron atributos; M-H revelación fue en Q-MES-TRV-002) |
| Q-MES-SVC-002 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-MES-COL-001 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-MES-ORG-001 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-MES-TRV-002 | Ninguno (pregunta) — revelación involuntaria en respuesta M-H | PUBLICABLE (la pregunta) | PUBLICABLE | ✓ SÍ — la pregunta no elicita; la revelación fue del candidato |
| Q-VEN-SVC-001 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-VEN-SVC-002 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-VEN-COL-001 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-VEN-ORG-001 | Ninguno | PUBLICABLE | PUBLICABLE | ✓ SÍ |
| Q-VEN-TRV-002 | Ninguno (pregunta) — revelación involuntaria en respuesta V-H | PUBLICABLE (la pregunta) | PUBLICABLE | ✓ SÍ |

## 3. Verificación de la revelación involuntaria (M-H, V-H)

| Caso | Revelación | Filtro aplicado | Resultado |
|---|---|---|---|
| M-H | Embarazo ("soy embarazada") | A-06.4 `04-prohibited-data.md` §5 (revelación voluntaria) | Revelación NO registrada como evidencia; NO usada para decisión; conducta SÍ registrada |
| V-H | Religión ("por mi fe no trabajo los domingos") | A-06.4 `04-prohibited-data.md` §5 | Revelación NO registrada; conducta SÍ registrada |

**Verificación**: el filtro de revelación involuntaria funcionó correctamente en ambos casos.

## 4. Verificación de probes contra A-06.4

| Probe | Atributo elicitado | legalStatus |
|---|---|---|
| PROBE-UNI-001..008 | Ninguno | PUBLICABLE |
| PROBE-SVC/COL/ORG/TRV específicos | Ninguno | PUBLICABLE |

**Verificación**: ningún probe del banco elicita atributos protegidos.

## 5. Verificación de preguntas prohibidas (NO presentes)

| Tipo prohibido | ¿Presente en el banco? |
|---|---|
| Edad / fecha de nacimiento | ✗ NO |
| Embarazo / maternidad | ✗ NO |
| Género | ✗ NO |
| Religión | ✗ NO |
| Estado civil | ✗ NO |
| Orientación sexual | ✗ NO |
| Discapacidad (salvo BFOQ) | ✗ NO |
| Salud (salvo BFOQ) | ✗ NO |
| Origen étnico | ✗ NO |
| Nacionalidad (no BFOQ) | ✗ NO |
| Opinión política | ✗ NO |
| Situación familiar | ✗ NO |

## 6. Situaciones LEGAL_REVIEW detectadas en el piloto

| Situación | Detalle | Estado |
|---|---|---|
| Ninguna pregunta candidata cayó en LEGAL_REVIEW | Las 10 preguntas son PUBLICABLE | ✓ |
| La revelación involuntaria (M-H, V-H) confirma la necesidad de la regla de no-registro | Ya documentada en A-06.4 | ✓ |

## 7. Conexión con gates

La verificación legal alimenta INTERVIEW-G6 (bias review — ya aprobado en análisis) e INTERVIEW-G7 (legal review — **sigue NO EVALUADO**: el piloto no lo aprueba; requiere asesoría legal profesional, A-06.4 `01-legal-framework.md`).
