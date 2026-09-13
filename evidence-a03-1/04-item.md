# EVALUHR — A-03.1 · PASO 4
# KNOWLEDGEITEM — EL REACTIVO Y SU GOBERNANZA

> Documento de diseño metodológico. NO implementa nada. NO crea preguntas
> reales (los ejemplos de PASO 17 son ilustrativos y no productivos).
> Fecha: 2026-09-10 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.2 PASO 5 (K2: correctAnswer persistida y verificable);
> A-02.3 PASO 14 (IA genera, humanos validan); A-02.5 PASO 15 (separación
> de duties); PASO 18 de esta fase (gobernanza completa).

---

## 1. Definición

**KnowledgeItem** es el reactivo individual de una evaluación de
conocimientos: una pregunta objetiva con opciones, **una** respuesta correcta
definida y validada antes de publicarse, trazabilidad completa a su dominio
de blueprint y ciclo de vida propio.

## 2. Campos conceptuales (encargo)

| Campo | Contenido | Reglas |
|---|---|---|
| `itemId` | Identificador único e irrevocable | Jamás reutilizado; sobrevive a cambios de versión |
| `blueprintId` | Blueprint al que pertenece | Obligatorio; sin blueprint no hay item (K-BP-1) |
| `question` | Enunciado del reactivo | Redacción clara; un solo problema por pregunta (KI-VAL-2) |
| `options` | Alternativas de respuesta | Homogéneas en formato; una correcta; distractores plausibles |
| `correctAnswer` | Clave de respuesta | **Obligatoria para scoring** (K2/K-VAL-4); persistida, verificable, versionada. Problema vigente documentado: el generador actual no la persiste (PASO 6, sin corregir) |
| `rationale` | Justificación de la clave y de los distractores | Explica POR QUÉ la clave es correcta según la source; exigible en revisión |
| `difficulty` | EASY / MEDIUM / HARD / UNKNOWN | No se inventa; UNKNOWN si no hay evidencia (PASO 9) |
| `source` | Documento/función que sustenta el contenido | Citable con versión (KF1–KF7) |
| `version` | Versión del reactivo | Cambio de enunciado, opciones o clave = versión nueva (PASO 15) |
| `status` | DRAFT / REVIEW / APPROVED / ACTIVE / SUSPENDED / RETIRED / REJECTED | Ciclo PASO 19; los estados son actos de gobernanza |
| `reviewedBy` | Revisor humano con conocimiento del contenido | Distinto del autor (separación de duties); jamás IA |

Campos complementarios exigidos por esta fase (gobernanza heredada de
A-02.5 PASO 15 adaptada al reactivo): `author` (humano o marcador IA),
`domain`, `subdomain`, `approvedBy`, `statusHistory` (append-only).

## 3. Regla central del encargo

> **La IA puede proponer reactivos. La IA NO puede aprobarlos.**

Formalización:

1. **KI-1**: la IA actúa solo como **borradorista** dentro de un blueprint
   aprobado y solo sobre dominios existentes (AI-5 heredada de A-02.3:
   sugerir reactivos sobre áreas ya identificadas, con marcado y validación
   humana). Todo reactivo con origen IA lleva marcador de autoría
   `origin=AI_DRAFT` y **nace en DRAFT**.
2. **KI-2**: ningún reactivo pasa de DRAFT sin revisión humana registrada
   (`reviewedBy` humano, distinto del autor). La revisión no es opcional ni
   por lotes ("aprobar el paquete completo" sin lectura = violación).
3. **KI-3**: la aprobación (`approvedBy`) es un acto de gobernanza humano
   con versionado (AI-X24/AI-X25, PASO 5).
4. **KI-4**: la IA no puede modificar reactivos en estados posteriores a
   DRAFT (REVIEW en adelante) — puede generar *sugerencias de corrección*
   que un humano evalúa (corrección = PASO 5, flujo del encargo).

## 4. Propiedades de calidad del reactivo (resumen; detalle en PASO 7)

- Relevante para el dominio y la función (KI-VAL-1/8).
- Clara y sin ambigüedad (KI-VAL-2/5).
- Una sola respuesta correcta defendible (KI-VAL-3) — con rationale.
- Coherente con el blueprint (KI-VAL-4).
- Sin información innecesaria (KI-VAL-6).
- Dificultad honesta: UNKNOWN salvo evidencia (PASO 9).
- No subjetiva/opinión (PASO 8) — un "¿qué harías?" no es conocimiento.

## 5. Inmutabilidad y trazabilidad

- **KI-5**: un reactivo ACTIVE es **inmutable**: cualquier cambio (incluso
  una coma) produce nueva `version` y regresa a DRAFT/REVIEW. Las
  administraciones quedan ligadas a la versión exacta administrada.
- **KI-6**: `correctAnswer` jamás se edita en caliente ni retroactivamente
  sobre administraciones ya hechas (protección PASO 14, KSEC-5/KSEC-6).
- **KI-7**: todo cambio queda en historial append-only (autor, fecha, diff
  conceptual, motivo) — coherencia con el audit trail A-02.2 PASO 13.

## 6. Caso específico del hallazgo previo (sin corregir aquí)

El banco genérico legacy detectado en A-02.2 §2.1 (preguntas estilo
auto-reporte "¿Conoce…? Sí/Parcialmente/No", sin clave) **no cumple la
definición de KnowledgeItem**: carece de `correctAnswer`, de `source` de
contenido y de dominio. Bajo este modelo: no son reactivos de conocimientos
válidos; sus registros producen `INSUFFICIENT` (K-INS-1 vigente; PASO 6) y
no deben "rescatarse" como items. La corrección del código del generador
sigue **fuera del alcance de A-03.1**.
