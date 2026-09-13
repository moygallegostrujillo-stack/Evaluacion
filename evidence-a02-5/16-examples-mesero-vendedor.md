# EVALUHR — A-02.5 · PASO 16
# EJEMPLOS METODOLÓGICOS: MESERO Y VENDEDOR

> **⚠️ SOLO EJEMPLOS — NO PRODUCTIVO.** Ninguno de estos puestos ha sido
> analizado realmente. Ningún criterio aquí es real, aprobado ni publicable.
> Los ejemplos demuestran **cómo una función del puesto podría convertirse
> metodológicamente en criterio**; no constituyen biblioteca de criterios
> (prohibida — PASO 1 §2).
> Fecha: 2026-09-09 · Versión: 1.0 · Estado: EJEMPLO ILUSTRATIVO.

---

## 1. Función → requisito → criterio: el mecanismo

```
FUNCIÓN del puesto (elemento trazable del registro)
   → REQUISITO que la función exige (¿qué debe saber/hacer/haber hecho/
     tender a/observar la persona para ejecutarla?)
      → CLASIFICACIÓN en UNA categoría (A–E; si parecen dos → dos criterios)
         → FORMULACIÓN del Criterion Record (PASO 15 §2: rationale, source,
           relevance, criticality + calificador, fuerza de relación)
            → REVISIÓN EXPERTA → APROBACIÓN → VERSIÓN → PUBLICACIÓN
```

Cada ejemplo abajo recorre el mecanismo completo y muestra el **veredicto
metodológico** (qué podría llegar a ser, qué no, y con qué fuerza hoy).

---

## 2. Ejemplo MESERO (ilustrativo)

**Función (registro hipotético):** "functions[2] — Atender mesas asignadas,
tomar órdenes y transmitirlas a cocina" · "functions[4] — Manejar alimentos
listos para servir".

### Ejemplo M-1 — Conocimiento de manejo higiénico de alimentos

| Campo | Valor (EJEMPLO) |
|---|---|
| criterionId | CRIT-CON-EJ001 (EJEMPLO) |
| jobId | JOB-EJEMPLO-MESERO (EJEMPLO) |
| category | A — CONOCIMIENTOS |
| Requisito extraído | Conocer la norma oficial aplicable a la higiene en el manejo de alimentos (p. ej., la norma de prácticas de higiene aplicable en México — referencia normativa **ilustrativa**) |
| jobRelevance | **VALID (propuesta)** — R-REL-1: functions[4]; R-REL-2: S6 (norma citada) + S2 (función real); R-REL-3: categoría A; R-REL-4/5: pendientes del análisis real |
| criticality | **CRITICAL propuesto** — calificador C-CRIT-2 (obligación regulatoria) + C-CRIT-3 (seguridad alimentaria) |
| evidenceSource | S6 + S2 (EJEMPLO — por documentar en análisis real) |
| instrument | Prueba de conocimientos (futura, requiere K-VAL-1..8 — PASO 6) |
| relationshipStrength | **LIMITED** hoy (K-INS-1: sin correctAnswer persistido; sin blueprint) |
| validationMethod | Análisis de contenido (blueprint) + juicio de expertos para clave |
| Consecuencia operativa | Si se aprobara así hoy: criterio CRITICAL sin evidencia utilizable → **hard gate de A-02.4** (resultado incompleto hasta cerrar K-VAL) — legítimo pero debe decidirse sabiéndolo |

**Lección del ejemplo:** un criterio perfectamente justificado puede seguir
sin evidencia utilizable; el sistema lo declara honestamente en lugar de
simular evaluación.

### Ejemplo M-2 — Tendencia de "amabilidad" en trato al cliente

| Campo | Valor (EJEMPLO) |
|---|---|
| criterionId | CRIT-PER-EJ002 (EJEMPLO) |
| category | D — PERSONALIDAD |
| Requisito extraído | La función de trato con clientes hace **pertinente explorar** tendencias de sociabilidad/amabilidad |
| jobRelevance | VALID propuesto vía S2 + análisis funcional (ES-1 incompleto: falta documentar la funcionalidad) |
| criticality | **STANDARD** — y **no puede ser CRITICAL** (regla C-D-CRIT, PASO 3 §4) |
| instrument | IPIP-50-MX v1.0 (Amabilidad / Extraversión) |
| relationshipStrength | **HYPOTHESIS** (H-1..H-4; sin ES-1..ES-5) |
| Uso permitido | Insumo de entrevista (áreas ya identificadas); **jamás** cumplimiento, "perfil ideal", corte o recomendación |
| Prohibición activa | "Extraversión/Amabilidad alta = buen mesero" (PASO 12) |

