# EVALUHR — A-02.3 · PASO 5
# SALIDA DE INSTRUMENTOS DE CONOCIMIENTOS — ESCENARIOS A–E

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.2 PASO 5 (K1–K6, K-INS-1, problema correctAnswer documentado y NO
> corregido) y PASO 11 (missing data: INSUFFICIENT ≠ 0).

---

## 1. Regla general del PASO

> **Si no existe scoring válido: `status = INSUFFICIENT` — NO = 0.**

El estado se expresa con el mensaje oficial **"Información insuficiente para
evaluar este criterio."** + causa comprensible; el dato crudo disponible se
conserva; el 0 artefactual **no se muestra jamás como resultado**.

---

## 2. Los cinco escenarios del encargo

### Escenario A — El instrumento tiene `correctAnswer` válida
- Condición: reactivos derivados del contenido aprobado del criterio;
  `correctAnswer` persistida y verificable; puntuación objetiva; administración
  completa; sin anomalías; versión registrada (K1–K6, herencia A-02.2).
- Salida: resultado **CORRECT_OVER_TOTAL** ("aciertos X/Y sobre el contenido
  definido del criterio"), con revisión humana obligatoria del contenido y del
  resultado (matriz A-02.2 PASO 14, tipo B).
- Estados posibles: VALID (lectura descriptiva de dominio declarativo, PASO 3
  §3.1) — jamás inferencia de ejecución/desempeño.

### Escenario B — El instrumento NO tiene `correctAnswer`
- Caso vigente documentado: puestos generados (`generateTemplatesForPosition`
  no persiste `correctAnswer` → `knowledgeScore=0` artefactual; verificado en
  A-02.2 con precisión de líneas; **NO se corrigió**, fuera de alcance).
- Regla **K-INS-1** (heredada y vigente): ese registro **no es evidencia
  válida** → `status=INSUFFICIENT`, `quality=INSUFFICIENT`,
  `reasonCode=QUALITY_FAIL`.
- **Prohibido**: mostrar "0" o "0/10" como resultado; decir "el candidato
  respondió todo mal"; usar el 0 en cálculos (incluido cualquier agregado
  futuro). El 0 aquí es un artefacto de captura, no una medición.

### Escenario C — Administración parcialmente respondida
- Salida: `status=INSUFFICIENT`, `reasonCode=PARTIAL_RESPONSE`, por constructo
  (la sección incompleta queda sin lectura).
- **Prohibido**: prorratear, imputar, "puntuar con lo respondido", estimar
  desde lo contestado. Los ítems respondidos se conservan como dato crudo;
  no producen score válido.
- Distinción explícita (herencia A-02.2 PASO 11 §4): ítem respondido
  explícitamente (aun con respuesta incorrecta) ≠ ítem sin respuesta. El
  primero participa del scoring cuando exista scoring válido; el segundo no.

### Escenario D — Contiene preguntas no validadas
- Definición de "no validada": reactivos no derivados del contenido aprobado
  del criterio, sin `correctAnswer` verificable, sin registro de origen/
  versión, o generados sin el control de calidad requerido (K1/K2 fallidas).
- Regla: **la puntuación del instrumento no puede reconstruirse de forma
  válida si parte del set puntuado carece de validación** — no se "rescatan"
  solo las preguntas buenas.
- Salida: `status=INSUFFICIENT`, `reasonCode=QUALITY_FAIL`; el criterio queda
  sin lectura hasta prueba válida. Prohibido un score parcial "de las
  preguntas válidas" (sería una norma inventada).

### Escenario E — La puntuación no puede reconstruirse
- Causas: falla técnica, sesión corrupta, doble envío, pérdida de
  persistencia, imposibilidad de reproducir el cálculo con la versión
  registrada del scoring.
- Salida: `status=INSUFFICIENT`, `reasonCode=TECH_FAILURE`; el incidente
  queda en el audit trail (A-02.2 PASO 13); se ofrece re-administración como
  proceso (decisión humana), nunca como "recuperación automática" silenciosa.
- Prohibido: reciclar respuestas parciales como válidas; culpar a la persona.

---

## 3. Tabla resumen

| Escenario | status | reasonCode | ¿Se muestra score? | Lectura del criterio |
|---|---|---|---|---|
| A — correctAnswer válida, K1–K6 OK | VALID (con revisión) | — | Sí: X/Y aciertos | Descriptiva (dominio declarativo) |
| B — sin correctAnswer | INSUFFICIENT | QUALITY_FAIL (K-INS-1) | **Nunca** (el 0 es artefacto) | No |
| C — parcialmente respondido | INSUFFICIENT | PARTIAL_RESPONSE | No (sin prorrateo) | No (por constructo afectado) |
| D — preguntas no validadas | INSUFFICIENT | QUALITY_FAIL | No (ni siquiera parcial) | No |
| E — score no reconstruible | INSUFFICIENT | TECH_FAILURE | No | No |

En todos los escenarios B–E la salida es **"Información insuficiente para
evaluar este criterio."** + causa; visible para RH como área de
revisión/completación (PASO 11); recuperable por las vías legítimas
(corregir correctAnswer con autorización, re-administrar, validar reactivos).
