# A-01.3 — PASO 13: MATRIZ JURÍDICA DEL LENGUAJE COMERCIAL/DOCUMENTAL

> Alcance y límites de este documento:
> - Su objetivo es que **ninguna afirmación comercial o documental exceda la evidencia
>   del expediente** (consistencia documental, no asesoría legal).
> - **No inventa obligaciones legales específicas** ni cita normas que no estén
>   verificadas en el proyecto. Donde se menciona el marco mexicano de protección de
>   datos (LFPDPPP), es porque el proyecto ya lo trata explícitamente (aviso de
>   privacidad y Art. 37 Bis referenciado en la implementación).
> - **No da por demostrada ninguna certificación** (no existe).
> - **No afirma validación específica de selección** (no existe).
> - Este documento NO sustituye la revisión de un profesional del derecho.

## Leyenda de riesgo

- **BAJO**: la afirmación está plenamente cubierta por la evidencia del expediente.
- **MEDIO**: la afirmación requiere redacción cuidadosa y referencia explícita a la
  fuente/limitación; riesgo de sobreinterpretación por el lector.
- **ALTO**: la afirmación excede la evidencia; su uso genera riesgo de publicidad no
  sustentada / expectativas falsas frente a clientes, candidatos y autoridades, y
  contradice el expediente. **Prohibida.**

## Matriz 1 — Descripción del producto (materiales comerciales, sitio web, pitches)

| Afirmación (¿"EvaluHR aplica un test de personalidad Big Five"? ) | Evidencia | Riesgo | Lenguaje permitido | Lenguaje prohibido | Documento donde deberá utilizarse |
|---|---|---|---|---|---|
| Descripción del instrumento | Fuente IPIP + 50 ítems verbatim | BAJO | "Evaluación de personalidad basada en el modelo Big Five (50 ítems del IPIP)." | "Test psicométrico propio de EvaluHR" | Sitio web, one-pager, deck comercial, descripción del módulo en contrato/anexos |
| Origen de los ítems | Dominio público declarado por IPIP | BAJO | "Ítems del International Personality Item Pool (IPIP), de dominio público; versión mexicana publicada por Rodrigo de Oliveira." | "Reactivos creados por EvaluHR" / "tecnología propietaria de reactivos" | Sitio web, documentación de producto |
| Evidencia publicada | de Oliveira et al. 2013 (α .73–.83 en su muestra) | MEDIO | "Cuenta con evidencia psicométrica publicada para una adaptación mexicana (de Oliveira, Cherubini & Oliver, 2013)." | "Test validado en México" / "validado para selección" / "respaldado científicamente para contratación" | Materiales técnicos, propuestas a clientes |
| Precisión de medición | No hay estudio propio | MEDIO | "Puntajes crudos por dimensión (10–50) y visualización 0–100, que no constituye percentil." | "Medición percentilada / comparativa poblacional / alta precisión diagnóstica" | Manual de resultados para RH |

## Matriz 2 — Resultados a RH (portal RH, reportes, exports)

| Afirmación | Evidencia | Riesgo | Lenguaje permitido | Lenguaje prohibido | Documento donde deberá utilizarse |
|---|---|---|---|---|---|
| Naturaleza del resultado | Scoring oficial, sin normas | BAJO | "Tendencias de respuesta en 5 dimensiones; información técnica de apoyo." | "Veredicto de personalidad" / "perfil psicológico completo" | Vista de resultados RH, reportes PDF |
| No decisión automática | IPIP fuera de overall y recomendaciones | BAJO | Disclaimer literal: "Estos resultados describen tendencias de respuesta en las dimensiones evaluadas y constituyen información técnica de apoyo. No determinan por sí mismos la contratación o no contratación de una persona." | "Candidato recomendado/no recomendado por personalidad" | Toda pantalla y reporte con resultados IPIP |
| Interpretación de cifras | raw/50×100 | BAJO | "Escala 0–100 = representación visual del crudo; no es percentil." | "Percentil", "por encima del promedio", "nivel alto/medio/bajo" | Vista RH, tooltips, manuales |

