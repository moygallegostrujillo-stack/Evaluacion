# EVALUHR — A-02.1 · PASO 3
# METODOLOGÍA DE VINCULACIÓN PUESTO → CRITERIO

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Principio fundamental

> **Todo criterio debe estar vinculado a una característica real del puesto.**
> Prohibido crear criterios únicamente porque "parecen útiles".

Un criterio es una **traducción evaluable** de un requisito observado en el
registro del puesto (`01-job-definition-model.md`). Si el requisito no existe
en el registro, el criterio no existe.

---

## 2. Registro completo de un criterio (Criterion Record)

Cada criterio se documenta con los siguientes campos (obligatorios):

| Campo | Descripción | Reglas |
|---|---|---|
| `criterionId` | Identificador único y estable | Formato `CRIT-<CAT>-<NNN>`; `<CAT>` ∈ {CON, HAB, EXP, PER, INT}; el NNN nunca se reutiliza; deprecado ≠ borrado |
| `name` | Nombre breve del criterio | Denota el requisito, no el instrumento |
| `description` | Descripción precisa: qué se evalúa y qué no | Debe ser entendible por RH sin contexto técnico |
| `jobRelevance` | Trazabilidad al puesto | Referencia obligatoria al campo y elemento del registro del puesto (p. ej., "functions[2] — atender mesas y tomar órdenes"). Texto libre estructurado, jamás "útil en general" |
| `requiredOrPreferred` | Obligatorio vs deseable | `REQUIRED` solo si el puesto no puede ejercerse sin ello y la empresa puede verificarlo; `PREFERRED` en los demás casos. Nunca por defecto REQUIRED |
| `evidenceSource` | Fuente del requisito | F1–F5 del modelo de puesto (entrevista de análisis, documento interno, observación, operativa aplicable, declaración de la empresa) + fecha |
| `approvedBy` | Quién aprobó el criterio | Rol o persona designada por la empresa; jamás "sistema", jamás automático; fecha de aprobación |
| `version` | Versión del criterio | Cambios sustantivos (qué se evalúa) → versión mayor; redacción → versión menor; histórico append-only |

Campos operativos adicionales usados en la matriz (`criterion-model.csv`):
`category`, `evidenceType`, `instrument`, `status`.

---

## 3. Proceso de vinculación (6 pasos)

```
P1. Registro de puesto VIGENTE (modelo de puesto completo)
        ↓
P2. Extracción de requisitos (de cada función/responsabilidad/condición:
    ¿qué exige este elemento del puesto?)
        ↓
P3. Clasificación del requisito en UNA categoría (A–E, taxonomía PASO 2);
    si parece de dos → se descompone en dos criterios
        ↓
P4. Formulación del criterio (campos del §2) con jobRelevance explícita
        ↓
P5. Revisión humana: RH de la empresa valida que el criterio
    corresponda al puesto real; correcciones regresan a P4
        ↓
P6. Aprobación y publicación (approvedBy + fecha + version);
    solo entonces el criterio puede recibir evidencia
```

**Regla de rechazo registrada**: los requisitos propuestos que no se
convierten en criterios se registran con su motivo de rechazo (trazabilidad
completa; evita "criterios fantasma" reintroducidos por la ventana trasera).

---

## 4. Estado de un criterio

| Estado | Significado | Puede recibir evidencia? |
|---|---|---|
| `PROPUESTO` | Formulado, sin aprobación | No |
| `APROBADO` | Con `approvedBy` y versión | Sí (según instrumento disponible) |
| `SUSPENDIDO` | Aprobado pero temporalmente sin instrumento/evidencia disponible | No (se conserva histórico) |
| `DEPRECIADO` | Ya no aplica al puesto vigente | No (histórico conservado, id no reutilizado) |

---

## 5. Ejemplo de trazabilidad (ILUSTRATIVO — no es un análisis real)

```
Registro de puesto (ejemplo hipotético "Mesero", NO aprobado, NO realizado)
  └─ functions[2]: "Atender mesas asignadas, tomar órdenes y entregarlas a cocina"
        ↓ requisito extraído
  "Conocer el protocolo de servicio definido por la empresa"
        ↓ clasificación (categoría A)
        ↓ formulación
criterionId: CRIT-CON-001
name: Protocolos de servicio al cliente en sala
description: Dominio declarativo del protocolo de servicio definido por la empresa
jobRelevance: functions[2] — atender mesas, tomar y transmitir órdenes
requiredOrPreferred: PREFERRED (por definir en análisis real)
evidenceSource: EJEMPLO — pendiente de fuente real (F1)
approvedBy: PENDIENTE-ANALISIS-REAL
version: 1.0 (borrador ilustrativo)
```

⚠️ Este ejemplo vive en `criterion-model.csv` marcado
`status=EJEMPLO-ILUSTRATIVO`. **Ningún puesto real ha sido analizado en
A-02.1.**

---

## 6. Prohibiciones explícitas

1. Crear un criterio sin `jobRelevance` trazable a un elemento del registro.
2. Crear criterios porque "todos los puestos deberían tenerlos" (uso genérico
   de bibliotecas: ver `06-competency-model.md` §5).
3. Aprobar criterios automáticamente (por sistema, IA o plantilla).
4. Marcar `REQUIRED` sin posibilidad de verificación declarada.
5. Mezclar constructos en un solo criterio (p. ej., "experiencia y actitud de
   servicio" → deben ser dos criterios de categorías distintas).
6. Reutilizar IDs de criterios deprecados.
7. Editar silenciosamente un criterio APROBADO (toda revisión genera versión).

---

## 7. Papel de la IA

**Cero participación** de IA en la extracción, formulación, clasificación o
aprobación de criterios. La metodología es deliberadamente humana:

- El análisis del puesto lo realiza la empresa con EvaluHR como marco.
- La IA no genera criterios, no sugiere "criterios típicos" del puesto, ni
  prellena `jobRelevance`.
- Futuras asistencias de redacción (si algún día se autorizan) operarían solo
  sobre texto ya aprobado, con registro de origen — decisión que corresponde a
  gobernanza (`09-governance.md` de A-01.3, por analogía de control) y que
  hoy NO existe.

Coherencia con A-01.3: la IA tampoco participa en el scoring psicométrico ni
en la interpretación del IPIP-50-MX.

---

## 8. Criterio vs. instrumento vs. evidencia

```
CRITERIO  = requisito evaluable del puesto (definido por humanos, trazable)
INSTRUMENTO = medio que produce evidencia para un criterio (identificado y versionado)
EVIDENCIA = resultado concreto producido por el instrumento para una persona
```

Un criterio puede quedar **sin instrumento disponible** (estado SUSPENDIDO o
sin evidencia) — esto es normal y se reporta como "sin evidencia", nunca se
sustituye con evidencia de otra categoría.
