# EVALUHR — A-02.2
# DOSSIER MAESTRO — ESPECIFICACIÓN DE EVIDENCIA PARA CRITERIOS DEL PUESTO

> Documento de solo documentación metodológica. NO modifica código, schema,
> base de datos, scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones,
> frontend, contrato ni aviso de privacidad.
> Elaborado: 2026-09-09 · Fase A-02.2 · Base: expedientes A-01.3 (GO) y
> A-02.1 (GO documental).
> Este dossier resume y enlaza los documentos de `evidence-a02-2/`.

---

## 1. Definición de evidencia

**EvidenceRecord** — registro estructurado, trazable y versionado del
resultado de aplicar un método de obtención a un criterio aprobado (A-02.1),
con calidad declarada y estado de revisión; append-only.

14 campos mínimos explicados uno a uno: `evidenceId` (único, no reutilizable,
`EVD-<criterionId>-<NNN>`) · `criterionId` (criterio APROBADO; resultados de
instrumento sin criterio no alimentan interpretación) · `category`
(taxonomía A-02.1, coincidencia obligatoria con el criterio) · `source`
(SYSTEM_INSTRUMENT / HUMAN_INTERVIEW / DOCUMENT_VERIFICATION /
CANDIDATE_DECLARATION / GOVERNANCE_REGISTRY — **sin valor "AI"**) ·
`instrument` (debe estar en la matriz aprobada) · `instrumentVersion`
(sin versión → máximo LOW) · `value` (crudo y tipado, sin interpretaciones) ·
`unit` (RAW_POINTS_10_50, CORRECT_OVER_TOTAL, BOOLEAN_VERIFIED, DECLARATIVE,
QUALITATIVE_NOTE, NONE) · `quality` (PASO 3) · `status` (ACTIVE→INVALIDATED,
única transición) · `timestamp` (UTC) · `reviewRequired` · `reviewStatus`
(REVIEWED exige revisor+fecha+nota) · `approvedBy` (humano o referencia a
aprobación ex-ante; jamás IA).

> Detalle: `01-evidence-record.md`. Regla de la fase: **primero evidencia,
> después interpretación, después (fase posterior) fórmula.**

---

## 2. Tipos (A–H)

| Tipo | Nombre | Alimenta | Estado |
|---|---|---|---|
| A | TEST / INSTRUMENTO | PERSONALIDAD (IPIP-50-MX) | Activo (único tipo A válido) |
| B | CONOCIMIENTO | CONOCIMIENTOS | Con reserva (correctAnswer; PASO 5) |
| C | COMPETENCIA | HAB/COMP | INSUFFICIENT hoy (sin método) |
| D | EXPERIENCIA | EXP/FORM | Declarado LOW / verificado MEDIUM-HIGH |
| E | FORMACIÓN | EXP/FORM | Ídem |
| F | ENTREVISTA HUMANA | Transversal (contextual en D/E de taxonomía) | Humano; MEDIUM máximo |
| G | DOCUMENTACIÓN | Transversal (EXP/FORM) | Binario verificado |
| H | EVIDENCIA INSUFICIENTE | Cualquiera | Estado, no contenido: "no mide nada" |

Cada tipo definido por: qué mide, qué no mide, cómo se obtiene, quién la
genera, calidad mínima. Matriz tipo×categoría cierra combinaciones inválidas.

> Detalle: `02-evidence-types.md`.

---

## 3. Calidad

Niveles **HIGH / MEDIUM / LOW / INSUFFICIENT** con criterios objetivos y
deterministas. Principios duros: la calidad es del registro/método, no de la
persona; **no es validez predictiva**; no se inventa evidencia científica;
**existir no equivale a ser válido** (los legacy sin expediente no suben de
nivel). Casos mandatorios: integridad → INSUFFICIENT; conocimiento sin
correctAnswer → INSUFFICIENT; competencias → INSUFFICIENT (sin método).
Declaración honesta del IPIP: HIGH **como evidencia de rasgos** — y nada más.

