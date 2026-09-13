# EVALUHR — A-02.3 · PASO 10
# CONSOLIDACIÓN — AssessmentSummary (SIN SCORE GLOBAL)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: PASOS 1–9 de este dossier; A-02.1 PASO 10/11 (áreas, revisión humana,
> lenguaje); A-02.2 PASO 13 (audit trail).

---

## 1. Definición

> El **AssessmentSummary** es la **consolidación descriptiva y trazable** de
> los CriterionResult de los criterios aprobados de un puesto para una
> persona evaluada: qué se evaluó, con qué evidencia, qué falta, qué
> contradice, qué requiere revisión y con qué limitaciones.
>
> **NO calcula un score global. NO produce un veredicto. NO rankea personas.**

El AssessmentSummary es la salida C del modelo (PASO 17) y el objeto que la
revisión humana (PASO 13) recibe y revisa.

---

## 2. Contenido obligatorio (campos conceptuales)

| Campo | Contenido |
|---|---|
| `summaryId` | Identificador único; append-only (una nueva consolidación = un nuevo summary; nunca se edita). |
| `applicationRef` | Proceso/persona evaluada (sin datos sensibles en el modelo). |
| `positionRef` + `positionRecordVersion` | Puesto y versión de su registro (A-02.1 PASO 1). |
| `criteriaEvaluated` | Lista de criterios aprobados incluidos: `criterionId`, `criterionVersion`, `criterionCategory`, estado (PASO 1), `result` (PASO 3), lecturas descriptivas citando `evidenceId`s. |
| `evidenceAvailable` | Evidencias en estado VALID/LIMITED utilizadas, con instrumento + versión + fecha + calidad. |
| `evidenceInsufficient` | Criterios/campos en INSUFFICIENT con `reasonCode` y causa comprensible (R1–R9) — **visibles, nunca convertidos en 0**. |
| `conflicts` | Conflictos abiertos (PASO 9) con ambas fuentes visibles. |
| `reviewAreas` | Áreas que requieren revisión (PASO 11) con `areaId`, criterio, razón y severidad de proceso. |
| `limitations` | Limitaciones del conjunto: limitaciones por instrumento (heredadas de sus expedientes), criterios sin método, pendientes de verificación, y la advertencia general "Resultado orientativo, sujeto a revisión humana" (P6). |
| `humanReviewRequired` | `true` siempre que exista cualquier área, conflicto, insuficiencia o evidencia LOW — en la práctica: siempre. Incluye estado de revisión (`PENDIENTE`/`REVISADO` con autor y fecha, herencia A-02.1 PASO 11 §4). |
| `technicalRecommendation` | Opcional: "Recomendación técnica: Considerar para entrevista" **solo** si se cumplen todas las condiciones del PASO 12. |
| `rulesVersion` | Versión de las reglas de consolidación aplicadas (trazabilidad de interpretación). |
| `generatedAt` / `generatedBy` | Fecha UTC y generador = **reglas deterministas versionadas** (nunca IA). |

---

## 3. Reglas de consolidación

1. **Criterios aprobados primero**: el summary solo consolida criterios
   aprobados (A-02.1). Sin criterios aprobados no hay summary interpretativo
   (solo resultados de instrumento, salida A).
2. **Sin score global**: ningún campo numérico agregado entre criterios,
   constructos o instrumentos. Prohibidos: overall, porcentaje de ajuste,
   promedio, "match %", ranking (herencia X15 y A-02.1 PASO 8/9).
3. **INSUFFICIENT ≠ 0**: las insuficiencias se listan como tales, con causa;
   jamás participan como valores en ningún cálculo (regla heredada también
   para el futuro "Nivel de ajuste").
4. **Transparencia total**: el summary muestra la completitud real — cuántos
   criterios con lectura, cuántos con solo contexto, cuántos insuficientes,
   cuántos en conflicto o pendientes. Prohibido presentar como "completo"
   un proceso con insuficiencias no declaradas.
5. **Lenguaje controlado**: P1–P8 permitidos; X1–X15 prohibidos
   (A-02.1 PASO 14) — incluidos sus sinónimos (filtro semántico).
6. **Revisión humana previa al uso decisorio**: el summary declara su
   carácter orientativo y el estado de revisión; la empresa decide después
   de revisar (A-02.1 PASO 11).
7. **Determinismo**: la consolidación aplica reglas versionadas; cada summary
   es reconstruible (PASO 15) a partir de sus criterios y evidencias.

---

## 4. Qué NO es el AssessmentSummary

- No es un "score del candidato" ni un "nivel de ajuste" (esa fase, si llega,
  requiere autorización y sus 7 condiciones previas de A-02.1 PASO 9).
- No es una decisión de contratación ni un pre-rechazo.
- No es editable: es append-only; la revisión humana (PASO 13) agrega una
  capa de revisión, no modifica el summary consolidado.
- No es sustituto de la entrevista ni del juicio humano.

---

## 5. Ejemplo de esqueleto (ilustrativo, sin datos reales)

```
AssessmentSummary #ASM-<app>-<NNN>
  Puesto: <puesto> (registro v<N>)
  Criterios evaluados: 6 aprobados
    - CRIT-CON-... (CONOCIMIENTOS): INSUFFICIENT — la prueba no cuenta con
      clave de respuestas válida (no es un 0 del candidato)
    - CRIT-CMP-... (HAB/COMP): INSUFFICIENT — no existe método aprobado
    - CRIT-EXP-... (EXP/FORM): contexto — experiencia declarada (no verificada)
    - CRIT-PER-... (PERSONALIDAD): lectura descriptiva de tendencias de
      respuesta (IPIP-50-MX v1.0; no constituye percentil)
    - ...
  Evidencia disponible: [evidenceId + instrumento + versión + calidad]
  Evidencia insuficiente: [criterios + reasonCode + causa]
  Conflictos: [ninguno / conflictRef + ambas fuentes]
  Áreas que requieren revisión: [áreas con razón y severidad de proceso]
  Limitaciones: [por instrumento + generales]
  Revisión humana requerida: SÍ (estado: PENDIENTE)
  Recomendación técnica: "Considerar para entrevista" (solo si PASO 12 cumple)
  — Orientación técnica, no decisión de contratación.
```
