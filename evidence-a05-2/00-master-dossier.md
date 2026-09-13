# EVALUHR — A-05.2 — EXPEDIENTE MAESTRO / MASTER DOSSIER
# DECISIÓN FINAL DEL INSTRUMENTO DE PERSONALIDAD V1 — INVESTIGACIÓN + DOCUMENTACIÓN (cumplido)

Fecha: 2026-09-11 (America/Mexico_City) · Base: `main@aa771a9`.
Método: investigación con fuentes primarias (web-search CLI + lectura de snippets), contraste
con expedientes A-04.1 (IPIP/HEXACO investigación), A-05.1 (auditoría demo), A-04.5 (gobernanza
overall). Regla respetada: LA ÚNICA FUENTE DE VERDAD DEL ESTADO IMPLEMENTADO ES EL REPOSITORIO;
toda afirmación sobre derechos/autores/psicometría/México/uso laboral/costos tiene fuente
identificable.

---

## 1. INSTRUMENTO ACTUAL (PASO 1)

«Big Five» demo de 10 reactivos PROJECT-CREATED, sin citar fuente. **NOT SUITABLE AS FORMAL V1
INSTRUMENT** (origen UNKNOWN, derechos UNKNOWN, evidencia NOT ESTABLISHED, 2 ítems/dim
insuficiente para α≥.70). Detalle: `01-current-instrument.md`.

## 2. CANDIDATOS INVESTIGADOS (PASOS 2–5)

| Instrumento | Fuente primaria | Derechos | Ítems | MX | Detalle |
|---|---|---|---|---|---|
| IPIP-50-MX | ipip.ori.org (Goldberg 1999/2006) | PUBLIC DOMAIN | 50 | NOT_ESTABLISHED | `02-ipip50mx.md` |
| Mini-IPIP | Donnellan et al. 2006 (psycnet/PubMed, cited 3947) | PUBLIC DOMAIN | 20 | NOT_ESTABLISHED | `03-mini-ipip.md` |
| BFI-10 | Rammstedt & John 2007 (gesis.org, cited 6837) | OPEN-USE (comercial restringido) | 10 | NOT_ESTABLISHED | `04-other-public-option.md` |
| NEO-PI-R/3 | PAR Inc (parinc.com, Costa & McCrae) | COMMERCIAL | 240 | UNKNOWN (comercial) | `05-commercial-options.md` |
| Hogan HPI | Hogan Assessment Systems | COMMERCIAL | 220 | UNKNOWN (comercial) | `05-commercial-options.md` |

## 3. EVIDENCIA SEPARADA (PASOS 9–10)

| Categoría | IPIP-50 | Mini-IPIP | BFI-10 | NEO/Hogan | Demo |
|---|---|---|---|---|---|
| Constructo | ESTABLISHED | ESTABLISHED | ESTABLISHED | ESTABLISHED | ESTABLISHED (modelo) |
| Instrumento | ESTABLISHED intl | ESTABLISHED intl | ESTABLISHED intl | ESTABLISHED | NOT ESTABLISHED |
| Adaptación idiomática | LIMITED (Perú 2018) | NOT_ESTABLISHED | LIMITED (España 2022) | ESTABLISHED (oficial) | N/A |
| México | NOT_ESTABLISHED | NOT_ESTABLISHED | NOT_ESTABLISHED | UNKNOWN comercial | NOT_ESTABLISHED |
| Selección laboral | ESTABLISHED (constructo) | ESTABLISHED (constructo) | LIMITED | ESTABLISHED | NOT ESTABLISHED |
| Validez predictiva | ESTABLISHED (constructo) | ESTABLISHED (constructo) | ESTABLISHED (constructo) | ESTABLISHED | NOT ESTABLISHED |

**Regla respetada**: NO se traslada evidencia del instrumento original a adaptación MX no validada.
Detalle: `07-scientific-evidence.md`.

## 4. DERECHOS (PASO 8)

Separados 6 componentes (reactivos/traducción/publicación/modificación/scoring/comercial) en
`06-rights.md`. Solo IPIP-50-MX y Mini-IPIP tienen derechos comerciales **claramente PERMITIDOS**
(public domain, fuente primaria ipip.ori.org newCitation.htm). BFI-10 es OPEN-USE con comercial
UNKNOWN. NEO/Hogan COMMERCIAL restringido. Demo UNKNOWN.

## 5. MÉXICO (PASO 11)

**NOT_ESTABLISHED para todos los instrumentos públicos.** Reyes Zamorano 2014 (scielo.org.mx)
declaró BFI-44 MX「yet unknown」. No se encontró validación MX para IPIP/Mini-IPIP/BFI-10.
Comerciales: UNKNOWN (requieren contacto). Detalle: `08-mexico-evidence.md`.

## 6. SELECCIÓN LABORAL (PASO 12)

Barrick & Mount 1991 (psycnet.apa.org, cited 17535) establece validez predictiva del CONSTRUCTO
Big Five para desempeño (Conscientiousness ρ≈.15–.31). **NO trasladable** a adaptación MX no
validada.「Mide personalidad」≠「apropiado para selección」≠「predice desempeño」separados.
Detalle: `09-workplace-evidence.md`.

