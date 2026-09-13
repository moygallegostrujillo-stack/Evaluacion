# EVALUHR — A-06.11 · 00 · MASTER DOSSIER
# EXPEDIENTE PARA DICTAMEN LEGAL PROFESIONAL — ENTREVISTA BDI/STAR
# ESTATUS: BORRADOR DE AUDITORÍA — NO PRODUCTIVO — NO IMPLEMENTAR — NO ACTIVAR

---

## 0. Identificación

| Campo | Valor |
|---|---|
| Tarea | A-06.11 — Expediente para Dictamen Legal Profesional |
| Objeto | Reunir en un único paquete todo lo necesario para que un abogado mexicano emita el DICTAMEN LEGAL PROFESIONAL |
| Gates que habilita a cerrar | INTERVIEW-G7 + LEGAL-G8 + LEGAL-G10 (solo el abogado puede cerrarlos; este expediente NO los cierra) |
| Estatus del expediente | DRAFT FOR LEGAL REVIEW — todo el contenido es borrador de auditoría |
| Fecha de consolidación | Sesión A-06.11 |
| Productivo | **NO** — nada de este paquete puede activarse, publicarse ni usarse para contratación |

## 1. Contenido del expediente

| # | Documento | Objeto | PASO de origen |
|---|---|---|---|
| 00 | master-dossier (este) | Índice maestro y estado | — |
| 01 | source-index.md | Origen y disponibilidad de cada fuente A-06.1–A-06.10 | PASO 1 |
| 02 | gate-status.md | Tabla única COMP-G1..G10 / INTERVIEW-G1..G10 / LEGAL-G1..G10 | PASO 2 |
| 03 | question-legal-package.md | Auditoría legal de las 10 preguntas candidatas | PASO 3 |
| 04 | probe-legal-package.md | Auditoría legal de los 26 probes | PASO 4 |
| 05 | rubric-package.md | RUBRIC-QUAL-v2-DRAFT + regla de Action | PASO 5–6 |
| 06 | data-inventory.md | Inventario exacto de datos | PASO 7 |
| 07 | sensitive-data.md | Protocolo UNINVITED_DISCLOSURE y datos sensibles | PASO 8 |
| 08 | ai-package.md | Catálogo cerrado IA PERMITIDO/PROHIBIDO | PASO 9 |
| 09 | human-review.md | Cadena de decisión humana | PASO 10 |
| 10 | retention.md | Conservación por categoría | PASO 11 |
| 11 | contract-package.md | 12 elementos contractuales | PASO 12 |
| 12 | privacy-package.md | Contenido exigible del aviso de privacidad | PASO 13 |
| 13 | consent-package.md | Información previa vs manifestación de consentimiento | PASO 14 |
| 14 | responsibility-model.md | EMPRESA CLIENTE / EVALUA HR | PASO 15 |
| 15 | nondiscrimination.md | Matriz final de no discriminación | PASO 16 |
| 16 | bfoq.md | BFOQ como excepción jurídica exclusiva | PASO 17 |
| 17 | arco.md | Mapeo de flujo ARCO | PASO 18 |
| 18 | security.md | Controles de seguridad existentes | PASO 19 |
| 19 | lawyer-questions.md | Lista cerrada de 20 preguntas al abogado | PASO 21 |
| 20 | opinion-template.md | Estructura vacía para el dictamen (NO se inventa) | PASO 22 |
| 21 | audit-checklist.md | Checklist final de 28 ítems | PASO 24 |
| — | legal-opinion-request.csv | Matriz de cuestiones para el abogado | PASO 20 |

## 2. Qué puede hacer el abogado con este expediente

1. Revisar entrevista (método, estructura, duración esperada), preguntas, probes, competencias.
2. Revisar tratamiento de datos, datos sensibles, IA, revisión humana, conservación.
3. Revisar ARCO, contrato, aviso, consentimiento.
4. Revisar responsabilidades Empresa/EvaluHR y no discriminación.
5. Responder la lista cerrada de cuestiones (legal-opinion-request.csv + 19-lawyer-questions.md) con:
   **APPROVE / APPROVE_WITH_CHANGES / REJECT / NEEDS_MORE_INFORMATION**.
6. Emitir el dictamen que habilite cerrar INTERVIEW-G7, LEGAL-G8 y (posteriormente) LEGAL-G10.

## 3. Qué NO hace este expediente

- **NO cierra ningún gate.** INTERVIEW-G7 sigue NO APPROVED; LEGAL-G8 sigue NO APPROVED; LEGAL-G10 sigue NOT EVALUATED. Solo el dictamen legal profesional puede cerrarlos.
- **NO activa la entrevista.** Todos los artefactos (preguntas, probes, rúbrica) permanecen en estado DRAFT / NO PRODUCTIVO. Ningún elemento pasa a ACTIVE ni a PUBLICABLE-PRODUCTIVO.
- **NO modifica código, schema, contrato real, aviso real, IPIP, Knowledge, Integrity, Personality, overallScore, JobFit ni recomendaciones.**
- **NO usa candidatos reales ni produce decisiones laborales.**
- **NO crea scoring, pesos, cortes ni JobFit.**

## 4. Estado de cierre (síntesis)

| Gate | Estado actual | Quién lo cierra |
|---|---|---|
| INTERVIEW-G7 (revisión legal de entrevista) | ✗ NO APPROVED — CRÍTICO | Abogado (dictamen) |
| LEGAL-G8 (dictamen legal profesional) | ✗ NO APPROVED — CRÍTICO | Abogado (dictamen) |
| LEGAL-G10 (validación legal post-piloto) | ✗ NOT EVALUATED | Abogado, después del piloto |
| COMP-G8 / INTERVIEW-G9 | Ver 02-gate-status.md | Piloto no ejecutado (A-06.10) |

## 5. Limitación mayor declarada (transparencia)

Los expedientes A-06.4–A-06.10 **no están materializados en disco** en este entorno. Este paquete se consolidó desde:
1. **evidence-a06-1 / a06-2 / a06-3** — verificados en disco (21 + 19 + 24 archivos).
2. **Registro de auditoría A-06.4–A-06.8** — conclusiones documentadas en la cadena de auditoría (estados, protocolos, contadores 10/26, gates).
3. **A-06.9 y A-06.10 — NO EJECUTADOS**: se incorporan su alcance definido y su estado (pendiente), no sus resultados. Los borradores contractuales/aviso/consentimiento incluidos aquí son reconstrucción DRAFT desde el alcance definido y quedan íntegramente sujetos a LEGAL_REVIEW.

Detalle completo: `01-source-index.md`.

## 6. REGLA ABSOLUTA (reiterada)

NO IMPLEMENTAR · NO ACTIVAR · NO PUBLICAR · NO USAR PARA CONTRATACIÓN · NO MODIFICAR CÓDIGO · NO MODIFICAR SCHEMA · NO MODIFICAR CONTRATO REAL · NO MODIFICAR AVISO REAL · NO DAR G7 POR APROBADO.
