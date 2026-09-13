# EVALUHR — A-02.2 · PASO 5
# EVIDENCIA VÁLIDA DE CONOCIMIENTO Y PROBLEMA DOCUMENTADO (correctAnswer)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **El problema se documenta; NO se corrige
> todavía.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Qué constituye evidencia VÁLIDA de conocimiento

Un registro de conocimiento (evidenceType B, categoría CONOCIMIENTOS) es
evidencia válida **solo si** cumple TODAS estas condiciones:

| # | Condición | Verificación |
|---|---|---|
| K1 | Los reactivos provienen de contenido definido y aprobado para el criterio (A-02.1 PASO 5: content + scope + source) | Referencia criterionId + criterionVersion |
| K2 | Existe una respuesta correcta **persistida y verificable** por reactivo (`correctAnswer`) | Inspección del registro de pregunta |
| K3 | La puntuación es objetiva: aciertos/total sobre reactivos con K2 | unit = `CORRECT_OVER_TOTAL` |
| K4 | Administración completa (todas las preguntas respondidas) | Sin `PARTIAL_RESPONSE` |
| K5 | Sin anomalías técnicas (fallas, doble envío, sesiones corruptas) | Audit trail |
| K6 | El instrumento tiene identidad y versión registradas | instrumentVersion presente |

Condiciones K1–K6 → calidad `HIGH` (si K1 completo) o `MEDIUM` (si los
reactivos cumplen K2–K6 pero aún no derivan de criterio aprobado — caso de
posiciones sembradas). **Sin K2, no hay evidencia válida de conocimiento:
punto.**

---

## 2. Problema existente DOCUMENTADO (sin corregir en A-02.2)

### 2.1 Hallazgo (verificado por inspección de solo lectura, 2026-09-09)

La función `generateTemplatesForPosition` (`src/lib/generate-templates.ts`,
línea 181) **no persiste `correctAnswer` correctamente en las preguntas de
conocimientos generadas**:

- El banco en memoria `KNOWLEDGE_QUESTIONS_BY_CATEGORY` (línea 53) **sí
  declara** `correctAnswer` para sus preguntas (p. ej., líneas 55–64), pero
  la llamada de creación `db.question.create` (líneas 300–309) **omite** el
  campo: persiste solo `text`, `options`, `category`, `order`,
  `evaluationTemplateId`.
- El banco genérico de respaldo (líneas 314–333, para categorías sin banco
  propio) **ni siquiera declara** `correctAnswer`, y además consiste en
  preguntas de estilo auto-reporte ("¿Conoce…? Sí/Parcialmente/No"), no
  pruebas objetivas.

### 2.2 Consecuencia

Para puestos creados mediante el generador, el scoring no puede identificar
respuestas correctas → **`knowledgeScore = 0` para cualquier candidato**,
independientemente de sus respuestas.

### 2.3 Decisión de A-02.2

- **NO se corrige todavía** (corrección de código fuera del alcance; requiere
  autorización expresa y control de versiones).
- El hallazgo queda documentado aquí y reflejado en la matriz de calidad
  (`evidence-quality-matrix.csv`, fila CONOCIMIENTO) y en
  `insufficient-evidence-rules.md` (regla R-KN-1).

---

## 3. Pregunta del encargo y respuesta formal

> **¿Puede una evaluación con `knowledgeScore=0` por falta de
> `correctAnswer` considerarse evidencia válida?**

## ✅ Respuesta: **NO.**

Razonamiento:

1. Un `knowledgeScore=0` en esas condiciones es un **artefacto del proceso de
   generación**, no una medida del candidato: la puntuación es idéntica (0)
   tanto si la persona sabe todo como si nada.
2. Evidencia válida exige separar "el candidato no supo" de "el instrumento
   no puede puntuar". Aquí ocurre lo segundo.
3. Convertir ese 0 en lectura del criterio sería **atribuir a la persona un
   dato que no la describe** — riesgo de injusticia y de decisión errónea.
4. Por tanto, el registro se marca:

```
quality      = INSUFFICIENT
reasonCode   = QUALITY_FAIL
value/unit   = conforme a lo capturado (el 0 se conserva como dato crudo
               del sistema, pero NO como lectura del criterio)
reviewRequired = true
salida       = "Información insuficiente para evaluar este criterio."
```

**Regla K-INS-1 (mandatoria)**: todo EvidenceRecord de conocimiento cuyo
`knowledgeScore=0` tenga como causa documentada la falta de `correctAnswer`
persistido se marca `INSUFFICIENT`. Prohibido tratarlo como cero de
conocimiento, como bajo puntaje o como datos utilizables.

---

## 4. Alcance del problema (precisión, para no sobre-generalizar)

- Afecta a **puestos generados** con `hasKnowledgeTest=true` vía
  `generateTemplatesForPosition` (nuevos puestos creados por empresas).
- **No afecta** necesariamente a registros históricos o posiciones sembradas
  cuyo pipeline de persistencia incluyó `correctAnswer` (verificado por
  separado); esas evidencias, si completas, son `MEDIUM` (no HIGH, porque sus
  reactivos aún no derivan de criterios aprobados A-02.1).
- La distinción exacta por registro se determinará al implementar la lectura
  de calidad (fase futura); este documento fija las reglas, no la migración.

---

## 5. Camino a la validez (futuro, fuera de A-02.2)

Para que la evidencia de conocimiento vuelva a ser evaluable:

1. Corrección autorizada de la persistencia de `correctAnswer` (con
   versionado del generador).
2. Derivación de reactivos desde contenidos de criterios aprobados (A-02.1
   PASO 5).
3. Revisión humana del contenido antes de activar la prueba.
4. Regla de calidad actualizada en la matriz (fila CONOCIMIENTO → MEDIUM/HIGH
   cuando K1–K6 se cumplan).

Mientras 1–4 no ocurran: **toda evidencia de conocimiento de puestos
generados = INSUFFICIENT.**
