# EVALUHR — A-02.1 · PASO 5
# TRADUCCIÓN DE REQUISITOS DE CONOCIMIENTO A CRITERIOS EVALUABLES

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se crean preguntas en A-02.1.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Propósito

Definir cómo un **requisito de conocimiento** identificado en el registro del
puesto se traduce en un **criterio evaluable** (categoría A de la taxonomía),
que en el futuro podrá alimentarse con una evaluación de conocimientos.

---

## 2. Cadena de traducción (requisito → criterio → [futuro] reactivos)

```
REGISTRO DE PUESTO
  knowledge[i]: contenido que la persona debe saber (fuente F1–F5)
        ↓ (formulación, PASO 3)
CRITERIO DE CONOCIMIENTO (categoría A)
  criterionId · name · description · jobRelevance ·
  requiredOrPreferred · evidenceSource · approvedBy · version
        ↓ (futuro, FUERA del alcance A-02.1)
INSTRUMENTO DE CONOCIMIENTOS
  reactivos derivados del contenido definido en el criterio
        ↓ (futuro)
EVIDENCIA: resultado de evaluación de conocimientos
```

**Regla**: el criterio define el contenido a evaluar; los reactivos solo
pueden existir después, derivados de ese contenido y aprobados. A-02.1
termina en el criterio: **NO crear todavía preguntas**.

---

## 3. Requisitos de calidad para un criterio de conocimiento

Un requisito de conocimiento solo se convierte en criterio evaluable si puede
declarar:

| Elemento | Pregunta que responde | Ejemplo de redacción |
|---|---|---|
| `content` | ¿Qué debe saber exactamente? | "Protocolo de servicio en sala definido por la empresa" |
| `scope` | ¿Hasta dónde? (niveles: familiaridad / aplicación / dominio) | "Aplicación: aplicar el protocolo en escenarios habituales" |
| `source` | ¿De dónde proviene el contenido? | "Manual interno de servicio v2 (documento de la empresa)" |
| `assessmentIntent` | ¿Cómo se imaginaria verificar? (declarativo hoy) | "Evaluación de conocimientos sobre el manual" |
| `refreshRisk` | ¿El contenido cambia? (producto, precios, procesos) | "Cambia con actualizaciones de menú" → criterio con versión de contenido |

Si la empresa no puede declarar `content` + `source`, el conocimiento no es
criterio evaluable: se deja como requisito no evaluable (visible como
"sin evidencia posible").

---

## 4. Ejemplo conceptual (del encargo; NO crear preguntas)

```
Puesto (ejemplo hipotético):
  Mesero

Conocimiento registrado (fuente F1/F2, ejemplo):
  Manejo de protocolos de servicio

Traducción a criterio:
  criterionId:        CRIT-CON-001 (EJEMPLO-ILUSTRATIVO)
  category:           CONOCIMIENTOS
  name:               Protocolos de servicio al cliente en sala
  description:        Dominio declarativo del protocolo de servicio
                      definido por la empresa (contenido exacto por
                      definir con la empresa)
  jobRelevance:       functions[2] — atender mesas, tomar y transmitir
                      órdenes (ejemplo hipotético)
  requiredOrPreferred: POR_DEFINIR (análisis real pendiente)
  evidenceType:       PRUEBA_DE_CONOCIMIENTOS
  instrument:         Evaluación de Conocimientos (futura, derivada del
                      contenido del criterio)
  evidenceSource:     EJEMPLO — pendiente de fuente real
  approvedBy:         PENDIENTE-ANALISIS-REAL
  status:             EJEMPLO-ILUSTRATIVO
  version:            1.0 (borrador)
```

→ La derivación de reactivos concretos ("¿qué se hace cuando…?") es trabajo
futuro que requerirá: contenido aprobado, autoría/revisión humana, control de
versiones y calidad documentada. **Queda explícitamente fuera de A-02.1.**

---

## 5. Separación de constructos

- Conocimiento ≠ habilidad: "saber el protocolo" (A) no implica "aplicarlo
  bajo presión" (B).
- Conocimiento ≠ personalidad: una prueba de conocimientos no dice nada sobre
  rasgos, y el IPIP-50-MX no dice nada sobre conocimientos.
- Conocimiento ≠ experiencia: haber trabajado antes no garantiza conocimiento
  vigente del contenido específico de esta empresa.

---

## 6. Nota de implementación (informativa, sin modificar nada)

Hallazgo preexistente documentado en A-01.2 y vigente: el generador de
plantillas **no persiste `correctAnswer`** en preguntas de conocimientos de
puestos nuevos → `knowledgeScore = 0` en esos casos.

Implicación metodológica: mientras esa brecha no se corrija (requiere
autorización y cambio de código, fuera de A-02.1), la evidencia de
conocimientos para puestos nuevos **no es confiable** y no debe alimentar el
futuro "nivel de ajuste". Se registra como riesgo en `limitations.md` y en la
matriz de instrumentos (`instrument-criterion-matrix.csv`).
