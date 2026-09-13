# EVALUHR — A-02.2 · PASO 15
# REGLAS DE INSUFICIENCIA — "Información insuficiente para evaluar este criterio."

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Complemento: PASO 3 (calidad) y PASO 11 (missing data).

---

## 1. Mensaje oficial

Cuando aplique cualquiera de las reglas R1–R9 de este catálogo, el sistema
debe producir, para el criterio afectado, el mensaje:

> **"Información insuficiente para evaluar este criterio."**

Es el único texto autorizado para este estado (lenguaje permitido, coherente
con la matriz de salidas de A-02.1). Va acompañado, cuando corresponda, de
"Sin evidencia disponible" y del `reasonCode` interno (no mostrado como
jerga, sino traducido a causa comprensible: "el instrumento no fue
aplicado", "la sección quedó sin contestar", etc.).

---

## 2. Catálogo de reglas (disparadores INSUFFICIENT)

| Regla | Disparador | reasonCode | Detalle |
|---|---|---|---|
| **R1** | El instrumento/método del criterio no fue administrado | `NOT_ADMINISTERED` | El criterio existe y tiene instrumento asignado, pero no se aplicó (persona no llegó a la sección, proceso incompleto). |
| **R2** | No existe método aprobado para el criterio | `NO_METHOD` | Casos mandatorios hoy: competencias (sin método conductual) y cualquier criterio cuyo instrumento no esté en la matriz aprobada. |
| **R3** | Administración incompleta (sección/constructo sin terminar) | `PARTIAL_RESPONSE` | Por constructo: p. ej., factor IPIP con ítems faltantes; prueba de conocimientos sin terminar. Sin prorrateo ni imputación (PASO 11). |
| **R4** | Falla técnica en la captura o el cálculo | `TECH_FAILURE` | Sesión corrupta, doble envío, error de persistencia; el incidente queda en el audit trail. |
| **R5** | Persona declina / retiro explícito | `DECLINED` | Se respeta la decisión; se registra fecha y motivo. |
| **R6** | Falta el elemento que hace interpretable al método | `QUALITY_FAIL` | **Casos mandatorios de A-02.2:** (a) conocimiento con `knowledgeScore=0` por falta de `correctAnswer` persistida (regla K-INS-1, PASO 5); (b) integridad (regla I-INT-1, PASO 7 — hasta que exista expediente suficiente). |
| **R7** | Registro invalidado por gobernanza | `QUALITY_FAIL` | El criterio vuelve a estado sin evidencia válida (PASO 16). |
| **R8** | Revisión obligatoria pendiente o conflicto abierto | — | El registro existe pero `reviewStatus=PENDING` o hay conflicto sin cierre humano (PASO 10): el criterio no puede alimentar lectura; se muestra como área de revisión. |
| **R9** | Evidencia de calidad insuficiente para el tipo de lectura exigida | — | P. ej., solo hay declaraciones (LOW) donde la metodología exige verificación: no basta para leer el criterio. |

---

## 3. Reglas de comportamiento del estado INSUFFICIENT

1. **INSUFFICIENT ≠ 0** (PASO 11): jamás participa como puntuación en ningún
   cálculo presente o futuro.
2. **No es censura ni señal negativa** sobre la persona: es un estado del
   proceso, siempre explicado con su causa.
3. **Es recuperable**: completar la administración, aplicar el instrumento,
   cerrar la revisión o resolver el conflicto saca al criterio del estado
   (con nuevos registros, append-only).
4. **Es visible**: RH ve qué criterios están insuficientes y por qué (áreas
   que requieren revisión / completación) — nunca se oculta la ausencia.
5. **Es determinista**: las reglas R1–R9 se aplican por código/reglas
   versionadas; ni IA ni opinión personal producen el estado.
6. **Es trazable**: cada INSUFFICIENT queda en el audit trail con su regla,
   versión y motivo (PASO 13).

---

## 4. Prohibiciones asociadas

- ❌ Mostrar un puntaje ("0", "sin puntos", "—") donde corresponde el mensaje
  de insuficiencia.
- ❌ Derivar del estado un juicio sobre la persona ("no completó = mal
  candidato").
- ❌ Sustituir la insuficiencia con evidencia de otra categoría o de otra
  persona.
- ❌ Presentar el estado con lenguaje prohibido ("no apto", "rechazado",
  "no califica").
- ❌ Que cualquier agregado futuro ("nivel de ajuste") trate INSUFFICIENT
  como 0 — regla heredada obligatoria para la fase de diseño de fórmula.

---

## 5. Casos mandatorios vigentes (resumen ejecutivo)

| Constructo | Estado | Regla |
|---|---|---|
| Conocimiento en puestos generados (`knowledgeScore=0` por falta de `correctAnswer`) | INSUFFICIENT obligatorio | K-INS-1 / R6 |
| Integridad (instrumento legacy sin expediente) | INSUFFICIENT obligatorio | I-INT-1 / R6 |
| Competencias (sin método conductual) | INSUFFICIENT obligatorio | R2 |
| Cualquier constructo con sección incompleta | INSUFFICIENT (por constructo) | R3 |
