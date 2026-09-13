# EVALUHR — A-03.1 · PASO 1
# DEFINICIÓN DE KNOWLEDGE ASSESSMENT (EVALUACIÓN DE CONOCIMIENTOS)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> IA, IPIP-50-MX, integridad, competencias, scoring existente, contrato ni
> aviso de privacidad. **No se implementa nada en A-03.1.**
> Fecha: 2026-09-10 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 5 (criterios de conocimiento, categoría A); A-02.2 PASO 5
> (K1–K6, K-INS-1, problema correctAnswer documentado y NO corregido);
> A-02.3 PASO 5 (escenarios A–E, INSUFFICIENT ≠ 0); A-02.5 PASO 6 (K-VAL-1..8).

---

## 1. Definición formal

**KnowledgeAssessment** es un instrumento de EvaluHR que mide, de manera
objetiva y reproducible, el **conocimiento declarativo vigente** que una
candidata o candidato posee sobre **contenidos específicos definidos para un
puesto**, a partir de reactivos con respuesta correcta previamente
establecida, validada y versionada.

Componentes conceptuales (todos de diseño, ninguno implementado):

| Componente | Qué es | Documento |
|---|---|---|
| KnowledgeBlueprint | Mapa de dominios/subdominios de conocimiento requeridos por el puesto | PASO 3 (`03-blueprint.md`) |
| KnowledgeItem | Reactivo individual con clave de respuesta y trazabilidad | PASO 4 (`04-item.md`) |
| KnowledgeResult | Resultado de una administración individual | PASO 11 (`11-result.md`) |

El instrumento se define **por puesto y por versión**: un
KnowledgeAssessment es la instancia concreta (blueprint + reactivos +
scoring) derivada de un blueprint aprobado. Sin blueprint aprobado no existe
instrumento metodológicamente válido (herencia K-VAL-1).

## 2. Qué mide y qué no mide

**Mide (única salida admitida):** dominio declarativo — "saber" — sobre
contenidos concretos con respuesta verificable (hechos, procedimientos
documentados, normativa, contenidos internos de la empresa).

**No mide (prohibido inferir):**

- ✗ Rasgos de personalidad (territorio exclusivo de IPIP-50-MX v1.0 congelado).
- ✗ Competencias / habilidades de ejecución ("saber el protocolo" ≠
  "aplicarlo bajo presión" — separación ya establecida en A-02.1 PASO 5 §5).
- ✗ Integridad o conducta ética (I-INT-1 vigente; ningún instrumento de
  integridad autorizado).
- ✗ Experiencia acumulada (se acredita por la vía declarativa C-EXP-1..4).
- ✗ Capacidad general, inteligencia, potencial de aprendizaje.
- ✗ Desempeño futuro o probabilidad de éxito.

## 3. Distinción de constructos (tabla obligatoria)

| Dimensión | Pregunta que responde | Instrumento correspondiente | No puede sustituir a |
|---|---|---|---|
| **Conocimiento** | ¿Sabe el contenido específico del puesto? | KnowledgeAssessment (esta fase) | Personalidad, competencias, integridad, experiencia |
| **Personalidad** | ¿Qué tendencias de comportamiento reporta? | IPIP-50-MX v1.0 (congelado) | Conocimiento, competencias, integridad |
| **Competencias** | ¿Cómo actúa/ejecuta en situaciones? | Cadena futura P-COMP-1..6 (NO_METHOD hoy) | Conocimiento, personalidad |
| **Integridad** | (constructo no instrumentado) | Sin instrumento (I-INT-1) | Nada — no existe sustituto |
| **Experiencia** | ¿Qué trayectoria acredita? | Declaración + verificación (D-EXP-1) | Conocimiento vigente de esta empresa |

Reglas de separación (reafirmación de herencias, sin excepciones):

1. **K-DEF-1**: un reactivo de conocimientos solo evalúa contenido con
   respuesta correcta verificable; si evalúa tendencia, preferencia u opinión,
   no es un reactivo de conocimientos (PASO 8).
2. **K-DEF-2**: un KnowledgeAssessment no produce lecturas sobre categorías
   B–E de la taxonomía (A-02.1 PASO 2); su evidencia solo puede alimentar
   criterios de categoría A (conocimientos) con `jobRelevance = VALID`.
3. **K-DEF-3**: aprobar una prueba de conocimientos no implica capacidad de
   ejecución ni desempeño: la lectura permitida es descriptiva de dominio
   declarativo (herencia A-02.3 PASO 5, escenario A).

## 4. Relación con la cadena ya definida (sin duplicar ni contradecir)

```
A-02.1:  conocimiento del puesto → CRITERIO categoría A (termina ahí)
A-02.2:  qué es evidencia válida de conocimiento (K1–K6) + K-INS-1
A-02.3:  salida por escenario A–E; INSUFFICIENT ≠ 0
A-02.5:  checklist del instrumento K-VAL-1..8; fuerza LIMITED como máximo hoy
A-03.1:  CÓMO DEBE DISEÑARSE el instrumento para que exista esa evidencia
         (blueprint → reactivos → validación → publicación → scoring → resultado)
```

A-03.1 **no modifica** ninguna regla previa: la formaliza al nivel del
instrumento y añade las piezas que K-VAL-1..8 exigía (blueprint, reactivos
vinculados, clave validada, versionado, revisión) como **modelo de diseño**.

## 5. Estado vigente (verdad documental, sin maquillaje)

- El problema `correctAnswer` de `generateTemplatesForPosition`
  **permanece sin corregir** (fuera de alcance; PASO 6).
- Por K-VAL (todo-o-nada) y K-INS-1: **hoy no existe ninguna evaluación de
  conocimientos producida por EvaluHR que alcance evidencia VALID** para
  puestos generados; toda administración en esa condición produce
  `status = INSUFFICIENT` y **jamás un 0 como lectura** (regla de oro).
- Este dossier es **propuesta metodológica**: hasta gobernanza + corrección
  autorizada + validación de contenido, nada cambia en el producto.
