# EVALUHR — A-06.8 — 11 · Acceso por Rol (PASO 11)

> Matriz de roles × acciones con **mínimo privilegio**. Acciones: READ / CREATE / REVIEW /
> MODIFY / INVALIDATE / EXPORT / DELETE. Re-expresa A-06.4 `11-access-control.md` en la taxonomía
> de A-06.8 y añade las restricciones de revelación involuntaria (05) e IA.

## 1. Definiciones de acción

| Acción | Significado |
|---|---|
| READ | Ver datos existentes (según alcance del rol) |
| CREATE | Generar registros nuevos (entrevistas, notas, solicitudes, flags) |
| REVIEW | Asignar/confirmar evidencia o nivel como revisor humano |
| MODIFY | Cambiar contenido — **solo append-only** (nueva versión; nunca sobrescribir) |
| INVALIDATE | Marcar registro/resultado como inválido con justificación |
| EXPORT | Extraer datos fuera de la plataforma (siempre con log) |
| DELETE | Purge/eliminación (física o lógica) de datos |

## 2. Matriz (8 roles × 7 acciones)

| Acción | CANDIDATO | ENTREVISTADOR | RH (cliente) | GERENTE (cliente) | SUPER_ADMIN | REVISOR | SISTEMA | IA |
|---|---|---|---|---|---|---|---|---|
| **READ** | ✓ solo sus datos (ARCO) | ✓ sus propias entrevistas | ✓ candidatos de su empresa | ✓ resultados del proceso donde participa | ✓ gestión técnica (mínimo necesario; log) | ✓ evidencia asignada a revisión | ✓ técnico (storage/purge) | ✗ acceso autónomo — solo el segmento que el humano le provee |
| **CREATE** | ✓ solicitud ARCO / consentimiento / revocación | ✓ notas STAR, flags de revelación (sin contenido) | ✗ (solicita vía EvaluHR) | ✗ | ✗ (gestión no crea contenido evaluativo) | ✗ (solo revisión) | ✓ registros técnicos/timestamps/logs | ✗ crea solo AI_DRAFT sin efecto jurídico |
| **REVIEW** | ✗ | ✗ (quien entrevistó no revisa; EX-1..EX-4 controladas) | ✓ con reviewer de EvaluHR (compartido) | ✗ | ✗ | ✓ **núcleo del rol** (rúbrica v2 + calibración) | ✗ | ✗ **PROHIBIDO** (X-6, 07) |
| **MODIFY** | ✗ (rectifica vía ARCO → nueva versión) | ✗ | ✗ | ✗ | ✗ | ✓ append-only (nueva versión con rationale) | ✗ | ✗ PROHIBIDO |
| **INVALIDATE** | ✗ (solicita) | ✗ | ✓ con justificación | ✗ | ✓ administrativo con justificación | ✓ (incl. evidencia contaminada por revelación, 05) | ✗ | ✗ PROHIBIDO |
| **EXPORT** | ✓ sus datos (ARCO) | ✗ | ✓ con log y justificación | ✗ | ✓ con log (técnico/admin) | ✗ | ✗ (registra el log) | ✗ PROHIBIDO |
| **DELETE** | ✗ (solicita cancelación ARCO) | ✗ | ✗ (solicita) | ✗ | ✓ purge administrativo con justificación + log | ✗ | ✓ purge automático programado (10) | ✗ PROHIBIDO |

## 3. Reglas de mínimo privilegio

1. **CANDIDATO**: máximo alcance sobre SUS datos vía ARCO; cero alcance sobre datos de terceros.
2. **ENTREVISTADOR**: ve solo SUS entrevistas; nunca revisa su propia entrevista (separación de
   A-06.7, EX-1..EX-4 con controles); no exporta; no borra.
3. **RH (empresa cliente)**: decide contratación; NO modifica evidencia; su revisión es compartida
   con reviewer de EvaluHR; exporta con log.
4. **GERENTE**: lectura restringida al proceso donde participa; no toca la plataforma de evidencia.
5. **SUPER_ADMIN**: poder técnico con log y justificación; prohíbese el uso administrativo para
   fines evaluativos.
6. **REVISOR**: único rol con REVIEW/MODIFY (append-only); revisa bajo calibración (A-06.7).
7. **SISTEMA**: crea/elimina solo lo programado (purge, timestamps, logs); nunca valora personas.
8. **IA**: **sin acceso autónomo, sin CREATE efectivo (solo AI_DRAFT), sin REVIEW/MODIFY/
   INVALIDATE/EXPORT/DELETE** (07). Recibe segmentos que el humano le entrega; no consulta históricos.
9. **Flags de revelación involuntaria (05)**: READ limitado a reviewer/admin de auditoría; jamás
   visibles para quien decide contratación.
10. **Auditoría de accesos**: todo READ/EXPORT/DELETE queda logeado (quién, cuándo, qué, propósito).

## 4. Conexión con gates

LEGAL-G9 (seguridad) permanece APROBADO en diseño con esta matriz; su implementación técnica y su
prueba se verifican antes de activación (NO IMPLEMENTAR aquí).
