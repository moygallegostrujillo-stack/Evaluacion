# EVALUHR — A-02.3 · PASO 13
# REVISIÓN HUMANA — AssessmentReview

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 11 (modelo de revisión humana, flujo de responsabilidades),
> A-02.2 PASO 13 (audit trail, append-only), PASO 1 (PENDING_REVIEW) y PASO 9
> (conflictos) de este dossier.

---

## 1. Definición

> El **AssessmentReview** es el **registro formal de la revisión humana**
> sobre un AssessmentSummary (o sobre resultados/criterios/áreas concretos):
> qué revisó la persona, qué confirmó, amplió, contextualizó, contradijo o
> descartó, y con qué motivación.

Flujo de responsabilidades (herencia A-02.1 PASO 11, sin cambios):

```
EvaluHR → genera evidencia técnica (results, criteria, areas, summary)
RH      → revisa (AssessmentReview) y entrevista
Empresa → decide (decisión laboral exclusivamente humana)
```

---

## 2. Campos conceptuales

| Campo | Descripción y reglas |
|---|---|
| `reviewId` | Identificador único y no reutilizable (`REV-<summaryId>-<NNN>`). |
| `reviewerId` | Persona revisora identificada (rol dentro de la empresa cliente, p. ej., RH). **Regla dura**: el revisor no puede ser la misma persona que generó la evidencia que revisa cuando la evidencia es declarativa/entrevista/documental (separación de duties, herencia A-02.2 PASO 16). Nunca IA. |
| `reviewDate` | Fecha/hora UTC de la revisión. |
| `decision` | Acción de revisión (§3): `CONFIRM` · `AMPLIFY` · `CONTEXTUALIZE` · `CONTRADICT` · `DISCARD`. |
| `notes` | Notas de la revisión en lenguaje propio del revisor; obligatorias cuando la decisión es CONTRADICT o DISCARD (motivación), recomendadas siempre. |
| `evidenceReviewed` | Lista de `evidenceId` revisados (lo que la persona efectivamente examinó). |
| `areasReviewed` | Lista de `areaId` revisados (qué áreas cerró, amplió o dejó abiertas). |
| `overrideReason` | Motivo cuando la revisión contradice o descarta una lectura/área (obligatorio en CONTRADICT/DISCARD; se registra junto con la base humana que lo sustenta: entrevista, documento, contexto). |

---

## 3. Las cinco acciones de la revisión humana

> La revisión humana debe poder: **confirmar, ampliar, contextualizar,
> contradecir y descartar.**

| Acción | Significado | Efecto |
|---|---|---|
| **CONFIRM** | Acepta las lecturas/áreas tal como el sistema las produjo | Cierra `PENDING_REVIEW` de lo revisado; queda registrada |
| **AMPLIFY** | Indica que se requiere más evidencia (aplicar instrumento, verificar documento, entrevistar) | Genera tarea de completación; los criterios siguen en su estado hasta evidencia nueva (append-only) |
| **CONTEXTUALIZE** | Añade contexto que explica la lectura sin contradecirla (p. ej., situación del mercado, condiciones del puesto anterior) | Se registra como capa de revisión junto a la lectura original |
| **CONTRADICT** | La persona revisora llega a una lectura distinta con base humana (p. ej., la entrevista observó algo que el auto-reporte no mostraba) | Se registra la lectura del revisor **junto a** la del sistema; la original permanece visible; conflictRef se cierra documentadamente |
| **DISCARD** | Descarta una lectura/área para este proceso con motivación (p. ej., área resuelta por evidencia nueva) | El área se cierra; el registro descartado **no se borra ni se invalida por la revisión** (eso es acto de gobernanza, A-02.2 PASO 16) |

Reglas comunes: toda acción queda en el audit trail con quién, cuándo y qué
revisó; toda contradicción/descarte exige `overrideReason`; la revisión es
append-only (una revisión posterior no edita la anterior).

---

## 4. REGLA CENTRAL: la revisión NO altera retroactivamente el resultado original

> **La revisión humana no debe alterar retroactivamente el resultado original
> del instrumento** — ni los resultados de criterio ya producidos.

Consecuencias operativas:

1. Los InstrumentResult, EvidenceRecord y CriterionResult originales
   permanecen **intactos** (append-only; A-02.2 PASO 1/13). La revisión agrega
   una **capa paralela de lectura humana**, identificada como tal.
2. No se reescriben puntajes, calidades, estados ni lecturas históricas; no
   se "corrigen" resultados pasados con conocimiento posterior.
3. Si la revisión descubre un error factual en un registro (p. ej., captura
   errónea), el camino es el de gobernanza: **invalidación documentada** del
   registro (ACTIVE→INVALIDATED, con autor y motivo) y registro nuevo — nunca
   edición retroactiva silenciosa.
4. La lectura del revisor (CONTRADICT/CONTEXTUALIZE) convive con la original:
   la salida muestra ambas con su autoría ("lectura del sistema" vs.
   "lectura de la revisión humana"), preservando la trazabilidad completa
   (PASO 15) y la reconstrucción histórica.
5. Esto garantiza la verificación de auditoría del PASO 18: "resultados
   originales permanecen trazables" y "revisión humana queda registrada".

---

## 5. Requisitos para que la revisión sea real (herencia A-02.1 PASO 11 §4)

1. Toda revisión registra: summary/results/áreas revisados, evidencia
   examinada, decisión, notas y estado (`PENDIENTE`→`REVISADO` con autor y
   fecha).
2. La revisión humana es **obligatoria antes de cualquier uso decisorio** por
   la empresa; el summary declara su estado de revisión en la salida.
3. El registro es append-only y auditable.
4. La empresa omite la revisión → el sistema no puede forzarla (protección
   documental y de diseño: la salida no contiene lenguaje decisorio ni
   "botón de rechazo"); el riesgo de uso indebido permanece registrado
   (A-02.1 dossier §16).
5. La IA no revisa, no sugiere decisiones de revisión y no redacta las notas
   del revisor (AI-X5/X7/X8; PASO 14 de este dossier).
