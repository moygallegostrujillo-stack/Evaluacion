# EVALUHR — A-01.3
# EXPEDIENTE MAESTRO DEL INSTRUMENTO
# EVALHR-PERSONALIDAD-IPIP50-MX

> Documento de solo documentación (no modifica instrumento, código, ni datos).
> Elaborado: 2026-09-09 · Fase A-01.3 · Base: implementación v1.0 (Fase A-01.2).
> Este expediente resume y enlaza los documentos numerados de `evidence-a01-3/`.

---

## 1. Identidad

| Campo | Valor |
|---|---|
| Instrumento | EVALHR-PERSONALIDAD-IPIP50-MX |
| Nombre en producto | Evaluación de Personalidad — Modelo Big Five |
| instrumentVersion | 1.0 |
| languageVersion | ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA |
| scoringVersion | IPIP50-BFM-1.0 |
| Estructura | 50 ítems · 5 factores · 10 ítems/factor · 24 inversos / 26 directos |
| Escala | 1–5 exactitud (anclas oficiales IPIP renderizadas al español) |
| Estado | ACTIVO (demo) · Documentado en `instrument-inventory.md` |

## 2. Fuente

- **IPIP — International Personality Item Pool** (ipip.ori.org), página oficial
  "Spanish Translation of the Lexical Big-Five Factor Markers — Provided by
  **Rodrigo de Oliveira**" (https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm),
  enlazada desde la página oficial de traducciones del IPIP.
- Clave de corrección oficial verificada contra
  https://ipip.ori.org/new_ipip-50-item-scale.htm (24 −keyed coinciden 1:1).
- Capturas del 2026-09-07: `evidence-a01/ipip-ori-esmx-capture.txt`,
  `evidence-a01/ipip-ori-50-item-scale-administration.json`.
- Detalle completo: `01-official-source.md`.

## 3. Derechos

- IPIP declara sus ítems de **dominio público** con libertad de uso y administración
  (cita literal conservada). EvaluHR reproduce la versión publicada **verbatim**, sin
  reclamar autoría de reactivos ni de la traducción.
- Atribución obligatoria: ítems IPIP · traducción mexicana de Rodrigo de Oliveira ·
  referencia de Oliveira, Cherubini & Oliver (2013).
- EvaluHR no posee ni invoca licencia especial alguna; no modifica la traducción.
- Detalle completo: `02-rights-of-use.md`.

## 4. Evidencia científica

- **Referencia**: de Oliveira, R., Cherubini, M., & Oliver, N. (2013). Influence of
  personality on satisfaction with mobile phone services. *ACM TOCHI*, 20(2),
  Article 10, 10:1–10:23. DOI: 10.1145/2463579.2463581 (PDF OA consultado 2026-09-09).
- **Qué demuestra**: adaptación mexicana desarrollada por back-translation contrastada
  con la versión argentina validada (Cupani 2009); consistencia interna en su muestra
  (α .73/.77/.83/.81/.80; modelo final .701–.809); modelo de medición razonable (CR,
  AVE, validez discriminante) bajo la administración de 9 puntos del estudio.
- **Qué NO demuestra**: validez predictiva laboral, baremos, validación de la escala
  1–5 exactitud de EvaluHR, ni validación de la implementación EvaluHR.
- Detalle completo: `03-scientific-evidence.md`.

## 5. Evidencia mexicana

- Único estudio disponible: muestra mexicana (panel en línea, N=603, 18–35 años,
  clase media predominante, usuarios prepago), con pilotaje de 39.
- Contexto del criterio: **satisfacción con servicios de telefonía móvil** (no laboral).
- Evidencia separada en 5 niveles (instrumento / adaptación / México / implementación
  EvaluHR / selección laboral): `06-psychometric-evidence.md`. La implementación
  EvaluHR aún **no tiene** estudio propio; la selección laboral **no tiene** evidencia.

## 6. Reactivos

