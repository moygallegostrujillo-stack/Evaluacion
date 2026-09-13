# EVALUHR — A-06.11 · 04 · PROBE LEGAL PACKAGE (PASO 4)

## 0. Estatus y provenance

- **ESTATUS GLOBAL: DRAFT — NO PRODUCTIVO.** Ningún probe está ACTIVE.
- Contador preservado del registro de auditoría (A-06.5/A-06.8): **26 probes** (24 PUBLICABLE / 2 CONDICIONAL).
- **PROVENANCE**: textos DRAFT v2 CONSOLIDADO bajo reglas de A-06.3 `06-probes.md` (predefinidos, uno a la vez, neutrales, no coactivos, no discriminatorios). El banco fuente A-06.5 no está materializado en disco (ver 01); el abogado dictamina sobre estos textos tal como constan aquí.
- Composición declarada del banco de 26: UNI 8 + SVC-001 4 + SVC-002 4 + COL-001 4 + ORG-001 3 + ORG-002 3 = **26**.

## 1. Probes universales (8) — PROBE-UNI-001..008 (texto verificado en A-06.3 `06-probes.md`)

| probeId | Texto | purpose | risk | privacy | bias | legalStatus | requiredChange |
|---|---|---|---|---|---|---|---|
| PROBE-UNI-001 | "¿Qué hiciste tú específicamente?" | Forzar Action propia ("hicimos" → "hice") | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-UNI-002 | "¿Cuál fue tu decisión?" | Forzar Action (decisión) | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-UNI-003 | "¿Qué ocurrió después?" | Forzar Result | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-UNI-004 ⚠ | "¿Qué aprendiste?" | Cierre reflexivo (complementario) | MEDIO-BAJO: puede elicitar autorrevelación no laboral | **CONDICIONAL** | Ver §4 | **CONDITIONAL** (registro A-06.8) | Uso opcional acotado; la respuesta NO se usa como evidencia de competencia; contenido sensible → NO CONSERVAR; validar en dictamen |
| PROBE-UNI-005 | "¿Puedes darme un ejemplo específico de una vez que...?" | Convertir hipotético/general en pasado concreto | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-UNI-006 | "¿Cuándo fue eso? ¿En qué puesto?" | Forzar Situation | BAJO | BAJO: no indagar empleadores por nombre más allá de lo funcional | BAJO | PUBLICABLE | — |
| PROBE-UNI-007 | "¿Qué pensaste en ese momento?" | Contexto del razonamiento | BAJO | **MEDIO**: puede derivar a vida privada; A-06.3 lo marca "cuidado: no invadir privacidad" | BAJO | PUBLICABLE CON LÍMITE DE GUÍA | Nota de guía: acotar a pensamiento relativo a la situación laboral narrada; aplicar UNINVITED_DISCLOSURE si hay desviación |
| PROBE-UNI-008 | "¿Cómo terminó la situación?" | Forzar Result/cierre | BAJO | BAJO | BAJO | PUBLICABLE | — |

## 2. Probes COMP-SVC-001 Servicio al cliente (4) — texto verificado en A-06.3 `06-probes.md`

| probeId | Texto | purpose | risk | privacy | bias | legalStatus | requiredChange |
|---|---|---|---|---|---|---|---|
| PROBE-SVC-001-A | "¿Cómo supiste qué necesitaba el cliente?" | Indicador escucha/clarificación | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-SVC-001-B | "¿Qué le dijiste exactamente?" | Action verbal concreta | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-SVC-001-C | "¿Cómo reaccionó el cliente?" | Result intermedio | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-SVC-001-D | "¿Hiciste algo después para asegurar que quedara satisfecho?" | Seguimiento post-resultado | BAJO | BAJO | BAJO | PUBLICABLE | — |

## 3. Probes COMP-SVC-002 Manejo de quejas (4) — DRAFT v2 consolidado

| probeId | Texto | purpose | risk | privacy | bias | legalStatus | requiredChange |
|---|---|---|---|---|---|---|---|
| PROBE-SVC-002-A | "¿Cómo supiste qué era lo justo en ese caso?" | Criterio de resolución | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-SVC-002-B | "¿Qué le dijiste exactamente al cliente?" | Action verbal | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-SVC-002-C | "¿Qué hiciste tú para resolverlo?" | Action propia vs equipo | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-SVC-002-D | "¿Escalaste el caso a alguien más? ¿Qué pasó?" | Result + indicador de escala (IND-SVC-002-D) | BAJO | BAJO: el tercero se registra por función, sin datos personales | BAJO | PUBLICABLE | — |

