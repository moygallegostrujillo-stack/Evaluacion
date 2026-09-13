# A-06.2 — 03 · Taxonomía (PASO 3)

## 1. Regla

Definir una taxonomía inicial de competencias. Separar claramente 6 categorías. **No asumir que una competencia es universalmente necesaria** — la relevancia es por puesto (JobCompetency).

## 2. Categorías

| Categoría | Descripción | Ejemplo conceptual |
|---|---|---|
| A. Transversales | Aplicables a casi cualquier puesto; base de empleabilidad | Comunicación, Adaptabilidad |
| B. Técnicas | Específicas de un dominio técnico (pueden solaparse con Knowledge) | Manejo de POS, Cortes culinarios |
| C. Servicio | Orientadas a cliente/usuario | Servicio al cliente, Manejo de quejas |
| D. Liderazgo | Dirección de personas/equipos | Dirección de equipo, Delegación |
| E. Colaboración | Trabajo interpersonal horizontal | Trabajo en equipo, Cooperación |
| F. Organización | Gestión de tareas/tiempo/recursos | Organización del trabajo, Priorización |

## 3. Catálogo candidato (categorías + competencias candidatas)

> **NOTA**: Todas las competencias listadas son **CANDIDATAS** (status: DRAFT / CANDIDATE). Ninguna está aprobada para producción. Requieren revisión humana + COMP-G3 (indicators) + COMP-G4 (job relevance).

### A. Transversales

| ID | Nombre | Definición (borrador) |
|---|---|---|
| COMP-TRV-001 | Comunicación efectiva | Transmite información de forma clara y comprensible al interlocutor, adaptando el registro al contexto |
| COMP-TRV-002 | Adaptabilidad | Ajusta su conducta y planes ante cambios en el entorno o las prioridades, sin perder efectividad |

### B. Técnicas

> **Advertencia de solapamiento**: las competencias técnicas pueden solaparse con Knowledge. La distinción: Knowledge = recurso cognitivo medible con test; competencia técnica = conducta observable aplicando el conocimiento. Ver `15-overlap-audit.md`.

| ID | Nombre | Definición (borrador) |
|---|---|---|
| COMP-TEC-001 | Manejo de punto de venta | Opera el sistema POS registrando transacciones con precisión y resolviendo incidencias básicas |
| COMP-TEC-002 | Higiene y seguridad alimentaria | Aplica protocolos de higiene en la manipulación de alimentos de forma consistente |

### C. Servicio

| ID | Nombre | Definición (borrador) |
|---|---|---|
| COMP-SVC-001 | Servicio al cliente | Atiende las necesidades del cliente de forma proactiva, profesional y orientada a la satisfacción |
| COMP-SVC-002 | Manejo de quejas | Gestiona reclamos y situaciones difíciles manteniendo la calma y buscando soluciones |

### D. Liderazgo

| ID | Nombre | Definición (borrador) |
|---|---|---|
| COMP-LDR-001 | Dirección de equipo | Coordina y guía el trabajo de otros hacia un objetivo común, asignando responsabilidades y dando seguimiento |

### E. Colaboración

| ID | Nombre | Definición (borrador) |
|---|---|---|
| COMP-COL-001 | Trabajo en equipo | Colabora con otros de forma cooperativa, compartiendo información y apoyando el logro del equipo |
| COMP-COL-002 | Cooperación interárea | Coordina acciones con áreas distintas a la propia para lograr un objetivo común |

### F. Organización

| ID | Nombre | Definición (borrador) |
|---|---|---|
| COMP-ORG-001 | Organización del trabajo | Planifica y prioriza sus tareas de forma autónoma para cumplir plazos y estándares |
| COMP-ORG-002 | Gestión del tiempo | Distribuye su tiempo entre tareas según prioridad y urgencia, minimizando postergación |

## 4. Total

- **9 competencias candidatas** (mínimo 6–10 requerido por PASO 15: ✓ cumplido).
- Distribuidas en 6 categorías (A=2, B=2, C=2, D=1, E=2, F=2 — nota: una categoría con 1 es deliberada; no se fuerza padding).
- Todas status: **DRAFT / CANDIDATE** hasta aprobación humana.

## 5. Regla: NO universalidad

Ninguna competencia es universalmente necesaria. La asignación a un puesto se hace vía `JobCompetency` con `rationale` + `source` + `approvedBy` humano (ver `06-job-linkage.md`). Por ejemplo:
- COMP-TEC-001 (POS) es relevante para CAJERO pero no para LAVAPLATOS.
- COMP-LDR-001 (Dirección) es relevante para GERENTE_PISO pero no para MESERO entry-level.
- COMP-SVC-001 (Servicio) es CRITICAL para MESERO pero puede ser SECONDARY para LAVAPLATOS.

## 6. Solapamientos a vigilar (preview PASO 4)

| Competencia candidata | Solapa con | Tipo |
|---|---|---|
| COMP-TRV-001 Comunicación | PSICOLOGICA EMPATHY | PARTIALLY_OVERLAPPING |
| COMP-TRV-002 Adaptabilidad | PSICOLOGICA ADAPTABILITY | PARTIALLY_OVERLAPPING |
| COMP-COL-001 Trabajo en equipo | PSICOLOGICA TEAMWORK | PARTIALLY_OVERLAPPING |
| COMP-LDR-001 Dirección | PSICOLOGICA LEADERSHIP | PARTIALLY_OVERLAPPING |
| COMP-TEC-001/002 | Knowledge canónico | DISTINCT (conducta vs test) |
| COMP-ORG-002 Gestión tiempo | PSICOLOGICA STRESS | DISTINCT (organización vs manejo de estrés) |

Detalle completo en `15-overlap-audit.md`.

## 7. Estado

Todas las competencias candidatas están en status **DRAFT**. Para pasar a ACTIVE requieren:
1. Indicadores conductuales aprobados (COMP-G3).
2. Vínculo a puesto con rationale + criticality + aprobación (COMP-G4).
3. Revisión legal (COMP-G8).
4. Pilotaje (COMP-G9).

Ninguna está lista para producción.
