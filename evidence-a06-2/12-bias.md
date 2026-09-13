# A-06.2 — 12 · Sesgo y Discriminación (PASO 18)

## 1. Regla

Auditar indicadores que puedan introducir atributos protegidos o irrelevantes al puesto. **No crear indicadores basados en atributos protegidos.** Si existe duda: **REQUIERE REVISIÓN LEGAL**.

## 2. Atributos protegidos (México)

En el contexto mexicano (LFPDPPP, Ley Federal del Trabajo, NOM-035), los atributos protegidos incluyen:
- Edad
- Género
- Religión
- Estado civil
- Embarazo
- Discapacidad
- Origen étnico/nacional
- Preferencia sexual
- Opiniones políticas
- Condiciones sociales o económicas
- Condiciones de salud no relevantes al puesto

## 3. Indicadores prohibidos

| Tipo | Ejemplo prohibido | Por qué |
|---|---|---|
| Edad | "Demuestra energía juvenil" | Edad es atributo protegido; "energía" no es conducta observable |
| Género | "Tiene aparicencia apropiada para atención al cliente femenina/masculina" | Género es atributo protegido; irrelevante para la competencia |
| Estado civil | "Tiene estabilidad familiar" | Estado civil es atributo protegido; irrelevante para la competencia |
| Embarazo | "No tiene planes de embarazo próximo" | Embarazo es atributo protegido; discriminatorio |
| Discapacidad | "No tiene discapacidad" | Discapacidad es atributo protegido; unless esencial para el puesto (BFOQ) |
| Origen | "Habla sin acento regional" | Origen es atributo protegido; el acento no es conducta |
| Religión | "Participa en actividades de la empresa compatibles con [religión]" | Religión es atributo protegido |

## 4. Regla CI-VAL-6 (no discriminatorio)

Todo indicador debe pasar CI-VAL-6 (ver `05-indicator-validation.md`):

> El indicador no introduce atributos protegidos (edad, género, religión, estado civil, discapacidad, origen) ni preguntas irrelevantes al puesto.

Si un indicador falla CI-VAL-6 → **NO_PUBLICABLE** + **REQUIERE REVISIÓN LEGAL**.

## 5. Indicadores neutros (correctos)

Un indicador correcto describe conducta observable sin referencia a atributos protegidos:

| Incorrecto | Correcto |
|---|---|
| "Es joven y enérgico" | "Mantiene el ritmo de trabajo durante turnos largos" |
| "Tiene buen aspecto" | "Mantiene una presentación personal acorde al estándar del puesto" |
| "No tiene familia que le impida viajar" | "Disponible para rotación de turnos según requerimiento del puesto" (si el turno es esencial y justificado) |
| "Habla sin acento" | "Se comunica de forma comprensible con el cliente" |

## 6. BFOQ (Bona Fide Occupational Qualification)

En casos raros, un atributo puede ser esencial para el puesto (BFOQ). En México, esto es muy restrictivo y requiere:
- Justificación documentada de esencialidad.
- Revisión legal.
- No extensible a decisiones generales.

**Ejemplo (hipotético, no producto)**: un puesto en un refugio de mujeres donde el ocupante debe ser mujer puede ser BFOQ. Esto requiere revisión legal caso por caso; NO se asume en V1.

## 7. Preguntas de entrevista discriminatorias

La guía de entrevista (PASO 7 de A-06.1) solo contiene preguntas conductuales sobre competencias. Preguntas sobre:
- Edad / fecha de nacimiento
- Estado civil / planes de familia
- Religión
- Embarazo
- Discapacidad (salvo BFOQ estricto)
- Origen / acento

**están prohibidas**. La guía pre-aprobada evita estas preguntas; el entrevistador no debe desviarse de la guía.

## 8. Mitigación de sesgo del entrevistador

Además de los indicadores, el sesgo puede venir del entrevistador:
- **Halo effect**: una impresión global positiva infla todas las competencias.
- **Similaridad**: preferencia por candidatos parecidos al entrevistador.
- **Estereotipo**: atribución de competencias según género/edad/origen percibido.

**Mitigaciones**:
- Guía estructurada (mismas preguntas a todos).
- Rúbrica por indicador (evaluación separada por indicador, no global).
- Entrenamiento de entrevistadores (COMP-G9 pilot).
- Doble codificación en pilotaje (medir consistencia inter-entrevistador).
- Revisión legal de la guía (COMP-G8).

## 9. Conexión con gates

- CI-VAL-6 (no discriminatorio) pasa COMP-G3 (indicators).
- Revisión legal de la guía pasa COMP-G8 (legal review).

Sin estos gates, el modelo no se activa en V1.
