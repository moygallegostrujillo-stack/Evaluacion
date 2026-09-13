# EVALUHR — A-02.3
# DOSSIER MAESTRO — MODELO DE INTERPRETACIÓN Y SALIDAS

> Documento de solo documentación metodológica. NO modifica código, schema,
> base de datos, scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones,
> frontend, contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Elaborado: 2026-09-09 · Fase A-02.3 · Base: expedientes A-01.3 (GO), A-02.1
> (GO documental) y A-02.2 (GO documental).
> Este dossier resume y enlaza los documentos de `evidence-a02-3/`.

---

## Regla maestra de la fase (aplicada en todo el dossier)

> **INSUFFICIENT ≠ 0** — La ausencia o insuficiencia de evidencia JAMÁS se
> convierte automáticamente en una puntuación negativa. (Presente en 7 piezas;
> heredada obligatoriamente a AssessmentSummary y a cualquier agregado futuro,
> incluido el eventual "Nivel de ajuste".)

Lo que A-02.3 **no crea** (verificado en auditoría 16/16): fórmula de nivel de
ajuste · pesos · puntos de corte · percentiles · APTO · NO APTO · rechazo
automático · contratación automática · score global.

---

## 1. Estados

Cinco **estados de interpretación**, derivados deterministamente de los campos
del EvidenceRecord (sin alterarlos), con precedencia M1–M6 que garantiza un
único estado por registro:

- **VALID** — utilizable para la lectura que su tipo permite (HIGH/MEDIUM,
  revisión cerrada, sin conflicto).
- **LIMITED** — solo contexto/orientación (p. ej., calidad LOW, declaraciones).
- **INSUFFICIENT** — "Información insuficiente para evaluar este criterio."
  con causa; nunca 0, nunca señal negativa; recuperable.
- **INVALID** — invalidado por gobernanza o rechazado por integridad;
  conservado solo para auditoría.
- **PENDING_REVIEW** — bloqueado hasta revisión humana (revisión pendiente o
  conflicto abierto).

> Detalle: `01-evidence-states.md` (tabla de mapeo M1–M6 y comportamiento en
> salidas).

---

## 2. InstrumentResult

Registro del resultado de administrar un instrumento en su versión exacta,
con sus **seis elementos separados**: resultado (crudo, unidad nativa) ·
calidad (de la administración, no de la persona) · instrumento · versión
(cuádruple) · alcance (fijado por la matriz A-02.1; las salidas no lo
amplían) · limitaciones/disclaimers (siempre visibles).

**Regla central: InstrumentResult ≠ JobFit** — no referencia puestos, no
puede convertirse en cumplimiento/aptitud/recomendación, y la única ruta
hacia el puesto es PUESTO → CRITERIO → EVIDENCIA → criterio. Sin criterio
aprobado compatible queda como resultado visible que no alimenta
interpretación.

> Detalle: `02-instrument-result.md`.

---

## 3. CriterionResult

Resultado de evaluar un criterio aprobado a partir de sus evidencias:
`criterionResultId` · `criterionId`+`criterionVersion` · `criterionCategory` ·
`evidenceId`s (solo VALID para lectura, LIMITED para contexto) · `result`
(DESCRIPTIVE_READING / CONTEXT_ONLY / INSUFFICIENT / CONFLICT_OPEN /
NOT_EVALUATED) · `quality` · `status` · `interpretationStatus` ·
`reviewRequired` · `readings` citando evidencias.

Qué puede y no puede concluirse **por categoría**: A aciertos sobre contenido
definido (jamás ejecución) · B hoy solo INSUFFICIENT · C acreditación
documental del dato (jamás capacidad) · D tendencias descriptivas + HDC sin
umbral (jamás aptitud) · E hoy solo INSUFFICIENT. Sin criterio no hay
CriterionResult; determinista por reglas versionadas; el conflicto bloquea.

> Detalle: `03-criterion-result.md`.

---

## 4. IPIP

