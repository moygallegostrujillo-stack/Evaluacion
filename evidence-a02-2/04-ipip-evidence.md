# EVALUHR — A-02.2 · PASO 4
# QUÉ EVIDENCIA PRODUCE EL IPIP-50-MX

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. El instrumento permanece congelado en v1.0.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Identidad (fija, heredada de A-01.3)

| Campo | Valor |
|---|---|
| instrumentId | `EVALHR-PERSONALIDAD-IPIP50-MX` |
| instrumentVersion | 1.0 |
| languageVersion | ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA |
| scoringVersion | IPIP50-BFM-1.0 |

---

## 2. Ecuación única de esta fase

> **IPIP-50-MX → evidencia sobre rasgos de personalidad (auto-reporte).**
>
> Y nada más.

Definición del EvidenceRecord típico:

| Campo | Valor |
|---|---|
| `evidenceType` | A — TEST/INSTRUMENTO |
| `category` | PERSONALIDAD |
| `source` | SYSTEM_INSTRUMENT |
| `instrument` | EVALHR-PERSONALIDAD-IPIP50-MX |
| `instrumentVersion` | 1.0 (con languageVersion y scoringVersion del cuádruple identificador) |
| `value` | 5 puntajes brutos por factor (extraversión, amabilidad, escrupulosidad, estabilidad emocional, intelecto) |
| `unit` | RAW_POINTS_10_50 |
| `quality` | HIGH si administración completa y sin anomalías (evidencia de **rasgos**); INSUFFICIENT si hay secciones incompletas (`PARTIAL_RESPONSE`) o falla (`TECH_FAILURE`) |
| `reviewRequired` / `reviewStatus` | Según matriz (PASO 14); lectura siempre como tendencias |
| `approvedBy` | Referencia a la aprobación ex-ante de la pareja criterio↔instrumento (matriz A-02.1) |

La visualización 0–100 sigue siendo `raw/50×100` y **no es percentil**
(nota explícita vigente; herencia A-01.3 sin cambios).

---

## 3. Completitud por factor

- Factor completo = sus 10 ítems respondidos → puntaje bruto válido para ese
  factor.
- Factor incompleto → **no se calcula** y la evidencia del registro se marca
  `INSUFFICIENT` (`PARTIAL_RESPONSE`) para ese constructo; no se imputa ni
  se prorratea.
- El registro completo requiere los 5 factores completos (50/50 ítems).

---

## 4. Lo que esta evidencia ES

- Un registro sólido de **tendencias de respuesta auto-reportadas** en 5
  factores del modelo Big Five, versión mexicana documentada.
- Un insumo de **contexto** para revisión humana, anclable a criterios D
  aprobados mediante HDC cualitativa sin umbral (A-02.1 PASO 4).

## 5. Lo que esta evidencia NO ES (prohibiciones absolutas)

| Prohibido | Estado en A-02.2 |
|---|---|
| IPIP → **desempeño laboral** | ❌ Prohibido. No existe evidencia que lo sostenga. |
| IPIP → **capacidad profesional** | ❌ Prohibido. Constructo distinto. |
| IPIP → **honestidad** | ❌ Prohibido. La Escrupulosidad es un rasgo, no integridad (constructos separados; A-02.1). |
| IPIP → **decisión de contratación** | ❌ Prohibido. Decisión exclusivamente humana (A-02.1 PASO 11). |
| IPIP → **"candidato ideal"** / perfil ideal | ❌ Prohibido. No existen perfiles psicométricos ideales. |
| IPIP → predictor automático | ❌ Prohibido. Ninguna regla convierte un rasgo en filtro o ranking. |
| IPIP → sustituto de entrevista u otra evidencia | ❌ Prohibido. No hay sustitución de constructos. |

Barrido de auditoría: ninguna pieza de A-02.2 define usos del IPIP fuera de
"evidencia sobre rasgos de personalidad".

---

## 6. Coherencia vertical

- **A-01.3**: lenguaje permitido/prohibido del instrumento heredado íntegro;
  resultados fuera de overallScore (exclusión vigente, TEST 10 + E2E).
- **A-02.1**: el IPIP alimenta únicamente criterios D aprobados; sin criterios
  D, sus resultados quedan como *resultado de instrumento sin criterio* y no
  generan áreas de revisión ni interpretación.
- **A-02.2**: el IPIP produce el **único** tipo A activo del sistema, con la
  calidad más alta disponible (`HIGH` como evidencia de rasgos) — sin que ese
  HIGH valide nada más allá del constructo.
