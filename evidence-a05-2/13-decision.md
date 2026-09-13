# A-05.2 — 13 · DECISIÓN V1 (PASO 15, 16, 17)

## 1. InstrumentResult conceptual (PASO 15)

Para la opción recomendada, el resultado de personalidad se define conceptualmente como:

```
InstrumentResult {
  instrumentName: string          // e.g. "IPIP-50-MX" o "EXPERIMENTAL-DEMO"
  instrumentVersion: string       // e.g. "IPIP-50-v1" o "DEMO-v0"
  scoringVersion: string          // e.g. "LIKERT-5-NORM-v1"
  evidenceStatus: VALID | LIMITED | INSUFFICIENT | INVALID | NOT_APPROVED | EXPERIMENTAL
  dimensions: { openness, conscientiousness, extraversion, agreeableness, neuroticism }  // 0-100
  includedItems: string[]
  excludedItems: string[]         // e.g. sin respuesta
  computedAt: timestamp
  formulaVersion: string          // versión técnica de la fórmula de scoring
}
```

**Regla**: InstrumentResult **NO se conecta** a JobFit, overallScore, ni recommendation. Es un registro de evidencia separado (como KnowledgeResult en A-03.5). La conexión a decisiones globales queda bloqueada hasta que el instrumento pase PERSONALITY-G1..G10.

---

## 2. Decisión única (PASO 16)

> **ELECCIÓN: OPTION E — NO IMPLEMENTAR PERSONALIDAD EN V1.**

### 2.1 Razón de la decisión

Ningún instrumento de personalidad tiene evidencia **ESTABLISHED en México** (ver `08-mexico-evidence.md`):

| Instrumento | MX | ¿Apto V1 formal? |
|---|---|---|
| Big Five demo | NOT_ESTABLISHED | NO (además: fuente UNKNOWN, derechos UNKNOWN) |
| IPIP-50-MX | NOT_ESTABLISHED | NO sin validación propia |
| Mini-IPIP | NOT_ESTABLISHED | NO sin validación propia |
| BFI-10 | NOT_ESTABLISHED (Reyes Zamorano 2014 explícito) | NO + comercial restringido |
| NEO-PI-R | UNKNOWN (comercial) | NO para V1 (costo, cualificación) |
| Hogan HPI | UNKNOWN (comercial) | NO para V1 (partner, propietario) |

A-04.5 governance rule: un instrumento con evidencia INSUFFICIENT/NOT_APPROVED **no** alimenta decisiones globales (overallScore). Dado que ningún instrumento tiene evidencia MX ESTABLISHED, **ninguno puede alimentar overallScore en V1 sin violar la gobernanza**.

LFPDPPP proporcionalidad: usar un instrumento no validado en la población objetivo para decisiones laborales es desproporcionado.

### 2.2 Por qué NO OPTION A/B/C/D

- **OPTION A (IPIP-50-MX)**: CONDITIONAL, no READY — requiere traducción ITC 2017 + EFA/CFA + α + baremos MX (meses de trabajo). No es una decisión V1 ship-ready.
- **OPTION B (Mini-IPIP)**: misma condición — requiere validación MX.
- **OPTION C (otra alternativa)**: BFI-10 es NOT_RECOMMENDED (comercial restringido + 2 ítems/dim); no hay otra alternativa pública claramente superior.
- **OPTION D (comercial)**: NOT_RECOMMENDED para V1 (costo, cualificación, dependencia).

### 2.3 Por qué OPTION E

OPTION E es la única decisión **defensible y honesta** para V1 porque:
1. **No afirma validez que no existe** — respeta la regla de no-sobreafirmación.
2. **No introduce riesgo metodológico** (sin instrumento no validado ponderando overallScore).
3. **No introduce riesgo legal** (sin dato sensible sin proporcionalidad).
4. **Respeta la gobernanza A-04.5** (NOT_APPROVED no alimenta global).
5. **Permite que V1 se enfoque en lo sólido** (Knowledge canónico + Integrity aislada + Psychology).

---

## 3. Condiciones (PASO 17)

OPTION E es **incondicional** para V1: no requiere validación, ni traducción, ni baremos, ni revisión legal de un instrumento.

### 3.1 Condición de implementación (no en A-05.2)

La decisión OPTION E implica que la sección PSICOMETRICA (personalidad) debe:
- **NO alimentar `overallScore`** en V1 (aislamiento, como Integrity en A-04.5).
- **Etiquetarse explícitamente** como「indicador experimental, orientativo, sin validez psicométrica establecida」en ConsentView + EvaluationView + CandidateDetailView + CompareView (si se conserva la sección) O eliminarse de V1 (si se elimina).

**Esta condición de implementación NO se ejecuta en A-05.2** (REGLA ABSOLUTA: no modificar código). Requiere una fase de implementación separada (e.g. A-05.3).

### 3.2 Ruta futura (post-V1): OPTION A (IPIP-50-MX) CONDICIONADA

Para una fase post-V1, el objetivo es OPTION A (IPIP-50-MX), CONDICIONADA a pasar PERSONALITY-G1..G10 (ver `14-activation-gates.md`):

- PERSONALITY-G1 Source: ipip.ori.org ✓ (verificado)
- PERSONALITY-G2 Rights: PUBLIC DOMAIN ✓ (verificado)
- PERSONALITY-G3 Translation: traducción siguiendo ITC 2017 (PENDIENTE)
- PERSONALITY-G4 Scientific evidence: ESTABLISHED internacional ✓; validación MX propia (PENDIENTE)
- PERSONALITY-G5 Mexico evidence: NOT_ESTABLISHED (requiere estudio propio)
- PERSONALITY-G6 Workplace use: constructo ESTABLISHED; validez MX PENDIENTE
- PERSONALITY-G7 Legal review: REQUIERE REVISIÓN LEGAL
- PERSONALITY-G8 Governance: definir InstrumentResult + evidenceStatus
- PERSONALITY-G9 Implementation: infraestructura de versionado (como Knowledge)
- PERSONALITY-G10 Regression: tests OS-1..OS-15 equivalentes + regresión

Cuando G1..G10 se superen, IPIP-50-MX puede re-admitirse al `overallScore` con `evidenceStatus=VALID`.

---

## 4. Resumen de la decisión

| Aspecto | Valor |
|---|---|
| Opción elegida | **E — NO IMPLEMENTAR PERSONALIDAD EN V1** |
| Razón principal | Ningún instrumento tiene evidencia MX ESTABLISHED; la gobernanza A-04.5 prohíbe alimentar overallScore con evidencia NOT_APPROVED |
| Condición V1 | Personalidad aislada del overallScore + etiquetada「experimental」(implementación: fase separada A-05.3) |
| Objetivo post-V1 | OPTION A (IPIP-50-MX) condicionada a PERSONALITY-G1..G10 |
| Implementación inmediata | NINGUNA (A-05.2 es solo documentación) |
