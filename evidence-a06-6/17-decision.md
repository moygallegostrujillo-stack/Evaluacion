# A-06.6 — 17 · Decisión (PASO 23)

## 1. Regla

Para cada pregunta decidir: KEEP_FOR_REVIEW / REVISE / REJECT. **NO convertir ninguna en ACTIVE.**

## 2. Decisiones por pregunta

| questionId | Clasificación de calidad (PASO 4) | Hallazgos | Decisión | Justificación |
|---|---|---|---|---|
| Q-MES-SVC-001 | STRONG | Produjo espectro completo (M-A SUPPORTED, M-B INSUFFICIENT, M-C LIMITED) | **KEEP_FOR_REVIEW** | Diseño validado en simulación; pendiente pilotaje de campo + legal |
| Q-MES-SVC-002 | STRONG | M-G LIMITED, V-B INSUFFICIENT, V-C LIMITED — diferenciables | **KEEP_FOR_REVIEW** | Validado; pendiente calibración de rúbrica (divergencia M-G) |
| Q-MES-COL-001 | STRONG | M-D INSUFFICIENT, M-J STRONG — diferenciables | **KEEP_FOR_REVIEW** | Validado |
| Q-MES-ORG-001 | STRONG | M-E PENDING_REVIEW, M-F CONFLICT — diferenciables | **KEEP_FOR_REVIEW** | Validado |
| Q-MES-TRV-002 | STRONG | M-H revelación manejada, M-I NO_EVIDENCE | **KEEP_FOR_REVIEW** | Validado |
| Q-VEN-SVC-001 | STRONG | V-A SUPPORTED, V-G LIMITED | **KEEP_FOR_REVIEW** | Validado |
| Q-VEN-SVC-002 | STRONG | V-B INSUFFICIENT, V-C LIMITED | **KEEP_FOR_REVIEW** | Validado |
| Q-VEN-COL-001 | ACCEPTABLE | V-D INSUFFICIENT; probe necesita mejora para diferenciar Action propia | **REVISE** | La pregunta funciona, pero el probe PROBE-COL-001 (en V-D) no extrajo Action propia con claridad; se propone PROBE-COL-001-D; revisar antes de ACTIVE |
| Q-VEN-ORG-001 | STRONG | V-E PENDING_REVIEW, V-J STRONG | **KEEP_FOR_REVIEW** | Validado |
| Q-VEN-TRV-002 | ACCEPTABLE | V-F CONFLICT, V-H revelación manejada | **REVISE** | La pregunta funciona, pero V-H requiere reforzar el entrenamiento del entrevistador sobre revelación involuntaria; revisar material de entrenamiento antes de ACTIVE |

## 3. Resumen de decisiones

| Decisión | Cantidad | Preguntas |
|---|---|---|
| KEEP_FOR_REVIEW | 8 | Q-MES-SVC-001, Q-MES-SVC-002, Q-MES-COL-001, Q-MES-ORG-001, Q-MES-TRV-002, Q-VEN-SVC-001, Q-VEN-SVC-002, Q-VEN-ORG-001 |
| REVISE | 2 | Q-VEN-COL-001 (probe), Q-VEN-TRV-002 (entrenamiento) |
| REJECT | 0 | — |

## 4. Decisiones sobre probes

| Probe | Decisión |
|---|---|
| PROBE-UNI-001..003, 005..008 (7 universales) | KEEP_FOR_REVIEW |
| PROBE-UNI-004 "¿Qué aprendiste?" | KEEP_FOR_REVIEW (documentar como complementario/cierre) |
| Probes específicos SVC/COL/ORG/TRV (17) | KEEP_FOR_REVIEW |
| PROBE-COL-001-D "¿Qué hiciste tú, más allá de lo que hizo tu supervisor?" | **PROPUESTO NUEVO** (DRAFT) — para diferenciar Action propia en colaboración |

## 5. Probes REJECT

**Ninguno.**

## 6. Regla: ninguna pregunta ACTIVE

> **NO convertir ninguna en ACTIVE.**

Todas las preguntas quedan en DRAFT/EXAMPLE tras el piloto. La activación requiere:
1. Competencias + indicadores ACTIVE (A-06.2 COMP-G3+G4).
2. Revisión legal (INTERVIEW-G7 / LEGAL-G7+G8+G10).
3. Pilotaje de campo real (INTERVIEW-G9).
4. Aprobación humana (Author/Reviewer/Approver).

## 7. Conexión con gates

Las decisiones alimentan INTERVIEW-G4 (question quality) + INTERVIEW-G5 (probe quality). Las preguntas REVISE deben resolverse antes de ACTIVE.