> Detalle: `03-evidence-quality.md`. Matriz operativa: `evidence-quality-matrix.csv`.

---

## 4. IPIP

**IPIP-50-MX → evidencia sobre rasgos de personalidad. Y nada más.**
Registro típico: 5 puntajes brutos (10–50), completitud por factor (sin
prorrateo), visual 0–100 no percentil. Prohibiciones absolutas reproducidas y
auditadas: IPIP → desempeño ❌ · capacidad profesional ❌ · honestidad ❌ ·
decisión de contratación ❌ · "candidato ideal" ❌ · predictor automático ❌ ·
sustituto de entrevista ❌.

> Detalle: `04-ipip-evidence.md`.

---

## 5. Conocimiento

Evidencia válida exige K1–K6 (reactivos del contenido del criterio,
`correctAnswer` persistida y verificable, puntuación objetiva, administración
completa, sin anomalías, versión).

**Problema documentado (verificado por inspección de solo lectura):**
`generateTemplatesForPosition` (src/lib/generate-templates.ts:181) no
persiste `correctAnswer` en las preguntas generadas (el banco en memoria lo
declara; `db.question.create` líneas 300–309 lo omite; el banco genérico
314–333 ni lo tiene y es de estilo auto-reporte) → `knowledgeScore=0`
artefactual.

**Respuesta formal del encargo: NO — una evaluación con knowledgeScore=0 por
falta de correctAnswer NO puede considerarse evidencia válida.**
Regla K-INS-1: esos registros → `INSUFFICIENT` (`QUALITY_FAIL`), sin tratar
el 0 como lectura. **No se corrigió** (0 cambios de código).

> Detalle: `05-knowledge-evidence.md`.

---

## 6. Competencias

Evidencia válida = competencia aprobada + método conductual versionado +
registro indicador por indicador + evaluador humano identificado + revisión.
Cadena definida (no implementada): competencia → indicador conductual →
evidencia → fuente → revisión. **Hoy no existe método aprobado → evidencia C
= INSUFFICIENT (`NO_METHOD`).** No se crearon preguntas ni scoring. El
auto-reporte legacy no cuenta como competencia.

> Detalle: `06-competency-evidence.md`.

---

## 7. Integridad

Regla I-INT-1: el instrumento de integridad **no dispone de evidencia
suficiente para tratarse como instrumento psicométrico validado** →
**quality = INSUFFICIENT** hasta que exista expediente suficiente (checklist
de 6 prerrequisitos heredado de A-02.1). El dato crudo se conserva; lo que no
puede hacer la evidencia es sostener lectura del criterio. Frase obligatoria
de lenguaje reproducida y auditada.

> Detalle: `07-integrity-evidence.md`.

---

## 8. Experiencia

Separación estricta **declarado vs. verificado**: declarado
(`CANDIDATE_DECLARATION`, `DECLARATIVE`) → máximo LOW, revisión siempre;
verificado (`DOCUMENT_VERIFICATION`, `BOOLEAN_VERIFIED` con revisor+fecha+
regla) → MEDIUM/HIGH según método. Regla D-EXP-1: nunca "declaración
verificada por el candidato". Verificaciones negativas (`false`) son
resultados legítimos. Años declarados no implican competencia ni conocimiento
vigente.

> Detalle: `08-experience-education-evidence.md`.

---

## 9. Formación

Mismo régimen declarado/verificado. Certificaciones con folio/emisor/vigencia;
cursos = dato de formación (no evidencia de conocimiento: eso exige prueba de
categoría A). "Conocimientos declarados" solo contexto (LOW); el criterio de
conocimiento queda INSUFFICIENT hasta prueba válida.

> Detalle: `08-experience-education-evidence.md` (§3.2–3.5).

---

## 10. Entrevista

