# A-01.3 — PASO 3: DERECHOS DE USO DE LOS MATERIALES IPIP

> Principio rector: **este documento afirma EXCLUSIVAMENTE lo que la fuente oficial
> capturada permite afirmar.** No se invocan derechos, licencias, permisos ni
> obligaciones adicionales que la fuente no conceda.

## 1. Lo que la fuente oficial declara (texto capturado)

La página de administración oficial del IPIP (https://ipip.ori.org/new_ipip-50-item-scale.htm,
capturada el 2026-09-07 en `evidence-a01/ipip-ori-50-item-scale-administration.json`)
declara, en su segundo párrafo justificativo (texto literal en inglés):

> "Second, because the IPIP is in the public domain, users have complete freedom to
> use the IPIP in any way that suits their purposes. They can administer the items on
> the Internet or in paper-and-pencil format. They can use instructions that best
> helps them accomplish their research goals. They can administer the items in any
> order, mixing the items with non-IPIP items if they wish. **They can edit the wording
> of items and translate them into other languages.** They can shorten existing IPIP
> scales or combine similar IPIP scales into a longer scale. They can have respondents
> use a binary true/false or agree/disagree format or rating scales with as many anchor
> points as they wish, with anchor descriptions of their choosing. In short, users have
> the freedom to do what they like with IPIP items."

## 2. Lo que EvaluHR PUEDE afirmar (y afirma) con base en esa declaración

1. Los ítems del IPIP son **de dominio público**, según la declaración del propio
   sitio oficial ipip.ori.org.
2. El sitio declara que los usuarios tienen **libertad para usar** los ítems IPIP,
   incluyendo **administrarlos por Internet**, elegir instrucciones, elegir el formato
   de respuesta (número de anclas y sus descripciones) y **traducirlos**.
3. La versión mexicana utilizada por EvaluHR está **publicada en el propio sitio
   oficial del IPIP** (página "Provided by Rodrigo de Oliveira"), es decir, EvaluHR
   reproduce una versión ya publicada por la fuente, no una edición propia.
4. EvaluHR administra los ítems **verbatim**, con la instrucción de muestra oficial
   del IPIP renderizada al español y con 5 anclas de exactitud, formato que la fuente
   publica como muestra recomendada para hacer resultados comparables con estudios
   previos.

## 3. Lo que EvaluHR NO afirma (y no debe afirmar)

1. **EvaluHR NO reclama autoría** de los reactivos ni de la traducción mexicana.
   La atribución correcta y obligatoria es: reactivos IPIP; traducción mexicana de
   Rodrigo de Oliveira; referencia de Oliveira, Cherubini & Oliver (2013).
2. EvaluHR **NO afirma que posea o haya adquirido ninguna licencia especial** de
   ipip.ori.org, del Oregon Research Institute, de Rodrigo de Oliveira ni de los
   autores del estudio 2013. El dominio público declarado por la fuente es el único
   fundamento de uso invocado.
3. EvaluHR **NO afirma que el dominio público se extienda a materiales ajenos al
   IPIP** citados en el expediente (p. ej., el artículo ACM 2013, que es © ACM con
   permiso de citación; se cita, no se reproduce).
4. EvaluHR **NO modifica, reedita ni "mejora" la traducción** publicada. (La fuente
   permite editar y traducir; EvaluHR deliberadamente no lo hace en v1.0, por regla
   interna de fidelidad y trazabilidad, no por restricción de la fuente.)
5. EvaluHR **NO presenta el instrumento como creado, validado o certificado por
   EvaluHR**.

## 4. Traducción y edición — posición de EvaluHR

La fuente concede libertad para editar y traducir los ítems. No obstante, la política
interna de EvaluHR (gobernanza, `09-governance.md`) es más estricta que la fuente:

- v1.0 usa **exclusivamente** la versión mexicana ya publicada por el IPIP
  (Rodrigo de Oliveira), sin edición.
- Cualquier futura edición o nueva traducción no se haría "en silencio" sobre v1.0:
  generaría una nueva `languageVersion` y pasaría por el proceso de gobernanza
  (nueva versión del instrumento con su propia evidencia).

## 5. Nota sobre el artículo científico (no es parte del instrumento)

El estudio de de Oliveira, Cherubini & Oliver (2013) está publicado en ACM
Transactions on Computer-Human Interaction (© ACM, 2013). El PDF de acceso abierto
utilizado en este expediente proviene del sitio personal de una de las autoras
(nuriaoliver.com, enlace "green open access" registrado por Semantic Scholar) y se
usa únicamente como **fuente de consulta documental y citación con crédito**, no como
material reproducido en el producto. La referencia con crédito es la forma de uso que
el propio aviso de copyright del artículo permite expresamente ("Abstracting with
credit is permitted").

## 6. Atribución implementada en el producto (verificada)

- El módulo `src/lib/instruments/ipip50-mx.ts` encabezado declara la fuente, la
  atribución a Rodrigo de Oliveira, la referencia científica y que "los reactivos y
  la traducción NO son de EvaluHR".
- La vista de RH (`CandidateDetailView.tsx`) muestra la atribución de la fuente junto
  a los resultados.
- Ningún documento del producto atribuye los reactivos a EvaluHR (verificado en la
  auditoría final, `13-audit-checklist.md`).

— FIN DEL DOCUMENTO DE DERECHOS DE USO —
