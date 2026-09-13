# A-01.3 — PASO 2: FUENTE OFICIAL IPIP UTILIZADA

> Este documento registra la fuente oficial del instrumento EVALHR-PERSONALIDAD-IPIP50-MX.
> NO se reproducen aquí nuevamente los 50 reactivos (ya capturados y verificados en
> `evidence-a01/ipip-ori-esmx-capture.txt` y en el módulo `src/lib/instruments/ipip50-mx.ts`).

## 1. Identificación de la fuente

| Campo | Valor |
|---|---|
| URL de la escala (versión utilizada) | https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm |
| Título de la escala (literal) | "Spanish Translation of the Lexical Big-Five Factor Markers" |
| Versión | Traducción al español **mexicano** del inventario IPIP de 50 ítems (Big-Five Factor Markers) |
| Institución / proyecto | IPIP — International Personality Item Pool (sitio oficial ipip.ori.org, administrado desde el Oregon Research Institute) |
| Autor de la traducción mexicana | **Rodrigo de Oliveira** — el sitio IPIP publica la página con el texto literal "Provided by Rodrigo de Oliveira" |
| Fecha de consulta / captura | **2026-09-07** (sesión A-01.2; captura textual conservada) |
| Forma de captura | Extracción del texto plano de la página HTML oficial, sin alteración |
| Evidencia de la captura | `evidence-a01/ipip-ori-esmx-capture.txt` (texto completo: encabezado, 50 ítems ES/EN, referencia) y `evidence-a01/a01-ipip-source-capture.md` (nota metodológica) |

La página de la traducción está enlazada desde la página oficial de traducciones del
IPIP (https://ipip.ori.org/newTranslations.htm), lo que la constituye como la vía de
publicación oficial del IPIP para esta versión lingüística.

## 2. Escala base del inventario

- El inventario de 50 ítems es la versión corta oficial del IPIP de los **Big-Five
  Factor Markers** de Goldberg (1992). La propia página de administración del IPIP
  lo declara: *"These five scales were developed to measure the Big-Five factor
  markers reported in the following article: Goldberg, L. R. (1992). The development
  of markers for the Big-Five factor structure. Psychological Assessment, 4, 26-42."*
  (captura: `evidence-a01/ipip-ori-50-item-scale-administration.json`).
- Cinco factores, 10 ítems por factor, con clave de corrección oficial (+keyed / −keyed,
  sufijo `r` en el código del ítem para los inversos).

## 3. Clave de corrección oficial (fuente secundaria del mismo proyecto IPIP)

| Campo | Valor |
|---|---|
| URL de la clave/administración | https://ipip.ori.org/new_ipip-50-item-scale.htm |
| Título (literal) | "Administering IPIP Measures, with a 50-item Sample Questionnaire" |
| Autor de la página | John A. Johnson (meta author del HTML capturado) |
| Contenido verificado | Nomenclatura (1+), (2−)… (5+) por ítem: 24 ítems −keyed y 26 +keyed; coincide 1:1 con los sufijos `r` de la página de la traducción mexicana |
| Fecha de captura | 2026-09-07 |
| Evidencia | `evidence-a01/ipip-ori-50-item-scale-administration.json` (HTML completo, HTTP 200) |

## 4. Instrucción de administración publicada por IPIP

El proyecto IPIP declara expresamente que **no existe un procedimiento estandarizado
de administración** de sus ítems ("These are suggestions, not requirements") y que,
dado su carácter de dominio público, cada usuario elige instrucciones y anclas.

La instrucción de muestra oficial para el inventario de 50 ítems (captura textual,
en inglés) es:

> "Describe yourself as you generally are now, not as you wish to be in the future.
> Describe yourself as you honestly see yourself, in relation to other people you know
> of the same sex as you are, and roughly your same age. So that you can describe
> yourself in an honest manner, your responses will be kept in absolute confidence.
> Indicate for each statement whether it is 1. Very Inaccurate, 2. Moderately Inaccurate,
> 3. Neither Accurate Nor Inaccurate, 4. Moderately Accurate, or 5. Very Accurate as a
> description of you."

EvaluHR administra el instrumento con el render al español de esta instrucción oficial
y sus 5 anclas de exactitud (1 Muy inexacta … 5 Muy exacta). Los **reactivos NO se
retraducen ni se modifican**: se usan verbatim de la página de Rodrigo de Oliveira.

## 5. Referencia científica citada por la propia fuente

La página oficial de la traducción cita como referencia (texto literal capturado):

> de Oliveira, R., Cherubini, M., Oliver, N. (2013). Influence of personality on
> satisfaction with mobile phone services. ACM Transactions on Computer-Human
> Interaction, 20(2) Article 10, 10:1-10:23.
> DOI: http://dx.doi.org/10.1145/2463579.2463581

Esta es la referencia del estudio en el que se desarrolló y publicó la traducción
mexicana. Su análisis se documenta en `03-scientific-evidence.md`.

## 6. Verificación de autenticidad (anti-falsificación)

- Los 50 textos del módulo implementado fueron verificados 1:1 contra la captura
  textual de la página oficial (TEST 9 de `scripts/a01-ipip50-tests.ts`):
  **50/50 verbatim, 0 generados por IA, 0 alterados.**
- La clave de reversión implementada coincide con los sufijos `r` de la fuente y con
  la nomenclatura −keyed de la página de administración IPIP (24 coincidencias exactas).
- El orden de presentación (1–50) es el orden oficial del inventario.

— FIN DEL DOCUMENTO DE FUENTE OFICIAL —
