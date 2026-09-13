# EVALUHR — A-06.11 · 10 · RETENTION — CONSERVACIÓN POR CATEGORÍA (PASO 11)

## 1. Regla dura

> **No se fija ningún plazo como obligación legal sin dictamen.** Donde corresponde un plazo, se escribe **[PLAZO POR DICTAMEN LEGAL]**.
> Antecedente de registro (A-06.8): la cifra "2 años" existe **como RECOMENDACIÓN operativa** — **no** como obligación legal establecida. El dictamen debe determinar el fundamento y el plazo definitivo.

## 2. Categorías separadas

| Categoría | Contenido | Propuesta de diseño | Plazo | Destino al vencimiento |
|---|---|---|---|---|
| Consentimiento | Manifestación + información previa entregada (14) | Conservar durante el proceso y mientras exista la relación de tratamiento | [PLAZO POR DICTAMEN LEGAL] | Eliminación segura |
| Entrevista | Guía aplicada, versiones, metadatos de sesión | Conservar como soporte del proceso | [PLAZO POR DICTAMEN LEGAL] | Eliminación segura |
| Respuestas | Texto STAR del candidato | Conservar mientras respalde la revisión | [PLAZO POR DICTAMEN LEGAL] | Eliminación segura |
| Evidencia | InterviewEvidence + indicatorsObserved (append-only) | Conservar mientras respalde CompetencyResult y eventuales aclaraciones | [PLAZO POR DICTAMEN LEGAL] | Eliminación segura |
| Revisión | InterviewReview + CompetencyResult + rationale | Conservar mientras la empresa use el insumo y para trazabilidad de revisión humana | [PLAZO POR DICTAMEN LEGAL] | Eliminación segura |
| Auditoría | Audit trail de plataforma, versiones, approvedBy | Conservar por gobernanza; posible separación de datos personales vs evento técnico | [PLAZO POR DICTAMEN LEGAL] | Eliminación o anonimización según dictamen |
| Grabaciones | **No se capturan** (06 §2.6) | No aplica; cualquier habilitación = dictamen + consentimiento específico | NO APLICA | NO APLICA |
| Datos sensibles | Contenido de revelación involuntaria | **NO CONSERVAR** (solo flag YES/NO) | **NO CONSERVAR** | Inexistente por diseño |

## 3. Reglas transversales

1. **Conservación por instrucción**: EVALUA HR conserva por instrucción del responsable (empresa cliente); no define finalidades propias sobre los datos (14).
2. **Mínima conservación**: cada categoría se conserva solo el tiempo necesario para su finalidad declarada en el aviso.
3. **Eliminación segura**: al vencimiento, eliminación (y no simple deshabilitación) con registro del evento de eliminación sin contenido de datos personales.
4. **Candidatos no contratados**: plazo diferenciado candidato con proceso cerrado vs contratado — **[PLAZO POR DICTAMEN LEGAL]** (cuestión 5 de 19).
5. **Bloqueo en litigio/ARCO**: suspensión temporal por ejercicio de derechos o requerimiento — por dictamen.
6. **Backup**: exclusión de backups de la lógica de eliminación activa o purga diferida — decisión operativa por dictamen.

## 4. Preguntas abiertas específicas para el dictamen

- ¿Fundamento y plazo para cada categoría (candidato contratado vs no contratado)?
- ¿El audit trail (eventos técnicos) puede anonimizarse a plazo menor que los datos personales?
- ¿Obligación de bloqueo previo a eliminación (art. 20 LFPDPPP) y su alcance?
- ¿La "recomendación de 2 años" es adecuada, insuficiente o excesiva para cada categoría?

## 5. Conexión con gates

LEGAL-G6 (conservación) — estado PROPUESTA — LEGAL_REVIEW. Ningún plazo se implementa en producto sin dictamen (LEGAL-G8).