## 4. Probes COMP-COL-001 Trabajo en equipo (4)

| probeId | Texto | purpose | risk | privacy | bias | legalStatus | requiredChange |
|---|---|---|---|---|---|---|---|
| PROBE-COL-001-A | "¿Qué hiciste tú para coordinar con tu compañero?" | Action propia de coordinación | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-COL-001-B | "¿Cómo le pediste ayuda?" | Action de solicitud de apoyo | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-COL-001-C | "¿Reconociste la contribución del otro? ¿Cómo?" | Reconocimiento del otro | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-COL-001-D ⚠ | "¿Qué pasó con la coordinación del equipo después?" | Result colectivo posterior | MEDIO: puede arrastrar narrativa de conflictos interpersonales | **MEDIO**: nombres/situaciones de terceros, chismes de equipo, datos no laborales | BAJO | **CONDITIONAL** (registro A-06.8; añadido en expansión A-06.5) | (1) Nota de guía: solo resultados operativos del trabajo conjunto; (2) prohibido registrar identificadores o datos personales de terceros; (3) aplicar UNINVITED_DISCLOSURE si hay desviación; (4) validar en dictamen |

## 5. Probes COMP-ORG-001 Organización del trabajo (3) — texto verificado en A-06.3 `06-probes.md`

| probeId | Texto | purpose | risk | privacy | bias | legalStatus | requiredChange |
|---|---|---|---|---|---|---|---|
| PROBE-ORG-001-A | "¿Cómo decidiste qué hacer primero?" | Método de priorización | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-ORG-001-B | "¿Tuviste que ajustar tu plan? ¿Cómo?" | Ajuste de plan | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-ORG-001-C | "¿Cómo llevaste el seguimiento?" | Seguimiento/verificación | BAJO | BAJO | BAJO | PUBLICABLE | — |

## 6. Probes COMP-ORG-002 Gestión del tiempo (3) — DRAFT v2 consolidado

| probeId | Texto | purpose | risk | privacy | bias | legalStatus | requiredChange |
|---|---|---|---|---|---|---|---|
| PROBE-ORG-002-A | "¿Cómo decidiste qué atención primero?" | Criterio de distribución del tiempo | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-ORG-002-B | "¿Qué tarea pospusiste y por qué?" | Criterio de postergación | BAJO | BAJO | BAJO | PUBLICABLE | — |
| PROBE-ORG-002-C | "¿Cumpliste todo lo previsto? ¿Qué quedó pendiente?" | Result vs plan | BAJO | BAJO | BAJO | PUBLICABLE | — |

## 7. Registro consolidado (26 probes)

| Familia | Probes | PUBLICABLE | CONDITIONAL |
|---|---|---|---|
| UNI (universal) | 8 | 7 | 1 (PROBE-UNI-004) |
| SVC-001 | 4 | 4 | 0 |
| SVC-002 | 4 | 4 | 0 |
| COL-001 | 4 | 3 | 1 (PROBE-COL-001-D) |
| ORG-001 | 3 | 3 | 0 |
| ORG-002 | 3 | 3 | 0 |
| **Total** | **26** | **24** | **2** |

**Contador: 26 probes · 24 PUBLICABLE · 2 CONDITIONAL (PROBE-UNI-004, PROBE-COL-001-D) · 0 ACTIVE.**

## 8. Prohibiciones estructurales (heredadas de A-06.3 `06-probes.md` §7)

Probes prohibidos (jamás incluir): sugerencia de respuesta ("¿no crees que deberías haber…?"); estado civil; edad; embarazo; religión; y todo atributo protegido del catálogo de A-06.3 `13-bias.md` §2.

## 9. Reglas de uso que el dictamen debe confirmar

1. Solo probes del banco aprobado; el entrevistador no improvisa.
2. Uno a la vez; no coaccionar: si el candidato no puede recordar → INSUFFICIENT, no presión.
3. Los 2 CONDITIONAL requieren resolución legal + nota de guía antes de cualquier uso.
4. Todo contenido sensible que emerja (con cualquier probe) → protocolo UNINVITED_DISCLOSURE (07) y NO CONSERVAR contenido.
