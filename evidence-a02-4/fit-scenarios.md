# EVALUHR — A-02.4 · PASO 14 (+18)
# PRUEBAS DE CASO CONCEPTUALES (fit-scenarios)

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Escenarios conceptuales para validar el comportamiento del modelo propuesto
> (PASO 13) contra los 8 casos del encargo. Niveles mencionados = estructura
> conceptual (umbrales θ SIN DEFINIR). Marco: criterios con criticidad
> declarada; IPIP solo contexto; competencias e integridad hoy INSUFFICIENT
> estructural.

---

## CASO A — Todos los criterios con evidencia válida

- **Situación**: todos los criterios del puesto (CRITICAL/IMPORTANT/STANDARD)
  con CriterionResult `state=VALID`, lecturas de correspondencia
  CORRESPONDE (con excepciones parciales si las hay, aquí no).
- **Resultado esperado**: sin gates → se compone el perfil → **nivel de
  ajuste producido** (cualitativo; ALTO solo si la estructura θ lo permite),
  con explicación completa, cero exclusiones, métricas de completitud 100%.
- **Nivel de ajuste posible**: sí (nivel según reglas θ).
- **Áreas de revisión**: ninguna por brecha; posibles áreas de
  contextualización (T6) si las lecturas lo ameritan.
- **¿Recomienda entrevista?**: posible, si existen áreas que ameriten
  conversación (C1–C6 de A-02.3); no obligatoria.

---

## CASO B — Un criterio STANDARD con INSUFFICIENT

- **Situación**: un criterio STANDARD queda `INSUFFICIENT` (p. ej.,
  `NOT_ADMINISTERED`); resto VALID sin brechas.
- **Resultado esperado**: sin gate (STANDARD) → **nivel producido** con la
  **exclusión declarada** ("no evaluable", razón visible); el criterio sale
  del dominio de Qᴾ (no suma 0); área de completación abierta (RA-02).
- **Nivel de ajuste posible**: sí, según reglas θ sobre el resto.
- **Áreas**: RA-02 (criterio sin evidencia, MEDIUM).
- **¿Recomienda entrevista?**: posible (completar/explorar el criterio).

---

## CASO C — Un criterio IMPORTANT con INSUFFICIENT

- **Situación**: un criterio IMPORTANT queda `INSUFFICIENT` (p. ej.,
  experiencia declarada sin verificar, R9); resto VALID.
- **Resultado esperado**: **soft gate** (PROPUESTA) → nivel **acotado**:
  tope máximo MEDIO (SOLO EJEMPLO — NO PRODUCTIVO) aunque el resto del
  perfil sea excelente; incompletitud visible; exclusión declarada con causa
  ("evidencia insuficiente: declaración sin verificar"); área RA-08.
- **Nivel de ajuste posible**: sí, pero **nunca ALTO** mientras dure la
  brecha.
- **Áreas**: RA-08 (declarada no verificada, LOW) o la regla que aplique.
- **¿Recomienda entrevista?**: sí, naturalmente (verificar/explorar).

---

## CASO D — Un criterio CRITICAL con INSUFFICIENT

- **Situación**: un criterio CRITICAL queda `INSUFFICIENT` (p. ej., crítico
  sin instrumento aplicado o sin método).
- **Resultado esperado**: **hard gate G1** → **NO se produce nivel**. Salida
  = **"Evidencia insuficiente para determinar el nivel de ajuste."** con el
  criterio listado (crítico, causa, reasonCode), áreas (RA-01: HIGH), bloque
  de revisión y los demás resultados de criterio visibles.
- **Nivel de ajuste posible**: **no** (ni ALTO, ni MEDIO, ni BAJO — la
  ausencia no es evidencia negativa).
- **Áreas**: RA-01 (criterio crítico sin evidencia, HIGH).
- **¿Recomienda entrevista?**: sí (si hay evidencia parcial utilizable:
  explorar/completar el crítico; C1–C6).

---

## CASO E — Conflicto entre dos evidencias

- **Situación**: dos registros VALID del mismo criterio con lecturas opuestas
  (p. ej., IPIP tendencia vs entrevista; instrumento A vs B).
- **Resultado esperado**: `CONFLICT_OPEN` → **PENDING_REVIEW** (A-02.3). Sin
  resolución matemática: ni promedio, ni "ganador". Si el criterio es
  CRITICAL → hard gate G2 (resultado incompleto); si IMPORTANT → tope;
  si STANDARD → exclusión temporal visible con conflicto abierto (RA-10).
