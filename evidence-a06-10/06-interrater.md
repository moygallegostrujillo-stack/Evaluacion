# EVALUHR — A-06.10 — 06 · Doble Revisión Ciega (PASO 9)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**

## 1. Diseño de la revisión

| Elemento | Implementación |
|---|---|
| Revisores | REV-01 y REV-02 (dos pasadas independientes; ver limitación en 17-limitations §L2) |
| Ceguera | Cada revisor evaluó **la misma respuesta** sin ver la clasificación del otro; ni REV-02 ni REV-01 vieron notas del entrevistador ni flags antes de registrar su rationale |
| Orden | REV-01 completó la pasada completa (60 respuestas) antes de que REV-02 iniciara; REV-02 trabajó en orden de sesión inverso para reducir contaminación de anclaje |
| Insumos permitidos | Respuesta (relato sintético STAR) + rúbrica RUBRIC-QUAL-v2-DRAFT + reglas RM-1/R1–R4/H/C + banco de probes usado |
| Insumos prohibidos | Clasificaciones del otro revisor · opiniones del entrevistador · patrones A–J asignados (el revisor no sabía qué patrón debía salir) |

## 2. Qué se registró por respuesta

Cada revisor registró: `evidenceState` · `rationale` (fragmento(s) de evidencia que sustentan el
estado) · `indicator` (indicador primario según RM-1) · `conflicts` (si detecta contradicción o
resultado externo) · `limitations` (qué falta para subir/bajar de estado).

## 3. Resultado agregado

| Métrica | Valor |
|---|---|
| Instancias doble-revisadas | 60/60 |
| Acuerdos directos (estado + indicador + rationale compatible) | 54 |
| Desacuerdos a calibración | 6 |
| Acuerdo operativo | **90.0%** (54/60) — medida operativa, **NO coeficiente de validez** |

### Desglose de los 6 desacuerdos

| ID | Sesión/Pregunta | Tipo | Final |
|---|---|---|---|
| DIS-01 | S-PIL-03 · Q-MES-TRV-002 | evidenceState (INVALID vs LIMITED) | INVALID |
| DIS-02 | S-PIL-04 · Q-MES-SVC-002 | evidenceState (PENDING_REVIEW vs INSUFFICIENT) | PENDING_REVIEW |
| DIS-03 | S-PIL-05 · Q-MES-ORG-001 | rationale (fragmento que contradice) | PENDING_REVIEW |
| DIS-04 | S-PIL-09 · Q-VEN-COL-001 | evidenceState (INSUFFICIENT vs LIMITED) | INSUFFICIENT |
| DIS-05 | S-PIL-10 · Q-VEN-ORG-001 | indicator (IND-ORG-001-A vs B) | PENDING_REVIEW + indicador A por RM-1 |
| DIS-06 | S-PIL-12 · Q-VEN-TRV-002 | evidenceState (LIMITED vs INSUFFICIENT) | LIMITED |

Tipos de desacuerdo: 4 evidenceState · 1 rationale · 1 indicator. Resolución completa en
07-calibration.md.

## 4. Observaciones de los revisores

1. La ceguera funcionó: en 6/60 casos los revisores llegaron a estados distintos, lo que evidencia
   que no hubo arrastre de clasificación previa.
2. REV-02 detectó el sesgo de confirmación propio en S-PIL-10 durante la comparación (INC-PIL-009) —
   la estructura de rationale obligatorio hizo visible el sesgo.
3. Ambos revisores marcaron limitaciones en 4/60 instancias con PENDING_REVIEW; ninguna se resolvió
   "por conveniencia" dentro del piloto.
