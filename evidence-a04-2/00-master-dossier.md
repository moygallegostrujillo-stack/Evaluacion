# A-04.2 — EXPEDIENTE MAESTRO / MASTER DOSSIER

# EVALUHR — A-04.2 — DECISIÓN METODOLÓGICA: ¿DEBE EXISTIR INTEGRIDAD EN V1?
# SOLO ANÁLISIS Y DOCUMENTACIÓN — NO IMPLEMENTAR (cumplido)

Fecha: 2026-09-11 (America/Mexico_City). Alcance: análisis de decisión.
Restricciones cumplidas: NO se implementaron instrumentos, NO se crearon
preguntas, NO se creó scoring, NO se modificó schema, código, IPIP, Knowledge,
JobFit, contrato ni aviso. Verificación en §15.

Base documental: expediente A-04.1 (evidence-a04-1/, 14 archivos, fechado
2026-09-10) + inspección read-only del código (referencias exactas en §7 y §8).

---

## 1. NECESIDAD (PASO 1, parte A)

¿Qué problema de selección pretende resolver Integridad?

El problema candidato es uno solo y acotado: **anticipar conductas
contraproducentes en el trabajo (CWB) — daño a recursos, robo, violación de
normas — que las medidas actuales no capturan de forma directa**. No es
"medir honestidad" en abstracto.

Comparación de qué problema resuelve cada componente del stack de EvaluHR:

| Componente | Problema que resuelve | Límite respecto a CWB |
|---|---|---|
| Conocimiento | ¿Sabe hacer el trabajo? (validado, patrón canonical A-03.5) | Nada directo: competencia ≠ conducta |
| Experiencia / formación | Historial verificable de desempeño previo | No anticipa conducta contraproducente |
| Competencias (futura) | Comportamiento esperado en situaciones del puesto | Solapa parcialmente; es predictivo declarado, no medido aún |
| Personalidad (Big Five demo) | Estilo general; Conciencia correlaciona con desempeño y algo de CWB | C no es integridad: H aporta varianza propia en la literatura, pero eso no traslada al ítem demo actual |
| Entrevista | Juicio humano situado; explora señales del expediente | Subjetiva, no estandarizada para CWB |
| Integridad | Señal directa (de la CLASE de instrumentos) de riesgo CWB | Único componente cuyo criterio natural ES la conducta contraproducente |

Conclusión de necesidad: existe UN problema real que hoy ningún componente
cubre de manera directa (riesgo CWB). Eso establece necesidad *potencial*,
no justificación de implementación: la justificación exige evidencia (§4),
derechos (§5) y condiciones (§11).

## 2. VALOR (PASO 1, parte B)

Qué información adicional aportaría realmente una evaluación de integridad:

- **Potencial:** señal de riesgo CWB a nivel de grupo (meta-análisis: ρ ≈ .47
  con CWB, ≈ .41 con desempeño; Ones et al. 1993; Lau 2023 positiva para
  workplace deviance; debate Van Iddekinge 2012 sobre validez incremental de
  desempeño — evidence-a04-1/04).
- **Condicional:** el valor existe solo si (a) el instrumento específico es
  psicométricamente defendible, (b) aporta varianza no capturada por Conciencia
  (validez incremental), (c) hay contexto mexicano (hoy NOT ESTABLISHED).
- **Valor de mercado:** el mercado mexicano comercializa "pruebas de
  honestidad" (ARHCA, Armstrong, psigma, alva, evaluar TRUST): existe
  expectativa de producto. Sin manual público de esos proveedores, esa
  expectativa no es evidencia de validez.
- **Valor como producto transparente:** un indicador de evidencia con
  lenguaje probabilístico y revisión humana tiene valor de diferenciación
  responsable frente a competidores opacos.

Veredicto de valor: REAL pero CONDICIONAL. No justifica implementar ahora.

## 3. REDUNDANCIA (PASO 2)

¿Agrega información independiente o vuelve a medir lo ya medido?

Análisis contra el stack actual (verificado en código, read-only):

