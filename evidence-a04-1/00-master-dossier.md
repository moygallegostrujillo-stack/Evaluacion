# A-04.1 — EXPEDIENTE MAESTRO / MASTER DOSSIER

# EVALUHR — A-04.1 — INVESTIGACIÓN Y SELECCIÓN DEL INSTRUMENTO DE INTEGRIDAD
# SOLO INVESTIGACIÓN Y DOCUMENTACIÓN — NO IMPLEMENTAR (cumplido)

Fecha: 2026-09-10 (America/Mexico_City). Alcance: investigación documental.
Restricciones cumplidas: NO se modificó código, schema, preguntas, scoring, IPIP,
JobFit, contrato, aviso, ni ningún módulo de evaluación existente.

---

## 1. CONTEXTO BEFORE (estado de EvaluHR al iniciar esta fase)

- El demo ya genera por defecto una plantilla INTEGRIDAD para cada posición
  (src/lib/generate-templates.ts: `Evaluation de Integridad`, tipo INTEGRIDAD,
  "dato sensible, orientativo") con ítems propios en categoría INTEGRITY_HONESTY,
  declarados "orientative, never auto-filter", y filtrados por consentimiento
  (KNOWLEDGE_ONLY nunca la ve — EvaluationView.tsx).
- Diagnóstico: el módulo existe como demo pero **carece de fundamento de
  instrumento**: ítems caseros, sin control de deseabilidad, sin validación
  externa, sin definición formal de constructo.
- Esta fase NO toca ese código; entrega la base documental para decidir su futuro.

## 2. OBJETIVO Y MÉTODO

- Objetivo (spec A-04.1): determinar si EvaluHR debe incorporar una evaluación de
  integridad y, en caso afirmativo, qué instrumento/metodología es más adecuada.
- Método: búsqueda web estructurada (CLI web_search), lectura de fuentes primarias
  (CLI page_reader; curl de respaldo), verificación de derechos en sitios
  oficiales, revisión de literatura meta-analítica, y búsqueda específica de
  evidencia mexicana. Registro completo de fuentes en 12-limitations.md.

## 3. HALLAZGOS CENTRALES

1. **"Integridad" no es un constructo único** (01): honestidad, integridad laboral,
   CWB, confiabilidad, cumplimiento, ética y riesgo son distintos. El módulo debe
   declarar explícitamente qué mide.
2. **Tipos de prueba** (02): overt (máximo riesgo de faking: d=0.90/1.32),
   personality-based (menor riesgo; evidencia alta), SJT (buen complemento),
   CWB como criterio, híbridos.
3. **Existe base legalmente limpia**: IPIP es dominio público verificado (copiar,
   traducir, usar, sin permiso) e incluye representaciones HEXACO (IPIP-HEXACO,
   Ashton & Lee 2007) con el factor Honesty-Humility — el candidato base más sólido
   para EvaluHR (03, 06).
4. **La clase de instrumentos tiene evidencia criterio real** (04): meta 1993
   (665 coeficientes; ρ ≈ .41 desempeño, ≈ .47 CWB), con debate académico vivo
   (re-examen 2012 vs réplica) y meta 2023 positivo para workplace deviance.
5. **México: NOT ESTABLISHED** (05): sin validación pública mexicana de un
   instrumento de integridad; existen versiones en español (CWB-C AR; HEXACO ES)
   y proveedores comerciales MX sin manuales públicos.
6. **Derechos** (06): solo IPIP/IPIP-HEXACO = PUBLIC DOMAIN; CWB-C = gratis
   condicionado (no comercial); HEXACO oficial = comercial UNKNOWN (contactar
   autores); Reid Report = discontinuado (verificado); PSI = UNKNOWN; el resto =
   commercial. Ningún costo público sin cotización → ningún precio inventado.
7. **Riesgos controlables bajo un modelo de indicador** (08): faking, falsos
   positivos, sobreinterpretación y datos delicados exigen: sin vetos automáticos,
   revisión humana, exclusión de ítems de drogas/violencia, adaptación local.
   Jurídico: todo queda REQUIERE REVISIÓN LEGAL.
8. **IA** (09): solo borradores/indicadores; nunca autoridad psicométrica ni
   decisión. Alineado con gobernanza A-03.x.

## 4. DECISIÓN RECOMENDADA (11)

- **OPTION A — Indicador de Integridad Laboral (fase piloto)** sobre base
  IPIP-HEXACO (dominio público) + SJT propio en borrador, con CWB-C (condicionado)
  como criterio de validación interna. Indicador **separado** de overallScore y
  JobFit (mismo patrón de separación aprobado en A-03.5); revisión humana
  obligatoria; aplicación por puesto.
- Estado: **GO-WITH-CONDITIONS** (7 condiciones C1–C7, incl. revisión legal,
  adaptación mexicana y piloto de validación). Sin condiciones cumplidas → NO-GO.

## 5. ÍNDICE DEL EXPEDIENTE

| Archivo | Contenido | PASO |
|---|---|---|
| 00-master-dossier.md | Este documento | 18 |
| 01-integrity-construct.md | Constructos de integridad | 1 |
| 02-test-types.md | Tipos de pruebas (A–E) | 2 |
| 03-candidate-instruments.md | Candidatos reales (12 fichas) | 3 |
| 04-scientific-evidence.md | Evidencia científica + selección laboral | 6, 7 |
| 05-mexico-evidence.md | Evidencia México (NOT ESTABLISHED) | 8 |
| 06-rights.md | Dominio público y licencias | 4, 9 |
| 07-commercial-options.md | ≥3 comerciales (6 documentadas) | 5 |
| 08-risk-analysis.md | Riesgo metodológico + jurídico conceptual | 10, 11 |
| 09-ai-boundaries.md | Límites IA | 12 |
| 10-comparison.csv | Comparación (13 alternativas, 13 columnas) | 13 |
| 11-recommendation.md | NO-implementar, desarrollo propio, recomendación, estado | 14–17 |
| 12-limitations.md | Limitaciones + registro de fuentes | 19 |
| 13-audit-checklist.md | Checklist 15/15 | 20 |

## 6. VERIFICACIÓN DE REGLA FINAL

- NO se modificó código ✔ (cero edits en src/, prisma/, api/).
- NO se modificó schema ✔. NO se modificó IPIP (módulo) ✔. NO KNOWLEDGE ✔.
- NO COMPETENCIAS ✔. NO JOBFIT ✔. NO CONTRATO ✔. NO AVISO ✔.
- NO IMPLEMENTAR (ningún cambio funcional) ✔.

## 7. ESTADO FINAL

**GO-WITH-CONDITIONS para OPTION A** — ver 11-recommendation.md y
13-audit-checklist.md. Este expediente cierra la fase A-04.1; la implementación
requiere una fase nueva tras cumplir condiciones.
