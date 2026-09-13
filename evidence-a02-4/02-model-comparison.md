# EVALUHR — A-02.4 · PASO 2
# COMPARACIÓN DE ARQUITECTURAS — MODELOS A, B Y C

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Mandato del encargo: evaluar los 10 criterios y **NO elegir por facilidad
> de programación**.

---

## 1. Los tres modelos

### MODELO A — Score ponderado tradicional
```
FitScore = Σ wᵢ · sᵢ    (suma ponderada de puntajes por criterio)
```
- Cada criterio aporta un puntaje sᵢ (normalizado) y un peso wᵢ.
- Traducción típica: "88/100 de ajuste".

### MODELO B — Cumplimiento por criterios
```
JobFit = {Cumple c₁, Cumple c₂, …, No hay lectura de cₖ}   (sin agregación)
```
- Cada criterio se reporta como cumplido / no cumplido / sin lectura.
- Sin número global; decisión sobre el conjunto.

### MODELO C — Modelo híbrido (cadena completa)
```
criterio → evidencia → calidad → estado → cumplimiento → nivel de ajuste
```
- Cada criterio produce una **lectura de correspondencia descrita** (no
  binaria) a partir de evidencia con **calidad** y **estado** (A-02.2/A-02.3).
- La composición final es un **nivel cualitativo con reglas estructurales**:
  gates de criticidad, exclusión honesta de insuficiencias, tope por brechas
  importantes, y métricas de completitud visibles.
- Es la arquitectura que integra directamente las fases A-02.1→A-02.3.

---

## 2. Evaluación (10 criterios del encargo)

| Dimensión | MODELO A (ponderado) | MODELO B (cumplimiento) | MODELO C (híbrido) |
|---|---|---|---|
| **Transparencia** | Baja–media: los pesos son números difíciles de justificar; el "88" oculta la estructura | Alta: la lista es legible, pero "cumple/no cumple" exige definiciones por criterio que suelen esconder cortes | Alta: cada eslabón (evidencia→estado→cumplimiento) es visible y auditable |
| **Explicabilidad** | Pobre: explicar por qué 88 y no 85 requiere exponer la aritmética completa | Buena por criterio; pobre para el conjunto ("¿entonces qué?") | Buena: nivel + explicación por criterio + estado de evidencia (PASO 17) |
| **Resistencia a datos faltantes** | Muy baja: la ausencia entra como 0 (violación directa de INSUFFICIENT ≠ 0) o se "renormaliza" (la falta desaparece del número) | Media: el faltante es visible como "sin lectura", pero el conjunto queda ambiguo | Alta: la ausencia es exclusión declarada; gates protegen los críticos; métricas de completitud obligatorias |
| **Manejo de criterios críticos** | Muy malo: un crítico sin evidencia solo "resta" lo que su peso diga (compensable por diseño) | Bueno si se trata como veto; el modelo no lo formaliza | Excelente: gates explícitos (PASO 6); crítico sin evidencia ⇒ resultado incompleto |
| **Riesgo de compensación indebida** | **Muy alto** (estructural): cualquier criterio alto compensa cualquier otro bajo — la violación exacta que el encargo prohíbe | Bajo dentro del criterio; alto entre criterios si alguien resume la lista "a ojo" | Bajo: compensabilidad definida por criticidad (PASO 5) + tope por brechas importantes (PASO 13) |
| **Auditabilidad** | Media: reproducible, pero el histórico de pesos y su justificación es frágil | Alta por criterio | Alta: cada salida reproduce reglas+versiones+estados (trazabilidad A-02.3 extendida) |
| **Facilidad de implementación** | Alta (trivial) | Media (definiciones por criterio) | **Baja–media** (más reglas, gates, estados) — **no fue criterio de elección** |
| **Riesgo jurídico** | Alto: número preciso sin validez predictiva; invita a comparaciones y automatización de decisiones | Medio: binariedad "no cumplió" puede operar como rechazo automático de facto | Bajo–medio: lenguaje orientativo, revisión humana obligatoria, salida incompleta honesta |
| **Riesgo de discriminación** | Alto: ponderaciones sin evidencia pueden penalizar sistemáticamente a grupos sin que nadie lo note | Medio: cortes por criterio tienen el mismo problema | Bajo–medio: sin cortes numéricos; brechas visibles; métricas internas para detectar sesgo (PASO 16) |
| **Riesgo metodológico** | Muy alto: mezcla constructos en una sola suma; falsa precisión | Medio: la binariedad pierde matices (parcial, calidad, contexto) | Bajo–medio: separa constructos, estados y calidades; aún requiere validación con datos reales |

---

## 3. Lectura de la comparación

1. **MODELO A queda descartado como arquitectura base**: su estructura misma
   convierte INSUFFICIENT en 0 o lo hace desaparecer por renormalización, y
   hace la compensación indebida *inevitable* (no un riesgo: una propiedad).
   Viola las dos reglas maestras del encargo.
2. **MODELO B aporta la exigencia correcta por criterio** (nada se esconde
   tras un promedio) pero es insuficiente como salida: sin composición, RH
   recibe una lista ambigua; y "cumple/no cumple" sin reglas de lectura
   termina fabricando cortes de facto.
3. **MODELO C** conserva la exigencia por criterio de B, integra los estados
   y calidades de A-02.2/A-02.3 (que A ignora y B no sabe usar), formaliza
   gates para críticos y hace la compensación explícita y controlada. Su
   costo (más reglas) es de diseño, no de principiantes: es el precio honesto
   de la regla maestra.

---

## 4. Decisión (PROPUESTA — sujeta a aprobación de gobernanza)

> **Se recomienda el MODELO C (híbrido) como arquitectura del futuro "Nivel
> de ajuste".** La elección se justifica por las 10 dimensiones evaluadas —
> en particular por datos faltantes, criterios críticos y compensación — y
> **no** por facilidad de implementación (donde C es el más costoso de los
> tres).

La fórmula conceptual completa del Modelo C se propone en PASO 13
(`13-conceptual-formula.md`) y la propuesta final consolidada en
`proposed-fit-model.md`.

Matriz operativa de esta comparación: `fit-model-comparison.csv` (PASO 18).
