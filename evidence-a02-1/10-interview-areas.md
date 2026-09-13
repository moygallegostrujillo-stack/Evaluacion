# EVALUHR — A-02.1 · PASO 10
# ÁREAS QUE REQUIEREN REVISIÓN Y RECOMENDACIÓN TÉCNICA DE ENTREVISTA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Cadena de transformación (definida conceptualmente, sin implementar)

```
EVIDENCIA (resultados por instrumento, con versión)
        ↓  (regla de identificación de áreas — futura, aprobada)
"ÁREAS QUE REQUIEREN REVISIÓN"
        ↓  (regla de recomendación — futura, aprobada)
"Recomendación técnica: Considerar para entrevista"
        ↓
REVISIÓN HUMANA (RH)
        ↓
DECISIÓN DE LA EMPRESA (entrevistar o no; contratar o no)
```

---

## 2. "Áreas que requieren revisión" — definición

Un **área que requiere revisión** es un **criterio aprobado del puesto** para
el cual la evidencia disponible presenta alguna de estas condiciones:

| Condición | Significado | Ejemplo de lectura (permitida) |
|---|---|---|
| **Sin evidencia** | El criterio no tiene resultado (no se aplicó el instrumento o está incompleto) | "Sin evidencia disponible para este criterio" |
| **Evidencia ambigua** | El resultado no permite una lectura clara (p. ej., respuestas inconsistentes, resultado intermedio sin norma de lectura) | "El resultado no permite una lectura clara; conviene explorar en entrevista" |
| **Desacuerdo con lo esperado** | La evidencia apunta en dirección distinta a la esperada por la hipótesis de correspondencia registrada (HDC, PASO 4) — **descrita cualitativamente, sin umbral** | "El resultado difiere de la dirección registrada como hipótesis para este criterio" |

Reglas de las áreas:

1. El área **siempre referencia un criterio** (nunca un rasgo suelto, ni un
   "aspecto general de la persona").
2. El área es **descriptiva**: describe qué conviene revisar y por qué; no
   califica a la persona.
3. Prohibido derivar del área: etiquetas de rechazo, puntos de corte,
   promedios ocultos, o "nivel de gravedad".
4. Si no hay criterios aprobados con evidencia, **no hay áreas** (la salida
   lo declara explícitamente).

---

## 3. "Recomendación técnica: Considerar para entrevista" — definición

Semántica exacta:

> La recomendación es una **orientación técnica para decidir si conviene
> realizar una entrevista**, derivada del conjunto de áreas que requieren
> revisión y de la completitud de la evidencia.
>
> **NO es una decisión de contratación. NO es un veredicto sobre la persona.
> NO sustituye la entrevista ni la decisión humana.**

Cuándo aplica la recomendación (condiciones conceptuales futuras):

- Existen criterios aprobados para el puesto (PASO 3).
- Existe evidencia parcial o completa de esos criterios.
- Existen áreas que requieren revisión que **conviene explorar en
  conversación directa** (por ambigüedad, por falta de evidencia, o por
  desacuerdo cualitativo con la hipótesis registrada).

Cuándo NO aplica:

- No hay criterios aprobados → no hay recomendación (solo evidencia cruda).
- La salida no puede sustentarse en criterios documentados → no hay
  recomendación.

---

## 4. Redacción permitida (resumen; directorio completo en
`output-language-matrix.md`)

| Permitido | Prohibido |
|---|---|
| "Áreas que requieren revisión" | "Debilidades del candidato" |
| "Recomendación técnica: Considerar para entrevista" | "APTO para entrevista" / "Candidato aprobado" |
| "Conviene explorar este punto en entrevista" | "Debe descartarse" |
| "Evidencia disponible / sin evidencia disponible" | "No cumple el perfil" |
| "Orientación técnica, no decisión de contratación" | "Predice el éxito laboral" |

---

## 5. Trazabilidad obligatoria de cada área

Cada área registrada debe poder desplegar:

```
área → criterionId → jobRelevance (requisito del puesto) →
hipótesis/evidencia que motivó el área → instrumento + versión
```

Sin esa cadena, el área no puede mostrarse (previene áreas "de intuición" o
generadas por IA sin fuente).

---

## 6. Papel de la IA (ninguno, por ahora)

La identificación de áreas y la recomendación futura deben ser
**determinísticas y auditables** (reglas documentadas), no generadas por IA.
Cualquier uso futuro de IA en este punto requeriría autorización expresa de
gobernanza, evidencia de calidad y registro de origen — hoy no existe tal
autorización. Coherente con A-01.3 (IA fuera del resultado psicométrico) y
`03-job-criterion-linkage.md` §7 (IA fuera de criterios).
