# EVALUHR — A-02.2 · PASO 11
# MISSING DATA — AUSENCIA DE EVIDENCIA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Regla de oro (mandatoria)

> **NO convertir ausencia de evidencia en puntuación cero.**
>
> **INSUFFICIENT ≠ 0.**

La ausencia de evidencia **no dice nada** sobre la persona. Un "0" dice
"resultado nulo medido". Son cosas distintas; confundirlas atribuye a la
persona un dato falso (el 0) y contamina cualquier interpretación futura.

---

## 2. Los cuatro casos del encargo

### 2.1 Falta un instrumento (no existe o no está asignado al criterio)
- Estado: no hay resultado de instrumento ni registro de evidencia del
  criterio.
- Tratamiento: el criterio se declara **"Información insuficiente para
  evaluar este criterio."** con `reasonCode=NOT_ADMINISTERED` (si existe el
  instrumento pero no se aplicó) o `NO_METHOD` (si no existe método aprobado).
- Prohibido: sustituir con evidencia de otra categoría; inferir del puesto;
  "prestar" resultados de otros candidatos/puestos.

### 2.2 Una sección no fue contestada (administración parcial)
- Estado: el instrumento se aplicó pero quedó incompleto (p. ej., factor del
  IPIP con ítems sin responder; sección de conocimientos a medio responder).
- Tratamiento: `quality=INSUFFICIENT`, `reasonCode=PARTIAL_RESPONSE` para el
  constructo afectado; el resto de constructos completos conserva su calidad
  propia (la incompletud es por constructo, no necesariamente por registro
  completo).
- Prohibido: prorratear, imputar, promediar con lo respondido, calcular "con
  lo que hay".

### 2.3 El instrumento falla (error técnico)
- Estado: falla de sistema, sesión corrupta, doble envío, error de
  persistencia.
- Tratamiento: `quality=INSUFFICIENT`, `reasonCode=TECH_FAILURE`; se conserva
  el registro de la falla (audit trail); el criterio queda sin lectura.
- Prohibido: reciclar respuestas parciales "como si nada"; repetir
  automáticamente sin documentar la falla; culpar a la persona (el motivo
  queda registrado como técnico).

### 2.4 No existe evidencia suficiente (agregado)
- Estado: con lo disponible, el criterio no alcanza lectura válida (por
  combinación de calidades, revisión pendiente o conflicto abierto).
- Tratamiento: salida "Información insuficiente para evaluar este criterio."
  (PASO 15); visible para RH como área por completar o revisar.

---

## 3. Casos adicionales definidos para completitud

| Caso | reasonCode | Tratamiento |
|---|---|---|
| Persona declina responder (retiro explícito) | `DECLINED` | INSUFFICIENT; se respeta la decisión; se registra fecha/motivo |
| Evidencia declarada sin verificar | — | No es "missing": es LOW con revisión; pero el criterio puede quedar sin lectura si la metodología exige verificación (fase futura) |
| Registro INVALIDATED por gobernanza | `QUALITY_FAIL` | El criterio vuelve a estado sin evidencia válida |
| Criterio nuevo sin evaluaciones históricas | `NOT_ADMINISTERED` | Nada retroactivo: los históricos no se "repuntan" (herencia A-01.3) |

---

## 4. Diferencia explícita-abstención

- **Contestado explícitamente como "No" / "Ninguna"** (opción elegida) = dato
  capturado (participa del scoring normal del instrumento si procede).
- **Sin respuesta** (campo vacío, abandono, timeout) = ausencia →
  `PARTIAL_RESPONSE`/`DECLINED` según el caso.
- El sistema debe poder distinguir ambos en el registro (diseño futuro); hoy
  queda documentado como requisito del modelo.

---

## 5. Prohibiciones del tratamiento de ausencia

1. ❌ Imputar valores (media, moda, 0, "neutro").
2. ❌ Prorratear puntajes sobre lo respondido.
3. ❌ Tratar INSUFFICIENT como 0 en cualquier cálculo presente o futuro (el
   futuro nivel de ajuste también hereda esta regla).
4. ❌ Usar la ausencia como señal negativa ("no contestó = oculta algo").
5. ❌ Ocultar la ausencia: la salida siempre declara "Información insuficiente
   para evaluar este criterio." o "Sin evidencia disponible" (lenguaje
   permitido A-02.1).
6. ❌ Que la IA "rellene" la ausencia con estimaciones (PASO 12).