- **Responsabilidad / autocontrol / cumplimiento:** el demo ya mide Big Five
  (10 ítems, incluida Conciencia) con peso 0.25 en overallScore
  (`evaluations/route.ts`, calculateScores). Los ítems INTEGRITY_RULES e
  INTEGRITY_RESPONSIBILITY del demo ("sigo las reglas", responsabilidad) son
  conceptualmente cercanos a facetas de Conciencia auto-reportada → **doble
  medición sin justificación incremental actual**.
- **Honestidad declarada / deseabilidad social:** los ítems INTEGRITY_HONESTY
  son declarativos de alta deseabilidad ("devuelvo cambio de más" tipo): miden
  en parte la intención de presentar una imagen virtuosa. Sin control de
  deseabilidad, la sección es vulnerable a faking (overt: fake good d = 0.90,
  coaching d = 1.32 — evidence-a04-1/04 §1.5).
- **Personalidad general:** la literatura (HEXACO H) sostiene que H predice
  deshonestidad/CWB MÁS ALLÁ de Conciencia y Amabilidad — ese es el único
  argumento serio contra la redundancia total; PERO aplica a la escala H
  validada (IPIP-HEXACO), no a los 10 ítems caseros del demo, cuya validez es
  NO ESTABLECIDA.
- **Regla de decisión contra la redundancia:** no se justifica mantener/añadir
  medición de integridad sin demostrar validez incremental frente a Conciencia
  en piloto (Gate-5). Doble medición sin justificación = prohibida por esta
  auditoría como criterio metodológico.

## 4. EVIDENCIA (PASO 3)

Nivel de evidencia disponible por nivel, separando EVIDENCIA SUFICIENTE /
LIMITADA / NO ESTABLECIDA:

| Nivel | Estado | Fundamento |
|---|---|---|
| A. Constructo | **EVIDENCIA SUFICIENTE** | Honesty-Humility y CWB son constructos establecidos en la literatura (Ashton & Lee 2007; metas CWB). "Integridad" como paraguas es heterogéneo — exige declaración de constructo (Gate-1) |
| B. Instrumento | **EVIDENCIA LIMITADA** | IPIP-HEXACO: representación public-domain con respaldo de literatura H, sin manual comercial; instrumentos comerciales: sin manuales públicos; ítems demo propios: **NO ESTABLECIDA** |
| C. Población laboral | **EVIDENCIA LIMITADA** | Metas sobre trabajadores, mayoritariamente EE.UU./inglés; heterogeneidad entre tests documentada |
| D. México | **EVIDENCIA NO ESTABLECIDA** | Sin validación psicométrica mexicana pública de un instrumento de integridad (A-04.1/05: NOT ESTABLISHED; solo uso académico HEXACO con criterio de bienestar, adaptaciones ES no-MX, proveedores sin manuales) |
| E. Predicción de criterios | **SUFIENTE para clase→CWB (ρ≈.47) con debate; LIMITADA/DEBATIDA clase→desempeño (2012); NO ESTABLECIDA para el instrumento propio de EvaluHR hasta piloto** | Ones 1993; Van Iddekinge 2012 vs réplica Ones 2012; Lau 2023 |

Regla operativa derivada: la evidencia de CLASE no se traslada automáticamente
al instrumento específico de EvaluHR. Para uso en V1 falta, como mínimo, el
piloto (Gates 4–6, 8).

## 5. DERECHOS (PASO 4)

Ruta jurídicamente clara para uso comercial, por opción (detalle en
evidence-a04-1/06-rights.md; prohibido asumir dominio público por
disponibilidad online):

| Opción | Derechos | Ruta comercial clara |
|---|---|---|
| IPIP-HEXACO | PUBLIC DOMAIN (verificado en ipip.ori.org, leído; citación Goldberg 1999/2006) | SÍ, condicionada: uso en SaaS comercial en México **REQUIERE REVISIÓN LEGAL** (condición C1). Los nombres comerciales derivados (HEXACO-PI-R) NO cubren las representaciones IPIP |
| SJT propio | Contenido original de EvaluHR | SÍ — derechos propios claros; la carga es de validación, no de licencia |
| CWB-C | Copyright Spector & Fox 2002; uso gratuito CONDICIONADO a compartir resultados (investigación); comercial **UNKNOWN** | NO para producto comercial sin contacto/autorización del autor. Usable SOLO como criterio interno de validación |
| Instrumento comercial | COMMERCIAL LICENSE | SÍ vía contrato; costos **NO PÚBLICOS — REQUIERE COTIZACIÓN**; definir alcance (marcas, scoring, modificación, reproducción) |
| Desarrollo propio | Propiedad de EvaluHR | SÍ — sin derechos de terceros; exige expediente psicométrico propio |

