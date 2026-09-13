# EVALUHR — A-02.4 · PASO 1
# DEFINICIÓN FORMAL DE "NIVEL DE AJUSTE" (JobFit)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> IPIP-50-MX, preguntas, scoring de instrumentos, IA, recomendaciones,
> frontend, contrato ni aviso de privacidad. **No se implementa nada en
> A-02.4.** Esta fase SÍ puede diseñar fórmulas conceptuales y modelos
> matemáticos (autorización del encargo), siempre como PROPUESTA.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA DE DISEÑO
> Base: A-02.1 PASO 9 (concepto fijo + 7 condiciones previas), A-02.2 (modelo
> de evidencia), A-02.3 (estados, CriterionResult, salidas).

---

## 1. Definición formal

> **JobFit** (nombre interno del diseño; el nombre de producto sigue siendo
> el oficial de A-02.1: **"Nivel de ajuste respecto de los criterios
> definidos para el puesto"**) es una **medida de correspondencia entre los
> criterios aprobados de un puesto y la evidencia disponible sobre una
> persona**, calculada **exclusivamente sobre CriterionResults** (A-02.3) por
> **reglas deterministas versionadas**, con **gates de criticidad**, y
> expresada como **nivel cualitativo con explicación completa** — o como
> **resultado incompleto** cuando los gates lo exigen.

Formalización conceptual:

```
Sea C = {c₁, …, cₙ} el conjunto de criterios APROBADOS y vigentes del puesto
         (A-02.1 PASO 3), cada uno con criticality(cᵢ) ∈ {CRITICAL, IMPORTANT, STANDARD}.

Para cada cᵢ, el CriterionResult rᵢ (A-02.3) provee:
         state(rᵢ)   ∈ {VALID, LIMITED, INSUFFICIENT, INVALID, PENDING_REVIEW}
         quality(rᵢ) ∈ {HIGH, MEDIUM, LOW, INSUFFICIENT}
         corr(rᵢ)    ∈ {CORRESPONDE, PARCIAL, NO_CORRESPONDE, SIN_LECTURA}
                      (descriptor de correspondencia descrito por reglas de
                       lectura deterministas por categoría — PASO 13)

JobFit = FitLevel(C)
       = 𝒜({ (cᵢ, criticality(cᵢ), state(rᵢ), quality(rᵢ), corr(rᵢ)) })

sujeta a:
  (G) GATES:  ∃cᵢ con criticality=CRITICAL y (state(rᵢ) ≠ VALID ∨
              corr(rᵢ) ilegible por conflicto/revisión)  ⇒  JobFit NO se produce;
              salida = resultado incompleto (PASO 6/10).
  (A) AGREGACIÓN: regla de composición por reglas versionadas (PASO 13),
      con regla de anticompensación (PASO 15) y compensabilidad por
      criticidad (PASO 5).
  (H) HONESTIDAD: INSUFFICIENT nunca entra como 0 ni como valor numérico;
      entra como EXCLUSIÓN declarada (y como gate si es crítico).
```

**Dominio de salida**: nivel cualitativo {ALTO, MEDIO, BAJO} (conveniencia
analizada en PASO 9; umbrales aún NO definidos) **o** resultado incompleto.
**No produce**: APTO, NO APTO, decisión de contratación, predicción de
desempeño, probabilidad de éxito (PASO 8).

---

## 2. Lo que JobFit NO es (denominaciones prohibidas)

| ❌ No se llama / no es | Razón |
|---|---|
| **Aptitud** | Implica un atributo de la persona; JobFit mide correspondencia evidencia↔criterio |
| **Capacidad laboral** | Ídem: es un juicio sobre la persona, no sobre la correspondencia |
| **Probabilidad de éxito** | No existe criterio externo ni validez predictiva en EvaluHR (herencia A-01.3/A-02.1) |
| **Predicción de desempeño** | Ídem |
| **Veredicto / calificación de la persona** | La salida describe correspondencia; la persona no se califica |
| **Decisión de contratación** | Exclusivamente humana (A-02.1 PASO 11) |

Nombre oficial de salida (heredado, literal): **"Nivel de ajuste respecto de
los criterios definidos para el puesto"** — con el calificador "Resultado
orientativo, sujeto a revisión humana" (P6) y explicación completa (PASO 17).

---

## 3. Propiedades formales obligatorias

1. **Anclaje a criterios previos**: solo criterios aprobados ANTES de la
   evaluación; prohibido ajustar criterios post hoc para que encajen
   (herencia A-02.1 PASO 9).
2. **No sustitución de constructos**: la composición nunca sustituye un
   criterio de una categoría por evidencia de otra (herencia A-02.1/A-02.2).
3. **No compensación de brechas críticas** (regla maestra del encargo): un
   resultado alto en un criterio **no compensa automáticamente** la ausencia
   de evidencia en otro criterio crítico — formalizado como gate (PASO 6/15).
4. **INSUFFICIENT ≠ 0** (regla maestra heredada): la ausencia/insuficiencia
   entra como exclusión declarada o gate, jamás como puntuación negativa o
   cero.
5. **Determinismo y versionado**: la función 𝒜 es reglas versionadas
   (`fitRulesVersion`); resultados históricos no se reinterpretan con reglas
   nuevas (herencia A-01.3 10).
6. **Explicabilidad total**: cada nivel es reproducible desde su explicación
   (criterios + evidencia + estado; PASO 17).
7. **Revisión humana obligatoria**: JobFit es insumo de revisión (P6); la
   empresa decide (A-02.1 PASO 11).
8. **Trazabilidad de 10 eslabones** (A-02.3 PASO 15): el eslabón
   INTERPRETACIÓN se extiende con NIVEL DE AJUSTE cuando esta fase se
   implemente con autorización.

---

## 4. Relación con las capas previas (cadena completa)

```
PUESTO → CRITERIOS → EVIDENCIA → CALIDAD → ESTADO → INTERPRETACIÓN
        (A-02.1)    (A-02.2)    (A-02.2)  (A-02.3)  (A-02.3 CriterionResult)
                                                    ↓
                                              NIVEL DE AJUSTE (ESTA FASE,
                                              diseño; implementación futura
                                              autorizada)
                                                    ↓
                                     REVISIÓN HUMANA → DECISIÓN DEL CLIENTE
```

Reglas de la cadena:
1. JobFit **no lee InstrumentResults directamente**: solo CriterionResults.
   (Verificación de auditoría del PASO 20: "no se confunde JobFit con
   InstrumentResult".)
2. JobFit **no consume decisiones ni las produce**: alimenta la revisión
   humana.
3. Si alguna capa previa está rota (criterios no aprobados, evidencia sin
   versión, reglas sin versión), JobFit no se produce — se produce solo
   evidencia cruda por instrumento (herencia de las puertas de control de
   A-02.1 PASO 8 §4).

---

## 5. Cumplimiento de las 7 condiciones previas de A-02.1 PASO 9

| # | Condición previa | Estado en A-02.4 |
|---|---|---|
| 1 | Criterios aprobados y vigentes por puesto | Requisito de entrada (sin datos reales aún; diseño condicional) |
| 2 | Evidencia disponible y confiable | Requisito de entrada (reserva correctAnswer vigente: PASO 4/10) |
| 3 | Regla de correspondencia por criterio | **Diseñada conceptualmente aquí** (PASO 13, §correspondencia por categoría) — PROPUESTA pendiente de aprobación |
| 4 | Regla de composición | **Diseñada conceptualmente aquí** (PASO 13 𝒜) — PROPUESTA pendiente de aprobación |
| 5 | Decisión de participación de categorías A–E | **Propuesta aquí**: A/B/C participan con sus reglas; D (IPIP) participa solo como contexto descriptivo (nunca como cumplimiento); E (integridad) INSUFFICIENT estructural → no participa como lectura (gate si es criterio crítico) |
| 6 | Validación de lenguaje | Diseño alineado a P1–P8/X1–X15; validación final pendiente |
| 7 | Revisión humana integrada | Heredada: JobFit → revisión (PASO 19) |

**Conclusión de estado**: A-02.4 completa el **diseño** de 3–5 como
PROPUESTA; la **aprobación de gobernanza** y la **validación con datos
reales** siguen pendientes (PASO 19/20 y dossier §19).
