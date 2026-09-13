# A-06.3 — 08 · Respuesta Hipotética (PASO 9)

## 1. Regla

> Una respuesta hipotética ("¿Qué harías si...?") **NO equivale automáticamente a evidencia conductual**.

## 2. Definición

Respuesta hipotética = el candidato describe **qué haría** en una situación futura imaginaria, en lugar de **qué hizo** en una situación pasada real.

**Ejemplo**:
> Pregunta BDI: "Cuéntame de una vez que tuviste que lidiar con un cliente enojado. ¿Qué hiciste?"
>
> Respuesta hipotética: "Si tuviera un cliente enojado, lo escucharía con calma, le pediría disculpas y le ofrecería una solución."

## 3. Clasificación

| Tipo | Clasificación | Nivel |
|---|---|---|
| Respuesta hipotética pura (sin pasado) | HYPOTHETICAL | LIMITED (no INSUFFICIENT, pero no SUPPORTED) |
| Respuesta hipotética + ejemplo pasado (tras probe) | CONDUCTA | Según calidad de la Action |

**Regla**: HYPOTHETICAL → **LIMITED**, salvo que exista otro fundamento aprobado (ejemplo pasado tras probe).

## 4. Por qué HYPOTHETICAL ≠ CONDUCTA

| Razón | Detalle |
|---|---|
| Intención ≠ conducta | La literatura (Pulakos & Schmitt 1995) muestra BD (pasado) > situacional (intención) para posiciones de mayor nivel |
| Faking | Es más fácil inventar una intención socialmente deseable que un evento pasado verificable |
| No mapea a indicadores | Los indicadores conductuales requieren Action específica; la intención no la produce |
| No produce STAR completo | HYPOTHETICAL no tiene Situation/Task reales; tiene escenario imaginado |

## 5. Manejo en la entrevista

Cuando el candidato responde hipotéticamente, el entrevistador **redirige** a pasado:

> **EJEMPLO — NO PRODUCTIVO**
>
> Candidato: "Si tuviera un cliente enojado, lo escucharía..."
>
> Entrevistador (probe PROBE-UNI-005): "¿Puedes darme un ejemplo específico de una vez que SÍ tuviste un cliente enojado? ¿Qué hiciste en esa ocasión?"

Si el candidato puede aportar un ejemplo pasado tras el probe → evaluar como CONDUCTA.
Si el candidato persiste en hipotético o no puede aportar ejemplo → HYPOTHETICAL → LIMITED (si la respuesta muestra juicio razonable) o INSUFFICIENT (si es vaga o irrelevante).

## 6. Caso especial: candidatos entry-level

Para candidatos sin experiencia laboral previa (entry-level), BDI puro puede no ser posible. En ese caso:
- Permitir preguntas situacionales (tipo SJT) como complemento.
- BDI sobre experiencias académicas, voluntariado, o proyectos.
- Clasificar como HYPOTHETICAL → LIMITED con nota.

**Regla**: HYPOTHETICAL nunca se convierte en SUPPORTED/STRONG sin conducta pasada.

## 7. Registro

```
InterviewEvidence {
  evidenceType: 'INTENCION'  // hipotético
  evidenceLevel: 'LIMITED'   // no INSUFFICIENT (si juicio razonable), no SUPPORTED
  rationale: "Respuesta hipotética; el candidato no pudo aportar ejemplo pasado. Juicio razonable pero sin conducta observable. Clasificado HYPOTHETICAL → LIMITED."
}
```

## 8. No convertir en score

HYPOTHETICAL → LIMITED es una **etiqueta cualitativa**. No se convierte en número. No se promedia con otras evidencias. Si hay conflicto (hipotético vs conducta pasada), ver `10-conflicts.md`.

## 9. Conexión con gates

El manejo de respuestas hipotéticas pasa INT-G5 (rubric) — la rúbrica debe documentar que HYPOTHETICAL → LIMITED.
