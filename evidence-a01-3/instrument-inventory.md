# A-01.3 — PASO 1: INVENTARIO DEL INSTRUMENTO

> Expediente maestro y gobernanza de:
> **EVALHR-PERSONALIDAD-IPIP50-MX**
> Documento de solo lectura. NO modifica código, reactivos, scoring ni base de datos.
> Fecha de elaboración: 2026-09-09. Base: implementación v1.0 en el repositorio (Fase A-01.2).

## 1. Identificación

| Campo | Valor |
|---|---|
| Nombre comercial en EvaluHR | Evaluación de Personalidad — Modelo Big Five |
| Nombre de la fuente | IPIP Big-Five Factor Markers — 50 items ("Spanish Translation of the Lexical Big-Five Factor Markers") |
| instrumentId | `EVALHR-PERSONALIDAD-IPIP50-MX` |
| instrumentVersion | `1.0` |
| languageVersion | `ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA` |
| scoringVersion | `IPIP50-BFM-1.0` |

## 2. Fuente y autoría

| Campo | Valor |
|---|---|
| Fuente oficial | IPIP — International Personality Item Pool, https://ipip.ori.org |
| Página de la versión utilizada | https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm |
| Título literal de la página | "Spanish Translation of the Lexical Big-Five Factor Markers" |
| Autor de la adaptación (traducción mexicana) | **Rodrigo de Oliveira** (texto literal del sitio IPIP: "Provided by Rodrigo de Oliveira") |
| Referencia científica de la adaptación | de Oliveira, R., Cherubini, M., & Oliver, N. (2013). Influence of personality on satisfaction with mobile phone services. *ACM Transactions on Computer-Human Interaction*, 20(2), Article 10, 10:1–10:23. DOI: 10.1145/2463579.2463581 |
| Estatus de derechos | IPIP declara sus ítems en **dominio público** (ver `02-rights-of-use.md`). EvaluHR NO reclama autoría de reactivos ni de la traducción. |
| Fecha de captura de la fuente | 2026-09-07 (evidencia: `evidence-a01/ipip-ori-esmx-capture.txt`, `evidence-a01/a01-ipip-source-capture.md`) |

## 3. Estructura del instrumento

| Campo | Valor |
|---|---|
| Número de ítems | **50** |
| Factores | 5: EXTRAVERSION, AGREEABLENESS, CONSCIENTIOUSNESS, EMOTIONAL_STABILITY, INTELLECT |
| Ítems por factor | **10** (c/u, clave oficial IPIP) |
| Ítems inversos (reverse) | **24** — según sufijo `r` de la clave oficial: q02r, q04r, q06r, q08r, q10r, q12r, q14r, q16r, q18r, q20r, q22r, q24r, q26r, q28r, q29r, q30r, q32r, q34r, q36r, q38r, q39r, q44r, q46r, q49r |
| Ítems directos | **26** |
| Desglose de inversos por factor | E: 5 (q06r, q16r, q26r, q36r, q46r) · A: 4 (q02r, q12r, q22r, q32r) · C: 4 (q08r, q18r, q28r, q38r) · ES: 8 (q04r, q14r, q24r, q29r, q34r, q39r, q44r, q49r) · I: 3 (q10r, q20r, q30r) |
| Orden de presentación | Orden oficial IPIP 1–50 (ítems de distintos factores intercalados, alternando +/− keyed, según el diseño del inventario IPIP) |
| Mapa completo de reactivos | `04-item-map.csv` (50 filas, generado 1:1 desde el módulo implementado) |

## 4. Escala y scoring

| Campo | Valor |
|---|---|
| Escala de respuesta | 1–5 (exactitud): 1 Muy inexacta · 2 Moderadamente inexacta · 3 Ni exacta ni inexacta · 4 Moderadamente exacta · 5 Muy exacta (anclas oficiales IPIP, renderizadas al español) |
| Instrucción de administración | Render en español de la instrucción de muestra oficial IPIP (IPIP declara que no existe procedimiento estandarizado — "These are suggestions, not requirements") |
| Inversión | `6 − valor`, SOLO en los 24 ítems con `reverse=true` de la clave oficial |
| Puntaje por factor | SUMA de los 10 ítems del factor. **Sin pesos.** |
| Rango por factor | 10–50 |
| Representación visual | `raw / 50 × 100` → 0–100. **NO es percentil. No implica norma poblacional.** |
| Baremos propios | **No existen.** |
| Pesos de selección laboral | **No existen.** |
| Score global/overall psicométrico | **No existe** (el scorer no produce ninguna salida combinada). |
| Completitud requerida | Los 10 ítems de CADA factor deben estar respondidos para emitir puntajes (`complete=true`); si no, `raw=null` y `visual=null`. |
| IA en scoring/interpretación | **Cero participación.** El scorer es una función pura y determinista. La IA no genera, modifica, puntúa ni interpreta. |

Especificación completa: `05-scoring-specification.md`.

## 5. Estado actual (a la fecha del expediente)

