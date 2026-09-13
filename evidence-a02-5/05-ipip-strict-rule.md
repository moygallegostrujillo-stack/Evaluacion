# EVALUHR — A-02.5 · PASO 5
# IPIP-50-MX: REGLA ESTRICTA RASGO → CRITERIO

> Documento de diseño metodológico. NO modifica el IPIP, su scoring, sus
> preguntas ni sus salidas (v1.0 congelado, A-01.3). NO define umbrales ni
> puntos de corte. Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA
> METODOLÓGICA.
> Base: A-02.1 PASO 4 (reglas de uso de personalidad); A-02.3 PASO 4 (salida
> IPIP); A-01.3 (identidad y limitaciones del instrumento).

---

## 1. Regla estricta (mandato del encargo)

> **IPIP produce evidencia de rasgos de personalidad. Nada más.**

El IPIP-50-MX v1.0 produce exactamente: 5 dimensiones (E/A/C/ES/I),
puntuación raw 10–50 por factor, visualización 0–100 **no percentil**,
interpretación descriptiva P8 ("Tendencias de respuesta").

**NO se convierte automáticamente en:**

- ❌ cumplimiento de criterio ("cumple el perfil conductual");
- ❌ aptitud ("tiene aptitud para ventas");
- ❌ desempeño ("rendirá bien");
- ❌ integridad ("es honesto");
- ❌ capacidad ("capacidad de aprendizaje alta");
- ❌ personalidad ideal ("perfil psicométrico del puesto").

Cada conversión está ya prohibida por: A-02.1 PASO 4 (fórmulas, cortes,
percentiles, perfil ideal), A-02.3 PASO 4 (tabla de no-conversiones),
AI-X9 (IA interpreta rasgos como aptitudes). A-02.5 añade el mecanismo de
clasificación §3–§4 que regula la **única** relación legal: rasgo → criterio
del puesto.

---

## 2. La única relación sujeta a regulación

```
RASGO (dimensión IPIP, descriptiva)
   → CRITERIO DEL PUESTO (categoría D, aprobado, jobRelevance VALID)
```

Esta relación **existe como hipótesis metodológica** desde A-02.1 ("la
relación entre un rasgo y un requisito del puesto se documenta como
hipótesis sujeta a evidencia"). A-02.5 la clasifica en tres grados y define
qué permite cada uno. **Nunca se clasifica por valores del rasgo** (no hay
"relación válida solo si el puntaje supera X"): la clasificación describe la
relación, no a las personas.

---

## 3. Clasificación de la relación rasgo → criterio

### 3.1 EVIDENCE-SUPPORTED

> La relación está **demostrada con evidencia documentada** y aprobada por
> gobernanza.

Requisitos acumulativos:

| # | Requisito |
|---|---|
| ES-1 | Análisis de puesto que documenta la **funcionalidad** del rasgo para el criterio (por qué esa tendencia es pertinente a la función real) |
| ES-2 | Juicio de expertos **panelizado y documentado** (método, participantes, fecha, conclusiones — PASO 10) |
| ES-3 | Evidencia empírica de la relación en contexto comparable (estudio externo citado con fuente o estudio propio), evaluada críticamente |
| ES-4 | Revisión de proporcionalidad/no discriminación (PASO 13/14) |
| ES-5 | Aprobación de gobernanza con versión (PASO 15/18) |

**Qué permite:** usar el rasgo como **antecedente contextual documentado**
del criterio en el análisis del puesto (p. ej., para definir áreas de
entrevista); subject a las salidas permitidas de A-02.3.
**Qué sigue prohibiendo:** puntos de corte, percentiles, conversión a
cumplimiento/aptitud, decisión laboral.

**Inventario actual: **ninguna** relación rasgo→criterio es
EVIDENCE-SUPPORTED hoy** (ES-1..ES-5 no existen para ningún par).

### 3.2 HYPOTHESIS

> La relación es **plausible y está documentada como hipótesis**, pero sin
> la cadena de evidencia de §3.1.

Requisitos:

| # | Requisito |
|---|---|
| H-1 | Planteo explícito por escrito ("hipótesis metodológica"): rasgo X ↔ criterio Y, con la función del puesto implicada |
| H-2 | Origen trazable (análisis de puesto S1–S5; nunca biblioteca genérica ni IA) |
| H-3 | Registro con fecha y aprobación del Criterion Record |
| H-4 | Etiqueta visible HYPOTHESIS en toda documentación que la cite |

**Qué permite:** orientar áreas de exploración en entrevista (AI-5 opera
solo sobre áreas ya identificadas) y contextualizar el análisis del puesto.
**Qué prohíbe:** cualquier lectura de cumplimiento; participación como
cumplimiento en CriterionResult; sostener criticidad CRITICAL (PASO 3 §4).

**Estado actual:** grado máximo alcanzable hoy por cualquier relación
rasgo→criterio de puestos EvaluHR.

### 3.3 NOT-SUPPORTED

> Sin relación documentada, o relación expresamente desmentida/no
> defendible.

**Qué implica:** intentar vincular ese rasgo con ese criterio está
**prohibido**; cualquier vínculo existente se registra como rechazado
(trazabilidad completa, herencia de "rechazos registrados" A-02.1 PASO 3).
Toda relación entre IPIP y categorías A/B/C/E es NOT-SUPPORTED por
definición (transversalidad prohibida).

---

## 4. Regla de no-umbrales (específica IPIP)

1. ❌ La clasificación §3 **jamás** usa rangos del puntaje del rasgo
   ("extraversión ≥ X es soportada").
2. ❌ No existen "perfiles ideales" por puesto (prohibición A-02.1 PASO 4).
3. ❌ No se comparan puntajes del candidato con un "target" del puesto:
   el análisis usa la relación (documentada), nunca el recorte de la
   persona contra un estándar no validado.
4. ❌ La visualización 0–100 no percentil (v1.0) no recibe nueva semántica
   en A-02.5 (congelado).

---

## 5. Prohibiciones específicas de este PASO (eco del PASO 12)

| Afirmación prohibida | Sustituto permitido |
|---|---|
| "Extraversión alta = buen vendedor" | "Hipótesis documentada (HYPOTHESIS): la función de contacto con clientes hace pertinente explorar tendencias de sociabilidad en entrevista" |
| "Responsabilidad baja = mal empleado" | "Tendencia de respuesta en Escrupulosidad: [lectura descriptiva P8]; sin inferencia de desempeño" |
| "Perfil IPIP del vendedor ideal" | "Criterios D del puesto con relación HYPOTHESIS/EVIDENCE-SUPPORTED listados, sin target numérico" |
| "IPIP alto = recomendado" | Recomendación técnica solo vía C1–C6 (A-02.3 PASO 12), jamás desde un factor |
