# EVALUHR — A-02.4
# DOSSIER MAESTRO — DISEÑO DEL MODELO DE NIVEL DE AJUSTE (JOB FIT)

> Documento de solo diseño metodológico. **NO se implementó nada**: código,
> schema, base de datos, IPIP-50-MX, preguntas, scoring de instrumentos, IA,
> contrato y aviso de privacidad INTOCABLES (verificado con git).
> Esta fase sí diseñó fórmulas conceptuales y modelos matemáticos (mandato del
> encargo), siempre como **PROPUESTA** con valores ilustrativos marcados
> "SOLO EJEMPLO — NO PRODUCTIVO" y umbrales "SIN DEFINIR — A VALIDAR".
> Elaborado: 2026-09-09 · Fase A-02.4 · Base: expedientes A-01.3 (GO), A-02.1
> (GO documental), A-02.2 (GO documental) y A-02.3 (GO documental).

---

## Reglas maestras de la fase (verificadas en auditoría 13/13)

1. **INSUFFICIENT ≠ 0** — la ausencia o insuficiencia de evidencia entra al
   modelo como **exclusión declarada, tope o gate**; jamás como puntuación
   (presente en 11 piezas del expediente).
2. **No compensación indebida** — un resultado alto en un criterio **no
   compensa automáticamente** la ausencia de evidencia en un criterio crítico
   (regla formal de anticompensación, PASO 15).

No se creó: APTO, NO APTO, contratación automática, rechazo automático,
predicción de desempeño, probabilidad de éxito, candidato ideal, score 0–100
en el producto, puntos de corte de instrumento.

---

## 1. Definición

