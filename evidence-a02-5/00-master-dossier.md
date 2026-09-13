# EVALUHR — A-02.5
# DOSSIER MAESTRO — VALIDACIÓN DE CRITERIOS, CRITICIDAD Y CORRESPONDENCIA

> Documento de solo diseño y documentación metodológica. **NO se implementó
> nada**: código, schema, base de datos, IPIP-50-MX, scoring, preguntas, IA,
> contrato y aviso de privacidad INTOCABLES (verificado con git, PASO 19).
> **No se inventó ningún número**: sin puntos de corte, percentiles, pesos,
> umbrales, "perfil ideal" ni reglas de contratación — los valores futuros
> exigen fuente metodológica o validación específica (regla principal del
> encargo).
> Elaborado: 2026-09-09 · Fase A-02.5 · Base: expedientes A-01.3 (GO), A-02.1
> (GO documental), A-02.2 (GO documental), A-02.3 (GO documental) y A-02.4
> (GO documental, Modelo C).
> Este dossier resume y enlaza los documentos de `evidence-a02-5/`.

---

## Reglas maestras de la fase

1. **Nada numérico inventado** — cero cortes, percentiles, pesos, umbrales o
   perfiles ideales en las 21 piezas del expediente (verificado por barrido
   en PASO 19).
2. **Criterio sin validación no existe metodológicamente** — un criterio sin
   relación documentada con el puesto (jobRelevance) no recibe evidencia,
   no tiene criticidad y no participa del nivel de ajuste.
3. **La IA no participa** en relevancia, criticidad, fuerza de relación ni
   gobernanza de criterios (AI-X17..X19 + herencia A-02.1).

No se creó: APTO, NO APTO, decisión automática, predicción de desempeño,
probabilidad de éxito, candidato ideal, fórmula, peso, percentil, punto de
corte, umbral de personalidad.

---

## 1. Relevancia

`jobRelevance` es un atributo del **criterio** (criterio↔puesto), con
estados VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW. **VALID exige la cadena
completa R-REL-1..5**: elemento específico del registro de puesto vigente +
fuente admisible S1–S8 (descripción, funciones reales, responsabilidades,
conocimientos, competencias observables, requisitos legales, análisis de
expertos, evidencia empírica — la empírica refuerza, nunca sustituye) +
categoría A–E + revisión humana + aprobación con versión. Bibliotecas
genéricas e IA no son fuente. Cambio de puesto ⇒ revalidación.
> Detalle: `01-criterion-relevance.md`.

## 2. Criticidad

**CRITICAL / IMPORTANT / STANDARD** formalizados por nivel con definición,
requisitos, aprobador (humano designado, jamás IA), evidencia necesaria y
consecuencias metodológicas (NON/PARTIALLY/COMPENSABLE; hard gates; tope).
Prerrequisito absoluto: `jobRelevance = VALID`. La criticidad es **rol
estructural** del puesto, no puntaje ni peso; se declara en el Criterion
Record **antes** de ver candidatos; cambiarla = nueva versión con
gobernanza.
> Detalle: `02-criticality-levels.md`.

## 3. Criterios críticos

CRITICAL solo con calificador verificable **C-CRIT-1..4**: requisito
indispensable de una función central · obligación legal/regulatoria citada ·
conocimiento de seguridad · requisito explícito formal de la empresa
verificable. **REGLA C-D-CRIT**: ningún criterio de personalidad puede ser
CRITICAL (su única vía de evidencia es HYPOTHESIS); elevarlo exigiría
relación EVIDENCE-SUPPORTED + análisis funcional + panel + proporcionalidad
+ gobernanza — nada de eso existe hoy. Aprobar un CRITICAL sin instrumento
capaz activa hard gates permanentes de A-02.4 (decisión consciente).
> Detalle: `03-critical-criteria.md`.

## 4. Instrumentos

