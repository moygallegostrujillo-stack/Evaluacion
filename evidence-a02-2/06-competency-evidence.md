# EVALUHR — A-02.2 · PASO 6
# EVIDENCIA VÁLIDA DE COMPETENCIAS

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se crean preguntas ni scoring de
> competencias en A-02.2.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Qué sería evidencia válida de una competencia

Una evidencia de competencia (evidenceType C, categoría
HABILIDADES_COMPETENCIAS) sería válida **solo si**:

1. Existe una **competencia aprobada para el puesto** (A-02.1 PASO 6:
   `competencyId` + indicadores conductuales + `jobRelevance` + estado
   `APROBADO-PARA-PUESTO`).
2. Existe un **método de evidencia aprobado y versionado** para esa
   competencia (entrevista conductual estructurada o ejercicio observado —
   ninguno implementado hoy).
3. La evidencia registra **indicador por indicador** (no un "sí/creo que sí"
   global), con identificación del evaluador humano y fecha.
4. El registro respeta la cadena del §2 y la revisión del §3.
5. Ningún auto-reporte se presenta como competencia medida.

**Estado actual: no existe ningún método aprobado → hoy NO puede existir
evidencia C válida. Todo intento de producir evidencia de competencia con los
medios actuales del sistema = `INSUFFICIENT` (`reasonCode=NO_METHOD`).**

---

## 2. Cadena metodológica (definida, no implementada)

```
COMPETENCIA (aprobada para el puesto; A-02.1)
   competencyId · name · definition · behavioralIndicators · jobRelevance
        ↓  (método aprobado y versionado — FUTURO)
INDICADOR CONDUCTUAL
   conducta observable buscada (verbo + objeto + contexto), uno a uno
        ↓  (observación/registro humano)
EVIDENCIA
   EvidenceRecord: evidenceType=C · category=HABILIDADES_COMPETENCIAS
   value = registro por indicador (observado / no observado / sin oportunidad
           de observación) — sin puntajes compuestos
   unit  = QUALITATIVE_NOTE (+ BOOLEAN por indicador, según método futuro)
   source = HUMAN_INTERVIEW (evaluador humano identificado)
        ↓
FUENTE
   quién: evaluador humano con identidad registrada
   qué: método versionado (guía de entrevista conductual / ejercicio)
   cuándo: fecha y duración registradas
        ↓
REVISIÓN
   reviewRequired = true (siempre, por ser evidencia humana)
   revisión por segunda persona (RH) antes de cualquier uso
   audit trail completo (PASO 13)
```

**Reglas de la cadena:**

- Cada eslabón requiere el anterior: sin competencia aprobada no hay
  indicadores; sin método aprobado no hay evidencia; sin evaluador
  identificado el registro es `LOW`/`INSUFFICIENT`.
- "Sin oportunidad de observación" es un resultado legítimo del registro (no
  es fallo del candidato ni se convierte en 0 — coherente con PASO 11).
- El sistema nunca "puntúa" la competencia: registra; la lectura es fase
  posterior documentada.

---

## 3. Revisión (obligatoria por diseño)

1. Todo registro C nace con `reviewRequired=true`, `reviewStatus=PENDING`.
2. La revisión la realiza una persona distinta del evaluador cuando sea
   posible (separación de duties; ver PASO 16).
3. La revisión verifica: competencia aprobada, método versionado aplicado,
   indicadores registrados conforme a la guía, ausencia de inferencias no
   registradas.
4. Solo `REVIEWED` permite que el registro alimente lecturas futuras.

---

## 4. Prohibiciones explícitas de A-02.2

- ❌ No crear preguntas de competencias (ni abiertas ni de escenario).
- ❌ No crear scoring, rubricas con puntos ni "niveles de dominio".
- ❌ No usar el auto-reporte legacy (psicológica 10 ítems) como evidencia de
  competencia (es `LOW`, contexto orientativo; herencia A-02.1).
- ❌ No derivar "competencia observada" de rasgos Big Five (mezcla de
  constructos).
- ❌ No usar IA para "evaluar" competencias o completar indicadores
  (PASO 12).

---

## 5. Camino a la validez (futuro, fuera de A-02.2)

1. Aprobación de competencias por puesto (A-02.1 PASO 6: `APROBADO-PARA-PUESTO`).
2. Diseño y aprobación del método conductual versionado (guía/ejercicio).
3. Definición del registro por indicador (estructura del `value`).
4. Capacitación/registro de evaluadores y separación de revisión.
5. Actualización de la matriz de calidad (fila COMPETENCIA → MEDIUM/HIGH
   cuando el método exista y se aplique íntegro).
