# EVALUHR — A-02.5 · PASO 8
# INTEGRIDAD: MANTENER INSUFFICIENT (I-INT-1)

> Documento de diseño metodológico. NO implementa nada. NO diseña un
> instrumento de integridad. Fecha: 2026-09-09 · Versión: 1.0 · Estado:
> PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 7 (estatus de integridad, 6 prerrequisitos); A-02.2 PASO
> 7 (evidencia de integridad); A-02.3 PASO 7 (salida: INSUFFICIENT).

---

## 1. Regla (mandato del encargo)

> **Mantener `INTEGRITY = INSUFFICIENT`** hasta que exista un expediente
> metodológico completo. Sin excepciones, sin "solo como referencia", sin
> sustitutos.

Frase obligatoria (reproducida de A-02.1/A-02.3):

> "El instrumento actual de integridad de EvaluHR no debe presentarse
> todavía como prueba psicométrica validada."

---

## 2. Prerrequisitos para revisar el estado (checklist I-VAL)

| # | Prerrequisito | Definición |
|---|---|---|
| I-VAL-1 | **Instrumento identificado** | Instrumento específico (existente o desarrollado con autorización), con identidad formal (nombre, versión, autoría) |
| I-VAL-2 | **Fuente** | Origen documentado (autor, editorial, documento) |
| I-VAL-3 | **Derechos** | Licencia/derechos de uso verificados para el uso previsto (herencia A-01.3 criterios de derechos) |
| I-VAL-4 | **Constructo** | Definición explícita de qué mide (y qué no); marco teórico citado |
| I-VAL-5 | **Scoring** | Regla de calificación determinista y versionada |
| I-VAL-6 | **Evidencia psicométrica** | Evidencia de confiabilidad/validez aplicable al contexto de uso, documentada críticamente |
| I-VAL-7 | **Condiciones de uso** | Quién administra, bajo qué condiciones, con qué revisión, qué disclaimers, restricciones de interpretación |
| I-VAL-8 | **Suficiencia para el objetivo** | Que el instrumento sirva para el criterio E concreto del puesto (relación instrumento→criterio al menos LIMITED documentada; PASO 11) |

Reglas:

1. I-VAL es **todo-o-nada** (herencia del patrón K-VAL): faltar un item
   mantiene INSUFFICIENT.
2. La revisión del estado es **acto de gobernanza** (PASO 15): nueva versión
   del modelo, aprobación documentada; el sistema no "descubre" que ya hay
   instrumento.
3. Mientras tanto, cualquier criterio E aprobado opera con evidencia
   INSUFFICIENT → si es CRITICAL, activa hard gate de A-02.4 (resultado
   incompleto); si es IMPORTANT/STANDARD, exclusión declarada + área.
   Esta consecuencia debe conocerse **antes** de aprobar criterios E.

---

## 3. Consideraciones de datos sensibles (remite a PASO 14)

Las baterías de integridad tocan típicamente actitudes ante normas, conducta
pasada y percepción de honestidad: información especialmente delicada en
términos de LFPDPPP. A-02.5 **no crea categorías nuevas** ni modifica el
aviso: documenta que la necesidad/proporcionalidad del tratamiento deberá
justificarse **por la finalidad y el puesto** antes de introducir cualquier
instrumento de este tipo (PASO 14). Sin esa justificación, ni siquiera un
instrumento psicométricamente sólido podría introducirse.

---

## 4. Prohibiciones específicas

1. ❌ Score de integridad artificial o cualquier sustituto semántico
   ("confiabilidad", "riesgo", "honestidad medida") — prohibición vigente
   A-02.3 PASO 7.
2. ❌ Presentar el legacy de 10 ítems como prueba validada (frase
   obligatoria §1).
3. ❌ Usar respuestas del IPIP, de la entrevista o del auto-reporte legacy
   como proxy de integridad (transversalidad prohibida, PASO 4).
4. ❌ Filtrado automático por respuestas de integridad ("never auto-filter",
   herencia del código/documentos A-02.1).
5. ❌ Diseñar "entre línea" un instrumento de integridad dentro de A-02.5
   (esta fase solo documenta el camino, no el instrumento).
