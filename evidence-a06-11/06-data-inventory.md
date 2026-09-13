# EVALUHR — A-06.11 · 06 · DATA INVENTORY (PASO 7)

## 1. Regla

Inventario exacto de datos del proceso de entrevista estructurada BDI/STAR. Columnas: **DATO / ORIGEN / FINALIDAD / SENSIBLE / NECESARIO / CONSERVACIÓN / ACCESO / LEGAL_STATUS**.

Regla de necesidad: solo se trata el dato con finalidad explícita y proporcional (principio de calidad LFPDPPP). Los plazos de conservación se dejan como **[PLAZO POR DICTAMEN LEGAL]** — no se fijan como obligación legal sin dictamen (ver 10).

## 2. Inventario

### 2.1 Datos identificativos

| DATO | ORIGEN | FINALIDAD | SENSIBLE | NECESARIO | CONSERVACIÓN | ACCESO | LEGAL_STATUS |
|---|---|---|---|---|---|---|---|
| Nombre del candidato | EMPRESA CLIENTE (registro de invitación) | Identificar la sesión de entrevista y vincularla al proceso de selección | NO | SÍ | [PLAZO POR DICTAMEN LEGAL] | RR.HH. empresa; entrevistador; reviewer | LEGAL_REVIEW |
| Teléfono / correo | EMPRESA CLIENTE (invitación) | Contacto operativo del proceso | NO | SÍ (mínimo suficiente) | [PLAZO POR DICTAMEN LEGAL] | RR.HH. empresa | LEGAL_REVIEW |
| Identificador de sesión / vacancy / token | PLATAFORMA EVALUA HR | Trazabilidad técnica y acceso a la evaluación | NO | SÍ | [PLAZO POR DICTAMEN LEGAL] | Roles técnicos con mínimo privilegio | LEGAL_REVIEW |

### 2.2 Experiencia y formación (referencial)

| DATO | ORIGEN | FINALIDAD | SENSIBLE | NECESARIO | CONSERVACIÓN | ACCESO | LEGAL_STATUS |
|---|---|---|---|---|---|---|---|
| Experiencia declarada (CV / resumen del puesto anterior) | CANDIDATO | Contexto para detección de conflictos (CONFLICT → PENDING_REVIEW); no sustituye evidencia de entrevista | NO | CONDICIONADO — solo la pertinente al puesto | [PLAZO POR DICTAMEN LEGAL] | RR.HH. empresa; entrevistador; reviewer | LEGAL_REVIEW |
| Formación / certificaciones (p.ej. NOM-251 manipulación de alimentos) | CANDIDATO | Verificar requisito del puesto (si el puesto lo exige documentadamente) | NO | CONDICIONADO a requisito real del puesto | [PLAZO POR DICTAMEN LEGAL] | RR.HH. empresa | LEGAL_REVIEW |

### 2.3 Conducta y respuestas (núcleo de la entrevista)

| DATO | ORIGEN | FINALIDAD | SENSIBLE | NECESARIO | CONSERVACIÓN | ACCESO | LEGAL_STATUS |
|---|---|---|---|---|---|---|---|
| Respuestas del candidato (texto STAR) | CANDIDATO (durante la entrevista) | Capturar conducta pasada para evaluación de competencias | NO por diseño — riesgo de contenido sensible por revelación involuntaria (ver 07) | SÍ | [PLAZO POR DICTAMEN LEGAL] | Entrevistador; reviewer; RR.HH. empresa | LEGAL_REVIEW |
| Registro de probes aplicados | ENTREVISTADOR / PLATAFORMA | Documentar qué probes aprobados se usaron y cuándo | NO | SÍ (trazabilidad) | [PLAZO POR DICTAMEN LEGAL] | Entrevistador; reviewer | LEGAL_REVIEW |
| Duración de la sesión | PLATAFORMA | Control operativo (referencia 25–37 min de A-06.3) | NO | SÍ (operativo) | [PLAZO POR DICTAMEN LEGAL] | Operación EvaluHR | LEGAL_REVIEW |
| Flag UNINVITED_DISCLOSURE=YES/NO | ENTREVISTADOR (protocolo 07) | Evidencia de aplicación del protocolo de revelación involuntaria; **sin contenido** | NO (el flag no contiene contenido sensible) | SÍ (control de privacidad) | [PLAZO POR DICTAMEN LEGAL] | RR.HH. empresa; compliance; abogado | LEGAL_REVIEW |

### 2.4 Evidencia y revisión

