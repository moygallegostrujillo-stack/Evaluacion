# EVALUHR — LEGAL MASTER PACKAGE · 30 · IMPLEMENTATION CHECKLIST (PASO 32)
# CONVERTIR EL DICTAMEN EN TRABAJO TÉCNICO — **NO SE IMPLEMENTA NADA EN ESTA FASE**

## 0. Regla

Lista preparada para ejecutar DESPUÉS del dictamen. Cada ítem: ID / acción / origen (PQ/OLI) / dependencia / estatus (PENDING_DICTAMEN). Ningún ítem se ejecuta hoy.

## 1. Lista

| ID | Acción propuesta | Origen | Área | Estatus |
|---|---|---|---|---|
| LEGAL-001 | Actualizar aviso PDF público al marco 2025 (IA, conservación, revocación, autoridad SABC) y consolidar con in-app | PQ-08/19, OLI-002, OLI-015, OLI-026 | Legal/Contenido | PENDING_DICTAMEN |
| LEGAL-002 | Actualizar textos de consentimiento (forma y granularidad por dictamen) | PQ-03/04, OLI-003 | Legal/Producto | PENDING_DICTAMEN |
| LEGAL-003 | Redactar/firmar contrato maestro con anexos (IA, seguridad, subencargados) | PQ-18, OLI-001 | Legal | PENDING_DICTAMEN |
| LEGAL-004 | Actualizar matriz de retención con plazos del dictamen y ajustar retention.ts | PQ-05, OLI-009 | Datos/Backend | PENDING_DICTAMEN |
| LEGAL-005 | Actualizar controles de acceso (RLS activación, exposición correctAnswer admin, headers) | PQ-—, OLI-012, OLI-019 | Seguridad | PENDING_DICTAMEN |
| LEGAL-006 | Implementar regla de datos sensibles (qué queda, qué se retira, protocolo UNINVITED_DISCLOSURE operativo) | PQ-06/07, OLI-006 | Datos/Producto | PENDING_DICTAMEN |
| LEGAL-007 | Justificar o eliminar `candidateAge` | PQ-22, OLI-005 | Producto | PENDING_DICTAMEN |
| LEGAL-008 | Unificar evidencia de consentimiento en canal público (ConsentLog) | PQ-23, OLI-004 | Backend | PENDING_DICTAMEN |
| LEGAL-009 | Implementar triggers de fin de proceso (hiredAt/notifiedAt) y cron de retención operativo | OLI-010/011 | Backend | PENDING_DICTAMEN |
| LEGAL-010 | Registro de subencargados + acuerdos (Supabase/Vercel/IA) y mecanismos de transferencia | PQ-11/12, OLI-013/014 | Legal/Procure | PENDING_DICTAMEN |
| LEGAL-011 | Protocolo de incidentes con plazos del dictamen + integración con AuditLog | PQ-24, OLI-016 | Seguridad | PENDING_DICTAMEN |
| LEGAL-012 | Backups reales + plan de recuperación (o corregir aviso) | OLI-020 | Infra | PENDING_DICTAMEN |
| LEGAL-013 | Procedimiento ARCO completo (identificación, canal titular, plazos vigentes) | PQ-13, OLI-027 | Proceso | PENDING_DICTAMEN |
| LEGAL-014 | Política de no discriminación adoptada y publicada (cliente+EvaluHR) | PQ-15 | Legal | PENDING_DICTAMEN |
| LEGAL-015 | Decidir Big Five: retiro o licenciamiento IPIP-50-MX | PQ-25, OLI-007 | Producto | PENDING_DICTAMEN |
| LEGAL-016 | Decidir integridad: continuar/retirar; actualizar citas normativas en código/UI | PQ-21, OLI-008 | Producto | PENDING_DICTAMEN |
| LEGAL-017 | Salvaguardas art. 26 (transparencia, revisión, oposición) sobre scoring/presentación | PQ-17, OLI-018 | Producto | PENDING_DICTAMEN |
| LEGAL-018 | Depurar semillas APTO/NO_APTO y todo lenguaje de decisión | 25 §5 | Producto | PENDING_DICTAMEN |
| LEGAL-019 | Alinear verificación de facultades/constancias de las partes | OLI-025 | Legal | PENDING_DICTAMEN |
| LEGAL-020 | Documentar revisión humana (formato mínimo exigible) | PQ-10 | Proceso | PENDING_DICTAMEN |
| LEGAL-021 | Menores: salvaguardas operativas (bloqueo por edad si el dictamen lo exige) | PQ-—, OLI-028 | Producto | PENDING_DICTAMEN |
| LEGAL-022 | Paridad dev/prod de schema (7 modelos Knowledge) antes de despliegue | OLI-021 | Backend | PENDING_DICTAMEN |
| LEGAL-023 | Actualizar AUDITORIA_EVALUHR.md o marcarla como histórica con fecha | OLI-022 | Documentación | PENDING_DICTAMEN |
| LEGAL-024 | Cierre de gates de entrevista (dictamen → piloto → activación) | PQ-20/26, OLI-024 | Gobernanza | PENDING_DICTAMEN |
| LEGAL-025 | Procedimientos ante la nueva autoridad (SABC) y seguimiento del reglamento pendiente | PQ-—, OLI-017 | Legal | PENDING_DICTAMEN |

## 2. Conexión

`conditions` del dictamen (29) → priorización P1/P2/P3 de esta lista → ejecución técnica con verificación del abogado.
