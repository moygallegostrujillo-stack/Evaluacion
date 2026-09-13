# A-05.2 — 11 · RIESGO JURÍDICO/METODOLÓGICO (PASO 14)

## 1. Regla

Evaluar: proporcionalidad · finalidad · transparencia · impacto laboral · riesgo de perfilado · revisión humana. **No inventar artículos.** Cuando corresponda: REQUIERE REVISIÓN LEGAL.

## 2. Marco conceptual (no exhaustivo)

La selección de personal en México opera bajo principios de LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares): licitud, consentimiento, finalidad, proporcionalidad, calidad, lealtad. Art. 37 Bis: el resultado de evaluaciones psicométricas no debe ser la única base para una decisión de selección; se requiere revisión humana.

**Nota**: el alcance exacto de cada artículo debe confirmarse por asesoría legal. A-05.2 no sustituye revisión legal profesional.

---

## 3. Evaluación por eje

### 3.1 Proporcionalidad

| Aspecto | Estado | Riesgo |
|---|---|---|
| Solicitar personalidad (dato sensible potencial) | La personalidad puede ser dato personal sensible; medirla con instrumento no validado es desproporcionado al fin orientativo | MEDIO-ALTO |
| 10–50 ítems vs. finalidad (orientación) | Proporcional si se etiqueta «experimental»; desproporcionado si alimenta decisión | MEDIO |
| V1 con instrumento sin validación MX | DESPROPORCIONADO — usar un instrumento no validado en la población objetivo para decisiones laborales | ALTO |

### 3.2 Finalidad

| Aspecto | Estado | Riesgo |
|---|---|---|
| Finalidad declarada (orientación al reclutador) | COINCIDE con uso actual (guidance, no decisión) | BAJO |
| Si personalidad alimentara overallScore que RH usa | La finalidad se extiende a「decisión informada」sin validez predictiva | MEDIO-ALTO |

### 3.3 Transparencia

| Aspecto | Estado | Riesgo |
|---|---|---|
| Candidato sabe que responde test de personalidad | SÍ (ConsentView menciona Big Five) | BAJO |
| Candidato sabe validez/limitaciones del instrumento | NO — no se informa「instrumento experimental, sin validez establecida」 | ALTO |
| Instrumento identificado (nombre/autor/versión) | NO —「Big Five」es descriptivo; no hay instrumento formal | ALTO |
| Candidato sabe que NO debe ser única base de decisión | NO explícito en consentimiento | MEDIO |

### 3.4 Impacto laboral

| Aspecto | Estado | Riesgo |
|---|---|---|
| La personalidad influencia una decisión de contratación | INDIRECTO — vía overallScore (peso 0.30) mostrado a RH | MEDIO-ALTO |
| Perfilado automatizado | Si overallScore pondera personalidad sin validez, hay riesgo de「perfilado」no fundamentado | ALTO |
| Derecho a explicación (ARCO) | El candidato puede ejercer ARCO; pero explicar「por qué tu overallScore es X」es difícil si la fórmula pondera un instrumento no validado | MEDIO |

### 3.5 Riesgo de perfilado

| Aspecto | Estado | Riesgo |
|---|---|---|
| Existe un「perfil ideal」por puesto | NO (no está codificado) | BAJO |
| El sistema clasifica candidatos por personalidad | NO directamente (recommendation es de completitud) | BAJO |
| El overallScore (que pondera personalidad) clasifica implícitamente | SÍ — RH puede comparar candidatos por overallScore | MEDIO-ALTO |
| Sin validez MX, el perfilado es metodológicamente infundado | SÍ | ALTO |

### 3.6 Revisión humana

| Aspecto | Estado | Riesgo |
|---|---|---|
| RH revisa antes de decidir | SÍ | BAJO |
| APTO/NO_APTO automático eliminado | SÍ (persiste solo en seed obsoleto) | BAJO |
| Art. 37 Bis respetado en diseño | SÍ (guidance, no decisión única) | BAJO |

---

## 4. Riesgos agregados

| Riesgo | Severidad | Mitigación requerida |
|---|---|---|
| Instrumento no identificado formalmente | ALTO | Documentar o sustituir |
| overallScore pondera personalidad sin validez MX | ALTO | Aislar personalidad del overall (como Integrity en A-04.5) |
| Falta de transparencia sobre validez | ALTO | Etiquetar「experimental, sin validez establecida」en UI + aviso |
| Perfilado infundado por overallScore | MEDIO-ALTO | Aislar personalidad; no usar para clasificar |
| Proporcionalidad (instrumento no validado para decisión) | MEDIO-ALTO | REQUIERE REVISIÓN LEGAL |
| Personalidad como dato sensible | MEDIO | REQUIERE REVISIÓN LEGAL sobre estatus |

## 5. Conclusión PASO 14

**3 riesgos ALTO** (instrumento no identificado, overall pondera sin validez, falta de transparencia). Los riesgos ALTO se mitigarían con:
1. Aislar personalidad del `overallScore` (mismo patrón que A-04.5 aplicó a Integrity).
2. Etiquetar explícitamente「experimental, sin validez」en UI + aviso.
3. Sustituir por instrumento formal validado (post-V1).

Proporcionalidad y estatus de dato sensible: **REQUIERE REVISIÓN LEGAL** — A-05.2 no sustituye asesoría legal profesional.

La mitigación más directa y consistente con la gobernanza A-04.5 es **aislar personalidad del `overallScore` en V1** (si se conserva la sección) o **no implementar personalidad en V1** (si se elimina). La decisión se documenta en `13-decision.md`.