Mapeo completo instrumento→criterio (qué puede informar, qué NO, fuerza
actual, evidencia adicional necesaria) para: **IPIP-50-MX** (solo categoría
D; HYPOTHESIS como máximo) · **Prueba de conocimientos** (solo A; LIMITED
por K-INS-1) · **Competencias** (solo B futuro; NOT_SUPPORTED hoy) ·
**Integridad** (nada hoy; I-INT-1) · **Entrevista** (C con verificación
versionada; LIMITED/HYPOTHESIS). Transversalidad de categorías prohibida.
Tabla-resumen 5×5 en el documento; matriz completa en PASO 17.
> Detalle: `04-instrument-criterion-mapping.md`.

## 5. IPIP

Regla estricta: IPIP produce **evidencia de rasgos de personalidad y nada
más**; prohibido convertirlo en cumplimiento, aptitud, desempeño,
integridad, capacidad o "personalidad ideal". La única relación regulada
(rasgo→criterio del puesto) se clasifica **EVIDENCE-SUPPORTED /
HYPOTHESIS / NOT-SUPPORTED** sin usar umbrales: hoy **ninguna** relación es
EVIDENCE-SUPPORTED; el grado máximo es HYPOTHESIS (insumo de entrevista);
transversalidad = NOT-SUPPORTED. La clasificación describe la relación, no
a las personas.
> Detalle: `05-ipip-strict-rule.md`.

## 6. Conocimientos

Evidencia VALID exige checklist **K-VAL-1..8** (blueprint · relación con
funciones · reactivos vinculados · **correctAnswer validada** · scoring
reproducible · versión · revisión · suficiencia por escenario K1–K6),
todo-o-nada y por instrumento-version. **El problema `correctAnswer`
permanece documentado y SIN corregir** (fuera de alcance): hoy no existe
ninguna prueba apta para evidencia VALID; sin scoring válido →
INSUFFICIENT, jamás 0 (regla de oro).
> Detalle: `06-knowledge-valid-evidence.md`.

## 7. Competencias

Ruta NO_METHOD→VALID definida **sin implementar**:
competencia aprobada → indicador conductual → reactivo/escenario →
scoring con rúbrica versionada → evidencia → lectura descriptiva por
indicador (sin score compuesto por defecto), sujeta a las 6 puertas
P-COMP-1..6. Hoy: NOT_SUPPORTED (INSUFFICIENT sin excepciones); el
auto-reporte legacy sigue siendo solo autopercepción orientativa.
> Detalle: `07-competencies-path.md`.

## 8. Integridad

**Mantener INSUFFICIENT (I-INT-1)** hasta cumplir **I-VAL-1..8**
(instrumento identificado, fuente, derechos, constructo, scoring, evidencia
psicométrica, condiciones de uso, suficiencia para el objetivo) + gobernanza
+ justificación de proporcionalidad (PASO 14). Frase obligatoria
reproducida: "El instrumento actual de integridad de EvaluHR no debe
presentarse todavía como prueba psicométrica validada." Sin score artificial
ni sustitutos ("confiabilidad", "riesgo", "honestidad medida").
> Detalle: `08-integrity-hold.md`.

## 9. Experiencia

Cuatro estados heredados sin cambios (**DECLARED / UNVERIFIED / VERIFIED /
CONTRADICTED**) con su participación en el nivel de ajuste: solo **VERIFIED**
sostiene lectura utilizable de criterios C (acreditación del dato, bajo
C-EXP-1..4); DECLARED = contexto (LIMITED); UNVERIFIED = pendiente visible;
CONTRADICTED = área forzada, nunca rechazo automático. Formación: mismo
régimen (curso acreditado ≠ saber actual). Prohibido promediar/sumar
trayectoria.
> Detalle: `09-experience-formation-participation.md`.

## 10. Métodos de validación

Seis métodos conceptuales (análisis de puesto, análisis de contenido, juicio
de expertos, evidencia de criterio, evidencia de constructo, validez
relacionada con el puesto) con **aplicabilidad diferencial por categoría**
(matriz 6×5): contenido es la vía principal de A; puesto+expertos definen B;
C valida la regla de verificación; D solo tiene evidencia de constructo del
IPIP (no sostiene relación con puestos); E sin método. Toda validación se
registra (quiénes, método, fecha, huecos) y es **por criterio y puesto**.
> Detalle: `10-validation-methods.md`.

