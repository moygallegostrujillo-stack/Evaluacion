# EVALUHR — A-06.10 — 13 · Decisiones por Pregunta (PASOS 19, 20 y 27)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Cada pregunta termina como **KEEP / REVISE / REJECT**. **Ninguna se convierte en ACTIVE.**
> Las decisiones NO modifican el catálogo vigente: los cambios quedan como proposiciones para el
> siguiente ciclo documental. Matriz: `pilot-question-decision.csv` (10 filas).

## 1. Resumen de decisiones

| Decisión | Cantidad | Preguntas |
|---|---|---|
| **KEEP** | 7 | Q-MES-SVC-001 · Q-MES-SVC-002 · Q-MES-COL-001 · Q-MES-ORG-001 · Q-VEN-SVC-001 · Q-VEN-SVC-002 · Q-VEN-ORG-001 |
| **REVISE** | 3 | Q-MES-TRV-002 · Q-VEN-COL-001 · Q-VEN-TRV-002 |
| **REJECT** | 0 | — |
| **ACTIVE** | **0** | — (prohibición estructural) |

## 2. Fundamento por pregunta

### KEEP (7)

| Pregunta | Por qué KEEP en el piloto | Condiciones que arrastre |
|---|---|---|
| Q-MES-SVC-001 | Operable, clara, probes eficaces; rúbrica v2 discriminó niveles | Ninguna nueva |
| Q-MES-SVC-002 | Divergencia histórica M-G no se reprodujo tras RM-1 | Ninguna nueva |
| Q-MES-COL-001 | Coordinación emerge; stop rule funcionó con COL-001-D | Condición del probe (ver 14) |
| Q-MES-ORG-001 | Estable; conflicto CV manejado por C-1 | Ninguna nueva |
| Q-VEN-SVC-001 | Espejo consistente de SVC-001 | Ninguna nueva |
| Q-VEN-SVC-002 | Estable; CAL-21 funcionó; IA MISSING_INFO útil como AI_DRAFT | Ninguna nueva |
| Q-VEN-ORG-001 | Estable; DIS-05 resuelta con RM-1 | Ninguna nueva |

### REVISE (3)

| Pregunta | Hallazgo del piloto | Cambio requerido (proposición, no aplicada) | ¿Por qué no KEEP? |
|---|---|---|---|
| Q-MES-TRV-002 | Revelación involuntaria simulada contenida por protocolo 05 — funcionó, pero **depende de entrenamiento real** que aún no existe en producción | Mantener CONDICIONAL; entrenamiento M1/M3 real impartido Y evaluado + protocolo 05 operativo antes de cualquier uso | El control que evita el riesgo jurídico no está institucionalizado |
| Q-VEN-COL-001 | PROBE-COL-001-D funcionó mecánicamente (1 éxito, 2 stop rules correctas) pero el tono se percibió cuestionante (INC-PIL-007) | Refinar introducción no confrontativa del probe (v1.1); re-verificación en siguiente ciclo | La calidad de interacción del probe no está garantizada |
| Q-VEN-TRV-002 | Igual que Q-MES-TRV-002 (V-H) + DIS-06 resuelta con H-2 | Ídem TRV-002 + checkpoint V-H | Ídem |

### REJECT (0)

Ninguna pregunta mostró fallas que exigieran rechazo: no hubo preguntas inoperables, ambiguas de
forma irrecuperable ni que elicitaran atributos protegidos por su texto. REJECT = 0 es un
resultado observado, no una omisión.

## 3. Relación con el estado legal (A-06.8)

| Estado legal pre-piloto | Post-piloto |
|---|---|
| 8 PUBLICABLE | Los 7 KEEP conservan PUBLICABLE; Q-VEN-COL-001 conserva PUBLICABLE (su REVISE es de calidad, no de licitud) |
| 2 CONDICIONAL (Q-MES-TRV-002, Q-VEN-TRV-002) | Se mantienen CONDICIONAL; el piloto **confirma empíricamente** que la condición (protocolo 05) es necesaria y operable |

El piloto **no cambia ningún estado legal**; únicamente aporta evidencia operativa que sustenta las
condiciones ya documentadas.

## 4. Decisión global del piloto (PASO 19)

El piloto permitió operar la metodología sin fallas críticas: **PASS como pilotaje operativo**
(con 3 preguntas en REVISE y 2 aclaraciones de rúbrica propuestas). **NO existe "aprobado para
selección" como resultado del piloto** — esa categoría no existe en este proceso.
