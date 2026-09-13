# EVALUHR — A-02.4 · PASO 5
# COMPENSABILIDAD ENTRE CRITERIOS

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: PASO 3 (criticidad), PASO 4 (estados), regla maestra del encargo.

---

## 1. Definición

> **Compensación** = que la correspondencia alta de un criterio reduzca, en
> el resultado final, el efecto de la brecha de otro criterio.
>
> **Compensabilidad** = propiedad del criterio (derivada de su criticidad)
> que define si otros criterios pueden compensar su brecha.

La respuesta a "¿puede compensar?" se basa **en la criticidad** — no en el
tamaño de las fortalezas, ni en el instrumento que las produce, ni en la
impresión general.

---

## 2. Tres niveles de compensabilidad (propuesta del encargo)

| Nivel | Aplica a | Regla conceptual |
|---|---|---|
| **NON-COMPENSABLE** | Criterios **CRITICAL** | La brecha (sin lectura utilizable, conflicto abierto o revisión pendiente) **no puede compensarse por nada**: activa el gate y el ajuste no se produce. La fortaleza en otros criterios es irrelevante para esta decisión. |
| **PARTIALLY_COMPENSABLE** | Criterios **IMPORTANT** | Una brecha no invalida el ajuste, pero **acota el nivel máximo** alcanzable (regla de tope, PASO 13) y queda **siempre visible** como área de revisión. La compensación es parcial: no puede producir un nivel ALTO. |
| **COMPENSABLE** | Criterios **STANDARD** | La brecha reduce la correspondencia del conjunto y genera área de completación; los demás criterios pueden sostener un nivel sin que la brecha lo bloquee — con la exclusión declarada en la explicación. |

---

## 3. El ejemplo del encargo, analizado

**"Conocimiento excelente + personalidad elevada — ¿puede compensar?"**

- **Sobre la brecha de un criterio STANDARD/IMPORTANT con evidencia VALID**
  (p. ej., otro requisito de experiencia parcialmente correspondido): el
  conocimiento excelente y las tendencias de personalidad elevadas **pueden
  aportar** al conjunto — respetando los topes de IMPORTANT y la regla de
  que la personalidad (IPIP) **no es evidencia de cumplimiento** de ningún
  criterio (A-02.3 PASO 4): solo criterios D con su lectura descriptiva
  anclada a HDC.
- **Sobre la brecha de un criterio CRITICAL**: **no puede compensar, por
  definición** (NON-COMPENSABLE). Ejemplo: si el criterio crítico de
  certificación vigente no tiene verificación, ningún "conocimiento
  excelente" ni "personalidad elevada" produce el ajuste: el sistema emite
  resultado incompleto.

**"¿Un criterio crítico sin evidencia puede ser compensado?"**

- **NO.** Es el caso exacto que la regla maestra del encargo prohíbe y que el
  PASO 15 convierte en prueba formal (anticompensación). Sin evidencia no hay
  lectura, y sin lectura no hay nada que compensar: hay un **gate**.

---

## 4. Condiciones para que exista compensación legítima (todas)

1. El criterio compensado es STANDARD (o IMPORTANT dentro de su tope).
2. El criterio que compensa tiene evidencia **VALID** con calidad HIGH/MEDIUM
   (LIMITED/LOW nunca compensa: solo contexto).
3. No hay gates activos (PASO 6).
4. La compensación **nunca cruza categorías taxonómicas** (no se sustituye un
   criterio de conocimientos con rasgos de personalidad — herencia A-02.1).
5. Toda compensación queda **explicada** en la salida (qué criterio aporta a
   qué brecha — explicabilidad PASO 17).

---

## 5. Prohibiciones

1. ❌ Compensar la brecha de un criterio CRITICAL (en ningún caso, con
   ninguna evidencia, por ningún mecanismo).
2. ❌ Compensar ausencia de evidencia con "impresión general", promedios
   ocultos o contexto LIMITED.
3. ❌ Compensar con evidencia de otra categoría taxonómica (no sustitución de
   constructos).
4. ❌ Que la IA decida compensaciones (PASO 12).
5. ❌ Ocultar la brecha compensada: la explicación siempre la lista.
