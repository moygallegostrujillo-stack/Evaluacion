# EVALUHR — A-06.4 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# AUDITORÍA LEGAL, PRIVACIDAD Y NO DISCRIMINACIÓN DE LA ENTREVISTA ESTRUCTURADA BDI/STAR — SOLO INVESTIGACIÓN + DOCUMENTACIÓN (cumplido)

Fecha: 2026-09-11 (America/Mexico_City). Método: investigación con fuentes oficiales mexicanas
(diputados.gob.mx, gob.mx, dof.gob.mx, stps.gob.mx, conapred.gob.mx) + análisis jurídico secundario
(Justia, Littler, IAPP). Regla: SOLO INVESTIGACIÓN + DOCUMENTACIÓN; NO IMPLEMENTAR; NO MODIFICAR
CÓDIGO/CONTRATO/AVISO. Cierra gates COMP-G8 (A-06.1) e INT-G7 (A-06.3).

---

## 1. MARCO LEGAL

Fuentes oficiales verificadas: LFT (gob.mx); LFPDPPP reformada 2025 (diputados.gob.mx, Littler, IAPP);
LFPEPD (diputados.gob.mx); CONAPRED (conapred.gob.mx, nmx.conapred.gob.mx); NOM-035-STPS-2018
(dof.gob.mx, stps.gob.mx); Constitución Art 1.

Obligaciones clave: no discriminación (LFT Art 3); consentimiento informado (LFPDPPP Art 7);
finalidad específica (Art 6); proporcionalidad (Art 6); derechos ARCO (Art 22); transferencias
(Art 37); datos sensibles consentimiento expreso (Art 7). Detalle: `01-legal-framework.md`.

## 2. FINALIDAD

> "Obtención de evidencia conductual relacionada con las competencias y criterios del puesto específico
> dentro del proceso de selección laboral."

Usos fuera de finalidad prohibidos (perfilado, marketing, scoring no autorizado, retención indefinida).
Uso dentro: CompetencyResult, revisión RR.HH., verificación cruzada, auditoría. Detalle:
`02-purpose.md`.

## 3. DATOS PERMITIDOS

Categorías PERMITIDAS: profesional (A), experiencia (B), formación (C), ejemplos conductuales STAR (D).
CONDICIONAL: referencias (E, con consentimiento), personal no sensible (F, mínimo). Detalle:
`03-data-categories.md`.

## 4. DATOS NO RECOMENDADOS

Domicilio innecesario, aficiones, información personal no relevante al puesto. Detalle:
`03-data-categories.md` categoría F.

## 5. DATOS SENSIBLES

PROHIBIDO en entrevista (salvo BFOQ con consentimiento expreso + revisión legal): edad, género,
embarazo, maternidad/paternidad, estado civil, religión, orientación sexual, identidad de género,
discapacidad, salud, enfermedades, información genética, origen étnico, opinión política,
afiliaciones, situación familiar. 20+ atributos protegidos identificados. Detalle: `04-prohibited-data.md`.

## 6. DISCRIMINACIÓN

Matriz completa de pregunta/categoría con riesgo/motivo/estado/mitigación. Estados: PUBLICABLE /
CONDICIONAL / NO_PUBLICABLE / LEGAL_REVIEW. BFOQ excepcional, restrictivo, caso por caso, NO
automatizable. Detalle: `13-discrimination.md` + `14-bfoq.md`.

## 7. IA

Asiste: transcribir, resumir, sugerir probes, adaptar lenguaje, señalar información faltante.
NO permite: inferir atributos protegidos, inferir personalidad/integridad, inventar evidencia,
decidir nivel/contratación, generar puntuación no autorizada. AI_GENERATED + HUMAN_REVIEWED.
Detalle: `08-ai-boundaries.md` + `07-automated-decisions.md`.

## 8. GRABACIÓN/TRANSCRIPCIÓN

4 modalidades: A (sin grabación, RECOMENDADA V1), B (transcripción, CONDICIONAL con consentimiento),
C (audio, NO RECOMENDADA), D (video, PROHIBIDA V1). Proporcionalidad: mínimo intrusivo. Detalle:
`09-recording-transcription.md`.

## 9. CONSERVACIÓN