**ENTREVISTA ≠ prueba psicométrica** — produce evidencia humana independiente
(`HUMAN_INTERVIEW`), con autor identificable, estructura por criterio y
separación hechos-observados/interpretación. Calidad máxima MEDIUM;
`reviewRequired=true` siempre. No produce puntajes, no valida ni invalida
tests por sí sola, no decide. La IA no entrevista ni redacta notas (AI-X8).

> Detalle: `09-interview-evidence.md`.

---

## 11. Conflictos

Definición operativa (registros válidos del mismo criterio con lecturas
opuestas — p. ej., tendencia IPIP vs. comportamiento observado en entrevista).
**NO resolver automáticamente**: ni promedio, ni ganador, ni ponderación.
Protocolo: detección determinista → marcado (`conflictRef`, revisión
forzada) → salida como "Área que requiere revisión" → **revisión humana**
documentada → cierre en el audit trail sin tocar los registros originales.
Sin jerarquía automática entre fuentes (AI-X7 excluye a la IA).

> Detalle: `10-conflict-rules.md`.

---

## 12. Missing data

**Regla de oro: INSUFFICIENT ≠ 0.** Los 4 casos del encargo (instrumento
falta, sección sin contestar, falla técnica, evidencia insuficiente) +
adicionales (declinación, invalidación, criterio nuevo) con `reasonCode`:
NOT_ADMINISTERED / PARTIAL_RESPONSE / TECH_FAILURE / DECLINED / NO_METHOD /
QUALITY_FAIL. Prohibido imputar, prorratear, "promediar con lo que hay",
usar la ausencia como señal negativa u ocultarla. Distinción explícita entre
respuesta elegida y ausencia. La regla queda heredada obligatoriamente para
el futuro nivel de ajuste.

> Detalle: `11-missing-data-rules.md`; catálogo de salida: `insufficient-evidence-rules.md`.

---

## 13. IA

**IA puede** (con validación humana y marcado en trail): proponer preguntas
futuras (solo DRAFTS), resumir evidencia existente (citando evidenceId),
estructurar información (sin alterar value/quality/status), ayudar en
análisis documental (la verificación sigue siendo humana).
**IA no puede**: inventar evidencia · transformar "sin evidencia" en score ·
decidir calidad psicométrica · declarar validación · decidir contratación ·
crear puntos de corte por sí misma · resolver conflictos · entrevistar ·
interpretar rasgos como aptitudes. `source` no tiene valor "AI".

> Detalle: `12-ai-boundaries.md`.

---

## 14. Auditoría

**12/12 verificaciones obligatorias CUMPLEn · 10/10 adicionales OK**
(`17-audit-checklist.md`). Git: único cambio `?? evidence-a02-2/` — código,
schema, scoring, preguntas, IA, contrato y aviso intactos. CSV validado con
parser (8×8, 0 malformadas). Barridos: sin fórmulas/pesos/cortes; "APTO" solo
en listas de prohibición; literales clave presentes (INSUFFICIENT ≠ 0 ×5,
K-INS-1, I-INT-1, ENTREVISTA ≠ prueba psicométrica, protocolo de conflictos,
audit trail 7 puntos).

---

## 15. Limitaciones

1. Modelo **no implementado**: nada de esto existe aún como funcionalidad;
   sirve como especificación para fases futuras.
2. La corrección de `correctAnswer` sigue pendiente de autorización: la
   evidencia de conocimiento de puestos generados permanece INSUFFICIENT.
3. Competencias y entrevista estructurada requieren diseño y aprobación de
   métodos antes de producir evidencia válida.
4. La calidad de evidencia no equivale a validez predictiva laboral: EvaluHR
   no posee estudios de criterio externo.
5. El tratamiento de integridad no cambia mientras el checklist de
   prerrequisitos (A-02.1 07 §3) esté incompleto.
6. La protección contra uso indebido (p. ej., empresa tratando INSUFFICIENT
   como 0) es documental y de diseño, no coercitiva.
7. A-02.2 no define cálculos: el punto "qué cálculo posterior" del audit
   trail es obligación preventiva de las fases siguientes.

---

## 16. Riesgos

