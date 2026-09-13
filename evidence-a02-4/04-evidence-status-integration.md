# EVALUHR — A-02.4 · PASO 4
# INTEGRACIÓN DE EVIDENCE STATUS EN EL NIVEL DE AJUSTE

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: A-02.3 PASO 1 (estados VALID/LIMITED/INSUFFICIENT/INVALID/
> PENDING_REVIEW, tabla M1–M6) — aquí se define cómo cada estado afecta
> **conceptualmente** al ajuste.

---

## 1. Principio

> El nivel de ajuste solo se construye sobre **lecturas de cumplimiento
> sustentables**. El estado de la evidencia (A-02.3) determina si un criterio
> **contribuye**, **contribuye con tope**, **queda excluido** o **bloquea**
> el ajuste. Ningún estado se convierte en 0.

---

## 2. Efecto conceptual de cada estado

| Estado | Efecto en el nivel de ajuste |
|---|---|
| **VALID** | El criterio **contribuye** con su lectura de correspondencia (corr) y su calidad (Q). Único estado que sustenta cumplimiento. |
| **LIMITED** | El criterio **no contribuye como cumplimiento** (solo contexto). Su información aparece en la explicación como contexto orientativo y puede motivar áreas de revisión; nunca entra en la composición como lectura. |
| **INSUFFICIENT** | El criterio **queda excluido de la composición** (exclusión declarada con reasonCode) — o **bloquea** el ajuste si es CRITICAL (gate). Jamás entra como 0 ni como valor negativo. |
| **INVALID** | El criterio **queda sin evidencia utilizable**: se trata como no-evaluable (si era la única evidencia) y aplica el efecto de INSUFFICIENT para ese criterio. El registro invalidado permanece en trazabilidad. |
| **PENDING_REVIEW** | El criterio **no contribuye** hasta el cierre de la revisión. Si es CRITICAL → gate; si es IMPORTANT/STANDARD → exclusión temporal visible con el área de revisión abierta. |

---

## 3. INSUFFICIENT — las dos lecturas distintas que debe declarar la salida

> El mandato exige distinguir **"no evaluable"** de **"evidencia
> insuficiente"**. Ambas comparten el tratamiento (exclusión/gate, nunca 0),
> pero **no significan lo mismo** y la salida debe nombrar la diferencia.

| | **NO EVALUABLE** | **EVIDENCIA INSUFICIENTE** |
|---|---|---|
| Significado | El criterio **no pudo someterse a evaluación**: no existe método aprobado, el instrumento no se administró, hubo falla técnica o declinación | **Existe evidencia**, pero **no alcanza** la calidad/verificación/completitud que la metodología exige para leer el criterio |
| reasonCodes típicos (A-02.2 R1–R9) | `NO_METHOD`, `NOT_ADMINISTERED`, `TECH_FAILURE`, `DECLINED` | `PARTIAL_RESPONSE`, `QUALITY_FAIL` (K-INS-1, I-INT-1), R9 (calidad insuficiente para la lectura exigida), R8 (revisión pendiente como causa procedural) |
| Naturaleza | **Estructural**: depende de que exista/aplique el método | **Procedural**: depende de completar, verificar o cerrar revisión |
| Qué dice de la persona | **Nada** (ni positivo ni negativo) | **Nada** (ni positivo ni negativo) |
| Recuperación | Diseñar/aprobar método; administrar instrumento | Completar administración; verificar documento; cerrar revisión; resolver conflicto |
| Ejemplo | Competencias sin método conductual (R2) | Experiencia declarada sin verificación; conocimiento con clave de respuestas inválida (K-INS-1) |

Regla de salida: el resultado del ajuste (completo o incompleto) lista los
criterios excluidos **con su lectura específica** ("no evaluable por falta de
método aprobado" / "evidencia insuficiente: declaración sin verificar"),
jamás como un agregado indiferenciado.

---

## 4. Regla maestra aplicada al ajuste

> **INSUFFICIENT NO se convierte en 0.** En este modelo la ausencia entra por
> una de estas tres vías — y ninguna es numérica:
>
> 1. **Exclusión declarada** (criterio fuera de la composición, con causa).
> 2. **Tope de nivel** (criterio IMPORTANT con brecha: el nivel máximo
>    alcanzable queda acotado — PASO 13, valor PROPUESTA).
> 3. **Gate** (criterio CRITICAL sin lectura utilizable: el ajuste no se
>    produce; salida = resultado incompleto, PASO 6/10).
>
> Nunca: restar puntos, renormalizar para "que no se note", ni asumir el
> peor (o el mejor) escenario. La ausencia **no dice nada** sobre la persona
> (herencia literal de A-02.2 PASO 11).

Matriz operativa: `fit-state-rules.csv` (PASO 18).
