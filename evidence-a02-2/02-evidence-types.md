# EVALUHR — A-02.2 · PASO 2
# TIPOS DE EVIDENCIA (A–H)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 0. Reglas de clasificación

- Cada EvidenceRecord tiene **un** tipo (`evidenceType`) y **una** categoría de
  criterio (`category`, taxonomía A-02.1).
- El tipo describe **cómo se obtuvo**; la categoría describe **qué criterio
  alimenta**. No se permiten combinaciones no listadas en la matriz
  (`evidence-quality-matrix.csv`).
- La calidad mínima exigida se define por tipo en el PASO 14; este documento
  fija el sentido de cada tipo.

---

## A. TEST / INSTRUMENTO (psicométrico estandarizado)

| Aspecto | Definición |
|---|---|
| **Qué mide** | El constructo declarado del instrumento, con su estructura y escala propias. Único representante actual: `EVALHR-PERSONALIDAD-IPIP50-MX` (mide tendencias auto-reportadas en 5 factores Big Five; PASO 4). |
| **Qué NO mide** | Nada fuera de su constructo declarado: el IPIP no mide desempeño, capacidad, honestidad, experiencia ni "encaje". Ningún test equivale a decisión de contratación. |
| **Cómo se obtiene** | Administración determinista del instrumento versionado a la persona evaluada; respuestas registradas; resultado crudo por constructo (sin interpretación en el registro). |
| **Quién la genera** | El sistema (`source=SYSTEM_INSTRUMENT`), con el instrumento y versión registrados. La IA no genera esta evidencia. |
| **Calidad mínima requerida** | Administración completa + identidad y versión del instrumento + clave oficial verificada (para IPIP: 50/50 ítems verbatim, 24 reversos, TEST 9 de A-01.2). Sin versión identificable o con secciones incompletas → `INSUFFICIENT`. |

---

## B. CONOCIMIENTO (prueba de conocimientos)

| Aspecto | Definición |
|---|---|
| **Qué mide** | Dominio declarativo de contenidos definidos para el criterio (categoría A), medido con reactivos objetivos cuya respuesta correcta está persistida y es verificable. |
| **Qué NO mide** | Habilidad de ejecutar lo sabido; desempeño real; rasgos; integridad; experiencia. |
| **Cómo se obtiene** | Prueba con reactivos derivados del contenido aprobado del criterio (A-02.1 PASO 5) + puntuación objetiva contra `correctAnswer`. |
| **Quién la genera** | El sistema, a partir de respuestas del candidato (`SYSTEM_INSTRUMENT`). |
| **Calidad mínima requerida** | (a) reactivos trazables al contenido del criterio; (b) `correctAnswer` persistido y verificable; (c) administración completa. Si falta (b) → `INSUFFICIENT` (PASO 5: problema documentado vigente). |

---

## C. COMPETENCIA (evidencia conductual de competencias)

| Aspecto | Definición |
|---|---|
| **Qué mide** | Evidencia de indicadores conductuales observables asociados a la competencia (categoría B), obtenida mediante método conductual definido. |
| **Qué NO mide** | Rasgos (eso es categoría D); honestidad; conocimientos. Un auto-reporte **no es** evidencia de competencia. |
| **Cómo se obtiene** | *(FUTURO, no implementado)*: entrevista conductual estructurada o ejercicio observado con registro por indicador. Hoy **no existe método aprobado** → no puede producirse evidencia C válida. |
| **Quién la genera** | *(Futuro)* entrevistador/evaluador humano registrado; el sistema solo estructura el registro. |
| **Calidad mínima requerida** | Método definido + indicadores registrados uno a uno + identificación del evaluador + fecha. Sin método aprobado → `INSUFFICIENT` por regla (PASO 6). |

---

## D. EXPERIENCIA (trayectoria previa)

| Aspecto | Definición |
|---|---|
| **Qué mide** | Cumplimiento de un requisito de trayectoria del criterio (roles previos, tiempo, contexto), en dos estados: **declarado** y **verificado**. |
| **Qué NO mide** | Calidad del desempeño previo (salvo referencia verificable); rasgos; conocimientos vigentes. |
| **Cómo se obtiene** | Declaración del candidato y/o verificación documental/referencial registrada (PASO 8: separación estricta declarado vs. verificado). |
| **Quién la genera** | Declaración: candidato (`CANDIDATE_DECLARATION`). Verificación: RH/empresa (`DOCUMENT_VERIFICATION` o `HUMAN_INTERVIEW`). |
| **Calidad mínima requerida** | Declarado sin verificar → máximo `LOW` y `reviewRequired=true`. Verificado → `MEDIUM`/`HIGH` según robustez del método de verificación registrado (PASO 8). |

---

## E. FORMACIÓN (estudios, certificaciones, cursos)

