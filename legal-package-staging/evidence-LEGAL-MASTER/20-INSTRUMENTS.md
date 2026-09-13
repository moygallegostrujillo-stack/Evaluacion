# EVALUHR — LEGAL MASTER PACKAGE · 20 · INSTRUMENTS (PASO 16)

## 0. Regla del encargo

> No afirmar validez que no exista. No afirmar validación mexicana que no esté demostrada. No atribuir al sistema instrumentos que no existen. Cada campo: nombre/versión/fuente/derechos/uso permitido/uso prohibido/evidencia/limitaciones/estado legal/estado metodológico.

## 1. PERSONALIDAD (Big Five — sin IPIP)

| Campo | Valor |
|---|---|
| Nombre | Evaluación psicométrica Big Five (10 ítems creados por el proyecto) |
| Versión | LEGACY / DEVELOPMENT_ONLY (`generate-templates.ts:20-31`) |
| Fuente | Ítems propios del proyecto; **sin licencia IPIP** (0 hits "IPIP" en src/) |
| Derechos | UNKNOWN (`overall-score.ts:24-28`) — PENDIENTE |
| Uso permitido | Ninguno productivo; conservación en registros legacy |
| Uso prohibido | Como base de decisión; feed a overall (excluido por diseño) |
| Evidencia | `evidence-a05-1/`, `evidence-a05-2/` (comparativa IPIP; opción IPIP-50-MX NO implementada), `evidence-a05-3/` (aislamiento del overall) |
| Limitaciones | Sin licencia, sin validación MX, sin baremos |
| Estado legal | **LEGAL_REVIEW** — decidir retiro o licenciamiento |
| Estado metodológico | **NOT_IMPLEMENTED para V1** (declinado; nuevos puestos no lo reciben — A-05.3) |

## 2. CONOCIMIENTO

| Campo | Valor |
|---|---|
| Nombre | Módulo de conocimientos (cadena canónica A-03.5) |
| Versión | KA-v{n}/BP-v{n}/PUB-KS-v{n} con contentHash y snapshots |
| Fuente | Bancos por puesto/sector + generación IA (AI_DRAFT) |
| Derechos | Contenido propio del proyecto (verificar bancas externas) |
| Uso permitido | Evaluación técnica por puesto; publicación solo SYSTEM (human-gated) |
| Uso prohibido | Exponer `correctAnswer` al candidato (verificado: nunca serializado) |
| Evidencia | `src/lib/knowledge-canonical.ts`; schema.prisma:486-715 |
| Limitaciones | correctAnswer llega al browser admin en endpoints RH (riesgo residual); drift de 7 modelos ausentes en schema.prod |
| Estado legal | LEGAL_REVIEW (exposición admin; derechos de contenido) |
| Estado metodológico | **IMPLEMENTED** (el más maduro) |

## 3. INTEGRIDAD

| Campo | Valor |
|---|---|
| Nombre | Indicador orientativo de integridad (10 ítems propios) |
| Versión | V1 propio |
| Fuente | Ítems del proyecto (evidence-a04-1..5: auditoría completa GATE-1..10 no superados) |
| Derechos | Propios |
| Uso permitido | Presentación como "orientativo, nunca filtro/descalificación" (UI) |
| Uso prohibido | Feed a overallScore (excluido: `INTEGRITY_NOT_APPROVED_FOR_OVERALL`); JobFit (no existe) |
| Evidencia | `evaluations/route.ts:243,366`; `overall-score.ts:196-199` |
| Limitaciones | Sin validación; dato sensible etiquetado |
| Estado legal | **LEGAL_REVIEW — decidir continuidad o retiro** |
| Estado metodológico | Implementado como instrumento; **NO aprobado para agregados** (gates a04-2) |

## 4. COMPETENCIAS

| Campo | Valor |
|---|---|
| Nombre | Modelo de competencias (entrevista estructurada) |
| Versión | Diseño A-06 (catálogo 12 competencias DRAFT) |
| Fuente | Literatura + job analysis (evidence-a06-1/2) |
| Derechos | Propios |
| Uso permitido | Ninguno productivo |
| Uso prohibido | Activar sin gates; publicar preguntas |
| Evidencia | 0 modelos/rutas/vistas de competencias en producto |
| Limitaciones | Sin piloto (A-06.10 no ejecutado); G7 NO APPROVED |
| Estado legal | LEGAL_REVIEW (paquete A-06.11) |
| Estado metodológico | **NOT_IMPLEMENTED (design-only)** |

## 5. ENTREVISTA

| Campo | Valor |
|---|---|
| Nombre | Entrevista estructurada BDI/STAR |
| Versión | Diseño A-06.3 + paquete legal A-06.11 (10 preguntas / 26 probes DRAFT v2) |
| Fuente | Metodología BDI/STAR (literatura verificada en evidence-a06-3) |
| Derechos | Propios |
| Uso permitido | Solo agendamiento existe (`InterviewSchedule`) |
| Uso prohibido | Entrevista estructurada en producto (G7 NO APPROVED; 0 modelos) |
| Evidencia | evidence-a06-3/, evidence-a06-11/ |
| Limitaciones | Sin piloto; sin consistencia inter-revisor medida |
| Estado legal | INTERVIEW-G7 = NO APPROVED (solo abogado) |
| Estado metodológico | **PARTIAL** (agendamiento IMPLEMENTED; entrevista estructurada NOT_IMPLEMENTED) |

## 6. NOM-035 (nota)

Ningún instrumento de EvaluHR "cumple" o "sustituye" NOM-035-STPS-2018 (evalúa entorno laboral de trabajadores con sus propios cuestionarios). Eliminar de materiales toda fórmula que lo sugiera (el PDF del aviso §3 menciona NOM-035/LFT 132 como fundamento de finalidades — revisar redacción).
