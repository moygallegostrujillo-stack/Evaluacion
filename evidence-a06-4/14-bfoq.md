# A-06.4 — 14 · BFOQ / Bona Fide Occupational Qualification (PASO 14)

## 1. Regla

> BFOQ es **excepcional**, **restrictivo**, y **caso por caso**. No se convierte en regla general. El sistema NO la interpreta automáticamente.

## 2. Definición

BFOQ (Bona Fide Occupational Qualification) es una característica personal que, en circunstancias excepcionales, puede ser jurídicamente relevante para la naturaleza específica del trabajo.

En México, el equivalente conceptual se encuentra en:
- LFT Art 3: permite distinciones basadas en "la capacidad física o mental para el trabajo" (interpretación prudente).
- LFPEPD: permite acciones afirmativas y distinciones basadas en requisitos esenciales del puesto.
- LFPDPPP: el tratamiento de datos sensibles requiere base jurídica específica.

## 3. Cuándo puede aplicar BFOQ (ejemplos hipotéticos)

| Atributo | Excepción posible (hipotética) | Requisito |
|---|---|---|
| Género | Puesto en refugio de mujeres (atención a mujeres víctimas) donde la presencia de un hombre puede ser perjudicial | Justificación documentada + revisión legal + no automatizable |
| Edad | Puesto con restricción legal de edad mínima (LFT Art 22: 15 años; LFT Art 22 Bis: 18 años para trabajo nocturno peligroso) | Verificar requisito legal; recoger solo verificación, no más |
| Nacionalidad | Puesto que requiere autorización de trabajo específica (e.g. seguridad nacional) | Verificar documento; no inferir por acento o apariencia |
| Discapacidad | Puesto diseñado específicamente para personas con discapacidad (acción afirmativa) | Acción afirmativa LFPEPD; documentada |
| Salud | Puesto con riesgo específico (e.g. manipulación de alimentos NOM-251 requiere carta de salud) | Requisito legal; recoger como documento, no en entrevista |
| Idioma | Puesto que requiere idioma específico (e.g. atención a turistas) | Verificar capacidad; no inferir por origen |

## 4. Cuándo NO aplica BFOQ

- **Cualquier atributo protegido sin justificación específica del puesto**.
- **Inferencia por estereotipo** (e.g. "las mujeres son mejores para atención al cliente" → discriminatorio).
- **Preferencia del cliente** (e.g. "el cliente prefiere hombres" → no es BFOQ).
- **Conveniencia operativa** (e.g. "es más fácil contratar solteros porque no piden permiso" → discriminatorio).
- **Automatización** (el sistema NO decide BFOQ; requiere revisión legal).

## 5. Requisitos para invocar BFOQ

1. **Justificación específica del puesto**: el atributo es esencial para desempeñar las funciones centrales del trabajo.
2. **Documentación**: análisis de puesto que demuestre la necesidad.
3. **Revisión legal**: un abogado especializado valida que la distinción no es discriminatoria.
4. **No automatizable**: el sistema NO interpreta BFOQ; es una decisión humana + legal.
5. **Caso por caso**: no se aplica como regla general; cada puesto se evalúa individualmente.
6. **Mínimo necesario**: solo el dato necesario para verificar el BFOQ (e.g. verificar autorización de trabajo, no recoger nacionalidad si no es necesaria).

## 6. Prohibición de automatización

> El sistema **NO** interpreta BFOQ automáticamente.

- No hay campo `bfoq: true` en el sistema que habilite preguntas prohibidas.
- El BFOQ se documenta en el análisis de puesto (JobElement + rationale) y se aprueba por humano + legal.
- La guía de entrevista puede contener una pregunta BFOQ solo si está marcada como `bfoq_justified: true` con `legalReviewId` asociado.

## 7. Ejemplo de flujo BFOQ (hipotético, no productivo)

> **Puesto**: Atención en refugio de mujeres.
> **Atributo**: Género (femenino).
> **Justificación**: la presencia de un hombre puede revictimizar a las usuarias del refugio.
> **Documentación**: análisis de puesto + psicología del refugio.
> **Revisión legal**: abogado valida que es BFOQ legítimo.
> **Implementación**: la vacante se publica indicando requisito; la entrevista NO pregunta "¿eres mujer?"; en su lugar, verifica el documento de identidad al momento de la contratación (no en entrevista de competencias).

**Regla**: incluso con BFOQ, la verificación del atributo se hace por documento, no por pregunta de entrevista.

## 8. REQUIERE REVISIÓN LEGAL

Todo caso de BFOQ **REQUIERE REVISIÓN LEGAL** profesional. A-06.4 es análisis conceptual; no aprueba BFOQ específicos.

## 9. Conexión con gates

El BFOQ pasa LEGAL-G4 (datos sensibles) + LEGAL-G5 (no discriminación) + LEGAL-G7 (revisión legal). Sin revisión legal profesional, ningún BFOQ se activa.
