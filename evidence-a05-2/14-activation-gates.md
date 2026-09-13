# A-05.2 — 14 · ACTIVATION GATES (PASO 18)

## 1. Sistema de gates

Para que cualquier instrumento de personalidad (objetivo: IPIP-50-MX) sea admitido en `overallScore` o en una decisión global, debe pasar los 10 gates. Modelo inspirado en A-04.2 (Integrity GATE-1..10).

Estados de gate: **NO EVALUADO → APROBADO → FALLADO (NO IMPLEMENTAR)**. Un gate FALLADO → el instrumento no se admite en decisiones globales.

---

## PERSONALITY-G1 — Source

| Aspecto | Valor |
|---|---|
| Criterio | El instrumento tiene una fuente primaria identificable (sitio oficial, publicación científica) |
| Para IPIP-50-MX | ✔ APROBADO — ipip.ori.org (Goldberg 1999/2006); publicación Goldberg et al. 2006 JRP |
| Para demo actual | ✗ FALLADO — fuente UNKNOWN |
| Evidencia | ipip.ori.org (snippet + citación leída en A-04.1); psycnet (cited 5068) |

## PERSONALITY-G2 — Rights

| Aspecto | Valor |
|---|---|
| Criterio | Derechos de uso comercial claramente PERMITIDOS (public domain o licencia abierta con atribución) |
| Para IPIP-50-MX | ✔ APROBADO — PUBLIC DOMAIN (ipip.ori.org newCitation.htm: "for any purpose") |
| Para Mini-IPIP | ✔ APROBADO — hereda IPIP public domain |
| Para BFI-10 | ⚠ CONDICIONAL — OPEN-USE investigación; comercial UNKNOWN (requiere contacto autores) |
| Para NEO/Hogan | ✗ FALLADO — COMMERCIAL restringido (costo + cualificación) |
| Evidencia | ipip.ori.org newCitation.htm |

## PERSONALITY-G3 — Translation

| Aspecto | Valor |
|---|---|
| Criterio | Traducción española/mexicana siguiendo protocolo ITC 2017 (Guidelines for Translating and Adapting Tests); autoría documentada |
| Para IPIP-50-MX | ✗ NO EVALUADO — existe traducción española en ipip.ori.org (autoría UNKNOWN, sin ITC 2017 documentado); requiere traducción/adaptación MX propia con protocolo |
| Para Mini-IPIP | ✗ NO EVALUADO — los 20 ítems como conjunto no tienen traducción oficial verificada |
| Para BFI-10 | ⚠ CONDICIONAL — Ortet 2022 versión española (España); MX NOT_ESTABLISHED |
| Acción requerida | Contratar traducción/adaptación ITC 2017 + pilotaje de equivalencia lingüística |

## PERSONALITY-G4 — Scientific evidence

| Aspecto | Valor |
|---|---|
| Criterio | Evidencia psicométrica ESTABLISHED del instrumento (α≥.70, estructura factorial replicada, validez) |
| Para IPIP-50-MX | ✔ APROBADO (internacional) — Ypofanti 2015, Goldberg 2006; estructura 5-factor replicada |
| Para Mini-IPIP | ✔ APROBADO (internacional) — Donnellan 2006 α≥.60, CFA Cooper 2010 |
| Para BFI-10 | ⚠ CONDICIONAL — α .50–.75 (LIMITED para decisión individual) |
| Para demo actual | ✗ FALLADO — NOT ESTABLISHED |
| **MX-specific** | ✗ NO EVALUADO para todos — requiere validación MX propia (EFA/CFA + α + baremos) |

## PERSONALITY-G5 — Mexico evidence

| Aspecto | Valor |
|---|---|
| Criterio | Evidencia psicométrica ESTABLISHED en población mexicana (baremos MX, α MX, estructura MX) |
| Para todos los instrumentos | ✗ NO EVALUADO — NOT_ESTABLISHED (Reyes Zamorano 2014 explícito para BFI-44; no se encontró IPIP/Mini-IPIP/BFI-10 MX) |
| Acción requerida | Estudio de validación en muestra mexicana (n≥300, EFA+CFA, α por dimensión, baremos percentilares MX) |
| Estado | **GATE CRÍTICO** — sin este gate, el instrumento NO puede usarse formalmente en V1 MX |

## PERSONALITY-G6 — Workplace use

