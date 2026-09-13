# EVALUHR — A-02.5 · PASO 1
# RELEVANCIA DEL CRITERIO (jobRelevance)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.5.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 1 (modelo de puesto, fuentes F1–F5) y PASO 3 (Criterion
> Record, campo `jobRelevance`); A-02.3 PASO 1 (estados de evidencia);
> A-02.4 PASO 3 (criticidad).

---

## 1. Propósito

Definir **cómo se demuestra que un criterio es relevante para un puesto** y
qué constituye evidencia suficiente para declarar
**`jobRelevance = VALID`**.

Principio heredado (A-02.1 PASO 3 §1): *todo criterio debe estar vinculado a
una característica real del puesto; prohibido crear criterios porque
"parecen útiles".* A-02.5 no relaja este principio: lo **operacionaliza**
definiendo cuándo la vinculación está demostrada.

`jobRelevance` es un atributo del **criterio** (relación criterio ↔ puesto),
no de la evidencia del candidato. Un criterio con relevancia VALID puede aun
así terminar con evidencia INSUFFICIENT para una persona — son capas
distintas (A-02.3 PASO 1).

---

## 2. Fuentes admisibles para demostrar relevancia

| # | Fuente | Qué aporta | Límite |
|---|---|---|---|
| S1 | Descripción del puesto (registro vigente) | Texto formal de funciones/responsabilidades | Debe corresponder al puesto **real**; si el documento está desactualizado no basta sola |
| S2 | Funciones reales (análisis de puesto, entrevista F1) | Lo que la persona en el puesto efectivamente hace | Debe registrarse quién informó, cuándo y con qué método |
| S3 | Responsabilidades observadas (observación directa F3) | Conducta del puesto en operación | Registro fechado del observador |
| S4 | Conocimientos necesarios (declarados por la empresa, F2/F5) | Contenidos específicos que el puesto exige | Deben nombrar contenido exacto (regla A-02.1 categoría A) |
| S5 | Competencias observables del puesto | Indicadores conductuales exigidos por el rol | Solo con definición e indicadores (no etiquetas sueltas) |
| S6 | Requisitos legales del puesto | Obligaciones normativas aplicables (p. ej., norma oficial de higiene, licencia) | Debe citarse la norma/obligación; la cita es del análisis, no la inventa el sistema |
| S7 | Análisis de expertos | Juicio documentado de personas con conocimiento del puesto | Mínimo: quiénes, método, fecha, conclusiones; ver PASO 10 |
| S8 | Evidencia empírica (estudios, validez de criterio) | Relación demostrada requisito↔resultado en contexto comparable | Opcional; **nunca exigida** para VALID (no existe hoy para puestos EvaluHR); si se usa, se documenta con fuente |

Reglas transversales:

1. **Toda fuente se registra con fecha y origen** (herencia F1–F5 de A-02.1).
2. **Una sola fuente puede bastar** si es de alta especificidad (S6 legal
   citada; S1/S2 con elemento exacto del registro de puesto), pero la
   aprobación humana siempre se exige (§3).
3. **Las bibliotecas genéricas de criterios NO son fuente** (prohibición
   A-02.1 PASO 3 §6): "todos los puestos necesitan escrupulosidad" no es
   relevancia demostrada.
4. **La IA no es fuente** (A-02.1 PASO 3 §7: cero participación de IA en
   criterios; se reafirma en PASO 15 de este dossier).

---

## 3. Estados de relevancia y qué basta para `jobRelevance = VALID`

`jobRelevance` adopta la semántica de estados de A-02.3 (VALID / LIMITED /
INSUFFICIENT / PENDING_REVIEW), aplicada a la relación criterio↔puesto:

