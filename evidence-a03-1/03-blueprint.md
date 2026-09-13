# EVALUHR — A-03.1 · PASO 3
# KNOWLEDGEBLUEPRINT — MAPA DE CONTENIDOS DEL INSTRUMENTO

> Documento de diseño metodológico. NO implementa nada. NO crea preguntas.
> Fecha: 2026-09-10 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.5 PASO 6 (K-VAL-1 blueprint, K-VAL-2 relación con funciones,
> K-VAL-3 reactivos vinculados); A-02.1 PASO 5 (content + scope + source).

---

## 1. Definición

**KnowledgeBlueprint** es el mapa formal de contenidos de una evaluación de
conocimientos: declara **qué dominios y subdominios de conocimiento** se
evalúan para un puesto, **por qué** (requisito del puesto con
`knowledgeRelevance = VALID`), **de dónde** proviene el contenido (source)
y **bajo qué aprobación y versión** existe.

Es la respuesta estructural a K-VAL-1 ("no existe formalmente; la generación
de preguntas de hoy no produce blueprint auditable") — A-03.1 lo diseña;
**no lo implementa**.

## 2. Campos conceptuales del blueprint (encargo)

| Campo | Contenido | Regla |
|---|---|---|
| `blueprintId` | Identificador único e irrevocable | Jamás reutilizado (herencia anti "id fantasma", A-02.5 PASO 18) |
| `jobId` | Puesto al que aplica | Un blueprint pertenece a UN puesto; cambio de puesto = revalidación |
| `domain` | Dominio de conocimiento (p. ej., "Higiene y manejo de alimentos") | Debe mapear 1:1 a un KnowledgeRequirement aprobado |
| `subdomain` | Desglose del dominio (p. ej., "Temperaturas de conservación") | Cobertura declarada, no inventada |
| `knowledgeRequirement` | Referencia al requisito con `knowledgeRelevance = VALID` | Trazabilidad R-KREL-1..5 |
| `importance` | Rol del dominio en el puesto: CORE / SUPPORTING (descriptivo) | Metadato de cobertura; **no** es peso ni puntaje (K-BP-4) |
| `source` | Documento/fuente citada con versión o función numerada | KF1–KF7 (PASO 2) |
| `approvedBy` | Aprobador humano designado | Jamás IA (AI-X18 heredada) |
| `version` | Versión del blueprint | Mayor/menor según PASO 15 |

## 3. Por qué cada pregunta debe pertenecer a un dominio pre-establecido

Razón metodológica (no burocrática): un reactivo sin dominio es **no
justificable** — nadie puede responder por qué se pregunta, qué cubre ni qué
hacer si sale mal. La pertenencia a dominio garantiza:

1. **Trazabilidad**: pregunta → subdominio → dominio → requisito →
   elemento del puesto → fuente (cadena de auditoría, PASO 16). Un reactivo
   "flotante" rompe la cadena y, por K-VAL-3, es un reactivo de relleno.
2. **Cobertura controlada**: el blueprint define el universo de contenido;
   el examen es una muestra **declarada** de ese universo, no una colección
   casual. Sin dominio no hay forma de declarar qué cubre el score.
3. **Validación por dominio**: la revisión de contenido (PASO 7) evalúa
   coherencia pregunta↔dominio; sin dominio no hay contra qué validar.
4. **Reactivos prohibidos por construcción**: con dominios cerrados, la IA
   no puede "agregar preguntas nuevas" fuera del mapa (AI-X20, PASO 5) ni
   el generador puede producir reactivos genéricos de biblioteca.
5. **Mantenimiento seguro**: si un dominio se vuelve obsoleto (cambia el
   manual, la norma), se identifican de inmediato todos los reactivos
   afectados — protección PASO 14.

**Regla K-BP-1**: todo KnowledgeItem referencia `blueprintId` + `domain` +
`subdomain`. Un reactivo sin pertenencia a dominio **no existe
metodológicamente**: no pasa de DRAFT y jamás puede publicarse (PASO 19).

## 4. Reglas de construcción del blueprint

| # | Regla | Motivo |
|---|---|---|
| K-BP-1 | Todo dominio cita un KnowledgeRequirement con `knowledgeRelevance = VALID` | K-VAL-2 heredada; sin ello el dominio no entra |
| K-BP-2 | `content` + `scope` + `source` por dominio (A-02.1 PASO 5 §3) | Contenido exacto y hasta dónde |
| K-BP-3 | La cobertura declarada (cuántos reactivos por dominio) se decide en el blueprint, antes de generar reactivos | Evita reactivos de relleno y sesgo de generación |
| K-BP-4 | `importance` (CORE/SUPPORTING) es **descriptiva de cobertura**; prohibido usarla como peso de scoring o como requisito de aprobación | Sin pesos inventados; scoring = aciertos/ítems válidos (PASO 10) |
| K-BP-5 | El blueprint no contiene preguntas, opciones ni claves | El reactivo es un artefacto separado con su propio ciclo (PASO 4) |
| K-BP-6 | Cambios de contenido evaluado = nueva versión mayor + proceso completo de revisión (PASO 15) | Versionado heredado de A-02.5 PASO 18 |
| K-BP-7 | Un blueprint puede estar APPROVED sin instrumento publicado si aún no tiene reactivos validados; en ese caso no administra nada | Honestidad de estados (PASO 19) |

## 5. Lo que el blueprint NO hace

- No asigna dificultad (PASO 9 — es propiedad del reactivo y su evidencia).
- No define puntajes, cortes ni niveles de aprobación (PASO 10).
- No convierte el dominio en criterio: el criterio de categoría A ya existe
  por la vía A-02.1; el blueprint cubre el criterio, no lo crea.
- No se genera por IA (AI-X20): la IA recibe blueprint aprobado y produce
  borradores de reactivos **dentro** del mapa (PASO 5).
