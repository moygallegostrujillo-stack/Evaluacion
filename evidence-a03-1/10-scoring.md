# EVALUHR — A-03.1 · PASO 10
# SCORING CONCEPTUAL — ACIERTOS SOBRE ITEMS VÁLIDOS — SIN IMPLEMENTAR

> Documento de diseño metodológico. **NO se implementa todavía.** NO modifica
> el scoring existente. Fecha: 2026-09-10 · Versión: 1.0 · Estado: PROPUESTA
> METODOLÓGICA.
> Base: A-02.2 K3 (unit = CORRECT_OVER_TOTAL); A-02.3 escenarios C/D
> (sin prorrateo, sin rescate parcial); PASO 6 de esta fase (K-CA-1..6).

---

## 1. Fórmula conceptual (encargo)

```
knowledgeScore  =  respuestas correctas / items puntuables válidos
                   (correct responses / valid scored items)
```

Precisión conceptual:

- **Numerador**: items administrados y respondidos explícitamente cuya clave
  válida coincide con la respuesta (K-CA-2: un item sin clave no genera
  "incorrecto"; una respuesta sin respuesta ≠ error).
- **Denominador**: los items del set publicado **que son puntuables** (clave
  persistida, verificable y versionada) y fueron administrados.
- **Unidad**: `CORRECT_OVER_TOTAL` (herencia K3), sobre el universo definido
  por el blueprint versionado.

## 2. Qué NO se permite (encargo)

| Prohibición | Contenido | Regla |
|---|---|---|
| **P1 — missing correctAnswer como incorrecta** | Un item sin clave no cuenta como error del candidato ni entra al numerador ni al denominador "errores" | K-CA-2 |
| **P2 — prorrateo arbitrario** | Prohibido rescalar parcialmente: si el set publicado tiene N items y solo M son puntuables válidos, **no** se reporta "x/M como si fuera x/N" ni se multiplica x/M × N. Si falta cualquiera, no hay score del instrumento | KSC-2; escenario D |
| **P3 — rescate parcial** | "Puntuar solo las preguntas buenas" de un set que contiene items inválidos/no puntuables → prohibido; el resultado completo es INSUFFICIENT | K-CA-3; escenario D (A-02.3) |
| **P4 — pesos** | Los items no tienen pesos (no "vale más" un HARD ni un CORE); cada item puntuable válido = 1 acierto | KSC-3; K-BP-4; KD-5 |
| **P5 — imputación/prorrateo de parciales** | Si la administración está incompleta, prohibido estimar desde lo respondido | Escenario C; A-02.3 PASO 5 |
| **P6 — cortes/niveles** | El score no se convierte en APROBADO/REPROBADO, nivel, porcentaje de "idoneidad" ni nada similar sin una fase futura específica | Regla general anti-invención numérica |

## 3. Reglas positivas (KSC-1..KSC-5)

1. **KSC-1**: el scoring es **determinista y reproducible**: dada la misma
   administración (respuestas + versión de items + claves + scoringVersion),
   cualquier ejecución produce el mismo resultado. El `scoringVersion` queda
   registrado en el resultado (PASO 15).
2. **KSC-2**: el set puntuable de una administración es **el set publicado**
   para esa `assessmentVersion`. Si el set administrado y el publicado
   difieren (items suspendidos a mitad, items no puntuables), la
   administración **no es scoreable** → INSUFFICIENT (K-CA-3) — no se
   improvisa un denominador nuevo.
3. **KSC-3**: peso uniforme: 1 acierto por item puntuable válido. Sin pesos
   ni ponderaciones por dominio en el score. (La cobertura por dominio se
   reporta como **diagnóstico descriptivo**, nunca como score compuesto.)
4. **KSC-4**: el score solo se calcula cuando la administración cumple
   K1–K6 (respuesta completa, sin anomalías, instrumento con identidad y
   versión, items con clave). En cualquier otro caso: INSUFFICIENT con
   reasonCode (PASO 12).
5. **KSC-5**: el score es **descriptivo de dominio declarativo** — "aciertos
   X/Y sobre el contenido definido". Prohibido leerlo como capacidad general,
   inteligencia, desempeño o predicción (K-DEF-3; A-02.5 §5.5).

## 4. Ejemplo conceptual (SOLO EJEMPLO — NO PRODUCTIVO)

Instrumento EJEMPLO con set publicado de 10 items, todos puntuables:

```
Administración completa, sin anomalías:
  aciertos = 7   →   score = 7/10 (CORRECT_OVER_TOTAL)  · status VALID*  (*si K1–K6 y K-VAL)

Mismo instrumento, 1 item sin clave (missing correctAnswer):
  → NO score 7/9, NO 0, NO prorrateo → status INSUFFICIENT (QUALITY_FAIL)
  → validItems=9, invalidItems=1, correctItems=7 (diagnóstico crudo),
    score = null
```

El ejemplo muestra la regla central: **el diagnóstico se conserva, el score
no se fabrica**.

## 5. Estado de implementación

Nada de lo anterior está implementado y **no debe implementarse en A-03.1**.
El scoring existente de EvaluHR (para registros históricos con clave) queda
intacto; este documento define el modelo conceptual al que deberá sujetarse
cualquier implementación futura autorizada.
