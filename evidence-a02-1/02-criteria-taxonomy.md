# EVALUHR — A-02.1 · PASO 2
# TAXONOMÍA DE CRITERIOS (MODELO DE CRITERIOS)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Propósito

Establecer una **taxonomía cerrada de 5 categorías** (A–E) para clasificar
todo criterio de evaluación que EvaluHR utilice en el marco de un puesto.
Cada categoría se define por: qué mide, qué NO mide, qué instrumento podría
evaluarla y qué tipo de evidencia genera.

Regla de integridad de constructos: **un criterio pertenece a exactamente una
categoría**. Si un requisito parece pertenecer a dos, se descompone en dos
criterios (uno por categoría) con trazabilidad cruzada. Prohibido mezclar
constructos (p. ej., tratar un rasgo de personalidad como si fuera
conocimiento, o un auto-reporte de integridad como si fuera evidencia
conductual).

---

## 2. Categoría A — CONOCIMIENTOS

| Aspecto | Definición |
|---|---|
| **Qué mide** | El dominio **declarativo** de contenidos específicos definidos para el puesto: técnicas, procesos, producto, terminología, procedimientos operativos y contenidos normativos que la empresa declara aplicables. |
| **Qué NO mide** | El desempeño real en el trabajo; la habilidad de ejecutar lo que se sabe; la experiencia acumulada; rasgos de personalidad; honestidad; capacidad general de aprendizaje. Saber ≠ hacer. |
| **Qué instrumento podría evaluarla** | Prueba de conocimientos con reactivos derivados del contenido definido en el análisis de puesto (EvaluHR ya cuenta con un módulo de conocimientos; su calidad tiene una reserva documentada — ver §7 Notas de implementación). |
| **Qué evidencia genera** | Resultado de evaluación de conocimientos: aciertos sobre un universo de reactivos definido, con versión del instrumento. Evidencia de tipo "declarativo, punto en el tiempo". |

**Regla**: cada criterio de conocimientos debe nombrar el contenido exacto
que se evaluará ("protocolo de atención de quejas de la empresa", no
"conocimiento general").

---

## 3. Categoría B — HABILIDADES / COMPETENCIAS

| Aspecto | Definición |
|---|---|
| **Qué mide** | (a) **Habilidades**: capacidades ejecutables requeridas por el puesto. (b) **Competencias**: patrones conductuales esperados, definidos con indicadores conductuales (ver `06-competency-model.md`). En la implementación actual, lo único evaluable en esta categoría mediante cuestionario es la **autopercepción de tendencias conductuales** — que NO es evidencia de competencia observada. |
| **Qué NO mide** | Conocimientos técnicos (categoría A); trayectoria (categoría C); rasgos de personalidad como constructo separado (categoría D); honestidad (categoría E); desempeño real. Un auto-reporte no demuestra competencia. |
| **Qué instrumento podría evaluarla** | Hoy: auto-reporte orientativo (legacy EvaluHR, 10 ítems, deprecado para nuevas generaciones; ver matriz de instrumentos). Futuro (no diseñado aún): entrevista estructurada por competencias o ejercicios conductuales. Ningún instrumento actual produce "competencia demostrada". |
| **Qué evidencia genera** | Hoy: resultado de auto-reporte, orientativo, sujeto a revisión humana. Futuro: evidencia conductual registrada en entrevista (estructura definida, no implementada). |

**Regla**: mientras no exista método conductual implementado, toda salida de
esta categoría debe presentarse como **autopercepción**, nunca como
"competencia medida".

---

## 4. Categoría C — EXPERIENCIA / FORMACIÓN

| Aspecto | Definición |
|---|---|
| **Qué mide** | Requisitos verificables de trayectoria previa (roles, tiempo, contextos) y formación (nivel, área, certificaciones declaradas por la empresa como necesarias o preferentes). |
| **Qué NO mide** | El desempeño en el puesto actual; conocimientos vigentes (una experiencia antigua no implica conocimiento actual); rasgos; integridad. |
| **Qué instrumento podría evaluarla** | Verificación documental y/o entrevista estructurada (métodos futuros, no implementados en A-02.1). EvaluHR no verifica documentos por sí mismo en esta fase. |
| **Qué evidencia genera** | Registro de cumplimiento declarado/verificado de un requisito binario o escalonado ("cumple / no cumple / por verificar"), siempre con fuente registrada. |

**Regla**: si la empresa no puede definir cómo verificaría un requisito de
experiencia, el criterio no puede marcarse `REQUIRED`.

---

## 5. Categoría D — PERSONALIDAD

