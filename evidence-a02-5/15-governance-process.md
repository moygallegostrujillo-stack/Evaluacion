# EVALUHR — A-02.5 · PASO 15
# GOBERNANZA DE CRITERIOS: proposal → publication

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 3 (proceso de vinculación P1–P6, aprobación humana) y
> PASO 9 (gobernanza por analogía A-01.3); A-02.2 PASO 16 (gobernanza de
> evidencia, invalidación, anti-manipulación); PASO 18 de este dossier
> (publication-rules.md — ciclo de vida).

---

## 1. Proceso (mandato del encargo)

```
PROPOSAL  →  EVIDENCE  →  EXPERT REVIEW  →  APPROVAL  →  VERSION  →  PUBLICATION
```

| Etapa | Qué ocurre | Quién | Salida registrada |
|---|---|---|---|
| **1. Proposal** | Se formula el criterio (nombre, descripción, categoría A–E, criterio propuesto, puesto) | RH/proponente de la empresa | Registro DRAFT con proponente y fecha |
| **2. Evidence** | Se construye el expediente de relevancia: fuentes S1–S8 (PASO 1), trazabilidad al elemento del puesto, regla de verificación si es C, calificador de criticidad si se propone CRITICAL | Proponente + quien realiza el análisis de puesto | Expediente citado por el Criterion Record |
| **3. Expert review** | Revisión metodológica: relevancia (R-REL-1..5), categoría, redacción (SG-3), fuerza de relación propuesta (PASO 11), proporcionalidad (PASO 13/14) | Revisor experto designado (humano; independiente del proponente) | Dictamen: procede / correcciones / rechazo motivado |
| **4. Approval** | Aprobación del criterio con su criticidad y su fuerza de relación inicial | Aprobador humano designado por la empresa (`approvedBy`) | Criterion Record aprobado (estado APPROVED) |
| **5. Version** | Asignación de versión; cambios posteriores → nueva versión (sustantivo = mayor; redacción = menor) | Gobernanza | Historial append-only |
| **6. Publication** | Paso a ACTIVE: el criterio puede recibir evidencia y participar del nivel de ajuste según reglas vigentes (A-02.4) | Gobernanza (reglas de PASO 18) | Publicación con fecha; el criterio entra a las matrices (PASO 17) |

Salidas laterales: **REJECTED** (en review, con motivo registrado — herencia
"rechazos registrados" A-02.1) y **RETIRED** (ciclo de vida, PASO 18).

---

## 2. Campos mínimos de publicación (mandato del encargo)

Ningún criterio pasa a producción metodológica sin:

| Campo | Contenido | Herencia |
|---|---|---|
| `criterionId` | Identificador estable `CRIT-<CAT>-<NNN>` (nunca reutilizado) | A-02.1 PASO 3 |
| `jobId` | Puesto (y versión del registro de puesto) al que pertenece | A-02.1 PASO 1 |
| `rationale` | Por qué el criterio existe: requisito ↔ elemento del puesto (jobRelevance) | PASO 1 |
| `source` | Fuentes S1–S8 con fecha y origen | PASO 1 §2 |
| `approvedBy` | Humano designado (jamás "sistema", jamás IA) | A-02.1 PASO 3 |
| `version` | Versión del criterio | A-02.1 PASO 3 |

Campos adicionales exigidos por A-02.5 para criterios en producción:
`category`, `criticality` (+ calificador si CRITICAL), `jobRelevance`
(estado), `relationshipStrength` vigente (+ evidenceBasis), `status` del
ciclo de vida (PASO 18). Todos quedan reflejados en
`criterion-validation-matrix.csv` (PASO 17).

---

## 3. Reglas de gobernanza

1. **Toda transición es un acto registrado** (quién, cuándo, base) —
   append-only; sin ediciones silenciosas (herencia A-02.2 PASO 16).
2. **Separación de duties**: proponente ≠ revisor experto ≠ aprobador
   (analogía con separación de duties de revisión humana A-02.3).
3. **Cambios que exigen nueva versión del criterio**: criticidad,
   calificador de CRITICAL, fuerza de relación, contenido evaluado, regla de
   verificación (C), redacción sustantiva.
4. **Cambios que exigen revalidación completa** (proceso desde Proposal):
   cambio de puesto versión mayor, cambio de instrumento, cambio de
   categoría.
5. **Anti-manipulación**: prohibido ajustar criticidad, fuerza o relevancia
   después de ver resultados de candidatos, o para "hacer encajar" una
   decisión (herencia explícita A-02.2 PASO 16; auditoría PASO 19).
6. **La IA no participa en ninguna etapa** (cero participación heredada de
   A-02.1; nuevos límites abajo).

---

## 4. Límites de IA específicos de A-02.5 (nuevos, acumulables a AI-X1..X16)

| ID | Prohibición |
|---|---|
| **AI-X17** | Asignar, sugerir o modificar la **fuerza de relación** instrumento→criterio (PASO 11 §5) |
| **AI-X18** | Generar, sugerir o prellenar criterios, `jobRelevance`, calificadores de criticidad o cualquier campo del expediente de validación (la IA no propone criterios — herencia A-02.1 PASO 3 §7 elevada a prohibición explícita) |
| **AI-X19** | Determinar o modificar la **criticidad** de un criterio (refuerzo de AI-X12 para el proceso de gobernanza de esta fase) |

Permitido (con marcado y validación humana, sin conclusiones nuevas):
reformular lenguaje de textos ya aprobados (AI-3b), resumir expedientes ya
publicados citando sus partes (AI-2 análogo). La IA jamás es etapa del
proceso §1.

---

## 5. Revisión periódica (PROPUESTA)

- Todo criterio ACTIVE se revisa al menos **una vez al período acordado por
  gobernanza** (frecuencia PROPUESTA, sin valor normativo en A-02.5) y
  siempre que: cambie el registro del puesto, cambie el instrumento, cambie
  la norma citada (S6), o una auditoría encuentre desviación (PASO 19).
- La no-revisión en plazo degrada el criterio a revisión obligatoria
  (estado REVIEW; PASO 18) — nunca se elimina silenciosamente.