**JobFit** (nombre interno; nombre de producto oficial: **"Nivel de ajuste
respecto de los criterios definidos para el puesto"**) = medida de
correspondencia entre los criterios aprobados del puesto y la evidencia
disponible, calculada **solo sobre CriterionResults** por reglas deterministas
versionadas: `JobFit = 𝒜({(cᵢ, Kᵢ, sᵢ, qᵢ, corrᵢ)})` sujeta a gates, regla de
anticompensación y honestidad de insuficiencias. **No se llama** aptitud,
capacidad laboral ni probabilidad de éxito. Propiedades formales: anclaje a
criterios previos, no sustitución de constructos, determinismo versionado,
explicabilidad total, revisión humana obligatoria. Las 7 condiciones previas
de A-02.1 quedan mapeadas 1:1 (diseño completo; aprobación pendiente).
> Detalle: `01-fit-definition.md`.

## 2. Modelos comparados

**A** (score ponderado): descartado — convierte la ausencia en 0 o la hace
desaparecer; la compensación indebida es *propiedad* del modelo, no riesgo.
**B** (cumplimiento por criterios): aporta la exigencia por criterio, pero sin
composición deja ambigüedad e invita a cortes de facto. **C** (híbrido:
criterio→evidencia→calidad→estado→cumplimiento→nivel): recomendado por las 10
dimensiones evaluadas (transparencia, explicabilidad, datos faltantes,
críticos, compensación, auditabilidad, implementación, jurídico,
discriminación, metodológico) — **no** por facilidad de programación (es el
más costoso de implementar).
> Detalle: `02-model-comparison.md`; matriz: `fit-model-comparison.csv`.

## 3. Criticidad

**CRITICAL / IMPORTANT / STANDARD**, declarada en el Criterion Record aprobado
del puesto (análisis de puesto F1–F5; aprobación humana documentada; versión).
Prohibido que la IA la determine (AI-X12) o que se fije post hoc. Mapeo
PROPUESTA con requiredOrPreferred. Un criterio sin criticidad declarada no
participa. La criticidad es rol estructural (bloquea/topa/pesa), no puntaje.
> Detalle: `03-criticality.md`.

## 4. Evidencia (estados integrados)

Efecto de cada estado (A-02.3) sobre el ajuste: **VALID** contribuye ·
**LIMITED** solo contexto (nunca cumplimiento) · **INSUFFICIENT** exclusión
declarada o gate (jamás 0) · **INVALID** sin evidencia utilizable ·
**PENDING_REVIEW** no contribuye hasta cierre. **INSUFFICIENT distingue dos
lecturas**: *no evaluable* (estructural: NO_METHOD/NOT_ADMINISTERED/
TECH_FAILURE/DECLINED) vs *evidencia insuficiente* (procedural:
PARTIAL_RESPONSE/QUALITY_FAIL/R9) — ninguna dice nada de la persona.
> Detalle: `04-evidence-status-integration.md`; matriz: `fit-state-rules.csv`.

## 5. Compensabilidad

Derivada de la criticidad: **NON-COMPENSABLE** (críticos: la brecha no se
compensa por nada) · **PARTIALLY_COMPENSABLE** (importantes: tope + brecha
visible) · **COMPENSABLE** (estándares: exclusión declarada). El ejemplo del
encargo: conocimiento excelente + personalidad elevada **no** compensan un
crítico sin evidencia — por definición. Condiciones de compensación legítima:
VALID HIGH/MEDIUM, sin gates, sin cruces de categoría, siempre explicada.
> Detalle: `05-compensability.md`.

## 6. Gates

**Hard gates G1–G6** (crítico sin lectura utilizable; conflicto crítico;
revisión crítica pendiente; invalidación de única evidencia crítica; sin
criterios aprobados; sin reglas versionadas) → el sistema **no produce
nivel**: produce el **resultado incompleto**. **Soft gate** (PROPUESTA) para
importantes: nivel acotado. Falta de evidencia en un crítico ⇒ jamás nivel
(ni siquiera BAJO: la ausencia no es evidencia negativa). Gates solo se abren
con evidencia/revisión documentada.
> Detalle: `06-gating.md`.

## 7. Score

Evaluación de 4 opciones (sin número / nivel cualitativo / 0–100 / ambos).
**Recomendación: opción B** — nivel cualitativo con resultado incompleto; el
score 0–100 queda **excluido del producto** (falsa precisión, cortes de
facto, ranking, riesgo jurídico; reconciliación incómoda con INSUFFICIENT ≠
0). No fue una decisión de UX: es metodológica y de riesgo. Fallback: opción
A. Métricas internas ≠ score del candidato.
> Detalle: `07-score-global-decision.md`.

## 8. Nivel cualitativo

ALTO/MEDIO/BAJO **conceptualmente apropiados** bajo 5 condiciones (gates
primero; asignación determinista versionada; explicación + calificadores P6/P7
obligatorios; sin mapeo a decisiones; fallback disponible). **Umbrales no
creados todavía** — parámetros θ "SIN DEFINIR — A VALIDAR" con aprobación de
gobernanza.
> Detalle: `09-qualitative-level.md`.

## 9. Missing data

El resultado incompleto **"Evidencia insuficiente para determinar el nivel de
ajuste."** aparece con gates activos, lista los criterios que lo provocan (con
causa y reasonCode), guía a RH (completar/verificar/cerrar revisión/protocolo
de conflictos) y **puede** acompañarse de "Considerar para entrevista" (vía
humana de completación) bajo C1–C6. Sin ninguna evidencia utilizable: solo
resultado incompleto + áreas.
> Detalle: `10-incomplete-result.md`.

## 10. Conflictos

Integración del protocolo A-02.3 sin cambios: **no se resuelven
matemáticamente** (IPIP≠entrevista, declarado≠documentación, instrumento A≠B);
el criterio entra PENDING_REVIEW; efecto por criticidad (gate/tope/exclusión);
ambas fuentes visibles; cierre solo por revisión humana documentada;
recomposición append-only.
> Detalle: `11-conflict-integration.md`.

## 11. IA

**No puede**: cambiar pesos (AI-X11), criticidad (AI-X12), resolver missing
data (AI-X13), conflictos (AI-X14), convertir evidencia insuficiente
(AI-X15), generar el nivel autónomamente (AI-X16) + heredadas AI-X1..X10.
**Puede**: explicar el resultado (AI-17), resumir evidencia existente (AI-2),
sugerir preguntas de entrevista sobre áreas ya identificadas (AI-5) — siempre
marcado y validado por humanos. El nivel es producto exclusivo de reglas
deterministas versionadas.
> Detalle: `12-ai-boundaries.md`.

## 12. Fórmula conceptual

