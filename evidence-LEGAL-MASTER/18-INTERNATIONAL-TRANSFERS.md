# EVALUHR — LEGAL MASTER PACKAGE · 18 · INTERNATIONAL TRANSFERS (PASO 25)

## 0. Regla del encargo

**No afirmar que una transferencia ocurre si no está confirmada.** Lo que sigue son **posibles** transferencias derivadas de proveedores observados en código/configuración, todas POR CONFIRMAR.

## 1. Registro de posibles transferencias

| # | Transferencia (posible) | Datos | Destino | Proveedor | Mecanismo | Revisión legal |
|---|---|---|---|---|---|---|
| T1 | Alojamiento de BD de producción | Todo el inventario (02) | Canadá (región documentada ca-central-1 en auditoría previa; **región real POR CONFIRMAR**) | Supabase | Contrato de subencargo + mecanismo por dictamen (nueva ley 2025) | LEGAL_REVIEW — DOCUMENTACIÓN PENDIENTE |
| T2 | Hosting/cron de la aplicación | Solicitudes, logs, cookies | Región POR CONFIRMAR | Vercel | Ídem | LEGAL_REVIEW |
| T3 | Llamadas al proveedor IA (solo prompts de generación de preguntas) | Contexto de puesto (sin PII detectado) | POR CONFIRMAR | Endpoint Z-AI | Ídem + prohibición de entrenamiento | LEGAL_REVIEW |
| T4 | Envío manual por WhatsApp (enlace de invitación; video fuera del sistema) | Nombre+enlace; video del candidato | Según uso del servicio por RR.HH./candidato | WhatsApp/Meta (fuera del sistema) | Sin API; transparencia en aviso | LEGAL_REVIEW |
| T5 | Cualquier otra | — | — | — | — | NO DETECTADA |

## 2. Estructura pedida por el encargo

```
TRANSFERENCIA → DATOS → DESTINO → PROVEEDOR → MECANISMO → REVISIÓN LEGAL
```

Aplicada en la tabla §1. El **mecanismo** habilitante de cada transferencia lo determina el dictamen conforme a la LFPDPPP 2025 vigente (el catálogo de supuestos y plazos del marco 2011/Reglamento derogado NO se cita como vigente).

## 3. Acciones post-dictamen

1. Confirmar región real y términos de Supabase/Vercel/proveedor IA (DOCUMENTACIÓN PENDIENTE).
2. Incluir subencargados y mecanismos en contrato (08 §14-15) y aviso (06 §8).
3. Decidir el tratamiento del uso manual de WhatsApp (informar en aviso o sustituir por canal dentro del sistema).
