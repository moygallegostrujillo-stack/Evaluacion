# A-05.1 — 10 · DECISIÓN V1 (PASO 11)

## 1. Cuatro opciones evaluadas

### OPTION A — Conservar Big Five demo como indicador experimental

| Criterio | Valor |
|---|---|
| Valor | Bajo — sin respaldo psicométrico |
| Evidencia | NOT ESTABLISHED |
| Derechos | UNKNOWN |
| Costo | $0 |
| Riesgo | ALTO (3 riesgos HIGH) |
| Impacto | Mantiene el status quo; el riesgo metodológico persiste |
| Recomendación | Solo si NO hay presupuesto para validación Y se etiqueta explícitamente «experimental» Y se aísla del `overallScore` |

### OPTION B — Sustituir por IPIP-50-MX

| Criterio | Valor |
|---|---|
| Valor | Alto — fuente PUBLIC DOMAIN verificable, 10 ítems/dim |
| Evidencia | ESTABLISHED internacionalmente; MX requiere validación propia |
| Derechos | PUBLIC DOMAIN (atribución Goldberg requerida) |
| Costo | $0 licencia + costo de traducción + validación propia (EFA/CFA, α, baremos MX) |
| Riesgo | MEDIO (faking; tiempo de respuesta 50 ítems; baremos MX sin verificar) |
| Impacto | Elimina los 3 riesgos HIGH; introduce compromiso de tiempo |
| Recomendación | ÓPTIMA metodológicamente si hay presupuesto de validación |

### OPTION C — Sustituir por otra alternativa (Mini-IPIP 20 ítems)

| Criterio | Valor |
|---|---|
| Valor | Medio-Alto — compromiso viable (4 ítems/dim, α esperado .65–.80) |
| Evidencia | ESTABLISHED (Donnellan 2006); MX requiere validación |
| Derechos | PUBLIC DOMAIN |
| Costo | $0 licencia + traducción + validación |
| Riesgo | MEDIO-BAJO |
| Impacto | Mejor que demo, más corto que IPIP-50 |
| Recomendación | VIABLE como compromiso si 50 ítems es demasiado largo |

### OPTION D — Eliminar personalidad de V1

| Criterio | Valor |
|---|---|
| Valor | Elimina riesgo; reduce diferenciación del producto |
| Evidencia | N/A |
| Derechos | N/A |
| Costo | $0 |
| Riesgo | BAJO metodológico; MEDIO producto |
| Impacto | V1 se enfoca en Knowledge (sólido) + Integrity (aislada) + Psychology; sin personalidad |
| Recomendación | Viable si no hay presupuesto de validación Y se acepta reducir el producto |

## 2. Recomendación V1

**Recomendación principal: OPTION B (IPIP-50-MX) CONDICIONADA.**

La ruta recomendada para V1, sujeta a condiciones:

### Ruta recomendada: D (interino) → B (objetivo)

**Interino inmediato (V1 ship-block):** OPTION A-conservativa
- Conservar el Big Five demo **solo como indicador experimental**.
- Etiquetar explícitamente en UI y aviso: «indicador experimental, orientativo, sin validez psicométrica establecida».
- **Aislar personalidad del `overallScore`** (igual que A-04.5 aisló Integrity) — deja de ponderar hasta que se valide.
- No introducir perfil ideal, corte, ni APTO.
- Esto elimina el riesgo HIGH «uso laboral no validado» (R6) sin requerir validación inmediata.

**Objetivo (post-V1, con presupuesto de validación):** OPTION B (IPIP-50-MX)
- Traducir/adaptar IPIP-50 siguiendo ITC 2017.
- Validar en muestra mexicana (EFA/CFA, α, baremos).
- Atribuir correctamente (Goldberg 1999/2006 + escala IPIP-50).
- Una vez validado, re-admitir al `overallScore` con `evidenceStatus` (como Knowledge canónico).

### Condiciones (GO/NO-GO)

**GO (interino OPTION A-conservativa) si se cumplen TODAS:**
1. Se etiqueta «experimental, orientativo, sin validez» en ConsentView + EvaluationView + CandidateDetailView + CompareView.
2. Se aísla personalidad del `overallScore` (decisión de implementación — NO en A-05.1 que es solo auditoría).
3. No se introduce perfil ideal, corte, percentil, ni APTO basado en personalidad.
4. RH es informado de que personalidad es orientativa, no decisión.
5. Se documenta la deuda técnica (instrumento sin validar) en el expediente.

**NO-GO (interino) si:**
- No se puede aislar del `overallScore` en la fase de implementación, o
- No se puede etiquetar como experimental, o
- Se quiere usar personalidad como criterio de decisión.

**GO (objetivo OPTION B) si se cumplen TODAS:**
1. Validación en muestra MX (EFA/CFA, α ≥ .70 por dimensión, baremos).
2. Atribución Goldberg + escala correcta.
3. Traducción siguiendo ITC 2017.
4. Revisión legal del estatus de dato sensible.

## 3. Por qué NO OPTION A pura (conservar sin más)

Conservar el demo como instrumento formal (ponderando `overallScore`, etiquetado como «Big Five» sin más) **NO es recomendable** porque:
- Los 3 riesgos HIGH persisten (fuente, dimensiones, uso laboral).
- Se atribuye implícitamente validez que no existe.
- Contradice el principio de no hacer inferencias no validadas (A-04.2 gobernanza).

## 4. Por qué NO OPTION D inmediata (eliminar ahora)

Eliminar personalidad de V1 sin más **tampoco es óptimo** porque:
- Reduce la diferenciación del producto (un SaaS de RRHH sin personalidad es menos competitivo).
- Knowledge canónico + Integrity (aislada) + Psychology no cubren el espacio de personalidad.
- La opción interina (A-conservativa) elimina el riesgo sin perder la sección.

## 5. Decisión final documentada

**OPTION A-conservativa (interino) → OPTION B (objetivo condicional).**

- En V1: conservar como indicador experimental, aislar del overall, etiquetar.
- Post-V1: sustituir por IPIP-50-MX validado cuando haya presupuesto.

**Esta decisión es de documentación; la implementación (aislar personalidad del overall, etiquetar) requiere una fase de implementación separada (e.g. A-05.2). A-05.1 es SOLO AUDITORÍA.**
