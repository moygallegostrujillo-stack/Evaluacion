# EVALUHR — A-03.1 · PASO 17
# EJEMPLOS CONCEPTUALES — MESERO Y VENDEDOR — EJEMPLO — NO PRODUCTIVO

> Documento de diseño metodológico. NO implementa nada. **NO crea preguntas
> reales para producción.** Todo el contenido de este documento está marcado
> **EJEMPLO — NO PRODUCTIVO**: los reactivos son esquemáticos a propósito
> (no utilizables como reactivos reales) y los puestos son los mismos
> ejemplos hipotéticos usados en A-02.5 (JOB-EJEMPLO-MESERO /
> JOB-EJEMPLO-VENDEDOR). Fecha: 2026-09-10 · Versión: 1.0.

---

## 1. Ejemplo MESERO — blueprint conceptual (EJEMPLO — NO PRODUCTIVO)

```
blueprintId:            KBP-EJEMPLO-MESERO-001 (EJEMPLO-DRAFT)
jobId:                  JOB-EJEMPLO-MESERO
blueprintVersion:       0.1-draft
approvedBy:             PENDIENTE-ANALISIS-REAL (EJEMPLO)
criterio cubierto:      CRIT-CON-EJ001 (A-02.5: norma oficial de higiene en
                        manejo de alimentos) + CRIT-CON-EJ008 (protocolo de
                        servicio de la empresa)

domain:                 HIGIENE (EJEMPLO)
  subdomain:            Higiene personal declarada en el manual EJEMPLO
    knowledgeRequirement: KREQ-EJEMPLO-M01 — "conocer la norma oficial de
                        higiene aplicable" (source: S6 normativa citada —
                        EJEMPLO; knowledgeRelevance: PENDING_REVIEW — faltan
                        R-KREL-4/5)
  subdomain:            Conservación de alimentos (scope: aplicación)
    knowledgeRequirement: KREQ-EJEMPLO-M02 — source: manual interno EJEMPLO
                        v0 (KF7) — knowledgeRelevance: PENDING_REVIEW

domain:                 SERVICIO EN SALA (EJEMPLO)
  subdomain:            Protocolo de servicio definido por la empresa
    knowledgeRequirement: KREQ-EJEMPLO-M03 — content + scope = aplicación en
                        escenarios habituales; source: manual interno
                        EJEMPLO (KF7) — hereda el ejemplo CRIT-CON-EJ008 de
                        A-02.1 (content por definir con la empresa real)
```

Cobertura declarada (K-BP-3, EJEMPLO): 3 reactivos por subdominio.
Ningún dominio real ha completado R-KREL-1..5 ⇒ el blueprint EJEMPLO **no
podría publicarse** tal cual (PASO 19): ilustra la estructura, no un caso
aprobado.

## 2. Ejemplos de reactivos (esquemáticos — EJEMPLO — NO PRODUCTIVO)

### Item A — borrador humano en REVIEW (ilustra el flujo normal)

```
itemId:          ITEM-KN-EJ001 (EJEMPLO — NO PRODUCTIVO)
blueprintId:     KBP-EJEMPLO-MESERO-001 · domain: HIGIENE
question:        "[Reactivo esquemático sobre la norma citada en el
                  dominio HIGIENE — redacción final pendiente de source
                  real]" (ilustración; no es una pregunta utilizable)
options:         4 alternativas esquemáticas (A–D)
correctAnswer:   PROPUESTA "B" — PENDIENTE de validación KI-VAL-3 contra
                 la source real (aún no defendible: source no cargada)
rationale:       POR COMPLETAR (exigido para salir de DRAFT)
difficulty:      UNKNOWN (KD-1: por defecto; sin evidencia, sin juicio
                 registrado)
source:          S6 normativa — EJEMPLO (cita exacta pendiente)
version:         0.1-draft · status: DRAFT · author: humano (EJEMPLO)
reviewedBy:      — (pendiente; será distinto del autor)
```

### Item B — reactivo con clave ausente (ilustra K-INS-1 / PASO 6)

```
itemId:          ITEM-KN-EJ002 (EJEMPLO — NO PRODUCTIVO)
question:        "[Reactivo esquemático de conservación — manual EJEMPLO]"
options:         4 alternativas esquemáticas
correctAnswer:   **AUSENTE** (como el caso vigente del generador: el campo
                 no persistió)
status:          NO PÚBLICABLE (KPUB bloqueado) — si una administración lo
                 incluyera igualmente: item no puntuable → KnowledgeResult
                 INSUFFICIENT (QUALITY_FAIL), score = null, jamás 0
difficulty:      UNKNOWN · source: manual EJEMPLO v0 · version: 0.1-draft
```

