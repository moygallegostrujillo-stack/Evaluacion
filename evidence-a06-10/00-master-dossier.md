# EVALUHR — A-06.10
# FIELD PILOT AUDIT — PILOTO DE CAMPO CONTROLADO DE ENTREVISTA BDI/STAR
# NO PRODUCTIVO · NO USAR PARA DECISIONES LABORALES · MODO FASE A (SIMULACIÓN DOCUMENTAL)

> **Advertencia de alcance**: este piloto NO busca ni produce validez psicométrica, predictiva,
> mexicana, eficacia de contratación ni superioridad frente a otros métodos. Mide operabilidad:
> claridad, duración, comprensión, facilidad de aplicación, calidad de evidencia, utilidad de
> probes, consistencia entre revisores, funcionamiento de rúbrica, problemas operativos, de
> privacidad y de sesgo. **El resultado del piloto jamás es "aprobado para selección".**

## 0. Identificación

| Campo | Valor |
|---|---|
| Auditoría | A-06.10 — Field Pilot (sigue a A-06.9, paquete jurídico) |
| Modo | FASE A — **SIMULACIÓN DOCUMENTAL** (participantes sintéticos; 0 personas reales entrevistadas) |
| Escenarios | MESERO y VENDEDOR — PILOT / NON-PRODUCTIVE (no representan perfiles universales reales) |
| Regla de oro | NO activar · NO publicar · NO usar para contratación · NO scoring/pesos/cortes/JobFit · NO modificar código/schema/contrato/aviso |
| Expediente | `evidence-a06-10/` — 20 md + 3 csv = 23 archivos |

## 1. Prerequisitos (PASO 1)

8/8 CUMPLE → **PILOT CLEARED**: A-06.9 existe; preguntas DRAFT; ACTIVE=0; G7 NO APPROVED; G10 NOT
EVALUATED; sin proceso laboral real; participación voluntaria (flujo de consentimiento recorrido
en modo simulación); información previa adecuada (A-06.3..A-06.9). (01)

## 2. Participantes y tamaño (PASOS 2–4)

12 participantes sintéticos (P-SIM-01..12, derivados de A-06.6), 6 MESERO + 6 VENDEDOR; datos
mínimos (6 campos, 0 atributos protegidos). **pilotN = 12 sesiones = OBJETIVO OPERATIVO** (criterio
del plan A-06.8), NO un N de validación. Cobertura: 2/2 escenarios, 10/10 preguntas, 26/26 probes,
2/2 revisores. Entrevistadores INT-01/INT-02; revisores ciegos REV-01/REV-02; nadie recibió
información innecesaria. (02)

## 3. Metodología (PASOS 5–7)

Capacitación M1..M7 impartida y evaluada en modo simulación (7/7 aprobados, 4 roles) + drills
M-H/V-H + tono COL-001-D + límites IA; sin capacitación orientada a resultado (03). Estructura de
sesión INTRODUCCIÓN→INFORMACIÓN→CONSENTIMIENTO→BDI PRIMARY→PROBES→CIERRE→REVISIÓN aplicada 12/12
sin improvisación; guía congelada Question-v1.0; banco cerrado de probes, máx 3/instancia (04).

## 4. Preguntas

10 preguntas DRAFT ejecutadas (5 MESERO + 5 VENDEDOR), 60 instancias. Decisiones post-piloto:
**7 KEEP · 3 REVISE (Q-MES-TRV-002, Q-VEN-COL-001, Q-VEN-TRV-002) · 0 REJECT · 0 ACTIVE**. Los
cambios propuestos NO se aplican al catálogo en este task. (13 + pilot-question-decision.csv)

## 5. Probes

26/26 probes ejercitados (179 usos, promedio 2.98/instancia, ≤3 en todas). PROBE-COL-001-D
re-pilotado como exigió A-06.7: 1 éxito, 2 stop rules correctas, pero tono percibido cuestionante →
**REVISE** (única revisión). PROBE-UNI-004: 12 cierres conformes a CU-1..CU-6. **25 KEEP · 1 REVISE ·
0 REJECT**. (14)

## 6. Evidencia (PASO 8)

Tipos: CONCRETE_BEHAVIOR 38 · HYPOTHETICAL 9 · GENERAL_CLAIM 7 · NO_INFORMATION 4 · CONTRADICTION 2.
Estados: VALID 21 · LIMITED 20 · **INSUFFICIENT 13 (≠0 ✔)** · PENDING_REVIEW 4 · INVALID 2. Reglas
rúbrica v2 aplicadas (RM-1, R1–R4, H-1..H-6, C-1..C-7, CAL-21/24/25). (05 + field-pilot-results.csv)

## 7. Revisores y consistencia (PASOS 9 y 11)

Doble revisión ciega 60/60 con rationale/indicator/conflicts/limitations obligatorios. Acuerdo
operativo **90.0% (54/60)**; 6 desacuerdos: 4 evidenceState, 1 rationale, 1 indicator. Indicadores
que provocaron diferencias: mapeo RM-1 e IND-TRV-002. Preguntas problemáticas: TRV-002 y
Q-VEN-COL-001. Medida operativa — **no coeficiente de validez**. (06)

## 8. Calibración (PASO 10)