| DATO | ORIGEN | FINALIDAD | SENSIBLE | NECESARIO | CONSERVACIÓN | ACCESO | LEGAL_STATUS |
|---|---|---|---|---|---|---|---|
| InterviewEvidence (STAR estructurado + indicatorsObserved) | REVIEWER sobre la respuesta del candidato | Evidencia inmutable base de la revisión | NO por diseño | SÍ | [PLAZO POR DICTAMEN LEGAL] | Entrevistador; reviewer; approver | LEGAL_REVIEW |
| InterviewReview (evidenceLevel, rationale, conflicts, limitations) | REVIEWER HUMANO | Interpretación humana con rationale; append-only | NO | SÍ | [PLAZO POR DICTAMEN LEGAL] | Reviewer; approver; RR.HH. empresa | LEGAL_REVIEW |
| CompetencyResult (evidenceLevel por competencia) | AGREGACIÓN SUPERVISADA (humano) | Insumo complementario para decisión de empresa | NO | SÍ | [PLAZO POR DICTAMEN LEGAL] | RR.HH. empresa (revisor) | LEGAL_REVIEW |
| ConflictRecord | REVIEWER | Documentar conflicto entre fuentes sin promediar | NO | SÍ si existe conflicto | [PLAZO POR DICTAMEN LEGAL] | Reviewer; approver | LEGAL_REVIEW |

### 2.5 Auditoría y operación

| DATO | ORIGEN | FINALIDAD | SENSIBLE | NECESARIO | CONSERVACIÓN | ACCESO | LEGAL_STATUS |
|---|---|---|---|---|---|---|---|
| Audit trail (eventos, versiones, approvedBy, timestamps) | PLATAFORMA EVALUA HR | Gobernanza append-only; demostrar revisión humana | NO | SÍ | [PLAZO POR DICTAMEN LEGAL] | Compliance; SUPER_ADMIN con mínimo privilegio; abogado (dictamen) | LEGAL_REVIEW |
| Datos de capacitación/calibración de entrevistadores | EVALUA HR (internos) | Gate de calidad operativa | NO | SÍ (operativo) | [PLAZO POR DICTAMEN LEGAL] | Operación EvaluHR | LEGAL_REVIEW |
| Borradores IA (resúmenes, sugerencias) con marca AI_GENERATED | PLATAFORMA (IA) | Asistencia al entrevistador; siempre HUMAN_REVIEWED | NO (procesan texto de respuesta) | SÍ (función asistida) | [PLAZO POR DICTAMEN LEGAL] | Entrevistador; reviewer | LEGAL_REVIEW — tratamiento por encargado a validar |

### 2.6 Grabaciones y datos sensibles

| DATO | ORIGEN | FINALIDAD | SENSIBLE | NECESARIO | CONSERVACIÓN | ACCESO | LEGAL_STATUS |
|---|---|---|---|---|---|---|---|
| Grabaciones de audio/video | — | **DISEÑO ACTUAL: NO SE CAPTURAN.** Solo texto/transcripción si existiera fuente consentida | POTENCIALMENTE (voz) | NO — no hay necesidad definida en el diseño | **NO APLICA — no se capturan** | — | LEGAL_REVIEW — cualquier habilitación futura requiere dictamen + consentimiento específico |
| Contenido sensible revelado involuntariamente | CANDIDATO (involuntario) | **NINGUNA — NO CONSERVAR** | **SÍ** | NO | **NO CONSERVAR** (solo flag YES/NO) | Solo el flag es accesible | LEGAL_REVIEW (protocolo 07) |

## 3. Separación de planos exigida por el encargo

| Plano | Datos incluidos | Nota |
|---|---|---|
| Identificativos | nombre, teléfono, correo, sesión/token | Mínimo suficiente |
| Experiencia | CV pertinente al puesto, certificaciones | Condicionado a requisito real |
| Formación | misma fila anterior (2.2) | — |
| Conducta | respuestas STAR, probes aplicados, duración | Núcleo proporcional a competencias |
| Respuestas | texto STAR (subconjunto de conducta) | Inmutable una vez capturado |
| Evidencia | InterviewEvidence + indicatorsObserved | Append-only |
| Revisión | InterviewReview + CompetencyResult + rationale | Humana, versionada |
| Auditoría | audit trail, flags, entrenamiento | Inmutable |

## 4. Datos que el inventario EXCLUYE expresamente

Atributos protegidos y vida privada (edad, género, embarazo, religión, estado civil, hijos, origen, discapacidad, salud, orientación sexual, opinión política, situación económica, domicilio, vida social) — catálogo completo en A-06.3 `15-privacy.md` §3. **No tienen fila en este inventario porque no se tratan.**
