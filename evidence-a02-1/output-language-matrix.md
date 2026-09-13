# EVALUHR — A-02.1 · PASO 14
# MATRIZ DE SALIDAS — LENGUAJE PERMITIDO Y PROHIBIDO

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0
> Complemento del directorio comercial del IPIP: `evidence-a01-3/08-permitted-use.md`.

---

## 1. Directorio de lenguaje PERMITIDO (términos oficiales de salida)

Los siguientes términos son el **vocabulario canónico** para las salidas del
sistema (pantallas, reportes, documentos). Deben usarse literalmente cuando
aplique:

| # | Término permitido | Uso previsto | Condición |
|---|---|---|---|
| P1 | **"Resultado de evaluación"** | Nombrar cualquier resultado por instrumento | Siempre con instrumento + versión identificables |
| P2 | **"Nivel de ajuste respecto de los criterios definidos para el puesto"** | Nombre oficial del futuro concepto compuesto (PASO 9) | Solo como descripción conceptual del enfoque hasta que exista implementación aprobada; jamás como número/etiqueta inexistente |
| P3 | **"Áreas que requieren revisión"** | Encabezado de la lista de criterios a explorar (PASO 10) | Cada área trazada a un criterionId |
| P4 | **"Recomendación técnica: Considerar para entrevista"** | Salida orientativa máxima del sistema (PASO 10) | Solo con criterios aprobados + evidencia; siempre acompañada del carácter orientativo |
| P5 | "Sin evidencia disponible para este criterio" | Reporte de completitud | Preferible a cualquier inferencia |
| P6 | "Resultado orientativo, sujeto a revisión humana" | Calificador general de salidas | Obligatorio en bloques de resultado |
| P7 | "Orientación técnica, no decisión de contratación" | Calificador de la recomendación técnica | Obligatorio junto a P4 |
| P8 | "Tendencias de respuesta" (para IPIP-50-MX) | Lectura de resultados de personalidad | Con disclaimer literal de A-01.3 |

---

## 2. Directorio de lenguaje PROHIBIDO (términos bloqueados)

Los siguientes términos **no pueden aparecer** en ninguna salida, pantalla,
reporte ni documento comercial como atributos del sistema o de una persona:

| # | Término prohibido | Por qué está prohibido | Sustituto permitido |
|---|---|---|---|
| X1 | **"APTO"** | Implica veredicto de idoneidad sin evidencia que lo sostenga | P4 / P6 |
| X2 | **"NO APTO"** | Ídem; además invita a rechazo automático | P3 / P5 |
| X3 | **"Debe contratarse"** | La decisión es exclusivamente de la empresa (PASO 11) | P4 |
| X4 | **"No debe contratarse"** | Ídem | P3 / P5 |
| X5 | **"Personalidad ideal"** | No existen perfiles psicométricos ideales por puesto (A-01.3) | Descripción del requisito conductual del criterio |
| X6 | **"Predice el éxito laboral"** | No existe evidencia predictiva de EvaluHR (A-01.3) | "Insumo de revisión humana" |
| X7 | "Perfil ideal psicométrico" / "candidato ideal" | Ídem X5 | P2 (conceptual) |
| X8 | "Percentil" / "baremo" / "norma" (como si existieran) | No existen para instrumentos EvaluHR (A-01.3) | "Puntaje bruto por factor (rango 10–50)" |
| X9 | "Puntos de corte" / "umbral de aprobación" | Prohibidos en A-02.1 (PASO 8) | "Correspondencia descrita con el criterio" |
| X10 | "Prueba validada para contratación" | Prohibición heredada de A-01.3 | P6 |
| X11 | "Determina qué candidato debe contratarse" | Ídem | P4 |
| X12 | "Diagnóstico" (de personalidad/integridad) | No hay función diagnóstica | P1 |
| X13 | "Aptitud laboral" (como resultado determinado) | Ídem | Descripción de criterios |
| X14 | "Candidato rechazado" (por salida del sistema) | Rechazo automático prohibido (PASO 8) | P3/P5 + decisión humana externa |
| X15 | "Score global del candidato" (que incluya IPIP) | IPIP excluido de overall (A-01.2/A-01.3) | "Resultados por instrumento y por criterio" |

---

## 3. Reglas de aplicación

1. **Literalidad**: los términos permitidos P1–P4 se usan tal cual (mayúsculas
   o estilo visual libre, texto idéntico).
2. **No co-ocurrencia**: ningún término prohibido puede aparecer como sinónimo
   reescrito (p. ej., "idóneo", "calificado", "aprobado por el sistema",
   "recomendado para contratación") — el filtro es semántico, no solo léxico.
3. **Contexto comercial**: en propuestas y marketing se aplican ambas listas;
   descripciones del enfoque pueden usar P2 en sentido conceptual con la nota
   "diseño metodológico, no función disponible".
4. **Herencia**: todo lo prohibido en `evidence-a01-3/08-permitted-use.md`
   sigue prohibido aquí (no hay relajación).
5. **Auditoría**: cada entrega de producto que introduzca nuevas salidas
   verifica su lenguaje contra esta matriz (checklist PASO 17).

---

## 4. Ejemplos de redacción correcta (salida orientativa futura)

```
✔ "Resultado de evaluación: Evaluación de Personalidad — Modelo Big Five
   (tendencias de respuesta; no constituye percentil)."

✔ "Áreas que requieren revisión: Conocimiento de protocolos de servicio
   (sin evidencia disponible)."

✔ "Recomendación técnica: Considerar para entrevista.
   Orientación técnica, no decisión de contratación."
```

Incorrecto:

```
✘ "Candidato APTO para el puesto."        (X1)
✘ "Su personalidad encaja con el ideal."  (X5)
✘ "Recomendado para contratación."        (X3)
```
