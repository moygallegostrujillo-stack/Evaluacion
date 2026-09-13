# EVALUHR — A-06.11 · 17 · ARCO — MAPEO DE FLUJO (PASO 18)

## 0. Alcance

Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) del candidato sobre los datos del proceso de entrevista. Referencia técnica: arts. 28–35 LFPDPPP — plazos y requisitos finales **por dictamen**.

## 1. Mapeo del flujo

```
SOLICITUD (titular)
    │  — canal publicado en el aviso de privacidad del RESPONSABLE (empresa cliente)
    ▼
IDENTIFICACIÓN (titular)
    │  — acreditar identidad; se verifica sin crear más tratamiento del necesario
    ▼
EMPRESA RESPONSABLE (recibe y dirige el ejercicio)
    │  — recibe la solicitud, califica procedencia, decide respuesta
    ▼
EVALUA HR (encargado — asistencia tecnológica)
    │  — localiza datos por sessionId/candidato
    │  — suspende tratamientos que apliquen durante la verificación (art. 32 ref. técnica)
    │  — ejecuta por INSTRUCCIÓN del responsable (no actúa por cuenta propia)
    ▼
EJECUCIÓN (según derecho)
    │  — ACCESO: entregar al responsable la información cualitativa correspondiente
    │      (evidenceLevel + rationale; el titular no recibe el banco de preguntas — ver §3)
    │  — RECTIFICACIÓN: corrección de datos identificativos; sobre evaluación,
    │      se registra nueva revisión versionada (append-only), no se edita la original
    │  — CANCELACIÓN: eliminación segura de categorías (10) conforme al dictamen
    │  — OPOSICIÓN: evaluación de procedencia por el responsable; si procede,
    │      cese de tratamientos no esenciales
    ▼
EVIDENCIA (cierre)
    — audit trail del ejercicio: solicitud, instrucción, ejecución, fecha, medio
    — comprobación de respuesta al titular por parte del responsable
```

## 2. Obligaciones por parte (síntesis de 14 §4)

| Obligación | Empresa cliente | EvaluHR |
|---|---|---|
| Recibir y responder la solicitud | ● | — |
| Calificar procedencia y decidir | ● | — |
| Localizar / suspender / ejecutar técnicamente | — | ● (por instrucción) |
| Documentar el ejercicio | ● | ● (parte técnica) |
| Comunicar la respuesta al titular | ● | — |

## 3. Reglas específicas del proceso de entrevista

1. **Cancelación incluye**: respuestas STAR, evidencia, revisión, datos identificativos — según categoría y plazo vigente (10).
2. **Flag UNINVITED_DISCLOSURE**: se informa la existencia del evento sin contenido (07 §4).
3. **Audit trail**: eventos técnicos pueden anonimizarse a plazo menor — por dictamen (10 §4).
4. **Append-only vs rectificación**: no hay conflicto — la evidencia original no se edita; la corrección es una nueva revisión que indica el motivo.
5. **Datos de terceros**: si un relato menciona terceros (sin identificadores por diseño), no existe registro de terceros que atender.
6. **Candidatos con proceso activo**: la solicitud no paraliza el proceso de selección si el tratamiento está habilitado; el responsable decide — por dictamen.

## 4. Preguntas de dictamen asociadas

Cuestión 13 ("¿Qué obligaciones tiene cada parte frente a ARCO?") de 19; filas ARC-01..ARC-02 de legal-opinion-request.csv.
