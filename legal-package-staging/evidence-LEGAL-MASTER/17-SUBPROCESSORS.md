# EVALUHR — LEGAL MASTER PACKAGE · 17 · SUBPROCESSORS (PASO 24)
# NO INVENTAR PROVEEDORES — lo no confirmado queda PENDIENTE DE CONFIGURACIÓN

## 0. Regla

Inventario basado **solo** en código/configuración real del repo + declaraciones de auditoría previa. Sin lista de subencargados documentada ni contratos — **NO EXISTE documento de subencargados**.

## 1. Registro de proveedores observados (código/config)

| Proveedor | Servicio | Datos | País/destino | ¿Confirmado por contrato? | Riesgo | legalStatus |
|---|---|---|---|---|---|---|
| Supabase | BD Postgres de producción | Todo el inventario (02) | Región documentada como **ca-central-1 (Canadá)** en auditoría previa (AUDITORIA_EVALUHR.md:525, que marca términos "NO DETERMINABLE"); **región real POR CONFIRMAR** | NO — DOCUMENTACIÓN PENDIENTE | Alto (transferencia + encargo) | LEGAL_REVIEW |
| Vercel | Hosting de la app + cron | Solicitudes, logs, cookies de sesión | Región POR CONFIRMAR | NO | Medio | LEGAL_REVIEW |
| Proveedor IA (endpoint Z-AI / SDK z-ai-web-dev-sdk) | Generación de preguntas | Contexto del puesto/vacante (sin PII de candidatos detectado) | POR CONFIRMAR | NO | Medio | LEGAL_REVIEW |
| WhatsApp (uso manual) | Canal de invitación/video | Nombre+enlace; video fuera del sistema | Servicio de terceros usado por RR.HH./candidato | NO — uso manual, sin API | Medio (transparencia) | LEGAL_REVIEW |
| Email/SMTP/SMS | — | — | — | **No detectado en código** (0 hits de Resend/Twilio/SendGrid/nodemailer) | — | NO APLICA HOY |

## 2. Lo que NO existe (honestidad de inventario)

- ❌ Lista de subencargados documentada.
- ❌ Acuerdos de encargo/subencargo firmados.
- ❌ Declaración de países y mecanismos de transferencia.
- ❌ Procedimiento de autorización previa de cambios de subencargados.

## 3. Lo que debe producir el dictamen / post-dictamen

1. Lista definitiva de subencargados (nombres, servicio, datos, país) — requiere información del proveedor: **PENDIENTE DE CONFIGURACIÓN**.
2. Cláusulas de encargo (08 §14) y mecanismo de transferencias (18).
3. Actualización del aviso (06 §8) para declararlos o declarar "sin transferencias adicionales a las indicadas".

## 4. Nota de coherencia

El PDF del aviso declara "no transferencias" mientras la infraestructura implica proveedores con posible destino internacional — **incoherencia aviso↔práctica** ya documentada; resolver con aviso actualizado + registro de subencargados.
