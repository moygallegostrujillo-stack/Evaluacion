# A-05.1 — 06 · COMPARACIÓN CON IPIP-50-MX (PASO 7)

## 1. Premisa

**NO se asume que IPIP-50-MX esté implementado.** A-04.4 (forense git) demostró que IPIP NUNCA existió en esta historia git (grep = 0; pickaxe `git log -S "IPIP" -- src/ -- prisma/` = 0 commits). A-05.1 re-confirma: `rg "IPIP|ipip" src/` = 0 matches. IPIP-50-MX se evalúa aquí **solo como alternativa documental**, no como instrumento en uso.

## 2. ¿Qué es IPIP-50-MX?

IPIP-50-MX sería una adaptación al español mexicano del **IPIP-50 (International Personality Item Pool, 50 ítems)** de Goldberg (1999/2006). IPIP es un repositorio de ítems de personalidad en **dominio público** hospedado en ipip.ori.org.

- **Autores**: Lewis R. Goldberg (1999) y colaboradores (2006, JRP 40, 84–96).
- **Constructo**: Big Five (OCEAN) — 5 dimensiones × 10 ítems.
- **Derechos**: «items and scales are in the public domain… copy, edit, translate, or use them for any purpose without asking permission» (ipip.ori.org, página de citación newCitation.htm — verificada en A-04.1).
- **Citación requerida**: Goldberg (1999) y/o Goldberg et al. (2006) + la escala específica (nunca llamar «el IPIP» a una escala concreta).

## 3. ¿Existe una adaptación mexicana formal?

**UNKNOWN / NO verificada como producto terminado.**

- IPIP permite traducir sin permiso (public domain).
- Existen representaciones IPIP en español en la comunidad científica.
- No se verificó una traducción oficial específica «IPIP-50-MX» con baremos mexicanos publicados en A-04.1.
- Cualquier adaptación requeriría validación propia (EFA/CFA, α, baremos) en muestra mexicana.

## 4. Comparación: Big Five demo actual vs. IPIP-50-MX (documental)

| Criterio | Big Five demo actual | IPIP-50-MX (documental) |
|---|---|---|
| Fuente | UNKNOWN (paráfrasis vagas) | ipip.ori.org (PUBLIC DOMAIN verificada) |
| Autor | Desarrollador (no documentado) | Goldberg (1999/2006) |
| Derechos | UNKNOWN | PUBLIC DOMAIN (uso sin permiso; atribución requerida) |
| N° de ítems | 10 | 50 |
| Ítems por dimensión | 2 | 10 |
| Scoring | Likert 1–5, `((avg−1)/4)·100` | Likert 1–5; scoring documentado por escala |
| Confiabilidad esperada | α < .60 (2 ítems/dim) | α ≈ .70–.85 (10 ítems/dim, según literatura IPIP) |
| Estructura factorial | No verificada | Verificada en literatura (5 factores replicados) |
| Validez predictiva laboral | NOT ESTABLISHED | Existente en literatura (Barrick & Mount meta; Ones) |
| Contexto mexicano | NO ESTABLECIDO | Requiere validación propia (traducción existe pero baremos MX no verificados) |
| Idioma | Español MX informal | Español (traducción comunitaria); baremos MX requieren validación |
| Faking / deseabilidad social | ALTO (face-valid, 2 ítems/dim) | MEDIO (face-valid pero 10 ítems/dim da más robustez) |
| Versionado | Sin versión | Escalas versionadas en ipip.ori.org |
| Atribución cumplida | NO (no cita Goldberg) | Requerida al implementar |

## 5. Ventajas de IPIP-50-MX sobre el demo actual

1. **Fuente verificable** (ipip.ori.org) con atribución documentada.
2. **10 ítems por dimensión** → α esperado .70–.85 vs. < .60 actual.
3. **Estructura factorial replicada** en literatura internacional.
4. **Derechos claros** (public domain) — sin riesgo de licencia.
5. **Scoring documentado** por escala (no fórmula arbitraria).
6. **Versionado** del item set en ipip.ori.org.

## 6. Limitaciones de IPIP-50-MX

1. **Baremos mexicanos no verificados** — cualquier adaptación requiere validación propia (EFA/CFA, α, baremos en muestra MX).
2. **50 ítems vs. 10 actuales** → mayor tiempo de respuesta (~5–7 min vs. ~1–2 min). Puede afectar tasa de finalización en vacancies públicas.
3. **Faking persistente** — IPIP es face-valid; un candidato motivado puede distorsionar. IPIP no incluye escala de deseabilidad social (habría que añadirla por separado).
4. **Traducción** — aunque IPIP permite traducir, la calidad psicométrica de una traducción ad-hoc sin protocolo ITC 2017 es incierta.
5. **Citación obligatoria** — Goldberg (1999/2006) + escala específica; si se omite, se pierde el respaldo public-domain.

## 7. Conclusión PASO 7

IPIP-50-MX es una alternativa **metodológicamente superior** al demo actual en todos los planos técnicos (fuente, derechos, ítems/dimensión, confiabilidad esperada, estructura, validez). Sus limitaciones (baremos MX, tiempo, faking) son gestionables y son **comunes a cualquier instrumento de personalidad**. La decisión de sustituir queda para PASO 11 (doc 10).

**Regla respetada**: NO se asume que IPIP-50-MX esté implementado; se evalúa solo como alternativa documental.
