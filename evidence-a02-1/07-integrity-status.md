# EVALUHR — A-02.1 · PASO 7
# ESTATUS METODOLÓGICO DE LA INTEGRIDAD

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **NO se diseña ningún instrumento de
> integridad en A-02.1.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 0. Afirmación obligatoria (regla de lenguaje, vigente desde ya)

> **"El instrumento actual de integridad de EvaluHR no debe presentarse
> todavía como prueba psicométrica validada."**

Esta frase es de cumplimiento obligatorio en todo documento, pantalla,
propuesta comercial o comunicación de EvaluHR. Su omisión o contradicción es
hallazgo bloqueante en cualquier auditoría.

---

## 1. Qué pretende medir una evaluación de integridad (concepto general)

Una evaluación de integridad busca **información sobre la disposición
declarada de una persona respecto de normas de honestidad y conducta en el
trabajo** (p. ej., actitud ante el hurto, apego declarado a reglas,
transparencia ante errores).

Distinción crítica:

- **Integridad declarada** (lo que el instrumento puede captar): auto-reporte.
- **Integridad observada** (conducta real en el trabajo): solo evidible con
  tiempo, contexto y fuentes externas al cuestionario.

Ningún cuestionario mide "si la persona es honesta"; captura declaraciones,
que pueden sesgarse por deseabilidad social.

---

## 2. Situación actual de EvaluHR (informativa, solo documentación)

- Existe un instrumento legacy de 10 ítems (categorías: honestidad, normas,
  hurto, responsabilidad), compartido para todos los puestos, marcado en el
  código como **orientativo** y "never auto-filter".
- No cuenta con: versión formal, identidad de instrumento (estilo A-01.3),
  estudio de validación propio, normas, ni evidencia publicada.
- Su resultado es orientativo y está (por diseño de producto) excluido de
  rechazos automáticos.

En la matriz de instrumentos (`instrument-criterion-matrix.csv`) figura como
`EVALHR-INTEGRIDAD-LEGACY` con `evidenceStrength = NULA-BAJA`.

---

## 3. Qué evidencia debería existir ANTES de utilizarla como criterio

Checklist de prerrequisitos (futuro, no vigente):

1. **Identificación formal del instrumento**: instrumentId, instrumentVersion,
   languageVersion y scoringVersion propios (estándar A-01.3).
2. **Estudio propio o externo** sobre la versión concreta administrada por
   EvaluHR: consistencia interna, estructura, análisis de deseabilidad
   social, en muestra relevante; publicado o al menos revisado por
   asesoría en psicometría.
3. **Definición del criterio externo**: qué evidencia independiente
   (conductual, documental) contrastaría el resultado.
4. **Revisión legal y de privacidad** del uso previsto en México antes de
   operarlo (qué datos, qué finalidad, qué consentimiento) — EvaluHR no
   declara aquí obligaciones específicas; el punto es que ninguna operación
   ocurre sin esa revisión.
5. **Aprobación de gobernanza** documentada (rol Owner + dirección).
6. **Política de uso** que prohíba uso exclusivo, uso punitivo y decisiones
   automáticas.

Mientras el checklist esté incompleto, la integridad queda como **evidencia
orientativa sujeta a revisión humana**.

---

## 4. Riesgos de la integridad (por qué el estatus está abierto)

| Riesgo | Descripción | Mitigación documental actual |
|---|---|---|
| Deseabilidad social | Responder "lo correcto" en lugar de lo real | Presentación como orientativo; nunca único criterio |
| Falso positivo/negativo | Persona honesta mal leída (o viceversa) | Prohibición de filtro automático ("never auto-filter") |
| Uso punitivo | Tratar el resultado como acusación | Lenguaje prohibido en `output-language-matrix.md` |
| Discriminación/adversidad | Impacto injusto sobre grupos si se usara como barrera | Uso solo orientativo + revisión humana obligatoria |
| Sobreexpectativa comercial | Vender "detección de ladrones" | Frase obligatoria §0 + matriz prohibiciones |

---

## 5. Qué NO debe afirmarse actualmente (lista de prohibiciones)

- ❌ "Prueba de integridad validada" / "psicométricamente validada".
- ❌ "Detecta ladrones / mide honestidad real".
- ❌ "Predice conducta futura" o "previene pérdidas".
- ❌ "Resultado determinante para contratar/descartar".
- ❌ Cualquier puntuación presentada como diagnóstico de la persona.
- ❌ Comparar candidatos entre sí por "nivel de integridad" como ranking.

Lenguaje permitido asociado: "resultado orientativo de auto-reporte",
"sujeto a revisión humana", "no constituye prueba psicométrica validada".

---

## 6. Colocación en la taxonomía

La integridad es la **categoría E**, independiente de:

- PERSONALIDAD (D): el IPIP-50-MX no mide integridad; la Escrupulosidad es un
  rasgo, no honestidad (constructos distintos; mezcla prohibida).
- CONOCIMIENTOS (A): no existe "conocimiento de integridad".
- El instrumento legacy de integridad no produce insumos para el scoring del
  IPIP ni para ningún puntaje global.
