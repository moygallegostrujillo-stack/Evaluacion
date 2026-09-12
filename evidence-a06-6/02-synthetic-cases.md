# A-06.6 — 02 · Casos Sintéticos (PASO 2)

## 1. Regla

Construir casos simulados para MESERO y VENDEDOR. **No utilizar candidatos reales.** Todos los datos: **SINTÉTICOS**. Todas las preguntas/respuestas: **PILOTO + NO PRODUCTIVO**.

## 2. Patrones de respuesta (A–J)

| Patrón | Descripción | Categoría esperada | Estado esperado |
|---|---|---|---|
| A | Respuesta concreta y completa | CONCRETE_BEHAVIOR | VALID → SUPPORTED |
| B | Respuesta vaga | GENERAL_CLAIM | INSUFFICIENT |
| C | Respuesta hipotética | HYPOTHETICAL | LIMITED |
| D | Respuesta sin acción propia (el equipo hizo) | CONCRETE_BEHAVIOR parcial | INSUFFICIENT |
| E | Resultado positivo sin conducta clara | EXTERNAL_RESULT | PENDING_REVIEW |
| F | Respuesta contradictoria con CV | CONTRADICTION | PENDING_REVIEW |
| G | Respuesta incompleta (Action parcial) | CONCRETE_BEHAVIOR parcial | LIMITED |
| H | Respuesta potencialmente discriminatoria (revelación involuntaria) | Revelación involuntaria | INVALID (no registrar atributo) |
| I | Respuesta que no aporta evidencia | NO_INFORMATION | NO_EVIDENCE |
| J | Respuesta muy fuerte y específica (múltiples ejemplos) | CONCRETE_BEHAVIOR múltiple | VALID → STRONG |

## 3. Casos sintéticos MESERO (perfiles)

> **PILOTO + NO PRODUCTIVO**. Todos los datos son SINTÉTICOS.

### Perfil sintético MES-1 (para patrones A, B, C)

> Candidato sintético "MES-1": 24 años de edad real (no se pregunta); experiencia previa como mesero en cafetería 1 año; respuestas se generan según patrón.

### Perfil sintético MES-2 (para patrones D, E, F)

> Candidato sintético "MES-2": experiencia previa como auxiliar de cocina 8 meses; CV sintético dice "supervisé 15 personas" (para patrón F).

### Perfil sintético MES-3 (para patrones G, H, I, J)

> Candidato sintético "MES-3": sin experiencia formal (entry-level) para patrón I; con experiencia para patrones G, H, J.

## 4. Casos sintéticos VENDEDOR (perfiles)

> **PILOTO + NO PRODUCTIVO**. Todos los datos son SINTÉTICOS.

### Perfil sintético VEN-1 (para patrones A, B, C)

> Candidato sintético "VEN-1": experiencia previa en tienda de electrónica 2 años.

### Perfil sintético VEN-2 (para patrones D, E, F)

> Candidato sintético "VEN-2": experiencia previa en tienda de ropa 1 año; CV sintético dice "supervisé 15 empleados".

### Perfil sintético VEN-3 (para patrones G, H, I, J)

> Candidato sintético "VEN-3": mixto; con experiencia para patrones G, H, J; entry-level para patrón I.

## 5. Asignación de casos a preguntas

| caseId | jobExample | Pregunta | Patrón | Propósito |
|---|---|---|---|---|
| M-A | MESERO | Q-MES-SVC-001 | A | Probar el caso ideal (SUPPORTED) |
| M-B | MESERO | Q-MES-SVC-001 | B | Probar respuesta vaga (INSUFFICIENT) |
| M-C | MESERO | Q-MES-SVC-001 | C | Probar hipotético (LIMITED) |
| M-D | MESERO | Q-MES-COL-001 | D | Probar ausencia de acción propia |
| M-E | MESERO | Q-MES-ORG-001 | E | Probar resultado sin conducta |
| M-F | MESERO | Q-MES-ORG-001 | F | Probar conflicto CV vs entrevista |
| M-G | MESERO | Q-MES-SVC-002 | G | Probar respuesta incompleta (LIMITED) |
| M-H | MESERO | Q-MES-TRV-002 | H | Probar revelación involuntaria |
| M-I | MESERO | Q-MES-TRV-002 | I | Probar no-información (NO_EVIDENCE) |
| M-J | MESERO | Q-MES-COL-001 | J | Probar respuesta muy fuerte (STRONG) |
| V-A | VENDEDOR | Q-VEN-SVC-001 | A | Probar caso ideal |
| V-B | VENDEDOR | Q-VEN-SVC-002 | B | Probar respuesta vaga |
| V-C | VENDEDOR | Q-VEN-SVC-002 | C | Probar hipotético |
| V-D | VENDEDOR | Q-VEN-COL-001 | D | Probar ausencia de acción propia |
| V-E | VENDEDOR | Q-VEN-ORG-001 | E | Probar resultado sin conducta |
| V-F | VENDEDOR | Q-VEN-TRV-002 | F | Probar conflicto CV vs entrevista |
| V-G | VENDEDOR | Q-VEN-SVC-001 | G | Probar respuesta incompleta |
| V-H | VENDEDOR | Q-VEN-TRV-002 | H | Probar revelación involuntaria |
| V-I | VENDEDOR | Q-VEN-COL-001 | I | Probar no-información |
| V-J | VENDEDOR | Q-VEN-ORG-001 | J | Probar respuesta muy fuerte |

**Total: 20 casos simulados** (10 por puesto), cubriendo los 10 patrones × 2 puestos.

## 6. Regla de síntesis

Los perfiles sintéticos son **ficciones metodológicas** creados para probar el diseño de la entrevista. No representan candidatos reales. Los nombres (MES-1, VEN-2, etc.) son identificadores de caso, no personas.