6/6 desacuerdos resueltos consultando rúbrica (nunca por votación); criterio conservador aplicado
(DIS-01, DIS-04); 3 estados ajustados; 2 aclaraciones de rúbrica propuestas (v2.1, NO aplicadas);
checkpoints anti-leniency y anti-confirmación añadidos. (07)

## 9. Duración (PASO 12)

vs A-06.3 (25–37 min): **8 WITHIN · 3 SHORTER · 1 LONGER (39.2) · 0 UNACCEPTABLE**; 2.4–7.4 min por
pregunta; revisión 168/174 min + calibración 50 min. Ajuste propuesto: recordatorio de stop rules
(operativo, no de texto). (08)

## 10. Sesgos (PASO 13)

4 incidentes resueltos: halo (S-PIL-02), leniency (S-PIL-07), confirmation (S-PIL-10), central
tendency (S-PIL-06) + drift corregido preventivamente; 0 stereotype/similarity (artefacto
sintético, no prueba de inmunidad). Sin recopilación de atributos personales. (09)

## 11. Privacidad y revelación involuntaria (PASOS 14 y 17)

**UNINVITED_DISCLOSURE = YES en 2/12 sesiones** (S-PIL-03, S-PIL-08; inducidas por diseño) —
protocolo 05 íntegro: no indagar, no registrar contenido, redirigir, flag mínimo, cierre normal;
respuestas → INVALID. 0 datos sensibles almacenados; minimización verificada en curso (1 desviación
de formulario corregida); acceso restringido; 0 exportaciones innecesarias; purge programado.
(10)

## 12. IA (PASO 15)

3 usos permitidos probados en sesión (SUMMARY, MISSING_INFO, PROBE_SUGGESTION) — todos AI_DRAFT
verificados por humano. **5/5 pruebas deliberadas de sobre-alcance → REJECTED** (inventar conducta,
clasificar, cambiar evidencia, inferir atributos, improvisar probe). Cadena EVIDENCIA→REVISIÓN
HUMANA→RESULTADO intacta; nunca IA→DECISIÓN. (11)

## 13. Incidentes (PASO 18)

10 incidentes: LEGAL 3 · PROCESS 2 · BIAS 2 · PRIVACY 1 · AI 1 · TECHNICAL 1; MEDIUM 4 / LOW 6 /
**HIGH 0**; 9 resueltos, 1 abierto (plazo de conservación — solo abogado, INC-PIL-010). Ninguno
suspendió una sesión. (12 + pilot-incidents.csv)

## 14. Decisiones KEEP/REVISE/REJECT (PASOS 20–21)

Preguntas: 7 KEEP · 3 REVISE · 0 REJECT · **0 ACTIVE**. Probes: 25 KEEP · 1 REVISE · 0 REJECT ·
**0 ACTIVE**. Trazabilidad completa por caso (participantId→…→reviewVersion) sin datos
innecesarios (PASO 16). (13, 14, 04 §4)

## 15. G9 (PASO 22)

**SATISFIED FOR OPERATIONAL PILOT — alcance FASE A (SIMULACIÓN DOCUMENTAL)**: la metodología puede
operarse de extremo a extremo sin fallas críticas. NO es validación; NO sustituye FASE B (pendiente,
condicionada a G7). (15)

## 16. G10 (PASO 23)

**NOT EVALUATED — sin cambio.** El piloto no produce, aproxima ni anticipa validación alguna. (16)

## 17. Limitaciones (PASO 24)

11 limitaciones documentadas, destacando: participantes sintéticos (L1), independencia de revisores
procedimental (L2), entrevistadores simulados (L3), single-operator risk (L7), cambios propuestos no
aplicados ni re-pilotados (L10). (17)

## 18. GO / NO-GO

| Decisión | Alcance |
|---|---|
| **GO** | Track no productivo: aplicar proposiciones v1.1/v2.1 y re-pilotar; entregar expediente al abogado (G7 junto con A-06.9); planificar FASE B solo post-G7; ejecutar purge programado |
| **NO-GO** | **Activación productiva** — bloqueada por G7 (CRITICAL), G2/G3 DRAFT, G4/G5 sin aprobación formal, 3 preguntas REVISE, LEGAL-G8/G10, G10 NOT EVALUATED |

Criterio PASO 19: **PASS como pilotaje operativo** (sin fallas críticas) con hallazgos REVISE
pendientes. **No existe "aprobado para selección" como resultado del piloto.**

## Índice del expediente

| # | Documento | # | Documento |
|---|---|---|---|
| 01 | Prerequisitos | 11 | IA |
| 02 | Participantes y tamaño | 12 | Incidentes |
| 03 | Capacitación | 13 | Decisiones por pregunta |
| 04 | Ejecución y trazabilidad | 14 | Decisiones por probe |
| 05 | Evidencia | 15 | G9 |
| 06 | Doble revisión ciega | 16 | G10 |
| 07 | Calibración | 17 | Limitaciones |
| 08 | Duración | 18 | Decisión final |
| 09 | Sesgos | 19 | Auditoría final |
| 10 | Privacidad | — | field-pilot-results.csv · pilot-incidents.csv · pilot-question-decision.csv |

---
**REGLA FINAL CUMPLIDA**: NO ACTIVAR · NO PUBLICAR · NO USAR PARA CONTRATACIÓN · NO CREAR SCORING ·
NO CREAR JOBFIT · NO MODIFICAR CÓDIGO.
