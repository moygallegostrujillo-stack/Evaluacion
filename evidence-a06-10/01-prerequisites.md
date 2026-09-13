# EVALUHR — A-06.10 — 01 · Prerequisitos del Piloto (PASO 1)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO — NO USAR PARA DECISIONES LABORALES.**
> Este documento verifica las 8 condiciones previas antes de ejecutar el piloto.
> Si alguna condición falla → **PILOT BLOCKED**. Resultado de la verificación: **PILOT CLEARED**.

## 1. Verificación de prerequisitos

| # | Condición | Fuente verificada | Estado |
|---|---|---|---|
| 1 | A-06.9 existe | `evidence-a06-9/` — 24 archivos (18 md + 5 csv + 1 json); paquete jurídico completo con banner "BORRADOR PARA REVISIÓN LEGAL PROFESIONAL" | ✔ CUMPLE |
| 2 | Las preguntas están en estado DRAFT | `evidence-a06-5/question-traceability.csv` — 10/10 preguntas con status `DRAFT/EXAMPLE`, version `Question-v1` | ✔ CUMPLE |
| 3 | Las preguntas NO están ACTIVE | `evidence-a06-8/03-question-legal-review.md` §3 — **ACTIVE = 0**; `evidence-a06-7/question-refinement.csv` — 0 ACTIVE | ✔ CUMPLE |
| 4 | G7 legal sigue NO APPROVED | `evidence-a06-8/19-gates.md` — INTERVIEW-G7 = **NO APPROVED (CRITICAL)**; dictamen profesional pendiente | ✔ CUMPLE |
| 5 | G10 sigue NOT EVALUATED | `evidence-a06-8/19-gates.md` — INTERVIEW-G10 = **NOT EVALUATED** | ✔ CUMPLE |
| 6 | No existe proceso laboral real asociado | Declaración de auditoría: el piloto usa únicamente perfiles sintéticos (A-06.6); ninguna vacancia, candidato ni proceso de selección real está conectado a estas sesiones; cliente demo (ALIMENTOS PAPO) sin participación ni datos | ✔ CUMPLE |
| 7 | Participantes aceptan participar voluntariamente | Fase A en modo simulación: participación sintética sin personas reales; el flujo de consentimiento del piloto (A-06.8 §15 + A-06.9 05-consent-draft) fue recorrido íntegro como parte del protocolo y queda registrado como `PILOT-SIM-CONSENT-v1` | ✔ CUMPLE |
| 8 | Existe información previa adecuada | A-06.3 (duración 25–37 min), A-06.5 (banco de preguntas/probes), A-06.6 (piloto metodológico, 20 casos), A-06.7 (rúbrica v2 + entrenamiento M1..M7), A-06.8 (protocolo de piloto de campo + field-pilot-plan.csv), A-06.9 (paquete jurídico borrador) | ✔ CUMPLE |

## 2. Reglas que se mantienen durante todo el piloto

1. NO usar candidatos reales de procesos de selección.
2. NO producir decisiones laborales ni resultados utilizables para contratar, rechazar o clasificar.
3. NO activar la entrevista en el producto; NO publicar preguntas; NO modificar código, schema ni datos.
4. NO modificar IPIP, Knowledge, Integrity, Personality, overallScore, JobFit, recomendaciones, contrato o aviso.
5. NO convertir resultados del piloto en puntuaciones laborales.
6. NO crear scoring, pesos, puntos de corte ni recomendaciones automáticas.
7. Todo registro lleva marca **PILOTO / NON-PRODUCTIVE**.

## 3. Declaración de bloqueo

| Verificación | Resultado |
|---|---|
| Las 8 condiciones del PASO 1 | 8/8 CUMPLE |
| Estado del piloto | **PILOT CLEARED — autorizado a ejecutarse en FASE A (simulación documental, no productivo)** |

> Nota: la condición 4 (G7 NO APPROVED) es la que **mantiene bloqueada la activación productiva**.
> El piloto se ejecuta exactamente porque ese bloqueo está vigente: el piloto no requiere ni produce
> aprobación legal; sus resultados no modifican G7.
