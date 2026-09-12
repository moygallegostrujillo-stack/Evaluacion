# A-06.6 — 07 · Estados de Evidencia (PASO 9)

## 1. Regla

Mantener: **INSUFFICIENT ≠ 0**. Los estados de evidencia se aplicaron a los 20 casos sintéticos sin convertir a puntos.

## 2. Distribución de estados en el piloto

| Estado | Casos | Cantidad |
|---|---|---|
| VALID (SUPPORTED) | M-A, V-A | 2 |
| VALID (STRONG) | M-J, V-J | 2 |
| LIMITED | M-C, M-G, M-H, V-C, V-G, V-H | 6 |
| INSUFFICIENT | M-B, M-D, V-B, V-D | 4 |
| PENDING_REVIEW | M-E, M-F, V-E, V-F | 4 |
| INVALID (parcial — revelación) | M-H, V-H (atributo) | 2 (superpuestos con LIMITED conducta) |
| NO_EVIDENCE | M-I, V-I | 2 |

**Total registros: 20 casos**, con M-H y V-H teniendo doble registro (atributo INVALID + conducta LIMITED).

## 3. Verificación INSUFFICIENT ≠ 0

| Caso INSUFFICIENT | ¿Se convirtió en 0? | ¿Se convirtió en veto? |
|---|---|---|
| M-B | ✗ NO — etiqueta cualitativa | ✗ NO |
| M-D | ✗ NO | ✗ NO |
| V-B | ✗ NO | ✗ NO |
| V-D | ✗ NO | ✗ NO |

**Verificación**: INSUFFICIENT se mantuvo como etiqueta cualitativa en todos los casos. Nunca se convirtió en número, nunca en veto automático.

## 4. Verificación HYPOTHETICAL no escala

| Caso | ¿HYPOTHETICAL escaló a SUPPORTED? |
|---|---|
| M-C | ✗ NO — se mantuvo LIMITED |
| V-C | ✗ NO — se mantuvo LIMITED |

**Verificación**: HYPOTHETICAL nunca se convirtió automáticamente en SUPPORTED.

## 5. Verificación resultado externo ≠ competencia

| Caso | Result sin Action | ¿Escaló? |
|---|---|---|
| M-E | "Aumentamos eficiencia 30%" | ✗ NO — PENDING_REVIEW |
| V-E | "Aumenté ventas 30%" | ✗ NO — PENDING_REVIEW |

**Verificación**: resultado externo sin Action nunca produjo SUPPORTED/STRONG.

## 6. Verificación NO_EVIDENCE legítimo

| Caso | Contexto | ¿Escala a algo negativo? |
|---|---|---|
| M-I | Entry-level sin experiencia | ✗ NO — NO_EVIDENCE legítimo |
| V-I | Entry-level sin experiencia | ✗ NO — NO_EVIDENCE legítimo |

**Verificación**: NO_EVIDENCE para candidatos sin experiencia es legítimo; no se penaliza (no 0, no veto). Recomendación: para entry-level, complementar con pregunta situacional (A-06.3 `02-bdi.md` §3).

## 7. Verificación INVALID para revelación involuntaria

| Caso | Revelación | Manejo |
|---|---|---|
| M-H | "soy embarazada" | NO registrado como evidencia; NO usado para decisión; conducta de adaptabilidad SÍ registrada (LIMITED) |
| V-H | mención de religión ("por mi fe no trabajo los domingos") | NO registrado; NO usado; conducta de adaptabilidad SÍ registrada (LIMITED) |

**Verificación**: la revelación involuntaria se manejó según A-06.4 `04-prohibited-data.md` §5 (no registrar, no usar, no profundizar, continuar).

## 8. Conexión con hallazgos

Estas verificaciones alimentan `15-findings.md` (PASO 22).
