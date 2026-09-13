# A-06.4 — 21 · Gates Legales (PASO 23)

## 1. Sistema LEGAL-G1..G10

Para que la entrevista estructurada BDI/STAR se active en V1 productivo, debe pasar 10 gates legales. Cierran COMP-G8 (A-06.1) e INT-G7 (A-06.3).

Estados: **NO EVALUADO → APROBADO → FALLADO (NO IMPLEMENTAR)**.

---

## LEGAL-G1 — Finalidad

| Aspecto | Valor |
|---|---|
| Criterio | Finalidad canónica definida y comunicada al candidato (`02-purpose.md`) |
| Estado | ✔ APROBADO — finalidad documentada: "obtención de evidencia conductual relacionada con las competencias y criterios del puesto específico dentro del proceso de selección laboral" |
| Fuente | LFPDPPP Art 6 (finalidad) |

## LEGAL-G2 — Proporcionalidad

| Aspecto | Valor |
|---|---|
| Criterio | Cada pregunta responde las 5 preguntas de proporcionalidad (`05-proportionality.md`) |
| Estado | ✔ APROBADO (análisis) — regla definida; aplicar por pregunta antes de APPROVED |
| Fuente | LFPDPPP Art 6 (proporcionalidad) |

## LEGAL-G3 — Datos personales

| Aspecto | Valor |
|---|---|
| Criterio | Clasificación de categorías de datos (`03-data-categories.md`); recoger solo lo necesario |
| Estado | ✔ APROBADO (análisis) — 7 categorías clasificadas; regla de minimización |
| Fuente | LFPDPPP Art 6 |

## LEGAL-G4 — Datos sensibles

| Aspecto | Valor |
|---|---|
| Criterio | Prohibición de recoger datos sensibles en entrevista (salvo BFOQ con consentimiento expreso) |
| Estado | ✔ APROBADO (análisis) — `04-prohibited-data.md` + `13-discrimination.md` |
| Fuente | LFPDPPP Art 7 (consentimiento expreso); LFT Art 3 |
| Acción | Aplicar por pregunta; BFOQ requiere LEGAL_REVIEW |

## LEGAL-G5 — No discriminación

| Aspecto | Valor |
|---|---|
| Criterio | Matriz de no discriminación aplicada; preguntas prohibidas NO_PUBLICABLE |
| Estado | ✔ APROBADO (análisis) — matriz `13-discrimination.md` completa |
| Fuente | LFT Art 3; LFPEPD; CONAPRED; Constitución Art 1 |
| Acción | Aplicar a cada pregunta antes de ACTIVE |

## LEGAL-G6 — IA

| Aspecto | Valor |
|---|---|
| Criterio | IA asiste pero NO decide; no infiere atributos protegidos ni rasgos latentes |
| Estado | ✔ APROBADO (análisis) — `08-ai-boundaries.md` + `07-automated-decisions.md` |
| Fuente | LFPDPPP (transparencia); LFT Art 3 (no inferencia discriminación) |

## LEGAL-G7 — Decisión humana

| Aspecto | Valor |
|---|---|
| Criterio | Revisión humana obligatoria; IA no decide nivel/contratación; append-only |
| Estado | ✔ APROBADO (análisis) — `16-human-review.md` + `12-conflicts.md` |
| Fuente | LFT + LFPDPPP (revisión humana); Art 37 Bis (no única base) |

## LEGAL-G8 — Conservación

| Aspecto | Valor |
|---|---|
| Criterio | Plazo de retención definido + mecanismo de purge + suspensión ante queja |
| Estado | ⚠ CONDICIONAL — `10-retention.md` define plazo recomendado (2 años no contratados); plazo exacto REQUIERE REVISIÓN LEGAL (LFPDPPP 2025) |
| Acción | Confirmar plazo legal con abogado |

## LEGAL-G9 — Seguridad

| Aspecto | Valor |
|---|---|
| Criterio | Medidas de seguridad técnicas + organizativas; control de acceso; auditoría |
| Estado | ✔ APROBADO (análisis) — `11-access-control.md` + `17-traceability.md` |
| Fuente | LFPDPPP (principio de seguridad) |

## LEGAL-G10 — Transparencia

| Aspecto | Valor |
|---|---|
| Criterio | Información al candidato (10 elementos); aviso de privacidad actualizado; consentimiento documentado |
| Estado | ⚠ CONDICIONAL — `06-consent-information.md` define requisitos; `18-contract-impact.md` identifica cambios necesarios en aviso/contrato; redacción requiere revisión legal |
| Acción | Redactar aviso + contrato actualizados con abogado |

---

## 2. Estado actual (resumen)

| Gate | Estado | Bloquea V1 si FALLA |
|---|---|---|
| LEGAL-G1 Finalidad | ✔ APROBADO | NO |
| LEGAL-G2 Proporcionalidad | ✔ APROBADO (análisis) | NO (aplicar por pregunta) |
| LEGAL-G3 Datos personales | ✔ APROBADO (análisis) | NO (aplicar) |
| LEGAL-G4 Datos sensibles | ✔ APROBADO (análisis) | NO (aplicar; BFOQ requiere LEGAL_REVIEW) |
| LEGAL-G5 No discriminación | ✔ APROBADO (análisis) | NO (aplicar) |
| LEGAL-G6 IA | ✔ APROBADO (análisis) | NO |
| LEGAL-G7 Decisión humana | ✔ APROBADO (análisis) | NO |
| LEGAL-G8 Conservación | ⚠ CONDICIONAL | SÍ (plazo exacto REQUIERE REVISIÓN LEGAL) |
| LEGAL-G9 Seguridad | ✔ APROBADO (análisis) | NO |
| LEGAL-G10 Transparencia | ⚠ CONDICIONAL | SÍ (aviso + contrato requieren redacción legal) |

## 3. Gates que bloquean activación V1

- **LEGAL-G8** (Conservación): plazo exacto REQUIERE REVISIÓN LEGAL.
- **LEGAL-G10** (Transparencia): aviso de privacidad + contrato requieren redacción legal.

Estos dos gates son los que **cierran COMP-G8 e INT-G7**. Sin ellos, la entrevista no se activa en V1.

## 4. Camino a activación V1

1. **LEGAL-G8**: revisión legal del plazo de retención (LFPDPPP 2025).
2. **LEGAL-G10**: redacción del aviso de privacidad + contrato actualizados con abogado.
3. Aplicar LEGAL-G2/G3/G4/G5 a cada pregunta de la guía piloto.
4. Combinar con INT-G9 (pilotaje) de A-06.3.

Tiempo estimado: 1–2 meses (revisión legal) + pilotaje.

## 5. Decisión

La entrevista estructurada **NO se activa en V1 ship-block** hasta que LEGAL-G8 + LEGAL-G10 se completen (con revisión legal profesional). A-06.4 es auditoría legal + diseño; la implementación requiere fase A-06.x separada + asesoría legal.
