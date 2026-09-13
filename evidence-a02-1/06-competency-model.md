# EVALUHR — A-02.1 · PASO 6
# MODELO DE COMPETENCIAS LABORALES

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementan instrumentos de
> competencias en A-02.1.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Qué es una competencia laboral para EvaluHR

Definición operativa:

> Una **competencia laboral** es un conjunto de **indicadores conductuales**
> asociados a un desempeño esperado en un puesto concreto, que puede
> observarse, describirse y (futuro) evaluarse mediante un **método de
> evidencia** definido y documentado.

Componentes obligatorios del concepto:

1. **Conducta observable** (no rasgo interno, no "actitud" difusa).
2. **Vínculo con el puesto** (jobRelevance): la competencia existe para un
   puesto porque un requisito del registro lo justifica.
3. **Método de evidencia** (evidenceMethod): cómo se obtendría evidencia.
   Sin método definido, la competencia es un **candidato documentado**, no un
   criterio evaluable.

---

## 2. Registro de competencia (Competency Record)

Cada competencia futura se define con:

| Campo | Descripción | Reglas |
|---|---|---|
| `competencyId` | Identificador único | `CMP-<slug>-<NN>`; estable; no reutilizable |
| `name` | Nombre breve | "Atención al cliente", no "Orientación al cliente proactiva sinérgica" |
| `definition` | Qué es y qué no es, en una frase verificable | Debe poder mostrarse a un candidato sin ambigüedad |
| `behavioralIndicators` | Lista de conductas observables que la evidencian | Cada indicador debe ser observable en el trabajo o en un ejercicio; mínimo 3, redactados en conducta (verbo + objeto + contexto) |
| `jobRelevance` | Trazabilidad al puesto | Referencia al registro del puesto (PASO 3); prohibido lo genérico sin análisis |
| `evidenceMethod` | Método previsto para obtener evidencia | `AUTO_REPORTE_ORIENTATIVO` (hoy, insuficiente) · `ENTREVISTA_CONDUCTUAL_FUTURA` · `EJERCICIO_CONDUCTUAL_FUTURO` — ninguno implementado aún |
| `status` | `CANDIDATO` / `APROBADO-PARA-PUESTO` / `SUSPENDIDO` / `DEPRECIADO` | Solo `APROBADO-PARA-PUESTO` puede recibir evidencia |
| `version` | Versión del registro | Cambios en indicadores = versión mayor |

---

## 3. Biblioteca candidata (NO aprobada por defecto)

El encargo lista competencias posibles. Se registran como **candidatas**,
cada una con definición e indicadores de partida. **Ninguna es apropiada por
defecto para todos los puestos**: su activación exige análisis del puesto
(PASO 1) + vinculación (PASO 3) + aprobación (approvedBy).

> ⚠️ Los indicadores siguientes son **puntos de partida a validar con la
> empresa** en un análisis real; no son instrumento, no son reactivos, no son
> scoring.

### CMP-ATC — Atención al cliente
- **definition**: Anticipa y responde a las necesidades de clientes con cortesía y seguimiento.
- **behavioralIndicators (partida)**: saluda y reconoce al cliente en tiempo razonable · reformula la necesidad del cliente antes de actuar · cierra la interacción confirmando que quedó resuelta.
- **jobRelevance**: puestos con contacto directo prolongado con clientes.
- **evidenceMethod**: futura entrevista conductual / ejercicio.

### CMP-COM — Comunicación
- **definition**: Transmite información de forma clara, oportuna y comprensible para el receptor.
- **behavioralIndicators (partida)**: adapta nivel de detalle al receptor · confirma comprensión antes de proceder · reporta a tiempo problemas o cambios.

### CMP-EQP — Trabajo en equipo
- **definition**: Coordina acciones con otras personas para lograr un resultado común.
- **behavioralIndicators (partida)**: comparte información relevante con quien la necesita · ofrece ayuda cuando detecta sobrecarga ajena · respeta acuerdos de equipo aunque discrepe.

### CMP-RSP — Resolución de problemas
- **definition**: Identifica, prioriza y ejecuta acciones ante situaciones no previstas.
- **behavioralIndicators (partida)**: distingue síntoma de causa antes de actuar · comunica la acción elegida a los afectados · escala cuando excede su alcance.

### CMP-ADP — Adaptación
- **definition**: Ajusta su forma de trabajar ante cambios de contexto, procedimiento o demanda.
- **behavioralIndicators (partida)**: solicita las nuevas reglas cuando algo cambia · modifica su rutina sin degradar el resultado · reporta fricciones en lugar de ocultarlas.

### CMP-LDR — Liderazgo
- **definition**: Orienta y sostiene el esfuerzo de otros hacia un objetivo, asumiendo responsabilidad por el resultado del grupo.
- **behavioralIndicators (partida)**: asigna y explica tareas con criterio explícito · da seguimiento sin microgestión · asume errores propios del equipo ante superiores.

---

## 4. Relación con la categoría B de la taxonomía

- Las competencias viven en la **categoría B** (HABILIDADES/COMPETENCIAS).
- En la implementación actual **no existe método conductual**: lo único
  disponible es auto-reporte orientativo (legacy) — que NO acredita
  competencia. Por ello, toda competencia estará `CANDIDATO` o
  `SUSPENDIDO` hasta que exista `evidenceMethod` implementado.
- Prohibido: derivar "competencias" directamente de rasgos Big Five (un rasgo
  no es una competencia; ver `04-personality-use-rules.md` y
  `limitations.md`).

---

## 5. Prohibiciones

1. Aplicar la biblioteca completa a todos los puestos ("combo estándar").
2. Aprobar competencias sin `jobRelevance` trazada.
3. Presentar auto-reporte como "competencia medida".
4. Convertir indicadores conductuales en reactivos de personalidad.
5. Usar la IA para generar indicadores (autoría humana, ver `03` §7).