### Ejemplo M-3 — Experiencia previa en servicio

| Campo | Valor (EJEMPLO) |
|---|---|
| criterionId | CRIT-EXP-EJ003 (EJEMPLO) |
| category | C — EXPERIENCIA |
| Requisito | Experiencia previa atendiendo mesas (dato a verificar) |
| Regla de verificación | C-EXP-1..4: referencias/documento a acreditar con regla versionada |
| Estados posibles | DECLARED (contexto) → VERIFIED (acredita el dato) → CONTRADICTED (área forzada) |
| relationshipStrength | **LIMITED** (entrevista/verificación sin guía estructurada versionada hoy) |

---

## 3. Ejemplo VENDEDOR (ilustrativo)

**Función (registro hipotético):** "functions[1] — Atender clientes y
cerrar ventas en piso" · "functions[3] — Manejar efectivo y cortes de caja".

### Ejemplo V-1 — Comunicación persuasiva (competencia)

| Campo | Valor (EJEMPLO) |
|---|---|
| criterionId | CRIT-HAB-EJ004 (EJEMPLO) |
| category | B — HABILIDADES/COMPETENCIAS |
| Requisito | Comunicar el valor del producto y guiar la decisión de compra |
| jobRelevance | VALID propuesto vía S2/S3 |
| criticality | **IMPORTANT** propuesto |
| Cadena pendiente | Competencia → indicadores conductuales → escenarios → rúbrica versionada (PASO 7) |
| relationshipStrength | **NOT_SUPPORTED hoy** (NO_METHOD → INSUFFICIENT sin excepciones) |
| Prohibición activa | Puntuar "competencia" desde Big Five, auto-reporte o entrevista sin método |

### Ejemplo V-2 — Conducta ética en manejo de efectivo

| Campo | Valor (EJEMPLO) |
|---|---|
| criterionId | CRIT-INT-EJ005 (EJEMPLO) |
| category | E — INTEGRIDAD |
| Requisito | Actuar con apego a normas en el manejo de efectivo |
| jobRelevance | VALID propuesto vía S2 (functions[3]) |
| criticality | **CRITICAL posible** en abstracto (C-CRIT-4: requisito explícito de la empresa + verificación definida) |
| relationshipStrength | **NOT_SUPPORTED** (I-INT-1) |
| Consecuencia operativa | Aprobarlo CRITICAL hoy ⇒ hard gate permanente (resultado incompleto) hasta instrumento futuro que cumpla I-VAL-1..8 + justificación de proporcionalidad (PASO 14) |
| Prohibición activa | "Integridad 80 = honesto" / proxy desde IPIP o entrevista (PASO 12) |

### Ejemplo V-3 — Conocimiento del producto

| Campo | Valor (EJEMPLO) |
|---|---|
| criterionId | CRIT-CON-EJ006 (EJEMPLO) |
| category | A — CONOCIMIENTOS |
| Requisito | Conocer características y precios vigentes del catálogo |
| criticality | **IMPORTANT** propuesto (afecta sustancialmente la función central, pero no es obligación legal ni seguridad) — contraste con M-1: misma categoría, criticidad distinta **por el análisis del puesto**, no por el instrumento |
| relationshipStrength | LIMITED hoy (ruta K-VAL pendiente) |

---

## 4. Qué demuestran los ejemplos (síntesis)

1. La **misma función** produce requisitos de distintas categorías → se
   descompone en criterios separados (integridad de constructos).
2. La **criticidad** depende del calificador (norma/seguridad/indispensable),
   no de la importancia "sentida": M-1 (norma) es CRITICAL; V-3 (producto)
   es IMPORTANT; V-2 sería CRITICAL pero hoy **sin evidencia utilizable**.
3. La **fuerza de relación** es honesta y granular: LIMITED ≠ HYPOTHESIS ≠
   NOT_SUPPORTED, y ninguna llega a MODERATE/STRONG hoy.
4. Los criterios D **jamás** son CRITICAL y solo existen como hipótesis
   documentadas.
5. Ningún ejemplo define cortes, pesos, percentiles, perfiles ideales ni
   reglas de contratación (regla principal del encargo).

> Los IDs `CRIT-*-EJnnn`, `JOB-EJEMPLO-*` y todas las valoraciones son
> ilustrativos y **no** deben copiarse a producción (las matrices del PASO
> 17 los marcan como EJEMPLO; PASO 19 verifica esta marca).
