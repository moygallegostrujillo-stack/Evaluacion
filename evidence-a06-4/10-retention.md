# A-06.4 — 10 · Retención (PASO 10)

## 1. Regla

Definir conceptualmente cuánto conservar, quién accede, qué se conserva, qué se elimina. **No inventar plazos legales.** Cuando no exista plazo aplicable: **REVISIÓN LEGAL NECESARIA**.

## 2. Qué conservar

| Tipo de dato | ¿Conservar? | Razón |
|---|---|---|
| Notas del entrevistador (STAR) | ✓ SÍ | Evidencia para CompetencyResult; trazabilidad |
| Transcripción (si aplica) | ✓ SÍ (plazo corto) | Auditoría; verificación |
| CompetencyResult | ✓ SÍ | Resultado del proceso |
| ConflictRecord | ✓ SÍ | Trazabilidad de resolución |
| Consentimiento del candidato | ✓ SÍ | Prueba de consentimiento (LFPDPPP) |
| Grabación audio/video (si aplica) | ✗ NO (plazo mínimo) | Eliminar post-transcripción/revisión |
| Datos sensibles (revelados involuntariamente) | ✗ NO | No registrar; no conservar |

## 3. Qué eliminar

| Tipo | Cuándo eliminar |
|---|---|
| Grabación audio/video | Inmediatamente después de la transcripción/revisión (si se usó) |
| Datos sensibles involuntarios | Inmediatamente (no registrar en primer lugar) |
| Notas y transcripción | Tras el plazo de retención (ver abajo) |
| CompetencyResult de candidatos no contratados | Tras plazo de retención (para auditoría) |
| CompetencyResult de candidatos contratados | Conservar como parte del expediente del empleado (con governance de RR.HH.) |

## 4. Plazo de retención

### 4.1 Plazo legal aplicable

La LFPDPPP no fija un plazo específico para datos de entrevista de selección. El principio de **proporcionalidad** (Art 6) exige que el plazo sea el **mínimo necesario** para la finalidad.

### 4.2 Práctica recomendada (no plazo legal inventado)

| Tipo de candidato | Plazo recomendado | Razón |
|---|---|---|
| No contratado | 2 años desde la entrevista | Auditoría; defensa ante potencial queja de discriminación; razonable proporcionalidad |
| Contratado | Mientras dure la relación laboral + plazo legal aplicable al expediente del empleado | El expediente del empleado tiene governance propia de RR.HH. |
| Candidato que solicita cancelación | Inmediatamente (salvo obligación legal de conservar) | Derecho ARCO (LFPDPPP Art 22) |

### 4.3 REVISIÓN LEGAL NECESARIA

El plazo exacto **REQUIERE REVISIÓN LEGAL** profesional:
- La LFPDPPP reformada (2025) puede introducir cambios.
- Plazos para defensa ante quejas de discriminación (CONAPRED, LFPEPD) pueden requerir conservación más larga.
- Obligaciones laborales (LFT) para expedientes de empleados contratados.
- A-04.1/A-05.x mencionaron "2 años de retención" para resultados de evaluación; ese plazo era del diseño de retention.ts y puede servir como referencia inicial, pero **debe confirmarse legalmente**.

## 5. Acceso durante la retención

| Rol | Acceso |
|---|---|
| Candidato | Acceso a sus propios datos (ARCO) |
| Entrevistador | Acceso a sus propias notas (mientras esté activo) |
| Reviewer | Acceso a evidencia para revisión |
| RR.HH. (empresa cliente) | Acceso a CompetencyResult para decisión |
| Admin EvaluHR | Acceso para gestión técnica (no contenido) |
| Sistema | Acceso técnico (almacenamiento, purge) |
| IA | NO acceso autónomo; solo para transcripción/resumen con supervisión |

Ver `11-access-control.md` para detalle.

## 6. Expediente histórico

¿Qué forma parte del "expediente" del candidato y qué es solo "evidencia histórica"?

| Tipo | ¿Parte del expediente del candidato? | ¿Evidencia histórica? |
|---|---|---|
| CompetencyResult (contratado) | ✓ SÍ | ✓ SÍ |
| CompetencyResult (no contratado) | ✗ NO (candidato no ingresó) | ✓ SÍ (auditoría) |
| Notas STAR | ✓ SÍ (contratado) | ✓ SÍ |
| Consentimiento | ✓ SÍ | ✓ SÍ |
| ConflictRecord | ✓ SÍ | ✓ SÍ |
| Grabación | ✗ NO (eliminar) | ✗ NO |

## 7. Purge

Al vencimiento del plazo:
- Eliminar notas, transcripción, CompetencyResult de candidatos no contratados.
- Anonimizar (si se conserva para estadística: género, edad no; solo agregados).
- Conservar metadatos mínimos (fecha, puesto, resultado aggregate) si es necesario para auditoría.
- Registrar el purge (audit trail).

## 8. Conservación ante queja legal

Si hay una queja de discriminación (CONAPRED) o disputa legal en curso:
- **Suspender** el purge del expediente del candidato involucrado.
- Conservar hasta resolución del asunto.
- REQUIERE REVISIÓN LEGAL para determinar cuándo levantar la suspensión.

## 9. Regla de no retención indebida

> No conservar más allá del plazo necesario. La retención indefinida viola el principio de proporcionalidad.

## 10. Conexión con gates

La retención pasa LEGAL-G8 (Conservación). Sin plazo definido + mecanismo de purge + suspensión ante queja, la entrevista no se activa.
