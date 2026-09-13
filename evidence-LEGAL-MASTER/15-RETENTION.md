# EVALUHR — LEGAL MASTER PACKAGE · 15 · RETENTION (PASO 22)

## 0. Estado implementado (verificado en repo — `src/lib/retention.ts`)

| Categoría | Plazo en el sistema | Mecanismo |
|---|---|---|
| PII general (candidatos) | **730 días** | `piiPurgeAt` → anonimización (scores→0, nombre→"Anonimizado", borra respuestas y logs vencidos) |
| Datos sensibles (inactividad/"process conclusion") | **90 días** | `sensitivePurgeAt` |
| AuditLog | **90 días** | Purga en retención |
| Retiro de consentimiento | Inmediato | Borra 14 categorías sensibles, resetea scores (PATCH /api/consent) |
| Conocimientos (evidencia congelada) | Sin purga específica | `Restrict` (preserva evidencia) |
| ConsentLog / ArcoRequest | Sin purga (evidencia legal) | FK SetNull |
| Entrevista (schedule) | Sin purga específica | — |
| Grabaciones | NO EXISTEN | — |

## 1. Gaps operativos verificados

1. **Triggers (a) contratado / (b) notificado NO existen** en el sistema (sin `hiredAt`/`notifiedAt`) — el propio retention.ts lo documenta: la retención sensible depende de "process conclusion" que hoy no se marca.
2. **Cron**: `vercel.json` programa `/api/retention` diario 02:00, pero `PUBLIC_ROUTES` en middleware NO exenta esa ruta y exige JWT → la llamada del cron (Bearer CRON_SECRET) sería rechazada (verificación de código, no runtime) — OPER-01.
3. Sin certificados de eliminación ni registro de evento de purga visible al responsable.

## 2. Matriz para el dictamen (dato / plazo actual / fundamento / acción al vencimiento / legalStatus)

| Dato | Plazo actual | Fundamento propuesto | Acción al vencimiento | legalStatus |
|---|---|---|---|---|
| Candidato no contratado — PII | 730 días | Minimización | Anonimización | [PLAZO POR DICTAMEN] |
| Candidato contratado — PII | No diferenciado (sin hiredAt) | Relación laboral | [PLAZO POR DICTAMEN] | POR DICTAMEN |
| Sensibles (psicológica/Big Five/integridad) | 90 días inactividad | Tratamiento reforzado | Eliminación | [PLAZO POR DICTAMEN] |
| Conocimientos/evidencia congelada | Indefinido | Interés probatorio | Anonimizar/eliminar | [PLAZO POR DICTAMEN] |
| Consentimiento (ConsentLog) | Indefinido | Evidencia legal | Eliminar tras plazo de presunciones | [PLAZO POR DICTAMEN] |
| ARCO (ArcoRequest) | Indefinido | Evidencia legal | Ídem | [PLAZO POR DICTAMEN] |
| Auditoría (AuditLog) | 90 días | Seguridad | Eliminación | [PLAZO POR DICTAMEN] |
| Resultados (scores) | 730 días (con PII) | Minimización | Anonimización | [PLAZO POR DICTAMEN] |
| Grabaciones | NO EXISTEN | — | — | NO APLICA |
| Datos sensibles innecesarios | NO CONSERVAR | Protocolo | Inexistente por diseño | VIGENTE (diseño) |

## 3. Reglas

1. **No se fija ningún plazo como obligación legal sin dictamen** (la cifra "2 años/730 días" es decisión técnica del sistema, no fundamento legal).
2. Obligación de definir plazos de conservación existe en el marco 2025 (cosio.mx guía 2026 — secundaria).
3. Eliminación segura con registro del evento (sin contenido personal).
4. Backups: sin soporte en el repo (el PDF del aviso afirma "respaldo periódico y plan de recuperación" sin sustento) — alinear aviso↔realidad o implementar — LEGAL_REVIEW.