### Item C — pregunta de opinión rechazada (ilustra PASO 8, KS-2)

```
itemId:          ITEM-KN-EJ003 (EJEMPLO — NO PRODUCTIVO)
question:        "¿Qué prefieres servir primero: [A] o [B]?"  (esquema)
resultado:       REJECTED en KI-VAL-1/3 — es preferencia (KS-2), no
                 conocimiento; no tiene clave defendible; jamás entra al
                 knowledgeScore
```

### Item D — reactivo con juicio de dificultad registrado (ilustra KD-2)

```
itemId:          ITEM-KN-EJ004 (EJEMPLO — NO PRODUCTIVO)
difficulty:      MEDIUM con basis=JUICIO-NO-EVIDENCIA, autor=revisor
                 (EJEMPLO, fecha registrada) — sigue sin ser evidencia y
                 sin efectos de scoring (KD-5)
status:          DRAFT (los demás campos igual que Item A)
```

## 3. Ejemplo VENDEDOR — blueprint conceptual (EJEMPLO — NO PRODUCTIVO)

```
blueprintId:            KBP-EJEMPLO-VENDEDOR-001 (EJEMPLO-DRAFT)
jobId:                  JOB-EJEMPLO-VENDEDOR
criterio cubierto:      CRIT-CON-EJ006 (A-02.5: características y precios
                        vigentes del catálogo)

domain:                 CATALOGO (EJEMPLO)
  subdomain:            Características de productos vigentes
    knowledgeRequirement: KREQ-EJEMPLO-V01 — source: catálogo interno
                        EJEMPLO con fecha/versión (KF7); NOTA DE
                        REFRESH-RISK (A-02.1 §3): el contenido cambia con
                        actualizaciones del catálogo ⇒ versión obligatoria
                        del dominio y revisión por cambio de catálogo
                        (KSEC-11)
  subdomain:            Precios y promociones vigentes
    knowledgeRequirement: KREQ-EJEMPLO-V02 — idéntico régimen de fuente
                        (KF7) + vigencia explícita (fecha de corte)

Cobertura declarada (EJEMPLO): 4 reactivos por subdominio. items previstos:
ITEM-KN-EJ101..108 (EJEMPLO — NO PRODUCTIVO; no se enuncian aquí).
```

Contraste didáctico con MESERO (heredado de A-02.5 CRIT-CON-EJ006): misma
categoría de conocimiento, `importance` distinta en el análisis del puesto
(catalogo = SUPPORTING-CORE según vigencia; la criticidad del criterio es
asunto del Criterion Record, no del blueprint — K-BP-4).

## 4. Ejemplos de KnowledgeResult (EJEMPLO — NO PRODUCTIVO)

```
CASO 1 (escenario A — ilustrativo):
  administration: ADMIN-EJEMPLO-01 · assessmentVersion 1.0 · blueprint 0.1
  validItems=6, invalidItems=0, correctItems=4
  → score = 4/6 (CORRECT_OVER_TOTAL) · status VALID* · lectura:
    "dominio declarativo sobre el contenido definido (EJEMPLO)"
  *asumiendo K-VAL-1..8 completos — en EJEMPLO no lo están.

CASO 2 (escenario B — el caso vigente real):
  administration: ADMIN-EJEMPLO-02 · set con items tipo ITEM-KN-EJ002
  validItems=5, invalidItems=1 (sin correctAnswer), correctItems=3
  → score = null (NO 4/5, NO 0, NO prorrateo)
  → status INSUFFICIENT · reasonCode QUALITY_FAIL (K-INS-1)
  → salida: "Información insuficiente para evaluar este criterio." + causa
```

## 5. Marcadores obligatorios

Todo este PASO (17) es **EJEMPLO — NO PRODUCTIVO**: puestos, blueprints,
requisitos, items, claves, resultados y cifras son ilustrativos; los ids
llevan prefijo EJEMPLO; ningún contenido se escribió para uso real y ninguno
debe migrarse a producción sin el proceso completo (PASO 2 → 19) con fuentes
reales del cliente.
