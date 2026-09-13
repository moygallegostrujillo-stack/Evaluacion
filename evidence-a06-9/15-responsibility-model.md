# EVALUHR — A-06.9 — 15 · MODELO DE RESPONSABILIDADES (PASOS 4 y 22)

> **BORRADOR PARA REVISIÓN LEGAL PROFESIONAL. NO CONSTITUYE VERSIÓN DEFINITIVA.**
> Arquitectura mantenida (sin cambio sin justificación): **EMPRESA CLIENTE = responsable de la
> finalidad y decisión laboral; EVALUA HR = proveedor / encargado tecnológico y operativo, según
> corresponda al tratamiento concreto.** Matriz operativa: `client-evalua-legal-responsibilities.csv`.

# ANEXO 10 — MODELO DE RESPONSABILIDADES

## 1. Arquitectura general

| Rol | Contenido |
|---|---|
| **EMPRESA CLIENTE (ALIMENTOS PAPO)** | Responsable del tratamiento: define finalidad y puesto; aprueba competencias; decide contratación (humana); atiende ARCO; mantiene su aviso de privacidad; justifica cualquier excepción |
| **EVALUA HR** | Proveedor / encargado tecnológico y operativo: plataforma, conducción de entrevista con banco aprobado, registro de evidencia, soporte de revisión, trazabilidad, seguridad técnica, conservación por instrucciones, canal ARCO técnico |

## 2. Compartido

- Revisión de evidencia (revisor de EvaluHR + revisión de la empresa).
- Aprobación de competencias (cliente aprueba; EvaluHR sugiere/método).
- Canal ARCO (empresa atiende; EvaluHR facilita y ejecuta técnicamente).
- Seguridad organizativa (cliente entrena a sus entrevistadores si conduce sesiones; EvaluHR
  provee materiales y método).
- Resolución de conflictos de evidencia (técnica de EvaluHR; aprobación del cliente).

## 3. Situaciones que PODRÍAN requerir revisar la clasificación responsable/encargado

La clasificación se mantiene; sin embargo, **el abogado debe revisar** si ocurre alguna de:

| # | Situación | Por qué podría exigir revisión |
|---|---|---|
| S-1 | EvaluHR determinara por sí mismo finalidades adicionales (p. ej., usar datos para mejorar productos con datos reales de candidatos) | Determinación autónoma de finalidades = indicio de corresponsabilidad |
| S-2 | EvaluHR decidiera criterios o cortes de evaluación por cuenta propia | Desplazaría la decisión del responsable |
| S-3 | El cliente careciera de aviso de privacidad propio o no informara al titular | Brecha del responsable; puede requerir reacomodo contractual |
| S-4 | EvaluHR procesara datos para otros clientes con finalidades propias (benchmarks, estadística no anonimizada) | Finalidad propia = posible responsable |
| S-5 | Participación de terceros que determinen finalidades (proveedores de IA con uso propio de datos) | Cadena de responsables |
| S-6 | Cambio de servicio: el cliente condujera sus propias entrevistas en la plataforma | Cambio de quién opera vs decide |
| S-7 | Requerimiento de autoridad dirigido directamente a EvaluHR | Obligaciones directas del encargado **[LEGAL_REVIEW]** |
| S-8 | Tratamiento para defensa jurídica de EvaluHR por cuenta propia | Interés legítimo propio **[LEGAL_REVIEW]** |

**Regla**: ninguna de estas situaciones se resuelve aquí; se registran como disparadores de
revisión jurídica (`16-legal-open-items.md`, ítem 1).

## 4. Coherencia con matrices previas

Reproduce y actualiza la matriz A-06.4 (`client-evalua-responsibility-matrix.csv`) con las
actualizaciones de A-06.8 (SABG; anexo IA; protocolo de datos sensibles; conservación como
política). Matriz operativa completa: `client-evalua-legal-responsibilities.csv`.

---

**FIN DEL ANEXO — SUJETO A REVISIÓN LEGAL PROFESIONAL.**
