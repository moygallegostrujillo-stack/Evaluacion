# EVALUHR — A-03.1 · PASO 6
# CORRECTANSWER — PROBLEMA VIGENTE, SIGNIFICADO DEL 0 Y ESTADO INSUFFICIENT

> Documento de diseño metodológico. **NO corrige código** — el problema
> `correctAnswer` de `generateTemplatesForPosition` permanece documentado,
> abierto y sin tocar. NO implementa scoring. Fecha: 2026-09-10 · Versión: 1.0
> · Estado: PROPUESTA METODOLÓGICA.
> Base: A-01.2 (hallazgo original); A-02.2 PASO 5 §2 (precisión técnica y
> decisión de no corregir); A-02.3 PASO 5 (escenarios A–E, K-INS-1,
> INSUFFICIENT ≠ 0); A-02.5 PASO 6 §3 (K-VAL-4 bloqueada).

---

## 1. El problema actual de EvaluHR (estado documental, verificado en fases previas)

Hallazgo (A-01.2, confirmado A-02.2 con precisión de líneas):

- `generateTemplatesForPosition` (`src/lib/generate-templates.ts`) **no
  persiste `correctAnswer`** en las preguntas de conocimientos de puestos
  generados: el banco en memoria declara claves para algunas categorías, pero
  la llamada de creación omite el campo; el banco genérico de respaldo ni
  siquiera declara claves (y además usa preguntas de auto-reporte).
- Consecuencia: el scoring no encuentra claves → **`knowledgeScore = 0` para
  cualquier candidato**, independientemente de lo que respondiera.

**Decisión reiterada de A-03.1: NO corregir todavía.** La corrección es
cambio de código, requiere autorización expresa, versionado del generador y
plan de datos; aquí solo se diseña el modelo al que esa corrección deberá
sujetarse (PASO 4/7/10/15/19).

## 2. Qué NO significa `knowledgeScore = 0`

> **`knowledgeScore = 0` NO significa "el candidato obtuvo cero
> conocimientos".**

En el caso documentado, el 0 no mide al candidato: es idéntico tanto si la
persona domina todo el contenido como si no sabe nada. Es un **artefacto del
proceso de generación** (clave ausente), no una medición. Atribuirlo a la
persona sería describirla con un dato que no la describe (injusticia +
decisión errónea, razonamiento íntegro de A-02.2 §3).

## 3. Qué significa: NO EXISTE EVIDENCIA VÁLIDA DE SCORING

> **`knowledgeScore = 0` (por clave ausente) significa: "NO EXISTE EVIDENCIA
> VÁLIDA DE SCORING".**

Estado obligatorio (regla **K-INS-1**, heredada y reafirmada):

```
status      = INSUFFICIENT
reasonCode  = QUALITY_FAIL (causa documentada: correctAnswer no persistido)
score       = no calculable (el 0 crudo se conserva solo como dato del
              sistema; NUNCA como lectura del candidato)
reviewRequired = true
salida      = "Información insuficiente para evaluar este criterio." + causa
```

**Regla de oro (vigente en todo el expediente): `INSUFFICIENT ≠ 0`.**
El estado INSUFFICIENT jamás se muestra, calcula, promedia ni interpreta como
un puntaje de cero, un puntaje bajo o un "no sabe".

## 4. Reglas que A-03.1 fija para el futuro scoring (diseño, sin implementar)

| # | Regla | Consecuencia |
|---|---|---|
| K-CA-1 | `correctAnswer` es **precondición de scoring**: un item sin clave persistida, verificable y versionada **no es un item puntuado** | El item se reporta como no-scoreable (PASO 11) |
| K-CA-2 | **missing correctAnswer ≠ respuesta incorrecta**: no se cuenta como error, no se suma al denominador "respondido mal", no se trata como acierto | Se excluye del scoring; ver KSC-2 (PASO 10) |
| K-CA-3 | Si cualquier item del set administrado carece de clave válida, **el resultado completo es INSUFFICIENT** — no se "rescata" el score parcial de los items buenos (herencia escenario D de A-02.3) | Score total = no calculable |
| K-CA-4 | La clave se define y valida **antes** de publicar (KI-VAL-3) y jamás se corrige en caliente durante una calificación | PASO 14 (KSEC) |
| K-CA-5 | La corrección futura del generador deberá: persistir la clave, versionar el generador, marcar los registros históricos sin clave como INSUFFICIENT (no re-puntuarlos retroactivamente con claves nuevas) y pasar K-VAL-1..8 completo | Ruta a VALID de A-02.5 §4 |
| K-CA-6 | Prohibido sustituir la clave por "opinión de experto en caliente" (herencia A-02.5 §5.4) o por mayoría de respuestas de candidatos | La clave es contenido validado, no estadística improvisada |

## 5. Mapeo a los escenarios A–E de A-02.3 (coherencia exacta)

| Escenario A-02.3 | Condición | Salida KnowledgeResult (PASO 11) |
|---|---|---|
| A — clave válida + K1–K6 | Administración completa, sin anomalías, instrumento VALID | Score calculable; status según K1–K6 (VALID) |
| B — sin correctAnswer | Caso vigente del generador | INSUFFICIENT · QUALITY_FAIL (K-INS-1) · **jamás 0** |
| C — parcialmente respondido | Respuesta incompleta | INSUFFICIENT · PARTIAL_RESPONSE · sin prorrateo |
| D — items no validados | Set con items sin validación/clave | INSUFFICIENT · QUALITY_FAIL · sin score parcial |
| E — no reconstruible | Falla técnica / sesión corrupta | INSUFFICIENT · TECH_FAILURE · incidente en audit trail |

## 6. Nota de alcance

A-03.1 **no ejecuta** la corrección de `correctAnswer` ni re-puntúa datos
históricos. El problema queda: documentado (aquí y en fases previas),
bloqueante para K-VAL-4/K-VAL-5, y con ruta de corrección definida como
trabajo futuro sujeto a autorización (K-CA-5).
