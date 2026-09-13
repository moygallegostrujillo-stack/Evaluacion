# A-04.4 — 08 · AUDITORÍA DE `/api/public/apply` (PASO 7)

Archivo: `src/app/api/public/apply/route.ts` (1,741 líneas). SOLO LECTURA.

---

## 1. Qué score calcula y cuándo

| Momento | Cálculo | Líneas |
|---|---|---|
| Creación de aplicación | congela knowledge versionado si la vacancia lo tiene (`freezeKnowledgeForApplication`) | L1244 |
| Cada paso completado (1–4) | `calculateStepScores(applicationId, completedStep, …)` → F2 (`calculateScores` por paso) para steps 1–3; bloque propio para step 4 | L411–541; llamadas L448/477/506 |
| Step 4 versionado | `scoreCanonicalAdministration` + `writeKnowledgeResult` (motor único) | L1464–1500 |
| Al completarse (step ≥ 6 o último) | **persiste primero** los scores del paso (`db.vacancyApplication.update`, L1619–1622 — fix de orden A-03.4, comentario L1611–1618), luego `calculateOverallScore(applicationId)` (L1626) y persiste overall/recommendation/summary (L1628–1635) | — |
| Puente a EvaluationResult | crea registro de visibilidad con `integrityScore: updatedApp.integrityScore || 0`, `overallScore: updatedApp.overallScore || 0`, `recommendation || 'PENDIENTE'` | L1697–1721 |

## 2. Instrumentos que participan

| Instrumento | Participación | Evidencia |
|---|---|---|
| Big Five demo | SÍ — step 1 → dimensión del overall | L428–456 |
| Psicológica | SÍ — step 2 | L458–485 |
| Integridad | **SÍ** — step 3 puntúa; el final la pondera (0.15/0.40/0.50/1.00) si `includeIntegridad && integrityScore > 0` | L487–508; L568; L609/L612/L623 |
| Knowledge versionado | SÍ — motor canónico; `knowledgeScore !== null` participa | L1464–1500; L569 |
| Knowledge LEGADO | SÍ — con `correctIdx = vacancyQ ?? systemQ ?? 0` (L524–526) y `correctAnswer ?? 0` (L122): falta de clave → opción 0 correcta | L510–538 |

## 3. ¿Usa Integrity? ¿Usa Knowledge? ¿Ejecuta calculateOverallScore?

- **Integrity: SÍ** (puntúa en step 3 y pondera en F3 según rama; no es auto-filtro).
- **Knowledge: SÍ** — canónico (versionado) y legado (sin versionar) con semánticas divergentes; INSUFFICIENT canónico → null → excluido → renormalizado por rama.
- **calculateOverallScore: SÍ** — función dedicada (L547–670) invocada al completar (L1626), DESPUÉS de persistir los scores del paso (orden corregido por A-03.4).

## 4. Detección de presencia (F3) — comportamiento exacto

- `hasBigFiveData = vacancy.includePsicometrica === true && (alguna dim > 0)` (L558–562)
- `hasPsychData = includePsicologica === true && (alguna dim > 0)` (L563–567)
- `hasIntegrityData = (vacancy.includeIntegridad ?? true) === true && application.integrityScore > 0` (L568) — un 0.00 real cuenta como ausente
- `hasKnowledgeData = application.knowledgeScore !== null` (L569)
- Promedios adaptativos solo con dims `> 0` (L573–580); `avgIntegrity = integrityScore || 0` (L583)

## 5. Riesgos observados (documentados, no corregidos)

1. `?? 0` en claves legadas inflan el KN (contradice INSUFFICIENT≠0 de A-03.5 en la capa legada).
2. `|| 0` / `> 0` convierten 0.00 real en ausencia (INT y video; KN en video).
3. Fallbacks de categoría silenciosos en steps 1–3 (L439/468/497: una pregunta no encontrada puntúa como OPENNESS/EMPATHY/INTEGRITY_HONESTY).
4. Puente a EvaluationResult con `|| 0` defensivos (L1716–1717) — consistente con schema NOT NULL, pero consolida la sobrecarga 0=ausente.
5. El overall final depende del orden persist→compute (correcto hoy); cualquier step que complete sin persistir re-introduciría el bug A-03.4.

## 6. Veredicto

El flujo público SÍ ejecuta un cálculo de overall dedicado (F3) con la misma matriz de pesos que el interno, sobre la fila persistida; usa Integrity y Knowledge; y su capa versionada de Knowledge usa el mismo motor canónico que el interno. Las divergencias reales con el flujo interno provienen de: detección de presencia por `>0`, claves legadas `?? 0`, redondeo de KN (2 dec vs entero) y el overlay de video posterior.
