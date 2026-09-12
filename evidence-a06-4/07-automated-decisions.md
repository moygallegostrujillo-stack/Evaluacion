# A-06.4 — 07 · Decisiones Automatizadas (PASO 7)

## 1. Regla base

> **IA NO puede tomar la decisión laboral.**

La cadena Entrevista → IA → CompetencyResult → JobFit → decisión tiene partes que pueden automatizarse y partes que **deben quedar obligatoriamente bajo revisión humana**.

## 2. Análisis de la cadena

```
Entrevista (humano + IA asiste)
  → IA (transcribe/resume/sugiere)
  → CompetencyResult (humano asigna nivel)
  → JobFit (NO IMPLEMENTADO — fase futura)
  → Decisión (humano: RR.HH.)
```

## 3. Partes automatizables vs humanas

| Etapa | ¿Automatizable? | ¿Revisión humana obligatoria? |
|---|---|---|
| Transcripción de respuesta | ✓ SÍ (IA) | Revisión humana del resumen contra original |
| Resumen estructurado STAR | ✓ SÍ (IA) | Revisión humana (verificar que el resumen refleja la respuesta) |
| Sugerencia de probe | ✓ SÍ (IA) | Humano decide usarlo o no |
| Sugerencia de nivel de evidencia | ✓ SÍ (IA, como sugerencia) | **Humano asigna nivel final** (no IA) |
| Asignación de CompetencyResult | ✗ NO | **Humano obligatorio** |
| Resolución de conflictos | ✗ NO | **Humano obligatorio** |
| JobFit (futuro) | ✗ NO (no existe) | Si se implementa, requiere governance propia |
| Decisión de contratación | ✗ NO | **Humano obligatorio** (RR.HH.) |

## 4. Regla: decisión humana obligatoria

Las siguientes acciones son **exclusivamente humanas**:

1. **Asignación de `evidenceLevel`** (NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG) — el humano asigna con `rationale` textual; la IA solo puede sugerir.
2. **Resolución de conflictos** (PENDING_REVIEW → RESOLVED) — el humano decide; no se promedian fuentes.
3. **Aprobación de CompetencyResult** (status APPROVED) — `approvedBy` humano.
4. **Decisión de contratación** — RR.HH. decide con múltiples fuentes; LFPDPPP/LFT Art 37 Bis (cuando aplique): no es la única base.

## 5. Riesgo de automatización indebida

Si la IA asigna automáticamente niveles sin supervisión humana:
- **Riesgo**: decisión automatizada sin base jurídica (LFPDPPP Art 22 bis / reformas 2025 REQUIEREN REVISIÓN LEGAL).
- **Riesgo**: sesgo de IA se propaga a la decisión.
- **Riesgo**: imposibilidad de explicar la decisión al candidato (derecho de explicación).

**Mitigación**: la cadena SIEMPRE incluye `reviewedBy` humano entre la IA y el CompetencyResult. No existe ruta IA → CompetencyResult sin revisión humana intermedia.

## 6. Prohibición explícita

> **Prohibido**: cualquier función que asigne automáticamente `evidenceLevel` o que produzca una "puntuación jurídica o psicológica no autorizada" sin intervención humana.

La IA puede sugerir ("basado en la respuesta, parece SUPPORTED"), pero la asignación final requiere `reviewedBy` humano con `rationale`.

## 7. Conexión con gates

La prohibición de decisiones automatizadas pasa LEGAL-G7 (Decisión humana). Sin revisión humana documentada en la cadena, el CompetencyResult no es válido.
