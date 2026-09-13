# EVALUHR — LEGAL MASTER PACKAGE · 00 · MASTER LEGAL DOSSIER
# EXPEDIENTE JURÍDICO INTEGRAL PARA REVISIÓN PROFESIONAL

## 0. Estatus del paquete

| Campo | Valor |
|---|---|
| Nombre | EVALUHR — LEGAL MASTER PACKAGE |
| Fecha de compilación | 12–13 de septiembre de 2026 (America/Mexico_City) |
| Estado del sistema | **DEMO EN DESARROLLO — NO EN PRODUCCIÓN** |
| Resultado permitido | READY_FOR_LAWYER_REVIEW / BLOCKED_BY_MISSING_INFORMATION |
| Resultado prohibido | "LEGAL COMPLIANT", "100% LEGAL", "APPROVED" (ninguno se declara) |
| Condición de éxito | **EXPEDIENTE COMPLETO PARA REVISIÓN JURÍDICA PROFESIONAL** → luego: implementación de cambios exigidos por el dictamen |

## 1. Qué es EvaluHR (para el abogado)

SaaS multi-tenant de evaluación de candidatos para procesos de selección laboral (restaurantes/retail, México): invitación por nombre+teléfono con token único → evaluación en pasos (psicológica, conocimientos; psicométrica/integridad en estado legacy/aislado) → resultados con orientación informativa (PERFIL_COMPLETO/PERFIL_PARCIAL/PENDIENTE) → agendamiento de entrevista.

**NO hay candidatos reales, NO hay entrevistas reales, NO hay decisiones de contratación reales.** Todo material de prueba está separado de información productiva. El sistema **no decide contratación** (el resultado es insumo complementario para revisión humana de RR.HH.).

## 2. Partes (datos declarados por el proveedor — DOCUMENTACIÓN PENDIENTE donde corresponda)

| Parte | Datos | Verificación |
|---|---|---|
| **PROVEEDOR / EVALUA HR** (titular del sistema) | Moisés Gallegos Trujillo · RFC GATM7010257U6 · Capistrano 364, Col. El Campanario, CP 29057, Tuxtla Gutiérrez, Chiapas · Cargo: Director | Datos declarados; constancias no incluidas — DOCUMENTACIÓN PENDIENTE |
| **CLIENTE DE REFERENCIA DEL DEMO** (presunta responsable) | ALIMENTOS PAPO · RFC APA240229EA9 · Blvd. Belisario Domínguez 171 Sn, ISSSTE, Tuxtla Gutiérrez, Chiapas, CP 29060 · Rep. legal: Manuel Araujo Zenteno (facultades según información contractual disponible) · RR.HH.: Lic. Eva · Notificaciones: restaurantcafedechiapas@gmail.com | Datos declarados; poder/facultades no incluidos — DOCUMENTACIÓN PENDIENTE. **No se presenta esta información como inscripción, certificación ni acreditación gubernamental** |

## 3. Contenido del expediente (32 documentos + 12 matrices)

| # | Documento | Tema (PASO de origen) |
|---|---|---|
| 01 | LEGAL-FRAMEWORK | Marco legal vigente verificado con fuentes oficiales (PASO 3) |
| 02 | DATA-INVENTORY | Mapa completo de datos (PASO 4) |
| 03 | PURPOSES | Matriz de finalidades (PASO 6) |
| 04 | RESPONSIBLE-VS-PROCESSOR | Empresa CLIENTE vs EVALUA HR (PASO 7) |
| 05 | CONSENT | Consentimiento por tratamiento (PASO 11) |
| 06 | PRIVACY-NOTICE | Aviso de privacidad — borrador + brechas (PASO 9) |
| 07 | CANDIDATE-INFORMATION | Información previa al candidato (PASO 10) |
| 08 | MASTER-CONTRACT | Contrato maestro — borrador (PASO 8) |
| 09 | ARCO | Flujo y responsabilidades ARCO (PASO 12) |
| 10 | SENSITIVE-DATA | Datos sensibles + UNINVITED_DISCLOSURE (PASO 5) |
| 11 | NON-DISCRIMINATION | Auditoría + policy (PASO 15) |
| 12 | AI-ANNEX | Anexo de IA (PASO 13) |
| 13 | HUMAN-REVIEW | Revisión humana (PASO 14) |
| 14 | AUTOMATED-DECISIONS | Mapa AUTOMATIZADO/ASISTIDO/HUMAN ONLY (PASO 14) |
| 15 | RETENTION | Retención y eliminación (PASO 22) |
| 16 | SECURITY | Seguridad legal (PASO 23) |
| 17 | SUBPROCESSORS | Subencargados (PASO 24) |
| 18 | INTERNATIONAL-TRANSFERS | Transferencias internacionales (PASO 25) |
| 19 | INCIDENTS-BREACHES | Incidentes y brechas (PASO 26) |
| 20 | INSTRUMENTS | Instrumentos de evaluación (PASO 16) |
| 21 | KNOWLEDGE | Conocimientos (PASO 18) |
| 22 | INTEGRITY | Integridad (PASO 19) |
| 23 | COMPETENCIES | Competencias (PASO 20) |
| 24 | INTERVIEW | Entrevista (PASO 20) |
| 25 | OVERALL-JOBFIT | overallScore / JobFit / recommendation (PASO 21) |
| 26 | CLIENT-EVALUA-RESPONSIBILITIES | Gobernanza y responsabilidades (PASO 27) |
| 27 | LEGAL-OPEN-ITEMS | Asuntos jurídicos abiertos (PASO 31) |
| 28 | LAWYER-QUESTIONS | Preguntas al abogado |
| 29 | LEGAL-OPINION-TEMPLATE | Plantilla de dictamen (vacía) |
| 30 | IMPLEMENTATION-CHECKLIST | Checklist post-dictamen (PASO 32) |
| 31 | AUDIT-CHECKLIST | Auditoría de integridad del paquete (PASO 36) |
| — | 12 CSV en la misma carpeta | Matrices del PASO 29 + GATE-STATUS del PASO 30 |

## 4. Reglas de lectura

1. Todo documento de este paquete es **BORRADOR PARA ABOGADO**; ninguno es definitivo ni aprobado.
2. Cada afirmación sobre el sistema proviene de inspección verificable del repositorio (con rutas); cada afirmación legal proviene de fuentes oficiales citadas con fecha de consulta (12–13/sep/2026). Lo no verificado se marca **NO VERIFICADO** o **LEGAL_REVIEW**.
3. A-06.9 y A-06.11 contienen borradores/reconstrucciones: **no son documentos aprobados** (provenance en `source-index/SOURCE-INDEX.md`).
4. Este paquete NO modifica código, schema, BD, contrato real, aviso real; NO activa entrevistas; NO publica preguntas; NO usa candidatos reales.
