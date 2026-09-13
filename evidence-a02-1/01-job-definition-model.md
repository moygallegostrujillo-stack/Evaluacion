# EVALUHR — A-02.1 · PASO 1
# MODELO DE PUESTO (JOB DEFINITION MODEL)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Propósito

Definir la información mínima que debe existir sobre un **puesto de trabajo**
antes de que EvaluHR pueda generar, vincular o interpretar criterios para ese
puesto.

Principio rector: **sin análisis de puesto, no hay criterios**. Un criterio
sin origen documentado en una característica real del puesto está prohibido
(ver `03-job-criterion-linkage.md`).

---

## 2. Registro mínimo del puesto (Job Profile)

Para que un puesto pueda alimentar la metodología de criterios, debe existir
un registro con, al menos, los siguientes campos. Ninguno es opcional en el
modelo; el contenido puede ser breve, pero debe existir y estar documentado.

| # | Campo | Descripción | Regla mínima |
|---|-------|-------------|--------------|
| 1 | `jobTitle` | Nombre del puesto | Nombre funcional, no decorativo ("Mesero", no "Ninja de servicio") |
| 2 | `functions` | Funciones: qué hace la persona día a día | Lista de funciones observables |
| 3 | `responsibilities` | Responsabilidades: por qué responde la persona | Cada responsabilidad debe poder atribuirse a la persona del puesto |
| 4 | `knowledge` | Conocimientos: qué debe saber (técnicos, de producto, de proceso, normativos operativos) | Cada conocimiento debe ser necesario o preferente para las funciones |
| 5 | `skills` | Habilidades: qué debe saber hacer | Habilidad = capacidad ejecutable, no rasgo |
| 6 | `competencies` | Competencias: patrones conductuales esperados en el puesto | Definidas con indicadores conductuales (ver `06-competency-model.md`) |
| 7 | `experience` | Experiencia: trayectoria previa requerida o preferente | Debe ser verificable |
| 8 | `education` | Formación: nivel o área de estudio requerido o preferente | Debe ser verificable |
| 9 | `workConditions` | Condiciones relevantes: horarios, turnos, carga física, entorno, trato con clientes, etc. | Todo lo que condicione el desempeño real |
| 10 | `objectiveCriteria` | Criterios objetivos relacionados con el trabajo: metas, indicadores, requisitos verificables | Solo criterios que la empresa ya usa o puede verificar; EvaluHR no los inventa |

**Regla de completitud**: un puesto que no pueda llenar los 10 campos con
contenido real (aunque sea breve) **no está listo** para la etapa de criterios.
Se registra como `jobProfile.status = INCOMPLETO` y no genera criterios.

---

## 3. Fuentes válidas para llenar el registro

El registro del puesto se llena **solo** con información proveniente de:

- **F1 — Entrevista de análisis con quien conoce el puesto** (jefe directo,
  titular del área u ocupante actual competente).
- **F2 — Descripciones de puesto existentes de la empresa** (documentos
  internos vigentes).
- **F3 — Observación directa del trabajo** (cuando aplique).
- **F4 — Normativa u operativa interna aplicable** al puesto (procedimientos
  internos; referencias normativas solo cuando la empresa las declare
  aplicables a su operación — EvaluHR no determina por sí mismo qué normas
  aplican al negocio del cliente).
- **F5 — Requisitos que la empresa declara** como política propia
  (experiencia, formación, horarios).

**Prohibido**:

- Inventar funciones, conocimientos o criterios "típicos" del puesto sin
  fuente registrada.
- Copiar plantillas genéricas de otro puesto como si fueran análisis propio.
- Usar IA para generar el contenido del registro (la IA no participa en la
  definición de puestos ni criterios; ver `03-job-criterion-linkage.md` §7).
- Llenar campos "para que se vea completo" (relleno cosmético).

Cada campo del registro debe registrar su **fuente** (F1–F5) y la fecha.

---

## 4. Qué NO es el modelo de puesto

- No es un generador automático de vacantes ni de criterios.
- No es una herramienta de redacción de ofertas laborales.
- No determina por sí mismo qué instrumentos se aplican: la selección de
  instrumentos es una decisión posterior, documentada y por puesto.
- No sustituye la responsabilidad de la empresa de describir sus propios
  puestos con veracidad.

---

## 5. Ciclo de vida del registro de puesto

```
BORRADOR → EN REVISIÓN → APROBADO → VIGENTE → DEPRECIADO
                │
                └──(incompleto o con contradicciones)→ regresa a BORRADOR
```

- **BORRADOR**: campos en captura, sin validez para criterios.
- **EN REVISIÓN**: revisión por RH de la empresa.
- **APROBADO**: aprovado por responsable designado por la empresa (rol
  registrado; ver `11-human-review-model.md`).
- **VIGENTE**: puede alimentar la etapa de criterios.
- **DEPRECIADO**: sustituido o cerrado; se conserva histórico (append-only,
  consistente con la política de versionado de A-01.3 `10-version-control.md`).

Cambios a un registro VIGENTE generan una nueva versión del registro (nunca
edición silenciosa), con fecha, autor y motivo.

---

## 6. Relación con las demás piezas de A-02.1

| Documento | Usa el modelo de puesto para... |
|---|---|
| `02-criteria-taxonomy.md` | Clasificar requisitos en categorías A–E |
| `03-job-criterion-linkage.md` | Trazar cada criterio a un campo del registro |
| `09-fit-level-concept.md` | Garantizar que el futuro "nivel de ajuste" compare evidencia contra criterios **de un puesto previamente definido** |
| `10-interview-areas.md` | Anclar las "áreas que requieren revisión" a criterios reales del puesto |

---

## 7. Declaración de alcance

Este documento define **campos y reglas**, no contenido. Ningún puesto real ha
sido analizado todavía en el marco de A-02.1; el ejemplo "Mesero" que aparece
en otros documentos es ilustrativo y está marcado como tal (ver
`criterion-model.csv`, filas con `status=EJEMPLO-ILUSTRATIVO`).
