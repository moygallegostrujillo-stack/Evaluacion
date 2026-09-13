# EVALUHR — A-02.4 · PASO 9
# NIVEL CUALITATIVO (ALTO / MEDIO / BAJO) — CONVENIENCIA CONCEPTUAL

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Mandato: determinar **solo** si los niveles son conceptualmente
> apropiados. **No crear todavía los umbrales.**

---

## 1. Pregunta del encargo

> ¿Es jurídicamente/metodológicamente conveniente usar niveles como
> ALTO / MEDIO / BAJO?

---

## 2. Análisis metodológico

**A favor:**
1. Coherencia con la naturaleza de los insumos: correspondencias descritas
   (cualitativas), estados y calidades — un ordinal es la agregación más
   honesta disponible.
2. El resultado incompleto (gates) encaja naturalmente: "no hay nivel" es
   distinto de "nivel BAJO" — un número no permite esa distinción.
3. Granularidad suficiente para la operación (referencia rápida de RH) sin
   la falsa precisión del 0–100.
4. Compatible con el lenguaje controlado: "Nivel de ajuste: MEDIO. Resultado
   orientativo, sujeto a revisión humana" (P2/P6).

**En contra / riesgos:**
1. **Los niveles son umbrales disfrazados**: asignar MEDIO vs BAJO exige
   reglas de frontera. Si no son deterministas y versionadas, el nivel se
   vuelve opinión.
2. Riesgo de lectura decisorial: "ALTO" puede operar como "contratable" de
   facto (mitigable con calificadores obligatorios y con la prohibición
   estructural de A-02.1 PASO 11).
3. La frontera MEDIO/BAJO es difusa: riesgo de inconsistencia entre
   evaluaciones si las reglas no son exactas (mitigable: reglas exactas +
   métricas de auditoría PASO 16).
4. Los niveles igual permiten comparar personas groseramente (riesgo menor
   que el número, pero existente; mitigable con "la salida no rankea").

**Análisis jurídico-conceptual:**
- Un ordinal **con reglas publicadas internamente, gates y revisión humana**
  es más defendible que un número continuo sin validez predictiva: comunica
  menos precisión de la que no tiene.
- El riesgo jurídico real no está en la etiqueta sino en su **uso
  automatizado**; eso queda prohibido estructuralmente (PASO 8).
- Conclusión: los niveles son **conceptualmente apropiados** SIEMPRE que:
  (a) los gates preceden (sin gate no hay nivel);
  (b) la regla de asignación es determinista, versionada y auditable;
  (c) cada nivel viaja con su explicación completa y calificadores P6/P7;
  (d) no se mapean a decisiones ni a acciones automáticas;
  (e) la opción fallback (sin niveles — A del PASO 7) permanece disponible
  si gobernanza los rechaza.

---

## 3. Decisión conceptual

> **SÍ son apropiados** como salida agregada del futuro nivel de ajuste,
> bajo las cinco condiciones anteriores.
>
> **NO se crean todavía los umbrales** (fronteras ALTO/MEDIO/BAJO, topes
> numéricos o condiciones k): son parámetros **SIN DEFINIR — A VALIDAR**
> (θ del PASO 13) que exigirán aprobación de gobernanza con datos reales.
> La estructura del modelo (gates, topes, exclusiones) está diseñada para
> funcionar con cualquier set de umbrales que se apruebe en su momento.

---

## 4. Compatibilidad con las salidas existentes

- El nivel **no sustituye** a las salidas A–E de A-02.3: se añade a la salida
  C (AssessmentSummary) como agregado orientativo cuando no hay gates.
- La recomendación técnica (E) **no se deriva del nivel** ("nivel ALTO" ≠
  recomendación; la recomendación se rige por sus propias condiciones
  C1–C6 de A-02.3 PASO 12).
- El resultado incompleto usa el encabezado y mensaje definidos en PASO 10.
