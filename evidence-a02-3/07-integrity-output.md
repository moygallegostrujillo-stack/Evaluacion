# EVALUHR — A-02.3 · PASO 7
# SALIDA DE INTEGRIDAD — ESTADO OBLIGATORIO INSUFFICIENT

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 7 (integridad con estatus abierto, checklist de 6
> prerrequisitos, frase obligatoria), A-02.2 PASO 7 (regla I-INT-1).

---

## 1. Estado obligatorio de la salida

> **Integridad hoy: `INSUFFICIENT` — hasta que exista expediente metodológico
> y psicométrico suficiente.**

- Regla **I-INT-1** (heredada y vigente): el instrumento de integridad actual
  de EvaluHR no dispone de evidencia suficiente para tratarse como
  instrumento psicométrico validado → **toda salida de criterio de categoría
  E es "Información insuficiente para evaluar este criterio."**
  (`reasonCode=QUALITY_FAIL`, regla R6).
- El dato crudo del instrumento legacy se conserva (registro y audit trail),
  pero **no sostiene lectura del criterio** ni aparece como "score de
  integridad".

---

## 2. Prohibición central: NO crear score de integridad artificial

Queda prohibido producir, calcular, mostrar o insinuar:

1. ❌ Un "score de integridad" derivado de: el instrumento legacy, el IPIP,
   la entrevista, documentos, o cualquier combinación de ellos.
2. ❌ Sustitutos semánticos: "confiabilidad de la persona", "riesgo",
   "honestidad medida", "indicador de integridad".
3. ❌ Atribuir a la persona un valor por la ausencia o insuficiencia del
   instrumento (**INSUFFICIENT ≠ 0**, regla de oro).
4. ❌ Presentar el instrumento actual como prueba psicométrica validada.
   **Frase obligatoria vigente** (herencia A-02.1, presente en el expediente
   y reproducida aquí):
   > "El instrumento actual de integridad de EvaluHR no debe presentarse
   > todavía como prueba psicométrica validada."

---

## 3. Qué SÍ puede mostrar la salida de integridad hoy

| Elemento permitido | Texto/enfoque |
|---|---|
| Estado del criterio | "Información insuficiente para evaluar este criterio." + causa ("no existe expediente metodológico y psicométrico suficiente para este instrumento") |
| Área de revisión | Área con `reason=NO_EVIDENCE_BASE` (PASO 11) — invita a explorar el tema por vías humanas legítimas (entrevista estructurada futura, referencias verificadas), sin score |
| Dato crudo conservado | Visible solo en contexto de auditoría/revisión, sin lectura del criterio |
| Frase obligatoria | Reproducida en toda salida o material que toque integridad |

---

## 4. Camino de salida del estado (condiciones, no acciones)

El estado INSUFFICIENT se levanta **solo** cuando el checklist de 6
prerrequisitos de A-02.1 (07 §3) esté completo y gobernanza lo registre:
método documentado, teoría del constructo, evidencia psicométrica revisable,
gobernanza de versiones, lenguaje aprobado, aprobación expresa. Mientras eso
no ocurra, ningún flujo, fase o presión comercial cambia la salida.

Coherencia: PASO 1 (estados), PASO 3 §3.5 (categoría E), PASO 11 (áreas),
PASO 16 (matrices) — integridad figura como INSUFFICIENT en todas.