Ninguna opción recomendable con derechos UNKNOWN. Ningún precio inventado.

## 6. COSTO (PASO 5)

Comparación conceptual (sin cifras: ninguna fuente pública de precios → se
registra NO PÚBLICO; prohibido inventar precios):

| Escenario | Costo directo | Costo oculto / esfuerzo | Riesgo de costo |
|---|---|---|---|
| NO IMPLEMENTAR | 0 | Se conserva deuda del demo; pérdida de señal CWB y de expectativa de mercado | 0 |
| DESARROLLAR | Sin licencia | Adaptación (jueces nativos), redacción/versión de ítems, piloto, análisis psicométrico, manual, gobernanza — esfuerzo interno no cuantificado aquí | Sobrecosto de validación si se subestima |
| LICENCIAR | Recurrente **NO PÚBLICO** | Integración, dependencia, capacitación, posible transferencia de datos a tercero | Opacidad de pricing y de scoring |
| COMBINAR (base pública + SJT propio + criterio CWB-C condicionado) | Sin licencia comercial | Esfuerzo de desarrollo + gobernanza multi-instrumento + obligación de compartir resultados (CWB-C) | Complejidad de gobernanza |

Lectura: para un producto en demo, el escenario de menor costo/riesgo es NO
IMPLEMENTAR; el de mejor relación valor/riesgo si se decide avanzar es
COMBINAR sobre base public-domain (coherente con OPTION A de A-04.1 y con la
ruta de validación de OPTION B aquí).

## 7. IMPACTO EN LA PLATAFORMA (PASO 6)

Componentes nuevos que requeriría una implementación futura (NINGUNO se
construye en esta fase):

- **Frontend:** tarjeta de indicador separado con lenguaje de evidencia
  ("indicador de evidencia, no prueba validada"), sin UX de rechazo; visible
  solo con consentimiento FULL (patrón actual ConsentView/EvaluationView).
- **Banco de reactivos:** ítems versionados con hash, origen (AI_DRAFT/HUMAN),
  aprobación humana, publicación solo SYSTEM (patrón Knowledge canonical
  `knowledge-canonical.ts`).
- **Scoring:** transparente, versionado, determinista; semántica INSUFFICIENT
  ≠ 0; sin vetos; ningún peso oculto.
- **Versionado:** Assessment/ItemVersion + registro de cambios (AuditLog ya
  existe como modelo).
- **Consentimiento:** finalidad específica de integridad en aviso y
  consentimiento; re-consent si cambio material (`consent-version.ts` ya
  soporta versiones materiales); **REQUIERE REVISIÓN LEGAL**.
- **Expediente metodológico:** manual (qué mide, cómo se califica, qué NO
  significa), ficha de instrumento, dictámenes, reportes de piloto.
- **Gobernanza:** roles de aprobación; autoría IA limitada a borradores.
- **Auditoría:** registrar publicaciones, cambios de scoring y accesos.
- **Explicación al RH:** reportes con lenguaje probabilístico relativo,
  prohibición de etiquetas morales, guía de uso (entrevista, referencias) y
  de no-uso (veto).

Hallazgo de plataforma (estado actual, verificado read-only): la sección
INTEGRIDAD del demo YA pondera `overallScore` (0.15 con 4 secciones; 0.40 sin
knowledge; `evaluations/route.ts` y gemelo en `public/apply/route.ts`),
contradiciendo el espíritu del flag "orientative, never auto-filter" que solo
gobierna ítems/fortalezas, no la fórmula. `integrityScore` es un escalar sin
evidencia-status (a diferencia de `knowledgeScore` separado con
`evidenceStatus`). Esta deuda NO se corrige aquí (prohibición de modificar
código) — queda como DECISIÓN PENDIENTE para la fase de implementación.

