# A-06.6 — 14 · Trazabilidad (PASO 18)

## 1. Regla

Para cada pregunta verificar la cadena: job → competency → indicator → question → probe → response → evidence → review. Cualquier ruptura: TRACEABILITY_FAILURE.

## 2. Verificación por caso

| caseId | job | competency | indicator | question | probe | response | evidence | review | ¿Cadena completa? |
|---|---|---|---|---|---|---|---|---|---|
| M-A | MESERO | COMP-SVC-001 | IND-SVC-001-A/C/D | Q-MES-SVC-001 | PROBE-UNI-003 | STAR completo | VALID/SUPPORTED | ✓ | ✓ COMPLETA |
| M-B | MESERO | COMP-SVC-001 | (ninguno observado) | Q-MES-SVC-001 | PROBE-UNI-005 | GENERAL_CLAIM | INSUFFICIENT | ✓ | ✓ COMPLETA |
| M-C | MESERO | COMP-SVC-001 | (ninguno observado) | Q-MES-SVC-001 | PROBE-UNI-005 | HYPOTHETICAL | LIMITED | ✓ | ✓ COMPLETA |
| M-D | MESERO | COMP-COL-001 | (Action de otros) | Q-MES-COL-001 | PROBE-UNI-001 | CONCRETE parcial | INSUFFICIENT | ✓ | ✓ COMPLETA |
| M-E | MESERO | COMP-ORG-001 | (sin Action) | Q-MES-ORG-001 | PROBE-UNI-001 | EXTERNAL_RESULT | PENDING_REVIEW | ✓ | ✓ COMPLETA |
| M-F | MESERO | COMP-ORG-001 | (sin conducta) | Q-MES-ORG-001 | PROBE-UNI-001/002 | CONTRADICTION | PENDING_REVIEW | ✓ | ✓ COMPLETA |
| M-G | MESERO | COMP-SVC-002 | IND-SVC-002-B parcial | Q-MES-SVC-002 | PROBE-UNI-001 | CONCRETE parcial | LIMITED | ✓ | ✓ COMPLETA |
| M-H | MESERO | COMP-TRV-002 | IND-TRV-002-A/B | Q-MES-TRV-002 | (no necesario) | Revelación+CONCRETE | INVALID(atributo)+LIMITED | ✓ | ✓ COMPLETA |
| M-I | MESERO | COMP-TRV-002 | (sin experiencia) | Q-MES-TRV-002 | PROBE-UNI-005 | NO_INFORMATION | NO_EVIDENCE | ✓ | ✓ COMPLETA |
| M-J | MESERO | COMP-COL-001 | IND-COL-001-A/C/D | Q-MES-COL-001 | (no necesario) | CONCRETE ×2 | VALID/STRONG | ✓ | ✓ COMPLETA |
| V-A | VENDEDOR | COMP-SVC-001 | IND-SVC-001-A/C/D | Q-VEN-SVC-001 | PROBE-UNI-003 | STAR completo | VALID/SUPPORTED | ✓ | ✓ COMPLETA |
| V-B | VENDEDOR | COMP-SVC-002 | (ninguno) | Q-VEN-SVC-002 | PROBE-UNI-005 | GENERAL_CLAIM | INSUFFICIENT | ✓ | ✓ COMPLETA |
| V-C | VENDEDOR | COMP-SVC-002 | (intención) | Q-VEN-SVC-002 | PROBE-UNI-005 | HYPOTHETICAL | LIMITED | ✓ | ✓ COMPLETA |
| V-D | VENDEDOR | COMP-COL-001 | (Action de otros) | Q-VEN-COL-001 | PROBE-UNI-001 | CONCRETE parcial | INSUFFICIENT | ✓ | ✓ COMPLETA |
| V-E | VENDEDOR | COMP-ORG-001 | (sin Action) | Q-VEN-ORG-001 | PROBE-UNI-001 | EXTERNAL_RESULT | PENDING_REVIEW | ✓ | ✓ COMPLETA |
| V-F | VENDEDOR | COMP-TRV-002 | (sin conducta) | Q-VEN-TRV-002 | PROBE-UNI-001/002 | CONTRADICTION | PENDING_REVIEW | ✓ | ✓ COMPLETA |
| V-G | VENDEDOR | COMP-SVC-001 | IND-SVC-001-A parcial | Q-VEN-SVC-001 | PROBE-UNI-001 | CONCRETE parcial | LIMITED | ✓ | ✓ COMPLETA |
| V-H | VENDEDOR | COMP-TRV-002 | IND-TRV-002-A/B | Q-VEN-TRV-002 | (no necesario) | Revelación+CONCRETE | INVALID(atributo)+LIMITED | ✓ | ✓ COMPLETA |
| V-I | VENDEDOR | COMP-COL-001 | (sin experiencia) | Q-VEN-COL-001 | PROBE-UNI-005 | NO_INFORMATION | NO_EVIDENCE | ✓ | ✓ COMPLETA |
| V-J | VENDEDOR | COMP-ORG-001 | IND-ORG-001-A/B | Q-VEN-ORG-001 | (no necesario) | CONCRETE ×2 | VALID/STRONG | ✓ | ✓ COMPLETA |

## 3. Resumen

| Métrica | Valor |
|---|---|
| Casos verificados | 20 |
| Cadenas completas | 20/20 (100%) |
| TRACEABILITY_FAILURE | 0 |

**Verificación**: la cadena de trazabilidad se mantuvo completa en los 20 casos simulados. No se detectó ninguna ruptura.

## 4. Puntos de verificación de la cadena

| Punto | Verificado |
|---|---|
| jobId vinculado (vía guideId) | ✓ |
| competencyId vinculado (vía pregunta) | ✓ |
| indicatorId vinculado (vía pregunta; "ninguno observado" es un estado válido, no una ruptura) | ✓ |
| questionId + questionVersion | ✓ |
| probeId usado | ✓ |
| responseId (STAR capturado) | ✓ |
| evidenceState asignado | ✓ |
| reviewerId + reviewDate | ✓ |
| reviewVersion | ✓ |
| AIInvolvement registrado (cuando IA asistió) | ✓ |

**Nota**: "indicatorId ninguno observado" (M-B, M-C, etc.) NO es una ruptura de trazabilidad — es un estado legítimo donde la pregunta se hizo pero no se observó conducta. La cadena pregunta→respuesta→evidencia→revisión sigue completa.

## 5. Conexión con gates

La trazabilidad alimenta INTERVIEW-G8 (human review) + LEGAL-G9 (seguridad) + LEGAL-G10 (transparencia). Sin trazabilidad completa, la entrevista no se activa.
