# EVALUHR — A-02.2 · PASO 7
# EVIDENCIA DE INTEGRIDAD: ESTADO ACTUAL

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Estado documentado (decisión de A-02.2)

> **El instrumento de integridad de EvaluHR NO dispone todavía de evidencia
> suficiente para ser tratado como instrumento psicométrico validado.**
>
> Por tanto, toda evidencia producida por ese instrumento se registra con:
>
> **quality = INSUFFICIENT**
>
> **hasta que exista expediente suficiente.**

Esta regla (I-INT-1) es mandatoria y refleja, en el modelo de evidencia, la
decisión de A-02.1 (`07-integrity-status.md`) y la frase obligatoria de
lenguaje:

> "El instrumento actual de integridad de EvaluHR no debe presentarse todavía
> como prueba psicométrica validada."

---

## 2. Situación concreta del instrumento (solo documentación, sin modificar)

- Instrumento legacy de 10 ítems (honestidad, normas, hurto,
  responsabilidad), compartido para todos los puestos, sin versión formal,
  sin identidad de instrumento tipo A-01.3, sin estudio propio y sin
  evidencia publicada.
- Diseño de producto vigente: orientativo, "never auto-filter" (sin filtro
  automático).
- En el modelo de evidencia: evidenceType A (TEST/INSTRUMENTO) formalmente,
  pero **sin base documentada** para inferir integridad → la calidad del
  registro no puede exceder lo que el método soporta → `INSUFFICIENT`
  (criterios del PASO 3 §2, punto 3 con `QUALITY_FAIL`; y §3 regla del
  instrumento sin expediente).

Matiz honesto: el instrumento **captura datos** (respuestas auto-reportadas)
y esos datos se conservan; lo que no puede hacer la evidencia es **sostener
una lectura del criterio de integridad**. El dato crudo ≠ lectura válida.

---

## 3. Tratamiento en el EvidenceRecord

| Campo | Valor |
|---|---|
| evidenceType | A (TEST/INSTRUMENTO) |
| category | INTEGRIDAD |
| instrument | EVALHR-INTEGRIDAD-LEGACY |
| instrumentVersion | SIN-VERSION-FORMAL (agrava la limitación) |
| value / unit | puntaje crudo capturado / RAW (conservado como dato) |
| **quality** | **INSUFFICIENT** (`reasonCode=QUALITY_FAIL`) |
| reviewRequired | true |
| salida asociada | "Información insuficiente para evaluar este criterio." |

Uso permitido de estos registros mientras dure el estado: ninguno para
lectura del criterio; los datos quedan conservados para el expediente futuro
y para transparencia hacia la persona evaluada (según aviso de privacidad
vigente, que no se modifica).

---

## 4. Qué tendría que existir para salir de INSUFFICIENT

Checklist heredado de A-02.1 (07 §3), condición necesaria y suficiente para
activar la revisión de calidad:

1. Identificación formal del instrumento (cuádruple identificador tipo
   A-01.3).
2. Estudio propio o externo sobre la versión administrada por EvaluHR
   (consistencia interna, estructura, deseabilidad social) — publicado o
   revisado por asesoría en psicometría.
3. Definición del criterio externo (evidencia independiente de contraste).
4. Revisión legal y de privacidad del uso previsto antes de operarlo.
5. Aprobación de gobernanza documentada.
6. Política de uso (prohibición de uso exclusivo, punitivo y automático).

Mientras el checklist esté incompleto: **integridad = INSUFFICIENT** (regla
I-INT-1). No hay plazos ni atajos: la salida del estado es decisión de
gobernanza con evidencia, no de producto.

---

## 5. Prohibiciones asociadas (vigentes)

- ❌ "Prueba de integridad validada" / "psicométricamente validada".
- ❌ "Detecta ladrones" / "mide honestidad real" / "predice conducta".
- ❌ Uso del resultado como filtro, ranking o base única de decisión.
- ❌ Convertir el puntaje crudo en lectura del criterio mientras
  quality=INSUFFICIENT.
- ❌ Que la IA "interprete" o "complete" la evidencia de integridad.
