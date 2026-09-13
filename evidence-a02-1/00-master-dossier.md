# EVALUHR — A-02.1
# DOSSIER MAESTRO — ANÁLISIS DEL PUESTO Y MODELO DE CRITERIOS

> Documento de solo documentación metodológica. NO modifica código, schema,
> base de datos, scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones,
> frontend, contrato ni aviso de privacidad.
> Elaborado: 2026-09-09 · Fase A-02.1 · Base: expediente A-01.3 (GO) e
> implementación v1.0 del IPIP-50-MX.
> Este dossier resume y enlaza los documentos de `evidence-a02-1/`.

---

## 1. Objetivo

Diseñar la metodología base mediante la cual EvaluHR **describirá un puesto de
trabajo** y determinará **qué criterios** pueden utilizarse posteriormente para
generar un "Nivel de ajuste respecto de los criterios definidos para el puesto".

Alcance A-02.1: **metodología documentada, no implementación**. La fase termina
en definiciones, reglas, matrices y lenguaje controlado. La frase de control de
la fase: *sin análisis de puesto, no hay criterios; sin criterios aprobados, no
hay interpretación; sin revisión humana, no hay decisión.*

---

## 2. Modelo de puesto

Registro mínimo de 10 campos (nombre, funciones, responsabilidades,
conocimientos, habilidades, competencias, experiencia, formación, condiciones
relevantes, criterios objetivos), con fuentes válidas F1–F5, regla de
completitud, ciclo de vida (BORRADOR→APROBADO→VIGENTE→DEPRECIADO) y
prohibición de contenido inventado o generado por IA.

> **No inventar criterios automáticamente**: el análisis del puesto es un acto
> humano de la empresa; EvaluHR provee el marco.
> Detalle: `01-job-definition-model.md`.

---

## 3. Modelo de criterios

Taxonomía cerrada de 5 categorías — **A CONOCIMIENTOS · B HABILIDADES/
COMPETENCIAS · C EXPERIENCIA/FORMACIÓN · D PERSONALIDAD · E INTEGRIDAD** —
cada una definida por qué mide, qué NO mide, instrumento posible y evidencia
que genera. Regla de integridad: **un criterio = una categoría** (mezclas
prohibidas).

Vinculación puesto→criterio (PASO 3): todo criterio lleva `criterionId`,
`name`, `description`, `jobRelevance` (trazada a un elemento del registro del
puesto), `requiredOrPreferred`, `evidenceSource`, `approvedBy`, `version`;
proceso de 6 pasos con revisión humana y aprobación explícita.
**Prohibido crear criterios porque "parecen útiles"**; los rechazos se
registran.

> Detalle: `02-criteria-taxonomy.md` y `03-job-criterion-linkage.md`.
> Matriz operativa: `criterion-model.csv` (14 filas: 5 estructurales +
> 9 ejemplos ilustrativos marcados, ninguno aprobado para puesto real).

---

## 4. Competencias

Definición operativa: indicadores conductuales + vínculo al puesto + método de
evidencia. Registro `competencyId/name/definition/behavioralIndicators/
jobRelevance/evidenceMethod`. Biblioteca candidata de 6 competencias (atención
al cliente, comunicación, trabajo en equipo, resolución de problemas,
adaptación, liderazgo) — **candidatas, no aprobadas por defecto**: ninguna es
apropiada para todos los puestos. Hoy no existe método conductual: las
competencias no pueden "medirse"; solo hay auto-reporte orientativo.

> Detalle: `06-competency-model.md`.

---

## 5. Personalidad

El IPIP-50-MX (identidad fija: `EVALHR-PERSONALIDAD-IPIP50-MX` · v1.0 ·
`ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA` · `IPIP50-BFM-1.0`) entra a la metodología
como **fuente de información de rasgos** asociada a criterios D aprobados.

- **Mide**: tendencias auto-reportadas en 5 factores Big Five.
- **NO mide**: desempeño, inteligencia, experiencia, conocimientos, honestidad,
  capacidad profesional, aptitud para contratar.
- La relación rasgo↔puesto se registra como **hipótesis (HDC)** cualitativa,
  trazada al requisito, `status=HIPOTESIS`, sin dirección numérica.
- **Prohibido en A-02.1**: fórmulas ("Responsabilidad > X = recomendado"),
  puntos de corte, percentiles, "perfil ideal" psicométrico, Big Five como
  sustituto del criterio laboral.
- Detalle: `04-personality-use-rules.md`.

---

## 6. Conocimientos

Cadena: requisito del registro → criterio de categoría A (con `content`,
`scope`, `source`, `assessmentIntent`) → *futuro* instrumento derivado del
criterio. Ejemplo conceptual (Mesero / protocolos de servicio / evidencia =
evaluación de conocimientos). **No se crean preguntas en A-02.1.** Nota
documentada: la evidencia de conocimientos de puestos nuevos conserva la
reserva de calidad (`correctAnswer` no persistido → `knowledgeScore=0`;
hallazgo A-01.2, corrección fuera de alcance).

