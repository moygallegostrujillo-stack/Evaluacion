# EVALUHR — A-02.2 · PASO 3
# CALIDAD DE LA EVIDENCIA (HIGH · MEDIUM · LOW · INSUFFICIENT)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Qué es (y qué no es) la "calidad" de la evidencia

> La **calidad** de un EvidenceRecord es una evaluación **objetiva y
> determinista** de la solidez del registro y de su método de obtención para
> soportar una lectura del criterio correspondiente.

**Advertencias estructurales:**

1. **La calidad NO es validez predictiva**: `HIGH` significa "registro sólido
   para su constructo", nunca "predice desempeño laboral".
2. **La calidad NO se atribuye a la persona**: describe el registro/método.
3. **NO se inventa evidencia científica inexistente**: si un instrumento no
   tiene base documentada, su evidencia no sube de nivel por voluntad
   comercial o de diseño.
4. **NO se asume validez por el mero hecho de existir**: un instrumento
   activo en el sistema sin expediente ni base documentada produce evidencia
   de calidad limitada (`LOW`) o `INSUFFICIENT`, según lo que se quiera
   inferir.
5. La asignación de calidad es **determinista por reglas** (este documento +
   PASO 14); ninguna IA ni persona "califica a ojo" un registro.

---

## 2. Niveles

### HIGH — Registro sólido para su constructo
Requisitos objetivos (todos):

1. Identidad del instrumento/método **y** versión registradas.
2. **Base documentada del método** para el constructo que mide: instrumento
   con fuente/expediente verificable (p. ej., IPIP-50-MX: fuente oficial IPIP
   + adaptación mexicana publicada — expediente A-01.3). *Nota honesta: para
   la implementación EvaluHR no existe estudio propio; HIGH no declara
   validación de la implementación (ver §4).*
3. Captura **completa** según el diseño del instrumento (sin secciones
   faltantes).
4. Sin anomalías técnicas (fallas, duplicados, sesiones corruptas).
5. Trazabilidad completa (audit trail PASO 13).

### MEDIUM — Registro utilizable con reservas moderadas
Requisitos objetivos:

1. Identidad y versión registradas (igual que HIGH).
2. Captura completa y sin anomalías técnicas.
3. Base documentada del método **parcial** (p. ej., prueba de conocimientos
   con `correctAnswer` persistido y verificable pero cuyos reactivos aún no
   derivan de un criterio aprobado — caso de posiciones sembradas).
4. Requiere revisión humana según matriz (PASO 14).

### LOW — Registro con limitaciones significativas
Cualquiera de estas condiciones **degrada a LOW** (aunque la captura sea
completa):

1. Instrumento/método **sin versión identificable**.
2. Método **sin base documentada** (legacy sin expediente: psicológica
   legacy 10 ítems; verificación documental sin registro del revisor).
3. Datos **declarados sin verificar** (experiencia, formación — PASO 8).
4. Constructo medido con **muy pocos indicadores** (p. ej., 2 ítems por
   categoría del legacy).
5. Evidencia humana de entrevista **sin estructura** por criterio.

LOW es utilizable **solo** como contexto orientativo con revisión humana;
jamás como base única de lectura del criterio.

### INSUFFICIENT — El registro no soporta lectura alguna del criterio
Cualquiera de estas condiciones → `INSUFFICIENT`:

1. Instrumento/método **no administrado** o **no existente** para el criterio
   (`reasonCode=NOT_ADMINISTERED` / `NO_METHOD`).
2. Administración **incompleta** (`PARTIAL_RESPONSE`) o falla técnica
   (`TECH_FAILURE`).
3. **Regla de calidad del método**: el método existe pero carece del elemento
   que lo hace interpretable para el criterio (`QUALITY_FAIL`) — casos
   mandatorios de A-02.2:
   - **Conocimiento**: `correctAnswer` no persistido → `knowledgeScore=0`
     artifact → evidencia **NO válida** (PASO 5).
   - **Integridad**: instrumento sin expediente suficiente → `INSUFFICIENT`
     hasta que exista (PASO 7).
   - **Competencias**: sin método conductual aprobado → `INSUFFICIENT`
     (PASO 6).
4. Registro `INVALIDATED` por gobernanza.
5. Conflicto sin resolver? → NO: el conflicto no destruye la evidencia; los
   registros conservan su calidad y se marcan en conflicto con revisión
   humana obligatoria (PASO 10).

---

## 3. Tabla de decisión rápida

| Situación | Calidad |
|---|---|
| IPIP-50-MX completo, versión registrada, sin fallas | HIGH (como evidencia de **rasgos**; ver §4) |
| Conocimiento (sembrado) con `correctAnswer` persistido y completo | MEDIUM (mientras los reactivos no deriven de criterio aprobado) |
| Conocimiento (generado) sin `correctAnswer` → `knowledgeScore=0` | **INSUFFICIENT** (`QUALITY_FAIL`) |
| Competencia con método conductual | (futuro) MEDIUM–HIGH; hoy: INSUFFICIENT (`NO_METHOD`) |
| Experiencia declarada sin verificar | LOW (`reviewRequired=true`) |
| Experiencia/formación verificada documentalmente con revisor | MEDIUM–HIGH según método |
| Entrevista estructurada con registro | MEDIUM (máximo) |
| Entrevista sin estructura/registro | LOW / INSUFFICIENT |
| Psicológica legacy (10 ítems, deprecada) | LOW (máximo; sin expediente) |
| Integridad legacy (10 ítems, sin expediente) | **INSUFFICIENT** (regla PASO 7) |
| Instrumento no administrado / sección sin contestar / falla técnica | INSUFFICIENT (con `reasonCode`) |

---

## 4. Declaración honesta sobre el IPIP (sin inventar evidencia)

El IPIP-50-MX puede alcanzar **HIGH como evidencia de tendencias de rasgo**
(captura completa + identidad/versionado + clave oficial + fuente pública y
adaptación mexicana publicada). Ese `HIGH`:

- **SÍ significa**: registro sólido de tendencias de respuesta auto-reportadas.
- **NO significa**: validez de la implementación EvaluHR (sin estudio propio),
  ni validez para selección laboral (sin evidencia), ni aptitud, ni
  predicción de desempeño. Heredado de A-01.3/A-02.1 sin relajación.

---

## 5. Reglas transversales

1. La calidad se asigna **al capturar** y puede **degradar** por reglas
   posteriores (invalidación, detección de anomalía); nunca sube sin un
   registro de gobernanza que lo justifique (PASO 16).
2. `reviewRequired` y calidad están desacoplados pero relacionados: LOW e
   INSUFFICIENT exigen revisión; la matriz PASO 14 fija el resto.
3. La ausencia de evidencia no es `LOW` ni `0`: es `INSUFFICIENT` con su
   `reasonCode` (PASO 11).
4. Toda degradación/asignación queda en el audit trail (PASO 13).