`𝒜 = GATES → EXCLUSIONES → PERFIL → TOPES → NIVEL`, con correspondencia
`corrᵢ` por categoría (D no produce cumplimiento; B/E hoy SIN_LECTURA),
contribución estructural Wᵢ = CriticalWeight × QualityFactor, agregación
Qᴾ solo sobre criterios VALID, topes por brechas IMPORTANT y nivel con
umbrales θ. **Todos los valores numéricos = "SOLO EJEMPLO — NO PRODUCTIVO";
θ = "SIN DEFINIR — A VALIDAR".** Propiedades auto-verificadas: exclusión no
sumativa, anticompensación doble barrera, sin cortes de instrumento.
> Detalle: `13-conceptual-formula.md`.

## 13. Casos

8 casos conceptuales con resultado/nivel/áreas/entrevista: **A** todo válido
(nivel producido) · **B** standard insuficiente (exclusión + área) · **C**
importante insuficiente (tope, nunca ALTO) · **D** crítico insuficiente
(resultado incompleto) · **E** conflicto (PENDING_REVIEW; gate si crítico) ·
**F** IPIP alto + conocimiento insuficiente (el IPIP nunca compensa) · **G**
conocimiento alto + integridad INSUFFICIENT (no compensa; frase obligatoria)
· **H** todo declarado sin verificar (sin lecturas VALID → resultado
incompleto).
> Detalle: `fit-scenarios.md`.

## 14. Anticompensación

**Regla formal de no-compensación de brechas críticas**: con un crítico sin
lectura utilizable (o conflicto/revisión pendiente), `FitLevel` **no se
produce** — ninguna vía de compensación lo salva. Corolarios: tampoco "BAJO"
(la ausencia no es evidencia negativa); el resto del perfil sigue visible;
topes para importantes. Verificación paso a paso del caso del encargo
(personalidad alta + conocimiento alto + experiencia alta + crítico
INSUFFICIENT → resultado incompleto, jamás "ALTO").
> Detalle: `15-anticompensation.md`.

## 15. Métricas

M1 % criterios evaluables · M2 % evidencia válida · M3 # críticos evaluados ·
M4 # insuficientes (por causa) · M5 # conflictos · M6 # evidencia pendiente ·
M7 % criterios verificados (+ M8–M10 de gobernanza). **Internas**: diagnósticos
de proceso, nunca recomendación laboral, nunca score del candidato, nunca
ranking; usos previstos: validación de θ, detección de sesgo, mantenimiento.
> Detalle: `16-internal-metrics.md`.

## 16. Explicabilidad

Explicación obligatoria basada en **criterios + evidencia + estado** (6
bloques: criterios, evidencia, estado/exclusiones/gates/topes, completitud,
limitaciones, revisión). **Regla de reproducibilidad**: la estructura +
estados determinan el nivel; lo oculto (parámetros internos) no puede cambiar
el resultado. Sin jerga interna, sin datos de terceros. La IA solo reformula
(AI-17).
> Detalle: `17-explainability.md`.

## 17. Matrices

`fit-model-comparison.csv` (9 columnas × 3 modelos, recomendado = C
PROPUESTA) · `fit-state-rules.csv` (6 columnas × 5 estados con efecto sobre
el ajuste) · `fit-scenarios.md` (8 casos). Validadas con parser (0
malformadas).
> Detalle: PASO 18 de este dossier.

## 18. Riesgos

| # | Riesgo | Severidad | Mitigación documental |
|---|---|---|---|
| 1 | Implementación futura trata INSUFFICIENT como 0 o renormaliza | ALTO | Regla en 11 piezas + exclusión no-sumativa + auditoría por entrega |
| 2 | El nivel cualitativo opera como "apto/no apto" de facto | ALTO | Calificadores obligatorios + prohibiciones X1–X7 + sin mapeo a decisiones + revisión humana |
| 3 | Topes/umbrales θ fijados sin validación (opinionados) | ALTO | "SIN DEFINIR — A VALIDAR" + V4 + gobernanza con datos |
| 4 | Criticidades manipuladas post hoc para "hacer encajar" | ALTO | Criticidad pre-declarada y versionada + AI-X12 + anti-manipulación |
| 5 | Score 0–100 reintroducido por presión de UX/comercial | MEDIO | Decisión argumentada (07) + fallback documentado + auditoría |
| 6 | IA derivando en autoridad de facto del nivel | MEDIO | AI-X11..X16 + regla de detección + marcado |
| 7 | Confusión "no evaluable" = "insuficiente" = malo | MEDIO | Dos lecturas definidas con reasonCodes (04 §3) + lenguaje |
| 8 | Gates crónicos invisibles o abiertos por presión | MEDIO | Gates visibles con causa + M3/M8 + apertura solo documentada |