## 11. Fuerza de relación

Escala **STRONG / MODERATE / LIMITED / HYPOTHESIS / NOT_SUPPORTED** por
condiciones documentales (no numéricas). **Inventario honesto hoy: ningún
par instrumento→criterio alcanza MODERATE o STRONG** — el expediente define
la ruta para construirlos (K-VAL, P-COMP, I-VAL, ES-1..5). Asignar fuerza
sin evidencia está prohibido a la IA (**AI-X17**); la fuerza no se hereda
entre puestos; cambiarla es acto de gobernanza versionado.
> Detalle: `11-relationship-strength.md`.

## 12. Prohibiciones

Las cinco del encargo analizadas con su sustituto permitido: "Extraversión
alta = buen vendedor" ❌ · "Responsabilidad baja = mal empleado" ❌ ·
"Integridad 80 = honesto" ❌ · "IPIP alto = recomendado" ❌ · "Conocimiento
90 = contratar" ❌. Tabla general de conversiones prohibidas
(evidencia→veredicto de persona/decisión) + criterio de extensión: cualquier
conversión no listada se juzga con la misma regla.
> Detalle: `12-prohibited-inferences.md`.

## 13. Personalidad y criterios

Riesgo central: convertir rasgos psicológicos en requisitos laborales
arbitrarios (reificación, perfil ideal, estereotipos de rol, impacto
diferencial, deslizamiento semántico, autoridad de la IA). Salvaguardas
obligatorias **SG-1..SG-6**: relación funcional documentada · relevancia con
cadena completa · redacción sin estereotipos (el criterio describe la
función, no "el tipo de persona") · nunca CRITICAL ni filtros · revisión
humana · cero puntos de corte. Los criterios D son PREFERRED por defecto y
se formulan como "información de rasgo pertinente para [función]".
> Detalle: `13-personality-criteria-safeguards.md`.

## 14. Gobernanza

Proceso **proposal → evidence → expert review → approval → version →
publication** con separación de duties (proponente ≠ revisor ≠ aprobador),
salidas laterales REJECTED/SUSPENDED/RETIRED y **campos mínimos de
publicación**: `criterionId · jobId · rationale · source · approvedBy ·
version` (+ category, criticality, jobRelevance, fuerza, estado). Nuevos
límites de IA: **AI-X17** (fuerza), **AI-X18** (generar/prellenar criterios
o expedientes), **AI-X19** (criticidad). Anti-manipulación: prohibido ajustar
criticidad/fuerza/relevancia después de ver resultados.
> Detalle: `15-governance-process.md`; ciclo de vida: `publication-rules.md`.

## 15. Ejemplos

**Mesero y Vendedor SOLO COMO EJEMPLOS** (marcados EJEMPLO en todo el
expediente; nada publicable). Demuestran el mecanismo función→requisito→
criterio: M-1 higiene (A, CRITICAL por norma, LIMITED por K-INS-1) · M-2
amabilidad (D, STANDARD, HYPOTHESIS) · M-3 experiencia (C, LIMITED) · V-1
comunicación persuasiva (B, NOT_SUPPORTED por NO_METHOD) · V-2 ética con
efectivo (E, CRITICAL posible pero sin evidencia ⇒ gate) · V-3 producto (A,
IMPORTANT — misma categoría que M-1, criticidad distinta por el análisis del
puesto) + un rechazo registrado (perfil ideal) y un caso en REVIEW.
> Detalle: `16-examples-mesero-vendedor.md`.

## 16. Matrices

- **`criterion-validation-matrix.csv`** — 13 columnas (criterionId, jobId,
  category, criterion, jobRelevance, criticality, evidenceSource,
  instrument, relationshipStrength, validationMethod, approvedBy, version,
  status) × 8 filas EJEMPLO (Mesero/Vendedor + rechazo + revisión), todas
  marcadas EJEMPLO en `status` y `approvedBy=PENDIENTE`.
