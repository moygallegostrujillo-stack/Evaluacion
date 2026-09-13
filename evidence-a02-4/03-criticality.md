# EVALUHR — A-02.4 · PASO 3
# CRITICIDAD (criticality) — CRITICAL / IMPORTANT / STANDARD

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: A-02.1 PASO 3 (Criterion Record, jobRelevance, requiredOrPreferred).

---

## 1. Definición

> La **criticidad** de un criterio es el **peso estructural del criterio
> dentro del puesto**, declarado en su registro aprobado (Criterion Record,
> A-02.1) y determinado por el **análisis del puesto**, NO por el sistema ni
> por la IA.

Valores:

| Valor | Definición conceptual | Consecuencia en el modelo de ajuste |
|---|---|---|
| **CRITICAL** | Criterio cuyo incumplimiento (o cuya imposibilidad de evaluación) **impide evaluar el ajuste de forma responsable**: requisito no negociable, obligación legal/regulatoria, seguridad, condición indispensable para operar el puesto | **NON-COMPENSABLE** + **hard gate**: sin evidencia utilizable (o con conflicto/revisión abierta) → no se produce nivel de ajuste (resultado incompleto) |
| **IMPORTANT** | Criterio que afecta sustancialmente el desempeño esperable del puesto, pero cuya falta puede ser **parcialmente contextualizada o suplida** por el resto del conjunto — nunca ocultada | **PARTIALLY_COMPENSABLE** + tope de nivel (brecha visible; PASO 13) |
| **STANDARD** | Criterio deseable o complementario; su brecha reduce la correspondencia sin invalidar la evaluación | **COMPENSABLE** (exclusión declarada + área de revisión/completación) |

---

## 2. Cómo se determina (reglas de asignación)

1. **Fuente única: el criterio aprobado del puesto** (mandato del encargo).
   La criticidad se declara en el Criterion Record al aprobarse el criterio,
   derivada del análisis de puesto (fuentes válidas F1–F5 de A-02.1 PASO 1):
   - Obligación legal, licencia, seguridad o condición operativa
     indispensable → **CRITICAL**.
   - Requisito requerido que afecta el desempeño central → **IMPORTANT**.
   - Requisito preferible, deseable o complementario → **STANDARD**.
2. **Aprobación humana documentada**: la criticidad forma parte de la
   aprobación del criterio (approvedBy, versión). Cambiarla = nueva versión
   del criterio con registro (gobernanza A-02.1/A-02.2 PASO 16).
3. **Coherencia con requiredOrPreferred** (mapeo PROPUESTA):
   `required` ↔ {CRITICAL, IMPORTANT} · `preferred` ↔ {STANDARD}.
   Un criterio `required` no puede declararse STANDARD; la inconsistencia
   bloquea la aprobación (validación de integridad del registro).
4. **Un criterio por decisión**: un criterio tiene UNA criticidad; la
   criticidad pertenece al criterio, no a la evidencia ni al candidato.
5. **Participación por categoría taxonómica** (herencia A-02.1): cualquier
   categoría (A–E) puede contener criterios de cualquier criticidad; la
   criticidad no depende del instrumento.

---

## 3. Prohibiciones

1. ❌ **La IA determina la criticidad** — unilateral o parcialmente (la IA no
   participa en criterios desde A-02.1; reforzado en PASO 12 de este dossier:
   la IA no puede cambiar criticidad).
2. ❌ Determinar la criticidad **después** de ver la evidencia o el
   candidato (prohibición de ajuste post hoc, herencia A-02.1 PASO 9).
3. ❌ Criticidad "implícita" (sin registro, versión ni aprobación): un
   criterio sin criticidad declarada **no puede participar** del nivel de
   ajuste (es un criterio incompleto; su aprobación está pendiente).
4. ❌ Ajustar la criticidad por presión comercial o para "hacer encajar" un
   resultado (anti-manipulación, herencia A-02.2 PASO 16).
5. ❌ Usar la criticidad como puntaje: es un rol estructural (bloquea/topa/
   pesa estructuralmente), no un multiplicador libre.

---

## 4. Efectos resumidos (remite a los PASOS siguientes)

| Criticidad | INSUFFICIENT / sin evidencia | Conflicto o PENDING_REVIEW | Compensabilidad |
|---|---|---|---|
| CRITICAL | **Hard gate** → resultado incompleto (PASO 6/10) | **Hard gate** | NON-COMPENSABLE (PASO 5) |
| IMPORTANT | Tope de nivel + brecha visible (PASO 13; PROPUESTA) | El criterio no contribuye hasta cierre; brecha visible | PARTIALLY_COMPENSABLE |
| STANDARD | Exclusión declarada + área | El criterio no contribuye hasta cierre | COMPENSABLE |

> La asignación de criticidad es un campo **PROPUESTO** del Criterion Record
> (extensión de A-02.1 PASO 3): su incorporación formal exige nueva versión
> del modelo de criterios con aprobación de gobernanza.
