# EVALUHR — A-03.1 · PASO 14
# SEGURIDAD METODOLÓGICA DEL INSTRUMENTO DE CONOCIMIENTOS

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.2 PASO 13 (audit trail, append-only); A-02.5 PASO 15
> (anti-manipulación); PASOS 4/7/11/15/19 de esta fase.

---

## 1. Amenazas que el modelo debe bloquear (encargo)

El encargo exige protección explícita contra seis riesgos del pipeline de
conocimientos. A continuación, cada amenaza y su protección de diseño
(reglas KSEC):

| # | Amenaza | Protección de diseño | Detección / remediación |
|---|---|---|---|
| 1 | **Preguntas duplicadas** | KSEC-1: prevención por diseño (dominios cerrados + cobertura declarada K-BP-3) + chequeo de duplicidad textual/semántica **antes** de REVIEW (IA puede marcar candidatos; el dictamen es humano — AI-X23). Un duplicado de un item ACTIVE = REJECTED (KI-VAL) | Si se detecta post-publicación: item duplicado SUSPENDED; administraciones afectadas → INSUFFICIENT (KR-1.5) |
| 2 | **Claves incorrectas** | KSEC-2: la clave exige rationale defendible contra la source (KI-VAL-3), revisión por experto de contenido distinto del autor (separación de duties) y aprobación registrada. Prohibida la corrección de clave "en caliente" (K-CA-4) | Clave incorrecta confirmada ⇒ item SUSPENDED inmediato; administraciones que la usaron puntuadas → score no reconstruible ⇒ INSUFFICIENT con causa; nueva versión del item con clave corregida; re-administración como decisión humana |
| 3 | **Reactivos ambiguos** | KSEC-3: revisión adversaria obligatoria (KI-VAL-5: buscar la interpretación que rompe la clave); rechazo si no es corregible | Ambigüedad descubierta después ⇒ SUSPENDED + revisión de administraciones (idéntico tratamiento a 2) |
| 4 | **Generación IA sin revisión** | KSEC-4: es estructuralmente imposible bajo este modelo — todo item nace DRAFT (KI-1), el flujo es secuencial obligatorio (PASO 5), ACTIVE exige flujo completo + KPUB (PASO 19). "Aprobar por lote sin lectura" = violación de gobernanza | Auditoría periódica: muestreo de items ACTIVE verificando reviewedBy ≠ null y ≠ autor, correcciones registradas, rationale presente |
| 5 | **Modificación posterior del reactivo** | KSEC-5: inmutabilidad del item ACTIVE (KI-5): cualquier cambio ⇒ nueva itemVersion y regreso a DRAFT/REVIEW; administraciones ligadas a la versión exacta administrada; historial append-only | Cualquier diff no versionado detectado = anomalía de integridad → auditoría del audit trail |
| 6 | **Cambio de clave después de administrar la prueba** | KSEC-6: **prohibido retroactivamente** — la clave que puntúa una administración es la de la itemVersion administrada. Corregir la clave para el futuro = nueva versión del item (y del assessment); resultados históricos **no se re-puntúan**; si la clave era incorrecta, esos resultados → INSUFFICIENT/INVALID con causa documentada | Regla registrada en gobernanza; el KnowledgeResult conserva scoringVersion + itemVersion que hacen verificable qué clave se usó |

## 2. Reglas transversales de seguridad

1. **KSEC-7 (integridad de registros)**: todo el ciclo (blueprint, item,
   clave, revisión, administración, respuesta, score, resultado) vive en
   registros append-only con actor y fecha (herencia A-02.2 PASO 13 /
   A-02.5 PASO 15); prohibida la edición silenciosa y el borrado.
2. **KSEC-8 (separación de duties)**: autor ≠ revisor ≠ aprobador; la
   aprobación/publicación es acto de gobernanza distinto de la autoría.
   La IA puede estar en el rol de *asistente de borrador* únicamente.
3. **KSEC-9 (exposición de claves)**: las claves y rationale **no se exponen
   al candidato** durante la administración ni después (protegen la validez
   futura del instrumento); su acceso queda restringido a roles de
   gobernanza y registrado.
4. **KSEC-10 (exhaustividad de set)**: la administración registra el set
   exacto de items presentados (ids + versiones); sin ese registro, el
   scoring no es reconstruible → INSUFFICIENT (KSC-2).
5. **KSEC-11 (re-evaluación por cambios externos)**: si cambia la norma,
   el manual o el documento citado (source), los dominios/items afectados
   pasan a revisión obligatoria (herencia REVIEW obligatorio de A-02.5
   PASO 18 §2.2).

## 3. Principio general

La seguridad metodológica no es un módulo adicional: es una **propiedad del
diseño** — dominios cerrados, flujo secuencial, inmutabilidad versionada,
separación de duties y append-only hacen que cada amenaza del encargo
requiera, para materializarse, **violar deliberadamente** una regla
registrada y auditable. El objetivo es que el error (o el abuso) deje
huella y no contamine silenciosamente resultados de candidatos.