> Detalle: `05-knowledge-criteria.md`.

---

## 7. Integridad

**NO se diseña instrumento.** Se documenta qué pretende medir una evaluación
de integridad (disposición declarada, no conducta observada), qué evidencia
debería existir antes de usarla (checklist de 6 prerrequisitos), sus riesgos
(deseabilidad social, falsos positivos, uso punitivo, adversidad) y qué NO
debe afirmarse.

Frase obligatoria, vigente:

> **"El instrumento actual de integridad de EvaluHR no debe presentarse
> todavía como prueba psicométrica validada."**

> Detalle: `07-integrity-status.md`.

---

## 8. Revisión humana

Flujo de responsabilidades:

```
EvaluHR → genera evidencia técnica
RH      → revisa la evidencia
Empresa → decide
```

**Prohibición estructural**: una recomendación de EvaluHR jamás constituye la
decisión laboral final. La salida registra el estado de revisión humana
(PENDIENTE/REVISADO); el sistema no ofrece lenguaje ni funciones decisorios.

> Detalle: `11-human-review-model.md`.

---

## 9. Nivel de ajuste

Definición conceptual fija: **medida compuesta de correspondencia entre la
evidencia obtenida y los criterios previamente definidos para el puesto.**

En A-02.1: **no se calcula, no hay fórmula, no hay pesos**, y el Big Five **no
sustituye** al criterio laboral. El diseño futuro requiere 7 condiciones
previas (criterios aprobados, evidencia confiable, regla de correspondencia,
regla de composición, decisión de participación por categoría, lenguaje,
revisión humana) — ninguna vigente hoy.

> Detalle: `09-fit-level-concept.md`.

---

## 10. Áreas de revisión

"**Áreas que requieren revisión**" = criterios aprobados con evidencia
ausente, ambigua o en desacuerdo cualitativo con la hipótesis registrada.
Cada área se traza a un `criterionId`; es descriptiva, nunca calificativa.

> Detalle: `10-interview-areas.md`.

---

## 11. Recomendación técnica

"**Recomendación técnica: Considerar para entrevista**" = orientación técnica
para decidir si conviene realizar una entrevista; **NO es decisión de
contratación**, no cierra procesos, no rankea personas. Sin criterios
aprobados no hay recomendación (solo evidencia por instrumento).

> Detalle: `10-interview-areas.md` y `08-decision-rules.md` (contrato de la
> salida orientativa: contexto + evidencia + interpretación + áreas +
> recomendación + limitaciones + revisión).

---

## 12. Limitaciones

Bloque mínimo obligatorio L1–L8: relación personalidad↔puesto no automática ·
un rasgo no determina desempeño · el IPIP no sustituye entrevista ·
conocimiento ≠ personalidad · integridad sin cierre metodológico · sin fórmula
de ajuste validada · sin puntos de corte · sin recomendación automática.
Adicionales L9–L15 (sin análisis real, sin método conductual, reserva de
conocimientos, legacy sin expediente, dependencia de la empresa, sin criterio
externo, uso indebido posible).

> Detalle: `limitations.md`.

---

## 13. Lenguaje permitido

Directorio canónico (`output-language-matrix.md` §1):

- **"Resultado de evaluación"**
- **"Nivel de ajuste respecto de los criterios definidos para el puesto"**
  (solo como concepto, hasta implementación aprobada)
- **"Áreas que requieren revisión"**
- **"Recomendación técnica: Considerar para entrevista"**
- Complementos: "sin evidencia disponible", "resultado orientativo, sujeto a
  revisión humana", "orientación técnica, no decisión de contratación",
  "tendencias de respuesta" (IPIP, con disclaimer A-01.3).

---

## 14. Lenguaje prohibido

Directorio bloqueado (`output-language-matrix.md` §2) — incluye los 6 términos
del encargo:

- **"APTO"** · **"NO APTO"** · **"Debe contratarse"** · **"No debe
  contratarse"** · **"Personalidad ideal"** · **"Predice el éxito laboral"**
- Extendidos: perfil ideal psicométrico · percentil/baremo/norma (como si
  existieran) · puntos de corte/umbral de aprobación · "prueba validada para
  contratación" · "determina qué candidato debe contratarse" · diagnóstico ·
  aptitud laboral determinada · "candidato rechazado" por el sistema ·
  score global que incluya IPIP.
- Filtro semántico: también quedan bloqueados sinónimos reescritos
  ("idóneo", "aprobado por el sistema", "recomendado para contratación").

---

## 15. Matrices