- **Nivel de ajuste posible**: solo si el conflicto no afecta a un crítico
  (y con el criterio en conflicto excluido y visible).
- **Áreas**: RA-10 (conflicto, HIGH).
- **¿Recomienda entrevista?**: sí (el protocolo de conflictos usa la
  entrevista como vía de contraste; cierre documentado).

---

## CASO F — IPIP alto + conocimiento insuficiente

- **Situación**: tendencias de personalidad altas (IPIP-50-MX VALID,
  lectura descriptiva) + criterio de conocimiento `INSUFFICIENT`
  (p. ej., K-INS-1: clave de respuestas inválida, 0 artefactual).
- **Resultado esperado**: el IPIP **no es evidencia de cumplimiento** (nunca
  entra en Qᴾ: A-02.3 PASO 4); el conocimiento excluido/gate según su
  criticidad. Si el conocimiento es CRITICAL → resultado incompleto. La
  salida **jamás** dice "su perfil de personalidad compensa".
- **Nivel de ajuste posible**: no si el conocimiento es crítico; sí (acotado
  según brechas) si no lo es, con el IPIP citado solo como contexto
  descriptivo.
- **Áreas**: RA-03 (conocimiento K-INS-1, HIGH) + área D si la HDC amerita.
- **¿Recomienda entrevista?**: sí (probar el conocimiento por vía válida o
  explorar).

---

## CASO G — Conocimiento alto + integridad INSUFFICIENT

- **Situación**: criterio de conocimiento con lectura VALID CORRESPONDE +
  criterio de integridad `INSUFFICIENT` **estructural** (I-INT-1: sin
  expediente psicométrico suficiente).
- **Resultado esperado**: la integridad es **NON-COMPENSABLE si es crítico**
  → gate → resultado incompleto; el conocimiento alto **no compensa**
  (regla maestra + PASO 15). Si el criterio E es IMPORTANT/STANDARD,
  exclusión estructural declarada ("no evaluable: sin expediente
  metodológico suficiente") + área RA-06. Frase obligatoria de integridad en
  la salida si toca el tema.
- **Nivel de ajuste posible**: no si E es crítico; sí acotado si no lo es.
- **Áreas**: RA-06 (integridad I-INT-1, MEDIUM por regla de catálogo).
- **¿Recomienda entrevista?**: posible (explorar el tema por vías humanas
  legítimas), sin score de integridad y sin presentarlo como prueba
  validada.

---

## CASO H — Toda la evidencia declarada pero no verificada

- **Situación**: experiencia/formación toda DECLARED (LIMITED, contexto);
  sin una sola lectura VALID de cumplimiento.
- **Resultado esperado**: sin ninguna lectura de cumplimiento utilizable →
  **no hay qué componer** → resultado incompleto ("Evidencia insuficiente
  para determinar el nivel de ajuste.") con la lista de criterios
  "evidencia declarada no verificada", áreas RA-08, y el contexto declarado
  visible como tal.
- **Nivel de ajuste posible**: **no**.
- **Áreas**: RA-08 por criterio declarado (LOW c/u).
- **¿Recomienda entrevista?**: sí si hay alguna evidencia parcial utilizable
  (C2) — p. ej., resultados de instrumento con revisión cerrada; si no, solo
  resultado incompleto + áreas de verificación.

---

## Tabla resumen

| Caso | Gates | ¿Nivel? | Exclusiones/Topes | Áreas | ¿Entrevista? |
|---|---|---|---|---|---|
| A | No | Sí | — | — | Posible |
| B | No | Sí | Exclusión STANDARD | RA-02 | Posible |
| C | Soft | Sí, tope MEDIO (ejemplo) | Exclusión IMPORTANT | RA-08 | Sí |
| D | G1 | **No** (incompleto) | Gate crítico | RA-01 | Sí (si hay evidencia parcial) |
| E | G2 si crítico | Solo si no es crítico (excluido) | PENDING_REVIEW | RA-10 | Sí |
| F | G1 si conocimiento crítico | Solo si no es crítico | IPIP nunca compensa | RA-03 | Sí |
| G | G1 si integridad crítica | Solo si no es crítico | Exclusión estructural | RA-06 | Posible |
| H | Sin lecturas VALID | **No** (incompleto) | Todo LIMITED | RA-08 | Sí si hay evidencia parcial utilizable |

Regla transversal verificada en los 8 casos: **INSUFFICIENT nunca es 0; la
ausencia nunca produce BAJO; los críticos nunca se compensan; los conflictos
nunca se resuelven matemáticamente.**