| Aspecto | Definición |
|---|---|
| **Qué mide** | Cumplimiento de un requisito de formación del criterio (nivel educativo, certificación, curso), en estados declarado/verificado. |
| **Qué NO mide** | Conocimiento vigente del contenido (eso es categoría A con prueba); capacidad general; rasgos. |
| **Cómo se obtiene** | Declaración y/o verificación documental (título, constancia, registro de certificación) con resultado `BOOLEAN_VERIFIED`. |
| **Quién la genera** | Igual que D: declaración (candidato) o verificación (humana). |
| **Calidad mínima requerida** | Igual que D. Certificación sin documento verificado → `LOW`. Nota: "cursos de conocimiento declarados" no son evidencia de conocimiento (categoría A) — son dato de formación (categoría C de la taxonomía). |

---

## F. ENTREVISTA HUMANA

| Aspecto | Definición |
|---|---|
| **Qué mide** | Registro cualitativo estructurado de lo explorado por un entrevistador humano respecto de un criterio (cualquier categoría): lecturas, observaciones, respuestas del candidato. |
| **Qué NO mide** | Nada con precisión psicométrica: **ENTREVISTA ≠ prueba psicométrica** (PASO 9). No sustituye tests ni produce baremos. |
| **Cómo se obtiene** | Entrevista realizada por una persona, con estructura por criterio (guía derivada de criterios aprobados) y nota registrada (`QUALITATIVE_NOTE`). |
| **Quién la genera** | Exclusivamente el entrevistador humano (`HUMAN_INTERVIEW`); el sistema registra, no entrevista. |
| **Calidad mínima requerida** | Estructura por criterio + identidad del entrevistador + fecha + nota registrada → máximo `MEDIUM` (evidencia humana, no estandarizada). Sin estructura ni registro → `LOW`/`INSUFFICIENT`. `reviewRequired=true` siempre. |

---

## G. DOCUMENTACIÓN (verificación documental)

| Aspecto | Definición |
|---|---|
| **Qué mide** | Resultado de una verificación documental humana contra un requisito del criterio (documento existe/legible/vigente/corresponde), con valor `BOOLEAN_VERIFIED` y referencia al documento. |
| **Qué NO mide** | Constructos psicológicos; calidad de desempeño; nada que el documento no acredite. |
| **Cómo se obtiene** | Revisión humana del documento aplicable, registrada con resultado, revisor y fecha (sin cargar el documento en el modelo; solo su referencia). |
| **Quién la genera** | RH/empresa (`DOCUMENT_VERIFICATION`). |
| **Calidad mínima requerida** | Documento identificado + revisor + fecha + resultado binario con regla de decisión documentada → `MEDIUM`/`HIGH` según el requisito. Sin registro del revisor → `LOW`. |

---

## H. EVIDENCIA INSUFICIENTE (estado, no contenido)

| Aspecto | Definición |
|---|---|
| **Qué mide** | **No mide nada.** Es el registro formal de que un criterio **no puede evaluarse** con lo disponible (o no puede evaluarse aún). Produce el mensaje: "Información insuficiente para evaluar este criterio." (PASO 15). |
| **Qué NO mide** | Absolutamente nada. **INSUFFICIENT ≠ 0** (PASO 11): la ausencia de evidencia jamás se convierte en puntuación. |
| **Cómo se obtiene** | Se emite por reglas objetivas (PASO 15) cuando falta instrumento, falta sección, hay falla técnica, no hay método aprobado, o la calidad del método es insuficiente para el criterio. |
| **Quién la genera** | El sistema, de forma determinista, a partir de reglas documentadas (jamás IA, jamás interpretación). |
| **Calidad mínima requerida** | No aplica (por definición). Exige `reasonCode` documentado. |

---

## 1. Matriz tipo × categoría (combinaciones válidas)

| evidenceType | CONOCIMIENTOS | HAB/COMP | EXP/FORM | PERSONALIDAD | INTEGRIDAD |
|---|---|---|---|---|---|
| A TEST/INSTRUMENTO | — (reserva de calidad) | — | — | ✔ IPIP-50-MX | — (ver PASO 7) |
| B CONOCIMIENTO | ✔ | — | — | — | — |
| C COMPETENCIA | — | ✔ (futuro) | — | — | — |
| D EXPERIENCIA | — | — | ✔ | — | — |
| E FORMACIÓN | — | — | ✔ | — | — |
| F ENTREVISTA | ✔ | ✔ | ✔ | ✔ (contextual) | ✔ (contextual) |
| G DOCUMENTACIÓN | — | — | ✔ | — | — |
| H INSUFICIENTE | ✔ | ✔ | ✔ | ✔ | ✔ |

Notas: la entrevista sobre PERSONALIDAD/INTEGRIDAD es **contextual** (explora
coherencia, no sustituye ni valida el test). El tipo A sobre CONOCIMIENTOS
queda con reserva de calidad (PASO 5). El tipo A sobre INTEGRIDAD no produce
evidencia evaluable (PASO 7: `INSUFFICIENT`).
