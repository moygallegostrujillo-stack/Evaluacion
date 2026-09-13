# EVALUHR — A-06.8 — 01 · Expediente Legal Consolidado (PASO 1)

> **SOLO CONSOLIDACIÓN.** Regla: **NO modificar conclusiones previas sin evidencia nueva.**
> Fuentes consolidadas: A-06.4 (legal & privacy), A-06.5 (banco DRAFT), A-06.6 (piloto
> metodológico), A-06.7 (refinamiento rúbrica/calibración). Evidencia nueva de A-06.8:
> re-verificación de legislación vigente (2026-09-12/13) → `02-current-law.md`.

## 1. Finalidad

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Finalidad | "Obtención de evidencia conductual relacionada con las competencias y criterios del puesto específico dentro del proceso de selección laboral". Finalidad específica, legítima y comunicable. | A-06.4 LEGAL-G1 | No | VIGENTE |
| Verificación A-06.8 | La finalidad no cambió con el refinamiento (A-06.7 no crea preguntas nuevas ni cambia propósito). | — | — | — |

## 2. Datos tratados

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Categorías | 7 categorías: identificación mínima, respuestas STAR, notas del entrevistador, transcripción (si aplica), CompetencyResult, ConflictRecord, consentimiento. Solo lo necesario. | A-06.4 LEGAL-G3 | No | VIGENTE |
| Piloto A-06.6 | Los 20 casos sintéticos confirmaron que las 10 preguntas solo elicitan conducta laboral pasada. | A-06.6 | Confirmatoria | VIGENTE |

## 3. Datos sensibles

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | Prohibido recabar datos sensibles en entrevista (salvo BFOQ con consentimiento expreso y revisión legal). Las 10 preguntas NO solicitan datos sensibles por diseño. | A-06.4 LEGAL-G4; A-06.5 17-legal-status | — | VIGENTE |
| **Nueva evidencia (piloto)** | **2 episodios de revelación involuntaria** (M-H: embarazo; V-H: religión) en preguntas TRV-002. Confirmado: el riesgo no está en el texto de la pregunta sino en la espontaneidad del candidato → requiere protocolo obligatorio (05) + entrenamiento (M1/M3). | A-06.6; A-06.7 | **SÍ** | ACTUALIZADO — protocolo obligatorio definido en A-06.8 (05) |

## 4. Proporcionalidad

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | 5 preguntas de proporcionalidad aplicadas por pregunta; vínculo directo pregunta→competencia→indicador→puesto (JOB_ANALYSIS). | A-06.4 LEGAL-G2; A-06.7 13-proportionality | Re-verificación A-06.7 conservó 10/10 | VIGENTE |
| A-06.8 | Sin cambios. La rúbrica v2 y el plan de probes no añaden recolección de datos. | — | — | — |

## 5. No discriminación

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | Preguntas que elicitan atributos protegidos = NO_PUBLICABLE sin BFOQ. Matriz aplicada. 0 preguntas NO_PUBLICABLE en el banco candidato. | A-06.4 LEGAL-G5; A-06.5 17-legal-status | — | VIGENTE |
| Piloto | Ningún caso sintético produjo tratamiento diferenciado por atributo protegido; las 2 revelaciones involuntarias fueron correctamente contenidas (M-H, V-H). | A-06.6 10-bias | Confirmatoria | VIGENTE |

## 6. IA

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | IA asiste (transcripción, resumen, sugerencia de probes aprobados, detección de faltantes, adaptación de lenguaje); NO infiere atributos, NO decide, NO clasifica. | A-06.4 LEGAL-G6; A-06.5 13-ai-boundaries; A-06.7 12-ai-boundaries (5 sobre-alcances RECHAZADOS) | — | VIGENTE — lista cerrada consolidada en `07-ai-legal-boundaries.md` |

## 7. Revisión humana

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | La IA nunca es base única de decisión; revisión humana obligatoria; separación entrevistador ≠ revisor (con excepciones EX-1..EX-4 controladas); append-only. | A-06.4 LEGAL-G7; A-06.7 14-human-review | — | VIGENTE — mapa detallado en `08-automation.md` |

## 8. Conservación

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla previa | 2 años (no contratados) presentado como "recomendado + revisión legal". LEGAL-G8 CONDICIONAL. | A-06.4 10-retention | **SÍ** — nueva ley 2025 exige re-verificación de base | **RE-CLASIFICADO en A-06.8 (10): 2 años = RECOMMENDED (práctica de diseño), NO obligación legal; plazo definitivo LEGAL_REVIEW** |

## 9. Acceso

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | Mínimo privilegio por rol; audit trail de accesos; IA sin acceso autónomo. | A-06.4 LEGAL-G9; 11-access-control | — | VIGENTE — matriz re-expresada 8 roles × 7 acciones en `11-access.md` |

## 10. Seguridad

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | Medidas técnicas + organizativas; cifrado; control de acceso; auditoría; notificación de brechas (destino legal = REVISIÓN LEGAL; ver SABG en 02). | A-06.4 LEGAL-G9 | **SÍ** — cambio de autoridad garante (INAI→SABG) | ACTUALIZADO en `02-current-law.md` §6 |

## 11. Transferencias

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | Transferencia EvaluHR↔cliente requiere contrato de encargamiento + consentimiento + aviso; cloud internacional requiere garantías. | A-06.4 (Art 37 + Reglamento Art 74 — referencias de la ley 2010) | **SÍ** — renumeración bajo nueva ley | MANTENIDA EN PRINCIPIO; **renumeración REQUIERE REVISIÓN LEGAL** (`02-current-law.md` §3) |

## 12. Trazabilidad

| Dimensión | Conclusión consolidada | Fuente previa | ¿Evidencia nueva? | Estado |
|---|---|---|---|---|
| Regla | Cadena completa: pregunta→competencia→indicador→evidencia→nivel→decisión; append-only; logs de acceso y export; purge registrado. | A-06.4 17-traceability; A-06.5 16; A-06.6 14 | — | VIGENTE |

## 13. Conclusión

El expediente legal consolidado mantiene las 12 conclusiones previas. Dos actualizaciones por
evidencia nueva: (1) protocolo obligatorio de revelación involuntaria (05) — evidencia del piloto;
(2) re-clasificación de la retención a RECOMMENDED + re-verificación del marco normativo
(02) — nueva ley de datos 2025 y nuevo autoridad garante (SABG). **Ninguna conclusión previa fue
debilitada; ninguna pregunta cambió a ACTIVE; G7 sigue bloqueado hasta revisión legal profesional.**
