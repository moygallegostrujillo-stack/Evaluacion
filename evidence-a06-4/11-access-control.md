# A-06.4 — 11 · Control de Acceso (PASO 11)

## 1. Roles

| Rol | Descripción |
|---|---|
| CANDIDATO | El evaluado; titular de sus datos personales |
| ENTREVISTADOR | Humano que conduce la entrevista |
| RH | Profesional de RR.HH. de la empresa cliente |
| GERENTE | Mánager del puesto (si participa en decisión) |
| SUPER_ADMIN | Administrador de la plataforma EvaluHR |
| REVISOR | Humano que revisa la evidencia (puede ser distinto al entrevistador) |
| SISTEMA | Procesos automáticos (almacenamiento, purge, notificaciones) |
| IA | Herramientas de IA (transcripción, resumen, sugerencias) |

## 2. Matriz de permisos

| Acción | CANDIDATO | ENTREVISTADOR | RH | GERENTE | SUPER_ADMIN | REVISOR | SISTEMA | IA |
|---|---|---|---|---|---|---|---|---|
| Ver preguntas (guía) | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ (técnico) | ✗ |
| Ver respuestas (STAR) | ✓ (propias) | ✓ (propias) | ✓ | ✓ | ✓ | ✓ | ✓ (almacenamiento) | ✗ |
| Ver evidencia | ✓ (propias) | ✓ (propias) | ✓ | ✓ | ✓ | ✓ | ✓ (técnico) | ✗ |
| Ver CompetencyResult | ✓ (propias) | ✓ (propias) | ✓ | ✓ | ✓ | ✓ | ✓ (técnico) | ✗ |
| Revisar (asignar nivel) | ✗ | ✓ (propias) | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ (sugerir solo) |
| Modificar | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ (append-only: nueva versión) | ✗ | ✗ |
| Invalidar | ✗ | ✗ | ✓ (con justificación) | ✗ | ✓ (admin) | ✓ | ✗ | ✗ |
| Exportar | ✗ | ✗ | ✓ (con log) | ✗ | ✓ (admin, con log) | ✗ | ✗ | ✗ |
| Eliminar | ✗ | ✗ | ✗ | ✗ | ✓ (admin, purge) | ✗ | ✓ (purge automático) | ✗ |
| Aprobar (CompetencyResult APPROVED) | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |

## 3. Reglas de acceso

### 3.1 Principio de mínimo privilegio

Cada rol accede solo a lo necesario para su función:
- CANDIDATO: sus propios datos (ARCO).
- ENTREVISTADOR: sus propias entrevistas (no las de otros).
- RH: resultados de candidatos de su empresa.
- REVISOR: evidencia que debe revisar.
- IA: NO acceso autónomo; solo procesa lo que el humano le da.

### 3.2 Auditoría de acceso

Todo acceso se registra (audit trail):
- quién accedió
- cuándo
- a qué registro
- con qué propósito

### 3.3 Restricción de IA

La IA **NO** tiene acceso autónomo a los datos de entrevista. Solo procesa:
- Lo que el entrevistador/reviewer le da explícitamente (transcripción, resumen).
- No puede consultar el histórico de candidatos.
- No puede inferir atributos protegidos (ver `08-ai-boundaries.md`).

## 4. Acceso del candidato (ARCO)

| Derecho | Cómo se ejerce |
|---|---|
| Acceso | El candidato solicita ver sus datos; EvaluHR responde en plazo legal |
| Rectificación | El candidato corrige errores; se crea nueva versión (append-only) |
| Cancelación | El candidato solicita eliminar; purge inmediato (salvo obligación legal) |
| Oposición | El candidato se opone al tratamiento; se suspende (salvo obligación legal) |

## 5. Acceso entre EvaluHR y empresa cliente

| EvaluHR | Empresa cliente |
|---|---|
| Entrevistador (conduce) | RH (decide) |
| Revisor (revisa) | Gerente (participa en decisión si aplica) |
| Super_admin (gestión técnica) | |
| IA (asiste) | |

Los datos se transfieren entre EvaluHR y la empresa cliente según el contrato de encargamiento (ver `19-client-evalua-responsibilities.md` + `18-contract-impact.md`).

## 6. Conexión con gates

El control de acceso pasa LEGAL-G9 (Seguridad). Sin matriz de permisos + auditoría de acceso + restricción de IA, la entrevista no se activa.
