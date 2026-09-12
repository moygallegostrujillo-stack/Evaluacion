# EVALUHR — A-06.9
# PAQUETE JURÍDICO DE ENTREVISTA — MASTER DOSSIER

> **BORRADOR PARA REVISIÓN LEGAL PROFESIONAL. NO CONSTITUYE VERSIÓN DEFINITIVA.**
> Fecha: 2026-09-13 (America/Mexico_City). Base: hallazgos A-06.4 y A-06.8 (re-verificación
> normativa 2026-09-12/13). **Ningún documento de este paquete está aprobado.**

---

## 1. Objeto

Convertir los hallazgos legales de A-06.4 (legal & privacy) y A-06.8 (legal readiness) en un
paquete jurídico concreto —BORRADORES— para revisión de abogado antes de cualquier uso.
**NO implementar, NO activar, NO publicar, NO aprobar.**

## 2. Identidad de las partes (PASO 1 — datos tal como fueron proporcionados)

| Parte | Dato | Valor |
|---|---|---|
| **EVALUA HR** (titular / proveedor) | Titular | Moisés Gallegos Trujillo |
| | RFC | GATM7010257U6 |
| | Domicilio | Capistrano 364, Col. El Campanario, CP 29057, Tuxtla Gutiérrez, Chiapas |
| | Cargo | Director Moisés Gallegos Trujillo |
| **ALIMENTOS PAPO** (cliente del demo / responsable) | RFC | APA240229EA9 |
| | Domicilio | Boulevard Belisario Domínguez 171 Sn, Col. ISSSTE, CP 29060, Tuxtla Gutiérrez, Chiapas |
| | Representante | Manuel Araujo Zenteno — facultades **según la información contractual proporcionada** (pendiente de verificación por el abogado — `16-legal-open-items.md`) |
| | Área / contacto | Recursos Humanos — Lic. Eva |
| | Correo para notificaciones | restaurantcafedechiapas@gmail.com |

**Nota**: los datos se reproducen tal cual fueron proporcionados para el demo. La verificación
fiscal de RFC, la acreditación de facultades del representante y la identificación completa de la
razón social son **asuntos abiertos para el abogado** (16).

## 3. Alcance documental del paquete

| # | Documento | Archivo | Estado |
|---|---|---|---|
| 1 | Contrato Maestro Empresa ↔ EvaluHR (borrador íntegro A-06.9) | `02-contract-draft.md` | BORRADOR |
| 2 | Aviso de Privacidad — proceso de selección / entrevista | `03-privacy-notice-draft.md` | BORRADOR |
| 3 | Consentimiento / información previa del candidato | `05-consent-draft.md` | BORRADOR |
| 4 | Información previa al candidato (documento legible) | `04-candidate-information.md` | BORRADOR |
| 5 | Anexo IA | `06-ai-annex.md` | BORRADOR |
| 6 | Anexo revisión humana | `07-human-review-annex.md` | BORRADOR |
| 7 | Protocolo datos sensibles (cláusula) | `08-sensitive-data-protocol.md` | BORRADOR |
| 8 | Cláusula de conservación | `09-retention-clause.md` | BORRADOR |
| 9 | Proveedores / subencargados | `10-subprocessors.md` | BORRADOR |
| 10 | ARCO | `11-arco.md` | BORRADOR |
| 11 | Seguridad (descripción jurídica) | `12-security.md` | BORRADOR |
| 12 | No discriminación (cláusula de uso) | `13-nondiscrimination.md` | BORRADOR |
| 13 | Limitaciones del sistema | `14-limitations.md` | BORRADOR |
| 14 | Modelo de responsabilidades | `15-responsibility-model.md` | BORRADOR |
| 15 | Base legal de redacción | `01-legal-basis.md` | Referencia |
| 16 | Puntos abiertos SOLO-ABOGADO | `16-legal-open-items.md` | LISTA CERRADA |
| 17 | Checklist de verificación | `17-audit-checklist.md` | 23/23 |

Matrices CSV: `contract-change-matrix.csv`, `privacy-notice-change-matrix.csv`,
`candidate-information-matrix.csv`, `legal-requirements.csv`,
`client-evalua-legal-responsibilities.csv`.

## 4. Estado real de los documentos existentes (insumo verificado)

| Documento existente | Estado verificado en A-06.9 |
|---|---|
| Contrato maestro Empresa ↔ EvaluHR | **No existe documento de contrato maestro en el repositorio**; el alcance se conoce por las matrices A-06.4 (`18-contract-impact.md`) y A-06.8 (`13-contract-impact.md`). El borrador 02 se prepara como versión íntegra nueva, **sin destruir ni sustituir documento alguno**. |
| Aviso de privacidad vigente | Generado por `src/lib/privacy-notice.ts`, versión **2026-01-v2**, 27 secciones, orientado a evaluaciones psicométricas/psicológicas/de integridad. Detectado: menciona **INAI (7 veces)** — desactualizado tras la reforma 2025 (SABG); "entrevista" aparece **1 vez** — no cubre la entrevista estructurada; sin anexo de IA estructurado. **NO se modifica el archivo ni la versión vigente** (regla absoluta); el borrador 03 es un documento NUEVO y separado. |
| Consentimiento en plataforma | Existe flujo/versión técnica (`src/lib/consent-version.ts`) para evaluaciones vigentes. **NO se modifica**; el borrador 05 es un documento nuevo para el proceso de entrevista. |

## 5. Reglas transversales del paquete

1. Todo documento inicia con el banner BORRADOR PARA REVISIÓN LEGAL PROFESIONAL.
2. No se afirma certificación, registro, autorización, validez jurídica ni cumplimiento absoluto.
3. No se inventan situaciones jurídicas; lo no confirmable va como **SUJETO A REVISIÓN LEGAL**.
4. No se copian grandes bloques de legislación; cita puntual con fuente; la numeración exacta de
   la Nueva LFPDPPP 2025 queda como **[LEGAL_REVIEW]** (A-06.8 `02-current-law.md` §1).
5. Empresa cliente = responsable de finalidad y decisión laboral; EvaluHR = proveedor/encargado
   tecnológico y operativo, según el tratamiento concreto (PASO 4 — sin cambios sin justificación).

## 6. Resultado (resumen para la entrega final)

1. Contrato: borrador íntegro de 30 cláusulas — PENDIENTE DE ABOGADO.
2. Aviso: borrador específico para entrevista — PENDIENTE DE ABOGADO.
3. Consentimiento: borrador independiente candidato — PENDIENTE DE ABOGADO.
4. Información al candidato: documento legible separado del contrato — BORRADOR.
5. IA: anexo con listas cerradas puede/no puede — BORRADOR.
6. Revisión humana: flujo EVIDENCIA→REVISIÓN HUMANA→RESULTADO — BORRADOR.
7. Datos sensibles: protocolo de revelación involuntaria contractualizado — BORRADOR.
8. Conservación: cláusula flexible con [PLAZO POR DICTAMEN] — BORRADOR.
9. Transferencias: proveedores SUJETOS A CONFIGURACIÓN (ninguno confirmado) — BORRADOR.
10. ARCO: arquitectura existente alineada sin cambios de código — BORRADOR.
11. Seguridad: descripción jurídica SIN certificaciones — BORRADOR.
12. Responsabilidades: matriz cliente/EvaluHR en CSV — BORRADOR.
13. Puntos abiertos: lista cerrada de 14 asuntos SOLO-ABOGADO (16).
14. **GO** para entregar el paquete al abogado · **NO-GO** para aprobar/usar/firmar/implementar.