- 50 reactivos verbatim de la versión mexicana publicada; orden oficial 1–50.
- Verificación anti-IA: TEST 9 (50/50 verbatim contra captura de la fuente).
- Mapa completo (itemId, factor, reverse, order, source, version):
  **`04-item-map.csv`** — generado 1:1 desde el módulo implementado y verificado
  (50 filas · 10/factor · 24 reverse · 26 directos · sin duplicados).
- Los 10 reactivos Big Five del instrumento legacy están **deprecados** y separados
  (TEST 8).

## 7. Scoring (IPIP50-BFM-1.0)

- Inversión `6 − v` **solo** en los 24 ítems de la clave oficial.
- Puntaje por factor = **suma** de sus 10 ítems (rango **10–50**), sin pesos.
- Visual 0–100 = `raw/50×100` — **no es percentil** (nota explícita en RH).
- Sin baremos propios · sin pesos laborales · sin categorías bajo/medio/alto ·
  **sin overall psicométrico** (IPIP excluido del overallScore; TEST 10 + E2E).
- IA: **cero participación** en scoring o interpretación (funciones deterministas).
- Detalle completo: `05-scoring-specification.md`.

## 8. Limitaciones (resumen obligatorio)

1. Sin baremos propios de EvaluHR (0–100 ≠ percentil).
2. Sin validación predictiva propia (ningún estudio EvaluHR).
3. Evidencia mexicana limitada al contexto del estudio 2013 (muestra 18–35, panel,
   escala de 9 puntos del estudio, criterio no laboral).
4. No equivalencia automática entre evidencia del instrumento y de esta
   implementación.
5. No diagnóstico clínico.
6. No determinación automática de contratación (disclaimer literal en resultados RH).
7. No uso como único criterio de decisión laboral.
8. Adicionales: auto-reporto; q16r/q36r con debilidad documentada en el estudio
   (v1.0 mantiene texto verbatim); sin test-retest propio; datos demo ≠ evidencia.
- Detalle completo: `07-limitations.md`.

## 9. Uso permitido

- **Permitido**: "Evaluación de personalidad basada en el modelo Big Five" ·
  "50 ítems del IPIP" · "versión mexicana documentada" · "evidencia psicométrica
  publicada para una adaptación mexicana" · resultados como tendencias de respuesta
  con disclaimer.
- **Prohibido**: "validada para contratación en México" · "predice el éxito laboral" ·
  "determina qué candidato debe contratarse" · "diagnostica la personalidad" ·
  "determina aptitud laboral" · percentiles/normas/certificaciones inexistentes.
- Detalle completo: `08-permitted-use.md` (con matriz de decisión para redactores).

## 10. Gobernanza

- Propietario del instrumento (Instrument Owner) custodia el expediente y autoriza
  cambios; aprobación de versiones = Owner + dirección (+ asesoría psicometría para
  cambios psicométricos); scoring solo cambia con nueva scoringVersion; traducción/
  edición solo vía nueva languageVersion con evidencia propia; retiro de versiones
  documentado y sin borrar históricos.
- **Regla de oro: ningún cambio directo sobre v1.0** — todo cambio genera v1.1 (menor)
  o v2.0 (mayor) con checklist de publicación obligatorio.
- Detalle completo: `09-governance.md`.

## 11. Versionado

- v1.0 = implementación actual (única versión registrada, ACTIVA).
- Cada resultado histórico conserva el cuádruple identificador
  (instrumentId · instrumentVersion · languageVersion · scoringVersion) — columnas en
  `EvaluationTemplate`, `EvaluationResult`, `VacancyApplication` (null = legacy).
- **Un resultado histórico NO se reinterpreta automáticamente** con versiones nuevas;
  registro append-only; comparaciones entre versiones requieren estudio de
  equiparación aprobado.
- Detalle completo: `10-version-control.md`.

## 12. Evidencia (matrices)

- **Matriz de evidencia** (dominio público · versión mexicana · confiabilidad ·
  estructura · validez · selección laboral · adaptación EvaluHR, cada una con fuerza
  y enunciado permitido/prohibido): `11-evidence-matrix.csv`.
