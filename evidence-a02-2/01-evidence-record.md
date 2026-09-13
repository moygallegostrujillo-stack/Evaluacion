# EVALUHR — A-02.2 · PASO 1
# DEFINICIÓN FORMAL DE EVIDENCIA (EvidenceRecord)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.2.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 (taxonomía de criterios, matriz instrumento↔criterio, lenguaje de
> salidas, revisión humana) y A-01.3 (gobernanza y versionado del instrumento).

---

## 1. Regla fundamental de la fase

> **PRIMERO definir qué es evidencia.**
> **DESPUÉS definir cómo se interpreta.**
> **SOLO en una fase posterior se podrá diseñar una fórmula** (de "Nivel de
> ajuste respecto de los criterios definidos para el puesto").

A-02.2 define únicamente el **modelo formal de "Evidencia de Evaluación"**.
No crea fórmulas, pesos, puntos de corte, percentiles, APTO/NO APTO,
contratación ni rechazo automático.

---

## 2. Definición de "Evidencia de Evaluación"

> Una **Evidencia de Evaluación** es un **registro estructurado, trazable y
> versionado** del resultado de aplicar un método de obtención (instrumento,
> entrevista, verificación documental o declaración) a un **criterio
> previamente definido y aprobado** para un puesto (A-02.1), que declara su
> **calidad** y su **estado de revisión**, y que puede ser reconstruido
> auditablemente.

Propiedades obligatorias de toda evidencia:

1. **Anclada a un criterio**: no existe "evidencia en el vacío"; el registro
   referencia un `criterionId` aprobado (o declara explícitamente su
   imposibilidad — tipo H, PASO 2).
2. **Con origen identificado**: quién/qué la generó, con qué instrumento y
   con qué versión.
3. **Con valor crudo, no pre-interpretado**: el registro guarda el resultado
   tal como se capturó; la interpretación es una capa posterior documentada.
4. **Con calidad declarada** según criterios objetivos (PASO 3) — la calidad
   es del registro y del método, **no** un dictamen sobre la persona.
5. **Con revisión explícita** cuando corresponde.
6. **Append-only**: los registros nunca se sobrescriben; la corrección es un
   registro nuevo que invalida al anterior (PASO 13).

---

## 3. EvidenceRecord — campos (mínimo obligatorio del encargo)

| Campo | Tipo | Descripción y reglas |
|---|---|---|
| `evidenceId` | ID | Identificador único y **no reutilizable**. Formato propuesto: `EVD-<criterionId>-<NNN>` (NNN secuencial por criterio y persona evaluada). Toda referencia posterior (interpretación, conflicto, auditoría) usa este ID. |
| `criterionId` | FK | Criterio aprobado (A-02.1) al que ancla la evidencia. **Regla**: solo acepta criterios en estado `APROBADO` (o `SUSPENDIDO` para lectura histórica). Excepción documentada: resultados de instrumento sin criterio asociado (p. ej., IPIP administrado sin criterios D aprobados) se almacenan como **resultado de instrumento**, no como evidencia de criterio, y no pueden alimentar interpretación. |
| `category` | enum | Categoría de la taxonomía A-02.1: `CONOCIMIENTOS` · `HABILIDADES_COMPETENCIAS` · `EXPERIENCIA_FORMACION` · `PERSONALIDAD` · `INTEGRIDAD`. **Regla de integridad**: debe coincidir con la categoría del criterio referenciado; una discrepancia es error de integridad (registro rechazado, no corregido en silencio). |
| `source` | enum | Origen de obtención: `SYSTEM_INSTRUMENT` (aplicación determinista del instrumento) · `HUMAN_INTERVIEW` (entrevistador humano) · `DOCUMENT_VERIFICATION` (revisión documental humana) · `CANDIDATE_DECLARATION` (declaración del candidato, sin verificar) · `GOVERNANCE_REGISTRY` (decisión o configuración registrada). **No existe** fuente `AI`; la IA nunca es origen de evidencia (PASO 12). |
| `instrument` | ID | Identificador del método o instrumento aplicado (p. ej., `EVALHR-PERSONALIDAD-IPIP50-MX`, `EVALHR-INTEGRIDAD-LEGACY`, `ENTREVISTA-FUTURA-ESTRUCTURA`, `DOCUMENT-VERIFY-<tipo>`). Debe existir en la matriz instrumento↔criterio (A-02.1) para poder producir evidencia del criterio. |
| `instrumentVersion` | string | Versión exacta del instrumento/método al momento de la captura. **Regla**: instrumento sin versión identificable → calidad máxima `LOW` (no puede ser HIGH ni MEDIUM; PASO 3). |
| `value` | estructurado | Resultado capturado, **en su forma cruda y tipada** según el tipo de evidencia: puntajes por factor (IPIP), aciertos/total (conocimiento), declaración (experiencia), booleano de verificación (documental), nota cualitativa (entrevista), o `NONE` (tipo H). Prohibido guardar en `value` interpretaciones, categorías ("bueno/malo") o valores derivados de fórmulas — no hay fórmulas en A-02.2. |
| `unit` | enum | Unidad de `value`: `RAW_POINTS_10_50` (factor IPIP) · `CORRECT_OVER_TOTAL` (conocimiento) · `BOOLEAN_VERIFIED` (documental) · `DECLARATIVE` (declaración) · `QUALITATIVE_NOTE` (entrevista) · `NONE` (insuficiencia). El par value+unit debe ser coherente con el tipo de evidencia. |
| `quality` | enum | `HIGH` · `MEDIUM` · `LOW` · `INSUFFICIENT`, asignado por **criterios objetivos** (PASO 3) y reglas por tipo (PASO 14). La calidad es del registro y del método: **no** es un atributo de la persona ni una validez predictiva. |
| `status` | enum | Ciclo de vida del registro: `ACTIVE` → `INVALIDATED` (única transición; nunca se borra ni se edita; la invalidación es append-only, PASO 16). Un registro `INVALIDATED` se conserva y deja de ser utilizable. |
| `timestamp` | datetime | Fecha/hora UTC (ISO-8601) de **captura** de la evidencia. Se registran además fecha de registro (si difiere) y zona horaria de captura declarada. Toda la cadena de auditoría usa UTC. |
| `reviewRequired` | boolean | Indica si el registro requiere revisión humana **antes de poder usarse** (matriz PASO 14). Es `true`, como mínimo, para: toda evidencia `LOW` o `INSUFFICIENT`, toda declaración sin verificar, toda evidencia de entrevista y todo registro marcado en conflicto (PASO 10). |
| `reviewStatus` | enum | `NOT_REQUIRED` · `PENDING` · `REVIEWED`. `REVIEWED` exige revisor identificado + fecha + nota de revisión (PASO 13). Un registro `reviewRequired=true` con `reviewStatus≠REVIEWED` **no puede alimentar ninguna salida interpretativa**. |
| `approvedBy` | string | Quién autoriza el **uso** de la evidencia para el criterio: para tipos declarativos/entrevista/documental = persona o rol humano identificado; para evidencia de instrumento = referencia a la **aprobación previa** de la pareja criterio↔instrumento en la matriz (aprobación ex-ante, con su identificador). Jamás "sistema" a secas ni IA. |

---

## 4. Campos de extensión recomendados (no del mínimo, definidos ya para coherencia)

| Campo | Propósito |
|---|---|
| `evidenceType` | Tipo A–H del PASO 2 (obligatorio en la práctica: la matriz de calidad se indexa por tipo). |
| `criterionVersion` | Versión del criterio al capturar (protege contra re-lecturas anacrónicas). |
| `applicationRef` | Referencia al proceso/persona evaluada (sin datos sensibles en el modelo; el vínculo real lo mantiene el sistema). |
| `reasonCode` | Motivo cuando `quality=INSUFFICIENT` (PASO 15): `NOT_ADMINISTERED`, `PARTIAL_RESPONSE`, `TECH_FAILURE`, `DECLINED`, `NO_METHOD`, `QUALITY_FAIL`. |
| `conflictRef` | Referencias a registros en conflicto (PASO 10). |
| `retentionRef` | Referencia a la política de conservación aplicable (consistente con la retención vigente del sistema, que no se modifica). |

---

## 5. Qué NO es un EvidenceRecord

- No es un puntaje, ni un ranking, ni un veredicto sobre la persona.
- No es "verdadero/falso" sobre el candidato: es un registro de resultado con
  calidad y estado de revisión.
- No es sustituible entre constructos: una evidencia de categoría D jamás
  cubre un criterio de categoría A (herencia A-02.1).
- No es editable: es append-only (se invalida, no se corrige).

---

## 6. Coherencia con la cadena A-02.1

```
PUESTO → CRITERIO aprobado (A-02.1) → INSTRUMENTO asignado (matriz A-02.1)
        → EvidenceRecord (ESTE DOCUMENTO) → [fase futura] interpretación
        → áreas de revisión → revisión humana → decisión de la empresa
```

El EvidenceRecord es el **único insumo autorizado** para cualquier
interpretación futura. Todo lo que no exista como EvidenceRecord (o como
resultado de instrumento sin criterio) **no existe** para el sistema.
