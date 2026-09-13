# A-04.4 — 07 · AUDITORÍA DE `/api/public/video` (PASO 6)

Archivo: `src/app/api/public/video/route.ts` (287 líneas). SOLO LECTURA — no se modificó nada.

---

## 1. Qué hace el endpoint

POST con `applicationId`, `videoSent`, `token` (HMAC obligatorio desde Fase 3.5-B.2; verificación criptográfica ANTES del lookup, L40–52). Marca el paso de video como completado (`currentStep: 5`, `videoType` WHATSAPP/SKIPPED, L76–80) y, **si recalcula, SOBREESCRIBE el overallScore de la fila**.

## 2. ¿Por qué recalcula overallScore?

Gate exacto (L83): `if (application.overallScore === 0) { … }` — recalcula SOLO cuando el flujo principal dejó el overall en 0 (p. ej. el candidato terminó por la vía de WhatsApp/video sin que `calculateOverallScore` del paso de completado produjera un valor, o el registro quedó sin scoring final). Es un mecanismo de «cierre de scoring» alternativo, no un recálculo general.

## 3. Qué fórmula utiliza (L83–175)

| Elemento | Comportamiento real | Línea |
|---|---|---|
| Presencia Big Five | alguna dimensión `> 0` | L85–86 |
| Presencia Psicológica | alguna dimensión `> 0` | L87–88 |
| Presencia Knowledge | `knowledgeScore !== null && knowledgeScore > 0` — **un 0.00 real (todo mal) cuenta como AUSENTE** | L89 |
| `psicometricaAvg` | `(100 − neuroticism + O + C + E + A) / 5` — **RE-INVIerte el neuroticismo (que los ítems ya invierten) y divide entre 5 FIJO aunque haya dims en 0** | L92–97 |
| `psicologicaAvg` | `(S + E + A + L + T) / 5` — denominador fijo 5 | L100–105 |
| Pesos | BF 0.30 · PSY 0.30 · KN 0.40 — **sin Integridad** | L110–112 |
| Renormalización | **PROPORCIONAL**: `score · (weight / totalWeight)` — única fórmula del sistema que renormaliza así | L119–120 |
| 0 secciones | overall = 0 | L114–115 |
| 1 sección | esa sección cruda | L116–117 |
| Guidance | PERFIL_COMPLETO = BF+PSY+KN (**sin INT**) · PENDIENTE si 0 · resto PARCIAL | L123–132 |
| Escritura | `updateData.overallScore = Math.round(x·100)/100` (L170) + recommendation + `status: 'COMPLETED'` + `completedAt` (L170–174) → `vacancyApplication.update` (L177–180) | — |

## 4. ¿Puede producir un resultado DIFERENTE al flujo principal? **SÍ — por diseño actual**

Divergencias concretas contra F1/F2/F3:

1. **Integridad ausente**: el flujo principal la pondera 0.15–1.00; el video la ignora → mismo candidato, otro overall.
2. **Doble inversión del neuroticismo**: los ítems NEUROTICISM ya usan `reverseScored → 6−v` (F1/F2 L163/L57); el video vuelve a aplicar `100 − neuroticism` (L93) → puntúa al candidato con neuroticismo alto como si fuera estable (o viceversa, según el dato persistido).
3. **Denominadores fijos /5**: el flujo principal promedia solo dimensiones con datos (adaptativo); el video divide entre 5 siempre (los ceros arrastran).
4. **Semántica de 0.00 en Knowledge**: F3 usa `!== null` (0.00 real participa); el video usa `!== null && > 0` (0.00 real = ausente) → renormaliza sin KN.
5. **Guidance distinta**: PERFIL_COMPLETO sin exigir INT (L128) vs con INT en F1/F3 (L313/L637).
6. **Renormalización distinta**: proporcional vs matriz de ramas.
7. **Efecto puente**: crea `EvaluationResult` de visibilidad para RH (L251–274) **sin el campo `integrityScore`** → el registro puente queda con el default `@default(0)` aunque la aplicación tenga integridad real; usa fallbacks `(updateData.overallScore as number) || application.overallScore || 0` (L247).

## 5. Qué instrumentos considera

| Instrumento | ¿Participa? |
|---|---|
| Big Five (demo) | SÍ (0.30) |
| Psicológica | SÍ (0.30) |
| Knowledge | SÍ (0.40, si `!== null && > 0`) |
| **Integridad** | **NO — nunca** |
| Video como instrumento | No: no puntúa contenido de video (no hay storage; solo marca el paso) |

## 6. Manejo de null/0

- Presencia por `> 0` en las tres secciones (L85–89) → 0.00 real ≡ ausente.
- Fallback doble a 0 en el puente (L247).
- Sin `Number(`/`parseFloat(` en el archivo.
- Riesgo colateral: si el overall real era 0.00 legítimo (todo mal), el gate `=== 0` (L83) obliga a recalcular — coherente con su propósito, pero otro 0 persistido por retiro de consentimiento (consent L399–420 resetea sensibles a 0 dejando overall STALE) podría ser re-escrito por este endpoint si el candidato toca el paso de video.

## 7. Conclusión PASO 6

El endpoint recalcula el overall con una **cuarta fórmula divergente** (sin Integridad, neuroticismo re-invertido, denominadores fijos, renormalización proporcional, 0.00-KN = ausente) y **SOBREESCRIBE el overallScore persistido** cuando el gate se cumple. Es la mayor fuente de inconsistencia del global (confirma R7 de A-04.3). No se modificó nada.
