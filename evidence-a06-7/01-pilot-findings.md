# EVALUHR — A-06.7 — 01 · Hallazgos del Piloto como Insumos (PASO 1)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Fase: A-06.7 Refinamiento de Rúbrica y Calibración (post-piloto).
> Fecha: 2026-09-12 (America/Mexico_City). Regla absoluta: NO modificar código, schema, datos productivos;
> NO activar entrevistas; NO publicar preguntas; NO crear scoring/pesos/cortes; NO implementar JobFit;
> NO modificar overallScore, IPIP, Knowledge, Integrity, Personality, recomendaciones, contrato, aviso.

## 1. Regla (PASO 1)

Utilizar exclusivamente: **A-06.2 / A-06.3 / A-06.4 / A-06.5 / A-06.6** — y especialmente los
hallazgos del piloto metodológico A-06.6. No crear competencias, indicadores ni preguntas nuevas
durante esta fase. A-06.7 perfecciona materiales existentes (preguntas, probes, indicadores,
rúbrica, ejemplos de evidencia, reglas de calibración) — **solo diseño + auditoría, NO implementar**.

## 2. Insumos utilizados

| Fase | Insumo | Estado | Uso en A-06.7 |
|---|---|---|---|
| A-06.2 | 11 competencias candidatas + 23 indicadores conductuales | DRAFT / CANDIDATE | Base conceptual; NO se crean nuevos |
| A-06.3 | Metodología BDI/STAR + rúbrica cualitativa (NO_EVIDENCE..STRONG) | Método APROBADO; instancia DRAFT | Rúbrica v2 por indicador (PASO 4-5) |
| A-06.4 | Auditoría legal/privacidad (LFT Art 3, LFPDPPP 2025, filtros) | Análisis APROBADO; G8+G10 legal CONDICIONAL | Filtro de proporcionalidad/legalStatus (PASO 13-14) |
| A-06.5 | Banco candidato: 10 preguntas + 25 probes + estados de evidencia + reglas IA/trazabilidad/versionado | DRAFT / EXAMPLE | Objeto del refinamiento |
| A-06.6 | Piloto metodológico: 20 casos sintéticos, resultados por pregunta/probe/consistencia/gates | EVIDENCIA EXPERIMENTAL | **Insumo principal de A-06.7** |

## 3. Resultados del piloto A-06.6 (insumo principal)

### 3.1 Casos y preguntas

| Elemento | Resultado A-06.6 |
|---|---|
| Casos sintéticos | **20** (MESERO 10: M-A..M-J; VENDEDOR 10: V-A..V-J) — 10 patrones de respuesta × 2 puestos; datos SINTÉTICOS |
| Calidad de preguntas | 8/10 **STRONG**, 2/10 **ACCEPTABLE** (Q-VEN-COL-001, Q-VEN-TRV-002), 0 REJECT |
| Decisiones por pregunta | **8 KEEP_FOR_REVIEW + 2 REVISE + 0 REJECT. Ninguna ACTIVE.** |
| Probes | **24/25 VALID**, **1 LIMITED** (PROBE-UNI-004 "¿Qué aprendiste?"), 0 REJECT, 1 PROPUESTO nuevo (PROBE-COL-001-D, DRAFT) |
| Consistencia inter-evaluador | **19/20 acuerdos (95%)**; 1 divergencia: **M-G** |
| STAR | Ausencia de Action (o Action parcial) **nunca** produjo SUPPORTED/STRONG — regla cumplida 20/20 (100%) |
| Estados de evidencia | INSUFFICIENT ≠ 0 (M-B/V-B); HYPOTHETICAL → LIMITED (M-C/V-C); EXTERNAL_RESULT → PENDING_REVIEW (M-E/V-E); CONTRADICTION → PENDING_REVIEW (M-F/V-F); revelación involuntaria → INVALID (atributo) + conducta registrada (M-H/V-H); NO_EVIDENCE legítimo entry-level (M-I/V-I) |
| Conflictos | M-F y V-F: CV "supervisé 15 personas" vs entrevista sin conducta → CONFLICT → PENDING_REVIEW (no promedio, no "gana el más alto") |
| Sesgos | 6 sesgos probados (halo, similarity, confirmation, estereotipo, info irrelevante, atributos protegidos) — contenidos por la estructura |
| Legal | 10/10 preguntas PUBLICABLE; revelación involuntaria manejada según A-06.4 §5; **INTERVIEW-G7 sigue NO EVALUADO** |
| Duración | 1 comp: 8–13 min; 3: 14–25 min; 5: 20–37 min — dentro del rango previsto A-06.3 |
| Trazabilidad | Cadena completa 20/20 — 0 TRACEABILITY_FAILURE |
| IA | Asistencia OK; los 3 rechazos verificados (inventar acción → RECHAZADO; resumen→evidencia → RECHAZADO; asignar STRONG → RECHAZADO) |

### 3.2 La divergencia M-G (insumo central del refinamiento de rúbrica)

