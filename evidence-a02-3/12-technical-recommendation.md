# EVALUHR — A-02.3 · PASO 12
# RECOMENDACIÓN TÉCNICA: "Considerar para entrevista"

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 10 §3 (definición), PASO 11 (prohibición estructural),
> PASO 14 (lenguaje P4/P6/P7).

---

## 1. Semántica exacta

> **"Recomendación técnica: Considerar para entrevista"** es una
> **orientación técnica** para decidir si conviene realizar una entrevista,
> derivada de las áreas que requieren revisión y de la completitud de la
> evidencia del candidato respecto de los criterios aprobados del puesto.

**NO significa, en ningún caso ni bajo ninguna redacción:**

| ❌ No significa | Razón |
|---|---|
| Contratar | La decisión es exclusivamente humana/empresa (A-02.1 PASO 11) |
| Apto | X1 prohibido; no existe veredicto de idoneidad |
| No apto | X2 prohibido; la recomendación no tiene forma negativa |
| Candidato ideal | X5/X7 prohibidos; no existen perfiles ideales |
| Predicción de desempeño | X6 prohibido; no existe evidencia predictiva de EvaluHR |
| Pre-selección / ranking | La salida nunca rankea personas (A-02.1 PASO 8) |

La recomendación **siempre** viaja acompañada de:
- **P7**: "Orientación técnica, no decisión de contratación."
- **P6**: "Resultado orientativo, sujeto a revisión humana."
- Su trazabilidad completa (PASO 15).

---

## 2. Condiciones mínimas para que pueda aparecer (todas obligatorias)

| # | Condición | Verificación |
|---|---|---|
| C1 | Existen **criterios aprobados** para el puesto (A-02.1 PASO 3) | Registro del puesto |
| C2 | Existe **evidencia parcial o completa** de esos criterios (al menos un EvidenceRecord utilizable: VALID o LIMITED) | Evidencias trazables |
| C3 | Existen **áreas que requieren revisión** que conviene explorar en conversación directa (por ambigüedad, falta de evidencia o desacuerdo cualitativo con la hipótesis registrada) | Áreas del PASO 11 |
| C4 | El AssessmentSummary fue generado por **reglas deterministas versionadas** (nunca IA ni edición manual) | `rulesVersion` + audit trail |
| C5 | La salida puede **sustentarse en criterios documentados** (trazabilidad completa: puesto → criterios → evidencia → áreas) | Cadena PASO 15 |
| C6 | La recomendación se presenta con sus calificadores P6/P7 y sin ningún término prohibido (X1–X15) | Filtro de lenguaje A-02.1 PASO 14 |

**Cuándo NO puede aparecer** (negaciones duras):

1. Sin criterios aprobados → no hay recomendación (solo evidencia cruda).
2. Sin ninguna evidencia utilizable → no hay recomendación (solo
   "Sin evidencia disponible para este criterio" / áreas de completación).
3. Sin áreas que ameriten conversación → no hay recomendación (no se inventa
   una para "completar" el reporte).
4. Si la cadena trazable está rota (criterios sin registro, evidencia sin
   versiones) → no hay recomendación.
5. **Nunca** aparece en forma negativa ("no considerar") — la recomendación
   técnica no tiene forma de rechazo (X14 prohibido).

---

## 3. Qué acompaña a la recomendación (contenido mínimo de la salida)

```
"Recomendación técnica: Considerar para entrevista."
  — Orientación técnica, no decisión de contratación.
  — Resultado orientativo, sujeto a revisión humana.
  Áreas que la motivan: [areaId + criterionId + reason (+ severity de proceso)]
  Evidencia considerada: [evidenceId + instrumento + versión]
  Estado de revisión humana: PENDIENTE
```

- La recomendación nombra las áreas que la motivan (transparencia total);
  nunca es una frase suelta sin sustento.
- Su receptor natural es **RH** (que revisa y entrevista, A-02.1 PASO 11);
  su receptor jamás es un "motor de decisión".

---

## 4. Prohibiciones operativas

1. ❌ Emitirla desde un score, promedio, umbral o ranking (no existen).
2. ❌ Usarla como filtro automático de avance/eliminación en flujos del
   producto (ningún flujo cierra procesos a partir de salidas de EvaluHR).
3. ❌ Reformularla con sinónimos decisorios ("recomendado para contratación",
   "candidato aprobado", "idóneo") — filtro semántico de A-02.1.
4. ❌ Que la IA la emita, la active o la suprima (IA = 0 en recomendaciones,
   herencia A-02.1 PASO 10 §6 / PASO 14 de este dossier).
5. ❌ Presentarla sin sus calificadores P6/P7 o sin sus áreas motivadoras.
