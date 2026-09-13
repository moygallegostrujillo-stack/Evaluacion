# EVALUHR — A-03.1 · PASO 2
# ANÁLISIS DEL PUESTO PARA CONOCIMIENTOS — FUENTES Y knowledgeRelevance = VALID

> Documento de diseño metodológico. NO implementa nada. NO crea preguntas.
> Fecha: 2026-09-10 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.5 PASO 1 (fuentes S1–S8, cadena R-REL-1..5, jobRelevance);
> A-02.1 PASO 5 (content + scope + source como requisito de criterio);
> A-02.5 PASO 6 (K-VAL-2: relación con funciones del puesto).

---

## 1. Pregunta del encargo

> ¿Cómo se identifican los conocimientos requeridos para un puesto, y qué
> evidencia hace que `knowledgeRelevance = VALID`?

Respuesta corta: los conocimientos requeridos se derivan **exclusivamente del
análisis del puesto real** mediante fuentes admisibles trazables; un
conocimiento solo alcanza `knowledgeRelevance = VALID` cuando existe la
cadena completa de justificación (elemento del puesto + fuente + revisión
humana + aprobación con versión), la misma lógica R-REL-1..5 de A-02.5
aplicada al nivel de requisito de conocimiento.

---

## 2. Fuentes admisibles para el análisis de conocimientos

Fuentes específicas del encargo, formalizadas como **KF1–KF7** con
correspondencia al catálogo S1–S8 de A-02.5 (coherencia trans-fases):

| # | Fuente (encargo) | Catálogo A-02.5 | Qué aporta al análisis | Solo no basta para |
|---|---|---|---|---|
| KF1 | **Funciones** del puesto | S2 (funciones reales) | Qué se hace → de qué hay que saber | VALID sin más trazabilidad |
| KF2 | **Procedimientos** operativos | S4/S1 + doc. interna | Cómo se hace → dominios de procedimiento documentado | VALID sin documento citado |
| KF3 | **Políticas** internas | S1 + doc. interna | Reglas de la empresa que el puesto debe conocer | VALID sin documento citado |
| KF4 | **Conocimientos técnicos** registrados en el puesto | S4 (conocimientos) | Contenido declarado en el registro del puesto (F1–F5 de A-02.1) | VALID sin verificación de vigencia |
| KF5 | **Normativa aplicable al puesto** | S6 (requisitos legales) | Obligaciones normativas citables (con referencia exacta) | VALID sin cita normativa |
| KF6 | **Expertos del puesto** | S7 (análisis de expertos) | Validación de contenido, vigencia, prioridades | VALID como única fuente |
| KF7 | **Documentación interna del cliente** (manuales, catálogos, protocolos) | S1/S4 + doc. interna | Contenido exacto, versión, "source" de los reactivos | VALID sin documento con versión |

Reglas de fuentes (herencia reforzada):

1. **K-KF-1**: una fuente admisible debe ser **identificable y citable**
   (documento con fecha/versión, función numerada del registro vigente,
   experto identificado con rol y fecha). "Se me ocurre que un mesero debe
   saber esto" no es fuente.
2. **K-KF-2**: las **bibliotecas genéricas** de preguntas y la **IA** no son
   fuente de relevancia (herencia A-02.5 PASO 1: excluidas explícitamente).
   La IA puede proponer borradores SOLO después de que el dominio exista
   (PASO 5), nunca para decidir qué conocimiento se requiere.
3. **K-KF-3**: la **evidencia empírica** (S8) refuerza, nunca sustituye a
   KF1–KF7 (herencia directa de A-02.5).
4. **K-KF-4**: cambio de puesto, de documentación citada o de normativa ⇒
   **revalidación** de los dominios afectados (herencia R-REL-5).

---

## 3. Procedimiento de análisis (conceptual, 5 etapas)

```
ETAPA 1 — Inventario de funciones y responsabilidades del registro vigente
          (KF1; elementos numerados functions[i], responsibilities[j])
ETAPA 2 — Para cada elemento: ¿qué contenido específico debe SABER la
          persona? (candidatos a dominio; KF2–KF7 como confirmación)
ETAPA 3 — Por candidato: localizar el documento/fuente exacta con versión
          (si no existe fuente citable → el candidato NO avanza; se registra
          como "conocimiento sin fuente" y no se evalúa)
ETAPA 4 — Formulación del KnowledgeRequirement: content + scope
          (familiaridad / aplicación / dominio — A-02.1 PASO 5 §3) + source
ETAPA 5 — Revisión humana (experto del contenido, KF6) + aprobación con
          versión → knowledgeRelevance = VALID (cadena R-KREL)
```

Nada de esto crea preguntas: termina en **requisitos de conocimiento
aprobados**, que son la entrada del Blueprint (PASO 3).

---

## 4. Estados de knowledgeRelevance y cadena R-KREL-1..5

`knowledgeRelevance` es un atributo de cada **KnowledgeRequirement** (dominio
del blueprint). Estados (herencia de los estados de relevancia de A-02.5):
**VALID / LIMITED / INSUFFICIENT / PENDING_REVIEW**.

`VALID` exige **todas** las condiciones (todo-o-nada):

| # | Condición | Verificación |
|---|---|---|
| R-KREL-1 | El requisito proviene de un **elemento específico** del registro de puesto vigente (función/responsabilidad numerada) | Referencia exacta functions[i]/responsibilities[j] |
| R-KREL-2 | Existe **fuente admisible citada** (KF1–KF7) con identificación y versión/fecha | Citación en el expediente |
| R-KREL-3 | El requisito pertenece a la **categoría de conocimiento** (contenido con respuesta verificable; no preferencia ni opinión — PASO 8) | Clasificación registrada |
| R-KREL-4 | **Revisión humana** por persona con conocimiento del contenido (KF6) | Registro de revisor y fecha |
| R-KREL-5 | **Aprobación y versión** registradas por gobernanza | approvedBy + version |

Condiciones de degradación:

- Fuente citada pero sin revisión humana completa → `PENDING_REVIEW`.
- Requisito plausible pero sin fuente citable (KF1 sin documento) → `LIMITED`
  (puede orientar entrevista; **no** admite reactivos).
- Requisito propuesto por IA o por biblioteca genérica sin elemento del
  puesto → `INSUFFICIENT` (rechazado como dominio).

> Regla de honestidad: **hoy** (estado documental) ningún requisito de
> conocimiento real de EvaluHR ha completado R-KREL-1..5 para puestos
> generados; los únicos casos WORKED son los EJEMPLOS de PASO 17, marcados
> EJEMPLO — NO PRODUCTIVO.

---

## 5. Consecuencia operacional

Solo los requisitos con `knowledgeRelevance = VALID` pueden:
(a) constituir dominios del KnowledgeBlueprint (K-VAL-1/K-VAL-2 heredadas);
(b) recibir reactivos (K-VAL-3);
(c) alimentar criterios de categoría A con fuerza de relación superior a
LIMITED una vez exista instrumento VALID (A-02.5 PASO 11).

Los requisitos sin VALID quedan visibles como "conocimiento requerido sin
evidencia posible" (herencia A-02.1 PASO 5 §3) — nunca se inventan
reactivos "para cubrir el hueco".
