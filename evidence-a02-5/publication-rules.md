# EVALUHR — A-02.5 · PASO 18
# REGLAS DE PUBLICACIÓN DE CRITERIOS (CICLO DE VIDA)

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: PASO 15 (gobernanza); A-02.1 PASO 3 §4 (estados PROPUESTO/APROBADO/
> SUSPENDIDO/DEPRECIADO — se armonizan abajo); A-02.2 PASO 16 (gobernanza,
> append-only, anti-manipulación).

---

## 1. Ciclo de vida

```
        ┌──────────┐
        │  DRAFT   │  propuesta registrada, expediente en construcción
        └────┬─────┘
             │ expediente completo (PASO 15 §2)
             ▼
        ┌──────────┐   rechazo motivado
        │  REVIEW  │────────────────────────▶ REJECTED (registrado, id no reutilizado)
        └────┬─────┘
             │ dictamen favorable + aprobación humana
             ▼
        ┌──────────┐
        │ APPROVED │  criterio aprobado, aún sin publicación
        └────┬─────┘
             │ publicación por gobernanza (reglas §3)
             ▼
        ┌──────────┐   pérdida temporal de instrumento/fuente
        │  ACTIVE  │───────────────────┐
        └────┬─────┘                   ▼
             │                     SUSPENDED (recuperable; reevaluación)
             │ revalidación fallida / puesto cambió / obsolescencia
             ▼
        ┌──────────┐
        │  RETIRED │  histórico conservado; criterionId jamás reutilizado
        └──────────┘
```

### Armonización con A-02.1

| Ciclo A-02.5 | Equivalente A-02.1 | Nota |
|---|---|---|
| DRAFT / REVIEW | PROPUESTO | PROPUESTO se despliega en dos estados para exigir el expediente antes de revisión |
| APPROVED / ACTIVE | APROBADO | APPROVED = aprobado sin publicar; ACTIVE = recibiendo evidencia |
| SUSPENDED | SUSPENDIDO | idéntico (sin instrumento/fuente temporalmente) |
| RETIRED | DEPRECIADO | idéntico (histórico conservado, id no reutilizado) |
| REJECTED | (no existía) | formaliza el "rechazo registrado" de A-02.1 PASO 3 §3 |

---

## 2. Criterios de entrada y salida por estado

| Estado | Requisitos para ENTRAR | Cuándo SALE / a dónde |
|---|---|---|
| **DRAFT** | Proponente registrado; puesto identificado; borrador de criterio (nombre, categoría propuesta) | Expediente completo → REVIEW · abandono → cierre de propuesta (registrado) |
| **REVIEW** | Expediente completo: fuentes S1–S8 con fecha, trazabilidad R-REL-1..3, regla de verificación (si C), calificador de criticidad (si CRITICAL), fuerza de relación propuesta con evidenceBasis | Dictamen + aprobación → APPROVED · dictamen adverso → REJECTED · correcciones → DRAFT (re-envío registrado) |
| **APPROVED** | Revisor independiente dictaminó; `approvedBy` humano; `version` asignada; campos mínimos PASO 15 §2 completos | Publicación → ACTIVE · decisión de no publicar → se conserva como APPROVED (registrado) |
| **ACTIVE** | Reglas de publicación §3 cumplidas; matrices (PASO 17) actualizadas | Revalidación fallida → REVIEW · pérdida de instrumento/fuente → SUSPENDED · obsolescencia/puesto cambió → RETIRED |
| **SUSPENDED** | Acto registrado de gobernanza con causa (instrumento caído, fuente vencida) | Causa resuelta → ACTIVE (reevaluación) · causa permanente → RETIRED |
| **RETIRED** | Acto registrado con motivo (puesto cambió, norma cambió, criterio sustituido) | Terminal — histórico consultable; **jamás** reutilización de criterionId |

Reglas transversales:

1. **Toda transición es un acto registrado** (actor, fecha, motivo, base
   documental) — append-only; prohibida la edición silenciosa.
2. **REVIEW obligatorio** (re-ingreso) cuando: cambia la versión mayor del
   puesto, cambia el instrumento, cambia la norma citada (S6), o una
   auditoría (PASO 19) encuentra desviación.
3. **REJECTED no borra**: el rechazo queda con su motivo (anti "criterios
   fantasma", herencia A-02.1).
4. Ningún estado es asignable por el sistema solo ni por IA: son **actos de
   gobernanza** (AI-X18/X19 aplican).

---

## 3. Reglas para pasar a ACTIVE (publicación) — compuerta final

Un criterio puede publicarse (ACTIVE) **solo si** se cumple todo esto:

| # | Compuerta | Referencia |
|---|---|---|
| PUB-1 | `jobRelevance = VALID` (R-REL-1..5 completas) | PASO 1 |
| PUB-2 | `criticality` declarada con calificador si es CRITICAL; coherente con requiredOrPreferred | PASOS 2–3 |
| PUB-3 | `relationshipStrength` vigente declarada con `evidenceBasis` citada (aunque sea HYPOTHESIS/NOT_SUPPORTED — se publica la verdad) | PASO 11 |
| PUB-4 | Si es criterio D: salvaguardas SG-1..SG-6 verificadas; nunca CRITICAL | PASO 13 |
| PUB-5 | Si es CRITICAL **sin** instrumento capaz hoy: la publicación exige declaración explícita de la consecuencia (hard gate → resultados incompletos hasta cerrar la brecha) | PASO 3; A-02.4 gates |
| PUB-6 | Campos mínimos completos (criterionId, jobId, rationale, source, approvedBy, version) | PASO 15 |
| PUB-7 | Matrices actualizadas (`criterion-validation-matrix.csv`) y registros append-only | PASO 17 |
| PUB-8 | Revisión de proporcionalidad/datos delicados si el instrumento previsto lo amerita | PASO 14 |

---

## 4. Versionado

| Cambio | Versión |
|---|---|
| Redacción sin cambio semántico | menor (x.1) |
| Cambio de contenido evaluado, criticidad, calificador, regla de verificación, fuerza de relación | mayor (x+1.0) |
| Cambio de categoría o de puesto-base | nueva versión mayor **+** proceso completo desde Proposal (PASO 15) |

El historial es append-only: versiones previas consultables; evidencias
históricas conservan el vínculo a la versión del criterio con que fueron
evaluadas (coherencia con trazabilidad A-02.3 PASO 15: versiones en todo
eslabón).

---

## 5. Publicación ≠ funcionamiento

- PUBLICAR un criterio significa que **existe metodológicamente** (puede
  recibir evidencia según las reglas vigentes y participar del nivel de
  ajuste de A-02.4 cuando esa fase se opere).
- **No** significa que exista funcionalidad de software (nada de A-02.1..A-02.5
  está implementado — regla final del encargo).
- La matriz `criterion-validation-matrix.csv` refleja el estado de
  gobernanza; la ausencia de una fila ACTIVE es informativa, no un error.
