# EVALUHR — A-06.10 — 05 · Evidencia y Clasificación (PASO 8)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Cada respuesta se registró con el mínimo necesario para revisar la evidencia y se clasificó en
> tipo y estado. Los datos por fila: `field-pilot-results.csv` (60 instancias).

## 1. Diccionario de tipos y estados aplicado

| Tipo de respuesta | Definición operativa | Estado(s) esperado(s) |
|---|---|---|
| CONCRETE_BEHAVIOR | Relato de conducta laboral propia en pasado, con contexto y acción verificables | VALID (completo) · LIMITED (Action parcial) · INSUFFICIENT (sin Action propia) · INVALID (contiene revelación involuntaria) · PENDING_REVIEW (solo resultado externo, CAL-21) |
| HYPOTHETICAL | "Yo haría…" — condicional o futuro | LIMITED como máximo (regla H-2), tras redirección con UNI-005 |
| GENERAL_CLAIM | Afirmación de rasgo sin situación ("soy bueno organizando") | INSUFFICIENT (CAL-24/25) |
| NO_INFORMATION | No aporta nada evaluable ("no me ha pasado") | INSUFFICIENT (en este piloto se consolida el estado NO_EVIDENCE de A-06.5 dentro de INSUFFICIENT — único estado disponible según PASO 8; mapeo documentado) |
| CONTRADICTION | Inconsistencia con CV sintético u otro material del propio relato | PENDING_REVIEW (protocolo C-1..C-7; requiere consulta fuera del alcance del piloto) |

| Estado | Definición breve |
|---|---|
| VALID | Evidencia conductual propia, completa y verificable (elegible SUPPORTED/STRONG según rúbrica v2 — sin scoring) |
| LIMITED | Evidencia parcial (Action incompleta) o hipotética redirigida |
| INSUFFICIENT | Sin Action propia verificable, vaga o inexistente |
| PENDING_REVIEW | Requiere información adicional (conflicto con CV, resultado externo) — no se resuelve dentro del piloto |
| INVALID | Contenido no utilizable (aquí: respuesta con revelación involuntaria de atributo protegido, protocolo 05) |

## 2. Distribución observada (60 instancias)

### Por tipo de respuesta

| Tipo | Casos | % |
|---|---|---|
| CONCRETE_BEHAVIOR | 38 | 63.3% |
| HYPOTHETICAL | 9 | 15.0% |
| GENERAL_CLAIM | 7 | 11.7% |
| NO_INFORMATION | 4 | 6.7% |
| CONTRADICTION | 2 | 3.3% |

### Por estado de evidencia

| Estado | Casos | % | Nota |
|---|---|---|---|
| VALID | 21 | 35.0% | patrones A/J |
| LIMITED | 20 | 33.3% | patrones C/G + H-2 |
| INSUFFICIENT | 13 | 21.7% | patrones B/D/I — **INSUFFICIENT ≠ 0 ✔ (criterio PASO 29)** |
| PENDING_REVIEW | 4 | 6.7% | patrones E/F — permanecen pendientes (correcto) |
| INVALID | 2 | 3.3% | revelaciones involuntarias contenidas |

## 3. Reglas aplicadas durante la revisión (rúbrica v2)

| Regla | Aplicaciones | Resultado |
|---|---|---|
| RM-1 (mapeo Action→indicador) | 60/60 instancias (selección de indicador primario) | Resolvió DIS-03 y DIS-05 |
| R1–R4 (Action) | 24 instancias COL/ORG/D | D→INSUFFICIENT correcto (3 casos COL-001) |
| H-1..H-6 (hipotéticos) | 9 instancias | Todas ≤ LIMITED; UNI-005 en 9/9 |
| C-1..C-7 (conflicto) | 2 instancias F | Ambas → PENDING_REVIEW |
| CAL-21 (resultado sin conducta) | 2 instancias E | Ambas → PENDING_REVIEW |
| CAL-24/25/26 (vagas) | 7 instancias B | Todas → INSUFFICIENT |
| Protocolo 05 | 2 instancias H | Contención íntegra; INVALID; flag sin contenido |

## 4. Calidad de la evidencia por pregunta

| Pregunta | VALID | LIMITED | INSUFF | PENDING | INVALID | Lectura |
|---|---|---|---|---|---|---|
| Q-MES-SVC-001 | 3 | 2 | 1 | 0 | 0 | La guía discrimina bien los tres niveles principales |
| Q-MES-SVC-002 | 2 | 1 | 2 | 1 | 0 | Buena; E y B detectados correctamente |
| Q-MES-COL-001 | 3 | 2 | 1 | 0 | 0 | D detectado con stop rule |
| Q-MES-ORG-001 | 2 | 2 | 1 | 1 | 0 | Buena; C-1 funcionó |
| Q-MES-TRV-002 | 1 | 2 | 2 | 0 | 1 | La pregunta con más fricción (protocolo 05 activo) |
| Q-VEN-SVC-001 | 3 | 2 | 1 | 0 | 0 | Espejo de SVC-001; consistente |
| Q-VEN-SVC-002 | 2 | 1 | 2 | 1 | 0 | Consistente con su espejo MESERO |
| Q-VEN-COL-001 | 2 | 3 | 1 | 0 | 0 | Depende de PROBE-COL-001-D (ver 14) |
| Q-VEN-ORG-001 | 2 | 2 | 1 | 1 | 0 | Consistente con su espejo |
| Q-VEN-TRV-002 | 1 | 3 | 1 | 0 | 1 | Espejo de TRV-002 MESERO |

La simetría entre pares espejo (SVC-001/SVC-002/COL/ORG/TRV) es un indicador operativo de
consistencia del instrumento, **no** un coeficiente de validez.

## 5. Qué NO demuestra esta sección

- Que la evidencia recogida prediga desempeño (no hay criterio, seguimiento ni scoring).
- Que los estados VALID/STRONG correspondan a competencia real (todo es sintético).
- Nada sobre candidatos reales: **0 participantes reales**.