## 7. RIESGOS (PASOS 13–14)

- **Faking** (`10-faking-risk.md`): Demo ALTO, IPIP/Mini-IPIP MEDIO-ALTO, BFI-10 ALTO,
  NEO MEDIO, Hogan MEDIO-BAJO. Ningún instrumento público incluye escala de control.
- **Legal** (`11-legal-risk.md`): 3 riesgos ALTO (instrumento no identificado, overall pondera
  sin validez, falta de transparencia). Proporcionalidad + dato sensible: REQUIERE REVISIÓN LEGAL.

## 8. OPCIÓN ELEGIDA (PASO 16)

> **OPTION E — NO IMPLEMENTAR PERSONALIDAD EN V1.**

Razón: ningún instrumento tiene evidencia MX ESTABLISHED; la gobernanza A-04.5 prohíbe alimentar
`overallScore` con evidencia NOT_APPROVED. OPTION E es la única decisión V1 ship-ready,
defensible y honesta. Detalle: `13-decision.md`.

## 9. CONDICIONES (PASO 17)

- **V1 (incondicional)**: personalidad NO se implementa como instrumento formal.
- **Condición de implementación (fase separada A-05.3, no en A-05.2)**: aislar personalidad del
  `overallScore` + etiquetar「experimental, sin validez」si se conserva la sección, O eliminarla.
- **Objetivo post-V1**: OPTION A (IPIP-50-MX) CONDICIONADA a PERSONALITY-G1..G10.

## 10. INSTRUMENTResult (PASO 15)

Conceptualizado en `13-decision.md` §1: registro separado (instrumentName, instrumentVersion,
scoringVersion, evidenceStatus, dimensions, includedItems, excludedItems, formulaVersion).
**NO conectado** a JobFit, overallScore, ni recommendation hasta que G1..G10 se superen.

## 11. GATES PERSONALITY-G1..G10 (PASO 18)

Sistema de 10 gates (Source/Rights/Translation/Scientific/Mexico/Workplace/Legal/Governance/
Implementation/Regression). Estado actual: **ningún instrumento pasa G5 (Mexico) ni G7 (Legal)**.
Confirma que ningún instrumento puede admitirse en overallScore en V1. Ruta de activación futura
estimada: 12–18 meses para IPIP-50-MX. Detalle: `14-activation-gates.md`.

## 12. MATRIZ DE COMPARACIÓN (PASO 7)

`12-comparison.csv`: 7 filas × 14 columnas (instrument/construct/items/source/rights/
scientificEvidence/mexicoEvidence/workplaceEvidence/transparency/fakingRisk/
implementationComplexity/cost/selectionRisk/recommendedStatus).

Estados: Big Five demo NO_GO · IPIP-50-MX CONDITIONAL · Mini-IPIP CONDITIONAL · BFI-10
NOT_RECOMMENDED · NEO NOT_RECOMMENDED (V1) · Hogan NOT_RECOMMENDED (V1) · NO IMPLEMENTAR RECOMMENDED (V1).

## 13. INVESTIGACIÓN EXTERNA (PASO 19)

Toda afirmación tiene fuente primaria identificable (no blogs comerciales):
- ipip.ori.org (sitio oficial IPIP)
- psycnet.apa.org / PubMed (publicaciones científicas)
- parinc.com / hoganassessments.com (sitios oficiales comerciales)
- scielo.org.mx (Reyes Zamorano 2014 — evidencia MX)
- gesis.org (host BFI-10)
- osf.io (estudio IPIP español/Perú 2018)

## 14. ÍNDICE DEL EXPEDIENTE A-05.2

| Archivo | PASO |
|---|---|
| 00-master-dossier.md | consolidación |
| 01-current-instrument.md | 1 |
| 02-ipip50mx.md | 2 |
| 03-mini-ipip.md | 3 |
| 04-other-public-option.md | 4 |
| 05-commercial-options.md | 5 |
| 06-rights.md | 8 |
| 07-scientific-evidence.md | 9, 10 |
| 08-mexico-evidence.md | 11 |
| 09-workplace-evidence.md | 12 |
| 10-faking-risk.md | 13 |
| 11-legal-risk.md | 14 |
| 12-comparison.csv | 7 |
| 13-decision.md | 15, 16, 17 |
| 14-activation-gates.md | 18 |
| 15-audit-checklist.md | 21 |

## 15. AUDITORÍA FINAL

Ver `15-audit-checklist.md` — **15/15 verificadas**.

## 16. PRUEBA DE NO MODIFICACIÓN (cierre)

`git status` al cierre: working tree limpio excepto los NUEVOS archivos de evidencia
(`evidence-a05-2/*` y `worklog.md`); **cero cambios en `src/`, `prisma/`, `scripts/`, `public/`**;
sin migraciones, sin db push, sin escrituras de datos. REGLA ABSOLUTA cumplida.
