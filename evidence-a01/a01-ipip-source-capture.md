# A-01.2 — CAPTURA DE FUENTE OFICIAL DEL INSTRUMENTO

## Identificación

- Instrumento: **IPIP Big-Five Factor Markers — 50 items**
- Versión lingüística: **Spanish (Mexican)** — traducción publicada en el sitio oficial IPIP
- Atribución de la traducción: **Provided by Rodrigo de Oliveira** (texto literal del sitio IPIP)
- Página de origen: `https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm`
  (título literal: *"Spanish Translation of the Lexical Big-Five Factor Markers"*),
  enlazada desde `https://ipip.ori.org/newTranslations.htm`
- Fecha de captura: 2026-09-07 (sesión A-01.2), mediante extracción del HTML de la página
- Captura textual: `ipip-ori-esmx-capture.txt` (texto plano extraído, sin alteración)

## Referencia bibliográfica (citada literalmente en la página de origen)

> de Oliveira, R., Cherubini, M., Oliver, N. (2013). Influence of personality on
> satisfaction with mobile phone services. *ACM Transactions on Computer-Human
> Interaction*, 20(2) Article 10, 10:1-10:23.
> DOI: http://dx.doi.org/10.1145/2463579.2463581

## Licencia

Los reactivos IPIP son de **dominio público** (declaración del propio sitio
ipip.ori.org: los usuarios pueden usar, traducir y administrar los ítems
libremente). EvaluHR **no reclama autoría** de los reactivos ni de la
traducción; ambos se reproducen verbatim con su atribución.

## Clave de corrección oficial

El sitio IPIP marca los ítems inversos con sufijo `r` en su código
(`q02r`, `q04r`, …). La clave capturada coincide 1:1 con la clave de
corrección publicada en `https://ipip.ori.org/new_ipip-50-item-scale.htm`
(nomenclatura `(1+)`, `(2-)`, … por factor). Captura de esa página:
`ipip-ori-50-item-scale-administration.json`.

Distribución oficial: 50 ítems, 10 por factor.

- EXTRAVERSION: q01, q06r, q11, q16r, q21, q26r, q31, q36r, q41, q46r
- AGREEABLENESS: q02r, q07, q12r, q17, q22r, q27, q32r, q37, q42, q47
- CONSCIENTIOUSNESS: q03, q08r, q13, q18r, q23, q28r, q33, q38r, q43, q48
- EMOTIONAL STABILITY: q04r, q09, q14r, q19, q24r, q29r, q34r, q39r, q44r, q49r
- INTELLECT: q05, q10r, q15, q20r, q25, q30r, q35, q40, q45, q50

## Instrucción de administración

El sitio IPIP (`new_ipip-50-item-scale.htm`) declara explícitamente que
**no existe un procedimiento estandarizado de administración** ("These are
suggestions, not requirements") y que los usuarios eligen las instrucciones
y anclas de respuesta. La instrucción de muestra oficial de IPIP para el
inventario de 50 ítems es (texto literal capturado):

> "Describe yourself as you generally are now, not as you wish to be in the
> future. Describe yourself as you honestly see yourself, in relation to
> other people you know of the same sex as you are, and roughly your same
> age. So that you can describe yourself in an honest manner, your responses
> will be kept in absolute confidence. Indicate for each statement whether it
> is 1. Very Inaccurate, 2. Moderately Inaccurate, 3. Neither Accurate Nor
> Inaccurate, 4. Moderately Accurate, or 5. Very Accurate as a description of you."

EvaluHR administra el instrumento con el render en español de esa instrucción
oficial y sus 5 anclas (Muy inexacta / Moderadamente inexacta / Ni exacta ni
inexacta / Moderadamente exacta / Muy exacta). Los **reactivos NO se
modifican ni se traducen de nuevo**: se usan verbatim de la página de
Rodrigo de Oliveira.

## Reglas de implementación derivadas

1. Los 50 textos se copian VERBATIM (sin corregir ortografía ni estilo).
2. El orden de presentación es el orden oficial 1-50 del inventario.
3. La inversión aplica SOLO a los ítems con sufijo `r` en su código oficial.
4. Ningún reactivo fue generado, "mejorado" o sustituido por IA (0 ítems IA).
