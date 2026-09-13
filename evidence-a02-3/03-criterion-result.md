# EVALUHR — A-02.3 · PASO 3
# RESULTADO DE CRITERIO (CriterionResult)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 (criterios, taxonomía A–E, HDC, lenguaje), A-02.2 (EvidenceRecord,
> calidad, matriz de inferencias), PASOS 1–2 de este dossier.

---

## 1. Definición

> Un **CriterionResult** es el **resultado de evaluar un criterio aprobado**
> (A-02.1) a partir de las evidencias disponibles (EvidenceRecord, A-02.2),
> expresado como **lectura descriptiva, contexto, insuficiencia, conflicto o
> pendencia de revisión** — según los estados de evidencia (PASO 1) y las
> reglas de su categoría.

El CriterionResult es la **única puerta** entre la evidencia y cualquier
consolidación futura (AssessmentSummary, PASO 10; "Nivel de ajuste", fase
posterior autorizada). No existe lectura de criterio fuera de esta estructura.

---

## 2. Campos conceptuales

| Campo | Descripción y reglas |
|---|---|
| `criterionResultId` | Identificador único y no reutilizable. |
| `criterionId` | Criterio aprobado (A-02.1) evaluado. Regla dura: **sin criterio no hay CriterionResult** (un InstrumentResult sin criterio queda en la capa de instrumento, PASO 2 §5). |
| `criterionVersion` | Versión del criterio al momento de evaluar (protege contra lecturas anacrónicas). |
| `criterionCategory` | Categoría taxonómica (A CONOCIMIENTOS / B HAB-COMP / C EXP-FORM / D PERSONALIDAD / E INTEGRIDAD). Debe coincidir con la de las evidencias (integridad A-02.2). |
| `evidenceId` (lista) | EvidenceRecords utilizados. **Solo cuentan evidencias en estado VALID** (para lectura) o LIMITED (para contexto, marcadas como tales); las INVALID no cuentan; las PENDING_REVIEW bloquean; las INSUFFICIENT producen el estado de insuficiencia. |
| `result` | Contenido descriptivo del resultado. Valores permitidos: `DESCRIPTIVE_READING` (lectura dentro de las inferencias permitidas de la categoría) · `CONTEXT_ONLY` (solo contexto, evidencias LIMITED) · `INSUFFICIENT` (con `reasonCode` R1–R9) · `CONFLICT_OPEN` · `NOT_EVALUATED` (sin evidencia). Prohibido: valores numéricos agregados, etiquetas de idoneidad. |
| `quality` | Calidad declarada del resultado = la de la mejor evidencia VALID que lo sostiene (o INSUFFICIENT si no hay ninguna). La calidad no se "promedia" ni se inventa. |
| `status` | Estado de evidencia dominante del criterio según la tabla M1–M6 (PASO 1): VALID / LIMITED / INSUFFICIENT / INVALID / PENDING_REVIEW. |
| `interpretationStatus` | Estado de la interpretación: `NOT_INTERPRETED` (no hay lectura; p. ej., solo evidencia insuficiente) · `DESCRIPTIVE_ONLY` (lectura descriptiva permitida) · `CONTEXT_ONLY` · `BLOCKED_REVIEW` (bloqueado por revisión/conflicto) · `INTERPRETED_WITH_REVIEW` (lectura descriptiva + revisión humana cerrada documentada). |
| `reviewRequired` | Booleano por reglas (herencia matriz A-02.2 PASO 14; forzado a true en conflicto, evidencia LOW, entrevista, integridad, competencias). |
| `readings` | Textos de lectura descriptiva en lenguaje permitido (P1–P8 de A-02.1), cada uno citando los `evidenceId` que lo sostienen. |

---

## 3. Qué puede y qué no puede concluirse — POR CATEGORÍA

### 3.1 Categoría A — CONOCIMIENTOS
- **Puede** (cuando exista prueba válida K1–K6, herencia A-02.2 PASO 5): lectura
  de dominio declarativo medido — "aciertos X/Y sobre el contenido definido del
  criterio", con revisión humana.
