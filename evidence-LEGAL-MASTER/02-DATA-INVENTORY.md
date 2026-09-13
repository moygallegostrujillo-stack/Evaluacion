# EVALUHR — LEGAL MASTER PACKAGE · 02 · DATA INVENTORY (PASO 4)

## 0. Método

Inventario construido por inspección real del repositorio (schemas Prisma, APIs, librerías — evidencia con rutas). Columnas: dato / origen / finalidad / base jurídica requerida / sensible / necesario / acceso / conservación (estado actual del sistema) / transferencia / riesgo / acción legal. Versión CSV: `legal-data-inventory.csv`.

## 1. Inventario por categoría

### 1.1 Identificación y contacto

| Dato | Origen | Finalidad | Base req. | Sensible | Necesario | Acceso | Conservación actual | Transferencia | Riesgo | Acción legal |
|---|---|---|---|---|---|---|---|---|---|---|
| Nombre candidato | RR.HH. (invitación) o postulación pública | Identificar proceso | Aviso+consent/base por dictamen | NO | SÍ | RR.HH., SUPER_ADMIN | 730 días (PII purge) | Supabase/Vercel/IA-no | Bajo | Dictamen plazos |
| Email | Invitación/auto-login (`cand_*@evaluhr.auto` placeholder) | Cuenta + contacto | Ídem | NO | SÍ (mínimo) | Ídem | 730 días | Ídem | Bajo | Ídem |
| Teléfono | RR.HH. (requerido) | Invitación WhatsApp manual + dedupe | Ídem | NO | SÍ | Ídem | 730 días | WhatsApp (manual, fuera del sistema) | Medio (uso de app externa por RR.HH.) | Informar en aviso; dictamen |
| **Edad (candidateAge)** | Postulación pública (`VacancyApplication.candidateAge`) | ¿Filtro de vacante? | POR DICTAMEN — atributo protegido (CPEUM 1; LFPED) | POTENCIALMENTE | **DUDOSO — minimización** | RR.HH. | 730 días | Ídem | **MEDIO-ALTO: edad recolectada en canal público** | JUSTIFICAR finalidad o eliminar (post-dictamen) |
| RFC/constancias de partes | Declaradas por proveedor | Identificación contractual | No aplica a candidatos | NO | SÍ (contractual) | Partes/abogado | Permanente | No | Bajo | DOCUMENTACIÓN PENDIENTE |

### 1.2 Respuestas de evaluación

| Dato | Origen | Finalidad | Base req. | Sensible | Necesario | Acceso | Conservación actual | Transferencia | Riesgo | Acción legal |
|---|---|---|---|---|---|---|---|---|---|---|
| Respuestas Big Five (10 ítems propios, LEGACY) | Candidato | Perfil de personalidad (excluido de overall) | Aviso+consentimiento expreso (sensibles) | **SÍ (personalidad/salud mental)** | DUDOSO en V1 (declinado) | RR.HH. | 90 días sensibles (inactividad) | Supabase | Medio (legacy sin licencia) | Dictamen: conservar/eliminar; licencia IPIP (ver 20) |
| Respuestas psicológicas (14 categorías) | Candidato | Competencias psicológicas | Aviso+consentimiento expreso | **SÍ** | SÍ (V1) | RR.HH. | 90 días sensibles | Supabase | Medio | Protocolo sensibles (ver 10) |
| Respuestas de conocimientos + snapshots | Candidato | Aptitud técnica | Aviso+consentimiento | NO | SÍ | RR.HH. (correctAnswer solo admin autenticado) | 730 días / congelado | Supabase | Bajo (key protegida server-side; expuesta a browser admin) | Dictamen sobre exposición admin |
| Respuestas de integridad | Candidato | Indicador orientativo (excluido de overall) | Aviso+consentimiento expreso | **SÍ** | DUDOSO (aislado por diseño) | RR.HH. | 90 días sensibles | Supabase | Medio | Dictamen: continuar/retirar (ver 22) |
| videoType/videoUrl (marca de paso) | Sistema | Marcar paso de video | Aviso | NO (no hay grabación almacenada) | CONDICIONADO | RR.HH. | 730 días | **El video viaja por WhatsApp FUERA del sistema** | Medio (transferencia de facto fuera de plataforma) | Transparencia + dictamen (ver 18) |

### 1.3 Resultados y decisiones

