# A-06.6 — 15 · Hallazgos (PASO 22)

## 1. Clasificación

| Nivel | Significado |
|---|---|
| CRITICAL | Bloquea la activación; requiere corrección obligatoria |
| HIGH | Requiere corrección fuerte antes de activación |
| MEDIUM | Requiere ajuste |
| LOW | Mejora recomendada |
| INFO | Informativo |

## 2. Hallazgos por área

### Preguntas

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-1 | 8/10 preguntas STRONG | INFO | Las preguntas BDI produjeron evidencia diferenciable a través de los patrones A–J | Confirmar diseño |
| H-2 | 2/10 preguntas ACCEPTABLE (Q-VEN-COL-001, Q-VEN-TRV-002) | LOW | Q-VEN-COL-001: probe necesita mejora; Q-VEN-TRV-002: entrenamiento de revelación involuntaria | Mantener KEEP_FOR_REVIEW con ajustes documentados |
| H-3 | 0/10 REJECT | INFO | Ninguna pregunta falló | Confirmar diseño |

### Probes

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-4 | PROBE-UNI-004 es reflexión, no conducta | LOW | "¿Qué aprendiste?" no eleva nivel de evidencia | Documentar como complementario (cierre) |
| H-5 | Falta probe para diferenciar Action propia en colaboración | MEDIUM | En V-D, los probes existentes no extrajeron Action propia con claridad suficiente | Proponer PROBE-COL-001-D: "¿Qué hiciste tú, más allá de lo que hizo tu supervisor?" (DRAFT) |
| H-6 | 0 probes REJECT | INFO | Todos los probes funcionaron | Confirmar diseño |

### Rúbrica

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-7 | Divergencia inter-evaluador en M-G | MEDIUM | Reviewer A (LIMITED) vs Reviewer B (SUPPORTED) por interpretación de qué Action cubre qué indicador | Refinar rúbrica con ejemplos por indicador; calibración obligatoria (INTERVIEW-G9) |
| H-8 | Criterio de indicadores→nivel validado | INFO | 0 indicadores→INSUFFICIENT; 1-2→LIMITED; 3+ (1 ejemplo)→SUPPORTED; 3+ (2+ ejemplos)→STRONG | Confirmar regla |

### Sesgo

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-9 | La estructura contuvo los 6 sesgos probados | INFO | Halo/similarity/confirmation/estereotipo/info irrelevante/atributos protegidos | Confirmar diseño; entrenamiento sigue obligatorio |

### Legal

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-10 | Revelación involuntaria manejada correctamente | INFO | M-H (embarazo), V-H (religión): no registrada, no usada, conducta sí registrada | Confirmar regla A-06.4 §5 |
| H-11 | Ninguna pregunta candidata cayó en LEGAL_REVIEW | INFO | Las 10 son PUBLICABLE | Confirmar diseño |
| H-12 | INTERVIEW-G7 sigue NO EVALUADO | CRITICAL (para activación) | El piloto NO aprueba el gate legal; requiere asesoría profesional | Mantener LEGAL_REVIEW; no activar |

### Duración

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-13 | Duración simulada dentro del rango previsto | INFO | 5 competencias: 20–37 min (previsto 25–37) | Confirmar diseño |

### Trazabilidad

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-14 | Cadena completa en 20/20 casos | INFO | 0 TRACEABILITY_FAILURE | Confirmar diseño |

### IA

| # | Hallazgo | Severidad | Detalle | Acción |
|---|---|---|---|---|
| H-15 | Los 3 rechazos IA funcionaron | INFO | Inventar acción / convertir resumen / asignar STRONG → RECHAZADO | Confirmar diseño; verificar en implementación futura |

## 3. Resumen por severidad

| Severidad | Cantidad |
|---|---|
| CRITICAL | 1 (H-12: INTERVIEW-G7 sigue NO EVALUADO — bloquea activación) |
| HIGH | 0 |
| MEDIUM | 2 (H-5: probe faltante; H-7: divergencia rúbrica) |
| LOW | 3 (H-2, H-4 + notas) |
| INFO | 9 |

## 4. Conexión con decisiones

Los hallazgos alimentan `17-decision.md` (PASO 23: KEEP_FOR_REVIEW / REVISE / REJECT por pregunta).