## 8. RIESGO (PASO 7 — decisión automática; síntesis metodológica de A-04.1)

Cadena analizada: **integridadScore → overallScore (JobFit) → rechazo**.

Por qué es problemática (sin diseñar fórmula):

1. **Inferencia grupo→individuo:** los metas respaldan predicción a nivel de
   grupo; leer un score individual como veredicto de conducta es
   sobreinterpretación (evidence-a04-1/08, A8).
2. **Faking:** en overt/declarativo, fake good d = 0.90 y coaching d = 1.32 →
   falsos negativos (deshonesto con score alto) y falsos positivos (honesto
   penalizado) — daño laboral y exposición legal.
3. **Datos sensibles alimentando una decisión:** convertir un indicador de
   datos sensibles en input automático de rechazo eleva el riesgo jurídico
   (proporcionalidad, finalidad, transparencia) → **REQUIERE REVISIÓN LEGAL**.
4. **Sin normas mexicanas:** umbrales serían arbitrarios; no hay base para
   puntos de corte "mexicanos" (NOT ESTABLISHED).
5. **Opacidad actual:** el peso 0.15/0.40 no está expuesto al RH como decisión
   metodológica documentada; un peso oculto sobre datos sensibles es la peor
   configuración posible para transparencia.
6. **Efecto agregado:** aunque no exista "rechazo automático" explícito en el
   código (recommendation es guidance: PERFIL_COMPLETO/PARCIAL/PENDIENTE), el
   score sí orders/ránking implícito — el riesgo de decisión automatizada
   comienza en la ponderación, no solo en el veto.

Conclusión PASO 7: la cadena integridad→JobFit→rechazo es inaceptable en el
estado actual y solo sería evaluable tras Gates 1–9; la revisión humana debe
ser obligatoria en todo el flujo.

Riesgos metodológicos heredados (síntesis A-04.1/08): faking, deseabilidad,
falsos positivos/negativos, uso laboral indebido, sesgo cultural, ambigüedad
de ítems, sobreinterpretación. Mitigaciones: personality-based/SJT en vez de
overt, sin veto, adaptación local, lenguaje de evidencia, exclusión de ítems
delicados.

## 9. ALTERNATIVAS (PASOS 8 y 9)

### PASO 8 — Escenario V1 SIN instrumento de integridad

¿Puede EvaluHR funcionar correctamente sin integridad? **SÍ, funcionalmente:**

- Conocimientos: validados con patrón canonical (separación knowledgeScore,
  INSUFFICIENT ≠ 0, versionado, publicación SYSTEM).
- Competencias futuras: diseño planificado fuera de esta fase.
- IPIP (personalidad): el demo ya mide Big Five (estilo IPIP, 10 ítems) —
  cubre estilo general incluida Conciencia; su formalización IPIP-HEXACO es
  una decisión futura independiente.
- Experiencia y formación: ya en el expediente del candidato.
- Entrevista: módulo presente (InterviewSchedule), juicio humano.
- Revisión humana: principio rector ya implementado (guidance-only).

Costos del escenario: 0. Riesgos: mínimos. Pérdidas: señal CWB directa,
expectativa de mercado ("integridad"), y la deuda del módulo demo queda sin
resolver (el demo seguirá mostrando la sección orientativa con su peso actual,
documentada como limitación).

**La V1 SIN integridad es viable y defendible.** Lo que NO es defendible es
dejar la deuda del demo sin documentación — por eso este expediente existe.

### PASO 9 — Alternativa piloto (SOLO propuesta — no se implementa)

**"Indicador experimental de Integridad Laboral"** — propuesta:

- Naturaleza: indicador SEPARADO de overallScore/JobFit (patrón de separación
  aprobado en A-03.5 para knowledgeScore), etiquetado "experimental, no
  validado, no decisorio", con consentimiento específico y revisión humana.
- Base candidata: IPIP-HEXACO (dominio público) adaptado al español mexicano
  + viñetas SJT propias en borrador (AI_DRAFT → aprobación humana).
