# EVALUHR — A-02.5 · PASO 2
# FORMALIZACIÓN DE LA CRITICIDAD (CRITICAL / IMPORTANT / STANDARD)

> Documento de diseño metodológico. NO implementa nada. NO define pesos,
> umbrales ni puntos de corte. Fecha: 2026-09-09 · Versión: 1.0 · Estado:
> PROPUESTA METODOLÓGICA.
> Base: A-02.4 PASO 3 (criticidad como rol estructural) y PASO 5/6
> (compensabilidad, gates); A-02.1 PASO 3 (Criterion Record, aprobación
> humana); A-02.5 PASO 1 (jobRelevance = VALID como prerrequisito).

---

## 1. Definición formal

> La **criticidad** es el **peso estructural declarado de un criterio dentro
> del puesto**, fijado en su registro aprobado (Criterion Record) cuando
> `jobRelevance = VALID`, y determinado por el **análisis del puesto**, no
> por el sistema ni por la IA.

`criticality ∈ {CRITICAL, IMPORTANT, STANDARD}` — valor único por criterio,
perteneciente al criterio (no a la evidencia ni al candidato).

**Prerrequisito absoluto**: no existe criticidad asignable sin
`jobRelevance = VALID` (PASO 1). Un criterio sin relevancia demostrada no
puede ser crítico, importante ni estándar — es un criterio incompleto.

---

## 2. Especificación por nivel

### 2.1 CRITICAL

| Aspecto | Especificación |
|---|---|
| **Definición** | Criterio cuyo incumplimiento, o cuya imposibilidad de evaluación, **impide evaluar el ajuste de forma responsable**: requisito no negociable, obligación legal/regulatoria, condición de seguridad o condición operativa indispensable. |
| **Requisitos para asignarlo** | (a) Justificación verificable no negociable (uno de los calificadores del PASO 3); (b) `jobRelevance = VALID` con fuente citada; (c) coherencia con `requiredOrPreferred = REQUIRED`; (d) revisión humana documentada que confirma el calificador. |
| **Quién lo aprueba** | Aprobador humano designado por la empresa (campo `approvedBy` del Criterion Record), como parte de la aprobación del criterio. **La IA no participa** (AI-X12 heredada; AI-X19 en PASO 15). |
| **Evidencia necesaria** | Fuente S1–S8 (PASO 1) que documente el carácter no negociable — p. ej., cita normativa (S6), función indispensable registrada (S2/S3). |
| **Consecuencias metodológicas** | NON-COMPENSABLE · hard gate G1–G4 (A-02.4 PASO 6): sin lectura utilizable, con conflicto abierto o revisión pendiente → **no se produce nivel de ajuste** (resultado incompleto). Ni siquiera BAJO. |

### 2.2 IMPORTANT

| Aspecto | Especificación |
|---|---|
| **Definición** | Criterio que afecta sustancialmente el desempeño esperable del puesto, pero cuya falta puede ser **parcialmente contextualizada o suplida** por el resto del conjunto — nunca ocultada. |
| **Requisitos** | (a) Impacto sustancial documentado en el análisis de puesto; (b) `jobRelevance = VALID`; (c) normalmente `REQUIRED` (puede ser `PREFERRED` con justificación); (d) aprobación humana. |
| **Quién lo aprueba** | Igual que CRITICAL: aprobador humano del Criterion Record. |
| **Evidencia necesaria** | Fuente S1–S5 típicamente (función/responsabilidad/conocimiento/competencia observable). |
| **Consecuencias metodológicas** | PARTIALLY_COMPENSABLE · tope de nivel con brecha visible (soft gate PROPUESTA de A-02.4): la brecha **nunca desaparece** ni se compensa en silencio. |

### 2.3 STANDARD

| Aspecto | Especificación |
|---|---|
| **Definición** | Criterio deseable o complementario; su brecha reduce la correspondencia sin invalidar la evaluación. |
| **Requisitos** | (a) `jobRelevance = VALID` (la deseabilidad también se demuestra); (b) típicamente `PREFERRED`; (c) aprobación humana. |
| **Quién lo aprueba** | Igual que los demás: aprobador humano del Criterion Record. |
| **Evidencia necesaria** | Fuente S1–S5/S7 que documente por qué es deseable para **este** puesto. |
| **Consecuencias metodológicas** | COMPENSABLE · exclusión declarada + área de revisión/completación si falta evidencia (A-02.4). |

---

## 3. Reglas de asignación (consolidado normativo)

1. **Fuente única: el análisis del puesto**, declarado en el Criterion
   Record **antes** de ver evidencia de candidatos (prohibición de ajuste
   post hoc, A-02.4 PASO 3 §3).
2. **Aprobación humana documentada**: la criticidad forma parte de la
   aprobación del criterio (`approvedBy`, `version`). Cambiarla = nueva
   versión con registro de gobernanza (PASO 15/18).
3. **Coherencia interna del registro** (PROPUESTA, heredada):
   `required` ↔ {CRITICAL, IMPORTANT} · `preferred` ↔ {STANDARD}.
   Inconsistencia = aprobación bloqueada.
4. **Un criterio, una criticidad**; sin criticidad declarada el criterio no
   participa del nivel de ajuste.
5. **La criticidad no depende del instrumento ni de la categoría**: cualquier
   categoría A–E puede alojar cualquier criticidad *en abstracto*, pero el
   PASO 3 restringe cuándo una categoría puede efectivamente sostener un
   CRITICAL (p. ej., personalidad hoy no puede).
6. **La criticidad es rol estructural, no puntaje**: no es multiplicador, no
   es percentil, no es peso numérico (prohibición de inventar pesos — regla
   principal del encargo A-02.5).

---

## 4. Prohibiciones

1. ❌ **La IA establece criticidad** — unilateral o parcialmente (AI-X12 +
   AI-X19; PASO 15).
2. ❌ Criticidad fijada post hoc, o manipulada para "hacer encajar" un
   resultado (anti-manipulación A-02.4).
3. ❌ Criticidad implícita (sin registro, versión ni aprobación).
4. ❌ CRITICAL sin calificador verificable del PASO 3 ("es crítico porque lo
   sentimos así" no califica).
5. ❌ Usar la criticidad para rankear personas: describe estructura del
   puesto, no personas.
6. ❌ Convertir criticidad en peso numérico libre en la fórmula de ajuste:
   la Wᵢ estructural de A-02.4 (SOLO EJEMPLO — NO PRODUCTIVO) es una
   representación conceptual, no autorización para inventar pesos.

---

## 5. Efectos resumidos (remite a A-02.4)

| Criticidad | INSUFFICIENT / sin evidencia | Conflicto / PENDING_REVIEW | Compensabilidad |
|---|---|---|---|
| CRITICAL | Hard gate → resultado incompleto | Hard gate | NON-COMPENSABLE |
| IMPORTANT | Tope de nivel + brecha visible (PROPUESTA) | No contribuye hasta cierre; brecha visible | PARTIALLY_COMPENSABLE |
| STANDARD | Exclusión declarada + área | No contribuye hasta cierre | COMPENSABLE |

> La criticidad es un campo PROPUESTO del Criterion Record: su incorporación
> formal exige nueva versión del modelo de criterios con aprobación de
> gobernanza (herencia A-02.4 PASO 3 §5).
