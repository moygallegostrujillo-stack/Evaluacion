# LAWYER-README — GUÍA DE LECTURA PARA EL ABOGADO
# EVALUHR — LEGAL MASTER PACKAGE (compilado 12–13/sep/2026)

## 1. ¿Qué es EvaluHR?

SaaS multi-tenant en desarrollo (Next.js) que apoya procesos de selección laboral de empresas mexicanas (restaurantes/retail): invita candidatos por nombre+teléfono con token único, aplica evaluaciones (psicológica, conocimientos; Big Five e integridad en estado legacy/aislado), presenta resultados **orientativos** y permite agendar entrevistas.

## 2. ¿Qué hace y qué NO hace?

- **HACE**: gestión de invitaciones; aplicación de evaluaciones; cálculo de puntuaciones técnicas (overallScore excluye por diseño Big Five e integridad); etiqueta de completitud (PERFIL_COMPLETO/PARCIAL/PENDIENTE); evidencia de consentimiento (ConsentLog con hash del aviso); gestión ARCO (API con plazo de 20 días hábiles); bitácora de auditoría; retención/anonimización programada.
- **NO HACE**: no decide contratación; no entrevista estructurada (solo agendamiento; el diseño BDI/STAR está pendiente de dictamen con G7 = NO APPROVED); no graba/almacena video; no posee JobFit (no implementado); no publica preguntas; no recolecta datos de salud/religión/etc.

## 3. Estado de desarrollo

**DEMO EN DESARROLLO — NO EN PRODUCCIÓN.** No existen candidatos reales, entrevistas reales ni decisiones de contratación reales. Infraestructura productiva preparada pero no activada (RLS de PostgreSQL "NOT EXECUTED. PREPARATION ONLY").

## 4. Qué documentos contiene el paquete

| Carpeta/archivo | Contenido |
|---|---|
| `evidence-LEGAL-MASTER/` (32 md + 12 csv) | Expediente integral: marco legal verificado, inventario de datos, finalidades, roles, consentimiento, aviso, contrato, ARCO, sensibles, no discriminación, IA, decisiones automatizadas, retención, seguridad, subencargados, transferencias, incidentes, instrumentos (Knowledge/Integrity/Competencias/Entrevista/overall-JobFit), responsabilidades, asuntos abiertos, preguntas, plantilla de dictamen, checklist de implementación, checklist de integridad |
| `source-index/` | Provenance de todas las fuentes (expedientes A-0x y documentos del repo) |
| `existing-documents/` | Aviso de privacidad vigente (PDF), auditoría técnica previa, borradores legales A-06.11 |
| `legal-matrices/` | Copia de las 12 matrices CSV |
| `law-sources/` | Evidencia de verificación del marco legal (JSONs de búsqueda + informe con URLs y fechas) |
| `open-items/` | Asuntos jurídicos abiertos (28, sin duplicados) |
| `implementation-checklist/` | Trabajo técnico post-dictamen (LEGAL-001..025 — preparado, NO ejecutado) |
| `LAWYER-REVIEW-RESPONSE.md` | Plantilla de respuesta del abogado |
| `manifest.csv` / `SHA256SUMS.txt` | Inventario y hash de integridad del paquete |

## 5. Qué debe revisar el abogado (prioridad sugerida)

1. **Marco vigente** (01): la nueva LFPDPPP (DOF 20-mar-2025) y la nueva LFT (DOF 15-ene-2026) cambian el régimen citado por los documentos actuales del sistema.
2. **Roles y contrato** (04, 08): no existe contrato real; el modelo responsable/encargado requiere dictamen por tratamiento.
3. **Aviso y consentimiento** (05, 06): el PDF público está desalineado con el marco 2025 y con el aviso in-app; requiere consolidación.
4. **Datos y sensibles** (02, 10): incluida la duda de `candidateAge`.
5. **Transferencias/subencargados** (17, 18): sin acuerdos; regiones por confirmar.
6. **Automatización** (13, 14, 25): tesis de intervención humana frente al art. 26.
7. **Instrumentos** (20–24): sin validez afirmada; integridad/Big Five en decisión de continuar o retirar; entrevista con G7 NO APPROVED.

## 6. Blockers principales (resumen de 27)

OLI-001 (sin contrato) · OLI-002/015 (aviso desalineado e incoherencia de transferencias) · OLI-003 (formas de consentimiento) · OLI-013 (subencargados) · OLI-006 (sensibles) · OLI-024 (G7 entrevista).

## 7. Cómo devolver observaciones

1. Llene `LAWYER-REVIEW-RESPONSE.md` (un bloque por issue: ID/DECISION/LEGAL BASIS/REQUIRED CHANGE/PRIORITY/IMPLEMENTATION NOTE/FOLLOW-UP).
2. IDs de referencia: preguntas PQ-01..26 (`legal-question-matrix.csv`), abiertos OLI-001..028 (`open-items/`), cláusulas CTR del contrato (08), elementos de aviso (06).
3. DECISION válidas: APPROVE / APPROVE_WITH_CHANGES / REJECT / NEEDS_MORE_INFORMATION.
4. El dictamen prevalece sobre cualquier documento del paquete; los documentos se re-versionan (append-only).

## 8. Nota de honestidad

Este paquete **no declara** que el sistema sea "legal", "compliant" ni "aprobado". Su condición de éxito es ser **expediente completo para revisión jurídica profesional**. Los números de artículo marcados POR CONFIRMAR requieren cotejo final contra los textos oficiales vigentes.
