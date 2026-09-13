# A-04.4 — 12 · OPCIONES DE CORRECCIÓN Y REGLA TEMPORAL (PASO 16 + PASO 17)

**PROPUESTAS SIN IMPLEMENTAR** — la REGLA ABSOLUTA de esta fase prohíbe modificar código, fórmulas, IPIP, Knowledge, Integrity, JobFit, recomendaciones, frontend, contrato o aviso.

---

## 1. Opciones de corrección (PASO 16) — comparación

### OPTION A — Mantener el estado actual provisionalmente

| Dimensión | Evaluación |
|---|---|
| Qué es | Congelar el comportamiento actual (4 fórmulas, integridad ponderada) solo como puente corto, con documentación pública de pesos/renormalización y etiqueta visible «no usar como JobFit» |
| Ventaja | Cero esfuerzo; cero regresiones; no rompe demos/pruebas existentes |
| Riesgo | La contradicción CRITICAL (#1) y las HIGH (#2/#3) siguen vivas; normaliza la deuda |
| Impacto | Ninguno inmediato; costo reputacional/legal acumulativo |
| Veredicto | **Aceptable SOLO como puente de días/semanas**, nunca como destino. Condición mínima: publicar el expediente de pesos (cierra parcialmente R6) |

### OPTION B — Aislar Integrity del overallScore

| Dimensión | Evaluación |
|---|---|
| Qué es | Suspender el peso de Integridad en F1/F2/F3 (el instrumento sigue existiendo como indicador orientativo aparte, sin peso global), alineando el código con A-04.1 C4 y A-04.2 GATE-10 |
| Ventaja | Elimina directamente la única contradicción CRITICAL; exige reabrir el registro de weights por rama; es el primer incremento natural de C |
| Riesgo | Cambia scores históricos futuros (los ya persistidos no se recalculan salvo decisión explícita); requiere regresión completa (consent-gate, purga, determinismo — pruebas A-03.4/A-03.5/A-04.2 PASO 12) |
| Impacto | Medio: recalculo/coherencia de overall existentes + comunicación a stakeholders |
| Veredicto | **PRIMER PASO recomendado** cuando se autorice implementación |

### OPTION C — Unificar calculateOverallScore

| Dimensión | Evaluación |
|---|---|
| Qué es | Extraer UNA sola función de overall (módulo compartido, versionado, con weights documentados y whitelist de instrumentos por evidenceStatus) y hacer que F1/F2/F3/F4 la invoquen; el video pierde su fórmula propia y su capacidad de sobrescribir con criterios distintos |
| Ventaja | Ataca la raíz de las contradicciones HIGH (#2) y MEDIUM (#4/#6); una sola procedencia; testeable; habilita la regla temporal del PASO 17 a nivel código |
| Riesgo | Es el mayor cambio de scoring del sistema; requiere congelar una versión (p. ej. OS-v2), expediente de pesos, migración/flag por fila y batería de regresión; el gate del video (`=== 0`) debe rediseñarse para no re-introducir divergencia |
| Impacto | Alto (rediseño de scoring) — fase propia con pruebas |
| Veredicto | **ESTADO OBJETIVO**; B es su primer incremento; secuencia recomendada B→C |

### OPTION D — Retirar overallScore progresivamente y usar JobFit futuro

| Dimensión | Evaluación |
|---|---|
| Qué es | Desprender el producto del agregado opaco: reportes por instrumento (con evidencia) para RH, y un JobFit real (criterios por puesto + pesos justificados + validez) cuando exista; overall deprecado a plazos |
| Ventaja | Elimina de raíz R3/R4 (global usado como ajuste/decisión) y la necesidad de renormalización oculta |
| Riesgo | Producto/UX: RH pierde la métrica única; exige diseño de JobFit (no existe hoy — NOT IMPLEMENTED); transición larga |
| Impacto | Alto en producto; requiere decisiones de negocio |
| Veredicto | **Diferida** — activable cuando el diseño de JobFit (post-GATE A-04.2) esté aprobado; mientras tanto B+C mitigan |

### Recomendación integrada (propuesta, NO implementada)

**Ruta A(documentado, puente corto) → B(aislar Integridad) → C(unificar) → D(evaluar al existir JobFit real).** Toda transición exige: versión de fórmula estampada en las filas (patrón scoringVersionSnapshot), pruebas de regresión de consent-gate/purga/determinismo/no-veto (A-03.4/A-03.5/A-04.2), y expediente metodológico de pesos publicado (cierra R6).

## 2. Regla temporal propuesta (PASO 17) — NO implementar todavía

**Regla «No-evidencia, no-decisión-global» (v2 de la propuesta A-04.3 §17, ampliada con NOT_APPROVED):**

> Un instrumento cuyo estado sea `INSUFFICIENT`, `INVALID`, `PENDING_REVIEW` **o `NOT_APPROVED`** NO debe alimentar una decisión global (overallScore, JobFit, ranking, veto ni recommendation).

Especificación mínima:

1. Toda contribución al global exige un InstrumentResult con `evidenceStatus = VALID` (patrón KnowledgeResult) **y** aprobación metodológica vigente (APPROVED en el registro de instrumentos).
2. `INSUFFICIENT` → contribución NULL y EXCLUIDA (nunca 0); la renormalización resultante debe ser explícita, versionada y visible en el reporte.
3. `INVALID` → excluida Y señalizada (auditoría; nunca silencio).
4. `PENDING_REVIEW` → excluida hasta revisión humana registrada (la IA no aprueba — gobernanza A-04.2 §13).
5. `NOT_APPROVED` → excluida hasta que el instrumento complete su proceso de aprobación (para Integridad: GATE-1..10 de A-04.2).
6. Los pesos del global deben existir en un expediente metodológico versionado (no solo comentarios de código).
7. La regla aplica a las CUATRO fórmulas (incluida la de video) — un canal no puede redefinir qué «alimenta una decisión global».

Estado: PROPUESTA. Sin implementación (regla de fase).
