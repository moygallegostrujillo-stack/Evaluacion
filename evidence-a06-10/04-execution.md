# EVALUHR — A-06.10 — 04 · Ejecución del Piloto (PASOS 6, 7 y 16)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Escenarios: únicamente **MESERO** y **VENDEDOR**, marcados **PILOT / NON-PRODUCTIVE**. Los criterios
> usados NO representan perfiles reales universales de esos puestos: son instrumentos metodológicos
> DRAFT derivados del análisis de trabajo de A-06.1.

## 1. Estructura de sesión (PASO 7) — aplicada sin improvisación

Cada sesión siguió exactamente esta secuencia (sin desviaciones de contenido):

```
INTRODUCCIÓN → INFORMACIÓN DEL PILOTO → CONSENTIMIENTO → BDI PRIMARY (5 preguntas)
→ PROBES (solo banco cerrado) → CIERRE → REVISIÓN
```

| Fase | Contenido | Tiempo de referencia |
|---|---|---|
| INTRODUCCIÓN | Presentación del formato, rol de la IA, derecho a pausar/retirar | ~2 min |
| INFORMACIÓN DEL PILOTO | Naturaleza no productiva, datos mínimos, sin consecuencias, destino de registros | ~2.5 min |
| CONSENTIMIENTO | Flujo `PILOT-SIM-CONSENT-v1` (recorrido del documento de A-06.9 05-consent-draft) | ~2.5–3.5 min |
| BDI PRIMARY | 5 preguntas guía DRAFT v1.0 del puesto, en orden fijo, misma redacción en todas las sesiones | 13.9–28.6 min |
| PROBES | Solo banco cerrado de 26 probes; máx 3 por pregunta; uno a la vez; stop rules activas | incluido arriba |
| CIERRE | Pregunta de cierre con PROBE-UNI-004 (condicionada; respuesta NUNCA es evidencia) | ~1.3–2.2 min |
| REVISIÓN | Doble revisión ciega (REV-01, REV-02) fuera de sesión | ver 06-interrater.md |

Desviaciones registradas: **0 de contenido**; 2 desviaciones operativas menores (INC-PIL-001 orden
de probes; INC-PIL-007 tono percibido de un probe) — ambas corregidas en sesión y documentadas.

## 2. Guía aplicada por puesto (PASO 6)

| Puesto | Preguntas (orden fijo) | Sesiones | Instancias |
|---|---|---|---|
| MESERO | Q-MES-SVC-001 → Q-MES-SVC-002 → Q-MES-COL-001 → Q-MES-ORG-001 → Q-MES-TRV-002 | S-PIL-01..06 | 30 |
| VENDEDOR | Q-VEN-SVC-001 → Q-VEN-SVC-002 → Q-VEN-COL-001 → Q-VEN-ORG-001 → Q-VEN-TRV-002 | S-PIL-07..12 | 30 |

Guía congelada en versión `Question-v1.0` (con refinamientos operativos de A-06.7 registrados en
`question-refinement.csv`): misma redacción en las 12 sesiones; **0 improvisación de preguntas**.

## 3. Uso de probes — cobertura completa del banco (26/26)

Regla aplicada: solo probes del banco; máx 3 por instancia (el cierre con UNI-004 es fase aparte);
uno a la vez; neutrales; stop rule cuando no emerge Action propia.

| Probe | Usos | Probe | Usos | Probe | Usos |
|---|---|---|---|---|---|
| PROBE-UNI-001 | 35 | PROBE-UNI-006 | 2 (acotado S/T) | PROBE-SVC-002-A | 6 |
| PROBE-UNI-002 | 9 | PROBE-UNI-007 | 4 | PROBE-SVC-002-B | 4 |
| PROBE-UNI-003 | 16 | PROBE-UNI-008 | 11 | PROBE-SVC-002-C | 5 |
| PROBE-UNI-004 (cierre) | 12 (máx 1/sesión) | PROBE-SVC-001-A | 6 | PROBE-SVC-002-D | 4 |
| PROBE-UNI-005 (redirección) | 9 | PROBE-SVC-001-B | 4 | PROBE-COL-001-A | 6 |
| PROBE-ORG-001-A | 6 | PROBE-SVC-001-C | 5 | PROBE-COL-001-B | 4 |
| PROBE-ORG-001-B | 4 | PROBE-SVC-001-D | 3 | PROBE-COL-001-C | 3 |
| PROBE-ORG-001-C | 3 | PROBE-TRV-002-A | 6 | PROBE-COL-001-D | **3** |
| PROBE-TRV-002-B | 5 | PROBE-TRV-002-C | 4 | — | — |

Total: 179 usos en 60 instancias (promedio 2.98 por instancia, ≤3 en todas) + 12 cierres con
UNI-004 (fase de cierre, no cuenta contra el máximo). **Cobertura: 26/26 probes usados al menos
una vez.**

Notas de uso:
- **PROBE-COL-001-D** (CONDICIONAL, re-piloto exigido por A-06.7): 3 usos — S-PIL-06 (stop rule →
  INSUFFICIENT), S-PIL-07 (éxito → LIMITED con Action propia parcial), S-PIL-09 (stop rule →
  INSUFFICIENT). Detalle y decisión en 14-probe-decisions.md.
- **PROBE-UNI-004** (CONDICIONAL): usado solo en cierre, máx 1 por sesión, respuesta jamás tratada
  como evidencia. Cumplimiento CU-1..CU-6: 12/12 sesiones.
- **PROBE-UNI-006**: 2 usos, acotado a situación/tiempo estrictos (sin exploración de periodos personales).

## 4. Trazabilidad por caso (PASO 16) — cadena completa

Cada instancia evaluada es reconstruible con la cadena exacta exigida:

```
participantId → jobExample → competency → indicator → questionVersion → probeVersion
→ response → evidenceState → reviewer → reviewVersion
```

| Eslabón | Dónde se registra | Valor |
|---|---|---|
| participantId | 02-participants.md + CSV `sessionId` implícito | P-SIM-01..12 |
| jobExample | CSV `jobExample` | MESERO / VENDEDOR |
| competency / indicator | CSV `competencyId` / `indicatorId` | COMP-* / IND-* (indicador primario por RM-1) |
| questionVersion | CSV + guía congelada | Question-v1.0 (+ refinamientos operativos A-06.7) |
| probeVersion | plan de probes A-06.7 + 14-probe-decisions.md | probe-set v1.0 (COL-001-D v1.0-DRAFT) |
| response | notas de sesión (relato sintético STAR, datos mínimos) | patrón A–J asignado |
| evidenceState | CSV `evidenceState` | VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID |
| reviewer | CSV `reviewerA` / `reviewerB` | REV-01 / REV-02 (ciegos) |
| reviewVersion | rúbrica aplicada | RUBRIC-QUAL-v2-DRAFT + reglas RM-1, R1–R4, H-1..H-6, C-1..C-7 |

**No se almacenaron datos innecesarios**: sin grabaciones ni transcripciones (V1 sin audio por
diseño), sin contenido de revelaciones involuntarias, sin atributos personales, sin datos de
contacto. Los relatos sintéticos se conservan como notas mínimas de patrón (A–J + fragmento
ancla), suficientes para reconstruir la revisión sin almacenar material sobrante.

## 5. Registro de respuestas (PASO 8)

Cada respuesta se clasificó en tipo y estado (mapeo documentado en 05-evidence.md). La revisión
doble ciega y la calibración se documentan en 06/07. Los datos íntegros por fila están en
`field-pilot-results.csv` (60 filas).