| Campo | Estado |
|---|---|
| Estado del instrumento | **ACTIVO — v1.0 en producción demo** |
| Origen de las 50 preguntas | Generadas desde `IPIP50_ITEMS` (módulo verbatim, 0 ítems IA). Los 10 ítems Big Five del instrumento PSICOMETRICA legacy están **DEPRECADOS**: ya no se generan y el array fue eliminado del generador de plantillas. |
| Migración | `scripts/a01-migrate-ipip50.ts` (idempotente: depreca templates legacy sin respuestas históricas; conserva los que tienen respuestas) |
| Verificación determinista | `scripts/a01-ipip50-tests.ts` — TEST 1–10: **48/48 verificaciones OK** (`evidence-a01/a01-tests-results.txt`) |
| E2E | `scripts/a01-e2e-ipip50.ts` — flujo API real completo: **TODAS LAS VERIFICACIONES OK** (`evidence-a01/a01-e2e-results.txt`) |
| Verificación anti-IA | TEST 9: los 50 textos verificados 1:1 contra la captura de la fuente oficial (`evidence-a01/ipip-ori-esmx-capture.txt`) |

## 6. Archivos donde está implementado (inventario de código)

| Archivo | Rol |
|---|---|
| `src/lib/instruments/ipip50-mx.ts` | **Módulo único del instrumento**: 50 ítems verbatim, versionado, instrucción, escala, scorer `scoreIPIP50`, visual `ipip50VisualFromRaw`, summary `buildIPIP50Summary`, disclaimer `IPIP50_RESULT_DISCLAIMER`, categorías `IPIP_*` |
| `src/lib/generate-templates.ts` | Generación de plantillas: PSICOMETRICA = IPIP-50-MX (50 preguntas, orden oficial 1–50) |
| `prisma/seed.ts` | Siembra de 5 posiciones con template IPIP-50-MX + metadata de versiones |
| `src/app/api/evaluations/route.ts` | Scoring al completar evaluación (rama IPIP: categorías IPIP_*, raws + versiones en columnas separadas; IPIP NO entra al overallScore) |
| `src/app/api/public/apply/route.ts` | Scoring en postulación pública (raws IPIP + versiones; overallScore legacy intacto y SIN IPIP) |
| `src/components/views/EvaluationView.tsx` | UI candidato: título, instrucción, escala 1–5 de exactitud para secciones IPIP_ |
| `src/components/views/CandidateDetailView.tsx` | UI RH: card IPIP con 5 dimensiones (raw X/50 + %), radar, atribución, versiones, disclaimer literal, nota "no constituye percentil" |
| `src/components/views/CompareView.tsx` | Excluye resultados IPIP de la comparación de dimensiones legacy |
| `src/lib/store.ts` | `CandidateResult` con campos opcionales IPIP (raws, versiones, instrumentId) |
| `prisma/schema.prisma` (SQLite demo) | `EvaluationTemplate` +4 campos de versión; `EvaluationResult` y `VacancyApplication` +4 versión +5 raws (`extraversionRaw`, `agreeablenessRaw`, `conscientiousnessRaw`, `emotionalStabilityRaw`, `intellectRaw`) — null = legacy |
| `prisma/schema.prod.prisma` (PostgreSQL staging) | Mismas columnas (paridad verificada 18/18 en A-01.2) |
| `scripts/a01-migrate-ipip50.ts` | Migración idempotente legacy → IPIP |
| `scripts/a01-ipip50-tests.ts` | 10 tests deterministas (48 verificaciones) |
| `scripts/a01-e2e-ipip50.ts` | E2E vía API real |

## 7. Instrumentos NO afectados (aislamiento verificado)

El instrumento legacy de 10 ítems (categorías OPENNESS, CONSCIENTIOUSNESS, EXTRAVERSION,
AGREEABLENESS, NEUROTICISM, STRESS, EMPATHY, …) y su scoring NO fueron modificados.
TEST 8 verifica: 0 textos legacy en el instrumento nuevo, 0 colisión de categorías
(prefijo `IPIP_`), el scorer IPIP ignora categorías legacy y viceversa. Los instrumentos
de conocimientos, integridad, competencias y recomendaciones mantienen su scoring y
fórmulas intactos (regresión verificada en A-01.2; tsc igual al baseline).

## 8. Cadena de evidencia del expediente

| Evidencia | Ubicación |
|---|---|
| Captura textual de la fuente oficial (50 ítems es-MX + referencia) | `evidence-a01/ipip-ori-esmx-capture.txt` |
| Nota de captura de fuente (clave oficial, licencia, distribución) | `evidence-a01/a01-ipip-source-capture.md` |
| Captura de la página de administración IPIP (instrucción, formato, clave +/−) | `evidence-a01/ipip-ori-50-item-scale-administration.json` |
| Resultados de los 10 tests deterministas | `evidence-a01/a01-tests-results.txt` |
| Resultados E2E | `evidence-a01/a01-e2e-results.txt` |
| Capturas de navegador (candidato y RH) | `evidence-a01/browser-*.png` |
| Metadatos publicados del estudio 2013 (Semantic Scholar API) | `evidence-a01-3/raw/semanticscholar-2463579.2463581.json` |
| PDF de acceso abierto del estudio 2013 (23 páginas) | `evidence-a01-3/raw/deoliveira2013-tochi-openaccess.pdf` |
| Mapa de los 50 reactivos | `evidence-a01-3/04-item-map.csv` |

— FIN DEL INVENTARIO —
