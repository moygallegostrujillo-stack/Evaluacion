# EVALUHR — A-02.5 · PASO 4
# RELACIÓN INSTRUMENTO → CRITERIO (por instrumento)

> Documento de diseño metodológico. NO implementa nada. NO define umbrales.
> Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.1 (matriz instrumento↔criterio `instrument-criterion-matrix.csv`,
> taxonomía A–E); A-01.3 (identidad IPIP-50-MX v1.0); A-02.3 PASOS 4–8
> (salidas por constructo); A-02.5 PASOS 5–9 (reglas por instrumento).

---

## 1. Propósito

Definir, **para cada instrumento disponible o proyectado**, qué tipo de
criterio puede informar, qué NO puede informar, qué fuerza de relación tiene
hoy (PASO 11) y qué evidencia adicional necesitaría para fortalecerla.

Regla marco (heredada): un instrumento alimenta **solo** criterios de su
categoría taxonómica; toda relación transversal está prohibida o exige
expediente metodológico propio. La ruta siempre es
PUESTO → CRITERIO → EVIDENCIA → INSTRUMENTO (A-02.3 PASO 2), jamás
INSTRUMENTO → "adecuación" directa.

---

## 2. IPIP-50-MX (`EVALHR-PERSONALIDAD-IPIP50-MX` v1.0)

| Aspecto | Especificación |
|---|---|
| **Qué criterios puede informar** | Exclusivamente **categoría D (PERSONALIDAD)**: criterios cuyo objeto sea documentar tendencias de rasgo relevantes para el análisis del puesto. |
| **Qué NO puede informar** | A (conocimientos) · B (competencias/habilidades) · C (experiencia/formación) · E (integridad). Tampoco: cumplimiento de criterio, aptitud, desempeño, capacidad, honestidad, "personalidad ideal". |
| **Fuerza de relación hoy** | **HYPOTHESIS** para cualquier vínculo rasgo→criterio de puesto (PASO 5 §4); NOT_SUPPORTED para toda categoría distinta de D. |
| **Evidencia adicional necesaria** | Para EVIDENCE-SUPPORTED (PASO 5 §4): análisis de puesto que documente funcionalidad del rasgo, juicio de expertos panelizado, evidencia de criterio o de constructo aplicada al contexto, aprobación de gobernanza. Hoy **no existe** ninguna de estas piezas para ningún rasgo. |

## 3. Prueba de conocimientos (módulo de conocimientos de EvaluHR)

| Aspecto | Especificación |
|---|---|
| **Qué criterios puede informar** | **Categoría A (CONOCIMIENTOS)**: dominio declarativo de contenidos definidos para el puesto. |
| **Qué NO puede informar** | Ejecución real (saber ≠ hacer, A-02.1) · B · C · D · E. Un acierto no es competencia ni capacidad general de aprendizaje. |
| **Fuerza de relación hoy** | **LIMITED**: la ruta content-valid (blueprint→criterio) es la correcta, pero la evidencia actual es insuficiente — `correctAnswer` no persiste en puestos generados (K-INS-1, A-02.3 PASO 5 escenarios B–E) → las lecturas caen en INSUFFICIENT. |
| **Evidencia adicional necesaria** | Checklist K-VAL-1..8 (PASO 6): blueprint, vínculo con funciones, reactivos vinculados, clave validada, scoring reproducible, control de versión, revisión. Sin correctAnswer válido: INSUFFICIENT, nunca 0. |

## 4. Evaluación de competencias (método futuro, no implementado)

| Aspecto | Especificación |
|---|---|
| **Qué criterios puede informar** | **Categoría B (HABILIDADES/COMPETENCIAS)**, vía método conductual versionado (PASO 7). |
| **Qué NO puede informar** | Auto-reporte ≠ competencia: el legacy de 10 ítems (autopercepción) **no informa criterios B**; solo contexto orientativo. Tampoco A/C/D/E. |
| **Fuerza de relación hoy** | **NOT_SUPPORTED** (NO_METHOD → INSUFFICIENT sin excepciones, A-02.3 PASO 6). |
| **Evidencia adicional necesaria** | Cadena completa PASO 7: competencia aprobada → indicador conductual → reactivo/escenario → scoring con rúbrica versionada → evidencia; 6 puertas de activación de A-02.3. |

## 5. Instrumento de integridad (hoy: `EVALHR-INTEGRIDAD-LEGACY`)

| Aspecto | Especificación |
|---|---|
| **Qué criterios puede informar** | **Ninguno hoy.** Objetivo futuro: categoría E (INTEGRIDAD) con un instrumento identificado y validado. |
| **Qué NO puede informar** | Honestidad real, conducta observada, "confiabilidad", riesgo de robo (auto-reporte no prueba conducta). Y por transversalidad prohibida: A/B/C/D. |
| **Fuerza de relación hoy** | **NOT_SUPPORTED** — estado de evidencia obligatorio INSUFFICIENT (I-INT-1, A-02.3 PASO 7). |
| **Evidencia adicional necesaria** | Los 8 prerrequisitos del PASO 8: instrumento identificado, fuente, derechos, constructo, scoring, evidencia psicométrica, condiciones de uso, suficiencia para el objetivo. |

## 6. Entrevista (estructura futura; hoy sin guía estructurada)

| Aspecto | Especificación |
|---|---|
| **Qué criterios puede informar** | **Categoría C** (verificación de experiencia declarada, con acreditación documental) y, en diseño futuro, **categoría B** (indicadores conductuales registrados por evaluador humano). También aporta contexto a cualquier categoría. |
| **Qué NO puede informar** | Diagnóstico de personalidad (la entrevista no sustituye ni "corrige" el IPIP; los conflictos IPIP↔entrevista siguen el protocolo A-02.3 PASO 9 sin resolución matemática) · honestidad · aptitud · decisión laboral. |
| **Fuerza de relación hoy** | **LIMITED** para C (verificación depende de evidencia documental del candidato/empresa) · HYPOTHESIS para B (sin guía estructurada) · NOT_SUPPORTED para D/E. |
| **Evidencia adicional necesaria** | Guía de entrevista estructurada versionada, rúbricas conductuales, registro por indicador (herencia del diseño condicional de competencias, A-02.3 PASO 6). |

---

## 7. Tabla resumen (estado hoy)

| Instrumento | A CONOCIMIENTOS | B COMPETENCIAS | C EXPERIENCIA | D PERSONALIDAD | E INTEGRIDAD |
|---|---|---|---|---|---|
| IPIP-50-MX v1.0 | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED | **HYPOTHESIS** | NOT_SUPPORTED |
| Prueba de conocimientos | **LIMITED** (K-INS-1 → lecturas INSUFFICIENT) | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED |
| Competencias (método futuro) | NOT_SUPPORTED | NOT_SUPPORTED hoy (ruta a MODERATE/STRONG por PASO 7) | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED |
| Integridad (sin instrumento válido) | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED | NOT_SUPPORTED (I-INT-1) |
| Entrevista (sin guía estructurada) | NOT_SUPPORTED | HYPOTHESIS (futuro) | **LIMITED** (con acreditación) | NOT_SUPPORTED (protocolo de conflictos) | NOT_SUPPORTED |

Lectura de la tabla: la única relación "fuerte" deseable (EVIDENCE-SUPPORTED,
MODERATE/STRONG) **no existe todavía para ningún par instrumento→criterio**.
Esta honestidad es deliberada: define el trabajo metodológico pendiente en
lugar de simularlo (PASO 11).