| Matriz | Archivo | Contenido |
|---|---|---|
| Modelo de criterios | `criterion-model.csv` | 10 columnas · 14 filas (5 estructurales A–E + 9 ilustrativas "Mesero" marcadas) · IDs únicos · validada con parser |
| Instrumento ↔ criterio | `instrument-criterion-matrix.csv` | 8 columnas · 5 instrumentos: IPIP-50-MX · Psicológica legacy (deprecada) · Conocimientos · Integridad · Entrevista futura; qué mide / qué NO mide / uso permitido / inferencia prohibida / fuerza de evidencia / estado |
| Lenguaje de salidas | `output-language-matrix.md` | Permitido P1–P8 · prohibido X1–X15 · reglas de aplicación y ejemplos |

---

## 16. Riesgos

| # | Riesgo | Severidad | Mitigación documental |
|---|---|---|---|
| 1 | Uso comercial del término "nivel de ajuste" como si ya existiera | ALTO | Matriz de lenguaje (P2 condicionado) + limitaciones L6 |
| 2 | Empresa decide sin revisión humana usando la recomendación | ALTO | Prohibición estructural (11 §2), lenguaje no decisorio, riesgo L15 registrado |
| 3 | Deriva hacia APTO/NO APTO en futuras iteraciones de producto | ALTO | PASO 8 (prohibiciones), auditoría de lenguaje en cada entrega (17 §3) |
| 4 | "Criterios típicos" genéricos sin análisis (biblioteca usada como combo) | MEDIO | jobRelevance obligatoria + competencias solo candidatas + registro de rechazos |
| 5 | Mezcla de constructos (rasgo→conocimiento→integridad) en interpretaciones | MEDIO | Regla 1 criterio = 1 categoría; "whatItDoesNotMeasure" por instrumento; garde-fous del modelo conceptual |
| 6 | Evidencia de conocimientos poco confiable alimentando el ajuste futuro | MEDIO | Reserva documentada (L11) + matriz de instrumentos (NO confiable para puestos nuevos) |
| 7 | Presión comercial para cerrar metodológicamente la integridad sin evidencia | MEDIO | Checklist de prerrequisitos (07 §3) + frase obligatoria |
| 8 | Expectativa de que el IPIP "defina" el puesto (Big Five como criterio) | MEDIO | HDC cualitativa sin umbral + prohibición de sustitución (04 §5, 09 §2) |

---

## 17. Conclusiones

1. **Metodología completa y coherente**: puesto → criterios → instrumentos →
   evidencia → interpretación → áreas de revisión → revisión humana → decisión
   de la empresa, con garde-fous en cada eslabón
   (`modelo-conceptual.md`).
2. **Nada implementado**: 0 cambios de código, schema, scoring, IA, frontend,
   contrato o datos (`git status`: solo `evidence-a02-1/`); auditoría 11/11 +
   8/8 adicionales (`17-audit-checklist.md`).
3. **Lenguaje controlado como control de producto**: el directorio permitido/
   prohibido es parte de la definición, no un anexo.
4. **Dependencias registradas** para fases futuras: análisis de puesto real
   (empresa), corrección autorizada de `correctAnswer`, método conductual de
   competencias, evidencia para integridad, diseño aprobado del nivel de
   ajuste.
5. **GO documental** para adoptar este marco como base metodológica de
   EvaluHR. **NO-GO** para citar ninguna pieza como funcionalidad existente ni
   para iniciar A-02.2 sin autorización.

---

### Índice del expediente (carpeta evidence-a02-1/)

| Archivo | Contenido |
|---|---|
| `00-master-dossier.md` | Este documento (dossier maestro, 17 secciones) |
| `01-job-definition-model.md` | PASO 1 — Modelo de puesto |
| `02-criteria-taxonomy.md` | PASO 2 — Taxonomía de criterios A–E |
| `03-job-criterion-linkage.md` | PASO 3 — Vinculación puesto→criterio |
| `04-personality-use-rules.md` | PASO 4 — IPIP-50-MX en la metodología (HDC) |
| `05-knowledge-criteria.md` | PASO 5 — Conocimientos |
| `06-competency-model.md` | PASO 6 — Modelo de competencias |
| `07-integrity-status.md` | PASO 7 — Estatus de la integridad |
| `08-decision-rules.md` | PASO 8 — Reglas de decisión (prohibiciones) |
| `09-fit-level-concept.md` | PASO 9 — Concepto de nivel de ajuste |
| `10-interview-areas.md` | PASO 10 — Áreas de revisión y recomendación técnica |
| `11-human-review-model.md` | PASO 11 — Modelo de revisión humana |
| `criterion-model.csv` | PASO 12 — Matriz de criterios |
| `instrument-criterion-matrix.csv` | PASO 13 — Matriz instrumento/criterio |
| `output-language-matrix.md` | PASO 14 — Matriz de lenguaje de salidas |
| `limitations.md` | PASO 15 — Limitaciones |
| `modelo-conceptual.md` | PASO 16 — Modelo conceptual extremo a extremo |
| `17-audit-checklist.md` | PASO 17 — Auditoría final (11/11 + 8 OK) |