## Matriz 3 — Comunicación al candidato (bienvenida, evaluación, resultados)

| Afirmación | Evidencia | Riesgo | Lenguaje permitido | Lenguaje prohibido | Documento donde deberá utilizarse |
|---|---|---|---|---|---|
| Título y encuadre | Título oficial v1.0 | BAJO | "Evaluación de Personalidad — Modelo Big Five" | "Prueba diagnóstica", "examen de aptitud" | Vista del candidato (ya implementado) |
| Confidencialidad | Instrucción oficial IPIP | BAJO | Instrucción de muestra IPIP renderizada (incluye "tus respuestas se mantendrán en absoluta confidencialidad") junto al aviso de privacidad aplicable. | Cualquier promesa de confidencialidad no cubierta por el aviso de privacidad vigente. | Transición de sección del candidato |
| Uso de resultados | Uso permitido | MEDIO | "Tus respuestas describen tendencias de respuesta y apoyan el proceso; no determinan por sí mismas una decisión." | "Con esto decidimos si te contratamos" / "define si eres apto" | Correos y pantallas al candidato |

## Matriz 4 — Contrato / términos con clientes

| Afirmación | Evidencia | Riesgo | Lenguaje permitido | Lenguaje prohibido | Documento donde deberá utilizarse |
|---|---|---|---|---|---|
| Objeto del módulo | Expediente completo | BAJO | "Módulo de evaluación de personalidad (Big Five, IPIP-50, versión mexicana documentada) como herramienta de apoyo informativo." | "Sistema de selección validado / garantía de contrataciones exitosas" | Contrato de prestación del servicio y anexos técnicos |
| Garantías | No hay garantía posible | ALTO (si se promete) | Sin garantías de resultados; limitaciones referenciadas (07-limitations.md) | "Garantiza identificación de los mejores candidatos" | Contrato, SLA |
| Propiedad intelectual | Dominio público IPIP + atribución | BAJO | "Reactivos IPIP (dominio público); traducción mexicana de Rodrigo de Oliveira; EvaluHR no reclama su autoría." | Atribución de reactivos/traducción a EvaluHR | Contrato, anexos, créditos |

## Matriz 5 — Afirmaciones transversales prohibidas (cualquier documento)

| Afirmación prohibida | Motivo documental |
|---|---|
| "Prueba validada para contratación en México" | No existe evidencia de criterio laboral (sección E). |
| "Predice el éxito laboral" | Idem. |
| "Determina qué candidato debe contratarse" | Contradice el disclaimer y el diseño (sin decisión automática). |
| "Diagnostica la personalidad" | No es instrumento de diagnóstico (limitación §5). |
| "Determina aptitud laboral" / "apto/no apto" | No hay baremos, cortes ni validez laboral. |
| "Certificado / certificación psicométrica" | No existe certificación alguna; prohibido inventarla. |
| "Percentiles / normas poblacionales" | No existen baremos propios ni comparativos. |
| "Validado por EvaluHR sobre sus datos" | No existe estudio propio; los datos demo no son evidencia. |

## Reglas finales

1. Cualquier texto nuevo (comercial o documental) debe poder rastrearse a una fila
   "lenguaje permitido" de estas matrices o al expediente; si no puede, no se publica.
2. Cuando se cite el estudio 2013, citarse siempre con su alcance: adaptación mexicana
   con evidencia publicada **en el contexto del estudio original**.
3. El disclaimer literal y la nota de no-percentil son **obligatorios** donde aparezcan
   resultados IPIP (ya implementado en la plataforma).
4. Prohibido afirmar obligaciones, certificaciones o validaciones inexistentes; las
   cuestiones legales específicas (laboral, datos personales, antidiscriminación)
   requieren asesoría profesional — este expediente solo fija la consistencia
   documental.

— FIN DE LA MATRIZ JURÍDICA DEL LENGUAJE —