| Aspecto | Detalle |
|---|---|
| Caso | M-G (MES-3, respuesta incompleta — patrón G) |
| Pregunta | Q-MES-SVC-002 (COMP-SVC-002 Manejo de quejas; IND-SVC-002-A/B/C) |
| Respuesta sintética | S: "cliente se quejó del café frío". A: "le dije que se lo cambiaría". R: ausente. |
| Reviewer A (estricto) | **LIMITED** — la Action no cubre IND-SVC-002-A (manejo de emoción) ni alternativa explícita (IND-SVC-002-C); R ausente |
| Reviewer B (estándar) | **SUPPORTED** — interpretó "le dije que se lo cambiaría" como Action suficiente (reconoció problema + propuso solución) |
| Causa raíz | La rúbrica v1 no especifica **qué fragmento de Action cubre qué indicador** — cada evaluador mapeó a su criterio |
| Resolución | **LIMITED** (consenso tras revisar la rúbrica): "le dije que cambiaría" cubre IND-SVC-002-C solo parcialmente, no cubre IND-SVC-002-A; R ausente refuerza LIMITED |
| Lección | La rúbrica necesita **ejemplos por indicador** + **protocolo de calibración obligatorio** → exactamente lo que A-06.7 entrega (PASO 4, 5, 10) |

## 4. Hallazgos H-1..H-15 del piloto → refinamiento A-06.7

| # | Hallazgo A-06.6 | Severidad | Refinamiento en A-06.7 (PASO) | Entregable |
|---|---|---|---|---|
| H-1 | 8/10 preguntas STRONG | INFO | Confirmar diseño; mantener KEEP_FOR_REVIEW | 02, 16 |
| H-2 | 2/10 ACCEPTABLE (Q-VEN-COL-001 probe; Q-VEN-TRV-002 entrenamiento) | LOW | **PASO 2**: auditar ambas preguntas (problema/causa/impacto/modificación/riesgos) | 02 |
| H-3 | 0/10 REJECT | INFO | Sin rechazos; decisiones KEEP/REVISE únicamente | 16 |
| H-4 | PROBE-UNI-004 es reflexión, no conducta | LOW | **PASO 3**: auditar el probe LIMITED; decisión KEEP/REVISE/REJECT + condición de uso | 03 |
| H-5 | Falta probe para diferenciar Action propia (V-D) | MEDIUM | **PASO 2/13**: formalizar PROBE-COL-001-D (DRAFT) con condición de uso y stop rule | 02, 03 |
| H-7 | Divergencia inter-evaluador M-G | MEDIUM | **PASO 4-5, 10**: rúbrica por indicador con ejemplos + protocolo de calibración | 04, 05, 09 |
| H-8 | Criterio indicadores→nivel validado (0→INSUF; 1-2→LIMITED; 3+ 1 ejemplo→SUPPORTED; 3+ 2+ ejemplos→STRONG) | INFO | **PASO 4**: formalizar en rúbrica v2 | 04 |
| H-9 | 6 sesgos contenidos por la estructura | INFO | **PASO 12**: material de entrenamiento de sesgos (8 sesgos) | 11 |
| H-10 | Revelación involuntaria manejada correctamente | INFO | **PASO 2**: reforzar con entrenamiento obligatorio (Q-VEN-TRV-002) | 02, 10, 11 |
| H-12 | INTERVIEW-G7 sigue NO EVALUADO | CRITICAL (activación) | **PASO 20**: G7 SIN CAMBIO; no se aprueba legal aquí | 15 |
| H-13/H-14/H-15 | Duración OK; trazabilidad 20/20; 3 rechazos IA OK | INFO | Confirmar; mantener límites IA + trazabilidad | 12, 13 |

(H-6 y H-11 son INFO de confirmación sin acción de refinamiento.)

## 5. Qué refina A-06.7 (y qué no)

**Refina (solo diseño):** las 2 preguntas REVISE (a nivel probe/entrenamiento, no de texto); el probe LIMITED
PROBE-UNI-004 (condición de uso); la rúbrica (v2 con anclas por indicador); ejemplos de evidencia por
indicador; reglas de Action / hipotéticos / conflictos; protocolo de calibración; modelo de entrenamiento;
material de sesgos; límites IA; proporcionalidad; separación entrevistador/revisor; gates.

**No refina / no toca:** competencias e indicadores (siguen DRAFT, no se crean nuevos); texto de las 10
preguntas (se conserva → legalStatus PUBLICABLE intacto); código, schema, datos productivos; overallScore;
IPIP, Knowledge, Integrity, Personality; recomendaciones, contrato, aviso; ninguna conversión a ACTIVE.

## 6. Reglas que NO cambian (heredadas y reafirmadas)

1. **INSUFFICIENT ≠ 0** — etiqueta cualitativa; nunca se convierte en 0, no se promedia, no veta.
2. **Resultado externo ≠ competencia** — sin Action propia no hay SUPPORTED/STRONG.
3. **HYPOTHETICAL → LIMITED como máximo** — nunca SUPPORTED/STRONG.
4. **CONFLICT → PENDING_REVIEW** — resolución exclusivamente humana.
5. **Rúbrica cualitativa** — sin puntos, sin pesos, sin cortes; asignación humana con rationale.
6. **IA = ASSISTANCE** — nunca decide, nunca asigna nivel, nunca inventa evidencia.
7. **Ninguna pregunta ACTIVE** — activación requiere: competencias/indicadores ACTIVE, revisión legal
   (INTERVIEW-G7 / LEGAL-G7+G8+G10), pilotaje de campo real (G9), aprobación humana formal.
