# EVALUHR — A-06.8 — 12 · Cliente vs EvaluHR (PASO 12)

> Revisión de la matriz A-06.4 (`19-client-evalua-responsibilities.md` +
> `client-evalua-responsibility-matrix.csv`). **No se cambia todavía el contrato** (solo matriz de
> cambios en 13). Actualización 2025: autoridad garante = **SABG** (INAI extinto).

## 1. EMPRESA CLIENTE (Responsable del tratamiento)

| Rol | Detalle |
|---|---|
| **Finalidad** | Define para qué puesto contrata y con qué propósito usa la evaluación (A-06.4: Art 6 — responsable define finalidad) |
| **Definición del puesto** | Tareas, requisitos y análisis de puesto (JOB_ANALYSIS es suyo; EvaluHR apoya el método) |
| **Aprobación de competencias** | Aprueba el set de competencias del puesto (JobCompetency); EvaluHR sugiere/método |
| **Decisión laboral** | Contratar o no contratar = decisión exclusiva humana de la empresa (EvaluHR NO decide, NO recomienda contratación) |
| **Revisión** | Participa en revisión de evidencia junto al reviewer de EvaluHR; decide sobre conflictos de su proceso |
| **Aviso de privacidad + consentimiento** | Es responsable de informar al titular; EvaluHR provee texto/mecanismo |
| **BFOQ** | Justifica y solicita (06); firma la aprobación dual |
| **Expediente del contratado** | Propietario del expediente del empleado (LFT) |

## 2. EVALUA HR (Encargado del tratamiento)

| Rol | Detalle |
|---|---|
| **Plataforma** | Provee y opera la herramienta de entrevista estructurada BDI/STAR |
| **Soporte** | Capacitación (M1..M7 — A-06.7), soporte operativo, materiales de calibración |
| **Seguridad** | Medidas técnicas (cifrado, control de acceso, logs) y organizativas del procesamiento |
| **Procesamiento** | Ejecuta el tratamiento por instrucción del responsable (guía de entrevista, revisión, resultados de competencias) |
| **Trazabilidad** | Registra la cadena completa pregunta→evidencia→nivel→resultado; logs de acceso/export/purge |
| **Conservación según instrucciones** | Implementa la política de retención definida con el responsable (10); purge según instrucción y ley |
| **Canal ARCO** | Facilita el canal técnico para ejercer ARCO; la empresa responde como responsable (A-06.4 CSV: shared) |
| **Sub-encargados (cloud / IA)** | Contrata y gestiona cloud y (futuros) proveedores de IA con garantías; notifica al cliente |
| **Notificación de brechas** | Detecta y notifica al cliente sin demora; el cliente notifica a la autoridad — **destino institucional actual: SABG** (actualización 2025; mecánica exacta LEGAL_REVIEW) |

## 3. Compartido (según A-06.4 — confirmado)

| Actividad | Cliente | EvaluHR | Nota |
|---|---|---|---|
| Aprobar competencias | ✓ aprueba | ✓ sugiere/método | — |
| Revisar evidencia | ✓ | ✓ | Segregación entrevistador≠revisor |
| Canal ARCO | ✓ responde | ✓ facilita | — |
| Seguridad organizativa (entrenamiento) | ✓ forma a sus entrevistadores | ✓ provee materiales | M1..M7 |
| Auditoría | ✓ audita a EvaluHR | ✓ facilita evidencia de cumplimiento | — |
| Política de retención | ✓ define con EvaluHR | ✓ implementa | 10 — LEGAL_REVIEW |
| Resolución de conflictos | ✓ aprueba | ✓ decide/recomienda técnicamente | C-1..C-7 |

## 4. Cambios detectados vs matriz A-06.4 (para matriz de contrato — 13)

| # | Cambio | Razón | Impacto |
|---|---|---|---|
| 1 | Referencia de autoridad garante: INAI → **SABG** | Reforma 2025 (02 §1) | Cláusulas de notificación/quejas |
| 2 | Renumeración de artículos de la ley de datos | Nueva LFPDPPP 2025 | Todas las cláusulas que citan artículos → LEGAL_REVIEW |
| 3 | Añadir regímenes de IA (lista cerrada 07) como anexo técnico | Transparencia + confidencialidad ampliada | Nueva sección/anexo |
| 4 | Añadir protocolo de revelación involuntaria (05) como procedimiento pactado | Minimización de sensibles | Anexo operativo |
| 5 | Conservación: expresar como política, no obligación legal | 10 | Redacción de cláusula de retención |

## 5. Conexión con gates

El reparto responsable/encargado sustenta LEGAL-G1/G10 y el diseño contractual (13). La firma de
cualquier cambio es posterior y requiere abogado — A-06.8 solo prepara la matriz.
