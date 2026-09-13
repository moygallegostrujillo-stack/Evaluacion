# EVALUHR — A-02.3 · PASO 2
# RESULTADO DE INSTRUMENTO (InstrumentResult)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-01.3 (versionado y gobernanza del IPIP-50-MX), A-02.1 (matriz
> instrumento↔criterio, lenguaje de salidas), A-02.2 (EvidenceRecord).

---

## 1. Definición

> Un **InstrumentResult** es el **registro del resultado de administrar un
> instrumento concreto, en su versión exacta**, a una persona, tal como el
> instrumento lo produce — con su calidad de administración, su alcance
> declarado y sus limitaciones — **sin ningún juicio de ajuste laboral**.

El InstrumentResult es la **fuente** de la que nacen los EvidenceRecord
(cuando existe criterio aprobado al cual anclarse, A-02.2 PASO 1 §3) y las
salidas de instrumento (PASO 17 de este dossier, salida A).

---

## 2. Campos conceptuales

| Campo | Descripción y reglas |
|---|---|
| `instrumentResultId` | Identificador único y no reutilizable del resultado de la administración. |
| `applicationRef` | Referencia al proceso/persona evaluada (sin datos sensibles en el modelo). |
| `instrument` | Identificador del instrumento (p. ej., `EVALHR-PERSONALIDAD-IPIP50-MX`). Debe existir en la matriz instrumento↔criterio (A-02.1) para poder producir evidencia de criterio. |
| `instrumentVersion` | Versión exacta aplicada (p. ej., `1.0`). Sin versión → el resultado no puede producir evidencia HIGH/MEDIUM (herencia A-02.2). |
| `languageVersion` | Versión de idioma del instrumento (p. ej., `ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA`). |
| `scoringVersion` | Versión del scoring aplicado (p. ej., `IPIP50-BFM-1.0`). |
| `administeredAt` / `completedAt` | Fecha/hora UTC de inicio y cierre (o intento) de administración. |
| `administrationStatus` | `COMPLETE` · `PARTIAL` (sección/ítems sin contestar) · `TECH_FAILURE` · `DECLINED`. Determina los estados de interpretación posibles (PASO 1). |
| `scope` | **Alcance**: qué mide el instrumento, tomado literalmente de la matriz A-02.1 (p. ej., IPIP-50-MX → "rasgos de personalidad auto-reportados en 5 factores; no mide desempeño, capacidad, honestidad ni aptitud"). El alcance viaja con el resultado; ninguna salida puede ampliarlo. |
| `results` | Resultados crudos producidos por el scoring oficial, en su unidad nativa (para IPIP-50-MX: 5 puntajes brutos por factor, rango 10–50, sin pesos ni normas). Prohibido guardar aquí interpretaciones, categorías o derivados de fórmulas. |
| `completeness` | Completitud por constructo/dimensión (p. ej., ítems respondidos por factor). Una dimensión incompleta **no se prorratea ni se imputa** (herencia A-02.2 PASO 11): queda INSUFFICIENT por constructo. |
| `resultQuality` | Calidad de la administración por constructo (HIGH/MEDIUM/LOW/INSUFFICIENT) según reglas deterministas del tipo (A-02.2 PASO 3 y 14). |
| `limitations` | Lista de limitaciones vigentes, heredadas del expediente del instrumento (p. ej., A-01.3 §7 para el IPIP-50-MX: auto-reporte, sin baremos, sin validez predictiva laboral, escala distinta del estudio de adaptación, etc.). La lista es obligatoria en la salida. |
| `disclaimers` | Textos literales obligatorios (para IPIP-50-MX: el disclaimer literal de A-01.3 y la nota "no constituye percentil"). |
| `criterionBindings` | Referencias a los EvidenceRecord generados desde este resultado (vacío si no hay criterios aprobados compatibles: el resultado queda como **resultado de instrumento sin criterio** y no alimenta interpretación — A-02.2 PASO 1 §3). |

---

## 3. Separación estricta de los seis elementos del encargo

| Elemento | Dónde vive | Regla de separación |
|---|---|---|
| **Resultado** | `results` (crudo, unidad nativa) | Nunca se mezcla con calidad ni con interpretación |
| **Calidad** | `resultQuality` (+ `administrationStatus`, `completeness`) | Es de la administración/método, no de la persona; no es validez predictiva |
| **Instrumento** | `instrument` | Identidad exacta; no se sustituye por otro |
| **Versión** | `instrumentVersion` + `languageVersion` + `scoringVersion` | Cuádruple identificación obligatoria (herencia A-01.3) |
| **Alcance** | `scope` | Fijado por la matriz A-02.1; toda salida repite el alcance y no puede ampliarlo |
| **Limitaciones** | `limitations` + `disclaimers` | Siempre visibles en la salida; no negociables |

---

## 4. REGLA CENTRAL: InstrumentResult ≠ JobFit

> **Un InstrumentResult no es, no contiene y no puede convertirse en un
> "ajuste" (JobFit) a un puesto.**

Consecuencias operativas (vigentes desde ya como política):

1. El InstrumentResult no referencia puestos: referencia persona + instrumento
   + versión. El vínculo con el puesto solo existe **a través de criterios
   aprobados** (EvidenceRecord, A-02.2).
2. Prohibido calcular, mostrar o insinuar a partir de un InstrumentResult:
   cumplimiento, incumplimiento, aptitud, recomendación laboral, "encaje",
   compatibilidad, porcentaje de ajuste o cualquier análogo (herencia total de
   A-01.3 §8 y A-02.1 PASO 8/9).
3. Las salidas de instrumento (PASO 17, salida A) usan el lenguaje permitido
   P1 ("Resultado de evaluación"), P6 ("Resultado orientativo, sujeto a
   revisión humana") y P8 ("Tendencias de respuesta", para IPIP-50-MX).
4. Ningún componente futuro ("Nivel de ajuste", AssessmentSummary) puede leer
   un InstrumentResult por encima de la capa de criterios: la única ruta
   autorizada es PUESTO → CRITERIO → EVIDENCIA → resultado de criterio.

---

## 5. Ciclo de vida

```
Administración (COMPLETE/PARTIAL/TECH_FAILURE/DECLINED)
        ↓
InstrumentResult registrado (append-only, con versiones)
        ↓
(a) genera EvidenceRecord por criterio aprobado compatible  → capa de criterios (PASO 3)
(b) sin criterio compatible → queda como resultado de instrumento
    (visible como resultado, NO alimenta interpretación de criterios)
```

- El InstrumentResult es append-only: no se edita; una re-administración
  produce un InstrumentResult nuevo.
- Un `administrationStatus≠COMPLETE` degrada la calidad por reglas
  deterministas y puede dejar dimensiones/constructos INSUFFICIENT — nunca
  en 0.
- La revisión humana (PASO 13) opera sobre resultados **ya registrados**: su
  lectura no altera retroactivamente el InstrumentResult (herencia del
  mandato de revisión de este dossier).
