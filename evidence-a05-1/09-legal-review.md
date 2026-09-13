# A-05.1 — 09 · REVISIÓN LEGAL (PASO 10)

## 1. Alcance

Evaluación conceptual de los riesgos legales del uso del instrumento de personalidad actual en el contexto de selección de personal en México. **NO se inventan artículos.** Cuando no pueda determinarse con la evidencia disponible, se declara **REQUIERE REVISIÓN LEGAL**.

## 2. Marco de referencia (conceptual, no exhaustivo)

La selección de personal en México opera bajo:
- LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) — tratamiento de datos personales.
- Principios generales: licitud, consentimiento, finalidad, proporcionalidad, calidad, lealtad.
- Art. 37 Bis (evaluaciones psicométricas en ARCO): el resultado no debe ser la única base para una decisión de selección; se requiere revisión humana.

**Nota**: el alcance exacto de cada artículo debe ser confirmado por asesoría legal. A-05.1 no sustituye revisión legal profesional.

## 3. Evaluación por eje

### 3.1 Transparencia

| Aspecto | Estado | Riesgo |
|---|---|---|
| El candidato sabe que responde una prueba de personalidad | ✅ SÍ — ConsentView menciona «evaluaciones psicométricas (Big Five)» | BAJO |
| El candidato sabe qué se mide (5 dimensiones) | ✅ SÍ — EvaluationView/PublicEvaluationView describen Big Five | BAJO |
| El candidato sabe cómo se usa el resultado | ⚠ PARCIAL — el consentimiento menciona el propósito general, pero no detalla el peso 0.30 en overall ni la ausencia de validez | MEDIO |
| El instrumento está identificado (nombre/autor/versión) | ❌ NO — «Big Five» es descriptivo; no hay instrumento formal, autor, ni versión | ALTO |

### 3.2 Finalidad

| Aspecto | Estado | Riesgo |
|---|---|---|
| La finalidad declarada (orientación al reclutador) coincide con el uso | ✅ SÍ — `recommendation` es guidance, no decisión | BAJO |
| El puntaje crudo se muestra a RH | ⚠ SÍ — candidate detail, comparador, dashboard exponen openness…neuroticism | MEDIO |
| El `overallScore` (que pondera personalidad) se muestra a RH | ⚠ SÍ — dashboard, candidate detail | MEDIO |

### 3.3 Proporcionalidad

| Aspecto | Estado | Riesgo |
|---|---|---|
| 10 reactivos para 5 dimensiones es proporcional al fin declarado (orientación) | ⚠ Cuestionable — 2 ítems/dim produce mediciones ruidosas; proporcional solo si el fin es puramente orientativo | MEDIO |
| Se pide información delicada (personalidad) | ⚠ La personalidad es dato personal sensible en algunas jurisdicciones; LFPDPPP Art. 3 fr. VII incluye «datos personales sensibles» | REQUIERE REVISIÓN LEGAL |

### 3.4 Tratamiento de información delicada

| Aspecto | Estado | Riesgo |
|---|---|---|
| Consentimiento explícito para datos sensibles | ✅ SÍ — ConsentView requiere consentimiento separado para FULL/KNOWLEDGE_ONLY | BAJO |
| Purga/anonimización tras retención | ✅ SÍ — `retention.ts` anonimiza tras 2 años; retiro de consentimiento purga | BAJO |
| Los reactivos elicitan auto-incriminación | ✅ NO para personalidad (a diferencia de Integrity L7–8 que elicitan robo) | BAJO |

### 3.5 Uso en selección

| Aspecto | Estado | Riesgo |
|---|---|---|
| La personalidad es la única base para una decisión | ✅ NO — `recommendation` es guidance; Art. 37 Bis respetado en diseño | BAJO |
| Existe revisión humana | ✅ SÍ — RH toma la decisión final | BAJO |
| El `overallScore` pondera personalidad sin validez predictiva documentada | ⚠ SÍ — peso 0.30 sin evidencia; riesgo de influencia implícita | ALTO |

### 3.6 Revisión humana

| Aspecto | Estado | Riesgo |
|---|---|---|
| RH revisa el resultado antes de decidir | ✅ SÍ | BAJO |
| El sistema no decide automáticamente (APTO/NO_APTO eliminado) | ✅ SÍ | BAJO |

## 4. Riesgos legales agregados

| Riesgo | Severidad | Mitigación requerida |
|---|---|---|
| Instrumento no identificado (sin nombre/autor/versión formal) | ALTO | Documentar el instrumento o sustituir por uno formal |
| `overallScore` pondera personalidad sin validez | ALTO | Aislar personalidad del overall, o documentar la limitación |
| Datos sensibles sin proporcionalidad clara | MEDIO | REQUIERE REVISIÓN LEGAL sobre el estatus de personalidad como dato sensible |
| Transparencia sobre ausencia de validez | MEDIO | Avisar al candidato/RH que el instrumento es orientativo, no diagnóstico |

## 5. Conclusión PASO 10

**2 riesgos ALTO, 2 MEDIO.** Los riesgos ALTO (instrumento no identificado + overall pondera sin validez) requieren acción. La proporcionalidad y el estatus de dato sensible de la personalidad **REQUIEREN REVISIÓN LEGAL** — A-05.1 no sustituye asesoría legal profesional.

Recomendación: si se conserva personalidad en V1, debe etiquetarse explícitamente como «indicador experimental, orientativo, sin validez psicométrica establecida» en el aviso y en la UI de RH, y considerarse aislarla del `overallScore`.