| Aspecto | Definición |
|---|---|
| **Qué mide** | Tendencias de rasgo **auto-reportadas** en los 5 factores del modelo Big Five (Extraversión, Amabilidad, Escrupulosidad, Estabilidad Emocional, Apertura a la Experiencia), mediante IPIP-50-MX v1.0 (identidad completa en expediente A-01.3). |
| **Qué NO mide** | Desempeño; inteligencia; experiencia; conocimientos; honestidad; capacidad profesional; aptitud para un puesto. **Ningún rasgo equivale a un criterio laboral.** |
| **Qué instrumento podría evaluarla** | `EVALHR-PERSONALIDAD-IPIP50-MX` (instrumentVersion 1.0 · languageVersion ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA · scoringVersion IPIP50-BFM-1.0). |
| **Qué evidencia genera** | 5 puntajes brutos por factor (rango 10–50), visualización 0–100 **no percentil**, con disclaimer literal; interpretación solo como tendencias de respuesta. |

**Reglas específicas** (desarrolladas en `04-personality-use-rules.md`):

- La relación entre un rasgo y un requisito del puesto se documenta **como
  hipótesis metodológica sujeta a evidencia**.
- Prohibido: fórmulas ("Responsabilidad > X = recomendado"), puntos de corte,
  percentiles, "perfil ideal" psicométrico, uso del Big Five como sustituto
  del criterio laboral.

---

## 6. Categoría E — INTEGRIDAD

| Aspecto | Definición |
|---|---|
| **Qué mide** | Auto-reporte **orientativo** en 4 categorías declarativas (honestidad percibida, apego declarado a normas, actitud declarada ante el hurto, responsabilidad declarada). Instrumento actual: 10 ítems legacy de EvaluHR, marcados en código como orientativos y "never auto-filter". |
| **Qué NO mide** | Honestidad real u observada; historial de conducta; probabilidad de robo o falta; "confiabilidad" de la persona. Un auto-reporte no prueba conducta. |
| **Qué instrumento podría evaluarla** | `EVALHR-INTEGRIDAD-LEGACY` (10 ítems, sin validación psicométrica, sin versión formal). **No se diseña ningún instrumento nuevo en A-02.1** (ver `07-integrity-status.md`). |
| **Qué evidencia genera** | Resultado orientativo auto-reportado, siempre sujeto a revisión humana; nunca filtro automático ni base única de decisión. |

**Afirmación obligatoria** (se reproduce también en `07-integrity-status.md`):

> "El instrumento actual de integridad de EvaluHR no debe presentarse todavía
> como prueba psicométrica validada."

---

## 7. Notas de implementación (informativas, sin modificar nada)

- **Conocimientos**: hallazgo preexistente documentado en A-01.2 — el
  generador de plantillas no persiste `correctAnswer` en preguntas de
  conocimientos para puestos nuevos → `knowledgeScore = 0` en esos casos.
  Implicación metodológica: hasta corregirse (con autorización), la evidencia
  de conocimientos de puestos nuevos **no es confiable** y no debe alimentar
  el futuro nivel de ajuste sin antes cerrar esa brecha.
- **Psicológica legacy**: el instrumento "psicológica" de 10 ítems legacy ya
  no se genera para puestos nuevos (deprecado en A-01.2); resultados
  históricos se conservan con su semántica original. En esta taxonomía se
  clasifica como auto-reporte de tendencias conductuales (categoría B
  orientativa), nunca como personalidad Big Five.
- **Integridad legacy**: sigue activa en demo; su estatus metodológico está
  abierto (categoría E).

---

## 8. Tabla de decisión rápida (clasificación de un requisito)

| Si el requisito es... | Categoría | Evidencia posible hoy |
|---|---|---|
| "Saber X" (contenido, proceso, producto) | A CONOCIMIENTOS | Prueba de conocimientos (con la reserva de calidad documentada) |
| "Hacer X bien" / "comportarse según Y" | B HABILIDADES/COMPETENCIAS | Solo auto-reporte orientativo hoy; método conductual futuro |
| "Haber hecho/estudiado X" | C EXPERIENCIA/FORMACIÓN | Verificación documental/entrevista (futuro) |
| "Tender a X en su forma de ser" (info de rasgo) | D PERSONALIDAD | IPIP-50-MX (tendencias, no aptitudes) |
| "Actuar con honestidad/apego a normas" | E INTEGRIDAD | Auto-reporte orientativo, no validado, no filtro |

Si un requisito no cae claramente en una categoría → se documenta como
"criterio no clasificado" y **no** se evalúa hasta que RH + gobernanza lo
clasifiquen. Prohibido forzar la clasificación.