- Criterio de validación interno: CWB-C bajo condiciones del autor
  (investigación; compartir resultados) u criterio interno equivalente.

Evidencia mínima requerida ANTES de activarse (resumen operativo de Gates):

1. Declaración de constructo aprobada (Gate-1).
2. Ficha de instrumento + plan de validación versionados (Gate-2).
3. Memorando de derechos + dictamen legal para uso SaaS (Gate-3, Gate-7) —
   **REQUIERE REVISIÓN LEGAL**.
4. Piloto con población laboral mexicana: análisis de ítems, α (umbral interno
   propuesto ≥ .70), control de deseabilidad, validez incremental vs
   Conciencia (Gates 4–6).
5. Replicación + regresión de consentimiento/purga/no-veto (Gate-8).
6. Expediente completo y aprobación humana registrada (Gate-9).
7. Decisión explícita y documentada sobre relación con JobFit (Gate-10).

Mientras esa evidencia no exista, el indicador permanece NO ACTIVADO.

## 10. DECISIÓN (PASO 10)

**OPTION B — IMPLEMENTAR SOLO DESPUÉS DE VALIDACIÓN** (ruta de gates).

Justificación:
- OPTION A (implementar ahora) — RECHAZADA: evidencia de instrumento propio NO
  ESTABLECIDA; México NOT ESTABLISHED; derechos pendientes de dictamen; riesgo
  de decisión automatizada sobre datos sensibles; redundancia no resuelta.
- OPTION C (no implementar en V1) — EVALUADA como fallback legítimo (y estado
  metodológico de partida), pero no resuelve la deuda del demo ni deja ruta de
  avance; se adopta como resultado si algún Gate (3 o 7) resulta innavigable.
- OPTION D (licenciar posteriormente) — DIFERIDA: sin costos públicos, sin
  manuales, sin evidencia MX verificable; opción futura si el piloto demuestra
  valor y hay presupuesto.
- OPTION B — SELECCIONADA: única ruta que respeta la evidencia disponible,
  separa desarrollo técnico de validación psicométrica, mantiene Integridad
  fuera de JobFit hasta aprobación completa (Gates 1–10), y es coherente con
  el veredicto GO-WITH-CONDITIONS de A-04.1.

Matriz completa: `evidence-a04-2/integrity-v1-decision-matrix.csv`.

## 11. CONDICIONES (PASO 11 — criterios de GO)

Transiciones objetivas (detalle en `evidence-a04-2/integrity-activation-gates.md`):

- **NO IMPLEMENTADA → APROBADA PARA PILOTO:** GATE-1 (constructo), GATE-2
  (instrumento), GATE-3 (derechos), GATE-7 (revisión legal), GATE-9
  (gobernanza) — todos PASADOS con evidencia documentada.
- **APROBADA PARA PILOTO → APROBADA PARA USO PRODUCTIVO:** GATE-1..GATE-10
  completos (añade evidencia psicométrica, contexto laboral con validez
  incremental, contexto México, validación interna con regresión, y decisión
  explícita de impacto en JobFit).
- Fallo de GATE-3 o GATE-7 → estado terminal: NO IMPLEMENTAR (mantener demo
  orientativo documentado).

## 12. GOBERNANZA (PASO 12)

- **Quién aprueba:** responsable metodológico + product owner (personas);
  asesoría legal para Gates 3 y 7; comité para uso productivo. **La IA no
  aprueba nada** (coherente con gobernanza existente: publicación solo
  SYSTEM; IA = AI_DRAFT sin write path).
- **Evidencia que debe existir:** expediente metodológico versionado —
  declaración de constructo; ficha de instrumento; memorando de derechos;
  dictamen legal; protocolo y reportes de piloto; análisis de validez
  incremental; reporte de replicación; manual de interpretación; decisión de
  JobFit.
- **Revisión legal:** obligatoria antes de piloto (derechos + tratamiento de
  datos sensibles + finalidad + transparencia + decisiones asistidas) —
  **REQUIERE REVISIÓN LEGAL** en todo el perímetro.
- **Validación metodológica:** separada del desarrollo técnico; criterios
  definidos a priori en protocolo; revisión por responsable metodológico.
