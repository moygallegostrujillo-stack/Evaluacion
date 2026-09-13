# EVALUHR — A-02.5 · PASO 3
# ¿CUÁNDO PUEDE SER CRITICAL UN CRITERIO?

> Documento de diseño metodológico. NO implementa nada. NO define umbrales
> numéricos. Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA
> METODOLÓGICA.
> Base: PASO 1 (relevancia) y PASO 2 (criticidad) de este dossier; A-02.1
> PASO 2 (taxonomía A–E); A-02.3 PASO 7 (integridad INSUFFICIENT).

---

## 1. Principio

> **CRITICAL es la excepción, no la regla.** Un criterio solo puede ser
> CRITICAL cuando existe un calificador verificable que lo hace
> **no negociable** para ejercer el puesto. Elevar criterios a CRITICAL por
> prudencia genérica ("mejor que sea crítico") diluye el mecanismo de gates
> de A-02.4 y multiplica resultados incompletos sin base metodológica.

---

## 2. Calificadores que habilitan CRITICAL (C-CRIT)

Un criterio puede declararse CRITICAL si cumple **al menos uno** de estos
calificadores, documentado en su registro:

| ID | Calificador | Ejemplo conceptual (ilustrativo) |
|---|---|---|
| C-CRIT-1 | **Requisito indispensable para ejecutar una función central** — sin él la función no puede ejercerse (condición física/normativa operativa, no de calidad) | Capacidad de operar el equipo cuyo uso exclusivo define al puesto |
| C-CRIT-2 | **Obligación legal o regulatoria** aplicable al puesto, citada normativamente | Conocimiento de la norma oficial de higiene exigible en manejo de alimentos; licencia vigente para conducir |
| C-CRIT-3 | **Conocimiento de seguridad** cuya ausencia representa riesgo directo para personas | Protocolo de seguridad en manejo de sustancias o equipos peligrosos |
| C-CRIT-4 | **Requisito explícito del puesto** declarado formalmente por la empresa como condición indelegable, con fuente registrada (S1–S5) y verificación definida | Certificación específica declarada obligatoria por la empresa y verificable |

Reglas de aplicación:

1. El calificador se **cita en el Criterion Record** (campo de justificación
   de criticidad) con su fuente (PASO 1 §2).
2. La designación CRITICAL la aprueba un humano (PASO 2 §2.1); el sistema
   solo puede **validar la consistencia** del registro (calificador
   presente, REQUIRED coherente, fuente citada).
3. La empresa es responsable de la veracidad del calificador; EvaluHR no
   determina obligaciones legales (no es asesor jurídico; documentación
   conceptual).

---

## 3. Lo que NO habilita CRITICAL

| Anti-calificador | Por qué no |
|---|---|
| "Es importante para el éxito del puesto" | Eso define IMPORTANT, no CRITICAL |
| "Todos los puestos lo necesitan" | Biblioteca genérica — prohibida (PASO 1 §2) |
| "El instrumento lo mide bien" | La criticidad no depende del instrumento |
| "Un experto lo sugirió de pasada" | Juicio de expertos requiere método documentado (PASO 10) |
| "Para compensar la falta de otro criterio" | Manipulación estructural — prohibida (anti-manipulación A-02.4) |

---

## 4. REGLA ESPECIAL — Personalidad (categoría D) y CRITICAL

> **Ninguna dimensión de personalidad se asume CRITICAL.** Hoy, en el estado
> actual de evidencia de EvaluHR, un criterio de personalidad **no puede**
> declararse CRITICAL.

Justificación:

1. La relación rasgo→criterio está, como máximo, en grado **HYPOTHESIS**
   (PASO 5/11): no existe hoy ninguna relación EVIDENCE-SUPPORTED para
   puestos EvaluHR.
2. Un requisito no negociable exige que su cumplimiento sea **evaluable de
   forma responsable**; con evidencia hipotética, declarar CRITICAL
   produciría gates y resultados incompletos basados en una relación no
   demostrada — el peor uso posible del mecanismo.
3. Riesgo jurídico y de discriminación (PASO 13): convertir rasgos
   psicológicos en requisitos laborales arbitrarios es el patrón que esta
   fase existe para impedir.

**Regla formal (PROPUESTA — C-D-CRIT):**

> Un criterio cuya **única vía de evidencia** tiene fuerza de relación
> HYPOTHESIS o NOT_SUPPORTED (PASO 11) no puede declararse CRITICAL. Para
> que un criterio D sea CRITICAL algún día se exigiría: relación
> EVIDENCE-SUPPORTED documentada (PASO 5 §4), análisis de puesto que
> demuestre funcionalidad indispensable (C-CRIT-1), juicio de expertos
> panelizado (PASO 10), revisión jurídica de proporcionalidad (PASO 14) y
> aprobación de gobernanza en nueva versión del modelo. Ninguno existe hoy.

Nota operativa: lo anterior **no** impide criterios de otras categorías
relacionados con conducta (p. ej., un criterio E de integridad declarado
CRITICAL por manejo de efectivo); simplemente **no tendría evidencia
utilizable hoy** (A-02.3 PASO 7: integridad = INSUFFICIENT), lo que activaría
el hard gate de A-02.4 — situación legítima pero que debe conocerse antes de
aprobar: declarar CRITICAL sin instrumento disponible garantiza resultados
incompletos hasta cerrar la brecha de método.

---

## 5. Ejemplos conceptuales de calificación (ILUSTRATIVOS)

| Criterio (ejemplo) | Categoría | ¿CRITICAL posible? | Calificador |
|---|---|---|---|
| Conocimiento de la norma de higiene aplicable (puesto de alimentos) | A | **Sí** (con fuente normativa citada) | C-CRIT-2 |
| Protocolo de seguridad del equipo (puesto industrial) | A | **Sí** | C-CRIT-3 |
| Licencia/certificación obligatoria declarada | C | **Sí** (verificable) | C-CRIT-4 |
| Experiencia previa en el sector | C | No por defecto → IMPORTANT/STANDARD | — |
| Comunicación con clientes | B | No (hoy sin método, además) → IMPORTANT | — |
| Tendencia de rasgo "amabilidad" | D | **No** (regla §4) | — |
| Conducta ética con efectivo | E | Sí en abstracto (C-CRIT-4); **sin evidencia hoy** (I-INT-1) → gate | C-CRIT-4 |

> Todos los ejemplos son ilustrativos. Ningún puesto real de un cliente ha
> sido analizado en A-02.5 (ver PASO 16).