Plazo recomendado: 2 años (candidatos no contratados); contratados mientras dure relación laboral +
plazo legal del expediente. Plazo exacto REQUIERE REVISIÓN LEGAL (LFPDPPP 2025). Purge al vencimiento;
suspensión ante queja. Detalle: `10-retention.md`.

## 10. ACCESO

8 roles (CANDIDATO, ENTREVISTADOR, RH, GERENTE, SUPER_ADMIN, REVISOR, SISTEMA, IA) con matriz de
permisos (ver/ver respuestas/revisar/modificar/invalidar/exportar/eliminar). Mínimo privilegio +
auditoría de acceso. IA sin acceso autónomo. Detalle: `11-access-control.md`.

## 11. REVISIÓN HUMANA

Cadena: Evidencia → Revisión humana → CompetencyResult. InterviewReview append-only (reviewer,
reviewDate, evidenceState, observations, conflicts, limitations, decisionContext). Revisión NO
borra evidencia original. Acciones exclusivamente humanas: revisión, confirmación, ampliación,
contradicción, invalidación, cierre. Detalle: `16-human-review.md`.

## 12. RESPONSABILIDADES EMPRESA CLIENTE / EVALUHR

Matriz de 20 actividades: responsable (empresa cliente: finalidad, decisión, aviso) vs encargado
(EvaluHR: plataforma, entrevista, conservación, seguridad técnica). Clasificación contractual
auditable (no cambiada). Detalle: `19-client-evalua-responsibilities.md`.

## 13. IMPACTO CONTRACTUAL

25 cambios necesarios en contrato maestro (finalidad, encargado, datos, conservación, ARCO,
seguridad, brechas, sub-encargados, terminación). NO redactado; solo identificado. Detalle:
`18-contract-impact.md`.

## 14. IMPACTO EN AVISO

12 cambios necesarios en aviso de privacidad (finalidad, datos recopilados, datos sensibles,
consentimiento, destinatarios, transferencias, conservación, ARCO, IA, revisión humana,
contacto). NO redactado; solo identificado. Detalle: `18-contract-impact.md`.

## 15. GATES LEGALES

LEGAL-G1..G10 (Finalidad, Proporcionalidad, Datos personales, Datos sensibles, No discriminación,
IA, Decisión humana, Conservación, Seguridad, Transparencia). Estado: G1-G7, G9 APROBADO (análisis);
G8 (Conservación) + G10 (Transparencia) CONDICIONAL — REQUIERE REVISIÓN LEGAL profesional. Cierran
COMP-G8 e INT-G7. Detalle: `21-gates.md`.

## 16. RIESGOS

3 CRITICAL (discriminación, datos sensibles, decisiones automatizadas), 9 HIGH, 7 MEDIUM, 1 LOW.
Mitigación estructural (gobernanza + proceso + revisión legal). Detalle: `20-risk-analysis.md`.

## 17. ÍNDICE DEL EXPEDIENTE A-06.4

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-legal-framework.md | 1 |
| 02-purpose.md | 2 |
| 03-data-categories.md | 3 |
| 04-prohibited-data.md | 4 |
| 05-proportionality.md | 5 |
| 06-consent-information.md | 6 |
| 07-automated-decisions.md | 7 |
| 08-ai-boundaries.md | 8 |
| 09-recording-transcription.md | 9 |
| 10-retention.md | 10 |
| 11-access-control.md | 11 |
| 12-conflicts.md | 12 |
| 13-discrimination.md | 13 |
| 14-bfoq.md | 14 |
| 15-interviewer-governance.md | 15 |
| 16-human-review.md | 16 |
| 17-traceability.md | 17 |
| 18-contract-impact.md | 18 |
| 19-client-evalua-responsibilities.md | 19 |
| 20-risk-analysis.md | 20 |
| 21-gates.md | 23 |
| 22-audit-checklist.md | 25 |
| interview-legal-question-matrix.csv | 21 |
| client-evalua-responsibility-matrix.csv | 22 |

## 18. AUDITORÍA FINAL

Ver `22-audit-checklist.md` — **26/26 verificadas**.

## 19. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia
(`evidence-a06-4/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**;
sin modificación de contrato, aviso, schema, código. REGLA ABSOLUTA cumplida.
