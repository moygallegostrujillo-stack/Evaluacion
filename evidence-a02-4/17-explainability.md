# EVALUHR — A-02.4 · PASO 17
# EXPLICABILIDAD DEL NIVEL DE AJUSTE

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Mandato: explicar "Nivel de ajuste: X" sin revelar fórmulas propietarias,
> detalles innecesarios ni información sensible. Explicación basada en
> **criterios + evidencia + estado**.

---

## 1. Principio

> Toda salida del nivel de ajuste debe ser **reproducible desde su
> explicación**: una persona que lea el bloque explicativo debe poder
> reconstruir por qué el nivel es X y qué cambiaría el resultado. Lo que no
> puede explicarse con criterios + evidencia + estado, **no pertenece a la
> salida**.

---

## 2. Qué contiene la explicación (bloque obligatorio)

```
NIVEL DE AJUSTE RESPECTO DE LOS CRITERIOS DEFINIDOS PARA EL PUESTO: X
  Resultado orientativo, sujeto a revisión humana. Orientación técnica,
  no decisión de contratación.

  1. CRITERIOS (por cada criterio aprobado del puesto):
     - nombre del criterio · categoría (A–E) · criticidad declarada
     - lectura de correspondencia (corresponde / parcialmente / no
       corresponde / sin lectura) — descrita en lenguaje permitido
  2. EVIDENCIA (por cada criterio con lectura):
     - instrumento + versión · fecha · calidad (HIGH/MEDIUM)
     - referencia trazable (evidenceId / criterionResultId)
  3. ESTADO:
     - criterios excluidos y por qué ("no evaluable: no existe método
       aprobado" / "evidencia insuficiente: declaración sin verificar")
     - gates activos si los hay → (en ese caso: resultado incompleto)
     - topes aplicados ("el nivel máximo es MEDIO mientras …") si los hay
     - conflictos abiertos visibles con ambas fuentes
  4. COMPLETITUD (métricas legibles, PASO 16):
     - cuántos criterios con lectura / sin evidencia / con evidencia
       insuficiente / verificados
  5. LIMITACIONES:
     - bloque fijo de limitaciones (herencia A-02.1 limitations.md)
  6. REVISIÓN HUMANA: estado PENDIENTE/REVISADO con autor y fecha.
```

---

## 3. Qué NO se revela (límites de divulgación)

| Categoría | Tratamiento |
|---|---|
| **Fórmulas propietarias** | Los parámetros internos (pesos relativos, factores de calidad, θ) **no se publican** como números; la explicación describe la **estructura** (criticidad, calidad, estado, tope) y la contribución cualitativa de cada criterio, no la aritmética interna. La salida sigue siendo reproducible porque la estructura + los estados determinan el nivel. |
| **Detalles innecesarios** | Sin jerga interna (reasonCodes se traducen a causa comprensible); sin datos de otros candidatos; sin el detalle completo de reactivos del instrumento (solo instrumento+versión+fecha); sin repetir el resultado crudo completo cuando la lectura ya lo resume con trazabilidad. |
| **Información sensible** | Sin datos personales de terceros; sin contenido de entrevistas de otros procesos; sin notas de revisión de otros candidatos; respeto del aviso de privacidad vigente (sin modificarlo). |

Regla de coherencia: lo oculto **no puede cambiar el resultado**. Si un
parámetro oculto fuera necesario para reproducir el nivel, la explicación es
insuficiente → se considera violación de explicabilidad (auditoría PASO 20).

---

## 4. Explicación bajo gate (resultado incompleto)

La explicación del resultado incompleto (PASO 10) es **más** explícita, no
menos: criterios que activan el gate, causa específica, qué falta para
poder emitir nivel, y las vías legítimas de completación. Sin nivel que
ocultar — solo un proceso por completar.

---

## 5. Explicación asistida por IA (límites)

- La IA puede **reformular** la explicación (AI-17) en lenguaje comprensible,
  citando los mismos criterios/evidencias/estados — sin añadir conclusiones,
  sin suavizar exclusiones o topes, marcada como asistida y validada por
  humanos (PASO 12).
- Prohibido: "explicaciones" que introduzcan atribuciones sobre la persona
  ("le faltó disciplina"), que conviertan el gate en crítica, o que
  sugieran decisiones.