- **`instrument-criterion-strength.csv`** — 8 columnas (instrument,
  criterionCategory, relationship, strength, evidenceBasis,
  permittedInference, prohibitedInference, status) × 25 filas (5
  instrumentos × 5 categorías), con la verdad actual — distribución exacta
  de `status`: **19 PROHIBIDO · 1 VIGENTE-CON-RESTRICCIONES (IPIP→D) ·
  1 BLOQUEADO-HASTA-K-VAL (conocimientos→A) · 1 NO_METHOD (competencias→B) ·
  1 INSUFFICIENT-OBLIGATORIO (integridad→E) · 2 PENDIENTE-GUIA-ESTRUCTURADA
  (entrevista→B, con fuerza HYPOTHESIS; entrevista→C, con fuerza LIMITED)**.
- Ambas validadas con parser: 0 filas malformadas, columnas exactas (PASO 19).

## 17. Riesgos

| # | Riesgo | Severidad | Mitigación documental |
|---|---|---|---|
| 1 | Implementación futura que use criterios "en caliente" sin cadena R-REL/K-VAL | ALTO | Compuertas PUB-1..8 + matrices + auditoría por entrega |
| 2 | "Perfil ideal" de facto por presión comercial (recortar personas contra rasgos) | ALTO | Regla C-D-CRIT + SG-1..6 + X1–X15 + sin umbrales (regla principal) |
| 3 | Fuerza de relación inflada o asignada por IA | ALTO | Condiciones documentales por nivel + AI-X17 + evidenceBasis citada |
| 4 | CRITICAL inflados (gates crónicos) o vaciados para evitar gates | ALTO | Calificadores C-CRIT-1..4 + PUB-5 (declaración de consecuencia) + anti-manipulación |
| 5 | "Arreglo rápido" de correctAnswer sin K-VAL (rompe la ruta VALID) | MEDIO | Reserva documentada + corrección solo autorizada + checklist completo |
| 6 | Instrumentos de información delicada (integridad) introducidos sin proporcionalidad | ALTO | PASO 14: justificación por finalidad/puesto + I-VAL-7 + gobernanza legal |
| 7 | Ejemplos Mesero/Vendedor copiados como biblioteca real | MEDIO | Marcas EJEMPLO en todas las piezas + PASO 19 ítem 16 |
| 8 | Confusión publicación (gobernanza) ≠ funcionalidad (software) | MEDIO | publication-rules §5 + limitaciones |
| 9 | Criterios D estereotipados en su redacción | MEDIO | Reglas de redacción §3 del PASO 13 + revisión experta |

## 18. Limitaciones

1. **Diseño, no función**: nada implementado; pasar a operativo exige
   gobernanza real, puestos analizados de verdad y fases autorizadas.
2. **Inventario de brechas**: ningún par instrumento→criterio alcanza
   MODERATE/STRONG hoy; STRONG es una definición sin instancias.
3. `correctAnswer` sigue sin corregir (fuera de alcance): la categoría A
   bloqueada a LIMITED/INSUFFICIENT hasta K-VAL completo.
4. Competencias (NO_METHOD) e integridad (I-INT-1) sin ruta corta: exigen
   métodos/expedientes completos.
5. No existe evidencia de criterio para puestos EvaluHR; las rutas
   "futuras" requieren datos que hoy no existen.
6. **No se definieron umbrales, pesos ni percentiles** (deliberado): las
   decisiones cuantitativas pendientes corresponden a gobernanza con
   validación específica, no a esta fase.
7. La protección contra uso indebido es documental y de diseño (no
   coercitiva): la gobernanza opera solo si la empresa la ejerce.
8. Referencias normativas (LFT, LFPDPPP, normas oficiales) son conceptuales
   e ilustrativas; A-02.5 no es asesoría jurídica.

## 19. Conclusión

1. **Cadena de validación completa**: puesto → criterio (relevancia
   demostrada) → criticidad (calificada y aprobada por humanos) →
   instrumento→criterio (correspondencia con fuerza honesta) → evidencia
   suficiente para lectura (checklists K-VAL/P-COMP/I-VAL/C-EXP) —
   integrada sin contradicciones con A-02.1..A-02.4 y con la regla
   INSUFFICIENT ≠ 0 intacta.
