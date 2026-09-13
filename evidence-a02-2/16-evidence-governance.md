# EVALUHR — A-02.2 · PASO 16
# GOBERNANZA DE LA EVIDENCIA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Continuidad: Instrument Owner y roles definidos en `evidence-a01-3/09-governance.md`.

---

## 1. Principios de gobernanza del modelo de evidencia

1. **Separación de duties**: quien genera evidencia no la revisa; quien
   revisa no la invalida; quien invalida no la genera.
2. **Toda autoridad es humana y nominal**: los roles se ocupan por personas
   identificadas (nombre + rol + fecha), nunca por "el sistema" ni por IA.
3. **Append-only**: las decisiones de gobernanza se registran; nada se borra
   ni se reescribe.
4. **Sin reinterpretación retroactiva**: las decisiones aplican hacia
   adelante (herencia A-01.3).

---

## 2. ¿Quién puede APROBAR evidencia?

| Objeto | Autoridad | Registro |
|---|---|---|
| Evidencia declarativa/entrevista/documental (uso por criterio) | **RH de la empresa** (persona identificada) | `approvedBy` del EvidenceRecord + audit trail |
| Evidencia de instrumento (IPIP-50-MX) | Aprobación **ex-ante** de la pareja criterio↔instrumento en la matriz (A-02.1), autorizada por **Instrument Owner + dirección de EvaluHR**; el registro referencia esa aprobación | Referencia de aprobación + versión de la matriz |
| Cambios a la matriz de calidad (reglas PASO 3/14) | **Instrument Owner + dirección** (con asesoría en psicometría si el cambio afecta constructos psicométricos) | Versión nueva de reglas (`qualityRulesVersion`), nunca edición silenciosa |
| Salida del estado INSUFFICIENT (catálogo R1–R9) | Definida por **Instrument Owner**; aplicada determinísticamente por el sistema | Versionado de reglas |

Prohibido: aprobar evidencia propia sin segunda persona (auto-aprobación)
salvo ausencia documentada de segunda persona, que se registra como
excepción en el audit trail.

---

## 3. ¿Quién puede CAMBIAR criterios?

Herencia directa de A-02.1 (PASO 3) y A-01.3 (gobernanza):

- **Crear/modificar/deprecar criterios**: empresa (rol designado en el
  registro de puesto) **con** revisión de RH; cambios de taxonomía o reglas
  del modelo de criterios: **Instrument Owner + dirección de EvaluHR**.
- Todo cambio genera **nueva versión** del criterio (`criterionVersion`);
  los históricos no se reinterpretan; la evidencia ya capturada conserva su
  `criterionVersion` original.
- Prohibido: cambiar criterios para "acomodar" evidencia existente
  (anti-manipulación; complementa la prohibición post-hoc de A-02.1 PASO 9).

---

## 4. ¿Quién puede REVISAR?

| Objeto | Revisor |
|---|---|
| Evidencia con `reviewRequired=true` | Persona humana identificada de RH/empresa, **distinta del generador** cuando sea posible |
| Evidencia de entrevista | Segunda persona (RH) distinta del entrevistador |
| Conflictos (PASO 10) | RH de la empresa; cierre documentado con lectura motivada |
| Salidas interpretativas futuras | RH (revisión humana obligatoria, A-02.1 PASO 11) |

El revisor queda identificado en el audit trail con fecha y nota
(`reviewStatus=REVIEWED` exige los tres elementos).

---

## 5. ¿Quién puede INVALIDAR evidencia?

| Autoridad | Alcance | Registro |
|---|---|---|
| **Instrument Owner de EvaluHR** (+ dirección para casos de impacto) | Invalidar registros cuando se detecte: falla de instrumento, corrección oficial de clave, anomalía sistemática, uso indebido del método | Evento de invalidación: autor, motivo, fecha, registros afectados, evidencia sustituta si existe |
| **RH de la empresa** | Invalidar registros de su propia captura humana (entrevista, verificación, declaración usada) con motivo documentado | Ídem |
| Sistema (determinista) | Marcar anomalías técnicas (PASO 3) que **degradan** calidad; la invalidación formal sigue siendo humana | Evento automático visible en el trail |

Reglas de la invalidación:

1. Solo transición permitida del ciclo: `ACTIVE → INVALIDATED` (única;
   reversible solo mediante evidencia nueva, no "des-invalidez").
2. Nunca se borra el registro; el motivo queda registrado (PASO 13).
3. Invalidar evidencia de un criterio activa R7 (INSUFFICIENT) hasta que
   exista evidencia válida nueva.

---

## 6. Matriz de separación de duties (resumen)

| Acción | Generar | Revisar | Aprobar uso | Invalidar | Cambiar criterios/reglas |
|---|---|---|---|---|---|
| Sistema (determinista) | ✔ (instrumentos) | — | — | marca anomalías | — |
| Candidato | declara | — | — | — | — |
| Entrevistador/verificador | ✔ (humana) | — | — | — | — |
| RH de la empresa | — | ✔ | ✔ | ✔ (su captura) | ✔ (criterios de su empresa, con revisión) |
| Instrument Owner + dirección | — | ✔ (reglas) | ✔ (ex-ante matriz) | ✔ (cualquiera, con motivo) | ✔ (modelo/reglas/taxonomía) |
| IA | ❌ nunca | ❌ nunca | ❌ nunca | ❌ nunca | ❌ nunca |

---

## 7. Escalamiento

1. Anomalía operativa (falla técnica, sospecha de dato corrupto) → reporte a
   Instrument Owner → posible invalidación (R4/R7).
2. Disputa sobre calidad de evidencia entre empresa y EvaluHR → resolución
   por Instrument Owner con registro; si afecta constructos psicométricos,
   asesoría en psicometría.
3. Uso indebido detectado (p. ej., empresa usando evidencia INSUFFICIENT
   como puntaje) → nota de cumplimiento + corrección documental; la
   protección sigue siendo de diseño y registro (limitación conocida,
   dossier §15).
