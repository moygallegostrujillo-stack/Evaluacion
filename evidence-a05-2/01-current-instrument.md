# A-05.2 — 01 · INSTRUMENTO ACTUAL (PASO 1)

## 1. Confirmación

Re-verificado contra el repositorio actual (`main@aa771a9`):

| Campo | Valor |
|---|---|
| instrumentName | «Big Five» (nombre descriptivo; NO cita IPIP/NEO/BFI) |
| version | Sin versionar |
| itemCount | 10 (2 por dimensión) |
| dimensions | 5 (OPENNESS, CONSCIENTIOUSNESS, EXTRAVERSION, AGREEABLENESS, NEUROTICISM) |
| source | PROJECT-CREATED |
| author | Desarrollador (no documentado) |
| rights | UNKNOWN |
| evidencia | NOT ESTABLISHED |

Tres sitios con los 10 reactivos idénticos: `generate-templates.ts` L10–21, `public/apply/route.ts` L215–226, `seed.ts` (vía `generateTemplatesForPosition`). Detalle completo en `evidence-a05-1/01-current-instrument.md`.

## 2. Clasificación (PASO 1 del spec A-05.2)

**NOT SUITABLE AS FORMAL V1 INSTRUMENT**

Razones:
1. **Origen UNKNOWN** — paráfrasis vagas no verificables como IPIP/NEO/BFI.
2. **Derechos UNKNOWN** — sin licencia, atribución, ni cita.
3. **Evidencia NOT ESTABLISHED** — sin confiabilidad, estructura, validez, baremos.
4. **2 ítems por dimensión** — insuficiente para α ≥ .70.
5. **No apto para inferencia laboral** — sin validez predictiva documentada.

Salvo nueva evidencia excepcional (que no existe en el repositorio ni en la literatura verificable para estos 10 reactivos específicos), el demo actual **no puede** servir como instrumento formal de personalidad en V1.

## 3. Verificación de ausencia de IPIP

`rg "IPIP|ipip" src/` = 0 matches (re-confirmado en A-05.2). El forense git de A-04.4 ya demostró que IPIP nunca existió en esta historia. El nombre «Big Five» en el código es solo descriptivo del modelo, NO una atribución a IPIP o cualquier instrumento formal.

## 4. Conclusión

El estado actual es **NOT SUITABLE AS FORMAL V1 INSTRUMENT**. La decisión sobre qué hacer (sustituir, eliminar, conservar como experimental) se documenta en `13-decision.md` tras evaluar las alternativas en los docs 02–06.
