# EVALUHR — LEGAL MASTER PACKAGE · 22 · INTEGRITY (PASO 19)

## 1. Determinación (verificada en repo)

| Aspecto | Estado | Evidencia |
|---|---|---|
| Estado | **IMPLEMENTADO como instrumento; NO aprobado para agregados** | 10 ítems propios (`generate-templates.ts:48-63`); duplicados en canal público (`public/apply/route.ts:241+`) |
| Evidencia metodológica | Auditoría completa A-04.1–A-04.5 (14+3+3+14+15 archivos); gates de activación GATE-1..10 NO superados | `evidence-a04-2/integrity-activation-gates.md` |
| Derechos | Contenido propio | — |
| Uso | Score 0–100 normalizado, etiqueta "orientative, never auto-filter / never as disqualification (LFPDPPP Art. 37 Bis)" — actualizar cita normativa al marco 2025 (art. 26) | `evaluations/route.ts:243,366` |
| Limitaciones declaradas | Sin validación; dato sensible; orientativo | UI: "Dato sensible (LFPDPPP). Indicador orientativo" (`CandidateDetailView.tsx:501`) |
| Datos tratados | Respuestas de los 10 ítems (sensibles) + score | — |
| ¿Entra a resultados? | Se almacena como `integrityScore` y se MUESTRA a RR.HH. | — |
| ¿Entra a overallScore? | **NO** — excluido por diseño (`overall-score.ts:196-199`, razón `INTEGRITY_NOT_APPROVED_FOR_OVERALL`) | — |
| ¿Entra a JobFit? | **NO EXISTE JobFit** ("JobFit is explicitly NOT implemented", `overall-score.ts:37-40`) | — |

## 2. Riesgos identificados

1. Instrumento sensible visible a RR.HH. sin validez demostrada — riesgo de uso indebido subjetivo ("descalificación informal") pese a los disclaimers.
2. Doble canal (autenticado + público) con ítems duplicados — mantener paridad de protección (consentimiento, retención sensible).
3. Citas normativas en código/UI refieren a la ley derogada (Art. 37 Bis) — actualizar textos.

## 3. Decisión pendiente (dictamen)

1. **Continuar o retirar** el instrumento en V1 (ambas opciones defendibles: aislamiento ya implementado).
2. Si continúa: consentimiento expreso, retención sensible 90 días, prohibición contractual de uso como filtro.
3. No activar nada pendiente: sin feed a overall/JobFit; sin gates de activación.

## 4. Regla

Nada pendiente se activa. Cualquier cambio es post-dictamen (LEGAL-0xx).
