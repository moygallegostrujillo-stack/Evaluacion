# EVALUHR — A-02.3 · PASO 15
# TRAZABILIDAD DE PUNTA A PUNTA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 16 (modelo conceptual de 8 eslabones), A-02.2 PASO 13
> (audit trail). Este PASO extiende la cadena con las capas de A-02.3.

---

## 1. La cadena completa de reconstrucción

```
PUESTO
  → CRITERIO
    → EVIDENCIA
      → INSTRUMENTO
        → VERSION
          → RESULTADO
            → INTERPRETACIÓN
              → ÁREA DE REVISIÓN
                → REVISIÓN HUMANA
                  → DECISIÓN DEL CLIENTE
```

**Regla**: cualquier salida de EvaluHR debe poder reconstruirse en ambas
direcciones — de la decisión hacia atrás (¿en qué evidencia se apoyó?) y de
la evidencia hacia adelante (¿qué lecturas, áreas y revisiones produjo?).

---

## 2. Los diez eslabones: qué se registra en cada transición

| Eslabón | Objeto + identificador | Qué registra la transición hacia el siguiente |
|---|---|---|
| 1. PUESTO | Registro del puesto (A-02.1 PASO 1) + `positionRecordVersion` | Qué criterios aprobados lo componen (y con qué versión de registro) |
| 2. CRITERIO | Criterion Record (A-02.1 PASO 3): `criterionId` + `criterionVersion` | Qué instrumentos aprobados lo evidencian (matriz A-02.1) y qué hipótesis HDC (si categoría D) |
| 3. EVIDENCIA | EvidenceRecord (A-02.2): `evidenceId` | Qué método se aplicó, con qué fuente, fecha y calidad; anclaje criterio↔instrumento |
| 4. INSTRUMENTO | Identificador del instrumento (`instrument`) | Que el instrumento estaba aprobado en la matriz para esa categoría |
| 5. VERSION | `instrumentVersion` + `languageVersion` + `scoringVersion` | Qué reglas exactas produjeron el dato (cuádruple identificación, A-01.3) |
| 6. RESULTADO | InstrumentResult (PASO 2): `instrumentResultId` → EvidenceRecord `value` | Resultado crudo, unidad, completitud, calidad de administración |
| 7. INTERPRETACIÓN | CriterionResult (PASO 3): `criterionResultId` + `rulesVersion` | Qué evidencias (VALID/LIMITED) sostienen la lectura; estado; lectura descriptiva; prohibido el salto directo instrumento→interpretación sin criterio |
| 8. ÁREA DE REVISIÓN | Área (PASO 11): `areaId` | Disparador (T1–T8), razón, evidencia citada, severidad de proceso |
| 9. REVISIÓN HUMANA | AssessmentReview (PASO 13): `reviewId` | Revisor, fecha, evidencia/áreas revisadas, decisión (CONFIRM/AMPLIFY/CONTEXTUALIZE/CONTRADICT/DISCARD), notas/overrideReason |
| 10. DECISIÓN DEL CLIENTE | Decisión de la empresa (fuera de EvaluHR; registrada como referencia de proceso si el cliente lo permite) | La decisión **no la produce el sistema**: el sistema solo conserva la cadena que la precede |

---

## 3. Reglas de la trazabilidad

1. **IDs enlazables**: cada eslabón guarda los identificadores de sus
   vecinos (arriba y abajo); ninguna salida presenta un dato sin su cadena.
2. **Versiones en todo eslabón**: puesto, criterio, instrumento (cuádruple),
   reglas de interpretación (`rulesVersion`) — evita lecturas anacrónicas.
3. **Append-only**: nada se sobrescribe ni se borra; correcciones =
   registro nuevo + invalidación documentada (A-02.2 PASO 16).
4. **Revisión sin reescritura**: la revisión humana (eslabón 9) se registra
   **junto a** los eslabones 6–8, jamás encima de ellos (PASO 13 §4).
5. **Insuficiencias trazables**: los criterios INSUFFICIENT también viajan
   en la cadena con su `reasonCode` — la ausencia es un hecho trazable, no
   un hueco silencioso (y nunca un 0).
6. **IA marcada**: si algún texto de salida fue asistido por IA (AI-2/3b/5),
   queda marcado en el eslabón correspondiente, sin alterar los datos.
7. **Reconstrucción auditable**: para cualquier punto temporal, se puede
   reproducir la salida con las reglas y versiones vigentes entonces
   (determinismo + append-only).

---

## 4. Casos límite

| Caso | Comportamiento de la cadena |
|---|---|
| Resultado de instrumento sin criterio aprobado | La cadena se detiene en el eslabón 6 (resultado visible, sin interpretación: PASO 2 §5) |
| Evidencia invalidada | Permanece en la cadena marcada INVALID; los eslabones que la usaron quedan con nota de invalidez (no se reescriben) |
| Conflicto cerrado por revisión | La cadena conserva ambas fuentes + el `reviewId` que la cerró |
| Decisión del cliente sin revisión previa | El sistema no puede impedirla (protección documental); la cadena muestra `humanReviewRequired=true` sin `reviewId` — anomalía visible en auditoría |
| Cambio de versión de criterio/instrumento a mitad de proceso | Cada eslabón conserva la versión con la que se produjo; no hay "repunte" retroactivo (herencia A-01.3/A-02.2) |
