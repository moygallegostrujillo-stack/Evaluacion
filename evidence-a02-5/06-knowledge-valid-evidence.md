# EVALUHR — A-02.5 · PASO 6
# CONOCIMIENTOS: REQUISITOS PARA EVIDENCIA VALID

> Documento de diseño metodológico. **NO corrige código** — el problema
> `correctAnswer` permanece documentado y sin tocar. NO define umbrales.
> Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 5 (criterios de conocimientos); A-02.2 PASO 5 (evidencia
> de conocimientos); A-02.3 PASO 5 (salida de conocimientos, escenarios A–E,
> K-INS-1).

---

## 1. Pregunta del encargo

> ¿Cuándo una prueba de conocimientos puede producir **VALID evidence**?

Respuesta corta: cuando satisface el checklist completo K-VAL-1..8 (§2) y la
administración individual cae en el escenario A de A-02.3 (correctAnswer
válida, K1–K6). Sin la cadena K-VAL, la salida de la prueba **no es
evidencia VALID** para ningún criterio.

---

## 2. Checklist K-VAL (requisitos mínimos)

| # | Requisito | Definición | Estado actual (documental) |
|---|---|---|---|
| K-VAL-1 | **Blueprint** | Mapa de contenidos del examen, derivado del análisis de puesto: qué contenidos se evalúan y con qué cobertura | No existe formalmente; la generación de preguntas de hoy no produce blueprint auditable |
| K-VAL-2 | **Relación con funciones del puesto** | Cada bloque del blueprint cita el elemento del puesto que lo justifica (trazabilidad S1–S5, PASO 1) | Ausente hoy |
| K-VAL-3 | **Preguntas vinculadas** | Cada reactivo referencia el bloque del blueprint que cubre; prohibidos reactivos "de relleno" | Ausente hoy |
| K-VAL-4 | **Clave correcta (correctAnswer) validada** | Clave definida, revisada por persona con conocimiento del contenido, versionada | **Brecha documentada**: no persiste `correctAnswer` en puestos generados (hallazgo A-01.2); NO se corrige en A-02.5 |
| K-VAL-5 | **Scoring reproducible** | Regla de calificación determinista y versionada (aciertos sobre universo definido) | Scoring existe para puestos con clave; reproducibilidad depende de K-VAL-4 |
| K-VAL-6 | **Control de versión** | Instrumento (preguntas+clave+blueprint) con versión única; cambios → nueva versión, históricos conservados | Parcial (preguntas tienen versión; blueprint/clave no) |
| K-VAL-7 | **Revisión** | Revisión humana del instrumento antes de publicarse (contenido, redacción, sesgos evidentes) y de la administración cuando corresponde | Revisión de administración definida en A-02.2/A-02.3; revisión de instrumento no existe |
| K-VAL-8 | **Suficiencia para la lectura** | La administración individual cumple los escenarios K1–K6 (respuesta completa, sin invalidación, score reconstruible) | Definido en A-02.3 PASO 5 |

Reglas:

1. K-VAL es **todo-o-nada**: faltar un requisito impide declarar el
   instrumento apto para evidencia VALID; no hay VALID "parcial".
2. K-VAL aplica **por instrumento-version** (no por candidato).
3. Con K-VAL completo, la evidencia por persona sigue sujeta a los escenarios
   A–E de A-02.3 (una prueba VALID puede producir INSUFFICIENT para una
   persona con respuesta parcial — y eso no es 0).

---

## 3. El problema `correctAnswer` — estado documental

- **Hallazgo** (A-01.2, heredado): el generador de plantillas no persiste
  `correctAnswer` en preguntas de conocimientos para puestos nuevos →
  `knowledgeScore = 0` en esos casos.
- **Regla metodológica vigente** (A-02.3 PASO 5, escenario B): sin
  correctAnswer válido → status = **INSUFFICIENT** (reasonCode
  K-INS-1/QUALITY_FAIL); **el 0 artefactual jamás se muestra** (regla de
  oro INSUFFICIENT ≠ 0).
- **Decisión de esta fase**: NO corregir el código (fuera de alcance del
  encargo A-02.5). El problema permanece **documentado y abierto**, y
  bloquea la ruta a VALID hasta su corrección autorizada + K-VAL-1..7.
- Consecuencia para A-02.5: **hoy no existe ninguna prueba de conocimientos
  apta para producir evidencia VALID**; toda relación
  conocimientos→criterio queda LIMITED como máximo (PASO 4 §3, PASO 11).

---

## 4. Ruta hacia VALID (resumen condicional, sin implementar)

```
Análisis de puesto (PASO 1)
   → Blueprint con trazabilidad (K-VAL-1/2)
      → Reactivos vinculados al blueprint (K-VAL-3)
         → Clave correcta persistida y validada (K-VAL-4)  ← incluye corrección
            de código FUERA de A-02.5, sujeta a autorización
               → Scoring reproducible versionado (K-VAL-5/6)
                  → Revisión humana del instrumento (K-VAL-7)
                     → Publicación (PASO 18) → administraciones → escenarios
                        A–E por persona (K-VAL-8, A-02.3 PASO 5)
```

Cada flecha exige gobernanza (PASO 15) y versión. El instrumento resultante
podría entonces sostener fuerza de relación MODERATE (content validity
documentada; PASO 11 §3) para los criterios A que cubre.

---

## 5. Prohibiciones específicas

1. ❌ Mostrar el 0 artefactual como resultado (regla de oro; A-02.3).
2. ❌ Puntuar "con lo respondido" o prorratear parciales (escenarios C/D).
3. ❌ Declarar VALID un examen de conocimientos sin K-VAL completo.
4. ❌ Sustituir la clave correcta por "opinión de experto en caliente"
   durante la calificación (la clave se valida antes, con registro).
5. ❌ Usar el resultado de conocimientos como medida de capacidad general,
   inteligencia o competencia (categoría B).
