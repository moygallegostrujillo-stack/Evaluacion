# EVALUHR — A-06.8 — 10 · Conservación (PASO 10)

> Re-examen de la propuesta de "2 años" heredada de A-06.4/A-04.x. **Objetivo: no presentarla
> como obligación legal si no existe fuente suficiente.** Clasificación por categoría:
> **LEGAL REQUIREMENT / RECOMMENDED / LEGAL_REVIEW**. Marco: Nueva LFPDPPP 2025 (minimización,
> finalidad, cancelación); LFT (expediente laboral del contratado = del patrón); LFPEPD/CONAPRED
> (defensa ante quejas).

## 1. Re-clasificación de los "2 años"

| Aspecto | Conclusión A-06.8 |
|---|---|
| ¿Existe artículo que imponga 2 años para datos de entrevista de candidatos no contratados? | **NO identificado** en ninguna fuente revisada (ley 2010 ni nueva ley 2025). |
| ¿Cuál es la base correcta? | El **principio de minimización/proporcionalidad**: conservar lo necesario para la finalidad; y el **interés legítimo de defensa** ante potenciales quejas (discriminación, ARCO, laboral) — cuyo plazo óptimo depende de prescripciones procesales → **LEGAL_REVIEW**. |
| Clasificación de "2 años (no contratados)" | **RECOMMENDED** — práctica de diseño razonable para auditoría/defensa; **NO es un requisito legal**. El plazo definitivo queda **LEGAL_REVIEW** bajo la nueva ley (que además renumeró artículos y cambió la autoridad garante a SABG). |
| Corrección de lenguaje | En aviso/contrato/información previa (13/14/09): presentar el plazo como "política de conservación de EvaluHR/la empresa", **jamás como "obligación legal de 2 años"**. |

## 2. Clasificación por categoría de dato

| Categoría | Titular/caso | Propuesta vigente | Clasificación | Justificación |
|---|---|---|---|---|
| Notas STAR del entrevistador | No contratado | 2 años → purge | **RECOMMENDED** + plazo final LEGAL_REVIEW | Defensa/auditoría; minimización |
| Notas STAR | Contratado | Vida de la relación + política del expediente | **RECOMMENDED** (gobernanza RR.HH. del cliente) | El expediente laboral es del patrón; EvaluHR conserva bajo instrucción |
| Transcripción (si aplica) | Ambos | Plazo corto; purge post-revisión | **RECOMMENDED** | Minimización estricta |
| Grabación audio/video | Ambos | Eliminar tras transcripción/revisión | **RECOMMENDED** | No hay obligación específica de conservar; conservar = mayor riesgo |
| CompetencyResult | No contratado | Igual que notas (2 años → purge) | **RECOMMENDED** + LEGAL_REVIEW | Auditoría de proceso |
| CompetencyResult | Contratado | Parte del expediente del empleado (del cliente) | **RECOMMENDED** — gobernanza del cliente | LFT: expediente del patrón |
| Datos sensibles revelados involuntariamente | Cualquiera | **NO conservar** (protocolo 05) | **LEGAL REQUIREMENT (por diseño interno)** | Datos sensibles sin base de tratamiento: la no-captura/no-conservación es la única postura segura bajo la ley de datos |
| Flags de auditoría (revelación, accesos, export, purge) | — | Ciclo de retención de logs (técnico) | **RECOMMENDED** | Trazabilidad; define duración el plan de seguridad |
| Logs técnicos/seguridad | — | Política técnica de logs | **RECOMMENDED** | Seguridad de la información |
| Consentimientos | — | Mientras dure el tratamiento + plazo de defensa | **LEGAL_REVIEW** | Son la prueba de base lícita; su descarte prematuro es riesgo; plazo exacto = legal |
| Evidencia del piloto metodológico (sintética) | — | Purge o anonimización al cierre del piloto | **RECOMMENDED** | Datos sintéticos sin titular; orden e higiene de auditoría |
| Candidato que ejerce cancelación (ARCO) | No contratado | Purge inmediato salvo obligación legal de conservar | **LEGAL REQUIREMENT** (derecho ARCO) + LEGAL_REVIEW en las excepciones | La ley garantiza cancelación; excepciones deben citarse con base real |
| Queja/proceso en curso | Involucrado | Suspender purge hasta resolución | **RECOMMENDED** + LEGAL_REVIEW (cuándo levantar) | Defensa; spoliation risk |

## 3. Mecanismos que se mantienen (sin cambios)

1. **Purge al vencimiento** con registro en audit trail (qué, cuándo, quién/qué proceso).
2. **Anonimización** solo si se conserva estadística (sin atributos protegidos).
3. **Suspensión de purge** ante queja o disputa (registrada y revisada).
4. **Metadatos mínimos** (fecha, puesto, resultado agregado) si se necesitan para auditoría.
5. Regla: **la retención indefinida viola minimización** — prohibida.

## 4. Acciones requeridas (con abogado)

| # | Acción | Prioridad |
|---|---|---|
| 1 | Determinar plazo(s) definitivos por categoría bajo la nueva ley + prescripciones aplicables | OBLIGATORIO (LEGAL-G8) |
| 2 | Confirmar reglas de cancelación ARCO y sus excepciones citando artículos de la nueva ley | OBLIGATORIO |
| 3 | Confirmar obligaciones de notificación de brechas y su interacción con conservación (SABG) | OBLIGATORIO |
| 4 | Ajustar redacción de aviso/contrato: "política de conservación", no "plazo legal" | OBLIGATORIO (LEGAL-G10) |

## 5. Conexión con gates

LEGAL-G8 permanece **CONDICIONAL** hasta completar §4 — bloquea activación productiva.