| Aspecto | Valor |
|---|---|
| Criterio | Evidencia de apropiación para selección laboral (no solo diagnóstico) + validez predictiva documentada |
| Para IPIP-50-MX | ⚠ CONDICIONAL — constructo ESTABLISHED (Barrick & Mount 1991); validez predictiva MX PENDIENTE |
| Para Mini-IPIP | ⚠ CONDICIONAL — idem |
| Para NEO/Hogan | ✔ APROBADO (diseñados para selección) |
| Para demo | ✗ FALLADO |
| Regla | NO trasladar validez predictiva internacional a MX sin validación propia |

## PERSONALITY-G7 — Legal review

| Aspecto | Valor |
|---|---|
| Criterio | Revisión legal de proporcionalidad, finalidad, transparencia, dato sensible (LFPDPPP) |
| Para todos | ✗ NO EVALUADO — **REQUIERE REVISIÓN LEGAL** profesional |
| Acción requerida | Asesoría legal sobre: (a) estatus de personalidad como dato sensible; (b) proporcionalidad del instrumento; (c) transparencia en consentimiento; (d) Art. 37 Bis cumplimiento |
| Estado | **GATE CRÍTICO** — sin revisión legal, NO usar |

## PERSONALITY-G8 — Governance

| Aspecto | Valor |
|---|---|
| Criterio | Gobernanza de IA + evidenceStatus + InstrumentResult separado de overallScore |
| Diseño | InstrumentResult como registro separado (como KnowledgeResult); evidenceStatus VALID/LIMITED/INSUFFICIENT/INVALID/NOT_APPROVED/EXPERIMENTAL; INSUFFICIENT/NOT_APPROVED no alimenta overallScore (regla A-04.5) |
| Para demo en V1 | ✗ FALLADO si alimenta overallScore sin evidenceStatus=VALID |
| Acción requerida | Implementar InstrumentResult + aislar del overallScore hasta G4+G5+G6+G7 aprobados |

## PERSONALITY-G9 — Implementation

| Aspecto | Valor |
|---|---|
| Criterio | Infraestructura de versionado (instrumentVersion, scoringVersion, blueprintVersion como Knowledge) + scoring canónico + tests |
| Para IPIP-50-MX futuro | PENDIENTE — requeriría adaptar el patrón Knowledge canónico a personalidad |
| Acción requerida | Implementar modelo canónico de personalidad (como A-03.5 para Knowledge) |

## PERSONALITY-G10 — Regression

| Aspecto | Valor |
|---|---|
| Criterio | Tests OS-1..OS-15 equivalentes + regresión completa (login, candidates, evaluations, dashboard, etc.) |
| Estado | PENDIENTE — solo se ejecuta tras G1..G9 aprobados y la implementación |

---

## 2. Estado actual de los gates (resumen)

| Gate | IPIP-50-MX | Mini-IPIP | BFI-10 | Demo | NEO/Hogan |
|---|---|---|---|---|---|
| G1 Source | ✔ | ✔ | ✔ | ✗ | ✔ |
| G2 Rights | ✔ | ✔ | ⚠ | ✗ | ✗ |
| G3 Translation | ✗ | ✗ | ⚠ | N/A | ⚠ |
| G4 Scientific (intl) | ✔ | ✔ | ⚠ | ✗ | ✔ |
| G4b Scientific (MX) | ✗ | ✗ | ✗ | ✗ | ✗ |
| G5 Mexico | ✗ | ✗ | ✗ | ✗ | ✗ |
| G6 Workplace | ⚠ | ⚠ | ⚠ | ✗ | ✔ |
| G7 Legal | ✗ | ✗ | ✗ | ✗ | ✗ |
| G8 Governance | ✗ | ✗ | ✗ | ✗ | ✗ |
| G9 Implementation | ✗ | ✗ | ✗ | ✗ | ✗ |
| G10 Regression | ✗ | ✗ | ✗ | ✗ | ✗ |

**Conclusión**: ningún instrumento pasa G5 (Mexico) ni G7 (Legal) hoy. Por tanto, **ningún instrumento puede admitirse en `overallScore` en V1** — lo que confirma la decisión OPTION E.

## 3. Ruta de activación futura

Para activar IPIP-50-MX post-V1:
1. G3: traducción/adaptación ITC 2017 (~2–3 meses).
2. G4b + G5: validación MX (n≥300, EFA/CFA, α, baremos) (~3–6 meses).
3. G6: análisis de validez predictiva laboral MX (~6–12 meses).
4. G7: revisión legal profesional.
5. G8: diseñar InstrumentResult + governance.
6. G9: implementar modelo canónico de personalidad.
7. G10: tests + regresión.

Tiempo estimado total: 12–18 meses. Hasta entonces, personalidad queda en OPTION E (no implementada formalmente en V1).
