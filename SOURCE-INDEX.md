# SOURCE-INDEX — PROVENANCE DEL LEGAL MASTER PACKAGE

Fecha de compilación: 12–13/sep/2026 (America/Mexico_City). Regla: cada afirmación del paquete proviene de una de las clases siguientes; lo no verificable se marca NO VERIFICADO / LEGAL_REVIEW / DOCUMENTACIÓN PENDIENTE.

## 1. Clase A — Inspección directa del repositorio (verificable por rutas)

Inspección de Task 2-a (agente Explore, read-only) sobre /home/z/my-project:
- Schemas: `prisma/schema.prisma` (25 modelos), `prisma/schema.prod.prisma` (18; drift de 7 modelos Knowledge), `prisma/rls-policies.sql` (14 tablas / 56 policies, "NOT EXECUTED. PREPARATION ONLY").
- Seguridad: `src/lib/auth.ts`, `src/middleware.ts` (PUBLIC_ROUTES), `src/lib/rls.ts` (16 modelos tenant-scoped), `src/lib/rate-limit.ts`, `src/lib/audit.ts`, cookie `evaluhr_token` (auth/route.ts).
- Consentimiento: `User.consent*` (schema.prisma:55-61), `ConsentLog` (94-120), `src/app/api/consent/route.ts`, `src/lib/consent-version.ts`, `public/apply/route.ts:1612-1616` (no auto-consiente).
- ARCO: `ArcoRequest` (745-782), `src/app/api/arco/route.ts`, rate limit 5/día.
- Retención: `src/lib/retention.ts` (730/90/90 días; triggers contratado/notificado inexistentes), `vercel.json` (cron 02:00).
- IA: `src/app/api/vacancies/[id]/generate-questions/route.ts` (único call site; AI_DRAFT).
- Instrumentos: `scripts/generate-templates.ts` (Big Five LEGACY; integridad 10 ítems), `src/lib/overall-score.ts` (OVERALL-v1.1; excluye BIG_FIVE/INTEGRITY; JobFit NO implementado), `src/lib/knowledge-canonical.ts`.
- Documentos: `Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf` (vigente 08-ago-2026, 11 secciones), `src/lib/privacy-notice.ts` (2026-01-v2, ~44 secciones), AUDITORIA_EVALUHR.md (2025-07-25, con 3 claims obsoletos), INFORME_FASE_3.5-G/H (RLS no activado; 6 fixes HIGH), PROJECT_STATUS.md.
- Sin contrato real: 0 archivos; "CONTRATO MAESTRO" 0 hits; contratos de terceros "fuera del repo" (AUDITORIA:793).

## 2. Clase B — Expedientes de auditoría de la cadena A-0x

| Expediente | Estado físico | Provenance | Uso en este paquete |
|---|---|---|---|
| evidence-a03-4 / a03-5 (overall/knowledge) | EN DISCO (13/24 archivos) | Expedientes verificados | 21, 25 |
| evidence-a04-1..5 (integridad, video, overall) | EN DISCO (49 archivos) | Expedientes verificados | 20, 22 |
| evidence-a05-1..3 (personalidad/IPIP) | EN DISCO (49 archivos) | Expedientes verificados | 20, 25 |
| evidence-a06-1..3 (competencias/entrevista diseño) | EN DISCO (65 archivos) | Expedientes verificados | 23, 24 |
| evidence-a06-11 (paquete legal entrevista) | EN DISCO (23 archivos, creado en esta cadena) | Expediente de diseño/auditoría — BORRADOR, no aprobado | 23, 24 |
| A-06.4–A-06.10 | NO MATERIALIZADOS EN DISCO | Solo registro de auditoría (conclusiones: 10 preguntas/26 probes, protocolos, gates) | 23, 24 (con provenance) |
| A-06.9 | NO EJECUTADO | Alcance definido; partes declaradas (EvaluHR/ALIMENTOS PAPO) | 00 §2, 08 §1 (borradores DRAFT) |
| evidence-g/h/i (RLS, fixes, staging) | EN DISCO (20 archivos) | Expedientes verificados | 16 |

## 3. Clase C — Marco legal (verificación web 12–13/sep/2026)

Fuentes oficiales y autorizadas citadas en `01-LEGAL-FRAMEWORK.md` con URL y fecha; evidencia de búsqueda en `law-sources/` (s1–s16 + p1-iapp full-text). Puntos clave:
- LFPDPPP 2025 (DOF 20-mar-2025, vigor 21-mar-2025; reforma 14-nov-2025) — (oficial: diputados.gob.mx/LeyesBiblio; dof.gob.mx) + análisis del texto (iapp.org) para arts. 2, 9, 11, 15, 26, 39.
- Autoridad: Secretaría Anticorrupción y Buen Gobierno (decreto DOF 21-mar-2025; extinción INAI vigente 20-dic-2024).
- Nueva LFT (DOF 15-ene-2026) + reforma jornada (vigor 1-may-2026, gradual a 2030).
- LFPED (reforma 14-nov-2025) / CONAPRED operando.
- NOM-035-STPS-2018 vigente (gob.mx/stps).
- Sin ley general de IA al 2S-2026 (prensa/especializada).
- CPF arts. 210–211 vigentes.
- Números de artículo marcados POR CONFIRMAR requieren cotejo contra el texto oficial íntegro.

## 4. Clase D — Declaraciones del proveedor (sin prueba documental)

Partes, RFCs, domicilios, representante y facultades (00 §2, 08 §1) — marcados DOCUMENTACIÓN PENDIENTE. No se presentan como inscripciones, certificaciones ni acreditaciones gubernamentales.

## 5. Documentos obsoletos detectados (no usar como vigentes sin verificación)

1. `AUDITORIA_EVALUHR.md` (2025-07-25): afirma que el SDK de IA no se usa y que generate-questions no existe (hoy sí); documenta /api/consent/fix (hoy inexistente); "rate limiting NO IMPLEMENTADO" (hoy existe).
2. `PROJECT_CONTEXT.md` (2025-03-04): lista /api/health como pública (ya no lo es).
3. Código/UI con citas al Art. 37 Bis e INAI (marco derogado) — se registran como textos a actualizar (LEGAL-001/002, OLI-026).
