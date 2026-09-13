# EVALUHR — A-02.1 · PASO 9
# "NIVEL DE AJUSTE RESPECTO DE LOS CRITERIOS DEFINIDOS PARA EL PUESTO"
# (DISEÑO CONCEPTUAL — NO CÁLCULO, NO FÓRMULA, NO PESOS)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **El nivel de ajuste NO se calcula en
> A-02.1.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: CONCEPTO FUTURO (no implementado)

---

## 1. Definición conceptual (fija)

> El **"Nivel de ajuste respecto de los criterios definidos para el puesto"**
> es una **medida compuesta de correspondencia entre la evidencia obtenida y
> los criterios previamente definidos para el puesto**.

Descomposición de la definición:

| Palabra de la definición | Compromiso que implica |
|---|---|
| **medida compuesta** | Se construye a partir de más de un criterio/evidencia; su forma de composición se definirá y aprobará DESPUÉS, nunca implícitamente |
| **correspondencia** | Compara evidencia vs. criterio; no mide "calidad de la persona" |
| **evidencia obtenida** | Resultados concretos, con instrumento y versión registrados |
| **criterios previamente definidos** | Solo criterios aprobados ANTES de la evaluación (prohibido ajustar criterios "post hoc" para que encajen) |
| **para el puesto** | Anclada a un puesto con registro vigente (PASO 1) |

---

## 2. Lo que este documento NO hace (prohibiciones estructurales)

- **NO calcula** ningún nivel de ajuste.
- **NO define fórmula** (ni aritmética, ni lógica condicional, ni orden de
  comparación).
- **NO asigna pesos** a categorías, criterios o instrumentos.
- **NO usa el Big Five como sustituto del criterio laboral** (un rasgo no es
  un criterio; ver `04-personality-use-rules.md`).
- **NO define escalas, rangos ni etiquetas de salida** (eso también es
  fórmula en sentido amplio).
- **NO determina** qué candidatos "pasan" o "no pasan".

---

## 3. Condiciones previas para que el concepto pueda diseñarse algún día

El diseño futuro (otra fase, con autorización) requerirá que existan:

1. **Criterios aprobados y vigentes** por puesto (PASO 3), con categorías
   completas donde aplique.
2. **Evidencia disponible y confiable** para los criterios que participen
   (nota: la evidencia de conocimientos de puestos nuevos tiene una reserva
   documentada; ver `05-knowledge-criteria.md` §6).
3. **Regla de correspondencia por criterio** (cómo se juzga "corresponde /
   parcialmente / no corresponde" para cada tipo de evidencia) — documentada
   y aprobada.
4. **Regla de composición** (cómo se agregan correspondencias — pesos,
   mínimos, exclusiones) — documentada y aprobada.
5. **Decisión sobre participación de cada categoría** (A–E); por ejemplo, si
   la evidencia de integridad (sin cierre metodológico, PASO 7) participa
   como información contextual y no como criterio ponderado.
6. **Validación de lenguaje y presentación** contra
   `output-language-matrix.md`.
7. **Revisión humana obligatoria** integrada al flujo (PASO 11).

Mientras 1–7 no estén completos, el nivel de ajuste permanece como **concepto
documentado sin implementación**.

---

## 4. Principios de diseño que heredará (cuando se diseñe)

1. **Trazabilidad completa**: todo componente del nivel de ajuste rastreable
   a criterio → requisito → evidencia → instrumento+versión.
2. **No sustitución de constructos**: la composición nunca sustituye un
   criterio de categoría A/C por evidencia de categoría D.
3. **Transparencia**: la persona evaluada y RH pueden entender qué compone el
   nivel de ajuste.
4. **No exclusividad**: el nivel de ajuste es insumo de revisión humana; la
   empresa decide (PASO 11).
5. **Versionado**: toda salida registra versión de criterios, reglas e
   instrumentos; resultados históricos no se reinterpretan con reglas nuevas
   (coherente con `10-version-control.md` de A-01.3).
6. **Sin datos que no existan**: si falta evidencia de un criterio, se
   reporta como "sin evidencia", no como "no cumple".

---

## 5. Declaración de estado

> A la fecha (2026-09-09), el "Nivel de ajuste respecto de los criterios
> definidos para el puesto" es **exclusivamente un concepto documentado**.
> No existe fórmula, ni pesos, ni cálculo, ni salida asociada en ningún
> componente de EvaluHR. Cualquier uso del término antes de su diseño
> aprobado queda sujeto a la matriz de lenguaje (`output-language-matrix.md`):
> solo como descripción conceptual del enfoque del producto, nunca como
> función existente.
