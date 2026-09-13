# EVALUHR — A-02.2 · PASO 12
# LÍMITES ESTRICTOS DE LA IA EN EL MODELO DE EVIDENCIA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Coherente con: A-01.3 (IA = 0 en scoring/interpretación), A-02.1 (IA = 0 en
> criterios/áreas/recomendaciones).

---

## 1. Principio

> En el modelo de evidencia, la IA **nunca es fuente** (`source` no tiene
> valor "AI"), **nunca es autoridad de calidad**, **nunca es revisora** y
> **nunca es decisora**. La IA es, a lo sumo, **asistente administrativa
> supervisada** en tareas definidas.

---

## 2. La IA PUEDE (con condiciones)

| # | Permitido | Condición |
|---|---|---|
| AI-1 | **Proponer preguntas futuras** (borradores para el diseño de instrumentos) | Solo como DRAFT etiquetado, nunca insertadas en plantillas; requieren autoría/revisión humana, derivación de criterios aprobados y aprobación de gobernanza. Hoy no existe ese flujo. |
| AI-2 | **Resumir evidencia existente** | Solo citando `evidenceId`s reales, sin añadir datos, sin interpretar más allá del contenido de los registros, con salida revisable por humanos. |
| AI-3 | **Estructurar información** (formatos, tablas, plantillas de presentación de registros ya capturados) | Sin alterar `value`, `quality`, `status` ni metadatos; transformaciones verificables. |
| AI-4 | **Ayudar en análisis documental** (organizar/extraer información de documentos para que una persona verifique) | La verificación y el registro siguen siendo humanos (`DOCUMENT_VERIFICATION`); la IA no produce el `BOOLEAN_VERIFIED`. |

Regla común: toda salida asistida por IA queda **marcada** como tal en el
audit trail (PASO 13) y **requiere validación humana** antes de convertirse
en registro.

---

## 3. La IA NO PUEDE (prohibiciones absolutas)

| # | Prohibido | Racional |
|---|---|---|
| AI-X1 | **Inventar evidencia** (crear valores, resultados, notas de entrevista, verificaciones) | La evidencia existe solo si un método humano/determinista la produjo (PASO 1). |
| AI-X2 | **Transformar "sin evidencia" en score** | INSUFFICIENT ≠ 0 (PASO 11); la ausencia no se rellena ni se estima. |
| AI-X3 | **Decidir calidad psicométrica** de un instrumento o registro | La calidad es determinista por reglas (PASO 3) + gobernanza (PASO 16). |
| AI-X4 | **Declarar validación** (de instrumento, método, implementación) | La validación exige evidencia científica y gobernanza; la IA no la fabrica. |
| AI-X5 | **Decidir contratación** (o cualquier decisión laboral) | Decisión exclusivamente humana/empresa (A-02.1 PASO 11). |
| AI-X6 | **Crear puntos de corte por sí misma** (umbrales, percentiles, "perfiles ideales") | Prohibidos en toda la cadena (A-01.3, A-02.1, A-02.2). |
| AI-X7 | Resolver conflictos de evidencia o "elegir" la fuente correcta | PASO 10: revisión humana obligatoria. |
| AI-X8 | Entrevistar, generar notas de entrevista o hablar "por" el entrevistador | PASO 9: la evidencia de entrevista es humana. |
| AI-X9 | Interpretar rasgos como aptitudes/desempeño ("este candidato es confiable según su IPIP") | Herencia A-01.3/A-02.1 sin excepciones. |

---

## 4. Aplicación al estado actual del sistema

- En la implementación vigente, la IA **no participa** en el scoring del
  IPIP-50-MX ni en la interpretación de resultados (funciones deterministas;
  A-01.2/A-01.3).
- A-02.2 no agrega ningún flujo de IA: este documento define **límites
  preventivos** para fases futuras, vigentes desde ya como política.
- Cualquier incorporación futura de IA en tareas permitidas (AI-1..AI-4)
  requiere: aprobación de gobernanza, marcado de origen en audit trail,
  validación humana de cada salida, y auditoría periódica de cumplimiento.

---

## 5. Regla de detección (para auditoría)

Si una salida del sistema presenta como evidencia algo que no traza a un
método humano/determinista con `evidenceId`, o presenta estimaciones/relatos
no registrados → **violación de política**. El expediente A-02.2 se usa como
referencia de cumplimiento en cada auditoría (PASO 17 del master).
