# EVALUHR — A-06.10 — 02 · Participantes (PASOS 2 y 3)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Fase A ejecutada en **MODO SIMULACIÓN DOCUMENTAL**: los participantes son perfiles sintéticos
> derivados de A-06.6, operados por el equipo de auditoría siguiendo guiones. **Ninguna persona real
> fue entrevistada.** Ningún candidato real de proceso de selección participó.

## 1. Población experimental (PASO 2)

| Decisión | Valor |
|---|---|
| Fase ejecutada | **FASE A** — participantes internos / voluntarios / **simulación** (permitida por field-pilot-plan.csv fila `fase_a_internos_sinteticos`) |
| Fase B (externos voluntarios) | **NO EJECUTADA** — queda condicionada a cierre legal (G7) y a decisión post-Fase A |
| Candidatos reales | **0** — prohibición absoluta respetada |
| Origen de los perfiles | 20 casos sintéticos de A-06.6 (`02-synthetic-cases.md`): MES-1..3 y VEN-1..3 con patrones A–J |

## 2. Datos mínimos registrados por participante

Únicamente: `participantId`, `profileRef` (referencia a perfil sintético), `jobExample`, `sessionId`,
`modality = SIMULATION`, `consentFlag = PILOT-SIM-CONSENT-v1`. **No se registraron** nombres,
edades, géneros, ningún atributo protegido ni dato de contacto. Los perfiles de A-06.6 incluyen
notas como "edad real (no se pregunta)": esa información **no se reprodujo** en ningún registro
del piloto.

## 3. Matriz de participantes y sesiones

| participantId | profileRef | jobExample | sessionId | Entrevistador | Consentimiento |
|---|---|---|---|---|---|
| P-SIM-01 | MES-1 (patrones A/B/C) | MESERO | S-PIL-01 | INT-01 | PILOT-SIM-CONSENT-v1 |
| P-SIM-02 | MES-3 (patrón J + mezcla) | MESERO | S-PIL-02 | INT-02 | PILOT-SIM-CONSENT-v1 |
| P-SIM-03 | MES-1/MES-3 (mezcla) | MESERO | S-PIL-03 | INT-01 | PILOT-SIM-CONSENT-v1 |
| P-SIM-04 | MES-2 (patrones D/E/F) | MESERO | S-PIL-04 | INT-02 | PILOT-SIM-CONSENT-v1 |
| P-SIM-05 | MES-3 (mezcla G/F/B) | MESERO | S-PIL-05 | INT-01 | PILOT-SIM-CONSENT-v1 |
| P-SIM-06 | MES-2/MES-3 (mezcla D/I) | MESERO | S-PIL-06 | INT-02 | PILOT-SIM-CONSENT-v1 |
| P-SIM-07 | VEN-1/2 (mezcla A/D/G) | VENDEDOR | S-PIL-07 | INT-01 | PILOT-SIM-CONSENT-v1 |
| P-SIM-08 | VEN-1/3 (mezcla J/A/H) | VENDEDOR | S-PIL-08 | INT-02 | PILOT-SIM-CONSENT-v1 |
| P-SIM-09 | VEN-1/2 (mezcla C/D/B) | VENDEDOR | S-PIL-09 | INT-01 | PILOT-SIM-CONSENT-v1 |
| P-SIM-10 | VEN-2/3 (mezcla A/E/F) | VENDEDOR | S-PIL-10 | INT-02 | PILOT-SIM-CONSENT-v1 |
| P-SIM-11 | VEN-3 (mezcla B/I/C) | VENDEDOR | S-PIL-11 | INT-01 | PILOT-SIM-CONSENT-v1 |
| P-SIM-12 | VEN-1/2 (mezcla G/I/J) | VENDEDOR | S-PIL-12 | INT-02 | PILOT-SIM-CONSENT-v1 |

Atributos protegidos recolectados: **NINGUNO**. Información innecesaria recolectada: **NINGUNA**
(1 desviación menor de formulario detectada y corregida — INC-PIL-002, campo nunca poblado).

## 4. Tamaño del piloto (PASO 3)

| Concepto | Valor | Naturaleza |
|---|---|---|
| **pilotN** | **12 sesiones** (6 MESERO + 6 VENDEDOR) × 5 preguntas = **60 instancias evaluadas** | **OBJETIVO OPERATIVO** |
| Sesiones mínimas por psicometría | **NO EXISTE** — este piloto NO establece ni usa ningún N mínimo de validación | — |
| Cobertura exigida | todos los escenarios (2/2) · todas las preguntas (10/10) · todos los probes (26/26) · ambos revisores (2/2) | operativa |

El valor 12 proviene del objetivo operativo del plan A-06.8 (`field-pilot-plan.csv`:
">= 12 sesiones completas (2 puestos × 6) como objetivo operativo — NO criterio de validez
psicométrica"). **Ningún resultado de este piloto se presenta como evidencia de validez.**

## 5. Entrevistadores y revisores (PASO 4)

| Rol | ID | Modo | Información recibida | trainingStatus | calibrationStatus |
|---|---|---|---|---|---|
| Entrevistador | INT-01 | Rol simulado por el equipo de auditoría | Guía de preguntas + banco de probes + protocolo 05 + rúbrica (solo lo necesario) | COMPLETED-SIM (M1..M7) | CALIBRATED (M-G + post-piloto) |
| Entrevistador | INT-02 | Rol simulado por el equipo de auditoría | Ídem | COMPLETED-SIM (M1..M7) | CALIBRATED (M-G + post-piloto) |
| Revisor | REV-01 | Pasada de revisión ciega independiente | **Solo respuesta + rúbrica v2** (sin clasificaciones ajenas, sin notas del entrevistador) | COMPLETED-SIM (M1..M7) | CALIBRATED (M-G + post-piloto) |
| Revisor | REV-02 | Pasada de revisión ciega independiente | Ídem | COMPLETED-SIM (M1..M7) | CALIBRATED (M-G + post-piloto) |

Ninguno de los cuatro roles recibió información innecesaria sobre atributos personales — de hecho
no existe atributo personal alguno en los registros del piloto. Los revisores recibieron
exclusivamente información de la respuesta y de la rúbrica (ver 06-interrater.md).

> **Limitación declarada**: la "independencia" de los revisores es **procedimental** (dos pasadas
> separadas sin acceso cruzado previo), no de personas distintas — ver 17-limitations.md §L2.
