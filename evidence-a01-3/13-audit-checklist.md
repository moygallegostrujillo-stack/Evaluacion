# A-01.3 — PASO 14: CHECKLIST DE AUDITORÍA DEL EXPEDIENTE

> Resultado de la auditoría del expediente A-01.3 contra la implementación v1.0.
> Fecha de auditoría: 2026-09-09. Cada casilla indica el método de verificación y la
> evidencia que la respalda.

## Checklist principal

- [x] **Fuente oficial identificada**
  Método: cotejo URL/título/autor de la adaptación contra captura textual.
  Evidencia: `01-official-source.md`; `evidence-a01/ipip-ori-esmx-capture.txt`
  (2026-09-07); módulo `src/lib/instruments/ipip50-mx.ts` (encabezado).

- [x] **Derechos de uso documentados**
  Método: solo afirmaciones textuales de la fuente capturada; prohibiciones explícitas.
  Evidencia: `02-rights-of-use.md` (cita literal del párrafo de dominio público de
  `new_ipip-50-item-scale.htm`).

- [x] **Versión mexicana identificada**
  Método: página oficial "Provided by Rodrigo de Oliveira" + estudio de origen.
  Evidencia: `01-official-source.md`; `03-scientific-evidence.md` (estudio conducido
  en México, §3.1.1 y §3.7 del artículo).

- [x] **Referencia científica**
  Método: referencia completa + DOI + PDF de acceso abierto consultado.
  Evidencia: `03-scientific-evidence.md`; `raw/deoliveira2013-tochi-openaccess.pdf`
  (23 págs.); `raw/semanticscholar-2463579.2463581.json` (metadatos, DOI
  10.1145/2463579.2463581).

- [x] **50 reactivos**
  Método: verificación programática desde el módulo implementado (bun) + TEST 5.
  Evidencia: `04-item-map.csv` (50 filas); `evidence-a01/a01-tests-results.txt` (T5:
  length=50, códigos y textos únicos).

- [x] **10 reactivos por factor**
  Método: conteo programático por factor desde el módulo.
  Evidencia: salida de verificación 2026-09-09
  `{"EXTRAVERSION":10,"AGREEABLENESS":10,"CONSCIENTIOUSNESS":10,"EMOTIONAL_STABILITY":10,"INTELLECT":10}`;
  TEST 6 OK.

- [x] **24 reverse**
  Método: conteo programático de `reverse=true` + cotejo contra clave oficial IPIP
  (sufijos `r` y nomenclatura −keyed).
  Evidencia: conteo 24 reverse / 26 direct (2026-09-09); lista en `04-item-map.csv`;
  `evidence-a01/a01-ipip-source-capture.md` (desglose oficial E5/A4/C4/ES8/I3).

- [x] **Scoring documentado**
  Método: especificación alineada 1:1 con `scoreIPIP50` y con TEST 1–3.
  Evidencia: `05-scoring-specification.md`; `evidence-a01/a01-tests-results.txt`
  (T1: 30/50 → 60 visual; T2/T3: inversión exacta).

- [x] **No percentiles inventados**
  Método: búsqueda en código (grep "percentil") → solo aparece en negación en la nota
  de RH; especificación prohíbe percentiles/normas/categorías.
  Evidencia: `CandidateDetailView.tsx:456` ("…no constituye percentil.");
  `05-scoring-specification.md` §5–6; TEST 10.

- [x] **No IA en reactivos**
  Método: TEST 9 — los 50 textos verificados verbatim contra la captura de la fuente
  oficial; regla de gobernanza anti-IA permanente.
  Evidencia: `evidence-a01/a01-tests-results.txt` (T9: 50/50 verbatim);
  `09-governance.md` §10.2.

- [x] **No overall psicométrico**
  Método: TEST 10 (el scorer no expone promedio/combinado) + E2E (overallScore legacy
  calculado SIN IPIP) + código (IPIP excluido de overall y de comparaciones).
  Evidencia: `evidence-a01/a01-tests-results.txt` (T10);
  `evidence-a01/a01-e2e-results.txt` (overallScore=25 sin IPIP; Parte B: fórmula
  idéntica a legacy); `CompareView.tsx:101-102`.

- [x] **Limitaciones documentadas**
  Método: documento específico con las 7 limitaciones mínimas exigidas + adicionales.
  Evidencia: `07-limitations.md`.

- [x] **Uso comercial correctamente descrito**
  Método: matrices de lenguaje permitido/prohibido con sustento evidencial por fila.
  Evidencia: `08-permitted-use.md`; `12-legal-language-matrix.md`.

- [x] **Versionado**
  Método: cuádruple identificador presente en módulo, schema (2 esquemas) y
  resultados; política de versiones y no-reinterpretación documentadas.
  Evidencia: `10-version-control.md`; `prisma/schema.prisma` líneas 149–152, 277–285,
  410–418; `prisma/schema.prod.prisma` (paridad 18/18 verificada en A-01.2).

- [x] **Gobernanza**
  Método: documento con propietario, roles de modificación/aprobación/scoring/
  traducción/retiro y evidencia requerida antes de publicar versiones.
  Evidencia: `09-governance.md`.

- [x] **Trazabilidad histórica**
  Método: columnas de versión + raws por resultado (null=legacy), política append-only
  y no-reinterpretación automática.
  Evidencia: `10-version-control.md` §2–3; schema (arriba); E2E persiste las 4
  versiones y los 5 raws (`a01-e2e-results.txt`).

## Verificaciones adicionales de auditoría (Paso 15 — expediente vs implementación)

- [x] Ninguna afirmación documental contradice el código
  (conteos, fórmulas, títulos y disclaimer verificados en fuente; 0 discrepancias).

- [x] Ninguna afirmación científica excede la evidencia encontrada
  (todas las cifras citadas tienen página/sección del artículo o captura; α .79–.87
  etiquetado como versión base/en inglés; α .73–.83 como muestra del estudio;
  administración 9 puntos del estudio vs 5 puntos EvaluHR declarada).

- [x] Ninguna afirmación comercial dice "validado para selección" sin evidencia
  (grep en `src/` de "prueba diagnóstica|diagnostica|determina si eres apto|garantiza
  tu éxito|éxito laboral|validada para|predice el éxito|debe contratarse|aptitud
  laboral" → **0 coincidencias**; matrices jurídicas las prohíben).

- [x] Ningún documento atribuye los reactivos a EvaluHR
  (módulo declara lo contrario; derechos de uso prohíben la atribución; RH muestra
  atribución a la fuente).

- [x] Ninguna versión histórica queda reinterpretada
  (política append-only y de no-reinterpretación automática; columnas de versión
  null=legacy preservan instrumentos antiguos intactos).

## Hallazgos menores (no bloqueantes)

1. La instrucción al candidato es el render en español de la instrucción de muestra
   oficial IPIP (en inglés): declarado y justificado en `01-official-source.md` §4 —
   no es una inconsistencia, pero se registra como decisión documental.
2. El estudio 2013 administró los ítems con escala de 9 puntos de acuerdo; EvaluHR
   usa 5 puntos de exactitud (formato de muestra oficial IPIP). Documentado como
   limitación (07 §8.3 y 06 §B/E). No bloquea v1.0; condición de transparencia.
3. El estudio sugirió revisar la redacción de q36r; v1.0 mantiene el texto publicado
   verbatim (regla anti-edición). Registrado para futura gobernanza (09 §5, 07 §8.2).
4. La designación formal del Instrument Owner está pendiente de nominalización por la
   dirección (09 §1) — acción administrativa, no de código.

— FIN DEL CHECKLIST DE AUDITORÍA —
