# EVALUHR — A-02.3 · PASO 1
# ESTADOS DE EVIDENCIA PARA LA INTERPRETACIÓN

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.2 (EvidenceRecord: `status` ACTIVE/INVALIDATED, `quality`
> HIGH/MEDIUM/LOW/INSUFFICIENT, `reviewStatus` NOT_REQUIRED/PENDING/REVIEWED,
> `conflictRef`, `reasonCode`) y A-02.1 (taxonomía, matriz instrumento↔criterio,
> lenguaje de salidas).

---

## 1. Naturaleza de estos estados

Los cinco estados de este PASO son **estados de interpretación**: una capa
derivada que dice **qué puede hacerse con una evidencia al interpretarla**,
sin alterar jamás los campos originales del EvidenceRecord (A-02.2).

Reglas estructurales:

1. **Derivación determinista**: el estado se calcula por reglas exactas
   (sección 3) a partir de campos ya existentes del EvidenceRecord. Ninguna
   persona ni IA "elige" el estado.
2. **No es un atributo nuevo de la evidencia**: el EvidenceRecord conserva
   sus campos propios (A-02.2 PASO 1). El estado de interpretación vive en la
   capa de resultados (PASOS 2–3) y es reconstruible en cualquier momento.
3. **Biyectividad total**: toda evidencia ACTIVE tiene exactamente un estado
   de interpretación; no existen estados fuera de la tabla de mapeo ni
   casos "especiales" decididos a mano.
4. **INSUFFICIENT ≠ 0** (regla de oro heredada de A-02.2 PASO 11 y aplicada
   a toda esta fase): ningún estado ni transición convierte la ausencia o
   insuficiencia de evidencia en una puntuación.

---

## 2. Definición de los cinco estados

### 2.1 VALID
> La evidencia es **utilizable para la lectura que su tipo permite** (matriz
> de inferencias de A-02.2 PASO 14).

- Qué significa: registro ACTIVE, calidad HIGH o MEDIUM, revisión cerrada
  (`reviewStatus=REVIEWED` si era requerida, o `NOT_REQUIRED`), sin conflicto
  abierto (`conflictRef` vacío o cerrado), con instrumento y versión
  identificables.
- Qué permite: alimentar el `CriterionResult` (PASO 3) dentro de las
  inferencias permitidas de su tipo — y nada más allá de ellas.
- Qué NO permite: inferencias prohibidas del tipo (p. ej., IPIP VALID sigue
  sin poder decir desempeño, aptitud u honestidad).

### 2.2 LIMITED
> La evidencia **solo sirve como contexto u orientación**; no basta para una
> lectura del criterio.

- Qué significa: registro ACTIVE con calidad LOW (p. ej., experiencia
  declarada), o evidencia utilizable únicamente como contexto por regla de
  su tipo (p. ej., "conocimientos declarados" como contexto de formación).
- Qué permite: figurar como contexto descriptivo en la salida, alimentar
  áreas de revisión (PASO 11) y orientar la entrevista.
- Qué NO permite: sostener por sí sola una lectura de cumplimiento del
  criterio; participar en cualquier agregado futuro como si fuera lectura.
- Es el estado que implementa operativamente la regla D-EXP-1 de A-02.2
  ("declaración ≠ cumplimiento") en la capa de interpretación.

### 2.3 INSUFFICIENT
> **No hay evidencia suficiente para evaluar el criterio.** Estado informativo,
> nunca punitivo.

- Qué significa: `quality=INSUFFICIENT` (reglas R1–R9 de A-02.2 PASO 15) o
  que la evidencia disponible no alcanza la lectura exigida (R9).
- Qué permite: producir el mensaje oficial **"Información insuficiente para
  evaluar este criterio."** con su `reasonCode` traducido a causa
  comprensible; generar área de revisión/completación (PASO 11).
- Qué NO permite: **convertirse en 0**, en puntaje, en señal negativa sobre
  la persona, en "no apto", ni participar de ningún cálculo como valor
  medido. Es recuperable (completar administración, aplicar instrumento,
  cerrar revisión, resolver conflicto).

### 2.4 INVALID
> La evidencia **no es utilizable y no debe contarse**, conservándose solo
> como antecedente de auditoría.

- Qué significa: `status=INVALIDATED` (invalidación de gobernanza, A-02.2
  PASO 16), o registro rechazado por error de integridad documentado (p. ej.,
  `category` no coincide con la del criterio).
