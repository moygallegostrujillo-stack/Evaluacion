# A-04.4 — 09 · AUDITORÍA DE `/api/evaluations` (PASO 8)

Archivo: `src/app/api/evaluations/route.ts` (1,477 líneas). SOLO LECTURA.

---

## 1. Qué score calcula

`calculateScores()` (F1, def L145–339) sobre las respuestas `EvaluationResponse` de la sesión (incluye `question` vivo, L1342–1347), invocada en L1350–1364. Persistencia en `EvaluationResult` vía upsert unscoped (L1419–1445) y sesión → COMPLETED (L1448–1454).

## 2. Qué instrumentos participan

| Instrumento | Participación | Evidencia |
|---|---|---|
| Big Five demo (PSICOMETRICA) | SÍ | categorías L151; normalización L176–193 |
| Psicológica | SÍ | L195–218 (STRESS invertido 100−x, L206–208) |
| Integridad | **SÍ** (peso real 0.15–1.00) | L234–253; ramas L280–303 |
| Knowledge (legado interno) | SÍ si hay respuestas KNOWLEDGE/MC; estricto: `correctAnswer !== null && selected === correctAnswer` (L227) — sin clave → sin crédito → 0% real que participa | L220–232 |
| Knowledge (canónico) | SÍ — override del campo knowledgeScore para sesiones versionadas | L1375–1393 |

## 3. Particularidades verificadas

1. **Params muertos**: `positionCategory: string` y `hasKnowledgeTest: boolean` se declaran en la firma (L147–148) y se pasan en la invocación (L1362–1363), pero **NUNCA se usan en el cuerpo** — la fórmula no es sensible al puesto ni al flag de conocimiento (verificado por sed/grep del cuerpo).
2. **Overall pre-canónico**: el overall se computa dentro de `calculateScores` (L255–304) usando el KN legacy (claves de la tabla Question VIVA); el override canónico (L1381–1382) cambia solo `scores.knowledgeScore`. Si la clave viva ≠ clave congelada (o el KN legacy difiere del canónico), el `EvaluationResult` muestra un `overallScore` que NO corresponde al `knowledgeScore` canónico expuesto en la misma fila.
3. **KnowledgeResult separado**: se escribe tras el resultado (L1459–1469) con `writeKnowledgeResult` — evidencia aparte del overall (cumple A-03.5).
4. **Consent-gate server-side**: `consentOption === 'KNOWLEDGE_ONLY'` o revocado → rechazo de preguntas sensibles con razón auditable (L916–950); filtrado de plantillas al servirlas (L1267–1271).

## 4. Cómo clasifica PERFIL_COMPLETO / PARCIAL / PENDIENTE

Regla exacta (L310–317) — **sin umbrales de score, solo completitud**:

| Condición | guidance (campo `recommendation`) |
|---|---|
| 0 secciones con datos | `PENDIENTE` |
| BF+PSY+INT+KN todos con datos | `PERFIL_COMPLETO` |
| resto | `PERFIL_PARCIAL` |

«Sección con datos»: ≥1 respuesta en alguna categoría del bloque (BF L193, PSY L218, INT L253) o `knowledgeScore !== null` (L262). El campo se conserva por compatibilidad de DB («value is now guidance», L333).

## 5. Null/0 en este flujo

`|| 3` para LIKERT null (L162); categorías sin respuestas → 0 de display excluido del promedio (L186–188/212–214/247–249); `integrityScore: … : 0` al persistir (L331); `|| 0` de blindaje en salida (L320–329); 0 secciones → overall 0 (L264–265).

## 6. Veredicto

El flujo interno puntúa los 4 instrumentos y pondera Integridad y Knowledge en el overall con la matriz de ramas; su clasificación es de completitud (no de score). Deudas específicas: params muertos, KN legacy estricto→0% y overall pre-canónico frente al override canónico. Nada fue modificado.