## 19. Limitaciones

1. **Diseño, no función**: nada implementado; pasar a operativo exige V1–V7
   (aprobación, criticidades reales, reglas de correspondencia por criterio,
   validación de θ, lenguaje, código versionado, casos ejecutados).
2. Los umbrales/topes/pesos propuestos son ilustrativos: **no** pueden
   citarse como valores del producto.
3. La validación de θ exige datos reales que hoy no existen (puestos,
   criterios, evaluaciones reales); la reserva correctAnswer de conocimientos
   limita la cobertura de la categoría A (K-INS-1).
4. Competencias e integridad permanecen SIN_LECTURA hasta métodos/expedientes
   aprobados: su participación en 𝒜 es hoy exclusión o gate.
5. La protección contra uso indebido (nivel usado como decisión) sigue siendo
   documental y de diseño.
6. Las métricas detectan sesgo solo si se monitorean; no hay garantía
   automática.
7. El nombre interno "JobFit" no debe aparecer en producto: el nombre oficial
   es el de A-02.1 (P2).

## 20. Recomendación

1. **Adoptar el Modelo C (híbrido) como arquitectura** del futuro nivel de
   ajuste, con salida de **nivel cualitativo + resultado incompleto** (sin
   score 0–100 en producto) — sujeto a V1–V7.
2. Congelar la **estructura** (gates, exclusiones, topes, anticompensación,
   explicabilidad, IA sin autoridad) como requisito de cualquier
   implementación futura.
3. **No fijar θ** hasta validar con datos reales y aprobar en gobernanza.
4. Integrar el nivel como **extensión del eslabón INTERPRETACIÓN** de la
   trazabilidad de A-02.3 y de la salida C (AssessmentSummary).
5. **GO documental** para adoptar este diseño como especificación; **NO-GO**
   para citar el nivel de ajuste como funcionalidad existente, para fijar
   umbrales, o para iniciar A-02.5 sin autorización.

---

### Índice del expediente (carpeta evidence-a02-4/)

| Archivo | Contenido |
|---|---|
| `00-master-dossier.md` | Este documento (dossier maestro, 20 secciones) |
| `01-fit-definition.md` | PASO 1 — Definición formal de JobFit (≠ aptitud/capacidad/probabilidad) |
| `02-model-comparison.md` | PASO 2 — Comparación A/B/C (10 dimensiones) |
| `03-criticality.md` | PASO 3 — Criticidad CRITICAL/IMPORTANT/STANDARD |
| `04-evidence-status-integration.md` | PASO 4 — Estados de evidencia en el ajuste (no evaluable vs insuficiente) |
| `05-compensability.md` | PASO 5 — Compensabilidad por criticidad |
| `06-gating.md` | PASO 6 — Hard gates G1–G6 + soft gate |
| `07-score-global-decision.md` | PASO 7 — ¿Necesitamos un número? (opción B recomendada) |
| `08-prohibited-outputs.md` | PASO 8 — Prohibiciones del modelo |
| `09-qualitative-level.md` | PASO 9 — Conveniencia de ALTO/MEDIO/BAJO (sin umbrales) |
| `10-incomplete-result.md` | PASO 10 — Resultado incompleto |
| `11-conflict-integration.md` | PASO 11 — Conflictos (integración A-02.3) |
| `12-ai-boundaries.md` | PASO 12 — IA (AI-X11..X16; AI-17) |
| `13-conceptual-formula.md` | PASO 13 — Fórmula conceptual 𝒜 (valores SOLO EJEMPLO) |
| `fit-scenarios.md` | PASO 14/18 — Casos A–H |
| `15-anticompensation.md` | PASO 15 — Regla formal de anticompensación |
| `16-internal-metrics.md` | PASO 16 — Métricas internas M1–M10 |
| `17-explainability.md` | PASO 17 — Explicabilidad (criterios+evidencia+estado) |
| `fit-model-comparison.csv` | PASO 18 — Matriz de comparación (3×9) |
| `fit-state-rules.csv` | PASO 18 — Reglas de estado sobre el ajuste (5×6) |
| `proposed-fit-model.md` | PASO 19 — Propuesta final consolidada (V1–V7) |
| `20-audit-checklist.md` | PASO 20 — Auditoría final (13/13 + 13/13) |