2. Auditoría PASO 19: **16/16 CUMPLE** (detalles y barridos en
   `19-audit-checklist.md`); git confirma cambio único `?? evidence-a02-5/`.
3. **GO documental** para adoptar este diseño como especificación de
   validación de criterios; **NO-GO** para: citarlo como funcionalidad
   existente, usar los ejemplos como criterios reales, introducir cualquier
   número de corte/peso/umbral, o iniciar A-02.6 sin autorización.

---

### Anexo A — Datos sensibles (PASO 14)

Sin nuevas categorías. Nota documental: ciertos instrumentos/respuestas
(integridad futura, preguntas de entrevista mal orientadas, respuestas
libres, rasgos de personalidad) pueden implicar información especialmente
delicada; su necesidad/proporcionalidad debe justificarse **por la finalidad
y el puesto** antes de introducirse; aviso y contrato intocables.
> Detalle: `14-sensitive-data-note.md`.

### Anexo B — Auditoría (PASO 19)

16 verificaciones del encargo, método de verificación por ítem, barridos
realizados y verificación independiente.
> Detalle: `19-audit-checklist.md`.

---

### Índice del expediente (carpeta evidence-a02-5/)

| Archivo | Contenido |
|---|---|
| `00-master-dossier.md` | Este documento (dossier maestro, 19 secciones + 2 anexos) |
| `01-criterion-relevance.md` | PASO 1 — Relevancia del criterio (R-REL-1..5; fuentes S1–S8) |
| `02-criticality-levels.md` | PASO 2 — Criticidad CRITICAL/IMPORTANT/STANDARD formalizada |
| `03-critical-criteria.md` | PASO 3 — Calificadores C-CRIT-1..4; regla C-D-CRIT (personalidad) |
| `04-instrument-criterion-mapping.md` | PASO 4 — Instrumento→criterio por instrumento (tabla 5×5) |
| `05-ipip-strict-rule.md` | PASO 5 — IPIP: EVIDENCE-SUPPORTED / HYPOTHESIS / NOT-SUPPORTED |
| `06-knowledge-valid-evidence.md` | PASO 6 — Conocimientos: K-VAL-1..8; correctAnswer documentado |
| `07-competencies-path.md` | PASO 7 — Competencias: cadena NO_METHOD→VALID (P-COMP-1..6) |
| `08-integrity-hold.md` | PASO 8 — Integridad INSUFFICIENT (I-VAL-1..8) |
| `09-experience-formation-participation.md` | PASO 9 — Experiencia/formación en el ajuste (C-EXP-1..4) |
| `10-validation-methods.md` | PASO 10 — Métodos de validación (aplicabilidad por categoría) |
| `11-relationship-strength.md` | PASO 11 — Fuerza de relación (escala + inventario honesto) |
| `12-prohibited-inferences.md` | PASO 12 — Prohibiciones explícitas con sustitutos |
| `13-personality-criteria-safeguards.md` | PASO 13 — Personalidad: riesgos R1–R6; salvaguardas SG-1..6 |
| `14-sensitive-data-note.md` | PASO 14 — Datos sensibles (nota, sin nuevas categorías) |
| `15-governance-process.md` | PASO 15 — Gobernanza proposal→publication; AI-X17..X19 |
| `16-examples-mesero-vendedor.md` | PASO 16 — Ejemplos Mesero/Vendedor (EJEMPLO) |
| `criterion-validation-matrix.csv` | PASO 17 — Matriz de validación de criterios (13 col × 8 filas EJEMPLO) |
| `instrument-criterion-strength.csv` | PASO 17 — Matriz instrumento×categoría (8 col × 25 filas) |
| `publication-rules.md` | PASO 18 — Ciclo de vida DRAFT→RETIRED + compuertas PUB-1..8 |
| `19-audit-checklist.md` | PASO 19 — Auditoría final (16/16 + adicionales) |
