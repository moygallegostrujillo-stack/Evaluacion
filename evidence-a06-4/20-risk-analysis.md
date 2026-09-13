# A-06.4 — 20 · Análisis de Riesgos (PASO 20)

## 1. Clasificación

| Nivel | Significado |
|---|---|
| CRITICAL | Riesgo que bloquea activación V1; requiere mitigación obligatoria antes de productivo |
| HIGH | Riesgo alto; requiere mitigación fuerte antes de productivo |
| MEDIUM | Riesgo medio; requiere mitigación |
| LOW | Riesgo bajo; monitorear |
| INFO | Informativo; no requiere mitigación |

## 2. Matriz de riesgos

| # | Riesgo | Severidad | Detalle | Mitigación |
|---|---|---|---|---|
| R1 | Discriminación | CRITICAL | Preguntas que elicitan atributos protegidos → LFT Art 3, LFPEPD, CONAPRED | Matriz `13-discrimination.md` + guía aprobada + prohibición de improvisación + auditoría |
| R2 | Datos sensibles | CRITICAL | Recopilación de datos sensibles sin consentimiento expreso → LFPDPPP Art 7 | Prohibición de recoger datos sensibles; BFOQ restrictivo con consentimiento expreso; revisión legal |
| R3 | Sobre-recogida | HIGH | Recoger más datos de los necesarios → LFPDPPP Art 6 proporcionalidad | Regla de 5 preguntas (`05-proportionality.md`); minimización |
| R4 | IA (inferencia indebida) | HIGH | IA infiere atributos protegidos o rasgos latentes | Prohibición explícita `08-ai-boundaries.md`; AI_DRAFT_ORIGIN + HUMAN_REVIEWED |
| R5 | Decisiones automatizadas | CRITICAL | IA decide nivel/contratación sin humano | Cadena Evidencia → Revisión humana → CompetencyResult; LEGAL-G7 |
| R6 | Acceso indebido | HIGH | Personal no autorizado accede a datos de entrevista | Matriz de permisos `11-access-control.md` + auditoría de acceso |
| R7 | Conservación excesiva | MEDIUM | Conservar más allá del plazo necesario → LFPDPPP Art 6 | Plazo definido `10-retention.md` + purge; REQUIERE REVISIÓN LEGAL para plazo exacto |
| R8 | Trazabilidad insuficiente | MEDIUM | No poder reconstruir qué pasó en la entrevista | Audit trail `17-traceability.md` + append-only |
| R9 | Transferencia internacional (cloud) | MEDIUM | Datos en cloud fuera de MX → LFPDPPP Art 37 | Garantías + aviso + revisión legal |
| R10 | Uso secundario | MEDIUM | Usar datos de entrevista para otra finalidad (e.g. marketing) → LFPDPPP Art 12 | Finalidad canónica `02-purpose.md`; nuevo consentimiento para cambio de finalidad |
| R11 | Grabación indebida | HIGH | Grabar audio/video sin consentimiento expreso → LFPDPPP Art 7 | Modalidad A (sin grabación) recomendada V1; C/D no recomendadas (`09-recording-transcription.md`) |
| R12 | Sesgo del entrevistador | HIGH | Halo, similaridad, confirmación, drift | Guía estructurada + rúbrica + entrenamiento + calibración (A-06.3 `13-bias.md`) |
| R13 | BFOQ mal aplicado | HIGH | Invocar BFOQ sin justificación → discriminación | BFOQ restrictivo, caso por caso, revisión legal, no automatizable (`14-bfoq.md`) |
| R14 | IA como autoridad | MEDIUM | Humano acepta ciegamente sugerencia IA | rationale textual humano + advertencia visible + auditoría |
| R15 | Contrato/aviso no actualizado | MEDIUM | Contrato y aviso no reflejan entrevista estructurada | `18-contract-impact.md` identifica cambios; redacción requiere revisión legal |
| R16 | Brecha de seguridad | HIGH | Filtración de datos de entrevista | Medidas de seguridad técnicas + notificación de brechas |
| R17 | Revelación involuntaria de sensible | MEDIUM | Candidato revela dato sensible en narración STAR | No registrar; no usar; continuar sin profundizar (`04-prohibited-data.md` §5) |
| R18 | Falta de revisión legal (LFPDPPP 2025) | HIGH | Reforma 2025 introduce obligaciones no cubiertas | REQUIERE REVISIÓN LEGAL profesional |
| R19 | Perfil ideal | LOW | Tentación de construir "perfil ideal" por puesto | Regla: no perfil ideal; competencias evaluadas individualmente |
| R20 | Competencia como veto | HIGH | Competencia INSUFFICIENT descalifica automáticamente | Regla: no veto automático; decisión humana |

## 3. Severidad agregada

- **CRITICAL**: 3 (R1, R2, R5)
- **HIGH**: 7 (R3, R4, R6, R11, R12, R13, R16, R18, R20) — nota: 9 si contamos R18 y R20
- **MEDIUM**: 6 (R7, R8, R9, R10, R14, R15, R17)
- **LOW**: 1 (R19)
- **INFO**: 0

## 4. Riesgos críticos

### R1, R2, R5 (CRITICAL)

Estos tres riesgos **bloquean** la activación de la entrevista en V1:
- **R1 Discriminación**: sin matriz de no discriminación + guía aprobada, la entrevista puede discriminar.
- **R2 Datos sensibles**: sin prohibición de datos sensibles, la entrevista viola LFPDPPP Art 7.
- **R5 Decisiones automatizadas**: sin revisión humana obligatoria, la IA puede decidir (prohibido).

Mitigación: LEGAL-G4 + LEGAL-G5 + LEGAL-G7 gates deben pasar antes de activación.

## 5. Mitigación general

La mitigación es **estructural** (gobernanza + proceso), no solo técnica:
- Guía aprobada + probes aprobados + rúbrica (no improvisación).
- Matriz de no discriminación aplicada.
- Consentimiento informado + aviso de privacidad actualizado.
- Revisión humana obligatoria (append-only).
- Auditoría de acceso + trazabilidad.
- Revisión legal profesional (LFPDPPP 2025).

## 6. Conexión con gates

Los riesgos se mitigan pasando LEGAL-G1..G10 (ver `21-gates.md`).