| Dato | Origen | Finalidad | Base req. | Sensible | Necesario | Acceso | Conservación actual | Transferencia | Riesgo | Acción legal |
|---|---|---|---|---|---|---|---|---|---|---|
| Scores (Big Five ×5, Psicológica ×5) | Motor de scoring | Insumo informativo | Ídem | SÍ (derivados) | SÍ | RR.HH., candidato (suyo) | Ídem | Supabase | Medio | Ídem |
| knowledgeScore | Motor (INSUFFICIENT ≠ 0) | Aptitud | Ídem | NO | SÍ | Ídem | 730 días | Supabase | Bajo | Ídem |
| integrityScore (aislado) | Motor | Orientativo, nunca filtro | Ídem | SÍ | DUDOSO | RR.HH. | 90 días | Supabase | Medio | Ver 22 |
| overallScore (OVERALL-v1.1, excluye Big Five e Integridad) | Motor | Orientación de perfil | Ídem | Parcial | SÍ (completitud) | RR.HH., candidato | Ídem | Supabase | Bajo | Lenguaje (ver 25) |
| recommendation (PERFIL_COMPLETO/PARCIAL/PENDIENTE) | Motor | Orientación informativa; **NO decisión** | Ídem | NO | SÍ | Ídem | Ídem | Supabase | Bajo | Lenguaje contractual/aviso |
| Entrevista (InterviewSchedule: fecha/lugar/estado/notes) | RR.HH. | Agendar | Ídem | NO | SÍ | RR.HH. | Sin purga específica | Supabase | Bajo | Incluir en matriz de retención |

### 1.4 Consentimiento, ARCO, auditoría, seguridad

| Dato | Origen | Finalidad | Base req. | Sensible | Necesario | Acceso | Conservación actual | Transferencia | Riesgo | Acción legal |
|---|---|---|---|---|---|---|---|---|---|---|
| Consentimiento (User.consent* + **ConsentLog**: acción, versión, IP, UA, snapshots, noticeHash SHA-256) | Candidato | Evidencia de consentimiento | Obligación legal | NO (snapshots = identificativos) | SÍ | Compliance/abogado | Sin purga (evidencia) | Supabase | Bajo | Dictamen plazos; **gap: canal público no escribe ConsentLog** |
| ArcoRequest (tipo, estados, deadline 20 días hábiles, documentos) | Titular/RR.HH. | Gestionar derechos | Obligación legal | NO | SÍ | RR.HH., SUPER_ADMIN | Sin purga específica | Supabase | Bajo | Ídem |
| AuditLog (11 acciones, IP, UA, success) | Sistema | Seguridad/gobernanza | Interés legítimo/obligación | NO | SÍ | SUPER_ADMIN | **90 días** | Supabase | Bajo | Dictamen: plazo vs evidencia |
| Cookie `evaluhr_token` (httpOnly, sameSite lax, 8h) | Sistema | Sesión | Necesidad técnica | NO | SÍ | Titular de sesión | 8 horas | No | Bajo | Aviso de cookies ya existe (in-app §20) |
| Purga: piiPurgeAt/sensitivePurgeAt/retainedUntil/purgedAt | Sistema | Minimización | Obligación | NO | SÍ | Sistema | — | No | Bajo | Activar cron (ver 15) |
| Prompts/preguntas IA (VacancyQuestion AI_DRAFT) | IA (generación de preguntas) | Asistencia RR.HH. | Aviso (uso IA) | NO (no envía PII de candidatos) | SÍ | RR.HH. | Sin purga específica | **Proveedor IA (endpoint externo)** | Medio | Anexo IA + subencargados (ver 12/17) |

## 2. Datos que NO se tratan (verificado)

- **NO hay upload de CV/documentos** en el sistema.
- **NO se recogen** campos de salud, discapacidad, religión, estado civil, orientación, opinión política (0 campos en schema).
- **NO se almacenan videos** (solo marca WHATSAPP/SKIPPED).
- **NO hay exportaciones de datos** (CSV/Excel) — únicamente descargas públicas de documentos legales (aviso PDF, auditoría).

## 3. Clasificación de conflicto detectada

| Hallazgo | Implicación |
|---|---|
| `candidateAge` recolectado en canal público | Atributo protegido — requiere justificación de finalidad o eliminación (LEGAL_REVIEW) |
| Big Five/Integridad tratados como sensibles pero Big Five EXCLUIDO de resultados por diseño legacy | Reducir exposición o retiro — LEGAL_REVIEW |
| ConsentLog solo en canal autenticado | Evidencia de consentimiento incompleta en canal público — LEGAL_REVIEW |