- Qué permite: trazabilidad histórica y auditoría; justificar que el criterio
  vuelve a estado sin evidencia válida.
- Qué NO permite: alimentar ninguna salida interpretativa; ser "rescatado"
  sin acto explícito de gobernanza; desaparecer (append-only).

### 2.5 PENDING_REVIEW
> La evidencia **está bloqueada para la interpretación hasta que una persona
> revise**.

- Qué significa: `reviewRequired=true` y `reviewStatus=PENDING`, o conflicto
  abierto (PASO 9 de este dossier). El registro puede ser de buena calidad y
  aun así quedar bloqueado.
- Qué permite: mostrarse como pendiente de revisión; generar área de revisión
  (PASO 11); conservar sus datos visibles para la persona revisora.
- Qué NO permite: alimentar lectura alguna, orientativa o no, mientras la
  revisión no cierre (`REVIEWED` con revisor + fecha + nota, A-02.2 PASO 1).

---

## 3. Tabla de mapeo determinista (estado = f(EvidenceRecord))

Precedencia: se evalúa de arriba hacia abajo; **la primera regla que aplica
gana** (garantiza un único estado por registro).

| # | Condición (sobre el EvidenceRecord) | Estado |
|---|---|---|
| M1 | `status=INVALIDATED` (o registro rechazado por integridad documentada) | **INVALID** |
| M2 | `reviewRequired=true` y `reviewStatus=PENDING` | **PENDING_REVIEW** |
| M3 | `conflictRef` abierto (conflicto sin cierre humano documentado) | **PENDING_REVIEW** |
| M4 | `quality=INSUFFICIENT` (R1–R9, con `reasonCode`) | **INSUFFICIENT** |
| M5 | `quality=LOW` | **LIMITED** |
| M6 | `quality=HIGH` o `MEDIUM`, revisión cerrada, sin conflicto | **VALID** |

Notas de la tabla:

- M1 precede a todo: una evidencia invalidada nunca se revisa ni se usa,
  se conserva.
- M2/M3 preceden a M4: un registro INSUFFICIENT con revisión pendiente se
  reporta como PENDING_REVIEW (la revisión puede concluir en completación o
  invalidación; ambas rutas quedan abiertas y registradas).
- No existe regla que produzca "VALID con calidad LOW" ni "INSUFFICIENT con
  puntaje": los caminos que lo intentarían están cerrados por construcción.

---

## 4. Comportamiento de cada estado en la salida

| Estado | Aparece como | Puede alimentar | Jamás puede |
|---|---|---|---|
| VALID | Lectura descriptiva del criterio (dentro de inferencias permitidas) | CriterionResult (PASO 3); AssessmentSummary (PASO 10) | Inferencias prohibidas del tipo; aggregates futuros que violen herencia |
| LIMITED | "Contexto orientativo (no lectura del criterio)" | Áreas de revisión; orientación de entrevista | Lectura de cumplimiento; agregados como si fuera lectura |
| INSUFFICIENT | "Información insuficiente para evaluar este criterio." + causa | Áreas de revisión/completación | 0; puntaje; señal negativa; "no apto"; cálculos |
| INVALID | No aparece en salidas activas (solo en auditoría) | Trazabilidad | Reutilización sin gobernanza; borrado |
| PENDING_REVIEW | "Pendiente de revisión humana" + datos visibles para el revisor | Áreas de revisión | Cualquier lectura mientras `PENDING` |

---

## 5. Prohibiciones transversales de los estados

1. ❌ Derivar de cualquier estado un veredicto sobre la persona (los estados
   describen evidencia y proceso, no personas).
2. ❌ Usar INSFFICIENT como 0 (o como cualquier valor numérico) en cálculos
   presentes o futuros — regla heredada obligatoriamente por el futuro
   "Nivel de ajuste" (A-02.1 PASO 9).
3. ❌ Transiciones informales entre estados fuera de la tabla M1–M6 y de los
   actos de gobernanza registrados (A-02.2 PASO 16).
4. ❌ Ocultar estados: toda salida declara cuántos criterios quedan en cada
   estado (PASO 10).
5. ❌ Que la IA asigne, cambie o interprete estados (AI-X3/X10, PASO 14 de
   este dossier).
