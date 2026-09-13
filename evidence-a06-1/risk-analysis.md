# A-06.1 — Risk Analysis (PASO 16)

## 1. Riesgos identificados

| # | Riesgo | Severidad | Detalle | Mitigación |
|---|---|---|---|---|
| R1 | Entrevistador sesgado | ALTO | El entrevistador proyecta sus propias preferencias; halo effect | Guía estructurada + entrenamiento + calibración + múltiples evaluadores |
| R2 | Inconsistencia inter-entrevistador | ALTO | Dos evaluadores asignan niveles distintos al mismo candidato | Rúbrica de indicadores + entrenamiento + doble codificación piloto |
| R3 | Halo effect | MEDIO | Una impresión positiva global infla todas las competencias | Rúbrica por indicador separado; evaluación ciega parcial |
| R4 | Preguntas discriminatorias | ALTO | Preguntas que elicitan información protegida (edad, género, embarazo, etc.) | Guía pre-aprobada; prohibición de preguntas fuera de guía; revisión legal (COMP-G8) |
| R5 | IA como autoridad | MEDIO | RR.HH. acepta ciegamente sugerencias de IA sin revisión | Marca `AI_DRAFT_ORIGIN` permanente; `approvedBy` siempre humano; advertencia visible |
| R6 | Scoring arbitrario | MEDIO | Tentación de convertir niveles cualitativos en números 0-100 | Regla explícita: NO scoring en V1; CompetencyResult sin campo score |
| R7 | Perfil ideal | MEDIO | Tentación de definir "perfil ideal de competencias" por puesto | Regla explícita: NO perfil ideal; competencias evaluadas individualmente |
| R8 | Competencia convertida en veto | ALTO | Una competencia INSUFFICIENT/NO_EVIDENCE descalifica automáticamente | Regla: CompetencyResult no alimenta decisión automática; revisión humana |
| R9 | Faking en entrevista | MEDIO | Candidato inventa ejemplos (menos probable que en auto-reporte, pero posible) | Verificación cruzada con referencias; probes de profundización |
| R10 | Conflicto no resuelto | BAJO | PENDING_REVIEW queda sin resolver; el candidato queda en limbo | SLA de resolución; escalación; decisión humana documentada |

## 2. Severidad agregada

- **ALTO**: 4 (R1, R2, R4, R8)
- **MEDIO**: 5 (R3, R5, R6, R7, R9)
- **BAJO**: 1 (R10)

## 3. Riesgo crítico (R8) — competencia convertida en veto

El riesgo más alto es que una competencia con evidencia INSUFFICIENT o NO_EVIDENCE se convierta en un veto automático de contratación. Esto violaría:
- La regla A-06.1: CompetencyResult no decide contratación.
- LFPDPPP Art. 37 Bis: el resultado no debe ser la única base para la decisión.
- El principio de revisión humana.

**Mitigación**: CompetencyResult es EVIDENCIA para RR.HH., NO decisión. La decisión final es humana y considera múltiples fuentes (competencias + knowledge + integrity + entrevista contextual + referencias).

## 4. Riesgo de sesgo del entrevistador (R1, R2, R3)

Los riesgos R1/R2/R3 son inherentes a la entrevista humana. Mitigaciones:
- **Guía estructurada**: mismas preguntas a todos los candidatos (reduce variabilidad).
- **Rúbrica por indicador**: el nivel se asigna según indicadores observados, no impresión global.
- **Entrenamiento de entrevistadores**: antes de evaluaciones productivas (COMP-G9 pilot).
- **Calibración periódica**: sesiones entre evaluadores para alinear criterios.
- **Doble codificación piloto**: dos evaluadores en paralelo en muestra piloto para medir consistencia.

## 5. Riesgo de preguntas discriminatorias (R4)

En México (LFPDPPP y leyes laborales), preguntas sobre edad, género, embarazo, estado civil, religión, origen, discapacidad no relevante para el puesto son discriminatorias. Mitigación:
- Guía pre-aprobada (solo preguntas conductuales sobre competencias).
- Prohibición explícita de "preguntas fuera de guía".
- Revisión legal de la guía (COMP-G8).
- Registro de la sesión (transcripción o notas) para auditoría.

## 6. Riesgo de IA como autoridad (R5)

La IA puede generar contenido plausible pero sin base científica. Si RR.HH. acepta ciegamente:
- Indicadores generados por IA pueden no ser observables o relevantes.
- Preguntas sugeridas pueden contener sesgos.
- Niveles asignados por IA (prohibido) introducirían scoring arbitrario.

**Mitigación**: `AI_DRAFT_ORIGIN` permanente; `approvedBy` siempre humano; advertencia visible; training de RR.HH. sobre limitaciones de IA.

## 7. Conclusión PASO 16

**4 riesgos ALTO** (sesgo entrevistador, inconsistencia, preguntas discriminatorias, veto automático). Los riesgos ALTO se mitigan con: guía estructurada + rúbrica + entrenamiento + calibración + revisión legal + regla de no-veto-automático. La mitigación es estructural (gobernanza) más que técnica (no hay algoritmo que elimine el sesgo humano).