- **Matriz jurídica del lenguaje** (afirmación · evidencia · riesgo · lenguaje
  permitido · prohibido · documento de uso): `12-legal-language-matrix.md`.
  Sin obligaciones legales inventadas; sin certificaciones inexistentes.

## 13. Riesgos

| # | Riesgo | Severidad | Mitigación en el expediente |
|---|---|---|---|
| 1 | Uso comercial con lenguaje de validación laboral ("validado", "predice") | ALTO | Matrices prohibitorias (08, 12); auditoría de lenguaje en código: 0 coincidencias |
| 2 | Lectura del 0–100 como percentil por usuarios RH | MEDIO | Nota explícita implementada en RH; especificación 05 |
| 3 | Deriva de la traducción (ediciones "de mejora" sobre reactivos) | MEDIO | Regla verbatim + gobernanza (nueva versión obligatoria) |
| 4 | Mezcla del IPIP con scoring global/overall o con otras pruebas | MEDIO | Aislamiento por categorías IPIP_*; TEST 8/10; exclusión en CompareView |
| 5 | Reinterpretación de resultados históricos tras futuras versiones | MEDIO | Política de no-reinterpretación + versionado persistente |
| 6 | Reinvindicación de autoría de reactivos/traducción | BAJO | Atribución en módulo, UI y expediente; derechos documentados |
| 7 | Que un estudio propio futuro "confirme" y se use sin control | BAJO | Checklist de publicación de versiones (09 §6) |
| 8 | Expectativa de certificación/aval institucional inexistente | ALTO si ocurre | Prohibición explícita (08 §3, 12 Matriz 5) |

## 14. Estado final

- **EXPEDIENTE COMPLETO Y CONSISTENTE** con la implementación v1.0 (auditoría del
  2026-09-09: checklist 16/16 verificado; hallazgos menores documentados, no
  bloqueantes — ver `13-audit-checklist.md`).
- El instrumento puede describirse públicamente dentro del lenguaje permitido de
  `08-permitted-use.md`.
- Pendientes administrativos (no de código): nominalización formal del Instrument
  Owner; decisión futura (gobernanza) sobre la eventual revisión de q36r; futuros
  estudios propios si EvaluHR desea evidencia de su implementación.
- **GO** para el uso documental y comercial conforme a este expediente.

---

### Índice del expediente (carpeta evidence-a01-3/)

| Archivo | Contenido |
|---|---|
| `00-master-dossier.md` | Este documento (expediente maestro) |
| `instrument-inventory.md` | Paso 1 — Inventario e implementación |
| `01-official-source.md` | Paso 2 — Fuente oficial |
| `02-rights-of-use.md` | Paso 3 — Derechos de uso |
| `03-scientific-evidence.md` | Paso 4 — Referencia científica 2013 |
| `04-item-map.csv` | Paso 5 — Mapa de los 50 reactivos |
| `05-scoring-specification.md` | Paso 6 — Especificación de scoring |
| `06-psychometric-evidence.md` | Paso 7 — Evidencia psicométrica (A–E) |
| `07-limitations.md` | Paso 8 — Limitaciones |
| `08-permitted-use.md` | Paso 9 — Uso permitido de resultados |
| `09-governance.md` | Paso 10 — Gobernanza |
| `10-version-control.md` | Paso 11 — Control de versiones |
| `11-evidence-matrix.csv` | Paso 12 — Matriz de evidencia |
| `12-legal-language-matrix.md` | Paso 13 — Matriz jurídica del lenguaje |
| `13-audit-checklist.md` | Paso 14 — Checklist de auditoría (16/16 + hallazgos) |
| `raw/deoliveira2013-tochi-openaccess.pdf` | Fuente primaria: artículo 2013 (OA, 23 págs.) |
| `raw/semanticscholar-2463579.2463581.json` | Metadatos bibliográficos publicados |
