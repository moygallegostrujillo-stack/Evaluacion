# EVALUHR — A-06.11 · 18 · SECURITY (PASO 19)

## 0. Regla del encargo

> Presentar controles existentes **sin afirmar certificaciones**. Este documento describe controles de diseño verificados en auditoría; **no declara** ISO 27001, NOM certificaciones ni ningún sello externo.

## 1. Controles existentes

| Control | Descripción verificada (arquitectura del proyecto) | Estado |
|---|---|---|
| Autenticación | JWT con `jose`, cookies httpOnly; hashing bcrypt 12 rounds (con migración de legacy SHA-256) | Documentado en arquitectura |
| Autorización | Middleware de Next.js con verificación JWT e inyección de identidad/rol/empresa (`x-user-id`, `x-user-role`, `x-user-company`); rutas públicas acotadas | Documentado |
| Mínimo privilegio | Roles diferenciados; matriz de acceso 8 roles × 7 acciones del registro A-06.8 (entrevistador/reviewer/approver/RR.HH./admin/compliance) — cada rol solo las acciones de su función | Diseño registrado |
| Aislamiento multi-tenant | RLS a nivel de aplicación (Prisma Client Extension) + RLS a nivel BD (PostgreSQL en producción); separación por `x-user-company` | Documentado |
| Auditoría | Audit trail inmutable, append-only, versiones (InterviewReview-vN, CompetencyResult-vN), `approvedBy` humano, timestamps; `origin` IA permanente | Documentado (A-06.3 `18-versioning.md`) |
| Conservación limitada | Categorías de conservación con plazos por dictamen (10); datos sensibles no conservados (07) | Diseño |
| Eliminación | Eliminación segura al vencimiento con registro del evento (sin contenido de datos personales) | Diseño |
| Confidencialidad operativa | Probes prohibidos; guía cerrada; pregunta estructurada igual por candidato; segregación entrevistador/reviewer | Diseño |

## 2. Declaraciones prohibidas

- ❌ "Somos ISO 27001" — no existe certificación.
- ❌ "Cumplimos NOM-XXX certificada" — no existe.
- ❌ "Infraestructura certificada PCI/SOC2" — no afirmar.
- ✔ Permitido: "controles de seguridad de diseño documentados y sujetos a auditoría" (este documento).

## 3. Matriz de acceso (síntesis del registro 8 roles × 7 acciones)

| Rol / Acción | Ver candidato | Conducir entrevista | Capturar evidencia | Revisar/nivelar | Aprobar resultado | Ver auditoría | Eliminar |
|---|---|---|---|---|---|---|---|
| Entrevistador | ● | ● | ● | — | — | — | — |
| Reviewer | ● | — | — | ● | — | — | — |
| Approver | ● | — | — | — | ● | — | — |
| RR.HH. empresa | ● | — | — | lee | — | — | — |
| Admin empresa | — | — | — | — | — | limitado | por proceso |
| Compliance EvaluHR | — | — | — | — | — | ● | — |
| Técnico EvaluHR | — | — | — | — | — | ● | por proceso |
| SUPER_ADMIN | — | — | — | — | — | ● | controlado |

(Regla: ninguna acción sin necesidad funcional; acceso a contenido de respuesta limitado a entrevistador/reviewer/approver.)

## 4. Huecos a resolver (declaración honesta para el dictamen)

1. Cifrado en reposo: depende del proveedor de BD — confirmar en A-06.9 real (subencargados).
2. Retención de logs técnicos y su anonimización — por dictamen (10 §4).
3. Pruebas de penetración / revisiones de seguridad externas — no realizadas; declarar como no existente.
4. Borrado en backups — 10 §3.6.

## 5. Conexión con gates

LEGAL-G9 (implementación operativa de controles) = PARTIALLY SATISFIED: controles de diseño registrados; verificación operativa real pendiente del piloto no productivo (A-06.10 no ejecutado).
