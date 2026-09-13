# EVALUHR — A-02.2 · PASO 9
# EVIDENCIA HUMANA DE ENTREVISTA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Ecuación de esta fase

> **ENTREVISTA ≠ prueba psicométrica.**
>
> La entrevista produce **evidencia humana independiente**: un registro
> cualitativo, con autor humano identificable, de lo observado y explorado
> respecto de criterios del puesto.

---

## 2. Qué constituye evidencia válida generada por entrevista

Un registro F (evidenceType=F, `source=HUMAN_INTERVIEW`) es válida **solo si**:

| # | Condición |
|---|---|
| H1 | Existe un criterio aprobado al que ancla (o se declara explícitamente como exploración contextual) |
| H2 | Fue realizada por una **persona identificable** (entrevistador con nombre/rol registrados) |
| H3 | Sigue una **estructura por criterio** (guía derivada de criterios aprobados / áreas que requieren revisión de A-02.1) |
| H4 | La nota registrada separa **hecho observado** de **interpretación del entrevistador** (dos campos distintos) |
| H5 | Fecha y contexto registrados (entrevista presencial/telefónica/videollamada) |
| H6 | `reviewRequired=true` (siempre) y revisión por segunda persona antes de uso |

Calidad máxima de la entrevista: **MEDIUM** (evidencia humana, no
estandarizada — PASO 3 §2). Sin estructura (H3) → LOW; sin registro del
entrevistador o de la nota → INSUFFICIENT.

---

## 3. Qué produce y qué NO produce la entrevista

**Produce:**
- Registro de hechos observados ("el candidato describió el procedimiento X
  con detalle").
- Registro de interpretación humana etiquetada como tal ("el entrevistador
  leyó solvencia en la explicación").
- Exploración de **áreas que requieren revisión** (salida de A-02.1 PASO 10).
- Evidencia independiente para el tratamiento de **conflictos** (PASO 10).

**NO produce:**
- Puntajes psicométricos, baremos, percentiles o "score de entrevista".
- Validación o invalidación de un instrumento (la entrevista no "confirma" ni
  "refuta" el IPIP; documenta discrepancias para revisión humana — PASO 10).
- Decisión de contratación o descarte (decisión de la empresa — A-02.1 PASO 11).
- Sustituto de evidencia de otra categoría (no "verifica" conocimiento sin
  prueba; no "mide" rasgos con precisión).

---

## 4. Independencia de la evidencia humana

> La evidencia de entrevista **vale por sí misma** como fuente humana
> registrada — no es un apéndice del sistema ni del IPIP.

Consecuencias:

1. No requiere "corroborar" un test para existir; puede existir sola.
2. Cuando contradice un test, **no se descarta ni se subordina**: se activa
   el protocolo de conflicto (PASO 10).
3. Su calidad depende del registro (estructura, autor, separación
   hecho/interpretación), no de que "concuadre" con otros instrumentos.

---

## 5. Rol del sistema y de la IA

- El sistema **registra y estructura**; no entrevista, no interpreta la nota.
- La IA **no genera evidencia de entrevista** (ni redacta notas en nombre del
  entrevistador). Solo podría asistir tareas administrativas posteriores si
  gobernanza lo autoriza expresamente (PASO 12) — autorización que hoy **no
  existe**.
- El entrevistador es responsable del contenido de su registro (atribución
  individual en el audit trail, PASO 13).

---

## 6. Formato propuesto del registro de entrevista (estructura, no implementación)

```
EvidenceRecord {
  evidenceType: F
  source: HUMAN_INTERVIEW
  instrument: ENTREVISTA-FUTURA-ESTRUCTURA (versionada cuando exista)
  value: {
    hechosObservados: [ ... ]      // separado
    interpretacionEntrevistador: [ ... ]  // etiquetada como tal
    criterioExplorado: criterionId
  }
  unit: QUALITATIVE_NOTE
  quality: MEDIUM (con H1–H6) / LOW / INSUFFICIENT
  reviewRequired: true
}
```

Nota: la "guía de entrevista" derivada de criterios es diseño futuro
(mencionada en A-02.1); A-02.2 solo fija las condiciones de validez de su
resultado.
