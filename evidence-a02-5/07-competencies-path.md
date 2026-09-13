# EVALUHR — A-02.5 · PASO 7
# COMPETENCIAS: RUTA DE NO_METHOD A VALID

> Documento de diseño metodológico. **NO implementa nada** — define la cadena
> metodológica que tendría que cumplirse. NO define umbrales ni pesos.
> Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 6 (modelo de competencias); A-02.3 PASO 6 (salida de
> competencias: hoy NO_METHOD → INSUFFICIENT; diseño condicional con 6
> puertas de activación).

---

## 1. Pregunta del encargo

> ¿Qué evidencia se necesitaría para pasar de **NO_METHOD** a **VALID**?

Respuesta corta: la cadena completa §2 + las 6 puertas de activación de
A-02.3 + gobernanza (PASO 15). Mientras no exista método conductual
implementado y aprobado, toda salida de competencias es
**INSUFFICIENT sin excepciones** y el auto-reporte es solo contexto.

---

## 2. Cadena metodológica obligatoria

```
COMPETENCIA (aprobada, con definición)
   → INDICADOR CONDUCTUAL (observable, evaluable)
      → REACTIVO/ESCENARIO (situacional o de entrevista estructurada)
         → SCORING (rúbrica conductual versionada)
            → EVIDENCIA (registro por indicador)
               → LECTURA del criterio B (CriterionResult)
```

### 2.1 Competencia

- Definición propia del puesto (no biblioteca genérica — prohibición
  A-02.1 PASO 6 §5), trazada a funciones reales (PASO 1 de este dossier).
- Descripción de qué es y qué **no** es la competencia; diferencia del
  constructo vecino (p. ej., "comunicación con clientes" ≠ rasgo de
  sociabilidad, categoría D — se documentan como criterios distintos).

### 2.2 Indicador conductual

- Conducta **observable y registrable** ("explica el producto al cliente sin
  improvisar precios", no "tiene buena presencia comunicativa").
- Cada indicador cita la función del puesto que lo justifica (PASO 1).
- Sin indicadores no hay escenario posible: una competencia sin indicadores
  queda en DRAFT sin ruta a evidencia.

### 2.3 Reactivo / escenario

- Escenario situacional o pregunta conductual (del tipo "descríbame una vez
  que…") **alineado a indicadores específicos**.
- Versionado; revisión de redacción y sesgos evidentes (K-VAL-7 análogo).
- La IA puede asistir **solo** como borrador para humanos sobre contenidos
  ya aprobados, marcada, sin inventar competencias ni indicadores (AI-X1/
  herencia A-02.1: cero participación de IA en criterios).

### 2.4 Scoring

- **Rúbrica conductual versionada** por indicador (niveles descriptivos de
  conducta observada — p. ej., "no ejecutó / ejecutó parcialmente / ejecutó
  la conducta"), definida **antes** de aplicar.
- Prohibido: score compuesto numérico por defecto (herencia del diseño
  condicional A-02.3 PASO 6: lectura descriptiva por indicador, sin score
  compuesto salvo aprobación explícita de gobernanza); pesos inventados;
  conversión a "nivel de competencia" global sin método.
- Registro por indicador: hecho observado, evaluador humano identificado,
  fecha, escenario versionado.

### 2.5 Evidencia y lectura

- La evidencia habilitada permite lectura **descriptiva por indicador** del
  criterio B (dentro de las inferencias permitidas de la categoría), con
  revisión humana siempre.
- Lo que la evidencia conductual **no** demuestra: desempeño futuro,
  rasgos de personalidad, integridad, capacidad general.

---

## 3. Puertas de activación (herencia A-02.3 PASO 6, integradas con gobernanza)

| # | Puerta | Enlaza con |
|---|---|---|
| P-COMP-1 | Competencias definidas con indicadores, aprobadas y trazadas al puesto | PASO 1 (relevancia), PASO 15 (gobernanza) |
| P-COMP-2 | Método conductual versionado (escenarios + rúbricas) | §2.3–2.4 |
| P-COMP-3 | Registro por indicador implementado **en otra fase autorizada** | Regla final: no implementar |
| P-COMP-4 | Revisión humana obligatoria de cada aplicación | PASO 15 |
| P-COMP-5 | Lenguaje de salida aprobado (sin "competencia medida" hasta método) | Catálogo P/X, A-02.3 |
| P-COMP-6 | Auditoría de la cadena completa | PASO 19 |

**Estado actual:** P-COMP-1..6 **no cumplidas**. Fuerza de relación del par
competencias→criterio B: NOT_SUPPORTED (PASO 11). El auto-reporte legacy
(10 ítems) sigue siendo solo autopercepción orientativa (LIMITED/contexto).

---

## 4. Prohibiciones específicas

1. ❌ Derivar score de competencia desde Big Five, auto-reportes, entrevista
   sin método o IA (regla A-02.3, sin cambios).
2. ❌ "Competencia medida" como etiqueta mientras NO_METHOD persista.
3. ❌ Rúbricas improvisadas durante la aplicación (se definen antes y se
   versionan).
4. ❌ Saltar indicadores: competencia → score directo (sin observación
   registrada) es precisamente el patrón que produce evidencia no defendible.
5. ❌ Implementar cualquiera de los reactivos/rúbricas de este diseño antes
   de la fase autorizada (regla final del encargo: NO IMPLEMENTAR).
