# EVALUHR — A-02.4 · PASO 19
# PROPUESTA FINAL — MODELO DE NIVEL DE AJUSTE (propuesta consolidada)

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: **PROPUESTA** — todos los valores no validados están
> marcados. Requiere aprobación de gobernanza antes de cualquier
> implementación (que será otra fase autorizada).

---

## 1. Arquitectura recomendada

**MODELO C — Híbrido**: `criterio → evidencia → calidad → estado →
cumplimiento → nivel de ajuste` (comparación completa en PASO 2 y
`fit-model-comparison.csv`).

Elegido porque: (a) respeta INSUFFICIENT ≠ 0 por construcción (exclusiones
declaradas, no ceros); (b) formaliza gates para criterios críticos; (c)
hace la compensación explícita y acotada por criticidad; (d) es el único de
los tres que integra las fases A-02.1–A-02.3 sin reescribirlas; (e) máxima
explicabilidad y auditabilidad. **No** fue elegido por facilidad de
implementación (es el más costoso de los tres: ese costo es el precio honesto
de la regla maestra).

## 2. Fórmula conceptual (resumen; detalle en PASO 13)

```
JobFit = 𝒜({ (cᵢ, Kᵢ, sᵢ, qᵢ, corrᵢ) })
  𝒜 = GATES → EXCLUSIONES → PERFIL → TOPES → NIVEL
  - GATES: crítico sin lectura utilizable / conflicto / revisión pendiente
    (o sin criterios/reglas versionadas) ⇒ resultado incompleto (FIN)
  - EXCLUSIONES: sᵢ≠VALID sale del dominio con causa declarada (nunca 0)
  - PERFIL: criterios VALID con (corrᵢ, Kᵢ, qᵢ)
  - TOPES: brecha IMPORTANT ⇒ tope (nunca ALTO) — PROPUESTA
  - NIVEL: ALTO/MEDIO/BAJO por reglas estructurales con umbrales θ
    (SIN DEFINIR — A VALIDAR)
Salida: nivel + explicación completa + exclusiones + áreas + completitud
        + limitaciones + revisión humana   |   o   |   resultado incompleto
```

Parámetros (todos PROPUESTA / SOLO EJEMPLO — NO PRODUCTIVO): wI=2, wS=1,
QualityFactor HIGH=1.0/MEDIUM=0.75, Comp(PARCIAL)=0.5, tope IMPORTANT=MEDIO,
θ_high/θ_low sin definir. **Ningún valor es operativo hasta su validación y
aprobación.**

## 3. Reglas de criticidad

CRITICAL/IMPORTANT/STANDARD declarados en el Criterion Record aprobado
(análisis de puesto, aprobación humana, versión). IA prohibida. Mapeo
PROPUESTA con requiredOrPreferred. Un criterio sin criticidad declarada no
participa. (PASO 3.)

## 4. Compensación

NON-COMPENSABLE (críticos) · PARTIALLY_COMPENSABLE (importantes: tope +
visibilidad) · COMPENSABLE (estándares: exclusión declarada). Compensación
legítima solo con evidencia VALID HIGH/MEDIUM, sin gates, sin cruces de
categoría, siempre explicada. (PASO 5.)

## 5. Gates

Hard gates G1–G6 (crítico sin lectura; conflicto crítico; revisión crítica
pendiente; invalidación de única evidencia crítica; sin criterios; sin
reglas versionadas) → resultado incompleto. Soft gate para importantes
(tope). El gate se recalcula por consolidación; solo se abre con evidencia/
revisión documentada. (PASO 6.)

## 6. Missing data

INSUFFICIENT ≠ 0. Dos lecturas declaradas: **no evaluable** (estructural:
NO_METHOD/NOT_ADMINISTERED/TECH_FAILURE/DECLINED) vs **evidencia
insuficiente** (procedural: PARTIAL_RESPONSE/QUALITY_FAIL/R9). Entrada por
exclusión, tope o gate — nunca por resta ni renormalización. (PASO 4.)

## 7. Conflictos

Protocolo A-02.3 sin cambios: sin resolución matemática; PENDING_REVIEW;
efecto por criticidad (gate si crítico; tope si importante; exclusión si
estándar); cierre solo por revisión humana documentada; recomposición
append-only. (PASO 11.)

## 8. Nivel cualitativo

ALTO/MEDIO/BAJO **conceptualmente apropiados** bajo 5 condiciones (gates
primero; reglas deterministas versionadas; explicación + calificadores
obligatorios; sin mapeo a decisiones; fallback sin niveles disponible).
**Umbrales NO creados todavía** (θ SIN DEFINIR — A VALIDAR). (PASO 9.)

## 9. Score global

**No** en el producto: se recomienda la opción B (nivel cualitativo con
resultado incompleto); el score 0–100 queda **excluido** (falsa precisión,
cortes de facto, ranking, riesgo jurídico); métricas internas M1–M7 son
diagnósticos de proceso, no score del candidato. Fallback válido: opción A
(sin número). (PASOS 7/16.)

## 10. Revisión humana

JobFit es insumo orientativo (P6/P7): EvaluHR compone → RH revisa
(AssessmentReview: confirmar/ampliar/contextualizar/contradecir/descartar) →
Empresa decide. Sin uso decisorio antes de revisión; salida no modificable
retroactivamente; `fitRulesVersion` en cada consolidación. (PASOS 13 de
A-02.3, 17/19 de este dossier.)

---

## Condiciones para pasar de PROPUESTA a operativo (camino de validación)

| # | Requisito | Estado |
|---|---|---|
| V1 | Aprobación de gobernanza de la arquitectura C y de la opción B | Pendiente |
| V2 | Criticidades reales declaradas en Criterion Records por puesto | Pendiente (requiere puestos reales) |
| V3 | Reglas de correspondencia por criterio (contenido, no solo estructura) aprobadas | Estructura propuesta; contenido pendiente |
| V4 | Validación de θ (umbrales, topes, factores) con datos reales + métricas M1–M10 | Pendiente |
| V5 | Validación de lenguaje de la nueva salida contra P1–P8/X1–X15 | Diseño alineado; validación final pendiente |
| V6 | Implementación como código versionado y auditado (otra fase autorizada) | No iniciada (esta fase NO implementa) |
| V7 | Pruebas de caso A–H ejecutadas sobre datos reales con resultados esperados | Diseño completo en fit-scenarios.md; ejecución pendiente |

**Mientras V1–V7 no se completen, el "Nivel de ajuste" permanece como diseño
propuesto, no como función.**