- **Pruebas que deben ejecutarse antes de cualquier activación:** consent-gate
  (KNOWLEDGE_ONLY no ve sección; OPTION_B_VIOLATION server-side), re-consent
  material, purga al retiro, determinismo de scoring, versionado/hash,
  ausencia de rutas de veto automático, auditoría de publicación.

## 13. IA (PASO 14)

Papel PERMITIDO de la IA (borradores y apoyo, nunca autoridad):
- Redactar situaciones/ítems como **AI_DRAFT** para revisión humana.
- Proponer adaptaciones lingüísticas al español mexicano (borrador).
- Generar texto explicativo para RH (borrador sujeto a aprobación).
- Apoyo analístico descriptivo (tablas, resúmenes de expediente).

Regla base (intocable): la IA **NO** puede:
- Diagnosticar honestidad de una persona.
- Declarar "integridad" de un candidato como hecho.
- Crear un score psicológico definitivo o autoritativo.
- Decidir si hubo fraude.
- Determinar la contratación o el rechazo.

Estado en código (verificado read-only): la gobernanza ya codificada
("AI code has no write path", publicación SYSTEM-only, origin='AI_DRAFT',
publishedBy sin autoridad IA) es el patrón a replicar para cualquier
instrumento de integridad futuro. Coherente con evidence-a04-1/09.

## 14. CONCLUSIÓN

- **¿Debe existir Integridad en V1?** Como **instrumento implementado y
  ponderado: NO**. Como **ruta de trabajo con condiciones: SÍ** — la necesidad
  es real (riesgo CWB no cubierto por ningún otro componente), el valor es
  condicional, y la única defensa responsable es la validación previa.
- **Decisión:** OPTION B (implementar solo después de validación), con
  OPTION C como fallback si los Gates 3/7 fallan.
- **Regla JobFit:** Integridad NO entra en JobFit/overallScore mientras no
  esté metodológicamente aprobada, versionada, validada y legalmente revisada
  (Gates 1–10). La deuda actual del demo (peso 0.15/0.40 sobre datos
  sensibles sin expediente) queda DOCUMENTADA como decisión pendiente para
  fase de implementación futura — no corregida aquí por prohibición expresa.
- **Estado de esta fase:** el análisis se completa; NO se implementó nada.

## 15. AUDITORÍA FINAL (A-04.2)

- [x] No se implementó instrumento
- [x] No se crearon preguntas
- [x] No se creó scoring
- [x] No se modificó IPIP
- [x] No se modificó Knowledge
- [x] No se modificó JobFit (ni overallScore ni pesos)
- [x] No se modificó código (cero edits; solo lectura con Grep/Read/Explore)
- [x] No se inventaron derechos (clasificación con fuente primaria; UNKNOWN
      donde corresponde: CWB-C comercial, HEXACO oficial)
- [x] No se inventaron precios (todo costo comercial = NO PÚBLICO — REQUIERE
      COTIZACIÓN)
- [x] Evidencia México separada (NOT ESTABLISHED documentado en §4)
- [x] Evidencia laboral separada (nivel C vs D vs E en §4; clase ≠ instrumento
      propio)
- [x] No se afirmó validación inexistente (instrumento propio = NO ESTABLECIDA;
      demo = sin fundamento)
- [x] Opción NO IMPLEMENTAR evaluada (OPTION C en §9 y §10 + matriz CSV)
- [x] Condiciones de activación definidas (GATE-1..10 con transiciones)

## 16. ÍNDICE DEL EXPEDIENTE A-04.2

| Archivo | Contenido | PASO |
|---|---|---|
| 00-master-dossier.md | Este documento (14 secciones + auditoría) | 1–14, 17 |
| integrity-v1-decision-matrix.csv | Matriz comparativa de opciones (11 columnas) | 15 |
| integrity-activation-gates.md | GATE-1..GATE-10 y transiciones de estado | 11, 16 |

Referencias cruzadas: evidence-a04-1/ (expediente completo A-04.1), en
particular 04-scientific-evidence.md, 05-mexico-evidence.md, 06-rights.md,
08-risk-analysis.md, 09-ai-boundaries.md, 11-recommendation.md.
