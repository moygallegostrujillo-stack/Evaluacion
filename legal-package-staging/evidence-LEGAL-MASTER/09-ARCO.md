# EVALUHR — LEGAL MASTER PACKAGE · 09 · ARCO (PASO 12)

## 0. Estado implementado (verificado en repo)

| Componente | Evidencia | Detalle |
|---|---|---|
| Modelo | `ArcoRequest` (schema.prisma:745-782; schema.prod.prisma:448) | rightType ACCESS/RECTIFICATION/CANCELLATION/OPPOSITION; 7 estados (PENDING→COMPLETED); `legalDeadline` = 20 días hábiles (`computeLegalDeadline`); requester externo soportado; responseDocumentUrl |
| API | `src/app/api/arco/route.ts` (321 líneas) | POST (candidato self-service o admin en nombre); GET (candidato solo lo suyo); PATCH (solo RH/GERENTE/SA con anti-spoofing de companyId y auditoría `UNAUTHORIZED_ATTEMPT`) |
| Rate limit | 5/día/IP (`rate-limit.ts:44-45`) | Anti-abuso |
| Registro | RLS app (`rls.ts:88`) + políticas DB (`rls-policies.sql:116-117`) | Escopado por tenant |
| UI | No existe vista dedicada; menciones informativas en ConsentView/PublicEvaluationView/EvaluationCompleteView | GAP de experiencia, no de API |

## 1. Flujo auditado (mapeo del encargo)

```
SOLICITUD (titular — POST /api/arco; canal definido por el aviso del responsable)
  → IDENTIFICACIÓN (acreditación; self-service por token o solicitud administrada)
  → RESPONSABLE (EMPRESA CLIENTE — recibe, califica procedencia, decide)
  → EVALUA HR (asiste: localiza por sessionId/companyId, suspende tratamientos, ejecuta por instrucción)
  → EJECUCIÓN (según derecho; rectificación = nueva revisión versionada, sin editar original; cancelación = purga/anonimización)
  → RESPUESTA (al titular por el responsable; responseDocumentUrl)
  → EVIDENCIA (AuditLog + ArcoRequest con estados y deadlines)
```

## 2. Responsabilidades y plazos (por dictamen)

| Elemento | Diseño actual | Marco vigente |
|---|---|---|
| Plazo de respuesta | 20 días hábiles (hardcodeado en `computeLegalDeadline`) | 20 días hábiles confirmado por fuentes secundarias 2026; NÚMERO DE ARTÍCULO POR CONFIRMAR en texto oficial LFPDPPP 2025 |
| Autoridad de control | — | Secretaría Anticorrupción y Buen Gobierno (tras extinción INAI) |
| Obligaciones del responsable | Recibir, calificar, responder | Empresa cliente |
| Obligaciones del encargado | Asistir, ejecutar por instrucción, evidenciar | EvaluHR |
| Cancelación | Purga/anonimización por retención + DELETE endpoints | Categorías de conservación (15) |

## 3. Casos especiales declarados

1. **Rectificación de resultados**: no se editan scores; se registra corrección versionada (append-only).
2. **Cancelación con evidencia legal**: ConsentLog/ArcoRequest sobreviven al borrado del usuario (FK SetNull) — dictamen sobre plazo de esta evidencia.
3. **AuditLog 90 días**: anonimización vs conservación — por dictamen.
4. **Candidato con proceso activo**: la solicitud no paraliza el proceso si el tratamiento está habilitado — decisión del responsable.

## 4. Gaps

- Falta UI/portal dedicado para el titular (hoy canal API + correo de RR.HH.).
- Falta procedimiento documentado de identificación para solicitudes externas (documentos requeridos) — definible por dictamen.