| # | Riesgo | Severidad | Mitigación documental |
|---|---|---|---|
| 1 | Tratar INSUFFICIENT como 0 en implementaciones futuras | ALTO | Regla de oro ×5 piezas + heredada al nivel de ajuste + auditoría por entrega |
| 2 | Presión comercial para "subir" calidad de legacy/integridad | ALTO | Criterios objetivos + gobernanza (solo cambio con registro) + declaración honesta (03 §1) |
| 3 | Confundir calidad del registro con validez predictiva | ALTO | Aviso estructural en 03 §1 y en cada nivel; herencia A-01.3 |
| 4 | Uso de knowledgeScore=0 como "no sabe" | ALTO | K-INS-1 + mensaje oficial de insuficiencia |
| 5 | IA derivando en fuente de facto (resúmenes que se convierten en "evidencia") | MEDIO | `source` sin AI + marcado + validación humana + AI-X1 |
| 6 | Conflictos resueltos "a mano" sin registro | MEDIO | Protocolo PASO 10 + audit trail; revisión documentada |
| 7 | Mezcla declarado/verificado en un registro | MEDIO | D-EXP-1 + calidades máximas por estado |
| 8 | Invalidaciones informales (sin autor ni motivo) | MEDIO | Transición única ACTIVE→INVALIDATED + motivo + autor (PASO 16) |

---

## 17. Conclusión

1. **Modelo de evidencia completo**: definición formal, 8 tipos, 4 niveles de
   calidad con reglas honestas, tratamiento por constructo, conflictos,
   missing data, límites de IA, audit trail y gobernanza — todo coherente con
   A-01.3/A-02.1.
2. **Regla fundamental cumplida**: se definió QUÉ es evidencia; la
   interpretación queda esquematizada pero sin diseño; **ninguna fórmula** se
   creó (12/12 en auditoría).
3. **Honestidad de datos**: el problema correctAnswer quedó verificado y
   documentado con precisión, con su consecuencia formal (NO = evidencia
   inválida → INSUFFICIENT), sin corrección fuera de alcance.
4. **GO documental** para adoptar este modelo como especificación; **NO-GO**
   para citarlo como funcionalidad existente ni para iniciar fase posterior
   sin autorización.

---

### Índice del expediente (carpeta evidence-a02-2/)

| Archivo | Contenido |
|---|---|
| `00-master-dossier.md` | Este documento (dossier maestro, 17 secciones) |
| `01-evidence-record.md` | PASO 1 — EvidenceRecord formal |
| `02-evidence-types.md` | PASO 2 — Tipos A–H |
| `03-evidence-quality.md` | PASO 3 — Niveles de calidad |
| `04-ipip-evidence.md` | PASO 4 — Evidencia del IPIP-50-MX |
| `05-knowledge-evidence.md` | PASO 5 — Conocimiento + problema correctAnswer |
| `06-competency-evidence.md` | PASO 6 — Evidencia de competencias |
| `07-integrity-evidence.md` | PASO 7 — Integridad INSUFFICIENT |
| `08-experience-education-evidence.md` | PASO 8 — Experiencia/formación (declarado vs. verificado) |
| `09-interview-evidence.md` | PASO 9 — Evidencia humana de entrevista |
| `10-conflict-rules.md` | PASO 10 — Conflictos |
| `11-missing-data-rules.md` | PASO 11 — Missing data (INSUFFICIENT ≠ 0) |
| `12-ai-boundaries.md` | PASO 12 — Límites de IA |
| `13-audit-trail.md` | PASO 13 — Pista de auditoría |
| `evidence-quality-matrix.csv` | PASO 14 — Matriz de calidad de evidencia |
| `insufficient-evidence-rules.md` | PASO 15 — Reglas de insuficiencia (R1–R9) |
| `16-evidence-governance.md` | PASO 16 — Gobernanza de la evidencia |
| `17-audit-checklist.md` | PASO 17 — Auditoría final (12/12 + 10 OK) |