| Estado | Significado | Condiciones suficientes |
|---|---|---|
| **VALID** | La relevancia del criterio para el puesto está demostrada y aprobada | **R-REL-1..5 completas** (tabla inferior) |
| **LIMITED** | Relevancia plausible pero documentación parcial (p. ej., solo mención genérica en la descripción, sin elemento específico) | Puede orientar, pero el criterio **no entra a producción metodológica** (PASO 18) |
| **INSUFFICIENT** | Sin fuente documentada, o fuente no verificable, o "relevancia obvia" no documentada | No participa; registrable como propuesta (DRAFT) |
| **PENDING_REVIEW** | Documentación presentada, pendiente de revisión humana | Bloqueado hasta cierre de revisión |

### Checklist para `jobRelevance = VALID` (todas obligatorias)

| # | Regla | Verificación |
|---|---|---|
| R-REL-1 | Trazabilidad a un **elemento específico** del registro de puesto vigente (campo + elemento, p. ej., "functions[2] — atender mesas y tomar órdenes") | jobRelevance cita el elemento; prohibido "útil en general" |
| R-REL-2 | **Fuente admisible S1–S8** documentada con fecha y origen | evidenceSource del Criterion Record |
| R-REL-3 | Clasificación en **una categoría A–E** (taxonomía A-02.1 PASO 2); si parece de dos, se descompone | category del registro |
| R-REL-4 | **Revisión humana** que confirma que el criterio corresponde al puesto real (RH de la empresa; P5 del proceso A-02.1) | registro de revisión con revisor y fecha |
| R-REL-5 | **Aprobación y versión**: approvedBy (humano designado) + version | campos del Criterion Record |

Notas:

- R-REL-4 y R-REL-5 son innegociables: **ninguna combinación de fuentes
  sustituye la aprobación humana**.
- La evidencia empírica (S8) **refuerza** pero no sustituye R-REL-1..5.
- Si el puesto cambia (nueva versión del registro), la relevancia se
  **revalida**: los criterios cuya trazabilidad apuntaba a elementos que ya
  no existen pasan a RETIRED o requieren nueva trazabilidad (PASO 18).

---

## 4. Coherencia con las capas existentes

```
PUESTO (registro vigente)
   └─ elemento (functions[i], responsibilities[j], requisito legal…)
        └─ CRITERIO (criterionId, category, jobRelevance=VALID|…)
             └─ CRITICIDAD (CRITICAL/IMPORTANT/STANDARD — PASO 2)
                  └─ INSTRUMENTO → EVIDENCIA (estados A-02.3)
                       └─ LECTURA (CriterionResult) → NIVEL DE AJUSTE (A-02.4)
```

- `jobRelevance` gobierna la **entrada** (el criterio existe legítimamente).
- Los estados de evidencia (A-02.3) gobiernan la **evaluación por persona**.
- La criticidad (PASO 2) y el modelo de ajuste (A-02.4) gobiernan el
  **peso estructural** en la composición.

Un criterio con `jobRelevance ≠ VALID` queda fuera de la cadena: no recibe
evidencia para interpretación, no tiene criticidad activa y no participa en
el nivel de ajuste.

---

## 5. Prohibiciones específicas de este PASO

1. ❌ Declarar VALID por "sentido común" o porque el criterio "siempre se usa".
2. ❌ Relevancia VALID sin elemento trazable del puesto vigente.
3. ❌ Que la IA genere, sugiera o prellene `jobRelevance` (herencia A-02.1;
   reforzada con AI-X18 en PASO 15).
4. ❌ Fijar relevancia **después** de ver la evidencia o el candidato
   (prohibición de ajuste post hoc, heredada).
5. ❌ Copiar criterios entre puestos sin rehacer la trazabilidad (un criterio
   idéntico en otro puesto exige su propia cadena R-REL-1..5).
6. ❌ Presentar una fuente S8 empírica genérica ("los estudios dicen que la
   escrupulosidad predice desempeño") como demostración de relevancia para
   un puesto específico: la relación rasgo→criterio se rige por PASO 5/11,
   y jamás convierte un rasgo en requisito por sí sola.