- **No puede**: inferir habilidad de ejecución ni desempeño; atribuir a la
  persona el 0 artefactual por falta de `correctAnswer` (K-INS-1); usar como
  única base de decisión.

### 3.2 Categoría B — HABILIDADES/COMPETENCIAS
- **Puede hoy**: solo `INSUFFICIENT` (`NO_METHOD`). **No existe lectura.**
- **Puede en el futuro** (si se aprueba un método conductual, PASO 6): registro
  descriptivo de indicadores observados por el método aprobado, con revisión.
- **No puede jamás**: derivar competencia de rasgos Big Five; aceptar
  auto-reporte como competencia medida; producir niveles de dominio sin
  diseño aprobado.

### 3.3 Categoría C — EXPERIENCIA/FORMACIÓN
- **Puede**: con verificación positiva (estado VERIFIED, PASO 8): "acreditación
  documental del dato" (existe/legible/vigente/corresponde); con declaración
  (DECLARED): contexto orientativo de trayectoria.
- **No puede**: asumir declaración = cumplimiento (D-EXP-1); convertir años en
  capacidad, desempeño o conocimiento vigente; ocultar verificaciones
  negativas (CONTRADICTED es resultado legítimo).

### 3.4 Categoría D — PERSONALIDAD
- **Puede**: lectura descriptiva de **tendencias de respuesta** auto-reportadas
  (P8), citando instrumento y versión; contraste cualitativo con la hipótesis
  de correspondencia HDC registrada (sin umbral, A-02.1 PASO 4), que en todo
  caso genera área de revisión (PASO 11) — no un veredicto.
- **No puede jamás**: cumplimiento, incumplimiento, aptitud, recomendación
  laboral, "perfil ideal", predictor automático, sustituir criterio laboral o
  entrevista (herencia A-01.3/A-02.2 sin excepciones).

### 3.5 Categoría E — INTEGRIDAD
- **Puede hoy**: solo `INSUFFICIENT` (regla I-INT-1). **No existe lectura.**
- **No puede jamás**: score de integridad artificial, "confiabilidad" de la
  persona, o presentar el instrumento legacy como prueba psicométrica
  validada (frase obligatoria de A-02.1 07).

---

## 4. Reglas de construcción

1. **Cerrado por evidencia**: el CriterionResult se construye solo con
   EvidenceRecord trazables; no hay "conocimiento del sistema" añadido.
2. **Determinista**: la selección de evidencias y el estado resultante aplican
   las tablas M1–M6 (PASO 1) y la matriz de calidad (A-02.2 PASO 14) por
   código/reglas versionadas — ni IA ni opinión.
3. **Conflicto bloquea**: si hay conflicto abierto (PASO 9), el resultado es
   `CONFLICT_OPEN` + área de revisión; no se elige evidencia "ganadora".
4. **Insuficiencia explícita**: `INSUFFICIENT` se reporta con causa
   comprensible; **jamás como 0** ni como ausencia silenciosa.
5. **Revisión pendiente bloquea salida interpretativa** (PASO 1, M2/M3).
6. **Append-only y trazable**: cada CriterionResult registra qué evidencias,
   qué reglas y qué versión de reglas lo produjeron (PASO 15).
7. **Lenguaje controlado**: toda lectura usa el directorio P1–P8 y pasa el
   filtro prohibidos X1–X15 (A-02.1 PASO 14).

---

## 5. Relación con las salidas del modelo

```
InstrumentResult (PASO 2)
        ↓  anclaje a criterio aprobado (A-02.2)
EvidenceRecord(s) (A-02.2)  →  estados (PASO 1)
        ↓
CriterionResult (ESTE PASO)  →  salida B del modelo (PASO 17)
        ↓
AssessmentSummary (PASO 10) · Áreas de revisión (PASO 11) ·
Recomendación técnica (PASO 12) → Revisión humana (PASO 13)
```

El CriterionResult **no calcula score global** y **no condensa** las
evidencias en un número: las conserva citadas, con sus calidades y estados.
