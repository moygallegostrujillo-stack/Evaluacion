# A-04.4 — 11 · ESTADO METODOLÓGICO E IMPACTO (PASO 14 + PASO 15)

Clasificación de cada componente según la **evidencia REAL actual del repositorio** (`main@b5dcfb6`, árbol limpio). Escala: APPROVED · LIMITED · INSUFFICIENT · CONTRADICTED · NOT IMPLEMENTED.

---

## 1. Clasificación metodológica (PASO 14)

| Componente | Estado | Justificación basada en evidencia real |
|---|---|---|
| **PERSONALITY** | **INSUFFICIENT** | Instrumento real = Big Five demo propio (`BIG_FIVE_QUESTIONS`, 10 ítems, 2/dim, generate-templates L10); sin citación, baremos, versionado ni validación (AUDITORIA L17/L111/L123); IPIP-50-MX NO IMPLEMENTED (02). Pesa 0.25–1.00 en el overall. |
| **KNOWLEDGE** | **LIMITED** | Motor canónico correcto y único para ambos flujos (7/7 modelos; INSUFFICIENT→null; registro de evidencia separado) — el mejor componente del sistema. Recibe LIMITED, no APPROVED, porque: (a) la capa LEGADA sigue activa con `?? 0` público (infla) y 0% interno (castiga) — contradice INSUFFICIENT≠0; (b) el overall interno usa claves vivas antes del override canónico; (c) sin expediente de validación de ítems en disco. |
| **INTEGRITY** | **INSUFFICIENT** (con contradicción normativa activa) | 10 ítems demo sin validación ni deseability (AUDITORIA L114); `integrityScore` escalar NOT NULL default 0 — SIN estado INSUFFICIENT/evidence-status; sin embargo pondera el overall (0.15–1.00). Contradice A-04.1 C4 y A-04.2 GATE-10 (deuda documentada, persistente). |
| **OVERALL SCORE** | **CONTRADICTED** | 4 fórmulas divergentes activas (05) con renormalización oculta; contradice normas propias del proyecto (A-03.5 en la capa legada, A-04.1 C4, A-04.2 GATE-10, flag "orientative", AUDITORIA L19 «pesos sin justificación psicométrica»); sin expediente metodológico de pesos; el mismo candidato obtiene distintos overall por canal/ruta. |
| **JOBFIT** | **NOT IMPLEMENTED** | No existe como entidad (grep = 0; solo documentación). Riesgo: el overallScore visible puede operar como JobFit de facto (R3/R4). |
| **RECOMMENDATION** | **LIMITED** | Guidance de completitud sin umbrales de score (correcto y consistente en F1/F3); disclaimers LFPDPPP Art. 37 Bis; sin auto-filtro ni ordenamiento. Recibe LIMITED por: (a) definición de PERFIL_COMPLETO distinta en video (sin INT); (b) overall/recommendation STALE tras retiro de consentimiento (consent L413); (c) campo hereda el nombre `recommendation` con semántica de guidance (confusión de contrato). |

## 2. Matriz de impacto de contradicciones (PASO 15)

| # | Contradicción / hallazgo | Seguridad | Metodología | Legal | Producto | Trazabilidad | Scoring | Severidad |
|---|---|---|---|---|---|---|---|---|
| 1 | Integridad sin validación pondera el overall (0.15–1.00) | — | ●●● | ●●● | ●● | ●● | ●●● | **CRITICAL** |
| 2 | 4 fórmulas overall divergentes; video SOBREESCRIBE (sin INT, N re-invertido, /5 fijo, renormalización proporcional) | — | ●●● | ●● | ●●● | ●●● | ●●● | **HIGH** |
| 3 | Capa legada Knowledge: `?? 0` público infl; 0% interno castiga | — | ●● | ● | ● | ●● | ●●● | **HIGH** |
| 4 | Overall interno pre-canónico (claves vivas vs knowledgeScore canónico en la misma fila) | — | ●● | ● | ● | ●●● | ●● | **MEDIUM** |
| 5 | `integrityScore @default(0)` NOT NULL — 0 = ausente ≡ peor puntaje | — | ●● | ●● | ● | ●● | ●● | **MEDIUM** |
| 6 | PERFIL_COMPLETO sin INT en video vs con INT en flujos | — | ●● | ● | ●● | ● | ● | **MEDIUM** |
| 7 | Overall/recommendation STALE tras retiro de consentimiento (sensibles reseteados, global conserva mezcla) | ● | — | ●● | ● | ●● | ● | **MEDIUM** |
| 8 | `results/route.ts` L198: media del dashboard con `knowledgeScore \|\| 0` | — | ● | — | ● | ● | ● | **MEDIUM** |
| 9 | Imputación null→3 en LIKERT sin documento metodológico | — | ● | — | — | ● | ● | **LOW** |
| 10 | Redondeo KN entero (interno) vs 2 dec (público) | — | ● | — | — | ● | ● | **LOW** |
| 11 | Params muertos en F1 (positionCategory/hasKnowledgeTest) — superficie engañosa | — | — | — | — | ● | — | **LOW** |
| 12 | Fallbacks de categoría silenciosos (apply L439/468/497) | — | ● | — | — | ● | ● | **LOW** |
| 13 | Contradicción A-01.2 (IPIP) — cadena de auditoría con reclamo no respaldado | — | — | — | — | ●● | — | **LOW** |
| 14 | Expedientes A-01.x/A-02.x/A-03.1-3 ausentes del disco | — | — | — | — | ●● | — | **MEDIUM** (trazabilidad de auditoría) |
| 15 | Retention/consent zeroing | — | — | — | — | — | — | **INFO** (legítimo, documentado) |

Leyenda: ●●● alto · ●● medio · ● bajo. «Legal» = exposición LFPDPPP Art. 37 Bis (decisión basada en instrumento no validado) y Art. 8/22 (trato de datos sensibles en puntajes globales).

## 3. Lectura ejecutiva

1. **El único CRITICAL es la Integridad en el overall** — es además la contradicción más fácil de enunciar y la de mayor exposición (método + legal).
2. Los HIGH comparten raíz: **el global no tiene una única definición** ni procedencia; cualquier corrección parcial sin unificar fórmulas deja el síntoma.
3. La **trazabilidad de auditoría** (contradicción A-01.2 + expedientes ausentes) es un riesgo de GOBERNANZA del propio proceso de auditoría, no del producto: se corrige con práctica documental, no con código.