El IPIP-50-MX produce **exactamente**: cinco dimensiones (E/A/C/ES/I) ·
puntuación raw 10–50 por factor (sin pesos/normas; incompletud por dimensión
sin prorrateo) · representación visual raw/50×100 **no percentil** (con
disclaimer literal) · interpretación descriptiva determinista ("Tendencias de
respuesta", P8).

**Ninguna dimensión se convierte automáticamente** en cumplimiento,
incumplimiento, aptitud, recomendación laboral, candidato ideal, predictor o
entrada a agregados — tabla de prohibiciones con sustitutos permitidos. Solo
entra a criterios D aprobados vía la matriz; la discrepancia con HDC genera
área de revisión, nunca veredicto.

> Detalle: `04-ipip-50-mx-output.md`.

---

## 5. Conocimiento

Cinco escenarios de salida: **A** correctAnswer válida (K1–K6) → aciertos X/Y
con revisión · **B** sin correctAnswer → INSUFFICIENT (K-INS-1, QUALITY_FAIL;
el 0 artefactual jamás se muestra) · **C** parcial → INSUFFICIENT
(PARTIAL_RESPONSE; sin prorrateo ni "puntuar con lo respondido") · **D**
preguntas no validadas → INSUFFICIENT (sin score parcial "de las válidas") ·
**E** score no reconstruible → INSUFFICIENT (TECH_FAILURE + audit trail).

**REGLA: si no existe scoring válido → status = INSUFFICIENT, NO = 0.**
El problema correctAnswer de puestos generados sigue documentado y **no
corregido** (fuera de alcance).

> Detalle: `05-knowledge-output.md`.

---

## 6. Competencias

**Hoy: NO_METHOD → INSUFFICIENT** (sin excepciones; auto-reporte = solo
contexto; prohibido puntaje desde Big Five/auto-reporte/entrevista sin
método/IA).

**Diseño conceptual futuro (condicional)**: competencia aprobada → método
conductual versionado → indicadores definidos → registro por indicador
(hecho observado, evaluador humano, fecha) → lectura descriptiva por
indicador (sin score compuesto por defecto) → revisión humana siempre.
Se activa solo con las **6 puertas de activación** completas.

> Detalle: `06-competencies-output.md`.

---

## 7. Integridad

**Estado obligatorio: INSUFFICIENT** (I-INT-1) hasta expediente metodológico
y psicométrico suficiente (checklist de 6 prerrequisitos de A-02.1 +
gobernanza). **No existe score de integridad artificial** y se prohíben sus
sustitutos ("confiabilidad", "riesgo", "honestidad medida"). Frase obligatoria
reproducida: "El instrumento actual de integridad de EvaluHR no debe
presentarse todavía como prueba psicométrica validada."

> Detalle: `07-integrity-output.md`.

---

## 8. Experiencia

Cuatro estados por dato (nunca promedio de trayectoria): **DECLARED**
(contexto; LOW máx; jamás cumplimiento) · **UNVERIFIED** (verificación
requerida/iniciada sin concluir; pendiente visible) · **VERIFIED**
(acreditación documental del dato con revisor/fecha/regla; jamás capacidad ni
conocimiento vigente) · **CONTRADICTED** (verificación negativa = resultado
legítimo; área de revisión forzada; nunca rechazo automático ni "mentira
probada" por el sistema).

> Detalle: `08-experience-formation-states.md`. Formación: mismo régimen
> (herencia A-02.2 §3.2–3.5: cursos ≠ evidencia de conocimiento).

---

## 9. Conflictos

Cuatro escenarios: **IPIP vs entrevista** (iguales; métodos distintos; ambos
visibles) · **conocimiento vs experiencia declarada** (el declarado es
contexto; no hay síntesis ni contradicción dura) · **experiencia declarada vs
documentación** (la verificación prevalece como registro; discrepancia
anotada con transparencia) · **instrumento vs instrumento** (solo hay
conflicto si ambos están VALID).

**REGLA: no promediar automáticamente · no seleccionar "la mejor evidencia" ·
no ocultar contradicciones · enviar a revisión humana.** Protocolo de 5 pasos
(detección determinista → marcado → área → revisión → cierre en trail);
sin jerarquía automática; la IA excluida (AI-X7).

> Detalle: `09-evidence-conflict.md`.

---

## 10. Consolidación

**AssessmentSummary**: consolidación descriptiva y trazable de los
CriterionResult — criterios evaluados (con estado) · evidencia disponible ·
evidencia insuficiente (con causas) · conflictos · áreas de revisión ·
limitaciones · **revisión humana requerida (siempre en la práctica)** ·
recomendación técnica opcional (solo si PASO 12 cumple) · rulesVersion ·
generado por reglas deterministas (nunca IA). Append-only.

**NO calcula todavía un score global** — y el score global está "fuera del
modelo" hasta una fase autorizada (condiciones previas de A-02.1 PASO 9).

> Detalle: `10-assessment-summary.md`.

---

## 11. Áreas de revisión

Disparadores deterministas **T1–T8** (sin evidencia · conocimiento
insuficiente · declarada no verificada · conflicto · criterio crítico sin
evidencia · resultado que requiere contextualización · revisión pendiente ·
integridad/competencias sin base). Salida explicable: `areaId` ·
`criterionId` · `reason` · `evidence` citada · `severity` · `reviewRequired`.

**`severity` = severidad de PROCESO** (brecha informativa, INFO/LOW/MEDIUM/
HIGH por disparador, sin ajustes manuales) — reconciliada con la prohibición
de A-02.1 sobre "nivel de gravedad" de la persona. Las áreas nunca rankean,
nunca se crean por IA, y se cierran solo por evidencia nueva, verificación o
revisión documentada.

> Detalle: `11-review-areas.md`; catálogo operativo: `review-area-rules.csv`.

---

## 12. Recomendación técnica

**"Recomendación técnica: Considerar para entrevista"** = orientación técnica
para decidir si conviene entrevistar. **NO significa**: contratar, apto,
no apto, candidato ideal, predicción de desempeño, pre-selección (tabla de
no-significados). Siempre acompañada de P7 ("Orientación técnica, no decisión
de contratación") y P6.

**Condiciones mínimas C1–C6 (todas)**: criterios aprobados · evidencia
parcial/complete utilizable · áreas que ameriten conversación · summary por
reglas deterministas · trazabilidad completa · lenguaje filtrado. Negaciones
duras: sin criterios, sin evidencia, sin áreas o con cadena rota **no
aparece**; nunca tiene forma negativa; nunca actúa como filtro automático.

> Detalle: `12-technical-recommendation.md`.

---

## 13. Revisión humana

**AssessmentReview**: `reviewId` · `reviewerId` (humano identificado;
separación de duties; nunca IA) · `reviewDate` · `decision` · `notes` ·
`evidenceReviewed` · `areasReviewed` · `overrideReason`.

La revisión puede: **confirmar** (CONFIRM) · **ampliar** (AMPLIFY: pedir más
evidencia) · **contextualizar** (CONTEXTUALIZE) · **contradecir** (CONTRADICT,
con lectura propia registrada junto a la del sistema) · **descartar**
(DISCARD, con motivación). **REGLA: la revisión NO altera retroactivamente el
resultado original del instrumento** — agrega una capa paralela identificada;
la corrección factual va por invalidación documentada + registro nuevo
(append-only); la lectura del revisor convive con la original.

> Detalle: `13-assessment-review.md`.

---

## 14. IA

**PERMITIDO** (con marcado y validación humana): **AI-2** resumir evidencia
existente citando `evidenceId`s · **AI-3b** convertir resultados técnicos en
lenguaje comprensible (sin conclusiones nuevas, sin suavizar INSUFFICIENT) ·
**AI-5** sugerir preguntas de entrevista basadas en áreas **ya identificadas**
(borradores para el entrevistador; no son evidencia ni áreas nuevas).

**PROHIBIDO**: **AI-X1** crear evidencia · **AI-X2** cambiar scores ·
**AI-X2b** rellenar datos faltantes · **AI-X3** decidir calidad · **AI-X4**
inventar validación · **AI-X5** emitir la decisión laboral · **AI-X6** crear
cortes/pesos · **AI-X7** resolver conflictos · **AI-X8** entrevistar ·
**AI-X9** interpretar rasgos como aptitudes · **AI-X10** convertir INSUFFICIENT
en resultado positivo o negativo.

> Detalle: `14-ai-boundaries.md`.

---

## 15. Trazabilidad

Cadena de **10 eslabones** con IDs y versiones en ambas direcciones:
PUESTO → CRITERIO → EVIDENCIA → INSTRUMENTO → VERSION → RESULTADO →
INTERPRETACIÓN → ÁREA DE REVISIÓN → REVISIÓN HUMANA → DECISIÓN DEL CLIENTE
(esta última nunca producida por el sistema). Reglas: IDs enlazables ·
versiones en todo eslabón · append-only · revisión sin reescritura ·
insuficiencias trazables con reasonCode · IA marcada · reconstrucción
auditable por punto temporal. Casos límite definidos (resultado sin criterio,
evidencia invalidada, conflicto cerrado, decisión sin revisión previa
= anomalía visible, cambios de versión a mitad de proceso).

> Detalle: `15-traceability.md`.

---

## 16. Matrices

**`interpretation-status-matrix.csv`** — 6 columnas (sourceType, status,
permittedOutput, prohibitedOutput, reviewRequired, notes) × 19 filas: las
combinaciones fuente×estado de todo el modelo (IPIP valid/insufficient,
conocimiento por escenario, competencias hoy/futuro, integridad, experiencia
en 4 estados, entrevista, documentación, tipo H, invalidada, conflicto,
resultado sin criterio). Validada con parser: 0 filas malformadas.

**`review-area-rules.csv`** — 7 columnas (ruleId, trigger, criterion, reason,
severity, reviewRequired, permittedMessage) × 12 reglas RA-01..RA-12, con
severidad de proceso determinista y mensajes permitidos literales. Validada
con parser: 0 filas malformadas, IDs únicos.

**`output-model.md`** — las cinco salidas (A instrumento · B criterio ·
C summary · D áreas · E recomendación) con qué es/cuándo/lenguaje/prohibido/
trazabilidad, matriz resumen y regla de producción A→B→D→C→E. **Sin score
global.**

---

## 17. Limitaciones

1. **Modelo no implementado**: nada de esto existe aún como funcionalidad;
   es especificación para fases futuras.
2. La corrección de `correctAnswer` sigue pendiente de autorización: la
   evidencia de conocimiento de puestos generados permanece INSUFFICIENT.
3. Competencias e integridad requieren expedientes/métodos aprobados antes de
   producir lecturas; el diseño de competencias del PASO 6 es condicional.
4. La capa de interpretación depende de que las reglas (M1–M6, R1–R9, T1–T8,
   RA-01..12, C1–C6) se implementen como código versionado y auditado; hoy
   solo existen como diseño.
5. La severidad de áreas y los disparadores usan categorías conceptuales
   ("criterio crítico") que requieren datos del Criterion Record real para
   operar.
6. La revisión humana sigue siendo la protección final; el sistema no puede
   forzar conductas (protección documental y de diseño, no coercitiva).
7. No existe criterio externo ni validez predictiva: ninguna salida del
   modelo afirma predicción de desempeño.
8. El score global ("Nivel de ajuste") no fue diseñado: su ausencia es
   deliberada y su futuro diseño exige fase autorizada con las 7 condiciones
   previas de A-02.1 y la regla INSUFFICIENT ≠ 0 heredada.

---

## 18. Riesgos

| # | Riesgo | Severidad | Mitigación documental |
|---|---|---|---|
| 1 | Implementación futura que trate INSUFFICIENT como 0 en resultados, summary o fórmula | ALTO | Regla maestra en 7 piezas + herencia explícita al "Nivel de ajuste" + auditoría por entrega |
| 2 | Presión comercial por "score global" o "% de ajuste" antes de fase autorizada | ALTO | Score global "fuera del modelo"; 16/16 en auditoría; lenguaje X prohibido |
| 3 | IA derivando en autoridad de facto (resúmenes que se vuelven evidencia, sugerencias que se vuelven áreas) | ALTO | AI-X1/X2b/X7/X10 + marcado + validación humana + regla de detección del PASO 14 §5 |
| 4 | Revisión humana que reescribe históricos (edición retroactiva informal) | MEDIO | PASO 13 §4: capa paralela; invalidación documentada como única vía; append-only |
| 5 | Severidad de áreas malinterpretada como "gravedad del candidato" | MEDIO | 11 §4: reconciliación explícita con A-02.1 + prohibiciones de presentación y ranking |
| 6 | Conflictos resueltos a mano sin registro o con jerarquía informal | MEDIO | PASO 9: protocolo, bloqueo interpretativo, cierre documentado; AI-X7 |
| 7 | Recomendación técnica usada como decisión o filtro automático | MEDIO | Condiciones C1–C6 + calificadores obligatorios + prohibición estructural (A-02.1 PASO 11) |
| 8 | Confusión de estados declarativos (tratar DECLARED como VERIFIED o CONTRADICTED como rechazo) | MEDIO | PASO 8: tabla de inferencias por estado + área forzada en CONTRADICTED |

---

## Conclusión

1. **Modelo de interpretación y salidas completo**: 5 estados biyectivos,
   InstrumentResult ≠ JobFit, CriterionResult cerrado por categoría, salidas
   por constructo (IPIP/conocimiento/competencias/integridad/experiencia),
   conflictos sin resolución automática, AssessmentSummary sin score global,
   áreas explicables con severidad de proceso, recomendación técnica
   condicionada, revisión humana no retroactiva, IA acotada, trazabilidad de
   10 eslabones — todo coherente con A-01.3/A-02.1/A-02.2.
2. **Auditoría 16/16 del encargo CUMPLE + 14/14 adicionales OK**; CSV
   validadas con parser; git confirma único cambio `?? evidence-a02-3/`.
3. **GO documental** para adoptar este modelo como especificación; **NO-GO**
   para citarlo como funcionalidad existente ni para iniciar fase posterior
   sin autorización.

---

### Índice del expediente (carpeta evidence-a02-3/)

| Archivo | Contenido |
|---|---|
| `00-master-dossier.md` | Este documento (dossier maestro, 18 secciones) |
| `01-evidence-states.md` | PASO 1 — Estados de evidencia (M1–M6) |
| `02-instrument-result.md` | PASO 2 — InstrumentResult (≠ JobFit) |
| `03-criterion-result.md` | PASO 3 — CriterionResult por categoría |
| `04-ipip-50-mx-output.md` | PASO 4 — Salida IPIP-50-MX |
| `05-knowledge-output.md` | PASO 5 — Conocimientos (escenarios A–E) |
| `06-competencies-output.md` | PASO 6 — Competencias (hoy/futuro condicional) |
| `07-integrity-output.md` | PASO 7 — Integridad INSUFFICIENT |
| `08-experience-formation-states.md` | PASO 8 — Experiencia/formación (4 estados) |
| `09-evidence-conflict.md` | PASO 9 — Conflictos (4 escenarios) |
| `10-assessment-summary.md` | PASO 10 — AssessmentSummary (sin score global) |
| `11-review-areas.md` | PASO 11 — Áreas de revisión (T1–T8, severidad de proceso) |
| `12-technical-recommendation.md` | PASO 12 — Recomendación técnica (C1–C6) |
| `13-assessment-review.md` | PASO 13 — AssessmentReview (5 acciones; no retroactiva) |
| `14-ai-boundaries.md` | PASO 14 — IA (AI-2/3b/5; AI-X1..X10) |
| `15-traceability.md` | PASO 15 — Trazabilidad de 10 eslabones |
| `interpretation-status-matrix.csv` | PASO 16 — Matriz fuente×estado (19×6) |
| `review-area-rules.csv` | PASO 16 — Reglas de áreas RA-01..RA-12 (12×7) |
| `output-model.md` | PASO 17 — Modelo de salidas A–E |
| `18-audit-checklist.md` | PASO 18 — Auditoría final (16/16 + 14/14) |
